'use client';

import { useEffect, useState } from 'react';

const KEY = 'emilie-cookie-choice';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    try { setVisible(!localStorage.getItem(KEY)); } catch { setVisible(false); }
  }, []);

  function choose(value: 'preferences' | 'essential') {
    try {
      localStorage.setItem(KEY, value);
      document.cookie = `cookie_consent=${value}; path=/; max-age=31536000; samesite=lax`;
    } catch { /* ignore */ }
    setVisible(false);
  }

  if (!visible) return null;
  return (
    <aside aria-label="Préférences de cookies" className="fixed bottom-4 left-4 right-4 z-[60] mx-auto max-w-3xl rounded-3xl border border-white/60 bg-white/75 p-5 shadow-2xl backdrop-blur-2xl sm:bottom-6 sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div><p className="font-display text-xl text-[var(--color-bordeaux)]">Une expérience à votre mesure</p><p className="mt-1 max-w-xl font-body text-sm leading-relaxed text-[var(--color-ink)]/65">Les cookies essentiels gardent votre session et votre langue. Avec votre accord, vos préférences améliorent aussi votre parcours de lecture. Aucun cookie publicitaire n’est déposé ici.</p></div>
        <div className="flex shrink-0 flex-col gap-2 sm:w-48"><button onClick={() => choose('preferences')} className="min-h-11 rounded-full bg-[var(--color-bordeaux)] px-4 font-ui text-xs font-medium text-white">Autoriser les préférences</button><button onClick={() => choose('essential')} className="min-h-11 rounded-full border border-[var(--color-bordeaux)] px-4 font-ui text-xs text-[var(--color-bordeaux)]">Essentiels uniquement</button></div>
      </div>
    </aside>
  );
}

