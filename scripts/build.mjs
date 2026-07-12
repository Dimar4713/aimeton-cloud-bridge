import { readFile, writeFile } from 'node:fs/promises';

const manifest = JSON.parse(await readFile('manifest.json', 'utf8'));
let source = await readFile('src/main.js', 'utf8');
source = source.replace(
  /AIMETON Cloud Bridge — universal bilingual mobile\/desktop (?:support|compatibility build) v[0-9]+\.[0-9]+\.[0-9]+/,
  `AIMETON Cloud Bridge — universal bilingual mobile/desktop compatibility build v${manifest.version}`,
);
await writeFile('main.js', source, 'utf8');
console.log(`Built main.js for ${manifest.name} ${manifest.version}`);
