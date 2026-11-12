/* ============================================================================
   redaktion-lint.mjs — die Redaktionsregeln OHNE Browser, MIT Hinweisen
   ---------------------------------------------------------------------------
   NEU am 12.11.2026 (Agent, Bootcamp Java). Zwei Lücken, die beim Bau eines
   Programmier-Bootcamps aufgefallen sind:

   1. `tools/bootcamp-check.ps1` zeigt von `validate.js` nur die FEHLER. Die
      Hinweise (Antwortlängen, Leiterform, Anteil schwerer Aufgaben) sieht man
      nur im Blatt selbst. Dieses Werkzeug druckt beide, in Sekunden statt in
      Minuten, weil es keinen Browser startet.

   2. Rohe spitze Klammern in Feldern, die die Engine als HTML setzt. Ein
      `List<Object>` in einer Rückmeldung hält der Browser für ein Tag und lässt
      es STILL verschwinden: kein Fehler, keine Konsolenmeldung, nur ein Satz,
      in dem der entscheidende Typ fehlt. Bei einem Thema mit Generics ist das
      der Normalfall. Gemeldet wird jedes `<`, das kein bekanntes HTML-Tag
      beginnt.

   Aufruf:  node tools/redaktion-lint.mjs            alle *.data.js im Kursordner
            node tools/redaktion-lint.mjs Blatt_A    einzelne Blätter, ohne Endung
   Exitcode 1, sobald validate.js einen FEHLER meldet oder ein rohes `<` steht.
   Hinweise allein ändern den Exitcode nicht.

   Welche Felder HTML sind, ist aus engine.js abgelesen (Stand 12.11.2026):
   prompt, feedback, wrongNote, deep, title, Optionen einer Auswahl, Textteile
   eines Lückentexts, Zeilenbeschriftung eines Rasters, given, Feldbeschriftung
   von forecast/result, Lösungsschritte, Prüfliste und Musterlösung einer
   Papieraufgabe. Über textContent gesetzt und deshalb NICHT geprüft: Begriffe
   und Beschreibungen einer Zuordnung, Elemente einer Reihenfolge, Optionen
   eines Auswahlfelds, Spaltenköpfe eines Rasters, Fragen einer Umkehraufgabe.
   ============================================================================ */

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = ['src', 'Stylevorgabe', '.'].map(d => path.join(root, d)).find(d => fs.existsSync(path.join(d, 'assets', 'validate.js')));
if (!SRC) { console.error('assets/validate.js nicht gefunden'); process.exit(1); }

let namen = process.argv.slice(2);
if (!namen.length) {
  namen = fs.readdirSync(SRC).filter(f => f.endsWith('.data.js') && !/^(startseite|index)\./.test(f)).map(f => f.replace('.data.js', ''));
  // ERGAENZT 12.11.2026 (Agent, Rückführung ins Rahmenwerk): Blätter dürfen eine
  // Ebene tiefer liegen, genau wie in bootcamp-check.ps1 (dort seit 14.08.2026).
  // Ohne diese Schleife blieb der Standardlauf am Showcase grün und sah
  // `Klausurphase/Intensiv_01_Netzrechnen` und `Klausurphase/Probeklausur` nie.
  // Dieselbe Regel wie dort: eine *.data.js mit gleichnamiger *.html daneben.
  for (const sub of fs.readdirSync(SRC, { withFileTypes: true })) {
    if (!sub.isDirectory() || ['assets', 'tools', 'Code-Aufgaben', '.claude'].includes(sub.name)) continue;
    for (const f of fs.readdirSync(path.join(SRC, sub.name))) {
      if (f.endsWith('.data.js') && fs.existsSync(path.join(SRC, sub.name, f.replace('.data.js', '.html')))) {
        namen.push(sub.name + '/' + f.replace('.data.js', ''));
      }
    }
  }
}

// ERWEITERT 12.11.2026 (Agent, Rückführung ins Rahmenwerk). Zwei Änderungen:
//
// 1. Die Liste kennt jetzt auch die Blockelemente, die die Showcase-Blätter in
//    `lead` und Tabellen wirklich benutzen (h3, aside, figure, figcaption,
//    thead, tbody, caption) und ihre nächsten Verwandten. Vorher meldete der
//    Lint auf den zwei Klausurphase-Blättern je ein gültiges Tag als rohe
//    Klammer.
//
// 2. Verglichen wird OHNE toLowerCase(). HTML steht im Kurs durchgehend klein,
//    Typnamen beginnen groß. So bleibt `List<Figure>` ein Befund, obwohl
//    `figure` in der Liste steht, und ebenso ein Typparameter `<S>`, `<P>`,
//    `<B>`, `<U>`, `<I>`, `<A>`: der Browser hält auch die groß geschriebene
//    Form für ein Tag und lässt sie verschwinden. Vorher rutschten genau diese
//    sechs durch.
const HTMLTAGS = new Set(('b strong i em u s code kbd samp var pre span div p br wbr hr sub sup small mark a ul ol li table tr td th img svg details summary ' +
  'h1 h2 h3 h4 h5 h6 aside section figure figcaption blockquote dl dt dd thead tbody tfoot caption abbr').split(' '));
