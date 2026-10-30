# Origin source snapshot

This branch contains a source snapshot of the original game repository.

- **Source:** [`Poul12/RpgLooter`](https://github.com/Poul12/RpgLooter)
- **Source branch:** `develop`
- **Exact source commit:** `6bc141117907f445da53d62e99b32680400ef28f`
- **Destination branch:** `snapshot/origin-develop-6bc1411`
- **Copied source files:** 162 of 166 non-dependency files
- **Tracked dependency files omitted:** 153 files under `node_modules/`
- **Large local images omitted:** 4

## What was copied

The snapshot includes the application HTML, CSS, JavaScript, Android/Capacitor project files, build configuration, lockfiles, small local PNG assets, and menu audio. All 162 copied source files have destination Git blob IDs that match the source blob IDs exactly.

## What was intentionally not copied

1. **`node_modules/`** — generated dependency contents are excluded. `package.json` and `package-lock.json` are included; dependencies should be installed from the lockfile.
2. **Four local loading-screen PNGs larger than 1 MB** — the connected GitHub file interface did not return their binary contents. They were not replaced with placeholders:
   - `www/assets/bootstrap/img/loadings/hero-story-loading.png` (3,004,427 bytes; source blob `f020481994a8015af897472113ec9b27cf20d597`)
   - `www/assets/bootstrap/img/loadings/land-story-loading.png` (2,301,446 bytes; source blob `cf24e4b503478d3fcbf6686ddff7d3d8feaf1acd`)
   - `www/assets/bootstrap/img/loadings/port-story-loading.png` (2,280,061 bytes; source blob `f10e19950ce6299c4c77b35cfbf943d5bdb38ae2`)
   - `www/assets/bootstrap/img/loadings/storm-story-loading.png` (2,422,782 bytes; source blob `fd5eef623bda8ad97dab7f69f03d433d0dc96b37`)
3. **Separate external asset repository** — `Poul12.github.io/rpglooter-assets` was not imported. The game still contains references to its existing remote asset host. This is not a fully offline/self-contained asset package.

The exact list and SHA-256-independent Git blob identifiers for every source file are recorded in [`manifest.json`](manifest.json).

## Snapshot boundaries

- No gameplay rules, balance values, combat timing, save data, or source logic were changed.
- The original `Poul12/RpgLooter` repository was not modified.
- The audit documents already in the destination repository were preserved.
- No dependencies were installed and no browser or Android build was run. This is a source transfer, not a tested release build.

## Next validation steps

1. Restore the four omitted loading images from the original repository.
2. Obtain and verify the external asset repository and its manifest.
3. Run `npm ci` in the correct project root and verify the actual build pipeline.
4. Run the game in browser and Android WebView; check offline behavior and all asset references.
5. Compare runtime-loaded JS/CSS against this snapshot before making code changes.
