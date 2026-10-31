/*document.addEventListener("DOMContentLoaded", () => {
    
    navigate("menu"); 
});*/

window.liveRuntimeReady = false;

window.liveRuntimePromise = new Promise((resolve) => {
  window._resolveRuntime = resolve;
});

document.addEventListener("DOMContentLoaded", async () => {
  //initAssets();
  
  Analytics.gameStarted();
  
  initializeGameState();
  if(await resumeAfterReload()) return;
  
  enterMenu();
  detectLanguage();
  applyTranslations();
  renderMenuView();
  
  runtimeHanlderError();
  
  bootstrap();
  
  await window.liveRuntimePromise;

  //setAffixesForCodex();
  
  document.body.classList.remove("boot-hidden");
   
  console.log({
    width: window.innerWidth,
    height: window.innerHeight,
    dpr: window.devicePixelRatio
  });
  
});

async function preloadCssAssets() {
  await setCssAssetVar("--compare-bg", "img/backgrounds/compare-background.png");
  await setCssAssetVar("--skill-tree-bg", "img/backgrounds/tree-skills-bg.png");
}

async function loadLiveRuntime() {
  await Promise.all([
    liveCssLoadPath(),
    liveJsLoadPath(),
  ]);
}

async function bootstrap() {
  await assetManager.updateInternetStatus();
  
  window.liveRuntimePromise =
  //liveJsLoadPath()
  loadLiveRuntime()
  .then(() => {
    window.liveRuntimeReady = true;
    window._resolveRuntime(); // 🔥 TO WAŻNE
    console.log("✅ Live runtime ready");
  })
  .catch(err => {
    console.error("❌ Live runtime failed", err);
    window.liveRuntimeReady = false;
    throw err;
  });
  
}

async function resumeAfterReload() {
  const resume = sessionStorage.getItem("resumeAfterReload");
  const resumeMode = sessionStorage.getItem("resumeMode");
  sessionStorage.removeItem("resumeAfterReload");
  sessionStorage.removeItem("resumeMode");

  if (resume === "game") {
    gameState.world.mode = resumeMode;
    
    bootstrap();
    
    await window.liveRuntimePromise;
    
    document.body.classList.remove("boot-hidden");
    
    //await wait(150);
    
    //continueGame(resumeMode);
    
    
    try {
      continueGame(resumeMode);
    } catch(err) {
      console.error("CONTINUE GAME FAILED", err);
    }
    
     //console.error("after reload", resumeMode);

    //wait bootGame();
    return true;
  }

}

function runtimeHanlderError() {
  
  window.addEventListener("error", (event) => {
    showLoaderError({
      type: "RUNTIME_CRASH",
      message: event.message,
      stack: event.error?.stack,
      code: "RUNTIME_CRASH"
    });
  });
  
  window.addEventListener("unhandledrejection", (event) => {
    showLoaderError({
      type: "RUNTIME_CRASH",
      message: String(event.reason),
      stack: event.reason?.stack,
      code: "RUNTIME_CRASH"
    });
  });

}

 /*window.liveRuntimePromise =
  liveJsLoadPath()
    .then(() => {

      window.liveRuntimeReady = true;

      console.log("✅ Live runtime ready");
    })
    .catch(err => {

      console.error("❌ Live runtime failed", err);

      window.liveRuntimeReady = false;
    });*/


