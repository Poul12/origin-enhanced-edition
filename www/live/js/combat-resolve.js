async function dealDamageToEnemy(enemy, damage, isCrit = false, critMultiplier = 2, source = `game`) {
  const world = gameState.world;

  if (!world.inCombat) return;
  
  if(enemy.isGuarding) {
    damage *= 0.55;
  }
  
  enemy.currentHp -= damage;
  enemy.currentHp = Math.max(0, enemy.currentHp);
  
  if(source === `game`) {
    showEnemyDamage({
      damage: damage,
      isCrit: isCrit,
      multiplier: critMultiplier
    });
  }
  
  if(enemy.name === "runic_stone_guardian" && enemy.currentHp <= 2000) {
    exitCombat();
    hideFleeButton();
    winCombat();
    stopEnemyAttack(world.selectedSlotIndex);
  }
  
  if (enemy.currentHp <= 0) {
      //console.error(`enemy.currentHp <= 0 in attack`);
      enemy.currentHp = 0;
    
      if(gameState.char.combatAffixes[`energy_bleed_kill`] && enemy.bleed) {
        const energyGain = gameState.char.combatAffixes[`energy_bleed_kill`].value;
        gainEnergy(energyGain);
        //showReward(`+${(energyGain).toFixed(1)} ${t("to_energy_reward")}`, 2300);
        showEnergyGain(energyGain);
        //console.error(`energy gain on kill normal`, energyGain); 
      }          

      clearBleed(enemy);
      exitCombat();
      hideFleeButton();
    
      winCombat();
      stopEnemyAttack(world.selectedSlotIndex); // linia czasu wroga – STOP
  } 
  
  //console.error(`deal damage before update enemy hp`, damage);
  updateEnemyHealthBar(enemy, world.selectedSlotIndex);
}

