# Release Guide

## Quick Reference

### Commit Message Format

```text
<type>(<scope>): <subject>

<body>

<footer>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

### Version Bump Rules

- `BREAKING CHANGE:` -> MAJOR (`1.0.0` -> `2.0.0`)
- `feat:` -> MINOR (`1.0.0` -> `1.1.0`)
- `fix:` -> PATCH (`1.0.0` -> `1.0.1`)

If a commit includes `BREAKING CHANGE:`, it triggers a MAJOR bump even when the type is `feat` or `fix`.

## Correct Release Flow (Protected `main`)

This repository protects `main`, so releases are created with a PR workflow.

### Step-by-step

```bash
# 1) Ensure main is up to date
git checkout main
git pull origin main

# 2) Create release branch
git checkout -b release/vX.Y.Z

# 3) Run release automation
# - runs pre-release checks
# - bumps package.json version
# - updates CHANGELOG.md
# - syncs app.json version/build numbers
# - creates a release commit
# - does NOT create/push tag yet
npm run release

# 4) Review release commit
git log --oneline -5
git show

# 5) Push release branch and open PR to main
git push -u origin release/vX.Y.Z
# PR: release/vX.Y.Z -> main

# 6) After PR merge, tag from latest main
git checkout main
git pull origin main
git tag -a vX.Y.Z -m "chore(release): vX.Y.Z"
git push origin vX.Y.Z
```

### Why this is correct

- `main` stays protected (no direct pushes).
- Release changes still go through review and checks.
- Tag points to the final commit on `main`.

## Manual Version Bumps (No Full Release)

```bash
npm run version:patch
npm run version:minor
npm run version:major
```

These sync `package.json` and `app.json`, but do not update `CHANGELOG.md` like full release flow.

## Best Practices Checklist

### Before release

- [ ] `stage` has already been promoted to `main`
- [ ] Working tree is clean (`git status`)
- [ ] Commits follow Conventional Commits
- [ ] Lint/checks pass
- [ ] You are releasing from a `release/*` branch

### After release PR merge

- [ ] Tag created from latest `main`
- [ ] Tag pushed (`git push origin vX.Y.Z`)
- [ ] Optional GitHub Release created from tag

## Troubleshooting

### Commit message rejected

- Use `npm run commit` for guided Conventional Commit format.
- Ensure header and body lengths follow project limits.

### Version sync issue

```bash
node scripts/version-sync.js
```

### Release script fails

1. Check `git status` for uncommitted changes.
2. Confirm you are on `main` or `release/*`.
3. Run `npm run pre-release` for detailed failures.
4. Verify recent commits are conventional.

## Additional Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- See `CONTRIBUTING.md` for team workflow

## Optional: Create GitHub Release From Tag

A Git tag (`vX.Y.Z`) is the version marker in Git history. A GitHub Release is a published release page that points to that tag and includes release notes.

### Option A: GitHub UI

1. Go to your repository on GitHub.
2. Open **Releases**.
3. Click **Draft a new release**.
4. Select existing tag `vX.Y.Z`.
5. Set title to `vX.Y.Z`.
6. Paste release notes (usually from `CHANGELOG.md`).
7. Click **Publish release**.

### Option B: GitHub CLI (optional)

```bash
gh release create vX.Y.Z --title "vX.Y.Z" --notes-file CHANGELOG.md
```

Use this only after the tag is already pushed (`git push origin vX.Y.Z`).
