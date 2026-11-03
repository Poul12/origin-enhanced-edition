async function getMapTemplate() {
  const closeBtnUrl = await assetManager.getAssetUrl("img/buttons/close-btn.png");
  
  return `
<div class="view" id="map-view">
  
    
  <div class="location-name-container">
     
    <img data-src="img/backgrounds/ribbon-title2.png" alt="Ramka" class="location-name-frame" /> 
     
     <svg viewBox="0 0 400 100" class="location-svg">
      <defs>
        
        <path id="ribbon-arc" d="M20,40 Q200,10 380,37" />
      </defs>
      <text class="ribbon-text">
        <textPath href="#ribbon-arc" startOffset="50%" text-anchor="middle" id="ribbonText">
        
        </textPath>
      </text>
    </svg>  
    
  </div> 
    

<div id="sandbox-popup" class="expedition-popup hidden">

 <div class="popup-content">

  <div class="sandbox-panel">

    <div class="sandbox-title">
      KALIBRACJA NIGIRO
    </div>

    <!-- START -->

<div class="sandbox-section">

  <div class="sandbox-section-title">Start</div>

  <div class="sandbox-row sandbox-start-row">

    <button class="item-button" onclick="startSandbox()">
      TRENUJ
    </button>

    <div class="sandbox-test-icons">

      <button class="test-icon rare"
        onclick="openSandboxPreset('initiate')">
      </button>

      <button class="test-icon unique"
        onclick="openSandboxPreset('adventurer')">
      </button>

      <button class="test-icon epic"
        onclick="openSandboxPreset('veteran')">
      </button>

      <button class="test-icon legendary"
        onclick="openSandboxPreset('champion')">
      </button>

    </div>

  </div>

</div>

  <div class="sandbox-test-panel" id="sandboxPresetPanel">

    <div class="sandbox-dialog">
      <div class="sandbox-dialog-title"></div>
      <div class="sandbox-dialog-description"></div>
    </div>

    <button class="item-button sandbox-test-btn"
      id="sandboxStartTest">
      TESTUJ
    </button>

  </div>

    <!-- ECONOMY -->

    <div class="sandbox-section">
      <div class="sandbox-section-title">Ekonomia</div>

      <div class="sandbox-row">
        <button class="item-button" onclick="addSandboxGold(100)">+100 ZŁOTA</button>
        <button class="item-button" onclick="addSandboxGold(500)">+500 ZŁOTA</button>
      </div>
    </div>


    <!-- PLAYER -->

    <div class="sandbox-section">
      <div class="sandbox-section-title">POSTAĆ</div>

      <div class="sandbox-row">
        <button class="item-button" onclick="addCharLevel(1)">+1 POZIOM</button>
        <button class="item-button" onclick="addCharLevel(5)">+5 POZIOM</button>
      </div>
    </div>


    <!-- ITEMS -->

    <div class="sandbox-section">
      <div class="sandbox-section-title">PRZEDMIOTY</div>

      <div class="sandbox-grid">

        <button class="item-button" onclick="sandboxGenerateItems({count:1, maxRarity:'rare'})">LOSOWY PRZEDMIOT</button>
        <button class="item-button" onclick="sandboxGenerateItems({count:1, slot: 'Broń', minRarity:'rare', maxRarity:'unique'})">LOSOWA BROŃ</button>
        <button class="item-button" onclick="sandboxGenerateItems({count:1, minRarity:'unique', maxRarity:'legendary'})">UNIKALNY PRZEDMIOT</button>
        <button class="item-button" onclick="generateNewShopForCity()">ODŚWIEŻ SKLEP</button>

      </div>
    </div>


    <!-- COMBAT -->

    <div class="sandbox-section">
      <div class="sandbox-section-title">TEST WALKI</div>

      <div class="sandbox-grid">
        <button class="item-button" onclick="startSandbox('west', true, 'elite')">WALCZ Z ELITĄ</button>
        <button class="item-button" onclick="startSandbox('west', true, 'mini_boss')">WALCZ Z BOSSEM</button>
        <button class="item-button" onclick="healPlayer(100)">WYLECZ POSTAĆ</button>
        <button class="item-button" onclick="refillEnergy()">ZRESETUJ ENERGIĘ</button>
      </div>
    </div>

  </div>

    <div class="close-btn-wrapper" id="item-close-wrapper-item">
      <button class="close-button" id="item-close-btn" onclick="closeSandboxPopup()"></button>
      <!-- <img src="${ASSET_BASE}img/buttons/close-btn.png" alt="Zamknij" class="expedition-close-btn-frame" /> -->
      <img src="${closeBtnUrl}" alt="Zamknij" class="expedition-close-btn-frame" />
    </div>

  </div>
</div>


<div id="expedition-popup" class="expedition-popup hidden">
  <div class="popup-content">

      <div class="expedition-panel">

        <div class="expedition-title">SYMULACJE NIGIRO</div>

        <div class="expedition-region">
          Region: <span id="expedition-region"></span>
        </div>

        <div class="expedition-section">
          <div class="expedition-mode-title">Tryb szczeliny</div>

          <div class="expedition-mode-buttons">

            <button class="expedition-mode-btn" data-mode="endless">
              GŁĘBIA NIGIRO
            </button>

            <button class="expedition-mode-btn" data-mode="limited">
              ECHO NIGIRO
            </button>

          </div>

          <div id="expedition-mode-desc" class="expedition-mode-desc-box"></div>

       </div>

       <div class="expedition-section">
         <div class="expedition-mode-title">Postęp wyprawy</div>

         <div class="expedition-progress-header">
           <span id="expedition-progress-label">
             Poziom 1
           </span>
         </div>

         <div class="expedition-progress-bar">
           <div id="expedition-progress-fill" class="expedition-progress-fill"></div>
         </div>

         <div class="expedition-progress">

           <div class="expedition-stat">
             <div id="expedition-kills" class="stat-value">-</div>
             <img data-src="img/icons/expedition-kills-icon.png" class="expedition-progress-icon">
           </div>

           <div class="expedition-stat" id="progress-impulses-stat">
             <div id="expedition-shards" class="stat-value">-</div>
             <img data-src="img/icons/expedition-impulse-icon.png" class="expedition-progress-icon">
           </div>

           <div class="expedition-stat" id="progress-gold-stat">
             <div id="expedition-gold" class="stat-value">-</div>
             <img data-src="img/icons/expedition-gold-icon.png" class="expedition-progress-icon">
           </div>

           <div class="expedition-stat">
             <div id="expedition-time" class="stat-value">-</div>
             <img data-src="img/icons/expedition-time-icon.png" class="expedition-progress-icon">
           </div>

         </div>

       </div>

       <div class="expedition-section" id="mutators-section">
         <div class="expedition-mode-title">Anomalie Symulacji</div>

         <div id="expedition-mutators" class="expedition-mutators"></div>

       </div>

       <div class="expedition-buttons">
         <button id="expedition-start" class="item-button" onclick="startExpedition()" >NOWA WYPRAWA</button>
         <button id="expedition-continue" class="item-button" onclick="continueExpedition()">KONTYNUUJ</button>
       </div>

     </div>

 
    <div class="close-btn-wrapper" id="item-close-wrapper-item">
      <button class="close-button" id="item-close-btn" onclick="closeExpeditionPopup()"></button>
      <!-- <img src="${ASSET_BASE}img/buttons/close-btn.png" alt="Zamknij" class="expedition-close-btn-frame" /> -->
      <img src="${closeBtnUrl}" alt="Zamknij" class="expedition-close-btn-frame" />
    </div>

  </div>
</div>


<div class="map-container" id="world-map">

    <!-- Podkład graficzny mapy -->
    <img data-src="img/maps/world-map.png" alt="Mapa Regionów">

    <!-- Nakładka SVG z regionami -->
    <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
      
      <!-- Region 1: Zielona północna część zachodniego kontynentu -->
      <polygon class="region unlocked" id="west" points="-200,0 420,0 420,130 200,390 400,591 -200,660" />

      <!-- Region 2: Pustynna południowa część zachodniego kontynentu + południowy pustynny kontynent -->
      <polygon class="region" id="south" points="-200,660 -200,1000 650,1000 800,740 550,574" />

      <!-- Region 3: Wchodni kontynent do gór, poza mroźną krainą -->
      <polygon class="region" id="east" points="690,370 960,210 1200,400 1200,1000 650,1000 800,740 550,574" />

      <!-- Region 4: Mroźna północno-wschodnia kraina -->
      <polygon class="region" id="north" points="420,0 1200,0 1200,400 960,210 690,370 420,130" />

      <!-- Region 5: Centralna wyspa z wulkanem -->
      <polygon class="region" id="island" points="420,130 690,370 550,574 400,591 200,390"/>
     
    </svg>
    
    <img class="map-frame" data-src="img/frames/world-map-frame.png" alt="Ramka mapy">
    
    <div class="region-label" id="region-label"></div>
    <button id="enter-world-btn" class="button hidden"></button>
        
</div>

        <!-- Popup -->
    <div id="world-popup" class="world-popup">
      <div class="map-content">
           
<div id="world-map-loader" class="hidden">
  <div class="view-loader-spinner"></div>
</div>
  
        <div class="map-canvas">


        <div class="region-name-container">
     
         <img data-src="img/backgrounds/ribbon-title2.png" alt="Ramka" class="region-name-frame" /> 
         
         <svg viewBox="0 0 400 100" class="region-svg">
          <defs>
            <path id="ribbon-arc" d="M20,40 Q200,10 380,37" />
          </defs>
          <text class="region-text">
            <textPath href="#ribbon-arc" startOffset="50%" text-anchor="middle" id="region-name">
            </textPath>
          </text>
         </svg>  
      
        </div> 
  
  
  <svg viewBox="0 0 1000 1500"  xmlns="http://www.w3.org/2000/svg"
           xmlns:xlink="http://www.w3.org/1999/xlink" >

          <defs>
          <!-- 🔹 Filtr rozmycia maski -->
             <filter id="softenMask" x="-10%" y="-10%" width="120%" height="120%">
               <feGaussianBlur stdDeviation="6" />
             </filter>

             <!-- 🔹 Maska -->
             <mask id="continentMask">
               <image id="region-mask"
                  x="9%" y="8.5%"
                  width="81%" height="80%"
                  filter="url(#softenMask)"
                  preserveAspectRatio="xMidYMid"/>
             </mask>
          </defs>

          <!-- 🔹 Pergaminowe tło -->
          <image id="pergamin-bg"
             x="0%" y="0%"
             width="100%" height="100%"
             preserveAspectRatio="xMidYMid"
             class="pergamin"/>

          <!-- 🔹 Mapa (pod maską) -->
          <image id="region-map"
             x="7%" y="7%"
             width="85%" height="85%"
             preserveAspectRatio="xMidYMid"
             mask="url(#continentMask)"
             class="region"/>
        </svg>
  
       
              
      <!--</div>-->

  
  
  
      <svg viewBox="0 0 500 750" xmlns="http://www.w3.org/2000/svg" id="popup-hotspots"></svg>
  
          
        <img data-src="img/icons/compas-icon2.png" class="compas-icon"/>
         
        <div class="close-btn-wrapper" id="item-close-wrapper">
          <button class="close-popup-btn" id="close-popup-btn" onclick="closePopUp()"></button>
          <img data-src="img/buttons/close-btn.png" alt="Zamknij" class="close-btn-frame" />
        </div> 
        
        <div class="level-name set hidden" id="level-name"></div>
        
        <button id="enter-level-btn" class="enter-button" onclick="enterLevel()" style="display: none;">${t("enter_level")}</button>
            
        <div id="toggle-labels-btn" class="map-toggle-btn">
          <span>${t("show_levels")}</span>
         <img data-src="img/icons/show-level-names-icon.png" alt="Ikona nazw" class="show-icon" />
        </div>

     </div>
        
    </div>    
  
   </div>

  <br>
  <br>
  <br>
  
  <div>
    <button onclick="gainExperience(500)">+500 EXP</button>
  </div>
  <div>
    <button onclick="gainExperience(5000)">+5000 EXP</button>
  </div>
  <div>
    <button onclick="gainExperience(50000)">+50000 EXP</button>
  </div>  
  <div>
    <button onclick="gainExperience(1000000)">+1000000 EXP</button>
  </div> 
   <div>
    <button onclick="gainExperience(100000000)">+100000000 EXP</button>
  </div>  
  <div>
    <button onclick="gainExperience(10000000000)">+10000000000 EXP</button>
  </div>
  <div>
    <button onclick="gainExperience(1000000000000)">+1000000000000 EXP</button>
  </div>
  
  <br><br>
  Mastery EXP
  <div>
    <button onclick="setMasteryLevelUp(100)">+100 EXP</button>
  </div>
  <div>
    <button onclick="setMasteryLevelUp(300)">+300 EXP</button>
  </div>
  <div>
    <button onclick="setMasteryLevelUp(600)">+600 EXP</button>
  </div>
  <div>
    <button onclick="setMasteryLevelUp(1000)">+1000 EXP</button>
  </div> 
  
  <br><br> 

<div id="custom-alert-container"></div>


<div id="stat-tooltip" class="stat-tooltip hidden">
  <div class="stat-tooltip-title"></div>
  <div class="stat-tooltip-content"></div>
</div>

  

<script>
  
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(()=>{});
    }
  
</script> 

  
    
     
</div>

`;
}


