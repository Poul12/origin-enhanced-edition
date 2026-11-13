let gameState = null;


function createNewGameState() {
  return {
    char: getBaseCharacter(),
    
    inventory: [],
    
    globalTime: {
      timeOffset: 0,
      isPaused: false,
      pauseStartedAt: 0
    },

    world: getWorldState(),
    
    expedition: {

      meta:{
        bestDepth:0,
        totalRuns:0,
        totalImpulses:0,
        totalGold:0,
        totalKeys:0,
      },

      modes:{

        endless:{
          run:{
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
          },

          level:{
            kills:0,
            damageDealt:0,
            damageTaken:0,
            damageBlocked:0,
            perfectBlock:0,
            loot:0,
            gold:0,
            startTime:0,
            playedTime: 0
          }

        },

        limited:{
          run:{
            playerLevel:1,
            equipment:[],
            mutators:[],
            perfectBlock:0,
            gold:0,
            impulses:0,
            level:1,
            kills:0,
            damage:0,
            keys:0,
            startTime:0,
            playedTime: 0
          },

          level:{
            kills:0,
            damageDealt:0,
            damageTaken:0,
            loot:0,
            startTime:0,
            playedTime: 0
          }
          
        }

      }
 
    },
    
    combat: getBaseCombatState(),

    resources: getBaseResourceState()
  };
}

