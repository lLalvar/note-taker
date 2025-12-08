import { LogOut } from 'lucide-react-native'
import { Alert } from 'react-native'

import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { signOutUser } from '@/services/auth'

export function SignOutButton() {
  const handleSignOut = async () => {
    try {
      await signOutUser()
    } catch (error) {
      console.error('Sign out error:', error)
      Alert.alert('Sign out failed', 'Please try again.')
    }
  }

  return (
    <Button
      onPress={handleSignOut}
      size='icon'
      variant='ghost'
      className='ios:size-9 rounded-full web:mx-4'
      accessibilityLabel='Sign out'
    >
      <Icon as={LogOut} className='size-5' />
    </Button>
  )
}
