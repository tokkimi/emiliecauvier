'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { recommendBooks, type ProjectAnswers } from '@/lib/recommendations';
import { localizeBook } from '@/data/booksEn';
import type { Locale } from '@/lib/i18n';

const fieldClass = 'w-full rounded-xl border border-[var(--color-sand)] bg-white px-4 py-3 font-ui text-sm outline-none focus:border-[var(--color-gold)]';

const tx = {
  fr: {
    eyebrow: 'Votre projet, votre bibliothèque',
    title: 'Où en êtes-vous dans votre projet?',
    desc: 'Quelques réponses suffisent pour composer un parcours de lecture clair et le suivre depuis votre profil.',
    objective: 'Objectif',
    area: 'Secteur',
    property: 'Propriété',
    budget: 'Budget',
    saveLogged: 'Enregistrer dans mon profil',
    saveGuest: 'Créer mon profil et sauvegarder',
    saving: 'Enregistrement…',
    saved: 'Parcours ajouté à votre profil et à vos favoris.',
    saveError: 'Impossible d’enregistrer pour le moment.',
    recommended: 'Parcours recommandé',
    ordered: '6 guides, dans le bon ordre',
    progress: '0 / 6',
    options: {
      acheter: 'Je veux acheter',
      vendre: 'Je veux vendre',
      investir: 'J’investis',
      proprietaire: 'Je suis propriétaire',
      marche: 'Comprendre le marché',
      montreal: 'Montréal',
      laval: 'Laval / Rive-Nord',
      ailleurs: 'Ailleurs au Québec',
      condo: 'Condo',
      maison: 'Maison',
      plex: 'Plex',
      indecis: 'Je ne sais pas encore',
      moins500: 'Moins de 500 k$',
      budget500700: '500–700 k$',
      plus700: '700 k$ et plus',
      aDeterminer: 'À déterminer',
    },
  },
  en: {
    eyebrow: 'Your project, your library',
    title: 'Where are you in your real estate journey?',
    desc: 'A few answers are enough to build a clear reading path and track it from your profile.',
    objective: 'Goal',
    area: 'Area',
    property: 'Property',
    budget: 'Budget',
    saveLogged: 'Save to my profile',
    saveGuest: 'Create my profile and save',
    saving: 'Saving…',
    saved: 'Your path has been added to your profile and favourites.',
    saveError: 'Unable to save right now.',
    recommended: 'Recommended path',
    ordered: '6 guides, in the right order',
    progress: '0 / 6',
    options: {
      acheter: 'I want to buy',
      vendre: 'I want to sell',
      investir: 'I’m investing',
      proprietaire: 'I’m already an owner',
      marche: 'Understand the market',
      montreal: 'Montreal',
      laval: 'Laval / North Shore',
      ailleurs: 'Elsewhere in Quebec',
      condo: 'Condo',
      maison: 'House',
      plex: 'Plex',
      indecis: 'I’m not sure yet',
      moins500: 'Under $500k',
      budget500700: '$500k–$700k',
      plus700: '$700k and up',
      aDeterminer: 'To be determined',
    },
  },
};

