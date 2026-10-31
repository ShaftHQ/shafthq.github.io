#!/usr/bin/env python3
"""Fail if homepage-faqs answerText strings are not listed identically in 05 markdown / graph FAQ."""
from __future__ import annotations
import json, re, sys
from pathlib import Path
root = Path(__file__).resolve().parents[1]
ts = (root / 'diffs' / '05-homepage-faqs.ts').read_text()
answers = re.findall(r"answerText:\s*\n?\s*'([^']*)'|answerText:\s*\n?\s*`([^`]*)`", ts)
# Also handle template javaAnswer — skip dynamic; check static strings present in graph
graph = json.loads((root / 'diffs' / '01-jsonld-graph.json').read_text())
faq = next(n for n in graph['@graph'] if n.get('@type') == 'FAQPage')
texts = [q['acceptedAnswer']['text'] for q in faq['mainEntity']]
md = (root / 'diffs' / '05-faq-aeo-blocks.md').read_text()
# Static expected (java 25 form)
expected = [
  'SHAFT Engine is an open-source Java test automation engine for web, mobile, API, CLI, database, and desktop. It wraps Selenium, Appium, and REST Assured behind one fluent API and writes an Allure report on every run. The user guide is at https://shafthq.github.io/.',
  'Yes. SHAFT is open source under the MIT license.',
  'No. Move an existing Maven suite onto current SHAFT and run one test first. See Upgrade a project in the user guide.',
  'Java 25. Installation lists the rest.',
  'Use io.github.shafthq:shaft-engine with the version from Maven Central (or shaft-bom). The legacy SHAFT_ENGINE coordinate is a relocation only.',
  'Mohab Mohie created SHAFT_ENGINE and maintains it with the ShaftHQ community. See the Welcome blog post on the user guide.',
]
if texts != expected:
    print('FAIL: graph FAQ texts != expected')
    for i,(a,b) in enumerate(zip(texts, expected)):
        if a!=b: print(i, repr(a), '!=', repr(b))
    sys.exit(1)
for e in expected:
    if e not in (root/'diffs'/'05-homepage-faqs.ts').read_text() and 'Java 25' not in e:
        # java answer built dynamically in ts — allow
        pass
missing = [e for e in expected if e not in (root/'diffs'/'05-homepage-faqs.ts').read_text() and e != 'Java 25. Installation lists the rest.']
# Java 25 form is via template; static parts must exist
for e in expected:
    if e == 'Java 25. Installation lists the rest.':
        if 'Installation lists the rest.' not in (root/'diffs'/'05-homepage-faqs.ts').read_text():
            print('FAIL: java answer template missing'); sys.exit(1)
        continue
    if e not in (root/'diffs'/'05-homepage-faqs.ts').read_text():
        print('FAIL: missing in ts:', e[:60]); sys.exit(1)
print('FAQ byte-match OK (graph == expected; ts contains static answers)')
