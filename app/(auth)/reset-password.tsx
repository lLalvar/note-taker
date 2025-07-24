// import { zodResolver } from '@hookform/resolvers/zod'
// import { useMutation } from '@tanstack/react-query'
// import { router, useLocalSearchParams } from 'expo-router'
// import { StatusBar } from 'expo-status-bar'
// import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth'
// import { Eye, EyeOff, Lock } from 'lucide-react-native'
// import React, { useEffect, useState } from 'react'
// import { Controller, useForm } from 'react-hook-form'
// import { Alert, ScrollView, Text, View } from 'react-native'
// import { SafeAreaView } from 'react-native-safe-area-context'

// import { Button } from '@/components/ui/button'
// import { FormField } from '@/components/ui/FormField'
// import { auth } from '@/lib/firebase'
// import {
//   ResetPasswordFormData,
//   resetPasswordSchema,
// } from '@/lib/validationSchemas'

// export default function ResetPasswordScreen() {
//   const [showPassword, setShowPassword] = useState(false)
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false)
//   const [isValidCode, setIsValidCode] = useState(false)
//   const { oobCode } = useLocalSearchParams<{ oobCode: string }>()

//   const {
//     control,
//     handleSubmit,
//     formState: { errors, isValid },
//   } = useForm<ResetPasswordFormData>({
//     resolver: zodResolver(resetPasswordSchema),
//     defaultValues: {
//       password: '',
//       confirmPassword: '',
//     },
//     mode: 'onChange',
//   })

//   // Verify the reset code on component mount
//   useEffect(() => {
//     if (oobCode) {
//       verifyPasswordResetCode(auth, oobCode)
//         .then(() => {
//           setIsValidCode(true)
//         })
//         .catch(() => {
//           Alert.alert(
//             'Invalid Reset Link',
//             'This password reset link is invalid or has expired.',
//             [{ text: 'OK', onPress: () => router.replace('/sign-in') }]
//           )
//         })
//     } else {
//       Alert.alert('Invalid Reset Link', 'No reset code found in the link.', [
//         { text: 'OK', onPress: () => router.replace('/sign-in') },
//       ])
//     }
//   }, [oobCode])

//   const resetPasswordMutation = useMutation({
//     mutationFn: async (newPassword: string) => {
//       if (!oobCode) throw new Error('No reset code available')
//       await confirmPasswordReset(auth, oobCode, newPassword)
//     },
//     onSuccess: () => {
//       Alert.alert(
//         'Password Reset Successful',
//         'Your password has been reset successfully. Please sign in with your new password.',
//         [{ text: 'OK', onPress: () => router.replace('/sign-in') }]
//       )
//     },
//     onError: (error: any) => {
//       let message = 'Failed to reset password'

//       switch (error.code) {
//         case 'auth/expired-action-code':
//           message = 'This reset link has expired. Please request a new one.'
//           break
//         case 'auth/invalid-action-code':
//           message = 'This reset link is invalid. Please request a new one.'
//           break
//         case 'auth/weak-password':
//           message = 'Password should be at least 6 characters'
//           break
//         default:
//           message = error.message || message
//       }

//       Alert.alert('Reset Failed', message)
//     },
//   })

//   const onSubmit = (data: ResetPasswordFormData) => {
//     resetPasswordMutation.mutate(data.password)
//   }

//   if (!isValidCode) {
//     return (
//       <SafeAreaView className='flex-1 bg-white dark:bg-gray-900'>
//         <StatusBar style='auto' />
//         <View className='flex-1 justify-center items-center px-6'>
//           <Text className='text-lg text-gray-600 dark:text-gray-400 text-center'>
//             Verifying reset link...
//           </Text>
//         </View>
//       </SafeAreaView>
//     )
//   }

//   return (
//     <SafeAreaView className='flex-1 bg-white dark:bg-gray-900'>
//       <StatusBar style='auto' />
//       <ScrollView
//         className='flex-1'
//         contentContainerStyle={{ flexGrow: 1 }}
//         keyboardShouldPersistTaps='handled'
//       >
//         <View className='flex-1 justify-center px-6 py-8'>
//           {/* Header */}
//           <View className='items-center mb-8'>
//             <View className='w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full items-center justify-center mb-4'>
//               <Lock size={32} color='#10B981' />
//             </View>
//             <Text className='text-2xl font-bold text-gray-900 dark:text-white text-center mb-2'>
//               Set New Password
//             </Text>
//             <Text className='text-gray-600 dark:text-gray-400 text-center px-4'>
//               Please enter your new password below.
//             </Text>
//           </View>

//           {/* Form */}
//           <View className='space-y-4 mb-6'>
//             <Controller
//               control={control}
//               name='password'
//               render={({ field: { onChange, onBlur, value } }) => (
//                 <FormField
//                   label='New Password'
//                   placeholder='Enter your new password'
//                   value={value}
//                   onChangeText={onChange}
//                   onBlur={onBlur}
//                   error={errors.password?.message}
//                   secureTextEntry={!showPassword}
//                   rightIcon={
//                     showPassword ? (
//                       <EyeOff size={20} color='#6B7280' />
//                     ) : (
//                       <Eye size={20} color='#6B7280' />
//                     )
//                   }
//                   onRightIconPress={() => setShowPassword(!showPassword)}
//                 />
//               )}
//             />

//             <Controller
//               control={control}
//               name='confirmPassword'
//               render={({ field: { onChange, onBlur, value } }) => (
//                 <FormField
//                   label='Confirm New Password'
//                   placeholder='Confirm your new password'
//                   value={value}
//                   onChangeText={onChange}
//                   onBlur={onBlur}
//                   error={errors.confirmPassword?.message}
//                   secureTextEntry={!showConfirmPassword}
//                   rightIcon={
//                     showConfirmPassword ? (
//                       <EyeOff size={20} color='#6B7280' />
//                     ) : (
//                       <Eye size={20} color='#6B7280' />
//                     )
//                   }
//                   onRightIconPress={() =>
//                     setShowConfirmPassword(!showConfirmPassword)
//                   }
//                 />
//               )}
//             />
//           </View>

//           <Button
//             onPress={handleSubmit(onSubmit)}
//             // loading={resetPasswordMutation.isPending}
//             disabled={!isValid}
//             className='mb-6'
//           >
//             {resetPasswordMutation.isPending
//               ? 'Updating Password...'
//               : 'Update Password'}
//           </Button>

//           <View className='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg'>
//             <Text className='text-sm text-blue-800 dark:text-blue-200 text-center'>
//               Make sure your new password is secure and different from your
//               previous one.
//             </Text>
//           </View>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   )
// }

import React from 'react'
import { Text, View } from 'react-native'

export default function ResetPassword() {
  return (
    <View>
      <Text>Reset Password</Text>
    </View>
  )
}
