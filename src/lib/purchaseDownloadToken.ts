import { createHmac, timingSafeEqual } from 'node:crypto';

const MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

type PurchaseDownloadPayload = {
  purchaseId: string;
  ebookId: string;
  exp: number;
};

function secret() {
  return process.env.AUTH_SECRET || 'demo-secret-a-remplacer-par-openssl-rand-base64-32';
}

function sign(encoded: string) {
  return createHmac('sha256', secret()).update(encoded).digest('base64url');
}

export function createPurchaseDownloadToken(purchaseId: string, ebookId: string) {
  const payload: PurchaseDownloadPayload = {
    purchaseId,
    ebookId,
    exp: Date.now() + MAX_AGE_SECONDS * 1000,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${encoded}.${sign(encoded)}`;
}

export function verifyPurchaseDownloadToken(value: string | null | undefined, purchaseId: string, ebookId: string) {
  if (!value) return false;
  const [encoded, signature] = value.split('.');
  if (!encoded || !signature) return false;
  const expected = sign(encoded);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (actualBuffer.length !== expectedBuffer.length || !timingSafeEqual(actualBuffer, expectedBuffer)) return false;

  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as PurchaseDownloadPayload;
    return payload.purchaseId === purchaseId && payload.ebookId === ebookId && payload.exp > Date.now();
  } catch {
    return false;
  }
}
