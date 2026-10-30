// =========================
// ENGLISH
// =========================

Object.assign(LANG.en, {

  stat_hp_title: "Health",
  stat_damage_title: "Damage",
  stat_defense_title: "Defense",

  tooltip_max_life: "Maximum Health",
  tooltip_scales_with_vitality: "Scales with Vitality",
  tooltip_die_at_zero_hp: "Character dies upon reaching 0 HP",

  tooltip_life_regeneration: "Life Regeneration",
  tooltip_per_second: "sec.",
  tooltip_active_outside_combat: "Active outside combat",
  tooltip_regen_delay: "Starts after a short delay",

  tooltip_life_on_hit: "Life on Hit",
  tooltip_for_each_hit: "for each hit",
  tooltip_scales_with_attack_speed: "Scales with attack speed",

  tooltip_base_damage: "Base Damage",
  tooltip_scales_with_strength: "Scales with Strength",
  tooltip_attacks_deal_flat_damage: "Each attack deals a fixed amount of damage",

  tooltip_combat_style: "Combat Style",

  tooltip_attack_speed: "Attack Speed",
  tooltip_attack_ready_time: "Attack readiness time",

  tooltip_critical_attack: "Critical Attack",
  tooltip_crit_no_elemental: "Does not affect elemental damage",

  tooltip_elemental_damage: "Elemental Damage",
  tooltip_elemental_no_crit: "Elemental damage is not multiplied by Critical Attack",

  tooltip_armor: "Armor",
  tooltip_reduce_physical_damage: "Reduces physical damage",
  tooltip_soft_cap: "Has diminishing returns (soft cap)",

  tooltip_dodge: "Dodge",
  tooltip_chance_to_dodge: "chance to dodge",
  tooltip_negates_damage: "Completely negates damage",

  
  stat_energy_title: "Energy",
  stat_attack_speed_title: "Attack Speed",
  stat_strength_title: "Strength",
  stat_agility_title: "Agility",

  tooltip_energy_desc_intro: "Energy determines the hero's ability to make decisions:",

  tooltip_energy_fight: "Fight -",
  tooltip_energy_chest: "Open chest -",
  tooltip_energy_shrine: "Activate Shrine -",
  tooltip_energy_step: "Next step -",

  tooltip_energy_unit: "Energy",
  tooltip_energy_unit_lower: "energy",

  tooltip_base_regeneration: "Base Regeneration",
  tooltip_per_minute: "min",

  tooltip_current_energy: "Current energy:",

  tooltip_if_energy_low: "If combat cost exceeds current energy:",

  tooltip_fatigue_weakened: "The hero fights weakened (Fatigue)",
  tooltip_fatigue_stack: "Fatigue lowers main stats and stacks during consecutive fights",

  tooltip_recovering_energy: "Recovering from low energy:",

  tooltip_remove_fatigue: "Recovering energy above combat cost removes Fatigue",
  tooltip_campfire_food_restore: "Campfires, food, and villages/towns restore energy",

  tooltip_extreme_exhaustion: "means extreme exhaustion:",
  tooltip_max_fatigue_start: "Every fight starts with maximum Fatigue",

  tooltip_attack_speed_intro: "Determines combat pace and attack execution speed.",
  tooltip_attack_speed_reduce_cd: "Reduces readiness cooldown before the next attack",
  tooltip_next_attack_time: "Time before next attack:",
  tooltip_attack_speed_no_damage: "Does not increase single hit damage",
  tooltip_attack_speed_more_hits: "Increases hit frequency and “on hit” effects",
  tooltip_attack_speed_life_on_hit: "Strongly scales with Life on Hit",

  tooltip_strength_intro: "Increases physical damage.",
  tooltip_strength_bonus: "+1 Strength = +3 physical damage",
  tooltip_strength_melee: "Improves melee attack effectiveness",
  tooltip_strength_twohanded: "Increases power and effectiveness of two-handed weapons",
  tooltip_strength_warrior: "Primary attribute for warriors",

  tooltip_agility_intro: "Increases dodge capability and improves armor.",

  tooltip_agility_dodge: "Increases chance to dodge attacks",
  tooltip_agility_dodge_bonus: "Every +10 Agility grants +1% Dodge",
  tooltip_agility_armor_bonus: "+1 Agility = +4 armor",
  tooltip_agility_defense: "Improves defensive effectiveness",
  tooltip_agility_escape: "Increases escape chance during combat",
  tooltip_agility_escape_cost: "Reduces escape cost",
  tooltip_agility_attack_ready: "Speeds up attack readiness",
  tooltip_agility_block_precision: "Improves Tactical Block precision",
  tooltip_agility_fast_enemies: "Especially effective against fast enemies",
  
  
  tooltip_stamina_title: "Stamina",
  tooltip_stamina_intro: "Stamina determines the pace and intensity of combat",
  tooltip_stamina_skills_cost: "Skills, dodges and blocks consume stamina",
  tooltip_stamina_items: "Items and abilities can increase stamina capacity and regeneration",
  tooltip_stamina_base_regen: "Base Regeneration",
  tooltip_stamina_low_penalty: "Low stamina weakens regeneration (fatigue)",
  tooltip_stamina_current_regen: "Current regeneration:",
  tooltip_stamina_fatigue_affects: "Low stamina causes fatigue, which affects",
  tooltip_stamina_block_precision: "Tactical Block precision and effectiveness",
  tooltip_stamina_defensive_stance: "Weakening the defensive line of Defensive Stance",
  tooltip_stamina_attack_speed_penalty: "Slowing down the hero's attack speed",
  tooltip_stamina_resource: "stamina",
  tooltip_stamina_exhaustion: "causes temporary exhaustion",
  tooltip_stamina_no_block_dodge: "Prevents blocking and dodging",
  tooltip_stamina_regen_paused: "Regeneration is temporarily halted",
  tooltip_stamina_crit_penalty: "Reduces critical hit effectiveness",

  tooltip_vit_title: "Vitality",
  tooltip_vit_intro: "Increases endurance and survivability in combat.",
  tooltip_vit_hp_bonus: "+1 Vitality = +5 Maximum Health",
  tooltip_vit_life_regen: "Improves life regeneration effectiveness",
  tooltip_vit_regen_scaling: "Every +10 Vitality grants +1 Life Regeneration/sec.",
  tooltip_vit_stamina_regen: "Increases stamina regeneration",
  tooltip_vit_long_fights: "Strengthens builds focused on long battles",

  tooltip_dodge_title: "Dodge",
  tooltip_dodge_intro: "Grants a chance to completely avoid enemy attacks.",
  tooltip_dodge_no_damage: "Dodged attacks deal no damage",
  tooltip_dodge_no_dot: "Prevents status effects and damage over time (DoT)",
  tooltip_dodge_vs_heavy: "Most effective against strong single strikes",
  tooltip_dodge_vs_fast: "Less reliable against multiple fast attacks",

  tooltip_per_sec: "sec.",
  
  
  stat_block_title: "Block Power",
  stat_block_no_mode: "No active shield mode.",
  stat_block_defensive: "Block (Defensive Stance)",
  stat_block_damage_reduction: "Damage reduction",
  stat_block_damage_penalty: "Reduces dealt damage",
  stat_block_attack_slow: "Slows attack speed",
  stat_tactical_block: "Tactical Block",
  stat_block_imperfect_reduction: "Damage reduction for imperfect block",
  stat_damage_reduction: "damage reduction",
  stat_block_perfect_cooldown: "Cooldown after Perfect Block",
  stat_block_no_active_mode: "No active shield mode",

  stat_defensive_stance: "Defensive Stance",
  stat_defensive_stance_desc: "an active shield stance reducing incoming damage.",
  stat_defensive_attack_penalty_intro: "While the shield is active, attacks are less effective",
  stat_damage: "Damage",
  stat_attack_speed: "Attack Speed",
  stat_defensive_potion_bonus: "Increases healing potion effectiveness by",
  stat_defensive_pressure: "Each hit taken builds pressure up to 3 stacks, allowing you to unleash a powerful attack.",
  stat_defensive_duration: "Remains active as long as the shield stance is maintained.",
  stat_defensive_stamina: "Consumes stamina every second.",
  stat_defensive_requires_shield: "Requires an equipped shield.",

  stat_tactical_block_desc: "Raise your shield briefly and block enemy attacks with precise timing.",
  stat_block_active_time: "Active duration",
  stat_block_requires_timing: "Requires quick reactions and precise timing.",
  stat_perfect_block: "Perfect Block",
  stat_perfect_block_desc: "perfectly timed enemy attack block",
  stat_normal_block: "Normal Block",
  stat_normal_block_desc: "slightly delayed timing",
  stat_perfect_block_cooldown: "Cooldown after Perfect Block",
  stat_failed_block_cooldown: "Cooldown after failed or normal block",
  stat_perfect_block_reward: "Perfect Block Reward",
  stat_randomly: "randomly",
  stat_reflect_damage: "Reflect damage",
  stat_stun_enemy: "Stun the enemy",
  stat_guaranteed_crit: "Guaranteed Critical Hit",

  
  
  stat_crit_title: "Critical Strike",
  stat_crit_desc: "Chance to deal critical damage.",
  stat_crit_min_damage: "Critical Strikes deal at least 150% increased damage",
  stat_crit_softcap: "Has a soft cap – the higher it gets, the smaller the gains",
  stat_crit_max_chance: "Effective chance never exceeds 75%",
  stat_crit_effective_chance: "Effective chance",

  stat_critdmg_title: "Critical Damage",
  stat_critdmg_desc: "Increases damage dealt by critical hits.",
  stat_critdmg_min_bonus: "Critical hits deal at least 100% bonus base damage",
  stat_critdmg_current_bonus: "Current bonus damage dealt by Critical Strikes:",
  stat_critdmg_no_chance: "Does not increase critical strike chance",
  stat_critdmg_scaling: "Scales with base damage",
  stat_critdmg_highcrit: "Especially powerful with high Critical Strike chance",

  stat_regen_title: "Life Regeneration",
  stat_regen_desc: "Regenerates life outside combat.",
  stat_regen_outside_combat: "Always active outside combat",
  stat_regen_vitality: "Scales with Vitality",

  stat_onhit_title: "Life on Hit",
  stat_onhit_desc: "Restores life with every successful attack.",
  stat_onhit_after_hit: "Activates after hitting an enemy",
  stat_onhit_attack_speed: "Scales with Attack Speed",
  stat_onhit_no_dot: "Does not work with damage over time (DoT)",

  
  stat_fire_title: "Fire Resistance",
  stat_fire_desc: "Reduces fire damage taken by the character.",
  stat_fire_reduce_damage: "Reduces damage from fire elemental attacks",
  stat_fire_reduce_dot: "Reduces burn effects (DoT)",
  stat_fire_softcap: "Has diminishing returns (soft cap)",

  stat_cold_title: "Cold Resistance",
  stat_cold_desc: "Reduces cold damage.",
  stat_cold_reduce_damage: "Reduces damage from cold elemental attacks",
  stat_cold_reduce_slow: "Reduces slowing effects",
  stat_cold_reduce_freeze: "Shortens freeze duration",
  stat_cold_softcap: "Has diminishing returns (soft cap)",

  stat_poison_title: "Poison Resistance",
  stat_poison_desc: "Reduces poison damage.",
  stat_poison_reduce_dot: "Reduces poison damage over time (DoT)",
  stat_poison_stack_protection: "Protects against stacking effects",
  stat_poison_softcap: "Has diminishing returns (soft cap)",

  stat_magic_title: "Magic Resistance",
  stat_magic_desc: "Reduces magical damage.",
  stat_magic_spells: "Works against spells and special effects",
  stat_magic_no_physical: "Does not affect physical damage",
  stat_magic_softcap: "Has diminishing returns (soft cap)",

  stat_elemental_current_res: "Current effective resistance:",
  stat_elemental_max_res: "Maximum reduction: 75%",
  
  
  stat_mf_title: "Magic Find",
  stat_mf_desc: "Increases the chance of finding better items.",
  stat_mf_enemies_chests: "Works on enemies and chests",
  stat_mf_higher_rarity: "Increases the chance of obtaining higher rarity items",

  stat_gf_title: "Gold Bonus",
  stat_gf_desc: "Increases the amount of gold gained.",
  stat_gf_enemies_chests: "Works on enemies and chests",
  stat_gf_no_trade: "Does not affect trading",
  
  
  fire_dmg_tooltip: "Fire",
  cold_dmg_tooltip: "Cold",
  poisen_dmg_tooltip: "Poisen",
  arcane_dmg_tooltip: "Magic",
  
  
  
  
});



