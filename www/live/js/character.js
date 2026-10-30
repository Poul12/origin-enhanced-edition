let effectiveCrit = 0;  

  const slotOrder = [
      "helmet",
      "shoulder", "armor", "bracers",
      "gloves", "belt", "pants",
      "boots", "shield", "weapon"
    ];

const ATTRIBUTE_CONFIG = {
  vitality: {
    label: "Witalność",
    desc: "Więcej życia i odporność",
    icon: "❤️"
  },
  strength: {
    label: "Siła",
    desc: "Większe obrażenia",
    icon: "🗡️"
  },
  dexterity: {
    label: "Zręczność",
    desc: "Timing, blok, kontrola",
    icon: "🛡️"
  }
};

const COMBAT_ARCHETYPES = [
  "perfect_block",
  "defensive_stance",
  "poise",
  "bleed",
  "armor_break",
  "spear_control",
  "dodge",
  "critical",
  "exhausted",
  "low_hp",
  "crit",
  "resources",
  "special",
];



 function renderEquipment() {
  const container = document.getElementById("equipment-slots");
  if(!container) return;
   
  container.innerHTML = "";

  const charLevel = gameState.char.level || 1;

  slotOrder.forEach(type => {
    const item = gameState.char.equipment?.[type];
    const slot = document.createElement("div");
    const className = type.replace(" ", "-").toLowerCase();
    slot.className = `slot ${className}`;

    if (className === "shield") {
      const toggle = document.createElement("div");
      toggle.className = "shield-mode-toggle";
      toggle.innerHTML = `
       <label class="shield-toggle">
         <input type="checkbox" id="block-mode-toggle">
         <span class="toggle-box"></span>
         <span class="toggle-text">${t("tactical_block_toggle")}</span>
       </label>
     `;
      slot.appendChild(toggle);
    }
    
    const wrapper = document.createElement("div");
    wrapper.className = "item-wrapper";
    
    /*const frame = document.createElement("img");
    frame.className = "slot-frame";
    frame.src ="assets/img/frame1.png";
    frame.alt = "Ramka";
    wrapper.appendChild(frame);*/
    
    if (item && item.statystyki) {
      
      //console.warn(`item sprite`, item.sprite); 
      slot.classList.add(`${item.klasa}`);
      //slot.className = `slot ${item.klasa}-slot`;
     
      const img = document.createElement("img");
      //img.src = `${ASSET_BASE}` + "img/items/" + (item.sprite || "placeholder.png");
      setItemImage(img, item);
      img.alt = item.nazwa || "";
      img.className = "item-image "; //+ (item.klasa + "-slot-img" || "common-slot-img");

      wrapper.appendChild(img);
      
      const levelDiv = document.createElement("div");
      levelDiv.className = `slot-level ${item.klasa}`;
      levelDiv.innerHTML = `<span class="icon"></span> ${item.level || 1}`;
        
      if(gameState.char.level < item.level) {
        levelDiv.classList.add("lvl-blocked");
      }
     
      slot.appendChild(levelDiv);
      
      slot.onclick = () => showEqItemPopup(item, type);
    } else {
      slot.style.background = "#505050";
      slot.style.opacity = "0.6";
     // wrapper.appendChild(frame);
      slot.textContent = type;
      slot.onclick = null;
    }
    
    if (gameState.char.equipment?.["weapon"]?.twoHanded && type === "shield") {
      slot.classList.add("disabled-slot");
    }
    
    slot.appendChild(wrapper);
    container.appendChild(slot);
  });
 }

function showStatsPopup() {
  const popup = document.getElementById("stats-popup");
  const content = document.getElementById("stats-popup-content");
  const container = document.querySelector(".extra-stats-container");

  const statsBgUrl = assetManager.getResolvedAsset(`img/backgrounds/common-texture.png`);
  
  container.style.backgroundImage = `url("${statsBgUrl}")`;
  container.style.backgroundRepeat = "no-repeat";
  container.style.backgroundPosition = "center";
  container.style.backgroundSize = "120% 120%";
  
  playSound("open", 0.4);
  
  popup.classList.remove("hidden");
}

// <span class="item-class">(${getGenderedClassLabel(item.klasa, item.baseName || item.typ)})</span><br>
// <img src="assets/img/frame5.png" class="popup-image-frame" />


function showEqItemPopup(item, type) {
  const popup = document.getElementById("item-popup");
  const content = document.getElementById("popup-content");
  const charLevel = gameState.char.level || 1;
  
  const baseHTML = renderBaseStats(item, charLevel)
  const implicitHTML = renderImplicitStats(item);
  const statsHTML = renderItemStats(item);
  const combatAffixes = renderCombatAffixes(item);
  const exclusiveStats = renderExclusiveAffixes(item);
  const classLabel = translateClass(item.klasa); // np. "Epicki", "Unikalny" itd.
  const styleHTML = renderWeaponStyle(item);
  const itemName = getItemName(item); 
   
  setPopupBackground(content, item.klasa);
   
  const spriteUrl = assetManager.getResolvedAsset(`img/items/${item.sprite}`);
  const closeUrl = assetManager.getResolvedAsset(`img/buttons/close-btn.png`);
   
  //content.className = `${item.klasa}`;
  content.innerHTML = `
   
   <div class="popup-image-wrapper ${item.klasa}" >
     <img src="${spriteUrl}" alt="${item.nazwa}" class="item-popup-image" />
   </div>
   
    <strong class="item-name item-name-${item.klasa}">${itemName}</strong>
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
      <span class="item-value">💰 ${item.wartosc || 0}</span>
    </div>
   <div class="center-buttons">
    <button class="item-button" id="unequip-btn" onclick="unequipAndClose('${type}')">${t("unequip_btn")}</button>
   </div>
   <div class="close-btn-wrapper" id="item-close-wrapper">
      <button class="close-button" id="item-close-btn" onclick="closeEqItemPopup()"></button>
      <img src="${closeUrl}" alt="Zamknij" class="close-btn-frame" />
   </div> 
 
  `;
   
   applyImageFallback(content);
   
   const button = document.getElementById("unequip-btn");
   setGlobalButtonTexture(button);
   
   playSound("open", 0.4);
   
   popup.classList.remove("hidden");
 }

 function closeEqItemPopup() {
   document.getElementById("item-popup").classList.add("hidden");
 }

