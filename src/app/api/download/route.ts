import { NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { ownedDownloadLangs } from '@/lib/entitlements';
import { bySlug } from '@/data/books';
import { cookies } from 'next/headers';
import { GUEST_PURCHASE_COOKIE, guestOwnedLangs } from '@/lib/guestPurchase';
import { verifyPurchaseDownloadToken } from '@/lib/purchaseDownloadToken';
import { getLocale } from '@/lib/i18n';

/**
 * Téléchargement du PDF, réservé aux utilisateurs ayant l'accès.
 * Le PDF est servi dans la langue ACHETÉE (une édition = un achat) :
 * français depuis storage/pdf/<fichier>.pdf, anglais depuis
 * storage/pdf/en/<fichier>.pdf. En dev, sert le fichier local ; en prod, si
 * PDF_BUCKET_URL est défini, on renvoie un lien vers le bucket.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');
  if (!slug) return NextResponse.json({ error: 'slug manquant' }, { status: 400 });

  const book = bySlug(slug);
  if (!book) return NextResponse.json({ error: 'introuvable' }, { status: 404 });

  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;

  const ebook = await prisma.ebook.findUnique({ where: { slug } });
  if (!ebook) return NextResponse.json({ error: 'guide non publié' }, { status: 404 });

  // Le PDF est réservé à l'achat (unité/coffret/admin) — l'abonnement donne
  // seulement la lecture en ligne. On collecte ici les LANGUES possédées.
  const guestLibrary = (await cookies()).get(GUEST_PURCHASE_COOKIE)?.value;
  const ownedLangs = new Set<'fr' | 'en'>();

  // 1) Lien signé reçu par email → langue de la commande.
  const purchaseId = searchParams.get('purchase');
  const token = searchParams.get('token');
  if (purchaseId && verifyPurchaseDownloadToken(token, purchaseId, ebook.id)) {
    const purchase = await prisma.purchase.findFirst({
      where: { id: purchaseId, ebookId: ebook.id, status: 'PAID' },
      select: { language: true },
    });
    if (purchase) ownedLangs.add(purchase.language === 'en' ? 'en' : 'fr');
  }

  // 2) Achats invité (cookie signé).
  for (const l of guestOwnedLangs(guestLibrary, ebook.id)) ownedLangs.add(l);

  // 3) Achats du compte connecté (unité / coffret / admin).
  for (const l of await ownedDownloadLangs(userId, ebook.id)) ownedLangs.add(l);

  if (ownedLangs.size === 0) return NextResponse.redirect(new URL(`/livre/${slug}?pdf=achat`, req.url));

  // Langue servie : celle demandée si possédée, sinon la langue du site, sinon
  // la seule édition possédée.
  const requested = searchParams.get('lang');
  const siteLocale = await getLocale();
  let lang: 'fr' | 'en';
  if (requested === 'en' && ownedLangs.has('en')) lang = 'en';
  else if (requested === 'fr' && ownedLangs.has('fr')) lang = 'fr';
  else if (ownedLangs.has(siteLocale)) lang = siteLocale;
  else lang = ownedLangs.has('en') ? 'en' : 'fr';

  // Journalise le téléchargement.
  if (userId) {
    await prisma.downloadEvent.create({
      data: {
        userId,
        ebookId: ebook.id,
        ip: req.headers.get('x-forwarded-for') ?? undefined,
      },
    });
  }

  const baseName = ebook.pdfKey ?? book.pdf;
  const bucket = process.env.PDF_BUCKET_URL;
  if (bucket) {
    // URL vers le bucket : les éditions anglaises sont sous en/.
    const key = lang === 'en' ? `en/${baseName}` : baseName;
    return NextResponse.redirect(`${bucket.replace(/\/$/, '')}/${key}`);
  }

  // Stockage local privé : storage/pdf/<fichier>.pdf (FR) ou storage/pdf/en/
  // <fichier>.pdf (EN) — JAMAIS dans public/ (contrôle d'accès obligatoire).
  const file =
    lang === 'en'
      ? path.join(process.cwd(), 'storage', 'pdf', 'en', baseName)
      : path.join(process.cwd(), 'storage', 'pdf', baseName);
  if (!fs.existsSync(file)) {
    return NextResponse.json(
      { error: 'PDF non disponible sur ce serveur. Déposez-le dans storage/pdf ou configurez PDF_BUCKET_URL.' },
      { status: 404 },
    );
  }
  const data = fs.readFileSync(file);
  return new NextResponse(new Uint8Array(data), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${book.slug}${lang === 'en' ? '-en' : ''}.pdf"`,
      'Cache-Control': 'private, no-store',
    },
  });
}
