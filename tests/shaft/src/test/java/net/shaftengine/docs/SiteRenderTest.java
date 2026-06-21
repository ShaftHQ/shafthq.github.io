package net.shaftengine.docs;

import com.shaft.driver.SHAFT;
import org.openqa.selenium.By;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chromium.HasCdp;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import java.time.Duration;
import java.util.List;
import java.util.Map;

public class SiteRenderTest {
    private static final String BASE_URL = System.getProperty("site.baseUrl", "http://127.0.0.1:3000");
    private static final String SAMPLE_POM = """
            <?xml version="1.0" encoding="UTF-8"?>
            <project xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                     xmlns="http://maven.apache.org/POM/4.0.0"
                     xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
                <modelVersion>4.0.0</modelVersion>
                <groupId>io.github.shafthq</groupId>
                <artifactId>shaft-testng-api</artifactId>
                <version>1.0-SNAPSHOT</version>
                <dependencyManagement>
                    <dependencies>
                        <dependency>
                            <groupId>io.github.shafthq</groupId>
                            <artifactId>shaft-bom</artifactId>
                            <version>${shaft.version}</version>
                            <type>pom</type>
                            <scope>import</scope>
                        </dependency>
                    </dependencies>
                </dependencyManagement>
                <dependencies>
                    <dependency>
                        <groupId>io.github.shafthq</groupId>
                        <artifactId>shaft-engine</artifactId>
                    </dependency>
                </dependencies>
                <build></build>
            </project>""";

    private SHAFT.GUI.WebDriver shaft;
    private WebDriver browser;
    private WebDriverWait wait;

    @BeforeMethod(alwaysRun = true)
    public void setup() {
        SHAFT.Properties.web.set()
                .targetBrowserName("CHROME")
                .headlessExecution(true)
                .forceBrowserDownload(true);
        SHAFT.Properties.flags.set()
                .clickUsingJavascriptWhenWebDriverClickFails(true)
                .telemetryEnabled(false);
        shaft = new SHAFT.GUI.WebDriver();
        browser = shaft.getDriver();
        wait = new WebDriverWait(browser, Duration.ofSeconds(15));
        browser.manage().window().setSize(new Dimension(1440, 1000));
    }

    @AfterMethod(alwaysRun = true)
    public void teardown() {
        if (shaft != null) {
            shaft.quit();
        }
        SHAFT.Properties.clearForCurrentThread();
    }

    @DataProvider(name = "primaryRoutes")
    public Object[][] primaryRoutes() {
        return new Object[][]{
                {"/docs/start/overview"},
                {"/docs/start/installation"},
                {"/docs/testing/web"},
                {"/docs/testing/mobile"},
                {"/docs/testing/api"},
                {"/docs/agentic/mcp"},
                {"/docs/agentic/mcp/manual"},
                {"/docs/agentic/doctor"},
                {"/docs/agentic/heal"},
                {"/docs/reference/properties/custom-properties-generator"}
        };
    }

    @DataProvider(name = "overflowRoutes")
    public Object[][] overflowRoutes() {
        return new Object[][]{
                {"/", 1440, 1000},
                {"/", 393, 851},
                {"/docs/agentic/mcp", 1440, 1000},
                {"/docs/agentic/mcp", 393, 851},
                {"/docs/agentic/mcp/manual", 1440, 1000},
                {"/docs/reference/properties/custom-properties-generator", 1440, 1000},
                {"/docs/reference/properties/custom-properties-generator", 393, 851}
        };
    }

    @Test
    public void homepageExposesPrimaryProductPaths() {
        navigate("/");

        shaft.assertThat().browser().title().contains("SHAFT");
        visible(By.xpath("//h1[normalize-space()='One Java engine for web, mobile, API, database, and CLI automation.']"));
        SHAFT.Validations.assertThat().object(attribute(link("Generate a runnable project"), "href"))
                .contains("/docs/start/installation");
        SHAFT.Validations.assertThat().object(attribute(link("Read the minimal web test"), "href"))
                .contains("/docs/testing/web");
        visible(By.xpath("//a[contains(@href,'/docs/testing/mobile') and .//*[normalize-space()='Native mobile GUI'] and .//*[normalize-space()='Appium']]"));
        visible(By.xpath("//a[contains(@href,'/docs/testing/api') and .//*[normalize-space()='API testing'] and .//*[normalize-space()='REST Assured']]"));
        SHAFT.Validations.assertThat().object(attribute(link("Read quick start"), "href"))
                .contains("/docs/start/quick-start");
        SHAFT.Validations.assertThat().object(attribute(link("Connect your AI agent"), "href"))
                .contains("#connect-ai-agent");
        visible(By.cssSelector("#connect-ai-agent"));
        click(linkLocator("Connect your AI agent"));
        wait.until(driver -> "#connect-ai-agent".equals(currentHash()));
        visible(By.cssSelector("img[src='/img/shaft-automation-hero.png']"));
    }

