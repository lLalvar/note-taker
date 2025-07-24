import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import 'react-native-reanimated'
import '~/global.css'

// import { AuthInitializer } from '@/components/AuthInitializer'
import { NAV_THEME } from '@/lib/constants'
import { queryClient } from '@/lib/queryClient'
import { useColorScheme } from '@/lib/useColorScheme'
// import { useAuthStore } from '@/store/authStore'
import { QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Platform } from 'react-native'

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
}
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
}

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router'

const useIsomorphicLayoutEffect =
  Platform.OS === 'web' && typeof window === 'undefined'
    ? useEffect
    : useLayoutEffect

export default function RootLayout() {
  const hasMounted = useRef(false)
  // TODO: Replace with actual auth state
  // const { isAuthenticated, isLoading } = useAuthStore()
  const isAuthenticated = true // Temporary: set to true to test protected routes
  const isLoading = false // Temporary: set to false since we're not using real auth

  const { isDarkColorScheme } = useColorScheme()
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = useState(false)
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  })

  useIsomorphicLayoutEffect(() => {
    if (hasMounted.current) {
      return
    }

    if (Platform.OS === 'web') {
      // Adds the background color to the html element to prevent white background on overscroll.
      document.documentElement.classList.add('bg-background')
    }
    setIsColorSchemeLoaded(true)
    hasMounted.current = true
  }, [])

  if (!isColorSchemeLoaded || !loaded || isLoading) {
    return null
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
        <Stack>
          {/* Protected Routes - only accessible when authenticated */}
          <Stack.Protected guard={!isAuthenticated}>
            <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
            <Stack.Screen name='+not-found' />
          </Stack.Protected>

          {/* Public/Auth Routes - only accessible when not authenticated */}
          <Stack.Protected guard={isAuthenticated}>
            <Stack.Screen name='(auth)' options={{ headerShown: false }} />
          </Stack.Protected>
        </Stack>
        <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
      </ThemeProvider>
    </QueryClientProvider>
  )
}
