const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const root = path.resolve(__dirname, '..');
const base = new URL(process.argv[2] || 'https://www.guidesimmoquebec.com/');
const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'english-cover-artwork.json'), 'utf8'));
const numbers = Object.keys(manifest.sources).filter(number => number !== 'back');
const hash = value => crypto.createHash('sha256').update(value).digest('hex');

async function main() {
  if (numbers.length !== 48) throw new Error(`Expected 48 reviewed front covers, got ${numbers.length}`);
  let verified = 0;
  for (let start = 0; start < numbers.length; start += 6) {
    await Promise.all(numbers.slice(start, start + 6).map(async number => {
      const relative = `covers-en/${number}.webp`;
      const response = await fetch(new URL(relative, base), { signal: AbortSignal.timeout(30000) });
      if (!response.ok) throw new Error(`${relative}: HTTP ${response.status}`);
      const remote = Buffer.from(await response.arrayBuffer());
      const local = fs.readFileSync(path.join(root, 'public', relative));
      if (hash(remote) !== hash(local)) throw new Error(`Stale or mismatched artwork: ${relative}`);
      verified += 1;
    }));
  }
  if (process.argv.includes('--back')) {
    const response = await fetch(new URL('covers-en/back.jpg', base), { signal: AbortSignal.timeout(30000) });
    if (!response.ok) throw new Error(`Back cover: HTTP ${response.status}`);
    const remote = Buffer.from(await response.arrayBuffer());
    const local = fs.readFileSync(path.join(root, 'public/covers-en/back.jpg'));
    if (hash(remote) !== hash(local)) throw new Error('Stale or mismatched approved back cover');
    console.log('Approved back cover verified by SHA-256.');
  }
  console.log(`${verified}/48 deployed front covers verified by SHA-256 at ${base.origin}.`);
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
