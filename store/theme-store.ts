import { type MMKV, createMMKV } from 'react-native-mmkv'
import { create } from 'zustand'

import {
  type ThemeCategory,
  getDefaultThemeId,
  isValidThemeId as isValidRegistryThemeId,
} from '@/lib/theme-registry'

export type ThemeId = string // Theme ID like 'light-1', 'dark-1', 'system'

interface ThemeState {
  theme: ThemeId
  setTheme: (theme: ThemeId) => void
  initialize: () => void
  getCategory: () => ThemeCategory | null
}

// Lazy initialization of MMKV storage
let storageInstance: MMKV | null = null

function getStorage(): MMKV {
  try {
    if (!storageInstance) {
      storageInstance = createMMKV({ id: 'theme' })
    }
    return storageInstance
  } catch (error) {
    console.error('Failed to initialize MMKV storage:', error)
    throw error
  }
}

// Safe storage access that returns null if storage is unavailable
function safeGetStorage(): MMKV | null {
  try {
    return getStorage()
  } catch {
    return null
  }
}

const STORAGE_KEY = 'app_theme'

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'light-1',
  setTheme: (theme: ThemeId) => {
    try {
      // Validate theme ID
      if (isValidRegistryThemeId(theme)) {
        const storage = safeGetStorage()
        if (storage) {
          storage.set(STORAGE_KEY, theme)
        }
        set({ theme })
      } else {
        console.warn(`Invalid theme ID: ${theme}. Falling back to light-1.`)
        set({ theme: 'light-1' })
      }
    } catch (error) {
      console.error('Error saving theme:', error)
    }
  },
  initialize: () => {
    try {
      const storage = safeGetStorage()
      if (storage) {
        const savedTheme = storage.getString(STORAGE_KEY)
        if (savedTheme) {
          // Migrate old theme format ('light'/'dark'/'system') to new format ('light-1'/'dark-1')
          if (savedTheme === 'light' || savedTheme === 'system') {
            const defaultLight = getDefaultThemeId('light')
            set({ theme: defaultLight })
            storage.set(STORAGE_KEY, defaultLight)
            return
          }
          if (savedTheme === 'dark') {
            const defaultDark = getDefaultThemeId('dark')
            set({ theme: defaultDark })
            storage.set(STORAGE_KEY, defaultDark)
            return
          }

          // Validate new format
          if (isValidRegistryThemeId(savedTheme)) {
            set({ theme: savedTheme })
            return
          }
        }
      }
      // Default to light-1
      set({ theme: 'light-1' })
    } catch (error) {
      console.error('Error loading theme:', error)
      set({ theme: 'light-1' })
    }
  },
  getCategory: () => {
    const theme = get().theme
    if (theme.startsWith('hot-')) {
      return 'hot'
    }
    if (theme.startsWith('light-')) {
      return 'light'
    }
    if (theme.startsWith('dark-')) {
      return 'dark'
    }
    return null
  },
}))
