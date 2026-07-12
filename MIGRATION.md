# Migration from Yandex Disk Explorer

The public plugin uses a new identity:

```text
Old ID: yandex-disk-explorer
New ID: aimeton-cloud-bridge
```

Because plugin settings are stored under the plugin ID, the new plugin performs a one-time import.

## Recommended procedure

1. Update the old plugin to version 1.4.1 and verify that it works.
2. Close the explorer panel.
3. Disable **Yandex Disk Explorer**.
4. Install **AIMETON Cloud Bridge** into:

   ```text
   .obsidian/plugins/aimeton-cloud-bridge/
   ```

5. Enable AIMETON Cloud Bridge.
6. Open settings and verify:
   - language;
   - root path;
   - download folder;
   - network mode;
   - proxy host, port, and username;
   - OAuth and proxy-password secrets.
7. Test connection, preview, download, and upload.
8. After verification, delete or archive:

   ```text
   .obsidian/plugins/yandex-disk-explorer/
   ```

## What is imported

- language;
- root path;
- page size and sorting;
- upload/download preferences;
- download folder;
- cache duration;
- proxy type, host, port, username, and mode;
- OAuth token;
- proxy password.

Plaintext OAuth and proxy-password values are copied into Obsidian SecretStorage. The new `data.json` contains only secret names, not secret values.

## Safety notes

- The old folder is never deleted automatically.
- Keep a backup until the new plugin has been tested.
- If the old OAuth token was ever published, revoke it and create a new one; migration does not make an exposed token safe again.
- Do not run both plugin IDs simultaneously because they can open duplicate panels and perform overlapping operations.
