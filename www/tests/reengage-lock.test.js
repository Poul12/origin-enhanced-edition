const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { test } = require("node:test");

const battleSource = fs.readFileSync(
  path.join(__dirname, "../live/js/battle.js"),
  "utf8"
);
const combatSource = fs.readFileSync(
  path.join(__dirname, "../live/js/combat.js"),
  "utf8"
);

function functionSource(source, name) {
  const start = source.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `missing function ${name}`);
  const next = source.indexOf("\nfunction ", start + 1);
  return source.slice(start, next === -1 ? source.length : next);
}

test("reengage lock helper blocks only while the deadline is in the future", () => {
  const helper = functionSource(battleSource, "isEnemyReengageLocked");
  const context = {};
  vm.runInNewContext(helper + "\nthis.checkLock = isEnemyReengageLocked;", context);

  assert.equal(context.checkLock({ reengageLockedUntil: 5001 }, 5000), true);
  assert.equal(context.checkLock({ reengageLockedUntil: 5000 }, 5000), false);
  assert.equal(context.checkLock({ reengageLockedUntil: 4999 }, 5000), false);
  assert.equal(context.checkLock({}, 5000), false);
  assert.equal(context.checkLock(null, 5000), false);
});

test("locked enemy slot is visually disabled and unlocks when countdown ends", () => {
  const renderActionButtons = functionSource(battleSource, "renderActionButtons");
  assert.match(renderActionButtons, /div\.classList\.add\("used", "disabled"\)/);
  assert.match(renderActionButtons, /div\.classList\.remove\("used", "disabled"\)/);
  assert.match(renderActionButtons, /reengageCountdownIntervals\.set\(enemy, interval\)/);
});

test("slot click exits before changing selection while enemy is locked", () => {
  const slotClicked = functionSource(battleSource, "slotClicked");
  const guard = slotClicked.indexOf("if (!opt || isEnemyReengageLocked(opt.enemyData)) return;");
  const firstMutation = slotClicked.indexOf("classList.remove");
  assert.notEqual(guard, -1);
  assert.ok(firstMutation === -1 || guard < firstMutation);
  assert.ok(guard < slotClicked.indexOf("world.selectedSlotIndex = i"));
});

test("startCombat independently rejects a locked enemy before changing combat state", () => {
  const startCombat = functionSource(combatSource, "startCombat");
  const guard = startCombat.indexOf("if (!selectedOpt || isEnemyReengageLocked(selectedOpt.enemyData)) return;");
  const combatMutation = startCombat.indexOf("world.inCombat = true;");
  assert.notEqual(guard, -1);
  assert.ok(guard < combatMutation);
});

test("energy test toggle changes energy usage only, not enemy bypass", () => {
  const toggle = functionSource(battleSource, "toggleEnergyTestMode");
  assert.match(toggle, /energyState\.noEnergyUse = !energyState\.noEnergyUse/);
  assert.doesNotMatch(toggle, /bypassEnemyCheck/);
  assert.doesNotMatch(toggle, /world\.bypassEnemyCheck/);
  assert.match(combatSource, /onclick="toggleEnergyTestMode\(\)"/);
  assert.doesNotMatch(combatSource, /onclick="toggleBypass\(\)"/);
});
