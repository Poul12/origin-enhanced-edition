# Bug and Stability Report

**Source:** `Poul12/RpgLooter` branch `develop`, commit `6bc141117907f445da53d62e99b32680400ef28f`  
**Method:** static inspection and source cross-reference. No runtime reproduction was performed.

Severity guide:
- **P0:** data loss/security/blocking failure proven.
- **P1:** likely gameplay correctness or startup/save issue.
- **P2:** lifecycle/maintainability/responsive/build risk.
- **P3:** cleanup or lower-impact quality issue.

## Confirmed findings

### BUG-001 — Temporary buff expiry uses two incompatible clocks
**Severity:** P1  
**File:** `www/live/js/skills-combat.js`  
**Locations:** `addTemporaryBuff()` ~1061; `restoreBuffsAfterReload()` ~1138.

The buff expiry is written as `getGameTime() + durationMs`, but restore compares it to `Date.now()`. `getGameTime()` returns `appState.gameTime`, a runtime-relative clock advanced by the game loop. `Date.now()` is epoch time. Comparing them directly is invalid.

The restore path also uses `setTimeout`, which is not paused when `appState.isPaused` freezes game time.

**Impact:** buffs may be treated as expired on reload or have incorrect duration; active effects can expire during a pause.

**Fix proposal:** choose a single authoritative clock for each effect. If buff duration is gameplay time, store remaining gameplay milliseconds and tick it from the game clock. If it should elapse offline, persist epoch deadlines consistently. Remove expired records explicitly. Add pause/reload tests.

### BUG-002 — Insufficient guard can still consume stamina
**Severity:** P1  
**File:** `www/live/js/skills-combat.js`  
**Locations:** `handleSkillClick()` ~200–220.

The handler spends stamina first, then checks `guardCost`. If guard is insufficient, it shows a warning and returns. The stamina already spent is not refunded.

**Impact:** failed skill use can consume stamina without executing the skill.

**Fix proposal:** validate all costs first, then consume resources atomically. Test insufficient stamina, insufficient guard and successful use. Do not change configured costs.

### BUG-003 — Save JSON parse has no recovery path
**Severity:** P1  
**File:** `www/js/gameState.js`  
**Location:** `initializeGameState()` ~782–814.

The stored save is passed to `JSON.parse(save)` without try/catch. A truncated/corrupted localStorage value can throw during initialization. There is no explicit save schema version or migration registry.

**Impact:** a corrupt save may prevent normal game startup. Existing player progress may be inaccessible until the data is repaired or reset.

**Fix proposal:** preserve a raw backup before migration; parse safely; validate top-level shape; load known schema versions through migrations; provide recoverable error UI. Never silently overwrite a corrupt save with a new game.

### BUG-004 — Duplicate function declaration shadows prior implementation
**Severity:** P2  
**File:** `www/js/shared.js`  
**Location:** `triggerSlowMo()` ~2227 and ~2234.

Two function declarations with the same name exist in the same script. The later declaration takes precedence. The earlier body is dead/overridden and its default duration differs.

**Impact:** maintainers may edit the wrong implementation or misunderstand the active default behavior.

**Fix proposal:** retain one implementation after confirming all callers and intended defaults. Add unit tests for overlapping slow-motion requests and expiration.

### BUG-005 — Duplicate active skill cooldown implementations
**Severity:** P2  
**File:** `www/live/js/skills-combat.js`  
**Locations:** `startSkillCooldown()` ~427 and ~684.

Two non-commented function declarations have the same name. The later declaration shadows the earlier one. The two bodies implement different visual/time handling.

**Impact:** dead code obscures actual behavior; a fix to the first definition will not affect runtime.

**Fix proposal:** identify intended visual behavior and clock semantics, remove dead implementation in a dedicated cleanup change, and test restore/pause/resume.

### BUG-006 — Global tooltip listener has no duplicate-init guard
**Severity:** P2  
**File:** `www/js/shared.js`  
**Locations:** `bootstrapGame()`, `initGlobalUI()`, `initTooltipSystem()` ~2361–2375.

Each call to `initTooltipSystem()` attaches a new document click listener. No guard or cleanup function is visible. The engine start has an idempotence guard, but the UI initialization path does not.

**Impact:** if bootstrap is invoked more than once in the same page lifetime, duplicate tooltip handlers can accumulate.

**Fix proposal:** make UI mount idempotent and expose teardown for view/runtime lifecycle. Test repeated bootstrap.

## High-risk issues requiring runtime confirmation

### RISK-001 — Asset manager initialization disabled in normal boot
**Severity:** P1  
**Files:** `www/js/app.js`, `www/js/menu.js`, `www/js/asset-manager.js`.

`app.js` calls `assetManager.updateInternetStatus()`, then loads runtime. `bootGame()` has `assetManager.init()` commented out. The asset manager init method is responsible for loading the remote manifest, comparing hashes, syncing files and building the cache index.

**Impact:** cache synchronization/offline-first behavior may not occur during normal launch. Runtime scripts and images may be loaded directly from the remote asset host unless they already exist in cache.

