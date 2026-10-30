
const regionNames = {
    0: { id: "west", name: "Rivenfell", image: "img/maps/west-map3.png" },
    1: { id: "south", name: "Południe", image: "img/maps/south-map4.png" },
    2: { id: "east", name: "Wschód", image: "img/maps/east-map.png" },
    3: { id: "north", name: "Północ", image: "img/maps/region-north.png" },
    4: { id: "island", name: "Wyspa", image: "img/maps/island-map.png" }
  };

const hotspotsData = [
  // WEST region
  { region: "west", level: 1, x: 85, y: 510, color: "yellow", unlocked: true },
  { region: "west", level: 2, x: 150, y: 570, color: "yellow" },
  { region: "west", level: 3, x: 230, y: 540, color: "yellow" },
  { region: "west", level: 4, x: 320, y: 520, color: "yellow" },
  { region: "west", level: 5, x: 270, y: 505, color: "yellow" },
  { region: "west", level: 6, x: 235, y: 465, color: "yellow" },
  { region: "west", level: 7, x: 170, y: 500, color: "yellow" },
  { region: "west", level: 8, x: 120, y: 455, color: "yellow" },
  { region: "west", level: 9, x: 170, y: 405, color: "yellow" },
  { region: "west", level: 10, x: 220, y: 430, color: "yellow" },
  { region: "west", level: 11, x: 190, y: 360, color: "yellow" },
  { region: "west", level: 12, x: 130, y: 345, color: "yellow" },
  { region: "west", level: 13, x: 65, y: 370, color: "yellow" },
  { region: "west", level: 14, x: 115, y: 300, color: "yellow" },
  { region: "west", level: 15, x: 160, y: 280, color: "yellow" },
  { region: "west", level: 16, x: 205, y: 250, color: "yellow" },
  { region: "west", level: 17, x: 180, y: 210, color: "yellow" },
  { region: "west", level: 18, x: 270, y: 225, color: "yellow" },
  { region: "west", level: 19, x: 260, y: 265, color: "yellow" },
  { region: "west", level: 20, x: 230, y: 315, color: "yellow" },
  { region: "west", level: 21, x: 270, y: 345, color: "yellow" },
  { region: "west", level: 22, x: 360, y: 315, color: "yellow" },
  { region: "west", level: 23, x: 400, y: 355, color: "yellow" },
  { region: "west", level: 24, x: 330, y: 415, color: "yellow" },
  { region: "west", level: 25, x: 370, y: 485, color: "yellow" },
  { region: "west", level: 26, x: 355, y: 550, color: "yellow" },


  // SOUTH region
  { region: "south", level: 1, x: 230, y: 300, color: "white", unlocked: true },
  { region: "south", level: 2, x: 195, y: 310, color: "white" },
  { region: "south", level: 3, x: 160, y: 330, color: "white" },
];


  let selectedRegion = null;
  let selectedLevel = null;
  let labelsVisible = false;
 
  // Lista regionów w kolejności odblokowania
  const regionOrder = ["west", "south", "east", "north", "island"];
 
function updateLocationNameOnMap() {
  const regionName = document.getElementById("region-name");
  const region = selectedRegion?.id?.toLowerCase() || "west";

  // Szukamy obiektu, który ma id zgodne z aktualnym regionem
  const regionData = Object.values(regionNames).find(r => r.id === region);

  if (regionData) {
    regionName.textContent = regionData.name;
  //  console.log(`✅ Region name set to: ${regionData.name}`);
  } else {
   // console.warn(`⚠️ Region not found for id: ${region}`);
    regionName.textContent = "Nieznany region";
  }
}


