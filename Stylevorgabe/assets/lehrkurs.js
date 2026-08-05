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
  function wireScrollspy() {
    if (!('IntersectionObserver' in window)) return;
    const chapters = $$('.chapter[id]');
    if (!chapters.length) return;

    const links = {};
    $$('.rail .nav__task[href^="#"]').forEach(a => {
      links[a.getAttribute('href').slice(1)] = a;
    });

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
    let best = 0;
    if (WB.store) {
      const saved = WB.store.read('read');
      if (saved && saved.percent) best = saved.percent;
    }

    function paint() {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const pct = max > 0 ? Math.min(100, Math.round((doc.scrollTop / max) * 100)) : 100;
      bars.forEach(b => {
        b.style.setProperty('--read', pct + '%');
        b.setAttribute('aria-valuenow', String(pct));
        const lbl = b.querySelector('[data-read-label]');
        if (lbl) lbl.textContent = pct + '%';
      });
      if (pct > best) {
        best = pct;
        if (WB.store) WB.store.write('read', { percent: best, done: best >= gelesenAb });
      }
    }
    /* passive: der Zuhörer verändert nichts am Ereignis, und der Browser darf
       das Scrollen deshalb nicht auf ihn warten lassen. */
    window.addEventListener('scroll', paint, { passive: true });
    window.addEventListener('resize', paint);
    paint();
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
