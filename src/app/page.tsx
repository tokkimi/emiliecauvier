import Link from 'next/link';
import { BOOKS, COLLECTIONS, type Collection } from '@/data/books';
import { BRAND, formatPrice, PACK_CENTS } from '@/lib/format';
import { SitePromoBanner } from '@/components/SitePromoBanner';
import { getLocale, getT } from '@/lib/i18n';
import { localizeBook, COLLECTIONS_EN } from '@/data/booksEn';

export default async function HomePage() {
  const locale = await getLocale();
  const t = await getT();
  const featured = BOOKS.slice(0, 6);
  const collections = Object.keys(COLLECTIONS) as Collection[];
  const col = (c: Collection) => (locale === 'en' ? COLLECTIONS_EN[c] ?? COLLECTIONS[c] : COLLECTIONS[c]);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[var(--color-bordeaux)] text-[var(--color-cream)]">
        <div className="mx-auto max-w-6xl px-5 py-24 sm:py-32">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-signe-em.png" alt="Signé par Émilie Cauvier" className="mb-8 h-24 w-auto animate-fade-up" />
          <p className="font-ui text-xs uppercase tracking-[0.28em] text-[var(--color-gold-soft)] animate-fade-up">
            {t.home_eyebrow}
          </p>
          <h1 className="mt-5 max-w-3xl font-display text-4xl leading-tight sm:text-6xl animate-fade-up">
            {t.home_title}
          </h1>
          <p className="mt-6 max-w-2xl font-body text-lg text-white/80 animate-fade-up">
            {t.home_subtitle_pre}
            {BRAND.author}
            {t.home_subtitle_post}
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

      {/* PHOTOS */}
      <section className="mx-auto max-w-6xl px-5 pt-16">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ['/photos/accueil.jpg', 'Bienvenue chez vous'],
            ['/photos/immeuble.jpg', 'Immeubles et copropriétés'],
            ['/photos/conseil.jpg', 'Un accompagnement de terrain'],
          ].map(([src, alt]) => (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={src}
              src={src}
              alt={alt}
              className="h-64 w-full rounded-2xl object-cover shadow-sm"
            />
          ))}
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

      {/* SÉLECTION */}
      <section className="mx-auto max-w-6xl px-5 pb-10">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-3xl text-[var(--color-ink)]">{t.home_selection}</h2>
          <Link href="/catalogue" className="font-ui text-sm text-[var(--color-bordeaux)] hover:underline">
            {t.home_see_all}
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((b) => {
            const loc = localizeBook(b, locale);
            return (
              <Link
                key={b.slug}
                href={`/livre/${b.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--color-sand)] bg-white transition hover:-translate-y-1 hover:shadow-lg"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/covers/${b.number}.jpg`}
                  alt={`Couverture — ${loc.title}`}
                  loading="lazy"
                  className="aspect-[2/3] w-full border-b border-[var(--color-sand)] object-cover"
                />
                <div className="flex flex-1 flex-col p-6">
                  <span className="font-ui text-[0.68rem] uppercase tracking-[0.16em] text-[var(--color-gold)]">
                    {col(b.collection)}
                  </span>
                  <h3 className="mt-2 font-display text-xl text-[var(--color-bordeaux)] group-hover:underline">
                    {loc.title}
                  </h3>
                  <p className="mt-2 flex-1 font-body text-sm text-[var(--color-ink)]/70">{loc.subtitle}</p>
                  <span className="mt-4 font-ui text-sm font-medium text-[var(--color-ink)]">
                    {formatPrice(b.priceCents)}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* PACKS */}
      <section id="packs" className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="font-display text-3xl text-[var(--color-ink)]">{t.home_packs_title}</h2>
        <p className="mt-2 mb-8 max-w-2xl font-body text-[var(--color-ink)]/70">
          {t.home_packs_intro_pre}{formatPrice(PACK_CENTS)}{t.home_packs_intro_mid}{formatPrice(BRAND.unitCents)}{t.home_packs_intro_post}
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((c) => {
            const n = BOOKS.filter((b) => b.collection === c).length;
            return (
              <Link
                key={c}
                href={`/catalogue?collection=${c}`}
                className="group flex flex-col rounded-2xl border border-[var(--color-sand)] bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <span className="font-ui text-[0.68rem] uppercase tracking-[0.16em] text-[var(--color-gold)]">{t.home_pack}</span>
                <h3 className="mt-2 font-display text-xl text-[var(--color-bordeaux)] group-hover:underline">
                  {col(c)}
                </h3>
                <p className="mt-2 flex-1 font-body text-sm text-[var(--color-ink)]/70">
                  {t.home_pack_desc_pre}{n}{t.home_pack_desc_post}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-display text-lg text-[var(--color-ink)]">{formatPrice(PACK_CENTS)}</span>
                  <span className="font-ui text-xs text-[var(--color-ink)]/50">{t.home_pack_instead} {formatPrice(n * BRAND.unitCents)}</span>
                </div>
              </Link>
            );
          })}
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

      {/* BANNIÈRE emiliecauvier.com */}
      <SitePromoBanner />
    </>
  );
}
