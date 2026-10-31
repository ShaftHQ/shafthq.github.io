# SEO — JSON-LD `@graph` apply notes

**Target file(s):**
- Prefer **one** injection point: `src/pages/index.tsx` `<Head>` script with `@graph` from `01-jsonld-graph.json` (FAQ slice still built from `getHomepageFaqs()` at runtime so Java version stays dynamic).
- **Remove or empty** duplicate `SoftwareApplication` / `Organization` / `SoftwareSourceCode` `headTags` blocks in `docusaurus.config.js` (lines ~106–176 as of base `f2509320a3`) to avoid duplicate entities.

**Do not** hardcode `softwareVersion` or star counts inside JSON-LD in this pack. At apply time, set `softwareVersion` from refreshed `project-signals.json` / latest GitHub release (see `09-project-signals.md`).

**Person credentials** (ISTQB etc.): omitted pending Coach (same lesson as pilot1).

**No HowTo** in this graph.

**Offers:** keep OSS `price: "0"` / `USD` only — no other prices.
