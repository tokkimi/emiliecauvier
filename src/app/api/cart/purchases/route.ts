import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { GUEST_PURCHASE_COOKIE, readGuestLibrary } from '@/lib/guestPurchase';

export async function GET() {
  const headers = { 'Cache-Control': 'private, no-store' };
  try {
    const session = await auth();
    const userId = (session?.user as { id?: string } | undefined)?.id;
    const guest = readGuestLibrary((await cookies()).get(GUEST_PURCHASE_COOKIE)?.value);
    const [purchases, guestBooks] = await Promise.all([
      userId ? prisma.purchase.findMany({
        where: { userId, status: 'PAID', type: 'ONE_TIME' },
        select: { ebook: { select: { slug: true } } },
      }) : [],
      guest?.ebookIds.length ? prisma.ebook.findMany({
        where: { id: { in: guest.ebookIds } },
        select: { slug: true },
      }) : [],
    ]);
    const slugs = [...new Set([
      ...purchases.flatMap(purchase => purchase.ebook ? [purchase.ebook.slug] : []),
      ...guestBooks.map(book => book.slug),
    ])];
    return NextResponse.json({ slugs }, { headers });
  } catch {
    // Keep the cart intact when the purchase lookup is unavailable.
    return NextResponse.json({ error: 'Unable to verify purchases' }, { status: 503, headers });
  }
}
