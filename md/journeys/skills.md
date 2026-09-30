# Install SHAFT skills in your agent

Add the SHAFT skill pack to the coding agent you already use, then load shaft-developer.

Canonical HTML: https://shafthq.github.io/docs/journeys/skills
Guide index: https://shafthq.github.io/llms.txt

# Install SHAFT skills in your agent

For a project that already has an agent (Codex, Claude, Copilot, Grok, or another client that reads skill files). The pack is instructions, not a hosted model. The result is a new session that can load `$shaft-developer`.

## Steps

1. From the project root, install skills only. On macOS or Linux:

```bash
curl -fsSL https://raw.githubusercontent.com/ShaftHQ/SHAFT_ENGINE/main/scripts/mcp/install-shaft-agentic-tools.sh | sh -s -- --install-shaft-skills
```

 

2. Start a new agent session in that project.
3. Ask it to load `$shaft-developer`.

The check is that the agent finds the skill. Other install routes (Claude marketplace, Skills CLI, MCP init) are on [Install SHAFT agent skills](/docs/agentic/skills). Use those only if this installer is not the route you want.

If the agent also needs SHAFT tools, continue to [Connect an MCP client](/docs/journeys/mcp) or [Use shaft-cli](/docs/journeys/cli).

## Related

- [Install SHAFT agent skills](/docs/agentic/skills)