function performAttack(
  attacker,
  defender,
  {
    isDefShield = false,
    isSkillAttack = false,
    baseMultiplier = 1,
    canCrit = true,
    ignoreArmor = false,
    source = "game"
  } = {}
)
{
  
  const eq = gameState.char?.equipment || {};
  const weapon = eq[`weapon`];
  
  const expeditionLevelStats = gameState.expedition.modes[gameState.world.expeditionMode].level;
  const expeditionRunStats = gameState.expedition.modes[gameState.world.expeditionMode].run;
  
  if(!whirlwindState.isActive) { 
      playPlayerAnimation("attack");
  }
  
  //console.log(`base dmg`, attacker.dmg);
  //console.log(`performAttack defender`, defender.name);

  const rawDmg = 2;
  
  let weaponDamage = attacker.baseDamage.weapon + rawDmg;
  
 // console.error(`weaponDamage before baseMultiplier`, weaponDamage, baseMultiplier);

  weaponDamage *= baseMultiplier ?? 1;
  
 // console.error(`weaponDamage after baseMultiplier`, weaponDamage);

  const baseDamage = weaponDamage + 
                     attacker.baseDamage.stats +
                     attacker.baseDamage.flat +
                     attacker.baseDamage.implicit;
  
  let totalMultiplier = 1;
  
  if (currentBuff?.dmg) {
    totalMultiplier *= currentBuff.dmg
    //baseDamage *= currentBuff.dmg;
  }
  
  //console.error(`baseDamage`, baseDamage);
  
  //let baseDmg = rollDamage(attacker.dmg);
  let baseDmg = rollDamage(baseDamage);
  //let baseDmg = baseDamage;
  
  //console.log(`base dmg after roll`, baseDmg);
  
  //baseDmg *= baseMultiplier ?? 1;
  //console.log(`base dmg after skill multiplier`, baseDmg, baseMultiplier);
  
  const { damage, isCrit, critMultiplier } =
    applyCritDamage(baseDmg, attacker, isDefShield);
  //console.log(`dmg with crit`, damage, isCrit);
  
  let dmgWithElemental = damage + (attacker.elementalDmg || 0);
  //console.error(`dmg with elemental`, dmgWithElemental);
  
  if(defender.status.stunned) {
    dmgWithElemental *= (1 + defender.status.multiplier);
    defender.status.stunned = false;
    defender.status.multiplier = 0;
    //console.error(`dmg with elemental after stunned`, dmgWithElemental);
  }
  
  if(gameState.combat.lastBastion.nextAttack && gameState.combat.lastBastion.isActive) {
    dmgWithElemental *= gameState.combat.lastBastion.nextAttack;
    //console.log(`last bastion next attack`, gameState.combat.lastBastion.nextAttack);

    gameState.combat.lastBastion.nextAttack = 0;
  }
  
  if(gameState.combat.stats.nextHitMultiplier && !isSkillAttack) {
    dmgWithElemental *= gameState.combat.stats.nextHitMultiplier;
    gameState.combat.stats.nextHitMultiplier = 0;
    
    if (weapon?.baseName === `Długi Miecz`) {
      setLongswordBuffUI(false);
      showReward(`${t("block_reward")} x1.2`);
    }else { 
      showReward(`${t("combo_reward")} x1.5`);
      triggerRingFull();
      triggerRingBurst();
      setTimeout(() => {
        resetGuardRing();
      }, 300);
    }
  }
  
  if(gameState.combat.activeRingMode === `mace` && gameState.combat.stats.combo === 2 && !isSkillAttack) {
    gameState.combat.stats.combo = 0;
    //defender.attackState.remaining += 500;
    
    let pushbackBonus = 0;
    if(gameState.char.combatAffixes[`pushback`]) {
      pushbackBonus = gameState.char.combatAffixes[`pushback`].value;
    }
    
    if(defender.isGuarding) {
      defender.attackState.remaining += 250 * ( 1 + (pushbackBonus / 100));
    } else {
      defender.attackState.remaining += 500 * ( 1 + (pushbackBonus / 100));
    }
    
    //showReward(`${t("pushback_reward")}`);
    
    triggerRingFull();
    triggerRingBurst();
    setTimeout(() => {
        resetGuardRing();
    }, 300);
  }
  
  if(gameState.combat.activeRingMode === `axe` && gameState.combat.stats.combo === 2 && !isSkillAttack) {
    gameState.combat.stats.combo = 0;
    defender.bleedStacks = 0;
    
    if(!defender.isGuarding) {
      applyBleed(defender, 0.12, 3.2);
      //showReward(`${t("bleed_reward")}`);
    }
    
    triggerRingFull();
    triggerRingBurst();
    setTimeout(() => {
        resetGuardRing();
    }, 300);
  }

  
  if(defender.vulnerable){
    dmgWithElemental *= 1.25;
  }
  
  let finalDamage =
    calculateReducedPlayerDamage(dmgWithElemental, attacker, defender);
  //console.log(`finalDamage after reduced by armor`, finalDamage);
  
  //console.error(`hpPct`, combatState.currentHp / combatState.maxHp);
  //console.error(`applyHpToDmgBonus `, attacker.hpToDmg.threshold, attacker.hpToDmg.maxBonus, applyHpToDmgBonus(attacker.hpToDmg.threshold, attacker.hpToDmg.maxBonus));
 
  if (isDefShield && !gameState.combat.ironWill.isActive) {
    finalDamage = applyDefensivePenaltyDmgReduction(attacker, finalDamage);
  }
  
  //finalDamage *= applyHpToDmgBonus(attacker.hpToDmg?.threshold, attacker.hpToDmg?.maxBonus);
  
  const hpBonus = applyHpToDmgBonus(attacker.hpToDmg?.threshold, attacker.hpToDmg?.maxBonus);
  if (hpBonus) totalMultiplier *= hpBonus;
  
  //console.error(`perfom attack finalDamage penalty`, finalDamage);
  
  if(gameState.char.bonus.perfectDmgBonus && gameState.combat.flags.isPerfectDmgBonus) {
    const bonus = gameState.char.bonus.perfectDmgBonus / 100;
    //finalDamage *= 1 + bonus;
    totalMultiplier *= 1 + bonus;
    gameState.combat.flags.isPerfectDmgBonus = false;
    //console.error(`gameState.char.bonus.perfectDmgBonus, totalMultiplier`, bonus, totalMultiplier);
    //showReward(`+${(bonus * 100).toFixed(0)}% ${t("perfect_riposte_reward")}`);
  }
  
  if(gameState.combat.perfectChainStacks && gameState.combat.perfectBonusDmgNextHit) {
    const bonus = gameState.char.bonus.perfectChainBonus / 100;
    //finalDamage *= 1 + (bonus * gameState.combat.perfectChainStacks);
    totalMultiplier *= 1 + (bonus * gameState.combat.perfectChainStacks);

    //console.error(`finalDamage after perfect chain stack`, finalDamage, bonus, gameState.combat.perfectChainStacks);
    
    gameState.combat.perfectBonusDmgNextHit = false;
  }
  
  if(gameState.combat.flags.isLowHp && gameState.char?.combatAffixes[`dmg_below_hp`]) {
    const dmgBelowHp = 1 + (gameState.char.combatAffixes[`dmg_below_hp`].value / 100);
    totalMultiplier *= dmgBelowHp;
    //console.error(`dmgBelowHp`, dmgBelowHp);
  }
  
  if(gameState.char.combatAffixes[`dmg_after_break`] && gameState.combat.poiseBonus.dmgBonus.nextHit) {
    gameState.combat.poiseBonus.dmgBonus.nextHit = false;
    const value = gameState.char.combatAffixes[`dmg_after_break`].value;
    const dmgBonus = 1 + (value / 100);
    totalMultiplier *= dmgBonus;
    
    //decreaseBonusDmgBuff(value); 
    
    gameState.combat.activeBonus.dmgSources.afterBreak = 0;
    recalculateDamageBonus();
    
    clearAllDiffs(`dmg`);
    // console.error(`dmgBonus after poise break`, dmgBonus);
  }

  if(gameState.char.combatAffixes[`dmg_exhausted`] && (gameState.resources.staminaState.fatigue === "exhausted" || gameState.resources.staminaState.fatigue === "critical")) {
    const value = gameState.char.combatAffixes[`dmg_exhausted`].value;
    const dmgBonus = 1 + (value / 100);
    totalMultiplier *= dmgBonus;
    
    //console.error(`dmgBonus while exhausted`, dmgBonus);
  }
  
  if(gameState.char.combatAffixes[`dmg_per_guard_stack`] && gameState.combat.guardBonus.dmgBonus.isActive) {
    const stacks = gameState.combat.guardBonus.dmgBonus.stacks;
    const value = gameState.char.combatAffixes[`dmg_per_guard_stack`].value * stacks;
    const dmgBonus = 1 + ((value) / 100);
    totalMultiplier *= dmgBonus;
    
    //console.error(`dmgBonus per guard`, dmgBonus, stacks);
  }
  
  if(gameState.char.combatAffixes[`dmg_per_control_stack`] && gameState.combat.controlBonus.dmgBonus.isActive) {
    const accumulate = gameState.combat.controlBonus.dmgBonus.accumulate;
    const dmgBonus = 1 + ((accumulate) / 100);
    totalMultiplier *= dmgBonus;
    //console.error(`dmgBonus per control stack, accumulate`, dmgBonus, accumulate);
  }

  if(gameState.char.combatAffixes[`gain_dmg_equal_active_def_bonus`]) {
    const defAccumulate = gameState.combat.activeBonus.def;
    const value = gameState.char.combatAffixes[`gain_dmg_equal_active_def_bonus`].value;
    const dmgBonus = defAccumulate * (value / 100);
    
    totalMultiplier *= (1 + (dmgBonus / 100));
    //console.error(`dmgBonus equal active def, defAccumulate, bonusValue, totalMultiplier`, dmgBonus, defAccumulate, value, totalMultiplier);
  }

  if(gameState.char.combatAffixes[`dmg_while_energy_fatigue`] && gameState.combat.energyBonus.dmgBonus.isActive) {
    const dmgBonus = gameState.char.combatAffixes[`dmg_while_energy_fatigue`].value;
    totalMultiplier *= (1 + (dmgBonus / 100));
    //console.error(`dmgBonus while energy fatique`, dmgBonus);
  }

  if(gameState.char.combatAffixes[`dmg_vs_bleeding`] && defender?.bleed) {
    const dmgBonus = gameState.char.combatAffixes[`dmg_vs_bleeding`].value;
    totalMultiplier *= (1 + (dmgBonus / 100));
    //console.error(`dmgBonus while enemy is bleeding`, dmgBonus, totalMultiplier);
  }

  if(gameState.char.combatAffixes[`dmg_vs_armor_break`] && defender?.armorBreak?.value) {
    const dmgBonus = gameState.char.combatAffixes[`dmg_vs_armor_break`].value;
    totalMultiplier *= (1 + (dmgBonus / 100));
   // console.error(`dmgBonus while enemy is in armor break`, dmgBonus, totalMultiplier);
  }

  if(gameState.char.combatAffixes[`stamina_vs_armor_break`] && defender?.armorBreak?.value) {
    const staminaGained = gameState.char.combatAffixes[`stamina_vs_armor_break`].value;
    
    gainStamina(staminaGained);
    //showReward(`+${(staminaGained).toFixed(1)} ${t("stamina_on_kill_reward")}`, 2300);
    showStaminaPopup(staminaGained);
  }

  if(gameState.char.combatAffixes[`armor_break_refresh`] && defender?.armorBreak?.value) {
    gameState.combat.armorBreakBonus.refreshBonus.isReady = true;
  }
  
  if(gameState.char.combatAffixes[`execute_bleeding`] && defender?.bleed?.stacks.length >= 2) {
    const dmgBonus = gameState.char.combatAffixes[`execute_bleeding`].value;
    totalMultiplier *= (1 + (dmgBonus / 100));
    //console.error(`dmgBonus while enemy has 2 bleed stack`, dmgBonus, totalMultiplier);
  }
  
  finalDamage *= totalMultiplier;
  
 // console.error(`finalDamage`, finalDamage);
  
    
  if(source === `game`) {
    finalDamage = consumeGuardStacksOnAttack(finalDamage);
  }
  
  expeditionLevelStats.damageDealt += finalDamage;
  expeditionRunStats.damage += finalDamage;
 
  gameState.combat.finalDamage = finalDamage;
  
  //console.error(`finalDamage after guard attack`, finalDamage);
  
 // console.error(`isCrit`, isCrit);
  //console.error(`perfom attack finalDamage 2`, finalDamage);

  dealDamageToEnemy(defender, finalDamage, isCrit, critMultiplier, source);

  gameState.combat.criticalLastStand = null;
  
  
  let lohMultiplier = 1;
  // life on hit
  if (attacker.lifeOnHit && !gameState.combat.flags.isCritical) {
    if(gameState.combat.lowHpBonus.doubleLoHActive) {
       lohMultiplier *= 2;
    }
    
    if (isDefShield && gameState.char.combatAffixes[`loh_while_blocking`]) {
      const value = gameState.char.combatAffixes[`loh_while_blocking`].value;
      lohMultiplier *= (1 + (value / 100));
      //console.error(`lohMultiplier while blocking`, lohMultiplier);
    }
    
    
    
    
    /*attacker.hp = Math.min(
      attacker.maxHp,
      attacker.hp + Math.round(attacker.lifeOnHit * lohMultiplier)
    );*/
    
    const char = gameState.char;
    
    char.hp = Math.min(
      char.maxHp,
      char.hp + Math.round(attacker.lifeOnHit * lohMultiplier)
    );
    
    setTimeout(() => {
        updatePlayerHp(char.hp);
    }, 160);
  }

  if(source === `sim`) {
    console.error(`perfom attack finalDamage 3`, finalDamage);

    console.error(`perfom attack return`, source);
    return {
      damage: finalDamage,
      isCrit
    };
  }
  
}

