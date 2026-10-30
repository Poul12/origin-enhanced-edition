
 // let playerSkills = {};
  let selectedSlot = null;
  //let assignedSkills = {}; // lub z localStorage
  let selectedSkillId = null;
  let enemyStatusTimeouts = [];
  let mainSkillClicked = false; // 🔹 kontroluje, czy kliknięto główną ikonę

function resetPassiveBonuses(char) {
  char.bonus = {
    maxHp: 0,
    dmg: 0,
    def: 0,
    dmgVsStatus: 0,
    maxEnergy: 0,
    staminaRegen: 0,
    maxStamina: 0,
    hpRegen: 0,
    maxHpPct: 0,
    dmgPct: 0,
    defPct: 0,
    critBonus: 0,
    critDmgBonus: 0,
    atkspdBonus: 0,
    perfectDmgBonus: 0,
    perfectWindowBonus: 0,
    perfectChainBonus: 0,
    blockReductionBonus: 0,
    blockCooldownBonus: 0,
    energyRegen: 0,
    dmgReduction: {
      reduction: 0,
      cooldown: 0
    },
    stackDefense: {
      stack: 0,
      duration: 0
    },
    hpToDmg: {
      threshold: 0,
      maxBonus: 0
    }   
  };
}

const SKILL_TREE_LAYOUTS = {

  bulwark: {
    1: { x: 50, y: 47 },
    2: { x: 50, y: 37 },
    3: { x: 50, y: 27 },
    4: { x: 33, y: 17 },
    5: { x: 66, y: 17 },
    6: { x: 50, y: 7 }
  },

  berserker: {
    1: { x: 50, y: 47 },
    2: { x: 50, y: 37 },
    3: { x: 62, y: 27 },
    4: { x: 30, y: 22 },
    5: { x: 62, y: 17 },
    6: { x: 50, y: 7 }
  },

  duelist: {
    1: { x: 50, y: 47 },
    2: { x: 50, y: 37 },
    3: { x: 62, y: 27 },
    4: { x: 38, y: 22 },
    5: { x: 62, y: 17 },
    6: { x: 50, y: 7 }
  },

  warden: {
    1: { x: 50, y: 47 },
    2: { x: 50, y: 37 },
    3: { x: 62, y: 27 },
    4: { x: 38, y: 27 },
    5: { x: 50, y: 17 },
    6: { x: 50, y: 7 }
  }

  
};

/*function loadPlayerSkills() {
  let skills = gameState.combat.skills;
  
  if (skills.playerSkills) {
   // console.log("loading");
    
    // UZUPEŁNIJ NOWE SKILLE, KTÓRE NIE ISTNIEJĄ W STARYM ZAPISIE
    for (const skillId in SKILLS_DATABASE) {
      if (!skills.playerSkills.hasOwnProperty(skillId)) {
        skills.playerSkills[skillId] = {
          level: SKILLS_DATABASE[skillId].level || 0,
          unlocked: SKILLS_DATABASE[skillId].unlocked || false
        };
     //   console.log("Dodano brakujący skill:", skillId);
      }
    }
    
    saveGame();
    } else {
    // Pierwsze uruchomienie gry
    skills.playerSkills = {};
    for (const skillId in SKILLS_DATABASE) {
      skills.playerSkills[skillId] = {
        level: SKILLS_DATABASE[skillId].level || 0,
        unlocked: SKILLS_DATABASE[skillId].unlocked || false
      };
    }
    saveGame();
  }
}

function syncPlayerSkillsToSkills() {
  const skills = gameState.combat.skills;
  
  for (const skillId in SKILLS_DATABASE) {
    if (skills.playerSkills[skillId]) {
      skills.playerSkills[skillId].level = skills.playerSkills[skillId].level;
      skills.playerSkills[skillId].unlocked = skills.playerSkills[skillId].unlocked;
    }
  }
}*/

function loadPlayerSkills() {
  const skills = gameState.combat.skills;

  if (!skills.playerSkills) {
    skills.playerSkills = {};
  }

  // ===== PASYWNE =====

  if (!skills.playerSkills.passive) {
    skills.playerSkills.passive = {};
  }

  for (const skillId in SKILLS_DATABASE) {
    const base = SKILLS_DATABASE[skillId];

    if (base.type !== "passive") continue;

    if (!skills.playerSkills.passive[skillId]) {
      skills.playerSkills.passive[skillId] = {
        level: base.level || 0,
        unlocked: base.unlocked || false
      };
    }
  }

  // ===== AKTYWNE =====

  if (!skills.playerSkills.active) {
    skills.playerSkills.active = {};
  }

  for (const treeId in WEAPON_SKILL_TREES) {
    if (!skills.playerSkills.active[treeId]) {
      skills.playerSkills.active[treeId] = {};
    }

    const tree = WEAPON_SKILL_TREES[treeId];

    for (const skillId of tree.skills) {
      if (!skills.playerSkills.active[treeId][skillId]) {
        const base = SKILLS_DATABASE[skillId];

        skills.playerSkills.active[treeId][skillId] = {
          level: base.level || 0,
          unlocked: base.unlocked || false
        };
      }
    }
  }

  saveGame();

}


function getCurrentWeaponStyle() {
  const eq = gameState.char?.equipment || {};
  const weapon = eq[`weapon`];

  
  switch(weapon?.baseName) {
    case `double_axe`:
      return `berserker`;
    
    case `great_sword`:
      return `executioner`;
   
    case `hammer`:
      return `juggernaut`;
   
    case `spear`:
      return `warden`;
   
    default:
      break;
  }
  
  if(gameState.char.blockMode === `defensive`) {
    return `bulwark`;
  } else if(gameState.char.blockMode === `timed`) {
    return `duelist`;
  }
  
}

function syncPlayerSkillsToSkills() {
  const style = getCurrentWeaponStyle();

  return {
    passive: gameState.combat.skills.playerSkills.passive,
    active: gameState.combat.skills.playerSkills.active[style]
  };

}

/*function applyAllPassiveSkills() {
  const skills = gameState.combat.skills;
    
  resetPassiveBonuses(gameState.char);
    
  for (const skillId in skills.playerSkills) {
    const playerSkill = skills.playerSkills[skillId];
    const skill = SKILLS_DATABASE[skillId];
    //if (skill.baseCooldown !== 0) continue;
    if (!playerSkill?.unlocked || !skill?.effects) continue;
   // console.log("skill name", skill.name);
    playerSkill.id = skillId;
    
    //applyPassiveSkill(playerSkill);
    applyPassiveSkill(skillId, playerSkill);
  }

  // Odśwież pasek statystyk
  renderStats();
}*/

function applyAllPassiveSkills() {
  const passiveSkills = gameState.combat.skills.playerSkills.passive;

  resetPassiveBonuses(gameState.char);
  
  for (const skillId in passiveSkills) {
    const playerSkill = passiveSkills[skillId];
    const skill = SKILLS_DATABASE[skillId];

    if (!playerSkill?.unlocked || !skill?.effects) {
      continue;
    }
    
    playerSkill.id = skillId;
    applyPassiveSkill(skillId, playerSkill);

  }
  
  renderStats();
}

function calculateStylePoints(playerSkills) {
  const styles = {
    turtle: 0,
    timed: 0,
    poise: 0
  };

  for (const skillId in playerSkills) {
    const state = playerSkills[skillId];
    const base = SKILLS_DATABASE[skillId];

    if (!state?.unlocked || state.level <= 0) continue;
    if (!base?.style || base.style === "universal") continue;

    styles[base.style] += state.level;
  }

  return styles;
}

function getDominantStyle(styles) {
  const entries = Object.entries(styles);

  entries.sort((a, b) => b[1] - a[1]);

  const [topStyle, points] = entries[0];

  if (points === 0) return `${t("none_style")}`;

  const names = {
    turtle: `${t("turtle_style")}`,
    timed: `${t("timed_style")}`,
    poise: `${t("poise_style")}`
  };

  return names[topStyle];
}

