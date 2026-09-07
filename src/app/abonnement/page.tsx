import Link from 'next/link';
import type { Metadata } from 'next';
import { BOOKS, COLLECTIONS, type Collection } from '@/data/books';
import { COLLECTIONS_EN, localizeBook } from '@/data/booksEn';
import { BRAND, formatPrice, PACK_CENTS } from '@/lib/format';
import { getLocale, getT } from '@/lib/i18n';
import { loadReaderLocalized } from '@/lib/reader';
import { SubscriptionExperience } from '@/components/SubscriptionExperience';

export const metadata: Metadata = { title: 'Abonnement · Subscription' };

export default async function AbonnementPage() {
  const locale = await getLocale();
  const t = await getT();
  const collections = Object.keys(COLLECTIONS) as Collection[];
  const col = (c: Collection) => (locale === 'en' ? COLLECTIONS_EN[c] ?? COLLECTIONS[c] : COLLECTIONS[c]);
  const content = loadReaderLocalized(1, locale)?.content;
  const chapter = content?.chapters[0];
  const question = content?.qcm[0];

  return (
    <div>
      {/* Plans */}
      <section className="bg-[var(--color-ink)] text-[var(--color-cream)]">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 lg:grid-cols-2">
          <div>
            <p className="font-ui text-xs uppercase tracking-[0.28em] text-[var(--color-gold-soft)]">{t.nav_subscription}</p>
            <h1 className="mt-4 font-display text-4xl">{t.home_sub_title}</h1>
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
              <p className="mt-3 font-display text-3xl"><span className="whitespace-nowrap">{formatPrice(BRAND.subscriptionCents)}</span><span className="mt-1 block text-lg">{t.per_month}</span></p>
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

      {chapter && question && <SubscriptionExperience locale={locale} count={BOOKS.length} demo={{
        title: localizeBook(BOOKS.find(book => book.number === 1)!, locale).title,
        chapter: chapter.title, excerpt: chapter.html.split('</p>')[0].replace(/<[^>]+>/g, ''),
        question: question.q, options: question.options.map(option => option.replace(/^[A-D][).]\s*/, '')), answer: question.answer, explanation: question.explanation,
      }} />}
      <section className="mx-auto max-w-6xl px-5 pt-12">
        <div className="rounded-2xl border border-[var(--color-sand)] bg-white p-6 sm:p-8">
          <h2 className="font-display text-2xl text-[var(--color-bordeaux)]">{locale === 'en' ? 'Online subscription or PDF purchase?' : 'Abonnement en ligne ou achat PDF ?'}</h2>
          <div className="mt-4 grid gap-5 font-ui text-sm leading-relaxed text-[var(--color-ink)]/70 sm:grid-cols-2">
            <p>{locale === 'en' ? 'Subscription: access the online library, quizzes and tools through your account while your subscription is active. PDF downloads are not included.' : 'Abonnement : accédez à la bibliothèque en ligne, aux quiz et aux outils depuis votre compte pendant votre abonnement. Les PDF téléchargeables ne sont pas inclus.'}</p>
            <p>{locale === 'en' ? 'PDF purchase: choose your guides and their language. You can purchase with an account or as a guest, and keep the downloaded files without a subscription.' : 'Achat PDF : choisissez vos guides et leur langue. Achetez avec un compte ou sans compte, et conservez les fichiers téléchargés sans abonnement.'}</p>
          </div>
        </div>
      </section>
      {/* Packs */}
      <section className="mx-auto max-w-6xl px-5 py-16">
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
                <h3 className="mt-2 font-display text-xl text-[var(--color-bordeaux)] group-hover:underline">{col(c)}</h3>
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
    </div>
  );
}
