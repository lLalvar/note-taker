import Constants from 'expo-constants'
import { Platform, Share } from 'react-native'

const APP_NAME = Constants.expoConfig?.name || 'DailyMood Journal'

interface ShareAppOptions {
  iosLink?: string
  androidLink?: string
  customMessage?: string
}

export function useShareApp() {
  const shareApp = async (options?: ShareAppOptions) => {
    try {
      const { iosLink, androidLink, customMessage } = options || {}

      let shareMessage: string

      if (customMessage) {
        shareMessage = customMessage
      } else if (iosLink || androidLink) {
        // Use platform-specific link if available
        const link = Platform.OS === 'ios' ? iosLink : androidLink
        shareMessage = link
          ? `${APP_NAME}\n\n${link}`
          : `${APP_NAME}\n\nA beautiful journaling app to track your daily mood and thoughts.\n\nCheck it out!`
      } else {
        // Default message
        shareMessage = `${APP_NAME}\n\nA beautiful journaling app to track your daily mood and thoughts.\n\nCheck it out!`
      }

      const result = await Share.share({
        message: shareMessage,
        title: `Share ${APP_NAME}`,
      })

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared with activity type of result.activityType
          console.log('Shared with activity type:', result.activityType)
        } else {
          // Shared
          console.log('App shared successfully')
        }
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
        console.log('Share dismissed')
      }
    } catch (error) {
      console.error('Error sharing app:', error)
      throw error
    }
  }

  return {
    shareApp,
    appName: APP_NAME,
  }
}
