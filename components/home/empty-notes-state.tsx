import { BookOpen } from 'lucide-react-native'
import { View } from 'react-native'

import { Text } from '@/components/ui/text'
import { useTheme } from '@/hooks/use-theme'

export function EmptyNotesState() {
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
          <BookOpen size={40} color={colors.mutedForeground} />
        </View>
        <View className='items-center gap-2'>
          <Text className='text-center text-xl font-semibold text-foreground'>
            No notes yet
          </Text>
          <Text className='text-center text-base text-muted-foreground'>
            Start your note-taking journey by creating your first note. Capture
            your thoughts, memories, and moments.
          </Text>
        </View>
      </View>
    </View>
  )
}
