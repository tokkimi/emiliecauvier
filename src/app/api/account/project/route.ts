import { NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { recommendBooks } from '@/lib/recommendations';

const schema = z.object({
  stage: z.enum(['acheter', 'vendre', 'investir', 'proprietaire', 'marche']),
  area: z.enum(['montreal', 'laval-rive-nord', 'ailleurs']),
  propertyType: z.enum(['condo', 'maison', 'plex', 'indecis']),
  budget: z.enum(['moins-500', '500-700', '700-plus', 'indecis']),
});

export async function POST(req: Request) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: 'Connexion requise.' }, { status: 401 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Parcours invalide.' }, { status: 400 });
  const recommendations = recommendBooks(parsed.data);
  const ebooks = await prisma.ebook.findMany({
    where: { slug: { in: recommendations.map((book) => book.slug) } },
    select: { id: true },
  });

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: {
        projectStage: parsed.data.stage,
        projectArea: parsed.data.area,
        propertyType: parsed.data.propertyType,
        budgetRange: parsed.data.budget,
      },
    }),
    ...ebooks.map((ebook) =>
      prisma.favorite.upsert({
        where: { userId_ebookId: { userId, ebookId: ebook.id } },
        create: { userId, ebookId: ebook.id },
        update: {},
      }),
    ),
  ]);

  return NextResponse.json({ ok: true, count: recommendations.length });
}

