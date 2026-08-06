'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

/** Bascule FR/EN : écrit un cookie `lang` et rafraîchit la page (rendu serveur). */
export function LangToggle() {
  const router = useRouter();
  const [lang, setLang] = useState<'fr' | 'en'>('fr');

  useEffect(() => {
    const m = document.cookie.match(/(?:^|;\s*)lang=(fr|en)/);
    if (m) setLang(m[1] as 'fr' | 'en');
  }, []);

  function set(next: 'fr' | 'en') {
    document.cookie = `lang=${next};path=/;max-age=31536000`;
    setLang(next);
    router.refresh();
  }

  return (
    <div className="flex items-center rounded-full border border-[var(--color-sand)] p-0.5 font-ui text-[0.7rem] font-medium">
      {(['fr', 'en'] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => set(l)}
          aria-pressed={lang === l}
          className={`rounded-full px-2.5 py-1 uppercase tracking-wide transition ${
            lang === l ? 'bg-[var(--color-bordeaux)] text-white' : 'text-[var(--color-ink)]/60 hover:text-[var(--color-bordeaux)]'
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
