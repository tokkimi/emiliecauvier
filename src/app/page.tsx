import Link from 'next/link';
import { BOOKS, COLLECTIONS, type Collection } from '@/data/books';
import { BRAND, formatPrice, PACK_CENTS } from '@/lib/format';

export default function HomePage() {
  const featured = BOOKS.slice(0, 6);
  const collections = Object.keys(COLLECTIONS) as Collection[];

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[var(--color-bordeaux)] text-[var(--color-cream)]">
        <div className="mx-auto max-w-6xl px-5 py-24 sm:py-32">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-signe-em.png" alt="Signé par Émilie Cauvier" className="mb-8 h-24 w-auto animate-fade-up" />
          <p className="font-ui text-xs uppercase tracking-[0.28em] text-[var(--color-gold-soft)] animate-fade-up">
            La Bibliothèque · Édition 2026
          </p>
          <h1 className="mt-5 max-w-3xl font-display text-4xl leading-tight sm:text-6xl animate-fade-up">
            Acheter, vendre et investir dans le Grand Montréal — sans angle mort.
          </h1>
          <p className="mt-6 max-w-2xl font-body text-lg text-white/80 animate-fade-up">
            50 guides clairs et pratiques signés {BRAND.author}, courtière immobilière résidentielle.
            À lire en ligne, chapitre par chapitre, <em>et</em> à télécharger en PDF.
          </p>
          <div className="mt-10 flex flex-wrap gap-4 font-ui animate-fade-up">
            <Link
              href="/catalogue"
              className="rounded-full bg-[var(--color-cream)] px-7 py-3 font-medium text-[var(--color-bordeaux)] transition hover:bg-white"
            >
              Explorer les 50 guides
            </Link>
            <Link
              href="/#abonnement"
              className="rounded-full border border-white/40 px-7 py-3 font-medium text-white transition hover:bg-white/10"
            >
              Abonnement {formatPrice(BRAND.subscriptionCents)}/mois
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
            ['Concret, pas théorique', 'Chaque guide donne des étapes, des chiffres du Québec et un plan d\'action.'],
            ['Deux façons de lire', 'En ligne façon Coursera (menu de chapitres) ou en PDF téléchargeable, à vous de choisir.'],
            ['Écrit par une courtière', 'Le terrain de terrain : Grand Montréal, Laval, Rive-Nord, Westmount.'],
          ].map(([t, d]) => (
            <div key={t} className="rounded-2xl border border-[var(--color-sand)] bg-white p-7">
              <h3 className="font-display text-xl text-[var(--color-bordeaux)]">{t}</h3>
              <p className="mt-3 font-body text-[var(--color-ink)]/75">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SÉLECTION */}
      <section className="mx-auto max-w-6xl px-5 pb-10">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-3xl text-[var(--color-ink)]">Guides à découvrir</h2>
          <Link href="/catalogue" className="font-ui text-sm text-[var(--color-bordeaux)] hover:underline">
            Voir tout le catalogue →
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((b) => (
            <Link
              key={b.slug}
              href={`/livre/${b.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--color-sand)] bg-white transition hover:-translate-y-1 hover:shadow-lg"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/covers/${b.number}.jpg`}
                alt={`Couverture — ${b.title}`}
                loading="lazy"
                className="aspect-[2/3] w-full border-b border-[var(--color-sand)] object-cover"
              />
              <div className="flex flex-1 flex-col p-6">
                <span className="font-ui text-[0.68rem] uppercase tracking-[0.16em] text-[var(--color-gold)]">
                  {COLLECTIONS[b.collection]}
                </span>
                <h3 className="mt-2 font-display text-xl text-[var(--color-bordeaux)] group-hover:underline">
                  {b.title}
                </h3>
                <p className="mt-2 flex-1 font-body text-sm text-[var(--color-ink)]/70">{b.subtitle}</p>
                <span className="mt-4 font-ui text-sm font-medium text-[var(--color-ink)]">
                  {formatPrice(b.priceCents)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* PACKS */}
      <section id="packs" className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="font-display text-3xl text-[var(--color-ink)]">Packs par collection</h2>
        <p className="mt-2 mb-8 max-w-2xl font-body text-[var(--color-ink)]/70">
          Toute une collection d&apos;un coup — {formatPrice(PACK_CENTS)} le pack (au lieu de {formatPrice(BRAND.unitCents)} le guide).
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
                <span className="font-ui text-[0.68rem] uppercase tracking-[0.16em] text-[var(--color-gold)]">Pack</span>
                <h3 className="mt-2 font-display text-xl text-[var(--color-bordeaux)] group-hover:underline">
                  {COLLECTIONS[c]}
                </h3>
                <p className="mt-2 flex-1 font-body text-sm text-[var(--color-ink)]/70">
                  Les {n} guides de la collection, réunis.
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-display text-lg text-[var(--color-ink)]">{formatPrice(PACK_CENTS)}</span>
                  <span className="font-ui text-xs text-[var(--color-ink)]/50">au lieu de {formatPrice(n * BRAND.unitCents)}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* COLLECTIONS */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="mb-6 font-display text-2xl text-[var(--color-ink)]">Par collection</h2>
        <div className="flex flex-wrap gap-3 font-ui">
          {collections.map((c) => (
            <Link
              key={c}
              href={`/catalogue?collection=${c}`}
              className="rounded-full border border-[var(--color-sand)] bg-white px-5 py-2 text-sm text-[var(--color-ink)] transition hover:border-[var(--color-bordeaux)] hover:text-[var(--color-bordeaux)]"
            >
              {COLLECTIONS[c]}
            </Link>
          ))}
        </div>
      </section>

      {/* ABONNEMENT */}
      <section id="abonnement" className="bg-[var(--color-ink)] text-[var(--color-cream)]">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-24 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-4xl">Deux façons d&apos;accéder aux guides.</h2>
            <p className="mt-4 font-body text-white/75">
              Choisissez le guide dont vous avez besoin, ou débloquez toute la collection avec l&apos;abonnement.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/15 bg-white/5 p-7">
              <p className="font-ui text-xs uppercase tracking-[0.16em] text-[var(--color-gold-soft)]">À l&apos;unité</p>
              <p className="mt-3 font-display text-4xl">{formatPrice(BRAND.unitCents)}</p>
              <p className="mt-1 font-ui text-sm text-white/60">par guide, accès à vie</p>
              <ul className="mt-5 space-y-2 font-body text-sm text-white/80">
                <li>Lecture en ligne complète</li>
                <li>PDF téléchargeable</li>
                <li>Mises à jour de l&apos;édition</li>
              </ul>
              <Link href="/catalogue" className="mt-6 block rounded-full bg-white/10 py-3 text-center font-ui text-sm hover:bg-white/20">
                Choisir un guide
              </Link>
            </div>
            <div className="rounded-2xl border border-[var(--color-gold)] bg-[var(--color-bordeaux)] p-7">
              <p className="font-ui text-xs uppercase tracking-[0.16em] text-[var(--color-gold-soft)]">Abonnement</p>
              <p className="mt-3 font-display text-4xl">{formatPrice(BRAND.subscriptionCents)}<span className="text-lg">/mois</span></p>
              <p className="mt-1 font-ui text-sm text-white/70">les 50 guides + nouveautés</p>
              <ul className="mt-5 space-y-2 font-body text-sm text-white/90">
                <li>Accès illimité à toute la collection</li>
                <li>Lecture en ligne + PDF</li>
                <li>Nouvelles éditions incluses</li>
                <li>Sans engagement</li>
              </ul>
              <Link href="/inscription?plan=abonnement" className="mt-6 block rounded-full bg-[var(--color-cream)] py-3 text-center font-ui text-sm font-medium text-[var(--color-bordeaux)] hover:bg-white">
                S&apos;abonner
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
