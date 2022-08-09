---
id: XrayFeature
title: Xray Features
sidebar_label: Xray Features
---

### Integration: 

This feature allows us to report our test execution results and buugs. By default SHAFT engine recommend keeping this feature disabled while creating/maintaining the automation scripts to avoid reporting misleading results. Please note that if the integration feature is disabled, the rest of XRay features will be disabled accordingly regardless if they are enabled or disabled. 

You can change this default feature from 2 locations:

* #### Through configuration manager:

By openeing the **_ XRay _** tab on the [Configuration Manager](https://shafthq.github.io/SHAFT_ENGINE/ "Configuration Manager"), you can change the default configuration of **_Integration_** by checking on the radio button on **Enabled** or **Disabled** and then save the file and replace the corresponding config file in your project.


![ConfigurationMnagerIntegration](imgs/Xray/CMIntegratio.jpg)

* #### Through properties files

By openning the **_JiraXRay.properties_** file you can change the value of **_jiraInteraction_** to be **ture** or **false**.

![PropIntegration](imgs/Xray/PropIntegration.jpg)

### Your Jira URL: 

Just we have to type our Jira URL. 

You can type the URL from 2 locations:

* #### Through configuration manager:

By openeing the **_ XRay _** tab on the [Configuration Manager](https://shafthq.github.io/SHAFT_ENGINE/ "Configuration Manager"), you can change the default configuration of **_Your Jira URL_** by typing your Jira URL then save the file and replace the corresponding config file in your project.


![ConfigurationMnagerJiraURL](imgs/Xray/CMYourJiraURL.jpg)

* #### Through properties files

By openning the **_JiraXRay.properties_** file you can type your Jira URL in the key of **_jiraUrl_** 

![PropJiraURL](imgs/Xray/PropYourJiraURL.jpg)


### Project Key: 

Just we have to type our Project Key. 

You can type the Project Key from 2 locations:

* #### Through configuration manager:

By openeing the **_ XRay _** tab on the [Configuration Manager](https://shafthq.github.io/SHAFT_ENGINE/ "Configuration Manager"), you can change the default configuration of **_Project Key_** by typing your Project Key Value then save the file and replace the corresponding config file in your project.


![ConfigurationMnagerProjectKey](imgs/Xray/CMProjectKey.jpg)

* #### Through properties files

By openning the **_JiraXRay.properties_** file you can type your Project Key Value in the key of **_projectKey_** 

![PropProjectKey](imgs/Xray/PropProjectKey.jpg)

### Authorized username: 

Just we have to type the user name of your functional account. 

You can type the authorized username from 2 locations:

* #### Through configuration manager:

By openeing the **_ XRay _** tab on the [Configuration Manager](https://shafthq.github.io/SHAFT_ENGINE/ "Configuration Manager"), you can change the default configuration of **_Authorized username_** by typing your functional account user name then save the file and replace the corresponding config file in your project.


![ConfigurationMnagerAuthorizedusername](imgs/Xray/CMUserName.jpg)

* #### Through properties files

By openning the **_JiraXRay.properties_** file you can type your functional account user name value in the key of **_authorization_** before the colon.

![PropAuthorizedusername](imgs/Xray/PropUserNamePassword.jpg)

### Password/APIToken:

Just we have to type the password of functional account user name. 

You can type the password from 2 locations:

* #### Through configuration manager:

By openeing the **_ XRay _** tab on the [Configuration Manager](https://shafthq.github.io/SHAFT_ENGINE/ "Configuration Manager"), you can change the default configuration of **_Password/APIToken_** by typing the password of your functional account user name then save the file and replace the corresponding config file in your project.


![ConfigurationMnagerPassword/APIToken](imgs/Xray/CMPassword.jpg)

* #### Through properties files

By openning the **_JiraXRay.properties_** file you can type the password of your functional account user name in the key of **_authorization_** after the colon.

![PropPassword/APIToken](imgs/Xray/PropUserNamePassword.jpg)

### Report the testcases execution results: 

This feature allows us to report automatically the results of the test execution. Please note that this feature is not linked to bug reporting, so you can disable one of them and enable the another one. 

You can change this default feature from 2 locations:

* #### Through configuration manager:

By openeing the **_ XRay _** tab on the [Configuration Manager](https://shafthq.github.io/SHAFT_ENGINE/ "Configuration Manager"), you can change the default configuration of **_Report the testcases execution results_** by checking on the radio button on **Enabled** or **Disabled** and then save the file and replace the corresponding config file in your project.

![ConfigurationMnagerReportthetestcasesExecutionResults](imgs/Xray/CMReportTCSExecutionResults.jpg)

* #### Through properties files

By openning the **_JiraXRay.properties_** file you can change the value of **_reportTestCasesExecution_** to be **ture** or **false**.

![PropIReporttheTestcasesExecutionResults](imgs/Xray/PropReportTCSExecutionResults.jpg)


### Results report path: 

This feature allows us to log our reporting results path. 

You can change this default feature from 2 locations:

* #### Through configuration manager:

By openeing the **_ XRay _** tab on the [Configuration Manager](https://shafthq.github.io/SHAFT_ENGINE/ "Configuration Manager"), in **_Results report path_** you can select from the dropdown menu your configured and generated result reporting path and then save the file and replace the corresponding config file in your project.

![ConfigurationMnagerIntegration](imgs/Xray/CMResultReportingPath.jpg)

* #### Through properties files

By openning the **_JiraXRay.properties_** file you can type the path of **_reportPath_**.

![PropIntegration](imgs/Xray/PropreportPath.jpg)

### Execution suite name: 

This is an optional feature that allows us to give a name for you execution suite. Just we have to type the name that you want. 

You can type the authorized username from 2 locations:

* #### Through configuration manager:

By openeing the **_ XRay _** tab on the [Configuration Manager](https://shafthq.github.io/SHAFT_ENGINE/ "Configuration Manager"), you can change the default configuration of **_Execution suite name_** by typing the executions suite name save the file and replace the corresponding config file in your project.


![ConfigurationMnagerExecutionSuiteName](imgs/Xray/CMExecutionSuiteName.jpg)

* #### Through properties files

By openning the **_JiraXRay.properties_** file you can type your test execution name value in the key of **_ExecutionName_** before the colon.

![PropIExecutionSuiteName](imgs/Xray/PropExecutionSuiteName.jpg)

### Execution suite name: 

This is an optional feature that allows us to give a name for you execution suite. Just we have to type the name that you want. 

You can type the authorized username from 2 locations:

* #### Through configuration manager:

By openeing the **_ XRay _** tab on the [Configuration Manager](https://shafthq.github.io/SHAFT_ENGINE/ "Configuration Manager"), you can change the default configuration of **_Execution suite name_** by typing the executions suite name save the file and replace the corresponding config file in your project.


![ConfigurationMnagerExecutionSuiteName](imgs/Xray/CMExecutionSuiteName.jpg)

* #### Through properties files

By openning the **_JiraXRay.properties_** file you can type your test execution name value in the key of **_ExecutionName_** before the colon.

![PropIExecutionSuiteName](imgs/Xray/PropExecutionSuiteName.jpg)

