

const deathReasons = {
  failedBlock: [
    "death_failed_block_1",
    "death_failed_block_2"
  ],

  noPotions: [
    "death_no_potions_1",
    "death_no_potions_2"
  ],

  panic: [
    "death_panic_1",
    "death_panic_2"
  ],

  exhaustion: [
    "death_exhaustion_1",
    "death_exhaustion_2"
  ],

  overwhelmed: [
    "death_overwhelmed_1",
    "death_overwhelmed_2"
  ]
};

const deathTips = [
  "death_tip_1",
  "death_tip_2",
  "death_tip_3",
  "death_tip_4",
  "death_tip_5"
];

const levelUpFlavors = [
  "levelup_flavor_1",
  "levelup_flavor_2",
  "levelup_flavor_3",
  "levelup_flavor_4",
  "levelup_flavor_5",
  "levelup_flavor_6"
];


function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomDeathTip() {
  return randomFrom(deathTips);
}

function getPlayerAttackSpeed() {
  //console.log("atkspd", gameState.char.atkSpd);
  const staminaPenalty = getAttackSpeedMultiplier();
  //console.error(`atkspd, staminaPenalty`, gameState.char.atkSpd, staminaPenalty);
  let atkSpd = gameState.char.atkSpd;
  
  atkSpd = getAttackSpeedWithBonus(gameState.char.atkSpd);

  if(gameState.combat.bleedBuff.atkSpd.isActive) {
    atkSpd *= 1 + (gameState.combat.bleedBuff.atkSpd.value);
  }
  
  if(gameState.combat.bloodFrenzy.isActive) {
    //console.error(`bloodFrenzy atkspd`, gameState.combat.bloodFrenzy.atkSpd);
    
    atkSpd *= 1 + (gameState.combat.bloodFrenzy.atkSpd);
  }

  
 // console.error(`atkspd after`, atkSpd);

  return parseFloat(staminaPenalty * atkSpd);
}

// Oblicza cooldown na podstawie szybkości ataku
function calculateCooldown(atkSpeed, enemy) {
  let cooldown = 1 / atkSpeed;
  
  return cooldown; // np. 0.5 -> 2s cooldown
}

function calculatePlayerCooldown(atkSpeed) {
  let cooldown = 1 / atkSpeed;
  
  return cooldown; // np. 0.5 -> 2s cooldown
}

function clamp(v, min, max){ 
  return Math.max(min, Math.min(max, v)); 
}

function nowDateMs(){
  return Date.now(); 
}

function setPlayerFlag(key, value) {
  const char = gameState.char;
  char.flags = char.flags || {};
  char.flags[key] = value;
  saveGame();
}
function getPlayerFlag(key) {
  return gameState.char?.flags?.[key];
}

function getPlayerStats(resistKey = null) {
  const char = gameState.char;
  const hpText = document.getElementById("hp-label")?.innerText || "100/100";
  const currentHp = parseFloat(hpText.split("/")[0]);
  const maxHp = parseFloat(hpText.split("/")[1]);
  const rawResist = char?.resist?.[resistKey] ?? 0;
  
  return {
    hp: char.hp,
    maxHp: char.maxHp,
    stamina: char.stamina,
    maxStamina: char.maxStamina,
    staminaRegen: char.staminaRegen,
    energyRegen: char.energyRegen,
    //dmg: parseFloat(document.getElementById("dmg")?.innerText) || 5,
    //def: parseFloat(document.getElementById("def")?.innerText) || 5,
    dmg: char.dmg,
    def: char.def,
    vit: char.vit,
    str: char.str,
    agi: char.agi,
    baseDamage: char.baseDamage,
    atkspd: getPlayerAttackSpeed(),
    crit: char.crit,
    style: char.style,
    critDmg: char.critDmg,
    stackDefense: char.bonus.stackDefense,
    dmgReduction: char.bonus.dmgReduction,
    hpToDmg: char.bonus.hpToDmg,
    elementalDmg: char.elementalDmg,
    typeOfElementalDmg: char.typeOfElementalDmg,
    lifeRegen: char.lifeRegen,
    lifeOnHit: char.lifeOnHit,
    dodge: char.dodge,
    dodgeCostReduce: char.dodgeCostReduce,
    perfectBlockEnergy : char.perfectBlockEnergy,
    critEnergy: char.critEnergy,
    perfectWindowBonus: char.perfectWindowBonus,
    blockPower: char.blockPower,
    tacticalBlock: char.tacticalBlock,
    blockMode: char.blockMode,
    penaltyDmg: char.penaltyDmg,
    penaltyAtkSpd: char.penaltyAtkSpd,
    baseCooldown: char.baseCooldown,
    penaltyCooldown: char.penaltyCooldown,
    regenAllowedAt: char.regenAllowedAt,
    effectiveCrit: getEffectiveCritChance(char.crit),
    resist: getEffectiveResist(rawResist),
    physDmgReduction: char.physDmgReduction,
    level: char.level,
    dom: char.dom,
  };
}

function calculatePlayerStats(char) {
  let dmg = char.dmg || 5;
  let def = char.def || 5;

  // equipment
  /*if (char.equipment) {
    for (const item of Object.values(char.equipment)) {
      if (!item) continue;
      dmg += item.dmg || 0;
      def += item.def || 0;
    }
  }*/

  return {
    hp: char.hp ?? char.maxHp,
    maxHp: char.maxHp,
    dmg,
    def,
    crit: char.crit,
    critDmg: char.critDmg,
    atkSpd: getPlayerAttackSpeed(),
    lifeRegen: char.lifeRegen,
    dodge: char.dodge,
    blockPower: char.blockPower,
    level: char.level,
    stackDefense: char.bonus.stackDefense,
    dmgReduction: char.bonus.dmgReduction,
    hpToDmg: char.bonus.hpToDmg
  };
}

function markEnemyForRegen(enemy) {
  enemy.regen = {
    fromHp: enemy.currentHp,
    startTime: getGameTime(),
    stepIndex: enemy.__stepIndex   // 🔑 KLUCZ
  };
}

function getAttackSpeedPenaltyPercent(baseCooldown, newCooldown) {
  if (baseCooldown <= 0) return 0;

  return Math.round(
    ((newCooldown - baseCooldown) / baseCooldown) * 100
  );
}

/*function getBlockAtkSpeedMultiplier(blockPower) {
  const t = Math.min(Math.max(blockPower, 0), 1);
  return lerpAtkSpd(0.7, 0.2, t);
}*/

function getBlockAtkSpeedMultiplier(blockPower) {
  const t = Math.min(Math.max(blockPower, 0), 1);
  return lerpAtkSpd(0.85, 0.7, t);
}


function lerpAtkSpd(a, b, t) {
  return a + (b - a) * t;
}

function lerpPercent(min, max, t) {
  return Math.round(lerp(min, max, t) * 100) + "%";
}

