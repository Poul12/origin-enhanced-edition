
const enemyAttackTimeline = {
      duration: 1500,
      elapsed: 0,
      speed: 1,
      isPaused: false,
      isRunning: false,
      lastFrameTime: null,
      rafId: null,
      phase: "windup"
    };

function nowMs() {
  return performance.now();
}

// ===================== PAUSE / RESUME =====================

function pauseEnemyAttack(enemy, slotIndex) {
  const timeline = enemyAttackTimeline;
  timeline.isPaused = true;
      
  pauseAnimation(enemy);
      
  // zapamiętaj pozostały czas efektów
  if (enemy.status.slowEnd) {
    //enemy.status.slowRemaining = enemy.status.slowEnd - Date.now();
    enemy.status.slowRemaining = enemy.status.slowEnd - nowMs();
  }
  if (enemy.status.stunEnd) {
    enemy.status.stunRemaining = enemy.status.stunEnd - nowMs();
    //enemy.status.stunRemaining = enemy.status.stunEnd - Date.now();
  }
}

function resumeEnemyAttack(enemy, slotIndex) {
  const timeline = enemyAttackTimeline;
  timeline.isPaused = false;

  resumeAnimation(enemy);
      
  // przywróć timery statusów
  if (enemy.status.slowRemaining != null) {
    //enemy.status.slowEnd = Date.now() + enemy.status.slowRemaining;
    enemy.status.slowEnd = nowMs() + enemy.status.slowRemaining;
    enemy.status.slowRemaining = null;
  }

  if (enemy.status.stunRemaining != null) {
    enemy.status.stunEnd = nowMs() + enemy.status.stunRemaining;
    //enemy.status.stunEnd = Date.now() + enemy.status.stunRemaining;
    enemy.status.stunRemaining = null;
  }
}

function emitEnemyAttackWindup({ enemy, slotIndex, duration }) {
  window.dispatchEvent(
    new CustomEvent("enemy-attack-windup", {
      detail: {
        enemy,
        slotIndex,
        duration,
        startTime: performance.now()
      }
    })
  );
}

function startEnemyAttackTimeline(enemy, slotIndex) {
  const baseCooldown = calculateCooldown(enemy.atkSpd, enemy) * 1000;

  enemy.attackState = {
    phase: "cooldown",
    remaining: baseCooldown,
    baseCooldown,
    cooldownDuration: baseCooldown,
    windupDuration: enemy.windupDuration,
    slotIndex,
  };

  enemy.intent = null;
  enemy.intentReadyAt = 0;
      
  enemyAttackTimeline.isRunning = true;
  enemyAttackTimeline.isPaused = false;

  updateCooldownBar(enemy, 0, slotIndex);
}


function updateEnemyAttack(delta) {
  const timeline = enemyAttackTimeline;

  if (!timeline.isRunning || timeline.isPaused) return;

  const enemy = gameState.world.exploreOptions[gameState.world.selectedSlotIndex]?.enemyData;

  if (!enemy?.attackState) return;

  const state = enemy.attackState;

  //state.windupDuration = enemy.windupDuration || 600;
      
  // === STATUS CHECK ===
  const now = performance.now();
        
  if (enemy.spear && getGameTime() > enemy.spear.expiresAt) {
    resetSpear(enemy);
    resetSpearUI();
    stopSpearControlUI();
    delete enemy.spear;
  }
      
  decayBleedStacks(enemy);
      
  decayArmorBreakStacks(enemy);
      
  decayComboStack(enemy, gameState.combat.activeRingMode); 
      
  if (enemy.status.slowEnd && now >= enemy.status.slowEnd) {
    clearEnemySlow(enemy, state.slotIndex);
  }

  if (enemy.status.stunEnd && now >= enemy.status.stunEnd) {
    clearEnemyStun(enemy, state.slotIndex);
  }

  // === STUN ===
  if (enemy.status.stun) {
    delta = 0;
  }

  // === SLOW ===
  let timeScale = 1;
  if (enemy.status.slow) {
    timeScale *= enemy.status.slow / 100 || 0.5;
  }

  if (enemy.spear) {
    timeScale *= (1 - enemy.spear.slow);
  }
      
  delta *= timeScale;

  state.remaining -= delta;

  // ======================
  // COOLDOWN PHASE
  // ======================
  if (state.phase === "cooldown") {
   
    enemy.canBeInterrupted = false;
    
    const progress = 1 - state.remaining / state.cooldownDuration;
    updateCooldownBar(enemy, progress * 100, state.slotIndex);
        
    if(enemy.vulnerable) {
      const windupBar = document.getElementById(`enemy-windup-bar-${state.slotIndex}`);
      windupBar.classList.remove(`show`);
    }
        
    if (gameState.combat.playerBlock.lastResult === "perfect") {
        setSkillDisabled("riposte", false);
    }
        
    if(!enemy.status.slow || !enemy.status.stun || enemy.isGuarding) {
      setSkillDisabled("opening-strike", false);
    }
        
    if(enemy.isGuarding) {
      setSkillDisabled("opening-strike", true);
    }
 
         
    if (state.remaining <= 0) {
      
      setSkillDisabled("opening-strike", true);
          
      if (gameState.combat.playerBlock.mode === "timed") {
        setSkillDisabled("riposte", true);
        gameState.combat.playerBlock.lastResult = null;
      }
          
      rollEnemyIntent(enemy);
          
      if(enemy.isGuarding) {
        enemy.isGuarding = false;
        gameState.combat.flags.windupEnd = true;
        updateStatusEnemyUI(enemy);
      }

      if (enemy.isCharged && (enemy.intent.type === "attack" || enemy.intent.type === "heavy")){
        state.phase = "windup";
        state.remaining = 0;

        gameState.combat.flags.windupEnd = true;
        updateStatusEnemyUI(enemy);

      } else {
        state.phase = "windup";

        let windup = enemy.windupDuration * gameState.combat.openingStrike.windUpMultiplier;

        if (gameState.combat.sweep.isActive) {
          windup += gameState.combat.sweep.windup;
          addWeaponMasteryExp(`warden`, 2, `sweep windup`);
        }
            
        if (enemy.spear) {
          windup += enemy.spear.windupBonus;
        }

        if(gameState.combat.enemyAtkspdBuff.isActive) {
          windup *= 1 - gameState.combat.enemyAtkspdBuff.value;
        }
            
        state.remaining = windup;
        state.windupDuration = windup;
            
        updateCooldownBar(enemy, 100, state.slotIndex);

        if(enemy.intent.type === "attack" || enemy.intent.type === "heavy" || enemy.intent.type === "skill") {
          const windupBar = document.getElementById(`enemy-windup-bar-${state.slotIndex}`);
          windupBar.classList.add(`show`);
        }
            
        if (gameState.combat.playerBlock.mode === "timed" &&
          !perfectBlockTimingActive &&
          intentDealsAttack(enemy.intent)) {
            if(!gameState.combat.enemyAtkspdBuff.isActive) {
              setTimeout(() => activateTimedBlock(), 200);
            }
        }
      
        //updateWindupBar(enemy, 1, state.slotIndex);
            
        emitEnemyAttackWindup({
          enemy,
          slotIndex: state.slotIndex,
          duration: windup
        });
      }
          
    }
  }

  // ======================
  // WINDUP PHASE
  // ======================
  else if (state.phase === "windup") {
        
    //console.error(`state.remaining windup`, state.remaining);  
    //const progress = state.remaining / state.windupDuration;
    const progress = Math.max(0, Math.min(1, state.remaining / state.windupDuration));
    updateWindupBar(enemy, progress, state.slotIndex);
                   
    if (state.remaining <= 0 ) {
      //console.error(`end windup playerBlock.mode`, gameState.combat.playerBlock.mode);
          
      const windupBar = document.getElementById(`enemy-windup-bar-${state.slotIndex}`);
      windupBar.classList.remove(`show`);
          
      //let dmgMultiplier = 1;
          
      if(!gameState.combat.flags.isBlocked) {      
        state.result = executeEnemyIntent(enemy);
      }     
      /*if (enemy.intent) {
        dmgMultiplier = executeEnemyIntent(enemy);
      }*/
          
      //console.error(`state.result.type`, state.result.type);
   
     if (state.result.type === "skill" && !gameState.combat.flags.isBlocked) {
        //console.error(`state.result.type (skill)`, state.result.type);
        executeEnemySkill(
          enemy,
          enemy.intent.skillId
        );
      }
          
      if (intentDealsAttack(enemy.intent) && !gameState.combat.flags.isBlocked) {
       // console.error(`dmgMultiplier`, state.result.dmgMultiplier);
       // console.error(`before attack playerBlock.mode`, gameState.combat.playerBlock.mode);
  
        performIntentAttack(enemy, state.slotIndex, {multiplier: state.result.dmgMultiplier});
        if(gameState.combat.playerBlock.mode === "timed") {
         // console.error(`STOP TIMED BLOCK! (enemy)`);
          stopTimedBlockUI();
        }      
      } 
          
      gameState.combat.flags.isBlocked = false;
          
      //performEnemyAttack(enemy, state.slotIndex, { multiplier: dmgMultiplier });
          
      //enemy.canBeInterrupted = false;
          
      state.phase = "cooldown";
      state.remaining = state.baseCooldown;
          
      if(gameState.combat.enemyAtkspdBuff.isActive) {
        state.remaining *= 1 - gameState.combat.enemyAtkspdBuff.value;
      }
          
      state.cooldownDuration = state.remaining;
          
      if(state.result.type === "utility"){
        state.phase = "action";
        state.remaining = state.result.duration;
      }
          
                
      //console.error(`state.phase windup, result.type`, state.phase, result.type);    
    
      updateCooldownBar(enemy, 0, state.slotIndex);
      //startAnimation(enemy, state.baseCooldown, state.slotIndex);
    }
  }
      
  // ======================
  // ACTION PHASE
  // ======================
  else if (state.phase === "action") {
    //console.error(`state.phase action`, state.phase, state.remaining);    
    if(state.remaining <= 0) {
          
      if(enemy.intent.type === "guard") {
         //enemy.isGuarding = false;
         enemy.guardCounter = true;
      }
          
      if(enemy.intent.type === "charge"){
          enemy.isCharged = true;
          //enemy.isCharging = false;
      }
          
      //console.error(`state.phase remainig`);    
          
      if(enemy.intent.type !== "guard") {
         //enemy.isGuarding = false;
         enemy.intent = null;
      }
          
      state.phase = "cooldown";
      state.remaining = getEnemyNextCooldown(enemy, state);
      state.cooldownDuration = state.remaining;
          
      updateCooldownBar(enemy, 0, state.slotIndex);

    }
  }
}

