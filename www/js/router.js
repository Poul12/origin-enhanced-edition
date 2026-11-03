let currentViewDestroy = null;

async function navigate(viewName) {
  const navigationStartedAt = performance.now();
  window.RuntimeDiagnostics?.record("navigation.start", { viewName });
  playSound(`menu-tab`, 1, 1, 0.45);
  //clearAllDiffs();
  
  
  
  // 1️⃣ Czyścimy poprzedni widok
  if (currentViewDestroy) {
    currentViewDestroy();
    currentViewDestroy = null;
  }

  // 2️⃣ Renderujemy nowy
  switch(viewName) {

    /*case "menu":
      enterMenu();
      currentViewDestroy = destroyMenuView;
      break;*/
    
    case "map":
      //renderMapView();
    
      if (!appState.mapInitialized) {
        showViewPreloader();
        
        await renderMapView({
          firstLoad: true
        });

        hideViewPreloader();

        appState.mapInitialized = true;
      } else {
        await renderMapView();
      }
    
      currentViewDestroy = destroyMapView;
      break;

    case "inventory":
      await renderInventoryView();
      currentViewDestroy = destroyInventoryView;
      break;

    case "battle":
      await renderBattleView();
      currentViewDestroy = destroyBattleView;
      break;

    case "store":
      await renderStoreView();
      currentViewDestroy = destroyStoreView;
      break;

    case "character":
      await renderCharacterView();
      currentViewDestroy = destroyCharacterView;
      break;

    case "skills":
      await renderSkillsView();
      currentViewDestroy = destroySkillsView;
      break;

    default:
      await renderMapView();
      currentViewDestroy = destroyMapView;
  }

  window.RuntimeDiagnostics?.record("navigation.complete", {
    viewName,
    durationMs: Math.round(performance.now() - navigationStartedAt)
  });
}


