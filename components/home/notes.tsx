import { useMemo } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { router } from 'expo-router'
import { Calendar, NotebookPen } from 'lucide-react-native'
import { ActivityIndicator, Pressable, View } from 'react-native'

import { Card, CardContent } from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import { useTheme } from '@/hooks/use-theme'
import { getNote } from '@/services/notes'
import { useLanguageStore } from '@/store/language-store'
import type { Note } from '@/types'

import { Icon } from '../ui/icon'
import { EmptyNotesState } from './empty-notes-state'

interface NotesProps {
  entries: Note[]
  isSearchResult?: boolean
  searchQuery?: string
  isLoading?: boolean
}

export function Notes({
  entries,
  isSearchResult = false,
  searchQuery,
  isLoading = false,
}: NotesProps) {
  const { locale } = useLanguageStore()
  const { colors } = useTheme()
  const queryClient = useQueryClient()

  const intlLocale = locale === 'ru' ? 'ru-RU' : 'en-US'

  // Prefetch note data when user starts pressing
  const handlePressIn = (entry: Note) => {
    // Set the note from list as placeholder data for instant display
    queryClient.setQueryData(['note', entry.id], entry)
    // Prefetch the latest version in the background
    queryClient.prefetchQuery({
      queryKey: ['note', entry.id],
      queryFn: () => getNote(entry.id),
    })
  }

  const entriesByYear = useMemo(() => {
    const grouped: Record<number, Note[]> = {}

    entries.forEach((entry) => {
      if (!entry.createdAt) return
      const createdAt = entry.createdAt.toDate()
      const year = createdAt.getFullYear()

      if (!grouped[year]) {
        grouped[year] = []
      }
      grouped[year].push(entry)
    })

    return Object.entries(grouped)
      .sort(([a], [b]) => Number(b) - Number(a))
      .map(([year, notes]) => ({ year: Number(year), notes }))
  }, [entries])

  if (isLoading) {
    return (
      <View className='flex-1 items-center justify-center px-8 py-16'>
        <ActivityIndicator size='large' color={colors.primary} />
        <Text className='mt-4 text-center text-muted-foreground'>
          Loading notes...
        </Text>
      </View>
    )
  }

  if (entries.length === 0) {
    return (
      <EmptyNotesState
        isSearchResult={isSearchResult}
        searchQuery={searchQuery}
      />
    )
  }

  return (
    <>
      {entriesByYear.map(({ year, notes }) => (
        <View key={year}>
          <View className='px-4 pt-6'>
            <Text className='font-bold text-muted-foreground'>{year}</Text>
          </View>
          <View className='gap-3 px-4 pt-4'>
            {notes.map((entry) => {
              const createdAt = entry.createdAt?.toDate() || new Date()
              const day = new Intl.DateTimeFormat(intlLocale, {
                day: '2-digit',
              }).format(createdAt)
              const month = new Intl.DateTimeFormat(intlLocale, {
                month: 'short',
              }).format(createdAt)

              return (
                <Pressable
                  key={entry.id}
                  onPressIn={() => handlePressIn(entry)}
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
                  <Card>
                    <CardContent className='flex-row items-start gap-4'>
                      {/* Date Section */}
                      <View className='items-center'>
                        <Text className='text-2xl font-bold text-foreground'>
                          {day}
                        </Text>
                        <View className='flex-row items-center gap-1'>
                          <Icon
                            as={Calendar}
                            className='size-3 text-muted-foreground'
                          />
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

                      {/* Mood Emoji */}
                      <View className='items-center justify-center'>
                        {entry.mood ? (
                          <Text className='text-2xl'>{entry.mood}</Text>
                        ) : (
                          <Icon as={NotebookPen} className='text-primary' />
                        )}
                      </View>
                    </CardContent>
                  </Card>
                </Pressable>
              )
            })}
          </View>
        </View>
      ))}
    </>
  )
}
