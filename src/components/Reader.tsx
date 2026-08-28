'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { ReaderChapter, ReaderQCM } from '@/lib/reader';
import { ReaderConsent } from '@/components/ReaderConsent';

export function Reader({
  slug,
  title,
  subtitle,
  chapters,
  qcm,
  previewOnly,
  loggedIn,
  frenchNotice = false,
}: {
  slug: string;
  title: string;
  subtitle: string;
  chapters: ReaderChapter[];
  qcm: ReaderQCM[];
  previewOnly: boolean;
  loggedIn: boolean;
  frenchNotice?: boolean;
}) {
  // En aperçu : seul le premier chapitre est déverrouillé.
  const lastIndex = chapters.length + (qcm.length ? 1 : 0);
  const [active, setActive] = useState(0);
  const qcmIndex = chapters.length; // l'onglet QCM vient après les chapitres

  const isLocked = (i: number) => previewOnly && i !== 0;
  const onQcm = active === qcmIndex && qcm.length > 0;

  return (
    <>
    <ReaderConsent />
    <div className="mx-auto flex max-w-6xl flex-col gap-0 lg:flex-row">
      {/* Menu latéral — façon Coursera */}
      <aside className="border-b border-[var(--color-sand)] bg-white lg:w-80 lg:shrink-0 lg:border-b-0 lg:border-r">
        <div className="p-6">
          <Link href={`/livre/${slug}`} className="font-ui text-xs text-[var(--color-bordeaux)] hover:underline">
            ← Fiche du guide
          </Link>
          <h1 className="mt-3 font-display text-lg leading-snug text-[var(--color-ink)]">{title}</h1>
          <p className="mt-1 font-body text-sm text-[var(--color-ink)]/60">{subtitle}</p>
          {frenchNotice && (
            <p className="mt-3 rounded-lg border border-[var(--color-sand)] bg-[var(--color-cream)] px-3 py-2 font-ui text-[0.7rem] leading-snug text-[var(--color-ink)]/70">
              📖 This guide’s full text is currently available in French. English translation in progress.
            </p>
          )}
        </div>
        <nav className="pb-6">
          {chapters.map((c, i) => {
            const locked = isLocked(i);
            const current = active === i;
            return (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`flex w-full items-center gap-3 px-6 py-3 text-left font-ui text-sm transition ${
                  current ? 'bg-[var(--color-sand)] text-[var(--color-bordeaux)]' : 'text-[var(--color-ink)]/80 hover:bg-[var(--color-cream)]'
                }`}
              >
                <span className="font-ui text-xs text-[var(--color-gold)]">{String(i + 1).padStart(2, '0')}</span>
                <span className="flex-1">{c.title}</span>
                {locked && <span title="Verrouillé">🔒</span>}
              </button>
            );
          })}
          {qcm.length > 0 && (
            <button
              onClick={() => setActive(qcmIndex)}
              className={`flex w-full items-center gap-3 px-6 py-3 text-left font-ui text-sm transition ${
                onQcm ? 'bg-[var(--color-sand)] text-[var(--color-bordeaux)]' : 'text-[var(--color-ink)]/80 hover:bg-[var(--color-cream)]'
              }`}
            >
              <span className="font-ui text-xs text-[var(--color-gold)]">?</span>
              <span className="flex-1">Quiz — testez-vous</span>
              {previewOnly && <span title="Verrouillé">🔒</span>}
            </button>
          )}
        </nav>
      </aside>

      {/* Contenu */}
      <section className="flex-1 px-5 py-10 sm:px-12">
        {onQcm ? (
          previewOnly ? (
            <Paywall slug={slug} loggedIn={loggedIn} />
          ) : (
            <Quiz qcm={qcm} />
          )
        ) : isLocked(active) ? (
          <Paywall slug={slug} loggedIn={loggedIn} />
        ) : (
          <article className="mx-auto max-w-2xl">
            <p className="font-ui text-xs uppercase tracking-[0.16em] text-[var(--color-gold)]">
              Chapitre {active + 1} / {chapters.length}
            </p>
            <h2 className="mt-2 font-display text-3xl text-[var(--color-ink)]">{chapters[active].title}</h2>
            <div
              className="prose-reader mt-6"
              dangerouslySetInnerHTML={{ __html: chapters[active].html }}
            />
            <div className="mt-12 flex justify-between border-t border-[var(--color-sand)] pt-6 font-ui text-sm">
              <button
                disabled={active === 0}
                onClick={() => setActive((a) => Math.max(0, a - 1))}
                className="text-[var(--color-bordeaux)] disabled:opacity-30"
              >
                ← Précédent
              </button>
              <button
                disabled={active >= lastIndex}
                onClick={() => setActive((a) => Math.min(lastIndex, a + 1))}
                className="text-[var(--color-bordeaux)] disabled:opacity-30"
              >
                Suivant →
              </button>
            </div>
          </article>
        )}
      </section>
    </div>
    </>
  );
}

