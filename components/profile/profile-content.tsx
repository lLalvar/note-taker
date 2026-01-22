import React, { useEffect, useRef } from 'react'

import { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trans, useLingui } from '@lingui/react/macro'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Mail } from 'lucide-react-native'
import { useForm } from 'react-hook-form'
import { ActivityIndicator, ScrollView, View } from 'react-native'
import { toast } from 'sonner-native'
import { z } from 'zod'

import { BottomSheet } from '@/components/ui/bottom-sheet'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Form, FormField, FormInput, FormTextarea } from '@/components/ui/form'
import { Icon } from '@/components/ui/icon'
import { ScreenHeader } from '@/components/ui/screen-header'
import { Text } from '@/components/ui/text'
import { useAuth } from '@/hooks/use-auth'
import { useTheme } from '@/hooks/use-theme'
import {
  type ProfileUpdateData,
  getUserProfile,
  updateUserProfile,
} from '@/services/profile'

const getProfileSchema = (
  t: (template: TemplateStringsArray, ...args: any[]) => string
) =>
  z.object({
    displayName: z
      .string()
      .min(1, t`Display name is required`)
      .max(50, t`Display name must be less than 50 characters`),
    bio: z
      .string()
      .max(500, t`Bio must be less than 500 characters`)
      .optional(),
  })

type ProfileFormData = z.infer<ReturnType<typeof getProfileSchema>>

interface ProfileContentProps {
  showHeader?: boolean
  headerActions?: React.ReactNode
  onEditControls?: (props: {
    isEditMode: boolean
    onEdit: () => void
    onCancel: () => void
    onSave: () => void
    isPending: boolean
  }) => void
}

