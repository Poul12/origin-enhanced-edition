
// === FLEE CONFIG ===
const FLEE_CFG = {
  BASE_CHANCE: 1,        // bazowa szansa 0.55
  LVL_DIFF_BONUS: 0.05,     // +5% za każdy poziom przewagi gracza
  LVL_DIFF_PENALTY: 0.05,   // -5% za każdy poziom przewagi wroga
  MIN_CHANCE: 0.15,         // dolne ograniczenie
  MAX_CHANCE: 0.90,         // górne ograniczenie
  GOLD_LOSS_ON_SUCCESS: 0.10, // -10% złota gdy ucieczka się uda
  GOLD_LOSS_ON_FAIL: 0.05,    // -5% złota gdy się nie uda
  FATIGUE_SEC: 5,           // “zmęczenie” po udanej ucieczce (blokuje skille)
  REENGAGE_LOCK_SEC: 5,     // wróg „nieaktywny” chwilę po ucieczce
  FAIL_EXTRA_HIT: true,     // przy nieudanej ucieczce wróg od razu atakuje
  PITY_BONUS: 0.08          // +8% za każdy fail
};

const STAMINA_COST = {
  TIMED_BLOCK: 15,
  DEFENSIVE_BLOCK: 8,
  DODGE: 25
};

const CRITICAL_FINISHER_TIME = 2300;

const DEFENSIVE_HP_REGEN_PERCENT_PER_SEC = 0.8;
const DEFENSIVE_POTION_EFFECT_MULTIPLIER = 1.4;
const DEFENSIVE_GUARD_STACK_INTERVAL = 1.2; // sek
const DEFENSIVE_GUARD_STACK_MAX = 3;

const ACTION_BUTTON_SELECTORS = [
  "#attack-button",
  "#attack-left",
  "button.skill-button",
  //".potion-slot",
  //".potions-grid",
  ".potions-section"
];

// ——— COMBAT ———

let isBlocking = false;
let blockDrainInterval = null;

let isOnCooldown = false;
let enemyContent;

let isExploring = false;


function initCombatState() {
  const stats = gameState.combat.stats;
  const player = calculatePlayerStats(gameState.char);
  
  stats.hp = player.maxHp;
  stats.dmg = player.dmg;
  stats.def = player.def;

 // console.error(`combatState.dmg in init`, stats.dmg);
}

function updatePlayerHp(newHp) {
  const char = gameState.char;

  const clampedHp = Math.max(0, Math.min(newHp, char.maxHp));

  char.hp = clampedHp;
 }

let currentBuff = { dmg: 0, def: 0 };

function updatePlayerDmg(newDmg, isBuff = false) {
   
  if (isBuff) {
    currentBuff.dmg = newDmg; 
  } else {
    gameState.char.dmg = newDmg;
    saveGame();
  }
  
  renderStats();
}

function updatePlayerDef(newDef, isBuff = false) {
    
  if (isBuff) {
    currentBuff.def = newDef; 
  } else {
    gameState.char.def = newDef;
    saveGame(); 
  }
  
  renderStats();
}


function updateEnemyHealthBar(enemy, i) {
  //console.log("start update enemy health bar", i);
  if (i === null) return;
  
  const slot = document.querySelectorAll('.explore-slot')[i];
  //const percent = (currentHp / maxHp) * 100;

  //console.log("before percent update enemy health bar", enemy.currentHp, enemy.maxHp);

  const percent = Math.max(0, Math.min(100, (enemy.currentHp / enemy.maxHp) * 100));
  
  const fill = slot.querySelector('.enemy-health-fill');
  const text = slot.querySelector('.enemy-health-text');
  
  //console.log("after percent and fill update enemy health bar", percent);
  
  /*const dom = enemy.dom;
  if(dom?.healthFill) enemy.dom.healthFill.style.transform = `scaleX(${percent / 100})`;
  if(dom?.healthText) enemy.dom.healthText.textContent = `${formatNumber(enemy.currentHp)}/${formatNumber(enemy.maxHp)}`;
  
  console.log("dom.healthFill, dom.healthText", dom.healthFill, dom.healthText.textContent, percent)*/
  
  //if (fill) fill.style.width = `${percent}%`;
  if (fill) fill.style.transform = `scaleX(${percent / 100})`;
  if (text) text.textContent = `${formatNumber(enemy.currentHp)}/${formatNumber(enemy.maxHp)}`;
}

function enterCombat() {
  const char = gameState.char;
    
  char.inCombat = true;
  char.lastRegenTs = Date.now();
  char.regenAllowedAt = 0;
  gameState.resources.staminaState.inCombat = true;
}

function hideOtherNonCombatElements(enemy) {
  const world = gameState.world;
  const progressBar = document.getElementById("progress-container");
  const arrows = document.querySelector(".arrows-center");
  const questBtn = document.getElementById("quest-button");
  const storeBtn = document.getElementById("store-button");
  const stats = document.querySelector(".enemy-stat-group");
  const enemyInfo = document.querySelector(".enemy-info");
  const testBtn = document.getElementById("test-holder");

  if(enemy.type === `mini_boss`) {
    enemyInfo.style.opacity = `0`;
  }
  
  //stats.style.opacity = `0`;
  progressBar.style.opacity = `0`;
  arrows.style.opacity = `0`;
  testBtn.style.opacity = `0`;

  if(world.mode === `story`) {
    questBtn.style.opacity = `0`;
  } else {
    storeBtn.style.opacity = `0`;
  }
}

async function startCombat(i) {
  const world = gameState.world;
  const combat = gameState.combat;
  const char = gameState.char;
  const perfectBar = document.querySelector(".perfect-block-bar");
  const bar = document.getElementById("poise-mode");
  const masteryBar = document.getElementById("mastery-bar-container");
  const expBar = document.getElementById("exp-bar-container");
  const style = getCurrentWeaponStyle();

  masteryBar.classList.remove(`hidden`);
  //console.log(`masteryBar`, masteryBar);
  expBar.classList.add(`hidden`);
  
  setMasteryStyle(style);
  showMasteryTitle(style);
  
  //window.scrollTo(0, 0);
   
 // console.log(`block mode`, combat.playerBlock.mode);
  
  const eq = gameState.char?.equipment || {};
  const weapon = eq[`weapon`];

  if(weapon?.baseName === `hammer`) {
    //perfectBar.classList.add("mode-poise");
    //perfectBar.classList.remove("mode-timing");
    bar.classList.remove("hidden");
    combat.activeRingMode = "poise";
  }else {
    combat.activeRingMode = ``;
  }

  world.inCombat = true;
  world.selectedSlotIndex = i;
  world.exploreOptions[i].isAttacked = true;
  const enemy = world.exploreOptions[world.selectedSlotIndex].enemyData;
  //console.log("enemy ", enemy.name);
  setMenuDisabled(true); // zablokuj menu
  
  if(enemy?.skills) {
    enemy.skillState = enemy?.skills.map(skill => ({
      id: skill.id,
      level: skill.level ?? 1,
      expiresAt: 0
    }));
  }
  
  resetSlotActionButton(i);
  
  //focusOnAttackDialogBox();
  
  combat.flags.isCritical = false;
  
  combat.stats.combo = 0;
  
  enterCombat();
  
  initCombatState();
  
  playSound(`open`, 0.4);

  const enSlot = document.querySelectorAll('.explore-slot')[i];
  enemy.dom = {
    slot: enSlot,
    healthBar: enSlot.querySelector('.enemy-health-bar'),
    healthFill: enSlot.querySelector('.enemy-health-fill'),
    healthText: enSlot.querySelector('.enemy-health-text'),
    cooldownFill: document.getElementById(`enemy-cooldown-fill-${i}`)
  }
  
  const playerSlot = document.getElementById('player-combat-slot');
  char.dom = {
    slot: playerSlot,
  };
  
  /*if(combat.flags.isLowHp && ) {
    combat.lowHpBonus.lowHpDmgActive = true;
  }*/
  
  
  const cost = getEnergyCostForSlot(world.exploreOptions[i].type);
  const multiplier = getEnergyCombatMultiplier(cost);
  
  //console.error(`cost i multiplier in start combat`, cost, multiplier, energyState.current);
  
  if(gameState.resources.energyState.current >= cost) {
    combat.stats.energyFatigueStack = 1;
    //saveState();
  }
  
  spendEnergy(world.exploreOptions[i].type);
  
  if(multiplier < 1) {
    combat.flags.isDebuff = true;
    combat.flags.previewStats = true;
    //combatState.energyMultiplier = multiplier;
    const hpPercent = getHpPercentFromChar();
    //console.error(`hpPercent in start combat `, hpPercent);
    //console.error(`debuff stats multiplier in start combat `, multiplier);
    //playSound(`player-exhausted`, 0.38);
    applyEnergyDebuff(multiplier);
    applyEnergyFatigue();
    applyPercentToChar(hpPercent);
    renderStats();
    getDebuffPercentHp();
  }
  
  // 🔒 twarda blokada regeneracji
  if (enemy.regen) {
    enemy.regen = null;
  }
  
  const enemySlot = document.getElementById(`enemy-slot-${i}`);
  enemyContent = document.createElement("div");
  enemyContent.className = "enemy-content";
  enemySlot.appendChild(enemyContent);
  //enemy.enemyContent = enemyContent;
  
  const enemySlotGlow = document.querySelector(`.explore-slot[data-index='${i}']`);

  enemySlotGlow.classList.remove("enemy-glow", "enemy-glow-normal");
  if(enemy?.type === "elite") {
    enemySlotGlow.classList.remove("enemy-glow", "enemy-glow-elite");
  }
  
 // startEnemyAttackTimeline(enemy, i);
  
  if (i < 0 || i >= world.exploreOptions.length) {
   // console.warn(`Nieprawidłowy index: ${i}`);
    return;
  }
  
  const attackBtn = document.getElementById(`slot-attack-button-${i}`);
  attackBtn.classList.add("hidden");
  
  isExploring = false;
  stopEnemyUiRegenTick();
  
  document.querySelectorAll(".explore-slot")
    .forEach((slot, index) => {

      if(index !== i) {
        requestAnimationFrame(() => {
          slot.classList.add("faded");
        });
      }
    });

  hideOtherNonCombatElements(enemy);
  
  await wait(250);
  
  renderOptions();
  
  renderPlayerCombatSlot(enemy);
  
  await wait(950);
  
  if(enemy.type !== `mini_boss`) {
    vsSymbolAnimationShow();
  }
  
  gameState.combat.isStart = true;
  
  //renderPlayerCombatSlot();
  
  //animateEnemyStatsToCombat();
  startEnemyAttackTimeline(enemy, i);
  
 // animateEnemyStatsToCombat();
  //applyEnemyRegen(enemy);
  //renderCombat();
  lockCombatScroll();
  //renderOptions();
  lockOtherActions(i);
  focusOnAttackDialogBox();
  hideNavigateButtons();
  saveGame();
}

