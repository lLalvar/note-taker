import React from 'react'

import { Tabs } from 'expo-router'
import { Home, Send } from 'lucide-react-native'

// import { Platform } from 'react-native'

import { HapticTab } from '@/components/HapticTab'
import { Icon } from '@/components/ui/icon'
// import TabBarBackground from '@/components/ui/TabBarBackground'
import { useTheme } from '@/hooks/use-theme'

export default function TabLayout() {
  const { colors } = useTheme()

  return (
    <Tabs
      screenOptions={{
        // tabBarActiveTintColor: '#ef4444',
        // tabBarActiveTintColor: 'hsl(0, 84.2%, 60.2%)',
        tabBarActiveTintColor: colors.destructive,
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
          tabBarIcon: ({ color }) => <Icon as={Home} size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name='explore'
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <Icon as={Send} size={28} color={color} />,
        }}
      />
    </Tabs>
  )
}
