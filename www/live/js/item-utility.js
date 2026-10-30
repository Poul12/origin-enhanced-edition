const ARMOR_BASE_MIN = 3;
const WEAPON_BASE_MIN = 2;

const rarityOrder = ["common", "rare", "unique", "epic", "legendary"];

const baseBonuses = [
  { id: "armor_percent", min: 7, max: 11, weight: 100, minRarity: "rare", types: ["armor","shoulder","bracers","pants","shield"], tags: ["def"], canStackWithImplicit: true },
  { id: "damage_percent", min: 7, max: 11, weight: 100, minRarity: "rare", types: ["weapon"], tags: ["offense"], canStackWithImplicit: true },
  { id: "flat_life", min: 8, max: 11, weight: 85, minRarity: "rare", types: ["armor","shield","shoulder","helmet","bracers","gloves","belt","pants","boots"], tags: ["hp"] },
  { id: "elemental_damage", min: 3, max: 4, weight: 75, minRarity: "unique", types: ["weapon"], tags: ["offense"] },
  { id: "strength", min: 2, max: 2, weight: 80, minRarity: "unique", types: ["weapon","shoulder","armor"], tags: ["attribute"] },
  { id: "dexterity", min: 2, max: 2, weight: 80, minRarity: "unique", types: ["weapon","gloves","boots"], tags: ["attribute"] },
  { id: "vitality", min: 2, max: 2, weight: 80, minRarity: "unique", types: ["armor","shield","helmet","shoulder","bracers","gloves","belt","pants"], tags: ["hp","attribute"] },
  { id: "stamina_flat", min: 3, max: 4, weight: 50, minRarity: "rare", types: ["armor", "belt", "helmet"], tags: ["sustain"], meta: { type: "percent_low" } },
  { id: "energy_flat", min: 1, max: 2, weight: 35, minRarity: "epic", types: ["armor", "belt", "helmet"], tags: ["sustain"] },
  { id: "stamina_regen_flat", min: 2, max: 3, weight: 50, minRarity: "rare", types: ["gloves", "belt"], tags: ["sustain"] },
  { id: "stamina_regen_percent", min: 1, max: 2, weight: 50, minRarity: "unique", types: ["boots"], tags: ["sustain"], meta: { type: "percent_low" } },
  { id: "energy_regen_percent", min: 3, max: 5, weight: 50, minRarity: "unique", types: ["helmet"], tags: ["sustain"], meta: { type: "percent_low" } },
  { id: "stamina_percent", min: 5, max: 6, weight: 50, minRarity: "unique", types: ["pants"], tags: ["sustain"], meta: { type: "percent_low" } },
  { id: "life_on_hit", min: 5, max: 7, weight: 30, minRarity: "unique", types: ["gloves","weapon"], tags: ["sustain"], chance: 0.5 },
  { id: "attack_speed_percent", min: 1, max: 2, weight: 40, minRarity: "epic", types: ["gloves","weapon"], tags: ["offense"], canStackWithImplicit: true, chance: 0.5, meta: { type: "percent_low" } },
  { id: "life_regen_flat", min: 5, max: 7, weight: 30, minRarity: "epic", types: ["helmet","belt"], tags: ["sustain"], chance: 0.6 },
  { id: "phys_damage_reduction", min: 2, max: 3, weight: 15, minRarity: "epic", types: ["armor","shoulder","pants","shield","bracers","helmet"], tags: ["def"], canStackWithImplicit: true, chance: 0.3, meta: { type: "percent_low" } },
  { id: "crit_chance", min: 2, max: 3, weight: 50, minRarity: "unique", types: ["weapon","gloves"], tags: ["offense"], meta: { type: "percent_low" } },
  { id: "crit_damage", min: 3, max: 4, weight: 25, minRarity: "epic", types: ["weapon"], tags: ["offense"], meta: { type: "percent_low" } },
  { id: "block_chance", min: 3, max: 4, weight: 65, minRarity: "epic", types: ["shield","bracers"], tags: ["sustain"], canStackWithImplicit: true, chance: 0.6, meta: { type: "percent_low" } },
  { id: "move_cost_reduction", min: 2, max: 3, weight: 45, minRarity: "unique", types: ["boots"], tags: ["mobility"], meta: { type: "percent_low" } },
  { id: "dodge_chance", min: 1, max: 2, weight: 25, minRarity: "epic", types: ["boots"], tags: ["mobility"], canStackWithImplicit: true, meta: { type: "percent_low" } },
  { id: "dodge_cost_reduction", min: 2, max: 3, weight: 25, minRarity: "epic", types: ["boots"], tags: ["mobility"], meta: { type: "percent_low" } },
  { id: "magic_find", min: 1.5, max: 2, weight: 20, minRarity: "unique", types: ["weapon","helmet","belt","pants","boots"], tags: ["economy"], chance: 0.45, meta: { type: "percent_low" } },
  { id: "gold_bonus", min: 1.5, max: 1.5, weight: 25, minRarity: "rare", types: ["weapon","gloves","belt","pants","boots"], tags: ["economy"], chance: 0.65, meta: { type: "percent_low" } },
  { id: "elemental_resist", elements: ["fire","cold","poison","arcane"], min: 2, max: 3, weight: 70, minRarity: "unique", types: ["armor","shield","helmet","shoulder","bracers","belt","pants","boots"], tags: ["resist"] },


  { id: "energy_on_perfect_block", min: 0.4, max: 0.5, weight: 50, minRarity: "rare", combatStyle: ["sword", "axe", "mace", "longsword"], types: ["bracers"], tags: ["energy"], category: "combat", archetype: "perfect_block", meta: { type: "combat_scale" } },
  { id: "energy_on_crit", min: 0.5, max: 0.6, weight: 50, minRarity: "rare", types: ["belt"], tags: ["energy"], category: "combat", archetype: "crit", meta: { type: "combat_scale" } },
  { id: "perfect_block_window", min: 4, max: 5, weight: 25, minRarity: "epic", combatStyle: ["sword", "axe", "mace", "longsword"], types: ["bracers", "boots"], tags: ["def"], category: "combat", archetype: "perfect_block", meta: { type: "combat_scale" } },
  { id: "dmg_below_hp", min: 7, max: 9, weight: 25, minRarity: "unique", types: ["weapon"], tags: ["fatique"], category: "combat", archetype: "low_hp", meta: { type: "combat_scale" } },
  { id: "perfect_block_restore_hp", min: 5, max: 7, weight: 25, minRarity: "rare", combatStyle: ["sword", "axe", "mace", "longsword"], types: ["bracers"], tags: ["sustain"], category: "combat", archetype: "perfect_block", meta: { type: "percent_low" } },
  { id: "perfect_block_gain_def", min: 6, max: 8, weight: 25, minRarity: "rare", combatStyle: ["sword", "axe", "mace", "longsword"], types: ["bracers", "armor"], tags: ["def"], category: "combat", archetype: "perfect_block", meta: { type: "percent_low" } },
  { id: "defensive_stance_gain_def", min: 5, max: 7, weight: 25, minRarity: "rare", combatStyle: ["sword", "axe", "mace", "longsword"], types: ["armor", "shoulder"], tags: ["def"], category: "combat", archetype: "defensive_stance", meta: { type: "percent_low" } },
  { id: "stamina_fatique_penalty", min: 8, max: 12, weight: 35, minRarity: "rare", types: ["pants", "belt"], tags: ["stamina"], category: "combat", archetype: "exhausted", meta: { type: "combat_scale" } },
  { id: "stamina_on_kill", min: 4, max: 6, weight: 50, minRarity: "rare", types: ["pants", "belt"], tags: ["stamina"], category: "combat", archetype: "resources" },
  { id: "stamina_on_crit", min: 1, max: 2, weight: 50, minRarity: "rare", types: ["pants"], tags: ["stamina"], category: "combat", archetype: "poise" },
  { id: "dodge_grant_crit", min: 5, max: 6, weight: 25, minRarity: "rare", types: ["bracers"], tags: ["offense"], category: "combat", archetype: "dodge", meta: { type: "combat_scale" } },
  { id: "dodge_grant_energy", min: 0.4, max: 0.5, weight: 25, minRarity: "rare", types: ["bracers", "boots"], tags: ["energy"], category: "combat", archetype: "dodge", meta: { type: "combat_scale" } },
  { id: "crit_grant_dodge", min: 7, max: 9, weight: 25, minRarity: "rare", types: ["bracers", "boots"], tags: ["def"], category: "combat", archetype: "crit", meta: { type: "combat_scale" } },
  { id: "perfect_block_grant_stamina", min: 3, max: 5, weight: 25, minRarity: "rare", combatStyle: ["sword", "axe", "mace", "longsword"], types: ["bracers"], tags: ["sustain"], category: "combat", archetype: "perfect_block" },
  { id: "dmg_reduction_blocking", min: 4, max: 5, weight: 25, minRarity: "rare", combatStyle: ["sword", "axe", "mace", "longsword"], types: ["shield", "bracers"], tags: ["def"], category: "combat", archetype: "defensive_stance", meta: { type: "combat_scale" } },
  { id: "hp_regen_blocking", min: 14, max: 17, weight: 25, minRarity: "rare", combatStyle: ["sword", "axe", "mace", "longsword"], types: ["shoulder"], tags: ["sustain"], category: "combat", archetype: "defensive_stance", meta: { type: "percent_low" } },
  { id: "crit_per_guard_stack", min: 1, max: 2, weight: 25, minRarity: "rare", combatStyle: ["sword", "axe", "mace", "longsword"], types: ["shield", "weapon"], tags: ["offense"], category: "combat", archetype: "defensive_stance", meta: { type: "combat_scale" } },
  { id: "def_per_guard_stack", min: 3, max: 4, weight: 25, minRarity: "rare", combatStyle: ["sword", "axe", "mace", "longsword"], types: ["shoulder", "armor"], tags: ["def"], category: "combat", archetype: "defensive_stance", meta: { type: "percent_low" } },
  { id: "dmg_after_break", min: 6, max: 9, weight: 25, minRarity: "rare", combatStyle: ["hammer"], types: ["weapon"], tags: ["offense"], category: "combat", archetype: "poise", meta: { type: "combat_scale" } },
  { id: "bleed_duration", min: 0.6, max: 0.8, weight: 25, minRarity: "rare", combatStyle: ["axe", "doubleAxe"], types: ["weapon"], tags: ["offense"], category: "combat", archetype: "bleed", meta: { type: "combat_scale" } },
  { id: "energy_bleed_kill", min: 1, max: 1.2, weight: 25, minRarity: "rare", combatStyle: ["axe", "doubleAxe"], types: ["belt"], tags: ["energy"], category: "combat", archetype: "bleed" },
  { id: "pushback", min: 13, max: 15, weight: 25, minRarity: "rare", combatStyle: ["hammer", "spear", "mace"], types: ["helmet", "boots"], tags: ["sustain"], category: "combat", archetype: "poise", meta: { type: "percent_low" } },
  { id: "energy_per_stack_control", min: 0.3, max: 0.4, weight: 25, minRarity: "rare", combatStyle: ["spear"], types: ["belt"], tags: ["energy"], category: "combat", archetype: "spear_control", meta: { type: "combat_scale" } },
  { id: "stamina_per_stack_control", min: 2, max: 3, weight: 50, minRarity: "rare", combatStyle: ["spear"] ,types: ["pants"], tags: ["stamina"], category: "combat", archetype: "spear_control" },
  { id: "atkspd_after_break", min: 10, max: 12, weight: 25, minRarity: "rare", combatStyle: ["hammer"] , types: ["weapon"], tags: ["offense"], category: "combat", archetype: "poise", meta: { type: "combat_scale" } },
  { id: "loh_doubled_below_hp", min: 9, max: 11, weight: 25, minRarity: "unique", types: ["gloves"], tags: ["sustain"], category: "combat", archetype: "low_hp", meta: { type: "combat_scale" } },
  { id: "dmg_exhausted", min: 5, max: 7, weight: 25, minRarity: "unique", types: ["weapon"], tags: ["fatique"], category: "combat", archetype: "exhausted", meta: { type: "combat_scale" } },
  { id: "def_exhausted", min: 3, max: 4, weight: 50, minRarity: "unique", types: ["shoulder", "armor", "pants"], tags: ["def"], category: "combat", archetype: "exhausted", meta: { type: "percent_low" } },
  { id: "crit_exhausted", min: 4, max: 5, weight: 25, minRarity: "unique", types: ["gloves"], tags: ["crit"], category: "combat", archetype: "exhausted", meta: { type: "combat_scale" } },
  { id: "atkspd_after_dodge", min: 10, max: 13, weight: 25, minRarity: "unique", types: ["gloves", "boots"], tags: ["offense"], category: "combat", archetype: "dodge", meta: { type: "combat_scale" } },
  { id: "perfect_block_missing_hp", min: 5, max: 7, weight: 25, minRarity: "unique", combatStyle: ["sword", "axe", "mace", "longsword"], types: ["helmet", "shield"], tags: ["sustain"], category: "combat", archetype: "perfect_block", meta: { type: "percent_low" } },
  { id: "perfect_block_atkspd", min: 10, max: 12, weight: 25, minRarity: "unique", combatStyle: ["sword", "axe", "mace", "longsword"], types: ["gloves", "shield", "bracers"], tags: ["offense"], category: "combat", archetype: "perfect_block", meta: { type: "combat_scale" } },
  { id: "dmg_per_guard_stack", min: 4, max: 5, weight: 25, minRarity: "unique", combatStyle: ["sword", "axe", "mace", "longsword"], types: ["shield", "weapon"], tags: ["offense"], category: "combat", archetype: "defensive_stance", meta: { type: "combat_scale" } },
  { id: "def_per_sec_while_blocking", min: 1, max: 2, weight: 25, minRarity: "unique", combatStyle: ["sword", "axe", "mace", "longsword"], types: ["shield", "armor", "shoulder"], tags: ["def"], category: "combat", archetype: "defensive_stance", meta: { type: "percent_low" } },
  { id: "crit_while_energy_fatique", min: 5, max: 6, weight: 15, minRarity: "unique", types: ["gloves", "weapon"], tags: ["fatique"], category: "combat", archetype: "critical", meta: { type: "combat_scale" } },
  { id: "consume_guard_restore_hp", min: 2, max: 3, weight: 25, minRarity: "unique", types: ["helmet", "belt"], tags: ["sustain"], category: "combat", archetype: "defensive_stance", meta: { type: "percent_low" } },
  { id: "crit_while_bleed", min: 4, max: 5, weight: 25, minRarity: "unique", combatStyle: ["axe", "doubleAxe"], types: ["gloves"], tags: ["crit"], category: "combat", archetype: "bleed", meta: { type: "combat_scale" } },
  { id: "dmg_reduced_while_control", min: 2, max: 3, weight: 25, minRarity: "unique", combatStyle: ["spear"], types: ["shoulder", "bracers"], tags: ["def"], category: "combat", archetype: "spear_control", meta: { type: "combat_scale" } },
  { id: "dmg_per_control_stack", min: 3, max: 4, weight: 25, minRarity: "rare", combatStyle: ["spear"], types: ["weapon"], tags: ["offense"], category: "combat", archetype: "spear_control", meta: { type: "combat_scale" } },
  { id: "slow_enemy_per_control_stack", min: 2, max: 3, weight: 25, minRarity: "unique", combatStyle: ["spear"], types: ["weapon"], tags: ["offense"], category: "combat", archetype: "spear_control", meta: { type: "percent_low" } },
  { id: "crit_per_control_stack", min: 1, max: 2, weight: 25, minRarity: "unique", combatStyle: ["spear"], types: ["gloves", "weapon"], tags: ["crit"], category: "combat", archetype: "spear_control", meta: { type: "combat_scale" } },
  { id: "hp_regen_of_bleed_dmg", min: 14, max: 17, weight: 25, minRarity: "unique", types: ["helmet"], tags: ["sustain"], category: "combat", archetype: "bleed", meta: { type: "percent_low" } },
  { id: "crit_missing_hp", min: 1, max: 1.5, weight: 25, minRarity: "epic", types: ["gloves"], tags: ["crit"], category: "combat", archetype: "crit", meta: { type: "combat_scale" } },
  { id: "gain_dmg_equal_active_def_bonus", min: 13, max: 15, weight: 25, minRarity: "epic", types: ["armor", "shield", "shoulder"], tags: ["offense"], category: "combat", archetype: "special", meta: { type: "combat_scale" } },
  { id: "perfect_block_armor_break", min: 11, max: 13, weight: 25, minRarity: "epic", combatStyle: ["sword", "axe", "mace", "longsword"], types: ["shield", "bracers"], tags: ["offense"], category: "combat", archetype: "perfect_block", meta: { type: "percent_low" } },
  { id: "perfect_block_bleed", min: 2, max: 4, weight: 25, minRarity: "epic", combatStyle: ["sword", "axe", "mace", "longsword"], types: ["shield", "bracers"], tags: ["offense"], category: "combat", archetype: "perfect_block", meta: { type: "percent_low" } },
  { id: "dmg_while_energy_fatigue", min: 9, max: 11, weight: 25, minRarity: "epic", types: ["gloves"], tags: ["offense"], category: "combat", archetype: "critical", meta: { type: "combat_scale" } },
  { id: "perfect_block_remove_energy_fatigue_stack", min: 1, max: 1, weight: 25, minRarity: "epic", combatStyle: ["sword", "axe", "mace", "longsword"], types: ["shield", "belt"], tags: ["energy"], category: "combat", archetype: "perfect_block" },
  { id: "stun_after_break", min: 0.3, max: 0.5, weight: 25, minRarity: "epic", combatStyle: ["hammer"], types: ["weapon"], tags: ["offense"], category: "combat", archetype: "poise", meta: { type: "combat_scale" } },
  { id: "armor_break_after_3control_stack", min: 14, max: 17, weight: 25, minRarity: "epic", combatStyle: ["spear"], types: ["weapon"], tags: ["offense"], category: "combat", archetype: "spear_control", meta: { type: "percent_low" } },
  { id: "hp_regen_of_bleed_dmg_while_blocking", min: 8, max: 12, weight: 25, minRarity: "epic", combatStyle: ["sword", "axe", "mace", "longsword"], types: ["helmet"], tags: ["sustain"], category: "combat", archetype: "defensive_stance", meta: { type: "percent_low" } },
  { id: "loh_while_blocking", min: 12, max: 15, weight: 25, minRarity: "epic", combatStyle: ["sword", "axe", "mace", "longsword"], types: ["weapon"], tags: ["sustain"], category: "combat", archetype: "defensive_stance", meta: { type: "percent_low" } },
  { id: "bleed_duration_while_blocking", min: 0.7, max: 1, weight: 25, minRarity: "epic", combatStyle: ["sword", "axe", "mace", "longsword"], types: ["shield"], tags: ["sustain"], category: "combat", archetype: "defensive_stance", meta: { type: "percent_low" } },
  { id: "energy_after_break", min: 0.3, max: 0.4, weight: 25, minRarity: "rare", combatStyle: ["hammer"], types: ["belt", "boots"], tags: ["energy"], category: "combat", archetype: "poise", meta: { type: "combat_scale" } },
  { id: "crit_after_break", min: 5, max: 6, weight: 25, minRarity: "unique", combatStyle: ["hammer"], types: ["gloves", "weapon"], tags: ["crit"], category: "combat", archetype: "poise", meta: { type: "combat_scale" } },
  { id: "stamina_after_break", min: 1, max: 2, weight: 25, minRarity: "rare", combatStyle: ["hammer"], types: ["belt", "pants"], tags: ["stamina"], category: "combat", archetype: "poise" },
  { id: "dmg_taken_after_break", min: 6, max: 7, weight: 25, minRarity: "unique", combatStyle: ["hammer"], types: ["gloves", "weapon"], tags: ["offense"], category: "combat", archetype: "poise", meta: { type: "combat_scale" } },
  { id: "bleed_damage", min: 9, max: 11, weight: 25, minRarity: "rare", combatStyle: ["axe", "doubleAxe"], types: ["weapon"], tags: ["offense"], category: "combat", archetype: "bleed", meta: { type: "combat_scale" } },
  { id: "dmg_vs_bleeding", min: 9, max: 11, weight: 25, minRarity: "unique", combatStyle: ["axe", "doubleAxe"], types: ["weapon", "gloves"], tags: ["offense"], category: "combat", archetype: "bleed", meta: { type: "combat_scale" } },
  { id: "bleed_stack_faster", min: 9, max: 11, weight: 25, minRarity: "epic", combatStyle: ["axe", "doubleAxe"], types: ["weapon"], tags: ["offense"], category: "combat", archetype: "bleed", meta: { type: "percent_low" } },
  { id: "armor_break_duration", min: 0.2, max: 0.3, weight: 25, minRarity: "rare", combatStyle: ["longsword", "greatsword"], types: ["weapon"], tags: ["sustain"], category: "combat", archetype: "armor_break" },
  { id: "armor_break_effect", min: 7, max: 9, weight: 25, minRarity: "epic", combatStyle: ["longsword", "greatsword"], types: ["weapon"], tags: ["offense"], category: "combat", archetype: "armor_break", meta: { type: "combat_scale" } },
  { id: "energy_on_armor_break", min: 0.3, max: 0.4, weight: 25, minRarity: "rare", combatStyle: ["longsword", "greatsword"], types: ["belt"], tags: ["energy"], category: "combat", archetype: "armor_break", meta: { type: "combat_scale" } },
  { id: "dmg_vs_armor_break", min: 8, max: 10, weight: 25, minRarity: "unique", combatStyle: ["longsword", "greatsword"], types: ["weapon", "gloves"], tags: ["offense"], category: "combat", archetype: "armor_break", meta: { type: "combat_scale" } },
  { id: "crit_vs_armor_break", min: 5, max: 7, weight: 25, minRarity: "unique", combatStyle: ["longsword", "greatsword"], types: ["gloves"], tags: ["crit"], category: "combat", archetype: "armor_break", meta: { type: "combat_scale" } },
  { id: "stamina_vs_armor_break", min: 2, max: 3, weight: 50, minRarity: "unique", combatStyle: ["longsword", "greatsword"], types: ["pants"], tags: ["stamina"], category: "combat", archetype: "armor_break" },
  { id: "armor_break_refresh", min: 6, max: 8, weight: 25, minRarity: "epic", combatStyle: ["longsword", "greatsword"], types: ["weapon", "gloves"], tags: ["offense"], category: "combat", archetype: "armor_break", meta: { type: "percent_low" } },
  { id: "armor_break_on_crit", min: 9, max: 11, weight: 25, minRarity: "epic", combatStyle: ["longsword", "greatsword"], types: ["weapon", "gloves"], tags: ["offense"], category: "combat", archetype: "armor_break", meta: { type: "percent_low" } },
  { id: "def_after_armor_break", min: 3, max: 4, weight: 25, minRarity: "unique", combatStyle: ["longsword", "greatsword"], types: ["armor", "shoulder", "pants"], tags: ["def"], category: "combat", archetype: "armor_break", meta: { type: "percent_low" } },
  { id: "gain_def_below_hp", min: 3, max: 4, weight: 25, minRarity: "unique", types: ["armor", "helmet", "shield", "shoulder"], tags: ["def"], category: "combat", archetype: "low_hp", meta: { type: "percent_low" } },
  { id: "bleed_enemy_deal_less_damage", min: 4, max: 6, weight: 25, minRarity: "unique", combatStyle: ["doubleAxe", "axe"], types: ["armor", "helmet", "shield", "pants"], tags: ["def"], category: "combat", archetype: "bleed", meta: { type: "combat_scale" } },
  //{ id: "stamina_regen_exhausted", min: 0.5, max: 1, weight: 25, minRarity: "unique", types: ["pants"], tags: ["sustain"], category: "combat", archetype: "exhausted", meta: { type: "combat_scale" } },
  { id: "stamina_cost_after_dodge", min: 11, max: 12, weight: 25, minRarity: "unique", types: ["boots"], tags: ["sustain"], category: "combat", archetype: "dodge", meta: { type: "percent_low" } },
  { id: "bleed_slow", min: 12, max: 14, weight: 25, minRarity: "unique", combatStyle: ["doubleAxe", "axe"], types: ["weapon"], tags: ["offense"], category: "combat", archetype: "bleed", meta: { type: "combat_scale" } },
  { id: "bleed_per_stack_damage", min: 11, max: 13, weight: 25, minRarity: "unique", combatStyle: ["doubleAxe", "axe"], types: ["weapon"], tags: ["offense"], category: "combat", archetype: "bleed", meta: { type: "combat_scale" } },
  { id: "bleed_accelerate", min: 9, max: 11, weight: 25, minRarity: "epic", combatStyle: ["doubleAxe", "axe"], types: ["weapon"], tags: ["offense"], category: "combat", archetype: "bleed", meta: { type: "percent_low" } },
  { id: "execute_bleeding", min: 10, max: 11, weight: 25, minRarity: "epic", combatStyle: ["doubleAxe", "axe"], types: ["weapon"], tags: ["offense"], category: "combat", archetype: "bleed", meta: { type: "combat_scale" } },



]; 


