import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { createPurchaseClaim, readPurchaseClaim } from '../src/lib/purchaseClaim';
async function main() {
  process.env.AUTH_SECRET = 'claim-test-only';
  const proof = createPurchaseClaim(['paid', 'refunded', 'already-owned']).value;
  assert.equal(readPurchaseClaim(proof).length, 3);
  assert.deepEqual(readPurchaseClaim(proof+'x'), []);
  assert.deepEqual(readPurchaseClaim(proof+'.extra'), []);
  const expired = Buffer.from(JSON.stringify({purchaseIds:['paid'],exp:0})).toString('base64url');
  assert.deepEqual(readPurchaseClaim(expired+'.'+createHmac('sha256',process.env.AUTH_SECRET).update('purchase-claim:'+expired).digest('base64url')), []);
  const rows = [
    {id:'paid',status:'PAID',userId:null,guestEmail:'buyer@example.invalid'},
    {id:'refunded',status:'REFUNDED',userId:null,guestEmail:'buyer@example.invalid'},
    {id:'already-owned',status:'PAID',userId:'someone-else',guestEmail:'buyer@example.invalid'},
    {id:'not-in-proof',status:'PAID',userId:null,guestEmail:'buyer@example.invalid'},
  ] as {id:string;status:string;userId:string|null;guestEmail:string}[];
  (globalThis as any).prisma = {purchase:{
    updateMany:async ({where,data}:any) => {const matches=rows.filter(r=>where.id.in.includes(r.id)&&r.status===where.status&&r.userId===where.userId&&r.guestEmail.toLowerCase()===where.guestEmail.equals.toLowerCase());matches.forEach(r=>r.userId=data.userId);return {count:matches.length};},
    count:async ({where}:any)=>rows.filter(r=>where.id.in.includes(r.id)&&r.status===where.status&&r.userId===where.userId).length,
  }};
  const { claimGuestPurchases } = await import('../src/lib/claimGuestPurchases');
  assert.equal((await claimGuestPurchases('buyer','buyer@example.invalid')).ok,false);
  assert.equal((await claimGuestPurchases('attacker','wrong@example.invalid',proof)).ok,false);
  assert.equal((await claimGuestPurchases('buyer','BUYER@example.invalid',proof)).attached,1);
  assert.equal((await claimGuestPurchases('buyer','buyer@example.invalid',proof)).attached,0);
  assert.deepEqual(rows.map(r=>r.userId),['buyer',null,'someone-else',null]);
  console.log('PASS signed/expired/forged proof, matching email, paid-only, no transfer, no email-only claim, idempotent persistence. Mock DB only.');
}
main().catch(error=>{console.error(error);process.exitCode=1;});
