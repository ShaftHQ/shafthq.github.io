import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Head from '@docusaurus/Head';
import CodeBlock from '@theme/CodeBlock';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBookOpen, faCheck, faPause, faPlay, faStar, faTerminal} from '@fortawesome/free-solid-svg-icons';
import {AccessibleTabs} from '../components/AccessibleTabs';
import {ImageViewerTrigger, ProductImage, SharedImageViewer} from '../components/ImageViewer';
import snippets from '../data/snippets.json';
import projectSignals from '../data/project-signals.json';
import usageMetrics from '../data/usage-metrics.json';
import {getHomepageFaqs, homepageFaqPageJsonLd} from '../data/homepage-faqs';
import styles from './index.module.css';

type ConversionName = 'create_project' | 'explore_documentation' | 'star_github' | 'view_agent_workflow';
type Placement = 'hero' | 'final';

const github = 'https://github.com/ShaftHQ/SHAFT_ENGINE';

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

// Guard against "Java undefined" if the signal is ever missing (#1130 review).
const javaVersion = /^\d+$/.test(String(projectSignals.javaVersion ?? '')) ? String(projectSignals.javaVersion) : '';
const trustSignals: Array<[string, string, string]> = [
  ['SHAFT release', `SHAFT ${projectSignals.engineVersion} is the current release on Maven Central.`, `${github}/releases`],
  ...(javaVersion ? [['Java baseline', `Builds and runs on Java ${javaVersion}.`, '/docs/start/installation'] as [string, string, string]] : []),
  ['MIT license', 'Use, fork, and inspect it under a permissive license.', `${github}/blob/main/LICENSE`],
  ['CI gate', 'Every pull request runs the same public checks.', `${github}/actions`],
  ['Selenium ecosystem', 'Listed in Selenium’s official ecosystem directory.', 'https://www.selenium.dev/ecosystem/#frameworks'],
];

const readmeTest = 'SHAFT.GUI.WebDriver driver = new SHAFT.GUI.WebDriver();\ndriver.browser()\n      .navigateToURL("https://shafthq.github.io/")\n      .and().element().assertThat(By.cssSelector("h1")).isVisible();\ndriver.quit();';
const runOutput = '$ mvn test\n[INFO] Running hero.QuickStartTest\n[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0\n[INFO] BUILD SUCCESS';

const outcomes = [
  {primary: true, title: 'Create a project', body: 'Generate a Maven project and run the sample.', to: '/docs/journeys/create-a-project', action: 'Create a project'},
  {primary: true, title: 'Upgrade a Java project', body: 'Move an existing Maven suite onto current SHAFT and run one test.', to: '/docs/journeys/upgrade-a-project', action: 'Upgrade a project'},
  {group: 'Agents and IDE', title: 'Install skills', body: 'Add the SHAFT skill pack to the agent you already use.', to: '/docs/journeys/skills', action: 'Install skills'},
  {group: 'Agents and IDE', title: 'Use the IntelliJ plugin', body: 'Open the SHAFT tool window and finish setup.', to: '/docs/journeys/intellij', action: 'Use the plugin'},
  {group: 'Agents and IDE', title: 'Connect an MCP client', body: 'List SHAFT tools in Codex, Copilot, Claude, or another client.', to: '/docs/journeys/mcp', action: 'Connect MCP'},
  {group: 'Agents and IDE', title: 'Use shaft-cli', body: 'Run one SHAFT command from the terminal.', to: '/docs/journeys/cli', action: 'Use shaft-cli'},
  {primary: true, title: 'Run in CI', body: 'Run the suite headlessly and keep the report.', to: '/docs/journeys/ci', action: 'Run in CI'},
  {group: 'Surfaces and infrastructure', title: 'Add a test surface', body: 'Add web, API, mobile, database, or CLI to a project that already runs.', to: '/docs/journeys/add-a-surface', action: 'Add a surface'},
  {group: 'Surfaces and infrastructure', title: 'Install local infrastructure', body: 'Install the Android, Appium, Grid, or browser profile you chose.', to: '/docs/start/local-infrastructure', action: 'Install infrastructure'},
  {group: 'Agents and IDE', title: 'Install ChaosEngine', body: 'Install the project-local agent harness and read the result.', to: '/docs/agentic/chaos-engine', action: 'Install ChaosEngine'},
];