function renderPlayerCombatSlot(enemy){
    const slot = document.getElementById("player-combat-slot");

    if(!gameState.world.inCombat){
      return;
    }
  
    slot.classList.remove("fade-out");
    slot.classList.remove("boss-fight");

    // wymuszenie restartu animacji
    void slot.offsetWidth;

    slot.classList.add("fade-in");
    
    if(enemy.type === `mini_boss`) {
      slot.classList.add("boss-fight");
    }
  
    const bg = document.getElementById("player-slot-bg");

    bg.src = assetManager.getResolvedAsset(
        `img/backgrounds/${backgroundMap[gameState.world.currentLocation]}`
    );
    bg.style.marginTop = "15px";
  
    //const playerBody = document.getElementById("player-body");
    //playerBody.src = assetManager.getResolvedAsset("img/avatar/avatar-body.png");
     
    /*const playerShadow = document.getElementById("player-shadow");
    playerShadow.className = "enemy-shadow";*/
    
    const playerFrame = document.getElementById("player-frame");

    playerFrame.alt = `Player Frame`;
    playerFrame.src = assetManager.getResolvedAsset(`img/frames/explore-frame.png`);
  
    renderPlayerHealth();
    //renderPlayerCooldown();
  
    renderPlayerAvatar();
}

function renderPlayerAvatar() {
  const eq = gameState.char?.equipment || {};

  const weapon = eq.weapon;
  const helmet = eq.helmet;
  const armor = eq.armor;
  const gloves = eq.gloves;
  const boots = eq.boots;
  const pants = eq.pants;
  const shoulder = eq.shoulder;
  const bracer = eq.bracers;
  const shield = eq.shield;
  
  const is2H = weapon?.twoHanded;
  
  const basePath = `img/avatar/`;
  const bodyFile = is2H
    ? "body-for-2h.png"
    : "body-for-1h.png";
  
  const armorType = armor?.sprite ?? "chestplate.png";
  
  const handsFile =
    `hands-for-${is2H ? "2h" : "1h"}-${armorType}`;
  
  const playerBody = document.getElementById("player-body");
  const playerHead = document.getElementById("player-head");
  const playerHands = document.getElementById("player-hands");

  playerBody.src = assetManager.getResolvedAsset(basePath + bodyFile);
  playerHead.src = assetManager.getResolvedAsset("img/avatar/head.png");
  playerHands.src = assetManager.getResolvedAsset(basePath + handsFile);

  playerHead.style.display = helmet ? "none" : "";

  
  renderLayer("player-helmet", helmet);
  renderLayer("player-armor", armor);
  renderLayer("player-boots", boots);
  renderLayer("player-pants", pants);
  renderLayer("player-gloves", gloves);
  renderLayer("player-bracer", bracer);
  renderLayer("player-shoulder", shoulder);
  renderLayer("player-weapon", weapon);
  renderLayer("player-shield", shield);
  
}

function renderLayer(id, item){
    const img = document.getElementById(id);

    if(!item){
        img.style.display="none";
      //  console.log(`return renderLayer`, item);
        return;
    }
    
   const basePath = `img/avatar/`;

    //console.log(`renderLayer`, item.sprite);
  
    img.style.display="";

    img.src = assetManager.getResolvedAsset(basePath + item.sprite);
}


function vsSymbolAnimationShow() {
    const vsSymbol = document.getElementById("vs-symbol");

    vsSymbol.src = assetManager.getResolvedAsset("img/exploring-slots/vs-symbol-combat.png");
  
    //vsSymbol.classList.remove("vs-enter");
    void vsSymbol.offsetWidth;
    vsSymbol.classList.add("vs-enter");
}

function renderPlayerHealth(){

    const char = gameState.char;

    const percent = char.hp / char.maxHp * 100;

    document.getElementById("player-health-fill").style.width =
        percent + "%";

    document.getElementById("player-health-text").innerText =
        `${formatNumber(char.hp)}/${formatNumber(char.maxHp)}`;
}

function vsSymbolAnimationHide() {
    const vsSymbol = document.getElementById("vs-symbol");

    vsSymbol.classList.remove("vs-enter");
}

function hidePlayerAvatar() {
    const slot = document.getElementById("player-combat-slot");
  
    //slot.classList.add("hidden");
    //slot.style.opacity = `0`;
    //slot.classList.remove("fade-in");
  
    /*requestAnimationFrame(() => {
      slot.classList.add("fade-out");
    });*/
  
    void slot.offsetWidth;
    slot.classList.add("fade-out");
  
   /* requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        //slot.classList.add("fade-out");
        //slot.style.transform = "translateX(-150px) scale(1.14)";
      });
    });*/
}

function playerHasShieldEquipped() {
  const eq = gameState.char?.equipment || {};
  const shield = eq[`shield`];
  
  if(shield){
    return true;
  }
  
  return false;
}

function animateEnemyStatsToCombat() {
  const stats = document.querySelector(".enemy-stat-group");
  const enemyInfo = document.querySelector(".enemy-info");

  if (!stats) return;
  
  requestAnimationFrame(() => {
    stats.classList.add("combat-layout");
    enemyInfo.classList.add("enemy-name-combat");
    
    enemyInfo.style.opacity = `1`;
    stats.style.opacity = `1`;
  });
}

function restoreEnemyStatsLayout() {
  const stats = document.querySelector(".enemy-stat-group");
  const enemyInfo = document.querySelector(".enemy-info");

  if (!stats) return;
  
  stats.classList.remove("combat-layout");
  
  enemyInfo.classList.remove("enemy-name-combat");

  stats.style.opacity = `1`;
}

