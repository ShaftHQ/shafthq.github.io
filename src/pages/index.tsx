import React from 'react';
import Link from '@docusaurus/Link';
import BrowserOnly from '@docusaurus/BrowserOnly';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSlack} from '@fortawesome/free-brands-svg-icons';
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

const audienceLanes = [
  {
    title: 'For engineers',
    description: 'Keep native Java control while SHAFT standardizes the repeatable suite work.',
    points: [
      'Selenium, Playwright, Appium, REST Assured, JDBC, and CLI stay visible.',
      'Waits, retries, reporting, screenshots, and logs move out of test code.',
      'Evidence is readable when the next failure interrupts real delivery work.',
    ],
  },
  {
    title: 'For leaders',
    description: 'Turn automation from a hidden maintenance cost into release evidence people can inspect.',
    points: [
      'One guide path helps new projects, migrations, and cross-surface expansion.',
      'Failures start with artifacts that explain what changed and where to look.',
      'Starring the repository stays a simple, always-visible action, never gated behind proving anything first.',
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
  {
    audience: 'Review',
    title: 'Inspect Allure and star SHAFT',
    description: 'Open the report, confirm the evidence, then keep the repository close.',
    label: 'Star after success',
    to: snippets.githubRepository,
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
    title: 'Boilerplate code moves out of tests',
    description: 'Synchronization, configuration, smart locators, screenshots, logs, and Allure steps live in the framework.',
    label: 'Feature map',
    to: '/docs/features/modules',
  },
  {
    title: 'Failures start with evidence',
    description: 'Web, mobile, API, CLI, and DB actions attach evidence that Doctor and Heal can use for recovery.',
    label: 'Reporting overview',
    to: '/docs/features/reporting',
  },
];

const coverageColumns = ['Test', 'Validate', 'Data', 'State', 'Observe', 'Evidence'];
const slackInviteUrl = 'https://join.slack.com/t/shaft-engine/shared_invite/zt-oii5i2gg-0ZGnih_Y34NjK7QqDn01Dw';

const codeCompare = {
  handled: [
    'driver lifecycle, waits, retries, and sync',
    'screenshots, logs, steps, and attachments',
    'configuration and data isolation',
    'Allure evidence that Doctor and Heal can read',
  ],
};

const heroMeta = ['io.github.shafthq : shaft-engine', 'Java 25', 'MIT', 'Allure native'];

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
    title: 'Allure',
    description: 'Centralize the timeline, screenshots, and attachments for review.',
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

const footerBadges = [
  ['Java 25', 'Built for the future'],
  ['MIT licensed', 'Open source'],
  ['Allure native', 'Evidence first'],
  ['Self-healing', 'Less flaky'],
  ['CI/CD ready', 'Built in'],
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
          const element = entry.target as HTMLElement;
          const isAboveViewport = entry.boundingClientRect.top < 0;
          if (entry.isIntersecting || isAboveViewport) {
            element.classList.add(styles.revealVisible);
            element.dataset.revealState = 'revealed';
            return;
          }
          element.classList.remove(styles.revealVisible);
          element.dataset.revealState = 'rolled-back';
        });
      },
      { rootMargin: '-8% 0px -10% 0px', threshold: [0, 0.12, 0.24] },
    );

    revealElements.forEach((element, index) => {
      element.style.setProperty('--reveal-delay', `${Math.min(index * 34, 240)}ms`);
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
      delete root.dataset.revealReady;
    };
  }, []);
}

function useHoverGlow(): void {
  React.useEffect(() => {
    const glowTargets = Array.from(document.querySelectorAll<HTMLElement>('[data-hover-glow]'));

    const updatePointer = (event: PointerEvent) => {
      const target = event.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      target.style.setProperty('--hover-x', `${event.clientX - rect.left}px`);
      target.style.setProperty('--hover-y', `${event.clientY - rect.top}px`);
    };

    glowTargets.forEach((target) => {
      target.addEventListener('pointermove', updatePointer, { passive: true });
    });

    return () => {
      glowTargets.forEach((target) => {
        target.removeEventListener('pointermove', updatePointer);
      });
    };
  }, []);
}

