/*const enemyPools = {
  west: ["wolf", "boar"],
  south: ["rogue", "thief"],
};*/

const ELITE_ENEMY_POOLS = {
  "elmaris_port": ["elite_boar", "elite_thief"],
  "thalorn_village": ["elite_wolf", "elite_bandit"],
  "reapers_road": ["elite_archer"],
  "lirwen_fort": ["elite_raider"],
  "green_pass": ["elite_savage"],
  "whispering_trees": ["elite_spider"]
};


// 📍 ZESTAWY WROGÓW DLA LOKACJI
const enemyPools = {
  "elmaris_port": ["boar", "thief", "fox", "pirate"],
  "thalorn_village": ["wolf", "sailor", "wolf", "bandit", "bossman"],
  "reapers_road": ["lynx", "dear", "archer", "rogue"],
  "lirwen_fort": ["mad_dog", "bandit_crossbow", "raider", "poacher"],
  "green_pass": ["crocodile", "savage", "savage_boneshield", "warthog"],
  "whispering_trees": ["spider", "black_spider", "lumberjack", "mutated_deer", "black_wolf", "mutated_fox"]
};


// 📘 BAZA WROGÓW (uniwersalna)
const enemyBase = {
  // --- Zwierzęta i stworzenia naturalne ---
  wolf: {
    name: "enemy_wolf",
    maxHp: 95,
    dmg: 11,
    def: 82,
    atkSpd: 0.46,
    type: "normal",
    baseExp: 25,
    sprite: "grey-wolf.png",
    skills: [
      {
         id: "hunt-instinct",
         level: 2
      },
    ],
  },
  elite_wolf: {
    name: "enemy_elite_wolf",
    maxHp: 205,
    dmg: 27,
    def: 170,
    atkSpd: 0.55,
    type: "elite",
    baseExp: 34,
    sprite: "grey-wolf.png"
  },
  boar: {
    name: "enemy_boar",
    maxHp: 80, 
    dmg: 7, 
    def: 55, 
    atkSpd: 0.40,
    type: "normal",
    baseExp: 23,
    sprite: "boar.png",
    skills: [
      {
         id: "gore-charge",
         level: 1
      },
    ]
  },
  elite_boar: {
    name: "enemy_elite_boar",
    maxHp: 210, 
    dmg: 20, 
    def: 140, 
    atkSpd: 0.35,
    type: "elite",
    baseExp: 36,
    sprite: "boar.png"
  },
  fox: {
    name: "enemy_fox",
    maxHp: 52,
    dmg: 4,
    def: 30,
    atkSpd: 0.50,
    type: "normal",
    baseExp: 18,
    sprite: "fox.png",
    skills: [
      {
         id: "quick-pounce",
         level: 1
      },
    ]
  },
  dear: {
    name: "enemy_deer",
    maxHp: 143,
    dmg: 13,
    def: 145,
    atkSpd: 0.38,
    baseExp: 30,
    type: "normal",
    sprite: "dear.png",
    skills: [
      {
         id: "antler-rush",
         level: 4
      },
    ],
  },
  lynx: {
    name: "enemy_lynx",
    maxHp: 90,
    dmg: 11,
    def: 85,
    atkSpd: 0.58,
    baseExp: 22,
    type: "normal",
    sprite: "lynx.png",
    skills: [
      {
         id: "predator-strike",
         level: 4
      },
    ],
  },
  mad_dog: {
    name: "enemy_mad_dog",
    maxHp: 130,
    dmg: 12,
    def: 122,
    atkSpd: 0.56,
    type: "normal",
    baseExp: 20,
    sprite: "mad-dog3.png"
  },
  crocodile: {
    name: "enemy_crocodile",
    maxHp: 175,
    dmg: 17,
    def: 160,
    atkSpd: 0.4,
    type: "normal",
    baseExp: 30,
    sprite: "crocodile.png"
  },
  warthog: {
    name: "enemy_warthog",
    maxHp: 140,
    dmg: 14,
    def: 135,
    atkSpd: 0.45,
    type: "normal",
    baseExp: 25,
    sprite: "warthog.png"
  },
  spider: {
    name: "enemy_spider",
    maxHp: 140,
    dmg: 18,
    def: 105,
    atkSpd: 0.62,
    type: "normal",
    baseExp: 26,
    sprite: "spider2.png"
  },
  elite_spider: {
    name: "enemy_elite_spider",
    maxHp: 390,
    dmg: 42,
    def: 310,
    atkSpd: 0.56,
    type: "elite",
    baseExp: 51,
    sprite: "spider2.png"
  },
  black_spider: {
    name: "enemy_black_spider",
    maxHp: 140,
    dmg: 18,
    def: 105,
    atkSpd: 0.62,
    type: "normal",
    baseExp: 26,
    sprite: "spider.png"
  },
  black_wolf: {
    name: "enemy_black_wolf",
    maxHp: 194,
    dmg: 19,
    def: 145,
    atkSpd: 0.57,
    type: "normal",
    baseExp: 31,
    sprite: "black-wolf.png"
  },
  mutated_deer: {
    name: "enemy_mutated_deer",
    maxHp: 192,
    dmg: 18,
    def: 185,
    atkSpd: 0.42,
    type: "normal",
    baseExp: 36,
    sprite: "mutated-deer.png"
  },
  mutated_fox: {
    name: "enemy_mutated_fox",
    maxHp: 133,
    dmg: 14,
    def: 170,
    atkSpd: 0.7,
    type: "normal",
    baseExp: 27,
    sprite: "mutated-fox.png"
  },


  
  // --- Ludzie i bandyci ---
  lumberjack: {
    name: "enemy_lumberjack",
    maxHp: 184,
    dmg: 16,
    def: 172,
    atkSpd: 0.6,
    type: "normal",
    baseExp: 32,
    sprite: "lumberjack.png"
  },

  savage: {
    name: "enemy_savage",
    maxHp: 147,
    dmg: 13,
    def: 130,
    atkSpd: 0.62,
    type: "normal",
    baseExp: 26,
    sprite: "savage.png"
  },
  elite_savage: {
    name: "enemy_elite_savage",
    maxHp: 257,
    dmg: 25,
    def: 243,
    atkSpd: 0.68,
    type: "elite",
    baseExp: 53,
    sprite: "savage.png"
  },
  savage_boneshield: {
    name: "enemy_savage_boneshield",
    maxHp: 182,
    dmg: 16,
    def: 168,
    atkSpd: 0.47,
    type: "normal",
    baseExp: 28,
    sprite: "savage-boneshield.png"
  },
  bandit: {
    name: "enemy_bandit",
    maxHp: 124,
    dmg: 10,
    def: 123,
    atkSpd: 0.5,
    type: "normal",
    baseExp: 28,
    sprite: "bandit.png",
    skills: [
      {
         id: "sand-throw",
         level: 3
      },
    ],
  },
  elite_bandit: {
    name: "enemy_elite_bandit",
    maxHp: 240,
    dmg: 28,
    def: 235,
    atkSpd: 0.45,
    type: "elite",
    baseExp: 39,
    sprite: "bandit.png"
  },
  bandit_crossbow: {
    name: "enemy_bandit_crossbow",
    maxHp: 121,
    dmg: 14,
    def: 120,
    atkSpd: 0.65,
    type: "normal",
    baseExp: 21,
    sprite: "bandit-crossbow.png"
  },
  raider: {
    name: "enemy_raider",
    maxHp: 152,
    dmg: 14,
    def: 144,
    atkSpd: 0.5,
    type: "normal",
    baseExp: 28,
    sprite: "raider.png"
  },
  elite_raider: {
    name: "enemy_elite_raider",
    maxHp: 680,
    dmg: 49,
    def: 630,
    atkSpd: 0.45,
    type: "elite",
    baseExp: 55,
    sprite: "raider.png"
  },
  poacher: {
    name: "enemy_poacher",
    maxHp: 175,
    dmg: 15,
    def: 146,
    atkSpd: 0.42,
    type: "normal",
    baseExp: 29,
    sprite: "poacher.png"
  },
  archer: {
    name: "enemy_archer",
    maxHp: 128,
    dmg: 13,
    def: 90,
    atkSpd: 0.55,
    type: "normal",
    baseExp: 24,
    sprite: "archer.png",
    skills: [
      {
         id: "hunter-mark",
         level: 4
      },
    ],
  },
  elite_archer: {
    name: "enemy_elite_archer",
    maxHp: 280,
    dmg: 30,
    def: 230,
    atkSpd: 0.65,
    type: "elite",
    baseExp: 43,
    sprite: "archer.png"
  },
  rogue: {
    name: "enemy_rogue",
    maxHp: 144,
    dmg: 12,
    def: 150,
    atkSpd: 0.65,
    type: "normal",
    baseExp: 26,
    sprite: "rogue.png",
    skills: [
      {
         id: "poisoned-dagger",
         level: 4
      },
    ],
  },
  thief: {
    name: "enemy_thief",
    maxHp: 96,
    dmg: 7,
    def: 55,
    atkSpd: 0.47,
    type: "normal",
    baseExp: 23,
    sprite: "thief.png",
    skills: [
      {
         id: "backstab",
         level: 1
      },
    ]
  },
  elite_thief: {
    name: "enemy_elite_thief",
    maxHp: 230,
    dmg: 21,
    def: 134,
    atkSpd: 0.5,
    type: "elite",
    baseExp: 38,
    sprite: "thief.png"
  },
  sailor: {
    name: "enemy_sailor",
    maxHp: 130,
    dmg: 11,
    def: 116,
    atkSpd: 0.53,
    type: "normal",
    baseExp: 29,
    sprite: "sailor.png",
    skills: [
      {
         id: "hook-smash",
         level: 3
      },
    ],
  },
  pirate: {
    name: "enemy_pirate",
    maxHp: 124,
    dmg: 9,
    def: 72,
    atkSpd: 0.4,
    type: "normal",
    baseExp: 26,
    sprite: "pirate.png",
    skills: [
      {
         id: "pommel-strike",
         level: 1
      },
    ]
  },
  bossman: {
    name: "enemy_bossman",
    maxHp: 133,
    dmg: 13,
    def: 138,
    atkSpd: 0.36,
    type: "normal",
    baseExp: 32,
    sprite: "bossman.png",
    skills: [
      {
         id: "incendiary-shot",
         level: 4
      },
    ],
  },


  // --- MiniBoss i Boss ---
  alpha_wolf_miniboss: {
    name: "enemy_alpha_wolf_miniboss",
    maxHp: 445,//445
    dmg: 19,//19
    def: 395,//395
    atkSpd: 0.38,
    type: "mini_boss",
    baseExp: 50,
    sprite: "alpha-wolf.png",
    skills: [
      {
         id: "rending-bite",
         level: 5
      },
      {
         id: "alpha-howl",
         level: 6
      },
      {
         id: "savage-pounce",
         level: 4
      },
    ],
  },
  queen_spider_miniboss: {
    name: "enemy_queen_spider_miniboss",
    maxHp: 2500,
    dmg: 100,
    def: 3200,
    atkSpd: 0.4,
    type: "mini_boss",
    baseExp: 500,
    sprite: "queen-spider.png"
  },

  boss: {
    name: "enemy_boss",
    maxHp: 400,
    dmg: 90,
    def: 80,
    atkSpd: 0.25,
    type: "boss",
    baseExp: 2000,
    sprite: "cave-giant-boss.png"
  }
};


