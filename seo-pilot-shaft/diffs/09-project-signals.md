# SEO — project-signals / version freshness

**At publish time** (not frozen in this proposal as eternal truth), refresh:

`src/data/project-signals.json` from GitHub:

```json
{
  "engineVersion": "<latestRelease.tagName>",
  "javaVersion": "25",
  "stars": "<stargazers_count>"
}
```

**Snapshot used for this pilot (do not treat as forever):**

- Fetched: 2026-10-31 13:17 Africa/Cairo
- stars: **418**
- latestRelease: **10.4.20261031**
- releases.totalCount: **228**
- Source: `seo-pilot-shaft/evidence/gh-live-2026-10-31.json`

`usage-metrics.json` stays on its GA4 asOf date; do not invent new GA numbers in this pilot.
