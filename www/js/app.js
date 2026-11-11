/*document.addEventListener("DOMContentLoaded", () => {
    
    navigate("menu"); 
});*/

window.liveRuntimeReady = false;
window.liveRuntimePromise = null;

function appTrace(stage, details = {}) {
  window.__originStartupStage = stage;
  window.RuntimeDiagnostics?.record("app." + stage, details);
}

function startStartupWatchdog() {
  let overlay = null;
  const timer = window.setTimeout(() => {
    if (!document.body.classList.contains("boot-hidden")) return;

    overlay = document.createElement("div");
    overlay.id = "startup-diagnostic-overlay";
    overlay.style.cssText = [
      "position:fixed", "inset:0", "z-index:2147483000",
      "display:flex", "align-items:center", "justify-content:center",
      "padding:24px", "box-sizing:border-box", "background:rgba(0,0,0,.94)",
      "color:#f2eadc", "visibility:visible", "font:14px/1.5 sans-serif",
      "text-align:center"
    ].join(";");

    const panel = document.createElement("div");
    panel.style.cssText = "max-width:340px;border:1px solid #75634b;padding:20px;background:#17131d";
    const heading = document.createElement("div");
    heading.textContent = "Uruchamianie trwa dłużej niż zwykle";
    heading.style.cssText = "font-weight:700;font-size:17px;margin-bottom:10px";
    const message = document.createElement("div");
    message.textContent = "Gra nadal czeka na zakończenie ładowania. Nie zamykaj jej — możesz wyeksportować diagnostykę.";
    const stage = document.createElement("div");
    stage.id = "startup-diagnostic-stage";
    stage.style.cssText = "margin:12px 0;color:#d7b982;overflow-wrap:anywhere";
    stage.textContent = "Etap: " + (window.__originStartupStage || "nieustalony");
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "EKSPORTUJ DIAGNOSTYKĘ";
    button.style.cssText = "margin-top:12px;padding:10px 14px;background:#403044;color:#fff;border:1px solid #a78b68";
    button.addEventListener("click", () => window.RuntimeDiagnostics?.downloadReport());
    panel.append(heading, message, stage, button);
    overlay.appendChild(panel);
    document.body.appendChild(overlay);
    window.RuntimeDiagnostics?.record("app.startup.watchdog-shown", {
      stage: window.__originStartupStage || "unknown"
    });
  }, 12000);

  return function stopStartupWatchdog() {
    window.clearTimeout(timer);
    overlay?.remove();
  };
}

document.addEventListener("DOMContentLoaded", async () => {
  const stopStartupWatchdog = startStartupWatchdog();
  const startupStartedAt = performance.now();
  appTrace("domcontentloaded.start", { readyState: document.readyState });
  runtimeHanlderError();
  //initAssets();
  
  Analytics.gameStarted();
  appTrace("analytics.initialized");
  
  initializeGameState();
  appTrace("game-state.initialized");

  // Language must be ready before resumeAfterReload can display recovery UI.
  detectLanguage();

  if(await resumeAfterReload()) {
    stopStartupWatchdog();
    appTrace("resume-after-reload.completed");
    return;
  }
  
  enterMenu();
  appTrace("menu.entered");
  detectLanguage();
  applyTranslations();
  renderMenuView();
  appTrace("menu.rendered");
  
  appTrace("bootstrap.start");
  
  const runtimeWaitStartedAt = performance.now();
  appTrace("live-runtime.wait.start");
  await bootstrap();
  appTrace("live-runtime.wait.complete", { durationMs: Math.round(performance.now() - runtimeWaitStartedAt) });

  setAffixesForCodex();
  
  document.body.classList.remove("boot-hidden");
  stopStartupWatchdog();
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

function bootstrap() {
  // Both the normal startup and reload recovery share one runtime task.
  if (window.liveRuntimePromise) {
    return window.liveRuntimePromise;
  }

  const startedAt = performance.now();
  window.liveRuntimePromise = (async () => {
    try {
      appTrace("bootstrap.update-internet.start");
      await assetManager.updateInternetStatus();
      appTrace("bootstrap.update-internet.complete", {
        durationMs: Math.round(performance.now() - startedAt),
        hasInternet: assetManager.hasInternet
      });

      await loadLiveRuntime();
      window.liveRuntimeReady = true;
      appTrace("bootstrap.runtime-ready");
      console.log("✅ Live runtime ready");
    } catch (err) {
      appTrace("bootstrap.runtime-failed", { message: String(err?.message || err) });
      window.RuntimeDiagnostics?.captureError(err, "bootstrap-live-runtime");
      console.error("❌ Live runtime failed", err);
      window.liveRuntimeReady = false;
      throw err;
    }
  })();

  return window.liveRuntimePromise;
}

async function resumeAfterReload() {
  const resume = sessionStorage.getItem("resumeAfterReload");
  const resumeMode = sessionStorage.getItem("resumeMode");
  sessionStorage.removeItem("resumeAfterReload");
  sessionStorage.removeItem("resumeMode");

  if (resume === "game") {
    gameState.world.mode = resumeMode;
    
    await bootstrap();
    setAffixesForCodex();
    
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


