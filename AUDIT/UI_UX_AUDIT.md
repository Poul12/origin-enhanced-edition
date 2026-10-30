# UI / UX Audit

**Project direction:** mobile-first dark fantasy Action RPG; Android and Windows desktop; full-screen 2D combat arena.  
**Source:** `RpgLooter/develop`, commit `6bc141117907f445da53d62e99b32680400ef28f`.

## Current presentation structure

The primary `www/index.html` contains the persistent application shell:
- meta scene / logo;
- game layer and layout;
- player statistics;
- combat HUD;
- center combat feedback;
- timing / poise indicators;
- dynamic view containers and navigation.

The `live/js/views/` modules construct screens for battle, map, inventory, store, character and skills. CSS is split into seven large view-oriented files. This is a workable base for incremental redesign, but presentation is tightly coupled to global DOM IDs and runtime state.

## Strengths

- Existing UI is built from HTML/CSS/PNG assets, consistent with the no-framework direction.
- The game already has a combat HUD with HP orb, combat feedback, timing indicator, control meter and enemy windup bar.
- Player avatar is assembled from equipment layers, preserving visual equipment identity.
- UI has distinct views rather than one monolithic screen.
- Several visual indicators communicate state without requiring long text descriptions.

## Current constraints

### Layout responsiveness

Static scan of the seven live CSS files found only one media-query block. Many declarations use fixed pixel dimensions and positioning. Some files use viewport-height units, but there is no consistent responsive layout system.

The current primary HTML viewport includes `maximum-scale=1`, which prevents pinch zoom. This may be intentional for gameplay, but it is an accessibility trade-off and should be reviewed.

### Desktop interaction

A source scan of the main runtime, combat, enemy, skills and battle view found no keyboard event handling for gameplay. The only main-menu key handler found is Enter on a name input.

Desktop keyboard support therefore needs a deliberate input layer. Do not bind keyboard controls directly into individual skill/combat functions. Use an input map that emits the same semantic actions as touch controls.

### Combat arena hierarchy

The current interface has many persistent UI systems: top stats, orbs, combat feedback, action buttons, navigation, skill controls, timers and overlays. A full-screen arena should reorganize these into:
- clear player/enemy focus;
- readable windup and timing state;
- immediately visible health and stamina;
- accessible skill/action clusters;
- secondary information that can be opened on demand.

Avoid simply scaling the mobile screen to desktop. Desktop has more horizontal space and needs its own composition while preserving identical gameplay state.

### Typography and readability

Several style files use decorative display typography such as Cinzel for location labels and headings. This fits the dark fantasy theme, but long descriptions and dense stat text need a highly legible body font. Decorative type should be reserved for short labels.

The project already has many small numeric and icon-driven indicators. Every icon needs an accessible label/tooltip and a clear active/disabled state.

### CSS maintainability

The view stylesheets are large and have many pixel-based declarations. Static scans show numerous animations and fixed-position elements. The issue is not that pixel values are inherently wrong; the issue is the lack of shared layout tokens and breakpoints.

Do not mass-convert px to rem or clamp. First identify layout roles and create a small token system for spacing, typography, HUD sizing, safe areas and responsive breakpoints.

### View lifecycle

View modules inject markup and attach event listeners. The audit has not yet established a uniform mount/unmount contract. Without cleanup, repeated screen openings may leave handlers or timers attached to old DOM nodes.

Create a consistent view lifecycle:
- mount;
- render/update;
- suspend;
- unmount;
- listener/timer cleanup.

### Accessibility and input

Review:
- touch target sizes;
- keyboard focus order;
- visible focus indicators;
- screen reader labels for icon-only controls;
- contrast in disabled and low-health states;
- text scaling and zoom behavior;
- reduced-motion preference;
- alternative interaction to timing controls for users who cannot use rapid input.

These are recommendations for testing, not claims that all current controls fail.

## Recommended Enhanced Edition layout

### Mobile

- Full-screen combat area with player and enemy visually dominant.
- Compact top health/encounter indicators.
- Enemy windup indicator placed close to the enemy, with clear normal/heavy/skill distinction.
- Central timing indicator placed where it does not obscure character silhouettes.
- Skills and defensive controls in thumb-accessible zones.
- Secondary stats, inventory and character panels opened as overlays/drawers.
- Safe-area handling for Android cutouts and navigation gestures.

### Desktop

- Same arena and same combat rules, but a wider composition.
- Player and enemy occupy distinct sides of the central stage.
- Persistent, readable HP/stamina and timing information.
- Skills grouped by role and keyboard shortcut.
- Side panels for combat log, effects and contextual information.
- Keyboard controls and mouse controls available simultaneously.

### Shared visual system

- Restrained dark materials and gothic framing.
- Clear distinction between player resources, enemy intent and skill cooldown.
- Color should encode meaning consistently; do not reuse the same accent for unrelated systems.
- Avoid excessive gradients, thick borders, glow and animated backgrounds.
- Preserve sprite silhouettes and avoid placing UI over critical character details.

## UX redesign priorities

**P1**
1. Ensure all combat feedback is readable on small screens.
2. Make active enemy intent and remaining windup unambiguous.
3. Keep HP, stamina, guard and skill readiness discoverable.
4. Ensure view transitions do not reset gameplay state.

**P2**
1. Establish responsive mobile/tablet/desktop breakpoints.
2. Add keyboard input abstraction.
3. Standardize modal, tooltip, overlay and panel lifecycle.
4. Standardize icon labels and control states.

**P3**
1. Refine motion and combat feedback.
2. Add optional reduced-motion settings.
3. Improve non-combat screens and information density.
4. Apply final graphic polish after performance testing.

## UX acceptance criteria

- Combat HUD fits without clipping at supported phone sizes and landscape mode.
- No essential combat indicator is hidden behind browser/system UI.
- Player and enemy remain visually readable on desktop and mobile.
- Keyboard and touch trigger the same gameplay actions.
- Every interactive control has visible focus/pressed/disabled states.
- Opening/closing views repeatedly does not duplicate actions or listeners.
- Text remains legible at user-selected browser text scaling where feasible.
- Motion does not obscure timing windows or create avoidable frame drops.
