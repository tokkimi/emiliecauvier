export type ReaderReview = { name: string; quote: string; rating: 1 | 2 | 3 | 4 | 5 };
export const guideReviews: Record<string, Partial<Record<'fr' | 'en', ReaderReview[]>>> = {};
export const testimonials: Record<'fr' | 'en', ReaderReview[]> = { fr: [], en: [] };
