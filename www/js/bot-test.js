function createBlockDecision({
  type = "NONE",
  errorMs = null,
  source = "unknown"
} = {}) {
  return { type, errorMs, source };
}

let simPlayer = null;

const enemySelect = document.getElementById("enemy-select");

Object.entries(enemyBase).forEach(([key, enemy]) => {
  const opt = document.createElement("option");
  opt.value = key;
  opt.textContent = enemy.name;
  enemySelect.appendChild(opt);
});


function createEnemyInstance(key, player) {
  const base = enemyBase[key];
  console.error(`enemy base and key`, base, key, base.dmg, base.def);
  //const scale = Math.max(1, player.level);
  const scale = 1 + 0.4 * (player.level - 1);
  
  return {
    ...structuredClone(base),
    level: player.level,
    maxHp: Math.round(base.maxHp * scale),
    currentHp: Math.round(base.maxHp * scale),
    dmg: Math.round(base.dmg * scale),
    def: Math.round(base.def * scale),
    status: {}
  };
}


let botProfile = {
  timingErrorMs: [-120, +180], // ile ms się myli
  panicChance: 0.08,
  earlyChance: 0.15,
  lateChance: 0.2
};


function getSimPlayer() {
  const char = gameState.char;
  const eq = char?.equipment || {};
  return structuredClone(calculatePlayerStats(char));
}

let simEnemy = null;
let simActive = false;
let fightStartTs = null;

document.getElementById("clear-log").onclick = () => {
  logEl.innerHTML = "";
};

function createFightContext(mode = "live") {
  return {
    mode,
    startTs: performance.now(),
    ended: false,
    winner: null
  };
}

const fightCtx = createFightContext("live");

function onLiveTick() {
  if (checkContextEndCondition(simPlayer, simEnemy, fightCtx)) {
    const duration = performance.now() - fightCtx.startTs;
    botLearningStats.avgFightTime.push(duration);
    console.error(`fightCtx.startTs, fightStartTs`, fightStartTs, fightCtx.startTs);
    saveBotLearningStats();
  }
}

document.getElementById("start-sim").onclick = () => {
  
  gameState.world.inCombat = true;
  
  simPlayer = getSimPlayer();
  const enemyKey = enemySelect.value;
  
  fightStartTs = fightCtx.startTs;
  
  simEnemy = createEnemyInstance(enemyKey, simPlayer);
  simActive = true;
  
  console.error(`start sim simEnemy name`, simEnemy.name);
  renderUI(simPlayer, simEnemy);
  log(`⚔️ START: ${simEnemy.name} vs BOT`);

  startEnemyAttackLoop(true);
  startBotAttackLoop(true);
};

let pendingBotBlock = null;

document.getElementById("stop-sim").onclick = () => {
  gameState.world.inCombat = false;
  simActive = false;
  simEnemy = null;
  simPlayer = null;

  cancelAnimationFrame(enemyAttackTimeline?.rafId);
  log("⏹️ SYMULACJA ZATRZYMANA");
};

function simBotAttack() {
  if (!simActive) return;
  console.error(`simEnemy simBotAttack`, simEnemy.def, simEnemy.name);

 /* const result = performAttack(
    attacker: simPlayer,
    defender: simEnemy,
    { source: "sim" }
  );*/

  const result = performAttack(
    simPlayer,
    simEnemy,
    { source: "sim" }
  );
  
  console.error(`result simBotAttack`, result.damage);

  log(
    `🤖 BOT ATAK → ${result.damage}${result.isCrit ? " (CRIT)" : ""}`
  );
}

function enemyAttack(enemy, player, context) {
  const blockDecision = context.getBlockDecision({
    enemy,
    player
  });

  return resolveEnemyAttack({
    enemy,
    player,
    blockDecision,
    context
  });
}

/*function enemyAttack(enemy, player) {
  let dmg;

  if (!pendingBotBlock || pendingBotBlock.type === "none") {
    dmg = enemy.dmg;
  } else if (pendingBotBlock.type === "PERFECT") {
    dmg = 0;
    onBlockOutcome("perfect");
    const rewardType = tryTriggerBlockReward(enemy.dmg, player, enemy, true); 
    console.error(`rewardType`, rewardType);
    log(`PERFECT BLOK - REWARD ${rewardType.toUpperCase()}`);
  } else if (pendingBotBlock.type === "NORMAL") {
    const damageMultiplierReduced = getTimedBlockReduction(player.blockPower);
    dmg = enemy.dmg * (1 - damageMultiplierReduced);
    onBlockOutcome("normal");
    log(`NORMAL BLOK - REDUKCJA ${(damageMultiplierReduced * 100).toFixed(0)}%`);
  } else {
    dmg = enemy.dmg;
    onBlockOutcome("miss");
    log(`MISS BLOK`);
  }
  
  pendingBotBlock = null;

  dmg = calculateReducedEnemyDamage(dmg, enemy, player);
  player.hp -= dmg;

  saveBotLearningStats();
  
  return { damage: dmg };
}*/

