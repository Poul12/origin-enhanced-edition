const HIT_EFFECTS = {
  basic: {
    type: "hit",
    duration: 180,
    scale: [0.5, 0.9],
    opacity: [0, 0.7, 0],
    hitStop: 0
  },

  slash: {
    type: "slash",
    duration: 300,
    scale: [0.6, 1.2],
    opacity: [0, 1, 0],
    hitStop: 20
  },

  double: {
    sequence: [
      { type: "double-attack-left", delay: 0 },
      { type: "double-attack-right", delay: 250 }
    ],
    hitStop: 15
  },

  charge: {
    type: "charge",
    duration: 350,
    scale: [0.7, 1.3],
    stretchX: 1.4,
    stretchY: 0.8,
    opacity: [0, 0.9, 0.2],
    rotate: 0, // możesz dynamicznie zmieniać
    hitStop: 40
  },

  jump: {
    sequence: [
      { type: "impact-jump", delay: 0 },
      { type: "shockwave", delay: 100 }
    ],
    duration: 600,
    scale: [0.5, 1.2],
    linger: true,
    hitStop: 60
  },

  jump_impact: {
    type: "impact-core",
    duration: 1500,
    scale: [1.3, 1.3],
    opacity: [0, 0.7, 0],
    hitStop: 50
  },

  jump_shockwave: {
    type: "impact-jump",
    duration: 500,
    opacity: [0, 0.7, 0.2],
    scale: [0.5, 1.3],
  },
  
  crit: {
    type: "bleed",
    duration: 300,
    scale: [0.6, 1.4],
    opacity: [0, 1, 0],
    hitStop: 50
  },
  
  shield_bash: {
   /* sequence: [
      { type: "shield-bash-impact", delay: 0 },
      { type: "shield-bash-shockwave", delay: 70 }
    ],*/
    type: "shield-bash-shockwave",
    duration: 350,
    scale: [0.6, 1.25],
    opacity: [0, 1, 0],
    hitStop: 45
  },
  
  shield_wall_activate: {
    type: "shield-wall",
    duration: 800,
    scale: [0.65, 1.15],
    opacity: [0, 0.85, 0.35],
    linger: true,
    hitStop: 20
  },
  
  iron_will_activate: {
    type: "iron-will",
    duration: 600,
    scale: [0.7, 1.15],
    opacity: [0, 0.85, 0.4],
    linger: true,
    hitStop: 20
  },

  counter_strike: {
    /*sequence: [
      { type: "counter-flash", delay: 0 },
      { type: "counter-slash", delay: 60 },
      { type: "counter-impact", delay: 130 }
    ],*/
    type: "counter-strike",
    duration: 350,
    scale: [0.6, 1.2],
    opacity: [0, 0.95, 0],
    hitStop: 60
  },
  
  provocation: {
   /* sequence: [
      { type: "provocation-pulse", delay: 0 },
      { type: "provocation-mark", delay: 100 }
    ],*/
    type: "provocation",
    duration: 500,
    scale: [0.65, 1.15],
    opacity: [0, 0.9, 0.2],
    hitStop: 25
  },

  last_bastion_activate: {
    /*sequence: [
      { type: "bastion-flash", delay: 0 },
      { type: "bastion-expansion", delay: 100 }
    ],*/
    type: "last-bastion",
    duration: 900,
    scale: [0.5, 1.15],
    opacity: [0, 0.7, 0.25],
    linger: true,
    hitStop: 40
  },

    
  riposte: {
    /*sequence: [
      { type: "riposte-slash", delay: 0 },
      { type: "riposte-impact", delay: 70 }
    ],*/
    type: "riposte",
    duration: 320,
    scale: [0.65, 1.2],
    opacity: [0, 1, 0],
    hitStop: 45
  },
  
  opening_strike: {
    /*sequence: [
      { type: "opening-cut", delay: 0 },
      { type: "opening-break", delay: 80 }
    ],*/
    type: "opening-strike",
    duration: 450,
    scale: [0.6, 1.35],
    opacity: [0, 0.85, 0],
    hitStop: 30
  },

  precision_activate: {
    type: "precision",
    duration: 500,
    scale: [0.65, 1.45],
    opacity: [0, 0.9, 0.35],
    hitStop: 15
  },
  
  parry_master_activate: {
    type: "parry-master",
    duration: 750,
    scale: [0.7, 1.15],
    opacity: [0, 0.9, 0.4],
    hitStop: 20
  },

    
  duelist_perfect_block: {
    sequence: [
      { type: "duelist-perfect-flash", delay: 0 },
      { type: "duelist-perfect-ring", delay: 45 }
    ],
    duration: 300,
    scale: [0.65, 1.25],
    opacity: [0, 1, 0],
    hitStop: 55
  },
  
  weak_point_apply: {
    type: "weak-point",
    duration: 450,
    scale: [0.7, 1.1],
    opacity: [0, 0.9, 0.7],
    hitStop: 20
  },

  perfect_execution: {
   /* sequence: [
      { type: "execution-windup", delay: 0 },
      { type: "execution-slash", delay: 100 },
      { type: "execution-impact", delay: 180 }
    ],*/
    type: "perfect-execution",
    duration: 700,
    scale: [0.8, 1.05],
    opacity: [0, 0.9, 0.35],
    hitStop: 85
  },

  
  piercing_thrust: {
    sequence: [
      { type: "spear-thrust", delay: 0 },
      { type: "control-impact", delay: 100 },
    ],
    duration: 400,
    scale: [0.65, 1.15],
    opacity: [0, 1, 0],
    hitStop: 40
  },

  sweep: {
    sequence: [
      { type: "spear-sweep", delay: 0 },
      //{ type: "spear-control-wave", delay: 200 },
    ],
    duration: 600,
    scale: [0.55, 1.25],
    opacity: [0, 0.85, 0.4],
    hitStop: 35
  },

  impale: {
    type: "impale",
    duration: 550,
    scale: [0.5, 1.4],
    opacity: [0, 1, 0],
    hitStop: 80
  },
  
  control_break: {
    type: "control-break",
    duration: 450,
    scale: [0.5, 1.3],
    opacity: [0, 0.8, 0.35],
    hitStop: 70
  },
  
  spear_discipline_activate: {
    type: "spear-discipline",
    duration: 600,
    scale: [0.7, 1.25],
    opacity: [0, 1, 0.4],
    hitStop: 20
  },
  
  absolute_control_activate: {
    sequence: [
      { type: "absolute-control-burst", delay: 0 },
      //{ type: "absolute-control-ring", delay: 400 }
    ],
    duration: 700,
    scale: [0.7, 1.5],
    opacity: [0, 0.8, 0.45],
    hitStop: 35
  },
  
  whirlwind_hit: {
    type: "whirlwind-hit",
    duration: 250,
    scale: [0.8, 1.15],
    opacity: [0, 0.95, 0.4],
    hitStop: 20
  },

  blood_frenzy: {
    type: "blood-frenzy",
    duration: 600,
    scale: [0.7, 1.3],
    opacity: [0, 0.85, 0.4],
    hitStop: 40
  },
  
  blood_pact: {
    type: "blood-pact",
    duration: 800,
    scale: [0.8, 1.1],
    opacity: [0, 0.75, 0.45],
    hitStop: 20
  },
 
  blood_reaver: {
    type: "blood-reaver",
    duration: 650,
    scale: [0.6, 1.35],
    opacity: [0, 0.85, 0.4],
    hitStop: 40
  },
 
  executioner: {
    type: "executioner",
    duration: 700,
    scale: [0.7, 1.5],
    opacity: [0, 0.8, 0],
    hitStop: 60
  },
 
  
  
};



