function getMenuTemplate() {
  return `
<div class="view" id="menu-view">

    <div id="intro">

      <img src="assets/bootstrap/img/logo/background.png" id="beam">
      <img src="assets/bootstrap/img/logo/portal.png" id="portal">
      <img src="assets/bootstrap/img/logo/rigin-title.png" id="title">
     <!-- <img src="assets/bootstrap/img/logo/reflect.png" id="nigiro"> -->

      <div class="hidden" id="continueText">
        ${t("tap_continue")}
      </div>

    </div>

    <div class="hidden" id="class-select-screen"></div>

  
    <div class="menu-container hidden" id="menu">

      <button class="item-button" data-action="continue">${t("menu_continue")}</button>
      <button class="item-button" data-action="new">${t("menu_newgame")}</button>
      <button class="item-button" data-action="mode">${t("menu_gamemodes")}</button>
      <button class="item-button" data-action="options">${t("menu_options")}</button>
      <button class="item-button" data-action="about">${t("menu_about")}</button>

    
    </div>
  
   
  
  <div class="menu-footer" id="footer">

    <!-- LEWY DÓŁ -->
    <div class="menu-footer-left">
      <span class="game-version">Build v0.7.98a</span>
    </div>

    <!-- ŚRODEK -->
    <div class="menu-footer-center">
      <span class="game-author">ORIGIN Project © 2026</span>
    </div>

    <!-- PRAWY DÓŁ -->
    <div class="menu-footer-right">

      <div class="language-switcher">
  
        <div class="lang-flag ${currentLang === "en" ? "active" : ""}" data-lang="en">
          <img src="assets/bootstrap/img/icons/language_flag_en_icon.png" alt="English">
        </div>

        <div class="lang-flag ${currentLang === "pl" ? "active" : ""}" data-lang="pl">
          <img src="assets/bootstrap/img/icons/language_flag_pl_icon.png" alt="Polski">
       </div>

      </div>

    </div>

  </div>
  
  
  
    <div id="story-intro">
      <img id="story-image">
      <div id="story-overlay"></div>
      <div id="story-text"></div>
    </div>
  
<div id="confirm-menu-popup" class="popup hidden">
  <div class="confirm-content special-slot">
    <div id="confirm-menu-message"></div>
    <div class="custom-confirm-buttons">
      <button id="confirm-menu-yes">${t("confirm_yes")}</button>
      <button id="confirm-menu-no">${t("confirm_no")}</button>
    </div>
  </div>
</div>
  
  
</div>
`;
}

function getPauseMenuTemplate() {
  return `
<div class="view" id="menu-view">
  
  <div class="menu-container" id="pause-menu">

    <button class="item-button" data-action="back">${t("menu_resume")}</button>
    <button class="item-button" data-action="options">${t("menu_options")}</button>
    <button class="item-button" data-action="exit">${t("menu_exit")}</button>
  
   
  </div>


  <div class="menu-footer pause-footer">
 
    <!-- PRAWY DÓŁ -->
    <div class="menu-footer-right">

      <div class="language-switcher">
  
        <div class="lang-flag ${currentLang === "en" ? "active" : ""}" data-lang="en">
          <img src="assets/bootstrap/img/icons/language_flag_en_icon.png" alt="English">
        </div>

        <div class="lang-flag ${currentLang === "pl" ? "active" : ""}" data-lang="pl">
          <img src="assets/bootstrap/img/icons/language_flag_pl_icon.png" alt="Polski">
       </div>

      </div>

    </div>
  
  </div>

  
<div id="confirm-menu-popup" class="popup hidden">
  <div class="confirm-content special-slot">
    <div id="confirm-menu-message"></div>
    <div class="custom-confirm-buttons">
      <button id="confirm-menu-yes">${t("confirm_yes")}</button>
      <button id="confirm-menu-no">${t("confirm_no")}</button>
    </div>
  </div>
</div>

  
</div>
`;
}


async function renderMenuView() {
  document.getElementById("meta-layer").innerHTML = getMenuTemplate();
  
  //await assetManager.preloadAssets(MENU_ASSETS);
  //await assetManager.preloadAssets(HUD_ASSETS);
  
  //await assetManager.preloadAssets(INTRO_ASSETS);

  if(!appState.soundsInitialized) {
    preloadSounds();
  } 
  
  initMenuView();
}

