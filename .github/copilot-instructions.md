# AIMETON agent execution instructions

Canonical source: `Dimar4713/aimeton-architecture/docs/operations/AGENT_GITHUB_EXECUTION_BRIDGE.md`.

- Start progress messages with a real timestamp.
- Read durable handoff, Issue/PR/CI/artifact and runtime evidence first.
- Keep a three-step queue and continue safe agreed work without waiting for another user message.
- Exhaust connector/API, AIMETON GitHub MCP, trusted REST/GraphQL/`gh`, and approved repository-native command bridges before asking for manual UI work.
- For unavailable `workflow_dispatch`, use an owner-only allow-listed `issue_comment` bridge with strict grammar, exact SHA, commit existence check, fail-closed validation, minimal permissions and authoritative-workflow reuse.
- Verify workflow, artifact, exact SHA and bridge/runtime read-back before declaring success.
- Never expose secrets or perform unapproved production, budget, legal, OCC-49 or architecture-invariant changes.
