const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { test } = require("node:test");

const appSource = fs.readFileSync(path.join(__dirname, "../js/app.js"), "utf8");
const menuSource = fs.readFileSync(path.join(__dirname, "../js/menu.js"), "utf8");
const menuViewSource = fs.readFileSync(path.join(__dirname, "../js/views/menuView.js"), "utf8");

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

function createAppHarness({ internetPromise = Promise.resolve(), cssPromise = Promise.resolve(), jsPromise = Promise.resolve(), resume = null } = {}) {
  const classes = new Set(["boot-hidden"]);
  const listeners = {};
  let domReady;
  const diagnostics = [];
  const context = {
    console: { log() {}, warn() {}, error() {} },
    performance: { now: () => 10 },
    document: {
      readyState: "interactive",
      body: { classList: {
        contains: name => classes.has(name),
        remove: name => classes.delete(name),
        add: name => classes.add(name)
      } },
      addEventListener(name, callback) {
        if (name === "DOMContentLoaded") domReady = callback;
      }
    },
    sessionStorage: {
      getItem(key) { return resume && key === "resumeAfterReload" ? resume.mode : null; },
      removeItem() {}
    },
    Analytics: { gameStarted() {} },
    initializeGameState() {},
    enterMenu() {},
    detectLanguage() {},
    applyTranslations() {},
    renderMenuView() {},
    showLoaderError(error) { diagnostics.push({ loaderError: error }); },
    assetManager: {
      hasInternet: true,
      updateInternetStatus: () => internetPromise
    },
    liveCssLoadPath: () => cssPromise,
    liveJsLoadPath: () => jsPromise,
    RuntimeDiagnostics: {
      record(name, details) { diagnostics.push({ name, details }); },
      captureError(error, source) { diagnostics.push({ error: String(error), source }); }
    },
    setTimeout: () => 1,
    clearTimeout() {},
    addEventListener(name, callback) { listeners[name] = callback; }
  };
  context.window = context;
  context.window.setTimeout = context.setTimeout;
  context.window.clearTimeout = context.clearTimeout;
  vm.createContext(context);
  vm.runInContext(appSource, context, { filename: "app.js" });
  return {
    context,
    classes,
    diagnostics,
    listeners,
    async start() { await domReady(); }
  };
}

test("startup reveals the rendered menu while internet check and live runtime are pending", async () => {
  const internet = deferred();
  const css = deferred();
  const js = deferred();
  const harness = createAppHarness({
    internetPromise: internet.promise,
    cssPromise: css.promise,
    jsPromise: js.promise
  });

  await harness.start();

  assert.equal(harness.classes.has("boot-hidden"), false);
  assert.equal(harness.context.liveRuntimeReady, false);
  assert.equal(harness.context.__originStartupStage, "startup.visible");

  internet.resolve();
  await Promise.resolve();
  await Promise.resolve();
  assert.equal(harness.context.liveRuntimeReady, false, "runtime must remain pending while live files load");

  css.resolve();
  js.resolve();
  await harness.context.liveRuntimePromise;
  assert.equal(harness.context.liveRuntimeReady, true);
});

test("runtime load failure remains rejected and is recorded after the menu is visible", async () => {
  const js = deferred();
  const harness = createAppHarness({ jsPromise: js.promise });

  await harness.start();
  assert.equal(harness.classes.has("boot-hidden"), false);

  js.reject(new Error("script download failed"));
  await assert.rejects(harness.context.liveRuntimePromise, /script download failed/);
  assert.equal(harness.context.liveRuntimeReady, false);
  assert.ok(harness.diagnostics.some(item => item.source === "bootstrap-live-runtime"));
});

