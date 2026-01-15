import React, { useEffect } from 'react'

import { useLingui } from '@lingui/react/macro'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { Link, RelativePathString } from 'expo-router'
import {
  HelpCircle,
  type LucideIcon,
  Palette,
  Settings,
  Share2,
} from 'lucide-react-native'
import {
  Modal,
  Pressable,
  ScrollView,
  View,
  useWindowDimensions,
} from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  clamp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { scheduleOnRN } from 'react-native-worklets'

import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Separator } from '@/components/ui/separator'
import { Text } from '@/components/ui/text'
import { useShareApp } from '@/hooks/use-share-app'
import { useTheme } from '@/hooks/use-theme'

const icon = require('@/assets/images/icon.png')

const DRAWER_WIDTH = 280
const BACKDROP_OPACITY = 0.5

interface MenuItem {
  id: string
  label: string
  icon: LucideIcon
  href?: string
  onPress?: () => void
}

interface SideDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function SideDrawer({ isOpen, onClose }: SideDrawerProps) {
  const { t } = useLingui()
  const { colors } = useTheme()
  const { shareApp } = useShareApp()
  const insets = useSafeAreaInsets()
  const { width: screenWidth } = useWindowDimensions()
  const translateX = useSharedValue(-DRAWER_WIDTH)
  const isDragging = useSharedValue(false)

  const closeDrawer = () => {
    onClose()
  }

  useEffect(() => {
    if (isOpen) {
      translateX.value = withSpring(0, {
        damping: 30,
        stiffness: 200,
        overshootClamping: true,
      })
    } else {
      translateX.value = withSpring(-DRAWER_WIDTH, {
        damping: 30,
        stiffness: 200,
        overshootClamping: true,
      })
    }
  }, [isOpen, translateX])

  const drawerStartX = useSharedValue(0)

