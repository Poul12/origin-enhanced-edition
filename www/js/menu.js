function openModeMenu() {
  const container = document.querySelector(".menu-container");
    
  const adventureUnlocked =  localStorage.getItem("adventure_unlocked");
  //gameState.world.isStoryEnded
  container.innerHTML = `
  
     <button class="item-button ${adventureUnlocked ? "" : "disabled" }" id="adventure-mode-btn" data-mode="adventure">${t("menu_adventure")}</button>
     <button class="item-button disabled" data-mode="sandbox">${t("menu_sandbox")}</button>
     <button class="item-button disabled" data-mode="expedition">${t("menu_expedition")}</button>
  
     <button class="item-button" data-action="back">${t("menu_back")}</button>
  `;

  container.querySelectorAll("button").forEach(btn => {
    setGlobalButtonTexture(btn);
    
    btn.addEventListener("click", () => {
      if (btn.dataset.action === "back") {
        playSound(`menu`, 1, 1, 0.65);
        renderMenuView();
        setFullLogo();
        return;
      }

      const mode = btn.dataset.mode;
      startNewGame(mode);
    });
  });
  
  
}

function openSelectClass(mode = `story`) {
  const container = document.querySelector(".menu-container");
  container.innerHTML = ``;

  const selectScreen = document.getElementById("class-select-screen");

  // Wyczyść poprzedni wybór przy każdym otwarciu ekranu
  selectedClass = null;

  selectScreen.classList.remove("hidden");

  selectScreen.innerHTML = `
    <div class="class-select-overlay"></div>

    <div class="class-select-ui">

      <div id="class-title-wrapper">

        <div class="class-select-title">
          ${t("char_selection_title")}
        </div>

        <div class="class-select-subtitle">
          ${t("char_selection_subtitle")}
        </div>

      </div>

      <div class="class-content">

        <div class="class-grid">

          <!-- WARRIOR -->
          <div
            class="class-card active"
            data-class="warrior"
            onclick="selectClass('warrior', this)"
          >

            <div class="class-image-wrap">
              <img id="warriorImg" class="class-image">
            </div>

            <div class="class-name" id="warrior-name">
              ${t("char_class_title")}
            </div>

          </div>

          <!-- FUTURE -->
          <div class="class-card locked">

            <div class="class-image-wrap">
              <img
                id="rogueImg"
                class="class-image placeholder"
              >
            </div>

            <div class="class-name placeholder">
              ${t("coming_soon")}
            </div>

          </div>

          <!-- FUTURE -->
          <div class="class-card locked">

            <div class="class-image-wrap">
              <img
                id="mageImg"
                class="class-image placeholder"
              >
            </div>

            <div class="class-name placeholder">
              ${t("coming_soon")}
            </div>

          </div>

        </div>

     
        <!-- INFO PANEL -->
        <div id="class-details" class="details-container hidden">

          <div id="class-details-inner"></div>
  
        </div>

      </div>

  
        <!-- NAME INPUT -->
        <div class="character-name-panel hidden">

          <label
            class="character-name-label"
            for="character-name-input"
          >
            ${t("character_name_label")}
          </label>

          <input
            id="character-name-input"
            class="character-name-input"
            type="text"
            maxlength="14"
            autocomplete="off"
            spellcheck="false"
            placeholder="${t("character_name_placeholder")}"
          >

          <div class="character-name-hint">
            ${t("character_name_hint")}
          </div>

        </div>

  
      <div class="class-btn-wrapper">

        <button
          id="class-start-btn"
          class="item-button disabled"
          disabled
          onclick='confirmClassSelection(${JSON.stringify(mode)})'
         >
          ${t("start_journey_btn")}
        </button>
  
        <button
          class="item-button"
          id="class-back-btn"
          data-action="back"
        >
          ${t("menu_back")}
        </button>

      </div>

    </div>
  `;

  const warriorAvatar = document.getElementById("warriorImg");
  warriorAvatar.src =
    "assets/bootstrap/img/classes/warrior-avatar.png";

  const rogueAvatar = document.getElementById("rogueImg");
  rogueAvatar.src =
    "assets/bootstrap/img/classes/rogue-avatar-placeholder.png";

  const mageAvatar = document.getElementById("mageImg");
  mageAvatar.src =
    "assets/bootstrap/img/classes/rogue-avatar-placeholder.png";

  selectScreen.querySelectorAll("button").forEach(btn => {
    setGlobalButtonTexture(btn);

    btn.addEventListener("click", () => {
      if (btn.dataset.action === "back") {
        playSound("menu", 1, 1, 0.65);
        renderMenuView();
        setFullLogo();
      }
    });
  });

  document.getElementById("class-details-inner").innerHTML =
    getWarriorDesc();

  document
    .querySelector(".details-container")
    .addEventListener("click", resetClassSelection);

  // Aktualizuj stan przy wpisywaniu imienia
  const nameInput = document.getElementById("character-name-input");

  nameInput.addEventListener("input", () => {
    updateClassStartButton();
  });

  // Enter w polu imienia może zatwierdzić wybór
  nameInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      event.preventDefault();
      confirmClassSelection(mode);
    }
  });
}

