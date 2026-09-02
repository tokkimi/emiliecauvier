'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

type Ctx = {
  loggedIn: boolean | null; // null = pas encore chargé
  isFavorite: (slug: string) => boolean;
  toggle: (slug: string) => void;
  count: number;
};

const FavoritesContext = createContext<Ctx | null>(null);

/**
 * Fournit l'état des favoris à toute l'app (cœurs sur les cartes).
 * Charge une fois la liste au montage. Les visiteurs non connectés sont
 * redirigés vers la connexion au premier clic sur un cœur.
 */
export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [slugs, setSlugs] = useState<Set<string>>(new Set());
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let alive = true;
    fetch('/api/favorites')
      .then((r) => (r.ok ? r.json() : { loggedIn: false, slugs: [] }))
      .then((data: { loggedIn?: boolean; slugs?: string[] }) => {
        if (!alive) return;
        setLoggedIn(Boolean(data.loggedIn));
        setSlugs(new Set(data.slugs ?? []));
      })
      .catch(() => {
        if (alive) setLoggedIn(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const isFavorite = useCallback((slug: string) => slugs.has(slug), [slugs]);

  const toggle = useCallback(
    (slug: string) => {
      if (loggedIn === false) {
        router.push(`/connexion?next=${encodeURIComponent(pathname || '/catalogue')}`);
        return;
      }
      const next = new Set(slugs);
      const willFavorite = !next.has(slug);
      if (willFavorite) next.add(slug);
      else next.delete(slug);
      setSlugs(next); // optimiste

      fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, favorite: willFavorite }),
      })
        .then((r) => {
          if (r.status === 401) {
            router.push(`/connexion?next=${encodeURIComponent(pathname || '/catalogue')}`);
            throw new Error('auth');
          }
          if (!r.ok) throw new Error('failed');
        })
        .catch(() => {
          // revert en cas d'échec
          setSlugs((cur) => {
            const rev = new Set(cur);
            if (willFavorite) rev.delete(slug);
            else rev.add(slug);
            return rev;
          });
        });
    },
    [loggedIn, slugs, router, pathname],
  );

  const value = useMemo<Ctx>(
    () => ({ loggedIn, isFavorite, toggle, count: slugs.size }),
    [loggedIn, isFavorite, toggle, slugs.size],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites(): Ctx {
  const ctx = useContext(FavoritesContext);
  if (ctx) return ctx;
  // Repli sûr si le provider est absent (évite un crash au rendu).
  return { loggedIn: false, isFavorite: () => false, toggle: () => {}, count: 0 };
}

/** Cœur cliquable, à superposer sur une carte de guide. */
export function FavoriteHeart({ slug, className = '' }: { slug: string; className?: string }) {
  const { isFavorite, toggle } = useFavorites();
  const active = isFavorite(slug);
  return (
    <button
      type="button"
      aria-label={active ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      aria-pressed={active}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur transition hover:bg-white ${className}`}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill={active ? 'var(--color-bordeaux)' : 'none'}
        stroke="var(--color-bordeaux)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-transform active:scale-90"
      >
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
      </svg>
    </button>
  );
}