function setHotspots() {
  const svg = document.getElementById("popup-hotspots");
    
  // 🔹 Czyścimy poprzednie hotspoty
  svg.innerHTML = "";
    
// 🔹 Rysujemy połączenia między punktami
const current = gameState.world.currentLevel || 1;
const regionPoints = hotspotsData.filter(h => h.region === selectedRegion.id.toLowerCase());

for (let i = 0; i < regionPoints.length - 1; i++) {
  const a = regionPoints[i];
  const b = regionPoints[i + 1];

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

  // Krzywa Béziera — lekko zakrzywiona ścieżka
  const dx = (b.x - a.x) * 0.3;
  const dy = (b.y - a.y) * 0.3;
  const d = `M ${a.x} ${a.y} C ${a.x + dx} ${a.y + dy}, ${b.x - dx} ${b.y - dy}, ${b.x} ${b.y}`;
  path.setAttribute("d", d);
  path.setAttribute("fill", "none");
  //path.setAttribute("stroke-width", "3");

  // Ustal stan punktów
  const aLevel = a.level;
  const bLevel = b.level;
    
  const aPassed = a.level < current;
  const bLocked = b.level === current;
    
  // Tworzymy obwódkę niezależnie dla każdej linii
  const outline = document.createElementNS("http://www.w3.org/2000/svg", "path");
  outline.setAttribute("d", d);
  outline.setAttribute("fill", "none");

  if (aPassed && bLocked || aPassed) {
    // 🔹 Linia ciągła (białą z zieloną obwódką)
    outline.setAttribute("stroke", "#00ff55"); // zielona poświata
    outline.setAttribute("stroke-width", "5");
    outline.setAttribute("opacity", "0.8");

    path.setAttribute("stroke", "#ffffff");
    path.setAttribute("stroke-width", "3");
    path.setAttribute("stroke-dsharray", "");
  } else {
    // 🔹 Linia przerywana (szara z ciemniejszą obwódką)
    outline.setAttribute("stroke", "#444"); // szara obwódka
    outline.setAttribute("stroke-width", "5");
    outline.setAttribute("opacity", "1");

    path.setAttribute("stroke", "#888888");
    path.setAttribute("stroke-width", "3");
    path.setAttribute("stroke-dasharray", "6,4");
  }

  // Dodajemy obwódkę najpierw, potem główną linię
  svg.appendChild(outline);
  svg.appendChild(path);
}
    
// 🔹 Resetujemy zaznaczony poziom
  selectedLevel = null;
    
  hotspotsData.forEach(h => {
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.classList.add("hotspot-group");
    group.dataset.level = h.level;
    group.dataset.region = h.region;

    // obudowa
    const frame = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    frame.setAttribute("cx", h.x);
    frame.setAttribute("cy", h.y);
    frame.setAttribute("r", 10);
    frame.classList.add("light-frame");

    // światło
    const inner = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    inner.setAttribute("cx", h.x);
    inner.setAttribute("cy", h.y);
    inner.setAttribute("r", 6);
    inner.classList.add("light-inner");

    group.append(frame, inner);
      
    const shadow = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    shadow.setAttribute("cx", h.x);
    shadow.setAttribute("cy", h.y);
    shadow.setAttribute("r", 12);
    shadow.setAttribute("fill", "rgba(0, 0, 0, 0.4)");
    shadow.setAttribute("filter", "blur(3px)");
      
    group.appendChild(shadow);
      
      
    const handler = () => {

      if (inner.classList.contains('locked') || inner.classList.contains('passed')) return;

      playSound(`open-slot`, 0.4); 

      selectedLevel = parseInt(h.level, 10);

      document.querySelectorAll('.hotspot-group').forEach(g => g.classList.remove('selected'));
      
      group.classList.add('selected');

      const levelName = document.getElementById('level-name');
      levelName.classList.remove('hidden');
      levelName.textContent = locationList[h.level - 1] !== undefined ? t(locationList[h.level - 1]) : `${t("unknown_location")}`;
        
      //console.error(`levelName`, levelName);
              
      const enterLvlBtn = document.getElementById('enter-level-btn');
      enterLvlBtn.style.display = 'inline-block';
      setGlobalButtonTexture(enterLvlBtn);
    };

    group.addEventListener("click", handler);
      
    const region = selectedRegion?.id?.toLowerCase() || "west";
    const locationList = locationsByRegion[region];
  
    let name = t("unknown_location");

    if (locationList && current >= 1 && current <= locationList.length) {
      //name = locationList[current - 1];
      name = locationList[current - 1] !== undefined ? t(locationList[h.level - 1]) : `${t("unknown_location")}`;
    }
      
   // console.error(`name`, name);
    //console.error(`locationList[current - 1]`, locationList[current - 1]);
      
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", h.x);
    text.setAttribute("y", h.y - 20);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("fill", "white");
    //text.setAttribute("font-weight", "bold");
    text.setAttribute("font-size", "13px");
    //text.textContent = `Poziom ${h.level}`;
    //text.textContent = `${locationList[h.level - 1]}`;
    text.textContent = locationList[h.level - 1] !== undefined ? `${t(locationList[h.level - 1])}` : `${t("unknown_location")}`;
      
    //console.error(`text`, text);
    //console.error(`locationList[current - 1]`, locationList[current - 1]);
      
      group.appendChild(text);

      // Poczekaj na render, potem zmierz
      requestAnimationFrame(() => {
         const bbox = text.getBBox();

         const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
         bg.setAttribute("x", bbox.x - 6);
         bg.setAttribute("y", bbox.y - 4);
         bg.setAttribute("width", bbox.width + 12);
         bg.setAttribute("height", bbox.height + 8);
         bg.setAttribute("rx", 5);
         bg.setAttribute("fill", "rgba(0, 0, 0, 0.5)");
        
         group.insertBefore(bg, text);
      });
   
      
  /*  document.querySelectorAll('.hotspot-group').forEach(group => {
      const point = group.querySelector('circle');
        
      group.addEventListener('click', () => {
        if (inner.classList.contains('locked') || inner.classList.contains('passed')) return;

        selectedLevel = parseInt(h.level, 10);
        console.log("Wybrany level:", selectedLevel);
        
        document.querySelectorAll('.hotspot-group').forEach(g => g.classList.remove('selected'));
        group.classList.add('selected');
          
        const levelName = document.getElementById('level-name');
        levelName.textContent = name;
          
        const enterLvlBtn = document.getElementById('enter-level-btn');
        enterLvlBtn.style.display = 'inline-block';
        setGlobalButtonTexture(enterLvlBtn);
      });        
    });  */
      
   // console.log("selected level:", selectedLevel);
      
    //toggleHotspotLabels();
    svg.appendChild(group);
  });
    
  requestAnimationFrame(() => {
    // wszystkie <rect> i <text> są już w DOM
    if (!labelsVisible) {
      document.querySelectorAll('.hotspot-group text, .hotspot-group rect')
        .forEach(el => el.style.display = 'none');
    }
  });
}

