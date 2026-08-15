/* ============================================================================
   validate.js — Redaktionsregeln als Code
   ---------------------------------------------------------------------------
   Die Regeln aus Rahmenwerk.md waren bisher Bitten in einem Fließtext. Hier
   sind sie geprüft. Ein Blatt ist erst fertig, wenn diese Prüfung ohne FEHLER
   durchläuft — sichtbar in der Seite und im Prüfwerkzeug, nicht in einem
   Dokument, in dem es verstaubt.

   Was sich NICHT automatisieren lässt, steht als Kommentar dabei: ob ein
   Distraktor wirklich plausibel ist, entscheidet Fachwissen, nicht ein Regex.
   Diese Datei nimmt einem das Nachdenken nicht ab, sie nimmt einem nur das
   Nachzählen ab.

   Aufruf:  WB.validate(sheet) -> [ { level, where, message } ]
            level ist 'fehler' oder 'hinweis'
   ============================================================================ */

window.WB = window.WB || {};

(function (WB) {
  'use strict';

  const BOLD = /<(b|strong)\b/i;

  /* ══════════════════════════════════════════════════════════════════════════
     AuD-Bootcamp, 2026-08-07: zwei Regeln ergänzt, beide aus echten Fehlern.

     1) normalisiert() — der Fund, der die Regel ausgelöst hat: eine cloze-Lücke
        mit dem Wert „15 7 11 17 13  und  18 25 20" (zwei Leerzeichen) war
        UNLÖSBAR. engine.js baut die Optionen über textContent, gelesen wird
        select.value — und HTMLOptionElement.value fällt auf .text zurück. .text
        ist laut HTML-Spezifikation der Textinhalt OHNE Rand-Leerzeichen und mit
        zu EINEM Leerzeichen zusammengefassten Whitespace-Folgen. Der Wert kommt
        also anders zurück, als er hineingeschrieben wurde, `given === g.answer`
        scheitert, und die Aufgabe ist nicht lösbar. Am Text sieht man das nicht;
        gefunden hat es der Selbstlauf, der plötzlich 23 von 24 meldete.
        Gilt genauso für die select-Felder einer forecast-Aufgabe.

     2) markup() — Begriffe und Beschreibungen einer dnd-Aufgabe, die Optionen
        eines select und die Elemente einer order-Aufgabe werden über
        textContent gesetzt. Ein <code> oder ein &lt; erscheint dort als
        sichtbarer Quelltext. Auch das findet keine der anderen Prüfungen: die
        Aufgabe bleibt lösbar, sie sieht nur falsch aus.
     ══════════════════════════════════════════════════════════════════════════ */

  /** true, wenn der Browser diesen Optionswert beim Lesen umschreiben würde. */
  function normalisiert(s) {
    const v = String(s === undefined || s === null ? '' : s);
    return v !== v.trim().replace(/\s+/g, ' ');
  }

  /** true, wenn der Wert Markup enthält, das als Text angezeigt würde.
      Die Namensliste ist Absicht: ein generisches `Comparable<T>` oder ein
      `List<String>` gehört als Text in eine Zuordnung und ist KEIN Markup. Eine
      Regel, die jede spitze Klammer verbietet, wäre in einem Java-Kurs
      unbrauchbar — sie hat beim ersten Lauf genau daran falsch angeschlagen. */
  const TAGS = 'b|strong|i|em|u|s|code|kbd|samp|var|pre|span|div|p|br|wbr|hr|' +
               'sub|sup|small|mark|a|ul|ol|li|table|tr|td|th|img|svg|details|summary';
  const TAG_RE = new RegExp('</?(' + TAGS + ')(\\s[^>]*)?/?>', 'i');
  const ENT_RE = /&(?:[a-zA-Z]{2,10}|#\d{1,5}|#x[0-9a-fA-F]{1,5});/;

  function markup(s) {
    const v = String(s === undefined || s === null ? '' : s);
    return TAG_RE.test(v) || ENT_RE.test(v);
  }

  /** Text ohne Markup und ohne Entities — Grundlage jeder Längenmessung. */
  function plain(s) {
    return String(s === undefined || s === null ? '' : s)
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&[a-z]+;/g, 'x')
      .trim();
  }

  /**
   * Nennt ein Tipp die gesuchte Zahl im Klartext? Dann ist er Abschreiben und
   * kein Tipp. Geprüft werden alle Schreibweisen mit null bis vier Dezimalen,
   * mit Punkt und mit Komma. Einstellige Formen werden übersprungen, sonst
   * schlägt jede „2" in einem Fließtext an.
   */
  function leaksAnswer(hint, answer) {
    const forms = new Set();
    for (let d = 0; d <= 4; d++) {
      forms.add(answer.toFixed(d));
      forms.add(answer.toFixed(d).replace('.', ','));
    }
    forms.add(String(answer));
    forms.add(String(answer).replace('.', ','));
    const h = String(hint || '').replace(/\s/g, '');
    return [...forms].some(f => f.length >= 2 && h.indexOf(f.replace(/\s/g, '')) >= 0);
  }

  function checkTask(task, where, out) {
    const add = (level, message) => out.push({ level, where, message });

    if (!plain(task.prompt)) add('fehler', 'ohne Aufgabenstellung (prompt)');
    if (!plain(task.feedback)) add('fehler', 'ohne Begründung (feedback)');
    /* Vertiefung mit Querverweis ist Pflicht: sie ist der Grund, warum ein
       falsch geratener Klick trotzdem etwas wert ist. */
    if (!plain(task.deep)) add('fehler', 'ohne Vertiefung (deep)');
    if (!WB.MULT[task.difficulty]) add('fehler', 'unbekannte Schwierigkeit "' + task.difficulty + '"');
    if (!task.title) add('hinweis', 'ohne Titel');

    switch (task.type) {

      case 'choice': {
        const correct = task.options.filter(o => o.correct).length;
        if (correct === 0) add('fehler', 'keine richtige Antwortmöglichkeit');
        if (!task.multi && correct !== 1) add('fehler', 'Einfachauswahl mit ' + correct + ' richtigen Optionen');
        if (task.multi && correct < 2) add('hinweis', 'Mehrfachauswahl mit nur einer richtigen Option');
        if (task.options.length < 3) add('hinweis', 'nur ' + task.options.length + ' Antwortmöglichkeiten');

        /* Regel: kein Fettdruck in Antwortmöglichkeiten. Er zieht das Auge auf
           eine Option und verrät sie damit. */
        task.options.forEach((o, i) => {
          if (BOLD.test(o.text)) add('fehler', 'Fettdruck in Antwortmöglichkeit ' + (i + 1));
        });

        /* Regel: ähnlich lange Antworten. Wer die längste anklickt, soll damit
           nicht systematisch richtig liegen. */
        const lens = task.options.map(o => plain(o.text).length);
        const min = Math.min(...lens);
        const max = Math.max(...lens);
        if (min > 0 && max > min * 1.7) {
          add('hinweis', 'Antwortlängen ' + min + '–' + max + ' Zeichen — Spreizung zu groß');
        }
        const longest = lens.indexOf(max);
        if (task.options[longest] && task.options[longest].correct && max > min * 1.35) {
          add('hinweis', 'die längste Antwortmöglichkeit ist die richtige');
        }
        break;
      }

      case 'cloze': {
        const gaps = task.segments.filter(s => s.kind !== 'text');
        if (!gaps.length) add('fehler', 'Lückentext ohne Lücke');
        task.segments.forEach((s, i) => {
          if (s.kind !== 'select') return;
          if (!s.distractors || s.distractors.length < 2) {
            add('hinweis', 'Lücke ' + i + ': nur ' + ((s.distractors || []).length) + ' Distraktoren');
          }
          if (s.distractors && s.distractors.indexOf(s.answer) >= 0) {
            add('fehler', 'Lücke ' + i + ': Antwort steht doppelt in den Distraktoren');
          }
          /* AuD-Bootcamp, 2026-08-07: neue Regel, siehe normalisiert() unten. */
          [s.answer].concat(s.distractors || []).forEach(v => {
            if (normalisiert(v)) {
              add('fehler', 'Lücke ' + i + ': „' + v + '" wird vom Browser umgeschrieben');
            }
            if (markup(v)) {
              add('fehler', 'Lücke ' + i + ': „' + v + '" enthält Markup, das als Text erscheint');
            }
          });
        });
        break;
      }

      case 'dnd': {
        if (task.pairs.length < 3) add('hinweis', 'nur ' + task.pairs.length + ' Zuordnungen');
        const keys = new Set(task.pairs.map(p => p.key));
        if (keys.size !== task.pairs.length) add('fehler', 'doppelte Schlüssel in den Zuordnungen');
        const descr = new Set(task.pairs.map(p => plain(p.description)));
        if (descr.size !== task.pairs.length) add('fehler', 'zwei Zuordnungen mit derselben Beschreibung');
        /* AuD-Bootcamp, 2026-08-07: Begriff und Beschreibung werden über
           textContent gesetzt (engine.js: make('div','lbl',p.term) und
           tk.textContent = p.description). HTML erscheint dort LITERAL. */
        task.pairs.forEach((p, i) => {
          if (markup(p.term)) add('fehler', 'Zuordnung ' + (i + 1) + ': Markup im Begriff erscheint als Text');
          if (markup(p.description)) add('fehler', 'Zuordnung ' + (i + 1) + ': Markup in der Beschreibung erscheint als Text');
        });
        break;
      }

      case 'order': {
        if (task.items.length < 3) add('hinweis', 'nur ' + task.items.length + ' Elemente zu sortieren');
        if (new Set(task.items).size !== task.items.length) add('fehler', 'doppeltes Element in der Reihenfolge');
        /* AuD-Bootcamp, 2026-08-07: .order__label wird über textContent gesetzt. */
        task.items.forEach((it, i) => {
          if (markup(it)) add('fehler', 'Element ' + (i + 1) + ': Markup erscheint als Text');
        });
        break;
      }

      case 'hotspot': {
        if (!task.zones.length) add('fehler', 'Hotspot ohne Trefferzone');
        if (!task.image) add('fehler', 'Hotspot ohne Bild');
        task.zones.forEach((z, i) => {
          if (z.x < 0 || z.x > 100 || z.y < 0 || z.y > 100) {
            add('fehler', 'Zone ' + (i + 1) + ' liegt außerhalb des Bildes');
          }
          if (z.r <= 0 || z.r > 25) add('hinweis', 'Zone ' + (i + 1) + ': Radius ' + z.r + ' % ist unplausibel');
          if (!String(z.label || '').trim()) add('fehler', 'Zone ' + (i + 1) + ' ohne Beschriftung');
        });
        /* Überlappende Zonen wären mehrdeutig — dann gibt es zwei richtige
           Antworten auf dieselbe Frage. */
        for (let a = 0; a < task.zones.length; a++) {
          for (let b = a + 1; b < task.zones.length; b++) {
            const za = task.zones[a], zb = task.zones[b];
            if (Math.hypot(za.x - zb.x, za.y - zb.y) < za.r + zb.r) {
              add('fehler', 'Zonen "' + za.label + '" und "' + zb.label + '" überlappen');
            }
          }
        }
        break;
      }

      case 'estimate': {
        if (task.tol <= 0) add('fehler', 'Toleranz muss größer als 0 sein');
        if (task.answer < task.min || task.answer > task.max) {
          add('fehler', 'Antwort liegt außerhalb der Skala');
        }
        /* Ein Wert, den die Schrittweite nicht trifft, ist unerreichbar — der
           Lernende könnte die Aufgabe nie richtig lösen. */
        const off = Math.abs((task.answer - task.min) / task.step - Math.round((task.answer - task.min) / task.step));
        if (off > 1e-6) add('fehler', 'Antwort ist mit der Schrittweite nicht erreichbar');
        if (task.tol >= (task.max - task.min) / 4) add('hinweis', 'Toleranzband ist sehr großzügig');
        break;
      }

      case 'matrix': {
        task.rows.forEach((r, i) => {
          if (r.correct.length !== task.columns.length) {
            add('fehler', 'Zeile ' + (i + 1) + ' hat ' + r.correct.length + ' Werte für ' + task.columns.length + ' Spalten');
          }
        });
        if (task.columns.length > 4) add('hinweis', task.columns.length + ' Spalten — auf Mobil schwer bedienbar');
        if (!task.rows.some(r => r.correct.some(Boolean))) add('fehler', 'kein einziges Kreuz ist richtig');
        break;
      }

      case 'forecast': {
        if (!task.fields.length) add('fehler', 'Prognose ohne Feld');
        task.fields.forEach((f, i) => {
          if (f.kind === 'number' && f.tol <= 0) add('fehler', 'Feld ' + (i + 1) + ': Toleranz muss größer als 0 sein');
          if (f.kind === 'select' && f.options.indexOf(f.answer) < 0) {
            add('fehler', 'Feld ' + (i + 1) + ': Antwort steht nicht in den Optionen');
          }
          /* AuD-Bootcamp, 2026-08-07: dieselbe Falle wie bei cloze, siehe oben. */
          if (f.kind === 'select') {
            (f.options || []).forEach(v => {
              if (normalisiert(v)) {
                add('fehler', 'Feld ' + (i + 1) + ': „' + v + '" wird vom Browser umgeschrieben');
              }
              if (markup(v)) {
                add('fehler', 'Feld ' + (i + 1) + ': „' + v + '" enthält Markup, das als Text erscheint');
              }
            });
          }
        });
        break;
      }

      case 'calc': {
        if (!task.steps.length) add('fehler', 'Rechenweg ohne Schritt');
        task.steps.forEach((s, i) => {
          if (!String(s.hint || '').trim()) add('fehler', 'Schritt ' + (i + 1) + ' ohne Tipp');
          if (s.tol <= 0) add('hinweis', 'Schritt ' + (i + 1) + ': Toleranz 0 verlangt exakte Eingabe');
          if (leaksAnswer(s.hint, s.answer)) add('fehler', 'Schritt ' + (i + 1) + ': der Tipp nennt das Ergebnis');
        });
        /* Regel: keine Formel in der Aufgabenstellung, sondern erst im Schritt.
           Vorher wäre sie reines Abschreiben. */
        if (/=/.test(plain(task.prompt)) && task.steps.some(s => s.formula)) {
          add('hinweis', 'die Aufgabenstellung enthält ein Gleichheitszeichen — verrät sie die Formel?');
        }
        break;
      }

      default:
        add('fehler', 'unbekannter Aufgabentyp "' + task.type + '"');
    }
  }

  WB.validate = function validate(sheet) {
    const out = [];
    const tasks = WB.sheetTasks(sheet);
    const id = sheet.id || sheet.title || 'Blatt';

    if (!tasks.length) {
      out.push({ level: 'fehler', where: id, message: 'Blatt ohne Aufgaben' });
      return out;
    }

    /* Nummerierung muss lückenlos ab 1 laufen, sonst zeigen die Punkte in der
       Seitenleiste ins Leere. */
    tasks.forEach((t, i) => {
      if (t.id !== i + 1) {
        out.push({
          level: 'fehler',
          where: id + ' Aufgabe ' + t.id,
          message: 'Nummerierung springt — erwartet ' + (i + 1)
        });
      }
    });

    tasks.forEach(t => checkTask(t, id + ' Aufgabe ' + t.id + ' (' + t.type + ')', out));

    /* Regel: die Hälfte der Aufgaben ist schwer. 45 % lässt Luft für ein Blatt
       mit ungerader Aufgabenzahl. */
    const hard = tasks.filter(t => t.difficulty === 'schwer').length;
    const share = Math.round((hard / tasks.length) * 100);
    if (share < 45) {
      out.push({
        level: 'hinweis',
        where: id,
        message: 'nur ' + share + ' % schwere Aufgaben (' + hard + ' von ' + tasks.length + ') — gefordert ist die Hälfte'
      });
    }

    /* ── Klausurmodus ────────────────────────────────────────────────────────
       Ein Blatt mit `klausur: { minuten, bestehen }` rechnet nicht mit
       BASE × MULT, sondern mit dem Feld `punkte` je Aufgabe. Fehlt es an einer
       einzigen Stelle, fällt genau diese Aufgabe still auf die Lernblatt-
       Rechnung zurück und die Gesamtsumme stimmt nicht mehr — das sieht man
       der Seite nicht an, deshalb ist es ein FEHLER und kein Hinweis. */
    if (sheet.klausur) {
      const ohne = tasks.filter(t => typeof t.punkte !== 'number');
      ohne.forEach(t => {
        out.push({
          level: 'fehler',
          where: id + ' Aufgabe ' + t.id,
          message: 'Klausurmodus, aber kein Feld `punkte`'
        });
      });

      if (!ohne.length && typeof sheet.klausur.gesamt === 'number') {
        const summe = tasks.reduce((s, t) => s + t.punkte, 0);
        if (summe !== sheet.klausur.gesamt) {
          out.push({
            level: 'fehler',
            where: id,
            message: 'Punktsumme ' + summe + ' weicht von der angekündigten Gesamtpunktzahl '
                     + sheet.klausur.gesamt + ' ab'
          });
        }
      }

      if (typeof sheet.klausur.bestehen !== 'number' || typeof sheet.klausur.minuten !== 'number') {
        out.push({
          level: 'fehler',
          where: id,
          message: '`klausur` braucht `minuten` und `bestehen` als Zahlen'
        });
      }
    }

    /* Ein Blatt aus vier Choice-Aufgaben prüft Wiedererkennen, nicht Können. */
    const types = new Set(tasks.map(t => t.type));
    if (types.size < 4) {
      out.push({
        level: 'hinweis',
        where: id,
        message: 'nur ' + types.size + ' Aufgabentypen — mehr Abwechslung prüft mehr als Wiedererkennen'
      });
    }

    return out;
  };

  /** Menschenlesbare Ausgabe, für die Prüfleiste im Blatt selbst. */
  WB.validateReport = function validateReport(sheet) {
    const issues = WB.validate(sheet);
    const errors = issues.filter(i => i.level === 'fehler');
    return {
      issues,
      errors,
      ok: errors.length === 0,
      text: issues.length
        ? issues.map(i => (i.level === 'fehler' ? 'FEHLER  ' : 'Hinweis ') + i.where + ' — ' + i.message).join('\n')
        : 'Keine Regelverstöße.'
    };
  };

})(window.WB);
