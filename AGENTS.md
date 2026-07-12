# Agent instructions

This repository contains a cross-platform community plugin.

## Non-negotiable rules

1. Keep the plugin ID `aimeton-cloud-bridge` stable after public release.
2. Never commit OAuth tokens, proxy passwords, private Yandex Disk URLs, or vault data.
3. Keep OAuth and proxy-password values in SecretStorage; `data.json` may store only secret names.
4. Manual proxy mode is strict: do not add a direct or system-network fallback.
5. Node.js networking modules may execute only in desktop runtime paths.
6. Mobile runtime must use the host application's `requestUrl` and system network stack.
7. Do not use `innerHTML`, `style.cssText`, or direct `.style.*` assignments. Use DOM creation APIs, CSS classes, and `setCssProps` for dynamic values.
8. All user-visible strings must exist in both Russian and English dictionaries.
9. Preserve migration from `.obsidian/plugins/yandex-disk-explorer/data.json` until maintainers explicitly deprecate it.
10. Run `npm run build` and `npm run check` before committing.

## Release files

A GitHub release must attach exactly the current generated files:

- `main.js`
- `manifest.json`
- `styles.css`

The Git tag must exactly match `manifest.json.version` and must not include a `v` prefix.
