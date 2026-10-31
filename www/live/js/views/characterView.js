function getCharacterTemplate() {
  return `
<div class="view" id="character-view">

<div class="page-background" id="page-bg">
  <!-- cała zawartość strony -->
   
  <br><br><br><br>
  
    <div class="character-wrapper">
     <img data-src= "img/backgrounds/warrior.png" alt="Postać" class="character-bg" />
     <!--<img data-src="img/frames/frame1.png" id="character-frame" alt="Ramka" class="character-frame" /> -->
     <div id="equipment-slots"></div>
      
  

  <!-- LEWY GÓRNY RÓG -->
  <div class="character-discipline-badge">
    <span class="discipline-name" id="discipline-name">Unknown</span>
  </div>

  <!-- PRAWY GÓRNY RÓG -->
  <div class="character-name-badge">
    ${gameState.char.playerName || "Bohater"}
  </div>


  
    <!-- <div class="shield-mode-toggle hidden">
       <label class="shield-toggle">
         <input type="checkbox" id="block-mode-toggle">
         <span class="toggle-box"></span>
         <span class="toggle-text">${t("tactical_block_toggle")}</span>
       </label>
     </div> -->
  
  
         
  </div>
  
<div id="item-popup" class="popup hidden">
  <div class="popup-content">
    <div id="popup-content"></div>
    <!--   <img data-src="img/frames/frame1.png" alt="Ramka" class="item-frame" />--> 
      
  </div>
</div>
  
  
<!--  <br><br><br><br>
  <div class="test-buttons">
  <button onclick="generateAndEquipSet('unique')">🟡 Zestaw Unikalny</button>
  <button onclick="generateAndEquipSet('epic')">🟣 Zestaw Epicki</button>
  <button onclick="generateAndEquipSet('legendary')">🟠 Zestaw Legendarny</button>
  <button onclick="generateAndEquipRandomSet('random')">🎲 Zestaw Losowy</button>
</div> 
  -->
  
<div id="stats-popup" class="popup hidden">
  <div class="stats-popup-content">
    <div id="stats-popup-content"></div>
      
    <div class="extra-stats-container">
      <!-- <img data-src="img/frames/frame1.png" alt="Ramka" class="extra-stats-frame" /> -->
         
      <div class="extra-stat-block" data-stat="atkspd"><li><span id="atkspd-value">0</span><span> ${t("attack_spd_stat")}</span></div>
      <div class="extra-stat-block" data-stat="str"><li><span id="str-value">0</span><span> ${t("strength_stat")}</span></div>
      <div class="extra-stat-block" data-stat="dodge"><li><span id="dodge-value">0%</span><span> ${t("dodge_stat")}</span></div>
      <div class="extra-stat-block" data-stat="agi"><li><span id="agi-value">0</span><span> ${t("agility_stat")}</span></div>  
      <div class="extra-stat-block" data-stat="block"><li><span id="block-value">0%</span><span> ${t("powerblock_stat")}</span></div>
      <div class="extra-stat-block" data-stat="vit"><li><span id="vit-value">0</span><span> ${t("vitality_stat")}</span></div>
      <div class="extra-stat-block" data-stat="crit"><li><span id="crit-value">0%</span><span> ${t("crit_stat")}</span></div>
      <div class="extra-stat-block" data-stat="regen"><li><span id="lifeRegen-value">0%</span><span> ${t("hpregen_stat")}</span></div>
      <div class="extra-stat-block" data-stat="critdmg"><li><span id="critdmg-value">0%</span><span> ${t("critdmg_stat")}</span></div>    
      <div class="extra-stat-block" data-stat="fire"><li><span id="fireRes-value">0</span><span> ${t("fire_resist_stat")}</span></div>
      <div class="extra-stat-block" data-stat="onhit"><li><span id="lifeOnHit-value">0</span><span> ${t("life_onhit_stat")}</span></div>
      <div class="extra-stat-block" data-stat="cold"><li><span id="coldRes-value">0</span><span> ${t("cold_resist_stat")}</span></div>
      <div class="extra-stat-block" data-stat="mf"><li><span id="magicfind-value">0%</span><span> ${t("magic_find_stat")}</span></div>
      <div class="extra-stat-block" data-stat="poison"><li><span id="poisonRes-value">0</span><span> ${t("poison_resist_stat")}</span></div>
      <div class="extra-stat-block" data-stat="gf"><li><span id="goldfind-value">0%</span><span> ${t("gold_find_stat")}</span></div>
      <div class="extra-stat-block" data-stat="magic"><li><span id="magicRes-value">0</span><span> ${t("magic_resist_stat")}</span></div>        
  
    </div>

    <div class="close-btn-wrapper" id="stats-close-wrapper">
      <button class="close-button" id="stats-close-btn" onclick="closeStatsPopup()"></button>
      <img data-src="img/buttons/close-btn.png" alt="Zamknij" class="close-btn-frame" />
    </div> 
   
  </div>
</div>
  
<div id="attributes-popup" class="npc-popup hidden">
  <div class="popup-content">
    <div id="popup-content">
  
    <!-- TYTUŁ -->
    <h2 class="popup-title stone-title">${t("char_attr_develop")}</h2>

    <!-- DOSTĘPNE PUNKTY -->
    <div class="attribute-points">
      ${t("avaiable_attr_points")}: <span id="available-attr-points">5</span>
    </div>

    <!-- ATRUBUTY -->
    <div class="attributes-grid">
 
     <div class="attribute-row" data-attr="vitality">
       <div class="attr-left">
         <div class="attr-header">
           <span class="attr-icon">❤️</span>
           <span class="attr-name">${t("vit_points")}</span>
         </div> 
         <span class="attr-desc">${t("vit_develop_desc")}</span>
       </div>

       <div class="attr-controls">
         <button class="attr-minus">−</button>
         <span class="attr-value">0</span>
         <button class="attr-plus">+</button>
       </div>
     </div>
      
     <div class="attribute-row" data-attr="strength">
       <div class="attr-left">
         <div class="attr-header">
           <span class="attr-icon">🗡️</span>
           <span class="attr-name">${t("str_points")}</span>
         </div> 
         <span class="attr-desc">${t("str_develop_desc")}</span>
       </div>

       <div class="attr-controls">
         <button class="attr-minus">−</button>
         <span class="attr-value">0</span>
         <button class="attr-plus">+</button>
       </div>
     </div>
      
     <div class="attribute-row" data-attr="dexterity">
       <div class="attr-left">
         <div class="attr-header">
           <span class="attr-icon">🛡️</span>
           <span class="attr-name">${t("agi_points")}</span>
         </div>  
         <span class="attr-desc">${t("agi_develop_desc")}</span>
       </div>
       
       <div class="attr-controls">
         <button class="attr-minus">−</button>
         <span class="attr-value">0</span>
         <button class="attr-plus">+</button>
       </div>
     </div>
      
    </div>

    <!-- PRZYCISK -->
    <div class="confirm-button-wrapper">
      <button id="confirm-attributes" class="item-button locked" disabled>
        ${t("accept_develop")}
      </button>
    </div>
  
    <div class="close-btn-wrapper" id="attr-close-wrapper">
      <button class="close-button" id="attr-close-btn" onclick="closeAttributesPopup()"></button>
      <img data-src="img/buttons/close-btn.png" alt="Zamknij" class="close-btn-frame" />
    </div> 
   
    </div>
  </div>
</div>
  
<div id="combat-affixes-popup" class="npc-popup hidden">

  <div class="popup-content">

    <h2 class="popup-title stone-title">
      ${t("combat_codex_title")}
    </h2>

     <div id="combat-affixes-scroll">

       <div id="combat-affixes-container"></div>

     </div>
  
    <div class="close-btn-wrapper" id="affixes-close-wrapper">
      <button class="close-button" onclick="closeCombatAffixesPopup()"></button>

      <img data-src="img/buttons/close-btn.png" class="close-btn-frame">
    </div>

  </div>

</div>
  
  
<div id="guide-popup" class="npc-popup hidden">

  <div class="popup-content">
   
    <div id="guide-popup-content"></div>
  
    <div class="close-btn-wrapper" id="affixes-close-wrapper">
      <button class="close-button" onclick="closeGuidePopup()"></button>

      <img data-src="img/buttons/close-btn.png" class="close-btn-frame">
    </div>
  
  </div>

</div>

  
  
 <div class="character-top-ui"> 
  
     <button class="item-button" id="attr-btn" onclick="showAttributesPopup()">${t("attributes_btn")}</button>
  
     <button class="item-button" id="stats-btn" onclick="showStatsPopup()">${t("stats_btn")}</button>
  
     <button class="item-button" id="affixes-btn" onclick="showCombatAffixesPopup()">${t("affixes_btn")}</button>

  </div>

  
  <div class="character-bottom-ui"> 

     <button class="item-button" id="guide-btn" onclick="renderGuide()">${t("guide_btn")}</button>

  </div>
  
  
  
<div id="stat-tooltip" class="stat-tooltip hidden">
  <div class="stat-tooltip-title"></div>
  <div class="stat-tooltip-content"></div>
</div>

  <div id="custom-alert-container"></div>
  
</div> <!-- koniec page-background -->
  
    
</div>

`;
}


