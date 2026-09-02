export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { bySlug } from '@/data/books';
import { localizeBook } from '@/data/booksEn';
import { getLocale } from '@/lib/i18n';
import { loadReaderLocalized } from '@/lib/reader';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { hasAccess } from '@/lib/entitlements';
import { Reader } from '@/components/Reader';
import { cookies } from 'next/headers';
import { GUEST_PURCHASE_COOKIE, guestHasAccess } from '@/lib/guestPurchase';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const book = bySlug(slug);
  return { title: book ? `Lecture — ${book.title}` : 'Lecture' };
}

export default async function ReaderPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ apercu?: string }>;
}) {
  const { slug } = await params;
  const { apercu } = await searchParams;
  const book = bySlug(slug);
  if (!book) notFound();

  const locale = await getLocale();
  const localized = loadReaderLocalized(book.number, locale);
  if (!localized) notFound();
  const { content, isEnglish } = localized;
  const loc = localizeBook(book, locale);

  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;
  const dbEbook = await prisma.ebook.findUnique({ where: { slug } }).catch(() => null);
  const guestLibrary = (await cookies()).get(GUEST_PURCHASE_COOKIE)?.value;
  const access = dbEbook
    ? guestHasAccess(guestLibrary, dbEbook.id) || (await hasAccess(userId, dbEbook.id))
    : false;

  const previewOnly = !access || apercu === '1';

  // En aperçu, on ne transmet JAMAIS le HTML des chapitres verrouillés au
  // navigateur : seul le 1ᵉʳ chapitre garde son contenu, le reste est vidé.
  const chapters = previewOnly
    ? content.chapters.map((c, i) => (i === 0 ? c : { ...c, html: '' }))
    : content.chapters;
  const quizQuestions = previewOnly
    ? []
    : content.qcm.map((question) => ({ q: question.q, options: question.options }));
  const initialProgress = userId && access && dbEbook
    ? await prisma.readingProgress.findUnique({
        where: { userId_ebookId: { userId, ebookId: dbEbook.id } },
        select: { chapterIndex: true },
      })
    : null;

  return (
    <Reader
      slug={slug}
      title={loc.title}
      subtitle={loc.subtitle}
      chapters={chapters}
      quizQuestions={quizQuestions}
      hasQuiz={content.qcm.length > 0}
      previewOnly={previewOnly}
      loggedIn={Boolean(userId)}
      initialChapter={initialProgress?.chapterIndex ?? 0}
      frenchNotice={locale === 'en' && !isEnglish}
    />
  );
}
