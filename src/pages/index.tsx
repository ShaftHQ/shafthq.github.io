import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import RoiCalculator from '@site/src/components/RoiCalculator';
import styles from './index.module.css';

function Header() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">SHAFT: Unified Test Automation Engine</h1>
        <p className="hero__subtitle">Write once, test everywhere.<br/>Web • Mobile • API • CLI • Database</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/Getting_Started/first_steps">
            Get Started Free ⚡
          </Link>
        </div>
      </div>
    </header>
  );
}

function Footer() {
    return (
        <div>
            <center>
                <header>
                    <div className="container">
                        <br/>
                        <p className="hero__subtitle"><b>Ready to transform your test automation?</b></p>
                        <div className={styles.buttons}>
                            <Link
                                className="button button--secondary button--lg"
                                to="/docs/Getting_Started/first_steps">
                                Start Your Journey ⚡
                            </Link>
                        </div>
                        <br/><br/>
                    </div>
                </header>
            </center>
        </div>
    );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.organizationName}`}
      description="Transform your test automation with SHAFT - the award-winning, all-in-one automation engine for Web, Mobile, API, CLI, and Database testing. Zero boilerplate, maximum productivity.">
      <Header />
      <main>
        <HomepageFeatures />
          <RoiCalculator/>
      </main>
        <Footer />
    </Layout>
  );
}
