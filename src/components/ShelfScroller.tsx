'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

export function ShelfScroller({ children, locale }: { children: ReactNode; locale: 'fr' | 'en' }) {
  const rail = useRef<HTMLDivElement>(null);
  const [canGoLeft, setCanGoLeft] = useState(false);
  const [canGoRight, setCanGoRight] = useState(true);

  const updateButtons = useCallback(() => {
    const element = rail.current;
    if (!element) return;
    setCanGoLeft(element.scrollLeft > 6);
    setCanGoRight(element.scrollLeft + element.clientWidth < element.scrollWidth - 6);
  }, []);

  useEffect(() => {
    updateButtons();
    const element = rail.current;
    if (!element) return;
    const resize = new ResizeObserver(updateButtons);
    resize.observe(element);
    return () => resize.disconnect();
  }, [updateButtons]);

  function move(direction: -1 | 1) {
    const element = rail.current;
    if (!element) return;
    element.scrollBy({ left: direction * element.clientWidth * 0.9, behavior: 'smooth' });
  }

  return <div className="relative">
    <button
      type="button"
      onClick={() => move(-1)}
      disabled={!canGoLeft}
      aria-label={locale === 'en' ? 'Previous guides' : 'Voir les guides précédents'}
      className="absolute left-2 top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-[var(--color-gold)]/45 bg-white/95 font-display text-2xl text-[var(--color-bordeaux)] shadow-lg backdrop-blur transition hover:scale-105 disabled:pointer-events-none disabled:opacity-0"
    >←</button>
    <div
      ref={rail}
      onScroll={updateButtons}
      className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 sm:gap-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >{children}</div>
    <button
      type="button"
      onClick={() => move(1)}
      disabled={!canGoRight}
      aria-label={locale === 'en' ? 'Next guides' : 'Voir les guides suivants'}
      className="absolute right-2 top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-[var(--color-gold)]/45 bg-white/95 font-display text-2xl text-[var(--color-bordeaux)] shadow-lg backdrop-blur transition hover:scale-105 disabled:pointer-events-none disabled:opacity-0"
    >→</button>
  </div>;
}
