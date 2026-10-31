# Coach r1 remediation report

- branch: `seo-pilot-chaosengine`
- **code-commit (B1/B2/B3):** `df4b3d94e173ee1ddbd1a77915b43ba51ae05c42`
- ls-remote at pack write: see BRANCH.txt / `git ls-remote origin refs/heads/seo-pilot-chaosengine`
- build: `./node_modules/.bin/docusaurus build` exit 0 with `NODE_OPTIONS=--max-old-space-size=5120`
- evidence: `yarn-build-remediation.log`, `ldjson-counts-remediation.md`, `ldjson-ce-docs-remediation.json`

## Per item

| Item | Result |
|---|---|
| **B1** disambiguation + drop spaced \"Chaos Engine\" + CE \"an MIT\" | in code-commit — FAQs, JSON-LD descriptions, entity lead, llms block |
| **B2** Org/Person = pilot2 exact | in code-commit — `01-jsonld-graph.json` + config Organization headTag |
| **B3** Chaos ProductJsonLd suppress + CE @graph | in code-commit — `ProductJsonLd.tsx`, Root mount, DocItem emit, `/entity/chaos-engine` |
| CE docs ld+json | **3** scripts: BreadcrumbList + CE @graph + Organization; **CE SA present; SHAFT SA absent** |
| CE entity ld+json | **2** scripts: CE @graph + Organization; CE SA present; SHAFT SA absent |
| Homepage / non-CE | SHAFT SoftwareApplication present |
| VERSION | snapshot **2026.10.31.5**; **refresh at publish** (2026.10.31.6 pending) |

No PR / merge / publish.