function closeCombatAffixesPopup() {
  document.getElementById("combat-affixes-popup").classList.add("hidden");
}


function closeStatsPopup() {
   document.getElementById("stats-popup").classList.add("hidden");
 }

 function unequipAndClose(slot) {
  unequip(slot);
  closeEqItemPopup();
 }

function showCombatAffixesPopup() {
  const popup = document.getElementById("combat-affixes-popup");
  const content = document.getElementById("popup-content");
  const container = document.getElementById("combat-affixes-container");

  setPopupBackground3(`#combat-affixes-popup .popup-content`, `coal`);
  
  showCombatAffixes();
  
  /*const button = document.getElementById("unequip-btn");
  setGlobalButtonTexture(button);*/
   
  playSound("open", 0.4);
  
  popup.classList.remove("hidden");
}


function showCombatAffixes(){
  const container = document.getElementById("combat-affixes-container");
  const eq = gameState.char?.equipment || {};

  container.innerHTML = "";
  
  COMBAT_ARCHETYPES.forEach(type => {
    const list = getCombatAffixesByType(type);
    //console.log(`combatAffixes list`, list.length);
    //let isDisabled = false;
    //if(list.length === 0) isDisabled = true;
    let isDisabled = !list.some(affix => affix.equipped);
    container.appendChild(createArchetypeSection(type, list, isDisabled));

  });
}

function createArchetypeSection(archetype, affixes, isDisabled) {
  const wrapper = document.createElement("div");
    
  wrapper.className = "combat-archetype";
  
  if(isDisabled) wrapper.classList.add(`disabled`);
  
  const codex = gameState.char.combatAffixCodex;

  const hasNotification = affixes.some(
    affix => affix.discovered && !codex[affix.name]?.seen
  );
  
  //console.log(`hasNotification`, hasNotification);
  
  const equippedCount = affixes.filter(affix => affix.equipped).length;
  const discoveredCount = affixes.filter(affix => affix.discovered).length;
  
  wrapper.innerHTML = `
    <div class="combat-archetype-header ${hasNotification ? "has-notification" : ""}">
      <div class="combat-archetype-left">
        <span class="affix-dot"></span>
        <span class="combat-arrow">▶</span>
        <span class="combat-title">${t(archetype)}</span>
        <span class="combat-equipped">(${equippedCount})</span>
      </div>
      <div class="combat-summary">
        <div>${discoveredCount}/${affixes.length} affixes</div>
      </div>
     </div>

     <div class="combat-archetype-body hidden"></div>
  `;
  
  const body = wrapper.querySelector(".combat-archetype-body");

  affixes.forEach(a => {
    body.appendChild(createAffixElement(a));
  });
  wrapper.querySelector(".combat-archetype-header").onclick = () => {
    body.classList.toggle("hidden");
    wrapper.classList.toggle("expanded");
    
    affixes.forEach(affix => {
        if (affix.discovered) {
            codex[affix.name].seen = true;
        }
    });

    wrapper.querySelector(".combat-archetype-header")
        .classList.remove("has-notification");

  };
  
  return wrapper;
}

function createAffixElement(affix) {
  const div = document.createElement("div");
  div.className = "combat-affix";

  let affixName = "???";
  let unit = "";
  let value = "";
  let sourcesHtml = "";

  // Nieodkryty affix
  if (!affix.discovered) {
    div.classList.add("disabled");

    div.innerHTML = `
      <div class="combat-affix-name">???</div>
    `;
    return div;
  }

  //console.error(`affix.equipped before`, affix.equipped);

  // Odkryty, ale nieaktywny
  if (!affix.equipped) {
    div.classList.add("disabled");

    affixName = getAffixCodexLabel(affix.name);

    div.innerHTML = `
      <div class="combat-affix-name">${affixName}</div>
    `;

    return div;
  }

  //console.error(`affix.stat after`, affix.stat);
  
  // Aktywny (założony)
  const affixFullName = getAffixLabel(affix.stat);

  affixName = getAffixCodexLabel(affix.name);

  if (affixFullName.includes("%")) unit = "%";
  else if (affixFullName.includes("/s.")) unit = "/s.";
  else if (affixFullName.includes("s.")) unit = "s.";

  value = `${affix.total.toFixed(1)}${unit}`;

  sourcesHtml = affix.sources.map(source => `
      <div>
        ${t(source.baseName)}
        <span>${source.value.toFixed(1)}${unit}</span>
      </div>
  `).join("");

  div.innerHTML = `
    <div class="combat-affix-name">
      ${affixName}
      <span>${value}</span>
    </div>

    <div class="combat-affix-sources">
      ${sourcesHtml}
    </div>
  `;

  return div;
}