    @Test(dataProvider = "primaryRoutes")
    public void primaryDocsRoutesRender(String route) {
        navigate(route);
        visible(By.cssSelector("main h1"));
    }

    @Test
    public void installationPageEmbedsProjectGenerator() {
        navigate("/docs/start/installation");

        WebElement frame = visible(By.cssSelector("iframe[title='SHAFT Project Generator']"));
        SHAFT.Validations.assertThat().object(attribute(frame, "src")).contains("/project-generator");
        browser.switchTo().frame(frame);
        visible(By.xpath("//h1[normalize-space()='SHAFT Project Generator']"));
        SHAFT.Validations.assertThat().object(button("Next").isEnabled()).isFalse();
        browser.switchTo().defaultContent();
        visible(By.cssSelector("button[aria-label='Open AutoBot Chat']"));
        browser.switchTo().frame(frame);
        SHAFT.Validations.assertThat().object(browser.findElements(By.cssSelector("button[aria-label='Open AutoBot Chat']")).isEmpty()).isTrue();
    }

    @Test
    public void projectGeneratorOpenedDirectlyKeepsAutoBotAvailable() {
        navigate("/project-generator");

        visible(By.xpath("//h1[normalize-space()='SHAFT Project Generator']"));
        visible(By.cssSelector("button[aria-label='Open AutoBot Chat']"));
    }

    @Test
    public void projectGeneratorAddsSelectedOptionalModulesToPom() {
        stubProjectGeneratorSources();
        navigate("/project-generator");

        clickLabel("TestNG");
        click(buttonLocator("Next"));
        clickLabel("Api");
        click(buttonLocator("Next"));
        inputAfterLabel("Group ID").clear();
        inputAfterLabel("Group ID").sendKeys("com.example");
        inputAfterLabel("Version").clear();
        inputAfterLabel("Version").sendKeys("1.2.3");
        click(buttonLocator("Next"));

        visible(By.xpath("//h2[normalize-space()='Optional SHAFT modules']"));
        SHAFT.Validations.assertThat().object(attribute(By.cssSelector("a[aria-label='Learn more about SHAFT Heal']"), "href"))
                .contains("/docs/agentic/heal");
        click(By.cssSelector("#module-shaft-heal"));
        click(buttonLocator("Next"));
        click(checkboxWithLabelLocator("Yes, include GitHub Actions workflow"));
        click(buttonLocator("Next"));
        click(checkboxWithLabelLocator("Yes, include Dependabot configuration"));
        click(buttonLocator("Generate Project"));

        visible(By.xpath("//h2[normalize-space()='Project Generated Successfully']"));
        String pom = script("return window.__generatedFiles['shaft-api-testng/pom.xml'];").toString();
        SHAFT.Validations.assertThat().object(pom).contains("<groupId>com.example</groupId>");
        SHAFT.Validations.assertThat().object(pom).contains("<artifactId>shaft-api-testng</artifactId>");
        SHAFT.Validations.assertThat().object(pom).contains("<version>1.2.3</version>");
        SHAFT.Validations.assertThat().object(pom).contains("<artifactId>shaft-heal</artifactId>");
        SHAFT.Validations.assertThat().object(pom).doesNotContain("<artifactId>shaft-pilot-core</artifactId>");
    }

    @Test
    public void mcpApplicationCommandCanBeCopied() {
        navigate("/docs/agentic/mcp");
        installClipboardShim();

        click(By.cssSelector("button[aria-label='Copy Codex CLI / IDE install command']"));

        wait.until(driver -> clipboardText().contains("codex"));
    }

