import React, { useState } from 'react'

import { Trans, useLingui } from '@lingui/react/macro'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Trash2 } from 'lucide-react-native'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
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

  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false)

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
        error instanceof Error ? error.message : 'Failed to delete notes'
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
    setShowBulkDeleteDialog(true)
  }

  // Confirm bulk delete
  const handleConfirmBulkDelete = () => {
    const noteIds = Array.from(selectedNoteIds)
    bulkDeleteMutation.mutate(noteIds)
    setShowBulkDeleteDialog(false)
  }

  return (
    <>
      <SafeAreaView edges={['top']}>
        <View className='flex-row items-center justify-between gap-2 px-4 py-2'>
          <View className='flex-1 flex-row items-center gap-3'>
            <Button
              variant='ghost'
              size='icon'
              onPress={exitSelectionMode}
              accessibilityLabel='Cancel selection'
            >
              <Icon as={ArrowLeft} />
            </Button>
            <Text className='flex-1 font-semibold text-foreground'>
              {selectedCount === 0 ? (
                <Trans>Select notes</Trans>
              ) : isAllSelected ? (
                <Trans>All selected</Trans>
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
              accessibilityLabel='Delete selected notes'
            >
              <Icon as={Trash2} />
            </Button>
          </View>
        </View>
      </SafeAreaView>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog
        open={showBulkDeleteDialog}
        onOpenChange={setShowBulkDeleteDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Move {selectedNoteIds.size}{' '}
              {selectedNoteIds.size === 1 ? t`note` : t`notes`} to trash?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedNoteIds.size === 1
                ? 'This note will be moved to trash. You can restore it later if needed.'
                : `These ${selectedNoteIds.size} notes will be moved to trash. You can restore them later if needed.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button
                variant='outline'
                onPress={() => setShowBulkDeleteDialog(false)}
              >
                <Text>
                  <Trans>Cancel</Trans>
                </Text>
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild variant='destructive'>
              <Button
                onPress={handleConfirmBulkDelete}
                loading={bulkDeleteMutation.isPending}
              >
                <Text>
                  <Trans>Move to Trash</Trans>
                </Text>
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
