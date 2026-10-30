/* =========================================
   localization-skills.js
   NAZWY I OPISY UMIEJĘTNOŚCI
========================================= */

  
Object.assign(LANG.en, {
    
  focus_skill_name: "Focus",
  focus_skill_desc: "You sharpen your focus, reading the flow of battle. Time slows for {slowmo-duration}, giving you the edge to act with perfect precision.",

  power_attack_skill_name: "Power Attack",
  power_attack_skill_desc: "You unleash a crushing strike, dealing {damage} weapon damage. Enemies slowed or stunned take an additional {bonus-vs-status} damage.",
  
  double_attack_skill_name: "Double Strike",
  double_attack_skill_desc: "You chain two swift strikes, each dealing {damage} weapon damage and inflicting bleeding for {bleed-duration}",
  
  charge_skill_name: "Charge",
  charge_skill_desc: "You surge forward, slamming into your target for {damage} weapon damage and stunning them for {stun} A stunned enemy takes {bonus-damage} increased weapon damage from your next attack.",
  
  jump_skill_name: "Leaping Strike",
  jump_skill_desc: "You leap into the air and crash down upon your enemy, dealing {damage} weapon damage, slowing them for {slow}, and breaking their armor, causing them to take {armor-break} increased damage for {slow-duration}",
  
  shout_skill_name: "War Cry",
  shout_skill_desc: "You let out a fierce war cry, empowering yourself to deal {damage-buff} increased damage for {shout-duration}",
  
  
  shield_bash_skill_name: "Shield Bash",
  shield_bash_skill_desc: "You slam your shield into the enemy, dealing {damage} damage and stunning them for {stun}.",

  shield_wall_skill_name: "Shield Wall",
  shield_wall_skill_desc: "You raise your shield into an impenetrable stance, increasing your defense by {def-buff} for {def-buff-duration}.",
  
  counter_strike_skill_name: "Counter Strike",
  counter_strike_skill_desc: "While blocking, for {counter-duration} you retaliate against your enemy with a powerful counterattack, dealing {counter-strike} damage and recovering {stamina-recover} stamina.",

  iron_will_skill_name: "Iron Will",
  iron_will_skill_desc: "Your determination breaks through all limitations caused by active shield for 5 sec. Active blocking cost you {blocking-cost} less stamina.",
  
  provocation_skill_name: "Provocation",
  provocation_skill_desc: "You challenge your enemy with a fierce taunt, forcing them to focus their aggression on you. The enemy becomes vulnerable for {vulnerable-duration}",

  last_bastion_skill_name: "Last Bastion",
  last_bastion_skill_desc: "You become the final line of defense, increasing your defense by {def-buff} for {def-buff-duration} and empowering your next attack to deal {buff-next-attack} increased damage. Additionally, blocking with a shield does not consume stamina.",
  
  riposte_skill_name: "Riposte",
  riposte_skill_desc: "You instantly counterattack after a successful block, dealing {damage} increased damage. After a Perfect Block, Riposte is guaranteed to critically strike.",
  
  opening_strike_skill_name: "Opening Strike",
  opening_strike_skill_desc: "You strike at the enemy's defenses, increasing their next wind-up by {open-windup} and making them Vulnerable for the duration. The extended wind-up slows the timing indicator, making the next Perfect Block easier to perform.",
  
  precision_skill_name: "Precision",
  precision_skill_desc: "You enter a state of heightened precision for {precision-duration}. While active, your skills are empowered by {precision-buff} by your current Precision stacks. The more Precision stacks you have, the stronger their effects become.",
  
  parry_master_skill_name: "Parry Master",
  parry_master_skill_desc: "For 4 sec., each Perfect Block reduces the remaining cooldown of your skills by {reduce-cooldown} and your shield cooldown by {reduce-shield-cooldown}. Activating Parry Master immediately reduces the current shield cooldown. Each Perfect Block refreshes its duration.",
  
  weak_point_skill_name: "Weak Point",
  weak_point_skill_desc: "You expose a weak point in the enemy's defenses for {vulnerable-duration}, increasing your Critical Chance by {crit-buff} and Critical Damage by {crit-dmg-buff} against the marked enemy.",
  
  perfect_execution_skill_name: "Perfect Execution",
  perfect_execution_skill_desc: "You deliver a devastating finishing strike that is guaranteed to critically strike. The attack deals {damage} increased damage and deals 25% additional damage against Vulnerable enemies. Perfect Execution requires 5 Precision stacks and consumes all 5 stacks when used.",
  
  piercing_thrust_skill_name: "Piercing Thrust",
  piercing_thrust_skill_desc: "You drive your spear deep into the enemy, dealing {damage} damage, gaining 1 Control stack and pushing the enemy back by {pushback} of their current cooldown.",

  sweep_skill_name: "Sweep",
  sweep_skill_desc: "You perform a wide sweeping strike that gains 2 Control stacks, slows the enemy by 30% for {sweep-duration}, and extends their next Wind-up by {windup}.",

  impale_skill_name: "Impale",
  impale_skill_desc: "You consume All Control stacks to unleash a devastating thrust, dealing {damage} damage with a guaranteed Critical Hit and applying Vulnerable to the enemy.",

  control_shatter_skill_name: "Control Shatter",
  control_shatter_skill_desc: "You shatter the enemy's defenses, consuming your Control to interrupt their action and immediately cancel their Wind-up, Charge, or Guard.",

  spear_discipline_skill_name: "Spear Discipline",
  spear_discipline_skill_desc: "You enter a state of disciplined control for {discipline-duration}. While active, Perfect Hit grants 2 Control stacks instead of 1, while a Miss only removes 1 Control stack, instead of reset all of it.",

  absolute_control_skill_name: "Absolute Control",
  absolute_control_skill_desc: "You enter a state of absolute control for {absolute-duration}. While active, your Control is locked and cannot expire or be lost. Perfect Hit extends the duration of Absolute Control by 1.5 sec.",
  
  twin_slash_skill_name: "Twin Slash",
  twin_slash_skill_desc: "You strike twice in rapid succession, dealing {damage} damage with each hit and applying {bleed} Bleed for {bleed-duration}. Each hit leaves the enemy bleeding, setting the stage for your blood-fueled abilities.",
  
  blood_frenzy_skill_name: "Blood Frenzy",
  blood_frenzy_skill_desc: "You enter a blood-fueled frenzy for {frenzy-duration}. While active, each Bleed tick increases your Attack Speed by {attack-speed}. Blood Frenzy can only be activated while the enemy is Bleeding.",

  whirlwind_skill_name: "Whirlwind",
  whirlwind_skill_desc: "You unleash a relentless spinning assault for several seconds, striking the enemy repeatedly. Each hit deals {whirlwind} damage and can apply {bleed} Bleed, allowing you to rapidly build up bleeding on enemy.",

  blood_pact_skill_name: "Blood Pact",
  blood_pact_skill_desc: "You sacrifice {hp-cost} of your maximum Health to enter a blood pact. You gain {damage-buff} increased damage and {crit-buff-pact} Critical Chance. All active Bleeds on the enemy are extended by 5 seconds.",

  blood_reaver_skill_name: "Blood Reaver",
  blood_reaver_skill_desc: "For {reaver-duration}, you feed on the enemy's bleeding wounds. A {heal-convert} of the damage dealt by each Bleed tick is converted into Health, increased by the number of active Bleed stacks and Rage stacks.",

  executioner_skill_name: "Executioner",
  executioner_skill_desc: "You unleash a devastating finishing strike that is guaranteed to critically strike. The attack deals {damage} damage and consumes all 5 Rage stacks. The enemy's remaining Bleed damage erupts at once, dealing all remaining Bleed damage immediately.",
  
  
  
  
  extra_life_skill_name: "Endurance",
  extra_life_skill_desc: "Your body grows unnaturally resilient, increasing your maximum health by {life-bonus}",
  
  extra_defense_skill_name: "Unyielding",
  extra_defense_skill_desc: "Your armor increases by {def-bonus} Nothing can break your resolve.",

  max_defense_skill_name: "Hardened Skin",
  max_defense_skill_desc: "Your armor becomes more effective, increasing its power by {max-def-bonus}. Your skin hardens like that of a seasoned beast.",

  iron_defense_skill_name: "Iron Stance",
  iron_defense_skill_desc: "After taking damage, the next enemy attack deals {dmg-reduction} reduced damage. This effect can trigger once every {cooldown}",

  stack_defense_skill_name: "Unbreakable Wall",
  stack_defense_skill_desc: "Each hit you endure grants {stack-def} armor for {stack-duration} This effect stacks up to 5 times. The longer you fight, the harder you are to break.",

  extra_damage_skill_name: "Superhuman Strength",
  extra_damage_skill_desc: "Your strength surpasses mortal limits, increasing your weapon damage by {dmg-bonus}",

  extra_stamina_skill_name: "Endless Strife",
  extra_stamina_skill_desc: "Your stamina increases by {stamina-bonus}, allowing you to fight without pause.",

  hp_regen_skill_name: "Inner Fortitude",
  hp_regen_skill_desc: "Your health regeneration increases by {hp-regen-bonus} Your willpower hastens the mending of wounds.",

  hp_to_dmg_skill_name: "Last Will",
  hp_to_dmg_skill_desc: "When your health falls below {threshold}, your missing health is converted into bonus damage, up to {max-bonus}",
  
  extra_crit_skill_name: "Precise Strikes",
  extra_crit_skill_desc: "Your critical strike effectiveness increases by {crit-bonus}. Your attacks more often find the enemy’s weak points.",

  atkspd_bonus_skill_name: "Killing Tempo",
  atkspd_bonus_skill_desc: "Your attack speed increases by {atkspd-bonus}. Your movements become faster and deadlier.",
  
  crit_damage_bonus_skill_name: "Deadly Precision",
  crit_damage_bonus_skill_desc: "Your critical strikes deal {crit-damage-bonus} increased damage. Each one hits with devastating force.",
  
  perfect_block_dmg_skill_name: "Perfect Riposte",
  perfect_block_dmg_skill_desc: "A perfect action (dependent on Yours discipline) empowers your next attack, increasing its damage by {perfect-dmg}. You seize the moment to unleash a devastating counter.",
  
  perfect_window_skill_name: "Perfect Timing",
  perfect_window_skill_desc: "Increases the perfect action window by {perfect-window}. Gives you more time to execute a perfect block or hit and earn the full precision reward.",
  
  perfect_chain_skill_name: "Counter Chain",
  perfect_chain_skill_desc: "Each successive Perfect Action increases the damage of the next attack by {chain-dmg}. The bonus stacks up to 3 times and is consumed upon a hit. Performing an unsuccessful Perfect Action resets the chain.",
  
  block_recovery_skill_name: "Recovery Control",
  block_recovery_skill_desc: "Reduces the penalty for performing a normal action instead of a perfect one by {block-reduction}. The effect depends on the combat mechanic being used.",
  
  style_turtle_desc: "Enhances the defensive aspects of abilities. Increases survivability and damage reduction.",
  style_timed_desc: "Enhances effects tied to perfect timing. Grants greater rewards for precision.",
  style_poise_desc: "Enhances striking power and aggression. Increases damage and pressure applied to enemies.",
  
  styles_in_development: "Upgrade system in development.",
  
  
  // ==============================
  // ENEMY SKILL NAMES
  // ==============================

  backstab_skill_name: "Backstab",
  quick_pounce_skill_name: "Quick Pounce",
  pommel_strike_skill_name: "Pommel Strike",
  antler_rush_skill_name: "Antler Rush",
  gore_charge_skill_name: "Gore Charge",
  hunting_instinct_skill_name: "Hunting Instinct",
  hook_smash_skill_name: "Hook Smash",
  sand_throw_skill_name: "Sand Throw",
  incendiary_shot_skill_name: "Incendiary Shot",
  haunting_mark_skill_name: "Haunting Mark",
  poisoned_dagger_skill_name: "Poisoned Blade",
  predator_strike_skill_name: "Predator Strike",
  
  dirty_tricks_skill_name: "Dirty Tricks",
  shadow_strike_skill_name: "Shadow Strike",
  smoke_bomb_skill_name: "Smoke Bomb",
  brutal_strike_skill_name: "Brutal Strike",
  leg_sweep_skill_name: "Leg Sweep",
  rallying_cry_skill_name: "Rallying Cry",
  
  savage_pounce_skill_name: "Savage Pounce",
  alpha_howl_skill_name: "Alpha Howl",
  rending_bite_skill_name: "Rending Bite",

  
  
});


  



