# Portieren

**Der dritte Auftrag.** Er gilt, wenn zu einem Thema schon Lernmaterial existiert — Markdown-Notizen, handgeschriebene HTML-Blätter, ein früheres Bootcamp — und dieses Material auf das Rahmenwerk soll.

Er schließt die beiden anderen nicht aus, sondern kommt vor ihnen: Was schon da ist, wird portiert; was fehlt, wird nach `Klausurvorbereitung.md` oder `NeuesThema.md` ergänzt. Zusätzlich zu dieser Datei ist `Rahmenwerk.md` zu lesen.

Geschrieben nach der Portierung von Modul 02 eines Homelab-Bootcamps. Jede Regel hier kommt aus einem Fehler dieses Durchgangs.

---

# Schritt 0 · Ein Modul, nicht alle

**Portiere zuerst genau ein Modul und lass es abnehmen.** Erst danach die übrigen.

Der Grund ist nicht Vorsicht, sondern Kosten: Aufbau, Umfang und Ton entscheiden sich am ersten Modul, und beim ersten liegt man daneben. Acht Module in einem Zug portieren heißt, denselben Fehler achtmal zu machen und achtmal zu korrigieren.

Wähle dafür **nicht** das erste Modul des Kurses, sondern eines mit möglichst vielen Formen: Rechnung, Diagramm, Messung, Kommandozeile. Was daran trägt, trägt überall.

---

# Schritt 1 · Aufstellen

```
git clone <repo> <Zielordner>
```

Danach **die Struktur auflösen**. Im Repo heißt der Kursordner `Stylevorgabe`, weil er dort das Gerüst ist. In einem fertigen Modul ist der Name irreführend — wer ihn öffnet, vermutet Beispielmaterial und findet den Produktionsstand.

Verschiebe deshalb `assets/`, `index.html`, `index.data.js` eine Ebene hoch und lösche `Stylevorgabe`. `tools/bootcamp-check.ps1` erkennt beide Layouts von selbst; du musst nichts anpassen.

`Nutzereinstellungen.md` steht in der `.gitignore` und kommt beim Klonen **nicht** mit. Kopiere sie von Hand, sonst gilt das Profil nicht.

## Was gelöscht wird und was nicht

| Datei | |
|---|---|
| `Modul_03_Verbundnetze.*`, `Fourier_Lehrkurs.html`, `Canvas_Beispiel.canvas` | dürfen weg, sobald eigene Blätter da sind |
| `assets/viz-fourier.js` | weg mit dem Fourier-Artikel |
| **`assets/viz-verbundnetz.js`** | **bleibt** — `selbsttest.data.js` lädt es |
| **`assets/img/schema-verbundnetz.svg`** | **bleibt** — die Hotspot-Aufgabe des Selbsttests |
| `assets/selbsttest.*`, `tools/`, `index.*` | bleiben immer |

Die zwei fett markierten Zeilen sind die Falle: Wer beim Aufräumen alles Fachfremde löscht, nimmt dem Rahmenwerk seine Regressionsprüfung — und merkt es erst, wenn der nächste Prüflauf rot ist.

**Der Selbsttest gehört nicht in `index.data.js`.** Er ist ein Entwicklerwerkzeug, kein Lernstoff, und die Übersicht soll genau einen nächsten Schritt empfehlen. Die Datei bleibt, das Prüfwerkzeug findet sie von selbst.

---

# Schritt 2 · Ausgangsbefund

```
pwsh tools/bootcamp-check.ps1
```

**Vor der ersten eigenen Zeile.** Erwartet wird `ERGEBNIS: GRUEN` und Exitcode 0. Danach ist jeder rote Befund deiner — das spart beim ersten eigenen Blatt eine halbe Stunde Suche in fremdem Code.

---

# Schritt 3 · Reihenfolge innerhalb eines Moduls

**Aufgabenheft zuerst**, obwohl der Lernende es als zweites benutzt.

Es ist der Teil, an dem sich das Rahmenwerk am stärksten von handgeschriebenem Material unterscheidet: Aufgaben sind Datenobjekte, es gibt neun Typen statt der gewohnten drei, und `validate.js` prüft mit. Wer hier durch ist, hat den Rest verstanden.

Danach der Fachartikel, dann das Lab, zuletzt `index.data.js`.

Prüfe nach **jedem** Schritt, nicht am Ende:

```
pwsh tools/bootcamp-check.ps1 -Sheets <Blattname> -SkipWidths     # schnell, beim Bauen
pwsh tools/bootcamp-check.ps1 -Pages <Artikel>,<Lab>,index        # vollständig, vor „fertig"
```