function renderStyleUI(skills) {
  const styles = calculateStylePoints(skills);

  document.getElementById("turtle-points").textContent = styles.turtle;
  document.getElementById("timed-points").textContent = styles.timed;
  document.getElementById("poise-points").textContent = styles.poise;

  document.getElementById("dominant-style").textContent =
    getDominantStyle(styles);
}

 /* function renderTree() {
    let assignedSkills = gameState.combat.skills.assignedSkills;
    const skills = gameState.combat.skills;

    for (const id in SKILLS_DATABASE) {
      const node = document.getElementById(id);
      //const skill = SKILLS_DATABASE[id];
      
      const base = SKILLS_DATABASE[id];
      const skill = skills.playerSkills[id];

      if (!node || !base || !skill) continue;

      node.classList.add(`style-${base.style}`);
      node.dataset.level = `${skill.level}/${base.maxLevel}`;
      
      if (skill.unlocked && skill.level > 0) {
        node.classList.remove("locked");
        node.classList.add("unlocked");
        if(!node.classList.contains(`rare`)){
           //node.classList.add("set-slot");
        }   
      } else {
        node.classList.remove("unlocked");
        node.classList.add("locked");
        //node.classList.add("common-slot");
      }
      
      
      // Usuń poprzednie obrazki, jeśli istnieją
      node.querySelectorAll("img").forEach(img => img.remove());

      // Dodaj ikonę
      if (base.icon && base.icon.endsWith(".png")) {
         const skillSrc = assetManager.getResolvedAsset(base.icon);

         const img = document.createElement("img");
         img.src = `${skillSrc}`;
         img.alt = base.name;
         img.className = "skill-icon-img";
         node.appendChild(img);
      } else {
         node.textContent = base.icon || "⚔️";
      }

      // Teraz klasa się zachowa
      if (Object.values(assignedSkills).includes(id)) {
         node.classList.add("combat");
      } else {
         node.classList.remove("combat");
      }

    }
    
    drawLines();
    
    renderStyleUI(gameState.combat.skills.playerSkills);
    
    //document.getElementById("charge").scrollIntoView({ behavior: "smooth" });
    
    document.getElementById("char-level").textContent = gameState.char.level;
    document.getElementById("skill-points").textContent = gameState.char.skillPoints;
    
    updateSkillsMenuIcon();
    
  }*/

function applySkillTreeLayout(weaponStyle) {

  const layout = SKILL_TREE_LAYOUTS[weaponStyle];

  if (!layout) return;

  Object.entries(layout).forEach(([nodeId, position]) => {

    const node = document.getElementById(`skill-node-${nodeId}`);

    if (!node) return;

    node.style.left = `${position.x}%`;
    node.style.top = `${position.y}%`;

  });
}

function renderTree() {
  const weaponStyle = getCurrentWeaponStyle();
  const assignedSkills = gameState.combat.skills.assignedSkills[weaponStyle];
  const passiveSkills = gameState.combat.skills.playerSkills.passive;
  const activeSkills = gameState.combat.skills.playerSkills.active[weaponStyle];
  const mastery = gameState.char.weaponMastery[weaponStyle];

  applySkillTreeLayout(weaponStyle); 
  
  // Najpierw ukryj wszystkie aktywne skille
  for (const id in SKILLS_DATABASE) {
    const base = SKILLS_DATABASE[id];
    const skill = passiveSkills[id];

    if (base.type !== "passive") continue;
    //console.log(`passive id`, id);
    const node = document.getElementById(id);
    //console.log(`node`, node);

    if (!node) continue;

    //node.style.display = "none";
    
    node.style.display = "";

    node.className = "skill-node";

    node.classList.add(`style-${base.style}`);

    node.dataset.level = `${skill.level}/${base.maxLevel}`;
  
    node.dataset.skillId = id;

    if (skill.unlocked && skill.level > 0) {
      node.classList.remove("locked");
      node.classList.add("unlocked");
    } else {
      node.classList.remove("unlocked");
      node.classList.add("locked");
    }

    // Usuń poprzednią ikonę
    node.querySelectorAll("img").forEach(img => img.remove());

    // Dodaj ikonę
    if (base.icon && base.icon.endsWith(".png")) {
      const skillSrc = assetManager.getResolvedAsset(base.icon);
      const img = document.createElement("img");

      img.src = skillSrc;
      img.alt = base.name;
      img.className = "skill-icon-img";

      node.appendChild(img);
    } else {
      node.textContent = base.icon || "⚔️";
    }

    //console.log(`passive base`, base.name);

  }

  renderStyleUI(passiveSkills);

  drawLines();
  
  document.getElementById("skill-points").textContent = gameState.char.skillPoints;

  updateSkillsMenuIcon();

  // Render aktualnego drzewka
  const tree = WEAPON_SKILL_TREES[weaponStyle];
  
  if(!tree) {
    console.warn("Brak drzewa dla:", weaponStyle);
    return;
  }

  const skillIds = tree.skills;
  
  //for (const id of tree.skills) {
  for(let i = 0; i < 6; i++){
    const node = document.getElementById(`skill-node-${i+1}`);
    //const node = document.getElementById(id);
    const skillId = skillIds[i];
    const base = SKILLS_DATABASE[skillId];
    const skill = activeSkills[skillId];

    if (!node || !base || !skill) continue;

    node.style.display = "";

    node.className = "skill-node";

    //node.classList.add(`style-${base.style}`);

    node.dataset.level = `${skill.level}/${base.maxLevel}`;

    node.dataset.skillId = skillId;
    
    if (skill.unlocked && skill.level > 0) {
      node.classList.remove("locked");
      node.classList.add("unlocked");
    } else {
      node.classList.remove("unlocked");
      node.classList.add("locked");
    }

    // Usuń poprzednią ikonę
    node.querySelectorAll("img").forEach(img => img.remove());

    // Dodaj ikonę
    if (base.icon && base.icon.endsWith(".png")) {
      const skillSrc = assetManager.getResolvedAsset(base.icon);
      const img = document.createElement("img");

      img.src = skillSrc;
      img.alt = base.name;
      img.className = "skill-icon-img";

      node.appendChild(img);
    } else {
      node.textContent = base.icon || "⚔️";
    }

    if (Object.values(assignedSkills).includes(skillId)) {
      node.classList.add("combat");
    } else {
      node.classList.remove("combat");
    }

  }

  drawLines();
  
  document.getElementById("mastery-points").textContent = mastery.skillPoints;

  //document.getElementById("skill-points").textContent = gameState.char.skillPoints;

  //updateSkillsMenuIcon();

}


function getPlayerSkillData(skillId) {
  const playerSkills = gameState.combat.skills.playerSkills;

  // passive
  if (playerSkills.passive?.[skillId]) {
    return playerSkills.passive[skillId];
  }
  
  // active - aktualna broń
  const style = getCurrentWeaponStyle();

  if (playerSkills.active?.[style]?.[skillId]) {
    return playerSkills.active[style][skillId];
  }
  
  return null;
}

function getSkillRequiredLevel(skillId) {
  const skill = SKILLS_DATABASE[skillId];
  //const playerSkill = gameState.combat.skills.playerSkills[skillId];
  const playerSkill = getPlayerSkillData(skillId);

  if (!skill || !playerSkill) return 999;
  
  const style = getCurrentWeaponStyle();
  const mastery = gameState.char.weaponMastery[style];

  const base = skill.requiredLevel;
  let lvl = playerSkill.level;
  
  if(skill.type === `active`) {
   lvl = mastery.level;
  }
    
  // pierwszy unlock
  if (!playerSkill.unlocked) return base;

  // kolejne levele
  //return base + (lvl * 2);
  return base + Math.ceil(lvl * 2.5); //jesli rosnąco
}


