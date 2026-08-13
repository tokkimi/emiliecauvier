import { BOOKS, bySlug, COLLECTIONS, type Book } from '@/data/books';
import { loadReaderContent, type ReaderQCM } from '@/lib/reader';

export interface QuizSummary {
  slug: string;
  number: number;
  title: string;
  collection: string;
  count: number;
}

export interface QuizQuestionPublic {
  q: string;
  options: string[];
}

export interface QuizFull {
  book: Book;
  questions: ReaderQCM[];
}

/** Liste tous les guides qui ont un QCM, pour la page /quiz. */
export function listQuizzes(): QuizSummary[] {
  const out: QuizSummary[] = [];
  for (const b of BOOKS) {
    const content = loadReaderContent(b.number);
    if (content && content.qcm && content.qcm.length > 0) {
      out.push({
        slug: b.slug,
        number: b.number,
        title: b.title,
        collection: COLLECTIONS[b.collection] ?? b.collection,
        count: content.qcm.length,
      });
    }
  }
  return out.sort((a, b) => a.number - b.number);
}

/** Charge un quiz complet (avec réponses) — usage serveur uniquement. */
export function getQuiz(slug: string): QuizFull | null {
  const book = bySlug(slug);
  if (!book) return null;
  const content = loadReaderContent(book.number);
  if (!content || !content.qcm || content.qcm.length === 0) return null;
  return { book, questions: content.qcm };
}

/** Questions sans les réponses, à envoyer au client avant validation. */
export function publicQuestions(quiz: QuizFull): QuizQuestionPublic[] {
  return quiz.questions.map((q) => ({ q: q.q, options: q.options }));
}

/** Note ramenée sur 10 à partir du nombre de bonnes réponses. */
export function scoreOutOf10(score: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((score / total) * 10);
}