export function ProfileContent({
  showHeader = false,
  headerActions,
  onEditControls,
}: ProfileContentProps) {
  const { t } = useLingui()
  const profileSchema = getProfileSchema(t)
  const { colors } = useTheme()
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const editSheetRef = useRef<React.ComponentRef<typeof BottomSheet>>(null)

  const {
    data: profile,
    isLoading: isLoadingProfile,
    isError: isProfileError,
  } = useQuery({
    queryKey: ['profile'],
    queryFn: getUserProfile,
    enabled: !!user,
  })

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: '',
      bio: '',
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const updateData: ProfileUpdateData = {
        displayName: data.displayName,
        bio: data.bio || '',
      }
      return updateUserProfile(updateData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      editSheetRef.current?.dismiss()
      toast.success(t`Profile updated successfully`)
    },
    onError: (error: unknown) => {
      console.error('Profile update error:', error)
      const errorMessage =
        error instanceof Error
          ? error.message
          : t`Failed to update profile. Please try again.`
      toast.error(t`Error`, {
        description: errorMessage,
      })
    },
  })

  const handleEdit = () => {
    // Reset form to current profile values before opening
    if (profile) {
      form.reset({
        displayName: profile.displayName || '',
        bio: profile.bio || '',
      })
    }
    editSheetRef.current?.present()
  }

  const handleCancel = () => {
    // Reset form to current profile values
    if (profile) {
      form.reset({
        displayName: profile.displayName || '',
        bio: profile.bio || '',
      })
    }
    editSheetRef.current?.dismiss()
  }

  const handleSubmit = (values: ProfileFormData) => {
    updateMutation.mutate(values)
  }

  useEffect(() => {
    if (onEditControls && profile) {
      onEditControls({
        isEditMode: false,
        onEdit: handleEdit,
        onCancel: handleCancel,
        onSave: () => form.handleSubmit(handleSubmit)(),
        isPending: updateMutation.isPending,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onEditControls, profile, updateMutation.isPending])

  if (!user) {
    return (
      <View className='flex-1 items-center justify-center px-4'>
        <Text variant='h2' className='mb-2 text-center'>
          <Trans>Not authenticated</Trans>
        </Text>
        <Text className='text-center text-muted-foreground'>
          <Trans>Please sign in to view your profile</Trans>
        </Text>
      </View>
    )
  }

  if (isLoadingProfile) {
    return (
      <View className='flex-1 items-center justify-center'>
        <ActivityIndicator size='large' color={colors.primary} />
        <Text className='mt-4 text-muted-foreground'>
          <Trans>Loading profile...</Trans>
        </Text>
      </View>
    )
  }

  if (isProfileError || !profile) {
    return (
      <View className='flex-1 items-center justify-center px-4'>
        <Text variant='h2' className='mb-2 text-center'>
          <Trans>Error loading profile</Trans>
        </Text>
        <Text className='mb-4 text-center text-muted-foreground'>
          <Trans>Please try again later</Trans>
        </Text>
        <Button
          onPress={() =>
            queryClient.invalidateQueries({ queryKey: ['profile'] })
          }
        >
          <Trans>Retry</Trans>
        </Button>
      </View>
    )
  }

  return (
    <>
      {showHeader && (
        <ScreenHeader
          title={<Trans>Profile</Trans>}
          showBackButton={false}
          rightAction={
            headerActions || (
              <Button variant='ghost' onPress={handleEdit}>
                <Text>
                  <Trans>Edit</Trans>
                </Text>
              </Button>
            )
          }
        />
      )}

      <ScrollView
        contentContainerStyle={{
          padding: 16,
          gap: 24,
        }}
        keyboardShouldPersistTaps='handled'
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Trans>Profile Information</Trans>
            </CardTitle>
            <CardDescription>
              <Trans>Your account details</Trans>
            </CardDescription>
          </CardHeader>
          <CardContent className='gap-6'>
            <View className='gap-4'>
              <View className='gap-2'>
                <Text className='text-sm font-medium text-muted-foreground'>
                  <Trans>Display Name</Trans>
                </Text>
                <Text className='text-base'>{profile.displayName || '—'}</Text>
              </View>

              {profile.email && (
                <View className='gap-2'>
                  <Text className='text-sm font-medium text-muted-foreground'>
                    <Trans>Email</Trans>
                  </Text>
                  <View className='flex-row items-center gap-2'>
                    <Icon as={Mail} className='size-4 text-muted-foreground' />
                    <Text className='text-base'>{profile.email}</Text>
                  </View>
                </View>
              )}

              <View className='gap-2'>
                <Text className='text-sm font-medium text-muted-foreground'>
                  <Trans>Bio</Trans>
                </Text>
                <Text className='text-base'>
                  {profile.bio || (
                    <Text className='text-muted-foreground'>
                      <Trans>No bio added yet</Trans>
                    </Text>
                  )}
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>
      </ScrollView>

      {/* Edit Profile Bottom Sheet */}
      <BottomSheet
        ref={editSheetRef}
        snapPoints={['90%']}
        keyboardBehavior='extend'
      >
        <BottomSheetScrollView
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
          keyboardShouldPersistTaps='handled'
        >
          <View className='mb-4 gap-2'>
            <Text className='text-lg font-semibold text-foreground'>
              <Trans>Edit Profile</Trans>
            </Text>
            <Text className='text-sm text-muted-foreground'>
              <Trans>Update your profile information</Trans>
            </Text>
          </View>

          <Form {...form}>
            <View className='mb-4 gap-4'>
              <FormField
                control={form.control}
                name='displayName'
                render={({ field }) => (
                  <FormInput
                    {...field}
                    label={t`Display Name`}
                    placeholder={t`Enter your display name`}
                  />
                )}
              />

              <FormField
                control={form.control}
                name='bio'
                render={({ field }) => (
                  <FormTextarea
                    {...field}
                    value={field.value || ''}
                    label={t`Bio`}
                    placeholder={t`Tell us about yourself...`}
                    numberOfLines={4}
                    description={t`Maximum 500 characters`}
                  />
                )}
              />
            </View>

            <View className='flex-col gap-2'>
              <Button
                onPress={() => form.handleSubmit(handleSubmit)()}
                loading={updateMutation.isPending}
              >
                <Text>
                  {updateMutation.isPending ? (
                    <Trans>Saving...</Trans>
                  ) : (
                    <Trans>Save</Trans>
                  )}
                </Text>
              </Button>
              <Button
                variant='outline'
                onPress={handleCancel}
                disabled={updateMutation.isPending}
              >
                <Text>
                  <Trans>Cancel</Trans>
                </Text>
              </Button>
            </View>
          </Form>
        </BottomSheetScrollView>
      </BottomSheet>
    </>
  )
}
