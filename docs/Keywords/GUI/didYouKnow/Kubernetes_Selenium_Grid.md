---
id: Kubernetes_Selenium_Grid
title: Kubernetes / Selenium Grid Deployment
sidebar_label: Kubernetes Grid
description: "Deploy a scalable Selenium Grid on Kubernetes using KEDA auto-scaling and configure SHAFT Engine to run tests against it."
keywords: [SHAFT, Kubernetes, Selenium Grid, KEDA, auto-scaling, k8s, distributed testing, cloud native, helm]
tags: [web, selenium-grid, kubernetes, k8s, distributed]
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Running your Selenium Grid on **Kubernetes** gives you a cloud-native, auto-scaling test infrastructure. Combined with **KEDA** (Kubernetes Event-Driven Autoscaler), the Grid scales browser nodes from zero to the required capacity on demand and scales back down when tests finish — saving resources and cost.

---

## Prerequisites

- A running Kubernetes cluster (local: [minikube](https://minikube.sigs.k8s.io/) / [kind](https://kind.sigs.k8s.io/), or cloud: EKS, GKE, AKS)
- [kubectl](https://kubernetes.io/docs/tasks/tools/) configured for your cluster
- [Helm 3](https://helm.sh/docs/intro/install/) installed

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                   Kubernetes Cluster                │
│                                                     │
│  ┌──────────────────┐    ┌────────────────────────┐ │
│  │  Selenium Hub    │    │  KEDA ScaledObject     │ │
│  │  (Router)        │◄───│  (auto-scaling trigger)│ │
│  │  Port 4444       │    └────────────────────────┘ │
│  └────────┬─────────┘                               │
│           │ distributes sessions                    │
│  ┌────────▼──────────────────────────────────────┐  │
│  │  Browser Nodes (auto-scaled 0 → N)            │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐      │  │
│  │  │ Chrome   │ │ Firefox  │ │  Edge    │  ...  │  │
│  │  └──────────┘ └──────────┘ └──────────┘      │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
         ▲
         │  SHAFT tests connect via Service DNS
```

---

## Step 1 — Add Helm Repositories

```bash
# Add the docker-selenium Helm chart repository
helm repo add docker-selenium https://www.selenium.dev/docker-selenium

# Add the KEDA Helm chart repository
helm repo add kedacore https://kedacore.github.io/charts

# Update local Helm cache
helm repo update
```

---

## Step 2 — Install KEDA

KEDA is the auto-scaler that watches the Selenium Grid session queue and adjusts the number of browser node replicas accordingly.

```bash
helm install keda kedacore/keda \
  --namespace keda \
  --create-namespace
```

Verify KEDA is running:

```bash
kubectl get pods --namespace keda
```

---

## Step 3 — Deploy Selenium Grid with Auto-Scaling

```bash
helm install selenium-grid docker-selenium/selenium-grid \
  --set autoscaling.enabled=true \
  --set autoscaling.scaledOptions.minReplicaCount=0 \
  --set autoscaling.scaledOptions.maxReplicaCount=8
```

This deploys:
- A **Selenium Hub** (Router) that accepts WebDriver sessions
- **Chrome, Firefox, and Edge** node deployments that scale from 0 to 8 replicas each
- KEDA `ScaledObjects` that trigger scaling when sessions queue up

### Verify the Deployment

```bash
# Check all Selenium pods are running
kubectl get pods --selector="app.kubernetes.io/name=selenium-grid"

# Check the Selenium Grid Router service
kubectl get svc selenium-grid-selenium-hub

# View Grid status (after port-forwarding)
kubectl port-forward svc/selenium-grid-selenium-hub 4444:4444 &
# Then open http://localhost:4444 in your browser
```

---

## Step 4 — Configure SHAFT to Use the Kubernetes Grid

Once the Grid is deployed, point SHAFT to the Kubernetes service endpoint.

<Tabs groupId="configMethod">
  <TabItem value="file" label="File-based">

```properties title="src/main/resources/properties/custom.properties"
# Use the Kubernetes service DNS name (inside cluster)
executionAddress=selenium-grid-selenium-hub.default.svc.cluster.local:4444
targetOperatingSystem=Linux
targetBrowserName=chrome
```

  </TabItem>
  <TabItem value="cli" label="CLI-based">

```bash
# Run tests from inside the cluster (CI/CD pod)
mvn test \
  -DexecutionAddress=selenium-grid-selenium-hub.default.svc.cluster.local:4444 \
  -DtargetOperatingSystem=Linux \
  -DtargetBrowserName=chrome
```

  </TabItem>
  <TabItem value="code" label="Code-based">

```java title="KubernetesGridSetup.java"
import com.shaft.driver.SHAFT;
import org.openqa.selenium.remote.Browser;

@BeforeClass
public void configureGrid() {
    SHAFT.Properties.platform.set()
        .executionAddress("selenium-grid-selenium-hub.default.svc.cluster.local:4444")
        .targetPlatform("Linux");

    SHAFT.Properties.web.set()
        .targetBrowserName(Browser.CHROME.browserName());
}
```

  </TabItem>
</Tabs>

:::tip Accessing the Grid from Outside the Cluster
If your tests run **outside** the Kubernetes cluster (e.g., on a developer laptop), use `kubectl port-forward` or expose the Grid via a `LoadBalancer` / `NodePort` service and use the external IP/hostname instead.

```bash
# Port-forward for local access
kubectl port-forward svc/selenium-grid-selenium-hub 4444:4444
```

Then configure SHAFT with `executionAddress=localhost:4444`.
:::

---

## Customizing the Deployment

### Set Browser-Specific Scaling Limits

```bash
helm upgrade selenium-grid docker-selenium/selenium-grid \
  --set autoscaling.enabled=true \
  --set autoscaling.scaledOptions.minReplicaCount=0 \
  --set autoscaling.scaledOptions.maxReplicaCount=8 \
  --set chromeNode.replicas=0 \
  --set chromeNode.maxReplicaCount=5 \
  --set firefoxNode.replicas=0 \
  --set firefoxNode.maxReplicaCount=3
```

### Deploy in a Dedicated Namespace

```bash
helm install selenium-grid docker-selenium/selenium-grid \
  --namespace selenium \
  --create-namespace \
  --set autoscaling.enabled=true \
  --set autoscaling.scaledOptions.minReplicaCount=0 \
  --set autoscaling.scaledOptions.maxReplicaCount=8
```

Then update your `executionAddress` to use the namespace-qualified DNS:

```properties
executionAddress=selenium-grid-selenium-hub.selenium.svc.cluster.local:4444
```

### Use a Custom `values.yaml` File

For production deployments, create a `values.yaml` to version-control your Grid configuration:

```yaml title="selenium-grid-values.yaml"
autoscaling:
  enabled: true
  scaledOptions:
    minReplicaCount: 0
    maxReplicaCount: 10
    pollingInterval: 10

chromeNode:
  replicas: 0
  maxReplicaCount: 8
  resources:
    requests:
      memory: "1Gi"
      cpu: "500m"
    limits:
      memory: "2Gi"
      cpu: "1000m"

firefoxNode:
  replicas: 0
  maxReplicaCount: 4

hubConfigMap:
  SE_SESSION_REQUEST_TIMEOUT: "300"
  SE_SESSION_RETRY_INTERVAL: "5"
```

```bash
helm install selenium-grid docker-selenium/selenium-grid \
  --namespace selenium \
  --create-namespace \
  -f selenium-grid-values.yaml
```

---

## Integrating with CI/CD

### GitHub Actions Example

```yaml title=".github/workflows/test.yml"
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up kubectl
        uses: azure/setup-kubectl@v3

      - name: Configure kubeconfig
        run: echo "${{ secrets.KUBECONFIG }}" > ~/.kube/config

      - name: Run SHAFT tests against Kubernetes Grid
        run: |
          mvn test \
            -DexecutionAddress=selenium-grid-selenium-hub.selenium.svc.cluster.local:4444 \
            -DtargetOperatingSystem=Linux \
            -DtargetBrowserName=chrome \
            -DheadlessExecution=true
```

---

## Monitoring and Scaling Behavior

### Watch Nodes Scale During a Test Run

Open two terminals:

```bash
# Terminal 1: Watch pod count change as tests run
kubectl get pods --selector="app.kubernetes.io/name=selenium-grid" --watch

# Terminal 2: Run your tests
mvn test
```

You will see browser node pods appear as the Grid accepts sessions and disappear when they become idle.

### View KEDA ScaledObjects

```bash
kubectl get scaledobjects
kubectl describe scaledobject selenium-grid-chrome-node-scaledobject
```

---

## Teardown

```bash
# Remove the Selenium Grid
helm uninstall selenium-grid

# Remove KEDA (optional)
helm uninstall keda --namespace keda
kubectl delete namespace keda
```

---

## Best Practices

- **Scale from zero** — keep `minReplicaCount=0` to avoid paying for idle browser nodes.
- **Set resource requests and limits** — browser containers are memory-intensive; always set Kubernetes resource limits to prevent node pressure.
- **Use a dedicated namespace** — isolate the Grid from other workloads for easier management and cleanup.
- **Store `values.yaml` in version control** — treat your Grid configuration as code alongside your tests.
- **Use Kubernetes Secrets for credentials** — if your Grid is behind authentication, store credentials in Kubernetes Secrets and reference them via SHAFT properties.
- **Monitor with KEDA metrics** — configure KEDA's `pollingInterval` and `cooldownPeriod` based on your average test session duration for optimal scaling responsiveness.

---

## Related Pages

- [Local Selenium Grid Execution](./Local_Selenium_Grid_Execution.md) — Set up a Docker Compose or standalone Grid for local development.
- [Custom Capabilities](./Custom_Capabilities.md) — Pass custom browser capabilities to the Grid.
- [Parallel Execution](../../../Basic_Config/parallelExecution.md) — Configure SHAFT for parallel test execution.
- [Properties List](../../../Properties/PropertiesList.mdx) — Full reference for all SHAFT platform and execution properties.