Object.assign(LANG.pl, {
  
  focus_skill_name: "Skupienie",
  focus_skill_desc: "Koncentrujesz swój umysł, aby skupić maksymalną uwagę na sytuacje w trakcie walki. Czas spowalnia na {slowmo-duration}, aby zdobyć przewagę i podjąć najlepszą taktykę.",
  
  power_attack_skill_name: "Potężny Atak",
  power_attack_skill_desc: "Wykonujesz niszczący cios, zadając {damage} obrażeń od broni. Wróg poddany efektom spowolnienia lub oszołomienia otrzymuje dodatkowo {bonus-vs-status} obrażeń.",
    
  double_attack_skill_name: "Podwójny Atak",
  double_attack_skill_desc: "Wykonujesz serię dwóch szybkich ciosów, każdy zadaje po {damage} obrażeń od broni i powoduje krwawienie u wroga przez {bleed-duration}",

  charge_skill_name: "Szarża",
  charge_skill_desc: "Szarżujesz na przeciwnika, zadając {damage} obrażeń od broni i ogłuszając go na {stun} Dodatkowo ogłuszony przeciwnik otrzyma {bonus-damage} większe obrażenia od broni przy następnym ataku.",

  jump_skill_name: "Atak z Wyskoku",
  jump_skill_desc: "Robisz wyskok, aby powalić wroga uderzeniem z góry. Zadajesz {damage} obrażeń od broni i spowalniasz jego ruch o {slow} oraz łamiesz jego pancerz ({armor-break}) na {slow-duration} ",

  shout_skill_name: "Wojenny Okrzyk",
  shout_skill_desc: "Wykonujesz głośny okrzyk, który zwiększa twoją krzepę. Zadajesz o {damage-buff} większe obrażenia przez {shout-duration}",

  
  shield_bash_skill_name: "Uderzenie Tarczą",
  shield_bash_skill_desc: "Uderzasz przeciwnika tarczą z ogromną siłą, zadając {damage} obrażeń i ogłuszając go na {stun}.",

  shield_wall_skill_name: "Mur Tarczy",
  shield_wall_skill_desc: "Unosisz tarczę, tworząc niemal nieprzeniknioną obronę, zwiększając swoją obronę o {def-buff} na {def-buff-duration}.",

  counter_strike_skill_name: "Kontratak",
  counter_strike_skill_desc: "Podczas blokowania przez {counter-duration} odpowiadasz potężnym kontratakiem, zadając {counter-strike} obrażeń i odzyskując {stamina-recover} staminy.",
  
  iron_will_skill_name: "Żelazna Wola",
  iron_will_skill_desc: "Twoja niezłomna determinacja przez 5 sek. pozwala ci przełamać wszelkie ograniczenia podczas aktywnej tarczy. Blokowanie kosztuje cię o {blocking-cost} mniej staminy.",
  
  provocation_skill_name: "Prowokacja",
  provocation_skill_desc: "Wyzwasz przeciwnika do walki, wzbudzając jego gniew i zmuszając go do skupienia na tobie swojej agresji. Wróg staje się wrażliwy na {vulnerable-duration}",

  last_bastion_skill_name: "Ostatni Bastion",
  last_bastion_skill_desc: "Stajesz się ostatnią linią obrony, zwiększając swoją obronę o {def-buff} na {def-buff-duration} oraz wzmacniając kolejny atak, który zada {buff-next-attack} dodatkowych obrażeń. Dodatkowo blokowanie nie zużywa staminy.",
  
  riposte_skill_name: "Riposta",
  riposte_skill_desc: "Natychmiast wykonujesz kontratak po udanym bloku, zadając {damage} zwiększonych obrażeń. Po wykonaniu Idealnego Bloku, Riposta zawsze zadaje obrażenia krytyczne.",
  
  opening_strike_skill_name: "Otwarcie",
  opening_strike_skill_desc: "Uderzasz w obronę przeciwnika, wydłużając jego najbliższy zamach o {open-windup} i nakładając na niego Wrażliwość. Wydłużony zamach spowalnia wskaźnik, dając Ci więcej czasu na wykonanie kolejnego Idealnego Bloku.",
  
  precision_skill_name: "Precyzja",
  precision_skill_desc: "Wchodzisz w stan zwiększonej precyzji na {precision-duration}. Podczas jego działania Twoje umiejętności są wzmacniane o {precision-buff} przez posiadane ładunki Precyzji. Im więcej masz ładunków Precyzji, tym silniejsze są ich efekty.",
  
  parry_master_skill_name: "Mistrz Parowania",
  parry_master_skill_desc: "Przez 4 sek. każdy Idealny Blok skraca pozostały czas odnowienia Twoich umiejętności o {reduce-cooldown} oraz skraca czas odnowienia tarczy o {reduce-shield-cooldown}. Aktywacja Mistrza Parowania natychmiast skraca aktualny czas odnowienia tarczy. Każdy Idealny Blok odnawia czas działania efektu.",
  
  weak_point_skill_name: "Słaby Punkt",
  weak_point_skill_desc: "Odsłaniasz słaby punkt przeciwnika na {vulnerable-duration}, zwiększając Szansę na Trafienie Krytyczne o {crit-buff} oraz Obrażenia Krytyczne o {crit-dmg-buff} przeciwko oznaczonemu przeciwnikowi.",
  
  perfect_execution_skill_name: "Perfekcyjna Egzekucja",
  perfect_execution_skill_desc: "Wykonujesz dewastujący, kończący cios, który zawsze zadaje obrażenia krytyczne. Atak zadaje {damage} zwiększonych obrażeń oraz otrzymuje 25% dodatkowych obrażeń przeciwko przeciwnikom ze statusem Wrażliwość. Perfekcyjna Egzekucja wymaga 5 ładunków Precyzji i zużywa wszystkie 5 po użyciu.",
  
  piercing_thrust_skill_name: "Przebijające Pchnięcie",
  piercing_thrust_skill_desc: "Wbijasz włócznię głęboko w przeciwnika, zadając {damage} obrażeń, zyskując 1 ładunek Kontroli i odpychając przeciwnika o {pushback} jego aktualnego czasu odnowienia.",

  sweep_skill_name: "Zamaszyste Cięcie",
  sweep_skill_desc: "Wykonujesz szeroki zamach włócznią, natychmiast zyskując 2 ładunki Kontroli, spowalniając przeciwnika o 30% na {sweep-duration} oraz wydłużając jego najbliższy Zamach o {windup}.",

  impale_skill_name: "Nabicie",
  impale_skill_desc: "Zużywasz wszystkie ładunki Kontroli, aby wykonać potężne pchnięcie, zadając {damage} obrażeń. Atak gwarantuje trafienie krytyczne i nakłada na przeciwnika Wrażliwość.",
  
  control_shatter_skill_name: "Przełamanie Kontroli",
  control_shatter_skill_desc: "Przełamujesz obronę przeciwnika, zużywając całą Kontrolę i natychmiast przerywając jego akcję. Przerywa Zamach, Szarżę oraz Gardę.",

  spear_discipline_skill_name: "Dyscyplina Włóczni",
  spear_discipline_skill_desc: "Wchodzisz w stan doskonałej kontroli na {discipline-duration}. Podczas jego trwania Idealny Atak daje 2 ładunki Kontroli zamiast 1, a nieudane trafienie nie resetuje całej Kontroli, tylko zabiera 1 ładunek.",

  absolute_control_skill_name: "Absolutna Kontrola",
  absolute_control_skill_desc: "Wchodzisz w stan absolutnej kontroli na {absolute-duration}. Podczas jego trwania Kontrola zostaje zablokowana i nie może wygasnąć ani zostać utracona. Każde Idealne Trafienie wydłuża czas działania Absolutnej Kontroli o 1.5 sek.",
  
  twin_slash_skill_name: "Podwójne Cięcie",
  twin_slash_skill_desc: "Wykonujesz dwa szybkie cięcia, każde zadając {damage} obrażeń i nakładając {bleed} Krwawienia na {bleed-duration}. Każde trafienie pozostawia wroga krwawiącego, przygotowując go na Twoje krwawe techniki.",
  
  blood_frenzy_skill_name: "Krwawy Szał",
  blood_frenzy_skill_desc: "Wpadasz w krwawy szał na {frenzy-duration}. Podczas jego działania każde tyknięcie Krwawienia zwiększa Twoją Szybkość Ataku o {attack-speed}. Krwawy Szał można aktywować tylko wtedy, gdy przeciwnik krwawi.",
  
  whirlwind_skill_name: "Krwawy Wir",
  whirlwind_skill_desc: "Wykonujesz nieustanną serię wirujących ataków przez kilka sekund, wielokrotnie uderzając przeciwnika. Każde trafienie zadaje {whirlwind} obrażeń i może nałożyć {bleed} Krwawienia, pozwalając szybko zwiększać jego krwawienie.",
  
  blood_pact_skill_name: "Krwawy Pakt",
  blood_pact_skill_desc: "Poświęcasz {hp-cost} maksymalnego Życia, zawierając krwawy pakt. Zyskujesz {damage-buff} zwiększonych obrażeń oraz {crit-buff-pact} Szansy na Trafienie Krytyczne. Wszystkie aktywne Krwawienia przeciwnika zostają przedłużone o 5 sekund.",
  
  blood_reaver_skill_name: "Krwawy Żniwiarz",
  blood_reaver_skill_desc: "Przez {reaver-duration} czerpiesz siłę z krwawiących ran przeciwnika. {heal-convert} obrażeń zadanych przez każde tyknięcie Krwawienia zostaje zamieniona na Życie, a leczenie rośnie wraz z liczbą aktywnych ładunków Krwawienia i Szału.",
  
  executioner_skill_name: "Egzekutor",
  executioner_skill_desc: "Wykonujesz niszczycielski cios kończący, który zawsze zadaje Trafienie Krytyczne. Atak zadaje {damage} obrażeń i zużywa wszystkie 5 ładunków Szału. Pozostałe obrażenia z aktywnych Krwawień przeciwnika eksplodują natychmiast, zadając całość pozostałych obrażeń.",
  
  
  extra_life_skill_name: "Długowieczność",
  extra_life_skill_desc: "Zwiększa maksymalne punkty życia o {life-bonus} Twoje ciało nabiera niezwykłej wytrzymałości.",
  
  extra_defense_skill_name: "Niezłomność",
  extra_defense_skill_desc: "Zwiększa pancerz o {def-bonus} Nic nie jest w stanie złamać Twojej determinacji.",

  max_defense_skill_name: "Twarda Skóra",
  max_defense_skill_desc: "Zwiększa skuteczność pancerza o {max-def-bonus}. Twoja skóra twardnieje niczym wyprawiona skóra bestii.",
  
  iron_defense_skill_name: "Żelazna Postawa",
  iron_defense_skill_desc: "Po otrzymaniu obrażeń następny atak wroga zadaje zmniejszone obrażenia o {dmg-reduction}. Umiejętność aktywuje się raz na {cooldown}",

  stack_defense_skill_name: "Niezłommy Mur",
  stack_defense_skill_desc: "Każdy przyjęty cios przez {stack-duration} zwiększa Twój pancerz o {stack-def}. Bonus kumuluje się maksymalnie 5 razy. Im dłużej walczysz, tym trudniej Cię złamać.",

  extra_damage_skill_name: "Nadludzka Siła",
  extra_damage_skill_desc: "Zwiększa obrażenia zadawane przez broń o {dmg-bonus} Twoja siła przekracza ludzkie granice.",

  extra_stamina_skill_name: "Wieczna Walka",
  extra_stamina_skill_desc: "Zwiększa maksymalną staminę o {stamina-bonus}. Twoje ciało potrafi walczyć bez chwili wytchnienia.",

  hp_regen_skill_name: "Hart Ducha",
  hp_regen_skill_desc: "Zwiększa regenerację pkt. życia o {hp-regen-bonus}. Siła woli przyspiesza naturalne leczenie ran.",

  hp_to_dmg_skill_name: "Ostatnia Wola",
  hp_to_dmg_skill_desc: "Gdy Twoje Życie spadnie poniżej {threshold}, ilość brakującego życia zostaje zamienione na dodatkowe obrażenia (maksymalnie {max-bonus}).",
  
  extra_crit_skill_name: "Precyzyjne Uderzenia",
  extra_crit_skill_desc: "Zwiększa skuteczność ataków krytycznych o {crit-bonus}. Twoje ataki częściej znajdują słabe punkty wroga.",

  atkspd_bonus_skill_name: "Zabójcze Tempo",
  atkspd_bonus_skill_desc: "Zwiększa szybkość zadawanych ataków o {atkspd-bonus}. Twoje ruchy stają się szybsze i bardziej zabójcze.",

  crit_damage_bonus_skill_name: "Zabójcza Precyzja",
  crit_damage_bonus_skill_desc: "Zwiększa obrażenia zadawane przez ataki krytyczne o {crit-damage-bonus}. Każde trafienie krytyczne sieje spustoszenie.",

  perfect_block_dmg_skill_name: "Perfekcyjna Riposta",
  perfect_block_dmg_skill_desc: "Perfekcyjna akcja (zależna od Twojej dyscypliny) zwiększa obrażenia następnego ataku o {perfect-dmg}. Wykorzystujesz idealny moment, by wyprowadzić niszczycielską kontrę.",
  
  perfect_window_skill_name: "Precyzyjny Moment",
  perfect_window_skill_desc: "Zwiększa szerokość okna perfekcyjnej akcji o {perfect-window}. Daje więcej czasu na wykonanie idealnego bloku lub uderzenia i uzyskanie pełnej nagrody za precyzję.",
  
  perfect_chain_skill_name: "Seria Kontrataków",
  perfect_chain_skill_desc: "Każda kolejna perfekcyjna akcja zwiększa obrażenia następnego ataku o {chain-dmg}. Bonus kumuluje się maksymalnie 3 razy i zostaje zużyty po trafieniu. Wykonanie nieudanej perfekcyjnej akcji resetuje serię.",
  
  block_recovery_skill_name: "Kontrola Błędu",
  block_recovery_skill_desc: "Zmniejsza karę za wykonanie normalnej akcji zamiast perfekcyjnej o {block-reduction}. Efekt zależy od używanej mechaniki walki.",
  
  style_turtle_desc: "Wzmacnia defensywne aspekty umiejętności. Zwiększa przeżywalność i redukcję obrażeń.",
  style_timed_desc: "Wzmacnia efekty związane z perfekcyjnym wyczuciem czasu. Oferuje większe nagrody za precyzję.",
  style_poise_desc: "Wzmacnia siłę uderzeń i agresywny styl walki. Zwiększa obrażenia oraz presję wywieraną na przeciwnika.",
  
  styles_in_development: "System ulepszeń w fazie rozwoju.",
  
  
  // ==============================
  // ENEMY SKILL NAMES
  // ==============================

  gore_charge_skill_name: "Krwawe Szarżowanie",
  backstab_skill_name: "Cios w Plecy",
  quick_pounce_skill_name: "Szybki Skok",
  pommel_strike_skill_name: "Cios Głowicą",
  antler_rush_skill_name: "Szarża Rogami",
  hunting_instinct_skill_name: "Instynkt Łowcy",
  hook_smash_skill_name: "Cios Hakiem",
  sand_throw_skill_name: "Rzut Piaskiem",
  incendiary_shot_skill_name: "Płonący Strzał",
  haunting_mark_skill_name: "Upiorne Znamię",
  poisoned_dagger_skill_name: "Zatrute Ostrze",
  predator_strike_skill_name: "Cios Drapieżcy",

  
  dirty_tricks_skill_name: "Brudne Sztuczki",
  shadow_strike_skill_name: "Cios Cienia",
  smoke_bomb_skill_name: "Bomba Dymna",
  brutal_strike_skill_name: "Brutalny Cios",
  leg_sweep_skill_name: "Podcięcie Nogi",
  rallying_cry_skill_name: "Okrzyk Bojowy",

  
  savage_pounce_skill_name: "Dziki Doskok",
  alpha_howl_skill_name: "Ryk Alfa",
  rending_bite_skill_name: "Rozdzierające Ugryzienie",


  
  
});
  


  
  
  