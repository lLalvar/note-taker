#!/usr/bin/env node

/**
 * Pre-release validation script
 * Checks that everything is ready for a release
 */

/* eslint-disable no-undef */
const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const packageJsonPath = path.join(__dirname, '..', 'package.json')
const appJsonPath = path.join(__dirname, '..', 'app.json')

let hasErrors = false

function check(description, fn) {
  try {
    fn()
    console.log(`✅ ${description}`)
  } catch (error) {
    console.error(`❌ ${description}`)
    console.error(`   ${error.message}`)
    hasErrors = true
  }
}

console.log('🔍 Running pre-release checks...\n')

// Check 1: No uncommitted changes
check('No uncommitted changes', () => {
  const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' })
  if (gitStatus.trim()) {
    throw new Error(
      'You have uncommitted changes. Please commit or stash them first.'
    )
  }
})

// Check 2: Versions are in sync
check('Versions are in sync', () => {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
  const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'))

  if (packageJson.version !== appJson.expo.version) {
    throw new Error(
      `Version mismatch: package.json (${packageJson.version}) != app.json (${appJson.expo.version})`
    )
  }
})

// Check 3: Linting passes
check('Linting passes', () => {
  execSync('npm run lint -- --max-warnings=0', { stdio: 'pipe' })
})

// Check 4: Current commit is not already released
// It's normal for the previous release tag (e.g. v1.1.0) to exist.
// We only want to block if HEAD is already at the current version tag.
check('HEAD is not already tagged as current version', () => {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
  const version = packageJson.version
  const tag = `v${version}`

  let tagCommit = ''
  try {
    tagCommit = execSync(`git rev-list -n 1 "${tag}"`, {
      encoding: 'utf8',
    }).trim()
  } catch (error) {
    // Tag doesn't exist yet (fine for a first release of this version)
    if (error.status === 128) return
    throw error
  }

  const headCommit = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim()
  if (tagCommit && tagCommit === headCommit) {
    throw new Error(`HEAD is already at ${tag}. Nothing to release.`)
  }
})

// Check 5: On correct branch (releases only from main)
check('On release branch (main)', () => {
  const branch = execSync('git rev-parse --abbrev-ref HEAD', {
    encoding: 'utf8',
  }).trim()
  const allowedBranches = ['main', 'master']
  if (!allowedBranches.includes(branch)) {
    throw new Error(
      `Releases must be created from main branch. Current branch: ${branch}\n` +
        `   Workflow: dev → stage → main (then release)`
    )
  }
})

console.log('\n')

if (hasErrors) {
  console.error(
    '❌ Pre-release checks failed. Please fix the issues above before releasing.'
  )
  process.exit(1)
} else {
  console.log('✅ All pre-release checks passed! Ready to release.')
}