Die Breitenprüfung meldet nur die **Anzahl** abgeschnittener Stellen in der Zusammenfassung. Die Selektoren stehen weiter oben im Protokoll, in Zeilen mit `client=` — danach filtern, sonst sucht man das Element von Hand.

---

# Schritt 4 · Umfang

**Nimm die Länge der Vorlage nicht als Obergrenze.** Das ist der Fehler, der beim ersten Durchgang passiert ist.

Aus 379 Zeilen Markdown wurden 454 Zeilen HTML, und dabei fielen Inhalte weg statt Wiederholungen: die Anknüpfung an das Vorwissen, eine ganze Begriffstabelle, die Missverständnisse. Das Ergebnis las sich anspruchsvoll und anstrengend — es setzte voraus, was es vorher selbst hätte aufbauen müssen.

Nach der Korrektur: **1138 Zeilen**, dreizehn Kapitel statt neun, und leichter zu lesen als die Markdown-Fassung. Der Grund steht in `Rahmenwerk.md` unter *Dichte · Der Gegenfehler*: HTML trägt mehr, weil Tabellen, Merkkästen und `<details>` die Menge aufnehmen, ohne eine Wand zu bilden.

Praktisch beim Portieren:

- **Geh die Vorlage Abschnitt für Abschnitt durch und hake ab.** Was du weglässt, lässt du bewusst weg, nicht aus Versehen.
- **Jeder Fachbegriff wird bei erster Verwendung erklärt.** In einer Notizsammlung durfte man auf eine andere Notiz verlinken; eine HTML-Seite hängt nicht im Vault-Graph.
- **Eine Aufzählung im Fließtext wird eine Tabelle.** Eine Warnung wird ein `callout`. Eine Vertiefung wird ein `<details class="reveal">` — Ausführlichkeit, die zugeklappt anfängt, kostet den Leser nichts.
- **Mermaid-Diagramme gibt es nicht.** Ersetze sie durch eine externe SVG in `assets/img/` oder eine Tabelle. Eine gute Tabelle schlägt ein mittelmäßiges Diagramm.

---

# Schritt 5 · Labs aus einer Anleitung

Eine Markdown-Anleitung ist meist ein Block. Schneide sie in **Etappen von 20 bis 25 Minuten**, jede mit eigenem Ziel und sichtbarem Ende — die Randbedingung aus `Nutzereinstellungen.md`.

Sortiere die Etappen nach **Eingriffstiefe**: erst die, die nur lesen, dann die, die verändern. Wer nach der zweiten aufhört, hat gemessen und nichts angefasst.

Was ein Lab von einer Befehlsliste unterscheidet und beim Kürzen zuerst wegfällt:

- die **erwartete Ausgabe** zu jedem Befehl
- eine Tabelle „was es bedeutet, wenn dort etwas anderes steht"
- der **Rückweg** vor jeder verändernden Etappe, und das Aufräumen danach
- eine **Ergebnistabelle** zum Ausfüllen — eine Messung ohne notierten Wert ist keine
- eine **Troubleshooting-Tabelle**
- was das Lab **nicht** geprüft hat

---

# Schritt 6 · Zurückspielen

Was du am Rahmenwerk verbessert hast, gehört in dieses Repo — nicht in den Modulordner. Bei dieser Portierung waren es fünf Dinge, alle im File gekennzeichnet:

| Fund | Datei |
|---|---|
| `.brand__name` ohne `overflow-wrap` — hat zugeschlagen | `assets/styles.css` |
| `.chapter h2` mit `break-word` statt `anywhere` — latent | `assets/styles.css` |
| keine Regel für Kommandoblöcke → `.term`, `.etappe-ende` | `assets/styles.css` |
| `.viz img` fehlte | `assets/styles.css` |
| Kursordner festgeschrieben statt erkannt | `tools/bootcamp-check.ps1` |

**Ein Muster daran ist übertragbar:** Die beiden Layoutfehler waren Verstöße gegen eine Regel, die in `Rahmenwerk.md` selbst steht. Sie sind nie aufgefallen, weil kein Beispielblatt ein langes deutsches Kompositum an dieser Stelle hatte. Bei einem Fachthema trifft das die Seitenleiste zuerst — **prüfe `brand__name` mit dem längsten Modulnamen, den der Kurs hat.**

Sag am Ende, was du geändert hast, damit es eingespielt werden kann.
