import { Link, Stack } from 'expo-router'
import { StyleSheet, View } from 'react-native'

import { Text } from '@/components/ui/text'

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Text variant='h1'>This screen does not exist.</Text>
        <Link href='/' style={styles.link}>
          <Text variant='p' className='text-blue-600 underline'>
            Go to home screen!
          </Text>
        </Link>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
})
