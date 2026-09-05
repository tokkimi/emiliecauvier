// Exporte les métadonnées anglaises (titre, sous-titre, collection) en JSON
// pour le générateur de PDF Python. Lancer : npx tsx scripts/dump_en_meta.ts
import fs from 'node:fs';
import path from 'node:path';
import { BOOKS } from '../src/data/books';
import { BOOKS_EN, COLLECTIONS_EN } from '../src/data/booksEn';

const out = BOOKS.map((b) => ({
  number: b.number,
  slug: b.slug,
  title: BOOKS_EN[b.slug]?.title ?? b.title,
  subtitle: BOOKS_EN[b.slug]?.subtitle ?? b.subtitle,
  collection: COLLECTIONS_EN[b.collection] ?? b.collection,
}));

const target = path.join(process.cwd(), 'scripts', 'en_meta.json');
fs.writeFileSync(target, JSON.stringify(out, null, 2), 'utf-8');
console.log('wrote', out.length, 'guides ->', target);
