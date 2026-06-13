import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';
import styles from './index.module.css';

const testSurfaces = [
  {
    title: 'Web',
    description: 'Selenium sessions, synchronized actions, assertions, screenshots, and reports.',
    to: '/docs/testing/web',
  },
  {
    title: 'Mobile',
    description: 'Appium workflows for Android, iOS, mobile web, and Flutter.',
    to: '/docs/testing/mobile',
  },
  {
    title: 'API',
    description: 'REST Assured requests, extraction, schemas, authentication, and validation.',
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

function Hero(): JSX.Element {
  return (
    <header className={styles.hero}>
      <div className={`container ${styles.heroGrid}`}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>Open-source Java 25 test automation</span>
          <h1>One engine for every test surface.</h1>
          <p>
            Build Web, Mobile, API, CLI, and Database tests with one fluent API,
            one evidence model, and optional agentic tools.
          </p>
          <div className={styles.actions}>
            <Link className="button button--primary button--lg" to="/docs/start/quick-start">
              Run your first test
            </Link>
            <Link className="button button--secondary button--lg" to="/docs/agentic/mcp">
              Connect your AI agent
            </Link>
          </div>
          <div className={styles.proofLinks} aria-label="Project evidence">
            <a href="https://central.sonatype.com/artifact/io.github.shafthq/shaft-engine">Maven Central</a>
            <a href="https://www.selenium.dev/ecosystem/#frameworks">Selenium ecosystem</a>
            <a href="https://opensource.googleblog.com/2023/05/google-open-source-peer-bonus-program-announces-first-group-of-winners-2023.html">Google Open Source award</a>
          </div>
        </div>
        <figure className={styles.heroVisual}>
          <img
            src="/img/shaft-automation-hero.png"
            alt="A central automation engine connected to browser, mobile, API, terminal, and reporting interfaces"
            width="1792"
            height="1024"
          />
        </figure>
      </div>
    </header>
  );
}

function SurfaceSection(): JSX.Element {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.sectionHeading}>
          <span className={styles.eyebrow}>Choose your surface</span>
          <h2>Start with the test you need today.</h2>
          <p>Keep the same lifecycle, validations, evidence, and reporting as coverage grows.</p>
        </div>
        <div className={styles.surfaceGrid}>
          {testSurfaces.map((surface) => (
            <Link className={styles.surfaceCard} to={surface.to} key={surface.title}>
              <strong>{surface.title}</strong>
              <span>{surface.description}</span>
              <small>Open guide →</small>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function AgentSection(): JSX.Element {
  return (
    <section className={`${styles.section} ${styles.contrastSection}`}>
      <div className={`container ${styles.agentGrid}`}>
        <div>
          <span className={styles.eyebrow}>Agent-ready, deterministic by default</span>
          <h2>Give Codex or Copilot real automation tools.</h2>
          <p>
            SHAFT MCP exposes browser, Capture, and Doctor operations while the
            client retains its own model credentials and approval policy.
          </p>
          <div className={styles.featureLinks}>
            <Link to="/docs/agentic/mcp">MCP setup</Link>
            <Link to="/docs/agentic/doctor">Diagnose with Doctor</Link>
            <Link to="/docs/agentic/heal">Recover with Heal</Link>
          </div>
        </div>
        <div className={styles.commandCard}>
          <span>Codex</span>
          <CodeBlock language="bash">
            {'codex mcp add shaft-mcp -- docker run --rm -i ghcr.io/shafthq/shaft-engine-mcp:latest'}
          </CodeBlock>
          <p>Then ask: “Use SHAFT to open example.com and verify the page title.”</p>
        </div>
      </div>
    </section>
  );
}

function WorkflowSection(): JSX.Element {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.sectionHeading}>
          <span className={styles.eyebrow}>One observable workflow</span>
          <h2>Act, validate, report, diagnose.</h2>
        </div>
        <div className={styles.workflow} aria-label="SHAFT test workflow">
          <span>Test intent</span>
          <b aria-hidden="true">→</b>
          <span>SHAFT action</span>
          <b aria-hidden="true">→</b>
          <span>Validation</span>
          <b aria-hidden="true">→</b>
          <span>Allure evidence</span>
          <b aria-hidden="true">→</b>
          <span>Doctor diagnosis</span>
        </div>
        <div className={styles.evidenceGrid}>
          <article>
            <strong>Explainable failures</strong>
            <p>Structured steps, logs, screenshots, requests, and command evidence.</p>
          </article>
          <article>
            <strong>Explicit modules</strong>
            <p>Add visual, video, BrowserStack SDK, Heal, or provider support only when used.</p>
          </article>
          <article>
            <strong>Portable execution</strong>
            <p>Run locally, in CI, on Selenium Grid, Appium, or cloud providers.</p>
          </article>
        </div>
      </div>
    </section>
  );
}

function FinalCta(): JSX.Element {
  return (
    <section className={styles.finalCta}>
      <div className="container">
        <h2>Ship the first test. Scale without changing engines.</h2>
        <div className={styles.actions}>
          <Link className="button button--primary button--lg" to="/docs/start/installation">
            Install SHAFT
          </Link>
          <a
            className="button button--secondary button--lg"
            href="https://github.com/ShaftHQ/SHAFT_ENGINE"
          >
            Star on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}

export default function Home(): JSX.Element {
  return (
    <Layout
      title="Unified Java Test Automation"
      description="SHAFT unifies Web, Mobile, API, CLI, and Database testing with reporting and agentic tools."
    >
      <Hero />
      <main>
        <SurfaceSection />
        <AgentSection />
        <WorkflowSection />
        <FinalCta />
      </main>
    </Layout>
  );
}