function lerp(min, max, t) {
  t = Math.max(0, Math.min(1, t));
  return min + (max - min) * t;
}

function computeShieldPenalties(blockPower, atkSpeed = 1) {
  //console.error(`blockPower, getBlockAtkSpeedMultiplier, lerp(0.85, 0.7, blockPower)`, blockPower, getBlockAtkSpeedMultiplier(blockPower), lerp(0.85, 0.7, blockPower));

  return {
    attackPenalty: lerp(0.2, 0.35, blockPower), // 20–35%
    atkSpd: atkSpeed * lerp(0.85, 0.7, blockPower)
  };
}

/*function computeShieldPenalties(blockPower, atkSpeed = 1) {
  console.error(`blockPower, getBlockAtkSpeedMultiplier`, blockPower, getBlockAtkSpeedMultiplier(blockPower));
  return {
    attackPenalty: lerp(0.3, 0.65, blockPower),
    atkSpd: atkSpeed * getBlockAtkSpeedMultiplier(blockPower)
  };
}*/

function getStaminaRatio() {
  return gameState.resources.staminaState.current / gameState.resources.staminaState.max;
}

function updateFatigue() {
  const staminaState = gameState.resources.staminaState;
  const pct = staminaState.current / staminaState.max;

  if (pct > 0.7) staminaState.fatigue = "fresh";
  else if (pct > 0.4) staminaState.fatigue = "tired";
  else if (pct > 0.2) staminaState.fatigue = "exhausted";
  else staminaState.fatigue = "critical";
}

function getAttackSpeedMultiplier() {
  switch (gameState.resources.staminaState.fatigue) {
    //case "tired": return 0.9;
    case "tired":
      return 1 - ((1 - 0.95) * getFatiguePenaltyMultiplier());
    case "exhausted":
      return 1 - ((1 - 0.85) * getFatiguePenaltyMultiplier());
    case "critical": 
      return 1 - ((1 - 0.75) * getFatiguePenaltyMultiplier());

    default: return 1;
  }
}

function getStaminaRegenMultiplier() {
  switch (gameState.resources.staminaState.fatigue) {
    case "tired":
      return 1 - ((1 - 0.85) * getFatiguePenaltyMultiplier());
    case "exhausted":
      return 1 - ((1 - 0.6) * getFatiguePenaltyMultiplier());
    case "critical": 
      return 1 - ((1 - 0.35) * getFatiguePenaltyMultiplier());

    default: return 1;
  }
}

function getFatiguePenaltyMultiplier() {
  const reduction = gameState.char.combatAffixes[`stamina_fatique_penalty`]?.value || 0;

  return 1 - reduction / 100;
}

function getArmorReduction(armor, attackerLevel) {
  const K = 300 + attackerLevel * 60;
  return armor / (armor + K);
}

const RESIST_SOFT_CAP = 75; // maksymalna realna redukcja %
const RESIST_K = 120;      // tempo nasycania (im wyższe, tym wolniej)

function getEffectiveResist(rawResist) {
  return (rawResist / (rawResist + RESIST_K)) * RESIST_SOFT_CAP;
}

const CRIT_SOFT_CAP = 75; // maksymalna realna szansa
const CRIT_K = 60;       // tempo nasycania

function getEffectiveCritChance(rawCrit) {
  return (rawCrit / (rawCrit + CRIT_K)) * CRIT_SOFT_CAP;
}

function rollDamage(baseDmg) {
  const variance = 0.06; // 6%
  const roll = 1 + (Math.random() * 2 - 1) * variance;
  return Math.floor(baseDmg * roll);
}

function rollDefensiveReduction() {
  const min = 0.40;
  const max = 0.60;

  return min + Math.random() * (max - min);
}

function applyDefensivePenaltyDmgReduction(player, damage) {
  const { attackPenalty: penaltyDmg } = computeShieldPenalties(player.blockPower);
  
  return Math.floor(damage * (1 - penaltyDmg ));
}

function getStaminaBlockWindow() {
  const staminaRatio = getStaminaRatio();
    
  return lerp(0.6, 1, staminaRatio);
}

function getStaminaNormalBlockReduction(reduction) {
  const staminaRatio = getStaminaRatio();

  // 0 stamina → 60% skuteczności bloku
  const fatigueMultiplier = lerp(0.6, 1, staminaRatio);

  return reduction * fatigueMultiplier;
}

function getPerfectBlockRefund(baseCost, errorMs) {
  const staminaRatio = getStaminaRatio();
  const window = getStaminaBlockWindow();

  const precision = Math.max(0, 1 - Math.abs(errorMs) / window);

  // nagroda za skill
  const precisionRefund = lerp(0.8, 1.0, precision);

  // zmęczenie osłabia, ale nie zabija
  const staminaPenalty = lerp(0.6, 1, staminaRatio);

  return Math.round(baseCost * precisionRefund * staminaPenalty);
}

/*function getBlockWindows(player) {
  const staminaFactor = getStaminaBlockWindow(); // 0.6 – 1.0
  const bonusFactor = 1 + player.perfectWindowBonus;

  const perfect = 35 * staminaFactor * bonusFactor; // ±35 ms
  const normal  = 110 * staminaFactor;               // ±110 ms
  const miss    = TIMED_DURATION / 2;                // reszta

  return { perfect, normal, miss };
}*/

function msToPercent(ms) {
  return (ms / (PERFECT_CENTER * gameState.combat.openingStrike.windUpMultiplier)) * 50;
}

const BASE_TOTAL_WINDOW = 230; // ms (perfect + normal przy full stam)
const PERFECT_RATIO_MIN = 0.13;
const PERFECT_RATIO_MAX = 0.27;

function getBlockWindows(player) {
  const staminaFactor = getStaminaBlockWindow(); // np. 0.6 – 1.0
  
  let bonus = 0;
  if(gameState.char.combatAffixes[`perfect_block_window`]) {
    bonus = gameState.char.combatAffixes[`perfect_block_window`].value || 0;
  }
  
  const passiveBonus = 1 + (gameState.char.bonus.perfectWindowBonus / 100);
  
  const bonusFactor = 1 + (bonus / 100);
  //const bonusFactor = 1 + player.perfectWindowBonus;

  const precisionFactor = 1 + (gameState.combat.perfectChainBlock.perfectWindow / 100);
  
  // 1️⃣ Cały sensowny obszar bloku
  const total = BASE_TOTAL_WINDOW * staminaFactor * gameState.combat.openingStrike.windUpMultiplier;

  // 2️⃣ Proporcja perfecta (zależna od blockPower)
  const perfectRatio = lerp(
    PERFECT_RATIO_MIN,
    PERFECT_RATIO_MAX,
    player.blockPower
  );

  //GDYBY FLAT BYŁ ZA MOCNY
  const agiBonus = 1 + player.agi * 0.002; // 200 AGI = +40%
   
  //GDYBY BYŁA POTRZEBA LIMITU
  /*const maxPerfect = total * 0.6; // max 60% okna
  
  const perfect = Math.min(
    total * perfectRatio * bonusFactor * agiBonus,
    maxPerfect
  );*/
  
  // 3️⃣ Okna
  const perfect = total * perfectRatio * bonusFactor * agiBonus * precisionFactor * passiveBonus;
  const normal  = total - perfect;

  // 4️⃣ Miss = reszta paska
  const miss = (PERFECT_CENTER * gameState.combat.openingStrike.windUpMultiplier) - total;

  return {
    perfect,
    normal,
    miss
  };
}

