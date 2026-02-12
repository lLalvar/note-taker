# Branching Quick Reference

## 🌿 Branches

- **`dev`** - Development (active work)
- **`stage`** - Staging/testing (pre-production)
- **`main`** - Production (protected, PR-only)

## 🔄 Daily Workflow (PR-Only)

### 1) Work on Features

```bash
git checkout dev
git pull origin dev
git checkout -b feature/my-feature
# ... make changes ...
npm run commit
git push -u origin feature/my-feature
# Open PR: feature/my-feature -> dev
```

### 2) Promote to Stage

```bash
git checkout dev
git pull origin dev
git checkout -b promote/dev-to-stage
git push -u origin promote/dev-to-stage
# Open PR: promote/dev-to-stage -> stage
```

### 3) Promote to Main

```bash
git checkout stage
git pull origin stage
git checkout -b promote/stage-to-main
git push -u origin promote/stage-to-main
# Open PR: promote/stage-to-main -> main
```

## 🚀 Release (Protected Main)

```bash
# Start from latest main after promotion PR is merged
git checkout main
git pull origin main
git checkout -b release/vX.Y.Z

# Bump version + changelog + release commit (no tag yet)
npm run release

git push -u origin release/vX.Y.Z
# Open PR: release/vX.Y.Z -> main

# After PR merge:
git checkout main
git pull origin main
git tag -a vX.Y.Z -m "chore(release): vX.Y.Z"
git push origin vX.Y.Z
```

## 🚨 Important Rules

- ✅ Use PRs for all protected branches (`stage`, `main`)
- ✅ Develop from `dev`, test on `stage`, release from `main`
- ✅ Run `npm run release` only on `release/*` branches
- ❌ Never commit directly to `main`
- ❌ Never push directly to `main`
- ❌ Never skip promotion (`dev` -> `stage` -> `main`)

## 📚 Full Guide

See `BRANCHING_STRATEGY.md` for complete details.
