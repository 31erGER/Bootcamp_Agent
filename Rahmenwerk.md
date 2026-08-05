# Rahmenwerk

**Diese Datei gilt für jeden Auftrag.** Sie beschreibt, *wie* gebaut wird — nicht *was*. Das Was steht in `Klausurvorbereitung.md` oder in `NeuesThema.md`; genau eine der beiden ist zusätzlich zu lesen, nie beide.

Jede Regel hier kommt aus einem Fehler, der einmal gemacht wurde. Deshalb steht bei den meisten der Grund dabei — eine Regel ohne Grund wird von der nächsten Sitzung wegoptimiert.

---

# Was schon da ist

Der Ordner `Stylevorgabe` ist **kein Beispiel zum Abschauen, sondern ein lauffähiges Rahmenwerk**:

```
Stylevorgabe/
  assets/                        ← das Rahmenwerk. Wird KOPIERT, nicht gelöscht.
    colorpalett.css              nur die Design-Tokens, eine Datei, ein Ort
    fonts.css                    die sechs Schriften als base64, EINMAL
    styles.css                   importiert die beiden und trägt alles Übrige
    engine.js                    Datenmodell, Bewertung, Fortschritt, neun Renderer
    validate.js                  die Redaktionsregeln als ausführbarer Code
    viz.js                       Canvas-Rahmen und Zeichenbausteine
    hub.js                       die Übersichtsseite
    lehrkurs.js                  Karteikarten, Kapitelmarkierung, Lesefortschritt
    audit.js                     Selbstprüfung eines Blattes
    breiten.html                 Breitenprüfung über echte iframe-Viewports
    selbsttest.html/.data.js     Regressionsblatt: je eine Aufgabe pro Typ
    img/                         SVG-Schemata für Bildaufgaben
  index.html + index.data.js     die Übersicht des Moduls
  Modul_03_Verbundnetze.html     Beispielblatt: 18 Aufgaben, alle neun Typen
  Modul_03_Verbundnetze.data.js  dessen Aufgaben als Daten
  Fourier_Lehrkurs.html          Beispiel-Fachartikel
tools/
  bootcamp-check.ps1             prüft alles, bevor du „fertig" sagst
```

Die beiden Beispielblätter sind inhaltlich fachfremd (Elektrotechnik, Mathe 2) und dienen nur als Vorlage — für den Aufbau, das Aussehen und die Art der Visualisierung. Baue kurze Theorieblöcke ein, wenn du Sachverhalte nochmal erklären willst, und visualisiere sie entsprechend.

**Was gelöscht wird und was nicht.** Aufräumen heißt: `Canvas_Beispiel.canvas` und die beiden fachfremden Beispielblätter (`Modul_03_Verbundnetze.*`, `Fourier_Lehrkurs.html`) dürfen weg, sobald du eigene Blätter hast. `assets/` bleibt — **jedes** Blatt lädt daraus Stylesheet, Engine und Schriften und wäre danach eine leere Seite. `index.html`, `index.data.js`, `tools/bootcamp-check.ps1` und `assets/selbsttest.*` bleiben ebenfalls: die Übersicht ist der Einstieg, das Prüfwerkzeug brauchst du bei jeder Änderung, und der Selbsttest ist die Regressionsprüfung des Rahmenwerks. Nichts davon ist Demo-Material.

## Notizblock und Canvas

Erstelle eine `AGENT_Zwischenablage.md`, die dir als eigener **Notizblock** dient. Hier kannst du dir Dinge aufschreiben, mit mir **kommunizieren**, Dinge für mich notieren oder mir Fragen stellen, die ich zwischendurch abzuarbeiten habe. Was eine spätere Sitzung mit neuem Kontext wissen muss, steht hier — sonst fängt sie von vorn an.

**Sie steht in der `.gitignore` und wird nie eingecheckt.** Sie gilt nur für dieses Arbeitsverzeichnis und ist der Ort, an dem Notizen über mich landen; in einem geteilten Repo hat sie nichts zu suchen. Was über das *Verfahren* gelernt wurde und für alle Aufträge gilt, gehört deshalb nicht hierher, sondern in diese Datei oder in einen Skill — siehe *Persistenz*.

`Canvas_Beispiel.canvas` zeigt die Syntax einer Obsidian-Canvas. Nutze sie für Flussdiagramme, Mindmaps und andere visuelle Darstellungen von Daten, wann immer du kannst, um Inhalte zu veranschaulichen, zu strukturieren oder zu organisieren. Canvas-Dateien liegen im Arbeitsverzeichnis, nicht in `Stylevorgabe`.

