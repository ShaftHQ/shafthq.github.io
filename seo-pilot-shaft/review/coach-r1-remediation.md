# Coach r1 FAIL remediation
**Remediation commit:** `d44849822f4f52f879bd59f67b378424d1d3e090`


Subject FAIL: `c325a5b` / cherry `b6838fb9bb` (`review/coach-adversarial-r1.md`).
Chaos tech review: `/workspace/reviews/seo-pilot-tech-review.md` (same blocker #1; build PASS).

| Item | Fix | Path |
|---|---|---|
| BLOCK SourceCode desktop | Added desktop to six-surface list | `diffs/01-jsonld-graph.json` SoftwareSourceCode.description |
| REQUIRED AR FAQ ×3 | Factual EG/MSA; RTL notes; byte-match | `diffs/05-homepage-faqs.ts`, `05-faq-aeo-blocks.md`, graph FAQPage |
| REQUIRED yarn build | Chaos PASS (yarn, heap 5G) log attached | `evidence/yarn-build-chaos-pass.log`, `evidence/BUILD-PROOF.md` |
| Nit entity stats | Prefer badges / as-of label | `diffs/04-entity-page.md` |
| Nit base sha | merge-base `68d18cdf` | `PLAN.md`, `diffs/01-apply-notes.md` |
| Chaos W1 | One `@graph` only; dedupe page vs config | `diffs/01-apply-notes.md` § W1 |
| Chaos W2 | Refresh project-signals before apply | `diffs/01-apply-notes.md` § W2, `09-project-signals.md` |
| BASELINE AR re-measure | R1–R4 queries added | `BASELINE.md` |
