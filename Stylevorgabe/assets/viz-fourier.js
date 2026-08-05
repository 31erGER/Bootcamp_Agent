/* ============================================================================
   viz-fourier.js — die drei Zeichnungen des Fourier-Lehrkurses
   ---------------------------------------------------------------------------
   Vorher standen sie als 145-Zeilen-Skript in der Artikel-HTML, mit eigener
   fit()-Kopie und eigenem Farbzugriff. Drei Dinge sind dabei geändert worden:

   1. Farben kommen jetzt aus dem Canvas-Element statt aus :root. Nur so greift
      die Variante [data-variant='loesung'] — vorher war eine Zeichnung im
      Lösungsblatt terracotta, während der Rest blau war. Und die eine
      hartcodierte Farbe rgba(214,67,29,.28) für die Bausteine ist weg.
   2. Der erste Frame entsteht ohne requestAnimationFrame. Der Zeiger zeichnete
      früher NUR in der rAF-Schleife — im Headless-Browser feuert rAF nie, die
      Zeichnung blieb im Prüflauf leer. Jetzt zeichnet viz.js einmal
      unabhängig davon, die Schleife legt nur die Bewegung darüber.
   3. Die Regler sind deklarativ (data-ctl/data-out im Markup) statt über
      getElementById verdrahtet. Der Artikel bleibt damit skriptfrei.

   Fachlich gegengerechnet:
     Rechteck(t) = (4/π) · Σ sin(kt)/k über k = 1, 3, 5, …
     ⇒ |cₙ| = 4/(πn) für ungerade n, 0 für gerade n
     Grundwelle 4/π ≈ 1,273 — die Teilsumme überschwingt an den Kanten
     (Gibbs), unabhängig davon, wie viele Glieder man nimmt.
   ============================================================================ */

/* ══════════════════════════════════════════════════════════════════════════
   1 · Rechteck aus Sinusschwingungen
   ══════════════════════════════════════════════════════════════════════════ */
WB.viz.define('rechteck-synthese', function (ctx, w, h, p, c) {
  const V = WB.viz;
  const N = Math.max(1, Math.round(p.n === undefined ? 1 : p.n));
  const zeigeTeile = !!p.teile;

  const mid = h / 2;
  const amp = h * 0.33;
  const XMAX = 4 * Math.PI;

  /* Nullinie */
  V.line(ctx, 0, mid, w, mid, c.hairStrong, 1);

  /* Zielsignal */
  const ziel = [];
  for (let px = 0; px <= w; px++) {
    const x = (px / w) * XMAX;
    ziel.push([px, mid - (Math.sin(x) >= 0 ? 1 : -1) * amp]);
  }
  V.polyline(ctx, ziel, c.mute, 1.3, [5, 5]);

  /* Die einzelnen Bausteine, auf Wunsch */
  if (zeigeTeile) {
    let k = 1;
    for (let i = 0; i < N; i++) {
      const pts = [];
      for (let px = 0; px <= w; px++) {
        const x = (px / w) * XMAX;
        pts.push([px, mid - ((4 / Math.PI) * Math.sin(k * x) / k) * amp]);
      }
      V.polyline(ctx, pts, c.tint, 1.4);
      k += 2;
    }
  }

  /* Die Teilsumme */
  function teilsumme(x) {
    let s = 0, k = 1;
    for (let i = 0; i < N; i++) { s += Math.sin(k * x) / k; k += 2; }
    return s * 4 / Math.PI;
  }
  const summe = [];
  for (let px = 0; px <= w; px++) summe.push([px, mid - teilsumme((px / w) * XMAX) * amp]);
  V.polyline(ctx, summe, c.accent, 2.6);

  /* Der Überschwinger ist der Lehrsatz dieser Zeichnung, also wird er benannt.
     Beschriftung im Band ÜBER dem Signal: die Teilsumme bleibt unter
     1,3 · amp, oberhalb davon ist immer Platz. */
  V.band(ctx, [
    { text: N + (N === 1 ? ' Harmonische' : ' Harmonische'), pill: c.accent },
    { text: 'gestrichelt: Zielsignal', color: c.mute }
  ], 8, 14, w - 8);
});

/* ══════════════════════════════════════════════════════════════════════════
   2 · Rotierender Zeiger und seine Projektionen
   ══════════════════════════════════════════════════════════════════════════
   Legt die abgeleiteten Werte in `p` ab (tw, cw, sw); viz.js zeichnet zuerst
   und füllt danach die [data-out]-Anzeigen, deshalb kommen sie an.            */
