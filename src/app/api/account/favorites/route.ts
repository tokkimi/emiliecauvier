import { NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

const schema = z.object({ slug: z.string().min(1).max(160) });

export async function POST(req: Request) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: 'Connexion requise.' }, { status: 401 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Guide invalide.' }, { status: 400 });
  const ebook = await prisma.ebook.findUnique({ where: { slug: parsed.data.slug }, select: { id: true } });
  if (!ebook) return NextResponse.json({ error: 'Guide introuvable.' }, { status: 404 });

  const existing = await prisma.favorite.findUnique({
    where: { userId_ebookId: { userId, ebookId: ebook.id } },
    select: { id: true },
  });
  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    return NextResponse.json({ favorite: false });
  }
  await prisma.favorite.create({ data: { userId, ebookId: ebook.id } });
  return NextResponse.json({ favorite: true });
}

