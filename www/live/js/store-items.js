// proste ID (przydaje się w Twoich remove/find po _id)
function makeId() {
  return "itm_" + Math.random().toString(36).slice(2, 10) + "_" + Date.now();
}

/**
 * Tworzy ręcznie wymuszony przedmiot zgodny ze schematem.
 * NIC nie losuje – wszystko bierze z parametrów lub sensownych defaultów.
 */
function createManualItem({
  typ,              // 'Broń' | 'Zbroja' | 'Tarcza' | ...
  baseName,         // np. 'Krótki Miecz'
  prefixId,
  suffixId,
  legendId,
  klasa = 'common', // 'common' | 'rare' | 'unique' | 'epic' | 'legendary'
  level = 1,
  requiredLevel,    // domyślnie = level
  sprite,
  nazwa,            // jeśli nie podasz, użyje baseName
  twoHanded = false,
  // staty – podaj te, które mają sens dla typu
  itemTypeKey,
  style,
  dmg,              // number
  speed,            // number
  armor,            // number
  block,            // number (dla tarcz)
  heal,
  regen,
  cooldown,
  wartosc,           // jeśli nie podasz, weźmie z defaultValueByRarity
  questId
} = {}) {

  let implicit = null;
  if(itemTypeKey) {
    const rarityMultiplier = {
      common: 1,
      rare: 1.2,
      unique: 1.35,
      epic: 1.6,
      legendary: 2
    }[klasa];
  
    const implicitResult = getImplicitBonus({itemTypeKey, itemLevel: level, rarityMultiplier});
    implicit = implicitResult.implicit;
  }  
  
     
  const item = {
    _id: makeId(),
    rarity: klasa,
    nazwa: nazwa || baseName,
    baseName: baseName,
    nameData: {
      base: baseName,
      prefix: prefixId,      
      suffix: suffixId,     
      legend: legendId || null
    },
    typ: typ,
    klasa: klasa,
    twoHanded: !!twoHanded,
    baseBonus: implicit,
    style: WEAPON_STYLES[style],
    statystyki: [],
    wartosc: (typeof wartosc === "number" ? wartosc : (defaultValueByRarity[klasa] ?? 6)),
    level: level,
    requiredLevel: (typeof requiredLevel === "number" ? requiredLevel : level),
    sprite: sprite,
    questId: questId
  };

  // Zbuduj statystyki tylko z tego, co podasz
  if (typ === 'weapon') {
    if (typeof dmg === "number") item.statystyki.push({ id: 'damage', value: dmg });
    if (typeof speed === "number") item.statystyki.push({ id: 'attack_speed', value: speed });
  } else if (typ === 'shield') {
    if (typeof armor === "number") item.statystyki.push({ id: 'armor', value: armor });
    if (typeof block === "number")  item.statystyki.push({ id: 'block',  value: block });
  } else {
    // Zbroja/Hełm/Buty itd.
    if (typeof armor === "number") item.statystyki.push({ id: 'armor', value: armor });
    if (typeof heal === "number") item.statystyki.push({ id: 'heal_percent', value: heal });
    if (typeof regen === "number") item.statystyki.push({ id: 'energy_flat', value: regen });
    if (typeof cooldown === "number") item.statystyki.push({ id: 'energy_meal_cooldown', value: cooldown });
  }

  return item;
}

