# Audyt UI/UX

## Obecny układ

`index.html` zawiera stały szkielet gry: pasek statystyk, orb HP/stamina, pasek EXP/mastery, dolne menu, warstwę widoków, loader i elementy feedbacku walki. Widoki są tworzone dynamicznie w `www/live/js/views/`, a style ładowane z `www/live/css/`.

## Mocne strony

- Istnieją osobne widoki mapy, walki, ekwipunku, postaci, umiejętności i sklepu.
- HUD ma już elementy dedykowane walce, w tym HP/stamina, feedback, timing i mastery.
- Wiele elementów interfejsu wykorzystuje ikony i grafiki zamiast długich opisów.
- Aplikacja jest projektowana z myślą o ekranach mobilnych.

## Problemy i ograniczenia

1. **Desktop nie jest jeszcze równorzędnym targetem.** W statycznie sprawdzonym głównym markupie nie znaleziono pełnego systemu sterowania klawiaturą dla walki. To wymaga osobnego audytu wszystkich handlerów, ale obecny zakres nie potwierdza gotowości desktop.
2. **Brak widocznego systematycznego zestawu breakpointów.** Arkusze wymagają przeglądu pod kątem szerokich ekranów i responsywnego skalowania.
3. **Duże arkusze stylów per widok.** Wymagają tokenów, standaryzacji i kontroli zależności, ale nie należy robić globalnego redesignu w jednym kroku.
4. **Markup i logika są mocno powiązane przez ID i klasy DOM.** Zmiana struktury HTML może łatwo zerwać selektory runtime.
5. **Czytelność HUD ma pierwszeństwo przed dekoracją.** Wskaźniki timing, windup, stamina i cooldown muszą być czytelne na małych ekranach.

## Kierunek Enhanced Edition

- Full-screen arena 2D, dark fantasy.
- Jasna hierarchia: przeciwnik i jego telegraph, gracz, timing, zasoby, akcje.
- Ikony i paski tam, gdzie przekaz jest jednoznaczny; tekst tylko tam, gdzie jest potrzebny.
- Zachować odrębność wizualną stylów walki.
- Desktop: dodać sterowanie klawiaturą bez usuwania dotykowego sterowania Android.
- Najpierw poprawić responsywność i stabilność obecnego UI, potem przebudować kompozycję.

Każdy redesign musi zachować kontrakt DOM lub być wdrażany razem z aktualizacją selektorów i testami widoku.