Keine externen Server- oder Hostingkosten. Das Setup muss lokal, pflegeleicht und einfach zu bedienen bleiben.

---

# Ein Auslieferungsformat: das HTML-Projekt

**Jede Aufgabe und jede Erklärstrecke ist eine Seite im HTML-Projekt.** Keine Aufgabensammlung als Fließtext, kein Kapitel als Textdatei. Eine Markdown-Datei ist trocken: kein Fortschritt, keine Rückmeldung, keine Zeichnung, kein Punktestand, kein Grund weiterzulesen. Genau das brauche ich aber, um dranzubleiben. Das HTML-Projekt liefert es, Markdown nicht — deshalb ist die Wahl schon getroffen und keine Abwägung je Datei.

Praktisch heißt das:

- Jede Übungs-, Lehr- und Laboreinheit ist eine **HTML-Seite neben `index.html`** und lädt Aussehen und Logik aus `assets/`.
- Jede Seite steht in `index.data.js`. Was dort nicht eingetragen ist, existiert für mich nicht — die Übersicht ist der einzige Einstieg.
- Aufgaben sind **Daten** in einer `.data.js` (siehe *Aufgaben sind Daten*), nicht handgeschriebenes Markup.
- Ist ein Inhalt reiner Erklärtext, ist er ein **Fachartikel** mit Kapiteln, Merkkästen, Karteikarten und Kontrollfragen — nicht eine Textdatei. „Dafür ist eine HTML zu viel Aufwand" ist kein Grund, sondern der Reflex, den diese Regel abschafft.
- Das Ergebnis ist **ein** zusammenhängendes Projekt, das von der Übersicht aus komplett durchklickbar ist. Ich soll nie in einem Ordner nach der nächsten Datei suchen müssen — bis auf die Zettel unten, und die verlinkt die Übersicht ebenfalls.

**Was Markdown bleibt** — diese Liste ist vollständig, alles andere ist HTML:

- **Die Zettel zum Nachschlagen** — `Klausurzettel.md`, `Lernzettel.md`, `Referenzkarte.md`, je nachdem, was der Auftrag verlangt. Sie liegen im Vault und tragen `[[Wikilinks]]` in meine Notizen und Unterlagen. Diese Verlinkung wiegt hier mehr als Interaktivität: eine HTML-Seite hängt im Obsidian-Graph nicht drin, taucht in keiner Backlink-Liste auf und wird von der Suche im Vault nicht gefunden. Zettel sind Nachschlagewerke, keine Lernstrecke — und sie dürfen ihrerseits auf die Seiten des HTML-Projekts verlinken.
- **`README.md` im Wurzelverzeichnis.** Sie ist die Startseite des GitHub-Repos (`origin`) und beschreibt das Rahmenwerk. Kein Lernmaterial, keine Ablage für Ergebnisse — nicht anfassen.
- **`CLAUDE.md`, `Nutzereinstellungen.md`, `Rahmenwerk.md` und die beiden Auftragsdateien.** Das ist die Anweisung an dich, kein Lernmaterial.
- **`AGENT_Zwischenablage.md`** — dein Notizblock und unser Kanal.
- **`SKILL.md` und Skripte** — dein Werkzeug. Ich lese sie nicht zum Lernen.
- **Formate, die kein HTML sein können:** die `.ics` eines Zeitplans, `.canvas`-Dateien für Mindmaps, Programmcode mit Lücken.

---

# Dichte

**Kürzen heißt Redundanz entfernen, nicht Inhalt.** Das ist der ganze Punkt: ich will nichts weglassen, ich will dasselbe Wissen auf weniger Zeilen. Ein Text, der nach dem Kürzen eine Frage nicht mehr beantwortet, wurde falsch gekürzt.

Die Prüffrage für jeden Absatz: **streiche ihn — fehlt danach eine Information?** Wenn nein, war er Wiederholung und gehört weg. Wenn ja, bleibt er, egal wie lang er ist.

Konkret, weil das sonst Geschmackssache bleibt:

