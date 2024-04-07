import React, { useState } from "react";
import Input from "./input";
import "./styles.css";
import clsx from "clsx";
import styles from "../../pages/index.module.css";
import Link from "@docusaurus/Link";

const App = () => {
    const [count, setCount] = useState("");
    const [count2, setCount2] = useState("");
    const [count3, setCount3] = useState("");
    const [count4, setCount4] = useState("");

    const handleaddNumber = (e) => {
        //# Tests to be automated:
        setCount(e.target.value);
    };

    const handleaddNumber2 = (e) => {
        //Average execution time per test (manual):
        setCount2(e.target.value);
    };

    const handleaddNumber3 = (e) => {
        //Number of releases per year:
        setCount3(e.target.value);
    };

    const handleaddNumber4 = (e) => {
        //Number of releases per year:
        setCount4(e.target.value);
    };

    function resetValFunc() {
        setCount("");
        setCount2("");
        setCount3("");
        setCount4("");
    }

    return (
    <div>
            <header className={clsx('hero hero--primary', styles.heroBanner)}>
                    <div className="Calculator Inputs" align={"left"}>
                        <table>
                            <tbody>
                            <tr>
                                <th><label># Tests to be automated:</label></th>
                                <td><input onChange={handleaddNumber} value={count} type="number" /></td>
                                <td>Exhaustive automation is not possible, so as a maximum try not to
                                    exceed <code>80%</code> of your total tests.
                                </td>
                            </tr>
                            <tr>
                                <th><label>Average manual execution time (minutes/test):</label></th>
                                <td><input onChange={handleaddNumber2} value={count2} type="number" /></td>
                                <td></td>
                            </tr>
                            <tr>
                                <th><label>Estimated # test runs per year:</label></th>
                                <td><input onChange={handleaddNumber3} value={count3} type="number" /></td>
                                <td>• If you plan to execute your tests as Nightly Builds, then
                                    input <code>365</code>. <br/>
                                    • If you plan to execute only once every sprint. then input <code># sprints per release *
                                    # releases per year</code>.
                                </td>
                            </tr>
                            <tr>
                                <th><label># Target test execution platforms:</label></th>
                                <td><input onChange={handleaddNumber4} value={count4} type="number" /></td>
                                <td>• If you plan to execute your tests against 3 browsers (CH,FF,SA) and 3 operating
                                    systems (Win/Lin/Mac) then
                                    input <code>9</code>. <br/>
                                    • If you plan to use SHAFT for Mobile GUI testing, then input a minimum
                                    of <code>2</code> for Android and iOS. Feel free to multiply by the number of OS
                                    versions and device manufacturers if you want to target more devices. <br/>
                                    • If you plan to use SHAFT for API/CLI/DB testing, then input <code>1</code>.
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <div className={styles.buttons}>
                            <Input values={count} values2={count2} values3={count3} values4={count4} />
                            {/*<Input values={count} values2={count2} values3={count3} values4={count4} resetVal={resetValFunc} />*/}
                        </div>
                    </div>
            </header>
    </div>
    )
        ;
};

export default App;