function getItemName(item) {
  const data = item.nameData;
  if (!data) return "";

  // 🔥 Legendary override
  if (data.legend) {
    return getLegendaryLabel(data.legend);
  }

  const base = t(data.base);
  //console.error(`base`, base);
 
  
  // 🟦 RARE (magic prefix)
  if (item.rarity === "rare") {
    const magicPrefix = getMagicPrefix(data.base);
    return `${magicPrefix} ${base}`;
  }

  //console.error(`data.prefix, t`, data.prefix, t(data.prefix));
  
  // 🟪 UNIQUE / 🟧 EPIC
  //const prefix = data.prefix ? t(data.prefix) : "";
  const prefix = data.prefix ? getPrefix(data.prefix, data.base) : "";
  //const suffix = data.suffix ? t(data.suffix) : "";
  const suffix = data.suffix ? getSuffix(data.suffix, data.base) : "";

  return [prefix, base, suffix].filter(Boolean).join(" ");
}

const ITEM_SUBTYPES = {
  short_sword: { type: "weapon", sprite: "short-sword" },
  long_sword: { type: "weapon", sprite: "long-sword" },
  //great_sword: { type: "weapon", sprite: "great-sword" },
  axe: { type: "weapon", sprite: "axe" },
  double_axe: { type: "weapon", sprite: "double-axe" },
  mace: { type: "weapon", sprite: "mace" },
 // hammer: { type: "weapon", sprite: "hammer" },
  spear: { type: "weapon", sprite: "spear" },

  round_shield: { type: "shield", sprite: "round-shield" },
  buckler: { type: "shield", sprite: "buckler" },
  kalkan: { type: "shield", sprite: "kalkan" },
  triangle_shield: { type: "shield", sprite: "triangle-shield" },

  leather_armor: { type: "armor", sprite: "leather-armor" },
  chestplate: { type: "armor", sprite: "chestplate" },
  chainmail: { type: "armor", sprite: "chainmail" },
  plate_armor: { type: "armor", sprite: "plate-armor" },

  helmet: { type: "armor", sprite: "helmet" },
  shoulder: { type: "armor", sprite: "shoulder" },
  bracers: { type: "armor", sprite: "bracers" },
  gloves: { type: "armor", sprite: "gloves" },
  belt: { type: "armor", sprite: "belt" },
  pants: { type: "armor", sprite: "pants" },
  boots: { type: "armor", sprite: "boots" }
};


