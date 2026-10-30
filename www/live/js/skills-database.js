const COST_SCALE = 0.10;

const SKILLS_DATABASE = {
  

  // =========================
  // SHIELD BLOCK - BULWARK
  // =========================

  "shield-bash": {
    name: "shield_bash_skill_name",
    type: "active",
    unlocked: false,
    level: 0,
    maxLevel: 10,
    requiredLevel: 1,
    usableWhileBlocking: "normal",
    parent: null,
    children: ["shield-wall"],
    description: "shield_bash_skill_desc",
    baseCooldown: 6,
    staminaCost: 25,
    effects: [
      {
        type: "damage",
        baseValue: 120,
        scalingPerLevel: 8,
        target: "enemy"
      },
      {
        type: "stun",
        baseValue: 1,
        scalingPerLevel: 0.1,
        target: "enemy"
      }
    ],
    icon: "img/icons/shield-bash-icon.png"
  },


  "shield-wall": {
    name: "shield_wall_skill_name",
    type: "active",
    unlocked: false,
    level: 0,
    maxLevel: 10,
    requiredLevel: 3,
    usableWhileBlocking: "blocking",
    parent: "shield-bash",
    children: ["counter-strike"],
    description: "shield_wall_skill_desc",
    baseCooldown: 10,
    guardCost: 2,
    effects: [
      {
        type: "def-buff",
        baseValue: 30,
        scalingPerLevel: 2,
        target: "self"
      },
      {
        type: "def-buff-duration",
        baseValue: 6,
        scalingPerLevel: 0.3,
        target: "enemy"
      }
   
    ],
    icon: "img/icons/shield-wall-icon.png"
  },


  "counter-strike": {
    name: "counter_strike_skill_name",
    type: "active",
    unlocked: false,
    level: 0,
    maxLevel: 10,
    requiredLevel: 5,
    usableWhileBlocking: "blocking",
    parent: "shield-wall",
    children: ["provocation", "iron-will"],
    description: "counter_strike_skill_desc",
    baseCooldown: 12,
    guardCost: 2,
    effects: [
      {
        type: "counter-strike",
        baseValue: 130,
        scalingPerLevel: 5,
        target: "enemy"
      },
      {
        type: "stamina-recover",
        baseValue: 10,
        scalingPerLevel: 2,
        target: "enemy"
      },
      {
        type: "counter-duration",
        baseValue: 8,
        scalingPerLevel: 0.1,
        target: "enemy"
      },

    ],
    icon: "img/icons/counter-strike-icon.png"
  },


  "iron-will": {
    name: "iron_will_skill_name",
    type: "active",
    unlocked: false,
    level: 0,
    maxLevel: 10,
    requiredLevel: 8,
    usableWhileBlocking: "blocking",
    parent: "counter-strike",
    children: ["last-bastion"],
    description: "iron_will_skill_desc",
    baseCooldown: 15,
    staminaCost: 35,
    effects: [
      {
        type: "remove-debuff",
        baseValue: 0,
        scalingPerLevel: 0,
        target: "self"
      },
      {
        type: "blocking-cost",
        baseValue: 10,
        scalingPerLevel: 2,
        target: "self"
      },
    ],
    icon: "img/icons/iron-will-icon.png"
  },


  "provocation": {
    name: "provocation_skill_name",
    type: "active",
    unlocked: false,
    level: 0,
    maxLevel: 10,
    requiredLevel: 11,
    usableWhileBlocking: "normal",
    parent: "counter-strike",
    children: ["last-bastion"],
    description: "provocation_skill_desc",
    baseCooldown: 12,
    staminaCost: 30,
    effects: [
      {
        type: "provocation-trigger",
        baseValue: 0,
        scalingPerLevel: 0,
        target: "enemy"
      },
      {
        type: "vulnerable-duration",
        baseValue: 2,
        scalingPerLevel: 0.1,
        target: "enemy"
      },
    ],
    icon: "img/icons/provocation-icon.png"
  },
  
  "last-bastion": {
    name: "last_bastion_skill_name",
    type: "active",
    unlocked: false,
    level: 0,
    maxLevel: 10,
    requiredLevel: 14,
    usableWhileBlocking: "blocking",
    parent: "provocation",
    children: [],
    description: "last_bastion_skill_desc",
    baseCooldown: 30,
    guardCost: 3,
    effects: [
     {
        type: "def-buff",
        baseValue: 40,
        scalingPerLevel: 2,
        target: "self"
      },
      {
        type: "def-buff-duration",
        baseValue: 6,
        scalingPerLevel: 0.2,
        target: "enemy"
      },
      {
        type: "buff-next-attack",
        baseValue: 30,
        scalingPerLevel: 2,
        target: "enemy"
      },

    ],
    icon: "img/icons/last-bastion-icon.png"
  },


  // =========================
  // SHIELD PERFECT - DUELIST
  // =========================

  "riposte": {
    name: "riposte_skill_name",
    type: "active",
    unlocked: false,
    level: 0,
    maxLevel: 10,
    requiredLevel: 1,
    parent: null,
    children: ["opening-strike"],
    description: "riposte_skill_desc",
    baseCooldown: 1,
    staminaCost: 25,
    effects: [
      {
        type: "damage",
        baseValue: 140,
        scalingPerLevel: 10,
        target: "enemy"
      },
    ],
    icon: "img/icons/riposte-icon.png"
  },


  "opening-strike": {
    name: "opening_strike_skill_name",
    type: "active",
    unlocked: false,
    level: 0,
    maxLevel: 10,
    requiredLevel: 4,
    parent: "riposte",
    children: ["precision", "parry-master"],
    description: "opening_strike_skill_desc",
    baseCooldown: 10,
    staminaCost: 25,
    effects: [
      {
        type: "open-windup",
        baseValue: 25,
        scalingPerLevel: 3,
        target: "enemy"
      }
    ],
    icon: "img/icons/opening-strike-icon.png"
  },


  "precision": {
    name: "precision_skill_name",
    type: "active",
    unlocked: false,
    level: 0,
    maxLevel: 10,
    requiredLevel: 6,
    parent: "opening-strike",
    children: ["weak-point"],
    description: "precision_skill_desc",
    baseCooldown: 12,
    staminaCost: 30,
    effects: [
      {
        type: "precision-buff",
        baseValue: 10,
        scalingPerLevel: 1,
        target: "self"
      },
      {
        type: "precision-duration",
        baseValue: 5,
        scalingPerLevel: 0.2,
        target: "enemy"
      },
 
    ],
    icon: "img/icons/precision-icon.png"
  },


  "parry-master": {
    name: "parry_master_skill_name",
    type: "active",
    unlocked: false,
    level: 0,
    maxLevel: 10,
    requiredLevel: 9,
    parent: "opening-strike",
    children: ["perfect-execution"],
    description: "parry_master_skill_desc",
    baseCooldown: 15,
    staminaCost: 35,
    effects: [
      {
        type: "reduce-cooldown",
        baseValue: 6,
        scalingPerLevel: 0.3,
        target: "self"
      },
      {
        type: "reduce-shield-cooldown",
        baseValue: 20,
        scalingPerLevel: 0.2,
        target: "self"
      },
    ],
    icon: "img/icons/parry-master-icon.png"
  },


  "weak-point": {
    name: "weak_point_skill_name",
    type: "active",
    unlocked: false,
    level: 0,
    maxLevel: 10,
    requiredLevel: 12,
    parent: "precision",
    children: ["perfect-execution"],
    description: "weak_point_skill_desc",
    baseCooldown: 12,
    staminaCost: 30,
    effects: [
      {
        type: "crit-buff",
        baseValue: 15,
        scalingPerLevel: 0.5,
        target: "enemy"
      },
      {
        type: "crit-dmg-buff",
        baseValue: 30,
        scalingPerLevel: 2,
        target: "enemy"
      },
      {
        type: "vulnerable-duration",
        baseValue: 5,
        scalingPerLevel: 0.2,
        target: "enemy"
      }
 
    ],
    icon: "img/icons/weak-point-icon.png"
  },


  "perfect-execution": {
    name: "perfect_execution_skill_name",
    type: "active",
    unlocked: false,
    level: 0,
    maxLevel: 10,
    requiredLevel: 15,
    parent: "weak-point",
    children: [],
    description: "perfect_execution_skill_desc",
    baseCooldown: 1,
    staminaCost: 50,
    effects: [
      {
        type: "damage",
        baseValue: 330,
        scalingPerLevel: 20,
        target: "enemy"
      },
    ],
    icon: "img/icons/perfect-execution-icon.png"
  },


  // =========================
  // SPEAR - WARDEN
  // =========================

  "piercing-thrust": {
    name: "piercing_thrust_skill_name",
    type: "active",
    unlocked: false,
    level: 0,
    maxLevel: 10,
    requiredLevel: 1,
    parent: null,
    children: ["sweep"],
    description: "piercing_thrust_skill_desc",
    baseCooldown: 10,
    staminaCost: 25,
    effects: [
      {
        type: "damage",
        baseValue: 130,
        scalingPerLevel: 8,
        target: "enemy"
      },
      {
        type: "spear-control",
        baseValue: 1,
        scalingPerLevel: 0,
        target: "enemy"
      },
      {
        type: "pushback",
        baseValue: 20,
        scalingPerLevel: 2,
        target: "enemy"
      },
    ],
    icon: "img/icons/piercing-thrust-icon.png"
  },
  
  "sweep": {
    name: "sweep_skill_name",
    type: "active",
    unlocked: false,
    level: 0,
    maxLevel: 10,
    requiredLevel: 3,
    parent: "piercing-thrust",
    children: ["impale", "control-shatter"],
    description: "sweep_skill_desc",
    baseCooldown: 10,
    staminaCost: 30,
    effects: [
     {
        type: "spear-control",
        baseValue: 2,
        scalingPerLevel: 0,
        target: "enemy"
      },
      {
        type: "windup",
        baseValue: 15,
        scalingPerLevel: 2,
        target: "enemy"
      },
      {
        type: "sweep-duration",
        baseValue: 4,
        scalingPerLevel: 0.2,
        target: "enemy"
      },
  
    ],
    icon: "img/icons/sweep-icon.png"
  },
  
  "impale": {
    name: "impale_skill_name",
    type: "active",
    unlocked: false,
    level: 0,
    maxLevel: 10,
    requiredLevel: 6,
    parent: "sweep",
    children: ["spear-discipline"],
    description: "impale_skill_desc",
    baseCooldown: 15,
    staminaCost: 35,
    effects: [
      {
        type: "damage",
        baseValue: 230,
        scalingPerLevel: 15,
        target: "enemy"
      },
    ],
    icon: "img/icons/impale-icon.png"
  },

  "control-shatter": {
    name: "control_shatter_skill_name",
    type: "active",
    unlocked: false,
    level: 0,
    maxLevel: 10,
    requiredLevel: 8,
    parent: "sweep",
    children: ["spear-discipline"],
    description: "control_shatter_skill_desc",
    baseCooldown: 12,
    staminaCost: 30,
    effects: [
      {
        type: "control-break",
        baseValue: 0,
        scalingPerLevel: 0,
        target: "self"
      }
    ],
    icon: "img/icons/control-break-icon.png"
  },
  
  "spear-discipline": {
    name: "spear_discipline_skill_name",
    type: "active",
    unlocked: false,
    level: 0,
    maxLevel: 10,
    requiredLevel: 11,
    parent: "control-shatter",
    children: ["absolute-control"],
    description: "spear_discipline_skill_desc",
    baseCooldown: 20,
    staminaCost: 35,
    effects: [
      {
        type: "spear-discipline",
        baseValue: 0,
        scalingPerLevel: 0,
        target: "self"
      },
      {
        type: "discipline-duration",
        baseValue: 6,
        scalingPerLevel: 0.2,
        target: "self"
      },
  
    ],
    icon: "img/icons/spear-discipline-icon.png"
  },


  "absolute-control": {
    name: "absolute_control_skill_name",
    type: "active",
    unlocked: false,
    level: 0,
    maxLevel: 10,
    requiredLevel: 14,
    parent: "spear-discipline",
    children: [],
    description: "absolute_control_skill_desc",
    baseCooldown: 30,
    staminaCost: 50,
    effects: [
      {
        type: "absolute-control",
        baseValue: 0,
        scalingPerLevel: 0,
        target: "enemy"
      },
      {
        type: "absolute-duration",
        baseValue: 5,
        scalingPerLevel: 0.2,
        target: "enemy"
      }
 
    ],
    icon: "img/icons/absolute-control-icon.png"
  },

// =========================
// HAMMER - JUGGERNAUT
// =========================

"crushing-blow": {
  name: "crushing_blow_skill_name",
  type: "active",
  unlocked: false,
  level: 0,
  maxLevel: 10,
  requiredLevel: 1,
  parent: null,
  children: ["ground-slam"],
  description: "crushing_blow_skill_desc",
  baseCooldown: 6,
  staminaCost: 25,
  effects: [
    {
      type: "damage",
      baseValue: 160,
      scalingPerLevel: 10,
      target: "enemy"
    },
    {
      type: "poise-damage",
      baseValue: 40,
      scalingPerLevel: 3,
      target: "enemy"
    }
  ],
  icon: "img/icons/crushing-blow-icon.png"
},


"ground-slam": {
  name: "ground_slam_skill_name",
  type: "active",
  unlocked: false,
  level: 0,
  maxLevel: 10,
  requiredLevel: 4,
  parent: "crushing-blow",
  children: ["heavy-momentum", "armor-crusher"],
  description: "ground_slam_skill_desc",
  baseCooldown: 12,
  staminaCost: 35,
  effects: [
    {
      type: "damage",
      baseValue: 130,
      scalingPerLevel: 8,
      target: "enemy"
    },
    {
      type: "stun",
      baseValue: 2,
      scalingPerLevel: 0.15,
      target: "enemy"
    }
  ],
  icon: "img/icons/ground-slam-icon.png"
},


"heavy-momentum": {
  name: "heavy_momentum_skill_name",
  type: "active",
  unlocked: false,
  level: 0,
  maxLevel: 10,
  requiredLevel: 6,
  parent: "ground-slam",
  children: ["unstoppable"],
  description: "heavy_momentum_skill_desc",
  baseCooldown: 15,
  staminaCost: 30,
  effects: [
    {
      type: "damage-buff",
      baseValue: 25,
      scalingPerLevel: 2,
      target: "self"
    },
    {
      type: "attack-speed",
      baseValue: -10,
      scalingPerLevel: 0,
      target: "self"
    }
  ],
  icon: "img/icons/heavy-momentum-icon.png"
},


"armor-crusher": {
  name: "armor_crusher_skill_name",
  type: "active",
  unlocked: false,
  level: 0,
  maxLevel: 10,
  requiredLevel: 6,
  parent: "ground-slam",
  children: ["earthshatter"],
  description: "armor_crusher_skill_desc",
  baseCooldown: 14,
  staminaCost: 35,
  effects: [
    {
      type: "armor-break",
      baseValue: 35,
      scalingPerLevel: 2,
      target: "enemy"
    }
  ],
  icon: "img/icons/armor-crusher-icon.png"
},


"unstoppable": {
  name: "unstoppable_skill_name",
  type: "active",
  unlocked: false,
  level: 0,
  maxLevel: 10,
  requiredLevel: 8,
  parent: "heavy-momentum",
  children: [],
  description: "unstoppable_skill_desc",
  baseCooldown: 20,
  staminaCost: 40,
  effects: [
    {
      type: "poise",
      baseValue: 50,
      scalingPerLevel: 3,
      target: "self"
    }
  ],
  icon: "img/icons/unstoppable-icon.png"
},


"earthshatter": {
  name: "earthshatter_skill_name",
  type: "active",
  unlocked: false,
  level: 0,
  maxLevel: 10,
  requiredLevel: 10,
  parent: "armor-crusher",
  children: [],
  description: "earthshatter_skill_desc",
  baseCooldown: 30,
  staminaCost: 50,
  effects: [
    {
      type: "damage",
      baseValue: 250,
      scalingPerLevel: 15,
      target: "enemy"
    },
    {
      type: "stun",
      baseValue: 3,
      scalingPerLevel: 0.2,
      target: "enemy"
    }
  ],
  icon: "img/icons/earthshatter-icon.png"
},


// =========================
// DOUBLE AXE - BERSERKER
// =========================

"twin-slash": {
  name: "twin_slash_skill_name",
  type: "active",
  unlocked: false,
  level: 0,
  maxLevel: 10,
  requiredLevel: 1,
  parent: null,
  children: ["blood-frenzy"],
  description: "twin_slash_skill_desc",
  baseCooldown: 7,
  staminaCost: 20,
  effects: [
    {
      type: "damage",
      baseValue: 70,
      scalingPerLevel: 6,
      target: "enemy"
    },
    {
      type: "bleed",
      baseValue: 7,
      scalingPerLevel: 0.2,
      target: "enemy"
    },
    {
      type: "bleed-duration",
      baseValue: 4.5,
      scalingPerLevel: 0.2,
      target: "enemy"
    }

  ],
  icon: "img/icons/twin-slash-icon.png"
},


"blood-frenzy": {
  name: "blood_frenzy_skill_name",
  type: "active",
  unlocked: false,
  level: 0,
  maxLevel: 10,
  requiredLevel: 3,
  parent: "twin-slash",
  children: ["whirlwind", "blood-pact"],
  description: "blood_frenzy_skill_desc",
  baseCooldown: 16,
  staminaCost: 30,
  effects: [
    {
      type: "attack-speed",
      baseValue: 5,
      scalingPerLevel: 2,
      target: "self"
    },
    {
      type: "frenzy-duration",
      baseValue: 5,
      scalingPerLevel: 0.2,
      target: "self"
    }

  ],
  icon: "img/icons/blood-frenzy-icon.png"
},


"whirlwind": {
  name: "whirlwind_skill_name",
  type: "active",
  unlocked: false,
  level: 0,
  maxLevel: 10,
  requiredLevel: 5,
  parent: "blood-frenzy",
  children: ["blood-reaver"],
  description: "whirlwind_skill_desc",
  baseCooldown: 12,
  staminaCost: 35,
  effects: [
    {
      type: "whirlwind",
      baseValue: 40,
      scalingPerLevel: 5,
      target: "enemy"
    },
    {
      type: "bleed",
      baseValue: 4,
      scalingPerLevel: 0.1,
      target: "enemy"
    }
  ],
  icon: "img/icons/whirlwind-icon.png"
},


"blood-pact": {
  name: "blood_pact_skill_name",
  type: "active",
  unlocked: false,
  level: 0,
  maxLevel: 10,
  requiredLevel: 8,
  parent: "blood-frenzy",
  children: ["executioner"],
  description: "blood_pact_skill_desc",
  baseCooldown: 20,
  staminaCost: 0,
  effects: [
    {
      type: "hp-cost",
      baseValue: 25,
      scalingPerLevel: 0,
      target: "self"
    },
    {
      type: "damage-buff",
      baseValue: 30,
      scalingPerLevel: 3,
      target: "self"
    },
    {
      type: "crit-buff-pact",
      baseValue: 15,
      scalingPerLevel: 2,
      target: "self"
    },
  ],
  icon: "img/icons/blood-pact-icon.png"
},


"blood-reaver": {
  name: "blood_reaver_skill_name",
  type: "active",
  unlocked: false,
  level: 0,
  maxLevel: 10,
  requiredLevel: 12,
  parent: "whirlwind",
  children: ["executioner"],
  description: "blood_reaver_skill_desc",
  baseCooldown: 18,
  staminaCost: 35,
  effects: [
    {
      type: "heal-convert",
      baseValue: 20,
      scalingPerLevel: 2,
      target: "self"
    },
    {
      type: "reaver-duration",
      baseValue: 6,
      scalingPerLevel: 0.2,
      target: "self"
    },
  ],
  icon: "img/icons/blood-reaver-icon.png"
},


"executioner": {
  name: "executioner_skill_name",
  type: "active",
  unlocked: false,
  level: 0,
  maxLevel: 10,
  requiredLevel: 15,
  parent: "blood-pact",
  children: [],
  description: "executioner_skill_desc",
  baseCooldown: 30,
  staminaCost: 50,
  effects: [
    {
      type: "damage",
      baseValue: 300,
      scalingPerLevel: 10,
      target: "enemy"
    }
  ],
  icon: "img/icons/executioner-icon.png"
},


// =========================
// GREATSWORD - EXECUTIONER
// =========================

"cleave": {
  name: "cleave_skill_name",
  type: "active",
  unlocked: false,
  level: 0,
  maxLevel: 10,
  requiredLevel: 1,
  parent: null,
  children: ["overhead-strike"],
  description: "cleave_skill_desc",
  baseCooldown: 6,
  staminaCost: 25,
  effects: [
    {
      type: "damage",
      baseValue: 180,
      scalingPerLevel: 12,
      target: "enemy"
    },
    {
      type: "armor-break",
      baseValue: 20,
      scalingPerLevel: 2,
      target: "enemy"
    }
  ],
  icon: "img/icons/cleave-icon.png"
},


"overhead-strike": {
  name: "overhead_strike_skill_name",
  type: "active",
  unlocked: false,
  level: 0,
  maxLevel: 10,
  requiredLevel: 4,
  parent: "cleave",
  children: ["broken-guard"],
  description: "overhead_strike_skill_desc",
  baseCooldown: 10,
  staminaCost: 35,
  effects: [
    {
      type: "damage",
      baseValue: 240,
      scalingPerLevel: 15,
      target: "enemy"
    }
  ],
  icon: "img/icons/overhead-strike-icon.png"
},


"broken-guard": {
  name: "broken_guard_skill_name",
  type: "active",
  unlocked: false,
  level: 0,
  maxLevel: 10,
  requiredLevel: 6,
  parent: "overhead-strike",
  children: ["heavy-momentum-gs", "final-cut"],
  description: "broken_guard_skill_desc",
  baseCooldown: 15,
  staminaCost: 35,
  effects: [
    {
      type: "armor-break",
      baseValue: 50,
      scalingPerLevel: 3,
      target: "enemy"
    },
    {
      type: "vulnerable",
      baseValue: 2,
      scalingPerLevel: 0.2,
      target: "enemy"
    }
  ],
  icon: "img/icons/broken-guard-icon.png"
},


"heavy-momentum-gs": {
  name: "heavy_momentum_gs_skill_name",
  type: "active",
  unlocked: false,
  level: 0,
  maxLevel: 10,
  requiredLevel: 8,
  parent: "broken-guard",
  children: ["devastating-blow"],
  description: "heavy_momentum_gs_skill_desc",
  baseCooldown: 20,
  staminaCost: 40,
  effects: [
    {
      type: "heavy-damage",
      baseValue: 35,
      scalingPerLevel: 3,
      target: "self"
    }
  ],
  icon: "img/icons/heavy-momentum-gs-icon.png"
},


"final-cut": {
  name: "final_cut_skill_name",
  type: "active",
  unlocked: false,
  level: 0,
  maxLevel: 10,
  requiredLevel: 8,
  parent: "broken-guard",
  children: [],
  description: "final_cut_skill_desc",
  baseCooldown: 18,
  staminaCost: 35,
  effects: [
    {
      type: "damage",
      baseValue: 220,
      scalingPerLevel: 15,
      target: "enemy"
    }
  ],
  icon: "img/icons/final-cut-icon.png"
},


"devastating-blow": {
  name: "devastating_blow_skill_name",
  type: "active",
  unlocked: false,
  level: 0,
  maxLevel: 10,
  requiredLevel: 10,
  parent: "heavy-momentum-gs",
  children: [],
  description: "devastating_blow_skill_desc",
  baseCooldown: 35,
  staminaCost: 60,
  effects: [
    {
      type: "damage",
      baseValue: 350,
      scalingPerLevel: 20,
      target: "enemy"
    },
    {
      type: "bonus-vs-vulnerable",
      baseValue: 50,
      scalingPerLevel: 5,
      target: "enemy"
    }
  ],
  icon: "img/icons/devastating-blow-icon.png"
},
  
  
  
  
  
  
  
   "focus": { 
      name: "focus_skill_name",
      type: "passive",
      unlocked: false,
      level: 0,
      maxLevel: 5,
      requiredLevel: 4,
      parent: null,
      children: [],
      description: "focus_skill_desc",
      baseCooldown: 12,
      staminaCost: 30,
      effects: [
         {
           type: "slowmo",
           baseValue: 35,
           scalingPerLevel: -4,
           target: "enemy"
         },
         {
          type: "slowmo-duration",
          baseValue: 2,
          scalingPerLevel: 0.2,
          target: "enemy"
        }
      ],
      icon: "img/icons/focus-skill-icon.png"
    },
  
  
    "slash": { 
      name: "power_attack_skill_name",
      type: "active",
      unlocked: false,
      level: 0,
      maxLevel: 10,
      requiredLevel: 1,
      parent: null,
      children: ["double-attack", "extra-life", "extra-defense", "extra-damage"],
      description: "power_attack_skill_desc",
      baseCooldown: 5,
      staminaCost: 25,
      effects: [
         {
           type: "damage",
           baseValue: 150,
           scalingPerLevel: 10, // 10% więcej obrażeń na poziom
           target: "enemy"
         },
         {
          type: "bonus-vs-status",
          baseValue: 30,
          scalingPerLevel: 0,
          target: "enemy"
        }
      ],
      icon: "img/icons/powerful-attack-skill-icon.png"
    },
    "double-attack": { 
      name: "double_attack_skill_name",
      type: "active",
      unlocked: false,
      level: 0,
      maxLevel: 10,
      requiredLevel: 4,
      parent: "slash",
      children: ["charge", "jump", "warrior-shout"],
      description: "double_attack_skill_desc",
      baseCooldown: 5,
      staminaCost: 20,
      effects: [
         {
           type: "damage",
           baseValue: 65,
           scalingPerLevel: 7,
           target: "enemy"
         },
         {
           type: "bleed",
           baseValue: 7,
           scalingPerLevel: 0.7,
           target: "enemy"
         },
         {
           type: "bleed-duration",
           baseValue: 4.5,
           scalingPerLevel: 0.2,
           target: "enemy"
         }
      ],
      icon: "img/icons/double-attack-skill-icon.png"
    },
    "charge": { 
      name: "charge_skill_name",
      type: "active",
      unlocked: false,
      level: 0,
      maxLevel: 10,
      requiredLevel: 6,
      parent: "double-attack",
      children: [],
      description: "charge_skill_desc",
      baseCooldown: 8,
      staminaCost: 30,
      effects: [
         {
           type: "stun",
           baseValue: 2,
           scalingPerLevel: 0.1,
           target: "enemy"
         },
         {
           type: "damage",
           baseValue: 70,
           scalingPerLevel: 6,
           target: "enemy"
         },
        {
           type: "bonus-damage",
           baseValue: 25,
           scalingPerLevel: 0,
           target: "enemy"
         }
      ],
      icon: "img/icons/charge-skill-icon.png"
    },
    "jump": {
      name: "jump_skill_name",
      type: "active",
      unlocked: false,
      level: 0,
      maxLevel: 10,
      requiredLevel: 6,
      parent: "double-attack",
      children: [],
      description: "jump_skill_desc",  
      baseCooldown: 10,
      staminaCost: 35,
      effects: [
         {
           type: "damage",
           baseValue: 140,
           scalingPerLevel: 5, 
           target: "enemy"
         },
         {
           type: "armor-break",
           baseValue: 20,
           scalingPerLevel: 1.5, 
           target: "enemy"
        },
        {
           type: "slow",
           baseValue: 25,
           scalingPerLevel: 1.2, 
           target: "enemy"
         },
        {
           type: "slow-duration",
           baseValue: 3.6,
           scalingPerLevel: 0.2,
           target: "enemy"
         }
      ],
      icon: "img/icons/jump-skill-icon.png"
    },
    "warrior-shout": { 
      name: "shout_skill_name",
      type: "active",
      unlocked: false,
      level: 0,
      maxLevel: 10,
      requiredLevel: 7,
      parent: "double-attack",
      children: [],
      description: "shout_skill_desc", 
      baseCooldown: 12,
      staminaCost: 30,
      effects: [
         {
           type: "damage-buff",
           baseValue: 20,
           scalingPerLevel: 3,
           target: "enemy"
         },
         {
           type: "shout-duration",
           baseValue: 6,
           scalingPerLevel: 0.2,
           target: "enemy"
         }
      ],
      icon: "img/icons/warrior-shout-skill-icon.png" 
    },
  
  
    "extra-life": { 
      name: "extra_life_skill_name",
      style: "timed",
      type: "passive",
      unlocked: false,
      level: 0,
      maxLevel: 10,
      requiredLevel: 3,
      parent: null,
      children: ["perfect-block-dmg", "block-recovery"],
      description: "extra_life_skill_desc",
      baseCooldown: 0,
      effects: [
         {
           type: "life-bonus",
           baseValue: 30,
           scalingPerLevel: 15,
           target: "character"
         }
      ],
      icon: "img/icons/longevity-skill-icon.png"
    },
    "extra-defense": { 
      name: "extra_defense_skill_name",
      style: "turtle",
      type: "passive",
      unlocked: false,
      level: 0,
      maxLevel: 10,
      requiredLevel: 3,
      parent: null,
      children: ["hp-regen", "max-defense"],
      description: "extra_defense_skill_desc",
      baseCooldown: 0,
      effects: [
         {
           type: "def-bonus",
           baseValue: 12,
           scalingPerLevel: 8,
           target: "character"
         }
      ],
      icon: "img/icons/steadfastness-skill-icon.png"
    },
    "max-defense": { 
      name: "max_defense_skill_name",
      style: "turtle",
      type: "passive",
      unlocked: false,
      level: 0,
      maxLevel: 10,
      requiredLevel: 10,
      parent: "extra-defense",
      children: ["iron-defense"],
      description: "max_defense_skill_desc",
      baseCooldown: 0,
      effects: [
         {
           type: "max-def-bonus",
           baseValue: 5,
           scalingPerLevel: 2,
           target: "character"
         }
      ],
      icon: "img/icons/max-def-skill-icon2.png"
    },
    "iron-defense": { 
      name: "iron_defense_skill_name",
      style: "turtle",
      type: "passive",
      unlocked: false,
      level: 0,
      maxLevel: 10,
      requiredLevel: 16,
      parent: "max-defense",
      children: [],
      description: "iron_defense_skill_desc",
      baseCooldown: 0,
      effects: [
         {
           type: "dmg-reduction",
           baseValue: 18,
           scalingPerLevel: 2,
           target: "character"
         },
         {
           type: "cooldown",
           baseValue: 7.5,
           scalingPerLevel: -0.3,
           target: "character"
         }
      ],
      icon: "img/icons/dmg-reduction-skill-icon2.png"
    },
    "stack-defense": { 
      name: "stack_defense_skill_name",
      style: "turtle",
      type: "passive",
      unlocked: false,
      level: 0,
      maxLevel: 10,
      requiredLevel: 16,
      parent: "extra-stamina",
      children: [],
      description: "stack_defense_skill_desc",
      baseCooldown: 0,
      effects: [
         {
           type: "stack-def",
           baseValue: 6,
           scalingPerLevel: 0.2,
           target: "character"
         },
         {
           type: "stack-duration",
           baseValue: 6,
           scalingPerLevel: 0.2,
           target: "character"
         }
      ],
      icon: "img/icons/armor-stack-skill-icon.png"
    },

    "extra-damage": { 
      name: "extra_damage_skill_name",
      style: "poise",
      type: "passive",
      unlocked: false,
      level: 0,
      maxLevel: 10,
      requiredLevel: 3,
      parent: null,
      children: ["extra-crit", "atkspd-bonus"],
      description: "extra_damage_skill_desc",
      baseCooldown: 0,
      effects: [
         {
           type: "dmg-bonus",
           baseValue: 8,
           scalingPerLevel: 5,
           target: "character"
         }
      ],
      icon: "img/icons/superhuman-strength-skill-icon.png"
    },
    "extra-energy": { 
      name: "Głębokie Oddechy",
      style: "universal",
      type: "passive",
      unlocked: false,
      level: 0,
      maxLevel: 10,
      requiredLevel: 7,
      parent: "extra-life",
      children: ["energy-regen"],
      description: "Zwiększa maksymalną energię o {energy-bonus}. Twój oddech staje się głębszy i bardziej kontrolowany.",
      baseCooldown: 0,
      effects: [
         {
           type: "energy-bonus",
           baseValue: 5,
           scalingPerLevel: 2,
           target: "character"
         }
      ],
      icon: "img/icons/deep-breaths-skill-icon.png"
    },
    "extra-stamina": { 
      name: "extra_stamina_skill_name",
      style: "turtle",
      type: "passive",
      unlocked: false,
      level: 0,
      maxLevel: 10,
      requiredLevel: 12,
      parent: "hp-regen",
      children: ["stack-defense"],
      description: "extra_stamina_skill_desc",
      baseCooldown: 0,
      effects: [
         {
           type: "stamina-bonus",
           baseValue: 15,
           scalingPerLevel: 5,
           target: "character"
         }
      ],
      icon: "img/icons/stamina-bonus-skill-icon.png"
    },
    "stamina-regen": { 
      name: "Nieustępliwość",
      style: "timed",
      type: "passive",
      unlocked: false,
      level: 0,
      maxLevel: 10,
      requiredLevel: 16,
      parent: "extra-stamina",
      children: [],
      description: "Zwiększa regeneracje staminę o {stamina-regen}. Zmęczenie ustępuje miejsca determinacji.",
      baseCooldown: 0,
      effects: [
         {
           type: "stamina-regen",
           baseValue: 2,
           scalingPerLevel: 0.5,
           target: "character"
         }
      ],
      icon: "img/icons/stamina-regen-skill-icon.png"
    },
    "hp-regen": { 
      name: "hp_regen_skill_name",
      style: "turtle",
      type: "passive",
      unlocked: false,
      level: 0,
      maxLevel: 10,
      requiredLevel: 7,
      parent: "extra-defense",
      children: ["extra-stamina"],
      description: "hp_regen_skill_desc",
      baseCooldown: 0,
      effects: [
         {
           type: "hp-regen-bonus",
           baseValue: 3,
           scalingPerLevel: 0.8,
           target: "character"
         }
      ],
      icon: "img/icons/fortitude-skill-icon.png"
    },
    "hp-to-dmg": { 
      name: "hp_to_dmg_skill_name",
      style: "poise",
      type: "passive",
      unlocked: false,
      level: 0,
      maxLevel: 10,
      requiredLevel: 18,
      parent: "crit-damage-bonus",
      children: [],
      description: "hp_to_dmg_skill_desc",
      baseCooldown: 0,
      effects: [
         {
           type: "threshold",
           baseValue: 30,
           scalingPerLevel: 1.5,
           target: "character"
         },
         {
           type: "max-bonus",
           baseValue: 20,
           scalingPerLevel: 3,
           target: "character"
         }
      ],
      icon: "img/icons/hp-to-dmg-skill-icon.png"
    },
   "max-hp": { 
      name: "Wzmocniona Budowa",
      style: "universal",
      type: "passive",
      unlocked: false,
      level: 0,
      maxLevel: 10,
      requiredLevel: 16,
      parent: "hp-regen",
      children: [],
      description: "Zwiększa maksimum życia o {max-hp-bonus}. Twoje ciało staje się twardsze i odporniejsze.",
      baseCooldown: 0,
      effects: [
         {
           type: "max-hp-bonus",
           baseValue: 3,
           scalingPerLevel: 1,
           target: "character"
         }
      ],
      icon: "img/icons/max-hp-skill-icon.png"
    },
    "max-dmg": { 
      name: "Skupiona Siła",
      style: "poise",
      type: "passive",
      unlocked: false,
      level: 0,
      maxLevel: 10,
      requiredLevel: 16,
      parent: "extra-crit",
      children: [],
      description: "Zwiększa maksimum obrażeń o {max-dmg-bonus}. Każdy cios niesie ze sobą większą siłę.",
      baseCooldown: 0,
      effects: [
         {
           type: "max-dmg-bonus",
           baseValue: 3,
           scalingPerLevel: 1,
           target: "character"
         }
      ],
      icon: "img/icons/max-dmg-skill-icon.png"
    },
    "extra-crit": { 
      name: "extra_crit_skill_name",
      style: "poise",
      type: "passive",
      unlocked: false,
      level: 0,
      maxLevel: 10,
      requiredLevel: 7,
      parent: "extra-damage",
      children: ["crit-damage-bonus"],
      description: "extra_crit_skill_desc",
      baseCooldown: 0,
      effects: [
         {
           type: "crit-bonus",
           baseValue: 2,
           scalingPerLevel: 0.5,
           target: "character"
         }
      ],
      icon: "img/icons/crit-skill-icon.png"
    },
    "energy-regen": { 
      name: "Płynny Przepływ",
      style: "universal",
      type: "passive",
      unlocked: false,
      level: 0,
      maxLevel: 10,
      requiredLevel: 16,
      parent: "extra-energy",
      children: [],
      description: "Zwiększa regeneracje energii o {energy-regen}. Energia krąży w Tobie bez zakłóceń.",
      baseCooldown: 0,
      effects: [
         {
           type: "energy-regen",
           baseValue: 5,
           scalingPerLevel: 2,
           target: "character"
         }
      ],
      icon: "img/icons/energy-regen-skill-icon.png"
    },
    "atkspd-bonus": { 
      name: "atkspd_bonus_skill_name",
      style: "poise",
      type: "passive",
      unlocked: false,
      level: 0,
      maxLevel: 10,
      requiredLevel: 10,
      parent: "extra-damage",
      children: [ "hp-to-dmg"],
      description: "atkspd_bonus_skill_desc", 
      baseCooldown: 0,
      effects: [
         {
           type: "atkspd-bonus",
           baseValue: 2,
           scalingPerLevel: 0.5,
           target: "character"
         }
      ],
      icon: "img/icons/atkspd-skill-icon.png"
    },
    "crit-damage-bonus": { 
      name: "crit_damage_bonus_skill_name",
      style: "poise",
      type: "passive",
      unlocked: false,
      level: 0,
      maxLevel: 10,
      requiredLevel: 12,
      parent: "extra-crit",
      children: ["hp-to-dmg"],
      description: "crit_damage_bonus_skill_desc",
      baseCooldown: 0,
      effects: [
         {
           type: "crit-damage-bonus",
           baseValue: 10,
           scalingPerLevel: 5,
           target: "character"
         }
      ],
      icon: "img/icons/crit-damage-skill-icon2.png"
    },
    
    "perfect-block-dmg": { 
      name: "perfect_block_dmg_skill_name",
      style: "timed",
      type: "passive",
      unlocked: false,
      level: 0,
      maxLevel: 10,
      requiredLevel: 10,
      parent: "extra-life",
      children: ["perfect-chain"],
      description: "perfect_block_dmg_skill_desc",
      baseCooldown: 0,
      effects: [
         {
           type: "perfect-dmg",
           baseValue: 20,
           scalingPerLevel: 5,
           target: "character"
         }
      ],
      icon: "img/icons/perfect-block-skill-icon.png"
    },
  
    "perfect-window": { 
      name: "perfect_window_skill_name",
      style: "timed",
      type: "passive",
      unlocked: false,
      level: 0,
      maxLevel: 10,
      requiredLevel: 16,
      parent: "block-recovery",
      children: [],
      description: "perfect_window_skill_desc",
      baseCooldown: 0,
      effects: [
         {
           type: "perfect-window",
           baseValue: 15,
           scalingPerLevel: 5,
           target: "character"
         }
      ],
      icon: "img/icons/perfect-window-skill-icon.png"
    },
  
    "perfect-chain": { 
      name: "perfect_chain_skill_name",
      style: "timed",
      type: "passive",
      unlocked: false,
      level: 0,
      maxLevel: 10,
      requiredLevel: 16,
      parent: "perfect-block-dmg",
      children: [],
      description: "perfect_chain_skill_desc",
      baseCooldown: 0,
      effects: [
         {
           type: "chain-dmg",
           baseValue: 10,
           scalingPerLevel: 1,
           target: "character"
         }
      ],
      icon: "img/icons/perfect-chain-skill-icon.png"
    },
  
    "block-recovery": { 
      name: "block_recovery_skill_name",     
      style: "timed",
      type: "passive",
      unlocked: false,
      level: 0,
      maxLevel: 10,
      requiredLevel: 10,
      parent: "extra-life",
      children: ["perfect-window"],
      description: "block_recovery_skill_desc",
      baseCooldown: 0,
      effects: [
         {
           type: "block-reduction",
           baseValue: 15,
           scalingPerLevel: 3,
           target: "character"
         },
       /* {
           type: "block-cooldown",
           baseValue: 3.5,
           scalingPerLevel: -0.1,
           target: "character"
        }*/
      ],
      icon: "img/icons/block-recovery-skill-icon.png"
    },

  
};