/*function createAffixElement(affix){
  const div = document.createElement("div");
  
  div.className="combat-affix";

  let affixName = `???`;
  let unit = ``;
  
  div.innerHTML=`
    <div class="combat-affix-name">${affixName}
    </div>
  `;
  
  if(!affix.stat && !affix.discovered) {
    return div;
  }
  
  if(!affix.stat && affix.discovered) {
    div.classList.add(`disabled`);
    affixName = getAffixCodexLabel(affix.id);
  } else if(affix.stat && affix.discovered) {
    const affixFullName = getAffixLabel(affix.stat);
    
    if(affixFullName.includes(`%`)) unit = `%`;
    else if(affixFullName.includes(`/s.`)) unit = `/s.`;
    else if(affixFullName.includes(`s.`)) unit = `s.`;
  }
  
  div.innerHTML=`
    <div class="combat-affix-name">${affixName}
      <span>${affix.total.toFixed(1)}${unit}</span>
    </div>
    <div class="combat-affix-sources">
      ${affix.sources.map(source=>`
        <div>${t(source.baseName)}
          <span>${source.value.toFixed(1)}${unit}</span>
        </div>
      `).join("")}
    </div>
  `;

  return div;
}*/

function getCombatAffixesByType(archetype) {
  const result = [];
  const codex = gameState.char.combatAffixCodex;
  const equipped = gameState.char.combatAffixes;

  for (const id in codex) {

    if (codex[id]?.archetype !== archetype) continue;
    
    result.push({
        name: id,
        discovered: codex[id].discovered,
        equipped: !!equipped[id],
        stat: equipped[id]?.stat ?? null,
        total: equipped[id]?.value ?? 0,
        sources: equipped[id]?.sources ?? [],
    });
  }
  
  
  
  /*const equippedAffixes = gameState.char.combatAffixes;

  for (const id in equippedAffixes) {

    //console.log(`enter for equippedAffixes, id, archetype`, id, archetype);
    
    if (!equippedAffixes[id]) continue;

    //console.log(`equippedAffixes[id].archetype`, equippedAffixes[id].archetype);
    
    if (equippedAffixes[id].archetype !== archetype) continue;

    result.push({
      id,
      name: id, 
      stat: equippedAffixes[id].stat,
      total: equippedAffixes[id].value,
      sources: equippedAffixes[id].sources
    });

  }*/

  return result;
}

function getCombatIcon(type) {
  return `icon.png`;
}
   
 function updateCharacterView() {
  
  refreshCharacterStats();

  const char = gameState.char;

  const maxHp = char.maxHp;
  const dmg = char.dmg;
  const def = char.def;
   
  //const { maxHp, dmg, def } = calculateTotalStats(eq);
  const hp = char.hp;
   
  const vit = char.vit;
  const str = char.str;
  const agi = char.agi;
   
  //console.log(`SUMA -> HP: ${hp}, DMG: ${dmg}, DEF: ${def}, STR: ${str}, AGI: ${agi}, VIT: ${vit}, SPD: ${char.atkSpd}`);
 // console.log('dmg', dmg);
  document.getElementById("hp").textContent = maxHp;
  document.getElementById("dmg").textContent = dmg;
  document.getElementById("def").textContent = def;
  document.getElementById("atkspd-value").textContent = char.atkSpd.toFixed(2);
  document.getElementById("dodge-value").textContent = char.dodge.toFixed(1) + "%";
  document.getElementById("str-value").textContent = str;
  document.getElementById("agi-value").textContent = agi;
  document.getElementById("vit-value").textContent = vit;
  document.getElementById("block-value").textContent = (char.blockPower * 100).toFixed(0) + "%"; 
  document.getElementById("crit-value").textContent = char.crit + "%";
  document.getElementById("critdmg-value").textContent = char.critDmg.toFixed(0) + "%";
  document.getElementById("lifeRegen-value").textContent = char.lifeRegen.toFixed(1);
  document.getElementById("lifeOnHit-value").textContent = char.lifeOnHit;
  document.getElementById("magicfind-value").textContent = char.magicFind.toFixed(1) + "%";
  document.getElementById("goldfind-value").textContent = char.goldFind.toFixed(1) + "%";
  document.getElementById("fireRes-value").textContent = char.resist.fire;
  document.getElementById("coldRes-value").textContent = char.resist.cold;
  document.getElementById("poisonRes-value").textContent = char.resist.poison;
  document.getElementById("magicRes-value").textContent = char.resist.magic;
  const goldEl = localStorage.getItem("gold") || 0;
  //document.getElementById("gold").textContent = formatNumber(goldEl);
  setStatValue("gold", goldEl);
   
  //document.getElementById("level").innerText = char.level;
   
     const percent = Math.min(125, Math.round(100 * char.experience / char.expToNextLevel));
    document.getElementById("exp-bar").style.width = percent + "%";
    // aktualizacja licznika
    document.getElementById("exp-label").textContent = `${formatNumber(char.experience)} / ${formatNumber(char.expToNextLevel)}`;
  
   //renderStminaOrb(char.stamina, char.maxStamina);
  
  const hpOrb = document?.getElementById("hp-orb-fill");
  const orb = document.querySelector(".hp-orb");
  const body = document.body;

  if (hpOrb && maxHp) {
    const percent = Math.min(100, Math.round(100 * hp / maxHp));
    //const percent = Math.max(0, hp / maxHp) * 100;
    //hpOrb.style.height = percent + "%";
    document.querySelector(".hp-orb .orb-liquid").style.height = percent + "%";
    orb.classList.toggle("full", percent >= 99);
    //orb.classList.toggle("low", percent < 30);

    if (percent < 30) {
      orb.classList.add("low");
      body.classList.add("low-hp");
    } else if (percent >= 35) {
      orb.classList.remove("low");
      body.classList.remove("low-hp");
    }
    
    document.getElementById("hp-label").textContent = `${hp} / ${maxHp}`;
  }

   
  // console.log("atkspd", char.atkSpd);
   //localStorage.setItem("atkspd", spd.toString());
   
   //initBlockModeToggle();
   applyCharacterStats();
 }

