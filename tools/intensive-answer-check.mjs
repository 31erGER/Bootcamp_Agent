/* ============================================================================
   intensive-answer-check.mjs — Endergebnisse unabhängig nachrechnen
   ---------------------------------------------------------------------------
   Aufgaben vom Typ `result` zeigen vor der Abgabe keinen Rechenweg. Damit ist
   die im Datenfeld hinterlegte Zahl die einzige Wahrheit, die das Blatt kennt —
   und ein Tippfehler darin fällt niemandem auf, weil der Selbstlauf genau diese
   Zahl einträgt und sich selbst bestätigt. Deshalb rechnet dieses Werkzeug jedes
   numerische und hexadezimale Ergebnis mit einer ZWEITEN, vom Blatt unabhängigen
   Implementierung nach.

   Vertrag: jedes Feld mit `kind: 'number'` oder `kind: 'hex'` braucht eine
   Prüfregel in `task.verify`, sonst ist der Lauf ROT.

     verify: [{ field: 0, kind: 'quotient', args: [93600, 3] }]

   `field` ist der Index in `task.fields`, `kind` die Rechenmethode, `args` ihre
   Eingaben, `output` bei mehrwertigen Methoden die gewünschte Komponente.

   ERWEITERN: unten in `compute()` stehen zuerst die kursunabhängigen Methoden
   des Rahmenwerks, danach ein markierter Block für die Fachmethoden eines
   Kurses. Neue Fachmethoden kommen in diesen Block und NICHT in den oberen.
   Aufruf:  node tools/intensive-answer-check.mjs Stylevorgabe/Intensiv_*.data.js
   ============================================================================ */

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

function asBigInt(value) {
  return typeof value === 'bigint' ? value : BigInt(String(value));
}

export function modPow(base, exponent, modulus) {
  let b = asBigInt(base) % asBigInt(modulus);
  let e = asBigInt(exponent);
  const m = asBigInt(modulus);
  let result = 1n;
  while (e > 0n) {
    if (e & 1n) result = (result * b) % m;
    b = (b * b) % m;
    e >>= 1n;
  }
  return result;
}

export function egcd(a, b) {
  let oldR = asBigInt(a), r = asBigInt(b);
  let oldS = 1n, s = 0n;
  let oldT = 0n, t = 1n;
  while (r !== 0n) {
    const q = oldR / r;
    [oldR, r] = [r, oldR - q * r];
    [oldS, s] = [s, oldS - q * s];
    [oldT, t] = [t, oldT - q * t];
  }
  return { gcd: oldR, x: oldS, y: oldT };
}

export function modInverse(a, modulus) {
  const m = asBigInt(modulus);
  const result = egcd(((asBigInt(a) % m) + m) % m, m);
  if (result.gcd !== 1n) throw new Error('kein modulares Inverses');
  return ((result.x % m) + m) % m;
}

export function gfMul(a, b) {
  let x = Number(a) & 0xff;
  let y = Number(b) & 0xff;
  let out = 0;
  for (let i = 0; i < 8; i++) {
    if (y & 1) out ^= x;
    x = ((x << 1) ^ ((x & 0x80) ? 0x11b : 0)) & 0xff;
    y >>= 1;
  }
  return out;
}

export function xorHex(...bytes) {
  return bytes.reduce((acc, value) => acc ^ parseInt(String(value).replace(/^0x/i, ''), 16), 0)
    .toString(16).padStart(2, '0').toUpperCase();
}

export function entropy(length, alphabet) {
  return Number(length) * Math.log2(Number(alphabet));
}

export function searchSpace(length, alphabet) {
  return asBigInt(alphabet) ** asBigInt(length);
}

export function birthdayBits(hashBits) {
  return Number(hashBits) / 2;
}

export function sha256Padding(messageBytes) {
  const bytes = Number(messageBytes);
  const zeroBytes = (56 - ((bytes + 1) % 64) + 64) % 64;
  const totalBytes = bytes + 1 + zeroBytes + 8;
  return { zeroBytes, totalBytes, blocks: totalBytes / 64, bitLength: bytes * 8 };
}

export function sha3Rate(hashBits) {
  return 1600 - 2 * Number(hashBits);
}

