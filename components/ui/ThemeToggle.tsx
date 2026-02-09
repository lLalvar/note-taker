import React, { useCallback, useRef } from 'react'

import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { useLingui } from '@lingui/react/macro'
import { MoonStar, Sun } from 'lucide-react-native'
import { ScrollView, View } from 'react-native'

import { ThemeCard } from '@/components/theme-card'
import { BottomSheet } from '@/components/ui/bottom-sheet'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'
import { THEME_REGISTRY } from '@/lib/theme-registry'
import { useThemeStore } from '@/store/theme-store'

export function ThemeToggle() {
  const { t } = useLingui()
  const { theme: selectedThemeId, setTheme, getCategory } = useThemeStore()
  const bottomSheetRef = useRef<BottomSheetModal>(null)

  const handlePress = useCallback(() => {
    bottomSheetRef.current?.present()
  }, [])

  const handleThemeChange = useCallback(
    (themeId: string) => {
      setTheme(themeId)
      bottomSheetRef.current?.dismiss()
    },
    [setTheme]
  )

  const effectiveCategory = getCategory()
  const isDark = effectiveCategory === 'dark'

  return (
    <>
      <Button
        onPressIn={handlePress}
        size='icon'
        variant='ghost'
        className='ios:size-9 rounded-full web:mx-4'
        accessibilityLabel={t`Select theme`}
      >
        <Icon as={isDark ? MoonStar : Sun} />
      </Button>

      <BottomSheet ref={bottomSheetRef} snapPoints={['75%', '90%']}>
        <View className='flex-1 px-4 pb-4'>
          <Text className='mb-4 text-lg font-semibold'>{t`Select Theme`}</Text>
          <ScrollView
            contentContainerStyle={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 12,
            }}
            showsVerticalScrollIndicator={false}
          >
            {THEME_REGISTRY.map((themeMetadata) => (
              <ThemeCard
                key={themeMetadata.id}
                themeMetadata={themeMetadata}
                selectedThemeId={selectedThemeId}
                onThemeChange={handleThemeChange}
              />
            ))}
          </ScrollView>
        </View>
      </BottomSheet>
    </>
  )
}
