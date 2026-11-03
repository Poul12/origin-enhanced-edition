

// ===============================
// 🔸 Nazwy poziomów dla regionu RIVENFELL
// ===============================
/*const locationsByRegion = {
  west: [
    "Port Elmaris",
    "Osada Thalorn",
    "Trakt Żniwiarzy",
    "Fort Lirwen",
    "Zielony Przesmyk",
    "Szeptane Drzewa",
  ]
};*/

const locationsByRegion = {
  west: [
    "elmaris_port",
    "thalorn_village",
    "reapers_road",
    /*"lirwen_fort",
    "green_pass",
    "whispering_trees",*/
  ]
};


    /*"Fort Lirwen",
    "Zielony Przesmyk",
    "Szeptane Drzewa",
    "Wioska Mallen",
    "Równina Tareth",
    "Wodospady Erynn",
    "Las Eldenmor",
    "Świątynia Faleen",
    "Kamienna Polana",
    "Latarnia Na Końcu Świata",
    "Szlak Północnych Grani",
    "Jaskinie Eryndal",
    "Kamienna Strażnica",
    "Szczyt Wichrów",
    "Lodowy Grzbiet",
    "Źródła Riven",
    "Srebrne Łąki",
    "Most Runiczny",
    "Zatopione Ruiny",
    "Plaża Run",
    "Wioska Wierzbowych Brzegów",
    "Zatoka Tysiąca Kamieni",
    "Przylądek Morskiego Wiatru"*/



// dynamiczne tło na podstawie lokacji
const backgroundMap = {
  "elmaris_port": "forest-slot-bg.png",
  "thalorn_village": "thalorn-slot-bg.png",
  "reapers_road": "reapers-slot-bg.png",
  "lirwen_fort": "lirwen-slot-bg.png",
  "green_pass": "greenpass-slot-bg.png",
  "whispering_trees": "whispering-trees-slot-bg.png"
};


// Tablica obrazów przypisana do indeksów poziomów
const locationImages = [
  "img/loadings/elmaris-port-loading.png",
  "img/loadings/thalorn-village-loading.png",
  "img/loadings/reapers-road-loading.png",
  "img/loadings/lirwen-castle-loading.png",
  "img/loadings/green-pass-loading.png",
  "img/loadings/whispering-trees-loading.png",
  "img/loadings/wioska_mallen.jpg",
  "img/loadings/rownina_tareth.jpg",
  "img/loadings/wodospady_erynn.jpg",
  "img/loadings/las_eldenmor.jpg",
  "img/loadings/swiatynia_faleen.jpg",
  "img/loadings/kamienna_polana.jpg",
  "img/loadings/latarnia_na_koncu_swiata.jpg",
  "img/loadings/szlak_polnocnych_grani.jpg",
  "img/loadings/jaskinie_eryndal.jpg",
  "img/loadings/kamienna_straznica.jpg",
  "img/loadings/szczyt_wichrow.jpg",
  "img/loadings/lodowy_grzbiet.jpg",
  "img/loadings/zrodla_riven.jpg",
  "img/loadings/srebrne_laki.jpg",
  "img/loadings/most_runiczny.jpg",
  "img/loadings/zatopione_ruiny.jpg",
  "img/loadings/plaza_run.jpg",
  "img/loadings/wioska_wierzbowych_brzegow.jpg",
  "img/loadings/zatoka_tysiaca_kamieni.jpg",
  "img/loadings/przyladek_morskiego_wiatru.jpg"
];


// ===============================
// 🔸 Aktualizacja tytułu lokacji
// ===============================
/*function updateLocationName() {
  const world = gameState.world;

  const locationName = document.getElementById("ribbonText");
  
  if(!locationName) return;
  
  console.log(`current level in location name`, world.currentLevel);
  
  const region = selectedRegion?.id?.toLowerCase() || "west";
  const locationList = locationsByRegion[region];
  
  let name = "Nieznana lokacja";
  
  if (locationList && world.currentLevel >= 1 && world.currentLevel <= locationList.length) {
    name = locationList[world.currentLevel - 1];
    world.currentLocation = name;
  }

  console.log(`currentLocation in location name`, world.currentLocation);

  locationName.textContent = `${name}`;
  
  saveGame();
}*/

function updateLocationName() {
  const world = gameState.world;
  const locationNameEl = document.getElementById("ribbonText");

  if (!locationNameEl) return;

  //const region = selectedRegion?.id?.toLowerCase() || "west";
  const region = world.selectedRegionId || selectedRegion?.id?.toLowerCase() || "west";
  const locationList = locationsByRegion[region];

  let level = gameState.expedition.modes[gameState.world.expeditionMode].run.level;
  
  let name = "Nieznana lokacja";

  // -------------------------
  // TRYB EKSPLORACJI / STORY
  // -------------------------
  if (world.mode !== "expedition" && world.mode !== "sandbox" && world.mode !== "adventure") {
    //console.log("Update Location world.currentLevel:", world.currentLevel);
    if (locationList && world.currentLevel >= 1 && world.currentLevel <= locationList.length) {
      name = locationList[world.currentLevel - 1];
      world.currentLocation = name;
      level = world.currentLevel;
    }
  }
  // -------------------------
  // TRYB SWOBODNY
  // -------------------------
  else if (world.mode === "sandbox" || world.mode === "adventure") {
     const index = (world.sandboxLevel - 1) % locationList.length;
     name = locationList[index];
     world.currentLocation = name;
     level = world.sandboxLevel;
  }
  // -------------------------
  // TRYB EKSPEDYCJI
  // -------------------------
  else {
    const index = (level - 1) % locationList.length;
    name = locationList[index];
    world.currentLocation = name;
    /*if(world.mode === "adventure") {
      world.currentLocation = world.currentAdventureLocation;
    }*/
  }

  locationNameEl.textContent = level + ` - ` + t(name);

  //console.log("Location name:", name);

  saveGame();
}

function highlightCurrentStep() {
  const world = gameState.world;

  const segments = document.querySelectorAll(".progress-segment");
  segments.forEach((seg, i) => {
    seg.classList.remove("current");

    const step = world.locationSteps[i];

    // Obsługa klasy "visited"
    if (step?.visited) {
      seg.classList.add("visited");
    } else {
      seg.classList.remove("visited");
    }

    // Obsługa current
    if (i === world.currentStepIndex) {
      seg.classList.add("current");

      // Usuń klasy miniBoss/boss gdy to current
      seg.classList.remove("miniboss-segment");
      seg.classList.remove("boss-segment");
    } else {
      // Przywróć klasy jeśli są oznaczone jako miniboss/boss
      if (step?.contents?.includes("mini_boss")) {
        seg.classList.add("miniboss-segment");
      }
      if (step?.contents?.includes("boss")) {
        seg.classList.add("boss-segment");
      }
    }
  });
}

