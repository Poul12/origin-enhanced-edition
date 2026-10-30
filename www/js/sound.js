let musicGainNode;
let masterGainNode;

let sfxGainNode;
let pauseFilterNode;
let pauseDelayNode;
let pauseFeedbackNode;

// --------------------------
// HIT LAYERS - modularny
// --------------------------
const HIT_LAYERS = {
  // Enemy hits
  player: {
    // zwykły cios
    normal: [
      { name: "air_whoosh", vol: 0.2, pitch: [0.98, 1.02], offset: 0.46 },
      { name: "impact_body_light", vol: 0.3, pitch: [0.95, 1.05], offset: 0.47 },
      { name: "metal_click", vol: 0.2, pitch: [0.9, 1.1], offset: 0.41 },
    ],
    // mocny cios / crit
    heavy: [
      { name: "air_whoosh", vol: 0.2, pitch: [0.95, 1.05], offset: 0.46 },
      { name: "impact_body_light", vol: 0.3, pitch: [0.9, 1.1], offset: 0.47 },
      { name: "metal_click", vol: 0.2, pitch: [0.9, 1.1], offset: 0.41 },
    ],
    // skill / ability
    skill: [
      { name: "air_whoosh", vol: 0.2, pitch: [1.0, 1.05], offset: 0.46 },
      { name: "impact_body_light", vol: 0.3, pitch: [0.95, 1.05], offset: 0.47 },
      { name: "metal_click", vol: 0.2, pitch: [0.95, 1.05], offset: 0.41 },
    ]
  },

  // Player hits
  enemy: {
    normal: [
      { name: "air_whoosh", vol: 0.2, pitch: [0.98, 1.02], offset: 0.46 },
      { name: "impact_body_light", vol: 0.3, pitch: [0.95, 1.05], offset: 0.47 },
      { name: "flesh_hit", vol: 0.3, pitch: [0.95, 1.05], offset: 0.44 },
      { name: "blade_cut", vol: 0.2, pitch: [1.0, 1.1], offset: 0.62 },
    ],
    heavy: [
      { name: "air_whoosh", vol: 0.2, pitch: [0.95, 1.05], offset: 0.46 },
      { name: "impact_body_light", vol: 0.3, pitch: [0.9, 1.1], offset: 0.47 },
      { name: "flesh_hit", vol: 0.2, pitch: [0.95, 1.05], offset: 0.44 },
      { name: "blade_cut", vol: 0.2, pitch: [0.95, 1.1], offset: 0.62 },
    ],
    skill: [
      { name: "air_whoosh", vol: 0.2, pitch: [1.0, 1.05], offset: 0.46 },
      { name: "impact_body_light", vol: 0.3, pitch: [0.95, 1.05], offset: 0.47 },
      { name: "flesh_hit", vol: 0.2, pitch: [0.95, 1.05], offset: 0.44 },
    ],
    powerStrike: [
      { name: "power_strike", vol: 0.4, pitch: [1.0, 1.05], offset: 0.46 }
    ],
    quickCut: [
      { name: "impact_body_light", vol: 0.3, pitch: [0.95, 1.05], offset: 0.47 },
      { name: "flesh_hit", vol: 0.3, pitch: [0.95, 1.05], offset: 0.44 },
      { name: "blade_cut", vol: 0.2, pitch: [1.0, 1.1], offset: 0.62 },
    ],
    jumpStrike: [
      { name: "jump_strike", vol: 0.4, pitch: [1.0, 1.05], offset: 0.46 }
    ],


  },

  // Bloki i inne akcje
  block: {
    normal: [{ name: "normal", vol: 0.8, pitch: [1.0, 1.0], offset: 0 }],
    perfect: [{ name: "perfect", vol: 0.8, pitch: [1.0, 1.0], offset: 0 }],
  },

  dodge: [
    { name: "dodge", vol: 0.8, pitch: [1.0, 1.05], offset: 0 }
  ]
};

