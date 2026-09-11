# Rahmenwerk

**Diese Datei gilt für jeden Auftrag.** Sie beschreibt, *wie* gebaut wird — nicht *was*. Das Was steht in `Klausurvorbereitung.md` oder in `NeuesThema.md`; genau eine der beiden ist zusätzlich zu lesen, nie beide.

Jede Regel hier kommt aus einem Fehler, der einmal gemacht wurde. Deshalb steht bei den meisten der Grund dabei — eine Regel ohne Grund wird von der nächsten Sitzung wegoptimiert.

---

# Was schon da ist

Der Ordner `src` ist **kein Beispiel zum Abschauen, sondern ein lauffähiges Rahmenwerk** — und seit dem 10.09.2026 gleichzeitig ein vollständiges Dummy-Bootcamp, in dem **jedes** Merkmal genau einmal vorkommt. Er hieß bis dahin `Stylevorgabe`; `tools/bootcamp-check.ps1` erkennt beide Namen, damit ein älterer Klon unverändert weiterläuft.

**`startseite.html` liegt im Wurzelverzeichnis und ist die EINZIGE Seite dort.** Ein Einstieg, den man erst in einem Unterordner suchen muss, ist keiner. Ihre Daten liegen dagegen bei allem anderen Gebauten: `src/startseite.data.js`. Die Einträge dort tragen den Pfad `src/…` mit — Rahmenwerk und Prüfwerkzeug erlauben das ausdrücklich, siehe *Prüfen*.

*Umbenannt am 11.09.2026; hieß `index.html` + `index.data.js` im Wurzelverzeichnis.* „index" ist ein Webserverwort: es heißt „die Datei, die ausgeliefert wird, wenn niemand eine nennt". Hier nennt sie immer jemand, per Doppelklick. Und die Datendatei ist kein Einstieg, sondern Inhalt — Inhalt liegt in `src/`. Im Wurzelverzeichnis steht damit nur noch das, was man anklickt, und das, was der Agent liest.

```
startseite.html                  ← der Einstieg. Die EINZIGE Seite hier oben.
src/
  startseite.data.js             ihr Inhalt: Module, Gruppen, Punkte, Aufgabenzahl
  assets/                        ← das Rahmenwerk. Wird KOPIERT, nicht gelöscht.
    colorpalett.css              nur die Design-Tokens, eine Datei, ein Ort
    fonts.css                    die sechs Schriften als base64, EINMAL
    styles.css                   importiert die beiden und trägt alles Übrige
    engine.js                    Datenmodell, Bewertung, Fortschritt, zwölf Renderer,
                                 Speicherbrücke über file://
    validate.js                  die Redaktionsregeln als ausführbarer Code
    viz.js                       Canvas-Rahmen und Zeichenbausteine
    hub.js                       die Übersichtsseite
    lehrkurs.js                  Karteikarten, Kapitelmarkierung, Lesefortschritt
    audit.js                     Selbstprüfung eines Blattes
    breiten.html                 Breitenprüfung über echte iframe-Viewports
    selbsttest.html/.data.js     Regressionsblatt: je eine Aufgabe pro Typ
    img/                         SVG-Schemata für Bildaufgaben
  Anleitung.html                 Wegweiser: welche Seite führt was vor
  Canvas_Beispiel.canvas         Syntaxbeispiel für Obsidian-Canvas (nur für dich)
  Modul_01_Signale_Lehrkurs.html    ┐
  Modul_01_Signale.html/.data.js    ├ Modul 01 · der Dreiklang
  Modul_01_Signale_Lab.html         ┘
  Modul_02_Verbundnetze_Lehrkurs.html  ┐
  Modul_02_Verbundnetze.html/.data.js  ├ Modul 02 · derselbe Aufbau
  Modul_02_Verbundnetze_Lab.html       ┘
  Klausurphase/                  ← als Ganzes löschbar, wenn es keine Prüfung gibt
    Lernplan.html                Kachelplan je Tag
    Abdeckung.html               Abdeckungskarte Thema → Blatt
    Intensiv_01_Netzrechnen.*    Intensivkurs: Theorieblock, `result`, `paper`, `verify`
    Probeklausur.*               Klausurmodus, 8 Aufgaben
tools/
  bootcamp-check.ps1             prüft alles, bevor du „fertig" sagst
  intensive-types-check.mjs      Bewertung und Zweitversuch-Regeln der Engine
  intensive-answer-check.mjs     rechnet jedes `result`-Ergebnis unabhängig nach
  file-progress-sync-check.mjs   Speicherbrücke über getrennte file://-Ursprünge
  hub-progress-check.mjs         Fortschrittsbalken der Übersicht
  exam-coverage-check.mjs        behauptete Abdeckung             ← nur Klausurphase
  probeklausur-quality-check.mjs Klausurbedingungen               ← nur Klausurphase
  klausurphase.config.mjs        die Erwartungen dazu             ← nur Klausurphase
```

