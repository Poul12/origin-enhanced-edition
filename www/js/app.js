/*document.addEventListener("DOMContentLoaded", () => {
    
    navigate("menu"); 
});*/

window.liveRuntimeReady = false;

window.liveRuntimePromise = new Promise((resolve) => {
  window._resolveRuntime = resolve;
});

function appTrace(stage, details = {}) {
  window.RuntimeDiagnostics?.record("app." + stage, details);
}

document.addEventListener("DOMContentLoaded", async () => {
  const startupStartedAt = performance.now();
  appTrace("domcontentloaded.start", { readyState: document.readyState });
  //initAssets();
  
  Analytics.gameStarted();
  appTrace("analytics.initialized");
  
  initializeGameState();
  appTrace("game-state.initialized");
  if(await resumeAfterReload()) {
    appTrace("resume-after-reload.completed");
    return;
  }
  
  enterMenu();
  appTrace("menu.entered");
  detectLanguage();
  applyTranslations();
  renderMenuView();
  appTrace("menu.rendered");
  
  runtimeHanlderError();
  
  appTrace("bootstrap.start");
  bootstrap();
  
  const runtimeWaitStartedAt = performance.now();
  appTrace("live-runtime.wait.start");
  await window.liveRuntimePromise;
  appTrace("live-runtime.wait.complete", { durationMs: Math.round(performance.now() - runtimeWaitStartedAt) });

  //setAffixesForCodex();
  
  document.body.classList.remove("boot-hidden");
  appTrace("startup.visible", { durationMs: Math.round(performance.now() - startupStartedAt) });
   
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
  const startedAt = performance.now();
  appTrace("live-runtime.load.start");
  try {
    await Promise.all([liveCssLoadPath(), liveJsLoadPath()]);
    appTrace("live-runtime.load.complete", { durationMs: Math.round(performance.now() - startedAt) });
  } catch (error) {
    window.RuntimeDiagnostics?.captureError(error, "live-runtime-load");
    appTrace("live-runtime.load.fail", { durationMs: Math.round(performance.now() - startedAt), message: String(error?.message || error) });
    throw error;
  }
}

async function bootstrap() {
  const startedAt = performance.now();
  appTrace("bootstrap.update-internet.start");
  await assetManager.updateInternetStatus();
  appTrace("bootstrap.update-internet.complete", { durationMs: Math.round(performance.now() - startedAt), hasInternet: assetManager.hasInternet });
  
  window.liveRuntimePromise =
  //liveJsLoadPath()
  loadLiveRuntime()
  .then(() => {
    window.liveRuntimeReady = true;
    appTrace("bootstrap.runtime-ready");
    window._resolveRuntime(); // 🔥 TO WAŻNE
    console.log("✅ Live runtime ready");
  })
  .catch(err => {
    appTrace("bootstrap.runtime-failed", { message: String(err?.message || err) });
    window.RuntimeDiagnostics?.captureError(err, "bootstrap-live-runtime");
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


