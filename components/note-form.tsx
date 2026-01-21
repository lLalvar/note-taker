import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Trans, useLingui } from '@lingui/react/macro'
import { Timestamp } from '@react-native-firebase/firestore'
import { useFocusEffect } from '@react-navigation/native'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { router } from 'expo-router'
import { MoreVertical, Trash2 } from 'lucide-react-native'
import { useForm } from 'react-hook-form'
import {
  ActivityIndicator,
  BackHandler,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { toast } from 'sonner-native'
import { z } from 'zod'

import {
  RichTextEditor,
  type RichTextEditorHandle,
} from '@/components/editor/rich-text-editor'
import {
  MoodPickerModal,
  type MoodPickerModalHandle,
} from '@/components/mood/mood-picker-modal'
import { BottomSheet } from '@/components/ui/bottom-sheet'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Icon } from '@/components/ui/icon'
import { Input } from '@/components/ui/input'
import { ScreenHeader } from '@/components/ui/screen-header'
import { Text } from '@/components/ui/text'
import { DEFAULT_MOOD } from '@/constants/moods'
import { useAuth } from '@/hooks/use-auth'
import { useTheme } from '@/hooks/use-theme'
import { createNote, deleteNote, getNote, updateNote } from '@/services/notes'
import type { Note } from '@/types'

const noteSchema = z.object({
  title: z.string().max(200, 'Title is too long').optional(),
  description: z.string().max(5000, 'Description is too long').optional(),
  mood: z.string().optional(),
})

type NoteFormData = z.infer<typeof noteSchema>

interface NoteFormProps {
  noteId?: string
}

