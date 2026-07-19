# Design draft: redesigned custom-properties generator (issue #3717)

Status: draft written before implementation, per the plan-first mandate.

## 1. Problem recap

Two independent problems, one redesign:

1. **Coverage drift** — `src/data/properties-catalog.json` is hand-maintained and
   already diverges from the real engine (355 entries today vs. 26 property
   interfaces / ~390 real `@Key` getters in
   `SHAFT_ENGINE/shaft-engine/.../properties/internal/*.java`). Concretely,
   `Paths.java` alone has two keys — `ariaSnapshotFolderPath` and
   `mobileSessionCacheFolderPath` — that exist in the engine but appear in
   neither the generator catalog nor `PropertiesList.mdx`'s own tables. A whole
   interface (`Pilot.java`, 30 `pilot.ai.*` keys) has no `### Pilot` section in
   `PropertiesList.mdx` at all. This is exactly the "nothing guarantees they
   stay in sync" problem the issue names.
2. **Discoverability** — the generator lives on its own page
   (`custom-properties-generator.mdx`) instead of next to the property
   reference table a user is already reading.

## 2. Source of truth (fixes problem 1)

Decision: **generate from the engine Java source, not from `PropertiesList.mdx`
prose.** The `.mdx` tables are themselves hand-maintained and already stale
(see `Paths`/`Pilot` gaps above), so treating them as ground truth would just
move the drift problem, not remove it. The Java `@Key`/`@DefaultValue`
annotations are the one place that cannot drift from the runtime behavior —
`ConfigFactory` reads them directly.

A new script, `scripts/generate-properties-catalog.mjs`, is added to the docs
repo (maintainer-run, like the existing `scripts/build-autobot-index.mjs` —
**not** wired into `npm run build`, since the docs site has no dependency on
a sibling engine checkout at build time; the JSON it produces is checked in):

- Globs every `*.java` file under a `--engine-path` (default: sibling
  `../SHAFT_ENGINE/shaft-engine/src/main/java/com/shaft/properties/internal`,
  overridable via `SHAFT_ENGINE_PATH` env or flag — the script fails loudly
  with a clear message if the path doesn't resolve, rather than silently
  emitting an empty/partial catalog).
- Extracts every zero-arg `@Key("...")` / `@DefaultValue(...)` getter pair.
  This structurally *cannot* miss a property SHAFT actually reads, and
  self-updates when new `@Key` methods are added — no per-interface allowlist
  to maintain. Infra files (`Properties.java`, `EngineProperties.java`, ...)
  naturally yield zero matches and are skipped; no hardcoded exclusion list.
- Section name = interface name, with one small display-name override map for
  the multi-word ones (`NaturalActions` → "Natural Actions"). Order mirrors
  `PropertiesList.mdx`'s existing section order, with `Pilot` appended (it has
  no home there today — flagged as a follow-up, see §6).
- Target file = `custom.properties` for every interface **except** the four
  whose properties are consumed directly by a third-party library/bootstrap
  step rather than through SHAFT's own `System.getProperties()` merge —
  `Cucumber` → `cucumber.properties`, `TestNG` → `TestNG.properties`,
  `Log4j` → `log4j2.properties`, `Internal` → `internal.properties`. This
  mirrors `PropertyFileManager.readPropertyFiles`, which loads *every*
  `.properties` file in the folder and copies it into `System.getProperties()`
  before OWNER resolves any interface — so a key's own `@Sources` filename
  (`api.properties`, `WebCapabilities.properties`, `browserStack.properties`,
  ...) is a fallback default file, not where a user override has to live. This
  is also exactly what the existing `PropertiesList.mdx` file-based examples
  already show (all of them target `custom.properties` except those four), so
  the mapping is a *generalization* of already-reviewed, already-correct
  documentation, not a new invention. It also matches the target-file set the
  existing `tests/properties-catalog.test.js` already hard-asserts.
