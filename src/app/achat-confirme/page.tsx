import Link from 'next/link';
import { notFound } from 'next/navigation';
import { bySlug } from '@/data/books';
import { ClearCartOnSuccess } from '@/components/ClearCartOnSuccess';
import { auth } from '@/lib/auth';

export const metadata = { title: 'Achat confirmé' };

export default async function PurchaseConfirmedPage({ searchParams }: { searchParams: Promise<{ slug?: string; slugs?: string }> }) {
  const { slug, slugs } = await searchParams;
  const requestedSlugs = [...new Set((slugs ? slugs.split(',') : slug ? [slug] : []).map((item) => item.trim()).filter(Boolean))];
  const books = requestedSlugs.map((item) => bySlug(item)).filter((book): book is NonNullable<typeof book> => Boolean(book));
  if (!books.length) notFound();
  const firstBook = books[0];
  const plural = books.length > 1;
  const session = await auth().catch(() => null);
  const loggedIn = Boolean(session?.user);

  return (
    <div className="mx-auto max-w-2xl px-5 py-20 text-center">
      <ClearCartOnSuccess />
      <p className="font-ui text-xs uppercase tracking-[0.2em] text-[var(--color-gold)]">Paiement confirmé</p>
      <h1 className="mt-3 font-display text-4xl text-[var(--color-bordeaux)]">{plural ? 'Vos guides sont prêts.' : 'Votre guide est prêt.'}</h1>
      <p className="mx-auto mt-4 max-w-lg font-body text-lg text-[var(--color-ink)]/70">
        Merci pour votre achat {plural ? 'des guides sélectionnés' : <>de <strong>{firstBook.title}</strong></>}. Vous pouvez lire immédiatement{plural ? '.' : ' ou télécharger le PDF.'}
      </p>
      {plural && (
        <ul className="mx-auto mt-6 max-w-md space-y-2 rounded-2xl border border-[var(--color-sand)] bg-white p-4 text-left">
          {books.map((book) => (
            <li key={book.slug} className="flex items-center justify-between gap-3 border-b border-[var(--color-sand)] py-2 last:border-b-0">
              <span className="font-body text-sm text-[var(--color-ink)]">{book.title}</span>
              <Link href={`/lire/${book.slug}`} className="shrink-0 font-ui text-xs text-[var(--color-bordeaux)] underline">Lire</Link>
            </li>
          ))}
        </ul>
      )}
      <div className="mx-auto mt-8 grid max-w-md gap-3 sm:grid-cols-2">
        <Link href={`/lire/${firstBook.slug}`} className="rounded-full bg-[var(--color-bordeaux)] px-6 py-3 font-ui text-sm font-medium text-white">{plural ? 'Lire le premier guide' : 'Lire maintenant'}</Link>
        {!plural && <a href={`/api/download?slug=${firstBook.slug}`} className="rounded-full border border-[var(--color-bordeaux)] px-6 py-3 font-ui text-sm text-[var(--color-bordeaux)]">Télécharger le PDF</a>}
        {plural && <Link href={loggedIn ? '/compte#bibliotheque' : '/catalogue'} className="rounded-full border border-[var(--color-bordeaux)] px-6 py-3 font-ui text-sm text-[var(--color-bordeaux)]">{loggedIn ? 'Voir ma bibliothèque' : 'Retour au catalogue'}</Link>}
      </div>
      <p className="mt-8 font-ui text-sm text-[var(--color-ink)]/55">
        Vous voulez retrouver {plural ? 'ces guides' : 'ce guide'} sur tous vos appareils? <Link href="/inscription" className="text-[var(--color-bordeaux)] underline">Créez gratuitement votre profil</Link>.
      </p>
    </div>
  );
}
