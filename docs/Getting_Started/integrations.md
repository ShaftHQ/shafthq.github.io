---
id: integrations
title: Integrations
sidebar_label: Integrations
---

## 🔌 SHAFT Integrations

SHAFT seamlessly integrates with popular tools and platforms to enhance your test automation workflow. Below are the integrations currently supported.

---

## Test Management & Reporting

### Jira Integration

Integrate SHAFT with Jira for seamless test case management and bug reporting.

**Key Features:**
- Automatic test case execution reporting
- Bug creation for failed tests
- Link test results to Jira issues
- Execution tracking in Jira

📖 [**View Detailed Jira Integration Guide**](../Keywords/GUI/didYouKnow/Integrate_JIRA_With_SHAFT_Engine)

**Quick Setup:**
```properties
# Enable Jira integration in JIRA.properties
jiraInteraction=true
jiraUrl=https://your-instance.atlassian.net
projectKey=PROJ
authorization=your-api-token
reportTestCasesExecution=true
```

### Xray Integration

Xray is a comprehensive test management tool for Jira that works seamlessly with SHAFT.

**Key Features:**
- Test execution tracking in Xray
- Requirements traceability
- Test coverage metrics
- Integration with CI/CD pipelines

**Setup:**
Xray integration works through SHAFT's Jira integration. Configure Jira properties as shown above, and Xray will automatically track test executions linked to your Xray test cases.

**Best Practices:**
- Use Jira issue keys in your test annotations
- Link test methods to Xray test cases
- Leverage Xray's reporting capabilities

---

## Cloud Testing Platforms

### BrowserStack Integration

Execute your SHAFT tests on BrowserStack's cloud infrastructure with real devices and browsers.

**Key Features:**
- 3000+ real devices and browsers
- Parallel test execution
- Local testing capabilities
- Built-in debugging tools

**Setup:**
```properties
# Add to your custom.properties file
targetPlatform=WEB
executionAddress=https://hub.browserstack.com/wd/hub
browserStack.platformName=Windows 11
browserStack.browserName=Chrome
browserStack.browserVersion=latest
browserStack.user=your_username
browserStack.key=your_access_key
```

**Environment Variables (Recommended):**
```bash
export BROWSERSTACK_USERNAME=your_username
export BROWSERSTACK_ACCESS_KEY=your_access_key
```

