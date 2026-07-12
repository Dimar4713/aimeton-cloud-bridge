import { access, readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';

const required = [
  'src/main.js', 'manifest.json', 'versions.json', 'styles.css',
  'README.md', 'LICENSE', 'NOTICE.md', 'PRIVACY.md', 'SECURITY.md',
  'CHANGELOG.md', 'PUBLISHING.md', 'TESTING.md', 'package.json',
];

const errors = [];
for (const file of required) {
  try { await access(file); } catch { errors.push(`Missing required file: ${file}`); }
}

const manifest = JSON.parse(await readFile('manifest.json', 'utf8'));
const pkg = JSON.parse(await readFile('package.json', 'utf8'));
const versions = JSON.parse(await readFile('versions.json', 'utf8'));
const source = await readFile('src/main.js', 'utf8');
const built = await readFile('main.js', 'utf8');
const privacy = await readFile('PRIVACY.md', 'utf8');

if (manifest.id !== 'aimeton-cloud-bridge') errors.push('Unexpected plugin ID.');
if (manifest.name !== 'AIMETON Cloud Bridge') errors.push('Unexpected plugin name.');
if (manifest.author !== 'Dimar4713') errors.push('Unexpected manifest author.');
if (manifest.version !== pkg.version) errors.push('manifest.json and package.json versions differ.');
if (versions[manifest.version] !== manifest.minAppVersion) errors.push('versions.json does not map the current version to minAppVersion.');
if (!/^[a-z0-9-]+$/.test(manifest.id)) errors.push('Plugin ID contains invalid characters.');
if (!/^\d+\.\d+\.\d+$/.test(manifest.version)) errors.push('Version is not plain semantic versioning.');
if (/\bObsidian\b/i.test(manifest.description)) errors.push('Manifest description should not contain the host product name.');

const expectedBuilt = source.replace(
  /AIMETON Cloud Bridge — universal bilingual mobile\/desktop support v[0-9]+\.[0-9]+\.[0-9]+/,
  `AIMETON Cloud Bridge — universal bilingual mobile/desktop support v${manifest.version}`,
);
if (built !== expectedBuilt) errors.push('main.js is not synchronized with src/main.js. Run npm run build.');

const secretPatterns = [
  ['Yandex OAuth token', /y0_[A-Za-z0-9_-]{10,}/],
  ['credential-bearing proxy URL', /(https?|socks5):\/\/[^\s:@]+:[^\s@]+@/],
  ['known exposed proxy username', /login1972/i],
];
for (const [label, pattern] of secretPatterns) {
  if (pattern.test(source) || pattern.test(built)) errors.push(`Possible secret in source: ${label}.`);
}

if (!privacy.includes('stored locally') || !privacy.includes('data.json')) {
  errors.push(`PRIVACY.md must accurately disclose local data.json credential storage for ${manifest.version}.`);
}

for (const requiredSnippet of [
  "'settings.oauthHelpTitle'",
  "https://yandex.ru/dev/disk/poligon/",
  "https://yandex.ru/dev/id/doc/ru/tokens/debug-token",
  "https://yandex.com/dev/id/doc/en/tokens/debug-token",
  "createEl('details'",
]) {
  if (!source.includes(requiredSnippet)) errors.push(`OAuth help feature is incomplete: ${requiredSnippet}`);
}

const syntax = spawnSync(process.execPath, ['--check', 'main.js'], { encoding: 'utf8' });
if (syntax.status !== 0) errors.push(`JavaScript syntax check failed:\n${syntax.stderr}`);

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}


const sourceText = await readFile('src/main.js', 'utf8');
const deleteStart = sourceText.indexOf('async deleteItem(item) {');
const deleteEnd = sourceText.indexOf('\n    async showMoveDialog', deleteStart);
if (deleteStart === -1 || deleteEnd === -1) {
  errors.push('deleteItem method was not found.');
} else {
  const deleteMethod = sourceText.slice(deleteStart, deleteEnd);
  if (!deleteMethod.includes('this.plugin.clearCache();')) {
    errors.push('deleteItem must clear the directory cache after a successful delete.');
  }
  if (!deleteMethod.includes('await this.loadDirectory(this.currentPath);')) {
    errors.push('deleteItem must await the directory reload after a successful delete.');
  }
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log(`Validation passed for ${manifest.name} ${manifest.version}.`);