function renderPauseMenuView() {
  document.getElementById("meta-layer").innerHTML = getPauseMenuTemplate();
  initPauseMenuView();
}

/*function renderMenuView() {
    console.log(`currentLang`, currentLang);
    document.getElementById("meta-layer").innerHTML = menuTemplate;
    initMenuView(); // tu wywołujesz logikę tej strony
}*/

/*function renderPauseMenuView() {
    document.getElementById("meta-layer").innerHTML = pauseMenuTemplate;
    initPauseMenuView(); // tu wywołujesz logikę tej strony
}*/

const DEV_SKIP_INTRO = false; // zmień na false przed publikacją
const LOGO_FULL = "assets/bootstrap/img/logo/game-logo.png";
const LOGO_MINI = "assets/bootstrap/img/logo/mini-logo.png";

function initPauseMenuView() {
    
  appState.isPaused = true;
  resetHUDLayoutVars();
  
  changeLanguage();
  
  //const menu = document.getElementById("menu-view");
  
  //menu.scrollTop = 0;
    
  //window.removeEventListener("resize", updateHUDLayoutHandler);
  //window.removeEventListener("load", updateHUDLayoutHandler);
 
  //loadImgAssets();
    
  applyMenuButtonTextures();
    
  document.querySelectorAll("#menu-view button").forEach(btn => {
    btn.addEventListener("click", () => {
      const action = btn.dataset.action;
      playSound(`menu`, 1, 1, 0.65);

      switch(action) {
        case "back":
          resumeGame();
          break;
        case "options":
          openOptions();
          setMiniLogo();
          initAudioSettings();
          break;
        case "exit":
          returnToMainMenu();
          break;
      }
    });
  });
}

function lockScroll() {
  document.body.style.touchAction = "none";
}

function unlockScroll() {
  document.body.style.touchAction = "auto";
}


function initMenuView() {
 // console.log("Menu initialized");
  
  const menu = document.getElementById("menu");
  
  
 // detectLanguage();
 // applyTranslations();
    
  //menu.scrollTop = 0;
  
  //checkIfGameWasKilled();
  
  //detectLanguage();
  //applyTranslations();
  
  changeLanguage();
  
  animateIntro();
  
  //preloadSounds();
  
  updateSaveState();

 
  //testPlugin();
  
  applyMenuButtonTextures();
    
  const continueBtn = document.querySelector('[data-action="continue"]');
  //console.error(`gameState.world.mode`, gameState.world.mode);

  if (!checkIsStorySave()) {
    continueBtn.disabled = true;
    continueBtn.classList.add("hidden");
  } else {
    continueBtn.disabled = false;
    continueBtn.classList.remove("hidden");
  }
  
 /* if (!appState.saveExists || appState.engineStarted) {
    continueBtn.disabled = true;
    continueBtn.classList.add("disabled");
  } else {
    continueBtn.disabled = false;
    continueBtn.classList.remove("disabled");
  }*/
    
  //loadImgAssets();
  
  //preloadMapAssets();
    
  const menuView = document.getElementById("menu-view");
  const gameView = document.getElementById("game-view");

  document.querySelectorAll("#menu-view button").forEach(btn => {
    btn.addEventListener("click", () => {
      const action = btn.dataset.action;
      playSound(`menu`, 1, 1, 0.65);

      switch(action) {
        case "continue":
          continueGame();
          break;
        case "new":
          //newCampaign();
          openSelectClass(`story`);
          break;
        case "mode":
          setFullLogo();
          openModeMenu();
          break;
        case "options":
          setFullLogo();
          openOptions();
          initAudioSettings();
          break;
        case "about":
          setFullLogo();
          openAbout();
          break;
        }
    });
  });
    
  //window.scrollTo(0, 0);
    
}

function testPlugin() {
  
  document.body.innerHTML += `
<div style="
position:fixed;
top:0;
left:0;
background:black;
color:lime;
z-index:999999;
font-size:12px;
padding:10px;
max-width:100%;
word-break:break-all;
">
${JSON.stringify(
  Object.keys(
    window.Capacitor?.Plugins || {}
  ),
  null,
  2
)}
</div>
`;
}

function showViewPreloader() {
  const loader = document.getElementById("view-preloader");
  
  loader.classList.remove("hidden");

  requestAnimationFrame(() => {
    loader.classList.add("visible");
  });
}

