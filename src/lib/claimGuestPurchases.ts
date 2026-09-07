import { prisma } from './db';
import { readPurchaseClaim } from './purchaseClaim';

export async function claimGuestPurchases(userId: string, email: string, proof?: string) {
  const ids = readPurchaseClaim(proof);
  if (!ids.length) return { ok: false, error: 'proof_missing' };
  const result = await prisma.purchase.updateMany({
    where: { id: { in: ids }, status: 'PAID', userId: null, guestEmail: { equals: email, mode: 'insensitive' } },
    data: { userId },
  });
  const owned = await prisma.purchase.count({ where: { id: { in: ids }, status: 'PAID', userId } });
  return owned ? { ok: true, attached: result.count, owned } : { ok: false, error: 'email_or_purchase_mismatch' };
}
