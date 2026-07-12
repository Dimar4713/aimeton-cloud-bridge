import { readFile, writeFile } from 'node:fs/promises';

const [version, minAppVersionArg] = process.argv.slice(2);
if (!version || !/^\d+\.\d+\.\d+$/.test(version)) {
  console.error('Usage: npm run version:bump -- 1.0.1 [minimum-app-version]');
  process.exit(1);
}

const manifest = JSON.parse(await readFile('manifest.json', 'utf8'));
const pkg = JSON.parse(await readFile('package.json', 'utf8'));
const versions = JSON.parse(await readFile('versions.json', 'utf8'));
const minAppVersion = minAppVersionArg || manifest.minAppVersion;

manifest.version = version;
manifest.minAppVersion = minAppVersion;
pkg.version = version;
versions[version] = minAppVersion;

await writeFile('manifest.json', `${JSON.stringify(manifest, null, 2)}\n`);
await writeFile('package.json', `${JSON.stringify(pkg, null, 2)}\n`);
await writeFile('versions.json', `${JSON.stringify(versions, null, 2)}\n`);
console.log(`Version updated to ${version}; minAppVersion ${minAppVersion}.`);
