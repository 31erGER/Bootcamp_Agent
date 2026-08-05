/* ============================================================================
   viz-verbundnetz.js — Zeichnungen zum Thema Verbundnetze
   ---------------------------------------------------------------------------
   Wird von beiden Blättern geladen: assets/selbsttest.html und
   Modul_03_Verbundnetze.html. Deshalb heißt die Datei nach dem THEMA und nicht
   nach einem Blatt — eine Zeichnung, die zwei Blätter brauchen, gehört keinem
   davon allein.

   `frequenzeinbruch` zeigt den Frequenzverlauf nach einem Kraftwerksausfall und
   bindet damit zusammen, was sonst in vier getrennten Aufgaben steht: Trägheit,
   Primärregelung, die BLEIBENDE Abweichung und erst danach die Sekundärregelung.

   Gleichzeitig ist sie der Beleg, dass viz.js trägt — das Prüfwerkzeug meldet
   `vizMounted`. Und sie ist die Vorlage: wer eine neue Zeichnung schreibt,
   kopiert sich den Aufbau hier heraus.

   Fachlich gegengerechnet:
     Δf = ΔP / λ   (Netzleistungszahl λ in MW/Hz)
     900 MW bei 15 000 MW/Hz ⇒ 0,060 Hz = 60 mHz
   Der Transient unterschwingt den Beharrungswert, bevor die Primärregelung
   greift — deshalb liegt der Tiefpunkt unter der Linie, auf der es stehen
   bleibt. Das ist der Punkt, den die Zeichnung sichtbar machen soll.

   ── Drei Zeichenregeln, die hier angewandt sind ──────────────────────────────

   1. Die Achsen folgen dem INHALT. `span` hängt am Einbruch, nicht an einem
      runden Wunschwert. Sonst läuft die Kurve bei 3000 MW auf einem kleinen Netz
      unten in die Achse und sieht dort wie eine eigene Struktur aus.
   2. Beschriftung nur in ein Band, das GARANTIERT frei ist. Hier ist das der
      Streifen über 50 Hz: die Kurve erreicht 50 Hz als Maximum und die
      Obergrenze der Achse liegt darüber. Ein Fleck „irgendwo oben rechts" wäre
      bei anderer Reglerstellung von der Kurve überschrieben.
   3. Marken, die zusammenfallen KÖNNEN, gegeneinander aufschieben. Die
      Beharrungslinie und die 50-Hz-Linie rücken bei kleinem Einbruch zusammen —
      deshalb hängt ihr Abstand über `span` am Einbruch selbst.
   ============================================================================ */