function JavaCodeExample(): JSX.Element {
  return (
    <pre className="language-java" data-testid="landing-java-code">
      <code className="language-java">
        <span className={styles.codeLine}>
          <span className={styles.codeAnnotation}>@Test</span>
        </span>
        <span className={styles.codeLine}>
          <span className={styles.codeKeyword}>public</span>{' '}
          <span className={styles.codeKeyword}>void</span>{' '}
          <span className={styles.codeFunction}>checkout_happy_path</span>() {'{'}
        </span>
        <span className={styles.codeLine}>
          {'  '}driver.<span className={styles.codeCall}>element</span>().<span className={styles.codeCall}>click</span>(addToCart)
        </span>
        <span className={styles.codeLine}>
          {'        '}.<span className={styles.codeCall}>and</span>().<span className={styles.codeCall}>click</span>(checkout)
        </span>
        <span className={styles.codeLine}>
          {'        '}.<span className={styles.codeCall}>and</span>().<span className={styles.codeCall}>assertThat</span>(orderStatus)
        </span>
        <span className={styles.codeLine}>
          {'        '}.<span className={styles.codeCall}>text</span>().<span className={styles.codeCall}>contains</span>(<span className={styles.codeString}>"Success"</span>);
        </span>
        <span className={styles.codeLine}>{'}'}</span>
      </code>
    </pre>
  );
}

