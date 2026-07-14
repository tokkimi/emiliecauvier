import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Instagram, Menu } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://emiliecauvier.com"),
  title: { default: "Émilie Cauvier | Courtière immobilière", template: "%s | Émilie Cauvier" },
  description: "Une expérience immobilière claire, humaine et sur mesure à Montréal et Laval.",
  openGraph: { title: "Émilie Cauvier — L’immobilier, autrement.", description: "Acheter, vendre, investir ou réaliser un projet atypique avec une stratégie sur mesure.", type: "website", locale: "fr_CA" }
};

const nav = [
  ["Accueil", "/"], ["Outils", "/outils"], ["Demandes sur mesure", "/demandes-sur-mesure"], ["Partenaires", "/partenaires"]
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>
        <a className="skip-link" href="#contenu">Aller au contenu</a>
        <header className="site-header">
          <Link className="brand" href="/" aria-label="Émilie Cauvier, accueil">
            <span className="brand-mark">EC</span><span>Émilie Cauvier<small>Courtière immobilière résidentielle</small></span>
          </Link>
          <nav aria-label="Navigation principale">
            {nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
          </nav>
          <Link className="header-cta" href="/demandes-sur-mesure">Parlons de votre projet <ArrowUpRight size={16}/></Link>
          <details className="mobile-menu">
            <summary aria-label="Ouvrir le menu"><Menu /></summary>
            <div>{nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</div>
          </details>
        </header>
        {children}
        <footer>
          <div className="footer-top">
            <div><p className="eyebrow">La prochaine étape commence ici.</p><h2>Un projet en tête?<br/>Rendons-le concret.</h2></div>
            <div className="footer-contact"><a href="tel:+15147749818">514 774-9818</a><a href="mailto:emilie@equipecauvier.com">emilie@equipecauvier.com</a><a href="https://www.instagram.com/emiliecauvier/" aria-label="Instagram"><Instagram size={20}/> Instagram</a></div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Émilie Cauvier</span><span>Courtière immobilière résidentielle</span><Link href="/confidentialite">Confidentialité</Link><span>Montréal · Laval · Rive-Nord</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
