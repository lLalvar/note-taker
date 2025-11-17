import { ThemeProvider } from '@react-navigation/native'
import { PortalHost } from '@rn-primitives/portal'
import { QueryClientProvider } from '@tanstack/react-query'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useColorScheme } from 'nativewind'
import { View } from 'react-native'
import 'react-native-reanimated'
import '~/global.css'

import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { queryClient } from '@/lib/queryClient'
import { NAV_THEME } from '@/lib/theme'

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
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
        <Stack>
          <Stack.Protected guard={isAuthenticated}>
            <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
            <Stack.Screen name='+not-found' />
          </Stack.Protected>

          <Stack.Protected guard={!isAuthenticated}>
            <Stack.Screen name='(auth)' options={{ headerShown: false }} />
          </Stack.Protected>
        </Stack>
        <View className='absolute bottom-4 end-4'>
          <ThemeToggle />
        </View>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <PortalHost />
      </ThemeProvider>
    </QueryClientProvider>
  )
}
