/* ============================================================================
   Intensiv_01_Netzrechnen.data.js — Showcase: Intensivkurs
   ---------------------------------------------------------------------------
   DUMMY-DATEN. Dieses Blatt gehört zum Showcase des Rahmenwerks und ist keine
   echte Lernstrecke. Es zeigt, was ein Aufgabenheft nicht zeigt:

     · `part.lead` — ein Theorieblock VOR dem Aufgabensatz. Der Inhalt steht in
       einem `<div class="theorie">`, das die Kapitel-Anmutung des `.lead-in`
       aufhebt und Fließtextmaß, Tabellen und eine Abbildung erlaubt.
     · `type: 'result'` — nur Endergebnisse. Vor der Abgabe ist der Rechenweg
       nicht einmal im DOM; erst danach erscheint der geprüfte Musterweg.
     · `verify` — jedes numerische Endergebnis wird von
       `tools/intensive-answer-check.mjs` mit einer zweiten Implementierung
       nachgerechnet. Ohne diese Regel ist der Lauf ROT.
     · `type: 'paper'` — auf Papier zeichnen, danach Kriterium für Kriterium
       selbst bewerten.

   Alle Zahlen sind gegengerechnet und mit Absicht glatt gewählt, damit man den
   Musterweg im Kopf nachvollziehen kann:

     Volllaststunden  3 942 000 kWh / 900 kW   = 4 380 h
     Benutzungsgrad   4 380 h / 8 760 h        = 50 %
     Gleichzeitigkeit 12 · 14 kW · 0,35        = 58,8 kW
     Spannungsfall    2 · 80 m · 63 A / (56 · 25) = 7,2 V
     Verlustkosten    28,8 kW · 4 380 h · 0,12 €/kWh = 15 137,28 €
   ============================================================================ */

