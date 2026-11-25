const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { test } = require("node:test");

const enemySource = fs.readFileSync(path.join(__dirname, "../live/js/enemy.js"), "utf8");
const skillSource = fs.readFileSync(path.join(__dirname, "../live/js/skills-combat.js"), "utf8");
const enemySkillsSource = fs.readFileSync(path.join(__dirname, "../live/js/enemy-skills.js"), "utf8");
const combatSource = fs.readFileSync(path.join(__dirname, "../live/js/combat.js"), "utf8");
const menuViewSource = fs.readFileSync(path.join(__dirname, "../js/views/menuView.js"), "utf8");

function functionSource(source, name) {
  const start = source.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `missing function ${name}`);
  const next = source.indexOf("\nfunction ", start + 1);
  return source.slice(start, next === -1 ? source.length : next);
}

test("enemy status deadlines are evaluated on gameTime without requiring the attack timeline", () => {
  const update = functionSource(enemySource, "updateEnemyStatusTimers");
  const context = {
    getGameTime: () => 5000,
    updateStatusEnemyUI: () => {},
    clearEnemyStun: (enemy) => { enemy.status.stun = 0; enemy.status.stunExpiresAt = 0; },
    clearEnemySlow: (enemy) => { enemy.status.slow = 0; enemy.status.slowExpiresAt = 0; }
  };
  vm.runInNewContext(update + "\nthis.update = updateEnemyStatusTimers;", context);

  const enemy = {
    vulnerable: true,
    vulnerableExpiresAt: 4000,
    poiseBroken: true,
    poiseBreakExpiresAt: 4000,
    maxPoise: 120,
    status: {
      stun: 0.001, stunExpiresAt: 6000,
      slow: 70, slowExpiresAt: 4000
    }
  };

  context.update(enemy, 0);
  assert.equal(enemy.vulnerable, false);
  assert.equal(enemy.poiseBroken, false);
  assert.equal(enemy.poise, 60);
  assert.equal(enemy.status.stun, 0.001);
  assert.equal(enemy.status.stunRemaining, 1000);
  assert.equal(enemy.status.slow, 0);
});

test("legacy performance.now status deadlines are discarded safely", () => {
  const update = functionSource(enemySource, "updateEnemyStatusTimers");
  const context = {
    getGameTime: () => 100,
    updateStatusEnemyUI: () => {},
    clearEnemyStun: (enemy) => { enemy.status.stun = 0; },
    clearEnemySlow: (enemy) => { enemy.status.slow = 0; }
  };
  vm.runInNewContext(update + "\nthis.update = updateEnemyStatusTimers;", context);

  const enemy = {
    vulnerable: true,
    poiseBroken: true,
    maxPoise: 80,
    status: { stun: 0.001, slow: 50 }
  };
  context.update(enemy, 0);

  assert.equal(enemy.vulnerable, false);
  assert.equal(enemy.poiseBroken, false);
  assert.equal(enemy.poise, 40);
  assert.equal(enemy.status.stun, 0);
  assert.equal(enemy.status.slow, 0);
});

test("enemy skill cooldown creation and readiness use the same gameTime clock", () => {
  const readyStart = enemySkillsSource.indexOf("function isEnemySkillReady(");
  const readyEnd = enemySkillsSource.indexOf("\n\n\n/*function applyPlayerBleed", readyStart);
  assert.notEqual(readyStart, -1, "missing isEnemySkillReady");
  assert.notEqual(readyEnd, -1, "missing end of isEnemySkillReady");
  const ready = enemySkillsSource.slice(readyStart, readyEnd).trim();
  const context = { getGameTime: () => 1000 };
  vm.runInNewContext(ready + "\nthis.ready = isEnemySkillReady;", context);

  assert.ok(enemySkillsSource.includes("runtimeSkill.expiresAt ="));
  assert.ok(enemySkillsSource.includes("getGameTime() + skill.cooldown * 1000"));
  assert.ok(enemySkillsSource.includes('runtimeSkill.cooldownClock = "gameTime"'));

  const enemy = { skillState: [{ id: "test", expiresAt: 4000 }] };
  assert.equal(context.ready(enemy, "test"), false);
  context.getGameTime = () => 4000;
  assert.equal(context.ready(enemy, "test"), true);
});
test("restoreCombat migrates old runtime-clock deadlines and cooldowns", () => {
  const restore = functionSource(combatSource, "restoreCombat");
  assert.match(restore, /slowExpiresAt/);
  assert.match(restore, /stunExpiresAt/);
  assert.match(restore, /vulnerableExpiresAt/);
  assert.match(restore, /poiseBreakExpiresAt/);
  assert.match(restore, /skill\.cooldownClock !== "gameTime"/);
});

test("enemy status expiry runs before the stopped or paused attack-timeline return", () => {
  const update = functionSource(enemySource, "updateEnemyAttack");
  assert.ok(update.indexOf("updateEnemyStatusTimers(enemy, slotIndex)") < update.indexOf("if (!timeline.isRunning || timeline.isPaused"));
});

test("stun and slow are assigned gameTime deadlines, not performance.now deadlines", () => {
  const applyStun = functionSource(skillSource, "applyEnemyStun");
  const applySlow = functionSource(skillSource, "applyEnemySlow");
  assert.ok(applyStun.includes("const now = getGameTime()"));
  assert.match(applyStun, /stunExpiresAt = .*now/);
  assert.ok(applySlow.includes("const now = getGameTime()"));
  assert.match(applySlow, /slowExpiresAt = .*now/);
  assert.ok(!applyStun.includes("performance.now()"));
  assert.ok(!applySlow.includes("performance.now()"));
});

test("defensive stance does not become active when stamina state blocks activation", () => {
  const startBlock = functionSource(combatSource, "startBlock");
  const activate = functionSource(combatSource, "activateDefensiveStance");
  assert.match(startBlock, /if \(staminaState\.disabled\) return false/);
  assert.match(startBlock, /return true/);
  assert.match(activate, /if \(!startBlock\(\)\) return false/);
  assert.ok(activate.indexOf("if (!startBlock()) return false") < activate.indexOf("playerBlock.active = true"));
  assert.ok(activate.indexOf("playerBlock.active = true") < activate.indexOf("skillsOff()"));
});

test("view loader preserves the combat menu lock even when no loader was displayed", () => {
  const loader = functionSource(menuViewSource, "withViewLoader");
  assert.match(loader, /setMenuDisabled\(gameState\?\.world\?\.inCombat === true\)/);
  assert.ok(loader.lastIndexOf("setMenuDisabled(gameState?.world?.inCombat === true)") > loader.indexOf("finally"));
});
