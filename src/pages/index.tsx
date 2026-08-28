import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import CodeBlock from '@theme/CodeBlock';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSlack} from '@fortawesome/free-brands-svg-icons';
import {faBookOpen, faStar, faTerminal} from '@fortawesome/free-solid-svg-icons';
import {AccessibleTabs} from '../components/AccessibleTabs';
import {ImageViewerTrigger, ProductImage, SharedImageViewer} from '../components/ImageViewer';
import snippets from '../data/snippets.json';
import releases from '../data/releases.json';
import styles from './index.module.css';

type ConversionName = 'create_project' | 'explore_documentation' | 'star_github' | 'view_agent_workflow';
type Placement = 'hero' | 'final';

const github = 'https://github.com/ShaftHQ/SHAFT_ENGINE';
const slack = 'https://join.slack.com/t/shaft-engine/shared_invite/zt-oii5i2gg-0ZGnih_Y34NjK7QqDn01Dw';

const preview = (name: string): Pick<ProductImage, 'preview' | 'previewSrcSet' | 'previewSizes'> => ({
  preview: `/img/evidence/previews/${name}-480.webp`,
  previewSrcSet: `/img/evidence/previews/${name}-480.webp 480w, /img/evidence/previews/${name}-960.webp 960w`,
  previewSizes: '(min-width: 996px) 42vw, 100vw',
});

const productImages: ProductImage[] = [
  {id: 'passed-evidence', title: 'Passed steps, attached proof', body: 'Inspect actions and captured evidence in the same run.', image: '/img/evidence/allure-passed-evidence.png', ...preview('allure-passed-evidence'), width: 1920, height: 1333, alt: 'Real SHAFT Allure report showing a passed visual-validation test, expanded steps, and an opened screenshot attachment.'},
  {id: 'failed-evidence', title: 'Failure context, ready to inspect', body: 'Move from the failed action to its screenshot and trace without reconstructing the run.', image: '/img/evidence/allure-failed-evidence.png', ...preview('allure-failed-evidence'), width: 1920, height: 1333, alt: 'Real SHAFT Allure report showing a failed browser action with its screenshot and exception evidence.'},
  {id: 'visual-evidence', title: 'Visual evidence beside the result', body: 'Review the expected image, actual image, and deterministic OpenCV difference together.', image: '/img/evidence/allure-visual-diff-evidence.png', ...preview('allure-visual-diff-evidence'), width: 1920, height: 3200, alt: 'Real SHAFT Allure visual-validation result with native expected, actual, and difference attachments.'},
  {id: 'capture', title: 'Capture the real interaction', body: 'Record browser activity, inspect locators, and retain evidence for generation.', image: '/img/capture-locator-picker.png', ...preview('capture-locator-picker'), width: 1280, height: 900, alt: 'SHAFT Capture showing locator inspection and captured browser evidence.'},
  {id: 'assistant', title: 'Keep guidance in the IDE', body: 'Connect project context, MCP tools, and focused assistance where engineers work.', image: '/img/agentic/intellij-plugin-assistant.png', ...preview('intellij-plugin-assistant'), width: 860, height: 780, alt: 'SHAFT IntelliJ Assistant showing agentic project guidance inside the IDE.'},
];

const trustSignals: Array<[string, string, string]> = [
  ['SHAFT release', `Inspect SHAFT ${releases.engineVersion} releases and changes.`, `${github}/releases`],
  ['Java baseline', `Build the current release on Java ${releases.javaVersion}.`, '/docs/start/installation'],
  ['MIT license', 'Use and inspect SHAFT under a permissive open-source license.', `${github}/blob/main/LICENSE`],
  ['CI gate', 'Review the same pull-request checks used by the project.', `${github}/actions`],
  ['Security policy', 'Check supported versions and private disclosure guidance.', `${github}/security/policy`],
  ['Release history', 'Inspect published versions, dates, and changes.', `${github}/releases`],
  ['Selenium ecosystem', 'Find SHAFT in Selenium’s official ecosystem directory.', 'https://www.selenium.dev/ecosystem/#frameworks'],
];

