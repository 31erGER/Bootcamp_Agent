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

/* ── ERGAENZT 13.11.2026 (Agent, Redesign der Seiten) ─────────────────────────
   Kapitelhaken im Artikel und Haken an den Etappen im Lab. Die vier Prüfungen
   oben laufen unverändert und belegen, dass eine Leseseite OHNE Kapitel weiter
   genau { percent, done } schreibt.

   `seite()` ist ein zweites, reicheres Mini-DOM: Kapitel mit einstellbarer
   Unterkante, Einträge der Seitenleiste, `.etappe-ende` mit dem Haken, den
   lehrkurs.js hineinbaut, und ein WB.weg, das nur mitschreibt.               */

/* Die Listen im Stand entstehen im vm-Kontext und haben dort einen eigenen
   Array-Prototyp; deepEqual hält sie deshalb für ungleich, obwohl jeder Wert
   stimmt. Einmal durch JSON, dann vergleicht es Werte. */
const flach = value => JSON.parse(JSON.stringify(value));

function klassen() {
  const set = new Set();
  return {
    set,
    toggle(name, on) { if (on === undefined ? !set.has(name) : on) set.add(name); else set.delete(name); return set.has(name); },
    add(name) { set.add(name); }, remove(name) { set.delete(name); },
    contains(name) { return set.has(name); },
  };
}

function seite({ saved = null, kapitel = ['k0', 'k1', 'k2'], etappen = [], height = 11000, viewport = 1000 } = {}) {
  const listeners = {};
  const writes = [];
  const doc = { scrollHeight: height, clientHeight: viewport, scrollTop: 0 };
  const bar = { values: {},
    style: { setProperty(key, value) { bar.values[key] = value; } },
    setAttribute(key, value) { bar.values[key] = value; },
    querySelector() { return { set textContent(value) { bar.values.label = value; } }; } };
  const unten = {};
  const chapters = kapitel.map(id => ({
    id, classList: klassen(),
    getBoundingClientRect: () => ({ bottom: unten[id] }),
    querySelector: sel => ({ textContent: (sel === 'h2' ? 'Titel ' : 'Marke ') + id }),
  }));
  const links = kapitel.map(id => ({ id, classList: klassen(), getAttribute: () => '#' + id }));
  const enden = etappen.map(id => {
    const kap = chapters.find(c => c.id === id);
    const ende = { classList: klassen(), closest: () => kap, haken: null,
      appendChild(label) { ende.haken = label.children[0]; ende.text = label.children[1]; } };
    return ende;
  });
  const karten = { kopf: [], schluss: [] };
  const weiter = { label: 'Als nächstes', title: 'nächste Seite' };
  const WB = {
    store: { read: () => saved, write(key, value) { writes.push({ key, ...value }); } },
    weg: { kopf(d) { karten.kopf.push(d); }, schluss(d) { karten.schluss.push(d); }, naechsteSeite: () => weiter },
  };
  runInNewContext(source, {
    WB,
    window: { innerHeight: viewport, addEventListener(name, callback) { listeners[name] = callback; } },
    document: {
      readyState: 'complete', documentElement: doc,
      createElement: () => ({ children: [], checked: false,
        appendChild(kind) { this.children.push(kind); },
        addEventListener(name, callback) { this['on' + name] = callback; } }),
      querySelectorAll(selector) {
        if (selector === '[data-read-progress]') return [bar];
        if (selector === '.chapter[id]') return chapters;
        if (selector === '.etappe-ende') return enden;
        if (selector === '.rail .nav__task[href^="#"]') return links;
        return [];
      },
    },
  });
  const fertig = id => links.find(l => l.id === id).classList.contains('is-done');
  return { bar, writes, listeners, karten, weiter, unten, enden, fertig,
    scroll(top) { doc.scrollTop = top; listeners.scroll(); },
    hake(i, an = true) { enden[i].haken.checked = an; enden[i].haken.onchange(); } };
}

test('Artikel: ein Kapitel gilt als gelesen, wenn sein Ende durchs Fenster kam — nicht beim Laden und nicht beim Überspringen', () => {
  const page = seite();
  /* Beim Laden steht k0 schon ganz im Bild. Gelesen ist es damit nicht. */
  Object.assign(page.unten, { k0: 600, k1: 3000, k2: 6000 });
  assert.equal(page.fertig('k0'), false);
  assert.equal(page.writes.length, 0);
  /* Sprung ans Ende von k2: k0 und k1 liegen ÜBER dem Fenster, nicht darin. */
  Object.assign(page.unten, { k0: -5400, k1: -3000, k2: 500 });
  page.scroll(6000);
  assert.deepEqual([page.fertig('k0'), page.fertig('k1'), page.fertig('k2')], [false, false, true]);
  assert.deepEqual(flach(page.writes.at(-1)), { key: 'read', percent: 60, done: false, kapitel: ['k2'] });
});

