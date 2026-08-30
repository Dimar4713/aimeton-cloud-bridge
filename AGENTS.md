# AGENTS.md — AIMETON Cloud Bridge

## Scope

These rules apply to the whole `aimeton-cloud-bridge` repository. Narrower `AGENTS.md` files may strengthen but never weaken them.

Canonical AIMETON-wide governance: `Dimar4713/aimeton-architecture/AGENTS.md`.

This repository contains a released cross-platform community plugin, so public compatibility, privacy and release invariants take precedence over convenience.

## Before work

1. Read `README.md`, manifest/package metadata, release/compatibility docs, active Issues/PR/CI and the exact current branch SHA.
2. For cross-repository work, read the root `AGENTS.md` of every touched AIMETON repository before the first mutation.
3. For infrastructure/proxy/network reality use `aimeton-infrastructure`; for normative AIMETON decisions use `aimeton-architecture`.
4. Do not treat one platform, proxy, token, device or UI observation as the complete runtime truth.

## 3×3 Reality Check

Before a blocker, root-cause, compatibility claim, network/security conclusion, release decision or consequential write, treat the first explanation as a hypothesis.

Check architecture/lifecycle, alternatives/control paths, history/live; source/contract, runtime/live, independent evidence; perform a falsification attempt.

Claims such as `no access`, `network impossible`, `only path`, `mobile unsupported`, or `release ready` are provisional until this gate is complete.

## GitHub / execution fallback

Before asking the owner for a manual GitHub action, check:

`GitHub connector/API → AIMETON GitHub MCP/router → REST/GraphQL/gh through trusted AIMETON server → owner`.

A limitation of one connector/token/workflow does not prove a system-level AIMETON limitation. Never expose secret values; reuse existing AIMETON auth/secret contracts before proposing new ones.

## Continuous Mission / Motor State

```text
READ → DECIDE → ACTION → READ-BACK → EVIDENCE → NEXT SAFE ACTION
```

After every material action, verify the actual result and execute the next safe unambiguous step unless an objective authority blocker exists. Absence of a new owner message is not a blocker.

Maintain current → next → following actions. Before ending a tool session perform MOTOR-CHECK and STOP-CHECK. A GREEN build, PR or local smoke is a state transition, not necessarily mission completion.

## Non-negotiable plugin rules

1. Keep the plugin ID `aimeton-cloud-bridge` stable after public release.
2. Never commit OAuth tokens, proxy passwords, private Yandex Disk URLs, or vault data.
3. Keep OAuth and proxy-password values in SecretStorage; `data.json` may store only secret names.
4. Manual proxy mode is strict: do not add a direct or system-network fallback.
5. Node.js networking modules may execute only in desktop runtime paths.
6. Mobile runtime must use the host application's `requestUrl` and system network stack.
7. Do not use `innerHTML`, `style.cssText`, or direct `.style.*` assignments. Use DOM creation APIs, CSS classes, and `setCssProps` for dynamic values.
8. All user-visible strings must exist in both Russian and English dictionaries.
9. Preserve migration from `.obsidian/plugins/yandex-disk-explorer/data.json` until maintainers explicitly deprecate it.
10. Run `npm run build` and `npm run check` before committing/releasing applicable changes.

## Network / source-of-truth boundary

Proxy/network infrastructure facts belong to `aimeton-infrastructure`; this plugin owns only its client-side proxy/network contract and observed compatibility.

Do not copy mutable infrastructure state into this repository as an independent source of truth. A generated cross-repo projection must pin canonical repository, exact source SHA, source path, immutable blob/object id and/or digest; drift must fail closed.

One failed network route must trigger search for existing permitted AIMETON control paths before declaring a blocker. Do not silently weaken strict manual proxy semantics as a workaround.

## Release files

A GitHub release must attach exactly the generated files required by the current plugin release contract:

- `main.js`
- `manifest.json`
- `styles.css`

The Git tag must exactly match `manifest.json.version` and must not include a `v` prefix.

Release readiness requires source/build checks plus read-back of tag/version/assets; creating a tag or GREEN CI alone is insufficient evidence.

## Documentation / project truth

Clearly distinguish planned, implemented, observed and verified state. Material architecture, compatibility, privacy, migration or release changes must be reflected in the existing documentation in the same PR.

Chat, an Issue or a PR by itself is not a canonical factual update when the project image changed.

## Authority boundary

Without owner authorization do not create new paid resources, weaken privacy/security, expose credentials/private vault data, make irreversible production/provider changes, or alter legal/license/public-release invariants.

## Definition of Done

Applicable items are mandatory:

- source and tests/build checks updated;
- desktop/mobile compatibility claims backed by actual evidence;
- release metadata/assets verified when releasing;
- privacy/proxy invariants preserved;
- docs/status synchronized;
- cross-repo provenance/drift checked;
- next safe action executed or exact blocker recorded;
- strong conclusions passed 3×3.
