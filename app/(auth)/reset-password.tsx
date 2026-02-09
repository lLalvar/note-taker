import React, { useEffect, useRef, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { msg } from '@lingui/core/macro'
import { Trans, useLingui } from '@lingui/react/macro'
import { useMutation } from '@tanstack/react-query'
import { router, useLocalSearchParams } from 'expo-router'
import { Eye, EyeOff } from 'lucide-react-native'
import { useForm } from 'react-hook-form'
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { toast } from 'sonner-native'
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
import { Icon } from '@/components/ui/icon'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { i18n } from '@/lib/i18n'
import { getAuthErrorMessage } from '@/lib/utils'
import { passwordSchema } from '@/schemas'
import { resetPassword, verifyResetCode } from '@/services/auth'

const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z
      .string()
      .min(1, { message: i18n._(msg`Please confirm your password`) }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: i18n._(msg`Passwords don't match`),
    path: ['confirmPassword'],
  })

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

export default function ResetPassword() {
  const { t } = useLingui()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isValidCode, setIsValidCode] = useState(false)
  const [isVerifying, setIsVerifying] = useState(true)
  const { oobCode } = useLocalSearchParams<{ oobCode: string }>()
  const passwordInputRef = React.useRef<TextInput>(null)
  const confirmPasswordInputRef = React.useRef<TextInput>(null)
  const scrollViewRef = useRef<ScrollView>(null)

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const { handleSubmit } = form

  const resetPasswordMutation = useMutation({
    mutationFn: ({ code, password }: { code: string; password: string }) =>
      resetPassword(code, password),
    onSuccess: () => {
      toast.success(t`Password Reset Successful`, {
        description: t`Your password has been reset successfully. Please sign in with your new password.`,
      })
      router.replace('/(auth)/sign-in')
    },
    onError: (error: unknown) => {
      const errorMessage = getAuthErrorMessage(error)
      toast.error(t`Reset Failed`, {
        description: errorMessage,
      })
    },
  })

  useEffect(() => {
    if (oobCode) {
      verifyResetCode(oobCode)
        .then(() => {
          setIsValidCode(true)
          setIsVerifying(false)
        })
        .catch((error) => {
          const errorMessage = getAuthErrorMessage(error)
          toast.error(t`Invalid Reset Link`, {
            description:
              errorMessage ||
              t`This password reset link is invalid or has expired.`,
          })
          setIsVerifying(false)
          router.replace('/(auth)/sign-in')
        })
    } else {
      toast.error(t`Invalid Reset Link`, {
        description: t`No reset code found in the link.`,
      })
      setIsVerifying(false)
      router.replace('/(auth)/sign-in')
    }
  }, [oobCode, t])

  const onSubmit = (data: ResetPasswordFormData) => {
    if (!oobCode) {
      toast.error(t`Error`, {
        description: t`No reset code available`,
      })
      return
    }

    resetPasswordMutation.mutate({ code: oobCode, password: data.password })
  }

  function onPasswordSubmitEditing() {
    confirmPasswordInputRef.current?.focus()
  }

  function onPasswordFocus() {
    if (Platform.OS === 'android') {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true })
      }, 300)
    }
  }

  function onConfirmPasswordFocus() {
    if (Platform.OS === 'android') {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true })
      }, 300)
    }
  }

  if (isVerifying) {
    return (
      <SafeAreaView className='flex-1 bg-background' edges={['top', 'bottom']}>
        <View className='flex-1 items-center justify-center px-6'>
          <Text className='text-center text-lg text-muted-foreground'>
            <Trans>Verifying reset link...</Trans>
          </Text>
        </View>
      </SafeAreaView>
    )
  }

  if (!isValidCode) {
    return null
  }

  return (
    <SafeAreaView className='flex-1 bg-background' edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{
            flexGrow: 1,
            padding: 16,
            justifyContent: 'center',
          }}
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <Card className='border-border/0 shadow-none sm:border-border sm:shadow-sm sm:shadow-black/5'>
            <CardHeader>
              <CardTitle className='text-center text-xl sm:text-left'>
                <Trans>Set New Password</Trans>
              </CardTitle>
              <CardDescription className='text-center sm:text-left'>
                <Trans>Please enter your new password below.</Trans>
              </CardDescription>
            </CardHeader>
            <CardContent className='gap-6'>
              <Form {...form}>
                <View className='gap-6'>
                  {/* Password Field */}
                  <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <Trans>New Password</Trans>
                        </FormLabel>
                        <View className='relative'>
                          <Input
                            {...field}
                            ref={passwordInputRef}
                            placeholder={t`Enter your new password`}
                            secureTextEntry={!showPassword}
                            onFocus={onPasswordFocus}
                            returnKeyType='next'
                            onSubmitEditing={onPasswordSubmitEditing}
                            className='pr-10'
                          />
                          <Pressable
                            onPress={() => setShowPassword(!showPassword)}
                            style={{
                              position: 'absolute',
                              right: 12,
                              top: '50%',
                              transform: [{ translateY: -10 }],
                            }}
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
                          </Pressable>
                        </View>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Confirm Password Field */}
                  <FormField
                    control={form.control}
                    name='confirmPassword'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <Trans>Confirm New Password</Trans>
                        </FormLabel>
                        <View className='relative'>
                          <Input
                            {...field}
                            ref={confirmPasswordInputRef}
                            placeholder={t`Confirm your new password`}
                            secureTextEntry={!showConfirmPassword}
                            onFocus={onConfirmPasswordFocus}
                            returnKeyType='send'
                            onSubmitEditing={handleSubmit(onSubmit)}
                            className='pr-10'
                          />
                          <Pressable
                            onPress={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            style={{
                              position: 'absolute',
                              right: 12,
                              top: '50%',
                              transform: [{ translateY: -10 }],
                            }}
                          >
                            {showConfirmPassword ? (
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
                          </Pressable>
                        </View>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Update Password Button */}
                  <Button
                    className='w-full'
                    onPress={handleSubmit(onSubmit)}
                    loading={resetPasswordMutation.isPending}
                  >
                    <Text>
                      {resetPasswordMutation.isPending ? (
                        <Trans>Updating...</Trans>
                      ) : (
                        <Trans>Update Password</Trans>
                      )}
                    </Text>
                  </Button>
                </View>
              </Form>

              {/* Security Note */}
              <View className='rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20'>
                <Text className='text-center text-sm text-blue-800 dark:text-blue-200'>
                  <Trans>
                    Make sure your new password is secure and different from
                    your previous one.
                  </Trans>
                </Text>
              </View>
            </CardContent>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
