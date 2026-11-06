function getBattleTemplate() {
  return `
<div class="view" id="battle-view">
 
   
  <div class="location-name-container">
     <img data-src="img/backgrounds/ribbon-title2.png" alt="Ramka" class="location-name-frame" /> 
     <!-- <div id="location-name" class="location-name"></div>-->
     <svg viewBox="0 0 400 100" class="location-svg">
      <defs>
        
        <path id="ribbon-arc" d="M20,40 Q200,10 380,37" />
      </defs>
      <text class="ribbon-text">
        <textPath href="#ribbon-arc" startOffset="50%" text-anchor="middle" id="ribbonText">
        
        </textPath>
      </text>
    </svg>  
    
  </div> 

   
   <div id="progress-container" class="progress-container">
     <!-- Segmenty zostaną wygenerowane dynamicznie -->
  </div>
  
  <div class="explore-direction-wrapper">
    
    <div id="quest-short-info" class="quest-short-info"></div>
    
    <div class="arrows-center">
  
      <button id="prev-btn" class="arrow-button" onclick="goBack()">
        <img data-src="img/icons/explore-arrow-left-icon.png" alt="left" class="arrow-icon" />
      </button>
      <button id="next-btn" class="arrow-button" onclick="rollOptions()">
        <span class="quest-short-info hidden" id="next-level">${t("next_location_btn")}</span>
        <img data-src="img/icons/explore-arrow-right-icon.png" id="arrow-next-icon" alt="right" class="arrow-icon" />
      </button>
  
    </div>
  
      <div id="enemy-combat-feedback">
  
        <div id="enemy-combat-outcome" class="combat-msg outcome">
          <div class="main"></div>
        </div>

      </div>

  
    <button class="menu-item journal-btn" id="quest-button" onclick="openQuestsPopup()">
       <img data-src="img/icons/quest-book-icon.png" alt="quest-book" id="quest-book" class="quest-icon" />
       <span id="quest-notify" class="notify-dot"></span>
    </button>

    <button class="menu-item market journal-btn hidden disabled" id="store-button" onclick="navigate('store')">
       <img data-src="img/icons/menu-market-icon.png" alt="store" class="quest-icon" />
    </button>

  </div>  
  

<div id="anomaly-selection" class="expedition-popup hidden">

<!--  <div class="popup-content"> -->

    <div class="anomaly-title">
      Nowa anomalia symulacji
    </div>

    <div id="anomaly-options" class="anomaly-options"></div>

<!--  </div>-->

</div>


<div id="summary-popup" class="expedition-popup hidden">
  <div class="popup-content">

    <div class="summary-header">
      <div class="summary-title">POZIOM UKOŃCZONY</div>
      <div id="summary-level" class="summary-level"></div>
    </div>

    <div class="summary-section">

      <div class="summary-grid">

        <div class="summary-stat">
          <img data-src="img/icons/expedition-kills-icon.png" class="expedition-stat-icon">
          <div id="sum-kills"></div>
          <span>Zabitych Wrogów</span>
        </div>
        <div class="summary-stat">
          <img data-src="img/icons/expedition-damage-dealt-icon.png"class="expedition-stat-icon" >
          <div id="sum-damage"></div>
          <span>Zadanych Obrażeń</span>
        </div>

        <div class="summary-stat">
          <img data-src="img/icons/expedition-damage-taken-icon.png" class="expedition-stat-icon">
          <div id="sum-taken"></div>
          <span>Otrzymanych Obrażeń</span>
        </div>

        <div class="summary-stat">
          <img data-src="img/icons/expedition-damage-blocked-icon.png" class="expedition-stat-icon">
          <div id="sum-blocked"></div>
          <span>Zablokowanych Obrażeń</span>
        </div>

      </div>

      <div class="summary-substat">
        IDEALNE BLOKI: <span id="sum-perfect"></span>
      </div>

    </div>

    <div class="summary-section">

      <div class="summary-rewards">

        <div class="reward-row">
          <img data-src="img/icons/expedition-loot-icon.png">
          <span id="sum-loot"></span>
        </div>

        <div class="reward-row">
          <span id="sum-time"></span>
        </div>

        <div class="reward-row" id="level-stats-gold">
          <img data-src="img/icons/expedition-gold-icon.png" >
          <span id="sum-gold"></span>
        </div>

        <div class="reward-row" id="level-stats-impulses">
          <img data-src="img/icons/expedition-impulse-icon.png" >
          <span id="sum-impulse"></span>
        </div>

      </div>

    </div>

    <button id="summary-btn" class="item-button" onclick="confirmLevelSummary()">
      DALEJ
    </button>

  </div>
</div>


<div id="run-summary-popup" class="expedition-popup hidden">
  <div class="popup-content">

    <div class="summary-title" id="run-summary-title">SYMULACJA ZAKOŃCZONA</div>
    <div id="run-depth" class="summary-level"></div>

    <div class="summary-grid">

      <div class="summary-stat">
        <img data-src="img/icons/expedition-kills-icon.png" class="expedition-stat-icon">
        <div id="run-kills"></div>
        <span>Wrogowie</span>
      </div>

      <div class="summary-stat">
        <img data-src="img/icons/expedition-perfect-icon.png" class="expedition-stat-icon">
        <div id="run-perfect"></div>
        <span>Perfect block</span>
      </div>

      <div class="summary-stat" id="stat-gold">
        <img data-src="img/icons/expedition-gold-icon.png" class="expedition-stat-icon">
        <div id="run-gold"></div>
        <span>Złoto</span>
      </div>

      <div class="summary-stat" id="stat-impulses">
        <img data-src="img/icons/expedition-impulse-icon.png" class="expedition-stat-icon">
        <div id="run-impulses"></div>
        <span>Impulsy</span>
      </div>

      <div class="summary-stat" id="stat-keys">
        <img data-src="img/icons/expedition-key-icon.png" class="expedition-stat-icon">
        <div id="run-keys"></div>
        <span>Klucze</span>
      </div>

      <div class="summary-stat" id="stat-damage">
        <img data-src="img/icons/expedition-damage-dealt-icon.png" class="expedition-stat-icon">
        <div id="run-damage"></div>
        <span>Zadane Obrażenia</span>
      </div>
    
   </div>

  <div class="summary-section">

    <div class="summary-time" id="run-summary-time">
      <span id="run-time"></span>
    </div>

  </div>

    <div class="summary-buttons">
      <button class="item-button" id="run-summary-btn" onclick="nextRun()">NOWA SYMULACJA</button>
      <button class="item-button secondary" id="run-hub-btn" onclick="closeRunSummary()">OBÓZ</button>
    </div>

  </div>
</div>


  <!-- <div class="slot-name-container">
    <div id="slot-name" class="slot-name hidden"></div>
  </div> -->

  
  <div id="combat-slots">
  
    <div id="player-combat-slot" class="player-slot">
  
        <div class="player-status-container" id="player-status"></div>
  
        <img class="player-frame" id="player-frame">

        <img class="player-slot-bg" id="player-slot-bg">

        <div class="player-shadow" id="player-shadow"></div>

        <div class="player-avatar" id="player-avatar">

            <img id="player-body" class="player-layer">

            <img id="player-head" class="player-layer">

            <img id="player-hands" class="player-layer">

            <img id="player-helmet" class="player-layer">

            <img id="player-armor" class="player-layer">

            <img id="player-gloves" class="player-layer">

            <img id="player-boots" class="player-layer">

            <img id="player-pants" class="player-layer">

            <img id="player-bracer" class="player-layer">

            <img id="player-shoulder" class="player-layer">
  
            <img id="player-weapon" class="player-layer">

            <img id="player-shield" class="player-layer">

        </div>

        <div id="player-effects"></div>

        <div class="whirlwind-vfx hidden">
          <img class="whirlwind-ring ring-1" id="ring1">
          <img class="whirlwind-ring ring-2" id="ring2">
        </div>
  
        <div id="player-status-container"></div>

        <div id="player-damage-float-container"></div> 

        <div class="enemy-health-bar" id="player-health-bar">
            <div class="enemy-health-fill" id="player-health-fill"></div>
            <div class="enemy-health-text" id="player-health-text"></div>
        </div>

        <div class="enemy-cooldown-bar" id="player-cooldown-bar">
            <div class="enemy-cooldown-fill" id="player-cooldown-fill"></div>
        </div>

    </div>
  
  <img id="vs-symbol" class="vs-symbol">
  
  <div id="explore-options" class="slot-row"></div>
  
</div>  
  
  
  
  
<div id="item-popup" class="npc-popup hidden">
  <div class="popup-content">
    <div id="popup-content"></div>
  </div>
</div>
  
  
 <div id="quest-popup" class="quest-popup hidden">
  <div class="popup-content">
   <!-- <div id="popup-content">-->
      <div class="popup-header">
        <h2>${t("quest_book")}</h2>
      </div>

      <!-- 🔖 Zakładki dla aktów -->
      <div class="quest-tabs">
        <button class="quest-tab active" data-act="1">${t("quest_act")} I</button>
        <button class="quest-tab disabled" data-act="2">${t("quest_act")} II</button>
        <button class="quest-tab disabled" data-act="3">${t("quest_act")} III</button>
        <button class="quest-tab disabled" data-act="4">${t("quest_act")} IV</button>
        <button class="quest-tab disabled" data-act="5">${t("quest_act")} V</button>
      </div>

      <!-- 📋 Lista questów -->
      <div id="quests-popup-content" class="quest-list"></div>
   <!-- </div>-->
      <div class="close-btn-wrapper" id="quest-close-wrapper">
         <button class="close-button" id="item-close-btn" onclick="closeQuestsPopup()"></button>
         <img data-src="img/buttons/close-btn.png" alt="Zamknij" class="close-btn-frame" />
      </div> 
  </div>
</div>
    
  
<div class="attack-dialog-container">
  <div id="attack-dialog-box" class="attack-dialog-box"></div>
  
</div>
 
<div id="levelup-popup" class="npc-popup hidden">
  <div class="popup-content">
    <div id="popup-content">

       <!-- OBRAZ / IKONA -->
    <div class="levelup-image-wrapper">
      <img
        data-src="img/icons/levelup-title-icon.png"
        alt="Awans" 
        class="levelup-image"
      />
    </div>

    <!-- TYTUŁ -->
    <h2 class="levelup-title">${t("levelup_title")}</h2>
    <div class="levelup-level" id="levelup-lvl"></div>
    
    <!-- FLAVOR / OPIS -->
    <div class="levelup-flavor">
      Czujesz, że stałeś się silniejszy.
    </div>

    <!-- SEPARATOR -->
    <div class="levelup-separator"></div>

    <!-- NAGRODY GŁÓWNE -->
    <div class="levelup-rewards">

      <div class="levelup-reward">
        <span class="reward-icon"></span>
        <span class="reward-text">
          <strong>+1</strong> ${t("levelup_skill_point")}
        </span>
      </div>

      <div class="levelup-reward">
        <span class="reward-icon"></span>
        <span class="reward-text">
          <strong>+5</strong> ${t("levelup_attr_points")}
        </span>
      </div>

    </div>

    <!-- OPCJONALNY BONUS -->
    <!-- ukryj jeśli brak -->
    <div class="levelup-bonus hidden" id="levelup-bonus">
      <span class="bonus-label">Dodatkowy efekt:</span>
      <span class="bonus-value">+2% Maks. Życia</span>
    </div>
  
    <div class="confirm-button-wrapper">
      <button id="levelup-confirm" class="item-button">${t("continue_btn")}</button>
    </div>
 
    </div>
  </div>
</div>
  
  
<div id="endstory-popup" class="npc-popup hidden">
  <div class="popup-content endstory-popup-content">

    <div id="popup-content">

      <!-- IKONA -->
      <div class="endstory-image-wrapper">
        <img
          data-src="img/icons/endstory-title-icon.png"
          alt="End"
          class="endstory-image"
        />
      </div>

      <!-- TYTUŁ -->
      <h2 class="endstory-title">
        ${t("end_story_title")}
      </h2>

      <div class="endstory-subtitle">
        ${t("end_story_subtitle")}
      </div>

      <div class="levelup-separator"></div>

      <!-- ODBLOKOWANIE -->
      <div class="endstory-unlock-box">

        <div class="unlock-header">
          ${t("new_mode_unlocked")}
        </div>

        <div class="unlock-mode">
          ${t("adventure_mode")}
        </div>

        <div class="unlock-desc">
          ${t("adventure_mode_desc")}
        </div>

      </div>

     <div class="confirm-button-wrapper">
       <button id="endstory-confirm" class="item-button">
         ${t("continue_btn")}
       </button>
     </div>
  
   </div>

  </div>
</div>  

  
  
  
  <div id="death-popup" class="npc-popup hidden">
  <div class="popup-content">
    <div id="popup-content">
      
      <div class="death-icon">
        <img data-src="img/icons/death-title-icon.png" alt="death-icon"/>
      </div>
      
      <h2 class="death-title">${t("death_title")}</h2>
                
      <div class="death-consequences">
        <span>${t("death_gold")}</span>
        <span class="gold-loss">-
          <span id="gold-loss"></span>      
        </span>
      </div>   
        
      <div class="death-debuff" id="death-debuff">
       <div class="debuff-title">${t("death_debuff")}</div>
       <div class="debuff-desc" id="death-debuff-value"></div>
      </div>
      
      
      <div class="death-info" id="death-info"></div> 
          
      <div class="death-tip-title">${t("death_tip")}</div>
      <div class="death-tip" id="death-tip"></div>
       
      <div class="confirm-button-wrapper">
        <button id="death-confirm" class="item-button">${t("continue_btn")}</button>
      </div>
   
    </div>
  </div>
</div>
  
    
<div id="confirm-popup" class="popup hidden">
  <div class="confirm-content rare-slot">
    <div id="confirm-message"></div>
    <div class="custom-confirm-buttons">
      <button id="confirm-yes">${t("confirm_yes")}</button>
      <button id="confirm-no">${t("confirm_no")}</button>
    </div>
  </div>
</div>
    
  <div id="custom-alert-container"></div>
   
<div id="stat-tooltip" class="stat-tooltip hidden">
  <div class="stat-tooltip-title"></div>
  <div class="stat-tooltip-content"></div>
</div>




 </div>

`;
}


