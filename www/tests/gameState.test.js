const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { test } = require("node:test");

const gameStateSource = fs.readFileSync(
  path.join(__dirname, "../js/gameState.js"),
  "utf8"
);
const menuSource = fs.readFileSync(
  path.join(__dirname, "../js/menu.js"),
  "utf8"
);

function createMenuHarness(saveStory, mode = "story") {
  const start = menuSource.indexOf("function checkIsStorySave()");
  const end = menuSource.indexOf("\nfunction checkIsSave", start);
  assert.notEqual(start, -1, "checkIsStorySave should exist");
  assert.notEqual(end, -1, "checkIsSave should follow checkIsStorySave");

  const localStorage = {
    getItem(key) {
      return key === "save_story" ? saveStory : null;
    }
  };
  const context = vm.createContext({
    localStorage,
    gameState: { world: { mode } },
    appState: { recoveryNeeded: false },
    parseSavePayload: (serialized) => {
      try {
        const parsed = JSON.parse(serialized);
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed) ||
            !parsed.gameState || typeof parsed.gameState !== "object" ||
            !parsed.gameState.world || typeof parsed.gameState.world !== "object") {
          return null;
        }
        return parsed;
      } catch {
        return null;
      }
    },
    console
  });

  vm.runInContext(
    menuSource.slice(start, end) +
      "\nglobalThis.__checkIsStorySave = checkIsStorySave;",
    context,
    { filename: "menu.js" }
  );

  return context;
}

function createGameHarness(initialStorage = {}, now = Date.now()) {
  const values = new Map(Object.entries(initialStorage));

  const localStorage = {
    getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      values.set(key, String(value));
    },
    removeItem(key) {
      values.delete(key);
    },
    clear() {
      values.clear();
    }
  };

  class FixedDate extends Date {
    static now() {
      return now;
    }
  }

  const context = vm.createContext({
    localStorage,
    Date: FixedDate,
    console
  });

  vm.runInContext(
    gameStateSource +
      "\n;globalThis.__gameTestApi = { initializeGameState, createNewGameState, saveGame, getSaveKey, getGameState: () => gameState, getAppState: () => appState, parseSavePayload };",
    context,
    { filename: "gameState.js" }
  );

  return {
    api: context.__gameTestApi,
    context,
    storage: values
  };
}

test("initializes a fresh Story save when no save exists", () => {
  const harness = createGameHarness();

  harness.api.initializeGameState();

  assert.equal(harness.api.getGameState().world.mode, "story");
  assert.equal(harness.api.getAppState().gameTime, 0);
  assert.ok(harness.api.getGameState().char);
  assert.ok(Array.isArray(harness.api.getGameState().inventory));
});

test("selects the correct save key and mode for every supported game mode", () => {
  for (const mode of ["story", "expedition", "adventure"]) {
    const harness = createGameHarness();

    harness.api.initializeGameState(mode);

    assert.equal(harness.api.getGameState().world.mode, mode);
    assert.equal(harness.api.getSaveKey(), `save_${mode}`);
  }
});

test("saves and restores game state and game-time metadata", () => {
  const harness = createGameHarness();

  harness.api.initializeGameState("story");
  harness.api.getGameState().char.level = 7;
  harness.api.getGameState().inventory.push({ id: "test-item", quantity: 2 });
  harness.api.getAppState().gameTime = 123456;
  harness.api.saveGame();

  const serialized = harness.storage.get("save_story");
  assert.ok(serialized, "save_story should be written");

  const savedPayload = JSON.parse(serialized);
  assert.equal(savedPayload.gameState.char.level, 7);
  assert.equal(savedPayload.gameState.inventory[0].id, "test-item");
  assert.equal(savedPayload.meta.gameTime, 123456);
  assert.ok(savedPayload.meta.savedAtReal > 0);

  const restored = createGameHarness({ save_story: serialized });
  restored.api.initializeGameState("story");

  assert.equal(restored.api.getGameState().char.level, 7);
  assert.equal(restored.api.getGameState().inventory[0].id, "test-item");
  assert.ok(restored.api.getAppState().gameTime >= 123456);
});

