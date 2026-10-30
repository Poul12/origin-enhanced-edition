

const EXPEDITION_CONTROLLER = {

  default: {
    stepCount: 10,

    forcedSteps: {
      0: { type: "enemy_all" }
    },

    finalStep: "normal"
  },

  predator_protocol: {
    stepCount: 10,

    forcedSteps: {
      0: { type: "enemy_all" }
    },

    enemyBoost: {
      eliteChance: 25
    },

    finalStep: "mini_boss"
  },

  golden_rift: {
    stepCount: 10,

    rewardBoost: {
      chest: 40,
      shrine: 20
    },

    finalStep: "normal"
  },

  corrupted_simulation: {
    stepCount: 10,

    enemyBoost: {
      hp: 20,
      dmg: 15,
      def: 20
    },

    rewardBoost: {
      chest: 15
    },

    finalStep: "mini_boss"
  },

  swarm_protocol: {
    stepCount: 12,

    forcedSteps: {
      0: { type: "enemy_all" }
    },

    enemyBoost: {
      count: 30
    },

    finalStep: "mini_boss"
  },

  void_instability: {
    stepCount: 10,

    slotWeights: {
      enemy: 70,
      shrine: 10,
      chest: 10,
      npc: 10
    },

    finalStep: "normal"
  },

  broken_time: {
    stepCount: 10,

    slotWeights: {
      enemy: 40,
      shrine: 30,
      chest: 20,
      npc: 10
    },

    finalStep: "normal"
  },

  blood_echo: {
    stepCount: 10,

    storyAllEnemies: {
      4: { enemyId: "echo_enemy" },
      7: { enemyId: "echo_enemy" }
    },

    finalStep: "mini_boss"
  },
  
  hunter_dimension: {
    stepCount: 12,

    storyAllEnemies: {
      5: { enemyId: "hunter" },
      9: { enemyId: "hunter" }
    },

    enemyBoost: {
      eliteChance: 20
    },

    finalStep: "mini_boss"
  }

};

const EXPEDITION_MUTATOR_INFO = {
  predator_protocol: {
    name: "Instynkt Łowcy",
    desc: "Symulacja aktywowała tryb łowcy. Elitarni przeciwnicy pojawiają się częściej.",
    icon: `predator-protocol-icon.png`
  },

  golden_rift: {
    name: "Złoty Rezonans",
    desc: "Nigiro destabilizuje zasoby. Nagrody pojawiają się cześciej.",
    icon: `golden-rift-icon.png`
  },

  corrupted_simulation: {
    name: "Skażona Struktura",
    desc: "Kod symulacji uległ uszkodzeniu. Wrogowie są silniejsi, ale za to nagrody są większe.",
    icon: `corrupted-simulation-icon.png`
  },

  swarm_protocol: {
    name: "Obfitość Bezmiaru",
    desc: "System generuje nadmiar przeciwników. Lokacje są dłuższe.",
    icon: `swarm-protocol-icon.png`
  },

  void_instability: {
    name: "Niestabilność Pustki",
    desc: "Struktura Nigiro destabilizuje strukturę lokacji. Więcej walk.",
    icon: `void-instability-icon.png`
  },

  broken_time: {
    name: "Pęknięcie Czasu",
    desc: "Czas w symulacji jest niestabilny. Więcej wyzwań.",
    icon: `broken-time-icon.png`
  },

  blood_echo: {
    name: "Echo Krwi",
    desc: "Pokonani przeciwnicy zostawiają echo w symulacji.",
    icon: `blood-echo-icon2.png`
  },
  
  hunter_dimension: {
    name: "Łowcy Nigiro",
    desc: "Specjalni łowcy polują na intruzów symulacji.",
    icon: `hunter-dimension-icon.png`
  }
};


const expeditionMiniBossPool = [
  "alpha_wolf_miniboss",
  "queen_spider_miniboss"
];


function pickRandomExpeditionMiniBoss() {
  const pool = expeditionMiniBossPool;

  return pool[Math.floor(Math.random() * pool.length)];
}

const EXPEDITION_MUTATORS = [
  "predator_protocol",
  "golden_rift",
  "corrupted_simulation",
  "swarm_protocol",
  "void_instability",
  "blood_echo",
  "broken_time",
  "hunter_dimension"
];

function getRandomMutator(activeMutators) {
  const available = EXPEDITION_MUTATORS.filter(
    m => !activeMutators.includes(m)
  );

  if (available.length === 0) return null;

  const index = Math.floor(Math.random() * available.length);
  return available[index];
}

function checkExpeditionMutator() {
  const world = gameState.world;
  
  if (world.mode !== "expedition") return;

  const level = world.expeditionLevel;

  if (level % 3 !== 0) return;

  const newMutator = getRandomMutator(world.expeditionMutators);

  if (!newMutator) return;

  world.expeditionMutators.push(newMutator);

  //console.error("New expedition mutator:", newMutator);
}

function getExpeditionConfig(mutatorId) {
  return EXPEDITION_CONTROLLER[mutatorId] || EXPEDITION_CONTROLLER.default;
}

function getCombinedExpeditionConfig(mutators) {

  const result = {
    stepCount: 10,
    forcedSteps: {},
    storyAllEnemies: {},
    rewardBoost: {},
    enemyBoost: {},
    slotWeights: {},
    finalStep: "normal"
  };

  for (const [id, level] of Object.entries(mutators)) {

    const cfg = EXPEDITION_CONTROLLER[id];
    if (!cfg) continue;

    if (cfg.stepCount)
      result.stepCount = Math.max(result.stepCount, cfg.stepCount);

    Object.assign(result.forcedSteps, cfg.forcedSteps || {});
    Object.assign(result.storyAllEnemies, cfg.storyAllEnemies || {});
    Object.assign(result.rewardBoost, cfg.rewardBoost || {});
    Object.assign(result.enemyBoost, cfg.enemyBoost || {});
    Object.assign(result.slotWeights, cfg.slotWeights || {});

    if (cfg.finalStep === "mini_boss")
      result.finalStep = "mini_boss";
  }

  return result;
}

/*function getCombinedExpeditionConfig(mutatorIds) {
  const result = {
    stepCount: 10,
    forcedSteps: {},
    storyAllEnemies: {},
    rewardBoost: {},
    enemyBoost: {},
    slotWeights: {},
    finalStep: "normal"
  };

  for (const id of mutatorIds) {

    const cfg = EXPEDITION_CONTROLLER[id];
    if (!cfg) continue;

    if (cfg.stepCount)
      result.stepCount = Math.max(result.stepCount, cfg.stepCount);

    Object.assign(result.forcedSteps, cfg.forcedSteps || {});
    Object.assign(result.storyAllEnemies, cfg.storyAllEnemies || {});

    Object.assign(result.rewardBoost, cfg.rewardBoost || {});
    Object.assign(result.enemyBoost, cfg.enemyBoost || {});
    Object.assign(result.slotWeights, cfg.slotWeights || {});

    if (cfg.finalStep === "mini_boss")
      result.finalStep = "mini_boss";
  }

  return result;
}*/