
 const MAX_STACK = 2;

 const klasyPolskie = {
    common: "Zwykły",
    rare: "Magiczny",
    unique: "Unikalny",
    epic: "Epicki",
    legendary: "Legendarny"
  };

  //const inventory = gameState.inventory;
 
  window.diffTimers = {}; // globalny obiekt do przechowywania timerów

function updateSingleStatValue(id, newVal) {
  const el = document.getElementById(id);
//  console.log("el", el);
  const diffEl = document.getElementById(`${id}-diff-preview`);
 // console.log("diffEl", diffEl);
  if (!el || !diffEl) return;

 // console.log("id", el);
  const prevVal = el.dataset.value !== undefined ? parseFloat(el.dataset.value) : newVal;
  const diff = newVal - prevVal;

  //el.textContent = formatNumber(newVal);
  setStatValue(id, newVal);
   
  //el.dataset.prev = newVal;
  el.dataset.value = newVal;
   
  if (diff > 0) {
    diffEl.textContent = `+${formatNumber(diff)}`;
    diffEl.className = "stat-diff stat-preview stat-change-up-fade";
  } else if (diff < 0) {
    diffEl.textContent = `${formatNumber(diff)}`;
    diffEl.className = "stat-diff stat-preview stat-change-down-fade";
  } else {
    diffEl.textContent = "";
    diffEl.className = "stat-diff stat-preview";
  }

  // ❗ Nowość: zatrzymaj poprzedni timer jeśli istnieje
  if (window.diffTimers[id]) {
    clearTimeout(window.diffTimers[id]);
  }

  // ❗ Nowy timer: resetuj diff po 3s
  window.diffTimers[id] = setTimeout(() => {
    diffEl.textContent = "";
    diffEl.className = "stat-diff";
    delete window.diffTimers[id]; // wyczyść zapisany timer
  }, 2000);
 }

let currentFilter = null; // brak filtra na start

let currentTypeFilter = "";


function setFilter(rarity) {
  // kliknięcie w ten sam filtr = usuń filtr
  if (currentFilter === rarity) {
    currentFilter = null;
  } else {
    currentFilter = rarity;
  }

  // podświetlanie aktywnego filtra
  document.querySelectorAll(".filter-box").forEach(box => {
    box.classList.remove("active");
    if (box.classList.contains(rarity) && currentFilter === rarity) {
      box.classList.add("active");
    }
  });

  playSound(`open-slot`, 0.4); 
   
  renderInventory();
}