function getEnemyNextCooldown(enemy, state) {
  let cd = state.baseCooldown;

  if (enemy.isCharging) {
    cd *= 0.65;
    enemy.isCharging = false;
  }
      
  if(gameState.combat.enemyAtkspdBuff.isActive) {
    cd *= 1 - gameState.combat.enemyAtkspdBuff.value;
  }
        
  return cd;
}

function performIntentAttack(enemy, slotIndex, options = {}) {
  //console.error("NORMAL ATTACK");

  let finalMultiplier = options.multiplier || 1;

  // bonus po charge
  if (enemy.isCharged) {
    finalMultiplier *= 2;
    enemy.isCharged = false;
    
    showEnemyOutcome("miss", `${t("ram_outcome")}`, 1200);
  }

  if(enemy.guardCounter){
   finalMultiplier *= 1.2;
   enemy.guardCounter = false;
  }
      
  /*if(enemy.intent === "guard") {
    enemy.isGuarding = false;
  }*/
      
  gameState.combat.flags.windupEnd = true;
  updateStatusEnemyUI(enemy);
      
  performEnemyAttack(enemy, slotIndex, {
    multiplier: finalMultiplier
  });
}

function updateBleed(delta) {
  if (gameState.world.selectedSlotIndex === null) return;

  const enemy = gameState.world.exploreOptions[gameState.world.selectedSlotIndex]?.enemyData;

  //if(!enemy?.bleed?.duration) return; 
  if (!enemy?.bleed?.stacks?.length) return;
      
  if (enemy.currentHp <= 0 || !gameState.world.inCombat) return;
      
  setSkillDisabled("blood-frenzy", false);
  setSkillDisabled("blood-pact", false);
  setSkillDisabled("blood-reaver", false);
  
      
  const bleed = enemy.bleed;

  bleed.timer += delta;

  let totalBleedDamage = 0;
      
  let tickRate = bleed.tickRate;
      
  if(gameState.char.combatAffixes["bleed_accelerate"]) {
    //console.error(`bleed.tickRate before bonus`, tickRate);
    const value = gameState.char.combatAffixes["bleed_accelerate"].value;
    tickRate *= 1 - (bleed.stacks.length * value / 100);
    //console.error(`bleed.tickRate after bonus`, tickRate);
  }
      
  while (bleed.timer >= tickRate) {
    bleed.timer -= bleed.tickRate;

    //totalBleedDamage = bleed.damage;

    //console.error(`bleed.duration`, bleed.duration);   
 
    if(!gameState.combat.blockingBonus.bleedBonus.wasAdded && gameState.combat.blockingBonus.bleedBonus.isActive && gameState.char.combatAffixes[`bleed_duration_while_blocking`]) {
      const durationBonus = gameState.char.combatAffixes[`bleed_duration_while_blocking`].value || 0;
      gameState.combat.blockingBonus.bleedBonus.wasAdded = true;
      //console.error(`bleed.duration after bonus`, bleed.duration);
      for (const stack of bleed.stacks) {
        stack.duration += durationBonus;
      }
    }
        
    for (const stack of bleed.stacks) {
      totalBleedDamage += stack.damage;
    }

    if(gameState.char.combatAffixes["bleed_per_stack_damage"]) {
      //console.error(`totalBleedDamage before bonus`, totalBleedDamage);
      const value = gameState.char.combatAffixes["bleed_per_stack_damage"].value;
      totalBleedDamage *= 1 + (bleed.stacks.length * value / 100);
      //console.error(`totalBleedDamage after bonus`, totalBleedDamage);
    }
        
    if (totalBleedDamage > 0 && !gameState.combat.flags.isCritical) {
      dealBleedDamage(enemy, totalBleedDamage, gameState.world.selectedSlotIndex);
    }
        
    //bleed.duration -= bleed.tickRate;
        
    for (let i = bleed.stacks.length - 1; i >= 0; i--) {
      bleed.stacks[i].duration -= bleed.tickRate;
          
      if (bleed.stacks[i].duration <= 0) {
        bleed.stacks.splice(i, 1);
      }
    }
        
  }

  if(gameState.char.combatAffixes[`execute_bleeding`] && bleed.stacks.length >= 2) {
    const dmgBonus = gameState.char.combatAffixes[`execute_bleeding`].value;
    gameState.combat.activeBonus.dmgSources.bleed = dmgBonus;
    recalculateDamageBonus();
  }
      
   //console.error(`totalBleedDamage`, totalBleedDamage);   
      
  /*if (totalBleedDamage > 0) {
    dealBleedDamage(enemy, totalBleedDamage, gameState.world.selectedSlotIndex);
  }*/

  // 🔥 CLEANUP
  /*if (bleed.duration <= 0) {
    clearBleed(enemy);
  }*/
      
  if(!bleed.stacks.length) {
    clearBleed(enemy);
  }
}

function clearBleed(enemy) {
  enemy.bleed = null;
  gameState.combat.blockingBonus.bleedBonus.wasAdded = false;
  updateStatusEnemyUI(enemy);
      
  gameState.combat.activeBonus.dmgSources.bleed = 0;
  recalculateDamageBonus();
  clearAllDiffs(`dmg`);

  if(gameState.char.combatAffixes[`crit_while_bleed`]) {
    gameState.combat.activeBonus.critSources.bleed = 0;
    recalculateCritBonus();
  }

  setSkillDisabled("blood-frenzy", true);
  setSkillDisabled("blood-pact", true);
  setSkillDisabled("blood-reaver", true);
  
      
 // console.log("BLEED CLEARED");
}

function dealBleedDamage(enemy, damage, index) {
  const prevHp = enemy.currentHp;

  //enemy.currentHp -= Math.floor(damage);
  enemy.currentHp -= Math.ceil(damage);
      
 // console.log("BLEED damage", damage);
  
  if (enemy.currentHp <= 0) {
    clearBleed(enemy);
    enemy.currentHp = 0;

    addWeaponMasteryExp(`berserker`, 5, `bleed-kill`);

    exitCombat();
    hideFleeButton();
    winCombat();
    stopEnemyAttack(gameState.world.selectedSlotIndex); // linia czasu wroga – STOP
        
    if(gameState.char.combatAffixes[`energy_bleed_kill`]) {
      const energyGain = gameState.char.combatAffixes[`energy_bleed_kill`].value;
      gainEnergy(energyGain);
      //showReward(`+${(energyGain).toFixed(1)} ${t("to_energy_reward")}`, 2300);
      showEnergyGain(energyGain);
     // console.error(`energy gain on kill`, energyGain); 
    }          
  }
      
  if(gameState.combat.bloodFrenzy.isActive) {    
    gameState.combat.bloodFrenzy.atkSpd += gameState.combat.bloodFrenzy.atkSpdBase;
  }
      
  updateStatusEnemyUI(enemy);
      
  // 🔥 natychmiastowy update (bez animacji)
  updateEnemyHealthBar(enemy, index);
      
  let hpBonus = 0;
  if(gameState.char.combatAffixes[`hp_regen_of_bleed_dmg`] && enemy?.bleed) {
    const value = gameState.char.combatAffixes[`hp_regen_of_bleed_dmg`].value;
    hpBonus = damage * (value / 100);
    //console.log(`hp regen bleed damage, bonus value, hpBonus`, damage, value, hpBonus);
        
  }
      
  if (gameState.combat.bloodReaver.isActive && enemy?.bleed) {
    const value = gameState.combat.bloodReaver.heal;
    hpBonus += damage * value * enemy.bleed.stacks.length * (enemy.perfectBleed.stacks + 1);

    addWeaponMasteryExp(`berserker`, 3, `bleed-heal`);
  }

  if (hpBonus > 0) {
    const char = gameState.char;

    char.hp = Math.min(
      char.maxHp,
      char.hp + Math.round(hpBonus)
    );

    setTimeout(() => {
      updatePlayerHp(char.hp);
    }, 160);
  }
      
      
  // 🔥 floating damage (opcjonalnie)
    showEnemyDamage({
      damage: Math.ceil(damage),
      isBleed: true
    });
}

