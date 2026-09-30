# Choose a path

Pick the one job you came to do. Each path ends when that job works.

Canonical HTML: https://shafthq.github.io/docs/journeys
Guide index: https://shafthq.github.io/llms.txt

# Choose a path

SHAFT is a Java test framework (`io.github.shafthq:shaft-engine`). This guide is a set of jobs. Open the one that matches what you have today. Pages that explain how SHAFT works stay on the site for search and for agents, and they are not in this list.

| You are | Path | Done when |
|---|---|---|
| Starting from nothing | [Create a project and run the sample](/docs/journeys/create-a-project) | The sample test runs and the report is on disk |
| Already have a Maven test project | [Upgrade a Java project](/docs/journeys/upgrade-a-project) | The project compiles on current SHAFT and one test runs |
| Already have a coding agent | [Install SHAFT skills](/docs/journeys/skills) | A new agent session loads `$shaft-developer` |
| Working in IntelliJ IDEA | [Use the IntelliJ plugin](/docs/journeys/intellij) | **Tools \| SHAFT \| Open SHAFT** opens and setup verifies |
| Using Codex, Copilot, Claude, or another MCP client | [Connect an MCP client](/docs/journeys/mcp) | The client lists SHAFT tools and one tool call returns |
| Staying in the terminal | [Use shaft-cli](/docs/journeys/cli) | `shaft-cli` runs one command |
| Putting the suite on a server | [Run the suite in CI](/docs/journeys/ci) | The pipeline runs the suite headlessly and keeps the report |
| Already running SHAFT, need another kind of test | [Add a test surface](/docs/journeys/add-a-surface) | One new web, API, mobile, Flutter, database, CLI, or contract check runs |
| Missing Android, Appium, Grid, or browsers | [Install local infrastructure](/docs/start/local-infrastructure) | `shaft-cli setup verify` passes for the profile you chose |
| Want the project-local agent harness | [Install ChaosEngine](/docs/agentic/chaos-engine) | The installer prints a successful JSON result |

```bash
mvn test
```

That command is the check for a generated or upgraded project. Other paths name their own check on the page.

## Related

- [Create a project and run the sample](/docs/journeys/create-a-project)
