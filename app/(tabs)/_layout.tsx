import React from 'react'

import { Tabs } from 'expo-router'
import { FilePlus2, Home, Send } from 'lucide-react-native'

// import { Platform } from 'react-native'

import { HapticTab } from '@/components/HapticTab'
import { TabBarIcon } from '@/components/ui/TabBarIcon'
// import TabBarBackground from '@/components/ui/TabBarBackground'
import { useTheme } from '@/hooks/use-theme'

export default function TabLayout() {
  const { colors } = useTheme()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
        },
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
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon icon={Home} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name='explore'
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon icon={Send} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name='create-note'
        options={{
          title: 'New Note',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon icon={FilePlus2} focused={focused} />
          ),
        }}
      />
    </Tabs>
  )
}
