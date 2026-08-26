import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import CodeBlock from '@theme/CodeBlock';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSlack} from '@fortawesome/free-brands-svg-icons';
import {faArrowUpRightFromSquare, faBookOpen, faStar, faTerminal, faXmark} from '@fortawesome/free-solid-svg-icons';
import styles from './index.module.css';

type ConversionName = 'create_project' | 'explore_documentation' | 'star_github';
type Placement = 'hero' | 'final';
type Evidence = {title: string; body: string; image: string; alt: string};

const github = 'https://github.com/ShaftHQ/SHAFT_ENGINE';
const slack = 'https://join.slack.com/t/shaft-engine/shared_invite/zt-oii5i2gg-0ZGnih_Y34NjK7QqDn01Dw';

const evidence: Evidence[] = [
  {title: 'Passed steps, attached proof', body: 'Inspect actions and captured evidence in the same run.', image: '/img/evidence/allure-passed-evidence.png', alt: 'Real SHAFT Allure report showing a passed visual-validation test, expanded steps, and an opened screenshot attachment.'},
  {title: 'Failure context, ready to inspect', body: 'Move from the failed action to its screenshot and trace without reconstructing the run.', image: '/img/evidence/allure-failed-evidence.png', alt: 'Real SHAFT Allure report showing a failed browser action with its screenshot and exception evidence.'},
  {title: 'Visual evidence beside the result', body: 'Review the expected image, actual image, and deterministic OpenCV difference together.', image: '/img/evidence/allure-visual-diff-evidence.png', alt: 'Real SHAFT Allure visual-validation result with a native expected, actual, and difference attachment.'},
];

const trustSignals = [
  ['MIT license', 'Use and inspect SHAFT under a permissive open-source license.', `${github}/blob/main/LICENSE`],
  ['Build history', 'Review the same pull-request gate used by the project.', 'https://github.com/ShaftHQ/SHAFT_ENGINE/actions'],
  ['Security policy', 'Check supported versions and private disclosure guidance.', `${github}/security/policy`],
  ['Release history', 'Inspect published versions, dates, and changes.', `${github}/releases`],
  ['Selenium ecosystem', 'Find SHAFT in Selenium’s official ecosystem directory.', 'https://www.selenium.dev/ecosystem/#frameworks'],
  ['Peer Bonus', 'Review Google’s 2023 open-source recipient announcement.', 'https://opensource.googleblog.com/2023/05/google-open-source-peer-bonus-program-announces-first-group-of-winners-2023.html'],
  ['Execution evidence', 'Inspect passed, failed, and visual evidence from real SHAFT runs.', '#evidence-heading'],
];

const audienceLanes = [
  {title: 'For engineers', body: 'Keep native Java control while SHAFT owns repeatable suite mechanics.', points: ['Run browser, mobile, API, database, and CLI checks together.', 'Move lifecycle, synchronization, screenshots, and logs out of test intent.', 'Start debugging with evidence already attached.']},
  {title: 'For delivery leaders', body: 'Make automation results inspectable before they inform a release.', points: ['Use one onboarding path for new and existing projects.', 'Review steps, screenshots, traces, and diagnostics together.', 'Audit license, releases, CI, security, and support from primary sources.']},
];

const guidePaths = [
  ['First run', 'Generate a SHAFT project', 'Choose test surfaces and download a ready-to-run project.', '/project-generator', 'Open generator'],
  ['Quick start', 'Run your first test', 'Move from setup to an evidence report through one short guide.', '/docs/start/quick-start#choose-your-path', 'Read quick start'],
  ['Migration', 'Upgrade an existing suite', 'Adopt SHAFT by test surface without rewriting everything at once.', '/docs/start/quick-start#existing-project-upgrade', 'Plan the upgrade'],
  ['Expansion', 'Add another test surface', 'Bring mobile, API, database, CLI, or Grid evidence into the same run.', '#testing-surfaces', 'Compare surfaces'],
  ['Agentic', 'Connect MCP after the basics', 'Expose Capture, Doctor, Heal, and browser tools after the project compiles.', '/docs/start/quick-start#mcp-integration', 'Connect MCP'],
];