/*async function renderBattleView() {

  const app = document.getElementById("app");

  app.classList.add("view-hidden");

  app.innerHTML = await getBattleTemplate();

  await assetManager.preloadAssets(COMBAT_ASSETS);
  await assetManager.preloadAssets(ENEMY_ASSETS);
  await assetManager.preloadAssets(STORY_ASSETS);

  initBattleView();

  await waitForImages(app);

  await nextFrame();

  app.classList.remove("view-hidden");
}*/

async function renderFirstBattleView() {
    
  return (async () => {
    
    const app = document.getElementById("app");

    app.classList.add("view-hidden");

    app.innerHTML = await getBattleTemplate();
    
    await assetManager.preloadAssets(COMBAT_ASSETS);
    await assetManager.preloadAssets(ENEMY_ASSETS);
    await assetManager.preloadAssets(STORY_ASSETS);

    //loadPlayerSkills();
    
    initBattleView();

    await waitForImages(app);
    await nextFrame();
    
    app.classList.remove("view-hidden");
    
      
  })();
}

async function traceBattleStage(stage, task) {
  const startedAt = performance.now();
  window.RuntimeDiagnostics?.record("battle.render.stage.start", { stage });

  try {
    const result = await task();
    window.RuntimeDiagnostics?.record("battle.render.stage.complete", {
      stage,
      durationMs: Math.round(performance.now() - startedAt)
    });
    return result;
  } catch (error) {
    window.RuntimeDiagnostics?.captureError(error, "battle-render-" + stage);
    window.RuntimeDiagnostics?.record("battle.render.stage.fail", {
      stage,
      durationMs: Math.round(performance.now() - startedAt),
      message: String(error?.message || error)
    });
    throw error;
  }
}

