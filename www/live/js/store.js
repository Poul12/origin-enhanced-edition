//const resources = gameState.resources;
//const world = gameState.world;
//const char = gameState.character;

const POTION_SLOTS = 7;

let uniqueUsed = {
  weapon: false,
  armor: false,
  shield: false
};

let sellMode = false; // domyślnie sklep kupuje

  // globalny licznik
let generateCount = 0;
const counterBox = document.getElementById("generate-counter");

// przykładowe kategorie
const shopCategories = {
  weapons: "Bronie",
  armors: "Zbroje",
  others: "Inne",
  special: "Specjalne"
};

// domyślne wartości "wartosc" per klasa, jeśli nie podasz ręcznie
const defaultValueByRarity = {
  common: 6,
  rare: 12,
  unique: 22,
  epic: 40,
  legendary: 80
};

// patch do generateItem - każdorazowo zwiększa licznik
/*const originalGenerateItem = generateItem;
generateItem = function(...args) {
  generateCount++;
  updateGenerateCounter();
  return originalGenerateItem.apply(this, args);
};*/

let shopItems = loadShopItemsFromStorage();

//let currentState = world;


function loadShopItemsFromStorage() {
  const base = { weapons: [], armors: [], others: [], fourth: [] };
  let defaultShop = gameState.resources.shopItems;
  
  /*if (saved) {
    try {
      parsed = JSON.parse(saved);
    } catch (e) {
      console.warn("Błąd parsowania shopItems, tworzymy nowe.", e);
      parsed = null;
    }
  }*/
  
  const finalObj = defaultShop && typeof defaultShop === "object" ? defaultShop : base;

  // upewnij się, że każda kategoria jest tablicą o długości 16
  ["weapons", "armors", "others", "fourth"].forEach(k => {
    if (!Array.isArray(finalObj[k])) finalObj[k] = [];
    while (finalObj[k].length < 16) finalObj[k].push(null);
    if (finalObj[k].length > 16) finalObj[k] = finalObj[k].slice(0, 16);
  });

  return finalObj;
}

/*function saveShopItems() {
  localStorage.setItem("shopItems", JSON.stringify(shopItems));
}*/

// --- generowanie brakujących itemów w kategorii (tylko gdy kategoria całkowicie pusta) ---
function ensureShopCategoryFilled(key) {
  // jeśli już są itemy (jakiekolwiek nie-null) - nic nie rób
  const arr = gameState.resources.shopItems[key];
  if (arr.some(x => x !== null)) return; // && generateCount !== 0) return;

  // wygeneruj count itemów (12..16) tylko raz i wstaw do pierwszych slotów
  const count = Math.floor(Math.random() * 5) + 12; // 6..9
  const items = [];

  if (key === "weapons") {
    for (let i = 0; i < count; i++) {
      const it = getRandomItem("weapon");
      if (it) {
        // upewnij się, że ma id i sprite (opcjonalnie)
        if (!it.id) it.id = `${key}-${i}-${Date.now()}-${Math.random().toString(36).slice(2,6)}`;
        items.push(it);
      }
    }
  } else if (key === "armors") {
    for (let i = 0; i < count; i++) {
      const it = getRandomItem("armor");
      if (it) {
        if (!it.id) it.id = `${key}-${i}-${Date.now()}-${Math.random().toString(36).slice(2,6)}`;
        items.push(it);
      }
    }
  } else if (key === "others") {
      items.push(makeSmallHealPotion(gameState.char.level));
      items.push(makeLightFoodItem());
      gameState.resources.healPotionQuantity = 99;
      gameState.resources.foodQuantity = 10;
  } else {
    // fourth -> pusta karta (zostaw wszystkie null)
  }

  // wstaw items w pierwsze sloty, reszta null
  for (let i = 0; i < 16; i++) {
    gameState.resources.shopItems[key][i] = items[i] || null;
  }

  //saveShopItems();
}

function generateNewShopForCity() {

  gameState.resources.shopItems = {
    weapons: Array(16).fill(null),
    armors: Array(16).fill(null),
    others: Array(16).fill(null),
    fourth: Array(16).fill(null)
  };

  fillWeaponsShop();
  fillArmorShop();
  
  ensureShopCategoryFilled("others");

  if(gameState.world.mode === `sandbox`) {
    showInfoAlert(`${t("restore_store_info")}`, 1500, true);

    playSound("open-slot", 0.4);
  }
  
}


/*function generateNewShopForCity() {

  const newShop = {
    weapons: Array(16).fill(null),
    armors: Array(16).fill(null),
    others: Array(16).fill(null),
    fourth: Array(16).fill(null)
  };

  gameState.resources.shopItems = newShop;

  ensureShopCategoryFilled("weapons");
  ensureShopCategoryFilled("armors");
  ensureShopCategoryFilled("others");

  if(gameState.world.mode === `sandbox`) {
    showInfoAlert(`Odświeżono Sklep`, 1500, true);
    playSound("open-slot", 0.4);
  }
  
  //localStorage.setItem(`shopItems_${cityId}`, JSON.stringify(shopItems));
  //saveShopItems();
}*/


