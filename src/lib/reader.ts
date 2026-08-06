import fs from 'node:fs';
import path from 'node:path';

export interface ReaderChapter {
  title: string;
  objective: string;
  html: string;
}
export interface ReaderQCM {
  q: string;
  options: string[];
  answer: number;
  explanation: string;
}
export interface ReaderContent {
  number: number;
  title: string;
  chapters: ReaderChapter[];
  qcm: ReaderQCM[];
}

const DIR = path.join(process.cwd(), 'src', 'data', 'reader');
const DIR_EN = path.join(process.cwd(), 'src', 'data', 'reader-en');

function tryLoad(dir: string, number: number): ReaderContent | null {
  try {
    const raw = fs.readFileSync(path.join(dir, `${number}.json`), 'utf-8');
    return JSON.parse(raw) as ReaderContent;
  } catch {
    return null;
  }
}

/** Charge le contenu du lecteur pour un numéro d'ebook (français). */
export function loadReaderContent(number: number): ReaderContent | null {
  return tryLoad(DIR, number);
}

/**
 * Charge le contenu du lecteur dans la langue demandée.
 * En anglais, sert `reader-en/<n>.json` s'il existe ; sinon repli sur le
 * français avec `isEnglish=false` (le lecteur affiche alors une note).
 */
export function loadReaderLocalized(
  number: number,
  locale: 'fr' | 'en',
): { content: ReaderContent; isEnglish: boolean } | null {
  if (locale === 'en') {
    const en = tryLoad(DIR_EN, number);
    if (en) return { content: en, isEnglish: true };
  }
  const fr = tryLoad(DIR, number);
  return fr ? { content: fr, isEnglish: false } : null;
}