function updateStatusPlayerUI(enemy, dotType = null) {
  //console.log(`updateStatusPlayerUI enter`);  
  const container = document.getElementById(`player-status`);
  
  if(!enemy) return;  
  
  if(!container) return;
      
  const dot = gameState.combat?.playerDots[dotType];
      
  const activeStatuses = new Set();
      
  if (gameState.combat.playerMark.isActive) {
    activeStatuses.add("mark");
        
    let el = container.querySelector(".player-status.mark");

    if (!el) {
      el = document.createElement("div");
      el.className = "player-status mark";
          
      const markIconUrl = assetManager.getResolvedAsset("img/icons/mark-icon.png");
  
      const icon = document.createElement("img");
      icon.src = `${markIconUrl}`;

      el.appendChild(icon);
      container.appendChild(el);
    }
  }

        
  if (dot?.stacks.length > 0 && dot) {
    activeStatuses.add(dotType);
  
    //console.log(`player dot status add`, dotType);  
        
    let el = container.querySelector(`.player-status.${dotType}`);

    if (!el) {
      el = document.createElement("div");
      el.className = `player-status ${dotType}`;
          
      let dotUrl = ``;
          
      switch(dotType) {
        case `bleed`:
          dotUrl = "img/icons/bleed-icon.png";
          break;
   
        case `burn`:
          dotUrl = "img/icons/burn-icon.png";
          break;

        case `poison`:
          dotUrl = "img/icons/poison-icon.png";
          break;
   
       }             
          
      const dotIconUrl = assetManager.getResolvedAsset(dotUrl);
  
      const icon = document.createElement("img");
      icon.src = `${dotIconUrl}`;

      const stacks = document.createElement("span");
      stacks.className = "stacks";

      el.appendChild(icon);
      el.appendChild(stacks);
      container.appendChild(el);
    }
        
    if(dotType !== `burn`) {
      el.querySelector(".stacks").textContent = `x${dot.stacks.length}`;
    }     
  }

      
  if (playerAttackCooldown.slow.active) {
    activeStatuses.add("slow");
        
    let el = container.querySelector(".player-status.slow");

    if (!el) {
      el = document.createElement("div");
      el.className = "player-status slow";
          
      const slowIconUrl = assetManager.getResolvedAsset("img/icons/skill-slow-icon.png");
  
      const icon = document.createElement("img");
      icon.src = `${slowIconUrl}`;

      el.appendChild(icon);
      container.appendChild(el);
    }
  }
      
  if (playerAttackCooldown.isStunActive) {
    activeStatuses.add("stun");
        
    //console.error(`enemy status stun enter`);   
        
    let el = container.querySelector(".player-status.stun");

    if (!el) {
      el = document.createElement("div");
      el.className = "player-status stun";
          
      const stunIconUrl = assetManager.getResolvedAsset("img/icons/skill-stun-icon.png");
  
      const icon = document.createElement("img");
      icon.src = `${stunIconUrl}`;

      el.appendChild(icon);
      container.appendChild(el);
          
      //console.error(`enemy status stun added`);   

    }
  }

      
  if (gameState.combat.bloodReaver.isActive) {
    activeStatuses.add("blood-reaver");
        
    let el = container.querySelector(".player-status.blood-reaver");

    if (!el) {
      el = document.createElement("div");
      el.className = "player-status blood-reaver";
          
      const bloodReaverIconUrl = assetManager.getResolvedAsset("img/icons/bleed-skill-icon.png");
  
      const icon = document.createElement("img");
      icon.src = `${bloodReaverIconUrl}`;

      el.appendChild(icon);
      container.appendChild(el);
    }
  }
      
  if (gameState.combat.spearDiscipline.isActive) {
    activeStatuses.add("discipline");
        
    let el = container.querySelector(".player-status.discipline");

    if (!el) {
      el = document.createElement("div");
      el.className = "player-status discipline";
          
      const disciplineIconUrl = assetManager.getResolvedAsset("img/icons/discipline-bonus-icon.png");
  
      const icon = document.createElement("img");
      icon.src = `${disciplineIconUrl}`;

      el.appendChild(icon);
      container.appendChild(el);
    }
  }
      
  if (gameState.combat.absoluteControl?.isActive) {
    activeStatuses.add("absolute");
        
    let el = container.querySelector(".player-status.absolute");

    if (!el) {
      el = document.createElement("div");
      el.className = "player-status absolute";
          
      const absoluteIconUrl = assetManager.getResolvedAsset("img/icons/absolute-bonus-icon.png");
  
      const icon = document.createElement("img");
      icon.src = `${absoluteIconUrl}`;

      el.appendChild(icon);
      container.appendChild(el);
    }
  }

      
  if (gameState.combat.parryMaster?.isActive) {
    activeStatuses.add("parry-master");
        
    let el = container.querySelector(".player-status.parry-master");

    if (!el) {
      el = document.createElement("div");
      el.className = "player-status parry-master";
          
      const parryMasterIconUrl = assetManager.getResolvedAsset("img/icons/parry-master-bonus-icon.png");
  
      const icon = document.createElement("img");
      icon.src = `${parryMasterIconUrl}`;

      el.appendChild(icon);
      container.appendChild(el);
    }
  }

  if (gameState.combat.lastBastion.isActive) {
    activeStatuses.add("bastion");
        
    let el = container.querySelector(".player-status.bastion");

    if (!el) {
      el = document.createElement("div");
      el.className = "player-status bastion";
          
      const bastionIconUrl = assetManager.getResolvedAsset("img/icons/bastion-bonus-icon.png");
  
      const icon = document.createElement("img");
      icon.src = `${bastionIconUrl}`;

      el.appendChild(icon);
      container.appendChild(el);
    }
  }

  if (gameState.combat.playerBlock.stackChain) {
    activeStatuses.add("precision");
        
    let el = container.querySelector(".player-status.precision");

    if (!el) {
      el = document.createElement("div");
      el.className = "player-status precision";
          
      const precisionIconUrl = assetManager.getResolvedAsset("img/icons/precision-bonus-icon.png");
  
      const icon = document.createElement("img");
      icon.src = `${precisionIconUrl}`;

      el.appendChild(icon);
      container.appendChild(el);
    }
  }

      
  if (gameState.combat.activeBonus.crit) {
    activeStatuses.add("crit");
        
    let el = container.querySelector(".player-status.crit");

    if (!el) {
      el = document.createElement("div");
      el.className = "player-status crit";
          
      const critIconUrl = assetManager.getResolvedAsset("img/icons/crit-bonus-icon.png");
  
      const icon = document.createElement("img");
      icon.src = `${critIconUrl}`;

      el.appendChild(icon);
      container.appendChild(el);
    }
  }
      
  if (gameState.combat.activeBonus.atkSpd || gameState.combat.bloodFrenzy.isActive) {
    activeStatuses.add("atkspd");
        
    let el = container.querySelector(".player-status.atkspd");

    if (!el) {
      el = document.createElement("div");
      el.className = "player-status atkspd";
          
      const atkspdIconUrl = assetManager.getResolvedAsset("img/icons/atkspd-bonus-icon2.png");
  
      const icon = document.createElement("img");
      icon.src = `${atkspdIconUrl}`;

      el.appendChild(icon);
      container.appendChild(el);
    }
  }

  const staminaState = gameState.resources.staminaState;
  const isExhausted = staminaState.fatigue === "exhausted" || staminaState.fatigue === "critical";
      
  if (isExhausted) {
    activeStatuses.add("exhausted");
        
    let el = container.querySelector(".player-status.exhausted");

    if (!el) {
      el = document.createElement("div");
      el.className = "player-status exhausted";
          
      const exhaustedIconUrl = assetManager.getResolvedAsset("img/icons/exhausted-bonus-icon3.png");
  
      const icon = document.createElement("img");
      icon.src = `${exhaustedIconUrl}`;

      el.appendChild(icon);
      container.appendChild(el);
    }
  }

      
  [...container.children].forEach(child => {
    const type = [...child.classList].find(c => c !== "player-status");

    if (!activeStatuses.has(type)) {
      child.remove();
    }
  });
      
}

