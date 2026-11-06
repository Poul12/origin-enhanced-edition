/* Origin analytics.
 * Supabase is loaded asynchronously after the page load event so a CDN outage
 * cannot block DOM parsing, DOMContentLoaded, or the game runtime.
 */
var Analytics = (function () {
  "use strict";

  const SUPABASE_URL = "https://wziijmhfcknespnvqodl.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_0diur5qvOJhLqOaT44FFMA_f71m0-Yr";
  const SUPABASE_SCRIPT_URL = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
  const pendingEvents = [];

  let supabaseClient = null;
  let supabaseLoadPromise = null;
  let flushScheduled = false;
  let flushInProgress = false;
  let loadListenerAttached = false;

  function warn(message, error) {
    console.warn("[Analytics] " + message, error || "");
  }

  function getPlayerId() {
    let playerId = window.localStorage.getItem("rpglooter_player_id");

    if (!playerId) {
      playerId = window.crypto && typeof window.crypto.randomUUID === "function"
        ? window.crypto.randomUUID()
        : "player-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2);
      window.localStorage.setItem("rpglooter_player_id", playerId);
    }

    return playerId;
  }

  function createSupabaseClient() {
    if (supabaseClient) return Promise.resolve(supabaseClient);

    if (window.supabase && typeof window.supabase.createClient === "function") {
      try {
        supabaseClient = window.supabase.createClient(
          SUPABASE_URL,
          SUPABASE_PUBLISHABLE_KEY
        );
        return Promise.resolve(supabaseClient);
      } catch (error) {
        return Promise.reject(error);
      }
    }

    if (supabaseLoadPromise) return supabaseLoadPromise;

    supabaseLoadPromise = new Promise(function (resolve, reject) {
      const script = document.createElement("script");
      script.src = SUPABASE_SCRIPT_URL;
      script.async = true;

      script.onload = function () {
        try {
          if (!window.supabase || typeof window.supabase.createClient !== "function") {
            throw new Error("Supabase library loaded without createClient");
          }

          supabaseClient = window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_PUBLISHABLE_KEY
          );
          resolve(supabaseClient);
        } catch (error) {
          reject(error);
        }
      };

      script.onerror = function () {
        reject(new Error("Could not load the Supabase library"));
      };

      (document.head || document.body).appendChild(script);
    }).catch(function (error) {
      supabaseLoadPromise = null;
      throw error;
    });

    return supabaseLoadPromise;
  }

  async function flushPendingEvents() {
    if (flushInProgress || pendingEvents.length === 0 || navigator.onLine === false) {
      return;
    }

    flushInProgress = true;

    try {
      const client = await createSupabaseClient();

      while (pendingEvents.length > 0) {
        const payload = pendingEvents[0];
        const { error } = await client
          .from("game_events")
          .insert(payload);

        pendingEvents.shift();

        if (error) {
          warn("Insert failed:", error.message || error);
        }
      }
    } catch (error) {
      // Keep queued events so a later online event or analytics event can retry.
      warn("Delivery deferred:", error);
    } finally {
      flushInProgress = false;
    }
  }

  function scheduleFlush() {
    if (pendingEvents.length === 0 || flushScheduled || flushInProgress ||
        navigator.onLine === false) {
      return;
    }

    if (document.readyState !== "complete") {
      if (!loadListenerAttached) {
        loadListenerAttached = true;
        window.addEventListener("load", function () {
          loadListenerAttached = false;
          scheduleFlush();
        }, { once: true });
      }
      return;
    }

    flushScheduled = true;

    const run = function () {
      flushScheduled = false;
      flushPendingEvents();
    };

    if (typeof window.requestIdleCallback === "function") {
      window.requestIdleCallback(run, { timeout: 5000 });
    } else {
      window.setTimeout(run, 1000);
    }
  }

  window.addEventListener("online", scheduleFlush);

  return {
    getPlayerId: getPlayerId,

    send: function (event, extra) {
      try {
        const payload = {
          event: event,
          player_id: getPlayerId(),
          character_name: typeof gameState !== "undefined"
            ? gameState?.char?.playerName || null
            : null,
          game_version: typeof GAME_VERSION !== "undefined" ? GAME_VERSION : null,
          platform: window.Capacitor ? "android" : "web",
          language: navigator.language || null,
          ...(extra || {})
        };

        pendingEvents.push(payload);
        if (pendingEvents.length > 100) pendingEvents.shift();
        scheduleFlush();
      } catch (error) {
        warn("Could not queue event:", error);
      }

      return Promise.resolve();
    },

    gameStarted: function () {
      try {
        if (window.sessionStorage.getItem("analytics_game_started")) {
          return Promise.resolve();
        }

        window.sessionStorage.setItem("analytics_game_started", "1");
      } catch (error) {
        warn("Could not access session storage:", error);
      }

      return this.send("game_started");
    },

    newGameCreated: function () {
      return this.send("new_game_created");
    }
  };
})();

window.Analytics = Analytics;