const HARD_DEFENSIVE_AFFIXES = [
  "phys_damage_reduction",
];

/*function getAffixLabel(affix) {
  const lang = currentLang;

  const t = AFFIX_TRANSLATIONS[affix.id];

  if (!t) return affix.id;

  let text = t[lang];

  if (affix.element) {
    const el = ELEMENT_TRANSLATIONS[affix.element][lang];
    text = text.replace("{element}", el);
  }

  return text;
}*/

function getAffixLabel(affix) {
  const lang = currentLang;

  const t = AFFIX_TRANSLATIONS[affix.id];

  if (!t) return affix.id;

  let text = t[lang];

  if (affix.element) {
    const el = ELEMENT_TRANSLATIONS[affix.element][lang];
    text = text.replace("{element}", el);
  }

  if (affix.value !== undefined) {
    text = text.replace("{value}", affix.value);
  }

  return text;
}

/*function getAffixLabel(affix) {
  const lang = currentLang;

  const t = AFFIX_TRANSLATIONS[affix.id];

  if (!t) return affix.id;

  let text = t[lang];

  Object.entries(affix).forEach(([key, value]) => {
    text = text.replaceAll(`{${key}}`, value);
  });

  return text;
}*/

function getAffixCodexLabel(id) {
  const t = AFFIX_CODEX_TRANSLATIONS[id];

  if (!t) return id;

  return t[currentLang];
}

