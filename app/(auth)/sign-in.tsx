import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Text } from '@/components/ui/text'

export default function SignIn() {
  return (
    <SafeAreaView>
      <View className=''>
        <Text variant='h1'>SignIn</Text>
        <Text variant='p'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. A neque est,
          unde at illo sequi, maxime fugiat necessitatibus temporibus veniam ut
          aut explicabo aliquid quam aliquam tempore, adipisci praesentium
          distinctio? Quidem, nisi nemo veniam temporibus ut distinctio pariatur
          nihil dolores iure, id possimus cum dolorem assumenda, dolore natus
          praesentium perferendis?
        </Text>
      </View>
    </SafeAreaView>
  )
}
