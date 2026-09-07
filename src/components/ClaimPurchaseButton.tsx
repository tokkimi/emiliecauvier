'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
export function ClaimPurchaseButton({ locale, slug }: { locale: 'fr' | 'en'; slug: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  async function claim() {
    setBusy(true); setError('');
    try {
      const response = await fetch('/api/account/claim-purchases', { method: 'POST' });
      if (!response.ok) throw new Error('claim failed');
      router.replace(`/lire/${encodeURIComponent(slug)}`);
      router.refresh();
    } catch {
      setError(locale === 'en' ? 'Use the account with the email entered at checkout and the same browser used to pay. If needed, contact us with your receipt. Your PDFs remain downloadable from the confirmation page.' : 'Utilisez le compte avec l’email saisi au paiement et le même navigateur. Au besoin, contactez-nous avec votre reçu. Vos PDF restent téléchargeables depuis la confirmation du paiement.');
    } finally { setBusy(false); }
  }
  return <div className="mt-7"><button type="button" disabled={busy} onClick={claim} className="w-full rounded-full bg-[var(--color-bordeaux)] px-6 py-3 font-ui text-sm text-white disabled:opacity-50">{busy ? (locale === 'en' ? 'Saving…' : 'Enregistrement…') : (locale === 'en' ? 'Save my purchase and read online' : 'Enregistrer mon achat et lire en ligne')}</button>{error && <p role="alert" className="mt-4 font-ui text-sm leading-relaxed text-[var(--color-bordeaux)]">{error}</p>}</div>;
}
