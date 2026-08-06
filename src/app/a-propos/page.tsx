import Link from 'next/link';
import type { Metadata } from 'next';
import { BRAND } from '@/lib/format';
import { getT } from '@/lib/i18n';

export const metadata: Metadata = {
  title: 'À propos · About',
  description:
    'Courtière immobilière résidentielle dans le Grand Montréal, Émilie Cauvier accompagne acheteurs, vendeurs et investisseurs — et partage son expérience du terrain dans La Bibliothèque.',
};

export default async function AproposPage() {
  const t = await getT();
  return (
    <div>
      {/* HERO */}
      <section className="bg-[var(--color-bordeaux)] text-[var(--color-cream)]">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 sm:py-20 lg:grid-cols-[1fr_1.2fr]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/photos/emilie-1.jpg"
            alt="Émilie Cauvier"
            className="mx-auto w-full max-w-sm rounded-3xl object-cover shadow-lg"
          />
          <div>
            <p className="font-ui text-xs uppercase tracking-[0.28em] text-[var(--color-gold-soft)]">{t.about_eyebrow}</p>
            <h1 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">Émilie Cauvier</h1>
            <p className="mt-4 max-w-xl font-body text-lg text-white/85">{t.about_role}</p>
          </div>
        </div>
      </section>

      {/* BIO */}
      <section className="mx-auto max-w-3xl px-5 py-16">
        <div className="space-y-5 font-body text-lg leading-relaxed text-[var(--color-ink)]/85">
          <p>{t.about_p1}</p>
          <p>
            {t.about_p2_pre}
            <span className="font-display text-[var(--color-bordeaux)]">La Bibliothèque</span>
            {t.about_p2_post}
          </p>
          <p>{t.about_p3}</p>
        </div>

        {/* Valeurs */}
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {[
            [t.about_v1_t, t.about_v1_d],
            [t.about_v2_t, t.about_v2_d],
            [t.about_v3_t, t.about_v3_d],
          ].map(([tt, d]) => (
            <div key={tt} className="rounded-2xl border border-[var(--color-sand)] bg-white p-6">
              <h3 className="font-display text-xl text-[var(--color-bordeaux)]">{tt}</h3>
              <p className="mt-2 font-body text-sm text-[var(--color-ink)]/70">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PORTRAIT + CTA */}
      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="grid items-center gap-10 rounded-3xl border border-[var(--color-sand)] bg-white p-8 sm:p-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h2 className="font-display text-3xl text-[var(--color-ink)]">{t.about_cta_t}</h2>
            <p className="mt-3 max-w-xl font-body text-[var(--color-ink)]/75">{t.about_cta_d}</p>
            <div className="mt-6 flex flex-wrap gap-3 font-ui text-sm">
              <Link
                href="/catalogue"
                className="rounded-full bg-[var(--color-bordeaux)] px-6 py-3 font-medium text-white transition hover:bg-[var(--color-bordeaux-dark)]"
              >
                {t.about_cta_explore}
              </Link>
              <Link
                href="/abonnement"
                className="rounded-full border border-[var(--color-bordeaux)] px-6 py-3 font-medium text-[var(--color-bordeaux)] transition hover:bg-[var(--color-sand)]"
              >
                {t.about_cta_sub}
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
