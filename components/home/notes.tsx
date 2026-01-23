import React, { useMemo, useRef, useState } from 'react'

import type { LegendListRenderItemProps } from '@legendapp/list'
import { AnimatedLegendList } from '@legendapp/list/reanimated'
import { Trans, useLingui } from '@lingui/react/macro'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { router } from 'expo-router'
import { Calendar, NotebookPen } from 'lucide-react-native'
import { ActivityIndicator, Pressable, View } from 'react-native'
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'
import { toast } from 'sonner-native'

import { BottomSheet } from '@/components/ui/bottom-sheet'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'
import { useTheme } from '@/hooks/use-theme'
import { cn, stripHtml } from '@/lib/utils'
import { getNote, restoreNote } from '@/services/notes'
import { useLanguageStore } from '@/store/language-store'
import { useSelectionStore } from '@/store/selection-store'
import type { Note } from '@/types'

import { EmptyNotesState } from './empty-notes-state'

type ListItem =
  | { type: 'header'; year: number; id: string }
  | { type: 'note'; note: Note }

interface NotesProps {
  entries: Note[]
  isSearchResult?: boolean
  searchQuery?: string
  isLoading?: boolean
  isTrash?: boolean
  onRestore?: () => void
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
  ListHeaderComponent?: React.ComponentType | React.ReactElement | null
}