/*async function renderMapView() {

  try {
    showViewLoader();

    // pozwól loaderowi wejść
    await nextFrame();

    // preload zanim pokażemy widok
    await assetManager.preloadAssets(MAP_ASSETS);

    if (gameState.world.mode === "expedition") {
      await assetManager.preloadAssets(EXPEDITION_ASSETS);
    }

    // render dopiero po preloadzie
    document.getElementById("app").innerHTML = await getMapTemplate();

    initMapView();

    // mały cinematic delay
    await wait(200);

    hideViewLoader();

  } catch (err) {
    console.error("❌ Map render failed",err);

    hideViewLoader();
  }
}*/


async function renderMapView(options = {}) {
  const firstLoad = options.firstLoad;
  
  if (!firstLoad) {
    showViewLoader();
    setMenuDisabled(true);
  }

  try {

    const app = document.getElementById("app");

    app.classList.add("view-hidden");

    app.innerHTML = await getMapTemplate();

    // 🔥 tylko pierwszy raz
    if (firstLoad) {
      //console.log(`PRELOAD SOUNDS`);
      preloadSounds();
      
      //await assetManager.preloadAssets(HUD_ASSETS);
      //await assetManager.preloadAssets(ITEMS_ASSETS);
    }

    //await assetManager.preloadAssets(MAP_ASSETS);

    if (gameState.world.mode === "expedition") {
      await assetManager.preloadAssets(EXPEDITION_ASSETS);
    }

    await initMapView();
        
    await waitForImages(app);

    await nextFrame();
    app.classList.remove("view-hidden");

  } finally {

    if (!firstLoad) {
      hideViewLoader();
      setMenuDisabled(false);
    }
    
    /*console.log(`4. `, document.elementFromPoint(
      window.innerWidth / 2,
      window.innerHeight / 2
    ));*/
    
  }
  
}


