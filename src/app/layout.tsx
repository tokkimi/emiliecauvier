import type { Metadata } from 'next';
import './globals.css';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

export const metadata: Metadata = {
  title: {
    default: 'La Bibliothèque — Guides immobiliers d\'Emilie Cauvier',
    template: '%s · La Bibliothèque',
  },
  description:
    'Les guides immobiliers d\'Emilie Cauvier pour le Grand Montréal : acheter, vendre, investir. Lecture en ligne + PDF téléchargeable. À l\'unité (9,95 $ CAD) ou par abonnement (19 $/mois).',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  openGraph: { type: 'website', locale: 'fr_CA', siteName: 'La Bibliothèque' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400&family=Newsreader:ital,opsz,wght@0,6..72,400..600;1,6..72,400&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        {/* Mot manuscrit d'Emilie, juste avant le pied de page.
            Visuel pleine largeur, bord à bord, SANS fond blanc ni cadre : le
            fond crème fait partie de l'image (un visuel mobile, un ordinateur). */}
        <section>
          {/* Mobile */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/mot-emilie-mobile.png"
            alt="Prenez des décisions éclairées. Choisissez avec confiance. Vivez sans regret. À bientôt, Emilie"
            className="block w-full sm:hidden"
          />
          {/* Ordinateur */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/mot-emilie-ordi.jpg"
            alt="Prenez des décisions éclairées. Choisissez avec confiance. Vivez sans regret. À bientôt, Emilie"
            className="hidden w-full sm:block"
          />
        </section>
        <SiteFooter />
      </body>
    </html>
  );
}
