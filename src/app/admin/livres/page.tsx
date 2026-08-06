export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { prisma } from '@/lib/db';
import { formatPrice } from '@/lib/format';
import { PublishToggle } from '@/components/admin/PublishToggle';

export default async function AdminBooks() {
  const ebooks = await prisma.ebook.findMany({ orderBy: { number: 'asc' } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-[var(--color-ink)]">Guides</h1>
          <p className="mt-1 font-body text-[var(--color-ink)]/60">{ebooks.length} guides au catalogue.</p>
        </div>
        <Link
          href="/admin/livres/new"
          className="rounded-full bg-[var(--color-bordeaux)] px-5 py-2.5 font-ui text-sm font-medium text-white hover:bg-[var(--color-bordeaux-dark)]"
        >
          + Ajouter un guide
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-[var(--color-sand)] bg-white">
        <table className="w-full font-ui text-sm">
          <thead className="bg-[var(--color-sand)]/60 text-left text-[var(--color-ink)]/60">
            <tr>
              <th className="px-4 py-3">N°</th>
              <th className="px-4 py-3">Titre</th>
              <th className="px-4 py-3">Collection</th>
              <th className="px-4 py-3 text-right">Prix</th>
              <th className="px-4 py-3 text-center">Publié</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {ebooks.map((e) => (
              <tr key={e.id} className="border-t border-[var(--color-sand)]">
                <td className="px-4 py-3 text-[var(--color-ink)]/50">{e.number}</td>
                <td className="px-4 py-3">
                  <span className="font-medium text-[var(--color-ink)]">{e.title}</span>
                  <span className="block text-xs text-[var(--color-ink)]/50">{e.slug}</span>
                </td>
                <td className="px-4 py-3 text-[var(--color-ink)]/70">{e.collection}</td>
                <td className="px-4 py-3 text-right">{formatPrice(e.priceCents)}</td>
                <td className="px-4 py-3 text-center">
                  <PublishToggle id={e.id} published={e.isPublished} />
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/livres/${e.id}`} className="text-[var(--color-bordeaux)] hover:underline">
                    Modifier
                  </Link>
                </td>
              </tr>
            ))}
            {ebooks.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-[var(--color-ink)]/50">
                  Aucun guide en base. Lancez <code>npm run seed</code> pour importer les 48 guides.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}