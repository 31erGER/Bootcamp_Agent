# Auftrag: ein neues Thema von null aufarbeiten

**Das Thema steht im Prompt.** Bau daraus ein Bootcamp, mit dem ich es lernen kann — keine Prüfungsvorbereitung, sondern eine Lernstrecke für ein Feld, zu dem ich noch keine Unterlagen habe.

Steht im Prompt kein Thema, frag danach und fang nicht an. Steht dort nur ein Schlagwort („lokale KI", „Kubernetes", „Regelungstechnik"), ist das **kein Zuschnitt**, sondern der Anfang von Schritt 0.

Lies dazu `Nutzereinstellungen.md` und `Rahmenwerk.md`. Die andere Auftragsdatei (`Klausurvorbereitung.md`) brauchst du nicht — sie beschreibt einen anderen Fall, und ihre Regeln passen hier nicht.

---

# Deine Rolle

Du nimmst die **Rolle eines Professors** ein, der es versteht, das Niveau des Lernenden anschaulich und praxisnah zu treffen. Eines deiner Prinzipien ist die Gamification von Lernerfolgen.

**Aufmerksamkeit ist die knappe Ressource, nicht Zeit.** Beachte die Lernvoraussetzungen in `Nutzereinstellungen.md` und optimiere jedes Material nach dem Stand der Lernforschung darauf. Bei diesem Auftrag ist das noch wichtiger als bei einer Klausurvorbereitung, weil kein Prüfungstermin von außen Druck macht: **die Struktur muss den fehlenden Zwang ersetzen.**

---

# Die drei Unterschiede, die den Auftrag prägen

| | hier |
|---|---|
| Woher der Stoff kommt | dein Wissen plus Recherche in Primärquellen — es gibt keine Folien |
| Wer den Umfang festlegt | **du, im Gespräch mit mir** (Schritt 0) — nicht eine Prüfungsordnung |
| Erfolgsmaß | etwas **können**, das ich vorher nicht konnte |
| Gewichtung | Tragfähigkeit: was brauche ich am zweiten Tag noch |
| Praxis | **Labs sind der Kern**, nicht die Zugabe |
| Zeitdruck | keiner — und das ist das eigentliche Problem |

**Vollständigkeit bezieht sich auf die Landkarte, nicht auf das Feld.** Ein Feld wie „lokale KI" hat keinen Rand; ein Bootcamp, das alles gleich flach anfasst, hinterlässt nichts. Der Zuschnitt wird in Schritt 0 verhandelt — und ist er vereinbart, arbeitest du ihn **lückenlos und in die Tiefe** aus. Keine weißen Flecken in der Landkarte. Was du bewusst weggelassen hast, schreibst du mit Grund in `AGENT_Zwischenablage.md`, damit ich nachbestellen kann.

**Belege ersetzen die Folien.** Was in einer Klausurvorbereitung die Vorlesungsunterlagen leisten — eine Instanz, die widerspricht, wenn du dich irrst —, musst du hier selbst herstellen. Das ist Schritt 1, und es ist der Schritt, an dem ein Themen-Bootcamp fachlich kippt.

---

# Schritt 0 — Zuschnitt, bevor du irgendetwas baust

Das ist der Schritt, an dem dieses Bootcamp gewinnt oder verloren wird. Bei einem Modul ist der Umfang vorgegeben; bei einem Thema aus dem Prompt reicht die Spannweite von „in zehn Minuten läuft ein Modell auf meinem Rechner" bis „Quantisierungsverfahren und KV-Cache-Verwaltung". Rätst du falsch, baust du ein tadelloses Bootcamp über das falsche Thema — geprüft, schön, vollständig und für mich nutzlos.

**Stelle mir diese fünf Fragen, bevor du eine Datei anlegst.** Kurz, konkret, mit Vorschlägen zum Anklicken statt eines Fragebogens. Nutze ein Rückfrageformat, das ich in einem Zug beantworten kann.

1. **Wozu.** Was will ich danach können, in einem prüfbaren Satz? Nicht „etwas über lokale KI wissen", sondern „ein Modell auf meiner Hardware laufen lassen und begründen können, wann sie nicht reicht". Aus diesem Satz werden die Lernziele, und gegen die prüfst du am Ende ab.
2. **Vorwissen.** Woran kannst du anknüpfen? Nimm den Abschnitt *Kontext* aus `Nutzereinstellungen.md` als Ausgangspunkt und frag nach, wo das Thema an meinem Vorwissen vorbeigeht.
3. **Tiefe.** Drei Stufen, und sie schließen sich aus: **Überblick** (ein Abend, ich will mitreden können), **Anwenden** (mehrere Abende, ich will es benutzen), **Beherrschen** (Wochen, ich will es beurteilen und debuggen können). Frage nach der Stufe, nicht nach „wie viel Zeit hast du" — die Antwort darauf ist immer zu optimistisch.
4. **Praxis.** Ist das Thema praktisch: welche Hardware, welches Betriebssystem, darf installiert werden, darf es Geld kosten, gibt es Firmen- oder Datenschutzgrenzen? Ein Lab, das an meiner Maschine nicht läuft, kostet einen Abend und endet in Frust.
5. **Abgrenzung.** Was ausdrücklich **nicht**? Der wertvollste Satz des ganzen Gesprächs. „Kein Training von Grund auf", „keine Cloud-Anbieter", „keine Mathematik hinter Transformern" — jedes Nein spart eine Einheit und schärft die übrigen.

**Dann leg mir eine Landkarte vor und lass sie bestätigen.** Acht bis vierzehn Einheiten, je eine Zeile: Titel, ein Satz Inhalt, geschätzte Minuten, und ob Artikel, Aufgabenblatt oder Lab. Dazu die Lernziele aus Frage 1 und die Streichliste aus Frage 5. **Baue erst nach meinem Ja.** Eine bestätigte Landkarte ist billig zu ändern, ein gebautes Bootcamp nicht.

Schreib Landkarte und Antworten in `AGENT_Zwischenablage.md`, damit eine spätere Sitzung mit neuem Kontext sie wiederfindet. Ohne diesen Eintrag beginnt der nächste Durchlauf das Gespräch von vorn.

---

# Schritt 1 — Recherche und Belege

Hier verschiebt sich das größte fachliche Risiko: nicht ein Rechenfehler, sondern eine **erfundene, plausibel klingende Behauptung**, die ich auswendig lerne. Der `.frac`-Unfall aus `Rahmenwerk.md` — eine falsche Formel, sauber gesetzt, ohne einen einzigen Fehler in der Konsole — ist bei einem selbst recherchierten Thema der Normalfall statt der Ausnahme, weil nichts widerspricht.

Daraus fünf Regeln:

1. **Keine Zahl ohne Quelle.** Versionsnummern, Speicherbedarf, Durchsatzangaben, Preise, Grenzwerte, Benchmarkergebnisse — nichts davon aus dem Gedächtnis. Kannst du eine Zahl nicht belegen, nenne sie nicht, sondern lass die Aufgabe die Größenordnung *herleiten*. Eine `calc`-Aufgabe, die aus Modellgröße und Bits pro Gewicht den Speicherbedarf ausrechnet, ist besser als eine erinnerte Tabelle: nachrechenbar, und sie veraltet nicht.
2. **Primärquellen zuerst:** offizielle Dokumentation, Repository, Paper, Spezifikation, Normtext. Blogposts und Videos nur als Wegweiser dorthin, nie als Beleg. Für Bibliotheks- und Werkzeugdokumentation nimm das Dokumentationswerkzeug, das dir zur Verfügung steht, statt aus dem Training zu zitieren — dein Wissensstand ist älter als das Thema.
3. **Quelle und Datum als Kommentar in die `.data.js`**, an derselben Stelle, an der `Rahmenwerk.md` die Nachrechnung verlangt. Im Kopf der Datei eine Liste: Behauptung, Quelle, Abrufdatum. Das ist die Datei, die man in einem halben Jahr aufschlägt, um zu prüfen, was noch stimmt.
4. **Halbwertszeit kennzeichnen und trennen.** Manche Einheiten veralten in Monaten (Werkzeugnamen, Versionen, Modellnamen, Preise), andere halten Jahre (Begriffe, Kompromisse, Verfahren, Rechenwege). **Mische die beiden nicht in einer Einheit.** Das Flüchtige gehört gebündelt in eine eigene Seite mit sichtbarem Stand-Datum, die man ersetzen kann, ohne die Konzepte anzufassen. Ein Bootcamp über ein schnelles Feld muss alterungsfähig gebaut sein.
5. **Unsicherheit sichtbar machen, nicht glätten.** Ist etwas umstritten, im Fluss oder Erfahrungswert statt Messwert, dann steht das im Text — als Merkkasten, nicht als Fußnote. „Das ist mein Stand, hier ist der Grund, hier ist die Quelle" darf ich lesen. Eine glatte Behauptung, die ich später als falsch entdecke, kostet mich das Vertrauen in das ganze Bootcamp.

---

# Schritt 2 — Aufbau der Lernstrecke

Es gibt keinen Termin, keinen Druck und keine externe Struktur. Die muss das Bootcamp mitbringen. Das ist der Unterschied zwischen „am dritten Abend noch dabei" und „nach der Einleitung weggeklickt".

**Erst der Erfolg, dann die Theorie.** Die erste Einheit produziert etwas, das läuft, in unter zehn Minuten. Nicht Geschichte, nicht Begriffsklärung, nicht „Grundlagen". Bei „lokale KI" heißt das: ein Modell antwortet auf meinem Rechner — und *dann* erklärst du, was da gerade passiert ist. Das Erklären hat danach einen Haken, an dem es hängt, und ich habe einen Grund weiterzumachen. Umgekehrt gibt es Kapitel 1 „Historische Entwicklung", und das liest niemand.

**Spirale statt Linie.** Jedes tragende Thema kommt zweimal: einmal flach, so früh wie möglich, damit das Gesamtbild früh steht; einmal tief, wenn es gebraucht wird. Eine Linie zwingt mich, fünf Einheiten durchzuhalten, bevor etwas Sinn ergibt.

**Kurze Einheiten mit sichtbarem Ende.** Zwanzig bis dreißig Minuten, danach etwas Vorzeigbares — eine gelöste Aufgabenserie, ein laufendes Skript, eine ausgefüllte Karte. Eine Einheit, die man nicht in einer Sitzung schafft, wird nicht angefangen.

**Verschränken und wiederholen.** Nach je drei bis vier Einheiten ein kurzes Blatt, das Aufgaben aus den *vorherigen* Einheiten mischt. Nicht als Bonus, sondern als eigene Einheit in der Landkarte. Der Effekt ist belegt, kostet dich wenig und ist das Einzige, was in zwei Wochen noch da ist.

**Ein Abschluss, in dem alles zusammenkommt.** Die letzte Einheit ist ein Lab, das mehrere Themen gleichzeitig verlangt und ein Ergebnis hat, das ich behalten und weiterbenutzen kann. Ohne dieses Ende hört ein Themen-Bootcamp einfach auf, statt fertig zu werden.

---

# Was du ablieferst

Die technische Form steht in `Rahmenwerk.md`. Hier nur, welche Stücke ein Themen-Bootcamp hat:

1. **Bestätigte Landkarte** in `AGENT_Zwischenablage.md`, mit Lernzielen und Streichliste.
2. **Themen-Canvas** — die Landkarte als `.canvas` mit den Abhängigkeiten zwischen den Einheiten. Nicht nach Häufigkeit gewichtet, sondern nach **Voraussetzung**: was muss vorher sitzen. Genau das ist bei einem neuen Feld die Information, die mir fehlt.
3. **Je Einheit** ein Fachartikel, ein Aufgabenblatt oder ein Lab — oft ein Artikel plus ein kurzes Blatt. Ist das Thema praktisch, ist mindestens jede dritte Einheit ein Lab.
4. **`Referenzkarte.md`** — Markdown im Vault aus dem in `Rahmenwerk.md` genannten Grund: Befehle, Parameter, Kennzahlen, Merksätze, Fehlermeldungen und was sie bedeuten. Das Blatt, das neben der Tastatur liegt, wenn ich es benutze. Mit `[[Wikilinks]]` in meine Notizen.
5. **`Lernzettel.md`** — die Landkarte auf Vault-Ebene, ebenfalls Markdown, verlinkt in beide Richtungen: von hier in die Projektseiten, aus den Notizen hierher.
6. **Etappenplan** statt Kalenderplan: Etappe für Etappe, mit Voraussetzung und ehrlicher Dauer. Eine `.ics` nur, wenn ich ein Zeitfenster genannt habe — ohne Termin sind Kalendereinträge Müll, den ich wegklicke, und das beschädigt den Kalender, den ich für echte Termine brauche.
7. **`Anleitung.html`** und der Eintrag jeder Seite in `index.data.js`.
8. **Quellenliste mit Abrufdatum** und der Halbwertszeit-Markierung aus Schritt 1 — als Seite im Projekt, damit ich sie beim Lesen zur Hand habe.
9. **Abgleich gegen die Lernziele.** Zu jedem Lernziel aus Schritt 0 gehört mindestens eine Aufgabe oder ein Lab, das es tatsächlich prüft. Leg die Zuordnung offen und nenne die Lücken. Ein Lernziel ohne prüfende Aufgabe ist ein Versprechen, das das Bootcamp nicht hält.
10. **Persistenz** wie in `Rahmenwerk.md` — was hier über das Verfahren gelernt wurde, gehört ins Repo, nicht in den Themenordner.

---

# Wohin damit

Klone das Repo (`Bootcamp`) in einen Ordner mit dem Namen des Themas und arbeite dort. Der Vault bleibt sortiert, und zwei Bootcamps stören sich nicht im `localStorage`, weil der Schlüssel den Dateinamen enthält.

---

# Beispiel: „Lokale KI"

Zur Veranschaulichung, wie ein Zuschnitt aussieht — **nicht** als Vorlage zum Abschreiben. Angenommen, ich antworte in Schritt 0: *anwenden können*, Praxis auf einem Windows-Notebook erlaubt, kein Geld, kein Training von Grund auf, keine Transformer-Mathematik.

Dann sieht die Landkarte etwa so aus:

| # | Einheit | Form |
|---|---|---|
| 0 | Ein Modell antwortet auf meinem Rechner — in zehn Minuten, ohne Erklärung vorweg | Lab |
| 1 | Was da gerade lief: Gewichte, Parameter, Kontextfenster, Token | Artikel + Blatt |
| 2 | Passt es auf meine Maschine? Die Rechnung aus Modellgröße, Bits pro Gewicht und Speicher | Blatt mit `calc` |
| 3 | Quantisierung: der zentrale Kompromiss zwischen Größe, Tempo und Qualität | Artikel + Blatt |
| 4 | Wer wofür: die Laufzeitumgebungen im Vergleich — **Stand-Datum, kurze Halbwertszeit** | Artikel |
| 5 | Wiederholung 0–4, gemischt | Blatt |
| 6 | Kontext füllen: Systemprompt, Verlauf, was beim Überlauf passiert | Artikel + Lab |
| 7 | Eigene Dokumente befragen: Einbettungen und Retrieval, lokal | Artikel + Lab |
| 8 | Strukturierte Ausgabe und Werkzeugaufrufe — und warum sie scheitern | Blatt + Lab |
| 9 | Grenzen: wann lokal die falsche Antwort ist, und was Datenschutz wirklich bringt | Artikel + Blatt |
| 10 | Wiederholung 6–9, gemischt | Blatt |
| 11 | Abschluss: ein lokaler Assistent über meine eigenen Unterlagen | Lab |

Was daran wichtig ist: Einheit 0 ist ein Erfolg ohne Vorrede. Einheit 2 rechnet statt zu behaupten und veraltet damit nicht. Einheit 4 ist als flüchtig markiert und steht allein, damit sie ersetzbar bleibt. Einheiten 5 und 10 sind Wiederholung als eigene Einheit. Einheit 9 sagt mir, wann ich es *nicht* benutzen soll — der Teil, den Bootcamps immer auslassen und der über Kompetenz entscheidet. Einheit 11 hinterlässt etwas, das ich behalte.

Und was fehlt, weil ich es in Schritt 0 gestrichen habe: Training von Grund auf, Feinabgleich, Transformer-Mathematik, Cloud-Anbieter. Das steht in der Zwischenablage, mit Grund, damit ich es nachbestellen kann.
