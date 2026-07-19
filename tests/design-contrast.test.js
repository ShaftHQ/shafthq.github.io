// WS-E: WCAG AA contrast audit for the `--site-color-*` token palettes governed by
// DESIGN_LANGUAGE.md ("Approved palette (site-wide)"). This is a permanent regression
// guard, not a one-off script: it parses the live light and dark palettes straight out of
// src/css/custom.css (never hardcodes hex values) and re-derives the same foreground/
// background pairs that DESIGN_LANGUAGE.md's tokens actually render as across the site
// (hero/footer/audience "dark sections", the AutoBot chat widget, and in-code syntax
// highlighting) by reading how each pair is composed in the CSS -- not by guessing.
//
// Thresholds follow WCAG 2.x SC 1.4.3 (text) / 1.4.11 (non-text, unused here since every
// pair below renders as real text at font sizes below the "large text" cutoff -- see each
// pair's `smallestUse` note): 4.5:1 for normal text, 3:1 for large text (>=24px, or >=18.66px
// bold) / UI components.

import {readFileSync} from 'fs';
import {fileURLToPath} from 'url';

const cssPath = fileURLToPath(new URL('../src/css/custom.css', import.meta.url));
const css = readFileSync(cssPath, 'utf8');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

// --- Token extraction -------------------------------------------------------------------
// Pull the `:root { ... }` (light) and `:root[data-theme='dark'] { ... }` (dark) blocks out
// of custom.css by brace-matching from the selector, then read every `--site-color-<name>:
// #hex;` declaration inside. This intentionally ignores the `-rgb` companion variables
// (comma-separated triplets, not hex) since the hex declarations are the source of truth.
function extractBlock(source, selectorPattern) {
  const selectorMatch = selectorPattern.exec(source);
  assert(selectorMatch, `custom.css is missing a selector matching ${selectorPattern}`);
  const braceStart = source.indexOf('{', selectorMatch.index);
  assert(braceStart !== -1, `custom.css selector ${selectorMatch[0]} has no opening brace`);
  let depth = 0;
  for (let i = braceStart; i < source.length; i++) {
    if (source[i] === '{') depth++;
    else if (source[i] === '}') {
      depth--;
      if (depth === 0) return source.slice(braceStart + 1, i);
    }
  }
  throw new Error(`custom.css selector ${selectorMatch[0]} never closes its brace`);
}