function canUnlockSkill(skillId) {
  const skill = SKILLS_DATABASE[skillId];
  //const playerSkill = gameState.combat.skills.playerSkills[skillId];
  const playerSkill = getPlayerSkillData(skillId);

  if (!skill || !playerSkill) return false;
  
  let requiredLevel = skill.requiredLevel;
  
  if(skillId === `focus`) {
    requiredLevel = getSkillRequiredLevel(skillId);
  } 
  
  const style = getCurrentWeaponStyle();
  const mastery = gameState.char.weaponMastery[style];

   // Sprawdź poziom postaci
  if(skill.type !== `active`) {
    if (gameState.char.level < requiredLevel) return false;
  } else {
    if (mastery.level < requiredLevel) return false;
  }
  
  // Sprawdź, czy parent jest odblokowany (jeśli istnieje)
  if (skill.parent) {
    //const parentPlayerSkill = gameState.combat.skills.playerSkills[skill.parent];
    const parentPlayerSkill = getPlayerSkillData(skill.parent);

    if (!parentPlayerSkill || !parentPlayerSkill.unlocked || parentPlayerSkill.level < 1) return false;
  }
    
  return true;
}

/*function unlockSkill(skillId) {
  const playerSkill =
    gameState.combat.skills.playerSkills[skillId];

  if (!canUnlockSkill(skillId)) {
    showInfoAlert("Za niski poziom.");
    return;
  }

  if (!playerSkill.unlocked) {
    playerSkill.unlocked = true;
    playerSkill.level = 1;
  } else {
    playerSkill.level++;
  }

  syncPlayerSkillsToSkills();
  saveGame();
  applyAllPassiveSkills();
}*/


function unlockSkill(skillId) {
  const skill = SKILLS_DATABASE[skillId];
  //const playerSkill = gameState.combat.skills.playerSkills[skillId];
  const playerSkill = getPlayerSkillData(skillId);

  /*if (!canUnlockSkill(skillId)) {
    showInfoAlert(`${t("low_level_skill_info")}`);
    return;
  }*/

 // console.error(`upgrade skill`);
  
  if (!playerSkill.unlocked && gameState.char.level >= skill.requiredLevel) {
    playerSkill.unlocked = true;
    
    //syncPlayerSkillsToSkills();
    //renderStats();
    saveGame();
    applyAllPassiveSkills();
   // renderTree();
  }
  
  const style = getCurrentWeaponStyle();
  const mastery = gameState.char.weaponMastery[style];

  if (!playerSkill.unlocked && mastery.level >= skill.requiredLevel) {
    playerSkill.unlocked = true;
    saveGame();
  }
}

function highlightIcon(element) {
  document.querySelectorAll(".main-skill-icon, .mini-skill").forEach(icon => {
    icon.classList.remove("active");
  });
  element.classList.add("active");
}

function showSkillPopup(id) {
  const popup = document.getElementById("skill-info-popup");
  const content = document.getElementById("popup-content");
  const upgradeBtn = document.getElementById("upgrade-btn");
  const assignBtn = document.getElementById("assign-btn");
  const activateBtn = document.getElementById("activate-btn");
  const mainIcon = document.getElementById("main-skill-icon");
  const miniIcons = document.querySelectorAll(".mini-skill");
  const skill = SKILLS_DATABASE[id];
  //const playerSkill = gameState.combat.skills.playerSkills[id];
  const playerSkill = getPlayerSkillData(id);

  if (!skill || !playerSkill) return;
  
  renderMiniSkillIcons();
  
  if(skill.style === `turtle`) {
    setPopupBackground3(`#skill-info-popup .popup-content`, `set`);
  } else if(skill.style === `timed`) {
    setPopupBackground3(`#skill-info-popup .popup-content`, `rare`);
  } else if(skill.style === `poise`) {
    setPopupBackground3(`#skill-info-popup .popup-content`, `special`);
  } else {
    setPopupBackground3(`#skill-info-popup .popup-content`, `other`);
  }
  
  selectedSkillId = id;
  mainSkillClicked = false;

  // 🔹 Reset przycisków
  upgradeBtn.classList.add("hidden");
  activateBtn.classList.add("hidden");

  // 🔹 Zablokowany skill → przycisk AKTYWUJ
  if (!playerSkill.unlocked) {
    activateBtn.classList.remove("hidden");
    upgradeBtn.classList.add("hidden");
    activateBtn.disabled = false;
    activateBtn.style.opacity = 1;
    
    if(!canUnlockSkill(id)) {
      activateBtn.disabled = true;
      activateBtn.style.opacity = 0.5;
    }
    
    mainIcon.classList.add("locked");
    miniIcons.forEach(icon => {
      icon.classList.add("locked");
      icon.style.pointerEvents = "none";
    });

    // 🔘 Kliknięcie AKTYWUJ → używa gotowej funkcji unlockSkill()
    activateBtn.onclick = () => {
      if (!canUnlockSkill(id)) {
        //showInfoAlert("Nie spełniasz warunków, aby odblokować ten skill.");
        showInfoAlert(`${t("low_level_skill_info")}`);
        return;
      }
    
      const weaponStyle = getCurrentWeaponStyle();
      const mastery = gameState.char.weaponMastery[weaponStyle];

      /*if (gameState.char.skillPoints <= 0 || mastery.skillPoints <= 0) {
        //showInfoAlert("Brak punktów umiejętności!");
        showInfoAlert(`${t("no_skill_points_info")}`);
        return;
      }*/

      if (skill.type === `active` && mastery.skillPoints <= 0) {
        showInfoAlert(`${t("no_mastery_points_info")}`);
        return;
      }

      if (skill.type !== `active` && gameState.char.skillPoints <= 0) {
        showInfoAlert(`${t("no_skill_points_info")}`);
        return;
      }
      
      // 🔓 Odblokowanie
      if(skill.type !== `active`) {
        gameState.char.skillPoints--;
      } else {
        mastery.skillPoints--;
      }
      
      playerSkill.level++;
      unlockSkill(id);

      playSound("skill-unlock", 0.4);

      showInfoAlert(`${t("skill_unlocked_info")}`, 2000, true);

      //showSkillInfo(id);
      
      //renderTree();
      showSkillPopup(id); // odśwież popup
    };
  } 
  else {
    // 🔓 Odblokowany skill → przycisk ULEPSZ
    upgradeBtn.classList.remove("hidden");
    activateBtn.classList.add("hidden");

    mainIcon.classList.remove("locked");
    miniIcons.forEach(icon => {
      icon.classList.remove("locked");
      icon.style.pointerEvents = "auto";
    });
  }

  // 🔹 Przycisk PRZYPISZ
  if (playerSkill.level >= 1 && skill.baseCooldown !== 0 && id !== `focus`) {
    assignBtn.classList.remove("hidden");
  } else {
    assignBtn.classList.add("hidden");
  }

  // 🔹 Ikona główna
 // mainIcon.textContent = skill.icon || "⚔️";
  
  const skillIconSrc = assetManager.getResolvedAsset(skill.icon);
  
  if (skill.icon && skill.icon.endsWith(".png")) {
    if(skill.icon === "img/icons/crit-skill-icon.png" || skill.icon === `img/icons/deep-breaths-skill-icon.png` || skill.icon === "img/icons/max-dmg-skill-icon.png" || skill.icon === "img/icons/control-break-icon.png") {
      mainIcon.innerHTML = `<img src="${skillIconSrc}" alt="${skill.name}" class="skill-icon-img2" />`;
    } else if(skill.icon === "img/icons/max-hp-skill-icon.png" || skill.icon === "img/icons/energy-regen-skill-icon.png" || skill.icon === "img/icons/last-bastion-icon.png") {
      mainIcon.innerHTML = `<img src="${skillIconSrc}" alt="${skill.name}" class="skill-icon-img2" />`;
    } else {
      mainIcon.innerHTML = `<img src="${skillIconSrc}" alt="${skill.name}" class="skill-icon-img" />`;
    }
    
    //initializeLazyImages();
  } else {
    mainIcon.textContent = skill.icon || "⚔️";
  }
  
  // 🔹 Reset podświetleń
  document.querySelectorAll(".main-skill-icon, .mini-skill").forEach(icon => {
    icon.classList.remove("active");
  });

  // 🔹 Kliknięcie w główną ikonę
  mainIcon.onclick = () => {
    if (!playerSkill.unlocked) return;
    mainSkillClicked = true;
    highlightIcon(mainIcon);
    updateSkillEffects(id);
    updateSkillDescription(id);
    if(playerSkill.level < skill.maxLevel) {
      upgradeBtn.disabled = false;
      upgradeBtn.style.opacity = 1;
    }   
  };

  miniIcons.forEach(icon => {
    icon.onclick = () => {
      if (!playerSkill.unlocked) return;

      const style = icon.dataset.style;

      highlightIcon(icon);
      mainSkillClicked = false;
      upgradeBtn.disabled = true;
      upgradeBtn.style.opacity = 0.5;

      updateSkillUpgradeDescription(id, style);
    };
  });
  
  // 🔹 Kliknięcia mini-ikon
/*  miniIcons.forEach(icon => {
    icon.onclick = () => {
      if (!playerSkill.unlocked) return;
      highlightIcon(icon);
      mainSkillClicked = false;
      upgradeBtn.disabled = true;
      upgradeBtn.style.opacity = 0.5;
    };
  });*/

  // 🔹 Domyślnie ULEPSZ wyłączony
  upgradeBtn.disabled = true;
  upgradeBtn.style.opacity = 0.5;
  
  assignBtn.onclick = () => {
    openAssignPopup();
  };
  
  //showPopupBackground();
  
  // 🔹 Pokaż info o skillu
  showSkillInfo(id);

  // 🔹 Pokaż popup
  popup.classList.add("show");
  
  // 🔹 Tekstury przycisków
  setGlobalButtonTexture(assignBtn);
  setGlobalButtonTexture(upgradeBtn);
  setGlobalButtonTexture(activateBtn);
}

