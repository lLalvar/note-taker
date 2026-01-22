import { useLingui } from '@lingui/react/macro'
import { Gift, X } from 'lucide-react-native'
import { View } from 'react-native'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'

interface HabitChallengeCardProps {
  show: boolean
  onDismiss: () => void
}

export function HabitChallengeCard({
  show,
  onDismiss,
}: HabitChallengeCardProps) {
  const { t } = useLingui()
  if (!show) return null

  return (
    <View className='px-4 pt-4'>
      <Card className='relative overflow-hidden'>
        <CardContent className='p-4'>
          <View className='flex-row items-center justify-between'>
            <View className='flex-1 gap-3'>
              <Text className='text-base font-semibold text-foreground'>
                3-Day Habit Challenge
              </Text>
              {/* Progress Bar */}
              <View className='flex-row items-center gap-2'>
                <View className='h-2 flex-1 rounded-full bg-muted'>
                  <View className='h-2 w-1/3 rounded-full bg-primary' />
                </View>
                <View className='h-6 w-6 items-center justify-center rounded-full bg-primary'>
                  <View className='h-3 w-3 rounded-full bg-primary-foreground' />
                </View>
                <View className='h-6 w-6 rounded-full border-2 border-muted-foreground bg-transparent' />
              </View>
            </View>
            {/* Gift Box Icon */}
            <View className='ml-4'>
              <Icon as={Gift} className='size-12 text-primary' />
            </View>
            {/* Dismiss Button */}
            <Button
              variant='ghost'
              size='icon'
              onPress={onDismiss}
              className='absolute right-2 top-2 h-auto w-auto p-1'
              accessibilityLabel={t`Dismiss habit challenge`}
            >
              <Icon as={X} className='text-muted-foreground' />
            </Button>
          </View>
        </CardContent>
      </Card>
    </View>
  )
}
