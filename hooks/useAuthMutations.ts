import {
  AuthCredentials,
  AuthService,
  SignUpData,
} from '@/services/authService'
import { useAuthStore } from '@/store/authStore'
import { useMutation } from '@tanstack/react-query'
import { router } from 'expo-router'
import { Alert } from 'react-native'

export function useSignInMutation() {
  return useMutation({
    mutationFn: (credentials: AuthCredentials) =>
      AuthService.signIn(credentials),
    onSuccess: () => {
      // Firebase auth state listener will handle the state update
      router.replace('/(tabs)')
    },
    onError: (error: any) => {
      let message = 'An error occurred during sign in'

      switch (error.code) {
        case 'auth/user-not-found':
          message = 'No account found with this email address'
          break
        case 'auth/wrong-password':
          message = 'Incorrect password'
          break
        case 'auth/invalid-email':
          message = 'Invalid email address'
          break
        case 'auth/too-many-requests':
          message = 'Too many failed attempts. Please try again later'
          break
        default:
          message = error.message || message
      }

      Alert.alert('Sign In Failed', message)
    },
  })
}

export function useSignUpMutation() {
  return useMutation({
    mutationFn: (data: SignUpData) => AuthService.signUp(data),
    onSuccess: () => {
      Alert.alert('Success', 'Account created successfully!')
      router.replace('/(tabs)')
    },
    onError: (error: any) => {
      let message = 'An error occurred during sign up'

      switch (error.code) {
        case 'auth/email-already-in-use':
          message = 'An account with this email already exists'
          break
        case 'auth/invalid-email':
          message = 'Invalid email address'
          break
        case 'auth/weak-password':
          message = 'Password should be at least 6 characters'
          break
        default:
          message = error.message || message
      }

      Alert.alert('Sign Up Failed', message)
    },
  })
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: (email: string) => AuthService.forgotPassword(email),
    onSuccess: () => {
      Alert.alert(
        'Password Reset Email Sent',
        'Please check your email for password reset instructions'
      )
      router.back()
    },
    onError: (error: any) => {
      let message = 'Failed to send reset email'

      switch (error.code) {
        case 'auth/user-not-found':
          message = 'No account found with this email address'
          break
        case 'auth/invalid-email':
          message = 'Invalid email address'
          break
        default:
          message = error.message || message
      }

      Alert.alert('Reset Failed', message)
    },
  })
}

export function useSignOutMutation() {
  const signOut = useAuthStore((state) => state.signOut)

  return useMutation({
    mutationFn: () => signOut(),
    onSuccess: () => {
      router.replace('/sign-in')
    },
    onError: (error: any) => {
      Alert.alert('Sign Out Failed', error.message || 'An error occurred')
    },
  })
}

export function useGoogleSignInMutation() {
  return useMutation({
    mutationFn: (idToken: string) => AuthService.signInWithGoogle(idToken),
    onSuccess: () => {
      router.replace('/(tabs)')
    },
    onError: (error: any) => {
      Alert.alert('Google Sign In Failed', error.message || 'An error occurred')
    },
  })
}
