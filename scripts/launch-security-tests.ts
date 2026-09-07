import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { signingSecret, sameOriginRequest, allowAttempt } from '../src/lib/security';
import { safeRedirect } from '../src/lib/safeRedirect';
import { addGuestPurchases, guestHasAccess, readGuestLibrary } from '../src/lib/guestPurchase';
import { createPurchaseDownloadToken, verifyPurchaseDownloadToken } from '../src/lib/purchaseDownloadToken';

async function main() {
  process.env.AUTH_SECRET = 'test-only-not-a-real-production-secret';
  for (const value of ['javascript:alert(1)', '//evil.test', '/\\\\evil.test', 'https://evil.test', '/ a']) assert.equal(safeRedirect(value), '/compte');
  assert.equal(safeRedirect('/panier?ok=1'), '/panier?ok=1');
  assert.equal(sameOriginRequest(new Request('https://site.test/api', { headers: { origin: 'https://evil.test' } })), false);
  assert.equal(sameOriginRequest(new Request('https://site.test/api', { headers: { origin: 'https://site.test' } })), true);
  assert.equal(allowAttempt('test', 1), true); assert.equal(allowAttempt('test', 1), false);
  const guest = addGuestPurchases(undefined, ['book1']).value;
  assert.equal(guestHasAccess(guest, 'book1'), true); assert.equal(guestHasAccess(guest, 'book2'), false);
  assert.equal(readGuestLibrary(guest + 'x'), null); assert.equal(readGuestLibrary(guest + '.extra'), null);
  const bad = Buffer.from(JSON.stringify({ ebookIds: ['book1'] })).toString('base64url');
  assert.equal(readGuestLibrary(bad + '.' + createHmac('sha256', signingSecret()).update(bad).digest('base64url')), null);
  const token = createPurchaseDownloadToken('purchase1', 'book1');
  assert.equal(verifyPurchaseDownloadToken(token, 'purchase1', 'book1'), true);
  assert.equal(verifyPurchaseDownloadToken(token, 'purchase2', 'book1'), false);
  assert.equal(verifyPurchaseDownloadToken(token + '.extra', 'purchase1', 'book1'), false);
  assert.equal(verifyPurchaseDownloadToken(createPurchaseDownloadToken('p', 'b', 0), 'p', 'b'), false);
  Object.assign(process.env, { NODE_ENV: 'production' });
  delete process.env.AUTH_SECRET;
  assert.throws(signingSecret);
  process.env.AUTH_SECRET = 'test-only-not-a-real-production-secret';
  Object.assign(process.env, { NODE_ENV: 'test', STRIPE_SECRET_KEY: 'sk_test_fake', STRIPE_WEBHOOK_SECRET: 'whsec_fake', RESEND_API_KEY: 'fake' });
  let writes = 0, revenue = 0, emails = 0, failEmail = false;
  const seen = new Set<string>();
  const purchase = { id:'p', ebookId:'b', createdAt:new Date('2026-09-01'), ebook:{id:'b',slug:'devenir-proprietaire-au-quebec',title:'Guide'} };
  const db: any = {
    $queryRaw: async () => [],
    purchase: { findMany: async () => [purchase], updateMany: async () => { writes++; return {count:1}; } },
    analyticsEvent: { findFirst: async ({where}:any) => seen.has(where.path) ? {id:'x'} : null, create:async ({data}:any) => { if(data.name==='stripe_event_processed') seen.add(data.path); return {id:'x'}; } },
    dailyRevenue: { upsert:async () => { revenue++; } },
  };
  db.$transaction = async (fn:any) => fn(db);
  (globalThis as any).prisma = db;
  globalThis.fetch = (async () => { emails++; return new Response('{}', {status:failEmail?503:200}); }) as typeof fetch;
  const { stripe } = await import('../src/lib/stripe');
  let event:any;
  stripe.webhooks.constructEvent = (() => event) as any;
  const { POST } = await import('../src/app/api/stripe/webhook/route');
  const request = () => new Request('https://site.test/api/stripe/webhook', {method:'POST',headers:{'stripe-signature':'test'},body:'{}'});
  assert.equal((await POST(new Request('https://site.test/api/stripe/webhook',{method:'POST',body:'{}'}))).status,400);
  event={id:'evt1',type:'checkout.session.completed',data:{object:{id:'cs_test',payment_status:'unpaid',metadata:{kind:'unit'},amount_total:995,customer_details:{email:'test@example.invalid'}}}};
  assert.equal((await POST(request())).status,200); assert.equal(writes,0);
  event.data.object.payment_status='paid';
  assert.equal((await POST(request())).status,200); assert.equal(writes,1); assert.equal(revenue,1);
  event.id='evt2'; event.type='checkout.session.async_payment_succeeded';
  assert.equal((await POST(request())).status,200); assert.equal(writes,1); assert.equal(revenue,1);
  failEmail=true; assert.equal((await POST(request())).status,503); assert.equal(writes,1);
  console.log('PASS: redirects, origin, rate limit, forged/expired tokens, required secret, unpaid checkout, duplicate payment events, email retry. No live DB or payment used.');
}
main().catch(error => { console.error(error); process.exitCode=1; });
