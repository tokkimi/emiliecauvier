import { NextResponse } from 'next/server';
import { z } from 'zod';
import { BOOKS } from '@/data/books';
import { BOOKS_EN, localizeBook } from '@/data/booksEn';

const schema = z.object({ question: z.string().trim().min(3).max(500), locale: z.enum(['fr', 'en']).optional() });

const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  const locale = parsed.success ? parsed.data.locale ?? 'fr' : 'fr';
  if (!parsed.success) return NextResponse.json({ error: locale === 'en' ? 'Please write a slightly more specific question.' : 'Écrivez une question un peu plus précise.' }, { status: 400 });

  const terms = normalize(parsed.data.question).split(/[^a-z0-9]+/).filter((term) => term.length >= 3);
  const scored = BOOKS.map((book) => {
    const en = BOOKS_EN[book.slug];
    const haystack = normalize([book.title, book.subtitle, en?.title ?? '', en?.subtitle ?? '', ...book.chapters].join(' '));
    const score = terms.reduce((sum, term) => sum + (haystack.includes(term) ? 1 : 0), 0);
    return { book, score };
  }).sort((a, b) => b.score - a.score || a.book.number - b.book.number);

  const guides = scored.filter((item) => item.score > 0).slice(0, 3).map(({ book }) => ({
    slug: book.slug,
    title: localizeBook(book, locale).title,
    pages: locale === 'en' ? `chapters 1 to ${Math.min(3, book.chapters.length)}` : `chapitres 1 à ${Math.min(3, book.chapters.length)}`,
  }));
  if (!guides.length) guides.push(...BOOKS.slice(0, 3).map((book) => ({ slug: book.slug, title: localizeBook(book, locale).title, pages: locale === 'en' ? 'chapters 1 to 3' : 'chapitres 1 à 3' })));

  return NextResponse.json({
    answer: locale === 'en'
      ? 'Here are the most relevant guides from La Bibliothèque. Tap a recommendation to open the guide page and review the suggested chapters.'
      : 'Voici les guides les plus pertinents de La Bibliothèque. Touchez une recommandation pour ouvrir directement la page du guide et consulter les chapitres proposés.',
    guides,
  });
}
