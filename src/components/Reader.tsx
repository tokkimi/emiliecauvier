'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { ReaderChapter } from '@/lib/reader';
import { ReaderConsent } from '@/components/ReaderConsent';
import { QuizRunner } from '@/components/QuizRunner';

export function Reader({
  slug,
  title,
  subtitle,
  chapters,
  quizQuestions,
  hasQuiz,
  previewOnly,
  loggedIn,
  initialChapter = 0,
  frenchNotice = false,
}: {
  slug: string;
  title: string;
  subtitle: string;
  chapters: ReaderChapter[];
  quizQuestions: { q: string; options: string[] }[];
  hasQuiz: boolean;
  previewOnly: boolean;
  loggedIn: boolean;
  initialChapter?: number;
  frenchNotice?: boolean;
}) {
  // En aperçu : seul le premier chapitre est déverrouillé.
  const lastIndex = chapters.length - 1 + (hasQuiz ? 1 : 0);
  const [active, setActive] = useState(
    previewOnly ? 0 : Math.min(Math.max(initialChapter, 0), Math.max(chapters.length - 1, 0)),
  );
  const qcmIndex = chapters.length; // l'onglet QCM vient après les chapitres

  const isLocked = (i: number) => previewOnly && i !== 0;
  const onQcm = active === qcmIndex && hasQuiz;

  function selectChapter(index: number) {
    setActive(index);
    if (previewOnly || !loggedIn || index >= chapters.length) return;
    void fetch('/api/account/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, chapterIndex: index }),
    });
  }

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
          {!previewOnly && (
            <div className="mt-5" aria-label={`Progression : chapitre ${Math.min(active + 1, chapters.length)} sur ${chapters.length}`}>
              <div className="flex items-center justify-between font-ui text-[0.68rem] uppercase tracking-[0.12em] text-[var(--color-ink)]/50">
                <span>Progression</span>
                <span>{Math.round((Math.min(active + 1, chapters.length) / chapters.length) * 100)} %</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--color-sand)]">
                <div
                  className="h-full rounded-full bg-[var(--color-gold)] transition-all"
                  style={{ width: `${(Math.min(active + 1, chapters.length) / chapters.length) * 100}%` }}
                />
              </div>
            </div>
          )}
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
                onClick={() => selectChapter(i)}
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
          {hasQuiz && (
            <button
              onClick={() => selectChapter(qcmIndex)}
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
            <QuizRunner slug={slug} questions={quizQuestions} loggedIn={loggedIn} />
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
                onClick={() => selectChapter(Math.max(0, active - 1))}
                className="text-[var(--color-bordeaux)] disabled:opacity-30"
              >
                ← Précédent
              </button>
              <button
                disabled={active >= lastIndex}
                onClick={() => selectChapter(Math.min(lastIndex, active + 1))}
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
