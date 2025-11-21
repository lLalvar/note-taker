import type { User } from 'firebase/auth'
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithCredential,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'

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

  static async signInWithGoogle(idToken: string): Promise<User> {
    const googleCredential = GoogleAuthProvider.credential(idToken)
    const userCredential = await signInWithCredential(auth, googleCredential)
    return userCredential.user
  }
}
