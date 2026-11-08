const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { test } = require("node:test");

const gameStateSource = fs.readFileSync(
  path.join(__dirname, "../js/gameState.js"),
  "utf8"
);
const appSource = fs.readFileSync(
  path.join(__dirname, "../js/app.js"),
  "utf8"
);
const inventorySource = fs.readFileSync(
  path.join(__dirname, "../live/js/inventory.js"),
  "utf8"
);
const characterSource = fs.readFileSync(
  path.join(__dirname, "../live/js/character.js"),
  "utf8"
);

function functionSource(source, name) {
  const start = source.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `missing function ${name}`);
  const next = source.indexOf("\nfunction ", start + 1);
  return source.slice(start, next === -1 ? source.length : next);
}

function createCodexContext(initialCodex = {}) {
  const context = {
    gameState: { char: { combatAffixCodex: initialCodex } },
    baseBonuses: [
      { id: "new_combat_affix", category: "combat", archetype: "warden" },
      { id: "existing_combat_affix", category: "combat", archetype: "duelist" },
      { id: "non_combat_stat", category: "utility", archetype: null }
    ]
  };

  vm.runInNewContext(
    functionSource(gameStateSource, "ensureCombatAffixCodexEntry") +
      "\n" +
      functionSource(gameStateSource, "setAffixesForCodex"),
    context
  );

  return context;
}

test("codex initialization adds all combat affixes and ignores non-combat bonuses", () => {
  const context = createCodexContext();

  context.setAffixesForCodex();

  assert.deepEqual(
    JSON.parse(JSON.stringify(context.gameState.char.combatAffixCodex.new_combat_affix)),
    {
      id: "new_combat_affix",
      archetype: "warden",
      discovered: false,
      seen: false
    }
  );
  assert.equal(
    context.gameState.char.combatAffixCodex.non_combat_stat,
    undefined
  );
});

test("codex synchronization preserves discovery and seen progress in existing saves", () => {
  const context = createCodexContext({
    existing_combat_affix: {
      id: "existing_combat_affix",
      archetype: "duelist",
      discovered: true,
      seen: true
    }
  });

  context.setAffixesForCodex();

  assert.deepEqual(
    JSON.parse(JSON.stringify(context.gameState.char.combatAffixCodex.existing_combat_affix)),
    {
      id: "existing_combat_affix",
      archetype: "duelist",
      discovered: true,
      seen: true
    }
  );
  assert.ok(context.gameState.char.combatAffixCodex.new_combat_affix);
});

test("codex synchronization repairs missing metadata without resetting boolean progress", () => {
  const context = createCodexContext({
    existing_combat_affix: {
      discovered: true,
      seen: false
    }
  });

  context.setAffixesForCodex();

  const entry = context.gameState.char.combatAffixCodex.existing_combat_affix;
  assert.equal(entry.id, "existing_combat_affix");
  assert.equal(entry.archetype, "duelist");
  assert.equal(entry.discovered, true);
  assert.equal(entry.seen, false);
});

test("equipping an item with a combat affix creates a missing codex entry safely", () => {
  const context = createCodexContext();
  context.showInfoAlert = () => {};
  context.t = key => key;
  context.saveGame = () => {};

  vm.runInNewContext(functionSource(inventorySource, "discoverItem"), context);

  const item = {
    statystyki: [
      { id: "new_combat_affix", category: "combat", archetype: "warden" }
    ]
  };

  assert.doesNotThrow(() => context.discoverItem(item));
  assert.equal(
    context.gameState.char.combatAffixCodex.new_combat_affix.discovered,
    true
  );
  assert.equal(item.discovered, true);
});

test("codex section marks discovered affixes as seen through the safe-entry helper", () => {
  const section = functionSource(characterSource, "createArchetypeSection");

  assert.ok(section.includes("ensureCombatAffixCodexEntry(affix.name)"));
  assert.ok(section.includes("if (entry) entry.seen = true"));
  assert.ok(!section.includes("codex[affix.name].seen = true"));
});

test("codex is synchronized after runtime loading on both normal startup and reload recovery", () => {
  const normalStartup = appSource.indexOf("await bootstrap();");
  const normalSync = appSource.indexOf("setAffixesForCodex();", normalStartup);
  assert.ok(normalStartup !== -1 && normalSync > normalStartup);

  const resumeStart = appSource.indexOf("async function resumeAfterReload()");
  const resumeBootstrap = appSource.indexOf("await bootstrap();", resumeStart);
  const resumeSync = appSource.indexOf("setAffixesForCodex();", resumeBootstrap);
  assert.ok(resumeBootstrap > resumeStart && resumeSync > resumeBootstrap);
});