function spawnEffect(configKey, targetEl, options = {}) {
  const config = HIT_EFFECTS[configKey];
  if (!config || !targetEl) return;

  // 🔥 HIT STOP
  //if (config.hitStop) hitStop(config.hitStop);

  // 🔁 SEKWENCJA (np. double, jump)
  if (config.sequence) {
    config.sequence.forEach(step => {
      setTimeout(() => {
        spawnSingleEffect(step.type, targetEl, {
          ...config,
          ...options
        });
      }, step.delay);
    });
    return;
  }

  // 🔹 SINGLE
  spawnSingleEffect(config.type, targetEl, {
    ...config,
    ...options
  });
}

function spawnSingleEffect(type, targetEl, config = {}) {
  const effect = document.createElement("img");

  const shieldUrl = assetManager.getResolvedAsset(`img/vfx/${type}.png`);
  
  effect.className = "hit-effect";
  effect.src = shieldUrl;

  // 🎯 dynamiczne style
  const scaleStart = config.scale?.[0] ?? 1;
  const scaleEnd = config.scale?.[1] ?? 1;

  effect.style.setProperty("--scale-start", scaleStart);
  effect.style.setProperty("--scale-end", scaleEnd);

  // opacity
  const opacityStart = config.opacity?.[0] ?? 0;
  const opacityMid = config.opacity?.[1] ?? 1;
  const opacityEnd = config.opacity?.[2] ?? 0;

  effect.style.setProperty("--opacity-start", opacityStart);
  effect.style.setProperty("--opacity-mid", opacityMid);
  effect.style.setProperty("--opacity-end", opacityEnd);
  
  // stretch (charge)
  if (config.stretchX) {
    effect.style.setProperty("--stretch-x", config.stretchX);
    effect.style.setProperty("--stretch-y", config.stretchY || 1);
  }

  const rotateStart = config.rotate?.[0] ?? 0;
  const rotateMid = config.rotate?.[1] ?? 0;
  const rotateEnd = config.rotate?.[2] ?? 0;

  
  // rotacja (np. kierunek)
  if (config.rotate !== undefined) {
    effect.style.setProperty("--rotate-start", `${rotateStart}deg`);
    effect.style.setProperty("--rotate-mid", `${rotateMid}deg`);
    effect.style.setProperty("--rotate-end", `${rotateEnd}deg`);
  }

  // czas trwania
  const duration = config.duration || 300;
  effect.style.animationDuration = `${duration}ms`;

  targetEl.appendChild(effect);

  setTimeout(() => {
    effect.remove();
  }, duration);
}

function playPlayerAnimation(className){
    const avatar = document.getElementById("player-avatar");

    avatar.classList.remove(className);
    void avatar.offsetWidth;
    avatar.classList.add(className);

    avatar.addEventListener("animationend", () => {
        avatar.classList.remove(className);
    }, { once:true });
}

function playEnemyAnimation(className, slotIndex){
    const enemySlot = document.getElementById(`enemy-slot-${slotIndex}`);

    enemySlot.classList.remove(className);
    void enemySlot.offsetWidth;
    enemySlot.classList.add(className);
  
    enemySlot.addEventListener("animationend", () => {
        enemySlot.classList.remove(className);
    }, { once:true });
}

let whirlwindSwingDirection = false;

function playWhirlwindPlayerAnimation(duration) {
    const avatar = document.getElementById("player-avatar");

    if (!avatar) return;
  
    avatar.classList.remove(`whirlwind-swing`);
  
    void avatar.offsetWidth;

    avatar.classList.add(`whirlwind-swing`);
  
    setTimeout(() => {
      avatar.classList.remove(`whirlwind-swing`);
    }, duration);

}

function playWhirlwindVFX(playerSlot, duration) {
  const vfx = document.createElement("img");

  const vfxUrl = assetManager.getResolvedAsset(`img/vfx/whirlwind.png`);
  
  vfx.src = vfxUrl;
  vfx.className = "combat-vfx whirlwind-vfx";
  vfx.style.animationDuration = `${duration}ms`;
  
  playerSlot.appendChild(vfx);

  requestAnimationFrame(() => {
    vfx.classList.add("active");
  });
  
  //console.log(`stun animation`);
  
  setTimeout(() => {
    vfx.classList.remove("active");

    vfx.addEventListener("transitionend", () => {
      vfx.remove();
    }, { once: true });

  }, duration);
}


function playWhirlwindSwingAnimation(playerSlot, duration) {
    const effect = document.createElement("img");
    const whirlwindUrl = assetManager.getResolvedAsset(`img/vfx/whirlwind.png`);
  
    effect.className = "combat-vfx whirlwind-vfx";
    effect.src = whirlwindUrl;
  
    playerSlot.appendChild(effect);
  
    effect.classList.add(`active`);

    setTimeout(() => {
      effect.classList.remove(`active`);
      effect.remove();
    }, duration);

}

let enemyUiTickId = null;

const enemyHpAnimations = {}; // slotIndex -> boolean

let hpAnimationGeneration = 0;

function getEnemyRegenHp(enemy, now = getGameTime()) {
  if (!enemy.regen) return enemy.currentHp;
  
  // ⛔ NIE TEN KROK → ZERO REGEN
  if (enemy.regen.stepIndex !== enemy.__stepIndex) {
    return enemy.currentHp;
  }
  
  const elapsed = (now - enemy.regen.startTime) / 1000;
  if (elapsed <= 0) return enemy.currentHp;

  let regenPerSecond = enemy.maxHp * 0.01;
  if (enemy.type === "mini_boss") regenPerSecond *= 0.4;
  if (enemy.type === "boss") regenPerSecond *= 0.1;

  const healed = Math.floor(elapsed * regenPerSecond);
  
  return Math.min(
    enemy.maxHp,
    enemy.regen.fromHp + healed
  );
}

function syncStepEnemies(stepIndex) {
  const step = gameState.world.locationSteps[stepIndex];
  if (!step?.exploreOptions) return;

  step.exploreOptions.forEach(opt => {
    if (opt.enemyData) {
      //console.log("SYNC", opt.enemyData.name, opt.enemyData.__stepIndex, gameState.world.currentStepIndex, opt.enemyData);
      syncEnemyHpFromTime(opt.enemyData, stepIndex);
    }
  });
}

function syncEnemyHpFromTime(enemy, stepIndex) {
  if (!enemy?.regen) return;

  // ⛔ nie synchronizuj wroga z innego kroku
  if (enemy.__stepIndex !== stepIndex) return;

  const realHp = getEnemyRegenHp(enemy);
  enemy.currentHp = realHp;

  if (enemy.currentHp >= enemy.maxHp) {
    enemy.regen = null;
  }
}

/*function onStepChange(newStepIndex) {
  gameState.world.locationSteps.forEach((step, i) => {
    if (!step.exploreOptions) return;

    step.exploreOptions.forEach(opt => {
      if (opt.enemyData) {
        opt.enemyData.regen = null;
      }
    });
  });
}*/

function startEnemyUiRegenTick() {
  if (enemyUiTickId) return;

  enemyUiTickId = setInterval(() => {
    //console.log(`enter enemy regen`);
    if (gameState.world.inCombat || !isExploring) return;
    //console.log(`enemy regen after inCombat`, gameState.world.inCombat);

    const step = gameState.world.locationSteps[gameState.world.currentStepIndex];
    
    if (!step?.exploreOptions) return;

    const allEnemiesDead = areAllEnemiesDefeated(step);
    
    if(allEnemiesDead) return;
   // console.log(`enemy regen after allEnemiesDefeated`, areAllEnemiesDefeated(step));

    step.exploreOptions.forEach((opt, slotIndex) => {
      const enemy = opt.enemyData;
      
      if (!enemy?.regen) return;
      //console.log(`enemy regen after enemy?.regen`, enemy?.regen);

      // ⛔ tylko ten krok
      //if (enemy.__stepIndex !== currentStepIndex) return;

      if (enemy.regen.stepIndex !== gameState.world.currentStepIndex) return;
      
      const hpAfter = getEnemyRegenHp(enemy);
      if (hpAfter === enemy.currentHp) return;

      const hpBefore = enemy.currentHp;
         
      enemy.currentHp = hpAfter;

      animateEnemyHpBar(slotIndex, hpBefore, hpAfter, enemy.maxHp, allEnemiesDead);

      if (enemy.currentHp >= enemy.maxHp) {
        enemy.regen = null;
      }
    });
  }, 1000);
}

