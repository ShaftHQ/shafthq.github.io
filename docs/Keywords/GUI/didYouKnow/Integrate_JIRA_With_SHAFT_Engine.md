---
id: Integrate_JIRA_With_SHAFT_Engine
title: Integrate JIRA With SHAFT-Engine
sidebar_label: Integrate JIRA With SHAFT-Engine
---

# Integrate JIRA With SHAFT Engine

This guide provides the necessary steps to integrate JIRA with the SHAFT engine by creating an API token and configuring essential properties.

## Steps

1. **Log in** to JIRA via [Atlassian Login](https://id.atlassian.com/login).
2. Click on **Account Settings**.

   ![Account Settings](/img/JIRA/Account_settings.png)

3. Click on the **Security** tab.

   ![Security Tab](/img/JIRA/Security_Tap.png)

4. Click on **Create and manage API tokens**.

5. Click on **Create API token**.

   ![Create and Manage API Tokens](/img/JIRA/Create_API_Token.png)

6. Enter a label for your API token and click **Create**.

   ![Create API Token](/img/JIRA/Label.png)

7. After the token is created, click on **Copy** to copy the token.

   ![Generated Token](/img/JIRA/Generate_Token.png)

8. **Set the Copied Token**: Open your `JIRA.properties` file and set the copied token as the value for the `authorization` property:


## Example Configuration

Below is an example of how to set these properties in your `JIRA.properties` file:

```properties
# Enable interaction with JIRA
jiraInteraction=true

# JIRA instance URL
jiraUrl=https://your-jira-instance.atlassian.net

# JIRA project key
projectKey=PROJ

# Authorization token for JIRA APIs
 authorization=your-copied-token

# Report test cases execution to JIRA
reportTestCasesExecution=true

# Path to test results file
reportPath=target/surefire-reports/testng-results.xml

# Name of the test execution session
ExecutionName=RegressionTestExecution

# Description of the test execution
ExecutionDescription=Automated testing for the latest regression suite.

# Automatically report bugs for failed test cases
ReportBugs=true

# Assignee for JIRA issues
assignee=jira-user-id

# Allure report link patterns
allure.link.tms.pattern=https://your-tms-instance.com/tms/{}
allure.link.custom.pattern=false
