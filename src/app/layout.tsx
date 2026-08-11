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
        {/* Mot manuscrit, sur fond blanc, juste avant le pied de page */}
        <section className="bg-white">
          <div className="mx-auto max-w-2xl px-6 py-16">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/manuscrit.png"
              alt="Prenez des décisions éclairées. Choisissez avec confiance. Vivez sans regret. À bientôt, Emilio"
              className="mx-auto w-full max-w-xl"
            />
          </div>
        </section>
        <SiteFooter />
      </body>
    </html>
  );
}
