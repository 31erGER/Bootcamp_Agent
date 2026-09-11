/* ============================================================================
   Modul_01_Signale.data.js — Aufgabenheft zu Modul 01 „Signale und Spektren"

   QUELLEN
   -------
   Modul_01_Signale_Lehrkurs.html   die zehn Kapitel dieses Moduls, Schritt 1
   Showcase-Dummy                   erfundenes Fachthema, gegengerechnete Zahlen

   Jede Aufgabe trägt einen quelle-Kommentar. Das ist keine Buchhaltung: der
   Folienabgleich am Ende eines Auftrags arbeitet genau diese Liste ab, Aufgabe
   für Aufgabe, und eine Aufgabe ohne Quelle fällt dabei auf.

   ══ WAS DIESES HEFT VORFÜHRT ══════════════════════════════════════════════
   Alle ELF Aufgabenarten für ein Lernblatt, jede GENAU EINMAL, in elf Aufgaben.
   Elf und nicht zehn, weil Einfach- und Mehrfachauswahl getrennt zählen: sie
   teilen sich zwar den Typnamen `choice`, verlangen vom Lernenden aber
   Verschiedenes — bei der einen ist genau eine Aussage wahr, bei der anderen
   weiß man vorher nicht einmal, wie viele.

   Genau einmal ist die Regel, seit dem 11.09.2026: das Heft ist Showcase und
   Kopiervorlage, und ein Typ, der zweimal vorkommt, sagt nichts, was der erste
   nicht schon gesagt hat — er verlängert nur die Vorlage. Wer ein echtes Heft
   baut, nimmt selbstverständlich mehrere Aufgaben je Typ; hier ist die
   Vollständigkeit der Zweck, nicht der Umfang.

   Beide Auswahlarten stehen in JEDEM Heft, seit dem 11.09.2026: Aufgabe 1 ist
   die Einfachauswahl, Aufgabe 10 die Mehrfachauswahl.

   Die beiden klausurnahen Typen `result` und `paper` stehen bewusst NICHT hier,
   sondern im Intensivkurs unter Klausurphase/ — ein normales Lernmodul zeigt
   den Weg, eine Prüfung verbirgt ihn.

   ══ REDAKTIONSSTANDARD ════════════════════════════════════════════════════
   `WB.validateReport` muss VÖLLIG LEER sein, nicht bloß fehlerfrei. Das ist
   strenger als es klingt und der Grund für ein paar Formulierungen, die sonst
   willkürlich aussehen:

     · Antwortmöglichkeiten sind ähnlich lang. Wer die längste anklickt, soll
       damit nicht systematisch richtig liegen — und die längste darf schon gar
       nicht die richtige sein.
     · Kein Fettdruck in einer Antwortmöglichkeit. Er zieht das Auge hin und
       verrät sie. Im Aufgabentext ist Fettdruck erwünscht, in den Optionen nie.
     · Mindestens drei Distraktoren je Auswahllücke, mindestens drei Paare je
       Zuordnung, mindestens drei Elemente je Reihenfolge.
     · Die Hälfte der Aufgaben ist schwer. Hier sind es sechs von elf.
     · `wrongNote` überall, wo es einen naheliegenden Fehler GIBT — nicht als
       Pflichtfeld, sondern weil die Rückmeldung nach einer falschen Antwort der
       einzige Moment ist, in dem man wirklich liest.

   ══ GEGENGERECHNET ════════════════════════════════════════════════════════
     T = 4 ms                    →  f = 1/T   = 250 Hz
     ω = 2 · π · 250 Hz          →  1 570,80 rad/s
     3. Harmonische von 250 Hz   →  750 Hz
     Rechteck, 3. Harmonische    →  1/3 der Grundamplitude = 33,3 %
     Rechteck, Effektivwert      →  gleich der Amplitude (Tastgrad 50 %)
   ============================================================================ */

