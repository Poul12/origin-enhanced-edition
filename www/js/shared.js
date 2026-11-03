
  const genderMap = {
    'hełm': 'm',
    'naramiennik': 'm',
    'zbroja': 'ż',
    'karwasze': 'n',
    'rękawice': 'n',
    'pas': 'm',
    'spodnie': 'n',
    'buty': 'n',
    'tarcza': 'ż',
    'broń': 'ż',
    'krótki miecz': 'm',
    'topór': 'm',
    'długi miecz': 'm',
    'młot': 'm',
    'buława': 'ż',
    'okrągła tarcza': 'ż',
    'puklerz': 'm',
    'kałkan': 'm',
    'trójkątna tarcza': 'ż',
    'zbroja skórzana': 'ż',
    'napierśnik': 'm',
    'kolczuga': 'ż',
    'zbroja płytowa': 'ż'
    // dodaj inne typy jeśli potrzeba
  };

// Mapa odmian przymiotników w zależności od rodzaju
const adjectiveForms = {
  "Zwinny":        { m: "Zwinny", ż: "Zwinna", n: "Zwinne" },
  "Potężny":       { m: "Potężny", ż: "Potężna", n: "Potężne" },
  "Zaklęty":       { m: "Zaklęty", ż: "Zaklęta", n: "Zaklęte" },
  "Zapomniany":    { m: "Zapomniany", ż: "Zapomniana", n: "Zapomniane" },
  "Wzmocniony":    { m: "Wzmocniony", ż: "Wzmocniona", n: "Wzmocnione" },
  "Magiczny":      { m: "Magiczny", ż: "Magiczna", n: "Magiczne" },
  "Krwawy":        { m: "Krwawy", ż: "Krwawa", n: "Krwawe" },
  "Wieczny":       { m: "Wieczny", ż: "Wieczna", n: "Wieczne" },
  "Mroczny":       { m: "Mroczny", ż: "Mroczna", n: "Mroczne" },
  "Błyszczący":    { m: "Błyszczący", ż: "Błyszcząca", n: "Błyszczące" },
  "Runiczny":      { m: "Runiczny", ż: "Runiczna", n: "Runiczne" },
  "Złowrogi":      { m: "Złowrogi", ż: "Złowroga", n: "Złowrogie" },
  "Heroiczny":     { m: "Heroiczny", ż: "Heroiczna", n: "Heroiczne" },
  "Czarny":        { m: "Czarny", ż: "Czarna", n: "Czarne" },
  "Smoczy":        { m: "Smoczy", ż: "Smocza", n: "Smocze" },
  "Błogosławiony": { m: "Błogosławiony", ż: "Błogosławiona", n: "Błogosławione" }
};

// Sufiksy – głównie w dopełniaczu, więc formy są prawie identyczne
// W niektórych można dać delikatne różnicowanie żeńskich form (np. Mistrzyni)
const suffixForms = {
  "Gniewu":             { m: "Gniewu", ż: "Gniewu", n: "Gniewu" },
  "Ognia":              { m: "Ognia", ż: "Ognia", n: "Ognia" },
  "Mistrza":            { m: "Mistrza", ż: "Mistrzyni", n: "Mistrza" },
  "Ostatniego światła": { m: "Ostatniego światła", ż: "Ostatniej światłości", n: "Ostatniego światła" },
  "Wichru":             { m: "Wichru", ż: "Wichru", n: "Wichru" },
  "Cienia":             { m: "Cienia", ż: "Cienia", n: "Cienia" },
  "Krwi":               { m: "Krwi", ż: "Krwi", n: "Krwi" },
  "Mroku":              { m: "Mroku", ż: "Mroku", n: "Mroku" },
  "Pustki":             { m: "Pustki", ż: "Pustki", n: "Pustki" },
  "Wilka":              { m: "Wilka", ż: "Wilczycy", n: "Wilka" },
  "Burzy":              { m: "Burzy", ż: "Burzy", n: "Burzy" },
  "Zemsty":             { m: "Zemsty", ż: "Zemsty", n: "Zemsty" },
  "Nieśmiertelności":   { m: "Nieśmiertelności", ż: "Nieśmiertelności", n: "Nieśmiertelności" },
  "Przodków":           { m: "Przodków", ż: "Przodkiń", n: "Przodków" },
  "Końca Świata":       { m: "Końca Świata", ż: "Końca Świata", n: "Końca Świata" }
};

/*function setCurrentStep(currentStepIndex) {
  let step = localStorage.getItem("currentStep") || 0;
  step = currentStepIndex;
  localStorage.setItem("currentStep", JSON.stringify(step));
}

function getCurrentStep() {
  const step = localStorage.getItem("currentStep") || 0;
  return step;
}*/

function isLocationWithTown() {
  //console.error("enter isLocationWithTown before return", world.currentLocation);
  if(gameState.world.mode === `sandbox` || gameState.world.mode === `adventure`) return true;

  if(gameState.world.mode === `expedition`) return;
  
  if(!gameState.world.currentLocation) return;
  //console.error(`currentLocation`, currentLocation);
  //console.error("enter isLocationWithTown after return");
  
  const story = getStoryConfig(gameState.world.currentLocation);
  
  const forced = story?.forcedSteps?.[0];

  //console.error("forced", forced?.type);
  
  if (forced?.type === "npc_all") {
    return true;
  }
  
  return false;
}

// Funkcja dobierająca poprawną formę przymiotnika
function getPrefix(prefix, baseName) {
 // console.log(`getPrefix: prefix, baseName`, prefix, baseName);
  const gender = genderMap[t(baseName).toLowerCase()] || "m";
  //console.log(`getPrefix: gender, t(baseName)`, gender, t(baseName).toLowerCase());
  const forms = adjectiveForms[t(prefix)];
  //console.log(`getPrefix: forms, t(prefix)`, forms, t(prefix));
  return forms ? forms[gender] : t(prefix); // jeśli brak w mapie, zwróć oryginał
}

function getSuffix(suffix, baseName) {
  const gender = genderMap[t(baseName).toLowerCase()] || "m";
  const forms = suffixForms[t(suffix)];
  return forms ? forms[gender] : t(suffix);
}

/*function formatNumber(num) {
  if (num < 1000) return Math.floor(num);
  if (num < 1_000_000) return (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1) + "K";
  return (num / 1_000_000).toFixed(1) + "M";
}*/

function formatNumber(num) {
  const units = [
    { value: 1e15, suffix: "Q" },
    { value: 1e12, suffix: "T" },
    { value: 1e9,  suffix: "B" },
    { value: 1e6,  suffix: "M" },
    { value: 1e3,  suffix: "K" }
  ];

  // 🔥 poniżej 1000 = bez przecinków
  if (Math.abs(num) < 1000) {
    return `${Math.floor(num)}`;
  }

  for (const unit of units) {

    if (Math.abs(num) >= unit.value) {

      const value = num / unit.value;

      return value
        .toFixed(value >= 100 ? 0 : value >= 10 ? 0 : 1)
        .replace(/\.0+$/, "")
        .replace(/(\.\d*[1-9])0+$/, "$1")
        + unit.suffix;
    }
  }

  return `${Math.floor(num)}`;
}

/*function formatNumber(num) {
  const units = [
    { value: 1e15, suffix: "Q" },  // quadrillion
    { value: 1e12, suffix: "T" },  // trillion
    { value: 1e9,  suffix: "B" },  // billion
    { value: 1e6,  suffix: "M" },  // million
    { value: 1e3,  suffix: "K" }   // thousand
  ];

  // liczby poniżej 1000
  if (Math.abs(num) < 1000) {
    return Number.isInteger(num)
      ? `${num}`
      : `${num}`
          .replace(/\.0+$/, "")
          .replace(/(\.\d*[1-9])0+$/, "$1");
      //: num.replace(/\.0$/, "");
  }

  for (const unit of units) {

    if (Math.abs(num) >= unit.value) {

      const value = num / unit.value;

      return value
        .toFixed(value >= 100 ? 0 : 1) // value >= 10 ? 1 : 2)
        .replace(/\.0+$/, "")
        .replace(/(\.\d*[1-9])0+$/, "$1")
        + unit.suffix;
    }
  }

  return `${num}`;
}*/

function formatStat(val) {
  if (val === "-" || val === null || val === undefined) return "-";
  if (typeof val !== "number" || isNaN(val)) return "-";
  return formatNumber(val);
}

function updateSkillsMenuIcon(){
  const icon = document.getElementById("skills-menu");
  const menuSkillsUpUrl = assetManager.getResolvedAsset("img/icons/menu-skills-icon-update.png");
  const menuSkillsUrl = assetManager.getResolvedAsset("img/icons/menu-skills-icon.png");

  if(gameState.char.skillPoints > 0){
    icon.src = menuSkillsUpUrl;
    icon.classList.add("notify");
  }else{
    icon.src = menuSkillsUrl;
    icon.classList.remove("notify");
  }
}

function updateCharMenuIcon(){
  const icon = document.getElementById("char-menu");
  const menuCharUpUrl = assetManager.getResolvedAsset("img/icons/menu-character-icon-update.png");
  const menuCharUrl = assetManager.getResolvedAsset("img/icons/menu-character-icon.png");

  if(gameState.char.availableAttributePoints > 0){
    icon.src = menuCharUpUrl;
    icon.classList.add("notify");
  }else{
    icon.src = menuCharUrl;
    icon.classList.remove("notify");
  }
}

