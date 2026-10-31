# METHOD — freeze before independent review (pilot 2 SHAFT)

Reviewer must not edit PLAN/DIFFS while reviewing; findings go to REVIEW.md only.

## Pass criteria

1. **Fact verification:** every factual claim in proposed copy has a source in PLAN or linked live page; no prices (except existing OSS Offer price 0), no client names, no trainee counts; stars/releases only with live source + date.
2. **Spam policy:** no doorway pages; no thin scaled content; no deceptive redirects; no keyword stuffing; entity page substantive.
3. **Schema validity:** all new JSON-LD parses as JSON; SoftwareApplication / SoftwareSourceCode / Organization / Person / FAQPage properties present as proposed; **no HowTo** unless full steps visible (pilot rule: none in this pack); FAQ `Answer.text` **byte-identical** to visible FAQ answer text in `05`.
4. **Hard-rule scan:** grep diffs for EGP/USD prices (except schema Offer 0), client names (ITI, DXC, CIB, …), trainee/متدرب counts, “thousands of users”.
5. **Identity:** commits as ChaosEngine `<chaosengine@mail.grokbot.com>` on `ShaftHQ/shafthq.github.io` only; pack is plan+diffs; no claim of live publish.
6. **Pilot1 lessons carried:** FAQ full answers identical; no HowTo; https og:image; robots AI allow; SERP-proxy baseline label; live titles; diffs copied to durable checkpoint.

## Measure commands (reviewer)

```bash
python3 -c "import json,re,pathlib; t=pathlib.Path('seo-pilot-shaft/diffs/01-jsonld-graph.json').read_text(); json.loads(t); print('jsonld OK')"
python3 seo-pilot-shaft/diffs/check-faq-byte-match.py
rg -n 'EGP|\$|ITI|DXC|CIB|متدرب|trainee|thousands of users|Price' seo-pilot-shaft/diffs/ || true
```

Verdict: PASS / FAIL with blocking issues listed.
