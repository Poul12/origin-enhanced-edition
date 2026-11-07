const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");

const inventory = fs.readFileSync(
  path.join(__dirname, "../live/js/inventory.js"),
  "utf8"
);
const inventoryView = fs.readFileSync(
  path.join(__dirname, "../live/js/views/inventoryView.js"),
  "utf8"
);

function functionSource(source, name) {
  const start = source.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `missing function ${name}`);
  const next = source.indexOf(String.fromCharCode(10) + "function ", start + 1);
  return source.slice(start, next === -1 ? source.length : next);
}

test("inventory render clears the previous food countdown before rebuilding DOM", () => {
  const render = functionSource(inventory, "renderInventory");
  assert.ok(render.indexOf("clearFoodTimerInterval()") < render.indexOf('container.innerHTML = ""'));
});

test("inventory uses one shared interval to update every food timer", () => {
  const update = functionSource(inventory, "updateFoodTimers");
  assert.ok(inventory.includes("let foodTimerInterval = null"));
  assert.ok(update.includes('document.querySelectorAll(".food-timer")'));
  assert.ok(update.includes("timers.forEach"));
  assert.equal((inventory.match(/setInterval\(updateFoodTimers, 1000\)/g) || []).length, 1);
});

test("food countdown stops when its timer nodes or active food state disappear", () => {
  const update = functionSource(inventory, "updateFoodTimers");
  assert.ok(update.includes("!timers.length"));
  assert.ok(update.includes("!foodState.active"));
  assert.ok(update.includes("!foodState.expiresAt"));
  assert.ok(update.includes("timeLeft <= 0"));
  assert.ok(update.includes("clearFoodTimerInterval()"));
});

test("inventory view teardown clears the food countdown interval", () => {
  const destroy = functionSource(inventoryView, "destroyInventoryView");
  assert.ok(destroy.includes("clearFoodTimerInterval()"));
});