function setPopupBackground3(selector, itemClass, customSize = false) {
  // Mapowanie klasy → tekstura + kolor
  const classStyles = {
    common:       { texture: 'common-texture.png',     color: getComputedStyle(document.documentElement).getPropertyValue('--color-common') },
    rare:         { texture: 'rare-texture.png',       color: getComputedStyle(document.documentElement).getPropertyValue('--color-magic') },
    unique:       { texture: 'unique-texture.png',     color: getComputedStyle(document.documentElement).getPropertyValue('--color-unique') },
    epic:         { texture: 'epic-texture.png',       color: getComputedStyle(document.documentElement).getPropertyValue('--color-epic') },
    legendary:    { texture: 'legendary-texture.png',  color: getComputedStyle(document.documentElement).getPropertyValue('--color-legendary') },
    set:          { texture: 'set-texture.png',        color: getComputedStyle(document.documentElement).getPropertyValue('--color-set') },
    special:      { texture: 'special-texture.png',    color: getComputedStyle(document.documentElement).getPropertyValue('--color-special') },
    poise:        { texture: 'poise-texture.png',      color: getComputedStyle(document.documentElement).getPropertyValue('--color-poise') },
    turtle:       { texture: 'turtle-texture.png',     color: getComputedStyle(document.documentElement).getPropertyValue('--color-turtle') },
    other:        { texture: 'other-texture.png',      color: getComputedStyle(document.documentElement).getPropertyValue('--color-turtle') },
    metallic:     { texture: 'metallic-texture.png',   color: getComputedStyle(document.documentElement).getPropertyValue('--color-other') },
    coal:         { texture: 'coal-texture.png',       color: getComputedStyle(document.documentElement).getPropertyValue('--color-other') },
    dark_brown:   { texture: 'dark-brown-texture.png', color: getComputedStyle(document.documentElement).getPropertyValue('--color-other') },
    dark_violet:  { texture: 'dark-violet-texture.png',      color: getComputedStyle(document.documentElement).getPropertyValue('--color-other') },
  };

  const style = classStyles[itemClass] || classStyles.common;

  // 🔥 Najważniejsza zmiana — pobieramy element ze *selektora przekazanego w argumencie*
  const outer = document.querySelector(selector);

  if (!outer) {
    console.warn("setPopupBackground3: nie znaleziono elementu dla selektora:", selector);
    return;
  }

  const backgroundUrl = assetManager.getResolvedAsset(`img/backgrounds/${style.texture}`);

  outer.style.background = `
    url('${backgroundUrl}') center/cover no-repeat
  `;
  outer.style.backgroundBlendMode = "overlay, lighten, normal";
  if(!customSize)outer.style.backgroundSize = "cover";
  else outer.style.backgroundSize = "120% 120%";
  outer.style.backgroundRepeat = "no-repeat";
  outer.style.filter = "brightness(1.0) contrast(0.95)";
  //outer.style.backgroundPosition = "center";
   
}


function setPopupBackground2(contentElement, itemClass) {
  const classStyles = {
    common: { texture: 'common-texture.png' },
    rare: { texture: 'rare-texture.png' },
    unique: { texture: 'unique-texture.png' },
    epic: { texture: 'epic-texture.png' },
    legendary: { texture: 'legendary-texture.png' },
    set: { texture: 'set-texture.png' },
    special: { texture: 'special-texture.png' },
    poise: { texture: 'poise-texture.png' }, 
    turtle: { texture: 'turtle-texture.png' },
    other:  { texture: 'other-texture.png' },
    metallic: { texture: 'metallic-texture.png' },
    coal: { texture: 'coal-texture.png' },
    dark_brown: { texture: 'dark-brown-texture.png' },
    dark_violet: { texture: 'dark-violet-texture.png' },
  };

  const style = classStyles[itemClass] || classStyles.common;

  // 👇 Użyj przekazanego elementu zamiast querySelector
  const outer = contentElement;
  if (!outer) return; // zabezpieczenie przed null

  const backgroundUrl = assetManager.getResolvedAsset(`img/backgrounds/${style.texture}`);
  
  outer.style.background = `
    url('${backgroundUrl}') center/cover no-repeat
  `;
  outer.style.backgroundBlendMode = "overlay, lighten, normal";
  outer.style.backgroundSize = "cover";
  outer.style.backgroundRepeat = "no-repeat";  
  outer.style.filter = "brightness(1.0) contrast(0.95)";
}

function setPopupBackground(contentElement, itemClass) {
  // Mapowanie klasy przedmiotu na teksturę i kolor
  const classStyles = {
    common: {
      texture: 'common-texture.png',
      color: getComputedStyle(document.documentElement).getPropertyValue('--color-common')
    },
    rare: {
      texture: 'rare-texture.png',
      color: getComputedStyle(document.documentElement).getPropertyValue('--color-magic')
    },
    unique: {
      texture: 'unique-texture.png',
      color: getComputedStyle(document.documentElement).getPropertyValue('--color-unique')
    },
    epic: {
      texture: 'epic-texture.png',
      color: getComputedStyle(document.documentElement).getPropertyValue('--color-epic')
    },
    legendary: {
      texture: 'legendary-texture.png',
      color: getComputedStyle(document.documentElement).getPropertyValue('--color-legendary')
    },
    set: {
      texture: 'set-texture.png',
      color: getComputedStyle(document.documentElement).getPropertyValue('--color-set')
    },
    special: {
      texture: 'special-texture.png',
      color: getComputedStyle(document.documentElement).getPropertyValue('--color-special')
    }
  };

  const style = classStyles[itemClass] || classStyles['common'];
  
  const outer = document.querySelector('#item-popup .popup-content'); // zewnętrzny div
  
  const backgroundUrl = assetManager.getResolvedAsset(`img/backgrounds/${style.texture}`);
  
    
  
 /* outer.style.background = `
  linear-gradient(
    rgba(10, 12, 16, 0.35),
    rgba(10, 12, 16, 0.35)
  ),
  linear-gradient(
    ${style.color},
    ${style.color}
  ),
  url('${backgroundUrl}') center / cover no-repeat
`;

outer.style.backgroundBlendMode =
  "normal, soft-light, normal";

outer.style.filter =
  "brightness(1.27) saturate(0.8) contrast(1.02)";
 */ 
  
  
  
  
  
  outer.style.background = `
    url('${backgroundUrl}') center/cover no-repeat
    `;
  
  outer.style.backgroundBlendMode = "overlay, lighten, normal";
  outer.style.backgroundSize = "cover";
  outer.style.backgroundRepeat = "no-repeat";  
  outer.style.filter = "brightness(1.0) contrast(0.95)";
}

function setGlobalButtonTexture(button) {
   if(!button) return;
  
   button.style.backgroundImage = `url("assets/bootstrap/img/backgrounds/button-texture.png")`;
   button.style.backgroundRepeat = "no-repeat";
   button.style.backgroundPosition = "center";
   button.style.backgroundSize = "175%";
}

async function loadImage(path) {
  const img = new Image();

  img.src = await assetManager.getAssetUrl(path);

  await img.decode();

  return img;
}

async function setImageSrc(img, path) {
  img.src = await assetManager.getAssetUrl(path);
}

/*async function setCssAssetVar(variable, path) {
  const url = await assetManager.getAssetUrl(path);

  document.documentElement.style.setProperty(variable, `url(${url})`);
}*/

async function setCssAssetVar(variable, path) {
  const url = await assetManager.getAssetUrl(path);

  // 🔥 wymuś decode wcześniej
  await decodeImage(url);

  document.documentElement.style.setProperty(variable, `url(${url})`);
}

let activeAlert = null;
let alertTimeout = null;

function showInfoAlert(message, timeout = 2000, isGreenAlert = false) {
  const container = document.getElementById("custom-alert-container");

  // Jeśli jest już alert – usuń go natychmiast
  if (activeAlert) {
    clearTimeout(alertTimeout);
    activeAlert.remove();
    activeAlert = null;
  }

  // Stwórz nowy alert
  const alert = document.createElement("div");
  alert.className = "custom-alert";
  alert.innerHTML = message;
  if(isGreenAlert) {
    alert.classList.add("set-slot");
  } else {
    playSound(`error`, 0.48);
    alert.classList.add("special-slot");
  }
  
  container.appendChild(alert);
  activeAlert = alert;

  // Animacja wejścia
  setTimeout(() => alert.classList.add("show"), 10);

  // Zamknięcie po czasie
  alertTimeout = setTimeout(() => {
    alert.classList.remove("show");
    setTimeout(() => {
      if (alert === activeAlert) { // usuń tylko, jeśli to wciąż aktualny
        alert.remove();
        activeAlert = null;
      }
    }, 300); // czas na animację wyjścia
  }, timeout);
}

async function decodeImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = async () => {

      try {
        await img.decode?.();
      } catch {}

      resolve();
    };

    img.onerror = reject;

    img.src = url;
  });
}

async function waitForImages(container) {
  const images = container.querySelectorAll("img");

  await Promise.all(
    [...images].map(img => {

      if (img.complete) {
        return Promise.resolve();
      }

      return img.decode?.().catch(() => {});
    })
  );
}


let isConfirmActive = false; // blokada wielu confirmów

function showCustomConfirm(message, onYes, onNo) {
  //console.error("enter confirm");
  const popup = document.getElementById("confirm-popup");
  const messageBox = document.getElementById("confirm-message");
  
  if (!popup || !messageBox) {
    console.error("Brak #confirm-popup w DOM!");
    return;
  }
  
  if (gameState.world.inCombat) {
    const enemy = gameState.world.exploreOptions[gameState.world.selectedSlotIndex].enemyData;
    pauseEnemyAttack(enemy, gameState.world.selectedSlotIndex);
   // console.error("PAUZA");
    pauseAllSkillsCooldown();
    //pausePlayerAttack();
    //pauseDefensiveCooldown();
    //enterPauseAudio(); // gdy pauza ON
    pauseGame();
    //pauseTimedBlock();
    dotIsPaused = true;
    gameState.resources.staminaState.disabled = true;
    saveGame();
  }
  
  // Sformatuj wiadomość, obsłuż \n
  messageBox.innerHTML = message.replace(/\n/g, "<br>");

  popup.classList.remove("hidden"); // pokaż popup
  popup.style.display = "flex";
  
 // console.log("Po zdjęciu hidden:", getComputedStyle(popup).display);
  
  const btnYes = popup.querySelector("#confirm-yes");
  const btnNo = popup.querySelector("#confirm-no");
  
  const cleanup = () => {
    //popup.classList.add("hidden");
    popup.style.display = "none";
    btnYes.removeEventListener("click", yesHandler);
    btnNo.removeEventListener("click", noHandler);
    playSound(`open-slot`, 0.4);
  };
  
  function yesHandler() {
    cleanup();
    if (onYes) onYes();
  }

  function noHandler() {
    cleanup();
    if (onNo) onNo();
  }

  btnYes.addEventListener("click", yesHandler);
  btnNo.addEventListener("click", noHandler);
}

