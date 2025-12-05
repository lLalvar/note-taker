import React, { useEffect } from 'react'

import { useRouter } from 'expo-router'
import {
  BookOpen,
  Crown,
  Facebook,
  Grid3x3,
  Heart,
  HelpCircle,
  Lock,
  Palette,
  RefreshCw,
  Settings,
  Share2,
  Tag,
  Upload,
} from 'lucide-react-native'
import {
  Modal,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  clamp,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Text } from '@/components/ui/text'
import { useTheme } from '@/hooks/use-theme'

const DRAWER_WIDTH = 280
const BACKDROP_OPACITY = 0.5

interface MenuItem {
  id: string
  label: string
  icon: React.ComponentType<{ size?: number; color?: string }>
  onPress?: () => void
  isPro?: boolean
}

interface SideDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function SideDrawer({ isOpen, onClose }: SideDrawerProps) {
  const { colors } = useTheme()
  const insets = useSafeAreaInsets()
  const router = useRouter()
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

  // Pan gesture for drawer - allows bidirectional dragging
  // Only activates for horizontal swipes to allow vertical scrolling
  const drawerStartX = useSharedValue(0)

  const drawerPanGesture = Gesture.Pan()
    .activeOffsetX([-10, 10]) // Activate for horizontal movement
    .failOffsetY([-10, 10]) // Fail if vertical movement is too large (allows scrolling)
    .onStart(() => {
      drawerStartX.value = translateX.value
      isDragging.value = true
    })
    .onUpdate((event) => {
      // Allow dragging in both directions (left to close, right to open back)
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
        runOnJS(closeDrawer)()
      } else {
        translateX.value = withSpring(0, {
          damping: 30,
          stiffness: 200,
          overshootClamping: true,
        })
      }
    })

  // Pan gesture for backdrop - handles touch zones and dragging
  const backdropStartX = useSharedValue(0)
  const touchStartX = useSharedValue(0)

  const backdropPanGesture = Gesture.Pan()
    .onStart((event) => {
      touchStartX.value = event.x
      backdropStartX.value = translateX.value
      isDragging.value = true
    })
    .onUpdate((event) => {
      // Allow dragging in both directions (left to close, right to open back)
      const newValue = clamp(
        backdropStartX.value + event.translationX,
        -DRAWER_WIDTH,
        0
      )
      translateX.value = newValue
    })
    .onEnd((event) => {
      isDragging.value = false

      // If it was just a tap (not a drag), handle touch zones
      if (
        Math.abs(event.translationX) < 10 &&
        Math.abs(event.translationY) < 10
      ) {
        const touchX = touchStartX.value
        const leftHalf = screenWidth / 2

        // Right half (second half) - close on tap
        if (touchX > leftHalf) {
          translateX.value = withSpring(-DRAWER_WIDTH, {
            damping: 30,
            stiffness: 200,
            overshootClamping: true,
          })
          runOnJS(closeDrawer)()
          return
        }
        // Left half - do nothing on tap (unless it's a TouchableOpacity)
        return
      }

      // Handle drag gesture
      const currentValue = translateX.value
      const threshold = -DRAWER_WIDTH / 2
      const shouldClose = currentValue < threshold || event.velocityX < -500

      if (shouldClose) {
        translateX.value = withSpring(-DRAWER_WIDTH, {
          damping: 30,
          stiffness: 200,
          overshootClamping: true,
        })
        runOnJS(closeDrawer)()
      } else {
        translateX.value = withSpring(0, {
          damping: 30,
          stiffness: 200,
          overshootClamping: true,
        })
      }
    })

  // Combine gestures - backdrop gesture has priority for touch zones
  const combinedGesture = Gesture.Race(backdropPanGesture, drawerPanGesture)

  const drawerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: clamp(translateX.value, -DRAWER_WIDTH, 0), // Clamp to prevent going beyond bounds
      },
    ],
  }))

  const backdropStyle = useAnimatedStyle(() => {
    // Also update opacity based on drawer position for live updates
    const progress = Math.max(
      0,
      Math.min(1, (translateX.value + DRAWER_WIDTH) / DRAWER_WIDTH)
    )
    return {
      opacity: BACKDROP_OPACITY * progress,
    }
  })

  const menuItems: MenuItem[] = [
    {
      id: 'upgrade',
      label: 'Upgrade to PRO',
      icon: Crown,
      isPro: true,
      onPress: () => {
        // TODO: Navigate to upgrade screen or open upgrade modal
        console.log('Navigate to upgrade')
      },
    },
    {
      id: 'theme',
      label: 'Theme',
      icon: Palette,
      onPress: () => {
        // Theme toggle is handled globally, just close drawer
      },
    },
    {
      id: 'tags',
      label: 'Tags',
      icon: Tag,
      onPress: () => {
        // TODO: Navigate to tags screen
        // router.push('/(tabs)/tags')
      },
    },
    {
      id: 'diary-lock',
      label: 'Diary Lock',
      icon: Lock,
      onPress: () => {
        // Navigate to diary lock settings
        router.push('/(auth)/diary-lock')
      },
    },
    {
      id: 'backup',
      label: 'Backup & Restore',
      icon: RefreshCw,
      onPress: () => {
        // TODO: Navigate to backup screen
        // router.push('/(tabs)/backup')
      },
    },
    {
      id: 'export',
      label: 'Export & Import',
      icon: Upload,
      onPress: () => {
        // TODO: Navigate to export screen
        // router.push('/(tabs)/export')
      },
    },
    {
      id: 'donate',
      label: 'Donate',
      icon: Heart,
      onPress: () => {
        // TODO: Open donate modal or link
      },
    },
    {
      id: 'share',
      label: 'Share App',
      icon: Share2,
      onPress: () => {
        // TODO: Implement share functionality
      },
    },
    {
      id: 'follow',
      label: 'Follow Us',
      icon: Facebook,
      onPress: () => {
        // TODO: Open social media link
      },
    },
    {
      id: 'more-apps',
      label: 'More Apps (AD)',
      icon: Grid3x3,
      onPress: () => {
        // TODO: Open app store or more apps screen
      },
    },
    {
      id: 'help',
      label: 'Help Center',
      icon: HelpCircle,
      onPress: () => {
        // TODO: Navigate to help screen
        // router.push('/(tabs)/help')
      },
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      onPress: () => {
        // TODO: Navigate to settings screen
        // router.push('/(tabs)/settings')
      },
    },
    {
      id: 'checkit-task-1',
      label: 'CheckIt Task 1',
      icon: Tag,
      onPress: () => {
        // TODO: Handle CheckIt Task 1
      },
    },
    {
      id: 'checkit-task-2',
      label: 'CheckIt Task 2',
      icon: Tag,
      onPress: () => {
        // TODO: Handle CheckIt Task 2
      },
    },
    {
      id: 'checkit-task-3',
      label: 'CheckIt Task 3',
      icon: Tag,
      onPress: () => {
        // TODO: Handle CheckIt Task 3
      },
    },
    {
      id: 'checkit-task-4',
      label: 'CheckIt Task 4',
      icon: Tag,
      onPress: () => {
        // TODO: Handle CheckIt Task 4
      },
    },
    {
      id: 'checkit-task-5',
      label: 'CheckIt Task 5',
      icon: Tag,
      onPress: () => {
        // TODO: Handle CheckIt Task 5
      },
    },
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
        <View style={{ flex: 1 }}>
          {/* Backdrop */}
          <Animated.View
            style={[
              {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: colors.foreground,
              },
              backdropStyle,
            ]}
          >
            {/* Left half - do nothing on touch */}
            <View
              style={{
                position: 'absolute',
                left: 0,
                width: screenWidth / 2,
                top: 0,
                bottom: 0,
              }}
            />
            {/* Right half - close on touch */}
            <Pressable
              style={{
                position: 'absolute',
                right: 0,
                width: screenWidth / 2,
                top: 0,
                bottom: 0,
              }}
              onPress={onClose}
            />
          </Animated.View>

          {/* Drawer */}
          <Animated.View
            style={[
              {
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                width: DRAWER_WIDTH,
                backgroundColor: colors.card,
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
              },
              drawerStyle,
            ]}
          >
            <View className='flex-1'>
              {/* Header */}
              <View className='px-6 pb-8 pt-6'>
                <View className='flex-row items-center gap-3'>
                  {/* Diary Icon */}
                  <View
                    className='h-12 w-12 items-center justify-center rounded-lg'
                    style={{
                      backgroundColor: colors.muted,
                    }}
                  >
                    <BookOpen size={28} color={colors.foreground} />
                  </View>
                  {/* App Name */}
                  <View>
                    <Text
                      className='text-2xl font-bold'
                      style={{
                        color: colors.foreground,
                      }}
                    >
                      MyDiary
                    </Text>
                  </View>
                </View>
              </View>

              {/* Menu Items - Scrollable */}
              <ScrollView
                className='flex-1'
                contentContainerStyle={{
                  paddingHorizontal: 16,
                  paddingBottom: 16,
                }}
                showsVerticalScrollIndicator={false}
              >
                {menuItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => {
                        item.onPress?.()
                        // Close drawer after action (navigation will happen via router)
                        onClose()
                      }}
                      className='flex-row items-center gap-4 rounded-lg px-3 py-3.5 active:opacity-70'
                      style={{
                        backgroundColor: item.isPro
                          ? colors.accent
                          : 'transparent',
                      }}
                    >
                      <Icon
                        size={22}
                        color={item.isPro ? colors.primary : colors.foreground}
                      />
                      <Text
                        className='flex-1 text-base'
                        style={{
                          color: item.isPro
                            ? colors.primary
                            : colors.foreground,
                          fontWeight: item.isPro ? '600' : '400',
                        }}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  )
                })}
              </ScrollView>

              {/* Bottom Handle Indicator */}
              <View className='items-center pb-4'>
                <View
                  className='h-1 w-12 rounded-full'
                  style={{
                    backgroundColor: colors.mutedForeground,
                  }}
                />
              </View>
            </View>
          </Animated.View>
        </View>
      </GestureDetector>
    </Modal>
  )
}
