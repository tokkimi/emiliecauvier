'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CART_CHANGED_EVENT, readCartSlugs, removeCartSlug } from '@/lib/cart';
import { formatPrice } from '@/lib/format';
import type { Locale } from '@/lib/i18n';

type CartBook = {
  slug: string;
  number: number;
  title: string;
  subtitle: string;
  collection: string;
  priceCents: number;
};

const tx = {
  fr: {
    eyebrow: 'Votre panier',
    title: 'Acheter plusieurs guides en une fois',
    intro: 'Gardez vos guides dans un compte ou continuez sans compte: vous choisissez au moment de valider.',
    empty: 'Votre panier est vide.',
    explore: 'Explorer le catalogue',
    remove: 'Retirer',
    checkout: 'Valider mon panier',
    createAccount: 'Créer un compte',
    continueGuest: 'Continuer sans compte',
    loading: 'Redirection...',
    paymentUnavailable: 'Paiement indisponible.',
    guestNote: 'Avec un compte, les guides apparaissent dans votre profil. Sans compte, l’accès reste disponible sur cet appareil et par le courriel de paiement.',
    guide: (count: number) => `${count} guide${count > 1 ? 's' : ''}`,
  },
  en: {
    eyebrow: 'Your cart',
    title: 'Buy several guides at once',
    intro: 'Keep your guides in an account or continue without one: you choose at checkout.',
    empty: 'Your cart is empty.',
    explore: 'Explore the catalogue',
    remove: 'Remove',
    checkout: 'Checkout',
    createAccount: 'Create an account',
    continueGuest: 'Continue without an account',
    loading: 'Redirecting...',
    paymentUnavailable: 'Payment unavailable.',
    guestNote: 'With an account, your guides appear in your profile. Without an account, access remains available on this device and through the payment email.',
    guide: (count: number) => `${count} guide${count > 1 ? 's' : ''}`,
  },
};

export function CartPageClient({ books, loggedIn, locale }: { books: CartBook[]; loggedIn: boolean; locale: Locale }) {
  const router = useRouter();
  const t = tx[locale];
  const [slugs, setSlugs] = useState<string[]>([]);
  const [pdfLocale, setPdfLocale] = useState<Locale>(locale);
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
        body: JSON.stringify({ mode: 'unit', slugs: items.map((item) => item.slug), pdfLocale }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? t.paymentUnavailable);
      window.location.href = data.url;
    } catch (cause) {
      setLoading(false);
      setError(cause instanceof Error ? cause.message : t.paymentUnavailable);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-14">
      <p className="font-ui text-xs uppercase tracking-[0.2em] text-[var(--color-gold)]">{t.eyebrow}</p>
      <h1 className="mt-2 font-display text-4xl text-[var(--color-ink)]">{t.title}</h1>
      <p className="mt-3 max-w-2xl font-body text-[var(--color-ink)]/65">
        {t.intro}
      </p>

      {items.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-[var(--color-sand)] bg-white p-10 text-center">
          <p className="font-display text-2xl text-[var(--color-bordeaux)]">{t.empty}</p>
          <Link href="/catalogue" className="mt-5 inline-flex min-h-11 items-center rounded-full bg-[var(--color-bordeaux)] px-6 font-ui text-sm text-white">
            {t.explore}
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
                    {t.remove}
                  </button>
                </div>
                <p className="shrink-0 font-ui text-sm font-semibold text-[var(--color-ink)]">{formatPrice(book.priceCents)}</p>
              </article>
            ))}
          </div>

          <aside className="h-fit rounded-2xl border border-[var(--color-sand)] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-[var(--color-sand)] pb-4">
              <span className="font-ui text-sm text-[var(--color-ink)]/60">{t.guide(items.length)}</span>
              <strong className="font-display text-2xl text-[var(--color-bordeaux)]">{formatPrice(total)}</strong>
            </div>
            <label className="mt-5 block font-ui text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-gold)]">
              {locale === 'en' ? 'PDF language' : 'Langue des PDF'}
            </label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {(['fr', 'en'] as Locale[]).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setPdfLocale(lang)}
                  className={`rounded-full border px-4 py-2 font-ui text-sm transition ${
                    pdfLocale === lang
                      ? 'border-[var(--color-bordeaux)] bg-[var(--color-bordeaux)] text-white'
                      : 'border-[var(--color-sand)] bg-white text-[var(--color-ink)]/70 hover:border-[var(--color-bordeaux)]'
                  }`}
                >
                  {lang === 'fr' ? 'Français' : 'English'}
                </button>
              ))}
            </div>

            {loggedIn ? (
              <button onClick={checkout} disabled={loading} className="mt-5 min-h-12 w-full rounded-full bg-[var(--color-bordeaux)] px-5 font-ui text-sm font-medium text-white disabled:opacity-60">
                {loading ? t.loading : t.checkout}
              </button>
            ) : (
              <div className="mt-5 space-y-3">
                <button onClick={() => router.push('/inscription?next=/panier')} className="min-h-12 w-full rounded-full bg-[var(--color-bordeaux)] px-5 font-ui text-sm font-medium text-white">
                  {t.createAccount}
                </button>
                <button onClick={checkout} disabled={loading} className="min-h-12 w-full rounded-full border border-[var(--color-bordeaux)] px-5 font-ui text-sm font-medium text-[var(--color-bordeaux)] disabled:opacity-60">
                  {loading ? t.loading : t.continueGuest}
                </button>
                <p className="font-ui text-xs leading-relaxed text-[var(--color-ink)]/50">
                  {t.guestNote}
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
