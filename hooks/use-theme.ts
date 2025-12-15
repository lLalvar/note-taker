import { useEffect, useMemo } from 'react'

import { useColorScheme, vars } from 'nativewind'

import { getNavTheme, getThemeColors } from '@/lib/theme'
import {
  getThemeCSSVariables,
  updateThemeCSSVariables,
} from '@/lib/theme-css-sync'
import { getThemeMetadata } from '@/lib/theme-registry'
import { useThemeStore } from '@/store/theme-store'

export function useTheme() {
  const { setColorScheme } = useColorScheme()
  const { theme: storedThemeId, initialize, getCategory } = useThemeStore()

  useEffect(() => {
    initialize()
  }, [initialize])

  const effectiveThemeId = useMemo(() => {
    return storedThemeId
  }, [storedThemeId])

  useEffect(() => {
    updateThemeCSSVariables(effectiveThemeId)
  }, [effectiveThemeId])

  const cssVariables = useMemo(() => {
    const allVars = getThemeCSSVariables(effectiveThemeId)
    // Only pass color-related variables to vars()
    // Exclude radius, shadows, etc. as they're handled by CSS
    const colorVars = Object.fromEntries(
      Object.entries(allVars).filter(
        ([key]) =>
          !key.includes('radius') &&
          !key.includes('shadow') &&
          !key.includes('font') &&
          !key.includes('tracking') &&
          !key.includes('spacing')
      )
    )
    return vars(colorVars)
  }, [effectiveThemeId])

  useEffect(() => {
    const category = getCategory()
    if (category === 'light') {
      setColorScheme('light')
    } else if (category === 'dark' || category === 'hot') {
      setColorScheme('dark')
    }
  }, [storedThemeId, getCategory, setColorScheme])

  const colors = useMemo(() => {
    const themeColors = getThemeColors(effectiveThemeId)
    if (!themeColors) {
      return getThemeColors('light-1')!
    }
    return themeColors
  }, [effectiveThemeId])

  // Get navigation theme
  const navTheme = useMemo(() => {
    return getNavTheme(effectiveThemeId)
  }, [effectiveThemeId])

  const isDark = useMemo(() => {
    return effectiveThemeId.startsWith('dark-')
  }, [effectiveThemeId])

  const themeMetadata = useMemo(() => {
    return getThemeMetadata(effectiveThemeId)
  }, [effectiveThemeId])

  return {
    theme: effectiveThemeId,
    themeMetadata,
    colors,
    navTheme,
    isDark,
    colorScheme: isDark ? 'dark' : 'light',
    storedThemeId,
    category: getCategory(),
    cssVariables,
  }
}
