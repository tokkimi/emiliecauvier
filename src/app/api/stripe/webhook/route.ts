import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { assertStripe } from '@/lib/stripe';
import { prisma } from '@/lib/db';
import { sendPurchaseEmail } from '@/lib/purchaseEmail';

// Stripe a besoin du corps brut pour vérifier la signature.
export const runtime = 'nodejs';

function mapSubStatus(s: Stripe.Subscription.Status): 'ACTIVE' | 'TRIALING' | 'PAST_DUE' | 'CANCELED' | 'NONE' {
  switch (s) {
    case 'active':
      return 'ACTIVE';
    case 'trialing':
      return 'TRIALING';
    case 'past_due':
    case 'unpaid':
      return 'PAST_DUE';
    case 'canceled':
    case 'incomplete_expired':
      return 'CANCELED';
    default:
      return 'NONE';
  }
}

async function recordDailyRevenue(field: 'oneTimeCents' | 'subscriptionCents', cents: number) {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  await prisma.dailyRevenue.upsert({
    where: { date },
    create: { date, [field]: cents },
    update: { [field]: { increment: cents } },
  });
}

export async function POST(req: Request) {
  const stripe = assertStripe();
  const sig = req.headers.get('stripe-signature');
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) return NextResponse.json({ error: 'Signature manquante.' }, { status: 400 });

  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch (err) {
    return NextResponse.json({ error: `Signature invalide: ${(err as Error).message}` }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const s = event.data.object as Stripe.Checkout.Session;
      const kind = s.metadata?.kind;
      const userId = s.metadata?.userId;

      if (kind === 'unit' || kind === 'cart') {
        const purchases = await prisma.purchase.findMany({
          where: { stripeSessionId: s.id },
          include: { ebook: { select: { id: true, slug: true, title: true } } },
        });
        if (purchases.length) {
          await prisma.purchase.updateMany({
            where: { id: { in: purchases.map((purchase) => purchase.id) } },
            data: {
              status: 'PAID',
              stripePaymentId: (s.payment_intent as string) ?? undefined,
              guestEmail: userId ? undefined : s.customer_details?.email ?? undefined,
            },
          });
          await Promise.all(
            purchases.map((purchase) =>
              prisma.analyticsEvent.create({
                data: { userId, name: 'purchase', ebookId: purchase.ebookId, meta: { amount: s.amount_total, stripeSessionId: s.id } },
              }),
            ),
          );
          await sendPurchaseEmail({
            to: s.customer_details?.email,
            stripeSessionId: s.id,
            guides: purchases
              .map((purchase) =>
                purchase.ebook
                  ? { purchaseId: purchase.id, ebookId: purchase.ebook.id, slug: purchase.ebook.slug, title: purchase.ebook.title }
                  : null,
              )
              .filter((guide): guide is { purchaseId: string; ebookId: string; slug: string; title: string } => Boolean(guide)),
          });
        } else if (s.metadata?.purchaseId) {
          await prisma.purchase.update({
            where: { id: s.metadata.purchaseId },
            data: {
              status: 'PAID',
              stripePaymentId: (s.payment_intent as string) ?? undefined,
              guestEmail: userId ? undefined : s.customer_details?.email ?? undefined,
            },
          });
          await prisma.analyticsEvent.create({
            data: { userId, name: 'purchase', ebookId: s.metadata.ebookId, meta: { amount: s.amount_total } },
          });
        }
        await recordDailyRevenue('oneTimeCents', s.amount_total ?? 0);
      }

      if (kind === 'subscription' && userId) {
        const subId = s.subscription as string;
        const sub = await stripe.subscriptions.retrieve(subId);
        await prisma.user.update({
          where: { id: userId },
          data: {
            stripeSubscriptionId: subId,
            subscriptionStatus: mapSubStatus(sub.status),
            subscriptionPriceId: sub.items.data[0]?.price.id,
            currentPeriodEnd: new Date(sub.current_period_end * 1000),
          },
        });
        await prisma.purchase.create({
          data: {
            userId,
            type: 'SUBSCRIPTION',
            status: 'PAID',
            amountCents: s.amount_total ?? 1900,
            stripeSessionId: s.id,
          },
        });
        await recordDailyRevenue('subscriptionCents', s.amount_total ?? 1900);
      }
      break;
    }

    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      const user = await prisma.user.findFirst({ where: { stripeSubscriptionId: sub.id } });
      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            subscriptionStatus: mapSubStatus(sub.status),
            currentPeriodEnd: new Date(sub.current_period_end * 1000),
          },
        });
      }
      break;
    }

    case 'invoice.paid': {
      const inv = event.data.object as Stripe.Invoice;
      // Renouvellements d'abonnement (hors 1er paiement déjà compté au checkout).
      if (inv.billing_reason === 'subscription_cycle') {
        await recordDailyRevenue('subscriptionCents', inv.amount_paid ?? 0);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
