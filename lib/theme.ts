import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native'

// Background images for each theme
const bgLightDefault = require('@/assets/images/bg/bg-light-default.png')
const bgLight2 = require('@/assets/images/bg/bg-light-2.png')
const bgDarkDefault = require('@/assets/images/bg/bg-dark-default.png')
const bgDark2 = require('@/assets/images/bg/bg-dark-2.png')

/**
 * Theme Background Image Mapping
 *
 * Maps each theme ID to its corresponding background image.
 * When adding a new theme, add its background image here.
 */
export const THEME_BACKGROUND_IMAGES: Record<string, any> = {
  'light-1': bgLightDefault,
  'light-2': bgLight2,
  'dark-1': bgDarkDefault,
  'dark-2': bgDark2,
}

/**
 * Theme Color Definitions
 *
 * Each theme is identified by a unique ID (e.g., 'light-1', 'dark-1').
 *
 * HOW TO ADD A NEW THEME:
 *
 * 1. Add theme colors below following the pattern:
 *    - Light themes: 'light-2', 'light-3', etc.
 *    - Dark themes: 'dark-2', 'dark-3', etc.
 *
 * 2. Add theme metadata to THEME_REGISTRY in theme-registry.ts
 *
 * 3. Add background image to THEME_BACKGROUND_IMAGES above
 *
 * 4. CSS variables in global.css are automatically synced via theme-css-sync.ts
 *    when the theme is selected. The default values in global.css match light-1
 *    and dark-1, but they update dynamically.
 *
 * 5. To verify CSS sync, you can run: node scripts/sync-theme-css.js [theme-id]
 *
 * Theme IDs should follow the pattern: '{category}-{number}'
 * Examples: 'light-1', 'light-2', 'dark-1', 'dark-2'
 *
 * IMPORTANT: Keep HSL format consistent (e.g., 'hsl(280 33.3333% 96.4706%)')
 * The CSS sync utility extracts the inner values automatically.
 */
