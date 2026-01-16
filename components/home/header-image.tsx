import { Image } from 'expo-image'
import { View } from 'react-native'

import { useTheme } from '@/hooks/use-theme'
import { getThemeBackgroundImage } from '@/lib/theme'

export function HeaderImage() {
  const { theme } = useTheme()
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
    </View>
  )
}
