import { createHmac, timingSafeEqual } from 'node:crypto';

export const GUEST_PURCHASE_COOKIE = 'emilie_guest_library';
const MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

type GuestLibrary = { ebookIds: string[]; exp: number };

function secret() {
  return process.env.AUTH_SECRET || 'demo-secret-a-remplacer-par-openssl-rand-base64-32';
}

function sign(encoded: string) {
  return createHmac('sha256', secret()).update(encoded).digest('base64url');
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

export function addGuestPurchase(current: string | undefined, ebookId: string) {
  const library = readGuestLibrary(current);
  const payload: GuestLibrary = {
    ebookIds: [...new Set([...(library?.ebookIds ?? []), ebookId])],
    exp: Date.now() + MAX_AGE_SECONDS * 1000,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return { value: `${encoded}.${sign(encoded)}`, maxAge: MAX_AGE_SECONDS };
}

export function guestHasAccess(value: string | undefined, ebookId: string) {
  return readGuestLibrary(value)?.ebookIds.includes(ebookId) ?? false;
}