function getLegendaryLabel(legendId) {
  const lang = currentLang;

  const t = LEGENDARY_NAME_MAP[legendId];

  if (!t) return legendId;

  let text = t[lang];
  
  return text;
}


function getAffixMeta(bonus) {
  const id = bonus.id || LEGACY_AFFIX_MAP[bonus.nazwa];

const LOW_PERCENT = [
    "phys_damage_reduction",
    "attack_speed_percent",
    "magic_find",
    "gold_bonus",
    "crit_chance",
    "dodge_chance",
    "life_regen_flat",
    "stamina_percent",
    "stamina_regen_percent",
    "perfect_block_window"
  ];

  return {
    scale: LOW_PERCENT.includes(id) ? "low_percent" : "normal"
  };
}

const WEAPON_STYLES = {

  /* ===================== */
  /* 1H */
  /* ===================== */

  
  sword: {
    type: "sword",
    icon: "",
    name: "style_sword_name",
    desc: "style_sword_desc",
    mech: "style_sword_mech"
  },

  axe: {
    type: "axe",
    icon: "",
    name: "style_axe_name",
    desc: "style_axe_desc",
    mech: "style_axe_mech"
  },

  longsword: {
    type: "longsword",
    icon: "",
    name: "style_longsword_name",
    desc: "style_longsword_desc",
    mech: "style_longsword_mech"
  },

  mace: {
    type: "mace",
    icon: "",
    name: "style_mace_name",
    desc: "style_mace_desc",
    mech: "style_mace_mech"
  },

  doubleAxe: {
    type: "double-axe",
    icon: "",
    name: "style_doubleaxe_name",
    desc: "style_doubleaxe_desc",
    mech: "style_doubleaxe_mech"
  },

  /* ===================== */
  /* 2H */
  /* ===================== */
  
 /* hammer: {
    type: "hammer",
    icon: "",
    name: "style_hammer_name",
    desc: "style_hammer_desc",
    mech: "style_hammer_mech"
  },*/

  spear: {
    type: "spear",
    icon: "",
    name: "style_spear_name",
    desc: "style_spear_desc",
    mech: "style_spear_mech"
  },

 /* greatsword: {
    type: "greatsword",
    icon: "",
    name: "style_greatsword_name",
    desc: "style_greatsword_desc",
    mech: "style_greatsword_mech"
  }*/
};


