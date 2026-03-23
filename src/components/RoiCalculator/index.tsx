import React, { StrictMode } from "react";
import ReactDOM from "react-dom";
import BrowserOnly from '@docusaurus/BrowserOnly';

import App from "./App";
import styles from "../HomepageFeatures/styles.module.css";
import Link from "@docusaurus/Link";
import clsx from "clsx";
import ParticleBackground from '@site/src/components/ParticleBackground';

export default function RoiCalculator(){
    return (
    <div>
        <section>
            <center>
                <header className={clsx('hero hero--primary', styles.heroBanner)}>
                    <BrowserOnly fallback={<div />}>
                        {() => (
                            <ParticleBackground
                                particleCount={14}
                                connectionDistance={85}
                                motionScale={0.45}
                            />
                        )}
                    </BrowserOnly>
                    <div className={clsx('container', styles.sectionForeground)}>
                        <label className="hero__subtitle">What's your <b>Return on Investment</b>?</label>
                        <br/>ROI = (<sup>Savings</sup>/<sub>Investment</sub>) * 100
                        <br/><br/><StrictMode>
                        <App/>
                    </StrictMode>
                    </div>
                </header>
            </center>
        </section>
    </div>
)
    ;
}