function showMenuCustomConfirm(message, onYes, onNo) {
  const popup = document.getElementById("confirm-menu-popup");
  const messageBox = document.getElementById("confirm-menu-message");
  
  if (!popup || !messageBox) {
    console.error("Brak #confirm-popup w DOM!");
    return;
  }
  
  // Sformatuj wiadomość, obsłuż \n
  messageBox.innerHTML = message.replace(/\n/g, "<br>");

  popup.classList.remove("hidden"); // pokaż popup
  popup.style.display = "flex";
  
  const btnYes = popup.querySelector("#confirm-menu-yes");
  const btnNo = popup.querySelector("#confirm-menu-no");
  
  const cleanup = () => {
    popup.style.display = "none";
    btnYes.removeEventListener("click", yesHandler);
    btnNo.removeEventListener("click", noHandler);
    playSound(`open-slot`, 0.4);
  };
  
  function yesHandler() {
    cleanup();
    if (onYes) onYes();
  }

  function noHandler() {
    cleanup();
    if (onNo) onNo();
  }

  btnYes.addEventListener("click", yesHandler);
  btnNo.addEventListener("click", noHandler);
}


function getItemIcon(item){
  if(item.sprite && item.sprite !== ""){
    const spriteUrl = assetManager.getResolvedAsset(`img/items/${item.sprite}`);

    return `${spriteUrl}`;
  }
  
  const placeholderUrl = assetManager.getResolvedAsset(`img/items/placeholder.png`);

  return `${placeholderUrl}`;
}

function setItemImage(img, item){
  const spriteUrl = assetManager.getResolvedAsset(`img/items/${item.sprite}`);

  //const src = `${ASSET_BASE}` + `img/items/${item.sprite}`;

  img.onerror = () => {
    img.onerror = null;
    const placeholderUrl = assetManager.getResolvedAsset(`img/items/placeholder.png`);
    img.src = `${placeholderUrl}`;
  };

  img.src = spriteUrl;
}

function setSpriteImage(img, sprite){
  const spriteUrl = assetManager.getResolvedAsset(`img/items/${sprite}`);

 // const src = `${ASSET_BASE}` + `img/${sprite}`;

  img.onerror = () => {
    img.onerror = null;
    const placeholderUrl = assetManager.getResolvedAsset(`img/items/placeholder.png`);
    img.src = `${placeholderUrl}`;
  };

  img.src = spriteUrl;
}


function applyImageFallback(root){
  const placeholderUrl = assetManager.getResolvedAsset(`img/items/placeholder.png`);

  root.querySelectorAll("img").forEach(img => {
    img.onerror = () => {
      img.onerror = null;
      //img.src = `${ASSET_BASE}img/items/placeholder.png`;
      img.src = placeholderUrl;
      //img.parentElement?.classList.add("placeholder");
    };
  });
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
 }

    function getRandomFrom(array) {
      return array[Math.floor(Math.random() * array.length)];
    }

   function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
   }

 function getMagicPrefix(baseName) {
     if(currentLang === `en`) return `Magic`;
   
     const gender = genderMap[t(baseName).toLowerCase()] || "m";
   
     return gender === "ż" ? "Magiczna"
       : gender === "n" ? "Magiczne"
       : "Magiczny";
   }

function setMenuDisabled(disabled) {
  const buttons = document.querySelectorAll('.menu-item');
  buttons.forEach(btn => {
    if (disabled) {
      btn.classList.add('disabled');
    } else {
      btn.classList.remove('disabled');
    }
  });
}

function normalizeItem(item) {
  item.statystyki = item.statystyki.map(stat => {
    if (stat.id) return stat;

    const id = LEGACY_AFFIX_MAP[stat.nazwa];

    return {
      id,
      value: stat.wartosc
    };
  });

  if (item.baseBonus && !item.baseBonus.id) {
    item.baseBonus = {
      id: LEGACY_AFFIX_MAP[item.baseBonus.name],
      value: item.baseBonus.value
    };
  }

  return item;
}

function calculateTotalStats(equipment = {}, previewOnly = false) {
  const char = gameState.char;
  const combat = gameState.combat;
  const resources = gameState.resources;
   
  let hp = 100, dmg = 2, def = 5;
  let vit = 0, str = 0, agi = 0;
  let sumOfArmor = 0, sumOfDmg = 0, implicitDmg = 1, implicitDef = 1, implicitHp = 1;
  let elementalDmg = 0, bonusSpd = 0, spd = 1, lifeBonus = 0, dmgReduceBonus = 0;
  let staminaBonus = 0, staminaPercentBonus = 0, energyBonus = 0, energyPercentRegen = 0;
  let typeOfElementalDmg = ``;
  
  
  for (const slot in equipment) {
    const item = equipment[slot];
    if (!item?.statystyki) continue;

    // ✅ BASE BONUS (implicit)
    if (item?.baseBonus) {
      const id = item.baseBonus.id;
      const value = item.baseBonus.value;
      
      switch (id) {
        case "phys_damage_reduction":
          dmgReduceBonus += value;
          break;

        case "damage_percent":
          implicitDmg += (value / 100);
          break;

        case "armor_percent":
          implicitDef += (value / 100);
          break;

        case "life_percent":
          implicitHp += (value / 100);
          break;
      }
    }

    // ✅ STATYSTYKI
    item.statystyki.forEach(stat => {
      const id = stat.id;
      const value = +stat.value || 0;
      
      switch (id) {

        // 🔹 ATRYBUTY
        case "vitality":
          vit += value;
          break;

        case "strength":
          str += value;
          break;

        case "dexterity":
          agi += value;
          break;

        // 🔹 RESOURCE
        case "stamina_flat":
          staminaBonus += value;
          break;

        case "stamina_percent":
          staminaPercentBonus += value;
          break;

        case "energy_flat":
          energyBonus += value;
          break;

        case "energy_regen_percent":
          energyPercentRegen += value;
          break;
        
        // 🔹 ELEMENTAL DMG
        case "elemental_damage":
          elementalDmg += value;
          if (stat.element) {
            typeOfElementalDmg = stat.element;
          }
          break;
        
        // 🔹 BASE STATS
        case "damage":
          sumOfDmg += value;
          break;
        
        case "armor":
          sumOfArmor += value;
          break;

        // 🔹 LIFE
        case "flat_life":
          lifeBonus += value;
          break;

        // 🔹 DEF
        case "phys_damage_reduction":
          dmgReduceBonus += value;
          break;
      }
    });
  }
  
  /*for (const slot in equipment) {
    const item = equipment[slot];
    if (!item?.statystyki) continue;
    
     if (item?.baseBonus) {
       if(item.baseBonus.name === "% Redukcji Obrażeń Fizycznych") {
         dmgReduceBonus += item.baseBonus.value;
       } else if(item.baseBonus.name === "% Obrażenia") {
         implicitDmg += (item.baseBonus.value / 100);
         //console.log("implicitDmg", implicitDmg);
       } else if(item.baseBonus.name === "% Pancerz") {
         implicitDef += (item.baseBonus.value / 100);
         //console.log("implicitDef", implicitDef);
       } else if(item.baseBonus.name === "% Życie") {
         implicitHp += (item.baseBonus.value / 100);
         //console.log("implicitHp", implicitHp);
       }
     }
    
    item.statystyki.forEach(stat => {
      const name = stat.nazwa || "";
      const value = +stat.wartosc || 0;
      
      if (name === " Witalność") vit += value;
      else if (name === " Siła") str += value;
      else if (name === " Zręczność") agi += value;
      else if (name === " Stamina") staminaBonus += value;
      else if (name === "% Stamina") staminaPercentBonus += value;
      else if (name === " Energia") energyBonus += value;
      else if (name === "% Regeneracji Energii") energyPercentRegen += value;
      else if (name.startsWith(" Obrażenia od")){
        elementalDmg += value;
        if (name === " Obrażenia od Zimna") typeOfElementalDmg = `cold`;
        else if (name === " Obrażenia od Ognia") typeOfElementalDmg = `fire`;
        else if (name === " Obrażenia od Trucizny") typeOfElementalDmg = `poison`;
        else if (name === " Obrażenia od Magii") typeOfElementalDmg = `magic`;
      }  
      else if (name === "Obrażenia") sumOfDmg += value;
      else if (name === "Pancerz") sumOfArmor += value;
      else if (name === " Życie") lifeBonus += value;
      else if (name === "% Redukcji Obrażeń Fizycznych") dmgReduceBonus += value;
    });
    
  }*/
  
  const BASE_ENERGY = 100;
  const finalEnergy = BASE_ENERGY + energyBonus + char.bonus.maxEnergy;
  
  if(!previewOnly) {
    resources.energyState.max = finalEnergy;
  } 
    
  //saveEnergy();
  
  vit += char.attributes.vitality;
  str += char.attributes.strength;
  agi += char.attributes.dexterity;
  
  hp += vit * 5;
  dmg += str * 3;
  def += agi * 4;
  
  hp += char.bonus.maxHp;
  dmg += char.bonus.dmg;
  def += char.bonus.def;
  
  /*console.log("hp after vit", hp);
  console.log("dmg after str", dmg);
  console.log("def after agi", def);*/
  
  dmg += sumOfDmg;
  def += sumOfArmor;
  /*console.log("dmg after sumOfDmg", dmg);
  console.log("def after sumOfArmor", def);*/

  //console.error("char.bonus.defPct", char.bonus.defPct);
  /*hp *= (1 + char.bonus.maxHpPct / 100); 
  dmg *= (1 + char.bonus.dmgPct / 100); 
  def *= (1 + char.bonus.defPct / 100);*/ 

  //console.error("dmg after dmgPct", dmg);

  hp *= implicitHp;
  dmg *= implicitDmg;
  def *= implicitDef;
  /*console.log("hp after implicitHp", hp);
  console.log("dmg after implicitDmg", dmg);
  console.log("def after implicitDef", def);*/
  
 // console.log("lifeBonus", lifeBonus);
     
  const BASE_STAMINA = 100;

  //const staminaFromVit = Math.floor(vit / 5) * 3;
  
  //const staminaFromVit = Math.floor(Math.sqrt(vit) * 2);
  const staminaFromVit = Math.sqrt(vit) * 3;
  
  //console.error("char.bonus.maxStamina", char.bonus.maxStamina);
  
  let staminaBase = BASE_STAMINA + staminaFromVit + staminaBonus + char.bonus.maxStamina;
  
  let staminaFinal = staminaBase * (1 + staminaPercentBonus / 100);
  
  /*if (currentBuff?.dmg) {
     dmg *= currentBuff.dmg;
  }*/
  
  /* const totalMultiplier = combatState.energyMultiplier * combatState.fatigueMultiplier * combatState.deathMultiplier;

   dmg *= totalMultiplier;
   def *= totalMultiplier;*/
  
   if(combat.flags.isDebuff) {
     dmg = combat.stats.dmg;
     def = combat.stats.def;
   }
  
   if (currentBuff?.dmg) {
     dmg *= currentBuff.dmg;
   }
  
  if (currentBuff?.def) {
     def *= currentBuff.def;
   }
  
  if(!previewOnly) {
    char.vit = vit;
    char.str = str;
    char.agi = agi;
  }  
  
  const baseDamage = {
    weapon: sumOfDmg,
    stats: str * 3,
    flat: char.bonus.dmg,
    implicit: implicitDmg
  };
  
  if(!previewOnly) {
    char.baseDamage = baseDamage;
  } 
  
  //const extraDmg = char?.dmg ?? 1;
   //const extraDef = char?.def ?? 1;
  
   //console.log("dmg after all", dmg);
  
  //console.error("char.bonus maxHp, dmg, def", char.bonus.maxHp, char.bonus.dmg, char.bonus.def);
  
   let totalHp = Math.round(hp + lifeBonus);
   const totalDmg = Math.round(dmg * combat.deathDebuff.deathMultiplier);
   const totalDef = Math.round(def * combat.deathDebuff.deathMultiplier); 
   const totalStamina = Math.round(staminaFinal);  
   /*console.log("totalDmg", totalDmg);
   console.log("totalDef", totalDef);
   console.log("totalHp", totalHp);
   console.warn("totalStamina", totalStamina);*/
  
   //totalHp *= totalMultiplier;
  
   //if (!combatState.previewStats) {
  
   if(combat.flags.isDebuff) {
     totalHp = combat.stats.hp;
   } 
  
   totalHp *= combat.deathDebuff.deathMultiplier;
  
   if(!previewOnly) {
     char.maxHp = totalHp;
   }
  
   //char.maxStamina = totalStamina;
  
   if(!previewOnly) {
     resources.staminaState.max = totalStamina;
   } 
  
   //console.error(`char.hp in calculate total before let currentHp`, char.hp);
  // console.error("SET MAX STAMINA", totalStamina);  
  
   let currentHp = char.hp ?? totalHp;
   
   //console.error(`currentHp in calculate total after let currentHp`, currentHp);
  
  // Zabezpieczenie: jeżeli current HP przekracza nowe maxHP (np. po zdjęciu przedmiotu)
   if (currentHp > totalHp) {
     currentHp = totalHp;
     if(!previewOnly) {
       char.hp = currentHp;
     }  
   }
  
  //console.error(`char.hp in calculate total after char.hp = currentHp`, char.hp);
  
  //let currentStamina = char.stamina ?? totalStamina;
  
  if (resources.staminaState.current == null) {
    //char.stamina = totalStamina;
    if(!previewOnly) {
      resources.staminaState.current = totalStamina;
    }  
  }

  if (resources.staminaState.current > totalStamina) {
    //char.stamina = totalStamina;
    if(!previewOnly) {
      resources.staminaState.current = totalStamina;
    } 
  }
  
  let inTownRegen = 1;
  
  if(isLocationWithTown() && gameState.world.currentStepIndex == 0) {
    inTownRegen = 3;
    //document.getElementById(`shop-menu-btn`).classList.remove('disabled');
  } else {
    //document.getElementById(`shop-menu-btn`).classList.add('disabled');
  }
  
  let passiveEnegyRegen = 1;
  
  if(char.bonus.energyRegen) passiveEnegyRegen = (1 + char.bonus.energyRegen / 100);
  
  //console.error(`passiveEnegyRegen`, passiveEnegyRegen);
    
  let finalEnergyRegen = 
     resources.energyState.regenPerSecond *
     passiveEnegyRegen *
     (1 + energyPercentRegen / 100) *
     getEnergyRegenMultiplier() *
     getFoodDebuffMultiplier() *
     inTownRegen;
   
  
  //console.error(`energyState.regenPerSecond, energyPercentRegen, getEnergyRegenMultiplier, getFoodDebuffMultiplier, inTownRegen`, energyState.regenPerSecond, (1 + energyPercentRegen / 100), getEnergyRegenMultiplier(), getFoodDebuffMultiplier(), inTownRegen);

   //console.error(`finalEnergyRegen`, finalEnergyRegen);

   if(!previewOnly) {
     char.energyRegenBonus = (1 + energyPercentRegen / 100);
     char.energyRegen = finalEnergyRegen;
   } 
  
  /*if (currentStamina > totalStamina) {
     currentStamina = totalStamina;
     char.stamina = currentStamina;
  }*/
  
  //console.error("typeOfElementalDmg", typeOfElementalDmg);
  
  if(!previewOnly) {
    char.physDmgReduction = dmgReduceBonus;
    char.elementalDmg = elementalDmg;
    char.typeOfElementalDmg = typeOfElementalDmg;
  }  
  //console.log("dmgReduceBonus", dmgReduceBonus);
  
  if(!previewOnly) {
    char.dmg = totalDmg;
    char.def = totalDef;
  } 
  
  //saveGame();
  
   return { hp: currentHp, maxHp: totalHp, dmg: totalDmg, def: totalDef, maxStamina: totalStamina };
 }

 function translateClass(klasa) {
  const map = {
    "common": "Zwykłe",
    "rare": "Magiczne",
    "unique": "Unikalne",
    "epic": "Epickie",
    "legendary": "Legendarne"
    };
    return map[klasa] || klasa;
  }

