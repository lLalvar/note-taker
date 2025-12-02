import { useColorScheme } from 'nativewind'

import { NAV_THEME, THEME } from '@/lib/theme'

type AppThemeName = keyof typeof THEME

export function useTheme() {
  const { colorScheme } = useColorScheme()

  const theme: AppThemeName = colorScheme ?? 'light'
  const colors = THEME[theme]
  const navTheme = NAV_THEME[theme]
  const isDark = theme === 'dark'

  return {
    theme,
    colors,
    navTheme,
    isDark,
    colorScheme,
  }
}
