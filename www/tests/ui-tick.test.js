const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");

const animationsSource = fs.readFileSync(
  path.join(__dirname, "../live/js/combat-animations.js"),
  "utf8"
);
const locationSource = fs.readFileSync(
  path.join(__dirname, "../live/js/location.js"),
  "utf8"
);

function functionSource(source, name) {
  const start = source.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `missing function ${name}`);
  const next = source.indexOf("\nfunction ", start + 1);
  return source.slice(start, next === -1 ? source.length : next);
}

test("shop button state is updated by a small event-driven helper, not a permanent RAF loop", () => {
  assert.match(animationsSource, /function updateShopMenuButtonState\(\)/);
  assert.match(animationsSource, /shopMenuBtn\.classList\.add\('disabled'\)/);
  assert.match(animationsSource, /shopMenuBtn\.classList\.remove\('disabled'\)/);
  assert.doesNotMatch(animationsSource, /function startUiTick\s*\(/);
  assert.doesNotMatch(animationsSource, /requestAnimationFrame\(tick\)/);
});

test("shop button state is refreshed when a location is initialized or its step changes", () => {
  for (const name of ["loadFirstStep", "rollOptions", "loadStep"]) {
    assert.match(functionSource(locationSource, name), /updateShopMenuButtonState\(\)/, name);
  }
});