function setBlockMode(mode, initView = false) {
  
  if (gameState.char.inCombat) {
    console.warn("Nie można zmieniać trybu bloku w trakcie walki");
    return;
  }

  //char.block ||= {};
  gameState.char.blockMode = mode;
  gameState.combat.playerBlock.mode = mode;
  
  if(mode === `defensive`) {
    gameState.combat.activeRingMode = `guard`;
  }
  
  playSound("open-slot", 0.4);
  
  if(initView) {
    setDisciplineName();
  }    
  
 // console.log("Zmieniono tryb bloku:", mode);
  saveGame();
}

/*function initBlockModeToggle() {
  const blockModeEl = document.querySelector(".shield-mode-toggle");
  const checkbox = document.getElementById("block-mode-toggle");
  if (!checkbox) return;

  blockModeEl.classList.remove(`hidden`);

  const eq = char?.equipment || {};
  const shield = eq[`shield`];
  console.error(`enter init bkock mode`);

   if(!shield) {
    char.blockMode = `none`;
    blockModeEl.classList.add(`hidden`);
    console.error(`char?.blockMode`, char?.blockMode);
    return;
  }
  
  checkbox.checked = char?.blockMode === "timed";

  checkbox.addEventListener("change", () => {
    setBlockMode(checkbox.checked ? "timed" : "defensive");
  });
}*/

let tempAttrAllocation = {};
let remainingAttrPoints = 0;

function showAttributesPopup() {
  const pointsEl = document.getElementById("available-attr-points");
  const popup = document.getElementById("attributes-popup");
  const popupCard = popup.querySelector(".popup-content");
  const attrBtn = document.getElementById("confirm-attributes");
  
  remainingAttrPoints = gameState.char.availableAttributePoints || 0;
  //if (remainingAttrPoints <= 0) return;

  tempAttrAllocation = {
    vitality: 0,
    strength: 0,
    dexterity: 0
  };

  pointsEl.textContent = remainingAttrPoints;
  
  playSound("open", 0.4);
  
  setPopupBackground2(popupCard, "rare");
  
  setupAttributeControls(pointsEl, attrBtn);
  
  popup.classList.remove("hidden");
  void popup.offsetHeight;
  popup.classList.add("visible");
  
  attrBtn.classList.add("locked");
  attrBtn.disabled = true;

  attrBtn.onclick = () => {
    popup.classList.remove("visible");
    applyAttributes(gameState.char);
    
    playSound("open-slot", 0.4);

    setTimeout(() => {
      popup.classList.add("hidden");
    }, 600); 
  };
  
  setGlobalButtonTexture(attrBtn);
}

function setupAttributeControls(pointsEl, confirmBtn) {
  document.querySelectorAll(".attribute-row").forEach(row => {
    const attr = row.dataset.attr;
    const valueEl = row.querySelector(".attr-value");
    const plusBtn = row.querySelector(".attr-plus");
    const minusBtn = row.querySelector(".attr-minus");

    valueEl.textContent = 0;

    plusBtn.onclick = () => {
      if (remainingAttrPoints <= 0) return;

      playSound("open", 0.4);
      
      tempAttrAllocation[attr]++;
      remainingAttrPoints--;

      valueEl.textContent = tempAttrAllocation[attr];
      pointsEl.textContent = remainingAttrPoints;

      updateConfirmState(confirmBtn);
    };

    minusBtn.onclick = () => {
      if (tempAttrAllocation[attr] <= 0) return;

      playSound("open", 0.4);
      
      tempAttrAllocation[attr]--;
      remainingAttrPoints++;

      valueEl.textContent = tempAttrAllocation[attr];
      pointsEl.textContent = remainingAttrPoints;

      updateConfirmState(confirmBtn);
    };
  });
}

/*function updateConfirmState(btn) {
  if (remainingAttrPoints === 0) {
    btn.disabled = false;
    btn.classList.remove("locked");
  } else {
    btn.disabled = true;
    btn.classList.add("locked");
  }
}*/

function updateConfirmState(btn) {
  document.querySelectorAll(".attr-plus").forEach(b => {
    b.disabled = remainingAttrPoints <= 0;
  });

  if (remainingAttrPoints === 0) {
    btn.disabled = false;
    btn.classList.remove("locked");
  } else {
    btn.disabled = true;
    btn.classList.add("locked");
  }
}

function updateAttrButtonState() {
  const btn = document.getElementById("attr-btn");

  if(!btn) return;
  
  const points = gameState.char.availableAttributePoints || 0;

  if (points <= 0) {
    btn.disabled = true;
    btn.classList.add("locked");
  } else {
    btn.disabled = false;
    btn.classList.remove("locked");
  }
}

function applyAttributes(char) {
  char.attributes = char.attributes || {
    vitality: 0,
    strength: 0,
    dexterity: 0
  };

  for (const attr in tempAttrAllocation) {
    char.attributes[attr] += tempAttrAllocation[attr];
  }

  char.availableAttributePoints = 0;

  //recalculateDerivedStats(char);
  
  updateCharMenuIcon();
  
  //renderStats();
  refreshCharacterStats();
  renderEquipment();
  updateCharacterView();
  updateAttrButtonState();
  saveGame();
}

function closeAttributesPopup() {
  const popup = document.getElementById("attributes-popup");

  popup.classList.remove("visible");
  
  setTimeout(() => {
    popup.classList.add("hidden");
  }, 200);
}

