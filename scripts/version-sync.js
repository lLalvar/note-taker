#!/usr/bin/env node

/**
 * Syncs version between package.json and app.json
 * This ensures Expo app version stays in sync with npm version
 * Also manages build numbers for iOS and Android
 */

/* eslint-disable no-undef */
const fs = require('fs')
const path = require('path')

const packageJsonPath = path.join(__dirname, '..', 'package.json')
const appJsonPath = path.join(__dirname, '..', 'app.json')

/**
 * Converts semantic version to build number
 * Format: MAJOR * 10000 + MINOR * 100 + PATCH
 * Example: 1.2.3 -> 10203
 */
function versionToBuildNumber(version) {
  const [major, minor, patch] = version.split('.').map(Number)
  return major * 10000 + minor * 100 + patch
}

try {
  // Read package.json
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
  const version = packageJson.version
  const buildNumber = versionToBuildNumber(version)

  // Read app.json (strip comments as JSON.parse doesn't support them)
  // Expo supports comments in app.json, but JSON.parse doesn't
  let appJsonContent = fs.readFileSync(appJsonPath, 'utf8')
  // Remove single-line comments (// ...)
  appJsonContent = appJsonContent.replace(/\/\/.*$/gm, '')
  // Remove multi-line comments (/* ... */)
  appJsonContent = appJsonContent.replace(/\/\*[\s\S]*?\*\//g, '')
  const appJson = JSON.parse(appJsonContent)

  // Update version in app.json
  appJson.expo.version = version

  // Update iOS build number
  if (!appJson.expo.ios) {
    appJson.expo.ios = {}
  }
  appJson.expo.ios.buildNumber = String(buildNumber)

  // Update Android version code
  if (!appJson.expo.android) {
    appJson.expo.android = {}
  }
  appJson.expo.android.versionCode = buildNumber

  // Write back to app.json (clean JSON, comments will be removed)
  // Expo works fine without comments in app.json
  fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2) + '\n')

  console.log(`✅ Version synced to ${version} in package.json and app.json`)
  console.log(
    `✅ Build number set to ${buildNumber} (iOS: ${buildNumber}, Android: ${buildNumber})`
  )
} catch (error) {
  console.error('❌ Error syncing version:', error.message)
  process.exit(1)
}
