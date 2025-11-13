import React from 'react'

import { Slot } from 'expo-router'
import { View } from 'react-native'

import { Text } from '@/components/ui/text'

export default function AuthLayout() {
  return (
    <View>
      <Text variant='h2' className='text-blue-500'>
        Auth Layout
      </Text>
      <Slot />
    </View>
  )
}