export function aclEffective(grantedOctal, maskOctal, scope) {
  const granted = parseInt(String(grantedOctal), 8);
  const mask = parseInt(String(maskOctal), 8);
  /* Die ACL-Maske wirkt NICHT auf user:: (Eigentuemer) und other::. */
  if (scope === 'owner' || scope === 'other') return granted.toString(8);
  return (granted & mask).toString(8);
}

/* ── 01.09.2026: Rechenarten für AES-Runde, Betriebsmodi und ECC ──────────── */

/** Zustandsmatrix zeilenweise (4×4) → Spalte `col` nach SubBytes und ShiftRows. */
export function aesShiftedColumn(rows, col, raw) {
  const m = rows.map(r => r.map(v => parseInt(String(v).replace(/^0x/i, ''), 16)));
  return [0, 1, 2, 3].map(row => {
    const byte = m[row][(col + row) % 4];
    return raw ? byte : aesSbox(byte);
  });
}

/** Aus welcher Spalte stammt das Byte, das nach ShiftRows bei (row, col) steht?
    Alles 1-basiert, so wie die Klausur Zeilen und Spalten zaehlt. */
export function shiftRowsSource(row, col) {
  return ((Number(col) - 1 + Number(row) - 1) % 4) + 1;
}

/** Ein Ausgabebyte nach SubBytes → ShiftRows → MixColumns (vor AddRoundKey). */
export function aesRoundByte(rows, row, col) {
  const MIX = [[2, 3, 1, 1], [1, 2, 3, 1], [1, 1, 2, 3], [3, 1, 1, 2]];
  const column = aesShiftedColumn(rows, col);
  return MIX[row].reduce((acc, coefficient, i) => acc ^ gfMul(coefficient, column[i]), 0);
}

/** PKCS#7: Anzahl der Fuellbytes. Ein voller Block wird komplett ergaenzt. */
export function pkcs7PadBytes(plainBytes, blockBytes) {
  const block = Number(blockBytes);
  return block - (Number(plainBytes) % block) || block;
}

/** Blockchiffre mit PKCS#7: Geheimtextlaenge ohne IV. */
export function blockCipherLength(plainBytes, blockBytes) {
  return Number(plainBytes) + pkcs7PadBytes(plainBytes, blockBytes);
}

/** Geheimtextlaenge je Modus, ohne IV. CTR ist eine Stromchiffre und paddet nicht. */
export function modeCipherLength(mode, plainBytes, blockBytes) {
  return String(mode).toLowerCase() === 'ctr'
    ? Number(plainBytes)
    : blockCipherLength(plainBytes, blockBytes);
}

/** PKCS#7 fuellt mit der Anzahl der Fuellbytes; hier als Hex-Byte. */
export function pkcs7PadValue(plainBytes, blockBytes) {
  return pkcs7PadBytes(plainBytes, blockBytes).toString(16).padStart(2, '0').toUpperCase();
}

/** Stromchiffre-Modus (CTR): ein gekipptes Bit verdirbt genau ein Byte. */
export function ctrIntactBytes(totalBytes) {
  return Number(totalBytes) - 1;
}

/** CBC: ein gekipptes Bit verdirbt seinen ganzen Block und ein Byte im Folgeblock. */
export function cbcIntactBytes(totalBytes, blockBytes, flippedByte) {
  const block = Number(blockBytes);
  const total = Number(totalBytes);
  const index = Number(flippedByte) - 1;
  const damagedBlock = Math.floor(index / block);
  const isLastBlock = damagedBlock === Math.floor((total - 1) / block);
  return total - block - (isLastBlock ? 0 : 1);
}

/* ── Multiplikative Gruppe Z*_p ───────────────────────────────────────────── */

/** Die von g erzeugte Untergruppe von Z*_p als sortierte Liste. */
export function subgroupOf(g, p) {
  const m = asBigInt(p);
  const seen = new Set();
  let v = 1n;
  for (let k = 1; k < Number(m); k++) { v = (v * asBigInt(g)) % m; seen.add(Number(v)); if (v === 1n) break; }
  return [...seen].sort((a, b) => a - b);
}

/** Anzahl der verschiedenen Untergruppen von Z*_p. */
export function subgroupCount(p) {
  const seen = new Set();
  for (let g = 1; g < Number(p); g++) seen.add(subgroupOf(g, p).join(','));
  return seen.size;
}

