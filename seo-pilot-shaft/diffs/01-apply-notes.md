# SEO — JSON-LD `@graph` apply notes

**Merge-base / cited tree:** `origin/master` **`68d18cdf`** (not `f2509320a3` — that tip is not on origin/master). headTags JSON-LD blocks remain ~L106–176 on that tree.

**Target file(s):**
- Prefer **one** injection point for the full `@graph` (config `headTags` **or** `src/pages/index.tsx` `<Head>` — pick one).
- FAQ slice still built from `getHomepageFaqs()` at runtime so Java version stays dynamic; keep FAQ `Answer.text` byte-identical to visible `answerText`.

## W1 — Deduplicate JSON-LD (required at apply)

Chaos scratch build that swapped **only** config `headTags` → `@graph` while leaving page-level `SoftwareApplication` + old FAQPage produced **3** `application/ld+json` blocks and duplicate SoftwareApplication / competing FAQ sets.

**Apply rule:** emit **exactly one** `@graph` (or one coherent set) per page. If config carries `@graph`, remove page `Head` SoftwareApplication + FAQPage scripts (or the reverse). After build, `view-source` / count `application/ld+json` on `/` must be **1** (or 1 graph + unrelated non-product types only — no duplicate SoftwareApplication/FAQPage).

## W2 — Refresh `project-signals.json` before apply

Do **not** freeze pilot snapshot stars/version forever. Before publish apply, refresh `src/data/project-signals.json` from live GitHub per `09-project-signals.md` (live at pilot evidence: stars **418**, latest **10.4.20261031**). Graph intentionally omits `softwareVersion`; set it from refreshed signals if you add it later.

**Remove or empty** duplicate `SoftwareApplication` / `Organization` / `SoftwareSourceCode` `headTags` blocks when the other injection point owns the `@graph`.

**Person credentials** (ISTQB etc.): omitted pending Coach.

**No HowTo** in this graph.

**Offers:** keep OSS `price: "0"` / `USD` only — no other prices.

**SoftwareSourceCode.description** must include **desktop** (same six surfaces as Organization / SoftwareApplication / FAQ Q1 / llms).