function recalculateDerivedStats(char) {
  const { vitality, strength, dexterity } = char.attributes;

  char.maxHp = 100 + vitality * 5;
  char.dmg = 5 + strength * 3;
  char.def = 5 + dexterity * 4;
  //char.blockWindow = 200 + dexterity * 15;
}

    function unequip(type) {
      const item = gameState.char.equipment?.[type];
      if (item) {
        if (gameState.inventory.length >= 20) return showInfoAlert(`${t("full_inventory_info")}`);
   
        gameState.inventory.push(item);
       // console.error(`inventory.length`, gameState.inventory.length);
        delete gameState.char.equipment[type];
     //   console.error(`char.equipment.length`, gameState.char.equipment.length);
       // console.error(`char.hp`, gameState.char.hp);
        
        //const eq = gameState.char?.equipment || {};
        //const shield = eq["shield"];

        //console.log(`shield blockMode`, shield);

        if (type === `shield`) {
          gameState.char.blockMode = "none";
          //blockModeEl.classList.add("hidden");
          //console.log(`not shield blockMode none`, gameState.char.blockMode);
 
          //saveGame();
          //return;
        }
        
        playSound(`unequip`, 1, randomRange(0.95, 1.05), 0.45);

        refreshCharacterStats();
        renderEquipment();
        updateCharacterView();
        //initBlockModeToggle();
        saveGame();
      }
    }


function loadBg() {
  const pageBg = document.getElementById("page-bg");
  if(!pageBg) return;
  
  const pageBgUrl = assetManager.getResolvedAsset(`img/backgrounds/west-character-bg.png`);

  pageBg.style.backgroundImage = `url("${pageBgUrl}")`;
  pageBg.style.backgroundSize = `100% 110%`;
  pageBg.style.backgroundRepeat = "no-repeat";
  pageBg.style.backgroundPosition = "center top";
  pageBg.style.backgroundAttachment = "fixed";
}

   /* document.addEventListener("DOMContentLoaded", () => {
     // initializeGameState();
      console.error(`inventory.length start`, gameState.inventory.length);
      console.error(`char.equipment.length start`, char.equipment.length);
       
      renderStats();
      loadBg();
      
      updateAttrButtonState();
      
      document.querySelectorAll("[data-src]").forEach(img => {
         img.src = `${ASSET_BASE}${img.getAttribute("data-src")}`;
      });
      
      const button = document.querySelector(".item-button");
      const statsBtn = document.getElementById("stats-btn");
    
      setGlobalButtonTexture(button);
      setGlobalButtonTexture(statsBtn);
      
      renderEquipment();
      updateCharacterView();
      
      initBlockModeToggle();
      
      saveGame();
      console.error(`inventory.length end`, gameState.inventory.length);
     console.error(`char.equipment.length end`, char.equipment.length);
       
    });*/

const ELEMENTS = {
  fire:   { icon: "", label: "fire_dmg_tooltip",    color: "#ff6a3d" },
  cold:   { icon: "", label: "cold_dmg_tooltip",    color: "#4fd1ff" },
  poison: { icon: "", label: "poisen_dmg_tooltip",  color: "#7dff6b" },
  magic:  { icon: "", label: "arcane_dmg_tooltip",  color: "#c084ff" }
};


function renderElementalList(player) {
  const { elementalDmg, typeOfElementalDmg } = player;

  //console.error(`typeOfElementalDmg`, typeOfElementalDmg);
  return Object.entries(ELEMENTS)
    .map(([key, el]) => {
      const value =
        key === typeOfElementalDmg
          ? `<span style="color:${el.color};">+${elementalDmg}</span>`
          : `<span style="opacity:0.4;">0</span>`;

      return `
        <li>
          ${el.icon} ${t(el.label)}:
          ${value}
        </li>
      `;
    })
    .join("");
}

function getBlockTooltip(ctx) {
  if (ctx.blockMode === "defensive") {
    return `
      <ul>
        <b>${t("stat_block_defensive")}:</b>
        <li>
          ${t("stat_block_damage_reduction")}:
          <span style="color:#e6a23c;">
            ${(getDefensiveBlockReduction(ctx.blockPower) * 100).toFixed(0)}%
          </span>
        </li>
        <li>${t("stat_block_damage_penalty")}:
          <span style="color:#e6a23c;">-${(ctx.penaltyDmg * 100).toFixed(0)}%</span>
        </li>
        <li>${t("stat_block_attack_slow")}:
          <span style="color:#e6a23c;">${(ctx.baseCooldown).toFixed(1)}s. -> </span>
          <span style="color:red;">${(ctx.penaltyCooldown).toFixed(1)}s. (-${(ctx.penaltyAtkSpd).toFixed(0)}%)</span>
        </li>
      </ul>
    `;
  }

  if (ctx.blockMode === "timed") {
    return `
      <ul>
        <b>${t("stat_tactical_block")}:</b>
        <li>
          ${t("stat_block_imperfect_reduction")}:
          <span style="color:#e6a23c;">
            ${(getTimedBlockReduction(ctx.blockPower) * 100).toFixed(0)}%
          </span>
          ${t("stat_damage_reduction")}
        </li>
        <li>
          ${t("stat_block_perfect_cooldown")}:
          <span style="color:#e6a23c;">
             ${(getTimedBlockCooldown(ctx.blockPower) / 1000).toFixed(1)} s.
          </span>
        </li>
      </ul>
    `;
  }

  if (ctx.blockMode === "none") {
    return `
      <ul>
        <b>${t("stat_block_title")}:</b>
        <li>${t("stat_block_no_active_mode")}</li>
      </ul>
    `;
  }
}


function defensiveBlockDesc(ctx) {
  return `
  <ul>
    <b>${t("stat_defensive_stance")}</b> – ${t("stat_defensive_stance_desc")}

    <li>${t("stat_block_damage_reduction")}:
      <span style="color:#e6a23c;">
        ${((getDefensiveBlockReduction(ctx.blockPower)) * 100).toFixed(0)}%
      </span>
    </li>

    ${t("stat_defensive_attack_penalty_intro")}:
    
    <li>
      ${t("stat_damage")}:
      <span style="color:#e6a23c;">
        -${(ctx.penaltyDmg * 100).toFixed(0)}%
      </span>
    </li>

    <li>
      ${t("stat_attack_speed")}:
      <span style="color:#e6a23c;">
        ${(ctx.baseCooldown).toFixed(1)}s. ->
      </span>
      <span style="color:red;">
        ${(ctx.penaltyCooldown).toFixed(1)}s. (-${(ctx.penaltyAtkSpd).toFixed(0)}%)
      </span>
    </li>

    <li>
      ${t("stat_defensive_potion_bonus")}
      <span style="color:#e6a23c;">40%.</span>
    </li>

    <li>${t("stat_defensive_pressure")}</li>
    <li>${t("stat_defensive_duration")}</li>
    <li>${t("stat_defensive_stamina")}</li>
    <li>${t("stat_defensive_requires_shield")}</li>
  </ul>
  `;
}

