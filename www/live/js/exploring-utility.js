let anomalyTimer = null;

function selectAnomaly(id, card){
  const cards = document.querySelectorAll(".anomaly-card");
  
  cards.forEach(c=>{
    c.classList.remove("selected");
    const bar = c.querySelector(".anomaly-progress");

    bar.classList.remove("active");
      
    bar.style.animation = "none";
    bar.offsetHeight;
    bar.style.animation = null;
  });

  card.classList.add("selected");
     
  const progress = card.querySelector(".anomaly-progress");

 // void progress.offsetWidth;
  progress.classList.add("active");
  clearTimeout(anomalyTimer);
    
  anomalyTimer = setTimeout(()=>{
      applyAnomaly(id);
  },2000);
}

function addMutator(id){
  const run = gameState.expedition.modes[gameState.world.expeditionMode].run;

  if(!run.mutators[id]){
    run.mutators[id] = 1;
  }else{
    run.mutators[id]++;
  }
}

function applyAnomaly(id) {
    //gameState.world.expeditionMutators.push(id);
    const run = gameState.expedition.modes[gameState.world.expeditionMode].run;

   // console.error(`mutator push, mode`, id, gameState.world.expeditionMode);

    //run.mutators.push(id);
    addMutator(id);
    
    closeAnomalyScreen();
    //gameState.world.expeditionLevel++;
    //run.level++;
    startNextExpeditionLocation();
}


