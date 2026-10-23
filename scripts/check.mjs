import { readFile, readdir, access } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
await import('./build.mjs');
const root = resolve(import.meta.dirname, '../dist');
let checked = 0;
const errors = [];
for (const name of await readdir(root)) {
  if (!name.endsWith('.html')) continue;
  const html = await readFile(resolve(root, name), 'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  if (new Set(ids).size !== ids.length) errors.push(`${name}: duplicate element IDs`);
  if ((html.match(/<h1[ >]/g) || []).length !== 1) errors.push(`${name}: expected exactly one h1`);
  if (!html.includes('lang="en"')) errors.push(`${name}: missing language`);
  if (!html.includes('name="description"')) errors.push(`${name}: missing description`);
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const target = match[1];
    if (/^(https?:|mailto:|data:)/.test(target)) continue;
    const [file, hash] = target.split('#');
    const destination = file ? resolve(dirname(resolve(root, name)), file) : resolve(root, name);
    try {
      await access(destination);
      if (hash && destination.endsWith('.html')) {
        const content = await readFile(destination, 'utf8');
        if (!content.includes(`id="${hash}"`)) errors.push(`${name}: missing fragment ${target}`);
      }
    } catch { errors.push(`${name}: missing local resource ${target}`); }
    checked++;
  }
  for (const match of html.matchAll(/<img\b[^>]*>/g)) if (!/\balt="[^"]*"/.test(match[0])) errors.push(`${name}: image missing alt text`);
  for (const match of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) if (!match[0].includes('noopener')) errors.push(`${name}: external tab missing noopener`);
}
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
else console.log(`Checked all 7 HTML pages, ${checked} local links/assets, fragments, image descriptions, and external-link safety.`);
await import('./check-scenes.mjs');
