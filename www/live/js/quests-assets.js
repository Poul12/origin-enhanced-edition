const CAPTAINS_FEATHER = makeQuestCaptainsFeatherItem();
const RUNIC_STONE = makeQuestRunicStoneItem();
const SHORT_SWORD = makeRewardShortSwordCommon();
const BREASTPLATE = makeRewardBreastplateUnique();
const LIBRARIES_KEY = makeQuestMaelorKeyItem();
const OLD_CHRONICLE = makeQuestOldChronicleItem();
const FRAGMENT_OF_NORTH_MAP_N = makeQuestFragmentOfNorthNMapItem();
const FRAGMENT_OF_NORTH_MAP_S = makeQuestFragmentOfNorthSMapItem();
const FRAGMENT_OF_NORTH_MAP_E = makeQuestFragmentOfNorthEMapItem();
const NORTH_MAP = makeQuestNorthMapItem();
const RIVERS_TOTEM = makeQuestRiversTotemItem();
const NORTH_MAP_XMARK = makeQuestNorthMapXMarkItem();


const STORY_EVENT_ENEMIES = {
  "mystical_stone": {
    id: "runestone_guardian",
    name: "runic_stone_guardian",
    sprite: "runestone-guardian.png",
    level: 32,
    maxHp: 2500,
    dmg: 110,
    def: 1600,
    atkSpd: 0.30,
    baseExp: 6,
    type: "elite",
    questId: "mystical_stone",
    reward: { item: RUNIC_STONE }
  },
  "lost_feather": {
    id: "thief",
    name: "enemy_thief",
    sprite: "thief.png",
    level: 3,
    maxHp: 269,
    dmg: 22,
    def: 154,
    atkSpd: 0.47,
    baseExp: 23,
    type: "normal",
    questId: "lost_feather",
    skills: [
      {
         id: "backstab",
         level: 1
      },
    ]
  },

  "lost_boxes": {
    id: "thief_chieftain",
    name: "thief_cheftain",
    sprite: "thief-cheftain.png",
    level: 7,
    maxHp: 780,
    dmg: 47,
    def: 569,
    atkSpd: 0.4,
    baseExp: 20,
    type: "elite",
    questId: "lost_boxes",
    skills: [
      {
         id: "dirty-tricks",
         level: 4
      },
      {
         id: "shadow-strike",
         level: 4
      },
      {
         id: "smoke-bomb",
         level: 4
      },
    ],
  },
  "poisoned_water": {
    id: "bandit_cheftain",
    name: "bandit_cheftain",
    sprite: "bandit-cheftain.png",
    level: 9,
    maxHp: 1470,
    dmg: 78,
    def: 1245,
    atkSpd: 0.42,
    baseExp: 33,
    type: "elite",
    questId: "poisoned_water",
    skills: [
      {
         id: "brutal-strike",
         level: 4
      },
      {
         id: "leg-sweep",
         level: 5
      },
      {
         id: "rallying-cry",
         level: 6
      },
    ],

  },
  "alpha_shadow": {
    id: "alpha_wolf",
    name: "Wilk Alfa",
    sprite: "alpha-wolf.png",
    level: 12,
    maxHp: 2360,
    dmg: 132,
    def: 1560,
    atkSpd: 0.4,
    baseExp: 60,
    type: "mini_boss",
    questId: "alpha_shadow"
  },
  "debt_in_steel": {
    id: "brenon",
    name: "Brenon Silnoręki",
    sprite: "brenon.png",
    level: 6,
    maxHp: 12,
    dmg: 5,
    def: 12,
    atkSpd: 0.4,
    baseExp: 40,
    type: "elite",
    questId: "debt_in_steel"
  },
  "shadows_beyond": {
    id: "cursed_guard",
    name: "Opętany Strażnik",
    sprite: "cursed-guard.png",
    level: 9,
    maxHp: 1330,
    dmg: 124,
    def: 1450,
    atkSpd: 0.6,
    baseExp: 75,
    type: "elite",
    questId: "shadows_beyond"
  },
  "stolen_totem": {
    id: "savages_leader",
    name: "Wódz Dzikusów",
    sprite: "savages-leader.png",
    level: 8,
    maxHp: 12,
    dmg: 23,
    def: 12,
    atkSpd: 0.40,
    baseExp: 50,
    type: "elite",
    questId: "stolen_totem",
    reward: { item: RIVERS_TOTEM }
  },
  "disturbed_in_forest": {
    id: "dark_guard",
    name: "Mroczny Strażnik",
    sprite: "dark-guard.png",
    level: 12,
    maxHp: 12,
    dmg: 23,
    def: 12,
    atkSpd: 0.40,
    baseExp: 80,
    type: "elite",
    questId: "disturbed_in_forest"
  },
  "spider_web": {
    id: "queen_spider",
    name: "Matka Pająków",
    sprite: "queen-spider.png",
    level: 15,
    maxHp: 12,
    dmg: 5,
    def: 12,
    atkSpd: 0.4,
    baseExp: 200,
    type: "mini_boss",
    questId: "spider_web"
  },

  
};