const markerColors = {
  chest: "#c89212",
  shrine: "#005009",
  mini_boss: "#9d0001",
  boss: "#dc6201",
  elite: "#7b1e61"
};

function createSegmentMarker(iconSrc, color, isUsed = false) {
  const wrapper = document.createElement("div");
  wrapper.className = "segment-marker";

  if (isUsed) {
    wrapper.classList.add("used");
  }

  wrapper.innerHTML = `
    <svg viewBox="0 0 40 50" class="marker-svg">
      <path d="M20,5 C30,5 35,12 35,20 C35,30 20,45 20,45 C20,45 5,30 5,20 C5,12 10,5 20,5 Z"
        fill="${color}"
        stroke="#00ccff"
        stroke-width="2"
      />
    </svg>
    <img class="marker-icon" src="${iconSrc}" alt="marker icon">
  `;
  return wrapper;
}

/*function createSegmentMarker(iconSrc, color) {
  const wrapper = document.createElement("div");
  wrapper.className = "segment-marker";

  wrapper.innerHTML = `
    <svg viewBox="0 0 40 50" class="marker-svg">
      <path d="M20,5 C30,5 35,12 35,20 C35,30 20,45 20,45 C20,45 5,30 5,20 C5,12 10,5 20,5 Z"
        fill="${color}"
        stroke="#00ccff"
        stroke-width="2"
      />
    </svg>
    <img class="marker-icon" src="${iconSrc}" alt="marker icon">
  `;
  return wrapper;
}*/

function renderLoots(selectedIndex = null) {
    gameState.world.exploreOptions.forEach((opt, i) => {
      // === 🔹 RENDER STAŁEGO LOOTU NA SLOCIE ===
      if (opt.lootItems && opt.lootItems.length > 0 && i !== selectedIndex) {
        //console.log("🔁 Odświeżam loot dla slota:", i);
        setTimeout(() => spawnLootOnSlot(i, opt.lootItems, 0), 50);
      }
    });
  saveGame();
}

  // ✅ Ustalona liczba poziomów w regionie
const MAX_LEVELS_PER_REGION = 26; // możesz zmienić

function initializeProgressBar(steps) {
  const container = document.getElementById("progress-container");
  if(!container) return;
  
  container.innerHTML = "";
  const story = getStoryConfig(gameState.world.currentLocation);

  steps.forEach((step, index) => {
    const segment = document.createElement("div");
    segment.classList.add("progress-segment");

    const isMiniBoss = story.storyInjections?.[index]?.inject?.miniboss;
    //const isMiniboss = true;
    //console.error(`isMiniBoss, index`, isMiniBoss, index);

      // Dobieramy ikonę w zależności od typu zawartości
    if (step.contents.includes("boss")) {
      const bossSrc = assetManager.getResolvedAsset('img/icons/segment-boss-icon.png');
      const marker = createSegmentMarker(bossSrc, markerColors.boss);
      segment.appendChild(marker);
      //icon.src = `${ASSET_BASE}img/icons/segment-boss-icon.png`;
      segment.classList.add("boss-segment");
    } else if (step.contents.includes("story_event") && isMiniBoss) {
      const minibossSrc = assetManager.getResolvedAsset('img/icons/segment-miniboss-icon.png');
      const marker = createSegmentMarker(minibossSrc, markerColors.mini_boss);
      marker.style.transform = "scale(1.25)";
      marker.style.transformOrigin = "center bottom"; // aby „wyrastał” w górę, jak pinezka
      segment.appendChild(marker);
      //icon.src = `${ASSET_BASE}img/icons/segment-miniboss-icon.png`;
     // console.error(`mini boss segment`);
      segment.classList.add("miniboss-segment");
    } else if (step.contents.includes("chest")) {
      const isUsed = step.used?.chest;
      const chestSrc = assetManager.getResolvedAsset('img/icons/segment-chest-icon.png');
      const marker = createSegmentMarker(chestSrc, markerColors.chest, isUsed);
      segment.appendChild(marker);
      //icon.src = `${ASSET_BASE}img/icons/segment-chest-icon.png`;
      //segment.classList.add("chest-segment");
    } else if (step.contents.includes("shrine")) {
      const isUsed = step.used?.shrine;
      const shrineSrc = assetManager.getResolvedAsset('img/icons/segment-shrine-icon.png');
      const marker = createSegmentMarker(shrineSrc, markerColors.shrine, isUsed);
      segment.appendChild(marker);
      //icon.src = `${ASSET_BASE}img/icons/segment-shrine-icon.png`;
      //segment.classList.add("shrine-segment");
    }
    // Dodajemy ikonę nad segmentem
    //segment.appendChild(icon);

    // Oznaczenia stanu segmentu
    if (step.visited) segment.classList.add("visited");
    if (index === gameState.world.currentStepIndex) segment.classList.add("current");

    // Ustalanie szerokości segmentu
    const baseWidth = 10;
    const width = baseWidth + (step.enemies || 0) * 10;
    segment.style.width = `${width}px`;

    container.appendChild(segment);
  });
  
  saveGame();
}

function getStoryConfig(location) {
  const key = location?.trim() || "";
  const config = STORY_CONTROLLER[key] || {};

  // Nieznana lub niekompletna lokacja nie może powodować błędów
  // przy odczycie tablic konfiguracji fabularnej.
  return {
    ...config,
    // These step maps may be arrays OR objects keyed by step index.
    // Do not discard object-based story configuration (e.g. forcedSteps[0]).
    storyInjections: config.storyInjections ?? {},
    storyEnemies: config.storyEnemies ?? {},
    forcedSteps: config.forcedSteps ?? {},
    storyAllEnemies: config.storyAllEnemies ?? {}
  };
}