export function Notes({
  entries,
  isSearchResult = false,
  searchQuery,
  isLoading = false,
  isTrash = false,
  onRestore,
  onScroll,
  ListHeaderComponent,
}: NotesProps) {
  const { locale } = useLanguageStore()
  const { colors } = useTheme()
  const { t } = useLingui()
  const queryClient = useQueryClient()
  const [noteToRestore, setNoteToRestore] = useState<Note | null>(null)
  const restoreSheetRef = useRef<React.ComponentRef<typeof BottomSheet>>(null)
  const isSelectionMode = useSelectionStore((state) => state.isSelectionMode)
  const selectedNoteIds = useSelectionStore((state) => state.selectedNoteIds)
  const selectionExtraData = useSelectionStore((state) => {
    const sorted = Array.from(state.selectedNoteIds).sort()
    return `${sorted.join(',')}-${state.selectedNoteIds.size}-${state.isSelectionMode}`
  })
  const toggleNoteSelection = useSelectionStore(
    (state) => state.toggleNoteSelection
  )
  const enterSelectionMode = useSelectionStore(
    (state) => state.enterSelectionMode
  )

  const intlLocale = locale === 'ru' ? 'ru-RU' : 'en-US'

  const restoreMutation = useMutation({
    mutationFn: async (noteId: string) => {
      await restoreNote(noteId)
    },
    onSuccess: () => {
      toast.success(t`Note restored`)
      queryClient.invalidateQueries({ queryKey: ['trash-notes'] })
      queryClient.invalidateQueries({ queryKey: ['notes'] })
      onRestore?.()
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to restore note'
      toast.error(t`Error`, {
        description: errorMessage,
      })
    },
  })

  // Prefetch note data when user starts pressing
  const handlePressIn = (entry: Note) => {
    if (isSelectionMode) return // Don't prefetch in selection mode

    // Set the note from list as placeholder data for instant display
    queryClient.setQueryData(['note', entry.id], entry)
    // Prefetch the latest version in the background
    queryClient.prefetchQuery({
      queryKey: ['note', entry.id],
      queryFn: () => getNote(entry.id),
    })
  }

  // Enter selection mode on long press
  const handleLongPress = (entry: Note) => {
    if (isSelectionMode) return
    enterSelectionMode(entry.id)
  }

  // Handle note press - navigate or toggle selection or show restore dialog
  const handleNotePress = (entry: Note) => {
    if (isSelectionMode) {
      toggleNoteSelection(entry.id)
    } else if (isTrash) {
      // Show restore bottom sheet for trashed notes
      setNoteToRestore(entry)
      restoreSheetRef.current?.present()
    } else {
      router.push({
        pathname: '/(app)/(tabs)/[id]/edit',
        params: { id: entry.id },
      })
    }
  }

  const handleConfirmRestore = () => {
    if (noteToRestore) {
      restoreMutation.mutate(noteToRestore.id)
      restoreSheetRef.current?.dismiss()
      setNoteToRestore(null)
    }
  }

  const handleCancelRestore = () => {
    restoreSheetRef.current?.dismiss()
    setNoteToRestore(null)
  }

  // Single pass transformation - group and flatten in one step
  const flatListData = useMemo(() => {
    // Group by year
    const grouped: Record<number, Note[]> = {}

    entries.forEach((entry) => {
      if (!entry.createdAt) return
      const year = entry.createdAt.toDate().getFullYear()
      if (!grouped[year]) {
        grouped[year] = []
      }
      grouped[year].push(entry)
    })

    // Sort years (newest first) and flatten with headers
    return Object.entries(grouped)
      .sort(([a], [b]) => Number(b) - Number(a)) // Sort years descending
      .flatMap(([year, notes]) => [
        { type: 'header' as const, year: Number(year), id: `header-${year}` },
        ...notes.map((note) => ({ type: 'note' as const, note })),
      ])
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

  const renderItem = ({ item }: LegendListRenderItemProps<ListItem>) => {
    if (item.type === 'header') {
      return (
        <View className='px-4 pb-1 pt-6'>
          <Text className='font-bold text-muted-foreground'>{item.year}</Text>
        </View>
      )
    }

    // Render note item
    const entry = item.note
    const createdAt = entry.createdAt?.toDate() || new Date()
    const day = new Intl.DateTimeFormat(intlLocale, {
      day: '2-digit',
    }).format(createdAt)
    const month = new Intl.DateTimeFormat(intlLocale, {
      month: 'short',
    }).format(createdAt)

    const isSelected = selectedNoteIds.has(entry.id)

    return (
      <View className='mb-3 px-4 pt-0'>
        <Pressable
          onPressIn={() => handlePressIn(entry)}
          onPress={() => handleNotePress(entry)}
          onLongPress={() => handleLongPress(entry)}
          style={({ pressed }) => ({
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Card
            className={cn(
              isSelectionMode && isSelected && 'border-primary bg-primary/5'
            )}
          >
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
                  <Text className='text-xs text-muted-foreground'>{month}</Text>
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
                    {stripHtml(entry.description)}
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
      </View>
    )
  }

  const keyExtractor = (item: ListItem) => {
    return item.type === 'header' ? item.id : item.note.id
  }

  return (
    <>
      <AnimatedLegendList<ListItem>
        data={flatListData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        extraData={selectionExtraData}
        estimatedItemSize={110}
        onScroll={onScroll}
        scrollEventThrottle={16}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={
          <EmptyNotesState
            isSearchResult={isSearchResult}
            searchQuery={searchQuery}
            isTrash={isTrash}
          />
        }
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Restore Bottom Sheet for Trash */}
      {isTrash && (
        <BottomSheet ref={restoreSheetRef}>
          <View className='px-4 pb-4'>
            <View className='mb-4 gap-2'>
              <Text className='text-lg font-semibold text-foreground'>
                <Trans>Restore note?</Trans>
              </Text>
              <Text className='text-sm text-muted-foreground'>
                <Trans>
                  This note will be restored and moved back to your notes.
                </Trans>
              </Text>
            </View>
            <View className='flex-col gap-2'>
              <Button
                onPress={handleConfirmRestore}
                loading={restoreMutation.isPending}
              >
                <Text>
                  <Trans>Restore</Trans>
                </Text>
              </Button>
              <Button variant='outline' onPress={handleCancelRestore}>
                <Text>
                  <Trans>Cancel</Trans>
                </Text>
              </Button>
            </View>
          </View>
        </BottomSheet>
      )}
    </>
  )
}
