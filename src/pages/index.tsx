import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import CodeBlock from '@theme/CodeBlock';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSlack} from '@fortawesome/free-brands-svg-icons';
import {faArrowUpRightFromSquare, faBookOpen, faRotateLeft, faStar, faTerminal} from '@fortawesome/free-solid-svg-icons';
import releases from '@site/src/data/releases.json';
import snippets from '@site/src/data/snippets.json';
import styles from './index.module.css';

const slackInviteUrl = 'https://join.slack.com/t/shaft-engine/shared_invite/zt-oii5i2gg-0ZGnih_Y34NjK7QqDn01Dw';
const heroMeta = ['io.github.shafthq : shaft-engine'];

const trustSignals = [
  {
    title: 'MIT license',
    detail: 'Use, inspect, and adapt the framework under a permissive open-source license.',
    href: 'https://github.com/ShaftHQ/SHAFT_ENGINE/blob/main/LICENSE',
  },
  {
    title: 'Maven Central',
    detail: 'Published Java artifacts are available from the standard public package repository.',
    href: 'https://central.sonatype.com/artifact/io.github.shafthq/shaft-engine',
    icon: true,
  },
  {
    title: 'Build history',
    detail: 'Inspect the project pull-request gate and its recent results on GitHub Actions.',
    href: 'https://github.com/ShaftHQ/SHAFT_ENGINE/actions/workflows/pr-gate.yml',
  },
  {
    title: 'Security policy',
    detail: 'Review supported versions and the private vulnerability-reporting path.',
    href: 'https://github.com/ShaftHQ/SHAFT_ENGINE/security/policy',
  },
  {
    title: 'Release history',
    detail: 'Review tagged releases, dates, and change notes before you upgrade.',
    href: 'https://github.com/ShaftHQ/SHAFT_ENGINE/releases',
  },
  {
    title: 'Selenium ecosystem',
    detail: 'SHAFT is listed in Selenium’s official ecosystem directory of test frameworks.',
    href: 'https://www.selenium.dev/ecosystem/#frameworks',
    icon: true,
  },
  {
    title: 'Google Open Source Peer Bonus',
    detail: 'Project maintainer Mohab Mohie appears in Google’s 2023 peer-bonus recipient announcement.',
    href: 'https://opensource.googleblog.com/2023/05/google-open-source-peer-bonus-program-announces-first-group-of-winners-2023.html',
    icon: true,
  },
  {
    title: 'Community support',
    detail: 'Ask implementation questions in the public SHAFT Slack community.',
    href: slackInviteUrl,
  },
];

const audienceLanes = [
  {
    title: 'For engineers',
    description: 'Keep native Java control while SHAFT owns repeatable suite mechanics.',
    points: [
      'Use Selenium, Playwright, Appium, REST Assured, JDBC, and CLI from one framework.',
      'Move waits, lifecycle, screenshots, logs, and report steps out of test intent.',
      'Start a failure investigation with artifacts attached to the run.',
    ],
  },
  {
    title: 'For delivery leaders',
    description: 'Make the automation result inspectable before it informs a release decision.',
    points: [
      'Use one onboarding path for new projects, migrations, and additional test surfaces.',
      'Review steps, screenshots, logs, and diagnostics in the same evidence trail.',
      'Check license, releases, CI history, security, and community support from primary sources.',
    ],
  },
];

const guidePaths = [
  {
    audience: 'First run',
    title: 'Generate a SHAFT project',
    description: 'Choose your test surfaces and download a ready-to-run Maven project.',
    label: 'Open generator',
    to: '/project-generator',
  },
  {
    audience: 'Quick start',
    title: 'Run your first test',
    description: 'Follow the short path from project setup to an evidence report.',
    label: 'Read quick start',
    to: '/docs/start/quick-start#choose-your-path',
  },
  {
    audience: 'Migration',
    title: 'Upgrade an existing project',
    description: 'Move Selenium, Appium, REST Assured, Cucumber, or older SHAFT suites in controlled steps.',
    label: 'Plan the upgrade',
    to: '/docs/start/quick-start#existing-project-upgrade',
  },
  {
    audience: 'Expansion',
    title: 'Add coverage beyond the browser',
    description: 'Add mobile, API, CLI, database, or Grid checks when the product needs them.',
    label: 'Compare surfaces',
    to: '#testing-surfaces',
  },
  {
    audience: 'Agentic',
    title: 'Connect MCP after the basics',
    description: 'Expose browser, Capture, Doctor, and Heal tools after the project compiles.',
    label: 'Connect MCP',
    to: '/docs/start/quick-start#mcp-integration',
  },
];

