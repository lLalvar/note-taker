import React, { useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { Menu, Search } from 'lucide-react-native'
import { View } from 'react-native'
import Animated, {
  interpolateColor,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

import { HeaderImage } from '@/components/home/header-image'
import { Notes } from '@/components/home/notes'
import { SideDrawer } from '@/components/side-drawer'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { useTheme } from '@/hooks/use-theme'
import { getNotes } from '@/services/notes'

const SCROLL_THRESHOLD = 50

export default function HomeScreen() {
  const { colors } = useTheme()
  // const [showChallenge, setShowChallenge] = useState(true)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const { data: notes = [], isLoading } = useQuery({
    queryKey: ['notes'],
    queryFn: getNotes,
  })

  const scrollOffset = useSharedValue(0)

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollOffset.value = event.contentOffset.y
    },
  })

  // Animated style for header background
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
          <View className='flex-row items-center justify-between px-4 py-2'>
            <Button
              variant='ghost'
              size='icon'
              onPress={() => setIsDrawerOpen(true)}
            >
              <Icon as={Menu} className='size-5' />
            </Button>
            <Button variant='ghost' size='icon'>
              <Icon as={Search} className='size-5' />
            </Button>
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
        {/* Spacer to account for fixed header */}
        {/* <View className='h-16' /> */}

        <HeaderImage />

        {/* <HabitChallengeCard
          show={showChallenge}
          onDismiss={() => setShowChallenge(false)}
        /> */}

        {!isLoading && <Notes entries={notes} />}
      </Animated.ScrollView>

      {/* Side Drawer */}
      <SideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </SafeAreaView>
  )
}
