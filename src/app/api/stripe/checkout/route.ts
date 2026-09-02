import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { assertStripe, SUBSCRIPTION_PRICE_ID, APP_URL } from '@/lib/stripe';

const schema = z.object({
  mode: z.enum(['unit', 'subscription']),
  slug: z.string().optional(),
});

async function getOrCreateCustomer(userId: string, email: string) {
  const stripe = assertStripe();
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user?.stripeCustomerId) return user.stripeCustomerId;
  const customer = await stripe.customers.create({ email, metadata: { userId } });
  await prisma.user.update({ where: { id: userId }, data: { stripeCustomerId: customer.id } });
  return customer.id;
}

export async function POST(req: Request) {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;
  const email = session?.user?.email;

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });

  let stripe;
  try {
    stripe = assertStripe();
  } catch {
    return NextResponse.json({ error: 'Paiement non configuré (démo).' }, { status: 503 });
  }

  // ---- Abonnement mensuel ----
  if (parsed.data.mode === 'subscription') {
    if (!userId || !email) {
      return NextResponse.json({ error: 'Un compte est requis pour gérer un abonnement.' }, { status: 401 });
    }
    if (!SUBSCRIPTION_PRICE_ID) {
      return NextResponse.json({ error: 'Prix d\'abonnement non configuré.' }, { status: 503 });
    }
    const customerId = await getOrCreateCustomer(userId, email);
    const params: Stripe.Checkout.SessionCreateParams = {
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: SUBSCRIPTION_PRICE_ID, quantity: 1 }],
      success_url: `${APP_URL}/compte?success=abonnement`,
      cancel_url: `${APP_URL}/#abonnement`,
      metadata: { userId, kind: 'subscription' },
    };
    // Reste sur le Checkout standard : désactive « Managed Payments »
    // (activé par défaut sur le compte) qui exigerait un code de taxe par produit.
    (params as Record<string, unknown>).managed_payments = { enabled: false };
    try {
      const checkout = await stripe.checkout.sessions.create(params);
      return NextResponse.json({ url: checkout.url });
    } catch (err) {
      return NextResponse.json({ error: (err as Error).message }, { status: 502 });
    }
  }

  // ---- Achat à l'unité ----
  const slug = parsed.data.slug;
  if (!slug) return NextResponse.json({ error: 'Guide manquant.' }, { status: 400 });
  const ebook = await prisma.ebook.findUnique({ where: { slug } });
  if (!ebook) return NextResponse.json({ error: 'Guide introuvable.' }, { status: 404 });

  const purchase = await prisma.purchase.create({
    data: {
      userId: userId ?? null,
      ebookId: ebook.id,
      type: 'ONE_TIME',
      status: 'PENDING',
      amountCents: ebook.priceCents,
      currency: ebook.currency,
    },
  });

  const metadata: Record<string, string> = {
    kind: 'unit',
    ebookId: ebook.id,
    purchaseId: purchase.id,
    slug,
  };
  if (userId) metadata.userId = userId;

  const unitParams: Stripe.Checkout.SessionCreateParams = {
    mode: 'payment',
    ...(userId && email
      ? { customer: await getOrCreateCustomer(userId, email) }
      : { customer_creation: 'always' as const }),
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: ebook.currency.toLowerCase(),
          unit_amount: ebook.priceCents,
          product_data: { name: ebook.title, description: ebook.subtitle ?? undefined },
        },
      },
    ],
    success_url: `${APP_URL}/api/stripe/confirm?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${APP_URL}/livre/${slug}`,
    metadata,
  };
  // Idem : Checkout standard, pas de « Managed Payments ».
  (unitParams as Record<string, unknown>).managed_payments = { enabled: false };

  let checkout;
  try {
    checkout = await stripe.checkout.sessions.create(unitParams);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 502 });
  }

  await prisma.purchase.update({ where: { id: purchase.id }, data: { stripeSessionId: checkout.id } });
  return NextResponse.json({ url: checkout.url });
}
