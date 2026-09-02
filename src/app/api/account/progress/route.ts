import { NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { bySlug } from '@/data/books';
import { loadReaderContent } from '@/lib/reader';
import { hasAccess } from '@/lib/entitlements';

const progressSchema = z.object({
  slug: z.string().min(1).max(160),
  chapterIndex: z.number().int().nonnegative(),
});

export async function POST(req: Request) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });

  const parsed = progressSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Progression invalide.' }, { status: 400 });

  const book = bySlug(parsed.data.slug);
  const content = book ? loadReaderContent(book.number) : null;
  const ebook = book ? await prisma.ebook.findUnique({ where: { slug: book.slug } }) : null;
  if (!book || !content || !ebook) return NextResponse.json({ error: 'Guide introuvable.' }, { status: 404 });
  if (!(await hasAccess(userId, ebook.id))) {
    return NextResponse.json({ error: 'Accès requis.' }, { status: 403 });
  }

  const chapterCount = content.chapters.length;
  const chapterIndex = Math.min(parsed.data.chapterIndex, Math.max(0, chapterCount - 1));
  const completed = chapterIndex === chapterCount - 1;

  const progress = await prisma.readingProgress.upsert({
    where: { userId_ebookId: { userId, ebookId: ebook.id } },
    create: { userId, ebookId: ebook.id, chapterIndex, chapterCount, completed },
    update: { chapterIndex, chapterCount, completed },
    select: { chapterIndex: true, chapterCount: true, completed: true, updatedAt: true },
  });

  return NextResponse.json({ progress });
}
