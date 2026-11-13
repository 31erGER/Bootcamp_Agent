/* ============================================================================
   hub.js — die Einstiegsseite eines Moduls
   ---------------------------------------------------------------------------
   Das Rahmenwerk hatte bisher keine. Der Student öffnete eine HTML-Datei, die
   er im Ordner gefunden hatte, und sah nirgends, was es sonst gibt und wie weit
   er ist. Genau das ist der Grund, warum ein Bootcamp abgebrochen wird: nicht
   weil es zu schwer ist, sondern weil man den Überblick verliert.

   Aufruf aus startseite.data.js:

     WB.hub({
       kicker, headline, lede,
       groups: {                                  // optional, seit 14.08.2026
         'Vorab':             { label: 'Bevor du anfängst' },
         'Modul 01 · Thema':  { step: true, note: 'Lesen, üben, programmieren' },
         'Abschluss':         { label: 'Zum Schluss' }
       },
       entries: [{ file, kind, title, desc, points, group }]
     });

   GRUPPEN sind optional. Eintraege mit gleichem `group` IN FOLGE bilden einen
   Abschnitt mit Ueberschrift, Fortschritt und Zeitsumme. Fehlt `group` ueberall,
   rendert die Seite wie vor dem 14.08.2026 als eine Kachelwand — aeltere Kurse
   laufen also unveraendert.

   Zu `groups` (Schluessel ist der Gruppenname, alle Felder optional):
     step  true  ⇒ Kopfzeile „Schritt n von m", gezaehlt nur ueber Gruppen mit
                   step: true. Fuer die eigentlichen Etappen des Lernwegs.
     label       ⇒ feste Kopfzeile statt der Schrittzaehlung.
     note        ⇒ ein Satz unter dem Titel. HTML erlaubt.

   Die Stände kommen aus localStorage — je Dateiname getrennt, gelesen über
   WB.store.readFor(). Ein Blatt, das noch nie geöffnet wurde, hat keinen Stand;
   dann steht dort „noch nicht begonnen" und nicht „0 %". Der Unterschied ist
   wichtig: 0 % sieht nach Versagen aus, „noch nicht begonnen" nach Vorhaben.

   Korrigiert am 27.08.2026: Fortschrittsbalken zeigen bearbeitete Aufgaben
   statt des Punktestands oder nur vollständig abgeschlossener Module.

   GEAENDERT AM 10.09.2026: KEINE GESCHAETZTEN ZEITEN MEHR. Der Eintrag kannte
   ein Feld `minutes`, aus dem hier „~45 Min" wurde. Diese Zahlen waren geraten
   und lagen regelmäßig daneben — und eine falsche Zeitangabe ist schlimmer als
   keine: sie macht aus einem normalen Nachmittag ein Versagen. Was die Karte
   jetzt zeigt, sind nur Tatsachen: Aufgabenzahl, Punkte, Fortschritt. Das Feld
   wird nirgends mehr gelesen; steht es in einer alten Datei, ist es wirkungslos.
   Eine vorgeschriebene Zeit ist etwas anderes und bleibt: `klausur.minuten`
   (die Klausurdauer) und `task.timebox` (die Zeitvorgabe einer Papieraufgabe)
   sind keine Schätzungen, sondern Teil der Aufgabenstellung.

   GEAENDERT AM 12.11.2026 (Agent): REDESIGN DER UEBERSICHT. Der Aufruf und
   alle Felder bleiben gleich, geändert hat sich nur, was daraus gebaut wird.
   Anlass: schon der Showcase mit zwei Modulen war bei 1240 px Breite über
   2700 px hoch (gemessen), und jedes weitere Modul hängt eine volle Reihe
   an. Jeder Abschnitt stand gleich laut da, ob erledigt, aktuell oder noch
   weit weg, und die Kachel, die die Weiter-Karte empfahl, war in der Wand
   darunter nicht zu erkennen.

   Ehrlich dazu: ganz aufgeklappt ist die neue Seite LÄNGER als die alte
   (3254 px am selben Showcase), weil drei Zeilen höher sind als eine Reihe
   aus drei Kacheln. Kürzer wird sie durch das Zuklappen: 1285 px, wenn
   alles zu ist.

     1. Der nächste Schritt steht links und groß, der Stand rechts und klein.
        Er sagt jetzt auch, WO er liegt: Gruppe, Teil k von n, Seitentyp.
     2. Eine Gruppe ist ein <details>. Offen steht nur die, in der der nächste
        Schritt liegt. Erledigte und spätere Gruppen sind eine Zeile mit Titel
        und Stand. Zusammen ergeben die Zeilen die Tabelle aller Module, die
        Rahmenwerk.md unter „Navigation" verlangt.
     3. In der offenen Gruppe stehen Zeilen statt Kacheln: Nummer, Titel und
        Stand je in einer Spalte, die Zeile des nächsten Schritts markiert.
     4. Ein Knopf [data-hub-toggle] klappt alles auf oder zu, falls die
        Startseite ihn mitbringt.

   Ohne `group` bleibt alles bei der Kachelwand von vorher.

   ERGAENZT AM 13.11.2026 (Agent, auf Wunsch des Nutzers): die Übersicht merkt
   sich für den Tab, welche Gruppen offen standen und wo gescrollt war —
   siehe „Ansicht merken" unten.
   ============================================================================ */

