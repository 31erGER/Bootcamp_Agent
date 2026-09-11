/* Regressionstest vom 27.08.2026:
   Unter file:// koennen Modul und Startseite getrennte localStorage-Bereiche
   haben. Der Test verlangt deshalb einen postMessage-Transport fuer exakt den
   realen Fehlerfall: Modul 01 kennt 14 von 16 Aufgaben, die Startseite keine.

   VERSCHAERFT AM 11.09.2026 — der Test war zu freundlich und hat deshalb einen
   echten Fehler durchgelassen.

   Er rief `collect(['Modul_01_Grundbegriffe.html'])` mit einem FLACHEN Namen
   auf. So sah das Infosec-Bootcamp aus, in dem die Bruecke entstand: dort liegt
   alles in einem Ordner. Seit die Startseite eine Ebene hoeher liegt, traegt
   jeder Eintrag aber `src/…` — und das Kind meldet sich weiterhin als blanker
   Dateiname, denn `store.file()` liest `location.pathname`. Der Vergleich
   `data.file !== slot.file` schlug damit IMMER zu, jede Meldung wurde
   verworfen, und auf der Startseite kam kein einziger Stand an.

   Der Aufruf hier benutzt jetzt denselben Pfad, den die echte Startseite
   benutzt. Faellt der Vergleich je wieder auf den vollen Pfad zurueck, wird
   dieser Test ROT statt gruen. */

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const engineSource = fs.readFileSync(
  path.join(here, '..', 'src', 'assets', 'engine.js'),
  'utf8'
);

class MemoryStorage {
  constructor(initial = {}) { this.data = { ...initial }; }
  get length() { return Object.keys(this.data).length; }
  key(i) { return Object.keys(this.data)[i] ?? null; }
  getItem(k) { return Object.prototype.hasOwnProperty.call(this.data, k) ? this.data[k] : null; }
  setItem(k, v) { this.data[k] = String(v); }
  removeItem(k) { delete this.data[k]; }
}

function progress14of16() {
  const state = {};
  for (let id = 1; id <= 16; id++) {
    state[id] = {
      state: id <= 14 ? 'done' : 'offen',
      tries: id <= 14 ? 1 : 0,
      points: id <= 14 ? 10 : 0,
      stepsDone: 0
    };
  }
  return {
    score: 140,
    maxScore: 295,
    total: 16,
    stars: 2,
    badges: {},
    state
  };
}

function engineContext({ pathname, hash, storage, parentWindow = null, documentFactory = null }) {
  const listeners = {};
  const windowObject = {
    WB: {},
    addEventListener(type, fn) {
      (listeners[type] ||= []).push(fn);
    },
    removeEventListener(type, fn) {
      listeners[type] = (listeners[type] || []).filter(x => x !== fn);
    },
    dispatch(type, event) {
      (listeners[type] || []).slice().forEach(fn => fn(event));
    }
  };
  windowObject.window = windowObject;
  windowObject.parent = parentWindow || windowObject;

  const meta = { content: 'Infosec' };
  const documentObject = documentFactory
    ? documentFactory(windowObject)
    : {
        body: { appendChild() {} },
        querySelector(selector) {
          return selector === 'meta[name="wb-course"]' ? meta : null;
        },
        querySelectorAll() { return []; },
        createElement() { return {}; },
        dispatchEvent() {}
      };

  const location = { pathname, hash, reload() {} };
  const context = vm.createContext({
    window: windowObject,
    parent: windowObject.parent,
    document: documentObject,
    location,
    localStorage: storage,
    CustomEvent: class {},
    confirm() { return true; },
    setTimeout,
    clearTimeout,
    decodeURIComponent,
    encodeURIComponent,
    console
  });
  vm.runInContext(engineSource, context, { filename: 'engine.js' });
  return { context, window: windowObject, document: documentObject, location };
}

const fixture = progress14of16();
const moduleKey = 'wb:Infosec/Modul_01_Grundbegriffe.html:progress';

/* Teil 1: Das Modul muss seinen eigenen Stand an den Eltern-Index melden. */
const childMessages = [];
const parentReceiver = { postMessage(message) { childMessages.push(message); } };
engineContext({
  pathname: '/kurs/Modul_01_Grundbegriffe.html',
  hash: '#wb-store-bridge=testtoken',
  storage: new MemoryStorage({ [moduleKey]: JSON.stringify(fixture) }),
  parentWindow: parentReceiver
});

