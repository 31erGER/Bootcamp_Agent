/* ============================================================================
   lehrkurs.js — Verhalten eines Fachartikels
   ---------------------------------------------------------------------------
   Was der Artikel braucht und was engine.js nicht abdeckt: umdrehbare
   Karteikarten und die Kapitelmarkierung in der Seitenleiste. Das war früher
   `quiz.js` — eine Datei, die es im Repo nie gab, weshalb der Artikel nie
   gelaufen ist.

   Der frühere Eingriff

       Element.prototype.scrollIntoView = function () {};

   ist damit gegenstandslos und ENTFERNT. Er hat ein globales Browser-Verhalten
   für jedes Element der Seite abgeschaltet, um eine einzige unerwünschte
   Bewegung zu unterdrücken — und dabei auch jedes gewollte Scrollen, etwa das
   Sichtbarmachen eines fokussierten Feldes durch den Browser. Die Ursache liegt
   an der Quelle: engine.js und diese Datei scrollen von sich aus nie.

   ERGAENZT 13.11.2026 (Agent, Redesign der Seiten): der Weg der Übersicht
   setzt sich in der Seite fort. Diese Datei hakt gelesene Kapitel in der
   Seitenleiste ab, macht aus jedem `.etappe-ende` eines Labs einen Haken und
   bestellt bei WB.weg (engine.js) die beiden Karten: „Weitermachen" unter dem
   Kopf und den nächsten Schritt vor der Fußzeile. Fertig wird ein Lab weiter
   durch Scrollen; die Haken sind Anzeige — siehe wireEtappen().

   Karten sind <button>, nicht <div>. Ein Klickziel ohne Tastaturpfad ist für
   jeden nutzlos, der keine Maus benutzt — und das Umdrehen einer Lernkarte ist
   genau die Bewegung, die man mit der Tastatur durchgehen will.
   ============================================================================ */

