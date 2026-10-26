import { prisma } from '@/lib/db';
import { BRAND } from '@/lib/format';
import type { Role, SubscriptionStatus } from '@/generated/prisma';
import type { HubActionResult, HubRow, HubSnapshot } from './types';

// Sections du back-office Guides Immo Québec, exposées à la console centrale.
// Mêmes données que /admin ; seules les données de cette boutique sont lues ici.

const SITE = 'https://www.guidesimmoquebec.com';

const typeLabel: Record<string, string> = { ONE_TIME: 'Guide', BUNDLE: 'Coffret', SUBSCRIPTION: 'Abonnement' };
const statusLabel: Record<string, string> = { PAID: 'Payé', PENDING: 'En attente', REFUNDED: 'Remboursé', FAILED: 'Échoué' };
const subLabel: Record<string, string> = { NONE: 'Aucun', TRIALING: 'Essai', ACTIVE: 'Actif', PAST_DUE: 'En retard', CANCELED: 'Annulé' };
const collectionLabel: Record<string, string> = {
  ACHETEURS: 'Acheteurs', VENDEURS: 'Vendeurs', INVESTISSEURS: 'Investisseurs', QUEBEC_LEGAL: 'Québec légal',
  SITUATIONS: 'Situations', BILINGUE: 'Bilingue', NICHE: 'Niche',
};

