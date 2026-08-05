# Nutzereinstellungen (Vorlage)

**Diese Datei ist die Vorlage. Kopiere sie nach `Nutzereinstellungen.md` und füll sie aus.**

```
cp Nutzereinstellungen.example.md Nutzereinstellungen.md
```

`Nutzereinstellungen.md` steht in der `.gitignore` und wird **nie** eingecheckt — sie enthält persönliche Angaben, und dieses Repo wird geteilt. Diese Vorlage hier wird eingecheckt und enthält deshalb keine.

`CLAUDE.md` bindet `Nutzereinstellungen.md` ein, damit sie in jeder Sitzung gilt — auch außerhalb eines Bootcamp-Auftrags. Fehlt die Datei, arbeitet der Agent ohne Profil: er kennt weder die zugelassenen Modelle noch den gewünschten Antwortstil.

---

## Zugelassene Modelle

Welche Modelle für welche Rolle benutzt werden dürfen. Namen so schreiben, wie der eigene Client sie anzeigt.

```json
{
	"Zugelassene Modelle": {
		"Orchestrierung": ["<Modell für Planung und Koordination>"],
		"Coding": ["<Modell für das Schreiben der Seiten>"],
		"Sonstige": ["<günstigere Modelle für Nebenaufgaben>"]
	}
}
```

## Kontext (über mich und meine Präferenzen)

Wer bist du, und wie soll der Agent mit dir reden? Je konkreter, desto weniger musst du später korrigieren. Beantworte mindestens:

- **Ausbildung und Vorwissen** — Studiengang, Beruf, Abschlüsse. Daran hängt, auf welchem Niveau erklärt wird und woran neue Themen angeknüpft werden.
- **Rechenwege** — sollen sie vollständig und kleinschrittig sein, oder störend ausführlich?
- **Umgang mit Wissenslücken** — soll der Agent nachfassen und den Sachverhalt richtigstellen, wenn du etwas falsch verstanden zu haben scheinst?
- **Tonfall** — direkt und kritisch, oder zurückhaltend? Soll er widersprechen, wenn du etwas Falsches behauptest?
- **Antwortaufbau** — erst die Kurzantwort, dann die Tiefe? Wie tief?
- **Rückfragen** — soll er nachfragen, bevor er antwortet, oder lieber Annahmen treffen und loslegen?

## Lernvoraussetzungen

Was der Agent über deine Art zu lernen wissen muss, damit die Materialien passen: Aufmerksamkeitsspanne, wie lang eine Einheit sein darf, was dich abbrechen lässt, was dich dranhält, Hilfsmittel, Barrierefreiheit.

Diese Angaben steuern den Aufbau jeder Seite — Einheitenlänge, Reihenfolge von Erfolg und Theorie, Menge an Text pro Bildschirm. `Rahmenwerk.md` und die beiden Auftragsdateien setzen sie um, nennen aber selbst keine persönlichen Angaben; sie verweisen nur hierher. **Nichts aus diesem Abschnitt gehört in eine Datei, die eingecheckt wird.**
