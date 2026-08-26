import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

type ConversionName = 'create_project' | 'explore_documentation' | 'star_github';
type Placement = 'hero' | 'final';

const github = 'https://github.com/ShaftHQ/SHAFT_ENGINE';

const evidence = [
  {title: 'Passed steps, attached proof', body: 'Inspect actions and captured evidence in the same run.', image: '/img/evidence/allure-passed-evidence.png', alt: 'Real SHAFT Allure report showing report status and execution history.'},
  {title: 'Failure context, ready to inspect', body: 'Move from a failed assertion to the report details without reconstructing the run.', image: '/img/evidence/allure-failed-evidence.png', alt: 'Real SHAFT Allure overview panel showing failed test details and captured traces.'},
  {title: 'Visual evidence belongs with the result', body: 'Compare the SHAFT logo baseline and actual image directly in the execution record.', image: '/img/evidence/allure-visual-diff-evidence.png', alt: 'Real SHAFT Allure visual-comparison attachment showing the SHAFT logo actual and expected images side by side.'},
];

const capabilities = ['Web', 'Mobile', 'API', 'Database', 'CLI', 'Allure reporting', 'Capture', 'Doctor', 'Heal', 'Visual testing', 'IntelliJ', 'MCP'];
const sponsors = [
  {name: 'JetBrains', href: 'https://jb.gg/OpenSourceSupport', logo: 'https://resources.jetbrains.com/storage/products/company/brand/logos/jetbrains.svg'},
  {name: 'BrowserStack', href: 'https://www.browserstack.com/'},
  {name: 'LambdaTest / TestMu', href: 'https://www.lambdatest.com/', logo: 'https://assets.testmuai.com/resources/images/logos/logo.svg'},
  {name: 'Applitools', href: 'https://applitools.com/'},
];
const reportedUse = ['_VOIS / Vodafone', 'GET Group', 'MOMRA', 'Vodafone Egypt', 'Solutions by STC', 'GIZA Systems', 'Euronet', 'Terkwaz', 'Incorta', 'BayanTech', 'adam.ai', 'ACT', 'elmenus', 'IDEMIA', 'iHorizons', 'Robusta', 'Paymob', 'Jahez', 'Salt Bank', 'Baianat', 'DXC', 'EFG Holding'];

function track(ctaName: ConversionName, placement: Placement, destination: string): void {
  if (typeof window === 'undefined') return;
  const browser = window as typeof window & {gtag?: (...args: unknown[]) => void};
  browser.gtag?.('event', 'landing_conversion', {cta_name: ctaName, placement, destination});
}

function Constellation(): JSX.Element {
  return <svg className={styles.evidenceConstellation} viewBox="0 0 640 360" aria-hidden="true" focusable="false"><path d="M52 258 168 128 280 222 384 74 570 168" /><path d="m168 128 54 174 162-228" /><circle cx="52" cy="258" r="5" /><circle cx="168" cy="128" r="7" /><circle cx="280" cy="222" r="5" /><circle cx="384" cy="74" r="7" /><circle cx="570" cy="168" r="5" /></svg>;
}

function Ctas({placement}: {placement: Placement}): JSX.Element {
  const suffix = placement === 'hero' ? 'hero' : 'final';
  return <div className={styles.actions} data-testid={`landing-${suffix}-actions`}>
    <Link className="button button--primary button--lg" data-testid={`landing-${suffix}-create-project`} to="/project-generator" onClick={() => track('create_project', placement, '/project-generator')}>Create new project</Link>
    <Link className="button button--secondary button--lg" data-testid={`landing-${suffix}-documentation`} to="/docs/start/overview" onClick={() => track('explore_documentation', placement, '/docs/start/overview')}>Explore documentation</Link>
    <a className="button button--secondary button--lg" data-testid={`landing-${suffix}-star`} href={github} target="_blank" rel="noreferrer" onClick={() => track('star_github', placement, github)}>Star on GitHub</a>
  </div>;
}

export default function Home(): JSX.Element {
  return <Layout title="SHAFT Engine" description="Release decisions backed by inspectable test evidence.">
    <main data-testid="landing-main">
      <header className={styles.hero} data-testid="landing-hero">
        <Constellation />
        <div className={`container ${styles.heroLayout}`}>
          <div><img className={styles.logo} src="/img/shaft.svg" width="76" height="76" alt="SHAFT" /><h1>Release decisions backed by inspectable evidence.</h1><p className={styles.lead}>SHAFT keeps web, mobile, API, database, and CLI execution evidence close to the decision it informs.</p><Ctas placement="hero" /></div>
          <figure className={styles.heroFigure}><img src="/img/evidence/allure-passed-evidence.png" width="1265" height="712" fetchPriority="high" alt="Real SHAFT Allure report showing report status and execution history." /><figcaption>Real SHAFT evidence, rendered in Allure.</figcaption></figure>
        </div>
      </header>

      <section className={styles.section} aria-labelledby="evidence-heading" data-testid="landing-evidence"><div className="container"><Heading as="h2" id="evidence-heading">Evidence that survives scrutiny</Heading><p className={styles.intro}>A release result is more useful when its steps, attachments, diagnostics, and visual checks remain inspectable.</p><div className={styles.evidenceGrid}>{evidence.map((item, index) => <figure className={styles.evidenceCard} key={item.title}><img src={item.image} width={index === 0 ? 1265 : 1600} height={index === 0 ? 712 : 900} loading="lazy" alt={item.alt} /><figcaption><strong>{item.title}</strong><span>{item.body}</span></figcaption></figure>)}</div></div></section>

      <section className={`${styles.section} ${styles.proofBand}`} data-testid="landing-proof"><div className="container"><Heading as="h2">For researchers, stakeholders, and engineers</Heading><div><p><a href="#evidence-heading"><strong>Inspectable</strong> artifacts make results easier to review.</a></p><p><a href="https://github.com/ShaftHQ/SHAFT_ENGINE/actions" target="_blank" rel="noreferrer"><strong>Reproducible</strong> workflows retain test context with evidence.</a></p><p><a href="https://github.com/ShaftHQ/SHAFT_ENGINE" target="_blank" rel="noreferrer"><strong>Open source</strong> means the implementation and history can be examined.</a></p></div></div></section>

      <section className={styles.section} data-testid="landing-capabilities"><div className="container"><Heading as="h2">One evidence model across your test surfaces</Heading><ul className={styles.capabilityRail}>{capabilities.map((capability) => <li key={capability}>{capability}</li>)}</ul></div></section>

      <section className={styles.final} id="get-started" data-testid="landing-final"><Constellation /><div className={`container ${styles.finalContent}`}><Heading as="h2">Start with a project. Keep the evidence.</Heading><p>Generate a focused starter, examine the documentation, or follow development on GitHub.</p><Ctas placement="final" /></div></section>

      <footer className={styles.footer} data-testid="landing-footer"><div className="container"><section aria-labelledby="support-heading"><Heading as="h2" id="support-heading">Supported by</Heading><div className={styles.wordmarks}>{sponsors.map(({name, href, logo}) => <a href={href} key={name} target="_blank" rel="noreferrer">{logo ? <img src={logo} width="132" height="36" loading="lazy" alt={`${name} logo`} /> : <span>{name}</span>}</a>)}</div></section><section aria-labelledby="reported-heading"><Heading as="h2" id="reported-heading">Community-reported use</Heading><div className={styles.reported}>{reportedUse.map((name) => <span key={name}>{name}</span>)}</div><p className={styles.disclaimer}>Organization names were reported through anonymous community surveys. This list is unaudited and does not imply endorsement.</p></section></div></footer>
    </main>
  </Layout>;
}
