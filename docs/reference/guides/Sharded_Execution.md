---
id: Sharded_Execution
title: "Sharded Test Execution and Merged Reports"
sidebar_label: Sharded Execution
description: "Split a SHAFT suite across parallel shards with -Dshaft.shard=N/M, then merge every shard's Allure results into one report and speedboard."
keywords: [SHAFT, sharding, shard, parallel execution, merge, Allure, GitHub Actions, CI/CD, ShardMergeCli]
tags: [best-practices, cicd, sharding, parallelization, allure]
---

Large suites take too long to run as one Maven invocation. SHAFT's
`-Dshaft.shard=N/M` property splits a suite into `M` independent shards that
you run in parallel — locally across terminals, or as a CI matrix — then
merges every shard's Allure results back into a single report with
`ShardMergeCli`.

---

## What Sharding Does

Set `-Dshaft.shard=<index>/<total>` on any `mvn test` invocation, where
`<index>` is the 1-based shard this run executes and `<total>` is the shard
count:

```bash title="Run shard 2 of 4"
mvn test "-Dshaft.shard=2/4" -DheadlessExecution=true
```

SHAFT assigns each test method to exactly one shard by hashing
`className#methodName` with SHA-256 and taking the hash modulo the shard
count. The assignment is deterministic and content-based, not order-based:

- The same method always lands in the same shard for a given `<total>`,
  across machines and runs.
- The union of shards `1..M` covers the full suite with no overlap and no
  duplication.
- Only `@Test` methods are partitioned. Configuration methods
  (`@BeforeSuite`, `@BeforeClass`, and similar) run normally for whatever
  test methods remain in a shard.

:::info
A blank, missing, or malformed `shaft.shard` value disables sharding
entirely and runs the full suite, so the property is safe to leave unset in
environments that do not shard.
:::

## When to Use Sharding

Reach for sharding when a suite's wall-clock time is dominated by test count
rather than per-test setup cost — many independent `@Test` methods that can
run in separate JVMs without sharing state. Skip it for small suites, where
the fixed cost of N Maven startups and a merge step outweighs the time saved,
and for suites with cross-test dependencies that assume a single execution
order.

## Running Shards Locally

Run each shard as its own `mvn test` invocation with a matching
`-Dtest=` filter if you want to scope which classes participate:

```bash title="Two shards, run sequentially"
mvn test "-Dshaft.shard=1/2" -DheadlessExecution=true
mvn test "-Dshaft.shard=2/2" -DheadlessExecution=true
```

