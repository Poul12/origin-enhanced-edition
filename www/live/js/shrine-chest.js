
function itemTest() {
  // Tworzymy podstawową postać
    const character = {
      level: 1,
      experience: 0,
      expToNextLevel: 125,
      skillPoints: 0,
      equipment: {},
      bag: []
    };

  const dlg = document.getElementById('dialog-box');
  
  document.getElementById("copyBtn").addEventListener("click", () => {
  const it = generateItem({ forceRarity: "common" });
  const json = JSON.stringify(it, null, 2);
  dlg.innerHTML = `<pre class="json-dump">${json}</pre>`;
  const container = dlg.querySelector(".item-list");
  document.getElementById("loot-popup").classList.add("show");
    dlg.classList.remove("hidden");

  navigator.clipboard.writeText(json)
    .then(() => console.log("Skopiowano do schowka!"))
    .catch(err => console.error("Błąd kopiowania:", err));
  });
  
}

// ——— SHRINE ———

function useShrine(i) {
  let opt = gameState.world.exploreOptions[i];
  const shrineData = opt.shrineData;
  const player = getPlayerStats();
  
  if (!shrineData || opt.used) return;

  if (shrineData.type === "heal") {
  //  console.log("leczymy", shrineData.bonusAmount);
    healPlayer(shrineData.bonusAmount);
    playSound(`shrine-heal`, 0.5, randomRange(0.95, 1.05), 0.65);
  } else if (shrineData.type === "attack") {
  //  console.error("moc", shrineData.bonusAmount);
    const value = 1 + (shrineData.bonusAmount / 100);
    //return Math.floor((1 + (effect.value / 100)) * player.dmg) - player.dmg;
    playSound(`shrine-might`, 0.5, randomRange(0.95, 1.05), 0.65);

    addTemporaryBuff({
      stat: "dmg",
      value: value,
      durationSec: 12,
      source: "shrine"
    });
  } else if (shrineData.type === "defense") {
 //   console.error("protekcja", shrineData.bonusAmount);
    const value = 1 + (shrineData.bonusAmount / 100);
    playSound(`shrine-protect`, 0.5, randomRange(0.95, 1.05), 0.65);
    addTemporaryBuff({
      stat: "def",
      value: value,
      durationSec: 15,
      source: "shrine"
    });
  }
  
  spendEnergy(opt.type);
  
  const step = gameState.world.locationSteps[gameState.world.currentStepIndex];

  if (step) {
    step.used.shrine = true; 
    initializeProgressBar(gameState.world.locationSteps);
  }
  
  renderLoots(i);
  opt.used = true;
  resetSlotActionButton(i);
  if(gameState.resources.firecampState.available) setFireCampButton(i);
  gameState.world.selectedSlotIndex = null;
  saveGame();
  renderOptions();
}

function setFireCampButton(i) {
  const opt = gameState.world.exploreOptions[i];
  const fireBtn = document.getElementById(`slot-attack-button-${i}`);
  if (!fireBtn) return;

  fireBtn.innerHTML = "";
  fireBtn.onclick = null;
  const campfireSrc = assetManager.getResolvedAsset(`img/buttons/firecamp-icon.png`);
        
  const fireIcon = document.createElement("img");
  fireIcon.className = "use-shrine-icon";
  fireIcon.src = `${campfireSrc}`;
  fireBtn.appendChild(fireIcon);

  fireBtn.classList.remove("hidden");

  fireBtn.onclick = (e) => {
    e.stopPropagation();
    showCustomConfirm(
      `${t("restore_energy_by_campfire")}`,
      () => { startFirecamp(i); fireBtn.classList.add("hidden"); },
      () => {}
    );
  };
}

function updateCampfireBar(fillEl) {
  const resources = gameState.resources;

  function tick() {
    if (!resources.firecampState.active || !resources.firecampState.expiresAt) return;

    const now = Date.now();
    const total = 12000;
    const remaining = Math.max(0, resources.firecampState.expiresAt - now);
    const percent = (remaining / total) * 100;

    fillEl.style.width = `${percent}%`;

    if (remaining > 0) {
      requestAnimationFrame(tick);
    }
  }
  tick();
}

