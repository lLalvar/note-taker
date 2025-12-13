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
    return storedThemeId || 'light-1'
  }, [storedThemeId])

  useEffect(() => {
    if (effectiveThemeId) {
      updateThemeCSSVariables(effectiveThemeId)
    }
  }, [effectiveThemeId])

  const cssVariables = useMemo(() => {
    const variables = getThemeCSSVariables(effectiveThemeId)
    const result = vars(variables)
    // Ensure we always return a valid object with CSS variables
    if (!result || Object.keys(result).length === 0) {
      console.warn('cssVariables is empty, falling back to direct variables', {
        effectiveThemeId,
        variablesKeys: Object.keys(variables),
      })
      // If vars() fails, return the variables directly formatted for React Native
      return variables
    }
    return result
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