/*function openSelectClass() {
  const container = document.querySelector(".menu-container");
  container.innerHTML = ``;
  
  const selectScreen = document.getElementById("class-select-screen");
  selectScreen.classList.remove(`hidden`);
  
  selectScreen.innerHTML = `
  <div class="class-select-overlay"></div>

    <div class="class-select-ui">

    <div id="class-title-wrapper">
  
      <div class="class-select-title">
        ${t("char_selection_title")}
      </div>

      <div class="class-select-subtitle">
        ${t("char_selection_subtitle")}
      </div>

    </div>
  
     <div class="class-content">
  
      <div class="class-grid">

        <!-- WARRIOR -->
        <div class="class-card active" data-class="warrior" onclick="selectClass('warrior', this)">

          <div class="class-image-wrap">
            <img id="warriorImg" class="class-image">
          </div>

          <div class="class-name" id="warrior-name">${t("char_class_title")}</div>
  
        </div>

        <!-- FUTURE -->
        <div class="class-card locked">

          <div class="class-image-wrap">
            <img id="rogueImg" class="class-image placeholder">
          </div>
  
          <div class="class-name placeholder">${t("coming_soon")}</div>

        </div>

        <!-- FUTURE -->
        <div class="class-card locked">

          <div class="class-image-wrap">
           <img id="mageImg" class="class-image placeholder">
          </div>
  
          <div class="class-name placeholder">${t("coming_soon")}</div>

        </div>

      </div>

      <!-- 🔥 INFO PANEL -->
      <div id="class-details" class="details-container hidden">

        <div id="class-details-inner">
  
        </div>

      </div>
  
     </div>
  
      <div class="class-btn-wrapper">
  
        <button id="class-start-btn" class="item-button disabled" disabled onclick="confirmClassSelection()">
          ${t("start_journey_btn")}
        </button>

        <button class="item-button" id="class-back-btn" data-action="back">${t("menu_back")}</button>
     
      </div>
  
    </div>
  `;
  
  const warriorAvatar = document.getElementById(`warriorImg`);
  warriorAvatar.src = `assets/bootstrap/img/classes/warrior-avatar.png`;
  const rogueAvatar = document.getElementById(`rogueImg`);
  rogueAvatar.src = `assets/bootstrap/img/classes/rogue-avatar-placeholder.png`;
  const mageAvatar = document.getElementById(`mageImg`);
  mageAvatar.src = `assets/bootstrap/img/classes/rogue-avatar-placeholder.png`;

  
  selectScreen.querySelectorAll("button").forEach(btn => {
    setGlobalButtonTexture(btn);
    btn.addEventListener("click", () => {
      if (btn.dataset.action === "back") {
        playSound(`menu`, 1, 1, 0.65);
        renderMenuView();
        setFullLogo();
        return;
      }

    });
  });
  
  
  document.getElementById("class-details-inner").innerHTML = getWarriorDesc();
  
  document.querySelector(".details-container")
    .addEventListener("click", resetClassSelection);  
  
}*/

function getWarriorDesc() {
  return `

    <div class="class-details-section">

      <div class="class-section-title">
        ${t("warrior_class_description_title")}
      </div>

      <div class="class-description-text">
        ${t("warrior_class_description")}
      </div>

    </div>

    <div class="class-details-section">

      <div class="class-section-title">
        ${t("warrior_class_specialization_title")}
      </div>

      <div class="class-description-text">
        ${t("warrior_class_specialization_description")}
      </div>

    </div>

  `;
}

/*function getWarriorDesc() {
  return `
  
    <div class="class-details-section">

      <div class="class-section-title">
        ${t("combat_disciplines")}
      </div>

      <div class="style-entry">
        <div class="style-title class-style-turtle">${t("resilience_style")}</div>
        <div class="style-text">
          ${t("resilience_desc_warrior")}
        </div>
      </div>
  
      <div class="style-entry">
        <div class="style-title class-style-timed">${t("precision_style")}</div>
        <div class="style-text">
           ${t("precision_desc_warrior")}
        </div>
      </div>
  
      <div class="style-entry">
        <div class="style-title class-style-poise">${t("brutality_style")}</div>
        <div class="style-text">
           ${t("brutality_desc_warrior")}   
        </div>
    </div>

   <!-- <div class="class-details-section">

      <div class="class-section-title">
        WEAPONS
      </div>

      <div class="class-weapons">
        Greatswords • Axes • Shields • Heavy Armor
      </div>

    </div> -->

  `;
}*/

//turtle
//Defensive combat focused on resilience, control
  //  and surviving overwhelming encounters.

//timed
//Rewards perfect timing, disciplined execution
//    and calculated counterattacks.

//poise
//Unrelenting offensive pressure built around
//    raw force, stagger and aggressive strikes

function updateClassStartButton() {
  const startBtn = document.getElementById("class-start-btn");
  const nameInput = document.getElementById("character-name-input");

  if (!startBtn || !nameInput) {
    return;
  }

  const characterName = nameInput.value.trim();

  const isValid =
    selectedClass !== null &&
    characterName.length >= 2;

  startBtn.disabled = !isValid;
  startBtn.classList.toggle("disabled", !isValid);
}

let selectedClass = null;

