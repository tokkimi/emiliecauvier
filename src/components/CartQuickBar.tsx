'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CART_CHANGED_EVENT, readCartSlugs } from '@/lib/cart';

export function CartQuickBar() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const refresh = () => setCount(readCartSlugs().length);
    refresh();
    window.addEventListener(CART_CHANGED_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(CART_CHANGED_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  if (!count) return null;

  return (
    <div className="fixed bottom-4 left-4 right-24 z-40 sm:bottom-6 sm:left-1/2 sm:right-auto sm:-translate-x-1/2">
      <Link
        href="/panier"
        className="flex min-h-12 items-center justify-between gap-4 rounded-full border border-white/50 bg-[var(--color-bordeaux)] px-5 font-ui text-sm font-medium text-white shadow-2xl backdrop-blur transition hover:bg-[var(--color-bordeaux-dark)] sm:min-w-[330px]"
      >
        <span>{count} guide{count > 1 ? 's' : ''} au panier</span>
        <span>Finaliser →</span>
      </Link>
    </div>
  );
}
