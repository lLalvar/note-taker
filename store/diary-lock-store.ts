import { type MMKV, createMMKV } from 'react-native-mmkv'
import { create } from 'zustand'

type LockType = 'password' | 'pin' | 'none'

interface DiaryLockState {
  isLocked: boolean
  hasLock: boolean
  lockType: LockType
  biometricEnabled: boolean
  lastUnlockTime: number | null
  lockTimeout: number // in milliseconds
  setLocked: (locked: boolean) => void
  setHasLock: (hasLock: boolean) => void
  setLockType: (type: LockType) => void
  setBiometricEnabled: (enabled: boolean) => void
  setLastUnlockTime: (time: number | null) => void
  setLockTimeout: (timeout: number) => void
  initialize: () => Promise<void>
  checkAutoLock: () => boolean
}

// Lazy initialization of MMKV storage to avoid initialization errors
let storageInstance: MMKV | null = null
let initializationError: Error | null = null

function getStorage(): MMKV {
  if (initializationError) {
    throw initializationError
  }

  if (!storageInstance) {
    try {
      storageInstance = createMMKV({ id: 'diary-lock' })
    } catch (error) {
      initializationError = error as Error
      console.error('Failed to initialize MMKV storage:', error)
      throw error
    }
  }
  return storageInstance
}

// Safe storage access that returns null if storage is unavailable
function safeGetStorage(): MMKV | null {
  try {
    return getStorage()
  } catch {
    return null
  }
}

const STORAGE_KEYS = {
  HAS_LOCK: 'hasLock',
  LOCK_TYPE: 'lockType',
  BIOMETRIC_ENABLED: 'biometricEnabled',
  LAST_UNLOCK_TIME: 'lastUnlockTime',
  LOCK_TIMEOUT: 'lockTimeout',
} as const

const DEFAULT_LOCK_TIMEOUT = 5 * 60 * 1000 // 5 minutes

export const useDiaryLockStore = create<DiaryLockState>((set, get) => ({
  isLocked: false,
  hasLock: false,
  lockType: 'none',
  biometricEnabled: false,
  lastUnlockTime: null,
  lockTimeout: DEFAULT_LOCK_TIMEOUT,

  setLocked: (locked: boolean) => {
    set({ isLocked: locked })
    if (!locked) {
      // Update last unlock time when unlocked
      const now = Date.now()
      set({ lastUnlockTime: now })
      const storage = safeGetStorage()
      if (storage) {
        try {
          storage.set(STORAGE_KEYS.LAST_UNLOCK_TIME, now)
        } catch (error) {
          console.error('Error saving last unlock time:', error)
        }
      }
    }
  },

  setHasLock: (hasLock: boolean) => {
    set({ hasLock })
    const storage = safeGetStorage()
    if (storage) {
      try {
        storage.set(STORAGE_KEYS.HAS_LOCK, hasLock)
      } catch (error) {
        console.error('Error saving hasLock:', error)
      }
    }
  },

  setLockType: (type: LockType) => {
    set({ lockType: type })
    const storage = safeGetStorage()
    if (storage) {
      try {
        storage.set(STORAGE_KEYS.LOCK_TYPE, type)
      } catch (error) {
        console.error('Error saving lockType:', error)
      }
    }
  },

  setBiometricEnabled: (enabled: boolean) => {
    set({ biometricEnabled: enabled })
    const storage = safeGetStorage()
    if (storage) {
      try {
        storage.set(STORAGE_KEYS.BIOMETRIC_ENABLED, enabled)
      } catch (error) {
        console.error('Error saving biometricEnabled:', error)
      }
    }
  },

  setLastUnlockTime: (time: number | null) => {
    set({ lastUnlockTime: time })
    const storage = safeGetStorage()
    if (storage) {
      try {
        if (time !== null) {
          storage.set(STORAGE_KEYS.LAST_UNLOCK_TIME, time)
        } else {
          storage.remove(STORAGE_KEYS.LAST_UNLOCK_TIME)
        }
      } catch (error) {
        console.error('Error saving lastUnlockTime:', error)
      }
    }
  },

  setLockTimeout: (timeout: number) => {
    set({ lockTimeout: timeout })
    const storage = safeGetStorage()
    if (storage) {
      try {
        storage.set(STORAGE_KEYS.LOCK_TIMEOUT, timeout)
      } catch (error) {
        console.error('Error saving lockTimeout:', error)
      }
    }
  },

  initialize: async () => {
    try {
      const storage = safeGetStorage()
      if (!storage) {
        // Storage not available, use defaults
        set({
          hasLock: false,
          lockType: 'none',
          biometricEnabled: false,
          lastUnlockTime: null,
          lockTimeout: DEFAULT_LOCK_TIMEOUT,
          isLocked: false,
        })
        return
      }

      const hasLock = storage.getBoolean(STORAGE_KEYS.HAS_LOCK) ?? false
      const lockType =
        (storage.getString(STORAGE_KEYS.LOCK_TYPE) as LockType) ?? 'none'
      const biometricEnabled =
        storage.getBoolean(STORAGE_KEYS.BIOMETRIC_ENABLED) ?? false
      const lastUnlockTime =
        storage.getNumber(STORAGE_KEYS.LAST_UNLOCK_TIME) ?? null
      const lockTimeout =
        storage.getNumber(STORAGE_KEYS.LOCK_TIMEOUT) ?? DEFAULT_LOCK_TIMEOUT

      set({
        hasLock,
        lockType,
        biometricEnabled,
        lastUnlockTime,
        lockTimeout,
        // Lock the app if lock is enabled and timeout has passed
        isLocked: hasLock && get().checkAutoLock(),
      })
    } catch (error) {
      console.error('Error initializing diary lock store:', error)
    }
  },

  checkAutoLock: () => {
    const state = get()
    if (!state.hasLock || state.lockType === 'none') {
      return false
    }

    if (state.lastUnlockTime === null) {
      return true // Never unlocked, should be locked
    }

    const timeSinceUnlock = Date.now() - state.lastUnlockTime
    return timeSinceUnlock >= state.lockTimeout
  },
}))
