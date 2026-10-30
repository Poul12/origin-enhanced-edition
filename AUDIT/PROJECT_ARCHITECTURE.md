# Audyt architektury Origin

## 1. Zakres i punkt odniesienia

- Data: 2026-10-30
- Repozytorium: `Poul12/RpgLooter`
- Gałąź: `develop`
- Commit: `6bc141117907f445da53d62e99b32680400ef28f`
- Repozytorium Enhanced Edition: `Poul12/origin-enhanced-edition`
- Audyt wykonano bez modyfikowania źródłowego repozytorium.

W drzewie źródłowym znaleziono 422 wpisy, w tym 319 plików. Około 75 plików JavaScript, 11 CSS i 14 HTML występuje w całym repozytorium; 41 plików JS i 7 CSS znajduje się w `www/live`. W drzewie znajdują się także 153 pliki pod `node_modules/`.

## 2. Technologie i platformy

- HTML5, CSS i Vanilla JavaScript.
- Capacitor dla aplikacji Android.
- Android Gradle Plugin 8.7.2, Gradle 8.11.1, SDK compile/target 35, min SDK 23 w konfiguracji Gradle.
- Capacitor Filesystem wykorzystywany przez AssetManager do cache'owania plików.
- Zasoby gry i część kodu runtime mogą być pobierane z GitHub Pages: `https://Poul12.github.io/rpglooter-assets`.

Nie znaleziono frameworka frontendowego ani głównego renderera Canvas. Widoki są budowane i aktualizowane przez DOM.

## 3. Wejście aplikacji i uruchamianie

### Główne pliki

| Plik | Odpowiedzialność |
|---|---|
| `www/index.html` | Główny dokument, statyczny HUD i kontenery ekranów |
| `www/js/app.js` | Bootstrap aplikacji, odczyt save, ładowanie runtime |
| `www/js/menu.js` | Menu, start/continue, dynamiczne ładowanie JS i CSS |
| `www/js/gameState.js` | Fabryki stanu, inicjalizacja, merge, save/load |
| `www/js/shared.js` | Wspólne funkcje, pętla gry, aktualizacja HUD |
| `www/js/global-states.js` | Funkcje czasu gry, pauzy i wspólny stan |
| `www/js/asset-manager.js` | Cache, pobieranie, rozwiązywanie ścieżek i dynamiczny loader |
| `www/js/assetBundles.js` | Zestawy assetów ładowanych przez widoki |

### Aktualna sekwencja startowa

1. `DOMContentLoaded` uruchamia Analytics.
2. `initializeGameState()` odczytuje zapis wybranego trybu domyślnego.
3. Aplikacja próbuje wznowić sesję przez `resumeAfterReload()`.
4. Jeśli nie ma wznowienia, buduje menu.
5. `bootstrap()` wywołuje `assetManager.updateInternetStatus()`.
6. `loadLiveRuntime()` uruchamia równolegle `liveCssLoadPath()` i `liveJsLoadPath()`.
7. Po załadowaniu runtime aplikacja odsłania dokument.

Istotne miejsca:
- `www/js/app.js:25-43`
- `www/js/menu.js:845-867`
- `www/js/menu.js:1296-1404`

### Ładowanie modułów

`liveJsLoadPath()` ładuje część modułów sekwencyjnie, a następnie pozostałą listę przez `Promise.all()`. Takie rozwiązanie jest szybkie, ale tworzy niejawny kontrakt zależności: pliki ładowane równolegle nie mogą wymagać kolejności wykonania na poziomie top-level. Ten graf zależności trzeba jawnie zmapować przed przebudową loadera.

W repozytorium pozostaje też `liveJsLoadPath2()`, czyli druga, alternatywna ścieżka ładowania. Nie należy jej usuwać przed sprawdzeniem, czy jest używana przez testy lub inne ekrany.

## 4. Mapa modułów gameplayu

### Walka

| Plik | Zakres |
|---|---|
| `live/js/combat.js` | Rozpoczęcie walki, gracz, atak, blokowanie, ucieczka |
| `live/js/combat-resolve.js` | Rozstrzyganie obrażeń i wyników akcji |
| `live/js/combat-style.js` | Mechaniki stylów, przerwania, kontrola i mastery |
| `live/js/combat-utility.js` | Wspólne obliczenia i narzędzia walki |
| `live/js/combat-animations.js` | Animacje walki |
| `live/js/enemy.js` | Cykl ataku przeciwnika, windup, cooldown, statusy |
| `live/js/enemy-database.js` | Definicje przeciwników |
| `live/js/enemy-skills.js` | Umiejętności przeciwników |

### Postać i progresja

- `character.js`: logika postaci i statystyk.
- `skills.js`: odblokowywanie, rozwój i prezentacja umiejętności.
- `skills-database.js`: definicje umiejętności i parametry.
- `skills-combat.js`: używanie umiejętności w walce, cooldowny i buffy.
- `item.js`, `item-utility.js`: przedmioty, generowanie i obliczenia.
- `inventory.js`, `store.js`, `store-items.js`: ekwipunek i sklep.

### Świat i zawartość

- `battle.js`, `map.js`, `exploring-utility.js`, `location.js`: eksploracja, mapa, spotkania i lokacje.
- `quests.js`, `quests-assets.js`, `quests-database.js`: zadania i dane fabularne.
- `shrine-chest.js`, `shrine-chest-database.js`: skrzynie i kapliczki.
- `expedition-config.js`: konfiguracja trybu ekspedycji.
- `game-guide.js`: przewodnik i podpowiedzi.

### Widoki