/*function getBlockWindows(player) {
  const perfectWindow = getPerfectWindow(player.blockPower); 
  const staminaWindow = getStaminaBlockWindow();
  const perfectWindowBonus = player.perfectWindowBonus + 1;
  const perfect = perfectWindow * staminaWindow * perfectWindowBonus;
  console.error(`perfectWindow, staminaWindow, window`, perfectWindow, staminaWindow, window);
  
  const normal = 120;  
  const miss = TIMED_DURATION / 2;

  return {
    perfect: perfect,
    normal: normal * staminaWindow,
    miss: miss
  };
}*/

/*function getPerfectWindowRange(player) {
  const perfectWindow = getPerfectWindow(player.blockPower); 
  const staminaWindow = getStaminaBlockWindow();
  //const bonus = gameState.char.combatAffixes[`perfect_block_window`].value || 0;
  
  let bonus = 0;
  if(gameState.char.combatAffixes[`perfect_block_window`]) {
    bonus = gameState.char.combatAffixes[`perfect_block_window`].value || 0;
  }
  
  const perfectWindowBonus = 1 + (bonus / 100);

  const precisionFactor = 1 + (gameState.combat.perfectChainBlock.perfectWindow / 100);
  
  //const perfectWindowBonus = player.perfectWindowBonus + 1;
  const perfect = perfectWindow * staminaWindow * perfectWindowBonus * precisionFactor;
 // console.error(`perfectWindow, staminaWindow, window`, perfectWindow, staminaWindow, window);
  
  const half = perfect / 2;
  
  return {
    start: PERFECT_CENTER - half,
    end: PERFECT_CENTER + half
  };
}*/

function getTimedBlockReduction(blockPower) {
  // blockPower 0.25 – 0.75
  return lerp(0.35, 0.75, blockPower);
}

function getPerfectWindow(blockPower) {
  return lerp(30, 60, blockPower); // ms
}

function getTimedBlockCooldown(blockPower) {
  return lerp(1800, 800, blockPower); // ms
}

function getReflectPct(blockPower) {
  return lerp(0.10, 0.30, blockPower);
}

function getStunDuration(blockPower) {
  return lerp(1.0, 2.0, blockPower);
}

function getCritBonus(blockPower) {
  return lerp(0.75, 1.5, blockPower); // +75% → +150% dmg
}

function tryTriggerBlockReward(damage, player, enemy, isSim = false) {
  const playerBlock = gameState.combat.playerBlock;
  //const bonus = gameState.char.bonus.perfectWindowBonus;
  
  /*let bonus = 0;
  if(gameState.char.combatAffixes[`perfect_block_window`]) {
    bonus = gameState.char.combatAffixes[`perfect_block_window`].value || 0;
  }*/

  // console.error(`bonus reward`, bonus);
  const rewards = ["reflect", "stun", "crit"];
  //const rewards = ["stun"];
  const reward = rewards[Math.floor(Math.random() * rewards.length)];
  
  switch (reward) {
    case "reflect":
      let reflectDamage = getReflectPct(player.blockPower);
      dealDamageToEnemy(enemy, Math.floor(damage * reflectDamage));
      showReward(`+${(reflectDamage * 100).toFixed(0)}% ${t("dmg_reflect_reward")}`, 2100);
      break;

    case "stun":
      let stunDuration = getStunDuration(player.blockPower) * 1000;
      applyEnemyStun(enemy, 0.001, stunDuration, gameState.world.selectedSlotIndex);
      //showReward(`${(stunDuration / 1000).toFixed(1)}${t("stun_enemy_reward")}`, 2100);
      break;

    case "crit":
      playerBlock.critBonus = getCritBonus(player.blockPower);
      showReward(`${t("next_crit_reward")} x${(playerBlock.critBonus + 1).toFixed(1)}`, 2100);
      playerBlock.nextAttackGuaranteedCrit = true;
      break;
  }
    if(isSim) {
      //console.error(`reward`, reward);
      return reward;
  }
}

function rollChance(chance) {
  return Math.random() < chance;
}

function getDefensiveBlockReduction(blockPower) {
  const staminaRatio = getStaminaRatio(); // 0–1

  // 1️⃣ Normalizacja blockPower
  // 30 → 0
  // 60 → 1
  const t = Math.max(0, Math.min(1, (blockPower - 30) / 30));

  // 2️⃣ Agresywna krzywa (szybko rośnie)
  const baseReduction = lerp(0.6, 0.95, t * t);

  // 3️⃣ Stamina MA WPŁYW, ale nie zabija
  const staminaPenalty = lerp(0.85, 1, staminaRatio);

  let reduction = baseReduction * staminaPenalty;

  reduction += (gameState.char.combatAffixes[`dmg_reduction_blocking`]?.value || 0) / 100;
  
  return Math.min(reduction, 0.95);

  
 // return Math.min(baseReduction * staminaPenalty, 0.95);
}

function applyDevensiveBlockRegen(deltaTime) {
  const combat = gameState.combat;
  const char = gameState.char;
  
  if (combat.playerBlock.mode === "timed" || !combat.playerBlock.active) return;
  
  /*const regen =
    combat.stats.maxHp *
    (DEFENSIVE_HP_REGEN_PERCENT_PER_SEC / 100) *
    deltaTime;
  
  combat.stats.currentHp = Math.min(combat.stats.currentHp + regen, combat.stats.maxHp);
  
  renderHpBar(combat.stats.currentHp, combat.stats.maxHp);
  */
  
  const enemy = gameState.world.exploreOptions[gameState.world.selectedSlotIndex]?.enemyData;

  const bleedDamage = enemy?.bleed?.damage;
  
  let regenPerSec = DEFENSIVE_HP_REGEN_PERCENT_PER_SEC;
  
  let regenBonus = 1;
  
  if(gameState.char.combatAffixes[`hp_regen_blocking`]) {
    regenPerSec *= 1 + ((gameState.char.combatAffixes[`hp_regen_blocking`].value || 0) / 100);
  } 
  
  //console.error(`enemy?.bleed?.damage`, enemy?.bleed?.damage);

  let regen =
    char.maxHp *
    (regenPerSec / 100) *
    deltaTime;
  
  //console.error(`hp regen blocking`, regen);
  
  if(bleedDamage && gameState.char.combatAffixes[`hp_regen_of_bleed_dmg_while_blocking`]) {
    const value = gameState.char.combatAffixes[`hp_regen_of_bleed_dmg_while_blocking`].value;
   
   // console.error(`bleed hp regen value`, value);

    regen += bleedDamage * (value / 100) * deltaTime;
  }

 // console.error(`hp regen from bleed blocking, bleedDamage`, regen, bleedDamage);

  //console.log(`hp regen blocking`, DEFENSIVE_HP_REGEN_PERCENT_PER_SEC * regenBonus);
  
  char.hp = Math.min(char.hp + regen, char.maxHp);
  
  renderHpBar(char.hp, char.maxHp);
  
}

