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

/** Charge le contenu du lecteur pour un numéro d'ebook (côté serveur uniquement). */
export function loadReaderContent(number: number): ReaderContent | null {
  try {
    const raw = fs.readFileSync(path.join(DIR, `${number}.json`), 'utf-8');
    return JSON.parse(raw) as ReaderContent;
  } catch {
    return null;
  }
}
