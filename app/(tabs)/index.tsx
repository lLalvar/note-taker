import React, { useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { Menu, MoreVertical, Search } from 'lucide-react-native'
import { ScrollView, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { HabitChallengeCard } from '@/components/home/habit-challenge-card'
import { HeaderImage } from '@/components/home/header-image'
import { Notes } from '@/components/home/notes'
import { SideDrawer } from '@/components/side-drawer'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/hooks/use-theme'
import { getNotes } from '@/services/notes'

export default function HomeScreen() {
  const { colors } = useTheme()
  const [showChallenge, setShowChallenge] = useState(true)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const { data: notes = [], isLoading } = useQuery({
    queryKey: ['notes'],
    queryFn: getNotes,
  })

  return (
    <SafeAreaView className='flex-1 bg-background' edges={['top']}>
      <ScrollView
        className='flex-1'
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className='flex-row items-center justify-between px-4 pb-4 pt-2'>
          <Button
            variant='ghost'
            size='icon'
            onPress={() => setIsDrawerOpen(true)}
          >
            <Menu size={24} color={colors.foreground} />
          </Button>
          <View className='flex-row items-center gap-3'>
            <Button variant='ghost' size='icon'>
              <Search size={24} color={colors.foreground} />
            </Button>
            <Button variant='ghost' size='icon'>
              <MoreVertical size={24} color={colors.foreground} />
            </Button>
          </View>
        </View>

        <HeaderImage />

        <HabitChallengeCard
          show={showChallenge}
          onDismiss={() => setShowChallenge(false)}
        />

        {!isLoading && <Notes entries={notes} />}
      </ScrollView>

      {/* Side Drawer */}
      <SideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </SafeAreaView>
  )
}