- **Description enrichment**, in priority order, because raw `@Key`/
  `@DefaultValue` pairs alone are not "BrowserStack-generator-grade" —
  BrowserStack's tool has a human sentence per capability:
  1. The matching row in `PropertiesList.mdx`'s own "Default Values" table for
     that section, when present (most properties — this reuses the
     already-reviewed prose instead of discarding it).
  2. Else the property's Javadoc (`{@return ...}` / first sentence), when
     present (covers `Pilot`, `Healing`, `NaturalActions`, `Capture`,
     `Cucumber`, most of `BrowserStack`, ...).
  3. Else a tiny manual overrides table in the script itself for the small
     remainder that has neither (e.g. `Healenium`'s six keys, whose
     `PropertiesList.mdx` table has empty description cells today, and
     `ariaSnapshotFolderPath`). This list is expected to be short and is
     printed by the script when non-empty so it stays visible in review.
  `possibleValues` follows the same mdx-first chain, except boolean-typed
  getters always get `possibleValues = "true, false"` regardless of mdx text
  (the Java type system is more authoritative than prose).
- **Sensitive-field detection** reuses
  `EngineProperties.maskSensitiveValue`'s substring list (password, secret,
  token, accesskey/access_key, apikey/api_key, uuid) plus `username` and
  `authorization`/`credential`, which the *current* hand-maintained catalog
  already treats as sensitive (`browserStack.userName`/`accessKey`,
  `LambdaTest.username`/`accessKey`, Jira `authorization`,
  `tinkey.kms.credentialPath`, `applitoolsApiKey`, `ga4ApiSecret`) even though
  some of those hold non-blank shared-account defaults in the Java source
  (e.g. `browserStack.userName`/`accessKey` ship a demo-account value).
  Sensitive properties always publish `defaultValue: ""` in the catalog,
  matching the existing invariant asserted in
  `tests/properties-catalog.test.js`.
- Output: `src/data/properties-catalog.json`, same flat shape as today
  (`section`, `key`, `targetFile`, `defaultValue`, `possibleValues`,
  `description`, `sensitive?`) so the component's existing consumption
  contract doesn't change, just the data underneath it and one extra `type`
  field (`"boolean" | "text" | "number"`) driven straight from the Java
  return type so the UI can pick a type-correct control (number input with
  `step`, rather than sniffing the default string).

## 3. Where it lives (fixes problem 2)

`PropertiesList.mdx` already has one `<Tabs groupId="PropertyTypes"
queryString="PropertyTypes">` overview block at the very top of the page with
four `TabItem`s (Code-based / CLI-based / File-based / Default Values) that
give a one-line description of each view; that same group is then repeated
once **per section** (26 times) with the actual per-section content.

