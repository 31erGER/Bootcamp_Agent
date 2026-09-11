/* ============================================================================
   startseite.data.js — der Inhalt der Startseite
   ---------------------------------------------------------------------------
   Die einzige Datei, die beim Anlegen eines neuen Blattes noch angefasst werden
   muss, und gleichzeitig der vollständige Beispielaufruf von `WB.hub`.

   ══ EIN MODUL IST EIN DREIKLANG ═══════════════════════════════════════════
   Vorbild ist das AuD-Bootcamp mit acht Modulen in genau dieser Form:

       Modul_NN_Thema_Lehrkurs.html   Fachartikel   ← Schritt 1, erklärt
       Modul_NN_Thema.html/.data.js   Aufgabenheft  ← Schritt 2, prüft
       Modul_NN_Thema_Lab.html        Lab           ← Schritt 3, lässt machen

   Alle drei tragen dasselbe Präfix, stehen in EINER Gruppe und in dieser
   Reihenfolge. **Das Lab steht immer am Schluss** — es setzt voraus, dass die
   Begriffe sitzen, und es ist der Teil, der ohne die beiden davor nicht
   funktioniert. Ein Modul ohne Lab ist unvollständig: Lesen und Ankreuzen
   erzeugen kein Können.

   ══ DIE DREI FELDER, AN DENEN DIE ÜBERSICHT HÄNGT ═════════════════════════
     `points`  Höchstpunktzahl des Blattes, nur für die Anzeige VOR dem ersten
               Öffnen. Ein Eintrag OHNE `points` gilt als Lesestoff: keine
               Punkte, kein Anteil am Gesamtstand. Lehrkurs und Lab haben
               deshalb keine — sonst sänke der Stand, sobald man liest.

     `tasks`   Die Zahl der Aufgaben, VERBINDLICH: der Balken zählt bearbeitete
               Aufgaben, nicht Punkte, und `tasks` hat Vorrang vor dem
               gespeicherten Stand. Ohne das Feld steht nach einer Erweiterung
               die alte Aufgabenzahl im Nenner — der Balken zeigt 100 %, obwohl
               zwei Aufgaben dazugekommen sind.

     `group`   Gruppiert wird über AUFEINANDERFOLGENDE Läufe. Die Reihenfolge
               der `entries` IST die empfohlene Lernreihenfolge, und die
               Weiter-Karte nimmt den ersten offenen Eintrag von oben. Wer eine
               Gruppe verschieben will, verschiebt ihre drei Einträge.

   ══ WAS HIER BEWUSST NICHT STEHT ══════════════════════════════════════════
   `src/assets/selbsttest.html` ist ein ENTWICKLERWERKZEUG und kein Lernstoff.
   Die Übersicht soll genau einen nächsten Schritt empfehlen; ein Regressions-
   blatt zwischen den Modulen verwässert das. Die Datei bleibt liegen, das
   Prüfwerkzeug findet sie von selbst, und `src/Anleitung.html` verlinkt sie.

   ══ PFADE ═════════════════════════════════════════════════════════════════
   Diese Datei liegt im Wurzelverzeichnis, die Blätter in `src/`. Deshalb trägt
   jedes `file` diesen Pfad. Die Klausurphase liegt eine Ebene tiefer in
   `src/Klausurphase/` — löschbar als Ganzes, wenn es keine Prüfung gibt.

   DUMMY-DATEN. Was hier welches Merkmal vorführt, steht in `src/Anleitung.html`.
   ============================================================================ */