export function NoteForm({ noteId }: NoteFormProps) {
  const { t } = useLingui()
  const { colors } = useTheme()
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const isEditMode = !!noteId

  const placeholderNote = useMemo(() => {
    if (!noteId) return undefined
    const notesData = queryClient.getQueryData<Note[]>(['notes'])
    return notesData?.find((note) => note.id === noteId)
  }, [noteId, queryClient])

  const {
    data: noteData,
    isLoading: isLoadingNote,
    refetch,
  } = useQuery({
    queryKey: ['note', noteId],
    queryFn: () => getNote(noteId!),
    enabled: isEditMode,
    placeholderData: placeholderNote,
  })

  const moodPickerRef = useRef<MoodPickerModalHandle>(null)
  const optionsSheetRef = useRef<React.ComponentRef<typeof BottomSheet>>(null)
  const discardSheetRef = useRef<React.ComponentRef<typeof BottomSheet>>(null)
  const lastNoteIdRef = useRef<string | undefined>(undefined)
  const editorRef = useRef<RichTextEditorHandle>(null)

  const defaultValues: NoteFormData = useMemo(
    () => ({
      title: '',
      description: '',
      mood: DEFAULT_MOOD.emoji,
    }),
    []
  )

  const serverValues = useMemo<NoteFormData | undefined>(() => {
    if (isEditMode && noteData) {
      return {
        title: noteData.title || '',
        description: noteData.description || '',
        mood: noteData.mood || DEFAULT_MOOD.emoji,
      }
    }
    return undefined
  }, [isEditMode, noteData])

  const form = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
    defaultValues,
    ...(serverValues && { values: serverValues }),
  })

  useFocusEffect(
    useCallback(() => {
      if (isEditMode && noteData) {
        refetch()
      } else if (!isEditMode) {
        form.reset(defaultValues)
        lastNoteIdRef.current = undefined
        const timer = setTimeout(() => {
          moodPickerRef.current?.open()
        }, 300)
        return () => clearTimeout(timer)
      }
      setShouldNavigate(false)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEditMode, noteId])
  )

  const updatedAtMillis = noteData?.updatedAt?.toMillis?.() ?? null

  useEffect(() => {
    if (isEditMode && noteData && serverValues) {
      if (noteId !== lastNoteIdRef.current) {
        form.reset(serverValues)
        lastNoteIdRef.current = noteId
      } else if (!form.formState.isDirty) {
        form.reset(serverValues)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    noteData?.id,
    updatedAtMillis,
    serverValues?.title,
    serverValues?.description,
    serverValues?.mood,
  ])

  const mutation = useMutation({
    mutationFn: async (data: NoteFormData) => {
      if (isEditMode) {
        if (!noteId) throw new Error('Note ID is required for update')
        return updateNote(noteId, data)
      }
      return createNote(data)
    },
    onMutate: async (data) => {
      // Cancel outgoing queries to prevent them from overwriting optimistic updates
      if (isEditMode && noteId) {
        await queryClient.cancelQueries({ queryKey: ['note', noteId] })
        await queryClient.cancelQueries({ queryKey: ['notes'] })

        const previousNote = queryClient.getQueryData<Note>(['note', noteId])

        // Optimistically update the individual note
        if (previousNote) {
          const optimisticNote: Note = {
            ...previousNote,
            title: data.title,
            description: data.description,
            mood: data.mood,
          }
          queryClient.setQueryData(['note', noteId], optimisticNote)
        }

        // Optimistically update ALL notes queries (regardless of search params)
        queryClient.setQueriesData<Note[]>(
          { queryKey: ['notes'] },
          (oldNotes) => {
            if (!oldNotes) return oldNotes
            return oldNotes.map((note) =>
              note.id === noteId
                ? {
                    ...note,
                    title: data.title,
                    description: data.description,
                    mood: data.mood,
                  }
                : note
            )
          }
        )

        router.back()

        return { previousNote }
      } else {
        // CREATE MODE
        await queryClient.cancelQueries({ queryKey: ['notes'] })

        // Create temporary optimistic note
        const tempId = `temp-${Date.now()}`
        const optimisticNote: Note = {
          id: tempId,
          title: data.title,
          description: data.description,
          mood: data.mood,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          userId: user?.uid || '',
        }

        // Add optimistic note to ALL notes queries
        queryClient.setQueriesData<Note[]>(
          { queryKey: ['notes'] },
          (oldNotes) => {
            if (!oldNotes) return [optimisticNote]
            return [optimisticNote, ...oldNotes]
          }
        )

        // Reset form and navigate back immediately
        form.reset({ title: '', description: '', mood: DEFAULT_MOOD.emoji })
        router.back()

        return { tempId }
      }
    },
    onError: (error, data, context) => {
      console.error('Note Error:', error)

      // Rollback optimistic updates on error
      if (isEditMode && context?.previousNote) {
        if (noteId) {
          queryClient.setQueryData(['note', noteId], context.previousNote)
        }
        // Invalidate to refetch original data
        queryClient.invalidateQueries({ queryKey: ['notes'] })
      } else if (!isEditMode && context?.tempId) {
        // Remove the temporary optimistic note from all notes queries
        queryClient.setQueriesData<Note[]>(
          { queryKey: ['notes'] },
          (oldNotes) => {
            if (!oldNotes) return oldNotes
            return oldNotes.filter((note) => note.id !== context.tempId)
          }
        )
      }

      const errorMessage =
        error instanceof Error
          ? error.message
          : isEditMode
            ? 'Failed to update note'
            : 'Failed to create note'
      toast.error(t`Error`, {
        description: errorMessage,
      })
    },
    onSuccess: (data, variables, context) => {
      // Update cache with real server data (even though we've navigated away)
      if (isEditMode && noteId) {
        queryClient.setQueryData(['note', noteId], data)

        // Update the note in ALL notes queries
        queryClient.setQueriesData<Note[]>(
          { queryKey: ['notes'] },
          (oldNotes) => {
            if (!oldNotes) return oldNotes
            return oldNotes.map((note) => (note.id === noteId ? data : note))
          }
        )
      } else if (context?.tempId) {
        // Replace temporary note with real note from server in ALL notes queries
        queryClient.setQueriesData<Note[]>(
          { queryKey: ['notes'] },
          (oldNotes) => {
            if (!oldNotes) return oldNotes
            return oldNotes.map((note) =>
              note.id === context.tempId ? data : note
            )
          }
        )
      }
    },
    onSettled: () => {
      // Refetch to ensure cache is in sync with server
      queryClient.invalidateQueries({ queryKey: ['notes'] })
      if (isEditMode && noteId) {
        queryClient.invalidateQueries({ queryKey: ['note', noteId] })
      }
    },
  })

  const handleSubmit = (values: NoteFormData) => {
    mutation.mutate(values)
  }

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!noteId) throw new Error('Note ID is required for deletion')
      await deleteNote(noteId)
    },
    onMutate: async () => {
      if (!noteId) return

      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: ['notes'] })
      await queryClient.cancelQueries({ queryKey: ['note', noteId] })

      // Get previous notes
      const previousNotes = queryClient.getQueryData<Note[]>(['notes'])

      // Optimistically remove note from cache
      queryClient.setQueriesData<Note[]>(
        { queryKey: ['notes'] },
        (oldNotes) => {
          if (!oldNotes) return oldNotes
          return oldNotes.filter((note) => note.id !== noteId)
        }
      )

      // Remove individual note from cache
      queryClient.removeQueries({ queryKey: ['note', noteId] })

      // Navigate back immediately
      router.back()

      return { previousNotes }
    },
    onError: (error, _, context) => {
      // Rollback optimistic update
      if (context?.previousNotes) {
        queryClient.setQueryData(['notes'], context.previousNotes)
      }

      const errorMessage =
        error instanceof Error ? error.message : 'Failed to delete note'
      toast.error(t`Error`, {
        description: errorMessage,
      })
    },
    onSuccess: () => {
      toast.success(t`Note moved to trash`)
      queryClient.invalidateQueries({ queryKey: ['notes'] })
      queryClient.invalidateQueries({ queryKey: ['trash-notes'] })
    },
  })

  const handleOpenOptions = () => {
    Keyboard.dismiss()
    optionsSheetRef.current?.present()
  }

  const handleDelete = () => {
    optionsSheetRef.current?.dismiss()
    deleteMutation.mutate()
  }

  const isDirty = form.formState.isDirty
  const [shouldNavigate, setShouldNavigate] = useState(false)

  const handleShowDiscardDialog = useCallback(() => {
    discardSheetRef.current?.present()
  }, [])

  const handleDiscard = () => {
    if (isEditMode && serverValues) {
      form.reset(serverValues)
    } else {
      form.reset(defaultValues)
    }
    setShouldNavigate(true)
    discardSheetRef.current?.dismiss()
    router.back()
  }

  const handleSaveAndExit = () => {
    setShouldNavigate(true)
    discardSheetRef.current?.dismiss()
    form.handleSubmit(handleSubmit)()
  }

  const handleCancelDiscard = () => {
    discardSheetRef.current?.dismiss()
  }

  useEffect(() => {
    if (Platform.OS === 'android') {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          Keyboard.dismiss()
          editorRef.current?.blur()
          if (isDirty && !shouldNavigate && !mutation.isPending) {
            handleShowDiscardDialog()
            return true
          }
          return false
        }
      )

      return () => backHandler.remove()
    }
  }, [isDirty, shouldNavigate, mutation.isPending, handleShowDiscardDialog])

  useEffect(() => {
    if (!isDirty) {
      setShouldNavigate(false)
    }
  }, [isDirty])

  const handleBackPress = () => {
    Keyboard.dismiss()
    editorRef.current?.blur()
    if (isDirty && !shouldNavigate && !mutation.isPending) {
      handleShowDiscardDialog()
    } else {
      router.back()
    }
  }

  const isLoading = isLoadingNote || mutation.isPending

  return (
    <SafeAreaView className='flex-1 bg-background' edges={['top', 'bottom']}>
      <ScreenHeader
        title={
          isEditMode ? <Trans>Edit Note</Trans> : <Trans>Create Note</Trans>
        }
        rightAction={
          <View className='flex-row items-center gap-2'>
            {isEditMode && (
              <Button
                variant='ghost'
                size='icon'
                onPress={handleOpenOptions}
                accessibilityLabel='Options'
              >
                <Icon as={MoreVertical} />
              </Button>
            )}
            <Button
              onPress={form.handleSubmit(handleSubmit)}
              disabled={isLoading || isLoadingNote}
              loading={mutation.isPending}
            >
              <Text>
                {isLoading ? (
                  isEditMode ? (
                    <Trans>Saving...</Trans>
                  ) : (
                    <Trans>Creating...</Trans>
                  )
                ) : isEditMode ? (
                  <Trans>Save</Trans>
                ) : (
                  <Trans>Create</Trans>
                )}
              </Text>
            </Button>
          </View>
        }
        onBack={handleBackPress}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{
          flex: 1,
        }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
          }}
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}
          bounces={false}
          // nestedScrollEnabled
        >
          {isLoadingNote && isEditMode ? (
            <View className='flex-1 items-center justify-center'>
              <ActivityIndicator size='large' color={colors.primary} />
              <Text className='mt-4 text-muted-foreground'>
                <Trans>Loading note...</Trans>
              </Text>
            </View>
          ) : (
            <Form {...form}>
              <View className='flex-1 gap-4 px-4 pb-0 pt-4'>
                <View className='flex-row gap-2'>
                  <FormField
                    control={form.control}
                    name='title'
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <FormLabel>
                          <Trans>Title</Trans>
                        </FormLabel>
                        <Input
                          {...field}
                          placeholder={t`Enter note title...`}
                          editable={!isLoadingNote}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='mood'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <Trans>Mood</Trans>
                        </FormLabel>
                        <Pressable
                          onPress={() => moodPickerRef.current?.open()}
                          className='size-10 flex-row items-center justify-center rounded-lg border border-border bg-background'
                        >
                          <Text className='text-xl'>
                            {field.value || DEFAULT_MOOD.emoji}
                          </Text>
                        </Pressable>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </View>

                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem className='flex-1'>
                      <FormLabel>
                        <Trans>Description</Trans>
                      </FormLabel>
                      <RichTextEditor
                        ref={editorRef}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={t`Write your note description here...`}
                        className='flex-1'
                        editable={!isLoadingNote}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </View>
            </Form>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Mood Picker Modal */}
      <MoodPickerModal
        ref={moodPickerRef}
        currentMood={form.watch('mood')}
        onMoodSelect={(emoji) => {
          form.setValue('mood', emoji)
        }}
      />

      {/* Options Menu */}
      {isEditMode && (
        <BottomSheet ref={optionsSheetRef}>
          <View className='px-4 pb-4'>
            <Button
              onPress={handleDelete}
              variant='ghost'
              className='justify-start bg-background'
              disabled={deleteMutation.isPending}
            >
              <Icon as={Trash2} className='text-destructive' />
              <Text className='text-destructive'>
                <Trans>Move to trash</Trans>
              </Text>
            </Button>
          </View>
        </BottomSheet>
      )}

      {/* Discard Changes Bottom Sheet */}
      <BottomSheet ref={discardSheetRef}>
        <View className='px-4 pb-4'>
          <View className='mb-4 gap-2'>
            <Text className='text-lg font-semibold text-foreground'>
              {isEditMode ? 'Discard changes?' : 'Discard note?'}
            </Text>
            <Text className='text-sm text-muted-foreground'>
              {isEditMode
                ? 'You have unsaved changes. Are you sure you want to discard them?'
                : 'You have an unsaved note. Are you sure you want to discard it?'}
            </Text>
          </View>
          <View className='flex-col gap-2'>
            <Button
              onPress={handleSaveAndExit}
              disabled={mutation.isPending}
              loading={mutation.isPending}
            >
              <Text>
                {isEditMode ? (
                  <Trans>Save and Exit</Trans>
                ) : (
                  <Trans>Create and Exit</Trans>
                )}
              </Text>
            </Button>
            <Button onPress={handleDiscard} variant='secondary'>
              <Text>Discard</Text>
            </Button>
            <Button variant='outline' onPress={handleCancelDiscard}>
              <Text>Cancel</Text>
            </Button>
          </View>
        </View>
      </BottomSheet>
    </SafeAreaView>
  )
}
