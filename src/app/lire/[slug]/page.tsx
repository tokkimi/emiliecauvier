export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { bySlug } from '@/data/books';
import { localizeBook } from '@/data/booksEn';
import { getLocale } from '@/lib/i18n';
import { loadReaderContent } from '@/lib/reader';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { hasAccess } from '@/lib/entitlements';
import { Reader } from '@/components/Reader';

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

  const content = loadReaderContent(book.number);
  if (!content) notFound();

  const locale = await getLocale();
  const loc = localizeBook(book, locale);

  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;
  const dbEbook = await prisma.ebook.findUnique({ where: { slug } }).catch(() => null);
  const access = dbEbook ? await hasAccess(userId, dbEbook.id) : false;

  const previewOnly = !access || apercu === '1';

  // En aperçu, on ne transmet JAMAIS le HTML des chapitres verrouillés au
  // navigateur : seul le 1ᵉʳ chapitre garde son contenu, le reste est vidé.
  const chapters = previewOnly
    ? content.chapters.map((c, i) => (i === 0 ? c : { ...c, html: '' }))
    : content.chapters;
  const qcm = previewOnly ? [] : content.qcm;

  return (
    <Reader
      slug={slug}
      title={loc.title}
      subtitle={loc.subtitle}
      chapters={chapters}
      qcm={qcm}
      previewOnly={previewOnly}
      loggedIn={Boolean(userId)}
      frenchNotice={locale === 'en'}
    />
  );
}