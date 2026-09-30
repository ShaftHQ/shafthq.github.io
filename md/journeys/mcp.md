# Connect an MCP client

Install shaft-mcp for Codex, Claude, Copilot, Grok, or another client and complete one tool call.

Canonical HTML: https://shafthq.github.io/docs/journeys/mcp
Guide index: https://shafthq.github.io/llms.txt

# Connect an MCP client

For an MCP client you already run. The result is that client listing SHAFT tools and one call returning. Do this after a project [runs](/docs/journeys/create-a-project) or [upgrades](/docs/journeys/upgrade-a-project). IntelliJ users should use [the plugin path](/docs/journeys/intellij) instead of this page.

## Steps

1. Change into the project directory.
2. Run the installer for your OS. It configures SHAFT agent tools in the current project:

```bash
curl -fsSL "https://raw.githubusercontent.com/ShaftHQ/SHAFT_ENGINE/main/scripts/mcp/install.sh" | bash
```

```powershell
irm "https://raw.githubusercontent.com/ShaftHQ/SHAFT_ENGINE/main/scripts/mcp/install.ps1" | iex
```

3. Restart the agent session so it reloads MCP servers.
4. Ask it to call guide search:

```json
{"tool": "shaft_guide_search", "arguments": {"query": "create a project", "maxResults": 3}}
```

The check is a tool result, not a rewritten test. Client flags and the tool list stay on [Connect shaft-mcp](/docs/agentic/mcp).

## Related

- [Connect shaft-mcp](/docs/agentic/mcp)
