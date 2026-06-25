---
id: Playwright_Backend
title: Playwright Backend
sidebar_label: Playwright Backend
description: "Use SHAFT GUI actions and assertions through the Microsoft Playwright Java backend."
keywords: [SHAFT, Playwright, GUI, browser actions, element actions, assertions, tracing]
tags: [web, Playwright, gui]
---

SHAFT can run GUI tests through Microsoft Playwright while keeping the same
high-level SHAFT browser, element, alert, and assertion entry points.

```java title="PlaywrightTest.java"
import com.shaft.driver.SHAFT;
import org.testng.annotations.*;

public class PlaywrightTest {
    private SHAFT.GUI.Driver driver;

    @BeforeMethod
    public void openBrowser() {
        driver = new SHAFT.GUI.Playwright();
    }

    @Test
    public void search() {
        driver.browser().navigateToURL("https://example.com");
        driver.assertThat().browser().title().contains("Example");
    }

    @AfterMethod(alwaysRun = true)
    public void closeBrowser() {
        driver.quit();
    }
}
```

Use `SHAFT.GUI.WebDriver` for the Selenium/Appium backend and
`SHAFT.GUI.Playwright` for the Playwright backend. Both implement
`SHAFT.GUI.Driver`, so test classes can choose the backend at setup time.

## Configuration

Common browser settings continue to use the existing web properties:

- `targetBrowserName`
- `headlessExecution`
- `baseURL`
- `browserWindowWidth`
- `browserWindowHeight`
- mobile emulation viewport and user-agent settings

Playwright-specific properties use the `playwright.` prefix:

- `playwright.browserName`: optional override for the Playwright browser engine.
- `playwright.deviceName`: optional Playwright device descriptor for the browser context.
- `playwright.connectionMode`: `local`, `connect`, or `connectOverCDP`.
- `playwright.endpoint`: WebSocket or CDP endpoint for remote Playwright sessions.
- `playwright.channel`: optional Chromium channel.
- `playwright.slowMo`: Playwright slow motion in milliseconds.
- `playwright.launchTimeoutMilliseconds`
- `playwright.defaultTimeoutMilliseconds`
- `playwright.navigationTimeoutMilliseconds`
- `playwright.artifactsDirectory`
- `playwright.downloadsDirectory`
- `playwright.acceptDownloads`
- `playwright.tracing.enabled`
- `playwright.tracing.onRetryOnly`
- `playwright.tracing.screenshots`
- `playwright.tracing.snapshots`
- `playwright.tracing.sources`

`playwright.deviceName` accepts names from Microsoft Playwright's device
descriptor registry. SHAFT reads that registry when creating the context and
also provides current-device aliases for `Galaxy S26 Ultra` and
`iPhone 17 Pro Max`. When `playwright.browserName` is empty, SHAFT uses the
descriptor's default browser type; an explicit `playwright.browserName` still
wins.

```properties title="src/main/resources/properties/custom.properties"
targetBrowserName=chrome
headlessExecution=true
baseURL=https://example.com
browserWindowWidth=1280
browserWindowHeight=720

playwright.browserName=chromium
playwright.deviceName=
playwright.connectionMode=local
playwright.endpoint=
playwright.channel=
playwright.slowMo=0
playwright.launchTimeoutMilliseconds=30000
playwright.defaultTimeoutMilliseconds=30000
playwright.navigationTimeoutMilliseconds=30000
playwright.artifactsDirectory=target/playwright-artifacts
playwright.downloadsDirectory=
playwright.acceptDownloads=true
playwright.tracing.enabled=false
playwright.tracing.onRetryOnly=true
playwright.tracing.screenshots=true
playwright.tracing.snapshots=true
playwright.tracing.sources=true
```

The same settings are available programmatically:

```java title="PlaywrightConfig.java"
SHAFT.Properties.playwright.set()
        .browserName("chromium")
        .connectionMode("local")
        .launchTimeoutMilliseconds(30000)
        .defaultTimeoutMilliseconds(30000)
        .navigationTimeoutMilliseconds(30000)
        .artifactsDirectory("target/playwright-artifacts")
        .acceptDownloads(true)
        .tracingOnRetryOnly(true);
```

Remote sessions use `playwright.connectionMode` and `playwright.endpoint`:

```properties title="src/main/resources/properties/custom.properties"
playwright.connectionMode=connect
playwright.endpoint=ws://localhost:3000
```

Tracing is disabled by default. When SHAFT retry evidence capture is enabled,
`playwright.tracing.onRetryOnly=true` enables tracing for the retry attempt and
attaches the resulting Playwright trace zip to the SHAFT report.

## Native Access

```java title="NativePlaywright.java"
SHAFT.GUI.Playwright driver = new SHAFT.GUI.Playwright();

com.microsoft.playwright.Page page = driver.getDriver();
com.microsoft.playwright.BrowserContext context = driver.getNativeContext();
com.microsoft.playwright.Playwright playwright = driver.getPlaywright();
```

