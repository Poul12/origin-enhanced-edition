let allItems = [];
let lastLoot = [];
let selectedItem = null;
let selectedItemId = null;
let selectedSource = null;
//let isInitializing = false;
let potionStreak = null;

const slotTypeWeights = [
  { type: "enemy",   weight: 86 },
  { type: "chest",   weight: 7 },
  { type: "shrine",  weight: 7 }
];


// ——— MEMORY ———

function loadState() {
  const world = gameState.world;

  restoreBuffsAfterReload();
  restoreFirecampState();
  
  const btn = document.getElementById("bypass-btn");
  btn.style.backgroundColor = world.bypassEnemyCheck ? "limegreen" : "red";
  
  showNavigateButtons();
  if (world.bossDefeatedState.isBossDefeated && world.currentStepIndex + 1 >= world.locationSteps.length) {
    hideGoBackButton();
  }
    
  if (world.battleState.quests) {
    const active = Object.values(world.battleState.quests).filter(q => q.state === "active");
   // console.log("🔹 Aktywne questy:", active);
  }
    
     // 🔄 MIGRACJA: upewnij się, że każdy krok ma lootItems
    for (const step of world.locationSteps) {
      if (!Array.isArray(step.lootItems)) {
        // jeśli ktoś kiedyś wrzucił loot do exploreOptions
        if (Array.isArray(step.exploreOptions) && step.exploreOptions.lootItems) {
          step.lootItems = step.exploreOptions.lootItems;
          delete step.exploreOptions.lootItems;
        } else {
          step.lootItems = [];
        }
      }
    }

    if (world.locationSteps.length > 0) {
      initializeProgressBar(world.locationSteps);
    }

    if (world.locationSteps[world.currentStepIndex]?.exploreOptions) {
      world.exploreOptions = world.locationSteps[world.currentStepIndex].exploreOptions;
      //console.log("loading lootItems", world.locationSteps[world.currentStepIndex].lootItems);
    } else {
      world.exploreOptions = [];
    }

    if(world.isMinibossLastStep && !world.bossDefeatedState.isBossDefeated && world.currentStepIndex + 1 >= world.locationSteps.length) {
      //console.log("isMiniboss last step");
      hideNavigateButtons();
      /*const prevBtn = document.getElementById("prev-btn");
      const nextBtn = document.getElementById("next-btn");
      prevBtn.classList.add(`hidden`);
      if(!world.bossDefeatedState.isBossDefeated){
        console.log("!isBossDefeated");
        //nextBtn.classList.add(`hidden`);
      } else {
        //showNavigateButtons();
      }*/
    } 
    
   // console.log("🔁 Stan gry załadowany:");
  
    renderStats();
    updateLocationName();
   // syncStepEnemies(world.currentStepIndex);
    renderOptions();
    updateQuestNotification();
    updateQuestShortInfo();
    renderLoots();
    showEnemyDialogBox();
    restoreActionLock();
    updateActionLockUI();
    restoreAttackCooldownAfterLoad();
    restoreSkillCooldowns();
  
    if (world.inCombat && world.selectedSlotIndex !== null) {
      restoreCombat();
    }

    //console.error("After load playerBlock.cooldownPaused:", combat.playerBlock.cooldownPaused);
}


function toggleBypass() {
  const world = gameState.world;
  const resources = gameState.resources;

  world.bypassEnemyCheck = !world.bypassEnemyCheck;
  resources.energyState.noEnergyUse = !resources.energyState.noEnergyUse;
  const btn = document.getElementById("bypass-btn");
  btn.style.backgroundColor = world.bypassEnemyCheck ? "limegreen" : "red";
  //console.log(`🧪 Tryb testowy ${world.bypassEnemyCheck ? "AKTYWNY" : "WYŁĄCZONY"}`);
  saveGame();
}

function areAllEnemiesDefeated(step = null) {
  const world = gameState.world;

  if (world.bypassEnemyCheck) return true;
   
  if (!step) step = world.locationSteps[world.currentStepIndex];
  if (!step || !Array.isArray(step.exploreOptions)) return false;

  //console.log(`areAllEnemiesDefeated`, step);
  
  return step.exploreOptions
    .filter(opt => opt.type === "enemy" || opt.type === "mini_boss" || opt.type === "boss" || opt.type === "elite" || opt.type === "story_event" || opt.type === "story_enemy")
    .every(opt => opt.used);
}

function checkIfGameIsSaved() {
  const world = gameState.world;

  if (!world) return;

  //console.log("check saved");

  if(world.mode === "expedition"){
    checkExpeditionState();
    return;
  }
  
  if(world.mode === "sandbox" || world.mode === "adventure"){
    checkSandboxState();
    return;
  }

  checkStoryState();
}


function checkStoryState() {
  const world = gameState.world;

  if (world) {
    //console.log(`check saved`);
    // Jeśli wchodzimy w NOWY region → nadpisz stary stan nowym poziomem
    if (world.isStartNewRegion && world.selectedRegionId) {
     // console.log(`▶ Nowy region (${world.selectedRegionId}) — start nowego poziomu`);
      world.isInitializing = true;
      world.isStartNewRegion = false;
      world.bossDefeatedState.isBossDefeated = false;
      //if(world.mode === "adventure") updateLocationForLoop();
      startLevel();
      renderStats();
      loadFirstStep();
      renderOptions();
      showEnemyDialogBox();
      initStamina();
      saveGame();
      return;
    }

    // Jeśli mamy stan i NIE jest to nowy region → wczytaj zapis
    if (!world.isStartNewRegion && world.locationSteps && world.locationSteps.length > 0) {
      //console.log("🔁 Wczytywanie stanu gry...");
      //console.log("isBossDefeated", world.bossDefeatedState.isBossDefeated);
      loadState();
      return;
    }
  }

}

function checkExpeditionState(){
  const world = gameState.world;

  if(world.isStartNewRegion){
    //console.error(`world.isStartNewRegion in check`, world.isStartNewRegion);
    world.isInitializing = true;
    world.isStartNewRegion = false;
    //console.error(`checkExpeditionState region`, world.selectedRegionId);

    startExpeditionLevel();

    renderStats();
    loadFirstStep();
    renderOptions();
    showEnemyDialogBox();

    initStamina();

    saveGame();

    return;
  }

  if(world.locationSteps && world.locationSteps.length > 0){
    //console.error(`loadState in check`);
    loadState();
    return;
  }
}

function checkSandboxState(){
  const world = gameState.world;

  if(world.isStartNewRegion){
    world.isInitializing = true;
    world.isStartNewRegion = false;
    
    startSandboxLevel();
        
    renderStats();
    loadFirstStep();
    renderOptions();
    showEnemyDialogBox();

    saveGame();

    return;
  }

  if(world.locationSteps && world.locationSteps.length > 0){
    //console.error(`loadState in check`);
    loadState();
    return;
  }
}

