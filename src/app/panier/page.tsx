import { auth } from '@/lib/auth';
import { BOOKS, COLLECTIONS } from '@/data/books';
import { COLLECTIONS_EN, localizeBook } from '@/data/booksEn';
import { CartPageClient } from '@/components/CartPageClient';
import { getLocale } from '@/lib/i18n';

export async function generateMetadata() {
  const locale = await getLocale();
  return { title: locale === 'en' ? 'Cart' : 'Panier' };
}

export default async function CartPage() {
  const locale = await getLocale();
  const session = await auth().catch(() => null);
  return (
    <CartPageClient
      locale={locale}
      loggedIn={Boolean(session?.user)}
      books={BOOKS.map((book) => {
        const loc = localizeBook(book, locale);
        return {
          slug: book.slug,
          number: book.number,
          title: loc.title,
          subtitle: loc.subtitle,
          collection: locale === 'en' ? COLLECTIONS_EN[book.collection] ?? COLLECTIONS[book.collection] : COLLECTIONS[book.collection],
          priceCents: book.priceCents,
        };
      })}
    />
  );
}
