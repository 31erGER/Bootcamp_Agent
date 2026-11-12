/* ============================================================================
   codebild.mjs — Codezeilen als SVG mit anklickbaren Zeilennummern
   ---------------------------------------------------------------------------
   NEU am 12.11.2026 (Agent, Bootcamp Java). Für `hotspot`-Aufgaben in
   Programmierthemen: „tippe auf die Zeile, die nicht kompiliert". Ein
   Schaltbild gibt es dort nicht; das Bild IST der Code.

   Aufruf:  node tools/codebild.mjs docs/codebilder.json
   Eingabe: { "name": ["erste Zeile", "zweite Zeile", …], … }
   Ausgabe: src/assets/img/code-<name>.svg je Eintrag, und auf der Konsole die
            Trefferzonen je Zeile zum Einsetzen in die Aufgabe:
              Z3:{x:6.1,y:37.1,r:5}  →  { x: 6.1, y: 37.1, r: 5, label: '…' }

   Maße, alle aus einem Fehlbefund der Breitenprüfung: bei 320 px Seitenbreite
   war eine Zone mit r = 4 nur 15 px breit und ihr Inhalt 17 px, „abgeschnitten".
   Mit 560 px Bildbreite, 60 px Zeilenhöhe und r = 5 ist die Zone bei 320 px
   breit genug, und zwei benachbarte überlappen nicht (Zeilenabstand 10,7 % der
   Breite, Durchmesser 10 %). Deshalb höchstens 52 Zeichen je Zeile.

   Farben stehen als Literal im SVG, entnommen aus colorpalett.css: eine per
   <img> geladene SVG sieht die CSS-Variablen des Dokuments nicht
   (Rahmenwerk.md, Fallstricke). Kein <style>-Block, also keine CDATA-Falle.
   ============================================================================ */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const kurs = ['src', 'Stylevorgabe', '.'].map(d => path.join(root, d)).find(d => fs.existsSync(path.join(d, 'assets')));
const OUT = path.join(kurs, 'assets', 'img');
const quelle = process.argv[2];
if (!quelle) { console.error('Aufruf: node tools/codebild.mjs <datei.json>'); process.exit(1); }

const W = 560, ZH = 60, PAD = 22, XN = 34, XT = 72, R = 16, MAX = 52;
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const SCHRIFT = "'JetBrains Mono', Consolas, 'Courier New', monospace";

const bilder = JSON.parse(fs.readFileSync(path.resolve(quelle), 'utf8'));
for (const [name, zeilen] of Object.entries(bilder)) {
  const H = PAD * 2 + zeilen.length * ZH;
  const laengste = Math.max(...zeilen.map(z => z.length));
  if (laengste > MAX) throw new Error(name + ': eine Zeile hat ' + laengste + ' Zeichen, erlaubt sind ' + MAX);
  let svg = '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H + '" role="img">\n' +
    '  <rect x="0" y="0" width="' + W + '" height="' + H + '" fill="#faf6ec"/>\n' +
    '  <rect x="0.5" y="0.5" width="' + (W - 1) + '" height="' + (H - 1) + '" fill="none" stroke="#857b6c" stroke-opacity="0.45"/>\n' +
    '  <line x1="' + (XN + R + 9) + '" y1="' + (PAD - 6) + '" x2="' + (XN + R + 9) + '" y2="' + (H - PAD + 6) + '" stroke="#857b6c" stroke-opacity="0.35"/>\n';
  const zonen = [];
  zeilen.forEach((z, i) => {
    const cy = PAD + i * ZH + ZH / 2;
    svg += '  <circle cx="' + XN + '" cy="' + cy + '" r="' + R + '" fill="#fffdf7" stroke="#d6431d" stroke-width="1.5"/>\n' +
      '  <text x="' + XN + '" y="' + (cy + 4.5) + '" text-anchor="middle" font-family="' + SCHRIFT + '" font-size="13" font-weight="700" fill="#a8300f">' + (i + 1) + '</text>\n' +
      '  <text x="' + XT + '" y="' + (cy + 5) + '" xml:space="preserve" font-family="' + SCHRIFT + '" font-size="15" fill="#1c1813">' + esc(z) + '</text>\n';
    zonen.push('Z' + (i + 1) + ':{x:' + +(XN / W * 100).toFixed(1) + ',y:' + +(cy / H * 100).toFixed(1) + ',r:5}');
  });
  svg += '</svg>\n';
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, 'code-' + name + '.svg'), svg, 'utf8');
  console.log('code-' + name + '.svg  ' + W + 'x' + H + '  ' + zonen.join(' '));
}