async function renderBattleView() {
  const renderStartedAt = performance.now();
  window.RuntimeDiagnostics?.record("battle.render.start", {
    visibilityState: document.visibilityState,
    online: navigator.onLine
  });

  try {
    await withViewLoader(async () => {
      const app = document.getElementById("app");

      await traceBattleStage("hide-previous-view", () => {
        app.classList.add("view-hidden");
      });

      await traceBattleStage("template", async () => {
        app.innerHTML = await getBattleTemplate();
      });

      await traceBattleStage("combat-assets", () => assetManager.preloadAssets(COMBAT_ASSETS));
      await traceBattleStage("enemy-assets", () => assetManager.preloadAssets(ENEMY_ASSETS));
      await traceBattleStage("story-assets", () => assetManager.preloadAssets(STORY_ASSETS));

      await traceBattleStage("init-battle-view", () => initBattleView());
      await traceBattleStage("wait-for-images", () => waitForImages(app));
      await traceBattleStage("next-frame", () => nextFrame());

      await traceBattleStage("reveal-view", () => {
        app.classList.remove("view-hidden");
      });
    });

    window.RuntimeDiagnostics?.record("battle.render.complete", {
      durationMs: Math.round(performance.now() - renderStartedAt)
    });
  } catch (error) {
    window.RuntimeDiagnostics?.captureError(error, "battle-render");
    window.RuntimeDiagnostics?.record("battle.render.fail", {
      durationMs: Math.round(performance.now() - renderStartedAt),
      message: String(error?.message || error)
    });
    throw error;
  }
}



