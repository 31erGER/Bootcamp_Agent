
# Willkommen

Dies ist ein Workflow für einen Agent, um ein Stoffgebiet lernbar auszuarbeiten. Es entsteht ein Bootcamp aus HTML-Seiten mit Aufgaben, Punkten, Fortschritt und Zeichnungen — alles per Doppelklick, ohne Server und ohne Build.

Es gibt zwei Aufträge:

- **Klausurvorbereitung** — im Verzeichnis liegen die Unterlagen eines Moduls, und die Prüfung steht an.
- **Neues Thema** — es gibt keine Unterlagen, das Thema wird dem Agenten im Prompt genannt.

Der Ordner `Stylevorgabe/assets` ist dabei **kein Beispiel zum Abschauen, sondern ein lauffähiges Rahmenwerk**: Aufgaben-Engine mit neun Aufgabentypen, maschinell geprüfte Redaktionsregeln, Canvas-Zeichenbausteine, Fortschrittsspeicher und ein Prüfwerkzeug. Alles läuft per Doppelklick, ohne Server und ohne Build.

## Loslegen

### Schritt 1

Das Projekt in den Ordner des jeweiligen Moduls oder Unterrichtsfachs clonen (oder in den Ordner, in dem das neue Thema ausgearbeitet werden soll).

### Schritt 2

`Nutzereinstellungen.example.md` nach `Nutzereinstellungen.md` kopieren und ausfüllen: das jeweilige AI-Modell und die persönliche Vorstellung des Nutzers an die KI. Das ist die einzige Datei, die angepasst werden muss — `CLAUDE.md` bindet sie ein, damit sie in jeder Sitzung gilt.

`Nutzereinstellungen.md` steht in der `.gitignore` und wird **nie** eingecheckt. Sie enthält persönliche Angaben; wer das Repo teilt, teilt sie nicht mit.

### Schritt 3

AI-Agent losschicken. In Claude Code genügt „bereite mich auf die Klausur in diesem Modul vor" oder „ich will etwas über *Thema* lernen" — die Skills in `.claude/skills/` greifen selbst. Alternativ die Slash-Commands `/klausur` und `/thema <Thema>`, oder bei einem anderen Agenten direkt: „lies [[Klausurvorbereitung]] und [[Rahmenwerk]] und arbeite sie ab" (bzw. [[NeuesThema]]).

> [!tip] Ohne Plan Mode starten
> Beide Aufträge haben einen eigenen **Schritt 0**: der Agent legt erst Inventar, Gewichtung und Blattplan vor (Klausurvorbereitung) beziehungsweise Zuschnitt und Landkarte (Neues Thema) und baut erst nach einer Bestätigung. Das leistet dasselbe wie Plan Mode, nur fachlich statt dateibezogen — es fragt nach Gewichtung und Abgrenzung, nicht nach Dateilisten. Beides zu benutzen ist Doppelarbeit und kostet einen zusätzlichen Durchgang.
>
> Plan Mode lohnt an einer anderen Stelle: wenn am **Rahmenwerk selbst** gearbeitet wird — `Stylevorgabe/assets/`, `tools/`. Dort geht es um Regressionsrisiko für alle Module, und dafür ist die dateibezogene Vorschau das richtige Werkzeug.

### Schritt 4

Wenn der Agent fertig ist, selbst gegenprüfen:

```
pwsh tools/bootcamp-check.ps1
```

Erwartet wird `ERGEBNIS: GRUEN` und Exitcode 0. Das heißt „nichts Kaputtes gefunden" — nicht „gut". Was ein Exitcode nicht prüfen kann, listet die Ausgabe am Ende auf; ausführlich steht es im Abschnitt *Prüfen, bevor „fertig" gesagt wird* der [[Rahmenwerk]].

## Was wo liegt

| Datei | wofür |
|---|---|
| `Stylevorgabe/index.html` | die Übersichtsseite des Moduls — hier anfangen |
| `Stylevorgabe/*.html` + `*.data.js` | je ein Aufgabenblatt: Gerüst und Aufgaben getrennt |
| `Stylevorgabe/assets/` | Stylesheet, Engine, Schriften, Zeichenbausteine — **wird gebraucht, nicht gelöscht** |
| `Stylevorgabe/assets/selbsttest.html` | Regressionsblatt mit je einer Aufgabe pro Typ. Nach jeder Änderung am Rahmenwerk einmal durchlaufen lassen. |
| `tools/bootcamp-check.ps1` | prüft Selbstlauf, Redaktionsregeln, Breiten und CSS-Klassen |
| `Nutzereinstellungen.example.md` | Vorlage: hierher kopieren als `Nutzereinstellungen.md` und ausfüllen — **die einzige Datei, die man anpasst** |
| `Nutzereinstellungen.md` | die eigenen Angaben. Steht in der `.gitignore`, wird nie eingecheckt. |
| `CLAUDE.md` | gilt automatisch in jeder Sitzung: bindet das Profil ein und sagt, welcher Auftrag wofür da ist |
| `Rahmenwerk.md` | alle Bauregeln: Aufgabentypen, Redaktion, Zeichnen, Layout, Prüfung, `file://` |
| `Klausurvorbereitung.md` | Auftrag A — Modul mit Unterlagen, Prüfung steht an |
| `NeuesThema.md` | Auftrag B — freies Thema aus dem Prompt, keine Unterlagen |
| `.claude/skills/`, `.claude/commands/` | die Trigger, damit man den Auftrag nicht jedes Mal beim Namen nennen muss |

Der Fortschritt liegt im `localStorage` des Browsers, je Blatt getrennt, und überlebt das Neuladen. Der Knopf *Stand löschen* in der Seitenleiste beginnt von vorn.
