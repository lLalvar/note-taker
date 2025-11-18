import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { I18nProvider, type TransRenderProps } from '@lingui/react'
import { ThemeProvider } from '@react-navigation/native'
import { PortalHost } from '@rn-primitives/portal'
import { QueryClientProvider } from '@tanstack/react-query'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useColorScheme } from 'nativewind'
import { Text as RNText, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import 'react-native-reanimated'
import '~/global.css'

import { LanguageSelector } from '@/components/ui/LanguageSelector'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { i18n, useI18n } from '@/lib/i18n'
import { queryClient } from '@/lib/queryClient'
import { NAV_THEME } from '@/lib/theme'

// Wrapper component for Trans defaultComponent
const TransText = ({ translation }: TransRenderProps) => {
  return <RNText>{translation}</RNText>
}

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router'

// const useIsomorphicLayoutEffect =
//   Platform.OS === 'web' && typeof window === 'undefined'
//     ? useEffect
//     : useLayoutEffect

export default function RootLayout() {
  const { colorScheme } = useColorScheme()
  useI18n()
  // const hasMounted = useRef(false)
  // TODO: Replace with actual auth state
  // const { isAuthenticated, isLoading } = useAuthStore()
  const isAuthenticated = false // Temporary: set to true to test protected routes
  // const isLoading = false // Temporary: set to false since we're not using real auth

  // const [isColorSchemeLoaded, setIsColorSchemeLoaded] = useState(false)
  // const [loaded] = useFonts({
  //   SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  // })

  // useIsomorphicLayoutEffect(() => {
  //   if (hasMounted.current) {
  //     return
  //   }

  //   if (Platform.OS === 'web') {
  //     // Adds the background color to the html element to prevent white background on overscroll.
  //     document.documentElement.classList.add('bg-background')
  //   }
  //   setIsColorSchemeLoaded(true)
  //   hasMounted.current = true
  // }, [])

  // if (!isColorSchemeLoaded || !loaded || isLoading) {
  //   return null
  // }

  return (
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
  )
}
