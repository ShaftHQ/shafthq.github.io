---
id: integrations
title: Integrations
sidebar_label: Integrations
---

## SHAFT Integrations

SHAFT seamlessly integrates with various tools and services to enhance your test automation experience. This page provides an overview of all supported integrations.

### 📊 Test Management & Issue Tracking

#### Jira Integration
Integrate SHAFT with Atlassian Jira for test management and issue tracking.

**Features:**
- Automatic test execution reporting
- Bug creation for failed tests
- Link test cases to Jira issues
- Sync test results with Jira

**Setup Guide:**
- See detailed [JIRA Integration Guide](/docs/Keywords/GUI/didYouKnow/Integrate_JIRA_With_SHAFT_Engine)

**Configuration:**
```properties
# Enable JIRA integration
jiraInteraction=true
jiraUrl=https://your-instance.atlassian.net
projectKey=PROJ
authorization=your-api-token
reportTestCasesExecution=true
```

**Learn More:**
- [JIRA Properties](/docs/Properties/PropertiesList#jira)

---

#### Xray Integration
Xray is a comprehensive test management tool for Jira that works seamlessly with SHAFT.

**Features:**
- Test case management in Jira
- Test execution tracking
- Requirements traceability
- Real-time test reporting

**Setup:**
Xray integration works through SHAFT's Jira integration. Configure your Jira properties and Xray will automatically pick up test results.

**Configuration:**
```properties
# Xray-specific configurations
jiraInteraction=true
projectKey=YOUR_XRAY_PROJECT
reportTestCasesExecution=true
ExecutionName=Automated Test Execution
```

**Resources:**
- [Xray Documentation](https://docs.getxray.app/)
- [JIRA Properties](/docs/Properties/PropertiesList#jira)

---

### ☁️ Cloud Testing Platforms

#### BrowserStack Integration
Run your tests on BrowserStack's cloud infrastructure with 3000+ real devices and browsers.

**Features:**
- Cross-browser testing on real devices
- Parallel test execution
- Automatic video recording
- Network simulation
- Geolocation testing

**Setup:**
1. Sign up for [BrowserStack Automate](https://www.browserstack.com/automate)
2. Get your username and access key
3. Configure SHAFT properties

**Configuration:**
```properties
# Platform settings
executionAddress=browserstack
targetPlatform=WEB

# BrowserStack credentials
browserStack.username=your_username
browserStack.accessKey=your_access_key

# Browser configuration
browserStack.browserName=Chrome
browserStack.browserVersion=latest
browserStack.osName=Windows
browserStack.osVersion=11

# Optional: Enable video recording
browserStack.video=true
browserStack.networkLogs=true
```

**Learn More:**
- [BrowserStack Properties](/docs/Properties/PropertiesList#browserstack)
- [BrowserStack Capabilities Generator](https://www.browserstack.com/docs/automate/capabilities)

---

#### LambdaTest Integration
Execute tests on LambdaTest's cloud infrastructure with 3000+ browser and OS combinations.

**Features:**
- Real device cloud
- Parallel test execution
- Automated screenshots
- Video recording
- Responsive testing

**Setup:**
1. Sign up for [LambdaTest](https://www.lambdatest.com/)
2. Get your username and access key
3. Configure SHAFT properties

**Configuration:**
```properties
# Platform settings
executionAddress=lambdatest
targetPlatform=WEB

# LambdaTest credentials
LambdaTest.username=your_username
LambdaTest.accessKey=your_access_key

# Browser configuration
LambdaTest.browserName=Chrome
LambdaTest.browserVersion=latest
LambdaTest.platformName=Windows 11

# Optional configurations
LambdaTest.video=true
LambdaTest.visual=true
LambdaTest.network=true
```

**Learn More:**
- [LambdaTest Properties](/docs/Properties/PropertiesList#lambdatest)
- [LambdaTest Capabilities](https://www.lambdatest.com/capabilities-generator/)

---

### 🔍 Visual Testing & AI

#### OpenCV Integration
SHAFT includes built-in OpenCV integration for advanced image recognition and visual validation.

**Features:**
- Image-based element location
- Visual regression testing
- OCR (Optical Character Recognition)
- Pattern matching

**Usage:**
OpenCV is automatically included with SHAFT. No additional setup required!

**Example:**
```java
// Use image-based locators
driver.element().verifyThat(ByImage.image("expected_image.png"))
    .exists()
    .perform();
```

---

#### ShutterBug Integration
Enhanced screenshot capabilities and visual comparison using ShutterBug.

**Features:**
- High-quality screenshots
- Element-level screenshots
- Screenshot comparison
- Automatic highlighting of differences

**Usage:**
ShutterBug is integrated into SHAFT's screenshot functionality.

**Example:**
```java
// Take enhanced screenshots
driver.browser().captureScreenshot();

// Element screenshots
driver.element().captureScreenshot(locator);
```

---

#### Healenium Integration
Self-healing test automation with AI-powered locator healing.

**Features:**
- Automatic locator updates when UI changes
- Reduced test maintenance
- Machine learning-based element detection
- Backup locator strategies

**Setup:**
1. Add Healenium properties to your project
2. SHAFT will automatically use Healenium when enabled

**Configuration:**
```properties
# Enable Healenium
healenium.recovery=true
healenium.serverHost=localhost
healenium.serverPort=7878

# Healing settings
healenium.score=0.5
healenium.healEnabled=true
```

**Learn More:**
- [Healenium Properties](/docs/Properties/PropertiesList#healenium)
- [Healenium GitHub](https://github.com/healenium)

---

### 📢 Notifications & Collaboration

#### Slack Integration
Get real-time notifications about your test executions in Slack.

**Features:**
- Test execution notifications
- Failed test alerts
- Custom Slack messages
- Attach reports and screenshots

**Setup:**
1. Create a Slack App or use an Incoming Webhook
2. Get your webhook URL
3. Use SHAFT's API to send notifications

**Example:**
```java
import com.shaft.driver.SHAFT;

public class SlackNotification {
    public static void sendNotification(String message) {
        SHAFT.API slack = new SHAFT.API("https://hooks.slack.com");
        
        String payload = """
            {
                "text": "%s",
                "channel": "#test-notifications"
            }
            """.formatted(message);
            
        slack.post("/services/YOUR/WEBHOOK/URL")
            .setRequestBody(payload)
            .setContentType("application/json")
            .perform();
    }
}
```

**Integration Ideas:**
- Send summary after test execution
- Alert on failures
- Daily test reports
- Share performance metrics

---

#### Microsoft Teams Integration
Send test notifications and reports to Microsoft Teams channels.

**Features:**
- Test execution notifications
- Adaptive cards for rich formatting
- Failed test alerts
- Integration with Teams workflows

**Setup:**
1. Create an Incoming Webhook in Teams
2. Get your webhook URL
3. Use SHAFT's API to send notifications

**Example:**
```java
import com.shaft.driver.SHAFT;

public class TeamsNotification {
    public static void sendNotification(String title, String message) {
        SHAFT.API teams = new SHAFT.API("https://outlook.office.com");
        
        String payload = """
            {
                "@type": "MessageCard",
                "@context": "http://schema.org/extensions",
                "summary": "Test Execution Report",
                "themeColor": "0078D7",
                "title": "%s",
                "text": "%s"
            }
            """.formatted(title, message);
            
        teams.post("/webhook/YOUR/WEBHOOK/URL")
            .setRequestBody(payload)
            .setContentType("application/json")
            .perform();
    }
}
```

**Integration Ideas:**
- Automated test reports
- CI/CD pipeline notifications
- Test failure alerts
- Daily summaries

---

### 🔧 Other Integrations

SHAFT also works seamlessly with:

- **Jenkins** - CI/CD integration
- **GitHub Actions** - Automated workflows
- **Azure DevOps** - Microsoft's DevOps platform
- **Docker** - Containerized test execution
- **Allure** - Built-in reporting (automatically integrated)
- **Extent Reports** - Built-in reporting (automatically integrated)

---

### 📝 Need Another Integration?

Don't see the integration you need? 

- **Request it**: Open a [GitHub Discussion](https://github.com/ShaftHQ/SHAFT_ENGINE/discussions)
- **Build it**: SHAFT's flexible API makes it easy to integrate with any service
- **Contribute it**: Share your integration with the community

---

**Next Steps:**
- [View Support & Community →](/docs/Getting_Started/support)
- [Explore Properties →](/docs/Properties/PropertyTypes)
- [Check Demos →](/docs/Demos/web)
