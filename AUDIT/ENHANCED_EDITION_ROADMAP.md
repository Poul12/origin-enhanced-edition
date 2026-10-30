# Enhanced Edition — Roadmap po audycie

**Źródło:** `Poul12/RpgLooter` / `develop` / `6bc141117907f445da53d62e99b32680400ef28f`  
**Cel:** nowa, osobna wersja Origin w HTML/CSS/Vanilla JS dla Androida i Windows desktop.  
**Zasada:** zachować mechaniki; zmiany balansu i schematu zapisu wymagają osobnej zgody.

## Zasady realizacji

1. Oryginalne repozytorium jest źródłem prawdy dla zachowania gameplayu i pozostaje nietknięte.
2. Prace odbywają się wyłącznie w `Poul12/origin-enhanced-edition`, na gałęziach roboczych i przez PR.
3. Nie przenosić w ciemno całego `node_modules`, Android projektu ani 350 MB zasobów.
4. Nie zmieniać obrażeń, cooldownów, kosztów staminy/guard, timing windows, mastery XP, skalowania ani progresji.
5. Każdy etap kończy się testami, raportem i sprawdzeniem regresji.
6. Nie przechodzić do kolejnego etapu, jeśli poprzedni ujawni ryzyko utraty danych lub rozjazdu mechanik.

## Etap 0 — Zablokowanie źródła prawdy i import snapshotu

**Cel:** mieć kompletny, powtarzalny punkt startowy.

Zadania:
- [ ] Zapisać commit źródłowy i hash manifestu assetów.
- [ ] Uzyskać dostęp do `Poul12.github.io/rpglooter-assets` i pobrać manifest.
- [ ] Porównać zdalne `live/js` i `live/css` z plikami z gałęzi `develop`.
- [ ] Wskazać, które pliki są faktycznie uruchamiane w produkcji.
- [ ] Przenieść potrzebny snapshot kodu do nowego repo, bez historii starego repo i bez niepotrzebnych binariów.
- [ ] Ustalić jeden kanoniczny proces uruchamiania i budowania.

**Gate:** brak importu, dopóki nie wiadomo, czy snapshot odpowiada wersji wykonywanej przez grę.

## Etap 1 — Stabilność i integralność danych (P0/P1)

**Cel:** zabezpieczyć save, zasoby i czas gry przed zmianami architektury.

Zadania:
- [ ] Zaprojektować wersjonowany schemat save i migracje.
- [ ] Dodać bezpieczny parser, walidację i backup uszkodzonego zapisu.
- [ ] Naprawić porównywanie deadline'ów buffów i zegarów.
- [ ] Ustalić, czy buffy i cooldowny biegną podczas pauzy/offline.
- [ ] Naprawić atomową walidację kosztów umiejętności (stamina + guard).
- [ ] Zweryfikować wywołania restore buffów/cooldownów po reloadzie.
- [ ] Dodać testy zapisu/odczytu dla story, adventure i expedition.
- [ ] Dodać testy migracji reprezentatywnych starszych save'ów.

**Gate:** testy save/load i clock/pause przechodzą; brak utraty pól i zasobów.

## Etap 2 — Runtime, asset loader i offline

**Cel:** deterministyczny start i jedno źródło assetów.

Zadania:
- [ ] Opisać zależności modułów i kolejność ładowania.
- [ ] Zastąpić niejawne globalne ładowanie deklarowanym boot sequence bez zmiany API gameplayu.
- [ ] Zdefiniować pojedynczą inicjalizację AssetManager.
- [ ] Przywrócić i przetestować manifest/cache/offline flow.
- [ ] Ujednolicić rozwiązywanie ścieżek assetów.
- [ ] Dodać raport brakujących referencji i hashów.
- [ ] Zmierzyć czas startu i koszt preloadu.
- [ ] Dodać graceful fallback dla brakujących assetów i awarii sieci.

**Gate:** cold start, warm start i offline start są powtarzalne; kod wykonywany odpowiada commitowi.

## Etap 3 — Baseline wydajności i stabilizacja runtime

**Cel:** zebrać pomiary zanim ruszy optymalizacja.

Zadania:
- [ ] Dodać lekką telemetrię debugową frame time i długich klatek.
- [ ] Profilować main loop, enemy timeline i cooldowny.
- [ ] Zmierzyć DOM/layout/paint podczas walki.
- [ ] Zmierzyć pamięć i dekodowanie obrazów.
- [ ] Sprawdzić lifecycle event listenerów, timerów i RAF.
- [ ] Zrobić test 10-minutowej walki na słabszym Androidzie.
- [ ] Ustalić budżet startu, p95 frame time i pamięci.

