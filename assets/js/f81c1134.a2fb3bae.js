"use strict";(self.webpackChunkshaft_user_guide=self.webpackChunkshaft_user_guide||[]).push([[4031],{4108:e=>{e.exports=JSON.parse('{"archive":{"blogPosts":[{"id":"virtual-threads","metadata":{"permalink":"/blog/virtual-threads","editUrl":"https://github.com/ShaftHQ/shafthq.github.io/blob/master/blog/2024-01-27-virtual-threads-release.md","source":"@site/blog/2024-01-27-virtual-threads-release.md","title":"New Feature Announcement - Virtual Threads","description":"We\'re starting off 2024 with a huge announcement!","date":"2024-01-27T00:00:00.000Z","tags":[{"inline":true,"label":"shaft_engine","permalink":"/blog/tags/shaft-engine"},{"inline":true,"label":"java","permalink":"/blog/tags/java"},{"inline":true,"label":"virtual_threads","permalink":"/blog/tags/virtual-threads"}],"readingTime":1.585,"hasTruncateMarker":false,"authors":[{"name":"Mustafa Agamy","title":"SHAFT_Engine maintainer","url":"https://github.com/MustafaAgamy","imageURL":"https://github.com/MustafaAgamy.png","key":"agamy"}],"frontMatter":{"slug":"virtual-threads","title":"New Feature Announcement - Virtual Threads","authors":["agamy"],"tags":["shaft_engine","java","virtual_threads"]},"unlisted":false,"nextItem":{"title":"Bing AI framework comparison","permalink":"/blog/bingAI"}},"content":"We\'re starting off 2024 with a huge announcement!\\n\\n# <b>SHAFT_Engine</b> is introducing Virtual Threads for Everyday Tasks \ud83c\udf89\ud83c\udf89\\n\\n<a href=\\"https://github.com/ShaftHQ/SHAFT_ENGINE\\" target=\\"_blank\\"><img src=\\"https://raw.githubusercontent.com/ShaftHQ/SHAFT_ENGINE/master/src/main/resources/images/shaft.png\\" alt=\\"SHAFT_Engine\\" height=\\"50px\\" /></a>    \\n\ud83e\udd1d\\n\\n\\n<a href=\\"https://www.oracle.com/\\" target=\\"_blank\\"><img src=\\"https://miro.medium.com/v2/resize:fit:640/0*QGvD2k4DPfPMfpd5.png\\" alt=\\"Oracle\\" height=\\"50px\\" /></a>\\n\\n### - The future of automation frameworks is here, and it\'s all about working smarter, not harder. \\n### - SHAFT_ENGINE, your trusty automation solution, just got a major upgrade with virtual threads, a clever trick that makes it more efficient and helpful than ever.\\n\\n## - What is a Virtual Thread?\\n\\n - [Virtual-Threads](https://docs.oracle.com/en/java/javase/21/core/virtual-threads.html), introduced with Java 21 are a new way to handle multiple tasks concurrently within a single program or application. They\'re the new java way for asynchronous operations.\\n - Think of it like hiring a whole crew of tiny helpers. While one tractor\'s plowing, another can check the soil, and another can keep an eye on the weather.\\n - These lightweight assistants don\'t need fancy equipment or guzzle up resources, meaning SHAFT_ENGINE can now handle a ton more tasks without breaking a sweat.\\n\\n#### Now let\'s think of test automation. In automating a registration form, envision employing a crew of virtual threads as tiny helpers :\\n - Rather than idly waiting for the entire site to load, each virtual thread can be assigned specific tasks as soon as the relevant elements become available. For instance, one thread focuses on inputting the username, another simultaneously handles the email input, and yet another sets the password. This parallel execution optimizes efficiency, ensures prompt responsiveness to dynamically changing elements, and efficiently utilizes resources.\\n - As the crew of virtual threads collaborates seamlessly, the registration form is filled and submitted swiftly, providing a more agile and responsive automation process compared to traditional sequential approaches.\\n\\n## - Save your execution Time :\\n\\n- That\'s not all, SHAFT_ENGINE utilities the Virtual Threads for Engine launch and configuration which will make your overall experience a lot faster and swifter."},{"id":"bingAI","metadata":{"permalink":"/blog/bingAI","editUrl":"https://github.com/ShaftHQ/shafthq.github.io/blob/master/blog/2023-04-27-bingAI.md","source":"@site/blog/2023-04-27-bingAI.md","title":"Bing AI framework comparison","description":"We asked Bing AI to compare SHAFT against some of the well known test automation options, here\'s what it had to say:","date":"2023-04-27T00:00:00.000Z","tags":[{"inline":true,"label":"shaft_engine","permalink":"/blog/tags/shaft-engine"},{"inline":true,"label":"selenium","permalink":"/blog/tags/selenium"},{"inline":true,"label":"cypress","permalink":"/blog/tags/cypress"},{"inline":true,"label":"playwright","permalink":"/blog/tags/playwright"}],"readingTime":1.2,"hasTruncateMarker":false,"authors":[{"name":"Mohab Mohie","title":"SHAFT_Engine creator","url":"https://github.com/MohabMohie","imageURL":"https://github.com/MohabMohie.png","key":"mohab"}],"frontMatter":{"slug":"bingAI","title":"Bing AI framework comparison","authors":["mohab"],"tags":["shaft_engine","selenium","cypress","playwright"]},"unlisted":false,"prevItem":{"title":"New Feature Announcement - Virtual Threads","permalink":"/blog/virtual-threads"},"nextItem":{"title":"New release announcement (7.1.20230309)","permalink":"/blog/release_announcement_7.1.20230309"}},"content":"**We asked Bing AI to compare SHAFT against some of the well known test automation options, here\'s what it had to say:**\\n\\n`Sure! Here is an expanded comparison between SHAFT_Engine, native Selenium WebDriver, Cypress and Microsoft Playwright in a tabular format:`\\n<table>\\n<thead>\\n<tr>\\n<th>Feature</th>\\n<th>SHAFT_Engine</th>\\n<th>Selenium WebDriver</th>\\n<th>Cypress</th>\\n<th>Microsoft Playwright</th>\\n</tr>\\n</thead>\\n<tbody><tr>\\n<td>Web GUI testing</td>\\n<td>Yes</td>\\n<td>Yes</td>\\n<td>Yes</td>\\n<td>Yes</td>\\n</tr>\\n<tr>\\n<td>Mobile testing</td>\\n<td>Yes</td>\\n<td>No (Appium required)</td>\\n<td>No</td>\\n<td>No</td>\\n</tr>\\n<tr>\\n<td>API testing</td>\\n<td>Yes</td>\\n<td>No</td>\\n<td>Yes</td>\\n<td>No</td>\\n</tr>\\n<tr>\\n<td>CLI testing</td>\\n<td>Yes</td>\\n<td>No</td>\\n<td>No</td>\\n<td>No</td>\\n</tr>\\n<tr>\\n<td>Database testing</td>\\n<td>Yes</td>\\n<td>No</td>\\n<td>No</td>\\n<td>No</td>\\n</tr>\\n<tr>\\n<td>Built-in test synchronization</td>\\n<td>Yes</td>\\n<td>No</td>\\n<td>Yes</td>\\n<td>Yes</td>\\n</tr>\\n<tr>\\n<td>Built-in logging and reporting</td>\\n<td>Yes</td>\\n<td>No</td>\\n<td>Yes</td>\\n<td>Yes</td>\\n</tr>\\n<tr>\\n<td>Integration with third-party tools (e.g. Jira, Xray, Browserstack)</td>\\n<td>Yes</td>\\n<td>No</td>\\n<td>Limited</td>\\n<td>Limited</td>\\n</tr>\\n<tr>\\n<td>Unlimited access to underlying frameworks (e.g. Selenium, Appium, RestAssured)</td>\\n<td>Yes</td>\\n<td>N/A</td>\\n<td>N/A</td>\\n<td>N/A</td>\\n</tr>\\n<tr>\\n<td>Cross-browser testing support</td>\\n<td>Yes (via Selenium)</td>\\n<td>Yes</td>\\n<td>Limited (Chrome, Firefox, Edge)</td>\\n<td>Yes (Chromium, Webkit, Firefox)</td>\\n</tr>\\n<tr>\\n<td>Parallel test execution support</td>\\n<td>Yes (via TestNG)</td>\\n<td>Yes (via TestNG or JUnit)</td>\\n<td>Yes</td>\\n<td>Yes</td>\\n</tr>\\n<tr>\\n<td>Language support</td>\\n<td>Java only</td>\\n<td>Multiple languages (Java, Python, C#, Ruby, JavaScript)</td>\\n<td>JavaScript only</td>\\n<td>Multiple languages (JavaScript, Java, Python, .NET C#)</td>\\n</tr>\\n<tr>\\n<td>Open-source</td>\\n<td>Yes</td>\\n<td>Yes</td>\\n<td>Yes</td>\\n<td>Yes</td>\\n</tr>\\n<tr>\\n<td>Community support and resources</td>\\n<td>Limited compared to Selenium WebDriver and Cypress</td>\\n<td>Extensive</td>\\n<td>Extensive</td>\\n<td>Growing</td>\\n</tr>\\n<tr>\\n<td>User guide</td>\\n<td>Available</td>\\n<td>Available</td>\\n<td>Available</td>\\n<td>Available</td>\\n</tr>\\n</tbody></table>\\n\\n\\n**What do you think? Is SHAFT the better option?**"},{"id":"release_announcement_7.1.20230309","metadata":{"permalink":"/blog/release_announcement_7.1.20230309","editUrl":"https://github.com/ShaftHQ/shafthq.github.io/blob/master/blog/2023-03-10-release_announcement.md","source":"@site/blog/2023-03-10-release_announcement.md","title":"New release announcement (7.1.20230309)","description":"Release highlights:","date":"2023-03-10T00:00:00.000Z","tags":[{"inline":true,"label":"shaft_engine","permalink":"/blog/tags/shaft-engine"},{"inline":true,"label":"chrome111","permalink":"/blog/tags/chrome-111"},{"inline":true,"label":"netty","permalink":"/blog/tags/netty"},{"inline":true,"label":"typing","permalink":"/blog/tags/typing"}],"readingTime":2,"hasTruncateMarker":false,"authors":[{"name":"Mohab Mohie","title":"SHAFT_Engine creator","url":"https://github.com/MohabMohie","imageURL":"https://github.com/MohabMohie.png","key":"mohab"}],"frontMatter":{"slug":"release_announcement_7.1.20230309","title":"New release announcement (7.1.20230309)","authors":["mohab"],"tags":["shaft_engine","chrome111","netty","typing"]},"unlisted":false,"prevItem":{"title":"Bing AI framework comparison","permalink":"/blog/bingAI"},"nextItem":{"title":"Dear SHAFT users, we need your support!","permalink":"/blog/we-need-your-support"}},"content":"## Release highlights:\\n- Issue fix for [chrome 111+ netty handler issue](https://github.com/SeleniumHQ/selenium/issues/11750).\\n- Major performance enhancement for the Type element action.\\n\\n## Technical Details:\\n- SHAFT has always boasted top-notch reliability, but this sometimes comes at the cost of performance. In this release we made a major change to the way we handle \\"Type\\" which is one of the most commonly used and also one of the slowest actions.\\n- Previously SHAFT would perform the following Selenium WebDriver calls:\\n  - Get Element Accessible Name (for reporting)\\n  - Get Current Element Text (to learn how this element stores its text and to learn the initial text if any)\\n  - Get Current Element textContent (to learn how this element stores its text and to learn the initial text if any)\\n  - Get Current Element Value (to learn how this element stores its text and to learn the initial text if any)\\n  - Clear (in case the element text wasn\'t empty)\\n  - Send Keys (to do the actual typing)\\n  - Get text using the successful text identification strategy (to validate that the text was typed correctly. if SHAFT ws able to find out which method out of the above three to use it will use it, else it will do all three calls again)\\n- And inside each call, SHAFT would go into a fluent wait where it calls:\\n  - findElement\\n  - findElements\\n- This means that SHAFT did 21+ webdriver calls!\\n- Starting this version SHAFT will cut that number down to just 3 webdriver calls while maintaining the full functionality.\\n- Using [jsoup](https://mvnrepository.com/artifact/org.jsoup/jsoup) SHAFT will capture the entire HTML of the target webelement, and will then be able to uery it for the text/textContent/Value as need to clear and validate successfully typing. \\n- SHAFT will also grab all element information (including the WebElement object) once, and will use the WebElement object directly (which is much faster than finding the element again each time) but if the engine faces a WebDriverException (like StaleElementException) the engine will go into a fluent wait to find and update the element reference.\\n- We tested this major change thoroughly by running around [1700 E2E Test scenarios](https://www.linkedin.com/feed/update/urn:li:activity:7039702182392172544/) across different platforms, so we\'re confident it\'s stable.\\n- In following releases we will rollout this approach to all our element actions, and next on the list we have \\"Click()\\" which is the second most used action per our analysis."},{"id":"we-need-your-support","metadata":{"permalink":"/blog/we-need-your-support","editUrl":"https://github.com/ShaftHQ/shafthq.github.io/blob/master/blog/2023-02-28-we-need-your-support.md","source":"@site/blog/2023-02-28-we-need-your-support.md","title":"Dear SHAFT users, we need your support!","description":"SHAFT is undergoing some major changes in its steering committee and we want to ensure that we align our strategies to what you guys really need!","date":"2023-02-28T00:00:00.000Z","tags":[{"inline":true,"label":"shaft_engine","permalink":"/blog/tags/shaft-engine"},{"inline":true,"label":"community","permalink":"/blog/tags/community"},{"inline":true,"label":"users","permalink":"/blog/tags/users"},{"inline":true,"label":"survey","permalink":"/blog/tags/survey"},{"inline":true,"label":"ecosystem","permalink":"/blog/tags/ecosystem"}],"readingTime":0.705,"hasTruncateMarker":false,"authors":[{"name":"Mohab Mohie","title":"SHAFT_Engine creator","url":"https://github.com/MohabMohie","imageURL":"https://github.com/MohabMohie.png","key":"mohab"}],"frontMatter":{"slug":"we-need-your-support","title":"Dear SHAFT users, we need your support!","authors":["mohab"],"tags":["shaft_engine","community","users","survey","ecosystem"]},"unlisted":false,"prevItem":{"title":"New release announcement (7.1.20230309)","permalink":"/blog/release_announcement_7.1.20230309"},"nextItem":{"title":"New Feature Announcement - Self-managed Appium Execution","permalink":"/blog/self-managed-appium-execution"}},"content":"SHAFT is undergoing some major changes in its steering committee and we want to ensure that we align our strategies to what you guys really need!\\n\\n<b>SHAFT_Engine</b> has always been (and will continue to be) a community driven project, made by Testers for Testers, and our mission was always to add value, remove redundancy, and help Software Engineers in Test focus on the exciting and non-repetitive parts of their work.\\nFor that we need your support to pinpoint and prioritize the features that you\'re using, and the features that you\'d like to see in the near future.\\n\\nJoin us, become an honorary member of the new SHAFT_Engine Technical Leadership Committee by filling out this short survey, and watch your name shine as an honorary member on the dedicated page that we\'ll create on our official user guide!\\n## [Join us now!](https://forms.gle/SWWg629oPY9oPApz8)"},{"id":"self-managed-appium-execution","metadata":{"permalink":"/blog/self-managed-appium-execution","editUrl":"https://github.com/ShaftHQ/shafthq.github.io/blob/master/blog/2023-02-12-self-managed-appium-execution.md","source":"@site/blog/2023-02-12-self-managed-appium-execution.md","title":"New Feature Announcement - Self-managed Appium Execution","description":"A new Major feature approaches!","date":"2023-02-12T00:00:00.000Z","tags":[{"inline":true,"label":"selenium","permalink":"/blog/tags/selenium"},{"inline":true,"label":"appium","permalink":"/blog/tags/appium"},{"inline":true,"label":"shaft_engine","permalink":"/blog/tags/shaft-engine"}],"readingTime":0.675,"hasTruncateMarker":false,"authors":[{"name":"Mohab Mohie","title":"SHAFT_Engine creator","url":"https://github.com/MohabMohie","imageURL":"https://github.com/MohabMohie.png","key":"mohab"}],"frontMatter":{"slug":"self-managed-appium-execution","title":"New Feature Announcement - Self-managed Appium Execution","authors":["mohab"],"tags":["selenium","appium","shaft_engine"]},"unlisted":false,"prevItem":{"title":"Dear SHAFT users, we need your support!","permalink":"/blog/we-need-your-support"},"nextItem":{"title":"Selenium Ecosystem","permalink":"/blog/selenium-ecosystem"}},"content":"A new Major feature approaches!\\n\\n# <b>SHAFT_Engine</b> will now manage its own Appium Execution Environment \ud83c\udf89\ud83c\udf89\\n\\n<a href=\\"https://github.com/ShaftHQ/SHAFT_ENGINE\\" target=\\"_blank\\"><img src=\\"https://raw.githubusercontent.com/ShaftHQ/SHAFT_ENGINE/master/src/main/resources/images/shaft.png\\" alt=\\"Selenium WebDriver\\" height=\\"50px\\"></img></a>    \ud83e\udd1d    <a href=\\"https://appium.github.io/appium/docs/en/2.0/\\" target=\\"_blank\\"><img src=\\"https://appium.github.io/appium/docs/en/2.0/assets/images/appium-logo-horiz.png\\" alt=\\"Appium\\" height=\\"50px\\"></img></a>\\n\\n## What is self-managed appium execution?\\n\\n- One of the common challenges for mobile application test automation is achieving and maintaining a proper testing environment.\\n- A Testing environment consists of several elements; Android SDK CLI tools, Android System Image, Android Emulator, Support for Hardware acceleration, NPM, Appium 2.x server, drivers and plugins.\\n- SHAFT will now download, and setup your testing environment.\\n- SHAFT will also maintain everything in your environment to ensure that it\'s all up-to-date.\\n- SHAFT will then initialize the Emulator, initialize the Appium server, and synchronize everything before starting test execution.\\n\\n## [Watch the demo and explore the code \u2b8a](https://youtu.be/JFuu9qyEgNM)"},{"id":"selenium-ecosystem","metadata":{"permalink":"/blog/selenium-ecosystem","editUrl":"https://github.com/ShaftHQ/shafthq.github.io/blob/master/blog/2023-01-24-selenium-ecosystem.md","source":"@site/blog/2023-01-24-selenium-ecosystem.md","title":"Selenium Ecosystem","description":"We\'re starting off 2023 with a huge announcement!","date":"2023-01-24T00:00:00.000Z","tags":[{"inline":true,"label":"selenium","permalink":"/blog/tags/selenium"},{"inline":true,"label":"ecosystem","permalink":"/blog/tags/ecosystem"},{"inline":true,"label":"shaft_engine","permalink":"/blog/tags/shaft-engine"}],"readingTime":2.355,"hasTruncateMarker":false,"authors":[{"name":"Mohab Mohie","title":"SHAFT_Engine creator","url":"https://github.com/MohabMohie","imageURL":"https://github.com/MohabMohie.png","key":"mohab"}],"frontMatter":{"slug":"selenium-ecosystem","title":"Selenium Ecosystem","authors":["mohab"],"tags":["selenium","ecosystem","shaft_engine"]},"unlisted":false,"prevItem":{"title":"New Feature Announcement - Self-managed Appium Execution","permalink":"/blog/self-managed-appium-execution"},"nextItem":{"title":"Welcome","permalink":"/blog/welcome"}},"content":"We\'re starting off 2023 with a huge announcement!\\n\\n# <b>SHAFT_Engine</b> is now a part of the <a href=\\"https://www.selenium.dev/ecosystem/\\">Selenium Ecosystem!</a> \ud83c\udf89\ud83c\udf89\\n\\n<a href=\\"https://github.com/ShaftHQ/SHAFT_ENGINE\\" target=\\"_blank\\"><img src=\\"https://raw.githubusercontent.com/ShaftHQ/SHAFT_ENGINE/master/src/main/resources/images/shaft.png\\" alt=\\"SHAFT_Engine\\" height=\\"50px\\" /></a>    \ud83e\udd1d   <a href=\\"https://www.selenium.dev/\\" target=\\"_blank\\"><img src=\\"https://www.selenium.dev/images/selenium_4_logo.png\\" alt=\\"Selenium WebDriver\\" height=\\"50px\\" /></a>\\n\\n## What is the Selenium Ecosystem?\\n\\n- Over the last decade, a large ecosystem of Open Source projects have sprouted up around Selenium.\\n- The Selenium Ecosystem attempts to capture some of those projects that make use of Selenium WebDriver as a central part of what they do.\\n- It consists of a number of drivers, bindings, plugins, and frameworks created and maintained by third parties.\\n\\n## What are some other members of the Selenium Ecosystem?\\n\\n- [Google ChromeDriver](https://chromedriver.chromium.org/)\\n- [Microsoft EdgeDriver](https://developer.microsoft.com/en-us/microsoft-edge/tools/webdriver/)\\n- [WebdriverIO](https://github.com/webdriverio/webdriverio)\\n- [Nightwatch.js](https://github.com/nightwatchjs/nightwatch)\\n\\n## Why use a framework that\'s part of the Selenium Ecosystem?\\n\\n- These projects are developed, and maintained by third parties who dedicate their time and efforts to complement the solid infrastructure provided by Selenium WebDriver; the undisputed market leader for test automation since its inception.\\n- They are very mature with many contributors and many users.\\n- They are powered by Selenium WebDriver, which guarantees the widest and most mature user-base versus other competitors.\\n\\n## Why use SHAFT_Engine?\\n\\n- In its seventh year of development now and has accumulated 20 more contributors over the years.\\n- One of the largest open source projects in the MEA region.\\n- Has several tens of thousands downloads, and is being used by [18+ organizations (that we know of)](https://github.com/ShaftHQ/SHAFT_ENGINE#-who-else-is-using-shaft-2) to drive their automation efforts.\\n- Powered by [Selenium, Appium, RestAssured, and other best-in-class automation frameworks](https://github.com/ShaftHQ/SHAFT_ENGINE#-powered-by), SHAFT supports Web/Mobile/API/CLI/DB/Desktop test automation.\\n- Offers excellent business-centric reporting with automated evidences (screenshots, videos, attachments) and logs.\\n- Out-of-the-box simple test data management with secure encryption support.\\n- Supports Local, remote, unattended, sequential, parallel, and containerized test execution.\\n- Built-in test synchronization and error handling.\\n- Built-in third party integrations with Jira, Xray, BrowserStack, and Applitools Eyes.\\n- AI-powered Element Identification, visual checkpoints, and self-healing tests.\\n- Element Locator Builder with full support for Selenium 4 Relative Locators.\\n- Fluent actions and validations library.\\n- And the list goes on...\\n\\n## What does being a member of the Selenium Ecosystem mean for SHAFT_Engine?\\n\\n- It means that SHAFT_Engine is now one of 13 high-level frameworks that are built on top of Selenium WebDriver and have officially joined the ecosystem.\\n- It will gain more visibility and more community support.\\n- And our core maintainers will continue to remain close to the Selenium Technical Leadership committee, ensuring that SHAFT remains ahead of the curve and always aligned to the latest Selenium WebDriver has to offer.\\n\\n\\nIn summary, we thank you for your support over the past 6 years, and we promise to continue to offer you a fully-featured best-in-class reliabie, consistent, secure, and fast Test Automation Solution."},{"id":"welcome","metadata":{"permalink":"/blog/welcome","editUrl":"https://github.com/ShaftHQ/shafthq.github.io/blob/master/blog/2023-01-21-welcome/index.md","source":"@site/blog/2023-01-21-welcome/index.md","title":"Welcome","description":"SHAFT Engine","date":"2023-01-21T00:00:00.000Z","tags":[{"inline":true,"label":"welcome","permalink":"/blog/tags/welcome"},{"inline":true,"label":"hello","permalink":"/blog/tags/hello"},{"inline":true,"label":"docusaurus","permalink":"/blog/tags/docusaurus"},{"inline":true,"label":"shaft_engine","permalink":"/blog/tags/shaft-engine"}],"readingTime":0.245,"hasTruncateMarker":false,"authors":[{"name":"Mohab Mohie","title":"SHAFT_Engine creator","url":"https://github.com/MohabMohie","imageURL":"https://github.com/MohabMohie.png","key":"mohab"}],"frontMatter":{"slug":"welcome","title":"Welcome","authors":["mohab"],"tags":["welcome","hello","docusaurus","shaft_engine"]},"unlisted":false,"prevItem":{"title":"Selenium Ecosystem","permalink":"/blog/selenium-ecosystem"}},"content":"![SHAFT Engine](https://raw.githubusercontent.com/ShaftHQ/SHAFT_ENGINE/master/src/main/resources/images/shaft.png)\\n\\n### Why start a blog?\\nSHAFT_Engine has been long running for over 7 years with thousands of users across hundreds of projects.\\n\\nOur intention is to start using Blog Posts like this one, to communicate for new releases, announcements and other important updates!\\n\\nSo **Stay Tuned** \ud83d\ude09"}]}}')}}]);