function renderInventory() {
//  console.log("render start");
  
  const container = document.getElementById("inventory-container");
  if(!container) return;
   
  container.innerHTML = "";
  
  // console.error("inventory in ekwipunek", gameState.inventory.length);
 
   
  let items = [...gameState.inventory];

  //let items = inventory;
   
 // console.error("items", items.length);
    
  if (currentFilter) {
    items = items.filter(item => item.rarity === currentFilter);
  }
  
  if (currentTypeFilter) items = items.filter(item => item.typ === currentTypeFilter);

  document.getElementById("count").textContent = gameState.inventory.length;

  const charLevel = gameState.char.level || 1;

  // przygotuj grid 4x5
  const grid = document.createElement("div");
  grid.className = "inventory-grid";

  // 20 slotów
  for (let i = 0; i < 20; i++) {
    
    const slot = document.createElement("div");
    slot.className = "slot";
    slot.setAttribute("data-index", i);
    
    const item = items[i] || null;
    if (item) {
      slot.classList.add(`${item.klasa}` || "common");
      //slot.classList.add(`legendary` || "common");
      slot.classList.add("not-empty");

      // obrazek
      const img = document.createElement("img");
      //img.src = `${ASSET_BASE}img/items/` + (item.sprite || "placeholder.png");
      setItemImage(img, item);
      img.alt = item.nazwa || "";
      img.className = "item-image";
      img.classList.add(item.klasa + "-slot-img" || "common-slot-img");
      //img.classList.add(item.klasa);
      slot.appendChild(img);

      // przyciski: tutaj w odróżnieniu od sklepu używamy inventory index
      const globalIndex = gameState.inventory.findIndex(i => i._id === item._id);
      const btns = document.createElement("div");
      btns.className = "item-buttons";
       
      const showIconUrl = assetManager.getResolvedAsset(`img/icons/show-item-icon.png`);

      const showBtn = document.createElement("button");
      const showIcon = document.createElement(`img`);
      showIcon.className = `show-icon`;
      showIcon.src = `${showIconUrl}`;
      showBtn.className = "wood-button-dark";
      //showBtn.className = "slot-button";
      //showBtn.classList.add(`rare-slot`);
      //showBtn.textContent = "Z";
      showBtn.onclick = (e) => {
        e.stopPropagation();
        showInvItemPopup(item._id);
      };

      showBtn.appendChild(showIcon);
      
      btns.appendChild(showBtn);
      
      /*const sellBtn = document.createElement("button");
      const sellIcon = document.createElement(`img`);
      sellIcon.className = `show-icon`;
      sellIcon.src = `${ASSET_BASE}img/icons/sell-item-icon.png`;
      sellBtn.className = "wood-button-dark";
      //sellBtn.classList.add(`unique-slot`);
      //sellBtn.textContent = "S";
      sellBtn.onclick = (e) => {
        e.stopPropagation();
        sellItem(item._id);
      };

      sellBtn.appendChild(sellIcon);*/
      
     // console.log(`item typ`, item.typ);
       
      const foodState = gameState.resources.foodState;
      const foodLocked = gameState.resources.foodState.active;

      if (item.typ === `heal_potion`) {
       // console.log(`to mikstura leczaca`);
        const potionIconUrl = assetManager.getResolvedAsset(`img/icons/equip-potion-icon.png`);

        const potionBtn = document.createElement("button");
        const potionIcon = document.createElement(`img`);
        potionIcon.className = `show-icon`;
        potionIcon.src = `${potionIconUrl}`;
        potionBtn.className = "wood-button-dark";
        potionBtn.onclick = (e) => {
          e.stopPropagation();
          insertPotionToSlot(item._id);
        };
      
        potionBtn.appendChild(potionIcon);
        btns.appendChild(potionBtn);
      } else if(item.typ === `meal`) {  
       // console.log(`to posiłek`);
        const eatIconUrl = assetManager.getResolvedAsset(`img/icons/eat-icon.png`);

        const foodBtn = document.createElement("button");
        const foodIcon = document.createElement(`img`);
        foodIcon.className = `show-icon`;
        foodIcon.src = `${eatIconUrl}`;
        foodBtn.className = "wood-button-dark";
         
        
        if (foodState.active && foodState.expiresAt) {
          foodBtn.disabled = true;
          slot.classList.add("locked");

          //slot.dataset.lockedText = t("satiety_label");
          slot.setAttribute("data-locked-text", t("satiety_label"));
           
          const timeLeft = foodState.expiresAt - Date.now();

          const timer = document.createElement("div");
          timer.className = "food-timer";
          timer.textContent = formatTimeLeft(timeLeft);

          setInterval(() => {
            if (!foodState.active || !foodState.expiresAt) return;

            const timeLeft = foodState.expiresAt - Date.now();
            if (timeLeft <= 0) return;

            document.querySelectorAll(".food-timer").forEach(el => {
             el.textContent = formatTimeLeft(timeLeft);
            });
          }, 1000);
           
           
          slot.appendChild(timer);
          } else {
            foodBtn.onclick = (e) => {
              e.stopPropagation();
              useFood(item._id);
            };
          }
         
         /*if (foodLocked) {
          slot.classList.add("locked");
          foodBtn.disabled = true;
        } else {
          foodBtn.onclick = (e) => {
            e.stopPropagation();
            useFood(item._id);
          };
        }*/
         
        /*if (isFoodOnCooldown()) {
         foodBtn.disabled = true;
         slot.classList.add("locked");
        } else {
          foodBtn.onclick = (e) => {
            e.stopPropagation();
            useFood(item._id);
          };
        }*/
      
        foodBtn.appendChild(foodIcon);
        btns.appendChild(foodBtn);
      } else {
       // console.log(`to zwykly item`);
        const compareIconUrl = assetManager.getResolvedAsset(`img/icons/comparing-icon.png`);

        const compareBtn = document.createElement("button");
        const compareIcon = document.createElement(`img`);
        compareIcon.className = `show-icon`;
        compareIcon.src = `${compareIconUrl}`;
        compareBtn.className = "wood-button-dark";
        compareBtn.onclick = (e) => {
          e.stopPropagation();
          showComparePopup(item._id);
          playSound(`open`, 0.4);
        };

        compareBtn.appendChild(compareIcon);
        btns.appendChild(compareBtn);
         
        if (item.klasa === "special") {
          compareBtn.classList.add(`hidden`);
        }
         
        if (item.id === "bread") {
          compareBtn.classList.add(`hidden`);
        }
  
      }
       
            
      // wartość 💰
     /* const valueDiv = document.createElement("div");
      valueDiv.className = "slot-value unique-slot";
      valueDiv.innerHTML = `<span class="icon"></span> ${item.wartosc || 0}`;*/

      const levelDiv = document.createElement("div");
      levelDiv.className = `slot-level ${item.klasa}`;
      levelDiv.innerHTML = `<span class="icon"></span> ${item.level || 1}`;
        
      if(gameState.char.level < item.level) {
        levelDiv.classList.add("lvl-blocked");
      }
      
      const quantityDiv = document.createElement("div");
      if(item.typ === 'heal_potion') {
         // console.log("item potion", item.quantity);
     
          quantityDiv.className = "slot-quantity";
          quantityDiv.innerHTML = `${item.quantity} <span class="icon">${t("pcs_label")}</span> `;
          //const slotIndex = gameState.inventory.findIndex(it => it === item);
          const slotIndex = gameState.inventory.findIndex(it => it._id === item._id);
          item.stackIndex = slotIndex;
         // console.log("item slotIndex", slotIndex);
      }
      
      slot.appendChild(btns);
      slot.appendChild(levelDiv);
      //slot.appendChild(valueDiv);
      slot.appendChild(quantityDiv);
    
      slot.onclick = () => {
        const wasActive = slot.classList.contains("active");
         
        document.querySelectorAll(".inventory-grid .slot.active")
          .forEach(s => s.classList.remove("active"));
        //slot.classList.add("active");
         //console.log("activeSlot index", i);
         
        playSound(`open-slot`, 0.4);
         
        saveGame();
         
        if (wasActive) return;
         
        if (!slot.classList.contains("empty")) {
          // tylko jeżeli slot ma item
          slot.classList.add("active");
        } /*else {
          slot.classList.remove("active");
        }*/
      };
    } else {
      slot.classList.add("empty", "common");
      slot.onclick = () => {
        document.querySelectorAll(".inventory-grid .slot.active")
          .forEach(s => s.classList.remove("active"));
        //slot.classList.add("active");
        if (!slot.classList.contains("empty")) {
          // tylko jeżeli slot ma item
          slot.classList.add("active");
        }  
         
        playSound(`open-slot`, 0.4);

      };
  
    }
    
    grid.appendChild(slot);
  }

  container.appendChild(grid);
    
  const activeSlotData = gameState.world.activeSlot;
   
 // console.log("activeSlotData", activeSlotData);
  
  if (activeSlotData >= 0) {
   // console.log("activeSlot");
    const i = activeSlotData;
    const slotElement = document.querySelector(`[data-index="${i}"]`);
   // console.log("slotElement", slotElement);
    if (slotElement) {
     // console.log("slot potion active");
      slotElement.classList.add("active"); // albo wywołaj funkcję, która rozwija slot
    }
  }
   
   //saveGame();
}

