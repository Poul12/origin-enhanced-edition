# Audyt assetów i pipeline’u zasobów

## Zewnętrzne źródło

Asset manager wskazuje zewnętrzne repozytorium GitHub Pages:

`https://Poul12.github.io/rpglooter-assets`

Manifest jest pobierany z `/manifest.json`. Manager przechowuje lokalny manifest w localStorage, śledzi pliki i hashe oraz obsługuje cache i tryby dostępu do assetów.

## Uwagi techniczne

- `getAssetUrl()`, `preloadAssets()`, `loadPatchedScript()` i `loadPatchedCss()` są krytyczne dla startu gry.
- `liveJsLoadPath()` pobiera pliki runtime przez asset manager, więc kod JS również zależy od tej infrastruktury.
- W kodzie znajdują się na sztywno wpisane ścieżki lokalnego cache i lokalnego repo MGit w pamięci Android. To ustawienie developerskie, nie przenośna konfiguracja produkcyjna.
- Nie wolno zakładać, że assety w repo głównym są kompletne: duża część zasobów pochodzi z osobnego repo.
- Assetów nie wolno przenosić, zmieniać nazw ani usuwać bez wyszukania referencji w HTML, JS, CSS, manifestach i danych.

## Duże pliki w repo źródłowym

W badanym Git tree cztery obrazy loading screen przekraczają 1 MB:
- `hero-story-loading.png` — 3,004,427 B
- `land-story-loading.png` — 2,301,446 B
- `port-story-loading.png` — 2,280,061 B
- `storm-story-loading.png` — 2,422,782 B

To istotne przy imporcie przez narzędzia/API, które mają ograniczenia dla plików binarnych. Nie należy pomijać ich bez odnotowania.

## Zalecenia

1. Zachować asset manager podczas pierwszego snapshotu.
2. Przed zmianami wykonać pełny wykaz ścieżek i hashy assetów oraz porównać je z manifestem zewnętrznym.
3. Ustalić jeden mechanizm konfiguracji ścieżek lokalnych zamiast ścieżek MGit zakodowanych w kodzie.
4. Dodać walidację: brakujące assety, duplikaty, nieużywane pliki, rozmiary, błędne ścieżki.
5. Rozważyć lazy loading i grupowanie preloadów dopiero po pomiarach.
6. Przy snapshotowaniu weryfikować blob SHA dla każdego pliku, a nie tylko liczbę skopiowanych plików.

## Ograniczenie

Nie wykonano kompletnego pobrania i analizy zewnętrznego repo assetów ani porównania manifestu z plikami lokalnymi. Ten etap pozostaje osobnym zadaniem.