let guardStacks = 0;

function consumeGuardStacksOnAttack(damage) {
  //console.error(`consumeGuardStacksOnAttack block active`, gameState.combat.playerBlock.active);

  if (gameState.combat.activeRingMode !== `guard`) return damage;
  
  if (gameState.combat.playerBlock.mode === `timed`) return damage;
  
  if (gameState.combat.playerBlock.active) return damage;
  
  let bonus = 1; // +15% per stack
  
  if(guardStacks == 1) bonus = 1.3;
  if(guardStacks == 2) bonus = 1.75;
  if(guardStacks == 3) bonus = 2.3;
  
  if(guardStacks == 3) {
    showOutcome("miss", `${t("gurd_momentum_outcome")}`);
    triggerCriticalShake();
  }
  
  if(gameState.char.combatAffixes[`consume_guard_restore_hp`]) {
    const restoredHp = gameState.char.combatAffixes[`consume_guard_restore_hp`].value * Math.sqrt(guardStacks);
    healPlayer(restoredHp);
    //console.error(`consumeGuard restoredHp * stacks`, restoredHp, Math.sqrt(guardStacks));
  }
  
  const defValue = (gameState.char.combatAffixes["def_per_guard_stack"]?.value || 0) * guardStacks;
  const dmgValue = (gameState.char.combatAffixes["dmg_per_guard_stack"]?.value || 0) * guardStacks;
  
  gameState.combat.guardBonus.critBonus.isActive = false;
  gameState.combat.guardBonus.critBonus.stacks = 0;
  gameState.combat.guardBonus.defBonus.isActive = false;
  gameState.combat.guardBonus.defBonus.stacks = 0;
  gameState.combat.guardBonus.dmgBonus.isActive = false;
  gameState.combat.guardBonus.dmgBonus.stacks = 0;
  
  guardStacks = 0;
  
  //console.error(`consumeGuard gameState.combat.activeBonus.def`, gameState.combat.activeBonus.def);

  //decreaseBonusDefBuff(defValue);
  //decreaseBonusDmgBuff(dmgValue);

  gameState.combat.activeBonus.defSources.guard = 0;
  recalculateDefenseBonus();
  
  gameState.combat.activeBonus.dmgSources.guardStacks = 0;
  recalculateDamageBonus();
  
  clearAllDiffs(`def`);
  clearAllDiffs(`dmg`);
  
  gameState.combat.activeBonus.critSources.guardStacks = 0;
  recalculateCritBonus();
      
  
  //console.error(`consumeGuardStacksOnAttack block bonus`, bonus);
  
  consumeGuardStacks(guardStacks);
  
  return Math.floor(damage * bonus);
}

function decreaseGuardStack() {
  if(gameState.char.combatAffixes[`def_per_guard_stack`]) {
    const defBonus = gameState.char.combatAffixes[`def_per_guard_stack`].value;
    gameState.combat.activeBonus.defSources.guard = defBonus * guardStacks;
    recalculateDefenseBonus();
    if(guardStacks === 0) {
      gameState.combat.guardBonus.defBonus.isActive = false;
      clearAllDiffs(`def`);
    }
  }                


  
    if(gameState.char.combatAffixes[`dmg_per_guard_stack`]) {
    const dmgBonus = gameState.char.combatAffixes[`dmg_per_guard_stack`].value;
    gameState.combat.activeBonus.dmgSources.guardStacks = dmgBonus * guardStacks;
    recalculateDamageBonus();
    if(guardStacks === 0) {
      gameState.combat.guardBonus.dmgBonus.isActive = false;
      clearAllDiffs(`dmg`);
    }
  }                

  
  
  if(gameState.char.combatAffixes[`crit_per_guard_stack`]) {
    const critBonus = gameState.char.combatAffixes[`crit_per_guard_stack`].value;
    gameState.combat.activeBonus.critSources.guardStacks = critBonus * guardStacks;
    recalculateCritBonus();
    if(guardStacks === 0) {
      gameState.combat.guardBonus.critBonus.isActive = false;
    }
  }                
  
}

function getPotionEffectMultiplier() {
  return (gameState.combat.playerBlock.mode === "defensive" && gameState.combat.playerBlock.active)
    ? DEFENSIVE_POTION_EFFECT_MULTIPLIER
    : 1;
}

function onPerfectBlock() {
 // const player = getPlayerStats();
  
  //const energyGain = 2 * (1 + player.perfectBlockEnergy);
  
  let energyGain = 0;
  if(gameState.char.combatAffixes[`energy_on_perfect_block`]) {
    value = gameState.char.combatAffixes[`energy_on_perfect_block`].value || 0;
    energyGain = 1 * (1 + (value / 100));
  }
  
  gainEnergy(energyGain);
  //showReward(`+${(energyGain).toFixed(1)} ${t("to_energy_reward")}`, 2300);
  
  showEnergyGain(energyGain);
}

function onCrit() {
  //const player = getPlayerStats();
  
  //console.error(`player.critEnergy`, player.critEnergy);
 
  //const energyGain = 1 * (1 + player.critEnergy);
  
  let energyGain = 0;
  if(gameState.char.combatAffixes[`energy_on_crit`]) {
    value = gameState.char.combatAffixes[`energy_on_crit`].value || 0;
    energyGain = 1 * (1 + (value / 100));
  }
  
  gainEnergy(energyGain);
  //showReward(`+${(energyGain).toFixed(1)} ${t("to_energy_reward")}`, 2300);
  showEnergyGain(energyGain);
}

function getEnergyCombatMultiplier(cost) {
  const energyState = gameState.resources.energyState;

  if (energyState.current >= cost) return 1;

  const ratio = energyState.current / cost;

  
  return Math.max(0.35, ratio);
}

function applyEnergyDebuff(mult) {
  const combat = gameState.combat;

  combat.stats.energyMultiplier = mult;

  combat.stats.hp *= mult;
  combat.stats.dmg *= mult;
  combat.stats.def *= mult;
  
  renderStats();
  updateGlobalStatsColors();
}

