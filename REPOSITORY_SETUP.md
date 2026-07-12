# Repository setup

## Requirements

- Git installed.
- GitHub account `Dimar4713`.
- Node.js 18 or newer for local checks.
- An Obsidian account for the Community developer dashboard.

## Create the GitHub repository

Create an empty public repository named:

```text
aimeton-cloud-bridge
```

Do not initialize it with another README, license, or `.gitignore`.

## Push from PowerShell

Open PowerShell in this project folder and run:

```powershell
git init
git branch -M main
git add .
git commit -m "Initial public release candidate 1.0.3"
git remote add origin https://github.com/Dimar4713/aimeton-cloud-bridge.git
git push -u origin main
```

## Validate

```powershell
npm run build
npm run check
git status
```

`git status` should show a clean working tree after the build and checks.

## Next step

Connect the repository in the Obsidian Community developer dashboard and run a preview scan on `main`. Create the `1.0.3` release only after required scan errors are resolved.
