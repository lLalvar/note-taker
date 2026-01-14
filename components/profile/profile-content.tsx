import React, { useEffect, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Trans, useLingui } from '@lingui/react/macro'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Mail } from 'lucide-react-native'
import { useForm } from 'react-hook-form'
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { z } from 'zod'

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

const profileSchema = z.object({
  displayName: z
    .string()
    .min(1, 'Display name is required')
    .max(50, 'Display name must be less than 50 characters'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

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
  const { colors } = useTheme()
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const insets = useSafeAreaInsets()
  const [isEditMode, setIsEditMode] = useState(false)

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

  useEffect(() => {
    if (profile && !isEditMode) {
      form.reset({
        displayName: profile.displayName || '',
        bio: profile.bio || '',
      })
    }
  }, [profile, isEditMode, form])

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
      setIsEditMode(false)
      Alert.alert('Success', 'Profile updated successfully')
    },
    onError: (error: unknown) => {
      console.error('Profile update error:', error)
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to update profile. Please try again.'
      Alert.alert('Error', errorMessage)
    },
  })

  const handleEdit = () => {
    setIsEditMode(true)
  }

  const handleCancel = () => {
    if (profile) {
      form.reset({
        displayName: profile.displayName || '',
        bio: profile.bio || '',
      })
    }
    setIsEditMode(false)
  }

  const handleSubmit = (values: ProfileFormData) => {
    updateMutation.mutate(values)
  }

  useEffect(() => {
    if (onEditControls && profile) {
      onEditControls({
        isEditMode,
        onEdit: handleEdit,
        onCancel: handleCancel,
        onSave: () => form.handleSubmit(handleSubmit)(),
        isPending: updateMutation.isPending,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, onEditControls, profile, updateMutation.isPending])

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
            headerActions ||
            (!isEditMode && (
              <Button variant='ghost' onPress={handleEdit}>
                <Text>
                  <Trans>Edit</Trans>
                </Text>
              </Button>
            ))
          }
        />
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='flex-1'
      >
        <ScrollView
          className='flex-1'
          contentContainerStyle={{
            paddingVertical: 24,
            paddingHorizontal: 16,
            gap: 24,
          }}
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle>
                {isEditMode ? (
                  <Trans>Edit Profile</Trans>
                ) : (
                  <Trans>Profile Information</Trans>
                )}
              </CardTitle>
              <CardDescription>
                {isEditMode ? (
                  <Trans>Update your profile information</Trans>
                ) : (
                  <Trans>Your account details</Trans>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className='gap-6'>
              {isEditMode ? (
                <Form {...form}>
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
                </Form>
              ) : (
                <View className='gap-4'>
                  <View className='gap-2'>
                    <Text className='text-sm font-medium text-muted-foreground'>
                      <Trans>Display Name</Trans>
                    </Text>
                    <Text className='text-base'>
                      {profile.displayName || '—'}
                    </Text>
                  </View>

                  {profile.email && (
                    <View className='gap-2'>
                      <Text className='text-sm font-medium text-muted-foreground'>
                        <Trans>Email</Trans>
                      </Text>
                      <View className='flex-row items-center gap-2'>
                        <Icon
                          as={Mail}
                          className='size-4 text-muted-foreground'
                        />
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
              )}
            </CardContent>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
      {isEditMode && (
        <View
          className='border-t border-border bg-card px-4 py-3'
          style={{
            paddingBottom: Math.max(insets.bottom, 12),
          }}
        >
          <View className='flex-row gap-3'>
            <Button
              variant='outline'
              className='flex-1'
              onPress={handleCancel}
              disabled={updateMutation.isPending}
            >
              <Text>
                <Trans>Cancel</Trans>
              </Text>
            </Button>
            <Button
              className='flex-1'
              onPress={() => form.handleSubmit(handleSubmit)()}
              loading={updateMutation.isPending}
              disabled={updateMutation.isPending}
            >
              <Text>
                <Trans>Save</Trans>
              </Text>
            </Button>
          </View>
        </View>
      )}
    </>
  )
}
