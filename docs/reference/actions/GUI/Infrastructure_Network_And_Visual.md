---
id: Infrastructure_Network_And_Visual
title: "Tips: Infrastructure, Network, and Visual"
sidebar_label: Infrastructure, Network & Visual
description: "SHAFT Engine infrastructure tips — native WebDriver access, custom browser capabilities, mobile emulation, local and Kubernetes Selenium Grid, network mocking, cookies and cached authentication, accessibility testing, Jira integration, and visual testing."
keywords: [SHAFT, native Selenium, custom capabilities, mobile emulation, Selenium Grid, Kubernetes, KEDA, network mocking, DevTools, cookies, storage state, SHAFT.Auth, accessibility testing, axe-core, Jira integration, visual testing, tips]
tags: [web, infrastructure, network, grid, kubernetes, mobile, accessibility, tips]
---

Deeper infrastructure, network, and cross-cutting quality tips for running SHAFT against real execution environments.

## Native Selenium WebDriver access {/* #native-selenium-webdriver */}

Access the native Selenium `WebDriver` instance whenever SHAFT's fluent API doesn't cover a case:

```java title="NativeDriverAccess.java"
SHAFT.GUI.WebDriver driver = new SHAFT.GUI.WebDriver();
WebDriver nativeDriver = driver.getDriver();
nativeDriver.findElement(By.id("lname")).sendKeys("Smith");
```

You can also wrap any existing `org.openqa.selenium.WebDriver` instance with SHAFT capabilities — useful when migrating from plain Selenium incrementally, or when a third-party library hands you a raw driver:

```java title="WrapExistingWebDriver.java"
WebDriver rawDriver = new ChromeDriver();
rawDriver.get("https://example.com");

// Wrap it — all SHAFT fluent actions, smart waits, and reporting now apply
SHAFT.GUI.WebDriver driver = new SHAFT.GUI.WebDriver(rawDriver);
driver.assertThat().browser().title().contains("Example");
```

:::tip
After wrapping, call `driver.quit()` (not `rawDriver.quit()`) so SHAFT's lifecycle hooks run and the Allure report is finalized.
:::

## Custom browser capabilities {/* #custom-capabilities */}

Pass a `MutableCapabilities` or browser-specific options object directly to the `SHAFT.GUI.WebDriver` constructor to configure anything Selenium supports — arguments, experimental options, proxies, extensions:

```java title="CustomCapabilities.java"
import org.openqa.selenium.chrome.ChromeOptions;

ChromeOptions options = new ChromeOptions();
options.addArguments("--disable-extensions", "--disable-notifications", "--no-sandbox");

SHAFT.GUI.WebDriver driver = new SHAFT.GUI.WebDriver(DriverType.CHROME, options);
```

The same pattern applies to `FirefoxOptions` and `EdgeOptions`. Common use cases: a custom download directory (`prefs.put("download.default_directory", ...)`), an HTTP proxy (`options.setProxy(proxy)`), or loading a browser extension (`options.addExtensions(new File(...))`).

:::tip
Prefer [SHAFT Properties](/docs/reference/properties/PropertyTypes) for ordinary browser configuration; reach for custom capabilities only for browser-specific settings that aren't exposed as SHAFT properties. On Selenium Grid or cloud platforms, custom capabilities are merged with the platform-level capabilities from your properties file.
:::

## Mobile emulation {/* #mobile-emulation */}

SHAFT supports **Chrome DevTools mobile emulation** to render a page as it would appear on a real device, without Appium or physical hardware — ideal for responsive-layout checks and quick mobile smoke tests:

```java title="MobileEmulation.java"
SHAFT.Properties.web.set()
     .isMobileEmulation(true)
     .mobileEmulationIsCustomDevice(false)
     .mobileEmulationDeviceName("iPhone 12 Pro");

SHAFT.GUI.WebDriver driver = new SHAFT.GUI.WebDriver();
```

For a device outside Chrome's preset list, or to pin an exact viewport, use custom dimensions instead:

```java title="CustomDeviceEmulation.java"
SHAFT.Properties.web.set()
     .isMobileEmulation(true)
     .mobileEmulationIsCustomDevice(true)
     .mobileEmulationWidth(390)
     .mobileEmulationHeight(844)
     .mobileEmulationPixelRatio(3.0)
     .mobileEmulationUserAgent("Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) ...");
```

:::warning Device-list drift
The browser's built-in device list changes across releases (Chrome 143 removed `"Pixel 5"`, for example), and an unknown device name fails session creation with the opaque `entry 0 of 'firstMatch' is invalid`. SHAFT pins `"Pixel 5"` — its long-standing default — to explicit device metrics so it keeps working on every Chromium browser. If a previously working device name starts failing, switch to custom device emulation with the device's width, height, pixel ratio, and user agent.
:::

## Local Selenium Grid execution {/* #local-selenium-grid */}

