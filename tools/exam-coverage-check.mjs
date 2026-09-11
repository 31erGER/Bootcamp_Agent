/* ============================================================================
   exam-coverage-check.mjs — behauptete Abdeckung gegen die Aufgaben prüfen
   ---------------------------------------------------------------------------
   NUR FÜR DIE KLAUSURPHASE. Die Abdeckungskarte (`Abdeckung.html`) behauptet,
   dass jedes Thema der Vorlesung irgendwo vorkommt. Eine Behauptung in HTML
   altert schlecht: die Aufgabe daneben wird umgeschrieben, der Begriff fällt
   heraus, die Karte sagt weiter „abgedeckt". Dieses Werkzeug liest deshalb die
   Aufgabenobjekte selbst und sucht die Begriffe dort, wo sie stehen müssen.

   Die Erwartungen stehen in `tools/klausurphase.config.mjs`. Ist die Liste
   leer, gibt es nichts zu prüfen und der Lauf ist GRÜN — ein Themen-Bootcamp
   ohne Klausur braucht keine Abdeckungskarte.

   Aufruf: node tools/exam-coverage-check.mjs
   ============================================================================ */

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { abdeckung } from './klausurphase.config.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const styleDir = path.join(here, '..', 'src');

function loadSheet(file) {
  let sheet;
  const context = vm.createContext({
    WB: { register(value) { sheet = value; } }
  });
  /* `file` darf einen Unterordner enthalten (Klausurphase/…). */
  const source = fs.readFileSync(path.join(styleDir, ...file.split('/')), 'utf8');
  vm.runInContext(source, context, { filename: file });
  if (!sheet) throw new Error(`${file}: WB.register wurde nicht aufgerufen`);
  return sheet;
}

/* Gesucht wird im gesamten Aufgabenobjekt, also auch in Rückmeldung und
   Vertiefung. Das ist Absicht: ein Begriff, der nur in der Vertiefung fällt,
   ist gelesen worden — er zählt. Der Theorieblock eines Teils (`part.lead`)
   zählt mit, weil er zum Blatt gehört und mitgelesen wird. */
function sheetText(sheet) {
  const teile = (sheet.parts || []).map((part) => ({
    lead: part.lead || '',
    tasks: part.tasks || []
  }));
  return JSON.stringify(teile).toLocaleLowerCase('de-DE');
}

const requirements = Array.isArray(abdeckung) ? abdeckung : [];

if (!requirements.length) {
  console.log('ERGEBNIS: GRÜN (keine Abdeckungsregeln hinterlegt — kein Klausurkontext)');
  process.exit(0);
}

let failures = 0;
let begriffe = 0;
for (const requirement of requirements) {
  let text;
  try {
    text = sheetText(loadSheet(requirement.file));
  } catch (error) {
    failures += 1;
    console.error(`FEHLT ${requirement.file}: ${error.message}`);
    continue;
  }
  const concepts = requirement.concepts || [];
  begriffe += concepts.length;
  const missing = concepts.filter((concept) => !text.includes(String(concept).toLocaleLowerCase('de-DE')));
  if (missing.length) {
    failures += 1;
    console.error(`FEHLT ${requirement.file}: ${missing.join(', ')}`);
  } else {
    console.log(`OK    ${requirement.file} (${concepts.length} Begriffe)`);
  }
}

if (failures) {
  console.error(`\nERGEBNIS: ROT (${failures} Blätter mit behaupteter, aber fehlender Abdeckung)`);
  process.exit(1);
}

console.log(`\nERGEBNIS: GRÜN (${begriffe} Begriffe in ${requirements.length} Blättern belegt)`);
