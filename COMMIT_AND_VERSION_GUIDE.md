# Commit & Version Management Guide

## Quick Reference

### Making Commits

```bash
# Recommended: Use Commitizen (guided interface)
npm run commit

# Manual commit (must follow Conventional Commits format)
git commit -m "feat(auth): add login functionality"
```

### Version Management

```bash
# Automatic release (recommended)
npm run release

# Manual version bump
npm run version:patch   # 1.0.0 → 1.0.1
npm run version:minor   # 1.0.0 → 1.1.0
npm run version:major   # 1.0.0 → 2.0.0
```

### Pre-release Checks

```bash
# Run validation before release
npm run pre-release
```

## What's Set Up

### ✅ Git Hooks

- **Pre-commit**: Runs linting before each commit
- **Commit-msg**: Validates commit message format

### ✅ Commit Validation

- **Commitizen**: Interactive commit message builder (`npm run commit`)
- **Commitlint**: Validates commit format against Conventional Commits
- **Husky**: Git hooks manager

### ✅ Version Management

- **Semantic Versioning**: Follows SemVer (MAJOR.MINOR.PATCH)
- **Automatic versioning**: Based on commit types
- **Version sync**: Keeps package.json and app.json in sync
- **Build numbers**: Auto-calculated for iOS and Android

### ✅ Release Automation

- **Standard-version**: Bumps version, generates CHANGELOG, creates tags
- **Pre-release checks**: Validates before release
- **CHANGELOG generation**: Auto-generated from commits

## Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature (bumps MINOR version)
- `fix`: Bug fix (bumps PATCH version)
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Test changes
- `build`: Build system changes
- `ci`: CI/CD changes
- `chore`: Maintenance tasks
- `revert`: Revert a commit

### Examples

```bash
feat(auth): add password reset functionality
fix(ui): resolve button alignment issue
docs: update API documentation
refactor(store): simplify state management
chore: update dependencies
```

## Version Bumping Rules

| Commit Type        | Version Bump | Example       |
| ------------------ | ------------ | ------------- |
| `feat:`            | MINOR        | 1.0.0 → 1.1.0 |
| `fix:`             | PATCH        | 1.0.0 → 1.0.1 |
| `BREAKING CHANGE:` | MAJOR        | 1.0.0 → 2.0.0 |
| Other types        | No bump\*    | -             |

\*Other types don't trigger version bumps unless they contain `BREAKING CHANGE:`

## Build Numbers

Build numbers are automatically calculated from semantic version:

- **Format**: `MAJOR * 10000 + MINOR * 100 + PATCH`
- **Example**: Version `1.2.3` → Build `10203`
- **iOS**: Stored as `buildNumber` (string)
- **Android**: Stored as `versionCode` (number)

## Release Process

1. **Ensure clean state**: All changes committed
2. **Run release**: `npm run release`
3. **Review**: Check CHANGELOG.md and version updates
4. **Commit sync** (if needed): `git add app.json && git commit --amend --no-edit`
5. **Push**: `git push --follow-tags origin main`
6. **Create GitHub release**: Use CHANGELOG notes

## Best Practices

1. ✅ Use `npm run commit` for guided commits
2. ✅ Commit often with small, focused changes
3. ✅ Use descriptive commit messages
4. ✅ Use scopes to organize commits
5. ✅ Never skip git hooks (`--no-verify`)
6. ✅ Review CHANGELOG before release
7. ✅ Always push tags with `--follow-tags`
8. ✅ Never delete or modify existing tags

## Common Issues

### Commit rejected by commitlint

**Solution**: Use `npm run commit` for guided format, or check CONTRIBUTING.md for format requirements.

### Pre-commit hook fails

**Solution**: Fix linting errors shown, run `npm run lint` manually.

### Version sync issues

**Solution**: Run `node scripts/version-sync.js` manually to sync versions.

### Release fails

**Solution**: Run `npm run pre-release` to see specific validation errors.

## Files Reference

- `.commitlintrc.json` - Commit message validation rules
- `.versionrc.json` - CHANGELOG generation configuration
- `.czrc` - Commitizen configuration
- `.husky/pre-commit` - Pre-commit hook (linting)
- `.husky/commit-msg` - Commit message validation hook
- `scripts/version-sync.js` - Version synchronization script
- `scripts/pre-release-check.js` - Pre-release validation
- `scripts/release.js` - Release automation script

## Additional Resources

- **Detailed Guide**: See `CONTRIBUTING.md`
- **Versioning Guide**: See `VERSIONING.md`
- **Conventional Commits**: https://www.conventionalcommits.org/
- **Semantic Versioning**: https://semver.org/
