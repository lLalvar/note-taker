import AsyncStorage from '@react-native-async-storage/async-storage'
import type { User } from 'firebase/auth'
import { onAuthStateChanged } from 'firebase/auth'
import { create } from 'zustand'

import { auth } from '@/lib/firebase'

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  isInitialized: boolean

  // Actions
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  initialize: () => () => void // Returns unsubscribe function
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  isInitialized: false,

  setUser: (user: User | null) => {
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    })
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading })
  },

  initialize: () => {
    const { isInitialized } = get()

    if (isInitialized) {
      // Return a no-op unsubscribe function if already initialized
      return () => {}
    }

    set({ isInitialized: true })

    // Set up Firebase auth state listener
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in
        try {
          const token = await user.getIdToken()
          await AsyncStorage.setItem('userToken', token)
          await AsyncStorage.setItem(
            'userData',
            JSON.stringify({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
            })
          )

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          console.error('Error storing user data:', error)
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          })
        }
      } else {
        // User is signed out
        try {
          await AsyncStorage.removeItem('userToken')
          await AsyncStorage.removeItem('userData')
        } catch (error) {
          console.error('Error removing user data:', error)
        }

        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        })
      }
    })

    return unsubscribe
  },

  signOut: async () => {
    try {
      set({ isLoading: true })
      await auth.signOut()
      // The onAuthStateChanged listener will handle the state update
    } catch (error) {
      console.error('Error signing out:', error)
      set({ isLoading: false })
      throw error
    }
  },
}))

// Initialize auth store immediately when imported
// This ensures auth state is ready before Stack.Protected evaluates
let isAutoInitialized = false
export const initializeAuth = () => {
  if (!isAutoInitialized) {
    useAuthStore.getState().initialize()
    isAutoInitialized = true
  }
}

// Auto-initialize on import
initializeAuth()