function applyEnergyFatigue(isPreview = false) {
  const combat = gameState.combat;

  const f = combat.stats.energyFatigueStack;
  const penalty = Math.min(f * 0.05, 0.25);
  
  //console.error(`applyEnergyFatigue f, penalty`, f, penalty);
  
  combat.stats.hp *= (1 - penalty);
  combat.stats.dmg *= (1 - penalty);
  combat.stats.def *= (1 - penalty);
  
  showOutcome("miss", `${t("tired_outcome")} x${f}`, 3500);
  
  if(gameState.char.combatAffixes[`crit_while_energy_fatique`]) {
    gameState.combat.energyBonus.critBonus.isActive = true;
    
    const critBonus = gameState.char.combatAffixes[`crit_while_energy_fatique`].value;
    gameState.combat.activeBonus.critSources.energy = critBonus;
    recalculateCritBonus();
  }
  
  if(gameState.char.combatAffixes[`dmg_while_energy_fatigue`]) {
    gameState.combat.energyBonus.dmgBonus.isActive = true;
    const dmgBonus = gameState.char.combatAffixes[`dmg_while_energy_fatigue`].value;
    
    gameState.combat.activeBonus.dmgSources.energy = dmgBonus;
    if(!isPreview) recalculateDamageBonus();
  }
  
  renderStats();
}

function setStatPreview({ hp, dmg, def }) {
  document.getElementById("hp").textContent = Math.floor(hp);
  document.getElementById("dmg").textContent = Math.floor(dmg);
  document.getElementById("def").textContent = Math.floor(def);
}

function restoreBaseStats() {
  const base = getPlayerStats(); // twoja funkcja

  document.getElementById("hp").textContent = formatNumber(base.maxHp);
  document.getElementById("dmg").textContent = formatNumber(base.dmg);
  document.getElementById("def").textContent = formatNumber(base.def);

  updateGlobalStatsColors(); // wraca do default / buff
}

let debuffPreviewTimer = null;

function debuffStatsPreview(type, i) {
  initCombatState();
  const combat = gameState.combat;

  const attackBtn = document.getElementById(`slot-attack-button-${i}`);
  const cost = getEnergyCostForSlot(type);
  const multiplier = getEnergyCombatMultiplier(cost);
  const f = combat.stats.energyFatigueStack;

  if (multiplier >= 1) return;

  applyEnergyDebuff(multiplier);
  
  applyEnergyFatigue(true);
  
  showOutcome("miss", `${t("tired_outcome")} x${f}`, 3500);

  // 🛑 wyczyść poprzedni preview jeśli istnieje
  if (debuffPreviewTimer) {
    clearTimeout(debuffPreviewTimer);
  }

  // 👁️ POKAŻ PREVIEW
  setStatPreview({
    hp: combat.stats.hp,
    dmg: combat.stats.dmg,
    def: combat.stats.def
  });

  combat.flags.previewStats = true;
  combat.stats.energyMultiplier = multiplier;

  updateGlobalStatsColors();

  attackBtn.classList.add("hidden");
 
  // ⏳ COFNIJ PO CHWILI
  debuffPreviewTimer = setTimeout(() => {
    combat.flags.previewStats = false;
    restoreBaseStats();
    debuffPreviewTimer = null;
    attackBtn.classList.remove("hidden");
  }, 1500); // 👈 idealne UX: 1–1.5s
}

function applyDeathDebuff() {
  const combat = gameState.combat;

  combat.deathDebuff.deathMultiplier = 0.9;
  combat.deathDebuff.deathDebuffFightsLeft = 2;
  
  saveGame();
}

function handleDeathDebuffAfterFight() {
  const combat = gameState.combat;

  if (combat.deathDebuff.deathDebuffFightsLeft > 0) {
    combat.deathDebuff.deathDebuffFightsLeft--;

    if (combat.deathDebuff.deathDebuffFightsLeft <= 0) {
      combat.deathDebuff.deathMultiplier = 1;
    }
  }
  
}

function applyHpToDmgBonus(threshold, maxBonus) {
  const combat = gameState.combat;
  const ls = combat.criticalLastStand;

  //console.error(`maxBonus before`, maxBonus);
  
  if (ls?.active) {
    threshold = Math.max(threshold, ls.bonusThreshold);
    maxBonus = Math.max(maxBonus, ls.bonusCap);
  }
  
  //console.error(`maxBonus after`, maxBonus);
  
  const hpPct = combat.stats.currentHp / combat.stats.maxHp;
  
  let curve = 1;
  
  if(threshold >= 0.4) curve = 2;
  if(threshold >= 0.5) curve = 3;
  
  if (hpPct >= threshold) return 1;

  const progress =
    (threshold - hpPct) / threshold;

  const bonus = maxBonus * Math.pow(progress, curve);

  //showReward(`+${(bonus * 100).toFixed(0)}% ${t("last_stand_reward")}`);
  
  return 1 + bonus;
}

function triggerIronStance(reduction, cooldownMs) {
  const s = gameState.combat.ironStance;
  const now = getGameTime();

  if(!s.reduction) return;
  
  if (now < s.cooldownUntil) return;

  s.reduction = reduction;
  s.primed = true;
}

function applyIronStanceReduction(dmg, cooldownMs) {
  const s = gameState.combat.ironStance;
  if (!s.primed) return dmg;

  s.primed = false;
  s.cooldownUntil = getGameTime() + cooldownMs;

  return dmg * (1 - s.reduction);
}

function addArmorStack(durationMs) {
  const now = getGameTime();
  const s = gameState.combat.armorStacks;

  // jeśli okno nieaktywne lub wygasło → start nowego okna
  if (!s.active || now > s.expiresAt) {
    s.active = true;
    s.stacks = 1;
    s.expiresAt = now + durationMs;
    return;
  }

  // jeśli okno aktywne → tylko stackuj
  s.stacks = Math.min(s.stacks + 1, 5);
}

function getArmorWithStacks(baseArmor, stackBonus) {
  const s = gameState.combat.armorStacks;

  if (!s.active || getGameTime() > s.expiresAt) {
    s.active = false;
    s.stacks = 0;
    return baseArmor;
  }

  return baseArmor * (1 + s.stacks * stackBonus);
}

let actionLockTimeout = null;

function lockActions({ duration, reason, allow = [] }) {
  const actionLock = gameState.combat.actionLock;
  actionLock.locked = true;
  actionLock.reason = reason;
  actionLock.allowedActions = allow;
  
  if (duration !== Infinity) {
    actionLock.until = Date.now() + duration;

    if (actionLockTimeout) clearTimeout(actionLockTimeout);

    actionLockTimeout = setTimeout(unlockCriticalActions, duration);
  } else {
    actionLock.until = Infinity;
  }

  saveGame();
  updateActionLockUI();
}

