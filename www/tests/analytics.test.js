const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { test } = require("node:test");

const analyticsSource = fs.readFileSync(
  path.join(__dirname, "../js/analytics.js"),
  "utf8"
);
const indexSource = fs.readFileSync(
  path.join(__dirname, "../index.html"),
  "utf8"
);

function createAnalyticsHarness() {
  const listeners = new Map();
  const scripts = [];
  const inserted = [];
  const warnings = [];
  const localValues = new Map();
  const sessionValues = new Map();

  const localStorage = {
    getItem(key) { return localValues.get(key) ?? null; },
    setItem(key, value) { localValues.set(key, String(value)); }
  };
  const sessionStorage = {
    getItem(key) { return sessionValues.get(key) ?? null; },
    setItem(key, value) { sessionValues.set(key, String(value)); }
  };

  const window = {
    localStorage,
    sessionStorage,
    crypto: { randomUUID: () => "test-player-id" },
    addEventListener(type, callback, options = {}) {
      const entries = listeners.get(type) || [];
      entries.push({ callback, once: !!options.once });
      listeners.set(type, entries);
    },
    requestIdleCallback(callback) { callback(); },
    setTimeout(callback) { callback(); return 1; }
  };

  const document = {
    readyState: "loading",
    head: {
      appendChild(script) {
        scripts.push(script);
        return script;
      }
    },
    createElement(tagName) {
      return { tagName: tagName.toUpperCase(), async: false };
    }
  };

  function dispatch(type) {
    const entries = listeners.get(type) || [];
    const remaining = [];
    for (const entry of entries) {
      entry.callback();
      if (!entry.once) remaining.push(entry);
    }
    listeners.set(type, remaining);
  }

  const context = vm.createContext({
    window,
    document,
    navigator: { language: "pl-PL", onLine: true },
    localStorage,
    sessionStorage,
    gameState: { char: { playerName: "TestHero" } },
    GAME_VERSION: "test-version",
    console: { warn: (...args) => warnings.push(args), log() {} }
  });

  vm.runInContext(
    analyticsSource + "\nglobalThis.__analytics = Analytics;",
    context,
    { filename: "analytics.js" }
  );

  return {
    analytics: context.__analytics,
    document,
    dispatch,
    inserted,
    localValues,
    scripts,
    sessionValues,
    warnings,
    window,
    setOnline(value) {
      context.navigator.onLine = value;
    },
    installSupabase() {
      window.supabase = {
        createClient(url, key) {
          assert.match(url, /^https:\/\//);
          assert.ok(key);
          return {
            from(table) {
              return {
                async insert(payload) {
                  inserted.push({ table, payload });
                  return { error: null };
                }
              };
            }
          };
        }
      };
    }
  };
}

function nextTurn() {
  return new Promise(resolve => setImmediate(resolve));
}

test("Supabase is not requested until after window load and queued events are delivered", async () => {
  const harness = createAnalyticsHarness();

  harness.analytics.gameStarted();
  harness.analytics.gameStarted();
  harness.analytics.newGameCreated();

  assert.equal(harness.scripts.length, 0, "analytics events must not start a CDN request during DOMContentLoaded");
  assert.equal(harness.sessionValues.get("analytics_game_started"), "1");

  harness.document.readyState = "complete";
  harness.dispatch("load");

  assert.equal(harness.scripts.length, 1);
  assert.equal(harness.scripts[0].async, true);
  assert.match(harness.scripts[0].src, /supabase-js/);

  harness.installSupabase();
  harness.scripts[0].onload();
  await nextTurn();

  assert.deepEqual(
    harness.inserted.map(entry => entry.payload.event),
    ["game_started", "new_game_created"]
  );
  assert.ok(harness.inserted.every(entry => entry.table === "game_events"));
  assert.equal(harness.inserted[0].payload.character_name, "TestHero");
  assert.equal(harness.inserted[0].payload.game_version, "test-version");
  assert.equal(harness.inserted[0].payload.language, "pl-PL");
});

test("offline startup does not request Supabase and retries queued events after reconnect", async () => {
  const harness = createAnalyticsHarness();
  harness.setOnline(false);
  harness.analytics.gameStarted();

  harness.document.readyState = "complete";
  harness.dispatch("load");
  assert.equal(harness.scripts.length, 0);

  harness.setOnline(true);
  harness.dispatch("online");
  assert.equal(harness.scripts.length, 1);

  harness.scripts[0].onerror();
  await nextTurn();
  assert.equal(harness.inserted.length, 0);

  harness.dispatch("online");
  assert.equal(harness.scripts.length, 2);

  harness.installSupabase();
  harness.scripts[1].onload();
  await nextTurn();

  assert.deepEqual(
    harness.inserted.map(entry => entry.payload.event),
    ["game_started"]
  );
});

test("index.html keeps the local analytics facade but no longer parser-loads Supabase", () => {
  assert.match(indexSource, /<script src="js\/analytics\.js"><\/script>/);
  assert.doesNotMatch(indexSource, /<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/@supabase\/supabase-js@2"><\/script>/);
});