function generateLocation(options = {}) {
  const world = gameState.world;
  
  if (gameState.world.mode === "sandbox" && options.sandboxEnemy) {
    const type = options.sandboxEnemy;

    world.locationSteps = [{
      enemies: 1,
      contents: [type],
      visited: false,
      used: {
        chest: false,
        shrine: false
      },
      unlocked: true,
      expeditionMiniBoss: false,
      forcedAllEnemies: null,
      forcedEnemy: null,
      protected: false
    }];

    world.currentStepIndex = 0;

    initializeProgressBar(world.locationSteps);

    saveGame();
    
    return;
  }
  
  let config;

  const run = gameState.expedition.modes[gameState.world.expeditionMode].run;
  
  if (world.mode === "expedition") {
    config = getCombinedExpeditionConfig(run.mutators);
  } else if (world.mode === "sandbox" || world.mode === "adventure") {
    config = {
      stepCount: 10
    };
  } else {
    config = getStoryConfig(world.currentLocation);
  }
  
 // console.log("📍 GENERUJĘ NOWĄ LOKACJĘ", world.currentLocation);

  world.locationSteps = [];
  const isLastLevel = world.currentLevel === MAX_LEVELS_PER_REGION;
  
  const pacing = getPacingProfile(world.currentLevel);
  
  // 🔹 Pozostałe kroki (standardowa eksploracja)
  //const totalSteps = 10; // dalej 10 kroków, ale pierwszy może być NPC
  const totalSteps = config?.stepCount || 10;

  
  for (let i = 0; i < totalSteps; i++) {
    const isLastStep = i === totalSteps - 1;
    let contents = [];
    let forcedAllEnemiesForStep = null;
    let forcedEnemyForStep = null;
 
    // 📦 Standardowe 4 sloty
    for (let j = 0; j < 4; j++) {
      const choice = weightedRandom(slotTypeWeights);
      contents.push(choice);
    }
    
    // ❌ Usuń boss/miniboss z losowych kroków
    contents = contents.map(type => (type === "boss" || type === "mini_boss" ? "enemy" : type));
    
    //const story = getStoryConfig(world.currentLocation);

    // STORY ALL ENEMIES – cały krok to jeden typ wroga
    if (config.storyAllEnemies && config.storyAllEnemies[i]) {
      const forcedEnemy = config.storyAllEnemies[i].enemyId;

      contents = ["enemy", "enemy", "enemy", "enemy"];
  
      // zapisujemy jaki wróg ma być wymuszony (potrzebne później)
      forcedAllEnemiesForStep = forcedEnemy;
    }
    
    // 1) Wymuszone kroki (np. pełen NPC)
    if (config.forcedSteps && config.forcedSteps[i]) {
      const forced = config.forcedSteps[i];

      if (forced.type === "npc_all") {
        contents = ["npc", "npc", "npc", "npc"];
      }
      if (forced.type === "enemy_all") {
        contents = ["enemy", "enemy", "enemy", "enemy"];
      }
    }

    // STORY INJECTIONS – pojedyncza fabularna zawartość
    if (config.storyInjections && config.storyInjections[i]) {
      const inj = config.storyInjections[i];

      let slotIndex =
        inj.slot === "random"
        ? Math.floor(Math.random() * 4)
        : Number(inj.slot);

      contents[slotIndex] = inj.inject.type; // np. npc / story_event
    }
    
    // STORY ENEMIES – wróg związany z zadaniem
    if (config.storyEnemies && config.storyEnemies[i]) {
      const se = config.storyEnemies[i];
      const forcedEnemy = config.storyEnemies[i]?.questId;
      // console.log(`forcedEnemy in generateLocation`, forcedEnemy);
      
      // losowy slot z wrogiem
      const freeSlots = contents.map((c, idx) => c === "enemy" ? idx : null).filter(x => x !== null);

      let slot = freeSlots.length > 0
        ? freeSlots[Math.floor(Math.random() * freeSlots.length)]
        : 0;

      if(config.storyEnemies[i]?.enemyId === undefined) {
        forcedEnemyForStep = null;
      } else {
        forcedEnemyForStep = forcedEnemy;
      }
      
      contents[slot] = "story_enemy";
    }
    
    //FINAL STEP
    if (config.finalStep && isLastStep) {
      if (config.finalStep === "boss" || config.finalStep === `mini_boss`) {
        contents = ["story_event"];
      } else {
        // Normalny krok
        contents = contents.map(type => (type === "npc" ? "enemy" : type));
      }
    }
    
    if (world.mode === "expedition" || world.mode === "sandbox") {
      contents = contents.map(type => {
        if (type === "npc") return "enemy";
        if (type === "story_event") return "enemy";

        return type;
      });
    }
    
    let expeditionMiniBoss = false;
    if (world.mode === "expedition" && isLastStep) {
      if (config.finalStep === "mini_boss") {
        expeditionMiniBoss = true;
      }
    }   
    
    if (world.mode === "expedition" && expeditionMiniBoss) {
      contents = ["mini_boss"];
    }
    
    world.locationSteps.push({
      enemies: contents.filter(x => x === "enemy").length,
      contents,
      visited: false,
      used: {
        chest: false,
        shrine: false
      },
      unlocked: false,
      expeditionMiniBoss,
      forcedAllEnemies: forcedAllEnemiesForStep || null,
      forcedEnemy: forcedEnemyForStep || null,
      protected: contents.every(c => c === "npc" || c === "story_event")
    });
    
  }
  
  
  // 🔵 PACING – rytm nagród
  applyPacingRules(world.locationSteps, pacing);

  // 🔵 SOFT RULES – dystans + limity
  enforceSoftRewardRules(world.locationSteps);
  
  normalizeLocationSteps(world.locationSteps);
  
  // 🔵 HARD GUARANTEES – MUSI coś być
  finalGuarantee(world.locationSteps);
  
  normalizeLocationSteps(world.locationSteps);
  
  // 🔵 DEBUG
  validateLocation(world.locationSteps);
  
  const final = countRewards(world.locationSteps);
//  console.warn("🎯 FINAL REWARDS chest i shrine", final.chest, final.shrine);
  
  world.currentStepIndex = 0;
  initializeProgressBar(world.locationSteps);
  
  saveGame();
}

function normalizeStepContents(contents) {
  // ❌ chest + shrine w jednym kroku
  if (contents.includes("chest") && contents.includes("shrine")) {
    const removeType = Math.random() < 0.5 ? "chest" : "shrine";

    for (let i = 0; i < contents.length; i++) {
      if (contents[i] === removeType) {
        contents[i] = "enemy";
      }
    }
  }

  // ❌ duplikaty tego samego typu
  ["chest", "shrine"].forEach(type => {
    const indexes = contents
      .map((v, i) => (v === type ? i : -1))
      .filter(i => i !== -1);

    if (indexes.length > 1) {
      indexes.slice(1).forEach(i => {
        contents[i] = "enemy";
      });
    }
  });
}

function normalizeLocationSteps(steps) {
  steps.forEach(step => {
    normalizeStepContents(step.contents);
  });
}

function getPacingProfile(level) {
  if (level <= 6) {
    return {
      phase: "early",
      forbidShrineSteps: [0, 1],
      forbidChestSteps: [0, 1]
    };
  }

  if (level <= 17) {
    return {
      phase: "mid"
    };
  }

  return {
    phase: "late"
  };
}

