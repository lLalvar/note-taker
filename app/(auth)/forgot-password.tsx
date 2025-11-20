import React, { useRef } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Trans, useLingui } from '@lingui/react/macro'
import { Link, router } from 'expo-router'
import { ArrowLeft } from 'lucide-react-native'
import { useForm } from 'react-hook-form'
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
// import { useForgotPasswordMutation } from '@/hooks/useAuthMutations'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Form, FormField, FormInput } from '@/components/ui/form'
import { Icon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'

const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export default function ForgotPassword() {
  const { t } = useLingui()
  const scrollViewRef = useRef<ScrollView>(null)
  // const forgotPasswordMutation = useForgotPasswordMutation()

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onChange',
  })

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form

  const onSubmit = (data: ForgotPasswordFormData) => {
    // forgotPasswordMutation.mutate(data.email)
    console.log('Forgot Password Data:', data)
  }

  function onEmailFocus() {
    if (Platform.OS === 'android') {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true })
      }, 300)
    }
  }

  return (
    <SafeAreaView className='flex-1 bg-background' edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='flex-1'
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          className='flex-1 gap-8 px-4'
          contentContainerStyle={{
            flexGrow: 1,
            paddingVertical: 32,
            justifyContent: 'center',
          }}
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}
          bounces={false}
          nestedScrollEnabled={true}
        >
          <Card className='border-border/0 shadow-none sm:border-border sm:shadow-sm sm:shadow-black/5'>
            <CardHeader>
              <View className='mb-4 flex-row items-center'>
                <Pressable
                  onPress={() => router.back()}
                  className='-ml-2 mr-4 p-2'
                >
                  <Icon
                    as={ArrowLeft}
                    size={24}
                    className='text-muted-foreground'
                  />
                </Pressable>
                <CardTitle className='flex-1 text-xl'>
                  <Trans>Reset Password</Trans>
                </CardTitle>
              </View>
              <CardDescription>
                <Trans>
                  Enter your email address and we&apos;ll send you a link to
                  reset your password.
                </Trans>
              </CardDescription>
            </CardHeader>
            <CardContent className='gap-6'>
              <Form {...form}>
                <View className='gap-6'>
                  {/* Email Field */}
                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormInput
                        {...field}
                        name='email'
                        label={t`Email`}
                        placeholder={t`m@example.com`}
                        keyboardType='email-address'
                        autoComplete='email'
                        autoCapitalize='none'
                        onFocus={onEmailFocus}
                        returnKeyType='send'
                        onSubmitEditing={handleSubmit(onSubmit)}
                        submitBehavior='submit'
                      />
                    )}
                  />

                  {/* Send Reset Email Button */}
                  <Button
                    className='w-full'
                    onPress={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                  >
                    <Text>
                      <Trans>Send Reset Email</Trans>
                    </Text>
                  </Button>
                </View>
              </Form>

              {/* Back to Sign In Link */}
              <View className='flex-row items-center justify-center'>
                <Text className='text-center text-sm'>
                  <Trans>Remember your password?</Trans>
                </Text>
                <Link href='/(auth)/sign-in' asChild>
                  <Button variant='link' size='sm'>
                    <Text className='native:text-sm'>
                      <Trans>Sign in</Trans>
                    </Text>
                  </Button>
                </Link>
              </View>
            </CardContent>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
