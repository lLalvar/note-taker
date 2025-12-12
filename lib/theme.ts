import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native'

/**
 * Theme Color Definitions
 *
 * Each theme is identified by a unique ID (e.g., 'light-1', 'dark-1').
 * To add a new theme:
 * 1. Add a new entry with a unique ID
 * 2. Add the theme metadata to THEME_REGISTRY in theme-registry.ts
 *
 * Theme IDs should follow the pattern: '{category}-{number}'
 * Examples: 'light-1', 'light-2', 'dark-1', 'dark-2'
 */
export const THEME: Record<
  string,
  {
    background: string
    foreground: string
    card: string
    cardForeground: string
    popover: string
    popoverForeground: string
    primary: string
    primaryForeground: string
    secondary: string
    secondaryForeground: string
    muted: string
    mutedForeground: string
    accent: string
    accentForeground: string
    destructive: string
    destructiveForeground: string
    border: string
    input: string
    ring: string
    radius: string
    chart1: string
    chart2: string
    chart3: string
    chart4: string
    chart5: string
  }
> = {
  // Light Theme 1 (Default Light)
  'light-1': {
    background: 'hsl(280 33.3333% 96.4706%)',
    foreground: 'hsl(216.9231 19.1176% 26.6667%)',
    card: 'hsl(0 0% 100%)',
    cardForeground: 'hsl(216.9231 19.1176% 26.6667%)',
    popover: 'hsl(0 0% 100%)',
    popoverForeground: 'hsl(216.9231 19.1176% 26.6667%)',
    primary: 'hsl(255.1351 91.7355% 76.2745%)',
    primaryForeground: 'hsl(0 0% 100%)',
    secondary: 'hsl(267.5676 90.2439% 91.9608%)',
    secondaryForeground: 'hsl(215 13.7931% 34.1176%)',
    muted: 'hsl(268.6957 100% 95.4902%)',
    mutedForeground: 'hsl(220 8.9362% 46.0784%)',
    accent: 'hsl(292.5 44.4444% 92.9412%)',
    accentForeground: 'hsl(216.9231 19.1176% 26.6667%)',
    destructive: 'hsl(0 93.5484% 81.7647%)',
    destructiveForeground: 'hsl(0 0% 100%)',
    border: 'hsl(267.5676 90.2439% 91.9608%)',
    input: 'hsl(267.5676 90.2439% 91.9608%)',
    ring: 'hsl(255.1351 91.7355% 76.2745%)',
    radius: '1.5rem',
    chart1: 'hsl(255.1351 91.7355% 76.2745%)',
    chart2: 'hsl(258.3117 89.5349% 66.2745%)',
    chart3: 'hsl(262.1229 83.2558% 57.8431%)',
    chart4: 'hsl(263.3898 69.9605% 50.3922%)',
    chart5: 'hsl(263.3557 69.3023% 42.1569%)',
  },

  // Add more light themes here:
  // 'light-2': { ... },
  // 'light-3': { ... },
  // 'light-4': { ... },
  // 'light-5': { ... },

  // Dark Theme 1 (Default Dark)
  'dark-1': {
    background: 'hsl(24 9.8039% 10%)',
    foreground: 'hsl(226.4516 100% 93.9216%)',
    card: 'hsl(270 17.7778% 17.6471%)',
    cardForeground: 'hsl(226.4516 100% 93.9216%)',
    popover: 'hsl(270 17.7778% 17.6471%)',
    popoverForeground: 'hsl(226.4516 100% 93.9216%)',
    primary: 'hsl(255.9036 95.4023% 82.9412%)',
    primaryForeground: 'hsl(24 9.8039% 10%)',
    secondary: 'hsl(272.5 19.3548% 24.3137%)',
    secondaryForeground: 'hsl(216 12.1951% 83.9216%)',
    muted: 'hsl(265.2632 28.3582% 13.1373%)',
    mutedForeground: 'hsl(217.8947 10.6145% 64.902%)',
    accent: 'hsl(266.8966 19.2053% 29.6078%)',
    accentForeground: 'hsl(216 12.1951% 83.9216%)',
    destructive: 'hsl(0 93.5484% 81.7647%)',
    destructiveForeground: 'hsl(24 9.8039% 10%)',
    border: 'hsl(272.5 19.3548% 24.3137%)',
    input: 'hsl(272.5 19.3548% 24.3137%)',
    ring: 'hsl(255.9036 95.4023% 82.9412%)',
    radius: '1.5rem',
    chart1: 'hsl(255.9036 95.4023% 82.9412%)',
    chart2: 'hsl(255.1351 91.7355% 76.2745%)',
    chart3: 'hsl(258.3117 89.5349% 66.2745%)',
    chart4: 'hsl(262.1229 83.2558% 57.8431%)',
    chart5: 'hsl(263.3898 69.9605% 50.3922%)',
  },

  // Add more dark themes here:
  // 'dark-2': { ... },
  // 'dark-3': { ... },
  // 'dark-4': { ... },
  // 'dark-5': { ... },
  // 'dark-6': { ... },

  // Hot themes (popular/vibrant themes)
  'hot-1': {
    background: 'hsl(24 9.8039% 10%)',
    foreground: 'hsl(226.4516 100% 93.9216%)',
    card: 'hsl(270 17.7778% 17.6471%)',
    cardForeground: 'hsl(226.4516 100% 93.9216%)',
    popover: 'hsl(270 17.7778% 17.6471%)',
    popoverForeground: 'hsl(226.4516 100% 93.9216%)',
    primary: 'hsl(255.9036 95.4023% 82.9412%)',
    primaryForeground: 'hsl(24 9.8039% 10%)',
    secondary: 'hsl(272.5 19.3548% 24.3137%)',
    secondaryForeground: 'hsl(216 12.1951% 83.9216%)',
    muted: 'hsl(265.2632 28.3582% 13.1373%)',
    mutedForeground: 'hsl(217.8947 10.6145% 64.902%)',
    accent: 'hsl(266.8966 19.2053% 29.6078%)',
    accentForeground: 'hsl(216 12.1951% 83.9216%)',
    destructive: 'hsl(0 93.5484% 81.7647%)',
    destructiveForeground: 'hsl(24 9.8039% 10%)',
    border: 'hsl(272.5 19.3548% 24.3137%)',
    input: 'hsl(272.5 19.3548% 24.3137%)',
    ring: 'hsl(255.9036 95.4023% 82.9412%)',
    radius: '1.5rem',
    chart1: 'hsl(255.9036 95.4023% 82.9412%)',
    chart2: 'hsl(255.1351 91.7355% 76.2745%)',
    chart3: 'hsl(258.3117 89.5349% 66.2745%)',
    chart4: 'hsl(262.1229 83.2558% 57.8431%)',
    chart5: 'hsl(263.3898 69.9605% 50.3922%)',
  },
  'hot-2': {
    background: 'hsl(280 33.3333% 96.4706%)',
    foreground: 'hsl(216.9231 19.1176% 26.6667%)',
    card: 'hsl(0 0% 100%)',
    cardForeground: 'hsl(216.9231 19.1176% 26.6667%)',
    popover: 'hsl(0 0% 100%)',
    popoverForeground: 'hsl(216.9231 19.1176% 26.6667%)',
    primary: 'hsl(255.1351 91.7355% 76.2745%)',
    primaryForeground: 'hsl(0 0% 100%)',
    secondary: 'hsl(267.5676 90.2439% 91.9608%)',
    secondaryForeground: 'hsl(215 13.7931% 34.1176%)',
    muted: 'hsl(268.6957 100% 95.4902%)',
    mutedForeground: 'hsl(220 8.9362% 46.0784%)',
    accent: 'hsl(292.5 44.4444% 92.9412%)',
    accentForeground: 'hsl(216.9231 19.1176% 26.6667%)',
    destructive: 'hsl(0 93.5484% 81.7647%)',
    destructiveForeground: 'hsl(0 0% 100%)',
    border: 'hsl(267.5676 90.2439% 91.9608%)',
    input: 'hsl(267.5676 90.2439% 91.9608%)',
    ring: 'hsl(255.1351 91.7355% 76.2745%)',
    radius: '1.5rem',
    chart1: 'hsl(255.1351 91.7355% 76.2745%)',
    chart2: 'hsl(258.3117 89.5349% 66.2745%)',
    chart3: 'hsl(262.1229 83.2558% 57.8431%)',
    chart4: 'hsl(263.3898 69.9605% 50.3922%)',
    chart5: 'hsl(263.3557 69.3023% 42.1569%)',
  },
  'hot-3': {
    background: 'hsl(280 33.3333% 96.4706%)',
    foreground: 'hsl(216.9231 19.1176% 26.6667%)',
    card: 'hsl(0 0% 100%)',
    cardForeground: 'hsl(216.9231 19.1176% 26.6667%)',
    popover: 'hsl(0 0% 100%)',
    popoverForeground: 'hsl(216.9231 19.1176% 26.6667%)',
    primary: 'hsl(255.1351 91.7355% 76.2745%)',
    primaryForeground: 'hsl(0 0% 100%)',
    secondary: 'hsl(267.5676 90.2439% 91.9608%)',
    secondaryForeground: 'hsl(215 13.7931% 34.1176%)',
    muted: 'hsl(268.6957 100% 95.4902%)',
    mutedForeground: 'hsl(220 8.9362% 46.0784%)',
    accent: 'hsl(292.5 44.4444% 92.9412%)',
    accentForeground: 'hsl(216.9231 19.1176% 26.6667%)',
    destructive: 'hsl(0 93.5484% 81.7647%)',
    destructiveForeground: 'hsl(0 0% 100%)',
    border: 'hsl(267.5676 90.2439% 91.9608%)',
    input: 'hsl(267.5676 90.2439% 91.9608%)',
    ring: 'hsl(255.1351 91.7355% 76.2745%)',
    radius: '1.5rem',
    chart1: 'hsl(255.1351 91.7355% 76.2745%)',
    chart2: 'hsl(258.3117 89.5349% 66.2745%)',
    chart3: 'hsl(262.1229 83.2558% 57.8431%)',
    chart4: 'hsl(263.3898 69.9605% 50.3922%)',
    chart5: 'hsl(263.3557 69.3023% 42.1569%)',
  },
  'hot-4': {
    background: 'hsl(24 9.8039% 10%)',
    foreground: 'hsl(226.4516 100% 93.9216%)',
    card: 'hsl(270 17.7778% 17.6471%)',
    cardForeground: 'hsl(226.4516 100% 93.9216%)',
    popover: 'hsl(270 17.7778% 17.6471%)',
    popoverForeground: 'hsl(226.4516 100% 93.9216%)',
    primary: 'hsl(255.9036 95.4023% 82.9412%)',
    primaryForeground: 'hsl(24 9.8039% 10%)',
    secondary: 'hsl(272.5 19.3548% 24.3137%)',
    secondaryForeground: 'hsl(216 12.1951% 83.9216%)',
    muted: 'hsl(265.2632 28.3582% 13.1373%)',
    mutedForeground: 'hsl(217.8947 10.6145% 64.902%)',
    accent: 'hsl(266.8966 19.2053% 29.6078%)',
    accentForeground: 'hsl(216 12.1951% 83.9216%)',
    destructive: 'hsl(0 93.5484% 81.7647%)',
    destructiveForeground: 'hsl(24 9.8039% 10%)',
    border: 'hsl(272.5 19.3548% 24.3137%)',
    input: 'hsl(272.5 19.3548% 24.3137%)',
    ring: 'hsl(255.9036 95.4023% 82.9412%)',
    radius: '1.5rem',
    chart1: 'hsl(255.9036 95.4023% 82.9412%)',
    chart2: 'hsl(255.1351 91.7355% 76.2745%)',
    chart3: 'hsl(258.3117 89.5349% 66.2745%)',
    chart4: 'hsl(262.1229 83.2558% 57.8431%)',
    chart5: 'hsl(263.3898 69.9605% 50.3922%)',
  },
  'hot-5': {
    background: 'hsl(24 9.8039% 10%)',
    foreground: 'hsl(226.4516 100% 93.9216%)',
    card: 'hsl(270 17.7778% 17.6471%)',
    cardForeground: 'hsl(226.4516 100% 93.9216%)',
    popover: 'hsl(270 17.7778% 17.6471%)',
    popoverForeground: 'hsl(226.4516 100% 93.9216%)',
    primary: 'hsl(255.9036 95.4023% 82.9412%)',
    primaryForeground: 'hsl(24 9.8039% 10%)',
    secondary: 'hsl(272.5 19.3548% 24.3137%)',
    secondaryForeground: 'hsl(216 12.1951% 83.9216%)',
    muted: 'hsl(265.2632 28.3582% 13.1373%)',
    mutedForeground: 'hsl(217.8947 10.6145% 64.902%)',
    accent: 'hsl(266.8966 19.2053% 29.6078%)',
    accentForeground: 'hsl(216 12.1951% 83.9216%)',
    destructive: 'hsl(0 93.5484% 81.7647%)',
    destructiveForeground: 'hsl(24 9.8039% 10%)',
    border: 'hsl(272.5 19.3548% 24.3137%)',
    input: 'hsl(272.5 19.3548% 24.3137%)',
    ring: 'hsl(255.9036 95.4023% 82.9412%)',
    radius: '1.5rem',
    chart1: 'hsl(255.9036 95.4023% 82.9412%)',
    chart2: 'hsl(255.1351 91.7355% 76.2745%)',
    chart3: 'hsl(258.3117 89.5349% 66.2745%)',
    chart4: 'hsl(262.1229 83.2558% 57.8431%)',
    chart5: 'hsl(263.3898 69.9605% 50.3922%)',
  },
  'hot-6': {
    background: 'hsl(24 9.8039% 10%)',
    foreground: 'hsl(226.4516 100% 93.9216%)',
    card: 'hsl(270 17.7778% 17.6471%)',
    cardForeground: 'hsl(226.4516 100% 93.9216%)',
    popover: 'hsl(270 17.7778% 17.6471%)',
    popoverForeground: 'hsl(226.4516 100% 93.9216%)',
    primary: 'hsl(255.9036 95.4023% 82.9412%)',
    primaryForeground: 'hsl(24 9.8039% 10%)',
    secondary: 'hsl(272.5 19.3548% 24.3137%)',
    secondaryForeground: 'hsl(216 12.1951% 83.9216%)',
    muted: 'hsl(265.2632 28.3582% 13.1373%)',
    mutedForeground: 'hsl(217.8947 10.6145% 64.902%)',
    accent: 'hsl(266.8966 19.2053% 29.6078%)',
    accentForeground: 'hsl(216 12.1951% 83.9216%)',
    destructive: 'hsl(0 93.5484% 81.7647%)',
    destructiveForeground: 'hsl(24 9.8039% 10%)',
    border: 'hsl(272.5 19.3548% 24.3137%)',
    input: 'hsl(272.5 19.3548% 24.3137%)',
    ring: 'hsl(255.9036 95.4023% 82.9412%)',
    radius: '1.5rem',
    chart1: 'hsl(255.9036 95.4023% 82.9412%)',
    chart2: 'hsl(255.1351 91.7355% 76.2745%)',
    chart3: 'hsl(258.3117 89.5349% 66.2745%)',
    chart4: 'hsl(262.1229 83.2558% 57.8431%)',
    chart5: 'hsl(263.3898 69.9605% 50.3922%)',
  },
  'hot-7': {
    background: 'hsl(280 33.3333% 96.4706%)',
    foreground: 'hsl(216.9231 19.1176% 26.6667%)',
    card: 'hsl(0 0% 100%)',
    cardForeground: 'hsl(216.9231 19.1176% 26.6667%)',
    popover: 'hsl(0 0% 100%)',
    popoverForeground: 'hsl(216.9231 19.1176% 26.6667%)',
    primary: 'hsl(255.1351 91.7355% 76.2745%)',
    primaryForeground: 'hsl(0 0% 100%)',
    secondary: 'hsl(267.5676 90.2439% 91.9608%)',
    secondaryForeground: 'hsl(215 13.7931% 34.1176%)',
    muted: 'hsl(268.6957 100% 95.4902%)',
    mutedForeground: 'hsl(220 8.9362% 46.0784%)',
    accent: 'hsl(292.5 44.4444% 92.9412%)',
    accentForeground: 'hsl(216.9231 19.1176% 26.6667%)',
    destructive: 'hsl(0 93.5484% 81.7647%)',
    destructiveForeground: 'hsl(0 0% 100%)',
    border: 'hsl(267.5676 90.2439% 91.9608%)',
    input: 'hsl(267.5676 90.2439% 91.9608%)',
    ring: 'hsl(255.1351 91.7355% 76.2745%)',
    radius: '1.5rem',
    chart1: 'hsl(255.1351 91.7355% 76.2745%)',
    chart2: 'hsl(258.3117 89.5349% 66.2745%)',
    chart3: 'hsl(262.1229 83.2558% 57.8431%)',
    chart4: 'hsl(263.3898 69.9605% 50.3922%)',
    chart5: 'hsl(263.3557 69.3023% 42.1569%)',
  },
  'hot-8': {
    background: 'hsl(280 33.3333% 96.4706%)',
    foreground: 'hsl(216.9231 19.1176% 26.6667%)',
    card: 'hsl(0 0% 100%)',
    cardForeground: 'hsl(216.9231 19.1176% 26.6667%)',
    popover: 'hsl(0 0% 100%)',
    popoverForeground: 'hsl(216.9231 19.1176% 26.6667%)',
    primary: 'hsl(255.1351 91.7355% 76.2745%)',
    primaryForeground: 'hsl(0 0% 100%)',
    secondary: 'hsl(267.5676 90.2439% 91.9608%)',
    secondaryForeground: 'hsl(215 13.7931% 34.1176%)',
    muted: 'hsl(268.6957 100% 95.4902%)',
    mutedForeground: 'hsl(220 8.9362% 46.0784%)',
    accent: 'hsl(292.5 44.4444% 92.9412%)',
    accentForeground: 'hsl(216.9231 19.1176% 26.6667%)',
    destructive: 'hsl(0 93.5484% 81.7647%)',
    destructiveForeground: 'hsl(0 0% 100%)',
    border: 'hsl(267.5676 90.2439% 91.9608%)',
    input: 'hsl(267.5676 90.2439% 91.9608%)',
    ring: 'hsl(255.1351 91.7355% 76.2745%)',
    radius: '1.5rem',
    chart1: 'hsl(255.1351 91.7355% 76.2745%)',
    chart2: 'hsl(258.3117 89.5349% 66.2745%)',
    chart3: 'hsl(262.1229 83.2558% 57.8431%)',
    chart4: 'hsl(263.3898 69.9605% 50.3922%)',
    chart5: 'hsl(263.3557 69.3023% 42.1569%)',
  },
  'hot-9': {
    background: 'hsl(280 33.3333% 96.4706%)',
    foreground: 'hsl(216.9231 19.1176% 26.6667%)',
    card: 'hsl(0 0% 100%)',
    cardForeground: 'hsl(216.9231 19.1176% 26.6667%)',
    popover: 'hsl(0 0% 100%)',
    popoverForeground: 'hsl(216.9231 19.1176% 26.6667%)',
    primary: 'hsl(255.1351 91.7355% 76.2745%)',
    primaryForeground: 'hsl(0 0% 100%)',
    secondary: 'hsl(267.5676 90.2439% 91.9608%)',
    secondaryForeground: 'hsl(215 13.7931% 34.1176%)',
    muted: 'hsl(268.6957 100% 95.4902%)',
    mutedForeground: 'hsl(220 8.9362% 46.0784%)',
    accent: 'hsl(292.5 44.4444% 92.9412%)',
    accentForeground: 'hsl(216.9231 19.1176% 26.6667%)',
    destructive: 'hsl(0 93.5484% 81.7647%)',
    destructiveForeground: 'hsl(0 0% 100%)',
    border: 'hsl(267.5676 90.2439% 91.9608%)',
    input: 'hsl(267.5676 90.2439% 91.9608%)',
    ring: 'hsl(255.1351 91.7355% 76.2745%)',
    radius: '1.5rem',
    chart1: 'hsl(255.1351 91.7355% 76.2745%)',
    chart2: 'hsl(258.3117 89.5349% 66.2745%)',
    chart3: 'hsl(262.1229 83.2558% 57.8431%)',
    chart4: 'hsl(263.3898 69.9605% 50.3922%)',
    chart5: 'hsl(263.3557 69.3023% 42.1569%)',
  },
}

/**
 * Get theme colors by theme ID
 */
export function getThemeColors(themeId: string) {
  return THEME[themeId]
}

/**
 * Check if a theme ID exists
 */
export function isValidThemeId(themeId: string): boolean {
  return themeId in THEME
}

/**
 * Generate navigation theme from theme colors
 */
function createNavTheme(
  colors: (typeof THEME)[string],
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

/**
 * Get navigation theme by theme ID
 */
export function getNavTheme(themeId: string): Theme {
  const colors = THEME[themeId]
  if (!colors) {
    // Fallback to default light theme
    return createNavTheme(THEME['light-1'], false)
  }

  // Determine if it's a dark theme based on theme ID
  const isDark = themeId.startsWith('dark-') || themeId.startsWith('hot-')
  return createNavTheme(colors, isDark)
}

/**
 * Legacy support: Map old 'light'/'dark' keys to new theme IDs
 * This ensures backward compatibility
 */
export const NAV_THEME: Record<'light' | 'dark', Theme> = {
  light: getNavTheme('light-1'),
  dark: getNavTheme('dark-1'),
}
