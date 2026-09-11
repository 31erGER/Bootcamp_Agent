/* ============================================================================
   Modul_02_Verbundnetze.data.js — Aufgabenheft zu Modul 02 „Verbundnetze"
   ---------------------------------------------------------------------------
   ELF Aufgaben, sechs davon schwer — alle elf Aufgabenarten eines Lernblatts,
   jede GENAU EINMAL. Elf und nicht zehn, weil Einfach- und Mehrfachauswahl
   getrennt zählen; beide stehen seit dem 11.09.2026 in jedem Heft. Aufgabenstellung, Begründung und Vertiefung stammen wörtlich
   aus dem Markup von 2026.

   Was sich geändert hat und WARUM:

   · Antwortlängen ausgeglichen. Vorher war in vier Aufgaben die längste Antwort
     die richtige. Wer nichts weiß, klickt die längste — und lag damit
     systematisch richtig. validate.js meldet das jetzt, und die Optionen sind
     darauf umgeschrieben.
   · 11.09.2026: auf eine Aufgabe je Aufgabenart gekürzt, von 18 auf 11. Das Heft ist
     Showcase und Kopiervorlage; sieben Auswahlaufgaben nebeneinander zeigen
     nichts, was die erste nicht gezeigt hat. Gestrichen wurden ausschließlich
     WIEDERHOLUNGEN eines Typs — die vier Begriffe, an denen die Abdeckungskarte
     hängt (Regelzone, Primär-, Sekundärregelung, Netzleistungszahl), stehen
     weiterhin in den verbliebenen Aufgaben, geprüft von exam-coverage-check.
   · Einfach- UND Mehrfachauswahl, beide einmal: Aufgabe 2 hat mehrere richtige
     Antworten, Aufgabe 7 genau eine.

   Fachlich gegengerechnet:
     Toleranzband 50 Hz ± 0,2 Hz · Eingreifschwelle Primärregelung 0,02 Hz
     Primär binnen 30 s, dezentral · Sekundär ≤ 5 min, zentral vom ÜNB
     Tertiär ab Minute 5, führt die Reserven zurück
     λ = ΔP / Δf; 1200 MW / 0,080 Hz = 15 000 MW/Hz
     78 000 MW · 1,2 = 93 600 MW; Reserve 15 600 MW; 15 600 / 1300 = 12
   ============================================================================ */