function showInvItemPopup(itemId) {
  const popup = document.getElementById("item-popup");
  const content = document.getElementById("popup-content");
  const charLevel = gameState.char.level || 1;
  const itemIndex = gameState.inventory.findIndex(i => i._id === itemId);
 // console.log("itemIndex popup", itemIndex);
  if (itemIndex === -1) return;

  const item = gameState.inventory[itemIndex];
  
  const baseHTML = renderBaseStats(item, charLevel)
  const implicitHTML = renderImplicitStats(item);
  const statsHTML = renderItemStats(item);
  const combatAffixes = renderCombatAffixes(item);
  const exclusiveStats = renderExclusiveAffixes(item);
  const styleHTML = renderWeaponStyle(item);
  const classLabel = translateClass(item.klasa); // np. "Epicki", "Unikalny" itd.
  const itemName = getItemName(item); 

 // console.log(`statsHtml in popup inventory`, statsHTML);
  setPopupBackground(content, item.klasa);
   
  content.classList.add(`window-panel`);
 
  //content.setAttribute("data-class", `${item.klasa}`);
   
  const spriteUrl = assetManager.getResolvedAsset(`img/items/${item.sprite}`);
  const closeUrl = assetManager.getResolvedAsset(`img/buttons/close-btn.png`);

  content.innerHTML = `
    <div class="popup-image-wrapper-normal ${item.klasa}" >
      <img src="${spriteUrl}" alt="${item.nazwa}" class="item-popup-image" />
    </div>
    
    <strong class="item-name item-name-${item.klasa}">${itemName}</strong><br>
    <div class="sparator"></div>
    <div class="item-base-stats-normal">
      ${baseHTML}
    </div>
    <div class="item-stats-normal">
      ${styleHTML}
    </div>
    <div class="item-stats-normal">
      ${implicitHTML}
    </div>
    <div class="item-stats-normal">
      ${statsHTML}
    </div>
    <div class="item-stats-normal">
      ${combatAffixes}
    </div>
    <div class="item-stats-normal">
      ${exclusiveStats}
    </div>
    <div class="item-separator"></div>
    <div class="item-footer-normal">
      <span>${t(item.baseName)} (${t("item_lvl_text")} ${item.level})</span>
      <span class="item-value-normal">💰 ${item.wartosc || 0}</span>
    </div>
    <div class="center-buttons">
      <button class="item-button" id="equip-btn">${t("equip_btn")}</button>
      <button class="item-button" id="compare-btn">${t("compare_btn")}</button>
     <!-- <button class="item-button" id="discover-btn">${t("discover_btn")}</button> -->
    </div>
    <div class="close-btn-wrapper" id="item-close-wrapper-item">
      <button class="close-button" id="item-close-btn" onclick="closeInvItemPopup()"></button>
      <img src="${closeUrl}" alt="Zamknij" class="close-btn-frame" />
   </div> 
  `;

   applyImageFallback(content);
   
   const equipBtn = document.getElementById("equip-btn");
   setGlobalButtonTexture(equipBtn);

   const compareBtn = document.getElementById("compare-btn");
   setGlobalButtonTexture(compareBtn);
   
   /*const discoverBtn = document.getElementById("discover-btn");
   setGlobalButtonTexture(discoverBtn);*/
   
   // Domyślne zachowanie
   equipBtn.onclick = () => equipItem(item._id);
   compareBtn.onclick = () => {
      showComparePopup(itemId);
      playSound(`open`, 0.4);
   };
   
   /*const hasCombatStat = item.statystyki?.some(stat => stat.category === "combat") || false;
   
   if(hasCombatStat) {
      discoverBtn.onclick = () => discoverItem(item._id);
   } else {
      discoverBtn.classList.add(`hidden`);
   }
   
   if(item.discovered) {
      discoverBtn.classList.add(`hidden`);
   }*/
      
   // ======================================
   //      SPECJALNE ZACHOWANIE DLA POTIONU
   // ======================================
   if (item.typ === "heal_potion") {
    
    equipBtn.remove();
    //discoverBtn.remove();
      
    // zmień akcję equip → insertPotionToSlot
    //equipBtn.onclick = () => usePotion(item._id);
    compareBtn.onclick = () => insertPotionToSlot(item._id);
    // opcjonalnie zmień tekst
    //equipBtn.textContent = "UŻYJ";
    compareBtn.textContent = `${t("equip_btn")}`;
   }
   
   if (item.typ === "Posiłek") {
      
    //discoverBtn.remove();
      
    equipBtn.onclick = () => useFood(item._id);
    //compareBtn.onclick = () => insertPotionToSlot(item._id);
    // opcjonalnie zmień tekst
    equipBtn.textContent =`${t("eat_btn")}`;
    //compareBtn.textContent = "ZAŁÓŻ";
    compareBtn.classList.add(`hidden`);
   }
   
   if (item.klasa === "special") {
      compareBtn.classList.add(`hidden`);
      //discoverBtn.classList.add(`hidden`);
   }
   
   playSound("open", 0.4);
   
   popup.classList.remove("hidden");
}

function discoverItem(item) {
   /*const itemIndex = gameState.inventory.findIndex(i => i._id === itemId);
   if (itemIndex === -1) return;

   const item = gameState.inventory[itemIndex];*/
   const newlyDiscovered = [];
   
   const combatStats = item.statystyki.filter(
     stat => stat.category === "combat"
   );

   combatStats.forEach(stat => {
     const affixId = stat.id;
     //let affix = gameState.char.discoveredCombatAffixes[affixId];

      const codex = gameState.char.combatAffixCodex;
      
     // console.error(`affixId, discovered before add`, affixId, gameState.char.combatAffixCodex[affixId]?.discovered);

     //const isDiscovered = gameState.char.discoveredCombatAffixes.has(affixId);
     const isDiscovered = gameState.char.combatAffixCodex[affixId]?.discovered || false;
      
     if (!isDiscovered) {
       //gameState.char.discoveredCombatAffixes.add(affixId);
       gameState.char.combatAffixCodex[affixId].discovered = true;
       /*let affix = gameState.char.discoveredCombatAffixes[affixId];
       console.error(`affixId, discovered before add`, affixId, affix);

       affix = true;*/
       newlyDiscovered.push(affixId);
     }
      
     //console.error(`affixId, discovered after add`, affixId, gameState.char.combatAffixCodex[affixId]?.discovered);

     // pierwszy raz
     /*if (!affix.discovered) {
       affix.discovered = true;
       newlyDiscovered.push(affixId);
     }*/
      
      
     /*if (gameState.char.combatAffixes[affixId]) {
       gameState.char.combatAffixes[affixId].discovered = true;
       console.error(`gameState.char.combatAffixes`, gameState.char.combatAffixes[affixId]);
       newlyDiscovered.push(affixId);
     }*/
      
   });
   
   item.discovered = true;
   
   if (newlyDiscovered.length) {
     //console.log("Nowe affixy:", newlyDiscovered);

     showInfoAlert(`${t("unlock_new_combat_affixes")}`, 1700, true);
   }
   
   saveGame();
   
   //showInvItemPopup(itemId);
}

function useFood(itemId) {
 
  const itemIndex = gameState.inventory.findIndex(i => i._id === itemId);
 // console.log("itemIndex w useFood", itemIndex);
  const foodState = gameState.resources.foodState;
  const item = gameState.inventory[itemIndex];
  const regen = item.statystyki.find(s => s.id === "energy_flat");
  const cooldown = item.statystyki.find(s => s.id === "energy_meal_cooldown");

  //console.error("food item: ", item.nazwa);
   
  gainEnergy(regen.value);
    
  const now = Date.now();

  // cooldown (sytość)
  foodState.active = true;
  foodState.startedAt = now;
  foodState.expiresAt = now + cooldown.value * 60 * 1000;
  foodState.penalty = 0.3;
   
   
  //item.quantity--;
  //inventory[item.stackIndex] = item;
   
   gameState.inventory.splice(itemIndex, 1);
   
  /*if(item.quantity <= 0) {
      inventory.splice(itemIndex, 1);
      closeItemPopup();
  }*/         
  
   saveGame();
  closeInvItemPopup();
       
  //localStorage.setItem("inventory", JSON.stringify(inventory));
   
  renderInventory();
  renderStats();
}