const outcomes = [
  {title: 'Start a new suite', body: 'Generate a Maven project, then run its first test with the checked-in command.', to: '/project-generator', action: 'Generate a project'},
  {title: 'Migrate an existing suite', body: 'Upgrade supported Selenium, Appium, REST Assured, or older SHAFT projects in controlled steps.', to: '/docs/start/upgrade', action: 'Read upgrade guide'},
  {title: 'Add another testing surface', body: 'Keep web, mobile, API, database, and CLI checks in one Java project and evidence model.', to: '#surface-explorer', action: 'Explore surfaces'},
  {title: 'Diagnose a failed run', body: 'Use failed Allure or trace evidence to classify a cause before reviewing a remediation proposal.', to: '#agent-workflow', action: 'Review diagnosis flow'},
];

const surfaceTabs = [
  {id: 'web', label: 'Web', engine: 'Selenium WebDriver', evidence: 'Actions, screenshots, trace context, and Allure steps.', guide: '/docs/testing/web', code: 'SHAFT.GUI.WebDriver driver = new SHAFT.GUI.WebDriver();\ndriver.browser().navigateToURL("https://example.com");\ndriver.element().click(By.id("submit"));'},
  {id: 'mobile', label: 'Mobile', engine: 'Appium', evidence: 'Touch actions, device context, screenshots, and native trace evidence.', guide: '/docs/testing/mobile', code: 'driver.touch().tap(SHAFT.GUI.Locator.accessibilityId("Views"));\ndriver.assertThat().element(By.id("screen")).exists().perform();'},
  {id: 'api', label: 'API', engine: 'REST Assured', evidence: 'Requests, responses, assertions, and report attachments.', guide: '/docs/testing/api', code: 'SHAFT.API api = new SHAFT.API(apiFixtureUrl);\napi.get("users").performRequest();'},
  {id: 'database', label: 'Database', engine: 'JDBC', evidence: 'Connection target, query result, validation, and report evidence.', guide: '/docs/testing/database', code: 'SHAFT.DB database = new SHAFT.DB("jdbc:h2:mem:test");\nResultSet rows = database.executeSelectQuery("SELECT 1");'},
  {id: 'cli', label: 'CLI', engine: 'Local, Docker, SSH', evidence: 'Commands, captured output, and validation in the same report.', guide: '/docs/testing/cli', code: 'String output = SHAFT.CLI.terminal()\n        .performTerminalCommand("echo Hello SHAFT");'},
];

const sponsors = [
  {name: 'JetBrains', href: 'https://jb.gg/OpenSourceSupport', logo: '/img/supporters/jetbrains.svg'},
  {name: 'BrowserStack', href: 'https://www.browserstack.com/', logo: '/img/supporters/browserstack.svg'},
  {name: 'LambdaTest / TestMu', href: 'https://www.lambdatest.com/', logo: '/img/supporters/testmu.svg'},
  {name: 'Applitools', href: 'https://applitools.com/', logo: '/img/supporters/applitools.svg'},
];

