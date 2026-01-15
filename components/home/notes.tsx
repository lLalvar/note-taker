import { useMemo, useState } from 'react'

import { Trans, useLingui } from '@lingui/react/macro'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { router } from 'expo-router'
import { Calendar, NotebookPen } from 'lucide-react-native'
import { ActivityIndicator, Pressable, View } from 'react-native'
import { toast } from 'sonner-native'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'
import { useTheme } from '@/hooks/use-theme'
import { getNote, restoreNote } from '@/services/notes'
import { useLanguageStore } from '@/store/language-store'
import { useSelectionStore } from '@/store/selection-store'
import type { Note } from '@/types'

import { EmptyNotesState } from './empty-notes-state'

interface NotesProps {
  entries: Note[]
  isSearchResult?: boolean
  searchQuery?: string
  isLoading?: boolean
  isTrash?: boolean
  onRestore?: () => void
}

export function Notes({
  entries,
  isSearchResult = false,
  searchQuery,
  isLoading = false,
  isTrash = false,
  onRestore,
}: NotesProps) {
  const { locale } = useLanguageStore()
  const { colors } = useTheme()
  const { t } = useLingui()
  const queryClient = useQueryClient()
  const [showRestoreDialog, setShowRestoreDialog] = useState(false)
  const [noteToRestore, setNoteToRestore] = useState<Note | null>(null)

  // Selection state from store
  const isSelectionMode = useSelectionStore((state) => state.isSelectionMode)
  const selectedNoteIds = useSelectionStore((state) => state.selectedNoteIds)
  const toggleNoteSelection = useSelectionStore(
    (state) => state.toggleNoteSelection
  )
  const enterSelectionMode = useSelectionStore(
    (state) => state.enterSelectionMode
  )

  const intlLocale = locale === 'ru' ? 'ru-RU' : 'en-US'

  // Restore mutation
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
      // Show restore dialog for trashed notes
      setNoteToRestore(entry)
      setShowRestoreDialog(true)
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
      setShowRestoreDialog(false)
      setNoteToRestore(null)
    }
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
        isTrash={isTrash}
      />
    )
  }

  return (
    <>
      {/* Notes List */}
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

              const isSelected = selectedNoteIds.has(entry.id)

              return (
                <Pressable
                  key={entry.id}
                  onPressIn={() => handlePressIn(entry)}
                  onPress={() => handleNotePress(entry)}
                  onLongPress={() => handleLongPress(entry)}
                  style={({ pressed }) => ({
                    opacity: pressed ? 0.7 : 1,
                  })}
                >
                  <Card
                    className={
                      isSelectionMode && isSelected
                        ? 'border-primary bg-primary/5'
                        : ''
                    }
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

      {/* Restore Dialog for Trash */}
      {isTrash && (
        <AlertDialog
          open={showRestoreDialog}
          onOpenChange={setShowRestoreDialog}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                <Trans>Restore note?</Trans>
              </AlertDialogTitle>
              <AlertDialogDescription>
                <Trans>
                  This note will be restored and moved back to your notes.
                </Trans>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel asChild>
                <Button
                  variant='outline'
                  onPress={() => {
                    setShowRestoreDialog(false)
                    setNoteToRestore(null)
                  }}
                >
                  <Text>
                    <Trans>Cancel</Trans>
                  </Text>
                </Button>
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button
                  onPress={handleConfirmRestore}
                  loading={restoreMutation.isPending}
                >
                  <Text>
                    <Trans>Restore</Trans>
                  </Text>
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  )
}
