const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");

const battleView = fs.readFileSync(
  path.join(__dirname, "../live/js/views/battleView.js"),
  "utf8"
);
const mapView = fs.readFileSync(
  path.join(__dirname, "../live/js/views/mapView.js"),
  "utf8"
);
const battle = fs.readFileSync(
  path.join(__dirname, "../live/js/battle.js"),
  "utf8"
);

function functionSource(source, name) {
  const start = source.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `missing function ${name}`);
  const next = source.indexOf(String.fromCharCode(10) + "function ", start + 1);
  return source.slice(start, next === -1 ? source.length : next);
}

test("battle view teardown removes its delegated click listener", () => {
  const add = functionSource(battleView, "addBattleListeners");
  const destroy = functionSource(battleView, "destroyBattleView");

  assert.ok(add.includes('document.addEventListener("click", handleBattleClick)'));
  assert.ok(destroy.includes('document.removeEventListener("click", handleBattleClick)'));
});

test("map view teardown removes HUD layout listeners", () => {
  const init = functionSource(mapView, "initMapView");
  const destroyStart = mapView.indexOf("function destroyMapView(");
  const destroyEnd = mapView.indexOf(String.fromCharCode(10) + "function ", destroyStart + 1);
  const destroy = mapView.slice(destroyStart, destroyEnd === -1 ? mapView.length : destroyEnd);

  assert.ok(init.includes('window.addEventListener("load", updateHUDLayout)'));
  assert.ok(init.includes('window.addEventListener("resize", updateHUDLayout)'));
  assert.ok(destroy.includes('window.removeEventListener("load", updateHUDLayout)'));
  assert.ok(destroy.includes('window.removeEventListener("resize", updateHUDLayout)'));
});

test("map view teardown cancels delayed HUD layout updates", () => {
  const init = functionSource(mapView, "initMapView");
  const destroyStart = mapView.indexOf("function destroyMapView(");
  const destroyEnd = mapView.indexOf(String.fromCharCode(10) + "function ", destroyStart + 1);
  const destroy = mapView.slice(destroyStart, destroyEnd === -1 ? mapView.length : destroyEnd);

  assert.ok(init.includes("mapHudLayoutTimeouts = ["));
  assert.ok(destroy.includes("mapHudLayoutTimeouts.forEach(clearTimeout)"));
  assert.ok(destroy.includes("mapHudLayoutTimeouts = []"));
});

test("battle view teardown cancels every tracked reengage countdown", () => {
  assert.ok(battle.includes("const reengageCountdownIntervals = new WeakMap()"));
  assert.ok(battle.includes("const activeReengageCountdownIntervals = new Set()"));

  const cleanup = functionSource(battle, "clearReengageCountdownIntervals");
  assert.ok(cleanup.includes("for (const interval of activeReengageCountdownIntervals)"));
  assert.ok(cleanup.includes("clearInterval(interval)"));
  assert.ok(cleanup.includes("activeReengageCountdownIntervals.clear()"));

  const destroy = functionSource(battleView, "destroyBattleView");
  assert.ok(destroy.includes("clearReengageCountdownIntervals()"));
});
