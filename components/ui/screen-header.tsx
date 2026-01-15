import React from 'react'

import { useRouter } from 'expo-router'
import { ArrowLeft } from 'lucide-react-native'
import { View } from 'react-native'

import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'
import { cn } from '@/lib/utils'

interface ScreenHeaderProps {
  title: React.ReactNode
  rightAction?: React.ReactNode
  onBack?: () => void
  showBackButton?: boolean
  className?: string
}

export function ScreenHeader({
  title,
  rightAction,
  onBack,
  showBackButton = true,
  className,
}: ScreenHeaderProps) {
  const router = useRouter()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      router.back()
    }
  }

  return (
    <View
      className={cn(
        'min-h-14 flex-row items-center gap-2 px-4 ps-2',
        !showBackButton && 'ps-4',
        className
      )}
    >
      {showBackButton && (
        <Button
          variant='ghost'
          size='icon'
          onPress={handleBack}
          accessibilityLabel='Go back'
        >
          <Icon as={ArrowLeft} />
        </Button>
      )}
      <Text variant='large' className='flex-1'>
        {title}
      </Text>
      {rightAction && <View>{rightAction}</View>}
    </View>
  )
}