WB.viz.define('zeiger', function (ctx, w, h, p, c) {
  const V = WB.viz;
  const TAU = 2 * Math.PI;
  const t = ((((p.t || 0) % TAU) + TAU) % TAU);

  p.tw = t;
  p.cw = Math.cos(t);
  p.sw = Math.sin(t);

  const cx = h * 0.5, cy = h * 0.5, r = h * 0.38;

  /* Einheitskreis mit Achsen */
  ctx.save();
  ctx.strokeStyle = c.hair;
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.stroke();
  ctx.restore();
  V.line(ctx, cx - r, cy, cx + r, cy, c.hair, 1);
  V.line(ctx, cx, cy - r, cx, cy + r, c.hair, 1);

  const tx = cx + r * Math.cos(t);
  const ty = cy - r * Math.sin(t);

  /* Projektionen: waagerecht ist der Kosinus, senkrecht der Sinus */
  V.line(ctx, tx, ty, tx, cy, c.mute, 1, [3, 3]);
  V.line(ctx, tx, ty, cx, ty, c.deep, 1, [3, 3]);

  /* Der Zeiger */
  V.line(ctx, cx, cy, tx, ty, c.accent, 2.6);
  V.dot(ctx, tx, ty, 4, c.accent);

  /* Die Wellen rechts daneben — nur wenn genug Platz ist. Auf 320 px bleibt
     nichts übrig, und ein 30 px breites Diagramm ist keine Information,
     sondern Rauschen. */
  const gx0 = h * 1.05;
  const gw = w - gx0 - 8;
  if (gw > 60) {
    V.line(ctx, gx0, cy, w - 8, cy, c.hairStrong, 1);

    const cosPts = [], sinPts = [];
    for (let i = 0; i <= gw; i++) {
      const th = (i / gw) * TAU;
      cosPts.push([gx0 + i, cy - Math.cos(th) * r]);
      sinPts.push([gx0 + i, cy - Math.sin(th) * r]);
    }
    V.polyline(ctx, cosPts, c.mute, 1.4);
    V.polyline(ctx, sinPts, c.deep, 1.8);

    const mx = gx0 + (t / TAU) * gw;
    V.line(ctx, mx, cy - r, mx, cy + r, c.accent, 1, [2, 3]);
    V.dot(ctx, mx, cy - Math.cos(t) * r, 3.5, c.mute);
    V.dot(ctx, mx, cy - Math.sin(t) * r, 3.5, c.accent);

    V.label(ctx, 'cos', gx0 + 4, cy - r - 6, c.mute, 'left');
    V.label(ctx, 'sin', gx0 + 34, cy - r - 6, c.deep, 'left');
  }
});

/* ══════════════════════════════════════════════════════════════════════════
   3 · Das Spektrum des Rechtecks
   ══════════════════════════════════════════════════════════════════════════ */
WB.viz.define('spektrum', function (ctx, w, h, p, c) {
  const V = WB.viz;
  const NMAX = 13;
  const base = h - 34, left = 44, top = 20;
  const maxAmp = 4 / Math.PI;
  const gw = (w - left - 20) / NMAX;

  V.line(ctx, left, base, w - 10, base, c.hairStrong, 1);

  for (let n = 1; n <= NMAX; n++) {
    const x = left + (n - 0.5) * gw;
    const amp = n % 2 === 1 ? 4 / (Math.PI * n) : 0;
    if (amp > 0) {
      const bh = (amp / maxAmp) * (base - top);
      ctx.save();
      ctx.fillStyle = c.accent;
      ctx.fillRect(x - gw * 0.28, base - bh, gw * 0.56, bh);
      ctx.restore();
      /* Der Wert über dem Balken, aber nur wenn die Säulen breit genug sind —
         sonst überlappen die Zahlen und man liest Unsinn statt nichts. */
      if (gw > 34) V.label(ctx, V.num(amp, 2), x, base - bh - 6, c.deep, 'center');
    }
    V.label(ctx, String(n), x, base + 16, c.mute, 'center');
  }

  V.label(ctx, '|cₙ|', 8, top + 2, c.mute, 'left');
  V.label(ctx, 'Frequenz n →', w - 12, h - 6, c.mute, 'right');
});
