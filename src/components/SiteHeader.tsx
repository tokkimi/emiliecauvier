import Link from 'next/link';
import { auth } from '@/lib/auth';

export async function SiteHeader() {
  const session = await auth();
  const isAdmin = (session?.user as { role?: string })?.role === 'ADMIN';
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-sand)] bg-[var(--color-cream)]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="font-display text-xl tracking-tight text-[var(--color-bordeaux)]">
          La Bibliothèque
          <span className="ml-2 font-ui text-[0.6rem] uppercase tracking-[0.2em] text-[var(--color-gold)]">
            Édition 2026
          </span>
        </Link>
        <nav className="flex items-center gap-6 font-ui text-sm">
          <Link href="/catalogue" className="hover:text-[var(--color-bordeaux)]">
            Catalogue
          </Link>
          <Link href="/#abonnement" className="hover:text-[var(--color-bordeaux)]">
            Abonnement
          </Link>
          {session?.user ? (
            <>
              <Link href="/compte" className="hover:text-[var(--color-bordeaux)]">
                Mon compte
              </Link>
              {isAdmin && (
                <Link href="/admin" className="text-[var(--color-gold)] hover:underline">
                  Admin
                </Link>
              )}
            </>
          ) : (
            <>
              <Link href="/connexion" className="hover:text-[var(--color-bordeaux)]">
                Connexion
              </Link>
              <Link
                href="/inscription"
                className="rounded-full bg-[var(--color-bordeaux)] px-4 py-2 text-white transition hover:bg-[var(--color-bordeaux-dark)]"
              >
                Créer un compte
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
