import React from 'react'

import { View } from 'react-native'

import { Text } from '@/components/ui/text'
import { cn } from '@/lib/utils'

interface SettingsSectionProps {
  title?: string
  children: React.ReactNode
  className?: string
}

export function SettingsSection({
  title,
  children,
  className,
}: SettingsSectionProps) {
  return (
    <View className={cn('gap-3', className)}>
      {title && (
        <Text className='px-1 text-sm font-semibold uppercase tracking-wide text-muted-foreground'>
          {title}
        </Text>
      )}
      <View className='gap-2'>{children}</View>
    </View>
  )
}