`live/js/views/` zawiera osobne widoki mapy, walki, postaci, ekwipunku, sklepu i umiejętności. Widoki tworzą lub modyfikują HTML i wiążą go z globalnym stanem gry.

## 5. Model stanu

Główny stan znajduje się w `gameState`, tworzonym przez `createNewGameState()` w `www/js/gameState.js`. Obejmuje m.in.:

- `char`: postać, statystyki, atrybuty, wyposażenie, mastery.
- `inventory`: przedmioty.
- `world`: tryb, lokacja, eksploracja i stan świata.
- `expedition`: wyniki i postęp ekspedycji.
- `combat`: stan walki, efekty, umiejętności, blokowanie i przeciwnik.
- `resources`: stamina, energia, jedzenie i pozostałe zasoby.

Oddzielny `appState` przechowuje stan runtime'u: `gameTime`, pauzę, hit-stop, slow motion, flagi inicjalizacji i stan silnika. Część informacji o cooldownach jest w `gameState`, a animacja cooldownu w osobnym globalnym `skillCooldownState`. To rozdzielenie wymaga jasnej reguły: dane gameplayowe muszą być odtwarzalne z zapisu, a stan animacji powinien być odtwarzalny z danych gameplayowych.

## 6. Zapis i odtwarzanie

Zapis jest rozdzielony na klucze:
- `save_story`
- `save_expedition`
- `save_adventure`

`saveGame()` zapisuje pełny `gameState` oraz metadane `savedAtReal` i `gameTime`. Przy odczycie `initializeGameState()` tworzy nowy stan bazowy i scala zapis przez `mergeDeep()`.

Pliki i miejsca:
- `www/js/gameState.js:782-816` — inicjalizacja.
- `www/js/gameState.js:854-868` — merge.
- `www/js/gameState.js:895-912` — zapis.
- `www/js/gameState.js:968-1004` — status save i lifecycle silnika.

Nie znaleziono jawnego numeru wersji schematu zapisu. Nie ma też walidacji danych wejściowych ani migracji wersji w jednym, centralnym miejscu.

## 7. Asset Manager

`AssetManager`:
- sprawdza dostępność internetu;
- może odczytać manifest z zewnętrznego hosta;
- zapisuje pliki przez Capacitor Filesystem;
- próbuje użyć cache przed pobraniem zdalnym;
- dynamicznie ładuje JS i CSS;
- udostępnia `preloadAssets()`, `getResolvedAsset()` i `getAssetUrl()`.

Ważne funkcje:
- `www/js/asset-manager.js:548` — pobieranie manifestu.
- `www/js/asset-manager.js:1165` — ładowanie skryptów.
- `www/js/asset-manager.js:1303` — wybór źródła assetu.
- `www/js/asset-manager.js:1452` — pełna inicjalizacja i synchronizacja.
- `www/js/asset-manager.js:1671` — tylko kontrola połączenia.
- `www/js/asset-manager.js:1727` — lokalny cache.

W aktywnym bootstrapie wywoływane jest `updateInternetStatus()`, natomiast `assetManager.init()` jest zakomentowane w `bootGame()`. W konsekwencji pełna synchronizacja manifestu i cache nie jest częścią aktualnej ścieżki startowej.

## 8. Build i zależności

- Root `package.json` zawiera zależności Capacitor, ale brak skryptów build/test.
- `www/package.json` ma test typu placeholder: `echo "No test" && exit 0`.
- GitHub Actions tworzy nowy projekt Cordova i buduje APK.
- Codemagic synchronizuje i buduje istniejący projekt Capacitor.
- W repozytorium są śledzone pliki z `node_modules/`.
- Brakuje głównego `.gitignore`; znajdują się tylko pliki ignorowania w katalogach Android.

Dwa równoległe procesy budowania (Cordova i Capacitor) utrudniają ustalenie jednego kanonicznego sposobu tworzenia aplikacji.

## 9. Najważniejsze ryzyka architektoniczne

1. Globalny stan i globalne funkcje utrudniają testowanie izolowanych systemów.
2. Runtime ładowany z zewnętrznego hosta może różnić się od snapshotu w repozytorium.
3. Loader częściowo zachowuje kolejność, a częściowo ładuje moduły równolegle.
4. Stan gameplayowy i stan UI/cooldownów są rozdzielone, ale nie wszędzie mają spójny lifecycle.
5. Save schema nie jest wersjonowany.
6. Cache assetów nie jest synchronizowany w aktywnej ścieżce startowej.
7. Jednocześnie utrzymywane są dwa sposoby budowania Androida.

## 10. Zalecana architektura Enhanced Edition

Nie rekomenduję migracji do frameworka ani silnika. Zalecam stopniowe wydzielenie granic:

- `core/`: zegar gry, event bus, lifecycle, walidacja i save service.
- `state/`: stan trwały i stan runtime, jawne API aktualizacji.
- `combat/`: timeline przeciwnika, walka gracza, rozstrzyganie, statusy, style.
- `progression/`: mastery, skills, level i statystyki.
- `items/`: generator, przedmioty, affixy, ekwipunek.
- `world/`: mapa, lokacje, questy i eksploracja.
- `assets/`: manifest, cache, preload, resolver.
- `ui/`: widoki i kontrolery UI, oddzielone od logiki gameplayu.
- `platform/`: adaptery Android/Capacitor i desktop/browser.

Migracja powinna być stopniowa: najpierw kontrakty i testy, potem przenoszenie pojedynczych modułów. Nie zmieniać formuł gameplayu ani formatu zapisu bez jawnego planu migracji.
