import Link from 'next/link';
import type { Metadata } from 'next';
import { BOOKS, COLLECTIONS, type Collection } from '@/data/books';
import { localizeBook, COLLECTIONS_EN, BOOKS_EN } from '@/data/booksEn';
import { formatPrice } from '@/lib/format';
import { getLocale, getT } from '@/lib/i18n';
import { GuideCard, type GuideCardData } from '@/components/GuideCard';
import { CategoryRow } from '@/components/CategoryRow';

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

  const toCard = (b: (typeof BOOKS)[number]): GuideCardData => {
    const loc = localizeBook(b, locale);
    return {
      slug: b.slug,
      number: b.number,
      collectionLabel: col(b.collection),
      title: loc.title,
      subtitle: loc.subtitle,
      price: formatPrice(b.priceCents),
      chaptersLabel: `${b.chapters.length} ${t.cat_chapters}`,
    };
  };

  const activeCollection = collection && collection in COLLECTIONS ? (collection as Collection) : null;

  let filtered = BOOKS;
  if (activeCollection) filtered = filtered.filter((b) => b.collection === activeCollection);
  if (query)
    filtered = filtered.filter((b) => {
      const en = BOOKS_EN[b.slug];
      const hay = [b.title, b.subtitle, en?.title ?? '', en?.subtitle ?? '', ...b.chapters].join(' ').toLowerCase();
      return hay.includes(query);
    });

  // Vue par défaut (aucun filtre) : une rangée horizontale par collection.
  const showRows = !activeCollection && !query;

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
            !activeCollection ? 'border-[var(--color-bordeaux)] bg-[var(--color-bordeaux)] text-white' : 'border-[var(--color-sand)] bg-white hover:border-[var(--color-bordeaux)]'
          }`}
        >
          {t.cat_all} ({BOOKS.length})
        </Link>
        {collections.map((c) => {
          const n = BOOKS.filter((b) => b.collection === c).length;
          const active = activeCollection === c;
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

      {showRows ? (
        // Rangées par catégorie (défilement horizontal + « Voir plus »)
        <div>
          {collections.map((c) => {
            const items = BOOKS.filter((b) => b.collection === c).map(toCard);
            return (
              <CategoryRow
                key={c}
                title={col(c)}
                href={`/catalogue?collection=${c}`}
                seeMoreLabel={t.home_see_all ?? 'Voir plus'}
                items={items}
              />
            );
          })}
        </div>
      ) : (
        // Vue filtrée / recherche : grille 4 colonnes (2 sur mobile)
        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {filtered.map((b) => (
            <GuideCard key={b.slug} b={toCard(b)} />
          ))}
        </div>
      )}

      {!showRows && filtered.length === 0 && (
        <p className="mt-16 text-center font-body text-[var(--color-ink)]/60">{t.cat_none}</p>
      )}
    </div>
  );
}
