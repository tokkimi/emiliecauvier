import { getT } from '@/lib/i18n';

/**
 * Bannière de mise en avant du site principal d'Emilie Cauvier (emiliecauvier.com).
 * La bande visuelle vit dans public/photos/banniere-site.jpg (remplaçable).
 */
export async function SitePromoBanner() {
  const t = await getT();
  return (
    <section className="bg-[var(--color-bordeaux)] text-[var(--color-cream)]">
      {/* Bande visuelle */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/photos/banniere-site.jpg"
        alt="L'univers d'Emilie Cauvier"
        className="h-40 w-full object-cover sm:h-56"
      />
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-5 py-12 text-center sm:py-14">
        <p className="font-ui text-xs uppercase tracking-[0.28em] text-[var(--color-gold-soft)]">
          {t.promo_eyebrow}
        </p>
        <h2 className="max-w-2xl font-display text-3xl leading-tight sm:text-4xl">
          {t.promo_title}
        </h2>
        <p className="max-w-xl font-body text-white/80">
          {t.promo_desc}
        </p>
        <a
          href="https://emiliecauvier.com"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-[var(--color-cream)] px-8 py-3 font-ui text-sm font-medium text-[var(--color-bordeaux)] transition hover:bg-white"
        >
          {t.promo_cta}
        </a>
      </div>
    </section>
  );
}
