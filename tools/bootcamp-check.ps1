<#
=============================================================================
 bootcamp-check.ps1 — prüft ein Bootcamp, bevor jemand „fertig" sagt
-----------------------------------------------------------------------------
 Aufruf aus dem Repo-Wurzelverzeichnis:

   pwsh tools/bootcamp-check.ps1
   pwsh tools/bootcamp-check.ps1 -Sheets Modul_03_Verbundnetze
   pwsh tools/bootcamp-check.ps1 -Widths 320,390,760,1199,1200 -SkipWidths:$false

 Vier Prüfungen:

   1. SELBSTLAUF   jedes Blatt löst sich über echte Klicks selbst durch.
                   Erwartet: Höchstpunktzahl, alle Aufgaben gelöst, alle
                   Auszeichnungen, keine Konsolenfehler. Findet falsch
                   hinterlegte Lösungen und kaputte Verdrahtung.
   2. REDAKTION    validate.js prüft die Regeln am Aufgabenobjekt:
                   Antwortlängen, Anteil schwerer Aufgaben, Fettdruck in
                   Optionen, überlappende Trefferzonen, Tipps, die das
                   Ergebnis nennen.
   3. BREITEN      320 bis 1340 px in einem echten iframe-Viewport, im
                   ungelösten UND im aufgelösten Zustand.
   4. KLASSEN      jede im Markup benutzte CSS-Klasse muss im Stylesheet eine
                   Regel haben.

 Warum Prüfung 4 existiert: der schlimmste Fehler dieses Rahmenwerks war eine
 fehlende CSS-Regel. `.frac` wurde im Fourier-Artikel 18-mal benutzt und stand
 in keinem Stylesheet — die Fourier-Reihe des Rechtecks las deshalb

     Rechteck(t) = 4π · ( sin t + 13 sin 3t + 15 sin 5t + … )

 statt 4/π und 1/3, 1/5. Kein Skript ist abgestürzt, keine Konsole hat gemeckert,
 die Seite sah sauber aus. Nur die Formel war falsch, und zwar so, dass ein
 Lernender sie so auswendig lernt.

 Was diese Prüfung NICHT kann — das entscheidet Lesen und Hinsehen:
   · ob eine Aufgabe fachlich gut gestellt ist
   · ob ein Distraktor plausibel wirkt oder offensichtlich Unsinn ist
   · ob der Text sich gut liest
   · wie eine Visualisierung in den Reglerextremen aussieht
   · ob eine Zahl stimmt (validate.js prüft die FORM, nicht die Physik)
 Ein grüner Exitcode heißt „nichts Kaputtes gefunden", nicht „gut".
=============================================================================
#>

[CmdletBinding()]
param(
  # Blätter ohne .html. Leer = alle *.data.js im Kursordner (siehe $vorl unten).
  [string[]] $Sheets = @(),
  # Zusätzliche Seiten, die nur auf Breite und Klassen geprüft werden.
  [string[]] $Pages = @(),
  [int[]]    $Widths = @(320, 360, 390, 414, 600, 759, 760, 900, 1199, 1200, 1340),
  [switch]   $SkipWidths,
  [int]      $TimeoutSec = 300
)

$ErrorActionPreference = 'Stop'
$root  = Split-Path -Parent $PSScriptRoot

# Der Kursordner wird ERKANNT, nicht festgeschrieben.
#
# Vorher stand hier fest `Join-Path $root 'Stylevorgabe'`. In diesem Repo ist
# das richtig — hier liegt das lauffähige Gerüst in genau diesem Ordner. In
# einem fertigen Modul ist der Name aber irreführend: „Stylevorgabe" heißt
# Formatvorlage, und darin läge dann der Produktionsstand. Wer das Verzeichnis
# öffnet, vermutet Beispielmaterial und findet den echten Kurs.
#
# Deshalb: liegt ein Ordner `Stylevorgabe` mit `assets` darin, wird er benutzt
# (dieses Repo, unverändertes Verhalten). Sonst gilt das Wurzelverzeichnis
# selbst als Kursordner — das ist die aufgelöste Struktur, die nach dem Klonen
# empfohlen ist. Beide Layouts laufen mit demselben Skript.
$vorl = Join-Path $root 'Stylevorgabe'
if (-not (Test-Path -LiteralPath (Join-Path $vorl 'assets'))) { $vorl = $root }
$assets = Join-Path $vorl 'assets'

