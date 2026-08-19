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

const localAi = section('## Preview managed local AI');
const localAiText = localAi.replace(/\s+/g, ' ');
for (const fact of [
  'defaults to `false`',
  'SHAFT_USER_CACHE',
  'explicit reviewed plan; pin-bound; no silent float',
  'owner-manifest only; unknown siblings preserved',
  'deterministic SHAFT result remains authoritative',
  'shaft-cli setup status --profile LOCAL_AI --mode MANAGED',
  'shaft-cli setup verify --profile LOCAL_AI --mode MANAGED',
  'setup_verify',
  'shaft-cli doctor local-ai-status',
  'doctor_managed_local_ai_status',
  'enablement, eligibility, and the DISABLED snapshot',
  'do not list the reviewed pin table',
  'normal Maven never provisions or downloads',
  '-Dallure.automaticallyOpen=false',
  'b10400',
  '23749fefcc72300e3a2ad315e1317431b06b590a',
  '639446688',
  '`MIT` / `Apache-2.0`',
  'target readiness version detail',
  'empty unless READY',
  'documented inventory',
  'readiness/version/action',
]) {
  assert(localAiText.includes(fact), `The managed local AI section must document ${fact}.`);
}
assert(
  /pin table on (?:the|this) page is the documented inventory/.test(localAiText),
  'The pin table on the page is the documented inventory; commands do not print it.',
);
assert(
  /`setup status` and `setup verify` print `target readiness version detail`/.test(localAiText),
  'setup status and setup verify print target readiness version detail, not the pin table.',
);
assert(
  !/`setup status` and `setup verify` list the reviewed pin/.test(localAiText),
  'Do not say setup status/verify list the reviewed pin table when disabled.',
);
assert(
  !/list the reviewed pin even when the cache is missing or the feature is still disabled/.test(localAiText),
  'Disabled or missing-cache setup status/verify still print target readiness version detail, not the pin table.',
);
assert(
  !/Setup status and verify diagnostics include reviewed runtime and model identity, licenses, provenance/.test(localAiText),
  'Do not say setup status/verify diagnostics list revision, license, provenance, size, floors, update, cleanup, or fallback.',
);
assert(
  !/`setup status`, `setup verify`, and `doctor local-ai-status` list the reviewed/.test(localAiText),
  'Doctor/MCP doctor managed-local status must not be said to list the reviewed pin table.',
);

const doctor = read('docs/agentic/doctor.mdx');
const providers = read('docs/agentic/providers.md');
const heal = read('docs/agentic/heal.mdx');
const capture = read('docs/agentic/capture.md');
const cli = read('docs/agentic/cli.md');
const intellij = read('docs/agentic/intellij.md');
const mcp = read('docs/agentic/mcp.mdx');
for (const [name, body] of [
  ['Doctor', doctor],
  ['providers', providers],
  ['Heal', heal],
  ['Capture', capture],
  ['CLI', cli],
  ['IntelliJ', intellij],
  ['MCP', mcp],
]) {
  assert(
    body.includes('/docs/start/local-infrastructure#inventory-defaults-and-troubleshooting'),
    `${name} must link to the managed local AI inventory and troubleshooting section.`,
  );
}
assert(
  !/Feed an approved proposal into the separate Doctor\s+CLI `propose-fix` \/ `publish-draft-pr`/.test(heal),
  'Heal must not imply healing manifests feed directly into propose-fix / publish-draft-pr.',
);
assert(
  !/publish-draft-pr --manifest <healing/.test(heal)
    && !/publish-draft-pr`[^`\n]*healing-/.test(heal),
  'Heal must not show publish-draft-pr against healing-*.json manifests.',
);
assert(
  /repair-input\.json/.test(heal)
    && /repair-proposal-/.test(heal)
    && /`patch`/.test(heal)
    && /doctor analyze/.test(heal)
    && /propose-fix/.test(heal),
  'Heal must document mapping proposal.patch into repair-input.json, then analyze + propose-fix, then publish the repair manifest.',
);
const collapse = (body) => body.replace(/\s+/g, ' ');
const setupListsPin = (body) => [
  'list the reviewed pin inventory',
  'list the reviewed inventory',
  'list the reviewed pin even when',
  'list the reviewed pin table (revision',
  '`setup_status`, `setup_verify` list inventory',
  'setup_status`, `setup_verify` list inventory',
  'Status and setup list the reviewed',
  'diagnostics include reviewed runtime and model',
  'inventory through `setup_status` and `setup_verify`',
  'for the reviewed pin, storage class',
].some((lie) => collapse(body).includes(lie));
assert(
  collapse(cli).includes('shaft-cli setup verify --profile LOCAL_AI --mode MANAGED'),
  'CLI must send readiness checks to setup status and setup verify.',
);
assert(
  collapse(cli).includes('target readiness version detail')
    && /empty unless READY/.test(collapse(cli))
    && /enablement, eligibility, and the DISABLED snapshot/.test(collapse(cli))
    && !setupListsPin(cli)
    && !/doctor local-ai-status` list the reviewed inventory/.test(collapse(cli)),
  'CLI must not say setup status/verify list the pin table; doctor reports enablement/DISABLED only.',
);
assert(
  /local-processing consent/.test(collapse(cli))
    && /not remote consent or tool approval/.test(collapse(cli)),
  'CLI must say enablement is local-processing consent, not remote consent or tool approval.',
);
assert(
  mcp.includes('setup_verify')
    && /enablement, eligibility, and the DISABLED snapshot/.test(collapse(mcp))
    && !setupListsPin(mcp)
    && !/inventory through `doctor_managed_local_ai_status`/.test(collapse(mcp)),
  'MCP setup_status/setup_verify report readiness; doctor reports enablement/DISABLED only.',
);
assert(
  /enablement, eligibility, and the DISABLED snapshot/.test(collapse(doctor))
    && !setupListsPin(doctor)
    && !/Inspect the reviewed pin[\s\S]{0,160}doctor local-ai-status/.test(doctor)
    && !/Use `setup status` or `setup verify` for the reviewed pin/.test(doctor),
  'Doctor must not say setup status/verify list the pin table; its status is enablement/DISABLED only.',
);
assert(
  intellij.includes('setup_verify')
    && /DISABLED snapshot/.test(intellij)
    && /target readiness version detail/.test(intellij)
    && !setupListsPin(intellij),
  'IntelliJ must separate setup readiness/version/action from the doctor DISABLED snapshot.',
);
assert(
  /local-processing consent/.test(collapse(intellij))
    && /not remote consent or tool approval/.test(collapse(intellij)),
  'IntelliJ must say enablement is local-processing consent, not remote consent or tool approval.',
);
assert(
  !/Status and setup list the reviewed revision/.test(providers)
    && !setupListsPin(providers),
  'Providers must not say Status/setup list the reviewed pin-table fields.',
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
