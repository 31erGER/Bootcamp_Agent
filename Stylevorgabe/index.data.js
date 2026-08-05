/* ============================================================================
   index.data.js — was in diesem Modulordner liegt
   ---------------------------------------------------------------------------
   Die einzige Datei, die beim Anlegen eines neuen Blattes noch angefasst werden
   muss. `points` ist die Höchstpunktzahl des Blattes; sie dient nur der Anzeige,
   BEVOR das Blatt zum ersten Mal geöffnet wurde — danach kommt der Wert aus dem
   gespeicherten Stand und geht auch nicht mehr auseinander.

   Ein Eintrag OHNE `points` gilt als Lesestoff: kein Balken, keine Punkte, er
   zählt nicht in den Gesamtstand. Sonst würde der Anteil sinken, sobald man
   einen Lehrkurs liest.
   ============================================================================ */

WB.hub({
  kicker: 'Meisterschule · Energieversorgung',
  headline: 'Modul 03<br><em>Verbundnetze.</em>',
  lede: 'Zwei Aufgabenhefte, ein Lehrkurs und der Selbsttest des Rahmenwerks. ' +
        'Der Stand liegt im Browser dieses Rechners und überlebt das Neuladen.',

  entries: [
    {
      file: 'Modul_03_Verbundnetze.html',
      id: 'M03a',
      kind: 'Aufgabenheft',
      title: 'Verbundnetze, Regelzonen und Frequenzhaltung',
      desc: '18 Aufgaben über alle neun Aufgabentypen: wer hält die 50&nbsp;Hz, wer springt ein, ' +
            'wenn ein Kraftwerk ausfällt, und warum ist Deutschland die Drehscheibe Europas.',
      points: 345,
      minutes: 90
    },
    {
      file: 'Fourier_Lehrkurs.html',
      kind: 'Lehrkurs',
      title: 'Fourier von Grund auf',
      desc: 'Zehn Kapitel vom Wechselstrom zur Fourier-Reihe, mit drei Zeichnungen zum ' +
            'Anfassen und 54 Karteikarten. Kein Vorwissen nötig.',
      minutes: 45
    },
    {
      file: 'assets/selbsttest.html',
      kind: 'Selbsttest',
      title: 'Neun Typen, ein Durchlauf',
      desc: 'Das Regressionsblatt des Rahmenwerks — von jedem Aufgabentyp genau eine Instanz. ' +
            'Nach jeder Änderung an <code>engine.js</code> oder <code>styles.css</code> einmal ' +
            'durchlaufen lassen.',
      points: 185,
      minutes: 20
    }
  ]
});