Der Showcase ist inhaltlich ein **Dummy** („Beispielkurs Energietechnik") und fachfremd. Er ist die Stelle, an der man den aktuellen Stand des Rahmenwerks ansieht, ohne ein echtes Bootcamp zu öffnen: `src/Anleitung.html` sagt Zeile für Zeile, welche Seite welches Merkmal vorführt. Wer ein neues Merkmal baut, ergänzt es dort — sonst ist es in drei Monaten gebaut und unbekannt.

**Zwei Module, nicht eins.** Das ist Absicht und kein Zufall des Umfangs: an einem einzigen Beispiel ist nicht zu erkennen, was Form und was Inhalt ist. Erst der Vergleich zweier Module zeigt, welche Teile in jedem Modul identisch sind — Wegweiser, Gerüst, Etappenaufbau — und welche vom Thema kommen.

**Was gelöscht wird und was nicht.** Aufräumen heißt: `src/Canvas_Beispiel.canvas` und die fachfremden Showcase-Seiten (beide `Modul_0*`-Dreiklänge, `src/Anleitung.html`, der Ordner `src/Klausurphase/`) dürfen weg, sobald du eigene Module hast — `src/Anleitung.html` wird durch die **eigene** Anleitungsseite ersetzt und nicht einfach gelöscht. `src/assets/` bleibt: **jedes** Blatt lädt daraus Stylesheet, Engine und Schriften und wäre danach eine leere Seite. `startseite.html`, `src/startseite.data.js`, `tools/` und `src/assets/selbsttest.*` bleiben ebenfalls — die Übersicht ist der Einstieg, die Prüfwerkzeuge brauchst du bei jeder Änderung, und der Selbsttest ist die Regressionsprüfung des Rahmenwerks. Nichts davon ist Demo-Material.

**Kopiere die Struktur, nicht den Text.** Ein neues Modul entsteht, indem man einen der beiden Dreiklänge kopiert und Titel, Dateinamen und die `.data.js`-Zeile tauscht. Die Aufgabenobjekte je Typ holt man sich aus `src/assets/selbsttest.data.js` — die Datei ist genau dafür geschrieben.

## Notizblock und Canvas

Erstelle eine `AGENT_Zwischenablage.md`, die dir als eigener **Notizblock** dient. Hier kannst du dir Dinge aufschreiben, mit mir **kommunizieren**, Dinge für mich notieren oder mir Fragen stellen, die ich zwischendurch abzuarbeiten habe. Was eine spätere Sitzung mit neuem Kontext wissen muss, steht hier — sonst fängt sie von vorn an.

**Sie steht in der `.gitignore` und wird nie eingecheckt.** Sie gilt nur für dieses Arbeitsverzeichnis und ist der Ort, an dem Notizen über mich landen; in einem geteilten Repo hat sie nichts zu suchen. Was über das *Verfahren* gelernt wurde und für alle Aufträge gilt, gehört deshalb nicht hierher, sondern in diese Datei oder in einen Skill — siehe *Persistenz*.

`src/Canvas_Beispiel.canvas` zeigt die **Syntax** einer Obsidian-Canvas: Knoten, Gruppen, Kanten, Farbindizes. Nutze Canvas für Flussdiagramme, Mindmaps und andere visuelle Darstellungen, wann immer du kannst, um Inhalte zu veranschaulichen, zu strukturieren oder zu organisieren.

Zwei Orte, und die Unterscheidung ist die ganze Regel:

- **Die Beispieldatei liegt in `src/`.** Sie ist ein Syntaxbeispiel *für dich* und für den Nutzer bedeutungslos — er öffnet sie nie. Alles, was nur der Agent braucht, gehört nicht ins Wurzelverzeichnis.
- **Eine Canvas, die DU für das Bootcamp erstellst, gehört ins Wurzelverzeichnis** — neben `startseite.html`, unter einem sprechenden Namen (`Themenlandkarte.canvas`, `Abhaengigkeiten.canvas`). Sie ist ein Ergebnis und keine Vorlage, und der Nutzer muss sie ohne Suchen finden.

**Sag beim Abliefern dazu, dass eine `.canvas` mit Obsidian geöffnet werden muss.** Nicht per Doppelklick, nicht im Browser — das Bootcamp liegt in einem Obsidian-Vault, die Datei ist dort eine Notiz und nur dort lesbar. Ein Nutzer, der doppelklickt und rohes JSON sieht, hält die Datei für kaputt. Dieser eine Satz ist Teil der Lieferung, nicht Kür.

**Längere Arbeitsdokumente gehören in `docs/`** — ein Plan, eine Spezifikation, ein Prüfbericht, alles, was zu lang für die Zwischenablage ist und über eine Sitzung hinaus gebraucht wird. Den Ordner legt der Auftrag an, wenn er ihn braucht; **die Vorlage liefert ihn nicht mit**, weil ein leeres `docs/` nur Platz einnimmt. Was dort landet, ist kursbezogen und wird beim nächsten Bootcamp nicht mitgeschleppt: die Regeln, die sich bewährt haben, gehören in diese Datei, nicht in einen Bericht daneben.

Keine externen Server- oder Hostingkosten. Das Setup muss lokal, pflegeleicht und einfach zu bedienen bleiben.

---

# Ein Modul ist ein Dreiklang

*Ergänzt am 10.09.2026, nachdem der Abgleich mit dem AuD- und dem Homelab-Bootcamp gezeigt hat, dass beide diese Form längst durchhalten — acht Module in AuD, jedes mit allen drei Teilen — und die Vorlage sie nirgends aufgeschrieben hatte.*

**Jedes normale Lehr- oder Lernmodul besteht aus genau drei Teilen, in dieser Reihenfolge:**

| Schritt | Datei | Rolle | Punkte |
|---|---|---|---|
| 1 | `Modul_NN_Thema_Lehrkurs.html` | **Fachartikel** — erklärt zusammenhängend, was ein Aufgabenblatt nur abfragt | keine, Lesestand |
| 2 | `Modul_NN_Thema.html` + `.data.js` | **Aufgabenheft** — prüft, ob die Begriffe tragen | ja |
| 3 | `Modul_NN_Thema_Lab.html` | **Lab** — lässt machen | keine, Lesestand |

**Das Lab steht immer am Schluss, und es fehlt nie.** Lesen erzeugt Wiedererkennen, Ankreuzen erzeugt Wiedererkennen mit Rückmeldung — Können entsteht erst, wenn man etwas selbst gemacht hat. Ein Modul ohne Lab hat seine Lücke deshalb am wichtigsten Ende, und man merkt es nicht, weil Heft und Artikel vollständig aussehen.

Drei Regeln dazu, alle drei aus echten Fehlern:

1. **Alle drei Dateien tragen dasselbe Präfix `Modul_NN_Thema`.** Das ist nicht Kosmetik: es macht sie im Verzeichnis als Einheit sichtbar, und es ist die Bedingung dafür, dass der Wegweiser in der Seitenleeiste (siehe *Navigation*) auf allen drei Seiten gleich aussieht. Ein `Fourier_Lehrkurs.html` neben einem `Modul_03_Verbundnetze.html` gehört sichtbar zu nichts.
2. **Alle drei stehen in EINER `group` der Übersicht**, in dieser Reihenfolge. `hub.js` gruppiert über aufeinanderfolgende Läufe — die drei Einträge müssen also beieinander stehen, und die Gruppe trägt den Modulnamen, damit ihn nicht jede Karte wiederholt.
3. **Ist ein Thema zu klein für drei Teile, ist es kein eigenes Modul**, sondern ein Kapitel im Nachbarmodul. Das ist die richtige Antwort — nicht ein Modul ohne Lab.

**Ein Lab muss nichts Programmieren sein.** Genau daran scheitert die Regel sonst: bei einem Thema ohne Code fällt keins ein, und dann entfällt es. Etwas von Hand zeichnen, eine Messreihe auswerten, einen Rechenweg auf eigenen Zahlen wiederholen, ein Schema aufs Papier bringen — das sind Labs. Die beiden im Showcase sind genau das, und keines braucht Software.

**Was NICHT in dieses Schema gehört:** Intensivkurse und Probeklausuren. Sie sind Prüfungsvorbereitung und stehen in `src/Klausurphase/` — siehe *Nur in der Klausurphase*. Ein Intensivkurs ist die Steigerungsform des Aufgabenhefts, nicht dessen Ersatz, und er hat keinen eigenen Lehrkurs und kein eigenes Lab.

## Der Aufbau eines Labs

Ein Lab ist in **Etappen** geteilt, und jede Etappe hat zwei Pflichtteile — ein Ziel und ein prüfbares Ende:

```html
<section class="chapter" id="e1">
  <span class="chapter__tag">Etappe 1 · Quelle</span>
  <h2>Kurzer Titel</h2>
  <p class="lead-in">Ziel: … ein Satz …</p>
  … Erklärung, ein .callout--think für das „warum es darauf ankommt" …
  <div class="term">… die Sollwerte, an denen man selbst prüft …</div>
  <div class="etappe-ende"><b>Etappe 1 ist fertig, wenn</b> …</div>
</section>
```

- **Etappe 0 ist die Voraussetzung**, nicht die erste Aufgabe. Was installiert, ausgedruckt oder herausgesucht werden muss, steht dort und nirgends sonst. Ein Lab, das an meiner Maschine nicht läuft, ist schlimmer als kein Lab — es kostet einen Abend und endet in Frust.
- **Die letzte Etappe heißt „Ergebnis & Hilfe"** und enthält die häufigen Fehlerbilder als `<details class="reveal">`. Sie ist der Ersatz für den Prüfknopf, den ein Lab nicht hat.
- **`.etappe-ende` ist eine prüfbare Aussage**, kein Zuspruch. „Etappe 3 ist fertig, wenn die Volllaststunden zwischen 500 und 8 000 liegen" ist eine; „Etappe 3 ist fertig, wenn du es verstanden hast" ist keine.
- **Der `.term`-Block trägt die Sollwerte.** Bei einem Code-Lab ist das die erwartete Programmausgabe, bei einem Rechen-Lab die Zahlen zum Vergleichen, bei einem Lab mit eigenen Eingabewerten der **Plausibilitätsbereich** — dann ist er der einzige ehrliche Test.

Das Lab lädt `engine.js` (nur wegen `WB.store`) und `lehrkurs.js`, sonst nichts. Der Lesestand ist der Grund: ohne ihn schlägt die Übersicht das Lab für immer als „als nächstes" vor, weil es nie einen Aufgabenstand bekommt.

---

# Ein Auslieferungsformat: das HTML-Projekt

**Jede Aufgabe und jede Erklärstrecke ist eine Seite im HTML-Projekt.** Keine Aufgabensammlung als Fließtext, kein Kapitel als Textdatei. Eine Markdown-Datei ist trocken: kein Fortschritt, keine Rückmeldung, keine Zeichnung, kein Punktestand, kein Grund weiterzulesen. Genau das brauche ich aber, um dranzubleiben. Das HTML-Projekt liefert es, Markdown nicht — deshalb ist die Wahl schon getroffen und keine Abwägung je Datei.

Praktisch heißt das:

- Jede Übungs-, Lehr- und Laboreinheit ist eine **HTML-Seite in `src/`** und lädt Aussehen und Logik aus `assets/`.
- Jede Seite steht in `src/startseite.data.js`. Was dort nicht eingetragen ist, existiert für mich nicht — die Übersicht ist der einzige Einstieg.
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

## Der Gegenfehler: dünn statt dicht

Dichte hat zwei Richtungen, und die zweite ist beim Portieren des Homelab-Bootcamps passiert. Aus 379 Zeilen Markdown wurden 454 Zeilen HTML — und dabei fielen **Inhalte** weg statt Wiederholungen: die Anknüpfung an die Elektrotechnik, die Record-Typen-Tabelle, die PTR-Rechnung, fünf Missverständnisse. Das Ergebnis war nicht dichter, sondern **anspruchsvoll und anstrengend**, weil es Vorwissen voraussetzte, das der Text vorher selbst aufgebaut hatte.

Die Prüffrage aus dem vorigen Abschnitt fängt das ab, wenn man sie ernst nimmt: *streiche den Absatz — fehlt danach eine Information?* Bei einer Anknüpfung an Vorwissen lautet die Antwort **immer ja**.

Zwei Auslöser, an denen es konkret schiefging:

- **„Kurze Einheiten mit sichtbarem Ende" heißt nicht „knapp formuliert".** Das ist die Randbedingung aus `Nutzereinstellungen.md`, und sie betrifft die **Portionierung**, nicht die Erklärtiefe. Ein Kapitel darf ausführlich erklären und trotzdem nach zehn Minuten enden. Dreizehn gründliche Kapitel sind besser als neun knappe.
- **HTML trägt mehr als Markdown.** Was in einer Markdown-Datei ein zäher Absatz war, ist hier eine Tabelle mit fünf Zeilen, ein Merkkasten oder ein aufklappbares `<details>`. **Dieselbe Information, ein Bruchteil der Anstrengung.** Wer beim Portieren die Markdown-Menge als Obergrenze nimmt, kürzt am falschen Ende.

Der Maßstab für einen Fachartikel ist deshalb: **jeder Fachbegriff wird bei seiner ersten Verwendung erklärt, jede Zahl kommt mit ihrer Rechnung, jede Regel mit ihrem Grund.** Was darüber hinaus wiederholt, fällt weg.

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
  intro: ['Absatz eins …', 'Absatz zwei …'],
  notes: [{ text: '<b>Merksatz.</b> …' }, { text: '…', signal: true }],
  parts: [{
    index: '01', eyebrow: 'Teil 1', title: 'Überschrift des Teils',
    count: '6 Aufgaben · leicht bis schwer',
    tasks: [ /* die Aufgabenobjekte */ ]
  }]
});
```

Gemeinsame Felder **jeder** Aufgabe: `id` (lückenlos ab 1, über alle Teile hinweg), `type`, `eyebrow`, `title`, `difficulty` (`leicht`/`mittel`/`schwer`), `prompt`, `feedback`, `deep`. Optional:

| Feld | Wirkung |
|---|---|
| `wrongNote` | erscheint nur bei falscher Antwort |
| `retry: false` | unterdrückt den Zweitversuch für diese Aufgabe |
| `exam: true` | Aufgabe zeigt vor der Abgabe keinen Weg — siehe *Zweitversuch* unten |
| `source` | die Fundstelle in den Unterlagen, als Datenfeld statt als Kommentar. Wird nicht gerendert; `tools/probeklausur-quality-check.mjs` erzwingt es in einer Probeklausur, und der Folienabgleich am Ende eines Auftrags arbeitet diese Liste ab |

**`part.lead` — ein Theorieblock vor dem Aufgabensatz.** Ein Teil darf HTML vor seinen Aufgaben zeigen: einen vollständig gelösten Einstieg, die drei Regeln, um die es gleich geht, oder eine Tabelle, die man beim Rechnen braucht. Der Block ist optional; ein leerer `lead` ist ein FEHLER und kein Hinweis, weil eine leere Kiste schlimmer aussieht als keine.

```js
parts: [{
  index: '01', eyebrow: 'Teil 1', title: 'Lastgang', count: '3 Aufgaben',
  lead: '<div class="theorie">…</div>',      // optional
  tasks: [ /* … */ ]
}]
```

`.lead-in` setzt eine kurze Kapiteleinleitung: Display-Serife, 19–23 px, 62 Zeichen Zeilenmaß. Für zwei Sätze ist das richtig, für einen Theorieteil mit Listen, Tabellen und einer Abbildung genau falsch. Deshalb hebt **`<div class="theorie">` als Kind die Vorgaben des Elternteils auf** und liefert Textschrift, normales Fließtextmaß und volle Breite für Tabellen. `.theorie` ist damit **der Prosablock des Rahmenwerks** und wird auch auf reinen Leseseiten benutzt — `styles.css` setzt `* { margin: 0 }`, ein nackter Absatz hätte also keinen Abstand. Verfügbar darin: `h3`, `p`, `ol`/`ul`, `.table-wrap` + `table`, `figure` + `figcaption`, `.eq`, `.zitat` für wörtliche Folienzitate und `.quelle` für deren Nachweis.

Punkte: Basis 10 × Multiplikator (leicht ×1, mittel ×1,5, schwer ×2). Ein Rechenweg zahlt je Schritt und einen Abschlussbonus in Schritthöhe. Ein Zweitversuch zählt halb. Ab der dritten richtigen Antwort hintereinander gibt es 5 Punkte Serienbonus, und der steckt auch in der Höchstpunktzahl — ein fehlerfreier Lauf erreicht genau 100 %.

## Klausurmodus

*Ergänzt am 14.08.2026, gebaut für die Generalprobe des AuD-Bootcamps.*

Ein Feld am Blatt macht aus dem Lernblatt eine Prüfung:

```js
WB.register({
  klausur: { minuten: 90, bestehen: 50, gesamt: 100 },
  parts: [ /* jede Aufgabe braucht dann `punkte: n` */ ]
});
```

Fünf Dinge schalten damit gleichzeitig um — **alles opt-in; ohne das Feld verhält sich die Engine unverändert**:

| Schalter | wo in `engine.js` |
|---|---|
| `punkte` je Aufgabe statt Basis × Multiplikator | `maxPoints()` |
| kein Serienbonus (sonst wäre die Höchstzahl `gesamt` + Bonus) | `sheetMaxPoints()`, `settle()` |
| kein Zweitversuch | `mayRetry` in `renderTask` |
| Rückmeldung, Lösung und Vertiefung erst nach der Abgabe | `finishTask`, `markRestored`, `aufdecken()`, calc-Zweig |
| Countdown in der Seitenleiste, startet mit der ersten Antwort | `uhr`-Modul, montiert in `register` |

`validate.js` erzwingt: im Klausurmodus braucht **jede** Aufgabe ein numerisches `punkte`, und die Summe muss `klausur.gesamt` treffen. Fehlt es an einer Stelle, fiele genau diese Aufgabe still auf die Lernblatt-Rechnung zurück — das sähe man der Seite nicht an.

**Die eine Entwurfsentscheidung, die man nicht aufrollen sollte:** die Abgabe passiert **automatisch, sobald die letzte Aufgabe beantwortet ist**, zusätzlich zum Knopf. Nur deshalb läuft der Selbstlauf in `tools/bootcamp-check.ps1` unverändert durch, ohne den Abgabeknopf kennen zu müssen.

Beim `calc`-Typ ist `ok` (der Schritt stimmt) von `erledigt` (der Schritt ist abgehakt) getrennt: in der Klausur geht es auch nach einer falschen Zahl weiter, und die Punkte kommen anteilig erst am Schluss.

**Bekannte Lücke:** wer *vorzeitig* abgibt und danach neu lädt, sieht die Lösungen wieder verborgen. Der Abgabezustand wird beim Wiederherstellen aus „alle Aufgaben beantwortet" abgeleitet und nicht mitgespeichert.

---

# Die zwölf Aufgabentypen

*Neun waren es bis zum 27.08.2026. `result` und `paper` kamen im Infosec-Bootcamp dazu, weil die neun anderen alle eine Gemeinsamkeit haben: sie zeigen den Weg. Eine Auswahl nennt die Möglichkeiten, ein Rechenweg gibt die Schritte vor, eine Prognose beschriftet ihre Felder. In einer Prüfung tut das niemand. `reverse` kam am 11.09.2026 dazu — aus dem entgegengesetzten Grund: alle anderen fragen von der Frage zur Antwort, und das ist die Richtung, die man ohnehin ständig übt.*

| Typ | wofür | wann |
|---|---|---|
| `choice` | **Einfach**auswahl: genau eine Aussage ist wahr | Begriffe, Abgrenzungen, Definitionen |
| `choice`, `multi: true` | **Mehrfach**auswahl: beliebig viele sind wahr | Eigenschaften, die gleichzeitig gelten. Zählt als **eigene Aufgabenart** — siehe unten. |
| `cloze` | Lückentext aus Auswahlfeldern und Freitext | zusammenhängende Sätze, in denen jede Lücke von der vorigen abhängt |
| `dnd` | Zuordnung Begriff ↔ Beschreibung | Systematiken, Rollen, Stufen. Mindestens vier Paare. |
| `order` | Reihenfolge sortieren | Abläufe, Zeitfolgen, Rechenschritte, Prozessketten |
| `hotspot` | Stelle in einem Bild anklicken | Schaltbilder, Diagramme, Karten. Das Bild darf die Antwort **nicht** beschriften. |
| `estimate` | Wert auf einer Skala schätzen | Größenordnungen. Der einzige Typ mit Teilpunkten aus einem Einzelwert. |
| `matrix` | Ja/Nein-Raster | zwei Dimensionen gegeneinander. Auch der Typ für „ohne Maus bedienbar". |
| `forecast` | Formular mit mehreren Feldern | eine Lage vollständig beurteilen: Zahl, Ursache, Maßnahme |
| `reverse` | Antwort steht, die Frage wird gesucht | Kennzahlen, Messwerte, Grenzwerte. Mehrere Zeilen, ein gemeinsames Auswahlfeld. |
| `calc` | mehrstufiger Rechenweg | jede Rechenaufgabe. Jeder Schritt wird einzeln geprüft und schaltet den nächsten frei. **Die Formel erscheint erst nach einem Fehlversuch.** |
| `result` | nur die Endergebnisse | klausurnahe Aufgaben. Kein Zwischenschritt, keine Formel, kein Tipp — der geprüfte Musterweg erscheint erst nach der Abgabe. |
| `paper` | auf Papier lösen, dann selbst bewerten | alles, was gezeichnet oder frei formuliert wird: Diagramme, Schemata, Modelle. Die Musterlösung ist vor dem Abschluss nicht im DOM. |

**Nimm mindestens sechs davon je Blatt.** Ein Blatt aus vier `choice`-Aufgaben prüft Wiedererkennen, nicht Können. `validate.js` meckert unter vier Typen.

**Einfach- und Mehrfachauswahl sind ZWEI Aufgabenarten, nicht eine.** *Festgelegt am 11.09.2026.* Sie teilen sich den Typnamen `choice` und unterscheiden sich im Code nur durch ein Flag — für den Lernenden sind es zwei verschiedene Aufgaben. Bei der Einfachauswahl ist genau eine Aussage wahr, und Ausschließen funktioniert; bei der Mehrfachauswahl weiß man vorher nicht einmal, wie viele wahr sind, und jede Option muss einzeln beurteilt werden. Deshalb gilt: **wo eine Vorführung vollständig sein soll, gehören beide hinein.** Ein Lernblatt hat damit elf Aufgabenarten (zehn Typen, `choice` doppelt), ein Blatt mit klausurnahen Typen dreizehn.

**Im Showcase steht jede Aufgabenart genau einmal — das ist eine Regel für die VORLAGE, nicht für einen echten Kurs.** Die beiden Hefte in `src/` haben je elf Aufgaben, weil sie Kopiervorlage sind: ein zweites Beispiel derselben Art zeigt nichts Neues und verlängert nur, was man durchliest. Ein echtes Heft nimmt selbstverständlich mehrere Aufgaben je Art — dort entscheidet der Stoff über die Zahl, nicht die Vollständigkeit der Liste.

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
{ id: 10, type: 'choice', multi: true, difficulty: 'schwer',
  eyebrow: 'Teil 2 · Mehrfachauswahl', title: 'Kurzer Titel',
  prompt: 'Welche Aussagen treffen zu?',
  options: [{ text: '…', correct: true }, { text: '…', correct: true },
            { text: '…', correct: false }, { text: '…', correct: false }],
  /* … feedback, wrongNote, deep wie oben … */ }
```

