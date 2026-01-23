import React from 'react'

import {
  BottomSheetTextInput,
  useBottomSheetInternal,
} from '@gorhom/bottom-sheet'
import { Platform, TextInput, type TextInputProps } from 'react-native'

import { cn } from '@/lib/utils'

type InputProps = Omit<TextInputProps, 'onChange'> & {
  onChange?: (text: string) => void
}

const Input = React.forwardRef<any, InputProps>(
  (
    { className, placeholderClassName, onChange, onChangeText, ...props },
    ref
  ) => {
    const bottomSheetInternal = useBottomSheetInternal(true)
    const isInBottomSheet = bottomSheetInternal !== null

    function handleChangeText(text: string) {
      onChange?.(text)
      onChangeText?.(text)
    }

    const textInputProps = {
      ref,
      className: cn(
        'flex h-10 w-full min-w-0 flex-row items-center rounded-md border border-input bg-background px-3 py-1 text-base leading-5 text-foreground shadow-sm shadow-black/5 dark:bg-input/30 sm:h-9',
        props.editable === false &&
          cn(
            'opacity-50',
            Platform.select({
              web: 'disabled:pointer-events-none disabled:cursor-not-allowed',
            })
          ),
        Platform.select({
          web: cn(
            'outline-none transition-[color,box-shadow] selection:bg-primary placeholder:text-muted-foreground md:text-sm',
            'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
            'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive'
          ),
          native: 'placeholder:text-muted-foreground/50',
        }),
        className
      ),
      onChangeText: handleChangeText,
      ...props,
    }

    if (isInBottomSheet) {
      return <BottomSheetTextInput {...textInputProps} />
    }

    return <TextInput {...textInputProps} />
  }
)

Input.displayName = 'Input'

export { Input }
