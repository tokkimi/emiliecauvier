export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/db';
import { UserCard, UserRow } from '@/components/admin/UserRow';

export default async function AdminUsers() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { purchases: true } } },
    take: 200,
  });

  return (
    <div>
      <h1 className="font-display text-3xl text-[var(--color-ink)]">Utilisateurs</h1>
      <p className="mt-1 font-body text-[var(--color-ink)]/60">{users.length} comptes.</p>

      <div className="mt-6 grid gap-3 sm:hidden">
        {users.map((u) => (
          <UserCard key={u.id} u={{ id: u.id, email: u.email, name: u.name, role: u.role, subscriptionStatus: u.subscriptionStatus, purchases: u._count.purchases, createdAt: u.createdAt.toLocaleDateString('fr-CA') }} />
        ))}
        {users.length === 0 && <p className="rounded-2xl border border-dashed border-[var(--color-sand)] bg-white p-8 text-center font-body text-[var(--color-ink)]/50">Aucun utilisateur.</p>}
      </div>

      <div className="mt-8 hidden overflow-x-auto rounded-2xl border border-[var(--color-sand)] bg-white sm:block">
        <table className="w-full font-ui text-sm">
          <thead className="bg-[var(--color-sand)]/60 text-left text-[var(--color-ink)]/60">
            <tr>
              <th className="px-4 py-3">Utilisateur</th>
              <th className="px-4 py-3">Inscrit</th>
              <th className="px-4 py-3 text-center">Achats</th>
              <th className="px-4 py-3">Rôle</th>
              <th className="px-4 py-3">Abonnement</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <UserRow
                key={u.id}
                u={{
                  id: u.id,
                  email: u.email,
                  name: u.name,
                  role: u.role,
                  subscriptionStatus: u.subscriptionStatus,
                  purchases: u._count.purchases,
                  createdAt: u.createdAt.toLocaleDateString('fr-CA'),
                }}
              />
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-[var(--color-ink)]/50">
                  Aucun utilisateur.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
