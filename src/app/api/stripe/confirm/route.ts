import { NextResponse } from 'next/server';
import { assertStripe } from '@/lib/stripe';
import { prisma } from '@/lib/db';
import { addGuestPurchases, GUEST_PURCHASE_COOKIE } from '@/lib/guestPurchase';
import { sendPurchaseEmail } from '@/lib/purchaseEmail';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get('session_id');
  if (!sessionId) return NextResponse.redirect(new URL('/catalogue?paiement=introuvable', req.url));

  try {
    const checkout = await assertStripe().checkout.sessions.retrieve(sessionId);
    const kind = checkout.metadata?.kind;
    if (checkout.payment_status !== 'paid' || (kind !== 'unit' && kind !== 'cart')) {
      return NextResponse.redirect(new URL('/catalogue?paiement=incomplet', req.url));
    }
    let purchases = await prisma.purchase.findMany({
      where: { stripeSessionId: checkout.id },
      include: { ebook: { select: { id: true, slug: true, title: true } } },
    });

    if (!purchases.length && checkout.metadata?.purchaseId) {
      const legacy = await prisma.purchase.findUnique({
        where: { id: checkout.metadata.purchaseId },
        include: { ebook: { select: { id: true, slug: true, title: true } } },
      });
      purchases = legacy ? [legacy] : [];
    }

    const ebookIds = purchases.map((purchase) => purchase.ebook?.id).filter((id): id is string => Boolean(id));
    const slugs = purchases.map((purchase) => purchase.ebook?.slug).filter((slug): slug is string => Boolean(slug));
    if (!ebookIds.length || !slugs.length) return NextResponse.redirect(new URL('/catalogue?paiement=introuvable', req.url));

    await prisma.purchase.updateMany({
      where: { id: { in: purchases.map((purchase) => purchase.id) } },
      data: {
        status: 'PAID',
        stripeSessionId: checkout.id,
        stripePaymentId: typeof checkout.payment_intent === 'string' ? checkout.payment_intent : undefined,
        guestEmail: checkout.metadata?.userId ? undefined : checkout.customer_details?.email ?? undefined,
      },
    });

    await sendPurchaseEmail({
      to: checkout.customer_details?.email,
      stripeSessionId: checkout.id,
      guides: purchases
        .map((purchase) =>
          purchase.ebook
            ? { purchaseId: purchase.id, ebookId: purchase.ebook.id, slug: purchase.ebook.slug, title: purchase.ebook.title }
            : null,
        )
        .filter((guide): guide is { purchaseId: string; ebookId: string; slug: string; title: string } => Boolean(guide)),
    });

    const response = NextResponse.redirect(new URL(`/achat-confirme?slugs=${encodeURIComponent(slugs.join(','))}`, req.url));
    const current = req.headers.get('cookie')?.match(new RegExp(`${GUEST_PURCHASE_COOKIE}=([^;]+)`))?.[1];
    const token = addGuestPurchases(current, ebookIds);
    response.cookies.set(GUEST_PURCHASE_COOKIE, token.value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: token.maxAge,
    });
    return response;
  } catch {
    return NextResponse.redirect(new URL('/catalogue?paiement=erreur', req.url));
  }
}
