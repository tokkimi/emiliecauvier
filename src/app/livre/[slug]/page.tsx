export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { bySlug, BOOKS, COLLECTIONS } from '@/data/books';
import { formatPrice, BRAND } from '@/lib/format';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { hasAccess } from '@/lib/entitlements';
import { BuyButtons } from '@/components/BuyButtons';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const book = bySlug(slug);
  if (!book) return { title: 'Guide introuvable' };
  return { title: book.title, description: book.subtitle };
}

export default async function BookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const book = bySlug(slug);
  if (!book) notFound();

  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;

  // L'ebook doit exister en base pour connaître l'accès ; sinon on retombe sur le catalogue statique.
  const dbEbook = await prisma.ebook.findUnique({ where: { slug } }).catch(() => null);
  const access = dbEbook ? await hasAccess(userId, dbEbook.id) : false;

  const related = BOOKS.filter((b) => b.collection === book.collection && b.slug !== slug).slice(0, 3);

  return (
    <div className="mx-auto max-w-5xl px-5 py-14">
      <Link href="/catalogue" className="font-ui text-sm text-[var(--color-bordeaux)] hover:underline">
        ← Catalogue
      </Link>

      <div className="mt-6 grid gap-12 lg:grid-cols-[1fr_320px]">
        <div>
          <span className="font-ui text-xs uppercase tracking-[0.16em] text-[var(--color-gold)]">
            {COLLECTIONS[book.collection]} · Guide n°{book.number}
          </span>
          <h1 className="mt-3 font-display text-4xl leading-tight text-[var(--color-ink)]">{book.title}</h1>
          <p className="mt-3 font-body text-xl text-[var(--color-ink)]/70">{book.subtitle}</p>

          <h2 className="mt-10 font-display text-2xl text-[var(--color-bordeaux)]">Au programme</h2>
          <ol className="mt-4 space-y-2">
            {book.chapters.map((c, i) => (
              <li key={i} className="flex gap-3 font-body">
                <span className="font-ui text-sm text-[var(--color-gold)]">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-[var(--color-ink)]/85">{c}</span>
              </li>
            ))}
          </ol>

          <div className="mt-10 rounded-2xl border border-[var(--color-sand)] bg-white p-6">
            <p className="font-ui text-xs uppercase tracking-[0.16em] text-[var(--color-gold)]">Aperçu gratuit</p>
            <p className="mt-2 font-body text-[var(--color-ink)]/75">
              Le premier chapitre est en lecture libre. Lisez-le avant d&apos;acheter.
            </p>
            <Link
              href={`/lire/${book.slug}?apercu=1`}
              className="mt-4 inline-block rounded-full border border-[var(--color-bordeaux)] px-5 py-2 font-ui text-sm text-[var(--color-bordeaux)] transition hover:bg-[var(--color-bordeaux)] hover:text-white"
            >
              Lire le 1ᵉʳ chapitre
            </Link>
          </div>
        </div>

        {/* Colonne d'achat */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-[var(--color-sand)] bg-white p-7 shadow-sm">
            <p className="font-display text-3xl text-[var(--color-ink)]">{formatPrice(book.priceCents)}</p>
            <p className="mt-1 font-ui text-sm text-[var(--color-ink)]/60">Accès à vie · lecture en ligne + PDF</p>

            <BuyButtons slug={book.slug} hasAccess={access} loggedIn={Boolean(userId)} />

            <div className="mt-6 border-t border-[var(--color-sand)] pt-5">
              <p className="font-ui text-sm text-[var(--color-ink)]/70">
                Ou <strong>{formatPrice(BRAND.subscriptionCents)}/mois</strong> pour les 50 guides.
              </p>
              <Link href="/inscription?plan=abonnement" className="mt-2 inline-block font-ui text-sm text-[var(--color-bordeaux)] hover:underline">
                Découvrir l&apos;abonnement →
              </Link>
            </div>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-6 font-display text-2xl text-[var(--color-ink)]">Dans la même collection</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {related.map((b) => (
              <Link key={b.slug} href={`/livre/${b.slug}`} className="rounded-2xl border border-[var(--color-sand)] bg-white p-5 transition hover:shadow-md">
                <h3 className="font-display text-lg text-[var(--color-bordeaux)]">{b.title}</h3>
                <p className="mt-1 font-body text-sm text-[var(--color-ink)]/65">{b.subtitle}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}