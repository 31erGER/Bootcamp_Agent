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
  groups: { 'Modul 01 · Test': { step: true } },
  entries: [{
    file: 'Testmodul.html',
    id: 'M01',
    kind: 'Aufgabenheft',
    title: 'Testmodul',
    desc: 'Sechzehn Aufgaben',
    tasks: 16,
    points: 295,
    group: 'Modul 01 · Test'
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

if (failures) {
  console.error(`\nERGEBNIS: ROT (${failures} Abweichungen)`);
  process.exit(1);
}

console.log('ERGEBNIS: GRÜN (alle Balken zeigen 14 von 16 Aufgaben = 88 %)');
