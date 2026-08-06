import Link from 'next/link';
import { auth } from '@/lib/auth';
import { getT } from '@/lib/i18n';
import { LangToggle } from '@/components/LangToggle';

export async function SiteHeader() {
  const session = await auth().catch(() => null);
  const isAdmin = (session?.user as { role?: string })?.role === 'ADMIN';
  const t = await getT();
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-sand)] bg-[var(--color-cream)]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="font-display text-xl tracking-tight text-[var(--color-bordeaux)]">
          La Bibliothèque
          <span className="ml-2 font-ui text-[0.6rem] uppercase tracking-[0.2em] text-[var(--color-gold)]">
            Édition 2026
          </span>
        </Link>
        <nav className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2 font-ui text-sm sm:gap-x-5">
          <Link href="/catalogue" className="hover:text-[var(--color-bordeaux)]">
            {t.nav_catalogue}
          </Link>
          <Link href="/a-propos" className="hover:text-[var(--color-bordeaux)]">
            {t.nav_about}
          </Link>
          <Link href="/#abonnement" className="hidden hover:text-[var(--color-bordeaux)] sm:inline">
            {t.nav_subscription}
          </Link>
          {session?.user ? (
            <>
              <Link href="/compte" className="hover:text-[var(--color-bordeaux)]">
                {t.nav_account}
              </Link>
              {isAdmin && (
                <Link href="/admin" className="text-[var(--color-gold)] hover:underline">
                  {t.nav_admin}
                </Link>
              )}
            </>
          ) : (
            <>
              <Link href="/connexion" className="hover:text-[var(--color-bordeaux)]">
                {t.nav_login}
              </Link>
              <Link
                href="/inscription"
                className="hidden rounded-full bg-[var(--color-bordeaux)] px-4 py-2 text-white transition hover:bg-[var(--color-bordeaux-dark)] sm:inline"
              >
                {t.nav_signup}
              </Link>
            </>
          )}
          <LangToggle />
        </nav>
      </div>
    </header>
  );
}
