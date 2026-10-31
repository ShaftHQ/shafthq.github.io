# REVIEW — SEO/AEO/GEO pilot 2 (shafthq.github.io)

- **Reviewer role:** independent adversarial (same box, separate pass after plan freeze)
- **Method frozen at:** `seo-pilot-shaft/METHOD.md` @ plan commit `d708276d16`
- **Reviewed commits:** `d708276d16` (plan) → `d6dab55ae1` (slim audit artifacts)
- **When:** 2026-10-31 Africa/Cairo
- **Scope:** plan + diffs only (no live site change; no PR; branch `seo-pilot-shaft` only)
- **retrieve:** mempalace skipped(no-relevant-hits); CE worktree tools/memory doctor not green — review used live curl + GitHub API evidence in-pack

## Verdict: **PASS** (after slim fix commit)

Plan commit alone would have been **FAIL** on pack hygiene (committed full `llms-full.txt` ~1.1MB + accidental `.raw` dumps). Fix commit `d6dab55ae1` removes them and keeps robots/llms/jsonld samples + dated GitHub evidence. Residual warnings are non-blocking for Coach sign of the *proposal*; they remain checks for *publish apply*.

## Checklist

| Gate | Result | Notes |
|---|---|---|
| Fact verification | PASS | Creator (welcome + Maven developers), MIT, Maven coordinate, Java 25, Selenium ecosystem link, stars **418** / latest **10.4.20261031** / releases **228** dated in `evidence/gh-live-2026-10-31.json`. Trainee counts and “thousands of users” omitted from new copy. |
| Google spam policy | PASS | No doorway cluster; single `/entity` facts page; no keyword-stuffed titles; robots keep AI ALLOW; no deceptive redirects. |
| Schema JSON validity | PASS | `01-jsonld-graph.json` parses; types Organization, Person, SoftwareApplication, SoftwareSourceCode, FAQPage. No HowTo. OSS Offer price 0 only. |
| FAQ byte-match | PASS | `check-faq-byte-match.py` OK — six answers identical across graph expected set and `05-homepage-faqs.ts` static strings; Java answer uses `Java ${javaVersion}` template with Installation clause matching graph’s Java 25 form. |
| Hard-rule scan | PASS | No client names / trainee counts / prices in proposed answer text. Mentions of ITI/DXC/CIB/thousands only as exclusions. |
| Identity | PASS | Both commits `ChaosEngine <chaosengine@mail.grokbot.com>` on `ShaftHQ/shafthq.github.io`. |
| og:image https | PASS | Live + `02` document https social card (200). |
| No live publish | PASS | Branch docs/diffs only; no PR opened. |

## Blockers found on plan commit (resolved)

1. **Pack bloat / accidental raw dumps** (`audit/llms-full.txt`, `audit*.raw`). **Resolved** in `d6dab55ae1`.

## Residual warnings (Coach before publish)

1. **Apply must single-source FAQ render** — replace hardcoded `<details><p>…</p>` in `index.tsx` with `homepageFaqs[i].answerText` (or linkify-without-mutate). Otherwise live Q2-style drift returns.
2. **Deduplicate JSON-LD** — remove config `headTags` SoftwareApplication/Organization/SoftwareSourceCode when page `@graph` lands, or risk duplicate entities in Rich Results.
3. **`softwareVersion` / stars** — do not freeze pilot snapshot forever; refresh `project-signals.json` from GitHub at apply (`09`).
4. **Channel updates** (GitHub About, LinkedIn, YT) need human account access — proposals only.
5. **CE worktree doctor** tools/memory not green on this session overlay — does not block docs-only pack; repair separately if CE required for apply PR.

## Measure log

```
json.loads 01-jsonld-graph.json: OK
check-faq-byte-match.py: OK
identity ChaosEngine on both commits: OK
rg HowTo @type: none
stars evidence 418 @ 2026-10-31 13:17 Africa/Cairo: OK
```

## Sign-off ask

Coach: accept plan + diffs for apply sequence in PLAN.md priority 1–5 after Mohab publish OK, or return with edits. **No merge/publish until Coach sign + Mohab approval.**
