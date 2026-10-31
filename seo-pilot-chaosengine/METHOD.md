# METHOD — freeze before independent review (pilot 3 ChaosEngine)

Reviewer must not edit PLAN/DIFFS while reviewing; findings go to `review/indep-r1.md` (or REVIEW.md) only.

## Pass criteria

1. **Fact verification:** every factual claim in proposed copy has a source in PLAN or linked live page; no prices (except existing OSS Offer price 0), no client names, no trainee counts; version/stars only with live source + Africa/Cairo date.
2. **Spam policy:** no doorway pages; no thin scaled content; no deceptive redirects; no keyword stuffing; entity page substantive; CE disambiguated from 1993 game + chaos-engineering.
3. **Schema validity:** `01-jsonld-graph.json` parses; SoftwareApplication + SoftwareSourceCode + Organization + Person + FAQPage present; **no HowTo**; FAQ `Answer.text` **byte-identical** to `05-faqs.json`; Application.description == SourceCode.description; CE named ChaosEngine (not SHAFT Engine).
4. **Hard-rule scan:** grep diffs for EGP/USD prices (except Offer 0), client names (ITI, DXC, CIB, …), trainee/متدرب counts, “thousands of users”, “أول وأكبر”, weekly-user claims.
5. **Identity:** commits as ChaosEngine `<chaosengine@mail.grokbot.com>` on `ShaftHQ/shafthq.github.io` only; pack is plan+diffs; no claim of live publish; Automatest/Squarespace edits are Coach-owned notes.
6. **Pilot lessons carried:** FAQ full answers identical; no HowTo; https og:image (flag http on Automatest); robots AI allow; SERP-proxy baseline label; live titles; one `@graph` per CE page (W1); VERSION refresh (W2); durable checkpoint copy.
7. **Surfaces map:** pack names guide CE docs + automatest `/chaosengine` + `chaos-engine/` README tree; does not invent a ShaftHQ/ChaosEngine standalone repo.

## Measure commands (reviewer)

```bash
python3 -c "import json,pathlib; json.loads(pathlib.Path('seo-pilot-chaosengine/diffs/01-jsonld-graph.json').read_text()); print('jsonld OK')"
python3 seo-pilot-chaosengine/diffs/check-faq-byte-match.py
rg -n 'EGP|\$|ITI|DXC|CIB|متدرب|trainee|thousands of users|أول وأكبر|Price' seo-pilot-chaosengine/diffs/ || true
rg -n 'HowTo' seo-pilot-chaosengine/diffs/01-jsonld-graph.json || true
rg -n 'http://static1.squarespace' seo-pilot-chaosengine/diffs/ || true
```

Verdict: PASS / FAIL with blocking issues listed.
