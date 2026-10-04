# Add optional ChaosEngine skills

Install, list, upgrade, and remove the optional ChaosEngine add-ons for design work, SHAFT users, and SHAFT contributors.

Canonical HTML: https://shafthq.github.io/docs/agentic/chaos-engine-addons
Guide index: https://shafthq.github.io/llms.txt

# Add optional ChaosEngine skills

A plain ChaosEngine install gives you the lean core only. Extra skill sets
ship as **add-ons**. None is installed by default, and none is picked for you
from your project files. You choose them with a flag, and your choice is kept
on every upgrade until you remove it.

## Choose your add-ons

| Add-on | Install it when | Shell flag | PowerShell switch |
| --- | --- | --- | --- |
| `design-skills` | You design web pages, images, motion graphics, or videos and want checked results | `--with-design-skills` | `-WithDesignSkills` |
| `shaft-engine-users` | Your test project uses SHAFT and you want the SHAFT test-writing skills | `--with-shaft-engine-users` | `-WithShaftEngineUsers` |
| `shaft-core-developers` | You change the SHAFT engine itself (it also adds `shaft-engine-users`) | `--with-shaft-core-developers` | `-WithShaftCoreDevelopers` |

Remove an add-on with `--without- ` or `-Without `. You can pass
several flags in one command.

## Install with add-ons

Run the command from your project folder.

On macOS or Linux, add the flags after the script URL:

```bash
curl -fsSL https://raw.githubusercontent.com/ShaftHQ/SHAFT_ENGINE/main/chaos-engine/install.sh | bash -s -- https://raw.githubusercontent.com/ShaftHQ/SHAFT_ENGINE/main/chaos-engine/install.sh --with-shaft-engine-users --with-design-skills
```

On Windows PowerShell, the short `irm ... | iex` form cannot take switches.
Use the script-block form:

```powershell
& ([scriptblock]::Create((irm https://raw.githubusercontent.com/ShaftHQ/SHAFT_ENGINE/main/chaos-engine/install.ps1))) -WithShaftEngineUsers -WithDesignSkills
```

Or set `CHAOS_ENGINE_ADDONS` and keep the short form. This works with every
installer:

```powershell
$env:CHAOS_ENGINE_ADDONS = "shaft-engine-users,design-skills"; irm https://raw.githubusercontent.com/ShaftHQ/SHAFT_ENGINE/main/chaos-engine/install.ps1 | iex
```

## Check what is installed

```bash
python3 .chaos-engine/install.py addons --project .
```

Each line shows the add-on name, whether it is `installed` or `available`, its
flag, and when to use it. Add `--json` for scripts. On Windows, use `py -3`
instead of `python3`.

Installed add-ons live in `.chaos-engine/addons/ /`. The
`shaft-core-developers` add-on switches ChaosEngine to the SHAFT repository
profile instead of adding files there.

## Upgrade and remove

- Run the same install command without flags to upgrade. Your add-ons stay.
- Pass `--without- ` (or `-Without `) to remove one.
- A misspelled name stops the install and lists the valid names.
- ChaosEngine refuses to remove an add-on that another chosen add-on needs.
 For example, `shaft-engine-users` stays while `shaft-core-developers` is
 installed.

:::note Change for SHAFT projects
Earlier versions picked the SHAFT contributor profile automatically when a
project's `pom.xml` mentioned SHAFT. That also happened in projects that only
use SHAFT. Now nothing is picked automatically: the installer prints a tip,
and you choose `shaft-engine-users` or `shaft-core-developers`. Installs that
already use the contributor profile keep it.
:::

## What the design add-on gives your agent

The `design-skills` add-on is a short router plus 20 focused cards. Your agent
loads one card for the step it is on, and each card ends with checks it must
pass. The checks run in a script, `design_qc.py`, that uses no AI model. A check
whose tool is missing reports `skipped`, never `pass`.

| Area | Cards |
| --- | --- |
| Planning and brand | brief and storyboard, brand system |
| Web and type | visual direction, interface audit, typography and layout, color and contrast |
| Images | posters, link cards, thumbnails, and diagrams |
| Motion | motion principles, HTML motion graphics, technical animation |
| Video | screen capture, edit assembly, cutting and pacing, color grading |
| Audio | mix and loudness, noise removal, voice-over |
| Finishing | captions, restoration and upscaling, delivery QC |

Examples of objective checks: WCAG contrast ratios, caption line length and
reading speed, −16 LUFS web loudness with a true peak of −1 dBTP or lower,
BT.709 color tags and legal levels, flash rate, and encode settings.

The cards are written for ChaosEngine and credit their sources. Design rules
from openly licensed projects are rewritten with attribution, and every
source is pinned to a commit in the add-on's `INVENTORY.md`. Web work still
follows ChaosEngine's UI delivery rules: tests that fail first, measured
layout, and screenshots at five viewport sizes in every theme.

## Related

- [Install and operate ChaosEngine](/docs/agentic/chaos-engine)
- [ChaosEngine install guide](/docs/agentic/chaos-engine-install-guide)
- [Install SHAFT agent skills](/docs/agentic/skills)
- [Agent tooling runbook](/docs/maintainers/agent-tooling)
