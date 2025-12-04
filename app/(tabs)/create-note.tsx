import React from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Trans, useLingui } from '@lingui/react/macro'
import { useMutation } from '@tanstack/react-query'
import { router } from 'expo-router'
import { useForm } from 'react-hook-form'
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native'
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
import { Text } from '@/components/ui/text'
import { Textarea } from '@/components/ui/textarea'

const createNoteSchema = z.object({
  content: z
    .string()
    .min(1, 'Note content is required')
    .max(5000, 'Note is too long'),
})

type CreateNoteFormData = z.infer<typeof createNoteSchema>

export default function CreateNoteScreen() {
  const { t } = useLingui()

  const form = useForm<CreateNoteFormData>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: {
      content: '',
    },
  })

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form

  const createNoteMutation = useMutation({
    // For now just log the note; later we'll connect this to Firestore.
    mutationFn: async ({ content }: CreateNoteFormData) => {
      // Simulate async work so loading state is visible.
      await new Promise((resolve) => setTimeout(resolve, 500))
      console.log('New note content:', content)
    },
    onSuccess: () => {
      router.back()
    },
  })

  const onSubmit = (data: CreateNoteFormData) => {
    createNoteMutation.mutate(data)
  }

  return (
    <SafeAreaView className='flex-1 bg-background' edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='flex-1'
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          className='flex-1 gap-8 px-4'
          contentContainerStyle={{
            flexGrow: 1,
            paddingVertical: 32,
            justifyContent: 'center',
          }}
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}
          bounces={false}
          nestedScrollEnabled
        >
          <Card className='border-border/0 shadow-none sm:border-border sm:shadow-sm sm:shadow-black/5'>
            <CardHeader>
              <CardTitle className='text-center text-xl sm:text-left'>
                <Trans>Create Note</Trans>
              </CardTitle>
              <CardDescription className='text-center sm:text-left'>
                <Trans>Start by typing your note below.</Trans>
              </CardDescription>
            </CardHeader>
            <CardContent className='gap-6'>
              <Form {...form}>
                <View className='gap-6'>
                  <FormField
                    control={form.control}
                    name='content'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <Trans>Note</Trans>
                        </FormLabel>
                        <Textarea
                          {...field}
                          placeholder={t`Write your note here...`}
                          numberOfLines={8}
                          textAlignVertical='top'
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    className='w-full'
                    onPress={handleSubmit(onSubmit)}
                    loading={isSubmitting || createNoteMutation.isPending}
                  >
                    <Text>
                      {createNoteMutation.isPending ? (
                        <Trans>Creating...</Trans>
                      ) : (
                        <Trans>Create Note</Trans>
                      )}
                    </Text>
                  </Button>
                </View>
              </Form>
            </CardContent>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
