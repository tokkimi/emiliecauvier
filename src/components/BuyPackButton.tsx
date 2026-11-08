'use client';

import { trackItems } from '@/lib/measurement-items';
import { useState } from 'react';
import type { Collection } from '@/data/books';
import type { Locale } from '@/lib/i18n';

export function BuyPackButton({ collection, locale, slugs, total }: { collection: Collection; locale: Locale; slugs: string[]; total: number }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const en = locale === 'en';
  async function checkout() {
    setBusy(true);
    setError(false);
    try {
      trackItems('begin_checkout', slugs, locale, total / 100);
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ mode: 'unit', pack: collection, pdfLocale: locale }),
      });
      const result = await response.json();
      if (!response.ok || !result.url) throw new Error('checkout');
      window.location.assign(result.url);
    } catch {
      setError(true);
      setBusy(false);
    }
  }
  return <>
    <button type="button" onClick={checkout} disabled={busy} className="mt-4 rounded-full bg-[var(--color-bordeaux)] px-4 py-2 font-ui text-sm text-white disabled:opacity-60">
      {busy ? (en ? 'Opening checkout…' : 'Ouverture du paiement…') : (en ? 'Buy the PDF bundle' : 'Acheter le pack PDF')}
    </button>
    {error && <p role="alert" className="mt-2 font-ui text-sm">{en ? 'Checkout is temporarily unavailable.' : 'Le paiement est momentanément indisponible.'}</p>}
  </>;
}
