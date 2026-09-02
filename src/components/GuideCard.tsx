'use client';

import Link from 'next/link';
import { BookCover } from '@/components/BookCover';
import { FavoriteHeart } from '@/components/Favorites';

export type GuideCardData = {
  slug: string;
  number: number;
  collectionLabel: string;
  title: string;
  subtitle?: string;
  price: string;
  chaptersLabel?: string;
};

/** Carte de guide : couverture + cœur (favori) + libellé, titre et prix. */
export function GuideCard({ b }: { b: GuideCardData }) {
  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--color-sand)] bg-white transition hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/livre/${b.slug}`} className="flex flex-1 flex-col">
        <BookCover
          number={b.number}
          title={b.title}
          collection={b.collectionLabel}
          className="w-full border-b border-[var(--color-sand)]"
        />
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <span className="font-ui text-[0.62rem] uppercase tracking-[0.16em] text-[var(--color-gold)] sm:text-[0.68rem]">
            {b.collectionLabel}
          </span>
          <h3 className="mt-1.5 font-display text-base leading-snug text-[var(--color-bordeaux)] group-hover:underline sm:text-lg">
            {b.title}
          </h3>
          {b.subtitle && (
            <p className="mt-1.5 line-clamp-2 flex-1 font-body text-xs text-[var(--color-ink)]/60 sm:text-sm">
              {b.subtitle}
            </p>
          )}
          <div className="mt-3 flex items-center justify-between">
            <span className="font-ui text-sm font-medium text-[var(--color-ink)]">{b.price}</span>
            {b.chaptersLabel && (
              <span className="font-ui text-[0.7rem] text-[var(--color-ink)]/45">{b.chaptersLabel}</span>
            )}
          </div>
        </div>
      </Link>
      <FavoriteHeart slug={b.slug} className="absolute right-3 top-3" />
    </div>
  );
}
