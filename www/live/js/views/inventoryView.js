function getInventoryTemplate() {
  return `
<div class="view" id="inventory-view">
    
<div class="filters">
  <!-- <span class="filter-label">Typ:</span>-->
  <div class="filter-icons">
     <div class="filter-icon" data-type="weapon" title="weapon">
      <img data-src="img/icons/filter-long-sword-icon.png" alt="weapon">
    </div>
    <div class="filter-icon" data-type="helmet" title="helmet">
      <img data-src="img/icons/filter-helmet-icon.png" alt="helmet">
    </div>
    <div class="filter-icon" data-type="armor" title="armor">
      <img data-src="img/icons/filter-armor-icon.png" alt="armor">
    </div>
    <div class="filter-icon" data-type="gloves" title="gloves">
      <img data-src="img/icons/filter-gloves-icon.png" alt="gloves">
    </div>
    <div class="filter-icon" data-type="shoulder" title="shoulder">
      <img data-src="img/icons/filter-shoulder-icon.png" alt="shoulder">
    </div>
    <div class="filter-icon" data-type="bracers" title="bracers">
      <img data-src="img/icons/filter-bracers-icon.png" alt="bracers">
    </div>
    <div class="filter-icon" data-type="belt" title="belt">
      <img data-src="img/icons/filter-belt-icon.png" alt="belt">
    </div>
    <div class="filter-icon" data-type="pants" title="pants">
      <img data-src="img/icons/filter-pants-icon.png" alt="pants">
    </div>
    <div class="filter-icon" data-type="boots" title="boots">
      <img data-src="img/icons/filter-boots-icon.png" alt="boots">
    </div>
    <div class="filter-icon" data-type="shield" title="shield">
      <img data-src="img/icons/filter-shield-icon.png" alt="shield">
    </div>
  </div>
</div>
  

<div class="filters">
  <label>${t("filter_rarity")}:</label>

  <div class="filter-box common" onclick="setFilter('common')"></div>
  <div class="filter-box rare" onclick="setFilter('rare')"></div>
  <div class="filter-box unique" onclick="setFilter('unique')"></div>
  <div class="filter-box epic" onclick="setFilter('epic')"></div>
  <div class="filter-box legendary" onclick="setFilter('legendary')"></div>
</div>
  
  
  
<div class="inventory-wrapper">
  <div class="inventory-header">
    <div class="inventory-title">${t("inventory_title")}</div>
    <div class="inventory-capacity common-slot">
      <img data-src="img/icons/inventory-icon.png" class="capacity-icon" alt="Potions"  style="width:20px; height:20px; margin-right: 4px;"/>
      <span id="count">0</span>/20   
    </div>
  </div>

  <div class="inventory-scroll" id="inventory-container">
    <!-- Przedmioty będą tutaj wstawiane dynamicznie -->
  </div>
</div>
  
  
<div id="item-popup" class="item-popup hidden">
  <div class="popup-content">
    <div id="popup-content"></div>
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
    
     <!-- <div class="close-btn-wrapper" id="item-close-wrapper">
        <button class="close-button" id="item-close-btn" onclick="closeComparePopup()"></button>
        <img data-src="img/buttons/close-btn.png" alt="Zamknij" class="close-btn-frame" />
      </div> -->

      <div class="compare-popup-actions">
        <button class="item-button left" id="equip-btn2" style="width: 100px;">${t("equip_btn")}</button>
        <button class="item-button right" id="back-btn" onclick="closeComparePopup()" style="width: 100px;">${t("back_btn")}</button>
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
  

</div>
  
  
<div id="stat-tooltip" class="stat-tooltip hidden">
  <div class="stat-tooltip-title"></div>
  <div class="stat-tooltip-content"></div>
</div>

    
<div id="confirm-popup" class="confirm-popup hidden">
  <div class="confirm-content special">
    <div id="confirm-message"></div>
    <div class="custom-confirm-buttons">
      <button id="confirm-yes">${t("confirm_yes")}</button>
      <button id="confirm-no">${t("confirm_no")}</button>
    </div>
  </div>
</div>
    
<div id="custom-alert-container"></div>


</div>

  `;
}


async function renderInventoryView() {

  await withViewLoader(async () => {
    
    const app = document.getElementById("app");

    app.classList.add("view-hidden");
    app.innerHTML = await getInventoryTemplate();

    //await nextFrame();
    //await nextFrame();
    
    //await assetManager.preloadAssets(INVENTORY_ASSETS);
    
    //document.getElementById("app").innerHTML = getInventoryTemplate();

    initInventoryView(); // tu wywołujesz logikę tej strony

    await waitForImages(app);
    
    requestAnimationFrame(() => {
      app.classList.remove("view-hidden");
    });
    
  });
}


/*async function renderInventoryView() {
    document.getElementById("app").innerHTML = getInventoryTemplate();
  
    await assetManager.preloadAssets(INVENTORY_ASSETS);
  
    initInventoryView(); // tu wywołujesz logikę tej strony
}*/

let filterClickHandlers = [];
let inventoryInitialized = false;

function initInventoryView() {

  initializeInventoryImages();
  
  attachFilterListeners();

  renderStats();
  renderInventory();

  inventoryInitialized = true;
    
  updateCharMenuIcon();
  updateSkillsMenuIcon();
}

function initializeInventoryImages() {
  document.querySelectorAll("[data-src]").forEach(img => {
         const path = img.getAttribute("data-src");
         img.src = assetManager.getResolvedAsset(path);
    });
 }


function attachFilterListeners() {

  const icons = document.querySelectorAll(".filter-icon");

  icons.forEach(icon => {

    const handler = () => {
      const selectedType = icon.getAttribute("data-type");

      if (currentTypeFilter === selectedType) {
        currentTypeFilter = "";
      } else {
        currentTypeFilter = selectedType;
      }

      playSound(`open-slot`, 0.4); 
        
      updateFilterUI();
      renderInventory();
    };

    icon.addEventListener("click", handler);

    filterClickHandlers.push({ element: icon, handler });
  });
}

function updateFilterUI() {

  document.querySelectorAll(".filter-icon")
    .forEach(i => i.classList.remove("active"));

  if (currentTypeFilter) {
    document
      .querySelector(`.filter-icon[data-type="${currentTypeFilter}"]`)
      ?.classList.add("active");
  }
}

function destroyInventoryView() {

  filterClickHandlers.forEach(({ element, handler }) => {
    element.removeEventListener("click", handler);
  });

  filterClickHandlers = [];

  inventoryInitialized = false;
}