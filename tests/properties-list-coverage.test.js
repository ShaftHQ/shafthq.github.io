// Regression guard for issue #818: PropertiesList.mdx's hand-written tables must document every
// property that src/data/properties-catalog.json says the engine actually reads (generated from
// the SHAFT_ENGINE Java source of truth -- see scripts/generate-properties-catalog.mjs). The
// catalog surfaced real gaps in the hand-written page (a whole missing "### Pilot" section, plus
// individual rows/descriptions missing from existing sections) that this test would have caught.
//
// This intentionally does NOT check formatting/table structure -- just that each catalog key's
// exact text appears somewhere in the mdx file, so a property can never silently go undocumented
// again. Decision (see #818): backfill the hand-written page from catalog data; do not convert
// PropertiesList.mdx to be generated from the catalog.

const fs = require('node:fs');
const path = require('node:path');

const catalog = require('../src/data/properties-catalog.json');
const MDX_PATH = path.join(__dirname, '..', 'docs', 'reference', 'properties', 'PropertiesList.mdx');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

// Catalog properties that must NOT appear in PropertiesList.mdx's hand-written tables. Keep this
// empty unless a specific property genuinely must not be documented -- each entry requires a
// comment justifying why it is excluded from the public reference page.
const EXCLUSIONS = new Set([
  // (none)
]);

const mdx = fs.readFileSync(MDX_PATH, 'utf8');

assert(catalog.length > 0, 'Properties catalog is empty -- nothing to check coverage against.');

const missing = [];
for (const property of catalog) {
  if (EXCLUSIONS.has(property.key)) continue;
  if (!mdx.includes(property.key)) {
    missing.push(`${property.section}: ${property.key}`);
  }
}

assert(
  missing.length === 0,
  `PropertiesList.mdx is missing ${missing.length} propert${missing.length === 1 ? 'y' : 'ies'} present in the catalog ` +
    `(src/data/properties-catalog.json). Add a row/section for each, or add a justified EXCLUSIONS entry ` +
    `in tests/properties-list-coverage.test.js:\n  - ${missing.join('\n  - ')}`,
);

console.log(`PropertiesList.mdx coverage check passed (${catalog.length} catalog properties, ${EXCLUSIONS.size} exclusions).`);
