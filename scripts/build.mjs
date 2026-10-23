import { cp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { resolve, relative, dirname, sep } from 'node:path';
import { pages, renderPage } from '../site/legal-content.mjs';

const root = resolve(import.meta.dirname, '..');
const dist = resolve(root, 'dist');
await mkdir(dist, { recursive: true });
for (const entry of await readdir(resolve(root, 'site'), { withFileTypes: true })) {
  if (entry.name.endsWith('.mjs')) continue;
  await cp(resolve(root, 'site', entry.name), resolve(dist, entry.name), { recursive: true });
}
for (const page of pages) await writeFile(resolve(dist, `${page.slug}.html`), renderPage(page));
// Keep the supplied database self-contained, including under a project subpath.
const database = resolve(dist, 'proverbs');
await cp(resolve(root, 'proverbs'), database, { recursive: true });
async function prepareDatabase(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = resolve(directory, entry.name);
    if (entry.isDirectory()) await prepareDatabase(file);
    else if (entry.name.endsWith('.html')) {
      const prefix = relative(dirname(file), database).split(sep).join('/') || '.';
      const html = (await readFile(file, 'utf8'))
        .replace(/\b(href|src)="\/(?!\/)([^"]*)"/g, `$1="${prefix}/$2"`)
        .replaceAll('/img/icon.jpg', '/img/icon.JPG');
      await writeFile(file, html);
    }
  }
}
await prepareDatabase(database);
await writeFile(resolve(dist, '404.html'), renderPage({ title: 'A stone out of place.', eyebrow: 'Page not found', intro: 'This page has moved or does not exist. Let’s get you back to the board.', slug: '404', sections: [{ title: 'Find your next move', body: '<p><a href="index.html">Return to the home page</a> or <a href="support.html">get in touch</a> if you need a hand.</p>' }] }));
console.log(`Built ${pages.length + 2} HTML pages and local assets in ${dist}`);