function Paywall({ slug, loggedIn }: { slug: string; loggedIn: boolean }) {
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-[var(--color-sand)] bg-white p-10 text-center">
      <p className="text-4xl">🔒</p>
      <h2 className="mt-4 font-display text-2xl text-[var(--color-bordeaux)]">Contenu réservé</h2>
      <p className="mt-3 font-body text-[var(--color-ink)]/70">
        Ce chapitre fait partie du guide complet. Achetez le guide ou abonnez-vous pour tout lire — et
        télécharger le PDF.
      </p>
      <div className="mt-6 space-y-3">
        <Link
          href={`/livre/${slug}`}
          className="block rounded-full bg-[var(--color-bordeaux)] py-3 font-ui text-sm font-medium text-white hover:bg-[var(--color-bordeaux-dark)]"
        >
          Débloquer ce guide
        </Link>
        <Link href="/inscription?plan=abonnement" className="block font-ui text-sm text-[var(--color-bordeaux)] hover:underline">
          Ou s&apos;abonner (19 $/mois)
        </Link>
        {!loggedIn && (
          <Link href={`/connexion?next=/lire/${slug}`} className="block font-ui text-xs text-[var(--color-ink)]/50 hover:underline">
            J&apos;ai déjà un compte
          </Link>
        )}
      </div>
    </div>
  );
}

function Quiz({ qcm }: { qcm: ReaderQCM[] }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [checked, setChecked] = useState(false);
  const score = qcm.reduce((s, q, i) => (answers[i] === q.answer ? s + 1 : s), 0);

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="font-display text-3xl text-[var(--color-ink)]">Quiz — testez-vous</h2>
      <p className="mt-2 font-body text-[var(--color-ink)]/60">{qcm.length} questions. Corrigé instantané.</p>

      <div className="mt-8 space-y-8">
        {qcm.map((q, i) => (
          <div key={i}>
            <p className="font-body font-medium text-[var(--color-ink)]">
              {i + 1}. {q.q}
            </p>
            <div className="mt-3 space-y-2">
              {q.options.map((opt, j) => {
                const selected = answers[i] === j;
                const correct = checked && j === q.answer;
                const wrong = checked && selected && j !== q.answer;
                return (
                  <label
                    key={j}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-2 font-body text-sm transition ${
                      correct
                        ? 'border-green-500 bg-green-50'
                        : wrong
                          ? 'border-red-400 bg-red-50'
                          : selected
                            ? 'border-[var(--color-bordeaux)] bg-[var(--color-sand)]'
                            : 'border-[var(--color-sand)] bg-white hover:border-[var(--color-gold)]'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q${i}`}
                      checked={selected}
                      onChange={() => setAnswers((a) => ({ ...a, [i]: j }))}
                      className="accent-[var(--color-bordeaux)]"
                    />
                    <span>{opt}</span>
                  </label>
                );
              })}
            </div>
            {checked && q.explanation && (
              <p className="mt-2 font-body text-sm text-[var(--color-ink)]/70">
                <span className="font-medium text-[var(--color-gold)]">Corrigé —</span> {q.explanation}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-10 flex items-center gap-4">
        <button
          onClick={() => setChecked(true)}
          className="rounded-full bg-[var(--color-bordeaux)] px-6 py-3 font-ui text-sm font-medium text-white hover:bg-[var(--color-bordeaux-dark)]"
        >
          Voir mon score
        </button>
        {checked && (
          <p className="font-display text-xl text-[var(--color-bordeaux)]">
            {score} / {qcm.length}
          </p>
        )}
      </div>
    </div>
  );
}