function getBaseCombatState() {
  return {
    isStart: false,
    actionLock: {
      locked: false,
      until: 0,
      reason: null,
      allowedActions: [],
    },
    stats: {
      energyMultiplier: 0,
      deathDebuffFightsLeft: 0,
      energyFatigueStack: 1,
      currentHp: 0,
      maxHp: 0,
      hpPercent: 1,
      hp: 0,
      dmg: 0,
      def: 0,
      combo: 0,
      nextHitMultiplier: 0,
      nextHitPenetration: 0,
    },
    flags: {
      isDebuff: false,
      previewStats: false,
      isCritical: false,
      isBlocked: false,
      enemyFinisherActive: false,
      windupEnd: false,
      lastStandActive: false,
      isLowHp: false,
      isPerfectDmgBonus: false,
      vulnerableWhileStunned: false,
    },
    shieldWall: {
      reducedCost: 1,
    },
    counterStrike: {
      isActive: false,
      staminaRecover: 0,
      attackValue: 0,
    },
    ironWill: {
      isActive: false,
      cost: 1,
    },
    provocation: {
      isActive: false,
    },
    openingStrike: {
      windUpMultiplier: 1,
    },
    lastBastion: {
      isActive: false,
      nextAttack: 0,
      attackValue: 0,
    },
    precision: {
      buffMultiplier: 1,
    },
    parryMaster: {
      isActive: false,
      remainingMs: 4000,
      reduce: 0,
      shieldReduce: 0,
    },
    weakPoint: {
      isActive: false,
      crit: 0,
      critDmg: 0,
    },
    sweep: {
      isActive: false,
      windup: 0,
    },
    spearDiscipline: {
      isActive: false,
    },
    absoluteControl: {
      isActive: false,
      expiresAt: 0,
    },
    bleedBuff: {
      atkSpd: {
        isActive: false,
        value: 0,
      },
    },
    bloodFrenzy: {
      isActive: false,
      atkSpd: 0,
      atkSpdBase: 0,
    },
    bloodPact: {
      isActive: false,
      crit: 0,
    },
    bloodReaver: {
      isActive: false,
      heal: 0,
    },
    ironStance: {
      reduction: 0,
      cooldownUntil: 0,
      primed: false
    },
    armorStacks: {
      stacks: 0,
      expiresAt: 0,
      active: false
    },
    criticalLastStand: {
      active: false,
      bonusThreshold: 0,
      bonusCap: 0
    },
    playerBleed: {
      stacks: [],
      interval: null,
      nextTickAt: 0
    },
    playerDots: {
      bleed: {
        stacks: [],
        interval: null,
        nextTickAt: 0
      },
      
      burn: {
        stacks: [],
        interval: null,
        nextTickAt: 0
      },
      
      poison: {
        stacks: [],
        interval: null,
        nextTickAt: 0
      },

    },
    enemyAtkspdBuff: {
      isActive: false,
      value: 0,
    },
    playerMark: {
      isActive: false,
      dmgTaken: 0,
      atkspd: 0,
    },
    enemyDmgReduction: {
      isActive: false,
      value: 0,
    },
    enemyDmgBuff: {
      isActive: false,
      value: 0,
    },
    activeRingMode: null,
    guardStacks: 0,
    armorBreakTimingActive: false,
    bleedTimingActive: false,
    perfectChainStacks: 0,
    perfectBonusDmgNextHit: false,
    fleeFailStreak: 0,
    activeBuffs: {},
    deathDebuff: {
      deathMultiplier: 1,
      deathDebuffFightsLeft: 0
    },
    
    perfectBlockBonus: {
      defBonus: {
        expiresAt: 0,
        isActive: false,
      },
      atkSpdBonus: {
        expiresAt: 0,
        isActive: false,
      },
    },
    blockingBonus: {
      defBonus: {
        isActive: false,
      },
      lohBonus: {
        isActive: false,
      },
      bleedBonus: {
        isActive: false,
        wasAdded: false,
      },
    },
    dodgeBonus: {
      critBonus: {
        expiresAt: 0,
        isActive: false,
      },
      atkSpdBonus: {
        expiresAt: 0,
        isActive: false,
      },
      staminaBonus: {
        expiresAt: 0,
        isActive: false,
      },
    },
    critBonus: {
      dodgeBonus: {
        expiresAt: 0,
        isActive: false,
      },
    },
    guardBonus: {
      critBonus: {
        stacks: 0,
        isActive: false,
      },
      defBonus: {
        stacks: 0,
        isActive: false,
        accumulate: 0,
      },
      dmgBonus: {
        stacks: 0,
        isActive: false,
      },
    },
    poiseBonus: {
      dmgBonus: {
        nextHit: false,
      },
      atkSpdBonus: {
        isActive: false,
        expiresAt: 0,
      },
      critBonus: {
        isActive: false,
        expiresAt: 0,
      },
      dmgTakenBonus: {
        isActive: false,
        expiresAt: 0,
      },
    },
    armorBreakBonus: {
      refreshBonus: {
        isReady: false,
      },
    },
    energyBonus: {
      critBonus: {
        isActive: false,
      },
      dmgBonus: {
        isActive: false,
      },
    },
    activeBonus: {
      dmg: 0,
      def: 0,
      crit: 0,
      atkSpd: 0,
      
      lastUsed: 0,
      lastDefToDmg: 0,
      
      dmgSources: {
        lowHp: 0,
        afterBreak: 0,
        defToDmg: 0,
        guardStacks: 0,
        controlStacks: 0,
        armorBreak: 0,
        exhausted: 0,
        energy: 0,
        bleed: 0,
      },
      
      defSources: {
        exhausted: 0,
        guard: 0,
        perfectBlock: 0,
        defensiveStance: 0,
        perSecBlock: 0,
        lowHp: 0,
        armorBreak: 0,
      },
      
      critSources: {
        dodge: 0,
        guardStacks: 0,
        afterBreak: 0,
        exhausted: 0,
        energy: 0,
        bleed: 0,
        controlStacks: 0,
        missingHp: 0,
        armorBreak: 0,
      },
    },
    
    lowHpBonus: {
      lowHpDmgActive: false,
      lowHpDefActive: false,
    },
    exhaustedBonus: {
      dmgBonus: {
        isActive: false,
      },
      defBonus: {
        isActive: false,
      },
      critBonus: {
        isActive: false,
      },
      staminaBonus: {
        isActive: false,
        bonusRegen: 0,
      },
    },
    controlBonus: {
      dmgBonus: {
        isActive: false,
        accumulate: 0,
      },
      slowBonus: {
        isActive: false,
        accumulate: 0,
      },
      critBonus: {
        isActive: false,
        accumulate: 0,
      },
    },
    perfectChainBlock: {
      perfectWindow: 0,
      crit: 0,
      critDmg: 0,
    },
    finalDamage: 0,
    enemyFinalDamage: 0,
    playerBlock: {
      mode: "",
      active: false,
      startTime: 0,
      endTime: 0,
      activeRemaining: 0,
      activePaused: false,
      cooldownUntil: 0,
      cooldownRemaining: 0,
      cooldownPaused: false,
      cooldown: 0,
      damageReduction: 0,
      critBonus: 0,
      nextAttackGuaranteedCrit: false,
      lastResult: null,
      stackChain: 0,
    },
    skills: {
      playerSkills: {},
      assignedSkills: {
        bulwark: {},
        duelist: {},
        warden: {},
        executioner: {},
        juggernaut: {},
        berserker: {},
      },
      skillCooldowns: {},
    }
  };
}

