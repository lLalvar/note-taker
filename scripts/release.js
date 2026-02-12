#!/usr/bin/env node

/**
 * Release script that:
 * 1. Updates version based on conventional commits
 * 2. Generates CHANGELOG
 * 3. Syncs app.json build/version
 * 4. Creates release commit (tag created after PR merge)
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

  // Run standard-version to bump version and generate CHANGELOG.
  // Tagging is skipped here so release changes can go through PR to protected main.
  console.log('\n📝 Bumping version and generating CHANGELOG...')
  execSync('npx standard-version --skip.tag', { stdio: 'inherit' })

  // Sync version to app.json (including build numbers)
  console.log('\n🔄 Syncing version to app.json...')
  execSync('node scripts/version-sync.js', { stdio: 'inherit' })

  // Sync legal static pages from app legal source files
  console.log('\n⚖️ Generating legal-site pages...')
  execSync('node scripts/generate-legal-site.js', { stdio: 'inherit' })

  // Read new version
  const newPackageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
  const newVersion = newPackageJson.version

  console.log(`\n✅ Release ${newVersion} created successfully!`)
  console.log(`\n📋 Next steps:`)
  console.log(`   1. Review CHANGELOG.md and release commit`)
  console.log(`   2. Push release branch and open PR to main`)
  console.log(`   3. Merge PR to main`)
  console.log(
    `   4. Tag merged main commit: git tag -a v${newVersion} -m "chore(release): v${newVersion}"`
  )
  console.log(`   5. Push tag: git push origin v${newVersion}`)
  console.log(`   6. Create a GitHub release with the generated notes\n`)
  console.log(`⚠️  Release workflow: dev → stage → main → release/* PR\n`)
} catch (error) {
  console.error('❌ Error during release:', error.message)
  process.exit(1)
}
