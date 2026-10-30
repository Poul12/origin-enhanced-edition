function getStoreTemplate() {
  return `
<div class="view" id="store-view">

<div class="shop-container">
  
  <div class="shop-header">
    <button id="sellModeBtn" class="wood-button-small">
       <img data-src="img/icons/sell-item-icon.png" alt="Sprzedaj" style="width:24px;height:24px;">
    </button>   
    <!--<button id="generateNewShop" onClick="generateNewShopForCity()" class="wood-button-small"></button>  --> 
    <div class="shop-title">${t("store_title")}</div>
    <div class="potion-capacity common" id="capacity-slot"> 
      <img data-src="img/items/medium-heal-potion.png" class="capacity-icon" alt="Potions"  style="width:15px; height:20px;"/>
      <span id="count">0</span>/7 
    </div>

    <div class="close-btn-wrapper" id="store-close-wrapper">
      <button class="close-button" id="item-close-btn" onclick="closeStore()"></button>
      <img data-src="img/buttons/close-btn.png" alt="Zamknij" class="store-close-btn-frame" />
    </div> 

  </div>

  <!-- Zakładki -->
  <div class="shop-tabs">
    <button class="shop-tab active" data-tab="weapons">${t("weapons_tab")}</button>
    <button class="shop-tab" data-tab="armors">${t("armors_tab")}</button>
    <button class="shop-tab" data-tab="others">${t("other_tab")}</button>
    <button class="shop-tab" data-tab="special">${t("special_tab")}</button>
  </div>

  <!-- Gridy wypełniane dynamicznie -->
  <div class="shop" id="shop-content"></div>
</div>
  
  
<div id="item-popup" class="popup hidden">
  <div class="popup-content">
    <div id="popup-content"></div>
    <!--  <img data-src="img/frames/frame1.png" alt="Ramka" class="item-frame" /> -->
  
  </div>
</div>
  
 <div id="confirm-popup" class="popup hidden">
  <div class="confirm-content special-slot">
    <div id="confirm-message"></div>
    <div class="custom-confirm-buttons">
      <button id="confirm-yes">${t("confirm_yes")}</button>
      <button id="confirm-no">${t("confirm_no")}</button>
    </div>
  </div>
</div>

<div class="popup hidden" id="compare-popup">
  <div class="compare-popup-content">
    <!--<div class="item-wrapper">-->
      <div class="item-panel show" id="panel-1">
        <div class="item-panel-inner" id="popup-left">
          <div class="item-panel-content" id="content-left"></div>
        </div> 
      </div>  
    
      <div class="close-btn-wrapper" id="item-close-wrapper">
        <button class="close-button" id="item-close-btn" onclick="closeComparePopup()"></button>
        <img data-src="img/buttons/close-btn.png" alt="Zamknij" class="close-btn-frame" />
      </div> 

    <!--</div>-->
    <!--<div class="item-wrapper">-->
      <div class="item-panel" id="panel-2">
        <div class="item-panel-inner" id="popup-right">
          <div class="item-panel-content" id="content-right"></div>
        </div>
      </div>
    <!--</div>--> 
  </div>
  
  <div class="compare-popup-actions">
     <button class="item-button" id="equip-btn2" style="width: 100px;">ZAŁÓŻ</button>
  </div>
  
</div>
    
  
  <div id="custom-alert-container"></div>
  
  
<div id="stat-tooltip" class="stat-tooltip hidden">
  <div class="stat-tooltip-title"></div>
  <div class="stat-tooltip-content"></div>
</div>
    
 
</div>

`;
}

async function renderStoreView() {

  await withViewLoader(async () => {

    const app = document.getElementById("app");

    app.classList.add("view-hidden");
    app.innerHTML = await getStoreTemplate();

   // await nextFrame();
    //await nextFrame();
    
    //document.getElementById("app").innerHTML = getStoreTemplate();
    initStoreView(); // tu wywołujesz logikę tej strony

    await waitForImages(app);
    
    requestAnimationFrame(() => {
      app.classList.remove("view-hidden");
    });
    
  });
}


/*function renderStoreView() {
    document.getElementById("app").innerHTML = getStoreTemplate();
    initStoreView(); // tu wywołujesz logikę tej strony
}*/

let storeListeners = [];

function initStoreView() {

  //console.log("init store view");

  renderStats();
    
  const resources = gameState.resources;

  if (!resources.potions || resources.potions.length !== POTION_SLOTS) {
    resources.potions = Array(POTION_SLOTS).fill(null);
  }

  initializeStoreImages();

  attachSellButton();
  initShopTabs();
  renderShop();
    
  gameState.resources.enterStore = true;
  
  updateCharMenuIcon();
  updateSkillsMenuIcon();
}

function initializeStoreImages() {
  document.querySelectorAll("[data-src]").forEach(img => {
         const path = img.getAttribute("data-src");
         img.src = assetManager.getResolvedAsset(path);
    });
 }



function attachSellButton() {
  const sellBtn = document.getElementById("sellModeBtn");
  if (!sellBtn) return;

  const handler = toggleSellMode;

  sellBtn.addEventListener("click", handler);

  storeListeners.push({ element: sellBtn, handler });
}

function initShopTabs() {

  document.querySelectorAll(".shop-tab").forEach(tab => {

    tab.classList.add("tab-bg");

    const handler = () => {

      document.querySelectorAll(".shop-tab")
        .forEach(t => t.classList.remove("active"));

      document.querySelectorAll(".tab-content")
        .forEach(c => c.classList.remove("active"));

      tab.classList.add("active");
      //document.getElementById(tab.dataset.tab).classList.add("active");
      const dataTab = document.getElementById(tab.dataset.tab);
      if(dataTab) dataTab.classList.add("active");
      
      playSound(`menu-tab`, 1, 1, 0.45);
        
      saveGame();
    };

    tab.addEventListener("click", handler);

    storeListeners.push({ element: tab, handler });
  });
}

function closeStore() {
  navigate(`battle`);  
}

function destroyStoreView() {
    
  storeListeners.forEach(({ element, handler }) => {
    element.removeEventListener("click", handler);
  });

  storeListeners = [];
}

