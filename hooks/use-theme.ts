import { useEffect, useMemo } from 'react'

import { useColorScheme } from 'nativewind'

import { getNavTheme, getThemeColors } from '@/lib/theme'
import { getThemeMetadata } from '@/lib/theme-registry'
import { useThemeStore } from '@/store/theme-store'

export function useTheme() {
  const { setColorScheme } = useColorScheme()
  const { theme: storedThemeId, initialize, getCategory } = useThemeStore()

  // Initialize theme store on mount
  useEffect(() => {
    initialize()
  }, [initialize])

  // Determine effective theme ID
  const effectiveThemeId = useMemo(() => {
    return storedThemeId
  }, [storedThemeId])

  // Update NativeWind colorScheme based on stored theme preference
  useEffect(() => {
    // Determine if theme is dark based on theme ID
    const category = getCategory()
    if (category === 'light') {
      setColorScheme('light')
    } else if (category === 'dark' || category === 'hot') {
      setColorScheme('dark')
    }
  }, [storedThemeId, getCategory, setColorScheme])

  // Get theme colors
  const colors = useMemo(() => {
    const themeColors = getThemeColors(effectiveThemeId)
    if (!themeColors) {
      // Fallback to default light theme
      return getThemeColors('light-1')!
    }
    return themeColors
  }, [effectiveThemeId])

  // Get navigation theme
  const navTheme = useMemo(() => {
    return getNavTheme(effectiveThemeId)
  }, [effectiveThemeId])

  // Determine if dark theme
  const isDark = useMemo(() => {
    return (
      effectiveThemeId.startsWith('dark-') ||
      effectiveThemeId.startsWith('hot-')
    )
  }, [effectiveThemeId])

  // Get theme metadata
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
  }
}
