import { createHmac, timingSafeEqual } from 'node:crypto';
import { signingSecret } from './security';

export const PREVIEW_COOKIE = 'guidimo_preview';
export const PREVIEW_MAX_AGE = 30 * 24 * 60 * 60;

function sign(payload: string) {
  return createHmac('sha256', signingSecret()).update(`preview:${payload}`).digest('base64url');
}

export function readPreview(value?: string): string[] {
  if (!value || value.length > 4000) return [];
  const [payload, signature, extra] = value.split('.');
  if (!payload || !signature || extra !== undefined) return [];
  const expected = Buffer.from(sign(payload));
  const received = Buffer.from(signature);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return [];
  try {
    const { slugs, expires } = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return expires > Date.now() && Array.isArray(slugs) && slugs.every(slug => typeof slug === 'string') ? slugs : [];
  } catch { return []; }
}

export function allowPreview(slugs: string[], slug: string) {
  const payload = Buffer.from(JSON.stringify({ slugs: [...new Set([...slugs, slug])], expires: Date.now() + PREVIEW_MAX_AGE * 1000 })).toString('base64url');
  return `${payload}.${sign(payload)}`;
}
