export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { accessibleEbookIds } from '@/lib/entitlements';
import { bySlug, BOOKS } from '@/data/books';
import { formatPrice, BRAND } from '@/lib/format';
import { SubscribeButton, SignOutButton } from '@/components/AccountActions';

export const metadata: Metadata = { title: 'Mon compte' };

const STATUS_LABEL: Record<string, string> = {
  NONE: 'Aucun abonnement',
  TRIALING: 'Essai en cours',
  ACTIVE: 'Abonnement actif',
  PAST_DUE: 'Paiement en retard',
  CANCELED: 'Abonnement annulé',
};

export default async function AccountPage() {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) redirect('/connexion?next=/compte');

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) redirect('/connexion');

  const ids = await accessibleEbookIds(userId);
  const ebooks = await prisma.ebook.findMany({ where: { id: { in: [...ids] } } });
  const myBooks = ebooks
    .map((e) => bySlug(e.slug))
    .filter((b): b is NonNullable<typeof b> => Boolean(b))
    .sort((a, b) => a.number - b.number);

  const subActive = user.subscriptionStatus === 'ACTIVE' || user.subscriptionStatus === 'TRIALING';

  return (
    <div className="mx-auto max-w-5xl px-5 py-14">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-ui text-xs uppercase tracking-[0.2em] text-[var(--color-gold)]">Mon compte</p>
          <h1 className="mt-1 font-display text-3xl text-[var(--color-ink)]">
            Bonjour{user.name ? `, ${user.name}` : ''}
          </h1>
          <p className="mt-1 font-body text-[var(--color-ink)]/60">{user.email}</p>
        </div>
        <SignOutButton />
      </div>

      {/* Abonnement */}
      <section className="mt-10 rounded-2xl border border-[var(--color-sand)] bg-white p-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-ui text-xs uppercase tracking-[0.16em] text-[var(--color-gold)]">Abonnement</p>
            <p className="mt-2 font-display text-2xl text-[var(--color-ink)]">
              {STATUS_LABEL[user.subscriptionStatus] ?? user.subscriptionStatus}
            </p>
            {subActive && user.currentPeriodEnd && (
              <p className="mt-1 font-body text-sm text-[var(--color-ink)]/60">
                Prochaine échéance le {new Date(user.currentPeriodEnd).toLocaleDateString('fr-CA')}
              </p>
            )}
            {!subActive && (
              <p className="mt-1 font-body text-sm text-[var(--color-ink)]/60">
                {formatPrice(BRAND.subscriptionCents)}/mois — accès aux 50 guides.
              </p>
            )}
          </div>
          <SubscribeButton active={subActive} />
        </div>
      </section>

      {/* Bibliothèque */}
      <section className="mt-10">
        <h2 className="font-display text-2xl text-[var(--color-ink)]">Ma bibliothèque</h2>
        {myBooks.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-[var(--color-sand)] p-10 text-center">
            <p className="font-body text-[var(--color-ink)]/60">
              Vous n&apos;avez pas encore de guide.
            </p>
            <Link href="/catalogue" className="mt-3 inline-block font-ui text-sm text-[var(--color-bordeaux)] hover:underline">
              Parcourir le catalogue →
            </Link>
          </div>
        ) : (
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {myBooks.map((b) => (
              <div key={b.slug} className="flex flex-col rounded-2xl border border-[var(--color-sand)] bg-white p-5">
                <h3 className="font-display text-lg text-[var(--color-bordeaux)]">{b.title}</h3>
                <p className="mt-1 flex-1 font-body text-sm text-[var(--color-ink)]/65">{b.subtitle}</p>
                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/lire/${b.slug}`}
                    className="flex-1 rounded-full bg-[var(--color-bordeaux)] py-2 text-center font-ui text-xs font-medium text-white hover:bg-[var(--color-bordeaux-dark)]"
                  >
                    Lire
                  </Link>
                  <a
                    href={`/api/download?slug=${b.slug}`}
                    className="flex-1 rounded-full border border-[var(--color-bordeaux)] py-2 text-center font-ui text-xs text-[var(--color-bordeaux)] hover:bg-[var(--color-sand)]"
                  >
                    PDF
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
        <p className="mt-4 font-ui text-sm text-[var(--color-ink)]/50">
          {myBooks.length} guide{myBooks.length > 1 ? 's' : ''} sur {BOOKS.length}.
        </p>
      </section>
    </div>
  );
}