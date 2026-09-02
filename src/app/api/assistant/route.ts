import { NextResponse } from 'next/server';
import { z } from 'zod';
import { BOOKS } from '@/data/books';

const schema = z.object({ question: z.string().trim().min(3).max(500) });

const OFFICIAL = {
  courtage: { label: 'Guide de l’acheteur — OACIQ', url: 'https://www.oaciq.com/fr/grand-public/acheter/guide-acheteur/' },
  logement: { label: 'Tribunal administratif du logement', url: 'https://www.tal.gouv.qc.ca/fr/etre-locataire/' },
  taxes: { label: 'Financement et taxes — Québec.ca', url: 'https://www.quebec.ca/habitation-territoire/achat-vente/financement-et-taxes' },
  mutation: { label: 'Droits de mutation immobilière — Québec.ca', url: 'https://www.quebec.ca/gouvernement/gestion-municipale/finances-fiscalite-municipales/fiscalite/droits-mutations-immobilieres' },
};

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

  const question = normalize(parsed.data.question);
  const sources = [
    question.match(/loyer|locataire|bail|eviction|reprise/) ? OFFICIAL.logement : null,
    question.match(/taxe|mutation|bienvenue/) ? OFFICIAL.mutation : null,
    question.match(/financ|hypothe|mise|celiapp|rap/) ? OFFICIAL.taxes : null,
    OFFICIAL.courtage,
  ].filter((source, index, all): source is NonNullable<typeof source> => Boolean(source) && all.indexOf(source) === index).slice(0, 2);

  return NextResponse.json({
    answer: 'Voici les ressources les plus pertinentes dans la bibliothèque. Pour une décision adaptée à votre dossier, validez toujours les chiffres et les règles avec le professionnel ou l’organisme officiel concerné.',
    guides,
    sources,
  });
}

