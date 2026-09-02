'use client';

import Link from 'next/link';
import { useState } from 'react';

export function BuyButtons({
  slug,
  hasAccess,
  canDownload,
  loggedIn,
}: {
  slug: string;
  hasAccess: boolean;
  canDownload: boolean;
  loggedIn: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function buy() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'unit', slug }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setError(data.error ?? 'Paiement indisponible pour le moment.');
    } catch {
      setError('Erreur réseau. Réessayez.');
    } finally {
      setLoading(false);
    }
  }

  if (hasAccess) {
    return (
      <div className="mt-6 space-y-3">
        <Link
          href={`/lire/${slug}`}
          className="block rounded-full bg-[var(--color-bordeaux)] py-3 text-center font-ui text-sm font-medium text-white transition hover:bg-[var(--color-bordeaux-dark)]"
        >
          Lire en ligne
        </Link>
        {canDownload ? (
          <a
            href={`/api/download?slug=${slug}`}
            className="block rounded-full border border-[var(--color-bordeaux)] py-3 text-center font-ui text-sm text-[var(--color-bordeaux)] transition hover:bg-[var(--color-sand)]"
          >
            Télécharger le PDF
          </a>
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--color-sand)] bg-[var(--color-sand)]/40 p-4">
            <p className="font-ui text-xs text-[var(--color-ink)]/70">
              📖 Lecture en ligne illimitée avec votre abonnement. Le <strong>PDF téléchargeable</strong> est réservé à l&apos;achat à l&apos;unité.
            </p>
            <button
              onClick={buy}
              disabled={loading}
              className="mt-3 w-full rounded-full bg-[var(--color-bordeaux)] py-2.5 font-ui text-xs font-medium text-white transition hover:bg-[var(--color-bordeaux-dark)] disabled:opacity-60"
            >
              {loading ? 'Redirection…' : 'Acheter le PDF de ce guide'}
            </button>
            {error && <p className="mt-2 text-center font-ui text-xs text-red-600">{error}</p>}
          </div>
        )}
        <p className="text-center font-ui text-xs text-green-700">✓ Vous avez accès à ce guide</p>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-3">
      <button
        onClick={buy}
        disabled={loading}
        className="w-full rounded-full bg-[var(--color-bordeaux)] py-3 font-ui text-sm font-medium text-white transition hover:bg-[var(--color-bordeaux-dark)] disabled:opacity-60"
      >
        {loading ? 'Redirection…' : loggedIn ? 'Acheter ce guide' : 'Acheter maintenant — sans compte'}
      </button>
      {!loggedIn && (
        <p className="text-center font-ui text-xs text-[var(--color-ink)]/55">
          Paiement sécurisé · votre courriel de livraison sera demandé par Stripe.
        </p>
      )}
      {error && <p className="text-center font-ui text-xs text-red-600">{error}</p>}
    </div>
  );
}
