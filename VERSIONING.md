# Versioning & Commit Conventions Summary

## 🎯 Overview

This project uses:

- **Conventional Commits** for commit messages
- **Semantic Versioning** (SemVer) for version numbers
- **Automated versioning** based on commit types
- **CHANGELOG generation** from commits

## 📝 Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Quick Examples

```bash
# Feature
feat(auth): add password reset functionality

# Bug fix
fix(ui): resolve button alignment issue

# Documentation
docs: update API documentation

# Breaking change
feat(api): change authentication method

BREAKING CHANGE: Authentication now requires OAuth2
```

## 🔢 Version Bumping Rules

| Commit Type        | Version Bump | Example       |
| ------------------ | ------------ | ------------- |
| `feat:`            | MINOR        | 1.0.0 → 1.1.0 |
| `fix:`             | PATCH        | 1.0.0 → 1.0.1 |
| `BREAKING CHANGE:` | MAJOR        | 1.0.0 → 2.0.0 |
| Other types        | No bump\*    | -             |

\*Other types (docs, style, refactor, etc.) don't trigger version bumps unless they contain `BREAKING CHANGE:`

## 🚀 Quick Start

### Making Commits

```bash
# Use Commitizen (recommended - guided interface)
npm run commit

# Or commit manually following the format
git commit -m "feat(auth): add login functionality"
```

### Creating Releases

```bash
# Automatic release (analyzes commits and bumps version)
npm run release

# Manual version bump
npm run version:patch   # 1.0.0 → 1.0.1
npm run version:minor   # 1.0.0 → 1.1.0
npm run version:major   # 1.0.0 → 2.0.0
```

## 📋 Commit Types Reference

| Type       | Description        | Example                                 |
| ---------- | ------------------ | --------------------------------------- |
| `feat`     | New feature        | `feat(auth): add OAuth login`           |
| `fix`      | Bug fix            | `fix(ui): resolve crash on empty list`  |
| `docs`     | Documentation      | `docs: update README`                   |
| `style`    | Formatting         | `style: fix indentation`                |
| `refactor` | Code restructuring | `refactor(store): simplify state logic` |
| `perf`     | Performance        | `perf: optimize list rendering`         |
| `test`     | Tests              | `test: add auth unit tests`             |
| `build`    | Build system       | `build: update webpack config`          |
| `ci`       | CI/CD              | `ci: add GitHub Actions`                |
| `chore`    | Maintenance        | `chore: update dependencies`            |
| `revert`   | Revert commit      | `revert: revert auth changes`           |

## 🔍 Validation

Commit messages are automatically validated using:

- **commitlint** - Validates commit message format
- **Husky** - Git hooks for pre-commit validation

If your commit message doesn't follow the format, it will be rejected with helpful error messages.

## 📚 Additional Resources

- **Detailed Guide**: See `CONTRIBUTING.md` for comprehensive guidelines
- **Release Process**: See `RELEASE_GUIDE.md` for step-by-step release instructions
- **Conventional Commits**: https://www.conventionalcommits.org/
- **Semantic Versioning**: https://semver.org/

## ⚙️ Configuration Files

- `.commitlintrc.json` - Commit message validation rules
- `.versionrc.json` - CHANGELOG generation configuration
- `.czrc` - Commitizen configuration
- `.husky/commit-msg` - Git hook for commit validation

## 🎓 Best Practices

1. **Commit often** - Small, focused commits are better
2. **Use Commitizen** - `npm run commit` guides you through the format
3. **Be descriptive** - Explain what and why in commit messages
4. **Follow the format** - Consistency helps with automation
5. **Review CHANGELOG** - Always review before releasing
