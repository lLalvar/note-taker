import { LinearGradient } from 'expo-linear-gradient'
import { View } from 'react-native'

import { useTheme } from '@/hooks/use-theme'

export function HeaderImage() {
  const { isDark } = useTheme()

  return (
    <View className='relative h-48 w-full overflow-hidden'>
      <LinearGradient
        colors={
          (isDark
            ? [
                'hsl(220 30% 20%)',
                'hsl(220 25% 25%)',
                'hsl(220 20% 30%)',
                'hsl(30 20% 25%)',
                'hsl(340 20% 30%)',
              ]
            : ['#87CEEB', '#B0E0E6', '#E0F6FF', '#FFE4B5', '#FFB6C1']) as [
            string,
            string,
            ...string[],
          ]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
      {/* Simple mountain illustration using View components */}
      <View className='absolute bottom-0 left-0 right-0'>
        {/* Mountains */}
        <View
          className='absolute bottom-0 h-24 w-32'
          style={{
            backgroundColor: isDark
              ? 'hsl(220 30% 30%)'
              : 'rgba(96, 165, 250, 0.6)',
          }}
        />
        <View
          className='absolute bottom-0 left-16 h-32 w-40'
          style={{
            backgroundColor: isDark
              ? 'hsl(220 35% 35%)'
              : 'rgba(59, 130, 246, 0.6)',
            transform: [{ skewX: '-15deg' }],
          }}
        />
        <View
          className='absolute bottom-0 right-8 h-20 w-28'
          style={{
            backgroundColor: isDark
              ? 'hsl(220 25% 25%)'
              : 'rgba(147, 197, 253, 0.6)',
            transform: [{ skewX: '10deg' }],
          }}
        />
        {/* Trees */}
        <View
          className='absolute bottom-0 left-8 h-12 w-6'
          style={{
            backgroundColor: isDark
              ? 'hsl(120 30% 25%)'
              : 'rgba(22, 163, 74, 0.7)',
          }}
        />
        <View
          className='absolute bottom-0 left-12 h-10 w-4'
          style={{
            backgroundColor: isDark
              ? 'hsl(120 35% 20%)'
              : 'rgba(21, 128, 61, 0.7)',
          }}
        />
        <View
          className='absolute bottom-0 right-12 h-14 w-6'
          style={{
            backgroundColor: isDark
              ? 'hsl(120 30% 25%)'
              : 'rgba(22, 163, 74, 0.7)',
          }}
        />
      </View>
    </View>
  )
}
