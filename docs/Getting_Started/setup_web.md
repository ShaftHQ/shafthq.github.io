---
id: setup_web
title: Setting Up a Web Project
sidebar_label: Web Projects
---

## 🌐 Web Test Automation with SHAFT

This guide will help you set up a SHAFT project for **Web GUI test automation** using Selenium WebDriver.

---

## What You'll Build

A complete web automation project with:
- Browser automation capabilities (Chrome, Firefox, Edge, Safari)
- Page Object Model structure
- Built-in reporting and screenshots
- Cloud execution support
- Parallel execution ready

---

## Prerequisites

Before you begin, make sure you have:

- ✅ **Java JDK**: Latest LTS version (JDK 17 or higher) - [Download](https://www.oracle.com/java/technologies/downloads/)
- ✅ **IDE**: IntelliJ IDEA (recommended) or Eclipse - [Download IntelliJ](https://www.jetbrains.com/idea/download/)
- ✅ **Maven**: Usually comes with your IDE, or [install separately](https://maven.apache.org/download.cgi)

:::tip[Knowledge Prerequisites]
Familiarity with:
- Java programming basics
- Selenium WebDriver concepts (locators, actions)
- Maven project structure
:::

---

## Choose Your Test Runner

SHAFT supports three popular test runners. Choose the one that best fits your team's needs:

### 🟢 TestNG (Recommended for Most Teams)

**Best for:** Teams that need flexible test configuration, parallel execution, and data-driven testing.

**Pros:**
- Rich annotations and configuration
- Built-in parallel execution
- Excellent reporting capabilities
- Most popular in the industry

[**→ Set up Web project with TestNG**](./setup_web_testng)

---

### 🔵 JUnit 5 (Jupiter)

**Best for:** Teams already using JUnit or preferring modern Java testing features.

**Pros:**
- Modern testing framework
- Great IDE integration
- Supports Java 8+ features
- Active development

[**→ Set up Web project with JUnit 5**](./setup_web_junit5)

---

### 🟣 Cucumber (BDD)

**Best for:** Teams practicing Behavior-Driven Development or needing collaboration between technical and non-technical stakeholders.

**Pros:**
- Natural language test scenarios
- Business-readable tests
- Great for collaboration
- Supports Gherkin syntax

[**→ Set up Web project with Cucumber**](./setup_web_cucumber)

---

## Not Sure Which to Choose?

| Criteria | TestNG | JUnit 5 | Cucumber |
|----------|--------|---------|----------|
| **Ease of Learning** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Parallel Execution** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Configuration Flexibility** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **BDD Support** | ⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Community Support** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

:::info[Our Recommendation]
**Start with TestNG** if you're new to test automation. It offers the best balance of features, flexibility, and community support. You can always switch later if your needs change.
:::

---

## Quick Start Alternative

Not ready to choose? Use our **Interactive Project Generator** to create a web project with a few clicks:

👉 [**Launch Project Generator**](./first_steps_5#option-1-interactive-project-generator-recommended)

---

## What's Next?

After setting up your web project, you'll want to:

1. **Configure Properties** - Customize browser settings, execution mode, etc.
   - [Property Types Guide](../Properties/PropertyTypes)
   - [Properties List](../Properties/PropertiesList)

2. **Explore Integrations** - Connect with cloud platforms, CI/CD, and more
   - [View All Integrations](./integrations)

3. **Learn Core Actions** - Master browser and element actions
   - [Browser Actions](../Keywords/GUI/Browser_Actions)
   - [Element Actions](../Keywords/GUI/Element_Actions)

4. **Get Support** - Join our community
   - [Support & Community](./support)

---

[← Back to Getting Started](./first_steps) | [API Projects →](./setup_api) | [Mobile Projects →](./setup_mobile)
