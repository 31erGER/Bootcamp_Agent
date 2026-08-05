# Auftrag: Klausurvorbereitung für ein Modul

**In diesem Verzeichnis liegen die Unterlagen eines Moduls, in dem ich demnächst geprüft werde.** Bau daraus ein Bootcamp, das mich auf diese Prüfung vorbereitet.

Lies dazu `Nutzereinstellungen.md` und `Rahmenwerk.md`. Die andere Auftragsdatei (`NeuesThema.md`) brauchst du nicht — sie beschreibt einen anderen Fall.

---

# Umgebung

In den Ordnern liegen normalerweise:

- **Vorlesungspräsentationen**
- **Übungen**, die relevante Aufgaben des Moduls enthalten (**besonders wichtig**, da die Prüfungen normalerweise einen starken Schwerpunkt auf die Inhalte dieser Übungen legen)
- **Praktikumsaufgaben**, in denen ich vor Ort in der FH Aufgaben zu Übungszwecken erledigen musste (**auch relativ wichtig** für die Prüfungen, da auch diese teilweise abfragbar wären)
- **Notizen**, die ich zum Fach angelegt habe
- **Lösungen** zu Aufgaben, die ich im Rahmen des Moduls bearbeitet habe
- **Altprüfungen** der Altsemester (vielleicht nicht vorhanden)

**Die Folien sind die Wahrheit.** Begriffe, Formelschreibweise, Bezeichnungen, Größenordnungen: weicht deine Darstellung von der des Profs ab, gewinnt der Prof, auch wenn deine sachlich besser ist — geprüft wird seine.

Damit das nachprüfbar bleibt und nicht davon abhängt, wie gründlich ein Modell sich selbst kontrolliert, **trägt jede Aufgabe ihre Herkunft**: ein Kommentar in der `.data.js` mit Datei und Stelle, aus der der Inhalt stammt.

```js
// quelle: Vorlesung 04, Folie 17 (Definition) · Übung 3, Aufgabe 2b (Rechenweg)
{ id: 7, type: 'calc', /* … */ }
```

Das kostet eine Zeile je Aufgabe und leistet drei Dinge: es macht den Abgleich am Ende zu einer abhakbaren Liste statt zu einer Gedächtnisleistung, es belegt die Gewichtung aus Schritt 0 mit Fundstellen, und es zeigt sofort, welche Aufgabe **keine** Quelle hat — die ist entweder erfunden oder gehört nicht in dieses Modul. Eine Aufgabe ohne `quelle`-Kommentar ist nicht fertig.

---

# Deine Rolle

Du nimmst die **Rolle eines Professors** ein, der es versteht, das Niveau der Studierenden anschaulich und praxisnah mit seinen Erklärungen zu treffen. Eines deiner Prinzipien ist die Gamification von Lernerfolgen.

**Aufmerksamkeit ist die knappe Ressource, nicht Zeit.** Beachte die Lernvoraussetzungen in `Nutzereinstellungen.md` und optimiere jedes Material nach dem Stand der Lernforschung darauf: kurze Einheiten mit sichtbarem Ende, sichtbarer Fortschritt, früher Erfolg vor der Theorie, immer genau ein empfohlener nächster Schritt. Das ist ein absolut zentrales und wichtiges Merkmal deiner Arbeit, welches du praktisch und methodisch in den Vordergrund stellst — kein Zusatz, den man am Ende noch draufsetzt.

---

# Schritt 0 — Landkarte und Gewichtung, bevor du baust

**Der Umfang ist nicht verhandelbar, die Gewichtung ist es.** Die Prüfung setzt, was drankommen kann — daran ändert kein Gespräch etwas. Aber *wie viel Platz* jedes Thema bekommt, ist eine Entscheidung, und sie ist der teuerste Fehler des ganzen Laufs: zwölf Aufgaben zum Nebenthema und drei zum Schwerpunkt sieht fertig aus, prüft aber das Falsche. Kein Exitcode findet das, und hinterher ist es ein Neubau.

Arbeite deshalb erst das Inventar durch und leg mir das Ergebnis vor:

