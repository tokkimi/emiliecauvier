import Link from 'next/link';
import type { Metadata } from 'next';
import { BOOKS, COLLECTIONS, type Collection } from '@/data/books';
import { localizeBook, COLLECTIONS_EN, BOOKS_EN } from '@/data/booksEn';
import { getLocale, getT } from '@/lib/i18n';
import { CollectionShelf } from '@/components/CollectionShelf';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const metadata: Metadata = { title: 'Catalogue' };

export default async function CataloguePage({
  searchParams,
}: {
  searchParams: Promise<{ collection?: string; q?: string }>;
}) {
  const { collection, q } = await searchParams;
  const locale = await getLocale();
  const t = await getT();
  const session = await auth().catch(() => null);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  const favoriteRows = userId
    ? await prisma.favorite.findMany({ where: { userId }, include: { ebook: { select: { slug: true } } } }).catch(() => [])
    : [];
  const favoriteSlugs = new Set(favoriteRows.map((favorite) => favorite.ebook.slug));
  const collections = Object.keys(COLLECTIONS) as Collection[];
  const query = (q ?? '').toLowerCase().trim();
  const selectedCollection = collection && collection in COLLECTIONS ? (collection as Collection) : null;
  const col = (c: Collection) => (locale === 'en' ? COLLECTIONS_EN[c] ?? COLLECTIONS[c] : COLLECTIONS[c]);

  let books = BOOKS;
  if (selectedCollection) books = books.filter((b) => b.collection === selectedCollection);
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

      {/* Navigation par collection — une seule rangée, glissable au doigt sur mobile. */}
      <nav aria-label="Collections" className="-mx-5 mt-8 sm:mx-0">
        <p className="px-5 font-ui text-[0.68rem] uppercase tracking-[0.16em] text-[var(--color-gold)] sm:px-0">
          {t.cat_explore_by_collection}
        </p>
        <div className="mt-3 flex snap-x snap-mandatory gap-2 overflow-x-auto px-5 pb-2 font-ui text-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-0">
          <Link
            href="/catalogue"
            className={`min-h-11 shrink-0 snap-start whitespace-nowrap rounded-full border px-5 py-3 transition ${
              !selectedCollection
                ? 'border-[var(--color-bordeaux)] bg-[var(--color-bordeaux)] text-white shadow-sm'
                : 'border-[var(--color-sand)] bg-white hover:border-[var(--color-bordeaux)]'
            }`}
          >
            {t.cat_all} <span className="opacity-60">{BOOKS.length}</span>
          </Link>
          {collections.map((c) => {
            const n = BOOKS.filter((b) => b.collection === c).length;
            const active = collection === c;
            return (
              <Link
                key={c}
                href={`/catalogue?collection=${c}`}
                aria-current={active ? 'page' : undefined}
                className={`min-h-11 shrink-0 snap-start whitespace-nowrap rounded-full border px-5 py-3 transition ${
                  active
                    ? 'border-[var(--color-bordeaux)] bg-[var(--color-bordeaux)] text-white shadow-sm'
                    : 'border-[var(--color-sand)] bg-white hover:border-[var(--color-bordeaux)]'
                }`}
              >
                {col(c)} <span className="opacity-60">{n}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {selectedCollection ? (
        <CollectionShelf
          title={col(selectedCollection)}
          eyebrow={`${books.length} guides`}
          books={books.map((book) => ({ ...book, ...localizeBook(book, locale) }))}
          collectionHref="/catalogue"
          collectionLabel={col(selectedCollection)}
          favoriteSlugs={favoriteSlugs}
          loggedIn={Boolean(userId)}
          locale={locale}
        />
      ) : (
        collections.map((currentCollection) => {
          const collectionBooks = books.filter((book) => book.collection === currentCollection);
          return (
            <CollectionShelf
              key={currentCollection}
              title={col(currentCollection)}
              eyebrow={`${collectionBooks.length} guides`}
              books={collectionBooks.map((book) => ({ ...book, ...localizeBook(book, locale) }))}
              collectionHref={`/catalogue?collection=${currentCollection}`}
              collectionLabel={col(currentCollection)}
              favoriteSlugs={favoriteSlugs}
              loggedIn={Boolean(userId)}
              locale={locale}
            />
          );
        })
      )}

      {books.length === 0 && (
        <p className="mt-16 text-center font-body text-[var(--color-ink)]/60">{t.cat_none}</p>
      )}
    </div>
  );
}
