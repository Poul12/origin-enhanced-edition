# Roadmap — Origin: Enhanced Edition

**Stan aktualny:** 2026-11-09  
**Aktywna gałąź robocza:** `feature/save-import-restore`  
**Dokument źródłowy audytu:** `audit/full-project-review-2026-10-31`  
**Zasada:** statusy oznaczają wyłącznie prace potwierdzone w kodzie, historii lub testach. „Częściowo” i „do weryfikacji” nie są traktowane jako ukończone.

## Zasady projektu

- Pracujemy wyłącznie w `Poul12/origin-enhanced-edition`, na dedykowanych gałęziach.
- Oryginalne `Poul12/RpgLooter` pozostaje źródłem prawdy i nie jest modyfikowane.
- Bez merge, deploy, resetu ani force-push bez wyraźnej zgody.
- Nie zmieniać mechanik ani balansu bez akceptacji.
- Każda poprawka wymaga ustalenia przyczyny, zakresu, reprodukcji i testu regresji.
- Nie oznaczać zadania jako ukończonego wyłącznie na podstawie analizy statycznej.

## Etap 0 — audyt i kontrola źródła

<badge>Ukończony</badge>

- [x] Potwierdzono źródłowy commit `6bc141117907f445da53d62e99b32680400ef28f`.
- [x] Utworzono osobną gałąź audytową.
- [x] Przeanalizowano strukturę repozytorium, bootstrap i aktywny runtime.
- [x] Sporządzono raporty architektury, gameplayu, błędów, wydajności, UI/UX i assetów.
- [x] Zatwierdzono zakres: audyt nie zmienia mechanik ani oryginalnego repozytorium.
- [x] Wykonano osobny snapshot kodu źródłowego.

## Etap 1 — snapshot i integralność

<badge>Snapshot wykonany; pełna weryfikacja integralności do potwierdzenia</badge>

- [x] Zaimportowano kod bazujący na wskazanym źródłowym SHA.
- [x] Utworzono osobną gałąź snapshotu.
- [x] Zachowano manifesty zależności.
- [x] Zidentyfikowano zewnętrzne repozytorium assetów i duże pliki loading screen w raporcie audytu.
- [ ] Potwierdzić kompletny wykaz pominiętych plików i przyczyn.
- [ ] Potwierdzić porównanie blob SHA dla wszystkich plików snapshotu.
- [ ] Ponownie zweryfikować zgodność lokalnego zestawu assetów z zewnętrznym manifestem.

## Etap 2 — uruchamialność i test baseline

<badge color="warning">Częściowo wykonany</badge>

- [x] Uruchomiono aplikację w przeglądarce Android i wykonano testy ręczne.
- [x] Sprawdzono działanie instalacji/aktualizacji APK w dotychczasowym pipeline.
- [x] Zebrano raporty diagnostyczne runtime.
- [ ] Odtworzyć zależności na czystym środowisku.
- [ ] Wybrać i udokumentować jeden docelowy pipeline Android (Cordova albo Capacitor).
- [ ] Dodać rzeczywiste testy smoke i walidację statyczną; obecny skrypt testowy nie stanowi testu.
- [ ] Zapisać porównywalny baseline błędów konsoli i zachowania aplikacji.
- [ ] Zweryfikować zimny start online, offline i z pełnym cache.

## Etap 3 — naprawy stabilności

<badge color="warning">W toku</badge>

### 3.1 Zapisy, odczyt i odzyskiwanie

<badge color="success">Podstawowa ścieżka przetestowana</badge>

- [x] Zabezpieczono odczyt nieprawidłowego JSON w aktywnej ścieżce inicjalizacji.
- [x] Rozdzielono wykrycie nieprawidłowego zapisu od automatycznego nadpisania go stanem domyślnym.
- [x] Naprawiono zerowanie flagi odzyskiwania przy rozpoczęciu nowej kampanii.
- [x] Dodano centralną blokadę `saveGame()` podczas aktywnego stanu odzyskiwania.
- [x] Ręcznie sprawdzono rozpoczęcie kampanii i wznowienie przez Kontynuuj.
- [x] Sprawdzono zachowanie zakupionej i założonej broni po wyjściu i ponownym uruchomieniu.
- [x] Wykonano kontrolowany test: nieprawidłowy zapis przetrwał wejście w Opcje i powrót do menu.
- [x] Wykonano kontrolowany test: nieprawidłowy zapis przetrwał zmianę języka.
- [x] Przywrócono kopię zapasową i potwierdzono powrót przycisku Kontynuuj oraz postępu.
- [ ] Dodać powtarzalne testy automatyczne dla odczytu, zapisu, backupu, restore i recovery.
- [ ] Zweryfikować kompatybilność/migrację starszych i niekompletnych zapisów dla wszystkich trybów.

### 3.2 Zegary, buffy, cooldowny i pauza

<badge color="warning">Częściowo zweryfikowane</badge>

- [x] Wykonano wcześniejsze poprawki i ręczne testy wybranych timerów/odliczań, pauzy i wznowienia widoku.
- [ ] Osobno odtworzyć przypadki buffów wskazane w BUG-02/BUG-03: przed pauzą, w pauzie, po reloadzie i przy zmianie timeScale.
- [ ] Ustalić i udokumentować, czy każdy timer używa czasu świata, czasu rzeczywistego czy czasu aktywnej rozgrywki.
- [ ] Potwierdzić spójność cooldownów i stamina po zmianie widoku oraz reloadzie.

