/* =====================================================
   SHOP 2.0
   smart shop generator
   weapons / armors / others / special
===================================================== */

function generateShop2(){

  const shop = {
    weapons: Array(16).fill(null),
    armors: Array(16).fill(null),
    others: Array(16).fill(null),
    fourth: Array(16).fill(null)
  };

  gameState.resources.shopItems = shop;

  fillWeaponsShop2();
  fillArmorShop2();
  fillOtherShop2();
  fillSpecialShop2();
}

/* =====================================================
   CORE HELPERS
===================================================== */

function rand(min,max){
  return Math.floor(Math.random()*(max-min+1))+min;
}

function pick(arr){
  return arr[Math.floor(Math.random()*arr.length)];
}

function shuffle(arr){
  return [...arr].sort(()=>Math.random()-0.5);
}

function getPlayerLevel(){
  return gameState.char?.level || 1;
}

function getPlayerEq(){
  return gameState.char?.equipment || {};
}

/* =====================================================
   RARITY BY LEVEL
===================================================== */

function getShopRarityByLevel(level){

  let table;

  if(level <= 5){
    table = [
      ["common",70],
      ["rare",25],
      ["unique",5]
    ];
  }

  else if(level <= 12){
    table = [
      ["common",50],
      ["rare",35],
      ["unique",12],
      ["epic",3]
    ];
  }

  else if(level <= 20){
    table = [
      ["common",35],
      ["rare",35],
      ["unique",18],
      ["epic",10],
      ["legendary",2]
    ];
  }

  else{
    table = [
      ["common",20],
      ["rare",30],
      ["unique",25],
      ["epic",18],
      ["legendary",7]
    ];
  }

  const roll = Math.random()*100;
  let sum = 0;

  for(const [rarity,chance] of table){
    sum += chance;
    if(roll <= sum) return rarity;
  }

  return "common";
}

/* =====================================================
   BUILD READING
===================================================== */

function getPreferredWeaponSubtype(){

  const eq = getPlayerEq();
  const weapon = eq["Broń"];

  if(!weapon) return null;

  return weapon.baseName || null;
}

function getMissingArmorSlots(){

  const eq = getPlayerEq();

  const slots = [
    "Hełm",
    "Naramiennik",
    "Zbroja",
    "Karwasze",
    "Rękawice",
    "Pas",
    "Spodnie",
    "Buty",
    "Tarcza"
  ];

  return slots.filter(s => !eq[s]);
}

/* =====================================================
   WEAPONS
===================================================== */

function fillWeaponsShop2(){

  const level = getPlayerLevel();

  const subtypes = [
    "Krótki Miecz",
    "Buława",
    "Topór",
    "Długi Miecz",
    "Wielki Miecz",
    "Podwójny Topór",
    "Włócznia",
    "Młot"
  ];

  const items = [];
  const preferred = getPreferredWeaponSubtype();

  while(items.length < 16){

    let subtype;

    if(preferred && Math.random() < 0.35){
      subtype = preferred;
    }else{
      subtype = pick(subtypes);
    }

    const rarity = getShopRarityByLevel(level);

    const item = generateItem({
      forceType: "Broń",
      forceSubtype: subtype,
      forceRarity: rarity,
      forceLevel: getRandomShopItemLevel(level),
      isShopItems: true
    });

    if(item) items.push(item);
  }

  gameState.resources.shopItems.weapons = items;
}

/* =====================================================
   ARMORS
===================================================== */

function fillArmorShop2(){

  const level = getPlayerLevel();

  const armorTypes = [
    "Hełm",
    "Naramiennik",
    "Zbroja",
    "Karwasze",
    "Rękawice",
    "Pas",
    "Spodnie",
    "Buty",
    "Tarcza"
  ];

  const missing = getMissingArmorSlots();

  const items = [];

  while(items.length < 16){

    let subtype;

    if(missing.length && Math.random() < 0.45){
      subtype = pick(missing);
    }else{
      subtype = pick(armorTypes);
    }

    const rarity = getShopRarityByLevel(level);

    const mainType = subtype === "Tarcza" ? "Tarcza" : "Zbroja";

    const item = generateItem({
      forceType: mainType,
      forceSubtype: subtype,
      forceRarity: rarity,
      forceLevel: getRandomShopItemLevel(level),
      isShopItems: true
    });

    if(item) items.push(item);
  }

  gameState.resources.shopItems.armors = items;
}

/* =====================================================
   OTHERS
===================================================== */

function fillOtherShop2(){

  const arr = [];

  arr.push(makeSmallHealPotion(getPlayerLevel()));
  arr.push(makeSmallHealPotion(getPlayerLevel()));
  arr.push(makeSmallHealPotion(getPlayerLevel()));

  arr.push(makeLightFoodItem());
  arr.push(makeLightFoodItem());

  arr.push({
    name:"Mikstura Energii",
    typ:"Consumable",
    price:300
  });

  arr.push({
    name:"Zwój Powrotu",
    typ:"Consumable",
    price:500
  });

  while(arr.length < 16){
    arr.push(null);
  }

  gameState.resources.shopItems.others = arr.slice(0,16);
}

/* =====================================================
   SPECIAL TAB
===================================================== */

function fillSpecialShop2(){

  const level = getPlayerLevel();

  const arr = [];

  arr.push(makeChestOffer("Silver Chest", 3000));
  arr.push(makeChestOffer("Golden Chest", 12000));
  arr.push(makeChestOffer("Platinum Chest", 40000));

  arr.push(makeKeyOffer());

  if(level >= 10){
    arr.push(makePremiumEpic(level));
  }

  if(level >= 18){
    arr.push(makePremiumLegendaryToken());
  }

  while(arr.length < 16){
    arr.push(null);
  }

  gameState.resources.shopItems.fourth = arr.slice(0,16);
}

/* =====================================================
   SPECIAL ITEMS
===================================================== */

function makeChestOffer(name,price){
  return {
    name:name,
    typ:"Chest",
    price:price
  };
}

function makeKeyOffer(){
  return {
    name:"Ancient Key",
    typ:"Key",
    price:2500
  };
}

function makePremiumEpic(level){

  const item = generateItem({
    forceRarity:"epic",
    forceLevel:level,
    isShopItems:true
  });

  item.priceMultiplier = 3;

  return item;
}

function makePremiumLegendaryToken(){
  return {
    name:"Legendary Fragment",
    typ:"Currency",
    price:25000
  };
}

/* =====================================================
   REFRESH SHOP
===================================================== */

function refreshShopGold(){

  const cost = 2500;

  if(gameState.resources.gold < cost){
    showInfoAlert("Za mało złota",1500,true);
    return;
  }

  gameState.resources.gold -= cost;

  generateShop2();

  showInfoAlert("Odświeżono sklep",1500,true);
}

/* =====================================================
   AUTO DAILY ROTATION
===================================================== */

function generateShopForCity(){
  generateShop2();
}