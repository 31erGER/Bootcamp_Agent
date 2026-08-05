/* ============================================================================
   Modul_03_Verbundnetze.data.js — die Aufgaben als Daten
   ---------------------------------------------------------------------------
   18 Aufgaben, 9 davon schwer, alle neun Aufgabentypen. Die zwölf Aufgaben der
   alten Fassung sind inhaltlich unverändert übernommen — Aufgabenstellung,
   Begründung und Vertiefung stammen wörtlich aus dem Markup von 2026.

   Was sich geändert hat und WARUM:

   · Antwortlängen ausgeglichen. Vorher war in vier Aufgaben die längste Antwort
     die richtige (Nr. 5, 6, 10, 12 der alten Zählung). Wer nichts weiß, klickt
     die längste — und lag damit systematisch richtig. validate.js meldet das
     jetzt, und die Optionen sind darauf umgeschrieben.
   · Sechs neue Aufgaben, alle `schwer`, für die sechs Typen, die es vorher nicht
     gab. Damit sind 9 von 18 schwer: die eigene Regel „die Hälfte ist schwer"
     wird zum ersten Mal erfüllt.

   Fachlich gegengerechnet:
     Toleranzband 50 Hz ± 0,2 Hz · Eingreifschwelle Primärregelung 0,02 Hz
     Primär binnen 30 s, dezentral · Sekundär ≤ 5 min, zentral vom ÜNB
     Tertiär ab Minute 5, führt die Reserven zurück
     λ = ΔP / Δf; 1200 MW / 0,080 Hz = 15 000 MW/Hz
     78 000 MW · 1,2 = 93 600 MW; Reserve 15 600 MW; 15 600 / 1300 = 12
   ============================================================================ */

