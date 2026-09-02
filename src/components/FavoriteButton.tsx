'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';

export function FavoriteButton({ slug, initialFavorite, loggedIn }: { slug: string; initialFavorite: boolean; loggedIn: boolean }) {
  const pathname = usePathname();
  const [favorite, setFavorite] = useState(initialFavorite);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    if (!loggedIn) {
      window.location.href = `/connexion?next=${encodeURIComponent(pathname)}`;
      return;
    }
    setBusy(true);
    try {
      const response = await fetch('/api/account/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      });
      const data = (await response.json()) as { favorite?: boolean };
      if (response.ok && typeof data.favorite === 'boolean') setFavorite(data.favorite);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      aria-pressed={favorite}
      aria-label={favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/90 text-[var(--color-bordeaux)] shadow-sm backdrop-blur transition hover:scale-105 disabled:opacity-60"
    >
      <svg width="21" height="21" viewBox="0 0 24 24" fill={favorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
      </svg>
    </button>
  );
}