Die Mehrfachauswahl braucht **mindestens zwei richtige** Optionen — mit einer einzigen ist sie eine verkleidete Einfachauswahl, und `validate.js` meldet das. Nimm sie dort, wo mehrere Eigenschaften gleichzeitig gelten; eine Einfachauswahl müsste dann eine davon zur einzigen erklären und wäre fachlich falsch.

```js
{ id: 9, type: 'calc', difficulty: 'schwer', /* … */
  given: [{ label: 'Spitzenlast', value: '78 000 MW' }],
  steps: [{ label: 'Nötige Leistung', formula: 'P = P<sub>max</sub> · 1,2',
            answer: 93600, tol: 500, unit: 'MW',
            hint: 'Spitzenlast plus ein Fünftel.' }] }
```

## `reverse` — die Antwort steht, die Frage wird gesucht

*Ergänzt am 11.09.2026.*

```js
{ id: 10, type: 'reverse', difficulty: 'schwer',
  eyebrow: 'Teil 2 · Umkehrfrage', title: 'Zu welcher Frage gehört dieser Wert?',
  prompt: 'Ordne jedem Wert die <span class="hl">Frage</span> zu, auf die er die Antwort ist.',
  items: [
    { answer: '20 ms',  question: 'Wie lang ist die Periode einer Schwingung mit 50 Hz?' },
    { answer: '150 Hz', question: 'Welche Frequenz hat die dritte Harmonische von 50 Hz?' }
  ],
  pool: ['Welche Frequenz hat die zweite Harmonische von 50 Hz?',
         'Wie viele Nulldurchgänge hat ein Sinus je Periode?'],
  feedback: '…', wrongNote: '…', deep: '…' }
```

