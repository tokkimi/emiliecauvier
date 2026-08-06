import Link from 'next/link';
import type { Metadata } from 'next';
import { BOOKS, COLLECTIONS, type Collection } from '@/data/books';
import { localizeBook, COLLECTIONS_EN, BOOKS_EN } from '@/data/booksEn';
import { formatPrice } from '@/lib/format';
import { getLocale, getT } from '@/lib/i18n';

export const metadata: Metadata = { title: 'Catalogue' };

export default async function CataloguePage({
  searchParams,
}: {
  searchParams: Promise<{ collection?: string; q?: string }>;
}) {
  const { collection, q } = await searchParams;
  const locale = await getLocale();
  const t = await getT();
  const collections = Object.keys(COLLECTIONS) as Collection[];
  const query = (q ?? '').toLowerCase().trim();
  const col = (c: Collection) => (locale === 'en' ? COLLECTIONS_EN[c] ?? COLLECTIONS[c] : COLLECTIONS[c]);

  let books = BOOKS;
  if (collection && collection in COLLECTIONS) books = books.filter((b) => b.collection === collection);
  if (query)
    books = books.filter((b) => {
      const en = BOOKS_EN[b.slug];
      const hay = [b.title, b.subtitle, en?.title ?? '', en?.subtitle ?? '', ...b.chapters].join(' ').toLowerCase();
      return hay.includes(query);
    });

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <p className="font-ui text-xs uppercase tracking-[0.2em] text-[var(--color-gold)]">{t.cat_eyebrow}</p>
      <h1 className="mt-2 font-display text-4xl text-[var(--color-ink)]">{t.cat_title}</h1>
      <p className="mt-3 max-w-2xl font-body text-[var(--color-ink)]/70">{t.cat_intro}</p>

      {/* Filtres */}
      <div className="mt-8 flex flex-wrap gap-2 font-ui text-sm">
        <Link
          href="/catalogue"
          className={`rounded-full border px-4 py-2 transition ${
            !collection ? 'border-[var(--color-bordeaux)] bg-[var(--color-bordeaux)] text-white' : 'border-[var(--color-sand)] bg-white'
          }`}
        >
          {t.cat_all} ({BOOKS.length})
        </Link>
        {collections.map((c) => {
          const n = BOOKS.filter((b) => b.collection === c).length;
          const active = collection === c;
          return (
            <Link
              key={c}
              href={`/catalogue?collection=${c}`}
              className={`rounded-full border px-4 py-2 transition ${
                active ? 'border-[var(--color-bordeaux)] bg-[var(--color-bordeaux)] text-white' : 'border-[var(--color-sand)] bg-white hover:border-[var(--color-bordeaux)]'
              }`}
            >
              {col(c)} ({n})
            </Link>
          );
        })}
      </div>

      {/* Grille */}
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {books.map((b) => {
          const loc = localizeBook(b, locale);
          return (
            <Link
              key={b.slug}
              href={`/livre/${b.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--color-sand)] bg-white transition hover:-translate-y-1 hover:shadow-lg"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/covers/${b.number}.jpg`}
                alt={`Couverture — ${loc.title}`}
                loading="lazy"
                className="aspect-[2/3] w-full border-b border-[var(--color-sand)] object-cover"
              />
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center justify-between">
                  <span className="font-ui text-[0.68rem] uppercase tracking-[0.16em] text-[var(--color-gold)]">
                    {col(b.collection)}
                  </span>
                  <span className="font-ui text-xs text-[var(--color-ink)]/40">n°{b.number}</span>
                </div>
                <h3 className="mt-2 font-display text-xl text-[var(--color-bordeaux)] group-hover:underline">
                  {loc.title}
                </h3>
                <p className="mt-2 flex-1 font-body text-sm text-[var(--color-ink)]/70">{loc.subtitle}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-ui text-sm font-medium">{formatPrice(b.priceCents)}</span>
                  <span className="font-ui text-xs text-[var(--color-ink)]/50">{b.chapters.length} {t.cat_chapters}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {books.length === 0 && (
        <p className="mt-16 text-center font-body text-[var(--color-ink)]/60">{t.cat_none}</p>
      )}
    </div>
  );
}
