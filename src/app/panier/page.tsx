import type { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { BOOKS, COLLECTIONS } from '@/data/books';
import { CartPageClient } from '@/components/CartPageClient';

export const metadata: Metadata = { title: 'Panier' };

export default async function CartPage() {
  const session = await auth().catch(() => null);
  return (
    <CartPageClient
      loggedIn={Boolean(session?.user)}
      books={BOOKS.map((book) => ({
        slug: book.slug,
        number: book.number,
        title: book.title,
        subtitle: book.subtitle,
        collection: COLLECTIONS[book.collection],
        priceCents: book.priceCents,
      }))}
    />
  );
}