// =========================
// POLISH
// =========================

Object.assign(LANG.pl, {

  stat_hp_title: "Życie",
  stat_damage_title: "Obrażenia",
  stat_defense_title: "Obrona",

  tooltip_max_life: "Maksymalne życie",
  tooltip_scales_with_vitality: "Skaluje się z Witalnością",
  tooltip_die_at_zero_hp: "Po osiągnięciu 0 – postać ginie",

  tooltip_life_regeneration: "Regeneracja życia",
  tooltip_per_second: "sek.",
  tooltip_active_outside_combat: "Aktywna poza walką",
  tooltip_regen_delay: "Uruchamia się po krótkim opóźnieniu",

  tooltip_life_on_hit: "Życie za trafienie",
  tooltip_for_each_hit: "za każde trafienie",
  tooltip_scales_with_attack_speed: "Skaluje się z szybkością ataku",

  tooltip_base_damage: "Obrażenia bazowe",
  tooltip_scales_with_strength: "Skalują się z Siłą",
  tooltip_attacks_deal_flat_damage: "Każdy atak zadaje stałą wartość obrażeń",

  tooltip_combat_style: "Styl Walki",

  tooltip_attack_speed: "Szybkość Ataku",
  tooltip_attack_ready_time: "Czas gotowości do ataku",

  tooltip_critical_attack: "Krytyczny Atak",
  tooltip_crit_no_elemental: "Nie wpływa na obrażenia żywiołów",

  tooltip_elemental_damage: "Obrażenia żywiołów",
  tooltip_elemental_no_crit: "Obrażenia od Żywiołów nie są mnożone przez Atak Krytyczny",

  tooltip_armor: "Pancerz",
  tooltip_reduce_physical_damage: "Redukuje obrażenia fizyczne",
  tooltip_soft_cap: "Posiada malejące korzyści (soft cap)",

  tooltip_dodge: "Unik",
  tooltip_chance_to_dodge: "szansy na unik",
  tooltip_negates_damage: "Całkowicie neguje obrażenia",

  
  stat_energy_title: "Energia",
  stat_attack_speed_title: "Szybkość Ataku",
  stat_strength_title: "Siła",
  stat_agility_title: "Zręczność",

  tooltip_energy_desc_intro: "Energia określa zdolność bohatera do podejmowania decyzji:",

  tooltip_energy_fight: "Walka -",
  tooltip_energy_chest: "Otwarcie skrzyni -",
  tooltip_energy_shrine: "Aktywacja Kapliczki -",
  tooltip_energy_step: "Następny krok -",

  tooltip_energy_unit: "Energii",
  tooltip_energy_unit_lower: "energii",

  tooltip_base_regeneration: "Bazowa Regeneracja",
  tooltip_per_minute: "min",

  tooltip_current_energy: "Aktualna energia:",

  tooltip_if_energy_low: "Jeśli koszt walki przekracza aktualną energię:",

  tooltip_fatigue_weakened: "Bohater walczy osłabiony (Zmęczenie)",
  tooltip_fatigue_stack: "Zmęczenie obniża główne statystyki i kumuluje się przy kolejnych walkach",

  tooltip_recovering_energy: "Wyjście ze stanu niskiej energii:",

  tooltip_remove_fatigue: "Odzyskanie energii powyżej kosztu walki usuwa Zmęczenie",
  tooltip_campfire_food_restore: "Ognisko, jedzenie i wioska/miasto przywracają energię",

  tooltip_extreme_exhaustion: "oznacza skrajne wyczerpanie:",
  tooltip_max_fatigue_start: "Każda walka rozpoczyna się z maksymalnym Zmęczeniem",

  tooltip_attack_speed_intro: "Określa tempo walki i szybkość wykonywania kolejnych ataków.",
  tooltip_attack_speed_reduce_cd: "Skraca czas odnowienia gotowości do następnego ataku",
  tooltip_next_attack_time: "Czas oczekiwania na kolejny atak:",
  tooltip_attack_speed_no_damage: "Nie zwiększa obrażeń pojedynczego ciosu",
  tooltip_attack_speed_more_hits: "Zwiększa częstotliwość trafień i efektów „za trafienie”",
  tooltip_attack_speed_life_on_hit: "Silnie skaluje się z Życie za Trafienie",

  tooltip_strength_intro: "Zwiększa obrażenia fizyczne.",
  tooltip_strength_bonus: "+1 Siły = +3 obrażeń fizycznych",
  tooltip_strength_melee: "Wpływa na skuteczność ataków wręcz",
  tooltip_strength_twohanded: "Zwiększa moc i skuteczność broni dwuręcznych",
  tooltip_strength_warrior: "Podstawowy atrybut dla wojowników",

  tooltip_agility_intro: "Zwiększa zdolność unikania ciosów oraz poprawia pancerz.",
  tooltip_agility_dodge: "Zwiększa szansę na unik ataku",
  tooltip_agility_dodge_bonus: "Każde +10 Zręczności daje +1% do Uniku",
  tooltip_agility_armor_bonus: "+1 Zręczności = +4 do pancerza",
  tooltip_agility_defense: "Zwiększa skuteczność obrony",
  tooltip_agility_escape: "Zwiększa szansę na udaną ucieczkę w trakcie walki",
  tooltip_agility_escape_cost: "Zmniejsza koszt ucieczki",
  tooltip_agility_attack_ready: "Przyspiesza gotowość do ataku",
  tooltip_agility_block_precision: "Zwiększa precyzje Bloku Taktycznego",
  tooltip_agility_fast_enemies: "Szczególnie skuteczna przeciwko szybkim przeciwnikom",

  
  tooltip_stamina_title: "Stamina",
  tooltip_stamina_intro: "Stamina określa tempo i intensywność walki",
  tooltip_stamina_skills_cost: "Umiejętności, uniki i bloki zużywają staminę",
  tooltip_stamina_items: "Przedmioty i umiejętności mogą zwiększać pulę i regeneracje staminy",
  tooltip_stamina_base_regen: "Bazowa Regeneracja",
  tooltip_stamina_low_penalty: "Przy niskim poziomie staminy regeneracja ulega osłabieniu (zmęczenie)",
  tooltip_stamina_current_regen: "Aktualna regeneracja:",
  tooltip_stamina_fatigue_affects: "Niska stamina powoduje zmęczenie, które wpływa na",
  tooltip_stamina_block_precision: "Precyzję Bloku Taktycznego i jego skuteczność",
  tooltip_stamina_defensive_stance: "Osłabianie lini obrony Postawy Obronnej",
  tooltip_stamina_attack_speed_penalty: "Spowolnienie tempa ataków bohatera",
  tooltip_stamina_resource: "staminy",
  tooltip_stamina_exhaustion: "powoduje chwilowe wyczerpanie",
  tooltip_stamina_no_block_dodge: "Uniemożliwia blokowanie i wykonywanie uników",
  tooltip_stamina_regen_paused: "Regeneracja zostaje chwilowo wstrzymana",
  tooltip_stamina_crit_penalty: "Obniża skuteczność trafień krytycznych",

  tooltip_vit_title: "Witalność",
  tooltip_vit_intro: "Zwiększa wytrzymałość oraz zdolność do przetrwania w walce.",
  tooltip_vit_hp_bonus: "+1 Witalności = +5 do Maksymalnego Życia",
  tooltip_vit_life_regen: "Zwiększa skuteczność regeneracji życia",
  tooltip_vit_regen_scaling: "Każde +10 Witalności to +1 Regeneracji Życia/sek.",
  tooltip_vit_stamina_regen: "Zwiększa regeneracje Staminy",
  tooltip_vit_long_fights: "Wzmacnia buildy oparte na długich walkach",

  tooltip_dodge_title: "Unik",
  tooltip_dodge_intro: "Daje szansę na całkowite uniknięcie ataku wroga.",
  tooltip_dodge_no_damage: "Uniknięty atak nie zadaje obrażeń",
  tooltip_dodge_no_dot: "Nie nakłada efektów ani obrażeń w czasie (DoT)",
  tooltip_dodge_vs_heavy: "Najskuteczniejszy przeciw silnym pojedynczym ciosom",
  tooltip_dodge_vs_fast: "Mniej stabilny przy wielu szybkich atakach",
  
  tooltip_per_sec: "sek.",
  
  
  stat_block_title: "Siła Bloku",
  stat_block_no_mode: "Brak aktywnego trybu tarczy.",
  stat_block_defensive: "Blok (Postawa Obronna)",
  stat_block_damage_reduction: "Redukcja obrażeń",
  stat_block_damage_penalty: "Zmniejsza zadawane obrażenia",
  stat_block_attack_slow: "Spowalnia atak",
  stat_tactical_block: "Blok Taktyczny",
  stat_block_imperfect_reduction: "Redukcja obrażeń za nieperfekcyjny blok",
  stat_damage_reduction: "redukcji obrażeń",
  stat_block_perfect_cooldown: "Czas odnowienia za Perfekcyjny Blok",
  stat_block_no_active_mode: "Brak aktywnego trybu tarczy",

  stat_defensive_stance: "Postawa Obronna",
  stat_defensive_stance_desc: "aktywna tarcza redukująca obrażenia.",
  stat_defensive_attack_penalty_intro: "Podczas aktywnej tarczy atak ma mniejszą skuteczność",
  stat_damage: "Obrażenia",
  stat_attack_speed: "Szybkość ataku",
  stat_defensive_potion_bonus: "Podnosi skuteczność mikstur leczniczych o",
  stat_defensive_pressure: "Każdy otrzymany cios wywiera presję, która ładuje się 3 razy, aby móc wyzwolić potężny atak.",
  stat_defensive_duration: "Działa tak długo, jak tarcza jest aktywna.",
  stat_defensive_stamina: "Zużywa staminę co sekundę.",
  stat_defensive_requires_shield: "Wymaga założonej tarczy.",

  stat_tactical_block_desc: "Aktywuj tarczę na krótki moment i zablokuj atak wroga precyzyjnym wyczuciem czasu.",
  stat_block_active_time: "Czas aktywności",
  stat_block_requires_timing: "Wymaga szybkiej reakcji i dobrego timingu.",
  stat_perfect_block: "Perfekcyjny Blok",
  stat_perfect_block_desc: "idealne trafienie w atak wroga",
  stat_normal_block: "Normalny Blok",
  stat_normal_block_desc: "lekkie spóźnienie",
  stat_perfect_block_cooldown: "Czas odnowienia po Perfekcyjnym Bloku",
  stat_failed_block_cooldown: "Czas odnowienia po nieudanym lub normalnym bloku",
  stat_perfect_block_reward: "Nagroda za Perfekcyjny Blok",
  stat_randomly: "losowo",
  stat_reflect_damage: "Odbicie obrażeń",
  stat_stun_enemy: "Ogłuszenie wroga",
  stat_guaranteed_crit: "Gwarantowany Atak Krytyczny",

  
  
  stat_crit_title: "Krytyczny Atak",
  stat_crit_desc: "Szansa na zadanie obrażeń krytycznych.",
  stat_crit_min_damage: "Ataki Krytyczne zadają zwiększone obrażenia o conajmniej 150%",
  stat_crit_softcap: "Posiada soft cap – im więcej, tym mniejszy przyrost",
  stat_crit_max_chance: "Efektywna szansa nigdy nie przekracza 75%",
  stat_crit_effective_chance: "Skuteczna szansa",

  stat_critdmg_title: "Obrażenia Krytyczne",
  stat_critdmg_desc: "Zwiększają obrażenia zadawane przez trafienia krytyczne.",
  stat_critdmg_min_bonus: "Krytyczne trafienia zadają minimum 100% bazowych obrażeń",
  stat_critdmg_current_bonus: "Aktualnie zwiększone bazowe obrażenia zadane przez Atak Krytyczny to:",
  stat_critdmg_no_chance: "Nie zwiększa szansy na trafienie krytyczne",
  stat_critdmg_scaling: "Skaluje się z obrażeniami bazowymi",
  stat_critdmg_highcrit: "Szczególnie silne przy wysokiej szansie na Krytyczny Atak",

  stat_regen_title: "Regeneracja Życia",
  stat_regen_desc: "Regeneruje życie poza walką.",
  stat_regen_outside_combat: "Działa stale poza walką",
  stat_regen_vitality: "Skaluje się z Witalnością",

  stat_onhit_title: "Życie za Trafienie",
  stat_onhit_desc: "Przywraca życie za każdy skuteczny atak.",
  stat_onhit_after_hit: "Aktywuje się po trafieniu przeciwnika",
  stat_onhit_attack_speed: "Skaluje się z Szybkością Ataku",
  stat_onhit_no_dot: "Nie działa na obrażenia w czasie (DoT)",

  
  stat_fire_title: "Odporność na Ogień",
  stat_fire_desc: "Zmniejsza obrażenia od ognia otrzymywane przez postać.",
  stat_fire_reduce_damage: "Redukuje obrażenia od ataków żywiołu ognia",
  stat_fire_reduce_dot: "Redukuje efekt burst (DoT)",
  stat_fire_softcap: "Posiada malejące korzyści (soft cap)",

  stat_cold_title: "Odporność na Zimno",
  stat_cold_desc: "Zmniejsza obrażenia od zimna.",
  stat_cold_reduce_damage: "Redukuje obrażenia od ataków żywiołu zimna",
  stat_cold_reduce_slow: "Redukuje efekt spowolnienia",
  stat_cold_reduce_freeze: "Skraca czas zamrożenia",
  stat_cold_softcap: "Posiada malejące korzyści (soft cap)",

  stat_poison_title: "Odporność na Truciznę",
  stat_poison_desc: "Zmniejsza obrażenia od trucizn.",
  stat_poison_reduce_dot: "Redukuje obrażenia w czasie zadawane przez trucizny (DoT)",
  stat_poison_stack_protection: "Chroni przed stackującymi efektami",
  stat_poison_softcap: "Posiada malejące korzyści (soft cap)",

  stat_magic_title: "Odporność na Magię",
  stat_magic_desc: "Zmniejsza obrażenia magiczne.",
  stat_magic_spells: "Działa na zaklęcia i efekty specjalne",
  stat_magic_no_physical: "Nie dotyczy obrażeń fizycznych",
  stat_magic_softcap: "Posiada malejące korzyści (soft cap)",

  stat_elemental_current_res: "Aktualna efektywna odporność:",
  stat_elemental_max_res: "Maksymalna redukcja: 75%",
  
  
  stat_mf_title: "Znajdowanie Magicznych Przedmiotów",
  stat_mf_desc: "Zwiększa szansę na wypadnięcie lepszego przedmiotu.",
  stat_mf_enemies_chests: "Działa na wrogów i skrzynie",
  stat_mf_higher_rarity: "Zwiększa szanse na zdobycie wyższej klasy przedmiotu",

  stat_gf_title: "Premia do Złota",
  stat_gf_desc: "Zwiększa ilość zdobywanego złota.",
  stat_gf_enemies_chests: "Działa na wrogów i skrzynie",
  stat_gf_no_trade: "Nie wpływa na handel",

  
  fire_dmg_tooltip: "Ogień",
  cold_dmg_tooltip: "Zimno",
  poisen_dmg_tooltip: "Trucizna",
  arcane_dmg_tooltip: "Magia",

  
  
});