const testSurfaces = [
  ['Web GUI', 'Selenium + Playwright', 'Actions, synchronization, locators, screenshots, and report steps.'],
  ['Mobile GUI', 'Appium', 'Android, iOS, mobile web, emulators, real devices, and clouds.'],
  ['API', 'REST Assured', 'Requests, schemas, authentication, assertions, and payload evidence.'],
  ['Database', 'JDBC', 'Connections, queries, updates, and result validation.'],
  ['CLI', 'Local, Docker, SSH', 'Commands, containers, remote shells, files, and captured output.'],
];

const adoptionAnswers = [
  ['Move an existing suite', 'Adopt SHAFT by surface. Keep useful tests and migrate in controlled steps.', '/docs/start/quick-start#existing-project-upgrade', 'Read migration guidance'],
  ['Run where your team builds', 'Use the same Maven project on developer machines and CI.', '/docs/start/quick-start#choose-your-path', 'Review first-run guidance'],
  ['Keep native-tool access', 'Use underlying automation APIs directly when a case needs them.', '/docs/features/modules', 'Compare modules'],
  ['Evaluate stewardship', 'Inspect project terms, releases, security, CI, and public support.', '#project-evidence', 'Review project evidence'],
];

const evidenceLoop = [
  ['Execute', 'Run web, mobile, API, database, and CLI checks.'],
  ['Collect', 'Capture screenshots, logs, requests, responses, and data facts.'],
  ['Report', 'Keep the timeline and attachments in Allure.'],
  ['Diagnose', 'Use the report and Doctor to understand the failure path.'],
  ['Improve', 'Apply a deterministic fix; use Heal when evidence supports recovery.'],
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
  ['Solutions by STC', 'https://solutions.com.sa/', '/img/community/solutions-by-stc.svg'],
  ['GIZA Systems', 'https://gizasystems.com/', '/img/community/giza-systems.png'],
  ['Euronet', 'https://www.euronetworldwide.com/', '/img/community/euronet.png'],
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
];

function track(ctaName: ConversionName, placement: Placement, destination: string): void {
  if (typeof window === 'undefined') return;
  const browser = window as typeof window & {gtag?: (...args: unknown[]) => void};
  browser.gtag?.('event', 'landing_conversion', {cta_name: ctaName, placement, destination});
}

function TechnicalOrbit(): JSX.Element {
  return <svg className={styles.technicalOrbit} viewBox="0 0 720 520" aria-hidden="true" focusable="false"><ellipse cx="360" cy="260" rx="300" ry="116" /><ellipse cx="360" cy="260" rx="238" ry="188" transform="rotate(-24 360 260)" /><ellipse cx="360" cy="260" rx="156" ry="232" transform="rotate(34 360 260)" /><circle cx="646" cy="225" r="6" /><circle cx="173" cy="139" r="5" /><circle cx="424" cy="477" r="7" /></svg>;
}

function Ctas({placement}: {placement: Placement}): JSX.Element {
  const suffix = placement === 'hero' ? 'hero' : 'final';
  return <div className={styles.actions} data-testid={`landing-${suffix}-actions`}>
    <Link className="button button--primary button--lg" data-testid={`landing-${suffix}-create-project`} to="/project-generator" onClick={() => track('create_project', placement, '/project-generator')}><FontAwesomeIcon icon={faTerminal} aria-hidden="true" />Create new project</Link>
    <Link className="button button--secondary button--lg" data-testid={`landing-${suffix}-documentation`} to="/docs/start/overview" onClick={() => track('explore_documentation', placement, '/docs/start/overview')}><FontAwesomeIcon icon={faBookOpen} aria-hidden="true" />Explore documentation</Link>
    <a className="button button--secondary button--lg" data-testid={`landing-${suffix}-star`} href={github} target="_blank" rel="noreferrer" onClick={() => track('star_github', placement, github)}><FontAwesomeIcon icon={faStar} aria-hidden="true" />Star on GitHub</a>
  </div>;
}