**Fix proposal:** define intended boot behavior for browser vs Capacitor. Initialize once before code/assets that depend on cache; handle online/offline result explicitly. Do not simply uncomment without checking the loader UI and first-install flow.

### RISK-002 — Skill cooldown restore appears not to be called
**Severity:** P1/P2  
**File:** `www/live/js/skills-combat.js`.

`restoreSkillCooldowns()` exists, but a search across the tracked application JavaScript files found no non-definition call site. The skill expiry timestamps are saved in `gameState.combat.skills.skillCooldowns`.

**Impact:** saved cooldowns may not be restored visually/behaviorally after reload, depending on other initialization paths.

**Fix proposal:** trace all skill view mount/start combat paths and decide whether cooldowns should survive app restart, combat transitions or only page refresh. Add a reload fixture.

### RISK-003 — Main runtime may be fetched from a separately versioned external asset repository
**Severity:** P1  
**Files:** `www/js/asset-manager.js`, `www/js/menu.js`.

The runtime loader resolves `live/js/*.js` and `live/css/*.css` through the external asset host. The GitHub asset repository could not be read through the current integration during this audit.

**Impact:** the source in `RpgLooter/develop` may not be identical to the code actually executed by the app. A source-only fix in the main repo might not affect the deployed game until the external assets are updated.

**Fix proposal:** obtain a manifest/snapshot of the external assets and compare hashes, paths and versions with the checked-in source. Establish one release source of truth.

### RISK-004 — Runtime startup uses mixed sequential and parallel script loading
**Severity:** P2  
**File:** `www/js/menu.js`, `liveJsLoadPath()`.

Some modules are loaded sequentially before the rest are loaded in parallel. This likely encodes dependencies, but there is no explicit dependency graph or module loader contract.

**Impact:** reordering or adding a module can create race conditions or missing globals.

**Fix proposal:** document dependency order and add a startup smoke test that verifies required globals/functions before entering the game.

### RISK-005 — Enemy status/timeline code mixes clock sources
**Severity:** P2  
**File:** `www/live/js/enemy.js`.

Enemy slow/stun end timestamps use `performance.now()`, while spear expiry uses `getGameTime()`. Pause/resume saves and restores some status durations separately.

**Impact:** status timing may differ from game-time pause/slow-motion behavior. The intended rules are not clear from the clock types alone.

**Fix proposal:** define the clock domain per effect and test pause, slow motion, background/foreground and long frame stalls.

## Build/repository findings

### BUILD-001 — Dependency directory is committed
**Severity:** P2  
**Files:** 153 tracked entries under `node_modules/`.

The repo tracks installed dependency contents. This inflates the repository and makes dependency provenance/reproducibility less clear. The root `.gitignore` is absent in the audited tree; only Android-level ignore files are present.

**Fix proposal:** create a root ignore policy and remove generated dependency contents in a separate approved maintenance PR, retaining lockfiles and verifying build reproducibility.

### BUILD-002 — Test command is a no-op
**Severity:** P2  
**File:** `www/package.json`.

The test script prints `No test` and exits successfully. A green test command currently does not prove anything.

**Fix proposal:** introduce real tests incrementally (pure state/calculation tests first, then browser integration). Avoid installing a framework until the test scope and build setup are agreed.

### BUILD-003 — Two Android packaging paths are present
**Severity:** P2  
**Files:** `.github/workflows/build-apk.yml`, `codemagic.yaml`, `android/`, `config.xml`, `capacitor.config.json`.

GitHub Actions constructs a Cordova project and runs `cordova build android`; Codemagic runs Capacitor sync and Gradle build. The repository also contains a Capacitor Android project and root Capacitor dependencies.

**Impact:** build outputs may differ in plugins, manifest configuration, SDK settings and packaged web assets.

**Fix proposal:** select the canonical build path for Enhanced Edition and make the second workflow either consistent or explicitly legacy. Test clean builds in CI.

### BUILD-004 — View/asset path consistency needs validation
**Severity:** P2  
**Files:** view modules and `assetBundles.js`.

View templates use `data-src` attributes and different views resolve them through the asset manager. Some legacy code paths assign `ASSET_BASE` directly. This mixed strategy can lead to path mismatches when assets move.

**Fix proposal:** inventory all asset URL creation and standardize on one resolver; generate a report of references missing from the authoritative asset manifest.

## Not confirmed / not reported as bugs

- No runtime crash was reproduced.
- No actual FPS regression was measured.
- No save data was modified.
- No item duplication or combat exploit was demonstrated.
- Duplicate paths in bundles are not proof of duplicate physical image files; many are intentional cross-bundle reuse.
- The two build systems are not proven broken; they are a maintenance risk.

## Priority queue

1. BUG-001 temporary buff clock mismatch.
2. BUG-002 atomic skill cost validation.
3. BUG-003 safe save parsing and recovery.
4. RISK-001 asset bootstrap/cache lifecycle.
5. RISK-002 cooldown restore call path.
6. RISK-003 source-vs-deployed asset parity.
7. BUG-004/005 duplicate declarations.
8. BUG-006 UI init lifecycle.
9. RISK-004/005 loader and clock contracts.
10. BUILD-001–004 build/repository hygiene.
