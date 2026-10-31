# Build proof (Coach r1 / Chaos)

- **Result:** PASS
- **Command:** `yarn install --frozen-lockfile` then `NODE_OPTIONS=--max-old-space-size=5120 yarn build`
- **Scratch:** `/workspace/scratch-seo-pilot-shaft-wt` (local headTags → `@graph` swap; not pushed)
- **Log:** `yarn-build-chaos-pass.log` (also `/workspace/seo-pilot-shaft-yarn-build.log`)
- **Note:** headTags `@graph` alone is build-safe. Full apply still requires **W1** dedupe (page vs config) and **W2** project-signals refresh — see `diffs/01-apply-notes.md`.