/** Anzahl der Elemente, die Z*_p vollstaendig erzeugen. */
export function generatorCount(p) {
  let count = 0;
  for (let g = 1; g < Number(p); g++) if (subgroupOf(g, p).length === Number(p) - 1) count++;
  return count;
}

/** Groesse des Schnitts zweier erzeugter Untergruppen — die Kandidaten fuer k. */
export function sharedSubgroupSize(a, b, p) {
  const A = subgroupOf(a, p);
  const B = new Set(subgroupOf(b, p));
  return A.filter(x => B.has(x)).length;
}

/* ── Elliptische Kurven ueber F_p: y² = x³ + ax + b ───────────────────────── */

function fpInv(value, p) {
  const m = ((asBigInt(value) % asBigInt(p)) + asBigInt(p)) % asBigInt(p);
  return modInverse(m, p);
}

/** Punktaddition und -verdopplung. `null` steht fuer den Punkt im Unendlichen. */
export function eccAdd(P, Q, a, p) {
  const m = asBigInt(p);
  if (!P) return Q;
  if (!Q) return P;
  const [x1, y1] = P.map(asBigInt);
  const [x2, y2] = Q.map(asBigInt);
  if (x1 === x2 && (y1 + y2) % m === 0n) return null;
  const lambda = (x1 === x2 && y1 === y2)
    ? (3n * x1 * x1 + asBigInt(a)) * fpInv(2n * y1, m) % m
    : (y2 - y1) * fpInv(x2 - x1, m) % m;
  const l = ((lambda % m) + m) % m;
  const x3 = ((l * l - x1 - x2) % m + m) % m;
  const y3 = ((l * (x1 - x3) - y1) % m + m) % m;
  return [x3, y3];
}

export function eccMul(k, P, a, p) {
  let result = null;
  let addend = P;
  let e = asBigInt(k);
  while (e > 0n) {
    if (e & 1n) result = eccAdd(result, addend, a, p);
    addend = eccAdd(addend, addend, a, p);
    e >>= 1n;
  }
  return result;
}

/** Ordnung von P: kleinstes k > 0 mit kP = O. */
export function eccOrder(P, a, p) {
  let point = P;
  for (let k = 1; k <= 4 * Number(p) + 8; k++) {
    if (!point) return k;
    point = eccAdd(point, P, a, p);
  }
  throw new Error('keine Ordnung gefunden');
}

/** Rechte Seite der Weierstrass-Gleichung: x^3 + ax + b mod p. */
export function eccRhs(a, b, p, x) {
  const m = asBigInt(p);
  const v = asBigInt(x);
  return Number(((v * v * v + asBigInt(a) * v + asBigInt(b)) % m + m) % m);
}

/** Anzahl der y-Werte, die zu einem x auf der Kurve liegen (0, 1 oder 2). */
export function eccYCount(a, b, p, x) {
  const rhs = eccRhs(a, b, p, x);
  const m = Number(p);
  let count = 0;
  for (let y = 0; y < m; y++) if ((y * y) % m === rhs) count++;
  return count;
}

/** Steigung der Sekante bzw. Tangente, wie in Uebung 6.4 c) angegeben. */
export function eccLambda(P, Q, a, p) {
  const m = asBigInt(p);
  const [x1, y1] = P.map(asBigInt);
  const [x2, y2] = Q.map(asBigInt);
  const value = (x1 === x2 && y1 === y2)
    ? (3n * x1 * x1 + asBigInt(a)) * fpInv(2n * y1, m)
    : (y2 - y1) * fpInv(x2 - x1, m);
  return Number(((value % m) + m) % m);
}

/** Anzahl aller Kurvenpunkte einschliesslich des Punktes im Unendlichen. */
export function eccPointCount(a, b, p) {
  const m = Number(p);
  let count = 1;
  for (let x = 0; x < m; x++) {
    const rhs = ((x * x * x + Number(a) * x + Number(b)) % m + m) % m;
    for (let y = 0; y < m; y++) if ((y * y) % m === rhs) count++;
  }
  return count;
}

const pointText = point => (point ? point.map(String).join(',') : 'O');

function rotl8(value, shift) {
  return ((value << shift) | (value >> (8 - shift))) & 0xff;
}