function healPlayer(hpAmount, isPerfect = false){
  const char = gameState.char;

  //console.log(`hpAmount`, hpAmount);
  
  const missHp = char.maxHp - char.hp;
  
  let amountToHeal = char.maxHp * ( hpAmount / 100 );
  
  if(gameState.char.combatAffixes[`perfect_block_missing_hp`] && isPerfect) {
    amountToHeal = missHp * ( hpAmount / 100 );
  }
  
  //console.log(`amountToHeal`, amountToHeal);
  
  if(char.hp < char.maxHp) {
    if(amountToHeal >= missHp) {
      amountToHeal = missHp;
    }
    char.hp += amountToHeal;
  }  
  
  //console.log(`amountToHeal2`, amountToHeal);
  
  if(gameState.world.mode === `sandbox`) {
    showInfoAlert(`Wyleczono życie`, 2000, true);
    playSound("open-slot", 0.4);
  }
  saveGame();
  renderStats();
}

// ——— CHEST ———

/*function updateLootButtonVisibility() {
  const btn = document.getElementById("loot-btn");
  const bag = locationSteps[currentStepIndex]?.lootItems;
  if (bag && bag.length > 0) btn.classList.remove("hidden");
  else btn.classList.add("hidden");
}*/

function ensureStepLoot(stepIndex) {
  const step = gameState.world.locationSteps[stepIndex];
  if (!step) {
   // console.warn("Brak stepu o indexie:", stepIndex);
    return null;
  }
  if (!Array.isArray(step.lootItems)) step.lootItems = [];
  return step.lootItems;
}

function addGoldToChest(goldAmount) {
    
   let goldItem = ensureItemId({
      isGold: true,
      amount: goldAmount,
      nazwa: `${goldAmount} ${t("gold")}`
    });

    return goldItem;
}

function addGoldToLoot(lootBag, goldAmount) {
  // 🔹 złoto do BAGU (sumujemy)
  let goldItem = lootBag.find(item => item.isGold);

  if (goldItem) {
    goldItem.amount += goldAmount;
    goldItem.nazwa = `${goldItem.amount} ${t("gold")}`;
  } else {
    goldItem = ensureItemId({
      isGold: true,
      amount: goldAmount,
      nazwa: `${goldAmount} ${t("gold")}`
    });
    lootBag.unshift(goldItem);
  }

  // 🔹 złoto do LOOTU (tylko ta porcja!)
  const goldDrop = {
    isGold: true,
    amount: goldAmount,
    nazwa: `${goldAmount} ${t("gold")}`
  };

  return goldDrop;
}

function addLootToStep(enemy, stepIndex, msg = `message`) {
  const opt = gameState.world.exploreOptions[gameState.world.selectedSlotIndex];
  const lootBag = ensureStepLoot(stepIndex);
  if (!lootBag) return;
    
  const newLoot = generateEnemyLoot(enemy).map(ensureItemId);
  //const newLoot = generateMultipleItems(count).map(ensureItemId);

  /*newLoot.forEach((item, id) => {
    console.error(`[newLoot] Dodano do kroku ${stepIndex}:`, item.nazwa);
  });*/
  
  // 🎲 losujemy złoto
  const goldEarned = getGoldForEnemy(enemy);
  let goldDrop = addGoldToLoot(lootBag, goldEarned);

  lastLoot = [goldDrop, ...newLoot];
  
  // bag przechowuje pełną sumę
  lootBag.push(...newLoot);

  allItems = [...lootBag];
  //console.log("message", msg);
    
  if (opt) {
    opt.lootItems = [...lastLoot];
  }
  
  spawnLootOnSlot(gameState.world.selectedSlotIndex, lastLoot);
  
//  console.log(`[LOOT] Dodano do kroku ${stepIndex}:`, lastLoot);
  
  /*lastLoot.forEach((item, id) => {
    console.error(`[lastLoot] Dodano do kroku ${stepIndex}:`, item.nazwa);
  });*/
  
  saveGame();
}

function openLoot(stepIndex) {
  if (gameState.world.inCombat) return;

  const lootBag = ensureStepLoot(stepIndex);
  if (!lootBag || lootBag.length === 0) {
    console.log("[LOOT] Brak lootu do otwarcia.");
    return;
  }

 // console.log(`[LOOT] Otwieram loot z kroku ${stepIndex}:`, lootBag);
    
  allItems = lootBag;          
  renderChestItems(allItems);
  renderOptions();
  saveGame();

 }