const SKILL_SOUNDS = {
  heavyAttack: [
    { name: "heavy_windup", delay: 0, vol: 0.4, pitch: [0.95, 1.0] },
    { hit: true, target: "enemy", type: "powerStrike", delay: 450 }
  ],

  doubleStrike: [
    { name: "quick_swing", delay: 0, vol: 0.3, pitch: [1.0, 1.05] },
    { hit: true, target: "enemy", type: "quickCut", delay: 150 },

    { name: "quick_swing", delay: 250, vol: 0.3, pitch: [1.0, 1.05] },
    { hit: true, target: "enemy", type: "quickCut", delay: 400 }
  ],

  jumpAttack: [
    { name: "jump_up", delay: 0, vol: 0.35, pitch: [1.0, 1.05] },
    { name: "air_whoosh", delay: 150, vol: 0.25, pitch: [1.0, 1.05] },

    { hit: true, target: "enemy", type: "jumpStrike", delay: 450 },

    //{ name: "stun", delay: 520, vol: 0.4, pitch: [0.95, 1.0] }
  ],
  
  charge: [
    { name: "charge", delay: 0, vol: 0.4, pitch: [0.95, 1.0] },
  
    //{ hit: true, target: "enemy", type: "heavy", delay: 600 },

    { name: "slow", delay: 320, vol: 0.35, pitch: [0.95, 1.0] }
  ],
  
  warCry: [
    { name: "warrior_shout", delay: 0, vol: 0.4, pitch: [0.95, 1.05] }
  ],
  
  focus: [
    { name: "slow_mo", delay: 0, vol: 0.6, pitch: [0.95, 1.05] }
  ]

  
};
  
  // --------------------------
// Funkcja do grania hitów modularnie
// --------------------------
function playHit(target, type = "normal", power = 1) {
  if (!HIT_LAYERS[target]) return;
  const layers = HIT_LAYERS[target][type];
  if (!layers) return;

  layers.forEach(l => {
    playSound(
      l.name,
      l.vol * power,
      randomRange(l.pitch[0], l.pitch[1]),
      l.offset
    );
  });
}

// --------------------------
// Funkcja do grania bloków / skillów
// --------------------------
function playBlock(type = "normal") {
  const layers = HIT_LAYERS.block[type];
  if (!layers) return;
  layers.forEach(l => playSound(l.name, l.vol, randomRange(l.pitch[0], l.pitch[1]), l.offset));
}

function playDodge() {
  HIT_LAYERS.dodge.forEach(l => playSound(l.name, l.vol, randomRange(l.pitch[0], l.pitch[1]), l.offset));
}

function playSkill(name) {
  const sequence = SKILL_SOUNDS[name];
  if (!sequence) return;

  sequence.forEach(step => {
    setTimeout(() => {
      if (step.hit) {
        playHit(step.target, step.type);
      } else {
        playSound(
          step.name,
          step.vol,
          randomRange(step.pitch[0], step.pitch[1])
        );
      }
    }, step.delay);
  });
}


// --------------------------
// Variants i przyszła rozbudowa
// --------------------------
// Możesz łatwo dodać warianty impact_body:
// "impact_body_light", "impact_body_heavy", "impact_body_skill"
// i dla wrogów flesh_hit czy blade_cut
// oraz nowe efekty dla skillów jak stun, slow, interrupt
// tylko dodając je do zestawów HIT_LAYERS bez zmiany funkcji








/*const HIT_LAYERS = {
  player: [
    { name: "air_whoosh", vol: 0.4, pitch: [0.98, 1.02], offset: 0.46 },
    { name: "impact_body_light", vol: 1.0, pitch: [0.95, 1.05], offset: 0.47 },
    { name: "metal_click", vol: 0.7, pitch: [0.9, 1.1], offset: 0.41 },
      //{ name: "spark", vol: 0.6, pitch: [1.2, 1.3], offset: 0.0 }
  ],

  enemy: [
    { name: "air_whoosh", vol: 0.4, pitch: [0.98, 1.02], offset: 0.46 },
    { name: "impact_body_light", vol: 1.0, pitch: [0.95, 1.05], offset: 0.47 },
    { name: "flesh_hit", vol: 0.9, pitch: [0.95, 1.05], offset: 0.44 },
    { name: "blade_cut", vol: 0.8, pitch: [1.0, 1.1], offset: 0.62 },
    //{ name: "impact_light", vol: 0.6, pitch: [1.1, 1.2], offset: 0.0 }
  ]
};*/

let audioCtx;
const audioBuffers = {};
const bootstrapSounds = {};

let audioReady = false;

