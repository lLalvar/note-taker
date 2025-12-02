import React from 'react'

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { I18nProvider, type TransRenderProps } from '@lingui/react'
import { ThemeProvider } from '@react-navigation/native'
import { PortalHost } from '@rn-primitives/portal'
import { QueryClientProvider } from '@tanstack/react-query'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useColorScheme } from 'nativewind'
import { ActivityIndicator, Text as RNText, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import 'react-native-reanimated'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import '~/global.css'

import { LanguageSelector } from '@/components/ui/LanguageSelector'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useAuth } from '@/hooks/use-auth'
import { i18n, useI18n } from '@/lib/i18n'
import { queryClient } from '@/lib/query-client'
import Sentry from '@/lib/sentry'
import { NAV_THEME } from '@/lib/theme'

// Wrapper component for Trans defaultComponent
const TransText = ({ translation }: TransRenderProps) => {
  return <RNText>{translation}</RNText>
}

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router'

// export default function RootLayout() {
export default Sentry.wrap(function RootLayout() {
  const { colorScheme } = useColorScheme()
  const { initializing, isAuthenticated } = useAuth()

  useI18n()

  if (initializing) {
    return (
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <View className='flex-1 items-center justify-center bg-background'>
            <ActivityIndicator />
          </View>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    )
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <QueryClientProvider client={queryClient}>
            <I18nProvider i18n={i18n} defaultComponent={TransText}>
              <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
                <Stack>
                  <Stack.Protected guard={isAuthenticated}>
                    <Stack.Screen
                      name='(tabs)'
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen name='+not-found' />
                  </Stack.Protected>

                  <Stack.Protected guard={!isAuthenticated}>
                    <Stack.Screen
                      name='(auth)'
                      options={{ headerShown: false }}
                    />
                  </Stack.Protected>
                </Stack>
                <View className='absolute bottom-4 end-4 flex-row gap-2'>
                  <LanguageSelector />
                  <ThemeToggle />
                </View>
                <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
                <PortalHost />
              </ThemeProvider>
            </I18nProvider>
          </QueryClientProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  )
})
