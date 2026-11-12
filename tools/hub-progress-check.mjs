import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const hubSource = fs.readFileSync(path.join(here, '..', 'src', 'assets', 'hub.js'), 'utf8');

class TestNode {
  constructor(tag = 'div') {
    this.tagName = tag.toUpperCase();
    this.children = [];
    this.className = '';
    this.textContent = '';
    this.innerHTML = '';
    this.style = {};
    this.hidden = false;
  }

  appendChild(child) {
    this.children.push(child);
    return child;
  }
}

function findByClass(root, className) {
  if (String(root.className).split(/\s+/).includes(className)) return root;
  for (const child of root.children) {
    const found = findByClass(child, className);
    if (found) return found;
  }
  return null;
}

function visibleText(root) {
  return [root.textContent, ...root.children.map(visibleText)].join(' ');
}

// ERGAENZT 12.11.2026 (Agent, Redesign der Übersicht): alle Knoten mit einer
// Klasse, nicht nur der erste. Gebraucht für „genau EINE Zeile ist markiert".
function findAllByClass(root, className, out = []) {
  if (String(root.className).split(/\s+/).includes(className)) out.push(root);
  for (const child of root.children) findAllByClass(child, className, out);
  return out;
}

const hosts = {
  '[data-hub-head]': new TestNode('header'),
  '[data-hub-user]': new TestNode('section'),
  '[data-store-warning]': new TestNode('div'),
  '[data-hub-sheets]': new TestNode('div'),
  '[data-hub-badges]': new TestNode('div')
};

const progressFixture = {
  score: 140,
  maxScore: 295,
  // Simuliert Modul 01 mit 14 gelösten Aufgaben und einer veralteten Gesamtzahl.
  total: 15,
  stars: 2,
  badges: {},
  state: Object.fromEntries(Array.from({ length: 16 }, (_, i) => [i + 1, {
    state: i < 14 ? 'done' : 'offen',
    tries: i < 14 ? 1 : 0,
    points: i < 14 ? 10 : 0,
    stepsDone: 0
  }]))
};

let collectedFiles = null;
const context = vm.createContext({
  window: {
    WB: {
      store: {
        blocked: false,
        readFor(file, suffix) {
          return file === 'Testmodul.html' && suffix === 'progress' ? progressFixture : null;
        }
      },
      // Regression vom 27.08.2026: Auch die Indexseite muss die file://-Brücke
      // tatsächlich für ihre bewertbaren Blätter anstoßen.
      storeBridge: {
        collect(files, done) {
          collectedFiles = files;
          done(false);
        }
      }
    }
  },
  location: { reload() {} },
  document: {
    createElement(tag) { return new TestNode(tag); },
    querySelector(selector) { return hosts[selector] || null; }
  }
});

vm.runInContext(hubSource, context, { filename: 'hub.js' });
context.window.WB.hub({
  kicker: 'Test',
  headline: 'Test',
  groups: { 'Modul 01 · Test': { step: true }, 'Modul 02 · Test': { step: true } },
  entries: [{
    file: 'Testmodul.html',
    id: 'M01',
    kind: 'Aufgabenheft',
    title: 'Testmodul',
    desc: 'Sechzehn Aufgaben',
    tasks: 16,
    points: 295,
    group: 'Modul 01 · Test'
  },
  // ERGAENZT 12.11.2026 (Agent, Redesign der Übersicht): zwei Leseseiten ohne
  // Stand. Sie zählen nicht in die Balken (kein `points`), die drei Prüfungen
  // von oben bleiben also bei 88 %. Gebraucht werden sie für die neuen Regeln:
  // welche Gruppe offen steht und welche Zeile markiert ist.
  {
    file: 'Testlab.html',
    kind: 'Lab',
    title: 'Testlab',
    group: 'Modul 01 · Test'
  }, {
    file: 'Spaeter.html',
    kind: 'Lehrkurs',
    title: 'Später',
    group: 'Modul 02 · Test'
  }]
});

const checks = [
  ['Gesamtbalken', findByClass(hosts['[data-hub-user]'], 'xpbar')?.children[0]?.style.width, '88%'],
  ['Modulkarte', findByClass(hosts['[data-hub-sheets]'], 'sheetcard__bar')?.children[0]?.style.width, '88%'],
  ['Gruppenbalken', findByClass(hosts['[data-hub-sheets]'], 'hubgroup__bar')?.children[0]?.style.width, '88%']
];

let failures = 0;
for (const [label, actual, expected] of checks) {
  if (actual !== expected) {
    failures += 1;
    console.error(`${label}: erwartet ${expected}, erhalten ${actual ?? 'kein Wert'}`);
  }
}

const progressText = visibleText(findByClass(hosts['[data-hub-user]'], 'userpanel__xp'));
if (!progressText.includes('14 von 16 Aufgaben')) {
  failures += 1;
  console.error('Gesamtanzeige: erwartete Aufgabenangabe „14 von 16 Aufgaben“');
}

if (collectedFiles?.join(',') !== 'Testmodul.html') {
  failures += 1;
  console.error('Speicherbrücke: Testmodul.html wurde nicht vom Hub eingesammelt.');
}

// ── ERGAENZT 12.11.2026 (Agent, Redesign der Übersicht) ─────────────────────
// Seit dem Redesign hängen drei Stellen am selben „nächsten Schritt": die
// Weiter-Karte, die Gruppe, die offen steht, und die markierte Zeile. Laufen
// sie auseinander, empfiehlt die Seite oben etwas anderes, als sie unten
// zeigt, und kein Balken fällt deshalb um. Der nächste Schritt ist hier das
// angefangene Testmodul (14 von 16), nicht das unberührte Testlab daneben.
const gruppen = findAllByClass(hosts['[data-hub-sheets]'], 'hubgroup');
const markiert = findAllByClass(hosts['[data-hub-sheets]'], 'is-next');
const wo = visibleText(findByClass(hosts['[data-hub-user]'], 'resume__where') || new TestNode());
const redesign = [
  ['Gruppen', gruppen.length, 2],
  ['Gruppe mit dem nächsten Schritt steht offen', gruppen[0]?.open, true],
  ['Spätere Gruppe ist zugeklappt', gruppen[1]?.open, false],
  ['Gruppe mit dem nächsten Schritt ist markiert', String(gruppen[0]?.className).includes('is-current'), true],
  ['Genau eine Zeile ist markiert', markiert.length, 1],
  ['Markiert ist das angefangene Blatt', visibleText(markiert[0] || new TestNode()).includes('Weitermachen'), true],
  ['Zeilen in der ersten Gruppe', findAllByClass(gruppen[0] || new TestNode(), 'hubrow').length, 2],
  ['Weiter-Karte nennt die Stelle', wo.includes('Teil 1 von 2') && wo.includes('Aufgabenheft'), true]
];
for (const [label, actual, expected] of redesign) {
  if (actual !== expected) {
    failures += 1;
    console.error(`${label}: erwartet ${expected}, erhalten ${actual ?? 'kein Wert'}`);
  }
}

if (failures) {
  console.error(`\nERGEBNIS: ROT (${failures} Abweichungen)`);
  process.exit(1);
}

// Erfolgsmeldung am 12.11.2026 um die neuen Regeln ergänzt (Agent, Redesign).
console.log('ERGEBNIS: GRÜN (alle Balken zeigen 14 von 16 Aufgaben = 88 %; ' +
  'Weiter-Karte, offene Gruppe und markierte Zeile zeigen auf denselben Schritt)');