/*function enemyAttack(enemy, player) {
  let dmg = applyBlock(enemy.dmg, player, enemy);
    
  console.error(`enemy dmg after block`, dmg);
  if (dmg > 0) {
    dmg = calculateReducedEnemyDamage(dmg, enemy, player);
    simPlayer.hp -= dmg;
    //updatePlayerHp(player.hp - dmg);
  }
  
  return {
    damage: dmg
  };
}*/

function simEnemyAttack() {
  if (!simActive) return;
  
  console.error(`before enemy attack`);
  const result = enemyAttack(simEnemy, simPlayer, simContext);
  console.error(`after enemy attack`, result);

  log(`👹 ENEMY ATAK → ${result}`);
}


function startEnemyAttackLoop(immediate = false) {
  if (!simActive) return;

  const cooldownMs = calculateCooldown(simEnemy.atkSpd) * 1000;
  const fill = document.getElementById("enemy-cd-fill");

  // 🔥 ATAK NATYCHMIAST (TYLKO NA START)
  if (immediate) {
    simEnemyAttack(); 
    renderUI(simPlayer, simEnemy);
    checkEndCondition();
    onLiveTick();
    if (!simActive) return;
  }

  // 🔁 RESET PASKA
  fill.style.transition = "none";
  fill.style.width = "0%";
  void fill.offsetWidth;

  // ▶️ ŁADOWANIE
  fill.style.transition = `width ${cooldownMs}ms linear`;
  fill.style.width = "100%";

  // ⏱️ WINDUP
  window.dispatchEvent(new CustomEvent("enemy-attack-windup", {
    detail: {
      startTime: performance.now(),
      duration: cooldownMs,
      enemy: simEnemy
    }
  }));

  setTimeout(() => {
    if (!simActive) return;

    simEnemyAttack();
    renderUI(simPlayer, simEnemy);
    checkEndCondition();
    onLiveTick();
    
    if (simActive) startEnemyAttackLoop(false);
  }, cooldownMs);
}

function startBotAttackLoop(immediate = false) {
  if (!simActive) return;

  const atkSpd = getPlayerAttackSpeed();
  const cd = calculateCooldown(atkSpd) * 1000;

  if (immediate) {
    simBotAttack();
    renderUI(simPlayer, simEnemy);
    checkEndCondition();
    onLiveTick();
    if (!simActive) return;
  }
  
    // UI cooldown
  const fill = document.getElementById("player-cd-fill");
  fill.style.transition = "none";
  fill.style.width = "0%";
  void fill.offsetWidth;
  fill.style.transition = `width ${cd}ms linear`;
  fill.style.width = "100%";

  
  console.error(`cd:`, cd);
  setTimeout(() => {
    if (!simActive) return;

    simBotAttack();
    renderUI(simPlayer, simEnemy);
    checkEndCondition();
    onLiveTick();
    startBotAttackLoop();
  }, cd);
}


const logEl = document.getElementById("log");
const cdFill = document.getElementById("enemy-cd-fill");
const blockBar = document.querySelector(".perfect-block-bar");
const indicator = blockBar.querySelector(".time-indicator");

// ================= BOT CONFIG =================

function checkContextEndCondition(player, enemy, ctx) {
  console.error(`ctx.ended`, ctx.ended);
  if (ctx.ended) return true;

  console.error(`fightCtx.startTs, fightStartTs`, fightStartTs, fightCtx.startTs);

  if (player.hp <= 0) {
    ctx.ended = true;
    ctx.winner = "enemy";
    return true;
  }

  if (enemy.currentHp <= 0) {
    ctx.ended = true;
    ctx.winner = "player";
    return true;
  }

  return false;
}

function checkEndCondition() {

  if (simPlayer.hp <= 0) {
    simActive = false;
    log("☠️ BOT PRZEGRAŁ");
  }
  
  botLearningStats.fights++;
  
  if (simEnemy.currentHp <= 0) {
    simActive = false;
    
    botLearningStats.wins++;

    botLearningStats.avgHpLeft.push(simPlayer.hp);
    //botLearningStats.avgFightTime.push(performance.now() - fightStartTs);
    
    log("🏆 BOT WYGRAŁ");
  }
  
  saveBotLearningStats();
}