const BASE_STAT_IDS = [
  "damage",
  "armor",
  "attack_speed",
  "block"
];

const BASE_TO_BONUS_MAP = {
  damage: "damage_percent",
  armor: "armor_percent",
  attack_speed: "attack_speed_percent",
  block: "block_chance"
};

function renderBaseStats(item, charLevel) {

  const stats = item.statystyki;

  // ✅ sprawdzamy boosty po ID
  const hasBonus = {
    damage: stats.some(s => s.id === "damage_percent"),
    armor: stats.some(s => s.id === "armor_percent"),
    attack_speed: stats.some(s => s.id === "attack_speed_percent"),
    block: stats.some(s => s.id === "block_chance")
  };

  const baseStats = [];

  stats
    .filter(stat => BASE_STAT_IDS.includes(stat.id))
    .forEach(stat => {

      const id = stat.id;
      const value = stat.value;

     // console.log(`stat id`, stat.id);
      const isBoosted = hasBonus[id];

      const name = getStatLabel(id); // 🔥 tłumaczenie
      const nameColor = isBoosted ? "color:#1e90ff;" : "";
      const valueColor = isBoosted ? "color:#1e90ff;" : "";

      if (id === "damage" || id === "armor") {
        baseStats.push(`
          <div>
            <span style="font-size:16px;">${name}</span><br>
            <span style="${valueColor} font-size:21px;">${value}</span>
          </div>
        `);
      } else {
        baseStats.push(`
          <div>
            <span style="${nameColor}">${name}:</span>
            <span style="${valueColor}">${value}</span>
          </div>
        `);
      }

    });

  // 🔹 typ itemu
  let twoHanded = "";
  if (item.typ === "weapon" && item.twoHanded) {
    twoHanded = `<div>${t("two_handed")}</div>`;
  }

  // 🔹 wymagany level
  const requiredHTML =
    item.requiredLevel > charLevel
      ? `<div style="color:red;">${t("required_level")}: ${item.requiredLevel}</div>`
      : `<div>${t("required_level")}: ${item.requiredLevel}</div>`;

  return `
    ${baseStats.join("")}
    ${twoHanded}
    ${requiredHTML}
  `;
}

function renderImplicitStats(item) {
  if (!item.baseBonus) return "";

  return `
    <div class="item-separator"></div>
    <div class="stat-category">${t("item_implicit_title")}</div>
    <div>
      <span style="color:#6fbf73;">+${item.baseBonus.value}</span>
      <span style="color:#6fbf73;">${getAffixLabel(item.baseBonus)}</span>
    </div>
  `;
}

function renderExclusiveAffixes(item) {
  if (!item.exclusive) return "";
  
  return `
  <div class="item-separator"></div>

  <div class="stat-category exclusive-title">
    ${t("exclusive_title")}
  </div>

  <div class="exclusive-affix">
    <span class="exclusive-name">${t(item.exclusive.name)}</span><br>
    <span class="exclusive-desc">${t(item.exclusive.desc)}</span>
  </div>
`;
  
}

function renderWeaponStyle(item) {
  if (!item.style) return "";

  return `
  <div class="item-separator"></div>

  <div class="stat-category style-title">
    ${item.style.icon || ""} ${t("weapon_style_title")}: ${t(item.style.name)}
  </div>

  <div class="style-block">
  <!--  <span class="style-desc">${t(item.style.desc)}</span><br> -->
    <span class="style-mech">${t(item.style.mech)}</span>
  </div>
`;
}

function renderItemStats(item) {

  const stats = item.statystyki;

  const attributeStats = [];
  const bonusStats = [];

  const hasBonus = {
    damage: stats.some(s => s.id === "damage_percent"),
    armor: stats.some(s => s.id === "armor_percent"),
    attack_speed: stats.some(s => s.id === "attack_speed_percent"),
    block: stats.some(s => s.id === "block_chance")
  };

  const isAttribute = (id) =>
    ["strength", "dexterity", "vitality"].includes(id);

  const isBaseStat = (id) =>
    BASE_STAT_IDS.includes(id);

  stats.forEach(stat => {

    const id = stat.id;
    const value = stat.value;

    if (isBaseStat(id)) return;
  
    //console.log(`stat.category`, stat.id, stat?.category);
    if (stat?.category === "combat") return;
    
    const name = getAffixLabel(stat);

    const boosted =
      (id === "damage" && hasBonus.damage) ||
      (id === "armor" && hasBonus.armor) ||
      (id === "attack_speed" && hasBonus.attack_speed) ||
      (id === "block" && hasBonus.block);

    const nameColor = !isBaseStat(id) ? "color:#1e90ff;" : "";
    const valueColor = boosted || !isBaseStat(id) ? "color:#1e90ff;" : "";

    let prefix = "+";

    /*if (id.includes("cost")) {
      prefix = "-";
    }*/

    const line = `
      <div>
        <span style="${valueColor}">${prefix}${value}</span><span style="${nameColor}">${name}</span>
      </div>
    `;
    
    
    
    if (isAttribute(id)) {
      attributeStats.push(line);
    } else {
      bonusStats.push(line);
    }

  });

  const categoryLine = `
    <div class="item-separator"></div>
    <div class="stat-category">${t("bonuses_title")}</div>
  `;

  return `
    ${item.rarity !== "common" ? categoryLine : ""}
    ${attributeStats.join("")}
    ${bonusStats.join("")}
  `;
}

