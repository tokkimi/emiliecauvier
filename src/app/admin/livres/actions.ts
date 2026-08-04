'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import type { Collection } from '@/generated/prisma';

async function requireAdmin() {
  const session = await auth();
  if ((session?.user as { role?: string })?.role !== 'ADMIN') throw new Error('Accès refusé.');
}

export async function togglePublish(id: string, next: boolean) {
  await requireAdmin();
  await prisma.ebook.update({ where: { id }, data: { isPublished: next } });
  revalidatePath('/admin/livres');
}

export async function saveEbook(id: string | null, formData: FormData) {
  await requireAdmin();
  const data = {
    slug: String(formData.get('slug') ?? '').trim(),
    number: Number(formData.get('number') ?? 0),
    title: String(formData.get('title') ?? '').trim(),
    subtitle: String(formData.get('subtitle') ?? '').trim() || null,
    description: String(formData.get('description') ?? '').trim(),
    collection: String(formData.get('collection') ?? 'ACHETEURS') as Collection,
    priceCents: Math.round(Number(formData.get('price') ?? 14) * 100),
    includedInSubscription: formData.get('includedInSubscription') === 'on',
    isPublished: formData.get('isPublished') === 'on',
    isFeatured: formData.get('isFeatured') === 'on',
    pdfKey: String(formData.get('pdfKey') ?? '').trim() || null,
  };

  if (id) {
    await prisma.ebook.update({ where: { id }, data });
  } else {
    await prisma.ebook.create({ data });
  }
  revalidatePath('/admin/livres');
  redirect('/admin/livres');
}

export async function deleteEbook(id: string) {
  await requireAdmin();
  await prisma.ebook.delete({ where: { id } });
  revalidatePath('/admin/livres');
}