const implicitBySlot = {
  weapon: {
    id: "damage_percent",
    min: 8,
    max: 11,
    weight: 100
  },
  gloves: {
    id: "attack_speed_percent",
    min: 3,
    max: 4,
    weight: 100
  },
  helmet: {
    id: "life_percent",
    min: 5,
    max: 10,
    weight: 100
  },
  armor: {
    id: "armor_percent",
    min: 7,
    max: 10,
    weight: 100
  },
  shoulder: {
    id: "phys_damage_reduction",
    min: 1.5,
    max: 2.6,
    weight: 100
  },
  bracers: {
    id: "phys_damage_reduction",
    min: 1.1,
    max: 2.1,
    weight: 100
  },
  shield: {
    id: "block_chance",
    min: 3,
    max: 5,
    weight: 100
  },
  belt: [
    { id: "life_percent", min: 3, max: 6, weight: 40, tags: ["def", "sustain"] },
    //{ nazwa: "Regeneracja HP / s", min: 0.3, max: 0.6, weight: 30, tags: ["sustain"] },
    { id: "magic_find", min: 3, max: 5, weight: 20, tags: ["economy"] },
    { id: "gold_bonus", min: 4, max: 7, weight: 10, tags: ["economy"] }
  ],
  pants: {
    id: "life_percent",
    min: 4,
    max: 8,
    weight: 100
  },
  boots: [
    { id: "move_speed_percent", min: 4, max: 6, weight: 70 },
    { id: "dodge_chance", min: 5, max: 7, weight: 30 },
    { id: "slow_reduction_percent", min: 6, max: 8, weight: 10 }
  ]
};