function showPopupBackground() {
  const container = document.getElementById("popup-right");
  
  container.style.backgroundImage = `url("${ASSET_BASE}/img/backgrounds/pergamin.png")`;
  container.style.backgroundRepeat = "no-repeat";
  container.style.backgroundPosition = "center";
  container.style.backgroundSize = "110% 105%";
  container.style.background = `transparent`;
}

const STYLE_ICONS = {
  turtle: "img/icons/turtle-mini-icon.png",
  timed: "img/icons/timed-mini-icon.png",
  poise: "img/icons/poise-mini-icon.png"
};

function renderMiniSkillIcons() {
  const miniIcons = document.querySelectorAll(".mini-skill");

  const stylesOrder = ["turtle", "timed", "poise"];

  miniIcons.forEach((iconEl, index) => {
    const style = stylesOrder[index];
    const iconPath = STYLE_ICONS[style];

    iconEl.dataset.style = style;

    const styleIconSrc = assetManager.getResolvedAsset(iconPath);
    
    iconEl.innerHTML = `
      <img src="${styleIconSrc}" class="mini-style-icon" />
      <span class="skill-level-badge" id="upgrade-level-${index + 1}">0/3</span>
    `;
  });
}

function updateSkillUpgradeDescription(skillId, style) {
  const skillDescEl = document.getElementById("skill-desc");

  const styleNames = {
    turtle: t("resilience_style"),
    timed: t("precision_style"),
    poise: t("brutality_style")
  };

  const styleDescriptions = {
    turtle: t("style_turtle_desc"),
    timed: t("style_timed_desc"),
    poise: t("style_poise_desc")
  };
  
  skillDescEl.innerHTML = `
    <div class="upgrade-desc">
      <div class="upgrade-title">${styleNames[style]}</div>
      <div class="upgrade-text">${styleDescriptions[style]}</div>
      <div class="upgrade-note">${t("styles_in_development")}</div>
    </div>
  `;
}

function showSkillInfo(id) {
  const skill = SKILLS_DATABASE[id];
  //const playerSkill = gameState.combat.skills.playerSkills[id];
  const playerSkill = getPlayerSkillData(id);

  if (!skill) return;

  let wymaganyHTML =
    skill.requiredLevel > gameState.char.level
      ? `<div style="color:red;">${t("skill_lvl_req")}: ${skill.requiredLevel}</div>`
      : `<div>${t("skill_lvl_req")}: ${skill.requiredLevel}</div>`;

  if(id === `focus`) {
    const requiredLevel = getSkillRequiredLevel(id);
    wymaganyHTML =
    requiredLevel > gameState.char.level
      ? `<div style="color:red;">${t("skill_lvl_req")}: ${requiredLevel}</div>`
      : `<div>${t("skill_lvl_req")}: ${requiredLevel}</div>`;
  }
  
  const style = getCurrentWeaponStyle();
  const mastery = gameState.char.weaponMastery[style];
  
  if(skill.type === `active`) {
    wymaganyHTML =
    skill.requiredLevel > mastery.level
      ? `<div style="color:red;">${t("skill_lvl_req")}: ${skill.requiredLevel}</div>`
      : `<div>${t("skill_lvl_req")}: ${skill.requiredLevel}</div>`;
  }
  
  
  const skillName = document.getElementById("skill-name");
  skillName.textContent = t(skill.name);
  document.getElementById("skill-req-level").innerHTML = wymaganyHTML;
  document.getElementById("skill-icon-level").textContent =
    playerSkill.level + "/" + skill.maxLevel;
  //document.getElementById("skill-desc").textContent = skill.description;
  
  if(skill.style === `turtle`) skillName.style.color = `#9fe3a1`;
  else if(skill.style === `timed`) skillName.style.color = `#9fc7ff`;
  else if(skill.style === `poise`) skillName.style.color = `#ff9a9a`;
  else skillName.style.color = `#007210`;
  
  const cooldownEl = document.getElementById("skill-cooldown");
  const cooldownIcon = document.querySelector(".skill-cooldown-icon");
  const costEl = document.getElementById("skill-cost");
  const costIcon = document.getElementById("cost-icon");

  if (skill.type === `active`) {
    cooldownEl.textContent = skill.baseCooldown + " sek.";
    cooldownIcon.style.display = "inline-block"; // pokaż ikonę
    costEl.textContent = skill.staminaCost;
    costIcon.style.display = "inline-block"; // pokaż ikonę
    costIcon.src = assetManager.getResolvedAsset(`img/icons/stamina-cost-icon.png`);

  } else {
    cooldownEl.textContent = `${t("passive_skill")}`;
    cooldownIcon.style.display = "none"; // ukryj ikonę
    costEl.textContent = ``;
    costIcon.style.display = "none"; // pokaż ikonę
  }
  
  if (skill?.guardCost) {
    //cooldownEl.textContent = skill.baseCooldown + " sek.";
    //cooldownIcon.style.display = "inline-block"; // pokaż ikonę
    costEl.textContent = skill.guardCost;
    //costIcon.style.display = "inline-block"; // pokaż ikonę
    //const path = costIcon.getAttribute("data-src");
    costIcon.src = assetManager.getResolvedAsset(`img/icons/guard-cost-icon.png`);
  } 
  
  updateSkillDescription(id);
  updateSkillEffects(id);
}

function updateSkillEffects(id) {
  //const skill = SKILLS_DATABASE[id];
  const base = SKILLS_DATABASE[id];
  //const skill = gameState.combat.skills.playerSkills[id];
  const skill = getPlayerSkillData(id);

  if (!skill) return;

  const skillEffectEl = document.getElementById("skill-effect");
  skillEffectEl.innerHTML = "";

  // 🔸 Generuj efekty
  const effectsHTML = base.effects?.map((effect) => {
    const currentVal =
      effect.baseValue + Math.max(skill.level - 1, 0) * effect.scalingPerLevel;
    const nextVal =
      skill.level < base.maxLevel
        ? effect.baseValue + skill.level * effect.scalingPerLevel
        : currentVal;

    const diff =
      mainSkillClicked && skill.level < base.maxLevel
      ? nextVal - currentVal
      : 0;

    return formatEffect(id, effect.type, currentVal, diff);
    
    });

  skillEffectEl.innerHTML = effectsHTML.join("");
  initializeLazyImages();
}