function renderShop(isPotion = false) {
  const resources = gameState.resources;
  //const shopItems = resources.shopItems;
  
  //console.log("render");
  generateCount = 0; // jeśli używujesz licznika
  const container = document.getElementById("shop-content");
  container.innerHTML = "";
  
  if (sellMode) {
    renderInventoryForSelling();
    return; // kończ renderShop — pokazujemy ekwipunek zamiast oferty
  }
  
  let lastTab = gameState.world.lastShopTab;
  
  const usedPotions = resources.potions.filter(p => p !== null).length;
 
  document.getElementById("count").textContent = usedPotions;
  
  // upewnij kategorie (w razie gdy shopItems zostało ręcznie zresetowane)
  ["weapons", "armors", "others", "fourth"].forEach(k => {
    if (!Array.isArray(resources.shopItems[k])) resources.shopItems[k] = Array(16).fill(null);
    while (resources.shopItems[k].length < 16) resources.shopItems[k].push(null);
  });

  // wypełnij kategorie jeśli puste (tylko wtedy generujemy)
 // ensureShopCategoryFilled("weapons");
 // ensureShopCategoryFilled("armors");
  fillWeaponsShop();
  fillArmorShop();
  ensureShopCategoryFilled("others");
  // fourth zostaje pusta
  
  Object.entries(shopCategories).forEach(([key, label], index) => {
    const grid = document.createElement("div");
    grid.className = `shop-grid tab-content ${key === lastTab ? "active" : ""}`;
    //grid.className = `shop-grid tab-content ${index === 0 ? "active" : ""}`;
    grid.id = key;
    
    const items = resources.shopItems[key] || Array(16).fill(null);

    // 16 slotów
    for (let i = 0; i < 16; i++) {
      const slot = document.createElement("div");
      slot.className = "slot";

      slot.setAttribute("data-category", key);
      slot.setAttribute("data-index", i);
       
      const item = items[i] || null;
      if(item) {
        const soldClass = item.sold ? "sold-item" : "";
        if(soldClass === "sold-item") slot.classList.add(`${soldClass}`);
      }  
      if (item) {
        slot.classList.add(`${item.klasa}` || "common");
        //slot.classList.add(`special` || "common");
        slot.classList.add("not-empty");
        
       // const wrapper = document.createElement("div");
       // wrapper.className = "slot-wrapper";
        
        // obrazek
        const img = document.createElement("img");
        //img.src = `${ASSET_BASE}img/items/` + (item.sprite || "placeholder.png");
        setItemImage(img, item);
        img.alt = item.nazwa || "";
        img.className = "item-image";
        //img.classList.add(item.klasa + "-slot-img" || "common-slot-img");
        
        //wrapper.appendChild(img);
        slot.appendChild(img);
        
        // przyciski: przekazujemy category+index (bezpośrednio bez kluczowych referencji)
        const btns = document.createElement("div");
        btns.className = "item-buttons";
        
        const showIconUrl = assetManager.getResolvedAsset(`img/icons/show-item-icon.png`);

        const showBtn = document.createElement("button");
        const showIcon = document.createElement(`img`);
        showIcon.className = `show-icon`;
        showIcon.src = `${showIconUrl}`;
        showBtn.className = "wood-button-dark";
        showBtn.onclick = (e) => {
          e.stopPropagation();
          gameState.world.lastShopTab = key;
          saveGame();  
          showItemPopup(key, item, i); // pokaż obiekt bezpośrednio z shopItems
        };
        
        showBtn.appendChild(showIcon);
        
        const buyIconUrl = assetManager.getResolvedAsset(`img/icons/sell-item-icon.png`);

        const buyBtn = document.createElement("button");
        const buyIcon = document.createElement(`img`);
        buyIcon.className = `show-icon`;
        buyIcon.src = `${buyIconUrl}`;
        buyBtn.className = "wood-button-dark";
        buyBtn.onclick = (e) => {
          e.stopPropagation();
          gameState.world.lastShopTab = key;
          saveGame();
          buyItem(key, i);
        };

        buyBtn.appendChild(buyIcon);
        
        const compareIconUrl = assetManager.getResolvedAsset(`img/icons/comparing-icon.png`);

        const compareBtn = document.createElement("button");
        const compareIcon = document.createElement(`img`);
        compareIcon.className = `show-icon`;
        compareIcon.src = `${compareIconUrl}`;
        compareBtn.className = "wood-button-dark";
        compareBtn.onclick = (e) => {
          e.stopPropagation();
          showComparePopup(item._id, key);
          playSound(`open`, 0.4);
        };

        compareBtn.appendChild(compareIcon);
        
        btns.appendChild(compareBtn);
        btns.appendChild(showBtn);
        btns.appendChild(buyBtn);

        // wartość 💰
        const valueDiv = document.createElement("div");
        valueDiv.className = "slot-value unique";
        valueDiv.innerHTML = `<span class="icon"></span> ${(item.wartosc).toFixed(0) || 0}`;

        const levelDiv = document.createElement("div");
        levelDiv.className = `slot-level ${item.klasa}`;
        levelDiv.innerHTML = `<span class="icon"></span> ${item.level || 1}`;
        
        if(gameState.char.level < item.level) {
          levelDiv.classList.add("lvl-blocked");
        }
        
        const quantityDiv = document.createElement("div");
        if(item.baseName === 'heal_potion') {
          quantityDiv.className = "slot-quantity";
          quantityDiv.innerHTML = `${resources.healPotionQuantity || 0} <span class="icon">${t("pcs_label")}</span> `;
          let inv = gameState.inventory;
          const slotIndex = inv.findIndex(it => it._id === item._id);
          item.stackIndex = slotIndex;
          //compareBtn.classList.add(`hidden`);
        }
        
        if(item.baseName === 'bread') {
          quantityDiv.className = "slot-quantity";
          quantityDiv.innerHTML = `${resources.foodQuantity || 0} <span class="icon">${t("pcs_label")}</span> `;
          //const slotIndex = inventory.findIndex(it => it === item);
          //item.stackIndex = slotIndex;
          //compareBtn.classList.add(`hidden`);
        }
   
        
        slot.appendChild(btns);
        slot.appendChild(valueDiv);
        slot.appendChild(levelDiv);
        slot.appendChild(quantityDiv);
      
        slot.onclick = () => {
          const wasActive = slot.classList.contains("active");
          
          document.querySelectorAll(".shop-grid .slot.active")
            .forEach(s => s.classList.remove("active"));
          //slot.classList.add("active");
           // zapamiętaj, że ten slot ma zostać otwarty
          //console.log("activeShopSlot cat i index", key, i);
          gameState.world.activeShopSlot = {key, i};
          
          diffStats(item);
          
          playSound(`open-slot`, 0.4);
          
          saveGame();
          
          if (wasActive) return;
          
          slot.classList.add("active");
          
        };
      } else {
        slot.classList.add("empty", "common");
        slot.onclick = () => {
          document.querySelectorAll(".shop-grid .slot.active")
            .forEach(s => s.classList.remove("active"));
          if (!slot.classList.contains("empty") && !slot.classList.contains("sold-item")) {
            slot.classList.add("active");
          }
          clearAllDiffs();
        };
      }
      grid.appendChild(slot);
    }

    container.appendChild(grid);
  });

   // jednokrotne zapisanie po renderze
  saveGame();
  
   // --- ustaw active na odpowiednim tabie po odświeżeniu ---
  document.querySelectorAll(".shop-tab").forEach(t => {
    t.classList.remove("active")
    t.onclick = () => {
      document.querySelectorAll(".shop-grid .slot.active")
        .forEach(s => s.classList.remove("active"));
      clearAllDiffs();
      };
  });
  const activeTab = document.querySelector(`.shop-tab[data-tab="${lastTab}"]`);
  if (activeTab) {
   // console.log("activeTab", activeTab);
    activeTab.classList.add("active");
  }
  
  const activeSlotData = gameState.world.activeShopSlot;
  
  if (activeSlotData && isPotion) {
   // console.log("activeShopSlot");
    const { key, i } = activeSlotData;
    const slotElement = document.querySelector(`[data-category="${key}"][data-index="${i}"]`);
   // console.log("slotElement", slotElement);
    if (slotElement) {
    //  console.log("slot potion active");
      slotElement.classList.add("active"); // albo wywołaj funkcję, która rozwija slot
    }
  }
  
}

