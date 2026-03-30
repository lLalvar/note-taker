import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react'

import {
  type EditorTheme,
  PlaceholderBridge,
  RichText,
  TenTapStartKit,
  Toolbar,
  useEditorBridge,
} from '@10play/tentap-editor'
// import { Palette } from 'lucide-react-native'
import { KeyboardAvoidingView, Platform, View } from 'react-native'
import { useDebouncedCallback } from 'use-debounce'

// import { TextColorPicker } from '@/components/editor/text-color-picker'
// import { BottomSheet } from '@/components/ui/bottom-sheet'
// import { Icon } from '@/components/ui/icon'
import { useTheme } from '@/hooks/use-theme'
import { cn, toHsla } from '@/lib/utils'

/** Strip inline color from HTML so text uses theme foreground (light/dark). */
function stripColorFromHtml(html: string): string {
  return html
    .replace(/style="([^"]*)"/gi, (_, styleContent) => {
      const newStyle = styleContent
        .replace(/\bcolor\s*:\s*[^;]+;?\s*/gi, '')
        .trim()
      return newStyle ? `style="${newStyle}"` : ''
    })
    .replace(/\s*style=""\s*/g, ' ')
}

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

    // Debounced callback to get HTML from editor (strip color so text uses theme)
    const handleEditorChange = useDebouncedCallback(() => {
      if (onChangeRef.current) {
        editor.getHTML().then((html) => {
          const stripped = stripColorFromHtml(html)
          lastEmittedHtml.current = stripped
          onChangeRef.current?.(stripped)
        })
      }
    }, 300)

    const bridgeExtensions = useMemo(
      () => [
        ...TenTapStartKit,
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

    useImperativeHandle(ref, () => ({
      blur: () => {
        editor.blur()
      },
    }))

    // Inject theme text color into WebView so content uses foreground (white in dark, black in light)
    const injectThemeColor = useCallback(() => {
      if (!editor?.injectCSS) return
      const css = `
        .ProseMirror, .ProseMirror * {
          color: ${colors.foreground} !important;
        }
      `
      editor.injectCSS(css, 'theme-foreground')
    }, [editor, colors.foreground])

    useEffect(() => {
      if (!editor?.injectCSS) return
      const id = setTimeout(injectThemeColor, 300)
      return () => clearTimeout(id)
    }, [editor, injectThemeColor])

    // Update editor when value prop changes externally (e.g., form reset, loading note)
    useEffect(() => {
      const updateContent = async () => {
        // Normalize and strip color so text always uses theme foreground
        const normalizedValue = value
          ? value.startsWith('<')
            ? value
            : `<p>${value}</p>`
          : ''
        const valueWithoutColor = stripColorFromHtml(normalizedValue)

        // If the value matches what we just emitted, don't update
        if (valueWithoutColor === lastEmittedHtml.current) {
          return
        }

        const currentContent = await editor.getHTML()
        if (currentContent !== valueWithoutColor) {
          await editor.setContent(valueWithoutColor)
        }
      }

      updateContent()
    }, [value, editor])

    return (
      <View className={cn('flex-1', className)}>
        <RichText
          editor={editor}
          onLoad={injectThemeColor}
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
              {/* Text color picker - commented out for now
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
              */}
            </View>
          </KeyboardAvoidingView>
        )}
      </View>
    )
  }
)

RichTextEditor.displayName = 'RichTextEditor'