function openChest(i) {
  const opt = gameState.world.exploreOptions[i];
  const dlg = document.getElementById("dialog-box");
  if (gameState.world.inCombat) return;

  if(!spendEnergy(opt.type)) return;
  
  if (!opt.chestOpened) {
    // znajdź definicję skrzyni z chestBase
    const chestType = chestBase.find(ch => ch.type === opt.chestData.type);

    if (!chestType) {
      console.error("Nie znaleziono definicji skrzyni!");
      return;
    }
      
    const step = gameState.world.locationSteps[gameState.world.currentStepIndex];

    if (step) {
      step.used.chest = true; 
      initializeProgressBar(gameState.world.locationSteps);
    }
    
    const itemCount = Math.floor(Math.random() * 2) + (chestType.maxItems - 1);
  
    // generujemy itemy
    opt.chestItems = generateChestLoot(itemCount, chestType.maxRarity, chestType.type);

    // 🎲 generujemy złoto (np. zależne od typu skrzyni)
    
    const goldEarned = rollGoldForChest(chestType.type);
    const goldItem = ensureItemId({
      isGold: true,
      amount: goldEarned,
      nazwa: `${goldEarned} ${t("gold")}`
    });
      
    // dodajemy złoto na początek skrzyni
    opt.chestItems.unshift(goldItem);

   // console.log("Wygenerowano loot ze skrzyni:", chestType.name, opt.chestItems);

    opt.chestOpened = true;
    opt.used = true;
  }
    
  allItems = opt.chestItems;
  
  if (opt) {
    opt.lootItems = [...allItems];
  }
  
  resetSlotActionButton(i);
  if(gameState.resources.firecampState.available) setFireCampButton(i);
  
  playSound(`chest`, 0.7, randomRange(0.95, 1.05), 0.65);
  
  renderOptions();
  spawnLootOnSlot(i, allItems);
  renderLoots(i);
  
  //renderChestItems(allItems);
  //renderOptions();
  //hideAttackBtn();
  //focusOnDialogBox();
  saveGame();
}

function generateChestLoot(itemCount = 3, maxRarity, chestType) {
  const items = [];

  // 1) losowanie
  for (let i = 0; i < itemCount; i++) {
    const newItem = generateItem({ maxRarity, isChest: true, chestType });
    items.push(ensureItemId(newItem));
  }
  
  let chance = 0.85;
  let potionCount = 1;
  
  if(chestType === `iron`) { 
    potionCount = 2;
  }
  
  for (let i = 0; i < potionCount; i++) {
    if (Math.random() < chance) {
        items.push(makeSmallHealPotion(gameState.char.level));
    } 
  }
   
  if (chestType === "gold") {
    let legCount = items.filter(i => i.klasa === "legendary").length;
   // console.log(`[GOLD] start legendary=${legCount}/${itemCount}`);

    // --- MINIMUM 1 LEGENDARY ---
    if (legCount === 0) {
      // podmień losowy slot na PRAWIE wymuszone legendary
      const idx = Math.floor(Math.random() * items.length);
      items[idx] = generateItem({ forceRarity: "legendary", isChest: true, chestType: "gold" });
   //   console.log(`[GOLD] wymuszono legendary w slocie ${idx}`);
    }

    // --- MAKS 2 LEGENDARY ---
    // zbierz INDEKSY legendary po aktualnym stanie
    const legIdx = items
      .map((it, idx) => (it.klasa === "legendary" ? idx : -1))
      .filter(idx => idx !== -1);

    if (legIdx.length > 2) {
    //  console.log(`[GOLD] legendary=${legIdx.length} > 2 → obcinam do 2`);
      for (let k = 2; k < legIdx.length; k++) {
        const idx = legIdx[k];
        items[idx] = generateItem({ maxRarity: "epic", isChest: true, chestType: "gold" });
       // console.log(`[GOLD] zamiana slot ${idx} legendary → <= epic`);
      }
    }

   // console.log(`[GOLD] final legendary=${items.filter(i => i.klasa === "legendary").length}`);
  }

  if (chestType === "silver") {
    let epicCount = items.filter(i => i.klasa === "epic").length;
   // console.log(`[SILVER] start epic=${epicCount}/${itemCount}`);

    // --- MINIMUM 1 EPIC ---
    if (epicCount === 0) {
      const idx = Math.floor(Math.random() * items.length);
      items[idx] = generateItem({ forceRarity: "epic", isChest: true, chestType: "silver" });
    //  console.log(`[SILVER] wymuszono epic w slocie ${idx}`);
    }

    // --- MAKS 2 EPIC ---
    const epicIdx = items
      .map((it, idx) => (it.klasa === "epic" ? idx : -1))
      .filter(idx => idx !== -1);

    if (epicIdx.length > 2) {
     // console.log(`[SILVER] epic=${epicIdx.length} > 2 → obcinam do 2`);
      for (let k = 2; k < epicIdx.length; k++) {
        const idx = epicIdx[k];
        items[idx] = generateItem({ maxRarity: "unique", isChest: true, chestType: "silver" });
      //  console.log(`[SILVER] zamiana slot ${idx} epic → <= unique`);
      }
    }

   // console.log(`[SILVER] final epic=${items.filter(i => i.klasa === "epic").length}`);
  }

  return items;
}

