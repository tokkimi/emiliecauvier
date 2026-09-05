import { prisma } from './db';

/**
 * Un utilisateur a accès à un ebook s'il :
 *  - possède un abonnement actif (et l'ebook est inclus dans l'abonnement), OU
 *  - a acheté l'ebook à l'unité (Purchase PAID), OU
 *  - a acheté un coffret couvrant cet ebook.
 */
export async function hasAccess(userId: string | undefined, ebookId: string): Promise<boolean> {
  if (!userId) return false;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, subscriptionStatus: true, currentPeriodEnd: true },
  });
  if (!user) return false;
  if (user.role === 'ADMIN') return true;

  const ebook = await prisma.ebook.findUnique({
    where: { id: ebookId },
    select: { includedInSubscription: true },
  });

  const subActive =
    (user.subscriptionStatus === 'ACTIVE' || user.subscriptionStatus === 'TRIALING') &&
    (!user.currentPeriodEnd || user.currentPeriodEnd > new Date());

  if (subActive && ebook?.includedInSubscription) return true;

  const purchase = await prisma.purchase.findFirst({
    where: {
      userId,
      status: 'PAID',
      OR: [{ ebookId }, { type: 'BUNDLE' }],
    },
    select: { id: true },
  });
  return Boolean(purchase);
}

/**
 * Droit de TÉLÉCHARGER le PDF. Volontairement plus restrictif que `hasAccess` :
 * l'abonnement donne la lecture en ligne mais PAS le PDF (sinon un mois
 * d'abonnement suffirait à tout télécharger). Le PDF est réservé à :
 *  - un administrateur, OU
 *  - un achat à l'unité de cet ebook (Purchase PAID), OU
 *  - un achat de coffret (BUNDLE).
 */
export async function canDownload(userId: string | undefined, ebookId: string): Promise<boolean> {
  if (!userId) return false;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  if (!user) return false;
  if (user.role === 'ADMIN') return true;

  const purchase = await prisma.purchase.findFirst({
    where: {
      userId,
      status: 'PAID',
      OR: [{ ebookId }, { type: 'BUNDLE' }],
    },
    select: { id: true },
  });
  return Boolean(purchase);
}

/** Ids d'ebooks TÉLÉCHARGEABLES (achat à l'unité / coffret / admin) — hors abonnement. */
export async function downloadableEbookIds(userId: string | undefined): Promise<Set<string>> {
  if (!userId) return new Set();
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  if (!user) return new Set();

  if (user.role === 'ADMIN') {
    const all = await prisma.ebook.findMany({ select: { id: true } });
    return new Set(all.map((e) => e.id));
  }

  const ids = new Set<string>();
  const purchases = await prisma.purchase.findMany({
    where: { userId, status: 'PAID' },
    select: { ebookId: true, type: true },
  });
  const hasBundle = purchases.some((p) => p.type === 'BUNDLE');
  if (hasBundle) {
    const all = await prisma.ebook.findMany({ select: { id: true } });
    all.forEach((e) => ids.add(e.id));
  }
  purchases.forEach((p) => p.ebookId && ids.add(p.ebookId));
  return ids;
}

/**
 * Langues (éditions PDF) TÉLÉCHARGEABLES par l'utilisateur pour cet ebook.
 * Une édition = un achat. Admin et coffret donnent les deux langues.
 */
export async function ownedDownloadLangs(
  userId: string | undefined,
  ebookId: string,
): Promise<Set<'fr' | 'en'>> {
  const langs = new Set<'fr' | 'en'>();
  if (!userId) return langs;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  if (!user) return langs;
  if (user.role === 'ADMIN') return new Set(['fr', 'en']);

  const purchases = await prisma.purchase.findMany({
    where: { userId, status: 'PAID', OR: [{ ebookId }, { type: 'BUNDLE' }] },
    select: { type: true, language: true },
  });
  for (const p of purchases) {
    if (p.type === 'BUNDLE') return new Set(['fr', 'en']);
    langs.add(p.language === 'en' ? 'en' : 'fr');
  }
  return langs;
}

export async function subscriptionActive(userId: string | undefined): Promise<boolean> {
  if (!userId) return false;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { subscriptionStatus: true, currentPeriodEnd: true, role: true },
  });
  if (!user) return false;
  if (user.role === 'ADMIN') return true;
  return (
    (user.subscriptionStatus === 'ACTIVE' || user.subscriptionStatus === 'TRIALING') &&
    (!user.currentPeriodEnd || user.currentPeriodEnd > new Date())
  );
}

/** Renvoie l'ensemble des ids d'ebooks accessibles par l'utilisateur (pour le tableau de bord). */
export async function accessibleEbookIds(userId: string | undefined): Promise<Set<string>> {
  if (!userId) return new Set();
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, subscriptionStatus: true, currentPeriodEnd: true },
  });
  if (!user) return new Set();

  if (user.role === 'ADMIN') {
    const all = await prisma.ebook.findMany({ select: { id: true } });
    return new Set(all.map((e) => e.id));
  }

  const ids = new Set<string>();
  const subActive =
    (user.subscriptionStatus === 'ACTIVE' || user.subscriptionStatus === 'TRIALING') &&
    (!user.currentPeriodEnd || user.currentPeriodEnd > new Date());
  if (subActive) {
    const inc = await prisma.ebook.findMany({
      where: { includedInSubscription: true },
      select: { id: true },
    });
    inc.forEach((e) => ids.add(e.id));
  }

  const purchases = await prisma.purchase.findMany({
    where: { userId, status: 'PAID' },
    select: { ebookId: true, type: true },
  });
  const hasBundle = purchases.some((p) => p.type === 'BUNDLE');
  if (hasBundle) {
    const all = await prisma.ebook.findMany({ select: { id: true } });
    all.forEach((e) => ids.add(e.id));
  }
  purchases.forEach((p) => p.ebookId && ids.add(p.ebookId));
  return ids;
}
