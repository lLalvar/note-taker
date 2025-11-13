import React, { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react-native'
import { Controller, useForm } from 'react-hook-form'
import { View } from 'react-native'

import { FormField } from '@/components/ui/FormField'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
// import {
//   useGoogleSignInMutation,
//   useSignInMutation,
// } from '@/hooks/useAuthMutations'
import { SignInFormData, signInSchema } from '@/lib/validationSchemas'

// import { useGoogleAuth } from '@/services/authService'

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false)
  // const signInMutation = useSignInMutation()
  // const googleSignInMutation = useGoogleSignInMutation()
  // const { request, response, promptAsync } = useGoogleAuth()

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
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

  const handleGoogleSignIn = () => {
    // promptAsync()
  }

  return (
    // <SafeAreaView className='flex-1 bg-white dark:bg-gray-900'>
    //   <StatusBar style='auto' />
    //   <ScrollView
    //     className='flex-`1'
    //     contentContainerStyle={{ flexGrow: 1 }}
    //     keyboardShouldPersistTaps='handled'
    //   >
    <View className='flex-1 justify-center px-6 py-8'>
      <View className='mb-8'>
        <Text
          variant='h1'
          className='mb-2 text-center text-gray-900 dark:text-white'
        >
          Welcome Back
        </Text>
        <Text
          variant='p'
          className='text-center text-gray-600 dark:text-gray-400'
        >
          Sign in to your account
        </Text>
      </View>

      {/* Form */}
      <View className='mb-6 space-y-4'>
        <Controller
          control={control}
          name='email'
          render={({ field: { onChange, onBlur, value } }) => (
            <FormField
              label='Email'
              placeholder='Enter your email'
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.email?.message}
              keyboardType='email-address'
              autoCapitalize='none'
              autoComplete='email'
            />
          )}
        />

        <Controller
          control={control}
          name='password'
          render={({ field: { onChange, onBlur, value } }) => (
            <FormField
              label='Password'
              placeholder='Enter your password'
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.password?.message}
              secureTextEntry={!showPassword}
              rightIcon={
                showPassword ? (
                  <EyeOff size={20} color='#6B7280' />
                ) : (
                  <Eye size={20} color='#6B7280' />
                )
              }
              onRightIconPress={() => setShowPassword(!showPassword)}
            />
          )}
        />

        <View className='items-end'>
          {/* <Link href='/forgot' asChild>
                <TouchableOpacity>
                  <Text className='text-blue-600 text-sm font-medium'>
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </Link> */}
        </View>
      </View>

      <Button
        onPress={handleSubmit(onSubmit)}
        // loading={signInMutation.isPending}
        disabled={!isValid}
        className='mb-4'
      >
        {/* {signInMutation.isPending ? 'Signing In...' : 'Sign In'} */}
        <Text className='text-blue-400'>Sign In</Text>
      </Button>

      {/* Divider */}
      <View className='mb-4 flex-row items-center'>
        <View className='h-px flex-1 bg-gray-300 dark:bg-gray-600' />
        <Text variant='small' className='mx-4 text-gray-500 dark:text-gray-400'>
          or
        </Text>
        <View className='h-px flex-1 bg-gray-300 dark:bg-gray-600' />
      </View>

      <Button
        variant='outline'
        onPress={handleGoogleSignIn}
        // loading={googleSignInMutation.isPending}
        // disabled={!request}
        className='mb-6'
      >
        <Text>Continue with Google</Text>
      </Button>

      <View className='flex-row justify-center'>
        <Text variant='p' className='text-gray-600 dark:text-gray-400'>
          Don&apos;t have an account?{' '}
        </Text>
        {/* <Link href='/sign-up' asChild>
              <TouchableOpacity>
                <Text className='text-blue-600 font-medium'>Sign Up</Text>
              </TouchableOpacity>
            </Link> */}
      </View>
    </View>
    //   </ScrollView>
    // </SafeAreaView>
  )
}
