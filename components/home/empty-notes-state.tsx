import { useLingui } from '@lingui/react/macro'
import { BookOpen, Search } from 'lucide-react-native'
import { View } from 'react-native'

import { Icon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'
import { useTheme } from '@/hooks/use-theme'

interface EmptyNotesStateProps {
  isSearchResult?: boolean
  searchQuery?: string
  isTrash?: boolean
}

export function EmptyNotesState({
  isSearchResult = false,
  searchQuery,
  isTrash = false,
}: EmptyNotesStateProps) {
  const { t } = useLingui()
  const { colors } = useTheme()

  return (
    <View className='flex-1 items-center justify-center px-8 py-16'>
      <View className='items-center gap-4'>
        <View
          className='h-20 w-20 items-center justify-center rounded-full'
          style={{
            backgroundColor: colors.muted,
            opacity: 0.5,
          }}
        >
          <Icon
            as={isSearchResult ? Search : BookOpen}
            className='size-10 text-muted-foreground'
          />
        </View>
        <View className='items-center gap-2'>
          <Text className='text-center text-xl font-semibold text-foreground'>
            {isSearchResult
              ? t`No results found`
              : isTrash
                ? t`Trash is empty`
                : t`No notes yet`}
          </Text>
          <Text className='text-center text-muted-foreground'>
            {isSearchResult
              ? t`No notes match "${searchQuery}". Try a different search term.`
              : isTrash
                ? t`Notes you delete will appear here. You can restore them or delete them permanently.`
                : t`Start your note-taking journey by creating your first note. Capture your thoughts, memories, and moments.`}
          </Text>
        </View>
      </View>
    </View>
  )
}