function parsePalette(block) {
  const palette = {};
  const tokenPattern = /--site-color-([a-z-]+?):\s*(#[0-9a-fA-F]{3,8})\s*;/g;
  for (const match of block.matchAll(tokenPattern)) {
    palette[match[1]] = match[2];
  }
  return palette;
}

const lightBlock = extractBlock(css, /:root\s*\{/);
const darkBlock = extractBlock(css, /:root\[data-theme=(['"])dark\1\][^{]*\{/);
const lightPalette = parsePalette(lightBlock);
const darkPalette = parsePalette(darkBlock);

const requiredTokens = ['primary', 'deep', 'deep-alt', 'muted', 'on-dark'];
for (const token of requiredTokens) {
  assert(lightPalette[token], `light :root palette is missing --site-color-${token}`);
  assert(darkPalette[token], `dark :root[data-theme='dark'] palette is missing --site-color-${token}`);
}

// --- WCAG 2.x contrast math --------------------------------------------------------------
function hexToRgb(hex) {
  const normalized = hex.length === 4
    ? `#${[...hex.slice(1)].map((c) => c + c).join('')}`
    : hex;
  const value = parseInt(normalized.slice(1, 7), 16);
  return {r: (value >> 16) & 255, g: (value >> 8) & 255, b: value & 255};
}

function relativeLuminance({r, g, b}) {
  const channel = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  const [rl, gl, bl] = [r, g, b].map(channel);
  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
}

function contrastRatio(hexA, hexB) {
  const lA = relativeLuminance(hexToRgb(hexA));
  const lB = relativeLuminance(hexToRgb(hexB));
  const [lighter, darker] = lA >= lB ? [lA, lB] : [lB, lA];
  return (lighter + 0.05) / (darker + 0.05);
}

// --- Meaningful foreground/background pairs ----------------------------------------------
// Every pair below is a real (fg token, bg token) combination read directly out of the CSS
// that consumes DESIGN_LANGUAGE.md's palette (not an invented combination). `smallestUse`
// records the smallest/heaviest-weight real usage of that pair, which is what determines
// whether the WCAG "large text" 3:1 allowance applies (>=24px normal, or >=18.66px bold) --
// every pair here renders below that cutoff at its smallest use, so all are held to 4.5:1.
// `themes` (optional) restricts a pair to the theme(s) where a selector actually renders it;
// omit it when the same selector/token combination is real in both themes.
const pairs = [
  {
    name: 'on-dark text / deep background',
    fg: 'on-dark',
    bg: 'deep',
    size: 'normal',
    citation: 'src/pages/index.module.css:911-932 (.landingFooter bg=deep, .footerBadges strong color=on-dark)',
    smallestUse: '.footerBadges strong at --site-font-label (0.88rem / 14.08px), font-weight 700',
  },
  {
    name: 'on-dark text / deep-alt background',
    fg: 'on-dark',
    bg: 'deep-alt',
    size: 'normal',
    citation:
      'src/pages/index.module.css:846-865 (.finalCta bg gradient deep-alt->deep, h2 color=on-dark); ' +
      "src/components/AutoBot/styles.module.css:538-541 ([data-theme='dark'] .assistantMessage .messageBubble bg=deep-alt, color=on-dark); " +
      "src/components/AutoBot/styles.module.css:555-561 ([data-theme='dark'] .userMessage .messageBubble bg=deep-alt, color=on-dark, #832); " +
      "src/components/AutoBot/styles.module.css:534-537 ([data-theme='dark'] .chatHeader bg=deep-alt, color=on-dark, #832)",
    smallestUse: 'AutoBot assistant/user message bubble text at --site-font-body (1.05rem / 16.8px), regular weight',
  },
  {
    name: 'muted text / deep background',
    fg: 'muted',
    bg: 'deep',
    size: 'normal',
    citation:
      'src/pages/index.module.css:136-139 (.heroCopy > p color=muted on .hero bg); ' +
      'src/pages/index.module.css:397-398 (.codeCompare pre bg=deep, color=muted); ' +
      'src/pages/index.module.css:910-912 (.landingFooter bg=deep, color=muted)',
    smallestUse: '.footerLinks small / .footerBadges small at --site-font-label (0.88rem / 14.08px), regular weight',
  },
  {
    name: 'muted text / deep-alt background',
    fg: 'muted',
    bg: 'deep-alt',
    size: 'normal',
    citation:
      'src/pages/index.module.css:307-312 (.codeCompare > div/figure bg=deep-alt, color=muted); ' +
      "src/components/AutoBot/styles.module.css:550-552 ([data-theme='dark'] .chatFooter bg=deep-alt, color=muted); " +
      'src/pages/index.module.css:290-296 (.codePanel figcaption / .handledPanel > span color=muted, repointed off primary in #832); ' +
      'src/pages/index.module.css:418-423 (.codeAnnotation/.codeKeyword/.codeCall color=muted, repointed off primary in #832)',
    smallestUse: '.codeCompare code at --site-font-code-small (0.76rem / 12.16px), regular weight',
  },
  {
    // #832: .eyebrow, .codePanel figcaption/.handledPanel > span, and .codeAnnotation/
    // .codeKeyword/.codeCall were repointed off `primary` (see the two `muted text / deep(-alt)
    // background` citations above); .userMessage .messageBubble and .chatHeader were repointed
    // off `primary` in dark mode only (see `on-dark text / deep-alt background` above). Light
    // mode's .userMessage .messageBubble / .chatHeader keep the primary fill unchanged -- it
    // already passes there (5.26:1) -- so this pair stays real, but light-theme-only now: no
    // selector renders on-dark text on a solid primary fill in dark mode anymore.
    name: 'on-dark text / primary background',
    fg: 'on-dark',
    bg: 'primary',
    size: 'normal',
    themes: ['light'],
    citation:
      'src/components/AutoBot/styles.module.css:225-227 (.userMessage .messageBubble bg=primary, color=on-dark, light theme only); ' +
      'src/components/AutoBot/styles.module.css:72-74 (.chatHeader bg gradient reaching solid primary, color=on-dark, light theme only)',
    smallestUse: '.messageBubble p at --site-font-body (1.05rem / 16.8px), regular weight',
  },
];

const thresholds = {normal: 4.5, large: 3};

function auditPalette(themeName, palette) {
  const rows = [];
  for (const pair of pairs) {
    if (pair.themes && !pair.themes.includes(themeName)) continue;
    const fgHex = palette[pair.fg];
    const bgHex = palette[pair.bg];
    const ratio = contrastRatio(fgHex, bgHex);
    const threshold = thresholds[pair.size];
    rows.push({
      theme: themeName,
      pair: pair.name,
      fgHex,
      bgHex,
      ratio,
      threshold,
      pass: ratio >= threshold,
      smallestUse: pair.smallestUse,
    });
  }
  return rows;
}

const allRows = [...auditPalette('light', lightPalette), ...auditPalette('dark', darkPalette)];

// --- Known, proven-infeasible failures ----------------------------------------------------
// Empty as of #832: the 3 pairs formerly tracked here (light primary/deep-alt, light
// primary/deep, dark on-dark/primary) could not reach WCAG AA by adjusting `--site-color-*`
// VALUES alone -- see PR #831 / issue #832 for the original mathematical proof. The resolution
// was the design decision #832 called for: repoint the affected selectors to a different,
// already-passing token instead of tuning the palette (see the `pairs` citations above for
// exactly which selectors moved and to what). Kept as a `Set` (not deleted) so the staleness
// guard below still runs and a future regression can't silently reintroduce an allowlisted
// failure without this guard catching it.
const knownLimitations = new Set([]);

// --- Report the full audit table (always -- passing or failing) --------------------------
console.log('WCAG contrast audit -- DESIGN_LANGUAGE.md --site-color-* palettes\n');
const header = ['theme', 'pair', 'fg', 'bg', 'ratio', 'threshold', 'result'];
const widths = [6, 34, 9, 9, 7, 9, 6];
console.log(header.map((h, i) => h.padEnd(widths[i])).join(' | '));
console.log(widths.map((w) => '-'.repeat(w)).join('-|-'));
for (const row of allRows) {
  const key = `${row.theme}|${row.pair}`;
  const isKnownLimitation = !row.pass && knownLimitations.has(key);
  const cells = [
    row.theme,
    row.pair,
    row.fgHex,
    row.bgHex,
    `${row.ratio.toFixed(2)}:1`,
    `${row.threshold}:1`,
    row.pass ? 'PASS' : isKnownLimitation ? 'FAIL*' : 'FAIL',
  ];
  console.log(cells.map((c, i) => String(c).padEnd(widths[i])).join(' | '));
}
console.log(
  '\n* FAIL rows marked with an asterisk are tracked, proven-infeasible-via-token-value known\n' +
    '  limitations (see the comment above `knownLimitations`) and do not fail this test; every\n' +
    '  other pair is a hard gate.\n',
);

const unexpectedFailures = allRows.filter((row) => !row.pass && !knownLimitations.has(`${row.theme}|${row.pair}`));
if (unexpectedFailures.length > 0) {
  for (const row of unexpectedFailures) {
    console.error(
      `FAIL [${row.theme}] ${row.pair}: ${row.fgHex} on ${row.bgHex} = ${row.ratio.toFixed(2)}:1, ` +
        `needs >= ${row.threshold}:1 (smallest real use: ${row.smallestUse})`,
    );
  }
}

assert(
  unexpectedFailures.length === 0,
  `${unexpectedFailures.length} of ${allRows.length} --site-color-* contrast pair(s) failed WCAG AA outside the ` +
    'known-limitations allowlist -- see FAIL lines above.',
);

// Guard the allowlist itself: if a "known limitation" pair starts passing (e.g. a future,
// real token fix lands), the allowlist entry is now stale and must be removed, not left as
// dead weight silently masking a would-be-caught regression.
const staleAllowlistEntries = [...knownLimitations].filter(
  (key) => !allRows.some((row) => `${row.theme}|${row.pair}` === key && !row.pass),
);
assert(
  staleAllowlistEntries.length === 0,
  `knownLimitations has stale entries that now pass WCAG AA -- remove them: ${staleAllowlistEntries.join(', ')}`,
);

const passCount = allRows.filter((row) => row.pass).length;
console.log(
  `${passCount} of ${allRows.length} --site-color-* contrast pairs meet WCAG AA; ` +
    `${knownLimitations.size} pair(s) are tracked known limitations (see comment above).`,
);
