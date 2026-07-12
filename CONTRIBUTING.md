# Contributing

Thank you for helping improve AIMETON Cloud Bridge.

## Development workflow

1. Fork and clone the repository.
2. Use Node.js 18 or newer.
3. Run `npm run build`.
4. Install the repository folder as `.obsidian/plugins/aimeton-cloud-bridge/` in a test vault.
5. Test both interface languages and all affected platforms.
6. Run `npm run check` before opening a pull request.

## Pull requests

- Keep changes focused.
- Do not commit credentials, vault data, `data.json`, or private Yandex Disk links.
- Add user-facing changes to `CHANGELOG.md`.
- Preserve mobile compatibility: Node.js networking modules may only execute on desktop.
- Preserve strict proxy behavior: manual proxy mode must never fall back to a direct request.
- Prefer DOM creation APIs and CSS classes over `innerHTML` or inline style assignments.

By contributing, you agree that your contribution is licensed under the MIT License.
