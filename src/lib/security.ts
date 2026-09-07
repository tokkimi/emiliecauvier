import { createHash } from 'node:crypto';

export function signingSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (secret && secret !== 'demo-secret-a-remplacer-par-openssl-rand-base64-32') return secret;
  if (process.env.NODE_ENV === 'production') throw new Error('AUTH_SECRET must be configured securely.');
  return 'local-development-only-not-for-production';
}

export function passwordVersion(hash: string): string {
  return createHash('sha256').update(hash).digest('hex');
}

/** Reject browser cross-origin writes; server-to-server requests may omit Origin. */
export function sameOriginRequest(request: Request): boolean {
  if (request.headers.get('sec-fetch-site') === 'cross-site') return false;
  const origin = request.headers.get('origin');
  if (!origin) return true;
  const allowed = [new URL(request.url).origin];
  for (const configured of [process.env.APP_URL, process.env.AUTH_URL, process.env.NEXT_PUBLIC_APP_URL]) {
    if (configured) { try { allowed.push(new URL(configured).origin); } catch { /* invalid config is not trusted */ } }
  }
  return allowed.includes(origin);
}

// Bounded per-instance protection. A distributed edge limit is still recommended.
const attempts = new Map<string, { count: number; reset: number }>();
export function allowAttempt(key: string, limit: number, windowMs = 15 * 60 * 1000): boolean {
  const now = Date.now();
  if (attempts.size >= 10000) {
    for (const [id, value] of attempts) if (value.reset <= now) attempts.delete(id);
    if (attempts.size >= 10000 && !attempts.has(key)) return false;
  }
  const old = attempts.get(key);
  const current = old && old.reset > now ? old : { count: 0, reset: now + windowMs };
  current.count += 1;
  attempts.set(key, current);
  return current.count <= limit;
}

export function attemptKey(scope: string, value: string): string {
  return `${scope}:${createHash('sha256').update(value).digest('hex')}`;
}