const testSurfaces = [
  ['Web GUI', 'Selenium + Playwright', 'Browser actions, synchronization, locators, screenshots, logs, and report steps.'],
  ['Mobile GUI', 'Appium', 'Android, iOS, mobile web, Flutter, emulators, real devices, and device clouds.'],
  ['API', 'REST Assured', 'Requests, extraction, schemas, authentication, assertions, and attached payload evidence.'],
  ['Database', 'JDBC', 'Connections, queries, updates, and result validation beside the product flow.'],
  ['CLI', 'Local, Docker, SSH', 'Terminal, container, SSH, and file actions with output preserved in the run.'],
];

const proofPoints = [
  {
    title: 'Native engines stay visible',
    description: 'Use the underlying Selenium, Playwright, Appium, REST Assured, TestNG, JUnit, and Cucumber APIs when direct control matters.',
    label: 'Review the technology map',
    to: '/docs/features/modules#technology',
  },
  {
    title: 'Dependencies stay aligned',
    description: 'Start with the engine artifact for unified defaults, or use the SHAFT BOM to keep selected modules on matching versions.',
    label: 'Review module choices',
    to: '/docs/features/modules',
  },
  {
    title: 'Evidence follows every surface',
    description: 'Keep screenshots, logs, requests, responses, and diagnostics attached to the same run and reporting lifecycle.',
    label: 'Review reporting',
    to: '/docs/features/reporting',
  },
];

const evidenceLoop = [
  ['Execute', 'Run web, mobile, API, database, and CLI checks from one Java project.'],
  ['Collect', 'Capture screenshots, logs, requests, responses, and data facts.'],
  ['Report', 'Place the timeline and attachments in an Allure evidence trail.'],
  ['Diagnose', 'Use the report and Doctor to understand the failure path.'],
  ['Improve', 'Apply a deterministic fix, then use Heal when the evidence supports it.'],
];

const adoptionAnswers = [
  {
    title: 'Move an existing suite',
    body: 'Use the existing-project path to update dependencies and adopt SHAFT by test surface. You do not need to rewrite every test at once.',
    to: '/docs/start/quick-start#existing-project-upgrade',
    label: 'Read the migration path',
  },
  {
    title: 'Run where your team already builds',
    body: 'SHAFT projects use Maven and run from developer machines or CI. The framework keeps the same evidence model across those environments.',
    to: '/docs/start/quick-start#choose-your-path',
    label: 'Review the first-run path',
  },
  {
    title: 'Extend without replacing native tools',
    body: 'Add only the modules your suite needs and keep direct access to the underlying automation libraries when a case calls for it.',
    to: '/docs/features/modules',
    label: 'Compare modules',
  },
  {
    title: 'Evaluate support and stewardship',
    body: 'Inspect the MIT terms, release history, security policy, CI results, and public support channels before adoption.',
    to: '#project-evidence',
    label: 'Review project evidence',
  },
];

const footerBadges = [
  ['Java 25', 'Current baseline'],
  ['MIT licensed', 'Open source'],
  ['Published artifacts', 'Central repository'],
  ['Allure reporting', 'Run evidence'],
  ['Modular design', 'Choose surfaces'],
];

const codeCompare = {
  handled: [
    'driver lifecycle, waits, retries, and synchronization',
    'screenshots, logs, steps, and attachments',
    'configuration and data isolation',
    'Allure evidence that Doctor and Heal can inspect',
  ],
};

function useScrollReveal(): void {
  React.useEffect(() => {
    const root = document.documentElement;
    const revealElements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    root.dataset.revealReady = 'true';

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      revealElements.forEach((element) => element.classList.add(styles.revealVisible));
      return () => { delete root.dataset.revealReady; };
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const element = entry.target as HTMLElement;
        if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
          element.classList.add(styles.revealVisible);
          element.dataset.revealState = 'revealed';
        } else {
          element.classList.remove(styles.revealVisible);
          element.dataset.revealState = 'rolled-back';
        }
      });
    }, {rootMargin: '-8% 0px -10% 0px', threshold: [0, 0.12, 0.24]});

    revealElements.forEach((element) => {
      const groupIndex = element.parentElement ? Array.from(element.parentElement.children).indexOf(element) : 0;
      element.style.setProperty('--reveal-delay', `${Math.min(groupIndex * 34, 240)}ms`);
      observer.observe(element);
    });
    return () => { observer.disconnect(); delete root.dataset.revealReady; };
  }, []);
}

