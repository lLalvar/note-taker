import React, { useCallback } from 'react'

import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
  type BottomSheetModalProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet'

import { useTheme } from '@/hooks/use-theme'

interface BottomSheetProps extends Omit<BottomSheetModalProps, 'children'> {
  children: React.ReactNode
  title?: string
}

const BottomSheet = React.forwardRef<BottomSheetModal, BottomSheetProps>(
  ({ children, title, ...props }, ref) => {
    const { colors, cssVariables } = useTheme()

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
        ref={ref}
        enablePanDownToClose
        backgroundStyle={{ backgroundColor: colors.background }}
        handleIndicatorStyle={{ backgroundColor: colors.mutedForeground }}
        backdropComponent={renderBackdrop}
        {...props}
      >
        <BottomSheetView style={cssVariables}>{children}</BottomSheetView>
      </BottomSheetModal>
    )
  }
)

BottomSheet.displayName = 'BottomSheet'

export { BottomSheet }
export type { BottomSheetProps }
