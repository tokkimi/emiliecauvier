import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { bySlug } from '@/data/books';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { hasAccess } from '@/lib/entitlements';
import { getLocale } from '@/lib/i18n';
import { localizeBook } from '@/data/booksEn';
import { ClaimPurchaseButton } from '@/components/ClaimPurchaseButton';

export default async function ClaimPurchasePage({ searchParams }: { searchParams: Promise<{ slug?: string }> }) {
  const { slug } = await searchParams;
  const book = slug ? bySlug(slug) : null;
  if (!book) notFound();
  const locale = await getLocale();
  const en = locale === 'en';
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;
  if (userId) {
    const ebook = await prisma.ebook.findUnique({ where: { slug: book.slug }, select: { id: true } });
    if (ebook && await hasAccess(userId, ebook.id)) redirect(`/lire/${book.slug}`);
  }
  const next = encodeURIComponent(`/recuperer-achat?slug=${book.slug}`);
  return <section className="mx-auto max-w-xl px-5 py-16 sm:py-24">
    <p className="font-ui text-xs uppercase tracking-[0.18em] text-[var(--color-gold)]">{en ? 'Your personal library' : 'Votre bibliothèque personnelle'}</p>
    <h1 className="mt-4 font-display text-4xl text-[var(--color-bordeaux)]">{en ? 'Keep your guides. Pick up your reading.' : 'Gardez vos guides. Retrouvez votre lecture.'}</h1>
    <p className="mt-5 font-body text-lg">{localizeBook(book, locale).title}</p>
    <p className="mt-4 font-ui text-sm leading-relaxed text-[var(--color-ink)]/70">{en ? 'A free account lets you read online and save your progress and quiz results. Use the same email address you entered at checkout. No second payment or subscription is required for your purchased guides.' : 'Un compte gratuit permet de lire en ligne et d’enregistrer votre progression et vos résultats de quiz. Utilisez le même email qu’au paiement. Aucun nouvel achat ni abonnement n’est nécessaire pour les guides achetés.'}</p>
    {userId ? <ClaimPurchaseButton locale={locale} slug={book.slug} /> : <div className="mt-7 grid gap-3"><Link href={`/inscription?next=${next}`} className="rounded-full bg-[var(--color-bordeaux)] px-6 py-3 text-center font-ui text-sm text-white">{en ? 'Create my free account' : 'Créer mon compte gratuit'}</Link><Link href={`/connexion?next=${next}`} className="rounded-full border border-[var(--color-bordeaux)] px-6 py-3 text-center font-ui text-sm text-[var(--color-bordeaux)]">{en ? 'I already have an account' : 'J’ai déjà un compte'}</Link></div>}
    <p className="mt-6 font-ui text-xs leading-relaxed text-[var(--color-ink)]/60">{en ? 'PDF download remains available without an account from your payment confirmation. Finish linking your purchase in this browser within 7 days; otherwise contact us with your receipt.' : 'Le téléchargement PDF reste disponible sans compte depuis votre confirmation de paiement. Terminez le rattachement dans ce navigateur sous 7 jours ; sinon, contactez-nous avec votre reçu.'}</p>
  </section>;
}
