import React, { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'expo-router'
import { Eye, EyeOff } from 'lucide-react-native'
import { Controller, useForm } from 'react-hook-form'
import { Pressable, ScrollView, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

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
    <SafeAreaView className='flex-1 bg-background'>
      <ScrollView
        className='flex-1'
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps='handled'
      >
        <View className='flex-1 justify-center px-6 py-8'>
          <View className='gap-6'>
            <Card className='border-border/0 shadow-none sm:border-border sm:shadow-sm sm:shadow-black/5'>
              <CardHeader>
                <CardTitle className='text-center text-xl sm:text-left'>
                  Sign in to your app
                </CardTitle>
                <CardDescription className='text-center sm:text-left'>
                  Welcome back! Please sign in to continue
                </CardDescription>
              </CardHeader>
              <CardContent className='gap-6'>
                <View className='gap-6'>
                  {/* Email Field */}
                  <View className='gap-1.5'>
                    <Label htmlFor='email'>Email</Label>
                    <Controller
                      control={control}
                      name='email'
                      render={({ field: { onChange, onBlur, value } }) => (
                        <View>
                          <Input
                            id='email'
                            placeholder='m@example.com'
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
                      <Label htmlFor='password'>Password</Label>
                      <Link href='/(auth)/forgot-password' asChild>
                        <Button
                          variant='link'
                          size='sm'
                          className='ml-auto h-4 px-1 py-0 web:h-fit sm:h-4'
                        >
                          <Text className='font-normal leading-4'>
                            Forgot your password?
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
                            placeholder='Enter your password'
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
                    <Text>Continue</Text>
                  </Button>
                </View>

                {/* Sign Up Link */}
                <Text className='text-center text-sm'>
                  Don&apos;t have an account?{' '}
                  <Link href='/(auth)/sign-up' asChild>
                    <Pressable>
                      <Text className='text-sm underline underline-offset-4'>
                        Sign up
                      </Text>
                    </Pressable>
                  </Link>
                </Text>

                {/* Divider */}
                <View className='flex-row items-center'>
                  <Separator className='flex-1' />
                  <Text className='px-4 text-sm text-muted-foreground'>or</Text>
                  <Separator className='flex-1' />
                </View>

                {/* Social Connections */}
                <SocialConnections />
              </CardContent>
            </Card>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
