# SHAFT UI Design Language

This file is the canonical reference for visual styling changes in the Docusaurus site.

## Approved palette (site-wide)

### Light theme
- Primary: `#006ec0` (`--site-color-primary`)
- Primary RGB: `0, 110, 192` (`--site-color-primary-rgb`)
- Deep: `#102a31` (`--site-color-deep`)
- Deep-alt: `#181f2a` (`--site-color-deep-alt`)
- Deep RGB: `16, 42, 49` (`--site-color-deep-rgb`)
- Deep-alt RGB: `24, 31, 42` (`--site-color-deep-alt-rgb`)
- Muted: `#c8d6e7` (`--site-color-muted`)
- Muted RGB: `200, 214, 231` (`--site-color-muted-rgb`)
- On-dark: `#ffffff` (`--site-color-on-dark`)

### Dark theme
- Primary: `#4cc2ff` (`--site-color-primary`)
- Primary RGB: `76, 194, 255` (`--site-color-primary-rgb`)
- Deep: `#07111f` (`--site-color-deep`)
- Deep-alt: `#102a31` (`--site-color-deep-alt`)
- Deep RGB: `7, 17, 31` (`--site-color-deep-rgb`)
- Deep-alt RGB: `16, 42, 49` (`--site-color-deep-alt-rgb`)
- Muted: `#dff5f4` (`--site-color-muted`)
- Muted RGB: `223, 245, 244` (`--site-color-muted-rgb`)
- On-dark: `#f5fdff` (`--site-color-on-dark`)

## Typography tokens

- `--site-font-heading`
- `--site-font-display`
- `--site-font-display-small`
- `--site-font-body-large`
- `--site-font-body`
- `--site-font-label`
- `--site-font-small`
- `--site-font-caption`
- `--site-font-code`
- `--site-font-code-small`
- `--site-font-card-title-lg`
- `--site-font-card-title`
- `--site-font-card-title-md`
- `--site-font-card-title-sm`

### Font weights

- `--site-font-weight-regular: 500`
- `--site-font-weight-medium: 600`
- `--site-font-weight-bold: 700`

Only these weights are allowed for reusable UI styles: `400|500|600|700`.

## Styling rule

**Migration rule**: Do not use raw hex/RGB values for reusable UI elements unless the change is explicitly justified and listed as an exception. Use `var(--site-*)` for all shared, reusable UI styles and map exceptions in `src/css/custom.css`.

### Allowed exceptions

- One-off brand marks, inline SVG data, or highly component-specific decorative effects.
- Hard-coded values that are already part of external embeds where theming is not practical.
- `docusaurus.config.js` Mermaid theme variables.
- Focus outlines and semantic utility shadows when tokenized colors fail contrast; capture those overrides as token references in `src/css/custom.css`.

## Code block and Mermaid constraints

- Code blocks should only receive global shell shaping from `src/css/custom.css` (`pre`, `.theme-code-block`, `.prism-code`), while Prism token colors should remain untouched unless contrast must be improved.
- Mermaid styling should be constrained to labels, node/edge strokes, and highlights via:
  - `docusaurus.config.js` (`themeConfig.mermaid`)
  - `.docusaurus-mermaid-container` in `src/css/custom.css`
- Avoid structural overrides (no node/edge class rewrites that alter diagram layout).

## PR checklist for future UI edits

1. Use `src/css/custom.css` tokens as defaults for all site-wide style updates.
2. Replace existing shared sizes/colors in changed modules with the closest matching `--site-*` token.
3. Keep font weights to 400/500/600/700.
4. Keep component-unique/viewport-driven sizes only when needed for layout.
5. Ensure landing, docs cards, `code`/`pre`, and Mermaid visuals remain on the same blue-centric palette.
6. Run a quick grep for `landing-` and hard-coded palette values before handoff.
7. Document any justified token exceptions in this file and this checklist.

## Admonition severity vocabulary

The Docusaurus admonition type is not a stylistic choice — it signals consequence severity to the reader. Every callout uses exactly one of the following types, chosen against this vocabulary:

- `:::tip` — An optional best practice or shortcut. The reader can skip it without harm.
- `:::note` — A neutral aside or qualification of the surrounding text. Adds context, not risk.
- `:::info` — A supplementary factual detail: version behavior, defaults, or environment specifics.
- `:::warning` — Ignoring this can make an action fail, silently misbehave, or have side effects.
- `:::danger` — The consequence is irreversible, destructive, or security-sensitive.
- `:::caution` — Do not use. It is a legacy alias of `warning`. Convert any occurrence to `:::warning`.

**Migration rule**: when a callout's body describes a failure mode, a destructive outcome, or a security consequence that its current type does not cover, reclassify it to the type above that matches — do not reword the body to fit the existing type.

## Content style guide

Binding rules for prose in `docs/`:

1. **Descriptive link text.** Never use bare "here" or "click here" as link text — the link text itself must describe the destination.
2. **One end-of-page navigation pattern.** Every page ends with a single `## Related` section listing internal links. Do not add a separate inline navigation line (for example `[A](...) · [B](...)`); fold every destination into `## Related`.
3. **Sentence-case headings.** Capitalize only the first word and proper nouns.
4. **Short paragraphs.** Prefer two to four sentences per paragraph; break up longer explanations with lists or subheadings.
5. **Runnable example required.** Every doc includes at least one fenced, runnable code example relevant to its topic.
6. **Second-person imperative tone.** Address the reader directly and lead with verbs ("Run…", "Add…", "Configure…") rather than passive or third-person phrasing.
