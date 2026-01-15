import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Trans, useLingui } from '@lingui/react/macro'
import { Timestamp } from '@react-native-firebase/firestore'
import { useFocusEffect } from '@react-navigation/native'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { router } from 'expo-router'
import { ArrowLeft } from 'lucide-react-native'
import { useForm } from 'react-hook-form'
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { z } from 'zod'

import {
  MoodPickerModal,
  type MoodPickerModalHandle,
} from '@/components/mood/mood-picker-modal'
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
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Icon } from '@/components/ui/icon'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { Textarea } from '@/components/ui/textarea'
import { DEFAULT_MOOD } from '@/constants/moods'
import { useAuth } from '@/hooks/use-auth'
import { useTheme } from '@/hooks/use-theme'
import { createNote, getNote, updateNote } from '@/services/notes'
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
        form.reset({
          title: noteData.title || '',
          description: noteData.description || '',
          mood: noteData.mood || DEFAULT_MOOD.emoji,
        })
        refetch()
      } else if (!isEditMode) {
        form.reset(defaultValues)

        const timer = setTimeout(() => {
          moodPickerRef.current?.open()
        }, 300)
        return () => clearTimeout(timer)
      }
    }, [isEditMode, noteData, refetch, form, defaultValues])
  )

  const mutation = useMutation({
    mutationFn: async (data: NoteFormData) => {
      if (isEditMode) {
        if (!noteId) throw new Error('Note ID is required for update')
        return updateNote(noteId, data)
      }
      return createNote(data)
    },
    onMutate: async (data) => {
      if (isEditMode && noteId) {
        await queryClient.cancelQueries({ queryKey: ['note', noteId] })
        await queryClient.cancelQueries({ queryKey: ['notes'] })

        const previousNote = queryClient.getQueryData<Note>(['note', noteId])
        const previousNotes = queryClient.getQueryData<Note[]>(['notes'])

        if (previousNote) {
          const optimisticNote: Note = {
            ...previousNote,
            title: data.title,
            description: data.description,
            mood: data.mood,
          }
          queryClient.setQueryData(['note', noteId], optimisticNote)
        }

        if (previousNotes) {
          const optimisticNotes = previousNotes.map((note) =>
            note.id === noteId
              ? {
                  ...note,
                  title: data.title,
                  description: data.description,
                  mood: data.mood,
                }
              : note
          )
          queryClient.setQueryData(['notes'], optimisticNotes)
        }

        router.back()

        return { previousNote, previousNotes }
      } else {
        await queryClient.cancelQueries({ queryKey: ['notes'] })
        const previousNotes = queryClient.getQueryData<Note[]>(['notes'])

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

        if (previousNotes) {
          queryClient.setQueryData(
            ['notes'],
            [optimisticNote, ...previousNotes]
          )
        }

        form.reset({ title: '', description: '', mood: DEFAULT_MOOD.emoji })
        router.back()

        return { previousNotes, tempId }
      }
    },
    onError: (error, data, context) => {
      console.error('Note Error:', error)

      if (isEditMode && context?.previousNote && context?.previousNotes) {
        queryClient.setQueryData(['note', noteId], context.previousNote)
        queryClient.setQueryData(['notes'], context.previousNotes)
      } else if (!isEditMode && context?.previousNotes) {
        queryClient.setQueryData(['notes'], context.previousNotes)
      }

      const errorMessage =
        error instanceof Error
          ? error.message
          : isEditMode
            ? 'Failed to update note'
            : 'Failed to create note'
      Alert.alert('Error', errorMessage, [{ text: 'OK' }])
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
      if (isEditMode && noteId) {
        queryClient.invalidateQueries({ queryKey: ['note', noteId] })
      }
    },
    onSuccess: (data) => {
      if (isEditMode && noteId) {
        queryClient.setQueryData(['note', noteId], data)
      }

      const notes = queryClient.getQueryData<Note[]>(['notes'])
      if (notes) {
        if (isEditMode) {
          const updatedNotes = notes.map((note) =>
            note.id === noteId ? data : note
          )
          queryClient.setQueryData(['notes'], updatedNotes)
        } else {
          const updatedNotes = notes.map((note) =>
            note.id.startsWith('temp-') ? data : note
          )
          queryClient.setQueryData(['notes'], updatedNotes)
        }
      }
    },
  })

  const handleSubmit = (values: NoteFormData) => {
    mutation.mutate(values)
  }

  const isDirty = form.formState.isDirty
  const [shouldNavigate, setShouldNavigate] = useState(false)
  const [showDiscardDialog, setShowDiscardDialog] = useState(false)

  const handleShowDiscardDialog = useCallback(() => {
    setShowDiscardDialog(true)
  }, [])

  const handleDiscard = () => {
    setShouldNavigate(true)
    setShowDiscardDialog(false)
    router.back()
  }

  const handleCancelDiscard = () => {
    setShowDiscardDialog(false)
  }

  useEffect(() => {
    if (Platform.OS === 'android') {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
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
    if (isDirty && !shouldNavigate && !mutation.isPending) {
      handleShowDiscardDialog()
    } else {
      router.back()
    }
  }

  const isLoading = isLoadingNote || mutation.isPending

  return (
    <SafeAreaView className='flex-1 bg-background' edges={['top', 'bottom']}>
      {/* Header with Back and Save buttons */}
      <View className='flex-row items-center justify-between border-b border-border bg-background px-4 py-3'>
        <Button
          variant='ghost'
          size='icon'
          onPress={handleBackPress}
          disabled={isLoading}
        >
          <Icon as={ArrowLeft} />
        </Button>
        <Button
          variant='ghost'
          onPress={form.handleSubmit(handleSubmit)}
          disabled={isLoading || isLoadingNote}
          loading={mutation.isPending}
        >
          <Text className='font-medium'>
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

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='flex-1'
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          className='flex-1'
          contentContainerStyle={{
            flexGrow: 1,
          }}
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}
          bounces={false}
          nestedScrollEnabled
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
              <View className='flex-1 gap-4 px-4 pb-8 pt-4'>
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
                      <Textarea
                        {...field}
                        placeholder={t`Write your note description here...`}
                        className='flex-1'
                        editable={!isLoadingNote}
                        multiline
                        textAlignVertical='top'
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

      {/* Discard Changes Dialog */}
      <AlertDialog open={showDiscardDialog} onOpenChange={setShowDiscardDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isEditMode ? 'Discard changes?' : 'Discard note?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isEditMode
                ? 'You have unsaved changes. Are you sure you want to discard them?'
                : 'You have an unsaved note. Are you sure you want to discard it?'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onPress={handleCancelDiscard}>
              <Text>Cancel</Text>
            </AlertDialogCancel>
            <AlertDialogAction onPress={handleDiscard}>
              <Text>Discard</Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SafeAreaView>
  )
}
