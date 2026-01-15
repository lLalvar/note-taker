import React, { forwardRef, useImperativeHandle, useRef } from 'react'

import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trans, useLingui } from '@lingui/react/macro'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Keyboard, View } from 'react-native'
import { toast } from 'sonner-native'
import { z } from 'zod'

import { BottomSheet } from '@/components/ui/bottom-sheet'
import { Button } from '@/components/ui/button'
import { Form, FormField, FormInput } from '@/components/ui/form'
import { Text } from '@/components/ui/text'
import { getAuthErrorMessage } from '@/lib/utils'
import { reauthenticateUser, updateUserPassword } from '@/services/auth'

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>

export interface ChangePasswordSheetHandle {
  open: () => void
  close: () => void
}

export const ChangePasswordSheet = forwardRef<ChangePasswordSheetHandle>(
  (_, ref) => {
    const { t } = useLingui()
    const bottomSheetRef = useRef<BottomSheetModal>(null)

    const form = useForm<ChangePasswordFormData>({
      resolver: zodResolver(changePasswordSchema),
      defaultValues: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      },
    })

    useImperativeHandle(ref, () => ({
      open: () => {
        form.reset({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        })
        bottomSheetRef.current?.present()
      },
      close: () => {
        bottomSheetRef.current?.dismiss()
      },
    }))

    const updatePasswordMutation = useMutation({
      mutationFn: async (data: ChangePasswordFormData) => {
        // 1. Re-authenticate
        await reauthenticateUser(data.currentPassword)
        // 2. Update password
        await updateUserPassword(data.newPassword)
      },
      onSuccess: () => {
        toast.success(t`Password updated successfully`)
        bottomSheetRef.current?.dismiss()
        form.reset()
      },
      onError: (error) => {
        const errorMessage = getAuthErrorMessage(error)
        toast.error(t`Failed to update password`, {
          description: errorMessage,
        })
      },
    })

    const onSubmit = (data: ChangePasswordFormData) => {
      Keyboard.dismiss()
      updatePasswordMutation.mutate(data)
    }

    return (
      <BottomSheet ref={bottomSheetRef} title={t`Change Password`}>
        <View className='gap-6 px-4 pb-8'>
          <Text className='text-lg font-semibold'>
            <Trans>Change Password</Trans>
          </Text>
          <Form {...form}>
            <View className='gap-4'>
              <FormField
                control={form.control}
                name='currentPassword'
                render={({ field }) => (
                  <FormInput
                    {...field}
                    label={t`Current Password`}
                    placeholder={t`Enter current password`}
                    secureTextEntry
                  />
                )}
              />
              <FormField
                control={form.control}
                name='newPassword'
                render={({ field }) => (
                  <FormInput
                    {...field}
                    label={t`New Password`}
                    placeholder={t`Enter new password`}
                    secureTextEntry
                  />
                )}
              />
              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormInput
                    {...field}
                    label={t`Confirm New Password`}
                    placeholder={t`Confirm new password`}
                    secureTextEntry
                    onSubmitEditing={form.handleSubmit(onSubmit)}
                  />
                )}
              />
            </View>
            <Button
              className='mt-4'
              onPress={form.handleSubmit(onSubmit)}
              loading={updatePasswordMutation.isPending}
            >
              <Text>
                {updatePasswordMutation.isPending
                  ? t`Updating...`
                  : t`Update Password`}
              </Text>
            </Button>
          </Form>
        </View>
      </BottomSheet>
    )
  }
)

ChangePasswordSheet.displayName = 'ChangePasswordSheet'
