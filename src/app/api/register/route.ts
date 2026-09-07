import { sameOriginRequest, allowAttempt, attemptKey } from '@/lib/security';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';

const schema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères.').max(72).refine(value => Buffer.byteLength(value, 'utf8') <= 72, 'Mot de passe trop long.'),
  name: z.string().trim().max(80).optional(),
  source: z.string().max(100).optional(),
});

export async function POST(req: Request) {
  if (!sameOriginRequest(req)) return NextResponse.json({ error: 'Origine non autorisée.' }, { status: 403 });
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Données invalides.' }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase().trim();
  if (!allowAttempt(attemptKey('register', req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'), 10)) {
    return NextResponse.json({ error: 'Trop de tentatives. Réessayez dans quelques minutes.' }, { status: 429, headers: { 'Retry-After': '900' } });
  }
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: 'Un compte existe déjà avec cet email.' }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  await prisma.user.create({
    data: { email, passwordHash, name: parsed.data.name, source: parsed.data.source ?? 'site' },
  });

  return NextResponse.json({ ok: true });
}
