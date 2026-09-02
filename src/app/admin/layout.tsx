import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (!session?.user) redirect('/connexion?next=/admin');
  if (role !== 'ADMIN') redirect('/');

  const nav = [
    ['/admin', 'Tableau de bord'],
    ['/admin/livres', 'Guides'],
    ['/admin/utilisateurs', 'Utilisateurs'],
    ['/admin/compta', 'Comptabilité'],
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="-mx-5 mb-8 flex items-center gap-2 overflow-x-auto border-b border-[var(--color-sand)] px-5 pb-4 font-ui text-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <span className="mr-2 shrink-0 font-display text-lg text-[var(--color-bordeaux)]">Back-office</span>
        {nav.map(([href, label]) => (
          <Link
            key={href}
            href={href}
            className="min-h-11 shrink-0 rounded-full px-4 py-3 text-[var(--color-ink)]/70 transition hover:bg-[var(--color-sand)] hover:text-[var(--color-bordeaux)]"
          >
            {label}
          </Link>
        ))}
      </div>
      {children}
    </div>
  );
}