function toggleSellMode() {
  sellMode = !sellMode;
  const shopTitle = document.querySelector(".shop-title");
  const capacity = document.querySelector("#capacity-slot");
  const shopContent = document.getElementById("shop-content");
  const sellBtn = document.getElementById("sellModeBtn");
  
  if (sellMode) {
    sellBtn.classList.toggle("active", sellMode);
    // --- przełącz na Ekwipunek ---
    shopTitle.textContent =`${t("inventory_title")}`;

    // zmień licznik mikstur na licznik przedmiotów
     const filled = gameState.inventory.filter(i => i).length;
    capacity.innerHTML = `
      <span id="count">${filled}</span>/20
    `;
    capacity.querySelector("#count").style.color = "#ffb300";

    // zmień ikonę z mikstury na ikonę plecaka / skrzyni
    const invIconUrl = assetManager.getResolvedAsset(`img/icons/inventory-icon.png`);

    const invIcon = document.createElement("img");
    invIcon.src = `${invIconUrl}`; // dodaj taką ikonę do zasobów
    invIcon.className = "capacity-icon";
    invIcon.style.width = "20px";
    invIcon.style.height = "20px";
    invIcon.style.marginRight = "4px";
    capacity.prepend(invIcon);
    
    document.querySelectorAll(".shop-tab").forEach(tab => {
      tab.classList.add("locked");
    });
    
    // renderuj ekwipunek do sprzedaży
   // console.log(`remove activeSellSlot`);
    //saveGame();   
    playSound("open", 0.4);
    
    renderInventoryForSelling(shopContent);
  } else {
    sellBtn.classList.toggle("active", sellMode);
    // --- powrót do Sklepu ---
    shopTitle.textContent = `${t("store_title")}`;

    const usedPotions = gameState.resources.potions.filter(p => p !== null).length;
   // console.warn(`usedPotions`, usedPotions);
    const healPotionUrl = assetManager.getResolvedAsset(`img/items/medium-heal-potion.png`);
    
    capacity.innerHTML = `
      <img src="${healPotionUrl}" class="capacity-icon" alt="Potions" style="width:15px; height:20px;"/>
      <span id="count">${usedPotions}</span>/7
    `;

    document.querySelectorAll(".shop-tab").forEach(tab => {
      tab.classList.remove("locked");
    });
    
    playSound("open", 0.4);
    
    renderShop();
  }
}

