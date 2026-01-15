import React from 'react'

import { Menu, Search } from 'lucide-react-native'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { SearchBar } from '@/components/home/search-bar'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { useSearch } from '@/hooks/use-search'
import { useDrawerStore } from '@/store/drawer-store'

interface HomeHeaderProps {
  isLoading?: boolean
}

export function HomeHeader({ isLoading = false }: HomeHeaderProps) {
  const openDrawer = useDrawerStore((state) => state.openDrawer)

  const {
    searchQuery,
    isSearchActive,
    shouldSearch,
    setSearchQuery,
    closeSearch,
    toggleSearch,
  } = useSearch()

  return (
    <SafeAreaView edges={['top']}>
      <View className='flex-row items-center justify-between gap-2 px-4 py-2'>
        <Button
          variant='ghost'
          size='icon'
          onPress={openDrawer}
          accessibilityLabel='Open drawer'
        >
          <Icon as={Menu} />
        </Button>
        <View className='flex-1 flex-row items-center justify-end gap-2'>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onClose={closeSearch}
            isVisible={isSearchActive}
            isLoading={isLoading && shouldSearch}
          />
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
      </View>
    </SafeAreaView>
  )
}