export async function guidesSnapshot(): Promise<HubSnapshot> {
  const since30 = new Date(Date.now() - 30 * 86400000);
  const since90 = new Date(Date.now() - 90 * 86400000);
  const [users, ebooks, purchases, daily, newsletter, quizzes, progress, events, downloads, paidAgg, oneTimeAgg, subAgg, refundAgg, sales30] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' }, take: 500,
      select: { id: true, email: true, name: true, role: true, subscriptionStatus: true, currentPeriodEnd: true, source: true, createdAt: true, _count: { select: { purchases: true } } },
    }),
    prisma.ebook.findMany({ orderBy: { number: 'asc' }, select: { id: true, number: true, title: true, collection: true, priceCents: true, isPublished: true, isFeatured: true, includedInSubscription: true, _count: { select: { purchases: true, downloads: true } } } }),
    prisma.purchase.findMany({ orderBy: { createdAt: 'desc' }, take: 300, include: { user: { select: { email: true } }, ebook: { select: { title: true } } } }),
    prisma.dailyRevenue.findMany({ where: { date: { gte: since90 } }, orderBy: { date: 'desc' }, take: 60 }),
    prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: 'desc' }, take: 1000 }),
    prisma.quizAttempt.findMany({ orderBy: { createdAt: 'desc' }, take: 100, include: { user: { select: { email: true } } } }),
    prisma.readingProgress.findMany({ orderBy: { updatedAt: 'desc' }, take: 100, include: { user: { select: { email: true } }, ebook: { select: { title: true } } } }),
    prisma.analyticsEvent.groupBy({ by: ['name'], where: { createdAt: { gte: since30 } }, _count: { _all: true } }),
    prisma.downloadEvent.count({ where: { createdAt: { gte: since30 } } }),
    prisma.purchase.aggregate({ _sum: { amountCents: true }, _count: true, where: { status: 'PAID' } }),
    prisma.purchase.aggregate({ _sum: { amountCents: true }, where: { status: 'PAID', type: { in: ['ONE_TIME', 'BUNDLE'] } } }),
    prisma.purchase.aggregate({ _sum: { amountCents: true }, where: { status: 'PAID', type: 'SUBSCRIPTION' } }),
    prisma.purchase.aggregate({ _sum: { amountCents: true }, where: { status: 'REFUNDED' } }),
    prisma.purchase.aggregate({ _sum: { amountCents: true }, where: { status: 'PAID', createdAt: { gte: since30 } } }),
  ]);
  const byMonth = await prisma
    .$queryRawUnsafe<{ month: string; total: bigint }[]>(
      `SELECT to_char("createdAt", 'YYYY-MM') as month, SUM("amountCents")::bigint as total
       FROM "Purchase" WHERE status = 'PAID' GROUP BY month ORDER BY month DESC LIMIT 12`,
    )
    .catch(() => [] as { month: string; total: bigint }[]);

  const activeSubs = users.filter((u) => u.subscriptionStatus === 'ACTIVE' || u.subscriptionStatus === 'TRIALING').length;
  const mrr = activeSubs * BRAND.subscriptionCents;
  const oneTime = oneTimeAgg._sum.amountCents ?? 0;
  const subs = subAgg._sum.amountCents ?? 0;
  const refunds = refundAgg._sum.amountCents ?? 0;
  const published = ebooks.filter((e) => e.isPublished).length;
  const ebookOptions = ebooks.map((e) => ({ value: e.id, label: `${e.number}. ${e.title}` }));

  const saleRows: HubRow[] = purchases.map((p) => ({
    date: p.createdAt.toISOString(),
    client: p.user?.email ?? p.guestEmail ?? 'Achat invité',
    item: p.ebook?.title ?? typeLabel[p.type] ?? p.type,
    type: typeLabel[p.type] ?? p.type,
    status: statusLabel[p.status] ?? p.status,
    amount: p.amountCents,
  }));
  const saleColumns = [
    { key: 'date', label: 'Date', format: 'datetime' as const },
    { key: 'client', label: 'Client' },
    { key: 'item', label: 'Guide / type' },
    { key: 'status', label: 'Statut', format: 'badge' as const },
    { key: 'amount', label: 'Montant', format: 'money' as const, align: 'right' as const },
  ];

  return {
    generatedAt: new Date().toISOString(),
    currency: 'CAD',
    sections: [
      {
        id: 'overview', label: 'Tableau de bord', icon: '⌂',
        blocks: [
          { type: 'metrics', items: [
            { label: 'Utilisateurs', value: users.length, hint: 'comptes créés' },
            { label: 'Abonnés actifs', value: activeSubs, hint: `${activeSubs} × ${BRAND.subscriptionCents / 100} $` },
            { label: 'Revenu récurrent (MRR)', value: mrr, format: 'money' },
            { label: 'Ventes 30 jours', value: sales30._sum.amountCents ?? 0, format: 'money' },
            { label: 'Ventes payées', value: paidAgg._count, hint: 'tous types' },
            { label: 'Revenu total', value: paidAgg._sum.amountCents ?? 0, format: 'money', hint: 'cumul' },
            { label: 'Guides publiés', value: `${published}/${ebooks.length}` },
            { label: 'Téléchargements 30 j', value: downloads },
          ] },
          { type: 'table', title: 'Dernières ventes', columns: saleColumns, rows: saleRows.filter((r) => r.status === 'Payé').slice(0, 8), empty: 'Aucune vente pour l’instant.' },
        ],
      },
      {
        id: 'sales', label: 'Ventes', icon: '□', badge: paidAgg._count || undefined,
        blocks: [
          { type: 'table', title: 'Toutes les commandes', description: '300 plus récentes, tous statuts.', columns: saleColumns, rows: saleRows, empty: 'Aucune commande.' },
        ],
      },
      {
        id: 'guides', label: 'Guides', icon: '▤', badge: ebooks.length,
        blocks: [
          { type: 'links', title: 'Catalogue', items: [{ label: 'Ajouter un guide', href: `${SITE}/admin/livres/new` }] },
          {
            type: 'table', title: 'Guides au catalogue', description: 'La fiche complète (description, PDF, prix) se modifie dans l’admin de la boutique.',
            columns: [
              { key: 'number', label: 'N°', align: 'right' }, { key: 'title', label: 'Titre' }, { key: 'collection', label: 'Collection' },
              { key: 'price', label: 'Prix', format: 'money', align: 'right' }, { key: 'state', label: 'État', format: 'badge' },
              { key: 'sales', label: 'Ventes', align: 'right' }, { key: 'downloads', label: 'Téléch.', align: 'right' }, { key: 'edit', label: 'Fiche', format: 'link' },
            ],
            rows: ebooks.map((e) => ({
              number: e.number, title: e.title, collection: collectionLabel[e.collection] ?? e.collection, price: e.priceCents,
              state: e.isPublished ? 'Publié' : 'Non publié', sales: e._count.purchases, downloads: e._count.downloads, edit: `${SITE}/admin/livres/${e.id}`,
              _actions: [e.isPublished
                ? { label: 'Dépublier', action: 'publish', payload: { id: e.id, next: false }, confirm: `Retirer « ${e.title} » du catalogue public ?`, tone: 'danger' as const }
                : { label: 'Publier', action: 'publish', payload: { id: e.id, next: true } }],
            })),
            empty: 'Aucun guide.',
          },
        ],
      },
      {
        id: 'users', label: 'Utilisateurs', icon: '◎', badge: users.length,
        blocks: [
          {
            type: 'table', title: 'Comptes clients',
            columns: [
              { key: 'email', label: 'Courriel' }, { key: 'name', label: 'Nom' }, { key: 'role', label: 'Rôle', format: 'badge' },
              { key: 'sub', label: 'Abonnement', format: 'badge' }, { key: 'until', label: 'Fin de période', format: 'date' },
              { key: 'purchases', label: 'Achats', align: 'right' }, { key: 'source', label: 'Provenance' }, { key: 'created', label: 'Inscription', format: 'date' },
            ],
            rows: users.map((u) => ({
              email: u.email, name: u.name, role: u.role === 'ADMIN' ? 'Admin' : 'Client', sub: subLabel[u.subscriptionStatus] ?? u.subscriptionStatus,
              until: u.currentPeriodEnd?.toISOString() ?? null, purchases: u._count.purchases, source: u.source, created: u.createdAt.toISOString(),
              _actions: [
                u.subscriptionStatus === 'ACTIVE'
                  ? { label: 'Retirer l’abonnement', action: 'subscription', payload: { userId: u.id, status: 'CANCELED' }, confirm: `Retirer l’accès abonnement de ${u.email} ?`, tone: 'danger' as const }
                  : { label: 'Offrir 30 j d’abonnement', action: 'subscription', payload: { userId: u.id, status: 'ACTIVE' } },
                { label: 'Offrir un guide', action: 'grant', payload: { userId: u.id }, fields: [{ name: 'ebookId', label: 'Guide offert', type: 'select' as const, required: true, options: ebookOptions }] },
                u.role === 'ADMIN'
                  ? { label: 'Retirer admin', action: 'role', payload: { userId: u.id, role: 'USER' }, confirm: `Retirer les droits admin de ${u.email} ?`, tone: 'danger' as const }
                  : { label: 'Rendre admin', action: 'role', payload: { userId: u.id, role: 'ADMIN' }, confirm: `Donner l’accès complet au back-office à ${u.email} ?` },
              ],
            })),
            empty: 'Aucun utilisateur.',
          },
        ],
      },
      {
        id: 'accounting', label: 'Comptabilité', icon: '$',
        blocks: [
          { type: 'metrics', items: [
            { label: 'Ventes à l’unité', value: oneTime, format: 'money' },
            { label: 'Abonnements', value: subs, format: 'money' },
            { label: 'Remboursements', value: -refunds, format: 'money' },
            { label: 'Net encaissé', value: oneTime + subs - refunds, format: 'money' },
          ] },
          { type: 'bars', title: 'Revenu par mois', format: 'money', items: byMonth.map((m) => ({ label: m.month, value: Number(m.total) })).reverse() },
          {
            type: 'table', title: 'Journal quotidien',
            columns: [
              { key: 'date', label: 'Date', format: 'date' }, { key: 'oneTime', label: 'Unité', format: 'money', align: 'right' },
              { key: 'sub', label: 'Abonnement', format: 'money', align: 'right' }, { key: 'refunds', label: 'Remboursements', format: 'money', align: 'right' },
              { key: 'users', label: 'Nouveaux comptes', align: 'right' }, { key: 'subscribers', label: 'Nouveaux abonnés', align: 'right' },
            ],
            rows: daily.map((d) => ({ date: d.date.toISOString(), oneTime: d.oneTimeCents, sub: d.subscriptionCents, refunds: d.refundsCents, users: d.newUsers, subscribers: d.newSubscribers })),
            empty: 'Aucune donnée quotidienne encore agrégée.',
          },
        ],
      },
      {
        id: 'reading', label: 'Lecture & quiz', icon: '✎',
        blocks: [
          {
            type: 'table', title: 'Derniers quiz',
            columns: [{ key: 'date', label: 'Date', format: 'datetime' }, { key: 'user', label: 'Lecteur' }, { key: 'guide', label: 'Guide' }, { key: 'score', label: 'Note /10', align: 'right' }],
            rows: quizzes.map((q) => ({ date: q.createdAt.toISOString(), user: q.user.email, guide: q.guideTitle, score: q.scoreOn10 })),
            empty: 'Aucun quiz complété.',
          },
          {
            type: 'table', title: 'Progression de lecture',
            columns: [{ key: 'date', label: 'Dernière lecture', format: 'datetime' }, { key: 'user', label: 'Lecteur' }, { key: 'guide', label: 'Guide' }, { key: 'progress', label: 'Chapitre', align: 'right' }, { key: 'done', label: 'Terminé', format: 'badge' }],
            rows: progress.map((r) => ({ date: r.updatedAt.toISOString(), user: r.user.email, guide: r.ebook.title, progress: `${r.chapterIndex + 1}/${r.chapterCount}`, done: r.completed ? 'Oui' : 'En cours' })),
            empty: 'Aucune lecture en cours.',
          },
        ],
      },
      {
        id: 'analytics', label: 'Statistiques', icon: '↗',
        blocks: [
          { type: 'bars', title: 'Événements sur 30 jours', items: events.map((e) => ({ label: e.name, value: e._count._all })).sort((a, b) => b.value - a.value) },
        ],
      },
      {
        id: 'newsletter', label: 'Newsletter', icon: '✉', badge: newsletter.length || undefined,
        blocks: [
          { type: 'metrics', items: [{ label: 'Inscrits', value: newsletter.length }, { label: 'Confirmés', value: newsletter.filter((n) => n.confirmed).length }] },
          {
            type: 'table', title: 'Inscriptions',
            columns: [{ key: 'email', label: 'Courriel' }, { key: 'source', label: 'Source' }, { key: 'confirmed', label: 'Confirmé', format: 'badge' }, { key: 'date', label: 'Inscription', format: 'date' }],
            rows: newsletter.map((n) => ({ email: n.email, source: n.source, confirmed: n.confirmed ? 'Confirmé' : 'En attente', date: n.createdAt.toISOString() })),
            empty: 'Aucun inscrit.',
          },
        ],
      },
      {
        id: 'setup', label: 'Configuration', icon: '⚙',
        blocks: [
          { type: 'status', title: 'Services', items: [
            { label: 'Paiements Stripe', ok: !!process.env.STRIPE_SECRET_KEY, detail: 'STRIPE_SECRET_KEY' },
            { label: 'Webhook Stripe', ok: !!process.env.STRIPE_WEBHOOK_SECRET, detail: 'STRIPE_WEBHOOK_SECRET' },
            { label: 'Courriels après achat (Resend)', ok: !!process.env.RESEND_API_KEY, detail: 'RESEND_API_KEY' },
          ] },
          { type: 'links', title: 'Raccourcis', items: [{ label: 'Admin de la boutique', href: `${SITE}/admin` }, { label: 'Voir la boutique', href: SITE }] },
        ],
      },
    ],
  };
}

