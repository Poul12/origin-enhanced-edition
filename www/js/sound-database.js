let soundsReady = false;


async function preloadSounds() {
  initAudio();

  await Promise.all([
  
    //SYSTEM
    safeLoadSound("menu-tab", "menu-tab-sound3.mp3"),
    safeLoadSound("menu", "menu-sound2.mp3"),
    safeLoadSound("error", "error-sound.mp3"),
    safeLoadSound("open", "open-popup2.mp3"),
    safeLoadSound("open-slot", "system-sound2.mp3"),
    safeLoadSound("complete-quest", "system-sound3.mp3"),
    safeLoadSound("skill-unlock", "skill-unlock-sound2.mp3"),
    safeLoadSound("level-up", "levelup-sound.mp3"),
    safeLoadSound("death", "death-sound.mp3"),
    safeLoadSound("buy", "buy-sound2.mp3"),
    safeLoadSound("pickup-item", "pickup-item-sound2.mp3"),
    safeLoadSound("pickup-gold", "pickup-gold-sound.mp3"),
    safeLoadSound("accept", "levelup-sound2.mp3"),
    safeLoadSound("chest", "open-chest.mp3"),
    safeLoadSound("equip-sword", "equip-sword.mp3"),
    safeLoadSound("drink-potion", "drink-potion.mp3"),
    safeLoadSound("shrine-heal", "shrine5.mp3"),
    safeLoadSound("shrine-protect", "shrine3.mp3"),
    safeLoadSound("shrine-might", "shrine.mp3"),
    safeLoadSound("equip-universal", "equip-universal.mp3"),
    safeLoadSound("unequip", "unequip2.mp3"),
    safeLoadSound("sold", "sold.mp3"),
    safeLoadSound("low-stamina", "low-stamina-sound.mp3"),
    safeLoadSound("player-exhausted", "player-exhausted-sound.mp3"),
    safeLoadSound("low-hp", "low-hp-sound.mp3"),
  
    //BLOCK
    safeLoadSound("perfect", "perfect-block-sound_n.mp3"),
    safeLoadSound("normal", "normal-block-sound.mp3"),
    safeLoadSound("timed-block", "timed-block-sound2.mp3"),
    safeLoadSound("turtle-up", "turtle-block-sound.mp3"),
    safeLoadSound("turtle-down", "turtle-block-down-sound.mp3"),
  
    //ATTACK
    safeLoadSound("hit_player", "hit-sound2.mp3"),
    safeLoadSound("hit_enemy", "hit-sound1.mp3"),
    safeLoadSound("impact_body_light", "impact-body-sound.mp3"),
    //safeLoadSound("impact_body_heavy", "impact-body-sound2.mp3"),
    //safeLoadSound("impact_body_skill", "impact-body-sound4.mp3"),
    safeLoadSound("metal_click", "metal-click-sound.mp3"),
    safeLoadSound("air_whoosh", "air-whoosh-sound.mp3"),
    safeLoadSound("flesh_hit", "flesh-hit-sound4.mp3"),
    safeLoadSound("blade_cut", "blade-cut-sound.mp3"),
    safeLoadSound("bleed_boom", "blade-cut-sound2.mp3"),
    safeLoadSound("dodge", "dodge-sound.mp3"),
    safeLoadSound("crit", "crit-sound.mp3"),
    safeLoadSound("armor_break", "charge-skill-sound.mp3"),
    safeLoadSound("poise_break", "jump-land-skill-sound.mp3"),
    safeLoadSound("spear_control", "double-attack-skill-sound.mp3"),

  
    //SKILLS
    safeLoadSound("heavy_windup", "power-windup-strike-sound2.mp3"),
    safeLoadSound("power_strike", "power-strike-skill-sound2.mp3"),
    safeLoadSound("quick_swing", "double-attack-skill-sound2.mp3"),
    safeLoadSound("jump_up", "jump-skill-sound2.mp3"),
    safeLoadSound("jump_strike", "jump-land-skill-sound3.mp3"),
    safeLoadSound("charge", "charge-skill-sound3.mp3"),
    safeLoadSound("slow", "slow-effect-sound.mp3"),
    safeLoadSound("slow_mo", "slow-mo-on-sound3.mp3"),
    safeLoadSound("warrior_shout", "warrior-shout-skill-sound.mp3"),

  
  ]);

  soundsReady = true;
  appState.soundsInitialized = true;
 // console.warn("🔊 Sounds READY");
}


async function safeLoadSound(name, file) {
  try {
    await loadSound(name, file);
  } catch (err) {
    console.error(
      "❌ SOUND LOAD FAILED:",
      file,
      err
    );
  }
}