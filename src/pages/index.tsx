import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import styles from './index.module.css';

function Header() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/Getting_Started/first_steps">
            ⚡ Upgrade Now ⚡
          </Link>
        </div>
      </div>
    </header>
  );
}

function Footer() {
    return (
        <div>
            <section>
                <center>
                    <header className={clsx('hero hero--primary', styles.heroBanner)}>
                        <div className="container">
                            <p className="hero__subtitle">What are you waiting for?</p>
                            <div className={styles.buttons}>
                                <Link
                                    className="button button--secondary button--lg"
                                    to="/docs/Getting_Started/first_steps">
                                    ⚡ Upgrade Now ⚡
                                </Link>
                            </div>
                        </div>
                    </header>
                </center>
            </section>
        </div>
    );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.organizationName}`}
      description="Stop reinventing the wheel. Start using SHAFT. This is the official user guide for using SHAFT; The Unified Test Automation Engine.">
      <Header />
      <main>
        <HomepageFeatures />
      </main>
        <Footer />
    </Layout>
  );
}
