const GUIDE_SECTIONS = [

  {
  id: "combat",
  title: "guide_combat_title",
  icon: "",
  content: () =>  `
    <p>
      ${t("guide_combat_intro_1")}
    </p>

    <p>
      ${t("guide_combat_intro_2")}
    </p>

    <h3>${t("guide_combat_phases_title")}</h3>

    <p>
      ${t("guide_combat_phases_1")}
    </p>

    <p>
      ${t("guide_combat_phases_2")}
    </p>

    <h3>${t("guide_combat_player_actions_title")}</h3>

    <p>
      ${t("guide_combat_player_actions")}
    </p>

    <h3>${t("guide_combat_enemy_actions_title")}</h3>

    <p>
      ${t("guide_combat_enemy_actions_intro")}
    </p>

    <div class="guide-tip">
      <div class="guide-tip-title">${t("guide_combat_attack_title")}</div>
      <div class="guide-tip-text">
        ${t("guide_combat_attack_desc")}
      </div>
    </div>

    <div class="guide-tip">
      <div class="guide-tip-title">${t("guide_combat_heavy_attack_title")}</div>
      <div class="guide-tip-text">
        ${t("guide_combat_heavy_attack_desc")}
      </div>
    </div>

    <div class="guide-tip">
      <div class="guide-tip-title">${t("guide_combat_guard_title")}</div>
      <div class="guide-tip-text">
        ${t("guide_combat_guard_desc")}
      </div>
    </div>

    <div class="guide-tip">
      <div class="guide-tip-title">${t("guide_combat_charge_title")}</div>
      <div class="guide-tip-text">
        ${t("guide_combat_charge_desc")}
      </div>
    </div>

    <div class="guide-tip">
      <div class="guide-tip-title">${t("guide_combat_skill_title")}</div>
      <div class="guide-tip-text">
        ${t("guide_combat_skill_desc")}
      </div>
    </div>
  
    <h3>${t("guide_combat_pause_escape_title")}</h3>

    <p>
      ${t("guide_combat_pause_escape_1")}
    </p>

    <p>
      ${t("guide_combat_pause_escape_2")}
    </p> 
  
    <h3>${t("guide_combat_critical_state_title")}</h3>

    <p>
      ${t("guide_combat_critical_state_1")}
    </p>

    <p>
      ${t("guide_combat_critical_state_2")}
    </p>

    <p>
      ${t("guide_combat_critical_state_3")}
    </p>

    <p>
      ${t("guide_combat_critical_state_4")}
    </p>

    <p>
      ${t("guide_combat_critical_state_5")}
    </p>

    <div class="guide-tip">
      <div class="guide-tip-title">
        ${t("guide_combat_last_chance_title")}
      </div>
      <div class="guide-tip-text">
        ${t("guide_combat_last_chance_desc")}
      </div>
    </div>

    <h3>${t("guide_combat_death_title")}</h3>

    <p>
      ${t("guide_combat_death_1")}
    </p>

    <p>
      ${t("guide_combat_death_2")}
    </p>
  `
  },


  {
  id: "timing",
  title: "guide_timing_title",
  icon: "",

  content: () => `
    <p>
      ${t("guide_timing_intro_1")}
    </p>

    <p>
      ${t("guide_timing_intro_2")}
    </p>

    <h3>${t("guide_timing_precision_title")}</h3>

    <p>
      ${t("guide_timing_precision")}
    </p>

    <div class="guide-tip">
      <div class="guide-tip-title">${t("guide_timing_perfect_title")}</div>
      <div class="guide-tip-text">
        ${t("guide_timing_perfect_desc")}
      </div>
    </div>

    <div class="guide-tip">
      <div class="guide-tip-title">${t("guide_timing_normal_title")}</div>
      <div class="guide-tip-text">
        ${t("guide_timing_normal_desc")}
      </div>
    </div>

    <div class="guide-tip">
      <div class="guide-tip-title">${t("guide_timing_miss_title")}</div>
      <div class="guide-tip-text">
        ${t("guide_timing_miss_desc")}
      </div>
    </div>

    <h3>${t("guide_timing_unique_title")}</h3>

    <p>
      ${t("guide_timing_unique_desc")}
    </p>
  `
  },


  {
  id: "defense",
  title: "guide_defense_title",
  icon: "",

  content: () => `
    <p>
      ${t("guide_defense_intro")}
    </p>

    <h3>${t("guide_defense_defensive_stance_title")}</h3>

    <p>
      ${t("guide_defense_defensive_stance_1")}
    </p>

    <p>
      ${t("guide_defense_defensive_stance_2")}
    </p>

    <p>
      ${t("guide_defense_defensive_stance_3")}
    </p>

    <div class="guide-tip">
      <div class="guide-tip-title">
        ${t("guide_defense_defensive_stance_tip_title")}
      </div>
      <div class="guide-tip-text">
        ${t("guide_defense_defensive_stance_tip")}
      </div>
    </div>

    <h3>${t("guide_defense_tactical_block_title")}</h3>

    <p>
      ${t("guide_defense_tactical_block_1")}
    </p>

    <p>
      ${t("guide_defense_tactical_block_2")}
    </p>

    <p>
      ${t("guide_defense_tactical_block_3")}
    </p>

    <div class="guide-tip">
      <div class="guide-tip-title">
        ${t("guide_defense_perfect_block_title")}
      </div>
      <div class="guide-tip-text">
        ${t("guide_defense_perfect_block_tip")}
      </div>
    </div>
  `
  },

  
  {
  id: "skills",
  title: "guide_skills_title",
  icon: "",

  content: () => `
    <p>
      ${t("guide_skills_intro")}
    </p>

    <h3>${t("guide_skills_active_title")}</h3>

    <p>
      ${t("guide_skills_active_1")}
    </p>

    <p>
      ${t("guide_skills_active_2")}
    </p>

    <p>
      ${t("guide_skills_active_3")}
    </p>

    <div class="guide-tip">
      <div class="guide-tip-title">
        ✦ ${t("guide_skills_active_tip_title")}
      </div>
      <div class="guide-tip-text">
        ${t("guide_skills_active_tip")}
      </div>
    </div>

    <p>
      ${t("guide_skills_active_4")}
    </p>

    <h3>${t("guide_skills_passive_title")}</h3>

    <p>
      ${t("guide_skills_passive_1")}
    </p>

    <p>
      ${t("guide_skills_passive_2")}
    </p>

    <p>
      ${t("guide_skills_passive_3")}
    </p>

    <div class="guide-tip">
      <div class="guide-tip-title">
        ${t("guide_skills_endurance_title")}
      </div>
      <div class="guide-tip-text">
        ${t("guide_skills_endurance_desc")}
      </div>
    </div>

    <div class="guide-tip">
      <div class="guide-tip-title">
        ${t("guide_skills_precision_title")}
      </div>
      <div class="guide-tip-text">
        ${t("guide_skills_precision_desc")}
      </div>
    </div>

    <div class="guide-tip">
      <div class="guide-tip-title">
        ${t("guide_skills_brutality_title")}
      </div>
      <div class="guide-tip-text">
        ${t("guide_skills_brutality_desc")}
      </div>
    </div>

    <h3>${t("guide_skills_focus_title")}</h3>

    <p>
      ${t("guide_skills_focus_1")}
    </p>

    <p>
      ${t("guide_skills_focus_2")}
    </p>

    <p>
      ${t("guide_skills_focus_3")}
    </p>

    <div class="guide-tip">
      <div class="guide-tip-title">
        ◈ ${t("guide_skills_focus_tip_title")}
      </div>
      <div class="guide-tip-text">
        ${t("guide_skills_focus_tip")}
      </div>
    </div>
  `
  },

  {
  id: "statuses",
  title: "guide_statuses_title",
  icon: "",

  content: () => `
    <p>
      ${t("guide_statuses_intro")}
    </p>

    <h3>${t("guide_statuses_negative_title")}</h3>

    <div class="guide-status">
      <img data-src="img/icons/mark-icon.png">
      <div>
        <strong>${t("status_mark_title")}</strong>
        <span>${t("status_mark_desc")}</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/icons/bleed-icon.png">
      <div>
        <strong>${t("status_bleed_title")}</strong>
        <span>${t("status_bleed_desc")}</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/icons/burn-icon.png">
      <div>
        <strong>${t("status_burn_title")}</strong>
        <span>${t("status_burn_desc")}</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/icons/poison-icon.png">
      <div>
        <strong>${t("status_poison_title")}</strong>
        <span>${t("status_poison_desc")}</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/icons/skill-slow-icon.png">
      <div>
        <strong>${t("status_slow_title")}</strong>
        <span>${t("status_slow_desc")}</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/icons/skill-stun-icon.png">
      <div>
        <strong>${t("status_stun_title")}</strong>
        <span>${t("status_stun_desc")}</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/icons/exhausted-bonus-icon3.png">
      <div>
        <strong>${t("status_exhausted_title")}</strong>
        <span>${t("status_exhausted_desc")}</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/icons/vulnerable-bonus-icon2.png">
      <div>
        <strong>${t("status_vulnerable_title")}</strong>
        <span>${t("status_vulnerable_desc")}</span>
      </div>
    </div>

    <h3>${t("guide_statuses_combat_title")}</h3>

    <div class="guide-status">
      <img data-src="img/icons/guard-windup-icon.png">
      <div>
        <strong>${t("status_guard_title")}</strong>
        <span>${t("status_guard_desc")}</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/icons/charge-windup-icon.png">
      <div>
        <strong>${t("status_charge_title")}</strong>
        <span>${t("status_charge_desc")}</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/icons/spear-control-icon.png">
      <div>
        <strong>${t("status_control_title")}</strong>
        <span>${t("status_control_desc")}</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/icons/armor-break-icon.png">
      <div>
        <strong>${t("status_armor_break_title")}</strong>
        <span>${t("status_armor_break_desc")}</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/icons/weak-point-bonus-icon.png">
      <div>
        <strong>${t("status_weak_point_title")}</strong>
        <span>${t("status_weak_point_desc")}</span>
      </div>
    </div>

    <h3>${t("guide_statuses_buffs_title")}</h3>

    <div class="guide-status">
      <img data-src="img/icons/crit-bonus-icon.png">
      <div>
        <strong>${t("status_crit_title")}</strong>
        <span>${t("status_crit_desc")}</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/icons/atkspd-bonus-icon2.png">
      <div>
        <strong>${t("status_attack_speed_title")}</strong>
        <span>${t("status_attack_speed_desc")}</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/icons/dmg-bonus-icon.png">
      <div>
        <strong>${t("status_damage_bonus_title")}</strong>
        <span>${t("status_damage_bonus_desc")}</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/icons/dmg-reduction-icon.png">
      <div>
        <strong>${t("status_damage_reduction_title")}</strong>
        <span>${t("status_damage_reduction_desc")}</span>
      </div>
    </div>

    <h3>${t("guide_statuses_discipline_title")}</h3>

    <p>
      ${t("guide_statuses_discipline_intro")}
    </p>

    <div class="guide-status">
      <img data-src="img/icons/bleed-skill-icon.png">
      <div>
        <strong>${t("status_blood_reaver_title")}</strong>
        <span>${t("status_blood_reaver_desc")}</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/icons/discipline-bonus-icon.png">
      <div>
        <strong>${t("status_spear_discipline_title")}</strong>
        <span>${t("status_spear_discipline_desc")}</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/icons/absolute-bonus-icon.png">
      <div>
        <strong>${t("status_absolute_control_title")}</strong>
        <span>${t("status_absolute_control_desc")}</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/icons/parry-master-bonus-icon.png">
      <div>
        <strong>${t("status_parry_master_title")}</strong>
        <span>${t("status_parry_master_desc")}</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/icons/bastion-bonus-icon.png">
      <div>
        <strong>${t("status_last_bastion_title")}</strong>
        <span>${t("status_last_bastion_desc")}</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/icons/precision-bonus-icon.png">
      <div>
        <strong>${t("status_precision_title")}</strong>
        <span>${t("status_precision_desc")}</span>
      </div>
    </div>
  `
  },


  {
  id: "items",
  title: "guide_items_title",
  icon: "",
  content: () => `
    <p>${t("guide_items_intro")}</p>

    <h3>${t("guide_items_rarity_title")}</h3>

    <p>${t("guide_items_rarity_intro")}</p>

    <div class="guide-tip">
      <div class="guide-tip-title" style="color: #7f7970;">
        ${t("item_rarity_common_title")}
      </div>
      <div class="guide-tip-text">
        ${t("item_rarity_common_desc")}
      </div>
    </div>

    <div class="guide-tip">
      <div class="guide-tip-title" style="color: #106faf;">
        ${t("item_rarity_magic_title")}
      </div>
      <div class="guide-tip-text">
        ${t("item_rarity_magic_desc")}
      </div>
    </div>

    <div class="guide-tip">
      <div class="guide-tip-title" style="color: #c89212;">
        ${t("item_rarity_unique_title")}
      </div>
      <div class="guide-tip-text">
        ${t("item_rarity_unique_desc")}
      </div>
    </div>

    <div class="guide-tip">
      <div class="guide-tip-title" style="color: #7b1e61;">
        ${t("item_rarity_epic_title")}
      </div>
      <div class="guide-tip-text">
        ${t("item_rarity_epic_desc")}
      </div>
    </div>

    <div class="guide-tip">
      <div class="guide-tip-title" style="color: #dc6201;">
        ${t("item_rarity_legendary_title")}
      </div>
      <div class="guide-tip-text">
        ${t("item_rarity_legendary_desc")}
      </div>
    </div>

    <h3>${t("guide_items_affixes_title")}</h3>

    <p>${t("guide_items_affixes_intro")}</p>

    <p>${t("guide_items_combat_affixes_intro")}</p>

    <div class="guide-tip">
      <div class="guide-tip-title">
        ${t("item_combat_affixes_title")}
      </div>
      <div class="guide-tip-text">
        ${t("item_combat_affixes_desc")}
      </div>
    </div>

    <h3>${t("guide_items_slots_title")}</h3>

    <p>${t("guide_items_slots_intro")}</p>

    <div class="guide-status">
      <img data-src="img/items/short-sword.png">
      <div>
        <strong>${t("item_slot_weapon_title")}</strong>
        <span>${t("item_slot_weapon_desc")}</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/items/triangle-shield.png">
      <div>
        <strong>${t("item_slot_shield_title")}</strong>
        <span>${t("item_slot_shield_desc")}</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/items/plate-armor.png">
      <div>
        <strong>${t("item_slot_armor_title")}</strong>
        <span>${t("item_slot_armor_desc")}</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/items/long-sword.png">
      <div>
        <strong>${t("item_slot_shoulders_title")}</strong>
        <span>${t("item_slot_shoulders_desc")}</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/items/helmet.png">
      <div>
        <strong>${t("item_slot_helmet_title")}</strong>
        <span>${t("item_slot_helmet_desc")}</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/items/bracers.png">
      <div>
        <strong>${t("item_slot_bracers_title")}</strong>
        <span>${t("item_slot_bracers_desc")}</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/items/gloves.png">
      <div>
        <strong>${t("item_slot_gloves_title")}</strong>
        <span>${t("item_slot_gloves_desc")}</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/items/belt.png">
      <div>
        <strong>${t("item_slot_belt_title")}</strong>
        <span>${t("item_slot_belt_desc")}</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/items/pants.png">
      <div>
        <strong>${t("item_slot_pants_title")}</strong>
        <span>${t("item_slot_pants_desc")}</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/items/boots.png">
      <div>
        <strong>${t("item_slot_boots_title")}</strong>
        <span>${t("item_slot_boots_desc")}</span>
      </div>
    </div>

    <h3>${t("guide_items_weapon_styles_title")}</h3>

    <p>${t("guide_items_weapon_styles_intro")}</p>

    <div class="guide-tip">
      <img data-src="img/items/short-sword.png">
      <div class="guide-tip-title">
        ${t("weapon_style_sword_title")}
      </div>
      <div class="guide-tip-text">
        ${t("weapon_style_sword_desc")}
      </div>
    </div>

    <div class="guide-tip">
      <img data-src="img/items/axe.png">
      <div class="guide-tip-title">
        ${t("weapon_style_axe_title")}
      </div>
      <div class="guide-tip-text">
        ${t("weapon_style_axe_desc")}
      </div>
    </div>

    <div class="guide-tip">
      <img data-src="img/items/long-sword.png">
      <div class="guide-tip-title">
        ${t("weapon_style_longsword_title")}
      </div>
      <div class="guide-tip-text">
        ${t("weapon_style_longsword_desc")}
      </div>
    </div>

    <div class="guide-tip">
      <img data-src="img/items/mace.png">
      <div class="guide-tip-title">
        ${t("weapon_style_mace_title")}
      </div>
      <div class="guide-tip-text">
        ${t("weapon_style_mace_desc")}
      </div>
    </div>

    <div class="guide-tip">
      <img data-src="img/items/double-axe.png">
      <div class="guide-tip-title">
        ${t("weapon_style_double_axe_title")}
      </div>
      <div class="guide-tip-text">
        ${t("weapon_style_double_axe_desc")}
      </div>
    </div>
    
    <div class="guide-tip">
      <img data-src="img/items/spear.png">
      <div class="guide-tip-title">
        ${t("weapon_style_spear_title")}
      </div>
      <div class="guide-tip-text">
        ${t("weapon_style_spear_desc")}
      </div>
    </div>
    
    <div class="guide-tip">
      <img data-src="img/items/hammern.png">
      <div class="guide-tip-title">
        ${t("weapon_style_hammer_title")}
      </div>
      <div class="guide-tip-text">
        ${t("weapon_style_hammer_desc")}
      </div>
    </div>
    
    <div class="guide-tip">
      <img data-src="img/items/great-swordn.png">
      <div class="guide-tip-title">
        ${t("weapon_style_greatsword_title")}
      </div>
      <div class="guide-tip-text">
        ${t("weapon_style_greatsword_desc")}
      </div>
    </div>

    <h3>${t("guide_items_legendary_title")}</h3>

    <p>${t("guide_items_legendary_intro")}</p>

    <h3>${t("guide_items_codex_title")}</h3>

    <p>${t("guide_items_codex_intro")}</p>
  `
  },


 {
  id: "disciplines",
  title: "guide_disciplines_title",
  icon: "",
  content: () => `
    <p>${t("guide_disciplines_intro_1")}</p>

    <p>${t("guide_disciplines_intro_2")}</p>

    <h3>${t("discipline_bulwark_title")}</h3>

    <p>${t("discipline_bulwark_desc_1")}</p>

    <p>${t("discipline_bulwark_desc_2")}</p>

    <p>${t("discipline_bulwark_desc_3")}</p>

    <div class="guide-tip">
      <div class="guide-tip-title">
        ${t("discipline_bulwark_tip_title")}
      </div>
      <div class="guide-tip-text">
        ${t("discipline_bulwark_tip_desc")}
      </div>
    </div>

    <h3>${t("discipline_duelist_title")}</h3>

    <p>${t("discipline_duelist_desc_1")}</p>

    <p>${t("discipline_duelist_desc_2")}</p>

    <p>${t("discipline_duelist_desc_3")}</p>

    <div class="guide-tip">
      <div class="guide-tip-title">
        ${t("discipline_duelist_tip_title")}
      </div>
      <div class="guide-tip-text">
        ${t("discipline_duelist_tip_desc")}
      </div>
    </div>

    <h3>${t("discipline_berserker_title")}</h3>

    <p>${t("discipline_berserker_desc_1")}</p>

    <p>${t("discipline_berserker_desc_2")}</p>

    <p>${t("discipline_berserker_desc_3")}</p>

    <div class="guide-tip">
      <div class="guide-tip-title">
        ${t("discipline_berserker_tip_title")}
      </div>
      <div class="guide-tip-text">
        ${t("discipline_berserker_tip_desc")}
      </div>
    </div>

    <h3>${t("discipline_sentinel_title")}</h3>

    <p>${t("discipline_sentinel_desc_1")}</p>

    <p>${t("discipline_sentinel_desc_2")}</p>

    <p>${t("discipline_sentinel_desc_3")}</p>

    <p>${t("discipline_sentinel_desc_4")}</p>

    <div class="guide-tip">
      <div class="guide-tip-title">
        ${t("discipline_sentinel_tip_title")}
      </div>
      <div class="guide-tip-text">
        ${t("discipline_sentinel_tip_desc")}
      </div>
    </div>
  `
  },


  {
  id: "progression",
  title: "guide_progression_title",
  icon: "",
  content: () => `
    <p>${t("guide_progression_intro_1")}</p>

    <p>${t("guide_progression_intro_2")}</p>

    <h3>${t("progression_character_level_title")}</h3>

    <p>${t("progression_character_level_desc")}</p>

    <h3>${t("progression_attributes_title")}</h3>

    <p>${t("progression_attributes_intro")}</p>

    <div class="guide-tip">
      <div class="guide-tip-title">
        ${t("attribute_strength_title")}
      </div>
      <div class="guide-tip-text">
        ${t("attribute_strength_desc")}
      </div>
    </div>

    <div class="guide-tip">
      <div class="guide-tip-title">
        ${t("attribute_dexterity_title")}
      </div>
      <div class="guide-tip-text">
        ${t("attribute_dexterity_desc")}
      </div>
    </div>

    <div class="guide-tip">
      <div class="guide-tip-title">
        ${t("attribute_vitality_title")}
      </div>
      <div class="guide-tip-text">
        ${t("attribute_vitality_desc")}
      </div>
    </div>

    <h3>${t("progression_skill_points_title")}</h3>

    <p>${t("progression_skill_points_desc_1")}</p>

    <p>${t("progression_skill_points_desc_2")}</p>

    <h3>${t("progression_mastery_title")}</h3>

    <p>${t("progression_mastery_desc_1")}</p>

    <p>${t("progression_mastery_desc_2")}</p>

    <div class="guide-tip">
      <div class="guide-tip-title">
        ${t("progression_mastery_tip_title")}
      </div>
      <div class="guide-tip-text">
        ${t("progression_mastery_tip_desc")}
      </div>
    </div>

    <h3>${t("progression_equipment_title")}</h3>

    <p>${t("progression_equipment_desc_1")}</p>

    <p>${t("progression_equipment_desc_2")}</p>
  `
  },


  {
  id: "exploration",
  title: "guide_exploration_title",
  icon: "",
  content: () => `
    <p>
      ${t("guide_exploration_intro_1")}
    </p>

    <p>
      ${t("guide_exploration_intro_2")}
    </p>

    <h3>${t("guide_exploration_fields_title")}</h3>

    <p>
      ${t("guide_exploration_fields_intro")}
    </p>

    <div class="guide-tip">
      <div class="guide-tip-title">${t("exploration_field_enemy_title")}</div>
      <div class="guide-tip-text">
        ${t("exploration_field_enemy_desc")}
      </div>
    </div>

    <div class="guide-tip">
      <div class="guide-tip-title">${t("exploration_field_shrine_title")}</div>
      <div class="guide-tip-text">
        ${t("exploration_field_shrine_desc")}
      </div>
    </div>

    <div class="guide-tip">
      <div class="guide-tip-title">${t("exploration_field_chest_title")}</div>
      <div class="guide-tip-text">
        ${t("exploration_field_chest_desc")}
      </div>
    </div>

    <div class="guide-tip">
      <div class="guide-tip-title">${t("exploration_field_story_character_title")}</div>
      <div class="guide-tip-text">
        ${t("exploration_field_story_character_desc")}
      </div>
    </div>

    <div class="guide-tip">
      <div class="guide-tip-title">${t("exploration_field_story_event_title")}</div>
      <div class="guide-tip-text">
        ${t("exploration_field_story_event_desc")}
      </div>
    </div>

    <h3>${t("guide_exploration_energy_title")}</h3>

    <p>
      ${t("guide_exploration_energy_desc_1")}
    </p>

    <p>
      ${t("guide_exploration_energy_desc_2")}
    </p>

    <h3>${t("guide_exploration_campfire_title")}</h3>

    <p>
      ${t("guide_exploration_campfire_desc_1")}
    </p>

    <p>
      ${t("guide_exploration_campfire_desc_2")}
    </p>

    <h3>${t("guide_exploration_fatigue_title")}</h3>

    <p>
      ${t("guide_exploration_fatigue_desc_1")}
    </p>

    <p>
      ${t("guide_exploration_fatigue_desc_2")}
    </p>

    <p>
      ${t("guide_exploration_fatigue_desc_3")}
    </p>

    <div class="guide-tip">
      <div class="guide-tip-title">${t("exploration_fatigue_tip_title")}</div>
      <div class="guide-tip-text">
        ${t("exploration_fatigue_tip_desc")}
      </div>
    </div>

    <h3>${t("guide_exploration_story_mode_title")}</h3>

    <p>
      ${t("guide_exploration_story_mode_desc_1")}
    </p>

    <p>
      ${t("guide_exploration_story_mode_desc_2")}
    </p>

    <p>
      ${t("guide_exploration_story_mode_desc_3")}
    </p>

    <h3>${t("guide_exploration_adventure_mode_title")}</h3>

    <p>
      ${t("guide_exploration_adventure_mode_desc_1")}
    </p>

    <p>
      ${t("guide_exploration_adventure_mode_desc_2")}
    </p>

    <div class="guide-tip">
      <div class="guide-tip-title">${t("exploration_adventure_mode_tip_title")}</div>
      <div class="guide-tip-text">
        ${t("exploration_adventure_mode_tip_desc")}
      </div>
    </div>

    <h3>${t("guide_exploration_planning_title")}</h3>

    <p>
      ${t("guide_exploration_planning_desc_1")}
    </p>

    <p>
      ${t("guide_exploration_planning_desc_2")}
    </p>
  `
  },


];