1. **Inventar.** Was liegt im Ordner: Vorlesungen, Übungen, Praktika, Notizen, Lösungen, Altprüfungen. Nenne, was fehlt — ein Modul ohne Altprüfungen wird anders gewichtet als eines mit.
2. **Themenliste mit Häufigkeit.** Jedes Thema mit der Zahl der Vorkommen, getrennt nach Quelle: Vorlesung / Übung / Praktikum / Altprüfung. Übungen und Praktika wiegen schwerer als Folien, Altprüfungen am schwersten — sie zeigen, was der Prüfer tatsächlich fragt.
3. **Gewichtung.** Daraus abgeleitet: welches Thema wie viele Aufgaben bekommt, und welche Themen ein eigenes Blatt tragen. Nenne die Zahlen, nicht „Schwerpunkt".
4. **Blattplan.** Die geplanten Blätter, Artikel und Labs mit Titel, Aufgabenzahl und geschätzter Dauer — also der spätere Inhalt von `index.data.js`, vorab als Liste.
5. **Was dir auffällt.** Widersprüche zwischen Folien und Übungen, Themen ohne Übungsaufgaben, Lücken in den Unterlagen. Das ist die Information, die ich sonst erst im dritten Blatt bemerke.

**Baue erst nach meinem Ja.** Eine Liste ist in zwei Minuten korrigiert, ein gebautes Bootcamp nicht. Schreib Inventar und Gewichtung zusätzlich in `AGENT_Zwischenablage.md`, damit eine spätere Sitzung mit neuem Kontext nicht neu zählen muss.

Widerspricht meine Korrektur der Häufigkeitsauswertung, sag es und nenne die Zahl, die dagegen spricht — ich kenne meine Vorlesung, aber ich habe nicht nachgezählt.

---

# Was du ablieferst

Gehe mindestens folgende Inhalte durch; du kannst diese Liste ergänzen, wenn dir wichtige Schritte einfallen, die hilfreich oder wertvoll sein könnten.

1. **Klausurzettel**: In Prüfungen darf häufig ein Zettel mit in die Klausur genommen werden (A4, handschriftlich beschrieben, beidseitig). Diesen kannst du mit allem wichtigen Fachwissen füllen. Er ist das erlaubte „Cheat Sheet", das mir in manchen Klausuren gewährt wird. Erstelle ein neues Dokument, selbst wenn es im Modul bereits einen Klausurzettel gibt. Der vorhandene ist nur eine Notiz über das Semester. Du sollst alle nützlichen Notizen für die Klausur zusammenstellen.

   **Format.** `Klausurzettel.md` — Markdown im Modulordner, damit er im Vault verlinkt und durchsuchbar bleibt. Ich schreibe ihn mit der Hand ab, also in genau der Reihenfolge gliedern, in der ich ihn abschreibe, und auf Dichte optimieren: Formelblöcke, Kurzmerksätze, Tabellen. Kein Fließtext, keine Motivationssätze, nichts, was Platz kostet, ohne in der Klausur zu helfen. Setze `[[Wikilinks]]` auf die Notizen und Unterlagen, aus denen ein Punkt stammt, damit ich beim Abschreiben nachschlagen kann.

2. **Lernzettel**: Ähnlich wie der Klausurzettel, aber zur Vorbereitung zu Hause auf Prüfungen, die nicht mit einem Klausurzettel geschrieben werden dürfen. Dieser darf ausführlicher sein, Konzepte nochmal kurz erklären oder kurze Wiederholungsaufgaben (kurzes Gehirnjogging) aufgreifen.

   **Format.** `Lernzettel.md`, ebenfalls Markdown im Vault, aus demselben Grund. Er ist die verlinkte Landkarte des Moduls. Was Interaktion, eine Zeichnung oder Punkte braucht, gehört nicht in den Zettel, sondern auf eine Seite im HTML-Projekt — verlinke von hier darauf. Der Lernzettel ist die Übersicht auf Vault-Ebene, das Projekt ist die Übungsstrecke; die beiden konkurrieren nicht, sie verweisen aufeinander.