function updateStatusEnemyUI(enemy) {
  const container = document.getElementById(`enemy-status-container-${gameState.world.selectedSlotIndex}`);
      
  if(!container) return;  
      
  const activeStatuses = new Set();
      
      
  if (gameState.combat.enemyDmgBuff.isActive) {
    activeStatuses.add("dmg-buff");
        
    let el = container.querySelector(".enemy-status.dmg-buff");

    if (!el) {
      el = document.createElement("div");
      el.className = "enemy-status dmg-buff";
          
      const dmgBuffIconUrl = assetManager.getResolvedAsset("img/icons/dmg-bonus-icon.png");
  
      const icon = document.createElement("img");
      icon.src = `${dmgBuffIconUrl}`;

      el.appendChild(icon);
      container.appendChild(el);
    }
  }
      

      
 if (gameState.combat.enemyDmgReduction.isActive) {
    activeStatuses.add("dmg-reduction");
        
    let el = container.querySelector(".enemy-status.dmg-reduction");

    if (!el) {
      el = document.createElement("div");
      el.className = "enemy-status dmg-reduction";
          
      const dmgReductionIconUrl = assetManager.getResolvedAsset("img/icons/dmg-reduction-icon.png");
  
      const icon = document.createElement("img");
      icon.src = `${dmgReductionIconUrl}`;

      el.appendChild(icon);
      container.appendChild(el);
    }
  }

      
  if (gameState.combat.enemyAtkspdBuff.isActive) {
    activeStatuses.add("atkspd");
        
    let el = container.querySelector(".enemy-status.atkspd");

    if (!el) {
      el = document.createElement("div");
      el.className = "enemy-status atkspd";
          
      const atkspdIconUrl = assetManager.getResolvedAsset("img/icons/atkspd-bonus-icon2.png");
  
      const icon = document.createElement("img");
      icon.src = `${atkspdIconUrl}`;

      el.appendChild(icon);
      container.appendChild(el);
    }
  }
      
  if(gameState.combat.weakPoint.isActive) {
    activeStatuses.add("weak-point");
        
    let el = container.querySelector(".enemy-status.weak-point");

    if (!el) {
      el = document.createElement("div");
      el.className = "enemy-status weak-point";
          
      const weakPointIconUrl = assetManager.getResolvedAsset("img/icons/weak-point-bonus-icon.png");
  
      const icon = document.createElement("img");
      icon.src = `${weakPointIconUrl}`;

      el.appendChild(icon);
      container.appendChild(el);
    }
  }

      
  if (enemy.vulnerable) {
    activeStatuses.add("vulnerable");
        
    let el = container.querySelector(".enemy-status.vulnerable");

    if (!el) {
      el = document.createElement("div");
      el.className = "enemy-status vulnerable";
          
      const vulnerableIconUrl = assetManager.getResolvedAsset("img/icons/vulnerable-bonus-icon2.png");
  
      const icon = document.createElement("img");
      icon.src = `${vulnerableIconUrl}`;

      el.appendChild(icon);
      container.appendChild(el);
    }
  }
      
  if(!gameState.combat.flags.windupEnd && enemy.intent) {
        
    activeStatuses.add("windup");
  
    let el = container.querySelector(".enemy-status.windup");

    if (!el && (enemy.intent.type === "guard" || enemy.intent.type === "charge")) {
      el = document.createElement("div");
      el.className = "enemy-status windup";
      //console.log(`guard / charge status`, enemy.intent);
      let iconUrl = ``;
      //let windupIconUrl = ``;
          
      switch(enemy.intent.type) {
      /*  case `attack`:
          iconUrl = "img/icons/normal-windup-icon.png";
          //windupIconUrl = ICONS.attack;
          break;            
        case `heavy`:
          iconUrl = "img/icons/heavy-windup-icon.png";
          el.classList.add("windup-brute");

          //windupIconUrl = ICONS.heavy;
          break;  */          
        case `guard`:
          iconUrl = "img/icons/guard-windup-icon.png";
          //windupIconUrl = ICONS.guard;
          break;
        case `charge`:
          iconUrl = "img/icons/charge-windup-icon.png";
          el.classList.add("windup-brute");
          //windupIconUrl = ICONS.charge;
          break;
      }
          
      /*const windupIcons = {
        attack: ICONS.attack,
        heavy: ICONS.heavy,
        guard: ICONS.guard,
        charge: ICONS.charge
      };*/
          
      const windupIconUrl = assetManager.getResolvedAsset(iconUrl);
          
      const icon = document.createElement("img");
      icon.src = `${windupIconUrl}`;
      //icon.src = windupIcons[enemy.intent];
   
      el.appendChild(icon);
      container.appendChild(el);
    }
        
  }          

  if (enemy?.status?.slow) {
    activeStatuses.add("slow");
        
    let el = container.querySelector(".enemy-status.slow");

    if (!el) {
      el = document.createElement("div");
      el.className = "enemy-status slow";
          
      const slowIconUrl = assetManager.getResolvedAsset("img/icons/skill-slow-icon.png");
  
      const icon = document.createElement("img");
      icon.src = `${slowIconUrl}`;

      el.appendChild(icon);
      container.appendChild(el);
    }
  }
      
  if (enemy?.status?.stun) {
    activeStatuses.add("stun");
        
    //console.error(`enemy status stun enter`);   
        
    let el = container.querySelector(".enemy-status.stun");

    if (!el) {
      el = document.createElement("div");
      el.className = "enemy-status stun";
          
      const stunIconUrl = assetManager.getResolvedAsset("img/icons/skill-stun-icon.png");
  
      const icon = document.createElement("img");
      icon.src = `${stunIconUrl}`;

      el.appendChild(icon);
      container.appendChild(el);
          
      //console.error(`enemy status stun added`);   

    }
  }

      
  if (enemy.spear?.stackControl) {
    activeStatuses.add("control");
        
    let el = container.querySelector(".enemy-status.control");

    if (!el) {
      el = document.createElement("div");
      el.className = "enemy-status control";
          
      const controlIconUrl = assetManager.getResolvedAsset("img/icons/spear-control-icon.png");
  
      const icon = document.createElement("img");
      icon.src = `${controlIconUrl}`;

      el.appendChild(icon);
      container.appendChild(el);
    }
  }
      
      
  if (enemy.bleed && enemy.bleed.stacks.length > 0) {
    activeStatuses.add("bleed");
  
    let el = container.querySelector(".enemy-status.bleed");

    if (!el) {
      el = document.createElement("div");
      el.className = "enemy-status bleed";
          
      const bleedIconUrl = assetManager.getResolvedAsset("img/icons/bleed-icon.png");
  
      const icon = document.createElement("img");
      icon.src = `${bleedIconUrl}`;

      const stacks = document.createElement("span");
      stacks.className = "stacks";

      el.appendChild(icon);
      el.appendChild(stacks);
      container.appendChild(el);
    }

    el.querySelector(".stacks").textContent = `x${enemy.bleed.stacks.length}`;
  }
      
  if (enemy.armorBreak && enemy.armorBreak.duration > 0) {
    activeStatuses.add("armor-break");
        
    let el = container.querySelector(".enemy-status.armor-break");

    if (!el) {
      el = document.createElement("div");
      el.className = "enemy-status armor-break";
          
      const armorBreakIconUrl = assetManager.getResolvedAsset("img/icons/armor-break-icon.png");
  
      const icon = document.createElement("img");
      icon.src = `${armorBreakIconUrl}`;

      el.appendChild(icon);
      container.appendChild(el);
    }
  }
       
    //  console.log([...activeStatuses].join("\n"));
      
  [...container.children].forEach(child => {
    const type = [...child.classList].find(c => c !== "enemy-status");

    if (!activeStatuses.has(type)) {
      child.remove();
    }
  });
      
}

function updateArmorBreak(delta) {
  if (gameState.world.selectedSlotIndex === null) return;

  const enemy = gameState.world.exploreOptions[gameState.world.selectedSlotIndex]?.enemyData;
      
  if (!enemy?.armorBreak?.value) return;

  enemy.armorBreak.duration -= delta;
      
  if(gameState.char.combatAffixes[`armor_break_refresh`] && gameState.combat.armorBreakBonus.refreshBonus.isReady) {
      const value = gameState.char.combatAffixes[`armor_break_refresh`].value;
      const refreshRoll = Math.random() * 100;
 
      gameState.combat.armorBreakBonus.refreshBonus.isReady = false;
      
      if(refreshRoll < value) {
        enemy.armorBreak.duration = enemy.armorBreak.maxDuration;
        //console.log(`refreshRoll < value, enemy.armorBreak.duration`, refreshRoll, value, enemy.armorBreak.duration);
        showReward(`${t("armor_break_refreshed")}`, 2300);
      }  
    }

  if (enemy.armorBreak.duration <= 0) {
    enemy.armorBreak.value = 0;
    updateStatusEnemyUI(enemy); 
        
    if(gameState.char.combatAffixes[`def_after_armor_break`]) {
      gameState.combat.activeBonus.defSources.armorBreak = 0;
      recalculateDefenseBonus();
          
      clearAllDiffs(`def`); 
    }
        
    if(gameState.char.combatAffixes[`crit_vs_armor_break`]) {
      gameState.combat.activeBonus.critSources.armorBreak = 0;
      recalculateCritBonus();
    }
        
  }
}

/*function spawnHitEffect(type, targetEl) {
  const effect = document.createElement("img");

  effect.className = "hit-effect";
  effect.src = `${ASSET_BASE}img/vfx/${type}.png`;

  targetEl.appendChild(effect);

  setTimeout(() => {
    effect.remove();
  }, 300);
}*/

function updateCooldownBar(enemy, percent, slotIndex) {
  if (gameState.combat.flags.enemyFinisherActive) return;
      
  const fill = document.getElementById(`enemy-cooldown-fill-${slotIndex}`);
  //const fill = enemy.dom.cooldownFill;
  if (!fill) return;

  //fill.style.transition = "none";
  //fill.style.width = `${percent}%`;
  fill.style.transform = `scaleX(${percent / 100})`;
      
  //const enemy = world.exploreOptions[slotIndex]?.enemyData;
  //fill.classList.toggle("stun", !!enemy?.status?.stun);
  //fill.classList.toggle("slow", !!enemy?.status?.slow);
      
  if (enemy?.status?.stun) {
    fill.classList.add('stun');
    fill.classList.remove('slow');
  } else if (enemy?.status?.slow || enemy?.spear?.stackControl) {
    fill.classList.add('slow');
    fill.classList.remove('stun');
  } else {
    fill.classList.remove('slow', 'stun');
  }
}

