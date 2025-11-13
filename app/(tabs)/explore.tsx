import { Image } from 'expo-image'
import { Platform, StyleSheet } from 'react-native'

import { Collapsible } from '@/components/Collapsible'
import { ExternalLink } from '@/components/ExternalLink'
import ParallaxScrollView from '@/components/ParallaxScrollView'
import { ThemedView } from '@/components/ThemedView'
import { Text } from '@/components/ui/text'
import { IconSymbol } from '@/components/ui/IconSymbol'

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color='#808080'
          name='chevron.left.forwardslash.chevron.right'
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <Text variant='h1'>Explore</Text>
      </ThemedView>
      <Text variant='p'>
        This app includes example code to help you get started.
      </Text>
      <Collapsible title='File-based routing'>
        <Text variant='p'>
          This app has two screens:{' '}
          <Text variant='p' className='font-medium'>app/(tabs)/index.tsx</Text>{' '}
          and{' '}
          <Text variant='p' className='font-medium'>app/(tabs)/explore.tsx</Text>
        </Text>
        <Text variant='p'>
          The layout file in{' '}
          <Text variant='p' className='font-medium'>app/(tabs)/_layout.tsx</Text>{' '}
          sets up the tab navigator.
        </Text>
        <ExternalLink href='https://docs.expo.dev/router/introduction'>
          <Text variant='p' className='text-blue-600 underline'>Learn more</Text>
        </ExternalLink>
      </Collapsible>
      <Collapsible title='Android, iOS, and web support'>
        <Text variant='p'>
          You can open this project on Android, iOS, and the web. To open the
          web version, press <Text variant='p' className='font-medium'>w</Text>{' '}
          in the terminal running this project.
        </Text>
      </Collapsible>
      <Collapsible title='Images'>
        <Text variant='p'>
          For static images, you can use the{' '}
          <Text variant='p' className='font-medium'>@2x</Text> and{' '}
          <Text variant='p' className='font-medium'>@3x</Text> suffixes to
          provide files for different screen densities
        </Text>
        <Image
          source={require('@/assets/images/react-logo.png')}
          style={{ alignSelf: 'center' }}
        />
        <ExternalLink href='https://reactnative.dev/docs/images'>
          <Text variant='p' className='text-blue-600 underline'>Learn more</Text>
        </ExternalLink>
      </Collapsible>
      <Collapsible title='Custom fonts'>
        <Text variant='p'>
          Open <Text variant='p' className='font-medium'>app/_layout.tsx</Text>{' '}
          to see how to load{' '}
          <Text variant='p' style={{ fontFamily: 'SpaceMono' }}>
            custom fonts such as this one.
          </Text>
        </Text>
        <ExternalLink href='https://docs.expo.dev/versions/latest/sdk/font'>
          <Text variant='p' className='text-blue-600 underline'>Learn more</Text>
        </ExternalLink>
      </Collapsible>
      <Collapsible title='Light and dark mode components'>
        <Text variant='p'>
          This template has light and dark mode support. The{' '}
          <Text variant='p' className='font-medium'>useColorScheme()</Text> hook
          lets you inspect what the user&apos;s current color scheme is, and so
          you can adjust UI colors accordingly.
        </Text>
        <ExternalLink href='https://docs.expo.dev/develop/user-interface/color-themes/'>
          <Text variant='p' className='text-blue-600 underline'>Learn more</Text>
        </ExternalLink>
      </Collapsible>
      <Collapsible title='Animations'>
        <Text variant='p'>
          This template includes an example of an animated component. The{' '}
          <Text variant='p' className='font-medium'>
            components/HelloWave.tsx
          </Text>{' '}
          component uses the powerful{' '}
          <Text variant='p' className='font-medium'>
            react-native-reanimated
          </Text>{' '}
          library to create a waving hand animation.
        </Text>
        {Platform.select({
          ios: (
            <Text variant='p'>
              The{' '}
              <Text variant='p' className='font-medium'>
                components/ParallaxScrollView.tsx
              </Text>{' '}
              component provides a parallax effect for the header image.
            </Text>
          ),
        })}
      </Collapsible>
    </ParallaxScrollView>
  )
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
})
