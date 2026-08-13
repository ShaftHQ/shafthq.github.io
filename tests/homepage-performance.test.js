const fs = require('fs');
const os = require('os');
const path = require('path');
const {execFileSync} = require('child_process');

const index = fs.readFileSync(path.join(__dirname, '..', 'src', 'pages', 'index.tsx'), 'utf8');
const styles = fs.readFileSync(path.join(__dirname, '..', 'src', 'pages', 'index.module.css'), 'utf8');
const customStyles = fs.readFileSync(path.join(__dirname, '..', 'src', 'css', 'custom.css'), 'utf8');
const config = fs.readFileSync(path.join(__dirname, '..', 'docusaurus.config.js'), 'utf8');
const particleBackgroundPath = path.join(__dirname, '..', 'src', 'components', 'ParticleBackground', 'index.tsx');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(index.includes('Reliable automation evidence for every release.'), 'Homepage must lead with a mature reliability proposition.');
assert(index.includes('One Java framework for web, mobile, API, database, and CLI testing.'), 'Homepage must state the product scope plainly.');
assert(index.includes('Generate a free project'), 'Homepage hero must use the free generator CTA.');
assert(index.includes('data-testid="landing-hero-generator-cta"') && index.includes('to="/project-generator"'), 'Homepage generator CTA must expose a stable hook and link directly to the generator.');
assert(index.includes('No account. No payment details.'), 'Homepage must remove adoption ambiguity beside the primary CTA.');
assert(index.includes('ready-to-run Maven project') && index.includes('first evidence report'), 'Homepage must state what the generator produces and the next successful outcome.');
assert(index.includes('className={styles.heroLogo}') && index.includes('src="/img/shaft.svg"'), 'Homepage hero must make the S identity prominent.');
assert(index.includes('landing-hero-star-cta'), 'Homepage hero must expose a GitHub star CTA hook.');
assert(index.includes('Star on GitHub'), 'Homepage hero must ask successful evaluators to star the project.');
assert(!index.includes('landing-command-center'), 'Homepage hero must not render the redundant command-center block.');
assert(!index.includes('landing-hero-signals'), 'Homepage hero must not render the redundant signal block.');
assert(index.includes('landing-audience-split'), 'Homepage must expose the engineer/leader section below the hero.');
assert(index.includes('landing-surface-matrix'), 'Homepage must expose the surface coverage matrix.');
assert(index.includes('landing-evidence-loop'), 'Homepage must expose the evidence loop chart.');
assert(index.includes('landing-allure-evidence'), 'Homepage must expose the Allure evidence visual.');
for (const image of [
  '/img/allure-shaft-overview-panel.png',
  '/img/capture-locator-picker.png',
  '/img/agentic/intellij-plugin-assistant.png',
]) {
  assert(index.includes(image), `Homepage must render the real SHAFT product image ${image}.`);
}
assert(!index.includes('/img/allure3_main_light.png'), 'Homepage must not use the generic third-party Allure screenshot.');
assert(index.includes('width={1600}') && index.includes('height={1000}'), 'Homepage must reserve dimensions for the SHAFT Overview proof image.');
assert((index.match(/loading="lazy"/g) || []).length >= 2, 'Below-fold product screenshots must lazy-load.');
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
assert(index.includes('/project-generator'), 'Homepage must link directly to the free project generator.');
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
for (const signal of ['MIT license', 'Build history', 'Security policy', 'Release history', 'Selenium ecosystem', 'Google Open Source Peer Bonus', 'Community support']) {
  assert(index.includes(signal), `Homepage trust evidence must include ${signal}.`);
}
assert(index.includes('data-testid="landing-adoption-answers"'), 'Homepage must answer adoption-risk questions in a dedicated section.');
assert(index.includes('Move an existing suite') && index.includes('Run where your team already builds') && index.includes('Extend without replacing native tools'), 'Homepage must address migration, execution, and extension risk.');
assert(!/trusted by|enterprise-ready|customers|\d+[,+]\s*(teams|companies|users)/i.test(index), 'Homepage must not invent customer, enterprise, or adoption claims.');
assert(config.includes("content: siteAsset('/img/shaft-social-card.png')"), 'Open Graph metadata must use the deterministic SHAFT product social card.');
assert(/property: 'og:image:width',[\s\S]{0,80}content: '1200'/.test(config), 'Open Graph metadata width must match the 1200px shipped card.');
assert(/property: 'og:image:height',[\s\S]{0,80}content: '630'/.test(config), 'Open Graph metadata height must match the 630px shipped card.');
const socialCardPath = path.join(__dirname, '..', 'static', 'img', 'shaft-social-card.png');
assert(fs.existsSync(socialCardPath), 'The Open Graph social card referenced by metadata must be shipped.');
const socialCard = fs.readFileSync(socialCardPath);
assert(socialCard.subarray(0, 8).toString('hex') === '89504e470d0a1a0a', 'The shipped social card must have the complete PNG signature.');
assert(socialCard.readUInt32BE(16) === 1200 && socialCard.readUInt32BE(20) === 630, 'The shipped social card must be exactly 1200x630.');
const socialCardGenerator = fs.readFileSync(path.join(__dirname, '..', 'scripts', 'generate-homepage-social-card.mjs'), 'utf8');
assert(!/chromium|font-family|Arial|Helvetica|Consolas/.test(socialCardGenerator), 'Social-card bytes must not depend on a browser or host-installed font renderer.');
const socialCardTempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'shaft-social-card-'));
try {
  const generatorPath = path.join(__dirname, '..', 'scripts', 'generate-homepage-social-card.mjs');
  const inspectPng = (file) => JSON.parse(execFileSync(process.execPath, [generatorPath, '--inspect', file], {encoding: 'utf8'}));
  const regeneratedPath = path.join(socialCardTempDir, 'regenerated.png');
  execFileSync(process.execPath, [generatorPath, regeneratedPath]);
  const shippedPixels = inspectPng(socialCardPath);
  const regeneratedPixels = inspectPng(regeneratedPath);
  assert(shippedPixels.width === 1200 && shippedPixels.height === 630 && shippedPixels.bitDepth === 8 && shippedPixels.colorType === 6, 'The shipped social card must decode as 1200x630 8-bit RGBA.');
  assert(
    shippedPixels.width === regeneratedPixels.width &&
      shippedPixels.height === regeneratedPixels.height &&
      shippedPixels.bitDepth === regeneratedPixels.bitDepth &&
      shippedPixels.colorType === regeneratedPixels.colorType,
    'The shipped social card dimensions and PNG color format must match generated output.',
  );
  assert(shippedPixels.pixelHash === regeneratedPixels.pixelHash, 'The shipped social card must pixel-match generated RGBA output.');
  const recompressedPath = path.join(socialCardTempDir, 'recompressed.png');
  execFileSync(process.execPath, [generatorPath, '--reencode', regeneratedPath, recompressedPath, '1']);
  assert(!fs.readFileSync(regeneratedPath).equals(fs.readFileSync(recompressedPath)), 'The compression mutation must produce different PNG bytes.');
  assert(inspectPng(recompressedPath).pixelHash === regeneratedPixels.pixelHash, 'Equivalent PNG compression must preserve the decoded pixel contract.');
  const pixelMutatedPath = path.join(socialCardTempDir, 'pixel-mutated.png');
  execFileSync(process.execPath, [generatorPath, '--mutate-first-pixel', regeneratedPath, pixelMutatedPath]);
  assert(inspectPng(pixelMutatedPath).pixelHash !== regeneratedPixels.pixelHash, 'A decoded-pixel mutation must fail the social-card pixel contract.');
} finally {
  fs.rmSync(socialCardTempDir, {recursive: true, force: true});
}
assert(index.indexOf('Maven Central') === index.lastIndexOf('Maven Central'), 'Homepage should not duplicate trust-link groups.');
assert(!index.includes('40,000'), 'Homepage must not contain unsupported adoption claims.');
assert(index.includes('data-testid="landing-hero"'), 'Homepage must expose a stable hero test hook.');
assert(index.includes('data-testid="landing-pathfinder"'), 'Homepage must expose a guide pathfinder hook.');
assert(index.includes('data-testid="landing-agent"'), 'Homepage must expose an agent-section test hook.');
assert(index.includes('data-testid="landing-final"'), 'Homepage must expose final CTA test hook.');
assert(index.includes('data-testid="landing-main"'), 'Homepage must expose a main-content test hook.');
assert(index.includes('landing-hero-quickstart-cta'), 'Landing hero should expose quick-start CTA hook.');
assert(index.includes('data-testid="landing-cta-generator"'), 'Landing final CTA should expose generator hook.');
assert(!index.includes('data-testid="landing-cta-quickstart"'), 'Landing final CTA should not duplicate the hero quick-start CTA (#898 finding 2).');
assert(index.includes('data-testid="landing-cta-star"'), 'Landing final CTA should repeat the secondary GitHub star path after proof.');
assert(index.includes('data-testid="landing-cta-slack"') && index.includes('faSlack'), 'Landing final CTA should link to Slack with a Slack icon.');
assert(index.includes('data-testid="landing-hero-star-cta"'), 'Landing hero must keep a star CTA hook, demoted into the trust-links row (#898 finding 1).');
assert(!index.includes('Star SHAFT on GitHub.'), 'Landing final CTA heading must not contradict its own primary button (#898 finding 3).');
assert(!index.includes('After the sample test produces evidence, star the repository'), 'Landing final CTA must not gate starring on success (#898 finding 3/4).');
assert(!index.includes('never gated behind proving anything first'), 'Landing leader bullet must not describe the site\'s own CTA policy (#898 finding 4a).');
assert(!index.includes('Inspect Allure and star SHAFT'), 'Guided path #5 must not duplicate the star ask (#898 finding 4b).');
assert(!index.includes('Star after success'), 'Guided path #5 must not gate starring on success (#898 finding 4b).');
assert(!index.includes("String(index + 1).padStart(2, '0')} ·"), 'Guided path cards must not imply a mutually-exclusive sequence with 01..05 numbering (#898 finding 6).');
assert(index.includes("String(index + 1).padStart(2, '0')"), 'Evidence loop must keep its genuinely-sequential 01..05 numbering (#898 finding 6).');
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
assert(!index.includes('ParticleBackground') && !index.includes('BrowserOnly'), 'Homepage must not load decorative particle runtime code.');
assert(!styles.includes('.heroParticles') && !styles.includes('.finalParticles'), 'Homepage must remove particle-only styles.');
assert(!fs.existsSync(particleBackgroundPath), 'Dead ParticleBackground component must be deleted after its final caller is removed.');
assert(!styles.includes('font-weight: 800'), 'Landing styles must use approved font-weight tokens instead of 800.');
assert(styles.includes('font-weight: var(--site-font-weight-bold)'), 'Landing styles must use the shared bold weight token.');
assert(!styles.includes('#061b22') && !styles.includes('#f7d47b') && !styles.includes('#f8fbfe'), 'Landing reusable colors must use site tokens instead of raw hex values.');
assert(!customStyles.includes('--landing-'), 'Unused landing token aliases should not duplicate the site token system.');
assert(customStyles.includes('--site-anchor-offset: calc(var(--ifm-navbar-height) + 1rem)'), 'Anchor offset must track the sticky navbar height.');
assert(customStyles.includes('scroll-margin-top: var(--site-anchor-offset)'), 'Doc anchor targets must stay visible below the sticky navbar.');
assert(styles.includes('max-width: 560px'), 'Landing CTA buttons must use a compact shared grid width for the two-action hero/final layout (#898 finding 1).');
assert(!styles.includes("[data-testid='landing-hero-install-cta']"), 'Landing hero CTA grid must not need a column override once only two actions remain (#898 finding 1).');
assert(
  styles.includes('.evidenceLoop {') && /\.evidenceLoop \{[^}]*grid-template-rows: auto auto 1fr;/.test(styles),
  'Evidence loop must define its row tracks on the parent grid so subgrid children can align number, title, and body rows (#898 finding 20).',
);
assert(styles.includes('.codeAnnotation') && styles.includes('.codeKeyword') && styles.includes('.codeCall'), 'Homepage Java code block must define token styles.');
assert(!styles.includes('overflow-x: auto'), 'Homepage must not create a horizontal scroller.');