function applyPacingRules(steps, pacing) {
  if (pacing.forbidShrineSteps) {
    pacing.forbidShrineSteps.forEach(i => {
      if (!steps[i]) return;

      steps[i].contents = steps[i].contents.map(c =>
        c === "shrine" ? "enemy" : c
      );
    });
  }
  
  if (pacing.forbidChestSteps) {
    pacing.forbidChestSteps.forEach(i => {
      if (!steps[i]) return;

      steps[i].contents = steps[i].contents.map(c =>
        c === "chest" ? "enemy" : c
      );
    });
  }

}

function enforceDistance(steps, type, minDistance) {
  let lastIndex = -Infinity;

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];

    if (step.protected) continue;
    if (!step.contents.includes(type)) continue;

    if (i - lastIndex < minDistance) {
      // usuń tę nagrodę
      step.contents = step.contents.map(c =>
        c === type ? "enemy" : c
      );
    } else {
      lastIndex = i;
    }
  }
}

function removeRandom(steps, type) {
  const candidates = steps.filter(s =>
    s.contents.includes(type)
  );

  if (!candidates.length) return;

  const step = candidates[Math.floor(Math.random() * candidates.length)];
  step.contents = step.contents.map(c =>
    c === type ? "enemy" : c
  );
}

function enforceMaxCounts(steps) {
  const count = type =>
    steps.filter(s => s.contents.includes(type)).length;

  let chests = count("chest");
  let shrines = count("shrine");

  // za dużo skrzyń
  while (chests > 5) {
    removeRandom(steps, "chest");
    chests--;
  }

  // za dużo kapliczek
  while (shrines > 5) {
    removeRandom(steps, "shrine");
    shrines--;
  }
}

function enforceSoftRewardRules(steps) {
  enforceMaxCounts(steps);
  enforceDistance(steps, "chest", 4);
  enforceDistance(steps, "shrine", 4);
}

function countRewards(steps) {
  let chest = 0;
  let shrine = 0;

  for (const s of steps) {
    for (const c of s.contents) {
      if (c === "chest") chest++;
      if (c === "shrine") shrine++;
    }
  }

  return { chest, shrine };
}

function forceReward(steps, type) {
  const candidates = steps
    .map((s, i) => ({ s, i }))
    .filter(o =>
      !o.s.protected &&
      !o.s.contents.includes("npc") &&
      !o.s.contents.includes("chest") &&
      !o.s.contents.includes("shrine")
    );
  
    if (!candidates.length) return;

  const target = candidates[Math.floor(Math.random() * candidates.length)];
  target.s.contents[0] = type;
}

function finalGuarantee(steps) {
  
  let safety = 0;

  while (safety++ < 10) {
    const { chest, shrine } = countRewards(steps);
   // console.warn(`final while`, safety);
    
    if (chest + shrine >= 4) return;

    const candidates = steps
     .map((s, i) => ({ s, i }))
     .filter(o =>
       !o.s.protected &&
       o.i >= 2 &&                    // early pacing
       !o.s.contents.includes("npc") &&
       !o.s.contents.includes("chest") &&   // ⬅️ KLUCZOWE
       !o.s.contents.includes("shrine") &&  // ⬅️ KLUCZOWE
       o.s.contents.includes("enemy")
     );
    
    if (!candidates.length) return;

    const target = candidates[Math.floor(Math.random() * candidates.length)];
    const idx = target.s.contents.findIndex(c => c === "enemy");

    if (shrine < 2) {
    //  console.warn(`shrine < 2`);
      target.s.contents[idx] = "shrine";
    } else if (chest < 1) {
     // console.warn(`chest < 1`);
      target.s.contents[idx] = "chest";
    }

    // po każdej próbie ZNOWU pilnujemy dystansu
    enforceDistance(steps, "chest", 4);
    enforceDistance(steps, "shrine", 4);
  }
  
}

function validateLocation(steps) {
  const chestSteps = [];
  const shrineSteps = [];

  steps.forEach((s, i) => {
    if (s.contents.includes("chest")) chestSteps.push(i);
    if (s.contents.includes("shrine")) shrineSteps.push(i);
  });

 // console.log("📦 CHESTS:", chestSteps);
 // console.log("⛩️ SHRINES:", shrineSteps);
}

function loadFirstStep() {
  const world = gameState.world;

  //console.log("📍 ŁADUJE PIERWSZY KROK", world.currentLocation);
  const step = world.locationSteps[world.currentStepIndex];
  initializeExploreOptions(step);
  world.exploreOptions = step.exploreOptions;
  renderStepContents(step.contents);
  highlightCurrentStep();
 // syncStepEnemies(world.currentStepIndex);
  unlockActions();
  startUiTick();
  
  //world.isFightMenuBlocked = false;
  document.getElementById(`fight-menu-btn`).classList.remove('disabled');
  world.isStartNewWorld = true;
  
  //console.error("isLocationWithTown, currentStepIndex, isInitializing", isLocationWithTown(), world.currentStepIndex, world.isInitializing);
  //if(isLocationWithTown() && world.currentStepIndex === 0 && world.isInitializing) generateNewShopForCity();
  if(world.currentStepIndex === 0 && world.isInitializing) generateNewShopForCity();

  
  if ((gameState.world.mode ===`sandbox` || gameState.world.mode ===`adventure`) && world.currentStepIndex === 0) {
    document.getElementById(`store-button`).classList.remove('disabled');
  }
  
  gameState.resources.firecampState.available = 1;
  
  //console.log("🧪 step.contents:", step.contents);
  //console.log("🧪 step.exploreOptions:", step.exploreOptions.map(opt => opt.type));
  
  refreshCharacterStats();
  renderStats(); 
  
  saveGame();
}