(function () {
  'use strict';

  const $$ = s => [].slice.call(document.querySelectorAll(s));

  /* ── Karteikarten ─────────────────────────────────────────────────────────
     Das Markup bleibt, wie es ist: .card3d > .card3d__inner > zwei Flächen.
     Bedienbar gemacht wird es hier, damit im Artikel kein Skript steht.       */
  function wireCards() {
    $$('.card3d').forEach(card => {
      /* Kein <button> um die Karte legen: sie enthält selbst Elemente, und ein
         verschachtelter Knopf wäre ungültiges Markup. role + tabindex machen
         dasselbe, ohne die 3D-Transformation zu stören. */
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-pressed', 'false');

      const front = card.querySelector('.card3d__front .card3d__q');
      if (front) {
        card.setAttribute('aria-label', front.textContent.trim() + ' — umdrehen');
      }

      function flip() {
        const on = card.classList.toggle('is-flipped');
        card.setAttribute('aria-pressed', on ? 'true' : 'false');
      }

      card.addEventListener('click', flip);
      card.addEventListener('keydown', e => {
        /* Leertaste würde sonst die Seite scrollen. */
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
          e.preventDefault();
          flip();
        }
      });
    });
  }

  /* ── Kapitelmarkierung ────────────────────────────────────────────────────
     Hebt in der Seitenleiste das Kapitel hervor, das gerade gelesen wird.
     Dieselbe Mechanik wie in engine.js für Aufgaben — hier über die
     Sprungmarken der Kapitel.                                                 */
  /* Kapitel-ID → Eintrag in der Seitenleiste. Ausgelagert am 13.11.2026
     (Agent, Redesign der Seiten): außer der Markierung des aktuellen Kapitels
     brauchen ihn jetzt auch die Haken für gelesene Kapitel und erledigte
     Etappen. */
  function railLinks() {
    const links = {};
    $$('.rail .nav__task[href^="#"]').forEach(a => {
      links[a.getAttribute('href').slice(1)] = a;
    });
    return links;
  }

  function text(el, sel) {
    const t = el.querySelector(sel);
    return t ? t.textContent.replace(/\s+/g, ' ').trim() : '';
  }

  function wireScrollspy() {
    if (!('IntersectionObserver' in window)) return;
    const chapters = $$('.chapter[id]');
    if (!chapters.length) return;

    const links = railLinks();

    const spy = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        Object.keys(links).forEach(k => links[k].classList.remove('is-active'));
        const a = links[e.target.id];
        if (a) a.classList.add('is-active');
      });
    }, { rootMargin: '-25% 0px -65% 0px' });

    chapters.forEach(ch => spy.observe(ch));
  }

  /* ── Lesefortschritt ──────────────────────────────────────────────────────
     Ein Artikel hat keine Punkte, aber ein Ende. Der Balken in der
     Seitenleiste zeigt, wie weit man ist — die einzige Rückmeldung, die ein
     Lehrkurs überhaupt geben kann.                                            */
  function wireReadingProgress() {
    const bars = $$('[data-read-progress]');
    if (!bars.length) return;

    /* Der weiteste erreichte Punkt wird gespeichert, nicht der aktuelle. Sonst
       würde die Übersicht einen Artikel als „ungelesen" führen, sobald man zum
       Nachschauen wieder nach oben scrollt.

       Und er wird überhaupt gespeichert, weil die Übersicht sonst einen Lehrkurs
       für immer als „als nächstes" vorschlägt: ein Artikel bekommt nie einen
       Aufgabenstand, also darf er auch nie fertig werden. Das war die einzige
       Stelle im Rahmenwerk, an der Fortschritt nicht ankommen konnte. */
    const gelesenAb = 90;
    const saved = WB.store ? WB.store.read('read') : null;

    function zeige(pct, beschriftung) {
      bars.forEach(b => {
        b.style.setProperty('--read', pct + '%');
        b.setAttribute('aria-valuenow', String(pct));
        const lbl = b.querySelector('[data-read-label]');
        if (lbl) lbl.textContent = beschriftung;
      });
    }

    let best = saved && saved.percent ? saved.percent : 0;

    /* NEU 13.11.2026 (Agent, Redesign der Seiten), am selben Tag auf Wunsch
       des Nutzers zurückgenommen auf „Scrollen reicht": hat die Seite ein
       `.etappe-ende`, ist sie ein Lab. Sein Stand (`percent`, `done`) kommt
       wie beim Artikel vom Scrollweg. Die Haken an den Etappen sind eine
       Anzeige daneben und ändern ihn nicht — siehe wireEtappen().

       Im Lab haken die Etappen die Seitenleiste ab, nicht das Scrollen.
       Deshalb bleibt die Kapitelliste dort leer: sonst stünde eine Etappe
       grün da, nur weil ihr Ende durchs Fenster kam. */
    const enden = $$('.etappe-ende');
    const lab = enden.length
      ? wireEtappen(enden, saved, () => { if (WB.store) WB.store.write('read', stand()); })
      : null;
    const chapters = lab ? [] : $$('.chapter[id]');

    /* NEU 13.11.2026 (Agent, Redesign der Seiten): welche Kapitel gelesen
       sind. Die Seitenleiste hakt sie ab — dieselben Marken wie an der Weglinie
       der Übersicht —, und wer wiederkommt, bekommt im Kopf das erste
       ungelesene Kapitel als Sprungziel.

       Gelesen ist ein Kapitel, wenn sein ENDE beim Scrollen durch die oberen
       drei Viertel des Fensters gekommen ist. Nicht „liegt oberhalb": wer per
       Sprungmarke zu Kapitel 8 springt, hat die sieben davor nicht gelesen,
       und ihr Ende liegt dann über dem Fenster, nicht darin. Und nicht beim
       Laden: auf einem hohen Bildschirm steht Kapitel 0 schon ganz im Bild,
       bevor jemand eine Zeile gelesen hat.

       Ein alter Stand ohne Kapitelliste, der schon „fertig" war, bleibt
       fertig: alle Kapitel gelten dann als gelesen. */
    const gelesen = {};
    if (saved && saved.kapitel) saved.kapitel.forEach(id => { gelesen[id] = true; });
    else if (saved && saved.done) chapters.forEach(ch => { gelesen[ch.id] = true; });

    const links = chapters.length ? railLinks() : {};
    function hake() {
      chapters.forEach(ch => {
        const a = links[ch.id];
        if (a) a.classList.toggle('is-done', !!gelesen[ch.id]);
      });
    }

    function kapitelPruefen(doc) {
      if (!chapters.length || doc.scrollTop <= 0) return false;
      const grenze = window.innerHeight * 0.75;
      let neu = false;
      chapters.forEach(ch => {
        if (gelesen[ch.id]) return;
        const unten = ch.getBoundingClientRect().bottom;
        if (unten >= 0 && unten <= grenze) { gelesen[ch.id] = true; neu = true; }
      });
      if (neu) hake();
      return neu;
    }

    /* Die Kapitelliste kommt nur dazu, wenn es Kapitel gibt. Eine Leseseite
       ohne Kapitel schreibt weiter genau { percent, done } — daran hängt
       tools/reading-progress-check.mjs. Ein Lab schreibt statt der Kapitel
       seine abgehakten Etappen dazu. */
    function stand() {
      const s = { percent: best, done: best >= gelesenAb };
      if (chapters.length) s.kapitel = chapters.filter(ch => gelesen[ch.id]).map(ch => ch.id);
      if (lab) s.etappen = lab.ids();
      return s;
    }

    /* Geändert am 22.09.2026: Scrollen liefert viele Ereignisse pro
       Prozentstufe. Identische Anzeigen nicht erneut ins DOM schreiben.
       Der erste Aufruf bleibt synchron, auch ohne Animations-Frame. */
    let lastPercent = null;
    function paint() {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const pct = max > 0 ? Math.min(100, Math.round((doc.scrollTop / max) * 100)) : 100;
      if (pct === lastPercent) return;
      lastPercent = pct;
      zeige(pct, pct + '%');
      const neu = kapitelPruefen(doc);
      if (pct > best || neu) {
        if (pct > best) best = pct;
        if (WB.store) WB.store.write('read', stand());
      }
    }
    /* passive: der Zuhörer verändert nichts am Ereignis, und der Browser darf
       das Scrollen deshalb nicht auf ihn warten lassen. */
    window.addEventListener('scroll', paint, { passive: true });
    window.addEventListener('resize', paint);
    hake();
    paint();

    /* NEU 13.11.2026 (Agent, Redesign der Seiten): die beiden Karten. Einmal
       beim Laden und nicht bei jedem Scrollen — „Weitermachen" ist eine
       Auskunft für den, der wiederkommt, nicht für den, der gerade liest.
       Im Lab bestellt wireEtappen() die Karte im Kopf selbst; die am Ende
       nennt hier wie dort die nächste Seite. */
    if (WB.weg) {
      const n = chapters.length;
      const zahl = chapters.filter(ch => gelesen[ch.id]).length;
      const ziel = chapters.filter(ch => !gelesen[ch.id])[0];
      const fertig = best >= gelesenAb;
      if (!lab) WB.weg.kopf(zahl > 0 && ziel && !fertig ? {
        label: 'Weitermachen',
        where: [text(ziel, '.chapter__tag'), zahl + ' von ' + n + ' Kapiteln gelesen']
          .filter(Boolean).join(' · '),
        title: text(ziel, 'h2') || 'Nächstes Kapitel',
        href: '#' + ziel.id,
        btn: 'Weiterlesen →'
      } : null);
      WB.weg.schluss(WB.weg.naechsteSeite());
    }
  }

  /* ── Etappen eines Labs ───────────────────────────────────────────────────
     NEU 13.11.2026 (Agent, Redesign der Seiten).

     Jede Etappe hat ein prüfbares Ende (`.etappe-ende`, Rahmenwerk.md, „Der
     Aufbau eines Labs"). Genau dort kann man sie abhaken.

     GEAENDERT 13.11.2026, zweite Fassung (Agent, auf Wunsch des Nutzers:
     „Scrollen reicht"). Die erste Fassung vom selben Tag machte die Haken zum
     Stand des Labs: fertig erst, wenn alle gesetzt sind. Das ist
     zurückgenommen. Fertig wird ein Lab wie ein Artikel durch Scrollen
     (wireReadingProgress), und die Übersicht schlägt es danach nicht mehr vor.

     Die Haken sind eine Anzeige für den, der sie setzt: die Etappe wird in
     der Seitenleiste grün, und wer wiederkommt, bekommt im Kopf die erste
     offene Etappe als Sprungziel. An `percent` und `done` ändern sie nichts.
     Gespeichert werden sie im selben Eintrag als `etappen`; hub.js liest das
     Feld nicht.

     Ein fertiger Stand ohne `etappen` hakt nichts ab: durchgeblättert ist
     nicht abgehakt. Eine Etappe ohne `.etappe-ende` (üblich: „Ergebnis &
     Hilfe") hat keinen Haken.

     Gibt `{ ids }` zurück, oder null, wenn kein Ende in einem Kapitel liegt.
     `speichere` schreibt den ganzen Stand; den Scrollanteil kennt nur der
     Aufrufer.                                                                 */
  function wireEtappen(enden, saved, speichere) {
    const links = railLinks();
    const etappen = enden
      .map(e => ({ ende: e, kap: e.closest('.chapter[id]') }))
      .filter(x => x.kap);
    const n = etappen.length;
    if (!n) return null;

    const erledigt = {};
    if (saved && saved.etappen) saved.etappen.forEach(id => { erledigt[id] = true; });

    etappen.forEach(x => {
      const lab = document.createElement('label');
      lab.className = 'etappe-ende__ok';
      const box = document.createElement('input');
      box.type = 'checkbox';
      const txt = document.createElement('span');
      lab.appendChild(box);
      lab.appendChild(txt);
      x.ende.appendChild(lab);
      x.box = box;
      x.txt = txt;
      box.addEventListener('change', () => {
        erledigt[x.kap.id] = box.checked;
        male();
        speichere();
      });
    });

    function ids() { return etappen.filter(x => erledigt[x.kap.id]).map(x => x.kap.id); }

    function male() {
      etappen.forEach(x => {
        const ok = !!erledigt[x.kap.id];
        x.box.checked = ok;
        x.txt.textContent = ok ? 'Erledigt' : 'Etappe abhaken';
        x.ende.classList.toggle('is-done', ok);
        x.kap.classList.toggle('is-done', ok);
        const a = links[x.kap.id];
        if (a) a.classList.toggle('is-done', ok);
      });

      if (!WB.weg) return;
      const zahl = ids().length;
      const ziel = etappen.filter(x => !erledigt[x.kap.id])[0];
      /* Nur für den, der Haken setzt und noch welche offen hat. Die Karte am
         Seitenende gehört nicht hierher: sie nennt die nächste Seite, weil
         das Lab mit dem Durchscrollen fertig ist. */
      WB.weg.kopf(zahl && ziel ? {
        label: 'Weitermachen',
        where: [text(ziel.kap, '.chapter__tag'), zahl + ' von ' + n + ' Etappen abgehakt']
          .filter(Boolean).join(' · '),
        title: text(ziel.kap, 'h2') || 'Nächste Etappe',
        href: '#' + ziel.kap.id,
        btn: 'Zur Etappe →'
      } : null);
    }

    male();
    return { ids };
  }

  function start() {
    wireCards();
    wireScrollspy();
    wireReadingProgress();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