const WEAPON_SKILL_TREES = {

  bulwark: {
    className: "Bulwark",
    root: "shield-bash",
    skills: [
      "shield-bash",
      "shield-wall",
      "counter-strike",
      "iron-will",
      "provocation",
      "last-bastion"
    ]
  },

  duelist: {
    className: "Duelist",
    root: "riposte",
    skills: [
      "riposte",
      "opening-strike",
      "precision",
      "parry-master",
      "weak-point",
      "perfect-execution"
    ]
  },

  warden: {
    className: "Warden",
    root: "piercing-thrust",
    skills: [
      "piercing-thrust",
      "sweep",
      "impale",
      "control-shatter",
      "spear-discipline",
      "absolute-control"
    ]
  },

  juggernaut: {
    className: "Juggernaut",
    root: "crushing-blow",
    skills: [
      "crushing-blow",
      "ground-slam",
      "heavy-momentum",
      "armor-crusher",
      "unstoppable",
      "earthshatter"
    ]
  },

  berserker: {
    className: "Berserker",
    root: "twin-slash",
    skills: [
      "twin-slash",
      "blood-frenzy",
      "whirlwind",
      "blood-pact",
      "blood-reaver",
      "executioner"
    ]
  },

  executioner: {
    className: "Executioner",
    root: "cleave",
    skills: [
      "cleave",
      "overhead-strike",
      "broken-guard",
      "heavy-momentum-gs",
      "final-cut",
      "devastating-blow"
    ]
  }

};

