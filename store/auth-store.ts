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

  onAuthStateChanged(auth, (firebaseUser) => {
    set({ user: firebaseUser, initializing: false })
  })

  return {
    user: null,
    initializing: true,
    setUser: (user) => set({ user }),
    setInitializing: (initializing) => set({ initializing }),
  }
})