function attack(isDefShield = false) {
  const world = gameState.world;

  const player = getPlayerStats();
  const enemy = world.exploreOptions[world.selectedSlotIndex].enemyData;

  //console.log(`enemy currentHp`, enemy.currentHp);
  
  if(enemy.currentHp <= 0) return;
  
  performAttack(
    player,
    enemy,
    {
      isDefShield: isDefShield,
      source: "game"
    }
  );
  
  const eq = gameState.char?.equipment || {};
  const weapon = eq[`weapon`];
  
  //if (weapon?.baseName === `Młot`) hammerOnHit(enemy, player); 
  //if (weapon?.baseName === `Topór`) axeOnHit(enemy, player); 
  if (enemy.currentHp > 0) {
    onWeaponHit(enemy, player, weapon?.baseName);
  }
  
  if(!guardStacks && !gameState.combat.playerBlock.active && gameState.combat.activeRingMode !== `poise`) {
    //gameState.combat.activeRingMode = ``;
  }
  
  //playEnemyHitAnimation(enemy, world.selectedSlotIndex);
  playEnemyAnimation("hit", world.selectedSlotIndex);

  
  // pokaż flee po pierwszym ataku
  if(enemy.currentHp > 0) {
    if (!fleeIsSet) setupFleeButton();
    showFleeButton();
  } 
  
 // console.log(`show fleeBtn w attack`, fleeBtn);

  //renderStats();

  //const currentPlayerHp = getPlayerStats().hp;
  const currentPlayerHp = gameState.char.hp;
  
  if (currentPlayerHp <= 0 && !gameState.combat.flags.isCritical) {
    enterCriticalState();
  }  
  
  lockActions({ duration: 300, reason: "attack", allow: [`block`] });
  //console.timeEnd("attack");
}

function showReward(text, duration = 1600) {
  const container = document.getElementById("combat-rewards");

  // limit: max 2 rewardy
  if (container.children.length >= 3) {
    container.removeChild(container.firstChild);
  }

  const reward = document.createElement("div");
  reward.className = "combat-reward";
  reward.textContent = text;

  container.appendChild(reward);

  // auto cleanup
  setTimeout(() => {
    reward.remove();
  }, duration);
}

