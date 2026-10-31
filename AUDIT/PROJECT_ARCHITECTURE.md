# Architektura projektu

## Punkt odniesienia

Audyt dotyczy wyłącznie `Poul12/RpgLooter:develop` na commicie `6bc141117907f445da53d62e99b32680400ef28f`. Oryginalne repozytorium pozostaje nietknięte.

## Główne warstwy

- `www/index.html` — główny dokument, szkielet HUD i warstw aplikacji.
- `www/js/` — starsza warstwa bootstrapu, stan gry, menu, routing, asset manager i współdzielone narzędzia.
- `www/live/js/` — nowszy runtime gry, widoki i systemy gameplayu.
- `www/live/css/` — style widoków runtime.
- `www/css/` — starsze style podstawowe/menu.
- `android/`, `capacitor.config.json` — projekt Android/Capacitor.
- `config.xml` i workflow GitHub Actions — ścieżka Cordova.
- `codemagic.yaml` — ścieżka Capacitor/Gradle.
- Zewnętrzne repo assetów: `Poul12.github.io/rpglooter-assets`.

## Ścieżka startowa — potwierdzona statycznie

1. `index.html` ładuje klasyczny bootstrap JS z `www/js/`.
2. `app.js` reaguje na `DOMContentLoaded`, inicjalizuje stan, menu i bootstrap runtime.
3. `bootstrap()` sprawdza status internetu i uruchamia ładowanie CSS/JS runtime.
4. `liveJsLoadPath()` ładuje pliki z `www/live/js/` przez `assetManager.loadPatchedScript()`.
5. `liveCssLoadPath()` ładuje style z `www/live/css/`.
6. `router.js` wybiera widok i wywołuje funkcje renderujące, np. `renderBattleView()`.

Wniosek: `www/live/js/` jest aktywnym runtime ładowanym dynamicznie, a nie po prostu alternatywną kopią nieużywanego kodu. Jednocześnie `www/js/` pozostaje krytyczny dla uruchomienia i routingu.

## Istotne zależności

- `index.html` zawiera markup HUD i odwołania do identyfikatorów DOM używanych przez runtime.
- `menu.js` definiuje listy plików JS/CSS ładowanych przez asset manager.
- `asset-manager.js` odpowiada za URL-e assetów, cache, manifest, ładowanie skryptów i stylów.
- `gameState.js` przechowuje domyślny stan, migracje/merge i zapis.
- Widoki w `www/live/js/views/` tworzą markup, na którym operują systemy gameplayu.

## Ryzyka architektoniczne

1. **Silne powiązanie przez globalny stan i globalne funkcje.** Moduły odwołują się do `gameState`, DOM i funkcji z innych skryptów bez jawnych interfejsów.
2. **Ładowanie skryptów przez ręczną listę.** Kolejność oraz kompletność listy w `liveJsLoadPath()` ma znaczenie dla dostępności funkcji i danych.
3. **Dwie generacje katalogów JS/CSS.** Trzeba pilnować, które pliki są aktywne, a które pozostały po wcześniejszych iteracjach.
4. **Bootstrap i start nowej gry są rozdzielone.** `app.js` ładuje runtime, a `menu.js` steruje wejściem do gry. Część wywołań asset managera w `bootGame()` jest zakomentowana.
5. **Warstwa widoku i logika nie są w pełni odseparowane.** Wymaga to ostrożnego refaktoringu, aby nie zmienić zachowania walki.

## Zalecenia

- Przed refaktorem sporządzić mapę zależności i kolejności ładowania wszystkich skryptów.
- Zachować obecny bootstrap do czasu, aż jego odpowiednik będzie przetestowany.
- Stopniowo wprowadzać jawne granice modułów, bez przepisywania całej gry naraz.
- Nie usuwać starszych plików wyłącznie na podstawie ich nazwy lub lokalizacji.