function timedBlockDesc(ctx) {
  return `
  <ul>
    <b>${t("stat_tactical_block")}</b> – ${t("stat_tactical_block_desc")}

    <li>
      ${t("stat_block_active_time")}:
      <span style="color:#e6a23c;">0.5 s</span>
    </li>

    <li>
      ${t("stat_block_requires_timing")}
    </li>

    <li>
      <b>${t("stat_perfect_block")}</b> – ${t("stat_perfect_block_desc")}:
      <span style="color:#e6a23c;">100%</span>
      ${t("stat_damage_reduction")}
    </li>

    <li>
      <b>${t("stat_normal_block")}</b> – ${t("stat_normal_block_desc")}:
      <span style="color:#e6a23c;">
        ${(getTimedBlockReduction(ctx.blockPower) * 100).toFixed(0)}%
      </span>
      ${t("stat_damage_reduction")}
    </li>

    <li>
      ${t("stat_perfect_block_cooldown")}:
      <span style="color:#e6a23c;">
        ${(getTimedBlockCooldown(ctx.blockPower) / 1000).toFixed(1)} s
      </span>
    </li>

    <li>
      ${t("stat_failed_block_cooldown")}:
      <span style="color:#e6a23c;">3.5 s</span>
    </li>
  
    <b>${t("stat_perfect_block_reward")}</b> (${t("stat_randomly")}):
    <li>${t("stat_reflect_damage")}</li>
    <li>${t("stat_stun_enemy")}</li>
    <li>${t("stat_guaranteed_crit")}</li>
  </ul>
  `;
}


