
# Willkommen

Dies ist ein Workflow für einen Agent, um ein Stoffgebiet lernbar auszuarbeiten. Es entsteht ein Bootcamp aus HTML-Seiten mit Aufgaben, Punkten, Fortschritt und Zeichnungen — alles per Doppelklick, ohne Server und ohne Build.

Es gibt drei Aufträge:

- **Klausurvorbereitung** — im Verzeichnis liegen die Unterlagen eines Moduls, und die Prüfung steht an.
- **Neues Thema** — es gibt keine Unterlagen, das Thema wird dem Agenten im Prompt genannt.
- **Portieren** — es gibt schon Lernmaterial, aber im falschen Format: Notizen, handgeschriebene HTML-Blätter, ein früheres Bootcamp.

Der Ordner `src/assets` ist dabei **kein Beispiel zum Abschauen, sondern ein lauffähiges Rahmenwerk**: Aufgaben-Engine mit zwölf Aufgabentypen, maschinell geprüfte Redaktionsregeln, Canvas-Zeichenbausteine, Fortschrittsspeicher und sieben Prüfwerkzeuge. Alles läuft per Doppelklick, ohne Server und ohne Build.

## Loslegen

### Schritt 1

Das Projekt in den Ordner des jeweiligen Moduls oder Unterrichtsfachs clonen (oder in den Ordner, in dem das neue Thema ausgearbeitet werden soll).

### Schritt 2

`Nutzereinstellungen.example.md` nach `Nutzereinstellungen.md` kopieren und ausfüllen: das jeweilige AI-Modell und die persönliche Vorstellung des Nutzers an die KI. Das ist die einzige Datei, die angepasst werden muss — `CLAUDE.md` bindet sie ein, damit sie in jeder Sitzung gilt.

`Nutzereinstellungen.md` steht in der `.gitignore` und wird **nie** eingecheckt. Sie enthält persönliche Angaben; wer das Repo teilt, teilt sie nicht mit.

### Schritt 3

AI-Agent losschicken. In Claude Code genügt „bereite mich auf die Klausur in diesem Modul vor", „ich will etwas über *Thema* lernen" oder „portier das vorhandene Material auf das Rahmenwerk" — die Skills in `.claude/skills/` greifen selbst. Alternativ die Slash-Commands `/klausur`, `/thema <Thema>` und `/portieren <Modul>`, oder bei einem anderen Agenten direkt: „lies [[Klausurvorbereitung]] und [[Rahmenwerk]] und arbeite sie ab" (bzw. [[NeuesThema]] oder [[Portieren]]).

> [!tip] Ohne Plan Mode starten
> Beide Aufträge haben einen eigenen **Schritt 0**: der Agent legt erst Inventar, Gewichtung und Blattplan vor (Klausurvorbereitung) beziehungsweise Zuschnitt und Landkarte (Neues Thema) und baut erst nach einer Bestätigung. Das leistet dasselbe wie Plan Mode, nur fachlich statt dateibezogen — es fragt nach Gewichtung und Abgrenzung, nicht nach Dateilisten. Beides zu benutzen ist Doppelarbeit und kostet einen zusätzlichen Durchgang.
>
> Plan Mode lohnt an einer anderen Stelle: wenn am **Rahmenwerk selbst** gearbeitet wird — `src/assets/`, `tools/`. Dort geht es um Regressionsrisiko für alle Module, und dafür ist die dateibezogene Vorschau das richtige Werkzeug.

### Schritt 4

Wenn der Agent fertig ist, selbst gegenprüfen:

```
pwsh tools/bootcamp-check.ps1
```

Erwartet wird `ERGEBNIS: GRUEN` und Exitcode 0. Das heißt „nichts Kaputtes gefunden" — nicht „gut". Was ein Exitcode nicht prüfen kann, listet die Ausgabe am Ende auf; ausführlich steht es im Abschnitt *Prüfen, bevor „fertig" gesagt wird* der [[Rahmenwerk]].

## Was wo liegt

Das Wurzelverzeichnis enthält genau zwei Sorten Dateien: den **Einstieg** und die **Anweisungen für den Agenten**. Alles Gebaute liegt in `src/`, alles Prüfende in `tools/`.