test("restores zero game time when save metadata is missing", () => {
  const now = 10000;
  const harness = createGameHarness({}, now);
  const payload = { gameState: harness.api.createNewGameState() };

  harness.storage.set("save_story", JSON.stringify(payload));
  harness.api.initializeGameState("story");

  assert.equal(harness.api.getAppState().gameTime, 0);
  assert.equal(harness.api.getAppState().recoveryNeeded, false);
});

test("rejects invalid saved game-time metadata without rejecting the save", () => {
  const now = 10000;
  const invalidValues = [null, "1200", -5, {}, []];

  for (const gameTime of invalidValues) {
    const harness = createGameHarness({}, now);
    const payload = {
      gameState: harness.api.createNewGameState(),
      meta: { gameTime, savedAtReal: now }
    };

    harness.storage.set("save_story", JSON.stringify(payload));
    harness.api.initializeGameState("story");

    assert.equal(harness.api.getAppState().gameTime, 0, `gameTime ${JSON.stringify(gameTime)} should fall back to zero`);
    assert.equal(harness.api.getAppState().recoveryNeeded, false);
  }
});

test("uses the current time when savedAtReal metadata is missing or invalid", () => {
  const now = 10000;
  const invalidValues = [undefined, null, 0, "9000", -1, {}, []];

  for (const savedAtReal of invalidValues) {
    const harness = createGameHarness({}, now);
    const meta = { gameTime: 2500 };
    if (savedAtReal !== undefined) meta.savedAtReal = savedAtReal;

    harness.storage.set("save_story", JSON.stringify({
      gameState: harness.api.createNewGameState(),
      meta
    }));
    harness.api.initializeGameState("story");

    assert.equal(harness.api.getAppState().gameTime, 2500, `savedAtReal ${JSON.stringify(savedAtReal)} should not add offline time`);
    assert.equal(harness.api.getAppState().recoveryNeeded, false);
  }
});

test("does not subtract game time when savedAtReal is in the future", () => {
  const now = 10000;
  const harness = createGameHarness({}, now);

  harness.storage.set("save_story", JSON.stringify({
    gameState: harness.api.createNewGameState(),
    meta: { gameTime: 3000, savedAtReal: now + 5000 }
  }));
  harness.api.initializeGameState("story");

  assert.equal(harness.api.getAppState().gameTime, 3000);
  assert.equal(harness.api.getAppState().recoveryNeeded, false);
});

test("does not subtract game time when the device clock moved backwards", () => {
  const now = 8000;
  const harness = createGameHarness({}, now);

  harness.storage.set("save_story", JSON.stringify({
    gameState: harness.api.createNewGameState(),
    meta: { gameTime: 4000, savedAtReal: 10000 }
  }));
  harness.api.initializeGameState("story");

  assert.equal(harness.api.getAppState().gameTime, 4000);
  assert.equal(harness.api.getAppState().recoveryNeeded, false);
});

test("adds valid elapsed real time to saved game time", () => {
  const harness = createGameHarness({}, 12000);

  harness.storage.set("save_story", JSON.stringify({
    gameState: harness.api.createNewGameState(),
    meta: { gameTime: 4000, savedAtReal: 10000 }
  }));
  harness.api.initializeGameState("story");

  assert.equal(harness.api.getAppState().gameTime, 6000);
});

