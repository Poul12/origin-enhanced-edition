# Asset and Content Audit

**Source repo:** `Poul12/RpgLooter`, branch `develop`, commit `6bc141117907f445da53d62e99b32680400ef28f`.  
**External asset host:** `https://Poul12.github.io/rpglooter-assets`.

## What was inspected

- Git tree and tracked binary metadata;
- `www/js/asset-manager.js`;
- `www/js/assetBundles.js`;
- view templates and their `data-src` references;
- paths used by the combat/avatar renderers.

The external asset repository could not be inspected through the available GitHub connection during this audit. Therefore, this report does not claim that all remote assets exist or match the checked-in source.

## Repository snapshot

The tree contains 319 tracked blobs, approximately 18.7 MB total. There are 45 PNG files in the source repo tree, but most game art is referenced by logical paths and loaded from the separate asset repository. The checked-in `www/assets/bootstrap/` folder contains selected boot/menu art, not the complete game art library.

Asset categories referenced by `assetBundles.js` include:
- icons;
- items and equipment;
- exploration slots and NPCs;
- layered player avatar parts;
- backgrounds and region maps;
- frames;
- buttons;
- VFX;
- loading screens;
- sounds.

## Bundle inventory

A static extraction from `assetBundles.js` found:
- 577 path references;
- 491 unique logical paths;
- 86 repeated references beyond the first occurrence.

Repeated paths are often expected because an asset is shared across multiple bundles (e.g. HUD/map/combat). This is not evidence of duplicate physical files. A future manifest check should distinguish:
1. repeated bundle references;
2. different paths with identical file hashes;
3. unused manifest files;
4. referenced files missing from the manifest;
5. files present remotely but not referenced.

The current bundles include categories such as MENU, REGION, INTRO, MAP, HUD, COMBAT, ENEMY, ITEMS, INVENTORY, SKILLS, EXPEDITION and STORY.

## Asset Manager observations

`AssetManager`:
- resolves assets from cache first;
- falls back to remote GitHub Pages paths when not cached;
- uses Capacitor Filesystem for native cache access;
- reads a remote `manifest.json`;
- compares local and remote file hashes;
- downloads missing/changed files with retry;
- writes local manifest state to localStorage;
- supports offline fallback when a cache exists.

This is a useful design to preserve. The normal application boot path currently does not call `assetManager.init()`, so the manifest synchronization lifecycle is not obviously active. See BUG_REPORT.

`getResolvedAsset(path)` returns from an in-memory Map. Some view modules use this after calling `preloadAssets()`; other legacy code paths directly assign `ASSET_BASE + path`. The two resolution approaches should be inventoried and unified.

## Specific risks

### A. External source of truth

The live JavaScript and CSS are loaded from the external asset host. The checked-in `www/live` files are not necessarily the files served at runtime.

Before porting:
- retrieve the external manifest;
- record its version and hashes;
- compare every `live/js` and `live/css` file to the Git source;
- identify any runtime-only patches;
- document which source is authoritative for each asset.

### B. Missing references

No definitive missing-asset report can be produced without the external manifest and asset repository contents. The source tree alone is insufficient because most referenced images are not stored locally.

### C. Loading strategy

`preloadAssets(paths)` resolves paths sequentially. Bundles are large and can include many images. A later implementation can use per-view bundles and bounded concurrency, but should measure memory and decode pressure on low-end Android.

### D. Avatar layering

Combat avatar rendering uses separate layers for body, head, hands, helmet, armor, boots, pants, gloves, bracers, shoulder, weapon and shield. These paths are gameplay-facing visual dependencies. Preserve filenames, dimensions, alignment and layer order unless every reference is checked.

### E. VFX and audio

VFX and sound assets should be profiled separately from static UI. Preloading all sound/effect files at first boot can increase memory and startup time. Load critical combat sounds early and defer less common assets by encounter/system.

## Asset audit tasks for next phase

1. Obtain read access to `Poul12.github.io/rpglooter-assets`.
2. Download/parse its manifest and record manifest version.
3. Build a reference set from all JS, HTML, CSS and bundle definitions.
4. Compare references against manifest paths.
5. Check file hashes for duplicate content at different paths.
6. Identify large images/audio files and dimensions/duration.
7. Validate every avatar equipment layer.
8. Check locale-specific loading images and UI icons.
9. Generate a machine-readable asset report before any move/rename/delete.
10. Define asset versioning and cache invalidation for Enhanced Edition.

## Preservation rule

Do not move, rename, compress, replace or delete assets as part of the initial Enhanced Edition import. Keep the external asset repository intact until the source-of-truth comparison is complete.
