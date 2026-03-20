import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import Link from "@docusaurus/Link";
// global import for fontawesome icons
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { faTwitter, faFontAwesome } from '@fortawesome/free-brands-svg-icons'
library.add(fas, faTwitter, faFontAwesome)
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    RoiBackground,
    AllInOneBackground,
    WizardBackground,
    TrophyBackground,
    GlobeBackground,
    FutureProofBackground,
} from './FeatureBackgrounds';

type FeatureItem = {
    title: string;
    svg: string; //https://fontawesome.com/search?o=r&m=free
    description: JSX.Element;
    background: React.ComponentType;
};

const FeatureListRow1: FeatureItem[] = [
    {
        title: 'Maximize ROI & Efficiency',
        svg: "fa-solid fa-money-bill-trend-up",
        background: RoiBackground,
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
        background: AllInOneBackground,
        description: (
            <>
                Unified engine for <b>Web</b>, <b>Mobile</b>, <b>API</b>, <b>CLI</b>, and <b>Database</b> test automation—no more juggling multiple tools
            </>
        ),
    },
    {
        title: 'Wizard-Like Syntax',
        svg: "fa-solid fa-hat-wizard",
        background: WizardBackground,
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
        background: TrophyBackground,
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
        background: GlobeBackground,
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
        background: FutureProofBackground,
        description: (
            <>
                <a href={'https://www.w3.org/standards'}><b>W3C</b> standard compliant</a>
                , <a href={'https://w3c.github.io/webdriver-bidi'}>WebDriver <b>BiDi</b> enabled</a>
                , and <a href={'https://www.selenium.dev/documentation/webdriver'}>fully <b>supported</b></a> by the Selenium project
            </>
        ),
    },
];

function Feature({title, svg, description, background: BackgroundSvg}: FeatureItem) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)',
        ).matches;
        if (prefersReducedMotion) {
            el.classList.add(styles.featureVisible);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.classList.add(styles.featureVisible);
                }
            },
            { threshold: 0.15 },
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div className={clsx('col')} ref={ref}>
            <div className={styles.featureCard}>
                <div className={styles.featureBackground}>
                    <BackgroundSvg />
                </div>
                <div className="text--center" style={{
                    margin: '1rem 0',
                    borderRadius: 30,
                    padding: '0rem',
                    height: '60px',
                    position: 'relative',
                    zIndex: 1,
                }}>
                    <FontAwesomeIcon className={styles.featureSvg} icon={svg} role="img"/>
                </div>
                <div className="text--center padding-horiz--md" style={{
                    borderRadius: 30,
                    padding: '0rem',
                    position: 'relative',
                    zIndex: 1,
                }}>
                    <h3>{title}</h3>
                    <p>{description}</p>
                </div>
            </div>
        </div>
    );
}

export default function HomepageFeatures(): JSX.Element {
    return (
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
    );
}