  const drawerPanGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-10, 10])
    .onStart(() => {
      drawerStartX.value = translateX.value
      isDragging.value = true
    })
    .onUpdate((event) => {
      const newValue = clamp(
        drawerStartX.value + event.translationX,
        -DRAWER_WIDTH,
        0
      )
      translateX.value = newValue
    })
    .onEnd((event) => {
      isDragging.value = false
      const currentValue = translateX.value
      const threshold = -DRAWER_WIDTH / 2
      const shouldClose = currentValue < threshold || event.velocityX < -500

      if (shouldClose) {
        translateX.value = withSpring(-DRAWER_WIDTH, {
          damping: 30,
          stiffness: 200,
          overshootClamping: true,
        })
        scheduleOnRN(closeDrawer)
      } else {
        translateX.value = withSpring(0, {
          damping: 30,
          stiffness: 200,
          overshootClamping: true,
        })
      }
    })

  const backdropStartX = useSharedValue(0)
  const touchStartX = useSharedValue(0)

  const backdropPanGesture = Gesture.Pan()
    .onStart((event) => {
      touchStartX.value = event.x
      backdropStartX.value = translateX.value
      isDragging.value = true
    })
    .onUpdate((event) => {
      const newValue = clamp(
        backdropStartX.value + event.translationX,
        -DRAWER_WIDTH,
        0
      )
      translateX.value = newValue
    })
    .onEnd((event) => {
      isDragging.value = false

      if (
        Math.abs(event.translationX) < 10 &&
        Math.abs(event.translationY) < 10
      ) {
        const touchX = touchStartX.value
        const leftHalf = screenWidth / 2

        if (touchX > leftHalf) {
          translateX.value = withSpring(-DRAWER_WIDTH, {
            damping: 30,
            stiffness: 200,
            overshootClamping: true,
          })
          scheduleOnRN(closeDrawer)
          return
        }
        return
      }

      const currentValue = translateX.value
      const threshold = -DRAWER_WIDTH / 2
      const shouldClose = currentValue < threshold || event.velocityX < -500

      if (shouldClose) {
        translateX.value = withSpring(-DRAWER_WIDTH, {
          damping: 30,
          stiffness: 200,
          overshootClamping: true,
        })
        scheduleOnRN(closeDrawer)
      } else {
        translateX.value = withSpring(0, {
          damping: 30,
          stiffness: 200,
          overshootClamping: true,
        })
      }
    })

  const combinedGesture = Gesture.Race(backdropPanGesture, drawerPanGesture)

  const drawerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: clamp(translateX.value, -DRAWER_WIDTH, 0),
      },
    ],
  }))

  const backdropStyle = useAnimatedStyle(() => {
    const progress = Math.max(
      0,
      Math.min(1, (translateX.value + DRAWER_WIDTH) / DRAWER_WIDTH)
    )
    return {
      opacity: BACKDROP_OPACITY * progress,
      backgroundColor: 'black',
    }
  })

  const menuItems: MenuItem[] = [
    {
      id: 'theme',
      label: t`Theme`,
      icon: Palette,
      href: '/(app)/theme',
    },
    // {
    //   id: 'tags',
    //   label: t`Tags`,
    //   icon: Tag,
    //   onPress: () => {
    //     // TODO: Navigate to tags screen
    //     // router.push('/(tabs)/tags')
    //   },
    // },
    // {
    //   id: 'diary-lock',
    //   label: t`Diary Lock`,
    //   icon: Lock,
    //   onPress: () => {
    //     // Navigate to diary lock settings
    //     router.push('/(auth)/diary-lock')
    //   },
    // },
    // {
    //   id: 'donate',
    //   label: t`Donate`,
    //   icon: Heart,
    //   onPress: () => {
    //     // TODO: Open donate modal or link
    //   },
    // },
    {
      id: 'share',
      label: t`Share App`,
      icon: Share2,
      onPress: () => {
        // TODO: Add app store links when app is published
        // shareApp({
        //   iosLink: 'https://apps.apple.com/app/...',
        //   androidLink: 'https://play.google.com/store/apps/details?id=...',
        // })
        shareApp()
      },
    },
    {
      id: 'help',
      label: t`Help Center`,
      icon: HelpCircle,
      href: '/(app)/help',
    },
    {
      id: 'settings',
      label: t`Settings`,
      icon: Settings,
      href: '/(app)/settings',
    },
    // {
    //   id: 'checkit-task-1',
    //   label: t`CheckIt Task 1`,
    //   icon: Tag,
    //   onPress: () => {
    //     // TODO: Handle CheckIt Task 1
    //   },
    // },
    // {
    //   id: 'checkit-task-2',
    //   label: t`CheckIt Task 2`,
    //   icon: Tag,
    //   onPress: () => {
    //     // TODO: Handle CheckIt Task 2
    //   },
    // },
    // {
    //   id: 'checkit-task-3',
    //   label: t`CheckIt Task 3`,
    //   icon: Tag,
    //   onPress: () => {
    //     // TODO: Handle CheckIt Task 3
    //   },
    // },
    // {
    //   id: 'checkit-task-4',
    //   label: t`CheckIt Task 4`,
    //   icon: Tag,
    //   onPress: () => {
    //     // TODO: Handle CheckIt Task 4
    //   },
    // },
    // {
    //   id: 'checkit-task-5',
    //   label: t`CheckIt Task 5`,
    //   icon: Tag,
    //   onPress: () => {
    //     // TODO: Handle CheckIt Task 5
    //   },
    // },
    // {
    //   id: 'checkit-task-6',
    //   label: t`CheckIt Task 6`,
    //   icon: Tag,
    //   onPress: () => {
    //     // TODO: Handle CheckIt Task 5
    //   },
    // },
    // {
    //   id: 'checkit-task-7',
    //   label: t`CheckIt Task 7`,
    //   icon: Tag,
    //   onPress: () => {
    //     // TODO: Handle CheckIt Task 5
    //   },
    // },
    // {
    //   id: 'checkit-task-8',
    //   label: t`CheckIt Task 8`,
    //   icon: Tag,
    //   onPress: () => {
    //     // TODO: Handle CheckIt Task 5
    //   },
    // },
  ]

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType='none'
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <GestureDetector gesture={combinedGesture}>
        <View className='flex-1'>
          {/* Backdrop */}
          <Animated.View
            className='absolute inset-0 bg-foreground'
            style={backdropStyle}
          >
            {/* Left half - do nothing on touch */}
            <View
              className='absolute bottom-0 left-0 top-0'
              style={{
                width: screenWidth / 2,
              }}
            />
            {/* Right half - close on touch */}
            <Pressable
              className='absolute bottom-0 right-0 top-0'
              style={{
                width: screenWidth / 2,
              }}
              onPress={onClose}
            />
          </Animated.View>

          {/* Drawer */}
          <Animated.View
            className='absolute bottom-0 left-0 top-0 bg-card'
            style={[
              {
                width: DRAWER_WIDTH,
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
              },
              drawerStyle,
            ]}
          >
            <View className='flex-1'>
              {/* Header */}
              <LinearGradient
                colors={['transparent', colors.muted]}
                className='flex-row items-center gap-3 px-6 pb-6 pt-6'
              >
                <View className='relative size-12 overflow-hidden rounded-full'>
                  <Image
                    source={icon}
                    contentFit='cover'
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                  />
                </View>
                <View>
                  <Text className='font-bold leading-tight'>DailyMood</Text>
                  <Text className='font-bold leading-tight'>Journal</Text>
                </View>
              </LinearGradient>

              <Separator />

              {/* Menu Items - Scrollable */}
              <ScrollView
                className='flex-1'
                contentContainerStyle={{
                  paddingVertical: 16,
                }}
                showsVerticalScrollIndicator={false}
              >
                {menuItems.map((item) => {
                  const IconComponent = item.icon
                  const menuItemContent = (
                    <>
                      <Icon as={IconComponent} />
                      <Text>{item.label}</Text>
                    </>
                  )

                  if (item.href) {
                    return (
                      <Link
                        asChild
                        key={item.id}
                        href={item.href as RelativePathString}
                        onPress={onClose}
                      >
                        <Button
                          variant='ghost'
                          size='lg'
                          className='justify-start'
                        >
                          {menuItemContent}
                        </Button>
                      </Link>
                    )
                  }

                  return (
                    <Button
                      key={item.id}
                      variant='ghost'
                      size='lg'
                      onPress={() => {
                        item.onPress?.()
                        onClose()
                      }}
                      className='justify-start'
                    >
                      {menuItemContent}
                    </Button>
                  )
                })}
              </ScrollView>

              {/* Bottom Handle Indicator */}
              <View className='items-center pb-4'>
                <View className='h-1 w-12 rounded-full bg-muted-foreground' />
              </View>
            </View>
          </Animated.View>
        </View>
      </GestureDetector>
    </Modal>
  )
}
