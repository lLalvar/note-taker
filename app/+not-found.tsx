import { Link, Stack } from 'expo-router'
import { View } from 'react-native'

import { Text } from '@/components/ui/text'

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className='flex-1items-center justify-center p-4'>
        <Text variant='h1'>This screen does not exist.</Text>
        <Link href='/' className='mt-4 py-4'>
          <Text variant='p' className='text-primary underline'>
            Go to home screen!
          </Text>
        </Link>
      </View>
    </>
  )
}
