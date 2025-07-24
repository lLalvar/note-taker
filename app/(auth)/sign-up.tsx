// import { zodResolver } from '@hookform/resolvers/zod'
// import { Link } from 'expo-router'
// import { StatusBar } from 'expo-status-bar'
// import { Eye, EyeOff, User } from 'lucide-react-native'
// import React, { useEffect, useState } from 'react'
// import { Controller, useForm } from 'react-hook-form'
// import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
// import { SafeAreaView } from 'react-native-safe-area-context'

// import { FormField } from '@/components/ui/FormField'
// import { Button } from '@/components/ui/button'
// import {
//   useGoogleSignInMutation,
//   useSignUpMutation,
// } from '@/hooks/useAuthMutations'
// import { SignUpFormData, signUpSchema } from '@/lib/validationSchemas'
// import { useGoogleAuth } from '@/services/authService'

// export default function SignUpScreen() {
//   const [showPassword, setShowPassword] = useState(false)
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false)
//   const signUpMutation = useSignUpMutation()
//   const googleSignInMutation = useGoogleSignInMutation()
//   const { request, response, promptAsync } = useGoogleAuth()

//   const {
//     control,
//     handleSubmit,
//     formState: { errors, isValid },
//   } = useForm<SignUpFormData>({
//     resolver: zodResolver(signUpSchema),
//     defaultValues: {
//       name: '',
//       email: '',
//       password: '',
//       confirmPassword: '',
//     },
//     mode: 'onChange',
//   })

//   useEffect(() => {
//     if (response?.type === 'success') {
//       const { id_token } = response.params
//       if (id_token) {
//         googleSignInMutation.mutate(id_token)
//       }
//     }
//   }, [response])

//   const onSubmit = (data: SignUpFormData) => {
//     signUpMutation.mutate({
//       name: data.name,
//       email: data.email,
//       password: data.password,
//     })
//   }

//   const handleGoogleSignUp = () => {
//     promptAsync()
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
//           <View className='mb-8'>
//             <Text className='text-3xl font-bold text-gray-900 dark:text-white text-center mb-2'>
//               Create Account
//             </Text>
//             <Text className='text-gray-600 dark:text-gray-400 text-center'>
//               Sign up to get started
//             </Text>
//           </View>

//           {/* Form */}
//           <View className='space-y-4 mb-6'>
//             <Controller
//               control={control}
//               name='name'
//               render={({ field: { onChange, onBlur, value } }) => (
//                 <FormField
//                   label='Full Name'
//                   placeholder='Enter your full name'
//                   value={value}
//                   onChangeText={onChange}
//                   onBlur={onBlur}
//                   error={errors.name?.message}
//                   autoCapitalize='words'
//                   autoComplete='name'
//                   rightIcon={<User size={20} color='#6B7280' />}
//                 />
//               )}
//             />

//             <Controller
//               control={control}
//               name='email'
//               render={({ field: { onChange, onBlur, value } }) => (
//                 <FormField
//                   label='Email'
//                   placeholder='Enter your email'
//                   value={value}
//                   onChangeText={onChange}
//                   onBlur={onBlur}
//                   error={errors.email?.message}
//                   keyboardType='email-address'
//                   autoCapitalize='none'
//                   autoComplete='email'
//                 />
//               )}
//             />

//             <Controller
//               control={control}
//               name='password'
//               render={({ field: { onChange, onBlur, value } }) => (
//                 <FormField
//                   label='Password'
//                   placeholder='Create a password (min 6 characters)'
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
//                   label='Confirm Password'
//                   placeholder='Confirm your password'
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

//           {/* Sign Up Button */}
//           <Button
//             onPress={handleSubmit(onSubmit)}
//             // loading={signUpMutation.isPending}
//             disabled={!isValid}
//             className='mb-4'
//           >
//             {signUpMutation.isPending
//               ? 'Creating Account...'
//               : 'Create Account'}
//           </Button>

//           {/* Divider */}
//           <View className='flex-row items-center mb-4'>
//             <View className='flex-1 h-px bg-gray-300 dark:bg-gray-600' />
//             <Text className='mx-4 text-gray-500 dark:text-gray-400'>or</Text>
//             <View className='flex-1 h-px bg-gray-300 dark:bg-gray-600' />
//           </View>

//           {/* Google Sign Up */}
//           <Button
//             variant='outline'
//             onPress={handleGoogleSignUp}
//             // loading={googleSignInMutation.isPending}
//             disabled={!request}
//             className='mb-6'
//           >
//             Continue with Google
//           </Button>

//           {/* Sign In Link */}
//           <View className='flex-row justify-center'>
//             <Text className='text-gray-600 dark:text-gray-400'>
//               Already have an account?{' '}
//             </Text>
//             <Link href='/sign-in' asChild>
//               <TouchableOpacity>
//                 <Text className='text-blue-600 font-medium'>Sign In</Text>
//               </TouchableOpacity>
//             </Link>
//           </View>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   )
// }

import React from 'react'
import { Text, View } from 'react-native'

export default function SignUp() {
  return (
    <View>
      <Text>Sign Up</Text>
    </View>
  )
}