function ensureItemId(item) {
  if (!item._id) {
    item._id = 'itm_' + Math.random().toString(36).slice(2, 10) + '_' + Date.now();
  }
  return item;
}

function generateSpecialLoot(eventId) {
  const enemy = STORY_EVENT_ENEMIES[eventId];
  const items = [];

  items.push(enemy.reward.item);
  
  return items;
}

function generateEnemyLoot(enemy) {
  const opt = gameState.world.exploreOptions[gameState.world.selectedSlotIndex];
  const config = enemyLootConfig[enemy.type];
  let enemyType = enemy.type;
  if (!config) return [];

  // losowa liczba itemów w zakresie min–max
  const itemCount = Math.floor(Math.random() * (config.max - config.min + 1)) + config.min;
  const items = [];

  // losowanie z mnożnikiem szans
  for (let i = 0; i < itemCount; i++) {
    items.push(generateItem({ enemyType }));
  }

 // console.error(`enemy type on loot: `, enemy.type);
  
  // zwiększamy licznik, jeśli nie wypadł potion
  potionStreak++;

  // bazowa szansa
  let chance = 0.35 + (potionStreak * 0.05);

  // maksymalnie 80%
  chance = Math.min(chance, 0.80);

 // console.log(`potionStreak: `, potionStreak);
  //console.log(`chance: `, chance);
  
  // losowanie
  if (Math.random() < chance) {
    items.push(makeSmallHealPotion(gameState.char.level));
    potionStreak = 0; // reset po dropie
  }
 
  if (opt.guaranteedDrop) {
   // console.error(`opt questId`, opt.questId);
    items.push(opt.guaranteedDrop);
   // console.error(`Zdobyto wyjątkowy przedmiot: ${opt.guaranteedDrop}`);
  }
  
  if(enemy.reward) {
    //console.error(`enemy.reward`, enemy.reward.item.nazwa);
    items.push(enemy.reward.item);
  }
  
  items.forEach((item, id) => {
  //  console.error(`[items] after add reward`, item.nazwa);
  });
  
  // --- Wymuszone rarity ---
  /*for (const [rarity, minCount] of Object.entries(config.force)) {
    let count = items.filter(i => i.klasa === rarity).length;
    while (count < minCount && items.length > 0) {
      const idx = Math.floor(Math.random() * items.length);
      items[idx] = generateItem({ forceRarity: rarity });
      count++;
    }
  }*/

  for (const [rarity, minCount] of Object.entries(config.force)) {
    let count = items.filter(i => i.klasa === rarity).length;

    while (count < minCount) {
      items.push(generateItem({ forceRarity: rarity }));
      count++;
    }
  }
  
  items.forEach((item, id) => {
   // console.error(`[items] after add force rarity`, item.nazwa);
  });
  
  return items;
}

// PRZY GENEROWANIU WIELOKROTNYM – nadaj ID od razu
function generateMultipleItems(count, opts = {}) {
  const items = [];
  for (let i = 0; i < count; i++) {
    const item = generateItem(opts?.maxRarity, opts?.isChest, opts?.chestType);
    localStorage.setItem(`generatedItem_${i}`, JSON.stringify(item));
    items.push(ensureItemId(item));
  }
  return items;
}

function closeLootPopup() {
  document.getElementById("dialog-box").classList.add("hidden");
  document.getElementById("loot-popup").classList.remove("show");
}


