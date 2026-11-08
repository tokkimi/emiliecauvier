'use client';

import { useEffect, useState } from 'react';
import type { Locale } from '@/lib/i18n';

import { CONSENT_KEY, CONSENT_EVENT, GA_ID, META_ID } from '@/lib/measurement';

export function CookieConsent({ locale }: { locale: Locale }) {
  const configured = Boolean(GA_ID || META_ID);
  const [visible, setVisible] = useState(false);
  const t = locale === 'en'
    ? {
        aria: 'Cookie preferences',
        title: 'A tailored experience',
        desc: 'Essential cookies keep your session and language. With your consent, preference cookies also improve your reading journey. With your consent, Google Analytics and Meta also measure visits, sales and advertising performance.',
        preferences: 'Allow measurement',
        essential: 'Essential only',
      }
    : {
        aria: 'Préférences de cookies',
        title: 'Une expérience à votre mesure',
        desc: 'Les cookies essentiels gardent votre session et votre langue. Avec votre accord, vos préférences améliorent aussi votre parcours de lecture. Avec votre accord, Google Analytics et Meta mesurent aussi les visites, les ventes et les résultats publicitaires.',
        preferences: 'Autoriser la mesure',
        essential: 'Essentiels uniquement',
      };
  useEffect(() => {
    try { setVisible(!localStorage.getItem(CONSENT_KEY)); } catch { setVisible(false); }
  }, []);

  function choose(value: 'allow' | 'essential') {
    let wasAllowed = false;
    try {
      wasAllowed = localStorage.getItem(CONSENT_KEY) === 'allow';
      localStorage.setItem(CONSENT_KEY, value);
      document.cookie = `cookie_consent=${value}; path=/; max-age=31536000; samesite=lax`;
    } catch { /* ignore */ }
    setVisible(false);
    if (value === 'allow') window.dispatchEvent(new Event(CONSENT_EVENT));
    else if (wasAllowed) window.location.reload();
  }

  if (!configured) return null;
  if (!visible) return <button type="button" onClick={() => setVisible(true)} className="mx-auto mb-3 block font-ui text-xs underline">{t.aria}</button>;
  return (
    <aside aria-label={t.aria} className="fixed bottom-[max(12px,env(safe-area-inset-bottom))] left-3 right-3 z-[60] mx-auto max-h-[70dvh] max-w-3xl overflow-y-auto rounded-2xl border border-white/80 bg-white/85 p-4 shadow-[0_8px_32px_rgba(46,31,24,0.15)] backdrop-blur-2xl sm:bottom-6 sm:rounded-3xl sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
        <div><p className="font-display text-lg text-[var(--color-bordeaux)] sm:text-xl">{t.title}</p><p className="mt-1 max-w-xl font-body text-sm leading-snug text-[var(--color-ink)]/75 sm:leading-relaxed">{t.desc}</p></div>
        <div className="grid shrink-0 grid-cols-2 gap-2 sm:w-48 sm:grid-cols-1"><button onClick={() => choose('allow')} className="min-h-11 rounded-full bg-[var(--color-bordeaux)] px-3 py-2 font-ui text-xs font-medium text-white">{t.preferences}</button><button onClick={() => choose('essential')} className="min-h-11 rounded-full border border-[var(--color-bordeaux)] px-3 py-2 font-ui text-xs text-[var(--color-bordeaux)]">{t.essential}</button></div>
      </div>
    </aside>
  );
}
