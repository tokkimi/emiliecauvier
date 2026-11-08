import type { MetadataRoute } from 'next';
import { BOOKS } from '@/data/books';
import { SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return ['/', '/catalogue', '/abonnement', '/a-propos', ...BOOKS.map(book => `/livre/${book.slug}`)]
    .map(path => ({ url: new URL(path, SITE_URL).href }));
}
