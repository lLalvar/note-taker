# Branching Strategy Guide

## 🌿 Branch Overview

This project uses a three-branch workflow:

- **`dev`** - Development branch (where all new work happens)
- **`stage`** - Staging/testing branch (pre-production testing)
- **`main`** - Production branch (released code)

## 📊 Branch Flow

```
dev → stage → main
 ↑      ↑      ↑
 │      │      │
 │      │      └─ Production releases
 │      └─ Pre-production testing
 └─ Active development
```

## 🔄 Workflow

### 1. Development (`dev` branch)

**Purpose**: Active development, feature work, bug fixes

**Workflow**:

```bash
# Start working on dev branch
git checkout dev
git pull origin dev

# Create feature branch from dev
git checkout -b feature/my-feature

# Make changes and commit
git add .
npm run commit  # or git commit -m "feat: ..."

# Push feature branch
git push origin feature/my-feature

# Create PR: feature/my-feature → dev
# After PR approval, merge to dev
```

**Rules**:

- ✅ All new features start here
- ✅ All bug fixes start here
- ✅ Commit often with conventional commits
- ✅ Create feature branches from `dev`
- ❌ Don't run releases here

### 2. Staging (`stage` branch)

**Purpose**: Pre-production testing, QA, final validation

**Workflow**:

```bash
# When dev is stable, merge to stage
git checkout stage
git pull origin stage
git merge dev
git push origin stage

# Test on stage environment
# Fix any issues found during testing
# Merge fixes back to dev first, then to stage
```

**Rules**:

- ✅ Merge from `dev` when features are ready for testing
- ✅ Use for QA and pre-production validation
- ✅ Fix critical bugs found during testing
- ❌ Don't develop new features here
- ❌ Don't run releases here

### 3. Production (`main` branch)

**Purpose**: Production-ready, released code

**Workflow**:

```bash
# When stage is tested and approved, release to main
git checkout main
git pull origin main
git merge stage

# Create release
npm run release

# Push release
git push --follow-tags origin main
```

**Rules**:

- ✅ Only merge from `stage` after testing
- ✅ Always run `npm run release` before merging to main
- ✅ Releases happen here
- ✅ Tags are created here
- ❌ Never commit directly to main
- ❌ Never merge dev directly to main

## 🚀 Release Process

### Standard Release Flow

```bash
# 1. Ensure dev is stable
git checkout dev
git pull origin dev

# 2. Merge dev → stage
git checkout stage
git pull origin stage
git merge dev
git push origin stage

# 3. Test on stage (QA, manual testing, etc.)

# 4. If tests pass, merge stage → main
git checkout main
git pull origin main
git merge stage

# 5. Create release (bumps version, creates tag, updates CHANGELOG)
npm run release

# 6. Push release
git push --follow-tags origin main

# 7. Create GitHub release (optional)
# Go to GitHub → Releases → Create new release → Use tag v1.x.x
```

### Hotfix Flow (Critical Production Fix)

```bash
# 1. Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug

# 2. Fix the bug
git add .
npm run commit  # Use "fix:" type

# 3. Merge hotfix → main
git checkout main
git merge hotfix/critical-bug

# 4. Create release
npm run release
git push --follow-tags origin main

# 5. Merge hotfix back to dev and stage
git checkout dev
git merge hotfix/critical-bug
git push origin dev

git checkout stage
git merge hotfix/critical-bug
git push origin stage

# 6. Delete hotfix branch
git branch -d hotfix/critical-bug
```

## 📋 Branch Protection Rules (Recommended)

Set up on GitHub:

### `main` branch:

- ✅ Require pull request reviews
- ✅ Require status checks to pass
- ✅ Require branches to be up to date
- ✅ Prevent force pushes
- ✅ Require linear history

### `stage` branch:

- ✅ Require pull request reviews
- ✅ Require status checks to pass
- ⚠️ Allow force pushes (for emergency fixes)

### `dev` branch:

- ⚠️ Require status checks to pass
- ❌ Allow direct pushes (for rapid development)

## 🔀 Common Scenarios

### Scenario 1: Adding a New Feature

```bash
# 1. Start from dev
git checkout dev
git pull origin dev

# 2. Create feature branch
git checkout -b feature/user-profile

# 3. Develop and commit
git add .
npm run commit  # feat(user): add profile page

# 4. Push and create PR: feature/user-profile → dev
git push origin feature/user-profile

# 5. After PR approval, merge to dev
# 6. Later, merge dev → stage → main (via release process)
```

### Scenario 2: Fixing a Bug Found in Stage

```bash
# 1. Fix in dev first
git checkout dev
git checkout -b fix/stage-bug
# ... fix the bug ...
git add .
npm run commit  # fix(ui): resolve button issue

# 2. Merge fix to dev
git checkout dev
git merge fix/stage-bug
git push origin dev

# 3. Merge fix to stage
git checkout stage
git merge dev
git push origin stage

# 4. Test fix on stage
# 5. If good, proceed with normal release flow
```

### Scenario 3: Emergency Production Fix

```bash
# Use hotfix flow (see above)
# Create hotfix branch from main
# Fix → main → release
# Then merge back to dev and stage
```

## 📝 Branch Naming Conventions

- **`dev`** - Development branch
- **`stage`** - Staging branch
- **`main`** - Production branch
- **`feature/name`** - New features
- **`fix/name`** - Bug fixes
- **`hotfix/name`** - Critical production fixes
- **`chore/name`** - Maintenance tasks

## ✅ Best Practices

1. **Always merge forward**: dev → stage → main
2. **Never skip branches**: Don't merge dev directly to main
3. **Test on stage**: Always test before releasing to main
4. **Release from main**: Only run `npm run release` on main branch
5. **Merge hotfixes back**: Always merge hotfixes back to dev and stage
6. **Keep branches in sync**: Regularly merge main back to dev/stage
7. **Use PRs**: Always use pull requests for merging between branches
8. **Conventional commits**: Always use conventional commit format

## 🚨 Common Mistakes to Avoid

1. ❌ Committing directly to main
2. ❌ Merging dev directly to main (skip stage)
3. ❌ Running releases on dev or stage
4. ❌ Forgetting to merge hotfixes back to dev/stage
5. ❌ Creating tags on wrong branch
6. ❌ Force pushing to main
7. ❌ Merging without testing on stage first

## 🔄 Syncing Branches

Periodically sync branches to keep them up to date:

```bash
# Sync main → dev (to get hotfixes)
git checkout dev
git merge main
git push origin dev

# Sync main → stage (to get hotfixes)
git checkout stage
git merge main
git push origin stage
```

## 📚 Additional Resources

- See `RELEASE_GUIDE.md` for release process details
- See `CONTRIBUTING.md` for commit conventions
- See `VERSIONING.md` for version management
