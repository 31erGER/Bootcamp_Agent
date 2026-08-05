# Willkommen

Dies ist ein Workflow für einen Agent, um ein Uni-Modul oder ein Unterrichtsfach klausurrelevant auszuarbeiten. Es entsteht ein Bootcamp, anhand dessen die Vorbereitung gemacht werden kann.

Der Ordner `Stylevorgabe/assets` ist dabei **kein Beispiel zum Abschauen, sondern ein lauffähiges Rahmenwerk**: Aufgaben-Engine mit neun Aufgabentypen, maschinell geprüfte Redaktionsregeln, Canvas-Zeichenbausteine, Fortschrittsspeicher und ein Prüfwerkzeug. Alles läuft per Doppelklick, ohne Server und ohne Build.

## Loslegen

### Schritt 1

Das Projekt in den Ordner des jeweiligen Moduls oder Unterrichtsfachs clonen.

### Schritt 2

In der [[PROJECTSCAN]] das jeweilige AI-Modell und die persönliche Vorstellung des Nutzers an die KI anpassen — die Abschnitte `Usersettings` und `Kontext`.

### Schritt 3

AI-Agent losschicken, sich die [[PROJECTSCAN]] anzusehen.

### Schritt 4

Wenn der Agent fertig ist, selbst gegenprüfen:

```
pwsh tools/bootcamp-check.ps1
```

Erwartet wird `ERGEBNIS: GRUEN` und Exitcode 0. Das heißt „nichts Kaputtes gefunden" — nicht „gut". Was ein Exitcode nicht prüfen kann, listet die Ausgabe am Ende auf; ausführlich steht es im Abschnitt *Prüfen, bevor „fertig" gesagt wird* der [[PROJECTSCAN]].

## Was wo liegt

| Datei | wofür |
|---|---|
| `Stylevorgabe/index.html` | die Übersichtsseite des Moduls — hier anfangen |
| `Stylevorgabe/*.html` + `*.data.js` | je ein Aufgabenblatt: Gerüst und Aufgaben getrennt |
| `Stylevorgabe/assets/` | Stylesheet, Engine, Schriften, Zeichenbausteine — **wird gebraucht, nicht gelöscht** |
| `Stylevorgabe/assets/selbsttest.html` | Regressionsblatt mit je einer Aufgabe pro Typ. Nach jeder Änderung am Rahmenwerk einmal durchlaufen lassen. |
| `tools/bootcamp-check.ps1` | prüft Selbstlauf, Redaktionsregeln, Breiten und CSS-Klassen |
| `PROJECTSCAN.md` | der Auftrag an den Agenten und alle Bauregeln |

Der Fortschritt liegt im `localStorage` des Browsers, je Blatt getrennt, und überlebt das Neuladen. Der Knopf *Stand löschen* in der Seitenleiste beginnt von vorn.
