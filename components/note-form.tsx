import React, { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Trans, useLingui } from '@lingui/react/macro'
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { Textarea } from '@/components/ui/textarea'
import { useTheme } from '@/hooks/use-theme'
import { createNote, getNote, updateNote } from '@/services/notes'

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
  const queryClient = useQueryClient()
  const isEditMode = !!noteId

  const {
    data: noteData,
    isLoading: isLoadingNote,
    isFetching: isFetchingNote,
    isError: isNoteError,
  } = useQuery({
    queryKey: ['note', noteId],
    queryFn: () => getNote(noteId!),
    enabled: isEditMode,
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
      if (isEditMode && noteId) {
        queryClient.invalidateQueries({ queryKey: ['note', noteId] })
      }
      if (!isEditMode) {
        form.reset({ title: '', description: '' })
      }
      router.back()
    },
    onError: (error: unknown) => {
      console.error('Note Error:', error)
      const errorMessage =
        error instanceof Error
          ? error.message
          : isEditMode
            ? 'Failed to update note'
            : 'Failed to create note'
      Alert.alert('Error', errorMessage, [{ text: 'OK' }])
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
          <ArrowLeft
            size={24}
            color={isLoading ? colors.mutedForeground : colors.foreground}
          />
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
          className='flex-1 gap-8 px-4'
          contentContainerStyle={{
            flexGrow: 1,
            paddingVertical: 24,
          }}
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}
          bounces={false}
          nestedScrollEnabled
        >
          <Card className='border-border/0 shadow-none sm:border-border sm:shadow-sm sm:shadow-black/5'>
            <CardHeader>
              <CardTitle className='text-center text-xl sm:text-left'>
                {isEditMode ? (
                  <Trans>Edit Note</Trans>
                ) : (
                  <Trans>Create Note</Trans>
                )}
              </CardTitle>
              <CardDescription className='text-center sm:text-left'>
                {isEditMode ? (
                  <Trans>
                    Update the title and description for your note (both
                    optional).
                  </Trans>
                ) : (
                  <Trans>
                    Add a title and description for your note (both optional).
                  </Trans>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className='gap-6'>
              {isLoadingNote && isEditMode ? (
                <View className='items-center justify-center py-12'>
                  <ActivityIndicator size='large' color={colors.primary} />
                  <Text className='mt-4 text-muted-foreground'>
                    <Trans>Loading note...</Trans>
                  </Text>
                </View>
              ) : (
                <Form {...form}>
                  <View className='gap-6'>
                    <FormField
                      control={form.control}
                      name='title'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <Trans>Title</Trans>
                            <Text className='text-muted-foreground'>
                              {' '}
                              (Optional)
                            </Text>
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
                        <FormItem>
                          <FormLabel>
                            <Trans>Description</Trans>
                            <Text className='text-muted-foreground'>
                              {' '}
                              (Optional)
                            </Text>
                          </FormLabel>
                          <Textarea
                            {...field}
                            placeholder={t`Write your note description here...`}
                            numberOfLines={8}
                            textAlignVertical='top'
                            editable={!isLoadingNote}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </View>
                </Form>
              )}
            </CardContent>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