const STAT_DESCRIPTIONS = {
  
  hpstat: {
  title: "stat_hp_title",

  desc: (ctx)=>`
  <ul>
    <b>${t("tooltip_max_life")}:</b>
      <span style="color: #e6a23c;">${ctx.maxHp}</span>

    <li>${t("tooltip_scales_with_vitality")}</li>
    <li>${t("tooltip_die_at_zero_hp")}</li>
  </ul>

  <div class="tooltip-separator"></div>

  <ul>
    <b>${t("tooltip_life_regeneration")}:</b>

    <li>
      <span style="color: #e6a23c;">
        ${ctx.lifeRegen.toFixed(1)} HP / ${t("tooltip_per_second")}
      </span>
    </li>

    <li>${t("tooltip_active_outside_combat")}</li>
    <li>${t("tooltip_regen_delay")}</li>
  </ul>

  <div class="tooltip-separator"></div>

  <ul>
    <b>${t("tooltip_life_on_hit")}:</b>

    <li>
      <span style="color: #e6a23c;">
        ${getLoH()} HP
      </span>

      ${t("tooltip_for_each_hit")}
    </li>

    <li>${t("tooltip_scales_with_attack_speed")}</li>
  </ul>
  `
},

dmgstat: {
  title: "stat_damage_title",

  desc: (ctx)=>`
  <ul>
    <b>${t("tooltip_base_damage")}:</b>

    <span style="color: #e6a23c;">
      ${ctx.dmg}
    </span>

    <li>${t("tooltip_scales_with_strength")}</li>
    <li>${t("tooltip_attacks_deal_flat_damage")}</li>
  </ul>

  <div class="tooltip-separator"></div>

  <ul>
    <b>${t("tooltip_combat_style")}:</b>

    <span style="color:#e6a23c;">
      ${t(ctx.style.name)}
    </span>

    <li>
      ${t(ctx.style.desc)}
    </li>
  </ul>

  <ul>
    <b>${t("tooltip_attack_speed")}:</b>

    <span style="color:#e6a23c;">
      ${getPlayerAttackSpeed().toFixed(1)}
    </span>

    <li>
      ${t("tooltip_attack_ready_time")}:
      <span style="color:#e6a23c;">
       <!-- ${ctx.baseCooldown.toFixed(1)}s. -->
        ${calculateCooldown(getPlayerAttackSpeed()).toFixed(1)}s.
  </span>
    </li>
  </ul>

  <div class="tooltip-separator"></div>

  <ul>
    <b>${t("tooltip_critical_attack")}:</b>

    <span style="color: #e6a23c;">
      (${ctx.crit}% | x${(1 + ctx.critDmg / 100).toFixed(2)})
    </span>

    <li>${t("tooltip_crit_no_elemental")}</li>
  </ul>

  <div class="tooltip-separator"></div>

  <ul>
    <b>${t("tooltip_elemental_damage")}:</b>

    ${renderElementalList(ctx)}

    <li>${t("tooltip_elemental_no_crit")}</li>
  </ul>
  `
},

defstat: {
  title: "stat_defense_title",

  desc: (ctx)=>`
  <ul>
    <b>${t("tooltip_armor")}:</b>

    <span style="color: #e6a23c;">
      ${ctx.def}
    </span>

    <li>${t("tooltip_reduce_physical_damage")}</li>
    <li>${t("tooltip_soft_cap")}</li>
  </ul>

  <div class="tooltip-separator"></div>

  <ul>
    <b>${t("tooltip_dodge")}:</b>

    <li>
      <span style="color: #e6a23c;">
        ${ctx.dodge.toFixed(1)}%
      </span>

      ${t("tooltip_chance_to_dodge")}
    </li>

    <li>${t("tooltip_negates_damage")}</li>
  </ul>

  <div class="tooltip-separator"></div>

  ${getBlockTooltip(ctx)}
  `
},
  
  
  
energystat: {
  title: "stat_energy_title",

  desc: (ctx) => `
  <ul>
    ${t("tooltip_energy_desc_intro")}

    <li>
      ${t("tooltip_energy_fight")}
      <span style="color: #e6a23c;">10 ${t("tooltip_energy_unit")}</span>
    </li>

    <li>
      ${t("tooltip_energy_chest")}
      <span style="color: #e6a23c;">8 ${t("tooltip_energy_unit")}</span>
    </li>

    <li>
      ${t("tooltip_energy_shrine")}
      <span style="color: #e6a23c;">6 ${t("tooltip_energy_unit")}</span>
    </li>

    <li>
      ${t("tooltip_energy_step")}
      <span style="color: #e6a23c;">6 ${t("tooltip_energy_unit")}</span>
    </li>

    <b>${t("tooltip_base_regeneration")}:</b>

    <span style="color: #e6a23c;">
      ${(ctx.energyRegen * 60).toFixed(1)} / ${t("tooltip_per_minute")}
    </span>

    <li>
      ${t("tooltip_current_energy")}
      <span style="color: #e6a23c;">
        ${(gameState.resources.energyState.current).toFixed(0)} /
        ${(gameState.resources.energyState.max).toFixed(0)}
      </span>
    </li>

    <div class="tooltip-separator"></div>

    ${t("tooltip_if_energy_low")}

    <li>${t("tooltip_fatigue_weakened")}</li>
    <li>${t("tooltip_fatigue_stack")}</li>

    <div class="tooltip-separator"></div>

    ${t("tooltip_recovering_energy")}

    <li>${t("tooltip_remove_fatigue")}</li>
    <li>${t("tooltip_campfire_food_restore")}</li>

    <div class="tooltip-separator"></div>

    <span style="color: red;">0 ${t("tooltip_energy_unit_lower")}</span>
    ${t("tooltip_extreme_exhaustion")}

    <li>${t("tooltip_max_fatigue_start")}</li>
  </ul>
  `
},

atkspd: {
  title: "stat_attack_speed_title",

  desc: (ctx)=>`
  <ul>
    ${t("tooltip_attack_speed_intro")}

    <li>${t("tooltip_attack_speed_reduce_cd")}</li>

    <li>
      ${t("tooltip_next_attack_time")}
      <span style="color: #e6a23c;">
        ${ctx.baseCooldown.toFixed(1)}s.
      </span>
    </li>

    <li>${t("tooltip_attack_speed_no_damage")}</li>
    <li>${t("tooltip_attack_speed_more_hits")}</li>
    <li>${t("tooltip_attack_speed_life_on_hit")}</li>
  </ul>
  `
},

str: {
  title: "stat_strength_title",

  desc: (ctx) =>`
  <ul>
    ${t("tooltip_strength_intro")}

    <li>${t("tooltip_strength_bonus")}</li>
    <li>${t("tooltip_strength_melee")}</li>
    <li>${t("tooltip_strength_twohanded")}</li>
    <li>${t("tooltip_strength_warrior")}</li>
  </ul>
  `
},

agi: {
  title: "stat_agility_title",

  desc: (ctx) =>`
  <ul>
    ${t("tooltip_agility_intro")}

    <li>${t("tooltip_agility_dodge")}</li>
    <li>${t("tooltip_agility_dodge_bonus")}</li>
    <li>${t("tooltip_agility_armor_bonus")}</li>
    <li>${t("tooltip_agility_defense")}</li>
    <li>${t("tooltip_agility_escape")}</li>
    <li>${t("tooltip_agility_escape_cost")}</li>
    <li>${t("tooltip_agility_attack_ready")}</li>
    <li>${t("tooltip_agility_block_precision")}</li>
    <li>${t("tooltip_agility_fast_enemies")}</li>
  </ul>
  `
},
  

stamina: {
  title: "tooltip_stamina_title",
  desc: (ctx) => `
  <ul>
    ${t("tooltip_stamina_intro")}

    <li>${t("tooltip_stamina_skills_cost")}</li>
    <li>${t("tooltip_stamina_items")}</li>

    <b>${t("tooltip_stamina_base_regen")}:</b>
      <span style="color: #e6a23c;">
        ${(ctx.staminaRegen).toFixed(1)} / ${t("tooltip_per_sec")}
      </span>

    <li>
      ${t("tooltip_stamina_low_penalty")}
    </li>

    <li>
      ${t("tooltip_stamina_current_regen")}
      <span style="color: #e6a23c;">
        ${(gameState.resources.staminaState.actualRegen).toFixed(0)} / ${t("tooltip_per_sec")}
      </span>
    </li>

    <div class="tooltip-separator"></div>

    ${t("tooltip_stamina_fatigue_affects")}:

    <li>${t("tooltip_stamina_block_precision")}</li>
    <li>${t("tooltip_stamina_defensive_stance")}</li>
    <li>${t("tooltip_stamina_attack_speed_penalty")}</li>

    <div class="tooltip-separator"></div>

    <span style="color: red;">0 ${t("tooltip_stamina_resource")}</span>
    ${t("tooltip_stamina_exhaustion")}:

    <li>${t("tooltip_stamina_no_block_dodge")}</li>
    <li>${t("tooltip_stamina_regen_paused")}</li>
    <li>${t("tooltip_stamina_crit_penalty")}</li>

  </ul>
  `
},

vit: {
  title: "tooltip_vit_title",
  desc: (ctx) =>`
  <ul>
    ${t("tooltip_vit_intro")}

    <li>${t("tooltip_vit_hp_bonus")}</li>
    <li>${t("tooltip_vit_life_regen")}</li>
    <li>${t("tooltip_vit_regen_scaling")}</li>
    <li>${t("tooltip_vit_stamina_regen")}</li>
    <li>${t("tooltip_vit_long_fights")}</li>
  </ul>
  `
},

dodge: {
  title: "tooltip_dodge_title",
  desc: (ctx) =>`
  <ul>
    ${t("tooltip_dodge_intro")}

    <li>${t("tooltip_dodge_no_damage")}</li>
    <li>${t("tooltip_dodge_no_dot")}</li>
    <li>${t("tooltip_dodge_vs_heavy")}</li>
    <li>${t("tooltip_dodge_vs_fast")}</li>
  </ul>
  `
},

  
block: {
  title: "stat_block_title",
  desc: (ctx) => {
    if (ctx.blockMode === "defensive") {
      return defensiveBlockDesc(ctx);
    }

    if (ctx.blockMode === "timed") {
      return timedBlockDesc(ctx);
    }

    return `<p>${t("stat_block_no_mode")}</p>`;
  }
},
  

crit: {
  title: "stat_crit_title",
  desc: (ctx) =>`
  <ul>
    ${t("stat_crit_desc")}

    <li>${t("stat_crit_min_damage")}</li>
    <li>${t("stat_crit_softcap")}</li>
    <li>${t("stat_crit_max_chance")}</li>
    <li>
      <em>
        ${t("stat_crit_effective_chance")}:
        <span style="color: #e6a23c;">
          ${ctx.effectiveCrit.toFixed(0)}%
        </span>
      </em>
    </li>
  </ul>
  `
},

critdmg: {
  title: "stat_critdmg_title",
  desc: (ctx) =>`
  <ul>
    ${t("stat_critdmg_desc")}

    <li>${t("stat_critdmg_min_bonus")}</li>

    <li>
      ${t("stat_critdmg_current_bonus")}
      <span style="color: #e6a23c;">
        ${(ctx.critDmg)}%
      </span>
    </li>

    <li>${t("stat_critdmg_no_chance")}</li>
    <li>${t("stat_critdmg_scaling")}</li>
    <li>${t("stat_critdmg_highcrit")}</li>
  </ul>
  `
},

regen: {
  title: "stat_regen_title",
  desc: (ctx) =>`
  <ul>
    ${t("stat_regen_desc")}

    <li>${t("stat_regen_outside_combat")}</li>
    <li>${t("stat_regen_vitality")}</li>
  </ul>
  `
},

onhit: {
  title: "stat_onhit_title",
  desc: (ctx) =>`
  <ul>
    ${t("stat_onhit_desc")}

    <li>${t("stat_onhit_after_hit")}</li>
    <li>${t("stat_onhit_attack_speed")}</li>
    <li>${t("stat_onhit_no_dot")}</li>
  </ul>
  ` 
},
  

fire: {
  title: "stat_fire_title",
  desc: (ctx)=> `
  <ul>
    ${t("stat_fire_desc")}

    <li>${t("stat_fire_reduce_damage")}</li>
    <li>${t("stat_fire_reduce_dot")}</li>
    <li>${t("stat_fire_softcap")}</li>

    <li>
      ${t("stat_elemental_current_res")}
      <span style="color: #e6a23c;">
        ${ctx.resist.toFixed(1)}%
      </span>
    </li>

    <li>${t("stat_elemental_max_res")}</li>
  </ul>
  ` 
},

cold: {
  title: "stat_cold_title",
  desc: (ctx)=> `
  <ul>
    ${t("stat_cold_desc")}

    <li>${t("stat_cold_reduce_damage")}</li>
    <li>${t("stat_cold_reduce_slow")}</li>
    <li>${t("stat_cold_reduce_freeze")}</li>
    <li>${t("stat_cold_softcap")}</li>

    <li>
      ${t("stat_elemental_current_res")}
      <span style="color: #e6a23c;">
        ${ctx.resist.toFixed(1)}%
      </span>
    </li>

    <li>${t("stat_elemental_max_res")}</li>
  </ul>
  `
},

poison: {
  title: "stat_poison_title",
  desc: (ctx)=>`
  <ul>
    ${t("stat_poison_desc")}

    <li>${t("stat_poison_reduce_dot")}</li>
    <li>${t("stat_poison_stack_protection")}</li>
    <li>${t("stat_poison_softcap")}</li>

    <li>
      ${t("stat_elemental_current_res")}
      <span style="color: #e6a23c;">
        ${ctx.resist.toFixed(1)}%
      </span>
    </li>

    <li>${t("stat_elemental_max_res")}</li>
  </ul>
  `
},

magic: {
  title: "stat_magic_title",
  desc: (ctx)=> `
  <ul>
    ${t("stat_magic_desc")}

    <li>${t("stat_magic_spells")}</li>
    <li>${t("stat_magic_no_physical")}</li>
    <li>${t("stat_magic_softcap")}</li>

    <li>
      ${t("stat_elemental_current_res")}
      <span style="color: #e6a23c;">
        ${ctx.resist.toFixed(1)}%
      </span>
    </li>

    <li>${t("stat_elemental_max_res")}</li>
  </ul>
  `
},


mf: {
  title: "stat_mf_title",
  desc: (ctx) =>`
  <ul>
    ${t("stat_mf_desc")}

    <li>${t("stat_mf_enemies_chests")}</li>
    <li>${t("stat_mf_higher_rarity")}</li>
  </ul>
  `
},

gf: {
  title: "stat_gf_title",
  desc: (ctx) =>`
  <ul>
    ${t("stat_gf_desc")}

    <li>${t("stat_gf_enemies_chests")}</li>
    <li>${t("stat_gf_no_trade")}</li>
  </ul>
  `
}
  
  
};