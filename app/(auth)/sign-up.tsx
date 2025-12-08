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
  Pressable,
  ScrollView,
  TextInput,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
// import {
//   useGoogleSignInMutation,
//   useSignUpMutation,
// } from '@/hooks/useAuthMutations'
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
import {
  Form,
  FormField,
  FormInput,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Icon } from '@/components/ui/icon'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Text } from '@/components/ui/text'
import { signUpWithEmail } from '@/services/auth'

// import { useGoogleAuth } from '@/services/authService'

const signUpSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Name is required')
      .min(2, 'Name must be at least 2 characters'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Invalid email address'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type SignUpFormData = z.infer<typeof signUpSchema>

export default function SignUp() {
  const { t } = useLingui()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const passwordInputRef = React.useRef<TextInput>(null)
  const confirmPasswordInputRef = React.useRef<TextInput>(null)
  const scrollViewRef = useRef<ScrollView>(null)
  // const signUpMutation = useSignUpMutation()
  // const googleSignInMutation = useGoogleSignInMutation()
  // const { request, response, promptAsync } = useGoogleAuth()

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  })

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form

  const signUpMutation = useMutation({
    mutationFn: ({ name, email, password }: SignUpFormData) =>
      signUpWithEmail(name, email, password),
    onSuccess: () => {
      router.replace('/(app)')
    },
    onError: (error: unknown) => {
      console.error('Sign Up Error:', error)
    },
  })

  // useEffect(() => {
  //   if (response?.type === 'success') {
  //     const { id_token } = response.params
  //     if (id_token) {
  //       // googleSignInMutation.mutate(id_token)
  //       console.log('Google Sign-Up successful with token:', id_token)
  //     }
  //   }
  // }, [response])

  const onSubmit = (data: SignUpFormData) => {
    signUpMutation.mutate(data)
  }

  function onNameSubmitEditing() {
    // Focus email field next
    // We'll need to add refs for this if needed
  }

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus()
  }

  function onPasswordSubmitEditing() {
    confirmPasswordInputRef.current?.focus()
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
              <CardTitle className='text-center text-xl sm:text-left'>
                <Trans>Create your account</Trans>
              </CardTitle>
              <CardDescription className='text-center sm:text-left'>
                <Trans>Sign up to get started</Trans>
              </CardDescription>
            </CardHeader>
            <CardContent className='gap-6'>
              <Form {...form}>
                <View className='gap-6'>
                  {/* Name Field */}
                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormInput
                        {...field}
                        name='name'
                        label={t`Full Name`}
                        placeholder={t`Enter your full name`}
                        autoCapitalize='words'
                        autoComplete='name'
                        onSubmitEditing={onNameSubmitEditing}
                        returnKeyType='next'
                        submitBehavior='submit'
                      />
                    )}
                  />

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
                        onSubmitEditing={onEmailSubmitEditing}
                        returnKeyType='next'
                        submitBehavior='submit'
                      />
                    )}
                  />

                  {/* Password Field */}
                  <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <Trans>Password</Trans>
                        </FormLabel>
                        <View className='relative'>
                          <Input
                            {...field}
                            ref={passwordInputRef}
                            placeholder={t`Create a password`}
                            secureTextEntry={!showPassword}
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
                                size={20}
                                className='text-muted-foreground'
                              />
                            ) : (
                              <Icon
                                as={Eye}
                                size={20}
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
                          <Trans>Confirm Password</Trans>
                        </FormLabel>
                        <View className='relative'>
                          <Input
                            {...field}
                            ref={confirmPasswordInputRef}
                            placeholder={t`Confirm your password`}
                            secureTextEntry={!showConfirmPassword}
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
                                size={20}
                                className='text-muted-foreground'
                              />
                            ) : (
                              <Icon
                                as={Eye}
                                size={20}
                                className='text-muted-foreground'
                              />
                            )}
                          </Pressable>
                        </View>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Sign Up Button */}
                  <Button
                    className='w-full'
                    onPress={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                  >
                    <Text>
                      <Trans>Create Account</Trans>
                    </Text>
                  </Button>
                </View>
              </Form>

              {/* Sign In Link */}
              <View className='flex-row items-center justify-center'>
                <Text className='text-center text-sm'>
                  <Trans>Already have an account?</Trans>
                </Text>
                <Link href='/(auth)/sign-in' asChild>
                  <Button variant='link' size='sm'>
                    <Text className='native:text-sm'>
                      <Trans>Sign in</Trans>
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