const STORY_CONTROLLER = {
  "elmaris_port": {
    forcedSteps: {
      0: { type: "npc_all" }, // cały krok to NPC
    },
    
    storyInjections: {
      8: {
        slot: "random",
        inject: { 
          type: "story_event", 
          id: "lost_boxes",
          sprite:"lost-boxes-elmaris.png"
        }
      }
    },

    storyEnemies: {
      // krok 4: wróg który dropi Pióro
      4: {
        questId: "lost_feather",
        enemyId: "thief",
        guaranteedDrop: CAPTAINS_FEATHER
      }
    },
    finalStep: "normal"
  },

  "thalorn_village": {
    forcedSteps: {
      0: { type: "npc_all" }
    },
    storyAllEnemies: {
      // krok 6 → wszystkie 4 sloty = bandit
      6: { enemyId: "bandit" }
    },
    storyInjections: {
      3: {
        slot: "1",
        inject: { 
          type: "story_event", 
          id: "mystical_stone",
          sprite:"mystical-stone-thalorn2.png",
          reward: RUNIC_STONE
        }
      },
       6: {
        slot: "2",
        inject: { 
          type: "story_event", 
          id: "poisoned_water",
          sprite:"poisoned-water-thalorn.png",
        }
      }
    },
    finalStep: "normal"
  },
  
  "reapers_road": {
    forcedSteps: {
      0: { type: "enemy_all" }
    },
    storyInjections: {
      1: { 
        slot: "random",
        inject: { 
          type: "npc", 
          id: "lyrien" 
        }
      },
      4: {
        slot: "random",
        inject: { 
          type: "story_event", 
          id: "alpha_shadow",
          sprite:"alpha-shadow-dear-reaperroad.png"
        }
      },
      9: {
        slot: "1",
        inject: { 
          type: "story_event", 
          id: "alpha_shadow",
          sprite: "alpha-shadow-cave-reaperroad.png",
          miniboss: true,
          minibossId: "alpha_wolf_miniboss"
        }
      }
    },
    finalStep: "mini_boss"
  },
  
    
  "lirwen_fort": {
    forcedSteps: {
      0: { type: "npc_all" }, 
    },
    storyEnemies: {
      3: {
        questId: "shadows_beyond",
        enemyId: "cursed_guard"
      },
      5: {
        questId: "shadows_beyond",
        enemyId: "cursed_guard",
      },
      7: {
        questId: "shadows_beyond",
        enemyId: "cursed_guard",
      }
    },
    storyInjections: {
      6: { 
        slot: "2",
        inject: { 
          type: "story_event", 
          id: "debt_in_steel",
          sprite: "debt-in-steel-lirwen.png"          
        }
      },
       8: { 
        slot: "random",
        inject: { 
          type: "story_event", 
          id: "libraries_key",
          sprite: "libraries_key-lirwen.png",
          reward: LIBRARIES_KEY
        }
      }
    },
    finalStep: "normal"
  },
  
  
  "green_pass": {
    forcedSteps: {
      0: { type: "enemy_all" }
    },
    storyInjections: {
      0: { 
        slot: "random",
        inject: { 
          type: "npc", 
          id: "rellian" 
        }
      },
      2: { 
        slot: "random",
        inject: { 
          type: "npc", 
          id: "erydne" 
        }
      },
      8: {
        slot: "2",
        inject: { 
          type: "story_event", 
          id: "stolen_totem",
          sprite:"stolen-totem-greenpass.png",
          reward: RIVERS_TOTEM
        }
      },
     },
    storyEnemies: {
      4: {
        questId: "scattered_map",
        guaranteedDrop: FRAGMENT_OF_NORTH_MAP_S
      },
      6: {
        questId: "scattered_map",
        guaranteedDrop: FRAGMENT_OF_NORTH_MAP_E
      },
      9: {
        questId: "scattered_map",
        guaranteedDrop: FRAGMENT_OF_NORTH_MAP_N
      }
    },

    finalStep: "normal"
  },
  
  
   "whispering_trees": {
    forcedSteps: {
      0: { type: "enemy_all" }
    },
    storyInjections: {
      1: { 
        slot: "random",
        inject: { 
          type: "npc", 
          id: "malik" 
        }
      },
      3: { 
        slot: "random",
        inject: { 
          type: "npc", 
          id: "whisperer" 
        }
      },
      5: {
        slot: "random",
        inject: { 
          type: "story_event", 
          id: "spider_web",
          sprite:"spider-web-queenstrace-whispering-trees.png"
        }
      },
      7: {
        slot: "1",
        inject: { 
          type: "story_event", 
          id: "disturbed_in_forest",
          sprite:"disturbed-in-forest-whispering-trees.png"
        }
      },
      9: {
        slot: "1",
        inject: { 
          type: "story_event", 
          id: "spider_web",
          sprite: "spider-web-cave-whispering-trees.png",
          miniboss: true,
          minibossId: "queen_spider_miniboss"
        }
      }
    },
     finalStep: "mini_boss"
  }
  

};

