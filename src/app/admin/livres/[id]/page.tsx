import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { EbookForm } from '@/components/admin/EbookForm';
import { DeleteEbookButton } from '@/components/admin/DeleteEbookButton';

export default async function EditEbookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ebook = await prisma.ebook.findUnique({ where: { id } });
  if (!ebook) notFound();

  return (
    <div>
      <Link href="/admin/livres" className="font-ui text-sm text-[var(--color-bordeaux)] hover:underline">
        ← Guides
      </Link>
      <div className="mt-4 flex items-center justify-between">
        <h1 className="font-display text-3xl text-[var(--color-ink)]">Modifier — {ebook.title}</h1>
        <DeleteEbookButton id={ebook.id} />
      </div>
      <EbookForm ebook={ebook} />
    </div>
  );
}
