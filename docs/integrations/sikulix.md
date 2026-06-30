---
id: sikulix
title: SikuliX desktop automation
description: Add optional image-based desktop automation through SikuliX.
slug: /integrations/sikulix
sidebar_position: 4
tags: [sikulix, desktop, image-automation]
---

# SikuliX desktop automation

`io.github.shafthq:shaft-sikulix` adds optional SikuliX image matching for
desktop workflows that cannot be reached through DOM or Appium locators.

## Add the module

```xml
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
        <artifactId>shaft-sikulix</artifactId>
    </dependency>
</dependencies>
```

## Use image actions

```java
new SHAFT.GUI.SikuliX().element()
        .click("src/test/resources/images/save-button.png")
        .type("src/test/resources/images/name-field.png", "SHAFT");
```

Attach actions to an already open application window when the match should be
scoped to that desktop app:

```java
SHAFT.GUI.SikuliX calculator = SHAFT.GUI.SikuliX.getInstance("Calculator");
calculator.element()
        .click("src/test/resources/images/one.png")
        .click("src/test/resources/images/plus.png");
calculator.quit();
```

If `shaft-sikulix` is missing, `SHAFT.GUI.SikuliX` reports the missing optional
dependency and tells you to add it instead of surfacing a generic class loading
error.

Use `shaft-engine` alone for Appium-backed Windows desktop sessions. Add
`shaft-sikulix` only for image matching.

## Related

- [Modules](/docs/features/modules)
- [Mobile and Appium testing](/docs/testing/mobile)
- [Upgrade](/docs/start/upgrade)
