import { Image } from 'expo-image'
import { View } from 'react-native'

import { useTheme } from '@/hooks/use-theme'

const bgDark = require('@/assets/images/bg/bg-dark-default.png')
const bgLight = require('@/assets/images/bg/bg-light-default.png')

export function HeaderImage() {
  const { isDark } = useTheme()

  return (
    <View className='relative h-48 w-full overflow-hidden'>
      <Image
        source={isDark ? bgDark : bgLight}
        contentFit='cover'
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    </View>
  )
}