const reportedUse = [
  ['_VOIS / Vodafone', 'https://www.voiscentre.com/', '/img/community/vois.png'], ['GET Group', 'https://www.getgroup.com/', '/img/community/get-group.ico'], ['Ministry of Municipalities and Housing', 'https://momah.gov.sa/', '/img/community/momah.png'], ['Vodafone Egypt', 'https://web.vodafone.com.eg/', '/img/community/vodafone-egypt.svg'], ['Solutions by STC', 'https://solutions.com.sa/', '/img/community/solutions-by-stc.svg'], ['GIZA Systems', 'https://gizasystems.com/', '/img/community/giza-systems.png'], ['Euronet', 'https://www.euronetworldwide.com/', '/img/community/euronet.png'], ['Terkwaz', 'https://www.linkedin.com/company/terkwazjo', '/img/community/terkwaz.png'], ['Incorta', 'https://www.incorta.com/', '/img/community/incorta.png'], ['BayanTech', 'https://bayan-tech.com/', '/img/community/bayantech.png'], ['adam.ai', 'https://adam.ai/', '/img/community/adam-ai.svg'], ['ACT', 'https://www.act.eg/', '/img/community/act.png'], ['elmenus', 'https://www.elmenus.com/', '/img/community/elmenus.png'], ['IDEMIA', 'https://www.idemia.com/', '/img/community/idemia.png'], ['iHorizons', 'https://www.ihorizons.com/', '/img/community/ihorizons.png'], ['Robusta', 'https://robustagroup.com/', '/img/community/robusta.png'], ['Paymob', 'https://paymob.com/', '/img/community/paymob.png'], ['Jahez', 'https://jahezgroup.com/', '/img/community/jahez.png'], ['Salt Bank', 'https://salt.bank/', '/img/community/salt-bank.svg'], ['Baianat', 'https://www.baianat.com/', '/img/community/baianat.png'], ['DXC Technology', 'https://dxc.com/', '/img/community/dxc.png'], ['EFG Holding', 'https://efgholding.com/', '/img/community/efg-holding.png'],
];

function track(ctaName: ConversionName, placement: Placement, destination: string): void {
  if (typeof window === 'undefined') return;
  const browser = window as typeof window & {gtag?: (...args: unknown[]) => void};
  browser.gtag?.('event', 'landing_conversion', {cta_name: ctaName, placement, destination});
}

function EvidenceTrail(): JSX.Element {
  return <svg className={styles.evidenceTrail} viewBox="0 0 760 280" aria-hidden="true" focusable="false"><path d="M48 196C162 42 271 252 380 126S573 45 704 112" /><circle cx="48" cy="196" r="6" /><circle cx="380" cy="126" r="6" /><circle cx="704" cy="112" r="6" /><text x="58" y="232">Intent · Java · Run · Evidence</text></svg>;
}

function Ctas({placement}: {placement: Placement}): JSX.Element {
  const suffix = placement === 'hero' ? 'hero' : 'final';
  return <div className={styles.actions} data-testid={`landing-${suffix}-actions`}>
    <Link className="button button--primary button--lg" data-testid={`landing-${suffix}-create-project`} to="/project-generator" onClick={() => track('create_project', placement, '/project-generator')}><FontAwesomeIcon icon={faTerminal} aria-hidden="true" />Create new project</Link>
    <Link className="button button--secondary button--lg" data-testid={`landing-${suffix}-documentation`} to="/docs/start/overview" onClick={() => track('explore_documentation', placement, '/docs/start/overview')}><FontAwesomeIcon icon={faBookOpen} aria-hidden="true" />Explore documentation</Link>
    {placement === 'hero' && <a className={styles.workflowLink} data-testid="landing-hero-workflow" href="#agent-workflow" onClick={() => track('view_agent_workflow', placement, '#agent-workflow')}>See agent-to-evidence workflow</a>}
    {placement === 'final' && <a className="button button--secondary button--lg" data-testid={`landing-${suffix}-star`} href={github} target="_blank" rel="noreferrer" onClick={() => track('star_github', placement, github)}><FontAwesomeIcon icon={faStar} aria-hidden="true" />Star on GitHub</a>}
  </div>;
}

