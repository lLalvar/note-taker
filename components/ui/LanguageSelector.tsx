import React, { useCallback, useRef } from 'react'

import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import { Languages } from 'lucide-react-native'

import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'
import { useTheme } from '@/hooks/use-theme'
import { cn } from '@/lib/utils'
import { useLanguageStore } from '@/store/language-store'

const LOCALES = [
  { code: 'en', label: 'EN' },
  { code: 'ru', label: 'RU' },
] as const

export function LanguageSelector() {
  const { locale, setLocale } = useLanguageStore()
  const { colors, cssVariables } = useTheme()
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)

  const handleOpenSheet = () => {
    bottomSheetModalRef.current?.present()
  }

  const handleSelectLanguage = (code: typeof locale) => {
    setLocale(code)
    bottomSheetModalRef.current?.dismiss()
  }

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior='close'
      />
    ),
    []
  )

  return (
    <>
      <Button
        onPress={handleOpenSheet}
        size='icon'
        variant='ghost'
        className='ios:size-9 rounded-full web:mx-4'
      >
        <Icon as={Languages} />
      </Button>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        // snapPoints={['25%']}
        enablePanDownToClose
        backgroundStyle={{ backgroundColor: colors.background }}
        handleIndicatorStyle={{ backgroundColor: colors.mutedForeground }}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView style={cssVariables}>
          {LOCALES.map((loc) => (
            <Button
              key={loc.code}
              onPress={() => handleSelectLanguage(loc.code)}
              variant='default'
              className={cn(
                'justify-start bg-background',
                locale === loc.code && 'bg-muted'
              )}
            >
              <Text
                className={cn(
                  'text-muted-foreground',
                  locale === loc.code && 'font-semibold text-foreground'
                )}
              >
                {loc.label}
              </Text>
            </Button>
          ))}
        </BottomSheetView>
      </BottomSheetModal>
    </>
  )
}
