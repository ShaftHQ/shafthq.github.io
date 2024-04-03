---
id: first_steps_5
title: Getting Started
sidebar_label: Getting Started
---
- Now that you're hooked, it's time to follow our [Quick Start Guide] to upgrade your existing projects and start using SHAFT.
- But the fastest way to set up a quick sandbox and start experiencing SHAFT is this one:
1. [Download the latest version of mvn](https://maven.apache.org/download.cgi)
2. [Add it to your PATH variable](https://maven.apache.org/install.html)
3. Create a new directory for the project, and navigate to it.
4. Open a Terminal window in the target directory and execute the below command.
```shell title="Generate a new SHAFT project"
mvn archetype:generate "-DarchetypeGroupId=io.github.shafthq" "-DarchetypeArtifactId=testng-archetype" "-DarchetypeVersion=${archetype.version}" "-DinteractiveMode=false" "-DgroupId=io.github.shafthq" "-DartifactId=using_SHAFT_Engine"
```
:::info
**_NOTE 1:_** Replace `${archetype.version}` with [the latest SHAFT_Engine: TestNG Archetype version](https://github.com/ShaftHQ/testng-archetype/releases/latest).
<br/>**_NOTE 2:_** Customize `"-DgroupId=io.github.shafthq"` and `"-DartifactId=using_SHAFT_Engine"` with the groupId and artifactId that you want to use for the new project.
:::

[Quick Start Guide]: <https://github.com/shafthq/SHAFT_ENGINE?tab=readme-ov-file#-quick-start-guide>