function restoreActionLock() {
  const actionLock = gameState.combat.actionLock;
  
  if (!actionLock.locked) return;

  if (actionLock.until === Infinity) return;

  const remaining = actionLock.until - Date.now();

  if (remaining <= 0) {
    unlockCriticalActions();
  } else {
    actionLockTimeout = setTimeout(unlockCriticalActions, remaining);
  }
  
}

function unlockCriticalActions() {
  const actionLock = gameState.combat.actionLock;

  actionLock.locked = false;
  actionLock.reason = null;
  actionLock.until = 0;
  actionLock.allowedActions = [];

  if (actionLockTimeout) {
    clearTimeout(actionLockTimeout);
    actionLockTimeout = null;
  }

  saveGame();
  updateActionLockUI();
}

function canPerformAction(actionType) {
  const actionLock = gameState.combat.actionLock;
 // console.error(`enter canPerformAction locked, has allowed, actionType`, actionLock.locked, actionLock.allowedActions.includes(actionType), actionType);

  if (!actionLock.locked) return true;
  return actionLock.allowedActions.includes(actionType);
}

function lockCombatScroll() {
  document.body.classList.add("no-scroll");
  //document.body.style.touchAction = "none";
  //console.error(`enter locked scroll,`);
}

function unlockCombatScroll() {
  document.body.classList.remove("no-scroll");
  //document.body.style.touchAction = "auto";
}

function updateActionLockUI() {
  const { locked, allowedActions } = gameState.combat.actionLock;
  const dlgContainer = document.getElementById("attack-dialog-box");

  // 🔥 1 operacja zamiast wielu
  dlgContainer.classList.toggle("locked", locked);

  // 🔥 tylko dla wyjątków (mało elementów)
  actionElements.forEach(el => {
    const action = el.dataset.action;

    if (allowedActions.includes(action)) {
      el.classList.add("allowed");
    } else {
      el.classList.remove("allowed");
    }
  });
}

/*function updateActionLockUI() {
  const actionLock = gameState.combat.actionLock;

  actionElements.forEach(el => {
    const action = el.dataset.action;

    if (!actionLock.locked || actionLock.allowedActions.includes(action)) {
      el.classList.remove("locked");
    } else {
      el.classList.add("locked");
    }
  });
}*/

function enterCriticalState() {
  const combat = gameState.combat;
  const enemy = gameState.world.exploreOptions[gameState.world.selectedSlotIndex].enemyData;
  const playerBlock = combat.playerBlock;
  const player = getPlayerStats();
  const style = getCurrentWeaponStyle();

  combat.flags.isCritical = true;
  gameState.combat.flags.isBlocked = false;
  
  playerBlock.cooldownUntil = 0;
  
  combat.stats.currentHp = 0;

  stopEnemyAttack(gameState.world.selectedSlotIndex); // przerywa CD, jelly, wszystko

  resetBleed(enemy);
  clearBleed(enemy);
  stopWhirlwind(); 
  
  //console.error(`enter critical state`);
 // lockActions({ duration: Infinity, reason: "critical", allow: ["potion", "block"] });
  pauseAllSkillsCooldown();
 // pausePlayerAttack();
  
  hideFleeButton();
  
  //showCriticalUI();

 // showOutcome(`miss`, `STAN KRYTYCZNY`);
  showEnemyOutcome("wind-up", `${t("windup_critical_outcome")}`, CRITICAL_FINISHER_TIME - 600);
     
  //triggerCriticalShake();
  if(gameState.combat.playerBlock.mode === "timed" || gameState.combat.playerBlock.mode === "defensive") {
    pausePlayerAttack();
    lockActions({ duration: Infinity, reason: "critical", allow: ["potion", "block"] });

    setTimeout(() => {
      activateTimedBlock();
    }, 1000);
  } 
  
  if(style === "berserker") {
    showBleedTimingUI(player);
    lockActions({ duration: Infinity, reason: "critical", allow: ["potion", "attack"] });
    //console.error(`showBleedTimingUI Critical`);
  }
  
  if(style === "warden") {
    startSpearControlUI(player);
    lockActions({ duration: Infinity, reason: "critical", allow: ["potion", "attack"] });
  }

  
  startFinisherBar(CRITICAL_FINISHER_TIME, enemy);
  
  startEnemyFinisherWindup(enemy, gameState.world.selectedSlotIndex);
}

function startEnemyFinisherWindup(enemy, slotIndex) {
  const baseCooldown = calculateCooldown(enemy.atkSpd, enemy) * 1000;
  
  enemy.attackState = {
    phase: "finisher-windup",
    remaining: CRITICAL_FINISHER_TIME,
   // total: CRITICAL_FINISHER_TIME
  };

 // console.error(`start finisher wind up`);
  
  emitEnemyAttackWindup({
    enemy,
    slotIndex,
    duration: CRITICAL_FINISHER_TIME
  });
  
  enemy.finisherTimeout = setTimeout(() => {
    if(!gameState.combat.flags.isBlocked) {
      //console.error(`perform finisher timeout, isCritical`, gameState.combat.flags.isCritical);

      performEnemyFinisherAttack(enemy, slotIndex);
      
      stopTimedBlockUI();
      stopBleedTimingUI();
      stopSpearControlUI();
    }
  }, CRITICAL_FINISHER_TIME);
}

function performEnemyFinisherAttack(enemy, slotIndex) {
 // console.error("FINISHER ATTACK");
  const combat = gameState.combat;
  const player = getPlayerStats();
  
  if (!combat.flags.isCritical) return;

  let dmg = applyBlock(enemy.dmg, player, enemy);
  
  ({ dmg: dmg } = calculateReducedEnemyDamage(dmg, enemy, player));
  
  if (combat.flags.isBlocked && combat.playerBlock.lastResult === `perfect`) { 
    //combatState.isBlocked = false;
    combat.stats.currentHp = 2;
    //console.error("combat.stats.currentHp", combat.stats.currentHp);
  }

  if (enemy.bleedLastResult === `perfect`) {
    combat.stats.currentHp = 2;
    //console.error("combat.stats.currentHp bleed", combat.stats.currentHp);
  }

  if (enemy.spearLastResult === `perfect`) {
    combat.stats.currentHp = 2;
    //console.error("combat.stats.currentHp spear", combat.stats.currentHp);
  }

  
  triggerCriticalShake();
  
  //console.error("combatState.currentHp in perform finsher attack and dmg", combat.stats.currentHp, dmg);
  updatePlayerHp(combat.stats.currentHp - dmg);

  resolveFinalEnemyAttack(enemy);
}

function resolveFinalEnemyAttack(enemy) {
  const combat = gameState.combat;
  if (!combat.flags.isCritical) return;
  
  enemy.spearLastResult = null;
  enemy.bleedLastResult = null;

  
  if (combat.stats.currentHp > 0) {
    exitCriticalState();
    return;
  }
  
  handlePlayerDeath();
}

