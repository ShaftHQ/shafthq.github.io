---
title: Platform updates
description: Find modular dependency, upgrade, and project setup changes.
---

# Platform updates

```mermaid
flowchart LR
  Project --> BOM[shaft-bom]
  Legacy --> Upgrade[Automated upgrader]
  New --> Generator[Project Generator]
  Generator --> Properties[Properties Generator]
```

## Catalog

### Modular artifacts and BOM

Published capabilities are split into `shaft-engine` and optional artifacts, with `shaft-bom` aligning their versions.

Why use it: add only the dependencies a project needs while keeping versions aligned.

How to start: import `shaft-bom` in dependency management.

Full docs: [Features and modules](/docs/features/modules)

### Automated upgrade tool

The upgrader moves supported Selenium, Appium, REST Assured, and older SHAFT projects to current APIs and coordinates.

Why use it: make the migration reviewable instead of changing every dependency and call by hand.

How to start: run the documented command from the project root.

Full docs: [Automated upgrade tool](/docs/start/upgrade)

### Project Generator

The Project Generator creates a ready-to-run Maven project after you choose the runner and test surfaces.

Why use it: begin from a configured sample instead of assembling a POM manually.

How to start: open the generator from the installation guide.

Full docs: [Project Generator](/docs/start/installation)

![Desktop Project Generator view with its project setup choices.](/img/whats-new/setup-wizard-desktop.png)

![Mobile Project Generator view with its project setup choices.](/img/whats-new/setup-wizard-mobile.png)

### Properties Generator

The Properties Generator helps create a custom properties file from the supported configuration catalog.

Why use it: make configuration choices visible and copy a focused file into the project.

How to start: open the generator and select only the properties you need.

Full docs: [Properties Generator](/docs/reference/properties/custom-properties-generator)

![Desktop Properties Generator view listing selectable SHAFT properties.](/img/whats-new/properties-generator-desktop.png)

![Mobile Properties Generator view listing selectable SHAFT properties.](/img/whats-new/properties-generator-mobile.png)

```bash
mvn test
```

## Related

- [What's new since modularization](/docs/features/whats-new)
- [Installation](/docs/start/installation)