if (-not (Test-Path -LiteralPath $assets)) {
  Write-Host "assets/ nicht gefunden unter $vorl" -ForegroundColor Red
  exit 1
}

# ── Browser finden ─────────────────────────────────────────────────────────
# Der headless-shell zuerst: er ist für genau diesen Zweck gebaut und beendet
# sich zuverlässig. Der normale Chrome bleibt mit --dump-dom gelegentlich
# hängen, wenn ein frisches Profil angelegt werden muss.
$cands = @(
  "$env:LOCALAPPDATA\ms-playwright\chromium_headless_shell-*\chrome-headless-shell-win64\chrome-headless-shell.exe",
  "$env:LOCALAPPDATA\ms-playwright\chromium-*\chrome-win64\chrome.exe",
  "$env:LOCALAPPDATA\ms-playwright\chromium-*\chrome-win\chrome.exe",
  "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
  "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
  "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
  "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe"
)
$browser = $null
foreach ($c in $cands) {
  $hit = Get-Item -Path $c -ErrorAction SilentlyContinue | Sort-Object Name -Descending | Select-Object -First 1
  if ($hit) { $browser = $hit.FullName; break }
}
if (-not $browser) {
  Write-Host 'Kein Chromium gefunden. Erwartet im Playwright-Cache, sonst Chrome oder Edge.' -ForegroundColor Red
  exit 1
}

$tmp = Join-Path ([System.IO.Path]::GetTempPath()) ("bootcamp-check-" + [guid]::NewGuid().ToString('N').Substring(0,8))
New-Item -ItemType Directory -Force -Path $tmp | Out-Null

$fails = @()
$warns = @()

function Note-Fail([string] $m) { $script:fails += $m }
function Note-Warn([string] $m) { $script:warns += $m }

function Head([string] $t) {
  Write-Host ''
  Write-Host ('── ' + $t + ' ' + ('─' * [Math]::Max(2, 70 - $t.Length))) -ForegroundColor DarkCyan
}

# Leerzeichen im Pfad MÜSSEN kodiert werden. Unkodiert zerlegt Chromium die URL
# in zwei Argumente und bricht mit „Multiple targets are not supported in
# headless mode" ab — und der Pfad hier enthält „1. Allgemein".
function To-FileUrl([string] $path) {
  $p = (Resolve-Path -LiteralPath $path).Path -replace '\\', '/'
  return 'file:///' + ($p -replace ' ', '%20')
}