function getWorldState() {
  return {
      mode: null,
      startNewCampaign: false,
      expeditionMutators: [],
      expeditionLevel: 1,
      expeditionMode: `limited`,
      exploreOptions: [],
      inCombat: false,
      selectedSlotIndex: null,
      locationSteps: [],
      currentStepIndex: 0,
      currentLevel: 1,
      sandboxLevel: 1,
      isSpawnEnemy: false,
      reloadTest: false,
      //currentLocation: "Port Elmaris",
      currentAdventureLocation: null,
      currentLocation: null,
      firecampState: null,
      isStoryEnded: false,
      isLevelVisited: false,
      isInitializing: false,
      isStartNewRegion: true,
      isStartNewWorld: false,
      isMinibossLastStep: false,
      isFightMenuBlocked: false,
      isShopMenuBlocked: false,
      enemyRegenLoopStarted: false,
      selectedRegionId: null,
      unlockedRegions: ["west"],
      passedRegions: [],
      visitedLevels: [],
      isStartNewGame: true,
      bypassEnemyCheck: false,
      openRegionMapAfterLoad: "0",
      generateNewLevelOnLoad: "0",
      activeSlot: null,
      activeShopSlot: {},
      activeSellSlot: null,
      lastShopTab: "weapons",
      musicVolume: 0.5,
      sfxVolume: 0.5,
      isMuted: false,
      
      bossDefeatedState: {
        isBossDefeated: false
      },

      battleState: {
        quests: {}
      }
    };
}

function getBaseResourceState() {
  return {
    gold: "0",
    impulses: "0",
    
    potions: [],
    healPotionQuantityInv: 0,
    healPotionQuantity: 99,
    healPotionStacks: [],
    foodQuantity: 10,
    shopItems: {},
    isComparing: false,
    enterStore: false,
  
    foodState: {
      active: false,
      startedAt: null,
      expiresAt: null,
      penalty: 1 
    },
    
    energyState: {
      current: 100,
      max: 100,

      regenPerSecond: 0.05, 

      lastUpdateAt: Date.now(),
  
      noEnergyUse: false,
  
    },

    staminaState: {
      current: 0,
      max: 0,
      
      regenPerSecond: 12,
      regenDelayMs: 1200,
      lastSpendTs: 0,
      actualRegen: 0,
  
      blockDrainPerSecond: 15,
      fatigue: "",
      breakDurationMs: 1500,
  
      inCombat: false,
      disabled: false
    },
 
    firecampState: {
      active: false,
      expiresAt: 0,
      slotIndex: null,
      available: 1
    },
    
  };
}


