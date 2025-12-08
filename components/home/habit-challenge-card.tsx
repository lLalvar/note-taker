import { Gift, X } from 'lucide-react-native'
import { View } from 'react-native'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import { useTheme } from '@/hooks/use-theme'

interface HabitChallengeCardProps {
  show: boolean
  onDismiss: () => void
}

export function HabitChallengeCard({
  show,
  onDismiss,
}: HabitChallengeCardProps) {
  const { colors, isDark } = useTheme()

  if (!show) return null

  return (
    <View className='px-4 pt-4'>
      <Card
        className='relative overflow-hidden'
        style={{
          backgroundColor: isDark ? colors.secondary : `${colors.secondary}CC`, // 80% opacity
          borderColor: colors.border,
        }}
      >
        <CardContent className='p-4'>
          <View className='flex-row items-center justify-between'>
            <View className='flex-1 gap-3'>
              <Text className='text-base font-semibold text-foreground'>
                3-Day Habit Challenge
              </Text>
              {/* Progress Bar */}
              <View className='flex-row items-center gap-2'>
                <View
                  className='h-2 flex-1 rounded-full'
                  style={{
                    backgroundColor: isDark
                      ? colors.muted
                      : `${colors.muted}80`,
                  }}
                >
                  <View
                    className='h-2 w-1/3 rounded-full'
                    style={{ backgroundColor: colors.primary }}
                  />
                </View>
                <View
                  className='h-6 w-6 items-center justify-center rounded-full'
                  style={{ backgroundColor: colors.primary }}
                >
                  <View
                    className='h-3 w-3 rounded-full'
                    style={{ backgroundColor: colors.primaryForeground }}
                  />
                </View>
                <View
                  className='h-6 w-6 rounded-full border-2 bg-transparent'
                  style={{ borderColor: colors.mutedForeground }}
                />
              </View>
            </View>
            {/* Gift Box Icon */}
            <View className='ml-4'>
              <Gift size={48} color={colors.primary} />
            </View>
            {/* Dismiss Button */}
            <Button
              variant='ghost'
              size='icon'
              onPress={onDismiss}
              className='absolute right-2 top-2 h-auto w-auto p-1'
            >
              <X size={18} color={colors.mutedForeground} />
            </Button>
          </View>
        </CardContent>
      </Card>
    </View>
  )
}