function renderInventoryForSelling() {
  const container = document.getElementById("shop-content");

  // usuń zawartość kontenera
  container.innerHTML = "";

  const grid = document.createElement("div");
  grid.className = "shop-grid sell-mode-grid";

  // 20 slotów
  for (let i = 0; i < 20; i++) {
    const slot = document.createElement("div");
    slot.className = "slot";
    slot.setAttribute('data-inv-index', i);

    const item = gameState.inventory[i] || null;
    if (item) {
      slot.classList.add(`${item.klasa}`, "not-empty");

      // --- obrazek przedmiotu ---
      const img = document.createElement("img");
      //img.src = `${ASSET_BASE}img/items/${item.sprite || "placeholder.png"}`;
      setItemImage(img, item);
      img.alt = item.nazwa || "";
      img.className = "item-image";
      slot.appendChild(img);

      // --- przyciski (podgląd i sprzedaj) ---
      const btns = document.createElement("div");
      btns.className = "item-buttons";

      // podgląd
      const showBtn = document.createElement("button");
      showBtn.className = "wood-button-dark";
      const showIcon = document.createElement("img");
      showIcon.className = "show-icon";
      const showIconUrl = assetManager.getResolvedAsset(`img/icons/show-item-icon.png`);
      showIcon.src = `${showIconUrl}`;
      showBtn.appendChild(showIcon);
      showBtn.onclick = (e) => {
        e.stopPropagation(); // nie wywołuj onclick slotu
        showItemPopupForSale(item._id);
      };

      // sprzedaj
      const sellBtn = document.createElement("button");
      sellBtn.className = "wood-button-dark";
      const sellIcon = document.createElement("img");
      const sellIconUrl = assetManager.getResolvedAsset(`img/icons/sell-item-icon.png`);
      sellIcon.className = "show-icon";
      sellIcon.src = `${sellIconUrl}`;
      sellBtn.appendChild(sellIcon);
      sellBtn.onclick = (e) => {
        e.stopPropagation();
        sellItem(item._id, slot); // Twoja istniejąca funkcja sellItem
        // po sprzedaży odśwież widok
       // renderShop();
      };

      btns.appendChild(showBtn);
      btns.appendChild(sellBtn);

      // --- wartość i poziom ---
      const valueDiv = document.createElement("div");
      valueDiv.className = "slot-value unique";
      valueDiv.innerHTML = `<span class="icon"></span> ${(item.wartosc).toFixed(0) || 0}`;

      const levelDiv = document.createElement("div");
      levelDiv.className = `slot-level ${item.klasa}`;
      levelDiv.innerHTML = `<span class="icon"></span> ${item.level || 1}`;

      if (gameState.char.level < item.level) levelDiv.classList.add("lvl-blocked");

      const quantityDiv = document.createElement("div");
      if(item.typ === 'heal_potion') {
          quantityDiv.className = "slot-quantity";
          quantityDiv.innerHTML = `${item.quantity} <span class="icon">${t("pcs_label")}</span> `;
          const slotIndex = gameState.inventory.findIndex(it => it._id === item._id);
          item.stackIndex = slotIndex;
      }
      
      slot.appendChild(btns);
      slot.appendChild(valueDiv);
      slot.appendChild(levelDiv);
      slot.appendChild(quantityDiv);
   
      // --- klik na slot: wybierz / podświetl ---
      slot.onclick = () => {
        const wasActive = slot.classList.contains("active");
      
        // usuń active z innych slotów
        grid.querySelectorAll(".slot.active").forEach(s => s.classList.remove("active"));

        // dodaj active do bieżącego
        
        playSound(`open-slot`, 0.4);

        // zapamiętaj aktywny (użyteczne do działania przycisków poza slotami)
        saveGame();
        
        if (wasActive) return;
  
        slot.classList.add("active");
        
        // (opcjonalnie) pokaż krótki podgląd / dane w bocznym panelu
        // showItemDetails(item);
      };

    } else {
      // pusty slot
      slot.classList.add("empty");
      slot.onclick = () => {
        grid.querySelectorAll(".slot.active").forEach(s => s.classList.remove("active"));
     
      playSound(`open-slot`, 0.4);

        // nie zaznaczamy pustych slotów
      };
    }

    grid.appendChild(slot);
  }

  container.appendChild(grid);

  // jeśli wcześniej był aktywny slot — przywróć selekcję po renderze
  const active = gameState.world.activeSellSlot;
  
 // console.log(`activeSellSlot`, active);
  if (active && typeof active.index === 'number') {
    const el = grid.querySelector(`.slot[data-inv-index="${active.index}"]`);
    if (el) el.classList.add("active");
  }
}

