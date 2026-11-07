class AssetManager {
  constructor() {
    
    this.debugDownloadOnly = [
     
      "sounds/menu-tab-sound3.mp3",
      "sounds/menu-sound2.mp3",
      "sounds/error-sound.mp3",
      "sounds/open-popup2.mp3",
      "sounds/system-sound2.mp3",
      "sounds/system-sound3.mp3",
      "sounds/skill-unlock-sound2.mp3",
      "sounds/levelup-sound.mp3",
      "sounds/death-sound.mp3",
      "sounds/buy-sound2.mp3",
      "sounds/pickup-item-sound2.mp3",
      "sounds/pickup-gold-sound.mp3",
      "sounds/levelup-sound2.mp3",
      "sounds/open-chest.mp3",
      "sounds/equip-sword.mp3",
      "sounds/drink-potion.mp3",
      "sounds/shrine5.mp3",
      "sounds/shrine3.mp3",
      "sounds/shrine.mp3",
      "sounds/equip-universal.mp3",
      "sounds/unequip2.mp3",
      "sounds/sold.mp3",
      "sounds/low-stamina-sound.mp3",
      "sounds/player-exhausted-sound.mp3",
      "sounds/low-hp-sound.mp3",

      "sounds/perfect-block-sound_n.mp3",
      "sounds/normal-block-sound.mp3",
      "sounds/timed-block-sound2.mp3",
      "sounds/turtle-block-sound.mp3",
      "sounds/turtle-block-down-sound.mp3",

      "sounds/hit-sound2.mp3",
      "sounds/hit-sound1.mp3",
      "sounds/impact-body-sound.mp3",
      "sounds/metal-click-sound.mp3",
      "sounds/air-whoosh-sound.mp3",
      "sounds/flesh-hit-sound4.mp3",
      "sounds/blade-cut-sound.mp3",
      "sounds/blade-cut-sound2.mp3",
      "sounds/dodge-sound.mp3",
      "sounds/crit-sound.mp3",
      "sounds/charge-skill-sound.mp3",
      "sounds/jump-land-skill-sound.mp3",
      "sounds/double-attack-skill-sound.mp3",

      "sounds/power-windup-strike-sound2.mp3",
      "sounds/power-strike-skill-sound2.mp3",
      "sounds/double-attack-skill-sound2.mp3",
      "sounds/jump-skill-sound2.mp3",
      "sounds/jump-land-skill-sound3.mp3",
      "sounds/charge-skill-sound3.mp3",
      "sounds/slow-effect-sound.mp3",
      "sounds/slow-mo-on-sound3.mp3",
      "sounds/warrior-shout-skill-sound.mp3",
    
      "img/backgrounds/west-map-mask.png",
      "img/backgrounds/map-pergamin-long.png",
      "img/maps/west-map3.png",
      "img/loadings/elmaris-port-loading.png",
      "img/loadings/thalorn-village-loading.png",
      "img/loadings/reapers-road-loading.png",
      "img/loadings/lirwen-castle-loading.png",
      "img/loadings/green-pass-loading.png",
      "img/loadings/whispering-trees-loading.png",
 
    
      "img/buttons/close-btn.png",
    
      "img/backgrounds/compare-background.png",
    
      "img/icons/menu-hp-icon.png",
      "img/icons/menu-dmg-icon.png",
      "img/icons/menu-def-icon.png",

      "img/icons/enter-region-icon.png",
      "img/icons/closed-lock-icon.png",
      "img/icons/expedition-gold-icon.png",
      "img/backgrounds/hp-orb-frame3.png",
    
      "img/icons/menu-world-map-icon.png",
      "img/icons/menu-equipment-icon.png",
      "img/icons/menu-character-icon.png",
      "img/icons/menu-battle-icon.png",
      "img/icons/menu-skills-icon.png",
    
      "img/items/placeholder.png",
      "img/icons/menu-settings-icon.png",

      "img/backgrounds/ribbon-title2.png",

      "img/icons/explore-arrow-left-icon.png",
      "img/icons/explore-arrow-right-icon.png",
      "img/icons/quest-book-icon.png",
      "img/icons/quest-book-icon-update.png",
      "img/icons/menu-market-icon.png",
      "img/icons/death-title-icon.png",
      "img/icons/levelup-title-icon.png",
 
      "img/icons/expedition-kills-icon.png",
      "img/icons/expedition-impulse-icon.png",
      "img/icons/expedition-time-icon.png",
      "img/icons/menu-energy-icon.png",
  
      "img/maps/world-map.png",
      "img/frames/world-map-frame.png",

      "img/icons/compas-icon2.png",

      "img/icons/show-level-names-icon.png",
    
      `img/icons/predator-protocol-icon.png`,
      `img/icons/olden-rift-icon.png`,
      `img/icons/corrupted-simulation-icon.png`,
      `img/icons/swarm-protocol-icon.png`,
      `img/icons/void-instability-icon.png`,
      `img/icons/broken-time-icon.png`,
      `img/icons/blood-echo-icon2.png`,
      `img/icons/hunter-dimension-icon.png`,
 
    
      "img/backgrounds/forest-slot-bg.png",
      "img/backgrounds/thalorn-slot-bg.png",
      "img/backgrounds/reapers-slot-bg.png",
      "img/backgrounds/lirwen-slot-bg.png",
      "img/backgrounds/greenpass-slot-bg.png", 
      "img/backgrounds/whispering-trees-slot-bg.png",

    
      "img/exploring-slots/grey-wolf.png",
      "img/exploring-slots/boar.png",
      "img/exploring-slots/fox.png",
      "img/exploring-slots/dear.png",
      "img/exploring-slots/lynx.png",
      "img/exploring-slots/mad-dog3.png",
      "img/exploring-slots/crocodile.png",
      "img/exploring-slots/warthog.png",
      "img/exploring-slots/spider2.png",
      "img/exploring-slots/spider.png",
      "img/exploring-slots/black-wolf.png",
      "img/exploring-slots/mutated-deer.png",
      "img/exploring-slots/mutated-fox.png",

      "img/exploring-slots/lumberjack.png",
      "img/exploring-slots/savage.png",
      "img/exploring-slots/savage-boneshield.png",
      "img/exploring-slots/bandit.png",
      "img/exploring-slots/bandit-crossbow.png",
      "img/exploring-slots/raider.png",
      "img/exploring-slots/poacher.png",
      "img/exploring-slots/archer.png",
      "img/exploring-slots/rogue.png",
      "img/exploring-slots/thief.png",
      "img/exploring-slots/sailor.png",
      "img/exploring-slots/pirate.png",
      "img/exploring-slots/bossman.png",
    
      "img/exploring-slots/alpha-wolf.png",
      "img/exploring-slots/queen-spider.png",
      "img/exploring-slots/cave-giant-boss.png",
    
      "img/exploring-slots/campfire.png",
      "img/exploring-slots/campfire-off.png",
      "img/exploring-slots/shrine-protect.png",
      "img/exploring-slots/shrine-power.png",
      "img/exploring-slots/shrine-life.png",
      "img/exploring-slots/wood-chest.png",
      "img/exploring-slots/iron-chest.png",

      "img/exploring-slots/rann-elmaris-npc.png",
      "img/exploring-slots/lost-boxes-elmaris.png",
      "img/exploring-slots/lost-feather-elmaris.png",

      "img/exploring-slots/kill-wolfs-thalorn.png",
      "img/exploring-slots/mystical-stone-thalorn2.png",
      "img/exploring-slots/poisoned-water-thalorn.png",
      "img/exploring-slots/tharic-thalorn-npc.png",

      "img/exploring-slots/alpha-shadow-dear-reaperroad.png",
      "img/exploring-slots/alpha-shadow-cave-reaperroad.png",

      "img/exploring-slots/kael-lirwen-npc.png",
      "img/exploring-slots/velmor-lirwen-npc.png",
      "img/exploring-slots/debt-in-steel-lirwen.png",
      "img/exploring-slots/libraries_key-lirwen.png",

      "img/exploring-slots/scattered-map-greenpass.png",
      "img/exploring-slots/stolen-totem-greenpass.png",

      "img/exploring-slots/disturbed-in-forest-whispering-trees.png",
      "img/exploring-slots/spider-web-queentrace-whispering-trees.png",
      "img/exploring-slots/spider-web-cave-whispering-trees.png",

      "img/exploring-slots/lirra-elmaris-npc.png",
      "img/exploring-slots/elwen-elmaris-npc.png",
      "img/exploring-slots/kryspin-elmaris-npc.png",

      "img/exploring-slots/garran-thalorn-npc.png",
      "img/exploring-slots/erynn-thalorn-npc.png",
      "img/exploring-slots/bronn-thalorn-npc.png",
 
      "img/exploring-slots/lyrien-reaperroad-npc.png",

      "img/exploring-slots/maelor-lirwen-npc.png",
      "img/exploring-slots/brakk-lirwen-npc.png",
 
      "img/exploring-slots/rellian-greenpass-npc.png",
      "img/exploring-slots/erydne-greenpass-npc.png",
  
      "img/exploring-slots/whisperer-whispering-trees-npc.png",
      "img/exploring-slots/malik-whispering-trees-npc.png",

      "img/frames/explore-boss-frame2.png",
      "img/frames/explore-miniboss-frame2.png",
      "img/frames/explore-normal-frame.png",
      "img/frames/other-frame.png",
      "img/frames/explore-elite-frame.png",
      "img/frames/explore-chest-frame.png",
      "img/frames/explore-shrine-frame.png",
 
      "img/buttons/start-battle-icon.png",
      "img/buttons/use-shrine-icon.png",
      "img/buttons/open-chest-icon.png",
      "img/buttons/flee-icon.png",
      "img/buttons/firecamp-icon.png",

    
     //NEW
     "img/icons/segment-boss-icon.png",
     "img/icons/segment-miniboss-icon.png",
     "img/icons/segment-chest-icon.png",
     "img/icons/segment-shrine-icon.png",

     "img/buttons/close-btn.png",

     "img/exploring-slots/rann-elmaris-npc.png",
     "img/exploring-slots/lost-boxes-elmaris.png",
     "img/exploring-slots/lost-feather-elmaris.png",
     "img/exploring-slots/kill-wolfs-thalorn.png",
     "img/exploring-slots/mystical-stone-thalorn2.png",
     "img/exploring-slots/poisoned-water-thalorn.png",
     "img/exploring-slots/tharic-thalorn-npc.png",
    
     "img/exploring-slots/alpha-shadow-dear-reaperroad.png",
     "img/exploring-slots/alpha-shadow-cave-reaperroad.png",
     
     "img/exploring-slots/kael-lirwen-npc.png",
     "img/exploring-slots/velmor-lirwen-npc.png",
     "img/exploring-slots/debt-in-steel-lirwen.png",
     "img/exploring-slots/libraries_key-lirwen.png",

     "img/exploring-slots/scattered-map-greenpass.png",
     "img/exploring-slots/stolen-totem-greenpass.png",
    
     "img/exploring-slots/disturbed-in-forest-whispering-trees.png",
     "img/exploring-slots/spider-web-queentrace-whispering-trees.png",
     "img/exploring-slots/spider-web-cave-whispering-trees.png",

     "img/exploring-slots/lirra-elmaris-npc.png",
     "img/exploring-slots/elwen-elmaris-npc.png",
     "img/exploring-slots/kryspin-elmaris-npc.png",
    
     "img/exploring-slots/garran-thalorn-npc.png",
     "img/exploring-slots/erynn-thalorn-npc.png",
     "img/exploring-slots/bronn-thalorn-npc.png",

     "img/exploring-slots/lyrien-reaperroad-npc.png",

     "img/exploring-slots/maelor-lirwen-npc.png",
     "img/exploring-slots/brakk-lirwen-npc.png",
 
     "img/exploring-slots/rellian-greenpass-npc.png",
     "img/exploring-slots/erydne-greenpass-npc.png",

     "img/exploring-slots/whisperer-whispering-trees-npc.png",
     "img/exploring-slots/malik-whispering-trees-npc.png",

     "img/icons/exp-icon.png",
     "img/icons/inventory-icon.png",

     "img/icons/reward-separator-icon.png",
     "img/icons/reward-separator-icon-en.png",

    
     "img/icons/turtle-mini-icon.png",
     "img/icons/timed-mini-icon.png",
     "img/icons/poise-mini-icon.png",

     "img/icons/left-hand-placeholder.png",
     "img/icons/right-hand-placeholder.png",
     "img/icons/ok-icon.png",
     "img/icons/trash-icon2.png",

     "img/icons/focus-skill-icon.png",
     "img/icons/powerful-attack-skill-icon.png",
     "img/icons/double-attack-skill-icon.png",
     "img/icons/charge-skill-icon.png",
     "img/icons/jump-skill-icon.png",
     "img/icons/warrior-shout-skill-icon.png",
     "img/icons/longevity-skill-icon.png",
     "img/icons/steadfastness-skill-icon.png",
     "img/icons/dmg-reduction-skill-icon2.png",
     "img/icons/armor-stack-skill-icon.png",
     "img/icons/superhuman-strength-skill-icon.png",
     "img/icons/stamina-bonus-skill-icon.png",
     "img/icons/max-def-skill-icon2.png",
     "img/icons/fortitude-skill-icon.png",
     "img/icons/hp-to-dmg-skill-icon.png",
     "img/icons/crit-skill-icon.png",
     "img/icons/atkspd-skill-icon.png",
     "img/icons/crit-damage-skill-icon2.png",
     "img/icons/perfect-block-skill-icon.png",
     "img/icons/perfect-window-skill-icon.png",
     "img/icons/perfect-chain-skill-icon.png",
     "img/icons/block-recovery-skill-icon.png",
 

     "img/icons/skill-dmg-icon.png",
     "img/icons/skill-stun-icon2.png",
     "img/icons/hp-passive-icon.png",
     "img/icons/dmg-passive-icon.png",
     "img/icons/def-passive-icon.png",
     "img/icons/skill-duration-icon.png",
     "img/icons/bleed-skill-icon.png",
     "img/icons/skill-slow-icon.png",
     "img/icons/perfect-window-icon.png",
     "img/icons/break-armor-skill-icon.png",
     "img/icons/atkspd-passive-icon.png",
     "img/icons/stamina-regen-skill-icon.png",
    
     "img/icons/skill-cooldown-icon.png",
     "img/icons/stamina-cost-icon.png",

     "img/vfx/slash.png", 
     "img/vfx/hit.png", 
     "img/vfx/double-attack-left.png",
     "img/vfx/double-attack-right.png",
     "img/vfx/charge.png",
     "img/vfx/impact-jump.png",
     "img/vfx/shockwave.png",
     "img/vfx/impact-core.png",
     "img/vfx/bleed.png",
  
     "img/icons/bleed-icon.png",
     "img/icons/armor-break-icon.png",
    
     "img/backgrounds/tree-skills-bg.png",
 
     "img/icons/show-item-icon.png", 
     "img/icons/equip-potion-icon.png", 
     "img/icons/eat-icon.png", 
     "img/icons/comparing-icon.png", 
    
    
     "img/icons/filter-long-sword-icon.png",
     "img/icons/filter-helmet-icon.png",
     "img/icons/filter-armor-icon.png",
     "img/icons/filter-gloves-icon.png",
     "img/icons/filter-shoulder-icon.png",
     "img/icons/filter-bracers-icon.png",
     "img/icons/filter-belt-icon.png",
     "img/icons/filter-pants-icon.png",
     "img/icons/filter-boots-icon.png",
     "img/icons/filter-shield-icon.png",

     "img/icons/inventory-icon.png",
     "img/icons/sell-item-icon.png",
    
     "img/items/small-heal-potion.png",
     "img/items/medium-heal-potion.png",
     "img/items/medium-empty-potion.png",

     "img/icons/menu-skills-icon-update.png",
     "img/icons/menu-character-icon-update.png",
    
     "img/backgrounds/common-texture.png", 
     "img/backgrounds/rare-texture.png", 
     "img/backgrounds/unique-texture.png", 
     "img/backgrounds/epic-texture.png", 
     "img/backgrounds/legendary-texture.png", 
     "img/backgrounds/special-texture.png", 
     "img/backgrounds/set-texture.png", 
     "img/backgrounds/poise-texture.png", 
     "img/backgrounds/turtle-texture.png", 
     "img/backgrounds/other-texture.png", 
     "img/backgrounds/metallic-texture.png",
     "img/backgrounds/coal-texture.png",
     "img/backgrounds/dark-violet-texture.png",
     "img/backgrounds/dark-brown-texture.png",

     "img/backgrounds/west-character-bg.png",
     "img/backgrounds/warrior.png", 
    
  
     "live/js/item-utility.js",
     "live/js/store-items.js",
     "live/js/item.js",
     "live/js/combat.js",
     "live/js/skills.js",
     "live/js/combat-animations.js",
     "live/js/combat-utility.js",
     "live/js/skills-combat.js",
     "live/js/skills-database.js",
     "live/js/battle.js",
     "live/js/map.js",
     "live/js/exploring-utility.js",
     "live/js/inventory.js",
     "live/js/store.js",
     "live/js/character.js",
     "live/js/location.js",
     "live/js/expedition-config.js",
     "live/js/quests-assets.js",
     "live/js/quests-database.js",
     "live/js/quests.js",
     "live/js/shrine-chest.js",
     "live/js/shrine-chest-database.js",
     "live/js/enemy.js",
     "live/js/enemy-database.js",
     "live/js/localization-tooltips.js",
     "live/js/localization-skills.js",
     "live/js/localization-quests.js",
     "live/js/localization-dialogues.js",
     "live/js/localization-items.js",
     "live/js/localization-locations.js",
    
     "img/items/great-sword.png", 
     "img/items/double-axe.png", 
     "img/items/spear.png", 
     "img/items/boots.png", 
     "img/items/triangle-shield.png", 
     "img/items/short-sword.png", 
     "img/items/shoulder.png", 
     "img/items/round-shield.png", 
     "img/items/pants.png", 
     "img/items/plate-armor.png", 
     "img/items/mace.png", 
     "img/items/long-sword.png", 
     "img/items/leather-armor.png", 
     "img/items/hammer.png", 
     "img/items/chestplate.png", 
     "img/items/gloves.png", 
     "img/items/kalkan.png", 
     "img/items/chainmail.png", 
     "img/items/bracers.png", 
     "img/items/buckler.png", 
     "img/items/belt.png", 
     "img/items/axe.png",
     "img/items/helmet.png",
   
    
    ];
  
    this.resolvedAssets = new Map();
    
    this.forceDownload = false;
    
    this.Filesystem = window.Capacitor?.Plugins?.Filesystem;
    
    this.devMode = false;
       
    // 🌍 URL do GitHub Pages assets
    this.remoteBaseUrl =
      "https://Poul12.github.io/rpglooter-assets";
 
    // 📄 manifest URL
    this.remoteManifestUrl =
      `${this.remoteBaseUrl}/manifest.json`;

    // 💾 local cache manifest
    this.localManifestKey =
      "rpglooter_local_manifest";

    // 📦 remote manifest
    this.remoteManifest = null;

    // 📦 local manifest
    this.localManifest = null;
    
    this.useOnlineAssets = false;
    
    this.cacheBasePath =
       "/storage/emulated/0/Android/data/com.manichord.mgit/files/cache/assets/";
    
    this.localRepoBaseUrl =
      "/storage/emulated/0/Android/data/com.manichord.mgit/files/repo/rpglooter-assets";

    this.localJsRepoBaseUrl =
      "/storage/emulated/0/Android/data/com.manichord.mgit/files/repo/RpgLooter/www";
    
    this.cacheEnabled = true;

    this.codePatched = false;
    
    this.mode = "cache";
    // "remote"
    // "local"
    // "cache"
    
    this.connectionLost = false;
    
    this.hasInternet = true;
    
    this.debugMode = false;

    this.debugConfig = {

      fakeSlowDownload: false,

      fakeDownloadDelay: 600,

      fakeDownloadSpeed: 900000,
      
      fakeManifestError: false,

      fakeNoInternet: false,

      fakeHasCache: true,
      
      fakeRandomFail: false,

      fakeSaveError: false,

      fakeFinalizingDelay: 2000,

      allowSaveFailed: true,
      
      fakeFilesCount: 12
    };
    
    this.cachedFiles = new Set();
    
    this.loadedScripts = new Set();
    
    this.loadedCss = new Set();

  }

  // =====================================================
  // 🌍 LOAD REMOTE MANIFEST
  // =====================================================

  
  async fetchWithTimeout(url, options = {}, timeoutMs = 15000) {
    const controller = new AbortController();
    let timedOut = false;
    const timer = window.setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, timeoutMs);

    try {
      return await fetch(url, {
        ...options,
        signal: controller.signal
      });
    } catch (error) {
      if (timedOut) {
        const timeoutError = new Error(`Request timed out after ${timeoutMs}ms: ${url}`);
        timeoutError.name = "TimeoutError";
        throw timeoutError;
      }
      throw error;
    } finally {
      window.clearTimeout(timer);
    }
  }

  async loadRemoteManifest() {
    const startedAt = performance.now();
    window.RuntimeDiagnostics?.record("asset-manager.manifest.start", { url: this.remoteManifestUrl });

    try {

    //  console.log("🌍 Loading remote manifest...");

      const response = await this.fetchWithTimeout(this.remoteManifestUrl);

      if (!response.ok) {

        throw new AssetError(
          "MANIFEST_HTTP",
          `Manifest HTTP ${response.status}`,
          {
            status: response.status
          }
        );
      }

      const json = await response.json();

      // 🛡️ walidacja
      if (!json || !Array.isArray(json.files)) {

        throw new AssetError(
          "INVALID_MANIFEST",
          "Manifest format invalid"
        );
      }

      this.remoteManifest = json;
      window.RuntimeDiagnostics?.record("asset-manager.manifest.complete", { durationMs: Math.round(performance.now() - startedAt), version: String(json.version || ""), files: json.files.length });

    //  console.log("✅ Remote manifest loaded:", this.remoteManifest);

      
      if (this.debugMode && this.debugConfig.fakeManifestError) {

        throw new AssetError(
          "INVALID_MANIFEST",
          "Manifest format invalid"
        );
     }  
      
      if (this.debugMode && this.debugConfig.fakeNoInternet) {

        throw new AssetError(
          "NO_INTERNET",
          "No internet connection"
        );
      }
      
      return this.remoteManifest;

    } catch (err) {
      window.RuntimeDiagnostics?.record("asset-manager.manifest.fail", { durationMs: Math.round(performance.now() - startedAt), message: String(err?.message || err), type: err?.type || "" });

      // jeśli to już AssetError
      if (err instanceof AssetError) {

        console.error("❌ Manifest error:", err.type, err.message);

        throw err;
      }

      // typowy network fail
      const networkError =
        new AssetError(
          "NETWORK",
          "Cannot connect to asset server",
          {
            originalError: err
          }
        );

      console.error("❌ Failed loading remote manifest:", networkError);

      throw networkError;
    }
  }
  

  async fetchWithRetry(url, retries = 3) {

    let lastError;

    for (let i = 0; i < retries; i++) {

      try {

        const response = await this.fetchWithTimeout(url);

        if (!response.ok) {
          throw new Error(
            `HTTP ${response.status}`
          );
        }
        
        return response;

      } catch(err) {

        lastError = err;

        // 🔥 runtime disconnect
        if (!navigator.onLine) {

          throw new AssetError(
            "CONNECTION_LOST",
            "Internet connection lost"
          );
        }
        
        await wait(1000);
      }
    }
      
    throw new AssetError(
      "CONNECTION_LOST",
      "Connection lost during download"
    );
    
  }
  
  // =====================================================
  // 💾 LOAD LOCAL MANIFEST
  // =====================================================

  loadLocalManifest() {

    try {

      const raw = localStorage.getItem(
        this.localManifestKey
      );

      if (!raw) {

        console.log(
          "⚠ No local manifest found"
        );

        this.localManifest = {
          version: "0",
          files: []
        };

        return this.localManifest;
      }

      this.localManifest = JSON.parse(raw);

      console.log(
        "✅ Local manifest loaded:",
        this.localManifest
      );

      return this.localManifest;

    } catch (err) {

      console.error(
        "❌ Failed loading local manifest:",
        err
      );

      this.localManifest = {
        version: "0",
        files: []
      };

      return this.localManifest;
    }
  }

  // =====================================================
  // 💾 SAVE LOCAL MANIFEST
  // =====================================================

  saveLocalManifest(manifest) {

    try {

      localStorage.setItem(
        this.localManifestKey,
        JSON.stringify(manifest)
      );

      this.localManifest = manifest;

      console.log(
        "✅ Local manifest saved"
      );

    } catch (err) {

      console.error(
        "❌ Failed saving local manifest:",
        err
      );
    }
  }

  hasLocalCache() {
    return this.localManifest?.files?.length > 0;
  }
  
  // =====================================================
  // 🔍 CHECK FOR UPDATES
  // =====================================================

  hasUpdates() {

    if (this.devMode) {
      return false;
    }
    
    if (!this.remoteManifest) {
      return false;
    } 

    const localFiles = {};

    for (const file of this.localManifest.files || []) {
      localFiles[file.path] = file.hash;
    }

    for (const remoteFile of this.remoteManifest.files) {

      if (localFiles[remoteFile.path] !== remoteFile.hash) {
        return true;
      }
    }

    return false;
  }
  
 /* hasUpdates() {
    
    if (this.devMode) {
      return false;
    }
    
    if (!this.remoteManifest) {
      return false;
    }

    if (!this.localManifest) {
      return true;
    }

    return (
      this.remoteManifest.version !==
      this.localManifest.version
    );
  }*/

  
  markFileAsDownloaded(file) {

    if (!this.localManifest) {

      this.localManifest = {
        version: this.remoteManifest.version,
        files: []
      };
    }
    
    // sprawdź czy już istnieje
    const exists = this.localManifest.files.some(
      local => local.path === file.path
    );
    
    if (exists) {
      return;
    }

    this.localManifest.files.push({
      path: file.path,
      hash: file.hash,
      size: file.size
    });

    // 🔥 zapis natychmiast
    this.saveLocalManifest(this.localManifest);

    //console.log("📝 Manifest updated:", file.path);
  }
  
  updateLocalManifestFile(file) {
    if (!this.localManifest.files) {
      this.localManifest.files = [];
    }

    const existingIndex = this.localManifest.files.findIndex(
      f => f.path === file.path
    );

    if (existingIndex >= 0) {
      
      this.localManifest.files[existingIndex] = file;

    } else {

      this.localManifest.files.push(file);
    }
    
    this.saveLocalManifest(this.localManifest);
  }
  
  // =====================================================
  // 📦 GET FILES TO DOWNLOAD
  // =====================================================

  
  async preloadAssets(paths) {
    const startedAt = performance.now();
    window.RuntimeDiagnostics?.record("asset-manager.preload.start", { count: paths.length, first: paths.slice(0, 8) });

    for (const path of paths) {
      const pathStartedAt = performance.now();
      window.RuntimeDiagnostics?.record("asset-manager.preload-item.start", { path });

      // already resolved
      if (this.resolvedAssets.has(path)) {
        continue;
      } 

      const url = await this.getAssetUrl(path);

      this.resolvedAssets.set(path, url);
      window.RuntimeDiagnostics?.record("asset-manager.preload-item.complete", { path, durationMs: Math.round(performance.now() - pathStartedAt) });

      //console.log("✅ PRELOADED:", path);
    }
    window.RuntimeDiagnostics?.record("asset-manager.preload.complete", { count: paths.length, durationMs: Math.round(performance.now() - startedAt) });
  }
  
  getResolvedAsset(path) {
    return this.resolvedAssets.get(path);
  }
  
  getFilesToDownload() {

    if (!this.remoteManifest) {
      return [];
    }

    if (this.debugMode) {

      return Array.from({
        length: this.debugConfig.fakeFilesCount
      }, (_, i) => ({
        path: `fake/file_${i}.png`,
        size: 400000 + Math.random() * 900000,
        hash: `debug_${i}`
      }));
    }
    
    
    const localFilesMap = {};

    for (const file of this.localManifest.files) {
      localFilesMap[file.path] = file.hash;
    }

    const missing = [];

    for (const remoteFile of this.remoteManifest.files) {

      const localHash = localFilesMap[remoteFile.path];

      if (this.forceDownload) {
        missing.push(remoteFile);
        continue;
      }
      
      console.log(`remoteFile`, remoteFile);
      
      // 🆕 nowy lub zmieniony plik
      if (localHash !== remoteFile.hash) {
        missing.push(remoteFile);
        console.log(`missing remoteFile`, remoteFile);
      }
    }

    
    /*if (this.debugDownloadOnly?.length) {
      return missing.filter(file =>
        this.debugDownloadOnly.includes(file.path)
      );
    }*/
    
    return missing;
  }

  getPatchStats(files) {

    const totalBytes = files.reduce(
      (sum, f) => sum + (f.size || 0), 0);
 
    return {
      totalBytes,
      downloadedBytes: 0
    };
  }
  
  async syncAssets(files, onProgress) {
    const syncStartedAt = performance.now();

    if (!navigator.onLine) {
      throw new AssetError(
        "NO_INTERNET",
        "Internet connection unavailable"
      );
    }
    
    // ✅ NIC DO POBRANIA
    if (files.length === 0) {

      onProgress?.({
        currentFile: 0,
        totalFiles: 0,

        downloadedBytes: 0,
        totalBytes: 0,

        percent: 100,

        currentName: "Game is up to date",

        phase: "complete"
      });

      return;
    }
    
    const totalFiles = files.length;
    const totalBytesPlanned = files.reduce((sum, file) => sum + (file.size || 0), 0);
    window.RuntimeDiagnostics?.record("asset-manager.sync.start", { totalFiles, totalBytes: totalBytesPlanned });
    
    const totalBytes = totalBytesPlanned;
    
    let downloadedBytes = 0;

    let currentFile = 0;
    
    for (const file of files) {

      if (this.connectionLost) {

        throw new AssetError(
          "CONNECTION_LOST",
          "Connection lost during download"
        );
      }
      
      //currentFile++;

      const fileStartedAt = performance.now();
      window.RuntimeDiagnostics?.record("asset-manager.file.start", { path: file.path, index: currentFile + 1, total: totalFiles });
      try {

       // console.log("📥 Downloading:", file.path);

        if (this.debugMode && this.debugConfig.fakeRandomFail && Math.random() < 0.2) {

          throw new AssetError(
            "DOWNLOAD_FAILED",
            "Random debug failure"
          );
          
        }
        
        if (this.debugMode) {

           //await wait(this.debugConfig.fakeDownloadDelay);

           const speed = this.debugConfig.fakeDownloadSpeed;

           const delay = (file.size / speed) * 1000;

           let randomizedDelay = delay * (0.7 + Math.random() * 0.6);
        
           // 15% szans na spike
           if (Math.random() < 0.15) {
             randomizedDelay *= 2.5;
           }
          
           await wait(randomizedDelay);
          
           downloadedBytes += file.size;

           //this.updateLocalManifestFile(file);

           this.markFileAsDownloaded(file);

           currentFile++;
          
           const percent = Math.floor(
             (downloadedBytes / totalBytes) * 100
           );
          
           onProgress?.({
             currentFile,
             totalFiles,

             downloadedBytes,
             totalBytes,
             
             percent,

             //currentName: file.path,
             
             currentName: t(getLoaderLabel(file.path)),
             
             phase: "downloading"
           });

           continue;
        }
        
        const url = `${this.remoteBaseUrl}/${file.path}`;

        //const response = await fetch(url);

        const response = await this.fetchWithRetry(url);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
 
        const blob = await response.blob();

        // REAL SIZE
        const fileSize = blob.size || file.size || 0;

        // SAVE
        await this.saveFile(file.path, blob);

        this.cachedFiles.add(file.path);

       /* if (file.path.endsWith(".js")) {
          this.codePatched = true;
        }*/
        
        if (file.type === "code" && !this.isFirstInstall) {
          this.codePatched = true;
        }
        
        //this.updateLocalManifestFile(file);
        this.markFileAsDownloaded(file);
        
        currentFile++;
        
        downloadedBytes += fileSize;
        
        const percent = totalBytes > 0
          ? Math.floor((downloadedBytes / totalBytes) * 100)
          : Math.floor((currentFile / totalFiles) * 100);

        onProgress?.({
          currentFile,
          totalFiles,

          downloadedBytes,
          totalBytes,

          percent,

          //currentName: file.path,

          currentName: t(getLoaderLabel(file.path)),
          
          phase: "downloading"
        });
        window.RuntimeDiagnostics?.record("asset-manager.file.complete", { path: file.path, durationMs: Math.round(performance.now() - fileStartedAt), downloadedBytes: fileSize });
        
       // console.log("✅ Cached:", file.path);

      } catch (err) {
        window.RuntimeDiagnostics?.record("asset-manager.file.fail", { path: file.path, durationMs: Math.round(performance.now() - fileStartedAt), message: String(err?.message || err) });

        console.error("❌ Download failed:", file.path, err);

        onProgress?.({
          currentFile,
          totalFiles,

          downloadedBytes,
          totalBytes,

          percent: 0,
          /*percent: Math.floor(
            (downloadedBytes / totalBytes) * 100
          ),*/
          
          //currentName: file.path,

          currentName: t(getLoaderLabel(file.path)),
          
          phase: "error",

          error: err
        });
        
        await wait?.(0);
        
        throw err;
      }
    }

    window.RuntimeDiagnostics?.record("asset-manager.sync.complete", { totalFiles, durationMs: Math.round(performance.now() - syncStartedAt) });
    // FINALIZATION
    onProgress?.({
      currentFile: totalFiles,
      totalFiles,

      downloadedBytes: totalBytes,
      totalBytes,

      percent: 100,

      currentName: "Finalizing cache...",

      phase: "finalizing"
    });
  }  
  
  requiresReload() {
    return this.codePatched;
  }
  
  async loadPatchedScript(path) {

    // 🔥 already loaded
    if (this.loadedScripts.has(path)) {
      window.RuntimeDiagnostics?.record("asset-manager.script.cached", { path });
      console.log("⚠️ Script already loaded:", path);
      return;
    }

    const startedAt = performance.now();
    const pendingId = "script:" + path;
    window.__originPendingResources = window.__originPendingResources || {};
    window.__originPendingResources[pendingId] = { type: "script", path, phase: "resolving-url", startedAt: new Date().toISOString() };
    window.RuntimeDiagnostics?.record("asset-manager.script.start", { path });
    let localUrl;
    try {
      const resolveStartedAt = performance.now();
      localUrl = await this.getAssetUrl(path);
      window.__originPendingResources[pendingId].phase = "waiting-for-load-event";
      window.RuntimeDiagnostics?.record("asset-manager.script.url-resolved", { path, durationMs: Math.round(performance.now() - resolveStartedAt) });
    } catch (error) {
      delete window.__originPendingResources[pendingId];
      window.RuntimeDiagnostics?.record("asset-manager.script.url-fail", { path, message: String(error?.message || error) });
      throw error;
    }

    return new Promise((resolve, reject) => {

      const script = document.createElement("script");
    
      const version = this.remoteManifest?.version || Date.now();

      //script.src = `${localUrl}?v=${Date.now()}`;
      script.src = `${localUrl}?v=${version}`;

      const loadTimeout = window.setTimeout(() => {
        script.remove();
        delete window.__originPendingResources[pendingId];
        window.RuntimeDiagnostics?.record("asset-manager.script.timeout", {
          path,
          timeoutMs: 15000,
          durationMs: Math.round(performance.now() - startedAt)
        });
        const error = new Error(`Script load timed out after 15000ms: ${path}`);
        error.name = "TimeoutError";
        reject(error);
      }, 15000);

      script.onload = () => {
        window.clearTimeout(loadTimeout);
        this.loadedScripts.add(path);
        delete window.__originPendingResources[pendingId];
        window.RuntimeDiagnostics?.record("asset-manager.script.complete", { path, durationMs: Math.round(performance.now() - startedAt) });
        resolve();
      };
      
      script.onerror = () => {
        window.clearTimeout(loadTimeout);
        delete window.__originPendingResources[pendingId];
        window.RuntimeDiagnostics?.record("asset-manager.script.fail", { path, durationMs: Math.round(performance.now() - startedAt) });
        console.error("❌ Failed loading script:", path);
        reject(new Error(`Script load failed: ${path}`));
      };
      
      document.body.appendChild(script);
    });
  }
  
  async loadPatchedCss(path) {

    if (this.loadedCss?.has(path)) {
      window.RuntimeDiagnostics?.record("asset-manager.css.cached", { path });
      console.log("⚠️ CSS already loaded:", path);
      return;
    }

    if (!this.loadedCss) {
      this.loadedCss = new Set();
    }

    const startedAt = performance.now();
    const pendingId = "css:" + path;
    window.__originPendingResources = window.__originPendingResources || {};
    window.__originPendingResources[pendingId] = { type: "css", path, phase: "resolving-url", startedAt: new Date().toISOString() };
    window.RuntimeDiagnostics?.record("asset-manager.css.start", { path });
    let localUrl;
    try {
      const resolveStartedAt = performance.now();
      localUrl = await this.getAssetUrl(path);
      window.__originPendingResources[pendingId].phase = "waiting-for-load-event";
      window.RuntimeDiagnostics?.record("asset-manager.css.url-resolved", { path, durationMs: Math.round(performance.now() - resolveStartedAt) });
    } catch (error) {
      delete window.__originPendingResources[pendingId];
      window.RuntimeDiagnostics?.record("asset-manager.css.url-fail", { path, message: String(error?.message || error) });
      throw error;
    }

    return new Promise((resolve, reject) => {

      const link = document.createElement("link");

      const version = this.remoteManifest?.version || Date.now();

      link.rel = "stylesheet";
      link.href = `${localUrl}?v=${version}`;
      
      const loadTimeout = window.setTimeout(() => {
        link.remove();
        delete window.__originPendingResources[pendingId];
        window.RuntimeDiagnostics?.record("asset-manager.css.timeout", {
          path,
          timeoutMs: 15000,
          durationMs: Math.round(performance.now() - startedAt)
        });
        const error = new Error(`CSS load timed out after 15000ms: ${path}`);
        error.name = "TimeoutError";
        reject(error);
      }, 15000);

      link.onload = () => {
        window.clearTimeout(loadTimeout);
        this.loadedCss.add(path);
        delete window.__originPendingResources[pendingId];
        window.RuntimeDiagnostics?.record("asset-manager.css.complete", { path, durationMs: Math.round(performance.now() - startedAt) });
        resolve();
      };
      
      link.onerror = () => {
        window.clearTimeout(loadTimeout);
        delete window.__originPendingResources[pendingId];
        window.RuntimeDiagnostics?.record("asset-manager.css.fail", { path, durationMs: Math.round(performance.now() - startedAt) });
        console.error("❌ Failed loading CSS:", path);
        reject(new Error(`CSS load failed: ${path}`));
      };
      
      document.head.appendChild(link);
    });
  }
  
 /* async loadPatchedScript(path) {

    if (this.loadedScripts.has(path)) {
      console.log("⚠️ Script already loaded:", path);
      return;
    }
  
    const url = await this.getAssetUrl(path);
    const finalUrl = url.includes("localhost")
      ? `${url}?v=${Date.now()}`
      : url;
    
    return new Promise((resolve, reject) => {

      const script = document.createElement("script");

      script.src = url; // ❌ bez cache-bust

      script.onload = resolve;

      script.onerror = () => {
        console.error("❌ Failed loading script:", path);
        reject(new Error(`Script load failed: ${path}`));
      };

      document.body.appendChild(script);
    });
  }*/
  
  
 /* async loadPatchedScript(path) {

    const localUrl = await this.getAssetUrl(path);

    return new Promise((resolve, reject) => {

      const script = document.createElement("script");

      script.src = `${localUrl}?v=${Date.now()}`;

      script.onload = resolve;
      script.onerror = reject;
 
      document.body.appendChild(script);
    });
  } */
  
  // =====================================================
  // 🖼 RESOLVE ASSET URL
  // =====================================================
  
  async getAssetUrl(path) {

    // Local browser tests must use the runtime files served by the same
    // checkout as index.html. Otherwise online mode can silently load an
    // older cross-origin runtime from GitHub Pages and hide its stack trace.
    const isLocalTestHost =
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname === "localhost";
    const isCodeFile =
      typeof path === "string" &&
      (path.endsWith(".js") || path.endsWith(".css"));

    if (isLocalTestHost && isCodeFile) {
      return `/${path}`;
    }

    // 1. CACHE FIRST (NAJWAŻNIEJSZE)
    const cached = await this.getCachedAssetUrl(path);

    if (cached) {
     // console.log("📦 CACHE:", path);
      return cached;
    }

    // 2. OFFLINE FALLBACK (local repo fallback)
    if (!this.hasInternet) {
     // console.log("📁 LOCAL FALLBACK:", path);
      
      /*if(this.debugMode) {
        console.warn("📁 LOCAL FALLBACK URL:", `${this.localJsRepoBaseUrl}/${path}`);
        return `${this.localJsRepoBaseUrl}/${path}`;
      }*/
      
      if (this.debugMode) {
        //const isJsFile = path.endsWith(".js");
        const isCodeFile = path.endsWith(".js") || path.endsWith(".css");
        const baseUrl = isCodeFile
          ? this.localJsRepoBaseUrl
          : this.localRepoBaseUrl;
        
        return `${baseUrl}/${path}`;
      }
      
      return `https://localhost/${path}`;
      
    }
    
    // 2. OFFLINE FALLBACK (local repo fallback)
    /*if (!navigator.onLine || this.connectionLost) {
      console.log("📁 LOCAL FALLBACK:", path);
      return `${this.localRepoBaseUrl}/${path}`;
    }*/

    // 3. REMOTE
    //console.log("🌍 REMOTE:", path);
    return `${this.remoteBaseUrl}/${path}`;
  }
  
  
 /* async getAssetUrl(path) {

    // CACHE MODE
    if (this.mode === "cache") {

      const cached = await this.getCachedAssetUrl(path);

      if (cached) {
        console.log("📦 CACHE:", path);

        return cached;
      }

      console.log("🌍 REMOTE FALLBACK:", path);

      return `${this.remoteBaseUrl}/${path}`;
    }

    // REMOTE MODE
    if (this.mode === "remote") {
      console.log("🌍 REMOTE:", path);
      return `${this.remoteBaseUrl}/${path}`;
    }

    // LOCAL MODE
    console.log("📁 LOCAL:", path);

    return `${this.localRepoBaseUrl}/${path}`;
  }*/
  
  getBaseUrl() {

    // 🌍 ONLINE
    if (this.useOnlineAssets) {
      return this.remoteBaseUrl + "/";
    }

    // 📁 LOCAL DEV
    return "/storage/emulated/0/Android/data/com.manichord.mgit/files/repo/rpglooter-assets/";
  }
  
  async removeUnusedCachedFiles() {

    if (!this.localManifest?.files || !this.remoteManifest?.files) {
      return;
    }

    console.log("🧹 Checking unused cache files...");

    // 📦 aktualne pliki z nowego manifestu
    const remoteFiles = new Set(
      this.remoteManifest.files.map(
        file => file.path
      )
    );

    // 📦 stare pliki z local manifest
    const localFiles = this.localManifest.files;

    for (const file of localFiles) {

      // ❌ plik już nie istnieje w nowym manifeście
      if (!remoteFiles.has(file.path)) {

        try {
          console.log("🗑 Removing unused cache:", file.path);

          await this.Filesystem.deleteFile({
            path: `assets/${file.path}`,
            directory: "DATA"
          });

          this.cachedFiles.delete(file.path);

         // console.log("✅ Removed:", file.path);

        } catch (err) {
          console.warn("⚠ Failed removing:", file.path, err);
        }
      }
    }

    console.log("✅ Cache cleanup done");
  }
  
  
  buildCacheIndex() {

    this.cachedFiles.clear();

    if (!this.localManifest?.files) {
      return;
    }

    for (const file of this.localManifest.files) {
      this.cachedFiles.add(file.path);
    }

    /*console.log(
      "📦 Cache index built:",
      this.cachedFiles.size
    );*/
  }
  
  async init({ onProgress, onError } = {}) {
    const initStartedAt = performance.now();
    window.RuntimeDiagnostics?.record("asset-manager.init.start", {});

    try{
      //console.log("🚀 AssetManager init...");

      // =========================
      // LOCAL MANIFEST
      // =========================

      this.setupNetworkListeners();
      
      this.loadLocalManifest();
      window.RuntimeDiagnostics?.record("asset-manager.local-manifest.complete", { files: this.localManifest?.files?.length || 0 });

      this.isFirstInstall = !this.localManifest?.files?.length;
      
      //const hasCache = this.localManifest?.files?.length > 0;

      const hasCache = this.debugMode
        ? this.debugConfig.fakeHasCache
        : this.localManifest?.files?.length > 0;
      
      // =========================
      // OFFLINE CHECK
      // =========================
    
      if (!navigator.onLine) {

        console.warn("📴 Device offline");
        
        // ✅ offline cache exists
        if (hasCache) {

          this.buildCacheIndex();

          //console.log("✅ Using cached assets");
          
          return {
            mode: "offline_cached"
          };
        }

        // ❌ first launch without internet
        const error =
          new AssetError(
            "OFFLINE_NO_CACHE",
            "Internet connection required for first launch"
          );

        onError?.(error);

        throw error;
      }

      // =========================
      // REMOTE MANIFEST
      // =========================

      try {

        await this.loadRemoteManifest();

      } catch (err) {

         const canUseFallback = hasCache && (
           err.type === "NETWORK" ||
           err.type === "NO_INTERNET" ||
           err.type === "CONNECTION_LOST"
         );
        
        // ✅ fallback tylko dla problemów sieciowych
        if (canUseFallback) {

          //console.warn("⚠️ Using offline fallback cache");
           
          this.buildCacheIndex();

          return {
            mode: "offline_fallback"
          };
        }

        // ❌ krytyczne błędy manifestu
        onError?.(err);

        throw err;
      }
      
      this.buildCacheIndex();
      
      // =========================
      // UPDATES
      // =========================

      if (this.hasUpdates() || this.forceDownload) {

       // console.log("🆕 Updates detected");

        const files = this.getFilesToDownload();

      //  console.log("📥 Files to download:", files.length);

        await this.syncAssets(files, onProgress);

        // 🧹 cleanup
        await this.removeUnusedCachedFiles();

        this.saveLocalManifest(this.remoteManifest);

        this.buildCacheIndex();
      }

      //console.log("✅ AssetManager ready");

      window.RuntimeDiagnostics?.record("asset-manager.init.complete", { mode: "online", durationMs: Math.round(performance.now() - initStartedAt) });
      return {
        mode: "online"
      };
    } catch (err) {
      window.RuntimeDiagnostics?.record("asset-manager.init.fail", { durationMs: Math.round(performance.now() - initStartedAt), message: String(err?.message || err), type: err?.type || "" });

      console.error("❌ AssetManager INIT FAILED:", err);

      // 🔥 KLUCZ
      onError?.(err);

      return {
        mode: "error",
        error: err
      };
      
    }
  }
  
  async downloadFiles(files) {

    for (const file of files) {

      try {

        //console.log("📥 Downloading:", file.path);

        const url = `${this.remoteBaseUrl}/${file.path}`;
        
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(
            `HTTP ${response.status}`
          );
        }

        const blob = await response.blob();

        await this.saveFile(file.path, blob);

        this.cachedFiles.add(file.path);

      //  console.log("✅ Cached:", file.path);
        
       // console.log("📦 Cached files:");
       // console.log(this.cachedFiles);
        
      } catch (err) {

        console.error(
          "❌ Download failed:",
          file.path,
          err
        );
      }
      
    }
  }
  
  async saveFile(path, blob) {

    try {

      const base64 = await this.blobToBase64(blob);

      await this.Filesystem.writeFile({
        path: `assets/${path}`,
        data: base64,
        directory: "DATA",
        recursive: true
      });

    //  console.log("💾 File saved:",path);

    } catch (err) {

      if (!this.debugMode && this.debugConfig.allowSaveFailed) {
        throw new AssetError(
          "SAVE_FAILED",
          "Problem with data files save"
        );
      }
      
      console.error("❌ Save failed:", path, err);
    }
  }  
  
  blobToBase64(blob) {

    return new Promise((resolve, reject) => {

      const reader = new FileReader();

      reader.onloadend = () => {

        const base64 = reader.result.split(",")[1];

        resolve(base64);
      };

      reader.onerror = reject;

      reader.readAsDataURL(blob);
    });
  }

  async updateInternetStatus() {
    const startedAt = performance.now();
    window.RuntimeDiagnostics?.record("asset-manager.internet-check.start", {});

    try {

      const response = await this.fetchWithTimeout(
        `${this.remoteBaseUrl}/manifest.json?t=${Date.now()}`,
        {
          method: "HEAD",
          cache: "no-store"
        }
      );

      this.hasInternet = response.ok;

    } catch {
 
      this.hasInternet = false;
    }

    window.RuntimeDiagnostics?.record("asset-manager.internet-check.complete", { hasInternet: this.hasInternet, durationMs: Math.round(performance.now() - startedAt) });
   // console.log("🌍 Internet status:", this.hasInternet);
  }
    
  setupNetworkListeners() {

    window.addEventListener("offline", () => {

     // console.warn("📴 Connection lost");

      this.connectionLost = true;
    });

    window.addEventListener("online", () => {

      //console.log("🌍 Connection restored");

      this.connectionLost = false;
    });
  }
  
  async fileExists(path) {

    try {

      await this.Filesystem.stat({
        path: `assets/${path}`,
        directory: "DATA"  
      });

      return true;

    } catch {

      return false;
    }
  }  
  
  async getCachedAssetUrl(path) {

    const exists = await this.fileExists(path);

    if (!exists) {
      return null;
    }

    const result =
      await this.Filesystem.getUri({
        path: `assets/${path}`,
        directory: "DATA"
      });
    
    return window.Capacitor.convertFileSrc(result.uri);
    //return result.uri;
  }
  
  
}

