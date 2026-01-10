import React from 'react'

import { Trans } from '@lingui/react/macro'
import { useRouter } from 'expo-router'
import { ArrowLeft, HelpCircle, Mail, MessageCircle } from 'lucide-react-native'
import { ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'

interface HelpSection {
  id: string
  title: string
  icon: typeof HelpCircle
  description: string
}

const helpSections: HelpSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: HelpCircle,
    description: 'Learn the basics of using DailyMood Journal',
  },
  {
    id: 'faq',
    title: 'Frequently Asked Questions',
    icon: MessageCircle,
    description: 'Find answers to common questions',
  },
  {
    id: 'contact',
    title: 'Contact Support',
    icon: Mail,
    description: 'Get in touch with our support team',
  },
]

export default function HelpCenter() {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  return (
    <View className='flex-1 bg-background' style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className='flex-row items-center gap-4 px-6 py-4'>
        <Button
          variant='ghost'
          size='icon'
          onPress={() => router.back()}
          className='h-10 w-10'
        >
          <Icon as={ArrowLeft} size={24} />
        </Button>
        <Text className='flex-1 text-2xl font-bold text-foreground'>
          <Trans>Help Center</Trans>
        </Text>
      </View>

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
                    <Icon as={IconComponent} className='size-5 text-primary' />
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