test("writes each supported mode to its own save key and updates save metadata", () => {
  const cases = [
    { mode: "story", key: "save_story" },
    { mode: "expedition", key: "save_expedition" },
    { mode: "adventure", key: "save_adventure" }
  ];

  for (const { mode, key } of cases) {
    const harness = createGameHarness();

    harness.api.initializeGameState(mode);
    harness.api.getGameState().char.level = 9;
    harness.api.getAppState().gameTime = 456789;
    harness.api.saveGame();

    assert.ok(harness.storage.has(key), `${key} should be written for ${mode}`);
    assert.equal(harness.storage.has("save_story") && key !== "save_story", false);
    assert.equal(harness.storage.has("save_expedition") && key !== "save_expedition", false);
    assert.equal(harness.storage.has("save_adventure") && key !== "save_adventure", false);
    assert.equal(harness.storage.get("last_mode"), mode);

    const payload = JSON.parse(harness.storage.get(key));
    assert.equal(payload.gameState.world.mode, mode);
    assert.equal(payload.gameState.char.level, 9);
    assert.equal(payload.meta.gameTime, 456789);

    const appState = harness.api.getAppState();
    assert.equal(appState.saveStoryExists, key === "save_story");
    assert.equal(appState.saveExpeditionExists, key === "save_expedition");
    assert.equal(appState.saveAdventureExists, key === "save_adventure");
    assert.equal(appState.saveExists, true);
  }
});

test("does not write a persistent save in Sandbox mode", () => {
  const harness = createGameHarness();

  harness.api.initializeGameState("story");
  harness.api.getGameState().world.mode = "sandbox";
  harness.api.saveGame();

  assert.equal(harness.storage.has("save_story"), false);
  assert.equal(harness.storage.has("last_mode"), false);
});

test("falls back to a fresh game when the stored save contains malformed JSON", () => {
  const corruptedSave = "{not valid JSON";
  const harness = createGameHarness({ save_story: corruptedSave });

  assert.doesNotThrow(() => harness.api.initializeGameState("story"));

  assert.equal(harness.api.getGameState().world.mode, "story");
  assert.equal(harness.api.getGameState().char.level, 1);
  assert.equal(harness.api.getAppState().gameTime, 0);
  assert.equal(harness.api.getAppState().recoveryNeeded, true);
  assert.equal(harness.storage.get("save_story"), corruptedSave);
});

test("rejects parsed data that is not a valid game save payload", () => {
  const invalidPayloads = ["null", "[]", "{}", '{"gameState":{}}'];

  for (const serialized of invalidPayloads) {
    const harness = createGameHarness({ save_story: serialized });

    assert.equal(harness.api.parseSavePayload(serialized), null);
    assert.doesNotThrow(() => harness.api.initializeGameState("story"));
    assert.equal(harness.api.getGameState().world.mode, "story");
    assert.equal(harness.api.getAppState().recoveryNeeded, true);
    assert.equal(harness.storage.get("save_story"), serialized);
  }
});

test("accepts a structurally valid save payload", () => {
  const harness = createGameHarness();
  harness.api.initializeGameState("story");
  harness.api.saveGame();

  const serialized = harness.storage.get("save_story");
  assert.ok(harness.api.parseSavePayload(serialized));
});


test("story-save menu check safely rejects malformed JSON", () => {
  const context = createMenuHarness("{broken");

  assert.doesNotThrow(() => context.__checkIsStorySave());
  assert.equal(context.__checkIsStorySave(), false);
  assert.equal(context.appState.recoveryNeeded, true);
});

test("story-save menu check accepts a valid save payload", () => {
  const serialized = JSON.stringify({
    gameState: { world: { startNewCampaign: true } },
    meta: { gameTime: 0, savedAtReal: Date.now() }
  });
  const context = createMenuHarness(serialized);

  assert.equal(context.__checkIsStorySave(), true);
  assert.equal(context.appState.recoveryNeeded, false);
});


test("continuing a corrupted save preserves the original data and does not boot", () => {
  const corruptedSave = "{broken save data";
  const harness = createGameHarness({ save_story: corruptedSave });

  const start = menuSource.indexOf("function continueGame(mode = `story`)");
  const end = menuSource.indexOf("\n\n/*function continueGame()", start);
  assert.notEqual(start, -1, "continueGame should exist");
  assert.notEqual(end, -1, "continueGame function should have a clear boundary");

  harness.context.setStoryUI = () => {
    throw new Error("UI should not change when save recovery is required");
  };
  harness.context.bootGame = () => {
    throw new Error("Game should not boot when save recovery is required");
  };

  vm.runInContext(
    menuSource.slice(start, end) +
      "\nglobalThis.__continueGame = continueGame;",
    harness.context,
    { filename: "menu.js" }
  );

  assert.equal(harness.context.__continueGame("story"), false);
  assert.equal(harness.api.getAppState().recoveryNeeded, true);
  assert.equal(harness.storage.get("save_story"), corruptedSave);
  assert.equal(harness.storage.has("last_mode"), false);
});


