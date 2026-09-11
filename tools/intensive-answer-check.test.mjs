import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const checker = path.join(here, 'intensive-answer-check.mjs');

const valid = spawnSync(process.execPath, [checker, path.join(here, 'fixtures', 'intensive-answer-valid.data.js')], { encoding: 'utf8' });
assert.equal(valid.status, 0, valid.stdout + valid.stderr);

const invalid = spawnSync(process.execPath, [checker, path.join(here, 'fixtures', 'intensive-answer-invalid.data.js')], { encoding: 'utf8' });
assert.equal(invalid.status, 1, invalid.stdout + invalid.stderr);
assert.match(invalid.stdout + invalid.stderr, /Aufgabe 1.*Feld 1.*erwartet 1.*gespeichert 2/s);

const missing = spawnSync(process.execPath, [checker, path.join(here, 'fixtures', 'intensive-answer-missing.data.js')], { encoding: 'utf8' });
assert.equal(missing.status, 1, missing.stdout + missing.stderr);
assert.match(missing.stdout + missing.stderr, /Aufgabe 1.*Feld 1.*keine unabhängige Prüfung/s);

console.log('ERGEBNIS: GRÜN (gültige Werte akzeptiert, Mutation erkannt)');