function Get-Dom([string] $url, [int] $budgetMs, [string] $size, [string] $profile) {
  $out = Join-Path $tmp ('dom-' + [guid]::NewGuid().ToString('N').Substring(0,6) + '.html')
  $args = @(
    '--disable-gpu', '--allow-file-access-from-files',
    '--no-first-run', '--no-default-browser-check', '--disable-background-networking',
    "--virtual-time-budget=$budgetMs", "--window-size=$size", '--dump-dom', $url
  )
  if ($profile) { $args = @("--user-data-dir=$profile") + $args }
  $p = Start-Process -FilePath $browser -ArgumentList $args -RedirectStandardOutput $out `
        -RedirectStandardError (Join-Path $tmp 'err.txt') -NoNewWindow -PassThru
  if (-not $p.WaitForExit($TimeoutSec * 1000)) {
    try { $p.Kill() } catch { }
    return $null
  }
  if (-not (Test-Path -LiteralPath $out)) { return $null }
  return (Get-Content -LiteralPath $out -Raw -Encoding UTF8)
}

# Der Befund steht in <pre id="verdict">. Bewusst DIESES Element und nicht ein
# Regex auf VERDICT-BEGIN im ganzen Dokument: der Marker kommt auch im Quelltext
# des Skripts vor, das ihn schreibt, und dann liest man den Wunsch statt des
# Ergebnisses.
function Get-Verdict([string] $dom) {
  if (-not $dom) { return $null }
  $m = [regex]::Match($dom, '<pre id="verdict"[^>]*>(?<v>.*?)</pre>', 'Singleline')
  if (-not $m.Success) { return $null }
  $t = $m.Groups['v'].Value
  $t = $t -replace '&lt;', '<' -replace '&gt;', '>' -replace '&quot;', '"' -replace '&#39;', "'" -replace '&amp;', '&'
  return $t.Trim()
}

# ── Welche Blätter? ────────────────────────────────────────────────────────
if (-not $Sheets -or $Sheets.Count -eq 0) {
  $Sheets = @()
  Get-ChildItem -LiteralPath $vorl -Filter '*.data.js' -File | ForEach-Object {
    $base = $_.Name -replace '\.data\.js$', ''
    if ($base -ne 'index' -and (Test-Path -LiteralPath (Join-Path $vorl "$base.html"))) {
      $Sheets += $base
    }
  }
  # ERGAENZT 14.08.2026: Blätter dürfen auch eine Ebene tiefer liegen.
  #
  # Der Anlass: die Probeklausur ist nach Klausurphase/ gezogen. Der Autofund
  # oben schaut nur in den Kursordner — danach fehlte sie im Standardlauf, OHNE
  # dass irgendetwas rot geworden wäre. Genau das ist die gefährliche Sorte
  # Lücke: der Lauf bleibt grün und prüft weniger.
  #
  # Gesucht wird nach demselben Muster wie oben: eine *.data.js mit einer
  # gleichnamigen *.html daneben. Der Blattname trägt dann den Ordner mit
  # ('Klausurphase/Probeklausur') — jede Stelle, die daraus einen Pfad baut,
  # ersetzt '/' bereits durch '\' bzw. hängt '../' davor.
  foreach ($sub in (Get-ChildItem -LiteralPath $vorl -Directory)) {
    if ($sub.Name -in @('assets', 'tools', 'Code-Aufgaben', '.claude')) { continue }
    Get-ChildItem -LiteralPath $sub.FullName -Filter '*.data.js' -File | ForEach-Object {
      $base = $_.Name -replace '\.data\.js$', ''
      if (Test-Path -LiteralPath (Join-Path $sub.FullName "$base.html")) {
        $Sheets += ($sub.Name + '/' + $base)
      }
    }
  }

  # Der Selbsttest liegt in assets/ und ist immer dabei: er ist die
  # Regressionsprüfung des Rahmenwerks selbst.
  if (Test-Path -LiteralPath (Join-Path $assets 'selbsttest.html')) {
    $Sheets += 'assets/selbsttest'
  }
}

Write-Host ''
Write-Host 'BOOTCAMP-CHECK' -ForegroundColor White
Write-Host ("Browser : " + (Split-Path -Leaf $browser))
Write-Host ("Blätter : " + ($Sheets -join ', '))
Write-Host ("Breiten : " + (($Widths | ForEach-Object { $_ }) -join ', ') + ' px')

# ═══════════════════════════════════════════════════════════════════════════
# 0 · Syntaxprobe der .data.js -- VOR dem Browser
# ---------------------------------------------------------------------------
# ERGAENZT 2026-08-07 beim Bau von Modul 04 (AuD-Bootcamp).
#
# Der Fund: im Kopfkommentar stand der Pfad `UEB05/*/*.java`. Die Zeichenfolge
# `*/` darin hat den Blockkommentar VORZEITIG GESCHLOSSEN, der Rest des Kopfes
# wurde als Code gelesen, und die Datei war ein Syntaxfehler.
#
# Der Browserlauf hat das gemerkt -- aber nur als
#     ! kein Blatt angemeldet
#     ! Ausnahme: Cannot read properties of undefined (reading 'score')
# und mit `consoleErrors=keine`, weil ein Parse-Fehler des Skripts vor jedem
# window.onerror passiert. Aus dieser Meldung ist die Ursache nicht zu erraten.
#
# `node --check` nennt Datei, Zeile, Spalte und Token in einer Sekunde. Node ist
# nicht Voraussetzung: fehlt es, wird die Probe uebersprungen und der Rest laeuft
# wie bisher.
# ═══════════════════════════════════════════════════════════════════════════
$node = (Get-Command node -ErrorAction SilentlyContinue)
if ($node) {
  $syntaxFehler = 0
  foreach ($s in $Sheets) {
    $df = Join-Path $vorl (($s -replace '/', '\') + '.data.js')
    if (-not (Test-Path -LiteralPath $df)) { continue }
    $ausgabe = & $node.Source --check $df 2>&1
    if ($LASTEXITCODE -ne 0) {
      if ($syntaxFehler -eq 0) { Head 'SYNTAXFEHLER IN EINER .data.js' }
      Write-Host ('  ' + (Split-Path -Leaf $df)) -ForegroundColor Red
      $ausgabe | Select-Object -First 6 | ForEach-Object { Write-Host ('    ' + $_) -ForegroundColor Red }
      $syntaxFehler++
    }
  }
  if ($syntaxFehler -gt 0) {
    Note-Fail ('Blätter mit Syntaxfehler: ' + $syntaxFehler)
    Write-Host ''
    Write-Host '  Der Browserlauf wird dazu nur „kein Blatt angemeldet" melden.' -ForegroundColor Yellow
    Write-Host '  Haeufigste Ursache: die Zeichenfolge */ in einem Blockkommentar,' -ForegroundColor Yellow
    Write-Host '  etwa in einem Pfad wie UEB05/*/*.java.' -ForegroundColor Yellow
  }
}

# ═══════════════════════════════════════════════════════════════════════════
# 1 + 2 · Selbstlauf und Redaktionsregeln
# ═══════════════════════════════════════════════════════════════════════════
foreach ($s in $Sheets) {
  $file = Join-Path $vorl ($s -replace '/', '\')
  $file = "$file.html"
  if (-not (Test-Path -LiteralPath $file)) {
    Note-Fail "$s : Datei fehlt ($file)"
    continue
  }
  Head "SELBSTLAUF + REDAKTION  ·  $s"
  $dom = Get-Dom ((To-FileUrl $file) + '#pruefen') 20000 '1400,1400' $null
  $v = Get-Verdict $dom
  if (-not $v) {
    Note-Fail "$s : kein Befund — audit.js eingebunden? Ladefehler?"
    Write-Host '  KEIN BEFUND' -ForegroundColor Red
    continue
  }
  $v -split "`n" | ForEach-Object {
    $line = $_
    $col = 'Gray'
    if ($line -match 'ERGEBNIS=GRUEN')          { $col = 'Green' }
    elseif ($line -match 'ERGEBNIS=|^\s*!|NEIN'){ $col = 'Red' }
    elseif ($line -match '^(score|solved|validierung|badges)') { $col = 'White' }
    Write-Host ('  ' + $line) -ForegroundColor $col
  }
  if ($v -notmatch 'ERGEBNIS=GRUEN') { Note-Fail "$s : Selbstlauf oder Redaktionsregeln nicht grün" }
}

