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
assert(index.includes('/docs/start/quick-start'), 'Homepage must expose the quick-start CTA.');
assert(index.includes('/docs/agentic/mcp'), 'Homepage must expose MCP setup.');
assert(index.includes('<McpApplications />'), 'Homepage must render the shared MCP applications.');
assert(
  snippets.mcpInstaller.commandTemplates.windows.includes('Install-ShaftMcp -Client {client}')
    && snippets.mcpInstaller.commandTemplates.macos.includes('install-shaft-mcp.sh')
    && snippets.mcpInstaller.commandTemplates.linux.includes('sh -s -- {agentFlag}')
    && snippets.mcpInstaller.applications.length === 6,
  'MCP installer data must expose OS-specific standalone commands for every supported application.',
);
assert(index.includes('Maven Central'), 'Homepage claims must link to evidence.');
assert(!index.includes('40,000'), 'Homepage must not contain unsupported adoption claims.');
assert(styles.includes('prefers-reduced-motion: reduce'), 'Homepage must respect reduced motion.');
assert(styles.includes('@media (max-width: 620px)'), 'Homepage must include a mobile layout.');
assert(!styles.includes('overflow-x: auto'), 'Homepage must not create a horizontal workflow scroller.');

console.log('Homepage content, evidence, and accessibility checks passed.');
