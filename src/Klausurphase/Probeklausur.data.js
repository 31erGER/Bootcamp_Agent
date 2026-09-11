/* ============================================================================
   Probeklausur.data.js — Showcase: Klausurmodus
   ---------------------------------------------------------------------------
   DUMMY-DATEN. NUR FÜR DIE KLAUSURPHASE relevant: Ein Bootcamp, das ein neues
   Thema aufarbeitet, hat keinen Prüfungstermin und braucht dieses Blatt nicht.
   Dann bleibt die Datei weg — Übersicht, Prüfwerkzeuge und Engine laufen ohne
   sie unverändert.

   Was dieses Blatt zeigt, das kein anderes zeigt:

     · `klausur: { minuten, bestehen, gesamt }` — ein Feld am Blatt schaltet
       fünf Dinge gleichzeitig um: Punkte je Aufgabe statt Basis × Multiplikator,
       kein Serienbonus, kein Zweitversuch, Rückmeldung und Lösung erst nach der
       Abgabe, Countdown in der Seitenleiste.
     · `punkte` je Aufgabe — Pflicht im Klausurmodus; die Summe MUSS
       `klausur.gesamt` treffen, sonst ist es ein FEHLER und kein Hinweis.
     · `source` je Aufgabe — die nachprüfbare Fundstelle. Erzwungen von
       `tools/probeklausur-quality-check.mjs`.
     · `part.lead` mit `.exam-reference` — eine vom Aufgabenblatt bereit-
       gestellte Referenz. Sie ist ausdrücklich KEINE Rechenvorschrift und als
       Beilage erkennbar abgesetzt.

   Kein `hint`, kein `formula` — nirgends. Beide Felder stünden vor der Abgabe
   im DOM und verrieten den Weg; das Prüfwerkzeug sucht sie rekursiv.

   Gegengerechnet:
     Netzleistungszahl  1 200 MW / 0,02 Hz          = 60 000 MW/Hz
     Volllaststunden    5 256 000 kWh / 1 200 kW    = 4 380 h
     Gleichzeitigkeit   24 · 14 kW · 0,30           = 100,8 kW
     Spannungsfall      2 · 80 m · 63 A / (56 · 25) = 7,2 V  →  3,13 %
     Mindestquerschnitt 10 080 / (56 · 6,9)         = 26,09 mm²
   ============================================================================ */

