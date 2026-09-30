# Create a project and run the sample

Generate a Maven project, run its sample test, and open the report.

Canonical HTML: https://shafthq.github.io/docs/journeys/create-a-project
Guide index: https://shafthq.github.io/llms.txt

# Create a project and run the sample

For a new repository. The result is a Maven project whose sample test has run and written a report. You need the JDK and Maven version named on [Install SHAFT](/docs/start/installation).

## Steps

1. Open [Install SHAFT](/docs/start/installation) and use the project generator. Pick the test runner and surfaces. Download the project.
2. From the project root, run:

```bash
mvn test
```

 

3. Confirm the sample ran (the Maven summary is not `Total: 0`) and evidence is at .

## If the sample does not run

Stay on [Install SHAFT](/docs/start/installation). That page owns the Java, Maven, browser, and Surefire checks. Do not hand-write a POM until that page says generation is impossible.

Next, if you need a pipeline: [Run the suite in CI](/docs/journeys/ci).

How the generator chooses modules is background, not part of this path: [Features and modules](/docs/features/modules).

## Related

- [Install SHAFT](/docs/start/installation)
