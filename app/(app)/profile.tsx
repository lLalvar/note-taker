import React, { useState } from 'react'

import { Trans } from '@lingui/react/macro'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { ProfileContent } from '@/components/profile/profile-content'
import { Button } from '@/components/ui/button'
import { ScreenHeader } from '@/components/ui/screen-header'
import { Text } from '@/components/ui/text'

export default function Profile() {
  const insets = useSafeAreaInsets()
  const [editControls, setEditControls] = useState<{
    isEditMode: boolean
    onEdit: () => void
    onCancel: () => void
    onSave: () => void
    isPending: boolean
  } | null>(null)

  return (
    <View className='flex-1 bg-background' style={{ paddingTop: insets.top }}>
      <ScreenHeader
        title={<Trans>Profile</Trans>}
        rightAction={
          editControls &&
          !editControls.isEditMode && (
            <Button variant='ghost' onPress={editControls.onEdit}>
              <Text>
                <Trans>Edit</Trans>
              </Text>
            </Button>
          )
        }
      />
      <ProfileContent onEditControls={setEditControls} />
    </View>
  )
}