function aesSbox(byte) {
  const value = Number(byte) & 0xff;
  let inverse = 0;
  if (value !== 0) {
    for (let candidate = 1; candidate < 256; candidate++) {
      if (gfMul(value, candidate) === 1) { inverse = candidate; break; }
    }
  }
  return (inverse ^ rotl8(inverse, 1) ^ rotl8(inverse, 2) ^
    rotl8(inverse, 3) ^ rotl8(inverse, 4) ^ 0x63) & 0xff;
}

function numeric(value) {
  const n = Number(value);
  if (!Number.isSafeInteger(n)) return value.toString();
  return n;
}

function compute(rule) {
  const a = rule.args || [];
  switch (rule.kind) {
    /* ── Kursunabhängige Methoden des Rahmenwerks ────────────────────────
       Sie decken den Normalfall ab: ein Endergebnis, das aus den gegebenen
       Werten mit einer Grundrechenart entsteht. Wichtig ist nicht, dass die
       Methode klug ist, sondern dass sie die Zahl aus den EINGABEN erzeugt und
       nicht aus dem gespeicherten Ergebnis. `literal` ist die Ausnahme und die
       einzige Regel ohne Beweiswert — sie ist für Werte gedacht, die man nur
       ablesen kann (eine Tabellenzeile, ein Normwert). */
    case 'sum':      return numeric(a.reduce((s, v) => s + Number(v), 0));
    case 'diff':     return numeric(a.slice(1).reduce((s, v) => s - Number(v), Number(a[0])));
    case 'product':  return numeric(a.reduce((s, v) => s * Number(v), 1));
    case 'quotient': return numeric(Number(a[0]) / Number(a[1]));
    case 'power':    return numeric(Math.pow(Number(a[0]), Number(a[1])));
    case 'mean':     return numeric(a.reduce((s, v) => s + Number(v), 0) / a.length);
    case 'percent':  return numeric((Number(a[0]) / Number(a[1])) * 100);
    case 'round':    return numeric(Math.round(Number(a[0]) * Math.pow(10, Number(a[1] || 0))) / Math.pow(10, Number(a[1] || 0)));
    case 'literal': return a[0];

    /* ── Fachmethoden dieses Kurses ──────────────────────────────────────
       Aus dem Infosec-Bootcamp übernommen. Ein anderer Kurs darf sie stehen
       lassen (sie stören nicht) oder ersetzen. */
    case 'modPow': return numeric(modPow(a[0], a[1], a[2]));
    case 'modInverse': return numeric(modInverse(a[0], a[1]));
    case 'gcd': return numeric(egcd(a[0], a[1]).gcd);
    case 'multiplicativeOrder': {
      const modulus = asBigInt(a[1]);
      let value = 1n;
      for (let order = 1; order <= Number(modulus); order++) {
        value = (value * asBigInt(a[0])) % modulus;
        if (value === 1n) return order;
      }
      throw new Error('keine multiplikative Ordnung gefunden');
    }
    case 'aesRounds': {
      const rounds = { 128: 10, 192: 12, 256: 14 }[Number(a[0])];
      if (!rounds) throw new Error('keine AES-Schluessellaenge: ' + a[0]);
      return rounds;
    }
    case 'groupOrder': return Number(a[0]) - 1;
    case 'subgroupSize': return subgroupOf(a[0], a[1]).length;
    case 'subgroupCount': return subgroupCount(a[0]);
    case 'generatorCount': return generatorCount(a[0]);
    case 'sharedSubgroupSize': return sharedSubgroupSize(a[0], a[1], a[2]);
    case 'gfMul': return gfMul(a[0], a[1]).toString(16).padStart(2, '0').toUpperCase();
    case 'xorHex': return xorHex(...a);
    case 'aesSbox': return aesSbox(parseInt(String(a[0]).replace(/^0x/i, ''), 16)).toString(16).padStart(2, '0').toUpperCase();
    case 'aesMixByte': {
      const coefficients = a[0];
      const bytes = a[1].map(v => parseInt(String(v).replace(/^0x/i, ''), 16));
      const value = coefficients.reduce((acc, coefficient, i) => acc ^ gfMul(coefficient, bytes[i]), 0);
      return value.toString(16).padStart(2, '0').toUpperCase();
    }
    case 'aesStateRow': {
      const bytes = a[0].map(v => parseInt(String(v).replace(/^0x/i, ''), 16));
      const row = Number(a[1]);
      const shifted = !!a[2];
      const stateRow = [0, 1, 2, 3].map(column => bytes[column * 4 + row]);
      const out = shifted ? stateRow.slice(row).concat(stateRow.slice(0, row)) : stateRow;
      return out.map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase();
    }
    case 'aesKeyWord': {
      const previous = a[0].map(v => parseInt(String(v).replace(/^0x/i, ''), 16));
      const last = a[1].map(v => parseInt(String(v).replace(/^0x/i, ''), 16));
      const rotated = last.slice(1).concat(last[0]);
      const transformed = rotated.map(aesSbox);
      transformed[0] ^= Number(a[2]);
      return previous.map((v, i) => v ^ transformed[i])
        .map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase();
    }
    case 'pow': return numeric(asBigInt(a[0]) ** asBigInt(a[1]));
    case 'product': return numeric(a.reduce((value, factor) => value * asBigInt(factor), 1n));
    case 'entropy': return entropy(a[0], a[1]);
    case 'searchSpace': return numeric(searchSpace(a[0], a[1]));
    case 'bruteSeconds': return Number(a[0]) / Number(a[1]) / (a[2] === 'average' ? 2 : 1);
    case 'birthdayBits': return birthdayBits(a[0]);
    case 'secondPreimageBits': return Number(a[0]);
    case 'sha256Padding': return sha256Padding(a[0])[rule.output];
    case 'sha3Rate': return sha3Rate(a[0]);
    case 'sha3Capacity': return 2 * Number(a[0]);
    case 'aclEffective': return aclEffective(a[0], a[1], a[2]);
    case 'octalToSymbolic': {
      return String(a[0]).split('').map(d => {
        const n = Number(d);
        return (n & 4 ? 'r' : '-') + (n & 2 ? 'w' : '-') + (n & 1 ? 'x' : '-');
      }).join('');
    }
    case 'symbolicToOctal': {
      const value = String(a[0]);
      let out = '';
      for (let i = 0; i < 9; i += 3) {
        const triad = value.slice(i, i + 3);
        out += String((triad[0] === 'r' ? 4 : 0) + (triad[1] === 'w' ? 2 : 0) +
          (['x', 's', 't'].includes(triad[2]) ? 1 : 0));
      }
      return out;
    }
    case 'setuidMode': return String(Number(a[0]) ? 4000 + Number(a[1]) : Number(a[1])).padStart(4, '0');
    case 'modeToSymbolic': {
      const value = String(a[0]).padStart(4, '0');
      const special = Number(value[0]);
      const base = compute({ kind: 'octalToSymbolic', args: [value.slice(1)] }).split('');
      if (special & 4) base[2] = base[2] === 'x' ? 's' : 'S';
      if (special & 2) base[5] = base[5] === 'x' ? 's' : 'S';
      if (special & 1) base[8] = base[8] === 'x' ? 't' : 'T';
      return base.join('');
    }
    case 'aesShiftedColumn':
      return aesShiftedColumn(a[0], Number(a[1]), rule.output === 'raw')
        .map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase();
    case 'shiftRowsSource': return shiftRowsSource(a[0], a[1]);
    case 'aesRoundByte':
      return aesRoundByte(a[0], Number(a[1]), Number(a[2])).toString(16).padStart(2, '0').toUpperCase();
    case 'xorWord': {
      const bytes = a.map(word => String(word).replace(/^0x/i, '').match(/../g).map(v => parseInt(v, 16)));
      return bytes[0].map((_, i) => bytes.reduce((acc, word) => acc ^ word[i], 0))
        .map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase();
    }
    case 'pkcs7PadBytes': return pkcs7PadBytes(a[0], a[1]);
    case 'pkcs7PadValue': return pkcs7PadValue(a[0], a[1]);
    case 'modeCipherLength': return modeCipherLength(a[0], a[1], a[2]);
    case 'blockCipherLength': return blockCipherLength(a[0], a[1]);
    case 'ctrIntactBytes': return ctrIntactBytes(a[0]);
    case 'cbcIntactBytes': return cbcIntactBytes(a[0], a[1], a[2]);
    case 'bitLength': return asBigInt(a[0]).toString(2).length;
    case 'bitCount': return asBigInt(a[0]).toString(2).split('1').length - 1;
    case 'doubleAndAdd': {
      const bits = asBigInt(a[0]).toString(2);
      const ones = bits.split('1').length - 1;
      if (rule.output === 'additions') return ones - 1;
      if (rule.output === 'naive') return Number(asBigInt(a[0]) - 1n);
      return bits.length - 1;
    }
    case 'eccPointCount': {
      const total = eccPointCount(a[0], a[1], a[2]);
      return rule.output === 'affine' ? total - 1 : total;
    }
    case 'eccRhs': return eccRhs(a[0], a[1], a[2], a[3]);
    case 'eccYCount': return eccYCount(a[0], a[1], a[2], a[3]);
    case 'eccLambda': return eccLambda(a[0], a[1], a[2], a[3]);
    case 'eccOrder': return eccOrder(a[0], a[1], a[2]);
    case 'eccMul': {
      const point = eccMul(a[0], a[1], a[2], a[3]);
      if (rule.output === 'x') return Number(point[0]);
      if (rule.output === 'y') return Number(point[1]);
      return pointText(point);
    }
    default: throw new Error('unbekannte Prüfmethode "' + rule.kind + '"');
  }
}