**Alle Fragen aller Zeilen stehen in EINEM Auswahlfeld**, gemischt, dazu die Distraktoren aus `pool`. Das ist der ganze Unterschied zu einer Auswahlaufgabe je Zeile: was in einer Zeile gewählt wird, fehlt in der nächsten, und deshalb müssen die Zeilen gegeneinander abgewogen statt einzeln geraten werden. Bewertet wird **anteilig** — jede richtige Zeile zählt.

Wofür der Typ da ist: an einem Messgerät, in einer Leitwarte, in einer Klausurangabe steht eine Zahl, und niemand sagt dazu, was sie beantwortet. Wer die Frage zu einem Wert nicht rekonstruieren kann, kann den Wert auch nicht prüfen — und eine ungeprüfte Zahl wandert unbemerkt durch die ganze Rechnung. Nimm den Typ für Kennzahlen, Grenzwerte, Normwerte und Einheiten; nimm ihn **nicht** für Definitionen, das kann `dnd` besser.

Regeln, die `validate.js` erzwingt: mindestens zwei Zeilen, keine Frage und keine Antwort doppelt, kein `pool`-Eintrag, der eine der Fragen wiederholt (sonst gäbe es zwei richtige Optionen), mindestens zwei Distraktoren, kein Markup und kein Fettdruck in den Fragen — sie werden über `textContent` gesetzt und erschienen sonst als sichtbarer Quelltext. Höchstens sechs Zeilen: ein Auswahlfeld mit mehr Optionen liest niemand mehr.

## `result` — nur das Endergebnis

*Ergänzt am 27.08.2026 für die Intensivkurse des Infosec-Bootcamps.*

```js
{ id: 1, type: 'result', exam: true, difficulty: 'schwer', /* … */
  given: [{ label: 'Jahresenergie', value: '3 942 000 kWh' },
          { label: 'Höchstlast',    value: '900 kW' }],
  fields: [
    { kind: 'number', label: 'Volllaststunden', answer: 4380, tol: 1, unit: 'h' },
    { kind: 'hex',    label: 'Zielbyte',        answer: 'AF' },
    { kind: 'text',   label: 'Name des Kennwerts', answer: 'Gleichzeitigkeitsfaktor',
      aliases: ['g'] }
  ],
  verify: [{ field: 0, kind: 'quotient', args: [3942000, 900] }],
  solution: ['Erster Schritt …', 'Zweiter Schritt …'] }
```

Drei Feldarten, jede mit ihrer eigenen Normalisierung: `number` vergleicht mit `tol` (Pflicht, darf 0 sein), `hex` ignoriert Groß-/Kleinschreibung und ein `0x`-Präfix, `text` vergleicht kleingeschrieben und akzeptiert zusätzlich jedes `aliases`-Wort. Teilpunkte gibt es je richtigem Feld.

`solution` ist ein **Array von Schritten** und Pflicht. Es wird erst in `reveal()` erzeugt — vor der Abgabe steht der Weg nicht einmal im DOM, ein Blick in die Entwicklerwerkzeuge verrät also nichts. Bei `exam: true` sind `hint` und `formula` verboten; `validate.js` bricht sonst ab.

**`verify` ist keine Höflichkeit, sondern der Kern des Typs.** Weil das Blatt keinen Weg zeigt, ist die hinterlegte Zahl die einzige Wahrheit, die es kennt — und der Selbstlauf trägt genau diese Zahl ein und bestätigt sich selbst. Ein Tippfehler in `answer` fällt damit **keiner** der Browserprüfungen auf. Deshalb rechnet `tools/intensive-answer-check.mjs` jedes Feld mit `kind: 'number'` oder `'hex'` mit einer zweiten Implementierung nach, und ein Feld ohne `verify`-Regel macht den Lauf ROT.

Die kursunabhängigen Rechenmethoden sind `sum`, `diff`, `product`, `quotient`, `power`, `mean`, `percent`, `round` — und `literal` als die eine Regel ohne Beweiswert, für Werte, die man nur ablesen kann. Fachmethoden eines Kurses kommen in den markierten Block darunter, nicht in den oberen.

## `paper` — auf Papier lösen, dann selbst bewerten

```js
{ id: 4, type: 'paper', difficulty: 'schwer', /* … */
  timebox: '8 Minuten',
  checklist: ['Erstes Kriterium …', 'Zweites Kriterium …'],
  solution: { image: 'assets/img/schema.svg', alt: '…', html: '<p>…</p>' } }
```

Ablauf: Zeitvorgabe lesen, auf Papier arbeiten, **„Eigene Bearbeitung abgeschlossen"** drücken — erst dieser Knopf baut Musterlösung und Prüfliste auf. Danach wird jedes Kriterium mit *erfüllt* oder *abweichend* bewertet; die Punkte sind der Anteil der erfüllten Kriterien. Mindestens zwei Kriterien, und `solution` braucht Bild **oder** Text.

