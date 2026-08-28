---
title: Evidence and report updates
description: Configure portable failure evidence, structured checkpoints, and merged reports.
---

import WhatsNewCatalog from '@site/src/components/WhatsNewCatalog';

# Evidence and report updates

Use the lightest evidence profile that answers the team's diagnostic needs.
Failed runs can retain portable reports, bundles, manifests, and structured checks.

<WhatsNewCatalog group="evidence" />

Keep the default automatic trace profile unless the project needs another level:

```properties
shaft.trace.enabled=true
shaft.trace.mode=auto
```

![SHAFT Trace Viewer populated with a failed action timeline, filters, and evidence detail.](/img/whats-new/trace-viewer.png)

![Generated Allure report with the SHAFT Failure Brief attachment open.](/img/whats-new/failure-brief.png)

## Related

- [Reporting and evidence](/docs/features/reporting)
- [What's new since modularization](/docs/features/whats-new)
