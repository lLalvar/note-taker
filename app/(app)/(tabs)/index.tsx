import React, { useEffect, useState } from 'react'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Menu, Search } from 'lucide-react-native'
import { ActivityIndicator, View } from 'react-native'
import Animated, {
  interpolateColor,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useDebounce } from 'use-debounce'

import { HeaderImage } from '@/components/home/header-image'
import { Notes } from '@/components/home/notes'
import { SearchBar } from '@/components/home/search-bar'
import { SideDrawer } from '@/components/side-drawer'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'
import { useTheme } from '@/hooks/use-theme'
import { getNote, getNotes } from '@/services/notes'

const SCROLL_THRESHOLD = 40

export default function HomeScreen() {
  const { colors } = useTheme()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const queryClient = useQueryClient()

  const [debouncedSearchQuery] = useDebounce(searchQuery, 300)
  const trimmedSearchQuery = debouncedSearchQuery.trim()
  const shouldSearch = trimmedSearchQuery.length >= 3

  const { data: notes = [], isLoading } = useQuery({
    queryKey: [
      'notes',
      {
        searchQuery: shouldSearch ? trimmedSearchQuery : undefined,
      },
    ],
    queryFn: () => getNotes(shouldSearch ? trimmedSearchQuery : undefined),
  })

  const handleCloseSearch = () => {
    setIsSearchActive(false)
    setSearchQuery('')
  }

  const handleToggleSearch = () => {
    if (isSearchActive) {
      handleCloseSearch()
    } else {
      setIsSearchActive(true)
    }
  }

  useEffect(() => {
    if (notes.length > 0) {
      const notesToPrefetch = notes.slice(0, 10)
      notesToPrefetch.forEach((note) => {
        queryClient.setQueryData(['note', note.id], note)
        queryClient.prefetchQuery({
          queryKey: ['note', note.id],
          queryFn: () => getNote(note.id),
        })
      })
    }
  }, [notes, queryClient])

  const scrollOffset = useSharedValue(0)

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollOffset.value = event.contentOffset.y
    },
  })

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      scrollOffset.value,
      [0, SCROLL_THRESHOLD],
      ['transparent', colors.background]
    )

    return {
      backgroundColor,
    }
  })

  return (
    <SafeAreaView className='flex-1 bg-background' edges={['top']}>
      {/* Fixed Header */}
      <Animated.View
        className='absolute left-0 right-0 top-0 z-10'
        style={headerAnimatedStyle}
      >
        <SafeAreaView edges={['top']}>
          <View className='flex-row items-center justify-between gap-2 px-4 py-2'>
            <Button
              variant='ghost'
              size='icon'
              onPress={() => setIsDrawerOpen(true)}
            >
              <Icon as={Menu} />
            </Button>
            <View className='flex-1 flex-row items-center justify-end gap-2'>
              <SearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                onClose={handleCloseSearch}
                isVisible={isSearchActive}
                isLoading={isLoading && shouldSearch}
              />
              {!isSearchActive && (
                <Button
                  variant='ghost'
                  size='icon'
                  onPress={handleToggleSearch}
                >
                  <Icon as={Search} />
                </Button>
              )}
            </View>
          </View>
        </SafeAreaView>
      </Animated.View>

      <Animated.ScrollView
        className='flex-1'
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={scrollHandler}
      >
        <HeaderImage />
        {isLoading && shouldSearch ? (
          <View className='flex-1 items-center justify-center px-8 py-16'>
            <ActivityIndicator size='large' color={colors.primary} />
            <Text className='mt-4 text-center text-muted-foreground'>
              Searching...
            </Text>
          </View>
        ) : (
          <Notes
            entries={notes}
            isSearchResult={shouldSearch}
            searchQuery={trimmedSearchQuery}
            isLoading={isLoading && !shouldSearch}
          />
        )}
      </Animated.ScrollView>

      <SideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </SafeAreaView>
  )
}