WB.viz.define('frequenzeinbruch', function (ctx, w, h, p, c) {
  const V = WB.viz;

  const dP = p.dp === undefined ? 900 : p.dp;        /* MW  */
  const lam = p.lam === undefined ? 15000 : p.lam;   /* MW/Hz */
  const dip = dP / lam;                              /* Hz, bleibende Abweichung */

  /* Zeitmarken in Minuten. Die Primärregelung ist nach 30 s vollständig
     abgerufen, die Sekundärregelung übernimmt danach. */
  const T_FAIL = 0.5, T_NADIR = 0.62, T_ARREST = 1.0, T_SEC = 2.0, T_BACK = 8.0;
  const T_MAX = 15;

  /* Achsen aus dem Einbruch heraus. Der Tiefpunkt liegt bei 1,35 × Einbruch;
     `span` muss ihn mit Luft fassen. Untergrenze 0,08 Hz, damit ein winziger
     Einbruch nicht auf eine Achse mit vier Nachkommastellen führt. */
  const span = Math.max(0.08, dip * 1.9);
  const ymin = 50 - span;
  const ymax = 50 + span * 0.12;

  const yticks = [];
  for (let i = 0; i <= 4; i++) {
    const v = ymin + ((ymax - ymin) * i) / 4;
    yticks.push({ v: v, label: V.num(v, 2) });
  }

  const g = V.frame(ctx, w, h, c, {
    pad: { l: 54, r: 18, t: 20, b: 32 },
    xmin: 0, xmax: T_MAX, ymin: ymin, ymax: ymax,
    xticks: [0, 3, 6, 9, 12, 15].map(v => ({ v: v, label: String(v) })),
    yticks: yticks,
    xlabel: 'Minuten', ylabel: 'Hz'
  });

  /* ── Sollfrequenz ── */
  V.line(ctx, g.x0, g.fy(50), g.x1, g.fy(50), c.mute, 1.5, [5, 4]);

  /* ── Beharrungswert, auf dem die Primärregelung die Frequenz stehen lässt ──
     Erst ab dem Zeitpunkt, ab dem er gilt — eine Linie über die ganze Breite
     hätte behauptet, der Wert gelte von Anfang an. */
  V.line(ctx, g.fx(T_ARREST), g.fy(50 - dip), g.x1, g.fy(50 - dip), c.hard, 1, [3, 4]);
  V.label(ctx, V.num(50 - dip, 3) + ' Hz', g.x1 - 4, g.fy(50 - dip) - 6, c.hard, 'right');

  /* ── Der Verlauf ── */
  function f(t) {
    if (t < T_FAIL) return 50;
    if (t < T_NADIR) {
      /* Trägheit: die Frequenz fällt, bis die Primärregelung greift. Sie
         unterschwingt den Wert, auf dem sie danach stehen bleibt. */
      const k = (t - T_FAIL) / (T_NADIR - T_FAIL);
      return 50 - dip * 1.35 * k;
    }
    if (t < T_ARREST) {
      const k = (t - T_NADIR) / (T_ARREST - T_NADIR);
      return 50 - dip * (1.35 - 0.35 * k);
    }
    if (t < T_SEC) return 50 - dip;
    if (t < T_BACK) {
      /* Sekundärregelung: weich zurück auf 50 Hz. */
      const k = (t - T_SEC) / (T_BACK - T_SEC);
      return 50 - dip * (1 - (1 - Math.cos(k * Math.PI)) / 2);
    }
    return 50;
  }

  const pts = [];
  for (let t = 0; t <= T_MAX + 1e-9; t += 0.05) pts.push([g.fx(t), g.fy(f(t))]);
  V.polyline(ctx, pts, c.accent, 2.2);

  /* ── Zeitmarken ── */
  [[T_FAIL, 'Ausfall'], [T_ARREST, 'Primär'], [T_SEC, 'Sekundär']].forEach(function (m) {
    V.line(ctx, g.fx(m[0]), g.fy(50), g.fx(m[0]), g.y1, c.hairStrong, 1, [2, 3]);
  });

  /* ── Beschriftung im garantiert freien Band über 50 Hz ──
     Die Kurve erreicht 50 Hz als Höchstwert; alles darüber bleibt frei, bei
     jeder Reglerstellung. Deshalb steht hier die Legende und nicht irgendwo
     im Feld.

     Und sie läuft über V.band() von links durch, nicht an den x-Werten der
     Ereignisse: T_ARREST liegt bei 1 von 15 Minuten, also 30 px vom Rand. Erst
     hatte ich Pille und Text dort verankert — „Ausfall 3000 MW", „−375 mHz" und
     „bleibende Abweichung" lagen dann alle drei übereinander. Im Band trägt die
     REIHENFOLGE die Information, nicht die Position, und was nicht mehr passt,
     fällt weg statt sich zu überlagern. Genau das braucht der 340-px-Fall. */
  const bandY = (g.y0 + g.fy(50)) / 2;
  V.band(ctx, [
    { text: 'Ausfall ' + V.num(dP, 0) + ' MW', color: c.deep, font: V.MONO_B },
    { text: '−' + V.num(dip * 1000, 0) + ' mHz', pill: c.hard },
    { text: 'bleibt stehen', color: c.mute }
  ], g.x0 + 6, bandY, g.x1 - 4);

  /* ── Tiefpunkt markieren: das ist der Wert, den man in einer Klausur mit dem
        Beharrungswert verwechselt. ── */
  V.dot(ctx, g.fx(T_NADIR), g.fy(50 - dip * 1.35), 3.5, c.accent);
  V.label(ctx, 'Tiefpunkt', g.fx(T_NADIR) + 8, g.fy(50 - dip * 1.35) + 4, c.soft, 'left');
});