function renderCombat(renderPotion = false) {
  const dlg = document.getElementById("attack-dialog-box");
  const player = getPlayerStats();
  const eq = gameState.char?.equipment || {};
  const shield = eq[`shield`];
  const weapon = eq[`weapon`];
  
  let shieldSprite = `img/icons/left-hand-placeholder.png`;
  let weaponSprite = `img/icons/right-hand-placeholder.png`;
  
  if(weapon){
    weaponSprite = `img/items/` + weapon.sprite;
  }
  
  if(playerHasShieldEquipped()) {
    shieldSprite = `img/items/` + shield.sprite;
  }
  
  if(weapon?.twoHanded) {
    shieldSprite = `img/items/` + weapon.sprite;
    gameState.combat.playerBlock.mode = null;
    //shieldIcon.classList.add(`shield-disabled`);
  }
 
  //console.error(`shieldSprite`, shieldSprite);
  //console.error(`weaponSprite`, weaponSprite);
  
  const shieldUrl = assetManager.getResolvedAsset(shieldSprite);
  const weaponUrl = assetManager.getResolvedAsset(weaponSprite);
  
    // 🧱 Layout główny renderowany tylko raz
  if (!dlg.dataset.initialized) {
    dlg.innerHTML = `
      <div id="combat-enemy-section"></div>

      <div id="test-holder" class="hidden">
        <button class="menu-item" onclick="toggleBypass()" id="bypass-btn" title="Test">T
          <!-- <img data-src="img/icons/menu-market-icon.png" alt="Zamknij" class="menu-icon" />-->
        </button>
      </div>
    
      <div id="focus-holder">
        ${renderFocusSkillButton(player.level)}
      </div>
    
      <div class="attack-row">
        <div class="attack-slot">
          <div class="attack-wrapper left" id="left-hand" data-action="block">
    
            <button class="attack-button common" id="attack-left">
              <img class="shield-icon" id="defense-icon" src="${shieldUrl}" alt="Atak Lewa Ręka" />
              <span class="block-cooldown-overlay"></span>
              <div class="lock-overlay"></div>
            </button>

            <div class="skill skill-1">${renderSkillButtons(player.level, 1, 1)}</div>
            <div class="skill skill-2">${renderSkillButtons(player.level, 2, 2)}</div>
            <div class="skill skill-3">${renderSkillButtons(player.level, 3, 3)}</div>
          </div>
        </div>

        <div class="attack-slot">
          <div class="attack-wrapper right" id="right-hand" data-action="attack">
            <div class="guard-ring hidden" id="guard-ring">
             <svg viewBox="0 0 100 100" class="guard-svg">

               <!-- tło -->
               <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                stroke-width="6"
               />

               <!-- segment 1 -->
               <circle
                class="guard-segment seg-1"
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke-width="6"
                transform="rotate(-90 50 50)"
               />

               <!-- segment 2 -->
               <circle
                class="guard-segment seg-2"
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke-width="6"
                transform="rotate(-90 50 50)"
               />

               <!-- segment 3 -->
               <circle
                class="guard-segment seg-3"
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke-width="6"
                transform="rotate(-90 50 50)"
               />

             </svg>            
            </div>
            <button class="attack-button common" id="attack-button">
              <img class="shield-icon" id="attack-icon" src="${weaponUrl}" alt="Atak Prawa Ręka" />
              <div class="cooldown-overlay"></div>
              <div class="lock-overlay"></div>
            </button>
            <div class="skill skill-4">${renderSkillButtons(player.level, 4, 4)}</div>
            <div class="skill skill-5">${renderSkillButtons(player.level, 5, 5)}</div>
            <div class="skill skill-6">${renderSkillButtons(player.level, 6, 6)}</div>
          </div>
        </div>

        <!-- Miejsce na dynamiczny przycisk -->
        <div class="attack-center" id="attack-center-container" data-action="flee"></div>
      </div>

      <div class="potions-section wide common" data-action="potion">
        <div class="potions-grid">
          ${renderPotions()}
        </div>
      </div>
    `;

    dlg.dataset.initialized = "true";
  }

  const potionsSection = document.querySelector(".potions-section");
  potionsSection.innerHTML = `
    <div class="potions-grid">
       ${renderPotions()}
    </div>
  `;
  
  if(renderPotion) return;
  
  applyImageFallback(dlg);
  
  updateGuardUI(guardStacks);
  
  const shieldIcon = document.getElementById("attack-left");
  if(!playerHasShieldEquipped()) {
   // console.error("shield disabled");
    shieldIcon.classList.add(`shield-disabled`);
  } else {
    shieldIcon.classList.add(shield.klasa);
  }    
  
  const weaponIcon = document.getElementById("attack-button");
  if(weapon) {
    weaponIcon.classList.add(weapon.klasa);
  }
  
  // 🧠 Dane przeciwnika
  let enemy = null;
  const opt = gameState.world.selectedSlotIndex !== null ? gameState.world.exploreOptions[gameState.world.selectedSlotIndex] : null;

  if (opt && opt.enemyData) {
    enemy = opt.enemyData;
  } else if (opt && opt.type === "shrine" && !opt.used) {
    const s = opt.shrineData;
    enemy = {
      name: t(s.name),
      level: "-",
      maxHp: s.type === "heal" ? s.bonusAmount : "-",
      currentHp: 0,
      dmg: s.type === "attack" ? s.bonusAmount : "-",
      def: s.type === "defense" ? s.bonusAmount : "-"
    };
  } else if (opt && opt.type === "chest" && !opt.used) {
    enemy = {
      name: t(opt.chestData.name),
      level: "-",
      maxHp: "-",
      currentHp: 0,
      dmg: "-",
      def: "-"
    };
  } else if (opt && opt.type === `npc`) {
    enemy = { name: t(opt.npcData.name), level: "NPC", maxHp: "-", currentHp: 0, dmg: "-", def: "-" };
  } else {
    enemy = { name: `---`, level: "-", maxHp: "-", currentHp: 0, dmg: "-", def: "-" };
  }

  // 🔁 Aktualizacja sekcji wroga
  const enemySection = document.getElementById("combat-enemy-section");
  const hpIconUrl = assetManager.getResolvedAsset("img/icons/menu-hp-icon.png");
  const dmgIconUrl = assetManager.getResolvedAsset("img/icons/menu-dmg-icon.png");
  const defIconUrl = assetManager.getResolvedAsset("img/icons/menu-def-icon.png");
  
  enemySection.innerHTML = `
   <div class="enemy-section">
      <div class="enemy-info"><strong>${t(enemy.name)} (${t("enemy_lvl_info")} ${enemy.level})</strong></div>
      <div class="enemy-stat-group">
        <div class="enemy-stat-block" data-stat="enemy-hpstat">
          <div class="enemy-stat-icon">
            <img src="${hpIconUrl}" alt="HP" class="stat-img" />
          </div>
          <div class="enemy-stat-main">${formatStat(enemy.maxHp)}</div>
        </div>
        <div class="enemy-stat-block" data-stat="enemy-dmgstat">
          <div class="enemy-stat-icon">
            <img src="${dmgIconUrl}" alt="DMG" class="stat-img" />
          </div>
          <div class="enemy-stat-main">${formatStat(enemy.dmg)}</div>
        </div>
        <div class="enemy-stat-block" data-stat="enemy-defstat">
          <div class="enemy-stat-icon">
            <img src="${defIconUrl}" alt="DMG" class="stat-img" />
          </div>
          <div class="enemy-stat-main">${formatStat(enemy.def)}</div>
        </div>
      </div>
  
  
      <!--<div id="focus-holder"></div>-->

  
    <!--  <div id="focus-btn">${renderFocusSkillButton(player.level)}</div>-->
  
  
    </div>
  `;
  
  const focusHolder = document.getElementById("focus-holder");

  if (!focusHolder.dataset.ready) {
    focusHolder.innerHTML = renderFocusSkillButton(player.level);
    focusHolder.dataset.ready = "true";
  }
  
 /* const potionsSection = document.querySelector(".potions-section");
  potionsSection.innerHTML = `
    <div class="potions-grid">
       ${renderPotions()}
    </div>
  `;
  
  if(renderPotion) return;*/
  
  // 🧩 Dynamiczny przycisk w sekcji attack-center
  const attackCenter = document.getElementById("attack-center-container");
  attackCenter.innerHTML = ""; // czyścimy stare

  if (gameState.world.selectedSlotIndex !== null) {
    const button = document.createElement("button");
    button.className = "slot-button hidden";
    button.id = `slot-attack-button-${gameState.world.selectedSlotIndex}`;

    if (gameState.world.inCombat) {
      button.classList.remove("hidden");
      button.onclick = () => handleAttack(gameState.world.selectedSlotIndex);
    }

    attackCenter.appendChild(button);
  }

  // 🔄 Pasek życia
  /*if (world.selectedSlotIndex !== null && enemy.maxHp !== "-") {
    updateEnemyHealthBar(enemy, world.selectedSlotIndex);
  }*/
  
  //console.error(`attack-button`,  document.getElementById("attack-button"));
  dlg.classList.remove("hidden");
}


function handleAttack() {
  if (!canPerformAction(`attack`)) return;
  
  if (playerAttackCooldown.isStunActive) {
    return;
  }
  
 // console.time("attack");
  //console.error(`sprawdzam handleAttack`);
  const player = getPlayerStats();
  const enemy = gameState.world.exploreOptions[gameState.world.selectedSlotIndex]?.enemyData;
  const now = getGameTime();

  let isDefShield = false;
  
  if (gameState.combat.armorBreakTimingActive) {
    //console.error(`armor break attack`);

    /*attack(isDefShield);
    spawnEffect("basic", enemy.dom.slot);
    playHit(`enemy`);*/

    resolveArmorBreak(enemy);
    
    //return;
  }
  
  if (enemy.armorBreakReady) {
    showArmorBreakTimingUI(enemy, player);
    gameState.combat.armorBreakTimingActive = true;
    return;
  }
  
  if (gameState.combat.bleedTimingActive) {
    handleBleedAttack(enemy, player);
    
   /* attack(isDefShield);
    spawnEffect("basic", enemy.dom.slot);
    playHit(`enemy`);*/

    //return;
  }
  
  if (enemy.bleedReady) {
    enemy.lastBleedHit = getGameTime();
    showBleedTimingUI(player);
    gameState.combat.bleedTimingActive = true;
    return;
  }

  //console.error(`sprawdzam handleAttack`);

  if (now < playerAttackCooldown.playerCooldownEnd) {
    //console.log("Atak zablokowany – cooldown trwa");
    return;
  }
  
  //updateFatigue();
  const atkSpeed = getPlayerAttackSpeed();
  let cooldownDuration = calculatePlayerCooldown(atkSpeed);

  if (gameState.combat.playerBlock.active && gameState.combat.playerBlock.mode === "defensive") {
    const { atkSpd: penaltyAtkSpeed } = computeShieldPenalties(player.blockPower, atkSpeed);
    //cooldownDuration = penaltyCooldown;
    cooldownDuration = calculatePlayerCooldown(penaltyAtkSpeed);
    isDefShield = true;
    //console.error("Atak spowolniony przez Postawę Obronną, befor, after", cooldownDuration, atkSpeed, penaltyAtkSpeed);
    //console.error("getAttackSpeedPenaltyPercent", getAttackSpeedPenaltyPercent(calculateCooldown(atkSpeed), calculateCooldown(penaltyAtkSpeed)));
    //console.error(`Obrazenia zmniejszone o %`, lerp(0.2, 0.35, player.blockPower));
  }
  
  if(gameState.resources.staminaState.current <= 0) {
    cooldownDuration = calculatePlayerCooldown(atkSpeed * 0.7);
  }
  
  if(gameState.combat.playerMark.isActive) {
    const value = gameState.combat.playerMark.atkspd;
    const atkspdDebuff = 1 - value;
    cooldownDuration = calculatePlayerCooldown(atkSpeed * atkspdDebuff);
   // console.error(`atkspdDebuff while player is marker, cooldownDuration, atkspdDebuff`, cooldownDuration, atkspdDebuff);
  }

  
  //console.error(`common break attack`);

  //playPlayerAnimation("attack");
  
  attack(isDefShield);
  spawnEffect("basic", enemy.dom.slot);
  playHit(`enemy`);
  //console.error(`cooldownDuration in handle attack`, cooldownDuration, atkSpeed);
  
  if (!enemy.armorBreakReady) {
   // console.error(`start atack cooldown`);

    startAttackCooldown(cooldownDuration);
    //return;
  }

  //startAttackCooldown(cooldownDuration);
  
  // zapisz czas końca cooldownu
  playerAttackCooldown.playerCooldownEnd = now + cooldownDuration * 1000;
}


