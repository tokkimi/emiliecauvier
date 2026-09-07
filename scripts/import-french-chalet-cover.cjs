const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
async function main() {
  const source = process.argv[2];
  if (!source) throw new Error('Provide the reviewed French artwork PNG.');
  const root = path.resolve(__dirname, '..');
  const master = path.resolve(root, '../english-cover-masters/50-fr.png');
  fs.copyFileSync(source, master);
  await sharp(master).jpeg({ quality: 95, chromaSubsampling: '4:4:4' }).toFile(path.join(root, 'public/covers/50.jpg'));
  console.log('French cover 50 imported; English artwork unchanged.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