function updateWindupBar(enemy, progress, slotIndex) {
    const windupBar = document.getElementById(`enemy-windup-bar-${slotIndex}`);
    const fill = document.getElementById(`enemy-windup-fill-${slotIndex}`);

    if (!fill || !windupBar) return;

    fill.style.transform = `scaleX(${progress})`;
      
    windupBar.classList.remove(
        "heavy",
        "skill-windup"
    );

    if (enemy?.intent?.type === "heavy") {
        windupBar.classList.add("heavy");

    } else if (enemy?.intent?.type === "skill") {
        windupBar.classList.add("skill-windup");
        const skill = ENEMY_SKILLS[enemy.intent.skillId];

        showEnemyOutcome("perfect", `${t(skill.name)}`, 1200);
    }
}




/*function weightedPick(weights) {
  const entries = Object.entries(weights).filter(([_, v]) => v > 0);

  const total = entries.reduce((sum, [_, value]) => sum + value, 0);

  if (total <= 0) return "attack";

  let roll = Math.random() * total;

  for (const [key, value] of entries) {
    roll -= value;
    if (roll <= 0) return key;
  }

  return "attack";
}*/

function weightedPick(weights) {
  const localWeights = { ...weights };

  if (gameState.combat.provocation.isActive) {
    localWeights.charge = 0;
    localWeights.guard = 0;
    gameState.combat.provocation.isActive = false;
  }

  const entries = Object.entries(localWeights).filter(([_, v]) => v > 0);

  const total = entries.reduce((sum, [_, value]) => sum + value, 0);

  if (total <= 0) return "attack";

  let roll = Math.random() * total;

  for (const [key, value] of entries) {
    roll -= value;
    if (roll <= 0) return key;
  }

  return "attack";
}

function rollEnemyIntent(enemy) {
  const now = performance.now();

  // ---------------------------------
  // BAZOWE WAGI
  // ---------------------------------
  let weights = {
    attack: 50,
    heavy: 20,
    guard: 15,
    charge: 15
  };
 
  const skillWeights = {};
      
  for (const runtimeSkill of enemy.skillState ?? []) {
    const skill = ENEMY_SKILLS[runtimeSkill.id];
    if (!skill) continue;
    // cooldown
    if (runtimeSkill.expiresAt > now) {
      continue;
    }

    skillWeights[runtimeSkill.id] = skill.weight ?? 10;
  }
      
  // ---------------------------------
  // INFO O GRACZU
  // ---------------------------------
  const style = gameState.combat.activeRingMode || "none";

  const lowHp = enemy.hp < enemy.maxHp * 0.30;

  // ---------------------------------
  // LOW HP = agresja
  // ---------------------------------
  if (lowHp) {
    weights.heavy += 20;
    weights.attack += 10;
    weights.guard -= 10;
  }

  // ---------------------------------
  // JEŚLI MA BUFA Z CHARGE
  // po charge ma uderzyć, nie ładować znów
  // ---------------------------------
  if (enemy.isCharged) {
    weights.attack += 30;
    weights.heavy += 20;
    weights.guard -= 10;
    weights.charge = 0;
  }
      
  if (enemy.isGuarding) {
    weights.attack += 20;
    weights.heavy += 20;
    weights.guard = 0;
    weights.charge += 10;
  }

  // ---------------------------------
  // REAKCJA NA STYLE GRACZA
  // ---------------------------------

  // SPEAR = control / slow / pushback
  if (style === "spear") {
    weights.charge += 20;
    weights.heavy += 10;
    weights.guard -= 10;
  }

  // AXE = bleed pressure
  else if (style === "bleed" || style === "axe") {
    weights.guard += 20;
    weights.heavy += 10;
  }

  // SWORD = armor break
  else if (style === "armor" || style === "sword") {
    weights.guard -= 15;
    weights.attack += 10;
    weights.heavy += 10;
  }

  // HAMMER = poise interrupt
  else if (style === "poise" || style === "mace") {
    weights.heavy -= 20;
    weights.charge -= 10;
    weights.attack += 20;
    weights.guard += 10;
  }

  // ---------------------------------
  // REAKCJA NA STATUSY WROGA
  // ---------------------------------

  // mocny bleed = desperacja
  if ((enemy.bleedStacks || 0) >= 3) {
    weights.heavy += 20;
    weights.attack += 10;
  }

  // armor break = guard bez sensu
  if ((enemy.exposeStacks || 0) >= 3) {
    weights.guard = 0;
    weights.attack += 15;
  }

  // niedawno przerwany cast
  if (enemy.wasInterruptedRecently) {
    weights.heavy -= 20;
    weights.charge -= 15;
    weights.attack += 25;
  }

  // stun / freeze etc.
  if (enemy.status?.stun) {
    weights.guard += 20;
    weights.attack -= 10;
  }

  if (enemy.isCharged) {
    weights.charge = 0;
  }
      
  if(gameState.combat.enemyAtkspdBuff.isActive) {
    weights.attack = 100;
    weights.heavy = 0;
    weights.guard = 0;
    weights.charge = 0;
  }
      
  // ---------------------------------
  // BEZPIECZNIK
  // ---------------------------------
  Object.keys(weights).forEach(key => {
    weights[key] = Math.max(0, weights[key]);
  });

  const allWeights = {
    ...weights,
    ...skillWeights
  };
      
  // ---------------------------------
  // LOSOWANIE INTENCJI
  // ---------------------------------
  //enemy.intent = weightedPick(allWeights);
  const selected = weightedPick(allWeights);
      
  // console.log(`selected`, selected);   
      
  if (skillWeights[selected] !== undefined) {
    enemy.intent = {
      type: "skill",
      skillId: selected
    };
  } else {
    enemy.intent = {
      type: selected
    };
  }
      
  // ---------------------------------
  // CZASY
  // ---------------------------------
      
  if (enemy.intent.type === "skill") {
    const skill = ENEMY_SKILLS[enemy.intent.skillId];

    enemy.windupDuration = skill.windup;

    enemy.canBeInterrupted = skill.canBeInterrupted ?? true;

  } else {
    switch (enemy.intent.type) {

      case "attack":
        enemy.windupDuration = 800;
        break;
          
      case "heavy":
       enemy.windupDuration = 1500;
        break;

      case "guard":
        enemy.windupDuration = 0;
        break;

      case "charge":
        enemy.windupDuration = 0;
        break;

      default:
        enemy.intent = {
          type: "attack"
        };

        enemy.windupDuration = 800;
        break;
    }

    enemy.canBeInterrupted =
      enemy.intent.type === "heavy" ||
      enemy.intent.type === "charge";
        
  }
 
  // ---------------------------------
  // STANY TECHNICZNE
  // ---------------------------------
  enemy.intentReadyAt = now + enemy.windupDuration;
  enemy.windupStart = now;

  
  // reset flag po czasie
  enemy.wasInterruptedRecently = false;

  // ---------------------------------
  // DEBUG
  // ---------------------------------
  // console.log("Enemy intent:", enemy.intent, weights);
}

function executeEnemyIntent(enemy) {
  //let dmgMultiplier = 1;

  switch (enemy.intent.type) {

    case "attack":
      //showEnemyOutcome("dodge", `${t("attack_outcome")}`, 1000);
      //console.warn(`enemy outcome attack`);
        //dmgMultiplier = 1;
      return { type:"action", dmgMultiplier: 1 };

    case "heavy":
      //showEnemyOutcome("miss", `${t("heavy_outcome")}`, 1000);
      dmgMultiplier = 1.6;
        
      return { type:"action", dmgMultiplier: 1.6 };

    case "guard":
      //showEnemyOutcome("dodge", `${t("guard_outcome")}`);

      enemy.isGuarding = true;
      /*setTimeout(() => {
        enemy.isGuarding = false;
      }, 1300);*/

       
      return { type:"utility", duration: 400};

    case "charge":
      //slowMoAlert();
      showEnemyOutcome("perfect", `${t("charge_outcome")}`, 1000);
      //showReward(`${t("next_strengthened_reward")}`);
 
      enemy.isCharging = true;

      return { type:"utility", duration: 600 };
        
    case "skill":
      return { type:"skill", duration: 600 };
      break;
  }

  return { type:"action", dmgMultiplier: 1 };
}


