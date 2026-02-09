import React from 'react'

import type { LucideIcon } from 'lucide-react-native'
import { View } from 'react-native'

import { Icon } from '@/components/ui/icon'
import { useTheme } from '@/hooks/use-theme'
import { cn } from '@/lib/utils'

interface TabBarIconProps {
  icon: LucideIcon
  focused: boolean
}

export function TabBarIcon({ icon: IconComponent, focused }: TabBarIconProps) {
  const { colors } = useTheme()

  const backgroundColor = focused ? colors.secondary : 'transparent'
  const iconColor = focused ? colors.foreground : colors.mutedForeground

  return (
    <View className='items-center justify-center'>
      <View className={cn('rounded-full p-2')} style={{ backgroundColor }}>
        <Icon as={IconComponent} size={22} color={iconColor} />
      </View>
    </View>
  )
}