function selectClass(classId, selectedCard) {

  selectedClass = classId;

  const cards = document.querySelectorAll(".class-card");

  cards.forEach(card => {

    card.classList.remove("selected");
    card.classList.remove("fade-out");

    if (card !== selectedCard) {
      card.classList.add("fade-out");
    }
  });

  selectedCard.classList.add("selected");

  // PANEL
  const details = document.getElementById("class-details");
  const charName = document.querySelector(".character-name-panel");

  const titleWrapper = document.getElementById("class-title-wrapper");
  const warriorName = document.getElementById("warrior-name");
  /*const classNames = document.querySelectorAll(".class-name");
  
  classNames.forEach(name => {
    name.classList.add("hidden");
  });*/
  
  details.classList.add("visible");
  details.classList.remove("hidden");
  charName.classList.add("visible");
  charName.classList.remove("hidden");
  titleWrapper.classList.add("fade-out");
  
  hideFullLogo();
  hideFooter();
  
  /*charName.onclick = (e) => {
              e.stopPropagation();
              hideFullLogo();
          };*/
     
  
  // BUTTON
 // const startBtn = document.getElementById("class-start-btn");

  playSound(`menu`, 1, 1, 0.65);
  
  updateClassStartButton();
  
 // startBtn.disabled = false;
 // startBtn.classList.remove("disabled");
}

function confirmClassSelection(mode) {
  const nameInput = document.getElementById("character-name-input");
  //console.log("Selected mode:", mode);

  if (!nameInput) {
    return;
  }

  const characterName = nameInput.value.trim();

  if (!selectedClass) {
    return;
  }

  if (characterName.length < 2) {
    nameInput.focus();
    return;
  }

  //console.log("Selected class:", selectedClass);
  //console.log("Character name:", characterName);

  setFullLogo();
  showFooter();
  
  switch(mode) {
  
    case `story`:
      newCampaign(selectedClass, characterName);
      break;
    
    case `adventure`:
      newAdventure(selectedClass, characterName);
      break;

  }
}

function resetClassSelection() {
  const cards = document.querySelectorAll(".class-card");

  cards.forEach(card => {
    card.classList.remove("selected");
    card.classList.remove("fade-out");
  });

  const details = document.getElementById("class-details");
  const charName = document.querySelector(".character-name-panel");

  const titleWrapper = document.getElementById("class-title-wrapper");

  details.classList.remove("visible");
  
  charName.classList.remove("visible");
  charName.classList.add("hidden");

  titleWrapper.classList.remove("fade-out");

  const nameInput = document.getElementById("character-name-input");

  if (nameInput) {
    nameInput.value = "";
  }

  setFullLogo();
  showFooter();
  
  playSound("menu", 1, 1, 0.65);

  selectedClass = null;

  updateClassStartButton();
}

/*function resetClassSelection() {
    
  const cards = document.querySelectorAll(".class-card");

  cards.forEach(card => {
    card.classList.remove("selected");
    card.classList.remove("fade-out");
  });
  
  const details = document.getElementById("class-details");
  const titleWrapper = document.getElementById("class-title-wrapper");

  details.classList.remove("visible");
  titleWrapper.classList.remove("fade-out");

  const startBtn = document.getElementById("class-start-btn");
  
  playSound(`menu`, 1, 1, 0.65);

  startBtn.disabled = true;
  startBtn.classList.add("disabled");

  selectedClass = null;
  
}*/


function startNewGame(mode) {
  switch(mode) {
    case "expedition":
      startExpeditionMode();
      break;
    case "adventure":
      if(checkIsSave("adventure")) newAdventure();
      else openSelectClass(mode);
      break;
    case "sandbox":
      startFreeMode();
      break;

  }
  if (!appState.recoveryNeeded) saveGame();
}

function newCampaign(selectedClass, characterName) {
  localStorage.removeItem("save_story");

  gameState = createNewGameState();
  
  setAffixesForCodex();
  
  setStoryUI();
  
  gameState.world.mode = "story";
  gameState.world.startNewCampaign = true;
  
  gameState.char.playerClass = selectedClass;
  gameState.char.playerName = characterName;
  
  Analytics.newGameCreated();
  
  playStoryIntro();
  
  //startGame();
}

function checkIsStorySave() {
  const saveStory = localStorage.getItem("save_story");

  if (!saveStory) return false;

  const parsed = parseSavePayload(saveStory);
  if (!parsed) {
    appState.recoveryNeeded = true;
    console.warn("Invalid story save found; keeping the original data for recovery");
    return false;
  }

  // The save slot is the primary mode discriminator: saveGame() writes
  // Story to save_story, while Adventure and Expedition use their own keys.
  // Older/imported Story saves may not contain startNewCampaign at all.
  // Still reject an explicitly conflicting mode if a payload was misplaced.
  const savedMode = parsed.gameState.world.mode;
  if (savedMode && savedMode !== "story") {
    console.warn("The save_story slot contains a save for a different mode");
    return false;
  }

  return true;
}

function checkIsSave(mode) {
  if (mode === "expedition" && !localStorage.getItem("save_expedition")) mode = null;
  if (mode === "adventure" && !localStorage.getItem("save_adventure")) mode = null;

  if (!mode) {
    console.warn("No save found");
    //setAffixesForCodex();
    return false;
  }

  initializeGameState(mode);

  if (appState.recoveryNeeded) {
    console.warn("Cannot load game: save recovery is required");
    return true;
  }
  
  if(gameState.world.isStartNewWorld) document.getElementById(`fight-menu-btn`).classList.remove('disabled');
  
  if(gameState.world.mode === "adventure") setStoryUI();
  else setExpeditionUI();
  
  bootGame();
  
  return true;
}

function startExpeditionMode() {
  //console.log(`start expedition mode`);
  
  if(checkIsSave("expedition")) return;
  
  localStorage.removeItem("save_expedition");
  
  gameState = createNewGameState();
  
  setAffixesForCodex();
  
  setExpeditionUI();
  
  gameState.world.mode = "expedition";
  
  bootGame();
}

