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
    stack: 'Selenium + Playwright',
    description: 'Browser checks with synchronization, smart locators, screenshots, logs, and Allure steps.',
    to: '/docs/testing/web',
  },
  {
    title: 'Mobile GUI',
    stack: 'Appium',
    description: 'Android, iOS, mobile web, Flutter, real device, emulator, and cloud-device flows.',
    to: '/docs/testing/mobile',
  },
  {
    title: 'API',
    stack: 'REST Assured',
    description: 'Requests, extraction, schemas, auth, and assertions attached to the same evidence trail.',
    to: '/docs/testing/api',
  },
  {
    title: 'Database',
    stack: 'JDBC',
    description: 'Connections, queries, updates, and result validation beside the product action that needed them.',
    to: '/docs/testing/database',
  },
  {
    title: 'CLI',
    stack: 'Local, Docker, SSH',
    description: 'Terminal, container, SSH, and file-system actions with logs preserved in the run report.',
    to: '/docs/testing/cli',
  },
];

const commandOutcomes = [
  {
    title: 'Allure evidence',
    detail: 'Screenshots, logs, steps, and attachments stay close to each action.',
    to: '/docs/features/reporting',
  },
  {
    title: 'Doctor',
    detail: 'Failure context is ready for diagnosis after the suite produces evidence.',
    to: '/docs/agentic/doctor',
  },
  {
    title: 'Heal',
    detail: 'Recovery workflows start from captured facts instead of guesswork.',
    to: '/docs/agentic/heal',
  },
];

const audienceLanes = [
  {
    title: 'For engineers',
    description: 'Keep native Java control while SHAFT standardizes the repeatable suite work.',
    points: [
      'Selenium, Playwright, Appium, REST Assured, JDBC, and CLI stay visible.',
      'Waits, retries, reporting, screenshots, and logs move into framework plumbing.',
      'Evidence is readable when the next failure interrupts real delivery work.',
    ],
  },
  {
    title: 'For leaders',
    description: 'Turn automation from a hidden maintenance cost into release evidence people can inspect.',
    points: [
      'One guide path helps new projects, migrations, and cross-surface expansion.',
      'Failures start with artifacts that explain what changed and where to look.',
      'The star prompt waits until evaluators have a successful first run to remember.',
    ],
  },
];