// ——— EXPLORATION ———

function weightedRandom(options) {
  const totalWeight = options.reduce((sum, opt) => sum + opt.weight, 0);
  let r = Math.random() * totalWeight;

  for (const opt of options) {
    if (r < opt.weight) return opt.type;
    r -= opt.weight;
  }
  
  return options[options.length - 1]?.type; // fallback
}

function cloneEnemyForStep(enemy, stepIndex, slotIndex) {
  const clone = structuredClone(enemy); // 🔥 idealne tutaj

  clone.__stepIndex = stepIndex;
  clone.__slotIndex = slotIndex;

  // 🧹 WYTNJ wszystko czasowe
  clone.regen = null;
  clone.lastCombatTimestamp = null;
  clone.hpAtLastCombat = clone.currentHp;

  return clone;
}

function initializeExploreOptions(newStep) {
  const level = gameState.char.level || 1;
  const world = gameState.world;

  const story = getStoryConfig(world.currentLocation);
  
  if (!newStep.exploreOptions) {
    newStep.exploreOptions = newStep.contents.map((type, i) => {
      const opt = {
        type,
        used: false,
        chestOpened: false,
        chestItems: []
      };
      if (type === "enemy") {
        const forced = newStep.forcedAllEnemies;
      //  console.warn("step.forcedAllEnemies", forced);

        let enemy = forced 
            ? generateEnemy(level, false, forced)
            : generateEnemy(level);
        
        //enemy = rawEnemy = applyExpeditionScaling(rawEnemy, `expedition`);
       
        opt.enemyData = enemy;
        
        // 🔑 KLUCZOWE
        opt.enemyData.__stepIndex = world.currentStepIndex;
        opt.enemyData.__slotIndex = i;
      } else if (type === "elite") {
        const enemy = generateEliteEnemy(level);
        
        opt.enemyData = enemy;
        
        opt.enemyData.__stepIndex = world.currentStepIndex;
        opt.enemyData.__slotIndex = i;
      } else if (type === "shrine") {
        let shrine = pickRandomShrine();
        //console.log("renderuje shrine w initialize", shrine);
        opt.shrineData = pickRandomShrine();
      } else if (type === "chest") {
        let chest = getRandomChest();
       // console.log("renderuje chest w initialize", chest);
        opt.chestData = getRandomChest();
      } else if (type === "npc") {
        const locationKey = (world.currentLocation || "")
         .toLowerCase()
         .replace(/\s+/g, "_");

        const npcs = NPC_DATA[locationKey] || [];
        const indexInStep = i;
        
        const stepInjection = story.storyInjections?.[world.currentStepIndex];
       
        // 🆕 Pobierz ID z injection (pojedynczy NPC)
        const npcId = (stepInjection?.inject?.id || "").trim();

        // 🆕 Znajdź NPC po jego ID
        let npc = npcs.find(n => n.id === npcId);
        
        // Jeśli nie znaleziono — daj ostrzeżenie i weź cokolwiek, żeby nie wywalić gry
        if (!npc) {
          //console.warn(`NPC with id "${npcId}" not found in location "${locationKey}"`);
          npc = npcs[indexInStep] || npcs[npcs.length - 1];
        }
        
        opt.npcData = npc;
      } else if (type === "story_enemy") {
        const storyData = story.storyEnemies?.[world.currentStepIndex];
        //console.warn(`story.storyEnemies story_enemy`, storyData.enemyId);
        const forced = newStep.forcedEnemy;
        //console.warn(`step.forcedEnemy enemyData`, forced);
    
        opt.enemyData = forced 
            ? generateStoryEnemy(forced, level)
            : generateEnemy(level, true);
        
        // 🔑 KLUCZOWE
        opt.enemyData.__stepIndex = world.currentStepIndex;
        opt.enemyData.__slotIndex = i;
   
        let guaranteedDrop = storyData?.guaranteedDrop || null;
                
       // console.warn(`opt.enemyData, guaranteedDrop`, opt.enemyData.name, guaranteedDrop);
        
        opt.questId = storyData.questId;
        opt.guaranteedDrop = storyData?.guaranteedDrop || null;
      } else if (type === "story_event") {
        opt.storyEvent = story.storyInjections[world.currentStepIndex].inject;
      }
      
      return opt;
    });
  }
}

function randomOpt() {
  const types = ["chest", "shrine", "enemy", "elite", "mini_boss", "boss", "npc"];
  const type = types[Math.floor(Math.random() * types.length)];

  const opt = {
    type,
    used: false,
    chestOpened: false,
    chestItems: []
  };

  if (type === "enemy") {
    const level = gameState.char.level || 1;
    opt.enemyData = generateEnemy(level);
  }

  return opt;
}

function renderActionButtons(opt, div, i) {
    // === 🔥 Dodaj przycisk walki / reengage lock ===
    const actionBtn = document.createElement("div");
    actionBtn.className = "reangage-countdown hidden";
    actionBtn.id = `reengage-btn-${i}`;
  
    const enemy = opt.enemyData;
    const isRunestoneGuardian = enemy.name === "runic_stone_guardian" && enemy.currentHp <= 2000;
  
    const now = Date.now();
      if (enemy.reengageLockedUntil && enemy.reengageLockedUntil > now) {
          let remaining = Math.ceil((enemy.reengageLockedUntil - now) / 1000);
          actionBtn.disabled = true;
          div.classList.add("used");
          actionBtn.classList.remove("hidden");
          actionBtn.innerText = `(${remaining}s)`;

          const interval = setInterval(() => {
              remaining--;
              updateSkillButtonsFatigueState();
              if (remaining > 0) {
                  actionBtn.innerText = `(${remaining}s)`;
              } else {
                 clearInterval(interval);
                 skillsOn();
                 actionBtn.disabled = false;
                 opt.used = false;
                 div.classList.remove("used");
                 actionBtn.classList.add("hidden");
              }
          }, 1000);
      } else if (opt.enemyData.currentHp <= 0 || isRunestoneGuardian) {
          opt.used = true;
          div.classList.add("used");
      } else {
          actionBtn.disabled = false;
          div.classList.remove("used");
          actionBtn.onclick = (e) => {
              e.stopPropagation();
              slotClicked(i);
          };
      }
    div.appendChild(actionBtn);
}           
      