export function ProjectPathBuilder({ loggedIn, locale }: { loggedIn: boolean; locale: Locale }) {
  const router = useRouter();
  const [answers, setAnswers] = useState<ProjectAnswers>({ stage: 'acheter', area: 'montreal', propertyType: 'condo', budget: '500-700' });
  const [feedback, setFeedback] = useState('');
  const recommendations = useMemo(() => recommendBooks(answers), [answers]);
  const t = tx[locale];

  const update = (key: keyof ProjectAnswers, value: string) => setAnswers((current) => ({ ...current, [key]: value }));

  async function save() {
    if (!loggedIn) {
      try { localStorage.setItem('emilie-project-path', JSON.stringify(answers)); } catch { /* ignore */ }
      router.push('/inscription?next=/compte');
      return;
    }
    setFeedback(t.saving);
    const response = await fetch('/api/account/project', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(answers) });
    setFeedback(response.ok ? t.saved : t.saveError);
  }

  return (
    <section className="bg-[#f3ece5]">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 lg:grid-cols-[0.85fr_1.15fr] lg:py-24">
        <div>
          <p className="font-ui text-xs uppercase tracking-[0.22em] text-[var(--color-gold)]">{t.eyebrow}</p>
          <h2 className="mt-4 font-display text-4xl leading-tight text-[var(--color-bordeaux)] sm:text-5xl">{t.title}</h2>
          <p className="mt-5 font-body text-lg text-[var(--color-ink)]/70">{t.desc}</p>
          <div className="mt-8 grid grid-cols-2 gap-3">
            <label className="font-ui text-xs text-[var(--color-ink)]/60">{t.objective}
              <select value={answers.stage} onChange={(event) => update('stage', event.target.value)} className={`mt-2 ${fieldClass}`}>
                <option value="acheter">{t.options.acheter}</option><option value="vendre">{t.options.vendre}</option><option value="investir">{t.options.investir}</option><option value="proprietaire">{t.options.proprietaire}</option><option value="marche">{t.options.marche}</option>
              </select>
            </label>
            <label className="font-ui text-xs text-[var(--color-ink)]/60">{t.area}
              <select value={answers.area} onChange={(event) => update('area', event.target.value)} className={`mt-2 ${fieldClass}`}>
                <option value="montreal">{t.options.montreal}</option><option value="laval-rive-nord">{t.options.laval}</option><option value="ailleurs">{t.options.ailleurs}</option>
              </select>
            </label>
            <label className="font-ui text-xs text-[var(--color-ink)]/60">{t.property}
              <select value={answers.propertyType} onChange={(event) => update('propertyType', event.target.value)} className={`mt-2 ${fieldClass}`}>
                <option value="condo">{t.options.condo}</option><option value="maison">{t.options.maison}</option><option value="plex">{t.options.plex}</option><option value="indecis">{t.options.indecis}</option>
              </select>
            </label>
            <label className="font-ui text-xs text-[var(--color-ink)]/60">{t.budget}
              <select value={answers.budget} onChange={(event) => update('budget', event.target.value)} className={`mt-2 ${fieldClass}`}>
                <option value="moins-500">{t.options.moins500}</option><option value="500-700">{t.options.budget500700}</option><option value="700-plus">{t.options.plus700}</option><option value="indecis">{t.options.aDeterminer}</option>
              </select>
            </label>
          </div>
        </div>

        <div className="rounded-3xl border border-white/80 bg-white/80 p-5 shadow-xl shadow-[#6e1226]/5 backdrop-blur sm:p-8">
          <div className="flex items-end justify-between gap-4">
            <div><p className="font-ui text-xs uppercase tracking-[0.16em] text-[var(--color-gold)]">{t.recommended}</p><h3 className="mt-1 font-display text-2xl">{t.ordered}</h3></div>
            <span className="font-ui text-xs text-[var(--color-ink)]/45">{t.progress}</span>
          </div>
          <ol className="mt-5 space-y-2">
            {recommendations.map((book, index) => (
              <li key={book.slug}><Link href={`/livre/${book.slug}`} className="flex min-h-12 items-center gap-4 rounded-xl border border-transparent px-3 py-2 transition hover:border-[var(--color-sand)] hover:bg-white"><span className="font-display text-lg text-[var(--color-gold)]">{index + 1}</span><span className="font-body text-[var(--color-bordeaux)]">{localizeBook(book, locale).title}</span></Link></li>
            ))}
          </ol>
          <button onClick={save} className="mt-6 min-h-12 w-full rounded-full bg-[var(--color-bordeaux)] px-5 font-ui text-sm font-medium text-white transition hover:bg-[var(--color-bordeaux-dark)]">
            {loggedIn ? t.saveLogged : t.saveGuest}
          </button>
          {feedback && <p className="mt-3 text-center font-ui text-xs text-[var(--color-ink)]/60" aria-live="polite">{feedback}</p>}
        </div>
      </div>
    </section>
  );
}
