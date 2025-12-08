import React from 'react'

import { Tabs } from 'expo-router'
import { Home, Plus, User } from 'lucide-react-native'
import { Platform, View } from 'react-native'

import { HapticTab } from '@/components/HapticTab'
import { TabBarIcon } from '@/components/ui/TabBarIcon'
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
          height: Platform.OS === 'ios' ? 80 : 70,
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
          paddingTop: 10,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
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
        name='create'
        options={{
          title: 'New Note',
          tabBarIcon: ({ color, focused }) => {
            // Custom large plus button
            return (
              <View className='items-center justify-center'>
                <View
                  className='h-12 w-12 items-center justify-center rounded-full'
                  style={{
                    backgroundColor: colors.primary,
                    shadowColor: colors.primary,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 8,
                  }}
                >
                  <Plus
                    size={28}
                    color={colors.primaryForeground}
                    strokeWidth={3}
                  />
                </View>
              </View>
            )
          },
        }}
      />
      {/* <Tabs.Screen
        name='[id]'
        options={{
          href: null, // Hide from tab bar
        }}
      /> */}
      <Tabs.Screen
        name='explore'
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon icon={User} focused={focused} />
          ),
        }}
      />
    </Tabs>
  )
}