function getBaseCharacter() {
  return {
    playerName: "",
    playerClass: "",
    maxHp: 100,
    hp: 100,
    atkSpd: 1,
    stamina: 100,
    maxStamina: 100,
    staminaRegen: 0,
    energyRegen: 0,
    dmg: 5,
    def: 5,
    level: 1,
    baseDamage: {
      weapon: 0,
      stats: 0,
      flat: 0,
      implicit: 0
    },
    bonus: {
      maxHp: 0,
      dmg: 0,
      def: 0,
      dmgVsStatus: 0,
      maxEnergy: 0,
      staminaRegen: 0,
      maxStamina: 0,
      hpRegen: 0,
      maxHpPct: 0,
      dmgPct: 0,
      defPct: 0,
      critBonus: 0,
      critDmgBonus: 0,
      atkspdBonus: 0,
      perfectDmgBonus: 0,
      perfectWindowBonus: 0,
      perfectChainBonus: 0,
      blockReductionBonus: 0,
      blockCooldownBonus: 0,
      energyRegen: 0,
      dmgReduction: {
        reduction: 0,
        cooldown: 0
      },
      stackDefense: {
        stack: 0,
        duration: 0
      },
      hpToDmg: {
        threshold: 0,
        maxBonus: 0
      }
    },
    combatAffixes: {
      value: 0,
      sources: [],
      archetype: null,
      stat: null,
      discovered: false,
    },
    combatAffixCodex: {
      id: null,
      archetype: null,
      discovered: false,
      seen: false,
    },
    energy: {
      current: 100, 
      max: 100,
      savedAt: Date.now(),
      regenPerSecond: 0.1
    },
    
    weaponMastery: {
      bulwark: {
        level: 1,
        exp: 0,
        expToNext: 100,
        skillPoints: 0
      },
      duelist: {
        level: 1,
        exp: 0,
        expToNext: 100,
        skillPoints: 0
      },
      warden: {
        level: 1,
        exp: 0,
        expToNext: 100,
        skillPoints: 0
      },
      executioner: {
        level: 1,
        exp: 0,
        expToNext: 100,
        skillPoints: 0
      },
      juggernaut: {
        level: 1,
        exp: 0,
        expToNext: 100,
        skillPoints: 0
      },
      berserker: {
        level: 1,
        exp: 0,
        expToNext: 100,
        skillPoints: 0
      },

    },
    
    crit: 0,
    critDmg: 0,
    elementalDmg: 0,
    typeOfElementalDmg: ``,
    physDmgReduction: 0,
    lifeRegen: 0,
    lifeOnHit: 0,
    dodge: 0,
    blockPower: 0,
    tacticalBlock: 0,
    blockMode: ``,
    energyRegenBonus: 0,
    penaltyAtkSpd: 0,
    penaltyDmg: 0,
    baseCooldown: 0,
    penaltyCooldown: 0,
    dodgeCostReduce: 0,
    moveCostReduce: 0,
    perfectBlockEnergy: 0,
    critEnergy: 0,
    perfectWindowBonus: 0,
    inCombat: false,
    currentStep: 0,
    regenBuffer: 0,
    lastRegenTs: Date.now(),
    regenAllowedAt: 0,
    resist: {},
    magicFind: 0,
    goldFind: 0,
    skillPoints: 0,
    experience: 0,
    expToNextLevel: 125,
    vit: 0,
    str: 0,
    agi: 0,
    attributes: {
      vitality: 0,
      strength: 0,
      dexterity: 0
    },
    availableAttributePoints: 0,
    gold: 0,
    equipment: {},
    style: {},
    dom: {
       slot: null,
    },
  };
}

/*function initializeGameState() {
  const save = localStorage.getItem("save");

  if (!save) {
    gameState = createNewGameState();
    return;
  }

  gameState = createNewGameState(); // najpierw czysta baza

  const parsed = JSON.parse(save);

  mergeDeep(gameState, parsed);
}*/

function ensureCombatAffixCodexEntry(affixId, archetype = null) {
  if (!gameState?.char || !affixId) return null;

  let codex = gameState.char.combatAffixCodex;
  if (!codex || typeof codex !== "object" || Array.isArray(codex)) {
    codex = {};
    gameState.char.combatAffixCodex = codex;
  }

  const bonus = Array.isArray(baseBonuses)
    ? baseBonuses.find(entry => entry.id === affixId && entry.category === "combat")
    : null;

  let entry = codex[affixId];
  if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
    entry = {
      id: affixId,
      archetype: bonus?.archetype ?? archetype ?? null,
      discovered: false,
      seen: false
    };
    codex[affixId] = entry;
    return entry;
  }

  if (!entry.id) entry.id = affixId;
  if (!entry.archetype) entry.archetype = bonus?.archetype ?? archetype ?? null;
  if (typeof entry.discovered !== "boolean") entry.discovered = false;
  if (typeof entry.seen !== "boolean") entry.seen = false;

  return entry;
}

// Publiczny punkt dostępu dla skryptów runtime ładowanych dynamicznie.
// Plik jest też uruchamiany w testach Node.js, gdzie obiekt window nie istnieje.
if (typeof window !== "undefined") {
  window.ensureCombatAffixCodexEntry = ensureCombatAffixCodexEntry;
}

function setAffixesForCodex() {
  if (!gameState?.char || !Array.isArray(baseBonuses)) return;

  for (const bonus of baseBonuses) {
    if (bonus.category !== "combat" || !bonus.id) continue;
    ensureCombatAffixCodexEntry(bonus.id, bonus.archetype);
  }
}