window.WB = window.WB || {};

(function (WB) {
  'use strict';

  const $ = (s, r) => (r || document).querySelector(s);

  function make(tag, cls, text) {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (text !== undefined && text !== null) el.textContent = text;
    return el;
  }
  function html(el, s) { el.innerHTML = s === undefined || s === null ? '' : String(s); }

  /* Ränge über den Gesamtanteil. Bewusst wenige und bewusst nicht bei 0
     beginnend mit einem abwertenden Namen — wer anfängt, ist „Neu im Netz" und
     nicht „Anfänger". */
  const RANKS = [
    { at: 0,  name: 'Neu im Netz' },
    { at: 15, name: 'Eingearbeitet' },
    { at: 35, name: 'Sattelfest' },
    { at: 60, name: 'Prüfungsreif' },
    { at: 85, name: 'Klausurfit' }
  ];

  const BADGE_LABEL = {
    perfekt: 'ohne Zweitversuch', schwergewicht: 'alle schweren gelöst',
    serie: 'Serie geschafft', bestnote: 'Bestnote', sauber: 'kein Fehler',
    vollstaendig: 'vollständig'
  };

  function rankFor(pct) {
    let r = RANKS[0];
    RANKS.forEach(x => { if (pct >= x.at) r = x; });
    return r;
  }
  function nextRank(pct) {
    for (let i = 0; i < RANKS.length; i++) if (RANKS[i].at > pct) return RANKS[i];
    return null;
  }
  function starsFor(pct) {
    if (pct >= 98) return 5;
    if (pct >= 85) return 4;
    if (pct >= 70) return 3;
    if (pct >= 50) return 2;
    if (pct > 0) return 1;
    return 0;
  }

  /** Wie weit ein Lesestoff gelesen ist. null, wenn er nie geöffnet wurde. */
  function leseStand(entry) {
    const raw = WB.store.readFor(entry.file, 'read');
    if (!raw || !raw.percent) return null;
    return { percent: raw.percent, done: !!raw.done };
  }

  /** Der Stand eines Blattes, angereichert. null, wenn es nie geöffnet wurde. */
  function standFor(entry) {
    const raw = WB.store.readFor(entry.file, 'progress');
    if (!raw || !raw.state) return null;

    const ids = Object.keys(raw.state);
    const solved = ids.filter(k => raw.state[k].state !== 'offen').length;
    const done = ids.filter(k => raw.state[k].state === 'done').length;
    /* Die Index-Metadaten haben Vorrang: Nach einer Kurserweiterung kann ein
       gespeicherter Stand noch die alte Aufgabenzahl enthalten. */
    const total = entry.tasks || raw.total || ids.length;
    /* Fällt maxScore aus einem alten Stand heraus, lieber die Angabe aus den
       Hub-Daten nehmen als durch 0 zu teilen. */
    const maxScore = raw.maxScore || entry.points || 0;
    const pct = maxScore ? Math.round((raw.score / maxScore) * 100) : 0;
    const progress = total ? Math.round((solved / total) * 100) : 0;

    return {
      score: raw.score || 0, maxScore, solved, done, total,
      percent: pct, progress,
      stars: raw.stars !== undefined ? raw.stars : starsFor(pct),
      badges: raw.badges || {},
      finished: total > 0 && solved >= total
    };
  }

  /** Bearbeitungsstand eines Aufgabenblatts. `entry.tasks` hält noch nicht
      begonnene Blätter sowie ältere gespeicherte Stände korrekt im Nenner. */
  function aufgabenStand(entry, stand) {
    const total = stand ? stand.total : (entry.tasks || 0);
    const solved = stand && total ? Math.min(stand.solved, total) : 0;
    return {
      solved, total,
      percent: total ? Math.round((solved / total) * 100) : 0
    };
  }

  /* ── Ansicht merken ───────────────────────────────────────────────────────
     NEU 13.11.2026 (Agent, auf Wunsch des Nutzers). Wer aus einem Blatt zur
     Übersicht zurückkommt, findet sie so vor, wie er sie verlassen hat:
     dieselben Gruppen offen, dieselbe Stelle im Bild. Vorher stand sie jedes
     Mal oben und mit nur einer offenen Gruppe da.

     Der Auftrag stand unter dem Vorbehalt, dass es die Seite nicht bremst.
     Deshalb drei Festlegungen:

       1. KEIN Zuhörer am Scrollen und keiner am Klappen. Gespeichert wird ein
          einziges Mal, beim Verlassen der Seite (`pagehide`). Solange jemand
          liest oder scrollt, läuft keine Zeile dieses Abschnitts.
       2. Gelesen wird einmal, vor dem Rendern: ein Schlüssel, ein kurzer
          JSON-Text. Die Gruppen kommen schon richtig geklappt ins Dokument,
          es wird also nichts ein zweites Mal gesetzt oder gemessen.
       3. Gescrollt wird einmal, am Ende von WB.hub(), ohne Animation. Die
          Skripte stehen am Ende von <body>; der Browser hat bis dahin noch
          nichts gemalt, die Seite springt also nicht sichtbar.

     sessionStorage und nicht localStorage: gemerkt wird für diesen Tab. Wer
     die Übersicht am nächsten Tag neu öffnet, soll oben beim nächsten Schritt
     landen und nicht mitten in der Seite von gestern. Der Lernstand ist davon
     unberührt, der liegt weiter in localStorage.

     Im Prüflauf (Anker #audit, #pruefen …) wird weder gelesen noch
     geschrieben: dort stehen alle Gruppen offen, und das soll sich niemand
     merken. Alles in try/catch — ist der Speicher gesperrt, verhält sich die
     Seite wie vor diesem Datum.                                              */
  const ansicht = {
    aus() {
      return /^#(auto|audit|autoaudit|validate|pruefen)$/i.test(
        (typeof location !== 'undefined' && location.hash) || '');
    },
    schluessel() {
      return WB.store && WB.store.key ? WB.store.key('ansicht') : 'wb:ansicht';
    },
    lies() {
      if (this.aus()) return null;
      try {
        const roh = sessionStorage.getItem(this.schluessel());
        return roh ? JSON.parse(roh) : null;
      } catch (e) { return null; }
    },
    schreib(wert) {
      if (this.aus()) return;
      try { sessionStorage.setItem(this.schluessel(), JSON.stringify(wert)); }
      catch (e) { /* gesperrt — dann eben wie früher */ }
    }
  };

  WB.hub = function hub(cfg) {
    const head = $('[data-hub-head]');
    if (head) {
      if (cfg.kicker) head.appendChild(make('div', 'hub__kicker', cfg.kicker));
      const h1 = document.createElement('h1');
      html(h1, cfg.headline || '');
      head.appendChild(h1);
      if (cfg.lede) {
        const l = make('p', 'hub__lede');
        html(l, cfg.lede);
        head.appendChild(l);
      }
    }

    /* ── Stände einsammeln ──
       Ein Eintrag mit `points` ist ein Aufgabenblatt und hat einen Punktestand,
       einer ohne ist Lesestoff und hat einen Lesestand. */
    const rows = (cfg.entries || []).map(e => {
      const stand = e.points ? standFor(e) : null;
      return {
        entry: e,
        stand,
        lese: e.points ? null : leseStand(e),
        aufgaben: e.points ? aufgabenStand(e, stand) : null
      };
    });

    /* Nur bewertbare Blätter zählen in den Gesamtstand. Ein Lehrkurs hat keine
       Punkte, und würde man ihn mitzählen, sänke der Anteil, sobald man ihn
       liest — die Anzeige würde einen bestrafen fürs Lernen. */
    const bewertbar = rows.filter(r => r.entry.points);
    const score = bewertbar.reduce((s, r) => s + (r.stand ? r.stand.score : 0), 0);
    const maxScore = bewertbar.reduce((s, r) => s + (r.stand ? r.stand.maxScore : r.entry.points), 0);
    const aufgabenGesamt = bewertbar.reduce((s, r) => s + r.aufgaben.total, 0);
    const aufgabenGeloest = bewertbar.reduce((s, r) => s + r.aufgaben.solved, 0);
    const alleAufgabenzahlenBekannt = bewertbar.every(r => r.aufgaben.total > 0);
    const pct = alleAufgabenzahlenBekannt && aufgabenGesamt
      ? Math.round((aufgabenGeloest / aufgabenGesamt) * 100)
      : (bewertbar.length
          ? Math.round(bewertbar.reduce((s, r) => s + r.aufgaben.percent, 0) / bewertbar.length)
          : 0);
    const fertig = rows.filter(r => r.stand && r.stand.finished).length;

    const auszeichnungen = rows.reduce((n, r) => {
      if (!r.stand) return n;
      return n + Object.keys(r.stand.badges).filter(k => r.stand.badges[k]).length;
    }, 0);

    /* ── Läufe und nächster Schritt ───────────────────────────────────────────
       GEAENDERT 12.11.2026 (Agent, Redesign): beides wird jetzt EINMAL und vor
       allem Rendern bestimmt. Vorher rechnete die Weiter-Karte den nächsten
       Schritt und die Kartenliste die Läufe, jede für sich. Jetzt hängen drei
       Stellen am selben Ergebnis: die Weiter-Karte, die Gruppe, die offen
       steht, und die Zeile, die markiert wird. Rechnet jede selbst, zeigen sie
       nach dem nächsten Umbau drei verschiedene nächste Schritte.

       Läufe (seit 14.08.2026): solange derselbe Gruppenname kommt, wird
       angehängt. DIE REIHENFOLGE DER EINTRAEGE BLEIBT UNANGETASTET. Das ist
       Bedingung, nicht Zufall: sie IST die empfohlene Lernreihenfolge.
       Gruppiert wird deshalb über aufeinanderfolgende Läufe und nicht über ein
       Einsammeln nach Namen, sonst könnte eine Gruppe Einträge vorziehen.

       Nächster Schritt: erst das Angefangene, dann das noch nicht Begonnene.
       Ein bereits fertiges vorzuschlagen wäre die einzige Variante, die
       niemandem hilft, und ein durchgelesener Lehrkurs zählt als fertig, sonst
       stünde er hier bis in alle Ewigkeit. */
    const infos = cfg.groups || {};
    const laeufe = [];
    rows.forEach(r => {
      const name = r.entry.group || '';
      const letzter = laeufe[laeufe.length - 1];
      if (letzter && letzter.name === name) letzter.rows.push(r);
      else laeufe.push({ name: name, rows: [r] });
    });
    const gruppiert = laeufe.some(l => l.name);

    const offen = r => r.entry.points
      ? (r.stand && !r.stand.finished)
      : (r.lese && !r.lese.done);
    const unberuehrt = r => r.entry.points ? !r.stand : !r.lese;

    const angefangen = rows.filter(offen)[0];
    const neu = rows.filter(unberuehrt)[0];
    const ziel = angefangen || neu || null;
    const zielLauf = ziel ? laeufe.filter(l => l.rows.indexOf(ziel) !== -1)[0] : null;

    /* NEU 13.11.2026 (Agent): die gemerkte Ansicht, siehe „Ansicht merken"
       oben. `klappbar` sammelt jede Gruppe mit ihrer Marke (Stelle + Name),
       damit beim Verlassen feststeht, welche offen waren. */
    const gemerkt = ansicht.lies();
    const zielDatei = ziel ? ziel.entry.file : '';
    const klappbar = [];

    /* ── Nutzerkarte ──
       GEAENDERT 12.11.2026 (Agent, Redesign): die Weiter-Karte steht zuerst und
       bekommt die breitere Spalte, der Stand folgt. Vorher war es umgekehrt:
       Rang und Punkte links und groß, der eine Knopf, auf den es ankommt,
       rechts in einem Kasten. Die Übersicht soll genau einen nächsten Schritt
       empfehlen, also ist er auch das Erste, was man liest. */
    const panel = $('[data-hub-user]');
    if (panel) {
      const next = make('div', 'userpanel__next');
      const res = make('div', 'resume');

      if (!ziel) {
        /* Alles durch. Das darf man auch sagen. */
        res.appendChild(make('div', 'resume__lbl', 'Modul abgeschlossen'));
        res.appendChild(make('div', 'resume__title', 'Alles durchgearbeitet'));
        res.appendChild(make('div', 'resume__meta',
          score + ' von ' + maxScore + ' Punkten  ·  ' + auszeichnungen + ' Auszeichnungen'));
        const erstes = bewertbar[0] || rows[0];
        if (erstes) {
          const a = make('a', 'resume__btn', 'Schwere Aufgaben ansehen');
          a.href = erstes.entry.file;
          res.appendChild(a);
        }
      } else {
        res.appendChild(make('div', 'resume__lbl', angefangen ? 'Weitermachen' : 'Als nächstes'));

        /* Wo der Schritt liegt. Ohne diese Zeile nennt die Karte einen Titel,
           und man sucht ihn in der Liste darunter. Der Gruppenname darf HTML
           tragen (er wird auch als Überschrift so gesetzt), der Rest ist Text. */
        const wo = make('div', 'resume__where');
        const inGruppe = !!(zielLauf && zielLauf.name);
        if (inGruppe) {
          const g = make('span');
          html(g, zielLauf.name);
          wo.appendChild(g);
        }
        const teil = zielLauf && zielLauf.rows.length > 1
          ? 'Teil ' + (zielLauf.rows.indexOf(ziel) + 1) + ' von ' + zielLauf.rows.length
          : '';
        const rest = [teil, ziel.entry.kind || ''].filter(Boolean).join(' · ');
        if (rest) wo.appendChild(make('span', null, (inGruppe ? ' · ' : '') + rest));
        res.appendChild(wo);

        const t = make('div', 'resume__title');
        html(t, ziel.entry.title);
        res.appendChild(t);

        let meta;
        if (ziel.stand) meta = ziel.stand.solved + ' von ' + ziel.stand.total + ' Aufgaben gelöst';
        else if (ziel.lese) meta = ziel.lese.percent + ' % gelesen';
        else meta = ziel.entry.points ? 'noch nicht begonnen' : 'zum Lesen';
        res.appendChild(make('div', 'resume__meta', meta));

        /* Ein Balken nur, wenn schon etwas da ist. Einer auf 0 % wäre eine
           Behauptung über etwas, das noch nicht stattgefunden hat. */
        if (ziel.stand || ziel.lese) {
          const rb = make('div', 'resume__bar');
          const rf = make('span');
          rf.style.width = (ziel.stand ? ziel.stand.progress : ziel.lese.percent) + '%';
          rb.appendChild(rf);
          res.appendChild(rb);
        }

        const a = make('a', 'resume__btn', angefangen ? 'Weiter →' : 'Öffnen →');
        a.href = ziel.entry.file;
        res.appendChild(a);
      }

      next.appendChild(res);
      panel.appendChild(next);

      const main = make('div', 'userpanel__stand');
      const rank = rankFor(pct);
      const nxt = nextRank(pct);

      const rk = make('div', 'userpanel__rank');
      rk.appendChild(make('b', null, rank.name));
      if (nxt) rk.appendChild(make('span', 'userpanel__step', 'nächster Rang bei ' + nxt.at + ' %'));
      main.appendChild(rk);

      main.appendChild(make('div', 'userpanel__xp',
        alleAufgabenzahlenBekannt
          ? aufgabenGeloest + ' von ' + aufgabenGesamt + ' Aufgaben  ·  ' + pct + ' % bearbeitet'
          : pct + ' % bearbeitet'));

      const bar = make('div', 'xpbar');
      const fill = make('span');
      fill.style.width = pct + '%';
      bar.appendChild(fill);
      main.appendChild(bar);

      const stats = make('div', 'userpanel__stats');
      [
        [String(fertig) + ' / ' + rows.filter(r => r.entry.points).length, 'Blätter fertig', true],
        [String(score), 'Punkte', false],
        [String(auszeichnungen), 'Auszeichnungen', false]
      ].forEach(([n, l, accent]) => {
        const st = make('div', 'userstat');
        st.appendChild(make('div', 'userstat__num' + (accent ? ' is-accent' : ''), n));
        st.appendChild(make('div', 'userstat__lbl', l));
        stats.appendChild(st);
      });
      main.appendChild(stats);
      panel.appendChild(main);
    }

    /* ── Blattkarten ──────────────────────────────────────────────────────────
       ERGAENZT 14.08.2026: Gruppen.

       Vorher wurden alle Karten in eine einzige Wand geschrieben. Bei acht
       Modulen a drei Karten plus Anleitung, Lernplan und Generalprobe sind das
       27 Stueck — man sieht sie alle, aber man erkennt nichts.

       Jetzt bilden Eintraege mit gleichem `group` IN FOLGE einen Abschnitt mit
       eigener Ueberschrift, eigenem Fortschritt und eigener Punktesumme. Die
       Laeufe selbst werden seit dem 12.11.2026 weiter oben gebildet.

       Ohne `group` verhaelt sich alles wie vorher: eine Wand. Aeltere Kurse,
       die hub.js mitbenutzen, laufen dadurch unveraendert weiter.
       ────────────────────────────────────────────────────────────────────── */

    /** Erledigt heisst beim Blatt „alle Aufgaben beantwortet", beim Lesestoff
        „durchgelesen". Beides ist derselbe Haken auf der Karte. */
    function istFertig(r) {
      return r.entry.points ? !!(r.stand && r.stand.finished) : !!(r.lese && r.lese.done);
    }

    function karteFuer({ entry, stand, lese }) {
        const card = make('a', 'sheetcard');
        card.href = entry.file;

        card.appendChild(make('div', 'sheetcard__id',
          (entry.kind || 'Blatt') + (entry.id ? ' · ' + entry.id : '')));
        const t = make('div', 'sheetcard__title');
        html(t, entry.title);
        card.appendChild(t);
        if (entry.desc) {
          const d = make('div', 'sheetcard__desc');
          html(d, entry.desc);
          card.appendChild(d);
        }

        /* Ein Aufgabenblatt zeigt den Punkteanteil, ein Lesestoff den
           Leseanteil. Nie begonnen heißt gar kein Balken: einer auf 0 % wäre
           eine Behauptung über etwas, das noch nicht stattgefunden hat. */
        if (entry.points || lese) {
          const fertig = entry.points ? (stand && stand.finished) : (lese && lese.done);
          const anteil = entry.points ? (stand ? stand.progress : 0) : lese.percent;
          const bar = make('div', 'sheetcard__bar' + (fertig ? ' is-done' : ''));
          const fill = make('span');
          fill.style.width = anteil + '%';
          bar.appendChild(fill);
          card.appendChild(bar);
        }

        const meta = make('div', 'sheetcard__meta');
        let cls = 'sheetcard__state', txt;
        if (!entry.points) {
          if (lese && lese.done) { cls += ' is-done'; txt = 'gelesen'; }
          else if (lese) { cls += ' is-open'; txt = lese.percent + ' % gelesen'; }
          else txt = 'zum Lesen';
        } else if (!stand) {
          cls += ' is-open';
          txt = 'noch nicht begonnen';
        } else if (stand.finished) {
          cls += ' is-done';
          txt = 'fertig · ' + stand.score + ' / ' + stand.maxScore;
        } else {
          cls += ' is-open';
          txt = stand.solved + ' von ' + stand.total + ' gelöst';
        }
        meta.appendChild(make('span', cls, txt));
        if (stand && stand.stars) {
          meta.appendChild(make('span', 'sheetcard__stars',
            '★'.repeat(stand.stars) + '☆'.repeat(5 - stand.stars)));
        }
        card.appendChild(meta);

        return card;
    }

    /* ── Eine Zeile je Eintrag ────────────────────────────────────────────────
       NEU 12.11.2026 (Agent, Redesign). In einer Gruppe steht jetzt eine Liste
       statt eines Kachelrasters. Der Grund ist die Leserichtung: in einem
       Raster stehen Titel und Stand jeder Kachel an einer anderen Stelle, und
       das Auge springt. In Zeilen stehen alle Titel untereinander und alle
       Stände untereinander — man liest eine Spalte herunter und weiß, was
       offen ist. Das ist die Form eines Inhaltsverzeichnisses, und genau das
       soll die Übersicht laut Rahmenwerk.md sein.

       `nr` ist die Stelle in der Gruppe: Lehrkurs 1, Heft 2, Lab 3. Dieselbe
       Zählung wie der Wegweiser in der Seitenleiste eines Blattes.

       Der Balken behält die Klasse `sheetcard__bar`: tools/hub-progress-check
       sucht ihn darüber, und er ist derselbe Balken wie auf der Kachel. */
    function zeileFuer(r, nr, istZiel) {
      const entry = r.entry, stand = r.stand, lese = r.lese;
      const fertig = istFertig(r);
      const begonnen = entry.points ? !!stand : !!lese;

      const row = make('a', 'hubrow' + (fertig ? ' is-done' : '') + (istZiel ? ' is-next' : ''));
      row.href = entry.file;
      row.appendChild(make('span', 'hubrow__num', fertig ? '✓' : String(nr)));

      const body = make('span', 'hubrow__body');
      const kind = make('span', 'hubrow__kind');
      kind.appendChild(make('span', null, (entry.kind || 'Blatt') + (entry.id ? ' · ' + entry.id : '')));
      /* Die Markierung, die der Kachelwand gefehlt hat: die Weiter-Karte oben
         nennt einen Titel, und hier steht, welche Zeile gemeint ist. */
      if (istZiel) kind.appendChild(make('span', 'hubrow__flag', begonnen ? 'Weitermachen' : 'Als nächstes'));
      body.appendChild(kind);
      const t = make('span', 'hubrow__title');
      html(t, entry.title);
      body.appendChild(t);
      if (entry.desc) {
        const d = make('span', 'hubrow__desc');
        html(d, entry.desc);
        body.appendChild(d);
      }
      row.appendChild(body);

      const side = make('span', 'hubrow__side');
      let cls = 'hubrow__state', txt;
      if (!entry.points) {
        if (lese && lese.done) { cls += ' is-done'; txt = 'gelesen'; }
        else if (lese) { cls += ' is-open'; txt = lese.percent + ' % gelesen'; }
        else txt = 'zum Lesen';
      } else if (!stand) {
        txt = 'noch nicht begonnen';
      } else if (stand.finished) {
        cls += ' is-done';
        txt = 'fertig · ' + stand.score + ' / ' + stand.maxScore;
      } else {
        cls += ' is-open';
        txt = stand.solved + ' von ' + stand.total + ' gelöst';
      }
      side.appendChild(make('span', cls, txt));

      /* Nie begonnen heißt gar kein Balken: einer auf 0 % wäre eine Behauptung
         über etwas, das noch nicht stattgefunden hat. Die Kachel hat das nur
         für Lesestoff eingehalten und einem unberührten Aufgabenheft trotzdem
         einen leeren Balken gegeben; die Zeile hält es für beide. */
      if (begonnen) {
        const anteil = entry.points ? stand.progress : lese.percent;
        const bar = make('span', 'sheetcard__bar' + (fertig ? ' is-done' : ''));
        const fill = make('span');
        fill.style.width = anteil + '%';
        bar.appendChild(fill);
        side.appendChild(bar);
      }
      if (stand && stand.stars) {
        side.appendChild(make('span', 'hubrow__stars',
          '★'.repeat(stand.stars) + '☆'.repeat(5 - stand.stars)));
      }
      row.appendChild(side);

      return row;
    }

    const list = $('[data-hub-sheets]');
    if (list) {
      const abschnitte = [];

      if (!gruppiert) {
        rows.forEach(r => list.appendChild(karteFuer(r)));
      } else {
        /* Der Host traegt in aelteren Startseiten die Klasse `sheets` und ist
           damit selbst das Kachelraster. Sobald gruppiert wird, sind seine
           Kinder aber Abschnitte — das Raster gehoert dann eine Ebene tiefer. */
        list.className = 'hubgroups';

        /* „Schritt n von m" nur ueber die Gruppen, die das ausdruecklich
           wollen. Anleitung und Generalprobe sind keine Etappe des Wegs. */
        const etappen = laeufe.filter(l => infos[l.name] && infos[l.name].step);

        /* ERGAENZT 12.11.2026 (Agent, Redesign): bei der Breitenprüfung stehen
           ALLE Gruppen offen. audit.js misst nur, was sichtbar ist. Mit einer
           einzigen offenen Gruppe wären die Zeilen aller übrigen ungeprüft, und
           der Lauf bliebe grün und prüfte weniger. */
        const alleOffen = /^#(audit|autoaudit|pruefen)$/i.test(
          (typeof location !== 'undefined' && location.hash) || '');

        laeufe.forEach(lauf => {
          const info = infos[lauf.name] || {};
          const gesamt = lauf.rows.length;
          const fertig = lauf.rows.filter(istFertig).length;
          const alles = gesamt > 0 && fertig === gesamt;
          const gruppenAufgaben = lauf.rows.reduce((s, r) => s + (r.aufgaben ? r.aufgaben.total : 0), 0);
          const gruppenGeloest = lauf.rows.reduce((s, r) => s + (r.aufgaben ? r.aufgaben.solved : 0), 0);
          const gruppenProzent = gruppenAufgaben
            ? Math.round((gruppenGeloest / gruppenAufgaben) * 100)
            : (gesamt ? Math.round((fertig / gesamt) * 100) : 0);

          /* GEAENDERT 12.11.2026 (Agent, Redesign): die Gruppe ist ein <details>
             und ihr Kopf das <summary>. Offen steht genau die Gruppe, in der
             der nächste Schritt liegt. Alles andere ist EINE Zeile: Marke,
             Titel, Stand. Vorher stand jede Gruppe aufgeklappt da, und eine
             erledigte war so hoch wie die aktuelle.

             <details> und kein eigener Klappmechanismus: es klappt ohne eine
             Zeile Skript, mit Tastatur, und die Suche im Browser öffnet eine
             zugeklappte Gruppe von selbst, wenn der Treffer darin liegt.

             Im <summary> stehen nur <span> und die Überschrift. Ein <div>
             darin ist kein gültiges HTML. Die Anordnung macht das Raster. */
          const aktuell = lauf === zielLauf;
          const sec = make('details', 'hubgroup' + (alles ? ' is-done' : '') + (aktuell ? ' is-current' : ''));

          /* GEAENDERT 13.11.2026 (Agent, „Ansicht merken"): gibt es eine
             gemerkte Ansicht, gilt sie — auch wenn jemand die aktuelle Gruppe
             zugeklappt hatte. Eine Ausnahme: liegt der nächste Schritt
             inzwischen woanders als beim Verlassen, steht seine Gruppe
             zusätzlich offen. Sonst käme man aus einem fertigen Blatt zurück
             und der Schritt, den die Karte oben empfiehlt, wäre unten
             versteckt. */
          const marke = laeufe.indexOf(lauf) + '|' + lauf.name;
          const warOffen = gemerkt && Array.isArray(gemerkt.offen)
            ? gemerkt.offen.indexOf(marke) !== -1 || (aktuell && gemerkt.ziel !== zielDatei)
            : aktuell;
          sec.open = alleOffen || warOffen;
          klappbar.push({ el: sec, marke: marke });
          const kopf = make('summary', 'hubgroup__head');

          /* Die Marke auf der Weglinie: Haken, wenn erledigt, Pfeil, wenn hier
             der nächste Schritt liegt, sonst die Nummer der Etappe. */
          kopf.appendChild(make('span', 'hubgroup__mark',
            alles ? '✓' : (aktuell ? '▸' : (info.step ? String(etappen.indexOf(lauf) + 1) : '·'))));

          if (info.step) {
            kopf.appendChild(make('span', 'hubgroup__label',
              'Schritt ' + (etappen.indexOf(lauf) + 1) + ' von ' + etappen.length));
          } else if (info.label) {
            kopf.appendChild(make('span', 'hubgroup__label', info.label));
          }

          const h3 = make('h3', 'hubgroup__title');
          html(h3, lauf.name);
          kopf.appendChild(h3);

          const meta = make('span', 'hubgroup__meta');
          meta.appendChild(make('span', 'hubgroup__state' + (alles ? ' is-done' : ''),
            gruppenAufgaben
              ? (alles ? 'fertig · ' : '') + gruppenGeloest + ' von ' + gruppenAufgaben + ' Aufgaben'
              : (alles ? 'fertig · ' + gesamt + ' von ' + gesamt
                       : fertig + ' von ' + gesamt + ' erledigt')));

          const punkte = lauf.rows.reduce((s, r) => s + (r.entry.points || 0), 0);
          if (punkte) meta.appendChild(make('span', 'hubgroup__facts', punkte + ' Punkte'));

          const bar = make('span', 'hubgroup__bar' + (alles ? ' is-done' : ''));
          const fill = make('span');
          fill.style.width = gruppenProzent + '%';
          bar.appendChild(fill);
          meta.appendChild(bar);
          kopf.appendChild(meta);

          kopf.appendChild(make('span', 'hubgroup__chev'));
          sec.appendChild(kopf);

          /* Der Satz, WARUM die Gruppe hier steht, gehört zum Inhalt und nicht
             in den Kopf: zwölf zugeklappte Gruppen mit je einem Absatz wären
             wieder die Wand, die das Zuklappen abschaffen soll. */
          const inhalt = make('div', 'hubgroup__body');
          if (info.note) {
            const n = make('p', 'hubgroup__note');
            html(n, info.note);
            inhalt.appendChild(n);
          }
          const zeilen = make('div', 'hubrows');
          lauf.rows.forEach((r, i) => zeilen.appendChild(zeileFuer(r, i + 1, r === ziel)));
          inhalt.appendChild(zeilen);
          sec.appendChild(inhalt);

          list.appendChild(sec);
          abschnitte.push(sec);
        });

        /* Alles auf, alles zu. Der Knopf ist optional: eine ältere Startseite
           hat ihn nicht und läuft unverändert. Beschriftet wird er nach dem,
           was er als Nächstes TUT, und das hängt davon ab, was offen steht —
           auch nachdem jemand eine Gruppe von Hand geöffnet hat. */
        const schalter = $('[data-hub-toggle]');
        if (schalter) {
          const alleAuf = () => abschnitte.every(d => d.open);
          const beschrifte = () => {
            schalter.textContent = alleAuf() ? 'Alles zuklappen' : 'Alles aufklappen';
          };
          schalter.hidden = false;
          schalter.onclick = () => {
            const auf = !alleAuf();
            abschnitte.forEach(d => { d.open = auf; });
            beschrifte();
          };
          abschnitte.forEach(d => { d.ontoggle = beschrifte; });
          beschrifte();
        }
      }
    }

    /* ── Auszeichnungen über alle Blätter ── */
    const badgeHost = $('[data-hub-badges]');
    if (badgeHost) {
      const alle = {};
      rows.forEach(r => {
        if (!r.stand) return;
        Object.keys(r.stand.badges).forEach(k => { alle[k] = alle[k] || r.stand.badges[k]; });
      });
      Object.keys(BADGE_LABEL).forEach(k => {
        const b = make('span', 'badge' + (alle[k] ? ' is-earned' : ''));
        b.appendChild(make('span', 'badge__icon', alle[k] ? '★' : '☆'));
        b.appendChild(make('span', null, BADGE_LABEL[k]));
        badgeHost.appendChild(b);
      });
    }

    if (WB.store.blocked) {
      const warn = $('[data-store-warning]');
      if (warn) warn.hidden = false;
    }

    /* Korrigiert am 27.08.2026: Bei direktem Öffnen per Doppelklick können
       Moduldateien und Startseite getrennte file://-Speicher besitzen. Die
       Engine sammelt die Originalstände per postMessage ein. Nur wenn wirklich
       ein neuer Stand ankam, wird einmal neu geladen und damit neu gerendert. */
    /* NEU 13.11.2026 (Agent, „Ansicht merken"): einmal an die gemerkte Stelle,
       einmal beim Verlassen speichern. Steht ein Anker in der Adresse, hat der
       Vorrang — dann wollte jemand genau dorthin. `instant`, damit ein
       `scroll-behavior` im Stylesheet daraus keine Fahrt macht. Das hier
       steht VOR der Speicherbrücke: lädt sie die Seite neu, feuert `pagehide`
       und die Ansicht überlebt auch das. */
    if (typeof window !== 'undefined' && !ansicht.aus()) {
      const anker = (typeof location !== 'undefined' && location.hash) || '';
      if (gemerkt && gemerkt.y > 0 && !anker && typeof window.scrollTo === 'function') {
        window.scrollTo({ top: gemerkt.y, left: 0, behavior: 'instant' });
      }
      if (typeof window.addEventListener === 'function') {
        window.addEventListener('pagehide', () => {
          ansicht.schreib({
            ziel: zielDatei,
            offen: klappbar.filter(k => k.el.open).map(k => k.marke),
            y: Math.round(window.scrollY || 0)
          });
        });
      }
    }

    if (WB.storeBridge && WB.storeBridge.collect) {
      WB.storeBridge.collect(
        rows.filter(r => r.entry.points).map(r => r.entry.file),
        changed => { if (changed) location.reload(); }
      );
    }

    return { score, maxScore, percent: pct, rows };
  };

})(window.WB);
