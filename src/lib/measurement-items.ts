'use client';

import { bySlug } from '@/data/books';
import { localizeBook } from '@/data/booksEn';
import { track } from './measurement';

export function measurementItem(slug: string, locale: 'fr' | 'en', priceCents?: number) {
  const book = bySlug(slug);
  return { item_id: slug, item_name: book ? localizeBook(book, locale).title : slug, price: (priceCents ?? book?.priceCents ?? 0) / 100, quantity: 1 };
}

export function trackItems(event: 'view_item' | 'add_to_cart' | 'begin_checkout' | 'generate_lead', slugs: string[], locale: 'fr' | 'en', value?: number) {
  const items = slugs.map(slug => measurementItem(slug, locale));
  track(event, { items, value: value ?? (items.length ? items.reduce((sum, item) => sum + (item.price ?? 0), 0) : undefined) });
}
