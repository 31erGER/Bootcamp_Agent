# Übergabe — Stand 12.11.2026

**Für den Agenten der nächsten Sitzung.** Der Rechner, auf dem bis hierher gearbeitet wurde, wird zurückgesetzt; die Sitzung, ihr Notizspeicher und alle lokalen Klone sind danach weg. Übrig bleiben die drei Branches auf GitHub und diese Datei. Lies sie ganz, bevor du etwas anfasst.

Sie ist ein Übergabezettel und **kein Teil des Rahmenwerks**. Lösche sie (und `docs/`, falls dann leer), sobald die offenen Entscheidungen unten getroffen sind. Solange sie liegt, wird sie mit jedem Klon der Vorlage mitkopiert.

Sie enthält bewusst keine Angaben über den Nutzer. Die stehen in `Nutzereinstellungen.md`, und die ist nicht im Repo.

---

## 1 · Wo wir stehen

| Branch | Inhalt | Zustand |
|---|---|---|
| `main` | Rückführung aus dem Java-Bootcamp, erweiterter Lint, diese Datei | geprüft, gepusht |
| `redesign/uebersicht` | Redesign der Hauptseite; enthält `main` vollständig | geprüft, gepusht, **noch nicht übernommen** — der Nutzer wollte ihn erst ansehen |
| `kurs/java` | das Java-Bootcamp, ein Commit auf `0f9ae06` | Sicherung des Arbeitsstands, gepusht. **Kein Teil der Vorlage** und nie nach `main` zu mergen |

