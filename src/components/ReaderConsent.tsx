'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'emc-avis-immobilier-v1';

const AVIS =
  "Ce guide est fourni à titre informatif et éducatif uniquement. Il présente de " +
  "l'information générale concernant l'immobilier au Québec et ne constitue pas un " +
  "conseil immobilier, juridique, fiscal ou financier personnalisé. Chaque situation " +
  "immobilière étant différente, il est recommandé de consulter les professionnels " +
  "appropriés avant de prendre une décision concernant une transaction immobilière.";

/**
 * Fenêtre d'avis important, façon bandeau de cookies mais en modale élégante.
 * S'affiche à l'ouverture d'un guide tant que l'utilisateur n'a pas coché et
 * validé. Le choix est mémorisé (localStorage) pour ne pas réapparaître.
 */
export function ReaderConsent() {
  // null = on ne sait pas encore (évite le flash au montage/SSR)
  const [accepted, setAccepted] = useState<boolean | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    try {
      setAccepted(localStorage.getItem(STORAGE_KEY) === '1');
    } catch {
      setAccepted(true); // stockage indisponible : ne pas bloquer la lecture
    }
  }, []);

  function accept() {
    if (!checked) return;
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* ignore */
    }
    setAccepted(true);
  }

  if (accepted !== false) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="avis-title"
    >
      {/* Voile */}
      <div className="absolute inset-0 bg-[var(--color-ink)]/55 backdrop-blur-sm" />

      {/* Carte */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[var(--color-sand)] bg-[var(--color-cream)] shadow-2xl">
        <div className="h-1.5 w-full bg-[var(--color-gold)]" />
        <div className="p-7 sm:p-9">
          <p className="font-ui text-[0.7rem] uppercase tracking-[0.22em] text-[var(--color-gold)]">
            À lire avant de commencer
          </p>
          <h2
            id="avis-title"
            className="mt-2 font-display text-2xl text-[var(--color-bordeaux)]"
          >
            Avis important
          </h2>

          <p className="mt-4 font-body text-[0.95rem] leading-relaxed text-[var(--color-ink)]/85">
            {AVIS}
          </p>

          <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-xl border border-[var(--color-sand)] bg-white px-4 py-3">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-bordeaux)]"
            />
            <span className="font-body text-sm text-[var(--color-ink)]/85">
              J&apos;ai lu et je comprends cet avis. J&apos;accède à ce guide à titre informatif.
            </span>
          </label>

          <button
            onClick={accept}
            disabled={!checked}
            className="mt-6 w-full rounded-full bg-[var(--color-bordeaux)] py-3 font-ui text-sm font-medium text-white transition hover:bg-[var(--color-bordeaux-dark)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Accéder au guide
          </button>

          <p className="mt-4 text-center font-ui text-[0.68rem] leading-snug text-[var(--color-ink)]/45">
            © 2026 Émilie Cauvier — La Bibliothèque. Tous droits réservés. Reproduction,
            partage ou revente interdits sans autorisation écrite.
          </p>
        </div>
      </div>
    </div>
  );
}
