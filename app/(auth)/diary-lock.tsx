import React, { useCallback, useEffect, useRef, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Trans, useLingui } from '@lingui/react/macro'
import { useMutation } from '@tanstack/react-query'
import { router } from 'expo-router'
import { Eye, EyeOff, Fingerprint, Lock } from 'lucide-react-native'
import { useForm } from 'react-hook-form'
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Form, FormField, FormInput } from '@/components/ui/form'
import { Icon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'
import {
  type UnlockPasswordFormData,
  type UnlockPinFormData,
  unlockPasswordSchema,
  unlockPinSchema,
} from '@/lib/validation-schemas'
import {
  authenticateWithBiometric,
  getLockType,
  getSecurityQuestion,
  hasLockEnabled,
  isBiometricAvailable,
  verifyPassword,
  verifyPin,
  verifySecurityAnswer,
} from '@/services/diary-lock'
import { useDiaryLockStore } from '@/store/diary-lock-store'

export default function DiaryLock() {
  const { t } = useLingui()
  const [showPassword, setShowPassword] = useState(false)
  const [showSecurityQuestion, setShowSecurityQuestion] = useState(false)
  const [securityQuestion, setSecurityQuestion] = useState<string | null>(null)
  const [securityAnswer, setSecurityAnswer] = useState('')
  const [biometricAvailable, setBiometricAvailable] = useState(false)
  const passwordInputRef = useRef<TextInput>(null)
  const scrollViewRef = useRef<ScrollView>(null)

  const { lockType, biometricEnabled, hasLock, setLocked, initialize } =
    useDiaryLockStore()

  // Determine lock type
  const currentLockType = lockType !== 'none' ? lockType : getLockType()
  const lockTypeLabel = currentLockType === 'password' ? 'password' : 'PIN'

  // Setup form based on lock type
  const passwordForm = useForm<UnlockPasswordFormData>({
    resolver: zodResolver(unlockPasswordSchema),
    defaultValues: {
      password: '',
    },
  })

  const pinForm = useForm<UnlockPinFormData>({
    resolver: zodResolver(unlockPinSchema),
    defaultValues: {
      pin: '',
    },
  })

  // Biometric authentication
  const handleBiometricAuth = useCallback(async () => {
    try {
      const success = await authenticateWithBiometric()
      if (success) {
        setLocked(false)
        router.replace('/(app)/(tabs)')
      }
    } catch (error) {
      console.error('Biometric authentication error:', error)
    }
  }, [setLocked])

  // Initialize component
  useEffect(() => {
    const init = async () => {
      await initialize()

      // Check if lock is enabled
      if (!hasLockEnabled() || !hasLock) {
        router.replace('/(app)/(tabs)')
        return
      }

      // Check biometric availability
      const available = await isBiometricAvailable()
      setBiometricAvailable(available)

      // Load security question
      const question = await getSecurityQuestion()
      setSecurityQuestion(question)

      // Auto-trigger biometric if enabled
      if (biometricEnabled && available) {
        handleBiometricAuth()
      }
    }

    init()
  }, [initialize, hasLock, biometricEnabled, handleBiometricAuth])

  // Unlock mutation
  const unlockMutation = useMutation({
    mutationFn: async (data: UnlockPasswordFormData | UnlockPinFormData) => {
      if (currentLockType === 'password') {
        const isValid = await verifyPassword(
          (data as UnlockPasswordFormData).password
        )
        if (!isValid) {
          throw new Error('Invalid password')
        }
      } else {
        const isValid = await verifyPin((data as UnlockPinFormData).pin)
        if (!isValid) {
          throw new Error('Invalid PIN')
        }
      }
    },
    onSuccess: () => {
      setLocked(false)
      router.replace('/(app)/(tabs)')
    },
    onError: (error: unknown) => {
      console.error('Unlock Error:', error)
      const lockTypeLabel = currentLockType === 'password' ? 'password' : 'PIN'
      Alert.alert(
        t`Unlock failed`,
        t`Invalid ${lockTypeLabel}. Please try again.`
      )
      // Clear form
      if (currentLockType === 'password') {
        passwordForm.reset()
      } else {
        pinForm.reset()
      }
    },
  })

  // Security answer mutation
  const securityAnswerMutation = useMutation({
    mutationFn: async (answer: string) => {
      const isValid = await verifySecurityAnswer(answer)
      if (!isValid) {
        throw new Error('Invalid security answer')
      }
    },
    onSuccess: () => {
      // Security answer verified, unlock
      setLocked(false)
      router.replace('/(app)/(tabs)')
    },
    onError: () => {
      Alert.alert(
        t`Verification failed`,
        t`Invalid security answer. Please try again.`
      )
      setSecurityAnswer('')
    },
  })

  const onSubmit = (data: UnlockPasswordFormData | UnlockPinFormData) => {
    unlockMutation.mutate(data)
  }

  const onSecurityAnswerSubmit = () => {
    if (!securityAnswer.trim()) {
      Alert.alert(t`Error`, t`Please enter your security answer`)
      return
    }
    securityAnswerMutation.mutate(securityAnswer)
  }

  if (!hasLockEnabled() || !hasLock) {
    return null
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
        >
          <Card className='border-border/0 shadow-none sm:border-border sm:shadow-sm sm:shadow-black/5'>
            <CardHeader className='items-center'>
              <View className='mb-4 rounded-full bg-muted p-4'>
                <Icon as={Lock} size={32} className='text-muted-foreground' />
              </View>
              <CardTitle className='text-center text-xl'>
                <Trans>Unlock Your Diary</Trans>
              </CardTitle>
              <CardDescription className='text-center'>
                <Trans>Enter your {lockTypeLabel} to access your diary</Trans>
              </CardDescription>
            </CardHeader>
            <CardContent className='gap-6'>
              {!showSecurityQuestion ? (
                <>
                  {currentLockType === 'password' ? (
                    <Form {...passwordForm}>
                      <View className='gap-6'>
                        {/* Password Field */}
                        <FormField
                          control={passwordForm.control}
                          name='password'
                          render={({ field }) => (
                            <FormInput
                              {...field}
                              name='password'
                              label={t`Password`}
                              ref={passwordInputRef}
                              placeholder={t`Enter your password`}
                              secureTextEntry={!showPassword}
                              keyboardType='default'
                              returnKeyType='send'
                              onSubmitEditing={passwordForm.handleSubmit(
                                onSubmit
                              )}
                              rightIcon={
                                <Button
                                  variant='ghost'
                                  size='icon'
                                  onPress={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? (
                                    <Icon
                                      as={EyeOff}
                                      className='text-muted-foreground'
                                    />
                                  ) : (
                                    <Icon
                                      as={Eye}
                                      className='text-muted-foreground'
                                    />
                                  )}
                                </Button>
                              }
                            />
                          )}
                        />

                        {/* Unlock Button */}
                        <Button
                          className='w-full bg-primary'
                          onPress={passwordForm.handleSubmit(onSubmit)}
                          loading={
                            unlockMutation.isPending ||
                            passwordForm.formState.isSubmitting
                          }
                        >
                          <Text>
                            {unlockMutation.isPending ? (
                              <Trans>Unlocking...</Trans>
                            ) : (
                              <Trans>Unlock</Trans>
                            )}
                          </Text>
                        </Button>
                      </View>
                    </Form>
                  ) : (
                    <Form {...pinForm}>
                      <View className='gap-6'>
                        {/* PIN Field */}
                        <FormField
                          control={pinForm.control}
                          name='pin'
                          render={({ field }) => (
                            <FormInput
                              {...field}
                              name='pin'
                              label={t`PIN`}
                              ref={passwordInputRef}
                              placeholder={t`Enter your PIN`}
                              secureTextEntry
                              keyboardType='numeric'
                              maxLength={4}
                              returnKeyType='send'
                              onSubmitEditing={pinForm.handleSubmit(onSubmit)}
                            />
                          )}
                        />

                        {/* Unlock Button */}
                        <Button
                          className='w-full bg-primary'
                          onPress={pinForm.handleSubmit(onSubmit)}
                          loading={
                            unlockMutation.isPending ||
                            pinForm.formState.isSubmitting
                          }
                        >
                          <Text>
                            {unlockMutation.isPending ? (
                              <Trans>Unlocking...</Trans>
                            ) : (
                              <Trans>Unlock</Trans>
                            )}
                          </Text>
                        </Button>
                      </View>
                    </Form>
                  )}

                  {/* Biometric Button */}
                  {biometricEnabled && biometricAvailable && (
                    <>
                      <View className='flex-row items-center'>
                        <View className='flex-1 border-t border-border' />
                        <Text className='px-4 text-sm text-muted-foreground'>
                          <Trans>or</Trans>
                        </Text>
                        <View className='flex-1 border-t border-border' />
                      </View>
                      <Button
                        variant='outline'
                        className='w-full'
                        onPress={handleBiometricAuth}
                      >
                        <Icon
                          as={Fingerprint}
                          className='mr-2 text-foreground'
                        />
                        <Text>
                          <Trans>Use Biometric</Trans>
                        </Text>
                      </Button>
                    </>
                  )}

                  {/* Security Question Link */}
                  {securityQuestion && (
                    <Button
                      variant='link'
                      size='sm'
                      onPress={() => setShowSecurityQuestion(true)}
                    >
                      <Text className='text-sm'>
                        <Trans>Forgot {lockTypeLabel}?</Trans>
                      </Text>
                    </Button>
                  )}
                </>
              ) : (
                <View className='gap-6'>
                  <View className='gap-2'>
                    <Text className='text-sm font-medium'>
                      <Trans>Security Question</Trans>
                    </Text>
                    <Text className='text-sm text-muted-foreground'>
                      {securityQuestion}
                    </Text>
                  </View>

                  <View className='gap-2'>
                    <Text className='text-sm font-medium'>
                      <Trans>Your Answer</Trans>
                    </Text>
                    <View className='rounded-lg border border-input bg-background px-3 py-2'>
                      <TextInput
                        value={securityAnswer}
                        onChangeText={setSecurityAnswer}
                        placeholder={t`Enter your answer`}
                        secureTextEntry
                        autoCapitalize='none'
                        className='text-foreground'
                        onSubmitEditing={onSecurityAnswerSubmit}
                        returnKeyType='send'
                      />
                    </View>
                  </View>

                  <Button
                    className='w-full bg-primary'
                    onPress={onSecurityAnswerSubmit}
                    loading={securityAnswerMutation.isPending}
                  >
                    <Text>
                      {securityAnswerMutation.isPending ? (
                        <Trans>Verifying...</Trans>
                      ) : (
                        <Trans>Verify Answer</Trans>
                      )}
                    </Text>
                  </Button>

                  <Button
                    variant='link'
                    size='sm'
                    onPress={() => {
                      setShowSecurityQuestion(false)
                      setSecurityAnswer('')
                    }}
                  >
                    <Text className='text-sm'>
                      <Trans>Back to {lockTypeLabel}</Trans>
                    </Text>
                  </Button>
                </View>
              )}
            </CardContent>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
