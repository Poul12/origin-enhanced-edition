
const SIM_HITS = 1000;

// ===== HELPERS =====
function roll(chance) {
  return Math.random() < chance;
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

let stats = {
  total: 0,
  base: 0,
  critBonus: 0,
  blocked: 0,
  hits: 0,
  crits: 0,
  dodged: 0,
  blocked: 0
};

function simulatePlayerHit(player, enemy) {
  // --- raw dmg ---
  let phys = player.baseDmg;
  let elemental = player.elementalDmg;

  // --- mitigation ---
  const armorRed = getArmorReduction(enemy.armor, enemy.level);
  phys *= (1 - armorRed);
  phys *= (1 - enemy.physReduction);

  const res = enemy.resist[player.elementalType] || 0;
  elemental *= (1 - res);

  const baseNoCrit = phys + elemental;

  // --- crit ---
  let critBonus = 0;
  const isCrit = roll(player.crit);

  if (isCrit) {
    critBonus = baseNoCrit * player.critDmg;
    stats.crits++;
  }

  const final = baseNoCrit + critBonus;

  // --- STATS ---
  stats.base += baseNoCrit;
  stats.critBonus += critBonus;
  stats.total += final;
  stats.hits++;

  return {
    total: final,
    base: baseNoCrit,
    critBonus,
    crit: isCrit
  };
}


/*function simulatePlayerHit(player, enemy) {
  let phys = player.baseDmg;
  let elemental = player.elementalDmg;
  
  // armor / resist NAJPIERW
  const armorRed = getArmorReduction(enemy.armor, enemy.level);
  phys *= (1 - armorRed);
  phys *= (1 - enemy.physReduction);

  const res = enemy.resist[player.elementalType] || 0;
  elemental *= (1 - res);

  let baseFinal = phys + elemental;

  const isCrit = roll(player.crit);

  // crit
  if (isCrit) {
    const bonus = baseFinal * player.critDmg;
    stats.critBonus += bonus;
    baseFinal += bonus;
    stats.crits++;
  }  

  stats.base += (baseFinal - (isCrit ? stats.critBonus : 0)); 
  stats.total += baseFinal;
  
  stats.hits++;
  
  return {
    total: baseFinal,
    crit: isCrit
  };
}*/

function simulatePlayerCombat(player, enemy) {
  let totalDmg = 0;
  let crits = 0;
  
  for (let i = 0; i < SIM_HITS; i++) {
    const hit = simulatePlayerHit(player, enemy);
    totalDmg += hit.total;
    if (hit.crit) crits++;
  }

  const avgHit = totalDmg / SIM_HITS;
  const cooldown = 1 / player.attackSpeed;
  const dps = avgHit / cooldown;
  const ttk = enemy.hp / dps;
  const fightTime = SIM_HITS / player.attackSpeed;
  const dpsBreakdown = stats.total / fightTime;
  
  console.log(`dpsBreakdown, statsTotal.total, ttk`, dpsBreakdown, stats.total, ttk * SIM_HITS);
  console.log(`stats.crits, stats.hits`, stats.crits, stats.hits);
 
  return {
    avgHit,
    dps,
    ttk,
    critRate: crits / SIM_HITS,
    dpsBreakdown,
    breakdown: {
      base: stats.base / fightTime,
      crit: stats.critBonus / fightTime,
      critRate: stats.crits / stats.hits
    }
  };
}

//ENEMY
function simulateHit(player, enemy) {
  let dmg = enemy.baseDmg;
  
  if (roll(player.dodge / 100)) {
    stats.dodged++;
    return 0;
  }
  
  if (player.mode === "tactical") {
    if (roll(getFinalTacticalBlockChance(player.blockPower))) {
      stats.blocked++;
      return 0;
    }
  }

  if (player.mode === "defensive") {
    dmg *= (1 - getDefensiveBlockReduction(player.blockPower));
  }

  dmg *= (1 - getArmorReduction(player.armor, enemy.level));
  return dmg;
}

function runPlayerAttackSimulation() {
  stats = {
    total: 0,
    base: 0,
    critBonus: 0,
    blocked: 0,
    hits: 0,
    crits: 0,
    dodged: 0,
    blocked: 0
  };
  
  const player = {
    baseDmg: +document.getElementById("p-dmg").value,
    attackSpeed: +document.getElementById("p-atkspd").value,
    crit: +document.getElementById("p-crit").value / 100,
    critDmg: +document.getElementById("p-critdmg").value / 100,
    elementalDmg: +document.getElementById("p-ele-dmg").value,
    elementalType: document.getElementById("p-ele-type").value
  };

  const enemy = {
    hp: +document.getElementById("e-hp").value,
    armor: +document.getElementById("e-armor").value,
    physReduction: +document.getElementById("e-physred").value / 100,
    resist: {
      fire: +document.getElementById("e-fire").value / 100,
      cold: +document.getElementById("e-cold").value / 100,
      poison: +document.getElementById("e-poison").value / 100,
      magic: +document.getElementById("e-magic").value / 100
    },
    level: +document.getElementById("e-level").value
  };

  const r = simulatePlayerCombat(player, enemy);

  const sum = r.breakdown.base + r.breakdown.crit;
  console.log(sum, r.dps);
  
  const tbody = document.querySelector("#attack-results tbody");
  tbody.innerHTML = `
    <tr>
      <td>${r.avgHit.toFixed(1)}</td>
      <td>${r.dps.toFixed(1)}</td>
      <td>${r.dpsBreakdown.toFixed(1)}</td>
      <td>${r.breakdown.base.toFixed(1)}</td>
      <td>${r.breakdown.crit.toFixed(1)}</td>
      <td>${(r.critRate * 100).toFixed(1)}%</td>
      <td class="${r.ttk > 6 ? "good" : "bad"}">
        ${r.ttk.toFixed(1)} s
      </td>
    </tr>
  `;
}

function runSimulation() {
  
  stats = {
    total: 0,
    base: 0,
    critBonus: 0,
    blocked: 0,
    hits: 0,
    crits: 0,
    dodged: 0,
    blocked: 0
  };
  
  const player = {
    hp: +document.getElementById("p-hp").value,
    dodge: +document.getElementById("p-dodge").value,
    blockPower: +document.getElementById("p-block").value / 100,
    armor: +document.getElementById("p-armor").value,
    mode: document.getElementById("p-mode").value
  };

  const enemy = {
    baseDmg: +document.getElementById("e-dmg").value,
    attackSpeed: +document.getElementById("e-atkspd").value,
    level: +document.getElementById("e-level").value
  };

  let total = 0;
  let zero = 0;
  
  for (let i = 0; i < SIM_HITS; i++) {
    const dmg = simulateHit(player, enemy);
    total += dmg;
    if (dmg === 0) zero++;
  }

  const zeroRate = (stats.dodged + stats.blocked) / total;
  const avgHit = total / SIM_HITS;
  const cooldown = 1 / enemy.attackSpeed;
  const dps = avgHit / cooldown;
  const ttd = dps > 0.01 ? player.hp / dps : Infinity;

  const tbody = document.querySelector("#results tbody");
  tbody.innerHTML = `
    <tr>
      <td>${avgHit.toFixed(1)}</td>
      <td>${dps.toFixed(1)}</td>
      <td>${(zero / SIM_HITS * 100).toFixed(1)}%</td>
      <td>${(zeroRate * 100).toFixed(1)}%</td>
      <td class="${ttd > 10 ? "good" : "bad"}">${ttd === Infinity ? "∞" : ttd.toFixed(1)}</td>
    </tr>
  `;
}

