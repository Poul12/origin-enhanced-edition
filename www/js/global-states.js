
function applyCharacterStats() {
  const baseCharacter = getBaseCharacter(); // odtwórz postać od zera
  const savedChar = gameState.char;

  // Zachowaj istotne dane
  baseCharacter.experience = savedChar.experience || 0;
  baseCharacter.expToNextLevel = savedChar.expToNextLevel || 125;
  baseCharacter.level = savedChar.level || 1;
  baseCharacter.skillPoints = savedChar.skillPoints || 0;
  baseCharacter.availableAttributePoints = savedChar.availableAttributePoints || 0;
  baseCharacter.attributes = savedChar.attributes || { vitality: 0, strength: 0, dexterity: 0 };
  baseCharacter.vit = savedChar.vit || 0;
  baseCharacter.str = savedChar.str || 0;
  baseCharacter.agi = savedChar.agi || 0;
  baseCharacter.gold = savedChar.gold || 0;
  baseCharacter.crit = savedChar.crit || 0;
  baseCharacter.critDmg = savedChar.critDmg || 0;
  baseCharacter.physDmgReduction = savedChar.physDmgReduction || 0;
  baseCharacter.hp = savedChar.hp ?? baseCharacter.maxHp;
  baseCharacter.baseDamage = savedChar.baseDamage || { weapon: 0, stats: 0, flat: 0, implicit: 0 };
  baseCharacter.atkSpd = savedChar.atkSpd || 1;
  baseCharacter.stamina = savedChar.stamina ?? baseCharacter.maxStamina;
  baseCharacter.staminaRegen = savedChar.staminaRegen || 0;
  baseCharacter.bonus = savedChar.bonus || 
  {
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
  };
  baseCharacter.energy = savedChar.energy || { current: 100, max: 100, savedAt: Date.now(), regenPerSecond: 0.1 };
  baseCharacter.energyRegen = savedChar.energyRegen || 0;
  baseCharacter.energyRegenBonus = savedChar.energyRegenBonus || 0;
  baseCharacter.resist = savedChar.resist || {};
  baseCharacter.lifeRegen = savedChar.lifeRegen || 0;
  baseCharacter.lifeOnHit = savedChar.lifeOnHit || 0;
  baseCharacter.dodge = savedChar.dodge || 0;
  baseCharacter.dodgeCostReduce = savedChar.dodgeCostReduce || 0;
  baseCharacter.moveCostReduce = savedChar.moveCostReduce || 0;
  baseCharacter.perfectBlockEnergy = savedChar.perfectBlockEnergy || 0;
  baseCharacter.critEnergy = savedChar.critEnergy || 0;
  baseCharacter.perfectWindowBonus = savedChar.perfectWindowBonus || 0;
  baseCharacter.blockPower = savedChar.blockPower || 0;
  baseCharacter.tacticalBlock = savedChar.tacticalBlock || 0;
  baseCharacter.blockMode = savedChar.blockMode || `defensive`;
  baseCharacter.currentStep = savedChar.currentStep || 0;
  baseCharacter.magicFind = savedChar.magicFind|| 0;
  baseCharacter.goldFind = savedChar.goldFind|| 0;
  baseCharacter.penaltyAtkSpd = savedChar.penaltyAtkSpd || 0;
  baseCharacter.penaltyDmg = savedChar.penaltyDmg || 0;
  baseCharacter.baseCooldown = savedChar.baseCooldown || 0;
  baseCharacter.penaltyCooldown = savedChar.penaltyCooldown || 0;
  baseCharacter.regenBuffer = savedChar.regenBuffer || 0;
  baseCharacter.regenAllowedAt = savedChar.regenAllowedAt || 0;
  baseCharacter.elementalDmg = savedChar.elementalDmg || 0;
  baseCharacter.typeOfElementalDmg = savedChar.typeOfElementalDmg || `fire`;
  baseCharacter.equipment = savedChar.equipment || {};
  baseCharacter.style = savedChar.style || {};

  renderStats();
}


/*function getGameTime() {
  if (gameState.globalTime.isPaused) {
    return gameState.globalTime.pauseStartedAt - gameState.globalTime.timeOffset;
  }

  return Date.now() - gameState.globalTime.timeOffset;
}

function pauseGame() {
  if (gameState.globalTime.isPaused) return;

  gameState.globalTime.isPaused = true;
  gameState.globalTime.pauseStartedAt = Date.now();
}

function resumeCombat() {
  if (!gameState.globalTime.isPaused) return;

  const pausedDuration = Date.now() - gameState.globalTime.pauseStartedAt;
  gameState.globalTime.timeOffset += pausedDuration;

  gameState.globalTime.isPaused = false;
}*/


