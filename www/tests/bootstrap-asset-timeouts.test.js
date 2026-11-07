const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { test } = require("node:test");

const appSource = fs.readFileSync(path.join(__dirname, "../js/app.js"), "utf8");
const assetSource = fs.readFileSync(path.join(__dirname, "../js/asset-manager.js"), "utf8");

function extractFunction(source, name, isMethod = false) {
  const marker = (isMethod ? "async " : "function ") + name + "(";
  const start = source.indexOf(marker);
  assert.notEqual(start, -1, "missing " + name);
  const signatureEnd = source.indexOf(") {", start);
  assert.notEqual(signatureEnd, -1, "missing function body for " + name);
  const open = signatureEnd + 2;
  let depth = 0;
  let quote = null;
  let escaped = false;

  for (let i = open; i < source.length; i++) {
    const char = source[i];
    if (quote) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === quote) quote = null;
      continue;
    }
    if (char === "\"" || char === "'" || char === String.fromCharCode(96)) {
      quote = char;
      continue;
    }
    if (char === "{") depth++;
    if (char === "}" && --depth === 0) {
      const declaration = source.slice(start, i + 1);
      return isMethod ? declaration.replace(/^async /, "async function ") : declaration;
    }
  }
  throw new Error("unterminated function " + name);
}

test("bootstrap shares one runtime promise across repeated callers", async () => {
  const declaration = extractFunction(appSource, "bootstrap");
  let internetChecks = 0;
  let runtimeLoads = 0;
  const context = {
    window: { liveRuntimeReady: false, liveRuntimePromise: null },
    performance: { now: () => 100 },
    assetManager: {
      async updateInternetStatus() { internetChecks++; this.hasInternet = true; }
    },
    loadLiveRuntime: async () => { runtimeLoads++; },
    appTrace: () => {},
    console
  };
  vm.runInNewContext(declaration + "\nthis.bootstrap = bootstrap;", context);

  const first = context.bootstrap();
  const second = context.bootstrap();
  assert.equal(first, second);
  await Promise.all([first, second]);
  assert.equal(internetChecks, 1);
  assert.equal(runtimeLoads, 1);
  assert.equal(context.window.liveRuntimeReady, true);
});

test("bootstrap rejects the shared promise and marks runtime unavailable on failure", async () => {
  const declaration = extractFunction(appSource, "bootstrap");
  const failure = new Error("simulated runtime failure");
  const context = {
    window: { liveRuntimeReady: false, liveRuntimePromise: null, RuntimeDiagnostics: { captureError() {} } },
    performance: { now: () => 100 },
    assetManager: { async updateInternetStatus() { this.hasInternet = false; } },
    loadLiveRuntime: async () => { throw failure; },
    appTrace: () => {},
    console
  };
  vm.runInNewContext(declaration + "\nthis.bootstrap = bootstrap;", context);

  const first = context.bootstrap();
  const second = context.bootstrap();
  assert.equal(first, second);
  await assert.rejects(first, /simulated runtime failure/);
  assert.equal(context.window.liveRuntimeReady, false);
});

test("fetchWithTimeout aborts a request that exceeds its deadline", async () => {
  const declaration = extractFunction(assetSource, "fetchWithTimeout", true);
  const context = {
    window: { setTimeout, clearTimeout },
    AbortController,
    fetch: (_url, options) => new Promise((_resolve, reject) => {
      options.signal.addEventListener("abort", () => {
        const error = new Error("aborted");
        error.name = "AbortError";
        reject(error);
      });
    })
  };
  vm.runInNewContext(declaration + "\nthis.fetchWithTimeout = fetchWithTimeout;", context);

  await assert.rejects(
    context.fetchWithTimeout("/slow-resource", {}, 5),
    error => error.name === "TimeoutError" && /5ms/.test(error.message)
  );
});

test("dynamic script and stylesheet loads have finite timeouts and clean pending state", () => {
  assert.match(assetSource, /asset-manager\.script\.timeout/);
  assert.match(assetSource, /asset-manager\.css\.timeout/);
  assert.match(assetSource, /Script load timed out after 15000ms/);
  assert.match(assetSource, /CSS load timed out after 15000ms/);
  assert.match(assetSource, /delete window\.__originPendingResources\[pendingId\]/);
});

test("runtime error handlers are registered before reload recovery is attempted", () => {
  const handler = appSource.indexOf("runtimeHanlderError();");
  const recovery = appSource.indexOf("resumeAfterReload()");
  assert.notEqual(handler, -1);
  assert.notEqual(recovery, -1);
  assert.ok(handler < recovery);
  assert.match(appSource, /await bootstrap\(\);/);
});