function createManualItemWithBonuses({
  typ,              
  baseName,
  prefixId,
  suffixId,
  legendId,
  klasa = 'common',
  level = 1,
  requiredLevel,
  sprite,
  nazwa,
  twoHanded = false,
  style,
  itemTypeKey,
  dmg,
  speed,
  armor,
  block,
  heal,
  regen,
  cooldown,
  wartosc,
  
  questId,
  
  manualBonuses = [],   // ← Twoje własne bonusy
  autoBonuses = false   // ← Czy dodać losowe bonusy wg klasy
} = {}) {

  let implicit = null;
  if(itemTypeKey) {
    const rarityMultiplier = {
      common: 1,
      rare: 1.2,
      unique: 1.35,
      epic: 1.6,
      legendary: 2
    }[klasa];
  
    const implicitResult = getImplicitBonus({itemTypeKey, itemLevel: level, rarityMultiplier});
    implicit = implicitResult.implicit;
  }  
  
  const item = {
    _id: makeId(),
    rarity: klasa,
    nazwa: nazwa || baseName,
    baseName: baseName,
    nameData: {
      base: baseName,
      prefix: prefixId,      
      suffix: suffixId,     
      legend: legendId || null
    },
    typ: typ,
    klasa: klasa,
    twoHanded: !!twoHanded,
    style: WEAPON_STYLES[style],
    baseBonus: implicit,
    statystyki: [],
    wartosc: (typeof wartosc === "number" ? wartosc : (defaultValueByRarity[klasa] ?? 6)),
    level: level,
    requiredLevel: (typeof requiredLevel === "number" ? requiredLevel : level),
    sprite: sprite,
    questId: questId
  };

  // Podstawowe staty
  if (typ === 'weapon') {
    if (typeof dmg === "number") item.statystyki.push({ id: 'damage', value: dmg });
    if (typeof speed === "number") item.statystyki.push({ id: 'attack_speed', value: speed });
  } else if (typ === 'shield') {
    if (typeof armor === "number") item.statystyki.push({ id: 'armor', value: armor });
    if (typeof block === "number") item.statystyki.push({ id: 'block', value: block });
  } else {
    if (typeof armor === "number") item.statystyki.push({ id: 'armor', value: armor });
    if (typeof heal === "number") item.statystyki.push({ id: 'heal_percent', value: heal });
    if (typeof regen === "number") item.statystyki.push({ id: 'energy_flat', value: regen });
    if (typeof cooldown === "number") item.statystyki.push({ id: 'energy_meal_cooldown', value: cooldown });
  }

  // -----------------------
  // 🔥 1. RĘCZNE BONUSY
  // -----------------------
  if (manualBonuses.length > 0) {
    manualBonuses.forEach(b => {
      item.statystyki.push({ id: b.id, value: b.value });
    });
  }
  
  // -----------------------
  // 🔥 2. AUTOMATYCZNE BONUSY
  // -----------------------
  if (autoBonuses) {
    // użyj systemu jak w generateItem()
    const { bonusy } = getRandomBonus(
      klasa,         // rarity
      1,             // multiplier nie jest potrzebny dla ręcznych itemów
      level,
      typ,
      dmg || 0,
      armor || 0,
      speed || 1,
      block || 0
    );

    item.statystyki.push(...bonusy);
  }

  return item;
}

function makeShortSwordUnique(){
   return createManualItemWithBonuses({
     typ: "weapon",
     baseName: "short_sword",
     prefx: "prefix_ominous",
     klasa: "unique",
     level: 2,
     sprite: 'short-sword.png',
     twoHanded: false,
     style: `sword`,
     dmg: 5,
     speed: 0.85,
     itemTypeKey: `weapon`,
     manualBonuses: [
       { nazwa: "damage_percent", wartosc: 12 },
       { nazwa: "strength", wartosc: 2 }
     ],
     wartosc: 18
   });
}

function makeHelmetRare(){
   return createManualItemWithBonuses({
     typ: "helmet",
     baseName: "helmet",
     prefx: "prefix_ominous",
     klasa: "rare",
     level: 1,
     sprite: 'helmet.png',
     armor: 4,
     itemTypeKey: `helmet`,
     autoBonuses: true,
     wartosc: 10
   });
}



/*function makeQuestCaptainsFeatherItem() {
  return createManualItem({
    typ: 'Inne',
    baseName: 'Pióro Kapitana Elwena',
    klasa: 'special',
    level: 1,
    sprite: 'captain-feather.png',
    wartosc: 0
  });
}*/

//FOOD

function makeLightFoodItem() {
  return createManualItem({
    typ: 'meal',
    baseName: 'bread',
    klasa: 'rare',
    level: 1,
    regen: 20,
    cooldown: 6,
    sprite: 'bread.png',
    wartosc: 36,
  });
}


function makeShortSwordCommon() {
  return createManualItem({
    typ: 'weapon',
    baseName: 'short_sword',
    klasa: 'common',
    level: 1,
    sprite: 'short-sword.png',
    twoHanded: false,
    style: `sword`,
    dmg: 3,
    speed: 0.7,
    itemTypeKey: `weapon`,
    wartosc: 6 // możesz pominąć – i tak weźmie 6 z defaultów dla common
  });
}

// 🔧 Kilka gotowych presetów (opcjonalnie)
function makeBucklerCommon() {
  return createManualItem({
    typ: 'shield',
    baseName: 'round_shield',
    klasa: 'common',
    level: 1,
    sprite: 'round-shield.png',
    armor: 3,
    block: 18,
    itemTypeKey: `shield`,
    wartosc: 6
  });
}

function makeSmallHealPotion(level = 1) {
  return createManualItem({
    typ: 'heal_potion',
    baseName: 'heal_potion',
    klasa: 'common',
    level: 1,
    sprite: 'medium-heal-potion.png',
    quantity: 1,
    maxStack: 3,
    stackIndex: null,
    heal: 60,
    wartosc: 12 * level * 0.6
  });
}