function CodeCompare(): JSX.Element {
  return (
    <div className={styles.codeCompare} data-testid="landing-code-proof" aria-label="SHAFT test code proof">
      <figure className={styles.codePanel}>
        <figcaption>
          <span className={styles.chromeDots} aria-hidden="true"><i /><i /><i /></span>
          CheckoutTest.java
          <span className={styles.statusChip}>Pass</span>
        </figcaption>
        <JavaCodeExample />
      </figure>
      <div className={styles.handledPanel}>
        <span>
          SHAFT handles
          <span className={styles.statusChip}>evidence attached</span>
        </span>
        <ul>
          {codeCompare.handled.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Hero(): JSX.Element {
  return (
    <header className={styles.hero} data-testid="landing-hero" id="top">
      <BrowserOnly fallback={<div aria-hidden="true" />}>
        {() => (
          <ParticleBackground
            className={styles.heroParticles}
            particleCount={96}
            connectionDistance={168}
            motionScale={0.78}
            heroMode
          />
        )}
      </BrowserOnly>
      <div className={`container ${styles.heroGrid}`}>
        <div className={styles.heroCopy}>
          <Link className={styles.heroBrand} to="/" aria-label="SHAFT home">SHAFT</Link>
          <p className={styles.heroMeta} aria-label="Project coordinates">
            {heroMeta.map((fact) => (
              <span key={fact}>{fact}</span>
            ))}
          </p>
          <h1>Ship automation evidence, not boilerplate code.</h1>
          <p>
            <strong>One Java test suite for web, mobile, API, DB, and CLI.</strong>
            {' '}SHAFT keeps Selenium, Playwright, Appium, and REST Assured visible while
            moving synchronization, configuration, evidence, and recovery into the framework.
          </p>
          <div className={styles.actions} data-testid="landing-hero-actions">
            <Link className="button button--secondary button--lg" data-testid="landing-hero-quickstart-cta" data-hover-glow to="/docs/start/quick-start#choose-your-path">
              <FontAwesomeIcon icon={faBookOpen} aria-hidden="true" />
              Read quick start
            </Link>
            <a className="button button--secondary button--lg" data-testid="landing-hero-star-cta" data-hover-glow href={snippets.githubRepository} target="_blank" rel="noreferrer">
              <FontAwesomeIcon icon={faStar} aria-hidden="true" />
              Star on GitHub
            </a>
            <a className="button button--secondary button--lg" data-testid="landing-hero-slack-cta" data-hover-glow href={slackInviteUrl} target="_blank" rel="noreferrer">
              <FontAwesomeIcon icon={faSlack} aria-hidden="true" />
              Join Slack
            </a>
            <Link className="button button--primary button--lg" data-testid="landing-hero-install-cta" data-hover-glow to="/docs/start/quick-start#new-project-generation">
              <FontAwesomeIcon icon={faTerminal} aria-hidden="true" />
              Start a new project
            </Link>
          </div>
          <div className={styles.heroTrustLinks} aria-label="Project trust signals">
            <a href="https://central.sonatype.com/artifact/io.github.shafthq/shaft-engine">Maven Central</a>
            <a href="https://www.selenium.dev/ecosystem/#frameworks">Selenium ecosystem</a>
            <a href="https://opensource.googleblog.com/2023/05/google-open-source-peer-bonus-program-announces-first-group-of-winners-2023.html">Google Open Source award</a>
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
        <div className={`${styles.sectionHeading} ${styles.centerHeading}`}>
          <span className={styles.eyebrow}>Guided paths</span>
          <Heading as="h2" id="guide-paths-heading">Get started in minutes.</Heading>
          <p>Install, configure, write a readable test, run it headlessly, and review the evidence before starring the repository.</p>
        </div>
        <div className={styles.pathGrid} aria-labelledby="guide-paths-heading">
          {guidePaths.map((path, index) => (
            <Link className={`${styles.pathCard} ${styles.reveal}`} to={path.to} key={path.title} data-reveal data-hover-glow>
              <small>{String(index + 1).padStart(2, '0')} · {path.audience}</small>
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

function AudienceSection(): JSX.Element {
  return (
    <section className={`${styles.section} ${styles.audienceSection} ${styles.reveal}`} data-testid="landing-audience-split" data-reveal>
      <div className={`container ${styles.audienceGrid}`}>
        {audienceLanes.map((lane) => (
          <section key={lane.title} className={styles.audienceLane} data-hover-glow>
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
    </section>
  );
}

function SurfaceSection(): JSX.Element {
  return (
    <section className={`${styles.section} ${styles.surfaceSection} ${styles.reveal}`} data-testid="landing-surfaces" id="surface-section" data-reveal>
      <div className="container">
        <div className={styles.sectionHeading}>
          <span className={styles.eyebrow}>Coverage matrix</span>
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
            <Link className={styles.matrixRow} to={surface.to} key={surface.title} data-hover-glow>
              <strong>
                {surface.title}
                <small className={styles.matrixStack}>{surface.stack}</small>
              </strong>
              {coverageColumns.map((column) => (
                <span key={column}>{column}</span>
              ))}
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
          <span className={styles.eyebrow}>Code proof</span>
          <Heading as="h2" id="why-shaft">Boilerplate code removed from tests.</Heading>
          <p>Clean tests that read like documentation. Let SHAFT own the repeatable mechanics that make evidence reliable.</p>
        </div>
        <CodeCompare />
        <div className={styles.proofGrid}>
          {proofPoints.map((point) => (
            <Link className={`${styles.proofCard} ${styles.reveal}`} to={point.to} key={point.title} data-reveal data-hover-glow>
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

function AllureEvidenceSection(): JSX.Element {
  return (
    <section className={`${styles.section} ${styles.allureSection} ${styles.reveal}`} data-testid="landing-allure-evidence" id="allure-evidence" data-reveal>
      <div className={`container ${styles.allureGrid}`}>
        <div className={styles.sectionHeading}>
          <span className={styles.eyebrow}>Run evidence</span>
          <Heading as="h2" id="allure-evidence-heading">Allure evidence people can inspect.</Heading>
          <p>SHAFT turns each checkout action into report evidence: steps, screenshots, logs, and diagnostics stay attached to the run instead of scattered across CI output.</p>
          <Link className={styles.inlineCta} to="/docs/reference/reporting">
            Open reporting configuration reference
          </Link>
        </div>
        <figure className={styles.allureFrame}>
          <img
            src="/img/allure3_main_light.png"
            alt="Official Allure 3 demo report screenshot showing grouped test results and status trends"
          />
          <figcaption>
            Official Allure 3 report screenshot from{' '}
            <a href="https://allurereport.org/images/allure3_main_light.png" target="_blank" rel="noreferrer">
              allurereport.org
            </a>.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

function AgentSection(): JSX.Element {
  return (
    <section className={`${styles.section} ${styles.agentBand} ${styles.reveal}`} data-testid="landing-agent" id="connect-ai-agent" data-reveal>
      <div className={`container ${styles.agentSection}`}>
        <div className={styles.sectionHeading}>
          <span className={styles.eyebrow}>Diagnostic loop</span>
          <Heading as="h2">The evidence loop makes failures explainable.</Heading>
          <p>Run the suite, collect the artifacts, diagnose the path, and improve the checks with the same evidence trail.</p>
        </div>
        <div className={styles.evidenceLoop} data-testid="landing-evidence-loop" aria-label="SHAFT evidence loop">
          {evidenceLoop.map((step, index) => (
            <div className={styles.loopStep} key={step.title} data-hover-glow>
              <small>{String(index + 1).padStart(2, '0')}</small>
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
            particleCount={64}
            connectionDistance={146}
            motionScale={0.6}
            heroMode
          />
        )}
      </BrowserOnly>
      <div className={`container ${styles.finalCtaInner}`}>
        <p className={styles.finalKicker}>run complete · evidence attached · exit 0</p>
        <h2>Star SHAFT on GitHub.</h2>
        <p>Start with the quick path. After the sample test produces evidence, star the repository so releases stay visible.</p>
        <div className={styles.actions}>
          <Link className="button button--secondary button--lg" data-testid="landing-cta-quickstart" data-hover-glow to="/docs/start/quick-start#choose-your-path">
            <FontAwesomeIcon icon={faBookOpen} aria-hidden="true" />
            Read quick start
          </Link>
          <a className="button button--secondary button--lg" data-testid="landing-cta-star" data-hover-glow href={snippets.githubRepository} target="_blank" rel="noreferrer">
            <FontAwesomeIcon icon={faStar} aria-hidden="true" />
            Star on GitHub
          </a>
          <a className="button button--secondary button--lg" data-testid="landing-cta-slack" data-hover-glow href={slackInviteUrl} target="_blank" rel="noreferrer">
            <FontAwesomeIcon icon={faSlack} aria-hidden="true" />
            Join Slack
          </a>
          <Link className="button button--primary button--lg" data-testid="landing-cta-install" data-hover-glow to="/docs/start/quick-start#new-project-generation">
            <FontAwesomeIcon icon={faTerminal} aria-hidden="true" />
            Start a new project
          </Link>
        </div>
      </div>
    </section>
  );
}

function LandingFooter(): JSX.Element {
  return (
    <footer className={styles.landingFooter} data-testid="landing-footer">
      <div className={`container ${styles.footerBadges}`} aria-label="SHAFT project facts">
        {footerBadges.map(([title, detail]) => (
          <span key={title}>
            <strong>{title}</strong>
            <small>{detail}</small>
          </span>
        ))}
      </div>
      <div className={`container ${styles.footerLinks}`}>
        <small>© {new Date().getFullYear()} SHAFT Engine.</small>
        <a href={snippets.githubRepository}>GitHub</a>
        <a href="https://github.com/ShaftHQ/SHAFT_ENGINE/discussions">Discussions</a>
        <a href="https://github.com/ShaftHQ/SHAFT_ENGINE/blob/main/LICENSE">License</a>
        <a href="#top">Back to top</a>
      </div>
    </footer>
  );
}

export default function Home(): JSX.Element {
  useScrollReveal();
  useHoverGlow();

  return (
    <Layout
      title="Unified Web, Mobile, API, Database, and CLI Test Automation"
      description="SHAFT turns Java automation into clear evidence across web, mobile, API, database, and CLI checks while preserving native tool control."
      noFooter
    >
      <Hero />
      <main data-testid="landing-main">
        <AudienceSection />
        <SurfaceSection />
        <ProofSection />
        <AllureEvidenceSection />
        <AgentSection />
        <GuidePathSection />
        <FinalCta />
      </main>
      <LandingFooter />
    </Layout>
  );
}
