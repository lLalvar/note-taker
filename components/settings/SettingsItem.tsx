import React from 'react'

import * as Haptics from 'expo-haptics'
import { ChevronRight, type LucideIcon } from 'lucide-react-native'
import { Pressable, View } from 'react-native'

import { Icon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'
import { cn } from '@/lib/utils'

interface SettingsItemProps {
  icon?: LucideIcon
  title: string
  description?: string
  onPress?: () => void
  rightIcon?: LucideIcon | React.ReactNode
  disabled?: boolean
  className?: string
}

export function SettingsItem({
  icon: IconComponent,
  title,
  description,
  onPress,
  rightIcon,
  disabled = false,
  className,
}: SettingsItemProps) {
  const handlePress = () => {
    if (disabled || !onPress) return
    if (process.env.EXPO_OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
    onPress()
  }

  // Check if rightIcon is a React element (already rendered) or a component (needs rendering)
  const isRightIconComponent =
    rightIcon &&
    typeof rightIcon === 'function' &&
    !React.isValidElement(rightIcon)
  const isRightIconElement = rightIcon && React.isValidElement(rightIcon)

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || !onPress}
      className={cn(
        'flex-row items-center gap-4 rounded-lg border border-border bg-card p-4 active:bg-accent',
        disabled && 'opacity-50',
        className
      )}
    >
      {IconComponent && (
        <View className='rounded-full bg-muted p-2'>
          <Icon as={IconComponent} className='text-primary' />
        </View>
      )}

      <View className='flex-1 gap-1'>
        <Text className='text-base font-semibold text-foreground'>{title}</Text>
        {description && (
          <Text className='text-sm text-muted-foreground'>{description}</Text>
        )}
      </View>

      {(isRightIconComponent || isRightIconElement || onPress) && (
        <View>
          {isRightIconComponent ? (
            <Icon
              as={rightIcon as LucideIcon}
              className='text-muted-foreground'
            />
          ) : isRightIconElement ? (
            rightIcon
          ) : (
            <Icon as={ChevronRight} className='text-muted-foreground' />
          )}
        </View>
      )}
    </Pressable>
  )
}
