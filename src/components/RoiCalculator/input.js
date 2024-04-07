import React, { useState } from "react";
import "./styles.css";
import styles from "../../pages/index.module.css";
import Link from "@docusaurus/Link";

const Input = (props) => {
    const [value, setValue] = useState(0);

    const addNum = (val, val2, val3, val4) => {
        let a = parseInt(val, 0);
        let b = parseInt(val2, 0);
        let c = parseInt(val3, 0);
        let d = parseInt(val4, 0);

        console.log(a, b, c, d);

        // 3 hours framework dev time
        // 0.5 hour/test dev time
        let manualExecutionEffort = a*c*(b/60); //tests to be automated * test runs per year * average manual execution time per test per hour
        let automatedExecutionEffort = manualExecutionEffort * 5/100; // 5% from the manual execution effort (if not 100% unattended)
        let automationUpskillingEffort = 5*8; // 5 days of training and upskilling coming from selenium experience
        let automationFrameworkDevEffort = 8; // 1 work day in total
        let automatedTestDevEffort = a*(4*(b/60)); // tests to be automated * four times the average manual execution time per test per hour
        let automatedMaintenanceEffort = 0.5 * c; // half an hour per test run
        let targetPlatformMultiplier = d; // number of target platforms
        let parallelThreadCount = 1; // minimum number of parallel threads

        let totalSavings = manualExecutionEffort-automatedExecutionEffort;
        let totalCost = automationUpskillingEffort+automationFrameworkDevEffort+automatedTestDevEffort+automatedMaintenanceEffort;
        let totalMultipliers = targetPlatformMultiplier*parallelThreadCount;

        let roi = (totalSavings - totalCost) * totalMultipliers;
        console.log(roi);
        setValue(Math.floor(roi));
        // props.resetVal();
        if (roi > 0) {
            document.getElementById("roi-results").style.display = 'block';
        }
    };

    return (
        <div className="Calculator Results" align={"center"}>
            <br/>
            <div className={styles.buttons}>
                <Link
                    className="button button--secondary button--lg"
                    onClick={() => addNum(props.values, props.values2, props.values3, props.values4)}>
                    📱 Calculate ROI 📱
                </Link>
            </div>
            {/*<br/><code><label>ROI = (<sup>Savings</sup>/<sub>Investment</sub>) x 100</label></code>*/}
            <div id={"roi-results"}>
                <br/><b><label>{value > 0 ? "Estimated ROI ≈ " + value.toLocaleString() + "%" : ""} </label></b><br/><br/>
                <p align={"left"}>
                    <b>Assumptions:</b>
                    <br/>• Automated execution effort = 5% from the manual execution effort (if not 100% unattended).
                    <br/>• Upskilling effort = 1 work week.
                    <br/>• Framework dev effort = 1 work day.
                    <br/>• Maintenance effort = 0.5 hours per test run.
                    <br/>• Sequential execution (Multiply the above ROI * Number of parallel threads).
                </p>
            </div>
        </div>
    )
        ;
};

export default Input;
