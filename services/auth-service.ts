import type { User } from 'firebase/auth'
import {
  GoogleAuthProvider,
  OAuthProvider,
  createUserWithEmailAndPassword,
  getRedirectResult,
  sendPasswordResetEmail,
  signInWithCredential,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth'
import { Platform } from 'react-native'

import { auth } from '@/lib/firebase'

export interface AuthCredentials {
  email: string
  password: string
}

export interface SignUpData extends AuthCredentials {
  name?: string
}

export class AuthService {
  static async signIn(credentials: AuthCredentials): Promise<User> {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    )
    return userCredential.user
  }

  static async signUp(data: SignUpData): Promise<User> {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    )

    // Update display name if provided
    if (data.name && userCredential.user) {
      await updateProfile(userCredential.user, {
        displayName: data.name,
      })
    }

    return userCredential.user
  }

  static async forgotPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email)
  }

  static async signOut(): Promise<void> {
    await auth.signOut()
  }

  /**
   * Sign in with Google using Firebase Web SDK
   * For web: uses signInWithPopup (Firebase Web SDK)
   * For native: uses signInWithCredential with ID token from OAuth flow (Firebase Web SDK)
   */
  static async signInWithGoogle(idToken?: string): Promise<User> {
    if (Platform.OS === 'web') {
      // Use Firebase Web SDK's signInWithPopup for web
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      return result.user
    }

    // For native platforms, use Firebase Web SDK's signInWithCredential
    // The ID token comes from expo-auth-session OAuth flow
    if (!idToken) {
      throw new Error('ID token is required for native Google sign-in')
    }

    const googleCredential = GoogleAuthProvider.credential(idToken)
    const userCredential = await signInWithCredential(auth, googleCredential)
    return userCredential.user
  }

  /**
   * Handle Google redirect result (for web)
   * Call this after redirect flow completes
   */
  static async handleGoogleRedirect(): Promise<User | null> {
    if (Platform.OS !== 'web') {
      return null
    }

    const result = await getRedirectResult(auth)
    if (result) {
      return result.user
    }
    return null
  }

  static async signInWithApple(
    idToken: string,
    rawNonce?: string
  ): Promise<User> {
    const provider = new OAuthProvider('apple.com')
    const credential = provider.credential({
      idToken,
      rawNonce,
    })
    const userCredential = await signInWithCredential(auth, credential)
    return userCredential.user
  }
}
