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

function UserActions({ u }: { u: Row }) {
  const [pending, startTransition] = useTransition();
  const subActive = u.subscriptionStatus === 'ACTIVE' || u.subscriptionStatus === 'TRIALING';
  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        aria-label={`Rôle de ${u.email}`}
        disabled={pending}
        value={u.role}
        onChange={(e) => startTransition(() => setRole(u.id, e.target.value as 'USER' | 'ADMIN'))}
        className="min-h-11 rounded-xl border border-[var(--color-sand)] bg-white px-3 font-ui text-sm"
      >
        <option value="USER">Utilisateur</option>
        <option value="ADMIN">Administrateur</option>
      </select>
      <button
        disabled={pending}
        onClick={() => startTransition(() => setSubscription(u.id, subActive ? 'CANCELED' : 'ACTIVE'))}
        className="min-h-11 rounded-xl border border-[var(--color-bordeaux)] px-3 font-ui text-sm text-[var(--color-bordeaux)] disabled:opacity-50"
      >
        {pending ? 'Enregistrement…' : subActive ? 'Retirer l’accès' : 'Offrir 30 jours'}
      </button>
    </div>
  );
}

export function UserCard({ u }: { u: Row }) {
  const subActive = u.subscriptionStatus === 'ACTIVE' || u.subscriptionStatus === 'TRIALING';
  return (
    <article className="rounded-2xl border border-[var(--color-sand)] bg-white p-4">
      <p className="break-all font-ui text-sm font-semibold text-[var(--color-ink)]">{u.email}</p>
      {u.name && <p className="mt-1 font-body text-sm text-[var(--color-ink)]/60">{u.name}</p>}
      <div className="my-4 grid grid-cols-3 gap-2 text-center font-ui text-xs">
        <div className="rounded-xl bg-[var(--color-sand)]/45 p-2"><span className="block text-[var(--color-ink)]/45">Inscrit</span>{u.createdAt}</div>
        <div className="rounded-xl bg-[var(--color-sand)]/45 p-2"><span className="block text-[var(--color-ink)]/45">Achats</span>{u.purchases}</div>
        <div className={`rounded-xl p-2 ${subActive ? 'bg-green-100 text-green-800' : 'bg-[var(--color-sand)]/45'}`}><span className="block opacity-60">Accès</span>{u.subscriptionStatus}</div>
      </div>
      <UserActions u={u} />
    </article>
  );
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
