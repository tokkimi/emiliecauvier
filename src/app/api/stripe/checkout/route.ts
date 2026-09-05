import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { assertStripe, SUBSCRIPTION_PRICE_ID, APP_URL } from '@/lib/stripe';
import { bySlug } from '@/data/books';
import { localizeBook } from '@/data/booksEn';

const schema = z.object({
  mode: z.enum(['unit', 'subscription']),
  slug: z.string().optional(),
  slugs: z.array(z.string()).max(20).optional(),
  pdfLocale: z.enum(['fr', 'en']).optional(),
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

  // ---- Achat à l'unité / panier ----
  const requestedSlugs = [...new Set(parsed.data.slugs?.length ? parsed.data.slugs : parsed.data.slug ? [parsed.data.slug] : [])];
  const pdfLocale = parsed.data.pdfLocale ?? 'fr';
  if (!requestedSlugs.length) return NextResponse.json({ error: 'Guide manquant.' }, { status: 400 });

  const ebooks = await prisma.ebook.findMany({
    where: { slug: { in: requestedSlugs }, isPublished: true },
    orderBy: { number: 'asc' },
  });
  if (ebooks.length !== requestedSlugs.length) return NextResponse.json({ error: 'Un guide du panier est introuvable.' }, { status: 404 });

  const metadata: Record<string, string> = { kind: ebooks.length > 1 ? 'cart' : 'unit', pdfLocale };
  if (userId) metadata.userId = userId;

  const unitParams: Stripe.Checkout.SessionCreateParams = {
    mode: 'payment',
    ...(userId && email
      ? { customer: await getOrCreateCustomer(userId, email) }
      : { customer_creation: 'always' as const }),
    line_items: ebooks.map((ebook) => {
      const catalogBook = bySlug(ebook.slug);
      const localized = catalogBook ? localizeBook(catalogBook, pdfLocale) : { title: ebook.title, subtitle: ebook.subtitle ?? '' };
      return {
        quantity: 1,
        price_data: {
          currency: ebook.currency.toLowerCase(),
          unit_amount: ebook.priceCents,
          product_data: {
            name: localized.title,
            description: localized.subtitle || undefined,
          },
        },
      };
    }),
    success_url: `${APP_URL}/api/stripe/confirm?session_id={CHECKOUT_SESSION_ID}&lang=${pdfLocale}`,
    cancel_url: ebooks.length > 1 ? `${APP_URL}/panier` : `${APP_URL}/livre/${ebooks[0].slug}`,
    metadata,
    payment_intent_data: {
      description: 'Guides Immo Quebec - ebooks',
    },
  };
  // Idem : Checkout standard, pas de « Managed Payments ».
  (unitParams as Record<string, unknown>).managed_payments = { enabled: false };

  let checkout;
  try {
    checkout = await stripe.checkout.sessions.create(unitParams);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 502 });
  }

  await prisma.$transaction(
    ebooks.map((ebook) =>
      prisma.purchase.create({
        data: {
          userId: userId ?? null,
          ebookId: ebook.id,
          type: 'ONE_TIME',
          status: 'PENDING',
          amountCents: ebook.priceCents,
          currency: ebook.currency,
          stripeSessionId: checkout.id,
        },
      }),
    ),
  );
  return NextResponse.json({ url: checkout.url });
}
