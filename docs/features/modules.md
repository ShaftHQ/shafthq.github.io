---
id: modules
title: Features and modules
description: Select the core engine and optional SHAFT modules by capability.
slug: /features/modules
sidebar_position: 2
tags: [features, modules, dependencies]
---

# Features and modules

The required `shaft-engine` artifact provides the public facade and core test
automation capabilities. Three dependency-heavy integrations are optional.

## Feature-to-module map

| Feature                                                                                          | Maven artifact       |
|--------------------------------------------------------------------------------------------------|----------------------|
| Web, mobile/Appium/Flutter, API, database, CLI, test data, accessibility, reporting, screenshots | `shaft-engine`       |
| Direct BrowserStack WebDriver/Appium sessions and app upload                                     | `shaft-engine`       |
| BrowserStack SDK interception, multi-platform YAML, and SDK orchestration                        | `shaft-browserstack` |
| Appium Android/iOS driver-native recording                                                       | `shaft-engine`       |
| Local non-headless desktop recording                                                             | `shaft-video`        |
| Reference-image assertions and image-path touch actions                                          | `shaft-visual`       |
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

## Related

- [Architecture](/docs/features/architecture)
- [Upgrade and module selection](/docs/start/upgrade)
- [Visual processing module](/docs/integrations/visual)
- [Technology](/docs/features/technology)