// #898 P2 fast-follow
assert(index.indexOf('<Hero />') > index.indexOf('<main'), 'Hero (the page\'s only <h1> and all hero CTAs) must render inside <main> so "Skip to main content" reaches it (#898 finding 10).');
const reducedMotionBlock = styles.slice(styles.indexOf('@media (prefers-reduced-motion: reduce)'));
assert(
  /\.pathCard,\s*\.loopStep\s*\{\s*opacity: 1;/.test(reducedMotionBlock),
  'Reduced motion must neutralize .loopStep hover-lift alongside .pathCard/.proofCard (#898 finding 12).',
);
assert(
  /\.pathCard:hover,\s*\.loopStep:hover\s*\{\s*transform: none;/.test(reducedMotionBlock),
  'Reduced motion must neutralize .loopStep:hover transform (#898 finding 12).',
);
assert(
  /\.hoverGlow\[data-hover-glow\]::before\s*\{\s*transition: none;\s*transform: none;/.test(reducedMotionBlock),
  'Reduced motion must stop the hover-glow scale/opacity animation (#898 finding 13).',
);
assert(!index.includes('revealElements.forEach((element, index) => {'), 'Reveal stagger must not compute delay from a global document-order index (#898 finding 15).');
assert(index.includes('.indexOf(element)'), 'Reveal stagger must compute delay from each element\'s position within its own group (#898 finding 15).');
assert(
  !fs.existsSync(path.join(__dirname, '..', 'src', 'components', 'ParticleBackground', 'particleWorker.ts')),
  'Dead particleWorker.ts file must be deleted (#898 finding 24).',
);

// #898 P2 remainder (findings 7, 8, 11, 14, 16, 17, 19, 20, 21)
const revealRuleMatch = styles.match(/:global\(html\[data-reveal-ready='true'\]\) \.reveal \{[^}]*\}/);
assert(revealRuleMatch, 'Homepage must define the base .reveal rule under html[data-reveal-ready].');
assert(
  !revealRuleMatch[0].includes('will-change'),
  'Homepage must not permanently pin a compositor layer on ~20 reveal elements via will-change (#898 finding 16).',
);
assert(
  styles.includes("content: '>' / ''"),
  '.loopStep::after chevron must use the alt-text form so it is not announced by screen readers (#898 finding 11).',
);
assert(
  styles.includes("content: '+' / ''"),
  '.handledPanel li::before marker must use the alt-text form so it is not announced by screen readers (#898 finding 11).',
);
assert(
  !/(?<!min-)height: 3\.45rem;/.test(styles),
  'Landing CTA buttons must not fix a height that the same rule permits their label to wrap past (#898 finding 21).',
);
assert(
  !index.includes("target.getBoundingClientRect()") || index.includes('pointerenter'),
  'useHoverGlow must cache the target rect on pointerenter instead of forcing layout on every pointermove (#898 finding 17).',
);
assert(
  index.includes("addEventListener('pointerenter'"),
  'useHoverGlow must attach a pointerenter listener to cache each target\'s rect once per hover (#898 finding 17).',
);
assert(
  styles.slice(styles.indexOf('@media (max-width: 1180px)'), styles.indexOf('@media (max-width: 980px)')).includes('.pathGrid'),
  'A 1180px breakpoint must give the 5-column path/loop/badge grids an intermediate 2-column step before the 980px single-column collapse (#898 finding 19).',
);
assert(
  styles.includes('grid-template-rows: subgrid'),
  '.audienceLane/.loopStep must use subgrid rows so cross-card alignment survives content/type-scale changes without a fixed-height overflow risk (#898 finding 20).',
);
assert(
  index.includes('data-testid="landing-evidence-loop-return"'),
  'The evidence loop must render a closing "back to Execute" affordance so it reads as a loop, not a terminating chain (#898 finding 7).',
);
assert(
  /back to Execute/i.test(index),
  'The loop-closing affordance must name the step it returns to (#898 finding 7).',
);
assert(
  index.includes('data-testid="landing-dependency-snippet"'),
  'Homepage must render a copyable Maven dependency coordinate for evaluating engineers (#898 finding 8).',
);
assert(
  index.includes("import releases from '@site/src/data/releases.json'") && index.includes('releases.engineVersion'),
  'The dependency snippet must source its version from releases.json, not a hardcoded literal (#898 finding 8).',
);
assert(
  !/<version>10\.\d/.test(index),
  'The dependency snippet must not hardcode a literal engine version in index.tsx (#898 finding 8).',
);
assert(
  index.indexOf('Maven Central') === index.lastIndexOf('Maven Central'),
  'Homepage should still not duplicate the Maven Central trust link after adding the dependency snippet (#898 finding 8 test impact).',
);
assert(
  styles.includes('min-height: 3.45rem;'),
  'Landing CTA buttons must use min-height so two-line labels do not overflow their own box (#898 finding 21).',
);

// #898 P3 (findings 23, 25, 26, 27, 28, 29)
function countStandaloneRule(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(^|\\n)${escaped} \\{`, 'g');
  return (styles.match(re) || []).length;
}
for (const selector of ['.pathCard small', '.loopStep small', '.footerBadges strong', '.finalKicker', '.proofGrid', '.proofCard']) {
  assert(
    countStandaloneRule(selector) === 1,
    `${selector} must be declared in a single block instead of split across distant duplicates in the same file (#898 finding 25). Found ${countStandaloneRule(selector)} standalone occurrences.`,
  );
}

assert(
  !styles.includes(':global(.button)::after'),
  'Hero/final CTA buttons must not render a dead optical-centring ::after spacer (#898 finding 26).',
);
const heroButtonRuleMatch = styles.match(/\.hero \.actions :global\(\.button\),\s*\n\.finalCta \.actions :global\(\.button\) \{[^}]*\}/);
assert(heroButtonRuleMatch, 'Hero/final CTA shared button rule must still exist.');
assert(
  !heroButtonRuleMatch[0].includes('text-align: center'),
  'Hero/final CTA buttons must not carry a dead text-align: center once left-aligned icon+label is the real intent (#898 finding 26).',
);
assert(
  !/\.actions a \{\s*\n\s*text-align: center;\s*\n\s*\}/.test(styles),
  'Mobile CTA links must not carry a dead text-align: center (#898 finding 26).',
);

const bareHoverGlowSelectors = (styles.match(/\[data-hover-glow\]/g) || []).length;
const scopedHoverGlowSelectors = (styles.match(/\.hoverGlow\[data-hover-glow\]/g) || []).length;
assert(bareHoverGlowSelectors > 0, 'Homepage must still define [data-hover-glow] styling.');
assert(
  bareHoverGlowSelectors === scopedHoverGlowSelectors,
  `Every [data-hover-glow] CSS selector must be scoped under a .hoverGlow module class so it cannot leak globally out of this page's CSS module (#898 finding 27). ${bareHoverGlowSelectors} total, only ${scopedHoverGlowSelectors} scoped.`,
);
const hoverGlowAttrUsages = (index.match(/data-hover-glow(?=[ >])/g) || []).length;
const hoverGlowClassUsages = (index.match(/styles\.hoverGlow\b/g) || []).length;
assert(
  hoverGlowAttrUsages > 0 && hoverGlowClassUsages === hoverGlowAttrUsages,
  `Every data-hover-glow element must also carry the styles.hoverGlow class so the scoped CSS selector actually matches it (#898 finding 27). ${hoverGlowAttrUsages} attribute usages, ${hoverGlowClassUsages} class usages.`,
);

const codeTokenClasses = ['codeAnnotation', 'codeKeyword', 'codeCall', 'codeFunction', 'codeString'];
const codeTokenColors = new Map();
for (const cls of codeTokenClasses) {
  const match = styles.match(new RegExp(`\\.${cls} \\{[^}]*color: ([^;]+);`));
  assert(match, `.${cls} must declare its own color rule (#898 finding 28).`);
  codeTokenColors.set(cls, match[1].trim());
}
assert(
  new Set(codeTokenColors.values()).size === 5,
  `Java code sample's 5 token classes must resolve to 5 distinct colors, not 3, so each class carries a distinct meaning (#898 finding 28). Got: ${[...codeTokenColors.entries()].map(([k, v]) => `${k}=${v}`).join(', ')}`,
);

assert(
  index.includes('id="audience-section"'),
  'AudienceSection must expose a stable anchor matching its sibling sections (#898 finding 23).',
);
assert(
  index.includes('<h3>{lane.title}</h3>') && !index.includes('<h2>{lane.title}</h2>'),
  'Audience lane titles must render as <h3> now that AudienceSection has its own section-level <h2>, so the heading outline is not promoted (#898 finding 23).',
);

for (const href of [
  'https://central.sonatype.com/artifact/io.github.shafthq/shaft-engine',
  'https://www.selenium.dev/ecosystem/#frameworks',
  'https://opensource.googleblog.com/2023/05/google-open-source-peer-bonus-program-announces-first-group-of-winners-2023.html',
]) {
  assert(index.includes(`href: '${href}'`), `Expected trustSignals to contain ${href}.`);
}
assert(
  index.includes('href={signal.href} target="_blank" rel="noreferrer"'),
  'Every source-backed trust signal must open safely in a new tab.',
);
for (const href of [
  'https://github.com/ShaftHQ/SHAFT_ENGINE/discussions',
  'https://github.com/ShaftHQ/SHAFT_ENGINE/blob/main/LICENSE',
]) {
  const hrefAttr = `href="${href}"`;
  const hrefIndex = index.indexOf(hrefAttr);
  assert(hrefIndex !== -1, `Expected an <a> tag with href ${href}.`);
  const tagStart = index.lastIndexOf('<a', hrefIndex);
  const tagEnd = index.indexOf('>', hrefIndex);
  const tag = index.slice(tagStart, tagEnd + 1);
  assert(
    tag.includes('target="_blank"') && tag.includes('rel="noreferrer"'),
    `External link to ${href} must open in a new tab with rel=noreferrer, matching the hero/final-CTA policy (#898 finding 29).`,
  );
}
const githubFooterLinkMatch = index.match(/<a href=\{snippets\.githubRepository\}[^>]*>[\s\S]{0,20}GitHub[\s\S]{0,120}<\/a>/);
assert(githubFooterLinkMatch, 'Expected the footer GitHub link.');
assert(
  githubFooterLinkMatch[0].includes('target="_blank"') && githubFooterLinkMatch[0].includes('rel="noreferrer"'),
  'Footer GitHub link must open in a new tab with rel=noreferrer, matching the hero/final-CTA policy (#898 finding 29).',
);
assert(index.includes('faArrowUpRightFromSquare'), 'Homepage must import an external-link affordance icon (#898 finding 29).');
const arrowIconUsages = (index.match(/faArrowUpRightFromSquare/g) || []).length - 1;
assert(
  (index.match(/icon: true/g) || []).length === 3 && arrowIconUsages === 4,
  'Homepage must mark three trust links plus all three external footer links with the external-link affordance.',
);

assert(
  !/<Link className=\{styles\.heroBrand\}/.test(index),
  'The homepage should not render a self-referential Link from / to / for the SHAFT wordmark (#898 finding 29).',
);
assert(
  index.includes('<span className={styles.heroBrand}>SHAFT</span>'),
  'The SHAFT wordmark must render as a non-interactive element on the homepage it already represents (#898 finding 29).',
);

assert(
  index.includes("const heroMeta = ['io.github.shafthq : shaft-engine'];"),
  'heroMeta must not restate Java 25/MIT/Allure native, which footerBadges already states with more detail (#898 finding 29).',
);

assert(
  /\.allureGrid \.sectionHeading \{\s*\n\s*margin-bottom: 0;\s*\n\}/.test(styles),
  '.allureGrid .sectionHeading must zero its bottom margin so the heading block is not pushed above vertical center relative to the image (#898 finding 29).',
);

assert(!styles.includes('.heroGrid'), '.heroGrid must be renamed since it is display: block, not a grid (#898 finding 29).');
assert(styles.includes('.heroLayout'), 'Renamed hero layout class must exist (#898 finding 29).');
assert(!index.includes('styles.heroGrid'), 'index.tsx must use the renamed heroLayout class (#898 finding 29).');

assert(
  !index.includes('SHAFT keeps Selenium, Playwright, Appium, and REST Assured visible while'),
  'Hero sub-copy must not name four products in a dense 32-word second sentence; let the bolded lead sentence carry the message (#898 finding 29).',
);

console.log('Homepage content, evidence, and accessibility checks passed.');