WB.register({
  id: 'M03',
  kind: 'Aufgabenheft',
  level: 'Meisterschule · Energieversorgung',
  kicker: 'Modul 03a · Verbundnetze',
  headline: 'Ein Kontinent,<br><em>eine Frequenz.</em>',
  lede: 'Vom Deutschen Netzregelverbund über die Regelzonen bis zur UCTE: ' +
        '18 Aufgaben zu Aufbau und Spielregeln des Verbundnetzes — wer hält die 50&nbsp;Hz, ' +
        'wer springt ein, wenn ein Kraftwerk ausfällt, und warum ist Deutschland die ' +
        'Drehscheibe Europas?',
  minutes: 90,
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

    /* ════════════════════════════════════════════════════════════════════════
       TEIL 1 · Das Verbundnetz und seine Akteure
       ════════════════════════════════════════════════════════════════════════ */
    {
      index: '01',
      eyebrow: 'Teil 1',
      title: 'Das Verbundnetz &amp; seine Akteure',
      count: '6 Aufgaben · leicht bis schwer',
      tasks: [

        {
          id: 1,
          type: 'dnd',
          eyebrow: 'Teil 1 · Zuordnung',
          title: 'Wer macht was im deutschen Stromnetz?',
          difficulty: 'leicht',
          prompt: 'Das deutsche Elektroenergiesystem kennt klar verteilte Rollen. Ordne jedem <span class="hl">Begriff</span> die passende Beschreibung zu.',
          poolLabel: 'Beschreibung',
          targetLabel: 'Begriff',
          pairs: [
            { key: 'uenb', term: 'Übertragungsnetzbetreiber',
              description: 'Vier Betreiber kontrollieren den Höchstspannungsbereich und bilden gemeinsam den „Deutschen Netzregelverbund"' },
            { key: 'vnb', term: 'Verteilnetzbetreiber',
              description: 'Rund 900 kleinere Betreiber, die die elektrische Energie bis zum Endverbraucher liefern' },
            { key: 'bna', term: 'Bundesnetzagentur',
              description: 'Bundesbehörde, die die Nutzungsentgelte für die Netze festlegt' },
            { key: 'rz', term: 'Regelzone',
              description: 'Gebiet, in dem alle Kraftwerke miteinander parallelgeschaltet sind und gemeinsam geregelt werden' }
          ],
          feedback: 'Merke die Zweiteilung des Stromnetzes: <b>Übertragung</b> (Höchstspannung, 4 ÜNB) und <b>Verteilung</b> (rund 900 VNB bis zum Endverbraucher). Die Bundesnetzagentur reguliert die Nutzungsentgelte.',
          deep: 'Das Stromnetz („Elektroenergiesystem") besteht physisch aus <b>Freileitungen, Erdkabeln sowie Schalt- und Umspannwerken</b>. Die vier deutschen ÜNB heißen 50Hertz, Amprion, TenneT und TransnetBW — jeder verantwortet eine eigene Regelzone, die im Netzregelverbund koordiniert werden. Die Spannungsebenen dahinter (Höchst- bis Niederspannung) vertiefst du in Modul 03b.'
        },

        {
          id: 2,
          type: 'choice',
          multi: true,
          eyebrow: 'Teil 1 · Mehrfachauswahl',
          title: 'Wozu die Kraftwerksreserve von rund 20&nbsp;%?',
          difficulty: 'mittel',
          prompt: 'In jeder Regelzone wird eine <span class="hl">Leistungs- bzw. Kraftwerksreserve von rund 20&nbsp;%</span> vorgehalten. Welche Ausfallursachen soll diese Reserve laut Folien abfangen?',
          options: [
            { text: 'Geplante Wartungen und Revisionen von Kraftwerken', correct: true },
            { text: 'Kompensation der Blindleistung auf langen Übertragungsleitungen', correct: false },
            { text: 'Stilllegungen wegen nicht erfüllter Umweltauflagen', correct: true },
            { text: 'Wassermangel, etwa fehlendes Kühlwasser im Sommer', correct: true },
            { text: 'Brennstoffkosten beziehungsweise Brennstoffmangel', correct: true },
            { text: 'Abdeckung der Leitungsverluste im Übertragungsnetz', correct: false }
          ],
          feedback: 'Die Reserve dient dem <b>Abfangen von Kraftwerksausfällen</b> — geplant (Wartung) wie ungeplant (Umweltauflagen, Wasser- und Brennstoffmangel).',
          wrongNote: 'Blindleistung und Leitungsverluste sind reale Themen des Netzbetriebs, aber nicht der Zweck der 20-%-Reserve.',
          deep: 'Zwei Zahlen gehören zusammen: Innerhalb der Regelzone sind alle Kraftwerke <b>parallelgeschaltet</b>, und mit steigender übertragener Leistung wird die <b>Spannung erhöht</b>, um die Leistungsverluste zu minimieren (P<sub>V</sub> = I²·R — halbe Stromstärke bedeutet ein Viertel der Verluste). Blindleistung und ihre Kompensation bekommen später ein eigenes Modul (08). Wie groß die Reserve in Megawatt wird, rechnest du in Aufgabe 6.'
        },

        {
          id: 3,
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

        {
          id: 4,
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

        /* ── NEU ── */
        {
          id: 5,
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
          id: 6,
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

    /* ════════════════════════════════════════════════════════════════════════
       TEIL 2 · Frequenzhaltung und Regelleistung
       ════════════════════════════════════════════════════════════════════════ */
    {
      index: '02',
      eyebrow: 'Teil 2',
      title: 'Frequenzhaltung &amp; Regelleistung',
      count: '8 Aufgaben · leicht bis schwer',
      tasks: [

        {
          id: 7,
          type: 'choice',
          multi: false,
          eyebrow: 'Teil 2 · Einfachauswahl',
          title: 'Was macht die Netzlast mit dem Generator?',
          difficulty: 'leicht',
          prompt: 'Die Netzfrequenz wird von den <span class="hl">Synchrongeneratoren</span> großer Kraftwerke vorgegeben. Was passiert, wenn die Netzlast schlagartig steigt?',
          options: [
            { text: 'Der Läufer wird gebremst, Drehzahl und Netzfrequenz sinken mit der Last', correct: true },
            { text: 'Der Generator beschleunigt, weil mehr Strom fließt, und die Frequenz steigt', correct: false },
            { text: 'Die Drehzahl bleibt konstant, nur die Spannung bricht kurzzeitig ein', correct: false },
            { text: 'Der Generator fällt außer Tritt und trennt sich selbsttätig vom Netz', correct: false }
          ],
          feedback: 'Mehr Last bedeutet ein stärkeres Gegenmoment an der Welle. Der Läufer wird gebremst, mit der Drehzahl sinkt die Frequenz — die Frequenz ist also der <b>Lastmesser des gesamten Verbundnetzes</b>.',
          wrongNote: 'Denke mechanisch, nicht elektrisch: Der Generator ist eine rotierende Masse, an der die Last „zieht".',
          deep: 'Die <b>Trägheit der Generatorläufer</b> ist die unsichtbare erste Verteidigungslinie („Momentanreserve"): Die in der rotierenden Masse gespeicherte kinetische Energie fängt jeden Laststoß ab, noch bevor irgendeine Regelung eingreift. Genau deshalb ist der wachsende Anteil umrichterbasierter Erzeuger (PV, moderne Windkraft — Modul 02c) eine Herausforderung: Sie bringen von sich aus keine rotierende Masse mit.'
        },

        {
          id: 8,
          type: 'choice',
          multi: false,
          eyebrow: 'Teil 2 · Einfachauswahl',
          title: 'Wann greift die Primärregelung?',
          difficulty: 'mittel',
          prompt: 'Die Sollfrequenz beträgt 50&nbsp;Hz ± 0,2&nbsp;Hz. Ab welcher Abweichung und wie schnell greift die <span class="hl">Primärregelung</span>?',
          options: [
            { text: 'Ab 0,02 Hz Abweichung, über die Turbinenleistung, binnen 30 Sekunden', correct: true },
            { text: 'Erst ab 0,2 Hz, wenn das Toleranzband der Netzfrequenz verlassen wird', correct: false },
            { text: 'Ab 0,02 Hz Abweichung, zentral vom Netzbetreiber, binnen 5 Minuten', correct: false },
            { text: 'Erst ab 0,2 Hz, und dann durch sofortigen Lastabwurf in der Zone', correct: false }
          ],
          feedback: 'Die Primärregelung ist die <b>Sekundenreserve</b>: Sie wartet nicht, bis das Toleranzband gerissen ist, sondern reagiert schon ab 0,02&nbsp;Hz Abweichung — binnen 30&nbsp;Sekunden vollständig, und sie muss die Leistung länger als 15&nbsp;Minuten halten können.',
          wrongNote: '„Zentral vom Netzbetreiber, binnen 5 Minuten" beschreibt die Sekundärregelung — nicht die Primärregelung.',
          deep: 'Wichtiges Detail: Die Primärregelleistung wird <b>dezentral von allen Kraftwerken bereitgestellt, die sie anbieten</b> — jede Turbine öffnet ihre Ventile ein Stück, das gesamte Verbundnetz hilft solidarisch mit. Das Verhältnis der Zahlen lohnt das Merken: Toleranzband ± 0,2&nbsp;Hz, Eingreifschwelle 0,02&nbsp;Hz — Faktor 10 Sicherheitsabstand. Die Schwelle schätzt du in Aufgabe 12.'
        },

        {
          id: 9,
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

        {
          id: 10,
          type: 'cloze',
          eyebrow: 'Teil 2 · Lückentext',
          title: 'Positive und negative Regelung',
          difficulty: 'schwer',
          prompt: 'Ergänze die <span class="hl">Regelrichtungen</span> und die zeitlichen Grenzen der Regelstufen.',
          segments: [
            { kind: 'text', text: 'Sinkt die Netzfrequenz unter den Sollwert, ist ' },
            { kind: 'select', answer: 'positive', distractors: ['negative', 'tertiäre'] },
            { kind: 'text', text: ' Regelung erforderlich: Es wird zusätzlich eingespeist — oder alternativ ' },
            { kind: 'select', answer: 'Netzlast abgeschaltet',
              distractors: ['Netzlast zugeschaltet', 'die Erregung reduziert'] },
            { kind: 'text', text: '. Ist die Frequenz zu hoch, wird die Einspeisung ' },
            { kind: 'select', answer: 'reduziert',
              distractors: ['erhöht', 'auf die Nachbarzone verlagert'] },
            { kind: 'text', text: ' oder es werden Lasten eingeschaltet. Die Sekundärregelung führt Regelleistung nach spätestens ' },
            { kind: 'select', answer: '5 Minuten', distractors: ['30 Sekunden', '15 Minuten'] },
            { kind: 'text', text: ' zu. Die Tertiärregelung dient der ' },
            { kind: 'select', answer: 'Rückführung der Regelreserven',
              distractors: ['Vorgabe der Netzfrequenz', 'Dämpfung von Laststößen'] },
            { kind: 'text', text: '.' }
          ],
          feedback: 'Das Vorzeichen bezieht sich auf die <b>Bilanz der Einspeisung</b>: positiv bedeutet mehr Leistung ins Netz (oder Last heraus), negativ weniger Leistung ins Netz (oder Last hinein).',
          wrongNote: 'Frequenz zu niedrig heißt Leistungsmangel — es fehlt Einspeisung, also positiv nachregeln.',
          deep: 'Dass „Lasten einschalten" als negative Regelleistung zählt, ist der Kern moderner <b>Lastmanagement-Konzepte</b>: Steuerbare Verbraucher (Wärmepumpen, Ladeparks, Elektrolyseure) können Regelleistung anbieten, ohne dass ein einziges Kraftwerk seine Ventile bewegt — das Smart-Grid-Thema aus Modul 02c. Die Tertiärregelung räumt danach auf: Sie stellt Primär- und Sekundärreserve wieder her, damit das Netz für den nächsten Ausfall gewappnet ist. Das Vorzeichen übst du an sechs Fällen in Aufgabe 13.'
        },

        /* ── NEU ── */
        {
          id: 11,
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
          id: 12,
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
          id: 13,
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
          id: 14,
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
        }
      ]
    },

    /* ════════════════════════════════════════════════════════════════════════
       TEIL 3 · Europäischer Verbund und Ausblick
       ════════════════════════════════════════════════════════════════════════ */
    {
      index: '03',
      eyebrow: 'Teil 3',
      title: 'Europäischer Verbund &amp; Ausblick',
      count: '4 Aufgaben · leicht bis schwer',
      tasks: [

        {
          id: 15,
          type: 'dnd',
          eyebrow: 'Teil 3 · Zuordnung',
          title: 'Die großen Verbundnetze Europas',
          difficulty: 'schwer',
          prompt: 'Vier große Verbundsysteme prägen Europa und seine Nachbarn. Ordne jedem System seine <span class="hl">Kennzahlen</span> zu — die Bevölkerungszahl ist dein bester Anker.',
          poolLabel: 'Kennzahlen',
          targetLabel: 'Verbundsystem',
          pairs: [
            { key: 'ucte', term: 'Kontinentaleuropa (UCTE)',
              description: '631 GW installierte Leistung · 390 GW Spitzenlast · 2530 TWh/a · 450 Mio. Bürger in 20 Ländern' },
            { key: 'ips', term: 'Russland/GUS (IPS/UPS)',
              description: '337 GW installierte Leistung · 215 GW Spitzenlast · 1285 TWh/a · 280 Mio. Einwohner' },
            { key: 'nordel', term: 'Skandinavien (Ex-NORDEL)',
              description: '94 GW installierte Leistung · 405 TWh/a Verbrauch · nur 24 Mio. Einwohner' },
            { key: 'ngeso', term: 'Großbritannien (National Grid ESO)',
              description: '85 GW installierte Leistung · 400 TWh/a Verbrauch · 65 Mio. Einwohner' }
          ],
          feedback: 'Skandinavien und Großbritannien sind bei der installierten Leistung fast gleichauf (94 gegen 85&nbsp;GW) — der Unterschied steckt in der Bevölkerung: 24 gegen 65&nbsp;Mio. Skandinavien hat also einen auffällig hohen Verbrauch pro Kopf (Elektroheizung, energieintensive Industrie).',
          deep: 'Die <b>UCTE</b> koordinierte den westeuropäischen Verbundbetrieb: 20 Länder, 450&nbsp;Mio. Bürger. Interessant ist das Verhältnis 631&nbsp;GW installiert zu 390&nbsp;GW Spitzenlast — der Abstand ist die europäische Version der Kraftwerksreserve aus den Aufgaben 2 und 6. UCTE und die europäischen ÜNB waren in der <b>ETSO</b> zusammengeschlossen; seit 2009 bündelt die Nachfolgeorganisation <b>ENTSO-E</b> beide Rollen.'
        },

        {
          id: 16,
          type: 'choice',
          multi: true,
          eyebrow: 'Teil 3 · Mehrfachauswahl',
          title: 'Synchron oder asynchron gekoppelt?',
          difficulty: 'schwer',
          prompt: 'Welche Aussagen zur <span class="hl">internationalen Kopplung</span> der Verbundnetze sind richtig?',
          options: [
            { text: 'Nordafrika ist kein UCTE-Mitglied, ist aber synchron mit Kontinentaleuropa gekoppelt', correct: true },
            { text: 'Eine asynchrone HGÜ-Kupplung verlangt, dass beide Netze dieselbe Frequenz halten', correct: false },
            { text: 'Großbritannien und Skandinavien hängen teils synchron, teils über HGÜ am Verbund', correct: true },
            { text: 'Deutschland ist die Drehscheibe Zentraleuropas und braucht ein starkes Netz', correct: true },
            { text: 'In der ETSO waren die europäischen Verteilnetzbetreiber zusammengeschlossen', correct: false }
          ],
          feedback: 'Synchron heißt: gemeinsame Frequenz, gemeinsames Schicksal. Asynchron über HGÜ heißt: Energie fließt, aber die Frequenzen bleiben <b>entkoppelt</b> — jedes Netz regelt selbst.',
          wrongNote: 'ETSO war der Verband der europäischen Übertragungsnetzbetreiber, nicht der Verteilnetzbetreiber. Und die HGÜ-Kupplung ist gerade dafür da, unterschiedliche Frequenzen zu verkraften.',
          deep: 'Die HGÜ-Kupplung wirkt wie eine <b>Brandschutztür</b>: Störungen und Frequenzeinbrüche des Nachbarnetzes bleiben draußen, weil die Gleichstromstrecke keine Frequenz überträgt. Genau deshalb ist Großbritannien trotz Seekabel-Anbindung ein eigenes Regelgebiet — und deshalb hilft seine Reserve bei einem Ausfall auf dem Kontinent nicht mit. Die Technik dahinter kommt im Kabel-Teil dieses Moduls (03c).'
        },

        {
          id: 17,
          type: 'choice',
          multi: false,
          eyebrow: 'Teil 3 · Einfachauswahl',
          title: 'Das europäische Netz in Zahlen',
          difficulty: 'leicht',
          prompt: 'Welche <span class="hl">Kennzahlen</span> beschreiben das gesamte europäische Hochspannungsnetz (Stand 2019)?',
          options: [
            { text: '485.000 km Leitungslänge und rund 1.152.000 MW installierte Leistung', correct: true },
            { text: '48.500 km Leitungslänge und rund 115.000 MW installierte Leistung', correct: false },
            { text: '485.000 km Leitungslänge und rund 1.152 MW installierte Leistung', correct: false },
            { text: '4,85 Mio. km Leitungslänge und rund 11,5 Mio. MW installierte Leistung', correct: false }
          ],
          feedback: '485.000&nbsp;km Leitungslänge und 1.152.017&nbsp;MW — also gut 1.150&nbsp;GW installierte Leistung.',
          wrongNote: 'Achte auf die Größenordnungen: 1.152&nbsp;MW wäre gerade ein einziges Großkraftwerk.',
          deep: 'Zur Einordnung: 485.000&nbsp;km entsprechen etwa dem <b>Zwölffachen des Erdumfangs</b> — nur für die Hochspannungsebene, die Verteilnetze kommen noch obendrauf. Und die 1.152.017&nbsp;MW installierte Leistung passen zur UCTE-Tabelle aus Aufgabe&nbsp;15: Kontinentaleuropa allein stellt davon 631&nbsp;GW.'
        },

        {
          id: 18,
          type: 'choice',
          multi: false,
          eyebrow: 'Teil 3 · Einfachauswahl · Fachgespräch',
          title: 'Desertec: Strom aus der Sahara',
          difficulty: 'mittel',
          prompt: 'Die Desertec-Industrie-Initiative will Solarenergie aus <span class="hl">küstennahen Randgebieten der Sahara</span> für den lokalen Bedarf und Mitteleuropa nutzen. Was gilt laut Folien als Hauptkriterium für den Erfolg?',
          options: [
            { text: 'Die Energiespeicherung und der Transport der Energie nach Westeuropa', correct: true },
            { text: 'Der Wirkungsgrad der Solarmodule bei den hohen Wüstentemperaturen', correct: false },
            { text: 'Ein Beitritt der nordafrikanischen Staaten zum UCTE-Verbund', correct: false },
            { text: 'Die Verfügbarkeit von Kühlwasser für die Kraftwerke in der Sahara', correct: false }
          ],
          feedback: 'Erzeugen ist nicht das Problem — <b>speichern und transportieren</b> schon. Die Initiative prüft dazu die politische, wirtschaftliche und technische Machbarkeit.',
          wrongNote: 'Nordafrika ist bereits synchron gekoppelt (Aufgabe 16) — am Netzanschluss scheitert die Idee nicht.',
          deep: 'Gutes Fachgespräch-Argument: Für die Distanz Sahara–Mitteleuropa ist die <b>HGÜ</b> die Transporttechnik der Wahl — bei weit über 600&nbsp;km Übertragungsstrecke ist Gleichspannung wirtschaftlicher als Drehstrom, weil die Leitungsinduktivitäten entfallen (Details in Modul 03c). Verknüpfe das mit Modul 02a: Solarthermische Kraftwerke könnten über Wärmespeicher sogar nachts liefern und so das Speicherproblem entschärfen.'
        }
      ]
    }
  ]
});
