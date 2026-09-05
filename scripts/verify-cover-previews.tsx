import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { BookCover } from '../src/components/BookCover';
import { BOOKS } from '../src/data/books';

assert.equal(BOOKS.length, 48);
for (const book of BOOKS) {
  const english = renderToStaticMarkup(<BookCover number={book.number} title={book.title} collection="BUYERS" locale="en" />);
  assert.ok(english.includes(`/covers-en/${book.number}.webp`));
  assert.ok(english.includes('alt="Cover — '));
  assert.ok(!english.includes('<span'), `Unexpected English overlay: ${book.number}`);
  for (const extension of ['jpg', 'webp']) {
    assert.ok(fs.existsSync(path.join('public/covers-en', `${book.number}.${extension}`)), `Missing ${extension} cover ${book.number}`);
  }
  const french = renderToStaticMarkup(<BookCover number={book.number} title={book.title} collection="ACHETEURS" locale="fr" />);
  assert.ok(french.includes(`/covers/${book.number}.jpg`));
  assert.equal(french.includes('<span'), book.number >= 2 && book.number <= 34);
}
console.log('48 EN previews + 48 FR previews verified; no overlays on English artwork.');