- **Keine Ankündigungen und keine Rückblicke.** „Im Folgenden wird erklärt …", „Wie oben gezeigt …", „Zusammenfassend lässt sich sagen …" — das sind Wegweiser in einem Text, der Überschriften hat.
- **Keine Zusammenfassung eines Abschnitts innerhalb desselben Abschnitts.** Wer bis dahin gelesen hat, braucht sie nicht; wer nicht gelesen hat, liest sie auch nicht.
- **Ein Sachverhalt steht an einer Stelle.** Zwei Absätze, die dasselbe unterschiedlich sagen, werden einer.
- **Tabelle für Aufzählbares, Fließtext für Begründungen.** Eine Begründung in Stichpunkten verliert das „weil"; eine Aufzählung in Fließtext verliert die Übersicht.
- **Kein Füllwerk um eine Zahl herum.** „Es ist wichtig zu beachten, dass der Wert typischerweise bei etwa 50 Hz liegt" ist „50 Hz".

**Maßstab, weil es dort schiefgegangen ist:** die Markdown-Dateien im Homelab-Projekt sind zu ausführlich geworden. Der Fehler dort ist nicht die Länge, sondern die Wiederholung — dieselbe Aussage in Einleitung, Abschnitt und Zusammenfassung. Genau das ist gemeint.

Das gilt für **alles**, was du schreibst: Zettel, Anleitungsseite, Zwischenablage, Fließtext in Fachartikeln, Rückmeldungen und Vertiefungen in Aufgaben. Die Vertiefung einer Aufgabe ist der beste Test: drei dichte Sätze schlagen zwei Absätze, weil ich sie nach einer falschen Antwort tatsächlich lese.

---

# Subagenten und Tokenausbeute

**Möglichst viel Arbeit pro Token hat Vorrang vor Geschwindigkeit.** Wanduhrzeit ist mir egal — ein Lauf, der eine Stunde länger dauert und dafür ein Drittel der Tokens braucht, ist der bessere Lauf.

Daraus folgt die Regel für Subagenten, und sie fällt gegen sie aus: **Delegation kostet Tokens.** Jeder Subagent baut Kontext neu auf, exploriert Dinge neu, die du schon weißt, schreibt einen Bericht, und du liest diesen Bericht. Das ist Aufwand, der Wanduhrzeit spart und Tokens verbrennt — also genau der Tausch, den ich nicht will. **Steht Delegation der Tokenausbeute im Weg, lass sie weg. Ich brauche sie nicht.**

Es gibt einen Fall, in dem Delegation die Tokenrechnung **verbessert**, und der ist der einzige gute Grund: **wenn großes Rohmaterial gelesen werden muss, von dem nur das Ergebnis gebraucht wird.** Zweihundert Folien durchsehen und eine Themenliste mit Häufigkeiten zurückgeben — dabei bleiben die Folien im Kontext des Subagenten und kommen nie in den Hauptkontext. Das spart mehr, als die Delegation kostet.

Nicht delegieren:

- **Verifikation, Review, Gegenprüfung.** Das gehört in deine eigene Schleife. Ein Prüf-Subagent liest alles ein zweites Mal und verdoppelt damit die Kosten des Prüfens.
- **Arbeit, die du in wenigen Werkzeugaufrufen selbst erledigst.** Ein paar Dateien lesen, eine Handvoll Änderungen, eine einfache Suche.
- **Eine kleine Aufgabe, aufgeteilt auf mehrere Agenten.** Parallelität ist hier nur Geschwindigkeit, und Geschwindigkeit ist nicht das Ziel.

Wenn du delegierst: **einmal präzise briefen** statt starten, warten und nachbriefen. Und wenn ein Subagent geliefert hat, **rechne sein Ergebnis nicht nach** — das war der Sinn der Delegation. Halte die Zahl niedrig; im Zweifel machst du es selbst.

---

# Aufgaben sind Daten

**Eine Aufgabe ist ein Objekt, kein handgeschriebenes Markup.** Das ist die wichtigste Regel dieser Datei, und sie hat drei Gründe:

1. Die Redaktionsregeln weiter unten werden dadurch **maschinell prüfbar**. Antwortlängen, Anteil schwerer Aufgaben, Fettdruck in Optionen, überlappende Trefferzonen — `validate.js` prüft das am Objekt. An handgeschriebenem Markup wäre jede Regel nur eine Bitte.
2. Die Bewertung ist eine **reine Funktion ohne DOM** und damit nachrechenbar.
3. **Kein Copy-Paste-Drift.** Früher waren es 50 Zeilen Markup je Aufgabe. Bei 18 Aufgaben über mehrere Blätter läuft das garantiert auseinander.

Ein Blatt besteht aus zwei Dateien:

- `Blattname.html` — nur das Gerüst. Kopiere `Modul_03_Verbundnetze.html`, tausche Titel und die eine `.data.js`-Zeile. Sonst nichts.
- `Blattname.data.js` — ruft `WB.register({ … })` mit allen Aufgaben.