function stopEnemyUiRegenTick() {
  if (!enemyUiTickId) return;

  hpAnimationGeneration++;
  
  clearInterval(enemyUiTickId);
  enemyUiTickId = null;
}


function animateEnemyHpBar(slotIndex, fromHp, toHp, maxHp, allEnemiesDead) {
  // ⛔ jeśli animacja już trwa → NIE restartuj
 // console.log(`enter animateHp`, slotIndex);

  if (enemyHpAnimations[slotIndex]) return;

  enemyHpAnimations[slotIndex] = true;

  // 🔒 zabezpieczenie: nigdy nie cofaj HP
  if (toHp <= fromHp) {
    enemyHpAnimations[slotIndex] = false;
    return;
  }

  const duration = 700; // trochę krócej niż tick
  const start = performance.now();
  
  const generation = hpAnimationGeneration;

  function frame(now) {
    const t = Math.min(1, (now - start) / duration);
    const current = Math.floor(fromHp + (toHp - fromHp) * t);
    //console.log(`animateHp before allEnemiesDead`, allEnemiesDead);
    const percent = (current / maxHp) * 100;

    const bar = document.getElementById(`enemy-health-bar-${slotIndex}`);
    if (!bar) {
      enemyHpAnimations[slotIndex] = false;
      return;
    }

    if (generation !== hpAnimationGeneration) {
      enemyHpAnimations[slotIndex] = false;
      return;
    }
    
    //console.log(`animateHp current`, current);

    /*bar.innerHTML = `
      <div class="enemy-health-fill" style="width:${percent}%;"></div>
      <div class="enemy-health-text">${current}/${maxHp}</div>
    `;*/
    
    bar.innerHTML = `
        <div class="enemy-health-fill" style="transform:scaleX(${percent / 100});"></div>
        <div class="enemy-health-text">${current}/${maxHp}</div>
    `;
    
    if (t < 1) {
      requestAnimationFrame(frame);
    } else {
      enemyHpAnimations[slotIndex] = false;
    }
  }

  requestAnimationFrame(frame);
}

let lastUiTimestamp = null;
let uiRafId = null;

function startUiTick() {
  if (uiRafId !== null) return;
  
  function tick(timestamp) {
    if (lastUiTimestamp === null) {
      lastUiTimestamp = timestamp;
    }
    
    const deltaTime = (timestamp - lastUiTimestamp) / 1000;
    lastUiTimestamp = timestamp;
    
    //updateEnemyCooldownUI(timestamp);
    //updateTimedBlockUI(timestamp);
    /*updateStaminaOrb();
    updateShieldUI(timestamp);
    updateBlockState(timestamp);
    applyDevensiveBlockRegen(deltaTime);
    updatePoise(deltaTime);*/
    //updateGuardUI(guardStacks);
    
    if (shopMenuBtn && isLocationWithTown()) {
      if (gameState.world.currentStepIndex != 0) {
        shopMenuBtn.classList.add('disabled');
      } else {
        shopMenuBtn.classList.remove('disabled');
      }
    }
    
    uiRafId = requestAnimationFrame(tick);
  }
  lastUiTimestamp = null;
  uiRafId = requestAnimationFrame(tick);
}

function stopUiTick() {
  if (uiRafId !== null) {
    cancelAnimationFrame(uiRafId);
    uiRafId = null;
    lastUiTimestamp = null;
  }
}

let wasExhausted = false;

function updateStaminaOrb() {
  const orb = document.querySelector('.stamina-orb');
  const isExhausted = gameState.resources.staminaState.current <= 0;

  if (isExhausted && !wasExhausted) {
    // TYLKO przy wejściu w stan wyczerpania
    showOutcome("miss", `${t("exhausted_outcome")}`);
    playSound("low-stamina", 0.38);
    orb.classList.add('exhausted');
  }

  if (!isExhausted && wasExhausted) {
    // wyjście ze stanu wyczerpania
    orb.classList.remove('exhausted');
  }

  wasExhausted = isExhausted;
}

let perfectBlockTimingActive = false;
let perfectBlockAnimationFrame = null;

function showTimedBlockUI(player) {
  const bar = document.getElementById("timing-mode");
  const miss = bar.querySelector(".miss-window");
  const normal = bar.querySelector(".normal-window");
  const perfect = bar.querySelector(".perfect-window");
  const indicator = bar.querySelector(".time-indicator");
  const sweep = bar.querySelector(".glass-sweep");

  indicator.style.transform = `translateX(0px) skewX(-10deg)`;
  sweep.style.transform = `translateX(0px)`;

  bar.classList.remove("hidden");

  const { perfect: p, normal: n } = getBlockWindows(player);

  setTimingBarMode("timed");

  miss.style.left = "0%";
  miss.style.width = "100%";

  const normalWidth = msToPercent(n) * 2;
  normal.style.left = `${50 - normalWidth / 2}%`;
  normal.style.width = `${normalWidth}%`;

  const perfectWidth = msToPercent(p) * 2;
  perfect.style.left = `${50 - perfectWidth / 2}%`;
  perfect.style.width = `${perfectWidth}%`;

  let startTime = getGameTime();
  let barWidth;

  perfectBlockTimingActive = true;

  function animate() {
    
    if (!perfectBlockTimingActive) return;

    if (gameState.globalTime.isPaused) {
      perfectBlockAnimationFrame = requestAnimationFrame(animate);
      return;
    }

    const totalDuration = TIMED_DURATION * gameState.combat.openingStrike.windUpMultiplier;
    const elapsed = getGameTime() - startTime;

    const cycle = elapsed / totalDuration;

    //const progress = Math.abs(Math.sin(cycle * Math.PI));
    //const progress = (elapsed % TIMED_DURATION) / TIMED_DURATION;
    const cycleLength = totalDuration + 120;
    const cycleTime = elapsed % cycleLength;
    let progress;
    
    if (cycleTime >= totalDuration) {
      progress = 0;
      gameState.combat.playerBlock.startTime = getGameTime();
    } else {
      progress = cycleTime / totalDuration;
    }
    
    
    const moveX = progress * barWidth;

    indicator.style.transform =
      `translateX(${moveX}px) skewX(-10deg)`;

    sweep.style.transform =
      `translateX(${moveX}px)`;

    perfectBlockAnimationFrame =
      requestAnimationFrame(animate);
  }

  requestAnimationFrame(() => {
    barWidth = bar.offsetWidth || 1;
    requestAnimationFrame(animate);
  });
}

function stopTimedBlockUI() {

  perfectBlockTimingActive = false;

  if (perfectBlockAnimationFrame) {
    cancelAnimationFrame(perfectBlockAnimationFrame);
    perfectBlockAnimationFrame = null;
  }

  gameState.combat.openingStrike.windUpMultiplier = 1;
  
  const bar = document.getElementById("timing-mode");

  bar.classList.add("hidden");
}

function resumeTimedBlockUI() {
  if (!perfectBlockTimingActive) return;
  
  const bar = document.getElementById("timing-mode");

  if (bar.classList.contains("hidden")) return;

  const player = getPlayerStats();
  showTimedBlockUI(player);
}


