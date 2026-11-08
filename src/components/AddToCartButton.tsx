'use client';

import { useState } from 'react';
import { trackItems } from '@/lib/measurement-items';
import { addCartSlug, readCartSlugs } from '@/lib/cart';
import type { Locale } from '@/lib/i18n';

export function AddToCartButton({ slug, compact = false, locale }: { slug: string; compact?: boolean; locale: Locale }) {
  const [added, setAdded] = useState(false);

  function add() {
    if (!readCartSlugs().includes(slug)) trackItems('add_to_cart', [slug], locale);
    addCartSlug(slug);
    setAdded(true);
  }

  return (
    <button
      type="button"
      onClick={add}
      className={
        compact
          ? 'rounded-full border border-[var(--color-bordeaux)] px-3 py-2 font-ui text-xs text-[var(--color-bordeaux)] transition hover:bg-[var(--color-sand)]'
          : 'w-full rounded-full border border-[var(--color-bordeaux)] py-2.5 font-ui text-xs font-medium text-[var(--color-bordeaux)] transition hover:bg-[var(--color-sand)]'
      }
    >
      {added ? (locale === 'en' ? 'Added' : 'Ajouté') : (locale === 'en' ? 'Add to cart' : 'Ajouter au panier')}
    </button>
  );
}