function createItemElement(item, id, source, items, stepIndex, message) {
  let el;
  if (item.isGold) {
    el = document.createElement("div");
    el.className = "item-gold loot-item";
    el.textContent = item.nazwa;
  } else {
    const typ = item.typ || "";
    const nazwaTypu = item.klasa === "legendary"
      ? ` (${typ.charAt(0).toUpperCase() + typ.slice(1)})`
      : "";
    el = document.createElement("div");
    el.className = `item-name-${item.klasa} loot-item`;
    el.textContent = `${item.nazwa} ${nazwaTypu}`;
  }

  el.dataset.index = id;     // ⬅️ zapisujemy indeks
  el.dataset.source = source;

  el.addEventListener("click", () => {
    if (item.isGold) {
      takeGoldByIndex(id, source, stepIndex ?? currentStepIndex, message);
    } else {
      selectedItem = item;        // ⬅️ zapamiętujemy obiekt
      selectedSource = source;    // ⬅️ zapamiętujemy źródło
      //selectedSlotIndex = id;     // ⬅️ zapamiętujemy indeks
      selectedItemId = id;
      showItemPopup(id, source);
    }
  });

  return el;
}

function spawnLootOnSlot(slotIndex, lootItems, delay = 500) {
  const slot = document.querySelector(`.explore-slot[data-index='${slotIndex}']`);
  if (!slot) return;

  slot.style.position = "relative";
  const usedPositions = [];

  const slotRect = slot.getBoundingClientRect();
  const slotWidth = slotRect.width;
  const slotHeight = slotRect.height;
 
  const mode = gameState.world.expeditionMode;

  lootItems.forEach((item, id) => {
    if(mode === `endless` && item.isGold) return;
    
    //console.log(`spawnLootOnSlot(${slotIndex}) – wyświetlono ${lootItems.length} itemów`, item.baseName, id);

    setTimeout(() => {
      const el = document.createElement("div");
      //const beamParticles = document.createElement("div");
      el.classList.add("loot-float", `rarity-${item.klasa}`);
     // beamParticles.classList.add(`beam-particles`);
      el.textContent = item.isGold ? `${formatNumber(item.amount)} ${t("gold")}` : t(item.baseName);
      if(item.typ === `feather`) {
        el.textContent = t(item.typ);
      }
      
     // el.appendChild(beamParticles);
      slot.appendChild(el); // ⬅️ dodaj najpierw, aby znać jego rozmiar
      
      const elWidth = el.offsetWidth;
      const elHeight = el.offsetHeight;
      
      const paddingX = 60;
      const paddingY = 20;

      const maxX = slotWidth - elWidth - paddingX;
      const maxY = slotHeight - elHeight - paddingY;

      // Funkcja sprawdzająca kolizję z innymi elementami
      function isColliding(x, y, w, h) {
        return usedPositions.some(p => {
          return !(
            x + w < p.x ||         // element jest całkowicie na lewo
            x > p.x + p.w ||       // element jest całkowicie na prawo
            y + h < p.y ||         // element jest nad
            y > p.y + p.h          // element jest pod
          ); 
        });
      } 

      let posX, posY;
      let tries = 0;

      const LONG_NAMES = 
        item.typ === "heal_potion" || 
        item.typ === `map_fragment` || 
        item.baseName === `triangle_shield`|| 
        item.baseName === `round_shield`||
        item.baseName === `plate_armor` ||
        item.baseName === `leather_armor` ||
        item.baseName === `leather_gloves` ||
        item.baseName === `runic_stone`;
      
      
      if (LONG_NAMES) { // ➤ CENTRUM X
        posX = (slotWidth - elWidth + 90) / 2;

        // ➤ Losowy Y
        do {
          posY = Math.random() * maxY + paddingY;
          tries++;
        } while (isColliding(posX, posY, elWidth, elHeight) && tries < 50);
      } else {
        
        // ➤ Standardowe losowanie X i Y
        do {
          posX = Math.random() * maxX + paddingX;
          posY = Math.random() * maxY + paddingY;
          tries++;
        } while (isColliding(posX, posY, elWidth, elHeight) && tries < 50);
      }

      el.style.left = `${posX}px`;
      el.style.top = `${posY}px`;

      usedPositions.push({ x: posX, y: posY, w: elWidth, h: elHeight });
      
      
      /*el.style.transform = "translate(0, 0) scale(0.8)";
      el.style.opacity = "0";*/

      // 🎨 Kliknięcie = zebranie lootu
      el.onclick = () => {
        let isInvEmpty = true;
        if (item.isGold) {
          takeGoldByIndex(id, "loot", slotIndex);
        } else {
          isInvEmpty = addItemToInventory(item);
          playSound(`pickup-item`, 0.4);
          renderCombat();
        }

        const opt = gameState.world.exploreOptions[slotIndex];
        //if (opt && Array.isArray(opt.lootItems)) {
        if(isInvEmpty) {  
          const idx = opt.lootItems.findIndex(it => it._id === item._id);
          if (idx >= 0) opt.lootItems.splice(idx, 1);
        }

        saveGame();
       // console.log(`before el remove`, isInvEmpty);
        if(isInvEmpty) { 
          el.remove();
         // console.log(`after el remove`);
        }
      };

      // 🔄 animacja pojawienia się
      requestAnimationFrame(() => {
        el.classList.add("show");
      });

    }, id * delay);
  });
}

