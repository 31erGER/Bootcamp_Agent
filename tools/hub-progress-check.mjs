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

// ── ERGAENZT 13.11.2026 (Agent, „Ansicht merken", auf Wunsch des Nutzers) ───
// Die Übersicht merkt sich für den Tab, welche Gruppen offen standen und wo
// gescrollt war. Der Lauf oben hat weder sessionStorage noch ein Fenster mit
// Ereignissen und belegt damit nebenbei, dass die Seite ohne beides rendert.
// `ansicht()` baut dieselbe Seite noch einmal, mit einem Tab-Speicher, einem
// Anker und einem Fenster, das mitschreibt, was hub.js von ihm will.
function ansicht({ gemerkt = null, hash = '' } = {}) {
  const eigene = Object.fromEntries(Object.keys(hosts).map(k => [k, new TestNode()]));
  const speicher = {};
  if (gemerkt) speicher['wb:ansicht'] = JSON.stringify(gemerkt);
  const fenster = {
    scrollY: 0, gescrollt: [], zuhoerer: {},
    WB: { store: { blocked: false,
      readFor: (file, suffix) => file === 'Testmodul.html' && suffix === 'progress' ? progressFixture : null } },
    scrollTo(ziel) { fenster.gescrollt.push(ziel); },
    addEventListener(name, fn) { fenster.zuhoerer[name] = fn; }
  };
  const ctx = vm.createContext({
    window: fenster,
    location: { hash, reload() {} },
    sessionStorage: {
      getItem: k => (k in speicher ? speicher[k] : null),
      setItem(k, v) { speicher[k] = String(v); }
    },
    document: {
      createElement(tag) { return new TestNode(tag); },
      querySelector(selector) { return eigene[selector] || null; }
    }
  });
  vm.runInContext(hubSource, ctx, { filename: 'hub.js' });
  fenster.WB.hub({
    groups: { 'Modul 01 · Test': { step: true }, 'Modul 02 · Test': { step: true } },
    entries: [
      { file: 'Testmodul.html', kind: 'Aufgabenheft', title: 'Testmodul', tasks: 16, points: 295, group: 'Modul 01 · Test' },
      { file: 'Spaeter.html', kind: 'Lehrkurs', title: 'Später', group: 'Modul 02 · Test' }
    ]
  });
  const g = findAllByClass(eigene['[data-hub-sheets]'], 'hubgroup');
  return {
    fenster, gruppen: g, offen: g.map(d => d.open).join(','),
    gespeichert: () => (speicher['wb:ansicht'] ? JSON.parse(speicher['wb:ansicht']) : null)
  };
}

const M1 = '0|Modul 01 · Test', M2 = '1|Modul 02 · Test';

// 1 · Ohne Gemerktes gilt die alte Regel, und es wird nicht gescrollt.
const frisch = ansicht();
// 2 · Gemerkt: aktuelle Gruppe zu, spätere offen, 640 px tief. Genau so kommt
//     die Seite wieder, obwohl der nächste Schritt in der ersten Gruppe liegt.
const wieder = ansicht({ gemerkt: { ziel: 'Testmodul.html', offen: [M2], y: 640 } });
// 3 · Beim Verlassen lag der nächste Schritt woanders: seine Gruppe steht
//     zusätzlich offen, die gemerkte bleibt offen.
const weiter = ansicht({ gemerkt: { ziel: 'Anderes.html', offen: [M2], y: 0 } });
// 4 · Verlassen der Seite schreibt, was offen steht und wo gescrollt ist.
const geht = ansicht();
geht.gruppen[1].open = true;
geht.fenster.scrollY = 312.4;
geht.fenster.zuhoerer.pagehide?.();
// 5 · Im Prüflauf stehen alle Gruppen offen, und nichts davon wird gemerkt
//     oder aus dem Gemerkten geholt.
const pruef = ansicht({ gemerkt: { ziel: 'Testmodul.html', offen: [], y: 500 }, hash: '#audit' });
pruef.fenster.zuhoerer.pagehide?.();
// 6 · Ein Anker in der Adresse hat Vorrang vor der gemerkten Stelle.
const anker = ansicht({ gemerkt: { ziel: 'Testmodul.html', offen: [M1], y: 500 }, hash: '#unten' });

const merken = [
  ['Ohne Gemerktes: nur die aktuelle Gruppe offen', frisch.offen, 'true,false'],
  ['Ohne Gemerktes: kein Scrollen', frisch.fenster.gescrollt.length, 0],
  ['Kein Zuhörer am Scrollen', Object.keys(frisch.fenster.zuhoerer).join(','), 'pagehide'],
  ['Gemerkte Gruppen kommen wieder', wieder.offen, 'false,true'],
  ['Gemerkte Stelle wird angefahren', JSON.stringify(wieder.fenster.gescrollt.map(z => [z.top, z.behavior])), '[[640,"instant"]]'],
  ['Neuer nächster Schritt: seine Gruppe steht zusätzlich offen', weiter.offen, 'true,true'],
  ['Verlassen speichert die Ansicht', JSON.stringify(geht.gespeichert()),
    JSON.stringify({ ziel: 'Testmodul.html', offen: [M1, M2], y: 312 })],
  ['Prüflauf: alle Gruppen offen', pruef.offen, 'true,true'],
  ['Prüflauf: kein Scrollen', pruef.fenster.gescrollt.length, 0],
  ['Prüflauf: Gemerktes bleibt unangetastet', JSON.stringify(pruef.gespeichert()),
    JSON.stringify({ ziel: 'Testmodul.html', offen: [], y: 500 })],
  ['Anker: Gruppen ja, Scrollen nein', anker.offen + '/' + anker.fenster.gescrollt.length, 'true,false/0']
];
for (const [label, actual, expected] of merken) {
  if (actual !== expected) {
    failures += 1;
    console.error(`${label}: erwartet ${expected}, erhalten ${actual ?? 'kein Wert'}`);
  }
}

if (failures) {
  console.error(`\nERGEBNIS: ROT (${failures} Abweichungen)`);
  process.exit(1);
}

// Erfolgsmeldung am 12.11.2026 um die neuen Regeln ergänzt (Agent, Redesign),
// am 13.11.2026 um die gemerkte Ansicht.
console.log('ERGEBNIS: GRÜN (alle Balken zeigen 14 von 16 Aufgaben = 88 %; ' +
  'Weiter-Karte, offene Gruppe und markierte Zeile zeigen auf denselben Schritt; ' +
  'gemerkte Ansicht kommt wieder)');
