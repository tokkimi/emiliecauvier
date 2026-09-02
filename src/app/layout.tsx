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
        <section className="border-t border-[var(--color-sand)] bg-[#f6f1eb]">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-5 py-10 text-center sm:flex-row sm:py-12 sm:text-left">
            <blockquote className="max-w-3xl font-display text-2xl italic leading-relaxed text-[var(--color-bordeaux)] sm:text-3xl">
              « Prenez des décisions éclairées. Choisissez avec confiance. Vivez sans regret. »
            </blockquote>
            <div className="shrink-0 text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-signe-em.png" alt="Signé par Emilie" className="mx-auto h-20 w-auto brightness-0 opacity-70" />
              <p className="mt-1 font-body text-sm italic text-[var(--color-ink)]/60">À bientôt, Emilie</p>
            </div>
          </div>
        </section>
        <SiteFooter />
      </body>
    </html>
  );
}
