'use client';

import { useState, useTransition } from 'react';
import { togglePublish } from '@/app/admin/livres/actions';

export function PublishToggle({ id, published }: { id: string; published: boolean }) {
  const [on, setOn] = useState(published);
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() => {
        const next = !on;
        setOn(next);
        startTransition(() => togglePublish(id, next));
      }}
      className={`inline-flex h-6 w-11 items-center rounded-full transition ${
        on ? 'bg-green-500' : 'bg-[var(--color-sand)]'
      }`}
      title={on ? 'Publié' : 'Masqué'}
    >
      <span className={`h-5 w-5 rounded-full bg-white shadow transition ${on ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  );
}