WB.hub({
  kicker: 'Rahmenwerk · Showcase',
  headline: 'Beispielkurs<br><em>Energietechnik.</em>',
  lede: 'Zwei vollständige Module, jedes aus Lehrkurs, Aufgabenheft und Lab — und dahinter ' +
        'alles, was nur eine Klausurphase braucht. Fang bei der Anleitung an: sie sagt, welche ' +
        'Seite welches Merkmal des Rahmenwerks vorführt. Der Stand liegt im Browser dieses ' +
        'Rechners und überlebt das Neuladen.',

  /* `step: true` ergibt die Kopfzeile „Schritt n von m" — gezählt NUR über die
     Gruppen mit diesem Feld. Anleitung und Klausurphase sind keine Etappe des
     Lernwegs und bekommen deshalb ein festes `label`. */
  groups: {
    'Start hier': {
      label: 'Bevor du anfängst',
      note: 'Einmal lesen, danach weißt du, was hier liegt und in welcher Reihenfolge du es ' +
            'durchgehst.'
    },
    'Modul 01 · Signale und Spektren': {
      step: true,
      note: 'Der Einstieg: was eine Periode mit einer Frequenz zu tun hat und was ein Spektrum ' +
            'überhaupt zeigt. Modul 02 baut darauf auf.'
    },
    'Modul 02 · Verbundnetze': {
      step: true,
      note: 'Dieselbe 50-Hz-Schwingung, aber als <b>Regelgröße</b> statt als Rechengröße — und ' +
            'damit die Frage, wer sie hält.'
    },
    'Klausurphase': {
      label: 'Nur mit Prüfungstermin',
      note: 'Diese vier Seiten liegen in <code>src/Klausurphase/</code> und entfallen als Ganzes, ' +
            'wenn ein Thema ohne Prüfung aufgearbeitet wird — siehe NeuesThema.md.'
    }
  },

  entries: [

    /* ── Start hier ─────────────────────────────────────────────────────────
       Steht VOR den Modulen, ohne `points`: die Anleitung ist Wegweiser und
       nicht Stoff, und die Weiter-Karte oben soll als erstes auf sie zeigen. */
    {
      file: 'src/Anleitung.html',
      group: 'Start hier',
      kind: 'Anleitung',
      title: 'Zuerst: was hier liegt und wozu',
      desc: 'Welche Seite welches Merkmal des Rahmenwerks vorführt, wie ein Modul aufgebaut ist, ' +
            'wie Punkte und Fortschritt funktionieren — und was ein grüner Prüflauf ausdrücklich ' +
            '<b>nicht</b> beweist.'
    },

    /* ── Modul 01 · der Dreiklang ───────────────────────────────────────────
       Lehrkurs, Heft, Lab. Genau diese Reihenfolge, Lab am Schluss. */
    {
      file: 'src/Modul_01_Signale_Lehrkurs.html',
      group: 'Modul 01 · Signale und Spektren',
      kind: 'Lehrkurs',
      title: 'Fourier von Grund auf',
      desc: 'Zehn Kapitel vom Wechselstrom zur Fourier-Reihe, mit drei Zeichnungen zum Anfassen ' +
            'und 54 Karteikarten. Kein Vorwissen nötig — und keine Punkte, nur ein Lesestand.'
    },
    {
      file: 'src/Modul_01_Signale.html',
      group: 'Modul 01 · Signale und Spektren',
      id: 'M01',
      kind: 'Aufgabenheft',
      title: 'Periode, Frequenz, Spektrum',
      desc: '11 Aufgaben, jede Aufgabenart genau einmal, sechs davon schwer: warum ein ' +
            'Rechteck keine geraden Harmonischen hat, welche Koeffizienten eine Symmetrie zum ' +
            'Verschwinden bringt — und zu welcher Frage ein Zahlenwert gehört.',
      tasks: 11,
      points: 225
    },
    {
      file: 'src/Modul_01_Signale_Lab.html',
      group: 'Modul 01 · Signale und Spektren',
      kind: 'Lab',
      title: 'Ein Spektrum von Hand',
      desc: 'Fünf Etappen mit Bleistift und Millimeterpapier: drei Sinusse addieren, das ' +
            'Spektrum auftragen, drei Werte gegenprüfen. Ohne Bewertung, mit Sollwerten am ' +
            'Ende jeder Etappe.'
    },

    /* ── Modul 02 · der Dreiklang ─────────────────────────────────────────── */
    {
      file: 'src/Modul_02_Verbundnetze_Lehrkurs.html',
      group: 'Modul 02 · Verbundnetze',
      kind: 'Lehrkurs',
      title: 'Das Verbundnetz von Grund auf',
      desc: 'Sieben Kapitel: warum ein Verbund, die Frequenz als Waage, die Netzleistungszahl mit ' +
            'Regler zum Ausprobieren, die drei Regelstufen und die Kennwerte des Lastgangs. ' +
            'Mit vier Karteikarten und vier Kontrollfragen.'
    },
    {
      file: 'src/Modul_02_Verbundnetze.html',
      group: 'Modul 02 · Verbundnetze',
      id: 'M02',
      kind: 'Aufgabenheft',
      title: 'Regelzonen und Frequenzhaltung',
      desc: '11 Aufgaben, jede Aufgabenart genau einmal, sechs davon schwer: wer hält die ' +
            '50&nbsp;Hz, wer springt ein, wenn ein Kraftwerk ausfällt, und warum ist die ' +
            'Netzleistungszahl das Maß für die Steifigkeit eines Netzes.',
      tasks: 11,
      points: 225
    },
    {
      file: 'src/Modul_02_Verbundnetze_Lab.html',
      group: 'Modul 02 · Verbundnetze',
      kind: 'Lab',
      title: 'Lastgang mit eigenen Zahlen',
      desc: 'Fünf Etappen an der eigenen Jahresabrechnung: Lastgang zeichnen, Volllaststunden und ' +
            'Benutzungsgrad rechnen, das Ergebnis einordnen. Geprüft wird gegen ' +
            'Plausibilitätsbereiche — bei eigenen Daten der einzige ehrliche Test.'
    },

    /* ── Klausurphase ───────────────────────────────────────────────────────
       Der einzige Teil, der einen Prüfungstermin voraussetzt. Ohne Klausur wird
       der Ordner `src/Klausurphase/` gelöscht, diese vier Einträge entfallen,
       und `tools/klausurphase.config.mjs` bleibt leer — Übersicht, Engine und
       alle Prüfwerkzeuge laufen dann unverändert weiter. */
    {
      file: 'src/Klausurphase/Lernplan.html',
      group: 'Klausurphase',
      kind: 'Lernplan',
      title: 'Lernplan bis zur Prüfung',
      desc: 'Eine Kachel je Tag mit Fokus und Link auf das passende Blatt. Der ' +
            'Kalenderexport liegt als <code>Lernplan.ics</code> im Arbeitsordner — die Datei ist ' +
            'der Export, diese Seite ist die Darstellung.'
    },
    {
      file: 'src/Klausurphase/Abdeckung.html',
      group: 'Klausurphase',
      kind: 'Abdeckung',
      title: 'Kommt alles vor, was vorkommen kann?',
      desc: 'Jedes Thema mit dem Blatt, das es abdeckt — und die Liste dessen, was bewusst fehlt. ' +
            'Gegengeprüft von <code>tools/exam-coverage-check.mjs</code>, damit die Karte nicht ' +
            'behauptet, was die Aufgaben nicht halten.'
    },
    {
      file: 'src/Klausurphase/Intensiv_01_Netzrechnen.html',
      group: 'Klausurphase',
      id: 'I01',
      kind: 'Intensivkurs',
      title: 'Netz- und Anlagenrechnen',
      desc: 'Theorieblock, danach acht Aufgaben ohne Rechenweg — darunter eine Papieraufgabe mit ' +
            'Selbstbewertung. Die Steigerungsform des Aufgabenhefts und deshalb Klausurstoff, ' +
            'kein Lernmodul.',
      tasks: 8,
      points: 155
    },
    {
      file: 'src/Klausurphase/Probeklausur.html',
      group: 'Klausurphase',
      id: 'PK',
      kind: 'Probeklausur',
      title: 'Selbst lösen, einmal abgeben',
      desc: '8 Aufgaben, 100 Punkte, 90 Minuten, bestanden ab 50. Countdown in der Seitenleiste, ' +
            'keine Rückmeldung und keine zweite Chance, solange die Klausur läuft.',
      tasks: 8,
      points: 100
    }
  ]
});
