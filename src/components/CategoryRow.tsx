'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { GuideCard, type GuideCardData } from '@/components/GuideCard';

/**
 * Une rangée de catégorie : titre + défilement horizontal des guides
 * (≈ 4 visibles sur ordinateur, 2 sur mobile) + carte « Voir plus ».
 */
export function CategoryRow({
  title,
  href,
  seeMoreLabel = 'Voir plus',
  items,
}: {
  title: string;
  href: string;
  seeMoreLabel?: string;
  items: GuideCardData[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  if (items.length === 0) return null;

  return (
    <section className="relative mt-12 first:mt-8">
      <div className="mb-4 flex items-end justify-between gap-4">
        <h2 className="font-display text-2xl text-[var(--color-ink)] sm:text-3xl">{title}</h2>
        <Link href={href} className="shrink-0 font-ui text-sm text-[var(--color-bordeaux)] hover:underline">
          {seeMoreLabel} →
        </Link>
      </div>

      <div className="relative">
        <button
          type="button"
          aria-label="Précédent"
          onClick={() => scroll(-1)}
          className="absolute -left-3 top-[38%] z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--color-sand)] bg-white/90 text-[var(--color-bordeaux)] shadow-md backdrop-blur transition hover:bg-white lg:flex"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
        </button>

        <div
          ref={ref}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 sm:gap-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((b) => (
            <div
              key={b.slug}
              className="w-[46vw] max-w-[280px] shrink-0 snap-start sm:w-[52vw] md:w-[calc((100%-3rem)/3)] lg:w-[calc((100%-3.75rem)/4)]"
            >
              <GuideCard b={b} />
            </div>
          ))}

          {/* Carte « Voir plus » en fin de rangée */}
          <Link
            href={href}
            className="flex w-[46vw] max-w-[280px] shrink-0 snap-start flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[var(--color-gold)]/50 bg-[var(--color-cream)] text-[var(--color-bordeaux)] transition hover:border-[var(--color-gold)] hover:bg-[var(--color-sand)] sm:w-[52vw] md:w-[calc((100%-3rem)/3)] lg:w-[calc((100%-3.75rem)/4)]"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-gold)]/60">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
            </span>
            <span className="font-ui text-sm font-medium uppercase tracking-[0.12em]">{seeMoreLabel}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
