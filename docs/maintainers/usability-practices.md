---
title: User guide usability practices
description: The ten human and ten agent practices applied across the SHAFT user guide.
---

# User guide usability practices

This note is the research record for the usability pass. Each practice names a source and the change on this site.

## Human practices

1. **Task-first path.** Say what the page is, who it is for, and the next step before the detail. Source: [Diátaxis](https://diataxis.fr/start-here/). Site: every guide page opens with a page-orientation block (title, description, next link). The landing page leads with the user guide.
2. **Lead with the answer.** Put the conclusion in the first lines. Source: [Nielsen Norman Group, Inverted Pyramid](https://www.nngroup.com/articles/inverted-pyramid/). Site: landing hero states what SHAFT is and points at the guide; orientation blocks repeat the page description first.
3. **Scannable headings.** Short sections with real headings, not walls of prose. Source: [Nielsen Norman Group, How Users Read on the Web](https://www.nngroup.com/articles/how-users-read-on-the-web/). Site: existing heading outline kept; dependency and reporting facts are separate terms in definition lists.
4. **One term per concept.** Do not rename the product or the engine mid-page. Source: [Microsoft Writing Style Guide, Use simple words and sentences](https://learn.microsoft.com/en-us/style-guide/word-choice/use-simple-words-sentences). Site: pages say SHAFT for the framework and `shaft-engine` for the Maven artifact. The orientation line uses that pair.
5. **Examples a reader can copy.** Source: [Google developer documentation style guide, Code samples](https://developers.google.com/style/code-samples). Site: the docs quality check still requires a fenced sample on every public page. Boundary pages keep their Java and XML samples next to the lists.
6. **Reflow on a phone.** Two-dimensional scrolling is for real data tables, not prose. Source: [WCAG 2.2, Understanding 1.4.10 Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html). Site: issue #1085 lists are definition lists. Property matrices stay in a named scroll region because they are columnar data.
7. **One primary action.** Source: [Nielsen Norman Group, Visual Hierarchy](https://www.nngroup.com/articles/visual-hierarchy-ux-definition/). Site: the landing hero states one path into the guide, “Read the user guide”, and keeps a single filled button for creating a project.
8. **Link text says where it goes.** Source: [WCAG 2.2, Understanding 2.4.4 Link Purpose](https://www.w3.org/WAI/WCAG22/Understanding/link-purpose-in-context.html). Site: the existing content check rejects “click here”. Orientation links use the next page title.
9. **Chunk related facts.** Source: [Nielsen Norman Group, Chunking](https://www.nngroup.com/articles/chunking/). Site: each former table row is one term and one definition, not a stretched row.
10. **Stay inside one design language.** Source: [Nielsen Norman Group, Maintain Consistency and Adhere to Standards](https://www.nngroup.com/articles/consistency-and-standards-heuristic/). Site: buttons, type, and color stay on the existing landing and Infima tokens. No new palette.

## Agent practices

1. **A small `llms.txt` index.** Source: [llms.txt](https://llmstxt.org/). Site: `scripts/build-llms-txt.mjs` writes `static/llms.txt` during the production build.
2. **A Markdown form of each page.** Source: [llms.txt, Markdown versions](https://llmstxt.org/). Site: the same script writes `static/md/<route>.md` and the index links there.
3. **Keep the index to one fetch.** Source: [llms.txt](https://llmstxt.org/). Site: descriptions in the index are capped at 140 characters. Full text stays in `llms-full.txt` and the per-page Markdown files.
4. **Same-origin links.** Source: [llms.txt](https://llmstxt.org/). Site: index URLs use the `siteUrl` and `baseUrl` from `docusaurus.config.js`.
5. **An in-page pointer.** Source: [llms.txt](https://llmstxt.org/). Site: the orientation block links `/llms.txt` and the Markdown URL for that page.
6. **Sections that do not depend on “above”.** Source: [Google developer documentation style guide, Cross-references](https://developers.google.com/style/cross-references). Site: the IntelliJ upgrade step names the prerequisites sequence instead of “see above”. The pointer tells agents to cite heading anchors.
7. **Stable heading anchors.** Source: [Docusaurus, Heading IDs](https://docusaurus.io/docs/markdown-features/headings). Site: the restructured sections keep the previous heading text, so the existing ids remain.
8. **Front matter a tool can read.** Source: [Docusaurus Markdown front matter](https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-content-docs#markdown-front-matter). Site: the index uses `title`, `description`, and slug from front matter. The orientation block prints the same description.
9. **Text, not pictures, carries the facts.** Source: [WCAG 2.2, Understanding 1.1.1 Non-text Content](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html). Site: the Markdown export is the docs-loader text, and the landing evidence images keep text alternatives.
10. **State the canonical HTML URL inside the Markdown file.** Source: [llms.txt](https://llmstxt.org/). Site: each generated Markdown file starts with `Canonical HTML:` and `Guide index:`.

## Scroll-region exception

These pages were restructured so the named lists do not scroll horizontally at 390px, including the reporting quick reference at 1440px:

- `/docs/start/upgrade/reference` (methods that require `shaft-visual`, functionality that remains in `shaft-engine`, BrowserStack SDK rows)
- `/docs/start/upgrade/run` (missing-provider troubleshooting)
- `/docs/reference/reporting` (All Reporting Properties)

Other tables, including the properties catalog, stay in `.table-scroll`. They are columnar data. The wrapper is a named, keyboard-reachable region from the earlier wide-table work.