function tryInterruptEnemy(enemy, source) {
  if (!enemy.canBeInterrupted) return false;

 // console.error(`tryInterruptEnemy`);
      
  enemy.intent = null;
  enemy.canBeInterrupted = false;

  if (enemy.attackState) {
    enemy.attackState.phase = "cooldown";
    enemy.attackState.remaining =
      enemy.attackState.baseCooldown * 0.6;
  }

  let duration = 1000;     
      
  if(gameState.combat.playerBlock.mode === "timed") {
    //console.error(`STOP TIMED BLOCK! (tryInterrupt)`);
    stopTimedBlockUI();
    gameState.combat.flags.isBlocked = false;
  }      
      
  switch(source) {
        
      case "perfect-block":
        duration = 1600;  
        break;        
        
      case "perfect-armor":
        duration = 2400;  
        break;        

      case "perfect-spear":
        duration = 2300 + (200 * enemy.spear.stackControl);  
        break;        

      case "poise-break":
        duration = 2500;  
        break;  
        
      case "stun":
        duration = 2100;  
        break;        
        
  }
      
  const style = getCurrentWeaponStyle();
  if(style === `bulwark`) {
    addWeaponMasteryExp(`bulwark`, 15, `interrupt`);
  }          
      
  //console.error(`spear vulnerable duration`, duration);
 
  applyVulnerable(enemy, duration);
      
  showEnemyOutcome("perfect", `${t("interrupt_outcome")}`);

  return true;
}

function cancelEnemyIntent(enemy) {
  enemy.intent = null;
  enemy.canBeInterrupted = false;
}

/*function intentDealsAttack(intent){
 return intent.type === "attack" || intent.type === "heavy";
}*/

function intentDealsAttack(intent) {
  if (!intent) return false;

  if (intent.type === "attack" || intent.type === "heavy") {
    return true;
  }

  if (intent.type === "skill") {
    const skill = ENEMY_SKILLS[intent.skillId];

    return skill?.canBeBlocked === true;
  }

  return false;
}

function applyVulnerable(enemy, duration) {
  enemy.vulnerable = true;
      
  updateStatusEnemyUI(enemy);
      
  setTimeout(() => {
    enemy.vulnerable = false; 
    updateStatusEnemyUI(enemy);
  }, duration);
      
}

/*function showEnemyIntentUI(enemy) {
  const el = document.getElementById("enemy-intent");

  if (!el) return;

  const map = {
    attack: "⚔️",
    heavy: "💥",
    guard: "🛡️",
    charge: "⏳"
  };

  el.textContent = map[enemy.intent] || "?";
}*/

function resetEnemyAI(enemy) {
  enemy.intent = null;
  enemy.canBeInterrupted = false;
  enemy.vulnerable = false;
  enemy.isCharged = false; 
  enemy.isCharging = false;
  enemy.isGuarding = false;      
}

function performEnemyAttack(enemy, slotIndex, options = {}) {  
  //console.error(`enter perform attack`, options.multiplier);
  const expeditionLevelStats = gameState.expedition.modes[gameState.world.expeditionMode].level;
  const playerBlock = gameState.combat.playerBlock;
 // const slotName = document.getElementById("slot-name");
  const player = getPlayerStats();
  
  if (!gameState.world.inCombat || enemy.currentHp <= 0 || player.hp <= 0) {
    if(!gameState.combat.flags.isCritical) {
      stopEnemyAttack(slotIndex); // bezpieczne zakończenie
      return;
    }   
  }
      
  const multiplier = options.multiplier ?? 1;
      
  //console.warn(`combat.flags.isCritical`, gameState.combat.flags.isCritical);
      
  let dmg = applyBlock(enemy.dmg, player, enemy);
  dmg *= multiplier;
      
  //console.error(`multiplier after`, multiplier);
      
  const damageBlocked = enemy.dmg - dmg;    
  expeditionLevelStats.damageBlocked += Math.floor(damageBlocked);
    
 // console.error(`enemy dmg after block`, dmg);
  if (dmg > 0) {
        
    if(!whirlwindState.isActive) { 
      playPlayerAnimation("hit");
    }        
    
    playEnemyAnimation("attack", slotIndex);
        
    const dmgReduction = player.dmgReduction.reduction / 100;
    const reductionCooldown = player.dmgReduction.cooldown * 1000;
    //console.error(`dmgReduction, reductionDuration`, dmgReduction, reductionCooldown);

    triggerIronStance(dmgReduction, reductionCooldown); // 15% przez 2.5s
        
    if(gameState.combat.ironStance.primed) {
      showReward(`-${(gameState.combat.ironStance.reduction * 100).toFixed(0)}% ${t("iron_defense_reward")}`);
    }
        
    const stackDuration = player.stackDefense.duration * 1000;
    if(player.stackDefense.stack > 0) {    
      addArmorStack(stackDuration);
    }
        
    ({ dmg: dmg } = calculateReducedEnemyDamage(dmg, enemy, player));
        
    if(dmg <= 0) {
      playSound(`dodge`, 1, randomRange(0.95, 1.05), 0.45);
      return; 
    }
        
    //console.error(`playerBlock.lastResult in enemy attack`, playerBlock.lastResult);
    if(playerBlock.lastResult === `miss` || playerBlock.lastResult === null) {
       playHit(`player`); 
    }
        
    if (playerBlock.mode === "defensive" && playerBlock.active) {
      const gainedDef = gameState.char.combatAffixes[`def_per_guard_stack`]?.value;
      const gainedDmg = gameState.char.combatAffixes[`dmg_per_guard_stack`]?.value;
 
      if(guardStacks < DEFENSIVE_GUARD_STACK_MAX) {
         guardStacks++;
            
         addWeaponMasteryExp(`bulwark`, 3, `guard`);
            
         if(gameState.combat.lastBastion.isActive) {
           gameState.combat.lastBastion.nextAttack = gameState.combat.lastBastion.attackValue;
         }
            
         if(gainedDef) {  
          // console.log(`guard stack gainedDef`, gainedDef);
          // gameState.combat.activeBonus.def += gainedDef;
          // showBuff(`def`, gameState.combat.activeBonus.def);
 
           gameState.combat.activeBonus.defSources.guard = gainedDef * guardStacks;
           recalculateDefenseBonus();
         }   
            
         if(gainedDmg) {
           //gameState.combat.activeBonus.dmg += gainedDmg;
               
           gameState.combat.activeBonus.dmgSources.guardStacks = gainedDmg * guardStacks;
           recalculateDamageBonus();
               
           //showBuff(`dmg`, gameState.combat.activeBonus.dmg);
           //showPercentBuff("dmg", gameState.combat.activeBonus.dmg);
         }
            
         updateGuardUI(guardStacks);
            
         if(gameState.char.combatAffixes[`crit_per_guard_stack`]) {
            gameState.combat.guardBonus.critBonus.isActive = true;
            gameState.combat.guardBonus.critBonus.stacks = guardStacks;
               
            const critBonus = gameState.char.combatAffixes[`crit_per_guard_stack`].value;
            gameState.combat.activeBonus.critSources.guardStacks = critBonus * guardStacks;
            recalculateCritBonus();
         }                
   
         if(gameState.char.combatAffixes[`def_per_guard_stack`]) {
            gameState.combat.guardBonus.defBonus.isActive = true;
            gameState.combat.guardBonus.defBonus.stacks = guardStacks;
         }
            
         if(gameState.char.combatAffixes[`dmg_per_guard_stack`]) {
            gameState.combat.guardBonus.dmgBonus.isActive = true;
            gameState.combat.guardBonus.dmgBonus.stacks = guardStacks;
         }
   
            
      }
       //const gainedDef = gameState.char.combatAffixes[`def_per_guard_stack`];
       if(guardStacks === 1) {
          //gameState.combat.activeBonus.def += gainedDef * guardStacks;
          //showBuff(`def`, gameState.combat.activeBonus.def);
          //showReward(`${t("stack1_reward")}`);
       }    
       else if(guardStacks === 2) {
          //gameState.combat.activeBonus.def += gainedDef * guardStacks;
          //showBuff(`def`, gameState.combat.activeBonus.def);
          //showReward(`${t("stack2_reward")}`);
       }     
       else {
          //gameState.combat.activeBonus.def += gainedDef * guardStacks;
          //showBuff(`def`, gameState.combat.activeBonus.def);
          //showReward(`${t("stack3_reward")}`);
       }       
    }    
        
       // Napór Presja Przewaga
   // Iskra Impuls Przeciążenie
        
    playerBlock.lastResult = null;
        
    gameState.combat.enemyFinalDamage = dmg;
        
    if(enemy.name === `enemy_lynx` && enemy.attackState.result.type === "skill") {
      const heal = Math.ceil(dmg * 0.6);
          
      enemy.currentHp = Math.min(
        enemy.maxHp,
        enemy.currentHp + heal
      );
          
    //  console.log(`heal` , heal);
      updateEnemyHealthBar(enemy, gameState.world.selectedSlotIndex);
    } 
        
    updatePlayerHp(player.hp - dmg);
        
    showPlayerDamage({
      damage: Math.ceil(dmg),
      isBleed: false,
    });
        
    if(gameState.world.mode === `expedition`) {
      expeditionLevelStats.damageTaken += dmg;
    }
        
    //updatePlayerHp(player.hp - dmg);
    //console.error(`enemy dmg couldn't be zero`, dmg);

    if(gameState.combat.counterStrike.isActive) {
     // console.error(`gameState.combat.counterStrike.isActive`, gameState.combat.counterStrike.isActive);
      const attackValue = gameState.combat.counterStrike.attackValue;
          
        performAttack(
          player,
          enemy,
          {
            isDefShield: true,
            isSkillAttack: true,
            baseMultiplier: attackValue
          }
        );
      //console.error(`attackValue`, attackValue);
 
      addWeaponMasteryExp(`bulwark`, 5, `counter strike`);

      spawnEffect("counter_strike", enemy.dom.slot);
     
      const staminaRecovered = gameState.combat.counterStrike.staminaRecover;
      //console.error(`staminaRecovered`, staminaRecovered);
      gainStamina(staminaRecovered);
    }
        
   
   // slotName.style.color = "white"
   // slotName.innerHTML = ' enemyDamage: ' + dmg;
  } 
      
  if (gameState.char.hp <= 0 && !gameState.combat.flags.isCritical) {
    enterCriticalState();
  }
      
}