const guidePaths = [
  {
    audience: 'First run',
    title: 'Start a new SHAFT project',
    description: 'Generate a ready Maven project, run it, then open the evidence.',
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
    description: 'Add mobile, API, CLI, DB, or Grid checks only when the product needs them.',
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

const coverageColumns = ['Test', 'Validate', 'Data', 'State', 'Observe', 'Evidence'];

const codeCompare = {
  test: [
    '@Test',
    'public void checkout_happy_path() {',
    '  driver.element().click(addToCart);',
    '  driver.element().click(checkout);',
    '  driver.assertThat()',
    '    .element(orderStatus)',
    '    .text().contains("Success")',
    '    .perform();',
    '}',
  ],
  plumbing: [
    'SHAFT handles the repeatable work:',
    'driver lifecycle, waits, retries, and sync',
    'screenshots, logs, steps, and attachments',
    'configuration and data isolation',
    'Allure evidence that Doctor and Heal can read',
  ],
};

const plumbingItems = [
  'Driver lifecycle',
  'Smart waits and retries',
  'Screenshots and logs',
  'Allure steps and attachments',
  'Configuration defaults',
  'Recovery-ready evidence',
];

const evidenceLoop = [
  {
    title: 'Execute',
    description: 'Run web, mobile, API, DB, and CLI checks from one Java project.',
  },
  {
    title: 'Collect',
    description: 'Capture screenshots, logs, requests, responses, and data facts.',
  },
  {
    title: 'Diagnose',
    description: 'Use reports and Doctor to understand the failure path.',
  },
  {
    title: 'Improve',
    description: 'Apply deterministic fixes first, then Heal when evidence supports it.',
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

function CodeCompare(): JSX.Element {
  return (
    <div className={styles.codeCompare} data-testid="landing-code-proof" aria-label="SHAFT test code proof">
      <div>
        <span>SHAFT test</span>
        <pre>{codeCompare.test.join('\n')}</pre>
      </div>
      <div>
        <span>SHAFT handles</span>
        <ul>
          {codeCompare.plumbing.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function HeroCodeProof(): JSX.Element {
  const heroCode = [
    'click(checkout);',
    'assert(orderStatus);',
    'attach evidence;',
  ];

  return (
    <div className={`${styles.codeCompare} ${styles.heroCodeProof}`} data-testid="landing-code-proof" aria-label="SHAFT compact test code proof">
      <div>
        <span>SHAFT test</span>
        <pre>{heroCode.join('\n')}</pre>
      </div>
      <div>
        <span>SHAFT handles</span>
        <ul>
          {codeCompare.plumbing.slice(1, 4).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Hero(): JSX.Element {
  return (
    <header className={styles.hero} data-testid="landing-hero">
      <BrowserOnly fallback={<div aria-hidden="true" />}>
        {() => (
          <ParticleBackground
            className={styles.heroParticles}
            particleCount={58}
            connectionDistance={150}
            motionScale={0.42}
            heroMode
          />
        )}
      </BrowserOnly>
      <div className={`container ${styles.heroGrid}`}>
        <div className={styles.heroCopy}>
          <Link className={styles.heroBrand} to="/" aria-label="SHAFT home">SHAFT</Link>
          <h1>Ship automation evidence, not test plumbing.</h1>
          <p>
            <strong>One Java test suite for web, mobile, API, DB, and CLI.</strong>
            {' '}SHAFT keeps Selenium, Playwright, Appium, and REST Assured visible while
            moving synchronization, configuration, evidence, and recovery into the framework.
          </p>
          <div className={styles.actions} data-testid="landing-hero-actions">
            <Link className="button button--primary button--lg" data-testid="landing-hero-install-cta" to="/docs/start/quick-start#new-project-generation">
              <FontAwesomeIcon icon={faTerminal} aria-hidden="true" />
              Create your first SHAFT project
            </Link>
            <Link className="button button--secondary button--lg" data-testid="landing-hero-quickstart-cta" to="/docs/start/quick-start#choose-your-path">
              <FontAwesomeIcon icon={faBookOpen} aria-hidden="true" />
              Read quick start
            </Link>
            <a className="button button--secondary button--lg" data-testid="landing-hero-star-cta" href={snippets.githubRepository} target="_blank" rel="noreferrer">
              <FontAwesomeIcon icon={faStar} aria-hidden="true" />
              Star on GitHub
            </a>
          </div>
          <div className={styles.heroTrustLinks} aria-label="Project trust signals">
            <a href="https://central.sonatype.com/artifact/io.github.shafthq/shaft-engine">Maven Central</a>
            <a href="https://www.selenium.dev/ecosystem/#frameworks">Selenium ecosystem</a>
            <a href="https://opensource.googleblog.com/2023/05/google-open-source-peer-bonus-program-announces-first-group-of-winners-2023.html">Google Open Source award</a>
          </div>
        </div>
        <div className={styles.heroProof} data-testid="landing-command-center" aria-label="SHAFT evidence command center">
          <div className={styles.commandRail} aria-label="Test surfaces">
            {testSurfaces.map((surface) => (
              <Link to={surface.to} key={surface.title}>
                <small>{surface.title}</small>
                <strong>{surface.stack}</strong>
              </Link>
            ))}
          </div>
          <div className={styles.evidenceCore}>
            <span>Evidence command center</span>
            <strong>Allure evidence</strong>
            <p>Unified, observable, actionable. Built for engines that ship.</p>
            <div className={styles.signalBars} aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </div>
            <HeroCodeProof />
          </div>
          <div className={styles.commandRail} aria-label="Evidence outcomes">
            {commandOutcomes.map((outcome) => (
              <Link to={outcome.to} key={outcome.title}>
                <small>{outcome.title}</small>
                <strong>{outcome.detail}</strong>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className={`container ${styles.audienceGrid}`} data-testid="landing-audience-split">
        {audienceLanes.map((lane) => (
          <section key={lane.title} className={styles.audienceLane}>
            <h2>{lane.title}</h2>
            <p>{lane.description}</p>
            <ul>
              {lane.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </header>
  );
}

function GuidePathSection(): JSX.Element {
  return (
    <section className={`${styles.section} ${styles.pathSection} ${styles.reveal}`} data-testid="landing-pathfinder" id="guide-paths" data-reveal>
      <div className="container">
        <div className={styles.sectionHeading}>
          <Heading as="h2" id="guide-paths-heading">Get started, then ask for the star.</Heading>
          <p>Generate or upgrade, run the first useful test, inspect the report, and keep the repository close if the evidence helped.</p>
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

function SurfaceSection(): JSX.Element {
  return (
    <section className={`${styles.section} ${styles.surfaceSection} ${styles.reveal}`} data-testid="landing-surfaces" id="surface-section" data-reveal>
      <div className="container">
        <div className={styles.sectionHeading}>
          <Heading as="h2" id="testing-surfaces">One framework. Full surface coverage.</Heading>
          <p>Start with the layer in front of you, then expand without changing the reporting and lifecycle model.</p>
        </div>
        <div className={styles.surfaceMatrix} data-testid="landing-surface-matrix" aria-label="SHAFT surface coverage matrix">
          <div className={styles.matrixHeader}>
            <strong>Surface</strong>
            {coverageColumns.map((column) => (
              <span key={column}>{column}</span>
            ))}
          </div>
          {testSurfaces.map((surface) => (
            <Link className={styles.matrixRow} to={surface.to} key={surface.title}>
              <strong>{surface.title}</strong>
              {coverageColumns.map((column) => (
                <span key={column}>{column}</span>
              ))}
            </Link>
          ))}
        </div>
        <div className={styles.surfaceGrid}>
          {testSurfaces.map((surface) => (
            <Link className={`${styles.surfaceCard} ${styles.reveal}`} to={surface.to} key={surface.title} data-reveal>
              <small>{surface.stack}</small>
              <strong>{surface.title}</strong>
              <span>{surface.description}</span>
              <em>Open guide</em>
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
          <Heading as="h2" id="why-shaft">Suite plumbing removed from tests.</Heading>
          <p>Keep readable test intent in code. Let SHAFT own the repeatable mechanics that make evidence reliable.</p>
          <div className={`${styles.proofLinks} ${styles.sectionProofLinks}`} aria-label="Project evidence">
            <a href="https://central.sonatype.com/artifact/io.github.shafthq/shaft-engine">Maven Central</a>
            <a href="https://www.selenium.dev/ecosystem/#frameworks">Selenium ecosystem</a>
            <a href="https://opensource.googleblog.com/2023/05/google-open-source-peer-bonus-program-announces-first-group-of-winners-2023.html">Google Open Source award</a>
          </div>
        </div>
        <div className={styles.plumbingGrid}>
          <CodeCompare />
          <div className={styles.plumbingPanel} aria-label="Framework plumbing">
            {plumbingItems.map((item) => (
              <span key={item}>{item}</span>
            ))}
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

function AgentSection(): JSX.Element {
  return (
    <section className={`${styles.section} ${styles.agentBand} ${styles.reveal}`} data-testid="landing-agent" id="connect-ai-agent" data-reveal>
      <div className={`container ${styles.agentSection}`}>
        <div className={styles.sectionHeading}>
          <Heading as="h2">The evidence loop makes failures explainable.</Heading>
          <p>Run the suite, collect the artifacts, diagnose the path, and improve the checks with the same evidence trail.</p>
        </div>
        <div className={styles.evidenceLoop} data-testid="landing-evidence-loop" aria-label="SHAFT evidence loop">
          {evidenceLoop.map((step) => (
            <div className={styles.loopStep} key={step.title}>
              <strong>{step.title}</strong>
              <span>{step.description}</span>
            </div>
          ))}
        </div>
        <div className={styles.featureLinks} data-testid="landing-agent-links">
          <Link data-testid="landing-agent-mcp-link" to="/docs/agentic/mcp">MCP setup and commands</Link>
          <Link to="/docs/agentic/doctor">Diagnose with Doctor</Link>
          <Link to="/docs/agentic/heal">Recover with Heal</Link>
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
            particleCount={34}
            connectionDistance={126}
            motionScale={0.32}
            heroMode
          />
        )}
      </BrowserOnly>
      <div className={`container ${styles.finalCtaInner}`}>
        <h2>You shipped evidence. Star SHAFT on GitHub.</h2>
        <p>Start with the quick path. After the sample test produces evidence, star the repository so releases stay visible.</p>
        <div className={styles.actions}>
          <Link className="button button--primary button--lg" data-testid="landing-cta-install" to="/docs/start/quick-start#new-project-generation">
            <FontAwesomeIcon icon={faTerminal} aria-hidden="true" />
            Start a new project
          </Link>
          <Link className="button button--secondary button--lg" data-testid="landing-cta-quickstart" to="/docs/start/quick-start#choose-your-path">
            <FontAwesomeIcon icon={faBookOpen} aria-hidden="true" />
            Read quick start
          </Link>
          <a className="button button--secondary button--lg" data-testid="landing-cta-star" href={snippets.githubRepository} target="_blank" rel="noreferrer">
            <FontAwesomeIcon icon={faStar} aria-hidden="true" />
            Star on GitHub
          </a>
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
      description="SHAFT turns Java automation into clear evidence across web, mobile, API, database, and CLI checks while preserving native tool control."
    >
      <Hero />
      <main data-testid="landing-main">
        <GuidePathSection />
        <SurfaceSection />
        <ProofSection />
        <AgentSection />
        <FinalCta />
      </main>
    </Layout>
  );
}