/*function showTimedBlockUI(player) {
  const perfectBar = document.querySelector(".perfect-block-bar");
  const bar = document.getElementById("timing-mode");
  const miss = bar.querySelector(".miss-window");
  const normal = bar.querySelector(".normal-window");
  const perfect = bar.querySelector(".perfect-window");
  const indicator = bar.querySelector(".time-indicator");
  const sweep = bar.querySelector(".glass-sweep");
  
  indicator.style.transform = `translateX(0px) skewX(-10deg)`;
  sweep.style.transform = `translateX(0px)`;
  
  bar.classList.remove("hidden");

  const { perfect: p, normal: n } = getBlockWindows(player);

  // MISS = CAŁOŚĆ
  miss.style.left = "0%";
  miss.style.width = "100%";
  
  // NORMAL
  const normalWidth = msToPercent(n) * 2;
  normal.style.left = `${50 - normalWidth / 2}%`;
  normal.style.width = `${normalWidth}%`;

  // PERFECT
  const perfectWidth = msToPercent(p) * 2;
  perfect.style.left = `${50 - perfectWidth / 2}%`;
  perfect.style.width = `${perfectWidth}%`;
 
  const startTime = performance.now();

  setTimingBarMode("timed");
  
  function animate() {
    const elapsed = performance.now() - startTime;
    const progress = Math.min(elapsed / TIMED_DURATION, 1);

    const moveX = progress * barWidth;

    indicator.style.transform = `translateX(${moveX}px) skewX(-10deg)`;
    sweep.style.transform = `translateX(${moveX}px)`;
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      bar.classList.add("hidden");
      gameState.combat.playerBlock.lastResult = null;
    }
  }

  let barWidth;
  requestAnimationFrame(() => {
    barWidth = bar.offsetWidth;
    requestAnimationFrame(animate);
  });
}*/

/*function pauseTimedBlock() {
  if (!playerBlock.active || playerBlock.activePaused) return;

  const now = Date.now();

  if (now < playerBlock.endTime) {
    playerBlock.activeRemaining = playerBlock.endTime - now;
  } else {
    playerBlock.activeRemaining = 0;
  }

  playerBlock.activePaused = true;
  playerBlock.endTime = 0;
}*/

/*function pauseTimedBlock() {
  const playerBlock = combat.playerBlock;
  
  if (!playerBlock.active || playerBlock.activePaused) return;

  const now = performance.now();

  playerBlock.activeRemaining = Math.max(0, playerBlock.endTime - now);

  playerBlock.activePaused = true;

  console.log("timed paused");
}

function resumeTimedBlock() {
  const playerBlock = combat.playerBlock;

  if (!playerBlock.active || !playerBlock.activePaused) return;

  playerBlock.endTime = performance.now() + playerBlock.activeRemaining;

  playerBlock.activePaused = false;
}*/

/*function resumeTimedBlock() {
  if (!playerBlock.active || !playerBlock.activePaused) return;

  if (playerBlock.activeRemaining > 0) {
    playerBlock.endTime = Date.now() + playerBlock.activeRemaining;
  }

  playerBlock.activePaused = false;
}*/

function updateShieldUI() {
  const shieldBtn = document.getElementById("attack-left");
  const cooldownOverlay = shieldBtn?.querySelector(".block-cooldown-overlay");

  if (!shieldBtn || !cooldownOverlay) return;

  let COOLDOWN = gameState.combat.playerBlock.cooldown || 3500;

  if(gameState.combat.flags.isCritical) {
    COOLDOWN = 900;
  }
  
  const now = getGameTime();
  const cdEnd = gameState.combat.playerBlock.cooldownUntil || 0;
  
  if (now < cdEnd) {
    const remaining = cdEnd - now;
    const progress = remaining / COOLDOWN;

    //console.error(`shield disabled`);
    //shieldBtn.classList.add("cooldown");
    shieldBtn.classList.add("disabled");
    shieldBtn.classList.remove("turtle"); // 🔴 ważne

    cooldownOverlay.style.transform = `scaleY(${progress})`;
  } else {
    //console.error(`shield disabled`);
    shieldBtn.classList.remove("disabled");
    //shieldBtn.classList.remove("cooldown");
    cooldownOverlay.style.transform = `scaleY(0)`;
  }
}

function reduceShieldCooldown(reductionPercent) {
  const now = getGameTime();
  const cdEnd = gameState.combat.playerBlock.cooldownUntil || 0;

  // Tarcza nie jest aktualnie na cooldownie
  if (now >= cdEnd) return;

  const reduction = Math.max(0, Math.min(reductionPercent, 100)) / 100;

  const remaining = cdEnd - now;

  // Skracamy pozostały czas
  const newRemaining = remaining * (1 - reduction);

  gameState.combat.playerBlock.cooldownUntil = now + newRemaining;
}

const playerAttackCooldown = {
  cooldownEnd: 0,
  durationMs: 0,
  rafId: null,
  overlay: null,
  
  progress: 0,
  
  stunnedUntil: 0,
  isStunActive: false,
  slowMultiplier: 1,
  
  slow: {
    active: false,
    multiplier: 1,
    expiresAt: 0,
    lastUpdate: 0
  }
  
};


function startAttackCooldown(durationInSeconds) {
  const attackButton = document.getElementById("attack-button");
  const attackIcon = document.getElementById("attack-icon");
  const overlay = attackButton.querySelector(".cooldown-overlay");
    
  if (!attackButton || !attackIcon) return;

  const durationMs = durationInSeconds * 1000;

//  console.error(`durationMs`, durationMs);
  const eq = gameState.char?.equipment || {};
  const weapon = eq["weapon"];

  let weaponSprite = "img/icons/right-hand-placeholder.png";
  if (weapon) {
    weaponSprite = "img/items/" + weapon.sprite;
  }
  
  const weaponUrl = assetManager.getResolvedAsset(weaponSprite);
  //console.error(`weaponSprite, weaponUrl`, weaponSprite, weaponUrl);

  //attackButton.disabled = true;
  attackButton.classList.add("disabled");
  //attackButton.classList.add("cooldown");
  attackIcon.src = `${weaponUrl}`;

  //setSpriteImage(attackIcon, weaponSprite);
  
  /*let overlay = attackButton.querySelector(".cooldown-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "cooldown-overlay";
    attackButton.appendChild(overlay);
  }*/

  //overlay.style.transform = "scaleY(1)";

  playerAttackCooldown.durationMs = durationMs;
  playerAttackCooldown.cooldownEnd = getGameTime() + durationMs;
  playerAttackCooldown.overlay = overlay;

  playerAttackCooldown.progress = 0;
  playerAttackCooldown.lastUpdate = getGameTime(); 
  playerAttackCooldown.stunnedUntil = 0;
  
  if(!playerAttackCooldown.slow.active) {
    playerAttackCooldown.slow.active = false;
    playerAttackCooldown.slow.multiplier = 1;
    playerAttackCooldown.slow.expiresAt = 0;
  }
 
  // playerAttackCooldown.isStunActive = false;
  
  animateAttackCooldown();
}

function animateAttackCooldown() {

  const now = getGameTime();

  if (!playerAttackCooldown.lastUpdate) {
    playerAttackCooldown.lastUpdate = now;
  }

  const delta = now - playerAttackCooldown.lastUpdate;

  playerAttackCooldown.lastUpdate = now;
  

  // --------------------------------
  // PROGRESS
  // --------------------------------

    
  let speedMultiplier = 1;

  if (playerAttackCooldown.slow.active && playerAttackCooldown.slow.expiresAt > now) {
    speedMultiplier = playerAttackCooldown.slow.multiplier;
  } else {
    playerAttackCooldown.slow.active = false;
    playerAttackCooldown.slow.multiplier = 1;
    //updateStatusPlayerUI(enemy);
  }
  
  const progressDelta = (delta / playerAttackCooldown.durationMs) * speedMultiplier;

  playerAttackCooldown.progress += progressDelta;
  

  // --------------------------------
  // KONIEC
  // --------------------------------

  if (playerAttackCooldown.progress >= 1) {

    playerAttackCooldown.progress = 1;

    finishAttackCooldown();

    return;
  }


  // --------------------------------
  // UI
  // --------------------------------

  if (playerAttackCooldown.overlay) {
    playerAttackCooldown.overlay.style.transform = `scaleY(${1 - playerAttackCooldown.progress})`;
  }

  const fill = document.getElementById("player-cooldown-fill");

  if (fill) {
    fill.style.transform = `scaleX(${playerAttackCooldown.progress})`;
    
    if (playerAttackCooldown.slow.active) {
      fill.classList.add('slow');
      fill.classList.remove('stun');
    } else {
      fill.classList.remove('slow', 'stun');
    }

  }


  playerAttackCooldown.rafId = requestAnimationFrame(animateAttackCooldown);
}