/*function spawnLootOnSlot(slotIndex, lootItems, delay) {
  const slot = document.querySelector(`.explore-slot[data-index='${slotIndex}']`);
  if (!slot) return;

  slot.style.position = "relative"; // potrzebne do absolutnego pozycjonowania

  const usedPositions = [];

  lootItems.forEach((item, id) => {
    setTimeout(() => {
      const el = document.createElement("div");
      el.classList.add("loot-float", `rarity-${item.klasa}`);
      el.textContent = item.isGold ? `+${item.amount} zł` : item.typ;

      // 📍 Wyznacz losową pozycję bez nachodzenia
      let randX, randY;
      let tries = 0;
      do {
        randX = Math.random() * 60 + 20; // 20–80%
        randY = Math.random() * 50 + 20; // 20–70%
        tries++;
      } while (
        usedPositions.some(
          p => Math.abs(p.x - randX) < 15 && Math.abs(p.y - randY) < 10
        ) && tries < 30
      );
      usedPositions.push({ x: randX, y: randY });

      el.style.left = `${randX}%`;
      el.style.top = `${randY}%`;

      // 🎨 Kliknięcie = zbieranie lootu
      el.onclick = () => {
        if (item.isGold) {
          takeGoldByIndex(id, "loot", slotIndex);
        } else {
          addItemToInventory(item, id);
        }

        // usuń z exploreOptions
        const opt = exploreOptions[slotIndex];
        if (opt && Array.isArray(opt.lootItems)) {
          const idx = opt.lootItems.findIndex(it => it._id === item._id);
          if (idx >= 0) opt.lootItems.splice(idx, 1);
        }

        saveState();
        el.remove();
      };

      // ➕ Dodaj do slota
      slot.appendChild(el);

    // 🔄 animacja pojawienia się
      requestAnimationFrame(() => {
        el.classList.add("show");
      });
    }, id * delay); // kolejne itemy z małym opóźnieniem
  });
  
  console.log(
    `spawnLootOnSlot(${slotIndex}) – wyświetlono ${lootItems.length} itemów`,
    lootItems
  );
}*/

/*function spawnLootOnSlot(slotIndex, lootItems, delay) {
  console.log(`before spawn`, slotIndex);
  const slot = document.querySelector(`.explore-slot[data-index='${slotIndex}']`);
  if (!slot) return;

  slot.style.position = "relative"; // musi być dla absolutnego pozycjonowania
  console.log(`after slot spawn`);
 
  lootItems.forEach((item, id) => {
    setTimeout(() => {
      const el = document.createElement("div");
      el.classList.add("loot-float", `rarity-${item.klasa}`);

      // 🪙 Nazwa wyświetlana
      el.textContent = item.isGold ? `+${item.amount} zł` : item.typ;

      // 📍 Losowa pozycja wewnątrz slota
      const randX = Math.random() * 60 + 10; // w %
      const randY = Math.random() * 60 + 10; // w %
      el.style.left = `${randX}%`;
      el.style.top = `${randY}%`;
      
      // 🎨 Kliknięcie dodaje item do ekwipunku
      el.onclick = () => {
        if (item.isGold) {
          takeGoldByIndex(id, "loot", slotIndex);
        } else {
          addItemToInventory(item, id);
        }
        
        const opt = exploreOptions[slotIndex];
        if (opt && Array.isArray(opt.lootItems)) {
          const idx = opt.lootItems.findIndex(it => it._id === item._id);
          if (idx >= 0) opt.lootItems.splice(idx, 1);
        }
        
        saveState();
        el.remove(); // znika po kliknięciu
      };
      
      // Dodaj do slota
      slot.appendChild(el);
      
      // 🔄 animacja pojawienia się
      requestAnimationFrame(() => {
        el.classList.add("show");
      });
    }, id * delay); // kolejne itemy z małym opóźnieniem
  });
  
  console.log(`spawnLootOnSlot(${slotIndex}) – wyświetlono ${lootItems.length} itemów`, lootItems);
}*/