/*async function renderBattleView() {
    document.getElementById("app").innerHTML = getBattleTemplate();
  
    await assetManager.preloadAssets(COMBAT_ASSETS);
    await assetManager.preloadAssets(ENEMY_ASSETS);
    await assetManager.preloadAssets(STORY_ASSETS);

  
    initBattleView(); // tu wywołujesz logikę tej strony
}*/

let shopMenuBtn = null;
let questPopupHandler = null;
let questTabHandlers = [];
let potionClickHandler = null;
let actionElements = [];

/*const ICONS = {
  attack: assetManager.getResolvedAsset("img/icons/normal-windup-icon.png"),
  heavy: assetManager.getResolvedAsset("img/icons/heavy-windup-icon.png"),
  guard: assetManager.getResolvedAsset("img/icons/guard-windup-icon.png"),
  charge: assetManager.getResolvedAsset("img/icons/charge-windup-icon.png"),
  bleed: assetManager.getResolvedAsset("img/icons/bleed-icon.png"),
  armorBreak: assetManager.getResolvedAsset("img/icons/armor-break-icon.png")
};*/



function initBattleView() {
  //shopMenuBtn = document.getElementById('shop-menu-btn');
  //console.log("battle init");

  loadPlayerSkills();
  
  const container = document.getElementById("explore-options");
  if(container) {
    container.addEventListener("click", handleBattleOptionClick);
  }
  
  /*document.querySelectorAll("[data-src]").forEach(img => {
    img.src = `${ASSET_BASE}${img.getAttribute("data-src")}`;
  });*/
  
  loadCombatAssets();
    
 // syncPlayerSkillsToSkills();
    
  renderCombat();
    
  actionElements = [...document.querySelectorAll("[data-action]")];
    
  //startUiTick();
  initQuestTabs();
  initQuestPopupDelegation();
  attachPotionEvents();
  
  if (gameState.world.generateNewLevelOnLoad === "1") {
    updateLocationName();
    generateLocation();
    loadFirstStep();
    renderOptions();
    highlightCurrentStep();
    gameState.world.generateNewLevelOnLoad = "0";
    saveGame();
  }

  if(gameState.world.mode === `sandbox` || gameState.world.mode === `adventure`) {
     document.getElementById(`quest-button`).classList.add(`hidden`);
     document.getElementById(`store-button`).classList.remove(`hidden`);
  }      
  /*if(gameState.world.mode === `story`) {
     document.getElementById(`quest-button`).classList.remove(`hidden`);
     document.getElementById(`quest-button`).classList.add(`hidden`);
  }*/      
    
  if ((gameState.world.mode ===`sandbox` || gameState.world.mode === `adventure`) && gameState.world.currentStepIndex === 0) {
    document.getElementById(`store-button`).classList.remove('disabled');
  }
    
  addBattleListeners();

  const player = getPlayerStats();
  gameState.combat.playerBlock.mode = player.blockMode;

  checkIfGameIsSaved();
    
  gameState.resources.enterStore = false;
  
  updateCharMenuIcon();
  updateSkillsMenuIcon();
  
  updateLowHpUIBuff();
  
  checkIfGameWasKilled();
  
  checkIsStepBeforeMiniboss();
}

