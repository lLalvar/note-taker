import React from 'react'

import { Image } from 'expo-image'
import { Calendar, Gift, Home, NotebookPen } from 'lucide-react-native'
import { Pressable, View } from 'react-native'

import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { getThemeColors } from '@/lib/theme'
import { type ThemeMetadata } from '@/lib/theme-registry'
import { cn, toHsla } from '@/lib/utils'

const bgDark = require('@/assets/images/bg/bg-dark-default.png')
const bgLight = require('@/assets/images/bg/bg-light-default.png')

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
  // Get colors for THIS specific theme (not the current one)
  const previewColors = getThemeColors(themeMetadata.id)!
  const isSelected = selectedThemeId === themeMetadata.id
  const isDark = themeMetadata.id.startsWith('dark-')

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
                source={isDark ? bgDark : bgLight}
                contentFit='cover'
                style={{
                  width: '100%',
                  height: '100%',
                }}
              />
            </View>

            {/* Content Area */}
            <View className='gap-1 px-1.5 py-1'>
              {/* Habit Challenge Card */}
              <View
                className='rounded-md p-1.5'
                style={{
                  backgroundColor: isDark
                    ? previewColors.secondary
                    : toHsla(previewColors.secondary, 0.8),
                }}
              >
                <View className='flex-row items-center justify-between'>
                  <View className='flex-1 gap-1'>
                    <View
                      className='h-1.5 w-16 rounded'
                      style={{
                        backgroundColor: toHsla(previewColors.foreground, 0.8),
                      }}
                    />
                    {/* Progress Bar */}
                    <View className='flex-row items-center gap-1'>
                      <View
                        className='h-0.5 flex-1 rounded-full'
                        style={{
                          backgroundColor: toHsla(previewColors.muted, 0.5),
                        }}
                      >
                        <View
                          className='h-0.5 w-1/3 rounded-full'
                          style={{
                            backgroundColor: previewColors.primary,
                          }}
                        />
                      </View>
                      <View
                        className='h-2 w-2 rounded-full'
                        style={{ backgroundColor: previewColors.primary }}
                      />
                      <View
                        className='h-2 w-2 rounded-full border'
                        style={{
                          borderColor: toHsla(
                            previewColors.mutedForeground,
                            0.5
                          ),
                        }}
                      />
                    </View>
                  </View>
                  <Gift size={12} color={previewColors.primary} />
                </View>
              </View>

              {/* Year Header */}
              <View className='px-1'>
                <View
                  className='h-2 w-8 rounded'
                  style={{
                    backgroundColor: toHsla(previewColors.foreground, 0.9),
                  }}
                />
              </View>

              {/* Note Cards */}
              <View className='gap-1'>
                {/* First Note Card */}
                <View
                  className='rounded-md p-1.5'
                  style={{
                    backgroundColor: isDark
                      ? toHsla(previewColors.card, 0.9)
                      : previewColors.secondary,
                  }}
                >
                  <View className='flex-row items-start gap-1.5'>
                    {/* Date */}
                    <View className='items-center'>
                      <View
                        className='h-2.5 w-3 rounded'
                        style={{
                          backgroundColor: toHsla(
                            previewColors.foreground,
                            0.9
                          ),
                        }}
                      />
                      <View className='mt-0.5 flex-row items-center gap-0.5'>
                        <Calendar
                          size={6}
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
                    {/* Content */}
                    <View className='flex-1 gap-0.5'>
                      <View
                        className='h-1 w-12 rounded'
                        style={{
                          backgroundColor: toHsla(
                            previewColors.foreground,
                            0.7
                          ),
                        }}
                      />
                      <View
                        className='h-0.5 w-full rounded'
                        style={{
                          backgroundColor: toHsla(
                            previewColors.foreground,
                            0.3
                          ),
                        }}
                      />
                    </View>
                    {/* Icon */}
                    <NotebookPen size={10} color={previewColors.primary} />
                  </View>
                </View>

                {/* Second Note Card */}
                <View
                  className='rounded-md p-1.5'
                  style={{
                    backgroundColor: isDark
                      ? toHsla(previewColors.card, 0.9)
                      : previewColors.secondary,
                  }}
                >
                  <View className='flex-row items-start gap-1.5'>
                    {/* Date */}
                    <View className='items-center'>
                      <View
                        className='h-2.5 w-3 rounded'
                        style={{
                          backgroundColor: toHsla(
                            previewColors.foreground,
                            0.9
                          ),
                        }}
                      />
                      <View className='mt-0.5 flex-row items-center gap-0.5'>
                        <Calendar
                          size={6}
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
                    {/* Content */}
                    <View className='flex-1 gap-0.5'>
                      <View
                        className='h-1 w-10 rounded'
                        style={{
                          backgroundColor: toHsla(
                            previewColors.foreground,
                            0.7
                          ),
                        }}
                      />
                      <View
                        className='h-0.5 w-3/4 rounded'
                        style={{
                          backgroundColor: toHsla(
                            previewColors.foreground,
                            0.3
                          ),
                        }}
                      />
                    </View>
                    {/* Icon */}
                    <NotebookPen size={10} color={previewColors.primary} />
                  </View>
                </View>
              </View>
            </View>

            {/* Bottom Navigation Bar */}
            <View
              className='absolute bottom-0 left-0 right-0 h-3 flex-row items-center justify-between px-2'
              style={{
                backgroundColor: previewColors.card,
              }}
            >
              <Home size={8} color={previewColors.mutedForeground} />
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
              <View
                className='h-2 w-2 rounded-full'
                style={{
                  backgroundColor: toHsla(previewColors.mutedForeground, 0.5),
                }}
              />
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
