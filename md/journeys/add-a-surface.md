# Add a test surface

Add web, API, mobile, Flutter, database, CLI, or contract checks to a project that already runs SHAFT.

Canonical HTML: https://shafthq.github.io/docs/journeys/add-a-surface
Guide index: https://shafthq.github.io/llms.txt

# Add a test surface

For a project that already has a green `mvn test`. Pick one surface, follow that page's sample, and stop when that sample is part of the same run.

| Surface | Page |
|---|---|
| Browser | [Web testing](/docs/testing/web) |
| HTTP API | [API testing](/docs/testing/api) |
| Android, iOS, or mobile web | [Mobile and Flutter testing](/docs/testing/mobile) |
| Flutter locators | [Flutter testing](/docs/testing/flutter) |
| JDBC | [Database testing](/docs/testing/database) |
| Local, Docker, or SSH commands | [CLI testing](/docs/testing/cli) |
| Recorded HTTP or browser contracts | [UI and API contract replay](/docs/testing/contracts) |

Generate the extra surface from [Install SHAFT](/docs/start/installation) when you would rather start a new module than edit the POM by hand. Device and browser installs are [Install local infrastructure](/docs/start/local-infrastructure), after the sample compiles.

```bash
mvn test
```

Why a locator flake happens is background: [How SHAFT reduces flakiness](/docs/testing/flakiness).

## Related

- [Web testing](/docs/testing/web)
