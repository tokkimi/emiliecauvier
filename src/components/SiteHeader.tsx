import Link from 'next/link';
import { auth } from '@/lib/auth';
import { getT } from '@/lib/i18n';
import { LangToggle } from '@/components/LangToggle';
import { MobileMenu } from '@/components/MobileMenu';

export async function SiteHeader() {
  const session = await auth().catch(() => null);
  const isAdmin = (session?.user as { role?: string })?.role === 'ADMIN';
  const loggedIn = Boolean(session?.user);
  const t = await getT();

  const items = [
    { href: '/catalogue', label: t.nav_catalogue },
    { href: '/a-propos', label: t.nav_about },
    { href: '/abonnement', label: t.nav_subscription },
    ...(loggedIn
      ? [
          { href: '/compte', label: t.nav_account },
          ...(isAdmin ? [{ href: '/admin', label: t.nav_admin, admin: true }] : []),
        ]
      : [
          { href: '/connexion', label: t.nav_login },
          { href: '/inscription', label: t.nav_signup, cta: true },
        ]),
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-sand)] bg-[var(--color-cream)]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-2.5 text-[var(--color-bordeaux)]" aria-label="La Bibliothèque — accueil">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-bibliotheque.png" alt="" className="h-10 w-14 shrink-0 object-contain sm:h-11 sm:w-16" />
          <span className="font-display text-lg leading-none tracking-tight sm:text-xl">La Bibliothèque</span>
          <span className="hidden font-ui text-[0.6rem] uppercase tracking-[0.2em] text-[var(--color-gold)] lg:inline">
            Édition 2026
          </span>
        </Link>

        {/* Desktop */}
        <nav className="hidden items-center gap-x-5 font-ui text-sm sm:flex">
          {items.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className={
                it.cta
                  ? 'rounded-full bg-[var(--color-bordeaux)] px-4 py-2 text-white transition hover:bg-[var(--color-bordeaux-dark)]'
                  : it.admin
                    ? 'text-[var(--color-gold)] hover:underline'
                    : 'hover:text-[var(--color-bordeaux)]'
              }
            >
              {it.label}
            </Link>
          ))}
          <LangToggle />
        </nav>

        {/* Mobile */}
        <MobileMenu items={items} />
      </div>
    </header>
  );
}