const surfaceTabs = [
  {id: 'web', label: 'Web', engine: 'Selenium WebDriver', evidence: 'Actions, screenshots, trace context, and Allure steps.', guide: '/docs/testing/web', code: 'SHAFT.GUI.WebDriver driver = new SHAFT.GUI.WebDriver();\ndriver.browser().navigateToURL("https://example.com");\ndriver.element().click(By.id("submit"));'},
  {id: 'mobile', label: 'Mobile', engine: 'Appium', evidence: 'Touch actions, device context, screenshots, and native trace evidence.', guide: '/docs/testing/mobile', code: 'driver.touch().tap(SHAFT.GUI.Locator.accessibilityId("Views"));\ndriver.assertThat().element(By.id("screen")).exists().perform();'},
  {id: 'desktop', label: 'Desktop', engine: 'Appium Windows driver', evidence: 'The same click and type facade as web, with UIA control routing and report evidence.', guide: '/docs/testing/mobile#windows-desktop-apps', code: 'SHAFT.Properties.platform.set()\n        .targetPlatform("Windows")\n        .executionAddress("http://127.0.0.1:4723");\nnew DriverFactory().getHelper(DriverFactory.DriverType.APPIUM_WINDOWS);'},
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
  ['_VOIS / Vodafone', 'https://www.voiscentre.com/', '/img/community/vois.png'],
  ['GET Group', 'https://www.getgroup.com/', '/img/community/get-group.ico'],
  ['Ministry of Municipalities and Housing', 'https://momah.gov.sa/', '/img/community/momah.png'],
  ['Vodafone Egypt', 'https://web.vodafone.com.eg/', '/img/community/vodafone-egypt.svg'],
  ['Solutions by STC', 'https://www.linkedin.com/company/solutionsbystc/', '/img/community/solutions-by-stc.svg'],
  ['GIZA Systems', 'https://gizasystems.com/', '/img/community/giza-systems.png'],
  ['Euronet', 'https://www.euronet.com/', '/img/community/euronet.png'],
  ['Terkwaz', 'https://www.linkedin.com/company/terkwazjo', '/img/community/terkwaz.png'],
  ['Incorta', 'https://www.incorta.com/', '/img/community/incorta.png'],
  ['BayanTech', 'https://bayan-tech.com/', '/img/community/bayantech.png'],
  ['adam.ai', 'https://adam.ai/', '/img/community/adam-ai.svg'],
  ['ACT', 'https://www.act.eg/', '/img/community/act.png'],
  ['elmenus', 'https://www.elmenus.com/', '/img/community/elmenus.png'],
  ['IDEMIA', 'https://www.idemia.com/', '/img/community/idemia.png'],
  ['iHorizons', 'https://www.ihorizons.com/', '/img/community/ihorizons.png'],
  ['Robusta', 'https://robustagroup.com/', '/img/community/robusta.png'],
  ['Paymob', 'https://paymob.com/', '/img/community/paymob.png'],
  ['Jahez', 'https://jahezgroup.com/', '/img/community/jahez.png'],
  ['Salt Bank', 'https://salt.bank/', '/img/community/salt-bank.svg'],
  ['Baianat', 'https://www.baianat.com/', '/img/community/baianat.png'],
  ['DXC Technology', 'https://dxc.com/', '/img/community/dxc.png'],
  ['EFG Holding', 'https://efgholding.com/', '/img/community/efg-holding.png'],
  ['Ministry of Human Resources and Social Development', 'https://www.hrsd.gov.sa/en', '/img/community/hrsd.png'],
  ['InnovationTeam', 'https://www.innovationteam.com/', '/img/community/innovationteam.png'],
];

function track(ctaName: ConversionName, placement: Placement, destination: string): void {
  if (typeof window === 'undefined') return;
  const browser = window as typeof window & {gtag?: (...args: unknown[]) => void};
  browser.gtag?.('event', 'landing_conversion', {cta_name: ctaName, placement, destination});
}

