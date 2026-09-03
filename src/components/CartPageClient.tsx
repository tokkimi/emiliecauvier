'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CART_CHANGED_EVENT, readCartSlugs, removeCartSlug } from '@/lib/cart';
import { formatPrice } from '@/lib/format';

type CartBook = {
  slug: string;
  number: number;
  title: string;
  subtitle: string;
  collection: string;
  priceCents: number;
};

export function CartPageClient({ books, loggedIn }: { books: CartBook[]; loggedIn: boolean }) {
  const router = useRouter();
  const [slugs, setSlugs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const items = useMemo(() => {
    const bySlug = new Map(books.map((book) => [book.slug, book]));
    return slugs.map((slug) => bySlug.get(slug)).filter((book): book is CartBook => Boolean(book));
  }, [books, slugs]);
  const total = items.reduce((sum, item) => sum + item.priceCents, 0);

  useEffect(() => {
    setSlugs(readCartSlugs());
  }, []);

  function remove(slug: string) {
    removeCartSlug(slug);
    setSlugs(readCartSlugs());
    window.dispatchEvent(new Event(CART_CHANGED_EVENT));
  }

  async function checkout() {
    if (!items.length) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'unit', slugs: items.map((item) => item.slug) }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? 'Paiement indisponible.');
      window.location.href = data.url;
    } catch (cause) {
      setLoading(false);
      setError(cause instanceof Error ? cause.message : 'Paiement indisponible.');
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-14">
      <p className="font-ui text-xs uppercase tracking-[0.2em] text-[var(--color-gold)]">Votre panier</p>
      <h1 className="mt-2 font-display text-4xl text-[var(--color-ink)]">Acheter plusieurs guides en une fois</h1>
      <p className="mt-3 max-w-2xl font-body text-[var(--color-ink)]/65">
        Gardez vos guides dans un compte ou continuez sans compte: vous choisissez au moment de valider.
      </p>

      {items.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-[var(--color-sand)] bg-white p-10 text-center">
          <p className="font-display text-2xl text-[var(--color-bordeaux)]">Votre panier est vide.</p>
          <Link href="/catalogue" className="mt-5 inline-flex min-h-11 items-center rounded-full bg-[var(--color-bordeaux)] px-6 font-ui text-sm text-white">
            Explorer le catalogue
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-3">
            {items.map((book) => (
              <article key={book.slug} className="flex gap-4 rounded-2xl border border-[var(--color-sand)] bg-white p-4">
                <div className="flex h-20 w-14 shrink-0 items-center justify-center rounded-lg bg-[var(--color-bordeaux)] font-display text-xl text-white">
                  {book.number}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-ui text-[0.62rem] uppercase tracking-[0.14em] text-[var(--color-gold)]">{book.collection}</p>
                  <Link href={`/livre/${book.slug}`} className="mt-1 block font-display text-xl leading-tight text-[var(--color-bordeaux)] hover:underline">
                    {book.title}
                  </Link>
                  <p className="mt-1 line-clamp-2 font-body text-sm text-[var(--color-ink)]/60">{book.subtitle}</p>
                  <button onClick={() => remove(book.slug)} className="mt-3 font-ui text-xs text-[var(--color-ink)]/45 hover:text-[var(--color-bordeaux)]">
                    Retirer
                  </button>
                </div>
                <p className="shrink-0 font-ui text-sm font-semibold text-[var(--color-ink)]">{formatPrice(book.priceCents)}</p>
              </article>
            ))}
          </div>

          <aside className="h-fit rounded-2xl border border-[var(--color-sand)] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-[var(--color-sand)] pb-4">
              <span className="font-ui text-sm text-[var(--color-ink)]/60">{items.length} guide{items.length > 1 ? 's' : ''}</span>
              <strong className="font-display text-2xl text-[var(--color-bordeaux)]">{formatPrice(total)}</strong>
            </div>

            {loggedIn ? (
              <button onClick={checkout} disabled={loading} className="mt-5 min-h-12 w-full rounded-full bg-[var(--color-bordeaux)] px-5 font-ui text-sm font-medium text-white disabled:opacity-60">
                {loading ? 'Redirection...' : 'Valider mon panier'}
              </button>
            ) : (
              <div className="mt-5 space-y-3">
                <button onClick={() => router.push('/inscription?next=/panier')} className="min-h-12 w-full rounded-full bg-[var(--color-bordeaux)] px-5 font-ui text-sm font-medium text-white">
                  Créer un compte
                </button>
                <button onClick={checkout} disabled={loading} className="min-h-12 w-full rounded-full border border-[var(--color-bordeaux)] px-5 font-ui text-sm font-medium text-[var(--color-bordeaux)] disabled:opacity-60">
                  {loading ? 'Redirection...' : 'Continuer sans compte'}
                </button>
                <p className="font-ui text-xs leading-relaxed text-[var(--color-ink)]/50">
                  Avec un compte, les guides apparaissent dans votre profil. Sans compte, l'accès reste disponible sur cet appareil et par le courriel de paiement.
                </p>
              </div>
            )}
            {error && <p className="mt-3 font-ui text-xs text-red-700">{error}</p>}
          </aside>
        </div>
      )}
    </div>
  );
}
