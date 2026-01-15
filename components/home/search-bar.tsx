import React, { useEffect, useRef } from 'react'

import { Search, X } from 'lucide-react-native'
import { ActivityIndicator, Keyboard, TextInput, View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Input } from '@/components/ui/input'
import { useTheme } from '@/hooks/use-theme'

interface SearchBarProps {
  value: string
  onChangeText: (text: string) => void
  onClose: () => void
  isVisible: boolean
  isLoading?: boolean
}

export function SearchBar({
  value,
  onChangeText,
  onClose,
  isVisible,
  isLoading = false,
}: SearchBarProps) {
  const { colors } = useTheme()
  const inputRef = useRef<TextInput>(null)
  const width = useSharedValue(0)
  const opacity = useSharedValue(0)

  useEffect(() => {
    if (isVisible) {
      width.value = withTiming(1, { duration: 250 })
      opacity.value = withTiming(1, { duration: 200 })
      // Auto-focus after animation
      setTimeout(() => {
        inputRef.current?.focus()
      }, 300)
    } else {
      width.value = withTiming(0, { duration: 200 })
      opacity.value = withTiming(0, { duration: 150 })
      Keyboard.dismiss()
    }
  }, [isVisible, width, opacity])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      flexGrow: width.value,
      opacity: opacity.value,
      width: width.value === 0 ? 0 : undefined,
    }
  })

  const handleClear = () => {
    onChangeText('')
    onClose()
  }

  const handleBlur = () => {
    if (!value.trim()) {
      onClose()
    }
  }

  return (
    <Animated.View
      style={animatedStyle}
      className='flex-row items-center gap-2'
    >
      <View className='relative flex-1 flex-row items-center'>
        <View className='absolute left-3 z-10'>
          {isLoading ? (
            <ActivityIndicator size='small' color={colors.mutedForeground} />
          ) : (
            <Icon as={Search} className='size-4 text-muted-foreground' />
          )}
        </View>
        <Input
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          onBlur={handleBlur}
          placeholder='Search notes...'
          className='flex-1 pl-9 pr-9'
          autoCapitalize='none'
          autoCorrect={false}
          returnKeyType='search'
        />
        {isVisible && (
          <Button
            variant='ghost'
            size='icon'
            className='absolute right-1 h-8 w-8'
            onPress={handleClear}
            accessibilityLabel='Clear search'
          >
            <Icon as={X} className='size-4' />
          </Button>
        )}
      </View>
    </Animated.View>
  )
}