function roheKlammer(s) {
  for (const m of String(s || '').matchAll(/<\/?([A-Za-z?][\w]*)?/g)) {
    if (!HTMLTAGS.has(m[1] || '')) return m[0] + String(s).slice(m.index + m[0].length, m.index + 24);
  }
  return null;
}

let fehler = 0, hinweise = 0;
for (const name of namen) {
  const sheets = [];
  const WB = {
    MULT: { leicht: 1, mittel: 1.5, schwer: 2 },
    sheetTasks: s => s.parts.flatMap(p => p.tasks),
    register: s => sheets.push(s)
  };
  const ctx = vm.createContext({ window: { WB }, WB, console });
  vm.runInContext(fs.readFileSync(path.join(SRC, 'assets', 'validate.js'), 'utf8'), ctx);
  vm.runInContext(fs.readFileSync(path.join(SRC, name + '.data.js'), 'utf8'), ctx);
  const sheet = sheets[0];
  if (!sheet) { console.log('== ' + name + ': kein Blatt angemeldet'); fehler++; continue; }
  const tasks = WB.sheetTasks(sheet);
  const issues = WB.validate(sheet);

  const html = [];
  const pruef = (wo, s) => { const r = roheKlammer(s); if (r) html.push(wo + ': rohes „' + r + '…"'); };
  for (const t of tasks) {
    const wo = 'Aufgabe ' + t.id;
    ['prompt', 'feedback', 'wrongNote', 'deep', 'title'].forEach(k => pruef(wo + ' ' + k, t[k]));
    if (t.type === 'choice') (t.options || []).forEach((o, i) => pruef(wo + ' Option ' + (i + 1), o.text));
    (t.segments || []).filter(s => s.kind === 'text').forEach((s, i) => pruef(wo + ' Textsegment ' + i, s.text));
    (t.rows || []).forEach((r, i) => pruef(wo + ' Zeile ' + (i + 1), r.label));
    (t.given || []).forEach((g, i) => { pruef(wo + ' given ' + i, g.label); pruef(wo + ' given ' + i, g.value); });
    if (t.type === 'forecast' || t.type === 'result') (t.fields || []).forEach((f, i) => pruef(wo + ' Feld ' + (i + 1), f.label));
    (Array.isArray(t.solution) ? t.solution : []).forEach((s, i) => pruef(wo + ' Lösungsschritt ' + (i + 1), s));
    if (t.solution && t.solution.html) pruef(wo + ' Musterlösung', t.solution.html);
    (t.checklist || []).forEach((s, i) => pruef(wo + ' Kriterium ' + (i + 1), s));
  }
  [sheet.lede, sheet.headline].concat(sheet.intro || []).concat((sheet.notes || []).map(n => n.text)).forEach((s, i) => pruef('Kopf ' + i, s));
  (sheet.parts || []).forEach((p, i) => pruef('Teil ' + (i + 1) + ' lead', p.lead));

  const arten = [...new Set(tasks.map(t => t.type + (t.multi ? '+multi' : '')))];
  const schwer = tasks.filter(t => t.difficulty === 'schwer').length;
  console.log('== ' + name + ': ' + tasks.length + ' Aufgaben, ' + arten.length + ' Arten, ' + schwer + ' schwer (' + Math.round(100 * schwer / tasks.length) + ' %)');
  issues.forEach(i => console.log('   ' + (i.level === 'fehler' ? 'FEHLER  ' : 'Hinweis ') + i.where + ' — ' + i.message));
  html.forEach(h => console.log('   HTML    ' + h));
  fehler += issues.filter(i => i.level === 'fehler').length + html.length;
  hinweise += issues.filter(i => i.level !== 'fehler').length;
}
console.log(fehler ? 'ERGEBNIS: ROT (' + fehler + ' Fehler, ' + hinweise + ' Hinweise)'
  : 'ERGEBNIS: GRÜN (' + namen.length + ' Blätter, keine Fehler, ' + hinweise + ' Hinweise)');
process.exit(fehler ? 1 : 0);
