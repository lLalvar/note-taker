import React, { useEffect } from 'react'

import { useRouter, useSegments } from 'expo-router'
import { AppState, type AppStateStatus } from 'react-native'

import { useAuth } from '@/hooks/use-auth'
import { hasLockEnabled } from '@/services/diary-lock-service'
import { useDiaryLockStore } from '@/store/diary-lock-store'

export function DiaryLockGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const segments = useSegments()
  const { isAuthenticated } = useAuth()
  const { isLocked, hasLock, initialize, setLocked, checkAutoLock } =
    useDiaryLockStore()

  // Initialize lock store
  useEffect(() => {
    initialize()
  }, [initialize])

  // Check if we should show lock screen (only for authenticated users)
  useEffect(() => {
    if (!isAuthenticated) {
      return
    }

    if (!hasLockEnabled() || !hasLock) {
      return
    }

    // Check if we're already on the lock screen
    const isOnLockScreen = segments.some((seg) => seg === 'diary-lock')

    // If locked and not on lock screen, navigate to lock screen
    if (isLocked && !isOnLockScreen) {
      router.replace('/(auth)/diary-lock')
    }
    // If not locked and on lock screen, navigate to tabs
    else if (!isLocked && isOnLockScreen) {
      router.replace('/(tabs)')
    }
  }, [isLocked, hasLock, segments, router, isAuthenticated])

  // Handle app state changes for auto-lock
  useEffect(() => {
    if (!isAuthenticated) {
      return
    }

    const subscription = AppState.addEventListener(
      'change',
      (nextAppState: AppStateStatus) => {
        if (!hasLockEnabled() || !hasLock) {
          return
        }

        // When app goes to background, we'll check timeout when it comes back
        if (nextAppState === 'active') {
          // Check if we should auto-lock
          const shouldLock = checkAutoLock()
          if (shouldLock) {
            setLocked(true)
          }
        }
      }
    )

    return () => {
      subscription.remove()
    }
  }, [hasLock, checkAutoLock, setLocked, isAuthenticated])

  // Check auto-lock on mount
  useEffect(() => {
    if (!isAuthenticated) {
      return
    }

    if (!hasLockEnabled() || !hasLock) {
      return
    }

    const shouldLock = checkAutoLock()
    if (shouldLock) {
      setLocked(true)
    }
  }, [hasLock, checkAutoLock, setLocked, isAuthenticated])

  return <>{children}</>
}
