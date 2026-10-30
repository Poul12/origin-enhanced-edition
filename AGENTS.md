
# ORIGIN – ENHANCED EDITION
# AI DEVELOPMENT RULES

## 1. PROJECT IDENTITY

Origin is a mobile-first, 2D dark fantasy Action RPG.

Technology:
- HTML
- CSS
- Vanilla JavaScript
- PNG and other 2D assets

No framework or game engine migration is planned.

The objective is to create Origin Enhanced Edition by improving the existing game while preserving its core identity and gameplay mechanics.

Target platforms:
- Android mobile browsers
- Desktop browsers (Windows)

## 2. CORE DEVELOPMENT PRINCIPLES

Preserve existing gameplay mechanics unless explicitly authorized to redesign them.

Priorities:
1. Stability and bug fixing.
2. Performance optimization.
3. Code quality and maintainability.
4. Visual improvements.
5. UI/UX redesign.
6. New visual and presentation features.

Do not sacrifice gameplay stability for visual effects.

Do not rewrite entire systems without first understanding their dependencies.

Prefer incremental improvements over unnecessary architectural rewrites.

## 3. CRITICAL GAMEPLAY RULES

Origin's identity depends on tactical 1v1 combat and precise timing.

Preserve:
- Combat timing.
- Enemy windup mechanics.
- Cooldown mechanics.
- Perfect Block.
- Riposte.
- Guard system.
- Stamina.
- Combat styles.
- Skill mechanics.
- Mastery progression.
- Existing player progression.

Do not change damage values, cooldowns, stamina costs, timing windows, skill scaling or progression formulas without explicit approval.

If a mechanic appears incorrect, document the issue and propose a solution before changing its behavior.

## 4. PERFORMANCE REQUIREMENTS

Optimize for low-end Android devices.

Pay special attention to:
- DOM manipulation.
- CSS rendering and layout recalculation.
- JavaScript execution.
- Animation loops.
- requestAnimationFrame.
- Timers and cooldowns.
- Memory allocations.
- Event listeners.
- Asset loading and caching.
- Unnecessary rendering updates.

Avoid premature optimization.

Measure performance before and after significant changes whenever possible.

Never replace accurate game timing with frame-dependent calculations.

## 5. VISUAL DIRECTION

The visual identity is dark fantasy.

Design principles:
- Atmospheric environments.
- Dark, detailed materials.
- Gothic and medieval influences.
- Restrained use of decorative elements.
- Strong visual hierarchy.
- Clear gameplay indicators.
- Readable typography on small screens.

Avoid:
- Generic mobile game UI.
- Excessive gradients.
- Repetitive blue/gold styling.
- Oversized decorative frames.
- Unnecessary text.
- Visual effects that reduce readability or performance.

The combat interface should feel like a polished dark fantasy RPG.

## 6. UI AND LAYOUT

The target direction is a full-screen 2D combat arena.

The game should feel immersive rather than like a collection of HTML slots.

Requirements:
- Mobile-first responsive design.
- Full-screen combat presentation.
- Clear player and enemy visibility.
- Integrated HUD.
- Distinct skill indicators.
- Consistent visual language.
- Desktop keyboard support.

Do not implement a grid-based or isometric world without explicit approval.

## 7. ASSET MANAGEMENT

Preserve the existing asset management architecture unless a documented issue requires changes.

Do not rename, move, delete or replace assets without checking references.

Reuse existing assets wherever appropriate.

Do not generate placeholder graphics when actual project assets are available.

Document any new asset dependencies.

## 8. CODE QUALITY

Prefer:
- Small, focused functions.
- Clear system boundaries.
- Reusable components.
- Explicit state management.
- Consistent naming.
- Minimal dependencies.

Avoid:
- Unnecessary frameworks.
- Duplicate systems.
- Global state modifications without understanding dependencies.
- Large unrelated refactors.
- Unnecessary changes to existing save structures.

## 9. GIT AND CHANGE MANAGEMENT

Never work directly on main.

Use dedicated feature branches.

One task should represent one logical improvement.

Before completing a task:
1. Inspect the diff.
2. Run relevant tests.
3. Check for regressions.
4. Document changes.
5. Report any unresolved problems.

Do not merge Pull Requests or deploy without user approval.

Never modify the original Origin repository.

## 10. REQUIRED REPORTING

For each task, report:

- What was inspected.
- What was changed.
- Why it was changed.
- Which files were affected.
- Tests performed.
- Performance impact, if measured.
- Known limitations.
- Recommended next steps.

If requirements are ambiguous, ask before implementing risky changes.

## 11. FIRST RULE

Understand the existing implementation before modifying it.

The original game is the source of truth for gameplay behavior.

Enhanced Edition should improve the experience without destroying what already works.
 