test('Artikel: wer wiederkommt, bekommt das erste ungelesene Kapitel im Kopf und die nächste Seite am Ende', () => {
  const page = seite({ saved: { percent: 40, done: false, kapitel: ['k0'] } });
  assert.equal(page.fertig('k0'), true);
  assert.equal(page.karten.kopf.at(-1).href, '#k1');
  assert.equal(page.karten.kopf.at(-1).title, 'Titel k1');
  assert.equal(page.karten.schluss.at(-1), page.weiter);
  /* Erster Besuch: kein Sprungziel im Kopf. Ein fertiger Altstand ohne
     Kapitelliste: alles gelesen, also auch keins. */
  assert.equal(seite().karten.kopf.at(-1), null);
  const alt = seite({ saved: { percent: 95, done: true } });
  assert.equal(alt.karten.kopf.at(-1), null);
  assert.equal(alt.fertig('k2'), true);
});

/* GEAENDERT 13.11.2026, zweite Fassung (Agent, auf Wunsch des Nutzers:
   „Scrollen reicht"). Die erste Fassung dieser beiden Prüfungen verlangte,
   dass der Stand eines Labs die Zahl der Haken ist. Jetzt verlangen sie das
   Gegenteil: fertig macht das Scrollen, die Haken sind Anzeige. */
test('Lab: fertig wird es durch Scrollen; die Haken sind Anzeige und ändern den Stand nicht', () => {
  const page = seite({ etappen: ['k0', 'k1'] });
  assert.equal(page.bar.values.label, '0%');
  assert.equal(page.karten.kopf.at(-1), null);
  assert.equal(page.karten.schluss.at(-1), page.weiter);
  /* Ein Haken färbt die Etappe und nennt im Kopf die nächste offene. */
  page.hake(0);
  assert.deepEqual(flach(page.writes.at(-1)), { key: 'read', percent: 0, done: false, etappen: ['k0'] });
  assert.equal(page.fertig('k0'), true);
  assert.equal(page.karten.kopf.at(-1).href, '#k1');
  /* Alle Haken gesetzt: das Lab ist damit NICHT fertig. */
  page.hake(1);
  assert.deepEqual(flach(page.writes.at(-1)), { key: 'read', percent: 0, done: false, etappen: ['k0', 'k1'] });
  assert.equal(page.karten.kopf.at(-1), null);
  /* Durchgescrollt: fertig. Ein zurückgenommener Haken ändert daran nichts. */
  page.scroll(9000);
  assert.deepEqual(flach(page.writes.at(-1)), { key: 'read', percent: 90, done: true, etappen: ['k0', 'k1'] });
  assert.equal(page.bar.values.label, '90%');
  page.hake(0, false);
  assert.deepEqual(flach(page.writes.at(-1)), { key: 'read', percent: 90, done: true, etappen: ['k1'] });
  assert.equal(page.karten.schluss.length, 1);
});

test('Lab: Scrollen hakt nichts ab; gespeicherte Haken kommen wieder', () => {
  /* Ohne einen einzigen Haken bis unten: fertig, und keine Etappe ist grün. */
  const ohne = seite({ etappen: ['k0', 'k1'] });
  Object.assign(ohne.unten, { k0: 100, k1: 500 });
  ohne.scroll(9500);
  assert.deepEqual(flach(ohne.writes.at(-1)), { key: 'read', percent: 95, done: true, etappen: [] });
  assert.deepEqual([ohne.fertig('k0'), ohne.fertig('k1')], [false, false]);
  /* Ein fertiger Stand ohne Hakenliste setzt keine Haken. */
  const fertig = seite({ etappen: ['k0', 'k1'], saved: { percent: 95, done: true } });
  assert.deepEqual(fertig.enden.map(e => e.haken.checked), [false, false]);
  assert.equal(fertig.karten.kopf.at(-1), null);
  assert.equal(fertig.writes.length, 0);
  /* Gesetzte Haken stehen beim Wiederkommen da, mit Sprungziel im Kopf. */
  const halb = seite({ etappen: ['k0', 'k1'], saved: { percent: 40, done: false, etappen: ['k0'] } });
  assert.deepEqual(halb.enden.map(e => e.haken.checked), [true, false]);
  assert.equal(halb.fertig('k0'), true);
  assert.equal(halb.karten.kopf.at(-1).href, '#k1');
  assert.equal(halb.writes.length, 0);
});
