import React, { useState } from 'react'

import { LinearGradient } from 'expo-linear-gradient'
import {
  Calendar,
  Crown,
  Gift,
  Menu,
  MoreVertical,
  Search,
  X,
} from 'lucide-react-native'
import { ScrollView, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { SideDrawer } from '@/components/side-drawer'
import { Card, CardContent } from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import { useTheme } from '@/hooks/use-theme'

// Mock data for journal entries
const journalEntries = [
  {
    id: '1',
    date: '04 Dec',
    day: '04',
    month: 'Dec',
    isDraft: true,
    content: 'What is the weather today?',
    emoji: '😢',
  },
  {
    id: '2',
    date: '04 Dec',
    day: '04',
    month: 'Dec',
    isDraft: true,
    content: 'Sdf\nDggg',
    emoji: '😢',
  },
]

export default function HomeScreen() {
  const { colors, isDark } = useTheme()
  const [showChallenge, setShowChallenge] = useState(true)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  return (
    <SafeAreaView className='flex-1 bg-background' edges={['top']}>
      <ScrollView
        className='flex-1'
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className='flex-row items-center justify-between px-4 pb-4 pt-2'>
          <TouchableOpacity onPress={() => setIsDrawerOpen(true)}>
            <Menu size={24} color={colors.foreground} />
          </TouchableOpacity>
          <View className='flex-row items-center gap-3'>
            <View className='flex-row items-center gap-1.5 rounded-full bg-primary/20 px-3 py-1'>
              <Crown size={14} color={colors.primary} fill={colors.primary} />
              <Text className='text-xs font-semibold text-primary'>PRO</Text>
            </View>
            <TouchableOpacity>
              <Search size={24} color={colors.foreground} />
            </TouchableOpacity>
            <TouchableOpacity>
              <MoreVertical size={24} color={colors.foreground} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Landscape Header Image */}
        <View className='relative h-48 w-full overflow-hidden'>
          <LinearGradient
            colors={
              (isDark
                ? [
                    'hsl(220 30% 20%)',
                    'hsl(220 25% 25%)',
                    'hsl(220 20% 30%)',
                    'hsl(30 20% 25%)',
                    'hsl(340 20% 30%)',
                  ]
                : ['#87CEEB', '#B0E0E6', '#E0F6FF', '#FFE4B5', '#FFB6C1']) as [
                string,
                string,
                ...string[],
              ]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />
          {/* Simple mountain illustration using View components */}
          <View className='absolute bottom-0 left-0 right-0'>
            {/* Mountains */}
            <View
              className='absolute bottom-0 h-24 w-32'
              style={{
                backgroundColor: isDark
                  ? 'hsl(220 30% 30%)'
                  : 'rgba(96, 165, 250, 0.6)',
              }}
            />
            <View
              className='absolute bottom-0 left-16 h-32 w-40'
              style={{
                backgroundColor: isDark
                  ? 'hsl(220 35% 35%)'
                  : 'rgba(59, 130, 246, 0.6)',
                transform: [{ skewX: '-15deg' }],
              }}
            />
            <View
              className='absolute bottom-0 right-8 h-20 w-28'
              style={{
                backgroundColor: isDark
                  ? 'hsl(220 25% 25%)'
                  : 'rgba(147, 197, 253, 0.6)',
                transform: [{ skewX: '10deg' }],
              }}
            />
            {/* Trees */}
            <View
              className='absolute bottom-0 left-8 h-12 w-6'
              style={{
                backgroundColor: isDark
                  ? 'hsl(120 30% 25%)'
                  : 'rgba(22, 163, 74, 0.7)',
              }}
            />
            <View
              className='absolute bottom-0 left-12 h-10 w-4'
              style={{
                backgroundColor: isDark
                  ? 'hsl(120 35% 20%)'
                  : 'rgba(21, 128, 61, 0.7)',
              }}
            />
            <View
              className='absolute bottom-0 right-12 h-14 w-6'
              style={{
                backgroundColor: isDark
                  ? 'hsl(120 30% 25%)'
                  : 'rgba(22, 163, 74, 0.7)',
              }}
            />
          </View>
        </View>

        {/* 3-Day Habit Challenge Card */}
        {showChallenge && (
          <View className='px-4 pt-4'>
            <Card
              className='relative overflow-hidden'
              style={{
                backgroundColor: isDark
                  ? colors.secondary
                  : `${colors.secondary}CC`, // 80% opacity
                borderColor: colors.border,
              }}
            >
              <CardContent className='p-4'>
                <View className='flex-row items-center justify-between'>
                  <View className='flex-1 gap-3'>
                    <Text className='text-base font-semibold text-foreground'>
                      3-Day Habit Challenge
                    </Text>
                    {/* Progress Bar */}
                    <View className='flex-row items-center gap-2'>
                      <View
                        className='h-2 flex-1 rounded-full'
                        style={{
                          backgroundColor: isDark
                            ? colors.muted
                            : `${colors.muted}80`,
                        }}
                      >
                        <View
                          className='h-2 w-1/3 rounded-full'
                          style={{ backgroundColor: colors.primary }}
                        />
                      </View>
                      <View
                        className='h-6 w-6 items-center justify-center rounded-full'
                        style={{ backgroundColor: colors.primary }}
                      >
                        <View
                          className='h-3 w-3 rounded-full'
                          style={{ backgroundColor: colors.primaryForeground }}
                        />
                      </View>
                      <View
                        className='h-6 w-6 rounded-full border-2 bg-transparent'
                        style={{ borderColor: colors.mutedForeground }}
                      />
                    </View>
                  </View>
                  {/* Gift Box Icon */}
                  <View className='ml-4'>
                    <Gift size={48} color={colors.primary} />
                  </View>
                  {/* Dismiss Button */}
                  <TouchableOpacity
                    onPress={() => setShowChallenge(false)}
                    className='absolute right-2 top-2'
                  >
                    <X size={18} color={colors.mutedForeground} />
                  </TouchableOpacity>
                </View>
              </CardContent>
            </Card>
          </View>
        )}

        {/* Year Header */}
        <View className='px-4 pt-6'>
          <Text className='text-2xl font-bold text-foreground'>2025</Text>
        </View>

        {/* Journal Entries */}
        <View className='gap-3 px-4 pt-4'>
          {journalEntries.map((entry) => (
            <Card
              key={entry.id}
              style={{
                backgroundColor: isDark
                  ? `${colors.card}E6` // 90% opacity
                  : `${colors.secondary}80`, // 50% opacity
                borderColor: colors.border,
              }}
            >
              <CardContent className='p-4'>
                <View className='flex-row items-start gap-4'>
                  {/* Date Section */}
                  <View className='items-center'>
                    <Text className='text-2xl font-bold text-foreground'>
                      {entry.day}
                    </Text>
                    <View className='flex-row items-center gap-1'>
                      <Calendar size={12} color={colors.mutedForeground} />
                      <Text className='text-xs text-muted-foreground'>
                        {entry.month}
                      </Text>
                    </View>
                    {entry.isDraft && (
                      <Text className='mt-1 text-xs text-muted-foreground'>
                        Draft
                      </Text>
                    )}
                  </View>

                  {/* Content Section */}
                  <View className='flex-1 gap-1'>
                    <Text className='text-base text-foreground'>
                      {entry.content}
                    </Text>
                  </View>

                  {/* Emoji */}
                  <View className='items-center justify-center'>
                    <Text className='text-2xl'>{entry.emoji}</Text>
                  </View>
                </View>
              </CardContent>
            </Card>
          ))}
        </View>
      </ScrollView>

      {/* Side Drawer */}
      <SideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </SafeAreaView>
  )
}
