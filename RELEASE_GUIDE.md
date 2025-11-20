# Release Guide

## Quick Reference

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

### Version Bumping Rules

- `feat:` → MINOR (1.0.0 → 1.1.0)
- `fix:` → PATCH (1.0.0 → 1.0.1)
- `BREAKING CHANGE:` → MAJOR (1.0.0 → 2.0.0)

## Workflow Examples

### Making a Feature Commit

```bash
# Option 1: Use Commitizen (recommended)
npm run commit

# Option 2: Manual commit
git commit -m "feat(auth): add password reset functionality"
```

### Creating a Release

```bash
# 1. Ensure all changes are committed
git status

# 2. Run release script
npm run release

# 3. Review changes
git log --oneline -5
git show

# 4. Push to remote
git push --follow-tags origin main
```

### Manual Version Bump

```bash
# Patch version (bug fixes)
npm run version:patch

# Minor version (new features)
npm run version:minor

# Major version (breaking changes)
npm run version:major
```

## Common Scenarios

### Scenario 1: Adding a New Feature

```bash
# Make your changes
git add .
npm run commit  # Select "feat" type
# Push
git push
```

### Scenario 2: Fixing a Bug

```bash
# Make your changes
git add .
npm run commit  # Select "fix" type
# Push
git push
```

### Scenario 3: Preparing a Release

```bash
# Ensure all commits follow conventional format
git log --oneline

# Run release
npm run release

# Review CHANGELOG.md
cat CHANGELOG.md

# Push release
git push --follow-tags origin main
```

### Scenario 4: Breaking Change

```bash
# Make breaking changes
git add .
git commit -m "feat(api): change authentication method

BREAKING CHANGE: Authentication now requires OAuth2 instead of basic auth.
Update your API calls to use the new OAuth2 flow."
```

## Best Practices Checklist

### Before Committing

- [ ] Code follows project conventions
- [ ] Tests pass (if applicable)
- [ ] Linting passes
- [ ] Commit message follows conventional format

### Before Releasing

- [ ] All commits follow conventional format
- [ ] Version numbers are correct
- [ ] CHANGELOG is accurate
- [ ] All tests pass
- [ ] No uncommitted changes

### After Releasing

- [ ] Git tag created correctly
- [ ] CHANGELOG updated
- [ ] Version synced in package.json and app.json
- [ ] GitHub release created (if applicable)

## Troubleshooting

### Commit Message Rejected

If your commit message is rejected by commitlint:

```bash
# Check the error message
git commit -m "your message"

# Use Commitizen for guided commit
npm run commit

# Or fix manually following the format:
# <type>(<scope>): <subject>
```

### Version Sync Issues

If versions are out of sync:

```bash
# Manually sync versions
node scripts/version-sync.js
```

### Release Script Fails

If release script fails:

1. Check for uncommitted changes: `git status`
2. Ensure you're on the correct branch
3. Check git log for non-conventional commits
4. Review error message for specific issues

## Additional Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)
- See `CONTRIBUTING.md` for detailed guidelines
