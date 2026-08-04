'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { deleteEbook } from '@/app/admin/livres/actions';

export function DeleteEbookButton({ id }: { id: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <button
      disabled={pending}
      onClick={() => {
        if (!confirm('Supprimer ce guide ? Les achats liés seront conservés mais orphelins.')) return;
        startTransition(async () => {
          await deleteEbook(id);
          router.push('/admin/livres');
        });
      }}
      className="font-ui text-sm text-red-600 hover:underline disabled:opacity-50"
    >
      Supprimer
    </button>
  );
}
