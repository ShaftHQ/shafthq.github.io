# Contributing To The SHAFT User Guide

This repository contains the Docusaurus site published at
[shaft-engine.automatest.org](https://shaft-engine.automatest.org). The engine source of
truth is [ShaftHQ/SHAFT_ENGINE](https://github.com/ShaftHQ/SHAFT_ENGINE).

## 1. Check Out The Code

Fork the repository if you are not a maintainer. Then clone your fork:

```bash
git clone https://github.com/<your-user>/shafthq.github.io.git
cd shafthq.github.io
git remote add upstream https://github.com/ShaftHQ/shafthq.github.io.git
```

Maintainers can clone the canonical repository directly:

```bash
git clone https://github.com/ShaftHQ/shafthq.github.io.git
cd shafthq.github.io
```

Start every change from current `master`:

```bash
git fetch --prune origin
git switch master
git pull --ff-only origin master
git switch -c <short-topic-branch>
```

If you work from a fork, replace the pull command with:

```bash
git fetch --prune upstream
git switch master
git merge --ff-only upstream/master
git push origin master
git switch -c <short-topic-branch>
```

## 2. Install The Toolchain

Required:

- Node.js 20.
- Yarn.
- Git.

Verify the active tools:

```bash
node --version
yarn --version
git --version
```

Install dependencies:

```bash
yarn install
```

Install the browser used by the Playwright validation:

```bash
yarn playwright install chromium
```

## 3. Run The Site Locally

```bash
yarn start
```

Docusaurus prints the local browser URL after startup. Use that page to inspect
changed routes while editing.

## 4. Make The Change

- Keep one canonical page per concept.
- Verify APIs, properties, commands, dependencies, and compatibility claims
  against executable engine source before documenting them.
- Read current release data from `src/data/releases.json`.
- Put recurring executable commands and dependency snippets in
  `src/data/snippets.json` or existing `src/components/DocSnippets` components
  instead of duplicating literals across pages.
- Put user documentation under `docs/`.
- Put operational material under `docs/maintainers/`.
- Keep historical records under `docs/archive/` with archive metadata intact.
- Do not add unsupported adoption, performance, compatibility, or "latest"
  claims.
- Do not commit secrets, generated builds, Playwright reports, or local
  credential files.

For coordinated engine changes, update this guide in the same delivery and link
the engine pull request.

## 5. Validate The Change

Run the full documentation contract:

```bash
yarn test
yarn typecheck
yarn build
yarn test:playwright
```

For visual changes, also inspect the affected built page in a browser and add
screenshots or browser evidence to the pull request.

## 6. Open The Pull Request

Push your branch:

```bash
git push -u origin <short-topic-branch>
```

Open a pull request against `ShaftHQ/shafthq.github.io:master`.

The PR is ready for review when it includes:

- A clear problem statement and solution summary.
- The canonical routes affected by the change.
- Validation commands and results copied into the PR description.
- Screenshots or browser evidence for visual changes.
- A linked engine PR when the documentation change supports engine behavior.
- Source links or code references for public claims.
- No generated builds, reports, secrets, or credentialed cloud output.

Reviewers should be able to check out the branch, run the listed commands, and
see the same result.