function parseSavePayload(serialized) {
  if (typeof serialized !== "string" || !serialized) return null;

  let parsed;
  try {
    parsed = JSON.parse(serialized);
  } catch (error) {
    return null;
  }

  if (
    !parsed ||
    typeof parsed !== "object" ||
    Array.isArray(parsed) ||
    !parsed.gameState ||
    typeof parsed.gameState !== "object" ||
    Array.isArray(parsed.gameState) ||
    !parsed.gameState.world ||
    typeof parsed.gameState.world !== "object" ||
    Array.isArray(parsed.gameState.world)
  ) {
    return null;
  }

  return parsed;
}

function initializeGameState(mode = "story") {
  let key = "save_story";

  if (mode === "expedition") key = "save_expedition";
  if (mode === "adventure") key = "save_adventure";

  const save = localStorage.getItem(key);
  window.RuntimeDiagnostics?.recordRecovery("save.load.start", {
    requestedMode: mode,
    key,
    saveExists: !!save,
    lastMode: localStorage.getItem("last_mode") || null
  });
  appState.recoveryNeeded = false;

  if (!save) {
    gameState = createNewGameState();
    gameState.world.mode = mode;
    appState.gameTime = 0;
    window.RuntimeDiagnostics?.recordRecovery("save.load.empty", {
      requestedMode: mode,
      loadedMode: gameState.world.mode,
      inCombat: gameState.world.inCombat
    });
    return;
  }

  const parsed = parseSavePayload(save);

  gameState = createNewGameState();

  if (!parsed) {
    appState.recoveryNeeded = true;
    gameState.world.mode = mode;
    appState.gameTime = 0;
    window.RuntimeDiagnostics?.recordRecovery("save.load.invalid", {
      requestedMode: mode,
      key,
      recoveryNeeded: appState.recoveryNeeded
    });
    return;
  }

  mergeDeep(gameState, parsed.gameState);
  gameState.world.mode = mode;

  const now = Date.now();
  const rawGameTime = parsed.meta?.gameTime;
  const rawSavedAtReal = parsed.meta?.savedAtReal;

  const savedGameTime =
    Number.isFinite(rawGameTime) && rawGameTime >= 0
      ? rawGameTime
      : 0;

  const savedAtReal =
    Number.isFinite(rawSavedAtReal) && rawSavedAtReal > 0
      ? rawSavedAtReal
      : now;

  const offlineMs = Math.max(0, now - savedAtReal);
  const offlineMsApplied = gameState.world.inCombat === true ? 0 : offlineMs;

  appState.gameTime = savedGameTime + offlineMsApplied;
  window.RuntimeDiagnostics?.recordRecovery("save.load.complete", {
    requestedMode: mode,
    key,
    loadedMode: gameState.world.mode,
    inCombat: gameState.world.inCombat === true,
    selectedSlotIndex: gameState.world.selectedSlotIndex ?? null,
    isCritical: gameState.combat?.flags?.isCritical === true,
    finisherResolved: gameState.combat?.flags?.finisherResolved === true,
    offlineMs,
    offlineMsApplied,
    recoveryNeeded: appState.recoveryNeeded
  });
}

/*function initializeGameState(mode = "story") {
  let key = "save_story";

  if (mode === "expedition") key = "save_expedition";
  if (mode === "adventure") key = "save_adventure";

  const save = localStorage.getItem(key);

  //console.error("enter initialize game state key, mode", key, mode);

  if (!save) {
    gameState = createNewGameState();
    gameState.world.mode = mode;
    return;
  }

  gameState = createNewGameState();
  
  const parsed = JSON.parse(save);
  mergeDeep(gameState, parsed);
  gameState.world.mode = mode;
}*/

/*function initializeGameState() {
  const save = localStorage.getItem("save");

  if (!save) return;

  //console.error("enter initialize game state after return");
  const parsed = JSON.parse(save);

  // nadpisujemy tylko dane, nie metody
  mergeDeep(gameState, parsed);
}*/