const legendaryExclusiveAffixes = [
  {
    id: "titan_skin",
    name: "affix_titan_skin_name",
    description: "affix_titan_skin_desc",
    weight: 10,
    tags: ["defensive"],
    allowedSlots: ["armor", "helmet", "shoulders"]
  },
  {
    id: "survival_instinct",
    name: "affix_survival_instinct_name",
    description: "affix_survival_instinct_desc",
    weight: 8,
    tags: ["defensive"],
    allowedSlots: ["belt"]
  },
  {
    id: "untouched_form",
    name: "affix_untouched_form_name",
    description: "affix_untouched_form_desc",
    weight: 8,
    tags: ["defensive"],
    allowedSlots: ["armor", "pants"]
  },
  {
    id: "retribution_shield",
    name: "affix_retribution_shield_name",
    description: "affix_retribution_shield_desc",
    weight: 8,
    tags: ["defensive"],
    allowedSlots: ["shield"]
  },
  {
    id: "iron_response",
    name: "affix_iron_response_name",
    description: "affix_iron_response_desc",
    weight: 8,
    tags: ["defensive"],
    allowedSlots: ["bracers", "shield"]
  },
  {
    id: "flurry",
    name: "affix_flurry_name",
    description: "affix_flurry_desc",
    weight: 8,
    tags: ["offensive"],
    allowedSlots: ["weapon", "gloves"]
  },
  {
    id: "relentless_precision",
    name: "affix_relentless_precision_name",
    description: "affix_relentless_precision_desc",
    weight: 7,
    tags: ["offensive"],
    allowedSlots: ["weapon","gloves"]
  },
  {
    id: "accelerated_mind",
    name: "affix_accelerated_mind_name",
    description: "affix_accelerated_mind_desc",
    weight: 6,
    tags: ["utility"],
    allowedSlots: ["helmet", "belt"]
  },
  {
    id: "echo_strike",
    name: "affix_echo_strike_name",
    description: "affix_echo_strike_desc",
    weight: 5,
    tags: ["offensive"],
    allowedSlots: ["weapon"]
  },
  {
    id: "touch_of_greed",
    name: "affix_touch_of_greed_name",
    description: "affix_touch_of_greed_desc",
    weight: 4,
    tags: ["economy"],
    allowedSlots: ["gloves","belt"]
  },
  {
    id: "relic_hunter",
    name: "affix_relic_hunter_name",
    description: "affix_relic_hunter_desc",
    weight: 4,
    tags: ["economy"],
    allowedSlots: ["helmet","boots"]
  },
  {
    id: "unyielding",
    name: "affix_unyielding_name",
    description: "affix_unyielding_desc",
    weight: 1,
    tags: ["special"],
    allowedSlots: ["armor"]
  },
  {
    id: "last_breath",
    name: "affix_last_breath_name",
    description: "affix_last_breath_desc",
    weight: 1,
    tags: ["special"],
    allowedSlots: ["armor"]
  }
];

const slotBonusMultiplier = {
  armor: 1.0,        // zbroja = punkt odniesienia
  shoulder: 0.75,
  helmet: 0.6,
  pants: 0.8,
  gloves: 0.5,
  bracers: 0.55,     // karwasze
  boots: 0.55,
  shield: 0.8,
  belt: 0.4
};

const slotScaledBonuses = [
  "armor_percent",
  "phys_damage_reduction",
  "block_chance"
];

/*const synergyLimits = {
  helmet: {
    hp: 3,
    sustain: 2,
    resist: 1,
    def: 1,
    offense: 0,
    attribute: 1
  },
  shoulder: {
    sustain: 0,
    def: 2,
    resist: 1,
    hp: 2,
    economy: 0,
    attribute: 2
  }, 
  armor: {
    def: 2,
    attribute: 2,
    sustain: 1,
    hp: 1,
    resist: 1,
    economy: 0,
    offense: 0
  },
  bracers: {
    sustain: 1,
    attribute: 1,
    def: 2,
    resist: 1,
    hp: 2,
    economy: 0,
    offense: 0
  },
  gloves: {
    offense: 2,
    attribute: 1,
    hp: 2,
    economy: 1,
    def: 0,
    resist: 0,
    sustain: 1
  },
  belt: {
    hp: 2,
    attribute: 1,
    sustain: 2,
    economy: 1,
    resist: 1,
    def: 0,
    offense: 0
  },
  shield: {
    sustain: 1,
    attribute: 1,
    def: 2,
    resist: 1,
    hp: 2,
    offense: 0,
    economy: 0
  },
  pants: {
    hp: 2,        
    attribute: 1,
    def: 2,  
    resist: 1,  
    sustain: 1,
    economy: 1
  },
  boots: {
    mobility: 2,
    attribute: 1,
    sustain: 1,
    resist: 1,
    def: 0,
    offense: 0,
    hp: 1,
    economy: 1
  },
  weapon: {
    offense: 3,
    hp: 0,
    economy: 1,
    resist: 0,
    attribute: 2,
    def: 0,
    sustain: 0
  }
};*/