# ═══════════════════════════════════════════════════════════════════════════
# 3 · Breiten — beide Zustände
# ═══════════════════════════════════════════════════════════════════════════
if (-not $SkipWidths) {
  $breiten = Join-Path $assets 'breiten.html'
  $wArg = ($Widths -join ',')
  # Grob: 12 s Zeitfenster je Breite und Zustand, plus Luft.
  $budget = [Math]::Max(60000, $Widths.Count * 14000)

  # `pwsh -File skript.ps1 -Pages a,b` liefert EINEN String „a,b" — die
  # Kommaliste wird bei -File nicht als Array gebunden. Also hier trennen,
  # damit beide Aufrufwege gleich funktionieren.
  $pageList = @()
  foreach ($p in $Pages) { $pageList += ($p -split ',' | Where-Object { $_ }) }

  $alle = @()
  # Aufgabenblätter werden in BEIDEN Zuständen geprüft, weil der aufgelöste der
  # breitere ist. Eine reine Leseseite hat keinen aufgelösten Zustand.
  foreach ($s in $Sheets)   { $alle += ,@($s, $true) }
  foreach ($p in $pageList) { $alle += ,@($p, $false) }

  foreach ($pair in $alle) {
    $name = $pair[0]
    $states = if ($pair[1]) { @('', '&state=geloest') } else { @('') }
    # breiten.html liegt IN assets/, der Seitenpfad ist relativ dazu.
    $rel = if ($name -like 'assets/*') { ($name -replace '^assets/', '') + '.html' } else { '../' + $name + '.html' }

    foreach ($state in $states) {
      $label = if ($state) { 'aufgelöst' } else { 'ungelöst ' }
      Head "BREITEN ($label)  ·  $name"
      $url = (To-FileUrl $breiten) + '?page=' + [uri]::EscapeDataString($rel) + $state
      $dom = Get-Dom $url $budget '1500,1000' $null
      $v = Get-Verdict $dom
      if (-not $v) {
        Note-Fail "$name ($label) : keine Breitenmessung"
        Write-Host '  KEIN BEFUND' -ForegroundColor Red
        continue
      }
      $v -split "`n" | ForEach-Object {
        $line = $_
        $col = 'Gray'
        if ($line -match 'ERGEBNIS=GRUEN')           { $col = 'Green' }
        elseif ($line -match 'ERGEBNIS=|^\s*!|^\s+>'){ $col = 'Red' }
        Write-Host ('  ' + $line) -ForegroundColor $col
      }
      if ($v -notmatch 'ERGEBNIS=GRUEN') { Note-Fail "$name ($label) : Breitenprüfung nicht grün" }
    }
  }
}

