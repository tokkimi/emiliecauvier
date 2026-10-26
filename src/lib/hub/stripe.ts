import type Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import type { HubBlock } from './types';

// Encaissements réels lus dans le compte Stripe de la boutique : frais, remboursements, net et versements.

const txType: Record<string, string> = {
  charge: 'Paiement', payment: 'Paiement', refund: 'Remboursement', payment_refund: 'Remboursement', payout: 'Versement',
  stripe_fee: 'Frais Stripe', adjustment: 'Ajustement', dispute: 'Litige', tax_fee: 'Frais de taxe',
};
const payoutStatus: Record<string, string> = { paid: 'Versé', pending: 'En attente', in_transit: 'En transit', canceled: 'Annulé', failed: 'Échoué' };
const iso = (t: number) => new Date(t * 1000).toISOString();

export async function stripeBlocks(): Promise<HubBlock[]> {
  if (!stripe) return [{ type: 'notes', title: 'Stripe non connecté', items: ['Ajoutez STRIPE_SECRET_KEY dans le projet Vercel emiliecauvier pour afficher les encaissements réels.'] }];
  try {
    const year = new Date().getFullYear();
    const since = Math.floor(Date.UTC(year - 1, 0, 1) / 1000);
    const [txs, payouts, balance] = await Promise.all([
      stripe.balanceTransactions.list({ limit: 100, created: { gte: since } }).autoPagingToArray({ limit: 2000 }),
      stripe.payouts.list({ limit: 50 }),
      stripe.balance.retrieve(),
    ]);
    const isSale = (t: Stripe.BalanceTransaction) => t.type === 'charge' || t.type === 'payment';
    const isRefund = (t: Stripe.BalanceTransaction) => t.type === 'refund' || t.type === 'payment_refund';
    const inYear = (t: Stripe.BalanceTransaction) => new Date(t.created * 1000).getFullYear() === year;
    const ops = txs.filter((t) => t.type !== 'payout');
    const gross = ops.filter((t) => isSale(t) && inYear(t)).reduce((a, t) => a + t.amount, 0);
    const refunds = ops.filter((t) => isRefund(t) && inYear(t)).reduce((a, t) => a + t.amount, 0);
    const fees = ops.filter(inYear).reduce((a, t) => a + t.fee + (t.type === 'stripe_fee' ? -t.amount : 0), 0);
    const net = ops.filter(inYear).reduce((a, t) => a + t.net, 0);
    const months = new Map<string, { gross: number; refunds: number; fees: number; net: number }>();
    for (const t of ops) {
      const k = iso(t.created).slice(0, 7);
      const m = months.get(k) ?? { gross: 0, refunds: 0, fees: 0, net: 0 };
      if (isSale(t)) m.gross += t.amount;
      if (isRefund(t)) m.refunds += t.amount;
      m.fees += t.fee + (t.type === 'stripe_fee' ? -t.amount : 0);
      m.net += t.net;
      months.set(k, m);
    }
    const monthRows = [...months].sort((a, b) => b[0].localeCompare(a[0]));
    const sumBal = (l: { amount: number }[]) => l.reduce((a, b) => a + b.amount, 0);
    return [
      { type: 'metrics', items: [
        { label: `Ventes brutes ${year}`, value: gross, format: 'money' },
        { label: 'Remboursements', value: refunds, format: 'money' },
        { label: 'Frais Stripe', value: -fees, format: 'money' },
        { label: `Net encaissé ${year}`, value: net, format: 'money' },
        { label: 'Solde disponible', value: sumBal(balance.available), format: 'money', hint: `En attente : ${(sumBal(balance.pending) / 100).toFixed(2)} $` },
      ] },
      { type: 'bars', title: 'Net encaissé par mois', format: 'money', items: monthRows.slice(0, 12).reverse().map(([label, m]) => ({ label, value: m.net })) },
      { type: 'table', title: 'État mensuel Stripe', columns: [
        { key: 'month', label: 'Mois' }, { key: 'gross', label: 'Ventes brutes', format: 'money', align: 'right' }, { key: 'refunds', label: 'Remboursements', format: 'money', align: 'right' },
        { key: 'fees', label: 'Frais', format: 'money', align: 'right' }, { key: 'net', label: 'Net', format: 'money', align: 'right' },
      ], rows: monthRows.map(([month, m]) => ({ month, gross: m.gross, refunds: m.refunds, fees: -m.fees, net: m.net })), empty: 'Aucune transaction.' },
      { type: 'table', title: 'Grand livre Stripe', description: 'Chaque mouvement du compte Stripe depuis janvier dernier. Exportez-le en CSV pour votre comptable.', columns: [
        { key: 'date', label: 'Date', format: 'datetime' }, { key: 'type', label: 'Type', format: 'badge' }, { key: 'desc', label: 'Description' },
        { key: 'gross', label: 'Brut', format: 'money', align: 'right' }, { key: 'fee', label: 'Frais', format: 'money', align: 'right' }, { key: 'net', label: 'Net', format: 'money', align: 'right' },
      ], rows: txs.map((t) => ({ date: iso(t.created), type: txType[t.type] ?? t.type, desc: t.description ?? '', gross: t.amount, fee: -t.fee, net: t.net })), empty: 'Aucun mouvement.' },
      { type: 'table', title: 'Versements vers votre compte bancaire', columns: [
        { key: 'date', label: 'Arrivée', format: 'date' }, { key: 'status', label: 'Statut', format: 'badge' }, { key: 'amount', label: 'Montant', format: 'money', align: 'right' },
      ], rows: payouts.data.map((p) => ({ date: iso(p.arrival_date), status: payoutStatus[p.status] ?? p.status, amount: p.amount })), empty: 'Aucun versement.' },
    ];
  } catch (e) {
    console.error('Hub Stripe', e instanceof Error ? e.message : 'unknown');
    return [{ type: 'notes', title: 'Stripe indisponible', items: ['Stripe ne répond pas ou la clé est invalide.'] }];
  }
}

export async function refundPayment(paymentIntent: string) {
  if (!stripe) throw new Error('Stripe non configuré.');
  await stripe.refunds.create({ payment_intent: paymentIntent });
}