type SaveDataConnection = EventTarget & {saveData?: boolean};

function HeroClip(): JSX.Element {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const userPaused = React.useRef(false);
  const [playing, setPlaying] = React.useState(false);
  // The play/pause control only works with JavaScript; without it the server HTML keeps it hidden.
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    setReady(true);
    const video = videoRef.current;
    if (!video) return undefined;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (navigator as Navigator & {connection?: SaveDataConnection}).connection;
    const allowed = (): boolean => !motion.matches && !connection?.saveData;
    let loaded = document.readyState === 'complete';
    // Start after the load event so the clip never competes with the headline for first paint.
    // Re-evaluated whenever reduced motion or Save-Data changes (#1130 review).
    const evaluate = (): void => {
      if (!allowed()) { video.pause(); return; }
      if (loaded && !userPaused.current && video.paused) { video.preload = 'auto'; video.play().catch(() => undefined); }
    };
    const onLoad = (): void => { loaded = true; evaluate(); };
    evaluate();
    if (!loaded) window.addEventListener('load', onLoad, {once: true});
    motion.addEventListener('change', evaluate);
    connection?.addEventListener?.('change', evaluate);
    return () => {
      window.removeEventListener('load', onLoad);
      motion.removeEventListener('change', evaluate);
      connection?.removeEventListener?.('change', evaluate);
    };
  }, []);
  const toggle = (): void => {
    const video = videoRef.current;
    if (!video) return;
    userPaused.current = !video.paused;
    if (video.paused) { video.preload = 'auto'; video.play().catch(() => undefined); } else video.pause();
  };
  return <figure className={styles.heroFigure}>
    <div className={styles.clipFrame}>
      <video ref={videoRef} data-testid="landing-hero-clip" className={styles.clip} muted playsInline loop preload="none" poster="/img/video/shaft-hero-poster.webp" width={1280} height={720} aria-label="SHAFT in 26 seconds: a three-line test, mvn test passing, and the green Allure report it produces." onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}>
        <source src="/video/shaft-hero-1280x720.mp4" type="video/mp4" />
        <track kind="captions" src="/video/shaft-hero.en.vtt" srcLang="en" label="English" />
      </video>
      <button type="button" className={styles.clipToggle} data-testid="landing-hero-clip-toggle" hidden={!ready} onClick={toggle} aria-label={playing ? 'Pause the clip' : 'Play the clip'}><FontAwesomeIcon icon={playing ? faPause : faPlay} aria-hidden="true" /></button>
    </div>
    <figcaption><strong>Real run, no mockups.</strong> A 3-line test, <code>mvn test</code>, and the report it writes.</figcaption>
  </figure>;
}

// WCAG 2.5.3: on-screen words, including the count, must occur in the accessible name.
// Flex gap is not a text node, so the count needs its own word boundary or axe reads "GitHub416".
const fmt = (n: number): string => n.toLocaleString('en-US');
const usageMetricsStrip: Array<[string, string]> = [
  [fmt(usageMetrics.testsRun30d), `Tests run in 30 days (${usageMetrics.testsRun30dRange})`],
  [fmt(usageMetrics.activeUsers30d), `Active users in 30 days (${usageMetrics.activeUsers30dRange})`],
  [fmt(usageMetrics.activeUsers12m), `Active users in 12 months (${usageMetrics.activeUsers12mRange})`],
  [fmt(usageMetrics.countries), `Countries in 12 months (${usageMetrics.countriesRange})`],
];

const starLabel = typeof projectSignals.stars === 'number' ? `Star on GitHub, ${projectSignals.stars.toLocaleString('en-US')} stars` : 'Star on GitHub';

