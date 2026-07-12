---
id: capture
title: Record tests with Capture
description: Record browser activity and generate reviewable deterministic TestNG source.
slug: /agentic/capture
sidebar_position: 4
tags: [capture, recording, generation]
---

# Record tests with Capture

`shaft-capture` defines the provider-neutral intermediate representation used
by SHAFT Capture and the managed-browser recorder that produces it. It records
browser intent for review, replay, migration, and future Java/JUnit/Cucumber
consumers. It generates Java 25 SHAFT/TestNG tests without depending on
`shaft-ai`; provider adapters remain optional.

Capture creation, validation, serialization, and privacy enforcement work with
`pilot.ai.enabled=false`. Optional AI consumers may receive only the already
redacted representation after the separate Pilot approval checks succeed.

## Managed browser recording

The recorder launches a fresh SHAFT-managed Chrome, Chromium, or Edge session.
Firefox and WebKit are rejected with explicit unsupported-browser messages
until equivalent event coverage is available. WebDriver BiDi supplies
navigation, browsing-context, prompt, and preload-script signals when
available. A JavaScript listener drained through ordinary WebDriver provides
deterministic interaction capture and remains the compatibility fallback.

Use the Capture commands on
[Connect shaft-mcp](/docs/agentic/mcp#mcp-command-reference). That page owns
the runnable MCP command reference and classpath notes.

Use `--runtime-dir <path>` on every command to isolate control files. `stop`
also accepts `--discard` (same as `capture_stop` with `discard=true`). Only one
recorder may own a runtime directory at a time. The daemon control endpoint is
bound to loopback, requires a generated bearer token, and removes its token and
descriptor at shutdown. Browser profiles are temporary and removed after normal
stop or interruption unless `--user-data-dir <path>` is supplied.

`capture start` also accepts Playwright-codegen-shaped options where SHAFT can
map them safely: `--viewport-size`, `--device`, `--color-scheme`,
`--geolocation`, `--timezone`, `--block-service-workers`, `--load-storage`,
`--save-storage`, `--save-har`, `--test-id-attribute`, `--lang`,
`--user-agent`, `--user-data-dir`, `--proxy-server`, `--proxy-bypass`,
`--ignore-https-errors`, `--timeout`, and `--session-goal`. Device presets use bundled
Chrome/Edge mobile-emulation profiles when available; color scheme,
geolocation, timezone, and service-worker bypass use browser protocol support;
storage state uses SHAFT's browser storage-state JSON; and HAR output uses the
same redacted observability entries as SHAFT failure traces. Unsupported
drivers or unmapped device names produce deterministic warnings instead of raw
protocol failures. `--save-har-glob` filters the saved HAR to URLs matching the
glob and reports how many observed network entries were kept versus dropped.
Use `capture features` to list the current Playwright codegen feature map.
`--session-goal` stores the recorder intent in session extensions so generated
Java can include a safe review comment.

```bash
capture start \
  --url https://example.test \
  --device "Pixel 7" \
  --geolocation "30.0444,31.2357" \
  --timezone Africa/Cairo \
  --color-scheme dark \
  --load-storage target/auth-state.json \
  --save-storage target/auth-state-out.json \
  --save-har target/capture.har
```

The same lifecycle is exposed by the `capture_start`, `capture_start_codegen`,
`capture_status`, and `capture_stop` MCP tools. Both start tools accept an
optional `sessionGoal` describing the recorded journey; it names the generated
test class and method. Both start tools also accept an optional
`saveHarContent` option: leaving it blank or `none` keeps today's truncated
network-trace preview bodies, while `full` emits complete, redacted
request/response bodies (headers redacted, binary content base64-encoded) for
every transaction recorded during the session, sourced from the API-capture
network events rather than the preview trace. `full` falls back to preview
bodies with a warning when no such transactions were recorded, for example
when `apiCapture` was not enabled for that session. This option is MCP-only;
the local `capture start` CLI does not expose a `--save-har-content` flag.
Generation is exposed by
`capture_generate`; `capture_codegen_features` returns the feature map.
`shaft_coding_partner_plan`, `capture_target_candidates`,
`capture_backend_comparison`, and `capture_evidence_pack` cover repository-aware
reuse planning, existing-suite targeting, backend comparison, and review
evidence manifests. Status contains safe metadata, counts, readiness, and
warnings, never typed values; `pendingSignalCount` reports debounced signals
(uncommitted typed input, pending clicks) not yet persisted as events, so live
monitors do not misread a quiet `eventCount`. Readiness is `READY`, `RISKY`, or
`BLOCKED`; risky steps keep recording, while blocked readiness means generated
replay will need user action such as a stable locator or required secret input.

WebDriver code generation remains the default through `capture_generate`,
`capture_generate_replay`, and `capture_code_blocks`. Use
`playwright_capture_generate_replay` or `playwright_capture_code_blocks` only
when the target repository uses `SHAFT.GUI.Playwright` or the user asks for
Playwright output. Those Playwright tools read the same Capture session format
but emit `SHAFT.GUI.Playwright` setup, actions, waits, and assertions.
From the local Capture CLI, pass `capture generate --backend playwright` to emit
the same Playwright backend from a persisted Capture session; omitting
`--backend` keeps WebDriver output.
MCP Playwright action recordings created with `playwright_record_start` remain
available through the same Playwright tool names; `playwright_recording_code_blocks`
now adapts supported recorded actions into a Capture session, returns the
generated source/test-data/report/review paths, and keeps the direct replay
method for actions that do not yet have a Capture equivalent.

When recording in a visible browser, SHAFT injects a compact Capture panel into
the managed Chrome/Edge session. The panel lists captured actions in plain
English while the user clicks, types, selects, uploads, or navigates. Its
controls pause or resume action capture, add browser or element checkpoints from
an in-panel dialog, edit or delete visible action text, reorder captured steps,
add a visible assertion from a stored action target, pick locators, and stop the
recording. Pressing stop from the panel requests a normal SHAFT stop, closes the
managed browser, and leaves the session in `COMPLETED` status for generation.
The browser panel
and generated capture workbench follow the same SHAFT report visual language as
Allure-attached HTML reports, including status chips and wrapping layouts that
avoid horizontal scrolling during review.

The panel also shows a live readiness chip next to the event count. It is
computed from deterministic recorder evidence such as unsupported actions,
missing locator candidates, positional or multi-match locators, missing
post-navigation or post-submit assertions, redacted required inputs, and
collector warnings. The chip reports issues only; it does not block recording.

Teams can pin recorder behavior for a whole repository by checking in
`.shaft/recorder-policy.json` at the workspace root:

```json
{
  "headless": false,
  "outputDirectory": "recordings",
  "browser": "Chrome"
}
```

All fields are optional. When the file exists, SHAFT MCP's `capture_start`
applies it to every recording started against that workspace — whichever
client asked (IntelliJ plugin, agent CLI, raw MCP call): `headless` locks the
browser visibility, `outputDirectory` re-roots every recording into the team
directory (the requested file name is kept), and `browser` fills the default
when a request names none. The IntelliJ Guided panel mirrors the policy
visibly: the Headless toggle is applied and locked with a "locked by team
policy" tooltip, and the default session path moves into the team directory.
A malformed policy file never blocks recording; it just falls back to
defaults.

For the maintenance loop, the Guided panel's **Weekly flaky triage** template
prefills a batch Doctor analysis with historical bundles
(`target/shaft-doctor/history`) so repeat offenders surface as trends; follow
up with `healer_run_failed_test` per flaky test, and pair the template with a
weekly scheduled agent that sends `/doctor` and consolidates the report.

The recorder only keeps actions a user actually performed. Browser-synthesized
noise is suppressed on both the in-page recorder and the server pipeline:
pressing Enter in a form no longer records a phantom click on the form's
invisible default submit button, the duplicate `change` re-announcement of an
already-recorded typed value no longer appends a second type step, clicks on
the bare page background (`body`/`html`) are ignored, and page clicks made
while the assertion wizard is open are treated as wizard interaction rather
than recorded steps.

Use the assertion control to open the guided assertion flow, which offers two
deterministic branches. The **Element** branch asks you to click the target
element: a prominent top-of-page banner ("Assertion: click the element you
want to verify... Press Esc to cancel"), a crosshair cursor, and the hover
highlight make the waiting-for-your-click state unmissable, and that pick
click is never recorded as a step. It then shows the top scored locator
candidates (with a manual XPath or
CSS field as an alternative), then the fixed element catalog: exists, visible,
enabled, and selected (each with an expected `true`/`false` choice), text equals
or contains, attribute equals (with attribute name and expected value fields),
image matches, aria snapshot matches (prompts for the baseline snapshot name),
and screenshot matches baseline. Negated variants are unsupported for the aria
snapshot and screenshot assertions. The **Browser** branch shows the fixed page-level catalog:
URL equals or contains, title equals or contains, and page text contains, each
with an editable expected value prefilled from the live page. Saved assertions
appear in the panel step list and rehydrate across navigations like any other
recorded step.
The recorder stores these as `VerificationEvent` records. Expected text, URL,
title, and attribute values are externalized through the same privacy classifier
used for typed data, so generated assertions do not embed captured secrets.
Generated GUI assertions use SHAFT assertion builders such as
`driver.element().assertThat(...)` and `driver.browser().assertThat()`; do not
replace checkpoint notes with raw TestNG or JUnit assertions. Aria snapshot
matches and screenshot matches baseline render as
`driver.element().assertThat(locator).matchesAriaSnapshot(...)` and
`driver.element().assertThat(locator).matchesScreenshot().perform()`.

![SHAFT Capture assertion mode](/img/capture-assertion-mode.png)

Use the locator picker control to inspect the target before recording or
verifying it. Picker mode highlights the hovered element, opens a ranked
candidate list on click, and shows each candidate's strategy, expression,
uniqueness count, stability, score rationale, and live probe result (`unique`,
`multi-match`, `no match`, or `failed`). Pin a candidate when the deterministic
default is not the locator intent; the next captured event for that logical
element stores the selected candidate with the `USER_PROVIDED` locator signal,
so generation can prefer it without editing generated source.

![SHAFT Capture locator picker](/img/capture-locator-picker.png)

While a capture session is active, `element_*` and `natural_act` tools drive
the recorded browser directly -- no `driver_initialize` session is needed --
and the driven interactions are recorded like user ones. That makes the
scripted agent-performed codegen flow real: `capture_start_codegen`, perform
the described actions with element tools, `capture_stop`, then generate code
from the persisted recording. One-shot agent turns (a CLI that exits after its
reply) must only use this same-turn scripted flow; an interactive user-driven
recording started from such a turn dies with the turn's MCP process.

For agent-driven MCP flows, the intended handoff is: call `capture_start` or
`capture_start_codegen`, let the user interact with the visible browser, wait
for either `capture_stop` or a browser-panel stop to complete, then call
`shaft_coding_partner_plan` with the user intent, current source path, selected
text, and recording/report artifacts. The plan ranks existing Java targets,
locator summaries, action summaries, missing code, suggested proof calls, and a
focused verification command before code blocks are generated. Then call
`capture_code_blocks` for WebDriver or `playwright_capture_code_blocks` for
Playwright, or use `capture_record_at_target_code_blocks` when the plan found a
specific insertion target. If a focus or click mistake pollutes the recording,
the Assistant discard/re-record commands stop with `discard=true` before
starting a fresh capture. The agent should show the generated result and ask
whether the user wants the complete Java snippet or wants the agent to insert
the code into the current repository. Snippet mode uses the returned Java
full-class block, including imports, setup, inline `SHAFT.GUI.Locator.*`
locators, SHAFT actions/assertions, and teardown. Insertion mode should reuse
the plan's existing Page Object classes when that pattern already exists, or
create the smallest matching page/test classes when it does not.
The returned code blocks include deterministic Page Object insertion guidance
for WebDriver and Playwright captures, including SHAFT locator inventory, action
sequence, setup prerequisites for required data and fixtures, assertion
suggestions for missing post-navigation or post-submit checks, control-flow
review commands, locator confidence queues, validation back-links, and a
`capture-page-object-draft` block with locator fields and flow methods when
extractable candidates exist. Locator inventory blocks show the selected SHAFT
locator expression and ranked alternatives from the generation report.

For native mobile journeys, use the mobile MCP tools instead of browser
Capture: `mobile_recording_code_blocks` returns the replay method, ranked
mobile locator inventory, action sequence, and `mobile-page-object-draft`.
`mobile_record_at_target_code_blocks` adds locator fields and an action snippet
for an existing mobile Page Object anchor, plus a preview-only patch block and a
locator confidence queue when fallback actions need review.

Use `FLOW_START` and `FLOW_END` checkpoints to mark an explicit reusable flow
inside a recording. The checkpoint description becomes the generated helper
method name, so a segment marked as `login as admin` generates a
`loginAsAdmin()` method and the replay test calls that method at the original
point in the journey:

```bash
capture checkpoint --kind FLOW_START --description "login as admin"
# perform the login steps in the managed browser
capture checkpoint --kind FLOW_END --description "login as admin"
```

```java
@Test
public void replayCheckout() throws Exception {
    driver.browser().navigateToURL("https://shop.example/login");
    loginAsAdmin();
    driver.element().click(SHAFT.GUI.Locator.clickableField("Checkout"));
}

private void loginAsAdmin() throws Exception {
    driver.element().click(SHAFT.GUI.Locator.inputField("Username"));
    driver.element().type(SHAFT.GUI.Locator.inputField("Username"), requiredData("username"));
}
```

For a record-at-target flow, provide the existing Java source and insertion
anchor when generating snippets. The CLI accepts
`--target-source src/test/java/.../CheckoutTest.java --insert-after replayCheckout`
and returns the normal generation result plus a focused insertion plan. MCP
agents can call `shaft_coding_partner_plan` or `capture_target_candidates` first, then
`capture_record_at_target_code_blocks` to receive separate blocks for SHAFT
locator inventory/imports, action lines, and a preview-only patch block. The
patch preview shows the apply order, reuses locator fields already present in
the target source, and skips exact duplicate action lines before an agent patch
is proposed.
SHAFT validates that the requested anchor is present when possible, but it never
edits the source file until the calling agent performs a separately approved
repository change.

## Recorder/codegen implementation

Recorder/codegen now turns the main post-recording decisions into reviewable
artifacts before any source file is edited.

| Rank | Enhancement | User-facing result |
| --- | --- | --- |
| 1 | Patch preview for record-at-target | `capture_record_at_target_code_blocks` and mobile record-at-target flows return preview-only diff blocks with apply order before an agent applies source edits. |
| 2 | Coding partner and target scanner | `shaft_coding_partner_plan` and `capture_target_candidates` suggest likely Page Objects, test classes, package names, driver variables, insertion anchors, locator summaries, action summaries, and the recommended target/anchor from the current repository. |
| 3 | Assertion gap checklist | Generated review blocks list missing post-login, post-submit, navigation, and error-state assertions. |
| 4 | Locator confidence queue | Weak XPath, multi-match, and coordinate fallback steps are grouped into a fix-first review list. |
| 5 | Fixture and secret handoff | Required environment variables, test data, and upload fixtures remain summarized without exposing secret values. |
| 6 | Flow grouping assistant | Explicit `FLOW_START` and `FLOW_END` checkpoints become helper-method proposals; repeated groups stay advisory until approved. |
| 7 | Replay failure back-links | Validation review blocks point compile or replay failures back to recording step ids and generated code blocks. |
| 8 | Backend comparison blocks | `capture_backend_comparison` returns WebDriver and Playwright code-block summaries for the same Capture session. |
| 9 | PR evidence pack | `capture_evidence_pack` returns local screenshots, workbench HTML/review paths, generated source paths, and validation commands for review. |
| 10 | Guided IDE action copy | IntelliJ Guided templates follow the real flow: plan coding partner work, record, review code, preview patch, apply, and verify. |

All process arguments and filesystem paths are built with Java APIs
(`ProcessBuilder`, `Path`, and `Files`). No Windows, POSIX shell, or path
separator is assumed; restrictive POSIX permissions are applied when supported
and otherwise the host filesystem's inherited permissions are used.

## Format

Every session has a `schemaVersion`, safe session and browser metadata, ordered
events and checkpoints, external test-data references, a redaction summary, and
explicit extension maps. The current version is `1.0`; readers migrate the
synthetic `0.9` format and reject unsupported versions with an actionable
message.

The event hierarchy covers:

- navigation, click, type, clear, select, check/uncheck, and upload;
- keyboard, window/tab, frame, alert, and explicit wait operations;
- explicit verification events and replay status.

`ElementSnapshot` retains sanitized role, accessible name, label, normalized
attributes, visibility state, and `LocatorCandidate` evidence. Candidate scores
are deterministic inputs based on strategy, uniqueness, visibility, stability,
and recorded signals. No model inference is used to rank locators.

The bundled schema is:

`shaft-capture/src/main/resources/schema/shaft-capture-session-1.0.schema.json`

`CaptureJsonCodec` validates before read and write, emits stable human-readable
JSON, preserves explicit extension fields, and never publishes a partially
validated recording.

## Privacy boundary

`CapturePrivacyClassifier` runs before values enter a `CaptureSession`.
Passwords, tokens, configured sensitive fields/selectors/attributes/URL
parameters, and configured value patterns produce named environment or secret
references with no original value. Ordinary typed data is externalized to
`capture-data.json` by default through `ExternalTestDataWriter`.

Upload events store a logical fixture reference, sanitized basename, media type,
and size. They never retain an arbitrary absolute user path or file contents.
Evidence references accept only safe relative paths. Cookies, storage, headers,
page source, screenshots, and other evidence are absent unless a later
collector explicitly enables a documented category.

The persisted redaction summary contains only counts and rule names. It does not
contain removed values.

## Lifecycle

`CaptureSessionStore` provides thread-safe start, append, checkpoint,
interruption, stop, and read operations. Each update serializes and validates a
complete snapshot before an atomic replacement. In-progress or crashed sessions
remain readable with status `INCOMPLETE`; a normal stop records `COMPLETED` and
an end timestamp.

Example:

```java
var session = CaptureSession.start(
        "checkout-recording",
        Instant.now(),
        browserMetadata);
var store = new CaptureSessionStore(Path.of("recordings/checkout.json"));
store.start(session);
store.append(captureEvent);
store.stop(Instant.now());
```

## Deterministic TestNG generation

Generate a test, SHAFT JSON test data, and a deterministic report with the
Capture generation command on
[Connect shaft-mcp](/docs/agentic/mcp#mcp-command-reference).

The default output layout is:

```text
generated-tests/
  src/test/java/generated/capture/<RecordedIntent>Test.java
  src/test/resources/testDataFiles/<session-name>-test.json
  target/shaft-capture/generation-report.json
  target/shaft-capture/capture-review.json
  target/shaft-capture/capture-workbench.html
  target/shaft-capture/control-flow-preview.json
```

Generation selects locators in the accessibility, label, test-ID, stable
ID/name, CSS, then XPath family. The report records the score contribution from
uniqueness, visibility, interactability, semantic match, volatility,
frame/shadow context, and replay evidence, plus ranked fallbacks. Stable
user-provided locators pinned from the recorder overlay can outrank the
deterministic default. The review file
summarizes deterministic readiness, blockers, risks, typed findings, and next
suggestions; MCP generation results expose the same path as `reviewPath` and
return the deterministic review warnings in the tool result. Static review
findings cover brittle absolute or index-heavy locators, missing post-navigation
or post-submit assertions, fixed-duration waits, and sensitive JSON-backed test
data. When replay fails and a SHAFT trace exists, Capture maps the failure back
to the generated step and failed trace action, and flags failing network/API
calls as candidates for HTTP contract replay.

Generated class and method names prefer explicit user options, then the
recorded `sessionGoal` ("Log in as a valid user" yields `logInAsAValidUser()`),
then checkpoint descriptions, page titles, URL paths, and finally the opaque
session id. Externalized-secret environment variables use stable names derived
from the logical field (`SHAFT_CAPTURE_DATA_PASSWORD`), so re-recording the
same journey never shifts the variable names a replay environment provides.
Edited step text from the recorder panel is preserved as a generated Java
comment so reviewers can keep the user's intent beside the replay statement.
Generated source also starts with a safe review header containing readiness,
event count, fallback-locator count, and the optional `sessionGoal` comment
when provided.

The workbench HTML is a local review UI for building record/checkpoint
commands, checking blockers and required inputs, reviewing assertion gaps,
locator decisions, a Page Object draft, copyable CLI/MCP command starters, the
generated code-block summary, deterministic control-flow suggestions, generated
source through the browser file picker or download fallback, and the Playwright
codegen feature map beside the generated code. Use
`capture_backend_comparison` when reviewers need WebDriver and Playwright block
summaries side by side, and `capture_evidence_pack` to return the local source,
report, review, screenshot, and validation-command manifest for a PR.

Add `--enable-fallback-locators` when generating WebDriver replay code to make
the generated test try ranked captured alternatives before failing a target
lookup. The selected locator remains the first candidate; when ranked
alternatives exist, generated source imports `org.openqa.selenium.By` and emits
a compact `captureReplayLocator(By primary, By... alternatives)` helper. The
helper probes the primary locator first with `driver.element().getElementsCount`
and then returns the first alternative with a current match; if none match, it
returns the primary locator so SHAFT fails on the intended target.

```java
driver.element().click(captureReplayLocator(
    SHAFT.GUI.Locator.inputField("Username"),
    SHAFT.GUI.Locator.cssSelector("form input:nth-child(1)")));
```

Use `--control-flow-preview` to write deterministic suggestions for common
non-linear browser journeys without changing the generated replay. Capture
flags adjacent identical action groups, likely optional modal or banner close
actions, and recovery-like steps after failed or skipped recorded interactions.
The same suggestions appear in `generation-report.json` under
`controlFlowSuggestions` and in MCP warning results as `review/CONTROL_FLOW`
findings.

```bash
capture generate --session recordings/checkout.json --control-flow-preview
capture generate --session recordings/checkout.json \
  --apply-control-flow-preview generated-tests/target/shaft-capture/control-flow-preview.json
```

Default generation stays linear. Applying a reviewed preview only changes
approved optional close actions by adding an if-displayed guard:

```java
if (isCaptureElementDisplayed(COOKIE_CLOSE_BUTTON_LOCATOR)) {
    driver.element().click(COOKIE_CLOSE_BUTTON_LOCATOR);
}
```

Repeated groups and recovery paths remain review suggestions until the user
marks explicit flow checkpoints or edits the generated test.

Example review finding:

```json
{
  "category": "LOCATOR",
  "severity": "WARNING",
  "summary": "Brittle XPATH locator selected for pay-button: /html/body/div[3]/form/button[2].",
  "evidenceIds": ["event-4"],
  "recommendation": "Prefer semantic locator text \"Pay now\" when unique."
}
```

Example status payload:

```json
{
  "state": "ACTIVE",
  "eventCount": 12,
  "readiness": "RISKY",
  "warnings": ["Step 7 uses generated positional CSS locator for pay-button."]
}
```

Ordinary values are copied from the recording's external JSON into the
generated test-data file. Secret and sensitive references become required
environment variables and are typed securely. Uploads remain relative fixture
references under `src/test/resources`. Missing data is reported as required
user input. Captured credentials, cookies, authorization values, and absolute
personal paths fail the privacy scan instead of entering generated artifacts.

Every generated class creates a fresh driver in `@BeforeMethod` and calls
`driver.quit()` from `@AfterMethod(alwaysRun = true)`. Only explicit
`VerificationEvent` records become assertions. An `ASSERTION` checkpoint must
point at a verification event; unsupported steps fail generation with their
event IDs and remediation. Checkpoint notes alone do not satisfy missing
assertion warnings. A matched `FLOW_START`/`FLOW_END` pair does not
infer abstractions from similar steps; only the explicitly marked events move
into a reusable helper method.

Compilation is enabled by default. Add `--replay` to run the compiled TestNG
class in an isolated process and require populated, passing Allure result
files. Existing source, data, report, or preview files are never replaced
unless `--overwrite` is supplied. MCP replay code follows the selected backend:
WebDriver tools keep `SHAFT.GUI.WebDriver` and Playwright tools generate
`SHAFT.GUI.Playwright`.

AI enrichment is optional and uses two phases for native CLI users: preview
with explicit processing approval, then apply the reviewed fingerprinted
preview. Use the canonical Capture command reference on
[Connect shaft-mcp](/docs/agentic/mcp#mcp-command-reference) when running it.

The provider may suggest Java names and captured-state assertions only. It
cannot replace deterministic locators. Preview output is schema-validated and
privacy-scanned; apply rejects stale fingerprints, invalid identifiers,
unknown events, and assertions that contradict captured state. Accepted
changes are compiled and replayed again.

When an MCP client calls Capture or Doctor AI-enabled tools, SHAFT treats that
tool call as the agent approval boundary for sharing the already redacted local
evidence with the calling agent. If no configured provider/API key is available,
MCP results still include agent handoff blocks so the MCP client can use its own
LLM and repository context. Native terminal commands keep the explicit provider
and `--allow-local-ai` or `--allow-remote-ai` approval requirements.

Run the focused suite with:

```bash
mvn -pl shaft-capture -am test
```

The real-browser recording and generated-replay suites are opt-in:

```bash
mvn -pl shaft-capture -am test \
  -DincludeCaptureBrowserE2E=true \
  -Dtest=ManagedCaptureRecorderBrowserTest,CaptureGeneratedReplayBrowserTest
```

## Record web API traffic

SHAFT can capture HTTP request and response traffic during browser-based test execution. API traffic recording requires Chrome or Edge browsers with DevTools Protocol (CDP) support and is disabled by default.

### Browser requirements

- **Supported:** Chrome, Chromium, Edge (any version with DevTools Protocol)
- **Not supported:** Firefox, Safari, WebKit (pending CDP-equivalent event coverage)

When recording with an unsupported browser, the capture session completes without network events; no error is raised. Use the `capture.api.enabled` property to enable API capture for the current run.

### Configuration properties

API capture behavior is controlled by the following properties (all optional with sensible defaults):

| Property | Default | Description |
|----------|---------|-------------|
| `capture.api.enabled` | `false` | Enable or disable automatic capture of web API network traffic |
| `capture.api.maxBodyBytes` | `1048576` | Maximum request/response body size in bytes (1 MB); larger bodies are truncated |
| `capture.api.includeAssets` | `false` | Include asset requests (images, CSS, fonts); false captures only API calls |
| `capture.api.firstPartyOnly` | `true` | Capture only first-party API calls from the primary domain |
| `capture.api.storeSecretsLocally` | `false` | Store authorization headers and sensitive data inline (false = use body externalization via bodyRefId) |

Example configuration:

```properties
capture.api.enabled=true
capture.api.maxBodyBytes=1048576
capture.api.includeAssets=false
capture.api.firstPartyOnly=true
capture.api.storeSecretsLocally=false
```

### Privacy and secret handling

By default, `capture.api.storeSecretsLocally=false` ensures that authorization headers and sensitive data are stored via `bodyRefId` external references rather than inline in the capture session. This preserves privacy while keeping network traffic visible for debugging. Request and response bodies are stored separately from the session JSON; each network transaction record contains a `bodyRefId` field that references the externalized content.

When `capture.api.storeSecretsLocally=true`, headers are captured inline for testing purposes; this should be used only in development environments and never in production scenarios. This mode stores full request/response content inline instead of using external references.

### Recording API traffic via MCP

Use the `capture_api_start` tool to begin recording with API capture enabled:

```json
{
  "tool": "capture_api_start",
  "arguments": {
    "targetUrl": "https://example.test",
    "browser": "chrome",
    "headless": "true",
    "recordNetworkActivity": true,
    "excludeAssetTypes": "",
    "includeOnlyDomains": "",
    "excludePatterns": "",
    "sanitizeHeaders": true
  }
}
```

Monitor the recording with `capture_api_status`:

```json
{
  "tool": "capture_api_status",
  "arguments": {}
}
```

Query captured API transactions with `capture_api_transactions`:

```json
{
  "tool": "capture_api_transactions",
  "arguments": {
    "limit": 0,
    "includeAssets": false
  }
}
```

This returns the list of HTTP request/response pairs recorded so far, including request method, sanitized URL, response status, body sizes, and `bodyRefId` references to externalized request/response content.

Stop the recording with `capture_api_stop`:

```json
{
  "tool": "capture_api_stop",
  "arguments": {
    "stop": true,
    "discard": false
  }
}
```

### IntelliJ Record API (Web) action

The IntelliJ IDEA plugin provides a **Record API (Web)** action that:

1. Opens a fresh managed Chrome session with API capture enabled
2. Shows the Capture panel with both browser interactions and API calls listed
3. Captures request and response traffic according to configured properties
4. Stores secret/authorization headers as environment variable references by default (respects `capture.api.storeSecretsLocally`)
5. Stops when the user clicks the panel's stop button or closes the browser

Access the action through:
- **IDE menu:** IntelliJ IDEA > SHAFT > Record API (Web)
- **Run configuration:** Select the "Record API (Web)" run type

The recorded session is stored in the project's `target/shaft-capture/` directory and ready for immediate generation or further review.

### Chrome/Edge requirement (HasDevTools)

API traffic capture is only available for browsers with DevTools Protocol support. The IntelliJ Record API (Web) action will work only with Chrome and Edge. This limitation is enforced by the `HasDevTools` browser capability check.

### Code generation from API recordings

After a successful `capture_api_stop`, generate test code using `capture_generate_replay`:

```json
{
  "tool": "capture_generate_replay",
  "arguments": {
    "sessionPath": "recordings/checkout-with-api.json",
    "outputDirectory": "generated-tests",
    "packageName": "com.example.api",
    "className": "CheckoutApiTest"
  }
}
```

The generated test class includes:

- Browser navigation and interaction events (same as regular Capture)
- API request/response data for reference and manual assertion writing
- External test-data references for typed body values
- Request/response body files linked as supporting artifacts

### Future: API codegen and OpenAPI

API traffic recording in this phase (P1) focuses on capturing and validating HTTP traffic during test execution. Future phases will add:

- **P2 (ApiCaptureGenerator):** Automatic generation of reusable API test fixtures and contract validators from recorded traffic
- **P4 (OpenAPI coverage):** Analysis and coverage reporting for OpenAPI/Swagger contracts against recorded API calls

These features arrive as separate phases. For now, use the recorded API traffic for manual API assertion writing or as reference evidence during code review.

## Related

- [Overview](/docs/agentic/overview)
- [MCP](/docs/agentic/mcp)
- [Pilot](/docs/agentic/pilot)
- [Doctor](/docs/agentic/doctor)