WB.register({
  id: 'M02',
  kind: 'Aufgabenheft',
  level: 'Modul 02 · Schritt 2 von 3',
  kicker: 'Modul 02 · Verbundnetze und Frequenzhaltung',
  headline: 'Ein Kontinent,<br><em>eine Frequenz.</em>',
  lede: 'Vom Deutschen Netzregelverbund über die Regelzonen bis zur UCTE: ' +
        'elf Aufgaben über alle elf Aufgabenarten eines Lernblatts — wer hält die 50&nbsp;Hz, ' +
        'wer springt ein, wenn ein Kraftwerk ausfällt, und warum ist Deutschland die ' +
        'Drehscheibe Europas?',
  trace: 'M0,23 L120,23 L140,8 L160,38 L180,23 L340,23 L360,8 L380,38 L400,23 L560,23 L580,8 L600,38 L620,23 L800,23',

  intro: [
    'Das Verbundnetz ist mehr als Kupfer und Stahl: Alle Kraftwerke einer Regelzone laufen ' +
      'parallel, vier Übertragungsnetzbetreiber kontrollieren den Höchstspannungsbereich, rund ' +
      '900 Verteilnetzbetreiber liefern bis zum Endverbraucher — und der gemeinsame Taktgeber ist ' +
      'die Netzfrequenz von 50&nbsp;Hz. Wer versteht, wie Primär-, Sekundär- und Tertiärregelung ' +
      'ineinandergreifen, versteht, warum das Licht auch dann anbleibt, wenn ein Kraftwerk ' +
      'plötzlich vom Netz geht.',
    'Arbeite die Aufgaben in beliebiger Reihenfolge, die Seitenleiste führt dich. Nach jeder ' +
      'Antwort bekommst du die Begründung plus eine Vertiefung mit dem Folienwissen aus der ' +
      'Präsentation. Ein falscher erster Versuch ist kein Beinbruch: du bekommst einen zweiten, ' +
      'er zählt halb.'
  ],
  notes: [
    { text: '<b>Dein Stand bleibt.</b> Punkte und gelöste Aufgaben liegen im Browser dieses ' +
            'Rechners und überleben das Neuladen. Der Knopf <i>Stand löschen</i> in der ' +
            'Seitenleiste beginnt von vorn.' },
    { text: '<b>Begleitmaterial:</b> Präsentation Modul&nbsp;03a (Verbundnetze, Folien&nbsp;1–12). ' +
            'Löse die Aufgaben direkt nach dem PPT-Block — die Vertiefungen greifen die ' +
            'Folieninhalte wieder auf.' },
    { text: '<b>Übertrag in die Lerndokumentation.</b> Das Notizfeld unter jeder Aufgabe wird ' +
            'bewusst <i>nicht</i> gespeichert: Rechenwege und Erkenntnisse gehören in deine ' +
            'eigene Dokumentation, nicht in einen Browserspeicher.', signal: true }
  ],

  parts: [

    /* ══════════════════════════════════════════════════════════════════════════
       Teil 1 · Aufbau, Kennzahlen und Akteure
       ══════════════════════════════════════════════════════════════════════════ */
    {
      index: '01',
      eyebrow: 'Teil 1',
      title: 'Das Verbundnetz &amp; seine Akteure',
      count: '5 Aufgaben · leicht bis schwer',
      tasks: [

        {
          id: 1,
          type: 'cloze',
          eyebrow: 'Teil 1 · Lückentext',
          title: 'Regelzone, Spannung und Frequenz',
          difficulty: 'leicht',
          prompt: 'Ergänze die <span class="hl">Grundprinzipien</span> des Verbundnetzes.',
          segments: [
            { kind: 'text', text: 'Ein Stromnetz („Elektroenergiesystem") dient der ' },
            { kind: 'select', answer: 'Übertragung und Verteilung',
              distractors: ['Erzeugung und Speicherung', 'Messung und Abrechnung'] },
            { kind: 'text', text: ' elektrischer Energie und besteht aus Freileitungen, Erdkabeln sowie ' },
            { kind: 'select', answer: 'Schalt- und Umspannwerken',
              distractors: ['Kraftwerken und Pumpspeichern', 'Zähl- und Messstellen'] },
            { kind: 'text', text: '. Alle Kraftwerke einer Regelzone sind miteinander ' },
            { kind: 'select', answer: 'parallelgeschaltet',
              distractors: ['in Reihe geschaltet', 'galvanisch getrennt'] },
            { kind: 'text', text: '. Mit steigender übertragener Leistung wird auch die ' },
            { kind: 'select', answer: 'Spannung', distractors: ['Stromstärke', 'Frequenz'] },
            { kind: 'text', text: ' erhöht, um die Leistungsverluste zu minimieren. Die Regelzonen sind über ' },
            { kind: 'select', answer: 'Kuppelleitungen',
              distractors: ['Stichleitungen', 'Ringleitungen'] },
            { kind: 'text', text: ' beziehungsweise Übergabestellen zum Verbund verbunden.' }
          ],
          feedback: 'Übertragen und verteilen, parallel schalten, Spannung hoch, kuppeln — das ist das Verbundnetz in einem Satz.',
          deep: 'Warum Spannung statt Strom? Bei gleicher Leistung P = √3·U·I·cos&nbsp;φ sinkt mit höherer Spannung der Strom — und die Verluste P<sub>V</sub> = I²·R sinken <b>quadratisch</b>. Deshalb wird die Kraftwerksspannung für die Übertragung hochtransformiert. Stich- und Ringleitungen sind dagegen <b>Netzformen der Verteilung</b> — die lernst du in Modul 04 (Netzarten) kennen.'
        },

        {
          id: 2,
          type: 'choice',
          multi: true,
          eyebrow: 'Teil 1 · Mehrfachauswahl',
          title: 'Vorteile des Verbundbetriebs',
          difficulty: 'mittel',
          prompt: 'Elektroenergiesysteme und Regelzonen sollen <span class="hl">wirtschaftlich und autark</span> arbeiten — und werden trotzdem über Kuppelleitungen zum Verbund zusammengeschlossen. Welche Vorteile bringt der Verbundbetrieb?',
          options: [
            { text: 'Gemeinsame Nutzung von Leistung und Reserven über die Zonengrenzen hinweg', correct: true },
            { text: 'Jede Regelzone kann ihre Netzfrequenz individuell einstellen', correct: false },
            { text: 'Flächendeckende Nutzung erneuerbarer Energien, etwa von Offshore-Windparks', correct: true },
            { text: 'Große Kraftwerke werden wirtschaftlicher und technisch einfacher', correct: true },
            { text: 'Die Kurzschlussströme sinken durch die Parallelschaltung der Kraftwerke', correct: false }
          ],
          feedback: 'Drei Vorteile aus der Folie „Prinzipien". Voraussetzung für alles ist die <b>einheitliche Frequenz</b> von 50&nbsp;Hz ± 0,2&nbsp;Hz — realisiert über Kuppelleitungen beziehungsweise Übergabestellen.',
          wrongNote: 'Der Verbund erzwingt eine gemeinsame Frequenz, er erlaubt keine individuellen. Und parallel geschaltete Quellen erhöhen den Kurzschlussstrom, sie senken ihn nicht.',
          deep: '„Autark" heißt: Jede Regelzone soll ihre Last grundsätzlich selbst decken können — der Verbund ist die Versicherung, nicht der Normalfall. Dass der Verbund die <b>Kurzschlussleistung erhöht</b>, ist Fluch und Segen zugleich: gut für die Spannungsstabilität, aber die Schaltgeräte (Modul 05) müssen die größeren Ströme sicher beherrschen.'
        },

        /* quelle: Lehrkurs Kapitel 1 bis 4 — die Kennzahlen des Verbundnetzes */
        {
          id: 3,
          type: 'reverse',
          difficulty: 'mittel',
          eyebrow: 'Teil 1 · Umkehrfrage',
          title: 'Zu welcher Frage gehört dieser Wert?',
          prompt: 'Vier Kennzahlen des Verbundnetzes, aber ohne ihre Frage. Ordne jedem Wert die ' +
                  '<span class="hl">Frage</span> zu, auf die er die Antwort ist. Drei der Fragen im ' +
                  'Auswahlfeld gehören zu keinem der Werte.',
          items: [
            { answer: '50 Hz',   question: 'Welche Frequenz hält der europäische Verbund im Normalbetrieb?' },
            { answer: '± 0,2 Hz', question: 'Wie breit ist das zulässige Toleranzband um die Sollfrequenz?' },
            { answer: '20 %',    question: 'Wie viel Kraftwerksreserve hält eine Regelzone typischerweise vor?' },
            { answer: '380 kV',  question: 'Auf welcher Spannung überträgt das deutsche Höchstspannungsnetz?' }
          ],
          pool: [
            'Ab welcher Frequenzabweichung greift die Primärregelung ein?',
            'Wie viel Leistung liefert ein großer Kernkraftwerksblock?',
            'Wie hoch ist der Wirkungsgrad eines modernen GuD-Kraftwerks?'
          ],
          feedback: 'Die vier Werte sind die Eckdaten, an denen man ein Verbundnetz beschreibt: Sollfrequenz, zulässige Abweichung, vorgehaltene Reserve und Übertragungsspannung.',
          wrongNote: 'Die beiden Frequenzangaben werden gern vertauscht. 0,2 Hz ist das Band, in dem der Betrieb noch als normal gilt; die Schwelle, ab der die Primärregelung anläuft, liegt zehnmal tiefer.',
          deep: 'Diese Richtung ist die, in der eine Leitwarte tatsächlich arbeitet: auf dem Schirm steht ein Wert, und die Frage dazu muss man selbst mitbringen. Erst sie entscheidet, ob 49,98 Hz eine Meldung wert ist oder nicht — dieselbe Zahl ist innerhalb des Toleranzbands unauffällig und oberhalb der Eingreifschwelle bereits ein Regelvorgang.'
        },

        /* ── NEU ── */
        {
          id: 4,
          type: 'hotspot',
          eyebrow: 'Teil 1 · Kartenarbeit',
          title: 'Vier Stellen im Netzschema',
          difficulty: 'schwer',
          prompt: 'Das Schema zeigt drei Spannungsebenen, aber <span class="hl">keine Deutung</span> — nur die Spannungs- und Leistungswerte. Markiere der Reihe nach die Kuppelleitung zwischen zwei Schaltanlagen, den Blocktransformator des Großkraftwerks, die dezentrale Einspeisung und einen Abnehmer.',
          image: 'assets/img/schema-verbundnetz.svg',
          imageAlt: 'Schematisches Verbundnetz mit drei Spannungsebenen, Transformatoren, einem Großkraftwerk links und einer dezentralen Einspeisung rechts',
          zones: [
            { x: 34.4, y: 16.2, r: 5, label: 'Kuppelleitung zwischen zwei Schaltanlagen' },
            { x: 18.75, y: 37.6, r: 5, label: 'Blocktransformator des Großkraftwerks' },
            { x: 87.5, y: 75.6, r: 5, label: 'Dezentrale Einspeisung' },
            { x: 40, y: 92.4, r: 5, label: 'Abnehmer' }
          ],
          feedback: 'Die Symbole tragen die Antwort: zwei ineinandergreifende Kreise sind <b>immer</b> ein Transformator, ein Kreis mit Sinuswelle <b>immer</b> eine Maschine, ein Pfeil aus dem Netz heraus ein Abnehmer. Die Kuppelleitung erkennt man daran, dass sie zwei Schaltanlagen derselben Spannungsebene verbindet — sie transformiert nichts.',
          wrongNote: 'Der Blocktransformator sitzt zwischen Generator und Sammelschiene, nicht zwischen zwei Spannungsebenen des Netzes. Und die dezentrale Einspeisung hängt an der untersten Ebene, nicht an der obersten — genau das macht sie dezentral.',
          deep: 'Die Kuppelleitung ist das Bauteil, um das es in diesem Modul geht: <b>ohne sie ist jede Regelzone eine Insel</b>. Über sie fließt die solidarische Primärregelleistung aus Aufgabe 8, und über sie wird aus vier deutschen Regelzonen der Netzregelverbund. Der Blocktransformator dagegen ist reine Kraftwerkstechnik — er hebt die Generatorspannung von typisch 21 kV auf die Netzspannung.'
        },

        {
          id: 5,
          type: 'calc',
          eyebrow: 'Teil 1 · Rechenweg',
          title: 'Wie viel Reserve sind 20&nbsp;% wirklich?',
          difficulty: 'schwer',
          prompt: 'Eine Regelzone hat eine Spitzenlast von 78&nbsp;000&nbsp;MW und hält die geforderte Reserve von 20&nbsp;% der Spitzenlast vor. Rechne aus, wie viel Kraftwerksleistung dafür installiert sein muss, wie groß die Reserve in Megawatt ist und <span class="hl">wie viele Blockausfälle</span> sie abdeckt.',
          given: [
            { label: 'Spitzenlast der Regelzone', value: '78 000 MW' },
            { label: 'Kraftwerksreserve', value: '20 % der Spitzenlast' },
            { label: 'Blockgröße eines Großkraftwerks', value: '1300 MW' }
          ],
          steps: [
            {
              label: 'Nötige installierte Leistung',
              formula: 'P<sub>inst</sub> = P<sub>max</sub> · 1,2',
              answer: 93600,
              tol: 500,
              unit: 'MW',
              hint: 'Die Spitzenlast plus ein Fünftel davon — oder gleich mit dem Faktor rechnen.'
            },
            {
              label: 'Vorgehaltene Reserve',
              formula: 'P<sub>res</sub> = P<sub>inst</sub> − P<sub>max</sub>',
              answer: 15600,
              tol: 300,
              unit: 'MW',
              hint: 'Der Unterschied zwischen dem, was installiert ist, und dem, was gebraucht wird.'
            },
            {
              label: 'Abgedeckte Blockausfälle',
              formula: 'n = P<sub>res</sub> / P<sub>Block</sub>',
              answer: 12,
              tol: 0.5,
              unit: 'Blöcke',
              hint: 'Die vorgehaltene Reserve geteilt durch die Blockgröße.'
            }
          ],
          feedback: '78&nbsp;000 · 1,2 = 93&nbsp;600&nbsp;MW installiert, davon 15&nbsp;600&nbsp;MW Reserve. Das sind <b>zwölf</b> Großkraftwerksblöcke — die Reserve ist kein Sicherheitszuschlag, sondern ein halber Kraftwerkspark.',
          deep: 'Genau diese Rechnung erklärt, warum der Verbundbetrieb wirtschaftlich zwingend ist: <b>Reserve für den eigenen größten Ausfall muss jede Zone allein vorhalten, Reserve für den unwahrscheinlichen Doppelausfall teilen sich alle.</b> Vier Zonen im Verbund brauchen zusammen deutlich weniger als viermal die Einzelreserve — das ist der Grund für die Kuppelleitungen aus Aufgabe 5 und für die 631 GW gegen 390 GW Spitzenlast der UCTE in Aufgabe 15.'
        }
      ]
    },

    /* ══════════════════════════════════════════════════════════════════════════
       Teil 2 · Regelung, Stafette und Lagebeurteilung
       ══════════════════════════════════════════════════════════════════════════ */
    {
      index: '02',
      eyebrow: 'Teil 2',
      title: 'Frequenzhaltung &amp; Regelleistung',
      count: '6 Aufgaben · überwiegend schwer',
      tasks: [

        {
          id: 6,
          type: 'dnd',
          eyebrow: 'Teil 2 · Zuordnung',
          title: 'Die Stufen der Leistungsregelung',
          difficulty: 'mittel',
          prompt: 'Nach einem Kraftwerksausfall greifen mehrere Mechanismen <span class="hl">zeitlich gestaffelt</span> ineinander. Ordne jeder Stufe ihre Funktion zu.',
          poolLabel: 'Funktion',
          targetLabel: 'Stufe',
          pairs: [
            { key: 'traeg', term: 'Trägheit des Läufers',
              description: 'Wirkt sofort und ungeregelt: Die rotierende Masse des Generatorläufers dämpft den Laststoß' },
            { key: 'prim', term: 'Primärregelung',
              description: 'Sekundenreserve — dezentral von allen anbietenden Kraftwerken über die Turbinenleistung, binnen 30 Sekunden' },
            { key: 'sek', term: 'Sekundärregelung',
              description: 'Regelreserve — automatisch, zentral vom Übertragungsnetzbetreiber gesteuert, nach spätestens 5 Minuten' },
            { key: 'ter', term: 'Tertiärregelung',
              description: 'Minutenreserve — ab Minute 5, entlastet die vorherige Stufe und führt die Regelreserven zurück' }
          ],
          feedback: 'Die Staffelung ist eine Stafette: Trägheit (sofort) → Primär (Sekunden) → Sekundär (≤ 5 min) → Tertiär (ab Minute 5). Jede Stufe löst die vorherige ab, damit diese wieder frei wird.',
          deep: 'Merkhilfe über die Reserven-Namen: <b>Sekundenreserve</b> (primär), <b>Regelreserve</b> (sekundär), <b>Minutenreserve</b> (tertiär). Dezentral gegen zentral ist prüfungsrelevant: Primärregelung leisten alle anbietenden Kraftwerke gemeinsam, die Sekundärregelung steuert der ÜNB zentral für seine Regelzone. Die Reihenfolge legst du in Aufgabe 11 selbst.'
        },

        /* ── NEU ── */
        {
          id: 7,
          type: 'order',
          eyebrow: 'Teil 2 · Reihenfolge',
          title: 'Die Stafette nach einem Blockausfall',
          difficulty: 'schwer',
          prompt: 'Bringe die sechs Vorgänge in ihre <span class="hl">zeitliche Folge</span> — von der Sekunde des Ausfalls bis zum wieder gewappneten Netz.',
          items: [
            'Ein Kraftwerksblock fällt aus, seine Einspeisung bricht weg',
            'Die Trägheit der Läufer dämpft den Stoß, die Frequenz beginnt zu sinken',
            'Alle anbietenden Kraftwerke öffnen ihre Turbinenventile — binnen 30 Sekunden',
            'Der Übertragungsnetzbetreiber führt zentral Regelleistung zu — nach spätestens 5 Minuten',
            'Ab Minute 5 übernimmt die Minutenreserve und entlastet die vorige Stufe',
            'Primär- und Sekundärreserve sind zurückgeführt, das Netz ist wieder gewappnet'
          ],
          feedback: 'Die Reihenfolge ist keine Konvention, sondern eine Folge der Zeitkonstanten: die Trägheit wirkt sofort, weil sie nichts entscheiden muss.',
          wrongNote: 'Der letzte Schritt wird oft vergessen. Ohne ihn wäre das Netz nach einem Ausfall ohne Reserve für den nächsten — die Tertiärregelung ist kein Nachspiel, sie ist die Vorbereitung.',
          deep: 'Diese Stafette ist die Antwort auf eine der häufigsten Prüfungsfragen: <b>Warum reicht die Primärregelung nicht?</b> Weil sie die Frequenz nur anhält und dabei selbst gebunden bleibt. Solange sie abgerufen ist, fehlt sie als Reserve — und ein zweiter Ausfall träfe ein Netz ohne Sekundenreserve. Deshalb löst jede Stufe die vorige ab, nicht aus Ordnungsliebe, sondern um die schnelle Reserve freizubekommen.'
        },

        {
          id: 8,
          type: 'estimate',
          eyebrow: 'Teil 2 · Schätzen',
          title: 'Die Eingreifschwelle der Primärregelung',
          difficulty: 'schwer',
          prompt: 'Ab welcher <span class="hl">Frequenzabweichung</span> greift die Primärregelung ein? Antwort in Millihertz.',
          answer: 20,
          tol: 6,
          unit: 'mHz',
          min: 0,
          max: 200,
          step: 5,
          feedback: 'Ab <b>20 mHz</b>, also 0,02&nbsp;Hz. Das Toleranzband ist mit ± 0,2&nbsp;Hz zehnmal so weit — die Regelung wartet also gar nicht, bis es gerissen wird.',
          deep: 'Der Faktor 10 zwischen Eingreifschwelle und Toleranzband ist Absicht und der eigentliche Merksatz: <b>Eine Regelung, die erst an der Grenze anspringt, kommt zu spät.</b> Bei 200 mHz Abweichung ist die gesamte Primärreserve des Synchrongebiets abgerufen, und dahinter beginnt der abgestufte Lastabwurf. Die 20 mHz sind der Punkt, an dem noch alles zu retten ist.'
        },

        {
          id: 9,
          type: 'matrix',
          eyebrow: 'Teil 2 · Raster',
          title: 'Positiv oder negativ? Sechs Fälle',
          difficulty: 'schwer',
          prompt: 'Entscheide für jeden Vorgang, welche <span class="hl">Regelrichtung</span> er darstellt oder erfordert. Genau ein Kreuz je Zeile.',
          rowHeader: 'Vorgang',
          columns: ['positive Regelung', 'negative Regelung'],
          rows: [
            { label: 'Die Netzfrequenz sinkt unter 50 Hz', correct: [true, false] },
            { label: 'Ein Pumpspeicherwerk beginnt zu pumpen', correct: [false, true] },
            { label: 'Eine Windflaute lässt die Einspeisung einbrechen', correct: [true, false] },
            { label: 'Ein Elektrolyseur wird zugeschaltet', correct: [false, true] },
            { label: 'Ein Kraftwerksblock drosselt seine Leistung', correct: [false, true] },
            { label: 'Steuerbare Lasten werden abgeschaltet', correct: [true, false] }
          ],
          feedback: 'Der Trick ist, immer auf die <b>Bilanz</b> zu schauen und nicht auf das Bauteil: Einspeisung hoch und Last herunter wirken gleich — beides ist positive Regelung. Einspeisung herunter und Last hoch sind beides negative Regelung.',
          wrongNote: 'Pumpen und Elektrolyse fühlen sich wie „Erzeugung" an, weil dabei Energie gespeichert wird. Für das Netz sind sie <b>Last</b> — und Last zuschalten ist negative Regelung.',
          deep: 'Diese Symmetrie ist der Grund, warum Lastmanagement überhaupt am Regelleistungsmarkt teilnehmen darf: Ein Elektrolyseur, der auf Zuruf abschaltet, leistet dasselbe wie ein Kraftwerk, das hochfährt — nur schneller und billiger. Beim Vorzeichen hilft eine Frage: <b>Wird die Lücke zwischen Erzeugung und Verbrauch dadurch kleiner oder größer?</b>'
        },

        {
          id: 10,
          type: 'forecast',
          eyebrow: 'Teil 2 · Lagebeurteilung',
          title: 'Einen Lastfall in der eigenen Zone bewerten',
          difficulty: 'schwer',
          prompt: 'In deiner Regelzone fällt ein Block mit 1200&nbsp;MW aus. Die Netzfrequenz sinkt auf <span class="hl">49,92 Hz</span> und bleibt dort stehen. Beurteile die Lage vollständig.',
          fields: [
            { kind: 'number', label: 'Frequenzabweichung von der Nennfrequenz', answer: 80, tol: 5, unit: 'mHz' },
            { kind: 'select', label: 'Welche Regelrichtung ist gefordert?',
              answer: 'positive Regelung',
              options: ['positive Regelung', 'negative Regelung', 'keine Regelung nötig'] },
            { kind: 'select', label: 'Wer erbringt die erste Stufe?',
              answer: 'alle anbietenden Kraftwerke gemeinsam',
              options: ['alle anbietenden Kraftwerke gemeinsam', 'der Übertragungsnetzbetreiber zentral', 'das ausgefallene Kraftwerk selbst'] },
            { kind: 'number', label: 'Netzleistungszahl der Zone',
              hint: 'Ausgefallene Leistung durch Abweichung in Hertz',
              answer: 15000, tol: 400, unit: 'MW/Hz' },
            { kind: 'select', label: 'Was räumt am Ende auf?',
              answer: 'die Tertiärregelung führt die Reserven zurück',
              options: ['die Tertiärregelung führt die Reserven zurück', 'die Primärregelung schaltet sich selbst ab', 'nichts, die Lage ist stabil'] }
          ],
          feedback: '50,000 − 49,920 = <b>80 mHz</b>. Es fehlt Einspeisung, also positive Regelung, erbracht von allen anbietenden Kraftwerken. λ = 1200&nbsp;MW / 0,080&nbsp;Hz = <b>15 000 MW/Hz</b>. Dass die Frequenz <i>stehen bleibt</i>, ist das Kennzeichen der Primärregelung: sie hält, aber sie führt nicht zurück.',
          wrongNote: 'Bei der Netzleistungszahl geht es fast immer an derselben Stelle schief: die Abweichung muss in <b>Hertz</b> eingesetzt werden, nicht in Millihertz. Mit 80 statt 0,080 kommt ein Tausendstel des richtigen Werts heraus.',
          deep: 'Die Netzleistungszahl ist das Maß für die Steifigkeit des Netzes, und 15&nbsp;000&nbsp;MW/Hz ist eine realistische Größenordnung für Kontinentaleuropa. Ein kleines Inselnetz hat eine viel kleinere Zahl — dort wirft derselbe Ausfall die Frequenz um ein Vielfaches. Genau darum ist der Verbund mit Nachbarn wertvoller als jede eigene Reserve, und genau darum ging es in Aufgabe 6.'
        },

        /* quelle: Lehrkurs Kapitel 4 „Die drei Regelstufen" */
        {
          id: 11,
          type: 'choice',
          multi: false,
          difficulty: 'mittel',
          eyebrow: 'Teil 2 · Einfachauswahl',
          title: 'Wer ruft die Sekundärregelleistung ab?',
          prompt: 'Die Primärregelung hat die Frequenz stabilisiert, aber nicht auf 50&nbsp;Hz ' +
                  'zurückgeführt. Wer fordert daraufhin die <span class="hl">Sekundärregelung</span> an?',
          options: [
            { text: 'Der Übertragungsnetzbetreiber der betroffenen Regelzone', correct: true },
            { text: 'Jeder Generator im Verbund entscheidet das selbstständig', correct: false },
            { text: 'Die europäische Dachorganisation der Netzbetreiber', correct: false },
            { text: 'Der Verteilnetzbetreiber am Ort des Kraftwerksausfalls', correct: false }
          ],
          feedback: 'Die Sekundärregelung ist <b>zentral</b>: Der Regelzonenführer erkennt, dass seine Zone die Abweichung verursacht hat, und ruft gezielt dort Leistung ab.',
          wrongNote: 'Selbstständig und dezentral arbeitet die <b>Primär</b>regelung — jeder Regler reagiert auf die Frequenz vor seiner eigenen Tür, ohne zu wissen, wo der Ausfall war. Genau deshalb braucht es danach eine zentrale Stufe.',
          deep: 'Die Arbeitsteilung ist der Kern des Verbundbetriebs: die Primärregelung hilft <i>allen</i> Zonen gleichzeitig und darf deshalb keine Absprache brauchen; die Sekundärregelung räumt auf und muss deshalb wissen, wer verursacht hat. Ohne die zweite Stufe bliebe die Reserve der Nachbarn dauerhaft gebunden — und beim nächsten Ausfall fehlte sie.'
        }
      ]
    }
  ]
});