function handleShieldAction() {
 // console.error(`enter handleShieldAction`);
  const combat = gameState.combat;
  const now = getGameTime();
  const playerBlock = combat.playerBlock;

  // 🔴 KLUCZ: blokada na poziomie logiki
  if (playerBlock.cooldownUntil > now) {
    return;
  }
  
  if (!canPerformAction(`block`)) return;
  const blockButton = document.getElementById("attack-left");
  //const blockButton = document.getElementById("attack-left").querySelector(".attack-button");
  //combat.flags.isBlocked = false;
  
 // console.error(`enter shield`);
  
  if (combat.playerBlock.active) {
    //console.error(`player.block.mode`, combat.playerBlock.mode);
    // jeśli aktywna postawa obronna → wyłącz
    if (combat.playerBlock.mode === "defensive") {
      deactivateDefensiveStance();
      blockButton.classList.add(`cooldown`);
    }
    return;
  }

  // wybór trybu (np. z UI / ustawień gracza)
  if (combat.playerBlock.mode === "defensive") {
    if(combat.flags.isCritical) {
      executeTimedBlock();
    } else {
      activateDefensiveStance();
    }
    
    //blockButton.classList.add(`active`);
    blockButton.classList.add(`turtle`);
   // console.error(`na cooldownie`);
  } else if (combat.playerBlock.mode === "timed" && perfectBlockTimingActive) {
    if(!spendStamina(STAMINA_COST.TIMED_BLOCK)) return;
    //activateTimedBlock();
    executeTimedBlock();
    //blockButton.classList.add(`timed`);
  }
}

function endTimedBlock(result, cooldown) {
  const shieldBtn = document.getElementById("attack-left");
  //const shieldBtn = document.getElementById("attack-left").querySelector(".attack-button");
  let playerBlock = gameState.combat.playerBlock;
  
  playerBlock.active = false;
  playerBlock.activePaused = false;
  playerBlock.activeRemaining = 0;
  playerBlock.lastResult = result;
  playerBlock.cooldownUntil = getGameTime() + cooldown;
  playerBlock.cooldown = cooldown;
  
  stopTimedBlockUI();
  
  //if(shieldBtn) shieldBtn.classList.remove("timed");

  //console.log(`🛡️ Timed Block zakończony: ${result}`);
}

function updateBlockState() {
  //const shieldBtn = document.getElementById("attack-left");
  let playerBlock = gameState.combat.playerBlock;
  
  if (
    playerBlock.mode === "timed" &&
    playerBlock.active &&
    !playerBlock.activePaused && // 🔥 KLUCZ
    getGameTime() > playerBlock.endTime
  ) {
    showOutcome("miss", `${t("miss_outcome")}`);
    endTimedBlock("miss", 3500);
    
    reducePerfectBlockChain(playerBlock);
    
    if(gameState.combat.perfectChainStacks) {
      gameState.combat.perfectChainStacks = 0;
    }
  }
  
}

function restoreCombat() {
 /* const enemy = exploreOptions[selectedSlotIndex].enemyData;
  
  startEnemyAutoAttack(enemy, selectedSlotIndex);*/
  lockOtherActions(gameState.world.selectedSlotIndex);
  renderCombat();
  //renderOptions();
}

function addExp(amount) {
  const character = gameState.char;
  let levelUpPrefix = "";

  // Ustawienia domyślne, jeśli nie istnieją
  if (!character.level) character.level = 1;
  if (!character.experience) character.experience = 0;
  if (!character.expToNextLevel) character.expToNextLevel = 125;
  if (!character.skillPoints) character.skillPoints = 0; // 🔹 nowy atrybut

  character.experience += amount;

  // Level Up – dopóki mamy więcej exp niż potrzeba
  while (character.experience >= character.expToNextLevel) {
    character.experience -= character.expToNextLevel;
    character.level += 1;
    character.expToNextLevel = Math.round(character.expToNextLevel * 1.7); // rosnące wymagania
    character.skillPoints += 1; // 🔹 dodajemy punkt umiejętności
   // console.log("skillPoints addExp", character.skillPoints);
    levelUpPrefix = `Awansowałeś na ${character.level} poziom! (+1 punkt umiejętności)`;
   // console.error("availableAttributePoints addExp", character.availableAttributePoints);
   
    character.availableAttributePoints += 5;
    
    showLevelUpPopup();
    
    updateCharMenuIcon();         
    updateSkillsMenuIcon();
    
    const { maxHp } = calculateTotalStats(character.equipment || {});
    character.hp = maxHp;
    //character.lastRegenTs = Date.now();
    
    renderHpBar(character.hp, maxHp);
  }

  saveGame();
  
  // Aktualizacja UI
  const percent = Math.min(125, Math.round(100 * character.experience / character.expToNextLevel));
  document.getElementById("exp-bar").style.width = percent + "%";
  document.getElementById("exp-label").textContent = `${character.experience} / ${character.expToNextLevel}`;
  
  return levelUpPrefix;
}


let fleeIsSet = false;
let fleeBtn;

function setupFleeButton() {
  const player = getPlayerStats();
  const enemy = gameState.world.exploreOptions[gameState.world.selectedSlotIndex]?.enemyData;
  const penaltyPercent = calculateGoldLossOnFlee(player);
  const gold = parseInt(gameState.resources.gold, 10);
  const loss = Math.floor(gold * penaltyPercent);
  
  //console.log(`enter setupFleeButton`);
  // pobieramy już istniejący przycisk z HTML
  fleeBtn = document.getElementById(`slot-attack-button-${gameState.world.selectedSlotIndex}`);
  if (!fleeBtn) return;// console.warn("Brak przycisku flee w HTML!");

  // ustaw ikonę
  if (!fleeBtn.querySelector("img")) {
    const fleeIconUrl = assetManager.getResolvedAsset("img/buttons/flee-icon.png");

    const fleeIcon = document.createElement("img");
    fleeIcon.className = "flee-icon";
    fleeIcon.src = `${fleeIconUrl}`;
    fleeBtn.appendChild(fleeIcon);
  }
  
    // przypisz zachowanie po kliknięciu
  fleeBtn.onclick = (e) => {
    playSound(`open`, 0.4);

    e.stopPropagation(); 
    showCustomConfirm(
    `${t("flee_cost1")} <span style="color:red;"> ${loss}${t("flee_cost2")}</span>${t("flee_cost3")}<span style="color:#0096FF;">${t("flee_cost4")}</span> \n ${t("flee_cost5")}`,
    () => { 
      attemptFlee();
      resumeAllSkillsCooldown();
      resumeCombat();
      gameState.resources.staminaState.disabled = false; 
      saveGame(); 
    },
    () => { 
      resumeEnemyAttack(enemy, gameState.world.selectedSlotIndex);
      resumeAllSkillsCooldown(); 
      resumeCombat();
      resumeTimedBlockUI();
      resumeBleedUI();
      resumeSpearUI();
      dotIsPaused = false;
      gameState.resources.staminaState.disabled = false;
      saveGame(); 
    }
    );
  };
  
  //resumePlayerAttack(); 
  //resumeDefensiveCooldown();
  
  // na start ukryty
  fleeBtn.classList.add("hidden");
  fleeIsSet = true;
}

function showFleeButton() {
  if (fleeBtn && fleeBtn.classList.contains("hidden")) {
    fleeBtn.classList.remove("hidden");
    //fleeBtn.classList.add("visible");
   // console.log("Flee button shown", fleeBtn);
  }
}

function hideFleeButton() {
  if (fleeBtn) {
    //fleeBtn.classList.remove("visible");
    fleeBtn.classList.add("hidden");
   // console.log(`chowam fleeBtn`, fleeBtn);
  }
  fleeIsSet = false;
}

function resetSlotActionButton(i) {
  const btn = document.getElementById(`slot-attack-button-${i}`);
  if (!btn) return;

  btn.innerHTML = "";          // 💥 usuwa stare ikony
  btn.onclick = null;          // 💥 resetuje klik
  btn.className = "slot-button";
}

