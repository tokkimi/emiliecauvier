import Link from 'next/link';
import { BRAND } from '@/lib/format';
import { getT } from '@/lib/i18n';

export async function SiteFooter() {
  const t = await getT();
  return (
    <footer className="border-t border-[var(--color-sand)] bg-[var(--color-ink)] text-[var(--color-cream)]">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 sm:grid-cols-2">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-bibliotheque.png" alt="" className="mb-4 h-16 w-auto" />
          <p className="font-display text-lg">La Bibliothèque</p>
          <p className="mt-2 font-ui text-sm text-white/60">
            {t.footer_tagline_1}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
          <a
            href="https://www.instagram.com/guidesimmoquebec/"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram Guides Immo Québec"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-3 py-2 font-ui text-xs text-white/75 transition hover:border-[var(--color-gold-soft)] hover:text-white"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.7">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.4" cy="6.7" r=".8" className="fill-current stroke-none" />
            </svg>
            @guidesimmoquebec
          </a>
          <a
            href="https://www.facebook.com/guidesimmoquebec/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook Guides Immo Québec"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-3 py-2 font-ui text-xs text-white/75 transition hover:border-[var(--color-gold-soft)] hover:text-white"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-current">
              <path d="M13.5 22v-9h3l.5-3.5h-3.5v-2c0-1 .3-1.7 1.8-1.7H17V2.7c-.8-.1-1.6-.2-2.5-.2-2.5 0-4.2 1.5-4.2 4.4v2.6H7.5V13h2.8v9z" />
            </svg>
            Facebook
          </a>
          </div>
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
      <div className="border-t border-white/10 py-5 text-center font-ui text-xs text-white/40">
        © {new Date().getFullYear()} {BRAND.author}. {t.footer_legal}
      </div>
    </footer>
  );
}