/*async function renderMapView() {

  await withViewLoader(async () => {

    //document.getElementById("app").innerHTML = await getMapTemplate();
    
    const app = document.getElementById("app");

    app.classList.add("view-hidden");
    app.innerHTML = await getMapTemplate();
    
    //await nextFrame();
   // await nextFrame();
    
    await assetManager.preloadAssets(HUD_ASSETS);
    await assetManager.preloadAssets(MAP_ASSETS);

    if (gameState.world.mode === "expedition") {
      await assetManager.preloadAssets(EXPEDITION_ASSETS);
    }

    initMapView();

    await waitForImages(app);
    
    requestAnimationFrame(() => {
      app.classList.remove("view-hidden");
    });
    
  });
}*/


/*async function renderMapView() {
    
    document.getElementById("app").innerHTML = await getMapTemplate();
  
    await assetManager.preloadAssets(MAP_ASSETS);
  
    if(gameState.world.mode === `expedition`) {
      await assetManager.preloadAssets(EXPEDITION_ASSETS);
    }
  
    initMapView(); // tu wywołujesz logikę tej strony
}*/

// ===== MAP VIEW HANDLERS =====

let regionHandlers = [];
let outsideClickHandler = null;
let enterWorldHandler = null;

async function initMapView() {
  //console.log("Map initialized");
  
  if(gameState.world.isStartNewGame) setStarterSet();
    
  /*if(!appState.soundsInitialized) {
    console.log(`PRELOAD SOUNDS`);
    preloadSounds();
  }*/
  
 // preloadSounds();
  loadMapAssets();
    
  if(gameState.world.mode === "expedition") {
    const expeditionName = document.getElementById("ribbonText");
    if (expeditionName) {
      expeditionName.textContent = "Ekspedycja";
    }
      
    //initExpedition();
    setupWorldState();
  } else {
    bindMapEvents();
    setupWorldState();
    //handleReturnFromRegion();
  }
    
  const restoredRegionOpened = await handleReturnFromRegion();
    
  updateHUDLayout();
    
  window.addEventListener("load", updateHUDLayout);
  window.addEventListener("resize", updateHUDLayout);
    
  setTimeout(updateHUDLayout, 100);
  setTimeout(updateHUDLayout, 300);

  //window.addEventListener("resize", updateHUDLayoutHandler);
  //window.addEventListener("load", updateHUDLayoutHandler);

  if (!restoredRegionOpened && gameState.world.mode === `story` && !gameState.world.isStartNewWorld) {
    selectedRegion = Object.values(regionNames)
      .find(region => region.id === `west`);

    await enterRegion();
  }
    
  if(!appState.compareBgLoaded) {
    initAssetsUI();
    appState.compareBgLoaded = true;
  }  

  
  updateCharMenuIcon();
  updateSkillsMenuIcon();
}

