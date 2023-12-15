# KIT Tac Toe
Luis Zeyer, Jonas Stelzer, Leonid Grau
Teamprojekt im Wintersemester 2023/24
am Karlsruher Institut für Technologie (KIT)
betreut von Annika Vielsack

Die App „KIT Tac Toe“ soll einen Beitrag für den sanften Einstieg in das Thema KI
leisten. Schülerinnen und Schüler können mit wenigen Klicks ein regelbasiertes Expertensystem
erkunden, das nach und nach das Spiel „Tic Tac Toe“ erlernt. Dabei können
die Schülerinnen und Schüler die Entscheidungen des Expertensystems schrittweise nachvollziehen
und nehmen durch die Auswahl einer Belohnungsstrategie selbst Einfluss auf
das Lernverhalten des Systems. Sie lernen in diesem einfachen Setting das Konzept eines
Brute-Force-Ansatzes sowie der Fehlerrückführung.

Die geplanten Funktionalitäten erlauben einen Einsatz im Unterricht nach einer Heranführung
durch die Lehrkraft. Wir gehen davon aus, dass den SuS die Hexapawn-Variante
HER bereits bekannt ist. Im Webinterface von „TI K Tac Toe“ können die SuS den Entscheidungsbaum
der KI erkunden, selbst gegen sie spielen oder zwei KIs gegeneinander
trainieren lassen. Am Ende einer Lerneinheit haben die SuS das Konzept von Gewichtsfunktionen
nachvollzogen und können diese als „Gedächtnis“ des Systems benennen, welches
den Lernprozess abbildet.

## Vorherige Releases
* [Abschluss Sprint "Anforderung"](https://github.com/idlaviV/ticTacToeamprojekt/releases/tag/v0.1-anforderung)

## Empfohlenes IDE-Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (Vetur deaktivieren) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

Die folgenden Befehle müssen im Unterordner `ticTacToemproject` ausgeführt werden.

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