function showItemPopupForSale(itemId) {
  const popup = document.getElementById("item-popup");
  const content = document.getElementById("popup-content");
  const charLevel = gameState.char.level || 1;
  //const itemIndex = inventory.findIndex(i => i._id === itemId);
  const itemIndex = gameState.inventory.findIndex(i => i && i._id === itemId);
 // console.log("itemIndex popup", itemIndex);
  //if (itemIndex === -1) return;
  
  // Jeśli nie znaleziono, znajdź po nazwie + klasie jako fallback
  let item = gameState.inventory[itemIndex];
  if (itemIndex === -1) {
    item = gameState.inventory.find(i => i && i.id === itemId) || null;
  }
  if (!item) {
  //  console.warn("Nie znaleziono itemu w ekwipunku:", itemId);
    return;
  }
  
  const baseHTML = renderBaseStats(item, charLevel)
  const implicitHTML = renderImplicitStats(item);
  const statsHTML = renderItemStats(item);
  const combatAffixes = renderCombatAffixes(item);
  const exclusiveStats = renderExclusiveAffixes(item);
  const styleHTML = renderWeaponStyle(item);
  const classLabel = translateClass(item.klasa); // np. "Epicki", "Unikalny" itd.
  const itemName = getItemName(item); 

  setPopupBackground(content, item.klasa);
  
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
      <span class="item-value-normal">💰 ${(item.wartosc).toFixed(0) || 0}</span>
    </div>
    <div class="center-buttons">
      <button class="item-button" id="equip-btn" onclick="sellItem('${item._id}')">SPZEDAJ</button>
    </div>
    <div class="close-btn-wrapper" id="shop-item-close-wrapper">
      <button class="close-button" id="item-close-btn" onclick="closeShopItemPopup()"></button>
      <img src="${closeUrl}" alt="Zamknij" class="close-btn-frame" />
   </div> 
  `;

   applyImageFallback(content);
  
   const equipBtn = document.getElementById("equip-btn");
   setGlobalButtonTexture(equipBtn);
  
  playSound("open", 0.4);
  
  popup.classList.remove("hidden");
}

function sellItem(itemId, slot) {
  const itemIndex = gameState.inventory.findIndex(i => i._id === itemId);
 // console.log("itemIndex", itemIndex);
  if (itemIndex === -1) return;

  const item = gameState.inventory[itemIndex];
  
  //const slot = document.querySelector(`.slot.not-empty img[alt="${gameState.inventory[itemIndex].nazwa}"]`)?.closest(".slot");
  if (!slot) {
   // console.warn("Nie znaleziono slotu do animacji sprzedaży");
    doSell(itemIndex);
    return;
  }
  
  // Poczekaj aż animacja się skończy
  /*slot.addEventListener("transitionend", function handler(e) {
    if (e.propertyName === "transform") {
      slot.removeEventListener("transitionend", handler);
      doSell(itemIndex);
    }
  });*/
  
  if (item.klasa === "epic" || item.klasa === "legendary") {
     showCustomConfirm(
                    `${t("sold_item_question")}`,
                    () => { slot.classList.add("selling");
                            setTimeout(() => {
                                 doSell(itemIndex);
                              }, 200);
                          },
                    () => { }
     );
   } else if (item.klasa === "special") {
     return showInfoAlert(`${t("cant_sell_item_info")}`, 2000, false);
   } else {
     slot.classList.add("selling");
     setTimeout(() => {
       doSell(itemIndex);
     }, 300);
   }
}

function doSell(itemIndex) {
 // console.log(`doSell`);
  const item = gameState.inventory[itemIndex];
  const gold = parseInt(gameState.resources.gold);
  
  if(item.typ === `heal_potion`) {
     item.quantity--;
     gameState.inventory[item.stackIndex] = item;
    
    // console.log("item quantity after sell", item.quantity);
  
     if(item.quantity === 0) {
       gameState.inventory.splice(itemIndex, 1);
       saveGame();  
       //renderInventoryForSelling(shopContent);
     }         
    
    } else {
    gameState.inventory.splice(itemIndex, 1);
  }
  
  const newGold = gold + item.wartosc;
    
  gameState.resources.gold = newGold;
  
  updateSingleStatValue("gold", newGold);
  
  
  playSound(`sold`, 1, randomRange(0.95, 1.05), 0.45);

  saveGame();
  
  showInfoAlert(`${t("sold_info")} +${Math.round(item.wartosc)}💰`, 1500, true);

  closeShopItemPopup();
  showDiff();
  renderStats();
  renderInventoryForSelling();

 // setTimeout(closeItemPopup, 1000);
  
 /* setTimeout(() => {
    renderShop();
  }, 350); // po animacji (0.4s)
  */
}

function addPotionToInventory(potionItem) {
  
  // 1) Znajdź istniejące stacki
  const potionStacks = gameState.inventory
    .map((item, index) => ({ item, index }))
    .filter(e => e.item.typ === "heal_potion");

  // 2) Spróbuj zwiększyć istniejący stack
  for (const stack of potionStacks) {
    if (stack.item.quantity < stack.item.maxStack) {
      stack.item.quantity++;
      gameState.inventory[stack.index] = stack.item;
      saveGame();  
      return; // ✔ zakończ — stack zwiększony
    }
  }

  // 3) Nie ma stacka z miejscem → twórz nowy
  const newPotion = {
    ...potionItem,
    quantity: 1,
    maxStack: 3
  };

  gameState.inventory.push(newPotion);
  saveGame();
}

function buyItem(category, index) {
  const resources = gameState.resources;
  const slotArr = resources.shopItems[category];
  if (!Array.isArray(slotArr)) return showInfoAlert(`${t("store_error_info")}`);

  
  const item = slotArr[index];
  if (!item) return showInfoAlert(`${t("no_item_store_info")}`);
  
  let gold = parseInt(resources.gold);
  if (gold < item.wartosc) {
    return showInfoAlert(`${t("no_gold_enough_info")}`);
  }

  const isPotion = item.typ === "heal_potion";
  const isFood = item.typ === "meal";

  // === 1) Jeśli to mikstura ===
  if (isPotion) {
    // czy potions (sloty szybkiego dostępu) ma miejsce?
    
    if(!addItemToInventory(item)) return;
    
    if(resources.healPotionQuantity > 0) {
      resources.healPotionQuantity--;
    } else {
      return showInfoAlert(`${t("potions_out_of_stock_info")}`);
    }
    
  } else if (isFood) {
 
    if(!addItemToInventory(item)) return;
    
    if(resources.foodQuantity > 0) {
      resources.foodQuantity--;
    } else {
      return showInfoAlert(`${t("bread_out_of_stock_info")}`);
    }
  
    // === 2) Jeśli to normalny item ===
  } else {
    if (gameState.inventory.length >= 20) {
      return showInfoAlert(`${t("full_inventory_info")}`);
    }
    
    if (item.level > gameState.char.level) {
      return showInfoAlert(`${t("too_lowlvl_info")}`);
    }
    
    gameState.inventory.push(item);
    resources.shopItems[category][index].sold = true;
    
    playSound(`buy`, 0.4);
    
    saveGame();
    closeShopItemPopup();
  }
  
  // aktualizuj gold
  gold -= Math.round(item.wartosc);
  resources.gold = gold;
  
  saveGame();
  
  const goldElem = document.getElementById("gold");
  if (goldElem) setStatValue("gold", gold);
  closeShopItemPopup();
  renderShop(isPotion);
}

function getRandomShopItemLevel(characterLevel) {
     const roll = Math.random() * 100;
     if (roll < 85) return characterLevel + 1;        
     return characterLevel + 2;                   
   }

function randItems(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleItems(arr){
  return [...arr].sort(() => Math.random() - 0.5);
}

function buildRarityPool(total = 16){
  const uniqueCount = randItems(2,3);   // 2-3 unique
  const rareCount   = randItems(5,8);   // 5-8 rare
  const commonCount = total - uniqueCount - rareCount;

  const pool = [
    ...Array(uniqueCount).fill("unique"),
    ...Array(rareCount).fill("rare"),
    ...Array(commonCount).fill("common")
  ];

  return shuffleItems(pool);
}

/* =========================
   WEAPONS SHOP
========================= */

function fillWeaponsShop() {

  if(gameState.world.currentLevel === 3 && gameState.world.mode === `story`) {
    return;
  }
  
  const arr = gameState.resources.shopItems[`weapons`];
  if (arr.some(x => x !== null)) return; 
  const subtypes = [
    "short_sword",
    "mace",
    "axe",
    "long_sword",
   // "great_sword",
    "double_axe",
    "spear",
    //"hammer"
  ];

  const items = [];
  const rarityPool = buildRarityPool(16);

  // gwarantowane typy broni
  for (const subtype of subtypes) {
    const rarity = rarityPool.shift();

    const item = createWeaponOfSubtype(subtype, rarity);
    if (item) items.push(item);
  }

  // reszta losowo
  while (items.length < 16) {

    const subtype = subtypes[randItems(0, subtypes.length - 1)];
    const rarity = rarityPool.shift();

    const item = createWeaponOfSubtype(subtype, rarity);
    if (item) items.push(item);
  }

  gameState.resources.shopItems.weapons = items;
}

/* =========================
   ARMOR SHOP
========================= */

function fillArmorShop() {
  
  if(gameState.world.currentLevel === 3 && gameState.world.mode === `story`) {
    return;
  }
  
  const arr = gameState.resources.shopItems[`armors`];
  if (arr.some(x => x !== null)) return; 
  
  const armorTypes = [
    "helmet",
    "shoulder",
    "armor",
    "bracers",
    "gloves",
    "belt",
    "pants",
    "boots",
    "shield"
  ];

  const items = [];
  const rarityPool = buildRarityPool(16);

  // gwarantowane sloty
  for (const subtype of armorTypes) {

    const rarity = rarityPool.shift();

    const item = createArmorSubtype(subtype, rarity);
    if (item) items.push(item);
  }

  // reszta losowo
  while (items.length < 16) {

    const subtype = armorTypes[randItems(0, armorTypes.length - 1)];
    const rarity = rarityPool.shift();

    const item = createArmorSubtype(subtype, rarity);
    if (item) items.push(item);
  }

  gameState.resources.shopItems.armors = items;
}

/* =========================
   CREATE ITEM HELPERS
========================= */

function createWeaponOfSubtype(subtype, rarity){

  const charLevel = gameState.char.level || 1;
  const lvl = getRandomShopItemLevel(charLevel);

  return generateItem({
    forceType: "weapon",
    forceSubtype: subtype,
    forceLevel: lvl,
    forceRarity: rarity,
    isShopItems: true
  });
}

function createArmorSubtype(subtype, rarity){

  const charLevel = gameState.char.level || 1;
  const lvl = getRandomShopItemLevel(charLevel);
  
  return generateItem({
    forceType: subtype,
    forceLevel: lvl,
    forceRarity: rarity,
    isShopItems: true
  });
  
 }


function getRandomItem(expectedType) {
  const maxAttempts = 50;
  let attempts = 0;

  const armorTypes = [
    "armor", "shield", "helmet", "shoulder", 
    "bracers", "gloves", "belt", "pants", "boots"
  ];

  while (attempts < maxAttempts) {
    attempts++;

    // --- wybór klasy (zamiast ręcznej podmiany klasa) ---
    let targetClass;
    if (Math.random() < 0.6) {
      targetClass = "common"; // 60%
    } else {
      targetClass = "rare";   // 40%
    }

    // szansa na unique, ale tylko 1 na cały typ
    if (!uniqueUsed[expectedType] && Math.random() < 0.1) {
      //console.warn("unique");
      targetClass = "unique";
      uniqueUsed[expectedType] = true;
    }

    // --- generowanie przedmiotu z wymuszoną klasą ---
    const charLevel = gameState.char.level || 1;
    const randomLevel = getRandomShopItemLevel(charLevel);
    const item = generateItem({ forceRarity: targetClass, forceLevel: randomLevel, isShopItems: true});
    if (!item) continue;

    // --- sprawdzenie typu ---
    let isMatch = false;
    if (expectedType === "armor" && armorTypes.includes(item.typ)) {
      isMatch = true;
    } else if (item.typ === expectedType) {
      isMatch = true;
    }

    if (!isMatch) continue;

    return item;
  }

  return null; // brak przedmiotu po max prób
}


function showItemPopup(category, item, index) {
  const popup = document.getElementById("item-popup");
  const content = document.getElementById("popup-content");
  const charLevel = gameState.char.level || 1;

  //console.warn("item cena", item.wartosc);

  const baseHTML = renderBaseStats(item, charLevel)
  const implicitHTML = renderImplicitStats(item);
  const statsHTML = renderItemStats(item);
  const combatAffixes = renderCombatAffixes(item);
  const exclusiveStats = renderExclusiveAffixes(item);
  const styleHTML = renderWeaponStyle(item);
  const classLabel = translateClass(item.klasa); // np. "Epicki", "Unikalny" itd.
  const itemName = getItemName(item); 

  setPopupBackground(content, item.klasa);
  
  const spriteUrl = assetManager.getResolvedAsset(`img/items/${item.sprite}`);
  const closeUrl = assetManager.getResolvedAsset(`img/buttons/close-btn.png`);
  
  //content.className = `${item.klasa}`;
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
      <span class="item-value-normal">💰 ${(item.wartosc).toFixed(0) || 0}</span>
    </div>
    <div class="center-buttons">
      <button class="item-button" id="buy-btn" onclick="buyItem('${category}', '${index}')">${t("buy_btn")}</button>
    </div>
    <div class="close-btn-wrapper" id="shop-item-close-wrapper">
      <button class="close-button" id="item-close-btn" onclick="closeShopItemPopup()"></button>
      <img src="${closeUrl}" alt="Zamknij" class="close-btn-frame" />
   </div> 
  `;

   applyImageFallback(content);
   
   const button = document.getElementById("buy-btn");
   setGlobalButtonTexture(button);

  playSound("open", 0.4);

  popup.classList.remove("hidden");
}