function loadCombatAssets() {
  document.querySelectorAll("[data-src]").forEach(img => {
    const path = img.getAttribute("data-src");
    img.src = assetManager.getResolvedAsset(path);
  });
}


function checkIsStepBeforeMiniboss() {
  const world = gameState.world;
  const story = getStoryConfig(world.currentLocation);
  const isMiniboss = story.storyInjections?.[world.currentStepIndex + 1]?.inject?.miniboss;
  //const isMiniboss = true;
  const nextBtn = document.getElementById("next-btn");
 // console.log("isMiniboss", isMiniboss);

  if(world.currentStepIndex === (world.locationSteps.length - 2) && isMiniboss && world.mode === `story`) {
    
   // console.log("przedostatni krok i miniboss outside");
 
    if(!world.bossDefeatedState.isBossDefeated) {
      //console.log("przedostatni krok i world.bossDefeatedState.isBossDefeated outside");
      nextBtn.onclick = (e) => { 
        //console.log("klikam nextBtn.onclick outside");
      //  e.stopPropagation(); 
        showCustomConfirm(
          `${t("next_step_miniboss")}`,
          () => { rollOptions(); },
          () => { }
        );
      };
    }
  }
}

function checkIfGameWasKilled() {
  const world = gameState.world;
  const enemy = world.exploreOptions[world.selectedSlotIndex]?.enemyData;
  const player = getPlayerStats();

  if(world.inCombat) {
    //console.log(`world.inCombat`, world.inCombat);
    onFleeSuccess(player, enemy, world.selectedSlotIndex, true);
  }
}


