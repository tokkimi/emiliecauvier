import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { BOOKS } from '../src/data/books';
import { loadPurchaseAttachments, MAX_ATTACHMENT_BYTES } from '../src/lib/purchaseAttachments';
import { sendPurchaseEmail } from '../src/lib/purchaseEmail';

const hash = (value: Buffer) => createHash('sha256').update(value).digest('hex');
async function main() {
  process.env.AUTH_SECRET = 'attachment-test-not-production';
  process.env.RESEND_API_KEY = 'fake-test-no-network';
  const captured: { body: any; key: string }[] = [];
  globalThis.fetch = (async (_url, init) => {
    captured.push({body: JSON.parse(String(init?.body)), key: (init?.headers as Record<string,string>)['Idempotency-Key']});
    return new Response(JSON.stringify({id: `test-${captured.length}`}));
  }) as typeof fetch;
  for (const locale of ['fr', 'en'] as const) {
    const batches = await loadPurchaseAttachments(BOOKS.map(book => book.slug), locale);
    assert.equal(batches.flat().length, 48);
    for (const batch of batches) {
      assert.ok(batch.reduce((n, a) => n + Buffer.from(a.content, 'base64').length, 0) <= MAX_ATTACHMENT_BYTES);
      for (const attachment of batch) {
        const book = BOOKS.find(b => `${b.slug}-${locale}.pdf` === attachment.filename)!;
        const original = await readFile(`storage/${locale === 'en' ? 'pdf-en' : 'pdf'}/${book.pdf}`);
        assert.equal(hash(Buffer.from(attachment.content, 'base64')), hash(original));
        assert.equal(attachment.content_type, 'application/pdf');
      }
    }
    for (const mode of ['account', 'guest']) {
      captured.length = 0;
      const guides = BOOKS.slice(0, 20).map(book => ({purchaseId:`p-${book.number}`, ebookId:`b-${book.number}`, slug:book.slug, title:book.title, createdAt:new Date('2026-09-07')}));
      const result = await sendPurchaseEmail({to:'test@example.invalid', guides, locale, stripeSessionId:`cs_test_${mode}`});
      assert.equal(result.sent, true);
      assert.equal(result.attachmentCount, 20);
      assert.equal(captured.flatMap(r => r.body.attachments).length, 20);
      assert.ok(captured.every(r => r.body.to === 'test@example.invalid' && r.body.html.includes(locale === 'en' ? 'attached' : 'joints')));
      const first = JSON.stringify(captured);
      captured.length=0;
      await sendPurchaseEmail({to:'test@example.invalid', guides:[...guides].reverse(), locale, stripeSessionId:`cs_test_${mode}`});
      // Input order must not affect body or idempotency keys.
      assert.equal(JSON.stringify(captured), first);
    }
  }
  await assert.rejects(loadPurchaseAttachments(['../../secret'], 'fr'));
  delete process.env.RESEND_API_KEY;
  assert.equal((await sendPurchaseEmail({to:'test@example.invalid', guides:[], stripeSessionId:'cs_test'})).sent, false);
  console.log('PASS: 96 exact PDF hashes, language, multipart size, account/guest mail payloads, stable retries, unknown guide rejected. No email sent.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
