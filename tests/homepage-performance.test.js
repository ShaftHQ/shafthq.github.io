const fs = require('fs');
const path = require('path');

const index = fs.readFileSync(path.join(__dirname, '..', 'src', 'pages', 'index.tsx'), 'utf8');
const styles = fs.readFileSync(path.join(__dirname, '..', 'src', 'pages', 'index.module.css'), 'utf8');
const customStyles = fs.readFileSync(path.join(__dirname, '..', 'src', 'css', 'custom.css'), 'utf8');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(index.includes('One Java test suite for web, mobile, API, DB, and CLI.'), 'Homepage must state the core product message plainly.');
assert(index.includes('Ship automation evidence, not boilerplate code.'), 'Homepage must use the evidence-first hero message.');
assert(index.includes('Start a new project'), 'Homepage hero must use a first-project CTA.');
assert(index.includes('landing-hero-star-cta'), 'Homepage hero must expose a GitHub star CTA hook.');
assert(index.includes('Star on GitHub'), 'Homepage hero must ask successful evaluators to star the project.');
assert(!index.includes('landing-command-center'), 'Homepage hero must not render the redundant command-center block.');
assert(!index.includes('landing-hero-signals'), 'Homepage hero must not render the redundant signal block.');
assert(index.includes('landing-audience-split'), 'Homepage must expose the engineer/leader section below the hero.');
assert(index.includes('landing-surface-matrix'), 'Homepage must expose the surface coverage matrix.');
assert(index.includes('landing-evidence-loop'), 'Homepage must expose the evidence loop chart.');
assert(index.includes('landing-allure-evidence'), 'Homepage must expose the Allure evidence visual.');
assert(index.includes('/img/allure3_main_light.png'), 'Homepage must render the official Allure 3 evidence image.');
assert(!index.includes('/img/allure-evidence-report.svg'), 'Homepage must not use the generated Allure evidence placeholder.');
assert(index.includes('landing-footer'), 'Homepage must use the custom landing footer.');
assert(index.includes('MIT licensed'), 'Homepage footer must use the real SHAFT license.');
assert(index.includes('codeCompare'), 'Homepage must include the focused code proof.');
assert(index.includes('data-testid="landing-java-code"'), 'Homepage code proof must expose a stable Java code hook.');
assert(index.includes('pre className="language-java"') && index.includes('code className="language-java"'), 'Homepage code proof must render as a semantic Java code block.');
assert(index.includes('styles.codeKeyword') && index.includes('styles.codeCall') && index.includes('styles.codeString'), 'Homepage Java sample must use syntax token styling.');
assert(index.includes('assertThat</span>(orderStatus)'), 'Homepage code sample must use real SHAFT fluent validation chaining.');
assert(!index.includes('click(checkout);'), 'Homepage must not show fake pseudo-code.');
assert(!index.includes('attach evidence;'), 'Homepage must not show fake pseudo-code.');
assert(!index.includes('firstRunNoOpenCommand') && !index.includes('mvn test'), 'Homepage must not render the first-run mvn test command strip.');
assert(!/plumbing/i.test(index), 'Homepage must use boilerplate-code language instead of plumbing language.');
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
assert(index.indexOf('Maven Central') === index.lastIndexOf('Maven Central'), 'Homepage should not duplicate trust-link groups.');
assert(!index.includes('40,000'), 'Homepage must not contain unsupported adoption claims.');
assert(index.includes('data-testid="landing-hero"'), 'Homepage must expose a stable hero test hook.');
assert(index.includes('data-testid="landing-pathfinder"'), 'Homepage must expose a guide pathfinder hook.');
assert(index.includes('data-testid="landing-agent"'), 'Homepage must expose an agent-section test hook.');
assert(index.includes('data-testid="landing-final"'), 'Homepage must expose final CTA test hook.');
assert(index.includes('data-testid="landing-main"'), 'Homepage must expose a main-content test hook.');
assert(index.includes('landing-hero-quickstart-cta'), 'Landing hero should expose quick-start CTA hook.');
assert(index.includes('data-testid="landing-cta-install"'), 'Landing final CTA should expose install hook.');
assert(index.includes('data-testid="landing-cta-quickstart"'), 'Landing final CTA should expose quick-start hook.');
assert(index.includes('data-testid="landing-cta-star"'), 'Landing final CTA should ask successful evaluators to star the project.');
assert(index.includes('data-testid="landing-cta-slack"') && index.includes('faSlack'), 'Landing final CTA should link to Slack with a Slack icon.');
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
assert(styles.includes('@media (max-width: 760px)'), 'Homepage must include a mobile layout.');
assert(styles.includes("data-reveal-state='rolled-back'"), 'Homepage must include rollback styling for reversible scroll reveal.');
assert(styles.includes('.heroParticles') && styles.includes('.finalParticles'), 'Homepage must keep particle backgrounds.');
assert(!styles.includes('font-weight: 800'), 'Landing styles must use approved font-weight tokens instead of 800.');
assert(styles.includes('font-weight: var(--site-font-weight-bold)'), 'Landing styles must use the shared bold weight token.');
assert(!styles.includes('#061b22') && !styles.includes('#f7d47b') && !styles.includes('#f8fbfe'), 'Landing reusable colors must use site tokens instead of raw hex values.');
assert(!customStyles.includes('--landing-'), 'Unused landing token aliases should not duplicate the site token system.');
assert(styles.includes('max-width: 780px'), 'Landing CTA buttons must use a compact shared grid width.');
assert(styles.includes('grid-column: 2'), 'Landing project CTA must keep the same width as the other CTA buttons.');
assert(styles.includes('grid-template-rows: 1.8rem 3rem 1fr'), 'Evidence loop cards must align number, title, and body rows.');
assert(styles.includes('.codeAnnotation') && styles.includes('.codeKeyword') && styles.includes('.codeCall'), 'Homepage Java code block must define token styles.');
assert(!styles.includes('overflow-x: auto'), 'Homepage must not create a horizontal scroller.');

console.log('Homepage content, evidence, and accessibility checks passed.');
