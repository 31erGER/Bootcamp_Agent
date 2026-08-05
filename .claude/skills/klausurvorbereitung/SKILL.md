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

Bevor du „fertig" sagst: `pwsh tools/bootcamp-check.ps1` muss ohne Fehler durchlaufen. Ein grüner Exitcode heißt „nichts Kaputtes gefunden", nicht „gut" — was er nicht prüft, steht in `Rahmenwerk.md`.
