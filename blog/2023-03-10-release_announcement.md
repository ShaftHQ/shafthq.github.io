---
slug: release_announcement_7.1.20230309
title: New release announcement (7.1.20230309)
authors: [mohab]
tags: [shaft_engine, chrome111, netty, typing]
---

# [7.1.20230309](https://github.com/ShaftHQ/SHAFT_ENGINE/releases/tag/7.1.20230309); Our first release after implementing fully automated continuous releases is out!

## Release highlights:
- Issue fix for [chrome 111+ netty handler issue](https://github.com/SeleniumHQ/selenium/issues/11750).
- Major performance enhancement for the Type element action.

## Technical Details:
- SHAFT has always boasted top-notch reliability, but this sometimes comes at the cost of performance. In this release we made a major change to the way we handle "Type" which is one of the most commonly used and also one of the slowest actions.
- Previously SHAFT would perform the following Selenium WebDriver calls:
  - Get Element Accessible Name (for reporting)
  - Get Current Element Text (to learn how this element stores its text and to learn the initial text if any)
  - Get Current Element textContent (to learn how this element stores its text and to learn the initial text if any)
  - Get Current Element Value (to learn how this element stores its text and to learn the initial text if any)
  - Clear (in case the element text wasn't empty)
  - Send Keys (to do the actual typing)
  - Get text using the successful text identification strategy (to validate that the text was typed correctly. if SHAFT ws able to find out which method out of the above three to use it will use it, else it will do all three calls again)
- And inside each call, SHAFT would go into a fluent wait where it calls:
  - findElement
  - findElements
- This means that SHAFT did 21+ webdriver calls!
- Starting this version SHAFT will cut that number down to just 3 webdriver calls while maintaining the full functionality.
- Using [jsoup](https://mvnrepository.com/artifact/org.jsoup/jsoup) SHAFT will capture the entire HTML of the target webelement, and will then be able to uery it for the text/textContent/Value as need to clear and validate successfully typing. 
- SHAFT will also grab all element information (including the WebElement object) once, and will use the WebElement object directly (which is much faster than finding the element again each time) but if the engine faces a WebDriverException (like StaleElementException) the engine will go into a fluent wait to find and update the element reference.
- We tested this major change thoroughly by running around [1700 E2E Test scenarios](https://www.linkedin.com/feed/update/urn:li:activity:7039702182392172544/) across different platforms, so we're confident it's stable.
- In following releases we will rollout this approach to all our element actions, and next on the list we have "Click()" which is the second most used action per our analysis.