function renderOptions() {
  //console.log("renderuje sloty");
  const world = gameState.world;

  const step = world.locationSteps[world.currentStepIndex];
  const root = document.getElementById("explore-options");
  const resources = gameState.resources;

  let slotToKeep = null;
  if (world.inCombat && world.selectedSlotIndex !== null) {
    slotToKeep = document.querySelector(`.explore-slot[data-index="${world.selectedSlotIndex}"]`);
  }
    
  root.innerHTML = "";
    
  world.exploreOptions.forEach((opt, i) => {
     // jeśli jesteśmy w walce i to jest aktywny slot -> pomiń renderowanie
    if (world.inCombat && i === world.selectedSlotIndex && slotToKeep) {
     // console.log("wstawiam slot to keep");
      // wstawiamy ponownie istniejący slot bez nadpisywania
      root.appendChild(slotToKeep);
      
      //console.log(`enter slot centering in renderOptions`, slotToKeep);
      
      requestAnimationFrame(() => {
        const rect = slotToKeep.getBoundingClientRect();
        const centerX = window.innerWidth / 2;
        
        //const centerY = window.innerHeight / 2;
        //const centerY = window.scrollY + window.innerHeight / 2;
        const dx = centerX - (rect.left + rect.width / 2);
        //const dy = centerY - (rect.top + rect.height / 2);
  
        if(opt.enemyData.type !== `mini_boss`) {
          slotToKeep.style.transform = `translate(${dx + 105}px, 5%) scale(1.1)`;
        } else {
          slotToKeep.style.transform = `translate(${dx + 60}px, 5%) scale(1.1)`;
        }

           
      });
      
      return;
    }
    
    if(world.inCombat && !world.exploreOptions[world.selectedSlotIndex]?.isAttacked) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          slotToKeep.style.transform = "translate(0px, 0px) scale(1)";
        });
      });  
      //return;
    }
    
    const div = document.createElement("div");
    div.className = "explore-slot" +
      (opt.used ? " used" : "") +
      (world.inCombat && i !== world.selectedSlotIndex ? " disabled faded " : "");
    div.dataset.index = i;

    div.onclick = () => slotClicked(i);
    
     // Renderuj przeciwnika
    if ((opt.type === "enemy" || opt.type === `story_enemy`) && opt.enemyData) {
      
     // console.log(`enemy type in renderOptions`, opt.enemyData.type);
      //console.log(`currentLocation`, world.currentLocation);  
      // Obrazek
      const slotBg = document.createElement("img");
      
      const slotBgUrl = assetManager.getResolvedAsset(`img/backgrounds/${backgroundMap[world.currentLocation]}`);

      //slotBg.src = `${ASSET_BASE}img/backgrounds/forest-slot-bg.png`;
      //slotBg.src = `${ASSET_BASE}img/backgrounds/${backgroundMap[world.currentLocation] || "forest-slot-bg.png"}`;
      slotBg.src = slotBgUrl;
      slotBg.alt = `Tło`;  
      slotBg.className = `slot-bg`;   
      if(world.currentLocation === `Fort Lirwen`) {
        slotBg.style.marginTop = "-5px";
      } else {
        slotBg.style.marginTop = "15px";
      }        
      const shadow = document.createElement("div");
      shadow.className = "enemy-shadow";
        
      if(world.currentLocation === `Szeptane Drzewa`) {
        shadow.style.bottom = `23px`;
      }
      
      const enemySpriteUrl = assetManager.getResolvedAsset(`img/exploring-slots/` + opt.enemyData.sprite);

      const img = document.createElement("img");
      //img.src = `${ASSET_BASE}img/exploring-slots/` + opt.enemyData.sprite;
      img.src = enemySpriteUrl;
      img.alt = opt.enemyData.name;
      img.id = `enemy-slot-${i}`;
      img.className = "enemy-slot";
      img.style.width = "80px";
      img.style.height = "120px";
      /*img.style.display = "block";*/
      img.style.marginTop = "20px";
      //img.style.transform = "translateY(30px)";
      
      div.appendChild(slotBg);

      if(!opt.enemyData.isDead) {
        div.appendChild(shadow);
        div.appendChild(img);
      }
      
      if(opt.enemyData.beforeDeath) {
        const enemy = opt.enemyData;
        enemy.beforeDeath = false;
        enemy.isDead = true;
        deathAnimation(img); 
      }
      
      /*let enemyHp = opt.enemyData.currentHp;

      if(areAllEnemiesDefeated(step)) enemyHp = 0;
      
      console.log(`enemyHp`, enemyHp);*/
      
       // Pasek życia
      const healthPercent = (opt.enemyData.currentHp / opt.enemyData.maxHp) * 100;
      const healthBar = document.createElement("div");
      const currentHpText = Math.max(0, opt.enemyData.currentHp);
      healthBar.className = "enemy-health-bar";
      healthBar.id = `enemy-health-bar-${i}`;
      healthBar.style.left = "2px";
      healthBar.style.width = "92%";
      healthBar.innerHTML = `
        <div class="enemy-health-fill" style="width:${healthPercent}%;"></div>
        <div class="enemy-health-text">${formatNumber(currentHpText)}/${formatNumber(opt.enemyData.maxHp)}</div>
      `;
      div.appendChild(healthBar);
      
      const damageFloatContainer = document.createElement("div");
      damageFloatContainer.id = `enemy-damage-float-container-${i}`;
      
      div.appendChild(damageFloatContainer);
      
      const cooldownBar = document.createElement("div");
      cooldownBar.className = "enemy-cooldown-bar";
      cooldownBar.style.width = "95%";
      cooldownBar.style.left = "2.4px";
      cooldownBar.innerHTML = `
        <div class="enemy-cooldown-fill" id="enemy-cooldown-fill-${i}" ></div>
      `;
      
      const statusContainer = document.createElement("div");
      statusContainer.id = `enemy-status-container-${i}`;
      statusContainer.className = "enemy-status-container";
      div.appendChild(statusContainer);
 
      const windupBar = document.createElement("div");
      windupBar.id = `enemy-windup-bar-${i}`;
      windupBar.className = `enemy-windup-bar`;
      windupBar.innerHTML = `
        <div class="windup-fill" id="enemy-windup-fill-${i}" ></div>
      `;
      
      div.appendChild(windupBar);
      
      //console.log("render healthPercent", i, healthPercent);
        
      div.appendChild(cooldownBar);
        
      renderActionButtons(opt, div, i);
      
    } else if(opt.type === "chest" && opt.chestData){
      showNavigateButtons();   
      const slotBgUrl = assetManager.getResolvedAsset(`img/backgrounds/${backgroundMap[world.currentLocation]}`);

      const slotBg = document.createElement("img");
      //slotBg.src = `${ASSET_BASE}img/backgrounds/${backgroundMap[world.currentLocation] || "forest-slot-bg.png"}`;
      slotBg.src = slotBgUrl;
      slotBg.alt = `Tło`;  
      slotBg.className = `slot-chest-bg`;   
      if(world.currentLocation === `Fort Lirwen`) {
        slotBg.style.marginTop = "-5px";
      } else {
        slotBg.style.marginTop = "0px";
      }        
      const shadow = document.createElement("div");
      shadow.className = "enemy-shadow";
      shadow.style.width = `50%`;
      shadow.style.bottom = `20px`;
      
      div.appendChild(slotBg);
      div.appendChild(shadow);
      
      if (resources.firecampState.active) {
          const bar = document.createElement("div");
          bar.className = "campfire-bar";

          const fill = document.createElement("div");
          fill.className = "campfire-bar-fill";
          bar.appendChild(fill);

          div.appendChild(bar);
          updateCampfireBar(fill);
          hideNavigateButtons();
      }
      const firecampPath = `img/exploring-slots/${
                              resources.firecampState.active
                              ? "campfire.png"
                              : opt.chestData.sprite
                            }`;
      const firecampUrl = assetManager.getResolvedAsset(firecampPath);

      const img = document.createElement("img");
        //img.src = `${ASSET_BASE}img/exploring-slots/` + opt.chestData.sprite;
        /*img.src = `${ASSET_BASE}img/exploring-slots/${
          resources.firecampState.active
          ? "campfire.png"
          : opt.chestData.sprite
        }`;*/
        img.src = firecampUrl;
        if(opt.firecampUsed) {
          //img.src = `${ASSET_BASE}img/exploring-slots/campfire-off.png`;
          img.src = assetManager.getResolvedAsset(`img/exploring-slots/campfire-off.png`);
        }
        img.alt = opt.chestData.name;
        img.className = `enemy-slot`;
        img.id = `enemy-slot-${i}`;
        img.style.width = "80px";
        img.style.height = "150px";
        img.style.display = "block";
        img.style.margin = "0 auto";
        div.appendChild(img);
        
    } else if (opt.type === "shrine" && opt.shrineData){
        showNavigateButtons();
        const slotBgUrl = assetManager.getResolvedAsset(`img/backgrounds/${backgroundMap[world.currentLocation]}`);

        const slotBg = document.createElement("img");
        //slotBg.src = `${ASSET_BASE}img/backgrounds/${backgroundMap[world.currentLocation] || "forest-slot-bg.png"}`;
        slotBg.src = slotBgUrl;
        slotBg.alt = `Tło`;  
        slotBg.className = `slot-chest-bg`;   
        if(world.currentLocation === `Fort Lirwen`) {
          slotBg.style.marginTop = "-5px";
        } else {
          slotBg.style.marginTop = "0px";
        }        
        const shadow = document.createElement("div");
        shadow.className = "enemy-shadow";
        shadow.style.width = `50%`;
        shadow.style.bottom = `20px`;
      
        div.appendChild(slotBg);
        div.appendChild(shadow);
      
        if (resources.firecampState.active) {
          const bar = document.createElement("div");
          bar.className = "campfire-bar";

          const fill = document.createElement("div");
          fill.className = "campfire-bar-fill";
          bar.appendChild(fill);

          div.appendChild(bar);
          updateCampfireBar(fill);
          hideNavigateButtons();
        }
      
       // console.warn(`firecampState.active`, resources.firecampState.active);
        const firecampPath = `img/exploring-slots/${
                              resources.firecampState.active
                              ? "campfire.png"
                              : opt.shrineData.sprite
                            }`;
        const firecampUrl = assetManager.getResolvedAsset(firecampPath);

      
        const img = document.createElement("img");
        //img.src = `${ASSET_BASE}img/exploring-slots/` + opt.shrineData.sprite;
       /* img.src = `${ASSET_BASE}img/exploring-slots/${
          resources.firecampState.active
          ? "campfire.png"
          : opt.shrineData.sprite
        }`;*/
        img.src = firecampUrl;
        if(opt.firecampUsed) {
          //img.src = `${ASSET_BASE}img/exploring-slots/campfire-off.png`;
          img.src = assetManager.getResolvedAsset(`img/exploring-slots/campfire-off.png`);
        }
        img.alt = opt.shrineData.name;
        img.className = "enemy-slot";
        img.id = `enemy-slot-${i}`;
        img.style.width = "80px";
        img.style.height = "150px";
        img.style.display = "block";
        img.style.margin = "0 auto";
        div.appendChild(img);
      
    }  else if (opt.type === "story_event" && opt.storyEvent){
        const storyEventUrl = assetManager.getResolvedAsset(`img/exploring-slots/` + opt.storyEvent.sprite);

        const img = document.createElement("img");
        //img.src = `${ASSET_BASE}img/exploring-slots/` + opt.storyEvent.sprite;
        img.src = storyEventUrl;
        img.alt = opt.storyEvent.id;
        img.className = "enemy-slot";
        img.id = opt.storyEvent.id;
      if(opt.storyEvent.boss) {
          img.style.width = "320px";
          img.style.height = "150px";
        } else if (opt.storyEvent.miniboss){
          img.style.width = "180px";
          img.style.height = "135px";
          document.querySelector(`.slot-row`).style.alignItems = `center`;
          document.querySelector(`.slot-row`).style.justifyContent = `center`;
          div.style.width = "200px";
        } else {
          img.style.width = "80px";
          img.style.height = "147px";
        }
        img.style.display = "block";
        img.style.margin = "0 auto";
        div.appendChild(img);
    } else if ((opt.type === "mini_boss" || opt.type === `elite`) && opt.enemyData) {
     // console.warn("MINIBOSS");
      const slotBg = document.createElement("img");
      if (world.mode === "story") {
       // console.log("MINIBOSS sprite bg", opt.storyEvent.sprite);
        const storyEventUrl = assetManager.getResolvedAsset(`img/exploring-slots/` + opt.storyEvent.sprite);

        //slotBg.src = `${ASSET_BASE}img/exploring-slots/` + opt.storyEvent.sprite;
        slotBg.src = storyEventUrl;
        slotBg.alt = `Tło`;
        slotBg.className = "slot-bg";
        slotBg.style.width = "180px";
        slotBg.style.height = "120px";
      } else {
        const slotBgUrl = assetManager.getResolvedAsset(`img/backgrounds/${backgroundMap[world.currentLocation]}`);
        //slotBg.src = `${ASSET_BASE}img/backgrounds/${backgroundMap[world.currentLocation] || "forest-slot-bg.png"}`;
        slotBg.src = slotBgUrl;
        slotBg.alt = `Tło`;  
        slotBg.className = `slot-chest-bg`;   
        if(world.currentLocation === `Fort Lirwen`) {
          slotBg.style.marginTop = "-5px";
        } else {
          slotBg.style.marginTop = "0px";
        }
      }
      
      const shadow = document.createElement("div");
      shadow.className = "miniboss-shadow";
      
      const enemySpriteUrl = assetManager.getResolvedAsset(`img/exploring-slots/` + opt.enemyData.sprite);

      const img = document.createElement("img");
      //img.src = `${ASSET_BASE}img/exploring-slots/` + opt.enemyData.sprite;
      img.src = enemySpriteUrl;
      img.alt = opt.enemyData.name;
      img.className = "enemy-slot";
      img.id = `enemy-slot-${i}`;
      img.style.width = "180px";
      img.style.height = "120px";
    
      document.querySelector(`.slot-row`).style.alignItems = `center`;
      document.querySelector(`.slot-row`).style.justifyContent = `center`;
      div.style.width = "180px";
    
      if(opt.enemyData.beforeDeath) {
        const enemy = opt.enemyData;
        enemy.beforeDeath = false;
        enemy.isDead = true;
        deathAnimation(img); 
      }
      
      div.appendChild(slotBg);
      div.appendChild(shadow);
      div.appendChild(img);

      // Pasek życia
      const healthPercent = (opt.enemyData.currentHp / opt.enemyData.maxHp) * 100;
      const healthBar = document.createElement("div");
      const currentHpText = Math.max(0, opt.enemyData.currentHp);
      healthBar.className = "enemy-health-bar";
      healthBar.style.height = "16px";
      healthBar.style.left = "0px";
      healthBar.style.width= "98%";
      /*healthBar.innerHTML = `
        <div class="enemy-health-fill" style="width:${healthPercent}%;"></div>
        <div class="enemy-health-text">${formatNumber(currentHpText)}/${formatNumber(opt.enemyData.maxHp)}</div>
      `;*/
      healthBar.innerHTML = `
        <div class="enemy-health-fill" style="transform:scaleX(${healthPercent / 100});"></div>
        <div class="enemy-health-text">${formatNumber(currentHpText)}/${formatNumber(opt.enemyData.maxHp)}</div>
      `;
      div.appendChild(healthBar);
      
      const damageFloatContainer = document.createElement("div");
      damageFloatContainer.id = `enemy-damage-float-container-${i}`;
      
      div.appendChild(damageFloatContainer);
      
      const statusContainer = document.createElement("div");
      statusContainer.id = `enemy-status-container-${i}`;
      statusContainer.className = "enemy-status-container";
      
      div.appendChild(statusContainer);
      
      const cooldownBar = document.createElement("div");
      cooldownBar.className = "enemy-cooldown-bar";
      cooldownBar.style.height = "16px";
      cooldownBar.style.left = "-1px";
      cooldownBar.style.width= "100%";
      cooldownBar.innerHTML = `
        <div class="enemy-cooldown-fill" id="enemy-cooldown-fill-${i}" ></div>
      `;
      
      const windupBar = document.createElement("div");
      windupBar.id = `enemy-windup-bar-${i}`;
      windupBar.className = `enemy-windup-bar`;
      windupBar.innerHTML = `
        <div class="windup-fill" id="enemy-windup-fill-${i}" ></div>
      `;
      
      div.appendChild(windupBar);
    
      div.appendChild(cooldownBar);
        
      renderActionButtons(opt, div, i);
        
    } else if (opt.type === "boss" && opt.enemyData) {
      const enemySpriteUrl = assetManager.getResolvedAsset(`img/exploring-slots/` + opt.enemyData.sprite);

      const img = document.createElement("img");
      //img.src = `${ASSET_BASE}img/exploring-slots/` + opt.enemyData.sprite;
      img.src = enemySpriteUrl;
      img.alt = opt.enemyData.name;
      img.id = `enemy-slot-${i}`;
      img.className = "enemy-slot boss-img";
      img.style.width = "320px";//320
      img.style.height = "130px";
      
      div.appendChild(img);
      
      const healthPercent = (opt.enemyData.currentHp / opt.enemyData.maxHp) * 100;
      const currentHpText = Math.max(0, opt.enemyData.currentHp);
      const healthBar = document.createElement("div");
      healthBar.className = "enemy-health-bar boss-health-bar";
      healthBar.style.left = "7px";
      healthBar.innerHTML = `
        <div class="enemy-health-fill" style="width:${healthPercent}%;"></div>
        <div class="enemy-health-text">${formatNumber(currentHpText)}/${formatNumber(opt.enemyData.maxHp)}</div>
      `;
      div.appendChild(healthBar);
 
      const damageFloatContainer = document.createElement("div");
      damageFloatContainer.id = `enemy-damage-float-container-${i}`;
      
      div.appendChild(damageFloatContainer);
      
      const statusContainer = document.createElement("div");
      statusContainer.id = `enemy-status-container-${i}`;
      statusContainer.className = "enemy-status-container";
  
      div.appendChild(statusContainer);
      
      const cooldownBar = document.createElement("div");
      cooldownBar.className = "enemy-cooldown-bar";
      cooldownBar.style.height = "15px";
      cooldownBar.style.bottom = "4px";
      cooldownBar.style.left = "10px";
      cooldownBar.style.width= "94%";
      cooldownBar.innerHTML = `
        <div class="enemy-cooldown-fill" id="enemy-cooldown-fill-${i}" ></div>
      `;
      div.appendChild(cooldownBar);
        
      renderActionButtons(opt, div, i);
        
    } else if (opt.type === "npc" && opt.npcData) {
      const npc = opt.npcData;
      const quest = QUEST_DATA[npc.questId];
      const npcSpriteUrl = assetManager.getResolvedAsset(`img/exploring-slots/${npc.sprite}`);
      const img = document.createElement("img");
      //img.src = `${ASSET_BASE}img/exploring-slots/${npc.sprite}`;
      img.src = npcSpriteUrl;
      img.alt = npc.name;
      img.className = "npc-slot";
      img.style.width = "80px";
      img.style.height = "120px";
      //img.style.marginTop = "10px";
      //img.style.transform = "translateY(10px)"
        
      const nameplate = document.createElement("div");
      nameplate.className = "npc-nameplate legendary";
             
      // Rozdziel imię i tytuł, jeśli są dwa słowa
      const parts = t(npc.name).split(" ");
      if (parts.length >= 2) {
        nameplate.innerHTML = `${parts[0]}<br>${parts.slice(1).join(" ")}`;
      } else {
        // jedno słowo — wyśrodkuj w dwóch liniach
        nameplate.innerHTML = `${parts[0]}<br>&nbsp;`;
      }
        
      div.appendChild(img);
      div.appendChild(nameplate);

      img.dataset.type = "npc";
      img.dataset.npcId = npc.id;
      
      // Po kliknięciu NPC otwiera okno dialogowe
      /*img.addEventListener("click", () => {
        openNpcDialog(npc, quest);
      });*/
        
    } else {
      // Inne typy
      const title = document.createElement("div");
      title.innerText = opt.type;
      div.appendChild(title);
    }
      
      // Ramka jako osobny element nad slotem
    const frame = document.createElement("img");
    frame.alt = "slot frame";
    frame.className = "slot-frame";
    if (opt.type === "boss") {
      const bossFrameUrl = assetManager.getResolvedAsset(`img/frames/explore-boss-frame2.png`);
   
      //frame.src =`${ASSET_BASE}img/frames/explore-boss-frame2.png`;
      frame.src = bossFrameUrl;
      frame.style.width = "345px";
      frame.style.height = "565px";
      //frame.style.left = "-2px";
      //frame.style.top = "0px";
      //frame.style.transform = "rotate(90deg) translateY(-40px)";
      frame.style.transform = "translateY(25px)";
    } else if (opt.type === "mini_boss") {
      const minibossFrameUrl = assetManager.getResolvedAsset(`img/frames/explore-miniboss-frame2.png`);
   
      //frame.src =`${ASSET_BASE}img/frames/explore-miniboss-frame2.png`;
      frame.src = minibossFrameUrl;
      frame.style.height = "185px";
      frame.style.width = "255px"; // dostosować do grafiki
      //frame.style.top = "-18px";
      //frame.style.left = "-28px";
      frame.style.filter = "brightness(1.1) contrast(1.0)";
      //frame.style.transform = "translateY(-30px)";
      //frame.style.transform = "rotate(90deg)";
        
    } else if (opt?.enemyData?.type === `elite`) {
      const eliteFrameUrl = assetManager.getResolvedAsset(`img/frames/explore-elite-frame.png`);
   
      //frame.src =`${ASSET_BASE}img/frames/explore-elite-frame.png`;
      frame.src = eliteFrameUrl;
      frame.id = `slot-frame-${i}`;
      frame.style.height = "185px";
      frame.style.width = "100px"; // dostosować do grafiki
      frame.style.transform = "translate(calc(-50% + 1px), -50%)";
      //frame.style.top = "-18px";
      //frame.style.left = "-7.5px";
      frame.style.filter = "brightness(1.5) contrast(0.9)";
    } else if (opt.type === "chest"){ 
      const chestFrameUrl = assetManager.getResolvedAsset(`img/frames/explore-chest-frame.png`);
   
      //frame.src =`${ASSET_BASE}img/frames/explore-chest-frame.png`;
      frame.src = chestFrameUrl;
      frame.style.height = "190px";
      frame.style.width = "103px"; // dostosować do grafiki
      frame.style.transform = "translate(-50%, calc(-50% - 3px))";
      //frame.style.top = "-24px";
      //frame.style.left = "-8px";
        
    } else if (opt.type === "shrine"){ 
      const shrineFrameUrl = assetManager.getResolvedAsset(`img/frames/explore-shrine-frame.png`);
   
      //frame.src =`${ASSET_BASE}img/frames/explore-shrine-frame.png`;
      frame.src = shrineFrameUrl;
      frame.style.height = "189px";
      frame.style.width = "106px"; // dostosować do grafiki
      //frame.style.top = "-20px";
      //frame.style.left = "-9px";
    } else if (opt.type === "npc" || opt.type === "story_event"){ 
      if(opt.storyEvent?.boss) {
       //  console.log(`story event boss frame`);
         const bossFrameUrl = assetManager.getResolvedAsset(`img/frames/explore-boss-frame2.png`);
  
         //frame.src =`${ASSET_BASE}img/frames/explore-boss-frame2.png`;
         frame.src = bossFrameUrl;
         frame.style.width = "345px";
         frame.style.height = "565px";
        // frame.style.left = "-2px";
         frame.style.transform = "translateY(25px)";
      } else if(opt.storyEvent?.miniboss) {
         //console.log(`story event miniboss frame`);
         const minibossFrameUrl = assetManager.getResolvedAsset(`img/frames/explore-miniboss-frame2.png`);
  
         //frame.src =`${ASSET_BASE}img/frames/explore-miniboss-frame2.png`;
         frame.src = minibossFrameUrl;
         frame.style.height = "185px";
         frame.style.width = "255px"; // dostosować do grafiki
         //frame.style.top = "-18px";
         //frame.style.left = "-28px";
         frame.style.filter = "brightness(1.1) contrast(1.0)";
         /*frame.style.transform = "translateY(-30px)";*/
        //frame.style.transform = "rotate(90deg)";
      } else if(opt.type === "story_event"){
         const otherFrameUrl = assetManager.getResolvedAsset(`img/frames/other-frame.png`);
  
         //frame.src =`${ASSET_BASE}img/frames/other-frame.png`;
         frame.src = otherFrameUrl;
         frame.style.width = "102px";
         frame.style.height = "192px";
         frame.style.transform = "translate(-50%, calc(-50% - 1px))";
         //frame.style.top = "-22px";
         //frame.style.left = "-7px";
         //frame.style.transform = "rotate(90deg)";
      } else {
         const otherFrameUrl = assetManager.getResolvedAsset(`img/frames/other-frame.png`);
  
         //frame.src =`${ASSET_BASE}img/frames/other-frame.png`;
         frame.src = otherFrameUrl;
         frame.style.width = "102px";
         frame.style.height = "190px";
         //frame.style.top = "-22px";
         //frame.style.left = "-7px";
         //frame.style.transform = "rotate(90deg)";
      }
    } else { 
      const normalFrameUrl = assetManager.getResolvedAsset(`img/frames/explore-normal-frame.png`);
  
      //frame.src =`${ASSET_BASE}img/frames/explore-normal-frame.png`;
      frame.src = normalFrameUrl;
      frame.id = `slot-frame-${i}`;
      frame.style.height = "223px";
      frame.style.width = "110px"; // dostosować do grafiki
      frame.style.transform = "translate(-50%, calc(-50% + 12px))";  
      //frame.style.top = "-25px";
      //frame.style.left = "-11px";
      frame.style.filter = "brightness(1.7) contrast(1.0)";
        
        //console.log("ramka sie dodaje");
      //frame.style.transform = "rotate(180deg)";
    }
    
    // Składamy slot
    div.appendChild(frame);
    
    root.appendChild(div);
  });
  
  isExploring = true;
  startEnemyUiRegenTick();
}


