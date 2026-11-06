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
  const next = source.indexOf("\\nfunction ", start + 1);
  return source.slice(start, next === -1 ? source.length : next);
}

test("battle view teardown removes its delegated click listener", () => {
  const add = functionSource(battleView, "addBattleListeners");
  const destroy = functionSource(battleView, "destroyBattleView");

  assert.match(add, /document\\.addEventListener\\("click", handleBattleClick\\)/);
  assert.match(destroy, /document\\.removeEventListener\\("click", handleBattleClick\\)/);
});

test("map view teardown removes HUD layout listeners", () => {
  const init = functionSource(mapView, "initMapView");
  const destroy = functionSource(mapView, "destroyMapView");

  assert.match(init, /window\\.addEventListener\\("load", updateHUDLayout\\)/);
  assert.match(init, /window\\.addEventListener\\("resize", updateHUDLayout\\)/);
  assert.match(destroy, /window\\.removeEventListener\\("load", updateHUDLayout\\)/);
  assert.match(destroy, /window\\.removeEventListener\\("resize", updateHUDLayout\\)/);
});

test("map view teardown cancels delayed HUD layout updates", () => {
  const init = functionSource(mapView, "initMapView");
  const destroy = functionSource(mapView, "destroyMapView");

  assert.match(init, /mapHudLayoutTimeouts\\s*=\\s*\\[/);
  assert.match(destroy, /mapHudLayoutTimeouts\\.forEach\\(clearTimeout\\)/);
  assert.match(destroy, /mapHudLayoutTimeouts\\s*=\\s*\\[\\]/);
});

test("battle view teardown cancels every tracked reengage countdown", () => {
  assert.match(battle, /const reengageCountdownIntervals = new Map\\(\\)/);

  const cleanup = functionSource(battle, "clearReengageCountdownIntervals");
  assert.match(cleanup, /for \\(const interval of reengageCountdownIntervals\\.values\\(\\)\\)/);
  assert.match(cleanup, /clearInterval\\(interval\\)/);
  assert.match(cleanup, /reengageCountdownIntervals\\.clear\\(\\)/);

  const destroy = functionSource(battleView, "destroyBattleView");
  assert.match(destroy, /clearReengageCountdownIntervals\\(\\)/);
});