/*function usePotion(index) {
  //const itemIndex = gameState.inventory.findIndex(i => i._id === itemId);
  const item = gameState.resources.potions[index];
  //console.log("itemIndex w usePotion", itemIndex);
  
  //const item = gameState.inventory[itemIndex];
   console.log("item w usePotion", item.nazwa, item.baseName);

  const healPotion = item.statystyki.find(s => s.id === "heal_percent");
   
 // console.log("potion heal: ", item.nazwa);

  healPlayer(healPotion.value);
  
  item.quantity--;
  gameState.inventory[item.stackIndex] = item;
               
  if(item.quantity <= 0) {
      gameState.inventory.splice(itemIndex, 1);
      closeInvItemPopup();
  }         
       
  //localStorage.setItem("inventory", JSON.stringify(inventory));
   
   saveGame();
 // renderInventory();
}*/


function closeInvItemPopup() {
 //  console.log("zamykam popup");
   document.getElementById("item-popup").classList.add("hidden");
}

function showComparePopup(itemId, key = null) {
  closeInvItemPopup();
  
  const popup = document.getElementById("compare-popup");
  const left = document.getElementById("popup-left");
  const content = document.getElementById("content-left");
   
  let itemIndex = gameState.inventory.findIndex(i => i._id === itemId);
  if(key) {
    // console.log("key", key);
     itemIndex = gameState.resources.shopItems[key].findIndex(i => i._id === itemId);
     //console.log("itemIndex", itemIndex);
  }
   
//  console.log("itemIndex popup", itemIndex);
  if (itemIndex === -1) return;

  let item = gameState.inventory[itemIndex];
  if(key) {
     item = gameState.resources.shopItems[key][itemIndex];
  }
 
  const charLevel = gameState.char.level || 1;
   
  const baseHTML = renderBaseStats(item, charLevel)
  const implicitHTML = renderImplicitStats(item);
  const statsHTML = renderItemStats(item);
  const combatAffixes = renderCombatAffixes(item);
  const exclusiveStats = renderExclusiveAffixes(item);
  const styleHTML = renderWeaponStyle(item);
  const itemName = getItemName(item); 

  setPopupBackground2(left, item.klasa);
  
  //left.classList.add(`window-panel`);
  
  left.className = `item-panel`;// ${item.klasa}`;
  //left.className = `popup-content`;
  
  const spriteUrl = assetManager.getResolvedAsset(`img/items/${item.sprite}`);
   
  content.innerHTML = `
    <div class="popup-image-wrapper ${item.klasa}" >
      <img src="${spriteUrl}" alt="${item.nazwa}" class="item-popup-image" />
    </div>
    
    <strong class="item-name item-name-${item.klasa}">${itemName}</strong>
    <!--<div class="sparator"></div>-->
    <div class="item-base-stats">
      ${baseHTML}
    </div>
    <div class="item-stats">
      ${styleHTML}
    </div>
    <div class="item-stats">
      ${implicitHTML}
    </div>
    <div class="item-stats">
      ${statsHTML}
    </div>
    <div class="item-stats">
      ${combatAffixes}
    </div>
    <div class="item-stats">
       ${exclusiveStats}
    </div>
    <div class="item-separator"></div>
    <div class="item-footer">
      <span>${t(item.baseName)} (${t("item_lvl_text")} ${item.level})</span>
      <span class="item-value">💰 ${(item.wartosc).toFixed(0) || 0}</span>
    </div>
   <!-- <div class="center-buttons">
      <button class="item-button" id="equip-btn2" style="width: 100px;" onclick="equipComparedItem('${item._id}')">${t("equip_btn")}</button>
    </div>-->
      `;

   applyImageFallback(content);
   
   const equipBtn = document.getElementById("equip-btn2");
   setGlobalButtonTexture(equipBtn);
  
   const backBtn = document.getElementById("back-btn");
   setGlobalButtonTexture(backBtn);
   
   fadeIn(equipBtn);
   
   equipBtn.onclick = () => equipComparedItem(item._id, key);
   
   equipBtn.classList.remove(`hidden`);

   if(key) {
     equipBtn.classList.add(`hidden`);
   }
   
   const leftPanel = document.querySelector(".item-panel.show");
  /*if (leftPanel && !leftPanel.querySelector('.item-frame')) {
    const frame = document.createElement('img');
    frame.src = `${ASSET_BASE}img/frames/frame1.png`;
    frame.alt = 'Ramka';
    frame.classList.add('item-frame');
    leftPanel.appendChild(frame); // <--- dodajemy do .item-panel, NIE do #popup-left
  }*/
  
  //playSound("open", 0.4);
   
  compareItem(itemId, key);
  popup.classList.remove("hidden");
}

/*function showItemPopup(itemId) {
  const popup = document.getElementById("popup");
  const popupContent = document.getElementById("popup-content");
  
  const itemIndex = inventory.findIndex(i => i._id === itemId);
  console.log("itemIndex popup", itemIndex);
  if (itemIndex === -1) return;
  
  const item = inventory[itemIndex];

  //const popup = document.getElementById("item-popup");
  const left = document.getElementById("popup-left");
  const right = document.getElementById("popup-right");

  const charLevel = JSON.parse(localStorage.getItem("character") || '{}').level || 1;
  const statsHTML = renderItemStats(item, charLevel);
  
  console.log("item sprite", item.sprite);
  
  left.className = `item-panel ${item.klasa}`;
  left.innerHTML = `
    <div>
      <img src="assets/img/${item.sprite || 'img/default.png'}" 
           alt="${item.nazwa}" 
           class="item-popup-image ${item.klasa}-img" 
           style="width:110px; height:150px; margin-top:8px"/>
    </div>
    <strong class="item-name item-name-${item.klasa}">${item.nazwa}</strong>
    <span class="item-class">(${getGenderedClassLabel(item.klasa, item.baseName || item.typ)})</span><br>
    <div class="item-stats">${statsHTML}</div>
    <div class="item-footer">
      <span>${item.typ} (Poz. ${item.level})</span>
      <span class="item-value">💰 ${item.wartosc || 0}</span>
    </div>
    <div class="center-buttons">
      <button class="item-button" onclick="equipItem('${itemIndex}')">Załóż</button>
      <button class="item-button" onclick="sellItem('${itemIndex}')">S</button>
      <button class="item-button" onclick="closeItemPopup()">X</button>
    </div>
  `;
  
   compareItem(itemId);
   popup.classList.remove("hidden");
}*/

