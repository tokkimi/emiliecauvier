export const CART_STORAGE_KEY = 'emilie_cart_slugs';
export const CART_CHANGED_EVENT = 'emilie-cart-changed';

export type CartLang = 'fr' | 'en';
export interface CartItem {
  slug: string;
  lang: CartLang;
}

function normalizeLang(value: unknown): CartLang {
  return value === 'en' ? 'en' : 'fr';
}

/**
 * Lit le panier. Rétrocompatible : les anciens paniers stockaient un simple
 * tableau de slugs (`string[]`) — on les relit comme des éditions françaises.
 */
export function readCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const value = JSON.parse(window.localStorage.getItem(CART_STORAGE_KEY) ?? '[]');
    if (!Array.isArray(value)) return [];
    const items: CartItem[] = [];
    for (const entry of value) {
      if (typeof entry === 'string') {
        items.push({ slug: entry, lang: 'fr' });
      } else if (entry && typeof entry === 'object' && typeof entry.slug === 'string') {
        items.push({ slug: entry.slug, lang: normalizeLang(entry.lang) });
      }
    }
    // Un guide n'apparaît qu'une fois (dernier choix de langue conservé).
    const bySlug = new Map<string, CartItem>();
    items.forEach((item) => bySlug.set(item.slug, item));
    return [...bySlug.values()];
  } catch {
    return [];
  }
}

export function writeCart(items: CartItem[]) {
  if (typeof window === 'undefined') return;
  const bySlug = new Map<string, CartItem>();
  items.forEach((item) => bySlug.set(item.slug, { slug: item.slug, lang: normalizeLang(item.lang) }));
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([...bySlug.values()]));
  window.dispatchEvent(new Event(CART_CHANGED_EVENT));
}

/** Ajoute (ou met à jour la langue d') un guide au panier. */
export function addCartItem(slug: string, lang: CartLang) {
  writeCart([...readCart().filter((item) => item.slug !== slug), { slug, lang }]);
}

/** Change la langue d'un guide déjà au panier. */
export function setCartItemLang(slug: string, lang: CartLang) {
  writeCart(readCart().map((item) => (item.slug === slug ? { ...item, lang } : item)));
}

export function removeCartItem(slug: string) {
  writeCart(readCart().filter((item) => item.slug !== slug));
}

export function clearCart() {
  writeCart([]);
}

/** Slugs seuls (badges de comptage). */
export function readCartSlugs(): string[] {
  return readCart().map((item) => item.slug);
}
