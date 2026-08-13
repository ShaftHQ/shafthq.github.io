---
id: modules
title: Features and modules
description: Select core and optional SHAFT modules by capability, then review the technology stack, project support, and funding.
slug: /features/modules
keywords: [SHAFT, features, modules, dependencies, technology, ecosystem, Selenium, Appium, REST Assured, TestNG, JUnit, Cucumber, Allure, support, funding, community]
tags: [features, modules, dependencies, technology, support, funding, community]
---

# Features and modules

The required `shaft-engine` artifact provides the public facade and core test
automation capabilities. Add optional artifacts only when a project uses the
capability they own.

## Published artifact map

| Artifact | Add it when |
|---|---|
| `shaft-engine` | The project needs web, mobile, API, database, CLI actions, test data, accessibility, reporting, or screenshots. |
| `shaft-pilot-core` | An integration needs provider-neutral Pilot contracts and local-agent orchestration. |
| `shaft-capture` | The project records browser/API flows and generates reviewable replay code. |
| `shaft-doctor` | The project analyzes Allure evidence and failure traces offline. |
| `shaft-ai` | Pilot needs optional direct model-provider adapters. |
| `shaft-heal` | Web tests need deterministic, explainable locator recovery. |
| `shaft-mcp` | An MCP client needs SHAFT browser, Capture, Doctor, healer, or guide-search tools. |
| `shaft-cli` | Scripts or CI need repeatable one-shot access to the SHAFT tool catalog. |
| `shaft-browserstack` | Tests need BrowserStack SDK interception, YAML expansion, or SDK orchestration. |
| `shaft-video` | Local non-headless desktop runs need FFmpeg video recording. |
| `shaft-visual` | Tests need OpenCV, Applitools Eyes, Shutterbug, or reference-image behavior. |
| `shaft-ocr` | Tests need local Tesseract recognition, visible-text actions, or OCR assertions. It consumes verified tessdata provisioned by the shared infrastructure module. |
| `shaft-sikulix` | Desktop tests need SikuliX image-based automation. |
| `shaft-bom` | A project uses more than one published SHAFT library and needs aligned versions. |

`shaft-capture-proxy` supports Capture's isolated proxy runtime and is not the
normal consumer entry point. `report-aggregate` builds reactor-wide reports
but is not deployed as a consumer dependency. `legacy-shaft-engine` is a
relocation POM for older coordinates, not a new-project dependency.

## Feature-to-module map

| Feature                                                                                          | Maven artifact       |
|--------------------------------------------------------------------------------------------------|----------------------|
| Web, mobile/Appium/Flutter, API, database, CLI, test data, accessibility, reporting, screenshots | `shaft-engine`       |
| Direct BrowserStack WebDriver/Appium sessions and app upload                                     | `shaft-engine`       |
| BrowserStack SDK interception, multi-platform YAML, and SDK orchestration                        | `shaft-browserstack` |
| Appium Android/iOS driver-native recording                                                       | `shaft-engine`       |
| Local non-headless desktop recording                                                             | `shaft-video`        |
| Reference-image assertions and image-path touch actions                                          | `shaft-visual`       |
| Visible-text actions and OCR assertions                                                          | `shaft-ocr`          |
| SikuliX image-based desktop automation                                                           | `shaft-sikulix`      |
| Deterministic explainable web element recovery                                                    | `shaft-heal`         |
| Screenshot highlighting, animated GIFs, and `compareImageFolders(...)`                           | `shaft-engine`       |

See the [upgrade guide](/docs/start/upgrade) for the exact method
boundaries.

Use the BOM to align the core engine with any optional modules you add:

```xml title="pom.xml"
<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>io.github.shafthq</groupId>
      <artifactId>shaft-bom</artifactId>
      <version>${shaft.version}</version>
      <type>pom</type>
      <scope>import</scope>
    </dependency>
  </dependencies>
</dependencyManagement>

<dependencies>
  <dependency>
    <groupId>io.github.shafthq</groupId>
    <artifactId>shaft-engine</artifactId>
  </dependency>
  <dependency>
    <groupId>io.github.shafthq</groupId>
    <artifactId>shaft-visual</artifactId>
  </dependency>
  <dependency>
    <groupId>io.github.shafthq</groupId>
    <artifactId>shaft-sikulix</artifactId>
  </dependency>
</dependencies>
```

## Smart Features

SHAFT's smart features target the
[Pillars of successful test automation](/docs/features/test-automation-pillars):
Scalability, Reliability, and Maintainability. Use that guide for the
feature-to-pillar map; use this page for artifact and platform selection.

## Supported Platforms

### Browsers