**Gate:** zapisany baseline na tych samych urządzeniach i scenariuszach testowych.

## Etap 4 — Architektura bez zmiany mechanik

**Cel:** oddzielić reguły gry od UI i platformy.

Proponowane granice:
- `core/`: zegar, event bus, lifecycle, logowanie;
- `state/`: model stanu, save service, migracje;
- `combat/`: timeline, player actions, enemy intents, resolve, statusy;
- `progression/`: mastery, skills, stats;
- `items/`: generator, affixy, ekwipunek;
- `world/`: mapa, lokacje, questy, eksploracja;
- `assets/`: manifest, cache, resolver, preload;
- `ui/`: view/controller/presentation;
- `platform/`: Capacitor, browser, desktop input.

Zadania:
- [ ] Wydzielić clock service bez zmiany wyników timingowych.
- [ ] Wydzielić input actions i event contracts.
- [ ] Oddzielić aktualizację symulacji od renderowania DOM.
- [ ] Dodać jawny mount/unmount do widoków.
- [ ] Ograniczać global state przez fasady/serwisy małymi krokami.
- [ ] Utrzymać adapter kompatybilności dla istniejącego save modelu.

**Gate:** porównawcze testy gameplayu przed/po dają identyczne wyniki dla tych samych wejść.

## Etap 5 — UI arena i desktop input

**Cel:** nowa prezentacja na tym samym modelu gameplayu.

Zadania:
- [ ] Zdefiniować layout mobile portrait/landscape, tablet i desktop.
- [ ] Zaprojektować full-screen combat arena.
- [ ] Ustalić hierarchię HP, stamina, guard, enemy intent, windup i cooldown.
- [ ] Zrobić klawiaturowy input map; te same semantic actions co touch.
- [ ] Dodać focus states, dostępne etykiety i obsługę reduced motion.
- [ ] Dodać safe areas i testy browser viewport.
- [ ] Utrzymać HUD czytelny przy różnych proporcjach ekranu.

**Gate:** testy mobile + desktop przechodzą; brak zmiany logiki walki.

## Etap 6 — Grafika, animacje i dźwięk

**Cel:** spójna jakość dark fantasy bez obciążania gameplayu.

Zadania:
- [ ] Audyt sprite dimensions, alignment i asset layers.
- [ ] Odświeżyć arenę i tła.
- [ ] Ujednolicić ikonografię i status indicators.
- [ ] Dopracować animacje ataku, trafienia, bloku, perfect block i windup.
- [ ] Dodać optymalizację obrazów/formatów po testach urządzeń.
- [ ] Sprawdzić kontrast i czytelność efektów.

**Gate:** testy wydajności nie pogarszają p95 frame time ponad uzgodniony budżet.

## Etap 7 — Rozszerzenia

Nowe mechaniki, zawartość, nowe style i systemy dopiero po stabilizacji. Każda zmiana gameplayu ma osobną specyfikację, akceptację i testy balansu.

## Priorytet backlogu

| ID | Zadanie | Priorytet | Ryzyko |
|---|---|---|---|
| AUD-01 | Zewnętrzny asset source parity | P0 | Wysokie |
| BUG-01 | Clock mismatch buff expiry | P1 | Wysokie |
| BUG-02 | Atomic stamina/guard validation | P1 | Średnie |
| BUG-03 | Safe save parsing + schema migrations | P1 | Wysokie |
| BUG-04 | Restore buff/cooldown call paths | P1 | Wysokie |
| BOOT-01 | AssetManager initialization lifecycle | P1 | Wysokie |
| PERF-01 | Baseline main loop / enemy timeline | P1 | Średnie |
| BUILD-01 | Canonical Android build path | P2 | Średnie |
| CODE-01 | Duplicate declarations and dead code | P2 | Niskie |
| UI-01 | Desktop keyboard input abstraction | P2 | Średnie |
| UI-02 | Responsive arena layout | P2 | Średnie |
| ARCH-01 | View lifecycle + event cleanup | P2 | Średnie |

## Definition of Done dla każdego taska

- Zakres i niezmieniane zachowania są opisane.
- Zmiana dotyczy jednego logicznego zadania.
- Testy jednostkowe/integracyjne adekwatne do zmiany przechodzą.
- Stary save fixture nadal działa.
- Gameplay values nie zmieniły się bez akceptacji.
- Zmierzono wydajność, jeśli task dotyka hot path/UI/asset loading.
- PR zawiera listę plików, testów, ryzyk i ograniczeń.
- Brak merge/deploy bez zgody użytkownika.
