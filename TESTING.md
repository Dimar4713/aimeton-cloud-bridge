# Acceptance testing — version 1.0.2

## Android

Verified:

- plugin startup;
- upload to Yandex Disk;
- download to vault;
- image preview;
- English interface;
- dark theme.

## Desktop — system network

Verified:

- Russian and English interface;
- upload and download;
- image preview;
- light, dark, and system themes.

## Desktop — manual proxy

Verified:

- HTTP CONNECT;
- SOCKS5.

Not independently verified:

- HTTPS CONNECT to a proxy endpoint that itself requires TLS;
- macOS, Linux, and iOS.

## Version 1.0.3 regression scope

Version 1.0.3 keeps the accepted 1.0.2 transfer and network core unchanged. The release adds only the collapsible OAuth-token guide in settings. Before release, verify on Android and desktop that:

- the help block expands and collapses by tap/click;
- Russian and English text switch correctly;
- both official Yandex links open externally;
- the OAuth input and connection test still work.
## 1.0.4 regression check

- Trigger a download/network failure on Android.
- Verify the red operation banner appears.
- Verify the `×` button dismisses it.
- Verify tapping the error banner dismisses it.
- Verify it auto-hides after approximately 12 seconds if untouched.


## 1.0.5 deletion refresh regression

1. Open a folder containing at least two files on Android and desktop.
2. Delete one file and confirm the action.
3. Verify the deleted row disappears immediately.
4. Verify the refreshed list does not contain the deleted file.
5. Confirm another item can still be opened or deleted without receiving a stale HTTP 404.
6. Repeat with list caching enabled and with a folder deletion.
