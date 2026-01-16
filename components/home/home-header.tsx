import React from 'react'

import { Menu } from 'lucide-react-native'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { SearchBar } from '@/components/home/search-bar'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { useDrawerStore } from '@/store/drawer-store'

interface HomeHeaderProps {
  isLoading?: boolean
}

export function HomeHeader({ isLoading = false }: HomeHeaderProps) {
  const openDrawer = useDrawerStore((state) => state.openDrawer)

  return (
    <SafeAreaView edges={['top']}>
      <View className='flex-row items-center justify-between gap-2 px-2 py-2'>
        <Button
          variant='ghost'
          size='icon'
          onPress={openDrawer}
          accessibilityLabel='Open drawer'
        >
          <Icon as={Menu} />
        </Button>
        <SearchBar isLoading={isLoading} />
      </View>
    </SafeAreaView>
  )
}