function showOutcome(type, text, duration = 1700) {
  const el = document.getElementById("combat-outcome");
  
  //onBlockOutcome(type);
  el.className = `combat-msg outcome ${type}`;
  el.querySelector(".main").innerHTML = text;

  el.classList.add("show");

  setTimeout(() => {
    el.classList.remove("show");
  }, duration);
}

function showEnemyOutcome(type, text, duration = 1700) {
  const el = document.getElementById("enemy-combat-outcome");
  
  //onBlockOutcome(type);
  el.className = `combat-msg enemy-feedback outcome ${type}`;
  el.querySelector(".main").textContent = text;

  el.classList.add("show");

  //console.log(`text, el`, text, el);
  
  setTimeout(() => {
    el.classList.remove("show");
  }, duration);
}


function showEnemyDamage({ damage, isCrit, multiplier, isBleed = false }) {
  const container = document.getElementById(`enemy-damage-float-container-${gameState.world.selectedSlotIndex}`);

  const el = document.createElement("div");
  el.classList.add("damage-float");

  if(isBleed) {
    el.classList.add("crit");
  }
  
  if (isCrit) {
    showOutcome("miss", `${t("crit_outcome")}`);
    //showReward(`${damage} x${multiplier.toFixed(1)}`, 2300);
 
    el.classList.add("crit");
    el.textContent = `-${damage.toFixed(0)} x${multiplier.toFixed(1)}`;
  } else {
    el.textContent = `-${damage.toFixed(0)}`;
  }

  if(container) container.appendChild(el);

  // animacja + cleanup
  setTimeout(() => el.remove(), 1500);
}

function showPlayerDamage({ damage, isCrit, multiplier, isBleed = false, isBurn = false, isPoison = false}) {
  const container = document.getElementById(`player-damage-float-container`);

  const el = document.createElement("div");
  el.classList.add("damage-float");

  if(isBleed) {
    el.classList.add("crit");
  }
  
  if(isBurn) {
    el.classList.add("burn");
  }
  
  if(isPoison) {
    el.classList.add("poison");
  }
  
  
  if (isCrit) {
    showOutcome("miss", `${t("crit_outcome")}`);
    //showReward(`${damage} x${multiplier.toFixed(1)}`, 2300);
 
    el.classList.add("crit");
    el.textContent = `-${damage.toFixed(0)} x${multiplier.toFixed(1)}`;
  } else {
    el.textContent = `-${damage.toFixed(0)}`;
  }

  if(container) container.appendChild(el);

  // animacja + cleanup
  setTimeout(() => el.remove(), 1500);
}



/*function turnOffShieldMode() {
  const blockButton = document.getElementById("attack-left");
  //const blockButton = document.getElementById("attack-left").querySelector(".attack-button");
  let playerBlock = gameState.combat.playerBlock;
  
  if (playerBlock.active) {
    if (playerBlock.mode === "defensive") {
      deactivateDefensiveStance();
      //blockButton.classList.remove(`active`);
      blockButton.classList.remove(`turtle`);
      blockButton.classList.add(`cooldown`);
    }
    //return;
  }

}*/

function turnOffShieldMode() {
  const blockButton = document.getElementById("attack-left");
  const playerBlock = gameState.combat.playerBlock;

  // stan logiczny
  playerBlock.active = false;
  //playerBlock.mode = null;
  playerBlock.cooldownUntil = 0;
  playerBlock.lastResult = null;
  
  isBlocking = false;
  
  if(playerBlock.mode == `timed`) {
    //console.error(`STOP TIMED BLOCK! (combat-resolve)`);
    stopTimedBlockUI();
  }
  
  /*if(!gameState.combat.lowHpBonus.lowHpDefActive) {
    clearAllDiffs(`def`);
  }*/
  
  clearAllDiffs(`def`);
  showPercentDebuff(`dmg`, 0); 
  
  skillsOn();
  
  // UI
  blockButton.classList.remove("turtle");
  blockButton.classList.remove("cooldown");
  blockButton.classList.remove("disabled");

  gameState.combat.flags.isBlocked = false;
  
  const overlay = blockButton.querySelector(".block-cooldown-overlay");
  if (overlay) {
    overlay.style.transform = `scaleY(0)`;
  }
  
  if (blockDrainInterval) {
    clearInterval(blockDrainInterval);
    blockDrainInterval = null;
  }
}

function getDebuffPercentHp() {
  const combat = gameState.combat;

  const debuffedMaxHp = combat.stats.maxHp;
  const currentHp = combat.stats.currentHp;
  combat.stats.hpPercent = debuffedMaxHp > 0 ? currentHp / debuffedMaxHp : 1;
  
  //console.error(`combatState.hpPercent in get percent`, combat.stats.hpPercent);
}

function getHpPercentFromChar() {
  const char = gameState.char;

  return char.maxHp > 0
    ? char.hp / char.maxHp
    : 1;
}

function applyPercentToChar(percent) {
  const char = gameState.char;

  char.hp = Math.round(char.maxHp * percent);
  
  if (char.hp > char.maxHp) {
    char.hp = char.maxHp;
  }

}

function setDebuffPercentHp() {
  const char = gameState.char;

  char.hp = Math.round(char.maxHp * gameState.combat.stats.hpPercent);
  
  if (char.hp > char.maxHp) {
    char.hp = char.maxHp;
  }
  
  renderStats();
}

function finishCombatWithDebuff() {
  const charBefore = gameState.char;

  const hpPercent = charBefore.maxHp > 0
    ? charBefore.hp / charBefore.maxHp
    : 1;

  // 2️⃣ Wyłącz debuff
  gameState.combat.flags.isDebuff = false;
  
  // 3️⃣ Przelicz staty bez debuffa (maxHp wróci do normalnego)
  renderStats();

  // 4️⃣ Pobierz nowy stan po przeliczeniu
  let charAfter = gameState.char;

  // 5️⃣ Skaluj HP procentowo
  charAfter.hp = Math.round(charAfter.maxHp * hpPercent);

  if (charAfter.hp > charAfter.maxHp) {
    charAfter.hp = charAfter.maxHp;
  }

  if (charAfter.hp < 0) {
    charAfter.hp = 0;
  }

 }