```js
WB.register({
  id: 'M03', kind: 'Aufgabenheft', level: 'Modulname',
  kicker: 'Modul 03a · Verbundnetze',
  headline: 'Ein Kontinent,<br><em>eine Frequenz.</em>',
  lede: 'Ein Satz, der sagt, worum es geht.',
  minutes: 90,
  intro: ['Absatz eins …', 'Absatz zwei …'],
  notes: [{ text: '<b>Merksatz.</b> …' }, { text: '…', signal: true }],
  parts: [{
    index: '01', eyebrow: 'Teil 1', title: 'Überschrift des Teils',
    count: '6 Aufgaben · leicht bis schwer',
    tasks: [ /* die Aufgabenobjekte */ ]
  }]
});
```

Gemeinsame Felder **jeder** Aufgabe: `id` (lückenlos ab 1, über alle Teile hinweg), `type`, `eyebrow`, `title`, `difficulty` (`leicht`/`mittel`/`schwer`), `prompt`, `feedback`, `deep`. Optional `wrongNote` (erscheint nur bei falscher Antwort) und `retry: false` (unterdrückt den Zweitversuch).

Punkte: Basis 10 × Multiplikator (leicht ×1, mittel ×1,5, schwer ×2). Ein Rechenweg zahlt je Schritt und einen Abschlussbonus in Schritthöhe. Ein Zweitversuch zählt halb. Ab der dritten richtigen Antwort hintereinander gibt es 5 Punkte Serienbonus, und der steckt auch in der Höchstpunktzahl — ein fehlerfreier Lauf erreicht genau 100 %.

---

# Die neun Aufgabentypen

| Typ | wofür | wann |
|---|---|---|
| `choice` | Einfach- oder Mehrfachauswahl | Begriffe, Aussagen, Abgrenzungen. `multi: true` für mehrere richtige. |
| `cloze` | Lückentext aus Auswahlfeldern und Freitext | zusammenhängende Sätze, in denen jede Lücke von der vorigen abhängt |
| `dnd` | Zuordnung Begriff ↔ Beschreibung | Systematiken, Rollen, Stufen. Mindestens vier Paare. |
| `order` | Reihenfolge sortieren | Abläufe, Zeitfolgen, Rechenschritte, Prozessketten |
| `hotspot` | Stelle in einem Bild anklicken | Schaltbilder, Diagramme, Karten. Das Bild darf die Antwort **nicht** beschriften. |
| `estimate` | Wert auf einer Skala schätzen | Größenordnungen. Der einzige Typ mit Teilpunkten aus einem Einzelwert. |
| `matrix` | Ja/Nein-Raster | zwei Dimensionen gegeneinander. Auch der Typ für „ohne Maus bedienbar". |
| `forecast` | Formular mit mehreren Feldern | eine Lage vollständig beurteilen: Zahl, Ursache, Maßnahme |
| `calc` | mehrstufiger Rechenweg | jede Rechenaufgabe. Jeder Schritt wird einzeln geprüft und schaltet den nächsten frei. |

**Nimm mindestens sechs davon je Blatt.** Ein Blatt aus vier `choice`-Aufgaben prüft Wiedererkennen, nicht Können. `validate.js` meckert unter vier Typen.

Ein Beispielobjekt je Typ steht in `assets/selbsttest.data.js` — kopiere den Aufbau von dort, das ist die Datei, die dafür geschrieben wurde.

```js
{ id: 1, type: 'choice', multi: false, difficulty: 'leicht',
  eyebrow: 'Teil 1 · Einfachauswahl', title: 'Kurzer Titel',
  prompt: 'Frage mit <span class="hl">hervorgehobenem</span> Kern?',
  options: [{ text: '…', correct: true }, { text: '…', correct: false }],
  feedback: 'Warum das richtig ist.',
  wrongNote: 'Warum der naheliegende Fehler naheliegt.',
  deep: 'Der Zusammenhang, der über die Frage hinausgeht.' }
```

```js
{ id: 9, type: 'calc', difficulty: 'schwer', /* … */
  given: [{ label: 'Spitzenlast', value: '78 000 MW' }],
  steps: [{ label: 'Nötige Leistung', formula: 'P = P<sub>max</sub> · 1,2',
            answer: 93600, tol: 500, unit: 'MW',
            hint: 'Spitzenlast plus ein Fünftel.' }] }
```

---

# Redaktionsregeln

Diese Regeln waren früher Bitten in einem Fließtext. Jetzt prüft sie `validate.js`, und ein Blatt ist erst fertig, wenn die Prüfung **ohne FEHLER** durchläuft.

