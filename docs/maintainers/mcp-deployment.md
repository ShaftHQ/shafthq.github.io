---
id: mcp-deployment
title: MCP publication and deployment
description: Build, publish, and optionally host the SHAFT MCP server.
slug: /maintainers/mcp-deployment
sidebar_position: 8
tags: [maintainers, mcp, deployment]
---

# MCP publication and deployment

The supported public distribution channels are Maven Central, GHCR, and the
MCP Registry. Deployment templates do not imply that a SHAFT-hosted HTTP
endpoint is active.

## Local container check

Run from the SHAFT_ENGINE repository root:

```bash
docker build -f shaft-mcp/Dockerfile.smithery.build -t shaft-mcp-http .
docker run --rm -p 8081:8081 shaft-mcp-http
```

Connect an MCP client to `http://localhost:8081/mcp`.

## Publication flow

1. The Maven Central workflow publishes `io.github.shafthq:shaft-mcp` with the
   complete reactor.
2. `publish-shaft-mcp.yml` pushes
   `ghcr.io/shafthq/shaft-engine-mcp:<version>` and `latest`.
3. The workflow renders `shaft-mcp/server.json`, validates it against the MCP
   Registry schema, and publishes it with GitHub OIDC.
4. `deploy-shaft-mcp.yml` invokes configured Render and Fly.io integrations and
   records the Smithery handoff. Missing external configuration is an explicit
   no-op.

All container builds use the repository root as their build context, keeping
the MCP server aligned with the canonical `shaft-engine` dependency.

## Optional hosted deployments

Hosted deployments use Streamable HTTP at `/mcp` with
`SPRING_PROFILES_ACTIVE=http`. The server defaults to port `8081`; platforms
may override it through `PORT`.

- **Smithery:** connect the `ShaftHQ/SHAFT_ENGINE` repository. The root
  `smithery.yaml` selects `shaft-mcp/Dockerfile.smithery.build`.
- **Render:** the root `render.yaml` selects `shaft-mcp/Dockerfile.render`.
  Releases call `RENDER_DEPLOY_HOOK_URL` only when configured.
- **Fly.io:** deploy from the repository root:

```bash
flyctl deploy --remote-only --config shaft-mcp/fly.toml
```

Do not advertise a hosted endpoint until its external integration and secrets
are configured and its `/mcp` endpoint passes initialization.