function mergeDeep(target, source) {
  for (const key in source) {
    if (
      source[key] &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key])
    ) {
      if (!target[key]) target[key] = {};
      mergeDeep(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
}

function getDefaultActionLock() {
  return {
    locked: false,
    until: 0,
    reason: null,
    allowedActions: []
  };
}

function saveLastMode() {
  localStorage.setItem("last_mode", gameState.world.mode);
}

function getSaveKey() {
  const mode = gameState.world?.mode;

  if (mode === "adventure") return "save_adventure";
  if (mode === "expedition") return "save_expedition";

  return "save_story";
}

function getLastMode() {
  return localStorage.getItem("last_mode") || "story";
}

function saveGame() {
  if (appState.recoveryNeeded) return;

  const mode = gameState.world?.mode;
  if (mode === "sandbox") return;

  const key = getSaveKey();
  const recoveryState = {
    mode,
    key,
    inCombat: gameState.world?.inCombat === true,
    selectedSlotIndex: gameState.world?.selectedSlotIndex ?? null,
    isCritical: gameState.combat?.flags?.isCritical === true,
    finisherResolved: gameState.combat?.flags?.finisherResolved === true,
    actionLockUntil: gameState.combat?.actionLock?.until ?? null,
    actionLockReason: gameState.combat?.actionLock?.reason ?? null
  };
  if (recoveryState.isCritical || recoveryState.inCombat) {
    window.RuntimeDiagnostics?.recordRecovery("save.write.start", recoveryState);
  }

  const payload = {
    gameState,
    meta: {
      savedAtReal: Date.now(),
      gameTime: appState.gameTime
    }
  };

  localStorage.setItem(key, JSON.stringify(payload));

  if (recoveryState.isCritical || recoveryState.inCombat) {
    window.RuntimeDiagnostics?.recordRecovery("save.write.complete", recoveryState);
  }
  saveLastMode();
  updateSaveState();
}

/*function saveGame() {
  const mode = gameState.world?.mode;

  if(mode === "sandbox") return;
  
  const key = getSaveKey();
  localStorage.setItem(key, JSON.stringify(gameState));
  
  saveLastMode();
  updateSaveState();
}*/

/*function saveGame() {
  localStorage.setItem("save", JSON.stringify(gameState));
  updateSaveState();
}*/


let appState = {
  engineStarted: false,
  saveExists: false,
  
  hitStop: false,
  
  timeScale: 1,
  slowMoUntil: 0,
  
  gameTime: 0,
  
  focusFxUntil: 0,
  focusFxActive: false,
  
  hasEnteredGameBefore: false,
  
  saveStoryExists: false,
  saveExpeditionExists: false,
  saveAdventureExists: false,
  
  compareBgLoaded: false,
  skillsTreeLoaded: false,
  mapInitialized: false,
  
  recoveryNeeded: false,
  
  soundsInitialized: false,
  
  startNewCampaign: false,
  
  isPaused: false,
  visibilityPaused: false,
  
  mode: "boot" // "boot" | "game" | "pause"
};

function updateSaveState() {
  appState.saveStoryExists = !!localStorage.getItem("save_story");
  appState.saveExpeditionExists = !!localStorage.getItem("save_expedition");
  appState.saveAdventureExists = !!localStorage.getItem("save_adventure");

  appState.saveExists =
    appState.saveStoryExists ||
    appState.saveExpeditionExists ||
    appState.saveAdventureExists;
}

/*function updateSaveState() {
  appState.saveExists = !!localStorage.getItem("save");
}*/

function startGameEngine() {
  if (appState.engineStarted) return;

  appState.engineStarted = true;

  lastTime = 0;
  accumulator100ms = 0;

  //gameLoopId = requestAnimationFrame(mainGameLoop);
  bootstrapGame();
}

function stopGameEngine() {
  if (!appState.engineStarted) return;

  appState.engineStarted = false;

  if (gameLoopId !== null) {
    cancelAnimationFrame(gameLoopId);
    gameLoopId = null;
    //clearAllIntervals();
  }

  lastTime = 0;
  accumulator100ms = 0;

  //console.log("Engine stopped cleanly");
}

function loadGame() {
  const save = localStorage.getItem("save");

  if (!save) return;

  gameState = createNewGameState();
  mergeDeep(gameState, JSON.parse(save));

  bootstrapGame();

  enterGame();
}
