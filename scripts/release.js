#!/usr/bin/env node

/**
 * Release script that:
 * 1. Updates version based on conventional commits
 * 2. Generates CHANGELOG
 * 3. Creates git tag
 * 4. Commits changes
 */

/* eslint-disable no-undef */
const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const packageJsonPath = path.join(__dirname, '..', 'package.json')
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
const currentVersion = packageJson.version

console.log(`🚀 Starting release process...`)
console.log(`📦 Current version: ${currentVersion}\n`)

try {
  // Run pre-release checks
  console.log('🔍 Running pre-release checks...\n')
  execSync('node scripts/pre-release-check.js', { stdio: 'inherit' })

  // Run standard-version to bump version and generate CHANGELOG
  console.log('\n📝 Bumping version and generating CHANGELOG...')
  execSync('npx standard-version', { stdio: 'inherit' })

  // Sync version to app.json (including build numbers)
  console.log('\n🔄 Syncing version to app.json...')
  execSync('node scripts/version-sync.js', { stdio: 'inherit' })

  // Read new version
  const newPackageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
  const newVersion = newPackageJson.version

  console.log(`\n✅ Release ${newVersion} created successfully!`)
  console.log(`\n📋 Next steps:`)
  console.log(`   1. Review CHANGELOG.md`)
  console.log(`   2. Review the release commit and tag`)
  console.log(
    `   3. Commit the version sync if needed: git add app.json && git commit --amend --no-edit`
  )
  console.log(`   4. Push to remote: git push --follow-tags origin main`)
  console.log(`\n⚠️  Note: Releases should only be created from main branch.`)
  console.log(`   Workflow: dev → stage → main (then release)`)
  console.log(`   5. Create a GitHub release with the generated notes\n`)
} catch (error) {
  console.error('❌ Error during release:', error.message)
  process.exit(1)
}
