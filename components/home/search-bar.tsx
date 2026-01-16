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
import { useSearch } from '@/hooks/use-search'
import { useTheme } from '@/hooks/use-theme'

interface SearchBarProps {
  isLoading?: boolean
}

export function SearchBar({ isLoading = false }: SearchBarProps) {
  const {
    searchQuery,
    isSearchActive,
    shouldSearch,
    setSearchQuery,
    closeSearch,
    toggleSearch,
  } = useSearch()
  const { colors } = useTheme()
  const inputRef = useRef<TextInput>(null)
  const width = useSharedValue(0)
  const opacity = useSharedValue(0)

  useEffect(() => {
    if (isSearchActive) {
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
  }, [isSearchActive, width, opacity])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      flexGrow: width.value,
      opacity: opacity.value,
      width: width.value === 0 ? 0 : undefined,
    }
  })

  const handleClear = () => {
    setSearchQuery('')
    closeSearch()
  }

  const handleBlur = () => {
    if (!searchQuery.trim()) {
      closeSearch()
    }
  }

  return (
    <View className='flex-1 flex-row items-center justify-end gap-2'>
      <Animated.View
        style={animatedStyle}
        className='flex-row items-center gap-2'
      >
        <View className='relative flex-1 flex-row items-center'>
          <View className='absolute left-3 z-10'>
            {isLoading && shouldSearch ? (
              <ActivityIndicator size='small' color={colors.mutedForeground} />
            ) : (
              <Icon as={Search} className='size-4 text-muted-foreground' />
            )}
          </View>
          <Input
            ref={inputRef}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onBlur={handleBlur}
            placeholder='Search notes...'
            className='flex-1 pl-9 pr-9'
            autoCapitalize='none'
            autoCorrect={false}
            returnKeyType='search'
          />
          {isSearchActive && (
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
      {!isSearchActive && (
        <Button
          variant='ghost'
          size='icon'
          onPress={toggleSearch}
          accessibilityLabel='Toggle search'
        >
          <Icon as={Search} />
        </Button>
      )}
    </View>
  )
}
