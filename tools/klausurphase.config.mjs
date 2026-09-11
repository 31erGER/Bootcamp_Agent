/* ============================================================================
   klausurphase.config.mjs — die Erwartungen, die nur eine Klausur kennt
   ---------------------------------------------------------------------------
   NUR FÜR DIE KLAUSURPHASE. Ein Bootcamp, das ein neues Thema aufarbeitet
   (`NeuesThema.md`), hat keine Klausur, keine Punktzahl und keinen Termin. Dann
   bleibt diese Datei leer: beide Werkzeuge melden dann „keine Erwartungen
   hinterlegt" und beenden sich GRÜN. Sie wird nicht gelöscht, damit
   `tools/bootcamp-check.ps1` unverändert durchläuft.

   Warum das überhaupt eine Datei ist: die beiden Werkzeuge daneben sind
   Rahmenwerk und bleiben von Kurs zu Kurs gleich. Was sich ändert, sind die
   Zahlen und Begriffe eines konkreten Moduls — und die gehören nicht in den
   Prüfcode, sonst wird er bei jedem Kurs neu geschrieben und dabei verschlissen.

   Die Werte unten sind die des Showcase-Bootcamps in `src/`. Sie sind
   Dummy-Daten und gleichzeitig ein vollständiges Beispiel: wer einen echten
   Kurs baut, ersetzt sie und lässt die Struktur stehen.
   ============================================================================ */

/* ── Abdeckung ───────────────────────────────────────────────────────────────
   Die Gegenprobe zur Abdeckungskarte (`Abdeckung.html`): Ein Begriff, der laut
   Karte abgedeckt ist, muss auch WIRKLICH in einem Aufgabenobjekt stehen. Ohne
   diese Prüfung behauptet die Karte Abdeckung, und niemand merkt, wenn eine
   Aufgabe später umgeschrieben wurde. Alle Begriffe klein schreiben — verglichen
   wird kleingeschrieben. */
export const abdeckung = [
  {
    file: 'Modul_02_Verbundnetze.data.js',
    concepts: ['regelzone', 'primärregelung', 'sekundärregelung', 'netzleistungszahl']
  },
  {
    file: 'Klausurphase/Intensiv_01_Netzrechnen.data.js',
    concepts: ['volllaststunden', 'spannungsfall', 'gleichzeitigkeitsfaktor']
  }
];

/* ── Probeklausur ────────────────────────────────────────────────────────────
   Die Bedingungen, die die Probeklausur der echten Klausur nachbilden soll.
   `punkte` ist bewusst eine vollständige Tabelle und nicht nur eine Summe: eine
   Verschiebung von 4 Punkten zwischen zwei Aufgaben verändert die Summe nicht,
   aber die Gewichtung des Faches — und genau das will man gemeldet bekommen. */
export const probeklausur = {
  datei: 'Klausurphase/Probeklausur.data.js',
  minuten: 90,
  bestehen: 50,
  gesamt: 100,
  aufgaben: 8,
  punkte: { 1: 12, 2: 10, 3: 8, 4: 14, 5: 10, 6: 12, 7: 18, 8: 16 },

  /* Wie viele Aufgaben mindestens ein selbst gerechnetes Endergebnis verlangen.
     Der Wert ist der Hebel gegen die häufigste Entartung einer Probeklausur:
     lauter Auswahlaufgaben, die sich angenehm lösen und nichts beweisen. */
  mindestensErgebnisaufgaben: 4,

  /* Aufgabentypen, die in einer Klausursimulation nichts zu suchen haben, weil
     sie den Lösungsweg vorgeben oder nur Wiedererkennen prüfen. `reverse` steht
     seit dem 11.09.2026 dabei: der Typ ist gut zum Lernen, aber er legt alle
     Fragen als Auswahl vor — in einer Prüfung muss man sie selbst mitbringen. */
  ungeeigneteTypen: ['calc', 'estimate', 'hotspot', 'dnd', 'reverse'],

  /* Fachliche Mindestabdeckung der Klausur, Abschnitt für Abschnitt. */
  abdeckung: [
    ['Netzbetrieb', ['regelzone', 'frequenz', 'netzleistungszahl']],
    ['Lastgang', ['volllaststunden', 'gleichzeitigkeitsfaktor']],
    ['Übertragung', ['spannungsfall', 'querschnitt']],
    ['Schutz und Bemessung', ['selektivität', 'bemessungsstrom']]
  ]
};