function hideViewPreloader() {
  const loader = document.getElementById("view-preloader");
  
  loader.classList.remove("visible");

  setTimeout(() => {
    loader.classList.add("hidden");
  }, 350);
}

function showViewLoader() {
  const loader = document.getElementById("view-loader");
  
  loader.classList.remove("hidden");

  requestAnimationFrame(() => {
    loader.classList.add("visible");
  });
}

function hideViewLoader() {
  const loader = document.getElementById("view-loader");
  
  loader.classList.remove("visible");

  setTimeout(() => {
    loader.classList.add("hidden");
  }, 350);
}

async function withViewLoader(task, delay = 120) {
  let loaderVisible = false;

  const timer = setTimeout(() => {
    loaderVisible = true;

    showViewLoader();
    setMenuDisabled(true); 
  }, delay);

  try {
    await task();

  } finally {
    clearTimeout(timer);

    if (loaderVisible) {
      hideViewLoader();
      setMenuDisabled(false);
    }
  }
}

async function preloadMapAssets() {

  const imgs = document.querySelectorAll("[data-src]");

  for (const img of imgs) {
    const path = img.getAttribute("data-src");
    img.dataset.resolvedSrc = await assetManager.getAssetUrl(path);
  }
}


function changeLanguage() {
  
  document.querySelectorAll(".lang-flag").forEach(btn => {

  btn.addEventListener("click", () => {

    const lang = btn.dataset.lang;

    playSound("menu", 1, 1, 0.65);
    
    setLanguage(lang);
    //console.log(`lang`, lang);
    localStorage.setItem("lang", lang);
    
    if (appState.mode === "pause") {
      //console.log(`lang in pause`, lang);
      renderPauseMenuView();
      saveGame();
      setMiniLogo();
    }

    if (appState.mode === "boot") {
      //console.log(`lang in menu`, lang);
      renderMenuView();
      saveGame();
      setFullLogo();
    }
    
  });

});

  
}

function applyMenuButtonTextures() {
  const buttons = document.querySelectorAll(".menu-container button");

  buttons.forEach(btn => {
    setGlobalButtonTexture(btn);
  });
}

function loadImgAssets() {
  document.querySelectorAll("[data-src]").forEach(img => {
    img.src = `${ASSET_BASE}${img.getAttribute("data-src")}`;
  });
}

/*let loaderDotsInterval = null;


function startLoaderDots() {
  if (loaderDotsInterval) return;

  let step = 0;

  loaderDotsInterval = setInterval(() => {
    const dots = document.querySelector(".game-loader-dots");

    if (!dots) return;

    dots.textContent = ".".repeat(step);
    step++;

    if (step > 3) {
      step = 0;
    }

  }, 360);
}


function stopLoaderDots() {
  clearInterval(loaderDotsInterval);
  loaderDotsInterval = null;

  const dots = document.querySelector(".game-loader-dots");
  if (dots) dots.textContent = "";
}*/

function enterMenu() {
  document.getElementById("global-logo").classList.remove("hidden");
  document.getElementById("game-layer").style.display = "none";
  //document.getElementById("meta-layer").style.display = "block";
  //document.getElementById("meta-layer").classList.remove("fade-out");
  document.getElementById("meta-scene").style.display = "block";
  document.getElementById("meta-scene").classList.remove("fade-out");

  lockScroll();
}

function showGameLoader(){
  const loader = document.getElementById("game-loader");
  const loaderTitle = document.getElementById("loader-title");
  
  loaderTitle.textContent = t("launcher_entering_world");

  //startLoaderDots();
  
  loader.classList.remove("hide");
  loader.classList.add("show");
}

function hideGameLoader(){
  const loader = document.getElementById("game-loader");

  loader.classList.add("hide");

  //stopLoaderDots();
    
  setTimeout(() => {
    loader.classList.remove("show");
  }, 1700);
}


async function retryGameBoot() {
  try {
    //const errorBox = document.getElementById("loader-error");
    const errorMsg = document.getElementById("loader-error-message");
    const popup = document.getElementById("error-popup");

    // 1. reset UI errora
    if (popup) popup.style.display = "none";

    //if (errorBox) errorBox.classList.add("hidden");
    if (errorMsg) errorMsg.textContent = "";
    
    // 2. reset loader UI
    resetGameLoaderUI();

    // 3. mały UX feedback
    showGameLoader();
    
    // 4. restart pełnego flow (NIE bootGame)
    await enterGame();

  } catch (err) {
    console.error("❌ Retry failed:", err);

    showLoaderError(err);
  }
}

