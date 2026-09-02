import { NextResponse } from 'next/server';
import { z } from 'zod';
import { BOOKS } from '@/data/books';

const schema = z.object({ question: z.string().trim().min(3).max(500) });

const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Écrivez une question un peu plus précise.' }, { status: 400 });

  const terms = normalize(parsed.data.question).split(/[^a-z0-9]+/).filter((term) => term.length >= 3);
  const scored = BOOKS.map((book) => {
    const haystack = normalize([book.title, book.subtitle, ...book.chapters].join(' '));
    const score = terms.reduce((sum, term) => sum + (haystack.includes(term) ? 1 : 0), 0);
    return { book, score };
  }).sort((a, b) => b.score - a.score || a.book.number - b.book.number);

  const guides = scored.filter((item) => item.score > 0).slice(0, 3).map(({ book }) => ({
    slug: book.slug,
    title: book.title,
    pages: `chapitres 1 à ${Math.min(3, book.chapters.length)}`,
  }));
  if (!guides.length) guides.push(...BOOKS.slice(0, 3).map((book) => ({ slug: book.slug, title: book.title, pages: 'chapitres 1 à 3' })));

  return NextResponse.json({
    answer: 'Voici les guides les plus pertinents de La Bibliothèque. Touchez une recommandation pour ouvrir directement la page du guide et consulter les chapitres proposés.',
    guides,
  });
}
