# Branching Quick Reference

## 🌿 Branches

- **`dev`** - Development (active work)
- **`stage`** - Staging/testing (pre-production)
- **`main`** - Production (released code)

## 🔄 Daily Workflow

### Working on Features

```bash
git checkout dev
git pull origin dev
git checkout -b feature/my-feature
# ... make changes ...
npm run commit
git push origin feature/my-feature
# Create PR: feature/my-feature → dev
```

### Moving to Staging

```bash
git checkout stage
git pull origin stage
git merge dev
git push origin stage
# Test on stage environment
```

### Releasing to Production

```bash
git checkout main
git pull origin main
git merge stage
npm run release
git push --follow-tags origin main
```

## ⚡ Quick Commands

```bash
# Switch branches
git checkout dev
git checkout stage
git checkout main

# See current branch
git branch

# See all branches
git branch -a

# Update branch from remote
git pull origin dev
git pull origin stage
git pull origin main
```

## 🚨 Important Rules

- ✅ Develop on `dev`
- ✅ Test on `stage`
- ✅ Release from `main` only
- ❌ Never commit directly to `main`
- ❌ Never run `npm run release` on dev/stage
- ❌ Never skip branches (dev → main)

## 📚 Full Guide

See `BRANCHING_STRATEGY.md` for complete details.
