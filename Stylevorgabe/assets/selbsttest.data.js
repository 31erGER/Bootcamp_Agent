/* ============================================================================
   selbsttest.data.js — je eine Aufgabe pro Typ
   ---------------------------------------------------------------------------
   Das Regressionsblatt des Rahmenwerks. Es enthält von jedem der neun
   Aufgabentypen genau eine Instanz. Nach jeder Änderung an engine.js,
   styles.css oder validate.js einmal durchlaufen lassen:

     assets/selbsttest.html#pruefen

   Erwartung: 185 von 185 Punkten, alle neun Aufgaben gelöst, alle
   Auszeichnungen, keine Konsolenfehler, keine Redaktionsfehler.

   Die 185 setzen sich zusammen aus 170 Aufgabenpunkten (10 · Multiplikator je
   Aufgabe, der Rechenweg 3 Schritte × 10 + 10 Abschluss) und 15 Serienbonus:
   neun Aufgaben ohne Fehler ergeben dreimal die Serie ×3.

   Der Inhalt ist echtes Prüfungswissen zu Verbundnetzen — damit dient die Datei
   gleichzeitig als Vorlage: wer ein neues Blatt schreibt, kopiert sich hier den
   Aufbau je Typ heraus. Alle Zahlen sind gegengerechnet:

     Netzfrequenz Europa 50 Hz · Bahnstrom 16,7 Hz · Nordamerika 60 Hz
     Primärregelung vollständig abgerufen bei 200 mHz Abweichung
     Primärregelung zu 50 % nach 15 s, zu 100 % nach 30 s
     Netzleistungszahl λ = ΔP / Δf; 900 MW / 0,060 Hz = 15 000 MW/Hz
       — Größenordnung für Kontinentaleuropa: 15 000 bis 25 000 MW/Hz
     1500 MW Ausfall bei λ = 15 000 MW/Hz ⇒ 0,100 Hz = 100 mHz
   ============================================================================ */

