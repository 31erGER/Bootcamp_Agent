/* ============================================================================
   viz.js — Canvas-Rahmen und Zeichenbausteine
   ---------------------------------------------------------------------------
   Eine Visualisierung ist eine reine Zeichenfunktion:

     WB.viz.define('name', function (ctx, w, h, p, c) { … });

   ctx  2D-Kontext, schon auf Geräte-Pixel skaliert — in CSS-Pixeln rechnen
   w,h  Größe in CSS-Pixeln
   p    die Reglerwerte als Objekt
   c    die Farben aus den CSS-Tokens

   Eingebunden wird deklarativ, das Blatt bleibt skriptfrei:

     <figure class="viz" data-viz="druckgradient" data-viz-opts='{"height":320}'>
       <div class="viz__title">Druckgradient und Wind</div>
       <canvas></canvas>
       <div class="viz__ctrl">
         <label>Abstand
           <input type="range" data-ctl="d" min="200" max="1200" step="50" value="600">
           <output data-out="d">600 km</output>
         </label>
       </div>
       <figcaption class="viz__cap">…</figcaption>
     </figure>

   data-ctl gibt den Namen im Parameterobjekt, data-out zeigt den Wert an. Alles
   mit demselben Namen wird beim Schieben mitgeführt; die Einheit darf im
   ursprünglichen Text von data-out stehen und bleibt erhalten.

   ── Drei Dinge, die hier weh getan haben ──────────────────────────────────────

   1. Farben NIE als Literal in eine Zeichenfunktion. Sie kommen aus den Tokens,
      und gelesen wird vom CANVAS-Element aus, nicht von :root. Sonst greift die
      Variante [data-variant='loesung'] nicht, und dieselbe Visualisierung ist im
      Lösungsblatt terracotta statt blau.

   2. Zwei Zeichnungen nach dem Schriftladen. Diese Blätter bringen ihre
      Schriften als base64 mit; Canvas kann eine noch nicht geladene Schrift
      nicht abwarten und vermisst die Beschriftung mit der Ersatzschrift. Ohne
      den zweiten Durchgang stehen alle Labels ein paar Pixel falsch — sichtbar
      erst, wenn zwei knapp aneinander liegen, und dann als Kollision.

   3. requestAnimationFrame wird NICHT benutzt. Im Headless-Browser werden keine
      Frames produziert, rAF feuert dort nie — eine Visualisierung, die darauf
      wartet, bleibt im Prüflauf für immer leer, und das Prüfwerkzeug meldet
      „nicht gezeichnet", ohne dass an der Zeichnung etwas falsch wäre.
   ============================================================================ */

window.WB = window.WB || {};

