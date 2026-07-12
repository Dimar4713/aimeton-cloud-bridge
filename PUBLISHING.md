# Publishing AIMETON Cloud Bridge

The legacy pull-request workflow in `obsidianmd/obsidian-releases` was replaced in May 2026. New submissions are made through the Obsidian Community developer dashboard.

## 1. Publish the source repository

Create a public GitHub repository:

```text
Dimar4713/aimeton-cloud-bridge
```

Push this repository to the `main` branch. Do not commit `data.json`, OAuth tokens, proxy passwords, or test credentials.

## 2. Validate the repository

Run:

```bash
npm run build
npm run check
```

The build-generated `main.js` must match `src/main.js`. The generated bundle is attached to releases and is not tracked in the source repository.

## 3. Run a preview scan

Sign in to the Obsidian Community site, open the developer dashboard, connect the GitHub account, select this repository, and run a preview scan against the `main` branch before creating the public release.

Resolve required errors before publishing the release. Warnings should be reviewed and documented.

## 4. Create the GitHub release

The release tag and title must exactly match the version in `manifest.json`:

```text
1.0.3
```

Do not use a `v` prefix.

The release must contain these files as individual assets:

```text
main.js
manifest.json
styles.css
```

Pushing the exact tag starts the included release workflow:

```bash
git tag 1.0.3
git push origin 1.0.3
```

## 5. Submit through the Community developer dashboard

In the dashboard:

1. Choose the public GitHub repository.
2. Select the plugin project type.
3. Confirm the release and repository metadata.
4. Add categories, screenshots, pricing classification, and required disclosures.
5. Submit the project for automated review.

Recommended classification:

- Pricing: **Optional payments**, because the plugin connects to an external service that offers paid plans, even though the plugin itself is free and the service has a free tier.
- Primary category: **Integrations**.
- Secondary category: choose the closest available file-management or cloud-storage category.

Recommended disclosures:

- Network access: Yandex Disk API and file endpoints.
- Local file access: selected uploads and requested downloads inside the vault.
- Credentials: user-provided OAuth token and optional proxy credentials stored locally in `data.json` in version 1.0.3.
- Proxy support: optional user-configured desktop proxy.
- Analytics: none.
- Author-controlled backend: none.

## 6. Review result

The dashboard normally returns automated review results within minutes. A passing project is typically searchable and downloadable in the app within 24 hours.

## 7. Future versions

Update `manifest.json`, `package.json`, `versions.json`, `CHANGELOG.md`, and release notes. Create a GitHub release whose tag exactly matches the new version. Each new version is automatically reviewed.
