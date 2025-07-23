// app/forgot-password.tsx
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { ArrowLeft, Mail } from 'lucide-react-native'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/FormField'
import { useForgotPasswordMutation } from '@/hooks/useAuthMutations'
import {
  ForgotPasswordFormData,
  forgotPasswordSchema,
} from '@/lib/validationSchemas'

export default function ForgotPassword() {
  const forgotPasswordMutation = useForgotPasswordMutation()

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onChange',
  })

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgotPasswordMutation.mutate(data.email)
  }

  return (
    <SafeAreaView className='flex-1 bg-white dark:bg-gray-900'>
      <StatusBar style='auto' />
      <ScrollView
        className='flex-1'
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps='handled'
      >
        <View className='flex-1 px-6 py-8'>
          {/* Header with Back Button */}
          <View className='flex-row items-center mb-8'>
            <TouchableOpacity
              onPress={() => router.back()}
              className='mr-4 p-2 -ml-2'
            >
              <ArrowLeft size={24} color='#6B7280' />
            </TouchableOpacity>
            <Text className='text-xl font-semibold text-gray-900 dark:text-white'>
              Reset Password
            </Text>
          </View>

          <View className='flex-1 justify-center'>
            {/* Icon */}
            <View className='items-center mb-8'>
              <View className='w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full items-center justify-center mb-4'>
                <Mail size={32} color='#3B82F6' />
              </View>
              <Text className='text-2xl font-bold text-gray-900 dark:text-white text-center mb-2'>
                Forgot Password?
              </Text>
              <Text className='text-gray-600 dark:text-gray-400 text-center px-4'>
                Enter your email address and we&apos;ll send you a link to reset
                your password.
              </Text>
            </View>

            {/* Form */}
            <View className='space-y-4 mb-6'>
              <Controller
                control={control}
                name='email'
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormField
                    label='Email Address'
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
            </View>

            <Button
              onPress={handleSubmit(onSubmit)}
              // loading={forgotPasswordMutation.isPending}
              disabled={!isValid}
              className='mb-6'
            >
              {forgotPasswordMutation.isPending
                ? 'Sending...'
                : 'Send Reset Email'}
            </Button>

            {/* Back to Sign In Link */}
            <View className='flex-row justify-center'>
              <Text className='text-gray-600 dark:text-gray-400'>
                Remember your password?{' '}
              </Text>
              <Link href='/sign-in' asChild>
                <TouchableOpacity>
                  <Text className='text-blue-600 font-medium'>Sign In</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