function useHoverGlow(): void {
  React.useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-hover-glow]'));
    const rects = new WeakMap<HTMLElement, DOMRect>();
    const cacheRect = (event: PointerEvent) => rects.set(event.currentTarget as HTMLElement, (event.currentTarget as HTMLElement).getBoundingClientRect());
    const updatePointer = (event: PointerEvent) => {
      const target = event.currentTarget as HTMLElement;
      const rect = rects.get(target) ?? target.getBoundingClientRect();
      target.style.setProperty('--hover-x', `${event.clientX - rect.left}px`);
      target.style.setProperty('--hover-y', `${event.clientY - rect.top}px`);
    };
    targets.forEach((target) => {
      target.addEventListener('pointerenter', cacheRect, {passive: true});
      target.addEventListener('pointermove', updatePointer, {passive: true});
    });
    return () => targets.forEach((target) => {
      target.removeEventListener('pointerenter', cacheRect);
      target.removeEventListener('pointermove', updatePointer);
    });
  }, []);
}

function JavaCodeExample(): JSX.Element {
  return (
    <pre className="language-java" data-testid="landing-java-code"><code className="language-java">
      <span className={styles.codeLine}><span className={styles.codeAnnotation}>@Test</span></span>
      <span className={styles.codeLine}><span className={styles.codeKeyword}>public</span>{' '}<span className={styles.codeKeyword}>void</span>{' '}<span className={styles.codeFunction}>checkout_happy_path</span>() {'{'}</span>
      <span className={styles.codeLine}>{'  '}driver.<span className={styles.codeCall}>element</span>().<span className={styles.codeCall}>click</span>(addToCart)</span>
      <span className={styles.codeLine}>{'        '}.<span className={styles.codeCall}>and</span>().<span className={styles.codeCall}>click</span>(checkout)</span>
      <span className={styles.codeLine}>{'        '}.<span className={styles.codeCall}>and</span>().<span className={styles.codeCall}>assertThat</span>(orderStatus)</span>
      <span className={styles.codeLine}>{'        '}.<span className={styles.codeCall}>text</span>().<span className={styles.codeCall}>contains</span>(<span className={styles.codeString}>&quot;Success&quot;</span>);</span>
      <span className={styles.codeLine}>{'}'}</span>
    </code></pre>
  );
}

function CodeCompare(): JSX.Element {
  return (
    <div className={styles.codeCompare} data-testid="landing-code-proof" role="group" aria-label="SHAFT test code proof">
      <figure className={styles.codePanel}>
        <figcaption><span className={styles.chromeDots} aria-hidden="true"><i /><i /><i /></span>CheckoutTest.java<span className={styles.statusChip}>Pass</span></figcaption>
        <JavaCodeExample />
      </figure>
      <div className={styles.handledPanel}>
        <span>SHAFT handles <span className={styles.statusChip}>evidence attached</span></span>
        <ul>{codeCompare.handled.map((item) => <li key={item}>{item}</li>)}</ul>
      </div>
    </div>
  );
}

