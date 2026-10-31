#!/usr/bin/env python3
"""Fail if FAQPage Answer.text in 01-jsonld-graph.json differs from 05-faqs.json answerText."""
from __future__ import annotations
import json, sys
from pathlib import Path
root = Path(__file__).resolve().parent
faqs = {f["question"]: f["answerText"] for f in json.loads((root / "05-faqs.json").read_text(encoding="utf-8"))}
graph = json.loads((root / "01-jsonld-graph.json").read_text(encoding="utf-8"))
faq_page = next(n for n in graph["@graph"] if n.get("@type") == "FAQPage")
errors = []
seen = set()
for q in faq_page["mainEntity"]:
    name, text = q["name"], q["acceptedAnswer"]["text"]
    seen.add(name)
    if name not in faqs:
        errors.append(f"JSON-LD question not in 05-faqs.json: {name!r}")
    elif faqs[name] != text:
        errors.append(f"BYTE MISMATCH for {name!r}\n  faqs: {faqs[name]!r}\n  json: {text!r}")
for name in faqs:
    if name not in seen:
        errors.append(f"05-faqs.json question missing from JSON-LD: {name!r}")
# also check SoftwareApplication description == SoftwareSourceCode description
apps = [n for n in graph["@graph"] if n.get("@type") == "SoftwareApplication"]
srcs = [n for n in graph["@graph"] if n.get("@type") == "SoftwareSourceCode"]
if apps and srcs and apps[0].get("description") != srcs[0].get("description"):
    errors.append("SoftwareApplication.description != SoftwareSourceCode.description")
if "HowTo" in json.dumps(graph):
    errors.append("HowTo present in graph — not allowed in this pack")
if errors:
    print("FAIL")
    print("\n".join(errors))
    sys.exit(1)
print(f"OK — {len(faqs)} FAQ answers byte-match; no HowTo")
