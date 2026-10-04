# ChaosEngine install guide

Silent step loops for the ChaosEngine one-liner, doctor, add-ons, listing, and removal.

Canonical HTML: https://shafthq.github.io/docs/agentic/chaos-engine-install-guide
Guide index: https://shafthq.github.io/llms.txt

# ChaosEngine install guide

Each clip is a real install on a clean Linux account (ChaosEngine `main`
`3a02d90`), re-timed with labelled speed-ups. With reduced motion enabled, the
page shows a still frame and the text instead of the loop.

Prefer the full narrated walkthrough on
[Install and operate ChaosEngine](/docs/agentic/chaos-engine). Add-on flags are
on [Add optional ChaosEngine skills](/docs/agentic/chaos-engine-addons).

## Step 1 — Run the one-liner in your project

From the project folder (it needs at least one commit), run:

```bash
url="https://raw.githubusercontent.com/ShaftHQ/SHAFT_ENGINE/main/chaos-engine/install.sh"
curl -fsSL "$url" | bash -s -- "$url"
```

 
 
 
 
 
 Six steps: resolve, download, install core, provision tools, verify, activate clients.

## Step 2 — Check health with doctor

```bash
python3 .chaos-engine/install.py doctor --project .
```

 
 
 
 
 
 Anything flagged comes with the exact repair --component command.

## Step 3 — Add optional add-ons

```bash
curl -fsSL "$url" | bash -s -- "$url" --with-design-skills --with-shaft-engine-users
```

 
 
 
 
 
 Never installed by default; the selection is remembered on upgrade.

## Step 4 — See what is installed

```bash
python3 .chaos-engine/install.py addons --project .
```

 
 
 
 
 
 Files land under .chaos-engine/addons/&lt;name&gt;/ .

## Step 5 — Remove one

```bash
curl -fsSL "$url" | bash -s -- "$url" --without-shaft-engine-users
```

 
 
 
 
 
 Only design-skills remains.

## Related

- [Install and operate ChaosEngine](/docs/agentic/chaos-engine)
- [Add optional ChaosEngine skills](/docs/agentic/chaos-engine-addons)
- [ChaosEngine install video release](https://github.com/ShaftHQ/SHAFT_ENGINE/releases/tag/chaosengine-install-video-20261004)
