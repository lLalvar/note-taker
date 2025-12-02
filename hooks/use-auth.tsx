import { useEffect } from 'react'

import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth'

import { useAuthStore } from '@/store/auth-store'

export function useAuth() {
  const user = useAuthStore((state) => state.user)
  const initializing = useAuthStore((state) => state.initializing)
  const setUser = useAuthStore((state) => state.setUser)
  const setInitializing = useAuthStore((state) => state.setInitializing)

  useEffect(() => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setInitializing(false)
    })

    return unsubscribe
  }, [setUser, setInitializing])

  return {
    user,
    initializing,
    isAuthenticated: !!user,
  }
}
