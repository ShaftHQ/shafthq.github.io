import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import {McpApplications} from '@site/src/components/DocSnippets';
import styles from './index.module.css';

const testSurfaces = [
  {
    title: 'Web GUI',
    description: 'Selenium sessions with synchronized W3C WebDriver actions, smart locators, screenshots, and reports.',
    to: '/docs/testing/web',
  },
  {
    title: 'Mobile GUI',
    description: 'Native Appium workflows for Android, iOS, mobile web, Flutter, and cloud devices through the same GUI facade.',
    to: '/docs/testing/mobile',
  },
  {
    title: 'API',
    description: 'REST Assured requests, extraction, schemas, authentication, and response validation in the same report.',
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
    title: 'Native APIs stay available',
    description: 'Use Selenium By, WebDriver, Appium locators, touch actions, SHAFT.API over REST Assured, TestNG, JUnit 5, and Cucumber when direct control matters.',
    label: 'Technology map',
    to: '/docs/features/technology',
  },
  {
    title: 'Flake causes are handled in the engine',
    description: 'Synchronized GUI actions, smart locators, screenshots, logs, and Allure steps target the wait and locator churn raw Selenium or Appium leaves to every test.',
    label: 'Feature map',
    to: '/docs/features/modules',
  },
  {
    title: 'Debugging starts with evidence',
    description: 'Web, mobile, API, CLI, and database actions can become structured Allure evidence, then Doctor and Heal can classify failures and propose recovery paths.',
    label: 'Reporting guide',
    to: '/docs/features/reporting',
  },
];

