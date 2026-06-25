const fs = require('fs');
const path = require('path');

const index = fs.readFileSync(path.join(__dirname, '..', 'src', 'pages', 'index.tsx'), 'utf8');
const styles = fs.readFileSync(path.join(__dirname, '..', 'src', 'pages', 'index.module.css'), 'utf8');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(index.includes('One Java test suite for web, mobile, API, DB, and CLI.'), 'Homepage must state the core product message plainly.');
assert(index.includes('Create your first SHAFT project'), 'Homepage hero must use a first-project CTA.');
assert(index.includes('landing-hero-star-cta'), 'Homepage hero must expose a GitHub star CTA hook.');
assert(index.includes('Star on GitHub'), 'Homepage hero must ask successful evaluators to star the project.');
assert(index.includes('codeCompare'), 'Homepage hero must include the before/after code proof.');
assert(!index.includes('telemetryRows'), 'Homepage hero must not render fake telemetry.');
assert(index.includes('/docs/start/quick-start'), 'Homepage must expose the quick-start CTA.');
assert(index.includes('/docs/start/quick-start#new-project-generation'), 'Homepage must link to the new-project quick-start anchor.');
assert(index.includes('/docs/start/quick-start#existing-project-upgrade'), 'Homepage must link to the upgrade quick-start anchor.');
assert(index.includes('/docs/start/quick-start#mcp-integration'), 'Homepage must link to the MCP quick-start anchor.');
assert(index.includes('/docs/agentic/mcp'), 'Homepage must expose MCP setup.');
assert(
  index.includes('Connect MCP after the basics') && index.includes("to: '/docs/start/quick-start#mcp-integration'"),
  'Homepage MCP path must point to the quick-start MCP anchor.',
);
assert(index.includes('id="connect-ai-agent"'), 'Homepage must expose a stable agent-section anchor.');
assert(
  !index.includes('<McpApplications />') && !index.includes('data-testid="landing-agent-commands"'),
  'Homepage must link to the canonical MCP page instead of rendering MCP commands.',
);
assert(index.includes('Maven Central'), 'Homepage claims must link to evidence.');
assert(!index.includes('40,000'), 'Homepage must not contain unsupported adoption claims.');
assert(index.includes('data-testid="landing-hero"'), 'Homepage must expose a stable hero test hook.');
assert(index.includes('data-testid="landing-pathfinder"'), 'Homepage must expose a guide pathfinder hook.');
assert(index.includes('data-testid="landing-agent"'), 'Homepage must expose an agent-section test hook.');
assert(index.includes('data-testid="landing-final"'), 'Homepage must expose final CTA test hook.');
assert(index.includes('data-testid="landing-main"'), 'Homepage must expose a main-content test hook.');
assert(index.includes('landing-hero-quickstart-cta'), 'Landing hero should expose quick-start CTA hook.');
assert(index.includes('data-testid="landing-cta-install"'), 'Landing final CTA should expose install hook.');
assert(index.includes('data-testid="landing-cta-quickstart"'), 'Landing final CTA should expose quick-start hook.');
assert(!index.includes('data-testid="landing-cta-agent"'), 'Landing final CTA should not duplicate the MCP path.');
assert(!index.includes('hero-onboarding-step-'), 'Landing page should not duplicate the quick-start workflow as an onboarding checklist.');
assert(index.includes('id="proof-section"'), 'Landing proof section must expose a stable anchor.');
assert(index.includes('id="guide-paths"'), 'Landing guide path section must expose a stable anchor.');
assert(index.includes('id="surface-section"'), 'Landing surface section must expose a stable anchor.');
assert(!index.includes('id="comparison-section"'), 'Landing page should not include a separate comparison section.');
assert(!index.includes('id="workflow-section"'), 'Landing page should not include a separate workflow section.');
assert(index.includes('id="get-started"'), 'Landing final CTA must expose a stable anchor.');
assert(!index.includes('Use Playwright for browser-only suites.'), 'Homepage should not make unsupported blanket claims.');
assert(styles.includes('prefers-reduced-motion: reduce'), 'Homepage must respect reduced motion.');
assert(styles.includes('@media (max-width: 620px)'), 'Homepage must include a mobile layout.');
assert(!styles.includes('overflow-x: auto'), 'Homepage must not create a horizontal scroller.');

console.log('Homepage content, evidence, and accessibility checks passed.');