function calculateReducedEnemyDamage(damage, enemy, player, scaling = 0.2) {
    
  const roll = Math.random() * 100;
  const dodgeRoll = Math.random() * 100;
  if(!gameState.combat.playerBlock.lastResult) {
    let dodgeValue = player.dodge;
 
    if(gameState.combat.critBonus.dodgeBonus.isActive) {
      const dodgeBonus = gameState.char.combatAffixes[`crit_grant_dodge`]?.value;
      dodgeValue = getDodgeWithBonus(player.dodge, dodgeBonus);
      //console.log(`dodgeValue after crit`, dodgeValue);

      //dodgeValue = player.dodge + dodgeBonus;
    }
    
    if(dodgeRoll < dodgeValue) {
      const dodgeCostReduce = player.dodgeCostReduce;
      if(spendStamina(STAMINA_COST.DODGE * (1 - dodgeCostReduce))) {
        showOutcome("dodge", `${t("dodge_outcome")}`);
        
        if(!whirlwindState.isActive) { 
          playPlayerAnimation("dodge");
        }
    
        if(gameState.char.combatAffixes[`dodge_grant_crit`]) {
          const critChance = gameState.char.combatAffixes[`dodge_grant_crit`].value;
          gameState.combat.dodgeBonus.critBonus.expiresAt = getGameTime() + 4000;
          gameState.combat.dodgeBonus.critBonus.isActive = true;
          
          gameState.combat.activeBonus.critSources.dodge = critChance;
          recalculateCritBonus();
        }
        
        if(gameState.char.combatAffixes[`dodge_grant_energy`]) {
          const energyGain = gameState.char.combatAffixes[`dodge_grant_energy`].value;
          gainEnergy(energyGain);
          //showReward(`+${(energyGain).toFixed(1)} ${t("to_energy_reward")}`, 2300);
          showEnergyGain(energyGain);
        }
        
        if(gameState.char.combatAffixes[`atkspd_after_dodge`] && !gameState.combat.dodgeBonus.atkSpdBonus.isActive) { 
          gameState.combat.dodgeBonus.atkSpdBonus.isActive = true;
          gameState.combat.dodgeBonus.atkSpdBonus.expiresAt = getGameTime() + 4000;
          const atkSpdBonus = gameState.char.combatAffixes[`atkspd_after_dodge`].value;
          gameState.combat.activeBonus.atkSpd += atkSpdBonus;
          
          updateStatusPlayerUI(enemy);
        }
        
        if(gameState.char.combatAffixes[`stamina_cost_after_dodge`]) {
          gameState.combat.dodgeBonus.staminaBonus.expiresAt = getGameTime() + 4000;
          gameState.combat.dodgeBonus.staminaBonus.isActive = true;
        }
     
        
        return {
          isDodge: true,
          dmg: 0
        };
      } else showOutcome("dodge", `${t("miss_failed_attack")}`);
    
    }
  }
  
  // 1️⃣ Armor (physical only)
  //console.log(`player def before`, player.def);
  
  let baseArmor = player.def;
  
  if(gameState.char.combatAffixes[`perfect_block_gain_def`]) {
    const gainedDef = gameState.char.combatAffixes[`perfect_block_gain_def`].value;
    baseArmor = getArmorWithBonus(baseArmor, gainedDef);
  }
  
  if(gameState.char.combatAffixes[`defensive_stance_gain_def`]) {
    const gainedDef = gameState.char.combatAffixes[`defensive_stance_gain_def`].value;
    baseArmor = getArmorWithBonusWhileBlock(baseArmor, gainedDef);
   // console.error(`gainedDef, blocking`, gainedDef);
  }
  
  if(gameState.char.combatAffixes[`def_per_guard_stack`]) {
    const gainedDef = gameState.char.combatAffixes[`def_per_guard_stack`].value;
    const stacks = gameState.combat.guardBonus.defBonus.stacks;
    baseArmor *= (1 + (gainedDef / 100) * stacks);
   // console.error(`gainedDef, guard stacks`, gainedDef, stacks, baseArmor);
  }
  
  const isExhausted = gameState.resources.staminaState.fatigue === "exhausted" || gameState.resources.staminaState.fatigue === "critical";

  if(isExhausted && gameState.char.combatAffixes[`def_exhausted`]) {
    const gainedDef = gameState.char.combatAffixes[`def_exhausted`].value;
    baseArmor *= 1 + (gainedDef / 100);
   // console.error(`gainedDef exhauted`, gainedDef);
  }
  
  if(gameState.char.combatAffixes[`def_per_sec_while_blocking`]) {
    const gainedDef = gameState.combat.guardBonus.defBonus.accumulate;
    baseArmor *= 1 + (gainedDef / 100);
    //console.error(`gainedDef def/sec`, gainedDef, baseArmor);
  }

  if(enemy?.armorBreak?.value && gameState.char.combatAffixes[`def_after_armor_break`]) {
    const gainedDef = gameState.char.combatAffixes[`def_after_armor_break`].value;
    baseArmor *= 1 + (gainedDef / 100);
    //console.error(`gainedDef while armor break`, gainedDef, baseArmor);
  }

  if(gameState.combat.flags.isLowHp && gameState.char?.combatAffixes[`gain_def_below_hp`]) {
    const defBelowHp = 1 + (gameState.char.combatAffixes[`gain_def_below_hp`].value / 100);
    baseArmor *= 1 + (defBelowHp / 100);
    //console.error(`defBelowHp`, defBelowHp, baseArmor);
  }

  
 // console.log(`player def after`, baseArmor);

  let effectiveArmor = getArmorReduction(baseArmor, enemy.level);
  
  //console.error(`player.effectiveArmor`, effectiveArmor);
  
  effectiveArmor = getArmorWithStacks(effectiveArmor, player.stackDefense?.stack / 100);
  
  //console.error(`player.effectiveArmor`, effectiveArmor);
 
  const stackArmor = gameState.combat.armorStacks.stacks;
  
  if(gameState.combat.armorStacks.stacks > 0) {
    showReward(`+${(stackArmor * player.stackDefense.stack).toFixed(0)}% ${t("stack_defense_reward")} x${gameState.combat.armorStacks.stacks}`);
  }  
  
  let dmg = damage * (1 - effectiveArmor);
  
  //console.log(`enemy dmg after player def`, dmg);
  
  // 2️⃣ Redukcje procentowe
  const physRed = (player.physDmgReduction || 0) / 100;
  
  //console.log(`player.physDmgReduction`, player.physDmgReduction);
  
  //console.log(`physRed`, physRed);
  
  // 3️⃣ Zastosowanie redukcji
  dmg *= (1 - physRed);
  
  if(gameState.char.combatAffixes[`dmg_reduced_while_control`] && enemy.spear?.stackControl) {
    const reducedDmg = gameState.char.combatAffixes[`dmg_reduced_while_control`].value;
    dmg *= 1 - (reducedDmg / 100);
    //console.error(`reducedDmg, dmg`, reducedDmg, dmg);
  }
  
  if(gameState.char.combatAffixes[`dmg_taken_after_break`] && gameState.combat.poiseBonus.dmgTakenBonus.isActive) {
    const value = gameState.char.combatAffixes[`dmg_taken_after_break`].value;
    const reducedDamage = 1 - (value / 100);
    dmg = getReducedDamageAfterBreak(dmg, reducedDamage);
    //console.error(`reduced dmg after break, reducedDamage value`, dmg, reducedDamage);
  }

  if(gameState.char.combatAffixes[`bleed_enemy_deal_less_damage`] && enemy?.bleed) {
    const value = gameState.char.combatAffixes[`bleed_enemy_deal_less_damage`].value;
    const reducedDamage = 1 - (value / 100);
    dmg *= reducedDamage;
    //console.error(`reduced dmg while enemy bleed, reducedDamage, value`, dmg, reducedDamage);
  }

  
  
  
  //console.log(`enemy dmg after all reduction`, dmg);
  
  dmg = applyIronStanceReduction(dmg, player.dmgReduction?.cooldown * 1000);
  
  
  if(gameState.combat.playerMark.isActive) {
    const value = gameState.combat.playerMark.dmgTaken;
    const increasedDamage = 1 + value;
    dmg *= increasedDamage;
   // console.error(`increased dmg while player is marker, dmg, increasedDamage`, dmg, increasedDamage);
  }

  
  //console.error(`applyIronStanceReduction`, dmg);
  
  return {
    isDodge: false, 
    dmg: Math.max(1, Math.round(dmg))
  };
}

function calculateReducedPlayerDamage(playerDmg, player, enemy, scaling = 0.2) {
  //console.log(`player dmg i enemy def`, playerDmg, enemy.name, enemy?.def);
  
  let effectiveArmor = getArmorReduction(enemy.def, player.level);
 // console.log(`enemy.effectiveArmor`, effectiveArmor);
  
  if (enemy.armorBreak?.value) {
    effectiveArmor *= (1 - enemy.armorBreak.value);
    //console.error(`enemy.armorBreak`, effectiveArmor);
  }
  
  
  /*if (gameState.combat.stats.nextHitPenetration) {
    effectiveArmor *= (1 - gameState.combat.stats.nextHitPenetration);
    gameState.combat.stats.nextHitPenetration = 0;
    console.error(`longsword armorBreak`, effectiveArmor);
    showReward("ZŁAMANA OBRONA -25%");
    triggerRingFull();
    triggerRingBurst();
    setTimeout(() => {
        resetGuardRing();
    }, 300);
  }*/
  
  //console.log(`enemy.effectiveArmor`, effectiveArmor);

  let dmg = playerDmg * (1 - effectiveArmor);
  
  
  if(gameState.combat.enemyDmgReduction.isActive) {
    const reducedDmg = gameState.combat.enemyDmgReduction.value;
    dmg *= 1 - (reducedDmg / 100);
    //console.log(`smoke bomb reducedDmg`, gameState.combat.enemyDmgReduction.value);
  }
  
  //console.error(`player dmg after enemy def`, dmg);
  
  /*const physRed = (enemy.physDmgReduction || 0) / 100;
  const allRed = (enemy.allDmgReduction || 0) / 100;

  const totalReduction =
    1 - (1 - physRed) * (1 - allRed);

  dmg *= (1 - totalReduction);*/

  return Math.max(1, Math.round(dmg));
}


