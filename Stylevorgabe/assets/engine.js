/* ============================================================================
   engine.js — Datenmodell, Bewertung, Fortschritt und Renderer
   ---------------------------------------------------------------------------
   Eine Aufgabe ist ein OBJEKT, kein handgeschriebenes Markup. Das ist die
   wichtigste Entscheidung dieser Datei, und sie hat drei Gründe:

     1. Die Redaktionsregeln werden maschinell prüfbar. Antwortlängen, Anteil
        schwerer Aufgaben, Fettdruck in Optionen, überlappende Trefferzonen —
        validate.js prüft das am Objekt. An Markup wäre es eine Bitte.
     2. Die Bewertung ist eine reine Funktion ohne DOM und damit nachrechenbar.
     3. Kein Copy-Paste-Drift. Früher waren es 50 Zeilen Markup je Aufgabe; bei
        18 Aufgaben über mehrere Blätter driftet das garantiert auseinander.

   Klassisches Skript, kein ES-Modul: die Blätter werden per Doppelklick von
   file:// geöffnet, und dort scheitert <script type="module"> an CORS. Ebenso
   gibt es kein fetch — Aufgabendaten kommen als eigene .js-Datei, die
   WB.register() aufruft.

   Einbindung in einem Blatt, in dieser Reihenfolge:

     <link rel="stylesheet" href="assets/styles.css">
     …
     <div data-sheet></div>
     <script src="assets/engine.js"></script>
     <script src="assets/validate.js"></script>     (optional, nur zum Prüfen)
     <script src="Blattname.data.js"></script>      ruft WB.register(…)
     <script src="assets/audit.js"></script>        (optional, nur zum Prüfen)

   Öffentlich:
     WB.register(sheet)   Blatt anmelden, rendern, verdrahten, Stand laden
     WB.grade             je Aufgabentyp eine reine Bewertungsfunktion
     WB.progress          Punkte, Serie, Auszeichnungen, Sterne
     WB.store             Stand in localStorage, je Dateipfad getrennt
     WB.autosolve()       löst das Blatt über echte Klicks (nur fürs Prüfwerkzeug)
     WB.sheets            alle angemeldeten Blätter
   ============================================================================ */

window.WB = window.WB || {};

