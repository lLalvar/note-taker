# Branch Protection Setup Guide

## 📋 Prerequisites

- **Public Repository**: Branch protection is FREE ✅
- **Private Repository**: Requires GitHub Pro ($4/month) ⚠️

## 🔍 Check Your Repository Type

1. Go to: `https://github.com/lLalvar/note-taker`
2. Look for "Public" or "Private" badge
3. If Public → Follow steps below ✅
4. If Private → Consider making public or upgrading to Pro

## 🛡️ Setting Up Branch Protection

### Step 1: Navigate to Settings

1. Go to your repository on GitHub
2. Click **Settings** (top navigation)
3. Click **Branches** (left sidebar)

### Step 2: Protect `main` Branch

Click **Add branch protection rule** or **Add rule**

**Branch name pattern**: `main`

**Settings to enable**:

- ✅ **Require a pull request before merging**
  - Require approvals: `1`
  - ⚠️ **Allow specified actors to bypass required pull requests** (for solo projects, check this and add yourself)
  - OR: ❌ **Uncheck "Require approval from someone other than the last pusher"** (if working solo)
  - ✅ Dismiss stale pull request approvals when new commits are pushed
  - ✅ Require review from Code Owners (if you have CODEOWNERS file)

- ✅ **Require status checks to pass before merging**
  - (Add your CI checks here if you have GitHub Actions)
  - ✅ Require branches to be up to date before merging

- ✅ **Require conversation resolution before merging**

- ✅ **Require linear history**

- ✅ **Include administrators** (applies rules to admins too)

- ✅ **Restrict pushes that create matching branches**
  - This prevents direct pushes to main

- ✅ **Do not allow bypassing the above settings**

**Click "Create"**

### Step 3: Protect `stage` Branch

Click **Add branch protection rule**

**Branch name pattern**: `stage`

**Settings to enable**:

- ✅ **Require a pull request before merging**
  - Require approvals: `1`

- ✅ **Require status checks to pass before merging**
  - ✅ Require branches to be up to date before merging

- ⚠️ **Allow force pushes** (for emergency fixes)
  - ⚠️ **Allow deletions** (optional)

**Click "Create"**

### Step 4: Configure `dev` Branch (Optional)

For `dev` branch, you can either:

**Option A: Light Protection**

- ✅ **Require status checks to pass before merging**
- ❌ Don't require pull requests (allows rapid development)

**Option B: Full Protection**

- Same as `stage` branch

## ✅ Verification

After setting up protection:

1. Try to push directly to `main`:

   ```bash
   git checkout main
   git commit --allow-empty -m "test: direct push"
   git push origin main
   ```

   Should fail with: "remote: error: GH006: Protected branch update failed"

2. Create a PR from `dev` → `main`
   - Should require approval
   - Should show protection rules

## 🎯 Recommended Settings Summary

### `main` Branch (Strictest)

- ✅ Require PR with 1 approval
- ✅ Require status checks
- ✅ Require linear history
- ✅ No force pushes
- ✅ Include administrators

### `stage` Branch (Moderate)

- ✅ Require PR with 1 approval
- ✅ Require status checks
- ⚠️ Allow force pushes (emergencies)

### `dev` Branch (Flexible)

- ⚠️ Require status checks (optional)
- ❌ Allow direct pushes (rapid development)

## 🚨 Troubleshooting

### "Branch protection rules are not available"

- **Cause**: Private repository on free plan
- **Solution**: Make repo public or upgrade to GitHub Pro

### "Cannot push to protected branch"

- **Cause**: Trying to push directly to protected branch
- **Solution**: Create a feature branch and PR instead

### "Required status check is not set"

- **Cause**: No CI/CD checks configured
- **Solution**: Either:
  - Set up GitHub Actions
  - Or disable "Require status checks" for now

### "New changes require approval from someone other than the last pusher"

- **Cause**: Branch protection requires approval from someone other than the PR author
- **Solution** (for solo projects):
  1. Go to Settings → Branches → Edit `main` branch rule
  2. Under "Require a pull request before merging"
  3. **Uncheck** "Require approval from someone other than the last pusher"
  4. OR: Enable "Allow specified actors to bypass required pull requests" and add yourself
  5. Save changes
  6. Return to PR and merge

## 📚 Additional Resources

- [GitHub Branch Protection Docs](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches)
- [GitHub Pricing](https://github.com/pricing)
- See `BRANCHING_STRATEGY.md` for workflow details
