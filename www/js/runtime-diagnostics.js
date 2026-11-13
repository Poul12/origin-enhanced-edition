/* Origin runtime diagnostics.
 * Keeps a bounded, privacy-conscious report in sessionStorage and exports JSON.
 */
(function () {
  "use strict";

  if (window.RuntimeDiagnostics) return;

  const STORAGE_KEY = "origin.runtimeDiagnostics.v1";
  const MAX_EVENTS = 100;
  const MAX_ERRORS = 40;
  const MAX_TEXT_LENGTH = 1200;
  const RECOVERY_TRACE_KEY = "origin.recoveryTrace.v1";
  const MAX_RECOVERY_EVENTS = 100;

  let recoveryTrace = [];
  try {
    const savedTrace = localStorage.getItem(RECOVERY_TRACE_KEY);
    const parsedTrace = savedTrace ? JSON.parse(savedTrace) : [];
    if (Array.isArray(parsedTrace)) recoveryTrace = parsedTrace.slice(-MAX_RECOVERY_EVENTS);
  } catch {
    recoveryTrace = [];
  }

  const state = {
    startedAt: new Date().toISOString(),
    events: [],
    errors: [],
    counters: {
      errors: 0,
      resourceErrors: 0,
      unhandledRejections: 0,
      consoleErrors: 0
    }
  };

  function now() {
    return new Date().toISOString();
  }

  function limitText(value, maxLength = MAX_TEXT_LENGTH) {
    const text = String(value == null ? "" : value);
    return text.length > maxLength ? text.slice(0, maxLength) + "…[truncated]" : text;
  }

  function safeUrl(value) {
    if (!value) return "";
    try {
      const url = new URL(String(value), window.location.href);
      return url.origin + url.pathname;
    } catch {
      return limitText(value, 500).split("?")[0].split("#")[0];
    }
  }

  function describeValue(value) {
    if (value instanceof Error) {
      return {
        name: limitText(value.name || "Error", 100),
        message: limitText(value.message),
        stack: limitText(value.stack, 5000)
      };
    }

    if (value === null) return "null";

    const type = typeof value;
    if (type === "string") return limitText(value, 600);
    if (type === "number" || type === "boolean" || type === "undefined") {
      return String(value);
    }

    if (value && value.tagName) {
      return {
        element: String(value.tagName).toLowerCase(),
        id: value.id || "",
        className: typeof value.className === "string"
          ? limitText(value.className, 160)
          : ""
      };
    }

    return Object.prototype.toString.call(value);
  }

  function persist() {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Diagnostics must never interrupt gameplay if storage is unavailable.
    }
  }

  function restore() {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (!saved) return;

      const parsed = JSON.parse(saved);
      if (!parsed || typeof parsed !== "object") return;

      state.startedAt = parsed.startedAt || state.startedAt;
      state.events = Array.isArray(parsed.events)
        ? parsed.events.slice(-MAX_EVENTS)
        : [];
      state.errors = Array.isArray(parsed.errors)
        ? parsed.errors.slice(-MAX_ERRORS)
        : [];
      state.counters = Object.assign(state.counters, parsed.counters || {});
    } catch {
      // Ignore invalid or unavailable previous session data.
    }
  }

  function persistRecoveryTrace() {
    try {
      localStorage.setItem(RECOVERY_TRACE_KEY, JSON.stringify(recoveryTrace.slice(-MAX_RECOVERY_EVENTS)));
    } catch {
      // Recovery diagnostics must never interrupt gameplay.
    }
  }

  function recordRecovery(type, details = {}) {
    recoveryTrace.push({
      at: now(),
      type: limitText(type, 100),
      details: details || {}
    });
    if (recoveryTrace.length > MAX_RECOVERY_EVENTS) {
      recoveryTrace.splice(0, recoveryTrace.length - MAX_RECOVERY_EVENTS);
    }
    persistRecoveryTrace();
  }

  function startRecoveryTrace(details = {}) {
    recoveryTrace = [];
    recordRecovery("critical.enter", details);
  }

  function record(type, details) {
    state.events.push({
      at: now(),
      type: limitText(type, 100),
      details: details || {}
    });

    if (state.events.length > MAX_EVENTS) {
      state.events.splice(0, state.events.length - MAX_EVENTS);
    }

    persist();
  }

  function addError(entry) {
    state.errors.push(Object.assign({ at: now() }, entry));
    if (state.errors.length > MAX_ERRORS) {
      state.errors.splice(0, state.errors.length - MAX_ERRORS);
    }
    persist();
  }

  function captureError(error, source, extra) {
    const isError = error instanceof Error;
    const entry = {
      source: limitText(source || "handled-error", 100),
      name: isError ? limitText(error.name || "Error", 100) : "Error",
      message: limitText(isError ? error.message : error),
      stack: isError ? limitText(error.stack, 5000) : "",
      extra: extra || {}
    };

    state.counters.errors += 1;
    addError(entry);
    record("error", {
      source: entry.source,
      name: entry.name,
      message: entry.message
    });
  }

  function describeTarget(target) {
    if (!target || !target.tagName) return {};
    return {
      tag: String(target.tagName).toLowerCase(),
      id: target.id || "",
      className: typeof target.className === "string"
        ? limitText(target.className, 160)
        : "",
      action: target.dataset?.action || "",
      dataType: target.dataset?.type || "",
      npcId: target.dataset?.npcId || "",
      role: target.getAttribute?.("role") || ""
    };
  }

  function onWindowError(event) {
    if (event.target && event.target !== window) {
      const target = event.target;
      state.counters.resourceErrors += 1;
      const resource = safeUrl(target.src || target.href || "");
      const details = {
        tag: String(target.tagName || "resource").toLowerCase(),
        url: resource
      };

      addError({
        source: "resource-load",
        name: "ResourceLoadError",
        message: "Failed to load " + (details.tag || "resource"),
        stack: "",
        extra: details
      });
      record("resource.error", details);
      return;
    }

    state.counters.errors += 1;
    const message = event.message || "Uncaught JavaScript error";
    const entry = {
      source: "window.error",
      name: event.error?.name || "Error",
      message: limitText(message),
      stack: limitText(event.error?.stack || "", 5000),
      extra: {
        filename: safeUrl(event.filename),
        line: event.lineno || 0,
        column: event.colno || 0
      }
    };

    addError(entry);
    record("javascript.error", {
      message: entry.message,
      filename: entry.extra.filename,
      line: entry.extra.line
    });
  }

  function onUnhandledRejection(event) {
    state.counters.unhandledRejections += 1;
    const reason = event.reason;
    const isError = reason instanceof Error;
    const entry = {
      source: "unhandledrejection",
      name: isError ? limitText(reason.name || "Error", 100) : "UnhandledRejection",
      message: limitText(isError ? reason.message : reason),
      stack: isError ? limitText(reason.stack, 5000) : "",
      extra: {}
    };

    addError(entry);
    record("promise.unhandled-rejection", {
      name: entry.name,
      message: entry.message
    });
  }

  function onClick(event) {
    const target = event.target?.closest
      ? event.target.closest("button, a, [data-action], [role='button'], [data-type='npc']")
      : event.target;

    if (target) record("user.click", describeTarget(target));
  }

  function onKeyDown(event) {
    const target = event.target;
    if (
      target?.isContentEditable ||
      /^(INPUT|TEXTAREA|SELECT)$/.test(target?.tagName || "")
    ) return;

    record("user.key", {
      key: limitText(event.key || event.code, 40),
      target: describeTarget(target)
    });
  }

  function buildReport() {
    return {
      reportVersion: 1,
      generatedAt: now(),
      sessionStartedAt: state.startedAt,
      app: {
        title: document.title || "Origin",
        path: window.location.pathname,
        language: document.documentElement.lang || "",
        readyState: document.readyState
      },
      environment: {
        userAgent: navigator.userAgent || "",
        online: navigator.onLine,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
          devicePixelRatio: window.devicePixelRatio || 1
        }
      },
      counters: Object.assign({}, state.counters),
      recoveryTrace: recoveryTrace.slice(),
      timing: {
        timeOrigin: Math.round(performance.timeOrigin || 0),
        navigation: (() => {
          const nav = performance.getEntriesByType("navigation")[0];
          if (!nav) return null;
          return {
            domInteractive: Math.round(nav.domInteractive),
            domContentLoaded: Math.round(nav.domContentLoadedEventEnd),
            loadEventEnd: Math.round(nav.loadEventEnd),
            durationMs: Math.round(nav.duration)
          };
        })()
      },
      resources: performance.getEntriesByType("resource")
        .filter(entry => entry.initiatorType === "script" || entry.initiatorType === "link" || entry.name.includes("manifest.json"))
        .slice(-100)
        .map(entry => ({
          url: safeUrl(entry.name),
          initiatorType: entry.initiatorType,
          durationMs: Math.round(entry.duration),
          transferSize: entry.transferSize || 0
        })),
      pendingResources: Object.keys(window.__originPendingResources || {})
        .slice(-100)
        .map(id => {
          const entry = window.__originPendingResources[id] || {};
          return {
            id: limitText(id, 200),
            type: limitText(entry.type || "", 40),
            path: limitText(entry.path || "", 500),
            phase: limitText(entry.phase || "", 80),
            startedAt: limitText(entry.startedAt || "", 80)
          };
        }),
      errors: state.errors.slice(),
      lastEvents: state.events.slice()
    };
  }

  function downloadReport() {
    record("diagnostics.export", {});
    const report = buildReport();
    const blob = new Blob(
      [JSON.stringify(report, null, 2)],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");

    link.href = url;
    link.download = "origin-diagnostics-" + stamp + ".json";
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  restore();

  // Merge events captured in <head> before this diagnostics script was loaded.
  const earlyEvents = Array.isArray(window.__originEarlyEvents) ? window.__originEarlyEvents.splice(0) : [];
  earlyEvents.forEach(entry => {
    if (entry.type === "resource.early-error") {
      state.counters.resourceErrors += 1;
      addError({
        source: "resource-load",
        name: "ResourceLoadError",
        message: "Failed to load " + (entry.details?.tag || "resource"),
        stack: "",
        extra: entry.details || {}
      });
      record("resource.error", entry.details || {});
    } else {
      record(entry.type, entry.details || {});
    }
  });

  window.RuntimeDiagnostics = {
    record,
    recordRecovery,
    startRecoveryTrace,
    captureError,
    buildReport,
    downloadReport
  };

  window.addEventListener("error", onWindowError, true);
  window.addEventListener("unhandledrejection", onUnhandledRejection);
  document.addEventListener("click", onClick, true);
  document.addEventListener("keydown", onKeyDown, true);
  window.addEventListener("offline", () => record("network.offline", {}));
  window.addEventListener("online", () => record("network.online", {}));
  window.addEventListener("hashchange", () => {
    record("navigation.hashchange", { path: window.location.pathname });
  });
  document.addEventListener("visibilitychange", () => {
    record("document.visibility", { state: document.visibilityState });
  });
  window.addEventListener("pagehide", event => {
    record("document.pagehide", { persisted: !!event.persisted });
    if (recoveryTrace.length) recordRecovery("document.pagehide", { persisted: !!event.persisted });
  });
  window.addEventListener("pageshow", event => {
    record("document.pageshow", {
      persisted: !!event.persisted,
      visibilityState: document.visibilityState
    });
  });

  // A delayed heartbeat helps distinguish a blocked main thread from a slow resource.
  let heartbeatExpectedAt = performance.now() + 1000;
  window.setInterval(() => {
    const actualAt = performance.now();
    const delayMs = Math.round(actualAt - heartbeatExpectedAt);
    if (delayMs > 1500) {
      record("diagnostics.heartbeat.delayed", {
        delayMs,
        visibilityState: document.visibilityState
      });
    }
    heartbeatExpectedAt = actualAt + 1000;
  }, 1000);

  if (typeof PerformanceObserver !== "undefined") {
    try {
      const longTaskObserver = new PerformanceObserver(list => {
        list.getEntries().forEach(entry => {
          record("diagnostics.long-task", {
            durationMs: Math.round(entry.duration),
            startTimeMs: Math.round(entry.startTime)
          });
        });
      });
      longTaskObserver.observe({ type: "longtask", buffered: true });
    } catch {
      record("diagnostics.long-task.unsupported", {});
    }
  }

  if (typeof console !== "undefined" && typeof console.error === "function") {
    const originalError = console.error.bind(console);
    console.error = function () {
      state.counters.consoleErrors += 1;
      const args = Array.from(arguments).slice(0, 8).map(describeValue);
      addError({
        source: "console.error",
        name: "ConsoleError",
        message: limitText(args.map(value =>
          typeof value === "string" ? value : JSON.stringify(value)
        ).join(" "), 2000),
        stack: "",
        extra: { arguments: args }
      });
      return originalError.apply(console, arguments);
    };
  }

  record("diagnostics.initialized", {
    restoredEvents: state.events.length,
    restoredErrors: state.errors.length
  });

  document.addEventListener("DOMContentLoaded", () => {
    const exportReport = () => {
      try {
        downloadReport();
      } catch (error) {
        captureError(error, "diagnostics-export");
      }
    };

    const errorButton = document.getElementById("diagnostics-export-btn");
    errorButton?.addEventListener("click", exportReport);

    // Optional mobile-friendly export control for dedicated debug sessions.
    if (new URLSearchParams(window.location.search).get("diagnostics") === "1") {
      const debugButton = document.createElement("button");
      debugButton.type = "button";
      debugButton.textContent = "RAPORT";
      debugButton.setAttribute("aria-label", "Export runtime diagnostics");
      debugButton.style.cssText = [
        "position:fixed",
        "right:12px",
        "bottom:12px",
        "z-index:2147483000",
        "padding:0",
        "border:0",
        "border-radius:0",
        "background:transparent",
        "color:rgba(255,255,255,.72)",
        "font:500 10px sans-serif",
        "letter-spacing:.04em",
        "text-decoration:underline",
        "box-shadow:none",
        "line-height:1.2"
      ].join(";");

      debugButton.addEventListener("click", exportReport);
      document.body.appendChild(debugButton);
    }
  });
})();
