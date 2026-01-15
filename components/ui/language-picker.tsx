import React, { forwardRef, useImperativeHandle, useRef } from 'react'

import { useLingui } from '@lingui/react/macro'
import { Languages } from 'lucide-react-native'
import { View } from 'react-native'

import { BottomSheet } from '@/components/ui/bottom-sheet'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'
import { cn } from '@/lib/utils'
import { type Locale, useLanguageStore } from '@/store/language-store'

const LOCALES = [
  { code: 'en' as const, label: 'English' },
  { code: 'ru' as const, label: 'Русский' },
] as const

export interface LanguagePickerHandle {
  open: () => void
  close: () => void
}

interface LanguagePickerProps {
  asIcon?: boolean
  onLanguageChange?: (locale: Locale) => void
  className?: string
}

export const LanguagePicker = forwardRef<
  LanguagePickerHandle,
  LanguagePickerProps
>(({ asIcon = false, onLanguageChange, className }, ref) => {
  const { t } = useLingui()
  const { locale, setLocale } = useLanguageStore()
  const bottomSheetRef = useRef<React.ComponentRef<typeof BottomSheet>>(null)

  useImperativeHandle(ref, () => ({
    open: () => {
      bottomSheetRef.current?.present()
    },
    close: () => {
      bottomSheetRef.current?.dismiss()
    },
  }))

  const handleOpen = () => {
    bottomSheetRef.current?.present()
  }

  const handleSelectLanguage = (code: Locale) => {
    setLocale(code)
    onLanguageChange?.(code)
    bottomSheetRef.current?.dismiss()
  }

  if (asIcon) {
    return (
      <>
        <Button
          onPress={handleOpen}
          size='icon'
          variant='ghost'
          className={cn('ios:size-9 rounded-full web:mx-4', className)}
        >
          <Icon as={Languages} />
        </Button>
        <BottomSheet ref={bottomSheetRef}>
          <LanguagePickerContent
            locales={LOCALES}
            currentLocale={locale}
            onSelect={handleSelectLanguage}
            title={t`Select Language`}
          />
        </BottomSheet>
      </>
    )
  }

  return (
    <BottomSheet ref={bottomSheetRef}>
      <LanguagePickerContent
        locales={LOCALES}
        currentLocale={locale}
        onSelect={handleSelectLanguage}
        title={t`Select Language`}
      />
    </BottomSheet>
  )
})

LanguagePicker.displayName = 'LanguagePicker'

interface LanguagePickerContentProps {
  locales: typeof LOCALES
  currentLocale: Locale
  onSelect: (locale: Locale) => void
  title: string
}

function LanguagePickerContent({
  locales,
  currentLocale,
  onSelect,
  title,
}: LanguagePickerContentProps) {
  return (
    <View className='px-4 pb-4'>
      <Text className='mb-4 text-lg font-semibold text-foreground'>
        {title}
      </Text>
      {locales.map((loc) => (
        <Button
          key={loc.code}
          onPress={() => onSelect(loc.code)}
          variant='default'
          className={cn(
            'mb-2 justify-start bg-background',
            currentLocale === loc.code && 'bg-muted'
          )}
        >
          <Text
            className={cn(
              'text-muted-foreground',
              currentLocale === loc.code && 'font-semibold text-foreground'
            )}
          >
            {loc.label}
          </Text>
        </Button>
      ))}
    </View>
  )
}
