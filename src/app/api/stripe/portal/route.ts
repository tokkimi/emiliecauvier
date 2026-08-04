import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { assertStripe, APP_URL } from '@/lib/stripe';

export async function POST() {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return NextResponse.json({ error: 'Connexion requise.' }, { status: 401 });

  let stripe;
  try {
    stripe = assertStripe();
  } catch {
    return NextResponse.json({ error: 'Facturation non configurée (démo).' }, { status: 503 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user?.stripeCustomerId) {
    return NextResponse.json({ error: 'Aucun dossier de facturation.' }, { status: 400 });
  }

  const portal = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${APP_URL}/compte`,
  });
  return NextResponse.json({ url: portal.url });
}
