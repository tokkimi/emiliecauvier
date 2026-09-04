export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { bySlug, BOOKS, COLLECTIONS, type Collection } from '@/data/books';
import { localizeBook, COLLECTIONS_EN } from '@/data/booksEn';
import { formatPrice, BRAND } from '@/lib/format';
import { getLocale, getT } from '@/lib/i18n';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { hasAccess, canDownload } from '@/lib/entitlements';
import { BuyButtons } from '@/components/BuyButtons';
import { BookCover } from '@/components/BookCover';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const book = bySlug(slug);
  if (!book) return { title: 'Guide introuvable' };
  const loc = localizeBook(book, await getLocale());
  return { title: loc.title, description: loc.subtitle };
}

export default async function BookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const book = bySlug(slug);
  if (!book) notFound();

  const locale = await getLocale();
  const t = await getT();
  const loc = localizeBook(book, locale);
  const col = (c: Collection) => (locale === 'en' ? COLLECTIONS_EN[c] ?? COLLECTIONS[c] : COLLECTIONS[c]);

  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;

  // L'ebook doit exister en base pour connaître l'accès ; sinon on retombe sur le catalogue statique.
  const dbEbook = await prisma.ebook.findUnique({ where: { slug } }).catch(() => null);
  const access = dbEbook ? await hasAccess(userId, dbEbook.id) : false;
  const downloadable = dbEbook ? await canDownload(userId, dbEbook.id) : false;

  const related = BOOKS.filter((b) => b.collection === book.collection && b.slug !== slug).slice(0, 3);

  return (
    <div className="mx-auto max-w-5xl px-5 py-14">
      <Link href="/catalogue" className="font-ui text-sm text-[var(--color-bordeaux)] hover:underline">
        {t.book_back}
      </Link>

      <div className="mt-6 grid gap-12 lg:grid-cols-[1fr_320px]">
        <div>
          <span className="font-ui text-xs uppercase tracking-[0.16em] text-[var(--color-gold)]">
            {col(book.collection)} · {t.book_guide} n°{book.number}
          </span>
          <h1 className="mt-3 font-display text-4xl leading-tight text-[var(--color-ink)]">{loc.title}</h1>
          <p className="mt-3 font-body text-xl text-[var(--color-ink)]/70">{loc.subtitle}</p>

          <h2 className="mt-10 font-display text-2xl text-[var(--color-bordeaux)]">{t.book_program}</h2>
          <ol className="mt-4 space-y-2">
            {loc.chapters.map((c, i) => (
              <li key={i} className="flex gap-3 font-body">
                <span className="font-ui text-sm text-[var(--color-gold)]">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-[var(--color-ink)]/85">{c}</span>
              </li>
            ))}
          </ol>

          <div className="mt-10 rounded-2xl border border-[var(--color-sand)] bg-white p-6">
            <p className="font-ui text-xs uppercase tracking-[0.16em] text-[var(--color-gold)]">{t.book_preview_t}</p>
            <p className="mt-2 font-body text-[var(--color-ink)]/75">{t.book_preview_d}</p>
            <Link
              href={`/lire/${book.slug}?apercu=1`}
              className="mt-4 inline-block rounded-full border border-[var(--color-bordeaux)] px-5 py-2 font-ui text-sm text-[var(--color-bordeaux)] transition hover:bg-[var(--color-bordeaux)] hover:text-white"
            >
              {t.book_preview_cta}
            </Link>
          </div>
        </div>

        {/* Colonne d'achat */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <BookCover
            number={book.number}
            title={loc.title}
            collection={col(book.collection)}
            loading="eager"
            className="mx-auto mb-5 w-full max-w-[260px] rounded-2xl border border-[var(--color-sand)] shadow-sm"
          />
          <div className="rounded-2xl border border-[var(--color-sand)] bg-white p-7 shadow-sm">
            <p className="font-display text-3xl text-[var(--color-ink)]">{formatPrice(book.priceCents)}</p>
            <p className="mt-1 font-ui text-sm text-[var(--color-ink)]/60">{t.book_lifetime}</p>

            <BuyButtons slug={book.slug} hasAccess={access} canDownload={downloadable} loggedIn={Boolean(userId)} locale={locale} />

            <div className="mt-6 border-t border-[var(--color-sand)] pt-5">
              <p className="font-ui text-sm text-[var(--color-ink)]/70">
                {locale === 'en' ? 'Or ' : 'Ou '}
                <strong>{formatPrice(BRAND.subscriptionCents)}{t.per_month}</strong>
                {locale === 'en' ? ' to read the 48 guides online.' : ' pour lire les 48 guides en ligne.'}
              </p>
              <Link href="/inscription?plan=abonnement" className="mt-2 inline-block font-ui text-sm text-[var(--color-bordeaux)] hover:underline">
                {locale === 'en' ? 'Discover the subscription →' : 'Découvrir l’abonnement →'}
              </Link>
            </div>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-6 font-display text-2xl text-[var(--color-ink)]">{t.book_same_collection}</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {related.map((b) => {
              const rl = localizeBook(b, locale);
              return (
                <Link key={b.slug} href={`/livre/${b.slug}`} className="rounded-2xl border border-[var(--color-sand)] bg-white p-5 transition hover:shadow-md">
                  <h3 className="font-display text-lg text-[var(--color-bordeaux)]">{rl.title}</h3>
                  <p className="mt-1 font-body text-sm text-[var(--color-ink)]/65">{rl.subtitle}</p>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