WB.register({
  id: 'SELBSTTEST',
  kind: 'Selbsttest',
  level: 'Rahmenwerk',
  kicker: 'Selbsttest · alle neun Aufgabentypen',
  headline: 'Neun Typen,<br><em>ein Durchlauf.</em>',
  lede: 'Wenn dieses Blatt die volle Punktzahl erreicht und alle Auszeichnungen vergibt, ' +
        'trägt die Engine. Wenn nicht, sagt die Prüfleiste unten, woran es liegt.',
  minutes: 20,
  trace: 'M0,34 C60,34 90,30 120,22 S180,6 240,10 S300,30 360,34 C420,36 450,30 480,22 S540,6 600,10 S660,30 720,34 L800,34',

  intro: [
    'Dieses Blatt prüft nicht dein Wissen, sondern das Rahmenwerk. Es enthält von jedem ' +
      'Aufgabentyp genau eine Instanz, und zwar mit echtem Inhalt — so ist es gleichzeitig die ' +
      'Vorlage, aus der man sich beim Schreiben eines neuen Blattes den Aufbau je Typ herauskopiert.',
    'Die Prüfleiste unten führt den Selbstlauf aus: sie trägt in jede Aufgabe die richtige Antwort ' +
      'ein und klickt den echten Prüfknopf. Damit ist auch die Verdrahtung geprüft und nicht bloß ' +
      'die Bewertungsfunktion.'
  ],
  notes: [
    { text: '<b>Nach jeder Änderung</b> an <code>engine.js</code>, <code>styles.css</code> oder ' +
            '<code>validate.js</code> dieses Blatt einmal durchlaufen lassen.' },
    { text: '<b>Breiten getrennt prüfen:</b> <code>assets/breiten.html?page=selbsttest.html</code> — ' +
            'headless-Chromium klemmt <code>--window-size</code> bei 478 px fest.', signal: true }
  ],

  parts: [
    {
      index: '01',
      eyebrow: 'Teil 1',
      title: 'Auswahl, Lücke, Zuordnung',
      count: '3 Aufgaben',
      tasks: [

        /* ───────────────────────────────────────────── choice ───────────── */
        {
          id: 1,
          type: 'choice',
          multi: false,
          eyebrow: 'Teil 1 · Einfachauswahl',
          title: 'Die Netzfrequenz im europäischen Verbundnetz',
          difficulty: 'leicht',
          prompt: 'Welche Aussage über die <span class="hl">Nennfrequenz</span> des kontinentaleuropäischen Verbundnetzes trifft zu?',
          options: [
            { text: 'Sie liegt bei 50 Hz und gilt europaweit einheitlich', correct: true },
            { text: 'Sie liegt bei 60 Hz wie in Nordamerika üblich', correct: false },
            { text: 'Sie liegt bei 16,7 Hz wie im Bahnstromnetz', correct: false },
            { text: 'Sie wird je Regelzone eigenständig festgelegt', correct: false }
          ],
          feedback: 'Im gesamten Synchrongebiet Kontinentaleuropa gilt <b>eine</b> Frequenz von 50 Hz — sie ist überall im Netz zu jedem Zeitpunkt dieselbe.',
          wrongNote: '16,7 Hz und 60 Hz gibt es wirklich, nur nicht hier: 16,7 Hz im deutschen Bahnstromnetz, 60 Hz in Nordamerika. Beide sind eigene Synchrongebiete.',
          deep: 'Dass die Frequenz überall gleich ist, ist genau der Grund, warum sie als <b>Regelgröße</b> taugt: jeder Netzbetreiber sieht am selben Messwert, ob europaweit zu viel oder zu wenig eingespeist wird. Ein Ungleichgewicht von 900 MW senkt sie um rund 60 mHz — siehe Aufgabe 9.'
        },

        /* ───────────────────────────────────────────── cloze ────────────── */
        {
          id: 2,
          type: 'cloze',
          eyebrow: 'Teil 1 · Lückentext',
          title: 'Was nach einem Kraftwerksausfall passiert',
          difficulty: 'schwer',
          prompt: 'Ergänze die <span class="hl">Reihenfolge und die Zuständigkeiten</span> der Frequenzhaltung.',
          segments: [
            { kind: 'text', text: 'Fällt ein Kraftwerksblock aus, sinkt die Frequenz. Als erstes greift die ' },
            { kind: 'select', answer: 'Primärregelung', distractors: ['Sekundärregelung', 'Minutenreserve'] },
            { kind: 'text', text: '. Sie ist nach ' },
            { kind: 'select', answer: '30 Sekunden', distractors: ['30 Minuten', '3 Sekunden'] },
            { kind: 'text', text: ' vollständig abgerufen und wird von ' },
            { kind: 'select', answer: 'allen Regelzonen gemeinsam', distractors: ['der betroffenen Regelzone allein', 'dem größten Kraftwerk'] },
            { kind: 'text', text: ' erbracht. Sie stabilisiert die Frequenz, führt sie aber ' },
            { kind: 'select', answer: 'nicht auf 50 Hz zurück', distractors: ['sofort auf 50 Hz zurück', 'auf 49 Hz herunter'] },
            { kind: 'text', text: ' — das ist Aufgabe der ' },
            { kind: 'select', answer: 'Sekundärregelung', distractors: ['Momentanreserve', 'Primärregelung'] },
            { kind: 'text', text: '.' }
          ],
          feedback: 'Die Primärregelung ist <b>solidarisch</b>: alle Regelzonen des Synchrongebiets beteiligen sich, unabhängig davon, wo der Ausfall war. Sie hält die Frequenz an, lässt aber eine bleibende Abweichung stehen.',
          deep: 'Die bleibende Abweichung ist kein Mangel, sondern Absicht: nur so bleibt für die Sekundärregelung ein Signal übrig, an dem sie erkennt, <b>welche</b> Zone das Ungleichgewicht verursacht hat. Sie führt die Frequenz zurück und entlastet gleichzeitig die Primärregelung, damit die für den nächsten Ausfall wieder bereitsteht.'
        },

        /* ───────────────────────────────────────────── dnd ──────────────── */
        {
          id: 3,
          type: 'dnd',
          eyebrow: 'Teil 1 · Zuordnung',
          title: 'Fünf Begriffe der Systemführung',
          difficulty: 'mittel',
          prompt: 'Ordne jedem <span class="hl">Begriff</span> seine Beschreibung zu.',
          poolLabel: 'Beschreibung',
          targetLabel: 'Begriff',
          pairs: [
            { key: 'momentan', term: 'Momentanreserve',
              description: 'Kommt ohne jede Regelung aus der Trägheit rotierender Massen' },
            { key: 'primaer', term: 'Primärregelung',
              description: 'Stabilisiert die Frequenz binnen 30 Sekunden, solidarisch von allen Zonen' },
            { key: 'sekundaer', term: 'Sekundärregelung',
              description: 'Führt die Frequenz auf 50 Hz zurück und entlastet die Primärregelung' },
            { key: 'minute', term: 'Minutenreserve',
              description: 'Wird von Hand abgerufen und löst die Sekundärregelung ab' },
            { key: 'zone', term: 'Regelzone',
              description: 'Gebiet, in dem ein Übertragungsnetzbetreiber die Bilanz verantwortet' }
          ],
          feedback: 'Die vier Stufen greifen zeitlich gestaffelt ineinander: <b>Trägheit</b> in Millisekunden, <b>Primär</b> in Sekunden, <b>Sekundär</b> in Minuten, <b>Minutenreserve</b> darüber. Jede löst die vorige ab, damit die schnelle Reserve wieder frei wird.',
          deep: 'Die Momentanreserve ist die einzige Stufe ohne Regler — sie ist reine Physik. Genau deshalb ist sie ein Thema der Energiewende: Umrichter-gekoppelte Anlagen wie Wind und Photovoltaik bringen von sich aus keine rotierende Masse mit, und die Trägheit des Netzes sinkt. Sie muss dann nachgebildet werden.'
        }
      ]
    },
    {
      index: '02',
      eyebrow: 'Teil 2',
      title: 'Reihenfolge, Bild, Skala',
      count: '3 Aufgaben',
      tasks: [

        /* ───────────────────────────────────────────── order ────────────── */
        {
          id: 4,
          type: 'order',
          eyebrow: 'Teil 2 · Reihenfolge',
          title: 'Der Ablauf eines Kraftwerksausfalls',
          difficulty: 'leicht',
          prompt: 'Bringe die fünf Vorgänge in ihre <span class="hl">zeitliche Folge</span>.',
          items: [
            'Ein Kraftwerksblock fällt aus, die Einspeisung bricht weg',
            'Die rotierenden Massen geben Trägheit ab, die Frequenz sinkt',
            'Die Primärregelung greift und hält die Frequenz an',
            'Die Sekundärregelung führt sie auf 50 Hz zurück',
            'Die Minutenreserve löst die Sekundärregelung ab'
          ],
          feedback: 'Die Reihenfolge ist keine Konvention, sondern eine Folge der Zeitkonstanten: die Trägheit wirkt sofort, weil sie nichts entscheiden muss.',
          deep: 'Der letzte Schritt wird oft übersehen. Er ist der wichtigste für den <b>nächsten</b> Ausfall: solange die Sekundärregelung abgerufen bleibt, fehlt sie als Reserve. Die Minutenreserve übernimmt deshalb die Dauerlast, damit die schnellen Stufen wieder frei werden.'
        },

        /* ───────────────────────────────────────────── hotspot ─────────── */
        {
          id: 5,
          type: 'hotspot',
          eyebrow: 'Teil 2 · Kartenarbeit',
          title: 'Vier Stellen im Netzschema',
          difficulty: 'schwer',
          prompt: 'Das Schema zeigt drei Spannungsebenen, aber <span class="hl">keine Deutung</span> — nur die Spannungswerte. Markiere der Reihe nach die Übertragungsebene, den Transformator zwischen den Ebenen, die Verteilebene und die Einspeisung des Großkraftwerks.',
          /* Ohne assets/ davor, weil dieses Blatt selbst IN assets/ liegt. Ein
             echtes Blatt liegt eine Ebene höher und schreibt hier
             'assets/img/schema-verbundnetz.svg'. */
          image: 'img/schema-verbundnetz.svg',
          imageAlt: 'Schematisches Verbundnetz mit drei Spannungsebenen, Transformatoren, einem Großkraftwerk links und einer dezentralen Einspeisung rechts',
          zones: [
            { x: 34.4, y: 22, r: 5, label: 'Übertragungsebene' },
            { x: 50, y: 50.4, r: 5, label: 'Transformator zwischen den Ebenen' },
            { x: 31.25, y: 84, r: 5, label: 'Verteilebene' },
            { x: 18.75, y: 51.6, r: 5, label: 'Einspeisung des Großkraftwerks' }
          ],
          feedback: 'Die Spannungswerte tragen die ganze Antwort: <b>380 kV</b> ist Übertragung über große Entfernung, <b>20 kV</b> ist Verteilung zum Abnehmer. Zwei ineinandergreifende Kreise sind immer ein Transformator, ein Kreis mit Sinuswelle immer eine Maschine.',
          wrongNote: 'Die Pfeile nach unten sind Abnehmer, keine Einspeisung. Einspeisung erkennt man am Maschinensymbol — dem Kreis mit der Sinuswelle.',
          deep: 'Warum überhaupt drei Ebenen: die Übertragungsverluste sinken mit dem Quadrat des Stroms, und bei gleicher Leistung sinkt der Strom mit steigender Spannung. 380 kV statt 20 kV bedeutet den 19-fach kleineren Strom und damit rund <b>360-mal</b> kleinere Verluste auf derselben Leitung. Deshalb wird für die Strecke hochgespannt und erst beim Abnehmer wieder herunter.'
        },

        /* ───────────────────────────────────────────── estimate ─────────── */
        {
          id: 6,
          type: 'estimate',
          eyebrow: 'Teil 2 · Schätzen',
          title: 'Wann ist die Primärregelung ausgeschöpft?',
          difficulty: 'mittel',
          prompt: 'Bei welcher <span class="hl">Frequenzabweichung</span> ist die gesamte Primärregelleistung des Synchrongebiets abgerufen?',
          answer: 200,
          tol: 40,
          unit: 'mHz',
          min: 0,
          max: 600,
          step: 10,
          feedback: 'Bei <b>200 mHz</b>, also bei 49,80 oder 50,20 Hz. Darüber hinaus gibt es keine Primärreserve mehr — was dann noch fehlt, muss durch Lastabwurf gedeckt werden.',
          deep: 'Die Auslegung folgt dem größten anzunehmenden Einzelausfall: das Synchrongebiet hält rund 3000 MW Primärreserve vor, und die soll bei 200 mHz vollständig, aber eben auch <b>gerade erst</b> ausgeschöpft sein. Bei 49,80 Hz beginnt deshalb der abgestufte Lastabwurf, bei 47,50 Hz trennen sich Kraftwerke vom Netz — das ist die Schwelle, hinter der ein Blackout steht.'
        }
      ]
    },
    {
      index: '03',
      eyebrow: 'Teil 3',
      title: 'Raster, Prognose, Rechenweg',
      count: '3 Aufgaben',
      tasks: [

        /* ───────────────────────────────────────────── matrix ──────────── */
        {
          id: 7,
          type: 'matrix',
          eyebrow: 'Teil 3 · Raster',
          title: 'Welche Stufe in welchem Zeitbereich?',
          difficulty: 'schwer',
          prompt: 'Kreuze an, in welchem Zeitbereich die jeweilige Stufe wirkt. <span class="hl">Genau ein Kreuz</span> je Zeile.',
          rowHeader: 'Stufe',
          columns: ['bis 30 s', '30 s bis 5 min', 'ab 5 min'],
          rows: [
            { label: 'Momentanreserve aus rotierenden Massen', correct: [true, false, false] },
            { label: 'Primärregelung', correct: [true, false, false] },
            { label: 'Sekundärregelung', correct: [false, true, false] },
            { label: 'Minutenreserve', correct: [false, false, true] }
          ],
          feedback: 'Momentanreserve und Primärregelung liegen beide im Sekundenbereich — das ist kein Fehler im Raster, sondern der Punkt: die Trägheit überbrückt genau die Zeit, bis die Primärregelung greift.',
          wrongNote: 'Die Namen führen in die Irre. „Minutenreserve" wirkt nicht ab einer Minute, sondern wird innerhalb von 15 Minuten bereitgestellt und dann stundenlang gehalten.',
          deep: 'Aus der Staffelung folgt eine Kostenlogik: schnelle Reserve ist teuer, langsame billig. Deshalb wird jede Stufe so früh wie möglich von der nächsten abgelöst — nicht aus technischer Not, sondern weil eine Sekunden-Reserve zu wertvoll ist, um eine Stunde lang gebunden zu bleiben.'
        },

        /* ───────────────────────────────────────────── forecast ─────────── */
        {
          id: 8,
          type: 'forecast',
          eyebrow: 'Teil 3 · Lagebeurteilung',
          title: 'Einen Lastfall bewerten',
          difficulty: 'schwer',
          prompt: 'In einer Regelzone fällt ein Block mit 700 MW aus. Die Netzfrequenz sinkt auf <span class="hl">49,85 Hz</span> und bleibt dort. Beurteile die Lage.',
          fields: [
            { kind: 'number', label: 'Frequenzabweichung von der Nennfrequenz', answer: 150, tol: 10, unit: 'mHz' },
            { kind: 'select', label: 'Welche Stufe hält die Frequenz gerade?',
              answer: 'die Primärregelung', options: ['die Primärregelung', 'die Sekundärregelung', 'die Minutenreserve'] },
            { kind: 'select', label: 'Wer erbringt sie?',
              answer: 'alle Regelzonen gemeinsam', options: ['alle Regelzonen gemeinsam', 'nur die betroffene Regelzone', 'der Netzbetreiber mit der größten Last'] },
            { kind: 'select', label: 'Was muss als nächstes geschehen?',
              answer: 'die betroffene Zone ruft Sekundärregelung ab',
              options: ['die betroffene Zone ruft Sekundärregelung ab', 'die Frequenz darf bei 49,85 Hz bleiben', 'es wird sofort Last abgeworfen'] }
          ],
          feedback: '50,000 − 49,850 = <b>150 mHz</b>. Dass die Frequenz stehen bleibt, ist das Kennzeichen der Primärregelung: sie hält, aber sie führt nicht zurück. Die betroffene Zone muss jetzt Sekundärregelung abrufen — sie hat das Ungleichgewicht verursacht und trägt es auch.',
          wrongNote: 'Lastabwurf ist bei 150 mHz weit entfernt: der beginnt erst bei 200 mHz Abweichung, wenn die Primärreserve ausgeschöpft ist.',
          deep: 'Dass die <b>verursachende</b> Zone nachregeln muss und nicht die solidarische Gemeinschaft, ist der eigentliche Kunstgriff des Verbundbetriebs: die schnelle Hilfe kommt von allen, die Rechnung zahlt der Verursacher. Ohne diese Trennung gäbe es keinen Anreiz, den eigenen Bilanzkreis auszugleichen.'
        },

        /* ───────────────────────────────────────────── calc ────────────── */
        {
          id: 9,
          type: 'calc',
          eyebrow: 'Teil 3 · Rechenweg',
          title: 'Netzleistungszahl aus einem Ausfall bestimmen',
          difficulty: 'schwer',
          prompt: 'Ein Block mit 900 MW fällt aus. Die Frequenz sinkt von 50,000 auf 49,940 Hz und bleibt dort. Bestimme die <span class="hl">Netzleistungszahl</span> des Synchrongebiets — und was ein größerer Ausfall bewirkt hätte.',
          given: [
            { label: 'ausgefallene Leistung ΔP', value: '900 MW' },
            { label: 'Frequenz vorher', value: '50,000 Hz' },
            { label: 'Frequenz nachher', value: '49,940 Hz' },
            { label: 'Vergleichsfall', value: 'Ausfall von 1500 MW' }
          ],
          steps: [
            {
              label: 'Frequenzabweichung',
              answer: 60,
              tol: 2,
              unit: 'mHz',
              hint: 'Die Differenz der beiden Frequenzen in Hertz, dann in Millihertz umrechnen.'
            },
            {
              label: 'Netzleistungszahl',
              formula: 'λ = ΔP / Δf',
              answer: 15000,
              tol: 300,
              unit: 'MW/Hz',
              hint: 'Ausgefallene Leistung geteilt durch die Abweichung — und zwar in Hertz, nicht in Millihertz. Genau dort geht es meistens schief.'
            },
            {
              label: 'Abweichung beim Vergleichsfall',
              formula: 'Δf = ΔP / λ',
              answer: 100,
              tol: 5,
              unit: 'mHz',
              hint: 'Dieselbe Beziehung, nur nach der Abweichung aufgelöst. Das Ergebnis wieder in Millihertz.'
            }
          ],
          feedback: '50,000 − 49,940 = 0,060 Hz. Damit λ = 900 / 0,060 = <b>15 000 MW/Hz</b>. Ein Ausfall von 1500 MW ergäbe 1500 / 15 000 = 0,100 Hz, also <b>100 mHz</b> — die Frequenz fiele auf 49,90 Hz.',
          deep: 'Die Netzleistungszahl ist das Maß für die Steifigkeit des Netzes. Für Kontinentaleuropa liegt sie bei 15 000 bis 25 000 MW/Hz — ein einzelner Kraftwerksausfall bewegt die Frequenz deshalb um Millihertz und nicht um Hertz. Ein kleines Inselnetz hat eine viel kleinere Zahl, und dort wirft derselbe Ausfall die Frequenz um ein Vielfaches. Genau darum ist der Verbund mit Nachbarn wertvoller als jede eigene Reserve.'
        }
      ]
    }
  ]
});