function stopEnemyAttack(slotIndex) {
  const fill = document.getElementById(`enemy-cooldown-fill-${slotIndex}`);
  const enemy = gameState.world.exploreOptions[slotIndex]?.enemyData;
  //const fill = enemy.dom.cooldownFill;

  /*console.warn("STOP ENEMY ATTACK CALLED", {
    stun: enemy?.status?.stun,
    paused: enemyAttackTimeline?.isPaused,
    running: enemyAttackTimeline?.isRunning
  });*/
      
  if (enemyAttackTimeline) {
    enemyAttackTimeline.isRunning = false;
    //cancelAnimationFrame(enemyAttackTimeline.rafId);
  }

  // Zatrzymaj animację jelly
  if (enemy?.animations?.jelly && typeof enemy.animations.jelly.cancel === "function") {
    enemy.animations.jelly.cancel();
    delete enemy.animations.jelly;
  }
      
  combatStarted = false;

  // Reset cooldown bara
  const percent = (enemyAttackTimeline.elapsed / enemyAttackTimeline.duration) * 100;
  //updateCooldownBar(percent, 0, slotIndex);
  updateCooldownBar(enemy, percent, slotIndex);

  //if(fill) void fill.offsetWidth;
  //updateCooldownBar(0, 500, slotIndex);
  updateCooldownBar(enemy, 0, slotIndex);
 
 // Reset wyglądu paska (usuń klasy i ustaw do domyłu)
  if (fill) {
    enemy.status.slow = 0;
    enemy.status.stun = 0;
    fill.classList.remove('slow', 'stun');
    /*fill.style.transition = 'none';
    fill.style.width = '100%';
    // wymuś reflow, potem ustaw transition z powrotem jeśli chcesz
    void fill.offsetWidth;
    // opcjonalnie przywróć domyślny transition (lub pozostaw, zależnie co używasz)
    fill.style.transition = '';*/
        
    fill.style.transition = "none";
    fill.style.transform = "scaleX(1)";
    requestAnimationFrame(() => {
      fill.style.transition = "";
    });
        
  }
      
  //console.log("==> Stop enemy attack + jelly");
}

function setEnemyAttackSpeed(enemy, multiplier, slotIndex) {
  const timeline = enemyAttackTimeline;

  enemy.status.currentSpeedMultiplier = multiplier;
  timeline.speed = multiplier;

  // 🔒 JEŚLI JESTEŚMY W WIND-UPIE → NIE DOTYKAMY COOLDOWNU
  if (enemy.attackState?.phase === "windup") {
    changeSpeedAnimation(enemy, multiplier);
    return;
  }

  // === COOLDOWN ===
  const cooldown = calculateCooldown(enemy.atkSpd, enemy) * 1000;
  const progress = timeline.elapsed / timeline.duration;

  timeline.duration = cooldown / timeline.speed;
  timeline.elapsed = progress * timeline.duration;

  changeSpeedAnimation(enemy, multiplier);

  if (!timeline.isPaused) {
    resumeAnimation(enemy);
    //resumeEnemyCooldownBar(slotIndex);
  }
}

/*function startAnimation(enemy, durationMs, slotIndex) {
  const enemySlot = document.getElementById(`enemy-slot-${slotIndex}`);

  // Jeśli była stara animacja, zatrzymaj ją
  if (enemy.animations?.jelly) {
    enemy.animations.jelly.cancel();
  }

  const jelly = enemySlot.animate([
    { transform: "scale(1)", offset: 0 },
    { transform: "scale(1.1, 0.9)", offset: 0.15 },
    { transform: "scale(0.9, 1.1)", offset: 0.3 },
    { transform: "scale(1.05, 0.95)", offset: 0.45 },
    { transform: "scale(0.97, 1.03)", offset: 0.6 },
    { transform: "scale(1.02, 0.98)", offset: 0.75 },
    { transform: "scale(1)", offset: 1 }
  ], {
    duration: durationMs,
    iterations: 1, // tylko jeden cykl na cooldown
    easing: "linear"
  });

  enemy.animations = enemy.animations || {};
  enemy.animations.jelly = jelly;

  // opcjonalnie: po zakończeniu usuń referencję
  jelly.onfinish = () => {
    delete enemy.animations.jelly;
    enemySlot.style.transform = "scale(1)";
  };
}*/

function pauseAnimation(enemy) {
  if (enemy.animations?.jelly) {
    enemy.animations.jelly.pause();
  }
}

function resumeAnimation(enemy) {
  if (enemy.animations?.jelly) {
    enemy.animations.jelly.play();
  }
}

function deathAnimation(enemySlot) {
  /*const enemySlot = document.getElementById(`enemy-slot-${gameState.world.selectedSlotIndex}`);
  enemy.beforeDeath = false;
  enemy.isDead = true;*/
      
  enemySlot.classList.add(`enemy-death`);
}

function removeDeathAnimation(enemy) {
  const enemySlot = document.getElementById(`enemy-slot-${gameState.world.selectedSlotIndex}`);
      
  enemySlot.classList.remove(`enemy-death`);
}



function changeSpeedAnimation(enemy, multiplier) {
  //console.log("multiplier change speed", multiplier);
  enemy.animations?.jelly?.updatePlaybackRate(multiplier);
}

function playEnemyHitAnimation(enemy, slotIndex) {
  const enemySlot = document.getElementById(`enemy-slot-${slotIndex}`);

  const hitAnimation = enemySlot?.animate([
    { transform: "translateX(0px) scaleX(-1)", filter: "brightness(1)", offset: 0 },
    { transform: "translateX(-6px) scaleX(-1)", filter: "brightness(1.5)", offset: 0.2 },
    { transform: "translateX(6px) scaleX(-1)", filter: "brightness(1.5)", offset: 0.4 },
    { transform: "translateX(-4px) scaleX(-1)", filter: "brightness(1.2)", offset: 0.6 },
    { transform: "translateX(4px) scaleX(-1)", filter: "brightness(1.1)", offset: 0.8 },
    { transform: "translateX(0px) scaleX(-1)", filter: "brightness(1)", offset: 1 }
  ], {
    duration: 250,
    iterations: 1,
    easing: "ease-out"
  });

  const bleedAnimation = enemySlot?.animate([
    { boxShadow: "0 0 0px rgba(255,0,0,0)", offset: 0 },
    { boxShadow: "0 0 15px rgba(255,0,0,0.8)", offset: 0.3 },
    { boxShadow: "0 0 10px rgba(255,0,0,0.4)", offset: 0.6 },
    { boxShadow: "0 0 0px rgba(255,0,0,0)", offset: 1 }
  ], {
    duration: 250,
    iterations: 1,
    easing: "ease-out"
  });
  
  // Zapisz lub nie – to krótka animacja, więc zwykle nie trzeba
  enemy.animations = enemy.animations || {};
  enemy.animations.hit = hitAnimation;
  enemy.animations.bleed = bleedAnimation;
}


function resetAnimation(slotIndex) {
  const enemySlot = document.getElementById(`enemy-slot-${slotIndex}`);
  enemySlot.style.animation = "none";
  void enemySlot.offsetWidth; // Force reflow
  enemySlot.style.animationName = "jelly-wobble";
  enemySlot.style.animationDuration = "2000ms";
  enemySlot.style.animationIterationCount = "infinite";
  enemySlot.style.animationTimingFunction = "linear";
  enemySlot.style.animationPlayState = "running";
}


/*function getRandomEnemyLevel(playerLevel) {
  const min = Math.max(1, playerLevel);
  const max = playerLevel + 2;

  const weights = [];
  for (let lvl = min; lvl <= max; lvl++) {
    // Im bliżej gracza lub niżej, tym większa waga
    const weight = 1 / Math.abs(lvl - playerLevel + 0.5); 
    weights.push({ level: lvl, weight });
  }

  const totalWeight = weights.reduce((sum, w) => sum + w.weight, 0);
  const rand = Math.random() * totalWeight;

  let acc = 0;
  for (const { level, weight } of weights) {
    acc += weight;
    if (rand <= acc) return level;
  }

  return playerLevel; // fallback
}*/

function getRandomEnemyLevel(playerLevel) {

  if (playerLevel === 1) return 1;

  const min = playerLevel;
  const max = playerLevel === 2
    ? playerLevel + 1
    : playerLevel + 2;

  const weights = [];

  for (let lvl = min; lvl <= max; lvl++) {
    const weight = 1 / Math.abs(lvl - playerLevel + 0.5);
    weights.push({ level: lvl, weight });
  }

  const totalWeight = weights.reduce((sum, w) => sum + w.weight, 0);
  const rand = Math.random() * totalWeight;

  let acc = 0;
  for (const { level, weight } of weights) {
    acc += weight;
    if (rand <= acc) return level;
  }

  if (gameState.world?.mode === "expedition") {
    const runLevel = gameState.world.expeditionLevel || 1;
    if (runLevel > 5) {
      const bonus = Math.floor(runLevel / 5);
      playerLevel += bonus;
    }
  }
      
  return playerLevel;
}

