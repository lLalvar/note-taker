import React from 'react'

import { Pressable, View } from 'react-native'

import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { useTheme } from '@/hooks/use-theme'
import { type ThemeMetadata } from '@/lib/theme-registry'
import { cn } from '@/lib/utils'

interface ThemeCardProps {
  themeMetadata: ThemeMetadata
  selectedThemeId: string
  onThemeChange: (themeId: string) => void
}

export function ThemeCard({
  themeMetadata,
  selectedThemeId,
  onThemeChange,
}: ThemeCardProps) {
  const { colors } = useTheme()
  const isSelected = selectedThemeId === themeMetadata.id

  return (
    <View className='mb-4 w-[31%]'>
      {/* Theme Preview Card */}
      <Pressable
        onPress={() => onThemeChange(themeMetadata.id)}
        className={cn(
          'overflow-hidden rounded-xl bg-card',
          isSelected ? 'border-2 border-primary' : 'border border-border'
        )}
      >
        {/* FREE Label */}
        {/* {themeMetadata.isFree && (
          <View className='absolute left-2 top-2 z-10 rounded bg-primary px-2 py-1'>
            <Text className='text-xs font-bold text-primary-foreground'>
              FREE
            </Text>
          </View>
        )} */}

        {/* Preview Background */}
        <View
          className='relative aspect-[5/6] items-center justify-center'
          style={{
            backgroundColor: themeMetadata.previewColor || colors.muted,
          }}
        >
          {/* Mock UI Elements Overlay */}
          <View className='absolute bottom-2 left-2 right-2 gap-1'>
            {/* Mock chat bubbles */}
            <View className='max-w-[60%] self-start rounded-lg bg-foreground/40 p-1.5'>
              <View className='h-2 w-10 rounded bg-foreground/60' />
            </View>
            <View className='max-w-[60%] self-end rounded-lg bg-foreground/40 p-1.5'>
              <View className='h-2 w-7 rounded bg-foreground/60' />
            </View>
          </View>

          {/* Mock navigation bar */}
          <View className='absolute bottom-0 left-0 right-0 h-6 flex-row items-center justify-center gap-5 bg-foreground/30'>
            <View className='h-4 w-4 rounded-full bg-foreground/50' />
            <View
              className='h-5 w-5 rounded-full'
              style={{ backgroundColor: colors.primary }}
            />
            <View className='h-4 w-4 rounded-full bg-foreground/50' />
          </View>
        </View>
      </Pressable>

      {/* APPLY Button */}
      <Button
        onPress={() => onThemeChange(themeMetadata.id)}
        variant={isSelected ? 'default' : 'outline'}
        className='mt-2 w-full'
      >
        <Text
          className={cn(
            'text-sm font-medium',
            isSelected ? 'text-primary-foreground' : 'text-foreground'
          )}
        >
          APPLY
        </Text>
      </Button>
    </View>
  )
}
