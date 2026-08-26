const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const index = fs.readFileSync(path.join(root, 'src', 'pages', 'index.tsx'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'src', 'pages', 'index.module.css'), 'utf8');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(index.includes('Release decisions backed by inspectable evidence.'), 'Homepage must lead with the approved evidence proposition.');
assert(index.includes('<main data-testid="landing-main">') && index.includes('<h1>Release decisions backed by inspectable evidence.</h1>'), 'Homepage must retain a semantic main landmark and one primary evidence proposition.');
assert(index.includes('landing-${suffix}-create-project') && index.includes('landing-${suffix}-documentation') && index.includes('landing-${suffix}-star'), 'Homepage must expose stable CTA hooks at both hero and final placements.');
for (const [href, label] of [['/project-generator', 'Create new project'], ['/docs/start/overview', 'Explore documentation'], ['https://github.com/ShaftHQ/SHAFT_ENGINE', 'Star on GitHub']]) assert(index.includes(href) && index.includes(label), `Homepage must ship ${label}.`);
assert(!/io\.github\.shafthq\s*:\s*shaft-engine|<artifactId>shaft-engine<\/artifactId>|landing-dependency-snippet/.test(index), 'Homepage must not prescribe a direct Maven dependency.');
for (const image of ['allure-passed-evidence.png', 'allure-failed-evidence.png', 'allure-visual-diff-evidence.png']) {
  assert(index.includes(`/img/evidence/${image}`), `Homepage must render authentic evidence image ${image}.`);
  assert(fs.existsSync(path.join(root, 'static', 'img', 'evidence', image)), `Evidence asset ${image} must ship.`);
}
assert(index.includes('loading="lazy"'), 'Below-fold evidence images must lazy-load.');
assert(index.includes('landing_conversion') && index.includes('cta_name') && index.includes('placement') && index.includes('destination'), 'CTA analytics must use the approved optional gtag event contract.');
assert(index.includes('typeof window') && index.includes('browser.gtag?.'), 'CTA analytics must be SSR-safe and no-op without gtag.');
assert(index.includes('Organization names were reported through anonymous community surveys. This list is unaudited and does not imply endorsement.'), 'Homepage must disclose reported-use provenance.');
for (const sponsor of ['JetBrains', 'BrowserStack', 'LambdaTest / TestMu', 'Applitools']) assert(index.includes(sponsor), `Homepage must include sponsor ${sponsor}.`);
assert(index.includes('Community-reported use'), 'Homepage must separate reported-use organizations from sponsors.');
assert(index.includes('https://github.com/ShaftHQ/SHAFT_ENGINE/actions') && index.includes('href="#evidence-heading"'), 'Homepage proof statements must link readers to their primary evidence.');
assert(index.includes('evidenceConstellation') && index.includes('aria-hidden="true"'), 'Homepage must use a decorative constellation.');
assert(styles.includes('prefers-reduced-motion: reduce'), 'Homepage motion must respect reduced-motion.');
assert(!index.includes('IntersectionObserver') && !index.includes('data-reveal'), 'Homepage must not hide content behind scroll reveals.');
assert(!styles.includes("data-reveal-state='rolled-back'"), 'Homepage must not restore rollback reveal styling.');
