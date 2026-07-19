---
id: overview
title: Reference
description: Detailed SHAFT actions, properties, validations, and practices.
slug: /reference/overview
sidebar_position: 1
tags: [reference]
---

# Reference

Use this section after completing the [quick start](/docs/start/quick-start).
It contains the detailed action, property, validation, reporting, and design
guides.

## I want to...

| Task | Start here |
|---|---|
| Open a browser, click, type, wait, and assert | [Web testing](/docs/testing/web) |
| Choose resilient web locators | [Web locator strategy](/docs/testing/web#locator-strategy) |
| Send REST requests and validate responses | [API testing](/docs/testing/api) |
| Configure browser, API, mobile, retry, or reporting behavior | [Property types](/docs/reference/properties/PropertyTypes) |
| Generate a custom `.properties` file | [Config Generator tab](/docs/reference/properties/PropertiesList?PropertyTypes=generator) on the Properties Reference |
| Attach evidence and understand reports | [Reporting](/docs/reference/reporting/) |
| Diagnose flaky or failed runs | [How SHAFT reduces flakiness](/docs/testing/flakiness) |
| Query a database or run a terminal command | [Database testing](/docs/testing/database) and [CLI testing](/docs/testing/cli) |

## Reference areas

| Area | Reference |
|---|---|
| Browser and element actions | [GUI Actions](/docs/reference/actions/GUI/Browser_Actions) |
| REST API | [API request builder](/docs/reference/actions/API/Request_Builder) |
| CLI | [CLI Actions](/docs/reference/actions/CLI/Terminal_Actions) |
| Database | [Database Actions](/docs/reference/actions/DB/DB_Actions) |
| Configuration | [Property types](/docs/reference/properties/PropertyTypes) |
| Assertions | [Validations](/docs/reference/actions/Validations) |
| Engineering practices | [Solution design](/docs/reference/guides/Solution_Design) |

Start from the facade namespace for the surface you are testing:

```java
SHAFT.API api = new SHAFT.API("https://jsonplaceholder.typicode.com");

api.get("/todos/1");
api.assertThatResponse().extractedJsonValue("id").isEqualTo("1");
```

## Related

- [Quick start](/docs/start/quick-start)
- [API request builder](/docs/reference/actions/API/Request_Builder)
- [Validations](/docs/reference/actions/Validations)
