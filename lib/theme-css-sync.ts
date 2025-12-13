/**
 * Theme CSS Variable Synchronization
 *
 * This utility syncs theme colors from theme.ts to CSS variables in global.css
 * This allows NativeWind classes (like bg-background) to work with the selected theme
 */
import { getThemeColors } from './theme'

/**
 * Converts HSL color string to CSS variable format
 * Example: 'hsl(280 33.3333% 96.4706%)' -> '280 33.3333% 96.4706%'
 */
function hslToCssVariable(hsl: string): string {
  // Remove 'hsl(' and ')' wrapper, keep the inner values
  return hsl.replace(/^hsl\(/, '').replace(/\)$/, '')
}

/**
 * Gets CSS variables as an object for NativeWind's vars() function
 * Only includes theme-specific variables from THEME object
 *
 * To add new theme variables:
 * 1. Add the color to THEME object in theme.ts
 * 2. Add the mapping below (CSS variable name -> theme color key)
 */
export function getThemeCSSVariables(themeId: string): Record<string, string> {
  const colors = getThemeColors(themeId)
  if (!colors) {
    console.warn(`Theme ${themeId} not found, using light-1`)
    return getThemeCSSVariables('light-1')
  }

  // Map all theme properties to CSS variables
  // All variables from global.css (lines 22-73) are included here
  return {
    // Color variables
    '--background': hslToCssVariable(colors.background),
    '--foreground': hslToCssVariable(colors.foreground),
    '--card': hslToCssVariable(colors.card),
    '--card-foreground': hslToCssVariable(colors.cardForeground),
    '--popover': hslToCssVariable(colors.popover),
    '--popover-foreground': hslToCssVariable(colors.popoverForeground),
    '--primary': hslToCssVariable(colors.primary),
    '--primary-foreground': hslToCssVariable(colors.primaryForeground),
    '--secondary': hslToCssVariable(colors.secondary),
    '--secondary-foreground': hslToCssVariable(colors.secondaryForeground),
    '--muted': hslToCssVariable(colors.muted),
    '--muted-foreground': hslToCssVariable(colors.mutedForeground),
    '--accent': hslToCssVariable(colors.accent),
    '--accent-foreground': hslToCssVariable(colors.accentForeground),
    '--destructive': hslToCssVariable(colors.destructive),
    '--destructive-foreground': hslToCssVariable(colors.destructiveForeground),
    '--border': hslToCssVariable(colors.border),
    '--input': hslToCssVariable(colors.input),
    '--ring': hslToCssVariable(colors.ring),
    '--chart-1': hslToCssVariable(colors.chart1),
    '--chart-2': hslToCssVariable(colors.chart2),
    '--chart-3': hslToCssVariable(colors.chart3),
    '--chart-4': hslToCssVariable(colors.chart4),
    '--chart-5': hslToCssVariable(colors.chart5),
    // Sidebar variables
    '--sidebar': hslToCssVariable(colors.sidebar),
    '--sidebar-foreground': hslToCssVariable(colors.sidebarForeground),
    '--sidebar-primary': hslToCssVariable(colors.sidebarPrimary),
    '--sidebar-primary-foreground': hslToCssVariable(
      colors.sidebarPrimaryForeground
    ),
    '--sidebar-accent': hslToCssVariable(colors.sidebarAccent),
    '--sidebar-accent-foreground': hslToCssVariable(
      colors.sidebarAccentForeground
    ),
    '--sidebar-border': hslToCssVariable(colors.sidebarBorder),
    '--sidebar-ring': hslToCssVariable(colors.sidebarRing),
    // Font variables
    '--font-sans': colors.fontSans,
    '--font-serif': colors.fontSerif,
    '--font-mono': colors.fontMono,
    // Radius
    '--radius': colors.radius,
    // Shadow variables
    '--shadow-x': colors.shadowX,
    '--shadow-y': colors.shadowY,
    '--shadow-blur': colors.shadowBlur,
    '--shadow-spread': colors.shadowSpread,
    '--shadow-opacity': colors.shadowOpacity,
    '--shadow-color': colors.shadowColor,
    '--shadow-2xs': colors.shadow2xs,
    '--shadow-xs': colors.shadowXs,
    '--shadow-sm': colors.shadowSm,
    '--shadow': colors.shadow,
    '--shadow-md': colors.shadowMd,
    '--shadow-lg': colors.shadowLg,
    '--shadow-xl': colors.shadowXl,
    '--shadow-2xl': colors.shadow2xl,
    // Typography & spacing
    '--tracking-normal': colors.trackingNormal,
    '--spacing': colors.spacing,
  }
}

/**
 * Updates CSS variables on the document root based on the selected theme
 * This function works in web environments (React Native Web)
 */
export function updateThemeCSSVariables(themeId: string): void {
  // Only run in web environment
  if (typeof document === 'undefined') {
    return
  }

  const colors = getThemeColors(themeId)
  if (!colors) {
    console.warn(`Theme ${themeId} not found, skipping CSS variable update`)
    return
  }

  const root = document.documentElement
  const isDark = themeId.startsWith('dark-')

  // Use the same function to get all CSS variables (includes static ones)
  const cssVariableMap = getThemeCSSVariables(themeId)

  // Update CSS variables on :root
  Object.entries(cssVariableMap).forEach(([key, value]) => {
    root.style.setProperty(key, value)
  })

  // Update dark mode class on document
  if (isDark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}
