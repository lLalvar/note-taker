# Contributing Guide

## Git Commit Message Conventions

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for commit messages.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to CI configuration files and scripts
- **chore**: Other changes that don't modify src or test files
- **revert**: Reverts a previous commit

### Scope (Optional)

The scope should be the name of the package/component affected (as perceived by the person reading the changelog).

Examples:

- `feat(auth): add password reset functionality`
- `fix(ui): resolve button alignment issue`
- `refactor(store): simplify state management`

### Subject

- Use imperative, present tense: "change" not "changed" nor "changes"
- Don't capitalize the first letter
- No period (.) at the end
- Maximum 72 characters

### Body (Optional)

- Use imperative, present tense
- Include motivation for the change and contrasts with previous behavior
- Wrap at 72 characters

### Footer (Optional)

- Reference issue numbers
- Format: `Closes #123`, `Fixes #456`

### Examples

```
feat(auth): add email verification flow

Implement email verification after user registration.
Includes resend verification email functionality.

Closes #42
```

```
fix(ui): resolve button text overflow on small screens

The button component was not handling long text properly
on devices with small screen widths.

Fixes #38
```

```
chore: update dependencies

Update React Native to latest patch version and
resolve security vulnerabilities.
```

## Using Commitizen

We use Commitizen to help write conventional commit messages:

```bash
npm run commit
```

This will guide you through creating a properly formatted commit message.

## Version Management