async function winCombat() {
  //const expGained = 10 + Math.floor(Math.random() * 10);
  //let combatState = gameState.combat;
  const combat = gameState.combat;
  const world = gameState.world;
  const expeditionRunStats = gameState.expedition.modes[world.expeditionMode].run;
  const expeditionLevelStats = gameState.expedition.modes[world.expeditionMode].level;
  const quests = Object.values(QUEST_DATA);
  const enemy = world.exploreOptions[world.selectedSlotIndex].enemyData;
  const expGained = getExpForEnemy(enemy);
  const prefix = addExp(expGained);
  const message = 
     (prefix ? prefix + "\n" : "") +  // jeśli coś zwróciło, to dodajemy + nowa linia
     `Pokonałeś ${enemy.name} (Poziom ${enemy.level})!\n Zdobywasz ${expGained} EXP.`;
  
  const bar = document.getElementById("poise-mode");
  bar.classList.add("hidden");
  
  showOutcome("perfect", `${t("won_outcome")}`);
  showReward(`${expGained} EXP`, 2000);
  
    
  if(world.mode === `expedition`) {
    expeditionRunStats.kills++;
    expeditionLevelStats.kills++;
    
    if(world.expeditionMode === `endless`) {
      expeditionRunStats.impulses += 3;
      showReward(`+${3} Impulsy`, 2000);
    }
  }
    
  if(enemy.type === "elite" && world.mode === `story`) {
    //console.log(`quest enemy deafeted`, enemy.type);
    const questData = QUEST_DATA[enemy.questId];
    if(!questData.requiredItem) {
      const quest = world.battleState.quests?.[enemy.questId];
      quest.enemyPassed = true;
      quest.objective = questData.objectiveAfterEvent;
      quest.questNotifications = true;
      notifyQuestUpdate(enemy.questId);
    }
  }
  
  const matchingQuest = quests.find(quest => 
      quest?.objectiveTarget === enemy.name
    );
      
  if(matchingQuest && world.mode === `story`) {
    const quest = world.battleState.quests?.[matchingQuest.id];
    
    if (quest.targetCount >= matchingQuest.targetCount) {
      //return; 
      //console.log(`nothing is counting`);
    }else {
      quest.targetCount++;
      quest.objective = `${t(matchingQuest.objective)} (${quest.targetCount}/${matchingQuest.targetCount})`;
      //console.error(`targetCount`, quest.targetCount);
      //console.error(`matchingQuest.state1`, quest.state);
      quest.questNotifications = true;
      notifyQuestUpdate(matchingQuest.id);
      updateQuestShortInfo();
    }
      
    if(quest.targetCount == matchingQuest.targetCount && quest.state === `active`) {
     // console.log(`objective after event in target counter`);
      //console.error(`matchingQuest.state2`, quest.state);
      quest.objective = matchingQuest.objectiveAfterEvent;
      quest.questNotifications = true;
      
      notifyQuestUpdate(matchingQuest.id);
    }
    
  }
  
  if(enemy.type === `mini_boss`) {
    const nextBtn = document.getElementById("next-btn");
    nextBtn.classList.remove(`hidden`);
    //nextBtn.classList.add(`hidden`);
    world.bossDefeatedState.isBossDefeated = true;
    
    //showEndStoryPopup();
    
    nextBtn.onclick = (e) => { 
        e.stopPropagation(); 
        showEndStoryPopup();
        showCustomConfirm(
          `${t("next_location")}`,
          () => { goToNextLevel(); },
          () => { }
        );
      };
    
  }
  
  gameState.combat.isStart = false;
  
  //console.log("currentStepIndex winCombat", currentStepIndex);
  world.exploreOptions[world.selectedSlotIndex].isAttacked = false;

  //removeDeathAnimation(enemy);
  //enemy.isDead = true;
  enemy.beforeDeath = true;
    
  renderOptions();
  
  const stats = document.querySelector(".enemy-stat-group");
  stats.style.opacity = `0`;
  
  setMenuDisabled(false);
  
  handleDeathDebuffAfterFight();
  
  clearBleed(enemy);
  
  guardStacks = 0;
  updateGuardUI(0);
  
  enemy.poise = 100;
  
  resetArmorBreak(enemy);
  resetPerfectBlockChain();
  resetSpear(enemy);
  resetSpearUI();  
  stopSpearControlUI();
  //delete enemy.spear;
  
  resetBleed(enemy, true);
  
  stopBleedTimingUI();
  
  stopWhirlwind();  
  
  clearAllPlayerDots(enemy);
  
  gameState.combat.bleedTimingActive = false;
  
  gameState.combat.flags.isPerfectDmgBonus = false;
  gameState.combat.perfectBonusDmgNextHit = false;
  
  combat.stats.combo = 0;
  combat.stats.nextHitMultiplier = 0;
  combat.stats.nextHitPenetration = 0;
  
  gameState.combat.guardBonus.critBonus.isActive = false;
  gameState.combat.guardBonus.critBonus.stacks = 0;
  gameState.combat.guardBonus.defBonus.isActive = false;
  gameState.combat.guardBonus.defBonus.stacks = 0;
  
  gameState.combat.exhaustedBonus.staminaBonus.bonusRegen = 0;
  
  gameState.combat.activeBonus.lastDefToDmg = 0;
  gameState.combat.activeBonus.lastUsed = 0;
  
  gameState.combat.activeBonus.dmgSources = {
    lowHp: 0,
    afterBreak: 0,
    defToDmg: 0,
    guardStacks: 0,
    controlStacks: 0,
    armorBreak: 0,
    exhausted: 0,
    energy: 0,
    bleed: 0,
  };
  
  gameState.combat.activeBonus.defSources = {
    exhausted: 0,
    guard: 0,
    perfectBlock: 0,
    defensiveStance: 0,
    perSecBlock: 0,
    lowHp: 0,
    armorBreak: 0,
  };
  
  gameState.combat.activeBonus.critSources = {
    exhausted: 0,
    guardStacks: 0,
    afterBreak: 0,
    energy: 0,
    bleed: 0,
    controlStacks: 0,
    missingHp: 0,
    dodge: 0,
    armorBreak: 0,
  };
  
  const perfectChainBlock = gameState.combat.perfectChainBlock;
  perfectChainBlock.perfectWindow = 0;
  perfectChainBlock.crit = 0;
  perfectChainBlock.critDmg = 0;
  
  gameState.combat.openingStrike.windUpMultiplier = 1;
  
  gameState.combat.poiseBonus.dmgBonus.nextHit = false;
  
  gameState.combat.lowHpBonus.lowHpDmgActive = false;
  gameState.combat.lowHpBonus.lowHpDefActive = false;
  
  //if(!gameState.combat.lowHpBonus.lowHpDmgActive) {
    gameState.combat.activeBonus.dmg = 0;
    clearAllDiffs(`dmg`);
  //}
  
  //if(!gameState.combat.lowHpBonus.lowHpDefActive) {
    gameState.combat.activeBonus.def = 0;
    clearAllDiffs(`def`);
  //}
  
  gameState.combat.activeBonus.def = 0;
  gameState.combat.activeBonus.atkSpd = 0;
  gameState.combat.activeBonus.crit = 0;
  
  gameState.combat.guardBonus.defBonus.accumulate = 0;
  
  gameState.combat.blockingBonus.lohBonus.isActive = false;
  gameState.combat.blockingBonus.bleedBonus.isActive = false;
  gameState.combat.blockingBonus.bleedBonus.wasAdded = false;
  
  gameState.combat.armorBreakBonus.refreshBonus.isReady = false;
  
  gameState.combat.counterStrike.isActive = false;
  gameState.combat.ironWill.isActive = false;
  gameState.combat.provocation.isActive = false;
  gameState.combat.lastBastion.isActive = false;
  gameState.combat.lastBastion.nextAttack = 0;
  gameState.combat.lastBastion.attackValue = 0;
  
  gameState.combat.playerMark.isActive = false;
  gameState.combat.enemyAtkspdBuff.isActive = false;
  
  gameState.combat.activeRingMode = ``;
  
  resetGuardRing();
  
  resetEnemyAI(enemy);
  
  updateStatusPlayerUI(enemy);
  
  if(gameState.char.combatAffixes[`stamina_on_kill`]) {
    const staminaGained = gameState.char.combatAffixes[`stamina_on_kill`].value;
    gainStamina(staminaGained);
    //console.error(`staminaGained`, staminaGained);
    //showReward(`+${staminaGained.toFixed(0)} ${t("stamina_on_kill_reward")}`, 2100);
    showStaminaPopup(staminaGained);
  }
  
  if(combat.flags.isDebuff && combat.stats.energyFatigueStack < 5) combat.stats.energyFatigueStack++;
   
  //combatState.isDebuff = false;
  finishCombatWithDebuff();
  combat.flags.previewStats = false;
  
  
  world.locationSteps[world.currentStepIndex].exploreOptions = world.exploreOptions; // ZAPISZ STAN KROKU
  unlockActions();
  showNavigateButtons();
  showOtherNonCombatElements(enemy);
  if (world.bossDefeatedState.isBossDefeated) {
    hideGoBackButton();
  }
  
  unlockCombatScroll();
  
  if ((gameState.world.mode ===`sandbox` || gameState.world.mode ===`adventure`) && world.currentStepIndex !== 0) {
    //navigate(`battle`);
   // console.warn(`after battle store button`);
    document.getElementById(`store-button`).classList.add('disabled');
    //saveGame();
    //return;
  }
  
  world.exploreOptions[world.selectedSlotIndex].used = true;
  world.inCombat = false;

  await wait(950);
  
  restoreEnemyStatsLayout();
  
  document.querySelectorAll(".explore-slot")
    .forEach((slot, index) => {

      if(index !== world.selectedSlotIndex) {
        requestAnimationFrame(() => {
          slot.classList.remove("faded");
        });
     }
    });
  
  await wait(550);
  
  renderOptions();
  addLootToStep(enemy, world.currentStepIndex, message);
  renderLoots(world.selectedSlotIndex);

  turnOffShieldMode();
  
  gameState.combat.activeBonus.defSources = {
    exhausted: 0,
    guard: 0,
    perfectBlock: 0,
    defensiveStance: 0,
    perSecBlock: 0,
    lowHp: 0,
    armorBreak: 0,
  };
  
  gameState.combat.activeBonus.def = 0;
  clearAllDiffs(`def`);
  
  world.selectedSlotIndex = null;
  
  renderStats();
  //setDebuffPercentHp();
  saveGame();
  
}

