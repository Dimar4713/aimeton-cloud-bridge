# Changelog

## 1.0.5

- Fixed stale directory listings after deleting a file or folder.
- The directory cache is now invalidated before refresh after delete, create, move, and copy operations.
- Deleted rows are removed immediately from the current view, preventing a second delete attempt from producing HTTP 404.
- Directory reloads after mutating operations are now awaited.

## 1.0.4

- Added a dedicated dismiss button for the operation/error banner on mobile and desktop.
- Error banners can also be dismissed by tapping the banner.
- Failed operation banners now auto-hide after 12 seconds.
- Fixed a mobile UI issue where download errors could remain permanently visible.

## 1.0.3

- Added a collapsible OAuth-token help section to plugin settings.
- Added Russian and English step-by-step instructions.
- Added links to the official Yandex Disk API Polygon and Yandex OAuth documentation.
- Kept the verified 1.0.2 transfer and network core unchanged.

## 1.0.2

- Mobile compatibility rollback to the verified universal core.
- Safe startup if plugin data is incompatible.
- SecretStorage integration postponed until after cross-device validation.


## 1.0.1 - 2026-07-01

### Fixed
- Restored compatibility with Obsidian mobile 1.5.0 and newer.
- Added runtime fallbacks when SecretStorage, SecretComponent, or setCssProps are unavailable.
- Older Obsidian versions now use password fields and local data.json storage with an explicit warning.
- Current Obsidian 1.11.4+ continues to migrate OAuth and proxy secrets into SecretStorage.


All notable changes are documented here. The project follows Semantic Versioning.

## [1.0.0] - 2026-06-30

### Added

- New public product name and plugin ID: **AIMETON Cloud Bridge** / `aimeton-cloud-bridge`.
- Russian and English interface with live language switching.
- Desktop and mobile file browsing for Yandex Disk.
- Image preview with fallback to a fresh download URL.
- Download and upload progress indication.
- Strict desktop HTTP CONNECT, HTTPS CONNECT, and SOCKS5 proxy modes.
- Mobile routing through the host application's system network/VPN/TUN.
- SecretStorage support for OAuth tokens and proxy passwords.
- Automatic import of settings from the legacy `yandex-disk-explorer` plugin folder.
- Publication, privacy, security, and release documentation.

### Changed

- Moved runtime styling to `styles.css`.
- Removed dynamic `innerHTML`, inline `cssText`, and debug console output from the distributed code.

### Security

- Plaintext OAuth and proxy-password values are migrated to SecretStorage when upgrading from the legacy plugin.
