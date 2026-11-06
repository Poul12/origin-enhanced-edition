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

test("shop button state is updated by a small event-driven helper, not a permanent RAF loop", () => {
  assert.match(animationsSource, /function updateShopMenuButtonState\(\)/);
  assert.match(animationsSource, /shopMenuBtn\.classList\.add\('disabled'\)/);
  assert.match(animationsSource, /shopMenuBtn\.classList\.remove\('disabled'\)/);
  assert.doesNotMatch(animationsSource, /function startUiTick\s*\(/);
  assert.doesNotMatch(animationsSource, /requestAnimationFrame\(tick\)/);
});

test("shop button state is refreshed when a location is initialized or its step changes", () => {
  const firstStep = locationSource.match(/function loadFirstStep\(\) \{[\s\S]*?\n\}/)?.[0] || "";
  const nextStep = locationSource.match(/function rollOptions\(\) \{[\s\S]*?\n\}/)?.[0] || "";
  const loadStep = locationSource.match(/function loadStep\(index\) \{[\s\S]*?\n\}/)?.[0] || "";

  assert.match(firstStep, /updateShopMenuButtonState\(\)/);
  assert.match(nextStep, /updateShopMenuButtonState\(\)/);
  assert.match(loadStep, /updateShopMenuButtonState\(\)/);
});
