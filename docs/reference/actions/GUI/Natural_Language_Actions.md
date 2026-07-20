---
id: Natural_Language_Actions
title: Natural Language Actions
sidebar_label: Natural Language
description: "Use trust-gated natural-language browser, element, and touch actions through SHAFT Engine."
keywords: [SHAFT, natural language actions, driver act, browser actions, element actions, touch actions, MCP, AI fallback]
tags: [web, mobile, actions, mcp, ai]
---

Natural-language actions let a test express a browser, element, or touch intent
through `SHAFT.GUI.WebDriver.act(...)`. The engine plans the request, validates
the plan against the configured trust threshold, and executes it only when the
plan is trusted enough.

The feature is disabled by default. Enable it only in tests where readable
workflow intent is more valuable than direct locator calls:

```java title="EnableNaturalActions.java"
SHAFT.Properties.naturalActions.set()
    .enabled(true)
    .minimumTrustPercentage(85)
    .planner("deterministic")
    .aiFallbackEnabled(false)
    .allowedActions("browser,element,touch");
```

## Basic usage

```java title="NaturalLogin.java"
String username = "standard_user";
String password = System.getenv("APP_PASSWORD");

driver.act("Login with valid credentials", username, password);
```

`act(...)` returns the same `SHAFT.GUI.WebDriver` instance so it can be used in
fluent flows. Arguments are passed separately from the natural-language intent.
SHAFT logs argument counts and intent metadata, not raw argument values.

## Deterministic planner

The default planner is local and deterministic. It recognizes a small set of
high-signal patterns and maps them to existing SHAFT actions:

| Intent pattern | Action |
| --- | --- |
| `refresh`, `refresh page`, `reload page` | `driver.browser().refreshCurrentPage()` |
| `go back`, `navigate back` | `driver.browser().navigateBack()` |
| `go forward`, `navigate forward` | `driver.browser().navigateForward()` |
| `open ...` or `navigate to ...` with a URL argument | `driver.browser().navigateToURL(url)` |
| `Login with valid credentials` with username and password arguments | types username, types password securely, then clicks login/sign in/submit |
| `click Save` | clicks a semantic clickable element |
| `type into Email` with one argument | types into a semantic input field |
| `clear Search` | clears a semantic input field |
| `tap Continue` | taps a semantic clickable element |

Element and touch plans use SHAFT smart locators under the hood. If no
deterministic pattern matches, the action fails without changing the page.

## Trust gate

Every plan has a trust score. SHAFT executes the action only when the score is
greater than or equal to `naturalActions.minimumTrustPercentage`.

```properties title="src/main/resources/properties/custom.properties"
naturalActions.enabled=true
naturalActions.minimumTrustPercentage=90
naturalActions.planner=deterministic
naturalActions.aiFallback.enabled=false
naturalActions.allowedActions=browser,element,touch
```

Use `allowedActions` to narrow what natural actions may do in a test class. For
example, `allowedActions=browser` allows navigation-style actions but rejects
element and touch actions before execution.

## Optional planner fallback

Set `naturalActions.planner=auto` and
`naturalActions.aiFallback.enabled=true` only when an optional planner should be
allowed after the deterministic planner cannot produce a plan. SHAFT discovers
additional planners through Java `ServiceLoader`; `shaft-pilot-core` provides a
Pilot-backed natural-action planner that is also disabled unless
`pilot.enabled=true`.

Provider-assisted planning is still plan-only. The returned steps must pass the
same local validation, allowed-action filter, and trust threshold before SHAFT
touches the browser.

## MCP usage

`shaft-mcp` previously exposed this behavior through a `natural_act` tool (and
a mobile `mobile_natural_act` counterpart). The [SHAFT tool architecture
sweep](https://github.com/ShaftHQ/SHAFT_ENGINE/issues/3866) deleted both tools
outright, with no deprecation shim: `driver.act(...)` remains a supported Java
API, but MCP clients can no longer trigger natural-language execution through
a dedicated tool call. Enable `naturalActions` in test code as shown above and
drive the browser/mobile session through the deterministic `element_*`/
`browser_*`/`mobile_*` MCP tools instead.

See [Connect shaft-mcp](/docs/agentic/mcp) for transport setup and MCP client
approval guidance.

## Related

- [Browser Actions](/docs/reference/actions/GUI/Browser_Actions)
- [Element Actions](/docs/reference/actions/GUI/Element_Actions)
- [Element Identification](/docs/reference/actions/GUI/Element_Identification)
- [Web](/docs/testing/web)
