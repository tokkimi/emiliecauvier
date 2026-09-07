import { createHmac, timingSafeEqual } from 'node:crypto';
import { signingSecret } from './security';

export const PURCHASE_CLAIM_COOKIE = 'emilie_purchase_claim';
const maxAge = 7 * 24 * 60 * 60;
const signature = (payload: string) => createHmac('sha256', signingSecret()).update(`purchase-claim:${payload}`).digest('base64url');
export function createPurchaseClaim(purchaseIds: string[]) {
  if (!purchaseIds.length || purchaseIds.length > 20) throw new Error('Invalid purchase claim');
  const payload = Buffer.from(JSON.stringify({ purchaseIds: [...new Set(purchaseIds)], exp: Date.now() + maxAge * 1000 })).toString('base64url');
  return { value: `${payload}.${signature(payload)}`, maxAge };
}
export function readPurchaseClaim(value?: string): string[] {
  if (!value || value.length > 4000 || value.split('.').length !== 2) return [];
  const [payload, provided] = value.split('.');
  const expected = Buffer.from(signature(payload));
  const actual = Buffer.from(provided);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return [];
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!Number.isFinite(data.exp) || data.exp <= Date.now() || !Array.isArray(data.purchaseIds) || !data.purchaseIds.length || data.purchaseIds.length > 20 || !data.purchaseIds.every((id: unknown) => typeof id === 'string' && /^[a-zA-Z0-9_-]{1,100}$/.test(id))) return [];
    return data.purchaseIds;
  } catch { return []; }
}
