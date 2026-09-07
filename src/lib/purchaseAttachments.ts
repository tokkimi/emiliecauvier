import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { bySlug } from '@/data/books';
import type { Locale } from '@/lib/i18n';

export type PdfAttachment = { filename: string; content: string; content_type: 'application/pdf' };
// Leave room for Base64/MIME overhead under common 25 MB mailbox limits.
export const MAX_ATTACHMENT_BYTES = 14 * 1024 * 1024;

export async function loadPurchaseAttachments(slugs: string[], locale: Locale): Promise<PdfAttachment[][]> {
  const batches: PdfAttachment[][] = [[]];
  let batchBytes = 0;
  for (const slug of [...new Set(slugs)].sort()) {
    const book = bySlug(slug);
    if (!book) throw new Error('Unknown purchased guide');
    // Read only trusted catalogue paths, never a user-provided path or public URL.
    // No language fallback: sending a French file for an English order is an error.
    const data = await readFile(path.join(process.cwd(), 'storage', locale === 'en' ? 'pdf-en' : 'pdf', book.pdf));
    if (data.subarray(0, 5).toString('ascii') !== '%PDF-') throw new Error('Invalid purchased PDF');
    if (data.length > MAX_ATTACHMENT_BYTES) throw new Error('PDF exceeds attachment limit');
    if (batchBytes + data.length > MAX_ATTACHMENT_BYTES) { batches.push([]); batchBytes = 0; }
    batches[batches.length - 1].push({ filename: `${book.slug}-${locale}.pdf`, content: data.toString('base64'), content_type: 'application/pdf' });
    batchBytes += data.length;
  }
  return batches.filter(batch => batch.length);
}
