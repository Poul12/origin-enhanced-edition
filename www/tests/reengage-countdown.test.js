const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");

const battleSource = fs.readFileSync(
  path.join(__dirname, "../live/js/battle.js"),
  "utf8"
);

function functionSource(source, name) {
  const start = source.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `missing function ${name}`);
  const next = source.indexOf("\nfunction ", start + 1);
  return source.slice(start, next === -1 ? source.length : next);
}

test("reengage countdown replaces an existing interval for the same enemy", () => {
  assert.match(
    battleSource,
    /const reengageCountdownIntervals = new WeakMap\(\)/
  );

  const renderActionButtons = functionSource(battleSource, "renderActionButtons");
  assert.match(renderActionButtons, /reengageCountdownIntervals\.get\(enemy\)/);
  assert.match(renderActionButtons, /if \(previousInterval\) \{\s*clearInterval\(previousInterval\)/);
  assert.match(renderActionButtons, /reengageCountdownIntervals\.set\(enemy, interval\)/);
  assert.match(renderActionButtons, /reengageCountdownIntervals\.get\(enemy\) === interval/);
  assert.match(renderActionButtons, /reengageCountdownIntervals\.delete\(enemy\)/);
});