export const THEME = {
  // Light Theme 1 (Default Light)
  'light-1': {
    background: 'hsl(340.0000 33.3333% 96.4706%)',
    foreground: 'hsl(276.9231 19.1176% 26.6667%)',
    card: 'hsl(0 0% 100%)',
    cardForeground: 'hsl(276.9231 19.1176% 26.6667%)',
    popover: 'hsl(0 0% 100%)',
    popoverForeground: 'hsl(276.9231 19.1176% 26.6667%)',
    primary: 'hsl(315.1351 91.7355% 76.2745%)',
    primaryForeground: 'hsl(0 0% 100%)',
    secondary: 'hsl(327.5676 90.2439% 91.9608%)',
    secondaryForeground: 'hsl(275 13.7931% 34.1176%)',
    muted: 'hsl(328.6957 100.0000% 95.4902%)',
    mutedForeground: 'hsl(280.0000 8.9362% 46.0784%)',
    accent: 'hsl(352.5000 44.4444% 92.9412%)',
    accentForeground: 'hsl(276.9231 19.1176% 26.6667%)',
    destructive: 'hsl(357.18 100% 45%)',
    destructiveForeground: 'hsl(0 0% 100%)',
    border: 'hsl(327.5676 90.2439% 91.9608%)',
    input: 'hsl(327.5676 90.2439% 91.9608%)',
    ring: 'hsl(315.1351 91.7355% 76.2745%)',
    chart1: 'hsl(315.1351 91.7355% 76.2745%)',
    chart2: 'hsl(318.3117 89.5349% 66.2745%)',
    chart3: 'hsl(322.1229 83.2558% 57.8431%)',
    chart4: 'hsl(323.3898 69.9605% 50.3922%)',
    chart5: 'hsl(323.3557 69.3023% 42.1569%)',
    sidebar: 'hsl(327.5676 90.2439% 91.9608%)',
    sidebarForeground: 'hsl(276.9231 19.1176% 26.6667%)',
    sidebarPrimary: 'hsl(315.1351 91.7355% 76.2745%)',
    sidebarPrimaryForeground: 'hsl(0 0% 100%)',
    sidebarAccent: 'hsl(352.5000 44.4444% 92.9412%)',
    sidebarAccentForeground: 'hsl(276.9231 19.1176% 26.6667%)',
    sidebarBorder: 'hsl(327.5676 90.2439% 91.9608%)',
    sidebarRing: 'hsl(315.1351 91.7355% 76.2745%)',
    fontSans: 'Open Sans, sans-serif',
    fontSerif: 'Source Serif 4, serif',
    fontMono: 'IBM Plex Mono, monospace',
    radius: '0.525rem',
    shadowX: '0px',
    shadowY: '8px',
    shadowBlur: '16px',
    shadowSpread: '-4px',
    shadowOpacity: '0.08',
    shadowColor: '#1a1a1a',
    shadow2xs: '0px 8px 16px -4px hsl(0 0% 10.1961% / 0.04)',
    shadowXs: '0px 8px 16px -4px hsl(0 0% 10.1961% / 0.04)',
    shadowSm:
      '0px 8px 16px -4px hsl(0 0% 10.1961% / 0.08), 0px 1px 2px -5px hsl(0 0% 10.1961% / 0.08)',
    shadow:
      '0px 8px 16px -4px hsl(0 0% 10.1961% / 0.08), 0px 1px 2px -5px hsl(0 0% 10.1961% / 0.08)',
    shadowMd:
      '0px 8px 16px -4px hsl(0 0% 10.1961% / 0.08), 0px 2px 4px -5px hsl(0 0% 10.1961% / 0.08)',
    shadowLg:
      '0px 8px 16px -4px hsl(0 0% 10.1961% / 0.08), 0px 4px 6px -5px hsl(0 0% 10.1961% / 0.08)',
    shadowXl:
      '0px 8px 16px -4px hsl(0 0% 10.1961% / 0.08), 0px 8px 10px -5px hsl(0 0% 10.1961% / 0.08)',
    shadow2xl: '0px 8px 16px -4px hsl(0 0% 10.1961% / 0.20)',
    trackingNormal: '0em',
    spacing: '0.25rem',
  },

  'light-2': {
    background: 'hsl(220 20% 95%)',
    foreground: 'hsl(220 10% 20%)',
    card: 'hsl(0 0% 100%)',
    cardForeground: 'hsl(220 10% 20%)',
    popover: 'hsl(0 0% 100%)',
    popoverForeground: 'hsl(220 10% 20%)',
    primary: 'hsl(220 70% 50%)',
    primaryForeground: 'hsl(0 0% 100%)',
    secondary: 'hsl(220 30% 90%)',
    secondaryForeground: 'hsl(220 10% 30%)',
    muted: 'hsl(220 20% 92%)',
    mutedForeground: 'hsl(220 8% 45%)',
    accent: 'hsl(220 40% 88%)',
    accentForeground: 'hsl(220 10% 20%)',
    destructive: 'hsl(357.18 100% 45%)',
    destructiveForeground: 'hsl(0 0% 100%)',
    border: 'hsl(220 30% 90%)',
    input: 'hsl(220 30% 90%)',
    ring: 'hsl(220 70% 50%)',
    chart1: 'hsl(220 70% 50%)',
    chart2: 'hsl(240 70% 50%)',
    chart3: 'hsl(260 70% 50%)',
    chart4: 'hsl(280 70% 50%)',
    chart5: 'hsl(300 70% 50%)',
    sidebar: 'hsl(220 30% 92%)',
    sidebarForeground: 'hsl(220 10% 20%)',
    sidebarPrimary: 'hsl(220 70% 50%)',
    sidebarPrimaryForeground: 'hsl(0 0% 100%)',
    sidebarAccent: 'hsl(220 40% 88%)',
    sidebarAccentForeground: 'hsl(220 10% 20%)',
    sidebarBorder: 'hsl(220 30% 90%)',
    sidebarRing: 'hsl(220 70% 50%)',
    fontSans: 'Open Sans, sans-serif',
    fontSerif: 'Source Serif 4, serif',
    fontMono: 'IBM Plex Mono, monospace',
    radius: '0.525rem',
    shadowX: '0px',
    shadowY: '8px',
    shadowBlur: '16px',
    shadowSpread: '-4px',
    shadowOpacity: '0.08',
    shadowColor: '#1a1a1a',
    shadow2xs: '0px 8px 16px -4px hsl(0 0% 10.1961% / 0.04)',
    shadowXs: '0px 8px 16px -4px hsl(0 0% 10.1961% / 0.04)',
    shadowSm:
      '0px 8px 16px -4px hsl(0 0% 10.1961% / 0.08), 0px 1px 2px -5px hsl(0 0% 10.1961% / 0.08)',
    shadow:
      '0px 8px 16px -4px hsl(0 0% 10.1961% / 0.08), 0px 1px 2px -5px hsl(0 0% 10.1961% / 0.08)',
    shadowMd:
      '0px 8px 16px -4px hsl(0 0% 10.1961% / 0.08), 0px 2px 4px -5px hsl(0 0% 10.1961% / 0.08)',
    shadowLg:
      '0px 8px 16px -4px hsl(0 0% 10.1961% / 0.08), 0px 4px 6px -5px hsl(0 0% 10.1961% / 0.08)',
    shadowXl:
      '0px 8px 16px -4px hsl(0 0% 10.1961% / 0.08), 0px 8px 10px -5px hsl(0 0% 10.1961% / 0.08)',
    shadow2xl: '0px 8px 16px -4px hsl(0 0% 10.1961% / 0.20)',
    trackingNormal: '0em',
    spacing: '0.25rem',
  },

  // Dark Theme 1 (Default Dark)
  'dark-1': {
    background: 'hsl(84 9.8039% 10%)',
    foreground: 'hsl(286.4516 100% 93.9216%)',
    card: 'hsl(330 17.7778% 17.6471%)',
    cardForeground: 'hsl(286.4516 100% 93.9216%)',
    popover: 'hsl(330 17.7778% 17.6471%)',
    popoverForeground: 'hsl(286.4516 100% 93.9216%)',
    primary: 'hsl(315.9036 95.4023% 82.9412%)',
    primaryForeground: 'hsl(84 9.8039% 10%)',
    secondary: 'hsl(332.5000 19.3548% 24.3137%)',
    secondaryForeground: 'hsl(276.0000 12.1951% 83.9216%)',
    muted: 'hsl(325.2632 28.3582% 13.1373%)',
    mutedForeground: 'hsl(277.8947 10.6145% 64.9020%)',
    accent: 'hsl(326.8966 19.2053% 29.6078%)',
    accentForeground: 'hsl(276.0000 12.1951% 83.9216%)',
    destructive: 'hsl(357.18 100% 45%)',
    destructiveForeground: 'hsl(84 9.8039% 10%)',
    border: 'hsl(332.5000 19.3548% 24.3137%)',
    input: 'hsl(332.5000 19.3548% 24.3137%)',
    ring: 'hsl(315.9036 95.4023% 82.9412%)',
    chart1: 'hsl(315.9036 95.4023% 82.9412%)',
    chart2: 'hsl(315.1351 91.7355% 76.2745%)',
    chart3: 'hsl(318.3117 89.5349% 66.2745%)',
    chart4: 'hsl(322.1229 83.2558% 57.8431%)',
    chart5: 'hsl(323.3898 69.9605% 50.3922%)',
    sidebar: 'hsl(332.5000 19.3548% 24.3137%)',
    sidebarForeground: 'hsl(286.4516 100% 93.9216%)',
    sidebarPrimary: 'hsl(315.9036 95.4023% 82.9412%)',
    sidebarPrimaryForeground: 'hsl(84 9.8039% 10%)',
    sidebarAccent: 'hsl(326.8966 19.2053% 29.6078%)',
    sidebarAccentForeground: 'hsl(276.0000 12.1951% 83.9216%)',
    sidebarBorder: 'hsl(332.5000 19.3548% 24.3137%)',
    sidebarRing: 'hsl(315.9036 95.4023% 82.9412%)',
    fontSans: 'Open Sans, sans-serif',
    fontSerif: 'Source Serif 4, serif',
    fontMono: 'IBM Plex Mono, monospace',
    radius: '1.5rem',
    shadowX: '0px',
    shadowY: '8px',
    shadowBlur: '16px',
    shadowSpread: '-4px',
    shadowOpacity: '0.08',
    shadowColor: '#1a1a1a',
    shadow2xs: '0px 8px 16px -4px hsl(0 0% 10.1961% / 0.04)',
    shadowXs: '0px 8px 16px -4px hsl(0 0% 10.1961% / 0.04)',
    shadowSm:
      '0px 8px 16px -4px hsl(0 0% 10.1961% / 0.08), 0px 1px 2px -5px hsl(0 0% 10.1961% / 0.08)',
    shadow:
      '0px 8px 16px -4px hsl(0 0% 10.1961% / 0.08), 0px 1px 2px -5px hsl(0 0% 10.1961% / 0.08)',
    shadowMd:
      '0px 8px 16px -4px hsl(0 0% 10.1961% / 0.08), 0px 2px 4px -5px hsl(0 0% 10.1961% / 0.08)',
    shadowLg:
      '0px 8px 16px -4px hsl(0 0% 10.1961% / 0.08), 0px 4px 6px -5px hsl(0 0% 10.1961% / 0.08)',
    shadowXl:
      '0px 8px 16px -4px hsl(0 0% 10.1961% / 0.08), 0px 8px 10px -5px hsl(0 0% 10.1961% / 0.08)',
    shadow2xl: '0px 8px 16px -4px hsl(0 0% 10.1961% / 0.20)',
    trackingNormal: '0em',
    spacing: '0.25rem',
  },

  'dark-2': {
    background: 'hsl(220 15% 8%)',
    foreground: 'hsl(220 10% 95%)',
    card: 'hsl(220 20% 12%)',
    cardForeground: 'hsl(220 10% 95%)',
    popover: 'hsl(220 20% 12%)',
    popoverForeground: 'hsl(220 10% 95%)',
    primary: 'hsl(220 70% 60%)',
    primaryForeground: 'hsl(220 15% 8%)',
    secondary: 'hsl(220 25% 18%)',
    secondaryForeground: 'hsl(220 10% 85%)',
    muted: 'hsl(220 20% 15%)',
    mutedForeground: 'hsl(220 8% 65%)',
    accent: 'hsl(220 25% 22%)',
    accentForeground: 'hsl(220 10% 85%)',
    destructive: 'hsl(357.18 100% 45%)',
    destructiveForeground: 'hsl(220 15% 8%)',
    border: 'hsl(220 25% 18%)',
    input: 'hsl(220 25% 18%)',
    ring: 'hsl(220 70% 60%)',
    chart1: 'hsl(315.9036 95.4023% 82.9412%)',
    chart2: 'hsl(240 70% 60%)',
    chart3: 'hsl(260 70% 60%)',
    chart4: 'hsl(280 70% 60%)',
    chart5: 'hsl(300 70% 60%)',
    sidebar: 'hsl(220 25% 18%)',
    sidebarForeground: 'hsl(220 10% 85%)',
    sidebarPrimary: 'hsl(220 70% 60%)',
    sidebarPrimaryForeground: 'hsl(220 15% 8%)',
    sidebarAccent: 'hsl(220 25% 22%)',
    sidebarAccentForeground: 'hsl(220 10% 85%)',
    sidebarBorder: 'hsl(220 25% 18%)',
    sidebarRing: 'hsl(220 70% 60%)',
    fontSans: 'Open Sans, sans-serif',
    fontSerif: 'Source Serif 4, serif',
    fontMono: 'IBM Plex Mono, monospace',
    radius: '0.525rem',
    shadowX: '0px',
    shadowY: '8px',
    shadowBlur: '16px',
    shadowSpread: '-4px',
    shadowOpacity: '0.08',
    shadowColor: '#1a1a1a',
    shadow2xs: '0px 8px 16px -4px hsl(0 0% 10.1961% / 0.04)',
    shadowXs: '0px 8px 16px -4px hsl(0 0% 10.1961% / 0.04)',
    shadowSm:
      '0px 8px 16px -4px hsl(0 0% 10.1961% / 0.08), 0px 1px 2px -5px hsl(0 0% 10.1961% / 0.08)',
    shadow:
      '0px 8px 16px -4px hsl(0 0% 10.1961% / 0.08), 0px 1px 2px -5px hsl(0 0% 10.1961% / 0.08)',
    shadowMd:
      '0px 8px 16px -4px hsl(0 0% 10.1961% / 0.08), 0px 2px 4px -5px hsl(0 0% 10.1961% / 0.08)',
    shadowLg:
      '0px 8px 16px -4px hsl(0 0% 10.1961% / 0.08), 0px 4px 6px -5px hsl(0 0% 10.1961% / 0.08)',
    shadowXl:
      '0px 8px 16px -4px hsl(0 0% 10.1961% / 0.08), 0px 8px 10px -5px hsl(0 0% 10.1961% / 0.08)',
    shadow2xl: '0px 8px 16px -4px hsl(0 0% 10.1961% / 0.20)',
    trackingNormal: '0em',
    spacing: '0.25rem',
  },
}
export function getThemeColors(themeId: string) {
  return THEME[themeId as keyof typeof THEME]
}

export function isValidThemeId(themeId: string): boolean {
  return themeId in THEME
}

function createNavTheme(
  colors: (typeof THEME)[keyof typeof THEME],
  isDark: boolean
): Theme {
  const baseTheme = isDark ? DarkTheme : DefaultTheme
  return {
    ...baseTheme,
    colors: {
      background: colors.background,
      border: colors.border,
      card: colors.card,
      notification: colors.destructive,
      primary: colors.primary,
      text: colors.foreground,
    },
  }
}

export function getNavTheme(themeId: string): Theme {
  const colors = THEME[themeId as keyof typeof THEME]
  if (!colors) {
    return createNavTheme(THEME['light-1'], false)
  }

  const isDark = themeId.startsWith('dark-')
  return createNavTheme(colors, isDark)
}

export function getThemeBackgroundImage(themeId: string): any {
  const image = THEME_BACKGROUND_IMAGES[themeId]
  if (image) {
    return image
  }

  if (themeId.startsWith('dark-')) {
    return bgDarkDefault
  }
  return bgLightDefault
}