function makeQuestNorthMapXMarkItem() {
  return createManualItem({
    typ: 'map',
    nazwa: 'north_map_final',
    baseName: 'north_map_final',
    klasa: 'special',
    level: 1,
    sprite: 'north-map-xmark.png',
    wartosc: 0,
    questId: 'disturbed_in_forest'
  });
}


function makeQuestRiversTotemItem() {
  return createManualItem({
    typ: 'totem',
    nazwa: 'river_totem',
    baseName: 'river_totem',
    klasa: 'special',
    level: 1,
    sprite: 'rivers-totem.png',
    wartosc: 0,
    questId: 'stolen_totem'
  });
}

function makeQuestNorthMapItem() {
  return createManualItem({
    typ: 'map',
    nazwa: 'north_map',
    baseName: 'north_map',
    klasa: 'special',
    level: 1,
    sprite: 'north-map.png',
    wartosc: 0,
    questId: 'scattered_map'
  });
}

function makeQuestFragmentOfNorthEMapItem() {
  return createManualItem({
    typ: 'map_fragment',
    nazwa: 'map_fragment',
    baseName: 'map_fragment',
    klasa: 'special',
    level: 1,
    sprite: 'fragment-of-map-e.png',
    wartosc: 0,
    questId: 'scattered_map'
  });
}


function makeQuestFragmentOfNorthSMapItem() {
  return createManualItem({
    typ: 'map_fragment',
    nazwa: 'map_fragment',
    baseName: 'map_fragment',
    klasa: 'special',
    level: 1,
    sprite: 'fragment-of-map-s.png',
    wartosc: 0,
    questId: 'scattered_map'
  });
}


function makeQuestFragmentOfNorthNMapItem() {
  return createManualItem({
    typ: 'map_fragment',
    nazwa: 'map_fragment',
    baseName: 'map_fragment',
    klasa: 'special',
    level: 1,
    sprite: 'fragment-of-map-n.png',
    wartosc: 0,
    questId: 'scattered_map'
  });
}

function makeQuestOldChronicleItem() {
  return createManualItem({
    typ: 'chronicles',
    nazwa: 'old_chronicles',
    baseName: 'old_chronicles',
    klasa: 'special',
    level: 1,
    sprite: 'old-chronicle.png',
    wartosc: 0,
    questId: 'libraries_key'
  });
}

function makeQuestMaelorKeyItem() {
  return createManualItem({
    typ: 'key',
    nazwa: 'library_key',
    baseName: 'library_key',
    klasa: 'special',
    level: 1,
    sprite: 'maelor-key.png',
    wartosc: 0,
    questId: 'libraries_key'
  });
}


function makeRewardBreastplateUnique() {
  return createManualItemWithBonuses({
    typ: 'armor',
    baseName: 'plate_armor',
    klasa: 'unique',
    level: 7,
    sprite: 'plate-armor.png',
    twoHanded: false,
    armor: 15,
    itemTypeKey: `armor`,
    manualBonuses: [
      { id: "armor_percent", value: 27 },
      { id: "strength", value: 3 },
      { id: "flat_life", value: 17 }
   ],
    wartosc: 36 
  });
}

function makeRewardShortSwordCommon() {
  return createManualItemWithBonuses({
    typ: 'weapon',
    baseName: 'short_sword',
    klasa: 'rare',
    level: 3,
    sprite: 'short-sword.png',
    twoHanded: false,
    style: `sword`,
    dmg: 7,
    speed: 0.7,
    itemTypeKey: `weapon`,
    manualBonuses: [
      { id: "damage_percent", value: 17 },
      { id: "stamina_regen_flat", value: 3.4 },
      { id: "flat_life", value: 13 }
   ],
    wartosc: 16 // możesz pominąć – i tak weźmie 6 z defaultów dla common
  });
}

function makeQuestCaptainsFeatherItem() {
  return createManualItem({
    typ: 'feather',
    nazwa: 'elwen_feather',
    baseName: 'elwen_feather',
    klasa: 'special',
    level: 1,
    sprite: 'elwen-feather.png',
    wartosc: 0,
    questId: 'lost_feather'
  });
}

function makeQuestRunicStoneItem() {
  return createManualItem({
    typ: 'stone',
    nazwa: 'runic_stone',
    baseName: 'runic_stone',
    klasa: 'special',
    level: 1,
    sprite: 'runic-stone.png',
    wartosc: 0,
    questId: 'mystical_stone'
  });
}