function renderStepContents(contents) {
  const world = gameState.world;

  const step = world.locationSteps[world.currentStepIndex];

  if (!step) {
    console.error("❌ renderStepContents: Nie znaleziono kroku", world.currentStepIndex);
    return;
  }

  const isLastStep = world.currentStepIndex === world.locationSteps.length - 1;
  const isBossOnlyLevel = step.contents.length === 1 && step.contents[0] === "boss";
  
  const level = gameState.char.level || 1;
  const story = getStoryConfig(world.currentLocation);
  //console.log("currentStepIndex in rendeStep inject", world.currentStepIndex);
  let minibossId = story.storyInjections?.[world.currentStepIndex]?.inject?.minibossId;
  //let minibossId = `alpha_wolf_miniboss`;
  if (world.mode === "expedition" && step.expeditionMiniBoss) {
    minibossId = pickRandomExpeditionMiniBoss();
    //console.error(`minibossId expedition`, minibossId);
  }
  
  world.exploreOptions = step.exploreOptions || [];

  if (world.exploreOptions.length === 0 && Array.isArray(contents)) {
    //console.log("🛠️ Tworzenie exploreOptions z contents...");

    world.exploreOptions = contents.map((type, i)=> {
      if (type === "enemy") {
        const forced = step.forcedAllEnemies;
        //console.warn("step.forcedAllEnemies", forced);

        const rawEnemy = forced 
            ? generateEnemy(level, false, forced)
            : generateEnemy(level);
        
        rawEnemy.__stepIndex = world.currentStepIndex;
        rawEnemy.__slotIndex = i;
       
        //rawEnemy = applyExpeditionScaling(rawEnemy, `expedition`);
        
        let enemyData = cloneEnemyForStep(rawEnemy, world.currentStepIndex, i);
        
        return {
          type,
          used: false,
          enemyData: enemyData,
          lootItems: []
        };
      } else if (type === "elite") {
        
        const rawEnemy = generateEliteEnemy(level);
        
        rawEnemy.__stepIndex = world.currentStepIndex;
        rawEnemy.__slotIndex = i;
        
        let enemyData = cloneEnemyForStep(rawEnemy, world.currentStepIndex, i);
        
        return {
          type,
          used: false,
          enemyData: enemyData,
          lootItems: []
        };
      } else if (type === "mini_boss") {
        //console.error(`minibossId story`, minibossId);
         
        if(gameState.world.mode === "sandbox") minibossId = `alpha_wolf_miniboss`;
        
        return {
          type,
          used: false,
          enemyData: generateMiniboss(level, minibossId)
        };
      } else if (type === "boss") {
        return {
          type,
          used: false,
          enemyData: generateBoss(level)
        };
      } else if (type === "shrine") {
        let shrine = pickRandomShrine();
        //console.log("renderuje shrine", shrine);
        return { 
          type, 
          used: false,
          shrineData: pickRandomShrine()
        };
      } else if (type === "chest") {
          return { 
          type, 
          used: false,
          chestData: getRandomChest()
        };
      } else if (type === "npc") {
        const locationKey = (world.currentLocation || "")
         .toLowerCase()
         .replace(/\s+/g, "_");

        const npcs = NPC_DATA[locationKey] || [];
        const indexInStep = i;
        
        const stepInjection = story.storyInjections?.[world.currentStepIndex-1];
       
        // 🆕 Pobierz ID z injection (pojedynczy NPC)
        const npcId = (stepInjection?.inject?.id || "").trim();

        // 🆕 Znajdź NPC po jego ID
        let npc = npcs.find(n => n.id === npcId);
        
        // Jeśli nie znaleziono — daj ostrzeżenie i weź cokolwiek, żeby nie wywalić gry
        if (!npc) {
         // console.warn(`NPC with id "${npcId}" not found in location "${locationKey}"`);
          npc = npcs[indexInStep] || npcs[npcs.length - 1];
        }
  
        return { 
          type, 
          used: false,
          npcData: npc
        };
     } else if (type === "story_enemy") {
        const storyData = story.storyEnemies?.[world.currentStepIndex-1];
        //console.warn(`story.storyEnemies story_enemy`, storyData.enemyId);
        const forced = step.forcedEnemy;
        //console.warn(`step.forcedEnemy enemyData`, step.forcedEnemy);
       
       // console.error("inject enemy with feather", forced);
       
        const rawEnemy = forced 
            ? generateEnemy(level, false, forced)
            : generateEnemy(level);
       
        rawEnemy.__stepIndex = world.currentStepIndex;
        rawEnemy.__slotIndex = i;
       
        let enemyData = cloneEnemyForStep(rawEnemy, world.currentStepIndex, i);
       
        let guaranteedDrop = storyData?.guaranteedDrop || null;
        //console.warn(`renderstep enemyData`, enemyData.name);
       // console.warn(`enemyData, guaranteedDrop`, enemyData.name, guaranteedDrop);
       
        return { 
           type, 
           used: false,
           enemyData: enemyData,
           questId: storyData.questId,
           guaranteedDrop: guaranteedDrop
        };
      } else if (type === "story_event") {
        let storyEvent = story.storyInjections?.[world.currentStepIndex - 1]?.inject || {};
        
        return { 
           type, 
           used: false,
           storyEvent: storyEvent
        };
      } else {
        return {
          type,
          used: false,
          chestOpened: false,
          chestItems: []
        };
      }
    });

    step.exploreOptions = world.exploreOptions;
  }

  // Boss w ostatnim kroku (tylko jeśli faktycznie jest boss)
  if (isLastStep && step.contents.includes("boss")) {
    const bossSlot = world.exploreOptions.find(opt => opt.type === "boss");
    if (bossSlot && !bossSlot.enemyData) {
      bossSlot.enemyData = generateBoss(level);
    }
  }

  // MiniBoss w ostatnim kroku zwykłego poziomu
  if (isLastStep && step.contents.includes("mini_boss")) {
    const minibossSlot = world.exploreOptions.find(opt => opt.type === "mini_boss");
    if (minibossSlot && !minibossSlot.enemyData) {
      if(gameState.world.mode === "sandbox") minibossId = `alpha_wolf_miniboss`;
     // console.error(`minibossId sandbox`, minibossId);
     // console.error(`minibossId isLastStep`, minibossId);
      minibossSlot.enemyData = generateMiniboss(level, minibossId);
    }
  }
  
  //renderLoots();
  
 /* console.log("🔍 currentLocation", world.currentLocation);
  console.log("🔍 DEBUG KROK", world.currentStepIndex);
  console.log("▶️ step.contents: ", step.contents);
  console.log("▶️ step.exploreOptions.map(t => t.type):", world.exploreOptions.map(opt => opt.type));
  */
  saveGame();
}

function areAllLocationQuestsAccepted(currentLocation) {
    const world = gameState.world;

    if(world.mode !== `story`) return true;
    
    if (world.bypassEnemyCheck) return true;

    const story = getStoryConfig(world.currentLocation);
    const stepInjection = story.storyInjections?.[world.currentStepIndex];

    // NPC wymagany w tym kroku fabularnym
    const npcId = (stepInjection?.inject?.id || "").trim();
    //console.log(`are all quest accepted in step currentStepIndex`, world.currentStepIndex);
  //  console.log(`are all quest accepted in step npcId`, npcId);
  
    const stepForced = story.forcedSteps?.[world.currentStepIndex];
    const isNpcAll = stepForced?.type === `npc_all`;
 //   console.log("isNpcAll:", isNpcAll);
  
    if (!isNpcAll && !npcId) {
        console.warn("Brak npcId w aktualnym kroku fabularnym");
        return true; // nie blokuj, jeśli krok nie wymaga NPC
    }

    //console.log("Sprawdzanie questów NPC:", npcId);

    // Questy przypisane do tego NPC w tej lokacji
    const npcQuests = Object.values(QUEST_DATA).filter(q =>
        q.location === world.currentLocation &&
        q.npc === npcId
    );
  
   if (!isNpcAll && npcQuests.length === 0) {
        console.warn(`NPC ${npcId} nie ma questów w tej lokacji`);
        return true;
    }

    // Sprawdź, czy quest NPC z kroku jest zaakceptowany
    const locationQuests = Object.values(QUEST_DATA).filter(q => q.location === world.currentLocation);
    let missing = null;
  
    if(!isNpcAll) {
      missing = npcQuests.filter(q => !world.battleState.quests[q.id]);
    }  
    else {  
      missing = locationQuests.filter(q => !world.battleState.quests[q.id]);
    }
  
    //console.log("Brakujące questy NPC:", missing.map(q => q.id));

    return missing.length === 0;
}