function toggleHotspotLabels() {
  labelsVisible = !labelsVisible;

  playSound(`open-slot`, 0.4); 
    
  const btn = document.getElementById('toggle-labels-btn');
  const textEls = document.querySelectorAll('.hotspot-group text, .hotspot-group rect');

  // przełącz klasę przycisku
  btn.classList.toggle('active', labelsVisible);

  // pokaż lub ukryj etykiety
  textEls.forEach(el => {
    el.style.display = labelsVisible ? 'block' : 'none';
  });
}


// Ustawienia widoku mapy
function updateRegionLocks() {
    //console.log("passedRegions", passedRegions); 
    //console.log("unlockedRegions", unlockedRegions); 
    
    document.querySelectorAll(".region").forEach(region => {
        const regionId = region.getAttribute("id");

        // Jeśli region zaliczony → passed
        if (gameState.world.passedRegions.includes(regionId)) {
            //console.log("region passed", regionId);
            region.classList.add("passed");
            region.classList.remove("locked", "unlocked");
        }
        // Jeśli odblokowany, ale niezaliczony → unlocked
        else if (gameState.world.unlockedRegions.includes(regionId)) {
           // console.log("region unlocked", regionId);
            region.classList.add("unlocked");
            region.classList.remove("locked", "passed");
        }
        // W przeciwnym razie → locked
        else {
            //console.log("region locked", regionId);
            region.classList.add("locked");
            region.classList.remove("unlocked", "passed");
        }
    });
    
    // 🔒 Dodaj/usuń ikony blokady
    renderLockIcons();
}

// Użyj tej funkcji zamiast tworzenia absolutnych <img> w HTML
function renderLockIcons() {
  const svg = document.querySelector('.map-container svg');
  if (!svg) return;

  // stwórz / znajdź warstwę z lockami (grupa w SVG)
  let layer = svg.getElementById('lock-layer');
  if (!layer) {
    layer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    layer.setAttribute('id', 'lock-layer');
    // upewnij się, że warstwa jest nad regionami (dodaj na końcu)
    svg.appendChild(layer);
  }

  // wyczyść poprzednie ikony
  while (layer.firstChild) layer.removeChild(layer.firstChild);

  // ścieżka do obrazka — dopasuj jeśli trzymasz ASSET_BASE
  //const lockSrc = (typeof ASSET_BASE !== 'undefined' ? ASSET_BASE : '') + 'img/icons/closed-lock-icon.png';
  const lockSrc = assetManager.getResolvedAsset('img/icons/closed-lock-icon.png');

  // dla każdego regionu z klasą .locked dodaj <image> środkowane na bbox
  document.querySelectorAll('.region.locked').forEach(region => {
    try {
      const bbox = region.getBBox(); // współrzędne w układzie SVG
      const cx = bbox.x + bbox.width / 2;
      const cy = bbox.y + bbox.height / 2;

      // dobierz rozmiar ikony: maksymalnie 64, ale nie większy niż bbox
      const size = Math.min(100, Math.max(64, Math.min(bbox.width, bbox.height) * 0.6));

      const img = document.createElementNS('http://www.w3.org/2000/svg', 'image');

      // nowoczesne przeglądarki pozwolą na href, ale dla kompatybilności ustawiamy oba
      img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', lockSrc); // starsze przeglądarki
      img.setAttribute('href', lockSrc); // nowsze przeglądarki

      img.setAttribute('class', 'svg-lock-icon');
      img.setAttribute('width', size);
      img.setAttribute('height', size);
      img.setAttribute('x', cx - size / 2);
      img.setAttribute('y', cy - size / 2);
      // opcjonalnie: ustaw transform jeśli chcesz rotację itp.

      layer.appendChild(img);
    } catch (err) {
      // getBBox może rzucić jeśli element nie jest w DOM lub ma problemy
      console.warn('renderLockIcons: błąd pobierania bbox dla regionu', region, err);
    }
  });
}

