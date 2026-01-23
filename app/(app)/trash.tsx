import React, { useEffect } from 'react'

import { Trans, useLingui } from '@lingui/react/macro'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { router } from 'expo-router'
import { ArrowLeft } from 'lucide-react-native'
import { ActivityIndicator, BackHandler, Platform, View } from 'react-native'
import Animated, {
  interpolateColor,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

import { HeaderImage } from '@/components/home/header-image'
import { Notes } from '@/components/home/notes'
import { TrashSelectionHeader } from '@/components/home/trash-selection-header'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'
import { useTheme } from '@/hooks/use-theme'
import { getNote, getTrashedNotes } from '@/services/notes'
import { useSelectionStore } from '@/store/selection-store'

const SCROLL_THRESHOLD = 40

export default function TrashScreen() {
  const { t } = useLingui()
  const { colors } = useTheme()
  const queryClient = useQueryClient()
  const isSelectionMode = useSelectionStore((state) => state.isSelectionMode)
  const exitSelectionMode = useSelectionStore(
    (state) => state.exitSelectionMode
  )
  const { data: trashedNotes = [], isLoading } = useQuery({
    queryKey: ['trash-notes'],
    queryFn: () => getTrashedNotes(),
  })

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
    if (trashedNotes.length > 0) {
      const notesToPrefetch = trashedNotes.slice(0, 10)
      notesToPrefetch.forEach((note) => {
        queryClient.setQueryData(['note', note.id], note)
        queryClient.prefetchQuery({
          queryKey: ['note', note.id],
          queryFn: () => getNote(note.id),
        })
      })
    }
  }, [trashedNotes, queryClient])

  const scrollOffset = useSharedValue(0)
  const selectionModeProgress = useSharedValue(isSelectionMode ? 1 : 0)

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

  const normalHeaderStyle = useAnimatedStyle(() => {
    return {
      opacity: 1 - selectionModeProgress.value,
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
    return {
      opacity: selectionModeProgress.value,
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
    <SafeAreaView className='flex-1 bg-background' edges={['top']}>
      {/* Fixed Header */}
      <Animated.View
        className='absolute left-0 right-0 top-0 z-10'
        style={headerAnimatedStyle}
      >
        <Animated.View style={normalHeaderStyle}>
          <SafeAreaView edges={['top']}>
            <View className='flex-row items-center gap-2 px-4 py-2'>
              <Button
                variant='ghost'
                size='icon'
                onPress={() => router.back()}
                accessibilityLabel={t`Go back`}
              >
                <Icon as={ArrowLeft} />
              </Button>
              <Text className='text-lg font-semibold text-foreground'>
                <Trans>Trash</Trans>
              </Text>
            </View>
          </SafeAreaView>
        </Animated.View>
        <Animated.View style={selectionHeaderStyle}>
          <TrashSelectionHeader
            allNoteIds={trashedNotes.map((note) => note.id)}
            totalNotesCount={trashedNotes.length}
          />
        </Animated.View>
      </Animated.View>

      <View className='flex-1'>
        {isLoading ? (
          <View className='flex-1 items-center justify-center px-8 py-16'>
            <ActivityIndicator size='large' color={colors.primary} />
            <Text className='mt-4 text-center text-muted-foreground'>
              <Trans>Loading trash...</Trans>
            </Text>
          </View>
        ) : (
          <Notes
            entries={trashedNotes}
            isLoading={false}
            isTrash={true}
            onScroll={scrollHandler}
            ListHeaderComponent={<HeaderImage />}
          />
        )}
      </View>
    </SafeAreaView>
  )
}