### 3.3 Lifecycle listenerów i timerów

<badge color="secondary">Do wykonania</badge>

- [ ] Sprawdzić rejestrację i usuwanie listenerów walki.
- [ ] Sprawdzić listenery `load`/`resize` HUD/mapy przy wielokrotnej inicjalizacji.
- [ ] Sprawdzić sprzątanie timerów, w tym odliczania ucieczki, przy zmianie widoku i ponownym wejściu do walki.
- [ ] Każdy znaleziony problem najpierw odtworzyć; nie wprowadzać poprawek na podstawie samej hipotezy.

### 3.4 Bootstrap i Asset Manager

<badge color="secondary">Do wykonania</badge>

- [ ] Prześledzić pełny lifecycle od `DOMContentLoaded` do wejścia do gry.
- [ ] Zweryfikować inicjalizację manifestu, cache i obsługę błędów pobierania assetów.
- [ ] Sprawdzić zachowanie przy braku sieci, brakującym assetcie i błędzie runtime.
- [ ] Uporządkować zachowanie reload/recovery bez zmiany działającej ścieżki startowej bez testów.

### 3.5 Testy regresji gameplayu i progresji

<badge color="warning">Częściowo wykonane</badge>

- [x] Ręcznie sprawdzono wybrane scenariusze walki, ucieczki i ponownego wejścia do walki.
- [x] Sprawdzono wybrane zachowania ekwipunku i kodeksu po wcześniejszych poprawkach.
- [ ] Przygotować checklistę i wykonać testy: perfect/normal/miss, blok, stamina break, cooldowny i umiejętności.
- [ ] Sprawdzić buffy/debuffy, śmierć, zwycięstwo, loot i nagrody.
- [ ] Sprawdzić zmianę regionu, bieżący krok, zadania i odtworzenie progresji.
- [ ] Sprawdzić sklep, ekwipunek i statystyki postaci po reloadzie.

## Etap 4 — wydajność

<badge color="secondary">Nie rozpoczęto</badge>

- [ ] Profilowanie na słabszym Androidzie i desktop.
- [ ] Pomiar czasu klatki (mediana/p95), FPS, pamięci i czasu startu.
- [ ] Analiza kosztownych aktualizacji DOM i pętli animacji.
- [ ] Pomiar preloadingu, cache i ładowania runtime.
- [ ] Testy długich sesji i ewentualnych wycieków pamięci.
- [ ] Optymalizacje dopiero po zebraniu metryk porównawczych.

## Etap 5 — architektura i UI

<badge color="secondary">Nie rozpoczęto</badge>

- [ ] Wyznaczyć stabilne interfejsy między stanem, gameplayem i widokami.
- [ ] Sporządzić mapę zależności i kolejności ładowania skryptów.
- [ ] Ujednolicić design tokens i responsywność.
- [ ] Przygotować projekt full-screen areny walki.
- [ ] Zachować mechaniki, istniejące zapisy i kontrakty DOM/danych albo aktualizować je razem z testami.
- [ ] Dodać sterowanie klawiaturą desktop bez usuwania obsługi dotykowej Android.

## Etap 6 — grafika i polish

<badge color="secondary">Nie rozpoczęto</badge>

- [ ] Udoskonalać assety etapami, bez nieuzasadnionego przenoszenia i zmiany nazw.
- [ ] Zachować czytelność HUD i wydajność na słabszych urządzeniach.
- [ ] Testować zmiany wizualne na docelowych rozdzielczościach.
- [ ] Nie dodawać nowych mechanik w ramach prac czysto wizualnych.

## Dziennik postępu

### 2026-11-09 — stabilność zapisów

- Potwierdzono normalny zapis postępu i odtworzenie założonej broni po ponownym uruchomieniu.
- Potwierdzono rozpoczęcie nowej kampanii i wznowienie przez Kontynuuj.
- Kontrolowany nieprawidłowy zapis pozostał niezmieniony po wejściu w Opcje i powrocie do menu.
- Kontrolowany nieprawidłowy zapis pozostał niezmieniony po zmianie języka.
- Przywrócono backup; użytkownik potwierdził poprawny postęp i działanie gry.
- Tymczasowa strona testowa została usunięta.
- Zmiany kodu dotyczące recovery zapisano wcześniej w commitach na `feature/save-import-restore`; ten wpis dokumentuje testy, nie wprowadza zmian w mechanice.

## Kryterium ukończenia etapu

Etap można oznaczyć jako ukończony dopiero po raporcie zawierającym:
- zmienione pliki i commity,
- przyczynę każdej poprawki,
- reprodukcję i testy wykonane po zmianie,
- wyniki testów i nierozwiązane ryzyka,
- potwierdzenie, że nie naruszono mechanik ani oryginalnego repozytorium.

Snapshot nie jest merge'em ani zgodą na wdrożenie. Roadmapa jest dziennikiem stanu prac, a nie automatyczną zgodą na kolejne zmiany.
