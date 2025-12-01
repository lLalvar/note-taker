import AsyncStorage from '@react-native-async-storage/async-storage'
import { getLocales } from 'expo-localization'
import { create } from 'zustand'

export type Locale = 'en' | 'ru'

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
        return
      }

      const [primary] = getLocales()
      const deviceLanguageCode = primary?.languageCode

      if (deviceLanguageCode === 'en' || deviceLanguageCode === 'ru') {
        set({ locale: deviceLanguageCode })
      }
    } catch (error) {
      console.error('Error loading locale:', error)
    }
  },
}))