// ——— SLOT CLICK ———

function slotClicked(i) {
  //console.log("slot clicked", i);
  const world = gameState.world;

  if(gameState.resources.firecampState.active) return;
  
  if(world.inCombat) return;
    
  const opt = world.exploreOptions[i];
  const slots = document.querySelectorAll(".explore-slot");
  const slot = slots[i];
  const enemy = world.exploreOptions[i].enemyData;
    
  for (let s = 0; s <= 3; s++) {
         
    const enemySlot = document.querySelector(`.explore-slot[data-index='${s}']`);
      
      if (enemySlot) {
      enemySlot.classList.remove(
        "enemy-glow-normal",
        "enemy-glow-chest",
        "enemy-glow-shrine",
        "enemy-glow-miniboss",
        "enemy-glow-boss",
        "enemy-glow-elite",
        "enemy-glow-npc"
      );
    }
  }
    
const enemySlot = document.querySelector(`.explore-slot[data-index='${i}']`);
    
if (enemySlot) {
  switch (opt.type) {
    case "enemy":
    case `story_enemy`:
      enemySlot.classList.add("enemy-glow", "enemy-glow-normal");
      break;
    case "chest":
      enemySlot.classList.add("enemy-glow", "enemy-glow-chest");
      break;
    case "shrine":
      enemySlot.classList.add("enemy-glow", "enemy-glow-shrine");
      break;
    case "mini_boss":
      enemySlot.classList.add("enemy-glow", "enemy-glow-miniboss");
      break;
    case "boss":
      enemySlot.classList.add("enemy-glow", "enemy-glow-boss");
      break;
    case "npc":
      enemySlot.classList.add("enemy-glow", "enemy-glow-npc");
      break;
  }
  
  if(opt?.enemyData?.type === "elite") {
    enemySlot.classList.add("enemy-glow", "enemy-glow-elite");
  }
  
}
    
  // Usuń poprzednie przyciski
 /* slots.forEach(slot => {
    const existing = slot.querySelector(".slot-button-container");
    if (existing) existing.remove();
    slot.addEventListener("mousedown", () => slot.blur());
    slot.addEventListener("touchstart", () => slot.blur());
  });*/
    
  // Tworzymy kontener przycisków
  const btnContainer = document.createElement("div");
  btnContainer.className = "slot-button-container";
   
  //console.log("slotCliked i: ", i);
     
  const lootBtn = document.createElement("button");
    
  if (world.inCombat && i !== world.selectedSlotIndex) return;
  //console.log("sprawdzam combat", i);

  if (opt.used && (!opt.enemyData || world.selectedSlotIndex !== i)) return;
  //console.log("sprawdzam opt", i);
    
  world.selectedSlotIndex = i;
  renderCombat();
    
  const attackBtn = document.getElementById(`slot-attack-button-${i}`);
  const fleeBtn = document.getElementById(`slot-flee-button-${i}`);

  // Wznowienie przerwanej walki
  /*const slotInfo = document.getElementById("slot-name");
  slotInfo.style.color = "white";*/
    
  if (opt.type === "enemy" || opt.type === "mini_boss" || opt.type === "boss" || opt.type === `story_enemy` || opt.type === `elite`) {
     //slotInfo.classList.remove("hidden");
     //slotInfo.textContent = `${opt.enemyData.name} (Poziom ${opt.enemyData.level})  `;
     
     playSound("open-slot", 0.4);
    
     const reengageBtn = document.getElementById(`reengage-btn-${i}`); 
     const startIcon = document.createElement("img");
     reengageBtn.classList.add("hidden");
      
     attackBtn.classList.remove("hidden");
    
     debuffStatsPreview(opt.type, i);
    
     const startIconUrl = assetManager.getResolvedAsset(`img/buttons/start-battle-icon.png`);
  
     startIcon.className = "start-attack-icon";
     startIcon.id = `action-btn-icon`;
     //startIcon.src = `${ASSET_BASE}img/buttons/start-battle-icon.png`;
     startIcon.src = startIconUrl;
     attackBtn.onclick = (e) => { e.stopPropagation(); startCombat(i); };
     attackBtn.appendChild(startIcon);
            
    lootBtn.className = "slot-button";
    lootBtn.id = `slot-loot-button-${i}`;
    lootBtn.innerText = "📦";
    lootBtn.classList.add("hidden");
    lootBtn.onclick = (e) => { e.stopPropagation(); openLoot(i); };
    btnContainer.appendChild(lootBtn);
      
     } else if (opt.type === "shrine" && !opt.used) {
      //slotInfo.classList.remove("hidden");
      //slotInfo.textContent = `Kapliczka życia`;
       
      playSound("open-slot", 0.4);

      const prayBtn = document.getElementById(`slot-attack-button-${i}`); 
      prayBtn.className = "slot-button";
      prayBtn.onclick = (e) => { e.stopPropagation(); useShrine(i); };
    
     const shrineIcon = document.createElement("img");
     prayBtn.classList.remove("hidden");

     const shrineIconUrl = assetManager.getResolvedAsset(`img/buttons/use-shrine-icon.png`);
  
     shrineIcon.className = "use-shrine-icon";
     //shrineIcon.src = `${ASSET_BASE}img/buttons/use-shrine-icon.png`;
     shrineIcon.src = shrineIconUrl;
     prayBtn.appendChild(shrineIcon);
         
     } else if (opt.type === "chest") {
      //slotInfo.classList.remove("hidden");
      //slotInfo.textContent = `Skrzynia ze skarbem`;
  
      playSound("open-slot", 0.4);
       
      const openBtn = document.getElementById(`slot-attack-button-${i}`); 
      openBtn.className = "slot-button";
      openBtn.onclick = (e) => { e.stopPropagation(); openChest(i); };
      
     const chestIcon = document.createElement("img");
     openBtn.classList.remove("hidden");
       
     const chestIconUrl = assetManager.getResolvedAsset(`img/buttons/open-chest-icon.png`);
  
     chestIcon.className = "open-chest-icon";
     //chestIcon.src = `${ASSET_BASE}img/buttons/open-chest-icon.png`;
     chestIcon.src = chestIconUrl;
     openBtn.appendChild(chestIcon);
       
     } else if(opt.type === `story_event`){
       
       const quest = QUEST_DATA[opt.storyEvent.id];
       //console.log(`opt.storyEvent.id`, opt.storyEvent.id);
          
       if (quest) {
         openStoryEventDialog(quest);
         playSound("open-slot", 0.4);
       }
       
     } 
    
  slot.appendChild(btnContainer);

}


