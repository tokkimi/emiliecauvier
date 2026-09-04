'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import type { Locale } from '@/lib/i18n';

type Reply = { answer: string; guides: { slug: string; title: string; pages: string }[] };

export function AskEmilie({ locale }: { locale: Locale }) {
  const t = locale === 'en'
    ? {
        title: 'Ask Emilie',
        subtitle: 'La Bibliothèque assistant',
        aria: 'Ask Emilie',
        close: 'Close messaging',
        intro: 'Ask a question about buying, selling, financing or investing. I will point you only to Emilie’s guides.',
        more: 'To go further',
        open: 'Open guide →',
        label: 'Your question',
        placeholder: 'Ex. What costs should I plan for a first purchase?',
        searching: 'Searching…',
        another: 'Ask another question',
        submit: 'Get my resources',
        unavailable: 'Question unavailable.',
        badge: 'Document assistant',
      }
    : {
        title: 'Demandez à Emilie',
        subtitle: 'Assistant de La Bibliothèque',
        aria: 'Demandez à Emilie',
        close: 'Fermer la messagerie',
        intro: 'Posez une question sur l’achat, la vente, le financement ou l’investissement. Je vous orienterai uniquement vers les guides d’Emilie.',
        more: 'Pour aller plus loin',
        open: 'Ouvrir le guide →',
        label: 'Votre question',
        placeholder: 'Ex. Quels frais prévoir pour un premier achat?',
        searching: 'Recherche…',
        another: 'Poser une autre question',
        submit: 'Obtenir mes ressources',
        unavailable: 'Question indisponible.',
        badge: 'Assistant documentaire',
      };
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [reply, setReply] = useState<Reply | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [open]);

  async function ask(event: FormEvent) {
    event.preventDefault();
    setBusy(true); setError('');
    try {
      const response = await fetch('/api/assistant', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question, locale }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? t.unavailable);
      setReply(data);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t.unavailable);
    } finally { setBusy(false); }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      {open && (
        <section role="dialog" aria-label={t.aria} className="flex max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-[390px] flex-col overflow-hidden rounded-3xl border border-white/60 bg-[var(--color-cream)]/95 shadow-2xl backdrop-blur-xl sm:mb-3 sm:max-h-[720px]">
          <header className="flex items-center justify-between bg-[#4b4545] px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-bibliotheque.png" alt="" className="h-10 w-12 rounded-xl bg-[var(--color-cream)] object-contain p-1.5" />
              <div><p className="font-ui text-sm font-semibold">{t.title}</p><p className="font-ui text-[0.65rem] text-white/60">{t.subtitle}</p></div>
            </div>
            <button onClick={() => setOpen(false)} aria-label={t.close} className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-xl">×</button>
          </header>
          <div className="min-h-0 flex-1 overscroll-contain overflow-y-auto p-5">
            {!reply ? <p className="font-body text-sm text-[var(--color-ink)]/65">{t.intro}</p> : (
              <div>
                <p className="rounded-2xl bg-[#f3ece5] p-4 font-body text-sm leading-relaxed">{reply.answer}</p>
                <p className="mt-4 font-ui text-[0.65rem] uppercase tracking-[0.14em] text-[var(--color-gold)]">{t.more}</p>
                <ul className="mt-2 space-y-2">{reply.guides.map((guide) => <li key={guide.slug}><Link href={`/livre/${guide.slug}`} onClick={() => setOpen(false)} className="block rounded-xl border border-[var(--color-sand)] bg-white p-3 font-body text-sm text-[var(--color-bordeaux)] transition hover:border-[var(--color-gold)]"><strong>{guide.title}</strong><span className="mt-1 flex justify-between gap-3 font-ui text-[0.7rem] text-[var(--color-ink)]/50"><span>{guide.pages}</span><span>{t.open}</span></span></Link></li>)}</ul>
              </div>
            )}
            {error && <p className="mt-3 font-ui text-xs text-red-700">{error}</p>}
          </div>
          <form onSubmit={ask} className="border-t border-[var(--color-sand)] p-4">
            <label className="sr-only" htmlFor="ask-emilie">{t.label}</label>
            <textarea id="ask-emilie" value={question} onChange={(event) => setQuestion(event.target.value)} required minLength={3} maxLength={500} rows={2} placeholder={t.placeholder} className="w-full touch-manipulation resize-none rounded-2xl border border-[var(--color-sand)] bg-white px-4 py-3 font-ui text-base outline-none focus:border-[var(--color-gold)]" />
            <button disabled={busy} className="mt-2 min-h-11 w-full rounded-full bg-[var(--color-bordeaux)] px-5 font-ui text-sm font-medium text-white disabled:opacity-50">{busy ? t.searching : reply ? t.another : t.submit}</button>
          </form>
        </section>
      )}
      <button onClick={() => setOpen((value) => !value)} aria-expanded={open} className={`${open ? 'hidden sm:flex' : 'flex'} min-h-16 items-center gap-3 rounded-[28px] border border-white/40 bg-[#4b4545]/95 px-3 pr-5 text-left text-white shadow-xl backdrop-blur transition hover:-translate-y-0.5`}>
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-cream)] p-1.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-bibliotheque.png" alt="" className="h-full w-full object-contain" />
        </span>
        <span><strong className="block font-ui text-sm">{t.title}</strong><span className="font-ui text-[0.68rem] text-white/60">{t.badge}</span></span>
        <span className="ml-1 h-3 w-3 rounded-full border-2 border-white/50 bg-[#9be3a6] shadow-[0_0_0_5px_rgba(155,227,166,0.15)]" />
      </button>
    </div>
  );
}