:::info
`run_sharded_and_merge.py` and `assemble_shard_blob.py` ship in the
**SHAFT_ENGINE** repository, not in your project — copy
[`run_sharded_and_merge.py`](https://github.com/ShaftHQ/SHAFT_ENGINE/blob/main/scripts/ci/run_sharded_and_merge.py)
and
[`assemble_shard_blob.py`](https://github.com/ShaftHQ/SHAFT_ENGINE/blob/main/scripts/ci/assemble_shard_blob.py)
into your own `scripts/ci/` before using either command below. Both are
standalone and use only the Python standard library, so no extra install
step is required beyond a Python 3 interpreter.
:::

`scripts/ci/run_sharded_and_merge.py` automates that loop end to end: it runs
every shard, stages each shard's `allure-results` and trace directory into a
shard blob, then merges all blobs into one report with `ShardMergeCli`.

```bash title="One command: shard, run, and merge"
scripts/ci/run_sharded_and_merge.py --shards 3 --test "%regex[.*SmokeTest.*]"
```

Useful flags:

| Flag | Purpose |
|---|---|
| `--shards <N>` | Total shard count — the `M` in `-Dshaft.shard=<i>/M` |
| `--test <filter>` | `-Dtest=` filter forwarded to every shard's Maven run |
| `--no-headless` | Do not force `-DheadlessExecution=true` |
| `--output <dir>` | Merged report output directory (default `target/merged-report`) |
| `--skip-tests` | Skip the Maven runs and just re-assemble and merge existing results |

## Merging Shard Blobs With ShardMergeCli

Each shard produces a blob directory (`allure-results/`, an optional
`shaft-traces/` directory, and an optional `execution-intelligence.json`).
`ShardMergeCli` combines any number of shard blobs into one Allure result
set plus a cross-shard speedboard HTML.

Run it through Maven's `exec:java` goal, without packaging a jar first:

```bash title="Merge via exec:java"
mvn -q -pl report-aggregate exec:java \
  "-Dexec.mainClass=com.shaft.reportaggregate.ShardMergeCli" \
  "-Dexec.args=--output target/merged-report target/shard-blobs/1 target/shard-blobs/2 target/shard-blobs/3"
```

Or run the compiled class directly once `report-aggregate.jar` is built:

```bash title="Merge from a built jar"
java -cp report-aggregate.jar com.shaft.reportaggregate.ShardMergeCli \
  --output target/merged-report \
  target/shard-blobs/1 target/shard-blobs/2 target/shard-blobs/3
```

Both forms accept `--output <dir>` followed by one or more shard blob
directories. The merged Allure results directory, the speedboard HTML path,
and any flaky-clustering warnings print to stdout when the merge finishes.

## GitHub Actions Matrix Example

A generic CI shape: one matrix job per shard uploads its blob as an
artifact, then a `merge` job downloads every blob and runs `ShardMergeCli`.
This assumes `assemble_shard_blob.py` has already been copied into
`scripts/ci/` in this repository, per the note above.

```yaml title=".github/workflows/sharded-tests.yml"
jobs:
  shard:
    strategy:
      matrix:
        shard: [1, 2, 3]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run shard ${{ matrix.shard }}/3
        run: mvn test "-Dshaft.shard=${{ matrix.shard }}/3" -DheadlessExecution=true
      # assemble_shard_blob.py is copied from SHAFT_ENGINE's scripts/ci/ (see note above)
      - name: Assemble shard blob (script copied from SHAFT_ENGINE scripts/ci/)
        run: python3 scripts/ci/assemble_shard_blob.py --shard ${{ matrix.shard }} --output "target/shard-blobs/shard-${{ matrix.shard }}" --zip
      - uses: actions/upload-artifact@v4
        with:
          name: shard-blob-${{ matrix.shard }}
          path: target/shard-blobs/shard-${{ matrix.shard }}.zip

  merge:
    needs: shard
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/download-artifact@v4
        with:
          pattern: shard-blob-*
          path: downloaded-blobs
      - name: Unzip shard blobs
        run: |
          mkdir -p target/shard-blobs
          for zip in downloaded-blobs/*/*.zip; do
            name="$(basename "$zip" .zip)"
            mkdir -p "target/shard-blobs/$name"
            unzip -oq "$zip" -d "target/shard-blobs/$name"
          done
      - name: Merge shards
        run: |
          mvn -q -pl report-aggregate -am -DskipTests install
          blobs=(target/shard-blobs/*/)
          mvn -q -pl report-aggregate exec:java \
            "-Dexec.mainClass=com.shaft.reportaggregate.ShardMergeCli" \
            "-Dexec.args=--output target/merged-report ${blobs[*]}"
      - uses: actions/upload-artifact@v4
        with:
          name: merged-report
          path: target/merged-report
```

:::warning
Every shard writes `allure-results` into the same relative path, so each
matrix job needs its own runner (or workspace) — never run two shards
against a shared `allure-results` directory, or their results collide before
the merge step ever runs.
:::

## Related

- [CI/CD Integration](/docs/reference/guides/CI_CD_Integration)
- [Test Artifacts and Report Paths](/docs/reference/guides/Test_Artifacts)
- [How SHAFT reduces flakiness](/docs/testing/flakiness)
- [Properties Reference](/docs/reference/properties/PropertiesList)