function shuffle(array){
  const arr = [...array];

  for(let i = arr.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}

function formatTime(time){
  const seconds = Math.floor(time);

  const m = Math.floor(seconds / 60);
  const s = seconds % 60;

  const mm = String(m).padStart(2,"0");
  const ss = String(s).padStart(2,"0");

  return `${mm}:${ss}`;
}

 
const locationLore = {
  "elmaris_port": [
    "elmaris_port_lore1",
    "elmaris_port_lore2"
  ],

  "thalorn_village": [
    "thalorn_village_lore1",
    "thalorn_village_lore2"
  ],

  "reapers_road": [
    "reapers_road_lore1",
    "reapers_road_lore2"
  ],

  "lirwen_fort": [
    "lirwen_fort_lore1",
    "lirwen_fort_lore2"
  ],

  "green_pass": [
    "green_pass_lore1",
    "green_pass_lore2"
  ],

  "whispering_trees": [
    "whispering_trees_lore1",
    "whispering_trees_lore2"
  ]
};


function openAnomalySelection(){
  const pool = Object.keys(EXPEDITION_MUTATOR_INFO);
  const choices = shuffle(pool).slice(0,3);
  const popup = document.getElementById("anomaly-selection");
    
  popup.classList.add("show-summary");
    
  const container = document.getElementById("anomaly-options");

  container.innerHTML = "";

  choices.forEach((id, index)=>{
    const data = EXPEDITION_MUTATOR_INFO[id];
    const card = document.createElement("div");
    const run = gameState.expedition.modes[gameState.world.expeditionMode].run;
    const level = run.mutators[id] || 0;

    card.className = "anomaly-card panel-3d";
    
    const mutatorIconUrl = assetManager.getResolvedAsset(`img/icons/${data.icon}`);
    
    card.innerHTML = `
     <!--1 <img src="${ASSET_BASE}img/icons/${data.icon}"> -->
      <img src="${mutatorIconUrl}">
      <div class="anomaly-name">
        ${data.name} ${level ? toRoman(level) : ""}
      </div>
      <div class="anomaly-desc">${data.desc}</div>
      
      <div class="anomaly-progress"></div>
    `;

    container.appendChild(card);
      
    card.onclick = ()=>selectAnomaly(id, card);
      
    setPopupBackground2(card, "special");
      
    setTimeout(()=>{
        card.classList.add("show");
    },160 * index);
      
  });

  popup.classList.remove("hidden");
}

function closeAnomalyScreen() {
  const popup = document.getElementById("anomaly-selection");
  popup.classList.add("hidden");
}


function confirmLevelSummary(){
  closeSummary();

  //const level = gameState.world.expeditionLevel;
  const run = gameState.expedition.modes[gameState.world.expeditionMode].run;
    
  //console.error(`expeditionMode`, gameState.world.expeditionMode, run.level); 
  if(gameState.world.expeditionMode === "endless" && run.level % 3 === 0){
    openAnomalySelection();
    run.level++;
  }else{
    run.level++;
    startNextExpeditionLocation();
  } 
  if(gameState.world.expeditionMode === "limited") {
    if(run.level === 2) { 
      openAnomalySelection();
      return;
    } if(run.level >= 3) {
      showExpeditionRunSummary();
      return;
    }
    startNextExpeditionLocation();
  }

}

function animateNumber(el, value, duration = 600){
  let start = 0;
  const step = value / (duration / 16);

  function tick(){
    start += step;

    if(start >= value){
      el.textContent = value;
      return;
    }

    el.textContent = Math.floor(start);

    requestAnimationFrame(tick);
  }

  tick();
}

function updateLevelSummaryMode(mode){
  const gold = document.getElementById("level-stats-gold");
  const impulses = document.getElementById("level-stats-impulses");
  
  if(mode === "endless"){
    gold.style.display = "none";
    impulses.style.display = "flex";
  }else{
    impulses.style.display = "none";
    gold.style.display = "flex";
  }
}


function showExpeditionSummary(){
  const popup = document.getElementById("summary-popup");
  const content = document.getElementById("popup-content");
    
  setPopupBackground3(`#summary-popup .popup-content`, `set`);
    
  //const expeditionRunStats = gameState.expedition.level;
  const expeditionRunStats = gameState.expedition.modes[gameState.world.expeditionMode].level;
  const expeditionEndlessStats = gameState.expedition.modes[gameState.world.expeditionMode].run;

  const time = Math.floor(
    (Date.now() - expeditionRunStats.startTime) / 1000
  );
    
  popup.classList.add("show-summary");
    
  const sumKillsEl = document.getElementById("sum-kills");
  const sumDamageEl = document.getElementById("sum-damage");
  const sumTakenEl = document.getElementById("sum-taken");
  const sumBlockedEl = document.getElementById("sum-blocked");
  const sumPerfectEl = document.getElementById("sum-perfect");
  const sumGoldEl = document.getElementById("sum-gold");
  const sumLootEl = document.getElementById("sum-loot");
  const sumImpulsesEl = document.getElementById("sum-impulse");
    
  sumKillsEl.textContent = expeditionRunStats.kills;
  //animateNumber(sumKillsEl, expeditionRunStats.kills);
    
  sumDamageEl.textContent = expeditionRunStats.damageDealt;
  //animateNumber(sumDamageEl, expeditionRunStats.damageDealt);
    
  sumTakenEl.textContent = expeditionRunStats.damageTaken;
  //animateNumber(sumTakenEl, expeditionRunStats.damageTaken);
    
  sumBlockedEl.textContent = expeditionRunStats.damageBlocked;
  //animateNumber(sumBlockedEl, expeditionRunStats.damageBlocked);
    
  sumPerfectEl.textContent = expeditionRunStats.perfectBlock;
  animateNumber(sumPerfectEl, expeditionRunStats.perfectBlock);

  sumGoldEl.textContent = expeditionRunStats.gold;
  animateNumber(sumGoldEl, expeditionRunStats.gold);

  sumImpulsesEl.textContent = expeditionEndlessStats.impulses;
  animateNumber(sumImpulsesEl, expeditionEndlessStats.impulses);
    
  sumLootEl.textContent = expeditionRunStats.loot;
  animateNumber(sumLootEl, expeditionRunStats.loot);
    
  document.getElementById("sum-time").textContent = formatTime(time);
    
  updateLevelSummaryMode(gameState.world.expeditionMode);
    
  showSummaryStats(expeditionRunStats);
    
  function showSummaryStats(stats){
    const statElements = [
      {el: sumKillsEl, value: stats.kills},
      {el: sumDamageEl, value: stats.damageDealt},
      {el: sumTakenEl, value: stats.damageTaken},
      {el: sumBlockedEl, value: stats.damageBlocked}
    ];

    statElements.forEach((stat, i)=>{
      setTimeout(()=>{
        animateNumber(stat.el, stat.value);
      }, 400 + i * 120)
    });
  }
    
  const summaryBtn = document.getElementById("summary-btn");
  setGlobalButtonTexture(summaryBtn);
    
  popup.classList.remove("hidden");
}

function closeSummary() {
  const popup = document.getElementById("summary-popup");
  popup.classList.add("hidden");
}

function updateRunSummaryMode(mode){
  const gold = document.getElementById("stat-gold");
  const impulses = document.getElementById("stat-impulses");
  const keys = document.getElementById("stat-keys");
  const damage = document.getElementById("stat-damage");

  if(mode === "endless"){
    gold.style.display = "none";
    damage.style.display = "none";

    impulses.style.display = "flex";
    keys.style.display = "flex";
  }else{
    impulses.style.display = "none";
    keys.style.display = "none";

    gold.style.display = "flex";
    damage.style.display = "flex";
  }
}

function showExpeditionRunSummary(endRun = false){
  const popup = document.getElementById("run-summary-popup");
  const content = document.getElementById("popup-content");
  const title = document.getElementById("run-summary-title");
  const levelText = document.querySelector("#run-summary-popup .summary-level");

  setTimeout(()=>{
    if(endRun) {  
      setPopupBackground3(`#run-summary-popup .popup-content`, `common`);
      title.textContent = `Poległeś`;
      levelText.classList.add("level-stone");
    }else {
     setPopupBackground3(`#run-summary-popup .popup-content`, `unique`);
     levelText.classList.add("level-gold");
    } 
      
    popup.classList.add("show-summary");
    popup.classList.remove("hidden");
  }, 700);
    
  const expeditionRunStats = gameState.expedition.modes[gameState.world.expeditionMode].run;
  const meta = gameState.expedition.meta;

  let time = getRunTime(expeditionRunStats) / 1000;
    
  const sumKillsEl = document.getElementById("run-kills");
  const sumPerfectEl = document.getElementById("run-perfect");
  const sumLevelEl = document.getElementById("run-depth");
  const sumGoldEl = document.getElementById("run-gold");
  const sumImpulsesEl = document.getElementById("run-impulses");
  const sumDamageEl = document.getElementById("run-damage");
  const sumKeysEl = document.getElementById("run-keys");

  sumKillsEl.textContent = expeditionRunStats.kills;
  sumPerfectEl.textContent = expeditionRunStats.perfectBlock;
  sumLevelEl.textContent = `ZDOBYŁEŚ POZIOM ` + expeditionRunStats.level;
  sumImpulsesEl.textContent = expeditionRunStats.impulses;
  sumGoldEl.textContent = expeditionRunStats.gold;
  sumDamageEl.textContent = expeditionRunStats.damage;
  sumKeysEl.textContent = expeditionRunStats.keys;

  updateRunSummaryMode(gameState.world.expeditionMode);
    
  document.getElementById("run-time").textContent = formatTime(time);
    
  showSummaryStats(expeditionRunStats);
    
  function showSummaryStats(stats){
    const statElements = [
      {el: sumKillsEl, value: stats.kills},
      {el: sumPerfectEl, value: stats.perfectBlock},
      {el: sumGoldEl, value: stats.gold},
      {el: sumImpulsesEl, value: stats.impulses},
      {el: sumDamageEl, value: stats.damage},
      {el: sumKeysEl, value: stats.keys},
    ];

    statElements.forEach((stat, i)=>{
      setTimeout(()=>{
        animateNumber(stat.el, stat.value);
      }, 400 + i * 120)
    });
  }
    
  meta.totalImpulses += expeditionRunStats.impulses;
  meta.totalRuns++; 
  meta.totalGold += expeditionRunStats.gold;
  //console.error(`run summary gameState.resources.gold`, gameState.resources.gold);

  const summaryBtn = document.getElementById("run-summary-btn");
  setGlobalButtonTexture(summaryBtn);
  const hubBtn = document.getElementById("run-hub-btn");
  setGlobalButtonTexture(hubBtn);

  document.getElementById(`fight-menu-btn`).classList.add('disabled');
    
  const region = gameState.world.selectedRegionId;
  resetRun(gameState.world.expeditionMode);
  resetExpeditionProgress();
  setStarterSet();
    
  gameState.world.selectedRegionId = region;
  saveGame();
}

function closeRunSummary() {
  const popup = document.getElementById("run-summary-popup");
  popup.classList.add("hidden");
  navigate(`map`);
}

function resetExpeditionProgress() {
    gameState.char = getBaseCharacter();
    gameState.inventory = [];
    gameState.world = getWorldState();
    gameState.combat = getBaseCombatState();
    gameState.resources = getBaseResourceState();
    gameState.world.mode = `expedition`;
    gameState.resources.gold += gameState.expedition.meta.totalGold;
    //console.error(`reset run progress gameState.resources.gold`, gameState.resources.gold);
    gameState.resources.impulses += gameState.expedition.meta.totalImpulses;
}

/*const EXPEDITION_MODE_DESC = {
    endless: "Nieskończona ekspedycja. Co kilka poziomów pojawiają się nowe anomalie symulacji.",
    limited: "Zamknięta szczelina. 20 poziomów i jedna anomalia. Wyzwanie o ustalonej długości."
};*/

const EXPEDITION_MODE_DESC = {
  endless: "Otchłań bez dna. Co kilka poziomów rzeczywistość się zmienia. Sprawdź jak głęboko zdołasz dotrzeć.",
  limited: "Zamknięta szczelina. 20 poziomów i jedna anomalia na całą wyprawę. Czy zdołasz dotrzeć do końca?"
};

let expeditionMode = null;

function initExpeditionModes(){
  const buttons = document.querySelectorAll(".expedition-mode-btn");
  const descBox = document.getElementById("expedition-mode-desc");
  const startBtn = document.getElementById("expedition-start");
  const continueBtn = document.getElementById("expedition-continue");

  buttons.forEach(btn=>{
      btn.onclick = () => {
          buttons.forEach(b=>b.classList.remove("active"));
          btn.classList.add("active");
          const mode = btn.dataset.mode;
          descBox.textContent = EXPEDITION_MODE_DESC[mode];
          expeditionMode = mode;
          startBtn.disabled = false;
          startBtn.classList.remove("disable");
          renderExpeditionPanel();
          updateExpeditionProgress();
          continueBtn.style.display = `none`;
          const run = gameState.expedition.modes[mode].run;
          //console.error(`initExpeditionModes, run.playedTime`, run.playedTime);

          if(run.playedTime) {
            continueBtn.style.display = `inline`;

            /*continueBtn.disabled = false;
            continueBtn.classList.remove("disable");*/
          }
          
          renderMutators(run.mutators);
      };
  });
    
  //descBox.textContent = EXPEDITION_MODE_DESC["endless"];
}

function getRunTime(run){
  if(run?.startTime === 0){
      //console.error(`getRunTime, run?.playedTime`, run?.playedTime);
    return run?.playedTime;
  }
    
  return run?.playedTime + (Date.now() - run?.startTime);
}

function renderExpeditionPanel() {
  document.getElementById("expedition-region").textContent = selectedRegion.name;

  const run = gameState.expedition.modes[expeditionMode]?.run;
    
  let time = getRunTime(run) / 1000;
    
  //console.error(`run.startTime, time`, run?.startTime, time);
    
  const impulsesEl = document.getElementById(`progress-impulses-stat`); 
  const goldEl = document.getElementById(`progress-gold-stat`); 

  if (!expeditionMode) {
      if(expeditionMode === `endless`) {
        goldEl.style.display = `none`;
        impulsesEl.style.display = `block`;
      }else{
        goldEl.style.display = `block`;
        impulsesEl.style.display = `none`;
      }
      
    document.getElementById("expedition-shards").textContent = "-";
    document.getElementById("expedition-kills").textContent = "-";
    document.getElementById("expedition-time").textContent = "-";
  } else {
      
      if(expeditionMode === `endless`) {
        goldEl.style.display = `none`;
        impulsesEl.style.display = `block`;
        document.getElementById("expedition-shards").textContent = run.impulses;
      }else{
        goldEl.style.display = `block`;
        impulsesEl.style.display = `none`;
        document.getElementById("expedition-gold").textContent = run.gold;
      }
      
    document.getElementById("expedition-kills").textContent = run.kills;
    document.getElementById("expedition-time").textContent = formatTime(time);
  }
}

function toRoman(num){
  const map = ["","I","II","III","IV","V","VI","VII","VIII","IX","X"];
  return map[num] || num;
}

async function renderMutators(mutators){
    const container = document.getElementById("expedition-mutators");
    container.innerHTML = "";
    //console.error(`render mutators`, mutators);
    
    Object.entries(mutators).forEach(([id,level])=>{
      const data = EXPEDITION_MUTATOR_INFO[id];
      const el = document.createElement("div");
      
      el.className="mutator-icon epic";
      
      const mutatorIconUrl = assetManager.getResolvedAsset(`img/icons/${data.icon}`);
      
      el.innerHTML = `
       <!-- <img src="${ASSET_BASE}img/icons/${data.icon}"> -->
        <img src="${mutatorIconUrl}">
        <span class="mutator-level">${toRoman(level)}</span>
      `;
        
         //el.onclick = ()=>openMutatorInfo(id);
           
      container.appendChild(el);
   });
 }

function updateExpeditionProgress() {
  const fill = document.getElementById("expedition-progress-fill");
  const label = document.getElementById("expedition-progress-label");
    
  //const level = gameState.world.expeditionLevel;
  const mode = expeditionMode;
  const level = gameState.expedition.modes[mode].run.level;
 
  let percent = 0;

  if (mode === "limited") {
    const max = 20;
      
    percent = (level / max) * 100;
    label.textContent = `Poziom ${level} / ${max}`;
  } else {
    const segment = level % 10;

    percent = (segment / 10) * 100;
    label.textContent = `Poziom ${level}`;
  }

  fill.style.width = percent + "%";
}

function openExpeditionPanel() {
  const popup = document.getElementById("expedition-popup");
  const content = document.getElementById("popup-content");
    
  setPopupBackground3(`#expedition-popup .popup-content`, `rare`);
    
  renderExpeditionPanel();
    
  popup.classList.add("show-summary");
    
  const run = gameState.expedition.modes[expeditionMode]?.run;

  //if(run) renderMutators(run.mutators);
    
  initExpeditionModes();
  //updateExpeditionProgress();
    
  const startBtn = document.getElementById("expedition-start");
  setGlobalButtonTexture(startBtn);
  const continueBtn = document.getElementById("expedition-continue");
  setGlobalButtonTexture(continueBtn);
 
  startBtn.disabled = true;
  startBtn.classList.add("disable");
  /*continueBtn.disabled = true;
  continueBtn.classList.add("disable");*/
    
  continueBtn.style.display = `none`;

  popup.classList.remove("hidden");
}

function closeExpeditionPopup() {
  const popup = document.getElementById("expedition-popup");
 
  popup.classList.add("hidden");
}

function applySandboxButtonTextures(){
  const buttons = document.querySelectorAll(".sandbox-panel .item-button");

  buttons.forEach(btn=>{
    setGlobalButtonTexture(btn);
  });

}

function openSandboxPanel() {
  const popup = document.getElementById("sandbox-popup");
  const content = document.getElementById("popup-content");
    
  setPopupBackground3(`#sandbox-popup .popup-content`, `common`);
    
  applySandboxButtonTextures();
    
  playSound("open", 0.4);

  popup.classList.add("show-summary");
  popup.classList.remove("hidden");
}

function closeSandboxPopup() {
  const popup = document.getElementById("sandbox-popup");
 
  popup.classList.add("hidden");
}

function addSandboxGold(amount) {
    const currentGold = parseInt(gameState.resources.gold);
    const newGold = currentGold + amount;
   
    setStatValue(`gold`, newGold);
    gameState.resources.gold = newGold;
    
    showInfoAlert(`Dodano ${amount} złota`, 1500, true);
  
    playSound(`open-slot`, 0.4);
    
    saveGame();
}

function addCharLevel(level) {
    gameState.char.level += level;
    gameState.char.skillPoints += 1 * level;
    gameState.char.availableAttributePoints += 5 * level;

    playSound(`open-slot`, 0.4);
  
    showInfoAlert(`Dodano ${level} poziom`, 1500, true);
  
    renderStats();
    saveGame();
}

function generateRandomItemToRandomSlot(rarity){
  const slot = slotTypes[Math.floor(Math.random() * slotTypes.length)];

  window.forceItemType = slot;

  const item = generateItem({ forceRarity: rarity });

  if(item){
    gameState.char.equipment[slot] = item;
  }

  window.forceItemType = null;

  renderStats?.();
  renderEquipment?.();
  saveGame();
}

function generateRandomItems(count, rarity){
  const shuffled = [...slotTypes].sort(()=>Math.random() - 0.5);

  const slots = shuffled.slice(0, count);

  slots.forEach(slot => {

    window.forceItemType = slot;

    const item = generateItem({maxRarity: `rare`, forceRarity: rarity });

    if(item){
      gameState.char.equipment[slot] = item;
    }

  });

  window.forceItemType = null;

  renderStats?.();
  renderEquipment?.();
  saveGame();
}

function sandboxGenerateItems({
  count = 1,
  minRarity = "common",
  maxRarity = "rare",
  slot = "random",
  uniqueSlots = true
} = {}){

  let availableSlots = [...slotTypes];

  for(let i = 0; i < count; i++){

    let chosenSlot;

    if(slot === "random"){

      if(uniqueSlots){
        if(availableSlots.length === 0) break;

        const index = Math.floor(Math.random() * availableSlots.length);
        chosenSlot = availableSlots.splice(index,1)[0];
      }
      else{
        chosenSlot = slotTypes[Math.floor(Math.random() * slotTypes.length)];
      }

    }else{
      chosenSlot = slot;
    }

    window.forceItemType = chosenSlot;

    const item = generateItem({ minRarity, maxRarity });

    if (!gameState.char.equipment[item.typ]) {
      //equipItem(item);
      gameState.char.equipment[chosenSlot] = item;
    } else {
      addItemToInventory(item);
    }
    
    /*if(item){
      gameState.char.equipment[chosenSlot] = item;
    }*/

    showInfoAlert(`Dodano przedmiot ${item.nazwa}`, 2000, true);
  }

  playSound("open-slot", 0.4);
  
  window.forceItemType = null;

  refreshCharacterStats();
  renderStats?.();
  renderEquipment?.();
  saveGame();
}

function generateAndEquipSandboxSet(rarityPool, count = slotTypes.length){
  let availableSlots = [...slotTypes];

  for(let i = 0; i < count; i++){

    if(availableSlots.length === 0) break;

    const slotIndex = Math.floor(Math.random() * availableSlots.length);
    const chosenSlot = availableSlots.splice(slotIndex,1)[0];

    const rarity = rarityPool[Math.floor(Math.random() * rarityPool.length)];

    window.forceItemType = chosenSlot;

    const item = generateItem({
      minRarity: rarity,
      maxRarity: rarity
    });

    if(!gameState.char.equipment[chosenSlot]){
      gameState.char.equipment[chosenSlot] = item;
    }else{
      addItemToInventory(item);
    }

  }

  window.forceItemType = null;

  refreshCharacterStats();
  renderStats?.();
  renderEquipment?.();
  saveGame();
}

function refillEnergy() {
  const energyState = gameState.resources.energyState;
  
  energyState.current = energyState.max;
  
  playSound(`open-slot`, 0.4);
  
  showInfoAlert(`Uzupełniono energię`, 1500, true);
  
  saveGame();
}

const SANDBOX_PRESETS = {

  initiate:{
    name:"Nowicjusz",
    level:10,
    gold:300,
    gear:"Rzadki Zestaw"
  },

  adventurer:{
    name:"Poszukiwacz",
    level:25,
    gold:1200,
    gear:"Rzadki / Unikalny mix"
  },

  veteran:{
    name:"Weteran",
    level:50,
    gold:3500,
    gear:"Pełny Unikalny Zestaw"
  },

  champion:{
    name:"Czempion",
    level:75,
    gold:8000,
    gear:"Unikalny / Epicki Zestaw"
  }

};

let selectedSandboxPreset = null;

function openSandboxPreset(id){

  selectedSandboxPreset = id;

  const p = SANDBOX_PRESETS[id];

  const panel = document.getElementById("sandboxPresetPanel");

  panel.querySelector(".sandbox-dialog-title")
    .textContent = p.name;

  panel.querySelector(".sandbox-dialog-description")
    .textContent =
      `Poziom ${p.level} • ${p.gear} • ${formatGold(p.gold)} złota`;

  document.getElementById("sandboxStartTest").onclick = () => {
    if (!selectedSandboxPreset) return;
    startSandboxTest(selectedSandboxPreset);
  };
  
  document.querySelectorAll(".test-icon")
    .forEach(btn => btn.classList.remove("active"));
  
  event.target.classList.add("active");
  
  playSound(`open-slot`, 0.4);
  
  panel.classList.remove("hidden");
}

function formatGold(value) {
  if (value >= 1000) {
    return (value / 1000).toFixed(1).replace(".0","") + "K";
  }

  return value;
}