function newAdventure(selectedClass = `warrior`, characterName = `noname`) {
  //console.log(`start adventure mode`);
  
  document.getElementById(`fight-menu-btn`).classList.add('disabled');
  
  if(checkIsSave("adventure")) return;
  
  localStorage.removeItem("save_adventure");

  gameState = createNewGameState();
  
  setStoryUI();
  
  gameState.world.mode = "adventure";
  
  gameState.char.playerClass = selectedClass;
  gameState.char.playerName = characterName;
  
  setAffixesForCodex();
  
  bootGame();
}


function startFreeMode() {
  //console.log(`start free mode`);
  
  //localStorage.removeItem("save_sandbox");
  
  gameState = createNewGameState();
  
  setAffixesForCodex();
  
  setStoryUI();
  
  gameState.world.mode = "sandbox";
  
  bootGame();
}

function setExpeditionUI(){
  const icon = document.getElementById("stat-icon-main");
  const value = document.getElementById("energy");
  const block = document.querySelector('[data-stat="energystat"]');
  
  icon.src = "assets/bootstrap/img/icons/expedition-impulse-icon.png";
  //setImageSrc(icon, "img/icons/expedition-impulse-icon.png");
  //const impulseUrl = assetManager.getResolvedAsset("img/icons/expedition-impulse-icon.png");
  //icon.src = impulseUrl;
  //block.dataset.stat = "shards";
  if(value) {
    value.id = "shards";
    value.innerText = "0";
  }
}

function setStoryUI(){
  const icon = document.getElementById("stat-icon-main")
  const value = document.getElementById("shards")
  //const block = document.querySelector('[data-stat="shards"]')

  if(value) {
    value.id = "energy";
    //value.innerText = "0";
  }

  icon.src = "assets/bootstrap/img/icons/menu-energy-icon.png"
  //setImageSrc(icon, "img/icons/menu-energy-icon.png");
  //const energyUrl = assetManager.getResolvedAsset("img/icons/menu-energy-icon.png");
  //icon.src = energyUrl;
  
  //block.dataset.stat = "energystat"
  //value.id = "energy"
  updateEnergyUI();
}


/*function continueGame() {
  let mode = localStorage.getItem("last_mode") || "story";

  if(gameState.world.mode === "sandbox") {
    startFreeMode();   
    return;
  }
  
  if (mode === "story" && !localStorage.getItem("save_story")) mode = null;
  if (mode === "expedition" && !localStorage.getItem("save_expedition")) mode = null;
  if (mode === "adventure" && !localStorage.getItem("save_adventure")) mode = null;

  if (!mode) {
    console.warn("No save found");
    return;
  }

  initializeGameState(mode);
  
  document.getElementById(`fight-menu-btn`).classList.add('disabled');
  
  if(gameState.world.mode === "story") setStoryUI();
  else setExpeditionUI();
  
  startGame();
}*/

function continueGame(mode = `story`) {
  
  initializeGameState(mode);

  if (appState.recoveryNeeded) {
    console.warn("Cannot continue game: save recovery is required");
    return false;
  }

  //document.getElementById(`fight-menu-btn`).classList.add('disabled');
  
  setStoryUI();
  saveGame();
  
  bootGame();
}

/*function continueGame() {
  //loadGame();
  initializeGameState(gameState.world.mode);
  document.getElementById(`fight-menu-btn`).classList.add('disabled');
  
  if(gameState.world.mode === "story") setStoryUI();
  else setExpeditionUI();
  
  startGame();
}*/

async function startGame() {
  // Never initialize gameplay systems until every live script and stylesheet
  // has finished loading. This also protects taps made immediately after boot.
  await window.liveRuntimePromise;

  stopGameEngine();
  startGameEngine();
  //console.error(`startGame`);
  //stopTimeExpedition();
  // przy starcie gry / load save
  
  setStartTime();
  
  await enterGame();
}


async function bootGame() {
  //await window.assetManager.init();
  
  //const meta = document.getElementById("meta-layer");
  const meta = document.getElementById("meta-scene");
  const logo = document.getElementById("global-logo");
  
  //logo.style.opacity = "0";
  document.body.classList.add(`body-bg`);

  meta.classList.add("fade-out");
  logo.classList.add("fade-out");
  
  //await assetManager.updateInternetStatus();

  //setAffixesForCodex();
  
  await Promise.all([
    wait(100),
    //liveJsLoadPath(),
  ]);
  
  meta.style.display = "none";
  
  //await assetManager.updateInternetStatus();
  
  //await assetManager.preloadAssets(HUD_ASSETS);
  //await preloadCssAssets();
  
  startGame();
}


function confirmReset() {
/*  if (confirm("Na pewno zresetować grę?")) {
    //localStorage.clear();
    let mode = localStorage.getItem("last_mode") || null;
    
    if (mode === "story") {
      localStorage.removeItem("save_story");
      gameState.world.startNewCampaign = false;
    }
    if (mode === "expedition") localStorage.removeItem("save_expedition");
    if (mode === "adventure") localStorage.removeItem("save_adventure");
    
    //localStorage.removeItem("save");
    updateSaveState();
    location.reload();
  }*/
  
  let mode = localStorage.getItem("last_mode") || null;

  showMenuCustomConfirm(
    `${t("reset_save")} ${t(mode)}?`, 
    () => {
      if (mode === "story") {
        localStorage.removeItem("save_story");
        gameState.world.startNewCampaign = false;
      }
      
      if (mode === "expedition") localStorage.removeItem("save_expedition");
      if (mode === "adventure") localStorage.removeItem("save_adventure");

      updateSaveState();
      location.reload();
    },
    () => {}
  );
  
}