/*function updateHUDLayoutHandler() {
  updateHUDLayout();
}*/

function bindMapEvents() {
  const btn = document.getElementById('toggle-labels-btn');
  if (btn) {
    btn.removeEventListener('click', toggleHotspotLabels);
    btn.addEventListener('click', toggleHotspotLabels);
  }

  window.addEventListener('resize', handleMapResize);
}

function handleMapResize() {
  clearTimeout(window._renderLockIconsTimeout);
  window._renderLockIconsTimeout = setTimeout(renderLockIcons, 120);
}

/*function loadMapAssets() {
  document.querySelectorAll("[data-src]").forEach(img => {
    img.src = `${ASSET_BASE}${img.getAttribute("data-src")}`;
  });
}*/

function loadMapAssets() {
  document.querySelectorAll("[data-src]").forEach(img => {
    const path = img.getAttribute("data-src");
    //img.src = img.dataset.resolvedSrc;
    img.src = assetManager.getResolvedAsset(path);
  });
}

/*async function loadMapAssets() {
  const images = document.querySelectorAll("[data-src]");

  for (const img of images) {
    const path = img.getAttribute("data-src");
    //img.src = await assetManager.getAssetUrl(path);
    await setImageSrc(img, path);
  }
}*/

async function initAssetsUI() {
    await setCssAssetVar("--compare-bg", "img/backgrounds/compare-background.png");
  
    /*document.documentElement.style.setProperty(
      "--compare-bg",
      `url(${ASSET_BASE}img/backgrounds/compare-background.png)`);*/
    
    /*document.documentElement.style.setProperty(
      "--frame-top",
      `url(${ASSET_BASE}img/frames/item-top.png)`);

    document.documentElement.style.setProperty(
      "--frame-mid",
      `url(${ASSET_BASE}img/frames/item-middle.png)`);

    document.documentElement.style.setProperty(
      "--frame-bottom",
      `url(${ASSET_BASE}img/frames/item-bottom.png)`);*/
}

