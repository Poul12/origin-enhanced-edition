# Gameplay Systems Audit

**Repository:** `Poul12/RpgLooter`  
**Branch:** `develop`  
**Commit audited:** `6bc141117907f445da53d62e99b32680400ef28f`  
**Method:** static source review; no runtime or balance changes.

## Executive assessment

The game already has a broad gameplay foundation: story/adventure/expedition state, 1v1 combat, enemy intent/windup, player timing/blocking, stamina/guard, weapon styles, skill trees, mastery, equipment, item generation, loot, quests, maps and localization. The correct Enhanced Edition strategy is to preserve these systems and first document their contracts and state transitions. Do not port them as isolated files without their dependencies.

## System inventory

| System | Main files | Audit notes |
|---|---|---|
| Player/world/save state | `www/js/gameState.js`, `global-states.js` | One large nested state object; initialized by merging saved data into defaults |
| Runtime and shared helpers | `www/js/shared.js`, `app.js`, `menu.js` | Global functions and mutable singleton state; runtime bootstrap is coupled to DOM |
| Combat orchestration | `live/js/combat.js`, `combat-resolve.js` | Entry/exit, player actions, attack resolution |
| Enemy timeline and AI | `live/js/enemy.js`, `enemy-database.js`, `enemy-skills.js` | Explicit cooldown/windup/action phases and enemy status effects |
| Weapon styles/mastery | `live/js/combat-style.js`, `skills.js`, `skills-database.js` | Mastery EXP is awarded by named combat events |
| Combat skill execution | `live/js/skills-combat.js` | Skill validation, stamina/guard costs, cooldown state, buffs and effects |
| Character/equipment | `live/js/character.js`, `item.js`, `item-utility.js` | Character calculations depend on item stat/affix shape |
| Inventory/store | `live/js/inventory.js`, `store.js`, `store-items.js` | Item generation and commerce depend on shared character/inventory state |
| World/exploration | `live/js/battle.js`, `map.js`, `exploring-utility.js`, `location.js` | Location progression, encounter slots and exploration |
| Quest/story | `live/js/quests.js`, `quests-database.js`, `quests-assets.js` | Story state and asset data are separate modules |
| Shrine/chest | `live/js/shrine-chest.js`, `shrine-chest-database.js` | Separate interaction/reward system |
| Presentation | `live/js/views/*`, `live/css/*` | View modules build HTML strings and attach event handlers |

## Combat flow

The reviewed flow in `combat.js` is approximately:

1. `startCombat(i)` selects an encounter slot and enemy.
2. It sets world/combat flags, initializes player combat stats, charges encounter energy and prepares enemy/character DOM references.
3. It renders combat slots and waits for entrance animations.
4. It calls `startEnemyAttackTimeline(enemy, i)`.
5. The main game loop calls `updateEnemyAttack(delta)`.
6. Enemy timeline moves through cooldown, windup and action phases; intent resolution calls the appropriate enemy action/attack functions.
7. Player input is gated by `canPerformAction()` and combat state, then resolved through combat/skill functions.

This sequencing is central gameplay behavior. It must be captured in regression tests before any refactor.

## Timing and clock domains

There are multiple clocks in use:

- `appState.gameTime` exposed through `getGameTime()`: advances in `mainGameLoop` using scaled frame delta and stops while `appState.isPaused`.
- `performance.now()`: used for some enemy status deadlines and cooldown/timeline calculations.
- `Date.now()`: used for persisted timestamps, offline time, fatigue, food and some status deadlines.
- `requestAnimationFrame` timestamps: animation scheduling.

This mixture is not automatically wrong, but every persisted deadline and pause/resume path must declare its clock domain. A monotonic runtime clock cannot be compared directly with an epoch timestamp.

### Confirmed timing defect: temporary buffs

In `skills-combat.js`:
- `addTemporaryBuff()` sets `expiresAt = getGameTime() + durationMs`.
- `restoreBuffsAfterReload()` compares `expiresAt` with `Date.now()`.

These values are from different clock domains. In addition, the restored timeout is based on the epoch comparison, so the buff may be discarded or expire incorrectly after reload.

The live implementation of `restoreBuffsAfterReload()` also does not delete an expired buff from `gameState.combat.activeBuffs` when `expiresAt <= now`; it simply continues. Stale entries may remain in saved state.