function renderCombatAffixes(item) {
  const stats = item.statystyki || [];

  const combatAffixes = [];

  stats.forEach(stat => {

    if (stat.category !== "combat") return;

    //const affixDiscovered = gameState.char.combatAffixes[stat.id]?.discovered || false;
    const affixDiscovered = item.discovered;
    
    combatAffixes.push(`
      <div class="combat-affix-line">
        <span class="combat-affix-text">
          ${affixDiscovered ? getAffixLabel(stat) : "???" }
        </span>
      </div>
    `);
  });

  if (!combatAffixes.length) return "";

  return `
    <div class="item-separator"></div>
    <div class="stat-category">
      ${t("combat_affixes_title")}
    </div>

    ${combatAffixes.join("")}
  `;
}


function getStatLabel(id) {
  const map = {
    damage: { pl: "Obrażenia", en: "Damage" },
    armor: { pl: "Pancerz", en: "Armor" },
    attack_speed: { pl: "Szybkość ataku", en: "Attack Speed" },
    block: { pl: "Blok", en: "Block" }
  };

  return map[id]?.[currentLang] || id;
}

function getCharacter() {
  applyLifeRegen(gameState.char);
  return gameState.char;
}

function setStatValue(id, value) {
  const el = document.getElementById(id);
  if (!el) return;

  el.dataset.value = value;               // 🔢 prawdziwa liczba
  el.textContent = formatNumber(value);   // 👁️ format do UX
}

function renderStaminaOrb(stamina, maxStamina) {
  const staminaLabelEl = document.getElementById("stamina-label");
  
  if(staminaLabelEl) {
    //console.error(`in if renderStaminaOrb stamina, maxStamina`, stamina, maxStamina);
    staminaLabelEl.textContent = `${stamina.toFixed(0)} / ${maxStamina}`;
  }
  
  //console.error(`renderStaminaOrb stamina, maxStamina`, stamina, maxStamina);
  
  const staminaOrb = document?.getElementById("stamina-orb-fill");
  const orb = document.querySelector(".stamina-orb");
  
  if (staminaOrb && maxStamina) {
    const percent = Math.min(100, Math.round(100 * stamina / maxStamina));
    document.querySelector(".stamina-orb .orb-liquid").style.height = percent + "%";
    orb.classList.toggle("full", percent >= 99);
    
    if (percent < 20) {
      orb.classList.add("low");
    } else if (percent >= 25) {
      orb.classList.remove("low");
    }

  }

}

/*function renderHpBar(hp, maxHp) {
  // HP
  //console.error(`char.hp in renderHpBar`, hp);
  
  combat.stats.currentHp = hp;
  combat.stats.maxHp = maxHp;

  const hpEl = document.getElementById("hp");
  const hpLabelEl = document.getElementById("hp-label");
  
  if(hpEl && hpLabelEl) {
    //hpEl.innerText = maxHp;
    //setStatValue("hp", maxHp);
    hpLabelEl.textContent = `${formatNumber(hp)} / ${formatNumber(maxHp)}`;
    //hpLabelEl.textContent = `${hp} / ${maxHp}`;
  }
    //updateSingleStatValue("hp", maxHp);
  
  // Pasek HP
  
  const hpOrb = document?.getElementById("hp-orb-fill");
  const orb = document.querySelector(".hp-orb");
  const body = document.body;

  if (hpOrb && maxHp) {
    const percent = Math.min(100, Math.round(100 * hp / maxHp));
    //const percent = Math.max(0, Math.min(100, (hp / maxHp) * 100));
 
    //const percent = Math.max(0, hp / maxHp) * 100;
    //hpOrb.style.height = percent + "%";
    document.querySelector(".hp-orb .orb-liquid").style.height = percent + "%";
    //document.querySelector(".hp-orb .liquid-surface").style.height = percent + "%";
    orb.classList.toggle("full", percent >= 99);
    //orb.classList.toggle("low", percent < 30);
    
    if (percent < 35) {
      orb.classList.add("low");
      body.classList.add("low-hp");
      playSound("low-hp", 0.38);
    } else if (percent >= 35) {
      orb.classList.remove("low");
      body.classList.remove("low-hp");
    }
  }
}*/

function showBuff(id, affixValue) {
  const el = document.getElementById(id);
  const current = parseFloat(el.dataset.value ?? 0);
  const newBuff = 1 + (affixValue / 100);
  const buff = current * newBuff;
  //console.log(`affixValue showBuff`, affixValue);
  diffPreview(id, buff);
}

function showPercentDebuff(id, percentValue) {
  
  const el = document.getElementById(id);
  diffEl = document.getElementById(`${id}-debuff`);

  if (!el) {
    //console.warn(`[diffPreview] brak elementu el dla id=${id}`);
    return;
  }
  if (!diffEl) {
    //console.warn(`[diffPreview] brak elementu diffEl dla id=${id}-debuff`);
    return;
  }
  
  if (isNaN(percentValue)) {
    console.warn(`[diffPreview] id=${id}, błędne dane`, { percentValue });
    return;
  }
   
  //console.log("percentValue", percentValue);
   
  if (percentValue > 0) {
    diffEl.textContent = `(+${formatNumber(percentValue)}%)`;
    diffEl.className = "stat-debuff stat-combat-buff";
  } else if (percentValue < 0) {
    diffEl.textContent = `(${formatNumber(percentValue)}%)`;
    diffEl.className = "stat-debuff stat-combat-debuff";
  } else {
    diffEl.textContent = "";
    diffEl.className = "stat-debuff";
  }

}


function showPercentBuff(id, percentValue) {
  
  const el = document.getElementById(id);
  diffEl = document.getElementById(`${id}-diff-preview`);

  if (!el) {
    //console.warn(`[diffPreview] brak elementu el dla id=${id}`);
    return;
  }
  if (!diffEl) {
    //console.warn(`[diffPreview] brak elementu diffEl dla id=${id}-diff-preview`);
    return;
  }
  
  if (isNaN(percentValue)) {
    console.warn(`[diffPreview] id=${id}, błędne dane`, { percentValue });
    return;
  }
   
  //console.log("percentValue", percentValue);
   
  if (percentValue > 0) {
    diffEl.textContent = `(+${formatNumber(percentValue)}%)`;
    diffEl.className = "stat-diff stat-preview stat-combat-buff";
  } else if (percentValue < 0) {
    diffEl.textContent = `(-${formatNumber(percentValue)}%)`;
    diffEl.className = "stat-diff stat-preview stat-combat-debuff";
  } else {
    diffEl.textContent = "";
    diffEl.className = "stat-diff stat-preview";
  }

}

function updateLowHpUIBuff() {
   if(gameState.combat.lowHpBonus.lowHpDmgActive) {
      //showBuff("dmg", gameState.combat.activeBonus.dmg);
     showPercentBuff("dmg", gameState.combat.activeBonus.dmg);
    } 
}

function renderHpBar(hp, maxHp) {
  //if(gameState.resources.isComparing) return;
  
  gameState.combat.stats.currentHp = hp;
  gameState.combat.stats.maxHp = maxHp;

  const hpEl = document.getElementById("hp");
  const hpLabelEl = document.getElementById("hp-label");

  if (hpEl && hpLabelEl) {
    hpLabelEl.textContent = `${formatNumber(hp)} / ${formatNumber(maxHp)}`;
  }

  if(gameState.world.inCombat) {
    const percent = hp / maxHp * 100;

    document.getElementById("player-health-fill").style.width =
        percent + "%";

    document.getElementById("player-health-text").innerText =
        `${formatNumber(hp)}/${formatNumber(maxHp)}`;
  }  
  
  const hpOrb = document?.getElementById("hp-orb-fill");
  const orb = document.querySelector(".hp-orb");
  const body = document.body;

  if (hpOrb && maxHp) {
    const percent = Math.min(100, Math.round(100 * hp / maxHp));
    document.querySelector(".hp-orb .orb-liquid").style.height = percent + "%";
    orb.classList.toggle("full", percent >= 99);

    const isLowNow = percent < 35;
    
    // 🔥 TYLKO PRZY WEJŚCIU W LOW HP
    if (isLowNow && !gameState.combat.flags.isLowHp) {
      orb.classList.add("low");
      body.classList.add("low-hp");
      playSound("low-hp", 6, 1, 0.38);
    }

    // 🔥 PRZY WYJŚCIU ZE STANU
    if (!isLowNow && gameState.combat.flags.isLowHp) {
      orb.classList.remove("low");
      body.classList.remove("low-hp");
    }
    
      
    //console.log(`lowHpDmgActive, active bonus dmg`, gameState.combat.lowHpBonus.lowHpDmgActive, gameState.combat.activeBonus.dmg);
    
    
    if(gameState.world.inCombat && gameState.char.combatAffixes[`crit_missing_hp`]) {
      const critBonus = gameState.char.combatAffixes[`crit_missing_hp`].value;
      const missHp = maxHp - hp;
      const missingRatio = missHp / maxHp;
      
      gameState.combat.activeBonus.critSources.missingHp = critBonus * (missingRatio * 10);
      recalculateCritBonus();
      
      if(hp >= maxHp) {
        gameState.combat.activeBonus.critSources.missingHp = 0;
        recalculateCritBonus();
      }
      
    }
    
    
    if (isLowNow && gameState.world.inCombat && !gameState.combat.lowHpBonus.lowHpDmgActive && gameState.char?.combatAffixes["dmg_below_hp"] && !gameState.resources.enterStore && !gameState.resources.isComparing) {
      const value = gameState.char.combatAffixes["dmg_below_hp"].value;
      //gameState.combat.activeBonus.dmg += value;
      gameState.combat.lowHpBonus.lowHpDmgActive = true;

      gameState.combat.activeBonus.dmgSources.lowHp = value;
      recalculateDamageBonus();
      
      //showBuff("dmg", gameState.combat.activeBonus.dmg);
      //showPercentBuff("dmg", gameState.combat.activeBonus.dmg);
    }

    if (!isLowNow && gameState.combat.lowHpBonus.lowHpDmgActive && gameState.char?.combatAffixes[`dmg_below_hp`]) {
      const value = gameState.char.combatAffixes["dmg_below_hp"].value;
      //decreaseBonusDmgBuff(value);
      
      gameState.combat.lowHpBonus.lowHpDmgActive = false;
      //console.log(`lowHpDmgActive !isLowNow`, gameState.combat.lowHpBonus.lowHpDmgActive);

      gameState.combat.activeBonus.dmgSources.lowHp = 0;
      recalculateDamageBonus();
      
      clearAllDiffs("dmg");
    }
  
    if (isLowNow && gameState.world.inCombat && !gameState.combat.lowHpBonus.lowHpDefActive && gameState.char?.combatAffixes["gain_def_below_hp"] && !gameState.resources.enterStore && !gameState.resources.isComparing) {
      const value = gameState.char.combatAffixes["gain_def_below_hp"].value;
     
      gameState.combat.lowHpBonus.lowHpDefActive = true;

      gameState.combat.activeBonus.defSources.lowHp = value;
      recalculateDefenseBonus();
      //console.log(`lowHpDefActive added value, isLowNow`, value);
    }

    if (!isLowNow && gameState.combat.lowHpBonus.lowHpDefActive && gameState.char?.combatAffixes[`gain_def_below_hp`]) {
      const value = gameState.char.combatAffixes["gain_def_below_hp"].value;
      
      gameState.combat.lowHpBonus.lowHpDefActive = false;
      //console.log(`lowHpDefActive !isLowNow`, gameState.combat.lowHpBonus.lowHpDefActive);

      gameState.combat.activeBonus.defSources.lowHp = 0;
      recalculateDefenseBonus();
      
      clearAllDiffs("def");
    }
    
    if (gameState.char.combatAffixes["gain_dmg_equal_active_def_bonus"] && gameState.world.inCombat) {
      const defAccumulate = gameState.combat.activeBonus.def;
      const value = gameState.char.combatAffixes["gain_dmg_equal_active_def_bonus"].value;

      gameState.combat.activeBonus.dmgSources.defToDmg = defAccumulate * (value / 100);

      if(gameState.combat.activeBonus.lastDefToDmg !== defAccumulate) {
        recalculateDamageBonus();
        
        gameState.combat.activeBonus.lastDefToDmg = defAccumulate;
      }
    }
    
    //console.log(`doubleLoHActive, active bonus dmg`, gameState.combat.lowHpBonus.doubleLoHActive);
    
    const isLowForLoH = percent < gameState.char?.combatAffixes["loh_doubled_below_hp"]?.value;
    
    if (isLowForLoH && !gameState.combat.lowHpBonus.doubleLoHActive && gameState.char?.combatAffixes["loh_doubled_below_hp"]) {
      gameState.combat.lowHpBonus.doubleLoHActive = true;
    }

    if (!isLowForLoH && gameState.combat.lowHpBonus.doubleLoHActive && gameState.char?.combatAffixes["loh_doubled_below_hp"]) {
      gameState.combat.lowHpBonus.doubleLoHActive = false;
    }
    
    
    gameState.combat.flags.isLowHp = isLowNow;
    
  }
}