async function renderCharacterView() {

  await withViewLoader(async () => {

    const app = document.getElementById("app");

    app.classList.add("view-hidden");
    app.innerHTML = await getCharacterTemplate();
    
    //await assetManager.preloadAssets(ITEMS_ASSETS);
    
    await assetManager.preloadAssets(COMBAT_ASSETS);
 
    //await nextFrame();
    //await nextFrame();
    
    //document.getElementById("app").innerHTML = getCharacterTemplate();
    initCharacterView(); // tu wywołujesz logikę tej strony
    
    await waitForImages(app);
    
    requestAnimationFrame(() => {
      app.classList.remove("view-hidden");
    });
    
  });
}



/*function renderCharacterView() {
    document.getElementById("app").innerHTML = getCharacterTemplate();
    initCharacterView(); // tu wywołujesz logikę tej strony
}*/

function initCharacterView() {

  //console.error(`inventory.length start`, gameState.inventory.length);
  //console.error(`char.equipment.length start`, char.equipment.length);
    
  loadBg();
  updateAttrButtonState();

  initializeCharacterImages();
  
  const attrBtn = document.getElementById("attr-btn");
  const statsBtn = document.getElementById("stats-btn");
  const affixesBtn = document.getElementById("affixes-btn");
  const guideBtn = document.getElementById("guide-btn");

  setGlobalButtonTexture(attrBtn);
  setGlobalButtonTexture(statsBtn);
  setGlobalButtonTexture(affixesBtn);
  setGlobalButtonTexture(guideBtn);
  
  renderEquipment();
  updateCharacterView();
    
  renderStats();
    
  initBlockModeToggle();

  setDisciplineName();
  
  saveGame();
    
  updateCharMenuIcon();
  updateSkillsMenuIcon();
    
  //console.error(`inventory.length end`, gameState.inventory.length);
  //console.error(`char.equipment.length end`, char.equipment.length);
}

