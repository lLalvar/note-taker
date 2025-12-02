import React from 'react'

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { I18nProvider, type TransRenderProps } from '@lingui/react'
import { ThemeProvider } from '@react-navigation/native'
import { PortalHost } from '@rn-primitives/portal'
import { QueryClientProvider } from '@tanstack/react-query'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { ActivityIndicator, Text as RNText, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import 'react-native-reanimated'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import '~/global.css'

import { LanguageSelector } from '@/components/ui/LanguageSelector'
import { SignOutButton } from '@/components/ui/SignOutButton'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useAuth } from '@/hooks/use-auth'
import { useTheme } from '@/hooks/use-theme'
import { i18n, useI18n } from '@/lib/i18n'
import { queryClient } from '@/lib/query-client'
import Sentry from '@/lib/sentry'

// Wrapper component for Trans defaultComponent
const TransText = ({ translation }: TransRenderProps) => {
  return <RNText>{translation}</RNText>
}

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router'

export default Sentry.wrap(function RootLayout() {
  const { navTheme, isDark } = useTheme()
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
              <ThemeProvider value={navTheme}>
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
                <View className='absolute bottom-20 end-4 flex-row gap-2 rounded-full bg-muted/80'>
                  {isAuthenticated && <SignOutButton />}
                  <ThemeToggle />
                  <LanguageSelector />
                </View>
                <StatusBar style={isDark ? 'light' : 'dark'} />
                <PortalHost />
              </ThemeProvider>
            </I18nProvider>
          </QueryClientProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  )
})
