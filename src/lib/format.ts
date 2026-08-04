export function formatPrice(cents: number, currency = 'CAD'): string {
  const value = (cents / 100).toFixed(cents % 100 === 0 ? 0 : 2);
  return `${value.replace('.', ',')} $`;
}

export const BRAND = {
  name: 'La Bibliothèque',
  author: 'Émilie Cauvier',
  tagline: 'Guides immobiliers pour le Grand Montréal',
  subscriptionCents: 1900,
  unitCents: 1400,
  address: '6640, avenue de l\'Esplanade, Montréal (QC) H2V 4L5',
};
