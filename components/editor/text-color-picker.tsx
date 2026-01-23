import React, { useMemo } from 'react'

import { useLingui } from '@lingui/react/macro'
import { Pressable, View } from 'react-native'

import { Text } from '@/components/ui/text'
import { useTheme } from '@/hooks/use-theme'
import { cn } from '@/lib/utils'

const TEXT_COLORS = [
  { name: 'Gray', value: 'hsl(0 0% 50%)' },
  { name: 'Red', value: 'hsl(0 84% 60%)' },
  { name: 'Orange', value: 'hsl(25 95% 53%)' },
  { name: 'Yellow', value: 'hsl(45 93% 47%)' },
  { name: 'Green', value: 'hsl(142 71% 45%)' },
  { name: 'Blue', value: 'hsl(217 91% 60%)' },
  { name: 'Purple', value: 'hsl(271 91% 65%)' },
  { name: 'Pink', value: 'hsl(330 81% 60%)' },
]

interface TextColorPickerProps {
  currentColor?: string
  onColorSelect: (color: string | undefined) => void
}

export function TextColorPicker({
  currentColor,
  onColorSelect,
}: TextColorPickerProps) {
  const { t } = useLingui()
  const { colors } = useTheme()

  const allColors = useMemo(
    () => [{ name: 'Default', value: colors.foreground }, ...TEXT_COLORS],
    [colors.foreground]
  )

  return (
    <View className='px-4 pb-4'>
      <Text className='mb-6 text-lg font-semibold text-foreground'>
        {t`Text Color`}
      </Text>
      <View className='flex-row flex-wrap' style={{ gap: 12 }}>
        {allColors.map((colorOption) => {
          // When currentColor is undefined, select the foreground color
          const isSelected =
            (currentColor === undefined &&
              colorOption.value === colors.foreground) ||
            colorOption.value === currentColor

          return (
            <Pressable
              key={colorOption.name}
              onPress={() => onColorSelect(colorOption.value)}
              className={cn(
                'items-center justify-center rounded-lg border-2 p-3',
                isSelected
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-background'
              )}
              style={{ width: '22%', minWidth: 70 }}
            >
              <View
                className='h-8 w-8 rounded-full'
                style={{ backgroundColor: colorOption.value }}
              />
              <Text className='mt-2 text-xs text-foreground'>
                {colorOption.name}
              </Text>
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}
