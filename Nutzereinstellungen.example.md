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

### Empfehlung als Startpunkt

Ein Bootcamp zu bauen ist über weite Strecken agentisches Coding mit langen Werkzeugketten, dazwischen einige Stellen, an denen fachliches Urteil und Korrektheit den Ausschlag geben. Die Aufteilung folgt daraus:

| Phase | Modell | Effort | warum |
|---|---|---|---|
| Unterlagen auslesen, Inhalte inventarisieren | Sonnet 5 | `medium` | Volumenarbeit, viel Lesen, wenig Urteil |
| Landkarte und Gewichtung (Auftrag A) · Zuschnitt in Schritt 0 (Auftrag B) | Opus 5 | `xhigh` | teuerster Fehler des Laufs |
| Aufgaben redigieren, `.data.js` schreiben | Opus 5 | `xhigh` | genau der Fall, für den `xhigh` gedacht ist |
| **Zahlen gegenrechnen** (`calc`, `estimate`) | Opus 5 | `max` | hier zählt Korrektheit mehr als Kosten — `validate.js` kennt die Form, nicht die Physik |
| HTML-Gerüste, `index.data.js`, mechanische Seiten | Sonnet 5 | `medium` | Kopieren und Ersetzen |
| Zeichnungen (`viz.js`) | Opus 5 | `xhigh` | Geometrie und Reglerextreme, die fehleranfälligste Stelle im Rahmenwerk |
| Reparaturen nach dem Prüflauf | Opus 5 | `high` | Debuggen in kurzen Schleifen |

`xhigh` ist die Standardstufe für Coding- und Agentic-Arbeit; `high` ist die Voreinstellung, wenn nichts gesetzt ist. `low` und `medium` sind auf Opus 5 auffällig stark — für Routinearbeit lohnt es, herunterzugehen, statt reflexhaft oben zu bleiben.

**Haiku 4.5 fällt für diese Arbeit aus:** 200 K Kontext reichen für die Unterlagen eines Moduls nicht, und das Modell nimmt keinen Effort-Parameter an. Für einen engen mechanischen Teilschritt taugt es, für den Hauptlauf nicht.

**Fable 5 nur an einer Stelle:** Schritt 0 und die Quellenrecherche eines freien Themas (`NeuesThema.md`). Das ist offene Arbeit ohne vorgegebene Schritte — seine Stärke. Für den Rest ist es der falsche Griff: `Rahmenwerk.md` ist bewusst präskriptiv (nummerierte Bauregeln, Pflichtfelder, blockierende Fehler), und genau diese Prompt-Form senkt die Ausgabequalität von Fable 5, das Ziel und Randbedingungen einer Schrittliste vorzieht. Dazu laufen einzelne Anfragen minutenlang und der Preis liegt beim Doppelten von Opus 5. Als Orchestrator über dieses Regelwerk zahlt man mehr für schlechtere Passform.

Effort gilt in Claude Code für die ganze Sitzung, nicht je Schritt — wechseln geht über `/model` zwischen den Phasen. Delegation an Subagenten ist der andere Weg, aber lies vorher *Subagenten und Tokenausbeute* in `Rahmenwerk.md`: sie kostet Tokens und ist nur in einem Fall die günstigere Wahl.

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
