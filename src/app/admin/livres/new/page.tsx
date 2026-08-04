import Link from 'next/link';
import { EbookForm } from '@/components/admin/EbookForm';

export default function NewEbookPage() {
  return (
    <div>
      <Link href="/admin/livres" className="font-ui text-sm text-[var(--color-bordeaux)] hover:underline">
        ← Guides
      </Link>
      <h1 className="mt-4 font-display text-3xl text-[var(--color-ink)]">Ajouter un guide</h1>
      <EbookForm />
    </div>
  );
}