function unlockNextRegion() {
    let currentState = gameState.world;
       
    const currentRegionIndex = regionOrder.indexOf(currentState.selectedRegionId);

    if (currentRegionIndex >= 0 && currentRegionIndex < regionOrder.length - 1) {
        const currentRegion = regionOrder[currentRegionIndex];
        
        // 1. Dodajemy klasę passed do aktualnego regionu
        const currentRegionElement = document.getElementById(currentRegion);
        if (currentRegionElement && !currentRegionElement.classList.contains("passed")) {
            currentRegionElement.classList.add("passed");
        }

        // 2. Dodajemy do passedRegions
        if (!gameState.world.passedRegions.includes(currentRegion)) {
           // console.log("passed region pushing", currentRegion);
            gameState.world.passedRegions.push(currentRegion);
            savePassedRegions();
        }

        // 3. Odblokowanie następnego regionu
        const nextRegion = regionOrder[currentRegionIndex + 1];
        if (!gameState.world.unlockedRegions.includes(nextRegion)) {
           // console.log("region pushed to unlockedRegions", nextRegion);
            gameState.world.unlockedRegions.push(nextRegion);
            saveUnlockedRegions();
            updateRegionLocks();
        }
    }
}

/*function selectRegion() { 
  const regions = document.querySelectorAll('.region');
  const regionLabel = document.getElementById('region-label');
  const enterWorldBtn = document.getElementById('enter-world-btn');
  const mapContainer = document.querySelector('.map-container');

  regions.forEach((region, index) => {
    region.addEventListener('click', (e) => {
      e.stopPropagation(); // blokuje „kliknięcie poza mapą”
      const regionData = regionNames[index];
      if (!regionData) return;
      if (!world.unlockedRegions.includes(regionData.id)) return; // blokada kliknięcia

      selectedRegion = regionData;
      
      const bbox = region.getBBox();
      const mapRect = region.closest('svg').getBoundingClientRect();

      // środek regionu
      const centerX = bbox.x + bbox.width / 2;
      const centerY = bbox.y + (bbox.height - 200) / 2;

      const svgPoint = region.ownerSVGElement.createSVGPoint();
      svgPoint.x = centerX;
      svgPoint.y = centerY;
      const screenPoint = svgPoint.matrixTransform(region.getScreenCTM());

      // ustaw pozycję etykiety regionu
      const labelX = screenPoint.x - mapRect.left;
      const labelY = screenPoint.y - mapRect.top;

      //regionLabel.textContent = region.id.charAt(0).toUpperCase() + region.id.slice(1);
      regionLabel.textContent = regionData.name;
      regionLabel.style.left = `${labelX}px`;
      regionLabel.style.top = `${labelY}px`;
      regionLabel.style.display = 'block';
        
      if (!enterWorldBtn.querySelector('.enter-region-icon')) {
        const imgIcon = document.createElement('img');
        imgIcon.className = 'enter-region-icon';
        imgIcon.src = `${ASSET_BASE}img/icons/enter-region-icon.png`;
        enterWorldBtn.appendChild(imgIcon);
      }
      // ustaw przycisk pod nazwą
      enterWorldBtn.style.left = `${labelX}px`;
      enterWorldBtn.style.top = `${labelY + 30}px`; // 40px poniżej napisu
      enterWorldBtn.style.display = 'inline-block';
    });
  });

  // Kliknięcie poza mapą – chowa nazwę i przycisk
  document.addEventListener('click', (e) => {
    const isClickInsideMap = mapContainer.contains(e.target);
    if (!isClickInsideMap) {
      regionLabel.style.display = 'none';
      enterWorldBtn.style.display = 'none';
    }
  });
}

function enterWorld() { 
  console.log(`enter world`);
  const enterWorldBtn = document.getElementById('enter-world-btn');
      
  enterWorldBtn.addEventListener('click', () => {
     enterRegion();
  });
}*/

function preloadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = reject;
    img.src = src;
  });
}

async function preloadRegionAssets(selectedRegion) {
  const paths = [
    selectedRegion.image,
    ...REGION_ASSETS
  ];

  const urls = await Promise.all(
    paths.map(path =>
      assetManager.getAssetUrl(path)
    )
  );

  await Promise.all(urls.map(preloadImage));
}


/*async function preloadRegionAssets(selectedRegion) {
    const assets = [
    await assetManager.getAssetUrl(selectedRegion.image),
    await assetManager.getAssetUrl('img/backgrounds/west-map-mask.png'),
    await assetManager.getAssetUrl('img/backgrounds/map-pergamin-long.png')
  ];

  await Promise.all(assets.map(preloadImage));
}*/

/*async function preloadRegionAssets(selectedRegion) {
  const assets = [
    ASSET_BASE + selectedRegion.image,
    ASSET_BASE + 'img/backgrounds/west-map-mask.png',
    ASSET_BASE + 'img/backgrounds/map-pergamin-long.png'
  ];

  // Poczekaj aż wszystkie się załadują
  await Promise.all(assets.map(preloadImage));
}*/

async function enterRegion() {
 // console.log(`enter region`);
    
  //console.log(`start mode`, gameState.world.mode);
    
  if(gameState.world.mode === `expedition`) {
     openExpeditionPanel();
     return;
  }
    
  if(gameState.world.mode === `sandbox`) {
     openSandboxPanel();
     //startSandbox();
     return;
  }
    
  await preloadRegionAssets(selectedRegion);
  
  const worldPopup = document.getElementById('world-popup');
  const regionMap = document.getElementById('region-map');
  const regionMask = document.getElementById('region-mask');    
  const pergaminBg = document.getElementById('pergamin-bg');
  const levelInfo = document.getElementById('level-info');
  let currentState = gameState.world;
 
    
  if (!selectedRegion) return;
    //console.log(`enter region selected region`, selectedRegion.id);
    updateLocationNameOnMap();
    //regionMap.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', ASSET_BASE + selectedRegion.image);
    //regionMask.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', ASSET_BASE + `img/backgrounds/west-map-mask.png`);
    //pergaminBg.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', ASSET_BASE + `img/backgrounds/map-pergamin-long.png`);
    
    
    //regionMap.src = await assetManager.getAssetUrl(selectedRegion.image);
    //regionMask.src = await assetManager.getAssetUrl("img/backgrounds/west-map-mask.png");
    //const url = await assetManager.getAssetUrl("img/backgrounds/west-map-mask.png");
    //regionMask.setAttributeNS("http://www.w3.org/1999/xlink", "href", url);
    //pergaminBg.src = await assetManager.getAssetUrl("img/backgrounds/map-pergamin-long.png");
    
    
    const regionUrl = await assetManager.getAssetUrl(selectedRegion.image);
    regionMap.setAttributeNS("http://www.w3.org/1999/xlink", "href", regionUrl);
    const maskUrl = await assetManager.getAssetUrl("img/backgrounds/west-map-mask.png");
    regionMask.setAttributeNS("http://www.w3.org/1999/xlink", "href", maskUrl);
    const pergaminUrl = await assetManager.getAssetUrl("img/backgrounds/map-pergamin-long.png");
    pergaminBg.setAttributeNS("http://www.w3.org/1999/xlink", "href", pergaminUrl);

    
   /* const maskUrl = await assetManager.getAssetUrl("img/backgrounds/west-map-mask.png");

    const map = document.querySelector(".region-map");

    map.style.webkitMaskImage = `url(${maskUrl})`;
    map.style.maskImage = `url(${maskUrl})`;*/
    
    
        
    /*regionMap.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
      await assetManager.getAssetUrl(selectedRegion.image)
    );

    regionMask.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
      await assetManager.getAssetUrl('img/backgrounds/west-map-mask.png')
    );

    pergaminBg.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
      await assetManager.getAssetUrl('img/backgrounds/map-pergamin-long.png')
    );*/
    
    showWorldMapLoader();

    await nextFrame();
    await nextFrame();

    setHotspots();
    // Pokaż popup
   // worldPopup.style.display = 'flex';
   // worldPopup.classList.add('zoom-in');
    
    window.hotspotGroups = [...document.querySelectorAll('.hotspot-group')];
    
    // Ukryj wszystkie hotspoty
    window.hotspotGroups.forEach(group => {
   // document.querySelectorAll('.hotspot-group').forEach(group => {
      //group.style.display = 'none';
      group.classList.add(`hidden`);
    });
    
    document.querySelectorAll(`.hotspot-group[data-region="${selectedRegion.id.toLowerCase()}"]`).forEach(group => {
       //group.style.display = 'inline';
       group.classList.remove(`hidden`);
        
       const inner = group.querySelector('.light-inner');
       const frame = group.querySelector('.light-frame');
       const levelNumber = parseInt(group.getAttribute('data-level'), 10);
        
       inner.classList.remove('unlocked', 'passed');
       //frame.classList.remove('locked', 'passed');
       group.classList.remove('locked', 'passed');
        
  
       if (!isNaN(levelNumber)) {
          if (levelNumber < gameState.world.currentLevel) {
             inner.classList.add('passed');
             group.classList.add('passed');
          } else if (levelNumber === gameState.world.currentLevel) {
             inner.classList.add('unlocked');
          } else {
             group.classList.add('locked');
          }
       }
    });
    
    worldPopup.style.display = 'flex';

    requestAnimationFrame(() => {
      worldPopup.classList.add('zoom-in');
    });

    hideWorldMapLoader();
      
    //console.log("currentState inCombat: ", currentState.inCombat);
      
    //console.log("currentLevel in region: ", selectedRegion.id.toLowerCase(), world.currentLevel);
   
    document.getElementById('enter-level-btn').style.display = 'none';
    selectedLevel = null;
    
}

