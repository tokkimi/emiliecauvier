import Link from 'next/link';
import { notFound } from 'next/navigation';
import { bySlug } from '@/data/books';
import { localizeBook } from '@/data/booksEn';
import { ClearCartOnSuccess } from '@/components/ClearCartOnSuccess';
import { auth } from '@/lib/auth';
import { getLocale } from '@/lib/i18n';

export const metadata = { title: 'Achat confirmé' };

export default async function PurchaseConfirmedPage({ searchParams }: { searchParams: Promise<{ slug?: string; slugs?: string }> }) {
  const locale = await getLocale();
  const { slug, slugs } = await searchParams;
  const requestedSlugs = [...new Set((slugs ? slugs.split(',') : slug ? [slug] : []).map((item) => item.trim()).filter(Boolean))];
  const books = requestedSlugs.map((item) => bySlug(item)).filter((book): book is NonNullable<typeof book> => Boolean(book));
  if (!books.length) notFound();
  const firstBook = books[0];
  const plural = books.length > 1;
  const session = await auth().catch(() => null);
  const loggedIn = Boolean(session?.user);
  const firstTitle = localizeBook(firstBook, locale).title;
  const t = locale === 'en'
    ? {
        eyebrow: 'Payment confirmed',
        title: plural ? 'Your guides are ready.' : 'Your guide is ready.',
        thanksPlural: 'Thank you for purchasing the selected guides. You can start reading immediately.',
        thanksSingle: <>Thank you for purchasing <strong>{firstTitle}</strong>. You can read it now or download the PDF.</>,
        read: 'Read',
        readFirst: 'Read the first guide',
        readNow: 'Read now',
        download: 'Download the PDF',
        library: 'View my library',
        catalogue: 'Back to catalogue',
        devicePrompt: plural ? 'Want to find these guides on all your devices?' : 'Want to find this guide on all your devices?',
        createProfile: 'Create your free profile',
      }
    : {
        eyebrow: 'Paiement confirmé',
        title: plural ? 'Vos guides sont prêts.' : 'Votre guide est prêt.',
        thanksPlural: 'Merci pour votre achat des guides sélectionnés. Vous pouvez lire immédiatement.',
        thanksSingle: <>Merci pour votre achat de <strong>{firstTitle}</strong>. Vous pouvez lire immédiatement ou télécharger le PDF.</>,
        read: 'Lire',
        readFirst: 'Lire le premier guide',
        readNow: 'Lire maintenant',
        download: 'Télécharger le PDF',
        library: 'Voir ma bibliothèque',
        catalogue: 'Retour au catalogue',
        devicePrompt: plural ? 'Vous voulez retrouver ces guides sur tous vos appareils?' : 'Vous voulez retrouver ce guide sur tous vos appareils?',
        createProfile: 'Créez gratuitement votre profil',
      };

  return (
    <div className="mx-auto max-w-2xl px-5 py-20 text-center">
      <ClearCartOnSuccess />
      <p className="font-ui text-xs uppercase tracking-[0.2em] text-[var(--color-gold)]">{t.eyebrow}</p>
      <h1 className="mt-3 font-display text-4xl text-[var(--color-bordeaux)]">{t.title}</h1>
      <p className="mx-auto mt-4 max-w-lg font-body text-lg text-[var(--color-ink)]/70">
        {plural ? t.thanksPlural : t.thanksSingle}
      </p>
      {plural && (
        <ul className="mx-auto mt-6 max-w-md space-y-2 rounded-2xl border border-[var(--color-sand)] bg-white p-4 text-left">
          {books.map((book) => (
            <li key={book.slug} className="flex items-center justify-between gap-3 border-b border-[var(--color-sand)] py-2 last:border-b-0">
              <span className="font-body text-sm text-[var(--color-ink)]">{localizeBook(book, locale).title}</span>
              <Link href={`/lire/${book.slug}`} className="shrink-0 font-ui text-xs text-[var(--color-bordeaux)] underline">{t.read}</Link>
            </li>
          ))}
        </ul>
      )}
      <div className="mx-auto mt-8 grid max-w-md gap-3 sm:grid-cols-2">
        <Link href={`/lire/${firstBook.slug}`} className="rounded-full bg-[var(--color-bordeaux)] px-6 py-3 font-ui text-sm font-medium text-white">{plural ? t.readFirst : t.readNow}</Link>
        {!plural && <a href={`/api/download?slug=${firstBook.slug}`} className="rounded-full border border-[var(--color-bordeaux)] px-6 py-3 font-ui text-sm text-[var(--color-bordeaux)]">{t.download}</a>}
        {plural && <Link href={loggedIn ? '/compte#bibliotheque' : '/catalogue'} className="rounded-full border border-[var(--color-bordeaux)] px-6 py-3 font-ui text-sm text-[var(--color-bordeaux)]">{loggedIn ? t.library : t.catalogue}</Link>}
      </div>
      <p className="mt-8 font-ui text-sm text-[var(--color-ink)]/55">
        {t.devicePrompt} <Link href="/inscription" className="text-[var(--color-bordeaux)] underline">{t.createProfile}</Link>.
      </p>
    </div>
  );
}
