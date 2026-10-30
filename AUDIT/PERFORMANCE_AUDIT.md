# Performance Audit

**Repository:** `Poul12/RpgLooter` · **Branch:** `develop` · **Commit:** `6bc141117907f445da53d62e99b32680400ef28f`

## Executive assessment

The project uses a DOM-based 2D presentation and a `requestAnimationFrame` game loop. The loop has a delta-time clamp, a pause gate and throttled UI work. This is a reasonable foundation for mobile, but there is no verified performance baseline in this audit. No FPS, frame-time, memory, load-time or thermal measurements were taken.

The biggest performance risk is not a single expensive line: it is the combination of work performed per frame, DOM-heavy UI, image layering, large CSS files, remote asset loading and lifecycle/event management.

## Static measurements

| Item | Observed |
|---|---:|
| Git tree entries | 422 |
| Tracked blobs | 319 |
| Total tracked blob bytes | ~18.7 MB |
| Files under `node_modules/` | 153 |
| JavaScript files in tree (includes dependencies) | 75 |
| `www/live/js` modules | 41 |
| `www/live/css` stylesheets | 7 |
| Main live JS files reviewed | 41 |
| `assetBundles.js` asset references | 577 |
| Unique bundle paths | 491 |

Seven live CSS files reviewed total approximately 329 KB:
- battle.css ~64 KB / 3,365 lines
- character.css ~54 KB / 2,680 lines
- explore.css ~66 KB / 3,423 lines
- inventory.css ~44 KB / 1,896 lines
- map.css ~45 KB / 2,460 lines
- skills.css ~32 KB / 1,600 lines
- store.css ~34 KB / 1,449 lines

These are size/complexity indicators, not direct evidence of slow rendering.

## Main game loop

File: `www/js/shared.js`, approximately lines 2272–2340.

Observed behavior:
- Uses `requestAnimationFrame`.
- Stops logical updates while `appState.isPaused` is true.
- Clamps frame delta to 50 ms.
- Applies time scaling.
- Calls `updateEnemyAttack(delta)` every frame.
- Runs some UI updates at roughly 30 Hz through an accumulator.
- Runs stamina/poise/status updates every frame.
- Runs global resource systems on a 100 ms tick.

Positive: frame delta is used instead of assuming a fixed frame rate; long stalls are capped; some DOM updates are throttled.

Risks:
1. `updateEnemyAttack()` combines timeline logic, status decay/expiry, skill gating and DOM updates. It is a large per-frame hot path.
2. Per-frame updates to stamina drain, defensive block regen, poise, bleed and armor break may each touch state or DOM; profile the actual call tree.
3. The game loop schedules another frame while paused and during hit-stop. This is not necessarily wrong, but verify power use and pause transitions on low-end Android.
4. A single `globalGameTick()` runs multiple independent resource systems; a future scheduler should preserve exact time semantics.

## Enemy timeline hot path

File: `www/live/js/enemy.js`.

`updateEnemyAttack(delta)` resolves the currently selected enemy on each frame and performs:
- spear expiry/reset;
- bleed, armor-break and combo decay;
- slow/stun expiry;
- enemy timeline decrement;
- cooldown/windup progress updates;
- DOM bar updates and skill-state changes.

Potential improvement: separate deterministic state update from DOM presentation; only render when the displayed value changes enough to matter. Keep all gameplay timing in the same clock model and test frame-rate independence.

## Cooldown rendering

Skill cooldowns use a separate per-skill `requestAnimationFrame` animation. This can create multiple concurrent RAF callbacks in addition to the main loop. For a small number of skills it may be acceptable, but a centralized cooldown render pass would reduce scheduling overhead and simplify pause/resume.

There are multiple active/historical definitions of `startSkillCooldown()` in `skills-combat.js`; the later declaration shadows the earlier one. Consolidate only after confirming the desired visual behavior and save compatibility.

## DOM and layout work

Combat rendering uses layered images for the paper-doll character, enemy slots, health/cooldown/windup bars and feedback. Several routines query the DOM by selectors and update inline styles/text. This is a sensible fit for the current no-canvas approach, but repeated selector queries in hot paths should be measured.

Potential costly patterns to inspect in runtime:
- repeated `querySelector` / `querySelectorAll` in frame/tick functions;
- reading layout properties after writes (e.g. `offsetWidth`, `getBoundingClientRect`);
- repeated class changes on elements whose state has not changed;
- large `innerHTML` replacements in view modules;
- CSS filters, shadows, blend modes and animated gradients on large surfaces.

Do not replace DOM rendering with Canvas as a default optimization. The project rules explicitly keep HTML/CSS/JS and the DOM UI direction.

## CSS and responsive rendering

The seven large live stylesheets contain many fixed pixel values. Static scan found few media queries (only one in the seven files), and several styles use viewport-height units but not a consistent responsive system. This increases layout risk on tablets/desktop and unusual mobile browser chrome sizes.

A later layout pass should define shared design tokens and responsive breakpoints, then measure actual layout and paint cost. Do not globally replace all px values; that would create unnecessary regression risk.

## Asset loading and cache

Asset paths are resolved through `AssetManager`; the remote base is GitHub Pages at `Poul12.github.io/rpglooter-assets`. Native cache uses Capacitor Filesystem. The manifest/cache implementation has useful concepts (hashes, offline fallback, retry, progress reporting), but the normal boot path currently does not call `assetManager.init()` (see BUG_REPORT).

`preloadAssets(paths)` awaits each `getAssetUrl()` in a sequential loop. Since URL resolution can include native filesystem operations, a large bundle may incur avoidable startup latency. A bounded concurrency strategy may help, but only after measuring storage I/O and memory pressure.

Avoid downloading or decoding every high-resolution image at once. Split asset bundles by screen/encounter and prefetch the next likely screen.

## Mobile test protocol

Target devices should include:
- a modern Android device;
- a lower-end Android device (the known historical test device was Oppo A15);
- an Android browser/WebView with the actual Capacitor app build.

Record:
1. cold start to interactive;
2. warm start;
3. time to first combat;
4. median and p95 frame time in idle exploration and combat;
5. long frames over 50 ms and 100 ms;
6. JS heap (where available) and process memory;
7. image decode/load failures;
8. CPU/battery/thermal behavior during a 10-minute combat session;
9. offline cold start after cache population;
10. behavior after returning from background and rotating/resizing.

Use the same device, build, scene, enemy, equipment and test duration before/after optimization.

## Required baseline before optimization

No optimization should be accepted without:
- baseline measurement;
- named reproduction scenario;
- before/after measurements;
- regression check for timing and input;
- low-end device test.

## Recommendations

**P1**
- Restore/clarify the asset initialization and cache lifecycle.
- Instrument main loop and enemy timeline.
- Profile combat DOM updates.
- Verify RAF/timer pause behavior.

**P2**
- Consolidate skill cooldown animation scheduling.
- Separate enemy simulation from DOM rendering.
- Cache stable DOM references at view mount and invalidate on unmount.
- Add bounded parallel asset resolution and per-view bundles after measurements.

**P3**
- Establish responsive CSS tokens and desktop-specific layout.
- Audit large shadows/filters/blend modes and image dimensions.
- Add performance smoke tests to the release process.
