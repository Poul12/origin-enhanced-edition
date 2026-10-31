function getSkillsTemplate() {
  return `
<div class="view" id="skills-view">

   <div id="style-panel">

     <div class="style-grid">

       <div class="style-col turtle">
         <div class="style-name">🛡️  ${t("resilience_style")}</div>
         <div class="style-value" id="turtle-points">0</div>
       </div>

       <div class="style-col timed">
         <div class="style-name">⏱️ ${t("precision_style")}</div>
         <div class="style-value" id="timed-points">0</div>
       </div>

       <div class="style-col poise">
         <div class="style-name">⚔️ ${t("brutality_style")}</div>
         <div class="style-value" id="poise-points">0</div>
       </div>

     </div>

     <div class="style-dominant">
       ${t("combat_style")}: <span id="dominant-style">Brak</span>
     </div>
 
    <div class="mastery-row">

      <div class="mastery-header">
        <span id="mastery-skill-title"></span>
        <span id="mastery-level">Lv. 1</span>
      </div>
  
      <div class="mastery-progress">

        <div id="mastery-skill-bar">

          <span id="mastery-skill-label">
            0 / 100
          </span>

        </div>

      </div>

    </div>
  
   </div>
  


   <div id="skill-tree-container">


     
     <div class="left-skill-container rare oval">
       <div class="level-text common circle" id="mastery-points"></div>
     </div> 
     
     <div class="right-skill-container set oval">
       <div class="skill-points-text common circle" id="skill-points"></div>
     </div>
     
     
     <div id="skill-info-popup" class="skill-popup">
      <div class="popup-content">
        <!--<img data-src="img/frames/frame1.png" alt="Ramka" class="skill-popup-frame" /> -->
        
        <!--<div class="popup-bg"></div>-->

       <div id="popup-content">
        
        <div class="skill-left">
          <div id="skill-name" class="skill-name"></div>
          <div id="skill-req-level" class="skill-req"></div>
          <div class="skill-cooldown-wrapper">
            <img data-src="img/icons/skill-cooldown-icon.png" alt="Cooldown" class="skill-cooldown-icon" />
            <div id="skill-cooldown" class="skill-cooldown"></div>
            <img alt="Cost" id="cost-icon" class="skill-cooldown-icon" />
            <div id="skill-cost" class="skill-cooldown"></div>    
          </div> 
          <div class="item-separator"></div>
          <div class="stat-category">${t("effects_affix")}</div>
          <div id="skill-effect" class="skill-effect"></div>
          <div class="skill-actions">
            <button id="upgrade-btn" class="item-button hidden">${t("upgrade_btn")}</button>
            <button id="activate-btn" class="item-button hidden">${t("activate_btn")}</button>
            <button id="assign-btn" class="item-button hidden">${t("assign_btn")}</button>
          </div>
        </div>

      <div class="skill-right" id="popup-right">
        <div id="skill-desc" class="skill-desc"></div>
        
        <div class="skill-icons">
          <div class="skill-upgrades">
            <div class="mini-skill" id="upgrade-1">①
              <span class="skill-level-badge" id="upgrade-level-1">0/3</span>
            </div>
            <div class="mini-skill" id="upgrade-2">②
              <span class="skill-level-badge" id="upgrade-level-2">0/3</span>
            </div>
            <div class="mini-skill" id="upgrade-3">③
              <span class="skill-level-badge" id="upgrade-level-3">0/3</span>
            </div>
          </div>
          <div class="main-skill-icon" id="main-skill-icon"></div>
          <span class="skill-level-badge main" id="skill-icon-level">0/10</span>
        </div>

       </div>
         
      </div>
        
      <div class="close-btn-wrapper">
        <button class="close-button" id="skill-close-btn" onclick="closeSkillPopup()"></button>
        <img data-src="img/buttons/close-btn.png" alt="Zamknij" class="close-btn-frame" />
      </div> 
      
     </div>
    </div>
     
            
     <!-- Nowy, pusty kontener na layout przypisywania skilli -->
    <div id="assign-popup" class="assign-layout hidden"></div>
         
     
    <svg class="connector" width="100%" height="100%">
      <!-- <line id="line1" x1="40%" y1="58%" x2="40%" y2="63%" stroke="white" stroke-width="0" />
      <line id="line2" x1="40%" y1="58%" x2="24%" y2="64%" stroke="white" stroke-width="0" />-->
    </svg>

    <!-- Focus -->
    <div class="skill-node locked" id="focus" style="left: 50%; top: 57%; transform: translate(-50%, -50%)"></div>

    <!-- Główna umiejętność (ziemia) --> 
  <!--  <div class="skill-node unlocked" id="slash" style="left: 50%; top: 57%; transform: translate(-50%, -50%)"></div> --> 
    <!-- Korona (umiejętności aktywne) -->  
   <!-- <div class="skill-node locked" id="double-attack" style="left: 50%; top: 47%; transform: translate(-50%, -50%)"></div>
    
    <div class="skill-node locked" id="charge" style="left: 33%; top: 37%; transform: translate(-50%, -50%)"></div>
    <div class="skill-node locked" id="jump" style="left: 50%; top: 37%; transform: translate(-50%, -50%)"></div>
    <div class="skill-node locked" id="warrior-shout" style="left: 66%; top: 37%; transform: translate(-50%, -50%)"></div>
    
    <div class="skill-node locked" id="skill-top-3.1" style="left: 15%; top: 35%; transform: translate(-50%, -50%)">3.1</div> -->
  
    <!-- Root -->
    <div class="skill-node unlocked" id="skill-node-1" style="transform:translate(-50%,-50%)"></div>

    <!-- Tier 2 -->
    <div class="skill-node locked" id="skill-node-2" style="transform:translate(-50%,-50%)"></div>

    <!-- Tier 3 -->
    <div class="skill-node locked" id="skill-node-3" style="transform:translate(-50%,-50%)"></div>

    <div class="skill-node locked" id="skill-node-4" style="transform:translate(-50%,-50%)"></div>

    <div class="skill-node locked" id="skill-node-5" style="transform:translate(-50%,-50%)"></div>

    <!-- Ultimate -->
    <div class="skill-node locked" id="skill-node-6" style="transform:translate(-50%,-50%)"></div>
  
  
  <!--  <div class="skill-node locked" id="skill-top-3.2" style="left: 23%; top: 27%; transform: translate(-50%, -50%)">3.2</div>
    <div class="skill-node locked" id="skill-top-3.3" style="left: 40%; top: 26%; transform: translate(-50%, -50%)">3.3</div>
    <div class="skill-node locked" id="skill-top-3.4" style="left: 57%; top: 26%; transform: translate(-50%, -50%)">3.4</div>
    <div class="skill-node locked" id="skill-top-3.5" style="left: 76%; top: 29%; transform: translate(-50%, -50%)">3.5</div>
    <div class="skill-node locked" id="skill-top-3.6" style="left: 83%; top: 37%; transform: translate(-50%, -50%)">3.6</div>
    
    <div class="skill-node locked" id="skill-top-4.1" style="left: 14%; top: 20%; transform: translate(-50%, -50%)">4.1</div>
    <div class="skill-node locked" id="skill-top-4.2" style="left: 30%; top: 19%; transform: translate(-50%, -50%)">4.2</div>
    <div class="skill-node locked" id="skill-top-4.3" style="left: 50%; top: 18%; transform: translate(-50%, -50%)">4.3</div>
    <div class="skill-node locked" id="skill-top-4.4" style="left: 67%; top: 19%; transform: translate(-50%, -50%)">4.4</div>
    <div class="skill-node locked" id="skill-top-4.5" style="left: 85%; top: 22%; transform: translate(-50%, -50%)">4.5</div>
    
    <div class="skill-node locked" id="skill-top-5.1" style="left: 28%; top: 10%; transform: translate(-50%, -50%)">5.1</div>
    <div class="skill-node locked" id="skill-top-5.2" style="left: 50%; top: 8%; transform: translate(-50%, -50%)">5.2</div>
    <div class="skill-node locked" id="skill-top-5.3" style="left: 70%; top: 10%; transform: translate(-50%, -50%)">5.3</div> -->
      <!-- Korzenie (umiejętności pasywne) -->  
    
    <div id="passive-start"></div>

    <div class="skill-node locked" id="extra-defense" style="left: 25%; top: 68%; transform: translate(-50%, -50%)"></div>
    <div class="skill-node locked" id="extra-life" style="left: 50%; top: 68%; transform: translate(-50%, -50%)"></div>
    <div class="skill-node locked" id="extra-damage" style="left: 75%; top: 68%; transform: translate(-50%, -50%)"></div>
    
    <div class="skill-node locked" id="hp-regen" style="left: 8%; top: 68%; transform: translate(-50%, -50%)"></div>
    <div class="skill-node locked" id="stack-defense" style="left: 8%; top: 92%; transform: translate(-50%, -50%)"></div>
    <div class="skill-node locked" id="max-defense" style="left: 25%; top: 80%; transform: translate(-50%, -50%)"></div>
    <div class="skill-node locked" id="perfect-block-dmg" style="left: 41%; top: 80%; transform: translate(-50%, -50%)"></div>
    <div class="skill-node locked" id="extra-stamina" style="left: 8%; top: 80%; transform: translate(-50%, -50%)"></div>
    <div class="skill-node locked" id="block-recovery" style="left: 59%; top: 80%; transform: translate(-50%, -50%)"></div>
    <div class="skill-node locked" id="atkspd-bonus" style="left: 75%; top: 80%; transform: translate(-50%, -50%)"></div>
    <div class="skill-node locked" id="extra-crit" style="left: 92%; top: 68%; transform: translate(-50%, -50%)"></div>
    
    <div class="skill-node locked" id="iron-defense" style="left: 25%; top: 92%; transform: translate(-50%, -50%)"></div>
  <!--  <div class="skill-node locked" id="stamina-regen" style="left: 41%; top: 97%; transform: translate(-50%, -50%)"></div>-->
    <div class="skill-node locked" id="perfect-chain" style="left: 41%; top: 92%; transform: translate(-50%, -50%)"></div>
    <div class="skill-node locked" id="perfect-window" style="left: 59%; top: 92%; transform: translate(-50%, -50%)"></div>
    <div class="skill-node locked" id="hp-to-dmg" style="left: 83%; top: 92%; transform: translate(-50%, -50%)"></div>
    <div class="skill-node locked" id="crit-damage-bonus" style="left: 92%; top: 80%; transform: translate(-50%, -50%)"></div>    

   </div>
  
  <div id="custom-alert-container"></div>
  
<div id="stat-tooltip" class="stat-tooltip hidden">
  <div class="stat-tooltip-title"></div>
  <div class="stat-tooltip-content"></div>
</div>


</div>

`;
}


