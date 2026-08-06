---
name: portieren
description: Use when learning material already exists for a topic — Markdown notes, hand-written HTML sheets, an earlier bootcamp — and it should be moved onto this framework. Covers cloning, flattening the folder, what to delete and what the self-test still needs, the order of work inside a module, and why the volume of the source is not an upper bound. Auf Deutsch: bestehendes Bootcamp portieren, Markdown-Lernmaterial auf das Rahmenwerk umstellen, altes Modul übernehmen, Kurs migrieren.
---

# Portieren

Der dritte Auftrag, neben Klausurvorbereitung und Neues Thema. Er gilt, wenn Material **schon existiert** und auf das Rahmenwerk soll.

Lies jetzt beide Dateien im Wurzelverzeichnis vollständig:

1. `Portieren.md` — der Auftrag: Reihenfolge, was gelöscht wird, Umfang, Labs
2. `Rahmenwerk.md` — wie gebaut wird: Aufgabentypen, Redaktion, Navigation, Fallstricke, Prüfung

`Nutzereinstellungen.md` gilt über `CLAUDE.md`; lies sie, falls sie nicht schon in deinem Kontext steht.

Die beiden anderen Auftragsdateien sind hier **nicht** zuständig. Sie werden erst gebraucht, wenn nach dem Portieren etwas fehlt und ergänzt werden soll.

**Drei Dinge, an denen dieser Auftrag scheitert, wenn man sie überspringt:**

- **Ein Modul, dann abnehmen lassen.** Nicht acht auf einmal — Aufbau und Umfang entscheiden sich am ersten, und beim ersten liegt man daneben.
- **Ausgangsbefund vor der ersten eigenen Zeile.** `pwsh tools/bootcamp-check.ps1` muss auf dem frischen Klon grün sein. Danach gehört jeder rote Befund dir.
- **Die Länge der Vorlage ist keine Obergrenze.** HTML trägt mehr als Markdown. Wer beim Portieren kürzt, verliert Inhalt statt Wiederholung — siehe `Rahmenwerk.md`, *Dichte · Der Gegenfehler*.

Bevor du „fertig" sagst: `pwsh tools/bootcamp-check.ps1` ohne Fehler, und die Punkte, die ein Exitcode nicht prüfen kann, selbst ansehen.