A further lifecycle issue: `addTemporaryBuff()` schedules a wall-clock `setTimeout`, which is not paused by the game pause state. A buff can expire while gameplay time is paused. Define the intended rule, then use a single clock/tick scheduler.

### Skill cooldowns

The active `handleSkillClick()` stores an expiry in `gameState.combat.skills.skillCooldowns` using `getGameTime()`, then calls the active `startSkillCooldown()` implementation.

The file contains multiple historical/overridden implementations of `startSkillCooldown()` (active definitions at approximately lines 427 and 684; the later declaration wins). The earlier implementation uses remaining game-time and a fill-mask; the later active implementation uses a different visual and time model but reads/writes `skillCooldowns` with `getGameTime()` only when restored. This duplication is a maintainability and regression risk.

The cooldown restore function exists, but a repository-wide call-site search did not find a live invocation of `restoreSkillCooldowns()`. Verify the intended reload behavior before changing it.

## Confirmed skill-cost ordering issue

In `handleSkillClick()`, stamina is spent before guard-cost validation. If a skill has a `guardCost` and the player has insufficient guard stacks, the function displays a warning and returns after stamina has already been spent. The player can lose stamina without the skill executing.

Affected definitions include `shield-wall`, `counter-strike` and `last-bastion` in `skills-database.js`.

Recommended correction, after user approval: validate all requirements first; only then atomically consume stamina/guard and begin cooldown/effect. Add a test proving failed validation does not consume either resource. Do not change any cost values.

## Mastery and combat styles

`combat-style.js` contains the mastery award function `addWeaponMasteryExp(style, amount, source)` and event-based awards. The visible implementation increments style EXP, repeatedly levels up when the threshold is crossed, awards mastery skill points and updates the mastery UI.

The database and style system include Bulwark, Duelist, Warden, Executioner, Juggernaut and Berserker concepts. Mastery is coupled to concrete combat events (perfect block chains, spear control, interrupts, bleed/execution events). Preserve event names and award values during the port.

Risk: award calls are distributed across combat-style and enemy logic. Without a central event contract, refactoring can accidentally double-award or omit mastery XP. Build a source/event matrix and test each award path.

## Player block, guard, stamina and Riposte

The source has separate player block state, stamina state, guard stack handling, timing UI and skill gates. Riposte availability is enabled from enemy timeline logic when the last block result is perfect. This makes the enemy timeline and player block state mutually dependent.

Preserve:
- normal/perfect/missed timing outcomes;
- perfect-block chain behavior;
- guard stack generation and consumption;
- stamina drain/recovery and costs;
- Riposte availability window;
- enemy windup duration and intent resolution;
- slow, stun, bleed, armor-break and spear control effects.

Do not treat these as independent widgets. They are gameplay state machines.

## Save-state risks

`gameState.js` uses `createNewGameState()` as a default template and `mergeDeep()` to merge persisted `parsed.gameState`. This is a useful pattern, but it has no explicit save schema version or migration pipeline. Arrays are replaced wholesale; object shape changes require careful migration.

The `sandbox` mode is excluded from `saveGame()`, while story, expedition and adventure use separate keys. Any Enhanced Edition save adapter must preserve mode-specific keys/data or intentionally provide a migration with backup and rollback.

## Recommended gameplay tests

1. Combat starts from each supported encounter type and initializes exactly one active enemy timeline.
2. Enemy cooldown -> windup -> action -> cooldown transitions occur once and resolve the correct intent.
3. Perfect Block enables Riposte only in the intended timing window.
4. Failed block, stun, slow and pause/resume do not advance timers unexpectedly.
5. Guard-cost skill with insufficient guard consumes neither guard nor stamina.
6. Skill cooldown cannot be bypassed by rapid repeated input.
7. Temporary buff survives a valid save/reload and expires at the correct game-time boundary.
8. Pausing freezes all gameplay-time effects; wall-clock systems follow explicitly documented rules.
9. Mastery XP is awarded exactly once for each qualifying event.
10. Equipment changes recalculate derived stats without mutating base item data.
11. Save/load preserves inventory, equipment, quests, mode, progression and mastery.
12. Old save fixtures load without losing unknown fields or inventing invalid values.

## Scope limitation

This is a source-level system map, not a full mathematical balance audit. Exact damage, drop rates, progression curves and every skill effect still need structured extraction and automated fixture tests. No gameplay values were changed.