    @Test
    public void linuxHidesUnsupportedDesktopApplications() {
        overrideNavigatorPlatform("Linux x86_64");
        navigate("/docs/agentic/mcp");

        visible(By.cssSelector("[data-application='codex']"));
        visible(By.cssSelector("[data-application='copilot-intellij']"));
        SHAFT.Validations.assertThat().object(browser.findElements(By.cssSelector("[data-application='claude-desktop']")).isEmpty())
                .isTrue();
    }

    @Test(dataProvider = "overflowRoutes")
    public void pagesHaveNoPageLevelHorizontalOverflow(String route, int width, int height) {
        browser.manage().window().setSize(new Dimension(width, height));
        navigate(route);

        wait.until(driver -> (Boolean) script("return document.documentElement.scrollWidth === document.documentElement.clientWidth;"));
    }

    @Test
    public void propertiesGeneratorCopiesCustomProperties() {
        navigate("/docs/reference/properties/custom-properties-generator");
        installClipboardShim();

        visible(By.xpath("//*[contains(@aria-label,'Generated file destination') and .//*[normalize-space()='src/main/resources/properties/']]"));
        browser.findElement(By.cssSelector("input[placeholder='Property name, section, or description']")).sendKeys("headlessExecution");
        WebElement row = visible(By.cssSelector("[data-property-key='headlessExecution']"));
        click(By.cssSelector("[data-property-key='headlessExecution'] input[type='checkbox']"));
        selectValue(By.cssSelector("[data-property-key='headlessExecution'] select"), "true");

        WebElement output = visible(By.cssSelector("[aria-label='Generated properties files']"));
        wait.until(ExpectedConditions.textToBePresentInElement(output, "headlessExecution=true"));
        click(By.cssSelector("button[aria-label='Download and copy custom.properties']"));
        wait.until(driver -> clipboardText().contains("headlessExecution=true"));
    }

    @Test
    public void propertiesGeneratorGroupsTestNgOutputSeparately() {
        navigate("/docs/reference/properties/custom-properties-generator");

        browser.findElement(By.cssSelector("input[placeholder='Property name, section, or description']")).sendKeys("setParallel");
        WebElement row = visible(By.cssSelector("[data-property-key='setParallel']"));
        SHAFT.Validations.assertThat().object(attribute(row, "data-target-file")).isEqualTo("TestNG.properties");
        click(By.cssSelector("[data-property-key='setParallel'] input[type='checkbox']"));
        selectValue(By.cssSelector("[data-property-key='setParallel'] select"), "METHODS");

        WebElement output = visible(By.cssSelector("[aria-label='Generated properties files']"));
        wait.until(ExpectedConditions.textToBePresentInElement(output, "src/main/resources/properties/TestNG.properties"));
        wait.until(ExpectedConditions.textToBePresentInElement(output, "setParallel=METHODS"));
    }

    @Test
    public void darkModeRemainsReadable() {
        navigate("/");

        List<WebElement> toggles = browser.findElements(By.cssSelector("button[title*='Switch between dark and light mode']"));
        if (!toggles.isEmpty() && toggles.getFirst().isDisplayed()) {
            click(By.cssSelector("button[title*='Switch between dark and light mode']"));
        }
        visible(By.xpath("//h1[normalize-space()='One Java engine for web, mobile, API, database, and CLI automation.']"));
    }

    @Test
    public void releasePageRendersContributorAvatarsWithSmallSize() {
        navigate("/blog/release-10.2.20260501");

        visible(By.xpath("//h1[contains(normalize-space(),'10.2.20260501')]"));
        visible(By.cssSelector("img[alt='@MohabMohie'][width='32'][height='32']"));
    }

    private void navigate(String path) {
        shaft.browser().navigateToURL(BASE_URL + path);
        wait.until(driver -> ((JavascriptExecutor) driver).executeScript("return document.readyState").equals("complete"));
    }