(function (WB) {
  'use strict';

  /* ══════════════════════════════════════════════════════════════════════════
     1 · Farben aus den Tokens
     ══════════════════════════════════════════════════════════════════════════ */

  const TOKENS = {
    ink: '--ink', soft: '--ink-soft', mute: '--ink-mute',
    hair: '--hair', hairStrong: '--hair-strong',
    paper: '--paper', surface: '--surface', surface2: '--surface-2',
    accent: '--accent', deep: '--accent-deep', soft2: '--accent-soft', tint: '--accent-tint',
    signal: '--signal', easy: '--easy', med: '--med', hard: '--hard'
  };

  /* Fällt ein Token aus, wird nicht unsichtbar gezeichnet, sondern auffällig:
     ein fehlendes Token soll man sehen und nicht suchen. */
  const FALLBACK = '#ff00ff';

  function readColors(el) {
    const cs = getComputedStyle(el);
    const out = {};
    Object.keys(TOKENS).forEach(k => {
      out[k] = cs.getPropertyValue(TOKENS[k]).trim() || FALLBACK;
    });
    return out;
  }

  /* ══════════════════════════════════════════════════════════════════════════
     2 · Schriften im Canvas
     ══════════════════════════════════════════════════════════════════════════
     Achsen, Messwerte und Einheiten in der Monospace, wie überall sonst auf dem
     Blatt. Der Familienname muss zu @font-face in fonts.css passen, sonst
     zeichnet Canvas stillschweigend in der Ersatzschrift.                      */

  const MONO   = "11px 'JetBrains Mono', ui-monospace, monospace";
  const MONO_B = "bold 12px 'JetBrains Mono', ui-monospace, monospace";
  const SANS   = "13px 'Archivo', system-ui, sans-serif";
  const SANS_B = "bold 13px 'Archivo', system-ui, sans-serif";

  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  /** Deutsche Zahl mit Dezimalkomma. */
  const num = (v, digits) => Number(v).toFixed(digits === undefined ? 1 : digits).replace('.', ',');

  /* ══════════════════════════════════════════════════════════════════════════
     3 · Zeichenbausteine
     ══════════════════════════════════════════════════════════════════════════
     Jeder sichert und stellt den Kontext wieder her. Das ist Absicht: eine
     Zeichenfunktion soll sich nie fragen müssen, welchen lineDash der letzte
     Aufruf hinterlassen hat.                                                   */

  function line(ctx, x1, y1, x2, y2, color, width, dash) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = width || 1;
    if (dash) ctx.setLineDash(dash);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
  }

  /** Breite eines Textes in der gegebenen Schrift, ohne ihn zu zeichnen. */
  function textWidth(ctx, text, font) {
    ctx.save();
    ctx.font = font || MONO;
    const w = ctx.measureText(String(text)).width;
    ctx.restore();
    return w;
  }

  /**
   * Beschriftungsband: setzt Marken der Reihe nach von links und schiebt den
   * Zeiger jeweils um die GEMESSENE Breite weiter. Was nicht mehr passt, fällt
   * weg statt sich zu überlagern.
   *
   * Das ist der Ersatz für „ich setze die Beschriftung an die Stelle, wo das
   * Ereignis liegt". Bei einer Zeitachse über 15 Minuten liegen drei Marken aus
   * der ersten Minute alle auf demselben Pixel — die Reihenfolge im Band trägt
   * die Information, nicht die x-Position.
   *
   * items: [{ text, color, font, pill: farbe|null }]
   * Gibt die Zahl der gezeichneten Marken zurück.
   */
  function band(ctx, items, x, y, xmax, gap) {
    const g = gap === undefined ? 10 : gap;
    let cur = x;
    let drawn = 0;
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      const font = it.font || MONO;
      const w = it.pill
        ? textWidth(ctx, it.text, MONO_B) + 14
        : textWidth(ctx, it.text, font);
      if (cur + w > xmax) break;
      if (it.pill) pill(ctx, it.text, cur, y, it.pill, it.fg);
      else label(ctx, it.text, cur, y + 4, it.color, 'left', font);
      cur += w + g;
      drawn++;
    }
    return drawn;
  }

  function label(ctx, text, x, y, color, align, font) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.font = font || MONO;
    ctx.textAlign = align || 'left';
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  /** Pfeil mit Spitze — für Vektoren, Ströme, Richtungen. */
  function arrow(ctx, x1, y1, x2, y2, color, width, head) {
    const a = Math.atan2(y2 - y1, x2 - x1);
    const hd = head || 9;
    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = width || 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - hd * Math.cos(a - 0.42), y2 - hd * Math.sin(a - 0.42));
    ctx.lineTo(x2 - hd * Math.cos(a + 0.42), y2 - hd * Math.sin(a + 0.42));
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function polyline(ctx, pts, color, width, dash) {
    if (!pts || pts.length < 2) return;
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = width || 2;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    if (dash) ctx.setLineDash(dash);
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.stroke();
    ctx.restore();
  }

  /** Geschlossene Fläche unter oder zwischen Kurven. */
  function area(ctx, pts, color) {
    if (!pts || pts.length < 3) return;
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function dot(ctx, x, y, r, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
  }

  /**
   * Beschriftung auf farbigem Grund. Der einzige Weg, eine Beschriftung
   * verlässlich über Linien lesbar zu halten: es gibt KEINE feste Stelle im
   * Feld, die bei jeder Reglerstellung frei bleibt, wenn eine Kurve jede Höhe
   * erreichen kann. Entweder in den Rand — oder hierher.
   * Gibt die Breite zurück, damit man mehrere aneinandersetzen kann.
   */
  function pill(ctx, text, x, y, bg, fg) {
    ctx.save();
    ctx.font = MONO_B;
    ctx.textBaseline = 'middle';
    const w = ctx.measureText(text).width + 14;
    const h = 18;
    ctx.fillStyle = bg;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, y - h / 2, w, h, 9);
    else ctx.rect(x, y - h / 2, w, h);
    ctx.fill();
    ctx.fillStyle = fg || '#fff';
    ctx.textAlign = 'center';
    ctx.fillText(text, x + w / 2, y + 0.5);
    ctx.restore();
    return w;
  }

  /**
   * Achsenkreuz mit Rahmen und Gitter. Nimmt einem das Abzählen der Ränder ab
   * und liefert die Rechenfunktionen für die Umrechnung Wert → Pixel zurück.
   *
   * Die Achsen folgen dem INHALT, nicht einem runden Wunschwert: eine Kurve, die
   * in die Achse läuft, sieht dort wie eine eigene Struktur aus, und man sucht
   * den Fehler in der Formel statt im Achsenbereich.
   */
  function frame(ctx, w, h, c, opts) {
    const o = opts || {};
    const pad = o.pad || { l: 48, r: 16, t: 14, b: 30 };
    const x0 = pad.l, x1 = w - pad.r, y0 = pad.t, y1 = h - pad.b;

    ctx.save();
    ctx.strokeStyle = c.hair;
    ctx.lineWidth = 1;
    ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);
    ctx.restore();

    const xmin = o.xmin === undefined ? 0 : o.xmin;
    const xmax = o.xmax === undefined ? 1 : o.xmax;
    const ymin = o.ymin === undefined ? 0 : o.ymin;
    const ymax = o.ymax === undefined ? 1 : o.ymax;

    const fx = v => x0 + ((v - xmin) / (xmax - xmin)) * (x1 - x0);
    const fy = v => y1 - ((v - ymin) / (ymax - ymin)) * (y1 - y0);

    (o.xticks || []).forEach(t => {
      const x = fx(t.v === undefined ? t : t.v);
      line(ctx, x, y0, x, y1, c.hair, 1, [2, 4]);
      label(ctx, String(t.label === undefined ? num(t, 0) : t.label), x, y1 + 16, c.mute, 'center');
    });
    (o.yticks || []).forEach(t => {
      const y = fy(t.v === undefined ? t : t.v);
      line(ctx, x0, y, x1, y, c.hair, 1, [2, 4]);
      label(ctx, String(t.label === undefined ? num(t, 0) : t.label), x0 - 8, y + 4, c.mute, 'right');
    });

    if (o.xlabel) label(ctx, o.xlabel, x1, y1 + 26, c.mute, 'right');
    if (o.ylabel) label(ctx, o.ylabel, x0, y0 - 4, c.mute, 'left');

    return { x0, x1, y0, y1, fx, fy, xmin, xmax, ymin, ymax };
  }

  /* ══════════════════════════════════════════════════════════════════════════
     4 · Register und Rahmen
     ══════════════════════════════════════════════════════════════════════════ */

  const DRAWINGS = {};

  /** Eine Zeichenfunktion anmelden. */
  function define(name, fn) { DRAWINGS[name] = fn; }

  const mounted = [];

  function mount(fig) {
    const name = fig.getAttribute('data-viz');
    const draw = DRAWINGS[name];
    const canvas = fig.querySelector('canvas');
    if (!canvas) return null;

    if (!draw) {
      /* Nicht stillschweigend nichts tun: eine leere Fläche sieht aus wie ein
         Ladefehler und man sucht am falschen Ende. */
      const ctx = canvas.getContext('2d');
      canvas.width = 400; canvas.height = 80;
      if (ctx) {
        ctx.font = MONO_B;
        ctx.fillStyle = '#9a2820';
        ctx.fillText('viz.js: keine Zeichenfunktion „' + name + '"', 12, 30);
        ctx.fillText('WB.viz.define(' + JSON.stringify(name) + ', …) fehlt', 12, 52);
      }
      console.warn('viz.js: unbekannte Visualisierung "' + name + '"');
      return null;
    }

    let opts = {};
    const raw = fig.getAttribute('data-viz-opts');
    if (raw) {
      try { opts = JSON.parse(raw); }
      catch (e) { console.warn('viz.js: data-viz-opts ist kein gültiges JSON in "' + name + '"'); }
    }
    const height = opts.height || 320;
    canvas.style.height = height + 'px';
    canvas.style.width = '100%';
    canvas.style.display = 'block';

    /* ── Reglerwerte ──
       Startwerte aus dem Markup, damit der Anfangszustand im HTML steht und
       nicht im Skript. */
    const ctls = [].slice.call(fig.querySelectorAll('[data-ctl]'));
    const params = {};
    Object.keys(opts.params || {}).forEach(k => { params[k] = opts.params[k]; });

    /* Der ursprüngliche Text von data-out ist die Vorlage: „600 km" wird zu
       „{wert} km". So steht die Einheit im Blatt und nicht im Skript. */
    const outs = [].slice.call(fig.querySelectorAll('[data-out]')).map(el => {
      const tpl = el.textContent.trim();
      const unit = tpl.replace(/^[-\d.,\s]+/, '');
      /* data-digits erzwingt die Nachkommastellen. Ohne das zeigt eine
         Zeigerprojektion „1" statt „1,00" und springt beim Weiterlaufen in der
         Breite — die Zeile zuckt dann bei jedem Frame. */
      const d = el.getAttribute('data-digits');
      return { el, key: el.getAttribute('data-out'), unit, digits: d === null ? null : Number(d) };
    });

    function readCtls() {
      ctls.forEach(el => {
        const key = el.getAttribute('data-ctl');
        if (el.type === 'checkbox') params[key] = el.checked;
        else if (el.type === 'range' || el.type === 'number') params[key] = Number(el.value);
        else params[key] = el.value;
      });
    }
    function paintOuts() {
      outs.forEach(o => {
        const v = params[o.key];
        if (v === undefined) return;
        const digits = o.digits !== null ? o.digits
          : (typeof v === 'number' && Math.abs(v % 1) > 1e-9 ? 1 : 0);
        o.el.textContent = (typeof v === 'number' ? num(v, digits) : String(v)) +
          (o.unit ? ' ' + o.unit : '');
      });
    }
    readCtls();

    let colors = null;

    function render() {
      colors = colors || readColors(canvas);
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.clientWidth || 600;
      const h = canvas.clientHeight || height;
      const cw = Math.round(w * dpr), ch = Math.round(h * dpr);
      if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width = cw;
        canvas.height = ch;
      }
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      /* setTransform statt scale: scale multipliziert sich bei jedem Neuzeichnen
         auf, und die Zeichnung wächst mit jedem Reglerzucken. */
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      try {
        draw(ctx, w, h, params, colors);
      } catch (e) {
        console.error('viz.js: "' + name + '" ist beim Zeichnen gescheitert', e);
        label(ctx, 'Zeichenfehler — siehe Konsole', 12, 22, '#9a2820', 'left', MONO_B);
      }
    }

    /* Erst zeichnen, dann die Anzeigen füllen: eine Zeichenfunktion darf
       abgeleitete Werte in `params` schreiben (der Zeiger legt dort cos und sin
       ab), und die sollen im selben Durchgang sichtbar werden. */
    function update() { readCtls(); render(); paintOuts(); }

    /* ── Animation, falls das Blatt sie anfordert ──
       opts.animate = { key: 't', step: 0.018 }

       Der ERSTE Frame kommt ohne requestAnimationFrame, weiter unten über
       render(). Das ist der ganze Trick: im Headless-Browser werden keine Frames
       produziert, rAF feuert nie — eine Zeichnung, die nur in der Schleife
       zeichnet, bliebe im Prüflauf leer, und das Prüfwerkzeug meldete
       „nicht gezeichnet", ohne dass an ihr etwas falsch wäre. */
    if (opts.animate && 'requestAnimationFrame' in window) {
      const an = opts.animate;
      const key = an.key || 't';
      const step = an.step || 0.02;
      if (params[key] === undefined) params[key] = 0;
      let playing = an.autoplay !== false;

      const btn = fig.querySelector('[data-play]');
      if (btn) {
        const paint = () => { btn.textContent = playing ? (an.pauseLabel || 'Pause') : (an.playLabel || 'Start'); };
        paint();
        btn.addEventListener('click', () => { playing = !playing; paint(); });
      }

      const loop = function () {
        if (playing) { params[key] += step; render(); paintOuts(); }
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    }

    ctls.forEach(el => {
      el.addEventListener('input', update);
      el.addEventListener('change', update);
    });

    /* Der ResizeObserver zeichnet bei jeder Breitenänderung neu — auch beim
       ersten Layout, weshalb hier kein eigener Anfangsaufruf nötig wäre. Er
       kommt trotzdem, damit die Zeichnung auch dann steht, wenn der Browser
       keinen Observer hat. */
    if ('ResizeObserver' in window) {
      new ResizeObserver(render).observe(canvas);
    }

    render();
    paintOuts();

    const api = { name: name, fig: fig, canvas: canvas, params: params, render: render, update: update };
    mounted.push(api);
    return api;
  }

  function mountAll(root) {
    return [].slice.call((root || document).querySelectorAll('[data-viz]'))
      .map(mount).filter(Boolean);
  }

  /* ══════════════════════════════════════════════════════════════════════════
     5 · Start
     ══════════════════════════════════════════════════════════════════════════ */

  function start() {
    mountAll(document);

    /* Zweiter Durchgang nach dem Schriftladen. Die Blätter bringen ihre
       Schriften als base64 mit; beim ersten Zeichnen ist die Monospace oft noch
       nicht da, und Canvas vermisst dann mit der Ersatzschrift. Sichtbar wird
       das erst, wenn zwei Beschriftungen knapp beieinander liegen — dann
       überlappen sie. */
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        mounted.forEach(function (m) { m.render(); });
      });
    }
    /* Rückfall für Browser ohne document.fonts: einmal spät nachzeichnen.
       Bewusst setTimeout und nicht requestAnimationFrame — im
       Headless-Browser feuert rAF nie. */
    setTimeout(function () { mounted.forEach(function (m) { m.render(); }); }, 300);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

  WB.viz = {
    define: define,
    mount: mount,
    mountAll: mountAll,
    mounted: mounted,
    readColors: readColors,
    /* Bausteine */
    line: line, label: label, arrow: arrow, polyline: polyline,
    area: area, dot: dot, pill: pill, frame: frame,
    band: band, textWidth: textWidth,
    /* Schriften und Zahlen */
    MONO: MONO, MONO_B: MONO_B, SANS: SANS, SANS_B: SANS_B,
    clamp: clamp, num: num
  };

})(window.WB);