async function onFleeSuccess(player, enemy, slotIndex, msg = false, options = {}){
  // Koszt: złoto
  const world = gameState.world;
  const combat = gameState.combat;
  const noPenalty = options?.noPenalty === true;
  if (noPenalty) {
    const energyState = gameState.resources.energyState;
    const recordedRefund = combat.interruptedCombatEnergyRefund;
    const fallbackRefund = getEnergyCostForSlot(world.exploreOptions[slotIndex].type);
    const energyRefund = Number.isFinite(recordedRefund)
      ? recordedRefund
      : fallbackRefund;
    energyState.current = Math.min(
      energyState.max,
      energyState.current + Math.max(0, energyRefund)
    );
    delete combat.interruptedCombatEnergyRefund;
  }

  const penaltyPercent = noPenalty ? 0 : calculateGoldLossOnFlee(player);
  let gold = parseInt(gameState.resources.gold, 10);
  const loss = noPenalty ? 0 : Math.floor(gold * penaltyPercent);
  gold = Math.max(0, gold - loss);

  if (!noPenalty) {
    gameState.resources.gold = gold;

    // Normal flee fatigue is deliberately skipped for interrupted-combat cleanup.
    const until = nowDateMs() + FLEE_CFG.FATIGUE_SEC * 1000;
    setPlayerFlag("fleeFatigueUntil", until);
  }

  const bar = document.getElementById("poise-mode");
  bar.classList.add("hidden");
  
  if (!noPenalty) updateSkillButtonsFatigueState();
  
  // Zatrzymaj “czas” wroga i pasek (twardy stop)
  stopEnemyAttack(slotIndex);

  // Wróg chwilę „poza walką” (opcjonalna blokada re-engage)
  if (!noPenalty) {
    enemy.reengageLockedUntil = nowDateMs() + FLEE_CFG.REENGAGE_LOCK_SEC * 1000;
  }

  world.exploreOptions[slotIndex].isAttacked = false;
  
  gameState.combat.isStart = false;
  
  //await wait(250);
  renderOptions();
  
  const stats = document.querySelector(".enemy-stat-group");
  stats.style.opacity = `0`;
  
  //registerEnemyForRegen(enemy);
  markEnemyForRegen(enemy);
  
  isExploring = true;
  startEnemyUiRegenTick();
  
  clearBleed(enemy);
  
  stopBleedTimingUI();
  
  guardStacks = 0;
  updateGuardUI(0);
  
  enemy.poise = 100;
  
  resetArmorBreak(enemy);
  resetPerfectBlockChain();
  resetSpear(enemy);
  resetSpearUI();  
  stopSpearControlUI();
  //delete enemy.spear;
  
  resetBleed(enemy, true);
  
  stopWhirlwind();
  
  clearAllPlayerDots(enemy);
  
  gameState.combat.bleedTimingActive = false;
  
  gameState.combat.flags.isPerfectDmgBonus = false;
  gameState.combat.perfectBonusDmgNextHit = false;
  
  combat.stats.combo = 0;
  combat.stats.nextHitMultiplier = 0;
  combat.stats.nextHitPenetration = 0;
  
  gameState.combat.guardBonus.critBonus.isActive = false;
  gameState.combat.guardBonus.critBonus.stacks = 0;
  gameState.combat.guardBonus.defBonus.isActive = false;
  gameState.combat.guardBonus.defBonus.stacks = 0;
  
  gameState.combat.exhaustedBonus.staminaBonus.bonusRegen = 0;
  
  gameState.combat.activeBonus.lastDefToDmg = 0;
  gameState.combat.activeBonus.lastUsed = 0;
  
  gameState.combat.activeBonus.dmgSources = {
    lowHp: 0,
    afterBreak: 0,
    defToDmg: 0,
    guardStacks: 0,
    controlStacks: 0,
    armorBreak: 0,
    exhausted: 0,
    energy: 0,
    bleed: 0,
  };
  
  gameState.combat.activeBonus.defSources = {
    exhausted: 0,
    guard: 0,
    perfectBlock: 0,
    defensiveStance: 0,
    perSecBlock: 0,
    lowHp: 0,
    armorBreak: 0,
  };
  
  gameState.combat.activeBonus.critSources = {
    exhausted: 0,
    guardStacks: 0,
    afterBreak: 0,
    energy: 0,
    bleed: 0,
    controlStacks: 0,
    missingHp: 0,
    dodge: 0,
    armorBreak: 0,
  };
 
  const perfectChainBlock = gameState.combat.perfectChainBlock;
  perfectChainBlock.perfectWindow = 0;
  perfectChainBlock.crit = 0;
  perfectChainBlock.critDmg = 0;

  gameState.combat.openingStrike.windUpMultiplier = 1;
  
  gameState.combat.poiseBonus.dmgBonus.nextHit = false;
  
  gameState.combat.lowHpBonus.lowHpDmgActive = false;
  gameState.combat.lowHpBonus.lowHpDefActive = false;
  
  //if(!gameState.combat.lowHpBonus.lowHpDmgActive) {
    gameState.combat.activeBonus.dmg = 0;
    clearAllDiffs(`dmg`);
  //} 
  
  //if(!gameState.combat.lowHpBonus.lowHpDefActive) {
    gameState.combat.activeBonus.def = 0;
    clearAllDiffs(`def`);
  //}
  
  gameState.combat.activeBonus.def = 0;
  gameState.combat.activeBonus.atkSpd = 0;
  gameState.combat.activeBonus.crit = 0;
  
  gameState.combat.guardBonus.defBonus.accumulate = 0;
  
  gameState.combat.blockingBonus.lohBonus.isActive = false;
  gameState.combat.blockingBonus.bleedBonus.isActive = false;
  gameState.combat.blockingBonus.bleedBonus.wasAdded = false;
  
  gameState.combat.counterStrike.isActive = false;
  gameState.combat.ironWill.isActive = false;
  gameState.combat.provocation.isActive = false;
  gameState.combat.lastBastion.isActive = false;
  gameState.combat.lastBastion.nextAttack = 0;
  gameState.combat.lastBastion.attackValue = 0;
  
  gameState.combat.playerMark.isActive = false;
  gameState.combat.enemyAtkspdBuff.isActive = false;
  
  gameState.combat.armorBreakBonus.refreshBonus.isReady = false;
  
  gameState.combat.activeRingMode = ``;
  
  resetGuardRing();
  
  resetEnemyAI(enemy);
  
  updateStatusPlayerUI(enemy);
  
  syncStepEnemies(world.currentStepIndex);
  
  if (!noPenalty) spendEnergy(`flee`);
  
  /*const enSlot = document.querySelectorAll('.explore-slot')[world.selectedSlotIndex];
  enSlot.classList.remove("combat-focus");*/
  
  if(!noPenalty && combat.flags.isDebuff && combat.stats.energyFatigueStack < 5) combat.stats.energyFatigueStack++;
  
  //combatState.isDebuff = false;
  finishCombatWithDebuff();
  combat.flags.previewStats = false;
  
  hideFleeButton(); 
  
  exitCombat();
  
  // Zamknij sekwencję walki
  world.inCombat = false;
  world.selectedSlotIndex = null;

  // Zatrzymaj koszt blokowania od razu, ale pozostaw pełne sprzątanie
  // turnOffShieldMode() w dotychczasowym miejscu po animacji ucieczki.
  isBlocking = false;
  
  // UI
  //showInfoAlert(`Udało Ci się uciec! -${loss} złota. Skille zablokowane na ${FLEE_CFG.FATIGUE_SEC}s.`);
  
  if (noPenalty) {
    showInfoAlert(t("interrupted_combat_ended"), 2200, true);
  } else {
    let fleeMsg = msg ? "succes_flee_info_app_kill" : "succes_flee_info1";
    showInfoAlert(
      `${t(fleeMsg)}<span style="color:red"> ${loss}${t("succes_flee_info2")}</span>${t("succes_flee_info3")}<span style="color:#0096FF">${t("succes_flee_info4")}</span> 
       ${t("succes_flee_info5")}<span style="color:orange">${FLEE_CFG.FATIGUE_SEC}s</span>.`,
      3000, true
    );
  }

  //lockActions({ duration: 600, reason: "flee", allow: [] });
  
  await wait(950);
  
  restoreEnemyStatsLayout();
  
  document.querySelectorAll(".explore-slot")
    .forEach((slot, index) => {

      if(index !== slotIndex) {
        requestAnimationFrame(() => {
          slot.classList.remove("faded");
        });
     }
    });
  
  await wait(550);
  
  renderOptions();
  setMenuDisabled(false);
  unlockActions();
  showNavigateButtons();
  showOtherNonCombatElements(enemy);
  renderLoots(world.selectedSlotIndex);
  
  turnOffShieldMode();
  
  gameState.combat.activeBonus.defSources = {
    exhausted: 0,
    guard: 0,
    perfectBlock: 0,
    defensiveStance: 0,
    perSecBlock: 0,
    lowHp: 0,
    armorBreak: 0,
  };
  
  gameState.combat.activeBonus.def = 0;
  clearAllDiffs(`def`);
  
  unlockCombatScroll();
  
  if ((gameState.world.mode ===`sandbox` || gameState.world.mode ===`adventure`) && world.currentStepIndex !== 0) {
    //navigate(`battle`);
    //console.warn(`after battle store button`);
    document.getElementById(`store-button`).classList.add('disabled');
    //saveGame();
    //return;
  }
  
  renderStats();
  
  //setDebuffPercentHp();
  saveGame();
}


