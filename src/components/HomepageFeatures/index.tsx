import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import Link from '@docusaurus/Link';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

type MindMapItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};


const FeatureList: FeatureItem[] = [
  {
    title: 'Focus on What Matters',
    Svg: require('@site/static/img/code.svg').default,
    description: (
      <>
        Focus on designing your tests, and we&apos;ll handle the wrapper classes, synchronization issues and <code>boilerplate code</code>. Go
        ahead and upgrade your project, so that you can focus on implementing <a href="https://www.selenium.dev/documentation/test_practices/encouraged/">recommended 
        test practices</a>.
      </>
    ),
  },
  {
    title: 'Easy to Use',
    Svg: require('@site/static/img/easy.svg').default,
    description: (
      <>
        Just write <code>SHAFT.</code> and watch the magic unfold. Our single entry point 
        and wizard-like fluent syntax helps you locate hard to find elements, chain actions
        , and build complex validations with ease.
      </>
    ),
  },
  {
    title: 'Powered by Selenium',
    Svg: require('@site/static/img/selenium.svg').default,
    description: (
      <>
        If you want to create robust, browser-based regression automation suites
        and tests, scale and distribute scripts across many environments,
        then you want to use Selenium WebDriver, a collection of language specific
        bindings to drive a browser - the way it is meant to be driven. <a href="https://www.selenium.dev/documentation/webdriver/">Learn more.</a>
      </>
    ),
  },
];

const MindMapList: MindMapItem[] = [
  {
    title: 'A Unified Test Automation Engine',
    Svg: require('@site/static/img/mindmap.svg').default,
    description: (
      <>
        SHAFT is an open-source MIT licensed test automation engine. It provides easy to use syntax to eliminate the need to write boilerplate code
        so that you can start authoring your automated tests immediately without waste. It also provides full unlimited access to all the best-in-class underlying
        testing frameworks like Selenium WebDriver, Appium, RestAssured, SikuliX, and others. SHAFT supports all kinds of automation across different platforms.
        Use SHAFT only if you want to maximize your ROI and create Scalable, Reliable, and Maintainable test automation without the waste of
        recreating an automation framework from scratch.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

function MainFeature({title, Svg, description}: FeatureItem) {
  return (
    <div>
      <div className={clsx('col')}>
        <br/><br/>
        <div className="text--center padding-horiz--md">
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
        <div className="text--center">
          <Svg className={styles.mainFeatureSvg} role="img" />
        </div>
        <div className="text--center padding-horiz--md">
        </div>
      </div>
      <center>
      <br/><br/>
        <header className={clsx('text--center')}>
          <div className="container">
            <p className="hero__subtitle">Are you still here?</p>
            <div className={styles.buttons}>
              <Link
                className="button button--secondary button--lg"
                to="/docs/Getting_Started/Prerequisites">
                Upgrade Now - 15min ⏱️
              </Link>
            </div>
            <br/><br/><br/>
          </div>
        </header>
      </center>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <div>
      <section className={styles.features}>
        <div className="container">
          <div className="row">
            {FeatureList.map((props, idx) => (
              <Feature key={idx} {...props} />
            ))}
          </div>
        </div>
      </section>
      <div>
          {MindMapList.map((props, idx) => (
            <MainFeature key={idx} {...props} />
          ))}
        </div>
    </div>
  );
}
