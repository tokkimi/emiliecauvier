export const CART_STORAGE_KEY = 'emilie_cart_slugs';
export const CART_CHANGED_EVENT = 'emilie-cart-changed';

export function readCartSlugs(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const value = JSON.parse(window.localStorage.getItem(CART_STORAGE_KEY) ?? '[]');
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

export function writeCartSlugs(slugs: string[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([...new Set(slugs)]));
  window.dispatchEvent(new Event(CART_CHANGED_EVENT));
}

export function addCartSlug(slug: string) {
  writeCartSlugs([...readCartSlugs(), slug]);
}

export function removeCartSlug(slug: string) {
  writeCartSlugs(readCartSlugs().filter((item) => item !== slug));
}

export function clearCartSlugs() {
  writeCartSlugs([]);
}
