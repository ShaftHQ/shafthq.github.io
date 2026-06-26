import React from 'react';
import Link from '@docusaurus/Link';
import BrowserOnly from '@docusaurus/BrowserOnly';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBookOpen, faStar, faTerminal} from '@fortawesome/free-solid-svg-icons';
import ParticleBackground from '@site/src/components/ParticleBackground';
import snippets from '@site/src/data/snippets.json';
import styles from './index.module.css';

const testSurfaces = [
  {
    title: 'Web GUI',
    description: 'Selenium and Playwright browser checks with synchronization, smart locators, and evidence.',
    to: '/docs/testing/web',
  },
  {
    title: 'Mobile GUI',
    description: 'Appium flows for Android, iOS, mobile web, Flutter, real devices, emulators, and cloud devices.',
    to: '/docs/testing/mobile',
  },
  {
    title: 'API',
    description: 'REST Assured requests, extraction, schemas, auth, and assertions in the same report.',
    to: '/docs/testing/api',
  },
  {
    title: 'CLI',
    description: 'Local, Docker, SSH, and file-system actions with attached evidence.',
    to: '/docs/testing/cli',
  },
  {
    title: 'Database',
    description: 'JDBC connections, queries, updates, and result validation.',
    to: '/docs/testing/database',
  },
];

const proofPoints = [
  {
    title: 'Native engines stay native',
    description: 'Use Selenium, Playwright, Appium, REST Assured, TestNG, JUnit, and Cucumber directly when control matters.',
    label: 'Technology map',
    to: '/docs/features/technology',
  },
  {
    title: 'Suite plumbing moves out of tests',
    description: 'Synchronization, configuration, smart locators, screenshots, logs, and Allure steps live in the framework.',
    label: 'Feature map',
    to: '/docs/features/modules',
  },
  {
    title: 'Failures start with evidence',
    description: 'Web, mobile, API, CLI, and DB actions attach evidence that Doctor and Heal can use for recovery.',
    label: 'Reporting guide',
    to: '/docs/features/reporting',
  },
];

const heroEngines = [
  {
    label: 'Web GUI',
    engine: 'Selenium WebDriver',
    to: '/docs/testing/web',
  },
  {
    label: 'Native mobile GUI',
    engine: 'Appium',
    to: '/docs/testing/mobile',
  },
  {
    label: 'API testing',
    engine: 'REST Assured',
    to: '/docs/testing/api',
  },
];