# ═══════════════════════════════════════════════════════════════════════════
# 4 · Klassen ohne Regel
# ═══════════════════════════════════════════════════════════════════════════
Head 'KLASSEN OHNE REGEL IM STYLESHEET'

$cssText = Get-Content -LiteralPath (Join-Path $assets 'styles.css') -Raw -Encoding UTF8
$cssText += Get-Content -LiteralPath (Join-Path $assets 'colorpalett.css') -Raw -Encoding UTF8

# Alle Selektorklassen einsammeln. Bewusst grob: es geht um „kommt die Klasse
# irgendwo als Selektor vor", nicht um Spezifität.
$defined = @{}
foreach ($m in [regex]::Matches($cssText, '\.(-?[A-Za-z_][A-Za-z0-9_-]*)')) {
  $defined[$m.Groups[1].Value] = $true
}

# Klassen, die absichtlich keine eigene Regel haben: reine Sprungmarken für
# JavaScript oder Prüfwerkzeuge.
$erlaubt = @('js-only')

# Nur Seiten prüfen, die styles.css überhaupt einbinden. breiten.html ist ein
# Werkzeug mit eigenem <style>-Block; dessen Klassen dort zu vermissen wäre
# richtig gemeldet und trotzdem falsch.
#
# ERGAENZT 14.08.2026: auch die Ordner der Blätter, die tiefer liegen. Ohne das
# wäre Klausurphase/Probeklausur.html bei dieser Prüfung durchgerutscht und eine
# Klasse ohne Regel dort nie aufgefallen.
$ordner = @($vorl, $assets)
foreach ($s in $Sheets) {
  if ($s -notmatch '/') { continue }
  $d = Join-Path $vorl (Split-Path -Parent ($s -replace '/', '\'))
  if ($ordner -notcontains $d) { $ordner += $d }
}

$htmlFiles = @()
foreach ($d in $ordner) {
  if (-not (Test-Path -LiteralPath $d)) { continue }
  Get-ChildItem -LiteralPath $d -Filter '*.html' -File | ForEach-Object {
    if ((Get-Content -LiteralPath $_.FullName -Raw -Encoding UTF8) -match 'styles\.css') {
      $htmlFiles += $_
    }
  }
}

$offen = @{}
foreach ($f in $htmlFiles) {
  $txt = Get-Content -LiteralPath $f.FullName -Raw -Encoding UTF8
  foreach ($m in [regex]::Matches($txt, 'class\s*=\s*"([^"]*)"')) {
    foreach ($cls in ($m.Groups[1].Value -split '\s+')) {
      if (-not $cls) { continue }
      if ($defined.ContainsKey($cls)) { continue }
      if ($erlaubt -contains $cls) { continue }
      $key = $cls + '  (' + $f.Name + ')'
      $offen[$key] = $true
    }
  }
}

# Dasselbe für die Klassen, die die Engine im Code erzeugt: make('div', 'name').
# Das `[,)]` am Ende ist wichtig: es schließt zusammengesetzte Werte wie
# make('span', 'chip chip--' + task.difficulty, …) aus. Ohne das meldet der
# Prüfer `.chip--` als fehlend, was nur der halbe Klassenname ist.
foreach ($f in (Get-ChildItem -LiteralPath $assets -Filter '*.js' -File)) {
  $txt = Get-Content -LiteralPath $f.FullName -Raw -Encoding UTF8
  foreach ($m in [regex]::Matches($txt, "make\(\s*'[a-zA-Z0-9]+'\s*,\s*'([^']+)'\s*[,)]")) {
    foreach ($cls in ($m.Groups[1].Value -split '\s+')) {
      if (-not $cls) { continue }
      if ($cls -match '[^a-zA-Z0-9_-]') { continue }
      if ($defined.ContainsKey($cls)) { continue }
      if ($erlaubt -contains $cls) { continue }
      $offen[($cls + '  (' + $f.Name + ')')] = $true
    }
  }
}

if ($offen.Count -eq 0) {
  Write-Host '  keine — jede benutzte Klasse hat eine Regel' -ForegroundColor Green
} else {
  foreach ($k in ($offen.Keys | Sort-Object)) {
    Write-Host ('  .' + $k) -ForegroundColor Red
  }
  Note-Fail ('Klassen ohne Regel: ' + $offen.Count)
}

# ═══════════════════════════════════════════════════════════════════════════
# 5 · SVG als XML
# ---------------------------------------------------------------------------
# ERGAENZT 2026-08-07 beim Bau von Modul 02 (AuD-Bootcamp).
#
# Der Fund, der diesen Abschnitt ausgeloest hat: SECHS von sieben SVG in
# assets/img/ waren kein wohlgeformtes XML und wurden vom Browser GAR NICHT
# dekodiert. Jede Hotspot-Aufgabe in Modul 03, 05, 07, 08 und 02 zeigte ein
# kaputtes Bild. Nachgewiesen ueber Image.naturalWidth im headless-Chromium: 0.
#
# Warum keine der vier bisherigen Pruefungen das gefunden hat:
#   1 Selbstlauf  fuellt Antworten ueber setAnswer -- die Zonen einer
#                 hotspot-Aufgabe sind Koordinaten, kein Bildinhalt. Ein
#                 fehlendes Bild aendert am Ergebnis nichts.
#   2 Redaktion   prueft die Aufgabendaten, nicht die Datei dahinter.
#   3 Breiten     misst Layout. Ein kaputtes <img> hat trotzdem seine
#                 Rahmenbreite und faellt nicht auf.
#   4 Klassen     liest HTML und JS, keine SVG.
#
# Die Ursache war jedes Mal dieselbe: der Kopfkommentar IM <style>-Element
# nennt das HTML-Element img in spitzen Klammern. Der Inhalt eines
# style-Elements wird in XML als Markup gelesen, nicht als Text -- damit war
# ein Element offen, das nie geschlossen wurde. Abhilfe ist die CDATA-Klammer
# um das Stylesheet; sie steht jetzt in allen sieben Dateien.
#
# Diese Pruefung ist rein additiv: sie liest nur Dateien und braucht keinen
# Browser. Sie laeuft in Millisekunden.
# ═══════════════════════════════════════════════════════════════════════════
Head 'SVG · WOHLGEFORMTES XML'

$imgDir = Join-Path $assets 'img'
if (-not (Test-Path -LiteralPath $imgDir)) {
  Write-Host '  kein Ordner assets/img — nichts zu pruefen' -ForegroundColor DarkGray
} else {
  $svgs = @(Get-ChildItem -LiteralPath $imgDir -Filter '*.svg' -File)
  if ($svgs.Count -eq 0) {
    Write-Host '  keine SVG in assets/img' -ForegroundColor DarkGray
  } else {
    $svgKaputt = 0
    foreach ($s in $svgs) {
      $roh = Get-Content -LiteralPath $s.FullName -Raw -Encoding UTF8
      try {
        [void]([xml] $roh)
        # Zweite, schaerfere Probe: ein <style> OHNE CDATA ist eine tickende
        # Bombe. Er ist heute wohlgeformt und wird es beim naechsten Kommentar
        # mit einer spitzen Klammer nicht mehr sein.
        if ($roh -match '<style>' -and $roh -notmatch '<!\[CDATA\[') {
          Write-Host ('  HINWEIS  ' + $s.Name + '  — <style> ohne CDATA-Klammer') -ForegroundColor Yellow
          Note-Warn ($s.Name + ': <style> ohne CDATA — ein spitzes Zeichen im CSS oder in einem Kommentar macht die Datei unlesbar')
        } else {
          Write-Host ('  OK       ' + $s.Name) -ForegroundColor Green
        }
      } catch {
        Write-Host ('  KAPUTT   ' + $s.Name) -ForegroundColor Red
        Write-Host ('           ' + $_.Exception.InnerException.Message) -ForegroundColor Red
        Write-Host '           Diese Datei wird vom Browser NICHT dargestellt.' -ForegroundColor Red
        $svgKaputt++
      }
    }
    if ($svgKaputt -gt 0) { Note-Fail ('SVG nicht wohlgeformt: ' + $svgKaputt) }

    # Und: zeigt jede image-Angabe eines Blattes auf eine Datei, die es gibt?
    $bildFehlt = 0
    foreach ($sheet in $Sheets) {
      $dataFile = Join-Path $vorl (($sheet -replace '/', '\') + '.data.js')
      if (-not (Test-Path -LiteralPath $dataFile)) { continue }
      # Der Pfad in `image:` ist relativ zur SEITE, nicht zum Kursordner.
      # assets/selbsttest.data.js schreibt deshalb 'img/…' und ein echtes Blatt
      # 'assets/img/…'. Ohne diese Unterscheidung meldet der Selbsttest ein
      # fehlendes Bild, das es gibt.
      $basis = Split-Path -Parent $dataFile
      $dtxt = Get-Content -LiteralPath $dataFile -Raw -Encoding UTF8
      foreach ($m in [regex]::Matches($dtxt, "image\s*:\s*'([^']+)'")) {
        $rel = $m.Groups[1].Value
        $ziel = Join-Path $basis ($rel -replace '/', '\')
        if (-not (Test-Path -LiteralPath $ziel)) {
          Write-Host ('  FEHLT    ' + $rel + '  (' + $sheet + ')') -ForegroundColor Red
          $bildFehlt++
        }
      }
    }
    if ($bildFehlt -gt 0) { Note-Fail ('Bilder aus data.js nicht vorhanden: ' + $bildFehlt) }
  }
}

# ═══════════════════════════════════════════════════════════════════════════
# Zusammenfassung
# ═══════════════════════════════════════════════════════════════════════════
Remove-Item -LiteralPath $tmp -Recurse -Force -ErrorAction SilentlyContinue

Write-Host ''
Write-Host ('═' * 74) -ForegroundColor DarkGray
if ($warns.Count) {
  Write-Host 'HINWEISE' -ForegroundColor Yellow
  $warns | ForEach-Object { Write-Host ('  · ' + $_) -ForegroundColor Yellow }
}
if ($fails.Count -eq 0) {
  Write-Host 'ERGEBNIS: GRUEN' -ForegroundColor Green
  Write-Host ''
  Write-Host 'Was der Exitcode NICHT geprüft hat — jetzt selbst ansehen:' -ForegroundColor DarkGray
  Write-Host '  · jede Visualisierung in den Reglerextremen' -ForegroundColor DarkGray
  Write-Host '  · Zuordnung und Reihenfolge per Touch, dann nur mit Tastatur' -ForegroundColor DarkGray
  Write-Host '  · Druckvorschau: Seitenleiste und Knöpfe weg, Lösungen aufgeklappt' -ForegroundColor DarkGray
  Write-Host '  · ob die Distraktoren plausibel sind und die Zahlen stimmen' -ForegroundColor DarkGray
  exit 0
} else {
  Write-Host 'ERGEBNIS: FEHLGESCHLAGEN' -ForegroundColor Red
  $fails | ForEach-Object { Write-Host ('  ! ' + $_) -ForegroundColor Red }
  exit 1
}