function closeShopItemPopup() {
   //console.log("zamykam popup");
  
   updateLowHpUIBuff();
  
   document.getElementById("item-popup").classList.add("hidden");
   clearAllDiffs();
}

// obsługa zakładek
/*function initShopTabs() {
  document.querySelectorAll(".shop-tab").forEach(tab => {
    tab.classList.add("tab-bg");
    tab.addEventListener("click", () => {
      document.querySelectorAll(".shop-tab").forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));

      tab.classList.add("active");
      document.getElementById(tab.dataset.tab).classList.add("active");
      
      // 💾 zapisz aktywną zakładkę
      saveGame();   
    });
  });
}*/

function renderPotions() {
  const resources = gameState.resources;
  let html = "";

/*  html += `
    <div class="potions-label" id="potions-label"></div>
  `;*/
 // <div class="potions-grid">
  for (let i = 0; i < 7; i++) {
    if (resources.potions && resources.potions[i]) {
      const potionUrl = assetManager.getResolvedAsset(`img/items/medium-heal-potion.png`);

      const potion = resources.potions[i];
      html += `
        <div 
          class="potion-slot potion-full rare-slot" 
          data-potion="${i}" id="potions-container"
          title="${potion.id || "heal_potion"}"
        >
          <img src="${potionUrl}" alt="Mikstura" />
        </div>`;
    } else {
      //console.log('render empty potion');
      const emptyPotionUrl = assetManager.getResolvedAsset(`img/items/medium-empty-potion.png`);

      html += `
        <div 
          class="potion-slot potion-empty common-slot" 
          data-potion="${i}" 
          title="Brak mikstury"
        >
          <img src="${emptyPotionUrl}" alt="Pusty slot" />
        </div>`;
    }
  }

  html += `</div>`;
  return html;
}