const skillsCombatSource = fs.readFileSync(
  path.join(__dirname, "../live/js/skills-combat.js"),
  "utf8"
);

function createBuffHarness({ now = 1800000000000, gameTime = 5000, activeBuffs = {} } = {}) {
  let currentTime = now;
  let nextTimerId = 1;
  const timers = new Map();
  const applied = [];
  const removed = [];
  const gameState = { combat: { activeBuffs } };
  const appState = { gameTime };

  class FakeDate extends Date {
    static now() {
      return currentTime;
    }
  }

  function setTimeoutFake(callback, delay = 0) {
    const id = nextTimerId++;
    timers.set(id, { callback, dueAt: currentTime + Math.max(0, Number(delay) || 0) });
    return id;
  }

  function clearTimeoutFake(id) {
    timers.delete(id);
  }

  const start = skillsCombatSource.indexOf("function addTemporaryBuff(");
  const end = skillsCombatSource.indexOf("\nconst whirlwindState", start);
  assert.notEqual(start, -1, "addTemporaryBuff should exist");
  assert.notEqual(end, -1, "whirlwindState should follow buff helpers");

  const context = vm.createContext({
    Date: FakeDate,
    setTimeout: setTimeoutFake,
    clearTimeout: clearTimeoutFake,
    gameState,
    appState,
    getGameTime: () => appState.gameTime,
    saveGame() {},
    updatePlayerDmg(value) { applied.push(["dmg", value]); },
    updatePlayerDef(value) { applied.push(["def", value]); },
    renderStats() {},
    currentBuff: { dmg: 0, def: 0 },
    console
  });

  vm.runInContext(
    skillsCombatSource.slice(start, end) +
      "\nglobalThis.__buffTestApi = { addTemporaryBuff, restoreBuffsAfterReload, removeBuff };",
    context,
    { filename: "skills-combat.js" }
  );

  function advanceRealTime(ms) {
    currentTime += ms;
    let due;
    do {
      due = [...timers.entries()]
        .filter(([, timer]) => timer.dueAt <= currentTime)
        .sort((a, b) => a[1].dueAt - b[1].dueAt)[0];
      if (due) {
        timers.delete(due[0]);
        due[1].callback();
      }
    } while (due);
  }

  return {
    api: context.__buffTestApi,
    gameState,
    appState,
    applied,
    removed,
    timers,
    advanceRealTime,
    getNow: () => currentTime
  };
}

test("temporary buff expiry uses the same real-time clock as its timeout", () => {
  const harness = createBuffHarness({ now: 1800000000000, gameTime: 5000 });

  harness.api.addTemporaryBuff({
    stat: "dmg",
    value: 1.25,
    durationSec: 10,
    source: "test"
  });

  assert.equal(
    harness.gameState.combat.activeBuffs.dmg.expiresAt,
    1800000010000,
    "expiresAt should use Date.now(), matching the timeout clock"
  );
});

test("restores a buff when its real-time expiry is still in the future", () => {
  const harness = createBuffHarness({
    now: 1800000000000,
    gameTime: 5000,
    activeBuffs: {
      dmg: { value: 1.25, expiresAt: 1800000006000, source: "test" }
    }
  });

  harness.api.restoreBuffsAfterReload();

  assert.ok(harness.gameState.combat.activeBuffs.dmg);
  assert.equal(harness.timers.size, 1);
  assert.deepEqual(harness.applied, [["dmg", 1.25]]);
});