function Hero(): JSX.Element {
  return (
    <header className={styles.hero} data-testid="landing-hero" id="top">
      <div className={`container ${styles.heroLayout}`}>
        <div className={styles.heroCopy}>
          <div className={styles.heroIdentity}>
            <img className={styles.heroLogo} src="/img/shaft.svg" width={112} height={112} alt="SHAFT S logo" />
            <span className={styles.heroBrand}>SHAFT</span>
          </div>
          <p className={styles.heroMeta} role="group" aria-label="Project coordinates">{heroMeta.map((fact) => <span key={fact}>{fact}</span>)}</p>
          <h1>Reliable automation evidence for every release.</h1>
          <p><strong>One Java framework for web, mobile, API, database, and CLI testing.</strong>{' '}Keep native tool control while SHAFT standardizes synchronization, lifecycle, and report evidence.</p>
          <div className={styles.actions} data-testid="landing-hero-actions">
            <Link className={`button button--primary button--lg ${styles.hoverGlow}`} data-testid="landing-hero-generator-cta" data-hover-glow to="/project-generator"><FontAwesomeIcon icon={faTerminal} aria-hidden="true" />Generate a free project</Link>
            <Link className={`button button--secondary button--lg ${styles.hoverGlow}`} data-testid="landing-hero-quickstart-cta" data-hover-glow to="/docs/start/quick-start#choose-your-path"><FontAwesomeIcon icon={faBookOpen} aria-hidden="true" />Read quick start</Link>
          </div>
          <p className={styles.generatorPromise}><strong>No account. No payment details.</strong> Choose your surfaces, download a ready-to-run Maven project, and produce your first evidence report.</p>
          <div className={styles.heroTrustLinks} role="group" aria-label="Community actions">
            <a className={styles.heroTrustLink} data-testid="landing-hero-star-cta" href={snippets.githubRepository} target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faStar} aria-hidden="true" />Star on GitHub</a>
            <a className={styles.heroTrustLink} data-testid="landing-hero-slack-cta" href={slackInviteUrl} target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faSlack} aria-hidden="true" />Join Slack</a>
          </div>
        </div>
        <figure className={styles.heroEvidence} data-testid="landing-allure-evidence">
          <div className={styles.evidenceHeader}><span>Real SHAFT report</span><strong>Run health across launches</strong></div>
          <img src="/img/allure-shaft-report-dashboard.png" width={1265} height={712} fetchPriority="high" alt="Branded Allure report showing the SHAFT logo, current-status pie chart, and execution history" />
          <figcaption>A fresh SHAFT run rendered in Allure: current status and six-launch execution history in one branded dashboard.</figcaption>
        </figure>
      </div>
    </header>
  );
}

