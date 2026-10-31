# Origin Enhanced Edition — świeży audyt techniczny

**Data:** 2026-10-31  
**Repozytorium źródłowe:** `Poul12/RpgLooter`  
**Gałąź źródłowa:** `develop`  
**Commit źródłowy:** `6bc141117907f445da53d62e99b32680400ef28f`  
**Gałąź audytowa:** `audit/full-project-review-2026-10-31`

## Cel

Ocenić istniejący projekt przed rozpoczęciem prac nad Origin: Enhanced Edition. Audyt nie wprowadza zmian w kodzie gry i nie zmienia mechanik.

## Zakres

- struktura repozytorium i zależności,
- uruchamianie aplikacji i wybór aktywnego runtime,
- systemy gameplayu i zapisu,
- asset manager i zewnętrzne assety,
- wydajność i potencjalne źródła problemów,
- UI/UX oraz gotowość na desktop,
- pipeline Android/Cordova/Capacitor,
- ryzyka i kolejność dalszych prac.

## Raporty

- [Architektura](PROJECT_ARCHITECTURE.md)
- [Systemy gameplayu](GAMEPLAY_SYSTEMS.md)
- [Znalezione problemy i ryzyka](BUG_REPORT.md)
- [Wydajność](PERFORMANCE_AUDIT.md)
- [UI/UX](UI_UX_AUDIT.md)
- [Assety](ASSET_AUDIT.md)
- [Plan Enhanced Edition](ENHANCED_EDITION_ROADMAP.md)

## Inwentaryzacja

Rekurencyjny Git Tree dla badanego commita zwrócił 422 wpisy: 319 plików (blobs) i 103 katalogi. Wśród plików znajduje się 153 pliki w `node_modules/`. Repo zawiera m.in. 41 plików JS w `www/live/js/`, 19 w starszym `www/js/`, 7 arkuszy CSS w `www/live/css/` i 5 w `www/css/`. Zliczenia obejmują pliki tracked w Git; nie są pomiarem rozmiaru całej aplikacji po instalacji.

## Ograniczenia audytu

To audyt statyczny na podstawie kodu i metadanych Git. Nie uruchomiono gry, nie wykonano builda, testów automatycznych, testów na Androidzie/Windows ani pomiarów FPS, pamięci czy czasu ładowania. Wnioski opisane jako „hipoteza” lub „do reprodukcji” nie są potwierdzonymi błędami runtime.

**Snapshot kodu gry nie jest częścią tego etapu.** Najpierw zamykamy audyt i zatwierdzamy jego wnioski; dopiero później wykonamy osobny, kontrolowany snapshot.