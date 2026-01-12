import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { View } from 'react-native'

import { useTheme } from '@/hooks/use-theme'

const bgDark = require('@/assets/images/bg/bg-dark-default.png')
const bgLight = require('@/assets/images/bg/bg-light-default.png')

export function HeaderImage() {
  const { isDark, colors } = useTheme()

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
      <LinearGradient
        colors={[colors.background, 'transparent']}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 60,
        }}
      />
    </View>
  )
}
