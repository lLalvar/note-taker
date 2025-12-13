import { useMemo } from 'react'

import { router } from 'expo-router'
import { Calendar, NotebookPen } from 'lucide-react-native'
import { Pressable, View } from 'react-native'

import { Card, CardContent } from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import { useTheme } from '@/hooks/use-theme'
import dayjs from '@/lib/dayjs'
import type { Note } from '@/types'

import { Icon } from '../ui/icon'
import { EmptyNotesState } from './empty-notes-state'

interface NotesProps {
  entries: Note[]
}

export function Notes({ entries }: NotesProps) {
  const { colors, isDark } = useTheme()

  // Calculate year from entries (use most recent entry's year, or current year if no entries)
  const year = useMemo(() => {
    if (entries.length === 0) {
      return dayjs().year()
    }
    // Get year from first entry (most recent) or use current year as fallback
    const firstEntry = entries[0]
    if (firstEntry?.createdAt) {
      const createdAt = firstEntry.createdAt.toDate()
      return dayjs(createdAt).year()
    }
    return dayjs().year()
  }, [entries])

  // Group entries by year (for future use if needed)
  const entriesByYear = useMemo(() => {
    // Filter entries for the current year, or show all if no year specified
    const targetYear = year
    return entries.filter((entry) => {
      if (!entry.createdAt) return false
      const entryYear = dayjs(entry.createdAt.toDate()).year()
      return entryYear === targetYear
    })
  }, [entries, year])

  if (entries.length === 0) {
    return <EmptyNotesState />
  }

  return (
    <>
      {/* Year Header */}
      <View className='px-4 pt-6'>
        <Text className='text-2xl font-bold text-foreground'>{year}</Text>
      </View>
      <View className='gap-3 px-4 pt-4'>
        {entriesByYear.map((entry) => {
          // Format date from Note's createdAt timestamp
          const createdAt = entry.createdAt?.toDate() || new Date()
          const dateObj = dayjs(createdAt)
          const day = dateObj.format('DD')
          const month = dateObj.format('MMM')

          return (
            <Pressable
              key={entry.id}
              onPress={() => {
                router.push({
                  pathname: '/(app)/(tabs)/[id]/edit',
                  params: { id: entry.id },
                })
              }}
              style={({ pressed }) => ({
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Card
              // style={{
              //   backgroundColor: isDark
              //     ? `${colors.card}E6`
              //     : `${colors.secondary}`,
              //   borderColor: colors.border,
              // }}
              >
                <CardContent>
                  <View className='flex-row items-start gap-4'>
                    {/* Date Section */}
                    <View className='items-center'>
                      <Text className='text-2xl font-bold text-foreground'>
                        {day}
                      </Text>
                      <View className='flex-row items-center gap-1'>
                        <Calendar size={12} color={colors.mutedForeground} />
                        <Text className='text-xs text-muted-foreground'>
                          {month}
                        </Text>
                      </View>
                    </View>

                    {/* Content Section */}
                    <View className='flex-1 gap-1'>
                      {entry.title ? (
                        <Text
                          className='font-semibold text-foreground'
                          numberOfLines={1}
                          ellipsizeMode='tail'
                        >
                          {entry.title}
                        </Text>
                      ) : null}
                      {entry.description ? (
                        <Text
                          className='text-sm text-muted-foreground'
                          numberOfLines={2}
                          ellipsizeMode='tail'
                        >
                          {entry.description}
                        </Text>
                      ) : null}
                      {!entry.title && !entry.description && (
                        <Text className='text-sm text-muted-foreground'>
                          No content
                        </Text>
                      )}
                    </View>

                    {/* Emoji */}
                    <View className='items-center justify-center'>
                      <Icon as={NotebookPen} size={28} color={colors.primary} />
                    </View>
                  </View>
                </CardContent>
              </Card>
            </Pressable>
          )
        })}
      </View>
    </>
  )
}