function compareItem(itemId, key = null) {
  const popup = document.getElementById("compare-popup");
  const right = document.getElementById("popup-right");
  const content = document.getElementById("content-right");
   
  let itemIndex = gameState.inventory.findIndex(i => i._id === itemId);
  if(key) {
     itemIndex = gameState.resources.shopItems[key].findIndex(i => i._id === itemId);
  }
   
//  console.log("itemIndex popup", itemIndex);
  //if (itemIndex === -1) return;
   
  let item = gameState.inventory.find(i => i._id === itemId);
  if(key) {
     item = gameState.resources.shopItems[key][itemIndex];
  }

  if (!item) return;

  window.justCompared = true;

  const equipped = gameState.char.equipment?.[item.typ];
  const charLevel = gameState.char.level || 1;
  
  if (equipped) {
    
    setPopupBackground2(right, equipped.klasa);
    
    const baseHTML = renderBaseStats(equipped, charLevel);
    const implicitHTML = renderImplicitStats(equipped);
    const statsHTML = renderItemStats(equipped);
    const combatAffixes = renderCombatAffixes(equipped);
    const exclusiveStats = renderExclusiveAffixes(equipped);
    const styleHTML = renderWeaponStyle(equipped);
    const itemName = getItemName(equipped); 

    const spriteUrl = assetManager.getResolvedAsset(`img/items/${equipped.sprite}`);

    right.className = `item-panel`;// ${equipped.klasa} show`;
    content.innerHTML = `
    <div class="popup-image-wrapper ${equipped.klasa}" >
      <img src="${spriteUrl}" alt="${equipped.nazwa}" class="item-popup-image" />
    </div>
    
    <strong class="item-name item-name-${equipped.klasa}">${itemName}</strong>
    <!--<div class="sparator"></div>-->
    <div class="item-base-stats">
      ${baseHTML}
    </div>
    <div class="item-stats">
      ${styleHTML}
    </div>
    <div class="item-stats">
      ${implicitHTML}
    </div>
    <div class="item-stats">
      ${statsHTML}
    </div>
    <div class="item-stats">
      ${combatAffixes}
    </div>
    <div class="item-stats">
       ${exclusiveStats}
    </div>
    <div class="item-separator"></div>
    <div class="item-footer">
      <span>${t(equipped.baseName)} (${t("item_lvl_text")} ${equipped.level})</span>
      <span class="item-value">💰 ${equipped.wartosc || 0}</span>
    </div>
     `;
    
   applyImageFallback(content);
     
   const rightPanel = document.querySelector("#panel-2");
   if (rightPanel && !rightPanel.querySelector('.item-frame')) {
   /*  const frame = document.createElement('img');
     frame.src = `${ASSET_BASE}img/frames/frame1.png`;
     frame.alt = 'Ramka';
     frame.classList.add('item-frame');
     rightPanel.appendChild(frame);*/ // <--- dodajemy do .item-panel, NIE do #popup-left
   }
  } else {
   
    setPopupBackground2(right, item.klasa);
    right.className = `item-panel show`;
    content.innerHTML = `<div style='flex:1; text-align:center; margin-top: 25px;'>${t("no_equipped_item")}</div>`;
  }
  
  popup.classList.add("show");
   
  //playSound("open", 0.4);
  gameState.resources.isComparing = true;
  diffStats(item);
   
}


/*function compareItem(itemId) {
  const popup = document.getElementById("popup");
  const popupContent = document.getElementById("popup-content");
  const left = document.getElementById("popup-left");
  const right = document.getElementById("popup-right");
  const itemIndex = inventory.findIndex(i => i._id === itemId);
  if (itemIndex === -1) return;

  const item = inventory[itemIndex];

  localStorage.setItem("compareItem", JSON.stringify(item));
  window.justCompared = true;

  const char = JSON.parse(localStorage.getItem("character") || '{"equipment":{}}');
  const equipped = char.equipment?.[item.typ];
  const charLevel = char.level || 1;

  if (equipped) {
    const statsHTML = renderItemStats(equipped, charLevel);
    right.innerHTML = `
      <div>
        <img src="assets/img/${equipped.sprite || 'img/default.png'}" 
             alt="${equipped.nazwa}" 
             class="item-popup-image ${equipped.klasa}-img" 
             style="width:110px; height:150px; margin-top:8px"/>
      </div>
      <strong class="item-name item-name-${equipped.klasa}">${equipped.nazwa}</strong>
      <span class="item-class">(${getGenderedClassLabel(equipped.klasa, equipped.baseName || equipped.typ)})</span><br>
      <div class="item-stats">${statsHTML}</div>
      <div class="item-footer">
        <span>${equipped.typ} (${t("item_lvl_text")} ${equipped.level})</span>
        <span class="item-value">💰 ${equipped.wartosc || 0}</span>
      </div>
    `;
    right.className = `item-panel ${equipped.klasa} show`;
  } else {
    right.className = `item-panel show`;
    right.innerHTML = `<div style='flex:1; text-align:center;'>Brak założonego przedmiotu tego typu.</div>`;
  }
   
  popup.classList.add("show");

  diffStats(item);
  updateStatsBar();
}*/

function closeComparePopup() {
   document.getElementById("compare-popup").classList.add("hidden");
   
   clearAllDiffs();
   gameState.resources.isComparing = false;
   const hpEl = document.getElementById(`hp-stat-id`);
   const goldEl = document.getElementById(`gold-stat-id`);
   const energyEl = document.getElementById(`energy-stat-id`);
  
   hpEl.classList.add(`hidden`);
   energyEl.classList.remove(`hidden`);
   goldEl.classList.remove(`hidden`);
}

