# Audyt wydajności

## Kontekst urządzeń

Projekt jest mobilny i ma działać również na słabszych urządzeniach Android. Poprzednie obserwacje użytkownika wskazują, że wydajność może różnić się znacząco między urządzeniami, dlatego nie wolno opierać optymalizacji wyłącznie na mocnym telefonie.

## Potwierdzone elementy architektury

- Gra korzysta z JavaScript i DOM do renderowania interfejsu.
- Runtime jest ładowany dynamicznie przez asset manager.
- `preloadAssets(paths)` rozwiązuje ścieżki sekwencyjnie.
- Skrypty i style są dodawane dynamicznie do dokumentu.
- Główne moduły walki są duże: m.in. `skills-combat.js` ok. 79 KB, `combat.js` ok. 70 KB, `enemy.js` ok. 69 KB, `battle.js` ok. 51 KB. Rozmiar pliku nie jest sam w sobie dowodem wolnego działania, ale utrudnia profilowanie i utrzymanie.

## Obszary ryzyka

1. **Aktualizacje DOM w pętli walki.** Należy sprawdzić, które funkcje są wywoływane co klatkę i czy nie wykonują kosztownych odczytów/zapisów DOM.
2. **Timery i interwały.** Cooldowny, buffy, stamina i akcje przeciwnika mogą mieć różne źródła czasu; trzeba upewnić się, że pauza i timeScale działają spójnie.
3. **Sekwencyjne rozwiązywanie assetów.** Przy dużej liczbie assetów może wydłużać preloading; wymaga pomiaru i ewentualnej równoległości z limitem.
4. **Duże moduły globalne.** Utrudniają izolowanie kosztownych ścieżek i testowanie.
5. **Cache i zewnętrzny hosting.** Wydajność startu zależy od manifestu, sieci, cache i zewnętrznego repo assetów.
6. **DOM/CSS.** Duże arkusze i dynamiczne widoki mogą powodować kosztowne layout/paint; trzeba profilować konkretne scenariusze.

## Co jest nieznane

Nie wykonano pomiarów FPS, czasu klatki, pamięci, liczby DOM nodes, czasu bootu, transferu sieciowego ani testów na urządzeniach. Nie stwierdzamy więc, że konkretny moduł powoduje spadki FPS.

## Plan pomiarów

- zimny start online/offline i start z pełnym cache,
- wejście do walki i walka z kilkoma typami przeciwników,
- intensywne animacje, statusy, buffy i cooldowny,
- przejście między widokami,
- dłuższa sesja w celu wykrycia wycieków pamięci/listenerów,
- test na słabszym Androidzie oraz desktop Chrome.

Zbierane metryki: mediana i p95 czasu klatki, FPS, heap, czas ładowania runtime, czas rozwiązywania assetów, błędy konsoli.