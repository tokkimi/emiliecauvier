import { NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { canDownload } from '@/lib/entitlements';
import { bySlug } from '@/data/books';

/**
 * Téléchargement du PDF, réservé aux utilisateurs ayant l'accès.
 * En dev, sert le fichier depuis public/pdf. En prod, si PDF_BUCKET_URL est
 * défini, on renverrait un lien signé du bucket (S3/R2) — laissé en TODO.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');
  if (!slug) return NextResponse.json({ error: 'slug manquant' }, { status: 400 });

  const book = bySlug(slug);
  if (!book) return NextResponse.json({ error: 'introuvable' }, { status: 404 });

  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return NextResponse.redirect(new URL(`/connexion?next=/livre/${slug}`, req.url));

  const ebook = await prisma.ebook.findUnique({ where: { slug } });
  if (!ebook) return NextResponse.json({ error: 'guide non publié' }, { status: 404 });

  // Le PDF est réservé à l'achat (unité/coffret/admin) — l'abonnement donne
  // seulement la lecture en ligne.
  const ok = await canDownload(userId, ebook.id);
  if (!ok) return NextResponse.redirect(new URL(`/livre/${slug}?pdf=achat`, req.url));

  // Journalise le téléchargement.
  await prisma.downloadEvent.create({
    data: {
      userId,
      ebookId: ebook.id,
      ip: req.headers.get('x-forwarded-for') ?? undefined,
    },
  });

  const bucket = process.env.PDF_BUCKET_URL;
  if (bucket) {
    // TODO: générer une URL signée à durée limitée vers le bucket.
    return NextResponse.redirect(`${bucket.replace(/\/$/, '')}/${ebook.pdfKey ?? book.pdf}`);
  }

  // Stockage local privé : storage/pdf/<fichier>.pdf (JAMAIS dans public/ —
  // sinon le PDF serait servi sans contrôle d'accès).
  const file = path.join(process.cwd(), 'storage', 'pdf', book.pdf);
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
      'Content-Disposition': `attachment; filename="${book.slug}.pdf"`,
      'Cache-Control': 'private, no-store',
    },
  });
}
