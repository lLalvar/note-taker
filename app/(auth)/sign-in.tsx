import React, { useRef, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Trans, useLingui } from '@lingui/react/macro'
import { Link } from 'expo-router'
import { Eye, EyeOff } from 'lucide-react-native'
import { useForm } from 'react-hook-form'
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
// import {
//   useGoogleSignInMutation,
//   useSignInMutation,
// } from '@/hooks/useAuthMutations'
import { z } from 'zod'

import { SocialConnections } from '@/components/social-connections'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormField,
  FormInput,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Icon } from '@/components/ui/icon'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Text } from '@/components/ui/text'

const signInSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
})

type SignInFormData = z.infer<typeof signInSchema>
// import { useGoogleAuth } from '@/services/authService'

export default function SignIn() {
  const { t } = useLingui()
  const [showPassword, setShowPassword] = useState(false)
  const passwordInputRef = React.useRef<TextInput>(null)
  const scrollViewRef = useRef<ScrollView>(null)
  // const signInMutation = useSignInMutation()
  // const googleSignInMutation = useGoogleSignInMutation()
  // const { request, response, promptAsync } = useGoogleAuth()

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  })

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form

  // useEffect(() => {
  //   if (response?.type === 'success') {
  //     const { id_token } = response.params
  //     if (id_token) {
  //       // googleSignInMutation.mutate(id_token)
  //       console.log('Google Sign-In successful with token:', id_token)
  //     }
  //   }
  // }, [response])

  const onSubmit = (data: SignInFormData) => {
    // signInMutation.mutate(data)
    console.log('Sign In Data:', data)
  }

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus()
  }

  function onEmailFocus() {
    if (Platform.OS === 'android') {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true })
      }, 300)
    }
  }

  function onPasswordFocus() {
    if (Platform.OS === 'android') {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true })
      }, 300)
    }
  }

  return (
    <SafeAreaView className='flex-1 bg-background' edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='flex-1'
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          className='flex-1 gap-8 px-4'
          contentContainerStyle={{
            flexGrow: 1,
            paddingVertical: 32,
            justifyContent: 'center',
          }}
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}
          bounces={false}
          nestedScrollEnabled={true}
        >
          <Card className='border-border/0 shadow-none sm:border-border sm:shadow-sm sm:shadow-black/5'>
            <CardHeader>
              <CardTitle className='text-center text-xl sm:text-left'>
                <Trans>Sign in to your app</Trans>
              </CardTitle>
              <CardDescription className='text-center sm:text-left'>
                <Trans>
                  Welcome back! Please sign in to continue
                  {/* Lorem ipsum dolor sit
                  amet consectetur adipisicing elit. Doloremque debitis officia
                  non sint. Neque sapiente numquam deserunt dolorum ipsum libero
                  repudiandae error fuga debitis recusandae placeat harum illum
                  quia, facilis saepe laboriosam maxime iure. Similique, impedit
                  quaerat! Temporibus excepturi consequatur perspiciatis
                  molestias sequi itaque tenetur. Quod provident nesciunt fuga
                  totam ex pariatur reprehenderit adipisci omnis architecto
                  itaque sit excepturi tenetur voluptatem, consectetur mollitia
                  nisi. Error aspernatur cumque aliquam deleniti sit! Libero
                  praesentium perferendis ipsum quod illo necessitatibus ut
                  repudiandae, consequuntur magnam, iusto rem nulla optio.
                  Pariatur eveniet beatae earum incidunt facere quae at vitae
                  blanditiis quas, iste ullam alias unde labore sequi illum quos
                  amet aspernatur repellendus omnis consectetur, animi quidem
                  magnam mollitia minus? Amet incidunt, quos vero, ratione
                  praesentium quod reiciendis in eum rerum eius nobis
                  accusantium explicabo nostrum enim ab molestiae quaerat odit
                  eaque dolorem odio, at saepe quis! Corporis, ex a porro quod
                  corrupti quas dicta dolorem tenetur obcaecati, cumque, ipsum
                  ab iste libero eos distinctio sint nostrum facilis possimus
                  dolorum eligendi. Fugit, expedita sit molestias suscipit
                  debitis commodi harum deserunt, voluptatibus possimus beatae
                  fugiat sed illum perspiciatis. Maiores, quo corporis. Magnam
                  sed eveniet quidem sunt dolor. Deleniti rerum quos pariatur
                  molestiae incidunt ratione explicabo iure quae, eos unde,
                  doloremque numquam asperiores libero cumque corporis harum
                  eius, voluptate natus! Consequatur impedit, maxime iusto
                  ratione exercitationem assumenda quaerat quidem corporis quo
                  optio, accusantium repellendus tempora. Accusantium ut vel
                  suscipit quod praesentium illo aliquid doloribus. Magnam amet
                  itaque reprehenderit tenetur! Atque cum adipisci incidunt
                  impedit quidem ab delectus aperiam numquam ea recusandae, fuga
                  alias illo, tempore dolores est. Quae necessitatibus doloribus
                  officia quos error aliquam deleniti harum aliquid, corrupti
                  deserunt! Voluptatem inventore quos necessitatibus assumenda,
                  tenetur sint accusantium, aut laudantium odio cum perspiciatis
                  alias aliquam tempora, minus quam nobis ad repudiandae neque
                  et harum ducimus. Modi saepe consequuntur magni, odit quisquam
                  excepturi laborum minima adipisci ullam corrupti obcaecati
                  esse nihil repellendus debitis sit, veniam eum reiciendis
                  suscipit? Repellat architecto velit eaque, magnam provident,
                  cum molestiae sunt voluptatum doloremque, dicta id possimus
                  beatae at unde fugit omnis iusto adipisci debitis laboriosam
                  fuga molestias quae consectetur illum. At sit beatae ea alias
                  perferendis, nulla nihil, obcaecati sed, mollitia adipisci
                  natus itaque laborum pariatur voluptate voluptatem totam
                  tempore! Similique rerum ea ab sit voluptatem blanditiis
                  itaque fugit at iusto animi, totam eveniet accusantium sed
                  recusandae, neque architecto hic dolorem eaque ratione. Fugiat
                  obcaecati minus dolore vitae rem ipsum nesciunt nisi magni
                  consequuntur! */}
                </Trans>
              </CardDescription>
            </CardHeader>
            <CardContent className='gap-6'>
              <Form {...form}>
                <View className='gap-6'>
                  {/* Email Field */}
                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormInput
                        {...field}
                        name='email'
                        label={t`Email`}
                        placeholder={t`m@example.com`}
                        keyboardType='email-address'
                        autoComplete='email'
                        autoCapitalize='none'
                        // value={field.value}
                        // onChange={field.onChange}
                        // onBlur={field.onBlur}
                        onFocus={onEmailFocus}
                        onSubmitEditing={onEmailSubmitEditing}
                        returnKeyType='next'
                        submitBehavior='submit'
                      />
                    )}
                  />

                  {/* Password Field */}
                  <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                      <FormItem>
                        <View className='flex-row items-center justify-between'>
                          <FormLabel>
                            <Trans>Password</Trans>
                          </FormLabel>
                          <Link href='/(auth)/forgot-password' asChild>
                            <Button variant='link' size='sm'>
                              <Text className='native:text-sm pb-2'>
                                <Trans>Forgot your password?</Trans>
                              </Text>
                            </Button>
                          </Link>
                        </View>
                        <View className='relative'>
                          <Input
                            {...field}
                            ref={passwordInputRef}
                            placeholder={t`Enter your password`}
                            secureTextEntry={!showPassword}
                            // value={field.value}
                            // onChangeText={field.onChange}
                            // onBlur={field.onBlur}
                            onFocus={onPasswordFocus}
                            returnKeyType='send'
                            onSubmitEditing={handleSubmit(onSubmit)}
                            className='pr-10'
                          />
                          <Pressable
                            onPress={() => setShowPassword(!showPassword)}
                            style={{
                              position: 'absolute',
                              right: 12,
                              top: '50%',
                              transform: [{ translateY: -10 }],
                            }}
                          >
                            {showPassword ? (
                              <Icon
                                as={EyeOff}
                                size={20}
                                className='text-muted-foreground'
                              />
                            ) : (
                              <Icon
                                as={Eye}
                                size={20}
                                className='text-muted-foreground'
                              />
                            )}
                          </Pressable>
                        </View>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Sign In Button */}
                  <Button
                    className='w-full'
                    onPress={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                  >
                    <Text>
                      <Trans>Continue</Trans>
                    </Text>
                  </Button>
                </View>
              </Form>

              {/* Sign Up Link */}
              <View className='flex-row items-center justify-center'>
                <Text className='text-center text-sm'>
                  <Trans>Don&apos;t have an account?</Trans>
                </Text>
                <Link href='/(auth)/sign-up' asChild>
                  <Button variant='link' size='sm'>
                    <Text className='native:text-sm'>
                      <Trans>Sign up</Trans>
                    </Text>
                  </Button>
                </Link>
              </View>

              {/* Divider */}
              <View className='flex-row items-center'>
                <Separator className='flex-1' />
                <Text className='px-4 text-sm text-muted-foreground'>
                  <Trans>or</Trans>
                </Text>
                <Separator className='flex-1' />
              </View>

              {/* Social Connections */}
              <SocialConnections />
            </CardContent>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
