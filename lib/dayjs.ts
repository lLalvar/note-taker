import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { getLocales } from 'expo-localization'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(localizedFormat)

export const getUserLocale = (): string => {
  try {
    const locales = getLocales()
    if (locales && locales.length > 0) {
      return locales[0].languageTag || 'en-US'
    }
  } catch (error) {
    console.error('Error getting locale:', error)
  }
  return 'en-US'
}

dayjs.locale(getUserLocale())

export default dayjs
