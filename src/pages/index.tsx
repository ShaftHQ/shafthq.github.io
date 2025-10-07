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
        <p className="hero__subtitle"><b>Stop</b> reinventing the wheel,<br/> <b>Start</b> using SHAFT.</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/Getting_Started/welcome">
            🚀 Get Started
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
                        <p className="hero__subtitle"><b>What are you waiting for?</b></p>
                        <div className={styles.buttons}>
                            <Link
                                className="button button--secondary button--lg"
                                to="/docs/Getting_Started/welcome">
                                🚀 Get Started
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
      description="Stop reinventing the wheel. Start using SHAFT. This is the official user guide for using SHAFT; The Unified Test Automation Engine.">
      <Header />
      <main>
        <HomepageFeatures />
          <RoiCalculator/>
      </main>
        <Footer />
    </Layout>
  );
}