function showWorldMapLoader() {
  //const loader = document.getElementById("world-map-loader");
  const loader = document.getElementById("view-preloader");
    
  loader.classList.remove("hidden");

  requestAnimationFrame(() => {
    loader.classList.add("visible");
  });
}

function hideWorldMapLoader() {
  //const loader = document.getElementById("world-map-loader");
  const loader = document.getElementById("view-preloader");
  
  loader.classList.remove("visible");

  setTimeout(() => {
    loader.classList.add("hidden");
  }, 200);
}



function enterLevel() {  
  const world = gameState.world;
  if (selectedLevel != null && selectedRegion) {
    if (!selectedRegion || !selectedRegion.name) {
      console.warn("Nie wybrano regionu!");
      return;
    }
      
    const regionId = selectedRegion.id.toLowerCase();
    world.selectedRegionId = regionId;

    let saveData = {};

    if (world.selectedRegionId !== "west") {
      world.isStartNewRegion = true;
    }
      
   // 🧭 Pobranie listy odwiedzonych poziomów
    let visitedLevels = world.visitedLevels;
      
    // 🔍 Sprawdzenie, czy poziom był już odwiedzony
    const alreadyVisited = visitedLevels.includes(world.currentLevel);

    // Jeśli był odwiedzony – pomiń ekran ładowania
    if (alreadyVisited) {
      //window.location.href = "walka.html";
      navigate("battle");
      return;
    }

    // Jeśli nie był – zapisz go jako odwiedzony
    visitedLevels.push(world.currentLevel);
      
    // --- EKRAN ŁADOWANIA ---
    screenLoader();
  }
}

