import React, { useRef, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Trans, useLingui } from '@lingui/react/macro'
import { useMutation } from '@tanstack/react-query'
import { Link, router } from 'expo-router'
import { Eye, EyeOff } from 'lucide-react-native'
import { useForm } from 'react-hook-form'
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
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
import { signInWithEmail } from '@/services/auth-service'

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
    onSuccess: () => {
      router.replace('/(tabs)')
    },
    onError: (error: unknown) => {
      console.error('Sign In Error:', error)
      Alert.alert(
        t`Sign in failed`,
        t`Please check your credentials and try again.`
      )
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

                  {/* Password Field */}
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
                          </Button>
                        }
                      />
                    )}
                  />

                  {/* Sign In Button */}
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