function TrustSection(): JSX.Element {
  return (
    <section className={`${styles.trustSection} ${styles.reveal}`} data-testid="landing-trust" aria-labelledby="project-evidence" data-reveal>
      <div className="container">
        <div className={styles.trustIntro}><Heading as="h2" id="project-evidence">Verify before you adopt</Heading><p>Every signal below links to its primary source.</p></div>
        <div className={styles.trustGrid}>
          {trustSignals.map((signal) => (
            <a key={signal.title} className={styles.trustItem} href={signal.href} target="_blank" rel="noreferrer">
              <strong>{signal.title}{signal.icon && <FontAwesomeIcon icon={faArrowUpRightFromSquare} aria-hidden="true" />}</strong>
              <span>{signal.detail}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function AudienceSection(): JSX.Element {
  return (
    <section className={`${styles.section} ${styles.audienceSection} ${styles.reveal}`} data-testid="landing-audience-split" id="audience-section" data-reveal>
      <div className="container">
        <div className={`${styles.sectionHeading} ${styles.centerHeading}`}><span className={styles.eyebrow}>One evidence model</span><Heading as="h2" id="audience-section-heading">Technical control for engineers. Inspectable results for leaders.</Heading></div>
        <div className={styles.audienceGrid}>{audienceLanes.map((lane) => <section key={lane.title} className={`${styles.audienceLane} ${styles.hoverGlow}`} data-hover-glow><h3>{lane.title}</h3><p>{lane.description}</p><ul>{lane.points.map((point) => <li key={point}>{point}</li>)}</ul></section>)}</div>
      </div>
    </section>
  );
}

function GuidePathSection(): JSX.Element {
  return (
    <section className={`${styles.section} ${styles.pathSection} ${styles.reveal}`} data-testid="landing-pathfinder" id="guide-paths" data-reveal>
      <div className="container">
        <div className={`${styles.sectionHeading} ${styles.centerHeading}`}><span className={styles.eyebrow}>Adopt in controlled steps</span><Heading as="h2" id="guide-paths-heading">Start with the path that matches your team.</Heading><p>Generate a project, run it, inspect the evidence, then add only what your suite needs.</p></div>
        <div className={styles.dependencySnippet} data-testid="landing-dependency-snippet"><p className={styles.dependencyLabel}>Canonical engine coordinate</p><CodeBlock language="xml">{`<dependency>\n  <groupId>io.github.shafthq</groupId>\n  <artifactId>shaft-engine</artifactId>\n  <version>${releases.engineVersion}</version>\n</dependency>`}</CodeBlock></div>
        <div className={styles.pathGrid} role="group" aria-labelledby="guide-paths-heading">{guidePaths.map((path) => <Link className={`${styles.pathCard} ${styles.reveal} ${styles.hoverGlow}`} to={path.to} key={path.title} data-reveal data-hover-glow><small>{path.audience}</small><strong>{path.title}</strong><span>{path.description}</span><em>{path.label}</em></Link>)}</div>
      </div>
    </section>
  );
}

function SurfaceSection(): JSX.Element {
  return (
    <section className={`${styles.section} ${styles.surfaceSection} ${styles.reveal}`} data-testid="landing-surfaces" id="surface-section" data-reveal>
      <div className="container"><div className={styles.sectionHeading}><span className={styles.eyebrow}>Testing surfaces</span><Heading as="h2" id="testing-surfaces">One framework. Five testing surfaces.</Heading><p>Expand coverage without changing the project’s configuration, lifecycle, or reporting model.</p></div><div className={styles.surfaceMatrix} data-testid="landing-surface-matrix" role="group" aria-label="SHAFT testing surfaces">{testSurfaces.map(([title, stack, description]) => <div className={styles.surfaceRow} key={title}><strong>{title}</strong><span>{description}</span><small>{stack}</small></div>)}</div></div>
    </section>
  );
}

function ProductEvidenceSection(): JSX.Element {
  return (
    <section className={`${styles.section} ${styles.productSection} ${styles.reveal}`} data-testid="landing-product-evidence" id="product-evidence" data-reveal>
      <div className="container"><div className={`${styles.sectionHeading} ${styles.centerHeading}`}><span className={styles.eyebrow}>Real product surfaces</span><Heading as="h2">Inspect the workflow, not a mockup.</Heading><p>These screenshots come from SHAFT’s report, browser capture, and IntelliJ tooling.</p></div><div className={styles.productGallery}>
        <figure className={styles.productFrame}><img src="/img/capture-locator-picker.png" width={1280} height={900} loading="lazy" alt="SHAFT Capture locator picker ranking stable locators for a checkout button" /><figcaption><strong>Capture reliable locators</strong><span>Rank locator strategies with stability and uniqueness signals before pinning one to the workflow.</span></figcaption></figure>
        <figure className={styles.productFrame}><img src="/img/agentic/intellij-plugin-assistant.png" width={860} height={780} loading="lazy" alt="SHAFT IntelliJ assistant showing an automation request and generated Java test" /><figcaption><strong>Keep assistance in the IDE</strong><span>Record, generate, diagnose, and refine work from the SHAFT IntelliJ assistant with the project context visible.</span></figcaption></figure>
      </div></div>
    </section>
  );
}

function ProofSection(): JSX.Element {
  return (
    <section className={`${styles.section} ${styles.reveal}`} data-testid="landing-proof" id="proof-section" data-reveal>
      <div className="container"><div className={styles.sectionHeading}><span className={styles.eyebrow}>Architecture proof</span><Heading as="h2" id="why-shaft">Readable test intent. Shared lifecycle and evidence.</Heading><p>SHAFT owns repeatable mechanics while the underlying automation engines remain available.</p></div><CodeCompare /><div className={styles.proofGrid}>{proofPoints.map((point) => <Link className={`${styles.proofCard} ${styles.reveal} ${styles.hoverGlow}`} to={point.to} key={point.title} data-reveal data-hover-glow><strong>{point.title}</strong><span>{point.description}</span><small>{point.label}</small></Link>)}</div></div>
    </section>
  );
}

function AdoptionSection(): JSX.Element {
  return (
    <section className={`${styles.section} ${styles.adoptionSection} ${styles.reveal}`} data-testid="landing-adoption-answers" id="adoption-answers" data-reveal>
      <div className={`container ${styles.adoptionLayout}`}><div className={styles.sectionHeading}><span className={styles.eyebrow}>Adoption questions</span><Heading as="h2">Resolve risk before the pilot.</Heading><p>Use the implementation paths and primary-source project evidence to decide whether SHAFT fits your team.</p></div><div className={styles.answerList}>{adoptionAnswers.map((answer) => <article className={styles.answerItem} key={answer.title}><h3>{answer.title}</h3><p>{answer.body}</p><Link to={answer.to}>{answer.label}</Link></article>)}</div></div>
    </section>
  );
}

function AgentSection(): JSX.Element {
  return (
    <section className={`${styles.section} ${styles.agentBand} ${styles.reveal}`} data-testid="landing-agent" id="connect-ai-agent" data-reveal>
      <div className={`container ${styles.agentSection}`}><div className={styles.sectionHeading}><span className={styles.eyebrow}>Diagnostic loop</span><Heading as="h2">Turn a failed check into an explainable path.</Heading><p>Run the suite, collect the artifacts, diagnose the path, and improve the check using the same evidence trail.</p></div><div className={styles.evidenceLoop} data-testid="landing-evidence-loop" role="group" aria-label="SHAFT evidence loop">{evidenceLoop.map(([title, description], index) => <div className={`${styles.loopStep} ${styles.hoverGlow}`} key={title} data-hover-glow><small>{String(index + 1).padStart(2, '0')}</small><strong>{title}</strong><span>{description}</span></div>)}</div><p className={styles.loopReturn} data-testid="landing-evidence-loop-return"><FontAwesomeIcon icon={faRotateLeft} aria-hidden="true" />Improve loops back to Execute. Every run repeats the cycle.</p><div className={styles.featureLinks} data-testid="landing-agent-links"><Link data-testid="landing-agent-mcp-link" to="/docs/agentic/mcp">MCP setup and commands</Link><Link to="/docs/agentic/doctor">Diagnose with Doctor</Link><Link to="/docs/agentic/heal">Recover with Heal</Link></div></div>
    </section>
  );
}

function FinalCta(): JSX.Element {
  return (
    <section className={`${styles.finalCta} ${styles.reveal}`} data-testid="landing-final" id="get-started" data-reveal>
      <div className={`container ${styles.finalCtaInner}`}><p className={styles.finalKicker}>no account · no payment details · Maven project</p><h2>Generate a free SHAFT project.</h2><p>Choose the surfaces you need, download the project, and inspect the evidence from your first run.</p><div className={styles.actions}><Link className={`button button--primary button--lg ${styles.hoverGlow}`} data-testid="landing-cta-generator" data-hover-glow to="/project-generator"><FontAwesomeIcon icon={faTerminal} aria-hidden="true" />Generate a free project</Link><a className={`button button--secondary button--lg ${styles.hoverGlow}`} data-testid="landing-cta-star" data-hover-glow href={snippets.githubRepository} target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faStar} aria-hidden="true" />Star on GitHub</a><a className={`button button--secondary button--lg ${styles.hoverGlow}`} data-testid="landing-cta-slack" data-hover-glow href={slackInviteUrl} target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faSlack} aria-hidden="true" />Join Slack</a></div></div>
    </section>
  );
}

function LandingFooter(): JSX.Element {
  return (
    <footer className={styles.landingFooter} data-testid="landing-footer"><div className={`container ${styles.footerBadges}`} role="group" aria-label="SHAFT project facts">{footerBadges.map(([title, detail]) => <span key={title}><strong>{title}</strong><small>{detail}</small></span>)}</div><div className={`container ${styles.footerLinks}`}><small>© {new Date().getFullYear()} SHAFT Engine.</small><a href={snippets.githubRepository} target="_blank" rel="noreferrer">GitHub<FontAwesomeIcon icon={faArrowUpRightFromSquare} aria-hidden="true" /></a><a href="https://github.com/ShaftHQ/SHAFT_ENGINE/discussions" target="_blank" rel="noreferrer">Discussions<FontAwesomeIcon icon={faArrowUpRightFromSquare} aria-hidden="true" /></a><a href="https://github.com/ShaftHQ/SHAFT_ENGINE/blob/main/LICENSE" target="_blank" rel="noreferrer">License<FontAwesomeIcon icon={faArrowUpRightFromSquare} aria-hidden="true" /></a><a href="#top">Back to top</a></div></footer>
  );
}

export default function Home(): JSX.Element {
  useScrollReveal();
  useHoverGlow();
  return (
    <Layout title="Reliable Java Test Automation Evidence" description="SHAFT is an open-source Java test automation framework for web, mobile, API, database, and CLI checks with inspectable run evidence." noFooter>
      <main data-testid="landing-main"><Hero /><TrustSection /><AudienceSection /><GuidePathSection /><SurfaceSection /><ProductEvidenceSection /><ProofSection /><AdoptionSection /><AgentSection /><FinalCta /></main>
      <LandingFooter />
    </Layout>
  );
}