**Auf `main` neu seit `0f9ae06` („add check"):**

- `tools/bootcamp-check.ps1`: `Get-Dom` gibt Edge und Chrome `--headless` und ein eigenes Profil mit. Ohne Playwright meldete vorher jede Seite „kein Befund".
- `tools/redaktion-lint.mjs` (neu): `validate.js` ohne Browser, zeigt auch die Hinweise, meldet rohe `<` in HTML-Feldern. Sucht Blätter auch eine Ebene tiefer und unterscheidet Groß- und Kleinschreibung (`<P>` und `List<Figure>` sind Befunde, `<p>` und `<figure>` nicht).
- `tools/codebild.mjs` (neu): Codezeilen als SVG mit anklickbaren Zeilennummern für `hotspot`-Aufgaben.
- `Rahmenwerk.md`: Abschnitt *Programmierthemen* (sieben Punkte).
- `src/assets/styles.css`: Regel für Inline-`code` in `.chapter` und `.theorie`.
- `neues-thema/SKILL.md` (zwei Kopien): Verweis auf *Programmierthemen* und den Lint.

**`redesign/uebersicht` ändert** `src/assets/hub.js`, `src/assets/styles.css`, `startseite.html`, `tools/hub-progress-check.mjs`, `src/Anleitung.html`, `Rahmenwerk.md`. Was und warum steht in `Rahmenwerk.md`, Abschnitt *Die Übersicht als Weg*, und im Kopf von `hub.js`. Kurz:

- Der nächste Schritt steht links und groß, der Stand rechts und klein. Die Weiter-Karte nennt die Stelle (Gruppe, Teil k von n, Seitentyp).
- Jede Gruppe ist ein `<details>`. Offen steht nur die mit dem nächsten Schritt; alle anderen sind eine Zeile an einer Weglinie.
- In der offenen Gruppe stehen Zeilen statt Kacheln; genau eine trägt „Als nächstes" oder „Weitermachen".
- Knopf „Alles aufklappen" über `[data-hub-toggle]`.
- `WB.hub({ groups, entries })` ist unverändert. Ohne `group` bleibt die Kachelwand.

Gemessen am Showcase bei 1240 px Breite: vorher über 2700 px hoch; nachher 1285 px, wenn alles zu ist, und 3254 px, wenn alles offen ist. **Aufgeklappt ist die neue Seite also länger.** Der Gewinn kommt aus dem Zuklappen.

## 2 · Was nicht auf `main` liegt und was gar nicht im Repo ist

- **`Nutzereinstellungen.md`** ist per `.gitignore` ausgeschlossen. `CLAUDE.md` verlangt, sie zuerst zu lesen. Fehlt sie nach dem Aufsetzen, frag den Nutzer danach; die Vorlage ist `Nutzereinstellungen.example.md`. Rate ihren Inhalt nicht.
- **Das Java-Bootcamp liegt auf dem Branch `kurs/java`, nicht auf `main`.** Es wurde am 12.11.2026 in einem zweiten Klon desselben Repos gebaut und kurz vor dem Zurücksetzen als ein einziger Commit gesichert, so wie die Arbeitskopie war: acht Module (Arrays, Typparameter, Varianz, Lambdas, Predicates, Pipeline, Collectors, Grenzen), zwei Wiederholungsblätter, Start- und Abschluss-Lab, dazu `java-labs/`, `docs/`, `Lernzettel.md`, `Referenzkarte.md`, `Themenlandkarte.canvas`. Dort sind die Showcase-Seiten gelöscht und der Kursschlüssel geändert.
  Der Branch setzt auf `0f9ae06` auf, nicht auf dem heutigen `main`. Er enthält deshalb die Rahmenwerk-Eingriffe in ihrer ersten Fassung, und zwei Dateien sind dort älter als auf `main` (`Rahmenwerk.md`, ein Satz in *Programmierthemen* Punkt 3; `tools/redaktion-lint.mjs` ohne die Erweiterung). Vor dem Weiterbauen am Kurs `main` hereinholen; genau diese beiden Dateien melden dann einen Konflikt, nimm jeweils die Fassung von `main`. `docs/Uebergabe.md` kommt dabei mit und gehört im Kurs gelöscht.
  **Das Repo ist öffentlich, der Kurs auf `kurs/java` also auch.** Der Nutzer hat dem Push zugestimmt.
- **`AGENT_Zwischenablage.md`** aus dem Java-Klon ist per `.gitignore` ausgeschlossen und mit dem Rechner weg, falls der Nutzer sie nicht gesichert hat. Was davon ins Rahmenwerk gehörte, ist auf `main`; ein Kandidat ist übrig: `docs/bau/bau.mjs` auf `kurs/java`, ein Seitengenerator (Kurztext rein, Lehrkurs-, Lab- und Heftseite raus), noch kursspezifisch.

## 3 · Als Erstes nach dem Aufsetzen

1. Klonen, `Nutzereinstellungen.md` wiederherstellen (siehe oben).
2. **Die Umgebung neu feststellen.** Alles, was die alte Sitzung über den Rechner wusste, gilt nicht mehr: gibt es `pwsh` oder nur `powershell`? Welcher Browser, gibt es einen Playwright-Cache? Ist `node` im PATH?
3. Prüflauf auf `main`, dann auf `redesign/uebersicht`. Beide endeten zuletzt mit `ERGEBNIS: GRUEN` und Exitcode 0. Ist einer rot, ist das eine Eigenheit des neuen Rechners und kein alter Fehler; kläre es, bevor du weiterbaust.
4. Dem Nutzer die Entscheidungen aus Abschnitt 4 vorlegen. Nichts davon selbst entscheiden.

```
node tools/redaktion-lint.mjs                 Sekunden, kein Browser. Erwartet: GRÜN, 4 Blätter
node tools/hub-progress-check.mjs             Sekunden. Erwartet: GRÜN
pwsh tools/bootcamp-check.ps1                 mehrere Minuten, im Hintergrund starten
powershell -NoProfile -ExecutionPolicy Bypass -File tools\bootcamp-check.ps1     dasselbe ohne pwsh
```

Den Prüflauf ohne Parameter starten: `-Sheets a,b` kommt unter `powershell -File` als ein einziger Name an (siehe Abschnitt 6).

## 4 · Offene Entscheidungen, alle beim Nutzer

1. **Redesign übernehmen?** `redesign/uebersicht` enthält `main` vollständig, ein Fast-Forward genügt. Nicht geprüft und vorher anzusehen: Druckansicht, Bedienung per Touch und nur mit Tastatur, ein Kurs mit mehr als vier Gruppen. Die Handyansicht wurde nur ausschnittweise gesehen; die Breitenprüfung (320 bis 1340 px, alle Gruppen offen) ist ohne Befund.
2. **Groß-/Kleinschreibung im Lint behalten?** Gefragt war nur die Erweiterung der Tag-Liste um `h3` und `aside`. Die Unterscheidung kam dazu, weil die längere Liste sonst `List<Figure>` durchgelassen hätte. Der Nutzer hat sie noch nicht bestätigt.
3. **Wo bleibt das Java-Bootcamp auf Dauer?** Es liegt als Sicherung auf `kurs/java` im Vorlagen-Repo, und das ist öffentlich. Bleibt es dort, zieht es in ein eigenes Repo, oder wird der Branch gelöscht, sobald der Kurs woanders liegt? Auf `main` gehört nichts davon: die Vorlage bleibt kursfrei.
4. **Welche der Vorschläge aus Abschnitt 5** gebaut werden und in welcher Reihenfolge.

## 5 · Vorschläge, noch nicht begonnen

Empfohlene Reihenfolge: erst die kleinen Werkzeugpunkte W1, W3, W4 und H1; dann A1 und A2; zuletzt A3 und H4.

**Aufgabentypen**

- **A1 · Fehlerheft.** Ein Wiederholungsblatt, das sich aus den falsch oder erst im Zweitversuch gelösten Aufgaben aller Blätter zusammensetzt. Der Speicher kennt `tries` und `state` je Aufgabe schon (`wb:<Kurs>/<Datei>:progress`). Der größte Lerngewinn auf der Liste. Offen ist, wie es sich mit „genau ein nächster Schritt" verträgt: als eigene Zeile am Ende einer erledigten Gruppe, nicht als zweite Empfehlung.
- **A2 · `order` mit Distraktoren.** Zeilen, die nicht dazugehören. Bei Code ist das die Parsons-Aufgabe. Klein: ein optionales Feld, eine Zeile in der Bewertung, eine Regel in `validate.js`.
- **A3 · `trace`.** Variablenbelegung Zeile für Zeile eintragen. Für Programmierthemen fehlt alles zwischen „Zeile antippen" (`hotspot` + `codebild.mjs`) und „Ergebnis eintippen" (`result`). Lässt sich auf die Feldbewertung von `result` setzen.
- **A4 · `hotspot` mit mehreren Zonen.** Ein Bild vollständig beschriften statt eine Stelle treffen.
- **A5 · Sicherheitsabfrage.** Ein Schalter an jeder Aufgabe („sicher / geraten"), vor dem Prüfen. Macht „sicher und falsch" sichtbar und füttert A1.

**Hauptseite**

- **H1 · Stand sichern und laden.** `WB.store.exportJSON()` und `importJSON()` gibt es in `engine.js`, aber keinen Knopf. Auf `file://` ist das der einzige Schutz gegen Browserwechsel oder gelöschte Websitedaten.
- **H2 · Ränge einstellbar.** „Prüfungsreif" und „Klausurfit" stehen auch in einem Themen-Bootcamp ohne Prüfung, und die Weiter-Karte sagt „Modul abgeschlossen", wenn der ganze Kurs durch ist. Ein optionales `ranks` in `WB.hub` und ein anderes Wort.
- **H3 · Auf-/Zu-Zustand merken.** Eine von Hand geöffnete Gruppe geht beim Neuladen wieder zu.
- **H4 · Suchfeld** über Titel und Beschreibungen, sobald ein Kurs mehr als etwa 20 Einträge hat.

**Werkzeuge**

- **W1 · `-Sheets a,b`** in `bootcamp-check.ps1` an Kommas trennen, so wie `-Pages` es schon tut.
- **W2 · Breitenprüfung öffnet alle `<details>`.** `audit.js` misst nur Sichtbares. Für die Übersicht ist das auf dem Redesign-Branch gelöst (`hub.js` öffnet bei `#audit` alles), für die Kontrollfragen `.reveal` in den Lehrkursen nicht. Vorsicht: das prüft dann mehr als bisher und kann alte Seiten rot machen. Das wäre ein echter Befund, kein Fehler des Werkzeugs.
- **W3 · Farbliterale.** In `styles.css` steht noch `#fff` (`::selection`, Druck). Ein Token `--on-accent` in `colorpalett.css` und eine Prüfung im Prüflauf würden die Regel „Farben nur aus `colorpalett.css`" durchsetzen. `.resume__btn` ist auf dem Redesign-Branch schon umgestellt.
- **W4 · `pwsh` in Skills und Kopfkommentaren.** Ein kleiner Starter, der `pwsh` oder `powershell` nimmt, erspart den Fehlstart auf einem Rechner mit nur Windows PowerShell 5.1.
- **W5 · Zwei Kopien von `neues-thema/SKILL.md`** (`.claude/` und `.agents/`) weichen in Zeile 13 voneinander ab. Eine aus der anderen erzeugen oder im Prüflauf vergleichen.

## 6 · Bekannte Lücken, nicht behoben

- `-Sheets a,b` unter `powershell -File` (W1).
- Der Kopfkommentar von `tools/codebild.mjs` nennt `docs/codebilder.json` als Aufruf. Die Datei gibt es in der Vorlage nicht; `Rahmenwerk.md` sagt es richtig (Eingabedatei selbst anlegen, Format im Kopf des Werkzeugs).
- `redaktion-lint.mjs` meldet auch ein alleinstehendes `<` mit Leerzeichen dahinter (`a < b`), obwohl der Browser das richtig setzt. Bisher kein Fall im Showcase; bei einem Mathe-Thema wird es einer.
- Druck: zugeklappte Gruppen der Übersicht bleiben im Ausdruck zu. Ob die Druckregel für `.reveal` in aktuellen Chromium-Versionen noch greift, ist nicht nachgeprüft.
- Die Lücke im Klausurmodus (vorzeitige Abgabe, dann Neuladen) steht schon in `Rahmenwerk.md`.

## 7 · Was beim Arbeiten geholfen hat

**Die Hauptseite ansehen.** Der eingebaute Browser der App zeigt `file://`-Seiten ohne Skripte, die Übersicht ist dann leer. Abhilfe: ein statischer Server auf `127.0.0.1`, danach wieder stoppen. Über `http://` teilen sich alle Seiten einen Speicher, der Lernstand lässt sich also von Hand setzen.

```js
// vorschau.mjs — node vorschau.mjs <wurzel> <port>. Nicht einchecken.
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const root = path.resolve(process.argv[2]), port = Number(process.argv[3] || 4173);
const T = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml' };
http.createServer((q, s) => {
  let p = decodeURIComponent(new URL(q.url, 'http://x').pathname);
  if (p === '/') p = '/startseite.html';
  const f = path.join(root, p);
  if (!f.startsWith(root)) { s.writeHead(403); s.end(); return; }
  fs.readFile(f, (e, d) => {
    if (e) { s.writeHead(404); s.end(); return; }
    s.writeHead(200, { 'Content-Type': T[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    s.end(d);
  });
}).listen(port, '127.0.0.1');
```

```js
// Lernstand setzen, in der Konsole der Startseite. Kurs = <meta name="wb-course">.
const K = 'wb:Beispielkurs/';
const st = (n, done) => Object.fromEntries(Array.from({ length: n }, (_, i) =>
  [String(i + 1), { state: i < done ? 'done' : 'offen', tries: 1, points: 20, stepsDone: 0 }]));
localStorage.setItem(K + 'Anleitung.html:read', JSON.stringify({ percent: 100, done: true }));
localStorage.setItem(K + 'Modul_02_Verbundnetze.html:progress', JSON.stringify(
  { score: 70, maxScore: 225, total: 11, stars: 1, badges: {}, state: st(11, 4) }));
```

Drei Zustände ansehen, nicht einen: leer (erster Besuch), mittendrin, alles erledigt.

**Breitenprüfung einer einzelnen Seite**, ohne den ganzen Prüflauf: über denselben Server `src/assets/breiten.html?page=../../startseite.html` öffnen und den Text der Seite lesen. Elf Breiten in wenigen Sekunden.

**Vier Verträge, an denen der Hub-Test hängt.** `tools/hub-progress-check.mjs` rendert `hub.js` in einem Mini-DOM, das nur `createElement`, `appendChild`, `className`, `textContent`, `innerHTML`, `style` und `hidden` kennt — kein `setAttribute`, kein `classList`, kein `addEventListener`. Und er sucht über Klassennamen: `xpbar`, `sheetcard__bar`, `hubgroup__bar`, `userpanel__xp`. Wer eine davon umbenennt, ändert den Test mit.

**Die Klassenprüfung liest `make('tag', 'klasse')`** in den Skripten unter `assets/`. Jede so erzeugte Klasse braucht eine Regel in `styles.css`. Zusammengesetzte Namen (`'hubrow' + …`) sieht sie nicht; gib ihnen trotzdem eine Regel.

**Commit-Nachrichten mit Umlauten und Backticks** in eine Datei schreiben und mit `git commit -F` übergeben. Heredocs sind im Bash-Werkzeug daran gescheitert.

**Zahlen, die in einen Kommentar oder eine Regel wandern, vorher messen.** In dieser Sitzung stand kurz „bei acht Modulen gut 7000 px" im Code. Das war hochgerechnet, für die Desktopbreite falsch, und ist wieder draußen.
