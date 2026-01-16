import React, { useEffect, useMemo } from 'react'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { BackHandler, Platform, StatusBar, View } from 'react-native'
import Animated, {
  interpolateColor,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

import { HeaderImage } from '@/components/home/header-image'
import { HomeHeader } from '@/components/home/home-header'
import { Notes } from '@/components/home/notes'
import { SelectionHeader } from '@/components/home/selection-header'
import { SideDrawer } from '@/components/side-drawer'
import { useSearch } from '@/hooks/use-search'
import { useTheme } from '@/hooks/use-theme'
import { getNote, getNotes } from '@/services/notes'
import { useSelectionStore } from '@/store/selection-store'

const SCROLL_THRESHOLD = 80

export default function HomeScreen() {
  const { colors } = useTheme()
  const { trimmedSearchQuery, shouldSearch } = useSearch()
  const queryClient = useQueryClient()
  const isSelectionMode = useSelectionStore((state) => state.isSelectionMode)
  const exitSelectionMode = useSelectionStore(
    (state) => state.exitSelectionMode
  )

  const { data: allNotes = [], isLoading } = useQuery({
    queryKey: ['notes'],
    queryFn: () => getNotes(),
  })

  const notes = useMemo(() => {
    if (!shouldSearch || !trimmedSearchQuery) return allNotes

    const normalizedQuery = trimmedSearchQuery.toLowerCase()
    return allNotes.filter((note) => {
      const title = (note.title || '').toLowerCase()
      const description = (note.description || '').toLowerCase()
      return (
        title.includes(normalizedQuery) || description.includes(normalizedQuery)
      )
    })
  }, [allNotes, shouldSearch, trimmedSearchQuery])

  // Handle back button/gesture to cancel selection
  useEffect(() => {
    if (!isSelectionMode) return

    if (Platform.OS === 'android') {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          exitSelectionMode()
          return true // Prevent default back behavior
        }
      )

      return () => backHandler.remove()
    }
  }, [isSelectionMode, exitSelectionMode])

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
  const selectionModeProgress = useSharedValue(isSelectionMode ? 1 : 0)

  // Animate selection mode transition
  useEffect(() => {
    selectionModeProgress.value = withTiming(isSelectionMode ? 1 : 0, {
      duration: 200,
    })
  }, [isSelectionMode, selectionModeProgress])

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollOffset.value = event.contentOffset.y
    },
  })

  const normalHeaderStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      scrollOffset.value,
      [0, SCROLL_THRESHOLD],
      ['transparent', colors.background]
    )

    return {
      opacity: 1 - selectionModeProgress.value,
      backgroundColor,
      transform: [
        {
          translateY: selectionModeProgress.value * -50,
        },
      ],
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      zIndex: selectionModeProgress.value < 0.5 ? 1 : 0,
    }
  })

  const selectionHeaderStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      scrollOffset.value,
      [0, SCROLL_THRESHOLD],
      ['transparent', colors.background]
    )

    return {
      opacity: selectionModeProgress.value,
      backgroundColor,
      transform: [
        {
          translateY: (1 - selectionModeProgress.value) * 50,
        },
      ],
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      zIndex: selectionModeProgress.value > 0.5 ? 1 : 0,
    }
  })

  return (
    <>
      <StatusBar
        translucent
        backgroundColor='transparent'
        barStyle='light-content'
      />
      <SafeAreaView className='flex-1 bg-background' edges={[]}>
        {/* Fixed Header */}
        <Animated.View style={normalHeaderStyle}>
          <HomeHeader isLoading={isLoading} />
        </Animated.View>
        <Animated.View style={selectionHeaderStyle}>
          <SelectionHeader
            allNoteIds={notes.map((note) => note.id)}
            totalNotesCount={notes.length}
          />
        </Animated.View>

        <View className='flex-1'>
          <Notes
            entries={notes}
            isSearchResult={shouldSearch}
            searchQuery={trimmedSearchQuery}
            isLoading={isLoading}
            onScroll={scrollHandler}
            ListHeaderComponent={<HeaderImage />}
          />
        </View>

        <SideDrawer />
      </SafeAreaView>
    </>
  )
}
