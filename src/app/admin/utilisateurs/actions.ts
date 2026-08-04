'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import type { Role, SubscriptionStatus } from '@/generated/prisma';

async function requireAdmin() {
  const session = await auth();
  if ((session?.user as { role?: string })?.role !== 'ADMIN') throw new Error('Accès refusé.');
}

export async function setRole(userId: string, role: Role) {
  await requireAdmin();
  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath('/admin/utilisateurs');
}

/** Débloque/retire un accès abonnement manuellement (ex. geste commercial). */
export async function setSubscription(userId: string, status: SubscriptionStatus) {
  await requireAdmin();
  const currentPeriodEnd =
    status === 'ACTIVE' ? new Date(Date.now() + 30 * 24 * 3600 * 1000) : null;
  await prisma.user.update({ where: { id: userId }, data: { subscriptionStatus: status, currentPeriodEnd } });
  revalidatePath('/admin/utilisateurs');
}

/** Offre un guide à un utilisateur (achat marqué payé à 0). */
export async function grantEbook(userId: string, ebookId: string) {
  await requireAdmin();
  await prisma.purchase.create({
    data: { userId, ebookId, type: 'ONE_TIME', status: 'PAID', amountCents: 0 },
  });
  revalidatePath('/admin/utilisateurs');
}