function Ctas({placement}: {placement: Placement}): JSX.Element {
  const suffix = placement === 'hero' ? 'hero' : 'final';
  return <div className={styles.actions} data-testid={`landing-${suffix}-actions`}>
    <Link className="button button--primary button--lg" data-testid={`landing-${suffix}-create-project`} to="/project-generator" onClick={() => track('create_project', placement, '/project-generator')}><FontAwesomeIcon icon={faTerminal} aria-hidden="true" />Create new project</Link>
    <Link className="button button--secondary button--lg" data-testid={`landing-${suffix}-documentation`} to="/docs/journeys" onClick={() => track('explore_documentation', placement, '/docs/journeys')}><FontAwesomeIcon icon={faBookOpen} aria-hidden="true" />Read the user guide</Link>
    <div className={styles.starRow}><a className={styles.starLink} data-testid={`landing-${suffix}-star`} href={github} target="_blank" rel="noreferrer" aria-label={starLabel} onClick={() => track('star_github', placement, github)}><FontAwesomeIcon icon={faStar} aria-hidden="true" /><span>Star on GitHub</span>{typeof projectSignals.stars === 'number' && <>{' '}<span className={styles.starTotal} aria-hidden="true">{projectSignals.stars.toLocaleString('en-US')}</span></>}</a></div>
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

  const primaryOutcomes = outcomes.filter((outcome) => outcome.primary);
  const outcomeGroups = ['Agents and IDE', 'Surfaces and infrastructure'].map((group) => ({group, items: outcomes.filter((outcome) => outcome.group === group)}));
  const homepageFaqs = getHomepageFaqs(javaVersion);
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'SHAFT Engine',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Windows, macOS, Linux',
    softwareVersion: projectSignals.engineVersion,
    license: 'https://opensource.org/licenses/MIT',
    codeRepository: github,
    url: 'https://shafthq.github.io/',
    description: 'Open-source Java test automation framework for web, mobile, API, CLI, database, and desktop, with an Allure report on every run.',
    offers: {'@type': 'Offer', price: '0', priceCurrency: 'USD'},
  };
  const faqPageData = homepageFaqPageJsonLd(homepageFaqs);

  return <Layout title="SHAFT: Java test automation with built-in evidence" description="Write the test. SHAFT does the rest. One open-source Java engine for web, mobile, API, CLI, database, and desktop, with an Allure report on every run.">
    <Head>
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      <script type="application/ld+json">{JSON.stringify(faqPageData)}</script>
    </Head>
    <main data-testid="landing-main">
    <header className={styles.hero} data-testid="landing-hero"><div className={`container ${styles.heroLayout}`}><div className={styles.heroCopy}>
      <p className={styles.kicker} data-testid="landing-hero-kicker"><span className={styles.kickerDot} aria-hidden="true" />SHAFT Engine · open-source Java test automation framework</p>
      <h1><span className={styles.h1Line}>Write the test.</span> <span className={`${styles.h1Line} ${styles.h1Accent}`}>SHAFT does the rest.</span></h1>
      <p className={styles.lead}>One Java engine for web, mobile, API, CLI, database, and desktop. Drivers, waits, and evidence are handled. Every run ends in an Allure report.</p>
      <Ctas placement="hero" />
      <div className={styles.firstRun}><p className={styles.firstRunLabel} id="first-run-label">Your first run</p><ol className={styles.proofRail} aria-labelledby="first-run-label"><li>Generate project</li><li><code>{snippets.firstRunCommand}</code></li><li>Inspect report</li></ol><p className={styles.firstRunNote}>Already on Maven? <Link to="/docs/start/installation">Install SHAFT</Link> · <a className={styles.workflowLink} data-testid="landing-hero-workflow" href="#agent-workflow" onClick={() => track('view_agent_workflow', 'hero', '#agent-workflow')}>See agent-to-evidence workflow</a></p></div>
    </div><HeroClip /></div></header>

    <section className={`${styles.section} ${styles.proofSection}`} data-testid="landing-proof" aria-labelledby="proof-heading"><div className="container">
      <Heading as="h2" id="proof-heading">Three lines in. A green report out.</Heading>
      <ol className={styles.proofSteps}>
        <li><p className={styles.stepLabel}><FontAwesomeIcon icon={faCheck} aria-hidden="true" className={styles.tick} />Write</p><CodeBlock language="java" title="QuickStartTest.java">{readmeTest}</CodeBlock></li>
        <li><p className={styles.stepLabel}><FontAwesomeIcon icon={faCheck} aria-hidden="true" className={styles.tick} />Run</p><CodeBlock language="text" title="Terminal">{runOutput}</CodeBlock></li>
        <li><p className={styles.stepLabel}><FontAwesomeIcon icon={faCheck} aria-hidden="true" className={styles.tick} />Prove</p><ImageViewerTrigger item={productImages[0]} onOpen={openImage} className={styles.evidenceMedia} imageClassName={styles.evidenceImage} /></li>
      </ol>
      <p className={styles.proofNote}>Output from a real run of this test. Open the report to inspect every step, screenshot, and log.</p>
    </div></section>

    <section className={styles.section} data-testid="landing-usage" aria-labelledby="usage-heading"><div className="container">
      <Heading as="h2" id="usage-heading">Usage, measured</Heading>
      <p className={styles.intro}>Public SHAFT traffic from Google Analytics 4 (Engine property) and GitHub. Exact counts, not rounded up. As of {usageMetrics.asOf}.</p>
      <div className={styles.usageGrid} role="list">{usageMetricsStrip.map(([value, label]) => <div key={label} className={styles.usageStat} role="listitem"><strong>{value}</strong><span>{label}</span></div>)}</div>
      <p className={styles.usageCite}>Source: {usageMetrics.source}. Stars on this page come from the live GitHub count ({typeof projectSignals.stars === 'number' ? `${projectSignals.stars.toLocaleString('en-US')} as committed baseline` : 'see GitHub'}); releases snapshot {usageMetrics.releases.toLocaleString('en-US')}.</p>
    </div></section>

    <section className={styles.section} data-testid="landing-video" aria-labelledby="video-heading"><div className={`container ${styles.videoLayout}`}>
      <div><Heading as="h2" id="video-heading">See SHAFT in 100 seconds</Heading><p className={styles.intro}>Why teams pick SHAFT for new Java suites, and how an existing Selenium suite moves over without a rewrite. Captions are on; nothing downloads until you press play.</p>
        <ol className={styles.chapters} aria-label="Video chapters"><li><span>0:00</span> Red build: bug or flaky test?</li><li><span>0:20</span> One engine on proven tools</li><li><span>0:36</span> Waits, reports and scale built in</li><li><span>0:57</span> Upgrade an existing suite</li><li><span>1:16</span> Open source, and how to start</li></ol>
        <p><Link to="/docs/start/quick-start">Prefer the technical walkthrough? Watch it in the quick start.</Link></p></div>
      <video className={styles.overviewVideo} controls preload="none" poster="/img/video/shaft-overview-v2-poster.webp" width={1280} height={720} aria-label="SHAFT in 100 seconds, overview video"><source src="/video/shaft-feature/shaft-business-v2.mp4" type="video/mp4" /><track kind="captions" src="/video/shaft-feature/shaft-business-v2.en.vtt" srcLang="en" label="English" default /></video>
    </div></section>

    <section className={`${styles.section} ${styles.workflowSection}`} data-testid="landing-agent-workflow" aria-labelledby="agent-workflow"><div className="container"><Heading as="h2" id="agent-workflow">From intent to reviewable Java and evidence.</Heading><p className={styles.intro}>Capture a flow, review the Java it generates, and diagnose failures from the evidence. Engineers stay in control; leads get a release signal they can inspect.</p><AccessibleTabs id="agent-workflow-tabs" label="Agent-to-evidence workflow" tabs={workflowTabs} className={styles.tabs} tabListClassName={styles.tabList} tabClassName={styles.tab} panelClassName={styles.tabPanel} /><p className={styles.boundary}>Model choice remains with the MCP client. Tests remain ordinary Java. Proposals do not silently edit, approve, or merge.</p></div></section>

    <section className={styles.section} data-testid="landing-outcomes" aria-labelledby="outcomes-heading"><div className="container"><Heading as="h2" id="outcomes-heading">Pick your starting point</Heading><p className={styles.intro}>Most teams start with one of these three. Upgrading an older suite? The quick start also covers the <Link to="/docs/start/quick-start#existing-project-upgrade">existing-project upgrade</Link>.</p>
      <div className={styles.outcomeGrid}>{primaryOutcomes.map((outcome) => <article key={outcome.title}><Heading as="h3">{outcome.title}</Heading><p>{outcome.body}</p><Link to={outcome.to}>{outcome.action}</Link></article>)}</div>
      <div className={styles.outcomeMore}>{outcomeGroups.map(({group, items}) => <div key={group}><Heading as="h3">{group}</Heading><ul>{items.map((outcome) => <li key={outcome.title}><Link to={outcome.to}>{outcome.title}</Link><span>{outcome.body}</span></li>)}</ul></div>)}</div>
    </div></section>

    <section className={`${styles.section} ${styles.surfaceSection}`} data-testid="landing-surfaces" aria-labelledby="surface-explorer"><div className="container"><Heading as="h2" id="surface-explorer">One evidence model across six test surfaces</Heading><p className={styles.intro}>Each surface runs on its native engine. The suite, the API style, and the report stay the same.</p><AccessibleTabs id="surface-explorer-tabs" label="Testing surfaces" tabs={explorerTabs} className={styles.tabs} tabListClassName={styles.tabList} tabClassName={styles.tab} panelClassName={styles.tabPanel} /></div></section>

    <section className={`${styles.section} ${styles.trustSection}`} data-testid="landing-trust" aria-labelledby="trust-heading"><div className="container"><Heading as="h2" id="trust-heading">Open, current, and checked</Heading><div className={styles.trustGrid}>{trustSignals.map(([title, detail, href]) => <Link to={href} key={title}><strong>{title}</strong><span>{detail}</span></Link>)}</div>
      <div className={styles.faq}><Heading as="h3">Common questions</Heading>
        <details><summary>{homepageFaqs[0].question}</summary><p>Yes. SHAFT is open source under the <Link to={`${github}/blob/main/LICENSE`}>MIT license</Link>.</p></details>
        <details><summary>{homepageFaqs[1].question}</summary><p>No. Move an existing Maven suite onto current SHAFT and run one test first. <Link to="/docs/journeys/upgrade-a-project">Upgrade a project</Link>.</p></details>
        <details><summary>{homepageFaqs[2].question}</summary>{javaVersion ? <p>Java {javaVersion}. <Link to="/docs/start/installation">Installation</Link> lists the rest.</p> : <p><Link to="/docs/start/installation">Installation</Link> lists the supported Java version.</p>}</details>
      </div>
    </div></section>

    <section className={styles.final} id="get-started" data-testid="landing-final"><div className={`container ${styles.finalContent}`}><Heading as="h2">Write your first test today.</Heading><p>Generate a starter project, read the guide, or star the repo so other testers find it.</p><Ctas placement="final" /></div></section>

    <section className={styles.footer} data-testid="landing-footer" aria-label="Support and community"><div className="container"><section aria-labelledby="support-heading"><Heading as="h2" id="support-heading">Supported by</Heading><div className={styles.wordmarks}>{sponsors.map(({name, href, logo}) => <a href={href} key={name} target="_blank" rel="noreferrer"><img src={logo} width="160" height="48" loading="lazy" alt={`${name} logo`} />{name === 'JetBrains' && <span className={styles.wordmarkName} aria-hidden="true">JetBrains</span>}</a>)}</div><p className={styles.attribution}>Tooling and open-source program support only — not sponsorship or endorsement. JetBrains and the JetBrains logo are trademarks of JetBrains s.r.o. DXC Technology imagery is reproduced courtesy of DXC Technology; unauthorized use is not permitted.</p></section><section aria-labelledby="reported-heading"><Heading as="h2" id="reported-heading">Community-reported use</Heading><details className={styles.communityDetails}><summary>View community-reported use</summary><div className={styles.communityLogos}>{reportedUse.map(([name, href, logo]) => <a href={href} key={name} target="_blank" rel="noreferrer"><img src={logo} width="112" height="44" loading="lazy" alt={`${name} logo`} /><span>{name}</span></a>)}</div></details><p className={styles.disclaimer}>Organization names were reported through anonymous community surveys. This list is unaudited and does not imply endorsement.</p></section></div></section>
    <SharedImageViewer items={productImages} activeItem={activeImage} onClose={closeImage} />
  </main></Layout>;
}
