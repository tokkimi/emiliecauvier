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
        <div className="relative z-10 mx-auto max-w-6xl px-5 py-14 sm:py-24">
          <p className="font-ui text-xs uppercase tracking-[0.28em] text-[var(--color-gold-soft)] animate-fade-up">
            {t.home_eyebrow}
          </p>
          <h1 className="mt-5 max-w-3xl text-balance font-display text-4xl leading-[1.12] tracking-[-0.025em] sm:text-6xl animate-fade-up">
            {t.home_title}
          </h1>
          <p className="mt-6 max-w-2xl font-body text-lg text-white/80 animate-fade-up">
            {t.home_subtitle_pre}
          </p>
          <div className="mt-8 flex flex-wrap gap-3 font-ui text-sm sm:text-base animate-fade-up">
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
      <section className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3 sm:mb-8">
          <h2 className="font-display text-3xl tracking-[-0.02em] text-[var(--color-ink)]">{t.home_selection}</h2>
          <Link href="/catalogue" className="font-ui text-xs text-[var(--color-bordeaux)] underline-offset-4 hover:underline sm:text-sm">
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
        <div className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
          <div className="mb-8 max-w-3xl">
            <p className="font-ui text-xs uppercase tracking-[0.2em] text-[var(--color-gold)]">{t.home_project_eyebrow}</p>
            <h2 className="mt-3 text-balance font-display text-3xl leading-tight tracking-[-0.02em] text-[var(--color-ink)] sm:text-4xl">
              {t.home_project_title}
            </h2>
            <p className="mt-4 font-body text-lg text-[var(--color-ink)]/65">
              {t.home_project_desc}
            </p>
          </div>
          <ProjectPathBuilder loggedIn={Boolean(session?.user)} locale={locale} embedded />
        </div>
      </section>

      {/* PROMESSE */}
      <section className="mx-auto max-w-6xl px-5 pb-6 pt-12 sm:pt-16">
        <div className="grid gap-8 sm:grid-cols-3">
          {[
            [t.home_promise_1_t, t.home_promise_1_d],
            [t.home_promise_2_t, t.home_promise_2_d],
            [t.home_promise_3_t, t.home_promise_3_d],
          ].map(([tt, d]) => (
            <div key={tt} className="rounded-2xl border border-[var(--color-sand)] bg-white p-6 shadow-[0_4px_20px_rgba(46,31,24,0.025)] sm:p-7">
              <span aria-hidden="true" className="mb-5 block h-px w-8 bg-[var(--color-gold-soft)]" />
              <h3 className="font-display text-xl text-[var(--color-bordeaux)]">{tt}</h3>
              <p className="mt-3 font-body text-[var(--color-ink)]/75">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* OUTILS */}
      <section className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <p className="font-ui text-xs uppercase tracking-[0.2em] text-[var(--color-gold)]">{t.home_tools_eyebrow}</p>
            <h2 className="mt-3 text-balance font-display text-3xl leading-tight tracking-[-0.02em] text-[var(--color-ink)] sm:text-4xl">{t.home_tools_title}</h2>
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
              <span className="ml-3 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-sand)] text-[var(--color-bordeaux)]" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="10" width="14" height="11" rx="3" /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" /></svg>
              </span>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                [t.tool_capacity, 'M3 10 12 3l9 7M5 9v12h14V9M9 21v-7h6v7'],
                [t.tool_down_payment, 'M4 8h16v12H4zM4 8V5h13v3M16 13h4M8 12h3'],
                [t.tool_welcome_tax, 'M6 3h12v18l-3-2-3 2-3-2-3 2V3M9 7h6M9 11h6M9 15h3'],
                [t.tool_monthly, 'M4 5h16v16H4zM8 3v4M16 3v4M4 10h16M8 14h2M14 14h2M8 17h2'],
                [t.tool_profitability, 'M4 3v17h17M7 15l4-5 4 2 5-7M16 5h4v4'],
                [t.tool_checklist, 'm3 6 2 2 3-4M11 6h10m-18 7 2 2 3-4M11 13h10M11 20h10M4 20h3'],
              ].map(([label, path]) => (
                <div key={label} className="flex items-center gap-3 rounded-2xl border border-[var(--color-sand)] bg-[#fbfaf8] px-4 py-3.5 font-ui text-sm text-[var(--color-ink)]/80">
                  <svg aria-hidden="true" className="h-5 w-5 shrink-0 text-[var(--color-gold)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={path} /></svg>
                  {label}
                </div>
              ))}
            </div>
            <p className="mt-5 font-body text-sm text-[var(--color-ink)]/60">
              {t.home_tools_unlock}
            </p>
          </div>
        </div>
      </section>

      {/* COLLECTIONS */}
      <section className="mx-auto max-w-6xl px-5 pb-12 pt-4 sm:pb-16">
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
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 sm:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
          <div>
            <h2 className="text-balance font-display text-3xl leading-tight tracking-[-0.02em] sm:text-4xl">{t.home_sub_title}</h2>
            <p className="mt-4 font-body text-white/75">{t.home_sub_desc}</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col rounded-2xl border border-white/15 bg-white/5 p-6">
              <p className="font-ui text-xs uppercase tracking-[0.16em] text-[var(--color-gold-soft)]">{t.home_unit}</p>
              <p className="mt-3 whitespace-nowrap font-display text-3xl">{formatPrice(BRAND.unitCents)}</p>
              <p className="mt-1 font-ui text-sm text-white/60">{t.home_unit_per}</p>
              <ul className="mb-6 mt-5 flex-1 space-y-3 font-body text-base text-white/80">
                <li>{t.home_unit_f1}</li>
                <li>{t.home_unit_f2}</li>
                <li>{t.home_unit_f3}</li>
              </ul>
              <Link href="/catalogue" className="block rounded-full bg-white/10 px-3 py-3 text-center font-ui text-sm transition hover:bg-white/20">
                {t.home_unit_cta}
              </Link>
            </div>
            <div className="flex flex-col rounded-2xl border border-[var(--color-gold)] bg-[var(--color-bordeaux)] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
              <p className="font-ui text-xs uppercase tracking-[0.16em] text-[var(--color-gold-soft)]">{t.home_sub}</p>
              <p className="mt-3 font-display text-3xl"><span className="whitespace-nowrap">{formatPrice(BRAND.subscriptionCents)}</span><span className="ml-1 inline-block font-ui text-sm text-white/75">{t.per_month}</span></p>
              <p className="mt-1 font-ui text-sm text-white/70">{t.home_sub_per}</p>
              <ul className="mb-6 mt-5 flex-1 space-y-3 font-body text-base text-white/90">
                <li>{t.home_sub_f1}</li>
                <li>{t.home_sub_f2}</li>
                <li>{t.home_sub_f3}</li>
                <li>{t.home_sub_f4}</li>
              </ul>
              <Link href="/inscription?plan=abonnement" className="block rounded-full bg-[var(--color-cream)] px-3 py-3 text-center font-ui text-sm font-medium text-[var(--color-bordeaux)] transition hover:bg-white">
                {t.home_sub_cta}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