function resetGameLoaderUI() {
  const percent = document.getElementById("loader-percent");
  const file = document.getElementById("loader-file");
  const fill = document.getElementById("loader-progress-fill");

  if (percent) percent.textContent = "0%";

  if (file) file.innerHTML = `${t("launcher_check_updates")}<span class="game-loader-dots"></span>`;

  if (fill) fill.style.width = "0%";

  //stopLoaderDots();
}


function showLoaderError(error) {
  window.RuntimeDiagnostics?.record("launcher.error", {
    type: error?.type || error?.code || "UNKNOWN",
    message: String(error?.message || "Unknown error").slice(0, 1200)
  });
//  console.error("🚨 Loader error:", error);
  //const box = document.getElementById("loader-error");
  const msg = document.getElementById("loader-error-message");
  const title = document.getElementById("error-title");
  const popup = document.getElementById("error-popup");
  const retryBtn = document.getElementById("retry-btn");
  
  if (!popup || !msg) {
    return;
  }
  
  let text = "Unknown error";
  title.textContent = "CONNECTION ERROR";
  
  switch(error.type || error.code) {
    case "OFFLINE_NO_CACHE":
      text = "Internet connection required for first launch.";
      break;

    case "NETWORK":
      text = "Cannot connect to game servers.";
      break;
    
    case "MANIFEST_HTTP":
      text = `Server error (${error.status})`;
      break;

    case "NO_INTERNET":
      text = "No internet connection.";
      break;
    
    case "INVALID_MANIFEST":
      text = "Manifest format invalid.";
      title.textContent = "DATA ERROR";
      break;

    case "DOWNLOAD_FAILED":
      text = "Failed downloading assets.";
      break;
    
    case "SAVE_FAILED":
      title.textContent = "DATA ERROR";
      text = "Problem with data files save.";
      break;
    
    case "RUNTIME_CRASH":
      title.textContent = "CRITICAL ERROR";
      text = "Game has encountered a runtime error. Please restart.";
      appState.recoveryNeeded = true;
      showGameLoader();
      break;
    
    /*case "CONNECTION_LOST":
      text = "Connection interrupted during synchronization.";
      break;*/
    
    default:
      text = error.message || "Unexpected launcher error";
  }

  msg.textContent = text;
  
  popup.classList.remove("hidden"); // pokaż popup
  popup.style.display = "flex";
  
  setGlobalButtonTexture(retryBtn);
  
  //box.classList.remove("hidden");
  
  if (error.stack) {
    console.group("Crash stack");
    console.error(error.stack);
    console.groupEnd();
  }
  
}


function updateLoaderProgress(data) {
  const percentEl = document.getElementById("loader-percent");
  const fileEl = document.getElementById("loader-file");
  const fill = document.getElementById("loader-progress-fill");

  if (data.phase === "finalizing") {
    fileEl.innerHTML = `${data.currentName}<br><span class="game-loader-dots"></span>`;
    
    //startLoaderDots();
    return;
  }
  
  if (percentEl) {
    percentEl.textContent = `${data.percent}%`;
    //console.warn(`loader progress percent`, data.percent);
  }

  if (fileEl) {
    fileEl.innerHTML = `${t("launcher_download")} ${formatBytes(data.downloadedBytes) || 0}/${formatBytes(data.totalBytes) || 0} <br> ${data.currentName}<span class="game-loader-dots"></span>`;
    //fileEl.textContent = `Downloading ${data.currentFile}/${data.totalFiles}: ${data.currentName}`;
  }

  if (fill) {
    fill.style.width = `${data.percent}%`;
  }
  
  //startLoaderDots();
}

function setLoaderFinalizing() {
  const fileEl = document.getElementById("loader-file");
  const percentEl = document.getElementById("loader-percent");

  if (percentEl) {
    percentEl.textContent = "100%";
  }

  if (fileEl) {
    fileEl.innerHTML = `${t("launcher_data_synchro")}<span class="game-loader-dots"></span>`;
  }

  //startLoaderDots();
}


