import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';

const run = (command, args) => {
  const result = spawnSync(command, args, { stdio: 'inherit', shell: process.platform === 'win32' });
  if (result.status !== 0) process.exit(result.status ?? 1);
};

run(process.execPath, ['scripts/build.mjs']);
run(process.execPath, ['scripts/check.mjs']);
run(process.execPath, ['tests/smoke.test.cjs']);

const manifest = JSON.parse(await readFile('manifest.json', 'utf8'));
const dir = `release/${manifest.version}`;
await rm(dir, { recursive: true, force: true });
await mkdir(dir, { recursive: true });
for (const file of ['main.js', 'manifest.json', 'styles.css', 'README.md', 'LICENSE']) {
  await cp(file, `${dir}/${file}`);
}
await writeFile(`${dir}/INSTALL.txt`, `Install main.js, manifest.json and styles.css into:\n.obsidian/plugins/${manifest.id}/\n`, 'utf8');
console.log(`Prepared ${dir}`);
