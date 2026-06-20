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

| Area | Reference |
|---|---|
| Browser and element actions | [GUI actions](/docs/reference/actions/GUI/Browser_Actions) |
| REST API | [API request builder](/docs/reference/actions/API/Request_Builder) |
| CLI | [Terminal actions](/docs/reference/actions/CLI/Terminal_Actions) |
| Database | [Database actions](/docs/reference/actions/DB/DB_Actions) |
| Configuration | [Property types](/docs/reference/properties/PropertyTypes) |
| Assertions | [Validation overview](/docs/reference/actions/Validations/Overview) |
| Engineering practices | [Solution design](/docs/reference/guides/Solution_Design) |

Start from the facade namespace for the surface you are testing:

```java
SHAFT.API api = new SHAFT.API("https://jsonplaceholder.typicode.com");

api.get("/todos/1").perform();
api.assertThatResponse().extractedJsonValue("id").isEqualTo("1");
```

## Related

- [Quick start](/docs/start/quick-start)
- [API request builder](/docs/reference/actions/API/Request_Builder)
- [Validation overview](/docs/reference/actions/Validations/Overview)
