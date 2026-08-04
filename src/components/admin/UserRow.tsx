'use client';

import { useTransition } from 'react';
import { setRole, setSubscription } from '@/app/admin/utilisateurs/actions';

interface Row {
  id: string;
  email: string;
  name: string | null;
  role: string;
  subscriptionStatus: string;
  purchases: number;
  createdAt: string;
}

export function UserRow({ u }: { u: Row }) {
  const [pending, startTransition] = useTransition();
  const subActive = u.subscriptionStatus === 'ACTIVE' || u.subscriptionStatus === 'TRIALING';

  return (
    <tr className="border-t border-[var(--color-sand)]">
      <td className="px-4 py-3">
        <span className="font-medium text-[var(--color-ink)]">{u.email}</span>
        {u.name && <span className="block text-xs text-[var(--color-ink)]/50">{u.name}</span>}
      </td>
      <td className="px-4 py-3 text-[var(--color-ink)]/60">{u.createdAt}</td>
      <td className="px-4 py-3 text-center">{u.purchases}</td>
      <td className="px-4 py-3">
        <select
          disabled={pending}
          value={u.role}
          onChange={(e) => startTransition(() => setRole(u.id, e.target.value as 'USER' | 'ADMIN'))}
          className="rounded-lg border border-[var(--color-sand)] bg-white px-2 py-1 font-ui text-xs"
        >
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
      </td>
      <td className="px-4 py-3">
        <span
          className={`rounded-full px-2 py-1 font-ui text-xs ${
            subActive ? 'bg-green-100 text-green-800' : 'bg-[var(--color-sand)] text-[var(--color-ink)]/60'
          }`}
        >
          {u.subscriptionStatus}
        </span>
      </td>
      <td className="px-4 py-3 text-right">
        <button
          disabled={pending}
          onClick={() =>
            startTransition(() => setSubscription(u.id, subActive ? 'CANCELED' : 'ACTIVE'))
          }
          className="font-ui text-xs text-[var(--color-bordeaux)] hover:underline disabled:opacity-50"
        >
          {subActive ? 'Retirer accès' : 'Offrir 30 j'}
        </button>
      </td>
    </tr>
  );
}
