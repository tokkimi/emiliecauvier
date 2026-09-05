import Link from 'next/link';
import { BookCover } from '@/components/BookCover';
import { FavoriteButton } from '@/components/FavoriteButton';
import { formatPrice } from '@/lib/format';
import type { Book } from '@/data/books';
import { AddToCartButton } from '@/components/AddToCartButton';
import type { Locale } from '@/lib/i18n';

const cardWidth = 'basis-[calc((100%_-_0.75rem)/2)] sm:basis-[calc((100%_-_2rem)/3)] lg:basis-[calc((100%_-_3rem)/4)]';

export function CollectionShelf({
  title,
  eyebrow,
  books,
  collectionHref,
  collectionLabel,
  favoriteSlugs,
  loggedIn,
  locale,
}: {
  title: string;
  eyebrow?: string;
  books: Book[];
  collectionHref: string;
  collectionLabel: string;
  favoriteSlugs: Set<string>;
  loggedIn: boolean;
  locale: Locale;
}) {
  return (
    <section className="mt-12 first:mt-10">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          {eyebrow && <p className="font-ui text-[0.66rem] uppercase tracking-[0.18em] text-[var(--color-gold)]">{eyebrow}</p>}
          <h2 className="mt-1 font-display text-2xl text-[var(--color-ink)] sm:text-3xl">{title}</h2>
        </div>
        <Link href={collectionHref} className="shrink-0 font-ui text-xs text-[var(--color-bordeaux)] hover:underline sm:text-sm">{locale === 'en' ? 'View all →' : 'Voir tout →'}</Link>
      </div>

      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 sm:gap-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {books.map((book) => (
          <article key={book.slug} className={`group relative flex min-w-0 shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-[var(--color-sand)] bg-white shadow-[0_8px_30px_rgba(46,31,24,0.05)] transition hover:-translate-y-1 hover:shadow-lg ${cardWidth}`}>
            <div className="relative">
              <Link href={`/livre/${book.slug}`} className="block">
                <BookCover number={book.number} title={book.title} collection={collectionLabel} locale={locale} className="w-full border-b border-[var(--color-sand)]" />
              </Link>
              <div className="absolute bottom-3 right-3">
                <FavoriteButton slug={book.slug} initialFavorite={favoriteSlugs.has(book.slug)} loggedIn={loggedIn} locale={locale} />
              </div>
            </div>
            <Link href={`/livre/${book.slug}`} className="flex min-h-44 flex-1 flex-col p-4 sm:p-5">
              <p className="font-ui text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-gold)]">{collectionLabel} · {locale === 'en' ? 'No.' : 'n°'}{book.number}</p>
              <h3 className="mt-2 font-display text-lg leading-tight text-[var(--color-bordeaux)] group-hover:underline sm:text-xl">{book.title}</h3>
              <p className="mt-2 line-clamp-2 font-body text-sm text-[var(--color-ink)]/65">{book.subtitle}</p>
              <p className="mt-auto pt-4 font-display text-xl text-[var(--color-ink)]">{formatPrice(book.priceCents)}</p>
            </Link>
            <div className="mt-auto px-4 pb-4 sm:px-5 sm:pb-5">
              <AddToCartButton slug={book.slug} locale={locale} />
            </div>
          </article>
        ))}

        <Link href={collectionHref} className={`flex shrink-0 snap-start flex-col items-center justify-center rounded-2xl border border-[var(--color-gold)]/40 bg-[#f7f3ed] px-5 text-center text-[var(--color-bordeaux)] transition hover:border-[var(--color-gold)] hover:bg-white ${cardWidth}`}>
          <span className="font-display text-4xl">→</span>
          <span className="mt-3 font-ui text-xs font-semibold uppercase tracking-[0.14em]">{locale === 'en' ? 'View the full collection' : 'Voir toute la collection'}</span>
        </Link>
      </div>
    </section>
  );
}