async function renderSkillsView() {

  await withViewLoader(async () => {

    const app = document.getElementById("app");

    app.classList.add("view-hidden");
    app.innerHTML = await getSkillsTemplate();

    //await nextFrame();
    //await nextFrame();
    
    //await assetManager.preloadAssets(SKILLS_ASSETS);

   // document.getElementById("app").innerHTML = getSkillsTemplate();
    
    initSkillsView(); // tu wywołujesz logikę tej strony
    
   // initSkillsTreeBg();
    
    await waitForImages(app);
    
    await nextFrame();
    
    requestAnimationFrame(() => {
      app.classList.remove("view-hidden");
    });
    
  });
}


/*async function renderSkillsView() {
    document.getElementById("app").innerHTML = getSkillsTemplate();
  
    await assetManager.preloadAssets(SKILLS_ASSETS);

    initSkillsView(); // tu wywołujesz logikę tej strony
}*/

let skillsInitialized = false;

function initSkillsView() {

  if (typeof SKILLS_DATABASE === "undefined") return;

  loadPlayerSkills();
  //syncPlayerSkillsToSkills();
  applyAllPassiveSkills();
  renderTree();
      
  document.getElementById("skill-node-1").scrollIntoView({ behavior: "smooth" });
    
  /*document.documentElement.style.setProperty(
    "--skill-tree-bg",
    `url("${ASSET_BASE}img/backgrounds/tree-skills-bg.png")`
  );*/

  if(!appState.skillsTreeLoaded) {
    initSkillsTreeBg();
    appState. skillsTreeLoaded = true;
  }  
  
  initializeLazyImages();

  attachSkillListeners();

  attachAssignEvents();
    
  //setStylePanel();
    
  window.addEventListener("resize", drawLines);

  skillsInitialized = true;
    
  updateCharMenuIcon();
  updateSkillsMenuIcon();
  showMasteryBar();
}

