# TIK Tac Toe

Teamprojekt im Wintersemester 2023/24
am Karlsruher Institut für Technologie (KIT)

Die App „TIK Tac Toe“ soll einen Beitrag für den sanften Einstieg in das Thema KI
leisten. Schülerinnen und Schüler können mit wenigen Klicks ein regelbasiertes Expertensystem
erkunden, das nach und nach das Spiel „Tic Tac Toe“ erlernt. Dabei können
die Schülerinnen und Schüler die Entscheidungen des Expertensystems schrittweise nachvollziehen
und nehmen durch die Auswahl einer Belohnungsstrategie selbst Einfluss auf
das Lernverhalten des Systems. Sie lernen in diesem einfachen Setting das Konzept eines
Brute-Force-Ansatzes sowie der Rückführung.

Das Produkt erlaubt einen Einsatz im Unterricht nach einer Heranführung
durch die Lehrkraft. Wir gehen davon aus, dass den SuS die Hexapawn-Variante
HER bereits bekannt ist. Im Webinterface von „TIK Tac Toe“ können die SuS den Entscheidungsbaum
der KI erkunden, selbst gegen sie spielen oder zwei KIs gegeneinander
trainieren lassen. Am Ende einer Lerneinheit haben die SuS das Konzept von Gewichtsfunktionen
nachvollzogen und können diese als „Gedächtnis“ des Systems benennen, welches
den Lernprozess abbildet.

## Inhaltsverzeichnis

* [Nutzung des Projektes](#infos-zur-nutzung-des-projektes)
* [Voraussetzungen](#voraussetzungen)
* [IDE-Setup](#empfohlenes-ide-setup)
* [Hosting auf Servern](#hosting-auf-servern)

## Infos zur Nutzung des Projektes

Das Projekt ist auf dem [Server des Lehr-Lern-Labors der Fakultät für Informatik](https://files.lehr-lern-labor.info/tiktactoe) des KITs gehostet und auffindbar.

Nach dem Start des Programmes können im erscheinenden Bildschirm verschiedene (untrainierte) KIs oder menschliche Spieler ausgewählt und ein Spiel gestartet werden.
Außerdem sind einige Infos zum Spielen des Spiels als "Was ist das hier?" Fenster vorzufinden.
Im Menu am unteren Bildschirmrand kann zu anderen Bildschirmen gewechselt werden.
Auf dem Bildschirm *KIs* können Statistiken einzelner KIs angezeigt werden, neue KIs erzeugt und bestehende KIs verändert oder zurückgesetzt werden.
Im dritten Bildschirm (_Einstellungen_) finden sich Möglichkeiten den Ablauf des Spieles zu verkürzen und die Font der Website zu einem klassischeren Font abzuändern.  
Nach Spielbeginn sind die Einstellungen weiterhin zu finden.
Initial wird das Spielfeld und der Spielgraph angezeigt.  
Nach Beenden eines Spiels können die KIs, die das Spiel gespielt haben, belohnt werden oder das Spiel ohne zu Belohnen beendet werden.
Falls die Belohnungsoption gewählt wurde werden die Gewichte der KIs, welche sich geändert haben, durch eine grüne Farbe hervorgehoben.

## Voraussetzungen

Um das Projekt aus dem Code zu kompilieren und auszuführen muss

* [Node.js](https://nodejs.org/en/download) (^v 20.11.1)
* [Vue3](https://vuejs.org/guide/quick-start.html) (^v 3.3)

installiert sein.

## Empfohlenes IDE-Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (Vetur deaktivieren) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

Die folgenden Befehle müssen im Unterordner `project` ausgeführt werden.

### Projekt-Setup

```sh
npm install
```

### Kompilieren für die Entwicklung

```sh
npm run dev
```

### Unit Tests mit [Vitest](https://vitest.dev/) ausführen

```sh
npm run test:unit
```

Zusätzliche Informationen zur Testabdeckung

```sh
npm run coverage
```

## Hosting auf Servern

### Bauen für Produktion

Im Unterordner `project` kann

```sh
npm run build
```

ausgeführt werden, um das Projekt für die Produktion und das Laden auf einen Server zu bauen.

### Lage der Dateien

Das gebaute Projekt, welches dann auf einen Server gelegt werden kann, liegt danach im ['dist' Ordner](../ticTacToeamprojekt/ticTacToemproject/dist/index.html).