async function endInterruptedCombatWithoutPenalty() {
  const world = gameState.world;
  const slotIndex = world?.selectedSlotIndex;
  const enemy = Number.isInteger(slotIndex)
    ? world.exploreOptions?.[slotIndex]?.enemyData
    : null;

  if (!world?.inCombat || !enemy) {
    throw new Error("Interrupted combat data is incomplete; save was not changed.");
  }

  await onFleeSuccess(getPlayerStats(), enemy, slotIndex, false, { noPenalty: true });
}


async function onFleeFail(player, enemy, slotIndex){

  resumeEnemyAttack(enemy, slotIndex); 
  
  if (!enemy.status.isStunned && !enemy.status.isSlowed) {

    // 🧠 AGI – szansa na unik kontrataku
    const avoidChance = player.agi * 0.002;
    if (Math.random() < avoidChance) {
      showInfoAlert(`${t("fail_flee_info")}`);
      return;
    }

    // ❤️ HP scaling
    const hpFactor = player.hp / player.maxHp;

    // ⚡ AGI redukcja
    const agiReduction = player.agi * 0.001;

    let dmgMultiplier = 0.3 + (hpFactor * 0.4); // 30–70%
    dmgMultiplier *= (1 - agiReduction);

    dmgMultiplier = Math.max(0.2, dmgMultiplier);

    //console.error(`dmgMultiplier kontratak`, dmgMultiplier);
    
    performEnemyAttack(enemy, slotIndex, { multiplier: dmgMultiplier });
  }
  
  showInfoAlert(
    `<span style="color:white">${t("fail_flee_counterattack_info")}</span>`
  );
    
  saveGame();
}

