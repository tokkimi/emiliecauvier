import type { ReaderReview } from '@/data/reviews';

export function ReaderReviews({ reviews, locale, testimonials = false }: {
  reviews: ReaderReview[];
  locale: 'fr' | 'en';
  testimonials?: boolean;
}) {
  if (!reviews.length) return null;
  const title = locale === 'en'
    ? testimonials ? 'What clients say' : 'Reader reviews'
    : testimonials ? 'Ce que disent les clients' : 'Avis des lecteurs';
  const eyebrow = locale === 'en' ? 'Verified Google reviews · Original language' : 'Avis Google vérifiés · Citations originales';
  return <section className="mx-auto max-w-6xl px-5 py-14" aria-labelledby="reader-reviews-title">
    <p className="font-ui text-xs uppercase tracking-[0.18em] text-[var(--color-gold)]">{eyebrow}</p>
    <h2 id="reader-reviews-title" className="mt-2 font-display text-3xl text-[var(--color-bordeaux)]">{title}</h2>
    <ul className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:thin] md:grid md:grid-cols-2 md:overflow-visible">
      {reviews.map((review, index) => <li key={`${review.name}-${index}`} className="min-w-[86%] snap-start rounded-3xl border border-white/80 bg-white/80 p-6 shadow-[0_18px_50px_rgba(79,42,34,0.08)] backdrop-blur-xl sm:min-w-[65%] md:min-w-0">
        <span className="font-ui text-sm tracking-[0.12em] text-[var(--color-gold)]" aria-label={`${review.rating} sur 5`}>{'★'.repeat(review.rating)}</span>
        <blockquote className="my-4 font-body leading-relaxed text-[var(--color-ink)]/85">« {review.quote} »</blockquote>
        <p className="font-ui text-sm font-medium text-[var(--color-bordeaux)]">{review.name}</p>
      </li>)}
    </ul>
  </section>;
}
