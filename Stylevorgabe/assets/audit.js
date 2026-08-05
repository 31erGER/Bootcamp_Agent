/* ============================================================================
   audit.js — Selbstprüfung eines Blattes
   ---------------------------------------------------------------------------
   Wird nur aktiv, wenn die Seite mit einem Anker geöffnet wird:

     …#auto       löst das Blatt selbst durch und meldet, ob die Maximalpunktzahl
                  erreicht wird. Findet falsch hinterlegte Lösungen.
     …#audit      misst die eigene Fensterbreite und meldet abgeschnittenen
                  Inhalt. Findet Layoutfehler auf Handybreiten.
     …#autoaudit  löst erst durch, dann messen. Nur für breiten.html: der
                  AUFGELÖSTE Zustand ist der breiteste — Rückmeldung, Vertiefung,
                  Zonenlegende, Lösungswerte neben den Lücken. Ein Blatt, das
                  ungelöst bei 320 px sauber ist, kann dort trotzdem brechen,
                  sobald es geprüft wurde.
     …#validate   prüft die Redaktionsregeln (braucht validate.js).
     …#pruefen    auto, audit und validate hintereinander.

   Das Ergebnis landet maschinenlesbar in <pre id="verdict"> zwischen
   VERDICT-BEGIN und VERDICT-END, damit tools/bootcamp-check.ps1 es mit
   `chrome --dump-dom` einsammeln kann.

   Warum die Breitenprüfung über assets/breiten.html und einen <iframe> läuft:

   1. Headless-Chromium klemmt `--window-size` bei **478 px** fest. 320, 360 und
      414 px sind über die Kommandozeile nicht erreichbar. Nachgemessen:
      angefordert 320 → clientWidth 478.
   2. Ein Vorfahre mit fester Pixelbreite hilft nicht: `@media`-Regeln reagieren
      auf das **Fenster**, nicht auf einen Container. Verengt man nur die .shell,
      bleibt das Desktop-Layout aktiv und man misst Unsinn.
   3. Ein <iframe> hat einen echten eigenen Viewport, dort greifen die Media
      Queries korrekt.
   4. Von file:// ist der Ursprung opak, das Elternfenster kann das iframe-DOM
      also nicht lesen. Deshalb misst das Kind sich selbst und schickt das
      Ergebnis per `postMessage` nach oben. Nachgemessen: kommt durch.

   Nichts davon läuft, wenn kein Anker gesetzt ist. Ein Lernender merkt von
   dieser Datei nie etwas.
   ============================================================================ */