function updateSkillDescription(id) {
  const skill = SKILLS_DATABASE[id];
  //const playerSkill = gameState.combat.skills.playerSkills[id];
  const playerSkill = getPlayerSkillData(id);

  if (!skill) return;

  let desc = t(skill.description);
  
  //let desc = skill.description;
  const skillDescEl = document.getElementById("skill-desc");

  // 🔹 Przelicz efekty i podstaw wartości
  skill.effects.forEach(effect => {
    //const currentValue = effect.baseValue + (skill.level - 1) * effect.scalingPerLevel;
    //const currentValue = effect.baseValue + Math.max(skill.level - 1, 0) * effect.scalingPerLevel;
    const currentValue =
      playerSkill.level > 0
      ? effect.baseValue + (playerSkill.level - 1) * effect.scalingPerLevel
      : effect.baseValue;
    
      const formattedValue = formatEffectValue(effect.type, currentValue);

    //console.error(`effect.type, currentValue, formattedValue`, effect.type, currentValue, formattedValue);
    
    // Zamień placeholder na kolorowy tekst
    desc = desc.replace(
      `{${effect.type}}`,
      `<span class="effect-number">${formattedValue}</span>`
    );
  });

  skillDescEl.innerHTML = desc;
}

// Pomocnicza funkcja formatowania wartości
function formatEffectValue(type, value) {
  switch (type) {
    case "damage": return `${value.toFixed(0)}%`;
    case "whirlwind": return `${value.toFixed(0)}%`;
    case "stun": return `${value.toFixed(1)} ${t("second_skill_effect")}.`;
    case "def-buff": return `${value.toFixed(1)}%`;
    case "slow": return `${value.toFixed(1)}%`;
    case "slowmo": return `${value.toFixed(1)}%`;
    case "slow-duration": return `${value.toFixed(1)} ${t("second_skill_effect")}.`;
    case "counter-duration": return `${value.toFixed(1)} ${t("second_skill_effect")}.`;
    case "precision-duration": return `${value.toFixed(1)} ${t("second_skill_effect")}.`;
    case "slowmo-duration": return `${value.toFixed(1)} ${t("second_skill_effect")}.`;
    case "bleed-duration": return `${value.toFixed(1)} ${t("second_skill_effect")}.`;
    case "frenzy-duration": return `${value.toFixed(1)} ${t("second_skill_effect")}.`;
    case "def-buff-duration": return `${value.toFixed(1)} ${t("second_skill_effect")}.`;
    case "shout-duration": return `${value.toFixed(1)} ${t("second_skill_effect")}.`;
    case "vulnerable-duration": return `${value.toFixed(1)} ${t("second_skill_effect")}.`;
    case "bonus-vs-status": return `${value.toFixed(0)}%`;
    case "spear-control": return `${value.toFixed(0)}`;
    case "reduce-cooldown": return `${value.toFixed(0)}%`;
    case "reduce-shield-cooldown": return `${value.toFixed(0)}%`;
    case "open-windup": return `${value.toFixed(0)}%`;
    case "windup": return `${value.toFixed(0)}%`;
    case "precision-buff": return `${value.toFixed(0)}%`;
    case "counter-strike": return `${value.toFixed(0)}%`;
    case "bleed": return `${value.toFixed(1)} %`;
    case "armor-break": return `${value.toFixed(0)}%`;
    case "life-bonus": return `${value.toFixed(0)} ${t("points_skill_effect")}.`;
    case "hp-cost": return `${value.toFixed(0)}%.`;
    case "stamina-recover": return `${value.toFixed(0)} ${t("points_skill_effect")}.`;
    case "def-bonus": return `${value.toFixed(0)} ${t("points_skill_effect")}.`;
    case "dmg-bonus": return `${value.toFixed(0)} ${t("points_skill_effect")}.`;
    case "bonus-damage": return `${value.toFixed(0)} %.`;
    case "pushback": return `${value.toFixed(0)} %.`;
    case "stamina-bonus": return `${value.toFixed(0)} ${t("points_skill_effect")}.`;
    case "hp-regen-bonus": return `${value.toFixed(1)} ${t("points_skill_effect")}. / ${t("second_skill_effect")}.`;
    case "heal-convert": return `${value.toFixed(1)} %`;
    case "max-def-bonus": return `${value.toFixed(0)}%`;
    case "dmg-reduction": return `${value.toFixed(0)}%`;
    case "buff-next-attack": return `${value.toFixed(0)}%`;
    case "cooldown": return `${value.toFixed(1)} ${t("second_skill_effect")}.`;
    case "stack-def": return `${value.toFixed(0)}%`;
    case "stack-duration": return `${value.toFixed(1)} ${t("second_skill_effect")}.`;
    case "sweep-duration": return `${value.toFixed(1)} ${t("second_skill_effect")}.`;
    case "discipline-duration": return `${value.toFixed(1)} ${t("second_skill_effect")}.`;
    case "absolute-duration": return `${value.toFixed(1)} ${t("second_skill_effect")}.`;
    case "reaver-duration": return `${value.toFixed(1)} ${t("second_skill_effect")}.`;
    case "threshold": return `${value.toFixed(1)}%`;
    case "max-bonus": return `${value.toFixed(0)}%`;
    case "crit-bonus": return `${value.toFixed(1)}%`;
    case "crit-buff-pact": return `${value.toFixed(1)}%`;
    case "crit-damage-bonus": return `${value.toFixed(0)}%`;
    case "atkspd-bonus": return `${value.toFixed(1)}%`;
    case "attack-speed": return `${value.toFixed(1)}%`;
    case "damage-buff": return `${value.toFixed(0)}%`;
    case "block-reduction": return `${value.toFixed(0)}%`;
    //case "block-cooldown": return `-${value.toFixed(1)} ${t("second_skill_effect")}.`;
    case "blocking-cost": return `-${value.toFixed(1)}%`;
    case "chain-dmg": return `${value.toFixed(0)}%`;
    case "perfect-window": return `${value.toFixed(0)}%`;
    case "perfect-dmg": return `${value.toFixed(0)}%`;
    
    default: return value.toFixed(1);
  }
}