const childMessage = childMessages[0];
if (!childMessage || childMessage.kind !== 'wb-store-bridge' ||
    childMessage.file !== 'Modul_01_Grundbegriffe.html' ||
    childMessage.progress?.total !== 16) {
  console.error('Modulseite meldet ihren isolierten Fortschritt nicht an den Index.');
  process.exit(1);
}

/* Teil 2: Der Index muss die Meldung in SEINEN Speicher uebernehmen. */
const indexStorage = new MemoryStorage();
let frameWindow;
let indexWindow;
const parent = engineContext({
  pathname: '/kurs/startseite.html',
  hash: '',
  storage: indexStorage,
  documentFactory(win) {
    indexWindow = win;
    return {
      body: {
        appendChild(frame) {
          frameWindow = frame.contentWindow;
          setTimeout(() => {
            const token = decodeURIComponent(frame.src.split('=')[1]);
            indexWindow.dispatch('message', {
              source: frameWindow,
              data: {
                kind: 'wb-store-bridge', token,
                course: 'Infosec', file: 'Modul_01_Grundbegriffe.html',
                progress: fixture
              }
            });
          }, 0);
        },
        removeChild() {}
      },
      querySelector(selector) {
        return selector === 'meta[name="wb-course"]' ? { content: 'Infosec' } : null;
      },
      querySelectorAll() { return []; },
      createElement(tag) {
        return tag === 'iframe'
          ? { contentWindow: {}, style: {}, setAttribute() {} }
          : {};
      },
      dispatchEvent() {}
    };
  }
});

if (!parent.window.WB.storeBridge?.collect) {
  console.error('Index besitzt keinen Speicher-Transport fuer isolierte file://-Seiten.');
  process.exit(1);
}

/* Der Eintrag traegt den Ordner mit — genau wie in src/startseite.data.js.
   Das Kind meldet sich gleich darauf als blankes 'Modul_01_Grundbegriffe.html'
   (siehe documentFactory oben): der Fall, der in der Praxis auftritt. */
const changed = await new Promise(resolve => {
  parent.window.WB.storeBridge.collect(['src/Modul_01_Grundbegriffe.html'], resolve);
});
const imported = parent.window.WB.store.readFor('src/Modul_01_Grundbegriffe.html', 'progress');
const solved = imported
  ? Object.values(imported.state).filter(x => x.state !== 'offen').length
  : 0;

if (!changed || solved !== 14 || imported.total !== 16) {
  console.error(`Startseite uebernahm ${solved} von ${imported?.total || 0} statt 14 von 16 Aufgaben.`);
  console.error('Meldet das Kind einen anderen Pfad als der Eintrag, muss der Vergleich');
  console.error('in engine.js (WB.storeBridge.collect / receive) ueber store.name() laufen.');
  process.exit(1);
}

/* Gegenprobe: derselbe Dateiname, aber ein anderer KURS darf nicht durchgehen.
   Sonst schriebe die Startseite eines Kurses den Stand eines fremden Kurses in
   ihren eigenen Speicher. */
const fremd = new MemoryStorage();
let fremdFrame;
let fremdWin;
const fremdParent = engineContext({
  pathname: '/kurs/startseite.html',
  hash: '',
  storage: fremd,
  documentFactory(win) {
    fremdWin = win;
    return {
      body: {
        appendChild(frame) {
          fremdFrame = frame.contentWindow;
          setTimeout(() => {
            const token = decodeURIComponent(frame.src.split('=')[1]);
            fremdWin.dispatch('message', {
              source: fremdFrame,
              data: {
                kind: 'wb-store-bridge', token,
                course: 'EinAndererKurs', file: 'Modul_01_Grundbegriffe.html',
                progress: fixture
              }
            });
          }, 0);
        },
        removeChild() {}
      },
      querySelector(selector) {
        return selector === 'meta[name="wb-course"]' ? { content: 'Infosec' } : null;
      },
      querySelectorAll() { return []; },
      createElement(tag) {
        return tag === 'iframe' ? { contentWindow: {}, style: {}, setAttribute() {} } : {};
      },
      dispatchEvent() {}
    };
  }
});
const fremdGeaendert = await new Promise(resolve => {
  fremdParent.window.WB.storeBridge.collect(['src/Modul_01_Grundbegriffe.html'], resolve);
});
if (fremdGeaendert || fremd.length !== 0) {
  console.error('Ein Stand aus einem FREMDEN Kurs wurde uebernommen.');
  process.exit(1);
}

console.log('ERGEBNIS: GRÜN (isolierter file://-Stand 14/16 erreicht die Startseite, fremder Kurs bleibt draussen)');
