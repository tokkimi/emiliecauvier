import Link from 'next/link';
import { BOOKS, COLLECTIONS, type Collection } from '@/data/books';
import { BRAND, formatPrice } from '@/lib/format';
import { FeaturedCarousel } from '@/components/FeaturedCarousel';
import { getLocale, getT } from '@/lib/i18n';
import { localizeBook, COLLECTIONS_EN } from '@/data/booksEn';
import { ProjectPathBuilder } from '@/components/ProjectPathBuilder';
import { auth } from '@/lib/auth';

export default async function HomePage() {
  const locale = await getLocale();
  const t = await getT();
  const session = await auth().catch(() => null);
  const featured = BOOKS.slice(0, 6);
  const collections = Object.keys(COLLECTIONS) as Collection[];
  const col = (c: Collection) => (locale === 'en' ? COLLECTIONS_EN[c] ?? COLLECTIONS[c] : COLLECTIONS[c]);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[var(--color-bordeaux)] text-[var(--color-cream)]">
        <div className="mx-auto max-w-6xl px-5 py-24 sm:py-32">
          <p className="font-ui text-xs uppercase tracking-[0.28em] text-[var(--color-gold-soft)] animate-fade-up">
            {t.home_eyebrow}
          </p>
          <h1 className="mt-5 max-w-3xl font-display text-4xl leading-tight sm:text-6xl animate-fade-up">
            {t.home_title}
          </h1>
          <p className="mt-6 max-w-2xl font-body text-lg text-white/80 animate-fade-up">
            {t.home_subtitle_pre}
          </p>
          <div className="mt-10 flex flex-wrap gap-4 font-ui animate-fade-up">
            <Link
              href="/catalogue"
              className="rounded-full bg-[var(--color-cream)] px-7 py-3 font-medium text-[var(--color-bordeaux)] transition hover:bg-white"
            >
              {t.home_cta_explore}
            </Link>
            <Link
              href="/#abonnement"
              className="rounded-full border border-white/40 px-7 py-3 font-medium text-white transition hover:bg-white/10"
            >
              {t.home_cta_sub} {formatPrice(BRAND.subscriptionCents)}{t.per_month}
            </Link>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[var(--color-gold)]/20 blur-3xl" />
      </section>

      {/* SÉLECTION */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-3xl text-[var(--color-ink)]">{t.home_selection}</h2>
          <Link href="/catalogue" className="font-ui text-sm text-[var(--color-bordeaux)] hover:underline">
            {t.home_see_all}
          </Link>
        </div>
        <FeaturedCarousel
          locale={locale}
          items={featured.map((b) => {
            const loc = localizeBook(b, locale);
            return {
              slug: b.slug,
              number: b.number,
              collectionLabel: col(b.collection),
              title: loc.title,
              subtitle: loc.subtitle,
              price: formatPrice(b.priceCents),
            };
          })}
        />
      </section>

      {/* PARCOURS PERSONNALISÉ */}
      <section className="border-y border-[var(--color-sand)] bg-[#f7f2ec]">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
          <div className="mb-10 max-w-3xl">
            <p className="font-ui text-xs uppercase tracking-[0.2em] text-[var(--color-gold)]">{t.home_project_eyebrow}</p>
            <h2 className="mt-3 font-display text-3xl leading-tight text-[var(--color-ink)] sm:text-5xl">
              {t.home_project_title}
            </h2>
            <p className="mt-4 font-body text-lg text-[var(--color-ink)]/65">
              {t.home_project_desc}
            </p>
          </div>
          <ProjectPathBuilder loggedIn={Boolean(session?.user)} locale={locale} />
        </div>
      </section>

      {/* PROMESSE */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="grid gap-8 sm:grid-cols-3">
          {[
            [t.home_promise_1_t, t.home_promise_1_d],
            [t.home_promise_2_t, t.home_promise_2_d],
            [t.home_promise_3_t, t.home_promise_3_d],
          ].map(([tt, d]) => (
            <div key={tt} className="rounded-2xl border border-[var(--color-sand)] bg-white p-7">
              <h3 className="font-display text-xl text-[var(--color-bordeaux)]">{tt}</h3>
              <p className="mt-3 font-body text-[var(--color-ink)]/75">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* OUTILS */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <p className="font-ui text-xs uppercase tracking-[0.2em] text-[var(--color-gold)]">{t.home_tools_eyebrow}</p>
            <h2 className="mt-3 font-display text-4xl leading-tight text-[var(--color-ink)]">{t.home_tools_title}</h2>
            <p className="mt-4 font-body text-[var(--color-ink)]/65">
              {t.home_tools_desc}
            </p>
            <Link href={session?.user ? '/compte#outils' : '/inscription'} className="mt-6 inline-flex min-h-11 items-center rounded-full bg-[var(--color-bordeaux)] px-6 font-ui text-sm text-white">
              {session?.user ? t.home_tools_cta_logged : t.home_tools_cta_guest} →
            </Link>
          </div>
          <div className="rounded-3xl border border-[var(--color-sand)] bg-white p-5 shadow-[0_12px_40px_rgba(46,31,24,0.06)] sm:p-8">
            <div className="flex items-center justify-between border-b border-[var(--color-sand)] pb-4">
              <div>
                <p className="font-ui text-[0.65rem] uppercase tracking-[0.14em] text-[var(--color-gold)]">{t.home_tools_access}</p>
                <h3 className="mt-1 font-display text-2xl text-[var(--color-bordeaux)]">{t.home_tools_card_title}</h3>
              </div>
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-sand)] text-[var(--color-bordeaux)]" aria-hidden="true">🔒</span>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[t.tool_capacity, t.tool_down_payment, t.tool_welcome_tax, t.tool_monthly, t.tool_profitability, t.tool_checklist].map((label) => (
                <div key={label} className="rounded-2xl bg-[#f7f2ec] px-4 py-3 font-ui text-sm text-[var(--color-ink)]/70">{label}</div>
              ))}
            </div>
            <p className="mt-5 font-body text-sm text-[var(--color-ink)]/60">
              {t.home_tools_unlock}
            </p>
          </div>
        </div>
      </section>

      {/* COLLECTIONS */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="mb-6 font-display text-2xl text-[var(--color-ink)]">{t.home_collections}</h2>
        <div className="flex flex-wrap gap-3 font-ui">
          {collections.map((c) => (
            <Link
              key={c}
              href={`/catalogue?collection=${c}`}
              className="rounded-full border border-[var(--color-sand)] bg-white px-5 py-2 text-sm text-[var(--color-ink)] transition hover:border-[var(--color-bordeaux)] hover:text-[var(--color-bordeaux)]"
            >
              {col(c)}
            </Link>
          ))}
        </div>
      </section>

      {/* ABONNEMENT */}
      <section id="abonnement" className="bg-[var(--color-ink)] text-[var(--color-cream)]">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-24 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-4xl">{t.home_sub_title}</h2>
            <p className="mt-4 font-body text-white/75">{t.home_sub_desc}</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/15 bg-white/5 p-7">
              <p className="font-ui text-xs uppercase tracking-[0.16em] text-[var(--color-gold-soft)]">{t.home_unit}</p>
              <p className="mt-3 font-display text-4xl">{formatPrice(BRAND.unitCents)}</p>
              <p className="mt-1 font-ui text-sm text-white/60">{t.home_unit_per}</p>
              <ul className="mt-5 space-y-2 font-body text-sm text-white/80">
                <li>{t.home_unit_f1}</li>
                <li>{t.home_unit_f2}</li>
                <li>{t.home_unit_f3}</li>
              </ul>
              <Link href="/catalogue" className="mt-6 block rounded-full bg-white/10 py-3 text-center font-ui text-sm hover:bg-white/20">
                {t.home_unit_cta}
              </Link>
            </div>
            <div className="rounded-2xl border border-[var(--color-gold)] bg-[var(--color-bordeaux)] p-7">
              <p className="font-ui text-xs uppercase tracking-[0.16em] text-[var(--color-gold-soft)]">{t.home_sub}</p>
              <p className="mt-3 font-display text-4xl">{formatPrice(BRAND.subscriptionCents)}<span className="text-lg">{t.per_month}</span></p>
              <p className="mt-1 font-ui text-sm text-white/70">{t.home_sub_per}</p>
              <ul className="mt-5 space-y-2 font-body text-sm text-white/90">
                <li>{t.home_sub_f1}</li>
                <li>{t.home_sub_f2}</li>
                <li>{t.home_sub_f3}</li>
                <li>{t.home_sub_f4}</li>
              </ul>
              <Link href="/inscription?plan=abonnement" className="mt-6 block rounded-full bg-[var(--color-cream)] py-3 text-center font-ui text-sm font-medium text-[var(--color-bordeaux)] hover:bg-white">
                {t.home_sub_cta}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
