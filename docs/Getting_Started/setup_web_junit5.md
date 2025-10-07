---
id: setup_web_junit5
title: Setup Web Project with JUnit5
sidebar_label: Web + JUnit5
---

## Setting up a Web Automation Project with JUnit5

This guide walks you through setting up a new SHAFT project for Web automation using JUnit5 as your test runner.

### Using IntelliJ IDEA (Recommended)

1. Open IntelliJ IDEA and select **New Project**
2. Select **Maven Archetype** from the left panel
3. Click **Add Archetype** and enter these details:
   ```text
   GroupId: io.github.shafthq
   ArtifactId: junit5-archetype
   Version: (use the latest version from releases)
   ```
   :::info[**Latest Version**]
   Check **[the latest SHAFT_Engine: JUnit5 Archetype version](https://github.com/ShaftHQ/junit5-archetype/releases/latest)** and use that version number.
   :::

4. Select the archetype you just added and click **Next**
5. Enter your project details:
   - **GroupId**: Your organization/group ID (e.g., `com.mycompany`)
   - **ArtifactId**: Your project name (e.g., `web-automation-tests`)
6. Click **Create**

### Using Command Line

1. Ensure Maven is installed and added to your PATH
2. Open a terminal in your desired project directory
3. Run this command:
   ```shell
   mvn archetype:generate "-DarchetypeGroupId=io.github.shafthq" "-DarchetypeArtifactId=junit5-archetype" "-DarchetypeVersion=LATEST_VERSION" "-DinteractiveMode=false" "-DgroupId=com.mycompany" "-DartifactId=web-automation-tests"
   ```
   :::info[**Customize**]
   - Replace `LATEST_VERSION` with **[the latest SHAFT_Engine: JUnit5 Archetype version](https://github.com/ShaftHQ/junit5-archetype/releases/latest)**
   - Replace `com.mycompany` and `web-automation-tests` with your desired values
   :::

### Project Structure

Your new project will include:
- Sample Web test cases using JUnit5
- Pre-configured JUnit5 test suites
- SHAFT properties configuration
- Page Object Model examples
- Sample test data files

### Essential Properties for Web Testing

Create or update `src/main/resources/properties/custom.properties`:

```properties
# Target platform
targetPlatform=WEB

# Browser configuration
web.browserName=CHROME
web.headlessExecution=false

# Timeouts
defaultElementIdentificationTimeout=10
defaultBrowserNavigationTimeout=30
```

### Your First Web Test

The archetype includes sample tests. Run them to verify your setup:

```shell
mvn test
```

Or run from IntelliJ IDEA by right-clicking on the test class and selecting **Run**.

### Next Steps

- Explore the sample tests in `src/test/java`
- Review the Page Object Model examples
- Check out the [Browser Actions](/docs/Keywords/GUI/Browser_Actions) documentation
- Learn about [Element Actions](/docs/Keywords/GUI/Element_Actions)

---

**Ready for the next step?** 
- [Setup Mobile Project →](/docs/Getting_Started/setup_mobile)
- [Setup API Project →](/docs/Getting_Started/setup_api)
- [Back to Prerequisites ←](/docs/Getting_Started/first_steps_4)