function recalculateDamageBonus() {
  const sources = gameState.combat.activeBonus.dmgSources;
  const enemy = gameState.world.exploreOptions[gameState.world.selectedSlotIndex]?.enemyData;
 
  gameState.combat.activeBonus.dmg =
      sources.lowHp +
      sources.afterBreak +
      sources.defToDmg +
      sources.guardStacks +
      sources.controlStacks +
      sources.armorBreak +
      sources.exhausted +
      sources.energy +
      sources.bleed;

  //console.table(gameState.combat.activeBonus.dmgSources);
 // console.error(`activeBonus.dmg`, gameState.combat.activeBonus.dmg);

  updateStatusPlayerUI(enemy);
  
  showPercentBuff("dmg", gameState.combat.activeBonus.dmg);
}

function recalculateDefenseBonus() {
  const sources = gameState.combat.activeBonus.defSources;
  const enemy = gameState.world.exploreOptions[gameState.world.selectedSlotIndex]?.enemyData;
  
  gameState.combat.activeBonus.def =
    sources.exhausted +
    sources.guard +
    sources.perfectBlock +
    sources.defensiveStance +
    sources.perSecBlock +
    sources.lowHp +
    sources.armorBreak;
  
    //console.table(gameState.combat.activeBonus.defSources);
    //console.error(`activeBonus.def`, gameState.combat.activeBonus.def);
  
  updateStatusPlayerUI(enemy);
  
  showBuff("def", gameState.combat.activeBonus.def);
}

function recalculateCritBonus() {
  const sources = gameState.combat.activeBonus.critSources;
  const enemy = gameState.world.exploreOptions[gameState.world.selectedSlotIndex]?.enemyData;
  
  gameState.combat.activeBonus.crit =
    sources.exhausted +
    sources.guardStacks +
    sources.afterBreak +
    sources.energy +
    sources.bleed +
    sources.controlStacks +
    sources.missingHp +
    sources.dodge +
    sources.armorBreak;
  
    //console.table(gameState.combat.activeBonus.critSources);
    //console.error(`activeBonus.def`, gameState.combat.activeBonus.crit);
  
    updateStatusPlayerUI(enemy);
  
}



function decreaseBonusDmgBuff(value) {
  if(gameState.combat.activeBonus.dmg > 0) {
    gameState.combat.activeBonus.dmg -= value;
    if(gameState.combat.activeBonus.dmg <= 0) {
      gameState.combat.activeBonus.dmg = 0;
      clearAllDiffs(`dmg`);
    } else {
      showPercentBuff(`dmg`, gameState.combat.activeBonus.dmg);
    }
  }
}

function decreaseBonusDefBuff(value) {
  if(gameState.combat.activeBonus.def > 0) {
    gameState.combat.activeBonus.def -= value;
    if(gameState.combat.activeBonus.def <= 0) {
      gameState.combat.activeBonus.def = 0;
      clearAllDiffs(`def`);
    } else {
      //console.log(`activeBonus > 0`, gameState.combat.activeBonus.def, value);
      showBuff(`def`, gameState.combat.activeBonus.def);
    }
  }
}

function decreaseBonusAtkSpdBuff(value) {
  const enemy = gameState.world.exploreOptions[gameState.world.selectedSlotIndex]?.enemyData;

  if(gameState.combat.activeBonus.atkSpd > 0) {
    gameState.combat.activeBonus.atkSpd -= value;
    if(gameState.combat.activeBonus.atkSpd <= 0) {
      gameState.combat.activeBonus.atkSpd = 0;
      updateStatusPlayerUI(enemy);
    } else {
     // showBuff(`def`, gameState.combat.activeBonus.atkSpd);
    }
  }
}


function updateGlobalStatsColors() {
  const hpEl = document.getElementById("hp");
  const dmgEl = document.getElementById("dmg");
  const defEl = document.getElementById("def");

  const statEls = [hpEl, dmgEl, defEl];

  // 1️⃣ Reset WSZYSTKIEGO
  statEls.forEach(el => {
    el.classList.remove(
      "stat-default",
      "stat-buff",
      "energy-mid",
      "energy-low",
      "energy-critical"
    );
  });

  // 2️⃣ ENERGY DEBUFF (TOP PRIORITY)
  if (gameState.combat.flags.previewStats) {
    const m = gameState.combat.stats.energyMultiplier;

    let energyClass = "energy-mid";
    if (m <= 0.45) energyClass = "energy-critical";
    else if (m <= 0.7) energyClass = "energy-low";

    statEls.forEach(el => el.classList.add(energyClass));
    return; // ⛔ NIC WIĘCEJ NIE NAKŁADAMY
  }

  if (gameState.combat.deathDebuff.deathDebuffFightsLeft > 0) {
    statEls.forEach(el => el.classList.add("energy-critical"));
  }
  
  // 3️⃣ BUFFY
  if (currentBuff?.dmg) {
    dmgEl.classList.remove("energy-critical");
    dmgEl.classList.add("stat-buff");
  }

  if (currentBuff?.def) {
    defEl.classList.add("stat-buff");
  }
  
  // 4️⃣ DEFAULT
  statEls.forEach(el => {
    if (el.classList.length === 0) {
      el.classList.add("stat-default");
    }
  });
}

