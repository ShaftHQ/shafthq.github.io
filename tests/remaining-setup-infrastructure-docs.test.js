const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

const infrastructure = read('docs/start/local-infrastructure.mdx');
const normalized = infrastructure.replace(/\s+/g, ' ');

assert(
  !/Provider-backed managed installation includes `REPORTING`,\s*`PLAYWRIGHT`, and `MOBILE_ANDROID`/.test(infrastructure),
  'The intro must not claim only REPORTING, PLAYWRIGHT, and MOBILE_ANDROID are provider-backed.',
);
for (const profile of [
  '`SELENIUM_GRID`',
  '`HEALENIUM`',
  '`REPORT_PORTAL`',
  '`BROWSERSTACK_LOCAL`',
  '`AGENT_TOOLS`',
]) {
  assert(
    infrastructure.includes(profile),
    `The infrastructure guide must name the shipped ${profile} profile.`,
  );
}
assert(
  infrastructure.includes('WEB_LOCAL'),
  'The infrastructure guide must state that WEB_LOCAL has no provider.',
);

for (const heading of [
  '## Install managed Selenium Grid',
  '## Install managed Healenium',
  '## Install managed ReportPortal',
  '## Install managed BrowserStack Local',
  '## Diagnose agent tools',
]) {
  assert(infrastructure.includes(heading), `The infrastructure guide is missing "${heading}".`);
}

const section = (heading) => {
  const start = infrastructure.indexOf(heading);
  assert(start >= 0, `Missing section ${heading}`);
  const next = infrastructure.indexOf('\n## ', start + heading.length);
  return infrastructure.slice(start, next === -1 ? undefined : next);
};
const grid = section('## Install managed Selenium Grid');
const healenium = section('## Install managed Healenium');
const reportPortal = section('## Install managed ReportPortal');
const browserStackLocal = section('## Install managed BrowserStack Local');
const agentTools = section('## Diagnose agent tools');
const iosWindows = section('## Install managed iOS and Windows Appium drivers');

for (const [name, body, facts] of [
  ['Grid', grid, ['4.47.0-20260808', 'shaft-selenium-grid', 'Docker 26.1.4+', 'not CLI flags']],
  ['Healenium', healenium, [
    'healenium/hlm-backend:3.4.6',
    'healenium/hlm-selector-imitator:1.4',
    'postgres:15.5-alpine',
    'shaft-healenium',
    'Docker 26.1.4+',
    'not CLI flags',
  ]],
  ['ReportPortal', reportPortal, ['shaft-reportportal', 'Docker 26.1.4+', 'not a CLI flag']],
  ['BrowserStack Local', browserStackLocal, [
    'BrowserStack Local v8.9',
    'BROWSERSTACK_ACCESS_KEY',
    'Linux ARM64',
  ]],
  ['agent tools', agentTools, [
    'agent-clients.json',
    'Java 25+',
    'Maven 3.9.0+',
    'Python 3.10+',
    'Node 20+',
    'does not install those host tools',
  ]],
  ['iOS/Windows', iosWindows, [
    'SHAFT_SETUP_IOS_ACCEPTANCE',
    'SHAFT_SETUP_IOS_UDID',
    'SHAFT_SETUP_WINDOWS_ACCEPTANCE',
    'do not change `shaft-cli setup start`',
  ]],
]) {
  for (const fact of facts) {
    assert(body.includes(fact), `The ${name} section must document ${fact}.`);
  }
}

for (const secret of ['rppass', 'erebus', 'YDk2nmNs4s9aCP6K', 'BROWSERSTACK_ACCESS_KEY=']) {
  assert(!infrastructure.includes(secret), `The infrastructure guide must not publish ${secret}.`);
}

assert(
  normalized.includes('never boot') || normalized.includes('does not boot'),
  'The infrastructure guide must say SHAFT does not boot the Simulator.',
);
assert(
  /never (launch|start|run)s? WinAppDriver|does not (launch|start|run) WinAppDriver/i.test(infrastructure),
  'The infrastructure guide must say SHAFT does not launch WinAppDriver.',
);
assert(
  !/--chrome/.test(infrastructure),
  'Do not invent a --chrome CLI flag; Grid scale is Java SetupSelection only.',
);

const locators = read('docs/reference/actions/GUI/Locators_And_Self_Healing.md');
assert(
  locators.includes('/docs/start/local-infrastructure#install-managed-healenium'),
  'The Healenium locators page must link to the managed Healenium setup flow.',
);
assert(
  /## Related[\s\S]*local-infrastructure#install-managed-healenium/.test(locators),
  'The Healenium locators Related list must include the managed setup page.',
);

const browserstack = read('docs/integrations/browserstack.md');
assert(
  browserstack.includes('/docs/start/local-infrastructure#install-managed-browserstack-local'),
  'The BrowserStack integration page must link to the managed Local tunnel setup flow.',
);
assert(
  /## Related[\s\S]*local-infrastructure#install-managed-browserstack-local/.test(browserstack),
  'The BrowserStack Related list must include the managed Local setup page.',
);

console.log('Remaining managed setup infrastructure documentation contract checks passed.');
