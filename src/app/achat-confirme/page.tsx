import Link from 'next/link';
import { notFound } from 'next/navigation';
import { bySlug, COLLECTIONS } from '@/data/books';
import { localizeBook, COLLECTIONS_EN } from '@/data/booksEn';
import { ClearCartOnSuccess } from '@/components/ClearCartOnSuccess';
import { auth } from '@/lib/auth';
import { getLocale } from '@/lib/i18n';
import { BookCover } from '@/components/BookCover';

export async function generateMetadata() {
  const locale = await getLocale();
  return { title: locale === 'en' ? 'Purchase confirmed' : 'Achat confirmé' };
}

export default async function PurchaseConfirmedPage({ searchParams }: { searchParams: Promise<{ slug?: string; slugs?: string; lang?: string; email?: string }> }) {
  const locale = await getLocale();
  const { slug, slugs, lang, email } = await searchParams;
  const pdfLocale = lang === 'en' ? 'en' : 'fr';
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
        thanksPlural: 'Thank you for your purchase. Download your PDFs below or open your online library.',
        thanksSingle: <>Thank you for purchasing <strong>{firstTitle}</strong>. Download your PDF below or open your online library.</>,
        read: 'Read online',
        readFirst: 'Read the first guide',
        readNow: 'Read online',
        download: 'Download the PDF',
        library: 'View my library',
        catalogue: 'Back to catalogue',
        devicePrompt: plural ? 'Want to find these guides on all your devices?' : 'Want to find this guide on all your devices?',
        createProfile: 'Create your free profile',
      }
    : {
        eyebrow: 'Paiement confirmé',
        title: plural ? 'Vos guides sont prêts.' : 'Votre guide est prêt.',
        thanksPlural: 'Merci pour votre achat. Téléchargez vos PDF ci-dessous ou accédez à votre bibliothèque en ligne.',
        thanksSingle: <>Merci pour votre achat de <strong>{firstTitle}</strong>. Téléchargez votre PDF ci-dessous ou accédez à votre bibliothèque en ligne.</>,
        read: 'Lire en ligne',
        readFirst: 'Lire le premier guide',
        readNow: 'Lire en ligne',
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
      <p className="mt-5 rounded-2xl border border-[var(--color-sand)] bg-white p-4 font-ui text-sm leading-relaxed text-[var(--color-ink)]/75" role="status">
        {email === 'accepted'
          ? locale === 'en' ? 'Your email with PDF attachments has been accepted by our email service. Check your inbox and spam folder. Large orders may arrive in several emails.' : 'Votre courriel avec les PDF en pièces jointes a été accepté par notre service d’envoi. Vérifiez votre boîte de réception et les indésirables. Une commande volumineuse peut arriver en plusieurs courriels.'
          : locale === 'en' ? 'Email delivery is not yet confirmed. Download and save each PDF below now. If no email arrives, contact us with your payment receipt.' : 'L’envoi du courriel n’est pas encore confirmé. Téléchargez et enregistrez chaque PDF ci-dessous dès maintenant. Si aucun courriel n’arrive, contactez-nous avec votre reçu de paiement.'}
      </p>
      <p className="mt-4 font-ui text-sm leading-relaxed text-[var(--color-ink)]/65">{locale === 'en' ? 'Download without an account. To read online and save your progress, use your free account with the checkout email. If needed, the next step links your purchase to your profile.' : 'Téléchargez sans compte. Pour lire en ligne et enregistrer votre progression, utilisez votre compte gratuit avec l’email du paiement. Au besoin, l’étape suivante rattache l’achat à votre profil.'}</p>
        <ul className="mx-auto mt-6 space-y-4 text-left">
          {books.map((book) => (
            <li key={book.slug} className="rounded-2xl border border-[var(--color-sand)] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-4"><div className="w-16 shrink-0 overflow-hidden rounded-md"><BookCover number={book.number} title={localizeBook(book, pdfLocale).title} collection={(pdfLocale === 'en' ? COLLECTIONS_EN : COLLECTIONS)[book.collection]} locale={pdfLocale} /></div><div><span className="font-display text-xl text-[var(--color-bordeaux)]">{localizeBook(book, locale).title}</span><p className="mt-1 font-ui text-xs text-[var(--color-ink)]/55">PDF · {pdfLocale === 'en' ? 'English' : 'Français'}</p></div></div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2"><a href={`/api/download?slug=${book.slug}&lang=${pdfLocale}`} className="rounded-full bg-[var(--color-bordeaux)] px-4 py-3 text-center font-ui text-sm text-white">{t.download}</a><Link href={`/recuperer-achat?slug=${book.slug}`} className="rounded-full border border-[var(--color-bordeaux)] px-4 py-3 text-center font-ui text-sm text-[var(--color-bordeaux)]">{t.read}</Link></div>
            </li>
          ))}
        </ul>
      <p className="mt-8 font-ui text-sm text-[var(--color-ink)]/55">
        <Link href={loggedIn ? '/compte#bibliotheque' : `/recuperer-achat?slug=${firstBook.slug}`} className="text-[var(--color-bordeaux)] underline">{loggedIn ? t.library : t.createProfile}</Link>
      </p>
    </div>
  );
}
