# Roadmap — Origin: Enhanced Edition

## Zasady

- Pracujemy wyłącznie w `Poul12/origin-enhanced-edition`.
- Oryginalne `Poul12/RpgLooter` pozostaje źródłem prawdy i nie jest modyfikowane.
- Każdy etap na osobnej gałęzi; PR jako bramka przeglądu.
- Bez merge i deploy bez wyraźnej zgody.
- Nie zmieniać mechanik ani balansu bez akceptacji.

## Etap 0 — audyt i kontrola źródła (bieżący)

- [x] Potwierdzić commit źródłowy.
- [x] Utworzyć świeżą gałąź audytową.
- [x] Przeanalizować strukturę i bootstrap.
- [x] Sporządzić raporty statyczne.
- [ ] Zatwierdzić zakres i ograniczenia audytu.
- [ ] Dopiero potem wykonać snapshot źródła.

## Etap 1 — snapshot i integralność

- Importować kod z dokładnego SHA.
- Pominąć `node_modules`; zachować package manifests/lockfiles.
- Zachować osobny wykaz pominiętych plików i przyczyn.
- Ująć cztery duże loading PNG oraz zewnętrzne repo assetów w planie importu.
- Weryfikować blob SHA wszystkich skopiowanych plików.
- Nie nadpisywać zasad projektu ani dokumentacji bez przeglądu.

## Etap 2 — uruchamialność i test baseline

- Odtworzyć zależności na czystym środowisku.
- Zidentyfikować jedną wspieraną ścieżkę builda Android.
- Ustawić testy smoke i walidację statyczną.
- Zapisać baseline błędów konsoli i zachowania save/load.
- Zweryfikować start z siecią, bez sieci i z cache.

## Etap 3 — naprawy stabilności

Kolejność proponowana:
1. bezpieczne odczyty i migracje zapisów,
2. spójność zegarów buffów/cooldownów/pauzy,
3. lifecycle listenerów i timerów,
4. deterministyczny bootstrap i obsługa błędów asset managera,
5. testy regresji walki i progresji.

Każda naprawa ma mieć reprodukcję, test i osobny PR.

## Etap 4 — wydajność

- Profilowanie Android low-end i desktop.
- Pomiar czasu klatki i pamięci.
- Redukcja zbędnych aktualizacji DOM.
- Optymalizacja preloadingu i cache na podstawie metryk.
- Testy długich sesji.

## Etap 5 — architektura i UI

- Wyznaczyć stabilne interfejsy między stanem, gameplayem i widokami.
- Ujednolicić design tokens i responsywność.
- Przebudować arenę walki na full-screen.
- Zachować mechaniki i kontrakty danych.
- Dodać sterowanie klawiaturą desktop z zachowaniem dotyku.

## Etap 6 — grafika i polish

- Wymienić/udoskonalić assety etapami.
- Zachować czytelność i wydajność.
- Testować na docelowych urządzeniach.
- Nie dodawać nowych mechanik w ramach czysto wizualnych zmian.

## Kryterium ukończenia

Każdy etap kończy się raportem: zmienione pliki, uzasadnienie, testy, wyniki, ryzyka i następny krok. Snapshot nie jest merge’em ani zgodą na wdrożenie.