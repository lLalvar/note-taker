import React, { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Trans, useLingui } from '@lingui/react/macro'
import { Link } from 'expo-router'
import { Eye, EyeOff } from 'lucide-react-native'
import { Controller, useForm } from 'react-hook-form'
import { Pressable, TextInput, View } from 'react-native'

import { SocialConnections } from '@/components/social-connections'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Text } from '@/components/ui/text'
// import {
//   useGoogleSignInMutation,
//   useSignInMutation,
// } from '@/hooks/useAuthMutations'
import { SignInFormData, signInSchema } from '@/lib/validationSchemas'

// import { useGoogleAuth } from '@/services/authService'

export default function SignIn() {
  const { t } = useLingui()
  const [showPassword, setShowPassword] = useState(false)
  const passwordInputRef = React.useRef<TextInput>(null)
  // const signInMutation = useSignInMutation()
  // const googleSignInMutation = useGoogleSignInMutation()
  // const { request, response, promptAsync } = useGoogleAuth()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  })

  // useEffect(() => {
  //   if (response?.type === 'success') {
  //     const { id_token } = response.params
  //     if (id_token) {
  //       // googleSignInMutation.mutate(id_token)
  //       console.log('Google Sign-In successful with token:', id_token)
  //     }
  //   }
  // }, [response])

  const onSubmit = (data: SignInFormData) => {
    // signInMutation.mutate(data)
    console.log('Sign In Data:', data)
  }

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus()
  }

  return (
    // <SafeAreaView className='flex-1 bg-background'>
    //   <ScrollView
    //     className='flex-1'
    //     contentContainerStyle={{ flexGrow: 1 }}
    //     keyboardShouldPersistTaps='handled'
    //   >
    <View className=''>
      <View className='gap-6'>
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
            <View className='gap-6'>
              {/* Email Field */}
              <View className='gap-1.5'>
                <Label htmlFor='email'>
                  <Trans>Email</Trans>
                </Label>
                <Controller
                  control={control}
                  name='email'
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View>
                      <Input
                        id='email'
                        placeholder={t`m@example.com`}
                        keyboardType='email-address'
                        autoComplete='email'
                        autoCapitalize='none'
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        onSubmitEditing={onEmailSubmitEditing}
                        returnKeyType='next'
                        submitBehavior='submit'
                      />
                      {errors.email && (
                        <Text className='mt-1 text-sm text-destructive'>
                          {errors.email.message}
                        </Text>
                      )}
                    </View>
                  )}
                />
              </View>

              {/* Password Field */}
              <View className='gap-1.5'>
                <View className='flex-row items-center'>
                  <Label htmlFor='password'>
                    <Trans>Password</Trans>
                  </Label>
                  <Link href='/(auth)/forgot-password' asChild>
                    <Button
                      variant='link'
                      size='sm'
                      className='ml-auto h-4 px-1 py-0 web:h-fit sm:h-4'
                    >
                      <Text className='font-normal leading-4'>
                        <Trans>Forgot your password?</Trans>
                      </Text>
                    </Button>
                  </Link>
                </View>
                <Controller
                  control={control}
                  name='password'
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View className='relative'>
                      <Input
                        ref={passwordInputRef}
                        id='password'
                        placeholder={t`Enter your password`}
                        secureTextEntry={!showPassword}
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        returnKeyType='send'
                        onSubmitEditing={handleSubmit(onSubmit)}
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
                          <EyeOff size={20} color='#6B7280' />
                        ) : (
                          <Eye size={20} color='#6B7280' />
                        )}
                      </Pressable>
                      {errors.password && (
                        <Text className='mt-1 text-sm text-destructive'>
                          {errors.password.message}
                        </Text>
                      )}
                    </View>
                  )}
                />
              </View>

              {/* Sign In Button */}
              <Button
                className='w-full'
                onPress={handleSubmit(onSubmit)}
                disabled={isSubmitting}
              >
                <Text>
                  <Trans>Continue</Trans>
                </Text>
              </Button>
            </View>

            {/* Sign Up Link */}
            <Text className='text-center text-sm'>
              <Trans>
                Don&apos;t have an account?{' '}
                <Link href='/(auth)/sign-up' asChild>
                  <Pressable>
                    <Text className='text-sm underline underline-offset-4'>
                      Sign up
                    </Text>
                  </Pressable>
                </Link>
              </Trans>
            </Text>

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
      </View>
    </View>
    //   </ScrollView>
    // </SafeAreaView>
  )
}