function applyCritDamage(baseDamage, player, noCrit = false) {
  const combat = gameState.combat;
  let rawCritChance = player.crit;
  
  const enemy = gameState.world.exploreOptions[gameState.world.selectedSlotIndex]?.enemyData;

  if(enemy.vulnerable){
    rawCritChance += 25;
  }
  
  if(gameState.combat.weakPoint.isActive) {
    rawCritChance += gameState.combat.weakPoint.crit;
  }
  
  if(gameState.combat.bloodPact.isActive) {
    rawCritChance += gameState.combat.bloodPact.crit;
  }
 
  
  const precisionCritFactor = 1 + (gameState.combat.perfectChainBlock.crit / 100);
  rawCritChance *= precisionCritFactor;
  
  if(gameState.char.combatAffixes[`dodge_grant_crit`]) {
    const critBonus = gameState.char.combatAffixes[`dodge_grant_crit`].value;
    //console.warn(`rawCritChance before dodge`, rawCritChance);
    rawCritChance = getCritWithBonus(rawCritChance, critBonus);
    //console.warn(`rawCritChance after dodge`, rawCritChance);
  }
  
 // console.log(`raw crit chance before`, rawCritChance);

  if(gameState.char.combatAffixes[`crit_per_guard_stack`]) {
    const critBonus = gameState.char.combatAffixes[`crit_per_guard_stack`].value;
    const critStacks = gameState.combat.guardBonus.critBonus.stacks;
    rawCritChance += critBonus * critStacks;
    
   // console.log(`raw crit chance after guard`, rawCritChance, critBonus, critStacks);
  }                
  
  if(gameState.char.combatAffixes[`crit_after_break`] && gameState.combat.poiseBonus.critBonus.isActive) {
    const critBonus = gameState.char.combatAffixes[`crit_after_break`].value;
    rawCritChance = getCritWithBonusAfterBreak(rawCritChance, critBonus);
    //console.log(`raw crit chance after break`, rawCritChance, critBonus);
  }
  
  
  const isExhausted = gameState.resources.staminaState.fatigue === "exhausted" || gameState.resources.staminaState.fatigue === "critical";
   
  if(isExhausted && gameState.char.combatAffixes[`crit_exhausted`]) {
    const critBonus = gameState.char.combatAffixes[`crit_exhausted`].value;
    rawCritChance += critBonus;
    //console.log(`raw crit chance after exhausted`, rawCritChance, critBonus);
  }                

  if(gameState.char.combatAffixes[`crit_while_energy_fatique`] && gameState.combat.energyBonus.critBonus.isActive) {
    const critBonus = gameState.char.combatAffixes[`crit_while_energy_fatique`].value;
    rawCritChance += critBonus;
    //console.log(`raw crit chance after energy fatique`, rawCritChance, critBonus);
  }
  
  if(gameState.char.combatAffixes[`crit_while_bleed`] && enemy.bleed) {
    const critBonus = gameState.char.combatAffixes[`crit_while_bleed`].value;
    rawCritChance += critBonus;
    //console.log(`raw crit chance after bleed`, rawCritChance, critBonus);
  }

  if(gameState.char.combatAffixes[`crit_per_control_stack`] && gameState.combat.controlBonus.critBonus.isActive) {
    const critBonus = gameState.combat.controlBonus.critBonus.accumulate;
    rawCritChance += critBonus;
    //console.log(`raw crit chance after control`, rawCritChance, critBonus);
  }

  if(gameState.char.combatAffixes[`crit_missing_hp`]) {
    const char = gameState.char;
    const critBonus = gameState.char.combatAffixes[`crit_missing_hp`].value;
    const missHp = char.maxHp - char.hp;
    //const critMultiplier = (missHp / char.maxHp) * 100;
    const missingRatio = missHp / char.maxHp;
    //const stacks = Math.floor(critMultiplier / 10);

    //rawCritChance += critBonus * stacks;
    rawCritChance += critBonus * (missingRatio * 10);

    //console.log(`raw crit chance after missHp, critMultiplier, stacks, missHp`, rawCritChance, critMultiplier, stacks, missHp);
    //console.log(`raw crit chance after missHp, missingRatio, missHp`, rawCritChance, missingRatio, missHp);
  }
  
  if(gameState.char.combatAffixes[`crit_vs_armor_break`] && enemy?.armorBreak?.value) {
    const critBonus = gameState.char.combatAffixes[`crit_vs_armor_break`].value;
    rawCritChance += critBonus;
    //console.log(`raw crit chance after armor break`, rawCritChance, critBonus);
  }


  
  const effectiveCritChance = getEffectiveCritChance(rawCritChance);
  const roll = Math.random() * 100;
  let critBonusPercent = player.critDmg;
  
  //console.log(`raw crit chance and damage`, rawCritChance, critBonusPercent);
  //console.log(`effectiveCritChance and damage`, effectiveCritChance, critBonusPercent);
  
  if(!noCrit) {
    //combat.playerBlock.nextAttackGuaranteedCrit = true;
    if (roll <= effectiveCritChance || combat.playerBlock.nextAttackGuaranteedCrit) {
      
      if(combat.playerBlock.nextAttackGuaranteedCrit) {
        critBonusPercent = getCritBonus(player.blockPower) * 100;
      }
      
      let critMultiplier = 1 + critBonusPercent / 100;
      
      if (getStaminaRatio() <= 0) {
        critMultiplier *= 0.6;
      }
      
      if(enemy.vulnerable){
        critMultiplier *= 1.25;
      }
      
      if(gameState.combat.weakPoint.isActive) {
        critMultiplier *= gameState.combat.weakPoint.critDmg;
        
        addWeaponMasteryExp(`duelist`, 5, `weak-point-crit`);
      }
      
      const precisionCritDmgFactor = 1 + (gameState.combat.perfectChainBlock.critDmg / 100);
      critMultiplier *= precisionCritDmgFactor;
      
     // console.log(`critBonusPercent`, critBonusPercent, critMultiplier);

      onCrit();
      
      if(gameState.char.combatAffixes[`stamina_on_crit`]) {
        const staminaGained = gameState.char.combatAffixes[`stamina_on_crit`].value;
        gainStamina(staminaGained);
        //showReward(`+${staminaGained.toFixed(0)} ${t("stamina_on_kill_reward")}`, 2100);
        showStaminaPopup(staminaGained);
      }

      if(gameState.char.combatAffixes[`crit_grant_dodge`]) {
        gameState.combat.critBonus.dodgeBonus.expiresAt = getGameTime() + 4000;
        gameState.combat.critBonus.dodgeBonus.isActive = true;
      }

      if(gameState.char.combatAffixes[`armor_break_on_crit`]) {
        const value = gameState.char.combatAffixes[`armor_break_on_crit`].value;
        const armorBreakRoll = Math.random() * 100;
        
        if(armorBreakRoll < 99) {
          let powerBonus = 1;
          if(gameState.char.combatAffixes[`armor_break_effect`]) {
            powerBonus = 1 + (gameState.char.combatAffixes[`armor_break_effect`].value / 100);
          }

          applyArmorBreak(enemy, 0.25, 3);
          //showReward(`-${(25 * powerBonus).toFixed(1)}% ${t("break_defense_reward")}`, 2300);
        }
       }

      
      
     // console.error(`baseDamage and critMultiplier`, baseDamage, critMultiplier);
      combat.playerBlock.nextAttackGuaranteedCrit = false;
      
      playSound(`crit`, 0.4);
      
      //const enemy = gameState.world.exploreOptions[gameState.world.selectedSlotIndex]?.enemyData;

      spawnEffect("crit", enemy.dom.slot);
      
      return {
        damage: Math.floor(baseDamage * critMultiplier),
        isCrit: true,
        critMultiplier
      }; 
    }
  }
  
  return {
    damage: Math.floor(baseDamage),
    isCrit: false,
    effectiveCritChance
  };
}

function startBlock() {
  let staminaState = gameState.resources.staminaState;
  
//  console.error("startBlock staminaState.disabled", staminaState.disabled);

  if (staminaState.disabled) return;

  isBlocking = true;

  lockActions({ duration: 200, reason: "block", allow: [`attack`, `potion`, `block`] });
  
  playSound(`turtle-up`, 1.3, 1, 0.4);
  
  skillsOff(); 
  
    
  if(gameState.char.combatAffixes[`defensive_stance_gain_def`]) {
    const gainedDef = gameState.char.combatAffixes[`defensive_stance_gain_def`].value;
    //console.error(`start def while blocking`);
    gameState.combat.blockingBonus.defBonus.isActive = true;
    //gameState.combat.activeBonus.def += gainedDef;
    //showBuff(`def`, gameState.combat.activeBonus.def);
    gameState.combat.activeBonus.defSources.defensiveStance = gainedDef;
    recalculateDefenseBonus();
  }
  
  blockDrainInterval = setInterval(() => {
    if (!isBlocking) return;
    
    if(staminaState.disabled) return;
    
    if(gameState.char.combatAffixes[`def_per_sec_while_blocking`]) {
      const defBonus = gameState.char.combatAffixes[`def_per_sec_while_blocking`].value;// / 10;
      //console.log(`defBonus per sec`, defBonus);
      gameState.combat.guardBonus.defBonus.accumulate += defBonus;
      
      gameState.combat.activeBonus.defSources.perSecBlock = gameState.combat.guardBonus.defBonus.accumulate;
      recalculateDefenseBonus();
      //console.log(`defBonus per sec total before stop`, gameState.combat.guardBonus.defBonus.accumulate);
    }

    
   /* staminaState.current -= staminaState.blockDrainPerSecond / 10;

    if (staminaState.current <= 0) {
      staminaState.current = 0;
      deactivateDefensiveStance();
      //stopBlock();
      triggerStaminaBreak();
    }

    staminaState.lastSpendTs = performance.now();*/
    //saveStamina();
  }, 1000);
}

function stopBlock() {
  isBlocking = false;

  unlockCriticalActions();
  
  playSound(`turtle-down`, 1.4, 1, 0.4);
  
  skillsOn();
  
  if(gameState.char.combatAffixes[`defensive_stance_gain_def`]) {
    gameState.combat.blockingBonus.defBonus.isActive = false;
   // console.log(`stop def while blocking`);
  
    const value = gameState.char.combatAffixes["defensive_stance_gain_def"].value;
    //decreaseBonusDefBuff(value);
    
    gameState.combat.activeBonus.defSources.defensiveStance = 0;
    recalculateDefenseBonus();
     
    clearAllDiffs(`def`);
  }
  
  if(gameState.char.combatAffixes[`def_per_sec_while_blocking`]) {
    //console.log(`defBonus per sec total after stop`, gameState.combat.guardBonus.defBonus.accumulate);
    //decreaseBonusDefBuff(gameState.combat.guardBonus.defBonus.accumulate);
    
    gameState.combat.activeBonus.defSources.perSecBlock = 0;
    recalculateDefenseBonus();
    
    gameState.combat.guardBonus.defBonus.accumulate = 0;
    clearAllDiffs(`def`);
  }

  gameState.combat.counterStrike.isActive = false;
  
  if (blockDrainInterval) {
    clearInterval(blockDrainInterval);
    blockDrainInterval = null;
    saveStamina();
  }

  gameState.resources.staminaState.lastSpendTs = performance.now();
}