Running a local Grid is useful for distributed execution without cloud services, cross-browser/OS testing on one network, and debugging remote-execution issues before deploying to a managed Grid. The fastest path is Docker Compose:

```yaml title="docker-compose.yml"
services:
  selenium-hub:
    image: selenium/hub:latest
    ports: ["4444:4444", "4442:4442", "4443:4443"]
  chrome:
    image: selenium/node-chrome:latest
    shm_size: 2gb
    depends_on: [selenium-hub]
    environment:
      - SE_EVENT_BUS_HOST=selenium-hub
      - SE_EVENT_BUS_PUBLISH_PORT=4442
      - SE_EVENT_BUS_SUBSCRIBE_PORT=4443
```

```bash
docker-compose up -d
# Console: http://localhost:4444
docker-compose up -d --scale chrome=3   # scale a node
docker-compose down
```

Without Docker, run the standalone Selenium Server JAR: `java -jar selenium-server-<version>.jar hub`, then `java -jar selenium-server-<version>.jar node --hub http://localhost:4444` (or `standalone` for both in one process).

Point SHAFT at the Grid:

```properties title="src/main/resources/properties/custom.properties"
executionAddress=localhost:4444
targetOperatingSystem=Linux
targetBrowserName=chrome
headlessExecution=true

# Inspect Grid capacity before creating remote sessions (Selenium Grid 4)
remotePreflightEnabled=true
remoteAdaptiveSessionThrottling=true
```

For Selenium Grid 4, SHAFT can query `/status` and `/graphql` before remote session creation; the preflight summary is attached to the report. Use `remoteAdaptiveSessionThrottling=true` when local TestNG/JUnit parallelism can exceed Grid capacity, and `remotePreflightFailFast=true` when a missing browser slot should fail before WebDriver retries.

## Kubernetes Selenium Grid {/* #kubernetes-selenium-grid */}

For a cloud-native, auto-scaling Grid, deploy on **Kubernetes** with **KEDA** (Kubernetes Event-Driven Autoscaler) — browser nodes scale from zero to capacity on demand and back down when tests finish:

```bash
helm repo add docker-selenium https://www.selenium.dev/docker-selenium
helm repo add kedacore https://kedacore.github.io/charts
helm repo update

helm install keda kedacore/keda --namespace keda --create-namespace

helm install selenium-grid docker-selenium/selenium-grid \
  --set autoscaling.enabled=true \
  --set autoscaling.scaledOptions.minReplicaCount=0 \
  --set autoscaling.scaledOptions.maxReplicaCount=8
```

Point SHAFT at the in-cluster Service DNS name (or port-forward for access from outside the cluster):

```properties title="src/main/resources/properties/custom.properties"
executionAddress=selenium-grid-selenium-hub.default.svc.cluster.local:4444
targetOperatingSystem=Linux
targetBrowserName=chrome
```

```bash
# From outside the cluster
kubectl port-forward svc/selenium-grid-selenium-hub 4444:4444
```

:::tip Best practices
Keep `minReplicaCount=0` to avoid paying for idle browser nodes; set Kubernetes resource requests/limits (browser containers are memory-intensive); use a dedicated namespace; store `values.yaml` in version control; use Kubernetes Secrets for Grid credentials.
:::

## Network mocking and interception {/* #network-mocking */}

`driver.browser().interceptRequest()` matches outgoing browser requests to replace responses with controlled test data, or lets real responses continue and validates them with SHAFT API validations. It relies on Selenium DevTools, so use a DevTools-capable browser (Chrome or Edge).

```java title="NetworkMocking.java"
driver.browser()
        .interceptRequest()
        .get()
        .urlContains("/api/users")
        .queryParam("role", "admin")
        .respond()
        .statusCode(200)
        .jsonBody("{\"users\":[{\"name\":\"Mock User\"}]}");

driver.browser().navigateToURL("https://example.com/dashboard");
```

Use `assertResponse(...)` / `verifyResponse(...)` to validate a **real** response instead of mocking it:

```java title="NetworkValidation.java"
driver.browser()
        .interceptRequest()
        .get()
        .pathEquals("/api/users")
        .assertResponse(response -> response.extractedJsonValue("users.size()").isEqualTo("1"));
```

`routeFromHar()` replays a previously captured HAR 1.2 file as mocked responses (works on both `SHAFT.GUI.WebDriver` and `SHAFT.GUI.Playwright`); a compatible HAR can come from a [Capture](/docs/agentic/capture) session or any HAR 1.2 export. Contract recording/replay (`startContractRecording`, `replayContract`, `assertContract`) shares the same contract mode as `SHAFT.API` — see [UI and API contract replay](/docs/testing/contracts).

Network profiles simulate offline/slow/blocked conditions:

```java title="NetworkProfiles.java"
driver.browser().throttleNetwork(300, 128, 64).and().navigateToURL("https://example.com/reports");
driver.browser().restoreNetwork();
driver.browser().blockNetworkResources("*.png", "*.webp").and().goOffline();
```