function exitCriticalState() {
  const combat = gameState.combat;
  const enemy = gameState.world.exploreOptions[gameState.world.selectedSlotIndex].enemyData;
  combat.flags.isCritical = false;
  combat.flags.isBlocked = false;

  unlockCriticalActions();

  //console.error(`exit critical state`);
  
  resumeAllSkillsCooldown();
  resumePlayerAttack();
  
  applyEnemyRecoveryAfterFinisher(enemy, gameState.world.selectedSlotIndex);
  
  showOutcome(`wind-up`, `${t("survive_outcome")}`);

  grantCriticalLastStand();
  
  showFleeButton();
  
  
  //showRecoverUI();
}

function applyEnemyRecoveryAfterFinisher(enemy, slotIndex) {
  const bar = document.querySelector(".enemy-cooldown-bar");
  const fill = document.getElementById(`enemy-cooldown-fill-${slotIndex}`);

  const RECOVERY_TIME = 1500; // 2 sekundy

  stopEnemyAttack(slotIndex);

  bar.classList.add("recovery");
  fill.classList.add("recovery");

  //updateCooldownBar(0, slotIndex);
  
  setTimeout(() => {
    if (!gameState.combat.flags.isCritical) {
      bar.classList.remove("recovery");
      fill.classList.remove("recovery");

      startEnemyAttackTimeline(enemy, slotIndex);
    }
  }, RECOVERY_TIME);
}

function grantCriticalLastStand() {
  gameState.combat.criticalLastStand = {
    active: true,
    bonusThreshold: 0.6,   // normalnie np. 0.3
    bonusCap: 0.6          // max +60% dmg
  };
  
  const player = getPlayerStats();

  const newHp = player.maxHp * 0.5;
  updatePlayerHp(newHp);  
  
  //showOutcome("buff", "OSTATNI ZRYW");
}

function criticalPotionModifier() {
  const staminaRatio = getStaminaRatio();

  // od 100% do 160%
  return 1 + staminaRatio * 0.6;
}

function criticalBlockReduction() {
  const staminaRatio = getStaminaRatio(); // 0–1
  
  return 0.3 + staminaRatio * 0.4; // 30% → 70%
}

function calculateDeathGoldLoss(gold) {

  const pctLoss = Math.floor(gold * 0.15);
  const flatLoss = 50; // minimalna kara

  return Math.min(gold, Math.max(flatLoss, pctLoss));
}

function getPlayerGold() {
  return parseInt(gameState.resources.gold, 10);
}

function setPlayerGold(value) {
  gameState.resources.gold = value;
  saveGame();
}

function handlePlayerDeath() {
  const context = collectDeathContext();
  const combat = gameState.combat;

  let gold = getPlayerGold(); // ⬅️ JEDNO ŹRÓDŁO
  const goldLoss = calculateDeathGoldLoss(gold);
  const goldLeft = Math.max(0, gold - goldLoss);
  
  stopEnemyAttack(gameState.world.selectedSlotIndex);
  
  exitCombat();
  combat.flags.isCritical = false;
  combat.flags.isBlocked = false;
  hideFleeButton();
  //console.warn(`lose combat in combat atack`);
  showOutcome(`miss`, `${t("loose_outcome")}`);
  
  loseCombat();
  //unlockCriticalActions();
  resumeAllSkillsCooldown();
  resumePlayerAttack();
  
  if(gameState.world.mode === `expedition`) {
    showExpeditionRunSummary(true);
    return;
  }
  
  //gameState.world.currentStepIndex = 0;
  //loadStep(gameState.world.currentStepIndex); // ← ładuje stan exploreOptions i inne rzeczy
  //unlockActions();
  //lockActions({ duration: 5000, reason: "death" });
  
  const nextArrow = document.getElementById("arrow-next-icon");
  const nextLevel = document.getElementById("next-level");
  const nextBtn = document.getElementById("next-btn");

  nextArrow.classList.remove(`hidden`);
  nextLevel.classList.add(`hidden`);
  
  nextBtn.onclick = (e) => { 
    e.stopPropagation(); 
    rollOptions();
  };
  
  //renderOptions(); // ← renderuje sloty, wrogów, skrzynie itd.
  stopEnemyUiRegenTick();
  hideAttackBtn();
  highlightCurrentStep(); // ← aktualizuje pasek postępu
  
  renderStats();
  
  setPlayerGold(goldLeft); // ⬅️ zapis + runtime + localStorage
  applyDeathDebuff(); 
  
  playSound(`death`, 0.4);
 
  showDeathPopupDelayed({ goldLost: goldLoss, context })
}

/*function showDeathPopup() {
  const debuffEl = document.getElementById("death-debuff");
  const debuffValueEl = document.getElementById("death-debuff-value");
  const combat = gameState.combat;

  if (combat.deathDebuff.deathMultiplier < 1) {
    const percent = Math.round((1 - combat.deathDebuff.deathMultiplier) * 100);

    debuffValueEl.textContent = `-${percent}% ${t("death_penalty_text1")} (${combat.deathDebuff.deathDebuffFightsLeft} ${t("death_penalty_text2")})`;
    debuffEl.classList.remove("hidden");
  } else {
    debuffEl.classList.add("hidden");
  }

  document.getElementById("death-popup").classList.remove("hidden");
}*/


function showDeathPopupDelayed({ goldLost, context }) {
  const popup = document.getElementById("death-popup");
  const info = document.getElementById("death-info");
  const goldEl = document.getElementById("gold-loss");
  const tipEl = document.getElementById("death-tip");
  const popupCard = popup.querySelector(".popup-content");
  const debuffEl = document.getElementById("death-debuff");
  const debuffValueEl = document.getElementById("death-debuff-value");
  const combat = gameState.combat;

  setPopupBackground2(popupCard, "common");
  
  const reasonText = pickDeathReason(context);
  const tipText = getRandomDeathTip();

  info.textContent = t(reasonText);
  tipEl.textContent = `${t(tipText)}`;
  goldEl.textContent = goldLost;
  
  if (combat.deathDebuff.deathMultiplier < 1) {
    const percent = Math.round((1 - combat.deathDebuff.deathMultiplier) * 100);

    debuffValueEl.textContent = `${t("death_penalty_text1")} ${percent}% ${t("death_penalty_text2")} ${combat.deathDebuff.deathDebuffFightsLeft} ${t("death_penalty_text3")}.`;
    
    debuffEl.classList.remove("hidden");
  } else {
    debuffEl.classList.add("hidden");
  }
  
  setTimeout(() => {
    popup.classList.remove("hidden");

    // 🔑 wymuszenie reflow
    void popup.offsetHeight;

    popup.classList.add("visible");
  }, 1000);
  
  
  const deathBtn = document.getElementById("death-confirm");
    
  deathBtn.classList.add("locked");
  deathBtn.disabled = true;

  setTimeout(() => {
    deathBtn.classList.remove("locked");
    deathBtn.disabled = false;
  }, 3000);
  
  deathBtn.onclick = () => {
    popup.classList.remove("visible");
    
    gameState.world.currentStepIndex = 0;
    syncStepEnemies(gameState.world.currentStepIndex);
    
    loadStep(gameState.world.currentStepIndex); // ← ładuje stan exploreOptions i inne rzeczy
    showNavigateButtons();
    navigate(`battle`);
    
    setTimeout(() => {
      popup.classList.add("hidden");
      unlockCriticalActions();
    }, 600); // tyle co transition
  };
  
  setGlobalButtonTexture(deathBtn);
}