const botLearningStats = {
  fights: 0,
  wins: 0,
  blocks: {
    perfect: 0,
    normal: 0,
    miss: 0
  },
  avgHpLeft: [],
  avgFightTime: []
};

/*function onBlockOutcome(type) {
  if (!botLearningStats.blocks[type]) return;
  botLearningStats.blocks[type]++;
}*/

function onBlockOutcome(type) {
  if (!(type in botLearningStats.blocks)) return;
  botLearningStats.blocks[type]++;
}

const bulkStats = {
  fights: 0,
  wins: 0,
  losses: 0,
  perfect: 0,
  normal: 0,
  miss: 0,
  avgPlayerHp: [],
  avgEnemyHp: [],
  durations: []
};

function getHumanBlockDecision() {
  if (!pendingBlockInput) {
    return createBlockDecision({ type: "NONE", source: "human" });
  }

  const decision = pendingBlockInput;
  pendingBlockInput = null;

  return createBlockDecision({
    type: decision.type,
    errorMs: decision.errorMs,
    source: "human"
  });
}

const coreContext = {
  getBlockDecision: getHumanBlockDecision
};

const botContext = {
  getBlockDecision: simulateBotBlock
};

const simContext = {
    getBlockDecision: simulateBotBlock,
    onAfterEnemyAttack: ({ dmg }) => {
      bulkStats.totalEnemyDamage += dmg;
    },
    onBlockOutcome: ({ type }) => {
      bulkStats[type.toLowerCase()]++;
    }
  };

function resolveEnemyAttack({
  enemy,
  player,
  blockDecision,
  context
}) {
  let dmg = enemy.dmg;
  let isDodge = false;
  
  if (blockDecision.type === "PERFECT") {
    dmg = 0;
    onBlockOutcome("perfect");
    context?.onBlockOutcome?.(blockDecision);
    const rewardType = tryTriggerBlockReward(enemy.dmg, player, enemy, true); 
    console.error(`rewardType`, rewardType);
    log(`PERFECT BLOK - REWARD ${rewardType.toUpperCase()}`);
  }

  if (blockDecision.type === "NORMAL") {
    const reduction = getTimedBlockReduction(player.blockPower);
    dmg *= (1 - reduction);
    onBlockOutcome("normal");
    context?.onBlockOutcome?.(blockDecision);
    log(`NORMAL BLOK - REDUKCJA ${(reduction * 100).toFixed(0)}%`);
  }

  if (blockDecision.type === "MISS") {
    onBlockOutcome("miss");
    context?.onBlockOutcome?.(blockDecision);
    log(`MISS BLOK`);
  }

  ({ isDodge, dmg } = calculateReducedEnemyDamage(dmg, enemy, player));
  
  if(isDodge) {
    log(`UNIK`);
  }
  
  player.hp -= dmg;

  context?.onAfterEnemyAttack?.({ dmg, blockDecision });

  return dmg;
}

function simulateBotBlock() {
  if (!botWantsToBlock()) {
    return createBlockDecision({ type: "MISS", source: "bot" });
  }

  const bias = botTimingBias();
  const error = getTimingError(bias);

  return createBlockDecision({
    type: resolveBlockOutcome(error),
    errorMs: error,
    source: "bot"
  });
}

/*function simulateBotBlock(enemyAttackTs) {
  if (!botWantsToBlock()) return { type: "none" };

  const bias = botTimingBias();
  const error = getTimingError(bias);

  return createBlockDecision({
    type: resolveBlockOutcome(error),
    errorMs: error,
    source: "bot"
  });
}*/

function simulateBotBlockOutcome() {
  const error = rand(...botProfile.timingErrorMs);

  if (Math.random() < botProfile.panicChance) return "MISS";

  if (Math.abs(error) < 40) return "PERFECT";
  if (Math.abs(error) < 120) return "NORMAL";

  return "MISS";
}

function resolveBlockOutcome(errorMs) {
  const abs = Math.abs(errorMs);

  if (abs <= 40) return "PERFECT";
  if (abs <= 120) return "NORMAL";
  return "MISS";
}

function botWantsToBlock() {
  if (Math.random() < botProfile.panicChance) return false;
  return true;
}

function botTimingBias() {
  const r = Math.random();
  if (r < botProfile.earlyChance) return "EARLY";
  if (r < botProfile.earlyChance + botProfile.lateChance) return "LATE";
  return "CENTER";
}

