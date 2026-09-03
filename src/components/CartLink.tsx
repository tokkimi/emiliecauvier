'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CART_CHANGED_EVENT, readCartSlugs } from '@/lib/cart';

export function CartLink({ mobile = false }: { mobile?: boolean }) {
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

  if (mobile) {
    return (
      <Link href="/panier" className="rounded-lg px-2 py-2.5 text-[var(--color-ink)] hover:bg-white">
        Panier{count ? ` (${count})` : ''}
      </Link>
    );
  }

  return (
    <Link href="/panier" className="relative hover:text-[var(--color-bordeaux)]">
      Panier
      {count > 0 && (
        <span className="absolute -right-4 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-bordeaux)] px-1 text-[0.6rem] leading-none text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