function getGameTime() {
  return appState.gameTime;
}

function pauseGame() {
  appState.isPaused = true;
}

function resumeCombat() {
  appState.isPaused = false;
  lastTime = 0;
}


function formatTimeLeft(ms) {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function updateFoodState() {
  const foodState = gameState.resources.foodState;
  if (!foodState.active || !foodState.expiresAt) return;

  if (Date.now() >= foodState.expiresAt) {
    foodState.active = false;
    foodState.expiresAt = null;
    foodState.penalty = 1;

    //saveFoodState();
    renderInventory(); 
    //updateFoodUI();   
  }
}

function updateCampfireState() {
  const firecampState = gameState.resources.firecampState;
  const opt = gameState.world.exploreOptions[firecampState.slotIndex];
  const campfireNow = Date.now();
   
  if (firecampState.active && firecampState.expiresAt && campfireNow >= firecampState.expiresAt) {
      firecampState.active = false;
      firecampState.expiresAt = null;
      
      opt.used = true;
      opt.firecampUsed = true;
      firecampState.slotIndex = 0;
    
      //saveState();
      renderStats();
      renderOptions();
      //saveFire();
  }
}

function getFoodDebuffMultiplier() {
  const resources = gameState.resources;
  return resources.foodState.active ? (1 - resources.foodState.penalty) : 1;
}

function updateEnergyUI() {
  const resources = gameState.resources;
  const el = document.getElementById("energy");
  //console.error(`enter updateEnergyUI`);

  if (!el) return;

  const value = Math.floor(resources.energyState.current);
  const percent = value / resources.energyState.max;

  el.textContent = value;

  el.className = "stat-main";

  //console.error(`updateEnergyUI`, value);
  
  if (percent > 0.6) el.classList.add("energy-high");
  else if (percent > 0.3) el.classList.add("energy-mid");
  else if (percent > 0.1) el.classList.add("energy-low");
  else el.classList.add("energy-critical");
  
  
  if(gameState.char.combatAffixes[`crit_while_energy_fatique`] && gameState.combat.energyBonus.critBonus.isActive) {
    if(percent > 0.1) {
      //console.log(`end of energy fatique`);

      gameState.combat.energyBonus.critBonus.isActive = false;
      
      gameState.combat.activeBonus.critSources.energy = 0;
      recalculateCritBonus();
    }
  }
  
  if(gameState.char.combatAffixes[`dmg_while_energy_fatigue`] && gameState.combat.energyBonus.dmgBonus.isActive) {
    if(percent > 0.1) {
      //console.log(`end of energy fatique`);

      gameState.combat.energyBonus.dmgBonus.isActive = false;
      
      gameState.combat.activeBonus.dmgSources.energy = 0;
      recalculateDamageBonus();
    
      clearAllDiffs(`dmg`);
    }
  }

  if(percent > 0.1) {
    gameState.combat.stats.energyFatigueStack = 0;
  }
  
}

function getEnergyCostForSlot(type) {
  if (gameState.resources.energyState.noEnergyUse) return 0;
  const moveCostReduce = 1 - gameState.char.moveCostReduce || 1;

  switch (type) {
    case "enemy": return 10;
    case "chest": return 8;
    case "shrine": return 6;
    case "story_event": return 10;
    case "story_enemy": return 10;
    case "mini_boss": return 30;
    //case "move": return 1 * moveCostReduce;
    case "next_step": return 6 * moveCostReduce;
    case `flee`: return 5;
    default: return 1;
  }
}

function spendEnergy(type) {
  if(gameState.world.mode === `expedition`) return true;
  
  const amount = getEnergyCostForSlot(type);
  const energyState = gameState.resources.energyState;
  const isNotAllowed = ["chest", "next_step"].includes(type);
  //console.error(`isNotAllowed, energyState.current, amount`, isNotAllowed, energyState.current, amount);
  if(isNotAllowed && energyState.current < amount) {
    showInfoAlert(`Za mało energii!`);
    return false;
  }
  
  energyState.current = Math.max(0, energyState.current - amount);
  //saveEnergy();
  updateEnergyUI();
  flashEnergy();
  
  return true;
  
  if(energyState.current < energyState.isLow()) {
  
  }
}

function flashEnergy() {
  const el = document.getElementById("energy");
  if (!el) return;
  
  el.classList.add("energy-flash");
  setTimeout(() => el.classList.remove("energy-flash"), 200);
}

function updateEnergy() {
  const energyState = gameState.resources.energyState;
  //const opt = world.exploreOptions[resources.firecampState.slotIndex];
  const now = Date.now();
  const delta = (now - energyState.lastUpdateAt) / 1000;
  energyState.lastUpdateAt = now;
  
  if (energyState.current >= energyState.max) return;

  const bonusRegen = gameState.char.energyRegenBonus || 1;
  const fireCampMultiplier = getEnergyRegenMultiplier();
  let inTownRegen = 1;
    
  const debuff = getFoodDebuffMultiplier();
    
  if(isLocationWithTown() && gameState.world.currentStepIndex === 0) {
    inTownRegen = 2.5;
  } 
  
  let passiveEnegyRegen = 1;
  if(gameState.char.bonus.energyRegen) passiveEnegyRegen = gameState.char.bonus.energyRegen;
    
  //console.error(`energyState.regenPerSecond, fireCampMultiplier, bonusRegen, debuff, inTownRegen`, energyState.regenPerSecond, fireCampMultiplier, bonusRegen, debuff, inTownRegen);

  const actualRegen =
    energyState.regenPerSecond *
    passiveEnegyRegen *
    bonusRegen *
    fireCampMultiplier * 
    debuff *
    inTownRegen
  ;
    
  //console.error(`actualRegen and debuff and foodState and expiresAt`, actualRegen, debuff, resources.foodState.active, resources.foodState.expiresAt);
  energyState.current += delta * actualRegen;
  if (energyState.current > energyState.max) energyState.current = energyState.max;

  //console.error(`energyState.current, delta, energyState.lastUpdateAt`, energyState.current, delta, energyState.lastUpdateAt);
  //saveEnergy();
  updateEnergyUI();
}

function gainEnergy(amount) {
  gameState.resources.energyState.current = Math.min(gameState.resources.energyState.max, gameState.resources.energyState.current + amount);
  updateEnergyUI();
}

function isLowEnergy() {
  return gameState.resources.energyState.current <= 10;
}

function showEnergyGain(amount) {
    const container = document.querySelector("#energy-stat-id .energy-popup-container");

    const popup = document.createElement("div");
    popup.className = "energy-popup";
    popup.textContent = `+${amount}`;
  
    container.appendChild(popup);
 
    flashEnergy();
  
    popup.addEventListener("animationend", () => popup.remove());
}

function showStaminaPopup(amount){
    const container = document.querySelector(".stamina-popup-container");

    const popup = document.createElement("div");
    popup.className = "stamina-popup";

    popup.textContent = amount > 0
        ? `+${amount}`
        : `${amount}`;

    container.appendChild(popup);

    const orb = document.querySelector(".stamina-orb");

    orb.classList.remove("gain");
    void orb.offsetWidth;
    orb.classList.add("gain");
  
    popup.addEventListener("animationend", () => popup.remove());
}

let staminaSaveCooldown = false;

function saveStamina() {
  if (staminaSaveCooldown) return;

  staminaSaveCooldown = true;

  setTimeout(() => {
    //const char = getCharacter();
    gameState.char.stamina = Math.round(gameState.resources.staminaState.current);
    staminaSaveCooldown = false;
    //saveGame();
  }, 300);
}

function initStamina() {
  const char = gameState.char;
  const staminaState = gameState.resources.staminaState;
  //console.error(`init char.maxStamina`, char.maxStamina);
  //console.error(`init char.stamina`, char.stamina);
 
  staminaState.max = Math.floor(char.maxStamina);
  staminaState.current = char.stamina;
  staminaState.regenPerSecond = char.staminaRegen;
}

function gainStamina(amount) {
  const staminaState = gameState.resources.staminaState;

  staminaState.current = Math.min(
        staminaState.max,
        staminaState.current + amount
    );
}

function triggerStaminaBreak() {
  const staminaState = gameState.resources.staminaState;

  staminaState.disabled = true;
  staminaState.lastSpendTs = performance.now();

  setTimeout(() => {
    staminaState.disabled = false;
    //console.error(`staminaState.disabled turn to false`, staminaState.disabled);
  }, staminaState.breakDurationMs);
}

function spendStamina(amount) {
  const staminaState = gameState.resources.staminaState;
  //console.error(`spend stamina enter staminaState.disabled`, staminaState.disabled);
  
  if (staminaState.current < amount) {
    showReward(`${t("low_stamina_reward")}`);
    playSound(`error`);
    return false;
  }
  
  //console.error(`spend stamina before staminaState.disabled`, staminaState.disabled);
  
  if (staminaState.disabled) return false;

  if(gameState.char.combatAffixes[`stamina_cost_after_dodge`]) {
    //console.error(`spend stamina base amount`, amount);
    const value = gameState.char.combatAffixes[`stamina_cost_after_dodge`].value;
    const reducedCost = 1 - (value / 100);
    amount = getReducedStaminaCost(amount, reducedCost);
    //console.error(`spend stamina amount after dodge`, amount);
  }
  
  staminaState.current -= amount;

  //console.error(`spend stamina before staminaState.current`, staminaState.current);

  if (staminaState.current <= 0) {
    staminaState.current = 0;
    triggerStaminaBreak();
    //saveStamina();
    return false;
  }

  staminaState.lastSpendTs = performance.now();
  //saveStamina();
  saveGame();
  return true;
}

function staminaRegenTick() {
  const staminaState = gameState.resources.staminaState;
  //console.error(`staminaRegenTick enter staminaState.disabled`, staminaState.disabled);

  if (staminaState.disabled) return;
  //console.error(`staminaRegenTick after first return staminaState.current`, staminaState.current);

  if (staminaState.current >= staminaState.max) return;

  const now = performance.now();
  const sinceSpend = now - staminaState.lastSpendTs;
  
  //console.error(`staminaRegenTick before sinceSpend, staminaState.lastSpendTs`, sinceSpend, staminaState.lastSpendTs);

  // ⛔ regen delay po akcji
  //if (sinceSpend < staminaState.regenDelayMs) return;

  // ⚔️ wolniejszy regen w walce
  let regenMultiplier = staminaState.inCombat ? 0.6 : 1;
  
  const isExhausted = staminaState.fatigue === "exhausted" || staminaState.fatigue === "critical";
  
  const exhaustedBonus = gameState.combat.exhaustedBonus;
  
  /*if(isExhausted) {
    if(!exhaustedBonus.staminaBonus.isActive && gameState.char.combatAffixes["stamina_regen_exhausted"]) {
      const value = gameState.char.combatAffixes["stamina_regen_exhausted"].value;
      
      exhaustedBonus.staminaBonus.isActive = true;
      exhaustedBonus.staminaBonus.bonusRegen = value;   
      
      //console.error(`staminaState.regenPerSecond added, regenMultiplier, char.staminaRegen`, staminaState.regenPerSecond, regenMultiplier, gameState.char.staminaRegen);
    }
  } else {
    if(exhaustedBonus.staminaBonus.isActive && gameState.char.combatAffixes["stamina_regen_exhausted"]) {
      exhaustedBonus.staminaBonus.isActive = false;
      exhaustedBonus.staminaBonus.bonusRegen = 0;
      
      //console.log(`staminaState.regenPerSecond !isExhausted, regenMultiplier, char.staminaRegen`, staminaState.regenPerSecond, regenMultiplier, gameState.char.staminaRegen);
    }
  }*/
  
  const regenPerTick =
    (staminaState.regenPerSecond / 10) * regenMultiplier;
  
  staminaState.actualRegen = staminaState.regenPerSecond * regenMultiplier;
  
  staminaState.current = Math.min(
    staminaState.max,
    staminaState.current + regenPerTick
  );
  
  const enemy = gameState.world.exploreOptions[gameState.world.selectedSlotIndex]?.enemyData;

  if(isExhausted) {
    
    if(!exhaustedBonus.dmgBonus.isActive && gameState.char.combatAffixes["dmg_exhausted"]) {
      const value = gameState.char.combatAffixes["dmg_exhausted"].value;
      //gameState.combat.activeBonus.dmg += value;
      exhaustedBonus.dmgBonus.isActive = true;
      
      gameState.combat.activeBonus.dmgSources.exhausted = value;
      recalculateDamageBonus();
      
      //showBuff("dmg", gameState.combat.activeBonus.dmg);
      //showPercentBuff("dmg", gameState.combat.activeBonus.dmg);
    }
    
    if(!exhaustedBonus.defBonus.isActive && gameState.char.combatAffixes["def_exhausted"]) {
      const value = gameState.char.combatAffixes["def_exhausted"].value;
      //gameState.combat.activeBonus.def += value;
      exhaustedBonus.defBonus.isActive = true;
      
      gameState.combat.activeBonus.defSources.exhausted = value;
      recalculateDefenseBonus();
      
      //console.error(`exhausted add, value`, gameState.combat.activeBonus.def, value);

      //showBuff("def", gameState.combat.activeBonus.def);
    }
    
    if(gameState.char.combatAffixes[`crit_exhausted`]) {
      const critBonus = gameState.char.combatAffixes[`crit_exhausted`].value;
      gameState.combat.activeBonus.critSources.exhausted = critBonus;
      recalculateCritBonus();
    }

    updateStatusPlayerUI(enemy);
  } else {
    if (exhaustedBonus.dmgBonus.isActive && gameState.char.combatAffixes["dmg_exhausted"]) {
      const value = gameState.char.combatAffixes["dmg_exhausted"].value;
      //decreaseBonusDmgBuff(value);
      
      gameState.combat.activeBonus.dmgSources.exhausted = 0;
      recalculateDamageBonus();
      
      exhaustedBonus.dmgBonus.isActive = false;
      //console.log(`exhausted isActive !isExhausted`, gameState.combat.exhaustedBonus.dmgBonus.isActive);
      
      clearAllDiffs("dmg");
    }
    
    if (exhaustedBonus.defBonus.isActive && gameState.char.combatAffixes["def_exhausted"]) {
      const value = gameState.char.combatAffixes["def_exhausted"].value;
      //console.error(`exhausted before decrease, value`, gameState.combat.activeBonus.def, value);

      //decreaseBonusDefBuff(value);
      
      gameState.combat.activeBonus.defSources.exhausted = 0;
      recalculateDefenseBonus();
      
      exhaustedBonus.defBonus.isActive = false;
      //console.error(`exhausted isActive !isExhausted`, gameState.combat.exhaustedBonus.dmgBonus.isActive);
      //console.error(`exhausted decrease, value`, gameState.combat.activeBonus.def, value);

      clearAllDiffs("def");
    }

    if(gameState.char.combatAffixes[`crit_exhausted`]) {
      gameState.combat.activeBonus.critSources.exhausted = 0;
      recalculateCritBonus();
    }
    
    updateStatusPlayerUI(enemy);
    
  }
  
  
  
  //saveStamina();
}

function renderStamina() {
  renderStaminaOrb(
    Math.round(gameState.resources.staminaState.current),
    gameState.resources.staminaState.max
  );
}

/*function loadCharacter() {
  const char = gameState.char;
  player = char ?? getBaseCharacter();
}*/

function applyLifeRegen(char) {
  const now = Date.now();

  if (!char.lastRegenTs) {
    char.lastRegenTs = now;
    return char;
  }
  
  // ❌ brak regeneracji
  if (char.inCombat || char.hp >= char.maxHp || char.lifeRegen <= 0 || now < char.regenAllowedAt) {
    char.lastRegenTs = now;
    return char;
  }
  
  const hpRegen = char.lifeRegen;
  
  const deltaSec = (now - char.lastRegenTs) / 1000;
  const gainedHp = Math.floor(deltaSec * hpRegen);
  
  if (gainedHp > 0) {
    char.hp = Math.min(char.hp + gainedHp, char.maxHp);
    char.lastRegenTs += gainedHp / hpRegen * 1000;
  }

  return char;
}

function startFirecamp(i) {
  const opt = gameState.world.exploreOptions[i];
  const firecampState = gameState.resources.firecampState;
  
  firecampState.active = true;
  firecampState.expiresAt = Date.now() + 12000;
  firecampState.slotIndex = i;
  
  opt.used = false;
  
  firecampState.available = 0;
  
  //saveState();
  renderStats();
  renderOptions();
 }

function initCampfireState() {
  const firecampState = gameState.resources.firecampState;
 
  firecampState.active = firecampState.expiresAt > Date.now();
  /*firecampState.expiresAt = saved.expiresAt;
  firecampState.slotIndex = saved.slotIndex ?? null;*/
}

function restoreFirecampState() {
  const firecampState = gameState.resources.firecampState;
 
  if (!firecampState?.expiresAt) return;

  const now = Date.now();

  if (now >= firecampState.expiresAt) {
    firecampState.active = false;
    firecampState.expiresAt = null;
  } else {
    firecampState.active = true;
  }
}

function getEnergyRegenMultiplier() {
  if (gameState.resources.firecampState.active && Date.now() < gameState.resources.firecampState.expiresAt) {
    return 8;
  }
  return 1;
}

function restoreEnergyAfterLoad() {
  const energyState = gameState.resources.energyState;
  
  const now = Date.now();
  const elapsed = (now - energyState.lastUpdateAt) / 1000;

  let multiplier = 1;
  if (gameState.resources.firecampState.active && now < gameState.resources.firecampState.expiresAt) {
    multiplier = 8;
  }

  const gained = elapsed * energyState.regenPerSecond * multiplier;

  energyState.current = Math.min(
    energyState.max,
    energyState.current + gained
  );

  energyState.lastUpdateAt = now;
      
  //saveEnergy();
  updateEnergyUI();
}