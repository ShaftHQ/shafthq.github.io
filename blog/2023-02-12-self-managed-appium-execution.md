---
slug: self-managed-appium-execution
title: New Feature Announcement - Self-managed Appium Execution
authors: [mohab]
tags: [selenium, appium, shaft_engine]
---

A new Major feature approaches!

# <b>SHAFT_Engine</b> will now manage its own Appium Execution Environment 🎉🎉

<a href="https://github.com/ShaftHQ/SHAFT_ENGINE" target="_blank"><img src="https://raw.githubusercontent.com/ShaftHQ/SHAFT_ENGINE/master/src/main/resources/images/shaft.png" alt="Selenium WebDriver" height="50px"></a>    🤝    <a href="https://appium.github.io/appium/docs/en/2.0/" target="_blank"><img src="https://appium.github.io/appium/docs/en/2.0/assets/images/appium-logo-horiz.png" alt="Appium" height="50px"></a>

## What is self-managed appium execution?

- One of the common challenges for mobile application test automation is achieving and maintaining a proper testing environment.
- A Testing environment consists of several elements; Android SDK CLI tools, Android System Image, Android Emulator, Support for Hardware acceleration, NPM, Appium 2.x server, drivers and plugins.
- SHAFT will now download, and setup your testing environment.
- SHAFT will also maintain everything in your environment to ensure that it's all up-to-date.
- SHAFT will then initialize the Emulator, initialize the Appium server, and synchronize everything before starting test execution.

## [Watch the demo and explore the code ⮊](https://youtu.be/JFuu9qyEgNM)