async function enterGame() {
  appState.mode = "game";
  //console.error("enter enterGame");

  if(appState.recoveryNeeded) {
    sessionStorage.setItem("resumeAfterReload", "game");
    sessionStorage.setItem("resumeMode",gameState.world.mode);
    //console.error("appState.recoveryNeeded");
    
    appState.recoveryNeeded = false;
    window.location.reload();
    //bootstrap();
    
  }
  
  //const meta = document.getElementById("meta-layer");
  const meta = document.getElementById("meta-scene");
  const game = document.getElementById("game-layer");

  //console.error(`window.liveRuntimeReady0`, window.liveRuntimeReady);
  
  const firstEnter = !appState.hasEnteredGameBefore;

  document.getElementById("global-logo").classList.add("hidden");

  appState.isPaused = false;

  unlockScroll();

  // =========================
  // QUICK RETURN
  // =========================

  if (!firstEnter) {
    //console.error("firstEnter");

    meta.style.display = "none";
    game.style.display = "block";
    game.classList.remove("ready");
    //document.body.classList.remove(`body-bg`);
    document.body.classList.add(`default-body-bg`);

    navigate("map");

    requestAnimationFrame(() => {
      game.classList.add("ready");
    });

    return;
  }

  // =========================
  // FIRST ENTER
  // =========================
   
  try {

    meta.classList.add("fade-out");

    resetGameLoaderUI();
    
    //await wait(1500);

    meta.style.display = "none";

    //console.error(`window.liveRuntimeReady1`, window.liveRuntimeReady);
    
    if (!window.liveRuntimeReady) {
      showGameLoader();

      //console.error(`window.liveRuntimeReady2`, window.liveRuntimeReady);
      updateLoaderProgress({
        percent: 100,
        currentName: `${t("launcher_preparing")}`,
        phase: "finalizing"
      });

      // 🔥 pozwól DOM się wyrenderować
      await nextFrame();

      // opcjonalnie drugi frame dla mobile/webview
      await nextFrame();
      
      await window.liveRuntimePromise;
    }
    
    showGameLoader();
    
    // pozwól UI się wyrenderować
    await nextFrame();

    await wait(500);

    // =========================
    // ASSET SYNC
    // =========================

    /*await assetManager.init({
      onProgress: updateLoaderProgress
    });*/

    const syncStart = performance.now();
    
    const result = await assetManager.init({
      onProgress: updateLoaderProgress
    });

    if (result?.mode === "error") {
      showLoaderError(result.error);
      return;
    }
    
    await assetManager.preloadAssets(HUD_ASSETS);
    await assetManager.preloadAssets(MAP_ASSETS);
    await assetManager.preloadAssets(ITEMS_ASSETS);
    //await assetManager.preloadAssets(LEGENDARY_SPRITES);
    await assetManager.preloadAssets(INVENTORY_ASSETS);
    await assetManager.preloadAssets(SKILLS_ASSETS);

    //await liveJsLoadPath();
    
    const elapsed = performance.now() - syncStart;

    const minimumLoaderTime = 3000;

    if (elapsed < minimumLoaderTime) {
      await wait(minimumLoaderTime - elapsed);
    }
    
    
    if (assetManager.requiresReload()) {

      updateLoaderProgress({
        downloadedBytes: 0,
        totalBytes: 0,
        percent: 100,
        currentName: `${t("launcher_applying_patch")}`,
        phase: "finalizing"
      });

      sessionStorage.setItem("resumeAfterReload", "game");
      sessionStorage.setItem("resumeMode",gameState.world.mode);
      
      await wait(3000);

      window.location.reload();

      return;
    }
    
    // =========================
    // FINALIZING
    // =========================

    setLoaderFinalizing();

    await wait(1600);

    // =========================
    // START GAME
    // =========================

    game.style.display = "block";

    game.classList.remove("ready");
    
    //document.body.classList.remove(`body-bg`);
    document.body.classList.add(`default-body-bg`);
    //console.error("before navigate map enterGame");
    
    navigate("map");

    hideGameLoader();

    await wait(1000);

    game.classList.add("ready");

    appState.hasEnteredGameBefore = true;

  } catch (err) {

    console.error("❌ GAME BOOT FAILED", err);

    showLoaderError(err);
  } 
  
}



