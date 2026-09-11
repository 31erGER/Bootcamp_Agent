/* ============================================================================
   probeklausur-quality-check.mjs — hält die Probeklausur ihre eigenen Regeln ein?
   ---------------------------------------------------------------------------
   NUR FÜR DIE KLAUSURPHASE. Eine Probeklausur ist der einzige Ort im Bootcamp,
   an dem das Blatt VOR der Abgabe nichts verraten darf. Genau das kann der
   Selbstlauf nicht prüfen: er beantwortet alles, löst damit die Auto-Abgabe aus
   und sieht nur Endzustände. Ein einziges `hint` oder `formula` in den Daten
   fällt ihm deshalb nicht auf — sichtbar wäre es nur beim Lösen von Hand.

   Dieses Werkzeug prüft am Datenobjekt, und zwar zwei Klassen von Regeln:

   1. Rahmenwerksregeln — gelten in jedem Kurs und stehen unten im Code.
   2. Kurserwartungen — Dauer, Punkte, Aufgabenzahl, Fachabdeckung. Sie stehen
      in `tools/klausurphase.config.mjs`, nicht hier.

   Ohne Konfiguration (Bootcamp ohne Klausur) endet der Lauf GRÜN, ohne zu
   prüfen. Aufruf: node tools/probeklausur-quality-check.mjs
   ============================================================================ */

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { probeklausur } from './klausurphase.config.mjs';

const cfg = probeklausur || null;
if (!cfg || !cfg.datei) {
  console.log('ERGEBNIS: GRÜN (keine Probeklausur konfiguriert — kein Klausurkontext)');
  process.exit(0);
}

const here = path.dirname(fileURLToPath(import.meta.url));
/* `cfg.datei` darf einen Unterordner enthalten — die Probeklausur liegt im
   Showcase in `src/Klausurphase/`, damit sie als Ganzes löschbar ist. */
const file = path.join(here, '..', 'src', ...cfg.datei.split('/'));

if (!fs.existsSync(file)) {
  console.error(`FEHLT ${cfg.datei}: Datei nicht gefunden`);
  console.error('\nERGEBNIS: ROT (1 Verstoß gegen Klausurbedingungen)');
  process.exit(1);
}

let sheet;
vm.runInContext(fs.readFileSync(file, 'utf8'), vm.createContext({
  WB: { register(value) { sheet = value; } }
}), { filename: file });

if (!sheet) throw new Error(`${cfg.datei} meldet kein Aufgabenblatt an`);

const tasks = sheet.parts.flatMap(part => part.tasks);
const failures = [];
const fail = message => failures.push(message);
const text = JSON.stringify(tasks).toLocaleLowerCase('de-DE');

/* ── 1 · Kurserwartungen aus der Konfiguration ───────────────────────────── */

if (cfg.minuten !== undefined && sheet.klausur?.minuten !== cfg.minuten) {
  fail(`Klausurdauer muss ${cfg.minuten} Minuten betragen, hinterlegt: ${sheet.klausur?.minuten}`);
}
if (cfg.bestehen !== undefined && sheet.klausur?.bestehen !== cfg.bestehen) {
  fail(`Bestehensgrenze muss ${cfg.bestehen} Punkte sein, hinterlegt: ${sheet.klausur?.bestehen}`);
}
if (cfg.gesamt !== undefined && sheet.klausur?.gesamt !== cfg.gesamt) {
  fail(`Klausur muss auf ${cfg.gesamt} Punkte ausgelegt sein, hinterlegt: ${sheet.klausur?.gesamt}`);
}
if (cfg.aufgaben !== undefined && tasks.length !== cfg.aufgaben) {
  fail(`Klausur muss exakt ${cfg.aufgaben} Aufgaben enthalten, gefunden: ${tasks.length}`);
}

const points = tasks.reduce((sum, task) => sum + (task.punkte || 0), 0);
if (cfg.gesamt !== undefined && points !== cfg.gesamt) {
  fail(`Aufgaben ergeben ${points} statt ${cfg.gesamt} Punkte`);
}

