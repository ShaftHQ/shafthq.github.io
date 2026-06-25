const fs = require('fs');
const path = require('path');

const index = fs.readFileSync(path.join(__dirname, '..', 'src', 'pages', 'index.tsx'), 'utf8');
const styles = fs.readFileSync(path.join(__dirname, '..', 'src', 'pages', 'index.module.css'), 'utf8');
const snippets = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'snippets.json'), 'utf8'),
);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(index.includes('shaft-automation-hero.png'), 'Homepage must use the optimized branded hero.');
assert(index.includes('shaft-automation-hero.webp'), 'Homepage must serve a smaller WebP hero image when supported.');
assert(index.includes('media="(max-width: 620px)"'), 'Homepage must avoid loading the hidden hero image on mobile.');
assert(index.includes('width="1200"') && index.includes('height="676"'), 'Homepage hero dimensions must match the optimized image.');
assert(index.includes('decoding="async"'), 'Homepage hero image decoding must be async.');
assert(index.includes('fetchPriority="high"'), 'Homepage hero image must prioritize the first-viewport image.');
assert(index.includes('/docs/start/quick-start'), 'Homepage must expose the quick-start CTA.');
assert(index.includes('/docs/agentic/mcp'), 'Homepage must expose MCP setup.');
assert(
  index.includes('data-testid="landing-cta-agent"') && index.includes('href="#connect-ai-agent"'),
  'Homepage AI-agent CTA must scroll to the landing-page agent section.',
);
assert(index.includes('id="connect-ai-agent"'), 'Homepage must expose a stable agent-section anchor.');
assert(index.includes('<McpApplications />'), 'Homepage must render the shared MCP applications.');
assert(
  snippets.mcpInstaller.commandTemplates.windows.includes('Install-ShaftMcp -Client {client}')
    && snippets.mcpInstaller.commandTemplates.macos.includes('install-shaft-mcp.sh')
    && snippets.mcpInstaller.commandTemplates.linux.includes('sh -s -- {agentFlag}')
    && snippets.mcpInstaller.applications.length === 5
    && snippets.mcpInstaller.applications.some((application) => application.id === 'copilot-intellij')
    && snippets.mcpInstaller.applications.every((application) => application.logo?.startsWith('/img/mcp-clients/')),
  'MCP installer data must expose OS-specific standalone commands for every supported application.',
);
assert(index.includes('Maven Central'), 'Homepage claims must link to evidence.');
assert(!index.includes('40,000'), 'Homepage must not contain unsupported adoption claims.');
assert(index.includes('data-testid="landing-hero"'), 'Homepage must expose a stable hero test hook.');
assert(index.includes('data-testid="landing-pathfinder"'), 'Homepage must expose a guide pathfinder hook.');
assert(index.includes('data-testid="landing-comparison"'), 'Homepage must expose comparison-section test hooks.');
assert(index.includes('data-testid="landing-agent"'), 'Homepage must expose an agent-section test hook.');
assert(index.includes('data-testid="landing-final"'), 'Homepage must expose final CTA test hook.');
assert(index.includes('data-testid="landing-main"'), 'Homepage must expose a main-content test hook.');
assert(index.includes('landing-hero-quickstart-cta'), 'Landing hero should expose quick-start CTA hook.');
assert(index.includes('data-testid="landing-cta-install"'), 'Landing final CTA should expose install hook.');
assert(index.includes('data-testid="landing-cta-quickstart"'), 'Landing final CTA should expose quick-start hook.');
assert(index.includes('data-testid="landing-cta-agent"'), 'Landing final CTA should expose AI-agent hook.');
assert(index.includes('hero-onboarding-step-1'), 'Landing hero should expose onboarding step 1 hook.');
assert(index.includes('hero-onboarding-step-2'), 'Landing hero should expose onboarding step 2 hook.');
assert(index.includes('hero-onboarding-step-3'), 'Landing hero should expose onboarding step 3 hook.');
assert(index.includes('hero-onboarding-step-4'), 'Landing hero should expose onboarding step 4 hook.');
assert(index.includes('id="proof-section"'), 'Landing proof section must expose a stable anchor.');
assert(index.includes('id="guide-paths"'), 'Landing guide path section must expose a stable anchor.');
assert(index.includes('id="surface-section"'), 'Landing surface section must expose a stable anchor.');
assert(index.includes('id="comparison-section"'), 'Landing comparison section must expose a stable anchor.');
assert(index.includes('id="workflow-section"'), 'Landing workflow section must expose a stable anchor.');
assert(index.includes('id="get-started"'), 'Landing final CTA must expose a stable anchor.');
assert(!index.includes('Use Playwright for browser-only suites.'), 'Homepage should not make unsupported blanket claims.');
assert(styles.includes('prefers-reduced-motion: reduce'), 'Homepage must respect reduced motion.');
assert(styles.includes('@media (max-width: 620px)'), 'Homepage must include a mobile layout.');
assert(!styles.includes('overflow-x: auto'), 'Homepage must not create a horizontal workflow scroller.');

console.log('Homepage content, evidence, and accessibility checks passed.');
