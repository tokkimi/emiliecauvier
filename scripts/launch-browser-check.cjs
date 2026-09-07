const { chromium } = require(process.env.PLAYWRIGHT_MODULE);
const fs = require('node:fs');
const path = require('node:path');
async function main() {
  const base = process.argv[2] || 'http://127.0.0.1:3018';
  const out = path.resolve('../launch-qa'); fs.mkdirSync(out,{recursive:true});
  const browser = await chromium.launch({headless:true,channel:'chrome'});
  const report=[];
  for(const width of [390,1440]) {
    const context=await browser.newContext({viewport:{width,height:900}});
    const page=await context.newPage(); const errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    for(const route of ['/','/catalogue','/panier','/connexion','/inscription','/abonnement','/livre/acheter-un-chalet-residence-secondaire']) {
      const response=await page.goto(base+route,{waitUntil:'networkidle'});
      const consent=page.getByRole('button',{name:'Essentiels uniquement',exact:true});
      if(await consent.isVisible()) await consent.click();
      const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
      report.push({width,route,status:response.status(),overflow});
      if(response.status()>=500||overflow) throw new Error(JSON.stringify(report.at(-1)));
    }
    await page.goto(base+'/catalogue',{waitUntil:'networkidle'});
    await page.getByRole('button',{name:'Ajouter au panier',exact:true}).first().click();
    await page.goto(base+'/panier',{waitUntil:'networkidle'});
    if(!(await page.getByRole('button',{name:'Continuer sans compte',exact:true}).isVisible())) throw Error('Guest checkout missing');
    await page.screenshot({path:path.join(out,`cart-${width}.png`)});
    await page.getByRole('button',{name:'Demandez à Emilie',exact:true}).click();
    await page.locator('#ask-emilie').fill('Comment acheter un condo ?');
    await page.getByRole('button',{name:'Obtenir mes ressources'}).click();
    await page.getByRole('dialog').getByRole('link').first().waitFor();
    await page.screenshot({path:path.join(out,`assistant-${width}.png`)});
    await page.keyboard.press('Escape');
    if(await page.getByRole('dialog').count()) throw Error('Escape did not close dialog');
    if(width===1440) {
      await page.getByRole('button',{name:'en',exact:true}).click();
      await page.waitForFunction(()=>document.documentElement.lang==='en');
      await page.goto(base+'/catalogue',{waitUntil:'networkidle'});
      if(!(await page.locator('img[src="/covers-en/50.webp"]').count())) throw Error('English preview missing');
      await page.screenshot({path:path.join(out,'catalogue-en.png')});
    }
    if(errors.length) throw Error(errors.join('\n'));
    await context.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(out,'browser-report.json'),JSON.stringify(report,null,2));
  console.log('PASS browser: '+report.length+' page/viewport checks, cart, guest choice, assistant, Escape, EN previews. '+out);
}
main().catch(error=>{console.error(error);process.exit(1);});