for (const [id, expected] of Object.entries(cfg.punkte || {})) {
  const task = tasks.find(candidate => String(candidate.id) === String(id));
  if (!task) fail(`Pflichtaufgabe ${id} fehlt`);
  else if (task.punkte !== expected) fail(`Aufgabe ${id}: ${task.punkte} statt ${expected} Punkte`);
}

for (const [label, terms] of cfg.abdeckung || []) {
  const missing = terms.filter(term => !text.includes(String(term).toLocaleLowerCase('de-DE')));
  if (missing.length) fail(`${label}: fehlt ${missing.join(', ')}`);
}

/* ── 2 · Rahmenwerksregeln ───────────────────────────────────────────────────
   Diese gelten in jedem Kurs und sind der Grund, warum das Werkzeug existiert. */

/* 2a — kein eingeblendeter Rechenweg. `formula` und `hint` sind Lernblatt-
   Felder; in einer Klausur stehen sie vor der Abgabe im DOM und verraten den
   Weg. Gesucht wird rekursiv, weil beide Felder in Schritten und Feldern tief
   verschachtelt auftreten können. */
function visit(value, pathParts = []) {
  if (!value || typeof value !== 'object') return;
  for (const [key, child] of Object.entries(value)) {
    const childPath = pathParts.concat(key);
    if (key === 'formula' || key === 'hint') {
      fail(`${childPath.join('.')}: Rechenweg/Hinweis ist vor der Abgabe hinterlegt`);
    }
    visit(child, childPath);
  }
}
visit(tasks, ['tasks']);

/* 2b — geführte Typen und Wiedererkennen gehören nicht in eine Klausur, und
   jede Aufgabe braucht eine nachprüfbare Quelle. */
const unsuitable = new Set(cfg.ungeeigneteTypen || ['calc', 'estimate', 'hotspot', 'dnd']);
for (const task of tasks) {
  if (unsuitable.has(task.type)) {
    fail(`Aufgabe ${task.id}: Aufgabentyp ${task.type} ist zu geführt oder prüft nur Wiedererkennen`);
  }
  if (!task.source) fail(`Aufgabe ${task.id}: prüfbare Quellenangabe fehlt`);
  if (task.punkte === undefined) fail(`Aufgabe ${task.id}: im Klausurmodus fehlt punkte`);
}

/* 2c — Ergebnisaufgaben sind der Kern einer Klausursimulation. */
const resultTasks = tasks.filter(task => task.type === 'result');
const mindestens = cfg.mindestensErgebnisaufgaben ?? 0;
if (resultTasks.length < mindestens) {
  fail(`Nur ${resultTasks.length} von mindestens ${mindestens} Aufgaben verlangen selbst berechnete Endergebnisse`);
}
for (const task of resultTasks) {
  if (!Array.isArray(task.fields) || !task.fields.length) fail(`Aufgabe ${task.id}: Ergebnisfelder fehlen`);
  if (!Array.isArray(task.solution) || !task.solution.length) fail(`Aufgabe ${task.id}: geprüfter Musterweg fehlt`);
  const verified = new Set((task.verify || []).map(rule => rule.field));
  (task.fields || []).forEach((field, index) => {
    if ((field.kind === 'number' || field.kind === 'hex') && !verified.has(index)) {
      fail(`Aufgabe ${task.id}, Feld ${index + 1}: unabhängige Rechenprüfung fehlt`);
    }
  });
}

if (failures.length) {
  failures.forEach(message => console.error('FEHLT ' + message));
  console.error(`\nERGEBNIS: ROT (${failures.length} Verstöße gegen Klausurbedingungen)`);
  process.exit(1);
}

console.log(`ERGEBNIS: GRÜN (${tasks.length} Aufgaben, ${points} Punkte, ${resultTasks.length} Ergebnisaufgaben, keine eingeblendeten Rechenwege)`);
