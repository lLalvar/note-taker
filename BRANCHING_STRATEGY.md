# Branching Strategy Guide

## 🌿 Branch Overview

This project uses a three-branch workflow:

- **`dev`** - Development branch (daily feature and fix work)
- **`stage`** - Staging branch (QA and pre-production validation)
- **`main`** - Production branch (protected and PR-only)

## 📊 Branch Flow

```text
feature/* -> dev -> stage -> main -> release/*
```

Notes:

- `main` is protected and should only be updated via pull requests.
- Promotion between long-lived branches is also done via pull requests.

## 🔄 Standard Workflow

### 1) Development (`dev`)

```bash
git checkout dev
git pull origin dev
git checkout -b feature/my-feature
# ... make changes ...
git add .
npm run commit
git push -u origin feature/my-feature
# Open PR: feature/my-feature -> dev
```

Rules:

- ✅ Start all features/fixes from `dev`
- ✅ Keep commits small and conventional
- ✅ Use PRs into `dev`
- ❌ Do not run releases from `dev`

### 2) Staging Promotion (`dev` -> `stage`)

```bash
git checkout dev
git pull origin dev
git checkout -b promote/dev-to-stage
git push -u origin promote/dev-to-stage
# Open PR: promote/dev-to-stage -> stage
```

Rules:

- ✅ Promote tested `dev` content into `stage` by PR
- ✅ Validate QA/UAT on `stage`
- ❌ Do not add unrelated feature work directly on `stage`

### 3) Production Promotion (`stage` -> `main`)

```bash
git checkout stage
git pull origin stage
git checkout -b promote/stage-to-main
git push -u origin promote/stage-to-main
# Open PR: promote/stage-to-main -> main
```

Rules:

- ✅ Only promote to `main` from `stage`
- ✅ Require review + status checks
- ❌ Never push directly to `main`

## 🚀 Release Process (Protected `main`)

Because `main` is protected, release commits are prepared on a release branch and merged by PR.

```bash
# 1) Start from latest main
git checkout main
git pull origin main

# 2) Create release branch
git checkout -b release/vX.Y.Z

# 3) Create release commit (version + changelog)
npm run release

# 4) Push release branch and open PR to main
git push -u origin release/vX.Y.Z
# Open PR: release/vX.Y.Z -> main

# 5) After PR merge, create/push tag from updated main
git checkout main
git pull origin main
git tag -a vX.Y.Z -m "chore(release): vX.Y.Z"
git push origin vX.Y.Z
```

Important:

- `npm run release` now prepares the release commit but does **not** create the tag.
- Tag only after the release PR is merged to keep tag and `main` aligned.

## 🔥 Hotfix Flow

```bash
# 1) Branch from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug

# 2) Fix and commit
git add .
npm run commit
git push -u origin hotfix/critical-bug

# 3) Open PR to main and merge after review
# Open PR: hotfix/critical-bug -> main

# 4) Back-merge hotfix to dev and stage via PRs
# Open PR: hotfix/critical-bug -> dev
# Open PR: hotfix/critical-bug -> stage
```

## 📋 Branch Protection Recommendations

### `main` (strict)

- ✅ Require pull request before merging
- ✅ Require at least 1 approval
- ✅ Require status checks
- ✅ Require branches to be up to date
- ✅ Include administrators
- ✅ Block force pushes
- ✅ Do not allow bypassing rules

### `stage` (moderate)

- ✅ Require pull request before merging
- ✅ Require status checks
- ✅ Require branches to be up to date
- ❌ Do not force push (recommended)

### `dev` (flexible but safe)

- ✅ Prefer PRs
- ✅ Require status checks if possible
- ⚠️ Direct pushes can be allowed for fast iteration if needed

## 📝 Branch Naming

- `feature/name` - New features
- `fix/name` - Bug fixes
- `hotfix/name` - Critical production fixes
- `release/vX.Y.Z` - Release preparation branch
- `promote/dev-to-stage` - Promotion PR branch
- `promote/stage-to-main` - Promotion PR branch

## ✅ Best Practices

1. Use pull requests for all promotions.
2. Keep flow forward-only: `dev` -> `stage` -> `main`.
3. Run QA on `stage` before promoting to `main`.
4. Never push directly to `main`.
5. Create tags only from merged `main` release commits.
6. Keep commit messages conventional and descriptive.

## 🚨 Common Mistakes

1. Direct push to `main`
2. Skipping `stage` promotion
3. Running releases from `dev` or `stage`
4. Creating tags before release PR merge
5. Mixing feature work into promotion/release branches

## 📚 Additional Resources

- See `RELEASE_GUIDE.md` for release details
- See `CONTRIBUTING.md` for commit rules
- See `VERSIONING.md` for SemVer behavior
