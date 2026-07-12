# Security Policy

## Supported versions

Security fixes are provided for the latest published release.

## Reporting a vulnerability

Please do not publish tokens, proxy credentials, private file links, or exploit details in a public issue.

Preferred reporting method:

1. Open the repository's **Security** tab.
2. Choose **Report a vulnerability** to create a private security advisory.
3. Include the plugin version, platform, reproduction steps, and expected impact.

If private vulnerability reporting is not yet enabled, open a public issue containing no sensitive details and ask the maintainer to establish a private channel.

## Secret handling

- OAuth tokens and proxy passwords are referenced through Obsidian SecretStorage.
- `data.json`, `.env`, vault configuration, test credentials, and downloaded private files must never be committed.
- Previously exposed credentials must be revoked rather than merely removed from Git history.
