import { prisma } from '@/lib/db';

/**
 * Slugs des guides mis en favori par un utilisateur, du plus récent au plus ancien.
 * Utilisé côté serveur (page « Mon compte ») et par l'API des favoris.
 */
export async function getFavoriteSlugs(userId: string): Promise<string[]> {
  const rows = await prisma.favorite.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: { ebook: { select: { slug: true } } },
  });
  return rows.map((r) => r.ebook.slug);
}