function setStarterSet() {
  const char = gameState.char;
  const starterSword = makeShortSwordCommon();
  const starterShield = makeBucklerCommon();
  
    char.level = 1;
    char.experience = 0;
    char.expToNextLevel = 125;
    char.skillPoints = 0;
    char.availableAttributePoints = 0;
    char.blockMode = `timed`;
    char.equipment = {
        "weapon": starterSword, 
        "shield": starterShield
    };
    char.staminaRegen = 12;
   
    gameState.resources.staminaState.current = 100;
  
    const potion = makeSmallHealPotion();
    
    gameState.resources.potions = Array(POTION_SLOTS).fill(null);
    
    //world.isFightMenuBlocked = true;
    document.getElementById(`fight-menu-btn`).classList.add('disabled');
  
    addPotionToBar(potion);
    
    if(gameState.world.mode === "story") gameState.resources.gold = `100`;
  
    //gameState.resources.staminaState.regenPerSecond = 12;
  
    gameState.world.isStartNewGame = false;
    document.getElementById(`map-menu-btn`).classList.remove('disabled');
    //document.getElementById(`shop-menu-btn`).classList.add('disabled');
      
    //renderStats();
    //applyCharacterStats();
    saveGame();
}

function openOptions() {
  const container = document.querySelector(".menu-container");

  container.innerHTML = `
    <div class="option-container">

      <!-- MUZYKA -->
      <div class="option-row">
        <span>${t("option_music")}</span>
        <input type="range" min="0" max="100" id="music-volume">
        <span class="percent" id="music-percent"></span>
      </div>

      <!-- EFEKTY -->
      <div class="option-row">
        <span>${t("option_sfx")}</span>
        <input type="range" min="0" max="100" id="sfx-volume">
        <span class="percent" id="sfx-percent"></span>
      </div>

      <!-- WYCISZENIE -->
      <div class="option-row">
        <span>${t("option_mute")}</span>
        <div class="mute-toggle" id="mute-toggle">
          <img id="mute-icon" alt="Mute toggle">
        </div>
      </div>

      <!-- JĘZYK -->
    <!--  <div class="option-row">
        <span>${t("option_language")}</span>

        <select id="language-select" class="lang-select">
          <option value="en">English</option>
          <option value="pl">Polski</option>
        </select>
      </div> -->

    </div>

    <button class="item-button ${appState.saveExists ? "" : "disabled"}" id="reset-save">
      ${t("menu_resetgame")}
    </button>

    <button class="item-button" id="export-save-backup">
      EXPORT SAVE BACKUP
    </button>

    <button class="item-button" id="import-save-backup" ${appState.mode === "boot" ? "" : "disabled"}>
      IMPORT SAVE BACKUP
    </button>
    <input id="import-save-backup-file" type="file" accept="application/json,.json" style="display:none">

    <button class="item-button" data-action="back">
      ${t("menu_back")}
    </button>
  `;

  applyMenuButtonTextures();

  // ========================
  // USTAW AKTUALNY JĘZYK
  // ========================
  /*const langSelect = document.getElementById("language-select");
  langSelect.value = localStorage.getItem("lang") || "en";

  
  langSelect.addEventListener("change", (e) => {
    const newLang = e.target.value;

    setLanguage(newLang);     // twoja funkcja localization.js
    saveGame();                // zapis ustawień
    openOptions();             // rerender opcji
    updateMuteUI();
    //location.reload();
    playSound("menu", 1, 1, 0.65);
  });*/

  // ========================
  // RESET SAVE
  // ========================
  document.getElementById("reset-save").addEventListener("click", () => {
    playSound("menu", 1, 1, 0.65);
    confirmReset();
  });

  document.getElementById("export-save-backup").addEventListener("click", async () => {
    playSound("menu", 1, 1, 0.65);
    try {
      await downloadSaveBackup();
    } catch (error) {
      console.error("Save backup export failed", error);
      window.RuntimeDiagnostics?.captureError(error, "save-backup-export");
      const errorDetails = error?.message || String(error || "Unknown error");
      alert("Could not export the save backup.\n\nDiagnostic details:\n" + errorDetails);
    }
  });

  const importButton = document.getElementById("import-save-backup");
  const importFileInput = document.getElementById("import-save-backup-file");

  importButton.addEventListener("click", () => {
    if (appState.mode !== "boot") return;
    importFileInput.value = "";
    importFileInput.click();
  });

  importFileInput.addEventListener("change", async event => {
    if (appState.mode !== "boot") return;

    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const serialized = await file.text();
      const backup = parseSaveBackup(serialized);

      if (!backup) {
        alert("Invalid save backup. No game data was changed.");
        return;
      }

      const saveKeys = ["save_story", "save_expedition", "save_adventure"];
      const importKeys = saveKeys.filter(key => backup.saves[key] !== null);

      if (importKeys.length === 0) {
        alert("This backup does not contain any saves to import.");
        return;
      }

      const overwriteKeys = importKeys.filter(key => localStorage.getItem(key) !== null);
      const labels = {
        save_story: "Story",
        save_expedition: "Expedition",
        save_adventure: "Adventure"
      };
      const importList = importKeys.map(key => labels[key]).join(", ");
      const overwriteList = overwriteKeys.length
        ? "\nExisting saves to be replaced: " + overwriteKeys.map(key => labels[key]).join(", ")
        : "\nNo existing saves will be replaced.";
      const message =
        "Import save backup?\nSaves to import: " + importList +
        overwriteList +
        "\nEmpty slots in the backup will be left unchanged.\nContinue?";

      showMenuCustomConfirm(message, () => {
        const result = restoreSaveBackup(backup);

        if (!result.success) {
          console.error("Save backup import failed", result.error);
          alert("Import failed. Existing saves were restored where possible. No game was started.");
          return;
        }

        alert("Save backup imported successfully. The game will now reload.");
        location.reload();
      });
    } catch (error) {
      console.error("Save backup import failed", error);
      window.RuntimeDiagnostics?.captureError(error, "save-backup-import");
      alert("Could not read the backup file. No game data was changed.");
    }
  });

  // ========================
  // BACK
  // ========================
  document.querySelector('[data-action="back"]').addEventListener("click", () => {
    playSound("menu", 1, 1, 0.65);

    if (appState.mode === "pause") {
      renderPauseMenuView();
      saveGame();
      setMiniLogo();
    }

    if (appState.mode === "boot") {
      renderMenuView();
      saveGame();
      setFullLogo();
    }
  });
}