function collectDeathContext() {
  const enemy = gameState.world.exploreOptions[gameState.world.selectedSlotIndex]?.enemyData;
  const player = getPlayerStats();
  const combat = gameState.combat;
  const resources = gameState.resources;

  const ctx = {
    wasBlocking: combat.flags.isBlocked,
    blockSuccess: combat.playerBlock.lastResult === `perfect`,
    potionsEmpty: resources.potions.every(p => !p),
    hadPotions: resources.potions.some(p => p),
    lowEnergy: resources.energyState.current <= 2,
    energyDebuffStacks: combat.stats.energyFatigueStack > 1,
    enemyOverwhelmed: isOverwhelmed({
      player,
      enemy,
      context: {
        potionsEmpty: resources.potions.every(p => !p),
        lowEnergy: resources.energyState.current <= 2,
        energyDebuffStacks: combat.stats.energyFatigueStack > 1
      }
    })
  };
  
  /*console.error(`wasBlocking`, ctx.wasBlocking);
  console.error(`blockSuccess`, ctx.blockSuccess);
  console.error(`potionsEmpty`, ctx.potionsEmpty);
  console.error(`hadPotions`, ctx.hadPotions);
  console.error(`lowEnergy`, ctx.lowEnergy);
  console.error(`energyDebuffStacks`, ctx.energyDebuffStacks);
  console.error(`enemyOverwhelmed`, ctx.enemyOverwhelmed);*/

  
  return ctx;
}

function collectDeathReasons(context) {
  const reasons = [];

  if (context.wasBlocking && !context.blockSuccess) {
    reasons.push({ type: "failedBlock", weight: 6 });
  }

  if (context.enemyOverwhelmed) {
    reasons.push({ type: "overwhelmed", weight: 5 });
  }
  
  if (context.lowEnergy) {
    reasons.push({ type: "exhaustion", weight: 4 });
  }

  if (context.potionsEmpty) {
    reasons.push({ type: "noPotions", weight: 3 });
  }

  if (!context.wasBlocking && context.hadPotions) {
    reasons.push({ type: "panic", weight: 2 });
  }

  return reasons;
}

function pickDeathReason(context) {
  const candidates = collectDeathReasons(context);
  
  const top = candidates.sort((a, b) => b.weight - a.weight)[0];
  return randomFrom(deathReasons[top.type]);
}

function calculateOverwhelmedScore({ player, enemy, context }) {
  let score = 0;

  // A. Przewaga wroga
  if (enemy.level >= player.level + 2) score += 2;
  if (enemy.attack >= player.maxHp * 0.6) score += 2;
  if (enemy.type === `elite`) score += 1;
  if (enemy.type === `mini_boss`) score += 2;

  // B. Zły stan gracza
  if (player.currentHp < player.maxHp * 0.4) score += 1;
  if (context.lowEnergy) score += 1;
  if (context.energyDebuffStacks) score += 2;

  // C. Tempo walki
  if (enemy.atkSpd >= 1) score += 1;
  
  // D. Brak opcji ratunku
  if (context.potionsEmpty) score += 1;
  
  return score;
}

const OVERWHELMED_THRESHOLD = 4;

function isOverwhelmed(state) {
  const score = calculateOverwhelmedScore(state);
  return score >= OVERWHELMED_THRESHOLD;
}

function showLevelUpPopup() {
  const popup = document.getElementById("levelup-popup");
  const popupCard = popup.querySelector(".popup-content");
  const flavorEl = popup.querySelector(".levelup-flavor");
  const level = document.getElementById("levelup-lvl");

  setPopupBackground2(popupCard, "set");
  
  //console.error(`enter levelup`);
  
  level.textContent = `${t("enemy_lvl_info")} ` + gameState.char.level;
  flavorEl.textContent = t(getRandomLevelUpFlavor());
     
  setTimeout(() => {
    popup.classList.remove("hidden");
    popup.classList.remove("visible");
    
    playSound(`level-up`, 1.6, 0.8, 0.3);
    
    // 🔑 wymuszenie reflow
    void popup.offsetHeight;

    popup.classList.add("visible");
    //console.error(`showup levelup`);

  }, 1000);
  
  const levelUpBtn = document.getElementById("levelup-confirm");
    
  levelUpBtn.classList.add("locked");
  levelUpBtn.disabled = true;

  setTimeout(() => {
    levelUpBtn.classList.remove("locked");
    levelUpBtn.disabled = false;
  }, 3000);
  
  levelUpBtn.onclick = null;
  levelUpBtn.onclick = () => {
    popup.classList.remove("visible");
    
    setTimeout(() => {
      popup.classList.add("hidden");
    }, 600); 
  };
  
  setGlobalButtonTexture(levelUpBtn);
  //console.error(`end levelup`);

}

function getRandomLevelUpFlavor() {
  return levelUpFlavors[Math.floor(Math.random() * levelUpFlavors.length)];
}

function showEndStoryPopup() {
  const popup = document.getElementById("endstory-popup");
  const popupCard = popup.querySelector(".popup-content");
  
  setPopupBackground2(popupCard, "set");
  
  //console.error(`enter levelup`);
  
  gameState.world.isStoryEnded = true;
  
  localStorage.setItem("adventure_unlocked", true);
  
  setTimeout(() => {
    popup.classList.remove("hidden");
    popup.classList.remove("visible");
    
    playSound(`level-up`, 1.6, 0.8, 0.3);
    
    // 🔑 wymuszenie reflow
    void popup.offsetHeight;

    popup.classList.add("visible");
  }, 100);
  
  const endStoryBtn = document.getElementById("endstory-confirm");
    
  endStoryBtn.classList.add("locked");
  endStoryBtn.disabled = true;

  setTimeout(() => {
    endStoryBtn.classList.remove("locked");
    endStoryBtn.disabled = false;
  }, 3000);
  
  endStoryBtn.onclick = null;
  endStoryBtn.onclick = () => {
    popup.classList.remove("visible");
    
    setTimeout(() => {
      popup.classList.add("hidden");
    }, 600); 
  };
   
  setGlobalButtonTexture(endStoryBtn);
  //console.error(`end levelup`);

  saveGame();
}