/*let selectedExpeditionRegion = null;

function initExpedition() {
  document.querySelectorAll(".exp-region-btn").forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll(".exp-region-btn").forEach(
        b => b.classList.remove("active")
      );

      btn.classList.add("active");
      selectedExpeditionRegion = btn.dataset.region;
    };
  });
    
  document.getElementById("start-expedition-btn").onclick = () => {
    if(!selectedExpeditionRegion){
      showInfoAlert("Wybierz region.");
      return;
    }

    startExpedition(selectedExpeditionRegion);
  };
    
}*/

function setupWorldState() {
  updateRegionLocks();

  const worldMapName = document.getElementById("ribbonText");
  if (worldMapName) {
    worldMapName.textContent = `${t("world_map")}`//"Mapa Świata";
  }

  renderStats();
  initRegions();
  initEnterWorld();
}

async function handleReturnFromRegion() {
  const shouldOpenRegion = gameState.world.openRegionMapAfterLoad;

  if (shouldOpenRegion !== "1") return false;

  const regionId = gameState.world.selectedRegionId;
  selectedRegion = Object.values(regionNames)
    .find(region => region.id === regionId);

  if (!selectedRegion) {
    window.RuntimeDiagnostics?.record("map.region.restore.missing", { regionId: regionId || "" });
    return false;
  }

  await enterRegion();
  gameState.world.openRegionMapAfterLoad = "0";
  return true;
}

function destroyMapView() {
  detachRegions();
  detachEnterWorld();
    
  const btn = document.getElementById('toggle-labels-btn');
  if (btn) {
    btn.removeEventListener('click', toggleHotspotLabels);
  }
    
  window.removeEventListener('resize', handleMapResize);
}

