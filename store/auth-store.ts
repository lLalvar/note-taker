import {
  type FirebaseAuthTypes,
  getAuth,
  onAuthStateChanged,
} from '@react-native-firebase/auth'
import { create } from 'zustand'

type AuthUser = FirebaseAuthTypes.User | null

type AuthState = {
  user: AuthUser
  initializing: boolean
  setUser: (user: AuthUser) => void
  setInitializing: (initializing: boolean) => void
}

export const useAuthStore = create<AuthState>((set) => {
  const auth = getAuth()

  onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      try {
        // Reload user to get latest emailVerified status
        await firebaseUser.reload()

        // Verify user is still signed in after reload
        const currentUser = auth.currentUser
        if (!currentUser || currentUser.uid !== firebaseUser.uid) {
          // User was signed out during reload
          set({ user: null, initializing: false })
          return
        }

        // Check if email is verified for email/password users
        // if (
        //   firebaseUser.providerData.some(
        //     (provider) => provider.providerId === 'password'
        //   ) &&
        //   !firebaseUser.emailVerified
        // ) {
        //   // Sign out unverified email/password users
        //   await signOut(auth)
        //   set({ user: null, initializing: false })
        //   return
        // }
      } catch (error: unknown) {
        // Handle errors during reload (e.g., user signed out)
        if (
          error &&
          typeof error === 'object' &&
          'code' in error &&
          error.code === 'auth/no-current-user'
        ) {
          set({ user: null, initializing: false })
          return
        }
        console.warn('Error reloading user:', error)
      }
    }

    set({ user: firebaseUser, initializing: false })
  })

  return {
    user: null,
    initializing: true,
    setUser: (user) => set({ user }),
    setInitializing: (initializing) => set({ initializing }),
  }
})
