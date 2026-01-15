import React, { useRef, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Trans, useLingui } from '@lingui/react/macro'
import { useMutation } from '@tanstack/react-query'
import { Link, router } from 'expo-router'
import { Eye, EyeOff } from 'lucide-react-native'
import { useForm } from 'react-hook-form'
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { toast } from 'sonner-native'
import { z } from 'zod'

import { SocialConnections } from '@/components/social-connections'
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
// import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Text } from '@/components/ui/text'
import { getAuthErrorMessage } from '@/lib/utils'
import {
  EmailNotVerifiedError,
  resendVerificationEmail,
  signInWithEmail,
} from '@/services/auth'

const signInSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
})

type SignInFormData = z.infer<typeof signInSchema>

export default function SignIn() {
  const { t } = useLingui()
  const [showPassword, setShowPassword] = useState(false)
  const [emailNotVerified, setEmailNotVerified] = useState(false)
  const [pendingEmail, setPendingEmail] = useState<string | null>(null)
  const passwordInputRef = React.useRef<TextInput>(null)
  const scrollViewRef = useRef<ScrollView>(null)

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form

  const signInMutation = useMutation({
    mutationFn: ({ email, password }: SignInFormData) =>
      signInWithEmail(email, password),
    onSuccess: (user) => {
      // User is already verified at this point (checked in signInWithEmail)
      setEmailNotVerified(false)
      router.replace('/(app)/(tabs)')
    },
    onError: (error: unknown) => {
      if (error instanceof EmailNotVerifiedError) {
        setEmailNotVerified(true)
        const emailValue = form.getValues('email')
        setPendingEmail(emailValue)
        toast.error(t`Email Not Verified`, {
          description: error.message,
        })
      } else {
        setEmailNotVerified(false)
        const errorMessage = getAuthErrorMessage(error)
        toast.error(t`Sign in failed`, {
          description: errorMessage,
        })
      }
    },
  })

  const resendVerificationMutation = useMutation({
    mutationFn: ({ email, password }: SignInFormData) =>
      resendVerificationEmail(email, password),
    onSuccess: () => {
      toast.success(t`Verification Email Sent`, {
        description: t`Please check your inbox and verify your email address.`,
        duration: 10000,
      })
    },
    onError: (error: unknown) => {
      console.log('🚀 ~ :107 ~ error:', error)
      const errorMessage = getAuthErrorMessage(error)
      toast.error(t`Failed to send verification email`, {
        description: errorMessage,
      })
    },
  })

  const onSubmit = (data: SignInFormData) => {
    signInMutation.mutate(data)
  }

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus()
  }

  // function onEmailFocus() {
  //   if (Platform.OS === 'android') {
  //     setTimeout(() => {
  //       scrollViewRef.current?.scrollToEnd({ animated: true })
  //     }, 300)
  //   }
  // }

  // function onPasswordFocus() {
  //   if (Platform.OS === 'android') {
  //     setTimeout(() => {
  //       scrollViewRef.current?.scrollToEnd({ animated: true })
  //     }, 300)
  //   }
  // }

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
              <CardTitle className='text-center text-xl sm:text-left'>
                <Trans>Sign in to your app</Trans>
              </CardTitle>
              <CardDescription className='text-center sm:text-left'>
                <Trans>Welcome back! Please sign in to continue</Trans>
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
                        // value={field.value}
                        // onChange={field.onChange}
                        // onBlur={field.onBlur}
                        // onFocus={onEmailFocus}
                        onSubmitEditing={onEmailSubmitEditing}
                        returnKeyType='next'
                        submitBehavior='submit'
                      />
                    )}
                  />

                  <View className='gap-2'>
                    <FormField
                      control={form.control}
                      name='password'
                      render={({ field }) => (
                        <FormInput
                          {...field}
                          name='password'
                          label={t`Password`}
                          ref={passwordInputRef}
                          placeholder={t`Enter your password`}
                          secureTextEntry={!showPassword}
                          returnKeyType='send'
                          onSubmitEditing={handleSubmit(onSubmit)}
                          rightIcon={
                            <Button
                              variant='ghost'
                              size='icon'
                              onPress={() => setShowPassword(!showPassword)}
                              accessibilityLabel='Toggle password visibility'
                            >
                              {showPassword ? (
                                <Icon
                                  as={EyeOff}
                                  className='text-muted-foreground'
                                />
                              ) : (
                                <Icon
                                  as={Eye}
                                  className='text-muted-foreground'
                                />
                              )}
                            </Button>
                          }
                        />
                      )}
                    />
                    <View className='items-end'>
                      <Link href='/(auth)/forgot-password' asChild>
                        <Button variant='link' className='h-6 p-0'>
                          <Text>
                            <Trans>Forgot Password?</Trans>
                          </Text>
                        </Button>
                      </Link>
                    </View>
                  </View>

                  <Button
                    className='w-full bg-primary'
                    onPress={handleSubmit(onSubmit)}
                    loading={isSubmitting || signInMutation.isPending}
                  >
                    <Text>
                      {signInMutation.isPending ? (
                        <Trans>Signing in...</Trans>
                      ) : (
                        <Trans>Continue</Trans>
                      )}
                    </Text>
                  </Button>

                  {emailNotVerified && pendingEmail && (
                    <View className='gap-2'>
                      <View className='rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20'>
                        <Text className='mb-2 text-center text-sm text-blue-800 dark:text-blue-200'>
                          <Trans>
                            Your email address has not been verified. Please
                            check your inbox and click the verification link.
                          </Trans>
                        </Text>
                        <Button
                          variant='outline'
                          className='w-full'
                          onPress={() => {
                            const password = form.getValues('password')
                            if (password) {
                              resendVerificationMutation.mutate({
                                email: pendingEmail,
                                password,
                              })
                            }
                          }}
                          loading={resendVerificationMutation.isPending}
                        >
                          <Text>
                            {resendVerificationMutation.isPending ? (
                              <Trans>Sending...</Trans>
                            ) : (
                              <Trans>Resend Verification Email</Trans>
                            )}
                          </Text>
                        </Button>
                      </View>
                    </View>
                  )}
                </View>
              </Form>

              {/* Sign Up Link */}
              <View className='flex-row items-center justify-center'>
                <Text className='text-center text-sm'>
                  <Trans>Don&apos;t have an account?</Trans>
                </Text>
                <Link href='/(auth)/sign-up' asChild>
                  <Button variant='link' size='sm'>
                    <Text className='native:text-sm'>
                      <Trans>Sign up</Trans>
                    </Text>
                  </Button>
                </Link>
              </View>

              {/* Divider */}
              <View className='flex-row items-center'>
                <Separator className='flex-1' />
                <Text className='px-4 text-sm text-muted-foreground'>
                  <Trans>or</Trans>
                </Text>
                <Separator className='flex-1' />
              </View>

              {/* Social Connections */}
              <SocialConnections />
            </CardContent>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