async function initSkillsTreeBg() {
  await setCssAssetVar("--skill-tree-bg", "img/backgrounds/tree-skills-bg.png");
}

function showMasteryBar() {
  const masteryBar = document.getElementById("mastery-skill-bar");
  const masteryLvl = document.getElementById("mastery-level");

  const style = getCurrentWeaponStyle();
  
  setMasteryStyle(style, true);
  
  const colors = MASTERY_COLORS[style];
  const title = document.getElementById("mastery-skill-title");
  const mastery = gameState.char.weaponMastery[style];
  const masteryExp = mastery?.exp ?? 0;
  const masteryExpToNext = mastery?.expToNext ?? 0;
  const masteryLevel = mastery?.level ?? 0;
  const masteryPercent = Math.min(125, Math.round(100 * masteryExp / masteryExpToNext));

  title.textContent = t(colors?.title) ?? "";
  title.style.color = colors?.c2;
  masteryLvl.textContent = t(`item_lvl_text`) + ` ` + masteryLevel;
  
  masteryBar.style.width = masteryPercent + "%";
  const masteryLabel = document.getElementById("mastery-skill-label");
  masteryLabel.textContent = `${masteryExp} / ${masteryExpToNext}`;
  document.getElementById("weapon-mastery").textContent = masteryLevel;

}

