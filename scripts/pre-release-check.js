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

// Check 4: Git tag doesn't already exist
check('Git tag does not already exist', () => {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
  const version = packageJson.version
  const tag = `v${version}`

  try {
    execSync(`git rev-parse -q --verify "refs/tags/${tag}"`, { stdio: 'pipe' })
    throw new Error(`Tag ${tag} already exists. Please bump the version first.`)
  } catch (error) {
    // Tag doesn't exist, which is what we want
    if (error.status !== 1) {
      throw error
    }
  }
})

// Check 5: On correct branch (optional - can be main or develop)
check('On release branch', () => {
  const branch = execSync('git rev-parse --abbrev-ref HEAD', {
    encoding: 'utf8',
  }).trim()
  const allowedBranches = ['main', 'master', 'develop']
  if (!allowedBranches.includes(branch)) {
    throw new Error(`Not on a release branch. Current branch: ${branch}`)
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
