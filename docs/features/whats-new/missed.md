---
title: Features you might have missed
description: Find useful locator, localization, and report compatibility features.
---

import WhatsNewCatalog from '@site/src/components/WhatsNewCatalog';

# Features you might have missed

Use these focused capabilities when exact text, stable locators, or report
tooling need more than the basic path.

<WhatsNewCatalog group="missed" />

Build an accessible role locator for durable page-object code:

```java
By login = SHAFT.GUI.Locator.hasRole(Role.BUTTON).hasNormalizedText("Log in").build();
```

## Related

- [Validations](/docs/reference/actions/Validations)
- [What's new since modularization](/docs/features/whats-new)
