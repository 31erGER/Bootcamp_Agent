/* ============================================================================
   hub.js — die Einstiegsseite eines Moduls
   ---------------------------------------------------------------------------
   Das Rahmenwerk hatte bisher keine. Der Student öffnete eine HTML-Datei, die
   er im Ordner gefunden hatte, und sah nirgends, was es sonst gibt und wie weit
   er ist. Genau das ist der Grund, warum ein Bootcamp abgebrochen wird: nicht
   weil es zu schwer ist, sondern weil man den Überblick verliert.

   Aufruf aus index.data.js:

     WB.hub({
       kicker, headline, lede,
       entries: [{ file, kind, title, desc, points, minutes }]
     });

   Die Stände kommen aus localStorage — je Dateiname getrennt, gelesen über
   WB.store.readFor(). Ein Blatt, das noch nie geöffnet wurde, hat keinen Stand;
   dann steht dort „noch nicht begonnen" und nicht „0 %". Der Unterschied ist
   wichtig: 0 % sieht nach Versagen aus, „noch nicht begonnen" nach Vorhaben.
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
    const total = raw.total || ids.length;
    /* Fällt maxScore aus einem alten Stand heraus, lieber die Angabe aus den
       Hub-Daten nehmen als durch 0 zu teilen. */
    const maxScore = raw.maxScore || entry.points || 0;
    const pct = maxScore ? Math.round((raw.score / maxScore) * 100) : 0;

    return {
      score: raw.score || 0, maxScore, solved, done, total,
      percent: pct,
      stars: raw.stars !== undefined ? raw.stars : starsFor(pct),
      badges: raw.badges || {},
      finished: total > 0 && solved >= total
    };
  }

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
    const rows = (cfg.entries || []).map(e => ({
      entry: e,
      stand: e.points ? standFor(e) : null,
      lese: e.points ? null : leseStand(e)
    }));

    /* Nur bewertbare Blätter zählen in den Gesamtstand. Ein Lehrkurs hat keine
       Punkte, und würde man ihn mitzählen, sänke der Anteil, sobald man ihn
       liest — die Anzeige würde einen bestrafen fürs Lernen. */
    const bewertbar = rows.filter(r => r.entry.points);
    const score = bewertbar.reduce((s, r) => s + (r.stand ? r.stand.score : 0), 0);
    const maxScore = bewertbar.reduce((s, r) => s + (r.stand ? r.stand.maxScore : r.entry.points), 0);
    const pct = maxScore ? Math.round((score / maxScore) * 100) : 0;
    const fertig = rows.filter(r => r.stand && r.stand.finished).length;

    const auszeichnungen = rows.reduce((n, r) => {
      if (!r.stand) return n;
      return n + Object.keys(r.stand.badges).filter(k => r.stand.badges[k]).length;
    }, 0);

    /* ── Nutzerkarte ── */
    const panel = $('[data-hub-user]');
    if (panel) {
      const main = make('div', 'userpanel__main');
      const rank = rankFor(pct);
      const nxt = nextRank(pct);

      const rk = make('div', 'userpanel__rank');
      rk.appendChild(make('b', null, rank.name));
      if (nxt) rk.appendChild(make('span', 'userpanel__step', 'nächster Rang bei ' + nxt.at + ' %'));
      main.appendChild(rk);

      main.appendChild(make('div', 'userpanel__xp',
        score + ' von ' + maxScore + ' Punkten  ·  ' + pct + ' %'));

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

      /* ── Weiter-Karte ──
         Erst das Angefangene, dann das noch nicht Begonnene. Ein bereits
         fertiges vorzuschlagen wäre die einzige Variante, die niemandem hilft —
         und ein durchgelesener Lehrkurs zählt als fertig, sonst stünde er hier
         bis in alle Ewigkeit. */
      const offen = r => r.entry.points
        ? (r.stand && !r.stand.finished)
        : (r.lese && !r.lese.done);
      const unberuehrt = r => r.entry.points ? !r.stand : !r.lese;

      const angefangen = rows.filter(offen)[0];
      const neu = rows.filter(unberuehrt)[0];
      const ziel = angefangen || neu;

      const side = make('div', 'userpanel__side');
      const res = make('div', 'resume');

      if (!ziel) {
        /* Alles durch. Das darf man auch sagen. */
        res.appendChild(make('div', 'resume__lbl', 'Modul abgeschlossen'));
        const t = make('div', 'resume__title', 'Alles durchgearbeitet');
        res.appendChild(t);
        res.appendChild(make('div', 'resume__meta',
          score + ' von ' + maxScore + ' Punkten  ·  ' + auszeichnungen + ' Auszeichnungen'));
        const a = make('a', 'resume__btn', 'Schwere Aufgaben ansehen');
        a.href = (rows.filter(r => r.entry.points)[0] || rows[0]).entry.file;
        res.appendChild(a);
      } else {
        res.appendChild(make('div', 'resume__lbl', angefangen ? 'Weitermachen' : 'Als nächstes'));
        const t = make('div', 'resume__title');
        html(t, ziel.entry.title);
        res.appendChild(t);
        let meta;
        if (ziel.stand) meta = ziel.stand.solved + ' von ' + ziel.stand.total + ' Aufgaben gelöst';
        else if (ziel.lese) meta = ziel.lese.percent + ' % gelesen';
        else meta = (ziel.entry.kind || 'Blatt') +
          (ziel.entry.minutes ? '  ·  ~' + ziel.entry.minutes + ' Min' : '');
        res.appendChild(make('div', 'resume__meta', meta));
        const a = make('a', 'resume__btn', angefangen ? 'Weiter' : 'Öffnen');
        a.href = ziel.entry.file;
        res.appendChild(a);
      }

      side.appendChild(res);
      panel.appendChild(side);
    }

    /* ── Blattkarten ── */
    const list = $('[data-hub-sheets]');
    if (list) {
      rows.forEach(({ entry, stand, lese }) => {
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
          const anteil = entry.points ? (stand ? stand.percent : 0) : lese.percent;
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
          else txt = entry.minutes ? '~' + entry.minutes + ' Min Lesezeit' : 'zum Lesen';
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

        list.appendChild(card);
      });
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

    return { score, maxScore, percent: pct, rows };
  };

})(window.WB);
