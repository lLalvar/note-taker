import React from 'react'

import {
  BottomSheetTextInput,
  useBottomSheetInternal,
} from '@gorhom/bottom-sheet'
import { Platform, TextInput, type TextInputProps } from 'react-native'

import { cn } from '@/lib/utils'

type TextareaProps = Omit<TextInputProps, 'onChange'> & {
  onChange?: (text: string) => void
}

const Textarea = React.forwardRef<any, TextareaProps>(
  (
    {
      className,
      multiline = true,
      numberOfLines = Platform.select({ web: 2, native: 8 }),
      placeholderClassName,
      onChange,
      onChangeText,
      ...props
    },
    ref
  ) => {
    const bottomSheetInternal = useBottomSheetInternal(true)
    const isInBottomSheet = bottomSheetInternal !== null

    function handleChangeText(text: string) {
      onChange?.(text)
      onChangeText?.(text)
    }

    const textareaProps = {
      ref,
      className: cn(
        'flex min-h-16 w-full flex-row rounded-md border border-input bg-transparent px-3 py-2 text-base text-foreground shadow-sm shadow-black/5 dark:bg-input/30 md:text-sm',
        Platform.select({
          web: 'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive field-sizing-content resize-y outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed',
          native: 'placeholder:text-muted-foreground/50',
        }),
        props.editable === false && 'opacity-50',
        className
      ),
      multiline,
      numberOfLines,
      textAlignVertical: 'top' as const,
      onChangeText: handleChangeText,
      ...props,
    }

    if (isInBottomSheet) {
      return <BottomSheetTextInput {...textareaProps} />
    }

    return <TextInput {...textareaProps} />
  }
)

Textarea.displayName = 'Textarea'

export { Textarea }
