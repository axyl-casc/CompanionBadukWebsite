import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import { runInNewContext } from 'node:vm';

const source = await readFile(new URL('../site/app.js', import.meta.url), 'utf8');
let now = new Date(2026, 9, 23, 5, 59);
let tick;
const events = {};
const label = { textContent: '' };
const note = { hidden: true };
const document = {
  hidden: false,
  documentElement: { dataset: {} },
  querySelector: (selector) => ({ '.hero-stage': {}, '[data-scene-label]': label, '.scene-note': note })[selector] ?? null,
  querySelectorAll: () => [],
  addEventListener: (name, callback) => { events[name] = callback; },
};
runInNewContext(source, {
  document,
  window: { addEventListener: (name, callback) => { events[name] = callback; } },
  Date: class extends Date { constructor() { super(now); } },
  setInterval: (callback, delay) => { assert.equal(delay, 60_000); tick = callback; },
});
assert.equal(document.documentElement.dataset.scene, 'night', 'Initialize using local time');
assert.equal(note.hidden, false);

for (const [hour, minute, expected] of [
  [6, 0, 'day'], [16, 59, 'day'], [17, 0, 'dusk'], [19, 59, 'dusk'],
  [20, 0, 'night'], [23, 59, 'night'], [0, 0, 'night'], [5, 59, 'night'],
]) {
  now = new Date(2026, 9, 23, hour, minute);
  tick();
  assert.equal(document.documentElement.dataset.scene, expected, `${hour}:${minute} local time`);
  assert.ok(label.textContent.length > 0);
}

document.hidden = true;
now = new Date(2026, 9, 23, 12);
tick();
assert.equal(document.documentElement.dataset.scene, 'night', 'Skip polling hidden tabs');
document.hidden = false;
events.visibilitychange();
assert.equal(document.documentElement.dataset.scene, 'day', 'Refresh immediately when returning to a tab');
now = new Date(2026, 9, 23, 18);
events.pageshow();
assert.equal(document.documentElement.dataset.scene, 'dusk', 'Refresh after restoring a cached page');

const css = await readFile(new URL('../site/styles.css', import.meta.url), 'utf8');
for (const [, asset] of css.matchAll(/url\(['"]?(assets\/bg\/[^)'"\s]+)/g)) {
  await access(resolve(import.meta.dirname, '../site', asset));
}
console.log('Checked local-time scene boundaries, midnight, background-tab resume, cached-page restore, and background assets.');