:::note
Interception rules are scoped to the current browser session and cleared automatically on `quit()`, or explicitly with `driver.browser().clearNetworkInterceptors()`. If multiple rules match the same request, the latest registered rule wins. When `shaft.trace.includeNetwork=true`, SHAFT also passively records network exchanges into the failure trace bundle (`shaft-network.har`) with secrets masked.
:::

## Using cookies and cached authentication {/* #using-cookies */}

Move authentication state between an API session and a browser session:

```java title="CookieBridging.java"
// API login -> browser session
SHAFT.API api = new SHAFT.API("https://api.example.com");
api.post("/auth/login").setRequestBody(credentials).setContentType(ContentType.JSON);

SHAFT.GUI.WebDriver driver = new SHAFT.GUI.WebDriver();
driver.browser().navigateToURL("https://app.example.com").importCookiesFrom(api);

// Browser login -> API session (the inverse: exportCookiesTo(...))
api.importCookiesFrom(driver.browser());
```

`SHAFT.API` also accepts a storage-state JSON path directly in its constructor — the same file produced by `driver.browser().saveStorageState(path)`:

```java
SHAFT.API api = new SHAFT.API("https://api.example.com", "target/auth-state.json");
```

`SHAFT.Auth.setup(name, flow)` is a Playwright-style cached-authentication helper: it runs a login `flow` once per `name` and caches the resulting browser storage state to disk, so later calls — including from other tests, classes, or threads — reuse the cached session instead of repeating the UI login:

```java title="AuthSetup.java"
// Once per suite, e.g. in a @BeforeSuite:
SHAFT.Auth.setup("standardUser", driver -> {
    driver.browser().navigateToURL("https://example.com/login");
    driver.element().type(By.id("username"), "standard_user");
    driver.element().type(By.id("password"), "secret_sauce");
    driver.element().click(By.id("login-button"));
});

// In every test, reuse the cached session:
SHAFT.Properties.web.set().storageStatePath(SHAFT.Auth.stateFile("standardUser"));
SHAFT.GUI.WebDriver driver = new SHAFT.GUI.WebDriver();
```

The cache is valid as long as its file exists (no TTL) under `SHAFT.Properties.paths.authCache()` (default `target/auth-cache/`). Concurrent `setup()` calls for the *same* `name` are serialized on a per-name lock; calls for different names never block each other. See [Auto-load storage state on driver init](/docs/reference/actions/GUI/Browser_Actions#auto-load-storage-state-on-driver-init).

## Accessibility testing {/* #accessibility-testing */}

SHAFT integrates [axe-core](https://github.com/dequelabs/axe-core) for automated WCAG audits directly within existing WebDriver tests — chain `.accessibility()` onto browser actions, no separate tooling required (add the `com.deque.html.axe-core:selenium` dependency):

```java title="AccessibilityTesting.java"
driver.browser().navigateToURL("https://example.com")
      .accessibility()
      .assertNoCriticalViolations("Home Page");

driver.browser().navigateToURL("https://example.com")
      .accessibility()
      .assertAccessibilityScoreAtLeast("Home Page", 90.0);

driver.browser().navigateToURL("https://example.com")
      .accessibility()
      .analyzeWithIgnoredRules("Home Page", List.of("color-contrast", "image-alt"));
```

| Scenario | Method |
|---|---|
| Strict compliance gate | `assertNoCriticalViolations()` |
| Progressive improvement | `assertAccessibilityScoreAtLeast()` |
| Known accepted deviations | `analyzeWithIgnoredRules()` |

:::tip
Run accessibility audits in CI smoke tests to catch regressions early. Results (page name, score, violation details) are automatically included in the SHAFT Allure report.
:::

## Jira integration {/* #jira-integration */}

SHAFT can automatically create Jira bugs and link test results to Jira issues. Create an [Atlassian API token](https://id.atlassian.com/login) (Account Settings → Security → Create and manage API tokens), then configure `JiraXRay.properties`:

```properties title="src/main/resources/properties/JiraXRay.properties"
jiraInteraction=true
jiraUrl=https://your-jira-instance.atlassian.net
projectKey=PROJ
authorization=your-copied-token
reportTestCasesExecution=true
reportPath=target/surefire-reports/testng-results.xml
ExecutionName=RegressionTestExecution
ReportBugs=true
assignee=jira-user-id
```

## Visual testing {/* #visual-testing */}

Visual regression (`matchesReferenceImage()`, `matchesScreenshot()`, OpenCV/Applitools Eyes engines) has its own dedicated page — see [Visual testing](/docs/integrations/visual) for the full engine comparison, the `shaft-visual` dependency decision, and per-browser/OS baseline naming.

## Related

- [Browser Actions](/docs/reference/actions/GUI/Browser_Actions)
- [Element Actions](/docs/reference/actions/GUI/Element_Actions)
- [Visual testing](/docs/integrations/visual)
- [Properties List](/docs/reference/properties/PropertiesList)
