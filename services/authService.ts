import { auth } from '@/lib/firebase'
import * as Google from 'expo-auth-session/providers/google'
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth'

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
    return userCredential.user
  }

  static async forgotPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email)
  }

  static async signOut(): Promise<void> {
    await signOut(auth)
  }

  static async signInWithGoogle(idToken: string): Promise<User> {
    const credential = GoogleAuthProvider.credential(idToken)
    const userCredential = await signInWithCredential(auth, credential)
    return userCredential.user
  }
}

// Google Auth Hook
export function useGoogleAuth() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: 'your-expo-client-id',
    iosClientId: 'your-ios-client-id',
    androidClientId: 'your-android-client-id',
    webClientId: 'your-web-client-id',
  })

  return {
    request,
    response,
    promptAsync,
  }
}
