#!/usr/bin/env python3
"""Fail if homepage-faqs answerText strings are not identical in graph FAQ."""
from __future__ import annotations
import json, re, sys
from pathlib import Path
root = Path(__file__).resolve().parents[1]
ts = (root / 'diffs' / '05-homepage-faqs.ts').read_text()
graph = json.loads((root / 'diffs' / '01-jsonld-graph.json').read_text())
faq = next(n for n in graph['@graph'] if n.get('@type') == 'FAQPage')
texts = [q['acceptedAnswer']['text'] for q in faq['mainEntity']]
names = [q['name'] for q in faq['mainEntity']]
expected = [
  'SHAFT Engine is an open-source Java test automation engine for web, mobile, API, CLI, database, and desktop. It wraps Selenium, Appium, and REST Assured behind one fluent API and writes an Allure report on every run. The user guide is at https://shafthq.github.io/.',
  'Yes. SHAFT is open source under the MIT license.',
  'No. Move an existing Maven suite onto current SHAFT and run one test first. See Upgrade a project in the user guide.',
  'Java 25. Installation lists the rest.',
  'Use io.github.shafthq:shaft-engine with the version from Maven Central (or shaft-bom). The legacy SHAFT_ENGINE coordinate is a relocation only.',
  'Mohab Mohie created SHAFT_ENGINE and maintains it with the ShaftHQ community. See the Welcome blog post on the user guide.',
  'SHAFT Engine إطار أتمتة اختبارات مفتوح المصدر بلغة Java بيغطي الويب والموبايل والـ API والـ CLI وقواعد البيانات والـ desktop. مبني على Selenium وAppium وREST Assured، وبيطلع تقرير Allure مع كل تشغيل. الدليل: https://shafthq.github.io/.',
  'أيوه. SHAFT مفتوح المصدر بترخيص MIT.',
  'مهاب محيي (Mohab Mohie) منشئ SHAFT_ENGINE، وبيحافظ عليه مع مجتمع ShaftHQ. شوف تدوينة Welcome على دليل المستخدم.',
]
if texts != expected:
    print('FAIL: graph FAQ texts != expected')
    print('got', len(texts), 'expected', len(expected))
    for i, (a, b) in enumerate(zip(texts, expected)):
        if a != b:
            print(i, repr(a)[:80], '!=', repr(b)[:80])
    sys.exit(1)
# SourceCode desktop
src = next(n for n in graph['@graph'] if n.get('@type') == 'SoftwareSourceCode')
if 'desktop' not in src['description'].lower():
    print('FAIL: SoftwareSourceCode.description missing desktop:', src['description'])
    sys.exit(1)
for e in expected:
    if e == 'Java 25. Installation lists the rest.':
        if 'Installation lists the rest.' not in ts:
            print('FAIL: java answer template missing'); sys.exit(1)
        continue
    if e not in ts:
        print('FAIL: missing in ts:', e[:80]); sys.exit(1)
# AR questions present
for q in names[-3:]:
    if q not in ts:
        print('FAIL: AR question missing in ts', q); sys.exit(1)
print('FAQ byte-match OK; SourceCode has desktop; AR Qs present')