function renderChestItems(items = null, source = "bag", stepIndex = null, message = "", withAnimation = false) {
 // console.log("msg:", message);
  const dlg = document.getElementById("dialog-box");

  dlg.innerHTML = `
    <div class='loot-message'>
      ${message ? `<div class="message-box">${message}</div>` : ""}
    </div>
    <div class='item-list'></div>
  `;

  const container = dlg.querySelector(".item-list");
  document.getElementById("loot-popup").classList.add("show");
  dlg.classList.remove("hidden");

  // 🔹 wybór trybu
  if (withAnimation && (source === "loot" || source === "chest")) {
    // --- wersja z animacją (tylko pierwsze otwarcie lootu/skrzyń) ---
    items.forEach((item, id) => {
      setTimeout(() => {
        const el = createItemElement(item, id, source, items, stepIndex, message);
        container.appendChild(el);

        requestAnimationFrame(() => {
          el.classList.add("show");
        });
      }, id * 500);
    });
  } else {
    // --- wersja bez animacji (np. bag albo ponowne renderowanie lootu) ---
    items.forEach((item, id) => {
      const el = createItemElement(item, id, source, items, stepIndex, message);
      el.classList.add("show");
      container.appendChild(el);
    });
  }
}

// ——— ITEMS POPUP ———

/*function showItemPopup(id, source = "bag") {
  const list = source === "loot" ? lastLoot : allItems;
  const item = list?.[id];
  if (!item) {
    console.error("Brak itemu w", source, "id:", id);
    return;
  }
  selectedItem = item;
  selectedSource = source;

  const popup = document.getElementById("item-popup");
  const content = document.getElementById("popup-content");

  content.classList.remove("common", "rare", "unique", "epic", "legendary");

  console.log("item:", selectedItem);
  console.log("classLabel:", selectedItem.klasa);
  const itemHTML = renderItem(selectedItem, classLabels[selectedItem.klasa], id); // ← wykorzystanie gotowego szablonu HTML
  
  popup.classList.add("show");
  content.classList.add(selectedItem.klasa);
  
  content.innerHTML = itemHTML;
}*/

 function closeItemPopup() {
    document.getElementById("item-popup").classList.remove("show");
 }

function takeItem(source = selectedSource, stepIndex = gameState.world.currentStepIndex) {
 // console.warn("index on take item", gameState.world.selectedSlotIndex);

  if (!selectedItem) return;

  if (source === 'bag') {
   // console.log("usuwam z bag");
    const bagIdx = allItems.findIndex(it => it && it._id === selectedItem._id);
    if (bagIdx >= 0) allItems.splice(bagIdx, 1);

  } else if (source === 'loot') {
   // console.log("usuwam z loot");
    if (selectedItemId != null) {
      lastLoot.splice(selectedItemId, 1);   // ⬅️ używamy zapamiętanego indeksu
    }

    // dodatkowo usuń z worka kroku
    const bag = ensureStepLoot(stepIndex);
    if (bag?.length && selectedItem?._id) {
      const bagIdx = bag.findIndex(it => it && it._id === selectedItem._id);
      if (bagIdx >= 0) bag.splice(bagIdx, 1);
    }
  }
  
  if (source === 'loot') {
    if (lastLoot && lastLoot.length) {
      renderChestItems(lastLoot, "loot");
    } else {
     // console.warn("pusta skrzynia/loot");
      //updateLootButtonVisibility();
      closeLootPopup();
    }
  } else {
    if (allItems && allItems.length) {
      renderChestItems(allItems, "bag");
    } else {
     // console.warn("pusta skrzynia/bag");
      //checkChestEmptyAndMarkUsed(stepIndex);
      closeLootPopup();
      //updateLootButtonVisibility();
    }
  }

  selectedItem = null;
  //selectedSlotIndex = null;
  closeItemPopup();
  
  saveGame();
}

