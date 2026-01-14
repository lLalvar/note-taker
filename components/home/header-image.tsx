import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { View } from 'react-native'

import { useTheme } from '@/hooks/use-theme'
import { getThemeBackgroundImage } from '@/lib/theme'

export function HeaderImage() {
  const { theme, colors } = useTheme()
  const backgroundImage = getThemeBackgroundImage(theme)

  return (
    <View className='relative h-48 w-full overflow-hidden'>
      <Image
        source={backgroundImage}
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
