import React, { useState } from 'react'

import { Trans } from '@lingui/react/macro'
import { useRouter } from 'expo-router'
import { ArrowLeft } from 'lucide-react-native'
import { Pressable, ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { ThemeCard } from '@/components/theme-card'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'
import { getNewThemes, getThemesByCategory } from '@/lib/theme-registry'
import { cn } from '@/lib/utils'
import { useThemeStore } from '@/store/theme-store'

type DisplayCategory = 'new' | 'light' | 'dark'

export default function Theme() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { theme: selectedThemeId, setTheme } = useThemeStore()
  const [selectedCategory, setSelectedCategory] =
    useState<DisplayCategory>('new')

  const handleThemeChange = (themeId: string) => {
    setTheme(themeId)
  }

  // Get themes for selected category
  const themes =
    selectedCategory === 'new'
      ? getNewThemes()
      : getThemesByCategory(selectedCategory)

  const categories: { id: DisplayCategory; label: string }[] = [
    { id: 'new', label: 'NEW' },
    { id: 'light', label: 'LIGHT' },
    { id: 'dark', label: 'DARK' },
  ]

  return (
    <View className='flex-1 bg-background' style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className='flex-row items-center gap-4 px-6 py-4'>
        <Button variant='ghost' size='icon' onPress={() => router.back()}>
          <Icon as={ArrowLeft} />
        </Button>
        <Text className='flex-1 text-2xl font-bold text-foreground'>
          <Trans>Themes</Trans>
        </Text>
      </View>

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
        {themes.map((themeMetadata) => (
          <ThemeCard
            key={themeMetadata.id}
            themeMetadata={themeMetadata}
            selectedThemeId={selectedThemeId}
            onThemeChange={handleThemeChange}
          />
        ))}
      </ScrollView>
    </View>
  )
}