Element actions accept SHAFT locators and concrete Playwright actions also
accept native `com.microsoft.playwright.Locator` objects.

```java title="NativeLocator.java"
SHAFT.GUI.Playwright driver = new SHAFT.GUI.Playwright();

var saveButton = driver.getDriver().getByRole(
        com.microsoft.playwright.options.AriaRole.BUTTON,
        new com.microsoft.playwright.Page.GetByRoleOptions().setName("Save"));

driver.element().click(saveButton);
driver.assertThat().element(saveButton).isVisible();
```

The SHAFT locator builder keeps `build()` for Selenium and adds Playwright
support:

```java title="PortableLocator.java"
var shaftLocator = SHAFT.GUI.Locator.hasTagName("button").hasText("Save").buildPortable();
var playwrightLocator = SHAFT.GUI.Locator.hasTagName("button").hasText("Save")
        .buildForPlaywright(driver.getDriver());
```

## Mapping Tree

Legend:

- `Supported`: implemented for Playwright.
- `Native`: available through a native Playwright overload or native context.
- `WebDriver-only`: intentionally remains on Selenium/Appium because the feature
  depends on Selenium, Appium, CDP wrappers, or Lighthouse.

### Driver

| WebDriver entry point | Playwright mapping |
| --- | --- |
| `new SHAFT.GUI.WebDriver()` | `new SHAFT.GUI.Playwright()` |
| `quit()` | Supported; closes page, context, browser, Playwright runtime, and trace |
| `browser()` | Supported: `com.shaft.gui.playwright.browser.BrowserActions` |
| `element()` | Supported: `com.shaft.gui.playwright.element.ElementActions` |
| `alert()` | Supported through Playwright dialog event bridge |
| `assertThat()` / `verifyThat()` | Supported through SHAFT validations |
| `getDriver()` | Supported; returns native `Page` |
| WebDriver native object | `getNativeContext()` returns `BrowserContext`; `getPlaywright()` returns runtime |
| `touch()` | WebDriver-only/Appium-only |
| `async()` | WebDriver-only |
| `act(...)` natural GUI actions | Supported through the trust-gated natural-action planner; Appium touch intents still return an unsupported touch-action reason |

### Browser Actions

| WebDriver browser action | Playwright mapping |
| --- | --- |
| `navigateToURL(url)` | Supported: `Page.navigate` |
| `navigateToURL(url, WindowType)` | Supported: new Playwright page |
| `navigateToURL(url, expectedUrl)` | Supported: navigate then wait for URL |
| `navigateToURLWithBasicAuthentication(...)` | Supported by embedding credentials in URL |
| `navigateBack()` / `navigateForward()` | Supported |
| `refreshCurrentPage()` | Supported |
| `closeCurrentWindow()` | Supported; closes current page |
| `maximizeWindow()` / `setWindowSize(w,h)` / `fullScreenWindow()` | Supported as viewport size |
| `getCurrentURL()` / `getCurrentWindowTitle()` / `getPageSource()` | Supported |
| `getWindowHandle()` / `getWindowHandles()` | Supported as page URL handles |
| `switchToWindow(nameOrHandle)` | Supported by URL, title, or index |
| `getWindowPosition()` | Supported as fixed `0,0` viewport origin |
| `getWindowSize()` / `getWindowWidth()` / `getWindowHeight()` | Supported from viewport |
| `addCookie()` / `getCookie()` / `getAllCookies()` / cookie getters | Supported through `BrowserContext.cookies()` |
| `deleteCookie()` / `deleteAllCookies()` | Supported |
| `captureScreenshot()` / `captureScreenshot(type)` | Supported; attached to SHAFT report |
| `capturePageSnapshot()` / `captureSnapshot()` | Supported as HTML attachment |
| `waitForLazyLoading()` | Supported through Playwright load state |
| `getContext()` / `setContext()` / `getContextHandles()` | Supported for the Playwright page context |
| `mock()` / `intercept()` / `interceptRequest()` / `clearNetworkInterceptors()` | Supported through Playwright `BrowserContext` routing while preserving SHAFT's Selenium HTTP request/response contract |
| `generateLightHouseReport()` | WebDriver-only |
| `accessibility()` | Supported through bundled axe-core injection into the active Playwright page |

### Element Actions