function getLoaderLabel(path) {

  if (path.includes("icons")) {
    return "loader_preparing_interface";
  }

  if (path.includes("backgrounds")) {
    return "loader_loading_textures";
  }

  if (path.includes("exploring-slots")) {
    return "loader_loading_environments";
  }

  if (path.includes("items")) {
    return "loader_sync_items";
  }

  if (path.includes("sounds")) {
    return "loader_preparing_audio";
  }

  if (path.includes("skills")) {
    return "loader_loading_combat_assets";
  }

  if (path.includes("maps")) {
    return "loader_building_world_map";
  }

  return "launcher_data_synchro";
}

function formatBytes(bytes) {

  if (!bytes || bytes <= 0) {
    return "0 kB";
  }

  // GB
  if (bytes >= 1024 * 1024 * 1024) {

    return `${
      (bytes / 1024 / 1024 / 1024).toFixed(1)
    } GB`;
  }

  // MB
  if (bytes >= 1024 * 1024) {

    return `${
      (bytes / 1024 / 1024).toFixed(1)
    } MB`;
  }

  // kB
  return `${
    Math.ceil(bytes / 1024)
  } kB`;
}

class AssetError extends Error {

  constructor(type, message, extra = {}) {
    super(message);

    this.name = "AssetError";

    this.type = type;

    Object.assign(this, extra);
  }
  
  isOnline() {
    return navigator.onLine;
  }
  
  
  
}

window.assetManager = new AssetManager();