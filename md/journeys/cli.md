# Use shaft-cli

Install the SHAFT command line without an IDE or MCP client and run one command.

Canonical HTML: https://shafthq.github.io/docs/journeys/cli
Guide index: https://shafthq.github.io/llms.txt

# Use shaft-cli

For a terminal-only workflow. The result is `shaft-cli` on your PATH running one command. No IDE and no MCP client configuration.

## Steps

1. From any directory, install the CLI and its MCP runtime:

```bash
curl -fsSL https://raw.githubusercontent.com/ShaftHQ/SHAFT_ENGINE/main/scripts/mcp/install-shaft-agentic-tools.sh | sh -s -- --install-shaft-cli
```

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -Command "irm https://raw.githubusercontent.com/ShaftHQ/SHAFT_ENGINE/main/scripts/mcp/install-shaft-agentic-tools.ps1 | iex; Install-ShaftMcp -Arguments @('--install-shaft-cli')"
```

2. Open a new terminal and run:

```bash
shaft-cli --help
```

The check is a help listing, not a browser session. Command names and session mode are on [shaft-cli](/docs/agentic/cli). Local Android, Grid, and browser installs continue at [Install local infrastructure](/docs/start/local-infrastructure).

## Related

- [shaft-cli command line](/docs/agentic/cli)
