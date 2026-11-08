'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { trackItems } from '@/lib/measurement-items';

export function ChapterAccess({ slug, title, locale }: { slug: string; title: string; locale: 'fr' | 'en' }) {
  const router = useRouter();
  const en = locale === 'en';
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setError(false);
    try {
      const response = await fetch('/api/chapter-leads', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ slug, locale, email: form.get('email'), consent: form.has('consent'), marketing: form.has('marketing') }),
      });
      if (!response.ok) throw new Error('chapter');
      trackItems('generate_lead', [slug], locale);
      router.refresh();
    } catch {
      setError(true);
      setBusy(false);
    }
  }

  return <section className="mx-auto max-w-xl px-5 py-16">
    <h1 className="font-display text-4xl text-[var(--color-bordeaux)]">{title}</h1>
    <p className="mt-3 font-body">{en ? 'Unlock the first chapter for free.' : 'Débloquez gratuitement le premier chapitre.'}</p>
    <form onSubmit={submit} className="mt-6 grid gap-4 rounded-2xl border border-[var(--color-sand)] bg-white p-6 font-ui text-sm">
      <label className="grid gap-2">{en ? 'Email address' : 'Adresse courriel'}<input required type="email" name="email" autoComplete="email" maxLength={254} className="rounded-lg border border-[var(--color-sand)] p-3" /></label>
      <label className="flex items-start gap-2"><input className="mt-1" required name="consent" type="checkbox" />{en ? 'I agree to the collection of my email and the guide I selected to record access to the free chapter.' : 'J’accepte que mon courriel et le guide choisi soient recueillis pour enregistrer mon accès au chapitre gratuit.'}</label>
      <label className="flex items-start gap-2"><input className="mt-1" name="marketing" type="checkbox" />{en ? 'Optional: I agree to receive the Guides Immo Québec newsletter and offers by email. I can unsubscribe at any time.' : 'Facultatif : j’accepte de recevoir l’infolettre et les offres de Guides Immo Québec par courriel. Je peux me désabonner en tout temps.'}</label>
      <button disabled={busy} type="submit" className="rounded-full bg-[var(--color-bordeaux)] px-5 py-3 text-white disabled:opacity-60">{en ? 'Open the free chapter' : 'Accéder au chapitre gratuit'}</button>
      {error && <p role="alert">{en ? 'The chapter could not be opened. Please try again.' : 'Le chapitre n’a pas pu être ouvert. Réessayez.'}</p>}
    </form>
  </section>;
}