/*async function screenLoader(mode = "story") {
  const loadingScreen = document.getElementById("loading-screen");
  const loadingImage = document.getElementById("loading-image");
  const loadingTitle = document.getElementById("loading-title");
  const map = document.querySelector(".map-content");
    
  let locationId;
  let locationName;
  let imageSrc;

  if (mode === "story") {
    locationId = gameState.world.currentLevel - 1;
    locationName = locationsByRegion.west[locationId] || "Nieznane miejsce";
    imageSrc = locationImages[locationId] || "img/loadings/elmaris-port-loading.png";
  } else {
    locationId = gameState.world.currentLevel - 1;
    locationName = "Ekspedycja";
    imageSrc = "img/loadings/elmaris-port-loading.png";
  }
    
  console.log("imageSrc:", imageSrc);
    
  const url = await assetManager.getAssetUrl(imageSrc);

  console.log("FINAL URL:", url);

  const img = new Image();

  img.onload = () => {
    console.log("IMG LOADED OK");
  };

  img.onerror = (e) => {
    console.log("IMG FAILED", e, url);
  }; 

  img.src = url;
    
  loadingImage.src = url;
    
    
  //loadingImage.src = await assetManager.getAssetUrl(imageSrc);
  loadingTitle.textContent = t(locationName);

  resetLoaderState();

  loadingScreen.style.display = "flex";
  saveGame();

  map.classList.add(`map-disabled`);  
    
  // start fade in loadera
  requestAnimationFrame(() => {
    loadingScreen.classList.add("active");

    // obraz
    setTimeout(() => {
      loadingImage.classList.add("visible");

      // tytuł
      setTimeout(() => {
        loadingTitle.classList.add("visible");

          
          
          
        // 🔥 dłuższy czas ekspozycji loadera
        setTimeout(() => {

          // render battle POD loaderem
          navigate("battle");

          // fade-in battle pod spodem
          const battleView = document.getElementById("battle-view");
          if (battleView) {
            battleView.classList.add("battle-enter");
          }

          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              loadingScreen.classList.add("fade-out");
            });
          });

          // cleanup
          setTimeout(() => {
            loadingScreen.style.display = "none";
            resetLoaderState();

            if (battleView) {
              battleView.classList.remove("battle-enter");
            }
  
              map.classList.remove(`map-disabled`);
              
          }, 2200);

        }, 1800); // <- loader stoi dłużej
          
          
     
          
        setTimeout(async () => {

          // 🔥 render battle POD loading screenem
          await renderBattleView();

          const battleView = document.getElementById("battle-view");

          if (battleView) {
            battleView.classList.add("battle-enter");
          }

          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              loadingScreen.classList.add("fade-out");
            });
          });

          setTimeout(() => {
            loadingScreen.style.display = "none";
            resetLoaderState();

            if (battleView) {
                battleView.classList.remove("battle-enter");
            }
              
            map.classList.remove("map-disabled");

          }, 2200);

        }, 1800);
          
          
      }, 700);

    }, 700);
  });
}*/

async function screenLoader(mode = "story") {
  const loadingScreen = document.getElementById("loading-screen");
  const loadingImage = document.getElementById("loading-image");
  const loadingTitle = document.getElementById("loading-title");
  const loadingDivider = document.getElementById("loading-divider");
  const loadingLore = document.getElementById("loading-lore");

  const map = document.querySelector(".map-content");
    
  let locationId;
  let locationName;
  let imageSrc;

  if (mode === "story") {
    locationId = gameState.world.currentLevel - 1;
    locationName = locationsByRegion.west[locationId] || "Nieznane miejsce";
    imageSrc = locationImages[locationId] || "img/loadings/elmaris-port-loading.png";
  } else {
    locationId = gameState.world.currentLevel - 1;
    locationName = "Ekspedycja";
    imageSrc = "img/loadings/elmaris-port-loading.png";
  }
    
  const url = await assetManager.getAssetUrl(imageSrc);
    
  const img = new Image();
    
  loadingImage.src = url;
    
  loadingTitle.textContent = t(locationName);
    
  const loreList = locationLore[locationName] || [];
  const loreId = loreList[Math.floor(Math.random() * loreList.length)];
  loadingLore.textContent = t(loreId);
  resetLoaderState();

  loadingScreen.style.display = "flex";
  saveGame();

  map.classList.add(`map-disabled`);  
    
  requestAnimationFrame(() => {
    loadingScreen.classList.add("active");
  });    
    
  await nextFrame();
  await nextFrame();
    
  await wait(1300);
    
  const battlePromise = renderFirstBattleView();
    
  const minLoaderTime = wait(5200);
    
  await wait(700);
    
  loadingImage.classList.add("visible");

  await wait(700);

  loadingTitle.classList.add("visible");
  loadingDivider.classList.add("visible");

  await wait(700);

  loadingLore.classList.add("visible");
    
  //await wait(3000);

  //const battlePromise = renderFirstBattleView();
    
  // 🔥 TU CZEKASZ NA REALNE GOTOWOŚCI
  //await battlePromise;
    
  await Promise.all([
    battlePromise,
    minLoaderTime
  ]);
    
  await nextFrame();  
    
  const battleView = document.getElementById("battle-view");
  if (battleView) {
    battleView.classList.add("battle-enter");
  }
    
  //loadingScreen.classList.add("fade-out");
    
  requestAnimationFrame(() => {
    loadingScreen.classList.add("fade-out");
  });    
    
  await wait(3200);
  loadingScreen.style.display = "none";
  resetLoaderState();
  if (battleView) {
    battleView.classList.remove("battle-enter");
  }
  map.classList.remove("map-disabled");
  
}

function resetLoaderState() {
  const loadingScreen = document.getElementById("loading-screen");
  const loadingImage = document.getElementById("loading-image");
  const loadingTitle = document.getElementById("loading-title");
  const loadingDivider = document.getElementById("loading-divider");
  const loadingLore = document.getElementById("loading-lore");
    
  loadingScreen.classList.remove("active", "fade-out");
  loadingImage.classList.remove("visible");
  loadingTitle.classList.remove("visible");
  loadingDivider.classList.remove("visible");
  loadingLore.classList.remove("visible");
}