const synergyLimits = {
  helmet: {
    hp: 3,
    sustain: 6,
    resist: 1,
    def: 1,
    offense: 0,
    attribute: 1
  },
  shoulder: {
    sustain: 1,
    offense: 1,
    def: 4,
    resist: 1,
    hp: 2,
    economy: 0,
    attribute: 2
  }, 
  armor: {
    def: 4,
    attribute: 2,
    sustain: 1,
    hp: 1,
    resist: 1,
    economy: 0,
    offense: 2
  },
  bracers: {
    sustain: 2,
    attribute: 1,
    def: 2,
    resist: 1,
    hp: 2,
    economy: 0,
    offense: 1,
    energy: 1
  },
  gloves: {
    offense: 4,
    attribute: 1,
    hp: 2,
    economy: 1,
    def: 0,
    resist: 0,
    sustain: 2,
    crit: 1,
    fatique: 1
  },
  belt: {
    hp: 2,
    attribute: 1,
    sustain: 6,
    economy: 1,
    resist: 1,
    def: 0,
    offense: 0,
    energy: 1,
    stamina: 1
  },
  shield: {
    sustain: 2,
    attribute: 1,
    def: 2,
    resist: 1,
    hp: 2,
    offense: 2,
    economy: 0,
    energy: 1
  },
  pants: {
    hp: 2,        
    attribute: 1,
    def: 3,  
    resist: 1,  
    sustain: 3,
    economy: 1,
    stamina: 1
  },
  boots: {
    mobility: 1,
    attribute: 1,
    sustain: 2,
    resist: 1,
    def: 1,
    offense: 1,
    hp: 1,
    economy: 1,
    energy: 1,
    stamina: 1
  },
  weapon: {
    offense: 6,
    hp: 0,
    economy: 1,
    resist: 0,
    attribute: 2,
    def: 0,
    sustain: 1,
    crit: 1,
    fatique: 1
  }
};


const countByRarity = {
    rare: [1, 3],
    unique: [3, 4],
    epic: [5, 6],
    legendary: [6, 7]
  };

const affixConfig = {
  common: {
    normal: [0, 0],
    combat: [0, 0]
  },

  rare: {
    normal: [2, 3],
    combat: [0, 1]
  },

  unique: {
    normal: [3, 4],
    combat: [1, 2]
  },

  epic: {
    normal: [5, 5],
    combat: [2, 3]
  },

  legendary: {
    normal: [6, 7],
    combat: [3, 3]
  }
};

const maxResistByRarity = {
   unique: 2,
   epic: 3,
   legendary: 4
  };

const chestWeights = {
  wood: { common: 40, rare: 60 },
  iron:   { common: 20, rare: 30, unique: 50 },
  silver: { rare: 25, unique: 30, epic: 45 },
  gold:   { unique: 30, epic: 25, legendary: 45 }
};

// przykładowa tablica wag (żeby rzadkie były rzadsze)
const rarityWeights = {
  common: 65,
  rare: 22,
  unique: 10,
  epic: 2.5,
  legendary: 0.5
};

const enemyLootConfig = {
  normal: { min: 0, max: 1, multiplier: 2, force: {} },
  quest: { min: 1, max: 2, multiplier: 1, force: {} },
  elite:  { min: 3, max: 4, multiplier: 3, force: { unique: 2 } },
  mini_boss: { min: 4, max: 6, multiplier: 5, force: { epic: 1 } },
  boss:   { min: 6, max: 8, multiplier: 10, force: { legendary: 1 } }
};

const slotMultiplier = {
    helmet: 0.9,
    shoulder: 0.85,
    bracers: 0.75,
    armor: 1.6,
    pants: 1.2,
    belt: 0.5,
    gloves: 0.55,
    boots: 0.7,
    shield: 1.3
  };


const helmetProfiles = {
   hood: {
     name: "hood",
     baseArmor: 0.7,
     weight: 45,
     tags: ["light", "vit"]
   },
   cask: {
     name: "cask",
     baseArmor: 0.9,
     weight: 35,
     tags: ["light", "vit"]
   },
  steel: {
     name: "steel_cask",
     baseArmor: 1.2,
     weight: 35,
     tags: ["medium", "vit"]
   },
   helmet: {
     name: "helmet",
     baseArmor: 1.4,
     weight: 20,
     tags: ["heavy", "vit"]
   },

};

const bracerProfiles = {
   leather: {
     name: "leather_bracer",
     baseArmor: 0.8,
     weight: 60,
     tags: ["light", "vit"]
   },
   bracer: {
     name: "bracers",
     baseArmor: 1.1,
     weight: 40,
     tags: ["heavy", "vit"]
   },

};

const pantsProfiles = {
   pants: {
     name: "pants",
     baseArmor: 0.8,
     weight: 65,
     tags: ["light", "vit"]
   },
   combat: {
     name: "combat_pants",
     baseArmor: 1.1,
     weight: 35,
     tags: ["medium", "vit"]
   },

};

const bootsProfiles = {
   boots: {
     name: "boots",
     baseArmor: 0.8,
     weight: 65,
     tags: ["light", "vit"]
   },
   combat: {
     name: "combat_boots",
     baseArmor: 1.1,
     weight: 35,
     tags: ["medium", "vit"]
   },

};


const glovesProfiles = {
   leather: {
     name: "leather_gloves",
     baseArmor: 0.8,
     weight: 60,
     tags: ["medium", "vit"]
   },
   gloves: {
     name: "gloves",
     baseArmor: 1,
     weight: 40,
     tags: ["heavy", "vit"]
   },

};


const shieldProfiles = {
   round: {
     name: "round_shield",
     baseArmor: 0.75,
     block: 18,
     weight: 40,
     tags: ["light", "dex"]
   },
   buckler: {
     name: "buckler",
     baseArmor: 0.9,
     block: 24,
     weight: 30,
     tags: ["medium"]
   },
   kalkan: {
     name: "kalkan",
     baseArmor: 1.2,
     block: 32,
     weight: 20,
     tags: ["medium", "def"]
   },
   triangle: {
     name: "triangle_shield",
     baseArmor: 1.5,
     block: 38,
     weight: 10,
     tags: ["heavy", "def"]
   }
 };

const armorProfiles = {
   leather_armor: {
     name: "leather_armor",
     baseArmor: 1.4,
     weight: 40,
     tags: ["light", "dex"]
   },
   chestplate: {
     name: "chestplate",
     baseArmor: 1.5,
     weight: 30,
     tags: ["medium"]
   },
   chainmail: {
     name: "chainmail",
     baseArmor: 1.65,
     weight: 20,
     tags: ["medium", "def"]
   },
   plate_armor: {
     name: "plate_armor",
     baseArmor: 1.9,
     weight: 10,
     tags: ["heavy", "def"]
   }
 };

