import React from 'react'

import { Trans } from '@lingui/react/macro'
import { Image } from 'expo-image'
import { Calendar, Home, NotebookPen, User } from 'lucide-react-native'
import { Pressable, View } from 'react-native'

import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'
import { getThemeBackgroundImage, getThemeColors } from '@/lib/theme'
import { type ThemeMetadata } from '@/lib/theme-registry'
import { cn, toHsla } from '@/lib/utils'

interface ThemeCardProps {
  themeMetadata: ThemeMetadata
  selectedThemeId: string
  onThemeChange: (themeId: string) => void
}

export const ThemeCard = React.memo(function ThemeCard({
  themeMetadata,
  selectedThemeId,
  onThemeChange,
}: ThemeCardProps) {
  const previewColors = getThemeColors(themeMetadata.id)!
  const isSelected = selectedThemeId === themeMetadata.id
  const backgroundImage = getThemeBackgroundImage(themeMetadata.id)

  return (
    <View className='mb-4 w-[31%]'>
      {/* Theme Preview Card */}
      <View className='relative overflow-hidden rounded-xl'>
        <Pressable
          onPress={() => onThemeChange(themeMetadata.id)}
          className='overflow-hidden rounded-xl'
          style={{
            backgroundColor: previewColors.card,
          }}
        >
          {/* Preview Layout - Scaled down app layout */}
          <View
            className='relative'
            style={{
              backgroundColor: previewColors.background,
              minHeight: 200,
            }}
          >
            {/* Header Image/Banner */}
            <View className='relative h-12 w-full overflow-hidden'>
              <Image
                source={backgroundImage}
                contentFit='cover'
                style={{
                  width: '100%',
                  height: '100%',
                }}
              />
            </View>

            {/* Content Area */}
            <View className='gap-1 px-1.5 py-1'>
              {/* Year Header */}
              <View className='px-1 pt-1.5'>
                <View
                  className='h-2 w-8 rounded'
                  style={{
                    backgroundColor: toHsla(previewColors.mutedForeground, 0.8),
                  }}
                />
              </View>

              {/* Note Cards */}
              <View className='gap-1 px-1 pt-1'>
                {/* First Note Card */}
                <View
                  className='rounded-md p-1.5'
                  style={{
                    backgroundColor: previewColors.card,
                  }}
                >
                  <View className='flex-row items-start gap-1.5'>
                    {/* Date Section */}
                    <View className='items-center'>
                      <View
                        className='h-3 w-4 rounded'
                        style={{
                          backgroundColor: toHsla(
                            previewColors.foreground,
                            0.9
                          ),
                        }}
                      />
                      <View className='mt-0.5 flex-row items-center gap-0.5'>
                        <Icon
                          as={Calendar}
                          className='size-1.5'
                          color={previewColors.mutedForeground}
                        />
                        <View
                          className='h-1 w-3 rounded'
                          style={{
                            backgroundColor: toHsla(
                              previewColors.mutedForeground,
                              0.6
                            ),
                          }}
                        />
                      </View>
                    </View>
                    {/* Content Section */}
                    <View className='flex-1 gap-0.5'>
                      <View
                        className='h-1 w-12 rounded'
                        style={{
                          backgroundColor: toHsla(
                            previewColors.foreground,
                            0.8
                          ),
                        }}
                      />
                      <View
                        className='h-0.5 w-full rounded'
                        style={{
                          backgroundColor: toHsla(
                            previewColors.mutedForeground,
                            0.5
                          ),
                        }}
                      />
                    </View>
                    {/* Icon */}
                    <View className='items-center justify-center'>
                      <Icon
                        as={NotebookPen}
                        className='size-2.5'
                        color={previewColors.primary}
                      />
                    </View>
                  </View>
                </View>

                {/* Second Note Card */}
                <View
                  className='rounded-md p-1.5'
                  style={{
                    backgroundColor: previewColors.card,
                  }}
                >
                  <View className='flex-row items-start gap-1.5'>
                    {/* Date Section */}
                    <View className='items-center'>
                      <View
                        className='h-3 w-4 rounded'
                        style={{
                          backgroundColor: toHsla(
                            previewColors.foreground,
                            0.9
                          ),
                        }}
                      />
                      <View className='mt-0.5 flex-row items-center gap-0.5'>
                        <Icon
                          as={Calendar}
                          className='size-1.5'
                          color={previewColors.mutedForeground}
                        />
                        <View
                          className='h-1 w-3 rounded'
                          style={{
                            backgroundColor: toHsla(
                              previewColors.mutedForeground,
                              0.6
                            ),
                          }}
                        />
                      </View>
                    </View>
                    {/* Content Section */}
                    <View className='flex-1 gap-0.5'>
                      <View
                        className='h-1 w-10 rounded'
                        style={{
                          backgroundColor: toHsla(
                            previewColors.foreground,
                            0.8
                          ),
                        }}
                      />
                      <View
                        className='h-0.5 w-3/4 rounded'
                        style={{
                          backgroundColor: toHsla(
                            previewColors.mutedForeground,
                            0.5
                          ),
                        }}
                      />
                    </View>
                    {/* Icon */}
                    <View className='items-center justify-center'>
                      <Icon
                        as={NotebookPen}
                        className='size-2.5'
                        color={previewColors.primary}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* Bottom Navigation Bar */}
            <View
              className='absolute bottom-0 left-0 right-0 h-6 flex-row items-center justify-between px-2'
              style={{
                backgroundColor: previewColors.card,
              }}
            >
              <Icon as={Home} size={8} color={previewColors.mutedForeground} />
              <View
                className='h-4 w-4 items-center justify-center rounded-full'
                style={{ backgroundColor: previewColors.primary }}
              >
                <View
                  className='h-2 w-2 rounded-full'
                  style={{
                    backgroundColor: previewColors.primaryForeground,
                  }}
                />
              </View>
              <Icon as={User} size={8} color={previewColors.mutedForeground} />
            </View>
          </View>
        </Pressable>
        {/* Outline overlay - doesn't affect layout */}
        {isSelected && (
          <View
            className='absolute inset-0 rounded-xl'
            style={{
              borderWidth: 2,
              borderColor: previewColors.primary,
              pointerEvents: 'none',
            }}
          />
        )}
      </View>

      {/* APPLY Button */}
      <Button
        onPress={() => onThemeChange(themeMetadata.id)}
        variant={isSelected ? 'default' : 'outline'}
        className='mt-2 w-full'
      >
        <Text>
          <Trans>Apply</Trans>
        </Text>
      </Button>
    </View>
  )
})