test("does not restore a buff that expired while the game was offline", () => {
  const harness = createBuffHarness({
    now: 1800000200000,
    gameTime: 105000,
    activeBuffs: {
      dmg: { value: 1.25, expiresAt: 1800000150000, source: "test" }
    }
  });

  harness.api.restoreBuffsAfterReload();

  assert.equal(harness.gameState.combat.activeBuffs.dmg, undefined);
  assert.equal(harness.timers.size, 0);
  assert.equal(harness.applied.length, 0);
});

test("discards legacy game-time buff expiries without replacing the save", () => {
  const harness = createBuffHarness({
    now: 1800000000000,
    gameTime: 5000,
    activeBuffs: {
      dmg: { value: 1.25, expiresAt: 15000, source: "legacy" }
    }
  });

  harness.api.restoreBuffsAfterReload();

  assert.equal(harness.gameState.combat.activeBuffs.dmg, undefined);
  assert.equal(harness.timers.size, 0);
  assert.equal(harness.applied.length, 0);
});

test("buff duration continues during pause even when gameTime is frozen", () => {
  const harness = createBuffHarness({ now: 100000, gameTime: 5000 });

  harness.api.addTemporaryBuff({
    stat: "def",
    value: 1.5,
    durationSec: 5,
    source: "test"
  });

  harness.advanceRealTime(5000);

  assert.equal(harness.appState.gameTime, 5000);
  assert.equal(harness.gameState.combat.activeBuffs.def, undefined);
});

test("replacing a buff clears the previous timeout and uses the new duration", () => {
  const harness = createBuffHarness({ now: 100000, gameTime: 5000 });

  harness.api.addTemporaryBuff({
    stat: "dmg",
    value: 1.1,
    durationSec: 5,
    source: "first"
  });
  harness.advanceRealTime(2000);
  harness.api.addTemporaryBuff({
    stat: "dmg",
    value: 1.4,
    durationSec: 10,
    source: "second"
  });

  assert.equal(harness.timers.size, 1);
  assert.equal(harness.gameState.combat.activeBuffs.dmg.value, 1.4);

  harness.advanceRealTime(3000);
  assert.ok(harness.gameState.combat.activeBuffs.dmg);

  harness.advanceRealTime(7000);
  assert.equal(harness.gameState.combat.activeBuffs.dmg, undefined);
});


function createNonStoryMenuHarness(mode, serialized) {
  const start = menuSource.indexOf("function startNewGame(mode)");
  const end = menuSource.indexOf("\nfunction newCampaign", start);
  const checkStart = menuSource.indexOf("function checkIsSave(");
  const checkEnd = menuSource.indexOf("\nfunction startExpeditionMode", checkStart);
  assert.notEqual(start, -1, "startNewGame should exist");
  assert.notEqual(end, -1, "newCampaign should follow startNewGame");
  assert.notEqual(checkStart, -1, "checkIsSave should exist");
  assert.notEqual(checkEnd, -1, "startExpeditionMode should follow checkIsSave");

  const calls = { storyUI: 0, expeditionUI: 0, boot: 0, save: 0 };
  const localStorage = {
    getItem(key) {
      return key === `save_${mode}` ? serialized : null;
    },
    removeItem() {
      throw new Error("A corrupted save must not be removed");
    }
  };
  const context = vm.createContext({
    localStorage,
    gameState: { world: { mode: "story" } },
    appState: { recoveryNeeded: false },
    parseSavePayload(value) {
      try {
        const parsed = JSON.parse(value);
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed) ||
            !parsed.gameState || typeof parsed.gameState !== "object" ||
            !parsed.gameState.world || typeof parsed.gameState.world !== "object") return null;
        return parsed;
      } catch {
        return null;
      }
    },
    initializeGameState(requestedMode) {
      context.appState.recoveryNeeded = true;
      context.gameState.world.mode = requestedMode;
    },
    createNewGameState() {
      throw new Error("A new game must not be created during save recovery");
    },
    setStoryUI() { calls.storyUI++; },
    setExpeditionUI() { calls.expeditionUI++; },
    bootGame() { calls.boot++; },
    saveGame() { calls.save++; },
    startExpeditionMode() {
      context.__checkIsSave("expedition");
    },
    openSelectClass() {
      throw new Error("Class selection must not open while recovering an existing save");
    },
    console
  });

  vm.runInContext(
    menuSource.slice(start, end) +
      "\n" + menuSource.slice(checkStart, checkEnd) +
      "\nglobalThis.__checkIsSave = checkIsSave; globalThis.__startNewGame = startNewGame;",
    context,
    { filename: "menu.js" }
  );

  return { context, calls };
}

