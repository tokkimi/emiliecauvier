import Link from 'next/link';
import type { Metadata } from 'next';
import { BRAND } from '@/lib/format';

export const metadata: Metadata = {
  title: 'À propos d\'Émilie Cauvier',
  description:
    'Courtière immobilière résidentielle dans le Grand Montréal, Émilie Cauvier accompagne acheteurs, vendeurs et investisseurs — et partage son expérience du terrain dans La Bibliothèque.',
};

export default function AproposPage() {
  return (
    <div>
      {/* HERO */}
      <section className="bg-[var(--color-bordeaux)] text-[var(--color-cream)]">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 sm:py-20 lg:grid-cols-[1fr_1.2fr]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/photos/emilie-1.jpg"
            alt="Émilie Cauvier, courtière immobilière résidentielle"
            className="mx-auto w-full max-w-sm rounded-3xl object-cover shadow-lg"
          />
          <div>
            <p className="font-ui text-xs uppercase tracking-[0.28em] text-[var(--color-gold-soft)]">À propos</p>
            <h1 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">Émilie Cauvier</h1>
            <p className="mt-4 max-w-xl font-body text-lg text-white/85">
              Courtière immobilière résidentielle dans le Grand Montréal. J&apos;accompagne
              acheteurs, vendeurs et investisseurs à chaque étape — et je partage ici, en toute
              transparence, ce que j&apos;aurais aimé qu&apos;on m&apos;explique clairement.
            </p>
          </div>
        </div>
      </section>

      {/* BIO */}
      <section className="mx-auto max-w-3xl px-5 py-16">
        <div className="space-y-5 font-body text-lg leading-relaxed text-[var(--color-ink)]/85">
          <p>
            Acheter, vendre ou investir dans l&apos;immobilier, c&apos;est rarement une simple
            transaction : c&apos;est un projet de vie. Au fil des années, sur le terrain du Grand
            Montréal — Laval, la Rive-Nord, Montréal, Westmount — j&apos;ai vu les mêmes questions
            revenir, et les mêmes angles morts coûter cher à des gens de bonne foi.
          </p>
          <p>
            <span className="font-display text-[var(--color-bordeaux)]">La Bibliothèque</span> est
            née de cette envie : mettre à plat, guide après guide, ce qu&apos;il faut vraiment savoir.
            Des étapes concrètes, des chiffres du Québec, un plan d&apos;action — sans jargon et sans
            promesse creuse.
          </p>
          <p>
            Que vous achetiez à deux pour la première fois, que vous prépariez la vente de votre
            propriété ou que vous bâtissiez un portefeuille locatif, mon objectif reste le même :
            que vous décidiez en confiance, avec toute l&apos;information en main.
          </p>
        </div>

        {/* Valeurs */}
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {[
            ['Terrain', 'Une expérience concrète du Grand Montréal, pas de la théorie.'],
            ['Transparence', 'Les vrais chiffres, les vrais frais, les vrais délais.'],
            ['Accompagnement', 'Des repères clairs pour décider sereinement, à votre rythme.'],
          ].map(([t, d]) => (
            <div key={t} className="rounded-2xl border border-[var(--color-sand)] bg-white p-6">
              <h3 className="font-display text-xl text-[var(--color-bordeaux)]">{t}</h3>
              <p className="mt-2 font-body text-sm text-[var(--color-ink)]/70">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PORTRAIT + CTA */}
      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="grid items-center gap-10 rounded-3xl border border-[var(--color-sand)] bg-white p-8 sm:p-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h2 className="font-display text-3xl text-[var(--color-ink)]">
              Prêt à passer à l&apos;action ?
            </h2>
            <p className="mt-3 max-w-xl font-body text-[var(--color-ink)]/75">
              Parcourez les 48 guides de La Bibliothèque, à l&apos;unité ou par abonnement, et
              avancez dans votre projet immobilier avec un coup d&apos;avance.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 font-ui text-sm">
              <Link
                href="/catalogue"
                className="rounded-full bg-[var(--color-bordeaux)] px-6 py-3 font-medium text-white transition hover:bg-[var(--color-bordeaux-dark)]"
              >
                Explorer les guides
              </Link>
              <Link
                href="/#abonnement"
                className="rounded-full border border-[var(--color-bordeaux)] px-6 py-3 font-medium text-[var(--color-bordeaux)] transition hover:bg-[var(--color-sand)]"
              >
                Voir l&apos;abonnement
              </Link>
            </div>
            <p className="mt-6 font-ui text-sm text-[var(--color-ink)]/55">{BRAND.address}</p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/photos/emilie-2.jpg"
            alt="Émilie Cauvier"
            className="mx-auto w-full max-w-xs rounded-3xl object-cover shadow-md"
          />
        </div>
      </section>
    </div>
  );
}
