import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { Trans } from '@lingui/react/macro'
import { InteractionManager, Pressable, ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { ThemeCard } from '@/components/theme-card'
import { ScreenHeader } from '@/components/ui/screen-header'
import { Text } from '@/components/ui/text'
import { getNewThemes, getThemesByCategory } from '@/lib/theme-registry'
import { cn } from '@/lib/utils'
import { useThemeStore } from '@/store/theme-store'

type DisplayCategory = 'new' | 'light' | 'dark'

export default function Theme() {
  const insets = useSafeAreaInsets()
  const { theme: selectedThemeId, setTheme } = useThemeStore()
  const [selectedCategory, setSelectedCategory] =
    useState<DisplayCategory>('new')
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const interaction = InteractionManager.runAfterInteractions(() => {
      setIsReady(true)
    })

    return () => {
      interaction.cancel()
    }
  }, [])

  const handleThemeChange = useCallback(
    (themeId: string) => {
      setTheme(themeId)
    },
    [setTheme]
  )

  const themes = useMemo(
    () =>
      selectedCategory === 'new'
        ? getNewThemes()
        : getThemesByCategory(selectedCategory),
    [selectedCategory]
  )

  const categories: { id: DisplayCategory; label: string }[] = [
    { id: 'new', label: 'NEW' },
    { id: 'light', label: 'LIGHT' },
    { id: 'dark', label: 'DARK' },
  ]

  return (
    <View className='flex-1 bg-background' style={{ paddingTop: insets.top }}>
      <ScreenHeader title={<Trans>Themes</Trans>} />

      {/* Category Tabs */}
      <View className='flex-row border-b border-border px-4'>
        {categories.map((category) => {
          const isSelected = selectedCategory === category.id
          return (
            <Pressable
              key={category.id}
              onPress={() => setSelectedCategory(category.id)}
              className='flex-1 items-center py-4'
            >
              <Text
                className={cn(
                  'font-medium',
                  isSelected ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {category.label}
              </Text>
              {isSelected && (
                <View className='absolute bottom-0 left-0 right-0 h-0.5 bg-primary' />
              )}
            </Pressable>
          )
        })}
      </View>

      {/* Theme Grid */}
      <ScrollView
        className='flex-1'
        contentContainerStyle={{
          padding: 16,
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 12,
        }}
        showsVerticalScrollIndicator={false}
      >
        {isReady
          ? themes.map((themeMetadata) => (
              <ThemeCard
                key={themeMetadata.id}
                themeMetadata={themeMetadata}
                selectedThemeId={selectedThemeId}
                onThemeChange={handleThemeChange}
              />
            ))
          : null}
      </ScrollView>
    </View>
  )
}
