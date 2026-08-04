import Link from 'next/link';
import type { Metadata } from 'next';
import { BOOKS, COLLECTIONS, type Collection } from '@/data/books';
import { formatPrice } from '@/lib/format';

export const metadata: Metadata = { title: 'Catalogue des 50 guides' };

export default async function CataloguePage({
  searchParams,
}: {
  searchParams: Promise<{ collection?: string; q?: string }>;
}) {
  const { collection, q } = await searchParams;
  const collections = Object.keys(COLLECTIONS) as Collection[];
  const query = (q ?? '').toLowerCase().trim();

  let books = BOOKS;
  if (collection && collection in COLLECTIONS) books = books.filter((b) => b.collection === collection);
  if (query)
    books = books.filter(
      (b) =>
        b.title.toLowerCase().includes(query) ||
        b.subtitle.toLowerCase().includes(query) ||
        b.chapters.some((c) => c.toLowerCase().includes(query)),
    );

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <p className="font-ui text-xs uppercase tracking-[0.2em] text-[var(--color-gold)]">La Bibliothèque</p>
      <h1 className="mt-2 font-display text-4xl text-[var(--color-ink)]">Les 50 guides</h1>
      <p className="mt-3 max-w-2xl font-body text-[var(--color-ink)]/70">
        Chaque guide se lit en ligne (menu de chapitres) et se télécharge en PDF. À l&apos;unité ou via l&apos;abonnement.
      </p>

      {/* Filtres */}
      <div className="mt-8 flex flex-wrap gap-2 font-ui text-sm">
        <Link
          href="/catalogue"
          className={`rounded-full border px-4 py-2 transition ${
            !collection ? 'border-[var(--color-bordeaux)] bg-[var(--color-bordeaux)] text-white' : 'border-[var(--color-sand)] bg-white'
          }`}
        >
          Tout ({BOOKS.length})
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
              {COLLECTIONS[c]} ({n})
            </Link>
          );
        })}
      </div>

      {/* Grille */}
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {books.map((b) => (
          <Link
            key={b.slug}
            href={`/livre/${b.slug}`}
            className="group flex flex-col rounded-2xl border border-[var(--color-sand)] bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <span className="font-ui text-[0.68rem] uppercase tracking-[0.16em] text-[var(--color-gold)]">
                {COLLECTIONS[b.collection]}
              </span>
              <span className="font-ui text-xs text-[var(--color-ink)]/40">n°{b.number}</span>
            </div>
            <h3 className="mt-2 font-display text-xl text-[var(--color-bordeaux)] group-hover:underline">
              {b.title}
            </h3>
            <p className="mt-2 flex-1 font-body text-sm text-[var(--color-ink)]/70">{b.subtitle}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="font-ui text-sm font-medium">{formatPrice(b.priceCents)}</span>
              <span className="font-ui text-xs text-[var(--color-ink)]/50">{b.chapters.length} chapitres</span>
            </div>
          </Link>
        ))}
      </div>

      {books.length === 0 && (
        <p className="mt-16 text-center font-body text-[var(--color-ink)]/60">Aucun guide ne correspond.</p>
      )}
    </div>
  );
}