(function (WB) {
  'use strict';

  /* ══════════════════════════════════════════════════════════════════════════
     1 · Punktevergabe
     ══════════════════════════════════════════════════════════════════════════
     Basis 10 Punkte, mal Schwierigkeit. Damit zählt die geforderte Hälfte
     schwerer Aufgaben auch im Ergebnis sichtbar mehr — vorher waren alle
     Aufgaben gleich viel wert, was die Anstrengung nicht abgebildet hat.

     Ein Rechenweg zahlt je Schritt und einen Abschlussbonus in Schritthöhe:
     wer den letzten Schritt schafft, hat die ganze Kette verstanden.           */

  const BASE_POINTS = 10;
  const STEP_POINTS = 5;
  const MULT = { leicht: 1, mittel: 1.5, schwer: 2 };

  /* Zweitversuch zu halber Punktzahl. Die alte Engine war one-shot; für ein
     Lernblatt ist das demotivierend — wer einmal falsch klickt, hat die Aufgabe
     verloren, ohne sie verstanden zu haben. */
  const RETRY_FACTOR = 0.5;
  /* Serie: ab der dritten richtigen Antwort hintereinander gibt es Bonus. */
  const COMBO_EVERY = 3;
  const COMBO_BONUS = 5;

  function stepPoints(task) {
    return Math.round(STEP_POINTS * MULT[task.difficulty]);
  }

  function maxPoints(task) {
    const m = MULT[task.difficulty] || 1;
    if (task.type === 'calc') {
      const s = stepPoints(task);
      return task.steps.length * s + s;
    }
    return Math.round(BASE_POINTS * m);
  }

  function sheetTasks(sheet) {
    return sheet.parts.reduce((all, p) => all.concat(p.tasks), []);
  }

  /** Der Serienbonus, den ein lückenloser Lauf erreicht. Er MUSS in die
      Höchstpunktzahl eingehen: er wird in `score` mitgezählt, und ohne ihn im
      Nenner käme ein fehlerfreier Lauf auf 109 % — die angezeigte Höchstzahl
      wäre dann eine, die niemand erreichen kann, ohne sie zu überschreiten. */
  function maxCombo(count) {
    return Math.floor(count / COMBO_EVERY) * COMBO_BONUS;
  }

  function sheetMaxPoints(sheet) {
    const tasks = sheetTasks(sheet);
    return tasks.reduce((s, t) => s + maxPoints(t), 0) + maxCombo(tasks.length);
  }

  WB.BASE_POINTS = BASE_POINTS;
  WB.STEP_POINTS = STEP_POINTS;
  WB.MULT = MULT;
  WB.maxPoints = maxPoints;
  WB.stepPoints = stepPoints;
  WB.sheetTasks = sheetTasks;
  WB.sheetMaxPoints = sheetMaxPoints;

  /* ══════════════════════════════════════════════════════════════════════════
     2 · Kleine Helfer
     ══════════════════════════════════════════════════════════════════════════ */

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => [].slice.call((r || document).querySelectorAll(s));

  /** Deutsche Zahleneingabe: „12,5" und „12.5" sind beide gemeint. */
  function parseNumber(raw) {
    if (raw === null || raw === undefined) return NaN;
    const s = String(raw).trim().replace(/\s/g, '').replace(',', '.');
    if (!s) return NaN;
    return Number(s);
  }

  /** Deutsche Zahlenausgabe. */
  function num(v, digits) {
    return Number(v).toFixed(digits === undefined ? 1 : digits).replace('.', ',');
  }

  /** Mischt eine Kopie. Aufgabendaten stehen in der richtigen Reihenfolge da;
      gemischt wird erst bei der Anzeige, damit die Lösung im Objekt lesbar ist. */
  function shuffled(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /** Erlaubtes Inline-HTML in Prosafeldern. Die Inhalte stammen ausschließlich
      aus den .data.js-Dateien dieses Ordners, nie aus einer Eingabe. */
  function html(el, s) { el.innerHTML = s === undefined || s === null ? '' : String(s); }

  function make(tag, cls, text) {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (text !== undefined && text !== null) el.textContent = text;
    return el;
  }

  WB.parseNumber = parseNumber;
  WB.num = num;

  /* ══════════════════════════════════════════════════════════════════════════
     3 · Bewertung — reine Funktionen, kein DOM
     ══════════════════════════════════════════════════════════════════════════
     Jede gibt einen Anteil zwischen 0 und 1 zurück. 1 heißt vollständig richtig.
     Teilpunkte gibt es nur dort, wo Teilwissen echtes Wissen ist: beim Schätzen
     und bei mehrfeldrigen Aufgaben. Bei einer Auswahl ist halb richtig falsch.  */

  const grade = {
    /** answer: Array der angekreuzten Indizes. */
    choice(task, answer) {
      const correct = task.options
        .map((o, i) => (o.correct ? i : -1)).filter(i => i >= 0).sort().join(',');
      return answer.slice().sort().join(',') === correct ? 1 : 0;
    },

    /** answer: Array der Eingaben, in der Reihenfolge der Lücken. */
    cloze(task, answer) {
      const gaps = task.segments.filter(s => s.kind !== 'text');
      let hit = 0;
      gaps.forEach((g, i) => {
        const given = String(answer[i] === undefined ? '' : answer[i]).trim();
        if (g.kind === 'select') {
          if (given === g.answer) hit++;
        } else if (given.toLowerCase() === String(g.answer).toLowerCase()) hit++;
      });
      return gaps.length ? (hit === gaps.length ? 1 : 0) : 0;
    },

    /** answer: Objekt { pairKey: gewaehlteBeschreibung }. */
    dnd(task, answer) {
      const hit = task.pairs.filter(p => answer[p.key] === p.description).length;
      return hit === task.pairs.length ? 1 : 0;
    },

    /** answer: Array der Elemente in der gelegten Reihenfolge. */
    order(task, answer) {
      return answer.join('') === task.items.join('') ? 1 : 0;
    },

    /** answer: Array von { x, y } in Prozent, in der Reihenfolge der Zonen.
        Die y-Toleranz wird über das Seitenverhältnis umgerechnet, damit der
        Trefferbereich ein Kreis bleibt und keine Ellipse. */
    hotspot(task, answer, aspect) {
      const a = aspect || 1;
      let hit = 0;
      task.zones.forEach((z, i) => {
        const m = answer[i];
        if (!m) return;
        const dx = m.x - z.x;
        const dy = (m.y - z.y) / a;   /* y in Breiten-Prozent umrechnen */
        if (Math.sqrt(dx * dx + dy * dy) <= z.r) hit++;
      });
      return hit === task.zones.length ? 1 : 0;
    },

    /** Volltreffer innerhalb ±tol, halber Treffer innerhalb ±2·tol.
        Schätzen ist die einzige Aufgabe mit Teilpunkten aus einem Einzelwert:
        „fast richtig" ist beim Schätzen eine echte Leistung. */
    estimate(task, answer) {
      const d = Math.abs(Number(answer) - task.answer);
      if (d <= task.tol) return 1;
      if (d <= task.tol * 2) return 0.5;
      return 0;
    },

    /** answer: Array von Arrays mit Booleans, Zeile × Spalte. */
    matrix(task, answer) {
      let cells = 0, hit = 0;
      task.rows.forEach((row, r) => {
        row.correct.forEach((want, c) => {
          cells++;
          const got = !!(answer[r] && answer[r][c]);
          if (got === want) hit++;
        });
      });
      return cells ? (hit === cells ? 1 : 0) : 0;
    },

    /** Anteil richtiger Felder — hier ist Teilwissen echtes Wissen. */
    forecast(task, answer) {
      let hit = 0;
      task.fields.forEach((f, i) => {
        const given = answer[i];
        if (f.kind === 'number') {
          if (Math.abs(parseNumber(given) - f.answer) <= f.tol) hit++;
        } else if (String(given) === f.answer) hit++;
      });
      return task.fields.length ? hit / task.fields.length : 0;
    },

    /** Ein einzelner Rechenschritt. */
    calcStep(step, given) {
      return Math.abs(parseNumber(given) - step.answer) <= step.tol;
    }
  };

  /** Die richtige Antwort in der Form, die die Anzeige erwartet. Grundlage der
      Auflösung und des Selbstlösens. */
  function solutionFor(task) {
    switch (task.type) {
      case 'choice':   return task.options.map((o, i) => (o.correct ? i : -1)).filter(i => i >= 0);
      case 'cloze':    return task.segments.filter(s => s.kind !== 'text').map(s => s.answer);
      case 'dnd':      { const o = {}; task.pairs.forEach(p => { o[p.key] = p.description; }); return o; }
      case 'order':    return task.items.slice();
      case 'hotspot':  return task.zones.map(z => ({ x: z.x, y: z.y }));
      case 'estimate': return task.answer;
      case 'matrix':   return task.rows.map(r => r.correct.slice());
      case 'forecast': return task.fields.map(f => f.answer);
      case 'calc':     return task.steps.map(s => s.answer);
      default:         return null;
    }
  }

  WB.grade = grade;
  WB.solutionFor = solutionFor;

  /* ══════════════════════════════════════════════════════════════════════════
     4 · Stand speichern
     ══════════════════════════════════════════════════════════════════════════
     localStorage, Schlüssel aus dem VOLLEN Dateipfad. Auf file:// teilen sich
     ALLE Dokumente einen Ursprung — es gibt keinen Ursprung je Ordner, keinen
     je Laufwerk, einen für alles.

     Der Schlüssel enthielt zuerst nur den Dateinamen, und das war falsch: dieses
     Repo wird in JEDEN Modulordner geklont. Zwei Module mit einem
     `Modul_01_Grundlagen.html` hätten sich die Stände gegenseitig
     überschrieben — man löst ein Blatt in Mathe 2 und findet es in CCN gelöst
     vor. Aufgefallen beim Kopiertest, bei dem ein Blatt in einem anderen Ordner
     seinen alten Stand mitbrachte.

     Alles in try/catch: manche Browser sperren localStorage auf file:// ganz.
     Dann läuft das Blatt weiter, nur der Stand überlebt kein Neuladen — und
     WB.store.blocked sagt das, damit der Hub es anzeigen kann. Als Ausweg gibt
     es Export und Import als JSON.                                             */

  const store = {
    blocked: false,

    /** Der Dateiname dieses Dokuments, ohne Pfad. */
    file() {
      return decodeURIComponent(location.pathname)
        .replace(/\\/g, '/').split('/').pop() || 'blatt';
    },

    /** Der Ordner dieses Dokuments, mit abschließendem Schrägstrich. */
    dir() {
      const p = decodeURIComponent(location.pathname).replace(/\\/g, '/');
      return p.slice(0, p.lastIndexOf('/') + 1);
    },

    /** Löst `../` und `./` auf, damit derselbe Ort immer denselben Schlüssel
        ergibt — egal ob von der Übersicht oder aus einem Unterordner
        adressiert. */
    resolve(file) {
      const parts = (this.dir() + String(file)).split('/');
      const out = [];
      parts.forEach(seg => {
        if (seg === '.' || seg === '') return;
        if (seg === '..') { out.pop(); return; }
        out.push(seg);
      });
      return '/' + out.join('/');
    },

    /** Schlüssel eines BELIEBIGEN Blattes, relativ zu diesem Dokument. Der Hub
        braucht das: er muss die Stände von Blättern lesen, auf denen er nicht
        steht. */
    keyFor(file, suffix) {
      return 'wb:' + this.resolve(file) + (suffix ? ':' + suffix : '');
    },

    key(suffix) { return this.keyFor(this.file(), suffix); },

    read(suffix) { return this.readFor(this.file(), suffix); },

    readFor(file, suffix) {
      try {
        const raw = localStorage.getItem(this.keyFor(file, suffix));
        return raw ? JSON.parse(raw) : null;
      } catch (e) { this.blocked = true; return null; }
    },

    write(suffix, value) {
      try {
        localStorage.setItem(this.key(suffix), JSON.stringify(value));
        return true;
      } catch (e) { this.blocked = true; return false; }
    },

    clear(suffix) {
      try { localStorage.removeItem(this.key(suffix)); } catch (e) { /* egal */ }
    },

    /** Alle Stände dieses Rechners — für den Hub und den Export. */
    all() {
      const out = {};
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.indexOf('wb:') === 0) out[k] = JSON.parse(localStorage.getItem(k));
        }
      } catch (e) { this.blocked = true; }
      return out;
    },

    exportJSON() { return JSON.stringify(this.all(), null, 2); },

    importJSON(text) {
      let data;
      try { data = JSON.parse(text); } catch (e) { return false; }
      let ok = true;
      Object.keys(data).forEach(k => {
        try { localStorage.setItem(k, JSON.stringify(data[k])); } catch (e) { ok = false; }
      });
      return ok;
    }
  };

  WB.store = store;

  /* ══════════════════════════════════════════════════════════════════════════
     5 · Fortschritt
     ══════════════════════════════════════════════════════════════════════════ */

  function createProgress(sheet) {
    const tasks = sheetTasks(sheet);
    const state = {};   /* id -> { state, tries, points, stepsDone } */
    tasks.forEach(t => { state[t.id] = { state: 'offen', tries: 0, points: 0, stepsDone: 0 }; });

    const p = {
      sheet,
      tasks,
      score: 0,
      bonus: 0,
      combo: 0,
      comboBest: 0,

      get maxScore() { return sheetMaxPoints(sheet); },
      get total() { return tasks.length; },
      get solved() { return tasks.filter(t => state[t.id].state !== 'offen').length; },
      get done() { return tasks.filter(t => state[t.id].state === 'done').length; },
      get wrong() { return tasks.filter(t => state[t.id].state === 'wrong').length; },
      get percent() {
        const m = this.maxScore;
        return m ? Math.round((this.score / m) * 100) : 0;
      },
      get finished() { return this.solved === this.total && this.total > 0; },
      /** Alles richtig und ohne Zweitversuch. */
      get perfect() { return this.done === this.total && tasks.every(t => state[t.id].tries <= 1); },
      /** Alles richtig, Zweitversuche erlaubt. */
      get clean() { return this.done === this.total; },
      get stars() {
        const pc = this.percent;
        if (pc >= 98) return 5;
        if (pc >= 85) return 4;
        if (pc >= 70) return 3;
        if (pc >= 50) return 2;
        return 1;
      },
      get badges() {
        const hard = tasks.filter(t => t.difficulty === 'schwer');
        return {
          perfekt:       this.perfect,
          schwergewicht: hard.length > 0 && hard.every(t => state[t.id].state === 'done'),
          serie:         this.comboBest >= COMBO_EVERY,
          bestnote:      this.percent >= 98,
          sauber:        this.wrong === 0 && this.solved > 0,
          vollstaendig:  this.finished
        };
      },

      get(id) { return state[id]; },

      /** Eine Aufgabe abschließen. ratio 1 = ganz richtig.
          pointsOverride für den Rechenweg: dort sind die Schrittpunkte schon
          über addStepPoints() vergeben, übergeben wird nur noch der
          Abschlussbonus. Deshalb wird hier ADDIERT und nicht gesetzt — mit
          `st.points = pts` hätte ein Rechenweg seine Schrittpunkte verloren,
          und mit der vollen Summe als Override hätte er sie doppelt gezählt
          (70 statt 40 Punkten bei drei Schritten). */
      settle(task, ratio, pointsOverride) {
        const st = state[task.id];
        if (st.state !== 'offen') return 0;
        st.tries++;

        const factor = st.tries > 1 ? RETRY_FACTOR : 1;
        const pts = pointsOverride !== undefined
          ? pointsOverride
          : Math.round(maxPoints(task) * ratio * factor);

        st.points += pts;
        st.state = ratio >= 1 ? 'done' : 'wrong';
        this.score += pts;

        if (ratio >= 1) {
          this.combo++;
          if (this.combo > this.comboBest) this.comboBest = this.combo;
          if (this.combo % COMBO_EVERY === 0) {
            this.bonus += COMBO_BONUS;
            this.score += COMBO_BONUS;
            toast('Serie ×' + this.combo + '  +' + COMBO_BONUS);
          }
        } else {
          this.combo = 0;
        }

        this.persist();
        this.emit(task, pts);
        return pts;
      },

      /** Punkte für einen einzelnen Rechenschritt, sofort. */
      addStepPoints(task, pts) {
        state[task.id].stepsDone++;
        state[task.id].points += pts;
        this.score += pts;
        this.persist();
        this.emit(task, pts);
      },

      /** Ein Fehlversuch, der die Aufgabe nicht abschließt. */
      noteTry(task) { state[task.id].tries++; },

      persist() {
        /* maxScore und total gehören MIT in den Stand. Ohne sie kann die
           Übersicht keinen Prozentwert bilden — sie kennt das Blatt nicht, sie
           hat nur dessen Stand. Sonst müsste jede Blattgröße doppelt gepflegt
           werden: einmal in den Aufgabendaten, einmal in der Übersicht, und beim
           19. Aufgabe wäre eine davon falsch. */
        store.write('progress', {
          score: this.score, bonus: this.bonus, comboBest: this.comboBest,
          maxScore: this.maxScore, total: this.total,
          badges: this.badges, stars: this.stars,
          state
        });
      },

      restore() {
        /* Ein Prüflauf muss bei Null anfangen. Sonst findet er die Aufgaben
           bereits abgeschlossen vor, der Selbstlöser klickt ins Leere und die
           Punktzahl bleibt auf dem alten Stand stehen — ein grüner Lauf, der
           nichts geprüft hat. */
        if (/^#(auto|audit|autoaudit|validate|pruefen)$/i.test(location.hash)) return false;
        const saved = store.read('progress');
        if (!saved || !saved.state) return false;
        /* Nur übernehmen, was zu diesem Blatt passt — sonst kippt ein
           geändertes Blatt einen alten Stand in einen unmöglichen Zustand. */
        let taken = 0;
        tasks.forEach(t => {
          const s = saved.state[t.id];
          if (s && typeof s.state === 'string') { state[t.id] = s; taken++; }
        });
        if (!taken) return false;
        this.score = saved.score || 0;
        this.bonus = saved.bonus || 0;
        this.comboBest = saved.comboBest || 0;
        return true;
      },

      reset() {
        tasks.forEach(t => { state[t.id] = { state: 'offen', tries: 0, points: 0, stepsDone: 0 }; });
        this.score = 0; this.bonus = 0; this.combo = 0; this.comboBest = 0;
        store.clear('progress');
      },

      /** Die einzige Schnittstelle nach außen. Ein Hub, ein Kanban-Board oder
          später eine Datenbank hängen sich hier an, ohne dass ein Blatt sich
          ändern muss. */
      emit(task, points) {
        document.dispatchEvent(new CustomEvent('wb:progress', {
          detail: {
            sheet: sheet.id,
            taskId: task ? task.id : null,
            type: task ? task.type : null,
            state: task ? state[task.id].state : null,
            points: points || 0,
            score: this.score, maxScore: this.maxScore,
            solved: this.solved, total: this.total,
            percent: this.percent, bonus: this.bonus,
            stars: this.stars, badges: this.badges, finished: this.finished
          }
        }));
      }
    };

    return p;
  }

  /* ══════════════════════════════════════════════════════════════════════════
     6 · Toast
     ══════════════════════════════════════════════════════════════════════════ */

  let toastEl = null;
  let toastTimer = null;
  function toast(msg) {
    if (!toastEl) {
      toastEl = make('div', 'toast');
      toastEl.setAttribute('role', 'status');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 1900);
  }
  WB.toast = toast;

  /* ══════════════════════════════════════════════════════════════════════════
     7 · Renderer
     ══════════════════════════════════════════════════════════════════════════
     Baut aus einem Aufgabenobjekt das Markup, das @TASKCARD, @QUIZ und
     @QUIZPLUS in styles.css erwarten. Jede Renderfunktion gibt ein Objekt mit
     `read()` zurück — der Weg von der Bedienung zur Antwort. Damit bleibt die
     Bewertung frei von DOM-Wissen.                                             */

  const DIFF_LABEL = { leicht: 'Leicht', mittel: 'Mittel', schwer: 'Schwer' };

  function renderTask(task, prog) {
    const art = make('article', 'task');
    art.id = 'task-' + task.id;
    art.setAttribute('data-task-id', task.id);
    art.setAttribute('data-type', task.type);
    art.setAttribute('data-difficulty', task.difficulty);
    art.setAttribute('role', 'group');
    art.setAttribute('aria-labelledby', 'task-' + task.id + '-title');

    /* ── Kopf ── */
    const head = make('header', 'task__head');
    head.appendChild(make('div', 'task__num', String(task.id).padStart(2, '0')));
    const titles = make('div', 'task__titles');
    titles.appendChild(make('div', 'task__eyebrow', task.eyebrow || ''));
    const h3 = make('h3', 'task__title');
    h3.id = 'task-' + task.id + '-title';
    html(h3, task.title);
    titles.appendChild(h3);
    head.appendChild(titles);
    const meta = make('div', 'task__meta');
    meta.appendChild(make('span', 'chip chip--' + task.difficulty, DIFF_LABEL[task.difficulty]));
    const status = make('span', 'task__status', 'Offen');
    status.setAttribute('data-status', '');
    meta.appendChild(status);
    head.appendChild(meta);
    art.appendChild(head);

    /* ── Körper ── */
    const body = make('div', 'task__body');
    const q = make('div', 'q');
    const qp = make('p');
    html(qp, task.prompt);
    q.appendChild(qp);
    body.appendChild(q);

    const control = TYPE[task.type](task, body);

    /* ── Knopfreihe ── */
    const btnrow = make('div', 'btnrow');
    const btn = make('button', 'act', 'Antwort prüfen');
    btn.type = 'button';
    btnrow.appendChild(btn);
    /* Beim Rechenweg prüft jeder Schritt selbst — ein Sammelknopf wäre
       irreführend. */
    if (task.type !== 'calc') body.appendChild(btnrow);

    /* ── Rückmeldung ── */
    const fb = make('div', 'fb');
    fb.setAttribute('aria-live', 'polite');
    const fbHead = make('div', 'head');
    const fbBody = make('div', 'body');
    fb.appendChild(fbHead); fb.appendChild(fbBody);
    body.appendChild(fb);

    /* ── Notizfeld, bewusst ohne Speicherung ── */
    const sol = make('div', 'solbox');
    const solHead = make('div', 'solbox__head');
    solHead.appendChild(make('div', 'solbox__title', 'Eigene Notiz'));
    solHead.appendChild(make('div', 'solbox__status', 'wird nicht gespeichert'));
    sol.appendChild(solHead);
    const ta = make('textarea', 'solbox__input');
    ta.placeholder = 'Rechnung, Begründung, offene Frage …';
    ta.setAttribute('aria-label', 'Eigene Notiz zu Aufgabe ' + task.id);
    sol.appendChild(ta);
    body.appendChild(sol);

    art.appendChild(body);

    /* ── Prüflogik ── */
    function showFeedback(ratio, retryLeft) {
      const ok = ratio >= 1;
      fb.className = 'fb show ' + (ok ? 'ok' : 'no');
      fbHead.textContent = ok ? 'Richtig'
        : (ratio > 0 ? 'Teilweise richtig' : 'Noch nicht');
      let s = task.feedback || '';
      if (!ok && task.wrongNote) s += '<div class="mute" style="margin-top:8px">' + task.wrongNote + '</div>';
      if (task.deep) s += '<div class="deep">' + task.deep + '</div>';
      if (retryLeft) s += '<span class="retry-note">Ein zweiter Versuch ist möglich — er zählt halb.</span>';
      html(fbBody, s);
    }

    function finishTask(ratio, pointsOverride) {
      const pts = prog.settle(task, ratio, pointsOverride);
      art.classList.add(ratio >= 1 ? 'is-done' : 'is-wrong');
      status.textContent = ratio >= 1 ? 'Gelöst' : 'Falsch';
      btn.disabled = true;
      control.lock && control.lock();
      control.reveal && control.reveal();
      showFeedback(ratio, false);
      if (pts) toast('+' + pts + ' Punkte');
      updateChrome(prog);
    }

    btn.addEventListener('click', () => {
      if (prog.get(task.id).state !== 'offen') return;
      const ratio = control.check();
      const tries = prog.get(task.id).tries;

      /* Erster Fehlversuch: nicht abschließen, einmal zurückgeben.
         Beim Schätzen nicht — der Regler steht schon auf dem eigenen Wert, ein
         Zweitversuch wäre reines Ausprobieren. */
      const mayRetry = ratio < 1 && tries === 0 && task.type !== 'estimate' && task.retry !== false;
      if (mayRetry) {
        prog.noteTry(task);
        showFeedback(ratio, true);
        control.softReset && control.softReset();
        btn.textContent = 'Zweiter Versuch prüfen';
        btn.classList.add('act--retry');
        return;
      }
      finishTask(ratio);
    });

    return {
      el: art,
      task,
      control,
      /* Für das Selbstlösen und die Wiederherstellung */
      button: btn,
      finishTask,
      markRestored(st) {
        art.classList.add(st.state === 'done' ? 'is-done' : 'is-wrong');
        status.textContent = st.state === 'done' ? 'Gelöst' : 'Falsch';
        btn.disabled = true;
        control.lock && control.lock();
        control.showSaved && control.showSaved();
        control.reveal && control.reveal();
        showFeedback(st.state === 'done' ? 1 : 0, false);
      }
    };
  }

  /* ── Die neun Typen ──────────────────────────────────────────────────────── */

  const TYPE = {

    choice(task, body) {
      if (task.multi) body.appendChild(make('div', 'multi-hint', 'Mehrere Antworten können richtig sein.'));
      const wrap = make('div', 'opts');
      const order = shuffled(task.options.map((o, i) => i));
      const inputs = [];
      order.forEach(idx => {
        const o = task.options[idx];
        const lab = make('label', 'opt');
        const inp = document.createElement('input');
        inp.type = task.multi ? 'checkbox' : 'radio';
        inp.name = 'q' + task.id;
        inp.setAttribute('data-idx', idx);
        const sp = make('span');
        html(sp, o.text);
        lab.appendChild(inp); lab.appendChild(sp);
        wrap.appendChild(lab);
        inputs.push({ inp, lab, idx, correct: o.correct });
      });
      body.appendChild(wrap);

      return {
        read: () => inputs.filter(i => i.inp.checked).map(i => i.idx),
        check() { return grade.choice(task, this.read()); },
        softReset() { inputs.forEach(i => { i.inp.checked = false; }); },
        lock() { inputs.forEach(i => { i.inp.disabled = true; }); },
        reveal() {
          inputs.forEach(i => {
            if (i.correct) {
              i.lab.classList.add('correct');
              i.lab.appendChild(make('span', 'mark', '✓'));
            } else if (i.inp.checked) {
              i.lab.classList.add('wrong');
              i.lab.appendChild(make('span', 'mark', '✗'));
            }
          });
        },
        setAnswer(idxs) { inputs.forEach(i => { i.inp.checked = idxs.indexOf(i.idx) >= 0; }); }
      };
    },

    cloze(task, body) {
      const wrap = make('div', 'cloze');
      const fields = [];
      task.segments.forEach(seg => {
        if (seg.kind === 'text') {
          const sp = make('span');
          html(sp, seg.text);
          wrap.appendChild(sp);
          return;
        }
        if (seg.kind === 'select') {
          const sel = document.createElement('select');
          sel.setAttribute('aria-label', 'Lücke ' + (fields.length + 1));
          sel.appendChild(make('option', null, '— wählen —'));
          shuffled([seg.answer].concat(seg.distractors)).forEach(v => {
            sel.appendChild(make('option', null, v));
          });
          wrap.appendChild(sel);
          fields.push({ el: sel, seg });
        } else {
          const inp = document.createElement('input');
          inp.type = 'text';
          inp.size = seg.width || 10;
          inp.setAttribute('aria-label', 'Lücke ' + (fields.length + 1));
          wrap.appendChild(inp);
          if (seg.unit) wrap.appendChild(make('span', null, ' ' + seg.unit));
          fields.push({ el: inp, seg });
        }
      });
      body.appendChild(wrap);

      return {
        read: () => fields.map(f => (f.el.value === '— wählen —' ? '' : f.el.value)),
        check() { return grade.cloze(task, this.read()); },
        softReset() { fields.forEach(f => { f.el.value = f.el.tagName === 'SELECT' ? '— wählen —' : ''; }); },
        lock() { fields.forEach(f => { f.el.disabled = true; }); },
        reveal() {
          fields.forEach(f => {
            const given = String(f.el.value).trim();
            const ok = f.seg.kind === 'select'
              ? given === f.seg.answer
              : given.toLowerCase() === String(f.seg.answer).toLowerCase();
            f.el.classList.add(ok ? 'correct' : 'wrong');
            if (!ok) {
              const s = make('span', 'sol', ' ' + f.seg.answer);
              f.el.parentNode.insertBefore(s, f.el.nextSibling);
            }
          });
        },
        setAnswer(vals) { fields.forEach((f, i) => { f.el.value = vals[i]; }); }
      };
    },

    dnd(task, body) {
      const grid = make('div', 'dnd');
      const poolCol = make('div', 'dndcol');
      poolCol.appendChild(make('h4', null, task.poolLabel || 'Beschreibung'));
      /* Nur `pool`. Das alte Markup schrieb hier `pool source`, aber `.source`
         hatte nie eine Regel und wird auch nirgends als Selektor gesucht — vom
         Klassenprüfer in bootcamp-check.ps1 gefunden. */
      const pool = make('div', 'pool');
      poolCol.appendChild(pool);

      const targCol = make('div', 'dndcol');
      targCol.appendChild(make('h4', null, task.targetLabel || 'Begriff'));

      const targets = {};
      task.pairs.forEach(p => {
        const t = make('div', 'target');
        t.setAttribute('data-key', p.key);
        const lbl = make('div', 'lbl', p.term);
        t.appendChild(lbl);
        targCol.appendChild(t);
        targets[p.key] = { el: t, lbl, pair: p };
      });

      const tokens = [];
      shuffled(task.pairs).forEach(p => {
        const tk = make('button', 'token');
        tk.type = 'button';
        tk.draggable = true;
        tk.textContent = p.description;
        pool.appendChild(tk);
        tokens.push(tk);
      });

      grid.appendChild(poolCol); grid.appendChild(targCol);
      body.appendChild(grid);
      body.appendChild(make('div', 'dnd__hint',
        'Ziehen — oder antippen und dann das Ziel antippen.'));

      /* ── Ziehen ── */
      let dragged = null;
      tokens.forEach(tk => {
        tk.addEventListener('dragstart', () => { dragged = tk; tk.classList.add('dragging'); });
        tk.addEventListener('dragend', () => { tk.classList.remove('dragging'); dragged = null; });
      });
      const zones = Object.keys(targets).map(k => targets[k].el).concat([pool]);
      zones.forEach(z => {
        z.addEventListener('dragover', e => { e.preventDefault(); z.classList.add('over'); });
        z.addEventListener('dragleave', () => z.classList.remove('over'));
        z.addEventListener('drop', e => {
          e.preventDefault(); z.classList.remove('over');
          if (!dragged) return;
          place(dragged, z);
        });
      });

      /* ── Antippen ──
         Der Begriff wird zum Knopf, sobald ein Token gewählt ist. Ein <button>
         im <button> wäre ungültiges Markup, deshalb ersetzt er das Label. */
      let picked = null;
      function setPicked(tk) {
        if (picked) picked.classList.remove('is-picked');
        picked = tk;
        Object.keys(targets).forEach(k => {
          const t = targets[k];
          if (tk) {
            t.lbl.className = 'lbl lbl--action';
            if (t.lbl.tagName !== 'BUTTON') {
              const b = make('button', 'lbl lbl--action', t.pair.term + '  ← hier einsetzen');
              b.type = 'button';
              b.addEventListener('click', () => { if (picked) place(picked, t.el); });
              t.el.replaceChild(b, t.lbl);
              t.lbl = b;
            } else {
              t.lbl.textContent = t.pair.term + '  ← hier einsetzen';
              t.lbl.disabled = false;
            }
          } else if (t.lbl.tagName === 'BUTTON') {
            t.lbl.textContent = t.pair.term;
            t.lbl.disabled = true;
            t.lbl.className = 'lbl';
          }
        });
        if (tk) tk.classList.add('is-picked');
      }
      tokens.forEach(tk => {
        tk.addEventListener('click', () => {
          if (tk.disabled) return;
          setPicked(picked === tk ? null : tk);
        });
      });

      function place(tk, zone) {
        /* Ein Ziel nimmt genau ein Token. Ein überzähliges geht zurück in den
           Pool — sonst prüft man nur das erste und der Rest verschwindet
           stillschweigend. Genau das war der Fehler der alten checkDnd(). */
        if (zone !== pool) {
          const already = $('.token', zone);
          if (already && already !== tk) pool.appendChild(already);
        }
        zone.appendChild(tk);
        tk.classList.toggle('placed', zone !== pool);
        setPicked(null);
      }

      return {
        read() {
          const o = {};
          Object.keys(targets).forEach(k => {
            const tk = $('.token', targets[k].el);
            o[k] = tk ? tk.textContent : null;
          });
          return o;
        },
        check() { return grade.dnd(task, this.read()); },
        softReset() { tokens.forEach(tk => { pool.appendChild(tk); tk.classList.remove('placed'); }); },
        lock() { tokens.forEach(tk => { tk.draggable = false; tk.disabled = true; }); setPicked(null); },
        reveal() {
          const got = this.read();
          task.pairs.forEach(p => {
            const t = targets[p.key];
            const ok = got[p.key] === p.description;
            t.el.classList.add(ok ? 'correct' : 'wrong');
            if (!ok) {
              const s = make('div', 'lbl', '→ ' + p.description);
              s.style.color = 'var(--easy)';
              t.el.appendChild(s);
            }
          });
        },
        setAnswer(map) {
          Object.keys(map).forEach(k => {
            const tk = tokens.filter(t => t.textContent === map[k])[0];
            if (tk) place(tk, targets[k].el);
          });
        }
      };
    },

    order(task, body) {
      const wrap = make('div', 'order');
      let items = shuffled(task.items);
      /* Falls der Zufall die richtige Reihenfolge trifft, wäre die Aufgabe
         geschenkt. Einmal drehen. */
      if (items.join('') === task.items.join('') && items.length > 1) {
        items = items.slice().reverse();
      }
      const rows = [];

      function paint() {
        wrap.innerHTML = '';
        rows.length = 0;
        items.forEach((text, i) => {
          const row = make('div', 'order__row');
          row.appendChild(make('span', 'order__pos', (i + 1) + '.'));
          row.appendChild(make('span', 'order__label', text));
          const up = make('button', 'order__btn', '▲');
          up.type = 'button';
          up.setAttribute('aria-label', 'nach oben: ' + text);
          up.disabled = i === 0;
          const dn = make('button', 'order__btn', '▼');
          dn.type = 'button';
          dn.setAttribute('aria-label', 'nach unten: ' + text);
          dn.disabled = i === items.length - 1;
          up.addEventListener('click', () => { swap(i, i - 1); });
          dn.addEventListener('click', () => { swap(i, i + 1); });
          row.appendChild(up); row.appendChild(dn);
          wrap.appendChild(row);
          rows.push(row);
        });
      }
      function swap(a, b) {
        if (b < 0 || b >= items.length) return;
        const t = items[a]; items[a] = items[b]; items[b] = t;
        paint();
      }
      paint();
      body.appendChild(wrap);

      return {
        read: () => items.slice(),
        check() { return grade.order(task, this.read()); },
        softReset() { /* Reihenfolge bleibt — neu mischen wäre gemein */ },
        lock() { $$('.order__btn', wrap).forEach(b => { b.disabled = true; }); },
        reveal() {
          items.forEach((text, i) => {
            rows[i].classList.add(text === task.items[i] ? 'correct' : 'wrong');
            if (text !== task.items[i]) {
              const s = make('span', 'order__pos', '→ ' + (task.items.indexOf(text) + 1));
              s.style.color = 'var(--easy)';
              rows[i].appendChild(s);
            }
          });
        },
        setAnswer(arr) { items = arr.slice(); paint(); }
      };
    },

    hotspot(task, body) {
      const hot = make('div', 'hot');
      const ask = make('div', 'hot__ask');
      hot.appendChild(ask);
      const stage = make('div', 'hot__stage');
      const img = document.createElement('img');
      img.src = task.image;
      img.alt = task.imageAlt || '';
      stage.appendChild(img);
      hot.appendChild(stage);
      body.appendChild(hot);

      const marks = [];
      function refreshAsk() {
        ask.textContent = marks.length >= task.zones.length
          ? 'Alle Marken gesetzt — jetzt prüfen. Nochmal klicken setzt neu.'
          : 'Jetzt markieren: ' + task.zones[marks.length].label +
            '   (' + (marks.length + 1) + ' von ' + task.zones.length + ')';
      }
      refreshAsk();

      let locked = false;
      stage.addEventListener('click', e => {
        if (locked) return;
        const r = stage.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width) * 100;
        const y = ((e.clientY - r.top) / r.height) * 100;
        if (marks.length >= task.zones.length) {
          marks.forEach(m => m.el.remove());
          marks.length = 0;
        }
        const el = make('div', 'hot__mark', String(marks.length + 1));
        el.style.left = x + '%';
        el.style.top = y + '%';
        stage.appendChild(el);
        marks.push({ x, y, el });
        refreshAsk();
      });

      function aspect() {
        const r = stage.getBoundingClientRect();
        return r.width && r.height ? r.width / r.height : 1;
      }

      return {
        read: () => marks.map(m => ({ x: m.x, y: m.y })),
        check() { return grade.hotspot(task, this.read(), aspect()); },
        softReset() { marks.forEach(m => m.el.remove()); marks.length = 0; refreshAsk(); },
        lock() { locked = true; ask.textContent = ''; },
        reveal() {
          const a = aspect();
          /* Der Ring trägt nur die Nummer, der Name steht in der Legende. Frei
             am Ring hängend wurde er von `overflow: hidden` der Bühne
             abgeschnitten, sobald eine Zone nicht in der Bildmitte lag. */
          const legend = make('ol', 'hot__legend');
          task.zones.forEach((z, i) => {
            const zEl = make('div', 'hot__zone');
            zEl.style.left = z.x + '%';
            zEl.style.top = z.y + '%';
            zEl.style.width = (z.r * 2) + '%';
            zEl.appendChild(make('span', 'num', String(i + 1)));
            stage.appendChild(zEl);

            const m = marks[i];
            let ok = false;
            if (m) {
              const dx = m.x - z.x, dy = (m.y - z.y) / a;
              ok = Math.sqrt(dx * dx + dy * dy) <= z.r;
              m.el.classList.add(ok ? 'correct' : 'wrong');
            }
            const li = make('li', m ? (ok ? 'correct' : 'wrong') : '');
            li.appendChild(make('span', 'n', (i + 1) + '.'));
            li.appendChild(make('span', 't', z.label));
            li.appendChild(make('span', 'v', !m ? 'nicht markiert' : ok ? 'getroffen' : 'daneben'));
            legend.appendChild(li);
          });
          hot.appendChild(legend);
        },
        setAnswer(pts) {
          this.softReset();
          pts.forEach((p, i) => {
            const el = make('div', 'hot__mark', String(i + 1));
            el.style.left = p.x + '%';
            el.style.top = p.y + '%';
            stage.appendChild(el);
            marks.push({ x: p.x, y: p.y, el });
          });
          refreshAsk();
        }
      };
    },

    estimate(task, body) {
      const est = make('div', 'est');
      const row = make('div', 'est__row');
      const slider = document.createElement('input');
      slider.type = 'range';
      slider.className = 'est__slider';
      slider.min = task.min; slider.max = task.max; slider.step = task.step;
      slider.value = (task.min + task.max) / 2;
      slider.setAttribute('aria-label', 'Schätzwert in ' + task.unit);
      const val = make('span', 'est__val', num(slider.value, task.step < 1 ? 1 : 0));
      const unit = make('span', 'est__unit', task.unit);
      row.appendChild(slider); row.appendChild(val); row.appendChild(unit);
      est.appendChild(row);
      const scale = make('div', 'est__scale');
      scale.appendChild(make('span', null, num(task.min, 0) + ' ' + task.unit));
      scale.appendChild(make('span', null, num(task.max, 0) + ' ' + task.unit));
      est.appendChild(scale);
      const truth = make('div', 'est__truth');
      est.appendChild(truth);
      body.appendChild(est);

      slider.addEventListener('input', () => {
        val.textContent = num(slider.value, task.step < 1 ? 1 : 0);
      });

      return {
        read: () => Number(slider.value),
        check() { return grade.estimate(task, this.read()); },
        lock() { slider.disabled = true; },
        reveal() {
          const r = grade.estimate(task, this.read());
          truth.className = 'est__truth show ' + (r >= 1 ? 'correct' : r > 0 ? 'near' : 'wrong');
          truth.textContent = (r >= 1 ? 'Treffer. ' : r > 0 ? 'Knapp daneben. ' : 'Daneben. ') +
            'Richtig sind ' + num(task.answer, task.step < 1 ? 1 : 0) + ' ' + task.unit +
            ' (± ' + num(task.tol, task.tol < 1 ? 1 : 0) + ').';
        },
        setAnswer(v) { slider.value = v; val.textContent = num(v, task.step < 1 ? 1 : 0); }
      };
    },

    matrix(task, body) {
      const wrap = make('div', 'mtx__wrap');
      const tbl = make('table', 'mtx');
      const thead = document.createElement('thead');
      const htr = document.createElement('tr');
      htr.appendChild(make('th', null, task.rowHeader || ''));
      task.columns.forEach(c => htr.appendChild(make('th', null, c)));
      thead.appendChild(htr); tbl.appendChild(thead);

      const tbody = document.createElement('tbody');
      const cells = [];
      task.rows.forEach((row, r) => {
        const tr = document.createElement('tr');
        const td0 = document.createElement('td');
        html(td0, row.label);
        tr.appendChild(td0);
        const rowCells = [];
        task.columns.forEach((c, ci) => {
          const td = make('td', 'mtx__cell');
          const inp = document.createElement('input');
          /* Ein Kreuz je Zeile? Dann Radios — das verhindert, dass man alles
             ankreuzt und hofft. Sonst Checkboxen. */
          const single = row.correct.filter(Boolean).length === 1;
          inp.type = single ? 'radio' : 'checkbox';
          inp.name = 'm' + task.id + '_' + r;
          inp.setAttribute('aria-label', row.label + ' — ' + c);
          td.appendChild(inp);
          td.addEventListener('click', e => {
            if (e.target !== inp && !inp.disabled) { inp.checked = !inp.checked; }
          });
          tr.appendChild(td);
          rowCells.push({ td, inp, want: row.correct[ci] });
        });
        tbody.appendChild(tr);
        cells.push(rowCells);
      });
      tbl.appendChild(tbody);
      wrap.appendChild(tbl);
      body.appendChild(wrap);

      return {
        read: () => cells.map(row => row.map(c => c.inp.checked)),
        check() { return grade.matrix(task, this.read()); },
        softReset() { cells.forEach(r => r.forEach(c => { c.inp.checked = false; })); },
        lock() { cells.forEach(r => r.forEach(c => { c.inp.disabled = true; })); },
        reveal() {
          cells.forEach(r => r.forEach(c => {
            if (c.want) c.td.classList.add('correct');
            else if (c.inp.checked) c.td.classList.add('wrong');
          }));
        },
        setAnswer(m) { cells.forEach((r, ri) => r.forEach((c, ci) => { c.inp.checked = !!(m[ri] && m[ri][ci]); })); }
      };
    },

    forecast(task, body) {
      const fc = make('div', 'fc');
      const fields = [];
      task.fields.forEach((f, i) => {
        const row = make('div', 'fc__field');
        const lbl = make('div', 'fc__lbl');
        html(lbl, f.label + (f.hint ? '<small>' + f.hint + '</small>' : ''));
        row.appendChild(lbl);
        let ctrl;
        if (f.kind === 'number') {
          ctrl = document.createElement('input');
          ctrl.type = 'text';
          ctrl.inputMode = 'decimal';
          ctrl.placeholder = f.unit || '';
        } else {
          ctrl = document.createElement('select');
          ctrl.appendChild(make('option', null, '— wählen —'));
          shuffled(f.options).forEach(o => ctrl.appendChild(make('option', null, o)));
        }
        ctrl.setAttribute('aria-label', f.label);
        row.appendChild(ctrl);
        const truth = make('div', 'fc__truth', f.unit || '');
        row.appendChild(truth);
        fc.appendChild(row);
        fields.push({ row, ctrl, truth, f });
      });
      body.appendChild(fc);

      return {
        read: () => fields.map(x => (x.ctrl.value === '— wählen —' ? '' : x.ctrl.value)),
        check() { return grade.forecast(task, this.read()); },
        softReset() { fields.forEach(x => { x.ctrl.value = x.ctrl.tagName === 'SELECT' ? '— wählen —' : ''; }); },
        lock() { fields.forEach(x => { x.ctrl.disabled = true; }); },
        reveal() {
          fields.forEach((x, i) => {
            const given = this.read()[i];
            const ok = x.f.kind === 'number'
              ? Math.abs(parseNumber(given) - x.f.answer) <= x.f.tol
              : String(given) === x.f.answer;
            x.row.classList.add(ok ? 'correct' : 'wrong');
            x.truth.textContent = ok ? 'richtig'
              : String(x.f.answer) + (x.f.unit ? ' ' + x.f.unit : '');
          });
        },
        setAnswer(vals) { fields.forEach((x, i) => { x.ctrl.value = vals[i]; }); }
      };
    },

    calc(task, body) {
      const calc = make('div', 'calc');

      if (task.given && task.given.length) {
        const tbl = make('table', 'given');
        const tb = document.createElement('tbody');
        task.given.forEach(g => {
          const tr = document.createElement('tr');
          const a = document.createElement('td'); html(a, g.label);
          const b = document.createElement('td'); html(b, g.value);
          tr.appendChild(a); tr.appendChild(b); tb.appendChild(tr);
        });
        tbl.appendChild(tb);
        calc.appendChild(tbl);
      }

      const steps = [];
      const prog = () => sheetRegistry.progressOf(task);
      task.steps.forEach((s, i) => {
        const st = make('div', 'step' + (i === 0 ? '' : ' locked'));
        st.appendChild(make('div', 'slbl', (i + 1) + '. ' + s.label));
        if (s.formula) {
          const f = make('div', 'formula');
          html(f, s.formula);
          st.appendChild(f);
        }
        const inrow = make('div', 'inrow');
        const inp = document.createElement('input');
        inp.type = 'text';
        inp.inputMode = 'decimal';
        inp.className = 'num';
        inp.setAttribute('aria-label', 'Schritt ' + (i + 1) + ': ' + s.label);
        const btn = make('button', 'act', 'Schritt prüfen');
        btn.type = 'button';
        inrow.appendChild(inp);
        inrow.appendChild(make('span', 'unit', s.unit || ''));
        inrow.appendChild(btn);
        st.appendChild(inrow);
        const hint = make('div', 'hint', s.hint || '');
        st.appendChild(hint);
        calc.appendChild(st);
        steps.push({ st, inp, btn, hint, s, tries: 0, ok: false });
      });
      body.appendChild(calc);

      let earned = 0;

      steps.forEach((row, i) => {
        row.btn.addEventListener('click', () => {
          if (row.ok) return;
          const ok = grade.calcStep(row.s, row.inp.value);
          if (!ok) {
            row.tries++;
            row.inp.classList.add('wrong');
            row.hint.classList.add('show');   /* Tipp erst nach Fehlversuch */
            return;
          }
          row.ok = true;
          row.inp.classList.remove('wrong');
          row.inp.classList.add('correct');
          row.inp.disabled = true;
          row.btn.disabled = true;
          const pts = row.tries === 0 ? stepPoints(task) : Math.round(stepPoints(task) * RETRY_FACTOR);
          earned += pts;
          const p = prog();
          if (p) p.addStepPoints(task, pts);
          toast('+' + pts + ' Punkte');

          const next = steps[i + 1];
          if (next) next.st.classList.remove('locked');
          else {
            /* Letzter Schritt: Abschlussbonus, dann die Aufgabe schließen.
               Übergeben wird NUR der Bonus — die Schrittpunkte stehen schon im
               Stand, settle() addiert dazu. */
            const bonus = stepPoints(task);
            earned += bonus;
            control.done = true;
            const holder = allRendered.filter(r => r.task === task)[0];
            if (holder) holder.finishTask(1, bonus);
          }
          updateChrome(prog());
        });
      });

      const control = {
        read: () => steps.map(r => r.inp.value),
        check() { return steps.every(r => r.ok) ? 1 : 0; },
        lock() { steps.forEach(r => { r.inp.disabled = true; r.btn.disabled = true; }); },
        reveal() {
          steps.forEach(r => {
            r.st.classList.remove('locked');
            r.hint.classList.add('show');
            if (!r.ok) {
              r.inp.classList.add('wrong');
              const s = make('span', 'unit', '→ ' + num(r.s.answer, 2));
              s.style.color = 'var(--easy)';
              r.inp.parentNode.appendChild(s);
            }
          });
        },
        /** Für das Selbstlösen: alle Schritte der Reihe nach eintragen. */
        stepsRef: steps,
        earnedPoints: () => earned
      };
      return control;
    }
  };

  /* ══════════════════════════════════════════════════════════════════════════
     8 · Seitenrahmen: Seitenleiste, Fortschritt, Filter, Abschluss
     ══════════════════════════════════════════════════════════════════════════ */

  let allRendered = [];

  function buildRail(sheet, prog, railEl) {
    const nav = $('.nav', railEl) || (() => {
      const n = make('nav', 'nav');
      n.setAttribute('aria-label', 'Aufgaben');
      railEl.appendChild(n);
      return n;
    })();
    nav.innerHTML = '';
    sheet.parts.forEach(part => {
      nav.appendChild(make('div', 'nav__group', part.eyebrow || ('Teil ' + part.index)));
      part.tasks.forEach(t => {
        const a = make('a', 'nav__task');
        a.href = '#task-' + t.id;
        a.setAttribute('data-nav', t.id);
        a.appendChild(make('span', 'nav__dot'));
        a.appendChild(make('span', 'nav__num', String(t.id).padStart(2, '0')));
        const lbl = make('span', 'nav__label');
        html(lbl, t.title);
        a.appendChild(lbl);
        nav.appendChild(a);
      });
    });
  }

  function updateChrome(prog) {
    if (!prog) return;
    const pct = prog.percent / 100;

    $$('[data-progress-pct]').forEach(el => { el.textContent = prog.percent + '%'; });
    $$('[data-progress-count]').forEach(el => {
      html(el, '<b>' + prog.solved + '</b> / ' + prog.total);
    });
    $$('[data-progress-score]').forEach(el => {
      el.textContent = prog.score + ' / ' + prog.maxScore + ' Punkte' +
        (prog.bonus ? '  (+' + prog.bonus + ' Bonus)' : '');
    });
    $$('[data-arc]').forEach(el => {
      const r = Number(el.getAttribute('r')) || 28;
      const c = 2 * Math.PI * r;
      el.style.strokeDasharray = c;
      el.style.strokeDashoffset = c * (1 - pct);
    });

    prog.tasks.forEach(t => {
      const nav = $('[data-nav="' + t.id + '"]');
      if (!nav) return;
      const st = prog.get(t.id).state;
      nav.classList.toggle('is-done', st === 'done');
      nav.classList.toggle('is-wrong', st === 'wrong');
    });

    $$('[data-badge]').forEach(el => {
      el.classList.toggle('is-earned', !!prog.badges[el.getAttribute('data-badge')]);
    });

    if (prog.finished) showDone(prog);
  }

  const BADGE_LABEL = {
    perfekt: 'ohne Zweitversuch', schwergewicht: 'alle schweren gelöst',
    serie: 'Serie geschafft', bestnote: 'Bestnote', sauber: 'kein Fehler',
    vollstaendig: 'vollständig'
  };

  function showDone(prog) {
    let el = $('.done');
    if (!el) {
      el = make('div', 'done');
      const main = $('.main') || document.body;
      /* Vor der Fußzeile, nicht dahinter: angehängt landete die
         Abschlussmeldung unter dem Schlussstrich und sah aus wie ein Nachtrag. */
      const foot = $('.foot', main);
      if (foot) main.insertBefore(el, foot); else main.appendChild(el);
    }
    if (el.classList.contains('show')) return;
    el.innerHTML = '';
    el.appendChild(make('div', 'done__check', '✓'));
    el.appendChild(make('h3', null, 'Blatt abgeschlossen'));
    el.appendChild(make('div', 'stars', '★'.repeat(prog.stars) + '☆'.repeat(5 - prog.stars)));
    el.appendChild(make('div', 'big', prog.score + ' / ' + prog.maxScore));
    const badges = make('div', 'badges');
    Object.keys(prog.badges).forEach(k => {
      const b = make('span', 'badge' + (prog.badges[k] ? ' is-earned' : ''));
      b.setAttribute('data-badge', k);
      b.appendChild(make('span', 'badge__icon', prog.badges[k] ? '★' : '☆'));
      b.appendChild(make('span', null, BADGE_LABEL[k] || k));
      badges.appendChild(b);
    });
    el.appendChild(badges);
    el.appendChild(make('p', null,
      prog.perfect
        ? 'Alles auf den ersten Versuch. Mehr geht nicht.'
        : 'Die falschen Aufgaben stehen mit Begründung und Vertiefung da — die sind das Wertvollste an diesem Blatt.'));
    el.classList.add('show');
    /* Kein automatisches Scrollen. Wer will, springt selbst hin. */
  }

  function wireFilters(prog) {
    const btns = $$('[data-filter]');
    if (!btns.length) return;
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        const f = btn.getAttribute('data-filter');
        btns.forEach(b => b.classList.toggle('is-active', b === btn));
        prog.tasks.forEach(t => {
          const el = $('#task-' + t.id);
          if (!el) return;
          const st = prog.get(t.id).state;
          let show = true;
          if (f === 'offen') show = st === 'offen';
          else if (f === 'geloest') show = st !== 'offen';
          else if (f === 'leicht' || f === 'mittel' || f === 'schwer') show = t.difficulty === f;
          el.classList.toggle('is-hidden', !show);
        });
        /* Leere Teile mitverstecken, sonst bleiben Überschriften ohne Inhalt. */
        $$('.part').forEach(part => {
          const visible = $$('.task', part).filter(t => !t.classList.contains('is-hidden'));
          part.classList.toggle('is-hidden', $$('.task', part).length > 0 && visible.length === 0);
        });
      });
    });
  }

  function wireScrollspy() {
    if (!('IntersectionObserver' in window)) return;
    const spy = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const id = e.target.getAttribute('data-task-id');
        $$('.nav__task.is-active').forEach(n => n.classList.remove('is-active'));
        const nav = $('[data-nav="' + id + '"]');
        if (nav) nav.classList.add('is-active');
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    $$('.task').forEach(t => spy.observe(t));
  }

  /* ══════════════════════════════════════════════════════════════════════════
     9 · Anmelden
     ══════════════════════════════════════════════════════════════════════════ */

  WB.sheets = [];

  const sheetRegistry = {
    byTask: new Map(),
    progressOf(task) { return this.byTask.get(task) || null; }
  };

  WB.register = function register(sheet) {
    WB.sheets.push(sheet);

    const host = $('[data-sheet]');
    if (!host) {
      console.warn('WB.register: kein [data-sheet] im Dokument — nichts gerendert.');
      return null;
    }

    const prog = createProgress(sheet);
    WB.progress = prog;
    sheetTasks(sheet).forEach(t => sheetRegistry.byTask.set(t, prog));

    /* ── Masthead und Einleitung, falls das Blatt sie aus den Daten will ── */
    const mast = $('[data-masthead]');
    if (mast) {
      const rule = make('div', 'masthead__rule');
      const left = make('span');
      left.appendChild(make('span', 'dot'));
      left.appendChild(make('span', null, (sheet.level || '') + (sheet.level && sheet.kind ? ' · ' : '') + (sheet.kind || 'Übungsblatt')));
      rule.appendChild(left);
      rule.appendChild(make('span', null, '~' + (sheet.minutes || 45) + ' Min'));
      mast.appendChild(rule);
      if (sheet.kicker) mast.appendChild(make('p', 'kicker', sheet.kicker));
      const h1 = document.createElement('h1');
      html(h1, sheet.headline || sheet.title || '');
      mast.appendChild(h1);
      if (sheet.lede) {
        const l = make('p', 'lede');
        html(l, sheet.lede);
        mast.appendChild(l);
      }
      if (sheet.trace) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'trace');
        svg.setAttribute('viewBox', '0 0 800 46');
        svg.setAttribute('preserveAspectRatio', 'none');
        svg.setAttribute('aria-hidden', 'true');
        [12, 34].forEach(y => {
          const ln = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          ln.setAttribute('class', 'grid');
          ln.setAttribute('x1', 0); ln.setAttribute('y1', y);
          ln.setAttribute('x2', 800); ln.setAttribute('y2', y);
          svg.appendChild(ln);
        });
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', sheet.trace);
        svg.appendChild(path);
        mast.appendChild(svg);
      }
    }

    const introHost = $('[data-intro]');
    if (introHost && sheet.intro) {
      const bodyCol = make('div', 'intro__body');
      sheet.intro.forEach(t => { const p = make('p'); html(p, t); bodyCol.appendChild(p); });
      introHost.appendChild(bodyCol);
      const aside = make('div', 'intro__aside');
      (sheet.notes || []).forEach(n => {
        const s = make('div', 'note-strip');
        html(s, n.text);
        if (n.signal) s.style.borderLeftColor = 'var(--signal)';
        aside.appendChild(s);
      });
      introHost.appendChild(aside);
    }

    const statsHost = $('[data-stats]');
    if (statsHost) {
      const hard = sheetTasks(sheet).filter(t => t.difficulty === 'schwer').length;
      const types = {};
      sheetTasks(sheet).forEach(t => { types[t.type] = 1; });
      [
        [String(prog.total), 'Aufgaben', true],
        [String(hard), 'davon schwer', false],
        [String(Object.keys(types).length), 'Aufgabentypen', false],
        [String(prog.maxScore), 'Punkte erreichbar', false]
      ].forEach(([n, l, accent]) => {
        const st = make('div', 'stat');
        st.appendChild(make('div', 'stat__num' + (accent ? ' is-accent' : ''), n));
        st.appendChild(make('div', 'stat__lbl', l));
        statsHost.appendChild(st);
      });
    }

    /* ── Teile und Aufgaben ── */
    allRendered = [];
    host.innerHTML = '';
    sheet.parts.forEach(part => {
      const sec = make('section', 'part');
      sec.id = 'teil-' + part.index;
      sec.setAttribute('data-part', part.index);
      const head = make('div', 'part__head');
      head.appendChild(make('div', 'part__index', part.index));
      const titles = make('div', 'part__titles');
      titles.appendChild(make('div', 'part__eyebrow', part.eyebrow || ''));
      const pt = make('div', 'part__title');
      html(pt, part.title);
      titles.appendChild(pt);
      head.appendChild(titles);
      head.appendChild(make('div', 'part__count', part.count || (part.tasks.length + ' Aufgaben')));
      sec.appendChild(head);
      const list = make('div', 'tasks');
      part.tasks.forEach(t => {
        const r = renderTask(t, prog);
        allRendered.push(r);
        list.appendChild(r.el);
      });
      sec.appendChild(list);
      host.appendChild(sec);
    });

    const railEl = $('.rail');
    if (railEl) buildRail(sheet, prog, railEl);

    /* ── Stand wiederherstellen ── */
    if (prog.restore()) {
      allRendered.forEach(r => {
        const st = prog.get(r.task.id);
        if (st.state !== 'offen') r.markRestored(st);
      });
      toast('Stand von zuletzt geladen');
    }

    wireFilters(prog);
    wireScrollspy();
    updateChrome(prog);
    prog.emit(null, 0);

    /* Zurücksetzen anbieten, aber nicht aufdringlich. */
    $$('[data-reset]').forEach(b => {
      b.addEventListener('click', () => {
        if (!confirm('Stand dieses Blattes löschen und neu beginnen?')) return;
        prog.reset();
        location.reload();
      });
    });

    if (store.blocked) {
      const warn = $('[data-store-warning]');
      if (warn) warn.hidden = false;
    }

    return prog;
  };

  /* ══════════════════════════════════════════════════════════════════════════
     10 · Selbstlösen — nur fürs Prüfwerkzeug
     ══════════════════════════════════════════════════════════════════════════
     Löst über echte Bedienung, nicht über Abkürzungen: setAnswer schreibt in die
     Bedienelemente, dann wird der echte Prüfknopf geklickt. Nur so prüft der
     Lauf auch die Verdrahtung und nicht bloß die Bewertungsfunktion.

     Gewartet wird mit setTimeout und NICHT mit requestAnimationFrame: im
     Headless-Browser werden keine Frames produziert, rAF feuert dort nie.       */

  function tick(ms) {
    return new Promise(res => setTimeout(res, ms || 0));
  }

  WB.autosolve = async function autosolve() {
    for (const r of allRendered) {
      const sol = solutionFor(r.task);
      if (r.task.type === 'calc') {
        for (const row of r.control.stepsRef) {
          row.inp.value = String(row.s.answer).replace('.', ',');
          row.btn.click();
          await tick(0);
        }
      } else {
        r.control.setAnswer && r.control.setAnswer(sol);
        await tick(0);
        r.button.click();
      }
      await tick(0);
    }
    await tick(60);
  };

})(window.WB);