function updateCharacterViewStatsOnly(eq) {
  const char = gameState.char;
  
  //const eq = char?.equipment || {};
  let vit = 0, str = 0, agi = 0, bonusDmg = 1, bonusArmor = 1, bonusSpd = 1, spd = 1;
  let bonusBlock = 1, block = 0, crit = 5, critDmg = 100, magicFind = 0, goldFind = 0;     
  let fireRes = 0, coldRes = 0, poisonRes = 0, magicRes = 0;
  let lifeOnHit = 0, lifeRegen = 0, dodge = 0, staminaRegen = 0, staminaPercentRegen = 0;
  let dodgeCost = 0, moveCost = 0, perfectWindowBonus = 0, perfectBlockEnergy = 0, critEnergy = 0; 
  
  //char.combatAffixes = {};
  char.combatAffixes = Object.create(null);
  
  for (const slot in eq) {
    const implicit = eq[slot]?.baseBonus;
    
    // 🔹 Bazowe staty itemu (implicit już tu siedzi)
      let value = +implicit?.value || 0;
      let name = implicit?.name;
    
      /*if (name === "% Szybkość Ataku") bonusSpd += value;
      else if (name === "% Szansa na Blok") bonusBlock += value;*/
    
      const id = implicit?.id;

      if (id === "attack_speed_percent") bonusSpd += value;
      else if (id === "block_chance") bonusBlock += value;
      
    //console.log("bonusSpd after implicit", bonusSpd);
    //console.log("bonusBlock after implicit", bonusBlock);

    if(slot === `weapon`){
      const style = eq[slot]?.style;
      char.style = style || {};
    }
    
    const stats = eq[slot]?.statystyki || [];
    stats.forEach(stat => {
      
      if(stat?.category === `combat`) {
        updateCombatAffixes(stat, slot, eq[slot].baseName);
      } 
      
      const id = stat.id;
      const value = +stat.value || 0;

      switch (id) {
        case "vitality": vit += value; break;
        case "strength": str += value; break;
        case "dexterity": agi += value; break;

        case "stamina_regen_flat": staminaRegen += value; break;
        case "stamina_regen_percent": staminaPercentRegen += value; break;

        case "dodge_cost": dodgeCost += value; break;
        case "move_cost": moveCost += value; break;

        //case "perfect_block_window": perfectWindowBonus += value; break;
        case "energy_on_perfect_block": perfectBlockEnergy += value; break;

        case "attack_speed_percent": bonusSpd += value; break;
        case "energy_on_crit": critEnergy += value; break;

        case "attack_speed":
          spd = (value * (1 + bonusSpd / 100));
        break;

        case "dodge_chance": dodge += value; break;
        case "crit_chance": crit += value; break;
        case "crit_damage": critDmg += value; break;

        case "life_regen_flat": lifeRegen += value; break;
        case "life_on_hit": lifeOnHit += value; break;

        case "magic_find": magicFind += value; break;
        case "gold_bonus": goldFind += value; break;

        case "block_chance": bonusBlock += value; break;

        case "block":
          block = (value * (1 + bonusBlock / 100));
        break;

        case "elemental_resist":
          switch(stat.element) {
            case "fire": fireRes += value; break;
            case "cold": coldRes += value; break;
            case "arcane": magicRes += value; break;
            case "poison": poisonRes += value; break;
          }
      }
    });
    
    //console.log("spd i bonusSpd after stats", spd, bonusSpd);
  }
   
  vit += char.attributes.vitality;
  str += char.attributes.strength;
  agi += char.attributes.dexterity;
   
   if(char.bonus.atkspdBonus) {
     spd *= (1 + char.bonus.atkspdBonus / 100);
   } 
      
   if(char.bonus.critDmgBonus) {
     critDmg *= (1 + char.bonus.critDmgBonus / 100);
   }
   
   dodge = dodge + (agi/10);
   
   //console.error("lifeRegen char.bonus.hpRegen", lifeRegen, char.bonus.hpRegen);

   lifeRegen = lifeRegen + (vit * 0.1) + char.bonus.hpRegen;
   
   let cooldownDuration = calculateCooldown(spd);
   const { atkSpd: penaltyAtkSpeed, attackPenalty: penaltyDmg } = computeShieldPenalties((block / 100), spd);
     
   const penaltyCooldown = calculateCooldown(penaltyAtkSpeed);
   const penaltyAtkSpd = getAttackSpeedPenaltyPercent(cooldownDuration, penaltyCooldown);
   
      
   const BASE_STAMINA_REGEN = 12;
   let staminaRegenBase = BASE_STAMINA_REGEN + staminaRegen + char.bonus.staminaRegen;
   let finalStaminaRegen = staminaRegenBase * (1 + staminaPercentRegen / 100);
   
   //console.error(`energyState.regenPerSecond, energyPercentRegen, getEnergyRegenMultiplier, getFoodDebuffMultiplier`, energyState.regenPerSecond, (1 + energyPercentRegen / 100), getEnergyRegenMultiplier(), getFoodDebuffMultiplier());
   
   //console.error("char.bonus.critBonus, crit", char.bonus.critBonus, crit);
   crit += char.bonus.critBonus;
   
   char.atkSpd = spd;
   char.crit = crit;
   char.critDmg = critDmg;
   char.lifeRegen = lifeRegen;
   char.lifeOnHit = lifeOnHit;
   char.dodge = dodge;
   char.blockPower = block / 100;
   char.penaltyAtkSpd = penaltyAtkSpd;
   char.baseCooldown = cooldownDuration;
   char.penaltyCooldown = penaltyCooldown;
   char.penaltyDmg = penaltyDmg;
   char.staminaRegen = finalStaminaRegen;
   char.dodgeCostReduce = dodgeCost / 100;
   char.moveCostReduce = moveCost / 100;
   char.perfectBlockEnergy = perfectBlockEnergy / 100;
   char.critEnergy = critEnergy / 100;
   //char.perfectWindowBonus = perfectWindowBonus / 100;
   char.magicFind = magicFind;
   char.goldFind = goldFind;
   char.vit = vit;
   char.str = str;
   char.agi = agi;
   char.resist = { 
     cold: coldRes,
     fire: fireRes,
     poison: poisonRes,
     magic: magicRes
   };
  
  saveGame();
}

function updateCombatAffixes(stat, slot, baseName) {
  const affixes = gameState.char.combatAffixes;
  
    if (!affixes[stat.id]) {
      affixes[stat.id] = {
          value: 0,
          sources: [],
          archetype: null,
          stat: null,
          discovered: false,
        };
    }

    affixes[stat.id].value += (+stat.value || 0);
    affixes[stat.id].archetype = stat.archetype;
    affixes[stat.id].stat = stat;
  
    affixes[stat.id].sources.push({
      slot,
      baseName,
      value: +stat.value || 0,
    });
}


function refreshCharacterStats() {
  const eq = gameState.char?.equipment || {};

  // przelicza HP / DMG / DEF itd
  calculateTotalStats(eq);

  // przelicza secondary stats
  updateCharacterViewStatsOnly(eq);
}

function renderStats() {
  const eq = gameState.char?.equipment || {};

  /*char.level = char.level || 1;
  char.experience = char.experience || 0;
  char.expToNextLevel = char.expToNextLevel || 125;*/

  const gold = gameState.resources.gold;
  //const impulses = gameState.resources.impulses;
  const impulses = gameState.expedition.meta.totalImpulses;
  const { maxHp, dmg, def, maxStamina } = calculateTotalStats(eq);
  //renderStaminaOrb(char.stamina, char.maxStami5na);
  //console.error(`gameState.resources.staminaState.max, maxStamina`, gameState.resources.staminaState.max, maxStamina);
  renderStaminaOrb(gameState.resources.staminaState.current, gameState.resources.staminaState.max);
  
  const char = gameState.char;

  /*const maxHp = char.maxHp;
  const dmg = char.dmg;
  const def = char.def;
  const maxStamina = gameState.resources.staminaState.max;*/
  
   // HP
  //document.getElementById("hp").innerText = maxHp;
  //setStatValue("hp", maxHp);
 // if (!combatState.previewStats) {
    const hp = gameState.char.hp;
    document.getElementById("hp-label").textContent = `${formatNumber(hp)} / ${formatNumber(maxHp)}`;
    
   // console.error(`char.hp in renderStats`, char.hp);
  
    const body = document.body;
    const hpOrb = document?.getElementById("hp-orb-fill");
    const orb = document.querySelector(".hp-orb");

    if (hpOrb && maxHp) {
      const percent = Math.min(100, Math.round(100 * hp / maxHp));
      //const percent = Math.max(0, hp / maxHp) * 100;
      //hpOrb.style.height = percent + "%";
      document.querySelector(".hp-orb .orb-liquid").style.height = percent + "%";
      //document.querySelector(".hp-orb .liquid-surface").style.height = percent + "%";
      orb.classList.toggle("full", percent >= 99);
      //orb.classList.toggle("low", percent < 30);
    
     if (percent < 30) {
       orb.classList.add("low");
        body.classList.add("low-hp");
      } else if (percent >= 35) {
       orb.classList.remove("low");
       body.classList.remove("low-hp");
      }

    }
//  }
  
  setStatValue("hp", maxHp);
  
  //LVL
  setStatValue("level", gameState.char.level);
  
  // DMG
  //document.getElementById("dmg").innerText = dmg;
  setStatValue("dmg", dmg);
  
  updateGlobalStatsColors();
  
  // updateSingleStatValue("dmg", dmg);
  
  // DEF
  //document.getElementById("def").innerText = formatNumber(def);
  setStatValue("def", def);
  //updateSingleStatValue("def", def);
  
  // Gold
  //document.getElementById("gold").innerText = formatNumber(gold);
  setStatValue("gold", gold);
  
  setStatValue("shards", impulses);
  
  //updateSingleStatValue("gold", parseInt(gold));
  
  // EXP
  const percent = Math.min(125, Math.round(100 * gameState.char.experience / gameState.char.expToNextLevel));
  document.getElementById("exp-bar").style.width = percent + "%";
  document.getElementById("exp-label").textContent = `${formatNumber(gameState.char.experience)} / ${formatNumber(gameState.char.expToNextLevel)}`;
  
  document.getElementById("player-level").textContent = gameState.char.level;

  // WEAPON MASTERY
  
  const masteryBar = document.getElementById("mastery-bar");
  if(masteryBar) {
    const style = getCurrentWeaponStyle();
    //console.error("style renderStats", style);
    
    if(style) {
      const mastery = gameState.char.weaponMastery[style];
      const masteryPercent = Math.min(125, Math.round(100 * mastery.exp / mastery.expToNext));

      //console.log(`RENDER STATS: ${style} Mastery Lv.${mastery.level}, Exp: ${mastery.exp}`);

      masteryBar.style.width = masteryPercent + "%";
      const masteryLabel = document.getElementById("mastery-label");
      masteryLabel.textContent = `${mastery.exp} / ${mastery.expToNext}`;
      document.getElementById("weapon-mastery").textContent = mastery.level;
    }
  }
  
  
  //console.error("RENDER STAMINA", gameState.resources.staminaState.max);
  
}

 function getGenderedClassLabel(klasa, baseName) {
  const endings = {
    'legendary': { m: 'Legendarny', ż: 'Legendarna', n: 'Legendarne' },
    'epic':      { m: 'Epicki', ż: 'Epicka', n: 'Epikie' },
    'unique':    { m: 'Unikalny', ż: 'Unikalna', n: 'Unikalne' },
    'rare':      { m: 'Rzadki', ż: 'Rzadka', n: 'Rzadkie' },
    'common':    { m: 'Zwykły', ż: 'Zwykła', n: 'Zwykłe' }
  };

  const gender = genderMap[t(baseName.toLowerCase())] || 'm'; // domyślnie męski
  const baseLabel = endings[klasa]?.[gender] || klasa;

  const formattedName = baseName.charAt(0).toUpperCase() + baseName.slice(1);
  return `${baseLabel} ${formattedName}`;
 }

  //const allTypes = ['Broń', 'Hełm', 'Zbroja', 'Naramiennik', 'Karwasze', 'Rękawice', 'Pas', 'Spodnie', 'Buty', 'Tarcza'];
  const allTypes = ['weapon', 'shield', 'armor', 'helmet', 'bracers', 'shoulder', 'belt', 'pants', 'boots', 'gloves'];
  /*const weaponTypes = ['Krótki Miecz', 'Długi Miecz', 'Topór', 'Młot', 'Buława'];
  const armorTypes = ['Kolczuga', 'Zbroja Skórzana', 'Zbroja Płytowa', 'Napierśnik'];
  const shieldTypes = ['Okrągła Tarcza', 'Puklerz', 'Kałkan', 'Tarcza Trójkątna'];*/
  
  const classLabels = {
    common: 'Zwykły',
    rare: 'Magiczny',
    unique: 'Unikalny',
    epic: 'Epicki',
    legendary: 'Legendarny'
  };