const skillTest = {
    "skill-root-2.3": { unlocked: false, children: [] },
    "skill-root-2.4": { unlocked: false, children: ["skill-root-3.1"] },
    "skill-root-2.5": { unlocked: false, children: ["skill-root-3.2", "skill-root-3.3"] },
    "skill-root-2.6": { unlocked: false, children: ["skill-root-3.4"] },
    "skill-root-2.7": { unlocked: false, children: ["skill-root-3.5", "skill-root-3.6"] },
    "skill-root-2.8": { unlocked: false, children: [] },
    "skill-root-3.1": { unlocked: false, children: [] },
    "skill-root-3.2": { unlocked: false, children: [] },
    "skill-root-3.3": { unlocked: false, children: [] },
    "skill-root-3.4": { unlocked: false, children: [] },
    "skill-root-3.5": { unlocked: false, children: [] },
    "skill-root-3.6": { unlocked: false, children: [] },
    "skill-top-3.1": { unlocked: false, children: [] },
    "skill-top-3.2": { unlocked: false, children: ["skill-top-4.1"] },
    "skill-top-3.3": { unlocked: false, children: ["skill-top-4.2"] },
    "skill-top-3.4": { unlocked: false, children: ["skill-top-4.3", "skill-top-4.4"] },
    "skill-top-3.5": { unlocked: false, children: ["skill-top-4.5"] },
    "skill-top-3.6": { unlocked: false, children: [] },
    "skill-top-4.1": { unlocked: false, children: [] },
    "skill-top-4.2": { unlocked: false, children: ["skill-top-5.1"] },
    "skill-top-4.3": { unlocked: false, children: ["skill-top-5.2"] },
    "skill-top-4.4": { unlocked: false, children: ["skill-top-5.3"] },
    "skill-top-4.5": { unlocked: false, children: [] },
    "skill-top-4.6": { unlocked: false, children: [] },
    "skill-top-5.1": { unlocked: false, children: [] },
    "skill-top-5.2": { unlocked: false, children: [] },
    "skill-top-5.3": { unlocked: false, children: [] }
   };
