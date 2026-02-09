import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react'

import {
  ColorBridge,
  type EditorTheme,
  PlaceholderBridge,
  RichText,
  TenTapStartKit,
  Toolbar,
  useBridgeState,
  useEditorBridge,
} from '@10play/tentap-editor'
import { Palette } from 'lucide-react-native'
import { KeyboardAvoidingView, Platform, Pressable, View } from 'react-native'
import { useDebouncedCallback } from 'use-debounce'

import { TextColorPicker } from '@/components/editor/text-color-picker'
import { BottomSheet } from '@/components/ui/bottom-sheet'
import { Icon } from '@/components/ui/icon'
import { useTheme } from '@/hooks/use-theme'
import { cn, toHsla } from '@/lib/utils'

interface RichTextEditorProps {
  value?: string
  onChange?: (html: string) => void
  placeholder?: string
  editable?: boolean
  className?: string
}

export interface RichTextEditorHandle {
  blur: () => void
}

function createEditorTheme(
  colors: ReturnType<typeof useTheme>['colors'],
  isDark: boolean
): EditorTheme {
  return {
    toolbar: {
      toolbarBody: {
        backgroundColor: colors.card,
        borderTopColor: colors.input,
        borderBottomColor: colors.input,
        borderColor: colors.input,
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 8,
        // borderTopWidth: 1,
        // borderBottomWidth: 1,
      },
      toolbarButton: {
        backgroundColor: 'transparent',
      },
      icon: {
        tintColor: colors.foreground,
      },
      iconActive: {
        borderRadius: 8,
        tintColor: colors.primary,
      },
      iconDisabled: {
        tintColor: toHsla(colors.mutedForeground, 0.5),
      },
      iconWrapper: {
        backgroundColor: 'transparent',
      },
      iconWrapperActive: {
        backgroundColor: colors.muted,
      },
      iconWrapperDisabled: {
        backgroundColor: 'transparent',
      },
      hidden: {
        display: 'none',
      },
      keyboardAvoidingView: {},
      linkBarTheme: {
        addLinkContainer: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },
        linkInput: {
          color: colors.foreground,
          backgroundColor: colors.background,
          borderColor: colors.border,
          borderWidth: 1,
        },
        placeholderTextColor: colors.mutedForeground,
        doneButton: {
          backgroundColor: colors.primary,
        },
        doneButtonText: {
          color: colors.primaryForeground,
        },
        linkToolbarButton: {
          backgroundColor: 'transparent',
        },
      },
    },
    webview: {
      backgroundColor: 'transparent',
    },
    webviewContainer: {
      backgroundColor: isDark ? toHsla(colors.input, 0.3) : colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      paddingHorizontal: 8,
      paddingVertical: 4,
      marginBottom: 8,
    },
  }
}

export const RichTextEditor = forwardRef<
  RichTextEditorHandle,
  RichTextEditorProps
>(
  (
    {
      value = '',
      onChange,
      placeholder = 'Write something...',
      editable = true,
      className,
    },
    ref
  ) => {
    const { colors, isDark } = useTheme()
    const onChangeRef = useRef(onChange)
    const lastEmittedHtml = useRef<string | undefined>(undefined)

    // Create editor theme from app theme colors
    const editorTheme = useMemo(
      () => createEditorTheme(colors, isDark),
      [colors, isDark]
    )

    // Keep onChange ref up to date
    useEffect(() => {
      onChangeRef.current = onChange
    }, [onChange])

    // Debounced callback to get HTML from editor
    const handleEditorChange = useDebouncedCallback(() => {
      if (onChangeRef.current) {
        editor.getHTML().then((html) => {
          lastEmittedHtml.current = html
          onChangeRef.current?.(html)
        })
      }
    }, 300)

    const bridgeExtensions = useMemo(
      () => [
        ...TenTapStartKit,
        ColorBridge,
        PlaceholderBridge.configureExtension({
          placeholder,
        }),
      ],
      [placeholder]
    )

    const editor = useEditorBridge({
      // autofocus: false,
      avoidIosKeyboard: true,
      editable,
      bridgeExtensions,
      theme: editorTheme,
      onChange: handleEditorChange,
    })

    const editorState = useBridgeState(editor)
    const colorSheetRef = useRef<React.ComponentRef<typeof BottomSheet>>(null)

    const setDefaultColor = useCallback(() => {
      if (editable && editor && editorState.activeColor === undefined) {
        editor.setColor(colors.foreground)
      }
    }, [editable, editor, editorState.activeColor, colors.foreground])

    useEffect(() => {
      if (editable && editor) {
        const timer = setTimeout(() => {
          setDefaultColor()
        }, 100)

        return () => clearTimeout(timer)
      }
    }, [editor, editable, setDefaultColor])

    useImperativeHandle(ref, () => ({
      blur: () => {
        editor.blur()
      },
    }))

    // Update editor when value prop changes externally (e.g., form reset, loading note)
    useEffect(() => {
      const updateContent = async () => {
        // Normalize both values for comparison
        const normalizedValue = value
          ? value.startsWith('<')
            ? value
            : `<p>${value}</p>`
          : ''

        // If the value matches what we just emitted, don't update
        // This prevents the loop where the parent updates the value prop
        // with the same content we just sent, causing a re-render/reset
        if (normalizedValue === lastEmittedHtml.current) {
          return
        }

        // Get current editor content
        const currentContent = await editor.getHTML()

        // Only update if actually different
        if (currentContent !== normalizedValue) {
          await editor.setContent(normalizedValue)

          setTimeout(() => {
            setDefaultColor()
          }, 50)
        }
      }

      updateContent()
    }, [value, editor, setDefaultColor])

    return (
      <View className={cn('flex-1', className)}>
        <RichText
          editor={editor}
          className={cn(
            'flex-1 rounded-md border border-input bg-transparent px-3 py-2 text-base !text-foreground',
            !editable && 'opacity-50'
          )}
        />

        {editable && (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <View className='flex-row items-center gap-2'>
              <View className='flex-1'>
                <Toolbar editor={editor} />
              </View>
              <Pressable
                onPress={() => {
                  editor.blur()
                  colorSheetRef.current?.present()
                }}
                className={cn(
                  'h-10 w-10 items-center justify-center rounded-lg',
                  editorState.activeColor ? 'bg-primary/10' : 'bg-transparent'
                )}
                style={{
                  borderWidth: 1,
                  borderColor: editorState.activeColor
                    ? colors.primary
                    : colors.border,
                }}
              >
                <Icon
                  as={Palette}
                  size={18}
                  color={
                    editorState.activeColor ? colors.primary : colors.foreground
                  }
                />
              </Pressable>
            </View>

            <BottomSheet ref={colorSheetRef} snapPoints={['40%']}>
              <TextColorPicker
                currentColor={editorState.activeColor}
                onColorSelect={(color) => {
                  if (color === undefined) {
                    editor.unsetColor()
                  } else {
                    editor.setColor(color)
                  }
                  colorSheetRef.current?.dismiss()
                }}
              />
            </BottomSheet>
          </KeyboardAvoidingView>
        )}
      </View>
    )
  }
)

RichTextEditor.displayName = 'RichTextEditor'