test("does not boot or replace corrupted Expedition and Adventure saves", () => {
  for (const mode of ["expedition", "adventure"]) {
    const corruptedSave = "{broken " + mode + " save";
    const harness = createNonStoryMenuHarness(mode, corruptedSave);

    assert.equal(harness.context.__checkIsSave(mode), true);
    assert.equal(harness.context.appState.recoveryNeeded, true);
    assert.equal(harness.calls.storyUI, 0);
    assert.equal(harness.calls.expeditionUI, 0);
    assert.equal(harness.calls.boot, 0);
    assert.equal(harness.calls.save, 0);
  }
});

test("starting Expedition does not overwrite a corrupted save after recovery is required", () => {
  const corruptedSave = "{broken expedition save";
  const harness = createNonStoryMenuHarness("expedition", corruptedSave);

  assert.doesNotThrow(() => harness.context.__startNewGame("expedition"));
  assert.equal(harness.context.appState.recoveryNeeded, true);
  assert.equal(harness.calls.boot, 0);
  assert.equal(harness.calls.save, 0);
});


test("save backup exports all raw slots, including malformed data, without changing storage", () => {
  const original = {
    save_story: "{malformed story save",
    save_expedition: JSON.stringify({ gameState: { world: { mode: "expedition" } } }),
    save_adventure: null
  };
  const values = new Map(Object.entries(original));
  const localStorage = {
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    setItem() { throw new Error("Export must not write to localStorage"); },
    removeItem() { throw new Error("Export must not remove localStorage values"); }
  };
  const start = menuSource.indexOf("function buildSaveBackup()");
  const end = menuSource.indexOf("\nfunction downloadSaveBackup", start);
  assert.notEqual(start, -1, "buildSaveBackup should exist");
  assert.notEqual(end, -1, "downloadSaveBackup should follow buildSaveBackup");

  const context = vm.createContext({ localStorage, Date });
  vm.runInContext(
    menuSource.slice(start, end) + "\nglobalThis.__buildSaveBackup = buildSaveBackup;",
    context,
    { filename: "menu.js" }
  );

  const backup = context.__buildSaveBackup();

  assert.equal(backup.format, "origin-save-backup");
  assert.equal(backup.version, 1);
  assert.equal(backup.saves.save_story, original.save_story);
  assert.equal(backup.saves.save_expedition, original.save_expedition);
  assert.equal(backup.saves.save_adventure, null);
  assert.deepEqual([...values.entries()], Object.entries(original));
});


function createBackupHarness(initialStorage = {}, options = {}) {
  const values = new Map(Object.entries(initialStorage));
  const writes = [];
  let writeCount = 0;
  const localStorage = {
    getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      writeCount++;
      writes.push([key, String(value)]);
      if (options.failOnWrite === writeCount) throw new Error("Simulated storage write failure");
      values.set(key, String(value));
    },
    removeItem(key) {
      values.delete(key);
    }
  };

  const start = menuSource.indexOf("function parseSaveBackup(");
  const restoreStart = menuSource.indexOf("function restoreSaveBackup(", start);
  const end = menuSource.indexOf("\n\nfunction openAbout(", restoreStart);
  assert.notEqual(start, -1, "parseSaveBackup should exist");
  assert.notEqual(restoreStart, -1, "restoreSaveBackup should exist");
  assert.notEqual(end, -1, "backup helpers should end before openAbout");

  const context = vm.createContext({
    localStorage,
    parseSavePayload(serialized) {
      try {
        const parsed = JSON.parse(serialized);
        return parsed && typeof parsed === "object" && !Array.isArray(parsed) &&
          parsed.gameState && typeof parsed.gameState === "object" &&
          parsed.gameState.world && typeof parsed.gameState.world === "object"
          ? parsed
          : null;
      } catch {
        return null;
      }
    },
    updateSaveState() {},
    console
  });

  vm.runInContext(
    menuSource.slice(start, end) +
      "\nglobalThis.__backupApi = { parseSaveBackup, restoreSaveBackup };",
    context,
    { filename: "menu.js" }
  );

  return {
    api: context.__backupApi,
    storage: values,
    writes
  };
}

