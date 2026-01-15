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
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Toaster } from 'sonner-native'
import '~/global.css'

import { SignOutButton } from '@/components/ui/SignOutButton'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { LanguagePicker } from '@/components/ui/language-picker'
import { useAuth } from '@/hooks/use-auth'
import { useTheme } from '@/hooks/use-theme'
import { i18n, useI18n } from '@/lib/i18n'
import { queryClient } from '@/lib/query-client'
import Sentry from '@/lib/sentry'

if (__DEV__) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('~/lib/reactotron')
}

const TransText = ({ translation }: TransRenderProps) => {
  return <RNText>{translation}</RNText>
}

export { ErrorBoundary } from 'expo-router'

export default Sentry.wrap(function RootLayout() {
  const { navTheme, isDark, cssVariables } = useTheme()
  const { initializing, isAuthenticated } = useAuth()

  useI18n()

  if (initializing) {
    return (
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <QueryClientProvider client={queryClient}>
            <I18nProvider i18n={i18n} defaultComponent={TransText}>
              <View
                className='flex-1 items-center justify-center bg-background'
                style={cssVariables}
              >
                <ActivityIndicator />
              </View>
            </I18nProvider>
          </QueryClientProvider>
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
              {/* <View style={[{ flex: 1 }]}> */}
              <View style={[{ flex: 1 }, cssVariables]}>
                <ThemeProvider value={navTheme}>
                  {/* <DiaryLockGuard> */}
                  <Stack>
                    <Stack.Protected guard={isAuthenticated}>
                      <Stack.Screen
                        name='(app)'
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
                  {/* </DiaryLockGuard> */}
                  <View className='absolute bottom-20 end-4 flex-row gap-2 rounded-full bg-muted/80'>
                    {isAuthenticated && <SignOutButton />}
                    <ThemeToggle />
                    <LanguagePicker asIcon />
                  </View>
                  <StatusBar style={isDark ? 'light' : 'dark'} />
                  <PortalHost />
                  <Toaster />
                </ThemeProvider>
              </View>
            </I18nProvider>
          </QueryClientProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  )
})