function VisualEvidencePlate(): JSX.Element {
  return <div className={styles.visualPlate} aria-label="SHAFT visual comparison generated by the deterministic OpenCV engine">{[
    ['Expected', '/img/evidence/visual-expected.png', 'Expected SHAFT logo used by the visual comparison.'],
    ['Actual', '/img/evidence/visual-actual.png', 'Actual SHAFT logo with a controlled visual change.'],
    ['Difference', '/img/evidence/visual-difference.png', 'OpenCV difference highlighting changed logo pixels.'],
  ].map(([label, image, alt]) => <div key={label}><span>{label}</span><img src={image} width="1024" height="1024" loading="lazy" alt={alt} /></div>)}</div>;
}

function EvidenceTrigger({item, children, onOpen, hero = false}: {item: Evidence; children?: React.ReactNode; onOpen: (item: Evidence, opener: HTMLButtonElement) => void; hero?: boolean}): JSX.Element {
  return <button className={`${styles.evidenceMedia} ${hero ? styles.heroMedia : ''}`} type="button" aria-label={`Inspect ${item.title}`} onClick={(event) => onOpen(item, event.currentTarget)}>{children ?? <img src={item.image} width="1920" height="1333" loading={hero ? 'eager' : 'lazy'} fetchPriority={hero ? 'high' : 'auto'} alt={item.alt} />}<span className={styles.zoomHint}>Click to inspect</span></button>;
}

function EvidenceLightbox({item, dialogRef, onClose}: {item: Evidence | null; dialogRef: React.RefObject<HTMLDialogElement | null>; onClose: () => void}): JSX.Element {
  return <dialog ref={dialogRef} className={styles.lightbox} data-testid="evidence-lightbox" aria-labelledby="evidence-lightbox-title" onClose={onClose} onClick={(event) => { if (event.target === event.currentTarget) event.currentTarget.close(); }}>{item && <div className={styles.lightboxPanel}><button className={styles.lightboxClose} type="button" aria-label="Close evidence viewer" onClick={() => dialogRef.current?.close()}><FontAwesomeIcon icon={faXmark} aria-hidden="true" /></button><Heading as="h2" id="evidence-lightbox-title">{item.title}</Heading><p>{item.body}</p><img src={item.image} width="1920" height="1333" alt={item.alt} /></div>}</dialog>;
}

