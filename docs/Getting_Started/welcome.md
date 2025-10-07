---
id: welcome
title: Welcome to SHAFT
sidebar_label: Welcome
---

# Welcome to SHAFT! 🚀

Welcome to **SHAFT: The Unified Test Automation Engine**. This guide will help you get started with SHAFT, whether you're building Web, Mobile, or API test automation.

## What is SHAFT?

SHAFT is a comprehensive Java/Maven test automation engine that simplifies and accelerates your test automation efforts.

### Key Highlights

- 🆓 **Open Source & MIT Licensed** - Free to use for any purpose
- 🔧 **Unified Engine** - One framework for Web, Mobile, API, CLI, and Database testing
- 🌟 **Battle-Tested** - Used by organizations worldwide
- 💪 **Built on Standards** - Powered by Selenium, Appium, and RestAssured
- 📚 **Well Documented** - Comprehensive guides and JavaDocs
- 🤝 **Community Driven** - Active Slack community and support

### Why Choose SHAFT?

✅ **No Magic, Full Control** - Everything is 100% configurable with no hidden behaviors  
✅ **Fluent & Readable** - Write tests that read like documentation  
✅ **Built-in Features** - Automatic waiting, retry mechanisms, smart reporting  
✅ **Framework Agnostic** - Works with TestNG, JUnit5, or Cucumber  
✅ **Enterprise Ready** - Integrates with Jira, BrowserStack, LambdaTest, and more

## 🎯 Choose Your Path

Select the type of automation you want to start with:

### 🌐 Web Automation
Automate web browsers across desktop and mobile devices.

**Best for:** Web applications, responsive testing, cross-browser testing

**Choose your test runner:**
- [Setup with TestNG →](/docs/Getting_Started/setup_web_testng)
- [Setup with JUnit5 →](/docs/Getting_Started/setup_web_junit5)
- [Setup with Cucumber →](/docs/Getting_Started/setup_web_cucumber)

---

### 📱 Mobile Automation
Automate native and hybrid mobile apps on Android and iOS.

**Best for:** Mobile applications, native apps, hybrid apps

- [Setup Mobile Project →](/docs/Getting_Started/setup_mobile)

---

### 🔌 API Testing
Test REST APIs, validate responses, and ensure API contracts.

**Best for:** Backend services, microservices, API validation

- [Setup API Project →](/docs/Getting_Started/setup_api)

---

## 📖 Learning Path

Not sure where to start? Follow this recommended sequence:

1. **Learn About SHAFT** *(You are here!)*
2. [**Understand the Philosophy**](/docs/Getting_Started/first_steps) - Why SHAFT exists
3. [**Learn the Basics**](/docs/Getting_Started/first_steps_2) - SHAFT & Selenium relationship
4. [**Review Prerequisites**](/docs/Getting_Started/first_steps_4) - What you need installed
5. **Setup Your Project** - Choose from the paths above
6. [**Get Support**](/docs/Getting_Started/support) - Join the community

## 🚀 Quick Start (Experienced Users)

If you're already familiar with test automation:

```shell
# Using Maven to create a new project
mvn archetype:generate \
  -DarchetypeGroupId=io.github.shafthq \
  -DarchetypeArtifactId=testng-archetype \
  -DarchetypeVersion=LATEST \
  -DgroupId=com.mycompany \
  -DartifactId=my-tests
```

Replace `LATEST` with **[the latest version](https://github.com/ShaftHQ/testng-archetype/releases/latest)**.

## 🎓 Already Using Selenium/Appium?

Upgrading from native Selenium or Appium?
- [**Upgrade Existing Projects**](/docs/Getting_Started/first_steps_6) - Migration guide
- [**SHAFT vs Native Code**](/docs/Getting_Started/first_steps_3) - See the differences

## 🌟 What's Next?

After setup:
- Explore [**Browser Actions**](/docs/Keywords/GUI/Browser_Actions)
- Learn about [**Validations**](/docs/Keywords/Validations/Overview)
- Configure [**Properties**](/docs/Properties/PropertyTypes)
- Check out [**Integrations**](/docs/Getting_Started/integrations)
- Join our [**Community**](/docs/Getting_Started/support)

## 💡 Need Help?

- 💬 [Join our Slack community](/docs/Getting_Started/support)
- 📖 Browse this documentation
- 🐛 [Report issues on GitHub](https://github.com/ShaftHQ/SHAFT_ENGINE/issues)
- 💰 [Support the project](https://github.com/sponsors/MohabMohie/)

---

**Ready to begin?** Choose your automation path above and let's get started! 🎉
