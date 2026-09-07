'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

type Demo = { title: string; chapter: string; excerpt: string; question: string; options: string[]; answer: number; explanation: string };

export function SubscriptionExperience({ locale, demo, count }: { locale: 'fr' | 'en'; demo: Demo; count: number }) {
  const en = locale === 'en';
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const [choice, setChoice] = useState<number | null>(null);
  const [reduced, setReduced] = useState(false);
  const section = useRef<HTMLElement>(null);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update(); media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    if (paused || reduced) return;
    let visible = false;
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; });
    if (section.current) observer.observe(section.current);
    const timer = window.setInterval(() => {
      if (visible && !document.hidden) setStep(value => (value + 1) % 3);
    }, 6500);
    return () => { observer.disconnect(); window.clearInterval(timer); };
  }, [paused, reduced]);
  const labels = en ? ['Read at your pace', 'Test your knowledge', 'See your progress'] : ['Lisez à votre rythme', 'Testez vos connaissances', 'Visualisez vos progrès'];
  const descriptions = en ? [
    'Read by chapter, then pick up where you left off from your account.',
    'Answer the online quizzes and understand each answer with the explanations.',
    'Find your reading progress and saved quiz results together in your profile.',
  ] : [
    'Avancez chapitre par chapitre, puis reprenez votre lecture depuis votre compte.',
    'Répondez aux quiz en ligne et comprenez chaque réponse grâce aux corrigés.',
    'Retrouvez votre progression de lecture et vos résultats de quiz enregistrés dans votre profil.',
  ];
  const correct = choice === null || choice === demo.answer;
  return (
    <section ref={section} aria-labelledby="experience-title" className="bg-[#f5f0e9] px-5 py-14 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-2xl">
          <p className="font-ui text-[0.68rem] uppercase tracking-[0.22em] text-[var(--color-bordeaux)]">{en ? 'Your personal reading space' : 'Votre espace de lecture personnel'}</p>
          <h2 id="experience-title" className="mt-3 font-display text-4xl leading-tight sm:text-5xl">{en ? 'More than reading. A clearer way forward.' : 'Plus qu’une lecture. Un projet qui avance.'}</h2>
          <p className="mt-4 font-body text-lg text-[var(--color-ink)]/70">{en ? `${count} guides to explore, online quizzes and a profile that keeps track of your progress.` : `${count} guides à explorer, des quiz en ligne et un profil qui garde le fil de vos progrès.`}</p>
        </div>
        <div className="grid items-center gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <div>
            <div className="space-y-2" aria-label={en ? 'Choose a preview' : 'Choisir un aperçu'}>
              {labels.map((label, index) => (
                <button key={label} type="button" aria-pressed={step === index} aria-controls="subscription-demo" onClick={() => { setStep(index); setPaused(true); }} className={`flex w-full gap-4 rounded-2xl border p-4 text-left transition-colors sm:p-5 ${step === index ? 'border-[#d8c6b0] bg-white shadow-sm' : 'border-transparent hover:bg-white/60'}`}>
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-ui text-xs ${step === index ? 'bg-[var(--color-bordeaux)] text-white' : 'border border-[#d8c6b0] text-[var(--color-bordeaux)]'}`}>0{index + 1}</span>
                  <span><span className="block font-display text-xl text-[var(--color-bordeaux)]">{label}</span><span className="mt-1 block font-ui text-sm leading-relaxed text-[var(--color-ink)]/65">{descriptions[index]}</span></span>
                </button>
              ))}
            </div>
            {!reduced && <button type="button" onClick={() => setPaused(value => !value)} className="mt-4 px-5 py-2 font-ui text-xs text-[var(--color-bordeaux)] underline underline-offset-4">{paused ? (en ? 'Play the preview' : 'Animer l’aperçu') : (en ? 'Pause animation' : 'Mettre l’animation en pause')}</button>}
            <p className="mt-4 px-5 font-ui text-xs leading-relaxed text-[var(--color-ink)]/55">{en ? 'Interactive demonstration. Sample progress, not your personal data.' : 'Démonstration interactive. Progression illustrée, pas vos données personnelles.'}</p>
          </div>
          <div id="subscription-demo" className="overflow-hidden rounded-[1.75rem] border border-[#d8c6b0] bg-white shadow-[0_24px_65px_-30px_#59412e55]">
            <div className="flex items-center justify-between gap-3 border-b border-[#eee5da] bg-[#fcfaf7] px-5 py-4"><span className="font-display text-lg text-[var(--color-bordeaux)]">La Bibliothèque</span><span className="rounded-full bg-[#ece5da] px-3 py-1 font-ui text-[0.65rem]">{en ? 'Preview' : 'Aperçu'}</span></div>
            <div className="min-h-[480px] p-5 sm:min-h-[440px] sm:p-7">
              <div className="mb-6 flex items-center gap-4">
                <Image src={en ? '/covers-en/1.webp' : '/covers/1.jpg'} alt={demo.title} width={64} height={96} className="h-24 w-16 rounded-md object-cover shadow-sm" />
                <div className="min-w-0"><p className="font-ui text-[0.62rem] uppercase tracking-[0.16em] text-[var(--color-gold)]">{en ? 'Buyers · Guide 01' : 'Acheteurs · Guide 01'}</p><h3 className="mt-2 font-display text-xl leading-tight text-[var(--color-bordeaux)] sm:text-2xl">{demo.title}</h3></div>
              </div>
              <div key={step} className="subscription-demo-enter">
                {step === 0 && <>
                  <div className="mb-5 flex justify-between font-ui text-xs text-[var(--color-ink)]/60"><span>{en ? 'Reading progress · example' : 'Progression de lecture · exemple'}</span><span>32 %</span></div>
                  <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-[#eee5da]"><div className="subscription-demo-progress h-full w-[32%] rounded-full bg-[var(--color-gold)]" /></div>
                  <h4 className="font-display text-2xl">{demo.chapter}</h4><p className="mt-3 font-body text-base leading-relaxed text-[var(--color-ink)]/75">{demo.excerpt}</p>
                  <Link href="/lire/devenir-proprietaire-au-quebec" className="mt-6 inline-block rounded-full border border-[var(--color-bordeaux)] px-5 py-2.5 font-ui text-xs text-[var(--color-bordeaux)]">{en ? 'Open the real reading preview →' : 'Ouvrir le véritable extrait →'}</Link>
                </>}
                {step === 1 && <>
                  <p className="font-ui text-[0.65rem] uppercase tracking-[0.15em] text-[var(--color-gold)]">{en ? 'Try a question from the guide' : 'Essayez une question du guide'}</p><h4 className="mt-3 font-display text-xl leading-snug">{demo.question}</h4>
                  <div className="mt-4 space-y-2">{demo.options.map((option, index) => <button type="button" key={option} onClick={() => { setChoice(index); setStep(2); setPaused(true); }} className="flex w-full items-start gap-3 rounded-xl border border-[#e5dacd] px-4 py-3 text-left font-ui text-sm transition-colors hover:border-[var(--color-bordeaux)] hover:bg-[#faf5f0]"><span className="text-[var(--color-gold)]">{String.fromCharCode(65 + index)}.</span>{option}</button>)}</div>
                </>}
                {step === 2 && <>
                  <div className="flex items-center gap-5 rounded-2xl bg-[#f5f0e9] p-5"><span className="font-display text-5xl text-[var(--color-bordeaux)]">{correct ? '1' : '0'}<span className="text-2xl text-[var(--color-ink)]/40">/1</span></span><div><h4 className="font-display text-xl">{en ? 'An answer, explained.' : 'Une réponse, expliquée.'}</h4><p className="mt-1 font-ui text-xs text-[var(--color-ink)]/60">{choice === null ? (en ? 'Illustrative result' : 'Résultat d’illustration') : (en ? 'Your demonstration result · not saved' : 'Votre résultat de démonstration · non enregistré')}</p></div></div>
                  <p className="mt-5 font-ui text-sm font-medium text-[var(--color-bordeaux)]">{en ? 'Correct answer: ' : 'Bonne réponse : '}{demo.options[demo.answer]}</p><p className="mt-2 font-body text-sm leading-relaxed text-[var(--color-ink)]/70">{demo.explanation}</p>
                  <button type="button" onClick={() => { setChoice(null); setStep(1); setPaused(true); }} className="mt-4 py-2 font-ui text-xs text-[var(--color-bordeaux)] underline underline-offset-4">{en ? 'Try the question again' : 'Réessayer la question'}</button>
                </>}
              </div>
            </div>
            <div className="border-t border-[#eee5da] bg-[#fcfaf7] px-5 py-3 font-ui text-xs leading-relaxed text-[var(--color-ink)]/60">{en ? 'In your account: resume reading · saved quiz results · your tools' : 'Dans votre compte : reprise de lecture · résultats enregistrés · vos outils'}</div>
          </div>
        </div>
        <div className="mt-10 grid gap-5 border-t border-[#d8c6b0] pt-7 sm:grid-cols-3">
          {(en ? [['Read online', 'On mobile, tablet and computer, while your subscription is active.'], ['Keep track', 'Reading progress and quiz results in your personal account.'], ['Take action', 'Tools included with an active subscription, or unlocked after 3 ebook purchases.']] : [['Lisez en ligne', 'Sur mobile, tablette et ordinateur, pendant la durée de votre abonnement.'], ['Gardez le fil', 'Votre progression de lecture et vos résultats de quiz dans votre compte personnel.'], ['Passez à l’action', 'Outils inclus avec un abonnement actif, ou débloqués après 3 ebooks achetés.']]).map(([title, body]) => <div key={title}><h3 className="font-display text-xl text-[var(--color-bordeaux)]">{title}</h3><p className="mt-2 font-ui text-sm leading-relaxed text-[var(--color-ink)]/65">{body}</p></div>)}
        </div>
      </div>
    </section>
  );
}
