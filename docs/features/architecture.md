---
id: architecture
title: Architecture
description: SHAFT runtime, module, facade, and agent integration architecture.
slug: /features/architecture
sidebar_position: 1
tags: [architecture, modules]
---

# Architecture

SHAFT has two kinds of modularity:

1. Maven artifacts control dependency weight.
2. The `SHAFT` facade exposes testing namespaces such as GUI, API, CLI, and DB.

These are related, but they are not one artifact per facade namespace. Most
functionality remains in the required `shaft-engine` JAR.

## Published Maven artifacts

```mermaid
flowchart TB
    Consumer["Consumer project"] --> BOM["shaft-bom<br/>dependency management"]
    Consumer --> Engine["shaft-engine<br/>required runtime"]
    Consumer -.->|optional| PilotCore["shaft-pilot-core<br/>contracts + security"]
    Consumer -.->|optional| Capture["shaft-capture<br/>managed recording + privacy"]
    Consumer -.->|optional| Doctor["shaft-doctor<br/>offline evidence + diagnosis"]
    Consumer -.->|optional| AI["shaft-ai<br/>direct providers"]
    Consumer -.->|optional| Heal["shaft-heal<br/>deterministic element recovery"]
    Consumer -.->|optional| BrowserStack["shaft-browserstack<br/>BrowserStack Java SDK"]
    Consumer -.->|optional| Video["shaft-video<br/>local desktop recording"]
    Consumer -.->|optional| Visual["shaft-visual<br/>OpenCV + Eyes + Shutterbug"]
    Agent -.-> MCP["shaft-mcp<br/>executable MCP server"]

    BrowserStack --> Engine
    Video --> Engine
    Visual --> Engine
    MCP --> Engine
    MCP --> Capture
    MCP --> Doctor
    MCP --> AI
    PilotCore --> Engine
    Capture --> PilotCore
    Doctor --> PilotCore
    AI --> PilotCore
    Heal --> Engine
    Heal --> PilotCore

    Legacy["SHAFT_ENGINE<br/>relocation POM only"] -.->|relocates| Engine

    Engine --> GUI["Web + Appium/Flutter"]
    Engine --> API["REST API"]
    Engine --> Data["DB + CLI + test data"]
    Engine --> Support["validations + reporting<br/>accessibility + properties"]
```

| Artifact             | Packaging      | Consumer purpose                                                                                                         |
|----------------------|----------------|--------------------------------------------------------------------------------------------------------------------------|
| `shaft-engine`       | JAR            | Required facade and core web, mobile, API, database, CLI, reporting, and accessibility implementation.                   |
| `shaft-pilot-core`   | JAR            | Provider-neutral Pilot contracts, consent, redaction, budgets, audit metadata, and deterministic fallback.               |
| `shaft-capture`      | JAR            | Managed Chrome/Edge recording, deterministic privacy classification, versioned schema, and atomic JSON persistence.       |
| `shaft-doctor`       | JAR            | Portable redacted evidence, deterministic diagnosis, optional advisory, and approval-gated isolated repair proposals.       |
| `shaft-ai`           | JAR            | Optional direct OpenAI, Anthropic, Gemini, GitHub Models, and Ollama HTTP adapters discovered through `ServiceLoader`.                  |
| `shaft-heal`         | JAR            | Deterministic, explainable, action-scoped web element recovery with bounded local history and optional reranking.         |
| `shaft-browserstack` | JAR            | BrowserStack SDK interception and `browserstack.yml` orchestration. Direct BrowserStack sessions stay in `shaft-engine`. |
| `shaft-video`        | JAR            | Local non-headless desktop recording. Appium-native recording stays in `shaft-engine`.                                   |
| `shaft-visual`       | JAR            | Reference-image assertions and image-based lookup through OpenCV, Eyes, and Shutterbug.                                  |
| `shaft-mcp`          | thin JAR | Optional MCP server and CLI exposing browser automation, managed capture, Doctor analysis, and packaged direct adapters.  |
| `shaft-bom`          | POM            | Aligns all SHAFT artifact versions; adds no runtime classes.                                                             |
| `SHAFT_ENGINE`       | relocation POM | Temporary legacy-coordinate bridge to `shaft-engine`; adds no optional providers.                                        |

See the [upgrade guide](/docs/start/upgrade) for method-level
dependency boundaries.

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
</dependencies>
```

## Facade architecture

```mermaid
graph TB
    SHAFT["SHAFT facade"]

    subgraph "Testing namespaces in shaft-engine"
        GUI["GUI<br/>Web + Mobile"]
        API["API<br/>REST Assured"]
        CLI["CLI<br/>Terminal + Files"]
        DB["DB<br/>JDBC"]
        TestData["TestData<br/>JSON + Excel + CSV + YAML"]
        Validations["Validations<br/>Fluent assertions"]
        Properties["Properties<br/>Configuration"]
        Report["Report<br/>Logs + Attachments"]
    end

    subgraph "GUI components"
        WebDriver["WebDriver lifecycle"]
        Browser["Browser actions"]
        Element["Element actions"]
        Touch["Touch actions"]
        Alert["Alert actions"]
        Locator["Locator builder"]
    end

    subgraph "Test orchestration"
        TestNG["TestNG"]
        JUnit["JUnit"]
        Cucumber["Cucumber"]
        Allure["Allure"]
    end

    SHAFT --> GUI
    SHAFT --> API
    SHAFT --> CLI
    SHAFT --> DB
    SHAFT --> TestData
    SHAFT --> Validations
    SHAFT --> Properties
    SHAFT --> Report

    GUI --> WebDriver
    WebDriver --> Browser
    WebDriver --> Element
    WebDriver --> Touch
    WebDriver --> Alert
    WebDriver --> Locator

    TestNG -.->|uses| SHAFT
    JUnit -.->|uses| SHAFT
    Cucumber -.->|uses| SHAFT
    SHAFT -.->|reports to| Allure
```

## Optional provider discovery

`shaft-heal`, `shaft-visual`, and `shaft-video` implement SHAFT-owned provider
interfaces and register them through Java `ServiceLoader`. The facade and
orchestration remain in `shaft-engine`, which means users add a provider JAR
without changing test method calls.

`shaft-browserstack` is a runtime integration rather than a SHAFT provider. It
adds `browserstack-java-sdk`; SHAFT's core BrowserStack driver path also
generates `browserstack.yml`, which the SDK consumes when the optional module is
present.

## Module guides

- [Upgrade and module selection](/docs/start/upgrade)
- [SHAFT Heal](/docs/agentic/heal)
- [BrowserStack SDK module](/docs/integrations/browserstack)
- [Visual processing module](/docs/integrations/visual)
- [Desktop video module](/docs/integrations/video)
- [SHAFT Pilot](/docs/agentic/pilot)
- [SHAFT Pilot release runbook](/docs/maintainers/pilot-release)
- [SHAFT MCP](/docs/agentic/mcp)
- [Optional AI providers](/docs/agentic/providers)
- [SHAFT Capture](/docs/agentic/capture)
- [Maven reactor layout](/docs/maintainers/reactor)

---

[Overview](/docs/start/overview) · [Quick start](/docs/start/quick-start)

## Related

- [Modules](/docs/features/modules)
- [Reporting](/docs/features/reporting)
- [Technology](/docs/features/technology)
- [Browserstack](/docs/integrations/browserstack)
