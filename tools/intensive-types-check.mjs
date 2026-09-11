import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const source = fs.readFileSync(path.join(here, '..', 'src', 'assets', 'engine.js'), 'utf8');

const document = {
  body: null,
  querySelector() { return null; },
  querySelectorAll() { return []; },
  addEventListener() {},
  removeEventListener() {},
  dispatchEvent() {},
  createElement() { return {}; }
};
const window = {
  WB: {},
  parent: null,
  addEventListener() {},
  removeEventListener() {}
};
window.parent = window;

vm.runInContext(source, vm.createContext({
  window,
  document,
  location: { pathname: '/selbsttest.html', hash: '', search: '' },
  localStorage: {
    length: 0,
    getItem() { return null; },
    setItem() {},
    removeItem() {},
    key() { return null; }
  },
  CustomEvent: class {},
  URLSearchParams,
  setTimeout,
  clearTimeout,
  console
}), { filename: 'engine.js' });

const { WB } = window;
assert.equal(WB.grade.result({ fields: [
  { kind: 'number', answer: 23.8, tol: 0.05 },
  { kind: 'hex', answer: 'AF' },
  { kind: 'text', answer: 'Tampering', aliases: ['T'] }
] }, ['23,8', '0xaf', 't']), 1);

assert.equal(WB.grade.result({ fields: [
  { kind: 'number', answer: 7, tol: 0 }
] }, ['']), 0);

assert.deepEqual(
  Array.from(WB.solutionFor({ type: 'result', fields: [
    { answer: 7 }, { answer: 'AF' }
  ] })),
  [7, 'AF']
);

assert.deepEqual(
  Array.from(WB.solutionFor({ type: 'paper', checklist: ['Elemente', 'Flüsse'] })),
  [true, true]
);

/* Regression: Klausurnahe Ergebnisaufgaben sollen im Lernmodul genau einen
   zweiten Versuch erlauben, ohne die echte Probeklausur aufzuweichen. */
assert.equal(WB.allowsRetry({ type: 'result', exam: true }, 0, 0, false), true);
assert.equal(WB.allowsRetry({ type: 'result', exam: true }, 0, 1, false), false);
assert.equal(WB.allowsRetry({ type: 'result', exam: true }, 1, 0, false), false);
assert.equal(WB.allowsRetry({ type: 'result', exam: true }, 0, 0, true), false);
assert.equal(WB.allowsRetry({ type: 'result', exam: true, retry: false }, 0, 0, false), false);
assert.equal(WB.allowsRetry({ type: 'paper', exam: true }, 0, 0, false), false);
assert.equal(WB.allowsRetry({ type: 'choice', exam: true }, 0, 0, false), false);
assert.equal(WB.allowsRetry({ type: 'choice' }, 0, 0, false), true);

console.log('ERGEBNIS: GRÜN (Bewertung und Zweitversuch-Regeln sind korrekt)');