function handleBattleOptionClick(e) {
  const npcElement = e.target.closest("[data-type='npc']");
  if (!npcElement) return;

  const locationKey = (gameState.world.currentLocation || "")
    .toLowerCase()
    .replace(/\s+/g, "_");

  const npcs = NPC_DATA[locationKey] || [];
  const npcId = npcElement.dataset.npcId || "";
  const npc = npcs.find(n => n.id === npcId);

  if (!npc) {
    const error = new Error(`NPC not found for click: ${npcId || "(missing id)"}`);
    window.RuntimeDiagnostics?.captureError(error, "npc-click", {
      locationKey,
      npcId
    });
    return;
  }

  const quest = QUEST_DATA[npc.questId];
  if (!quest) {
    const error = new Error(`Quest not found for NPC: ${npc.id} (${npc.questId || "missing questId"})`);
    window.RuntimeDiagnostics?.captureError(error, "npc-click", {
      locationKey,
      npcId: npc.id,
      questId: npc.questId || ""
    });
    return;
  }

  openNpcDialog(npc, quest);
}

function addBattleListeners() {
  //const attackButton = document.getElementById('attack-button');
    
  window.addEventListener("enemy-attack-windup", handleEnemyWindup);
    
  //document.addEventListener("click", potionClickHandler);

  document.addEventListener("click", handleBattleClick);
    
  /*document.addEventListener("click", handleAttackClick);
  document.addEventListener("click", handleShieldClick);*/
//  console.error("battle btn init");

}

function handleBattleClick(e) {

  const actionElement = e.target.closest("[data-action]");
  if (!actionElement) return;

  const action = actionElement.dataset.action;

  switch(action) {

    case "skill":
      handleSkillClick(actionElement);
      break;

    case "block":
      if (e.target.closest('.skill')) return;
      
      handleShieldClick(actionElement);
      break;

    case "attack":
      handleAttackClick(actionElement);
      break;
  }
}

function openStore() {
   //console.error(`open store`); 
   navigate(`store`);
}

function destroyBattleView() {
  //stopUiTick();
  if (typeof clearReengageCountdownIntervals === "function") {
    clearReengageCountdownIntervals();
  }
  detachQuestTabs();
  detachPotionEvents();
  //console.log("battle destroy");
  
  const content = document.getElementById("quests-popup-content");
  if (content && questPopupHandler) {
    content.removeEventListener("click", questPopupHandler);
    questPopupHandler = null;
  }
    
  const container = document.getElementById("explore-options");
  container?.removeEventListener("click", handleBattleOptionClick);

  document.removeEventListener("click", handleBattleClick);
  document.removeEventListener("click", handleSkillClick);

  window.removeEventListener("enemy-attack-windup", handleEnemyWindup);
  //document.removeEventListener("click", potionClickHandler);
  document.removeEventListener("click", handleAttackClick);
  document.removeEventListener("click", handleShieldClick);
 // console.error("battle btn destroy");
}

function handleEnemyWindup(e) {
    const { enemy, slotIndex, duration } = e.detail;
    //console.error(`slotIndex wind up`, enemy, slotIndex, duration);
    const slot = document.getElementById(`enemy-slot-${slotIndex}`);
    if(!slot) return;
  
    //slot.classList.add("windup");
    gameState.combat.flags.windupEnd = false;
    updateStatusEnemyUI(enemy);
  
    let enemyCooldown = 0;
  
    if(gameState.combat.flags.isCritical) {
      showOutcome(`miss`, `${t("critical_state_outcome")}`);
    } else {
        //if(enemy.intent === `attack`) showEnemyOutcome("wind-up", `${t("windup_outcome")}`, duration);
        //if(enemy.intent === `heavy`) showEnemyOutcome("miss",`${t("heavy_windup_outcome")}`, duration);
        if(enemy.intent === `guard`) {
          showEnemyOutcome("dodge", `${t("guard_outcome")}`, duration * 2);
          enemyCooldown = enemy.attackState.baseCooldown;
        }
    }
    
    /*setTimeout(() => {
      //slot.classList.remove("windup");
      gameState.combat.flags.windupEnd = true;
      updateStatusEnemyUI(enemy);
    }, (duration + enemyCooldown));*/

}


