export function formatPrice(cents: number): string {
  const value = (cents / 100).toFixed(cents % 100 === 0 ? 0 : 2);
  return `${value.replace('.', ',')} $ CAD`;
}

export const PACK_CENTS = 2900; // pack d'une collection complète

export const BRAND = {
  name: 'La Bibliothèque',
  author: 'Emilie Cauvier',
  tagline: 'Guides immobiliers pour le Grand Montréal',
  subscriptionCents: 1900,
  unitCents: 995,
  packCents: 2900,
  address: '6640, avenue de l\'Esplanade, Montréal (QC) H2V 4L5',
};
