import React from 'react'

import { SafeAreaView } from 'react-native-safe-area-context'

import { ProfileContent } from '@/components/profile/profile-content'

export default function ProfileScreen() {
  return (
    <SafeAreaView className='flex-1 bg-background' edges={['top']}>
      <ProfileContent showHeader />
    </SafeAreaView>
  )
}
