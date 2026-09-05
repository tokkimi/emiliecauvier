// Format conversion only: all artwork and typography are in the approved source PNG.
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');

async function main() {
  const sourceDir = process.argv[2];
  if (!sourceDir) throw new Error('Provide the directory containing generated PNGs.');
  const root = path.resolve(__dirname, '..');
  const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'english-cover-artwork.json'), 'utf8'));
  const masters = path.resolve(root, '../english-cover-masters');
  fs.mkdirSync(masters, { recursive: true });
  const includeBack = process.argv.includes('--back');
  for (const [number, filename] of Object.entries(manifest.sources)) {
    if (number === 'back' && !includeBack) continue;
    if (number !== 'back' && includeBack) continue;
    const original = path.join(sourceDir, filename);
    const master = path.join(masters, `${number}.png`);
    fs.copyFileSync(original, master);
    const metadata = await sharp(master).metadata();
    if (metadata.width < 1000 || Math.abs(metadata.width / metadata.height - 2 / 3) > 0.01) {
      throw new Error(`Invalid portrait cover: ${number}`);
    }
    const output = path.join(root, 'public/covers-en', `${number}.jpg`);
    await sharp(master).jpeg({ quality: 95, chromaSubsampling: '4:4:4' }).toFile(output);
    // Lighter catalogue preview, same pixels and artwork as the PDF cover.
    if (number !== 'back') {
      await sharp(master).webp({ quality: 90, effort: 5 }).toFile(output.replace(/\.jpg$/, '.webp'));
    }
    console.log(`${number}: ${metadata.width}×${metadata.height} → ${output}`);
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
