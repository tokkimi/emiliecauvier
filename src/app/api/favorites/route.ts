import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getFavoriteSlugs } from '@/lib/favorites';

async function currentUserId() {
  const session = await auth().catch(() => null);
  return (session?.user as { id?: string } | undefined)?.id ?? null;
}

/** Liste des favoris de l'utilisateur connecté (slugs). */
export async function GET() {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ loggedIn: false, slugs: [] });
  const slugs = await getFavoriteSlugs(userId);
  return NextResponse.json({ loggedIn: true, slugs });
}

/**
 * Ajoute / retire / bascule un favori.
 * Entrée : { slug, favorite? }. Si `favorite` est omis, on bascule l'état.
 * Renvoie { favorite } = état final.
 */
export async function POST(req: Request) {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ error: 'Connexion requise.' }, { status: 401 });

  let body: { slug?: string; favorite?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  const slug = typeof body.slug === 'string' ? body.slug : '';
  const ebook = await prisma.ebook.findUnique({ where: { slug }, select: { id: true } });
  if (!ebook) return NextResponse.json({ error: 'Guide introuvable.' }, { status: 404 });

  const existing = await prisma.favorite.findUnique({
    where: { userId_ebookId: { userId, ebookId: ebook.id } },
  });
  const want = typeof body.favorite === 'boolean' ? body.favorite : !existing;

  if (want && !existing) {
    await prisma.favorite.create({ data: { userId, ebookId: ebook.id } });
  } else if (!want && existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
  }

  return NextResponse.json({ favorite: want });
}
