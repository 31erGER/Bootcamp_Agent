---
name: klausurvorbereitung
description: Use when the user wants exam preparation for a university module whose materials (lecture slides, exercises, lab sheets, old exams) are in this directory — building a learning bootcamp with task sheets, a cheat sheet, a mindmap and a study plan. Auf Deutsch: Klausurvorbereitung, Prüfungsvorbereitung, Modul aufarbeiten, Lernzettel und Klausurzettel erstellen, Übungsaufgaben aus den Vorlesungsfolien bauen.
---

# Klausurvorbereitung

Die vollständige Anweisung steht in zwei Dateien im Wurzelverzeichnis dieses Repos. Lies sie jetzt, beide vollständig, und arbeite danach:

1. `Klausurvorbereitung.md` — der Auftrag: Umgebung, Rolle, was abgeliefert wird
2. `Rahmenwerk.md` — wie gebaut wird: Aufgabentypen, Redaktionsregeln, Zeichnen, Layout, Prüfung

`Nutzereinstellungen.md` gilt ohnehin über `CLAUDE.md`; lies sie, falls sie nicht schon in deinem Kontext steht.

`NeuesThema.md` ist der **andere** Auftrag und hier nicht zuständig — lies sie nicht, ihre Regeln zu Zuschnitt und Belegen gelten für ein Thema ohne Unterlagen.

Sieh dir zuerst `src/Anleitung.html` an: dort steht Zeile für Zeile, welche Seite welches Merkmal des Rahmenwerks vorführt. Das ersetzt das Durchsuchen der Engine.

**Jedes Modul ist ein Dreiklang** aus Fachartikel, Aufgabenheft und Lab — das Lab am Schluss, und es fehlt nie. Die Regel samt Begründung und dem Aufbau eines Labs steht in `Rahmenwerk.md` unter *Ein Modul ist ein Dreiklang*; zwei ausgearbeitete Beispiele liegen in `src/`.

Zu diesem Auftrag gehören **Abdeckungskarte, Probeklausur und Klausurzettel** — sie sind der Teil des Rahmenwerks, den nur eine Prüfung braucht, und ihre Erwartungen stehen in `tools/klausurphase.config.mjs`. Ohne Eintrag dort werden zwei Prüfungen still übersprungen.

Bevor du „fertig" sagst: `pwsh tools/bootcamp-check.ps1` muss ohne Fehler durchlaufen. Ein grüner Exitcode heißt „nichts Kaputtes gefunden", nicht „gut" — was er nicht prüft, steht in `Rahmenwerk.md`.
