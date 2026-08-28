'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

interface Question {
  q: string;
  options: string[];
}
interface Result {
  score: number;
  total: number;
  scoreOn10: number;
  correct: number[];
  explanations: string[];
  saved: boolean;
}

export function QuizRunner({
  slug,
  questions,
  loggedIn,
}: {
  slug: string;
  questions: Question[];
  loggedIn: boolean;
}) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<Result | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === questions.length;

  async function submit() {
    setSubmitting(true);
    setError('');
    try {
      const payload = { slug, answers: questions.map((_, i) => (i in answers ? answers[i] : -1)) };
      const res = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('submit failed');
      const data = (await res.json()) as Result;
      setResult(data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setError('Une erreur est survenue. Réessayez.');
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setAnswers({});
    setResult(null);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const noteColor = useMemo(() => {
    if (!result) return '';
    if (result.scoreOn10 >= 8) return 'text-green-700';
    if (result.scoreOn10 >= 5) return 'text-[var(--color-gold)]';
    return 'text-[var(--color-bordeaux)]';
  }, [result]);

  return (
    <div className="mx-auto max-w-2xl">
      {result && (
        <div className="mb-8 rounded-2xl border border-[var(--color-sand)] bg-white p-7 text-center">
          <p className="font-ui text-xs uppercase tracking-[0.16em] text-[var(--color-gold)]">Votre résultat</p>
          <p className={`mt-2 font-display text-5xl ${noteColor}`}>{result.scoreOn10}/10</p>
          <p className="mt-2 font-body text-[var(--color-ink)]/70">
            {result.score} bonne{result.score > 1 ? 's' : ''} réponse{result.score > 1 ? 's' : ''} sur {result.total}
          </p>
          <p className="mt-3 font-body text-sm text-[var(--color-ink)]/60">
            {result.saved
              ? '✓ Résultat enregistré dans votre profil.'
              : loggedIn
                ? 'Résultat non enregistré (erreur). Réessayez.'
                : 'Connectez-vous pour enregistrer vos résultats dans votre profil.'}
          </p>
          {!loggedIn && (
            <Link
              href={`/connexion?next=/quiz/${slug}`}
              className="mt-3 inline-block font-ui text-sm text-[var(--color-bordeaux)] hover:underline"
            >
              Se connecter →
            </Link>
          )}
        </div>
      )}

      <div className="space-y-8">
        {questions.map((q, i) => {
          const chosen = answers[i];
          const answered = result != null;
          return (
            <div key={i}>
              <p className="font-body font-medium text-[var(--color-ink)]">
                {i + 1}. {q.q}
              </p>
              <div className="mt-3 space-y-2">
                {q.options.map((opt, j) => {
                  const selected = chosen === j;
                  const isCorrect = answered && j === result!.correct[i];
                  const isWrongChoice = answered && selected && j !== result!.correct[i];
                  let cls =
                    'border-[var(--color-sand)] bg-white hover:border-[var(--color-gold)]';
                  if (isCorrect) cls = 'border-green-500 bg-green-50';
                  else if (isWrongChoice) cls = 'border-red-400 bg-red-50';
                  else if (selected) cls = 'border-[var(--color-bordeaux)] bg-[var(--color-sand)]';
                  return (
                    <label
                      key={j}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-2 font-body text-sm transition ${cls} ${
                        answered ? 'cursor-default' : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q${i}`}
                        checked={selected || false}
                        disabled={answered}
                        onChange={() => setAnswers((a) => ({ ...a, [i]: j }))}
                        className="accent-[var(--color-bordeaux)]"
                      />
                      <span className="flex-1">{opt}</span>
                      {isCorrect && <span className="font-ui text-xs font-semibold text-green-700">Bonne réponse</span>}
                    </label>
                  );
                })}
              </div>
              {answered && result!.explanations[i] && (
                <p className="mt-2 font-body text-sm text-[var(--color-ink)]/70">
                  <span className="font-medium text-[var(--color-gold)]">Corrigé —</span> {result!.explanations[i]}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {error && <p className="mt-6 font-body text-sm text-[var(--color-bordeaux)]">{error}</p>}

      <div className="mt-10 flex items-center gap-4">
        {!result ? (
          <button
            onClick={submit}
            disabled={!allAnswered || submitting}
            className="rounded-full bg-[var(--color-bordeaux)] px-7 py-3 font-ui text-sm font-medium text-white transition hover:bg-[var(--color-bordeaux-dark)] disabled:opacity-40"
          >
            {submitting ? 'Validation…' : 'Valider mes réponses'}
          </button>
        ) : (
          <button
            onClick={reset}
            className="rounded-full border border-[var(--color-bordeaux)] px-7 py-3 font-ui text-sm font-medium text-[var(--color-bordeaux)] transition hover:bg-[var(--color-sand)]"
          >
            Recommencer le quiz
          </button>
        )}
        {!result && !allAnswered && (
          <p className="font-body text-sm text-[var(--color-ink)]/50">
            {answeredCount}/{questions.length} répondues
          </p>
        )}
      </div>
    </div>
  );
}