/*function initAudio() {
  if (audioReady) return;

  audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  // MASTER
  masterGainNode = audioCtx.createGain();
  masterGainNode.gain.value = gameState.world.isMuted ? 0 : 1;
  masterGainNode.connect(audioCtx.destination);

  // MUSIC
  musicGainNode = audioCtx.createGain();
  musicGainNode.gain.value = gameState.world.musicVolume;
  musicGainNode.connect(masterGainNode);

  // 🔥 SFX GAIN (oddzielny tor)
  sfxGainNode = audioCtx.createGain();
  sfxGainNode.gain.value = 1;

  // 🔥 FILTER (KOTOR muffled effect)
  pauseFilterNode = audioCtx.createBiquadFilter();
  pauseFilterNode.type = "lowpass";
  pauseFilterNode.frequency.value = 20000; // normalnie brak efektu

  // 🔥 DELAY (echo)
  pauseDelayNode = audioCtx.createDelay(1.0);
  pauseDelayNode.delayTime.value = 0.2;

  pauseFeedbackNode = audioCtx.createGain();
  pauseFeedbackNode.gain.value = 0.25;

  // feedback loop
  pauseDelayNode.connect(pauseFeedbackNode);
  pauseFeedbackNode.connect(pauseDelayNode);

  // 🔥 ŁAŃCUCH
  sfxGainNode.connect(pauseFilterNode);
  pauseFilterNode.connect(pauseDelayNode);
  pauseDelayNode.connect(masterGainNode);

  audioCtx.resume();
  audioReady = true;
}*/

function initAudio() {
  if (audioReady) return;

  audioCtx = new (window.AudioContext || window.webkitAudioContext)();

   
  // MASTER
  masterGainNode = audioCtx.createGain();
  //masterGainNode.gain.value = 1;
  masterGainNode.gain.value = gameState.world.isMuted ? 0 : 1;
  masterGainNode.connect(audioCtx.destination);

  // MUSIC
  musicGainNode = audioCtx.createGain();
  musicGainNode.gain.value = gameState.world.musicVolume;
  musicGainNode.connect(masterGainNode);

  audioCtx.resume();
  audioReady = true;
}

document.addEventListener("touchstart", initAudio, { once: true });
document.addEventListener("mousedown", initAudio, { once: true });
document.addEventListener("keydown", initAudio, { once: true });


function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

/*async function loadSound(name, file) {
  const ctx = getAudioContext();
  //console.error(`ctx state`, ctx.state);
  
  //const soundUrl = assetManager.getAssetUrl("sound/" + file);
  
  //console.error(`sound url`, SOUND_BASE + file);
  
  //const response = await fetch(soundUrl);
  const response = await fetch(SOUND_BASE + file);
  const arrayBuffer = await response.arrayBuffer();
  audioBuffers[name] = await ctx.decodeAudioData(arrayBuffer);
  
 console.log(
    "type:",
    response.headers.get("content-type"),
    "size:",
    arrayBuffer.byteLength
  );
}*/

async function loadSound(name, file) {
  const ctx = getAudioContext();
  
  // 🔥 BOOTSTRAP LOCAL AUDIO
  if (file === "menu-sound2.mp3") {
    const audio = new Audio("assets/bootstrap/sounds/menu-sound2.mp3");
    audio.preload = "auto";
    bootstrapSounds[name] = audio;
   // console.error("🔊 SOUND BOOTSTRAP");

    return;
  }

  // 🔥 NORMAL ASSET MANAGER AUDIO
  const soundUrl = await assetManager.getAssetUrl("sounds/" + file);
 
  //console.log("🔊 SOUND URL:", soundUrl);

  const response = await fetch(soundUrl);

  if (!response.ok) {
    throw new Error(
      `Audio fetch failed: ${response.status} ${file}`
    );
  }

 /* console.log(
    "🔊 AUDIO:",
    file,
    "size:",
    arrayBuffer.byteLength,
    "type:",
    response.headers.get("content-type")
  );*/
  
  const arrayBuffer = await response.arrayBuffer();

  audioBuffers[name] = await ctx.decodeAudioData(arrayBuffer);
}


