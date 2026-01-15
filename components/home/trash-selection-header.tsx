import React, { useState } from 'react'

import { Trans, useLingui } from '@lingui/react/macro'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, RotateCcw, Trash2 } from 'lucide-react-native'
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
import { permanentlyDeleteNotes, restoreNotes } from '@/services/notes'
import { useSelectionStore } from '@/store/selection-store'
import type { Note } from '@/types'

interface TrashSelectionHeaderProps {
  allNoteIds: string[]
  totalNotesCount: number
}

export function TrashSelectionHeader({
  allNoteIds,
  totalNotesCount,
}: TrashSelectionHeaderProps) {
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

  const [showRestoreDialog, setShowRestoreDialog] = useState(false)
  const [showPermanentDeleteDialog, setShowPermanentDeleteDialog] =
    useState(false)

  // Restore mutation
  const restoreMutation = useMutation({
    mutationFn: async (noteIds: string[]) => {
      await restoreNotes(noteIds)
    },
    onMutate: async (noteIds) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: ['trash-notes'] })
      await queryClient.cancelQueries({ queryKey: ['notes'] })

      // Get previous trashed notes
      const previousTrashedNotes = queryClient.getQueryData<Note[]>([
        'trash-notes',
      ])

      // Optimistically remove notes from trash cache
      queryClient.setQueriesData<Note[]>(
        { queryKey: ['trash-notes'] },
        (oldNotes) => {
          if (!oldNotes) return oldNotes
          return oldNotes.filter((note) => !noteIds.includes(note.id))
        }
      )

      return { previousTrashedNotes }
    },
    onError: (error, noteIds, context) => {
      // Rollback optimistic update
      if (context?.previousTrashedNotes) {
        queryClient.setQueryData(['trash-notes'], context.previousTrashedNotes)
      }

      const errorMessage =
        error instanceof Error ? error.message : 'Failed to restore notes'
      toast.error(t`Error`, {
        description: errorMessage,
      })
    },
    onSuccess: (_, noteIds) => {
      const count = noteIds.length
      if (count === 1) {
        toast.success(t`Note restored`)
      } else {
        toast.success(t`${count} notes restored`)
      }
      queryClient.invalidateQueries({ queryKey: ['trash-notes'] })
      queryClient.invalidateQueries({ queryKey: ['notes'] })
      exitSelectionMode()
    },
  })

  // Permanent delete mutation
  const permanentDeleteMutation = useMutation({
    mutationFn: async (noteIds: string[]) => {
      await permanentlyDeleteNotes(noteIds)
    },
    onMutate: async (noteIds) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: ['trash-notes'] })

      // Get previous trashed notes
      const previousTrashedNotes = queryClient.getQueryData<Note[]>([
        'trash-notes',
      ])

      // Optimistically remove notes from cache
      queryClient.setQueriesData<Note[]>(
        { queryKey: ['trash-notes'] },
        (oldNotes) => {
          if (!oldNotes) return oldNotes
          return oldNotes.filter((note) => !noteIds.includes(note.id))
        }
      )

      // Remove individual notes from cache
      noteIds.forEach((noteId) => {
        queryClient.removeQueries({ queryKey: ['note', noteId] })
      })

      return { previousTrashedNotes }
    },
    onError: (error, noteIds, context) => {
      // Rollback optimistic update
      if (context?.previousTrashedNotes) {
        queryClient.setQueryData(['trash-notes'], context.previousTrashedNotes)
      }

      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to permanently delete notes'
      toast.error(t`Error`, {
        description: errorMessage,
      })
    },
    onSuccess: (_, noteIds) => {
      const count = noteIds.length
      if (count === 1) {
        toast.success(t`Note permanently deleted`)
      } else {
        toast.success(t`${count} notes permanently deleted`)
      }
      queryClient.invalidateQueries({ queryKey: ['trash-notes'] })
      exitSelectionMode()
    },
  })

  // Handle restore
  const handleRestore = () => {
    if (selectedNoteIds.size === 0) return
    setShowRestoreDialog(true)
  }

  // Confirm restore
  const handleConfirmRestore = () => {
    const noteIds = Array.from(selectedNoteIds)
    restoreMutation.mutate(noteIds)
    setShowRestoreDialog(false)
  }

  // Handle permanent delete
  const handlePermanentDelete = () => {
    if (selectedNoteIds.size === 0) return
    setShowPermanentDeleteDialog(true)
  }

  // Confirm permanent delete
  const handleConfirmPermanentDelete = () => {
    const noteIds = Array.from(selectedNoteIds)
    permanentDeleteMutation.mutate(noteIds)
    setShowPermanentDeleteDialog(false)
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
              onPress={handleRestore}
              disabled={
                selectedCount === 0 ||
                restoreMutation.isPending ||
                permanentDeleteMutation.isPending
              }
              loading={restoreMutation.isPending}
              accessibilityLabel='Restore selected notes'
            >
              <Icon as={RotateCcw} />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              onPress={handlePermanentDelete}
              disabled={
                selectedCount === 0 ||
                restoreMutation.isPending ||
                permanentDeleteMutation.isPending
              }
              loading={permanentDeleteMutation.isPending}
              accessibilityLabel='Permanently delete selected notes'
            >
              <Icon as={Trash2} />
            </Button>
          </View>
        </View>
      </SafeAreaView>

      {/* Restore Confirmation Dialog */}
      <AlertDialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Restore {selectedNoteIds.size}{' '}
              {selectedNoteIds.size === 1 ? t`note` : t`notes`}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedNoteIds.size === 1
                ? 'This note will be restored and moved back to your notes.'
                : `These ${selectedNoteIds.size} notes will be restored and moved back to your notes.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button
                variant='outline'
                onPress={() => setShowRestoreDialog(false)}
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

      {/* Permanent Delete Confirmation Dialog */}
      <AlertDialog
        open={showPermanentDeleteDialog}
        onOpenChange={setShowPermanentDeleteDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Permanently delete {selectedNoteIds.size}{' '}
              {selectedNoteIds.size === 1 ? t`note` : t`notes`}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete {selectedNoteIds.size}{' '}
              selected {selectedNoteIds.size === 1 ? t`note` : t`notes`}? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button
                variant='outline'
                onPress={() => setShowPermanentDeleteDialog(false)}
              >
                <Text>
                  <Trans>Cancel</Trans>
                </Text>
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild variant='destructive'>
              <Button
                onPress={handleConfirmPermanentDelete}
                loading={permanentDeleteMutation.isPending}
              >
                <Text>
                  <Trans>Delete Permanently</Trans>
                </Text>
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
