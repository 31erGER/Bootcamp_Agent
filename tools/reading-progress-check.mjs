// Verhalten und DOM-Arbeit des echten Lehrkurs-Skripts, ohne Browser-Mocks für Timing.
// Aufruf: node tools/reading-progress-check.mjs
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { test } from 'node:test';

const source = readFileSync(new URL('../src/assets/lehrkurs.js', import.meta.url), 'utf8');

function article({ saved = null, barCount = 1, height = 11000, viewport = 1000 } = {}) {
  const listeners = {};
  const writes = [];
  const doc = { scrollHeight: height, clientHeight: viewport, scrollTop: 0 };
  let mutations = 0;
  const bars = Array.from({ length: barCount }, () => {
    const values = {};
    const label = { set textContent(value) { mutations++; values.label = value; } };
    return {
      values,
      style: { setProperty(key, value) { mutations++; values[key] = value; } },
      setAttribute(key, value) { mutations++; values[key] = value; },
      querySelector() { return label; },
    };
  });
  const WB = { store: {
    read: () => saved,
    write(key, value) { writes.push({ key, ...value }); },
  } };
  runInNewContext(source, {
    WB,
    window: { addEventListener(name, callback) { listeners[name] = callback; } },
    document: {
      readyState: 'complete', documentElement: doc,
      querySelectorAll(selector) { return selector === '[data-read-progress]' ? bars : []; },
    },
  });
  return { bars, writes, listeners, doc, mutations: () => mutations,
    scroll(top) { doc.scrollTop = top; listeners.scroll(); } };
}

test('100 Scrollereignisse innerhalb derselben Prozentstufe erzeugen keine DOM-Schreibzugriffe', () => {
  const page = article({ barCount: 2 });
  const initial = page.mutations();
  for (let n = 0; n < 100; n++) page.scroll(n % 40);
  assert.equal(page.mutations(), initial);
  assert.equal(page.writes.length, 0);
  page.scroll(100);
  for (const bar of page.bars) {
    assert.equal(bar.values['--read'], '1%');
    assert.equal(bar.values['aria-valuenow'], '1');
    assert.equal(bar.values.label, '1%');
  }
});

test('90-Prozent-Abschluss und bester Stand überleben Zurückscrollen und erneutes Öffnen', () => {
  const page = article({ saved: { percent: 80, done: false } });
  page.scroll(8900);
  assert.equal(page.writes.at(-1).done, false);
  page.scroll(9000);
  assert.deepEqual(page.writes.at(-1), { key: 'read', percent: 90, done: true });
  const savedCount = page.writes.length;
  page.scroll(1000);
  assert.equal(page.bars[0].values.label, '10%');
  assert.equal(page.writes.length, savedCount);
  const reopened = article({ saved: { percent: 90, done: true } });
  reopened.scroll(5000);
  assert.equal(reopened.writes.length, 0);
});

test('Resize berechnet neu; kurze Seiten sind sofort vollständig gelesen', () => {
  const page = article();
  page.scroll(5000);
  assert.equal(page.bars[0].values.label, '50%');
  page.doc.scrollHeight = 21000;
  page.listeners.resize();
  assert.equal(page.bars[0].values.label, '25%');
  const short = article({ height: 800, viewport: 1000 });
  assert.equal(short.bars[0].values.label, '100%');
  assert.equal(short.writes[0].done, true);
});

test('Ohne Lesebalken werden keine Scroll-Listener registriert', () => {
  const page = article({ barCount: 0 });
  assert.equal(page.listeners.scroll, undefined);
  assert.equal(page.writes.length, 0);
});
