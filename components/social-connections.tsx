import { useMutation } from '@tanstack/react-query'
import { Image, Platform, View } from 'react-native'

import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
// Apple Sign-In - Currently disabled, keeping import for future use
// import { useAppleSignIn } from '@/hooks/use-social-auth'
import { useTheme } from '@/hooks/use-theme'
import { cn } from '@/lib/utils'
import { signInWithGoogle } from '@/services/social-auth'

const SOCIAL_CONNECTION_STRATEGIES = [
  // Apple Sign-In - Currently disabled, keeping code for future use
  // {
  //   type: 'oauth_apple' as const,
  //   source: { uri: 'https://img.clerk.com/static/apple.png?width=160' },
  //   useTint: true,
  // },
  {
    type: 'oauth_google' as const,
    source: { uri: 'https://img.clerk.com/static/google.png?width=160' },
    useTint: false,
  },
  // {
  //   type: 'oauth_github',
  //   source: { uri: 'https://img.clerk.com/static/github.png?width=160' },
  //   useTint: true,
  // },
]

export function SocialConnections() {
  const { isDark } = useTheme()
  const googleSignInMutation = useMutation({
    mutationFn: signInWithGoogle,
  })
  // Apple Sign-In - Currently disabled, keeping hook for future use
  // const appleSignInMutation = useAppleSignIn()

  const handleSocialAuth = async (type: 'oauth_apple' | 'oauth_google') => {
    try {
      if (type === 'oauth_google') {
        await googleSignInMutation.mutateAsync()
      }
      // Apple Sign-In - Currently disabled
      // else if (type === 'oauth_apple') {
      //   await appleSignInMutation.mutateAsync()
      // }
    } catch (error) {
      // Error handling is done in the mutation hooks
      console.error('Social auth error:', error)
    }
  }

  return (
    <View className='gap-2 sm:flex-row sm:gap-3'>
      {SOCIAL_CONNECTION_STRATEGIES.map((strategy) => {
        const isGoogle = strategy.type === 'oauth_google'
        // Apple Sign-In - Currently disabled
        // const isApple = strategy.type === 'oauth_apple'
        const isLoading = isGoogle && googleSignInMutation.isPending
        // Apple loading state - Currently disabled
        // || (isApple && appleSignInMutation.isPending)

        // Apple Sign-In - Currently disabled
        // Hide Apple button on non-iOS platforms
        // if (isApple && Platform.OS !== 'ios') {
        //   return null
        // }

        return (
          <Button
            key={strategy.type}
            variant='outline'
            size='sm'
            className='sm:flex-1'
            loading={isLoading}
            onPress={() => handleSocialAuth(strategy.type)}
          >
            {isLoading ? (
              <Text className='text-sm'>Signing in with Google...</Text>
            ) : (
              <Image
                className={cn(
                  'size-4',
                  strategy.useTint && Platform.select({ web: 'dark:invert' })
                )}
                tintColor={Platform.select({
                  native: strategy.useTint
                    ? isDark
                      ? 'white'
                      : 'black'
                    : undefined,
                })}
                source={strategy.source}
              />
            )}
          </Button>
        )
      })}
    </View>
  )
}
