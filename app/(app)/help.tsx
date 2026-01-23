import React from 'react'

import { Trans, useLingui } from '@lingui/react/macro'
import { HelpCircle, Mail, MessageCircle } from 'lucide-react-native'
import { ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Icon } from '@/components/ui/icon'
import { ScreenHeader } from '@/components/ui/screen-header'
import { Text } from '@/components/ui/text'

interface HelpSection {
  id: string
  title: string
  icon: typeof HelpCircle
  description: string
}

export default function HelpCenter() {
  const { t } = useLingui()
  const insets = useSafeAreaInsets()

  const helpSections: HelpSection[] = [
    {
      id: 'getting-started',
      title: t`Getting Started`,
      icon: HelpCircle,
      description: t`Learn the basics of using DailyMood Journal`,
    },
    {
      id: 'faq',
      title: t`Frequently Asked Questions`,
      icon: MessageCircle,
      description: t`Find answers to common questions`,
    },
    {
      id: 'contact',
      title: t`Contact Support`,
      icon: Mail,
      description: t`Get in touch with our support team`,
    },
  ]

  return (
    <View className='flex-1 bg-background' style={{ paddingTop: insets.top }}>
      <ScreenHeader title={<Trans>Help Center</Trans>} />

      {/* Content */}
      <ScrollView
        className='flex-1'
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 32,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Section */}
        <View className='mb-8'>
          <Text className='mb-2 text-lg font-semibold text-foreground'>
            <Trans>Welcome to Help Center</Trans>
          </Text>
          <Text className='text-muted-foreground'>
            <Trans>
              We&apos;re here to help you get the most out of DailyMood Journal.
              Content will be available soon.
            </Trans>
          </Text>
        </View>

        {/* Help Sections */}
        <View className='gap-4'>
          {helpSections.map((section) => {
            const IconComponent = section.icon
            return (
              <View
                key={section.id}
                className='rounded-lg border border-border bg-card p-4'
              >
                <View className='mb-3 flex-row items-center gap-3'>
                  <View className='rounded-full bg-muted p-2'>
                    <Icon as={IconComponent} className='text-primary' />
                  </View>
                  <Text className='flex-1 text-lg font-semibold text-foreground'>
                    {section.title}
                  </Text>
                </View>
                <Text className='text-muted-foreground'>
                  {section.description}
                </Text>
                <View className='mt-3 rounded-md bg-muted/50 p-3'>
                  <Text className='text-sm italic text-muted-foreground'>
                    <Trans>Content coming soon...</Trans>
                  </Text>
                </View>
              </View>
            )
          })}
        </View>

        {/* Additional Info */}
        <View className='mt-8 rounded-lg border border-border bg-card p-4'>
          <Text className='mb-2 text-base font-semibold text-foreground'>
            <Trans>Need Immediate Help?</Trans>
          </Text>
          <Text className='text-muted-foreground'>
            <Trans>
              If you have an urgent question or need assistance, please check
              back soon as we&apos;re working on adding comprehensive help
              content.
            </Trans>
          </Text>
        </View>
      </ScrollView>
    </View>
  )
}