// 🔹 Ikony + jednostki
function formatEffect(skillId, type, value, diff = 0) {
  if(!value) return ``;
  
  const iconMap = {
    damage: { icon: "img/icons/skill-dmg-icon.png", unit: "%" },
    whirlwind: { icon: "img/icons/skill-dmg-icon.png", unit: "%" },
    stun: { icon: "img/icons/skill-stun-icon2.png", unit: ` ${t("second_skill_effect")}.` },
    hpBonus: { icon: "img/icons/hp-passive-icon.png", unit: ` ${t("points_skill_effect")}.` },
    "hp-cost": { icon: "img/icons/blood-echo-icon.png", unit: `%` },
    "precision-buff": { icon: "img/icons/precision-buff-skill-icon.png", unit: "%" },
    "open-windup": { icon: "img/icons/extended-windup-skill-icon.png", unit: "%" },
    "windup": { icon: "img/icons/extended-windup-skill-icon.png", unit: "%" },
    "reduce-cooldown": { icon: "img/icons/reduce-cooldown-skill-icon.png", unit: "%" },
    "reduce-shield-cooldown": { icon: "img/icons/shield-cooldown-skill-icon.png", unit: "%" },
    "damage-buff": { icon: "img/icons/dmg-passive-icon.png", unit: "%" },
    "bonus-damage": { icon: "img/icons/dmg-passive-icon.png", unit: "%" },
    "bonus-vs-status": { icon: "img/icons/dmg-passive-icon.png", unit: "%" },
    "defense-buff": { icon: "img/icons/def-passive-icon.png", unit: "%" },
    "def-buff": { icon: "img/icons/def-passive-icon.png", unit: "%" },
    "pushback": { icon: "img/icons/pushback-skill-icon.png", unit: "%" },
    "slow-duration": { icon: "img/icons/skill-duration-icon.png", unit: ` ${t("second_skill_effect")}.` },
    "counter-duration": { icon: "img/icons/skill-duration-icon.png", unit: ` ${t("second_skill_effect")}.` },
    "precision-duration": { icon: "img/icons/skill-duration-icon.png", unit: ` ${t("second_skill_effect")}.` },
    "sweep-duration": { icon: "img/icons/skill-duration-icon.png", unit: ` ${t("second_skill_effect")}.` },
    "discipline-duration": { icon: "img/icons/skill-duration-icon.png", unit: ` ${t("second_skill_effect")}.` },
    "absolute-duration": { icon: "img/icons/skill-duration-icon.png", unit: ` ${t("second_skill_effect")}.` },
    "reaver-duration": { icon: "img/icons/skill-duration-icon.png", unit: ` ${t("second_skill_effect")}.` },
    "def-buff-duration": { icon: "img/icons/skill-duration-icon.png", unit: ` ${t("second_skill_effect")}.` },
    "slowmo-duration": { icon: "img/icons/skill-duration-icon.png", unit: ` ${t("second_skill_effect")}.` },
    "bleed-duration": { icon: "img/icons/skill-duration-icon.png", unit: ` ${t("second_skill_effect")}.` },
    "frenzy-duration": { icon: "img/icons/skill-duration-icon.png", unit: ` ${t("second_skill_effect")}.` },
    "bleed": { icon: "img/icons/bleed-skill-icon.png", unit:` % / ${t("second_skill_effect")}.` },
    "shout-duration": { icon: "img/icons/skill-duration-icon.png", unit: ` ${t("second_skill_effect")}.` },
    "vulnerable-duration": { icon: "img/icons/skill-duration-icon.png", unit: ` ${t("second_skill_effect")}.` },
    slow: { icon: "img/icons/skill-slow-icon.png", unit: "%" },
    slowmo: { icon: "img/icons/skill-slow-icon.png", unit: "%" },
    "life-bonus": { icon: "img/icons/hp-passive-icon.png", unit: ` ${t("points_skill_effect")}.` },
    "def-bonus": { icon: "img/icons/def-passive-icon.png", unit: `${t("points_skill_effect")}.` },
    "dmg-bonus": { icon: "img/icons/dmg-passive-icon.png", unit: `${t("points_skill_effect")}.` },
    "stamina-bonus": { icon: "img/icons/stamina-regen-skill-icon.png", unit: `${t("points_skill_effect")}.` },
    "hp-regen-bonus": { icon: "img/icons/hp-passive-icon.png", unit: `${t("points_skill_effect")}. / ${t("second_skill_effect")}.` },
    "heal-convert": { icon: "img/icons/hp-passive-icon.png", unit: `% / ${t("second_skill_effect")}.` },
    "stamina-recover": { icon: "img/icons/stamina-regen-skill-icon.png", unit: `${t("points_skill_effect")}.` },
    "crit-bonus": { icon: "img/icons/skill-dmg-icon.png", unit: "%" },
    "crit-buff": { icon: "img/icons/skill-dmg-icon.png", unit: "%" },
    "crit-buff-pact": { icon: "img/icons/skill-dmg-icon.png", unit: "%" },
    "spear-control": { icon: "img/icons/control-stack-skill-icon.png", unit: "" },
    "max-def-bonus": { icon: "img/icons/def-passive-icon.png", unit: "%" },
    "dmg-reduction": { icon: "img/icons/def-passive-icon.png", unit: "%" },
    "perfect-dmg": { icon: "img/icons/dmg-passive-icon.png", unit: "%" },
    "perfect-window": { icon: "img/icons/perfect-window-icon.png", unit: "%" },
    "counter-strike": { icon: "img/icons/skill-dmg-icon.png", unit: "%" },
    "chain-dmg": { icon: "img/icons/dmg-passive-icon.png", unit: "%" },
    "cooldown": { icon: "img/icons/skill-duration-icon.png", unit: ` ${t("second_skill_effect")}.` },
    //"block-cooldown": { icon: "img/icons/skill-duration-icon.png", unit: ` ${t("second_skill_effect")}.` },
    "blocking-cost": { icon: "img/icons/stamina-regen-skill-icon.png", unit: `%` },
    "block-reduction": { icon: "img/icons/def-passive-icon.png", unit: "%" },
    "stack-def": { icon: "img/icons/def-passive-icon.png", unit: "%" },
    "armor-break": { icon: "img/icons/break-armor-skill-icon.png", unit: "%" },
    "stack-duration": { icon: "img/icons/skill-duration-icon.png", unit: ` ${t("second_skill_effect")}.` },
    "crit-damage-bonus": { icon: "img/icons/dmg-passive-icon.png", unit: "%" },
    "crit-dmg-buff": { icon: "img/icons/dmg-passive-icon.png", unit: "%" },
    "buff-next-attack": { icon: "img/icons/dmg-passive-icon.png", unit: "%" },
    "threshold": { icon: "img/icons/hp-passive-icon.png", unit: "%" },
    "max-bonus": { icon: "img/icons/dmg-passive-icon.png", unit: "%" },
    "atkspd-bonus": { icon: "img/icons/atkspd-passive-icon.png", unit: "%" },
    "attack-speed": { icon: "img/icons/atkspd-passive-icon.png", unit: "%" },
  };
  
  const { icon, unit } = iconMap[type] || {
    icon: "img/icons/effects/default.png",
    unit: "",
  };
  
  //const iconUrl = assetManager.getResolvedAsset(icon);

  //console.log(`iconUrl`, iconUrl);
  //console.log(`icon`, icon);
  
  /*let diffHTML =
    diff > 0 ? `<span class="effect-up">(+${diff.toFixed(1)})</span>` : "";*/
  
  let diffHTML = "";

  if (diff > 0) {
    diffHTML = `<span class="effect-up">(+${diff.toFixed(1)})</span>`;
  } else if (diff < 0) {
    diffHTML = `<span class="effect-up">(${diff.toFixed(1)})</span>`;
  }
 
  const formattedValue = Number.isInteger(value)
    ? value
    : value.toFixed(1);
  
    
  return `
    <div class="effect-line">
      <img data-src="${icon}" alt="${type}" class="effect-icon">
      <span class="effect-value">${formattedValue}${unit}${diffHTML}</span>
    </div>
  `;
  
}

function initializeLazyImages() {
  document.querySelectorAll("[data-src]").forEach(img => {
         const path = img.getAttribute("data-src");
         img.src = assetManager.getResolvedAsset(path);
         //img.src = `${ASSET_BASE}${img.getAttribute("data-src")}`;
      });
 }


 function closeSkillPopup() {
    document.getElementById("skill-info-popup").classList.remove("show");
    renderTree();
 }

function renderAssignPreview() {
  const leftHandSrc = assetManager.getResolvedAsset("img/icons/left-hand-placeholder.png");
  const rightHandSrc = assetManager.getResolvedAsset("img/icons/right-hand-placeholder.png");
  const closeBtnSrc = assetManager.getResolvedAsset("img/buttons/close-btn.png");

  return `
    <div class="attack-row">

      <!-- LEWA RĘKA -->
      <div class="attack-slot">
        <div class="attack-wrapper left">
          <button class="attack-button common circle" id="attack-left">
            <img class="attack-icon left" src="${leftHandSrc}" alt="Atak Lewa Ręka" />
          </button>

          <div class="skill skill-1" data-slot="1">${renderSkillSlot(1)}</div>
          <div class="skill skill-2" data-slot="2">${renderSkillSlot(2)}</div>
          <div class="skill skill-3" data-slot="3">${renderSkillSlot(3)}</div>
        </div>
      </div>

      <!-- ŚRODEK -->
      <div class="assign-close-btn-wrapper">
        <button class="close-button" id="close-assign">
           <img src="${closeBtnSrc}" alt="Zamknij" class="assign-close-btn-frame" />
        </button>
      </div>
  
      <!-- PRAWA RĘKA -->
      <div class="attack-slot">
        <div class="attack-wrapper right">
          <button class="attack-button common circle" id="attack-right">
            <img class="attack-icon right" src="${rightHandSrc}" alt="Atak Prawa Ręka" />
          </button>

          <div class="skill skill-4" data-slot="4">${renderSkillSlot(4)}</div>
          <div class="skill skill-5" data-slot="5">${renderSkillSlot(5)}</div>
          <div class="skill skill-6" data-slot="6">${renderSkillSlot(6)}</div>
        </div>
      </div>
  
    </div>
  `;
}

function renderSkillSlot(slotId) {
  const weaponStyle = getCurrentWeaponStyle();
  const skillId = gameState.combat.skills?.assignedSkills[weaponStyle][slotId];
  if (!skillId) {
    return `<div class="skill-slot empty" data-slot="${slotId}">${slotId}</div>`;
  }

  const skill = SKILLS_DATABASE[skillId];
  
  const skillIconSrc = assetManager.getResolvedAsset(skill.icon);

  return `
    <div class="skill-slot filled" data-slot="${slotId}">
      <img src="${skillIconSrc}" alt="${skill.name}" class="skill-icon-img" />
    </div>
  `;
}

