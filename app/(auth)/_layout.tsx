import { Slot } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'

export default function AuthLayout() {
  return (
    <View>
      <Text className='text-blue-500'>Auth Layout</Text>
      <Slot />
    </View>
  )
}
