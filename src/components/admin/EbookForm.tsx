import { saveEbook } from '@/app/admin/livres/actions';

const COLLECTIONS = ['ACHETEURS', 'VENDEURS', 'INVESTISSEURS', 'QUEBEC_LEGAL', 'SITUATIONS', 'NICHE'];

const field = 'mt-1 w-full rounded-lg border border-[var(--color-sand)] bg-white px-4 py-2.5 font-body outline-none focus:border-[var(--color-bordeaux)]';
const label = 'block font-ui text-sm text-[var(--color-ink)]/80';

interface EbookData {
  id?: string;
  slug?: string;
  number?: number;
  title?: string;
  subtitle?: string | null;
  description?: string;
  collection?: string;
  priceCents?: number;
  includedInSubscription?: boolean;
  isPublished?: boolean;
  isFeatured?: boolean;
  pdfKey?: string | null;
}

export function EbookForm({ ebook }: { ebook?: EbookData }) {
  const save = saveEbook.bind(null, ebook?.id ?? null);
  return (
    <form action={save} className="mt-8 grid max-w-2xl gap-5">
      <div className="grid grid-cols-[100px_1fr] gap-4">
        <label className={label}>
          N°
          <input name="number" type="number" defaultValue={ebook?.number} required className={field} />
        </label>
        <label className={label}>
          Slug (URL)
          <input name="slug" defaultValue={ebook?.slug} required className={field} />
        </label>
      </div>
      <label className={label}>
        Titre
        <input name="title" defaultValue={ebook?.title} required className={field} />
      </label>
      <label className={label}>
        Sous-titre
        <input name="subtitle" defaultValue={ebook?.subtitle ?? ''} className={field} />
      </label>
      <label className={label}>
        Description
        <textarea name="description" defaultValue={ebook?.description} rows={4} className={field} />
      </label>
      <div className="grid grid-cols-2 gap-4">
        <label className={label}>
          Collection
          <select name="collection" defaultValue={ebook?.collection ?? 'ACHETEURS'} className={field}>
            {COLLECTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className={label}>
          Prix ($ CAD)
          <input
            name="price"
            type="number"
            step="0.01"
            defaultValue={((ebook?.priceCents ?? 1400) / 100).toFixed(2)}
            className={field}
          />
        </label>
      </div>
      <label className={label}>
        Clé PDF (fichier de stockage)
        <input name="pdfKey" defaultValue={ebook?.pdfKey ?? ''} placeholder="01_devenir-proprietaire.pdf" className={field} />
      </label>

      <div className="flex flex-wrap gap-6 font-ui text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="isPublished" defaultChecked={ebook?.isPublished ?? true} className="accent-[var(--color-bordeaux)]" />
          Publié
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="includedInSubscription" defaultChecked={ebook?.includedInSubscription ?? true} className="accent-[var(--color-bordeaux)]" />
          Inclus dans l&apos;abonnement
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="isFeatured" defaultChecked={ebook?.isFeatured ?? false} className="accent-[var(--color-bordeaux)]" />
          Mis en avant
        </label>
      </div>

      <button className="mt-2 w-fit rounded-full bg-[var(--color-bordeaux)] px-7 py-3 font-ui text-sm font-medium text-white hover:bg-[var(--color-bordeaux-dark)]">
        Enregistrer
      </button>
    </form>
  );
}