/*function setupAssignEvents() {
  const popup = document.getElementById("assign-popup");

  popup.addEventListener("click", e => {
    const slotEl = e.target.closest(".skill-slot");
    const closeBtn = e.target.closest("#close-assign");

    // Zamknięcie popupu
    if (closeBtn) {
      popup.classList.add("hidden");
      popup.innerHTML = "";
      renderTree();
      return;
    }

    // Kliknięcie w slot
    if (slotEl) {
      const slotId = parseInt(slotEl.dataset.slot);
      handleSlotClick(slotEl, slotId);
    }
  });
}*/

function handleSlotClick(slotEl, slotId) {
  // Usuń poprzednie przyciski i podświetlenia
  document.querySelectorAll(".ok-btn, .trash-btn").forEach(btn => btn.remove());
  document.querySelectorAll(".skill-slot.active").forEach(s => s.classList.remove("active"));
  
  const weaponStyle = getCurrentWeaponStyle();

  // Dodaj podświetlenie klikniętego slotu
  slotEl.classList.add("active");

  // 🟢 Jeśli slot pusty → można przypisać skill
  if (slotEl.classList.contains("empty")) {
    const okBtn = document.createElement("button");
    const okIconSrc = assetManager.getResolvedAsset(`img/icons/ok-icon.png`);
    
    okBtn.classList.add("ok-btn");
    okBtn.innerHTML = `<img src="${okIconSrc}" alt="OK" class="ok-icon">`;
    slotEl.appendChild(okBtn);

    okBtn.addEventListener("click", e => {
      e.stopPropagation();
      
      // 🔒 Sprawdź, czy skill jest już przypisany do innego slotu
      const alreadyAssignedSlot = Object.entries(gameState.combat.skills.assignedSkills[weaponStyle]).find(
        ([slot, skillId]) => skillId === selectedSkillId
      );

      if (alreadyAssignedSlot) {
        showInfoAlert(`${t("already_assigned_info")}`);
        return; // 🚫 nie przypisuj ponownie
      }

      // ✅ Przypisz skill do wybranego slotu
      gameState.combat.skills.assignedSkills[weaponStyle][slotId] = selectedSkillId;
      saveGame();
      openAssignPopup(); // odśwież layout przypisywania
      renderTree(); // odśwież drzewko
    });
    
    return;
  }

  // 🗑️ Jeśli slot zajęty → pokaż przycisk kosza
  if (slotEl.classList.contains("filled")) {
    const trashBtn = document.createElement("button");
    const trashIconSrc = assetManager.getResolvedAsset(`img/icons/trash-icon2.png`);

    trashBtn.classList.add("trash-btn");
    trashBtn.innerHTML = `<img src="${trashIconSrc}" alt="Usuń" class="trash-icon">`;
    slotEl.appendChild(trashBtn);

    trashBtn.addEventListener("click", e => {
      e.stopPropagation();

      delete gameState.combat.skills.assignedSkills[weaponStyle][slotId];
      saveGame();
      openAssignPopup(); // odśwież layout
      renderTree(); // odśwież drzewko
    });
  }
}

function openAssignPopup() {
  const popupArea = document.getElementById("assign-popup");
  popupArea.innerHTML = renderAssignPreview();
  popupArea.classList.remove("hidden");
  //popupArea.classList.add("show");
  document.getElementById("skill-info-popup").classList.remove("show");
  
  playSound("open", 0.4);
  
  //console.log(`popupArea show`);
  //setupAssignEvents();
}

function closeAssignPopup() {
  const assignPopup = document.getElementById("assign-popup");
  renderTree();
  assignPopup.classList.remove("show");
}

function removeSkillFromSlot() {
  const weaponStyle = getCurrentWeaponStyle();

  if (selectedSlot && gameState.combat.skills.assignedSkills[weaponStyle][selectedSlot]) {
    delete gameState.combat.skills.assignedSkills[weaponStyle][selectedSlot];
    saveGame();
    openAssignPopup(); // Odśwież popup
  }
}

function handleSkillAssign() {
  if (!selectedSlot) {
    showInfoAlert(`${t("pick_slot_info")}`);
    return;
  }
  if (!selectedSkillId) {
    showInfoAlert(`${t("no_skill_selected_info")}`);
    return;
  }
  
  const weaponStyle = getCurrentWeaponStyle();

  gameState.combat.skills.assignedSkills[weaponStyle][selectedSlot] = selectedSkillId;
  assignSkillToSlot(selectedSlot, selectedSkillId);
  saveGame();
  //console.log(`✅ Skill ${selectedSkillId} przypisany do slotu ${selectedSlot}`);

  /*closeAssignPopup();
  renderTree();*/
}

function levelUpSkill() {
  //console.log("skillPoints: ", gameState.char.skillPoints);
  if (!selectedSkillId) return;

  const skill = SKILLS_DATABASE[selectedSkillId];
  //const playerSkill = gameState.combat.skills.playerSkills[selectedSkillId];
  const playerSkill = getPlayerSkillData(selectedSkillId);
  const weaponStyle = getCurrentWeaponStyle();
  const mastery = gameState.char.weaponMastery[weaponStyle];
  
  let skillLvl = gameState.char.level;
  if(skill.type === `active`) {
    skillLvl = mastery.level;
  }
  
  if (skillLvl >= skill.requiredLevel) {
    unlockSkill(selectedSkillId);
  }
  
  if (!playerSkill.unlocked || playerSkill.level >= skill.maxLevel) return;
  
  if (!canUnlockSkill(selectedSkillId)) {
    showInfoAlert(`${t("low_level_skill_info")}`);
    return;
  }
  
  if (skill.type === `active` && mastery.skillPoints <= 0) {
    showInfoAlert(`${t("no_mastery_points_info")}`);
    return;
  }

  if (skill.type !== `active` && gameState.char.skillPoints <= 0) {
    showInfoAlert(`${t("no_skill_points_info")}`);
    return;
  }

  
  // Zwiększ poziom i zmniejsz punkty
 // console.log("skillPoints: ", gameState.char.skillPoints);

  playSound("accept", 0.4);
  
  playerSkill.level++;
  
  if(skill.type !== `active`) {
    gameState.char.skillPoints--;
  } else {
    mastery.skillPoints--;
  }

  //console.log("po levelowaniu");
  
  // Zapisz zmiany
  saveGame();
  //syncPlayerSkillsToSkills();

  // Odśwież UI
  //renderTree();
  showSkillPopup(selectedSkillId);
  //showSkillInfo(selectedSkillId);
  
  applyPassiveSkill(selectedSkillId, playerSkill);
  renderStats();
}