const ROLES: Role[] = ['USER', 'ADMIN'];
const SUBS: SubscriptionStatus[] = ['ACTIVE', 'CANCELED'];
const id = (v: unknown) => {
  if (typeof v !== 'string' || !/^[a-z0-9]{10,40}$/i.test(v)) throw new HubError('Identifiant invalide');
  return v;
};
export class HubError extends Error {}

export async function guidesAction(action: string, p: Record<string, unknown>): Promise<HubActionResult> {
  if (action === 'publish') {
    await prisma.ebook.update({ where: { id: id(p.id) }, data: { isPublished: p.next === true } });
    return { ok: true, message: p.next === true ? 'Guide publié.' : 'Guide retiré du catalogue.' };
  }
  if (action === 'role') {
    const role = ROLES.find((r) => r === p.role);
    if (!role) throw new HubError('Rôle invalide');
    await prisma.user.update({ where: { id: id(p.userId) }, data: { role } });
    return { ok: true, message: role === 'ADMIN' ? 'Droits admin accordés.' : 'Droits admin retirés.' };
  }
  if (action === 'subscription') {
    const status = SUBS.find((s) => s === p.status);
    if (!status) throw new HubError('Statut invalide');
    const currentPeriodEnd = status === 'ACTIVE' ? new Date(Date.now() + 30 * 86400000) : null;
    await prisma.user.update({ where: { id: id(p.userId) }, data: { subscriptionStatus: status, currentPeriodEnd } });
    return { ok: true, message: status === 'ACTIVE' ? 'Abonnement offert pour 30 jours.' : 'Abonnement retiré.' };
  }
  if (action === 'grant') {
    await prisma.purchase.create({ data: { userId: id(p.userId), ebookId: id(p.ebookId), type: 'ONE_TIME', status: 'PAID', amountCents: 0 } });
    return { ok: true, message: 'Guide offert : il apparaît dans la bibliothèque du client.' };
  }
  throw new HubError('Action introuvable');
}