function equipItem(itemId, key = null) {
  let itemIndex = gameState.inventory.findIndex(i => i._id === itemId);
  if(key) {
     itemIndex = gameState.resources.shopItems[key].findIndex(i => i._id === itemId);
  }
   
 // console.log("itemIndex w equipItem", itemIndex);
  if (itemIndex === -1) {
    //sellMessage(`Przedmiot sprzedany!`);
    return;
  } 
   
  let item = gameState.inventory[itemIndex];
  if(key) {
     item = gameState.resources.shopItems[key][itemIndex];
  }

  const equipped = gameState.char.equipment?.[item.typ];
   
  // --- Blokady ---
  if (item.typ === "weapon" && item.twoHanded && gameState.char.equipment?.["shield"]) {
    showInfoAlert(`${t("equip_2h_alert")}`);
    return;
  }
  if (item.typ === "shield" && gameState.char.equipment?.["weapon"]?.twoHanded) {
    showInfoAlert(`${t("equip_shield_alert")}`);
    return;
  }
   
  if (item.klasa === "special") {
    return showInfoAlert(`${t("equip_special_alert")}`);
  }
  
  if (gameState.char.level < item.requiredLevel) {
    showInfoAlert(`${t("equip_lowlvl_alert")}`);
    return;
  }

  if(item.typ === `shield`) {
    setBlockMode(`timed`);
  } 
   
   // --- Zamiana ---
  const current = equipped;
  if (current) gameState.inventory.push(current);
   
  gameState.char.equipment[item.typ] = item;
  gameState.inventory.splice(itemIndex, 1);

  playSound(`equip-universal`, 1, randomRange(0.95, 1.05), 0.45);
  
  saveGame();
  //showDiff();
  diffStats(item);
  refreshCharacterStats();
  renderStats();
  closeInvItemPopup();
  renderInventory();
  clearAllDiffs();
   
  discoverItem(item);
   
}

function equipComparedItem(itemId, key = null) {
  let itemIndex = gameState.inventory.findIndex(i => i._id === itemId);
   
  if(key) {
     itemIndex = gameState.resources.shopItems[key].findIndex(i => i._id === itemId);
  }
   
 // console.log("itemIndex w equipItem", itemIndex);
  if (itemIndex === -1) {
    sellMessage(`Przedmiot sprzedany!`);
    return;
  } 
 // console.log("dalej w equipItem");
   
  let item = gameState.inventory[itemIndex];
  if(key) {
     item = gameState.resources.shopItems[key][itemIndex];
  }
  
  const equipped = gameState.char.equipment?.[item.typ];
   
  // --- Blokady ---
  if (item.typ === "weapon" && item.twoHanded && gameState.char.equipment?.["shield"]) {
    return showInfoAlert(`${t("equip_2h_alert")}`);
  }
  if (item.typ === "shield" && gameState.char.equipment?.["weapon"]?.twoHanded) {
    return showInfoAlert(`${t("equip_shield_alert")}`);
  }
  if (item.klasa === "special") {
    return showInfoAlert(`${t("equip_special_alert")}`);
  }


  if (gameState.char.level < item.requiredLevel) {
    return showInfoAlert(`${t("equip_lowlvl_alert")}`);
  }

  if(item.typ === `shield`) {
    setBlockMode(`timed`);
  }
   
  // --- Zamiana ---
  const current = equipped;
  if (current) gameState.inventory.push(current);
  
  clearAllDiffs();
   
  gameState.char.equipment[item.typ] = item;
  gameState.inventory.splice(itemIndex, 1);
   
  saveGame();
  showDiff();
  renderStats();
  renderInventory();
  
  discoverItem(item);
   
  const closeBtn = document.getElementById(`item-close-wrapper`);
  const equipBtn = document.getElementById(`equip-btn2`);
  const backBtn = document.getElementById(`back-btn`);
   
  fadeOut(closeBtn);
  fadeOut(equipBtn);
  fadeOut(backBtn);
  setTimeout(() => {
    animateSwap(() => {
   // setTimeout(() => {
      if (current) {
         showComparePopup(current._id, key);
         compareItem(current._id, key);
         fadeIn(backBtn);
         fadeIn(equipBtn);
         playSound(`equip-universal`, 1, randomRange(0.95, 1.05), 0.45);
      } else {
       // console.log(`nie bylo nic zalozone`);
        const left = document.getElementById("popup-left");
        const contentL = document.getElementById("content-left");
        const right = document.getElementById("popup-right");
        const contentR = document.getElementById("content-right");
          
          setPopupBackground2(left, item.klasa);
        
          // pokaż w lewym panelu placeholder zamiast itemu
          left.className = "item-panel show";
          contentL.innerHTML = `<div style="flex:1; text-align:center; margin-top: 25px;">${t("no_equipped_item")}</div>`;
        
          //const equipBtn = document.getElementById("equip-btn2");
          //equipBtn.classList.add(`hidden`);
          //equipBtn.style.opacity = `0`;
         
          // pokaż w prawym panelu właśnie założony item
          const charLevel = gameState.char.level || 1;
          const baseHTML = renderBaseStats(item, charLevel);
          const implicitHTML = renderImplicitStats(item);
          const statsHTML = renderItemStats(item);
          const combatAffixes = renderCombatAffixes(item);
          const exclusiveStats = renderExclusiveAffixes(item);
          const styleHTML = renderWeaponStyle(item);
          const itemName = getItemName(item); 

          setPopupBackground2(right, item.klasa);

          const spriteUrl = assetManager.getResolvedAsset(`img/items/${item.sprite}`);
 
          right.className = `item-panel show`;// ${item.klasa} show`;
          contentR.innerHTML = `
           <div class="popup-image-wrapper ${item.klasa}" >
             <img src="${spriteUrl}" alt="${item.nazwa}" class="item-popup-image" />
           </div>
          
           <strong class="item-name item-name-${item.klasa}">${itemName}</strong>
           <!--<div class="sparator"></div>-->
           <div class="item-base-stats">
             ${baseHTML}
           </div>
           <div class="item-stats">
             ${styleHTML}
           </div>
           <div class="item-stats">
             ${implicitHTML}
           </div>
           <div class="item-stats">
             ${statsHTML}
           </div>
           <div class="item-stats">
             ${combatAffixes}
           </div>
           <div class="item-stats">
             ${exclusiveStats}
           </div>
           <div class="item-separator"></div>
           <div class="item-footer">
             <span>${t(item.baseName)} (${t("item_lvl_text")} ${item.level})</span>
             <span class="item-value">💰 ${(item.wartosc).toFixed(0) || 0}</span>
           </div>
         `;
               
         applyImageFallback(contentR);
         
         playSound(`equip-universal`, 1, randomRange(0.95, 1.05), 0.45);
         
         fadeIn(backBtn);
         //fadeIn(equipBtn);
         diffStats(item);
      }
    });
  }, 100);
  
}

