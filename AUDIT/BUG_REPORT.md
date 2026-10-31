# Rejestr problemów i ryzyk

**Status:** wyniki statyczne; wymagają reprodukcji przed naprawą.

| ID | Priorytet | Obszar | Obserwacja | Status |
|---|---|---|---|---|
| BUG-01 | Wysoki | Save/load | `JSON.parse()` zapisów w `gameState.js` i `menu.js` nie jest zabezpieczony przed błędnym JSON. | Potwierdzona słabość obsługi błędów; wpływ zależy od danych |
| BUG-02 | Wysoki | Buff timers | `addTemporaryBuff()` zapisuje `expiresAt` na bazie `getGameTime()`, a `restoreBuffsAfterReload()` porównuje go z `Date.now()`. | Niespójność zegarów potwierdzona statycznie |
| BUG-03 | Średni | Buff timers | Wygaśnięcie buffa jest realizowane przez `setTimeout()`, niezależnie od pauzy i skali czasu gry. | Do reprodukcji; możliwa rozbieżność z logiką game-time |
| BUG-04 | Średni | Bootstrap | Wywołanie `assetManager.init()` w `bootGame()` jest zakomentowane. Inny bootstrap ładuje runtime i aktualizuje status internetu. | Wymaga sprawdzenia pełnej inicjalizacji manifestu/cache |
| BUG-05 | Średni | Asset manager | Ścieżki lokalnego repozytorium i cache są zakodowane na sztywno jako ścieżki Android/MGit. | Potwierdzone; ogranicza przenośność konfiguracji |
| BUG-06 | Średni | Event lifecycle | Współdzielony kod rejestruje listenery globalne; trzeba sprawdzić, czy bootstrap/widoki mogą inicjalizować je wielokrotnie bez sprzątania. | Hipoteza do weryfikacji |
| BUG-07 | Średni | Build | Dwa różne pipeline’y Android: Cordova w GitHub Actions i Capacitor w Codemagic. | Potwierdzona rozbieżność konfiguracji |
| BUG-08 | Niski | Testy | `www/package.json` ma test script, który tylko wypisuje „No test” i kończy się sukcesem. | Potwierdzone |

## Szczegóły BUG-02 / BUG-03

Kod `skills-combat.js` używa zegara gry przy tworzeniu czasu końca buffa, a przy odtwarzaniu po reloadzie odczytuje bieżący czas systemowy. To różne domeny czasu. Potencjalny skutek: buff może wygasnąć natychmiast lub utrzymywać się nieprawidłowo po ponownym uruchomieniu. Dodatkowo timer systemowy może wygasić buff w trakcie pauzy, jeżeli pauza nie jest uwzględniana przez tę ścieżkę.

**Nie zmieniać tego w ciemno.** Najpierw należy ustalić semantykę: czy buff ma działać według czasu świata, czasu rzeczywistego, czy czasu aktywnej rozgrywki.

## Kolejność weryfikacji

1. Dodać testy odtwarzania uszkodzonego i starego zapisu.
2. Zreprodukować buff przed pauzą, w trakcie pauzy, po reloadzie i po zmianie timeScale.
3. Prześledzić pełny lifecycle asset managera od DOMContentLoaded do wejścia do gry.
4. Sprawdzić, czy listenery są rejestrowane wielokrotnie przy nawigacji/reloadzie.
5. Ustalić jeden docelowy pipeline Android i dopiero potem usunąć drugi.