const ENEMY_SKILLS = {

  "gore-charge": {
    name: "gore_charge_skill_name",
    description: "The boar charges forward, dealing heavy damage and pushing the target back.",

    cooldown: 10,
    windup: 800,
    weight: 50,
    
    dealsDamage: true,
    canBeBlocked: true,
    canBeInterrupted: true,
    
    effects: [
      {
        type: "damage",
        baseValue: 160,
        scalingPerLevel: 8,
        target: "player"
      },
      {
        type: "pushback",
        baseValue: 45,
        scalingPerLevel: 0,
        target: "player"
      }
    ],
    
    icon: "img/icons/enemy/gore-charge.png",
    vfx: "gore-charge"
  },


  "backstab": {
    name: "backstab_skill_name",
    description: "The thief strikes a vulnerable target, causing heavy bleeding.",

    cooldown: 8,
    windup: 600,
    weight: 50,

    dealsDamage: true,
    canBeBlocked: false,
    canBeInterrupted: false,
    
    effects: [
      {
        type: "damage",
        baseValue: 120,
        scalingPerLevel: 6,
        target: "player"
      },
      {
        type: "bleed",
        baseValue: 12,
        scalingPerLevel: 0.5,
        target: "player"
      },
      {
        type: "bleed-duration",
        baseValue: 4,
        scalingPerLevel: 0.2,
        target: "player"
      }
    ],

    icon: "img/icons/enemy/backstab.png",
    vfx: "backstab"
  },

 "quick-pounce": {
    name: "quick_pounce_skill_name",

    cooldown: 8,
    windup: 600,
    weight: 50,

    dealsDamage: false,
    canBeBlocked: false,
    canBeInterrupted: false,
    
    effects: [
      {
        type: "attack-speed",
        baseValue: 50,
        scalingPerLevel: 5,
        target: "self"
      },
    ],
   
    icon: "img/icons/enemy/pommel-strike.png",
    vfx: "pommel-strike"
  },

  
  "pommel-strike": {
    name: "pommel_strike_skill_name",

    cooldown: 10,
    windup: 800,
    weight: 50,

    dealsDamage: true,
    canBeBlocked: true,
    canBeInterrupted: true,
    
    effects: [
      {
        type: "damage",
        baseValue: 110,
        scalingPerLevel: 5,
        target: "player"
      },
      {
        type: "stun",
        baseValue: 2.3,
        scalingPerLevel: 0.1,
        target: "player"
      }
    ],

    icon: "img/icons/enemy/pommel-strike.png",
    vfx: "pommel-strike"
  },

  "hunt-instinct": {
    name: "hunting_instinct_skill_name",
    description: "The wolf enters a predatory frenzy, greatly increasing its attack speed for a short time.",
    
    cooldown: 10,
    windup: 700,
    weight: 50,

    dealsDamage: false,
    canBeBlocked: false,
    canBeInterrupted: false,

    effects: [
      {
        type: "attack-speed",
        baseValue: 50,
        scalingPerLevel: 2,
        target: "self"
      },
    ],

    icon: "img/icons/enemy/hunting-instinct.png",
    vfx: "hunting-instinct"
  },


  "hook-smash": {
    name: "hook_smash_skill_name",
    description: "The sailor swings his hook with brutal force, dealing heavy damage and stunning the target.",

    cooldown: 12,
    windup: 1000,
    weight: 50,

    dealsDamage: true,
    canBeBlocked: true,
    canBeInterrupted: true,
    
    effects: [
      {
        type: "damage",
        baseValue: 125,
        scalingPerLevel: 6,
        target: "player"
      },
      {
        type: "stun",
        baseValue: 2.6,
        scalingPerLevel: 0.1,
        target: "player"
      }
    ],
    
    icon: "img/icons/enemy/hook-smash.png",
    vfx: "hook-smash"
  },


  "sand-throw": {
    name: "sand_throw_skill_name",
    description: "The bandit throws sand into the target's eyes, dealing damage and slowing their attacks.",

    cooldown: 11,
    windup: 700,
    weight: 50,

    dealsDamage: true,
    canBeBlocked: false,
    canBeInterrupted: true,

    effects: [
      {
        type: "damage",
        baseValue: 45,
        scalingPerLevel: 4,
        target: "player"
      },
      {
        type: "slow",
        baseValue: 40,
        scalingPerLevel: 2,
        target: "player"
      },
      {
        type: "slow-duration",
        baseValue: 4,
        scalingPerLevel: 0.2,
        target: "player"
      },
    ],

    icon: "img/icons/enemy/sand-throw.png",
    vfx: "sand-throw"
  },


  "incendiary-shot": {
    name: "incendiary_shot_skill_name",
    description: "Bossman fires an incendiary shell that burns the target, dealing damage over time.",

    cooldown: 12,
    windup: 1200,
    weight: 50,
    
    dealsDamage: true,
    canBeBlocked: true,
    canBeInterrupted: true,

    effects: [
      {
        type: "damage",
        baseValue: 100,
        scalingPerLevel: 7,
        target: "player"
      },
      {
        type: "burn",
        baseValue: 15,
        scalingPerLevel: 1,
        target: "player"
      },
      {
        type: "burn-duration",
        baseValue: 4,
        scalingPerLevel: 0.2,
        target: "player"
      }
    ],

    icon: "img/icons/enemy/incendiary-shot.png",
    vfx: "incendiary-shot"
  },
  
  "predator-strike": {
    name: "predator_strike_skill_name",
    description: "The lynx leaps at the target, dealing heavy damage and briefly stunning them.",

    cooldown: 7,
    windup: 600,
    weight: 50,

    dealsDamage: true,
    canBeBlocked: true,
    canBeInterrupted: true,

    effects: [
      {
        type: "damage",
        baseValue: 110,
        scalingPerLevel: 6,
        target: "player"
      },
      {
        type: "stun",
        baseValue: 1.4,
        scalingPerLevel: 0.1,
        target: "player"
      },
      {
        type: "life-steal",
        baseValue: 60,
        scalingPerLevel: 3,
        target: "player"
      }

    ],

    icon: "img/icons/enemy/pounce.png",
    vfx: "pounce"
  },


  "antler-rush": {
    name: "antler_rush_skill_name",
    description: "The deer charges forward with its antlers, dealing heavy damage and pushing the target back.",

    cooldown: 11,
    windup: 900,
    weight: 50,

    dealsDamage: true,
    canBeBlocked: true,
    canBeInterrupted: true,

    effects: [
      {
        type: "damage",
        baseValue: 150,
        scalingPerLevel: 7,
        target: "player"
      },
      {
        type: "pushback",
        baseValue: 80,
        scalingPerLevel: 0,
        target: "player"
      }
    ],

    icon: "img/icons/enemy/antler-rush.png",
    vfx: "antler-rush"
  },


  "hunter-mark": {
    name: "haunting_mark_skill_name",
    description: "The archer marks the target, weakening them and making them more vulnerable to attacks.",
    
    cooldown: 12,
    windup: 700,
    weight: 50,
    
    dealsDamage: false,
    canBeBlocked: false,
    canBeInterrupted: false,
    
    effects: [
      {
        type: "mark",
        baseValue: 25,
        scalingPerLevel: 3,
        target: "player"
      },
     
    ],

    icon: "img/icons/enemy/hunter-mark.png",
    vfx: "hunter-mark"
  },


  "poisoned-dagger": {
    name: "poisoned_dagger_skill_name",
    description: "The rogue strikes with a poisoned dagger, infecting the target with a deadly toxin that deals damage over time.",

    cooldown: 11,
    windup: 650,
    weight: 50,
    
    dealsDamage: true,
    canBeBlocked: true,
    canBeInterrupted: true,

    effects: [
      {
        type: "damage",
        baseValue: 75,
        scalingPerLevel: 4,
        target: "player"
      },
      {
        type: "poison",
        baseValue: 8,
        scalingPerLevel: 1,
        target: "player"
      }
    ],
    
    icon: "img/icons/enemy/poisoned-dagger.png",
    vfx: "poisoned-dagger"
  },
  
  // =====================================================
  // THIEF CHIEFTAIN
  // =====================================================

  "dirty-tricks": {
    name: "dirty_tricks_skill_name",
    description: "The thief chieftain uses dirty tricks to weaken the target, making them more vulnerable to incoming damage.",
    
    cooldown: 12,
    windup: 800,
    weight: 50,
    
    dealsDamage: false,
    canBeBlocked: false,
    canBeInterrupted: true,
    
    effects: [
      {
        type: "mark",
        baseValue: 20,
        scalingPerLevel: 2,
        target: "player"
      }
    ],

    icon: "img/icons/enemy/dirty-tricks.png",
    vfx: "dirty-tricks"
  },


  "shadow-strike": {
    name: "shadow_strike_skill_name",
    description: "The thief chieftain delivers a powerful strike, dealing increased damage against a weakened target.",

    cooldown: 10,
    windup: 1000,
    weight: 50,

    dealsDamage: true,
    canBeBlocked: true,
    canBeInterrupted: true,

    effects: [
      {
        type: "damage",
        baseValue: 145,
        scalingPerLevel: 8,
        target: "player"
      }
    ],

    icon: "img/icons/enemy/shadow-strike.png",
    vfx: "shadow-strike"
  },


  "smoke-bomb": {
    name: "smoke_bomb_skill_name",
    description: "The thief chieftain surrounds himself with smoke, reducing incoming damage for a short time.",

    cooldown: 15,
    windup: 600,
    weight: 30,

    dealsDamage: false,
    canBeBlocked: false,
    canBeInterrupted: true,

    effects: [
      {
        type: "damage-reduction-buff",
        baseValue: 30,
        scalingPerLevel: 2,
        target: "enemy"
      }
    ],

    icon: "img/icons/enemy/smoke-bomb.png",
    vfx: "smoke-bomb"
  },


  // =====================================================
  // BANDIT CHIEFTAIN
  // =====================================================

  "brutal-strike": {
    name: "brutal_strike_skill_name",
    description: "The bandit chieftain delivers a brutal, devastating blow with overwhelming force.",

    cooldown: 16,
    windup: 1400,
    weight: 30,

    dealsDamage: true,
    canBeBlocked: true,
    canBeInterrupted: true,

    effects: [
      {
        type: "damage",
        baseValue: 160,
        scalingPerLevel: 8,
        target: "player"
      }
    ],

    icon: "img/icons/enemy/brutal-strike.png",
    vfx: "brutal-strike"
  },


  "leg-sweep": {
    name: "leg_sweep_skill_name",
    description: "The bandit chieftain sweeps the target's legs, slowing their attacks.",
    
    cooldown: 13,
    windup: 700,
    weight: 50,

    dealsDamage: false,
    canBeBlocked: false,
    canBeInterrupted: false,
  
    effects: [
      {
        type: "slow",
        baseValue: 30,
        scalingPerLevel: 2,
        target: "player"
      },
      {
        type: "bleed",
        baseValue: 12,
        scalingPerLevel: 1,
        target: "player"
      },
      {
        type: "bleed-duration",
        baseValue: 4,
        scalingPerLevel: 0.1,
        target: "player"
      }

    ],
    
    icon: "img/icons/enemy/leg-sweep.png",
    vfx: "leg-sweep"
  },

  "rallying-cry": {
    name: "rallying_cry_skill_name",
    description: "The bandit chieftain rallies himself into a frenzy, greatly increasing his attack speed.",

    cooldown: 13,
    windup: 600,
    weight: 50,
    
    dealsDamage: false,
    canBeBlocked: false,
    canBeInterrupted: true,
    
    effects: [
      {
        type: "attack-speed",
        baseValue: 30,
        scalingPerLevel: 3,
        target: "enemy"
      }
    ],

    icon: "img/icons/enemy/rallying-cry.png",
    vfx: "rallying-cry"
  },


  
  // =========================
  // ALPHA WOLF
  // =========================

    
  
  "savage-pounce": {
    name: "savage_pounce_skill_name",
    description: "The alpha wolf leaps at the target with brutal force.",
    cooldown: 16,
    windup: 600,
    weight: 30,

    dealsDamage: true,
    canBeInterrupted: true,
    canBeBlocked: true,

    effects: [
      {
        type: "damage",
        baseValue: 165,
        scalingPerLevel: 7,
        target: "player"
      }
    ],

    icon: "img/icons/enemy/savage-pounce.png",
    vfx: "savage-pounce"
  },

  "blood-scent": {
    name: "blood_scent_skill_name",
    description: "The alpha wolf senses the target's weakness and becomes faster.",
    cooldown: 15,
    windup: 600,
    weight: 20,

    dealsDamage: false,
    canBeInterrupted: true,
    canBeBlocked: false,

    effects: [
      {
        type: "attack-speed",
        baseValue: 25,
        scalingPerLevel: 2,
        target: "enemy"
      }
    ],

    icon: "img/icons/enemy/blood-scent.png",
    vfx: "blood-scent"
  },

  "alpha-howl": {
    name: "alpha_howl_skill_name",
    description: "The alpha wolf lets out a terrifying howl, greatly increasing its combat power.",
    cooldown: 16,
    windup: 1000,
    weight: 25,

    dealsDamage: false,
    canBeInterrupted: true,
    canBeBlocked: false,

    effects: [
      {
        type: "attack-speed",
        baseValue: 20,
        scalingPerLevel: 2,
        target: "enemy"
      },
      {
        type: "damage-buff",
        baseValue: 25,
        scalingPerLevel: 3,
        target: "enemy"
      }
    ],

    icon: "img/icons/enemy/alpha-howl.png",
    vfx: "alpha-howl"
  },

  // =========================
  // ALTERNATIVE SKILLS
  // =========================

  "rending-bite": {
    name: "rending_bite_skill_name",
    description: "The alpha wolf tears into the target, leaving a deep bleeding wound.",
    cooldown: 12,
    windup: 900,
    weight: 30,

    dealsDamage: true,
    canBeInterrupted: true,
    canBeBlocked: true,

    effects: [
      {
        type: "damage",
        baseValue: 120,
        scalingPerLevel: 7,
        target: "player"
      },
      {
        type: "bleed",
        baseValue: 18,
        scalingPerLevel: 1,
        target: "player"
      },
      {
        type: "bleed-duration",
        baseValue: 5,
        scalingPerLevel: 0.1,
        target: "player"
      }
    ],

    icon: "img/icons/enemy/rending-bite.png",
    vfx: "rending-bite"
  },

  
  
  
};