| WebDriver element action | Playwright mapping |
| --- | --- |
| `click()` | Supported |
| `clickUsingJavascript()` | Supported with element JS evaluation |
| `hover()` / `hoverAndClick()` | Supported |
| `doubleClick()` | Supported |
| `clickAndHold()` | Supported with Playwright mouse |
| `dragAndDrop()` / `dragAndDropByOffset()` | Supported |
| `type()` / `typeAppend()` / `typeSecure()` / `clear()` | Supported |
| `typeFileLocationForUpload()` / file drop upload | Supported for input file locators |
| `select()` | Supported |
| `setValueUsingJavaScript()` / `submitFormUsingJavaScript()` | Supported |
| `scrollToElement()` | Supported |
| `captureScreenshot()` | Supported and attached to report |
| `getElementsCount()` | Supported |
| `getTableRowsData()` | Supported |
| `switchToIframe()` / `switchToDefaultContent()` / `getCurrentFrame()` | WebDriver-style frame switching is WebDriver-only; use native Playwright frame locators |
| `executeNativeMobileCommand()` | WebDriver-only/Appium-only |
| Clipboard helpers | WebDriver-only in the first Playwright backend |

### Assertions And Verifications

Playwright-backed browser and element assertions use Playwright's native
auto-waiting assertion engine where available, then report through SHAFT
validations so checkpoints, validation screenshots, and WebDriver-style
validation metadata are preserved.

| WebDriver assertion surface | Playwright mapping |
| --- | --- |
| Driver `assertThat().browser()` / `verifyThat().browser()` | Supported through SHAFT validations |
| Browser `url()` / `title()` / `text()` / `attribute(name)` | Supported |
| Driver `assertThat().element(locator)` / `verifyThat().element(locator)` | Supported for SHAFT locators and native Playwright locators |
| Element `exists()` / `doesNotExist()` | Supported |
| Element `attribute()` / `domAttribute()` / `domProperty()` / `property()` | Supported |
| Element `text()` / `textTrimmed()` / `cssProperty()` | Supported |
| Element state checks: selected, checked, visible, enabled, hidden, disabled | Supported |
| Element visual reference assertions | Supported with `shaft-visual`; captures `Locator.screenshot()` bytes |
| Standalone object/file/number/API assertions | Unchanged |

Playwright visual reference assertions use the same fluent element API:

```java title="PlaywrightVisualAssertion.java"
driver.assertThat().element(By.id("logo")).matchesReferenceImage();
driver.verifyThat().element(By.id("logo"))
      .doesNotMatchReferenceImage(ValidationEnums.VisualValidationEngine.EXACT_OPENCV);
```

The no-argument Playwright overload uses OpenCV because Selenium Shutterbug
requires a WebDriver session. Explicit OpenCV and Applitools Eyes engines compare
the Playwright screenshot bytes through `shaft-visual`; explicit Shutterbug
requests fall back to OpenCV for Playwright.

### Accessibility And Network Parity

Playwright browser actions expose the same network mocking and validation entry
points as WebDriver:

```java title="PlaywrightNetwork.java"
driver.browser()
      .mock(request -> request.getUri().contains("/inventory"), response)
      .and()
      .clearNetworkInterceptors();
```

`interceptRequest()` supports response assertions/verifications through the
existing SHAFT validation callbacks. Routes are scoped to the active Playwright
browser context and can be cleared with `clearNetworkInterceptors()`.

Accessibility scans run axe-core in the active Playwright page and attach the
same SHAFT accessibility artifacts used by WebDriver checks:

```java title="PlaywrightAccessibility.java"
driver.browser()
      .accessibility()
      .setPageName("checkout")
      .assertNoCriticalViolations()
      .backToBrowserContract()
      .captureScreenshot();
```

### Performance Budgets

API performance reports now include p50, p90, p95, and p99 endpoint latency
columns plus a JSON export beside the HTML report. API endpoint budgets use the
normalized endpoint names shown in the report:

```properties title="src/main/resources/properties/custom.properties"
apiEndpointPerformanceBudgets=users=500,orders/{id}=750
failOnApiPerformanceBudgetViolation=true
```

Playwright browser action timings are recorded for browser actions, element
actions, and Playwright-backed validations when performance reporting or browser
budgets are enabled. Page-load timings are recorded for Playwright navigation
and load-state waits.

```properties title="src/main/resources/properties/custom.properties"
browserActionPerformanceBudgets=playwright.element.click=750,playwright.validation.elementVisible=1000
pageLoadPerformanceBudgets=https://example.com/checkout=3000,*=5000
failOnBrowserPerformanceBudgetViolation=false
```

The browser budget report is written as `BrowserPerformanceReport_*.html` and
`BrowserPerformanceReport_*.json` in `PerformanceReportFolderPath`. Budget
metrics use p95. Set the fail flag to `true` when CI should fail on violations;
leave it `false` to report warnings only.

## Related

- [Web testing](/docs/testing/web)
- [Browser Actions](/docs/reference/actions/GUI/Browser_Actions)
- [Element Actions](/docs/reference/actions/GUI/Element_Actions)
- [Element Validations](/docs/reference/actions/GUI/Element_Validations)
- [SHAFT Locator Builder](/docs/reference/actions/GUI/didYouKnow/Shaft_Locator_Builder)