function drainStamina(delta) {
    
    if (!isBlocking) return;
  
    let staminaState = gameState.resources.staminaState;

    if(staminaState.disabled) return;
    
    if(gameState.combat.lastBastion.isActive) return;
  
   /* if(gameState.char.combatAffixes[`def_per_sec_while_blocking`]) {
      //gameState.combat.poiseBonus.atkSpdBonus.isActive = true;
      const defBonus = gameState.char.combatAffixes[`def_per_sec_while_blocking`].value;// / 10;
      //console.log(`defBonus per sec`, defBonus);
      //gameState.combat.activeBonus.def += defBonus;
      gameState.combat.guardBonus.defBonus.accumulate += defBonus * delta;
      //showBuff("def", gameState.combat.activeBonus.def);
      
      gameState.combat.activeBonus.defSources.perSecBlock = gameState.combat.guardBonus.defBonus.accumulate;
      //recalculateDefenseBonus();
      //console.log(`defBonus per sec total before stop`, gameState.combat.guardBonus.defBonus.accumulate);
    }*/
  
    //gameState.combat.counterStrike.isActive = true;
  
    staminaState.current -= staminaState.blockDrainPerSecond * delta * gameState.combat.ironWill.cost;// / 10;

    //console.log(`drain stamina`, gameState.combat.lastBastion.isActive);

  
    if (staminaState.current <= 0) {
      staminaState.current = 0;
      deactivateDefensiveStance();
      //stopBlock();
      triggerStaminaBreak();
    }

    staminaState.lastSpendTs = performance.now();
    //saveStamina();

}

function activateDefensiveStance() {
  const stats = gameState.combat.stats;
  const now = getGameTime();
  const player = getPlayerStats();
  let playerBlock = gameState.combat.playerBlock;
  
  if (playerBlock.cooldownUntil > now) return;
  //if (!playerHasStamina()) return;

  gameState.combat.activeRingMode = `guard`;
  stats.combo = 0;
  stats.comboReady = false;
  stats.nextHitMultiplier = 0;

  const { attackPenalty: penaltyDmg } = computeShieldPenalties(player.blockPower);

  const minusValue = (0 - 1) + (1 - penaltyDmg);
  
  showPercentDebuff(`dmg`, minusValue * 100); 
  
  resetGuardRing();
  
  startBlock();
  
  playerBlock.active = true;
  playerBlock.mode = "defensive";

  //playerBlock.damageReduction = rollDefensiveReduction();
  
  const timedBlockReduction = getTimedBlockReduction(player.blockPower);
  const finalBlockReduction = getStaminaNormalBlockReduction(timedBlockReduction);
  
  const damageReduction = getDefensiveBlockReduction(player.blockPower);
  
  showOutcome("normal",  `${t("turtle_outcome")}`);
  showReward(`${(damageReduction * 100).toFixed(0)}% ${t("dmg_reduction_reward")}`);
  
  if (gameState.char.combatAffixes[`loh_while_blocking`]) {
    gameState.combat.blockingBonus.lohBonus.isActive = true;
  }

  if (gameState.char.combatAffixes[`bleed_duration_while_blocking`]) {
    gameState.combat.blockingBonus.bleedBonus.isActive = true;
  }
  
  
  /*if(!combatState.isCritical) {
    lockActions({ duration: 230, reason: "block", allow: [] });
  }*/
  
 // console.error("Postawa Obronna AKTYWNA");
}

function deactivateDefensiveStance() {
  const blockButton = document.getElementById("attack-left");
  //const blockButton = document.getElementById("attack-left").querySelector(".attack-button");
  let playerBlock = gameState.combat.playerBlock;
  
  stopBlock();
  
  showPercentDebuff(`dmg`, 0); 

  //gameState.combat.activeRingMode = ``;
  
  gameState.combat.lastBastion.isActive = false;
  
  playerBlock.active = false;
  //playerBlock.mode = null;
  
  const COOLDOWN = 3000;
  playerBlock.cooldownUntil = getGameTime() + COOLDOWN;
  //playerBlock.cooldownRemaining = COOLDOWN;
  //playerBlock.cooldownPaused = false;
  
  //blockButton.classList.remove(`active`);
  blockButton.classList.remove(`turtle`);

  if (gameState.char.combatAffixes[`loh_while_blocking`]) {
    gameState.combat.blockingBonus.lohBonus.isActive = false;
  }
  
  if (gameState.char.combatAffixes[`bleed_duration_while_blocking`]) {
    gameState.combat.blockingBonus.bleedBonus.wasAdded = false;
    gameState.combat.blockingBonus.bleedBonus.isActive = false;
  }

  
  //console.error("Postawa Obronna WYŁĄCZONA");
}

const TIMED_DURATION = 600;
const PERFECT_START = 200;//200
const PERFECT_END = 320;//320
const PERFECT_CENTER = TIMED_DURATION / 2; 

function executeTimedBlock() {
  //console.error(`enter execute timed block, isCritical`, perfectBlockTimingActive, gameState.combat.flags.isCritical);

  if(!perfectBlockTimingActive) return;

  //console.error(`after return execute timed block`, gameState.combat.flags.isCritical);
  
  const blockButton = document.getElementById("attack-left");
  
  const enemy = gameState.world.exploreOptions[gameState.world.selectedSlotIndex]?.enemyData;
  //const result = executeEnemyIntent(enemy);
  
  let playerBlock = gameState.combat.playerBlock;
  
  const now = getGameTime();
  
  //if (playerBlock.cooldownUntil > now) return;
  
 // console.error(`executed timed block`);
  const player = gameState.char;

  //const blockButton = document.getElementById("attack-left");

  playerBlock.mode = "timed";
  playerBlock.active = true;
  playerBlock.activePaused = false;

  /*playerBlock.startTime = now;
  playerBlock.endTime = now + TIMED_DURATION;
  playerBlock.lastResult = null;
  playerBlock.activeRemaining = TIMED_DURATION;*/
  
  if (gameState.combat.flags.isCritical) {
    performEnemyFinisherAttack(enemy, gameState.world.selectedSlotIndex);
  } else {
    enemy.attackState.result = executeEnemyIntent(enemy);
    //console.error(`enemy state dmg multiplier`, enemy.attackState.result.dmgMultiplier);
    
    if (enemy.attackState.result.type === "skill") {
        //console.error(`state.result.type (skill)`, state.result.type);
        executeEnemySkill(
          enemy,
          enemy.intent.skillId
        );
      } else {
        performIntentAttack(enemy, gameState.world.selectedSlotIndex, {multiplier: enemy.attackState.result.dmgMultiplier});
      }
  }
  
  //blockButton.classList.add(`timed`);

  if(!gameState.combat.flags.isCritical) {
    lockActions({ duration: 230, reason: "block", allow: [] });
  }

}

function activateTimedBlock() {
  //if (!canPerformAction()) return;
  //console.error(`enter activate timed block`, gameState.combat.playerBlock.cooldownUntil > getGameTime());
  
  const player = gameState.char;
  const totalDuration = TIMED_DURATION * gameState.combat.openingStrike.windUpMultiplier;
  let playerBlock = gameState.combat.playerBlock;
  
  const now = getGameTime();
  
  if(!gameState.combat.flags.isCritical) {
    if (playerBlock.cooldownUntil > now) return;
  }
  
 // console.error(`timed block activated`);
  
  //const blockButton = document.getElementById("attack-left");

 /* playerBlock.mode = "timed";
  playerBlock.active = true;
  playerBlock.activePaused = false;*/

  playerBlock.startTime = now;
  playerBlock.endTime = now + totalDuration;
  playerBlock.lastResult = null;
  playerBlock.activeRemaining = totalDuration;
  
  //playSound(`timed-block`, 0.4);
  
  //triggerSlowMo(0.35, 300);
  //slowMoAlert();
  //slowMoDecision();
  //slowMoImpact();
  
  //blockButton.classList.add(`timed`);
  
  //const { start, end } = getPerfectWindowRange(player);
  //showTimedBlockUI(0, TIMED_DURATION, start, end);
  showTimedBlockUI(player);
  
  /*if(!gameState.combat.flags.isCritical) {
    lockActions({ duration: 230, reason: "block", allow: [] });
  }*/
  
  //console.error("Blok Taktyczny AKTYWNY");
}