function finishAttackCooldown() {
  const attackButton = document.getElementById("attack-button");
  const attackIcon = document.getElementById("attack-icon");

  const eq = gameState.char?.equipment || {};
  const weapon = eq["weapon"];

  let weaponSprite = "img/icons/right-hand-placeholder.png";

  if (weapon) {
    weaponSprite = "img/items/" + weapon.sprite;
  }

  const weaponUrl = assetManager.getResolvedAsset(weaponSprite);

  if (attackButton && attackIcon) {
    attackButton.classList.remove("disabled");
    attackIcon.src = weaponUrl;
  }

  if (playerAttackCooldown.overlay) {
    playerAttackCooldown.overlay.style.transform = "scaleY(0)";
  }

  const fill = document.getElementById("player-cooldown-fill");

  if (fill) {
    fill.style.transform = "scaleX(1)";
  }

  cancelAnimationFrame(playerAttackCooldown.rafId);

  playerAttackCooldown.cooldownEnd = 0;
  playerAttackCooldown.durationMs = 0;
  playerAttackCooldown.rafId = null;

  playerAttackCooldown.progress = 0;

  playerAttackCooldown.lastUpdate = 0;
  
  // reset slow
  if(!playerAttackCooldown.slow.active) {
    playerAttackCooldown.slow.active = false;
    playerAttackCooldown.slow.multiplier = 1;
    playerAttackCooldown.slow.expiresAt = 0;
    playerAttackCooldown.slow.lastUpdate = 0;
  }
  
 // playerAttackCooldown.isStunActive = false;
  
  
}

function restoreAttackCooldownAfterLoad() {

  const now = getGameTime();

  if (playerAttackCooldown.paused) {
    return;
  }

  if (playerAttackCooldown.cooldownEnd > now) {
    animateAttackCooldown();
  } else {
    finishAttackCooldown();
  }
}


function pausePlayerAttack() {

  if (!playerAttackCooldown.rafId) return;

  cancelAnimationFrame(playerAttackCooldown.rafId);

  playerAttackCooldown.rafId = null;
  playerAttackCooldown.lastUpdate = 0;

}

function resumePlayerAttack() {

  if (playerAttackCooldown.progress >= 1) {
    finishAttackCooldown();
    return;
  }

  const now = getGameTime();

  // ile czasu zostało od aktualnego progressu
  const remaining = playerAttackCooldown.durationMs * (1 - playerAttackCooldown.progress);

  playerAttackCooldown.cooldownEnd = now + remaining;

  playerAttackCooldown.lastUpdate = getGameTime();

  // ponownie uruchom animację
  animateAttackCooldown();
}

function stunPlayer(enemy, durationMs) {
  pausePlayerAttack();

  playerAttackCooldown.isStunActive = true;
  updateStatusPlayerUI(enemy);
           
  const fill = document.getElementById("player-cooldown-fill");

  fill.classList.add("stun");
  
  setTimeout(() => {
    resumePlayerAttack();
    playerAttackCooldown.isStunActive = false;
    updateStatusPlayerUI(enemy);
    fill.classList.remove("stun");
  }, durationMs);

}


function isPlayerStunned() {
  return playerAttackCooldown.stunnedUntil > getGameTime();
}

/*function pushbackPlayer(durationMs) {
  if (playerAttackCooldown.cooldownEnd <= 0) {
    return;
  }

  playerAttackCooldown.cooldownEnd += durationMs;
}*/

function pushbackPlayer(percent) {

  if (playerAttackCooldown.durationMs <= 0) {
    return;
  }

  const progressLoss = percent * playerAttackCooldown.durationMs;

  playerAttackCooldown.progress =
    Math.max(
      0,
      playerAttackCooldown.progress - progressLoss
    );
}

function slowPlayer(enemy, percent, durationMs) {

  const now = getGameTime();

  /*if (playerAttackCooldown.progress >= 1) {
    return;
  }*/

  playerAttackCooldown.slow.active = true;
  updateStatusPlayerUI(enemy); 
  /*playerAttackCooldown.slow.multiplier =
    1 + (percent / 100);*/

  //console.log(`slow durationMs`, durationMs);
  
  const fill = document.getElementById("player-cooldown-fill");

  fill.classList.add('slow');
    
  playerAttackCooldown.slow.multiplier = Math.max(0, 1 - percent / 100);
  
  playerAttackCooldown.slow.expiresAt = now + durationMs;
  
  setTimeout(() => {
    playerAttackCooldown.slow.active = false;
    updateStatusPlayerUI(enemy); 
    fill.classList.remove('slow');
  }, durationMs);

}


function startFinisherBar(durationMs, enemy) {
  gameState.combat.flags.enemyFinisherActive = true;

  //const bar = document.getElementById("finisher-bar");
  //const fill = document.getElementById("finisher-fill");
  const bar = document.querySelector(".enemy-cooldown-bar");
  const fill = document.getElementById(`enemy-cooldown-fill-${gameState.world.selectedSlotIndex}`);

  const baseCooldown = calculateCooldown(enemy.atkSpd, enemy) * 1000;

  //bar.classList.remove("hidden", "warning");

  //bar.classList.remove("warning");
  fill.classList.remove(`enemy-cooldown-fill`);
  fill.classList.add(`finisher-fill`);
  
  // reset
  fill.style.transition = "none";
  fill.style.width = "0%";
  void fill.offsetWidth;

  // animacja
  fill.style.transition = `width ${durationMs}ms linear`;
  fill.style.width = "100%";

  // ostrzeżenie przed ciosem (300 ms)
  setTimeout(() => {
    //bar.classList.add("warning");
    showEnemyOutcome("miss", `${t("now_outcome")}`, 500);
  }, durationMs - 550);

  // cleanup
  setTimeout(() => {
    //bar.classList.add("hidden");
    gameState.combat.flags.enemyFinisherActive = false;
    fill.classList.remove(`finisher-fill`);
    fill.classList.add(`enemy-cooldown-fill`);
    //bar.classList.remove("warning");
  }, durationMs);
}

function triggerCriticalShake() {
  document.body.classList.remove("critical-shake");
  void document.body.offsetWidth;
  document.body.classList.add("critical-shake");
}

function updateGuardUI(stacks) {
  const ring = document.getElementById("guard-ring");
  if (!ring) return;

  if (gameState.combat.activeRingMode !== "guard") return;
  
  //if (gameState.world.selectedSlotIndex === null) return;

  const enemy = gameState.world.exploreOptions[gameState.world.selectedSlotIndex]?.enemyData;
  
  const segments = ring.querySelectorAll(".guard-segment");

  /*if (gameState.combat.playerBlock.mode !== "defensive" || enemy.bleedStacks === 0) {
    //ring.classList.add("hidden");
    //return;
  }*/
  
 // console.error(`update guard UI`, stacks);
  
  ring.classList.remove("hidden");

  segments.forEach(seg => seg.style.opacity = 0);

  if (stacks === 1) {
    segments[0].style.opacity = 1;
    segments[0].style.stroke = "#FFD400";
  }

  if (stacks === 2) {
    segments[0].style.opacity = 1;
    segments[1].style.opacity = 1;
 
    segments[0].style.stroke = "#FF7A00";
    segments[1].style.stroke = "#FF7A00";
  }
 
  if (stacks === 3 && !ring.classList.contains("burst")) {
    segments.forEach(seg => {
      seg.style.opacity = 1;
      seg.style.stroke = "#FF1E1E";
    });
    
    ring.classList.add("full");
  }
}


