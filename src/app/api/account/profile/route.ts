import { NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

const profileSchema = z.object({
  name: z.string().trim().max(80).transform((value) => value || null),
  locale: z.enum(['fr', 'en']),
});

export async function PATCH(req: Request) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });

  const parsed = profileSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Les renseignements fournis sont invalides.' }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: userId },
    data: { name: parsed.data.name, locale: parsed.data.locale },
  });

  return NextResponse.json({ ok: true });
}