function renderGuide() {
  const popup = document.getElementById("guide-popup");
  const popupContent = popup.querySelector(".popup-content");
  const content = document.getElementById("guide-popup-content");

  if (!popup) return;

  setPopupBackground2(popupContent, `turtle`);

  const closeUrl = assetManager.getResolvedAsset(`img/buttons/close-btn.png`);

  content.innerHTML = `

    <div class="guide">

      <div class="guide-header">
        <div class="guide-tabs">
          ${GUIDE_SECTIONS.map(section => `
            <button
              class="guide-tab"
              data-guide="${section.id}">
              <span class="guide-tab-icon">${section.icon}</span>
              <span>${t(section.title)}</span>
            </button>
          `).join("")}
        </div>
      </div>


      <div class="guide-scroll">

        <div
          class="guide-content"
          id="guide-content">
        </div>

      </div>

    </div> 
  `;


  // =========================
  // BUTTONS
  // =========================

  content
    .querySelectorAll("[data-guide]")
    .forEach(button => {

      button.addEventListener("click", () => {

        playSound("menu", 1, 1, 0.65);

        const sectionId =
          button.dataset.guide;

        renderGuideSection(sectionId);
      });

    });

 // applyImageFallback(content);
 
   
  // pierwsza sekcja
  renderGuideSection(GUIDE_SECTIONS[0].id);
  
  playSound("open", 0.4);
   
  popup.classList.remove("hidden");
 
}

 

 function closeGuidePopup() {
   document.getElementById("guide-popup").classList.add("hidden");
 }


function renderGuideSection(sectionId) {
  const section =
    GUIDE_SECTIONS.find(
      section => section.id === sectionId
    );

  if (!section) return;

  const content =
    document.getElementById("guide-content");

  if (!content) return;


  // aktywny przycisk
  document
    .querySelectorAll("[data-guide]")
    .forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.guide === sectionId
      );

    });

  
    
  
  const sectionContent =
    typeof section.content === "function"
      ? section.content()
      : section.content;

  content.innerHTML = `
    <div class="guide-title">
      <span class="guide-title-icon">
        ${section.icon}
      </span>
  
      <span>
        ${t(section.title)}
      </span>
    </div>

    <div class="guide-body">
      ${sectionContent}
    </div>
  `;
  
  
 /* content.innerHTML = `

    <div class="guide-title">

      <span class="guide-title-icon">
        ${section.icon}
      </span>

      <span>
        ${section.title}
      </span>

    </div>

    <div class="guide-body">
      ${section.content}
    </div>

  `;*/
  
  initializeCharacterImages();
 
  applyImageFallback(content);
 
  // zawsze zaczynamy od początku
  const scroll =
    document.querySelector(".guide-scroll");

  if (scroll) {
    scroll.scrollTop = 0;
  }
}