function animateSwap(onComplete) {
  const left = document.getElementById("panel-1");
  const right = document.getElementById("panel-2");

  // Usuń stare animacje, jeśli jakieś są
  left.classList.remove("item-swap-left");
  right.classList.remove("item-swap-right");

  // Wymuś reflow (żeby przeglądarka zauważyła zmianę klas)
  void left.offsetWidth;
  void right.offsetWidth;

  // Ustaw poprawne z-index — lewy nad prawym
  left.style.zIndex = "2";
  right.style.zIndex = "1";

  // Uruchom animację
  left.classList.add("item-swap-left");
  right.classList.add("item-swap-right");

  let ended = 0;
  const onEnd = () => {
    ended++;
    if (ended === 2) {
      // Reset klas i transformacji po animacji
      left.classList.remove("item-swap-left");
      right.classList.remove("item-swap-right");
      left.style.transform = "none";
      right.style.transform = "none";

      // Zresetuj z-index, żeby wróciły do normalnego stanu
      left.style.zIndex = "";
      right.style.zIndex = "";

      // Po zakończeniu animacji — dopiero teraz aktualizujemy zawartość
      if (typeof onComplete === "function") onComplete();
    }
  };

  left.addEventListener("animationend", onEnd, { once: true });
  right.addEventListener("animationend", onEnd, { once: true });
}

function fadeIn(el) {
  if (!el) return;
  el.classList.add('fade-toggle');
  el.classList.remove('fade-hidden');
}

function fadeOut(el) {
  if (!el) return;
  el.classList.add('fade-toggle');
  el.classList.add('fade-hidden');
}

function showPopupSmooth(el) {
  el.classList.remove('hidden'); // przywróć do DOM
  requestAnimationFrame(() => fadeIn(el)); // płynne pojawienie
}

function hidePopupSmooth(el) {
  fadeOut(el);
  el.addEventListener('transitionend', () => {
    el.classList.add('hidden'); // całkowicie usuń z DOM po animacji
  }, { once: true });
}

/*function animateSwap() {
  const left = document.getElementById("panel-1");
  const right = document.getElementById("panel-2");

  left.classList.remove("item-swap-left");
  right.classList.remove("item-swap-right");

  void left.offsetWidth;
  void right.offsetWidth;

  left.classList.add("item-swap-left");
  right.classList.add("item-swap-right");

  left.addEventListener("animationend", () => {
    left.classList.remove("item-swap-left");
    right.classList.remove("item-swap-right");
  }, { once: true });
}*/

/*function animateSwap() {
  const left = document.getElementById("popup-left");
  const right = document.getElementById("popup-right");

  // usuń stare animacje, żeby mogły się ponownie odpalić
  left.classList.remove("item-swap-left");
  right.classList.remove("item-swap-right");

  // małe opóźnienie, żeby przeglądarka zauważyła usunięcie klas
  void left.offsetWidth; 
  void right.offsetWidth;

  left.classList.add("item-swap-left");
  right.classList.add("item-swap-right");

  // opcjonalnie: po zakończeniu animacji odśwież treści
  left.addEventListener("animationend", () => {
    left.classList.remove("item-swap-left");
    right.classList.remove("item-swap-right");
  }, { once: true });
}
*/

function insertPotionToSlot(itemId) {
  const itemIndex = gameState.inventory.findIndex(i => i._id === itemId);
  //console.log("itemId w insertPotionToSlot", itemId);
  //console.log("itemIndex w insertPotionToSlot", itemIndex);
  
  const item = gameState.inventory[itemIndex];
  
  const usedPotions = gameState.resources.potions.filter(p => p !== null).length;
   
  if(usedPotions >= 7) {
      //alert("Brak miejsca na mikstury!");
      showInfoAlert(`${t("no_space_potions_alert")}`);
      return;
    } else {  
      addPotionToBar(item);
      //potions.push(item);
      item.quantity--;
      gameState.inventory[item.stackIndex] = item;
     // healPotionQuantityInv--;
      //console.log("potion name: ", item.nazwa);
       
      if(item.quantity <= 0) {
         gameState.inventory.splice(itemIndex, 1);
      }         
       
      saveGame();
     // localStorage.setItem("inventory", JSON.stringify(inventory));
      
     // localStorage.setItem("healPotionQuantityInv", JSON.stringify(healPotionQuantityInv));
      //localStorage.setItem("potions", JSON.stringify(potions));
    } 
  
  closeInvItemPopup();
  renderInventory();
}

function showDiff(){
  ["hp", "dmg", "def", `gold`].forEach(id => {
  //if (id !== "hp-label"){
    const prev = document.getElementById(`${id}-diff-preview`);
    //console.log("prev w showDiff", prev);
    if (prev) {
      prev.textContent = "";
      prev.className = "stat-diff stat-preview";
    } 
  /*}else {
    const maxHp = parseHp();
    console.log("maxHp w showDiff", maxHp);
    maxHp.textContent = "";
    maxHp.className = "stat-diff stat-preview";
  //}*/
  });
}

function showWarning(msg) {
   const right = document.getElementById("content-right");
   right.innerHTML = `
     <div class="warning-msg">${msg}</div>`;
}

/*function showMessage(msg) {
   const right = document.getElementById("content-right");
   right.innerHTML = `
     <div class="info-msg">${msg}</div>`;
}*/

function sellMessage(msg) {
   const right = document.getElementById("content-right");
   right.innerHTML = `
     <div class="info-msg">${msg}</div>`;
}


 function diffStats(newItem) {
   const equipment = { ...gameState.char.equipment }; // kopia aktualnego eq

   equipment[newItem.typ] = newItem; // podstawiamy porównywany przedmiot w odpowiedni slot
   
   const { hp, maxHp, dmg, def } = calculateTotalStats(equipment, true);
 
   //console.log("[diffStats]", { hp, maxHp, dmg, def });
   
    if(gameState.resources.isComparing) {
       const hpEl = document.getElementById(`hp-stat-id`);
       const goldEl = document.getElementById(`gold-stat-id`);
       const energyEl = document.getElementById(`energy-stat-id`);
       
       hpEl.classList.remove(`hidden`);
       goldEl.classList.add(`hidden`);
       energyEl.classList.add(`hidden`);
 
       diffPreview("hp", maxHp)
    } else {
       const isPotion = newItem.typ === "heal_potion";
       const isFood = newItem.typ === "meal";
      // console.log("hp diff", isPotion);

       if(!isPotion && !isFood) {
          //console.log("hp label", isPotion);

         diffPreview("hp-label", maxHp);
       }
    }
 
    // console.log("after diffPreview hp-label", maxHp);
   diffPreview("dmg", dmg);
   diffPreview("def", def);
 }