function rollOptions() {
  const world = gameState.world;

  //console.log("📍 ROLLOPTIONS");
 // console.log("isMinibossLastStep", world.isMinibossLastStep);
  
  const opt = world.exploreOptions[world.selectedSlotIndex];
  const story = getStoryConfig(world.currentLocation);
  const isMiniboss = story.storyInjections?.[world.currentStepIndex + 2]?.inject?.miniboss;
  //const isMiniboss = true;
 /* console.log(`isMiniboss`, isMiniboss);
  console.log("currentStepIndex miniboss", world.currentStepIndex);
  console.log("locationSteps.length miniboss", world.locationSteps.length);
  */
  let currentStep = world.locationSteps[world.currentStepIndex];

  if (!currentStep) {
    console.error("⛔ Brak kroku dla indexu:", world.currentStepIndex);
    return;
  }
  
  if(!world.bypassEnemyCheck && !areAllLocationQuestsAccepted(world.currentLocation)) {
    //console.log(`not all quest accepted`);
    return showInfoAlert(t(`cannot_passed_quests`));
  }
  
  if (!world.bypassEnemyCheck && !areAllEnemiesDefeated(currentStep)) {
    /*const slotName = document.getElementById("slot-name");
    slotName.classList.remove("hidden");
    slotName.style.color = "red";
    slotName.innerHTML = "Pokonaj wszystkich wrogów!";*/
   // console.warn("⛔ Nie można przejść dalej – nie wszyscy wrogowie pokonani.");
    showInfoAlert(t(`cannot_passed_enemies`));
    return;
  }
  
  let nextStep = world.locationSteps[world.currentStepIndex + 1];
  
  if(nextStep?.unlocked) {
    //spendEnergy(`move`);
  } else {
    if(!spendEnergy(`next_step`)) return;
  }
  
  const nextBtn = document.getElementById("next-btn");
  const nextArrow = document.getElementById("arrow-next-icon");
  const nextLevel = document.getElementById("next-level");
  
  world.isMinibossLastStep = story.storyInjections?.[world.currentStepIndex + 1]?.inject?.miniboss;
  if(world.isMinibossLastStep && world.mode === `story`) {
    //console.log("isMiniboss last step");
    const prevBtn = document.getElementById("prev-btn");
    prevBtn.classList.add(`hidden`);
    nextBtn.classList.add(`hidden`);
    
    if(world.bossDefeatedState.isBossDefeated) {
      showNavigateButtons();
    }
  } 

  if (world.currentStepIndex + 1 >= world.locationSteps.length) {
  //  console.log("before check enemies defeated");
    
    if (areAllEnemiesDefeated()) {
      //console.log("enemies defeated");
      nextBtn.disabled = false;
      nextLevel.classList.remove(`hidden`);
      nextArrow.classList.add(`hidden`);
      
      nextBtn.onclick = (e) => { 
        e.stopPropagation(); 
        if(!world.bossDefeatedState.isBossDefeated) {
          showCustomConfirm(
            `${t("next_location")}`,
            () => { goToNextLevel(); },
            () => { }
          );
        } else {
          showPopup();
        }
      };
    } else {
      //console.log("enemies not defeated");
      nextBtn.disabled = false;
      nextBtn.onclick = rollOptions;
    }
    return;
  } 
  
  if(world.currentStepIndex === (world.locationSteps.length - 3) && isMiniboss && world.mode === `story`) {
    
      //console.log("przedostatni krok i miniboss");
 
    if(!world.bossDefeatedState.isBossDefeated) {
      //console.log("przedostatni krok i world.bossDefeatedState.isBossDefeated");
 
      nextBtn.onclick = (e) => { 
       // console.log("klikam nextBtn.onclick");
        
        //e.stopPropagation(); 
        showCustomConfirm(
          `${t("next_step_miniboss")}`,
          () => { rollOptions(); },
          () => { }
        );
      };
    }
    
  }
  
  // Zaznacz aktualny krok jako odwiedzony
  world.locationSteps[world.currentStepIndex].visited = true;
  world.currentStepIndex++;
  world.locationSteps[world.currentStepIndex].unlocked = true;
  
 // syncStepEnemies(world.currentStepIndex);
  
  if (world) {
   // console.log("regionId in rollOptions", world.selectedRegionId);
  }
  
  if ((gameState.world.mode ===`sandbox` || gameState.world.mode ===`adventure`) && world.currentStepIndex !== 0) {
    document.getElementById(`store-button`).classList.add('disabled');
  }
  
  const step = world.locationSteps[world.currentStepIndex];
  initializeExploreOptions(step);
  
  world.exploreOptions = step.exploreOptions;

//  console.log("🎲 rollOptions dla kroku:", world.currentStepIndex);
  renderStepContents(step.contents);
  highlightCurrentStep();
  document.getElementById("prev-btn").disabled = world.currentStepIndex <= 0;
    
  world.inCombat = false;
  world.selectedSlotIndex = null;
  world.isInitializing = false;
  
  renderLoots();
  hideDialog();
  hideAttackBtn();
  //focusOnSlots();
  unlockActions();
  renderStats();
  renderOptions();
  saveGame();
  
  //console.log("koniec rollOptions");
}

function loadStep(index) {
  const world = gameState.world;

  world.currentStepIndex = index;
  const step = world.locationSteps[index];
  
  world.exploreOptions = step.exploreOptions || step.contents.map(randomOpt);
  if (!step.exploreOptions) step.exploreOptions = world.exploreOptions;
  
  world.selectedSlotIndex = null;
  
  //console.error("isLocationWithTown, currentStepIndex, isInitializing", isLocationWithTown(), world.currentStepIndex, isInitializing);

  renderStepContents(step.contents); // korzysta z globalnego exploreOptions
  //focusOnSlots();
  hideDialog();
  highlightCurrentStep();
  saveGame();
}