// ============================
// SLOW MOTION PRESETS
// ============================

/*function clearSlowMoFX() {
  document.body.classList.remove(
    "slowmo-alert",
    "slowmo-decision",
    "slowmo-impact"
  );
}*/

function applyTimeScaleVisual(scale = 1) {
  document.documentElement.style.setProperty(
    "--time-scale",
    scale
  );
}

function applySlowMoFX(className, scale, duration) {
  const body = document.body;
   
  body.classList.add(`focus-mode`);
  
  const realDuration = duration / scale;
  
  appState.focusFxActive = true;
  appState.focusFxUntil = getGameTime() + duration;
}

/*function slowMoAlert() {
  clearSlowMoFX();
  
  const scale = 0.5;
  const duration = 250;

  triggerSlowMo(scale, duration);
  applySlowMoFX("slowmo-alert", scale, duration);
}

function slowMoDecision() {
  clearSlowMoFX();
  
  const scale = 0.3;
  const duration = 350;

  triggerSlowMo(scale, duration);
  applySlowMoFX("slowmo-decision", scale, duration);
}

function slowMoImpact() {
  clearSlowMoFX();
  
  const scale = 0.15;
  const duration = 150;

  triggerSlowMo(scale, duration);
  applySlowMoFX("slowmo-impact", scale, duration);
}*/


function slowMoSkill(scale, duration) {

  applyTimeScaleVisual(scale);

  triggerSlowMo(scale, duration);
  applySlowMoFX("focus-slowmo", scale, duration);
}

function triggerSlowMo(scale = 0.45, duration = 700) {
  appState.timeScale = scale;
  appState.slowMoUntil = getGameTime() + duration;

  applyTimeScaleVisual(scale);
}

function triggerSlowMo(scale = 0.45, duration = 300) {
  const now = getGameTime();

  if (
    now < appState.slowMoUntil &&
    scale >= appState.timeScale
  ) return;

  appState.timeScale = scale;
  appState.slowMoUntil = now + duration;
}


function hitStop(duration = 50) {
  appState.hitStop = true;

  setTimeout(() => {
    appState.hitStop = false;
  }, duration);
}

let frameCount = 0;
let lastLog = performance.now();

function debugFPS(now) {
  frameCount++;
  if (now - lastLog >= 1000) {
    //console.log("FPS:", frameCount);
    frameCount = 0;
    lastLog = now;
  }
}

let gameLoopId = null;
let lastTime = 0;
let accumulator100ms = 0;
let uiAccumulator = 0;

function mainGameLoop(timestamp) {
  if (!appState.engineStarted) return;

  if (appState.hitStop) {
    requestAnimationFrame(mainGameLoop);
    return;
  }
  
  if (appState.isPaused) {
   lastTime = 0;
   requestAnimationFrame(mainGameLoop);
   return;
  }
  
  if (!lastTime) lastTime = timestamp;
  let delta = timestamp - lastTime;
  lastTime = timestamp;
  
  delta = Math.min(delta, 50); // anty alt-tab / freeze
  
  if (appState.gameTime < appState.slowMoUntil) {
    delta *= appState.timeScale;
  } else {
    appState.timeScale = 1;
  }  
  
  if (appState.focusFxActive && getGameTime() >= appState.focusFxUntil) {
    document.body.classList.remove("focus-mode");
   
    applyTimeScaleVisual(1);
    appState.focusFxActive = false;
  }
  
  appState.gameTime += delta;
  
  accumulator100ms += delta;
  uiAccumulator += delta;

  if (accumulator100ms >= 100) {
    globalGameTick();
    accumulator100ms -= 100;
  }

  // 🔥 LOGIKA – zostaje co frame
  updateEnemyAttack(delta);
   
  // 🔥 UI – max 30 FPS
  if (uiAccumulator >= 33) {
    updateStaminaOrb();
    updatePoiseBar();
    updatePoiseMarker();
    updateAbsoluteControl();
    updateShieldUI(timestamp);
    updateBlockState(timestamp);
    uiAccumulator = 0;
  }

  //debugFPS(timestamp);
  drainStamina(delta / 1000);
  applyDevensiveBlockRegen(delta / 1000);
  updatePoise(delta / 1000);
  updateBleed(delta / 1000); 
  updateArmorBreak(delta / 1000);
  
  if (gameState.world.mode === `expedition`) updateExpeditionRunTime();

  gameLoopId = requestAnimationFrame(mainGameLoop);
}

function startGlobalSystems() {
  //setInterval(globalGameTick, 100);
  requestAnimationFrame(mainGameLoop);
}

function globalGameTick() {
  staminaRegenTick();
  renderStamina();
  
  updateCombatBuff();
  
  updateEnergy();
  updateFoodState();
  updateCampfireState();

  const char = getCharacter();
  renderHpBar(char.hp, char.maxHp);
  updateFatigue();
}

function bootstrapGame() {
  //initializeGameState();
  //if(gameState.world.isStartNewGame) setStarterSet();
  if(gameState.world.isStartNewGame) {
    document.getElementById(`map-menu-btn`).classList.add('disabled');
  }
  startGlobalSystems();
  initGlobalUI();
}

function initGlobalUI() {
  initTooltipSystem();
}

function initTooltipSystem() {
  const tooltip = document.getElementById("stat-tooltip");
  const tooltipTitle = tooltip.querySelector(".stat-tooltip-title");
  const tooltipContent = tooltip.querySelector(".stat-tooltip-content");

  document.addEventListener("click", e => {
    const statBlock = e.target.closest(".extra-stat-block, .stat-block, .orb-container");
    
    //playSound(`open-slot`, 0.4);
        
    // klik poza statem → zamknij
    if (!statBlock) {
      tooltip.classList.add("hidden");
      return;
    }

    const key = statBlock.dataset.stat;
    const data = STAT_DESCRIPTIONS[key];
    if (!data) return;
        
    const player = getPlayerStats(key);
    
    tooltipTitle.textContent = t(data.title);
    //tooltipContent.innerHTML = data.desc;
        
    if (typeof data.desc === "function") {
      tooltipContent.innerHTML = data.desc(player);
    } else {
      tooltipContent.innerHTML = data.desc;
    }
        
    tooltip.classList.remove("hidden");

    // 🔧 najpierw pokaż, żeby znać wymiary
    const tooltipRect = tooltip.getBoundingClientRect();
    const statRect = statBlock.getBoundingClientRect();

    let left = statRect.left + statRect.width / 2 - tooltipRect.width / 2;
    let top = statRect.top - tooltipRect.height - 10;

    const margin = 8;

    // ⬅️ / ➡️ ekran
    if (left < margin) left = margin;
    if (left + tooltipRect.width > window.innerWidth - margin) {
      left = window.innerWidth - tooltipRect.width - margin;
    }

    // ⬆️ / ⬇️ ekran
    if (top < margin) {
      top = statRect.bottom + 10;
    }

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  });

}

/*document.addEventListener("DOMContentLoaded", () => {
  //console.warn(`init bootstrapGame`);
  //initializeGameState();
  //bootstrapGame();
});*/

/*document.addEventListener("DOMContentLoaded", () => {
    
    initializeGameState();
    //console.error("actioLock:", gameState.combat.actionLock.locked, gameState.combat.actionLock.until, gameState.combat.actionLock.reason,gameState.combat.actionLock.allowedActions);
    
    //restoreActionLock();
    document.querySelectorAll("[data-src]").forEach(img => {
         img.src = `${ASSET_BASE}${img.getAttribute("data-src")}`;
      });
    
    if(world.isFightMenuBlocked) {
      document.getElementById(`fight-menu-btn`).classList.add('disabled');
    }
    
   // console.error(`isLocationWithTown, getCurrentStep in shared`, isLocationWithTown(), world.currentStepIndex);
    
    if(isLocationWithTown() && world.currentStepIndex == 0) {
      world.isShopMenuBlocked = false;
      console.error(`isShopMenuBlocked in shared in if`, world.isShopMenuBlocked);
    }
    
    console.error(`isShopMenuBlocked in shared`, world.isShopMenuBlocked);
    
    if(world.isShopMenuBlocked) {
      document.getElementById(`shop-menu-btn`).classList.add('disabled');
    }
    
    restoreBuffsAfterReload();
    
    setInterval(() => {
      staminaRegenTick();
    }, 100);
    
    setInterval(renderStamina, 100);
    
    //loadFoodState();
    initCampfireState();
    restoreEnergyAfterLoad();
    
    setInterval(() => {
      updateEnergy();
      updateFoodState();
      updateCampfireState();
    }, 500);
    
    setInterval(() => {
      const char = getCharacter();
      renderHpBar(char.hp, char.maxHp);
      updateFatigue();
    }, 1000);
   
      //renderStats();
      //const char = getCharacter();
      initStamina();
      //initEnergyState();
    
      //loadDeathDebuff();
    
      const tooltip = document.getElementById("stat-tooltip");
      const tooltipTitle = tooltip.querySelector(".stat-tooltip-title");
      const tooltipContent = tooltip.querySelector(".stat-tooltip-content");

      document.addEventListener("click", e => {
        const statBlock = e.target.closest(".extra-stat-block, .stat-block, .orb-container");
        
        // klik poza statem → zamknij
        if (!statBlock) {
          tooltip.classList.add("hidden");
          return;
        }

        const key = statBlock.dataset.stat;
        const data = STAT_DESCRIPTIONS[key];
        if (!data) return;
        
        const player = getPlayerStats(key);
    
        tooltipTitle.textContent = data.title;
        //tooltipContent.innerHTML = data.desc;
        
        if (typeof data.desc === "function") {
          tooltipContent.innerHTML = data.desc(player);
        } else {
          tooltipContent.innerHTML = data.desc;
        }
        
        tooltip.classList.remove("hidden");

        // 🔧 najpierw pokaż, żeby znać wymiary
        const tooltipRect = tooltip.getBoundingClientRect();
        const statRect = statBlock.getBoundingClientRect();

        let left = statRect.left + statRect.width / 2 - tooltipRect.width / 2;
        let top = statRect.top - tooltipRect.height - 10;

        const margin = 8;

        // ⬅️ / ➡️ ekran
        if (left < margin) left = margin;
        if (left + tooltipRect.width > window.innerWidth - margin) {
          left = window.innerWidth - tooltipRect.width - margin;
        }

        // ⬆️ / ⬇️ ekran
        if (top < margin) {
          top = statRect.bottom + 10;
        }

        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
      });
    
    
      
    });*/
