# AIMETON Cloud Bridge

A community plugin that lets users browse and transfer files between a vault and Yandex Disk.

## Features

- Browse Yandex Disk folders from a dedicated panel.
- Upload files from the vault to Yandex Disk.
- Download remote files into the vault.
- Preview supported images.
- Show transfer progress.
- Russian and English interface.
- Light, dark, and system theme compatibility.
- Desktop manual proxy support: HTTP CONNECT, HTTPS CONNECT, and SOCKS5.
- Mobile networking through the system connection, VPN, or TUN.

## Tested release

Version **1.0.2** was acceptance-tested on the following platforms. Version **1.0.5** keeps the same transfer and network core and adds an in-settings OAuth token guide:

- Android: startup, upload, download, image preview, English UI, dark theme.
- Desktop with system networking: Russian and English UI, upload, download, preview, light, dark, and system themes.
- Desktop with manual proxy: HTTP CONNECT and SOCKS5.

## Installation from a release

The source repository does not track the generated `main.js`. Copy these files from the matching GitHub release into:

```text
<Vault>/.obsidian/plugins/aimeton-cloud-bridge/
```

Required files:

- `main.js`
- `manifest.json`
- `styles.css`

The file path must be exactly:

```text
<Vault>/.obsidian/plugins/aimeton-cloud-bridge/main.js
```

## Authentication and local storage

The plugin uses an OAuth token supplied by the user. In version 1.0.5, the OAuth token and optional proxy password are stored locally in the plugin's `data.json`. Do not publish, commit, or share that file. Protect access to the vault configuration directory and device account.

The plugin settings include a collapsible **How to get an OAuth token** guide with links to the official Yandex Disk API Polygon and Yandex OAuth documentation.

## Privacy

The plugin has no author-controlled backend and does not collect analytics or telemetry. See [PRIVACY.md](PRIVACY.md).

## Independence notice

This is an independent community project. It is not affiliated with, endorsed by, sponsored by, or supported by Yandex LLC or Dynalist Inc. See [NOTICE.md](NOTICE.md).

## License and authorship

Created and maintained by **Dimar4713** as part of the AIMETON ecosystem.

Copyright © 2026 **Dmitry Marareskul**.

Licensed under the [MIT License](LICENSE).
