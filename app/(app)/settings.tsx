import React, { useRef } from 'react'

import { Trans, useLingui } from '@lingui/react/macro'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import {
  ChevronRight,
  Languages,
  Lock,
  LogOut,
  Palette,
  User,
} from 'lucide-react-native'
import { ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { SettingsItem } from '@/components/settings/SettingsItem'
import { SettingsSection } from '@/components/settings/SettingsSection'
import {
  ChangePasswordSheet,
  type ChangePasswordSheetHandle,
} from '@/components/settings/change-password-sheet'
import {
  LanguagePicker,
  type LanguagePickerHandle,
} from '@/components/ui/language-picker'
import { ScreenHeader } from '@/components/ui/screen-header'
import { getThemeMetadata } from '@/lib/theme-registry'
import { canUserChangePassword, signOutUser } from '@/services/auth'
import { useAuthStore } from '@/store/auth-store'
import { useLanguageStore } from '@/store/language-store'
import { useThemeStore } from '@/store/theme-store'

const LOCALES = [
  { code: 'en' as const, label: 'English' },
  { code: 'ru' as const, label: 'Русский' },
] as const

export default function Settings() {
  const { t } = useLingui()
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { theme: selectedThemeId } = useThemeStore()
  const { locale } = useLanguageStore()
  const languagePickerRef = useRef<LanguagePickerHandle>(null)
  const changePasswordSheetRef = useRef<ChangePasswordSheetHandle>(null)
  const queryClient = useQueryClient()
  const user = useAuthStore((state) => state.user)
  const canChangePassword = canUserChangePassword(user)

  const currentTheme = getThemeMetadata(selectedThemeId)
  const currentThemeName = currentTheme?.name || selectedThemeId

  const currentLanguage =
    LOCALES.find((loc) => loc.code === locale)?.label || locale.toUpperCase()

  const handleOpenLanguageSheet = () => {
    languagePickerRef.current?.open()
  }

  const handleOpenChangePassword = () => {
    changePasswordSheetRef.current?.open()
  }

  const signOutMutation = useMutation({
    mutationFn: signOutUser,
    onSuccess: () => {
      queryClient.clear()
      router.replace('/(auth)/sign-in')
    },
    onError: (error) => {
      console.log(error)
    },
  })

  const handleSignOut = () => {
    signOutMutation.mutate()
  }

  return (
    <View className='flex-1 bg-background' style={{ paddingTop: insets.top }}>
      <ScreenHeader title={<Trans>Settings</Trans>} />

      {/* Content */}
      <ScrollView
        className='flex-1 gap-6'
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 32,
          gap: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Appearance Section */}
        <SettingsSection title={t`Appearance`}>
          <SettingsItem
            icon={Palette}
            title={t`Theme`}
            description={currentThemeName}
            onPress={() => router.push('/(app)/theme')}
            rightIcon={ChevronRight}
          />
          <SettingsItem
            icon={Languages}
            title={t`Language`}
            description={currentLanguage}
            onPress={handleOpenLanguageSheet}
            rightIcon={ChevronRight}
          />
        </SettingsSection>

        {/* Account Section */}
        <SettingsSection title={t`Account`}>
          <SettingsItem
            icon={User}
            title={t`Profile`}
            onPress={() => router.push('/(app)/profile')}
            rightIcon={ChevronRight}
          />
          {canChangePassword && (
            <SettingsItem
              icon={Lock}
              title={t`Change Password`}
              onPress={handleOpenChangePassword}
              rightIcon={ChevronRight}
            />
          )}
          <SettingsItem
            icon={LogOut}
            title={t`Sign Out`}
            onPress={handleSignOut}
            disabled={signOutMutation.isPending}
          />
        </SettingsSection>
      </ScrollView>

      {/* Language Selection Bottom Sheet */}
      <LanguagePicker ref={languagePickerRef} />
      <ChangePasswordSheet ref={changePasswordSheetRef} />
    </View>
  )
}
