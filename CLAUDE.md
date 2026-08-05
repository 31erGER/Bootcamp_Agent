# Bootcamp-Agent

Dieses Verzeichnis ist ein Werkzeug, mit dem ein Agent aus einem Stoffgebiet ein lauffähiges Lern-Bootcamp baut: HTML-Seiten mit Aufgaben, Punkten, Fortschritt und Zeichnungen, alles per Doppelklick, ohne Server und ohne Build.

**Lies zuerst `Nutzereinstellungen.md`.** Sie gilt immer, auch wenn gerade kein Bootcamp gebaut wird.

## Welche Datei wofür

| Datei | wann |
|---|---|
| `Nutzereinstellungen.md` | immer — wer ich bin, wie ich angesprochen werden will, welche Modelle zugelassen sind |
| `Rahmenwerk.md` | immer, sobald du am Bootcamp baust — Bauregeln, Aufgabentypen, Redaktion, Layout, Prüfung |
| `Klausurvorbereitung.md` | Auftrag A: In diesem Verzeichnis liegen Modulunterlagen, und ich werde darin geprüft |
| `NeuesThema.md` | Auftrag B: Ich nenne ein Thema, zu dem es keine Unterlagen gibt, und will es von null lernen |

Die beiden Aufträge schließen sich aus. Ein Auftrag plus `Rahmenwerk.md` ist die vollständige Anweisung — du musst die andere Auftragsdatei nicht lesen.

Ist unklar, welcher Auftrag gemeint ist, frag nach. Liegen Vorlesungsfolien und Übungen im Ordner, ist es fast immer A; nenne ich ein Thema im Prompt, ist es B.

## Was immer gilt

- **Bearbeitungen an Dateien, die du nicht selbst angelegt hast, kündigst du an und kennzeichnest sie im File.** Das gilt für alles in diesem Vault, `Nutzereinstellungen.md` und die Auftragsdateien eingeschlossen.
- **`Stylevorgabe/assets/` und `tools/` werden nie gelöscht.** Jede gebaute Seite lädt daraus Stylesheet, Engine und Schriften und wäre danach eine leere Seite.
- **Keine externen Server- oder Hostingkosten.** Das Setup bleibt lokal, pflegeleicht und per Doppelklick bedienbar.
- **Farben nur aus `Stylevorgabe/assets/colorpalett.css`.** Kein Farbwert in einer HTML, einem Blatt oder einer Zeichenfunktion.
