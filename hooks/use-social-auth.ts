import { useMutation } from '@tanstack/react-query'
import { router } from 'expo-router'
import { Alert, Platform } from 'react-native'

import { AuthService } from '@/services/auth-service'
import { SocialAuthService } from '@/services/social-auth-service'

/**
 * Hook for Google sign-in mutation
 * Uses Firebase Web SDK for all platforms
 * For web: uses signInWithPopup
 * For native: uses signInWithCredential with ID token from OAuth flow
 */
export function useGoogleSignIn() {
  return useMutation({
    mutationFn: async () => {
      // Get Google credentials (null for web means Firebase Web SDK handles it)
      const googleResult = await SocialAuthService.signInWithGoogle()

      if (googleResult === null) {
        // Web: Firebase Web SDK handles OAuth automatically via signInWithPopup
        return await AuthService.signInWithGoogle()
      } else {
        // Native: Use the ID token from OAuth flow, then Firebase Web SDK authenticates
        return await AuthService.signInWithGoogle(googleResult.idToken)
      }
    },
    onSuccess: () => {
      // Firebase auth state listener will handle the state update
      router.replace('/(tabs)')
    },
    onError: (error: any) => {
      let message = 'An error occurred during Google sign-in'

      if (error.message) {
        message = error.message
      } else if (error.code) {
        switch (error.code) {
          case 'auth/account-exists-with-different-credential':
            message =
              'An account already exists with the same email address but different sign-in credentials'
            break
          case 'auth/invalid-credential':
            message = 'Invalid Google credentials'
            break
          case 'auth/operation-not-allowed':
            message = 'Google sign-in is not enabled'
            break
          case 'auth/user-disabled':
            message = 'This account has been disabled'
            break
          default:
            message = error.message || message
        }
      }

      Alert.alert('Google Sign-In Failed', message)
    },
  })
}

/**
 * Hook for Apple sign-in mutation
 * NOTE: Currently disabled - keeping code for future use
 */
export function useAppleSignIn() {
  return useMutation({
    mutationFn: async () => {
      if (Platform.OS !== 'ios') {
        throw new Error('Apple Sign-In is only available on iOS')
      }

      // Get Apple credentials
      const appleResult = await SocialAuthService.signInWithApple()

      // Sign in to Firebase with Apple credentials
      return await AuthService.signInWithApple(
        appleResult.idToken,
        appleResult.rawNonce
      )
    },
    onSuccess: () => {
      // Firebase auth state listener will handle the state update
      router.replace('/(tabs)')
    },
    onError: (error: any) => {
      let message = 'An error occurred during Apple sign-in'

      if (error.message) {
        // Handle cancellation gracefully
        if (
          error.message.includes('cancelled') ||
          error.message.includes('canceled')
        ) {
          return // Don't show error for user cancellation
        }
        message = error.message
      } else if (error.code) {
        switch (error.code) {
          case 'auth/account-exists-with-different-credential':
            message =
              'An account already exists with the same email address but different sign-in credentials'
            break
          case 'auth/invalid-credential':
            message = 'Invalid Apple credentials'
            break
          case 'auth/operation-not-allowed':
            message = 'Apple sign-in is not enabled'
            break
          case 'auth/user-disabled':
            message = 'This account has been disabled'
            break
          default:
            message = error.message || message
        }
      }

      Alert.alert('Apple Sign-In Failed', message)
    },
  })
}

/**
 * Hook to check if Apple Sign-In is available
 */
export function useAppleSignInAvailable() {
  return useMutation({
    mutationFn: () => SocialAuthService.isAppleSignInAvailable(),
  })
}
