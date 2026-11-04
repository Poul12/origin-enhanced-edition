const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { test } = require("node:test");

const gameStateSource = fs.readFileSync(
  path.join(__dirname, "../js/gameState.js"),
  "utf8"
);

function createGameHarness(initialStorage = {}) {
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

  const context = vm.createContext({
    localStorage,
    Date,
    console
  });

  vm.runInContext(
    gameStateSource +
      "\n;globalThis.__gameTestApi = { initializeGameState, createNewGameState, saveGame, getSaveKey, getGameState: () => gameState, getAppState: () => appState };",
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
  harness.context.appState.gameTime = 123456;
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
  assert.ok(restored.context.appState.gameTime >= 123456);
});

test("does not write a persistent save in Sandbox mode", () => {
  const harness = createGameHarness();

  harness.api.initializeGameState("story");
  harness.context.gameState.world.mode = "sandbox";
  harness.api.saveGame();

  assert.equal(harness.storage.has("save_story"), false);
  assert.equal(harness.storage.has("last_mode"), false);
});

test.todo("handles malformed save JSON without aborting game initialization");