WB.register({
  id: 'M01',
  kind: 'Aufgabenheft',
  level: 'Modul 01 · Schritt 2 von 3',
  kicker: 'Modul 01 · Signale und Spektren',
  headline: 'Ein Signal,<br><em>seine Frequenzen.</em>',
  lede: 'Elf Aufgaben über alle elf Aufgabenarten eines Lernblatts, jede genau einmal: was eine ' +
        'Periode mit einer Frequenz zu tun hat, warum ein Rechteck keine geraden Harmonischen ' +
        'hat und was ein Spektrum überhaupt zeigt.',

  intro: [
    'Das Aufgabenheft ist der zweite Schritt des Moduls. Der Lehrkurs davor hat die Begriffe ' +
    'aufgebaut, das Lab danach lässt dich ein Spektrum von Hand zeichnen — hier wird geprüft, ' +
    'ob die Begriffe tragen.',
    'Nach jeder falschen Antwort gibt es genau einen zweiten Versuch zu halben Punkten, danach ' +
    'die Lösung mit Begründung und Vertiefung. Die Vertiefung ist der Grund, warum auch ein ' +
    'falsch geratener Klick etwas wert ist.'
  ],

  notes: [
    { text: '<b>Dummy-Inhalt.</b> Dieses Modul ist der Showcase des Rahmenwerks. Die Zahlen sind gegengerechnet, das Fachthema ist als Beispiel gewählt.' },
    { text: '<b>Zeichnung zum Anfassen.</b> Der Regler unter der Kurve zeigt, wie aus wenigen Sinussen ein Rechteck wird. Das ist die Aufgabe 4 in Bewegung.', signal: true }
  ],

  parts: [

    /* ══════════════════════════════════════════════════════════════════════════
       Teil 1 · Begriffe und Zusammenhänge
       ══════════════════════════════════════════════════════════════════════════ */
    {
      index: '01',
      eyebrow: 'Teil 1',
      title: 'Periode, Frequenz, Spektrum',
      count: '5 Aufgaben · leicht bis schwer',
      tasks: [

        /* quelle: Lehrkurs Kapitel 2 „Bausteine: Sinus & Frequenz" */
        {
          id: 1,
          type: 'choice',
          multi: false,
          difficulty: 'leicht',
          eyebrow: 'Teil 1 · Einfachauswahl',
          title: 'Was ist die Grundschwingung?',
          prompt: 'Ein periodisches Signal wird in reine Sinusschwingungen zerlegt. Was ist dabei ' +
                  'die <span class="hl">Grundschwingung</span>?',
          options: [
            { text: 'Der Sinus mit der niedrigsten vorkommenden Frequenz', correct: true },
            { text: 'Der Sinus mit der größten vorkommenden Amplitude', correct: false },
            { text: 'Der Mittelwert des Signals über eine Periode', correct: false },
            { text: 'Die Summe aller Sinusse mit gerader Ordnung', correct: false }
          ],
          feedback: 'Die Grundschwingung ist über die <b>Frequenz</b> definiert, nicht über die Amplitude: sie hat dieselbe Periode wie das Signal selbst.',
          wrongNote: 'Meist ist die Grundschwingung auch die größte — aber nicht immer. Bei einem Signal mit unterdrückter Grundwelle ist sie sogar null, und die Periode bleibt trotzdem dieselbe.',
          deep: 'Der Mittelwert über eine Periode hat einen eigenen Namen: Gleichanteil, in der Reihe der Koeffizient mit der Ordnung null. Er ist keine Schwingung, sondern eine Verschiebung der ganzen Kurve nach oben oder unten — und genau deshalb steht er im Spektrum als Linie bei der Frequenz null.'
        },

        /* quelle: Lehrkurs Kapitel 2, Zusammenhang T, f und ω */
        {
          id: 2,
          type: 'cloze',
          difficulty: 'mittel',
          eyebrow: 'Teil 1 · Lückentext',
          title: 'Periode, Frequenz und Kreisfrequenz',
          prompt: 'Vervollständige den Zusammenhang der drei Größen.',
          segments: [
            { kind: 'text', text: 'Die Periode T ist die Zeit für einen vollen Durchlauf. Die Frequenz f ist ihr ' },
            { kind: 'select', answer: 'Kehrwert', distractors: ['Quadrat', 'Logarithmus', 'Doppeltes'] },
            { kind: 'text', text: ', also f = 1/T, und ihre Einheit ist ' },
            { kind: 'select', answer: 'Hertz', distractors: ['Sekunde', 'Radiant', 'Watt'] },
            { kind: 'text', text: '. Die Kreisfrequenz ω zählt nicht Durchläufe, sondern den überstrichenen Winkel; sie ist deshalb um den Faktor ' },
            { kind: 'select', answer: 'zwei Pi', distractors: ['Pi', 'vier Pi', 'Pi halbe'] },
            { kind: 'text', text: ' größer. Verdoppelt man die Frequenz, so ' },
            { kind: 'select', answer: 'halbiert sich die Periode', distractors: ['verdoppelt sich die Periode', 'bleibt die Periode gleich', 'halbiert sich die Amplitude'] },
            { kind: 'text', text: '.' }
          ],
          feedback: 'Alle drei beschreiben dasselbe Tempo in unterschiedlichen Einheiten: T in Sekunden je Durchlauf, f in Durchläufen je Sekunde, ω in Radiant je Sekunde.',
          wrongNote: 'Der Faktor 2π ist kein Umrechnungsfaktor zwischen Einheiten, sondern der Umfang des Einheitskreises: ein voller Durchlauf ist ein voller Winkel.',
          deep: 'Warum in der Rechnung fast immer ω und nicht f steht: die Ableitung eines Sinus liefert einen Kosinus mal ω, nicht mal f. Mit f müsste in jeder Ableitung ein 2π mitgeschleppt werden. Die Kreisfrequenz ist die Größe, in der die Formeln kurz werden — der Preis dafür ist, dass man sie nicht direkt am Oszilloskop abliest.'
        },

        /* quelle: Lehrkurs Kapitel 6 „Das Spektrum" */
        {
          id: 3,
          type: 'dnd',
          difficulty: 'mittel',
          eyebrow: 'Teil 1 · Zuordnung',
          title: 'Vier Begriffe des Spektrums',
          prompt: 'Ordne jedem Begriff seine Beschreibung zu.',
          pairs: [
            { key: 'g', term: 'Gleichanteil', description: 'Die Linie bei der Frequenz null; verschiebt die ganze Kurve nach oben oder unten.' },
            { key: 'f', term: 'Grundschwingung', description: 'Die Linie bei der niedrigsten Frequenz; sie hat die Periode des Signals.' },
            { key: 'h', term: 'Harmonische', description: 'Eine Linie bei einem ganzzahligen Vielfachen der Grundfrequenz.' },
            { key: 'a', term: 'Amplitudenspektrum', description: 'Die Darstellung aller Linien mit ihrer Höhe über der Frequenzachse.' },
            { key: 'p', term: 'Phasenspektrum', description: 'Die Darstellung, wann jede Linie ihren Nulldurchgang hat.' }
          ],
          feedback: 'Ein Spektrum besteht immer aus zwei Hälften: Amplitude und Phase. Die Amplitude allein genügt nicht, um das Signal zurückzubauen.',
          wrongNote: 'Gleichanteil und Grundschwingung werden gern verwechselt. Der Gleichanteil schwingt überhaupt nicht — er sitzt bei der Frequenz null.',
          deep: 'Dass das Phasenspektrum in Lehrbüchern selten abgebildet wird, hat einen praktischen Grund: das Ohr hört Phase kaum, und für Klanganalysen genügt die Amplitude. Bei der Bildverarbeitung ist es umgekehrt — verwirft man dort die Phase und behält nur die Amplituden, bleibt vom Bild ein grauer Nebel übrig.'
        },

        /* quelle: Lehrkurs Kapitel 5 „Koeffizienten berechnen" */
        {
          id: 4,
          type: 'order',
          difficulty: 'mittel',
          eyebrow: 'Teil 1 · Reihenfolge',
          title: 'Wie eine Zerlegung abläuft',
          prompt: 'Bringe die Schritte einer Fourier-Zerlegung in die Reihenfolge, in der sie ' +
                  'tatsächlich abgearbeitet werden.',
          items: [
            'Die Periode des Signals bestimmen',
            'Die Grundfrequenz als Kehrwert der Periode berechnen',
            'Für jede Ordnung den Koeffizienten über eine Periode integrieren',
            'Die Koeffizienten als Linien über der Frequenzachse auftragen',
            'Aus den Linien das Signal näherungsweise wieder zusammensetzen'
          ],
          feedback: 'Ohne Periode gibt es keine Grundfrequenz, und ohne Grundfrequenz weiß man nicht, über welche Frequenzen überhaupt integriert wird.',
          wrongNote: 'Das Auftragen kommt nach dem Integrieren, nicht davor. Ein Spektrum ist das Ergebnis der Rechnung und nicht ihre Eingabe.',
          deep: 'Der letzte Schritt ist der eigentliche Beweis, dass die Zerlegung stimmt: setzt man die Linien wieder zusammen und kommt das Signal heraus, war nichts verloren. Genau das macht die Zeichnung oben mit dem Regler — jeder zusätzliche Sinus bringt die Summe näher an das Rechteck, und die Ecken bleiben am längsten unscharf.'
        },

        /* quelle: Showcase-Dummy · Linienspektrum, assets/img/schema-spektrum.svg */
        {
          id: 5,
          type: 'hotspot',
          difficulty: 'schwer',
          eyebrow: 'Teil 1 · Bildarbeit',
          title: 'Drei Stellen im Linienspektrum',
          prompt: 'Das Bild zeigt sechs Linien über einer Frequenzachse in Hertz — und ' +
                  '<span class="hl">keine Deutung</span>. Markiere der Reihe nach die ' +
                  'Grundschwingung, die dritte Harmonische und jene Linie, die im Spektrum eines ' +
                  'symmetrischen Rechtecksignals überhaupt nicht vorkommen dürfte.',
          image: 'assets/img/schema-spektrum.svg',
          imageAlt: 'Linienspektrum mit sechs Spektrallinien bei 50, 100, 150, 200, 250 und 300 Hertz, unterschiedlich hoch',
          zones: [
            { x: 18.9, y: 24.4, r: 7, label: 'Grundschwingung bei 50 Hz' },
            { x: 48.9, y: 44.4, r: 7, label: 'Dritte Harmonische bei 150 Hz' },
            { x: 33.9, y: 58.3, r: 7, label: 'Verbotene gerade Harmonische bei 100 Hz' }
          ],
          feedback: 'Die niedrigste Frequenz ist die Grundschwingung, das Dreifache davon die dritte Harmonische. Ein symmetrisches Rechteck hat <b>nur ungerade</b> Harmonische — die Linie bei 100 Hz ist die zweite und gehört nicht dorthin.',
          wrongNote: 'Die höchste Linie ist nicht automatisch die Grundschwingung. Entscheidend ist die Position auf der Frequenzachse, nicht die Höhe.',
          deep: 'Dass die geraden Harmonischen verschwinden, ist keine Eigenschaft des Rechtecks, sondern seiner Symmetrie: die zweite Halbwelle ist das Spiegelbild der ersten mit umgekehrtem Vorzeichen. Jede Funktion mit dieser Halbwellensymmetrie hat nur ungerade Harmonische — und umgekehrt verrät eine gemessene 100-Hz-Linie im Netz sofort, dass irgendwo eine Halbwelle anders aussieht als die andere.'
        }
      ]
    },

    /* ══════════════════════════════════════════════════════════════════════════
       Teil 2 · Rechnen und beurteilen
       ══════════════════════════════════════════════════════════════════════════ */
    {
      index: '02',
      eyebrow: 'Teil 2',
      title: 'Größenordnungen, Symmetrie, Zahlen',
      count: '6 Aufgaben · überwiegend schwer',
      tasks: [

        /* quelle: Lehrkurs Kapitel 4 „Die Fourier-Reihe", Rechteckbeispiel */
        {
          id: 6,
          type: 'estimate',
          difficulty: 'mittel',
          eyebrow: 'Teil 2 · Schätzen',
          title: 'Wie groß ist die dritte Harmonische?',
          prompt: 'Ein symmetrisches Rechtecksignal wird zerlegt. Wie groß ist die Amplitude der ' +
                  'dritten Harmonischen, gemessen in Prozent der Grundschwingung?',
          min: 0,
          max: 100,
          step: 1,
          answer: 33,
          tol: 4,
          unit: '%',
          feedback: 'Beim Rechteck fallen die Amplituden mit 1/n: die dritte Harmonische hat ein Drittel, die fünfte ein Fünftel, die siebte ein Siebtel der Grundamplitude.',
          wrongNote: 'Die Amplituden fallen mit 1/n und nicht mit 1/n². Das wäre der Dreiecksverlauf, und dort wäre die dritte Harmonische nur ein Neuntel groß.',
          deep: 'Der 1/n-Abfall ist der Grund, warum ein Rechteck über einen bandbegrenzten Kanal so schlecht überlebt: die Ecken stecken in den hohen Ordnungen, und die tragen zwar wenig Amplitude, aber genau die Information über die Steilheit. Ein Dreieck mit 1/n² kommt viel weiter, weil es ohnehin kaum hohe Anteile hat.'
        },

        /* quelle: Lehrkurs Kapitel 7 „Reelle Form", Symmetrieregeln */
        {
          id: 7,
          type: 'matrix',
          difficulty: 'schwer',
          eyebrow: 'Teil 2 · Raster',
          title: 'Welche Koeffizienten verschwinden?',
          prompt: 'Kreuze für jede Symmetrieeigenschaft an, welche Koeffizienten dadurch null werden.',
          columns: ['Gleichanteil', 'Kosinusanteile', 'Sinusanteile'],
          rows: [
            { label: 'Gerade Funktion, f(−t) = f(t)', correct: [false, false, true] },
            { label: 'Ungerade Funktion, f(−t) = −f(t)', correct: [true, true, false] },
            { label: 'Mittelwertfrei über eine Periode', correct: [true, false, false] },
            { label: 'Halbwellensymmetrie, zweite Hälfte gespiegelt', correct: [true, false, false] }
          ],
          feedback: 'Der Kosinus ist gerade, der Sinus ungerade. Eine gerade Funktion braucht deshalb keine Sinusanteile, eine ungerade keine Kosinusanteile — und eine ungerade ist zwangsläufig auch mittelwertfrei.',
          wrongNote: 'Halbwellensymmetrie tilgt nicht die Sinus- oder Kosinusanteile, sondern alle <b>geraden Ordnungen</b> samt Gleichanteil. Das ist eine andere Aussage als gerade oder ungerade.',
          deep: 'Diese Tabelle ist in der Praxis eine Rechenersparnis von 50 Prozent: erkennt man vor dem Integrieren, dass eine Funktion gerade ist, entfallen sämtliche Sinus-Integrale. Wer stattdessen alle Koeffizienten ausrechnet und am Ende feststellt, dass die halbe Hälfte null ist, hat die doppelte Arbeit gemacht und dabei die doppelte Zahl an Vorzeichenfehlern riskiert.'
        },

        /* quelle: Showcase-Dummy · Signalbeurteilung nach Lehrkurs Kapitel 6 */
        {
          id: 8,
          type: 'forecast',
          difficulty: 'schwer',
          eyebrow: 'Teil 2 · Beurteilung',
          title: 'Ein gemessenes Signal beurteilen',
          prompt: 'Ein Oszilloskop zeigt ein periodisches Signal mit einer Periode von ' +
                  '<span class="hl">4 ms</span>. Im Spektrum stehen Linien bei 250, 750 und ' +
                  '1250 Hz, sonst nichts. Beurteile das Signal vollständig.',
          fields: [
            { kind: 'number', label: 'Grundfrequenz', answer: 250, tol: 5, unit: 'Hz' },
            { kind: 'select', label: 'Symmetrie', answer: 'halbwellensymmetrisch',
              options: ['halbwellensymmetrisch', 'nur gerade Symmetrie', 'keine Symmetrie erkennbar'] },
            { kind: 'select', label: 'Ordnung der höchsten Linie', answer: 'fünfte',
              options: ['dritte', 'vierte', 'fünfte', 'sechste'] },
            { kind: 'select', label: 'Gleichanteil', answer: 'nicht vorhanden',
              options: ['nicht vorhanden', 'positiv', 'negativ'] }
          ],
          feedback: 'Aus 4 ms folgt 250 Hz. Die Linien sind das Ein-, Drei- und Fünffache davon — nur ungerade Ordnungen und keine Linie bei null, also halbwellensymmetrisch und mittelwertfrei.',
          wrongNote: '1250 Hz ist nicht die dritte Linie im Sinne der Ordnung, sondern die dritte <b>vorhandene</b>. Ihre Ordnung ist 1250 / 250 = 5.',
          deep: 'Diese vier Angaben zusammen genügen, um das Signal einer Signalklasse zuzuordnen, ohne es gesehen zu haben: mittelwertfrei, halbwellensymmetrisch, mit 1/n-artig fallenden ungeraden Harmonischen — das ist die Signatur eines Rechtecks oder eines geschalteten Verlaufs. Ein Sinus hätte nur eine Linie, ein Dreieck dieselben Ordnungen mit viel schnellerem Abfall.'
        },

        /* quelle: Lehrkurs Kapitel 2, Rechenbeispiel zur Kreisfrequenz */
        {
          id: 9,
          type: 'calc',
          difficulty: 'schwer',
          eyebrow: 'Teil 2 · Rechenweg',
          title: 'Von der Periode zur dritten Harmonischen',
          prompt: 'Ein Signal hat eine Periode von 4 ms. Rechne in drei Schritten bis zur ' +
                  'Frequenz seiner dritten Harmonischen.',
          given: [
            { label: 'Periode T', value: '4 ms' },
            { label: 'Kreiszahl π', value: '3,1416' }
          ],
          steps: [
            { label: 'Grundfrequenz', formula: 'f = 1 / T',
              answer: 250, tol: 1, unit: 'Hz',
              hint: 'Die Periode in Sekunden einsetzen: 4 ms sind vier Tausendstel.' },
            { label: 'Kreisfrequenz der Grundschwingung', formula: 'ω = 2 · π · f',
              answer: 1570.8, tol: 2, unit: 'rad/s',
              hint: 'Die Grundfrequenz mit dem Umfang des Einheitskreises multiplizieren.' },
            { label: 'Frequenz der dritten Harmonischen', formula: 'f<sub>3</sub> = 3 · f',
              answer: 750, tol: 1, unit: 'Hz',
              hint: 'Eine Harmonische liegt bei einem ganzzahligen Vielfachen der Grundfrequenz.' }
          ],
          feedback: 'Der häufigste Fehler steckt in Schritt 1: 4 ms sind 0,004 s, und der Kehrwert davon ist 250 — nicht 0,25 und nicht 4000.',
          wrongNote: 'Wer in Millisekunden rechnet, erhält 0,25 und damit eine Frequenz von einem Viertel Hertz. Eine Periode von Millisekunden gehört zu Frequenzen von Hunderten Hertz, nicht zu Bruchteilen.',
          deep: 'Die Kreisfrequenz aus Schritt 2 ist die Zahl, die in jeder Rechnung mit diesem Signal auftaucht, während die 250 Hz nur der Anzeigewert ist. Das ist der Grund für die Doppelung: das Oszilloskop zeigt f, die Formel braucht ω, und zwischen beiden liegt ein Faktor von gut sechs — groß genug, dass ein Vertauschen sofort unplausible Ergebnisse liefert.'
        },

        /* quelle: Lehrkurs Kapitel 2 und 6 — Kennwerte der 50-Hz-Grundschwingung */
        {
          id: 10,
          type: 'reverse',
          difficulty: 'schwer',
          eyebrow: 'Teil 2 · Umkehrfrage',
          title: 'Zu welcher Frage gehört dieser Wert?',
          prompt: 'Vier Zahlenwerte, die in diesem Modul vorkommen — aber ohne ihre Frage. ' +
                  'Ordne jedem Wert die <span class="hl">Frage</span> zu, auf die er die Antwort ist. ' +
                  'Drei der Fragen im Auswahlfeld gehören zu keinem der Werte.',
          items: [
            { answer: '20 ms',      question: 'Wie lang ist die Periode einer Schwingung mit 50 Hz?' },
            { answer: '≈ 314 s⁻¹',  question: 'Wie groß ist die Kreisfrequenz einer Schwingung mit 50 Hz?' },
            { answer: '150 Hz',     question: 'Welche Frequenz hat die dritte Harmonische von 50 Hz?' },
            { answer: '0 Hz',       question: 'Bei welcher Frequenz liegt der Gleichanteil im Spektrum?' }
          ],
          pool: [
            'Welche Frequenz hat die zweite Harmonische von 50 Hz?',
            'Wie viele Nulldurchgänge hat ein Sinus je Periode?',
            'Wie groß ist die Amplitude der dritten Harmonischen?'
          ],
          feedback: 'Alle vier Werte hängen an derselben Grundfrequenz: T = 1/f ergibt 20 ms, ω = 2πf ergibt rund 314 s⁻¹, die dritte Harmonische liegt bei 3f = 150 Hz, und der Gleichanteil ist die Linie bei der Frequenz null.',
          wrongNote: 'Die Verwechslung liegt fast immer zwischen f und ω: 50 und 314 sind dieselbe Schwingung in zwei Einheiten, nicht zwei verschiedene Schwingungen.',
          deep: 'Diese Richtung ist die unbequemere und die nähere an der Praxis. Am Messgerät steht eine Zahl, und niemand sagt dazu, was sie beantwortet: 314 auf dem Display ist ohne Einheit weder Frequenz noch Winkelgeschwindigkeit, sondern beides gleichzeitig falsch. Wer die Frage zu einem Wert nicht rekonstruieren kann, kann ihn auch nicht prüfen — und eine Zahl, die niemand prüft, wandert unbemerkt durch die ganze Rechnung.'
        },

        /* quelle: Lehrkurs Kapitel 7 „Rechteck und Symmetrie" */
        {
          id: 11,
          type: 'choice',
          multi: true,
          difficulty: 'schwer',
          eyebrow: 'Teil 2 · Mehrfachauswahl',
          title: 'Was gilt für das Spektrum eines Rechtecks?',
          prompt: 'Ein symmetrisches Rechtecksignal mit dem Tastgrad 50&nbsp;% wird in seine ' +
                  '<span class="hl">Fourier-Reihe</span> zerlegt. Welche Aussagen über das ' +
                  'entstehende Spektrum treffen zu?',
          options: [
            { text: 'Es enthält ausschließlich ungerade Vielfache der Grundfrequenz', correct: true },
            { text: 'Die Amplituden der Linien fallen mit dem Kehrwert der Ordnung', correct: true },
            { text: 'Es besteht aus einzelnen Linien und nicht aus einem Kontinuum', correct: true },
            { text: 'Die zweite Harmonische trägt etwa halb so viel wie die erste', correct: false },
            { text: 'Ein Tiefpass hebt die hohen Linien an und dämpft die tiefen', correct: false },
            { text: 'Das Spektrum wiederholt sich entlang der Frequenzachse selbst', correct: false }
          ],
          feedback: 'Drei Eigenschaften hängen zusammen: <b>periodisch</b> ergibt ein Linienspektrum, die <b>Halbwellensymmetrie</b> löscht die geraden Ordnungen, und die Amplituden folgen 1/n — also 1, 1/3, 1/5.',
          wrongNote: 'Die zweite Harmonische trägt nicht die Hälfte, sondern gar nichts: sie fehlt vollständig. Genau das unterscheidet ein Rechteck von einem beliebigen periodischen Signal.',
          deep: 'Dass hier mehrere Aussagen gleichzeitig gelten, ist der Grund für die Mehrfachauswahl. Eine Einfachauswahl müsste eine der drei richtigen zur einzigen erklären und die beiden anderen zu Distraktoren machen — das wäre fachlich falsch und schult obendrein die falsche Erwartung, dass es zu jeder Frage genau eine Antwort gibt.'
        }
      ]
    }
  ]
});