    private WebElement visible(By locator) {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(locator));
    }

    private void click(By locator) {
        shaft.element().click(locator);
    }

    private void selectValue(By locator, String value) {
        shaft.element().select(locator, value);
        WebElement select = visible(locator);
        script("""
                arguments[0].value = arguments[1];
                arguments[0].dispatchEvent(new Event('input', {bubbles: true}));
                arguments[0].dispatchEvent(new Event('change', {bubbles: true}));
                """, select, value);
    }

    private WebElement link(String text) {
        return visible(linkLocator(text));
    }

    private WebElement button(String text) {
        return visible(buttonLocator(text));
    }

    private WebElement inputAfterLabel(String label) {
        return visible(By.xpath("//label[span[normalize-space()='" + label + "']]/input"));
    }

    private By checkboxWithLabelLocator(String label) {
        return By.xpath("//label[span[normalize-space()='" + label + "']]/input[@type='checkbox']");
    }

    private void clickLabel(String label) {
        click(By.xpath("//label[.//span[normalize-space()='" + label + "']]"));
    }

    private By linkLocator(String text) {
        return By.xpath("//a[normalize-space()='" + text + "']");
    }

    private By buttonLocator(String text) {
        return By.xpath("//button[normalize-space()='" + text + "']");
    }

    private String attribute(By locator, String attribute) {
        return attribute(visible(locator), attribute);
    }

    private String attribute(WebElement element, String attribute) {
        return element.getAttribute(attribute);
    }

    private String currentHash() {
        return script("return window.location.hash;").toString();
    }

    private String clipboardText() {
        Object value = script("return window.__clipboard || '';");
        return value == null ? "" : value.toString();
    }

    private Object script(String script, Object... args) {
        return ((JavascriptExecutor) browser).executeScript(script, args);
    }

    private void installClipboardShim() {
        script("""
                window.__clipboard = '';
                Object.defineProperty(navigator, 'clipboard', {
                  configurable: true,
                  value: {
                    writeText: value => {
                      window.__clipboard = value;
                      return Promise.resolve();
                    },
                    readText: () => Promise.resolve(window.__clipboard)
                  }
                });
                """);
    }

    private void overrideNavigatorPlatform(String platform) {
        if (browser instanceof HasCdp cdp) {
            cdp.executeCdpCommand("Page.addScriptToEvaluateOnNewDocument", Map.of(
                    "source",
                    "Object.defineProperty(navigator, 'platform', {get: () => '" + platform + "'});"
            ));
        }
    }

    private void stubProjectGeneratorSources() {
        if (browser instanceof HasCdp cdp) {
            cdp.executeCdpCommand("Page.addScriptToEvaluateOnNewDocument", Map.of(
                    "source",
                    """
                            window.__generatedFiles = {};
                            window.JSZip = class {
                              constructor() { this.files = {}; }
                              file(name, content) {
                                if (content === undefined) return {async: async () => this.files[name]};
                                this.files[name] = content;
                                return this;
                              }
                              async generateAsync() {
                                window.__generatedFiles = this.files;
                                return new Blob([JSON.stringify(this.files)], {type: 'application/json'});
                              }
                            };
                            const samplePom = %s;
                            const responses = new Map([
                              ['https://api.github.com/repos/ShaftHQ/SHAFT_ENGINE/contents/shaft-engine/src/main/resources/examples',
                                {type: 'application/json', body: '[{"type":"dir","name":"TestNG","url":"https://api.github.test/examples/TestNG"}]'}],
                              ['https://api.github.test/examples/TestNG',
                                {type: 'application/json', body: '[{"type":"dir","name":"shaft-testng-api"}]'}],
                              ['https://api.github.com/repos/ShaftHQ/SHAFT_ENGINE/contents/shaft-engine/src/main/resources/examples/TestNG/shaft-testng-api',
                                {type: 'application/json', body: '[{"type":"file","name":"pom.xml","download_url":"https://raw.test/pom.xml"}]'}],
                              ['https://raw.test/pom.xml',
                                {type: 'text/xml', body: samplePom}],
                            ]);
                            const realFetch = window.fetch.bind(window);
                            window.fetch = (input, init) => {
                              const url = typeof input === 'string' ? input : input.url;
                              const match = responses.get(url);
                              if (match) {
                                return Promise.resolve(new Response(match.body, {
                                  status: 200,
                                  headers: {'content-type': match.type}
                                }));
                              }
                              return realFetch(input, init);
                            };
                            """.formatted(jsString(SAMPLE_POM))
            ));
        }
    }

    private String jsString(String value) {
        return "'" + value
                .replace("\\", "\\\\")
                .replace("'", "\\'")
                .replace("\r", "\\r")
                .replace("\n", "\\n") + "'";
    }
}