function resolveTimedBlock(damage, player, enemy) {
  const now = getGameTime();
  const elapsed = now - gameState.combat.playerBlock.startTime;
  //const elapsed = getGameTime() - combat.playerBlock.logicStartTime;
  let playerBlock = gameState.combat.playerBlock;
  const expeditionLevelStats = gameState.expedition.modes[gameState.world.expeditionMode].level;
  const expeditionRunStats = gameState.expedition.modes[gameState.world.expeditionMode].run;

  gameState.combat.flags.isBlocked = true;
  
  //const errorMs = Math.abs(elapsed - PERFECT_CENTER);  
  const offset = Math.abs(elapsed - (PERFECT_CENTER * gameState.combat.openingStrike.windUpMultiplier));  
  
  const { perfect, normal, miss } = getBlockWindows(player);
  
  const perfectCooldown = getTimedBlockCooldown(player.blockPower);
 // console.error(`offset, perfect, normal`, offset, perfect, normal);

  if (offset <= perfect) {
    const refund = getPerfectBlockRefund(STAMINA_COST.TIMED_BLOCK, offset, player.blockPower) 
    let staminaState = gameState.resources.staminaState;
   // console.error(`refund`, refund);
    
    //addWeaponMasteryExp(`duelist`, 10, `perfect-block`);
     
    staminaState.current = Math.min(
        staminaState.max,
        staminaState.current + refund
    );
     
    if(gameState.world.mode === `expedition`) {
      expeditionLevelStats.perfectBlock++;
      expeditionRunStats.perfectBlock++;
    }
    
    if(gameState.char.combatAffixes[`perfect_block_restore_hp`]) {
      const restoredHpValue = gameState.char.combatAffixes[`perfect_block_restore_hp`].value;
      healPlayer(restoredHpValue);
    }
    
    if(gameState.char.combatAffixes[`perfect_block_gain_def`]) {
      const gainedDef = gameState.char.combatAffixes[`perfect_block_gain_def`].value;
      gameState.combat.perfectBlockBonus.defBonus.expiresAt = now + 5000;
      //console.error(`perfect_block_gain_def`, gainedDef);
      gameState.combat.perfectBlockBonus.defBonus.isActive = true;
      //gameState.combat.activeBonus.def += gainedDef;
      //showBuff(`def`, gameState.combat.activeBonus.def);
      gameState.combat.activeBonus.defSources.perfectBlock = gainedDef;
      recalculateDefenseBonus();
    }
    
    if(gameState.char.combatAffixes[`perfect_block_grant_stamina`]) {
      const gainedStamina = gameState.char.combatAffixes[`perfect_block_grant_stamina`].value;
      gainStamina(gainedStamina);
      //showReward(`+${gainedStamina.toFixed(0)} ${t("stamina_on_kill_reward")}`, 2100);
      showStaminaPopup(gainedStamina);
    }

    if(gameState.char.combatAffixes[`perfect_block_missing_hp`]) {
      const value = gameState.char.combatAffixes[`perfect_block_missing_hp`].value;
      healPlayer(value, true);
    }
 
    if(gameState.char.combatAffixes[`perfect_block_atkspd`] && !gameState.combat.perfectBlockBonus.atkSpdBonus.isActive) { 
      gameState.combat.perfectBlockBonus.atkSpdBonus.expiresAt = getGameTime() + 4000;
      gameState.combat.perfectBlockBonus.atkSpdBonus.isActive = true;
      const atkSpdBonus = gameState.char.combatAffixes[`perfect_block_atkspd`].value;
      gameState.combat.activeBonus.atkSpd += atkSpdBonus;
      
      updateStatusPlayerUI(enemy);
    }
    
    if(gameState.char.combatAffixes[`perfect_block_armor_break`]) {
      const value = gameState.char.combatAffixes[`perfect_block_armor_break`].value;
      const armorBreakValue = value / 100;
      
      let powerBonus = 1;
      if(gameState.char.combatAffixes[`armor_break_effect`]) {
        powerBonus = 1 + (gameState.char.combatAffixes[`armor_break_effect`].value / 100);
      }
 
      applyArmorBreak(enemy, armorBreakValue, 4);
      //showReward(`${t("break_defense_reward")} -${((armorBreakValue * powerBonus) * 100).toFixed(0)}%`);
    }

    if(gameState.char.combatAffixes[`perfect_block_bleed`]) {
      const value = gameState.char.combatAffixes[`perfect_block_bleed`].value;
      const bleedValue = value / 100;
      applyBleed(enemy, bleedValue, 3);
    }

    if(gameState.char.combatAffixes[`perfect_block_remove_energy_fatigue_stack`]) {
      if(gameState.combat.stats.energyFatigueStack > 0) {      
       // console.error(`remove energy fatique stack`);
        gameState.combat.stats.energyFatigueStack--;
        showReward(`-1 ${t("remove_fatique_stack")}`);
      } 
    }
    
    const eq = gameState.char?.equipment || {};
    const weapon = eq[`weapon`];
  
    if (weapon?.baseName === `Długi Miecz`){
      longswordOnPerfect();
    }
    
    onPerfectBlock();
    playSound(`perfect`, 0.38);
    tryTriggerBlockReward(damage, player, enemy);
    
    //slowMoImpact();
    //hitStop(60);
    
    tryInterruptEnemy(enemy, `perfect-block`);
    
    gameState.combat.flags.isPerfectDmgBonus = true;
    
    if(gameState.char.bonus.perfectChainBonus) {
      gameState.combat.perfectChainStacks++;
      gameState.combat.perfectBonusDmgNextHit = true;
      // showReward(`${t("perfect_counterattack_reward")} x${gameState.combat.perfectChainStacks}`);
    }
    
    endTimedBlock("perfect", perfectCooldown);
    showOutcome("perfect", `${t("perfect_outcome")}`);
    
    extendPerfectBlockChain(playerBlock);
   
    if (gameState.combat.parryMaster?.isActive) {
      const stackChain = gameState.combat.playerBlock.stackChain;
      const reduction = gameState.combat.parryMaster.reduce * stackChain;
      const shieldReduction = gameState.combat.parryMaster.shieldReduce * stackChain;
    
      if(gameState.combat.precision.buffMultiplier > 1) {
          reduction *= gameState.combat.precision.buffMultiplier;
          addWeaponMasteryExp(`duelist`, 2, `reduce-cooldown-buff`);
      }
      
      updateStatusPlayerUI(enemy);
      
     // console.log(`parry master perfect block`, reduction, stackChain);
      
      gainStamina(5 * stackChain);
  
      for (const skillId in skillCooldownState) {
        if (skillId === "parry-master") continue;
        
        reduceSkillCooldown(skillId, reduction);
        
        addWeaponMasteryExp(`duelist`, 3, `parry-master`);

        //reduceShieldCooldown(shieldReduction);
        
        gameState.combat.parryMaster.remainingMs = 4000;
      }
    }
    
    if(gameState.combat.openingStrike.windUpMultiplier > 1) {
      addWeaponMasteryExp(`duelist`, 6, `opening-strike`);
    }
    
    //showReward(`100% Redukcji Obrażeń`);
    return 1.0; // 100% redukcji
  }
  
  if (offset <= normal) {
    
    const timedBlockReduction = getTimedBlockReduction(player.blockPower);
    let finalBlockReduction = getStaminaNormalBlockReduction(timedBlockReduction); 
 
    let normalCooldown = 3500;
    
    addWeaponMasteryExp(`duelist`, 4, `normal-block`);
    
    if(gameState.char.bonus.blockReductionBonus) {
      const bonus = gameState.char.bonus.blockReductionBonus / 100;
      finalBlockReduction *= 1 + bonus;
     // normalCooldown = gameState.char.bonus.blockCooldownBonus * 1000;
      //console.error(`bonus`, bonus);

      normalCooldown *= 1 - bonus;
    }
    
    //console.error(`NORMAL BLOCK COOLDOWN!`, normalCooldown);
    playSound(`normal`, 0.40);
    endTimedBlock("normal", normalCooldown);
    //console.error(`NORMAL BLOCK!`);
    showOutcome("normal", `${t("good_outcome")}`);
       
    if(gameState.combat.perfectChainStacks) {
      gameState.combat.perfectChainStacks--;
      //showReward(`Perfekcyjny Kontratak x${gameState.combat.perfectChainStacks}`);
    }
    
    reducePerfectBlockChain(playerBlock);

    showReward(`${(finalBlockReduction * 100).toFixed(0)}% ${t("dmg_reduction_reward")}`);
    return finalBlockReduction;
    //return 0.6; // 60% redukcji
  }

  reducePerfectBlockChain(playerBlock);
  
  playerBlock.lastResult = "miss";
  playerBlock.cooldownUntil = now + 3500;
  
  endTimedBlock("miss", 3500);
  showOutcome("miss", `${t("miss_outcome")}`);
  
  if(gameState.combat.perfectChainStacks) {
      gameState.combat.perfectChainStacks = 0;
    }
  
  return 0;
}

function applyBlock(incomingDamage, player, enemy) {
  let playerBlock = gameState.combat.playerBlock;
 // console.error(`enter apply block`, playerBlock.active);

  if (!playerBlock.active) return incomingDamage;

  //console.error(`player.block`, player.blockPower);
  const damageReduction = getDefensiveBlockReduction(player.blockPower);
  const reduced = incomingDamage * (1 - damageReduction);

  if (playerBlock.mode === "timed" || (playerBlock.mode === "defensive" && gameState.combat.flags.isCritical)) {
    const damageMultiplierReduced = resolveTimedBlock(incomingDamage, player, enemy);
    
    //console.error(`dmg multiplier in normal block`, damageMultiplierReduced);
    return incomingDamage * (1 - damageMultiplierReduced);
  }

  return Math.floor(reduced);
}

function showOtherNonCombatElements(enemy) {
  const world = gameState.world;
  const progressBar = document.getElementById("progress-container");
  const arrows = document.querySelector(".arrows-center");
  const questBtn = document.getElementById("quest-button");
  const storeBtn = document.getElementById("store-button");
  const enemyInfo = document.querySelector(".enemy-info");
  
  if(enemy.type === `mini_boss`) {
    enemyInfo.style.opacity = `1`;
  }
  
  progressBar.style.opacity = `1`;
  arrows.style.opacity =`1`;
  if(world.mode === `story`) {
    questBtn.style.opacity = `1`;
  } else {
    storeBtn.style.opacity = `1`;
  }
}

function exitCombat() {
  const char = gameState.char;
  
  char.inCombat = false;
  char.lastRegenTs = Date.now();
  char.regenAllowedAt = Date.now() + 3000;
  gameState.resources.staminaState.inCombat = false;
  
  hidePlayerAvatar();
  vsSymbolAnimationHide();
  
  const masteryBar = document.getElementById("mastery-bar-container");
  const expBar = document.getElementById("exp-bar-container");

  masteryBar.classList.add(`hidden`);
  expBar.classList.remove(`hidden`);
}




