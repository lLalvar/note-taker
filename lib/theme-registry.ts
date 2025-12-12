/**
 * Theme Registry
 *
 * This file defines all available themes in the app.
 * To add a new theme:
 * 1. Add the theme colors to THEME object in theme.ts
 * 2. Add the theme metadata to THEME_REGISTRY below
 * 3. The theme will automatically appear in the theme selection page
 */
import { type LucideIcon, MoonStar, Sun } from 'lucide-react-native'

export type ThemeCategory = 'hot' | 'light' | 'dark'

export interface ThemeMetadata {
  id: string
  name: string
  description: string
  category: ThemeCategory
  icon: LucideIcon
  previewColor?: string // Optional: primary color for preview
  isFree?: boolean // Whether theme is free
  previewImage?: string // Optional: background image URL or asset path
}

/**
 * Theme Registry
 *
 * Defines all available themes with their metadata.
 * Themes are organized by category (light, dark).
 *
 * Theme IDs should follow the pattern: '{category}-{number}'
 * Examples: 'light-1', 'light-2', 'dark-1', 'dark-2'
 */
export const THEME_REGISTRY: ThemeMetadata[] = [
  // Light themes
  {
    id: 'light-1',
    name: 'Light',
    description: 'Default light theme',
    category: 'light',
    icon: Sun,
    previewColor: 'hsl(255.1351 91.7355% 76.2745%)',
    isFree: true,
  },
  // Add more light themes here:
  // {
  //   id: 'light-2',
  //   name: 'Light 2',
  //   description: 'Second light theme',
  //   category: 'light',
  //   icon: Sun,
  //   previewColor: '#your-color',
  //   isFree: true,
  // },

  // Dark themes
  {
    id: 'dark-1',
    name: 'Dark',
    description: 'Default dark theme',
    category: 'dark',
    icon: MoonStar,
    previewColor: 'hsl(255.9036 95.4023% 82.9412%)',
    isFree: true,
  },
  // Add more dark themes here:
  // {
  //   id: 'dark-2',
  //   name: 'Dark 2',
  //   description: 'Second dark theme',
  //   category: 'dark',
  //   icon: MoonStar,
  //   previewColor: '#your-color',
  //   isFree: true,
  // },
]

export function getThemeMetadata(themeId: string): ThemeMetadata | undefined {
  return THEME_REGISTRY.find((theme) => theme.id === themeId)
}

export function getThemesByCategory(category: ThemeCategory): ThemeMetadata[] {
  return THEME_REGISTRY.filter((theme) => theme.category === category)
}

export function getLightThemes(): ThemeMetadata[] {
  return getThemesByCategory('light')
}

export function getDarkThemes(): ThemeMetadata[] {
  return getThemesByCategory('dark')
}

/**
 * Get all themes from both light and dark categories
 * New themes (excluding light-1 and dark-1) appear first,
 * followed by the default themes (light-1 and dark-1)
 */
export function getNewThemes(): ThemeMetadata[] {
  const allLightThemes = getLightThemes()
  const allDarkThemes = getDarkThemes()

  // Separate new themes from default themes
  const newLightThemes = allLightThemes.filter(
    (theme) => theme.id !== 'light-1'
  )
  const newDarkThemes = allDarkThemes.filter((theme) => theme.id !== 'dark-1')
  const defaultLightTheme = allLightThemes.find(
    (theme) => theme.id === 'light-1'
  )
  const defaultDarkTheme = allDarkThemes.find((theme) => theme.id === 'dark-1')

  // Return: new themes first, then defaults
  return [
    ...newLightThemes,
    ...newDarkThemes,
    ...(defaultLightTheme ? [defaultLightTheme] : []),
    ...(defaultDarkTheme ? [defaultDarkTheme] : []),
  ]
}

export function isValidThemeId(themeId: string): boolean {
  return THEME_REGISTRY.some((theme) => theme.id === themeId)
}

export function getDefaultThemeId(category: ThemeCategory): string {
  const themes = getThemesByCategory(category)
  if (themes.length > 0) {
    return themes[0].id
  }
  // Fallback based on category
  if (category === 'dark') return 'dark-1'
  return 'light-1'
}
