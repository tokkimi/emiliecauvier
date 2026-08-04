export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/db';
import { formatPrice } from '@/lib/format';

export default async function ComptaPage() {
  const since = new Date();
  since.setDate(since.getDate() - 90);

  const [daily, oneTime, sub, refunds, byMonth] = await Promise.all([
    prisma.dailyRevenue.findMany({ where: { date: { gte: since } }, orderBy: { date: 'desc' }, take: 30 }),
    prisma.purchase.aggregate({ _sum: { amountCents: true }, where: { status: 'PAID', type: { in: ['ONE_TIME', 'BUNDLE'] } } }),
    prisma.purchase.aggregate({ _sum: { amountCents: true }, where: { status: 'PAID', type: 'SUBSCRIPTION' } }),
    prisma.purchase.aggregate({ _sum: { amountCents: true }, where: { status: 'REFUNDED' } }),
    prisma.$queryRawUnsafe<{ month: string; total: bigint }[]>(
      `SELECT to_char("createdAt", 'YYYY-MM') as month, SUM("amountCents")::bigint as total
       FROM "Purchase" WHERE status = 'PAID'
       GROUP BY month ORDER BY month DESC LIMIT 12`,
    ).catch(() => [] as { month: string; total: bigint }[]),
  ]);

  const oneTimeTotal = oneTime._sum.amountCents ?? 0;
  const subTotal = sub._sum.amountCents ?? 0;
  const refundTotal = refunds._sum.amountCents ?? 0;
  const net = oneTimeTotal + subTotal - refundTotal;

  return (
    <div>
      <h1 className="font-display text-3xl text-[var(--color-ink)]">Comptabilité</h1>
      <p className="mt-1 font-body text-[var(--color-ink)]/60">Revenus, ventilation et remboursements.</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-4">
        {[
          ['Ventes à l\'unité', oneTimeTotal],
          ['Abonnements', subTotal],
          ['Remboursements', -refundTotal],
          ['Net encaissé', net],
        ].map(([label, val]) => (
          <div key={label as string} className="rounded-2xl border border-[var(--color-sand)] bg-white p-6">
            <p className="font-ui text-xs uppercase tracking-[0.14em] text-[var(--color-ink)]/50">{label}</p>
            <p className="mt-2 font-display text-2xl text-[var(--color-bordeaux)]">{formatPrice(val as number)}</p>
          </div>
        ))}
      </div>

      {/* Par mois */}
      <h2 className="mt-12 font-display text-2xl text-[var(--color-ink)]">Revenu par mois</h2>
      <div className="mt-4 overflow-hidden rounded-2xl border border-[var(--color-sand)] bg-white">
        <table className="w-full font-ui text-sm">
          <thead className="bg-[var(--color-sand)]/60 text-left text-[var(--color-ink)]/60">
            <tr>
              <th className="px-5 py-3">Mois</th>
              <th className="px-5 py-3 text-right">Revenu</th>
            </tr>
          </thead>
          <tbody>
            {byMonth.map((m) => (
              <tr key={m.month} className="border-t border-[var(--color-sand)]">
                <td className="px-5 py-3">{m.month}</td>
                <td className="px-5 py-3 text-right font-medium">{formatPrice(Number(m.total))}</td>
              </tr>
            ))}
            {byMonth.length === 0 && (
              <tr><td colSpan={2} className="px-5 py-8 text-center text-[var(--color-ink)]/50">Pas encore de revenus.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Journal quotidien (agrégat) */}
      <h2 className="mt-12 font-display text-2xl text-[var(--color-ink)]">Journal quotidien</h2>
      <div className="mt-4 overflow-hidden rounded-2xl border border-[var(--color-sand)] bg-white">
        <table className="w-full font-ui text-sm">
          <thead className="bg-[var(--color-sand)]/60 text-left text-[var(--color-ink)]/60">
            <tr>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3 text-right">Unité</th>
              <th className="px-5 py-3 text-right">Abonnement</th>
              <th className="px-5 py-3 text-right">Nouveaux comptes</th>
            </tr>
          </thead>
          <tbody>
            {daily.map((d) => (
              <tr key={d.id} className="border-t border-[var(--color-sand)]">
                <td className="px-5 py-3">{d.date.toLocaleDateString('fr-CA')}</td>
                <td className="px-5 py-3 text-right">{formatPrice(d.oneTimeCents)}</td>
                <td className="px-5 py-3 text-right">{formatPrice(d.subscriptionCents)}</td>
                <td className="px-5 py-3 text-right">{d.newUsers}</td>
              </tr>
            ))}
            {daily.length === 0 && (
              <tr><td colSpan={4} className="px-5 py-8 text-center text-[var(--color-ink)]/50">Aucune donnée quotidienne encore agrégée.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}