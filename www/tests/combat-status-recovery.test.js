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
const sharedSource = fs.readFileSync(path.join(__dirname, "../js/shared.js"), "utf8");

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
  const readyMatch = enemySkillsSource.match(/function isEnemySkillReady\(enemy, skillId\) \{[\s\S]*?\n\}/);
  assert.ok(readyMatch, "missing isEnemySkillReady function");
  const ready = readyMatch[0];
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

test("combat recovery does not scroll the rebuilt battle view to the attack dialog", () => {
  const restoreStart = combatSource.indexOf("function restoreCombat()");
  assert.notEqual(restoreStart, -1);
  const restore = combatSource.slice(restoreStart);
  assert.match(restore, /focusOnAttackDialogBox\(\{\s*scroll:\s*false\s*\}\)/);
});


test("pause menu pauses persistent combat timers and resumes only timers it paused", () => {
  const openPause = functionSource(menuViewSource, "openPauseMenu");
  const resume = functionSource(menuViewSource, "resumeGame");
  const context = {
    appState: {},
    gameState: { world: { mode: "story" }, combat: { flags: { isCritical: false } } },
    window: { scrollTo: () => {} },
    playSound: () => {}, stopGameEngine: () => {}, enterMenu: () => {},
    setMiniLogo: () => {}, renderPauseMenuView: () => {},
    updateHUDLayout: () => {}, startGameEngine: () => {}, enterGame: () => {},
    pauseCount: 0, resumeCount: 0,
    pauseCombatTimers() { this.pauseCount++; return true; },
    resumeCombatTimers() { this.resumeCount++; }
  };
  vm.runInNewContext(openPause + "\\n" + resume + "\\nthis.openPause = openPauseMenu; this.resume = resumeGame;", context);
  context.openPause();
  assert.equal(context.pauseCount, 1);
  assert.equal(context.appState.pauseMenuOwnsCombatTimers, true);
  context.resume();
  assert.equal(context.resumeCount, 1);
  assert.equal(context.appState.pauseMenuOwnsCombatTimers, false);

  context.gameState.combat.flags.isCritical = true;
  context.openPause();
  assert.equal(context.pauseCount, 1, "Critical State must not pause combat timers");
  context.resume();
  assert.equal(context.resumeCount, 1, "pause menu must not resume timers it did not pause");
});

test("combat confirmation pauses real-time combat timers and resumes only its own pause", () => {
  const confirm = functionSource(sharedSource, "showCustomConfirm");
  assert.match(confirm, /isCritical = gameState\.combat\?\.flags\?\.isCritical === true/);
  assert.match(confirm, /combatTimersPausedByConfirm = pauseCombatTimers\(\) === true/);
  assert.equal((confirm.match(/resumeCombatTimers\(\)/g) || []).length, 2);
  assert.match(confirm, /finally/);
});

test("combat timer manager preserves remaining time across visibility pause", () => {
  const utility = fs.readFileSync(path.join(__dirname, "../live/js/combat-utility.js"), "utf8");
  const start = utility.indexOf("const combatTimers = new Map();");
  const end = utility.indexOf("\nlet actionLockTimeout = null;", start);
  assert.notEqual(start, -1, "missing combat timer manager");
  assert.notEqual(end, -1, "missing end of combat timer manager");
  const manager = utility.slice(start, end);
  let now = 1000;
  let nextId = 0;
  const timers = new Map();
  const context = {
    Date: { now: () => now },
    setTimeout: (callback, delay) => {
      const id = ++nextId;
      timers.set(id, { callback, at: now + delay });
      return id;
    },
    clearTimeout: id => timers.delete(id),
    gameState: { combat: { actionLock: { locked: false, until: 0 } } }
  };
  context.advance = ms => {
    now += ms;
    let due;
    do {
      due = [...timers.entries()].filter(([, timer]) => timer.at <= now);
      if (due.length) {
        for (const [id, timer] of due) {
          timers.delete(id);
          timer.callback();
        }
      }
    } while (due.length);
  };
  vm.runInNewContext(manager, context);
  let fired = 0;
  context.scheduleCombatTimer("pause-test", () => fired++, 1000);
  context.advance(350);
  assert.equal(context.pauseCombatTimers(), true);
  assert.equal(context.pauseCombatTimers(), false, "nested pause must not claim ownership");
  context.advance(5000);
  assert.equal(fired, 0);
  context.resumeCombatTimers();
  assert.equal(context.pauseCombatTimers(), true, "pause ownership must be released after resume");
  context.resumeCombatTimers();
  context.advance(649);
  assert.equal(fired, 0);
  context.advance(1);
  assert.equal(fired, 1);
});

test("combat timer manager replaces same-key timers and clears only encounter scope", () => {
  const utility = fs.readFileSync(path.join(__dirname, "../live/js/combat-utility.js"), "utf8");
  const start = utility.indexOf("const combatTimers = new Map();");
  const end = utility.indexOf("\nlet actionLockTimeout = null;", start);
  const manager = utility.slice(start, end);
  let now = 0;
  let nextId = 0;
  const timers = new Map();
  const context = {
    Date: { now: () => now },
    setTimeout: (callback, delay) => {
      const id = ++nextId;
      timers.set(id, { callback, at: now + delay });
      return id;
    },
    clearTimeout: id => timers.delete(id),
    gameState: { combat: { actionLock: { locked: false, until: 0 } } }
  };
  context.advance = ms => {
    now += ms;
    const due = [...timers.entries()].filter(([, timer]) => timer.at <= now);
    for (const [id, timer] of due) {
      timers.delete(id);
      timer.callback();
    }
  };
  vm.runInNewContext(manager, context);
  let oldFired = 0;
  let newFired = 0;
  let persistentFired = 0;
  context.scheduleCombatTimer("replace", () => oldFired++, 100);
  context.scheduleCombatTimer("replace", () => newFired++, 200);
  context.advance(200);
  assert.equal(oldFired, 0);
  assert.equal(newFired, 1);

  context.scheduleCombatTimer("encounter", () => oldFired++, 200);
  context.scheduleCombatTimer("persistent", () => persistentFired++, 200, { scope: "persistent" });
  context.clearCombatTimers();
  context.advance(250);
  assert.equal(oldFired, 0);
  assert.equal(persistentFired, 1);
});