test("startGame does not initialize the engine until liveRuntimePromise resolves", async () => {
  const gate = deferred();
  const calls = [];
  const start = menuSource.indexOf("async function startGame()");
  const end = menuSource.indexOf("\n\n\nasync function bootGame()", start);
  assert.notEqual(start, -1);
  assert.notEqual(end, -1);

  const context = {
    window: { liveRuntimePromise: gate.promise },
    stopGameEngine: () => calls.push("stop"),
    startGameEngine: () => calls.push("engine"),
    setStartTime: () => calls.push("time"),
    enterGame: async () => calls.push("enter")
  };
  vm.createContext(context);
  vm.runInContext(menuSource.slice(start, end) + "\nglobalThis.__startGame = startGame;", context);

  const starting = context.__startGame();
  assert.deepEqual(calls, []);
  gate.resolve();
  await starting;
  assert.deepEqual(calls, ["stop", "engine", "time", "enter"]);
});

test("startGame does not initialize the engine when runtime loading fails", async () => {
  const gate = deferred();
  const calls = [];
  const start = menuSource.indexOf("async function startGame()");
  const end = menuSource.indexOf("\n\n\nasync function bootGame()", start);
  const context = {
    window: { liveRuntimePromise: gate.promise },
    stopGameEngine: () => calls.push("stop"),
    startGameEngine: () => calls.push("engine"),
    setStartTime: () => calls.push("time"),
    enterGame: async () => calls.push("enter")
  };
  vm.createContext(context);
  vm.runInContext(menuSource.slice(start, end) + "\nglobalThis.__startGame = startGame;", context);

  const starting = context.__startGame();
  gate.reject(new Error("runtime unavailable"));
  await assert.rejects(starting, /runtime unavailable/);
  assert.deepEqual(calls, []);
});

test("resumeAfterReload waits for bootstrap runtime before continuing the saved game", async () => {
  const gate = deferred();
  const calls = [];
  const start = appSource.indexOf("async function resumeAfterReload()");
  const end = appSource.indexOf("\n\nfunction runtimeHanlderError()", start);
  assert.notEqual(start, -1);
  assert.notEqual(end, -1);

  const context = {
    window: { liveRuntimePromise: Promise.resolve() },
    sessionStorage: {
      getItem(key) { return key === "resumeAfterReload" ? "game" : "story"; },
      removeItem(key) { calls.push("clear:" + key); }
    },
    gameState: { world: {} },
    document: { body: { classList: { remove(name) { calls.push("visible:" + name); } } } },
    bootstrap() {
      calls.push("bootstrap");
      context.window.liveRuntimePromise = gate.promise;
    },
    continueGame(mode) { calls.push("continue:" + mode); },
    console
  };
  vm.createContext(context);
  vm.runInContext(appSource.slice(start, end) + "\nglobalThis.__resume = resumeAfterReload;", context);

  const resuming = context.__resume();
  await Promise.resolve();
  assert.deepEqual(calls.slice(-1), ["bootstrap"]);
  assert.equal(context.gameState.world.mode, "story");
  gate.resolve();
  assert.equal(await resuming, true);
  assert.deepEqual(calls.slice(-2), ["visible:boot-hidden", "continue:story"]);
});

test("enterGame quick-return path also waits for the runtime", async () => {
  const gate = deferred();
  const calls = [];
  const start = menuViewSource.indexOf("async function enterGame()");
  assert.notEqual(start, -1);
  const context = {
    window: { liveRuntimePromise: gate.promise, RuntimeDiagnostics: { record() {} } },
    performance: { now: () => 1 },
    appState: { hasEnteredGameBefore: true, mode: "", isPaused: true },
    gameState: { world: { mode: "story" } },
    document: {
      getElementById(id) {
        if (id === "global-logo") return { classList: { add() {} } };
        if (id === "meta-scene") return { style: {} };
        if (id === "game-layer") return {
          style: {},
          classList: { remove() { calls.push("not-ready"); }, add() { calls.push("ready"); } }
        };
      },
      body: { classList: { add() {} } }
    },
    unlockScroll() { calls.push("unlock"); },
    navigate: async () => calls.push("navigate")
  };
  vm.createContext(context);
  vm.runInContext(menuViewSource.slice(start) + "\nglobalThis.__enterGame = enterGame;", context);

  const entering = context.__enterGame();
  await Promise.resolve();
  assert.deepEqual(calls, []);
  gate.resolve();
  await entering;
  assert.ok(calls.includes("navigate"));
  assert.ok(calls.includes("ready"));
});
