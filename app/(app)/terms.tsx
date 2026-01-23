import React from 'react'

import { Trans } from '@lingui/react/macro'
import { ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { ScreenHeader } from '@/components/ui/screen-header'
import { Text } from '@/components/ui/text'
import { TERMS_LAST_UPDATED, TERMS_OF_SERVICE } from '@/lib/legal/terms'

export default function TermsOfServiceScreen() {
  const insets = useSafeAreaInsets()

  return (
    <View className='flex-1 bg-background' style={{ paddingTop: insets.top }}>
      <ScreenHeader title={<Trans>Terms of Service</Trans>} />

      <ScrollView
        className='flex-1'
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <Text variant='muted'>
          <Trans>Last updated</Trans>: {TERMS_LAST_UPDATED}
        </Text>

        {TERMS_OF_SERVICE.map((section) => (
          <View key={section.id} className='mt-6'>
            <Text variant='h4'>{section.title}</Text>
            {section.paragraphs.map((p, idx) => (
              <Text key={`${section.id}-${idx}`} variant='p'>
                {p}
              </Text>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  )
}