We follow [Semantic Versioning](https://semver.org/) (SemVer):

- **MAJOR** version when you make incompatible API changes
- **MINOR** version when you add functionality in a backwards compatible manner
- **PATCH** version when you make backwards compatible bug fixes

### Version Bumping

Versions are automatically bumped based on commit messages:

- `feat:` → MINOR version bump
- `fix:` → PATCH version bump
- `BREAKING CHANGE:` → MAJOR version bump

### Manual Version Bumping

If you need to manually bump versions:

```bash
# Patch version (1.0.0 → 1.0.1)
npm run version:patch

# Minor version (1.0.0 → 1.1.0)
npm run version:minor

# Major version (1.0.0 → 2.0.0)
npm run version:major
```

These commands will sync the version in both `package.json` and `app.json`.

## Release Process

### Creating a Release

1. Ensure all changes are committed
2. Run the release script:

```bash
npm run release
```

This will:

- Analyze commits since last release
- Bump version according to conventional commits
- Generate/update CHANGELOG.md
- Create a git tag
- Create a commit with the version bump

3. Review the changes:

```bash
git log --oneline -5
git show
```

4. Push to remote:

```bash
git push --follow-tags origin main
```

5. Create a GitHub release using the generated CHANGELOG notes

### Pre-release Checklist

The release script automatically runs pre-release checks, but you can also run them manually:

```bash
npm run pre-release
```

Checks include:

- [ ] All tests passing (if you have tests)
- [ ] No linting errors
- [ ] No uncommitted changes
- [ ] Versions are in sync between package.json and app.json
- [ ] Git tag doesn't already exist
- [ ] On correct branch (main/master/develop)
- [ ] CHANGELOG reviewed
- [ ] Build numbers are correct (iOS buildNumber, Android versionCode)

## Branch Naming Conventions

- **main**: Production-ready code
- **develop**: Integration branch for features
- **feature/**: New features (e.g., `feature/user-profile`)
- **fix/**: Bug fixes (e.g., `fix/login-error`)
- **hotfix/**: Critical production fixes (e.g., `hotfix/security-patch`)
- **release/**: Release preparation (e.g., `release/v1.2.0`)
- **chore/**: Maintenance tasks (e.g., `chore/update-deps`)

## Code Review Guidelines

- Keep PRs focused and small when possible
- Write clear PR descriptions referencing related issues
- Ensure all CI checks pass
- Request review from at least one team member
- Address review feedback before merging

## Additional Best Practices

### Commit Frequency

- Commit often with meaningful messages
- Each commit should represent a logical change
- Avoid large commits that mix multiple concerns

### Commit Message Quality

- Write clear, descriptive messages
- Explain "why" in the body when not obvious
- Reference related issues/PRs
- Use present tense, imperative mood

### Version Tagging

- Always tag releases: `git tag v1.0.0`
- Use semantic versioning: `vMAJOR.MINOR.PATCH`
- Push tags: `git push --follow-tags`

### CHANGELOG Maintenance

- CHANGELOG.md is auto-generated from commits
- Review before each release
- Manual edits should be minimal

### Breaking Changes

- Mark breaking changes with `BREAKING CHANGE:` in footer
- Explain migration path in commit body
- Bump MAJOR version

Example:

```
feat(api): change authentication method

BREAKING CHANGE: Authentication now requires OAuth2 instead of
basic auth. Update your API calls to use the new OAuth2 flow.
See MIGRATION.md for details.
```

## Mobile App Versioning (Expo/React Native)

### Version Format

- **Version**: Semantic version (e.g., `1.2.3`) - shown to users
- **Build Number**: Auto-generated from version (e.g., `1.2.3` → `10203`)
  - Format: `MAJOR * 10000 + MINOR * 100 + PATCH`
  - iOS: `buildNumber` (string)
  - Android: `versionCode` (number)

### Version Sync

The `version-sync.js` script automatically:

- Syncs `package.json` version to `app.json`
- Calculates and sets iOS `buildNumber`
- Calculates and sets Android `versionCode`

This happens automatically during:

- `npm run version:patch/minor/major`
- `npm run release`

### Build Number Rules

- **Always increment**: Each release must have a unique build number
- **Never decrease**: Build numbers must always increase
- **Format**: Calculated from semantic version to ensure uniqueness
- **Example**: Version `1.2.3` → Build `10203`, Version `2.0.0` → Build `20000`

## Git Hooks

### Pre-commit Hook

Automatically runs before each commit:

- Linting check (`npm run lint`)
- Prevents commits with linting errors

To skip (not recommended):

```bash
git commit --no-verify -m "message"
```

### Commit-msg Hook

Automatically validates commit message format:

- Checks against Conventional Commits specification
- Ensures proper type, scope, and subject format
- Prevents commits with invalid messages

## Additional Best Practices

### Git Workflow

1. **Create feature branch**: `git checkout -b feature/your-feature`
2. **Make commits**: Use `npm run commit` for guided commits
3. **Push branch**: `git push origin feature/your-feature`
4. **Create PR**: Open pull request on GitHub
5. **Merge**: After review and approval

### Commit Message Tips

- **Be specific**: `fix(auth): resolve login crash` not `fix: bug`
- **Use scopes**: Helps organize changes (`feat(auth)`, `fix(ui)`, `refactor(store)`)
- **Keep it short**: Subject line should be under 72 characters
- **Explain why**: Use body for complex changes
- **Reference issues**: Use footer for `Closes #123` or `Fixes #456`

### Release Workflow

1. **Ensure clean state**: All changes committed, no uncommitted files
2. **Run release**: `npm run release`
3. **Review changes**: Check CHANGELOG.md and version updates
4. **Push**: `git push --follow-tags origin main`
5. **Create GitHub release**: Use CHANGELOG notes

### Branch Protection (Recommended)

Set up branch protection rules on GitHub:

- Require pull request reviews
- Require status checks to pass (linting, tests)
- Require branches to be up to date
- Prevent force pushes to main/master

### Tag Management

- **Format**: Always use `v` prefix: `v1.2.3`
- **Annotated tags**: Standard-version creates annotated tags automatically
- **Push tags**: Use `--follow-tags` to push tags with commits
- **Don't delete tags**: Tags are immutable, create new version instead

### CHANGELOG Best Practices

- **Auto-generated**: Don't manually edit (except for formatting)
- **Review before release**: Ensure accuracy and completeness
- **Unreleased section**: Tracks changes not yet released
- **Link format**: Automatically generates compare URLs

### Version Bumping Strategy

- **Patch (1.0.0 → 1.0.1)**: Bug fixes, small improvements
- **Minor (1.0.0 → 1.1.0)**: New features, backwards compatible
- **Major (1.0.0 → 2.0.0)**: Breaking changes, major refactors

### Common Mistakes to Avoid

1. ❌ **Skipping hooks**: Don't use `--no-verify` unless absolutely necessary
2. ❌ **Wrong commit type**: Don't use `feat:` for bug fixes
3. ❌ **Missing scope**: Use scopes to organize commits
4. ❌ **Manual version bumps**: Use scripts, don't edit manually
5. ❌ **Forgetting to sync**: Always sync versions after manual bumps
6. ❌ **Deleting tags**: Never delete or modify existing tags
7. ❌ **Large commits**: Break down large changes into smaller commits
8. ❌ **Vague messages**: Be specific about what changed

### Troubleshooting

**Commit rejected by commitlint:**

- Check error message for specific issue
- Use `npm run commit` for guided format
- Review CONTRIBUTING.md for format requirements

**Pre-commit hook fails:**

- Fix linting errors shown
- Run `npm run lint` manually to see all issues
- Don't skip hooks unless debugging

**Version sync issues:**

- Ensure package.json and app.json are valid JSON
- Check file permissions
- Run `node scripts/version-sync.js` manually

**Release fails:**

- Run `npm run pre-release` to see specific issues
- Ensure you're on correct branch
- Check for uncommitted changes
- Verify tag doesn't already exist
