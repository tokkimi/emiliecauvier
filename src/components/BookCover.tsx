import Image from 'next/image';

export function BookCover({
  number,
  title,
  collection,
  locale = 'fr',
  className = '',
  loading = 'lazy',
}: {
  number: number;
  title: string;
  collection: string;
  locale?: 'fr' | 'en';
  className?: string;
  loading?: 'eager' | 'lazy';
}) {
  // Les visuels 2 à 34 contiennent une ancienne étiquette de collection.
  // Ce cartouche piloté par les données la corrige sans masquer l'illustration.
  const needsCollectionCorrection = locale === 'fr' && number >= 2 && number <= 34;

  return (
    <div
      className={`relative aspect-[2/3] overflow-hidden bg-[#f3eee9] ${className}`}
    >
      <Image
        src={locale === 'en' ? `/covers-en/${number}.webp` : `/covers/${number}.jpg`}
        alt={`${locale === 'en' ? 'Cover' : 'Couverture'} — ${title}`}
        loading={loading}
        fill
        unoptimized
        className="h-full w-full object-contain"
      />
      {needsCollectionCorrection && (
        <span
          aria-hidden="true"
          className="absolute left-0 top-[13.5%] flex h-[11.5%] w-[56%] items-center bg-[#f5efea] px-[6%] font-ui text-[0.55rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-bordeaux)] sm:text-[0.62rem]"
        >
          {collection}
        </span>
      )}
    </div>
  );
}