function wait(ms) {
  return new Promise(resolve =>
    setTimeout(resolve, ms)
  );
}

function nextFrame(timeoutMs = 500) {
  return new Promise(resolve => {
    let settled = false;
    let rafId = null;
    let timeoutId = null;

    const cleanup = () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (timeoutId !== null) clearTimeout(timeoutId);
    };

    const finish = () => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve();
    };

    const scheduleFrames = () => {
      if (settled) return;

      if (document.visibilityState === "hidden") {
        timeoutId = window.setTimeout(finish, timeoutMs);
        return;
      }

      let framesRemaining = 2;
      const tick = () => {
        if (settled) return;

        if (document.visibilityState === "hidden") {
          timeoutId = window.setTimeout(finish, timeoutMs);
          return;
        }

        framesRemaining -= 1;
        if (framesRemaining <= 0) {
          finish();
          return;
        }

        rafId = requestAnimationFrame(tick);
      };

      rafId = requestAnimationFrame(tick);
      timeoutId = window.setTimeout(finish, timeoutMs);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
        if (timeoutId !== null) clearTimeout(timeoutId);
        timeoutId = window.setTimeout(finish, timeoutMs);
        return;
      }

      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      scheduleFrames();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    scheduleFrames();
  });
}

function showCriticalRuntimeError(message) {
  showLoaderError({
    type: "RUNTIME_CRASH",
    message
  });
}

function openPauseMenu() {
  window.scrollTo(0, 0);
    
  playSound(`menu-tab`, 1, 1, 0.65);
  appState.mode = "pause";
  if(gameState.world.mode === `expedition`) stopTimeExpedition();
  stopGameEngine();
  enterMenu();
  setMiniLogo();
  renderPauseMenuView();
}

function resumeGame() {
  appState.mode = "game";
  if(gameState.world.mode === `expedition`) {
     const run = gameState.expedition.modes[gameState.world.expeditionMode]?.run;
     run.startTime = Date.now();
  } 

  //window.addEventListener("resize", updateHUDLayoutHandler);
  //window.addEventListener("load", updateHUDLayoutHandler);

  appState.isPaused = false;
  updateHUDLayout();
    
  //initializeGameState();
  //stopGameEngine();
  startGameEngine();
  enterGame(); 
}

function returnToMainMenu() {
  stopGameEngine();

  appState.mode = "boot";
  appState.hasEnteredGameBefore = false;
  
  enterMenu();
  renderMenuView();
}

function hideFooter() {
  const footer = document.getElementById("footer");
  
  footer.classList.add("hidden");
}

function showFooter() {
  const footer = document.getElementById("footer");
  
  footer.classList.remove("hidden");
}

function hideFullLogo() {
  const logo = document.getElementById("mainLogo");
  const global = document.getElementById("global-logo");
  
  global.classList.remove("fade-out");

  //logo.style.opacity = "0";
    
  logo.src = LOGO_FULL;
  logo.style.opacity = "0";
}


function setFullLogo() {
  const logo = document.getElementById("mainLogo");
  const global = document.getElementById("global-logo");
  
  global.classList.remove("fade-out");

  //logo.style.opacity = "0";
    
  logo.src = LOGO_FULL;
  logo.style.opacity = "1";
}

function setMiniLogo() {
  const logo = document.getElementById("mainLogo");
  const global = document.getElementById("global-logo");
  
  global.classList.remove("fade-out");

  //logo.style.opacity = "0";
    
  logo.src = LOGO_MINI;
  logo.style.opacity = "1";
}