export default function Home(): JSX.Element {
  const [activeImage, setActiveImage] = React.useState<ProductImage | null>(null);
  const openerRef = React.useRef<HTMLButtonElement | null>(null);
  const openImage = (item: ProductImage, opener: HTMLButtonElement): void => { openerRef.current = opener; setActiveImage(item); };
  const closeImage = (): void => { setActiveImage(null); window.setTimeout(() => openerRef.current?.focus(), 0); };
  const workflowTabs = [
    {id: 'author-prove', label: 'Author and prove', panel: <div className={styles.workflowGrid}><div><p className={styles.eyebrow}>Capture lifecycle</p><Heading as="h3"><code>capture_start</code> <span aria-hidden="true">·</span> <code>capture_stop</code> <span aria-hidden="true">·</span> <code>capture_generate_replay</code></Heading><p>Capture an approved flow, review generated native Java, then retain replay evidence with the recording.</p><CodeBlock language="java" title="Reviewed native Java">{'SHAFT.GUI.WebDriver driver = new SHAFT.GUI.WebDriver();\ndriver.browser().navigateToURL("https://example.com");\ndriver.element().click(By.id("submit"));'}</CodeBlock></div><div className={styles.workflowEvidence}><ImageViewerTrigger item={productImages[3]} onOpen={openImage} className={styles.evidenceMedia} imageClassName={styles.evidenceImage} /><ImageViewerTrigger item={productImages[4]} onOpen={openImage} className={styles.evidenceMedia} imageClassName={styles.evidenceImage} /></div></div>},
    {id: 'diagnose-review', label: 'Diagnose and review', panel: <div className={styles.workflowGrid}><div><p className={styles.eyebrow}>Evidence first</p><Heading as="h3">Failed Allure or trace evidence <span aria-hidden="true">·</span> classified cause <span aria-hidden="true">·</span> review-only remediation guidance</Heading><p>Run <code>doctor_analyze_failed_allure</code> or <code>doctor_analyze_trace</code> to classify evidence before reviewing a proposal.</p><CodeBlock language="text" title="Doctor output">{'classification: locator\nevidence: failed Allure action and trace context\nnext step: review remediation guidance'}</CodeBlock></div><div className={styles.workflowEvidence}><ImageViewerTrigger item={productImages[1]} onOpen={openImage} className={styles.evidenceMedia} imageClassName={styles.evidenceImage} /><ImageViewerTrigger item={productImages[2]} onOpen={openImage} className={styles.evidenceMedia} imageClassName={styles.evidenceImage} /></div></div>},
  ];
  const explorerTabs = surfaceTabs.map((surface) => ({id: surface.id, label: surface.label, panel: <div className={styles.surfacePanel}><div><p className={styles.eyebrow}>Native engine</p><Heading as="h3">{surface.engine}</Heading><p>{surface.evidence}</p><Link to={surface.guide}>Read {surface.label.toLowerCase()} guide</Link></div><CodeBlock language="java" title={`${surface.label} SHAFT snippet`}>{surface.code}</CodeBlock></div>}));

  return <Layout title="SHAFT Engine" description="Release decisions backed by inspectable test evidence."><main data-testid="landing-main">
    <header className={styles.hero} data-testid="landing-hero"><EvidenceTrail /><div className={`container ${styles.heroLayout}`}><div className={styles.heroCopy}><div className={styles.logoPlate}><img className={styles.logo} src="/img/shaft.svg" width="92" height="92" alt="SHAFT" /></div><h1>Release decisions backed by inspectable evidence.</h1><p className={styles.lead}>Run one Java project across web, mobile, API, database, and CLI. Keep native engine control, then connect Capture, Doctor, Heal, and MCP when they add evidence.</p><Ctas placement="hero" /><ol className={styles.proofRail} aria-label="First run proof"><li>Generate project</li><li><code>{snippets.firstRunCommand}</code></li><li>Inspect report</li></ol></div><figure className={styles.heroFigure}><ImageViewerTrigger item={productImages[0]} onOpen={openImage} className={`${styles.evidenceMedia} ${styles.heroMedia}`} imageClassName={styles.evidenceImage} eager /><figcaption><strong>Real SHAFT execution.</strong> Open the report evidence and inspect it.</figcaption></figure></div></header>

    <section className={`${styles.section} ${styles.workflowSection}`} data-testid="landing-agent-workflow" aria-labelledby="agent-workflow"><div className="container"><Heading as="h2" id="agent-workflow">From intent to reviewable Java and evidence.</Heading><p className={styles.intro}>Use evidence to keep engineers in control and give delivery leaders a reviewable release signal.</p><AccessibleTabs id="agent-workflow-tabs" label="Agent-to-evidence workflow" tabs={workflowTabs} className={styles.tabs} tabListClassName={styles.tabList} tabClassName={styles.tab} panelClassName={styles.tabPanel} /><p className={styles.boundary}>Model choice remains with the MCP client. Tests remain ordinary Java. Proposals do not silently edit, approve, or merge.</p></div></section>

    <section className={styles.section} data-testid="landing-outcomes" aria-labelledby="outcomes-heading"><div className="container"><Heading as="h2" id="outcomes-heading">Start from the job in front of you</Heading><p className={styles.intro}>For engineers, preserve native Java control. For delivery leaders, make release evidence easy to inspect.</p><div className={styles.outcomeGrid}>{outcomes.map((outcome) => <article key={outcome.title}><Heading as="h3">{outcome.title}</Heading><p>{outcome.body}</p><Link to={outcome.to}>{outcome.action}</Link></article>)}</div></div></section>

    <section className={`${styles.section} ${styles.surfaceSection}`} data-testid="landing-surfaces" aria-labelledby="surface-explorer"><div className="container"><Heading as="h2" id="surface-explorer">One evidence model across five test surfaces</Heading><p className={styles.intro}>Start with the native engine. Keep the evidence and Java suite in one place.</p><AccessibleTabs id="surface-explorer-tabs" label="Testing surfaces" tabs={explorerTabs} className={styles.tabs} tabListClassName={styles.tabList} tabClassName={styles.tab} panelClassName={styles.tabPanel} /></div></section>

    <section className={`${styles.section} ${styles.trustSection}`} data-testid="landing-trust" aria-labelledby="trust-heading"><div className="container"><Heading as="h2" id="trust-heading">Trust, performance, and community</Heading><div className={styles.trustGrid}>{trustSignals.map(([title, detail, href]) => <Link to={href} key={title}><strong>{title}</strong><span>{detail}</span></Link>)}</div></div></section>

    <section className={styles.final} id="get-started" data-testid="landing-final"><div className={`container ${styles.finalContent}`}><Heading as="h2">Start with a project. Keep the evidence.</Heading><p>Generate a focused starter, examine the documentation, or follow development on GitHub.</p><Ctas placement="final" /></div></section>

    <footer className={styles.footer} data-testid="landing-footer"><div className="container"><section aria-labelledby="support-heading"><Heading as="h2" id="support-heading">Supported by</Heading><div className={styles.wordmarks}>{sponsors.map(({name, href, logo}) => <a href={href} key={name} target="_blank" rel="noreferrer"><img src={logo} width="160" height="48" loading="lazy" alt={`${name} logo`} /></a>)}</div><p className={styles.attribution}>JetBrains and the JetBrains logo are trademarks of JetBrains s.r.o. DXC Technology imagery is reproduced courtesy of DXC Technology; unauthorized use is not permitted.</p></section><section aria-labelledby="reported-heading"><Heading as="h2" id="reported-heading">Community-reported use</Heading><details className={styles.communityDetails}><summary>View community-reported use</summary><div className={styles.communityLogos}>{reportedUse.map(([name, href, logo]) => <a href={href} key={name} target="_blank" rel="noreferrer"><img src={logo} width="112" height="44" loading="lazy" alt={`${name} logo`} /><span>{name}</span></a>)}</div></details><p className={styles.disclaimer}>Organization names were reported through anonymous community surveys. This list is unaudited and does not imply endorsement.</p></section><nav className={styles.footerLinks} aria-label="Community links"><a href={slack} target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faSlack} aria-hidden="true" />Slack</a><a href={github} target="_blank" rel="noreferrer" aria-label="Star SHAFT on GitHub"><FontAwesomeIcon icon={faStar} aria-hidden="true" />GitHub</a></nav></div></footer>
    <SharedImageViewer items={productImages} activeItem={activeImage} onClose={closeImage} />
  </main></Layout>;
}