export default function Home(): JSX.Element {
  const [activeEvidence, setActiveEvidence] = React.useState<Evidence | null>(null);
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const openerRef = React.useRef<HTMLButtonElement | null>(null);
  const openEvidence = (item: Evidence, opener: HTMLButtonElement): void => { openerRef.current = opener; setActiveEvidence(item); };
  React.useEffect(() => { if (activeEvidence && dialogRef.current && !dialogRef.current.open) dialogRef.current.showModal(); }, [activeEvidence]);
  const closeEvidence = (): void => { setActiveEvidence(null); openerRef.current?.focus(); };

  return <Layout title="SHAFT Engine" description="Release decisions backed by inspectable test evidence."><main data-testid="landing-main">
    <header className={styles.hero} data-testid="landing-hero"><TechnicalOrbit /><div className={`container ${styles.heroLayout}`}><div className={styles.heroCopy}><div className={styles.logoPlate}><img className={styles.logo} src="/img/shaft.svg" width="92" height="92" alt="SHAFT" /></div><h1>Release decisions backed by inspectable evidence.</h1><p className={styles.lead}>Run across web, mobile, API, database, and CLI. Keep the evidence close to the decision it informs.</p><Ctas placement="hero" /></div><figure className={styles.heroFigure}><EvidenceTrigger item={evidence[0]} onOpen={openEvidence} hero /><figcaption><strong>Real SHAFT execution.</strong> Open the report evidence and inspect it.</figcaption></figure></div></header>

    <section className={`${styles.section} ${styles.trustSection}`} data-testid="landing-trust" aria-labelledby="project-evidence"><div className="container"><Heading as="h2" id="project-evidence">Verify the project before you adopt it</Heading><div className={styles.trustGrid}>{trustSignals.map(([title, detail, href]) => <a href={href} key={title} target="_blank" rel="noreferrer"><strong>{title}</strong><span>{detail}</span><FontAwesomeIcon icon={faArrowUpRightFromSquare} aria-hidden="true" /></a>)}</div></div></section>

    <section className={styles.section} aria-labelledby="evidence-heading" data-testid="landing-evidence"><div className="container"><Heading as="h2" id="evidence-heading">Evidence that survives scrutiny</Heading><p className={styles.intro}>Steps, attachments, diagnostics, and visual checks remain inspectable after the run.</p><div className={styles.evidenceGrid}>{evidence.map((item, index) => <figure className={styles.evidenceCard} key={item.title}><EvidenceTrigger item={item} onOpen={openEvidence}>{index === 2 ? <VisualEvidencePlate /> : undefined}</EvidenceTrigger><figcaption><strong>{item.title}</strong><span>{item.body}</span></figcaption></figure>)}</div></div></section>

    <section className={`${styles.section} ${styles.audienceSection}`} data-testid="landing-audiences" aria-labelledby="audiences-heading"><div className="container"><Heading as="h2" id="audiences-heading">Useful at the keyboard and in the release room</Heading><div className={styles.audienceGrid}>{audienceLanes.map((lane) => <article key={lane.title}><Heading as="h3">{lane.title}</Heading><p>{lane.body}</p><ul>{lane.points.map((point) => <li key={point}>{point}</li>)}</ul></article>)}</div></div></section>

    <section className={styles.section} data-testid="landing-guides" aria-labelledby="guides-heading"><div className="container"><Heading as="h2" id="guides-heading">Choose the shortest path to evidence</Heading><div className={styles.guideGrid}>{guidePaths.map(([audience, title, description, to, label]) => <article key={title}><span className={styles.pathLabel}>{audience}</span><Heading as="h3">{title}</Heading><p>{description}</p><Link to={to}>{label}<span aria-hidden="true"> →</span></Link></article>)}</div></div></section>

    <section className={`${styles.section} ${styles.surfaceSection}`} data-testid="landing-surfaces" aria-labelledby="testing-surfaces"><div className="container"><Heading as="h2" id="testing-surfaces">One evidence model across five test surfaces</Heading><div className={styles.surfaceGrid}>{testSurfaces.map(([name, engine, detail]) => <article key={name}><Heading as="h3">{name}</Heading><strong>{engine}</strong><p>{detail}</p></article>)}</div></div></section>

    <section className={styles.section} data-testid="landing-product-gallery" aria-labelledby="product-heading"><div className="container"><Heading as="h2" id="product-heading">Move from observation to maintainable automation</Heading><div className={styles.productGrid}><figure><img src="/img/capture-locator-picker.png" width="1600" height="900" loading="lazy" alt="SHAFT Capture showing locator inspection and captured browser evidence." /><figcaption><strong>Capture the real interaction</strong><span>Record browser activity, inspect locators, and retain evidence for generation.</span></figcaption></figure><figure><img src="/img/agentic/intellij-plugin-assistant.png" width="1600" height="900" loading="lazy" alt="SHAFT IntelliJ Assistant showing agentic project guidance inside the IDE." /><figcaption><strong>Keep guidance in the IDE</strong><span>Connect project context, MCP tools, and focused assistance where engineers work.</span></figcaption></figure></div></div></section>

    <section className={`${styles.section} ${styles.architectureSection}`} data-testid="landing-architecture" aria-labelledby="architecture-heading"><div className="container"><div><Heading as="h2" id="architecture-heading">Write intent. Keep control.</Heading><p>SHAFT reduces repeated lifecycle and evidence plumbing without hiding the native engines beneath it.</p><ul><li>Driver lifecycle, waits, retries, and synchronization</li><li>Screenshots, logs, steps, and attachments</li><li>Configuration and data isolation</li><li>Allure evidence that Doctor and Heal can inspect</li></ul></div><CodeBlock language="java" title="A readable SHAFT test">{`driver.browser().navigateToURL(appUrl);\ndriver.element().type(username, user);\ndriver.element().click(signIn);\ndriver.element().assertThat(home).exists();`}</CodeBlock></div></section>

    <section className={styles.section} data-testid="landing-adoption" aria-labelledby="adoption-heading"><div className="container"><Heading as="h2" id="adoption-heading">Adopt without a rewrite mandate</Heading><div className={styles.adoptionGrid}>{adoptionAnswers.map(([title, body, to, label]) => <article key={title}><Heading as="h3">{title}</Heading><p>{body}</p><Link to={to}>{label}<span aria-hidden="true"> →</span></Link></article>)}</div></div></section>

    <section className={`${styles.section} ${styles.loopSection}`} data-testid="landing-evidence-loop" aria-labelledby="loop-heading"><div className="container"><Heading as="h2" id="loop-heading">Evidence improves the next run</Heading><ol className={styles.evidenceLoop}>{evidenceLoop.map(([title, body]) => <li key={title}><strong>{title}</strong><span>{body}</span></li>)}</ol><p>Visual comparison is deterministic. <Link to="/docs/agentic/heal">AI-assisted Heal</Link> is a separate recovery capability; <Link to="/docs/agentic/doctor">Doctor</Link> explains evidence-backed failure paths; <Link to="/docs/start/quick-start#mcp-integration">MCP</Link> connects those tools to supported assistants.</p></div></section>

    <section className={styles.final} id="get-started" data-testid="landing-final"><TechnicalOrbit /><div className={`container ${styles.finalContent}`}><Heading as="h2">Start with a project. Keep the evidence.</Heading><p>Generate a focused starter, examine the documentation, or follow development on GitHub.</p><Ctas placement="final" /></div></section>

    <footer className={styles.footer} data-testid="landing-footer"><div className="container"><section aria-labelledby="support-heading"><Heading as="h2" id="support-heading">Supported by</Heading><div className={styles.wordmarks}>{sponsors.map(({name, href, logo}) => <a href={href} key={name} target="_blank" rel="noreferrer"><img src={logo} width="160" height="48" loading="lazy" alt={`${name} logo`} /></a>)}</div><p className={styles.attribution}>JetBrains and the JetBrains logo are trademarks of JetBrains s.r.o. DXC Technology imagery is reproduced courtesy of DXC Technology; unauthorized use is not permitted.</p></section><section aria-labelledby="reported-heading"><Heading as="h2" id="reported-heading">Community-reported use</Heading><div className={styles.communityLogos}>{reportedUse.map(([name, href, logo]) => <a href={href} key={name} target="_blank" rel="noreferrer"><img src={logo} width="112" height="44" loading="lazy" alt={`${name} logo`} /><span>{name}</span></a>)}</div><p className={styles.disclaimer}>Organization names were reported through anonymous community surveys. This list is unaudited and does not imply endorsement.</p></section><nav className={styles.footerLinks} aria-label="Community links"><a href={slack} target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faSlack} aria-hidden="true" />Slack</a><a href={github} target="_blank" rel="noreferrer" aria-label="Star SHAFT on GitHub"><FontAwesomeIcon icon={faStar} aria-hidden="true" />GitHub</a></nav></div></footer>
    <EvidenceLightbox item={activeEvidence} dialogRef={dialogRef} onClose={closeEvidence} />
  </main></Layout>;
}