function closePopUp() {
   const worldPopup = document.getElementById('world-popup');
   worldPopup.classList.remove('zoom-in');
   worldPopup.style.display = 'none';
}



/*function attachQuestExpandEvents() {
  const entries = document.querySelectorAll(".quest-entry");
    
  entries.forEach(entry => {
    const header = entry.querySelector(".quest-header");
    const questId = entry.dataset.id;
    const q = world.battleState.quests?.[questId];
    const quest = getQuestFromId(q.id);
      
    // Kliknięcie w nagłówek — otwieranie / zamykanie questa
    header.addEventListener("click", () => {
      const isExpanded = entry.classList.contains("expanded");
   
      document.querySelectorAll(".quest-entry.expanded").forEach(e => {
        e.classList.remove("expanded");
        const body = e.querySelector(".quest-body");
        body.style.height = "0px";
      });
        
      if (!isExpanded) {
        entry.classList.add("expanded");
          
        const body = entry.querySelector(".quest-body");
        const fullHeight = body.scrollHeight; // naturalny wymiar contentu
        body.style.height = fullHeight + "px"; // rośnie element faktycznie
        
        entry.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
        
      console.log(`quest id in notification closing`, questId);
      if(q) {
        q.questNotifications = false;
        saveGame();
      }   
        
      entry.classList.remove(`has-notification`);   
    });

    // Kliknięcie w przycisk opisu — rozwijanie treści
    const descToggle = entry.querySelector(".quest-desc-toggle");
    const desc = entry.querySelector(".quest-desc");

    if (descToggle && desc) {
      descToggle.addEventListener("click", (e) => {
         console.log(`klik w quest`);
        e.stopPropagation(); // 👈 ważne! nie zwinie całego questa
        openQuestDescription(quest);
        descToggle.textContent = desc.classList.contains("visible")
          ? "📜 Ukryj opis"
          : "📜 Pokaż opis";
      });
    }
  });
}*/

/*window.addEventListener('resize', () => {
  // mały debounce żeby nie wołać za często
  clearTimeout(window._renderLockIconsTimeout);
  window._renderLockIconsTimeout = setTimeout(renderLockIcons, 120);
});

// 🔹 Po załadowaniu mapy:
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('toggle-labels-btn');
  if (btn) btn.addEventListener('click', toggleHotspotLabels);
});

 window.onload = function () {
   updateRegionLocks();
     
     document.querySelectorAll("[data-src]").forEach(img => {
         img.src = `${ASSET_BASE}${img.getAttribute("data-src")}`;
      });
  
   const worldMapName = document.getElementById("ribbonText");
   worldMapName.textContent = `Mapa Świata`;

   renderStats();
   selectRegion();
   enterWorld();
     
  const shouldOpenRegion = gameState.world.openRegionMapAfterLoad;
     
  if (shouldOpenRegion === "1") {
    console.log("Otwieram mapę regionu po powrocie na index.html");
    const regionId = gameState.world.selectedRegionId;
    
    selectedRegion = Object.values(regionNames).find(region => region.id === regionId);

      // Wywołujesz funkcję, która otwiera popup regionu
    enterRegion();
    
    gameState.world.openRegionMapAfterLoad = "0";
  }
     
     //console.log("gameState.world.selectedRegionId end", gameState.world.selectedRegionId);
     //console.log("gameState.world.isStartNewRegion end", gameState.world.isStartNewRegion);
  
     
};*/


function gainExperience(amount) {
  const character = gameState.char;
    
  // Ustawienia domyślne, jeśli nie istnieją
  if (!character.level) character.level = 1;
  if (!character.experience) character.experience = 0;
  if (!character.expToNextLevel) character.expToNextLevel = 125;

  character.experience += amount;
  //character.skillPoints++;
  character.availableAttributePoints += 5;
    
    // Level Up – dopóki mamy więcej exp niż potrzeba
  while (character.experience >= character.expToNextLevel) {
    character.experience -= character.expToNextLevel;
    character.level += 1;
    character.skillPoints++;
    character.availableAttributePoints += 5;
    character.expToNextLevel = Math.round(character.expToNextLevel * 1.7); // rosnące wymagania
  }
    
  // Aktualizacja UI
  document.getElementById("player-level").innerText = character.level;
  const percent = Math.min(125, Math.round(100 * character.experience / character.expToNextLevel));
  document.getElementById("exp-bar").style.width = percent + "%";
  saveGame();
 }