function usePotion(index) {
  if (!canPerformAction(`potion`)) return;
  
  const potion = gameState.resources.potions[index];
  if (!potion) return;

  const healPotion = potion.statystyki.find(
    s => s.id.trim() === "heal_percent"
  );

  if (!healPotion) return;
  
  let healPct = (healPotion.value / 100) * getPotionEffectMultiplier();
  
  let newHp = gameState.char.hp + (gameState.char.maxHp * healPct);
 
 // console.error(`healPct and newHp`, healPct, newHp);
  
  if (gameState.combat.flags.isCritical) {
    healPct *= criticalPotionModifier();
    //console.error(`healPct and criticalPotionModifier`, healPct, criticalPotionModifier());
    newHp = gameState.char.hp + (gameState.char.maxHp * healPct);
    updatePlayerHp(newHp);
  } else {
    updatePlayerHp(newHp);
  }

   
  // USUŃ miksturę TYLKO z tego slotu
  gameState.resources.potions[index] = null;
  
  if (gameState.world.inCombat && !gameState.combat.flags.isCritical) {
    lockActions({ duration: 500, reason: "potion", allow: [] });
  }
  
  playSound(`drink-potion`, 1, randomRange(0.95, 1.05), 0.45);
  
  saveGame();
  renderCombat(true);
}