function enterPauseAudio() {
  const now = audioCtx.currentTime;

  // 🔻 przytłumienie
  pauseFilterNode.frequency.cancelScheduledValues(now);
  pauseFilterNode.frequency.linearRampToValueAtTime(800, now + 0.2);

  // 🔊 echo
  pauseDelayNode.delayTime.linearRampToValueAtTime(0.35, now + 0.2);
  pauseFeedbackNode.gain.linearRampToValueAtTime(0.45, now + 0.2);

  // 🔉 lekkie ściszenie SFX
  sfxGainNode.gain.linearRampToValueAtTime(0.7, now + 0.2);
}

function exitPauseAudio() {
  const now = audioCtx.currentTime;

  pauseFilterNode.frequency.cancelScheduledValues(now);
  pauseFilterNode.frequency.linearRampToValueAtTime(20000, now + 0.3);

  pauseDelayNode.delayTime.linearRampToValueAtTime(0.2, now + 0.3);
  pauseFeedbackNode.gain.linearRampToValueAtTime(0.25, now + 0.3);

  sfxGainNode.gain.linearRampToValueAtTime(1.0, now + 0.3);
}

function getMasterVolume() {
  return gameState.world.isMuted ? 0 : 1;
}

function safePlay(sound, volumeValue) {
  if (!sound) return;

  try {
    sound.pause(); // reset stanu
    sound.currentTime = 0;
    sound.volume = volumeValue * gameState.world.sfxVolume * getMasterVolume();

    const p = sound.play();

    if (p && typeof p.catch === "function") {
      p.catch(err => {
        if (err.name !== "AbortError") {
          console.warn("Audio error:", err);
        }
      });
    }

  } catch (e) {
    console.warn("Audio exception:", e);
  }
}

function playSound(name, volume = 1, pitch = 1, offset = 0) {
  if (bootstrapSounds[name]) {
    /*bootstrapSounds[name].pause();
    bootstrapSounds[name].currentTime = 0;
    bootstrapSounds[name].volume = volume * gameState.world.sfxVolume * getMasterVolume();
    bootstrapSounds[name].play();*/
    
    safePlay(bootstrapSounds[name], volume);
    
    return;
  }
  
  
  const buffer = audioBuffers[name];
  if (!buffer) {
    //console.warn("Missing sound buffer:", name);
    return;
  }
  
  const src = audioCtx.createBufferSource();
  const gain = audioCtx.createGain();

  src.buffer = buffer;
  src.playbackRate.value = pitch;
  /*gain.gain.value = volume;

  src.connect(gain).connect(audioCtx.destination);*/

  gain.gain.value = volume * gameState.world.sfxVolume;
  src.connect(gain).connect(masterGainNode);
  
  //src.connect(gain).connect(sfxGainNode);
  
  const now = audioCtx.currentTime;

  // auto-detect silence offset (jeśli chcesz)
  const detectedOffset = findSoundStart(buffer) || 0;
  //const detectedOffset = 0;
  
  // finalny offset = manual + auto
  const finalOffset = Math.max(0, detectedOffset + 0);

 /* console.warn(
    `PLAY ${name} @`,
    performance.now(),
    "ctx:",
    now,
    "offset:",
    finalOffset,
    "pitch:",
    pitch,
    "vol:",
    volume
  );*/

  src.start(now, finalOffset);
}


const soundCooldowns = {};

function playSoundLimited(name, cooldown = 80) {

  const now = performance.now();

  if (soundCooldowns[name] && now - soundCooldowns[name] < cooldown) {
    return;
  }

  soundCooldowns[name] = now;

  playSound(name);
}

function findSoundStart(buffer, threshold = 0.01) {
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    if (Math.abs(data[i]) > threshold) {
      return i / buffer.sampleRate;
    }
  }
  return 0;
}

/*function playHit(target, power = 1) {
  const layers = HIT_LAYERS[target];
  if (!layers) return;

  layers.forEach(l => {
    playSound(
      l.name,
      l.vol * power,
      randomRange(l.pitch[0], l.pitch[1]),
      l.offset
    );
  });
}*/

function randomRange(min, max, precision = 2) {
  const value = Math.random() * (max - min) + min;
  return Number(value.toFixed(precision));
}


function testBeep() {
  const ctx = audioCtx;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.frequency.value = 880;
  gain.gain.value = 0.2;

  osc.connect(gain).connect(ctx.destination);

  console.warn("BEEP @", performance.now(), ctx.currentTime);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.05);
}