const guidePaths = [
  {
    audience: 'First run',
    title: 'Start a new SHAFT project',
    description: 'Generate a ready Maven project.',
    label: 'Generate project',
    to: '/docs/start/quick-start#new-project-generation',
  },
  {
    audience: 'Migration',
    title: 'Upgrade an existing project',
    description: 'Move Selenium, Appium, REST Assured, Cucumber, or older SHAFT suites onto modular SHAFT.',
    label: 'Upgrade project',
    to: '/docs/start/quick-start#existing-project-upgrade',
  },
  {
    audience: 'Expansion',
    title: 'Add coverage beyond the browser',
    description: 'Add mobile, API, CLI, DB, or Grid checks when the product needs them.',
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

const heroSignals = [
  {
    label: 'Control',
    value: 'Native APIs stay visible',
  },
  {
    label: 'Evidence',
    value: 'Allure screenshots, logs, and steps',
  },
  {
    label: 'Scope',
    value: 'Web, mobile, API, DB, and CLI',
  },
];

function useScrollReveal(): void {
  React.useEffect(() => {
    const root = document.documentElement;
    const revealElements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    root.dataset.revealReady = 'true';

    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !('IntersectionObserver' in window)
    ) {
      revealElements.forEach((element) => element.classList.add(styles.revealVisible));
      return () => {
        delete root.dataset.revealReady;
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add(styles.revealVisible);
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    );

    revealElements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
      delete root.dataset.revealReady;
    };
  }, []);
}

function Hero(): JSX.Element {
  return (
    <header className={styles.hero} data-testid="landing-hero">
      <BrowserOnly fallback={<div aria-hidden="true" />}>
        {() => (
          <ParticleBackground
            className={styles.heroParticles}
            particleCount={42}
            connectionDistance={135}
            motionScale={0.38}
            heroMode
          />
        )}
      </BrowserOnly>
      <div className={`container ${styles.heroGrid}`}>
        <div className={styles.heroCopy}>
          <Link className={styles.heroBrand} to="/" aria-label="SHAFT home">SHAFT</Link>
          <span className={styles.eyebrow}>Java automation across real product surfaces</span>
          <h1>One Java test suite for web, mobile, API, DB, and CLI.</h1>
          <p>
            SHAFT keeps Selenium, Playwright, Appium, and REST Assured visible while
            moving synchronization, configuration, evidence, and recovery into the framework.
          </p>
          <div className={styles.actions} data-testid="landing-hero-actions">
            <Link className="button button--primary button--lg" data-testid="landing-hero-install-cta" to="/docs/start/quick-start#new-project-generation">
              <FontAwesomeIcon icon={faTerminal} aria-hidden="true" />
              Create your first SHAFT project
            </Link>
            <a className="button button--secondary button--lg" data-testid="landing-hero-star-cta" href={snippets.githubRepository} target="_blank" rel="noreferrer">
              <FontAwesomeIcon icon={faStar} aria-hidden="true" />
              Star on GitHub
            </a>
            <Link className="button button--secondary button--lg" data-testid="landing-hero-quickstart-cta" to="/docs/start/quick-start#choose-your-path">
              <FontAwesomeIcon icon={faBookOpen} aria-hidden="true" />
              Read quick start
            </Link>
          </div>
          <div className={styles.heroTrustLinks} aria-label="Project trust signals">
            <a href="https://central.sonatype.com/artifact/io.github.shafthq/shaft-engine">Maven Central</a>
            <a href="https://www.selenium.dev/ecosystem/#frameworks">Selenium ecosystem</a>
            <a href="https://opensource.googleblog.com/2023/05/google-open-source-peer-bonus-program-announces-first-group-of-winners-2023.html">Google Open Source award</a>
          </div>
        </div>
        <div className={styles.heroProof} aria-label="SHAFT quick proof">
          <div className={styles.proofHeader}>
            <span><i aria-hidden="true" />What SHAFT standardizes</span>
            <Link to="#testing-surfaces">Compare surfaces</Link>
          </div>
          <div className={styles.heroSignalBar} aria-label="SHAFT suite signals">
            {heroSignals.map((signal) => (
              <div key={signal.label}>
                <small>{signal.label}</small>
                <strong>{signal.value}</strong>
              </div>
            ))}
          </div>
          <div className={styles.heroEngineStrip} aria-label="Native engines available through SHAFT">
            {heroEngines.map((engine) => (
              <Link to={engine.to} key={engine.label}>
                <small>{engine.label}</small>
                <strong>{engine.engine}</strong>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

function GuidePathSection(): JSX.Element {
  return (
    <section className={`${styles.section} ${styles.pathSection} ${styles.reveal}`} data-testid="landing-pathfinder" id="guide-paths" data-reveal>
      <div className="container">
        <div className={styles.sectionHeading}>
          <span className={styles.eyebrow}>Pick the work in front of you</span>
          <Heading as="h2" id="guide-paths-heading">Choose the setup path that matches your repo.</Heading>
          <p>New project, upgrade, MCP, and manual setup all start in the quick start.</p>
        </div>
        <div className={styles.pathGrid} aria-labelledby="guide-paths-heading">
          {guidePaths.map((path) => (
            <Link className={`${styles.pathCard} ${styles.reveal}`} to={path.to} key={path.title} data-reveal>
              <small>{path.audience}</small>
              <strong>{path.title}</strong>
              <span>{path.description}</span>
              <em>{path.label}</em>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProofSection(): JSX.Element {
  return (
    <section className={`${styles.section} ${styles.reveal}`} data-testid="landing-proof" id="proof-section" data-reveal>
      <div className="container">
        <div className={styles.sectionHeading}>
          <span className={styles.eyebrow}>Why SHAFT</span>
          <Heading as="h2" id="why-shaft">Use native engines without rebuilding suite plumbing.</Heading>
          <p>
            Keep direct API control; standardize waits, reporting, configuration,
            and recovery in one Java framework.
          </p>
          <div className={`${styles.proofLinks} ${styles.sectionProofLinks}`} aria-label="Project evidence">
            <a href="https://central.sonatype.com/artifact/io.github.shafthq/shaft-engine">Maven Central</a>
            <a href="https://www.selenium.dev/ecosystem/#frameworks">Selenium ecosystem</a>
            <a href="https://opensource.googleblog.com/2023/05/google-open-source-peer-bonus-program-announces-first-group-of-winners-2023.html">Google Open Source award</a>
          </div>
        </div>
        <div className={styles.proofGrid}>
          {proofPoints.map((point) => (
            <Link className={`${styles.proofCard} ${styles.reveal}`} to={point.to} key={point.title} data-reveal>
              <strong>{point.title}</strong>
              <span>{point.description}</span>
              <small>{point.label}</small>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function SurfaceSection(): JSX.Element {
  return (
    <section className={`${styles.section} ${styles.compactSection} ${styles.reveal}`} data-testid="landing-surfaces" id="surface-section" data-reveal>
      <div className="container">
        <div className={styles.sectionHeading}>
          <span className={styles.eyebrow}>Start narrow, keep the expansion path</span>
          <Heading as="h2" id="testing-surfaces">Start with web. Add the surfaces your product needs.</Heading>
          <p>Each guide uses the same lifecycle, configuration, validations, and Allure evidence.</p>
        </div>
        <div className={styles.surfaceGrid}>
          {testSurfaces.map((surface) => (
            <Link className={`${styles.surfaceCard} ${styles.reveal}`} to={surface.to} key={surface.title} data-reveal>
              <strong>{surface.title}</strong>
              <span>{surface.description}</span>
              <small>Open guide</small>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function AgentSection(): JSX.Element {
  return (
    <section className={`${styles.section} ${styles.agentBand} ${styles.reveal}`} data-testid="landing-agent" id="connect-ai-agent" data-reveal>
      <div className={`container ${styles.agentSection}`}>
        <div className={styles.agentIntro}>
          <span className={styles.eyebrow}>Agentic only after the suite runs</span>
          <Heading as="h2">Connect MCP when automation has evidence.</Heading>
          <p>
            SHAFT MCP gives agents browser, Capture, Doctor, and Heal tools while
            your client keeps model credentials and approval policy.
          </p>
          <div className={styles.featureLinks} data-testid="landing-agent-links">
            <Link data-testid="landing-agent-mcp-link" to="/docs/agentic/mcp">MCP setup and commands</Link>
            <Link to="/docs/agentic/doctor">Diagnose with Doctor</Link>
            <Link to="/docs/agentic/heal">Recover with Heal</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCta(): JSX.Element {
  return (
    <section className={`${styles.finalCta} ${styles.reveal}`} data-testid="landing-final" id="get-started" data-reveal>
      <BrowserOnly fallback={<div aria-hidden="true" />}>
        {() => (
          <ParticleBackground
            className={styles.finalParticles}
            particleCount={28}
            connectionDistance={118}
            motionScale={0.28}
            heroMode
          />
        )}
      </BrowserOnly>
      <div className={`container ${styles.finalCtaInner}`}>
        <h2>Start with the path in front of you.</h2>
        <p>Generate a new project, upgrade an existing suite, connect MCP, or build manually from the quick start.</p>
        <div className={styles.actions}>
          <Link className="button button--primary button--lg" data-testid="landing-cta-install" to="/docs/start/quick-start#new-project-generation">
            <FontAwesomeIcon icon={faTerminal} aria-hidden="true" />
            Start a new project
          </Link>
          <Link className="button button--secondary button--lg" data-testid="landing-cta-quickstart" to="/docs/start/quick-start#choose-your-path">
            <FontAwesomeIcon icon={faBookOpen} aria-hidden="true" />
            Read quick start
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home(): JSX.Element {
  useScrollReveal();

  return (
    <Layout
      title="Unified Web, Mobile, API, Database, and CLI Test Automation"
      description="SHAFT keeps native Selenium, Playwright, Appium, and REST Assured access while standardizing synchronization, configuration, evidence, and recovery across Java test suites."
    >
      <Hero />
      <main data-testid="landing-main">
        <GuidePathSection />
        <ProofSection />
        <SurfaceSection />
        <AgentSection />
        <FinalCta />
      </main>
    </Layout>
  );
}

