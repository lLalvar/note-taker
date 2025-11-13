import React from 'react'

import { Tabs } from 'expo-router'
import { useColorScheme } from 'nativewind'

// import { Platform } from 'react-native'

import { HapticTab } from '@/components/HapticTab'
import { IconSymbol } from '@/components/ui/IconSymbol'
// import TabBarBackground from '@/components/ui/TabBarBackground'
import { THEME } from '@/lib/theme'

export default function TabLayout() {
  const { colorScheme } = useColorScheme()

  console.log(
    "🚀 ~ :16 ~ THEME[colorScheme ?? 'light'].primary:",
    THEME[colorScheme ?? 'light'].primary
  )
  return (
    <Tabs
      screenOptions={{
        // tabBarActiveTintColor: '#ef4444',
        tabBarActiveTintColor: 'hsl(0, 84.2%, 60.2%)',
        // tabBarActiveTintColor: THEME[colorScheme ?? 'light'].destructive,
        headerShown: false,
        tabBarButton: HapticTab,
        // tabBarBackground: TabBarBackground,
        // tabBarStyle: Platform.select({
        //   ios: {
        //     // Use a transparent background on iOS to show the blur effect
        //     position: 'absolute',
        //   },
        //   default: {},
        // }),
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name='house.fill' color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='explore'
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name='paperplane.fill' color={color} />
          ),
        }}
      />
    </Tabs>
  )
}
