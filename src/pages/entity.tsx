import React from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import projectSignals from '@site/src/data/project-signals.json';
import {getHomepageFaqs} from '@site/src/data/homepage-faqs';

/**
 * GEO entity facts page for SHAFT Engine (SEO/AEO/GEO pilot2).
 * Star/release numbers prefer live badges; committed signals shown with as-of label only as fallback.
 */
export default function EntityPage(): JSX.Element {
  const faqs = getHomepageFaqs(projectSignals.javaVersion);
  return (
    <Layout
      title="SHAFT Engine entity facts"
      description="Entity facts for SHAFT Engine — MIT-licensed open-source Java test automation for web, mobile, API, CLI, database, and desktop.">
      <main className="container margin-vert--lg" data-testid="entity-main">
        <Heading as="h1">SHAFT Engine — entity facts</Heading>
        <p>
          <strong>SHAFT Engine</strong> (also <strong>SHAFT</strong>, <strong>SHAFT_ENGINE</strong>, Maven{' '}
          <code>io.github.shafthq:shaft-engine</code>) is a MIT-licensed open-source Java test automation engine for web,
          mobile, API, CLI, database, and desktop testing. Drivers, waits, and evidence are handled; every run ends in an
          Allure report.
        </p>
        <table>
          <thead>
            <tr>
              <th>Fact</th>
              <th>Value</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Creator</td>
              <td>Mohab Mohie</td>
              <td>
                <Link to="/blog/welcome">Welcome</Link> (author title: SHAFT_Engine creator); Maven Central developers
              </td>
            </tr>
            <tr>
              <td>Organization</td>
              <td>ShaftHQ</td>
              <td>
                <a href="https://github.com/ShaftHQ" target="_blank" rel="noreferrer">
                  https://github.com/ShaftHQ
                </a>
              </td>
            </tr>
            <tr>
              <td>User guide</td>
              <td>
                <a href="https://shafthq.github.io/">https://shafthq.github.io/</a>
              </td>
              <td>live canonical</td>
            </tr>
            <tr>
              <td>Source repo</td>
              <td>
                <a href="https://github.com/ShaftHQ/SHAFT_ENGINE" target="_blank" rel="noreferrer">
                  https://github.com/ShaftHQ/SHAFT_ENGINE
                </a>
              </td>
              <td>GitHub</td>
            </tr>
            <tr>
              <td>License</td>
              <td>MIT</td>
              <td>GitHub API license.spdx_id</td>
            </tr>
            <tr>
              <td>Java baseline</td>
              <td>{projectSignals.javaVersion}</td>
              <td>
                <Link to="/docs/start/installation">Installation</Link> / project-signals
              </td>
            </tr>
            <tr>
              <td>Selenium ecosystem</td>
              <td>Listed under frameworks</td>
              <td>
                <a href="https://www.selenium.dev/ecosystem/#frameworks" target="_blank" rel="noreferrer">
                  selenium.dev/ecosystem/#frameworks
                </a>
              </td>
            </tr>
            <tr>
              <td>Stars</td>
              <td>
                <a href="https://img.shields.io/github/stars/ShaftHQ/SHAFT_ENGINE" target="_blank" rel="noreferrer">
                  GitHub stargazers badge
                </a>
                {' '}
                (committed baseline {projectSignals.stars.toLocaleString('en-US')} as of 2026-10-31 Africa/Cairo)
              </td>
              <td>GitHub API</td>
            </tr>
            <tr>
              <td>Latest release</td>
              <td>
                <a href="https://github.com/ShaftHQ/SHAFT_ENGINE/releases/latest" target="_blank" rel="noreferrer">
                  Releases
                </a>
                {' '}
                (committed baseline {projectSignals.engineVersion} as of 2026-10-31 Africa/Cairo)
              </td>
              <td>GitHub Releases / Maven Central</td>
            </tr>
          </tbody>
        </table>

        <Heading as="h2">Common questions</Heading>
        <div>
          {faqs.map((faq) => (
            <details key={faq.question} {...(faq.rtl ? {dir: 'rtl', lang: 'ar'} : {})}>
              <summary>{faq.question}</summary>
              <p>{faq.answerText}</p>
            </details>
          ))}
        </div>
      </main>
    </Layout>
  );
}