```
startseite.html              ← hier doppelklicken
README.md                      diese Datei
CLAUDE.md · AGENTS.md          gelten in jeder Sitzung
Rahmenwerk.md                  wie gebaut wird — gilt für jeden Auftrag
Klausurvorbereitung.md         Auftrag A ┐
NeuesThema.md                  Auftrag B ├ genau einer davon gilt
Portieren.md                   Auftrag C ┘
Nutzereinstellungen.example.md Vorlage zum Kopieren
src/                           der Kurs: startseite.data.js, Blätter, Module, assets/
tools/                         Prüfwerkzeuge
```

| Datei | wofür |
|---|---|
| `startseite.html` | **hier doppelklicken.** Die Übersicht des Kurses: Module, Schritte, Fortschritt, Weiter-Karte. Liegt bewusst im Wurzelverzeichnis und ist die einzige Seite dort. |
| `src/startseite.data.js` | ihr Inhalt — die einzige Datei, die beim Anlegen eines Blattes noch angefasst werden muss |
| `src/` | der **Showcase**: zwei vollständige Module und alles, was nur eine Klausurphase braucht. Gleichzeitig Stilvorgabe und Kopiervorlage. Hieß bis 09/2026 `Stylevorgabe`. |
| `src/Anleitung.html` | **danach hier weiterlesen.** Sagt Zeile für Zeile, welche Seite welches Merkmal vorführt — und welche Teile nur in der Klausurphase gebraucht werden. |
| `src/Modul_NN_Thema_*` | ein **Modul** als Dreiklang: Lehrkurs, Aufgabenheft, Lab. Das Lab am Schluss, und es fehlt nie. |
| `src/Klausurphase/` | Lernplan, Abdeckungskarte, Intensivkurs, Probeklausur — als Ordner löschbar, wenn es keine Prüfung gibt |
| `src/assets/` | Stylesheet, Engine, Schriften, Zeichenbausteine — **wird gebraucht, nicht gelöscht** |
| `src/Canvas_Beispiel.canvas` | Syntaxbeispiel für Obsidian-Canvas, nur für den Agenten. Eine Canvas, die *für den Kurs* entsteht, legt er ins Wurzelverzeichnis — geöffnet wird sie mit **Obsidian**, nicht per Doppelklick. |
| `src/assets/selbsttest.html` | Regressionsblatt mit je einer Aufgabe pro Aufgabenart (dreizehn), 270 Punkte. Nach jeder Änderung am Rahmenwerk einmal durchlaufen lassen. |
| `tools/bootcamp-check.ps1` | prüft Selbstlauf, Redaktionsregeln, Breiten, CSS-Klassen, SVG, Kursschlüssel — und ruft die Node-Prüfungen darunter auf |
| `tools/*.mjs` | Prüfungen ohne Browser: Bewertungsregeln der Engine, unabhängig nachgerechnete Endergebnisse, Speicherbrücke, Fortschrittsbalken |
| `tools/klausurphase.config.mjs` | die Erwartungen, die nur eine Klausur kennt. Bleibt **leer, aber vorhanden**, wenn es keine Prüfung gibt. |
| `Nutzereinstellungen.example.md` | Vorlage: hierher kopieren als `Nutzereinstellungen.md` und ausfüllen — **die einzige Datei, die man anpasst** |
| `Nutzereinstellungen.md` | die eigenen Angaben. Steht in der `.gitignore`, wird nie eingecheckt. |
| `CLAUDE.md` | gilt automatisch in jeder Sitzung: bindet das Profil ein und sagt, welcher Auftrag wofür da ist |
| `Rahmenwerk.md` | alle Bauregeln: Aufgabentypen, Redaktion, Zeichnen, Layout, Prüfung, `file://` |
| `Klausurvorbereitung.md` | Auftrag A — Modul mit Unterlagen, Prüfung steht an |
| `Portieren.md` | Auftrag C — vorhandenes Material auf das Rahmenwerk umstellen |
| `NeuesThema.md` | Auftrag B — freies Thema aus dem Prompt, keine Unterlagen |
| `.claude/skills/`, `.claude/commands/` | die Trigger, damit man den Auftrag nicht jedes Mal beim Namen nennen muss |

Der Fortschritt liegt im `localStorage` des Browsers, je Blatt getrennt, und überlebt das Neuladen. Der Knopf *Stand löschen* in der Seitenleiste beginnt von vorn.
