import React from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import chaosEngineJsonLd from '@site/src/data/chaosengine-jsonld';
import {chaosEngineFaqs} from '@site/src/data/chaosengine-faqs';

const LEAD =
  'MIT-licensed provider-neutral portable working contract for coding agents. ' +
  'Installs one canonical skill, host adapters, and verified local tooling for Codex, Claude, Gemini, Grok, and GitHub Copilot without tying a project to one model or client. ' +
  'Ships as the chaos-engine/ tree inside ShaftHQ/SHAFT_ENGINE. ' +
  'ChaosEngine = AI agent harness by ShaftHQ, not the 1993 video game.';

export default function ChaosEngineEntityPage(): JSX.Element {
  return (
    <Layout
      title="ChaosEngine — entity facts"
      description={LEAD}
    >
      <Head>
        <script type="application/ld+json">
          {JSON.stringify(chaosEngineJsonLd)}
        </script>
      </Head>
      <main className="container margin-vert--lg" style={{maxWidth: 820}}>
        <h1>ChaosEngine — entity facts</h1>
        <p><strong>{LEAD}</strong></p>
        <p>
          Not chaos-engineering / fault-injection tooling, and not a standalone
          ShaftHQ GitHub repository — the source tree lives inside{' '}
          <a href="https://github.com/ShaftHQ/SHAFT_ENGINE/tree/main/chaos-engine">
            ShaftHQ/SHAFT_ENGINE/chaos-engine
          </a>
          .
        </p>
        <table>
          <thead>
            <tr><th>Fact</th><th>Value</th></tr>
          </thead>
          <tbody>
            <tr><td>Name</td><td>ChaosEngine (<code>chaos-engine</code>)</td></tr>
            <tr><td>Type</td><td>Provider-neutral agent harness / portable working contract</td></tr>
            <tr><td>License</td><td>MIT</td></tr>
            <tr>
              <td>Source tree</td>
              <td>
                <a href="https://github.com/ShaftHQ/SHAFT_ENGINE/tree/main/chaos-engine">
                  github.com/ShaftHQ/SHAFT_ENGINE/tree/main/chaos-engine
                </a>
              </td>
            </tr>
            <tr>
              <td>Docs</td>
              <td>
                <a href="/docs/agentic/chaos-engine">/docs/agentic/chaos-engine</a>
              </td>
            </tr>
            <tr>
              <td>Install guide</td>
              <td>
                <a href="/docs/agentic/chaos-engine-install-guide">/docs/agentic/chaos-engine-install-guide</a>
              </td>
            </tr>
            <tr>
              <td>Arabic intro</td>
              <td>
                <a href="https://www.automatest.org/chaosengine">automatest.org/chaosengine</a>
              </td>
            </tr>
            <tr><td>Creator</td><td>Mohab Mohie (ShaftHQ)</td></tr>
            <tr>
              <td>Version</td>
              <td>
                Prefer live from <code>chaos-engine/VERSION</code>. Pilot snapshot:{' '}
                <strong>2026.10.31.5</strong> (refresh at publish; 2026.10.31.6 pending).
              </td>
            </tr>
            <tr><td>Parent product</td><td>SHAFT_ENGINE (separate entity)</td></tr>
          </tbody>
        </table>
        <h2>Common questions</h2>
        {chaosEngineFaqs.map((faq) => (
          <details key={faq.id} {...(faq.rtl ? {dir: 'rtl' as const, lang: 'ar'} : {})}>
            <summary>{faq.question}</summary>
            <p>{faq.answerText}</p>
          </details>
        ))}
      </main>
    </Layout>
  );
}
