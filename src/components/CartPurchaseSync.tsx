'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { CART_CHANGED_EVENT, readCartSlugs, removePurchasedCartSlugs } from '@/lib/cart';

export function CartPurchaseSync() {
  const pathname = usePathname();
  useEffect(() => {
    const controller = new AbortController();
    let busy = false;
    async function refresh() {
      if (busy || document.visibilityState === 'hidden' || !readCartSlugs().length) return;
      busy = true;
      try {
        const response = await fetch('/api/cart/purchases', { cache: 'no-store', signal: controller.signal });
        if (!response.ok) return;
        const data = await response.json();
        if (!controller.signal.aborted && Array.isArray(data.slugs) && data.slugs.every((slug: unknown) => typeof slug === 'string')) {
          removePurchasedCartSlugs(data.slugs);
        }
      } catch { /* A failed lookup must never empty the cart. */ }
      finally { busy = false; }
    }
    void refresh();
    window.addEventListener('pageshow', refresh);
    window.addEventListener('focus', refresh);
    window.addEventListener(CART_CHANGED_EVENT, refresh);
    window.addEventListener('storage', refresh);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      controller.abort();
      window.removeEventListener('pageshow', refresh);
      window.removeEventListener('focus', refresh);
      window.removeEventListener(CART_CHANGED_EVENT, refresh);
      window.removeEventListener('storage', refresh);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, [pathname]);
  return null;
}