function applyPassiveSkill(skillId, playerSkill) {
  const char = gameState.char;
  const base = SKILLS_DATABASE[skillId];

  if (!base?.effects) return;
  
  base.effects.forEach(effect => {
    //let level = gameState.combat.skills.playerSkills[skill.id]?.level || 1;
    //if(level === 1) level = 2;
    let level = playerSkill.level;
    const value = effect.baseValue + (effect.scalingPerLevel || 0) * (level - 1);
        
    switch (effect.type) {
      case "life-bonus":
        char.bonus.maxHp = value;
    //    console.error(`life-bonus`, value);
        break;
      
      case "bonus-vs-status":
       // console.error(`bonus-vs-status`, value);
        char.bonus.dmgVsStatus = value;
        break;
      
      case "dmg-bonus":
      //  console.error(`dmg-bonus`, value);
        char.bonus.dmg = value;
        break;

      case "def-bonus":
        //console.error(`def-bonus`, value);
        char.bonus.def = value;
        break;

      case "energy-bonus":
        char.bonus.maxEnergy = value;
        break;
      
      case "stamina-regen":
        char.bonus.staminaRegen = value;
        break;
      
      case "stamina-bonus":
        char.bonus.maxStamina = value;
        break;
      
      case "hp-regen-bonus":
        char.bonus.hpRegen = value;
        break;
      
      case "max-hp-bonus":
        char.bonus.maxHpPct = value;
        break;
      
      case "max-dmg-bonus":
        char.bonus.dmgPct = value;
        break;
      
      case "dmg-reduction":
        char.bonus.dmgReduction.reduction = value;
        break;
      
      case "cooldown":
        char.bonus.dmgReduction.cooldown = value;
        break;
      
      case "stack-def":
        char.bonus.stackDefense.stack = value;
        break;
      
      case "stack-duration":
        char.bonus.stackDefense.duration = value;
        break;
      
      case "threshold":
        char.bonus.hpToDmg.threshold = value / 100;
        break;
      
      case "max-bonus":
        char.bonus.hpToDmg.maxBonus = value / 100;
        break;
      
      case "max-def-bonus":
        char.bonus.defPct = value;
        break;
      
      case "crit-bonus":
        char.bonus.critBonus = value;
        break;
      
      case "crit-damage-bonus":
        char.bonus.critDmgBonus = value;
        break;
      
      case "atkspd-bonus":
        char.bonus.atkspdBonus = value;
        break;
      
      case "perfect-dmg":
        char.bonus.perfectDmgBonus = value;
        break;
 
      case "perfect-window":
        char.bonus.perfectWindowBonus = value;
        break;
 
      case "chain-dmg":
        char.bonus.perfectChainBonus = value;
        break;
 
      case "block-reduction":
        char.bonus.blockReductionBonus = value;
        break;
      
      case "block-cooldown":
        char.bonus.blockCooldownBonus = value;
        break;
      
      case "energy-regen":
        char.bonus.energyRegen = value;
        break;
      
      case "bonusGold":
        char.bonus.bonusGold = value;
        break;

      case "bonusExp":
        char.bonus.bonusExp = value;
        break;
    }
  });

}

/*function applyPassiveSkill(skill) {
  const char = JSON.parse(localStorage.getItem("character") || "{}");
  const effects = skill.effects || [];

  effects.forEach(effect => {
   // if (effect.target !== "character") continue;
    console.log("effect target", effect.target);
    const value = effect.baseValue + (effect.scalingPerLevel || 0) * (playerSkills[skill.id]?.level || 1);

    switch (effect.type) {
      case "life-bonus":
        console.error(`life-bonus`, value);
        char.maxHp = (char.maxHp || 100) + value;
        break;
      case "dmg-bonus":
        console.error(`dmf-bonus`, value);
        char.dmg = value;
        break;
      case "def-bonus":
        char.def = value;
        break;
      case "bonusGold":
        char.bonusGold = (char.bonusGold || 0) + value;
        break;
      case "bonusExp":
        char.bonusExp = (char.bonusExp || 0) + value;
        break;
    }
  });

  localStorage.setItem("character", JSON.stringify(char));
}*/



function simulateLevelUp() {
    
    //console.log("simulate");
    gameState.char.level++;
    gameState.char.skillPoints++;
    saveGame();
    renderTree();
  }

function resetPlayerSkills() {
  const confirmReset = confirm("Czy na pewno chcesz zresetować wszystkie skille? Tej operacji nie można cofnąć.");
  if (!confirmReset) return;

  for (const skillId in playerSkills) {
    const skill = SKILLS_DATABASE[skillId];
    //const playerSkill = gameState.combat.skills.playerSkills[skillId];
    const playerSkill = getPlayerSkillData(skillId);

    //  console.log("skill's parent: ", skillId);
    playerSkill.level = 0;
   // playerSkill.unlocked = !skill.parent; // Startowe skille bez parenta zostają odblokowane
  }

  // Przywróć początkową liczbę punktów umiejętności
  //skillPoints = typeof startSkillPoints !== "undefined" ? startSkillPoints : 5;

  // (Opcjonalnie) Wyczyść cooldowny z localStorage
  /*for (const skillId in skills) {
    localStorage.removeItem(`skillCooldown-${skillId}`);
  }*/

  saveGame();  
  //syncPlayerSkillsToSkills();

  renderTree();

  if (selectedSkillId) {
    showSkillInfo(selectedSkillId);
  }
}

 /* document.addEventListener("DOMContentLoaded", () => {
    initializeGameState();
    // loadTest();
    if (typeof skills === "undefined") {
      return;
    }
    
    //console.warn(`bottom menu height: `, getComputedStyle(document.querySelector('.bottom-menu')).height);
  
    
    loadPlayerSkills();
    syncPlayerSkillsToSkills();
    //loadAssignedSkills();
    applyAllPassiveSkills();
    renderTree();
    
    document.documentElement.style.setProperty(
      "--skill-tree-bg",
      `url("${ASSET_BASE}img/backgrounds/tree-skills-bg.png")`
    );
    
    initializeLazyImages();
    
    for (const id in skills) {
      const node = document.getElementById(id);
      if (!node) continue;

      node.addEventListener("click", () => {
        showSkillPopup(id);
      });
    }

    document.getElementById("upgrade-btn").addEventListener("click", levelUpSkill);
   // document.getElementById("close-btn").addEventListener("click", closeSkillPopup);
    document.getElementById("assign-btn").addEventListener("click", openAssignPopup);
    
        
  });

document.body.addEventListener("click", e => {
      if (e.target && e.target.id === "confirm-assign-btn") {
         handleSkillAssign();
      }
    });*/

function assignSkillToSlot(slotIndex, skillId) {
  const slots = document.querySelectorAll('#slot-container .skill-slot');
  const slot = slots[slotIndex-1];
  const skill = skills[skillId];

  slot.innerHTML =`<div class="skill-icon base">${skill.icon}</div>`;
}

function getSkillNode(skillId) {

  const passiveNode = document.getElementById(skillId);
  if (passiveNode) return passiveNode;

  const activeNodes = document.querySelectorAll(".skill-node[data-skill-id]");

  for (const node of activeNodes) {
    if (node.dataset.skillId === skillId) {
      return node;
    }
  }

  return null;
}

function drawLines(activeSkills = false) {
  const container = document.getElementById("skill-tree-container");
  if(!container) return;
  
  const svg = container.querySelector("svg.connector");
  svg.innerHTML = "";

  const containerRect = container.getBoundingClientRect();

  for (const [parentId, skill] of Object.entries(SKILLS_DATABASE)) {
    //let parentNode = document.getElementById(parentId);
    const parentNode = getSkillNode(parentId);
    
    if (!parentNode || !skill.children) continue;

    const parentRect = parentNode.getBoundingClientRect();

    skill.children.forEach(childId => {
      //let childNode = document.getElementById(childId);
      const childNode = getSkillNode(childId);
           
      if (!childNode) return;

      const childRect = childNode.getBoundingClientRect();

      // Pozycje względem kontenera
      const x1 = parentRect.left - containerRect.left + parentRect.width / 2;
      const y1 = parentRect.top - containerRect.top + parentRect.height / 2;
      const x2 = childRect.left - containerRect.left + childRect.width / 2;
      const y2 = childRect.top - containerRect.top + childRect.height / 2;

      // Sprawdź status rodzica i dziecka
      const parentUnlocked = parentNode.classList.contains("unlocked");
      const childUnlocked = childNode.classList.contains("unlocked");

      // Kolor i styl linii
      let strokeColor = "gray";
      let opacity = 0.5;
      let dash = "4 3";
      
      if (parentUnlocked && childUnlocked) {
        strokeColor = "gold";
        opacity = 1.0;
        dash = "0";
      } else if (parentUnlocked && !childUnlocked) {
        strokeColor = "silver";
        opacity = 0.8;
        dash = "2 2";
      }

      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", x1);
      line.setAttribute("y1", y1);
      line.setAttribute("x2", x2);
      line.setAttribute("y2", y2);
      line.setAttribute("stroke", strokeColor);
      line.setAttribute("stroke-width", "1.5");
      line.setAttribute("stroke-linecap", "round");
      line.setAttribute("stroke-dasharray", dash);
      line.setAttribute("opacity", opacity);

      svg.appendChild(line);
    });
  }
}

//window.addEventListener("load", drawLines);
//window.addEventListener("resize", drawLines);