(function () {
  'use strict';

  var MODE = (location.hash || '').replace('#', '').toLowerCase();
  if (!MODE) return;

  var WANT_AUTO = MODE === 'auto' || MODE === 'pruefen' || MODE === 'autoaudit';
  var WANT_AUDIT = MODE === 'audit' || MODE === 'pruefen' || MODE === 'autoaudit';
  var WANT_VALID = MODE === 'validate' || MODE === 'pruefen';
  if (!WANT_AUTO && !WANT_AUDIT && !WANT_VALID) return;

  var lines = [];
  var errors = [];
  function say(s) { lines.push(s); }
  function fail(s) { errors.push(s); }

  /* Konsolenfehler mitschreiben — ein stiller Fehler ist der teuerste. */
  var consoleErrors = [];
  window.addEventListener('error', function (e) {
    consoleErrors.push(e.message + ' @ ' + (e.filename || '?') + ':' + e.lineno);
  });
  window.addEventListener('unhandledrejection', function (e) {
    consoleErrors.push('rejection: ' + e.reason);
  });

  /* ── Kurzbeschreibung eines Elements, damit ein Befund auffindbar ist ───── */
  function sel(el) {
    var s = el.tagName.toLowerCase();
    if (el.id) s += '#' + el.id;
    else if (el.className && typeof el.className === 'string') {
      var c = el.className.trim().split(/\s+/).slice(0, 3).join('.');
      if (c) s += '.' + c;
    }
    /* Nächstgelegene Aufgabe nennen, sonst sucht man ewig */
    var task = el.closest ? el.closest('[data-task-id]') : null;
    if (task) s += '  (Aufgabe ' + task.getAttribute('data-task-id') + ')';
    return s;
  }

  /* ── Breitenprüfung: die eigene Seite bei der aktuellen Fensterbreite ──────
     Gemessen wird zweierlei, und nur das zweite ist ein Fehler:

     scrollt   ein Container mit eigenem Scrollen ist Absicht — die Matrix, eine
               breite Tabelle im .table-wrap, ein langer Formelblock. Wird nur
               gezählt, nicht gemeldet.
     abgeschnitten  ein Container ohne eigenes Scrollen, dessen Inhalt breiter
               ist als er selbst. Das scrollt NICHT und ist von Auge unsichtbar —
               genau die Sorte Fehler, die man ohne Werkzeug nie findet.       */
  function measureSelf() {
    var d = document.documentElement;
    var vw = d.clientWidth;
    var cut = [];
    var scrolls = 0;
    var all = document.querySelectorAll('body *');

    /* Formularelemente melden immer scrollWidth = Breite ihres längsten Inhalts.
       Ein geschlossenes <select> mit einer langen Option ist deshalb IMMER
       „überbreit", ohne dass das Layout bricht — das Kästchen selbst passt. Wer
       sie mitzählt, jagt Gespenster. Ob ein Auswahlfeld zu breit ist, sieht man
       daran, dass sein ELTERN-Container überläuft, und der wird geprüft. */
    var FORM = { SELECT: 1, INPUT: 1, TEXTAREA: 1, BUTTON: 1, OPTION: 1 };

    for (var i = 0; i < all.length; i++) {
      var el = all[i];
      if (FORM[el.tagName]) continue;
      var cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') continue;
      if (el.clientWidth === 0) continue;
      if (el.scrollWidth <= el.clientWidth + 1) continue;
      if (cs.overflowX !== 'visible') { scrolls++; continue; }
      cut.push(sel(el) + '  client=' + el.clientWidth + ' inhalt=' + el.scrollWidth);
    }

    /* Wie viele Aufgaben zum Zeitpunkt der Messung erledigt waren. Das
       Elternfenster zeigt es an: sonst wäre nicht zu erkennen, ob #autoaudit
       wirklich gelöst hat oder ob es still gescheitert ist und man die ganze
       Zeit den ungelösten Zustand gemessen hat. */
    var p = window.WB && WB.progress;

    return {
      kind: 'wb-audit',
      viewport: vw,
      bodyScroll: document.body.scrollWidth,
      horizontal: document.body.scrollWidth > vw + 1,
      scrolls: scrolls,
      solved: p ? p.solved : -1,
      total: p ? p.total : -1,
      cut: cut.slice(0, 10),
      cutCount: cut.length
    };
  }

  /* Im iframe: messen und nach oben melden. Das Elternfenster kann unser DOM
     nicht lesen, weil file:// einen opaken Ursprung hat — postMessage schon. */
  function reportToParent() {
    try { parent.postMessage(measureSelf(), '*'); } catch (e) { /* egal */ }
  }

  function auditSelfTopLevel() {
    var r = measureSelf();
    say('viewport=' + r.viewport + '  bodyScroll=' + r.bodyScroll +
        '  waagerechtesScrollen=' + (r.horizontal ? 'JA' : 'nein') +
        '  abgeschnitten=' + r.cutCount + '  scrollt_absichtlich=' + r.scrolls);
    r.cut.forEach(function (l) { say('    > ' + l); });
    if (r.cutCount) fail(r.viewport + 'px: ' + r.cutCount + ' Stelle(n) abgeschnitten');
    if (r.horizontal) fail(r.viewport + 'px: Seite scrollt waagerecht');
    say('');
    say('Hinweis: eine einzelne Seite kann nur ihre eigene Fensterbreite prüfen.');
    say('Für 320 bis 1340 px assets/breiten.html benutzen — headless-Chromium');
    say('klemmt --window-size bei 478 px fest, und @media reagiert nicht auf');
    say('einen verengten Container.');
  }

  /* ── Selbstlösen ────────────────────────────────────────────────────────── */
  function autoSolve() {
    if (!window.WB || !WB.autosolve) {
      fail('kein WB.autosolve — engine.js nicht geladen?');
      return Promise.resolve();
    }
    return WB.autosolve().then(function () {
      var p = WB.progress;
      say('score=' + p.score + '/' + p.maxScore);
      say('solved=' + p.solved + '/' + p.total);
      say('percent=' + p.percent);
      say('bonus=' + p.bonus + '  comboBest=' + p.comboBest);
      say('stars=' + p.stars + '  perfect=' + p.perfect + '  clean=' + p.clean);
      say('donePanel=' + p.finished);

      var badgeStr = Object.keys(p.badges).map(function (k) {
        return k + '=' + (p.badges[k] ? 'ja' : 'NEIN');
      }).join(' ');
      say('badges=' + badgeStr);

      var unsolved = p.tasks.filter(function (t) { return p.get(t.id).state === 'offen'; })
        .map(function (t) { return '#' + t.id + '(' + t.type + ')'; });
      say('unsolved=' + (unsolved.join(' ') || 'keine'));

      var notDone = p.tasks.filter(function (t) { return p.get(t.id).state !== 'done'; })
        .map(function (t) { return '#' + t.id; });
      say('notFullyCorrect=' + (notDone.join(' ') || 'keine'));

      var cvs = [].slice.call(document.querySelectorAll('.viz canvas'));
      say('vizMounted=' + cvs.filter(function (c) { return c.width > 0; }).length + '/' + cvs.length);

      if (p.percent !== 100) fail('Punktzahl erreicht nicht 100 %');
      if (!p.perfect) fail('perfect-Flag nicht gesetzt');
      if (!p.finished) fail('Abschluss-Panel fehlt');
      if (unsolved.length) fail('unbearbeitet: ' + unsolved.join(' '));
      if (notDone.length) fail('nicht vollständig richtig: ' + notDone.join(' '));
      if (/=NEIN/.test(badgeStr)) fail('nicht alle Auszeichnungen vergeben');
      if (cvs.length && cvs.some(function (c) { return c.width === 0; })) {
        fail('mindestens eine Visualisierung nicht gezeichnet');
      }
    });
  }

  /* ── Redaktionsregeln ──────────────────────────────────────────────────── */
  function validateSheets() {
    if (!window.WB || !WB.validate) {
      fail('kein WB.validate — validate.js nicht geladen?');
      return;
    }
    var sheets = WB.sheets || [];
    if (!sheets.length) { fail('kein Blatt angemeldet'); return; }
    var all = [];
    sheets.forEach(function (s) {
      WB.validate(s).forEach(function (issue) {
        all.push(issue.level.toUpperCase() + ' ' + issue.where + ' — ' + issue.message);
      });
    });
    var hard = all.filter(function (l) { return l.indexOf('FEHLER') === 0; });
    say('validierung=' + (hard.length ? hard.join(' | ') : 'keine Fehler'));
    all.filter(function (l) { return l.indexOf('HINWEIS') === 0; })
      .forEach(function (l) { say('  ' + l); });
    if (hard.length) fail('Redaktionsfehler: ' + hard.length);
  }

  /* ── Ablauf ─────────────────────────────────────────────────────────────── */
  function finish() {
    say('consoleErrors=' + (consoleErrors.length ? consoleErrors.join(' | ') : 'keine'));
    say(errors.length ? 'ERGEBNIS=FEHLGESCHLAGEN' : 'ERGEBNIS=GRUEN');
    errors.forEach(function (e) { say('  ! ' + e); });

    var pre = document.createElement('pre');
    pre.id = 'verdict';
    pre.style.cssText =
      'margin:40px 0;padding:16px;background:#1c1813;color:#e9e2d4;' +
      'font:12px/1.6 ui-monospace,monospace;white-space:pre-wrap;border-radius:4px';
    pre.textContent = 'VERDICT-BEGIN\n' + lines.join('\n') + '\nVERDICT-END';
    (document.querySelector('.main') || document.body).appendChild(pre);
  }

  var IN_FRAME = (function () {
    try { return window.parent !== window; } catch (e) { return true; }
  })();

  window.addEventListener('load', function () {
    /* Im iframe zählt nur die Messung — die Ausgabe baut das Elternfenster. */
    if (IN_FRAME && WANT_AUDIT && !WANT_VALID) {
      /* Bei #autoaudit erst durchlösen, damit auch der aufgelöste Zustand
         gemessen wird. Der ist der breiteste. */
      var before = WANT_AUTO ? autoSolve() : Promise.resolve();
      before.then(function () {
        /* Kurz warten, damit Schriften und der ResizeObserver der
           Visualisierungen einmal durchgelaufen sind — sonst misst man ein
           halbes Layout.

           Bewusst setTimeout und NICHT requestAnimationFrame: im
           Headless-Browser werden keine Frames produziert, rAF feuert dort
           schlicht nie und die Messung bliebe für immer aus. Eine Makrotask
           läuft auch ohne Frames. */
        setTimeout(function () { setTimeout(reportToParent, 80); }, 0);
      });
      return;
    }

    var chain = Promise.resolve();
    if (WANT_VALID) chain = chain.then(function () { validateSheets(); });
    if (WANT_AUTO) chain = chain.then(autoSolve);
    if (WANT_AUDIT) chain = chain.then(auditSelfTopLevel);
    chain.then(finish).catch(function (e) {
      fail('Ausnahme: ' + (e && e.message ? e.message : e));
      finish();
    });
  });
})();
