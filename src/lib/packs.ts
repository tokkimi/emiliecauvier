import { PACK_CENTS } from './format';

export function packTotals(books: { priceCents: number; currency: string }[]) {
  const unitTotal = books.reduce((sum, book) => sum + book.priceCents, 0);
  if (books.length < 3 || unitTotal <= PACK_CENTS || books.some(book => book.currency.toUpperCase() !== 'CAD' || book.priceCents <= 0)) return null;
  return { unitTotal, packTotal: PACK_CENTS };
}
