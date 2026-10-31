
const shrineBase = [
  {
    id: 'life-shrine',
    name: 'life_shrine',
    type: 'heal', 
    bonusAmount: 100,
    sprite: 'shrine-life.png'
  },
  {
    id: 'power-shrine',
    name: 'might_shrine',
    type: 'attack',
    bonusAmount: 30,
    sprite: 'shrine-power.png'
  },
  { 
    id: 'protect-shrine',
    name: 'protect_shrine',
    type: 'defense',
    bonusAmount: 40,
    sprite: 'shrine-protect.png'
  }
];

function pickRandomShrine() {
  const idx = Math.floor(Math.random() * shrineBase.length);
  return JSON.parse(JSON.stringify(shrineBase[idx]));
}

const shrineBonusPool = {
  dmg: [
    { stat: "critChance", value: 0.10, hits: 2 },
    { stat: "critDmg", value: 0.20, hits: 2 },
    { stat: "armorPen", value: 0.20, hits: 2 },
    { stat: "atkSpeed", value: 0.10, durationSec: 2 }
  ],

  def: [
    { stat: "blockWindow", value: 0.15, hits: 2 },
    { stat: "damageReduction", value: 0.30, hits: 1 },
    { stat: "freeBlock", value: 1 },
    { stat: "staminaRegen", value: 0.2, durationSec: 3 }
  ],

  hp: [
    { stat: "def", value: 0.2, hits: 1 },
    { stat: "dmg", value: 0.15, hits: 1 },
    { stat: "freePotion", value: 1 },
    { stat: "critImmunity", hits: 1 }
  ]
};

const chestBase = [
  {
    id: 'wood',
    name: 'wood_chest',
    type: 'wood', 
    maxItems: 3,
    maxRarity: "rare",
    sprite: 'wood-chest.png'
  },
  {
    id: 'iron',
    name: 'iron_chest',
    type: 'iron',
    maxItems: 4,
    maxRarity: "unique",
    sprite: 'iron-chest.png'
  },
  { 
    id: 'silver',
    name: 'Srebrna Skrzynia',
    type: 'silver',
    maxItems: 5,
    maxRarity: "epic",
    sprite: 'silver-chest.png'
  },
  { 
    id: 'gold',
    name: 'Złota Skrzynia',
    type: 'gold',
    maxItems: 6,
    maxRarity: "legendary",
    sprite: 'gold-chest.png'
  }
];

function getRandomChest() {
  // wagi przypisane do typu skrzyni
  const weights = {
    wood: 60,
    iron: 40,
    silver: 0,
    gold: 0
  };

  // sumujemy wszystkie wagi
  const totalWeight = chestBase.reduce((sum, chest) => sum + weights[chest.type], 0);

  // losujemy wartość z zakresu [0, totalWeight)
  let random = Math.random() * totalWeight;

  // iterujemy po skrzyniach i sprawdzamy do której "przedziału" trafił los
  for (const chest of chestBase) {
    random -= weights[chest.type];
    if (random < 0) {
      return chest;
    }
  }
}

// ile złota może wypaść z danej skrzyni
const chestGoldRange = {
  wood:   [20, 35],
  iron:   [50, 70],
  silver: [200, 350],
  gold:   [500, 800],
};

function getGoldBoost() {
  const goldFind = gameState.char?.equipment
    ? Object.values(gameState.char.equipment)
      .flatMap(item => item?.statystyki || [])
      .filter(stat => stat.id === "gold_find")
      .reduce((sum, stat) => sum + parseFloat(stat.wartosc || 0), 0)
    : 0;

  // np. 100% goldFind = x2 złota
  const goldBoost = 1 + goldFind / 100;
 // console.log("goldFind bonus:", goldFind, " → goldBoost:", goldBoost);
  return goldBoost;
}

function rollGoldForChest(type) {
  const [min, max] = chestGoldRange[type] || [5, 15];
  const base = Math.floor(Math.random() * (max - min + 1)) + min;
  const goldBoost = getGoldBoost();
  const scaled = Math.floor(base * goldBoost);
  //console.log(`Chest gold (${type}): base=${base}, goldBoost=${goldBoost}, final=${scaled}`);
  return scaled;
}

// bazowe widełki złota
const baseGoldDrop = { min: 5, max: 15 };

// mnożniki dla rodzajów wrogów
const enemyGoldMultipliers = {
  normal: 1.0,
  mini_boss: 5.0,
  boss: 10.0
};

// skalowanie z poziomem wroga (np. +10% za każdy poziom)
function getLevelGoldMultiplier(level) {
  return 1 + (level - 1) * 0.25; // 1.0 na lvl 1, 1.1 na lvl 2 itd.
}

function getGoldForEnemy(enemy) {
  const base = Math.floor(
    Math.random() * (baseGoldDrop.max - baseGoldDrop.min + 1)
  ) + baseGoldDrop.min;

  const typeMult = enemyGoldMultipliers[enemy.type] || 1.0;
  const levelMult = getLevelGoldMultiplier(enemy.level);

  const goldBoost = getGoldBoost();
  const gold = Math.floor(base * typeMult * levelMult * goldBoost);

 /* console.log("Enemy gold drop:", {
    base,
    type: enemy.type,
    typeMult,
    level: enemy.level,
    levelMult,
    goldBoost,
    final: gold
  });*/

  return gold;
}

// bazowe widełki doświadczenia
const baseExpDrop = { min: 15, max: 25 };

// mnożniki dla rodzajów wrogów
const enemyExpMultipliers = {
  normal: 1.0,
  elite: 2.5,
  mini_boss: 5.0,
  boss: 10.0
};

// skalowanie z poziomem wroga (np. +20% za każdy poziom)
function getLevelExpMultiplier(level) {
  return 1 + (level - 1) * 0.15; 
}

function getExpForEnemy(enemy) {
  const roll = getRandomFloat(0.9, 1.1); // max ±10%
  /*const base = Math.floor(
    Math.random() * (baseExpDrop.max - baseExpDrop.min + 1)
  ) + baseExpDrop.min;*/

  const base = enemy.baseExp * roll;
  
  const typeMult = enemyExpMultipliers[enemy.type] || 1.0;
  const levelMult = getLevelExpMultiplier(enemy.level);

  //const expBoost = getExpBoost();
  const exp = Math.floor(base * typeMult * levelMult);
  
  return exp;
}