**Fehler — blockieren:**
- `prompt`, `feedback` und `deep` sind Pflicht. Die Vertiefung ist der Grund, warum ein falsch geratener Klick trotzdem etwas wert ist.
- **Kein Fettdruck in Antwortmöglichkeiten.** Er zieht das Auge auf eine Option und verrät sie.
- Einfachauswahl mit genau einer richtigen Antwort.
- Bei `cloze`: die Antwort steht nicht zusätzlich in den Distraktoren.
- Bei `dnd`: keine doppelten Schlüssel, keine zwei gleichen Beschreibungen.
- Bei `hotspot`: **Trefferzonen überlappen nicht.** Sonst gibt es zwei richtige Antworten auf dieselbe Frage.
- Bei `estimate`: der Wert ist mit der Schrittweite des Reglers **erreichbar**. Sonst könnte man die Aufgabe nie richtig lösen.
- Bei `calc`: **jeder Schritt hat einen Tipp, und kein Tipp nennt das Ergebnis.** Ein Tipp, der die Zahl enthält, ist Abschreiben.
- Nummerierung lückenlos ab 1 über alle Teile hinweg.

**Hinweise — nachdenken:**
- Antwortlängen ähnlich (Spreizung ≤ 1,7×), und **die längste Antwort ist nicht die richtige**. Wer nichts weiß, klickt die längste; das darf nicht funktionieren. In der alten Fassung war das in vier von zwölf Aufgaben der Fall.
- Mindestens 45 % der Aufgaben `schwer` — die Regel lautet „die Hälfte", 45 % lässt Luft bei ungerader Aufgabenzahl.
- Mindestens vier Aufgabentypen.

**Was `validate.js` nicht kann** und du selbst entscheiden musst: ob ein Distraktor plausibel ist oder offensichtlicher Unsinn, ob eine Aufgabe fachlich gut gestellt ist, ob der Text sich gut liest, und **ob die Zahlen stimmen**. Die Prüfung kennt die Form, nicht die Physik. Rechne jede Zahl gegen und schreibe die Rechnung als Kommentar in die `.data.js` — im Beispielblatt steht sie im Kopf der Datei.

**Schreibe niemals eine Hilfsformel in die Aufgabenstellung**, bevor sie beantwortet wurde. Die Formel gehört in den Schritt, nicht in den `prompt`.

**Frage nach Entscheidungen, nicht nach Vokabeln.** „Wie heißt das Verfahren?" prüft Wiedererkennen. „Was nimmst du unter dieser Randbedingung, und was gibst du dafür auf?" prüft Können. Dafür sind `matrix`, `forecast`, `estimate` und `calc` da, und deshalb reichen vier `choice`-Aufgaben nie.

---

# Zeichenregeln für Visualisierungen

Eine Zeichnung ist eine reine Funktion, registriert über `WB.viz.define('name', function (ctx, w, h, p, c) { … })`, eingebunden deklarativ über `data-viz="name"` im Markup. Regler über `data-ctl`, Anzeigen über `data-out`. Kein Skript im Blatt.

Diese sechs Regeln haben beim Aufbau am meisten Zeit gekostet. Jede kommt aus einem Fehler:

1. **Es gibt keine feste Stelle im Feld, die frei bleibt**, wenn eine Kurve jede Höhe erreichen kann. Beschriftung in den Rand, in ein garantiert freies Band, oder auf farbigen Grund (`WB.viz.pill`). Ein Fleck „oben rechts" wird bei anderer Reglerstellung überschrieben.
2. **Beschriftung, die zusammenfallen kann, als Fluss setzen, nicht an Inhalts-Koordinaten.** `WB.viz.band()` setzt Marken von links und schiebt jede um ihre *gemessene* Breite weiter; was nicht mehr passt, fällt weg. Drei Marken aus der ersten Minute einer 15-Minuten-Achse liegen sonst alle auf demselben Pixel — genau so passiert.
3. **Zwei Formen mit gemeinsamer Kante ergeben eine sichtbare Naht.** Zusammengesetzte Silhouetten als **einen** Pfad zeichnen.
4. **Achsen folgen dem Inhalt**, nicht einem runden Wunschwert. Sonst läuft eine Kurve unten in die Achse und sieht dort wie eine eigene Struktur aus. Rechne die Achsengrenzen aus den Reglerwerten.
5. **Größenordnungsprobe, bevor du eine Aufgabe darauf baust:** kommt eine Zahl heraus, die es in der Natur gibt? Bei einem synthetischen Feld muss die Karten- und Achsengröße zu den Werten passen, nicht nur die Formel stimmen.
6. **Farben nie als Literal.** Sie kommen aus `c` — und das liest `viz.js` vom **Canvas-Element**, nicht von `:root`. Nur so greift eine Variante wie `[data-variant='loesung']`.