function consumeGuardStacks(stacks) {
  const ring = document.getElementById("guard-ring");
  
  if(!ring) return;
  
  ring.classList.add("guard-release");

  ring.classList.toggle("full", stacks === 3);
  
  if (stacks === 3) showOutcome("perfect", `${t("counterattack_outcome")}`);
  
  setTimeout(() => {
    ring.classList.remove("guard-release");
    updateGuardUI(0);
    resetGuardRing();
  }, 150);
}

function updatePoise(delta) {
  if (gameState.world.selectedSlotIndex === null) return;

  const enemy = gameState.world.exploreOptions[gameState.world.selectedSlotIndex].enemyData;
  
  if (!enemy) return;
  if (enemy?.poiseBroken) return;
  
  enemy.poise = Math.min(
    enemy.maxPoise,
    enemy.poise + enemy.poiseRegenRate * delta
  );
}

function updatePoiseBar() {
  if(gameState.world.selectedSlotIndex === null) return;
  
  //console.error(`poise bar UI before`, gameState.combat.activeRingMode);
  
  if(gameState.combat.activeRingMode !== `poise`) return;
  
  //console.error(`poise bar UI after`, gameState.combat.activeRingMode);

  const enemy = gameState.world.exploreOptions[gameState.world.selectedSlotIndex]?.enemyData;
  const player = getPlayerStats();
  
  const bar = document.querySelector(".poise-bar");
  const fill = bar.querySelector(".poise-fill");

  const percent = enemy.poise / enemy.maxPoise;
  fill.style.width = `${percent * 100}%`;
  
  //console.error(`enemy.poise`, enemy.poise);

  updatePoiseTextColor(percent * 100);
  
  const poiseDmg = 35 + getStrScaling(player).effectPower;

  if (enemy.poise <= poiseDmg) {
    bar.classList.add("break-ready");
  } else {
    bar.classList.remove("break-ready");
  }
}

function updatePoiseTextColor(fillPercent) {
  const text = document.querySelector(".poise-text");

  // Zakładamy, że tekst jest na środku (50%)
  if (fillPercent > 50) {
    text.classList.add("on-fill");
    text.classList.remove("on-bar");
  } else {
    text.classList.add("on-bar");
    text.classList.remove("on-fill");
  }
}

function updatePoiseMarker() {
  if(gameState.world.selectedSlotIndex === null) return;
  
  if (gameState.combat.activeRingMode !== "poise") return;
  
  const enemy = gameState.world.exploreOptions[gameState.world.selectedSlotIndex]?.enemyData;
  const player = getPlayerStats();
  
  const bar = document.querySelector(".poise-bar");
  const marker = bar.querySelector(".poise-threshold");
  const text = bar.querySelector(".poise-text");

  const poiseDmg = 25 + getStrScaling(player).effectPower;

  const predicted = Math.max(0, enemy.poise - poiseDmg);

  const percent = predicted / enemy.maxPoise;

  text.textContent = `${enemy.poise.toFixed(0)} %`;
  
  marker.style.left = `${percent * 100}%`;
}

function updateBleedRing(enemy) {
  const ring = document.getElementById("guard-ring");
  if (!ring) return;

  if (gameState.combat.activeRingMode !== "bleed") return;
  
  const stacks = enemy.bleedStacks || 0;
  const segments = ring.querySelectorAll(".guard-segment");

  // pokaż ring
  ring.classList.remove("hidden");
  
    // reset segmentów
  segments.forEach(seg => {
    seg.style.opacity = 0;
  });

  // 1 stack
  if (stacks === 1) {
    segments[0].style.opacity = 1;
    segments[0].style.stroke = "#ff8a00"; // pomarańcz bleed
  }

  // 2 stacki
  if (stacks === 2) {
    segments[0].style.opacity = 1;
    segments[1].style.opacity = 1;

    segments[0].style.stroke = "#ff3d00";
    segments[1].style.stroke = "#ff3d00";
  }

  // 3 stacki = READY
  if (stacks >= 3 && !ring.classList.contains("burst")) {
    segments.forEach(seg => {
      seg.style.opacity = 1;
      seg.style.stroke = "#ff1e1e";
    });

    ring.classList.add("full-bleed"); // pulsowanie
  } else {
    ring.classList.remove("full-bleed");
  }
}

function resetBleedUI() {
  const ring = document.getElementById("guard-ring");
  if (!ring) return;

  const segments = ring.querySelectorAll(".guard-segment");

  segments.forEach(seg => seg.style.opacity = 0);

 // console.error(`reset bleed UI`);
  
  ring.classList.remove("full-bleed");
}

function setBleedReadyUI(isReady) {
  const ring = document.getElementById("guard-ring");
  if (!ring) return;

  ring.classList.toggle("full-bleed", isReady);
}

function triggerBleedVFX() {
  const ring = document.getElementById("guard-ring");
  if (!ring) return;

  ring.classList.add("burst");

  setTimeout(() => {
    ring.classList.remove("burst");
  }, 300);
}

function setTimingBarMode(mode) {
  const bar = document.getElementById("timing-mode");

  bar.classList.remove("mode-timed", "mode-bleed", "mode-break", "mode-spear");

  if (mode) {
    bar.classList.add(`mode-${mode}`);
   // console.error("bar mode", mode);
  }
}

let bleedTimingActive = false;
let bleedAnimationFrame = null;

const BLEED_TIMED_DURATION = TIMED_DURATION * 2;

function showBleedTimingUI(player) {
  const bar = document.getElementById("timing-mode");
  const miss = bar.querySelector(".miss-window");
  const normal = bar.querySelector(".normal-window");
  const perfect = bar.querySelector(".perfect-window");
  const indicator = bar.querySelector(".time-indicator");
  const sweep = bar.querySelector(".glass-sweep");

  gameState.combat.bleedTimingActive = true;
  
  // RESET
  indicator.style.transform = `translateX(0px) skewX(-10deg)`;
  sweep.style.transform = `translateX(0px)`;

  bar.classList.remove("hidden");

  const { perfect: p, normal: n } = getBleedWindows(player);

  setTimingBarMode("bleed");

  // MISS = CAŁOŚĆ
  miss.style.left = "0%";
  miss.style.width = "100%";
   
  // NORMAL
  const normalWidth = msToPercent(n) * 2;
  normal.style.left = `${50 - normalWidth / 2}%`;
  normal.style.width = `${normalWidth}%`;
   
  // PERFECT (zmień klasę na bleed)
  const perfectWidth = msToPercent(p) * 2;
  perfect.style.left = `${50 - perfectWidth / 2}%`;
  perfect.style.width = `${perfectWidth}%`;
  
  let startTime = getGameTime();
  let barWidth;

  bleedTimingActive = true;

  function animate() {
    if (!bleedTimingActive || gameState.globalTime.isPaused) return;
    
    const elapsed = getGameTime() - startTime;
    
    const cycle = elapsed / BLEED_TIMED_DURATION;
    
    let criticalMultiplier = 1;
    if(gameState.combat.flags.isCritical) {
      criticalMultiplier = 1.6;
    }
    
    const progress = Math.abs(Math.sin(cycle * criticalMultiplier * Math.PI));
    
    const moveX = progress * barWidth;

    indicator.style.transform = `translateX(${moveX}px) skewX(-10deg)`;
    sweep.style.transform = `translateX(${moveX}px)`;

    bleedAnimationFrame = requestAnimationFrame(animate);
  }
  
  requestAnimationFrame(() => {
    barWidth = bar.offsetWidth || 1;
    requestAnimationFrame(animate);
  });
}

function stopBleedTimingUI() {
  bleedTimingActive = false;

  if (bleedAnimationFrame) {
    cancelAnimationFrame(bleedAnimationFrame);
    bleedAnimationFrame = null;
  }

  const bar = document.getElementById("timing-mode");
  bar.classList.add("hidden");
}

