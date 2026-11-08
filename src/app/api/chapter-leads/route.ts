import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { bySlug } from '@/data/books';
import { prisma } from '@/lib/db';
import { allowAttempt, attemptKey, sameOriginRequest } from '@/lib/security';
import { allowPreview, PREVIEW_COOKIE, PREVIEW_MAX_AGE, readPreview } from '@/lib/preview-access';

const schema = z.object({
  email: z.string().trim().email().max(254),
  slug: z.string().max(120),
  locale: z.enum(['fr', 'en']),
  consent: z.literal(true),
  marketing: z.boolean().default(false),
});

export async function POST(request: Request) {
  if (!sameOriginRequest(request)) return NextResponse.json({ error: 'origin' }, { status: 403 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success || !bySlug(parsed.data.slug)) return NextResponse.json({ error: 'invalid' }, { status: 400 });
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  if (ip && !allowAttempt(attemptKey('chapter', ip), 25)) return NextResponse.json({ error: 'limit' }, { status: 429 });
  const { slug, locale, marketing } = parsed.data;
  const email = parsed.data.email.toLowerCase();
  try {
    await prisma.chapterLead.upsert({
      where: { email_guideSlug: { email, guideSlug: slug } },
      create: { email, guideSlug: slug, locale, marketingOptInAt: marketing ? new Date() : null },
      update: marketing ? { marketingOptInAt: new Date() } : {},
    });
    const response = NextResponse.json({ ok: true });
    const current = (await cookies()).get(PREVIEW_COOKIE)?.value;
    response.cookies.set(PREVIEW_COOKIE, allowPreview(readPreview(current), slug), {
      httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: PREVIEW_MAX_AGE,
    });
    return response;
  } catch { return NextResponse.json({ error: 'unavailable' }, { status: 503 }); }
}