📚 [BrowserStack Selenium Documentation](https://www.browserstack.com/docs/automate/selenium)

### LambdaTest Integration

Run your SHAFT tests on LambdaTest's cloud testing platform with 3000+ browsers and OS combinations.

**Key Features:**
- Real device cloud
- Parallel testing
- Geolocation testing
- Screenshot and video recording

**Setup:**
```properties
# Add to your custom.properties file
targetPlatform=WEB
executionAddress=https://hub.lambdatest.com/wd/hub
lambdaTest.platformName=Windows 10
lambdaTest.browserName=Chrome
lambdaTest.browserVersion=latest
lambdaTest.user=your_username
lambdaTest.accessKey=your_access_key
```

**Environment Variables (Recommended):**
```bash
export LAMBDATEST_USERNAME=your_username
export LAMBDATEST_ACCESS_KEY=your_access_key
```

📚 [LambdaTest Selenium Documentation](https://www.lambdatest.com/support/docs/selenium-automation/)

---

## Visual Testing & AI

### OpenCV Integration

SHAFT leverages OpenCV for advanced visual validation and image-based testing.

**Key Features:**
- Visual element detection
- Image comparison
- Template matching
- OCR capabilities

**Usage:**
OpenCV is integrated into SHAFT's visual validation capabilities. Use it for:
```java
// Visual validation example
driver.element().verifyThat(elementLocator)
    .matchesImage("expected-screenshot.png")
    .perform();
```

**Prerequisites:**
- OpenCV libraries are included with SHAFT
- No additional setup required

### ShutterBug Integration

ShutterBug enhances SHAFT's screenshot capabilities with advanced image capture and manipulation.

**Key Features:**
- Full-page screenshots
- Element-specific screenshots
- Screenshot annotation
- Image comparison

**Usage:**
```java
// Capture element screenshot
driver.element().captureScreenshot(elementLocator, "screenshot-name");

// Capture full page
driver.browser().captureFullPageScreenshot();
```

**Integration:**
ShutterBug is automatically integrated into SHAFT's reporting and validation features. Screenshots are automatically attached to Allure reports.

### Healenium Integration

Healenium provides self-healing capabilities for your test automation, automatically adapting to UI changes.

**Key Features:**
- Auto-healing locators
- Reduced test maintenance
- ML-powered element detection
- Integration with Selenium

**Setup:**
```properties
# Enable Healenium in your custom.properties
healenium.enabled=true
healenium.serverUrl=http://localhost:7878
healenium.imitateEnabled=true
healenium.healEnabled=true
```

**Docker Setup:**
```bash
# Start Healenium services
docker-compose up -d
```

📚 [Healenium Documentation](https://healenium.io/docs)

---

## Notifications & Collaboration

### Slack Integration

Send test execution notifications and results to your Slack channels.

**Key Features:**
- Real-time test execution notifications
- Test result summaries
- Failure alerts
- Custom message formatting

**Setup:**

1. Create a Slack App and get a Webhook URL from [Slack API](https://api.slack.com/messaging/webhooks)

2. Configure in your properties:
```properties
# Add to your custom.properties
slack.webhookUrl=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
slack.enabled=true
slack.channel=#test-results
```

3. Use in your tests:
```java
// Send notification to Slack
// Note: The exact API may vary. Check SHAFT documentation for the current method.
// Example usage (verify with SHAFT API docs):
SHAFT.Report.notifySlack("Test execution completed", "All tests passed!");
```

**Best Practices:**
- Use different channels for different test suites
- Include test environment information
- Send summary reports after test runs

### Microsoft Teams Integration

Send test notifications and results to Microsoft Teams channels.

**Key Features:**
- Test execution updates
- Adaptive card formatting
- Rich test result summaries
- Failure notifications with details

**Setup:**

1. Create an Incoming Webhook in your Teams channel
   - Go to your Teams channel → Connectors → Incoming Webhook
   - Copy the webhook URL

2. Configure in your properties:
```properties
# Add to your custom.properties
teams.webhookUrl=https://outlook.office.com/webhook/YOUR_WEBHOOK_URL
teams.enabled=true
teams.channel=Test Automation Results
```

3. Use in your tests:
```java
// Send notification to Microsoft Teams
// Note: The exact API may vary. Check SHAFT documentation for the current method.
// Example usage (verify with SHAFT API docs):
SHAFT.Report.notifyTeams("Test Suite Completed", "Execution Summary: 45/50 Passed");
```

**Message Format:**
Teams integration supports adaptive cards with:
- Test execution status
- Pass/fail statistics
- Failed test details
- Links to full reports

---

## Getting Started with Integrations

To get the most out of SHAFT integrations:

1. **Choose Your Stack**: Select integrations based on your team's existing tools
2. **Configure Properties**: Add integration settings to your `custom.properties` or environment variables
3. **Test Incrementally**: Enable one integration at a time and validate
4. **Monitor & Optimize**: Review integration logs and optimize configuration

### Need Help?

- Visit our [Support & Community](./support) page
- Check the [Properties Guide](../Properties/PropertiesList) for all configuration options
- Join our [Slack community](https://join.slack.com/t/shaft-engine/shared_invite/zt-oii5i2gg-0ZGnih_Y34NjK7QqDn01Dw) for integration tips

---

**Next Steps:** Return to [Getting Started](./first_steps) or explore [Properties Configuration](../Properties/PropertyTypes) to customize your setup.