function resumeBleedUI() {
  if (!bleedTimingActive) return;
  
  const bar = document.getElementById("timing-mode");

  if (bar.classList.contains("hidden")) return;

  const player = getPlayerStats();
  showBleedTimingUI(player);
}

function decayBleedStacks(enemy) {
  if (!enemy.lastBleedHit) return;
  
  //console.error(`bleed decay active ring`, gameState.combat.activeRingMode);
  
  if (gameState.combat.activeRingMode !== `bleed`) return;

  //console.error(`bleed decay`);
  
  const now = getGameTime();

  if (now - enemy.lastBleedHit > 3500) {
    enemy.bleedStacks = Math.max(0, enemy.bleedStacks - 1);

    enemy.lastBleedHit = now;
    
    if (enemy.bleedStacks < 3) {
      enemy.bleedReady = false;
      gameState.combat.bleedTimingActive = false;
      setBleedReadyUI(false);
    }

   // console.error(`bleed decay enemy.bleedStacks`, enemy.bleedStacks);
    updateBleedRing(enemy);
    stopBleedTimingUI();
  }
}

const GS_TIMED_DURATION = 800; // wolniej niż bleed

function getArmorBreakWindows(player) {
  const BASE_TOTAL = 220; // mniejsze niż bleed

  const PERFECT_RATIO = 0.12; // węższe okno
  const agiBonus = 1 + player.agi * 0.001; // mniejszy wpływ niż bleed

  const bonus = 1 + (gameState.char.bonus.perfectWindowBonus / 100);
  
  const total = BASE_TOTAL;

  const perfect = total * PERFECT_RATIO * agiBonus * bonus;
  const normal = total - perfect;

  return {
    perfect,
    normal
  };
}

let armorBreakAnimationFrame = null;
let armorBreakActive = false;

function showArmorBreakTimingUI(enemy, player) {
  const bar = document.getElementById("timing-mode");
  const miss = bar.querySelector(".miss-window");
  const normal = bar.querySelector(".normal-window");
  const perfect = bar.querySelector(".perfect-window");
  const indicator = bar.querySelector(".time-indicator");
  const sweep = bar.querySelector(".glass-sweep");

  gameState.combat.armorBreakTimingActive = true;
  
  // RESET
  indicator.style.transform = `translateX(0px) skewX(-10deg)`;
  sweep.style.transform = `translateX(0px)`;

  bar.classList.remove("hidden");

  // 👉 specjalne okna dla GS
  const { perfect: p, normal: n } = getArmorBreakWindows(player);

  // MISS
  miss.style.left = "0%";
  miss.style.width = "100%";
   
  // NORMAL
  const normalWidth = msToPercent(n) * 2;
  normal.style.left = `${50 - normalWidth / 2}%`;
  normal.style.width = `${normalWidth}%`;
 
  // PERFECT
  const perfectWidth = msToPercent(p) * 2;
  perfect.style.left = `${50 - perfectWidth / 2}%`;
  perfect.style.width = `${perfectWidth}%`;
  
  const startTime = getGameTime();
  let barWidth;

  armorBreakActive = true;

  setTimingBarMode("break");
  
  function animate() {
    if (!armorBreakActive) return;

    const elapsed = getGameTime() - startTime;
    const progress = Math.min(elapsed / GS_TIMED_DURATION, 1);

    const moveX = progress * barWidth;

    indicator.style.transform = `translateX(${moveX}px) skewX(-10deg)`;
    sweep.style.transform = `translateX(${moveX}px)`;

    if (progress < 1) {
      armorBreakAnimationFrame = requestAnimationFrame(animate);
    } else {
      // timeout = miss
      stopArmorBreakTimingUI(enemy);
    }
  }

  requestAnimationFrame(() => {
    barWidth = bar.offsetWidth;
    requestAnimationFrame(animate);
  });
}

function stopArmorBreakTimingUI(enemy) {
  armorBreakActive = false;

  if (armorBreakAnimationFrame) {
    cancelAnimationFrame(armorBreakAnimationFrame);
    armorBreakAnimationFrame = null;
  }

  if (enemy.armorBreakReady) {
    enemy.exposeStacks = 0; 
    
    gameState.combat.armorBreakTimingActive = false;
    enemy.armorBreakReady = false;
    updateArmorRing(enemy);
  }
  
  const bar = document.getElementById("timing-mode");
  bar.classList.add("hidden");

}

function updateArmorRing(enemy) {
  const ring = document.getElementById("guard-ring");
  if (!ring) return;

  if (gameState.combat.activeRingMode !== "armor") return;
  
  const stacks = enemy.exposeStacks || 0;
  const segments = ring.querySelectorAll(".guard-segment");

  // pokaż ring
  ring.classList.remove("hidden");
  
    // reset segmentów
  segments.forEach(seg => {
    seg.style.opacity = 0;
  });

  //console.error(`reset UI armor break`, enemy.exposeStacks);
  
  // 1 stack
  if (stacks === 1) {
    segments[0].style.opacity = 1;
    segments[0].style.stroke = "#ff8a00"; // pomarańcz bleed
  }

  // 2 stacki
  if (stacks === 2) {
    segments[0].style.opacity = 1;
    segments[1].style.opacity = 1;

    segments[0].style.stroke = "#ff3d00";
    segments[1].style.stroke = "#ff3d00";
  }

  // 3 stacki = READY
  if (stacks >= 3 && !ring.classList.contains("burst")) {
    segments.forEach(seg => {
      seg.style.opacity = 1;
      seg.style.stroke = "#ff1e1e";
    });

    ring.classList.add("full"); // pulsowanie
  } else {
    ring.classList.remove("full");
  }
}

function setArmorReadyUI(isReady) {
  const ring = document.getElementById("guard-ring");
  if (!ring) return;

  ring.classList.toggle("full", isReady);
}

function decayArmorBreakStacks(enemy) {
  if (!enemy.lastArmorBreakHit) return;
  if (!enemy.exposeStacks) return;
  if (gameState.combat.activeRingMode !== `armor`) return;
  
  const now = getGameTime();

  if (now - enemy.lastArmorBreakHit > 4000) {
    enemy.exposeStacks = Math.max(0, enemy.exposeStacks - 1);

    // 🔥 reset timera – KLUCZ
    enemy.lastArmorBreakHit = now;

    if (enemy.exposeStacks < 3) {
      enemy.armorBreakReady = false;
      setArmorReadyUI(false);
    }

    //console.error("armor decay:", enemy.exposeStacks);

    updateArmorRing(enemy);

    // jeśli spadło do 0 → sprzątaj
    if (enemy.exposeStacks === 0) {
      stopArmorBreakTimingUI(enemy);
      gameState.combat.armorBreakTimingActive = false;
    }
  }
}

let spearTimingActive = false;
let spearAnimationFrame = null;

const SPEAR_TIMED_DURATION = TIMED_DURATION * 2;

