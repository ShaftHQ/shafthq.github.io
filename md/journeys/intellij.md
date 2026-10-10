# Use the IntelliJ plugin

Install the SHAFT plugin, open the tool window, and finish setup.

Canonical HTML: https://shafthq.github.io/docs/journeys/intellij
Guide index: https://shafthq.github.io/llms.txt

# Use the IntelliJ plugin

For IntelliJ IDEA. The result is the SHAFT tool window open and setup verified. An AI agent connection is optional.

## Steps

1. Install the SHAFT plugin from JetBrains Marketplace, or install a ZIP and restart if the IDE asks.
2. Open **Tools | SHAFT | Open SHAFT**. If setup is not finished, the IDE shows one **Set up SHAFT** notification. It opens the tool window. It is not a dialog that blocks the IDE.
3. **This project** shows the JDK, build tool, operating system, and whether an MCP command is already present. Continue.
4. **Prerequisites** lists only a missing JDK, Maven 3.9+, or Git. Tools that are already present stay on one **Ready** line.
5. **Agent** recommends one agent. Other agents stay behind **Use a different agent**. An API key field appears only for an agent that needs one, and the plugin stores that key in Password Safe.
6. **Install and check** copies the installer command and pre-types it in the IDE terminal. Review it and press Enter yourself. The plugin does not run the installer. Press **Check** afterward. **Verified** appears only after that check passes.
7. **First success** finishes setup when you choose **Open the Assistant** or **Record a sample flow**.

**Skip** leaves setup unfinished and does not delete chat or saved keys. People who already verified MCP are not shown the wizard again. A plugin update drops a stale MCP command and keeps a verified install on the main view.

The check is a verified tool window, not a generated test. Recorder, Doctor, and coding-partner actions are documented on [IntelliJ IDEA plugin](/docs/agentic/intellij). Follow one action there after this page is done.

```text
Tools | SHAFT | Open SHAFT
```

## Related

- [IntelliJ IDEA plugin](/docs/agentic/intellij)