async function goBack() {
 // console.log("🔙 Cofanie...");
  stopEnemyUiRegenTick();
  const world = gameState.world;
 
  if (world.currentStepIndex <= 0) return;

  world.currentStepIndex--;
  
  syncStepEnemies(world.currentStepIndex);
  
  const currentStep = world.locationSteps[world.currentStepIndex];
  loadStep(world.currentStepIndex); // ← ładuje stan exploreOptions i inne rzeczy
  //console.log("🔙 Cofanie after loadStep");

  const nextLevel = document.getElementById("next-level");
  const nextBtn = document.getElementById("next-btn");
  const nextArrow = document.getElementById("arrow-next-icon");

  nextArrow.classList.remove(`hidden`);
  nextLevel.classList.add(`hidden`);
  nextBtn.disabled = false;
  nextBtn.onclick = () => { rollOptions() };
  document.getElementById("prev-btn").disabled = world.currentStepIndex <= 0;

  if ((gameState.world.mode ===`sandbox` || gameState.world.mode ===`adventure`) && world.currentStepIndex !== 0) {
    document.getElementById(`store-button`).classList.add('disabled');
  } else if ((gameState.world.mode ===`sandbox` || gameState.world.mode ===`adventure`) && world.currentStepIndex === 0) {
    document.getElementById(`store-button`).classList.remove('disabled');
  }
  
  world.inCombat = false;

  //await wait(150);
  
  //spendEnergy(`move`);
  renderLoots();
  //console.log("🔙 Cofanie before renderOptions");
  
  renderStats();
  renderOptions(); // ← renderuje sloty, wrogów, skrzynie itd.
  hideAttackBtn();
  saveGame();
}

function updateExpeditionRunTime(){
  const run = gameState.expedition.modes[gameState.world.expeditionMode].run;
  const now = Date.now()
  
  if(run.startTime > 0){
    run.playedTime += now - run.startTime;
    run.startTime = now
    //console.error(`update time run.playedTime, run.startTime`, run.playedTime, run.startTime);
   }
 }

function setStartTime() {
  const run = gameState.expedition.modes[gameState.world.expeditionMode].run;

  if (run.startTime > 0) {
    run.startTime = 0
  }
}

function stopTimeExpedition() {
  const run = gameState.expedition.modes[gameState.world.expeditionMode].run;

  if(run.startTime > 0){
  //  console.error(`stop time run.playedTime, run.startTime`, run.playedTime, run.startTime);
    run.playedTime += Date.now() - run.startTime;
   // console.error(`stop time after run.playedTime, run.startTime`, run.playedTime, run.startTime);
    run.startTime = 0;
  } 
  saveGame();
}

function continueExpedition() {
  const world = gameState.world;
  
  stopTimeExpedition();
  
  world.expeditionMode = expeditionMode;
  //const run = gameState.expedition.modes[world.expeditionMode].run;
  
  const run = gameState.expedition.modes[world.expeditionMode]?.run;
  run.startTime = Date.now();

  startNextExpeditionLocation();
  //navigate(`battle`);
}

function nextRun() {
  gameState.world.openRegionMapAfterLoad = `1`;
  navigate(`map`);
}

function startSandboxTest(tier) {
  gameState = createNewGameState();
  gameState.world.mode = "sandbox";

  gameState.world.isStartNewRegion = true;
  gameState.world.selectedRegionId = `west`;
  
  //setStarterSet();
  
  gameState.resources.staminaState.current = 100;
  const potion = makeSmallHealPotion();
  gameState.resources.potions = Array(POTION_SLOTS).fill(null);
  addPotionToBar(potion);

  
  if (tier === "initiate") {
    gameState.char.level = 10;
    gameState.char.skillPoints = 10;
    gameState.char.availableAttributePoints = 50;
    gameState.resources.gold = `300`;
    generateAndEquipSet("rare");
  }

  if (tier === "adventurer") {
    gameState.char.level = 25;
    gameState.resources.gold = `1200`;
    gameState.char.skillPoints = 25;
    gameState.char.availableAttributePoints = 125;
    generateAndEquipSandboxSet(["rare","rare","unique"]);
  }

  if (tier === "veteran") {
    gameState.char.level = 50;
    gameState.resources.gold = `3500`;
    gameState.char.skillPoints = 50;
    gameState.char.availableAttributePoints = 250;
    generateAndEquipSet("unique");
  }

  if (tier === "champion") {
    gameState.char.level = 75;
    gameState.resources.gold = `8000`;
    gameState.char.skillPoints = 75;
    gameState.char.availableAttributePoints = 375;
    generateAndEquipSandboxSet(["unique","unique","epic"]);
  }

  healPlayer(100);
  //refreshCharacterStats();
  //renderStats();
  
  nextSandboxLevel();
}

function updateLocationForLoop() {
  const region = gameState.world.selectedRegionId;
  const locations = locationsByRegion[region];
  const index = (gameState.world.sandboxLevel - 1) % locations.length;
  const locationName = locations[index];
  
 // console.error(`updateLocationForLoop`, locationName);

  gameState.world.currentLocation = locationName;
  gameState.world.isStartNewRegion = true;
  
  navigate(`battle`);
  //gameState.world.currentAdventureLocation = locationName;
}

function startSandbox(region = `west`, spawnEnemy = false, type = `elite`) {
  const world = gameState.world;
  
  gameState.world.isSpawnEnemy = spawnEnemy;
  gameState.world.spawnType = type;
  
  world.isStartNewRegion = true;
  world.selectedRegionId = region;

  if(spawnEnemy) refillEnergy();
  
  nextSandboxLevel();
}

function nextSandboxLevel() {
 // console.error(`gameState.world.selectedRegionId`, gameState.world.selectedRegionId);
  const region = gameState.world.selectedRegionId;
  const locations = locationsByRegion[region];
  const index = (gameState.world.sandboxLevel - 1) % locations.length;
  const locationName = locations[index];
  
  gameState.world.currentLocation = locationName;
  gameState.world.isStartNewRegion = true;
  
  navigate(`battle`);
}

function startSandboxLevel() {
  const region = gameState.world.selectedRegionId;
  const locations = locationsByRegion[region];
  const index = (gameState.sandboxLevel - 1) % locations.length;
  const locationName = locations[index];
    
  //gameState.world.currentLocation = locationName;

  showNavigateButtons();
  updateLocationName();
  
  if(gameState.world.isSpawnEnemy) generateLocation({ sandboxEnemy: gameState.world.spawnType });
  else generateLocation();
  
  updateEnergyUI();
  
  gameState.world.isSpawnEnemy = false;
}