The generator is a single tool over the *whole* catalog (search/filter across
every section at once, BrowserStack-style), so it does not belong duplicated
into all 26 per-section tab blocks — that would mean rendering ~390 property
rows 26 times. Instead, add a fifth `TabItem value="generator" label="Config
Generator"` to the **top overview `Tabs` block only**, containing
`<PropertiesGenerator />`. This is literally "a new tab alongside the existing
tabs" as asked, without the 26x duplication a naive per-section embed would
cause. Docusaurus's grouped tabs sync selection by `value` across every
`<Tabs>` sharing a `groupId`; a `value` that doesn't exist in a given `<Tabs>`
block (the 26 per-section ones don't have a `"generator"` `TabItem`) simply
leaves that block on its own last-selected value, so this doesn't break the
existing per-section tab behavior.

The standalone `docs/reference/properties/custom-properties-generator.mdx`
page **stays** (cheap to keep, avoids breaking existing external links/search
index/sidebar entries) but its copy is trimmed to point at the new embedded
location as the primary one, and `docs/reference/overview.md`'s "Generate a
custom `.properties` file" row is repointed to
`/docs/reference/properties/PropertiesList#generator` (the discoverability fix
the issue actually asks for — landing a user where the properties are already
documented, not on a page they have to know exists).

## 4. Layout (BrowserStack-grade UX)

Reusing the existing two-pane skeleton (it already does search, section/file
filters, sticky live-preview output, and a working `selectOptions()` enum
heuristic — those are keep, not rewrite, per lazy-solution review), the
concrete changes:

```
┌─────────────────────────────────────────────────────────────────────┐
│ [search box, autofocus, instant filter]      [X selected] [Clear]    │
├───────────────┬─────────────────────────────┬─────────────────────┤
│ Category rail │ Property list (filtered)     │ Generated files      │
│ (click to     │                               │ (sticky)             │
│  jump/filter, │ ○ collapsed-by-default group  │                       │
│  shows count  │   per section, expands on     │ custom.properties     │
│  per section) │   match/click                 │ ```                   │
│               │                               │ targetBrowserName=…  │
│ Platform (12) │ [not selected] key + one-line │ ```                   │
│ Web (16)      │  description + default badge  │ [Copy] [Download]     │
│ ...           │  + "Add" button                │                       │
│ Pilot (30)    │                               │ TestNG.properties     │
│               │ [selected] key + description  │ ``` … ```             │
│               │  + type-aware value control    │ [Copy] [Download]     │
│               │  (select for bool/enum, text/  │                       │
│               │  password/number input else)   │ (empty state: "Select │
│               │  + remove (✕)                  │  a property to start")│
└───────────────┴─────────────────────────────┴─────────────────────┘
```

- **Search**: unchanged behavior (matches key/section/file/description/
  possibleValues), but now the primary top-of-panel element, autofocused,
  BrowserStack's own generator leads with search the same way.
  Un-selected rows collapse to a compact one-liner (key, short description,
  default-value chip, "Add" button) instead of always rendering a live input
  — this is the "click-to-add" change: adding a property is one click/tap,
  the value control only appears for properties you've actually added, which
  keeps a ~390-property list scannable instead of showing ~390 simultaneous
  input boxes (the old design's actual usability ceiling at this new scale).
- **Category rail**: replaces the plain `<select>` section dropdown with a
  clickable list (still a native `<select>` under a narrow viewport via the
  existing `max-width: 996px` breakpoint, to stay keyboard/screen-reader
  simple) showing a live count per section so users can gauge size before
  clicking, same spirit as BrowserStack's left-hand capability categories.
- **Type-aware controls**: boolean and small enums keep the existing
  `<select>` heuristic (extended with a numeric-range guard — see §5); the
  script's new `type` field switches free text to a real `<input
  type="number">` with sensible `step` for float-typed properties (e.g.
  `visualMatchingThreshold`), `<input type="password">` for `sensitive`
  properties (unchanged), `<input type="text">` otherwise.
- **Always-visible output**: keep the existing `position: sticky` output
  pane; split the current single "Download + Copy" button into two explicit
  actions (**Copy** / **Download**) per generated file, since the issue lists
  them as two distinct capabilities and a silent side-effect (a file
  download when the user only asked to copy) is exactly the kind of surprise
  a config-generator user doesn't want.
- **Clear selection**: small added affordance next to the selected-count
  badge; BrowserStack's generator has the equivalent "reset" control.

## 5. Correctness fix carried along

`selectOptions()` (decides whether `possibleValues` renders as a `<select>`)
gets one addition: reject options that look like a numeric range (`0 to 100`,
`-1`-`0-100` after a naive comma split) via a small regex guard, in addition
to the existing length/count/`example|host:port|http| or `
exclusions. This wasn't reachable with the old hand-trimmed 355-entry catalog
(a human already avoided writing range-shaped `possibleValues` cells for
anything the generator would touch), but the new mdx-derived enrichment now
flows range text like Healing's `` `-1`, `0`-`100` `` straight through, so the
guard is needed to avoid a nonsensical 2-option dropdown offering `"-1"` and
`"0-100"` as if they were the only two legal values.

## 6. Responsive behavior

Unchanged breakpoints from the existing CSS module (already reasonable):
`≤996px` collapses the 3-column layout to 1 column and un-stickies the output
pane (mobile can't usefully pin a sidebar); `≤620px` stacks the per-property
metadata grid and widens buttons to full-width touch targets. The category
rail folds into the same responsive `<select>` used today for the section
filter below that breakpoint, rather than adding a second responsive
component.

## 7. Explicitly out of scope for this pass

- Rewriting `PropertiesList.mdx`'s hand-written prose/code-sample tabs to
  also be generated (the issue's ask is the generator's coverage guarantee,
  not a rewrite of the whole reference page's authoring model). Filed as a
  separate follow-up issue rather than silently expanded scope (see the
  `Pilot`-section gap noted in §2).
- Persisting selection across visits (localStorage/URL state). BrowserStack's
  tool doesn't need this either (session-scoped is fine for "build me a
  config file"); adding it means new SSR/hydration edge cases for a
  Docusaurus static build, for a use case (build once, download once) that
  doesn't obviously need to survive a reload.
- Changing what freshly generated projects ship in `custom.properties`
  (raised as a "related, discovered in the same session" note in the issue
  itself, explicitly flagged there as a separate product decision, not this
  redesign).