(() => {

  /* Die Klausurbeilage. Sie steht in `part.lead` und nicht im `intro`, damit sie
     dort auftaucht, wo sie gebraucht wird — und nicht auf der Höhe des
     Vorworts, wo man sie beim Rechnen zweimal sucht. */
  const normreihe = [
    ['1,5', '16', '13'], ['2,5', '22', '20'], ['4', '30', '25'], ['6', '37', '32'],
    ['10', '52', '50'], ['16', '68', '63'], ['25', '89', '80'], ['35', '110', '100']
  ];
  const beilage =
    '<aside class="exam-reference" aria-label="Normreihe des Aufgabenblatts">' +
      '<p><b>Vom Aufgabenblatt bereitgestellte Normreihe — keine Rechenvorschrift:</b> ' +
      'Kupfer κ = 56 m/(Ω·mm²), Aluminium κ = 35 m/(Ω·mm²), Grenze für den ' +
      'Spannungsfall 3 % der Nennspannung.</p>' +
      '<div class="table-wrap"><table class="refgrid">' +
        '<caption>Normquerschnitte, Strombelastbarkeit und passender Bemessungsstrom</caption>' +
        '<thead><tr><th scope="col">A in mm²</th><th scope="col">I<sub>z</sub> in A</th>' +
        '<th scope="col">I<sub>n</sub> in A</th></tr></thead>' +
        '<tbody>' + normreihe.map(([a, iz, i_n]) =>
          '<tr><th scope="row">' + a + '</th><td>' + iz + '</td><td>' + i_n + '</td></tr>').join('') +
        '</tbody>' +
      '</table></div>' +
    '</aside>';

  WB.register({
    id: 'PK',
    kind: 'Probeklausur',
    level: 'Beispielkurs · Schritt 5 von 5',
    kicker: 'Klausursimulation · 90 Minuten',
    headline: 'Selbst lösen.<br><em>Einmal abgeben.</em>',
    lede: 'Acht eigenständige Aufgaben, 100 Punkte, bestanden ab 50. Es gibt keine ' +
          'Rückmeldung, keine Lösung und keinen zweiten Versuch, solange die Klausur läuft.',
    klausur: { minuten: 90, bestehen: 50, gesamt: 100 },

    intro: [
      'Während der Bearbeitung verrät das Blatt nichts: kein Häkchen, keine Begründung, keine ' +
      'Vertiefung. Die vollständigen Musterwege erscheinen erst nach der Gesamtabgabe — und die ' +
      'passiert automatisch, sobald die letzte Aufgabe beantwortet ist, zusätzlich zum Knopf.',
      'Arbeite ohne eigene Hilfsmittel. Nur die im zweiten Teil ausdrücklich als Beilage ' +
      'markierte Normreihe darf verwendet werden. Bei der Papieraufgabe zeichnest du auf Papier ' +
      'und bewertest anschließend dich selbst.'
    ],

    notes: [
      { text: '<b>Dummy-Klausur.</b> Der Showcase des Rahmenwerks, nicht echtes Prüfungsmaterial. Die Zahlen sind gegengerechnet, die Fachaussagen bewusst schlicht.' },
      { text: '<b>Bewertung.</b> 100 Punkte, bestanden ab 50. Die Punkte je Aufgabe stehen in der Aufgabenzeile — plane die 18-Punkte-Aufgabe nicht wie eine 8er.', signal: true }
    ],

    parts: [

      /* ════════════════════════════════════════════════════════════════════════
         Teil 1 · Netzbetrieb — 30 Punkte
         ════════════════════════════════════════════════════════════════════════ */
      {
        index: '01', eyebrow: 'Netzbetrieb', title: 'Frequenzhaltung und Lastgang', count: '30 Punkte',
        tasks: [

          {
            id: 1, type: 'result', exam: true, difficulty: 'schwer', punkte: 12,
            source: 'Showcase-Dummy · Rahmenwerk, Regressionsfall Klausurmodus',
            eyebrow: 'Aufgabe 1 · 12 Punkte · Frequenzhaltung',
            title: 'Netzleistungszahl aus einem Kraftwerksausfall',
            prompt: 'In einer Regelzone fällt ein Block mit <span class="hl">1 200 MW</span> aus. ' +
                    'Die Frequenz sinkt gemessen um 20 mHz und bleibt dort stehen, bis die ' +
                    'Sekundärregelung greift. Trage die beiden Endergebnisse ein.',
            given: [
              { label: 'Ausgefallene Leistung', value: '1 200 MW' },
              { label: 'Frequenzabweichung', value: '20 mHz = 0,02 Hz' },
              { label: 'Nennfrequenz', value: '50 Hz' }
            ],
            fields: [
              { kind: 'number', label: 'Netzleistungszahl', answer: 60000, tol: 100, unit: 'MW/Hz' },
              { kind: 'number', label: 'Frequenz nach dem Ausfall', answer: 49.98, tol: 0.005, unit: 'Hz' }
            ],
            verify: [
              { field: 0, kind: 'quotient', args: [1200, 0.02] },
              { field: 1, kind: 'diff', args: [50, 0.02] }
            ],
            solution: [
              'Die Netzleistungszahl ist der Quotient aus Leistungssprung und Frequenzabweichung: ' +
              '1 200 MW / 0,02 Hz = <b>60 000 MW/Hz</b>.',
              'Die Frequenz selbst: 50 Hz − 0,02 Hz = <b>49,98 Hz</b>.',
              'Zur Einordnung: Kontinentaleuropa liegt bei 15 000 bis 25 000 MW/Hz. Ein Wert von ' +
              '60 000 wäre ein außergewöhnlich steifes Netz — hier ist er nur so gewählt, dass er ' +
              'im Kopf entsteht.'
            ],
            feedback: 'Die Netzleistungszahl beschreibt die Steifigkeit des Netzes. Sie ist eine Division, keine Multiplikation — wer den Bruch dreht, landet bei 24 MW/Hz.',
            deep: 'Die Netzleistungszahl ist der Grund, warum ein einzelner Kraftwerksausfall im europäischen Verbund Millihertz kostet und in einem Inselnetz Hertz. Sie entsteht aus der Summe aller Regelcharakteristiken der beteiligten Erzeuger — und genau deshalb ist der Verbund mit Nachbarn wertvoller als jede eigene Reserve.'
          },

          {
            id: 2, type: 'result', exam: true, difficulty: 'schwer', punkte: 10,
            source: 'Showcase-Dummy · Lastgangrechnung',
            eyebrow: 'Aufgabe 2 · 10 Punkte · Lastgang',
            title: 'Volllaststunden und Benutzungsgrad',
            prompt: 'Ein Industrieanschluss bezieht im Jahr <span class="hl">5 256 000 kWh</span> ' +
                    'bei einer Höchstlast von 1 200 kW.',
            given: [
              { label: 'Jahresenergie', value: '5 256 000 kWh' },
              { label: 'Höchstlast', value: '1 200 kW' },
              { label: 'Stunden im Jahr', value: '8 760 h' }
            ],
            fields: [
              { kind: 'number', label: 'Volllaststunden', answer: 4380, tol: 1, unit: 'h' },
              { kind: 'number', label: 'Benutzungsgrad', answer: 50, tol: 0.5, unit: '%' }
            ],
            verify: [
              { field: 0, kind: 'quotient', args: [5256000, 1200] },
              { field: 1, kind: 'percent', args: [4380, 8760] }
            ],
            solution: [
              '5 256 000 kWh / 1 200 kW = <b>4 380 h</b>.',
              '4 380 h / 8 760 h = 0,5 = <b>50 %</b>.',
              '4 380 Volllaststunden liegen im typischen Industriebereich (4 000 bis 6 000 h) — ' +
              'ein Haushalt käme auf rund 2 000 h.'
            ],
            feedback: 'Beide Werte kommen aus derselben Division mit unterschiedlichem Bezug: einmal Energie durch Leistung, einmal Stunden durch Jahresstunden.',
            deep: 'Der Benutzungsgrad entscheidet über den Tarif: ein Anschluss mit hoher Höchstlast und wenigen Volllaststunden belastet das Netz stärker als einer mit derselben Jahresenergie und gleichmäßigem Bezug. Genau darum wird im Industriestrom der Leistungspreis getrennt vom Energiepreis abgerechnet.'
          },

          {
            id: 3, type: 'choice', multi: true, difficulty: 'mittel', punkte: 8,
            source: 'Showcase-Dummy · Regelleistung',
            eyebrow: 'Aufgabe 3 · 8 Punkte · Regelleistung',
            title: 'Was leistet die Primärregelung?',
            prompt: 'Welche Aussagen über die Primärregelung im europäischen Verbundnetz sind richtig?',
            options: [
              { text: 'Sie wirkt in allen Regelzonen zugleich', correct: true },
              { text: 'Sie stabilisiert, führt aber nicht zurück', correct: true },
              { text: 'Sie wird einzeln vom Netzbetreiber abgerufen', correct: false },
              { text: 'Sie ersetzt die Sekundärregelung ganz', correct: false },
              { text: 'Sie startet erst nach fünf Minuten', correct: false }
            ],
            feedback: 'Die Primärregelung ist eine automatische Eigenschaft der beteiligten Maschinen und wirkt solidarisch — sie stabilisiert, ohne den Sollwert wiederherzustellen.',
            deep: 'Die Arbeitsteilung ist der Kern des Verbundgedankens: Primärregelung hält innerhalb von Sekunden die Frequenz, Sekundärregelung führt sie in Minuten auf 50 Hz zurück und gibt die Primärreserve wieder frei, Tertiärregelung ersetzt sie über den Fahrplan. Wer eine Stufe wegnimmt, verliert nicht Bequemlichkeit, sondern die Fähigkeit, den nächsten Ausfall zu überstehen.'
          }
        ]
      },

      /* ════════════════════════════════════════════════════════════════════════
         Teil 2 · Bemessung und Schutz — 36 Punkte
         ════════════════════════════════════════════════════════════════════════ */
      {
        index: '02', eyebrow: 'Bemessung', title: 'Anschlussleistung, Schutz und Selektivität', count: '36 Punkte',
        lead: beilage,
        tasks: [

          {
            id: 4, type: 'result', exam: true, difficulty: 'schwer', punkte: 14,
            source: 'Showcase-Dummy · Gleichzeitigkeitsrechnung',
            eyebrow: 'Aufgabe 4 · 14 Punkte · Anschlussleistung',
            title: 'Höchstlast eines Wohnblocks',
            prompt: 'Ein Wohnblock hat <span class="hl">24 Wohnungen</span> mit je 14 kW ' +
                    'Anschlussleistung; für diese Anschlusszahl gilt der Erfahrungswert 0,30. ' +
                    'Nenne die zu erwartende Höchstlast und den Namen dieses Erfahrungswerts.',
            given: [
              { label: 'Wohnungen', value: '24' },
              { label: 'Anschlussleistung je Wohnung', value: '14 kW' },
              { label: 'Erfahrungswert', value: '0,30' }
            ],
            fields: [
              { kind: 'number', label: 'Höchstlast', answer: 100.8, tol: 0.1, unit: 'kW' },
              { kind: 'text', label: 'Name des Erfahrungswerts', answer: 'Gleichzeitigkeitsfaktor', aliases: ['g', 'Gleichzeitigkeitsfaktor g'] }
            ],
            verify: [
              { field: 0, kind: 'product', args: [24, 14, 0.3] }
            ],
            solution: [
              'Anschlussleistung insgesamt: 24 · 14 kW = 336 kW.',
              '336 kW · 0,30 = <b>100,8 kW</b>.',
              'Der Erfahrungswert heißt <b>Gleichzeitigkeitsfaktor</b> g und sinkt mit der Zahl ' +
              'der Anschlüsse: bei 24 Wohnungen 0,30, bei zwei nahe 1.'
            ],
            feedback: 'Der Faktor wird einmal auf die Summe angewendet, nicht auf jede Wohnung einzeln — er beschreibt das Zusammentreffen, nicht den einzelnen Anschluss.',
            deep: 'Der Transformator dieses Wohnblocks wird auf gut 100 kW ausgelegt und nicht auf 336 kW. Ein Netz nach Summe der Anschlussleistungen wäre dreifach überbaut, teuer und dauerhaft im schlechten Wirkungsgradbereich — der Gleichzeitigkeitsfaktor ist damit keine Sparmaßnahme, sondern Voraussetzung eines wirtschaftlichen Netzes.'
          },

          {
            id: 5, type: 'paper', difficulty: 'schwer', punkte: 10,
            source: 'Showcase-Dummy · Papieraufgabe Selektivität',
            eyebrow: 'Aufgabe 5 · 10 Punkte · Papieraufgabe',
            title: 'Staffelung dreier Schutzorgane zeichnen',
            prompt: 'Zeichne auf Papier die Staffelung dreier hintereinanderliegender Schutzorgane ' +
                    '(Hausanschluss, Verteilung, Endstromkreis) als Strom-Zeit-Kennlinien. ' +
                    'Bewerte dich danach Kriterium für Kriterium.',
            timebox: '10 Minuten',
            checklist: [
              'Alle drei Kennlinien sind über Strom und Zeit aufgetragen, beide Achsen benannt.',
              'Die Kennlinien schneiden sich nicht — das ist die Bedingung für Selektivität.',
              'Das Schutzorgan am Endstromkreis löst bei jedem Strom zuerst aus.',
              'Der Bemessungsstrom nimmt von der Einspeisung zum Endstromkreis ab.'
            ],
            solution: {
              html: '<p><b>Muster (Dummy):</b> Drei fallende Kennlinien, von links unten (Endstromkreis, ' +
                    'kleinster Bemessungsstrom, kürzeste Zeit) nach rechts oben (Hausanschluss). ' +
                    'Entscheidend ist der Abstand: berühren sich zwei Kennlinien, gibt es einen ' +
                    'Strombereich, in dem beide Organe auslösen könnten — und dann fällt im Zweifel ' +
                    'das ganze Haus aus statt einer Steckdose.</p>'
            },
            feedback: 'Selektivität ist eine Aussage über die Kennlinien und nicht über die Nennwerte: zwei Sicherungen mit passenden Bemessungsströmen können sich trotzdem überschneiden.',
            deep: 'Selektivität ist der Grund, warum eine Fehlersuche im Haus überhaupt möglich ist: nur weil das kleinste Organ zuerst fällt, sagt die ausgelöste Sicherung, wo der Fehler steckt. Bei nicht selektiver Staffelung ist die Information zerstört — man weiß nur, dass irgendwo etwas war.'
          },

          {
            id: 6, type: 'matrix', difficulty: 'schwer', punkte: 12,
            source: 'Showcase-Dummy · Schutzorgane',
            eyebrow: 'Aufgabe 6 · 12 Punkte · Schutzorgane',
            title: 'Welches Organ erfüllt welche Aufgabe?',
            prompt: 'Kreuze für jedes Schutz- oder Schaltorgan an, welche Aussage zutrifft.',
            columns: ['schaltet unter Last', 'trennt sichtbar', 'wirkt selektiv gestaffelt'],
            rows: [
              { label: 'Leitungsschutzschalter', correct: [true, false, true] },
              { label: 'Trennschalter', correct: [false, true, false] },
              { label: 'Schmelzsicherung nach Bemessungsstrom', correct: [false, false, true] },
              { label: 'Lasttrennschalter', correct: [true, true, false] }
            ],
            feedback: 'Nur Organe mit Auslösekennlinie können selektiv gestaffelt werden. Ein Trennschalter hat keine — er schützt nicht, er trennt.',
            deep: 'Die Trennung der Funktionen ist Absicht: ein Organ, das gleichzeitig schaltet, sichtbar trennt und selektiv auslöst, wäre teuer und in jeder Einzelfunktion ein Kompromiss. Deshalb stehen in einer Ortsnetzstation drei verschiedene Bauteile hintereinander, obwohl eines elektrisch fast alles könnte.'
          }
        ]
      },

      /* ════════════════════════════════════════════════════════════════════════
         Teil 3 · Übertragung — 34 Punkte
         ════════════════════════════════════════════════════════════════════════ */
      {
        index: '03', eyebrow: 'Übertragung', title: 'Spannungsfall, Querschnitt und Netzformen', count: '34 Punkte',
        tasks: [

          {
            id: 7, type: 'result', exam: true, difficulty: 'schwer', punkte: 18,
            source: 'Showcase-Dummy · Spannungsfallrechnung',
            eyebrow: 'Aufgabe 7 · 18 Punkte · Spannungsfall',
            title: 'Spannungsfall, relativer Wert und Mindestquerschnitt',
            prompt: 'Eine Kupferleitung von <span class="hl">80 m</span> Länge mit 25 mm² führt 63 A ' +
                    'bei 230 V Wechselstrom. Nenne den Spannungsfall, seinen Anteil an der ' +
                    'Nennspannung und den Querschnitt, der die Drei-Prozent-Grenze gerade einhält.',
            given: [
              { label: 'Länge', value: '80 m' },
              { label: 'Strom', value: '63 A' },
              { label: 'Querschnitt', value: '25 mm²' },
              { label: 'Nennspannung', value: '230 V' }
            ],
            fields: [
              { kind: 'number', label: 'Spannungsfall', answer: 7.2, tol: 0.05, unit: 'V' },
              { kind: 'number', label: 'Anteil an der Nennspannung', answer: 3.13, tol: 0.05, unit: '%' },
              { kind: 'number', label: 'Mindestquerschnitt für 3 %', answer: 26.09, tol: 0.1, unit: 'mm²' }
            ],
            verify: [
              { field: 0, kind: 'quotient', args: [10080, 1400] },
              { field: 1, kind: 'percent', args: [7.2, 230] },
              { field: 2, kind: 'quotient', args: [10080, 386.4] }
            ],
            solution: [
              'Zähler 2 · 80 m · 63 A = 10 080, Nenner 56 · 25 = 1 400, also ΔU = <b>7,2 V</b>.',
              'Anteil: 7,2 V / 230 V = <b>3,13 %</b> — die Grenze ist knapp gerissen.',
              'Drei Prozent sind 6,9 V; mit 56 · 6,9 = 386,4 folgt A ≥ 10 080 / 386,4 = ' +
              '<b>26,09 mm²</b>. Nach der Beilage ist der nächste Normquerschnitt 35 mm².',
              'Die Beilage hätte den Weg nicht verraten: sie nennt κ und die Grenze, aber keine Formel.'
            ],
            feedback: 'Der dritte Wert ist keine neue Rechnung, sondern dieselbe nach A umgestellt. Wer den Faktor 2 nur an einer Stelle einsetzt, erhält zwei zueinander widersprüchliche Ergebnisse.',
            deep: 'Dass 25 mm² Kupfer 63 A thermisch mühelos tragen und die Leitung trotzdem zu dünn ist, ist der eigentliche Lerninhalt: Strombelastbarkeit und Spannungsfall sind zwei unabhängige Bedingungen, und bei langen Wegen gewinnt fast immer der Spannungsfall. Deshalb steht er in der Bemessungsreihenfolge nach der Belastbarkeit und korrigiert deren Ergebnis nach oben.'
          },

          {
            id: 8, type: 'cloze', difficulty: 'mittel', punkte: 16,
            source: 'Showcase-Dummy · Netzformen',
            eyebrow: 'Aufgabe 8 · 16 Punkte · Netzformen',
            title: 'Netzform und Schutzleiter',
            prompt: 'Vervollständige die Beschreibung der Netzformen.',
            segments: [
              { kind: 'text', text: 'Im ' },
              { kind: 'select', answer: 'TN-System', distractors: ['TT-System', 'IT-System'] },
              { kind: 'text', text: ' ist der Sternpunkt des Transformators direkt geerdet und der Schutzleiter wird vom Netzbetreiber mitgeführt. Im ' },
              { kind: 'select', answer: 'TT-System', distractors: ['TN-C-System', 'TN-S-System'] },
              { kind: 'text', text: ' hat die Anlage einen eigenen Erder, weshalb dort in der Praxis fast immer eine Fehlerstrom-Schutzeinrichtung nötig ist. Der Buchstabe, der den Zustand des Sternpunkts beschreibt, steht an ' },
              { kind: 'select', answer: 'erster Stelle', distractors: ['zweiter Stelle', 'letzter Stelle'] },
              { kind: 'text', text: '. Ein System, in dem Schutz- und Neutralleiter in einem Leiter zusammengefasst sind, heißt ' },
              { kind: 'select', answer: 'TN-C', distractors: ['TN-S', 'TN-D'] },
              { kind: 'text', text: ', und es darf ab einem Querschnitt unterhalb der Norm nicht mehr eingesetzt werden.' }
            ],
            feedback: 'Der erste Buchstabe beschreibt immer die Erdung der Stromquelle, der zweite die des Körpers der Anlage — daraus ergibt sich der Rest von selbst.',
            deep: 'Die Netzform entscheidet darüber, welcher Schutz überhaupt funktionieren kann: im TN-System fließt bei einem Körperschluss ein hoher Kurzschlussstrom, der die Sicherung auslöst; im TT-System reicht der Strom über den eigenen Erder dafür meist nicht, und nur eine Fehlerstrom-Schutzeinrichtung erkennt den Fehler. Wer die Netzform nicht kennt, kann die Schutzmaßnahme nicht prüfen.'
          }
        ]
      }
    ]
  });

})();