function diffPreview(id, newVal) {
  let current;
  let diffEl;

  const el = document.getElementById(id);
  diffEl = document.getElementById(`${id}-diff-preview`);

  if (!el) {
    //console.warn(`[diffPreview] brak elementu el dla id=${id}`);
    return;
  }
  if (!diffEl) {
   // console.warn(`[diffPreview] brak elementu diffEl dla id=${id}-diff-preview`);
    return;
  }

  //current = parseFloat(el.textContent);
  current = parseFloat(el.dataset.value ?? 0);
   
  if(id === `hp-label`) {
    const hpText = document.getElementById("hp-label")?.innerText || "100/100";
    const currentHp = parseFloat(hpText.split("/")[0]);
    const maxHp = parseFloat(hpText.split("/")[1]);
    current = maxHp;
  }
   
  if (isNaN(current) || isNaN(newVal)) {
    console.warn(`[diffPreview] id=${id}, błędne dane`, { current, newVal });
    return;
  }
   
   //console.log("newVal, current", newVal, current);
   
  const diff = newVal - current;
  //console.warn(`[diffPreview] id=${id}, current=${current}, newVal=${newVal}, diff=${diff}`);
   
  const isCombatBuff = !gameState.resources.enterStore && !gameState.resources.isComparing;
   
  if (diff > 0) {
    diffEl.textContent = `(+${formatNumber(diff)})`;
     
    if (isCombatBuff) {
      diffEl.className = "stat-diff stat-preview stat-combat-buff";
    } else {
      diffEl.className = "stat-diff stat-preview stat-change-up";
    }
     
   // diffEl.className = "stat-diff stat-preview stat-change-up";
  } else if (diff < 0) {
    diffEl.textContent = `(${formatNumber(diff)})`;
     
    if (isCombatBuff) {
      diffEl.className = "stat-diff stat-preview stat-combat-debuff";
    } else {
      diffEl.className = "stat-diff stat-preview stat-change-down";
    }
     
    //diffEl.className = "stat-diff stat-preview stat-change-down";
  } else {
    diffEl.textContent = "";
    diffEl.className = "stat-diff stat-preview";
  }
}

/*function clearAllDiffs() {
   // Statyczna lista ID-ów, które używasz
  ["hp-label", "dmg", "def", `gold`].forEach(id => {
    // Główne diffy
    const diffEl = document.getElementById(`${id}-diff`);
    if (diffEl) {
      diffEl.textContent = "";
      diffEl.className = "stat-diff";
    }

    // Diffy w trybie preview
    const previewEl = document.getElementById(`${id}-diff-preview`);
    if (previewEl) {
      previewEl.textContent = "";
      previewEl.className = "stat-diff stat-preview";
    }

    // Skasuj timery żeby nie nadpisały pustych diffów
    if (window.diffTimers && window.diffTimers[id]) {
      clearTimeout(window.diffTimers[id]);
      delete window.diffTimers[id];
    }
  });
   
  gameState.resources.isComparing = false;
 
}*/

function clearAllDiffs(statId = null) {

   if(statId === `dmg`) {
     if(gameState.combat.activeBonus.dmg > 0) return;
   }
  
   if(statId === `def`) {
     //console.error(`def diff activeBonus.def`, gameState.combat.activeBonus.def);
     if(gameState.combat.activeBonus.def > 0) return;
   }
   
  // console.error(`diff cleared!`, statId);
   
   const ids = statId
    ? [statId]
    : ["hp-label", "dmg", "def", "gold"];

  ids.forEach(id => {

    const diffEl = document.getElementById(`${id}-diff`);
    if (diffEl) {
      diffEl.textContent = "";
      diffEl.className = "stat-diff";
    }

    const previewEl = document.getElementById(`${id}-diff-preview`);
    if (previewEl) {
      previewEl.textContent = "";
      previewEl.className = "stat-diff stat-preview";
    }

    if (window.diffTimers?.[id]) {
      clearTimeout(window.diffTimers[id]);
      delete window.diffTimers[id];
    }

  });

  if (!statId) {
    gameState.resources.isComparing = false;
  }

}

/*function sellItem(itemId) {
  const itemIndex = inventory.findIndex(i => i._id === itemId);
  if (itemIndex === -1) return;

  const item = inventory[itemIndex];
  
  const slot = document.querySelector(`.slot.not-empty img[alt="${inventory[itemIndex].nazwa}"]`)?.closest(".slot");
  if (!slot) {
    console.warn("Nie znaleziono slotu do animacji sprzedaży");
    doSell(itemIndex);
    return;
  }
  
   
  if (item.klasa === "epic" || item.klasa === "legendary") {
     showCustomConfirm(
                    `Czy na pewno chcesz sprzedać przedmiot?`,
                    () => { slot.classList.add("selling");
                            setTimeout(() => {
                                 doSell(itemIndex);
                              }, 200);
                          },
                    () => { }
     );
   } else {
     slot.classList.add("selling");
     setTimeout(() => {
       doSell(itemIndex);
     }, 200);
   }
}

function doSell(itemIndex) {
  console.log(`doSell`);
  const item = inventory[itemIndex];
  const gold = parseInt(localStorage.getItem("gold") || "0");
  localStorage.setItem("gold", gold + item.wartosc);
  inventory.splice(itemIndex, 1);
  localStorage.setItem("inventory", JSON.stringify(inventory));
  localStorage.removeItem("compareItem");

  sellMessage(`Sprzedane +${item.wartosc}💰`);
  showDiff();
  renderStats();
  renderInventory();

 // setTimeout(closeItemPopup, 1000);
}*/


function parseHp(){
    const hpText = document.getElementById("hp-label")?.innerText || "100/100";
    const maxHp = parseFloat(hpText.split("/")[1]);
 
    return maxHp;
}

/*  window.onload = () => {
    //localStorage.removeItem("compareItem");
    
     initializeGameState();
     
    document.querySelectorAll("[data-src]").forEach(img => {
         img.src = `${ASSET_BASE}${img.getAttribute("data-src")}`;
      });
    
    document.querySelectorAll(".filter-icon").forEach(icon => {
      icon.addEventListener("click", () => {
        const selectedType = icon.getAttribute("data-type");

        // Kliknięcie tej samej ikony = wyłączenie filtra
        if (currentTypeFilter === selectedType) {
          currentTypeFilter = "";
        } else {
          currentTypeFilter = selectedType;
        }

        // podświetl aktywny
        document.querySelectorAll(".filter-icon").forEach(i => i.classList.remove("active"));
        if (currentTypeFilter) {
          document
           .querySelector(`.filter-icon[data-type="${currentTypeFilter}"]`)
           ?.classList.add("active");
        }

        renderInventory();
      });
    });
  
    //console.warn(`bottom menu height: `, getComputedStyle(document.querySelector('.bottom-menu')).height);
    
    //localStorage.removeItem("activeSlot");
    //updateStatsBar();
    renderStats();
    console.log("loaded stats");
    renderInventory();
  };*/