Zwei Dinge daran sind Absicht: der Prüfknopf **sperrt**, solange ein Kriterium unbewertet ist (`control.isReady()`, Meldung „Bitte zuerst alle Kriterien bewerten") — eine halb ausgefüllte Selbstbewertung wäre eine Note ohne Grundlage. Und es gibt **keinen Zweitversuch**: die eigene Zeichnung liegt vor, ein zweiter Durchgang wäre nur ein Umkreuzen.

## Zweitversuch — wer bekommt eine zweite Chance?

Die Regel steht als reine Funktion in `engine.js` (`WB.allowsRetry`) und wird von `tools/intensive-types-check.mjs` geprüft. Ein Zweitversuch (halbe Punkte) gibt es, **außer**:

| kein Zweitversuch bei | Grund |
|---|---|
| blattweitem `klausur` | in einer Prüfung gibt es keinen, und die Rückmeldung verrät vorher ohnehin nichts |
| `retry: false` an der Aufgabe | ausdrücklich abgeschaltet |
| `type: 'estimate'` | ein zweiter Schätzversuch ist reines Ausprobieren am Regler |
| `type: 'paper'` | die eigene Zeichnung liegt vor; ein zweiter Durchgang wäre Umkreuzen |
| `exam: true` — **außer** bei `type: 'result'` | eine Ergebnisaufgabe im Lernblatt bleibt eine Lernaufgabe: `exam` verbirgt dort nur den Weg. Erst der blattweite Klausurmodus schaltet die zweite Chance ab |

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
- Bei `calc`: **keine Formel in der Schrittbeschriftung.** Sie steht in `formula` und erscheint erst nach einem Fehlversuch — eine Formel im `label` hebelt das von vorn wieder aus.
- Bei `reverse`: keine Frage und keine Antwort doppelt, kein `pool`-Eintrag, der eine Frage wiederholt.
- Nummerierung lückenlos ab 1 über alle Teile hinweg.

**Hinweise — nachdenken:**
- Antwortlängen ähnlich (Spreizung ≤ 1,7×), und **die längste Antwort ist nicht die richtige**. Wer nichts weiß, klickt die längste; das darf nicht funktionieren. In der alten Fassung war das in vier von zwölf Aufgaben der Fall.
- Mindestens 45 % der Aufgaben `schwer` — die Regel lautet „die Hälfte", 45 % lässt Luft bei ungerader Aufgabenzahl.
- Mindestens vier Aufgabentypen.
- Ein Feld `minutes` im Blatt. Es wird nicht mehr gelesen — siehe *Keine geschätzten Zeiten*.
- **Leiterform:** die richtigen Antworten der Einfachauswahlen rücken über das Blatt hinweg um je eine Position weiter — oder stehen alle auf derselben. Siehe unten.
- Ein `calc`-Schritt ohne `formula`: beim Fehlversuch gibt es dann nur den Tipp.

## Vier Regeln gegen das Raten

*Ergänzt am 11.09.2026. Alle vier kommen aus Korrekturen, die ich an einzelnen Bootcamps beauftragt habe — sie standen nirgends, also mussten sie jedes Mal neu gesagt werden.*

**1 · Nichts steht an seinem Platz.** Bei einer Zuordnung (`dnd`) dürfen die Karten im Vorrat nicht in derselben Reihenfolge liegen wie die Begriffe daneben — sonst ist die Aufgabe schon gelöst, bevor sie gestellt wurde. Das erledigt seit dem 11.09.2026 die Engine: `versetzt()` mischt, bis **kein einziges** Element mehr an seiner Ausgangsstelle liegt. Reiner Zufall reicht dafür nicht — bei drei Paaren liefert er in einem von sechs Fällen genau die Ausgangsreihenfolge zurück. Dasselbe gilt für `order`, wo die Engine die Liste dreht, falls der Zufall die richtige Reihenfolge trifft.

**2 · Keine Leiterform bei Auswahlaufgaben.** Aufgabe 1 hat A, Aufgabe 2 hat B, Aufgabe 3 hat C: wer das Muster bemerkt, löst den Rest ohne Fachwissen. `engine.js` mischt die Optionen zwar bei jedem Laden neu, die Leiter ist auf dem Bildschirm also nicht zu sehen — `validate.js` meldet sie trotzdem, und zwar aus zwei Gründen: sie steht in der Datei, wo der Autor sie liest und für Absicht hält, und sie ist das sichere Zeichen dafür, dass die Aufgaben aus einem Muster erzeugt und nicht einzeln durchdacht wurden. Dasselbe gilt für den umgekehrten Fall, alle richtigen Antworten auf derselben Position.

**3 · Antwortmöglichkeiten sind ähnlich lang.** Die ausführlichste Option ist fast immer die richtige, weil sie die Einschränkungen mitnennt, die eine richtige Aussage nun einmal braucht. Wer nichts weiß, klickt die längste — und liegt damit systematisch richtig. `validate.js` meldet eine Spreizung über 1,7× und zusätzlich den Fall, dass die längste Option die richtige ist. Die Lösung ist nicht, die richtige zu kürzen, sondern die Distraktoren auf dieselbe Ausführlichkeit zu bringen.

**4 · Kein Fettdruck in Antwortmöglichkeiten.** Er zieht das Auge hin und verrät sie, auch wenn er fachlich gemeint war. Im Aufgabentext, in der Rückmeldung und in der Vertiefung ist Fettdruck erwünscht; in den Optionen nie. `validate.js` behandelt das als FEHLER, nicht als Hinweis.

**Und die fünfte, die kein Ratehindernis ist, sondern ein Abschreibhindernis:** bei `calc` steht am Anfang **keine Formel**. Sie erscheint zusammen mit dem Tipp erst nach einem Fehlversuch, und sie wird dann erst gebaut — vorher steht sie nicht einmal im Seitenquelltext. Eine Aufgabe, die die Formel gleich mitliefert, prüft Einsetzen und nicht Rechnen; eine, die sie nach dem ersten Fehlversuch gibt, prüft erst das Können und hilft dann beim Lernen. Genau in dieser Reihenfolge.

## Keine geschätzten Zeiten

*Regel vom 10.09.2026. Sie ersetzt eine Gewohnheit, die das Rahmenwerk von Anfang an hatte.*

**Schreibe nirgends hin, wie lange etwas dauert.** Kein „~45 Min" im Seitenkopf, keine Minuten im `chapter__tag` einer Lab-Etappe, keine Dauer auf einer Lernplan-Kachel, kein `minutes` in `src/startseite.data.js` oder in `WB.register`. Das Feld ist aus dem Rahmenwerk heraus: `hub.js` und `engine.js` lesen es nicht mehr, `validate.js` meldet es, wenn es wieder auftaucht.

Der Grund ist nicht Ästhetik. Diese Zahlen waren **geraten** und lagen regelmäßig daneben — und eine falsche Zeitangabe ist schlimmer als keine. Sie macht aus einem normalen Nachmittag ein Versagen: wer für die „45 Minuten" zwei Stunden braucht, hört auf, weil er sich für langsam hält, und nicht, weil die Schätzung falsch war. Der frühere Standardwert von 45 Minuten in `engine.js` war dabei der schlimmste Fall — eine Zahl, die niemand geschätzt hatte und die trotzdem im Kopf jeder Seite stand.

**Was stattdessen dort steht, ist eine Tatsache:** Aufgabenzahl und Punkte beim Aufgabenheft, die Kapitelzahl beim Fachartikel, die Etappenzahl beim Lab. Das rendert `engine.js` von selbst; bei einer statischen Seite schreibst du es hin. Wie lange jemand braucht, sagt ihm der Fortschritt, während er arbeitet — und der lügt nicht.

**Eine vorgeschriebene Zeit ist etwas anderes und bleibt.** `klausur.minuten` ist die Dauer der echten Prüfung, `task.timebox` die Zeitvorgabe einer Papieraufgabe. Beides ist Teil der *Aufgabenstellung* und keine Schätzung: es sagt nicht „so lange wirst du brauchen", sondern „so lange hast du". Dasselbe gilt für Zeiten, die **fachlicher Inhalt** sind — „die Sekundärregelung greift innerhalb von Minuten" ist eine Antwort, keine Ankündigung. Der Lernplan darf Tage verteilen; er nennt nur keine Dauer je Tag.

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

Deutsche Komposita sind der Regelfall, nicht die Ausnahme. Fünf Regeln, jede vom Prüfwerkzeug gefunden:

1. **`overflow-wrap: anywhere`, nicht `break-word`.** Nur `anywhere` fließt in die `min-content`-Breite ein. `break-word` bricht um, lässt die Spalte aber so breit wie das längste Wort — und schneidet den Rest ab.
2. **`minmax(0, 1fr)` statt `1fr`** in jedem Raster. Ein `fr`-Track darf nicht unter seinen `min-content` schrumpfen; ein `auto`-Track wird so breit wie die längste Option eines `<select>`.
3. **`min-width: 0` an jedem Flex- und Grid-Kind, das Text trägt.** Und wenn das Kind **anonym** ist — Text direkt im Flex-Container neben einem `::before` —, kannst du es nicht ansprechen: dann muss der Container ein **Raster** mit `minmax(0, 1fr)` werden. So gefunden an `.reveal > summary`.
4. **`<select>` braucht `max-width: calc(100% - 2·margin)`.** Ein Auswahlfeld wächst von sich aus auf die Breite seiner längsten Option und kennt keine Obergrenze. Und den Außenabstand abziehen, sonst bleibt genau der als Überstand stehen.
5. **Jeder Textbehälter braucht die Behandlung, bevor jemand ihn benutzt** — nicht erst, wenn ein Modul auffliegt. `.callout`, `.lead-in` und `.etappe-ende` haben nacheinander denselben Fehler gezeigt: sie standen jahrelang mit Fließtext drin, der an Leerzeichen bricht, und beim ersten langen Token (`ArrayIndexOutOfBoundsException`, `Zusammenhangskomponenten`) schoben sie die Seite waagerecht — unsichtbar, weil ein Flex- oder Grid-Container nicht scrollt. **Ein `<wbr>` im Text ist eine Bitte an den Autor, keine Regel.** Behandle den Behälter.

Regel 5 in einem Satz: **jede der drei Fundstellen war derselbe Fehler**, nur in einer anderen Klasse. Wenn du eine neue Klasse einführst, die Text trägt, gib ihr `min-width: 0` und `overflow-wrap: anywhere` sofort mit.

**Ein Breakpoint darf den Inhalt nicht verengen.** Wächst die Seitenleiste an einer Grenze von 248 auf 312 px, hat der Inhalt jenseits der Grenze *weniger* Platz als davor. Prüfe deshalb immer eine Breite **kurz vor und kurz nach** jedem Breakpoint. Genau dort ist ein Teilkopf abgeschnitten, unsichtbar, weil ein Flex-Container nicht scrollt.

**Geprüft wird bis 320 px, nicht bis 768.** Ein iPhone SE hat 375 px, ein altes Android 360, und mit vergrößerter Schrift landet man effektiv bei 320.

---

# Fallstricke in engine.js und lehrkurs.js

Vier Dinge, die man nicht sieht und die still das Falsche tun. Alle vier sind nachgemessen, nicht vermutet.

**`engine.js` leert den ersten `.nav` in der Seitenleiste.** Es holt sich `$('.nav', railEl)` und setzt `innerHTML = ''`. Statisches Markup in diesem Element ist beim Rendern der Aufgabenliste weg. Deshalb gehört ein Wegweiser in einen **klassenlosen `<div>` davor** — klassenlos, weil Prüfung 4 sonst eine Regel für die Klasse verlangt.

**`engine.js` entfernt `is-active` von *allen* `.nav__task`.** Zeile 1469: `$$('.nav__task.is-active').forEach(n => n.classList.remove('is-active'))` — ohne Scope. Ein festverdrahtetes `is-active` außerhalb der Aufgabenliste ist beim ersten Klick gelöscht. Markiere den aktuellen Schritt deshalb über **Text** (`▸` und `<b>`) plus `aria-current="page"`. Das überlebt jedes Skript.

**`lehrkurs.js` fasst nur `.rail .nav__task[href^="#"]` an.** Links auf andere `.html`-Dateien sind sicher — das ist der Grund, warum der Wegweiser überhaupt in derselben Seitenleiste stehen darf.

**`matrix` rendert Radios oder Checkboxen je Zeile, abhängig von der Zahl der richtigen Kreuze.** Eine Zeile mit einem Kreuz wird zu Radios, eine mit mehreren zu Checkboxen. **Gemischte Zeilen verraten damit, welche Zeile mehrere Antworten hat.** Gib entweder allen Zeilen genau ein Kreuz oder allen mehrere.

Dazu zwei Dinge, die kein Skript betreffen, aber dieselbe Sorte Ärger machen:

**Inline-SVG bricht Prüfung 4.** Die Klassen im `<style>`-Block einer eingebetteten SVG zählen als benutzte Klassen und brauchen dann Regeln in `styles.css`. Lege Schemata als **externe Datei** in `assets/img/` und binde sie mit `<img>` ein — dann sind ihre Klassen unsichtbar für die Prüfung. Die Farben kommen dort als Literal aus `colorpalett.css`, weil eine per `img` geladene SVG die CSS-Variablen des Dokuments nicht sieht.

**Ein langes Token in einem `prompt` bricht bei 320 px.** Ein `<code>[/1.168.192.in-addr.arpa/]192.168.1.1</code>` in einem Fließtext hat keine Bruchstelle. Setze ein `<wbr>` an die logische Stelle oder nimm den Wert in einen `.term`-Block, der scrollt.

---

# Prüfen, bevor „fertig" gesagt wird

```
pwsh tools/bootcamp-check.ps1
pwsh tools/bootcamp-check.ps1 -Pages Fachartikel,index
```

Acht Prüfungen, Exitcode 0 oder 1:

0. **Syntaxprobe** — `node --check` über jede `.data.js`, **vor** dem Browser. Ohne sie meldet ein Parse-Fehler nur „kein Blatt angemeldet", und die Ursache ist aus dieser Zeile nicht zu erraten. Fehlt Node, wird übersprungen.
1. **Selbstlauf** — jedes Blatt löst sich über echte Klicks selbst durch. Erwartet: Höchstpunktzahl, alle Aufgaben gelöst, alle Auszeichnungen, keine Konsolenfehler. Findet falsch hinterlegte Lösungen und kaputte Verdrahtung.
2. **Redaktion** — `validate.js` an jedem Aufgabenobjekt.
3. **Breiten** — 320 bis 1340 px in echten iframe-Viewports, im ungelösten **und** im aufgelösten Zustand. Der aufgelöste ist der breitere: Rückmeldung, Vertiefung, Zonenlegende und Lösungswerte kommen erst nach dem Prüfen dazu.
4. **Klassen** — jede im Markup benutzte CSS-Klasse muss eine Regel haben.
5. **SVG** — jede Datei in `assets/img/` muss wohlgeformtes XML sein, und ein `<style>` ohne `CDATA`-Klammer setzt einen Hinweis. Ein einziges spitzes Zeichen im CSS oder in einem Kommentar sorgt sonst dafür, dass der Browser die Datei **gar nicht** dekodiert und das Bild leer bleibt.
6. **Kursschlüssel** — jede Seite mit Engine muss `<meta name="wb-course">` tragen, alle denselben Wert, und kein Dateiname darf doppelt vorkommen. Siehe *Der Lernstand überlebt den Umzug*.
7. **Rahmenwerk und klausurnahe Aufgaben** — vier Node-Prüfungen ohne Browser, plus zwei, die nur bei vorhandener Probeklausur laufen. *Ergänzt am 28.08.2026, verallgemeinert am 10.09.2026.* Sie existieren, weil der Selbstlauf sie strukturell nicht ersetzen kann: er trägt die hinterlegte Lösung ein und bestätigt sich damit selbst, und er löst die Auto-Abgabe aus, bevor jemand den Zwischenzustand sehen könnte.

   | Prüfung | findet |
   |---|---|
   | `intensive-types-check.mjs` | Bewertung und Zweitversuch-Regeln der Engine — die reinen Funktionen, ohne DOM |
   | `intensive-answer-check.mjs` | jedes `result`-Endergebnis, unabhängig nachgerechnet. Ein Feld ohne `verify` ist ROT |
   | `file-progress-sync-check.mjs` | die Speicherbrücke: erreicht ein Modulstand von 14/16 die Übersicht? |
   | `hub-progress-check.mjs` | die Fortschrittsbalken der Übersicht, inklusive `tasks` als Nenner |
   | `probeklausur-quality-check.mjs` | Dauer, Punktsumme, Punkte je Aufgabe, Quellenangaben, kein `hint`/`formula` |
   | `exam-coverage-check.mjs` | ob die Abdeckungskarte hält, was sie behauptet |

   Die letzten beiden lesen ihre Erwartungen aus `tools/klausurphase.config.mjs`. Ist die leer — Bootcamp ohne Prüfungstermin —, melden sie „keine Erwartungen hinterlegt" und enden grün. Das ist der Normalfall bei `NeuesThema.md` und kein Fehler.

**Zwei Fallen im Aufruf, beide sind schon zugeschnappt:**

- **Der Standardlauf findet nur Blätter, also Seiten mit einer `.data.js`.** Reine Leseseiten — Fachartikel, Labs, Anleitung, Lernplan, Abdeckungskarte, Übersicht — müssen über `-Pages` mitgegeben werden, sonst werden sie *stillschweigend nicht geprüft*. Der Lauf bleibt grün und prüft weniger. Für den Showcase heißt das:

  ```
  pwsh tools/bootcamp-check.ps1 -Pages index,Anleitung,Modul_01_Signale_Lehrkurs,Modul_01_Signale_Lab,Modul_02_Verbundnetze_Lehrkurs,Modul_02_Verbundnetze_Lab,Klausurphase/Lernplan,Klausurphase/Abdeckung
  ```

- **Der Kursordner wird erkannt, nicht festgeschrieben.** Gesucht wird der Ordner, in dem `assets` liegt: erst `src`, dann `Stylevorgabe` (der alte Name), sonst das Wurzelverzeichnis selbst. Eine Seite wird im Kursordner gesucht und, falls sie dort nicht liegt, im Wurzelverzeichnis — das ist der Fall `startseite.html`, die zum Kurs gehört und eine Ebene über seinen Blättern liegt. Seit dem 11.09.2026 findet das Werkzeug auch die **Leseseiten** selbst: jede `*.html`, die `styles.css` lädt und kein Blatt ist, läuft ohne `-Pages` durch Breiten- und Klassenprüfung.
- **Blätter dürfen eine Ebene tiefer liegen** (`Klausurphase/Probeklausur`); der Autofund durchsucht Unterordner mit. Nach jedem Verschieben trotzdem die Zeile `Blätter :` im Kopf lesen und die Blätter zählen. Eine Datei zu verschieben ist billig, sie aus einer Prüfung fallen zu lassen ist teuer und unsichtbar.

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
- bei einer `paper`-Aufgabe: erscheint die Musterlösung wirklich erst nach dem Knopf, und sperrt der Prüfknopf, solange ein Kriterium unbewertet ist?
- im Klausurmodus: der **Zwischenzustand**. Der Selbstlauf beantwortet alles und löst damit die Auto-Abgabe aus — er beweist die Endzustände, nicht den Zustand dazwischen. Dass eine beantwortete Aufgabe ihre Lösung noch verbirgt, muss von Hand oder mit einem Wegwerf-Prüfstand nachgesehen werden. **Fallstrick dabei:** `engine.js` mischt die Antwortoptionen — ein Prüfskript darf die richtige Antwort nicht über den Index der Datenoptionen ansteuern, sondern über den angezeigten Text.

Und einmal am Ende: **`assets/` mit einem Blatt eine Ebene höher kopieren und erneut per Doppelklick öffnen.** Die relativen Pfade müssen unverändert greifen — **und der Lernstand muss mitkommen**, siehe die nächste Regel.

---

# Der Lernstand überlebt den Umzug

*Ergänzt am 15.08.2026 nach einem gemeldeten Fehler. Er hatte zwei Jahre Bestand und ist keinem aufgefallen, weil er nur beim Verschieben zuschlägt.*

**Jede Seite mit Engine nennt ihren Kurs:**

```html
<meta name="wb-course" content="AuD">
```

Daraus bildet `engine.js` den Schlüssel `wb:AuD/Modul_01_Grundlagen.html:progress`.

## Warum das nicht der Pfad sein darf

Der Schlüssel enthielt vorher den **vollen Dateipfad**. Das war die Überkorrektur zu einem echten Problem — dieses Rahmenwerk wird in jeden Modulordner geklont, und zwei Kurse mit einem `Modul_01_Grundlagen.html` hätten sich sonst die Stände überschrieben.

Nur baut der volle Pfad einen schlimmeren Fehler: **er macht das Bootcamp unverschiebbar.** Wer den Ordner umbenennt, eine Ebene tiefer legt, auf einen zweiten Rechner kopiert oder ihn über einen anders geschriebenen Pfad öffnet, verliert **lautlos** jeden Stand. Die Blätter melden „noch nicht begonnen", die Übersicht 0 %, und nichts deutet darauf hin, dass die Daten noch da sind.

Nachgewiesen mit einer identischen Kopie desselben Ordners an einem anderen Ort: `readFor(...) = NULL`, Karte „noch nicht begonnen", Balken 0 %. Nach der Umstellung: derselbe Stand, `5 von 14 gelöst`, Balken 29 %.

Kurs + Dateiname löst beides: der Kursname trennt die Kurse, der Dateiname die Blätter, und **keins von beidem hängt am Ablageort**.

## Zwei Bedingungen

- **Zwei Blätter eines Kurses dürfen nicht gleich heißen** — auch nicht in verschiedenen Unterordnern, denn der Schlüssel trägt nur den Dateinamen. `tools/bootcamp-check.ps1` prüft das.
- **Fehlt die `meta`-Angabe, fällt der Speicher still auf den Pfadschlüssel zurück.** Die Seite läuft, ist aber wieder unverschiebbar. Auch das prüft das Werkzeug — als Hinweis, damit ältere Kurse nicht rot werden.

## Die Speicherbrücke

*Ergänzt am 27.08.2026. Fehlerbild: Modul 01 zeigt 14 von 16, die Übersicht weiterhin „nicht begonnen".*

Die Ursache war nicht der Schlüssel, sondern `file://` selbst. Chromium darf jede lokale Datei in einen **eigenen, opaken Ursprung** legen — dann kann `startseite.html` den Speicher von `Modul_01.html` schlicht nicht lesen, egal wie der Schlüssel heißt. Ein korrekt gebildeter Schlüssel ist also notwendig und nicht hinreichend.

`postMessage` funktioniert zwischen solchen Seiten trotzdem; das nutzt die Breitenprüfung längst. Also: die Übersicht lädt jedes Aufgabenblatt kurz unsichtbar als `iframe` mit `#wb-store-bridge=<Token>`, das Blatt liest seinen **eigenen** Speicher und meldet ihn nach oben, und der Index prüft Token, Fenster, Kurs und Dateiname, bevor er den Stand übernimmt.

Vier Entscheidungen daran sollte man nicht aufrollen:

- **Nullstände löschen nie etwas.** Ein leerer oder gesperrter Modulspeicher darf einen bereits importierten Stand auf der Übersicht nicht vernichten.
- **Das Kind antwortet direkt nach `engine.js`**, nicht erst nach dem Rendern: `WB.register` bricht als Speicherlieferant sofort ab. Ein unsichtbares iframe muss keine Aufgaben zeichnen.
- **1 800 ms Zeitlimit.** Lokale Dateien antworten sofort; das Limit verhindert, dass ein fehlendes Blatt die Übersicht festhält.
- **Neu geladen wird nur, wenn wirklich ein neuer Stand ankam.** Sonst hätte man eine Seite, die sich bei jedem Öffnen einmal selbst neu lädt.

Geprüft von `tools/file-progress-sync-check.mjs` — mit genau dem realen Fehlerfall: Modul kennt 14 von 16, Index zunächst keine.

## Übernahme

Liegt unter dem Kursschlüssel nichts, sucht der Speicher **einmalig** den alten Pfadschlüssel mit demselben Dateinamen und schreibt ihn um. Damit überlebt ein vorhandener Stand sowohl die Umstellung als auch einen Umzug, der ihn bereits verwaist hat.

Gibt es **mehrere** alte Treffer, wird nichts übernommen. Dann lägen Stände zweier Orte vor, und zu raten welcher gemeint ist, wäre schlimmer als der leere Stand. Der alte Eintrag wird nicht gelöscht — er kostet nichts und ist die Sicherheitskopie.

---

---

# Zwei optische Register

Die **Übersicht** (`startseite.html`) ist ein Inhaltsverzeichnis und soll ruhig sein: kein Rauschfilm, keine 100-px-Serifen, keine Initiale. Die redaktionelle Anmutung beginnt erst **in** einem Blatt oder Artikel, wo sie den Lesefluss trägt. Wer beides gleich laut macht, nimmt der Lektion ihren Auftritt.

Praktisch: die Übersicht bekommt `<body class="is-hub">`, ein Blatt nicht.

---

# Navigation

Sobald ein Modul aus mehr als einer Seite besteht, muss auf **jeder** davon zwei Fragen ohne Nachdenken beantwortbar sein: *Wo bin ich im Kurs?* und *Wo bin ich in diesem Modul?* Sonst zerfällt das Projekt in lose Seiten, und man weiß nach dem dritten Klick nicht mehr, was noch aussteht.

**Wo bin ich im Kurs** beantwortet die Seitenleiste oben und die Übersicht:

| Stelle | Inhalt |
|---|---|
| `brand__mark` | der Kursname, auf allen Seiten gleich |
| `brand__name` | **die Modulnummer**, nicht das Thema |
| `brand__sub` | Thema · Modul *n* von *m* |
| `masthead__rule` links | Modul *n* · Schritt *k* von *j* · Seitentyp |
| `rail__foot` | ein Link zur Übersicht, beschriftet mit der Position |
| Übersicht | eine Tabelle **aller** Module mit Stand, das aktuelle markiert |

Auf einem Aufgabenheft ist der Masthead generiert; die Positionszeile kommt dort aus `level` und `kind` der `.data.js` — `level: 'Modul 02 · Schritt 2 von 3'`, `kind: 'Aufgabenheft'`.

**Wo bin ich im Modul** beantwortet ein Wegweiser-Block, der auf allen drei Seiten des Moduls **bytegleich** ist. Nur der aktive Schritt unterscheidet sich:

```html
<div>
  <div class="nav__group">Dein Weg durch Modul 02</div>
  <a class="nav__task" href="…_Lehrkurs.html"><span class="nav__num">1</span><span class="nav__label">Lehrkurs lesen</span></a>
  <a class="nav__task" href="…html" aria-current="page"><span class="nav__num">▸</span><span class="nav__label"><b>Aufgaben lösen</b></span></a>
  <a class="nav__task" href="…_Lab.html"><span class="nav__num">3</span><span class="nav__label">Lab: Das Sieb bauen</span></a>
</div>
```

**Er steht ÜBER `<nav class="nav">`, nicht im `rail__foot`.** *Korrigiert am 10.09.2026: im Showcase stand er zuerst unten und galt für den ganzen Kurs statt für das Modul.* „Wo bin ich im Modul" ist die Frage, die VOR den Aufgaben kommt — unten im Fuß, nach zwanzig Aufgabenpunkten, liest sie niemand. Und er zeigt die drei Teile **eines Moduls**, nicht die Module des Kurses: das beantwortet schon die Übersicht.

Der dritte Eintrag trägt den **Namen** des Labs („Lab: Das Sieb bauen") und nicht das Wort „Lab". Er ist der Schritt, den man am ehesten überspringt; ein Titel, der sagt, was dort passiert, ist die einzige Gegenwehr.

Zwei weitere Details sind nicht Geschmack, sondern Zwang — beide stehen unten bei den Fallstricken: der **klassenlose Wrapper** und die Markierung des aktiven Schritts über **Text statt Klasse**.

Erzeuge den Block **einmal und setze ihn dreimal ein**, statt ihn dreimal zu schreiben. Sonst laufen die Fassungen beim nächsten Modul auseinander, und die Navigation ist genau das, was das nicht verträgt.

**Die Übersicht empfiehlt zu jedem Zeitpunkt genau einen nächsten Schritt.** Vierzehn gleichberechtigte Kacheln sind eine Entscheidung, die ich nicht treffe — und dann mache ich gar nichts.

## Gruppen auf der Übersicht

*Ergänzt am 14.08.2026, als das AuD-Bootcamp auf 27 Kacheln gewachsen war — man sieht sie alle und erkennt nichts.*

Einträge mit gleichem `group` **in Folge** bilden einen Abschnitt mit eigener Überschrift, eigenem Fortschritt und eigener Punktesumme:

```js
WB.hub({
  groups: {                                    // optional
    'Vorab':            { label: 'Bevor du anfängst' },
    'Modul 01 · Thema': { step: true, note: 'Lesen, üben, programmieren' }
  },
  entries: [{ file, kind, title, desc, tasks, points, group: 'Vorab' }]
});
```

**`tasks` je Eintrag ist Pflicht für jedes bewertbare Blatt.** *Korrigiert am 27.08.2026.* Der Balken zeigt **bearbeitete Aufgaben**, nicht den Punktestand — ein Balken, der beim ersten Fehler zurückfällt, entmutigt genau dann, wenn Ermutigung nötig wäre. Und `tasks` hat Vorrang vor dem gespeicherten Stand: sonst steht nach einer Kurserweiterung die alte Aufgabenzahl im Nenner, der Balken zeigt 100 %, und die beiden neuen Aufgaben sind unsichtbar. Fehlt das Feld an einem einzigen Blatt, fällt der Gesamtstand auf einen Mittelwert über die Blätter zurück und die Zeile „x von y Aufgaben" verschwindet — das sieht man der Seite nicht an.

- `step: true` → Kopfzeile „Schritt *n* von *m*", **gezählt nur über die Gruppen mit diesem Feld**. Anleitung, Lernplan und eine Abschlussprüfung sind keine Etappe des Wegs und bekommen ein festes `label`.
- `note` → ein Satz unter dem Titel. Nutze ihn für den Grund, *warum* die Gruppe an dieser Stelle steht — das ist die Information, die eine Kachelwand nie transportiert.
- **Fehlt `group` überall, rendert die Seite wie vorher als eine Wand.** Ältere Kurse laufen unverändert; auch keine Startseite muss angefasst werden.

**Die Bedingung, die den Entwurf bestimmt:** gruppiert wird über *aufeinanderfolgende Läufe*, nicht durch Einsammeln nach Namen. Die Weiter-Karte nimmt `rows.filter(offen)[0]`, und diese Reihenfolge **ist** die empfohlene Lernreihenfolge. Ein `entries.filter(e => e.group === g)` hätte funktioniert und wäre falsch gewesen: es kann einen Eintrag vorziehen, und dann schlägt die Übersicht etwas anderes vor als vorher.

Zwei Nebenwirkungen, die man mitnehmen sollte:

- Die Gruppe trägt den Modulnamen, also **wiederhole ihn nicht in jedem Kacheltitel**. Aus „Modul 05 · Bäume, vom BST bis zu den Collections" wird „Bäume, vom BST bis zu den Collections".
- Trägt der Host in einer älteren Startseite noch `class="sheets"`, ist er selbst das Kachelraster. Sobald gruppiert wird, sind seine Kinder aber Abschnitte — `hub.js` setzt die Klasse dann auf `hubgroups` um und legt das Raster eine Ebene tiefer.

---

# Labs

Ein **Lab** ist eine Hands-on-Einheit **ohne Bewertung**: eine eigene Seite, auf der man etwas baut, rechnet oder ausprobiert, mit Anleitung und Musterlösung, aber ohne Punkte und ohne Prüfknopf. Ein Lab ist Handwerk, kein Test.

Nimm ein Lab, wenn eine Fertigkeit nur durch Machen entsteht — ein Schaltbild selbst zeichnen, eine Messreihe auswerten, einen Rechenweg auf eigenen Zahlen wiederholen. Verlinke es aus der Fußnavigation der Seitenleiste des zugehörigen Blattes und trage es in `src/startseite.data.js` **ohne** `points` ein, damit es nicht in den Punktestand zählt.

Ein Lab, das an meiner Maschine nicht läuft, ist schlimmer als kein Lab — es kostet einen Abend und endet in Frust. Wenn ein Lab etwas voraussetzt, das installiert werden muss, steht die Voraussetzung oben auf der Seite, mit dem Weg drumherum, falls sie fehlt.

---

# Fachartikel

Ein Fachartikel (`Fourier_Lehrkurs.html` als Vorlage) erklärt zusammenhängend, was ein Aufgabenblatt nur abfragt. Aufbau: Kapitel als `<section class="chapter" id="k0">`, Formeln in `.eq`, Betonungen mit `.keyword`, Rechenwege als `<ol class="steps-eq">`, Merkkästen als `.callout`, Karteikarten als `.card3d`, Kontrollfragen als `<details class="reveal">`.

`lehrkurs.js` macht die Karten per Klick **und Tastatur** umdrehbar, markiert das gelesene Kapitel in der Seitenleiste und speichert den Lesefortschritt — Letzteres, damit die Übersicht einen gelesenen Artikel auch als fertig führen kann. Ein Artikel bekommt nie einen Aufgabenstand; ohne diesen Lesestand würde die Übersicht ihn für immer als „als nächstes" vorschlagen.

Ein Artikel bindet `engine.js` (nur wegen des Speichers), `viz.js`, seine Zeichnungen, `lehrkurs.js` und `audit.js` ein.

---

# Nur in der Klausurphase

*Ergänzt am 10.09.2026, weil der Showcase es sichtbar gemacht hat: drei Seiten und drei Werkzeuge des Rahmenwerks setzen etwas voraus, das es nur bei einer Prüfung gibt — einen **von außen gesetzten Umfang und einen Termin**.*

Ein Bootcamp entsteht in zwei Lagen. Bei `Klausurvorbereitung.md` liegen Unterlagen im Ordner und eine Prüfung steht an. Bei `NeuesThema.md` gibt es weder das eine noch das andere: das Thema kommt aus dem Prompt, und **kein Termin macht Druck**. Diese Bestandteile gehören ausschließlich in den ersten Fall:

| Bestandteil | setzt voraus | ohne Klausur |
|---|---|---|
| `Lernplan.html` + `Lernplan.ics` | einen Prüfungstermin, von dem aus man zurückrechnet | entfällt. Die **Reihenfolge der Übersicht** ist der Plan |
| `Abdeckung.html` | einen Prüfungsumfang, der von außen festgelegt ist | entfällt. Der Zuschnitt steht in `NeuesThema.md`, Schritt 0 |
| `Probeklausur.*` mit `klausur: {…}` | eine Prüfung, die nachgebildet werden soll | entfällt. Ein Abschlussblatt darf Rückmeldung geben |
| `Klausurzettel.md` | erlaubte Hilfsmittel in der Prüfung | entfällt. Der `Lernzettel.md` bleibt |
| `tools/probeklausur-quality-check.mjs` | eine Probeklausur | endet grün, ohne zu prüfen |
| `tools/exam-coverage-check.mjs` | eine Abdeckungskarte | endet grün, ohne zu prüfen |
| `tools/klausurphase.config.mjs` | beides | bleibt leer. **Nicht löschen** — `bootcamp-check.ps1` läuft dann unverändert |

**Baue sie nicht „vorsichtshalber" mit.** Ein Lernplan ohne Termin erfindet Druck, der nicht existiert, und eine Probeklausur ohne Klausur prüft gegen eine Prüfung, die es nicht gibt — beides untergräbt genau das Vertrauen in die Struktur, von dem ein Themen-Bootcamp lebt. Was in der Klausurphase der Termin leistet, muss dort die Struktur leisten, und Struktur heißt: eine klare Reihenfolge auf der Übersicht, sichtbarer Fortschritt und zu jedem Zeitpunkt genau ein empfohlener nächster Schritt.

Umgekehrt gilt: **fehlt in der Klausurphase einer dieser Bestandteile, ist der Auftrag nicht fertig.** Sie stehen deshalb in `Klausurvorbereitung.md` unter *Was du ablieferst* und nicht hier.

Alles Übrige im Rahmenwerk gilt in beiden Fällen — Aufgabentypen, Redaktionsregeln, Zeichenregeln, Layout, Navigation, Speicherung, Prüfung.

---

# `file://`-Zwänge

Die Blätter werden **per Doppelklick geöffnet** — kein Server, kein npm, kein Build. Daraus folgen vier Dinge, die einen Agenten sonst gegen eine Wand laufen lassen:

1. **Keine ES-Module.** `<script type="module">` scheitert von `file://` an CORS. Alles ist klassisches Skript in einer IIFE mit dem einen Namensraum `window.WB`.
2. **Kein `fetch`.** Aufgabendaten kommen als `<script src="…data.js">`, das `WB.register()` aufruft — nicht als JSON-Datei.
3. **`localStorage` teilt auf `file://` einen einzigen Ursprung.** Der Schlüssel muss deshalb Kurs **und** Dateiname enthalten — siehe *Der Lernstand überlebt den Umzug* gleich unten. Alles in `try/catch`: manche Browser sperren `localStorage` auf `file://` ganz. Dann läuft das Blatt weiter und `[data-store-warning]` sagt es.
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
