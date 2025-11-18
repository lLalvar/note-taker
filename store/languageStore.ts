import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'

type Locale = 'en' | 'ru'

interface LanguageState {
  locale: Locale
  setLocale: (locale: Locale) => Promise<void>
  initialize: () => Promise<void>
}

const STORAGE_KEY = 'app_locale'

export const useLanguageStore = create<LanguageState>((set) => ({
  locale: 'en',
  setLocale: async (locale: Locale) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, locale)
      set({ locale })
    } catch (error) {
      console.error('Error saving locale:', error)
    }
  },
  initialize: async () => {
    try {
      const savedLocale = await AsyncStorage.getItem(STORAGE_KEY)
      if (savedLocale && (savedLocale === 'en' || savedLocale === 'ru')) {
        set({ locale: savedLocale as Locale })
      }
    } catch (error) {
      console.error('Error loading locale:', error)
    }
  },
}))