const PREFIXES = [
  "prefix_agile",
  "prefix_mighty",
  "prefix_enchanted",
  "prefix_forgotten",
  "prefix_empowered",
  "prefix_bloody",
  "prefix_eternal",
  "prefix_dark",
  "prefix_shining",
  "prefix_runic",
  "prefix_ominous",
  "prefix_heroic",
  "prefix_black",
  "prefix_draconic",
  "prefix_blessed"
];

const SUFFIXES = [
  "suffix_wrath",
  "suffix_fire",
  "suffix_master",
  "suffix_last_light",
  "suffix_wind",
  "suffix_shadow",
  "suffix_blood",
  "suffix_darkness",
  "suffix_void",
  "suffix_wolf",
  "suffix_storm",
  "suffix_vengeance",
  "suffix_immortality",
  "suffix_ancestors",
  "suffix_apocalypse"
];

const priceRanges = {
       common:  {min: 3,  max: 5},
       rare:    {min: 7,  max: 10},
       unique:  {min: 13, max: 20},
       epic:    {min: 24, max: 32},
       legendary: {min: 47, max: 77}
     };  
  
 const legendaryFileMap = {};

const LEGENDARY_NAMES = {

  short_sword: [
    "legend_short_sword_stormblade",
    "legend_short_sword_blade_will",
    "legend_short_sword_death_silence"
  ],

  long_sword: [
    "legend_long_sword_tracker",
    "legend_long_sword_shadow_tongue",
    "legend_long_sword_light_piercer"
  ],

  axe: [
    "legend_axe_hunger_reaper",
    "legend_axe_blood_whisper",
    "legend_axe_viking_wrath"
  ],

  /*hammer: [
    "legend_hammer_titanbane",
    "legend_hammer_final_judgement",
    "legend_hammer_stone_fury"
  ],*/

  mace: [
    "legend_mace_betrayal_bone",
    "legend_mace_undead_slayer",
    "legend_mace_fist_of_vengeance"
  ],

  round_shield: [
    "legend_round_shield_bastion_eye",
    "legend_round_shield_oath_circle",
    "legend_round_shield_loyal_guard"
  ],

  buckler: [
    "legend_buckler_night_guard",
    "legend_buckler_hand_of_justice",
    "legend_buckler_spark_of_hope"
  ],

  kalkan: [
    "legend_kalkan_giant_rib",
    "legend_kalkan_mirror_of_pain",
    "legend_kalkan_armor_of_fear"
  ],

  triangle_shield: [
    "legend_triangle_shield_wall_of_undead",
    "legend_triangle_shield_bastion_heart",
    "legend_triangle_shield_last_protection"
  ],

  leather_armor: [
    "legend_leather_shadow_skin",
    "legend_leather_wolf_breath",
    "legend_leather_bloody_trail"
  ],

  chainmail: [
    "legend_chainmail_dark_claw",
    "legend_chainmail_spider_weave",
    "legend_chainmail_thorn_steel"
  ],

  plate_armor: [
    "legend_plate_earth_core",
    "legend_plate_echo_of_war",
    "legend_plate_kings_armor"
  ],

  chestplate: [
    "legend_chestplate_carved_dawn",
    "legend_chestplate_last_bastion",
    "legend_chestplate_mark_of_power"
  ],

  helmet: [
    "legend_helmet_void_crown",
    "legend_helmet_whispers",
    "legend_helmet_ancestral_vision"
  ],

  shoulder: [
    "legend_shoulder_arm_of_wrath",
    "legend_shoulder_guard",
    "legend_shoulder_narok"
  ],

  bracers: [
    "legend_bracers_war_scars",
    "legend_bracers_earth_bind",
    "legend_bracers_will_lock"
  ],

  gloves: [
    "legend_gloves_grip_of_power",
    "legend_gloves_mist_hand",
    "legend_gloves_bone_claw"
  ],

  belt: [
    "legend_belt_protection_ring",
    "legend_belt_flamebound",
    "legend_belt_fate_weave"
  ],

  pants: [
    "legend_pants_call_leggings",
    "legend_pants_shadow_step",
    "legend_pants_wolf_stride"
  ],

  boots: [
    "legend_boots_wind_steps",
    "legend_boots_dance_of_wrath",
    "legend_boots_void_step"
  ],

  armor: [
    "legend_armor_oath",
    "legend_armor_iron_soul",
    "legend_armor_glory"
  ],

  shield: [
    "legend_shield_last_guard",
    "legend_shield_gatekeeper",
    "legend_shield_exile_watch"
  ],

  weapon: [
    "legend_weapon_horror_blade",
    "legend_weapon_war_wrath",
    "legend_weapon_blood_legacy"
  ],

  default: [
    "legend_relic_world",
    "legend_artifact_power",
    "legend_gift_of_gods"
  ]
};

function getLegendaryId(subtype) {
  const pool =
    LEGENDARY_NAMES[subtype] ||
    LEGENDARY_NAMES[ITEM_SUBTYPES[subtype]?.type] ||
    LEGENDARY_NAMES.default;

  return getRandomFrom(pool);
}

// mapa tłumaczeń PL -> EN
const spriteMap = {
  'short_sword': 'short-sword',
  'long_sword': 'long-sword',
 // 'great_sword': 'great-sword',
  'double_axe': 'double-axe',
  'spear': 'spear',
  'axe': 'axe',
  //'hammer': 'hammer',
  'mace': 'mace',
  'round_shield': 'round-shield',
  'buckler': 'buckler',
  'kalkan': 'kalkan',
  'triangle_shield': 'triangle-shield',
  'leather_armor': 'leather-armor',
  'chainmail': 'chainmail',
  'plate_armor': 'plate-armor',
  'chestplate': 'chestplate',
  'hood': 'hood',
  'cask': 'cask',
  'steel_cask': 'steel-cask',
  'helmet': 'helmet',
  'shoulder': 'shoulder',
  'bracers': 'bracers',
  'leather_bracer': 'leather-bracer',
  'gloves': 'gloves',
  'leather_gloves': 'leather-gloves',
  'belt': 'belt',
  'pants': 'pants',
  'combat_pants': 'combat-pants',
  'boots': 'boots',
  'combat_boots': 'combat-boots',
  'armor': 'armor',
  'shield': 'shield',
  'weapon': 'weapon'
};
