import Link from 'next/link';
import { notFound } from 'next/navigation';
import { bySlug } from '@/data/books';

export const metadata = { title: 'Achat confirmé' };

export default async function PurchaseConfirmedPage({ searchParams }: { searchParams: Promise<{ slug?: string }> }) {
  const { slug } = await searchParams;
  const book = slug ? bySlug(slug) : null;
  if (!book) notFound();

  return (
    <div className="mx-auto max-w-2xl px-5 py-20 text-center">
      <p className="font-ui text-xs uppercase tracking-[0.2em] text-[var(--color-gold)]">Paiement confirmé</p>
      <h1 className="mt-3 font-display text-4xl text-[var(--color-bordeaux)]">Votre guide est prêt.</h1>
      <p className="mx-auto mt-4 max-w-lg font-body text-lg text-[var(--color-ink)]/70">
        Merci pour votre achat de <strong>{book.title}</strong>. Vous pouvez le lire immédiatement ou télécharger le PDF, sans créer de compte.
      </p>
      <div className="mx-auto mt-8 grid max-w-md gap-3 sm:grid-cols-2">
        <Link href={`/lire/${book.slug}`} className="rounded-full bg-[var(--color-bordeaux)] px-6 py-3 font-ui text-sm font-medium text-white">Lire maintenant</Link>
        <a href={`/api/download?slug=${book.slug}`} className="rounded-full border border-[var(--color-bordeaux)] px-6 py-3 font-ui text-sm text-[var(--color-bordeaux)]">Télécharger le PDF</a>
      </div>
      <p className="mt-8 font-ui text-sm text-[var(--color-ink)]/55">
        Vous voulez retrouver ce guide sur tous vos appareils? <Link href="/inscription" className="text-[var(--color-bordeaux)] underline">Créez gratuitement votre profil</Link>.
      </p>
    </div>
  );
}

