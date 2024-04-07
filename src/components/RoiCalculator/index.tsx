import React, { StrictMode } from "react";
import ReactDOM from "react-dom";

import App from "./App";
import styles from "../HomepageFeatures/styles.module.css";
import Link from "@docusaurus/Link";
import clsx from "clsx";

export default function RoiCalculator(){
    return (
    <div>
        <section>
            <center>
                <header className={clsx('hero hero--primary', styles.heroBanner)}>
                    <div className="container">
                        <label className="hero__subtitle">What's your <b>Return on Investment</b>?</label>
                        <br/>ROI = (<sup>Savings</sup>/<sub>Investment</sub>) * 100
                        <StrictMode>
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