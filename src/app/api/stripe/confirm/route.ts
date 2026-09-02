import { NextResponse } from 'next/server';
import { assertStripe } from '@/lib/stripe';
import { prisma } from '@/lib/db';
import { addGuestPurchase, GUEST_PURCHASE_COOKIE } from '@/lib/guestPurchase';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get('session_id');
  if (!sessionId) return NextResponse.redirect(new URL('/catalogue?paiement=introuvable', req.url));

  try {
    const checkout = await assertStripe().checkout.sessions.retrieve(sessionId);
    const ebookId = checkout.metadata?.ebookId;
    const purchaseId = checkout.metadata?.purchaseId;
    if (checkout.payment_status !== 'paid' || checkout.metadata?.kind !== 'unit' || !ebookId || !purchaseId) {
      return NextResponse.redirect(new URL('/catalogue?paiement=incomplet', req.url));
    }
    const ebook = await prisma.ebook.findUnique({ where: { id: ebookId }, select: { slug: true } });
    if (!ebook) return NextResponse.redirect(new URL('/catalogue?paiement=introuvable', req.url));

    await prisma.purchase.update({
      where: { id: purchaseId },
      data: {
        status: 'PAID',
        stripeSessionId: checkout.id,
        stripePaymentId: typeof checkout.payment_intent === 'string' ? checkout.payment_intent : undefined,
        guestEmail: checkout.metadata?.userId ? undefined : checkout.customer_details?.email ?? undefined,
      },
    });

    const response = NextResponse.redirect(new URL(`/achat-confirme?slug=${ebook.slug}`, req.url));
    const current = req.headers.get('cookie')?.match(new RegExp(`${GUEST_PURCHASE_COOKIE}=([^;]+)`))?.[1];
    const token = addGuestPurchase(current, ebookId);
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

