'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { BookCover } from '@/components/BookCover';
import type { Locale } from '@/lib/i18n';

export type FeaturedItem = {
  slug: string;
  number: number;
  collectionLabel: string;
  title: string;
  subtitle: string;
  price: string;
};

/** Sélection de guides en défilement horizontal, avec deux flèches de chaque côté. */
export function FeaturedCarousel({ items, locale }: { items: FeaturedItem[]; locale: Locale }) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.85, 360), behavior: 'smooth' });
  };

  return (
    <div className="relative">
      {/* Flèche gauche */}
      <button
        type="button"
        aria-label={locale === 'en' ? 'Previous' : 'Précédent'}
        onClick={() => scroll(-1)}
        className="absolute -left-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--color-sand)] bg-white/90 text-[var(--color-bordeaux)] shadow-md backdrop-blur transition hover:bg-white sm:flex"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
      </button>

      <div
        ref={ref}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-3 pt-1 sm:gap-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((b) => (
          <Link
            key={b.slug}
            href={`/livre/${b.slug}`}
            className="group flex w-[calc((100%-12px)/2)] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-[var(--color-sand)] bg-white shadow-[0_3px_12px_rgba(46,31,24,0.025)] transition duration-300 hover:-translate-y-1 hover:shadow-md sm:w-[calc((100%-40px)/3)] lg:w-[calc((100%-60px)/4)]"
          >
            <BookCover
              number={b.number}
              title={b.title}
              collection={b.collectionLabel}
              locale={locale}
              className="w-full border-b border-[var(--color-sand)]"
            />
            <div className="flex flex-1 flex-col p-3 sm:p-5">
              <span className="font-ui text-[0.6rem] uppercase tracking-[0.12em] text-[var(--color-gold)] sm:text-[0.68rem]">
                {b.collectionLabel}
              </span>
              <h3 className="mt-2 font-display text-base leading-snug text-[var(--color-bordeaux)] underline-offset-4 group-hover:underline sm:text-xl">
                {b.title}
              </h3>
              <p className="mt-2 flex-1 font-body text-sm leading-snug text-[var(--color-ink)]/70">{b.subtitle}</p>
              <span className="mt-4 font-ui text-sm font-medium text-[var(--color-ink)]">{b.price}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Flèche droite */}
      <button
        type="button"
        aria-label={locale === 'en' ? 'Next' : 'Suivant'}
        onClick={() => scroll(1)}
        className="absolute -right-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--color-sand)] bg-white/90 text-[var(--color-bordeaux)] shadow-md backdrop-blur transition hover:bg-white sm:flex"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
      </button>
    </div>
  );
}
