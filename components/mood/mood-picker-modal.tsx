import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { Pressable, View } from 'react-native'

import { BottomSheet } from '@/components/ui/bottom-sheet'
import { Text } from '@/components/ui/text'
import { DEFAULT_MOOD, MOODS, type Mood } from '@/constants/moods'
import { cn } from '@/lib/utils'

export interface MoodPickerModalHandle {
  open: () => void
  close: () => void
}

interface MoodPickerModalProps {
  currentMood?: string
  onMoodSelect: (emoji: string) => void
  onClose?: () => void
}

export const MoodPickerModal = forwardRef<
  MoodPickerModalHandle,
  MoodPickerModalProps
>(({ currentMood, onMoodSelect, onClose }, ref) => {
  const { t } = useLingui()
  const bottomSheetRef = useRef<React.ComponentRef<typeof BottomSheet>>(null)
  const [selectedMood, setSelectedMood] = useState<string>(
    currentMood || DEFAULT_MOOD.emoji
  )

  useImperativeHandle(ref, () => ({
    open: () => {
      setSelectedMood(currentMood || DEFAULT_MOOD.emoji)
      bottomSheetRef.current?.present()
    },
    close: () => {
      bottomSheetRef.current?.dismiss()
    },
  }))

  const handleMoodSelect = (mood: Mood) => {
    setSelectedMood(mood.emoji)
    onMoodSelect(mood.emoji)
    bottomSheetRef.current?.dismiss()
  }

  const handleClose = () => {
    onClose?.()
  }

  return (
    <BottomSheet ref={bottomSheetRef} onDismiss={handleClose}>
      <View className='px-4 pb-4'>
        <Text className='mb-6 text-lg font-semibold text-foreground'>
          {t`Select Mood`}
        </Text>
        <View className='flex-row flex-wrap' style={{ gap: 12 }}>
          {MOODS.map((mood) => {
            const isSelected = selectedMood === mood.emoji
            return (
              <Pressable
                key={mood.emoji}
                onPress={() => handleMoodSelect(mood)}
                className={cn(
                  'items-center justify-center rounded-lg border-2 p-4',
                  isSelected
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-background'
                )}
                style={{ width: '22%', minWidth: 70 }}
              >
                <Text className='text-4xl'>{mood.emoji}</Text>
              </Pressable>
            )
          })}
        </View>
      </View>
    </BottomSheet>
  )
})

MoodPickerModal.displayName = 'MoodPickerModal'
