'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { recommendBooks, type ProjectAnswers } from '@/lib/recommendations';

const fieldClass = 'w-full rounded-xl border border-[var(--color-sand)] bg-white px-4 py-3 font-ui text-sm outline-none focus:border-[var(--color-gold)]';

export function ProjectPathBuilder({ loggedIn }: { loggedIn: boolean }) {
  const router = useRouter();
  const [answers, setAnswers] = useState<ProjectAnswers>({ stage: 'acheter', area: 'montreal', propertyType: 'condo', budget: '500-700' });
  const [feedback, setFeedback] = useState('');
  const recommendations = useMemo(() => recommendBooks(answers), [answers]);

  const update = (key: keyof ProjectAnswers, value: string) => setAnswers((current) => ({ ...current, [key]: value }));

  async function save() {
    if (!loggedIn) {
      try { localStorage.setItem('emilie-project-path', JSON.stringify(answers)); } catch { /* ignore */ }
      router.push('/inscription?next=/compte');
      return;
    }
    setFeedback('Enregistrement…');
    const response = await fetch('/api/account/project', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(answers) });
    setFeedback(response.ok ? 'Parcours ajouté à votre profil et à vos favoris.' : 'Impossible d’enregistrer pour le moment.');
  }

  return (
    <section className="bg-[#f3ece5]">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 lg:grid-cols-[0.85fr_1.15fr] lg:py-24">
        <div>
          <p className="font-ui text-xs uppercase tracking-[0.22em] text-[var(--color-gold)]">Votre projet, votre bibliothèque</p>
          <h2 className="mt-4 font-display text-4xl leading-tight text-[var(--color-bordeaux)] sm:text-5xl">Où en êtes-vous dans votre projet?</h2>
          <p className="mt-5 font-body text-lg text-[var(--color-ink)]/70">Quelques réponses suffisent pour composer un parcours de lecture clair et le suivre depuis votre profil.</p>
          <div className="mt-8 grid grid-cols-2 gap-3">
            <label className="font-ui text-xs text-[var(--color-ink)]/60">Objectif
              <select value={answers.stage} onChange={(event) => update('stage', event.target.value)} className={`mt-2 ${fieldClass}`}>
                <option value="acheter">Je veux acheter</option><option value="vendre">Je veux vendre</option><option value="investir">J’investis</option><option value="proprietaire">Je suis propriétaire</option><option value="marche">Comprendre le marché</option>
              </select>
            </label>
            <label className="font-ui text-xs text-[var(--color-ink)]/60">Secteur
              <select value={answers.area} onChange={(event) => update('area', event.target.value)} className={`mt-2 ${fieldClass}`}>
                <option value="montreal">Montréal</option><option value="laval-rive-nord">Laval / Rive-Nord</option><option value="ailleurs">Ailleurs au Québec</option>
              </select>
            </label>
            <label className="font-ui text-xs text-[var(--color-ink)]/60">Propriété
              <select value={answers.propertyType} onChange={(event) => update('propertyType', event.target.value)} className={`mt-2 ${fieldClass}`}>
                <option value="condo">Condo</option><option value="maison">Maison</option><option value="plex">Plex</option><option value="indecis">Je ne sais pas encore</option>
              </select>
            </label>
            <label className="font-ui text-xs text-[var(--color-ink)]/60">Budget
              <select value={answers.budget} onChange={(event) => update('budget', event.target.value)} className={`mt-2 ${fieldClass}`}>
                <option value="moins-500">Moins de 500 k$</option><option value="500-700">500–700 k$</option><option value="700-plus">700 k$ et plus</option><option value="indecis">À déterminer</option>
              </select>
            </label>
          </div>
        </div>

        <div className="rounded-3xl border border-white/80 bg-white/80 p-5 shadow-xl shadow-[#6e1226]/5 backdrop-blur sm:p-8">
          <div className="flex items-end justify-between gap-4">
            <div><p className="font-ui text-xs uppercase tracking-[0.16em] text-[var(--color-gold)]">Parcours recommandé</p><h3 className="mt-1 font-display text-2xl">6 guides, dans le bon ordre</h3></div>
            <span className="font-ui text-xs text-[var(--color-ink)]/45">0 / 6</span>
          </div>
          <ol className="mt-5 space-y-2">
            {recommendations.map((book, index) => (
              <li key={book.slug}><Link href={`/livre/${book.slug}`} className="flex min-h-12 items-center gap-4 rounded-xl border border-transparent px-3 py-2 transition hover:border-[var(--color-sand)] hover:bg-white"><span className="font-display text-lg text-[var(--color-gold)]">{index + 1}</span><span className="font-body text-[var(--color-bordeaux)]">{book.title}</span></Link></li>
            ))}
          </ol>
          <button onClick={save} className="mt-6 min-h-12 w-full rounded-full bg-[var(--color-bordeaux)] px-5 font-ui text-sm font-medium text-white transition hover:bg-[var(--color-bordeaux-dark)]">
            {loggedIn ? 'Enregistrer dans mon profil' : 'Créer mon profil et sauvegarder'}
          </button>
          {feedback && <p className="mt-3 text-center font-ui text-xs text-[var(--color-ink)]/60" aria-live="polite">{feedback}</p>}
        </div>
      </div>
    </section>
  );
}

