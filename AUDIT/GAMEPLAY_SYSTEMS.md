# Audyt systemów gameplayu

## Zasada nadrzędna

Mechaniki gry są źródłem prawdy dla Enhanced Edition. Ten dokument opisuje istniejące systemy; nie jest zgodą na zmianę ich parametrów.

## Walka

W kodzie runtime występują odrębne moduły dotyczące:
- rozstrzygania walki i obrażeń (`combat.js`, `combat-resolve.js`),
- stylów walki i zachowań obronnych (`combat-style.js`),
- animacji i narzędzi walki,
- przeciwników, ich intencji i umiejętności,
- umiejętności gracza i bazy umiejętności,
- widoku walki (`views/battleView.js`).

Zidentyfikowane mechaniki obejmują timing/perfect block, zwykły blok, postawę defensywną, stamina, cooldowny, akcje przeciwnika, przerwania, finiszery, buffy/debuffy i mastery XP. Konkretne parametry należy zachować: koszty staminy, okna czasowe, cooldowny, mnożniki obrażeń, skalowanie i zasady progresji.

## Świat i eksploracja

Runtime obejmuje mapę/lokalizacje, kroki regionów, sloty eksploracji, przeciwników, skrzynie, kapliczki, obozowiska, zadania i wydarzenia fabularne. Stan regionu i jego opcji jest przechowywany w `gameState.world`.

## Progresja i ekwipunek

Kod zawiera system postaci, ekwipunku, przedmiotów, sklepu, statystyk, zasobów i zapisów trybów gry. Zmiany w strukturze stanu muszą uwzględniać istniejące zapisy użytkowników i funkcję `mergeDeep()`.

## Zapis i odtwarzanie

Występują osobne klucze localStorage dla trybów, m.in. `save_story`, `save_expedition`, `save_adventure`. `initializeGameState()` odtwarza zapis, scala go z domyślnym stanem i oblicza czas offline na podstawie metadanych.

Ważne ryzyko: odczyt JSON jest wykonywany bez zabezpieczenia try/catch w kilku ścieżkach. Uszkodzony lub niekompatybilny zapis może przerwać inicjalizację. Każda zmiana schematu wymaga testów migracji i zachowania kompatybilności.

## Wymagane testy regresji

- nowa gra i wybór klasy,
- zapis/odczyt każdego trybu,
- wznowienie gry po restarcie aplikacji,
- walka: perfect/normal/miss, blok defensywny, stamina break, cooldowny,
- umiejętności, buffy i ich wygasanie,
- śmierć, zwycięstwo, loot i nagrody,
- zmiana regionu i odtworzenie bieżącego kroku,
- sklep, ekwipunek i statystyki postaci.

Brak testów runtime w tym audycie oznacza, że powyższa lista jest planem weryfikacji, a nie potwierdzeniem poprawnego działania każdego scenariusza.