function getTimingError(bias) {
  let [min, max] = botProfile.timingErrorMs;

  if (bias === "EARLY") max = -10;
  if (bias === "LATE") min = 10;

  return rand(min, max);
}


function simulateSingleFight(enemyKey) {
  const player = getSimPlayer();
  const enemy = createEnemyInstance(enemyKey, player);
  console.error(`simulateSingleFight enemy name`, enemy.name, enemy.def);

  const ctx = createFightContext("batch");
  
  const simContext = {
    getBlockDecision: simulateBotBlock,
    onAfterEnemyAttack: ({ dmg }) => {
      bulkStats.totalEnemyDamage += dmg;
    },
    onBlockOutcome: ({ type }) => {
      bulkStats[type.toLowerCase()]++;
    }
  };

  let time = 0;
  const enemyCooldown = calculateCooldown(enemy.atkSpd) * 1000;

  console.error(`simulateSingleFight before while enemy.currentHp`, enemy.currentHp);

  while (player.hp > 0 && enemy.currentHp > 0 && time < 120000) {
  //while (checkContextEndCondition(player, enemy, ctx) && time < 120000) {
 
    enemyAttack(enemy, player, simContext);

    if (player.hp <= 0) break;

    console.error(`simulateSingleFight enemy before perform attack`, enemy.name, enemy.def);

    /*const result = performAttack({
      attacker: player,
      defender: enemy,
      source: "sim"
    });*/
    
    const result = performAttack(
      player,
      enemy,
      { source: "sim" }
    );
    
    enemy.currentHp -= result.damage;

    time += enemyCooldown;
  }

  bulkStats.fights++;
  bulkStats.avgPlayerHp.push(player.hp);
  bulkStats.avgEnemyHp.push(enemy.currentHp);
  bulkStats.durations.push(time);

  if (player.hp > 0) bulkStats.wins++;
  else bulkStats.losses++;
}

/*function simulateSingleFight(enemyKey) {
  const player = getSimPlayer();
  const enemy = createEnemyInstance(enemyKey, player);
  
  let time = 0;
  const enemyCooldown = calculateCooldown(enemy.atkSpd) * 1000;

  while (player.hp > 0 && enemy.currentHp > 0 && time < 120000) {
  
    enemyAttack(enemy, player, simContext);
    
    simContext.onBlockOutcome = ({ type }) => {
      bulkStats[type.toLowerCase()]++;
    };
       
    if (player.hp <= 0) break;

    // --- PLAYER ATTACK ---
    const result = performAttack({
      attacker: player,
      defender: enemy,
      source: "sim"
    });
    enemy.currentHp -= result.damage;

    time += enemyCooldown;
  }

  bulkStats.fights++;
  bulkStats.avgPlayerHp.push(player.hp);
  bulkStats.avgEnemyHp.push(enemy.currentHp);
  bulkStats.durations.push(time);

  if (player.hp > 0) bulkStats.wins++;
  else bulkStats.losses++;
}*/

document.getElementById("simulate-1000").onclick = () => {
  bulkStats.fights = 0;
  bulkStats.wins = 0;
  bulkStats.losses = 0;
  bulkStats.perfect = 0;
  bulkStats.normal = 0;
  bulkStats.miss = 0;
  bulkStats.avgPlayerHp = [];
  bulkStats.avgEnemyHp = [];
  bulkStats.durations = [];

  const enemyKey = enemySelect.value;

  console.time("SIMULATION");

  for (let i = 0; i < 1000; i++) {
    simulateSingleFight(enemyKey);
  }

  console.timeEnd("SIMULATION");

  log(`🤖 1000 WALK ZAKOŃCZONE`);
  log(`🏆 WINRATE: ${(bulkStats.wins / 10).toFixed(1)}%`);
  log(`🛡️ PERFECT: ${bulkStats.perfect}`);
  log(`🟦 NORMAL: ${bulkStats.normal}`);
  log(`❌ MISS: ${bulkStats.miss}`);
};

function renderUI(player, enemy) {
  document.getElementById("enemy-name").textContent = enemy.name;
  document.getElementById("enemy-hp").textContent =
    `HP: ${enemy.currentHp}/${enemy.maxHp}`;
  document.getElementById("enemy-dmg").textContent = `DMG: ${enemy.dmg}`;
  document.getElementById("enemy-def").textContent = `DEF: ${enemy.def}`;

  
  document.getElementById("player-hp").textContent =
    `HP: ${player.hp}/${player.maxHp}`;
  document.getElementById("player-dmg").textContent = `DMG: ${player.dmg}`;
  document.getElementById("player-def").textContent = `DEF: ${player.def}`;
}

