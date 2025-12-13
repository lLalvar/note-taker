#!/usr/bin/env node
/**
 * Theme CSS Sync Script
 *
 * This script helps ensure theme.ts and global.css stay in sync.
 * It reads theme definitions from lib/theme.ts and generates CSS variable
 * definitions that can be copied to global.css.
 *
 * Usage: node scripts/sync-theme-css.js [theme-id]
 *
 * If theme-id is provided, it will show CSS for that specific theme.
 * Otherwise, it shows CSS for all themes.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Get directory path (ES module)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Read theme.ts file
const themeTsPath = path.join(__dirname, '../lib/theme.ts')
const themeTsContent = fs.readFileSync(themeTsPath, 'utf-8')

// Extract THEME object using regex (simple approach)
// In production, you might want to use a TypeScript parser
const themeMatch = themeTsContent.match(/export const THEME = \{([\s\S]*?)\}/)
if (!themeMatch) {
  console.error('Could not find THEME object in theme.ts')
  process.exit(1)
}

// Parse theme IDs from the file
const themeIds = []
const themeIdRegex = /['"](light-\d+|dark-\d+)['"]:/g
let match
while ((match = themeIdRegex.exec(themeTsContent)) !== null) {
  themeIds.push(match[1])
}

if (themeIds.length === 0) {
  console.error('No themes found in theme.ts')
  process.exit(1)
}

// Get theme ID from command line
const requestedThemeId = process.argv[2]

// Filter themes if specific one requested
const themesToProcess = requestedThemeId
  ? themeIds.filter((id) => id === requestedThemeId)
  : themeIds

if (requestedThemeId && themesToProcess.length === 0) {
  console.error(`Theme ${requestedThemeId} not found`)
  console.log(`Available themes: ${themeIds.join(', ')}`)
  process.exit(1)
}

console.log('Theme CSS Variable Generator')
console.log('='.repeat(50))
console.log()

themesToProcess.forEach((themeId) => {
  const isDark = themeId.startsWith('dark-')
  const selector = isDark ? '.dark:root' : ':root'

  console.log(`/* Theme: ${themeId} */`)
  console.log(`${selector} {`)

  // Extract theme colors from theme.ts
  // This is a simplified parser - you may need to adjust based on your format
  const themeBlockRegex = new RegExp(
    `['"]${themeId}['"]:\\s*\\{([\\s\\S]*?)\\}`,
    'm'
  )
  const themeBlockMatch = themeTsContent.match(themeBlockRegex)

  if (themeBlockMatch) {
    const themeContent = themeBlockMatch[1]

    // Map of theme.ts keys to CSS variable names
    const cssVarMap = {
      background: '--background',
      foreground: '--foreground',
      card: '--card',
      cardForeground: '--card-foreground',
      popover: '--popover',
      popoverForeground: '--popover-foreground',
      primary: '--primary',
      primaryForeground: '--primary-foreground',
      secondary: '--secondary',
      secondaryForeground: '--secondary-foreground',
      muted: '--muted',
      mutedForeground: '--muted-foreground',
      accent: '--accent',
      accentForeground: '--accent-foreground',
      destructive: '--destructive',
      destructiveForeground: '--destructive-foreground',
      border: '--border',
      input: '--input',
      ring: '--ring',
      chart1: '--chart-1',
      chart2: '--chart-2',
      chart3: '--chart-3',
      chart4: '--chart-4',
      chart5: '--chart-5',
      radius: '--radius',
    }

    // Extract each color value
    Object.entries(cssVarMap).forEach(([tsKey, cssVar]) => {
      const valueRegex = new RegExp(`${tsKey}:\\s*['"]([^'"]+)['"]`, 'm')
      const valueMatch = themeContent.match(valueRegex)

      if (valueMatch) {
        let value = valueMatch[1]
        // Convert HSL format: 'hsl(280 33.3333% 96.4706%)' -> '280 33.3333% 96.4706%'
        if (value.startsWith('hsl(')) {
          value = value.replace(/^hsl\(/, '').replace(/\)$/, '')
        }
        console.log(`  ${cssVar}: ${value};`)
      }
    })
  }

  console.log('}')
  console.log()
})

console.log('='.repeat(50))
console.log('Note: Copy the CSS variables above to global.css')
console.log('The active theme variables (:root and .dark:root) are')
console.log('automatically updated by theme-css-sync.ts when theme changes.')
