import React, { useCallback, useEffect, useRef, useState } from 'react'

import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
  type BottomSheetModalProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import { I18nProvider, type TransRenderProps } from '@lingui/react'
import { BackHandler, Platform, Text as RNText } from 'react-native'

import { useTheme } from '@/hooks/use-theme'
import { i18n } from '@/lib/i18n'

const TransText = ({ translation }: TransRenderProps) => {
  return <RNText>{translation}</RNText>
}

interface BottomSheetProps extends Omit<BottomSheetModalProps, 'children'> {
  children: React.ReactNode
  title?: string
}

const BottomSheet = React.forwardRef<BottomSheetModal, BottomSheetProps>(
  ({ children, title, ...props }, ref) => {
    const { colors, cssVariables } = useTheme()
    const [isOpen, setIsOpen] = useState(false)
    const internalRef = useRef<BottomSheetModal>(null)
    const sheetRef = ref || internalRef

    const handleChange = useCallback((index: number) => {
      setIsOpen(index >= 0)
    }, [])

    useEffect(() => {
      if (Platform.OS !== 'android') return

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          if (isOpen) {
            const sheet = 'current' in sheetRef ? sheetRef.current : null
            if (sheet) {
              sheet.dismiss()
              return true
            }
          }
          return false
        }
      )

      return () => backHandler.remove()
    }, [isOpen, sheetRef])

    const renderBackdrop = useCallback(
      (backdropProps: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...backdropProps}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          pressBehavior='close'
        />
      ),
      []
    )

    return (
      <BottomSheetModal
        ref={sheetRef}
        enablePanDownToClose
        android_keyboardInputMode='adjustResize'
        keyboardBlurBehavior='restore'
        backgroundStyle={{ backgroundColor: colors.background }}
        handleIndicatorStyle={{ backgroundColor: colors.mutedForeground }}
        backdropComponent={renderBackdrop}
        onChange={handleChange}
        {...props}
      >
        <I18nProvider i18n={i18n} defaultComponent={TransText}>
          <BottomSheetView style={cssVariables}>{children}</BottomSheetView>
        </I18nProvider>
      </BottomSheetModal>
    )
  }
)

BottomSheet.displayName = 'BottomSheet'

export { BottomSheet }
export type { BottomSheetProps }