// ——— UTILS ———

function focusOnDialogBox(){
  document.getElementById("dialog-box").scrollIntoView({ behavior: "smooth" });
}

function focusOnAttackDialogBox(){
  document.getElementById("attack-dialog-box").scrollIntoView({ behavior: "smooth" });
  //console.log(`focus on dlg`);
  //const container = document.getElementById("attack-dialog-box");
  //smoothScrollToElement(container);
}

function showLootBtn() {
  document.getElementById("loot-btn").classList.remove("hidden");
}

function hideLootBtn() {
  document.getElementById("loot-btn").classList.add("hidden");
}

function smoothScrollToElement(element, duration = 1000) {
  const container = document.getElementById("battle-view");
 // console.log(`focus on dlg`);
   
  const start = window.scrollY;
  const target =
    element.getBoundingClientRect().top + window.scrollY;

  const distance = target - start;
  const startTime = performance.now();

  function animate(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // easeInOut
    const eased =
      progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    window.scrollTo(
      0,
      start + distance * eased
    );
   
    //console.log(`focus on dlg`, start, progress, distance);

  //  console.log(`scrollTop`, document.getElementById("battle-view").scrollTop);
    
    /*console.log(`scrollHeight vs clientHeight`,
      document.getElementById("battle-view").scrollHeight,
      document.getElementById("battle-view").clientHeight
    );*/
    
   /* document.querySelectorAll("*")
  .forEach(el => {
    if (el.scrollHeight > el.clientHeight) {
      console.log(el);
    }
  });*/
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
}

/*function focusOnAttackDialogBox() {
  const el = document.getElementById("attack-dialog-box");

  if (!el) return;

  smoothScrollToElement(el, 1500); // 1.5 sekundy
}*/

function focusOnSlots(){
  const target = document.getElementById("explore-options");
  target.scrollIntoView({ behavior: "smooth", block: "start" });
  window.scrollBy({ top: -180, behavior: "smooth" });

}

function closeChest() {
  focusOnSlots();
 }

function hideDialog(){
    //document.getElementById("slot-name").classList.add("hidden");
    const dlg = document.getElementById("dialog-box");
}

function hideEnemyDialog() {
  const dlg = document.getElementById("attack-dialog-box");
    const dlgFrame = document.getElementById("attack-dialog-box-frame");
    
  dlg.classList.remove('opacity-100');
  dlg.classList.add('opacity-0');
  dlgFrame.classList.remove('opacity-100');
  dlgFrame.classList.add('opacity-0');
 
  setTimeout(() => {
    dlg.classList.add('hidden');
    dlg.style.display = 'none';
    dlgFrame.classList.add("hidden");
    dlgFrame.style.display = 'none';
  }, 400); // Czas musi być zgodny z transition-opacity
  
}

function smoothFade(context){
  context.classList.add("fade-out");
  setTimeout(() => {
      context.classList.add("hidden");
      context.classList.remove("fade-out");
      context.innerHTML = "";
    }, 400);
}

function clearDialog(){
  document.getElementById("dialog-box").innerHTML = "";
}


function lockOtherActions(activeIndex) {
  document.getElementById("next-btn").disabled = true;
  document.querySelectorAll(".explore-slot").forEach((el, i) => {
    if (i === activeIndex) {
      el.style.pointerEvents = "auto"; // aktywny slot pozostaje klikalny
    } else {
      el.style.pointerEvents = "none"; // pozostałe wyłączone
    }
  });
}


function unlockActions() {
  document.getElementById("next-btn").disabled = false;
  document.querySelectorAll(".explore-slot").forEach(el=>el.style.pointerEvents="auto");
}

function showNavigateButtons() {
  const prev = document.getElementById("prev-btn");
  const next = document.getElementById("next-btn");
  
  if(!prev && !next) return;
  
  prev.classList.remove("hidden");
  next.classList.remove("hidden");
}

function hideNavigateButtons() {
  const prev = document.getElementById("prev-btn");
  const next = document.getElementById("next-btn");
  prev.classList.add("hidden");
  next.classList.add("hidden");
}

function hideGoBackButton() {
  const prev = document.getElementById("prev-btn");
  prev.classList.add("hidden");
}

function showEnemyMessage(msg){
  const dlg = document.getElementById("attack-dialog-box");
  dlg.innerText = msg;
}

function showEnemyDialogBox() {
  const enemyDlg = document.querySelector('#attack-dialog-box');
  const dlgFrame = document.getElementById("attack-dialog-box-frame");
  
  renderCombat();
  enemyDlg.style.display = 'block';
  enemyDlg.classList.add('opacity-100');
  enemyDlg.classList.remove('opacity-0');
}

/*window.onload = function () {
    console.log(`battle.js load`);
    document.querySelectorAll("[data-src]").forEach(img => {
         img.src = `${ASSET_BASE}${img.getAttribute("data-src")}`;
      });
  
    startUiTick();
  
    preloadSounds();
  
   
  const shouldGenerate = gameState.world.generateNewLevelOnLoad;
  if (shouldGenerate === "1") {
    //console.log("current location before load new level", world.currentLocation);
    updateLocationName();
    //console.log("current location after updateLocationName new level", world.currentLocation);
    generateLocation();
    loadFirstStep();
    renderOptions();
    highlightCurrentStep();
    gameState.world.generateNewLevelOnLoad = `0`;
    saveGame();
  }
  
  window.addEventListener("enemy-attack-windup", e => {
    const { enemy, slotIndex, duration } = e.detail;
    //console.error(`slotIndex wind up`, enemy, slotIndex, duration);
    const slot = document.getElementById(`enemy-slot-${slotIndex}`);
    slot.classList.add("windup");

    if(combat.flags.isCritical) {
      showOutcome(`miss`, `STAN KRYTYCZNY`);
    } else {
      showOutcome("wind-up", "ZAMACH", duration);
    }
    
    setTimeout(() => {
      slot.classList.remove("windup");
    }, duration);
  });
  
  const player = getPlayerStats();
  combat.playerBlock.mode = player.blockMode;
  //console.log(`player.blockMode`, player.blockMode);
  
  document.addEventListener('click', function (e) {
       const attackButton = e.target.closest('#attack-button');
       if (attackButton) {
         if (!world.inCombat) {
           console.log("Walka zakończona – przycisk nie działa");
           return;
         }
         if (typeof handleAttack === 'function') {
           handleAttack();
         } else {
           console.warn("handleAttack nie jest funkcją");
         }
       }
    });
    
  
    document.addEventListener('click', function (e) {
      const shieldButton = e.target.closest('#attack-left');

      if (!shieldButton) return;

      if (!world.inCombat) {
        console.log("Poza walką – tarcza nieaktywna");
        return;
      }

      if (!playerHasShieldEquipped()) {
        console.log("Brak tarczy w lewej ręce");
        return;
      } 

      handleShieldAction();
    });
    
    checkIfGameIsSaved(); // sprawdź czy jest save
  
};*/