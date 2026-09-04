'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import type { Locale } from '@/lib/i18n';

export function SubscribeButton({ active, locale }: { active: boolean; locale: Locale }) {
  const [loading, setLoading] = useState(false);
  const unavailable = locale === 'en' ? 'Action unavailable.' : 'Action indisponible.';

  async function go(mode: 'subscription' | 'portal') {
    setLoading(true);
    try {
      const url = mode === 'subscription' ? '/api/stripe/checkout' : '/api/stripe/portal';
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'subscription' }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? unavailable);
      window.location.href = data.url;
    } catch (error) {
      setLoading(false);
      alert(error instanceof Error ? error.message : unavailable);
    }
  }

  if (active) {
    return (
      <button
        onClick={() => go('portal')}
        disabled={loading}
        className="rounded-full border border-[var(--color-bordeaux)] px-5 py-2.5 font-ui text-sm text-[var(--color-bordeaux)] transition hover:bg-[var(--color-sand)] disabled:opacity-60"
      >
        {loading ? '…' : locale === 'en' ? 'Manage my subscription' : 'Gérer mon abonnement'}
      </button>
    );
  }
  return (
    <button
      onClick={() => go('subscription')}
      disabled={loading}
      className="rounded-full bg-[var(--color-bordeaux)] px-5 py-2.5 font-ui text-sm font-medium text-white transition hover:bg-[var(--color-bordeaux-dark)] disabled:opacity-60"
    >
      {loading ? '…' : locale === 'en' ? 'Subscribe — $19/month' : 'S\'abonner — 19 $/mois'}
    </button>
  );
}

export function SignOutButton({ locale }: { locale: Locale }) {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="font-ui text-sm text-[var(--color-ink)]/60 hover:text-[var(--color-bordeaux)] hover:underline"
    >
      {locale === 'en' ? 'Log out' : 'Se déconnecter'}
    </button>
  );
}