function equivalent(field, expected) {
  if (field.kind === 'number') {
    return Number.isFinite(Number(expected)) && Math.abs(Number(field.answer) - Number(expected)) <= (field.tol || 0);
  }
  if (field.kind === 'hex') {
    const norm = value => String(value).trim().replace(/^0x/i, '').toUpperCase();
    return norm(field.answer) === norm(expected);
  }
  return String(field.answer).trim().toLocaleLowerCase('de-DE') ===
    String(expected).trim().toLocaleLowerCase('de-DE');
}

function loadSheet(file) {
  let sheet;
  const source = fs.readFileSync(file, 'utf8');
  vm.runInContext(source, vm.createContext({ WB: { register(value) { sheet = value; } } }), { filename: file });
  if (!sheet) throw new Error('WB.register wurde nicht aufgerufen');
  return sheet;
}

function expandArgs(args) {
  const out = [];
  for (const arg of args) {
    if (!arg.includes('*')) { out.push(arg); continue; }
    const dir = path.resolve(path.dirname(arg));
    const name = path.basename(arg);
    const re = new RegExp('^' + name.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$', 'i');
    out.push(...fs.readdirSync(dir).filter(file => re.test(file)).map(file => path.join(dir, file)));
  }
  return out;
}

const files = expandArgs(process.argv.slice(2));
if (!files.length) {
  console.error('Aufruf: node tools/intensive-answer-check.mjs <data.js> [...]');
  process.exit(2);
}

let failures = 0;
let resultTasks = 0;
let rules = 0;
for (const input of files) {
  const file = path.resolve(input);
  try {
    const sheet = loadSheet(file);
    for (const task of sheet.parts.flatMap(part => part.tasks)) {
      if (task.type !== 'result') continue;
      resultTasks++;
      const verifiedFields = new Set((task.verify || []).map(rule => rule.field));
      task.fields.forEach((field, fieldIndex) => {
        if ((field.kind === 'number' || field.kind === 'hex') && !verifiedFields.has(fieldIndex)) {
          failures++;
          console.error(`${path.basename(file)} / Aufgabe ${task.id} / Feld ${fieldIndex + 1}: keine unabhängige Prüfung`);
        }
      });
      for (const rule of task.verify || []) {
        rules++;
        const field = task.fields[rule.field];
        if (!field) throw new Error('Aufgabe ' + task.id + ': Prüfmethode verweist auf fehlendes Feld ' + (rule.field + 1));
        const expected = compute(rule);
        if (!equivalent(field, expected)) {
          failures++;
          console.error(`${path.basename(file)} / Aufgabe ${task.id} / Feld ${rule.field + 1}: erwartet ${expected}, gespeichert ${field.answer}`);
        }
      }
    }
  } catch (error) {
    failures++;
    console.error(`${path.basename(file)}: ${error.message}`);
  }
}

if (failures) {
  console.error(`ERGEBNIS: ROT (${failures} Abweichungen)`);
  process.exit(1);
}
console.log(`ERGEBNIS: GRÜN (${resultTasks} result-Aufgaben, ${rules} Rechenwerte unabhängig bestätigt)`);