// Exports raw save strings without parsing, changing, or deleting them.
function buildSaveBackup() {
  const keys = ["save_story", "save_expedition", "save_adventure"];
  const saves = {};

  keys.forEach(key => {
    saves[key] = localStorage.getItem(key);
  });

  return {
    format: "origin-save-backup",
    version: 1,
    exportedAt: new Date().toISOString(),
    saves
  };
}

function downloadSaveBackup() {
  const backup = buildSaveBackup();
  const serialized = JSON.stringify(backup, null, 2);
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = "origin-save-backup-" + stamp + ".json";
  const capacitor = window.Capacitor;

  // Android WebView does not reliably handle browser-generated anchor downloads.
  // Load the Capacitor plugin bridges on demand so the browser build stays unchanged.
  if (
    capacitor?.isNativePlatform?.() &&
    capacitor.getPlatform?.() === "android"
  ) {
    const plugins = capacitor.Plugins || {};
    const filesystem = plugins.Filesystem;
    const share = plugins.Share;

    if (!filesystem || !share) {
      throw new Error(
        "Required native plugin is unavailable. Filesystem: " +
        Boolean(filesystem) + ", Share: " + Boolean(share)
      );
    }

    return (async () => {
      let fileUri;

      try {
        const result = await filesystem.writeFile({
          path: filename,
          data: serialized,
          directory: "CACHE",
          encoding: "utf8",
          recursive: true
        });
        fileUri = result?.uri;

        if (!fileUri) {
          throw new Error("Filesystem.writeFile did not return a file URI.");
        }
      } catch (error) {
        error.message = "Save backup file creation failed: " + (error.message || error);
        throw error;
      }

      try {
        await share.share({
          title: filename,
          text: "Origin save backup",
          files: [fileUri],
          dialogTitle: "Export save backup"
        });
      } catch (error) {
        // Closing the Android share sheet is not an export failure.
        if (String(error?.message || "").toLowerCase().includes("cancel")) return;
        error.message = "Android share sheet failed: " + (error.message || error);
        throw error;
      }
    })();
  }

  // Keep the existing browser download behavior unchanged.
  const blob = new Blob([serialized], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}


// Validates the exported backup envelope and every non-empty raw save slot.
function parseSaveBackup(serialized) {
  if (typeof serialized !== "string" || !serialized) return null;

  let backup;
  try {
    backup = JSON.parse(serialized);
  } catch (error) {
    return null;
  }

  if (
    !backup ||
    typeof backup !== "object" ||
    Array.isArray(backup) ||
    backup.format !== "origin-save-backup" ||
    backup.version !== 1 ||
    !backup.saves ||
    typeof backup.saves !== "object" ||
    Array.isArray(backup.saves)
  ) {
    return null;
  }

  const keys = ["save_story", "save_expedition", "save_adventure"];

  for (const key of keys) {
    if (!Object.prototype.hasOwnProperty.call(backup.saves, key)) return null;

    const rawSave = backup.saves[key];
    if (rawSave === null) continue;
    if (typeof rawSave !== "string" || !parseSavePayload(rawSave)) return null;
  }

  return backup;
}


// Restores only populated slots. Null slots are deliberately never written or cleared.
function restoreSaveBackup(backup) {
  const keys = ["save_story", "save_expedition", "save_adventure"];
  const importKeys = keys.filter(key => backup?.saves?.[key] !== null);
  const previousValues = new Map();

  if (!backup || !backup.saves || importKeys.length === 0) {
    return { success: false, error: new Error("No valid save slots to import") };
  }

  keys.forEach(key => {
    previousValues.set(key, localStorage.getItem(key));
  });

  try {
    importKeys.forEach(key => {
      localStorage.setItem(key, backup.saves[key]);
    });
    updateSaveState();
    return { success: true, importedKeys: importKeys };
  } catch (error) {
    for (const key of importKeys) {
      try {
        const previousValue = previousValues.get(key);
        if (previousValue === null) localStorage.removeItem(key);
        else localStorage.setItem(key, previousValue);
      } catch (rollbackError) {
        console.error("Save backup rollback failed for " + key, rollbackError);
      }
    }

    updateSaveState();
    return { success: false, error };
  }
}


function openAbout() {
  const container = document.querySelector(".menu-container");

  container.innerHTML = `
    <h2>${t("about_game")}</h2>

    <div class="about-section">
      <h3>${t("about_game_title")}</h3>

      <p>${t("about_game_description")}</p>

      <p class="about-tagline">
        ${t("about_tagline")}
      </p>
    </div>

    <div class="about-section">
      <h3>${t("about_game_info")}</h3>

      <div class="about-info-row">
        <span>${t("about_genre")}</span>
        <strong>${t("about_action_rpg")}</strong>
      </div>

      <div class="about-info-row">
        <span>${t("about_mode")}</span>
        <strong>${t("about_single_player")}</strong>
      </div>

      <div class="about-info-row">
        <span>${t("about_platform")}</span>
        <strong>${t("about_android")}</strong>
      </div>

      <div class="about-info-row">
        <span>${t("about_version")}</span>
        <strong>0.7.98a</strong>
      </div>

      <div class="about-info-row">
        <span>${t("about_status")}</span>
        <strong>${t("about_early_build")}</strong>
      </div>
    </div>

    <div class="about-section">
      <h3>${t("about_creator")}</h3>

      <p>${t("about_creator_description")}</p>

      <p class="about-creator-name">
        ${t("about_created_by")}
      </p>
    </div>

    <div class="about-section">
      <h3>${t("about_ai")}</h3>

      <p>
        ${t("about_ai_description")}
      </p>
    </div>
  
    <div class="about-section">
      <h3>${t("about_community")}</h3>

      <p>${t("about_community_description")}</p>

      <div class="about-links">
        <button class="item-button" data-action="discord">
          ${t("about_discord")}
        </button>

        <button class="item-button" data-action="youtube">
          ${t("about_youtube")}
        </button>
      </div>

      <p class="about-bug-report">
        ${t("about_bug_report")}
      </p>
    </div>

    <div class="about-section">
      <h3>${t("about_rights")}</h3>

      <p>
        ${t("about_rights_description")}
      </p>
    </div>
  
    <div class="about-footer">
      ${t("about_copyright")}
    </div>
  
    <button
      class="item-button"
      data-action="back"
    >
      ${t("menu_back")}
    </button>
  `;

  applyMenuButtonTextures();

  hideFooter();
  hideFullLogo();
  
  document
    .querySelector('[data-action="discord"]')
    ?.addEventListener("click", () => {
      playSound("menu", 1, 1, 0.65);

      // Podmień na prawdziwy adres Discorda
      window.open("https://discord.gg/ck2RWUBrU", "_blank");
    });

  document
    .querySelector('[data-action="youtube"]')
    ?.addEventListener("click", () => {
      playSound("menu", 1, 1, 0.65);

      // Podmień na prawdziwy adres kanału
      window.open("https://youtube.com/@originproject-k5p?si=k0LwcYIJODiFnAug", "_blank");
    });

  document
    .querySelector('[data-action="back"]')
    ?.addEventListener("click", () => {
      playSound("menu", 1, 1, 0.65);
      renderMenuView();
      setFullLogo();
    });
}

function playStoryIntro() {

  const scenes = [
    {
      img: "assets/bootstrap/img/loadings/storm-story-loading.png",
      text: "intro_text_scene1"
    },
    {
      img: "assets/bootstrap/img/loadings/port-story-loading.png",
      text: "intro_text_scene2"
    },
    {
      img: "assets/bootstrap/img/loadings/land-story-loading.png",
      text: "intro_text_scene3"
     },
    {
      img: "assets/bootstrap/img/loadings/hero-story-loading.png",
      text: "intro_text_scene4"
     }
  ];

  const root = document.getElementById("story-intro");
  const img = document.getElementById("story-image");
  const text = document.getElementById("story-text");
  const menu = document.getElementById("menu");
  const logo = document.getElementById("global-logo");
  const footer = document.getElementById("footer");

  let i = 0;
  let ended = false;

  let fadeTimer = null;
  let nextSceneTimer = null;

  root.style.display = "block";
  root.classList.remove("fade-out");

  menu.classList.add("hidden");
  logo.classList.add("hidden");
  footer.classList.add("hidden");

  function finishIntro(){

    if(ended) return;
    ended = true;

    clearTimeout(fadeTimer);
    clearTimeout(nextSceneTimer);

    root.onclick = null;
    root.style.pointerEvents = "none";

    bootGame();

    requestAnimationFrame(() => {
      root.classList.add("fade-out");

      setTimeout(() => {
        root.style.display = "none";
      }, 2400);
    });
  }

  root.onclick = finishIntro;

  function showScene(){

    if(ended) return;

    if(i >= scenes.length){
      finishIntro();
      return;
    }

    const scene = scenes[i];

    img.classList.remove("visible");
    text.classList.remove("visible");

    fadeTimer = setTimeout(() => {

      if(ended) return;

      img.src = scene.img;
      //setImageSrc(img, scene.img);
      //const sceneUrl = assetManager.getResolvedAsset(scene.img);
      //img.src = sceneUrl;
      
      text.textContent = t(scene.text);

      requestAnimationFrame(() => {
        img.classList.add("visible");
        text.classList.add("visible");
      });

      i++;

      nextSceneTimer = setTimeout(showScene, 8000);

    }, 1500);
  }

  showScene();
}

async function liveJsLoadPath() {

  const files = [
   // "live/js/item-utility.js",
   // "live/js/store-items.js",
   // "live/js/item.js",
    //"live/js/combat.js",
    "live/js/skills.js",
    "live/js/combat-animations.js",
    "live/js/combat-utility.js",
    "live/js/combat-style.js",
    "live/js/skills-combat.js",
    "live/js/skills-database.js",
    "live/js/enemy-skills.js",
    "live/js/battle.js",
    "live/js/map.js",
    "live/js/exploring-utility.js",
    "live/js/inventory.js",
    "live/js/store.js",
    "live/js/character.js",
    "live/js/game-guide.js",
    "live/js/location.js",
    "live/js/expedition-config.js",
   // "live/js/quests-assets.js",
   // "live/js/quests-database.js",
    "live/js/quests.js",
    "live/js/shrine-chest.js",
    "live/js/shrine-chest-database.js",
  //  "live/js/enemy.js",
    "live/js/enemy-database.js",
    "live/js/localization-guide.js",
    "live/js/localization-tooltips.js",
    "live/js/localization-skills.js",
    "live/js/localization-quests.js",
    "live/js/localization-dialogues.js",
    "live/js/localization-items.js",
    "live/js/localization-locations.js",
    //"live/js/views/menuView.js", 
    "live/js/views/mapView.js", 
    "live/js/views/battleView.js", 
    "live/js/views/inventoryView.js", 
    "live/js/views/storeView.js", 
    "live/js/views/characterView.js", 
    "live/js/views/skillsView.js", 

  
  ];
  
  await assetManager.loadPatchedScript(
    "live/js/item.js"
  );
  
  await assetManager.loadPatchedScript(
     "live/js/item-utility.js"
  );

  await assetManager.loadPatchedScript(
    "live/js/store-items.js"
  );
  
  await assetManager.loadPatchedScript(
    "live/js/quests-assets.js"
  );

  await assetManager.loadPatchedScript(
     "live/js/quests-database.js"
  );
  
  await assetManager.loadPatchedScript(
     "live/js/enemy.js"
  );
  
  await assetManager.loadPatchedScript(
     "live/js/combat.js"
  );

  await assetManager.loadPatchedScript(
     "live/js/combat-resolve.js"
  );

  
  await Promise.all(
    files.map(file =>
      assetManager.loadPatchedScript(file)
    )
  );
}

async function liveCssLoadPath() {
  
  const files = [
    //"live/css/main.css",
    //"live/css/menu.css",
    "live/css/map.css",
    "live/css/battle.css",
    "live/css/explore.css",
    "live/css/skills.css",
    "live/css/inventory.css",
    "live/css/store.css",
    "live/css/character.css",
  
  ];

  await Promise.all(
    files.map(file =>
      assetManager.loadPatchedCss(file)
    )
  );
}

async function liveJsLoadPath2() {
  
  await assetManager.loadPatchedScript(
    "live/js/item-utility.js"
  );

  await assetManager.loadPatchedScript(
    "live/js/store-items.js"
  );

  await assetManager.loadPatchedScript(
    "live/js/item.js"
  );
  
  await assetManager.loadPatchedScript(
    "live/js/combat.js"
  );

  await assetManager.loadPatchedScript(
    "live/js/skills.js"
  );

  await assetManager.loadPatchedScript(
    "live/js/combat-animations.js"
  );

  await assetManager.loadPatchedScript(
    "live/js/combat-utility.js"
  );

  await assetManager.loadPatchedScript(
    "live/js/skills-combat.js"
  );
  
  await assetManager.loadPatchedScript(
    "live/js/skills-database.js"
  );
  
  await assetManager.loadPatchedScript(
    "live/js/battle.js"
  );

  await assetManager.loadPatchedScript(
    "live/js/map.js"
  );

  await assetManager.loadPatchedScript(
    "live/js/exploring-utility.js"
  );

  await assetManager.loadPatchedScript(
    "live/js/inventory.js"
  );

  await assetManager.loadPatchedScript(
    "live/js/store.js"
  );
  
  await assetManager.loadPatchedScript(
    "live/js/character.js"
  );

  await assetManager.loadPatchedScript(
    "live/js/location.js"
  );

  await assetManager.loadPatchedScript(
    "live/js/expedition-config.js"
  );

 /* await assetManager.loadPatchedScript(
    "live/js/shared.js"
  );*/
  
  await assetManager.loadPatchedScript(
    "live/js/quests-assets.js"
  );
  
  await assetManager.loadPatchedScript(
    "live/js/quests-database.js"
  );

  await assetManager.loadPatchedScript(
    "live/js/quests.js"
  );

  await assetManager.loadPatchedScript(
    "live/js/shrine-chest.js"
  );

  await assetManager.loadPatchedScript(
    "live/js/shrine-chest-database.js"
  );

  await assetManager.loadPatchedScript(
    "live/js/enemy.js"
  );

  await assetManager.loadPatchedScript(
    "live/js/enemy-database.js"
  );

 /* await assetManager.loadPatchedScript(
    "live/js/localization.js"
  );*/
  
 /* await assetManager.loadPatchedScript(
    "live/js/localization-ui.js"
  );*/

  await assetManager.loadPatchedScript(
    "live/js/localization-tooltips.js"
  );

  await assetManager.loadPatchedScript(
    "live/js/localization-skills.js"
  );

  await assetManager.loadPatchedScript(
    "live/js/localization-quests.js"
  );

  await assetManager.loadPatchedScript(
    "live/js/localization-dialogues.js"
  );

  await assetManager.loadPatchedScript(
    "live/js/localization-items.js"
  );
  
  await assetManager.loadPatchedScript(
    "live/js/localization-locations.js"
  );

}