async function flee(i) {
  const world = gameState.world;
  const combat = gameState.combat;

  const enemy = world.exploreOptions[i].enemyData;
  
  const bar = document.getElementById("poise-mode");
  bar.classList.add("hidden");
  
  world.exploreOptions[i].isAttacked = false;
  
  setMenuDisabled(false);
  //document.getElementById("slot-name").classList.add("hidden");
  
  world.exploreOptions[slotIndex].isAttacked = false;
  
  renderOptions();
  
  markEnemyForRegen(enemy);
  
  isExploring = true;
  startEnemyUiRegenTick();
  
  clearBleed(enemy);
  
  enemy.poise = 100;
  
  resetArmorBreak(enemy);
  
  resetSpear(enemy);
  resetSpearUI();  
  stopSpearControlUI();
  //delete enemy.spear;
  
  resetBleed(enemy);
  
  gameState.combat.bleedTimingActive = false;
  
  stopBleedTimingUI();
  
  combat.stats.combo = 0;
  combat.stats.nextHitMultiplier = 0;
  combat.stats.nextHitPenetration = 0;
  
  gameState.combat.activeRingMode = ``;
  
  resetGuardRing();
  
  resetEnemyAI(enemy);
  
  guardStacks = 0;
  updateGuardUI(0);
  
  syncStepEnemies(world.currentStepIndex);
  
  turnOffShieldMode();
  
  if(combat.flags.isDebuff && combat.stats.energyFatigueStack < 5) combat.stats.energyFatigueStack++;
  
  //combatState.isDebuff = false;
  finishCombatWithDebuff();
  combat.flags.previewStats = false;
  
  world.inCombat = false;
  world.selectedSlotIndex = null;
  
  spendEnergy(`flee`);
  
  await wait(950);
  
  restoreEnemyStatsLayout();

  document.querySelectorAll(".explore-slot")
    .forEach((slot, index) => {

      if(index !== i) {
        requestAnimationFrame(() => {
          slot.classList.remove("faded");
        });
     }
    });
  
  await wait(550);
  renderOptions();
  
  saveSkillCooldowns(combat.skills.skillCooldowns);
  //console.log("przerywam stun z idx", i);
  stopEnemyAttack(i);
 // hideEnemyDialog();
  //hideEnemySlotSmooth();
  unlockCombatScroll();
  //focusOnSlots();
  unlockActions();
  showNavigateButtons();
  showOtherNonCombatElements(enemy);
  
  renderStats();
  //setDebuffPercentHp();
  saveGame();
}
