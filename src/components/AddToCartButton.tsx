'use client';

import { useState } from 'react';
import { addCartSlug } from '@/lib/cart';

export function AddToCartButton({ slug, compact = false }: { slug: string; compact?: boolean }) {
  const [added, setAdded] = useState(false);

  function add() {
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
      {added ? 'Ajouté' : 'Ajouter au panier'}
    </button>
  );
}
