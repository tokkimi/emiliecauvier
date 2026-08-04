'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function BuyButtons({
  slug,
  hasAccess,
  loggedIn,
}: {
  slug: string;
  hasAccess: boolean;
  loggedIn: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function buy() {
    if (!loggedIn) {
      router.push(`/connexion?next=/livre/${slug}`);
      return;
    }
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
        <a
          href={`/api/download?slug=${slug}`}
          className="block rounded-full border border-[var(--color-bordeaux)] py-3 text-center font-ui text-sm text-[var(--color-bordeaux)] transition hover:bg-[var(--color-sand)]"
        >
          Télécharger le PDF
        </a>
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
        {loading ? 'Redirection…' : 'Acheter ce guide'}
      </button>
      {error && <p className="text-center font-ui text-xs text-red-600">{error}</p>}
    </div>
  );
}
