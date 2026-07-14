import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Calculator, Instagram, Menu, MessageCircle, Phone } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://emiliecauvier.com"),
  title: { default: "Émilie Cauvier | Courtière immobilière", template: "%s | Émilie Cauvier" },
  description: "Une expérience immobilière claire, humaine et sur mesure à Montréal et Laval.",
  openGraph: { title: "Émilie Cauvier — L’immobilier, autrement.", description: "Acheter, vendre, investir ou réaliser un projet atypique avec une stratégie sur mesure.", type: "website", locale: "fr_CA" }
};

const nav = [
  ["Accueil", "/"], ["Propriétés", "/proprietes"], ["Services", "/#a-propos"], ["Outils", "/outils"], ["Partenariats", "/partenaires"]
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>
        <a className="skip-link" href="#contenu">Aller au contenu</a>
        <header className="site-header">
          <Link className="brand" href="/" aria-label="Émilie Cauvier, accueil">
            <span className="logo-glass"><Image className="agency-logo" src="/the-agency-logo.png" alt="The Agency" width={112} height={49}/></span><span className="brand-person">Émilie Cauvier<small>Courtière immobilière résidentielle</small></span>
          </Link>
          <nav aria-label="Navigation principale">
            {nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
          </nav>
          <Link className="header-cta" href="/demandes-sur-mesure">Obtenir une estimation <ArrowUpRight size={16}/></Link>
          <details className="mobile-menu">
            <summary aria-label="Ouvrir le menu"><Menu /></summary>
            <div>{nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</div>
          </details>
        </header>
        {children}
        <nav className="action-dock" aria-label="Actions rapides">
          <a href="tel:+15147749818" aria-label="Appeler Émilie"><Phone/></a>
          <a href="sms:+15147749818" aria-label="Envoyer un message texte"><MessageCircle/></a>
          <Link href="/outils" aria-label="Ouvrir les outils"><Calculator/></Link>
          <Link className="dock-main" href="/demandes-sur-mesure">Estimation <ArrowUpRight/></Link>
        </nav>
        <footer>
          <div className="footer-top">
            <div><Image className="footer-agency-logo" src="/the-agency-logo.png" alt="The Agency" width={160} height={70}/><p className="eyebrow">La prochaine étape commence ici.</p><h2>Un projet en tête?<br/>Rendons-le concret.</h2></div>
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
