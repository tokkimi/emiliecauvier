// Browser regression check; purchase responses are mocked, no payment is made.
const { chromium } = require('C:/Users/bello/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch();
  try {
    for (const width of [390, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      let purchased = [];
      let fail = false;
      const first = 'devenir-proprietaire-au-quebec';
      const second = 'la-preapprobation-hypothecaire-decodee';
      await page.addInitScript(({first, second}) => {
        if (!localStorage.getItem('cart-test-seeded')) {
          localStorage.setItem('emilie_cart_slugs', JSON.stringify([first, second]));
          localStorage.setItem('cart-test-seeded', '1');
        }
        localStorage.setItem('emilie-cookie-choice', 'essential');
      }, {first, second});
      await page.route('**/api/cart/purchases', route => route.fulfill({
        status: fail ? 503 : 200,
        contentType: 'application/json', body: JSON.stringify(fail ? {error:'unavailable'} : {slugs:purchased}),
      }));
      await page.goto('http://localhost:3107/panier', {waitUntil:'networkidle'});
      const read = () => page.evaluate(() => JSON.parse(localStorage.getItem('emilie_cart_slugs')));
      assert.deepEqual(await read(), [first, second], 'Unpaid cart must remain intact');
      // A confirmed purchase arrives while the cart page is already open.
      purchased = [first];
      await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pageshow', {persisted:true})));
      await page.waitForFunction(() => JSON.parse(localStorage.getItem('emilie_cart_slugs')).length === 1);
      assert.deepEqual(await read(), [second]);
      await page.getByRole('heading', {name:'Devenir propriétaire au Québec', exact:true}).waitFor({state:'hidden'});
      // Browser back restores an old page; a failed lookup must preserve new items.
      fail = true;
      await page.evaluate(() => window.dispatchEvent(new Event('focus')));
      await page.waitForResponse('**/api/cart/purchases');
      assert.deepEqual(await read(), [second]);
      fail = false;
      purchased = [first, second];
      await page.evaluate(() => window.dispatchEvent(new Event('focus')));
      await page.getByText('Votre panier est vide.', {exact:true}).waitFor();
      assert.deepEqual(await read(), []);
      console.log(JSON.stringify({width, unpaid:'preserved', purchased:'removed', otherItems:'preserved', lookupFailure:'preserved', cartUI:'updated'}));
      await page.close();
    }
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exit(1); });