function setDisciplineName() {
  const disciplineName = document.getElementById("discipline-name");
  const style = getCurrentWeaponStyle();

  disciplineName.textContent = style;
}

function initializeCharacterImages() {
  document.querySelectorAll("[data-src]").forEach(img => {
         const path = img.getAttribute("data-src");
         img.src = assetManager.getResolvedAsset(path);
    });
 }


let blockModeHandler = null;

function initBlockModeToggle() {
  //console.log(`enter blockMode`);

  const blockModeEl = document.querySelector(".shield-mode-toggle");
  const checkbox = document.getElementById("block-mode-toggle");
  if (!checkbox) return;

  blockModeEl.classList.remove("hidden");

  blockModeEl.addEventListener("click", e => {
    e.stopPropagation();
  });

  blockModeEl.addEventListener("pointerdown", e => {
    e.stopPropagation();
  });
  
  checkbox.checked = gameState.char?.blockMode === "timed";

  blockModeHandler = () => {
    setBlockMode(checkbox.checked ? "timed" : "defensive", true);
  };
  
 // console.log(`blockMode end`, gameState.char.blockMode);

  checkbox.addEventListener("change", blockModeHandler);
}

function destroyCharacterView() {

  const checkbox = document.getElementById("block-mode-toggle");

  if (checkbox && blockModeHandler) {
    checkbox.removeEventListener("change", blockModeHandler);
    blockModeHandler = null;
  }
}