/*function attachPotionEvents() {
  document.querySelectorAll(".potion-slot").forEach(slot => {
    slot.replaceWith(slot.cloneNode(true)); // USUWA wszystkie poprzednie eventy
  });

  document.querySelectorAll(".potion-slot").forEach(slot => {
    slot.addEventListener("click", () => {
      const index = Number(slot.dataset.potion);
      if (!resources.potions[index]) return;
      usePotion(index);
    });
  });
}*/

function updateGenerateCounter() {
  if (counterBox) {
    counterBox.textContent = "Losowania: " + generateCount;
  }
}

/*window.onload = () => {
   
    console.log("loading stats bar");
    renderStats();
  
  if (!resources.potions || resources.potions.length !== POTION_SLOTS) {
      resources.potions = Array(POTION_SLOTS).fill(null);
  }
  
  console.warn(`bottom menu height: `, getComputedStyle(document.querySelector('.bottom-menu')).height);
  
  
  document.querySelectorAll("[data-src]").forEach(img => {
         img.src = `${ASSET_BASE}${img.getAttribute("data-src")}`;
      });
  
  const sellBtn = document.getElementById("sellModeBtn");
  if (sellBtn) {
    sellBtn.addEventListener("click", toggleSellMode);
  }
  
  renderShop();
  initShopTabs();
  
};*/

