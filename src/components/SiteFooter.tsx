import Link from 'next/link';
import { BRAND } from '@/lib/format';

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-[var(--color-sand)] bg-[var(--color-ink)] text-[var(--color-cream)]">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 sm:grid-cols-3">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-signe-em.png" alt="Signé par Émilie" className="mb-4 h-16 w-auto" />
          <p className="font-display text-lg">La Bibliothèque</p>
          <p className="mt-2 font-ui text-sm text-white/60">
            Guides immobiliers d&apos;{BRAND.author}
            <br />
            Courtière résidentielle — Grand Montréal
          </p>
        </div>
        <div className="font-ui text-sm">
          <p className="mb-3 uppercase tracking-[0.16em] text-[var(--color-gold-soft)]">Naviguer</p>
          <ul className="space-y-2 text-white/70">
            <li><Link href="/catalogue" className="hover:text-white">Catalogue des 48 guides</Link></li>
            <li><Link href="/#abonnement" className="hover:text-white">Abonnement mensuel</Link></li>
            <li><Link href="/compte" className="hover:text-white">Mon compte</Link></li>
          </ul>
        </div>
        <div className="font-ui text-sm">
          <p className="mb-3 uppercase tracking-[0.16em] text-[var(--color-gold-soft)]">Coordonnées</p>
          <p className="text-white/70">{BRAND.address}</p>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center font-ui text-xs text-white/40">
        © {new Date().getFullYear()} {BRAND.author}. Contenu éducatif — les montants cités sont datés « édition 2026 ».
      </div>
    </footer>
  );
}