/*function setStylePanel() {
  const panel = document.getElementById("style-panel");
  const passiveStart = document.getElementById("passive-start");

  console.error(passiveStart);
    
  const observer = new IntersectionObserver(
    ([entry]) => {
      console.error("INTERSECT:", entry.isIntersecting);
      if (entry.isIntersecting) {
        // jesteśmy przy aktywnych skillach (góra)
        panel.classList.remove("visible");
      } else {
        // zeszliśmy niżej → pasywne
        panel.classList.add("visible");
      }
    },
    {
      //root: document.getElementById("skill-tree-container"), // WAŻNE: Twój scroll container
        root:null, 
      threshold: 0,
      rootMargin: "-120px 0px 0px 0px"
    }
  );
    
  observer.observe(passiveStart);
}*/

function setStylePanel() {
  const container = document.getElementById("skill-tree-container");
  const panel = document.getElementById("style-panel");
  const passiveStart = document.getElementById("passive-start");
    
  if (!container || !panel || !passiveStart) {
    //console.warn("Brakuje elementów");
    return;
  }

  window.addEventListener("scroll", () => {
    const panel = document.getElementById("style-panel");
    const passiveStart = document.getElementById("passive-start");

    if (!panel || !passiveStart) {
      //console.warn("Brakuje elementów");
      return;
    }
      
    const triggerPoint = passiveStart.offsetTop - window.innerHeight * 0.3;

    if (window.scrollY >= triggerPoint) {
      panel.classList.add("visible");
    } else {
      panel.classList.remove("visible");
    }
  });
    
}

let skillClickHandler = null;

function attachSkillListeners() {
    
  skillClickHandler = function (e) {
    const node = e.target.closest(".skill-node");
    if (!node) return;
    showSkillPopup(node.dataset.skillId);
    playSound("open", 0.4);
  };
    
  document.getElementById("skill-tree-container")
    .addEventListener("click", skillClickHandler);

  document.getElementById("upgrade-btn")
    .addEventListener("click", levelUpSkill);

  document.getElementById("assign-btn")
    .addEventListener("click", openAssignPopup);

  document.body.addEventListener("click", confirmAssignHandler);
}

function destroySkillsView() {
  
  detachAssignEvents();
  
  const tree = document.getElementById("skill-tree-container");
  if (tree && skillClickHandler) {
    tree.removeEventListener("click", skillClickHandler);
  }

  document.getElementById("upgrade-btn")
    ?.removeEventListener("click", levelUpSkill);

  document.getElementById("assign-btn")
    ?.removeEventListener("click", openAssignPopup);

  document.body.removeEventListener("click", confirmAssignHandler);

  window.removeEventListener("resize", drawLines);

  skillsInitialized = false;
}

function confirmAssignHandler(e) {
    
    if (e.target && e.target.id === "confirm-assign-btn") {
        handleSkillAssign();
    }

}

let assignPopupClickHandler = null;

function attachAssignEvents() {
  const popup = document.getElementById("assign-popup");

  assignPopupClickHandler = (e) => {
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
  };

  popup.addEventListener("click", assignPopupClickHandler);
}

function detachAssignEvents() {
  const popup = document.getElementById("assign-popup");

  if (assignPopupClickHandler) {
    popup.removeEventListener("click", assignPopupClickHandler);
    assignPopupClickHandler = null;
  }
}