function startExpedition(region = "west") {
  const world = gameState.world;
  
  stopTimeExpedition();
  
  world.expeditionMode = expeditionMode;
  //const run = gameState.expedition.modes[world.expeditionMode].run;
  
  resetRun(world.expeditionMode);
  
  gameState.char = getBaseCharacter();
  gameState.inventory = [];
  //resetExpeditionProgress();
  setStarterSet();
    
  const run = gameState.expedition.modes[world.expeditionMode].run;
  
//  console.error(`start expedition level`, world.expeditionMode, run.level);

  gameState.world.mode = "expedition";
  run.level = 1;
  gameState.world.currentLevel = 1;
  gameState.world.selectedRegionId = region;
  gameState.world.expeditionMutators = [];
  
 // console.error(`startExpedition region`, world.selectedRegionId);

  gameState.expedition.modes[world.expeditionMode].run.startTime = Date.now();
  gameState.expedition.modes[world.expeditionMode].level.startTime = Date.now();
  
  startNextExpeditionLocation();
}

function getNextExpeditionLocation() {
  const world = gameState.world;
  const region = world.selectedRegionId || "west";
  const pool = locationsByRegion[region];
  const level = gameState.expedition.modes[gameState.world.expeditionMode].run.level;
  const index = (level - 1) % pool.length;

  //console.error(`get location expedition level`, gameState.world.expeditionMode, level);
  
  return pool[index];
}

function startNextExpeditionLocation() {
  const world = gameState.world;
  
  world.isStartNewRegion = true;
  world.currentLocation = getNextExpeditionLocation();
  resetLevelStats();
  
  const level = gameState.expedition.modes[gameState.world.expeditionMode].run.level;
  
 // console.error(`world.currentLocation, level`, world.currentLocation, level);

  if(level <= 1) {
   // console.error(`startNextExpeditionLocation region`, world.selectedRegionId);
    screenLoader(`expedition`);
  } else {
    navigate(`battle`);
  }
  
  saveGame();
}

function resetRun(mode){
  gameState.expedition.modes[mode].run = {
    playerLevel:1,
    equipment:[],
    mutators:{},
    perfectBlock:0,
    gold:0,
    impulses:0,
    level:1,
    kills:0,
    damage:0,
    keys:0,
    startTime:0,
    playedTime: 0
  };
}

function resetLevelStats(){
  const mode = gameState.world.expeditionMode;
  
  gameState.expedition.modes[mode].level = {
    kills:0,
    damageDealt:0,
    damageTaken:0,
    damageBlocked:0,
    perfectBlock:0,
    gold:0,
    loot:0,
    startTime:Date.now(),
    playedTime: 0
  };
}

function startExpeditionLevel(){
  const world = gameState.world;
 // console.error(`startExpeditionLevel region`, world.selectedRegionId);

  const region = world.selectedRegionId;
  const locations = locationsByRegion[region];
  const level = gameState.expedition.modes[gameState.world.expeditionMode].run.level;
  const index = (level - 1) % locations.length;
  const locationName = locations[index];

//  console.error(`start location expedition level`, gameState.world.expeditionMode, level);
  
  world.currentLocation = locationName;

//  console.error(`locationName`, locationName);
  
  showNavigateButtons();
  updateLocationName();
  
  generateLocation();
}


function goToNextLevel() {
    const world = gameState.world;

    if (world.currentLevel === MAX_LEVELS_PER_REGION) {
      world.bossDefeatedState.isBossDefeated = true;
      unlockNextRegion(); // 🔓 odblokowanie kolejnego regionu
      //console.log("current level after boss defeated", currentLevel);
      hideNavigateButtons();
      world.currentLevel = 1;
    //  console.log("current level after boss defeated", world.currentLevel);
      saveGame();
      return;
    }
  
   // Reset przycisków
    document.getElementById("next-btn").disabled = false;
    document.getElementById("next-btn").onclick = rollOptions;

    if(world.mode === `expedition`) {
      //world.currentLevel++;
      //gameState.world.expeditionLevel++;
      //checkExpeditionMutator();
      //startNextExpeditionLocation();
      
      showExpeditionSummary();
       
      return;
    }
  
    if(world.mode === `sandbox`) {
      gameState.world.sandboxLevel++;
      nextSandboxLevel();
      saveGame();
      return;
    }
  
    if(world.mode === `adventure`) {
      world.sandboxLevel++;
            
      updateLocationForLoop();
      navigate(`battle`);
      saveGame();
      
      return;
    }
  
  //  console.log("poczatek next level", world.isInitializing);

    const story = getStoryConfig(world.currentLocation);
    const isMiniboss = story.finalStep === `mini_boss`;
  
    let toBeContinued = false;
    const hasMainQuestActive = Object.values(world.battleState.quests || {})
     .some(q => q.type === `Misja główna` && 
                q.state === "active" &&
                q.location === world.currentLocation);
    const continuedQuest = Object.values(world.battleState.quests || {})
     .find(q => q.type === `Misja główna` && 
                q.state === "active" &&
                q.location === world.currentLocation);

 //   console.log("continuedQuest.id", continuedQuest?.id);
  
    const continuedQuestData = QUEST_DATA[continuedQuest?.id];
  
    if(continuedQuestData?.toBeContinued) {
      toBeContinued = true;
    }
  
   // console.log("hasMainQuestActive", hasMainQuestActive);
  
    if (!areAllEnemiesDefeated()) {
      showInfoAlert(t("cannot_passed_enemies_before_next_level"));
      return;
    }
  
    if (hasMainQuestActive && !isMiniboss && !toBeContinued) {
      return showInfoAlert(t("cannot_passed_active_quest"));
    }
  
    const quests = Object.values(world.battleState.quests || {});

    for (const quest of quests) {
      if (quest.state === "active" && quest.location === world.currentLocation && quest.type === "side_quest") { 
        failQuest(quest.id);
      }
    }
  
    world.currentLevel++;
   // console.log("currentLevel", world.currentLevel);
  
    // Reset
    world.currentStepIndex = 0;
    world.exploreOptions = [];
    world.inCombat = false;
    world.isInitializing = true;
    world.isFightMenuBlocked = true;
    world.isMinibossLastStep = false;
    world.bossDefeatedState.isBossDefeated = false;
     
   // console.log("isMinibossLastStep  goToNextLevel", world.isMinibossLastStep);
  
    world.generateNewLevelOnLoad = `1`;
    world.openRegionMapAfterLoad = `1`;
    
  /*localStorage.setItem("generateNewLevelOnLoad", "1");
    localStorage.setItem("openRegionMapAfterLoad", "1");
    localStorage.setItem("selectedRegionId", "west");*/
    //window.location.href = "index.html";
    navigate(`map`);
  
  saveGame();
}

function hideAttackBtn() {
  for(let i = 0; i <= 3; i++) {
    const attackBtn = document.getElementById(`slot-attack-button-${i}`);
    if(attackBtn){
      attackBtn.classList.add("hidden");
    }  
  }
}

function startLevel() {
  //console.log("LOADING startLevel");
  showNavigateButtons();
  updateLocationName();
  generateLocation();
}