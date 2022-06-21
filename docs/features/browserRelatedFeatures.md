---
id: browserRelatedFeatures
title: browser Related Features
sidebar_label: browser Related Features
---

### Change browser and headless excution

By default SHAFT engine runs locally on chrome browser using the library "Webdriver Manager" to manage the latest driver installation.
<br />
you can change this default browser from 2 locations:

#### through configuration manager:

By openeing the Platform tab on the [Configuration Manager] you can change the excution browser as explained in the image below and then save the file and replace the corresponding config file in you projects

![configurationMnagerChangeBrowser](imgs/browserFeatures/changeBrowser/configutrationManager.PNG)

#### through properties files

By openning the ExecutionPlatform.properties file you can change the value of 'targetBrowserName' with the value of one of the supported browsers.
<br/>
NOTE : supported browsers of SHAFT engine are => chrome, firefox, edge and safari.

![propChangeBrowser](imgs/browserFeatures/changeBrowser/cahngeProp.PNG)

#### headless excution

Likewise from the same tab or configuration file you can choose weather to enable or disable the headless excution

![configurationMnagerHeadless](imgs/browserFeatures/changeBrowser/configutrationManager.PNG)
![propChangeHeadless](imgs/browserFeatures/changeBrowser/headlessprop.PNG)

### Auto maximize browser window

[configuration manager]: https://mohabmohie.github.io/SHAFT_ENGINE/