function startSpearControlUI(player) {
  const bar = document.getElementById("timing-mode");
  const miss = bar.querySelector(".miss-window");
  const normal = bar.querySelector(".normal-window");
  const perfect = bar.querySelector(".perfect-window");
  const indicator = bar.querySelector(".time-indicator");
  const sweep = bar.querySelector(".glass-sweep");

  // RESET
  indicator.style.transform = `translateX(0px) skewX(-10deg)`;
  sweep.style.transform = `translateX(0px)`;

  bar.classList.remove("hidden");

  const { perfect: p, normal: n } = getSpearWindows(player);

  setTimingBarMode("spear");

  // MISS = CAŁOŚĆ
  miss.style.left = "0%";
  miss.style.width = "100%";
   
  // NORMAL
  const normalWidth = msToPercent(n) * 2;
  normal.style.left = `${50 - normalWidth / 2}%`;
  normal.style.width = `${normalWidth}%`;
   
  // PERFECT 
  const perfectWidth = msToPercent(p) * 2;
  perfect.style.left = `${50 - perfectWidth / 2}%`;
  perfect.style.width = `${perfectWidth}%`;
  
  let startTime = getGameTime();
  let barWidth;

  spearTimingActive = true;

  function animate() {
    if (!spearTimingActive || gameState.globalTime.isPaused) return;

    const elapsed = getGameTime() - startTime;
    
    const cycle = elapsed / SPEAR_TIMED_DURATION;
    //const progress = Math.abs(Math.sin(cycle * Math.PI));
    
    let criticalMultiplier = 1;
    if(gameState.combat.flags.isCritical) {
      criticalMultiplier = 1;
    }
    
    const progress = Math.pow(Math.abs(Math.sin(cycle * criticalMultiplier * Math.PI)), 0.7);
    
    const moveX = progress * barWidth;

    indicator.style.transform = `translateX(${moveX}px) skewX(-10deg)`;
    sweep.style.transform = `translateX(${moveX}px)`;

    spearAnimationFrame = requestAnimationFrame(animate);
  }
  
  requestAnimationFrame(() => {
    barWidth = bar.offsetWidth || 1;
    requestAnimationFrame(animate);
  });
}

function stopSpearControlUI() {
  spearTimingActive = false;

  if (spearAnimationFrame) {
    cancelAnimationFrame(spearAnimationFrame);
    spearAnimationFrame = null;
  }
  
  //console.error(`stop spear UI`);

  const bar = document.getElementById("timing-mode");
  bar.classList.add("hidden");
}


function resumeSpearUI() {
  if (!spearTimingActive) return;

  //if (spearAnimationFrame) return; // już działa

  const bar = document.getElementById("timing-mode");

  if (bar.classList.contains("hidden")) return;

  const player = getPlayerStats();
  //spearAnimationFrame = requestAnimationFrame(animate);
  //stopSpearControlUI();
  startSpearControlUI(player);
}

function updateSpearRing(enemy) {
  const ring = document.getElementById("guard-ring");
  if (!ring) return;

  if (gameState.combat.activeRingMode !== "spear") return;
  
  const stacks = enemy.spear?.stacks || 0;
  const segments = ring.querySelectorAll(".guard-segment");

  // pokaż ring
  ring.classList.remove("hidden");
  
    // reset segmentów
  segments.forEach(seg => {
    seg.style.opacity = 0;
  });

  // 1 stack
  if (stacks === 1) {
    segments[0].style.opacity = 1;
    segments[0].style.stroke = "#4aa3ff"; 
  }

  // 2 stacki
  if (stacks === 2) {
    segments[0].style.opacity = 1;
    segments[1].style.opacity = 1;

    segments[0].style.stroke = "#00cfff";
    segments[1].style.stroke = "#00cfff";
  }

  // 3 stacki = READY
  if (stacks >= 3 && !ring.classList.contains("burst")) {
    segments.forEach(seg => {
      seg.style.opacity = 1;
      seg.style.stroke = "#e6faff";
    });

    ring.classList.add("full"); // pulsowanie
  } else {
    ring.classList.remove("full");
  }
}

function resetSpearUI() {
  const ring = document.getElementById("guard-ring");
  if (!ring) return;

  const segments = ring.querySelectorAll(".guard-segment");

  segments.forEach(seg => seg.style.opacity = 0);

  stopSpearControlUI();
  
 // console.error(`reset spear UI`);
  
  ring.classList.remove("full");
}

function setSpearReadyUI(isReady) {
  const ring = document.getElementById("guard-ring");
  if (!ring) return;
  //console.log(`spear full toogle`);
  ring.classList.toggle("full", isReady);
}

/*function updateGuardRing1H(mode, combo) {
  const ring = document.getElementById("guard-ring");
  if (!ring) return;

  const segments = ring.querySelectorAll(".guard-segment");

  // reset
  segments.forEach(seg => seg.classList.remove("filled"));
  ring.classList.remove("hidden", "full");

  const progress = combo % 3;

  if (progress === 0) {
    // 👉 NIE pokazujemy pełnego ringa
    ring.classList.add("hidden");
    return;
  }

  ring.classList.remove("hidden");
  ring.classList.add(`mode-${mode}`);

  for (let i = 0; i < progress; i++) {
    segments[i].classList.add("filled");
  }
}*/

function decayComboStack(enemy, mode) {
  if (!enemy.lastComboHit) return;
  
  const stats = gameState.combat.stats;
  if (!stats.combo) return;

  if (gameState.combat.activeRingMode !== mode) return;
  
  const now = getGameTime();

  if (now - enemy.lastComboHit > 3000) {
    stats.combo = Math.max(0, stats.combo - 1);

    enemy.lastComboHit = now;
    
    if (stats.combo < 3) {
      stats.comboReady = false; 
    }
    
    //console.error(`combo decay`, stats.combo);
    updateGuardRing(mode, stats.combo);
  }
}

function updateGuardRing(mode, stacks) {
  const ring = document.getElementById("guard-ring");
  if (!ring) return;

  const segments = ring.querySelectorAll(".guard-segment");

  // 🔥 reset segmentów
  segments.forEach(seg => {
    //seg.classList.remove("filled");
    seg.style.opacity = 0;
    seg.style.stroke = ``;
  });

  // 🔥 reset klas ringa
  ring.classList.remove(
    "mode-sword",
    "mode-longsword",
    "mode-axe",
    "mode-mace",
    "lvl-1",
    "lvl-2",
    "lvl-3",
    "full"
  );

  if (!mode || stacks <= 0) {
    ring.classList.add("hidden");
    return;
  }

  ring.classList.remove("hidden");
  ring.classList.add(`mode-${mode}`);

  const lvl = Math.min(3, stacks);
  ring.classList.add(`lvl-${lvl}`);

  // 🔥 TU NAJWAŻNIEJSZE
  for (let i = 0; i < lvl; i++) {
    //segments[i].classList.add("filled");
    segments[i].style.opacity = 1;
  }

  if (lvl === 3) {
    ring.classList.add("full");
  }
}

function resetGuardRing() {
  const ring = document.getElementById("guard-ring");
  if (!ring) return;

  const segments = ring.querySelectorAll(".guard-segment");

  segments.forEach(seg => {
    //seg.classList.remove("filled");
    seg.style.opacity = 0;
  });

  ring.classList.add("hidden");

  ring.classList.remove(
    "mode-sword",
    "mode-longsword",
    "mode-axe",
    "mode-mace",
    "mode-spear",
    "lvl-1",
    "lvl-2",
    "lvl-3",
    "full",
    "burst",
    "guard-release"
  );
}

function triggerRingBurst() {
  const ring = document.getElementById("guard-ring");
  if (!ring) return;
  
  ring.classList.add("burst");

  setTimeout(() => {
    ring.classList.remove("burst");
  }, 300);
}

function triggerRingFull() {
  const ring = document.getElementById("guard-ring");
  if (!ring) return;
  
  const segments = ring.querySelectorAll(".guard-segment");

  segments.forEach(seg => {
    seg.style.opacity = 1;
  });
  
  ring.classList.add("full");

  setTimeout(() => {
    ring.classList.remove("full");
  }, 300);
}


function triggerRingPulse(mode) {
  const ring = document.getElementById("guard-ring");
  if (!ring) return;

  const segments = ring.querySelectorAll(".guard-segment");

  segments.forEach(seg => {
    seg.style.opacity = 1;
  });
  
  ring.classList.remove("hidden");

  ring.classList.add(`pulse-${mode}`);

  setTimeout(() => {
    ring.classList.remove(`pulse-${mode}`);
    ring.classList.add("hidden");
  }, 300);
}

function setLongswordBuffUI(active) {
  const attackBtn = document.getElementById("attack-button");

  if (!attackBtn) return;
  
  attackBtn.classList.toggle("ls-buff", active);
}