Und der Zwang, der alles überlagert: **`requestAnimationFrame` feuert im Headless-Browser nie.** Eine Zeichnung, die nur in einer rAF-Schleife zeichnet, bleibt im Prüflauf leer, und das Prüfwerkzeug meldet „nicht gezeichnet", ohne dass an ihr etwas falsch ist. `viz.js` zeichnet das erste Bild deshalb über `setTimeout`; eine Animation legt sich nur darüber.

**Sieh jede Zeichnung in den Reglerextremen an.** Das findet kein Exitcode. Rendere sie in einem Raster mit Minimum, Maximum und einer schmalen Breite nebeneinander und schau hin.

---

# Layoutregeln

Deutsche Komposita sind der Regelfall, nicht die Ausnahme. Vier Regeln, jede vom Prüfwerkzeug gefunden:

1. **`overflow-wrap: anywhere`, nicht `break-word`.** Nur `anywhere` fließt in die `min-content`-Breite ein. `break-word` bricht um, lässt die Spalte aber so breit wie das längste Wort — und schneidet den Rest ab.
2. **`minmax(0, 1fr)` statt `1fr`** in jedem Raster. Ein `fr`-Track darf nicht unter seinen `min-content` schrumpfen; ein `auto`-Track wird so breit wie die längste Option eines `<select>`.
3. **`min-width: 0` an jedem Flex- und Grid-Kind, das Text trägt.** Und wenn das Kind **anonym** ist — Text direkt im Flex-Container neben einem `::before` —, kannst du es nicht ansprechen: dann muss der Container ein **Raster** mit `minmax(0, 1fr)` werden. So gefunden an `.reveal > summary`.
4. **`<select>` braucht `max-width: calc(100% - 2·margin)`.** Ein Auswahlfeld wächst von sich aus auf die Breite seiner längsten Option und kennt keine Obergrenze. Und den Außenabstand abziehen, sonst bleibt genau der als Überstand stehen.

**Ein Breakpoint darf den Inhalt nicht verengen.** Wächst die Seitenleiste an einer Grenze von 248 auf 312 px, hat der Inhalt jenseits der Grenze *weniger* Platz als davor. Prüfe deshalb immer eine Breite **kurz vor und kurz nach** jedem Breakpoint. Genau dort ist ein Teilkopf abgeschnitten, unsichtbar, weil ein Flex-Container nicht scrollt.

**Geprüft wird bis 320 px, nicht bis 768.** Ein iPhone SE hat 375 px, ein altes Android 360, und mit vergrößerter Schrift landet man effektiv bei 320.

---

# Prüfen, bevor „fertig" gesagt wird

```
pwsh tools/bootcamp-check.ps1
pwsh tools/bootcamp-check.ps1 -Pages Fachartikel,index
```

Vier Prüfungen, Exitcode 0 oder 1:

1. **Selbstlauf** — jedes Blatt löst sich über echte Klicks selbst durch. Erwartet: Höchstpunktzahl, alle Aufgaben gelöst, alle Auszeichnungen, keine Konsolenfehler. Findet falsch hinterlegte Lösungen und kaputte Verdrahtung.
2. **Redaktion** — `validate.js` an jedem Aufgabenobjekt.
3. **Breiten** — 320 bis 1340 px in echten iframe-Viewports, im ungelösten **und** im aufgelösten Zustand. Der aufgelöste ist der breitere: Rückmeldung, Vertiefung, Zonenlegende und Lösungswerte kommen erst nach dem Prüfen dazu.
4. **Klassen** — jede im Markup benutzte CSS-Klasse muss eine Regel haben.

Prüfung 4 existiert wegen des schlimmsten Fehlers, den dieses Rahmenwerk hatte: `.frac` wurde im Fachartikel 18-mal benutzt und stand in keinem Stylesheet. Die Fourier-Reihe des Rechtecks las deshalb

```
Rechteck(t) = 4π · ( sin t + 13 sin 3t + 15 sin 5t + … )
```

statt `4/π` und `1/3`, `1/5`. Kein Skript ist abgestürzt, keine Konsole hat gemeckert, die Seite sah sauber aus — nur die Formel war falsch, und zwar so, dass man sie so auswendig lernt. **Ein grüner Exitcode heißt „nichts Kaputtes gefunden", nicht „gut".**