WB.register({
  id: 'I01',
  kind: 'Intensivkurs',
  level: 'Intensivkurs 01 · Schritt 4 von 5',
  kicker: 'Intensivkurs 01 · Netz- und Anlagenrechnen',
  headline: 'Erst verstehen,<br><em>dann nur das Ergebnis.</em>',
  lede: 'Ein Theorieblock, danach Aufgaben, die keinen Rechenweg anbieten. Du rechnest ' +
        'auf Papier und trägst nur ein, was am Ende herauskommt.',

  intro: [
    'Ein Intensivkurs ist die Steigerungsform des Aufgabenhefts: kein Zwischenschritt wird ' +
    'vorgegeben, keine Formel eingeblendet, kein Feld vorausgefüllt. Das ist unangenehmer und ' +
    'genau deshalb das bessere Training — in einer Prüfung steht auch niemand daneben und fragt, ' +
    'ob der zweite Schritt schon stimmt.',
    'Der Theorieblock am Anfang ist kein Ersatz für den Lehrkurs, sondern das Gegenteil eines ' +
    'Nachschlagewerks: er nennt genau die vier Größen, die in den Aufgaben darunter vorkommen, ' +
    'und sonst nichts.'
  ],

  notes: [
    { text: '<b>Zweiter Versuch.</b> Ergebnisaufgaben bleiben Lernaufgaben: nach einem Fehlversuch gibt es genau eine zweite Chance. Erst der blattweite Klausurmodus schaltet sie ab.' },
    { text: '<b>Papieraufgabe.</b> Die Musterlösung erscheint erst, wenn du „Eigene Bearbeitung abgeschlossen" drückst. Vorher ist sie nicht im DOM — Vorbeischauen geht also nicht.', signal: true }
  ],

  parts: [

    /* ══════════════════════════════════════════════════════════════════════════
       Teil 1 · Theorieblock plus die drei Aufgaben, die daraus folgen
       ══════════════════════════════════════════════════════════════════════════ */
    {
      index: '01',
      eyebrow: 'Teil 1',
      title: 'Lastgang und Spannungsfall',
      count: '3 Aufgaben · nur Endergebnisse',
      lead:
        '<div class="theorie">' +

          '<h3>Vier Größen, mehr braucht dieser Teil nicht</h3>' +
          '<p>Ein Versorgungsnetz wird nicht nach der Summe aller Anschlussleistungen bemessen, ' +
          'sondern nach der Leistung, die <b>gleichzeitig</b> auftritt. Zwischen beiden liegt der ' +
          'Gleichzeitigkeitsfaktor, und er ist der Grund, warum ein Wohnhaus mit zwölf Küchen ' +
          'keinen Anschluss für zwölf Küchen braucht.</p>' +

          '<ol>' +
            '<li><b>Anschlussleistung</b> <span class="keyword">P<sub>A</sub></span> — was die Geräte könnten, wenn alle gleichzeitig liefen.</li>' +
            '<li><b>Gleichzeitigkeitsfaktor</b> <span class="keyword">g</span> — der Erfahrungswert, der daraus die tatsächliche Höchstlast macht.</li>' +
            '<li><b>Volllaststunden</b> <span class="keyword">T<sub>V</sub></span> — die Jahresenergie geteilt durch die Höchstlast. Sie sagt, wie lange das Netz bei Vollausnutzung gelaufen wäre.</li>' +
            '<li><b>Spannungsfall</b> <span class="keyword">ΔU</span> — was auf dem Weg zum Verbraucher verloren geht. Die Norm zieht die Grenze bei drei Prozent.</li>' +
          '</ol>' +

          '<div class="eq">T<sub>V</sub> = W<sub>a</sub> / P<sub>max</sub><span class="eq__note">Volllaststunden aus Jahresenergie und Höchstlast</span></div>' +
          '<div class="eq">ΔU = 2 · L · I / (κ · A)<span class="eq__note">Wechselstrom, Hin- und Rückleiter — deshalb die Zwei</span></div>' +

          '<p class="zitat">„Die Volllaststundenzahl ist keine Betriebsdauer. Sie ist eine Rechengröße, ' +
          'die den Lastgang eines Jahres auf ein Rechteck zusammenfasst."<br>' +
          '<span class="quelle">Dummy-Zitat · Showcase des Rahmenwerks</span></p>' +

          '<div class="table-wrap"><table>' +
            '<thead><tr><th>Größe</th><th>Formelzeichen</th><th>typischer Wert</th></tr></thead>' +
            '<tbody>' +
              '<tr><td>Gleichzeitigkeitsfaktor Wohnbau</td><td>g</td><td>0,25 … 0,40</td></tr>' +
              '<tr><td>Volllaststunden Haushalt</td><td>T<sub>V</sub></td><td>1 800 … 2 200 h</td></tr>' +
              '<tr><td>Volllaststunden Industrie</td><td>T<sub>V</sub></td><td>4 000 … 6 000 h</td></tr>' +
              '<tr><td>Leitfähigkeit Kupfer</td><td>κ</td><td>56 m/(Ω·mm²)</td></tr>' +
            '</tbody>' +
          '</table></div>' +

          '<figure>' +
            '<img src="../assets/img/schema-verbundnetz.svg" alt="Schematische Darstellung eines Verbundnetzes mit Erzeugung, Übertragung und Verteilung">' +
            '<figcaption>Dummy-Abbildung. Der Weg vom Kraftwerk zum Verbraucher — jede Stufe davon ' +
            'hat ihren eigenen Spannungsfall, und sie summieren sich.</figcaption>' +
          '</figure>' +

        '</div>',

      tasks: [

        /* quelle: Showcase-Dummy · Volllaststunden und Benutzungsgrad */
        {
          id: 1,
          type: 'result',
          exam: true,
          difficulty: 'schwer',
          eyebrow: 'Teil 1 · Nur Ergebnisse',
          title: 'Volllaststunden und Benutzungsgrad',
          prompt: 'Ein Ortsnetz gibt im Jahr <span class="hl">3 942 000 kWh</span> ab; die gemessene ' +
                  'Höchstlast beträgt <span class="hl">900 kW</span>. Trage nur die beiden Endergebnisse ein.',
          given: [
            { label: 'Jahresenergie W<sub>a</sub>', value: '3 942 000 kWh' },
            { label: 'Höchstlast P<sub>max</sub>', value: '900 kW' },
            { label: 'Stunden im Jahr', value: '8 760 h' }
          ],
          fields: [
            { kind: 'number', label: 'Volllaststunden T<sub>V</sub>', answer: 4380, tol: 1, unit: 'h' },
            { kind: 'number', label: 'Benutzungsgrad', answer: 50, tol: 0.5, unit: '%' }
          ],
          verify: [
            { field: 0, kind: 'quotient', args: [3942000, 900] },
            { field: 1, kind: 'percent', args: [4380, 8760] }
          ],
          solution: [
            'T<sub>V</sub> = W<sub>a</sub> / P<sub>max</sub> = 3 942 000 kWh / 900 kW = <b>4 380 h</b>.',
            'Der Benutzungsgrad setzt das ins Verhältnis zum Jahr: 4 380 h / 8 760 h = 0,5 = <b>50 %</b>.',
            'Ein Ortsnetz mit 50 % läge weit über dem Haushaltswert — das ist der Hinweis, dass hier ' +
            'ein gleichmäßiger Abnehmer mit im Netz hängt.'
          ],
          feedback: 'Beide Werte entstehen aus derselben Division, nur mit unterschiedlichem Bezug: einmal auf die Höchstlast, einmal auf das Jahr.',
          deep: 'Die Volllaststunden sind die Brücke zwischen Energie und Leistung, und sie entscheiden über die Wirtschaftlichkeit einer Anlage: eine Photovoltaikanlage in Deutschland erreicht rund 1 000 h, ein Grundlastkraftwerk über 7 000 h. Dieselbe Nennleistung liefert damit das Siebenfache an Energie — weshalb ein Vergleich zweier Anlagen über die installierte Leistung fast nie etwas aussagt.'
        },

        /* quelle: Showcase-Dummy · Gleichzeitigkeitsfaktor */
        {
          id: 2,
          type: 'result',
          exam: true,
          difficulty: 'schwer',
          eyebrow: 'Teil 1 · Nur Ergebnisse',
          title: 'Von der Anschlussleistung zur Höchstlast',
          prompt: 'Ein Mehrfamilienhaus hat <span class="hl">12 Wohnungen</span> mit je 14 kW ' +
                  'Anschlussleistung. Der Erfahrungswert für diese Größe liegt bei 0,35. Wie groß ist ' +
                  'die zu erwartende Höchstlast, und wie heißt der Kennwert, der die zwölf Wohnungen zusammenfasst?',
          given: [
            { label: 'Wohnungen', value: '12' },
            { label: 'Anschlussleistung je Wohnung', value: '14 kW' },
            { label: 'Erfahrungswert', value: '0,35' }
          ],
          fields: [
            { kind: 'number', label: 'Höchstlast P<sub>max</sub>', answer: 58.8, tol: 0.1, unit: 'kW' },
            { kind: 'text', label: 'Name des Kennwerts', answer: 'Gleichzeitigkeitsfaktor', aliases: ['g', 'Gleichzeitigkeitsfaktor g'] }
          ],
          verify: [
            { field: 0, kind: 'product', args: [12, 14, 0.35] }
          ],
          solution: [
            'Anschlussleistung insgesamt: 12 · 14 kW = 168 kW.',
            'Mit dem Gleichzeitigkeitsfaktor: 168 kW · 0,35 = <b>58,8 kW</b>.',
            'Der Kennwert heißt <b>Gleichzeitigkeitsfaktor</b> g. Er ist keine Sicherheitsreserve, ' +
            'sondern eine Beobachtung: niemand kocht, wäscht und lädt gleichzeitig wie alle Nachbarn.'
          ],
          feedback: 'Die Anschlussleistung wird zuerst summiert und dann einmal mit g multipliziert — nicht je Wohnung, denn g beschreibt das Zusammentreffen mehrerer Anschlüsse.',
          deep: 'Der Gleichzeitigkeitsfaktor sinkt mit der Zahl der Anschlüsse und läuft gegen einen Grenzwert. Für zwei Wohnungen liegt er nahe 1, für hundert unter 0,2. Wer ihn für ein großes Netz zu hoch ansetzt, baut Transformatoren, die nie ausgelastet werden — und wer ihn zu niedrig ansetzt, produziert die Abschaltungen, die man heute bei gleichzeitig ladenden Elektroautos diskutiert.'
        },

        /* quelle: Showcase-Dummy · Spannungsfall und Mindestquerschnitt */
        {
          id: 3,
          type: 'result',
          exam: true,
          difficulty: 'mittel',
          eyebrow: 'Teil 1 · Nur Ergebnisse',
          title: 'Spannungsfall und Mindestquerschnitt',
          prompt: 'Eine Kupferleitung von <span class="hl">80 m</span> Länge und 25 mm² Querschnitt ' +
                  'führt 63 A bei 230 V Wechselstrom. Wie groß ist der Spannungsfall, und welcher ' +
                  'Querschnitt wäre mindestens nötig, um die Drei-Prozent-Grenze einzuhalten?',
          given: [
            { label: 'Länge L', value: '80 m' },
            { label: 'Strom I', value: '63 A' },
            { label: 'Querschnitt A', value: '25 mm²' },
            { label: 'Leitfähigkeit κ', value: '56 m/(Ω·mm²)' },
            { label: 'Nennspannung', value: '230 V' }
          ],
          fields: [
            { kind: 'number', label: 'Spannungsfall ΔU', answer: 7.2, tol: 0.05, unit: 'V' },
            { kind: 'number', label: 'Mindestquerschnitt für 3 %', answer: 26.09, tol: 0.1, unit: 'mm²' }
          ],
          verify: [
            { field: 0, kind: 'quotient', args: [10080, 1400] },
            { field: 1, kind: 'quotient', args: [10080, 386.4] }
          ],
          solution: [
            'Zähler: 2 · L · I = 2 · 80 m · 63 A = 10 080. Nenner: κ · A = 56 · 25 = 1 400.',
            'ΔU = 10 080 / 1 400 = <b>7,2 V</b>, also 3,13 % von 230 V — die Grenze ist gerissen.',
            'Drei Prozent von 230 V sind 6,9 V. Mit κ · ΔU<sub>max</sub> = 56 · 6,9 = 386,4 folgt ' +
            'A ≥ 10 080 / 386,4 = <b>26,09 mm²</b>. Der nächste Normquerschnitt darüber ist 35 mm².'
          ],
          feedback: 'Die Zwei im Zähler ist der Rückleiter. Wer sie vergisst, landet bei 3,6 V und hält die Leitung für unbedenklich.',
          deep: 'Der Spannungsfall ist der Grund, warum Querschnitte in der Praxis fast nie thermisch bestimmt werden: 25 mm² Kupfer tragen 63 A problemlos, ohne warm zu werden. Nicht die Erwärmung, sondern die Länge entscheidet — und darum wird eine Leitung im Außenbereich schnell zwei Normstufen dicker als die Strombelastbarkeit verlangt.'
        }
      ]
    },

    /* ══════════════════════════════════════════════════════════════════════════
       Teil 2 · Papier, Zuordnung und Reihenfolge
       ══════════════════════════════════════════════════════════════════════════ */
    {
      index: '02',
      eyebrow: 'Teil 2',
      title: 'Zeichnen, ordnen, entscheiden',
      count: '5 Aufgaben · gemischt',
      lead: '<b>Musterbeispiel:</b> Ein Intensivkurs darf vor einem Aufgabensatz einen kurzen, ' +
            'vollständig gelösten Einstieg zeigen — hier: <i>Ein Netz mit 400 kW Höchstlast und ' +
            '1 752 000 kWh Jahresenergie hat 4 380 Volllaststunden, also denselben Benutzungsgrad ' +
            'wie in Aufgabe 1.</i>',
      tasks: [

        /* quelle: Showcase-Dummy · Papieraufgabe Einlinienschema */
        {
          id: 4,
          type: 'paper',
          difficulty: 'schwer',
          eyebrow: 'Teil 2 · Papieraufgabe',
          title: 'Einlinienschema über drei Spannungsebenen',
          prompt: 'Zeichne auf Papier das Einlinienschema eines Verbundnetzes mit drei ' +
                  'Spannungsebenen — <span class="hl">380 kV</span>, 110 kV und 20 kV —, zwei ' +
                  'Erzeugern und den Kupplungstransformatoren. Beschrifte jede Ebene und zeichne die ' +
                  'Abgänge der Verteilebene ein. Bewerte dich danach Kriterium für Kriterium.',
          timebox: '8 Minuten',
          checklist: [
            'Alle drei Spannungsebenen sind benannt (380 kV, 110 kV, 20 kV).',
            'Zwischen zwei benachbarten Ebenen steht genau ein Transformator.',
            'Jeder Erzeuger hängt über einen eigenen Maschinentransformator an seiner Ebene.',
            'Die Abgänge der Verteilebene sind als gerichtete Lasten gezeichnet.'
          ],
          solution: {
            image: '../assets/img/schema-verbundnetz.svg',
            alt: 'Dummy-Musterlösung: Einlinienschema mit den Ebenen 380 kV, 110 kV und 20 kV, zwei Erzeugern und Kupplungstransformatoren',
            html: '<p><b>Muster (Dummy):</b> Die 380-kV-Schiene trägt die Kupplung nach 110 kV, ' +
                  'von dort geht es über einen zweiten Transformator auf 20 kV; beide Erzeuger sind ' +
                  'über eigene Maschinentransformatoren angebunden, und die Verteilebene endet in ' +
                  'gerichteten Abgängen. Entscheidend ist nicht die Zeichenkunst, sondern dass jede ' +
                  'Ebenengrenze genau einmal und nur über einen Transformator überschritten wird.</p>'
          },
          feedback: 'Der häufigste Fehler ist ein zweites Bauteil zwischen zwei Ebenen — dann ist im Schema nicht mehr erkennbar, wo die Spannung tatsächlich wechselt.',
          deep: 'Ein Einlinienschema lässt die drei Leiter absichtlich weg: es zeigt Topologie, nicht Verdrahtung. Genau deshalb ist es das Erste, was man in einer Störung liest — man will wissen, was wovon getrennt werden kann, und nicht, welche Aderfarbe wo liegt.'
        },

        /* quelle: Showcase-Dummy · Maßnahmen gegen Spannungsfall */
        {
          id: 5,
          type: 'choice',
          multi: true,
          difficulty: 'mittel',
          eyebrow: 'Teil 2 · Mehrfachauswahl',
          title: 'Was senkt den Spannungsfall?',
          prompt: 'Der Spannungsfall einer bestehenden Leitung ist zu groß. Welche Maßnahmen ' +
                  'verringern ihn <span class="hl">rechnerisch</span>?',
          options: [
            { text: 'Ein größerer Leiterquerschnitt', correct: true },
            { text: 'Ein kürzerer Weg zum Verbraucher', correct: true },
            { text: 'Eine höhere Betriebsspannung', correct: true },
            { text: 'Aluminium anstelle von Kupfer', correct: false },
            { text: 'Ein weiterer Verbraucher am Ende', correct: false }
          ],
          feedback: 'Querschnitt und Länge stehen direkt in der Formel; die höhere Spannung senkt bei gleicher Leistung den Strom und damit den Spannungsfall doppelt.',
          deep: 'Aluminium hat mit κ ≈ 35 m/(Ω·mm²) rund zwei Drittel der Leitfähigkeit von Kupfer — derselbe Querschnitt fällt also stärker ab. Trotzdem wird im Verteilnetz überwiegend Aluminium verlegt: es ist bei gleicher Stromtragfähigkeit deutlich leichter und billiger, und man kompensiert die schlechtere Leitfähigkeit mit einer Normstufe mehr Querschnitt.'
        },

        /* quelle: Showcase-Dummy · Betriebsmittel und Eigenschaften */
        {
          id: 6,
          type: 'matrix',
          difficulty: 'schwer',
          eyebrow: 'Teil 2 · Raster',
          title: 'Welches Betriebsmittel kann was?',
          prompt: 'Kreuze für jedes Betriebsmittel an, welche Eigenschaft zutrifft.',
          columns: ['schaltet unter Last', 'trennt sichtbar', 'begrenzt Kurzschlussstrom'],
          rows: [
            { label: 'Leistungsschalter', correct: [true, false, true] },
            { label: 'Trennschalter', correct: [false, true, false] },
            { label: 'Schmelzsicherung', correct: [false, false, true] },
            { label: 'Lasttrennschalter', correct: [true, true, false] }
          ],
          feedback: 'Nur der Lasttrennschalter vereint Schalten unter Last und sichtbare Trennung — deshalb steht er in fast jeder Ortsnetzstation.',
          deep: 'Die sichtbare Trennstelle ist keine Bequemlichkeit, sondern Voraussetzung für die fünf Sicherheitsregeln: man muss die Trennung sehen können, bevor man an der Anlage arbeitet. Ein Leistungsschalter kann elektrisch alles, was nötig ist, ersetzt diese Sichtbarkeit aber nicht — und darum stehen in der Praxis beide hintereinander.'
        },

        /* quelle: Showcase-Dummy · Reihenfolge der Bemessung */
        {
          id: 7,
          type: 'order',
          difficulty: 'mittel',
          eyebrow: 'Teil 2 · Reihenfolge',
          title: 'In welcher Reihenfolge wird bemessen?',
          prompt: 'Bringe die Schritte der Leitungsbemessung in die Reihenfolge, in der sie ' +
                  'tatsächlich abgearbeitet werden.',
          items: [
            'Höchstlast aus Anschlussleistung und Gleichzeitigkeitsfaktor bestimmen',
            'Bemessungsstrom der Leitung berechnen',
            'Querschnitt nach Strombelastbarkeit wählen',
            'Spannungsfall prüfen und Querschnitt gegebenenfalls erhöhen',
            'Schutzorgan auf Leitung und Bemessungsstrom abstimmen'
          ],
          feedback: 'Die Strombelastbarkeit liefert den ersten Querschnitt, der Spannungsfall korrigiert ihn nach oben — nie umgekehrt.',
          deep: 'Die Reihenfolge ist nicht beliebig, weil jeder Schritt den nächsten einschränkt: das Schutzorgan muss zur Leitung passen, die Leitung zum Strom, der Strom zur Last. Wer mit dem Schutzorgan anfängt — weil es im Regal liegt — bemisst rückwärts und findet den Widerspruch erst auf der Baustelle.'
        },

        /* quelle: Showcase-Dummy · Netzverluste und Kosten */
        {
          id: 8,
          type: 'result',
          exam: true,
          difficulty: 'schwer',
          eyebrow: 'Teil 2 · Nur Ergebnisse',
          title: 'Was kosten die Netzverluste?',
          prompt: 'Dasselbe Ortsnetz aus Aufgabe 1 verliert <span class="hl">3,2 %</span> der ' +
                  'Höchstlast dauerhaft in den Leitungen. Rechne mit 4 380 Volllaststunden und ' +
                  '0,12 € je Kilowattstunde.',
          given: [
            { label: 'Höchstlast', value: '900 kW' },
            { label: 'Verlustanteil', value: '3,2 %' },
            { label: 'Volllaststunden', value: '4 380 h' },
            { label: 'Energiepreis', value: '0,12 €/kWh' }
          ],
          fields: [
            { kind: 'number', label: 'Verlustleistung', answer: 28.8, tol: 0.1, unit: 'kW' },
            { kind: 'number', label: 'Verlustenergie im Jahr', answer: 126144, tol: 10, unit: 'kWh' },
            { kind: 'number', label: 'Jahreskosten der Verluste', answer: 15137.28, tol: 1, unit: '€' }
          ],
          verify: [
            { field: 0, kind: 'product', args: [900, 0.032] },
            { field: 1, kind: 'product', args: [28.8, 4380] },
            { field: 2, kind: 'product', args: [126144, 0.12] }
          ],
          solution: [
            'Verlustleistung: 900 kW · 0,032 = <b>28,8 kW</b>.',
            'Verlustenergie: 28,8 kW · 4 380 h = <b>126 144 kWh</b>.',
            'Kosten: 126 144 kWh · 0,12 €/kWh = <b>15 137,28 €</b> im Jahr.',
            'Zum Vergleich: eine Normstufe mehr Querschnitt auf der Hauptstrecke kostet einmalig ' +
            'einen Bruchteil davon — deshalb ist die Verlustrechnung ein Investitionsargument und ' +
            'keine Fußnote.'
          ],
          feedback: 'Die drei Schritte hängen aneinander: ein Fehler im ersten wandert durch beide folgenden. Genau deshalb prüft das Blatt jedes Feld einzeln.',
          deep: 'Netzverluste liegen im deutschen Verteilnetz bei rund 4 bis 6 Prozent der transportierten Energie. Das klingt klein, ist aber in absoluten Zahlen die Größenordnung eines Kraftwerks — und es ist der Grund, warum Verluste in der Netzentgeltregulierung ausdrücklich als Kostenposition geführt werden, die ein Netzbetreiber senken darf und soll.'
        }
      ]
    }
  ]
});
