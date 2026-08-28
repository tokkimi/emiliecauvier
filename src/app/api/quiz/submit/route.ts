import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getQuiz, scoreOutOf10 } from '@/lib/quizzes';

/**
 * Validation d'un quiz (façon Coursera).
 * Entrée : { slug, answers: number[] } (index choisi par question, -1 si vide).
 * Le score fait autorité côté serveur. Si l'utilisateur est connecté, la
 * tentative est enregistrée dans son profil. Renvoie la note /10 et les
 * bonnes réponses pour l'affichage (vert).
 */
export async function POST(req: Request) {
  let body: { slug?: string; answers?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'requête invalide' }, { status: 400 });
  }

  const slug = typeof body.slug === 'string' ? body.slug : '';
  const quiz = getQuiz(slug);
  if (!quiz) return NextResponse.json({ error: 'quiz introuvable' }, { status: 404 });

  const total = quiz.questions.length;
  const raw = Array.isArray(body.answers) ? body.answers : [];
  // Normalise en tableau d'index (longueur = nombre de questions).
  const answers: number[] = quiz.questions.map((_, i) => {
    const v = raw[i];
    return typeof v === 'number' && Number.isInteger(v) ? v : -1;
  });

  let score = 0;
  const correct: number[] = [];
  const explanations: string[] = [];
  quiz.questions.forEach((q, i) => {
    correct.push(q.answer);
    explanations.push(q.explanation ?? '');
    if (answers[i] === q.answer) score += 1;
  });
  const scoreOn10 = scoreOutOf10(score, total);

  // Enregistrement au profil si connecté.
  const session = await auth().catch(() => null);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  let saved = false;
  if (userId) {
    try {
      await prisma.quizAttempt.create({
        data: {
          userId,
          guideNumber: quiz.book.number,
          guideSlug: quiz.book.slug,
          guideTitle: quiz.book.title,
          score,
          total,
          scoreOn10,
          answers,
        },
      });
      saved = true;
    } catch {
      saved = false;
    }
  }

  return NextResponse.json({ score, total, scoreOn10, correct, explanations, saved });
}
