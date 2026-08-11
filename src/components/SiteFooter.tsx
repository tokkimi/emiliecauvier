import Link from 'next/link';
import { BRAND } from '@/lib/format';
import { getT } from '@/lib/i18n';

export async function SiteFooter() {
  const t = await getT();
  return (
    <footer className="border-t border-[var(--color-sand)] bg-[var(--color-ink)] text-[var(--color-cream)]">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 sm:grid-cols-2">
        <div>
          <p className="font-display text-lg">La Bibliothèque</p>
          <p className="mt-2 font-ui text-sm text-white/60">
            {t.footer_tagline_1}
          </p>
        </div>
        <div className="font-ui text-sm sm:text-right">
          <p className="mb-3 uppercase tracking-[0.16em] text-[var(--color-gold-soft)]">{t.footer_navigate}</p>
          <ul className="space-y-2 text-white/70">
            <li><Link href="/catalogue" className="hover:text-white">{t.footer_catalogue}</Link></li>
            <li><Link href="/a-propos" className="hover:text-white">{t.footer_about}</Link></li>
            <li><Link href="/abonnement" className="hover:text-white">{t.footer_subscription}</Link></li>
            <li><Link href="/compte" className="hover:text-white">{t.footer_account}</Link></li>
          </ul>
        </div>
      </div>
      {/* Logo manuscrit, centré en bas */}
      <div className="flex justify-center border-t border-white/10 py-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-signe-em.png" alt="Signé par Emilie" className="h-16 w-auto" />
      </div>
      <div className="border-t border-white/10 py-5 text-center font-ui text-xs text-white/40">
        © {new Date().getFullYear()} {BRAND.author}. {t.footer_legal}
      </div>
    </footer>
  );
}
