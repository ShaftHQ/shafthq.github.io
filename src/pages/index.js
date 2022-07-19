import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const features = [
  {
    title: <>A Unified Test Automation Engine</>,
    imageUrl: 'img/mindmap.svg',
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
//  {
//    title: <>Focus on What Matters</>,
//    imageUrl: 'img/undraw_docusaurus_tree.svg',
//    description: (
//      <>
//        Docusaurus lets you focus on your docs, and we&apos;ll do the chores. Go
//        ahead and move your docs into the <code>docs</code> directory.
//      </>
//    ),
//  },
//  {
//    title: <>Powered by React</>,
//    imageUrl: 'img/undraw_docusaurus_react.svg',
//    description: (
//      <>
//        Extend or customize your website layout by reusing React. Docusaurus can
//        be extended while reusing the same header and footer.
//      </>
//    ),
//  },
];

function Feature({imageUrl, title, description}) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx('col col--12', styles.feature)}>
    <h3>{title}</h3>
    <p>{description}</p>
      {imgUrl && (
        <div className="text--center">
        <a href={imgUrl} target="_blank">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
          </a>
        </div>
      )}
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Stop reinventing the wheel. Start using SHAFT. This is the official user guide for using SHAFT; The Unified Test Automation Engine.">
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={clsx(
                'button button--outline button--secondary button--lg',
                styles.getStarted,
              )}
              to={useBaseUrl('docs/')}>
              Upgrade Now
            </Link>
          </div>
        </div>
      </header>
      <main>
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