function applyExpeditionScaling(enemy, mode) {
  if (mode !== "expedition") return;

  const run = gameState.world.expeditionLevel;

  const hpBonus = run * 0.03;
  const dmgBonus = run * 0.02;
  const defBonus = run * 0.025;

  enemy.hp *= (1 + hpBonus);
  enemy.dmg *= (1 + dmgBonus);
  enemy.def *= (1 + defBonus);
      
  return enemy;  
}

function getRandomEnemyKey(locationName) {
  //console.log("🌍 getRandomEnemyKey() dla lokacji:", locationName);

  const pool = enemyPools[locationName];
  if (!pool || pool.length === 0) {
   // console.warn("⚠️ Brak puli wrogów dla lokacji:", locationName);
    return "wolf"; // fallback
  }

  const filtered = pool.filter(k => k !== "mini_boss" && k !== "boss");
  const randomKey = filtered[Math.floor(Math.random() * filtered.length)];

  //console.log("🎯 Wylosowany wróg:", randomKey);
  return randomKey;
}

/*function getRandomEnemyKey(regionId) {
  console.log("regionId", regionId);
  const pool = enemyPools[regionId] || [];
  const filtered = pool.filter(k => k !== "miniBoss" && k !== "boss");
  if (filtered.length === 0) return null;
  return filtered[Math.floor(Math.random() * filtered.length)];
}*/


function scaleEnemyStats(template, level, forcedType, isStoryEnemy) {
  let multiplier = !isStoryEnemy ? 1 + 0.65 * (level - 1) : 1;
  //console.error("enemy with feather", template.name, level, multiplier, isStoryEnemy);

  if (gameState.world.mode === "expedition" && forcedType === `mini_boss`) {
    const level = gameState.world.expeditionLevel;
    multiplier = 1 + level * 0.2;
  }
      
  return {
    key: forcedType, // jawnie przekazany typ
    name: `${template.name}`,
    level,
    type: template.type,
    maxHp: Math.round(template.maxHp * multiplier),
    currentHp: Math.round(template.maxHp * multiplier),
    dmg: Math.round(template.dmg * multiplier),
    def: Math.round(template.def * multiplier),
    atkSpd: template.atkSpd,
    baseExp: template.baseExp,  
    sprite: template.sprite,
    skills: template.skills,
    skillState: [],
    isDead: false, 
    beforeDeath: false,
    lastSeen: null,
    intent: null,
    intentReadyAt: 0,
    windupStart: 0,
    windupDuration: 800,
    canBeInterrupted: false,
    vulnerable: false,
    isGuarding: false,   
    isCharging: false,
    isCharged: false,   
    guardCounter: false,
    wasInterruptedRecently: false,
    state: "normal",
    poise: 100,  
    maxPoise: 100,
    poiseRegenRate: 5,
    poiseBroken: false,
    hpAtLeave: 0,
    lastCombatTimestamp: 0,
    lastComboHit: null,
    exposeStacks: 0,
    armorBreakReady: false,
    lastArmorBreakHit: null,
    hitAfterResolve: false,
    bleedStacks: 0,
    perfectBleed: {
      stacks: 0, 
    },
    bleedLastResult: null,
    lastBleedHit: null,
    bleedReady: false,
    bleed: { 
      stacks: [],
      tickRate: 1,
      timer: 0
    },
    spearReady: false,
    spearLastResult: null,
    spear: {
      stacks: 0,
      slow: 0,
      windupBonus: 0,
      pushback: 0,
      expiresAt: 0,
      stackControl: 0,
    },
    armorBreak: {
      value: 0,
      duration: 0,
      maxDuration: 0, 
    },
    regen: {
      fromHp: 0,
      startTime: 0
    },
    __stepIndex: 0,
    __slotIndex: 0,
    hpAtLastCombat: null,
    enemyContent: "",
    dom: {
       slot: null,
       healthBar: null,
       healthFill: null,
       healthText: null,
       cooldownFill: null
    },  
    isStoryEnemy: isStoryEnemy,
    questId: template.questId,
    _slowTimeout: 0,
    slowUntil: 0,
    animations: {},
    finisherTimeout: null,
    attackState: {
      phase: "cooldown", // "cooldown" | "windup"
      remaining: 0,       // ms pozostałe w aktualnej fazie
      result: null
    },
    status: {
      stunned: false,
      stunDuration: 0,
      slow: 0,
      slowDuration: 0,
      stunRemaining: 0,
      stunEnd: null,
      stunStart: null,
      slowRemaining: 0,
      slowEnd: null,
      isStunned: false,
      pausedElapsed: 0,
      pausedPercent: 0,
      pausedRemaining: 0,
      multiplier: 0,
      remaining: 0,
      end: 0
    }
  };
}

/*function generateEnemy(playerLevel, isStoryEnemy) {
  const saved = localStorage.getItem("battleState");
  if (!saved) return null;

  const st = JSON.parse(saved);
  const locations = Object.keys(enemyPools);
  const locationName = locations[st.currentLevel - 1] || locations[0]; // 🟡 konwersja numeru poziomu → nazwa lokacji

   console.log(`location name generate enemy`, locationName);   
  const randomKey = getRandomEnemyKey(locationName);
  const baseTemplate = enemyBase[randomKey];
  if (!baseTemplate) {
    console.error("❌ Brak szablonu wroga:", randomKey);
    return null;
  }

  const enemyLevel = getRandomEnemyLevel(playerLevel);
  return scaleEnemyStats(baseTemplate, enemyLevel, randomKey, isStoryEnemy);
}*/

function generateEnemy(playerLevel, isStoryEnemy = false, forcedEnemyId = null) {
  //console.error(`generateEnemy`);  
 
  const locations = Object.keys(enemyPools);
 // console.log("current level from battleState in generateEnemy:", world.currentLevel);
 // console.log("currentLocation in generateEnemy:", world.currentLocation);
  const locationName = locations[gameState.world.currentLevel - 1] || locations[0];

  const randomKey = forcedEnemyId || getRandomEnemyKey(gameState.world.currentLocation);

  const baseTemplate = enemyBase[randomKey];
  if (!baseTemplate) {
    console.error("❌ Brak szablonu wroga:", randomKey);
    return null;
  }
  
  //console.error("generate enemy with feather", baseTemplate.name, isStoryEnemy);

  const enemyLevel = getRandomEnemyLevel(playerLevel);
  return scaleEnemyStats(baseTemplate, enemyLevel, randomKey, isStoryEnemy);
}

function generateStoryEnemy(questId, playerLevel) {
  //console.error(`generateStoryEnemy`);  
 
  const template = STORY_EVENT_ENEMIES[questId];
  if (!template) {
    console.error("❌ Brak wroga fabularnego dla questa:", questId);
    return null;
  }

  // Wymuś unikalny typ klucza — aby nie korzystać z puli normalnych wrogów
  const forcedKey = template.id || questId;

  // Skaluje staty tak samo jak każdy inny wróg
  const storyEnemy = scaleEnemyStats(
    template,
    template.level,
    forcedKey,
    true // isStoryEnemy
  );

  // Można dodać nagrody, jeśli quest przewiduje
  if (template.reward) {
    storyEnemy.reward = template.reward;
  }

  return storyEnemy;
}

function generateEliteEnemy(playerLevel) {
  const location = gameState.world.currentLocation;

  const pool = ELITE_ENEMY_POOLS[location];

  if (!pool || pool.length === 0) {
    console.warn("⚠ brak elite pool dla lokacji:", location);
    return generateEnemy(playerLevel);
  }

  const key = pool[Math.floor(Math.random() * pool.length)];

  const template = enemyBase[key];

  if (!template) {
    console.error("❌ Brak template elite:", key);
    return null;
  }

  const enemyLevel = getRandomEnemyLevel(playerLevel);

  return scaleEnemyStats(template, enemyLevel, key, false);
}

/*function generateEnemy(playerLevel) {
  const saved = localStorage.getItem("battleState");
    console.log("not saved in generateEnemy");  
  if (saved) {
    const st = JSON.parse(saved);
        
    console.log("regionId in generateEnemy", st.selectedRegionId);
    const randomKey = getRandomEnemyKey(st.selectedRegionId);
    console.log("randomKey", randomKey);
    if (!randomKey) return null;
    const baseTemplate = enemyBase[randomKey];
    const enemyLevel = getRandomEnemyLevel(playerLevel);
        
    console.log("GENERATED ENEMY:", randomKey, baseTemplate, baseTemplate.maxHp);
    return scaleEnemyStats(baseTemplate, enemyLevel, randomKey);
  }   
}*/

function generateMiniboss(playerLevel, miniBossId) {
 // console.error(`miniBossId in generateMiniboss`, miniBossId);  
  const baseTemplate = enemyBase[miniBossId];
  const enemyLevel = playerLevel + 1;
  return scaleEnemyStats(baseTemplate, enemyLevel, "mini_boss", false);
}

function generateBoss(playerLevel) {
  const baseTemplate = enemyBase.boss;
  const enemyLevel = playerLevel + 2;
  return scaleEnemyStats(baseTemplate, enemyLevel, "boss", false);
}