Was der Exitcode ausdrücklich **nicht** prüft und du selbst ansehen musst:
- ob eine Aufgabe fachlich gut gestellt ist und die Distraktoren plausibel wirken
- ob die Zahlen stimmen
- ob der Text sich gut liest
- wie eine Visualisierung in den Reglerextremen aussieht
- Zuordnung und Reihenfolge per Touch, dann nur mit der Tastatur
- Druckvorschau: Seitenleiste und Knöpfe weg, Lösungen aufgeklappt
- `localStorage`: neu laden, Stand da; zwei Blätter parallel, Stände getrennt

Und einmal am Ende: **`assets/` mit einem Blatt eine Ebene höher kopieren und erneut per Doppelklick öffnen.** Die relativen Pfade müssen unverändert greifen.

---

# Zwei optische Register

Die **Übersicht** (`index.html`) ist ein Inhaltsverzeichnis und soll ruhig sein: kein Rauschfilm, keine 100-px-Serifen, keine Initiale. Die redaktionelle Anmutung beginnt erst **in** einem Blatt oder Artikel, wo sie den Lesefluss trägt. Wer beides gleich laut macht, nimmt der Lektion ihren Auftritt.

Praktisch: die Übersicht bekommt `<body class="is-hub">`, ein Blatt nicht.

**Die Übersicht empfiehlt zu jedem Zeitpunkt genau einen nächsten Schritt.** Vierzehn gleichberechtigte Kacheln sind eine Entscheidung, die ich nicht treffe — und dann mache ich gar nichts.

---

# Labs

Ein **Lab** ist eine Hands-on-Einheit **ohne Bewertung**: eine eigene Seite, auf der man etwas baut, rechnet oder ausprobiert, mit Anleitung und Musterlösung, aber ohne Punkte und ohne Prüfknopf. Ein Lab ist Handwerk, kein Test.

Nimm ein Lab, wenn eine Fertigkeit nur durch Machen entsteht — ein Schaltbild selbst zeichnen, eine Messreihe auswerten, einen Rechenweg auf eigenen Zahlen wiederholen. Verlinke es aus der Fußnavigation der Seitenleiste des zugehörigen Blattes und trage es in `index.data.js` **ohne** `points` ein, damit es nicht in den Punktestand zählt.

Ein Lab, das an meiner Maschine nicht läuft, ist schlimmer als kein Lab — es kostet einen Abend und endet in Frust. Wenn ein Lab etwas voraussetzt, das installiert werden muss, steht die Voraussetzung oben auf der Seite, mit dem Weg drumherum, falls sie fehlt.

---

# Fachartikel

Ein Fachartikel (`Fourier_Lehrkurs.html` als Vorlage) erklärt zusammenhängend, was ein Aufgabenblatt nur abfragt. Aufbau: Kapitel als `<section class="chapter" id="k0">`, Formeln in `.eq`, Betonungen mit `.keyword`, Rechenwege als `<ol class="steps-eq">`, Merkkästen als `.callout`, Karteikarten als `.card3d`, Kontrollfragen als `<details class="reveal">`.

`lehrkurs.js` macht die Karten per Klick **und Tastatur** umdrehbar, markiert das gelesene Kapitel in der Seitenleiste und speichert den Lesefortschritt — Letzteres, damit die Übersicht einen gelesenen Artikel auch als fertig führen kann. Ein Artikel bekommt nie einen Aufgabenstand; ohne diesen Lesestand würde die Übersicht ihn für immer als „als nächstes" vorschlagen.

Ein Artikel bindet `engine.js` (nur wegen des Speichers), `viz.js`, seine Zeichnungen, `lehrkurs.js` und `audit.js` ein.

---

# `file://`-Zwänge

Die Blätter werden **per Doppelklick geöffnet** — kein Server, kein npm, kein Build. Daraus folgen vier Dinge, die einen Agenten sonst gegen eine Wand laufen lassen:

