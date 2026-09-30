# Features you might have missed

Find useful locator, localization, and report compatibility features.

Canonical HTML: https://shafthq.github.io/docs/features/whats-new/missed
Guide index: https://shafthq.github.io/llms.txt

# Features you might have missed

Use these focused capabilities when exact text, stable locators, or report
tooling need more than the basic path.

 

Build an accessible role locator for durable page-object code:

```java
By login = SHAFT.GUI.Locator.hasRole(Role.BUTTON).hasNormalizedText("Log in").build();
```

## Related

- [Validations](/docs/reference/actions/Validations)
- [What's new since modularization](/docs/features/whats-new)
