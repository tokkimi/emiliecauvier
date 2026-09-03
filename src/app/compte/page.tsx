export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { accessibleEbookIds, downloadableEbookIds } from '@/lib/entitlements';
import { bySlug, BOOKS, COLLECTIONS } from '@/data/books';
import { formatPrice, BRAND } from '@/lib/format';
import { SubscribeButton, SignOutButton } from '@/components/AccountActions';
import { AccountSettings } from '@/components/AccountSettings';
import { BookCover } from '@/components/BookCover';
import { FavoriteButton } from '@/components/FavoriteButton';
import { recommendBooks, type ProjectAnswers } from '@/lib/recommendations';
import { ToolsHub } from '@/components/ToolsHub';

export const metadata: Metadata = { title: 'Mon compte' };

const STATUS_LABEL: Record<string, string> = {
  NONE: 'Aucun abonnement',
  TRIALING: 'Essai en cours',
  ACTIVE: 'Abonnement actif',
  PAST_DUE: 'Paiement en retard',
  CANCELED: 'Abonnement annulé',
};

const date = (value: Date) => new Intl.DateTimeFormat('fr-CA', { dateStyle: 'medium' }).format(value);

export default async function AccountPage() {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) redirect('/connexion?next=/compte');

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) redirect('/connexion');

  const [ids, dlIds, quizAttempts, purchases, progressEntries, favorites, paidEbookPurchases] = await Promise.all([
    accessibleEbookIds(userId),
    downloadableEbookIds(userId),
    prisma.quizAttempt.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 6 }),
    prisma.purchase.findMany({
      where: { userId, status: 'PAID' },
      include: { ebook: true },
      orderBy: { createdAt: 'desc' },
      take: 6,
    }),
    prisma.readingProgress.findMany({
      where: { userId },
      include: { ebook: true },
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.favorite.findMany({ where: { userId }, include: { ebook: true }, orderBy: { createdAt: 'desc' } }),
    prisma.purchase.findMany({
      where: { userId, status: 'PAID', type: 'ONE_TIME', ebookId: { not: null } },
      select: { ebookId: true },
    }),
  ]);

  const ebooks = await prisma.ebook.findMany({ where: { id: { in: [...ids] } } });
  const slugToId = new Map(ebooks.map((ebook) => [ebook.slug, ebook.id]));
  const progressByEbook = new Map(progressEntries.map((progress) => [progress.ebookId, progress]));
  const myBooks = ebooks
    .map((ebook) => bySlug(ebook.slug))
    .filter((book): book is NonNullable<typeof book> => Boolean(book))
    .sort((a, b) => a.number - b.number);

  const continueReading = progressEntries
    .filter((progress) => !progress.completed)
    .map((progress) => ({ progress, book: bySlug(progress.ebook.slug) }))
    .filter((item): item is typeof item & { book: NonNullable<typeof item.book> } => Boolean(item.book))
    .slice(0, 3);
  const completedCount = progressEntries.filter((progress) => progress.completed).length;
  const averageQuiz = quizAttempts.length
    ? Math.round(quizAttempts.reduce((sum, attempt) => sum + attempt.scoreOn10, 0) / quizAttempts.length)
    : null;
  const subActive =
    user.role === 'ADMIN' ||
    ((user.subscriptionStatus === 'ACTIVE' || user.subscriptionStatus === 'TRIALING') &&
      (!user.currentPeriodEnd || user.currentPeriodEnd > new Date()));
  const paidEbookCount = new Set(paidEbookPurchases.map((purchase) => purchase.ebookId).filter(Boolean)).size;
  const toolsUnlocked = subActive || paidEbookCount >= 3;
  const favoriteBooks = favorites
    .map((favorite) => bySlug(favorite.ebook.slug))
    .filter((book): book is NonNullable<typeof book> => Boolean(book));
  const journeyAnswers = user.projectStage && user.projectArea && user.propertyType && user.budgetRange
    ? {
        stage: user.projectStage,
        area: user.projectArea,
        propertyType: user.propertyType,
        budget: user.budgetRange,
      } as ProjectAnswers
    : null;
  const journeyBooks = journeyAnswers ? recommendBooks(journeyAnswers) : [];
  const journeyCompleted = journeyBooks.filter((book) => {
    const ebook = ebooks.find((item) => item.slug === book.slug);
    return ebook ? progressByEbook.get(ebook.id)?.completed : false;
  }).length;

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:py-14">
      <header className="flex flex-col justify-between gap-5 border-b border-[var(--color-sand)] pb-8 sm:flex-row sm:items-end">
        <div>
          <p className="font-ui text-xs uppercase tracking-[0.2em] text-[var(--color-gold)]">Espace lecteur</p>
          <h1 className="mt-2 font-display text-4xl text-[var(--color-ink)]">
            Bonjour{user.name ? `, ${user.name}` : ''}
          </h1>
          <p className="mt-2 font-body text-[var(--color-ink)]/60">
            Retrouvez vos guides, votre progression et vos résultats au même endroit.
          </p>
        </div>
        <SignOutButton />
      </header>

      <nav className="mt-6 flex flex-wrap gap-2 font-ui text-sm" aria-label="Sections du compte">
        <a href="#bibliotheque" className="rounded-full bg-[var(--color-bordeaux)] px-4 py-2 text-white">Bibliothèque</a>
        <a href="#favoris" className="rounded-full border border-[var(--color-sand)] bg-white px-4 py-2 hover:border-[var(--color-gold)]">Favoris</a>
        <a href="#outils" className="rounded-full border border-[var(--color-sand)] bg-white px-4 py-2 hover:border-[var(--color-gold)]">Mes outils</a>
        <a href="#activite" className="rounded-full border border-[var(--color-sand)] bg-white px-4 py-2 hover:border-[var(--color-gold)]">Activité</a>
        <a href="#profil" className="rounded-full border border-[var(--color-sand)] bg-white px-4 py-2 hover:border-[var(--color-gold)]">Profil et sécurité</a>
      </nav>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Résumé du compte">
        {[
          ['Guides accessibles', `${myBooks.length} / ${BOOKS.length}`],
          ['En cours', String(progressEntries.filter((progress) => !progress.completed).length)],
          ['Terminés', String(completedCount)],
          ['Moyenne aux quiz', averageQuiz === null ? '—' : `${averageQuiz} / 10`],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-[var(--color-sand)] bg-white p-5">
            <p className="font-ui text-xs uppercase tracking-[0.12em] text-[var(--color-ink)]/50">{label}</p>
            <p className="mt-2 font-display text-3xl text-[var(--color-bordeaux)]">{value}</p>
          </div>
        ))}
      </section>

      <section className="mt-8 overflow-hidden rounded-2xl bg-[var(--color-ink)] text-[var(--color-cream)]">
        <div className="flex flex-col justify-between gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
          <div>
            <p className="font-ui text-xs uppercase tracking-[0.16em] text-[var(--color-gold-soft)]">Abonnement</p>
            <p className="mt-2 font-display text-2xl">{STATUS_LABEL[user.subscriptionStatus] ?? user.subscriptionStatus}</p>
            <p className="mt-2 max-w-xl font-body text-sm text-white/65">
              {subActive && user.currentPeriodEnd
                ? `Prochaine échéance le ${date(user.currentPeriodEnd)}.`
                : `${formatPrice(BRAND.subscriptionCents)}/mois pour lire les ${BOOKS.length} guides en ligne.`}
            </p>
          </div>
          <div className="[&_button]:border-white/40 [&_button]:text-white [&_button:hover]:bg-white/10">
            <SubscribeButton active={subActive} />
          </div>
        </div>
      </section>

      {continueReading.length > 0 && (
        <section className="mt-12">
          <p className="font-ui text-xs uppercase tracking-[0.16em] text-[var(--color-gold)]">Reprendre</p>
          <h2 className="mt-1 font-display text-3xl">Continuer la lecture</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            {continueReading.map(({ book, progress }) => {
              const percent = Math.round(((progress.chapterIndex + 1) / progress.chapterCount) * 100);
              return (
                <Link
                  key={book.slug}
                  href={`/lire/${book.slug}`}
                  className="group rounded-2xl border border-[var(--color-sand)] bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <p className="font-ui text-xs uppercase tracking-[0.12em] text-[var(--color-gold)]">
                    Guide n°{book.number} · {percent} %
                  </p>
                  <h3 className="mt-2 font-display text-xl text-[var(--color-bordeaux)] group-hover:underline">{book.title}</h3>
                  <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-[var(--color-sand)]">
                    <div className="h-full rounded-full bg-[var(--color-gold)]" style={{ width: `${percent}%` }} />
                  </div>
                  <p className="mt-3 font-ui text-sm text-[var(--color-bordeaux)]">Reprendre au chapitre {progress.chapterIndex + 1} →</p>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {journeyBooks.length > 0 && (
        <section className="mt-12 overflow-hidden rounded-3xl border border-[var(--color-sand)] bg-[#f7f2ec] p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="font-ui text-xs uppercase tracking-[0.16em] text-[var(--color-gold)]">Votre parcours recommandé</p>
              <h2 className="mt-1 font-display text-3xl">Une bibliothèque qui suit votre projet</h2>
            </div>
            <p className="font-display text-2xl text-[var(--color-bordeaux)]">{journeyCompleted} / {journeyBooks.length} terminés</p>
          </div>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-white">
            <div className="h-full rounded-full bg-[var(--color-gold)]" style={{ width: `${(journeyCompleted / journeyBooks.length) * 100}%` }} />
          </div>
          <ol className="mt-6 grid gap-3 md:grid-cols-2">
            {journeyBooks.map((book, index) => (
              <li key={book.slug}>
                <Link href={`/lire/${book.slug}`} className="flex min-h-14 items-center gap-4 rounded-2xl bg-white px-4 py-3 transition hover:shadow-sm">
                  <span className="font-display text-xl text-[var(--color-gold)]">{String(index + 1).padStart(2, '0')}</span>
                  <span className="font-body text-[var(--color-bordeaux)]">{book.title}</span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      )}

      <section id="favoris" className="scroll-mt-24 pt-12">
        <p className="font-ui text-xs uppercase tracking-[0.16em] text-[var(--color-gold)]">À garder près de vous</p>
        <h2 className="mt-1 font-display text-3xl">Mes favoris</h2>
        {favoriteBooks.length ? (
          <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {favoriteBooks.map((book) => (
              <article key={book.slug} className="relative overflow-hidden rounded-2xl border border-[var(--color-sand)] bg-white">
                <Link href={`/livre/${book.slug}`}><BookCover number={book.number} title={book.title} collection={COLLECTIONS[book.collection]} /></Link>
                <div className="absolute right-3 top-3"><FavoriteButton slug={book.slug} initialFavorite loggedIn /></div>
                <Link href={`/livre/${book.slug}`} className="block p-4 font-display text-base leading-tight text-[var(--color-bordeaux)] sm:text-lg">{book.title}</Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-2xl border border-dashed border-[var(--color-sand)] bg-white p-8 text-center">
            <p className="font-body text-[var(--color-ink)]/60">Touchez le cœur d’un guide pour le retrouver ici.</p>
            <Link href="/catalogue" className="mt-3 inline-block font-ui text-sm text-[var(--color-bordeaux)] underline">Choisir mes favoris</Link>
          </div>
        )}
      </section>

      <section id="bibliotheque" className="scroll-mt-24 pt-12">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="font-ui text-xs uppercase tracking-[0.16em] text-[var(--color-gold)]">Collection personnelle</p>
            <h2 className="mt-1 font-display text-3xl">Ma bibliothèque</h2>
          </div>
          <Link href="/catalogue" className="font-ui text-sm text-[var(--color-bordeaux)] hover:underline">Explorer le catalogue →</Link>
        </div>

        {myBooks.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-dashed border-[var(--color-sand)] bg-white p-10 text-center">
            <p className="font-display text-2xl text-[var(--color-ink)]">Votre bibliothèque vous attend.</p>
            <p className="mt-2 font-body text-[var(--color-ink)]/60">Achetez un guide ou choisissez l’abonnement complet.</p>
            <Link href="/catalogue" className="mt-5 inline-block rounded-full bg-[var(--color-bordeaux)] px-6 py-3 font-ui text-sm text-white">Découvrir les guides</Link>
          </div>
        ) : (
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {myBooks.map((book) => {
              const ebookId = slugToId.get(book.slug) ?? '';
              const progress = progressByEbook.get(ebookId);
              const percent = progress ? Math.round(((progress.chapterIndex + 1) / progress.chapterCount) * 100) : 0;
              return (
                <article key={book.slug} className="grid grid-cols-[92px_1fr] gap-4 rounded-2xl border border-[var(--color-sand)] bg-white p-4">
                  <BookCover
                    number={book.number}
                    title={book.title}
                    collection={COLLECTIONS[book.collection]}
                    className="w-[92px] rounded-lg border border-[var(--color-sand)]"
                  />
                  <div className="flex min-w-0 flex-col">
                    <p className="font-ui text-[0.65rem] uppercase tracking-[0.12em] text-[var(--color-gold)]">Guide n°{book.number}</p>
                    <h3 className="mt-1 font-display text-lg leading-snug text-[var(--color-bordeaux)]">{book.title}</h3>
                    <div className="mt-auto pt-4">
                      <div className="mb-2 flex justify-between font-ui text-[0.65rem] text-[var(--color-ink)]/50">
                        <span>{percent ? `${percent} % lu` : 'À commencer'}</span>
                        {progress?.completed && <span>Terminé</span>}
                      </div>
                      <div className="mb-3 h-1 overflow-hidden rounded-full bg-[var(--color-sand)]">
                        <div className="h-full bg-[var(--color-gold)]" style={{ width: `${percent}%` }} />
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/lire/${book.slug}`} className="flex-1 rounded-full bg-[var(--color-bordeaux)] py-2 text-center font-ui text-xs font-medium text-white">
                          {percent ? 'Continuer' : 'Lire'}
                        </Link>
                        {dlIds.has(ebookId) && (
                          <a href={`/api/download?slug=${book.slug}`} className="rounded-full border border-[var(--color-bordeaux)] px-3 py-2 font-ui text-xs text-[var(--color-bordeaux)]">PDF</a>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section id="outils" className="scroll-mt-24 pt-14">
        <p className="font-ui text-xs uppercase tracking-[0.16em] text-[var(--color-gold)]">Passer du savoir à l’action</p>
        <h2 className="mt-1 font-display text-3xl">Mes outils immobiliers</h2>
        <p className="mt-2 max-w-2xl font-body text-[var(--color-ink)]/60">
          Calculez, comparez et conservez votre checklist de projet directement dans votre espace.
        </p>
        <div className="mt-6">
          {toolsUnlocked ? (
            <ToolsHub />
          ) : (
            <div className="rounded-3xl border border-[var(--color-sand)] bg-white p-6 shadow-[0_12px_40px_rgba(46,31,24,0.06)] sm:p-8">
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <div>
                  <p className="font-ui text-xs uppercase tracking-[0.16em] text-[var(--color-gold)]">Outils verrouillés</p>
                  <h3 className="mt-2 font-display text-2xl text-[var(--color-bordeaux)]">Débloquez la boîte à outils complète</h3>
                  <p className="mt-2 max-w-2xl font-body text-[var(--color-ink)]/65">
                    Disponible avec un abonnement actif ou après 3 ebooks achetés. Vous en avez {paidEbookCount} / 3.
                  </p>
                </div>
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--color-sand)] text-2xl text-[var(--color-bordeaux)]" aria-hidden="true">🔒</span>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {['Capacité d’achat', 'Mensualités', 'Taxe de bienvenue', 'Mise de fonds', 'Rentabilité', 'Checklist'].map((label) => (
                  <div key={label} className="rounded-2xl bg-[#f7f2ec] px-4 py-3 font-ui text-sm text-[var(--color-ink)]/65">{label}</div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/catalogue" className="rounded-full bg-[var(--color-bordeaux)] px-5 py-3 font-ui text-sm font-medium text-white">Acheter des ebooks</Link>
                <Link href="/abonnement" className="rounded-full border border-[var(--color-bordeaux)] px-5 py-3 font-ui text-sm font-medium text-[var(--color-bordeaux)]">Voir l’abonnement</Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <section id="activite" className="scroll-mt-24 pt-14">
        <p className="font-ui text-xs uppercase tracking-[0.16em] text-[var(--color-gold)]">Historique</p>
        <h2 className="mt-1 font-display text-3xl">Mon activité</h2>
        <div className="mt-5 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-[var(--color-sand)] bg-white p-6">
            <h3 className="font-display text-xl">Résultats aux quiz</h3>
            {quizAttempts.length ? (
              <ul className="mt-4 divide-y divide-[var(--color-sand)]">
                {quizAttempts.map((attempt) => (
                  <li key={attempt.id} className="flex items-center justify-between gap-4 py-3 first:pt-0">
                    <div>
                      <p className="font-body text-sm text-[var(--color-ink)]">{attempt.guideTitle}</p>
                      <p className="font-ui text-xs text-[var(--color-ink)]/45">{date(attempt.createdAt)}</p>
                    </div>
                    <span className="rounded-full bg-[var(--color-sand)] px-3 py-1 font-display text-lg text-[var(--color-bordeaux)]">{attempt.scoreOn10}/10</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 font-body text-sm text-[var(--color-ink)]/55">Vos résultats apparaîtront ici après votre premier quiz.</p>
            )}
          </div>
          <div className="rounded-2xl border border-[var(--color-sand)] bg-white p-6">
            <h3 className="font-display text-xl">Achats récents</h3>
            {purchases.length ? (
              <ul className="mt-4 divide-y divide-[var(--color-sand)]">
                {purchases.map((purchase) => (
                  <li key={purchase.id} className="flex items-center justify-between gap-4 py-3 first:pt-0">
                    <div>
                      <p className="font-body text-sm">{purchase.ebook?.title ?? 'Abonnement à La Bibliothèque'}</p>
                      <p className="font-ui text-xs text-[var(--color-ink)]/45">{date(purchase.createdAt)}</p>
                    </div>
                    <span className="font-ui text-sm font-medium">{formatPrice(purchase.amountCents)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 font-body text-sm text-[var(--color-ink)]/55">Aucun achat à afficher pour le moment.</p>
            )}
          </div>
        </div>
      </section>

      <section id="profil" className="scroll-mt-24 pt-14">
        <p className="font-ui text-xs uppercase tracking-[0.16em] text-[var(--color-gold)]">Paramètres</p>
        <h2 className="mt-1 font-display text-3xl">Profil et sécurité</h2>
        <p className="mt-2 mb-5 font-body text-[var(--color-ink)]/60">Membre depuis le {date(user.createdAt)}.</p>
        <AccountSettings name={user.name ?? ''} email={user.email} locale={user.locale} />
      </section>
    </div>
  );
}