window.addEventListener("enemy-attack-windup", e => {
  if (!simActive) return;

  const { duration } = e.detail;

  // ❗ moment ataku
  const attackAt = performance.now() + duration;

  // ❗ bot próbuje przewidzieć
  const error = rand(...botProfile.timingErrorMs);
  const triggerAt = attackAt - PERFECT_CENTER + error;

  const delay = triggerAt - performance.now();

  if (delay <= 0) return;

  setTimeout(() => {
    if (!simActive) return;

    if (Math.random() < botProfile.panicChance) {
      log("😱 PANIC – brak bloku");
      return;
    }

    pendingBotBlock = simulateBotBlock();

    //activateTimedBlock();
    log("🛡️ BOT PRÓBA BLOKU");
    updateBlockState();
  }, delay);
});

function saveBotLearningStats() {
  localStorage.setItem(
    "botLearningStats",
    JSON.stringify(botLearningStats)
  );
}

function loadBotLearningStats() {
  const saved = localStorage.getItem("botLearningStats");
  if (!saved) return;

  const data = JSON.parse(saved);

  botLearningStats.fights += data.fights;
  botLearningStats.wins += data.wins;

  for (const k in botLearningStats.blocks) {
    botLearningStats.blocks[k] += data.blocks[k];
  }

  botLearningStats.avgHpLeft.push(...data.avgHpLeft);
  botLearningStats.avgFightTime.push(...data.avgFightTime);
}

function getLearningSummary() {
  const totalBlocks = Object.values(botLearningStats.blocks)
    .reduce((a,b)=>a+b,0);
  
  const safeDiv = (a, b) => b === 0 ? 0 : a / b;
  
  return {
    winrate: safeDiv(botLearningStats.wins, botLearningStats.fights),
    perfectRate: safeDiv(botLearningStats.blocks.perfect, totalBlocks),
    missRate: safeDiv(botLearningStats.blocks.miss, totalBlocks),
    avgHpLeft:
      botLearningStats.avgHpLeft.length
        ? botLearningStats.avgHpLeft.reduce((a,b)=>a+b,0) /
          botLearningStats.avgHpLeft.length
        : 0,
    avgFightTime:
      botLearningStats.avgFightTime.length
        ? botLearningStats.avgFightTime.reduce((a,b)=>a+b,0) /
          botLearningStats.avgFightTime.length
        : 0
  };
  
/*  return {
    winrate: botLearningStats.wins / botLearningStats.fights,
    perfectRate: botLearningStats.blocks.perfect / totalBlocks,
    missRate: botLearningStats.blocks.miss / totalBlocks,
    avgHpLeft:
      botLearningStats.avgHpLeft.reduce((a,b)=>a+b,0) /
      botLearningStats.avgHpLeft.length,
    avgFightTime:
      botLearningStats.avgFightTime.reduce((a,b)=>a+b,0) /
      botLearningStats.avgFightTime.length
  };*/
}

function renderLearningSummaryTable() {
  const s = getLearningSummary();

  console.error("s.avgFightTime", s.avgFightTime);
  document.getElementById("sum-winrate").textContent =
    (s.winrate * 100).toFixed(1) + "%";

  document.getElementById("sum-perfect").textContent =
    (s.perfectRate * 100).toFixed(1) + "%";

  document.getElementById("sum-miss").textContent =
    (s.missRate * 100).toFixed(1) + "%";

  document.getElementById("sum-hp").textContent =
    s.avgHpLeft.toFixed(1);

  document.getElementById("sum-time").textContent =
    (s.avgFightTime / 10000).toFixed(2) + " s";
}

document.getElementById("open-summary").onclick = () => {
  renderLearningSummaryTable();
  document.getElementById("summary-modal").classList.remove("hidden");
};

document.getElementById("close-summary").onclick = () => {
  document.getElementById("summary-modal").classList.add("hidden");
};

// ================= UTILS =================
function log(msg) {
  const line = document.createElement("div");
  line.textContent = msg;
  logEl.appendChild(line);

  // auto-scroll na dół
  logEl.scrollTop = logEl.scrollHeight;

  // limit logów (performance!)
  if (logEl.children.length > 300) {
    logEl.removeChild(logEl.firstChild);
  }
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

document.addEventListener("DOMContentLoaded", () => {
  
  
  initializeGameState("sandbox") 
  /*loadPlayerSkills();
  syncPlayerSkillsToSkills();
  loadAssignedSkills();*/
  //applyAllPassiveSkills();
  
  loadBotLearningStats();
  });