import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { sameOriginRequest } from '@/lib/security';
import { PURCHASE_CLAIM_COOKIE } from '@/lib/purchaseClaim';
import { claimGuestPurchases } from '@/lib/claimGuestPurchases';

export async function POST(req: Request) {
  if (!sameOriginRequest(req)) return NextResponse.json({ error: 'origin' }, { status: 403 });
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return NextResponse.json({ error: 'login_required' }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
  if (!user) return NextResponse.json({ error: 'login_required' }, { status: 401 });
  const store = await cookies();
  // A typed email alone is never proof: require the signed post-payment receipt,
  // match the checkout address, and never transfer another account's purchases.
  const result = await claimGuestPurchases(userId, user.email, store.get(PURCHASE_CLAIM_COOKIE)?.value);
  return NextResponse.json(result, { status: result.ok ? 200 : 403 });
}