function animateIntro() {
  const beam = document.getElementById("beam");
  //const origin = document.getElementById("origin");
  const portal = document.getElementById("portal");
  const title = document.getElementById("title");
  //const nigiro = document.getElementById("nigiro");
  const continueText = document.getElementById("continueText");
  const intro = document.getElementById("intro");
  const menu = document.getElementById("menu");
  //const logo = document.getElementById("logo");
  const logo = document.getElementById("global-logo");
  const footer = document.getElementById("footer");

  footer.classList.add("hidden");

  //🔥 TRYB DEWELOPERSKI
  if (DEV_SKIP_INTRO || window.liveRuntimeReady) {

    intro.style.display = "none";
    menu.classList.remove("hidden");
    menu.classList.add("visible");
    logo.classList.remove("hidden");
    footer.classList.remove("hidden");

    /*beam.style.opacity = "1";
    origin.style.opacity = "1";
    nigiro.style.opacity = "0.3";*/
      
    setFullLogo();
    return;
  }
    
  beam.style.opacity = "0";

  setTimeout(() => {
    beam.style.opacity = "1";
  }, 500); // 0.5s ciemności

  // ORIGIN
  setTimeout(() => {
    portal.style.opacity = "1";
    portal.style.transform = "translate(17%, 0)";
  }, 3000);

  setTimeout(() => {
    portal.style.transform = "translate(-50%, 0)";
  }, 6000);
  
  setTimeout(() => {
    title.style.opacity = "1";
    title.style.transform = "translate(-50%, 0)";
    waitForRuntimeReady();
  }, 6500);

  
  // 🔥 NIGIRO dużo później
 /* setTimeout(() => {
    nigiro.style.opacity = "0.3";
    nigiro.classList.add("glitch-once");
    waitForRuntimeReady();
  }, 6500);*/
    
 // waitForRuntimeReady();
  
    
 /* setTimeout(() => {
    
    //onIntroContinue();

  }, 7500);*/
  
}


async function waitForRuntimeReady() {
  const continueText = document.getElementById("continueText");

  // 🔥 loader text
  //continueText.textContent = "LOADING SYSTEMS...";
  
  //console.log("WAITING FOR RUNTIME...");

  await window.liveRuntimePromise;

 // console.log("RUNTIME REALLY READY");
  
  // runtime ready
  continueText.classList.remove("hidden");

  //continueText.textContent = "TAP TO CONTINUE";

  continueText.classList.add("show-continue");

  enableIntroContinue();
}

function enableIntroContinue() {
  const intro = document.getElementById("intro");
  const menu = document.getElementById("menu");
  const continueText = document.getElementById("continueText");

  intro.addEventListener("click", () => {

    continueText.classList.remove("show-continue");

    continueText.style.opacity = "0";

    menu.classList.remove("hidden");
    footer.classList.remove("hidden");

    requestAnimationFrame(() => {
      menu.classList.add("visible");
    });

  }, { once: true });
}

function initAudioSettings() {

  const musicSlider = document.getElementById("music-volume");
  const sfxSlider = document.getElementById("sfx-volume");
  const muteBtn = document.getElementById("mute-toggle");

  const musicPercent = document.getElementById("music-percent");
  const sfxPercent = document.getElementById("sfx-percent");

  musicSlider.value = gameState.world.musicVolume * 100;
  sfxSlider.value = gameState.world.sfxVolume * 100;
    
  musicPercent.textContent = musicSlider.value + "%";
  sfxPercent.textContent = sfxSlider.value + "%";

  //console.error(`musicVolume`, gameState.world.musicVolume);
  //console.error(`sfxVolume`, gameState.world.sfxVolume);
    
  updateMuteUI();
    
  // Reakcja na zmianę
  musicSlider.addEventListener("input", (e) => {
   gameState.world.musicVolume = e.target.value / 100;
   musicGainNode.gain.value = gameState.world.musicVolume;
   musicPercent.textContent = e.target.value + "%";
  // console.error(`musicGainNode.gain.value`, musicGainNode.gain.value);
  });

  sfxSlider.addEventListener("input", (e) => {
    gameState.world.sfxVolume = e.target.value / 100;
    sfxPercent.textContent = e.target.value + "%";
  });
    
  muteBtn.addEventListener("click", toggleMute);

}

function toggleMute() {
  let isMuted = gameState.world.isMuted;
    
  //console.error(`musicGainNode.gain.value`, musicGainNode.gain.value);
  
  gameState.world.isMuted = !gameState.world.isMuted;
  masterGainNode.gain.value = gameState.world.isMuted ? 0 : 1;
    
  //console.error(`isMuted2`, isMuted);
    
  updateMuteUI();
}

function updateMuteUI() {
  const muteToggle = document.getElementById("mute-toggle");
  const muteIcon = document.getElementById("mute-icon");

  if (gameState.world.isMuted) {
      muteIcon.src = "assets/bootstrap/img/icons/volume-mute-icon.png";
  } else {
      muteIcon.src = "assets/bootstrap/img/icons/volume-on-icon.png";
  }
}



function destroyMenuView() {
    
}

