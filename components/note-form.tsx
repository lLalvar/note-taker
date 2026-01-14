import React, { useEffect, useMemo } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Trans, useLingui } from '@lingui/react/macro'
import { Timestamp } from '@react-native-firebase/firestore'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { router } from 'expo-router'
import { ArrowLeft } from 'lucide-react-native'
import { useForm } from 'react-hook-form'
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { z } from 'zod'

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
import { useAuth } from '@/hooks/use-auth'
import { useTheme } from '@/hooks/use-theme'
import { createNote, getNote, updateNote } from '@/services/notes'
import type { Note } from '@/types'

const noteSchema = z.object({
  title: z.string().max(200, 'Title is too long').optional(),
  description: z.string().max(5000, 'Description is too long').optional(),
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
    isFetching: isFetchingNote,
    isError: isNoteError,
  } = useQuery({
    queryKey: ['note', noteId],
    queryFn: () => getNote(noteId!),
    enabled: isEditMode,
    placeholderData: placeholderNote,
  })

  const form = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  })

  useEffect(() => {
    if (isNoteError && isEditMode) {
      Alert.alert('Error', 'Failed to load note', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ])
    }
  }, [isNoteError, isEditMode])

  useEffect(() => {
    if (isEditMode && noteData && !isFetchingNote) {
      form.reset({
        title: noteData.title || '',
        description: noteData.description || '',
      })
    }
  }, [isEditMode, noteData, isFetchingNote, form])

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

        form.reset({ title: '', description: '' })
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

  const isLoading = isLoadingNote || mutation.isPending

  return (
    <SafeAreaView className='flex-1 bg-background' edges={['top', 'bottom']}>
      {/* Header with Back and Save buttons */}
      <View className='flex-row items-center justify-between border-b border-border bg-background px-4 py-3'>
        <Button
          variant='ghost'
          size='icon'
          onPress={() => router.back()}
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
                <FormField
                  control={form.control}
                  name='title'
                  render={({ field }) => (
                    <FormItem>
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
    </SafeAreaView>
  )
}