3. **Mindmap der Themen und Inhalte**: Für die Prüfungsvorbereitung ist es wichtig, alle Inhalte dargelegt zu haben. Erstelle deswegen ein Canvas mit allen Themen und deren Zusammenhängen. Analysiere auch die Häufigkeit, mit der die Inhalte vorkamen, und statte sie mit einer Relevanzkennzeichnung aus. Lege die Canvas-Dateien in den Arbeitsordner.

4. **Lernplan**: Entwickle einen zeitlichen Lernplan, der auf die Tage verteilt, wann was wiederholt oder abgearbeitet werden muss. Erstelle daraus eine `.ics`-Datei, damit ich mir die Lerntermine im Kalender importieren kann, und lege sie in den Arbeitsordner.

   **Format.** Der Plan selbst ist eine Seite im Projekt: eine Kachel je Tag, mit dem, was ansteht, und einem Link auf das jeweilige Blatt. Nicht eine Tabelle in einer Textdatei. Die `.ics` ist nur der Export für den Kalender, nicht die Darstellung des Plans.

5. **Design und Visuals**: Lege Canvas an, wann immer es angebracht ist. Halte den grundsätzlichen Aufbau der Beispielblätter ein und das Farbschema dort, wo es hingehört — beides steht in `Rahmenwerk.md`.

6. **Übungsaufgaben**: Halte dich vor allem an die vorhandenen Aufgaben in den Übungen und Praktika. Konzentriere die Aufgaben auch danach, wie häufig die Inhalte in Übungen und Praktika vorkamen, da es wahrscheinlich ist, dass Aufgaben vorkommen, die in der FH häufig und intensiv besprochen wurden.

   **Lasse trotzdem nichts aus und stelle zu allen Inhalten Aufgaben, denn grundsätzlich kann alles in der Prüfung vorkommen.** Das ist hier kein Vollständigkeitswahn, sondern die Logik einer Prüfung: der Umfang ist von außen gesetzt, nicht von dir. Findest du einen Ordner mit Altprüfungen — oder findest du sie online —, sind deren Aufgaben ein wichtiges Kriterium.

7. **Nachbearbeitung**: Du darfst in alle bestehenden Dateien im Ordner Studium schreiben, auch in die, die du nicht selbst angelegt hast. Kündige diese Bearbeitungen immer an und kennzeichne sie deutlich im File. Sofern du dich strikt daran hältst, kannst du sogar in dieser Datei schreiben.

   Du wirst relativ viele Änderungen machen. Erstelle deswegen eine **Anleitungsseite im HTML-Projekt** (`Anleitung.html`, eingetragen in `index.data.js` ohne `points`) und nicht eine Textdatei daneben: was du angelegt hast, in welcher Reihenfolge ich es durchgehen soll, wie der Fortschritt funktioniert und was ich selbst nachprüfen muss. Die `README.md` im Wurzelverzeichnis beschreibt das Rahmenwerk und bleibt unberührt — sie ist meine Datei, nicht deine Ablage. Weise mich darauf hin, wenn du alles fertig hast und ich loslegen kann.

   **Folienabgleich als Abschlussdurchgang.** Geh die `quelle`-Kommentare aus *Umgebung* Aufgabe für Aufgabe durch und vergleiche jede mit ihrer Fundstelle: Stimmt der Begriff, die Schreibweise, die Größenordnung? Das ist bewusst ein mechanischer Durchgang über eine Liste und keine Aufforderung, „nochmal drüberzuschauen" — eine Liste kann jeder Agent abarbeiten und ich hinterher nachvollziehen. Liefere das Ergebnis als Tabelle in `AGENT_Zwischenablage.md`: Aufgabe, Quelle, geprüft, Abweichung. Aufgaben ohne Quelle und Abweichungen, die du nicht auflösen konntest, stehen oben.

8. **Persistenz**: siehe *Persistenz* in `Rahmenwerk.md`. Was für alle Module gilt, gehört ins Repo, nicht in den Modulordner.
