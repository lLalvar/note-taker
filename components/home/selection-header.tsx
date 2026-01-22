import React, { useRef } from 'react'

import { Trans, useLingui } from '@lingui/react/macro'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Trash2 } from 'lucide-react-native'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { toast } from 'sonner-native'

import { BottomSheet } from '@/components/ui/bottom-sheet'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'
import { deleteNotes } from '@/services/notes'
import { useSelectionStore } from '@/store/selection-store'
import type { Note } from '@/types'

interface SelectionHeaderProps {
  allNoteIds: string[]
  totalNotesCount: number
}

export function SelectionHeader({
  allNoteIds,
  totalNotesCount,
}: SelectionHeaderProps) {
  const { t } = useLingui()
  const queryClient = useQueryClient()

  const selectedNoteIds = useSelectionStore((state) => state.selectedNoteIds)
  const selectedCount = useSelectionStore((state) => state.getSelectedCount())
  const isAllSelected = useSelectionStore((state) =>
    state.isAllSelected(totalNotesCount)
  )
  const exitSelectionMode = useSelectionStore(
    (state) => state.exitSelectionMode
  )
  const selectAll = useSelectionStore((state) => state.selectAll)
  const deselectAll = useSelectionStore((state) => state.deselectAll)

  const bulkDeleteSheetRef =
    useRef<React.ComponentRef<typeof BottomSheet>>(null)

  // Bulk delete mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: async (noteIds: string[]) => {
      await deleteNotes(noteIds)
    },
    onMutate: async (noteIds) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: ['notes'] })

      // Get previous notes
      const previousNotes = queryClient.getQueryData<Note[]>(['notes'])

      // Optimistically remove notes from cache
      queryClient.setQueriesData<Note[]>(
        { queryKey: ['notes'] },
        (oldNotes) => {
          if (!oldNotes) return oldNotes
          return oldNotes.filter((note) => !noteIds.includes(note.id))
        }
      )

      // Remove individual notes from cache
      noteIds.forEach((noteId) => {
        queryClient.removeQueries({ queryKey: ['note', noteId] })
      })

      return { previousNotes }
    },
    onError: (error, noteIds, context) => {
      // Rollback optimistic update
      if (context?.previousNotes) {
        queryClient.setQueryData(['notes'], context.previousNotes)
      }

      const errorMessage =
        error instanceof Error ? error.message : t`Failed to delete notes`
      toast.error(t`Error`, {
        description: errorMessage,
      })
    },
    onSuccess: (_, noteIds) => {
      const count = noteIds.length
      if (count === 1) {
        toast.success(t`Note moved to trash`)
      } else {
        toast.success(t`${count} notes moved to trash`)
      }
      queryClient.invalidateQueries({ queryKey: ['notes'] })
      queryClient.invalidateQueries({ queryKey: ['trash-notes'] })
      exitSelectionMode()
    },
  })

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedNoteIds.size === 0) return
    bulkDeleteSheetRef.current?.present()
  }

  // Confirm bulk delete
  const handleConfirmBulkDelete = () => {
    const noteIds = Array.from(selectedNoteIds)
    bulkDeleteMutation.mutate(noteIds)
    bulkDeleteSheetRef.current?.dismiss()
  }

  // Cancel bulk delete
  const handleCancelBulkDelete = () => {
    bulkDeleteSheetRef.current?.dismiss()
  }

  return (
    <>
      <SafeAreaView edges={['top']}>
        <View className='flex-row items-center justify-between gap-2 px-2 py-2'>
          <View className='flex-1 flex-row items-center gap-3'>
            <Button
              variant='ghost'
              size='icon'
              onPress={exitSelectionMode}
              accessibilityLabel={t`Cancel selection`}
            >
              <Icon as={ArrowLeft} />
            </Button>
            <Text className='flex-1 font-semibold text-foreground'>
              {selectedCount === 0 ? (
                <Trans>Select notes</Trans>
              ) : isAllSelected ? (
                <Trans>All selected ({selectedCount})</Trans>
              ) : (
                <Trans>{selectedCount} selected</Trans>
              )}
            </Text>
          </View>
          <View className='flex-row items-center gap-2'>
            {isAllSelected ? (
              <Button variant='ghost' onPress={deselectAll}>
                <Text>
                  <Trans>Deselect All</Trans>
                </Text>
              </Button>
            ) : (
              <Button variant='ghost' onPress={() => selectAll(allNoteIds)}>
                <Text>
                  <Trans>Select All</Trans>
                </Text>
              </Button>
            )}
            <Button
              variant='ghost'
              size='icon'
              onPress={handleBulkDelete}
              disabled={selectedCount === 0 || bulkDeleteMutation.isPending}
              loading={bulkDeleteMutation.isPending}
              accessibilityLabel={t`Delete selected notes`}
            >
              <Icon as={Trash2} />
            </Button>
          </View>
        </View>
      </SafeAreaView>

      {/* Bulk Delete Confirmation Bottom Sheet */}
      <BottomSheet ref={bulkDeleteSheetRef}>
        <View className='px-4 pb-4'>
          <View className='mb-4 gap-2'>
            <Text className='text-lg font-semibold text-foreground'>
              {selectedNoteIds.size === 1
                ? t`Move ${selectedNoteIds.size} note to trash?`
                : t`Move ${selectedNoteIds.size} notes to trash?`}
            </Text>
            <Text className='text-sm text-muted-foreground'>
              {selectedNoteIds.size === 1 ? (
                <Trans>
                  This note will be moved to trash. You can restore it later if
                  needed.
                </Trans>
              ) : (
                <Trans>
                  These {selectedNoteIds.size} notes will be moved to trash. You
                  can restore them later if needed.
                </Trans>
              )}
            </Text>
          </View>
          <View className='flex-col gap-2'>
            <Button
              onPress={handleConfirmBulkDelete}
              loading={bulkDeleteMutation.isPending}
              variant='destructive'
            >
              <Text>
                <Trans>Move to Trash</Trans>
              </Text>
            </Button>
            <Button variant='outline' onPress={handleCancelBulkDelete}>
              <Text>
                <Trans>Cancel</Trans>
              </Text>
            </Button>
          </View>
        </View>
      </BottomSheet>
    </>
  )
}