|          | Linux | macOS | Windows | Android | iOS |
|   :---   | :---: | :---: | :---:   | :---: | :---:   |
| Google Chrome  | :white_check_mark: | :white_check_mark: | :white_check_mark: |:white_check_mark: | :white_check_mark: |
| Microsoft Edge  | :white_check_mark: | :white_check_mark: | :white_check_mark: |_ | _ |
| Mozilla Firefox  | :white_check_mark: | :white_check_mark: | :white_check_mark: |_ | _ |
| Apple Safari  | _ | :white_check_mark: | _ | _ | :white_check_mark: |

### Apps

|          | Android | iOS | Windows | 
|   :---   | :---: | :---: | :---:   |
| Native  |:white_check_mark: | :white_check_mark: | N/A | 
| Hybrid  | :white_check_mark: | :white_check_mark: | N/A | 
| Flutter | :white_check_mark: | :white_check_mark: | N/A | 
| WPF  |  N/A | N/A |:white_check_mark: |

### Other

| API | Database | CLI | PDF | JSON | YAML | Excel | Property |
| :---: | :---: | :---:|:---:|:---:|:---:|:---:|:---:|
| :white_check_mark: |:white_check_mark: | :white_check_mark: |:white_check_mark: |:white_check_mark: |:white_check_mark: |:white_check_mark: |:white_check_mark: |

### Test Orchestration

| TestNG | JUnit | Cucumber |
| :---: |:---: |:---: |
| :white_check_mark: |:white_check_mark: |:white_check_mark: |

---

## Underlying technology {/* #technology */}

SHAFT provides one facade over established automation projects while keeping
heavy providers optional:

| Layer | Technology |
|---|---|
| Runtime and build | [Java 25](https://www.oracle.com/java/technologies/downloads/), [Maven](https://maven.apache.org/) |
| Web | [Selenium](https://www.selenium.dev/) |
| Mobile | [Appium](https://appium.io/) |
| API | [REST Assured](https://rest-assured.io/) |
| Test runners | [TestNG](https://testng.org/), [JUnit](https://junit.org/junit/), [Cucumber](https://cucumber.io/) |
| Evidence | [Allure Report](https://allurereport.org/) |
| Optional visual providers | [OpenCV](https://opencv.org/), [Applitools](https://applitools.com/), Selenium Shutterbug |
| Distribution | [Maven Central](https://central.sonatype.com/artifact/io.github.shafthq/shaft-engine), [GitHub Container Registry](https://github.com/ShaftHQ/SHAFT_ENGINE/pkgs/container/shaft-engine-mcp) |

The facade keeps test code on one entry point while the underlying libraries do
the specialized work:

```java
SHAFT.GUI.WebDriver driver = new SHAFT.GUI.WebDriver();

driver.browser().navigateToURL("https://duckduckgo.com");
driver.element().type(By.name("q"), "SHAFT Engine");
driver.assertThat().browser().title().contains("DuckDuckGo");

driver.quit();
```

See [Architecture](/docs/features/architecture) for exact dependency boundaries.

## Project support and adoption {/* #partners */}

### Tooling and open-source program support

SHAFT has received tooling or open-source support from:

- [BrowserStack](https://www.browserstack.com/)
- [LambdaTest](https://www.lambdatest.com/)
- [Applitools](https://applitools.com/)
- [JetBrains Open Source Support](https://jb.gg/OpenSourceSupport)

Engineers responding to anonymous community surveys have reported using SHAFT
within organizations including Vodafone, DXC Technology, Euronet, Solutions by
STC, IDEMIA, GET Group, EFG Holding, Jahez, Incorta, Paymob, GIZA Systems, and
others. These names are community-reported rather than audited customer
endorsements. No organization is represented as guaranteeing or officially
endorsing SHAFT.

### Fund continued maintenance

SHAFT remains free under the MIT License. Financial support helps fund release
maintenance, documentation, and public infrastructure through
[GitHub Sponsors](https://github.com/sponsors/MohabMohie/).

Use your own provider credentials through properties rather than hardcoding
them in tests:

```properties title="src/main/resources/properties/browserStack.properties"
browserStack.userName=${BROWSERSTACK_USERNAME}
browserStack.accessKey=${BROWSERSTACK_ACCESS_KEY}
browserStack.browserstackAutomation=true
```

## Related

- [Architecture](/docs/features/architecture)
- [Upgrade and module selection](/docs/start/upgrade)
- [Visual processing module](/docs/integrations/visual)
- [Desktop and video](/docs/integrations/desktop-and-video)
- [BrowserStack integration](/docs/integrations/browserstack)