function handleAttackClick(e) {
  //const attackButton = e.target.closest('#right-hand');
  /*console.error("enter battle btn", attackButton);
  console.error("className:", e.target.className);
  console.error("classList:", e.target.classList);
  console.error("className current:", e.currentTarget.className);
  console.error("classList current:", e.currentTarget.classList);*/

  if (!e) return;
  
  if (!gameState.world.inCombat) return;
  
  if(!gameState.combat.isStart) return;
  
  if (typeof handleAttack === 'function') {
    handleAttack();
  }

}

function handleShieldClick(e) {
  //const shieldButton = e.target.closest('#left-hand');
  if (!e) return;
    
  if (!gameState.world.inCombat) return;

  if (!playerHasShieldEquipped()) {
      //console.log("Brak tarczy w lewej ręce");
      return;
  } 
    
  if (typeof handleShieldAction === 'function') {
    handleShieldAction();
  }
}

function initQuestTabs() {
  const tabs = document.querySelectorAll(".quest-tab");

  tabs.forEach(tab => {
    const handler = (e) => {
      tabs.forEach(t => t.classList.remove("active"));
      e.target.classList.add("active");

      const act = parseInt(e.target.getAttribute("data-act"));
      renderQuestList(act);
    };

    tab.addEventListener("click", handler);
    questTabHandlers.push({ element: tab, handler });
  });
}

function detachQuestTabs() {
  questTabHandlers.forEach(({ element, handler }) => {
    element.removeEventListener("click", handler);
  });

  questTabHandlers = [];
}

function initQuestPopupDelegation() {
  const content = document.getElementById("quests-popup-content");
  if (!content) return;
    
  questPopupHandler = (e) => {
    const entry = e.target.closest(".quest-entry");
    if (!entry) return;
    
    const questId = entry.dataset.id;
    const q = gameState.world.battleState.quests?.[questId];
    const quest = q ? getQuestFromId(q.id) : null;

    // ===== OPIS =====
    if (e.target.classList.contains("quest-desc-toggle")) {
      e.stopPropagation();

      if (quest) {
        openQuestDescription(quest);
        playSound(`open`, 0.4);
      }

      const desc = entry.querySelector(".quest-desc");
      const btn = e.target;

      btn.textContent = desc.classList.contains("visible")
        ? "📜 Ukryj opis"
        : "📜 Pokaż opis";

      return;
    }

    // ===== HEADER =====
    if (e.target.closest(".quest-header")) {

      const isExpanded = entry.classList.contains("expanded");

      document.querySelectorAll(".quest-entry.expanded").forEach(e => {
        e.classList.remove("expanded");
        const body = e.querySelector(".quest-body");
        if (body) body.style.height = "0px";
      });

      playSound(`open-slot`, 0.4);
        
      if (!isExpanded) {
        entry.classList.add("expanded");

        const body = entry.querySelector(".quest-body");
        if (body) {
          body.style.height = body.scrollHeight + "px";
        }

        entry.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }

      if (q) {
        q.questNotifications = false;
        saveGame();
      }

      entry.classList.remove("has-notification");
    }
  };

  content.addEventListener("click", questPopupHandler);
}

/*function potionClickHandler(e) {
  const potionButton = e.target.closest('#potions-container');

  if (!potionButton) return;
    
  if (typeof usePotion === 'function') {
    const slot = e.target.closest(".potion-slot");
    if (!slot) return;

    const index = Number(slot.dataset.potion);
    if (!resources.potions[index]) return;

    usePotion(index);
  }
}*/


function attachPotionEvents() {
 
  potionClickHandler = (e) => {

    const slot = e.target.closest(".potion-slot");
    if (!slot) return;

    const index = Number(slot.dataset.potion);
    if (!gameState.resources.potions[index]) return;

    usePotion(index);
  };
    
  document.addEventListener("click", potionClickHandler);
}


function detachPotionEvents() {
  if (potionClickHandler) {
    document.removeEventListener("click", potionClickHandler);
    potionClickHandler = null;
  }
}
