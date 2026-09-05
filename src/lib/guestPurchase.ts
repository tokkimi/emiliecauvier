import { createHmac, timingSafeEqual } from 'node:crypto';

export const GUEST_PURCHASE_COOKIE = 'emilie_guest_library';
const MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export type GuestLang = 'fr' | 'en';
type GuestItem = { id: string; lang: GuestLang };
type GuestLibrary = { ebookIds: string[]; items?: GuestItem[]; exp: number };

function secret() {
  return process.env.AUTH_SECRET || 'demo-secret-a-remplacer-par-openssl-rand-base64-32';
}

function sign(encoded: string) {
  return createHmac('sha256', secret()).update(encoded).digest('base64url');
}

function normalizeLang(value: unknown): GuestLang {
  return value === 'en' ? 'en' : 'fr';
}

export function readGuestLibrary(value: string | undefined): GuestLibrary | null {
  if (!value) return null;
  const [encoded, signature] = value.split('.');
  if (!encoded || !signature) return null;
  const expected = sign(encoded);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (actualBuffer.length !== expectedBuffer.length || !timingSafeEqual(actualBuffer, expectedBuffer)) return null;
  try {
    const parsed = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as GuestLibrary;
    if (!Array.isArray(parsed.ebookIds) || parsed.exp < Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Éditions (langues) possédées pour un ebook — rétrocompatible (repli FR). */
function ownedItems(library: GuestLibrary | null): GuestItem[] {
  if (!library) return [];
  if (Array.isArray(library.items) && library.items.length) {
    return library.items
      .filter((item): item is GuestItem => Boolean(item) && typeof item.id === 'string')
      .map((item) => ({ id: item.id, lang: normalizeLang(item.lang) }));
  }
  // Ancien cookie : uniquement des ids → éditions françaises.
  return library.ebookIds.map((id) => ({ id, lang: 'fr' as GuestLang }));
}

export function addGuestPurchases(current: string | undefined, purchases: { id: string; lang: GuestLang }[]) {
  const library = readGuestLibrary(current);
  const mergedItems = new Map<string, GuestItem>();
  for (const item of ownedItems(library)) mergedItems.set(`${item.id}:${item.lang}`, item);
  for (const p of purchases) {
    const lang = normalizeLang(p.lang);
    mergedItems.set(`${p.id}:${lang}`, { id: p.id, lang });
  }
  const items = [...mergedItems.values()];
  const payload: GuestLibrary = {
    ebookIds: [...new Set(items.map((item) => item.id))],
    items,
    exp: Date.now() + MAX_AGE_SECONDS * 1000,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return { value: `${encoded}.${sign(encoded)}`, maxAge: MAX_AGE_SECONDS };
}

export function addGuestPurchase(current: string | undefined, ebookId: string, lang: GuestLang = 'fr') {
  return addGuestPurchases(current, [{ id: ebookId, lang }]);
}

/** Accès (lecture) à un guide, quelle que soit la langue achetée. */
export function guestHasAccess(value: string | undefined, ebookId: string) {
  return readGuestLibrary(value)?.ebookIds.includes(ebookId) ?? false;
}

/** Langues (éditions PDF) réellement achetées pour ce guide. */
export function guestOwnedLangs(value: string | undefined, ebookId: string): Set<GuestLang> {
  const langs = new Set<GuestLang>();
  for (const item of ownedItems(readGuestLibrary(value))) {
    if (item.id === ebookId) langs.add(item.lang);
  }
  return langs;
}