function takeGoldByIndex(id, source = "bag", stepIndex = gameState.world.currentStepIndex, msg) {
 // console.warn("index on take gold", gameState.world.currentStepIndex);
  const expeditionLevelStats = gameState.expedition.modes[gameState.world.expeditionMode].level;
  const expeditionRunStats = gameState.expedition.modes[gameState.world.expeditionMode].run;

  const bag = ensureStepLoot(stepIndex); // zawsze pracujemy na realnym worku kroku
 /* const listRef = (source === "loot") ? lastLoot : allItems;
  const goldItem = listRef?.[id];*/

  let listRef;

  if (source === "loot") {
    // 🟢 Gdy loot jest powiązany ze slotem (np. po odświeżeniu)
    const slot = gameState.world.exploreOptions?.[stepIndex];
    listRef = slot?.lootItems || lastLoot || [];
  } else {
    listRef = allItems || [];
  }

  const goldItem = listRef?.[id];
  
  
  if (!goldItem || !goldItem.isGold) {
    console.warn("[GOLD] Kliknięty element to nie złoto albo brak pozycji:", id, source);
    return;
  }

  playSound(`pickup-gold`, 1.4, 1, 0.4);
  
  // 1) Dodaj złoto do gracza
  const currentGold = parseInt(gameState.resources.gold);
  const newGold = currentGold + goldItem.amount;
   
  //document.getElementById("gold").innerText = newGold;
  setStatValue(`gold`, newGold);
  gameState.resources.gold = newGold;
  
  expeditionLevelStats.gold += goldItem.amount;
  expeditionRunStats.gold += goldItem.amount;
  
  // 2) Usuń złoto z worka kroku
 /* const idxInBag = bag.findIndex(it => it && it._id === goldItem._id);
  if (idxInBag > -1) bag.splice(idxInBag, 1);*/

  // 3) Usuń złoto z listy popupu
  const idxInAll = allItems.findIndex(it => it && it._id === goldItem._id);
  if (idxInAll > -1) allItems.splice(idxInAll, 1);

  if (source === "loot") {
    // 2a) Źródło: LOOT → zdejmij porcję z worka kroku
    const goldInBag = bag.find(it => it.isGold);
    if (goldInBag) {
      goldInBag.amount -= goldItem.amount;
      if (goldInBag.amount <= 0) {
        const idxInBag = bag.findIndex(it => it.isGold);
        if (idxInBag > -1) bag.splice(idxInBag, 1);
      } else {
        goldInBag.nazwa = `${goldInBag.amount} ${t("gold")}`;
      }
    }

    // usuń porcję z listy, którą teraz oglądamy (lastLoot)
    lastLoot.splice(id, 1);

    // jeśli ta sama porcja była też w allItems (np. wcześniej ustawione referencje) – usuń po _id
    if (Array.isArray(allItems)) {
      const idxA = allItems.findIndex(it => it && it._id === goldItem._id);
      if (idxA > -1) allItems.splice(idxA, 1);
    }

    // użyj aktualnej referencji listy
    const opt = gameState.world.exploreOptions[stepIndex];
    if (opt && Array.isArray(opt.lootItems)) {
      const idx = opt.lootItems.findIndex(it => it && it._id === goldItem._id);
      if (idx >= 0) opt.lootItems.splice(idx, 1);
    }

    saveGame();
    
    // odśwież widok lootu
   /* renderChestItems(lastLoot, "loot", stepIndex, msg);
    if (lastLoot.length === 0) {
        console.warn("pusta skrzynia gold/loot");
        checkChestEmptyAndMarkUsed(stepIndex);
        closeLootPopup(); // zamknij popup, bo wszystko zabrane
        updateLootButtonVisibility();
    }*/
  /* } else {
    // bag view
    renderChestItems(allItems, "bag", stepIndex, msg);
    if (allItems.length === 0) {
        console.warn("pusta skrzynia gold/bag");
        checkChestEmptyAndMarkUsed(stepIndex);
        closeLootPopup(); // opcjonalnie, jeśli chcesz zamykać bag przy pustym worku
        updateLootButtonVisibility();
    }*/
  }
  
  saveGame();
}

function checkChestEmptyAndMarkUsed(stepIndex) {
  //console.warn("chest marking start", world.selectedSlotIndex);

  const opt = gameState.world.exploreOptions[gameState.world.selectedSlotIndex];
  if (!opt || opt.type !== 'chest') return;
  
  //console.warn("isChest on mark");
        
  const bag = ensureStepLoot(stepIndex);
  // jeśli nie ma żadnych itemów ani złota w skrzyni
  const isEmpty = !bag || bag.length === 0;
  if (isEmpty) {
   // console.warn("chest is marking to empty");
    opt.used = true;
    renderOptions();
  }
}