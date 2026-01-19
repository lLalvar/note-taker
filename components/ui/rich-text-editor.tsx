import React, { useEffect, useMemo, useRef } from 'react'

import {
  CodeBridge,
  type EditorTheme,
  PlaceholderBridge,
  RichText,
  TenTapStartKit,
  Toolbar,
  darkEditorCss,
  useEditorBridge,
} from '@10play/tentap-editor'
import { KeyboardAvoidingView, Platform, View } from 'react-native'
import { useDebouncedCallback } from 'use-debounce'

import { useTheme } from '@/hooks/use-theme'
import { cn, toHsla } from '@/lib/utils'

interface RichTextEditorProps {
  value?: string
  onChange?: (html: string) => void
  placeholder?: string
  editable?: boolean
  className?: string
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

export function RichTextEditor({
  value = '',
  onChange,
  placeholder = 'Write something...',
  editable = true,
  className,
}: RichTextEditorProps) {
  const { colors, isDark } = useTheme()
  const isSettingContent = useRef(false)
  const onChangeRef = useRef(onChange)

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
    // Don't trigger onChange if we're setting content programmatically
    if (isSettingContent.current) {
      return
    }

    if (onChangeRef.current) {
      editor.getHTML().then((html) => {
        onChangeRef.current?.(html)
      })
    }
  }, 300)

  const customCodeBlockCSS = `
code {
    background-color: #ffdede;
    border-radius: 0.25em;
    border-color: #e45d5d;
    border-width: 1px;
    border-style: solid;
    box-decoration-break: clone;
    color: #cd4242;
    font-size: 0.9rem;
    padding: 0.25em;
}
`

  const editor = useEditorBridge({
    // autofocus: false,
    avoidIosKeyboard: true,
    editable,
    bridgeExtensions: [
      ...TenTapStartKit,
      PlaceholderBridge.configureExtension({
        placeholder,
      }),
      CodeBridge.configureCSS(customCodeBlockCSS),
    ],
    theme: editorTheme,
    onChange: handleEditorChange,
  })

  // Update editor when value prop changes externally (e.g., form reset, loading note)
  useEffect(() => {
    const updateContent = async () => {
      // Get current editor content
      const currentContent = await editor.getHTML()

      // Normalize both values for comparison
      const normalizedValue = value
        ? value.startsWith('<')
          ? value
          : `<p>${value}</p>`
        : ''

      // Only update if actually different
      if (currentContent !== normalizedValue) {
        isSettingContent.current = true
        await editor.setContent(normalizedValue)
        // Small delay to ensure the content is set before allowing onChange
        setTimeout(() => {
          isSettingContent.current = false
        }, 100)
      }
    }

    updateContent()
  }, [value, editor])

  return (
    <View className={cn('flex-1', className)}>
      <RichText
        editor={editor}
        // className={cn(
        //   'flex-1 rounded-md border border-input bg-transparent px-3 py-2 text-base text-foreground',
        //   !editable && 'opacity-50'
        // )}
      />

      {editable && (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <Toolbar editor={editor} />
        </KeyboardAvoidingView>
      )}
    </View>
  )
}
