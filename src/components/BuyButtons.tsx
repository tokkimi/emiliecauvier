'use client';

import Link from 'next/link';
import { useState } from 'react';
import { addCartItem, type CartLang } from '@/lib/cart';
import type { Locale } from '@/lib/i18n';

export function BuyButtons({
  slug,
  hasAccess,
  canDownload,
  downloadLangs = [],
  loggedIn,
  locale,
}: {
  slug: string;
  hasAccess: boolean;
  canDownload: boolean;
  downloadLangs?: string[];
  loggedIn: boolean;
  locale: Locale;
}) {
  const t = {
    readOnline: locale === 'en' ? 'Read online' : 'Lire en ligne',
    downloadPdf: locale === 'en' ? 'Download the PDF' : 'Télécharger le PDF',
    subscriptionNotice:
      locale === 'en'
        ? '📖 Unlimited online reading is included with your subscription. The downloadable PDF is reserved for single-guide purchases.'
        : '📖 Lecture en ligne illimitée avec votre abonnement. Le PDF téléchargeable est réservé à l’achat à l’unité.',
    buyPdf: locale === 'en' ? 'Buy the PDF for this guide' : 'Acheter le PDF de ce guide',
    access: locale === 'en' ? '✓ You have access to this guide' : '✓ Vous avez accès à ce guide',
    buyNow: locale === 'en' ? 'Buy now' : 'Acheter maintenant',
    addCart: locale === 'en' ? 'Add to cart' : 'Ajouter au panier',
    addedCart: locale === 'en' ? 'Added to cart' : 'Ajouté au panier',
    viewCart: locale === 'en' ? 'View my cart' : 'Voir mon panier',
    guestNotice: locale === 'en' ? 'At checkout, you can create an account or continue without one.' : 'Au panier, vous pourrez créer un compte ou continuer sans compte.',
    redirect: locale === 'en' ? 'Redirecting…' : 'Redirection…',
    paymentUnavailable: locale === 'en' ? 'Payment is unavailable right now.' : 'Paiement indisponible pour le moment.',
    networkError: locale === 'en' ? 'Network error. Please try again.' : 'Erreur réseau. Réessayez.',
    editionLabel: locale === 'en' ? 'PDF edition' : 'Édition du PDF',
    editionFr: 'Français',
    editionEn: 'English',
  };
  const [lang, setLang] = useState<CartLang>(locale === 'en' ? 'en' : 'fr');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);

  async function buy() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'unit', items: [{ slug, lang }] }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setError(data.error ?? t.paymentUnavailable);
    } catch {
      setError(t.networkError);
    } finally {
      setLoading(false);
    }
  }

  function addToCart() {
    addCartItem(slug, lang);
    setAdded(true);
  }

  // Sélecteur d'édition FR/EN (segmenté).
  const editionPicker = (
    <div>
      <p className="mb-1.5 font-ui text-xs uppercase tracking-[0.14em] text-[var(--color-ink)]/55">{t.editionLabel}</p>
      <div className="flex rounded-full border border-[var(--color-sand)] p-0.5 font-ui text-sm">
        {(['fr', 'en'] as const).map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLang(l)}
            aria-pressed={lang === l}
            className={`flex-1 rounded-full px-3 py-1.5 transition ${
              lang === l ? 'bg-[var(--color-bordeaux)] text-white' : 'text-[var(--color-ink)]/65 hover:text-[var(--color-bordeaux)]'
            }`}
          >
            {l === 'fr' ? t.editionFr : t.editionEn}
          </button>
        ))}
      </div>
    </div>
  );

  if (hasAccess) {
    const langs = (downloadLangs.length ? downloadLangs : ['fr']).filter((l) => l === 'fr' || l === 'en');
    const langName = (l: string) => (l === 'en' ? t.editionEn : t.editionFr);
    return (
      <div className="mt-6 space-y-3">
        <Link
          href={`/lire/${slug}`}
          className="block rounded-full bg-[var(--color-bordeaux)] py-3 text-center font-ui text-sm font-medium text-white transition hover:bg-[var(--color-bordeaux-dark)]"
        >
          {t.readOnline}
        </Link>
        {canDownload ? (
          langs.length > 1 ? (
            langs.map((l) => (
              <a
                key={l}
                href={`/api/download?slug=${slug}&lang=${l}`}
                className="block rounded-full border border-[var(--color-bordeaux)] py-3 text-center font-ui text-sm text-[var(--color-bordeaux)] transition hover:bg-[var(--color-sand)]"
              >
                {t.downloadPdf} · {langName(l)}
              </a>
            ))
          ) : (
            <a
              href={`/api/download?slug=${slug}&lang=${langs[0]}`}
              className="block rounded-full border border-[var(--color-bordeaux)] py-3 text-center font-ui text-sm text-[var(--color-bordeaux)] transition hover:bg-[var(--color-sand)]"
            >
              {t.downloadPdf}
            </a>
          )
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--color-sand)] bg-[var(--color-sand)]/40 p-4">
            <p className="font-ui text-xs text-[var(--color-ink)]/70">
              {t.subscriptionNotice}
            </p>
            <div className="mt-3">{editionPicker}</div>
            <button
              onClick={buy}
              disabled={loading}
              className="mt-3 w-full rounded-full bg-[var(--color-bordeaux)] py-2.5 font-ui text-xs font-medium text-white transition hover:bg-[var(--color-bordeaux-dark)] disabled:opacity-60"
            >
              {loading ? t.redirect : t.buyPdf}
            </button>
            {error && <p className="mt-2 text-center font-ui text-xs text-red-600">{error}</p>}
          </div>
        )}
        <p className="text-center font-ui text-xs text-green-700">{t.access}</p>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-3">
      {editionPicker}
      <button
        onClick={buy}
        disabled={loading}
        className="w-full rounded-full bg-[var(--color-bordeaux)] py-3 font-ui text-sm font-medium text-white transition hover:bg-[var(--color-bordeaux-dark)] disabled:opacity-60"
      >
        {loading ? t.redirect : t.buyNow}
      </button>
      <button
        onClick={addToCart}
        type="button"
        className="w-full rounded-full border border-[var(--color-bordeaux)] py-3 font-ui text-sm font-medium text-[var(--color-bordeaux)] transition hover:bg-[var(--color-sand)]"
      >
        {added ? t.addedCart : t.addCart}
      </button>
      {added && <Link href="/panier" className="block text-center font-ui text-xs text-[var(--color-bordeaux)] underline">{t.viewCart}</Link>}
      {!loggedIn && <p className="text-center font-ui text-xs text-[var(--color-ink)]/55">{t.guestNotice}</p>}
      {error && <p className="text-center font-ui text-xs text-red-600">{error}</p>}
    </div>
  );
}