const decisionPoints = [
  {
    label: 'Choose SHAFT when',
    value: 'Your Java suite spans WebDriver, native mobile GUI, API, DB, CLI, Grid, or BDD.',
  },
  {
    label: 'Keep direct control',
    value: 'Raw Selenium, Appium, and REST Assured APIs remain available.',
  },
  {
    label: 'Reduce suite tax',
    value: 'Synchronization, evidence, smart locators, and diagnostics move into the engine.',
  },
  {
    label: 'Beyond browser-only',
    value: 'Native mobile GUI and API checks share the same lifecycle, validation, and Allure evidence as web UI.',
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

const stackPills = [
  'Selenium WebDriver',
  'Playwright browser',
  'Appium native mobile',
  'REST Assured API',
  'Database / CLI',
  'Selenium Grid',
  'Allure + visual reports',
  'TestNG / JUnit 5',
  'Cucumber BDD',
  'MCP agents',
];

const surfaceMap = [
  {
    label: 'Web GUI',
    engine: 'Selenium WebDriver / Playwright',
    result: 'Synchronized browser actions, smart locators, screenshots, traces, and Allure evidence.',
    to: '/docs/testing/web',
  },
  {
    label: 'Native mobile GUI',
    engine: 'Appium',
    result: 'Android, iOS, mobile web, Flutter, real devices, emulators, and cloud devices.',
    to: '/docs/testing/mobile',
  },
  {
    label: 'API testing',
    engine: 'REST Assured',
    result: 'Requests, authentication, extraction, schemas, and response assertions in one report.',
    to: '/docs/testing/api',
  },
];

const sharedRails = [
  'Selenium Grid remote execution',
  'Allure screenshots, logs, requests, and responses',
  'Fluent design with TestNG, JUnit 5, and Cucumber BDD',
  'Doctor, Heal, and MCP tools for AI-assisted triage',
];

const comparisonRows = [
  {
    concern: 'Native Selenium',
    critic: 'Direct control, but waits, reporting, screenshots, Grid config, mobile handoff, API setup, and triage become your framework to maintain.',
    shaft: 'Same WebDriver/Grid/Appium control, plus synchronized actions, REST Assured API flows, fluent validations, smart locators, and Allure evidence.',
  },
  {
    concern: 'Playwright',
    critic: 'Excellent for browser-only Node/TypeScript suites with traces, codegen, and web-first assertions.',
    shaft: 'Better when the program is Java, W3C WebDriver/Grid, native mobile Appium, REST Assured APIs, database, CLI, BDD, and AI-assisted troubleshooting.',
  },
  {
    concern: 'Long-term suite design',
    critic: 'Single-surface tools age well until mobile, API setup, cloud devices, reports, and business-readable flows arrive.',
    shaft: 'One fluent design and evidence model scales from a web smoke test to cross-surface TestNG, JUnit 5, and Cucumber suites.',
  },
];

const workflowSteps = [
  'Intent',
  'Smart locator',
  'Synchronized W3C action',
  'Validation',
  'Allure evidence',
  'Doctor or Heal',
];

function Hero(): JSX.Element {
  return (
    <header className={styles.hero}>
      <div className={`container ${styles.heroGrid}`}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>Native Selenium, Playwright, Appium, REST Assured, CLI, database, and reporting support</span>
          <h1>One Java engine for web, mobile, API, database, and CLI automation.</h1>
          <p>
            Keep direct Selenium WebDriver, Microsoft Playwright, Appium, and REST Assured control.
            Use SHAFT when single-surface tools hit their boundary: synchronized
            browser actions, native mobile flows, API checks, database and CLI
            coverage, Allure evidence, visual reports, BDD patterns, and AI-native troubleshooting.
          </p>
          <div className={styles.actions}>
            <Link className="button button--primary button--lg" to="/docs/start/installation">
              Generate a runnable project
            </Link>
            <Link className="button button--secondary button--lg" to="/docs/testing/web">
              Read the minimal web test
            </Link>
          </div>
          <div className={styles.stackPills} aria-label="Native SHAFT integrations">
            {stackPills.map((pill) => <span key={pill}>{pill}</span>)}
          </div>
          <div className={styles.proofLinks} aria-label="Project evidence">
            <a href="https://central.sonatype.com/artifact/io.github.shafthq/shaft-engine">Maven Central</a>
            <a href="https://www.selenium.dev/ecosystem/#frameworks">Selenium ecosystem</a>
            <a href="https://opensource.googleblog.com/2023/05/google-open-source-peer-bonus-program-announces-first-group-of-winners-2023.html">Google Open Source award</a>
          </div>
        </div>
        <div className={styles.heroProof} aria-label="SHAFT quick proof">
          <div className={styles.proofHeader}>
            <span>Native engines, one suite</span>
            <Link to="#testing-surfaces">Compare surfaces</Link>
          </div>
          <div className={styles.heroEngineStrip} aria-label="Native engines available through SHAFT">
            {heroEngines.map((engine) => (
              <Link to={engine.to} key={engine.label}>
                <small>{engine.label}</small>
                <strong>{engine.engine}</strong>
              </Link>
            ))}
          </div>
          <pre>
            <code>{`SHAFT.GUI.WebDriver driver = new SHAFT.GUI.WebDriver();

driver.browser().navigateToURL("https://duckduckgo.com/")
  .and().element().type(By.name("q"), "SHAFT Engine")
  .and().assertThat().title().contains("DuckDuckGo");`}</code>
          </pre>
          <ul className={styles.heroChecklist}>
            <li>Native Selenium, Appium, and REST Assured APIs</li>
            <li>Automatic synchronization</li>
            <li>Allure evidence by default</li>
            <li>Grid, CLI, database, BDD, and agent paths stay open</li>
          </ul>
          <img
            src="/img/shaft-automation-hero.png"
            alt="A central automation engine connected to browser, mobile, API, terminal, and reporting interfaces"
            width="1792"
            height="1024"
          />
        </div>
      </div>
    </header>
  );
}

function ProofSection(): JSX.Element {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.sectionHeading}>
          <span className={styles.eyebrow}>For skeptical automation engineers</span>
          <Heading as="h2" id="why-shaft">SHAFT is not a wrapper that hides the real tools.</Heading>
          <p>
            It keeps the battle-tested engines underneath and removes the repeated work
            that makes large Selenium suites expensive to maintain.
          </p>
        </div>
        <div className={styles.decisionGrid} aria-label="When to choose SHAFT">
          {decisionPoints.map((point) => (
            <article key={point.label}>
              <strong>{point.label}</strong>
              <span>{point.value}</span>
            </article>
          ))}
        </div>
        <div className={styles.proofGrid}>
          {proofPoints.map((point) => (
            <Link className={styles.proofCard} to={point.to} key={point.title}>
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
    <section className={`${styles.section} ${styles.compactSection}`}>
      <div className="container">
        <div className={styles.sectionHeading}>
          <span className={styles.eyebrow}>Start narrow, keep the expansion path</span>
          <Heading as="h2" id="testing-surfaces">Web, native mobile GUI, and API checks share one spine.</Heading>
          <p>
            Selenium and Playwright focus the browser conversation. SHAFT is stronger
            when the product also needs native mobile screens, service checks, remote
            execution, and one evidence trail.
          </p>
        </div>
        <div className={styles.surfaceMapPanel} aria-label="Native engines connected through SHAFT">
          <div className={styles.engineHub}>
            <strong>SHAFT Engine</strong>
            <span>shared lifecycle, validation, configuration, and evidence</span>
          </div>
          <div className={styles.surfaceLanes}>
            {surfaceMap.map((surface) => (
              <Link className={styles.surfaceLane} to={surface.to} key={surface.label}>
                <small>{surface.label}</small>
                <strong>{surface.engine}</strong>
                <span>{surface.result}</span>
              </Link>
            ))}
          </div>
          <div className={styles.sharedRails}>
            {sharedRails.map((rail) => (
              <span key={rail}>{rail}</span>
            ))}
          </div>
        </div>
        <div className={styles.surfaceGrid}>
          {testSurfaces.map((surface) => (
            <Link className={styles.surfaceCard} to={surface.to} key={surface.title}>
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

function ComparisonSection(): JSX.Element {
  return (
    <section className={`${styles.section} ${styles.contrastSection}`}>
      <div className="container">
        <div className={styles.sectionHeading}>
          <span className={styles.eyebrow}>The honest comparison</span>
          <h2>Use Playwright for small browser-only suites. Use SHAFT when the test program has to scale.</h2>
          <p>
            The value is not another click API. The value is keeping native automation
            power while standardizing synchronization, evidence, design, and recovery.
          </p>
        </div>
        <div className={styles.comparisonGrid}>
          {comparisonRows.map((row) => (
            <article className={styles.comparisonRow} key={row.concern}>
              <strong>{row.concern}</strong>
              <p><span>Critic view:</span> {row.critic}</p>
              <p><span>SHAFT answer:</span> {row.shaft}</p>
            </article>
          ))}
        </div>
        <div className={styles.deepLinks}>
          <Link to="/docs/reference/actions/GUI/didYouKnow/Smart_Locators">Smart locators</Link>
          <Link to="/docs/reference/actions/GUI/didYouKnow/Local_Selenium_Grid_Execution">Selenium Grid</Link>
          <Link to="/docs/reference/guides/Fluent_Design">Fluent design</Link>
          <Link to="/docs/reference/guides/Cucumber_BDD_Steps">BDD with Cucumber</Link>
        </div>
      </div>
    </section>
  );
}

function AgentSection(): JSX.Element {
  return (
    <section className={`${styles.section} ${styles.agentBand}`}>
      <div className={`container ${styles.agentSection}`}>
        <div className={styles.agentIntro}>
          <span className={styles.eyebrow}>AI-native after the fundamentals are solid</span>
          <Heading as="h2" id="connect-ai-agent">Connect shaft-mcp to your application.</Heading>
          <p>
            SHAFT MCP exposes browser, Capture, Doctor, and Heal operations while
            the client retains its own model credentials and approval policy.
            The agent gets real automation tools; the framework keeps deterministic evidence.
          </p>
          <div className={styles.featureLinks}>
            <Link to="/docs/agentic/mcp">MCP setup</Link>
            <Link to="/docs/agentic/doctor">Diagnose with Doctor</Link>
            <Link to="/docs/agentic/heal">Recover with Heal</Link>
          </div>
        </div>
        <details className={styles.agentDetails}>
          <summary>Show install commands</summary>
          <McpApplications />
        </details>
      </div>
    </section>
  );
}

function WorkflowSection(): JSX.Element {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.sectionHeading}>
          <span className={styles.eyebrow}>What happens when the app fights back</span>
          <h2>Act, validate, report, diagnose, recover.</h2>
          <p>
            A flaky click should not send the team spelunking through console logs.
            SHAFT turns the test path into reviewable evidence.
          </p>
        </div>
        <div className={styles.workflow} aria-label="SHAFT test workflow">
          {workflowSteps.map((step) => <span key={step}>{step}</span>)}
        </div>
        <div className={styles.evidenceGrid}>
          <article>
            <strong>Less wait code in tests</strong>
            <p>Synchronized actions keep timing policy in the engine instead of scattered across every test class.</p>
          </article>
          <article>
            <strong>More signal when a run fails</strong>
            <p>Allure steps, screenshots, logs, API responses, command evidence, and Doctor analysis tell the failure story.</p>
          </article>
          <article>
            <strong>Scale without switching engines</strong>
            <p>Run locally, in CI, on Selenium Grid, Appium, cloud providers, and BDD suites with the same facade.</p>
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
        <h2>Start with native Selenium power. Keep the suite maintainable.</h2>
        <div className={styles.actions}>
          <Link className="button button--primary button--lg" to="/docs/start/installation">
            Generate a runnable project
          </Link>
          <Link className="button button--secondary button--lg" to="/docs/start/quick-start">
            Read quick start
          </Link>
          <Link className="button button--secondary button--lg" to="#connect-ai-agent">
            Connect your AI agent
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home(): JSX.Element {
  return (
    <Layout
      title="Unified Web, Mobile, API, Database, and CLI Test Automation"
      description="SHAFT keeps native Selenium, Playwright, Appium, and REST Assured access while adding database and CLI coverage, synchronization, smart locators, reporting, Grid execution, BDD design, and agentic troubleshooting."
    >
      <Hero />
      <main>
        <ProofSection />
        <SurfaceSection />
        <ComparisonSection />
        <WorkflowSection />
        <AgentSection />
        <FinalCta />
      </main>
    </Layout>
  );
}