1. **Keine ES-Module.** `<script type="module">` scheitert von `file://` an CORS. Alles ist klassisches Skript in einer IIFE mit dem einen Namensraum `window.WB`.
2. **Kein `fetch`.** Aufgabendaten kommen als `<script src="…data.js">`, das `WB.register()` aufruft — nicht als JSON-Datei.
3. **`localStorage` teilt auf `file://` einen einzigen Ursprung.** Der Schlüssel muss den Dateinamen enthalten, sonst überschreiben sich zwei Blätter gegenseitig. Alles in `try/catch`: manche Browser sperren `localStorage` auf `file://` ganz. Dann läuft das Blatt weiter und `[data-store-warning]` sagt es.
4. **Headless-Chromium klemmt `--window-size` bei 478 px fest** (nachgemessen: angefordert 320, bekommen 478), und `@media` reagiert auf das **Fenster**, nicht auf einen Container — eine verengte `.shell` zu messen liefert Unsinn. Schmale Breiten gehen nur über einen echten `<iframe>`-Viewport. Und weil der Ursprung von `file://` opak ist, kann das Elternfenster das iframe-DOM nicht lesen: das Kind misst sich selbst und meldet per `postMessage` nach oben. Das macht `assets/breiten.html`, und es funktioniert — nachgemessen.

Skriptreihenfolge in einem Blatt ist bindend:

```html
<script src="assets/engine.js"></script>      <!-- definiert WB.register -->
<script src="assets/validate.js"></script>    <!-- Redaktionsregeln -->
<script src="Blattname.data.js"></script>     <!-- ruft WB.register, rendert -->
<script src="assets/viz.js"></script>         <!-- definiert WB.viz.define -->
<script src="assets/viz-thema.js"></script>   <!-- die Zeichnungen -->
<script src="assets/audit.js"></script>       <!-- ohne Anker inaktiv -->
```

---

# Weitere Formate

Neben den HTML-Seiten gibt es genau ein weiteres Format für Inhalte:

- **Programmcode mit Lücken und TODOs**, danach ausführbar/kompilierbar. Achte darauf, dass Java-Code in IntelliJ geöffnet und ausgeführt werden kann — lege alle nötigen Dateien an, damit ich direkt auf den Play-Button drücken kann, wenn ich ein File ausgefüllt habe. Lege entsprechende Beispielwerte an und printe genug, damit ich im Terminal sehen kann, ob mein Output dem gewünschten entspricht. Die Aufgabenstellung dazu steht trotzdem auf einer Seite im Projekt — die Datei selbst enthält nur Code und TODOs.

**Markdown ist kein Format für Aufgaben und Erklärstrecken.** Auch nicht als Sparmaßnahme, auch nicht für „generische Textaufgaben ohne grafische Relevanz". Genau diese Ausnahme hat früher dafür gesorgt, dass die trockensten Themen — die, an denen ich sowieso abschalte — die schwächste Darstellung bekamen. Ein Thema ohne offensichtliche Grafik ist der Anlass, eine zu erfinden: ein Raster, eine Zuordnung, eine Zeitachse, eine Karteikarte. Wenn dir zu einem Inhalt nichts Visuelles einfällt, hast du ihn noch nicht verstanden, und ich werde ihn dann auch nicht verstehen.

Die Zettel zum Nachschlagen sind davon ausgenommen und bleiben Markdown — nicht als Sparmaßnahme, sondern weil sie im Vault verlinkt sein müssen. Die vollständige Liste steht in *Ein Auslieferungsformat: das HTML-Projekt*. Ein Zettel ist ein Nachschlagewerk; sobald daraus Üben wird, ist es eine Seite im Projekt.

Du kannst, wenn logisch nötig oder sinnvoll, Unterverzeichnisse anlegen.

---

# Persistenz

Ich werde diese Aufgabe im Laufe des Studiums noch ein paar Mal von dir verlangen. Verfasse deshalb deine Arbeitsschritte in `SKILL.md`-Dateien, so dass du dich mit neuem Kontext wieder daran erinnerst bzw. auf Ressourcen zur Erfüllung der Aufgabe zugreifen kannst. Du kannst auch Skripte schreiben, die Prozesse automatisieren und die Skills unterstützen.

**Wohin damit.** Nicht in einen Ordner „Migration ins Hauptprojekt" — den müsstest du jedes Mal neu anlegen und ich jedes Mal von Hand zurückkopieren. Dieses Repo (`github.com/31erGER/Bootcamp_Agent`) **ist** die Persistenz: es wird in jeden Modulordner geklont. Was für alle Aufträge gilt, kommt hierher — Verbesserungen an `assets/`, `tools/`, an dieser Datei und an den `.claude/skills/`. Was nur für dieses Modul oder Thema gilt, bleibt im Arbeitsverzeichnis. Wenn du etwas am Rahmenwerk verbessert hast, sag es mir am Ende, damit ich es in dieses Repo zurückspiele.

Weitere Gamification-Ideen, noch nicht umgesetzt: Konfetti beim Abschluss, Kanban-Board mit Tickets.