function initRegions() {
  const regions = document.querySelectorAll('.region');
  const regionLabel = document.getElementById('region-label');
  const enterWorldBtn = document.getElementById('enter-world-btn');
  const mapContainer = document.querySelector('.map-container');

  regions.forEach((region, index) => {

    const handler = (e) => {
      e.stopPropagation();

      playSound(`open-slot`, 0.4);
        
      const regionData = regionNames[index];
      if (!regionData) return;
      if (!gameState.world.unlockedRegions.includes(regionData.id)) return;

      selectedRegion = regionData;

      // ===== POZYCJONOWANIE =====

      const bbox = region.getBBox();
      const mapRect = region.closest('svg').getBoundingClientRect();

      const centerX = bbox.x + bbox.width / 2;
      const centerY = bbox.y + (bbox.height - 200) / 2;

      const svgPoint = region.ownerSVGElement.createSVGPoint();
      svgPoint.x = centerX;
      svgPoint.y = centerY;

      const screenPoint = svgPoint.matrixTransform(region.getScreenCTM());

      const labelX = screenPoint.x - mapRect.left;
      const labelY = screenPoint.y - mapRect.top;

      regionLabel.textContent = regionData.name;
      regionLabel.style.left = `${labelX}px`;
      regionLabel.style.top = `${labelY}px`;
      regionLabel.style.display = 'block';

      // ===== IKONA (tylko raz) =====

      if (!enterWorldBtn.querySelector('.enter-region-icon')) {
        let imgIcon = document.createElement('img');
        imgIcon.className = 'enter-region-icon';
        //imgIcon.src = `${ASSET_BASE}img/icons/enter-region-icon.png`;
        setImageSrc(imgIcon, `img/icons/enter-region-icon.png`);
        enterWorldBtn.appendChild(imgIcon);
      }

      enterWorldBtn.style.left = `${labelX}px`;
      enterWorldBtn.style.top = `${labelY + 30}px`;
      enterWorldBtn.style.display = 'inline-block';
      enterWorldBtn.classList.remove(`hidden`);
    };
      
    region.addEventListener('click', handler);
    regionHandlers.push({ element: region, handler });
  });

  // ===== OUTSIDE CLICK =====

  outsideClickHandler = (e) => {
    const isClickInsideMap = mapContainer.contains(e.target);

    if (!isClickInsideMap) {
      regionLabel.style.display = 'none';
      enterWorldBtn.style.display = 'none';
    }
  };

  document.addEventListener('click', outsideClickHandler);
}

function detachRegions() {
  regionHandlers.forEach(({ element, handler }) => {
    element.removeEventListener('click', handler);
  });

  regionHandlers = [];

  if (outsideClickHandler) {
    document.removeEventListener('click', outsideClickHandler);
    outsideClickHandler = null;
  }
}

function initEnterWorld() {
 // console.error(`enter initEnterWorld`);
  const btn = document.getElementById('enter-world-btn');
  if (!btn) return;

  //console.error(`inside initEnterWorld`);

  enterWorldHandler = () => {
     // console.log(`enter region handler`);
    enterRegion();
  };

  btn.addEventListener('click', enterWorldHandler);
}

function detachEnterWorld() {
  const btn = document.getElementById('enter-world-btn');
  if (!btn || !enterWorldHandler) return;

  btn.removeEventListener('click', enterWorldHandler);
  enterWorldHandler = null;
}

function updateHUDLayout() {
  if(appState.isPaused) return;
    
  const stats = document.querySelector(".stats-bar");
  const combat = document.querySelector(".combat-hud");
  const bottom = document.querySelector(".bottom-menu");
  const exp = document.querySelector(".bar-container"); // 🔥 NOWE

  if (!stats && !combat && !bottom) return;
    
  const statsH = stats?.getBoundingClientRect().height || 0;
  const combatH = combat?.getBoundingClientRect().height || 0;
  const bottomH = bottom?.getBoundingClientRect().height || 0;
  const expH = exp?.getBoundingClientRect().height || 0; // 🔥 NOWE

  document.documentElement.style.setProperty("--stats-h", statsH + "px");
  document.documentElement.style.setProperty("--combat-h", combatH + "px");
  document.documentElement.style.setProperty("--bottom-h", bottomH + "px");
  document.documentElement.style.setProperty("--exp-h", expH + "px"); // 🔥 NOWE
}

function resetHUDLayoutVars() {
  const root = document.documentElement;

  root.style.setProperty("--stats-h", "0px");
  root.style.setProperty("--combat-h", "0px");
  root.style.setProperty("--bottom-h", "0px");
  root.style.setProperty("--exp-h", "0px");
}
