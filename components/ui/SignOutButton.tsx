import { useLingui } from '@lingui/react/macro'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { router } from 'expo-router'
import { LogOut } from 'lucide-react-native'
import { Alert } from 'react-native'

import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { getAuthErrorMessage } from '@/lib/utils'
import { signOutUser } from '@/services/auth'

export function SignOutButton() {
  const { t } = useLingui()
  const queryClient = useQueryClient()

  const signOutMutation = useMutation({
    mutationFn: signOutUser,
    onSuccess: () => {
      queryClient.clear()
      router.replace('/(auth)/sign-in')
    },
    onError: (error: unknown) => {
      const errorMessage = getAuthErrorMessage(error)
      Alert.alert(t`Sign out failed`, errorMessage)
    },
  })

  return (
    <Button
      onPress={() => signOutMutation.mutate()}
      size='icon'
      variant='ghost'
      className='ios:size-9 rounded-full web:mx-4'
      accessibilityLabel='Sign out'
      loading={signOutMutation.isPending}
    >
      <Icon as={LogOut} />
    </Button>
  )
}
