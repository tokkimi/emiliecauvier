export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { prisma } from '@/lib/db';
import { formatPrice } from '@/lib/format';

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-[var(--color-sand)] bg-white p-6">
      <p className="font-ui text-xs uppercase tracking-[0.14em] text-[var(--color-ink)]/50">{label}</p>
      <p className="mt-2 font-display text-3xl text-[var(--color-bordeaux)]">{value}</p>
      {hint && <p className="mt-1 font-ui text-xs text-[var(--color-ink)]/45">{hint}</p>}
    </div>
  );
}

export default async function AdminDashboard() {
  const since = new Date();
  since.setDate(since.getDate() - 30);

  const [users, activeSubs, paidPurchases, revenueAgg, recent, ebookCount] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { subscriptionStatus: { in: ['ACTIVE', 'TRIALING'] } } }),
    prisma.purchase.count({ where: { status: 'PAID' } }),
    prisma.purchase.aggregate({ _sum: { amountCents: true }, where: { status: 'PAID' } }),
    prisma.purchase.findMany({
      where: { status: 'PAID' },
      orderBy: { createdAt: 'desc' },
      take: 8,
      include: { user: { select: { email: true } }, ebook: { select: { title: true } } },
    }),
    prisma.ebook.count(),
  ]);

  const mrr = activeSubs * 1900;
  const totalRevenue = revenueAgg._sum.amountCents ?? 0;

  return (
    <div>
      <h1 className="font-display text-3xl text-[var(--color-ink)]">Tableau de bord</h1>
      <p className="mt-1 font-body text-[var(--color-ink)]/60">Vue d&apos;ensemble de la boutique.</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Utilisateurs" value={String(users)} hint="comptes créés" />
        <Stat label="Abonnés actifs" value={String(activeSubs)} hint={`MRR ${formatPrice(mrr)}`} />
        <Stat label="Ventes payées" value={String(paidPurchases)} hint="tous types" />
        <Stat label="Revenu total" value={formatPrice(totalRevenue)} hint="cumul" />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <Stat label="Guides au catalogue" value={String(ebookCount)} />
        <Stat label="Revenu récurrent (MRR)" value={formatPrice(mrr)} hint={`${activeSubs} × 19 $`} />
        <div className="rounded-2xl border border-[var(--color-sand)] bg-white p-6">
          <p className="font-ui text-xs uppercase tracking-[0.14em] text-[var(--color-ink)]/50">Raccourcis</p>
          <div className="mt-3 flex flex-col gap-2 font-ui text-sm">
            <Link href="/admin/livres/new" className="text-[var(--color-bordeaux)] hover:underline">+ Ajouter un guide</Link>
            <Link href="/admin/compta" className="text-[var(--color-bordeaux)] hover:underline">Voir la compta →</Link>
            <Link href="/admin/utilisateurs" className="text-[var(--color-bordeaux)] hover:underline">Gérer les utilisateurs →</Link>
          </div>
        </div>
      </div>

      <h2 className="mt-12 font-display text-2xl text-[var(--color-ink)]">Dernières ventes</h2>
      <div className="mt-4 overflow-hidden rounded-2xl border border-[var(--color-sand)] bg-white">
        <table className="w-full font-ui text-sm">
          <thead className="bg-[var(--color-sand)]/60 text-left text-[var(--color-ink)]/60">
            <tr>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Client</th>
              <th className="px-5 py-3">Guide / type</th>
              <th className="px-5 py-3 text-right">Montant</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((p) => (
              <tr key={p.id} className="border-t border-[var(--color-sand)]">
                <td className="px-5 py-3 text-[var(--color-ink)]/60">{p.createdAt.toLocaleDateString('fr-CA')}</td>
                <td className="px-5 py-3">{p.user?.email ?? p.guestEmail ?? 'Achat invité'}</td>
                <td className="px-5 py-3">{p.ebook?.title ?? (p.type === 'SUBSCRIPTION' ? 'Abonnement' : p.type)}</td>
                <td className="px-5 py-3 text-right font-medium">{formatPrice(p.amountCents)}</td>
              </tr>
            ))}
            {recent.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-[var(--color-ink)]/50">
                  Aucune vente pour l&apos;instant.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