function makeValidBackup(saves = {}) {
  const validSave = JSON.stringify({
    gameState: { world: { mode: "story" }, char: { level: 4 } },
    meta: { gameTime: 1234, savedAtReal: 1000 }
  });

  return {
    format: "origin-save-backup",
    version: 1,
    exportedAt: "2026-11-05T07:09:01.023Z",
    saves: {
      save_story: null,
      save_expedition: null,
      save_adventure: null,
      ...saves
    },
    validSave
  };
}

test("validates a version 1 backup and all populated raw save slots", () => {
  const backup = makeValidBackup({ save_story: makeValidBackup().validSave });
  const harness = createBackupHarness();

  const parsed = harness.api.parseSaveBackup(JSON.stringify(backup));

  assert.ok(parsed);
  assert.equal(parsed.format, "origin-save-backup");
  assert.equal(parsed.saves.save_story, backup.saves.save_story);
});

test("rejects malformed backup envelopes and invalid populated save slots", () => {
  const harness = createBackupHarness();
  const valid = makeValidBackup({ save_story: makeValidBackup().validSave });
  const invalidBackups = [
    "{broken",
    "null",
    JSON.stringify({ format: "other", version: 1, saves: valid.saves }),
    JSON.stringify({ format: "origin-save-backup", version: 2, saves: valid.saves }),
    JSON.stringify({ format: "origin-save-backup", version: 1, saves: { save_story: null } }),
    JSON.stringify({ ...valid, saves: { ...valid.saves, save_story: "{broken save" } }),
    JSON.stringify({ ...valid, saves: { ...valid.saves, save_adventure: 42 } })
  ];

  for (const serialized of invalidBackups) {
    assert.equal(harness.api.parseSaveBackup(serialized), null);
  }
});

test("imports populated slots byte-for-byte and leaves null slots unchanged", () => {
  const story = JSON.stringify({ gameState: { world: { mode: "story" }, marker: "backup" } });
  const expedition = JSON.stringify({ gameState: { world: { mode: "expedition" }, marker: "expedition" } });
  const existingAdventure = "existing adventure save";
  const backup = makeValidBackup({
    save_story: story,
    save_expedition: expedition,
    save_adventure: null
  });
  const harness = createBackupHarness({ save_story: "old story", save_adventure: existingAdventure });

  const result = harness.api.restoreSaveBackup(backup);

  assert.equal(result.success, true);
  assert.deepEqual(Array.from(result.importedKeys), ["save_story", "save_expedition"]);
  assert.equal(harness.storage.get("save_story"), story);
  assert.equal(harness.storage.get("save_expedition"), expedition);
  assert.equal(harness.storage.get("save_adventure"), existingAdventure);
});

test("rolls back previously written slots if a storage write fails", () => {
  const oldStory = "old story";
  const oldExpedition = "old expedition";
  const story = JSON.stringify({ gameState: { world: { mode: "story" } } });
  const expedition = JSON.stringify({ gameState: { world: { mode: "expedition" } } });
  const backup = makeValidBackup({ save_story: story, save_expedition: expedition });
  const harness = createBackupHarness(
    { save_story: oldStory, save_expedition: oldExpedition },
    { failOnWrite: 2 }
  );

  const result = harness.api.restoreSaveBackup(backup);

  assert.equal(result.success, false);
  assert.equal(harness.storage.get("save_story"), oldStory);
  assert.equal(harness.storage.get("save_expedition"), oldExpedition);
});
