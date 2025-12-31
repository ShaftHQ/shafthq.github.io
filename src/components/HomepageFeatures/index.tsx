import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import Link from "@docusaurus/Link";
// global import for fontawesome icons
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { faTwitter, faFontAwesome } from '@fortawesome/free-brands-svg-icons'
library.add(fas, faTwitter, faFontAwesome)
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

type FeatureItem = {
    title: string;
    svg: string; //https://fontawesome.com/search?o=r&m=free
    description: JSX.Element;
};

const FeatureListRow1: FeatureItem[] = [
    {
        title: 'Maximize ROI & Efficiency',
        svg: "fa-solid fa-money-bill-trend-up",
        description: (
            <>
                Focus on designing your tests while SHAFT handles synchronization, screenshots, logging, and reporting
                with <b>zero</b> <code>boilerplate code</code>
            </>
        ),
    },
    {
        title: 'All-in-One Solution',
        svg: "fa-solid fa-list-check",
        description: (
            <>
                Unified engine for <b>Web</b>, <b>Mobile</b>, <b>API</b>, <b>CLI</b>, and <b>Database</b> test automation—no more juggling multiple tools
            </>
        ),
    },
    {
        title: 'Wizard-Like Syntax',
        svg: "fa-solid fa-hat-wizard",
        description: (
            <>
                Intuitive fluent API: just type <b><code>SHAFT.</code></b> and discover all capabilities instantly
            </>
        ),
    },
];

const FeatureListRow2: FeatureItem[] = [
    {
        title: 'Award-Winning Framework',
        svg: "fa-solid fa-trophy",
        description: (
            <>
                <a href={'https://opensource.googleblog.com/2023/05/google-open-source-peer-bonus-program-announces-first-group-of-winners-2023.html'}>
                    <b>Google Open Source</b> Peer Bonus</a> award winner and trusted globally
            </>
        ),
    },
    {
        title: 'Official Selenium Ecosystem',
        svg: "fa-solid fa-globe",
        description: (
            <>
                Proud member of the <a href={'https://www.selenium.dev/ecosystem/#frameworks'}> official <b>Selenium
                ecosystem</b> frameworks</a> with 40,000+ active users worldwide
            </>
        ),
    },
    {
        title: 'Future-Proof & Standards-Compliant',
        svg: "fa-solid fa-battery-full",
        description: (
            <>
                <a href={'https://www.w3.org/standards'}><b>W3C</b> standard compliant</a>
                , <a href={'https://w3c.github.io/webdriver-bidi'}>WebDriver <b>BiDi</b> enabled</a>
                , and <a href={'https://www.selenium.dev/documentation/webdriver'}>fully <b>supported</b></a> by the Selenium project
            </>
        ),
    },
];

function Feature({title, svg, description}: FeatureItem) {
    return (
        <div className={clsx('col')}>
            <div className="text--center" style={{
                margin: '1rem 0',
                borderRadius: 30,
                padding: '0rem',
                height: '60px',
            }}>
                <FontAwesomeIcon className={styles.featureSvg} icon={svg} role="img"/>
            </div>
            <div className="text--center padding-horiz--md"  style={{
                borderRadius: 30,
                padding: '0rem',
            }}>
                <h3>{title}</h3>
                <p>{description}</p>
            </div>
            <br/>
        </div>
    );
}

export default function HomepageFeatures(): JSX.Element {
    return (
        <div>
            <section className={styles.features}>
                <div className="container">
                    <div className="row">
                        {FeatureListRow1.map((props, idx) => (
                            <Feature key={idx} {...props} />
                        ))}
                    </div>
                    <div className="row">
                        {FeatureListRow2.map((props, idx) => (
                            <Feature key={idx} {...props} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}