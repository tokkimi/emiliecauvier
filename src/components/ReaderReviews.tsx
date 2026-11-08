import type { ReaderReview } from '@/data/reviews';

export function ReaderReviews({ reviews, locale, testimonials = false }: {
  reviews: ReaderReview[];
  locale: 'fr' | 'en';
  testimonials?: boolean;
}) {
  if (!reviews.length) return null;
  const title = locale === 'en'
    ? testimonials ? 'From our readers' : 'Reader reviews'
    : testimonials ? 'La parole aux lecteurs' : 'Avis des lecteurs';
  return <section className="mx-auto max-w-6xl px-5 py-12">
    <h2 className="font-display text-3xl text-[var(--color-bordeaux)]">{title}</h2>
    <ul className="mt-5 grid gap-4 md:grid-cols-2">
      {reviews.map((review, index) => <li key={index} className="rounded-2xl border border-[var(--color-sand)] bg-white p-6">
        <span className="font-ui text-sm">{review.rating}/5</span>
        <blockquote className="my-3 font-body">{review.quote}</blockquote>
        <p className="font-ui text-sm">{review.name}</p>
      </li>)}
    </ul>
  </section>;
}
