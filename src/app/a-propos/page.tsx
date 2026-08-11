import Link from 'next/link';
import type { Metadata } from 'next';
import { getT } from '@/lib/i18n';

export const metadata: Metadata = {
  title: 'À propos · About',
  description:
    'Courtier immobilier résidentiel & commercial dans le Grand Montréal, Emilie Cauvier accompagne acheteurs, vendeurs et investisseurs — et partage son expérience du terrain dans La Bibliothèque.',
};

export default async function AproposPage() {
  const t = await getT();
  return (
    <div>
      {/* BIO */}
      <section className="mx-auto max-w-3xl px-5 pt-16 pb-16">
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
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/photos/emilie-2.jpg"
            alt="Emilie Cauvier"
            className="mx-auto w-full max-w-xs rounded-3xl object-cover shadow-md"
          />
        </div>
      </section>
    </div>
  );
}
