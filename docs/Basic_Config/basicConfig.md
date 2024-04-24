---
id: basicConfig
title: Basic configuration for Web GUI
sidebar_label: Web GUI
---

- To get you started, SHAFT will auto-generate some default properties for your first test run.
- Here are some basic properties you should think about including in your `custom.properties` file:
```properties showLineNumbers title="src/main/resources/properties/custom.properties"
# you may want to configure your base url to enable your scripts to run against different environments
baseURL=http://www.mytestdomain.com

# this is how you can change the target browser for your tests to `CHROME`, `FIREFOX`, `SAFARI`
# or `MICROSOFTEDGE`
targetBrowserName=FIREFOX

# you can use this flag to run in headless mode, which is faster and frees your computer screen
# for use
headlessExecution=true

# you can use one of these flags to generate extra visuals (gif / video) in your allure report
createAnimatedGif=true
videoParams_recordVideo=true

# configuring your proxy settings is essential if you are sitting behind a corporate proxy server,
# no need to include this property if you're not
com.SHAFT.proxySettings=host:port

# you can configure SHAFT to automatically retry failed tests by setting this property
retryMaximumNumberOfAttempts=3

# you can disable any of the buil-in forced checks that SHAFT uses to ensure a more reliable
# execution by setting the following properties
forceCheckForElementVisibility=false
forceCheckElementLocatorIsUnique=false
forceCheckTextWasTypedCorrectly=false
forceCheckNavigationWasSuccessful=false
respectBuiltInWaitsInNativeMode=false

# you can enable this commonly used workaround if your element clicks keep failing
# (though it is recommended to tweak your locator)
clickUsingJavascriptWhenWebDriverClickFails=true

# you can also configure the following timeouts (in seconds)
defaultElementIdentificationTimeout=60
browserNavigationTimeout=60		
pageLoadTimeout=60
```
:::tip[**Tip**]
    You can learn more about the different **[property types]** and the **[full list of supported properties]** by visiting the related pages.
:::


[property types]: <../Properties/PropertyTypes>
[full list of supported properties]: <../Properties/PropertiesList>